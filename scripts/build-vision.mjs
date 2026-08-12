/* Look at every image in the portfolio and write down what is in it.
 *
 *   node scripts/build-vision.mjs --dry       what would be sent, and what it costs
 *   node scripts/build-vision.mjs --submit    downscale, submit, record the batch ids
 *   node scripts/build-vision.mjs --fetch     poll, merge results, write the index
 *   node scripts/build-vision.mjs             submit, then poll to completion
 *
 * WHY THIS EXISTS, given that the vocabulary file already says no vision
 * model was needed. That claim was true of the facts it was making at the
 * time and is false of the portfolio as a whole, because alt text quality
 * is wildly uneven and nobody noticed:
 *
 *   hill-country-living  "Vertical detail of the limestone wall with the
 *                         ladder shelf holding a vintage globe, brass
 *                         fireplace tools below, and the corner of a tweed
 *                         armchair"                    <- nothing to add
 *   arc                  "A.R.C. scanning a living room, items found and
 *                         valued"                      <- describes the
 *                         PRODUCT. The photograph itself holds a limestone
 *                         wall, a fireplace, western art in gilt frames, a
 *                         turntable, crates of vinyl, brass candlesticks, a
 *                         marble table, a cactus. Fifteen retrievable
 *                         things; the index knows one.
 *
 * Alt text describes what an image is FOR. This describes what is IN it.
 * Where a study's alt text is already good the pass costs a few cents and
 * confirms it; where the alt text is a caption about intent, it is the
 * difference between an invisible image and a findable one.
 *
 * THE RULE THIS FILE EXISTS TO ENFORCE, inherited from build-facts.mjs:
 * every observation is attributable. A fact mined from copy cites the
 * sentence; a fact observed here cites the image it was seen in, and is
 * marked `observed` so nothing downstream can quote it as something the
 * work SAYS. The model is instructed to record only what is visible — no
 * intent, no outcome, no praise. Those are Jeremy's to write.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import sharp from "sharp";
import { FACETS } from "./lib/vocabulary.mjs";
import { studyFiles, loadStudy, strings } from "./lib/walk-studies.mjs";

const OUT = "src/data/generated/image-vision.json";
const STATE = "src/data/generated/.vision-batches.json";
const PUBLIC = "public";

/* One-time pass over a fixed corpus, so it runs on the best model rather
   than the cheapest: these observations become permanent index data and a
   wrong one is wrong forever. Runtime uses Haiku; this is not runtime. */
const MODEL = "claude-opus-5";

/* 1024px on the long edge. Vision tokens scale with pixels and the source
   files run to 3840px, so sending them raw would cost roughly 9x for
   detail no retrieval query will ever ask for. */
const EDGE = 1024;

/* Batches cap at 256MB. Base64 inflates by 4/3, so ~150KB a frame lands
   around 113MB for the full run — under the cap, but a single rejected
   batch would waste the whole submission, so it goes in slices. */
const SLICE = 150;

const argv = process.argv.slice(2);
const DRY = argv.includes("--dry");
const SUBMIT = argv.includes("--submit");
const FETCH = argv.includes("--fetch");

/* ── the corpus ────────────────────────────────────────────────────
   Enumerated from the studies rather than from the filesystem, so an
   image nobody renders is not paid for, and every frame arrives already
   knowing its study, its alt text and where in the page it sits.

   Found with the same strings() walk build-facts.mjs uses, and for the
   same stated reason: a hand-written walk that looks for `node.src`
   silently misses every image held as a bare string — reel frames,
   markImage, patternLibrary, logoConstructionImage. The first cut of
   this file did exactly that and undercounted by a third while looking
   perfectly plausible. Walk every string, keep the ones that end in an
   image extension, and a new section type is covered the day it ships. */
const IMAGE = /\.(jpe?g|png|webp)$/i;

async function corpus() {
  const seen = new Map();
  for (const file of studyFiles()) {
    const study = await loadStudy(file);

    /* alt text lives beside src only when the image is an OBJECT; the
       bare-string cases have no caption to find, and say so honestly
       rather than borrowing the neighbouring one. */
    const alts = new Map();
    const pairs = (node) => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) return node.forEach(pairs);
      if (typeof node.src === "string" && typeof node.alt === "string") alts.set(node.src, node.alt);
      Object.values(node).forEach(pairs);
    };
    pairs(study.sections);

    for (const { path, value } of strings(study.sections)) {
      if (!IMAGE.test(value) || seen.has(value)) continue;
      seen.set(value, {
        src: value,
        slug: study.slug,
        title: study.title,
        alt: alts.get(value) || "",
        where: path,
      });
    }
  }
  return [...seen.values()].filter((im) => existsSync(join(PUBLIC, im.src)));
}

/* Content hash, so re-running after adding one study re-reads one study.
   Keyed on the bytes rather than the path: a re-export under the same
   name is a different image and must be looked at again. */
function hashOf(src) {
  return createHash("sha1").update(readFileSync(join(PUBLIC, src))).digest("hex").slice(0, 16);
}

/* ── what to write down ────────────────────────────────────────────
   Two registers, deliberately separated.

   The FACET fields take the site's existing controlled vocabulary, so an
   observation lands in the same bucket a mined fact would and the two are
   searchable by one query. The FREE fields take whatever the picture
   actually holds — "turntable", "cactus", "gilt frame" — which is how the
   vocabulary learns: a free term that shows up across thirty images is a
   facet the site should have, and the report prints it as a candidate
   rather than silently dropping it. */
const vocab = (f) => FACETS[f].map((t) => t[0]);

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["kind", "materials", "furniture", "style", "colours", "palette",
             "subjects", "text", "mood", "composition", "confidence"],
  properties: {
    kind: {
      type: "string",
      enum: ["photograph", "screenshot", "artwork", "mockup", "specimen",
             "pattern", "logo", "diagram"],
    },
    room: { type: ["string", "null"], enum: [...vocab("room"), null] },
    materials: { type: "array", items: { type: "string", enum: vocab("material") } },
    furniture: { type: "array", items: { type: "string", enum: vocab("furniture") } },
    style: { type: "array", items: { type: "string", enum: vocab("style") } },
    /* named colours in plain words — "rust", "fuchsia" — not the facet
       list, which holds only the six this portfolio treats as materials */
    colours: { type: "array", items: { type: "string" } },
    /* the three or four hexes the frame is actually built from, so a
       palette question can be answered from the photograph rather than
       from the swatch the study happened to declare */
    palette: { type: "array", items: { type: "string" } },
    /* free nouns: everything present that the vocabulary has no word for */
    subjects: { type: "array", items: { type: "string" } },
    /* legible text — signage, packaging, book spines, UI labels. Nothing
       else in the pipeline can read these, and they are often the most
       specific searchable thing in the frame. */
    text: { type: "array", items: { type: "string" } },
    mood: { type: "array", items: { type: "string" } },
    composition: { type: "string" },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
  },
};

const SYSTEM = `You catalogue photographs for a design studio's search index.

Record ONLY what is visibly present in the image. This is the whole job and
the one rule that matters.

Do not record why something was made, what it achieved, whether it works, or
whether it is good. Do not infer a client, a date, a budget or an outcome. Do
not repeat the caption you are given as though you saw it — the caption is
context for disambiguation only, and it is sometimes about the product rather
than the picture.

If you cannot see something clearly, leave it out and lower your confidence.
An empty array is a correct answer. A guess is not.

FIELD NOTES

kind         what the file IS. A phone held in a hand photographed on a table
             is a photograph; a captured app screen is a screenshot; a flat
             export of artwork is artwork; a rendered product shot placed on a
             surface is a mockup.
materials,   these take a FIXED vocabulary. Use a term only when the material
furniture,   or object is actually visible. Do not stretch: a wooden floor is
style, room  wood, it is not oak unless the grain says oak.
colours      plain names for what you see: rust, fuchsia, camel, sage.
palette      three to five hex values the image is actually built from,
             sampled from large areas rather than specks.
subjects     everything present that the fixed lists have no word for. Be
             specific and concrete: "turntable", "vinyl crate", "cactus",
             "gilt frame", "pampas grass". These become new vocabulary.
text         transcribe any legible text: signage, packaging, book spines,
             posters, UI labels, logotypes. Verbatim. Omit anything you
             cannot actually read rather than completing it from memory.
mood         two or three words for the register of the image: quiet, kinetic,
             editorial, austere, warm.
composition  one plain sentence on how the frame is built — vantage, symmetry,
             where the light comes from, what dominates.`;

function requestFor(im, b64) {
  return {
    custom_id: `img_${hashOf(im.src)}`,
    params: {
      model: MODEL,
      max_tokens: 1200,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
          {
            type: "text",
            text: `Catalogue this image.\n\nContext (for disambiguation only — do not treat as observation):\n`
              + `project: ${im.title}\ncaption: ${im.alt || "(none)"}`,
          },
        ],
      }],
    },
  };
}

async function encode(src) {
  return (await sharp(join(PUBLIC, src))
    .resize(EDGE, EDGE, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer()).toString("base64");
}

const readJSON = (p, fb) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fb);

async function main() {
  mkdirSync("src/data/generated", { recursive: true });
  const images = await corpus();
  const done = readJSON(OUT, { model: MODEL, images: {} });
  const todo = images.filter((im) => {
    const rec = done.images[im.src];
    return !rec || rec.hash !== hashOf(im.src);
  });

  console.log(`corpus        ${images.length} images across ${new Set(images.map((i) => i.slug)).size} studies`);
  console.log(`already read  ${images.length - todo.length}`);
  console.log(`to look at    ${todo.length}`);

  if (!todo.length) { console.log("nothing to do"); return; }

  if (DRY) {
    /* Sized from the real encode, not a guess: one downscale tells us the
       byte cost of all of them closely enough to decide. */
    const sample = await encode(todo[0].src);
    const kb = (sample.length * 3) / 4 / 1024;
    const imgTok = Math.round((EDGE * EDGE) / 750);
    const inTok = todo.length * (imgTok + 900);
    const outTok = todo.length * 350;
    const usd = (inTok / 1e6) * 5 + (outTok / 1e6) * 25;
    console.log(`\nper frame     ~${Math.round(kb)}KB encoded, ~${imgTok} image tokens`);
    console.log(`payload       ~${Math.round((kb * todo.length) / 1024)}MB over ${Math.ceil(todo.length / SLICE)} batches`);
    console.log(`estimate      $${usd.toFixed(2)} at list, $${(usd / 2).toFixed(2)} batched`);
    return;
  }

  const client = new Anthropic();
  const state = readJSON(STATE, { batches: [] });

  if (!FETCH || SUBMIT) {
    for (let i = 0; i < todo.length; i += SLICE) {
      const slice = todo.slice(i, i + SLICE);
      const requests = [];
      for (const im of slice) requests.push(requestFor(im, await encode(im.src)));
      const batch = await client.messages.batches.create({ requests });
      state.batches.push({ id: batch.id, ids: Object.fromEntries(slice.map((im) => [`img_${hashOf(im.src)}`, im.src])) });
      console.log(`submitted     ${batch.id} (${slice.length} frames)`);
    }
    writeFileSync(STATE, JSON.stringify(state, null, 2));
  }

  if (SUBMIT) { console.log("\nrun --fetch when the batches end"); return; }

  /* Poll. Batches usually land well inside an hour; the cap is 24. */
  const pending = new Set(state.batches.map((b) => b.id));
  while (pending.size) {
    for (const id of [...pending]) {
      const b = await client.messages.batches.retrieve(id);
      if (b.processing_status !== "ended") continue;
      pending.delete(id);
      const map = state.batches.find((x) => x.id === id).ids;
      let ok = 0, bad = 0;
      for await (const r of await client.messages.batches.results(id)) {
        const src = map[r.custom_id];
        if (r.result.type !== "succeeded") { bad++; continue; }
        const block = r.result.message.content.find((c) => c.type === "text");
        if (!block) { bad++; continue; }
        try {
          done.images[src] = { hash: hashOf(src), ...JSON.parse(block.text) };
          ok++;
        } catch { bad++; }
      }
      console.log(`read          ${id}: ${ok} ok${bad ? `, ${bad} failed` : ""}`);
      writeFileSync(OUT, JSON.stringify(done, null, 1));
    }
    if (pending.size) await new Promise((r) => setTimeout(r, 20000));
  }

  writeFileSync(STATE, JSON.stringify({ batches: [] }, null, 2));

  /* Vocabulary candidates: free terms seen often enough to deserve a
     facet. This is the pass paying rent twice — the observations enrich
     retrieval now, and the tally says what the vocabulary is missing. */
  const tally = new Map();
  for (const rec of Object.values(done.images))
    for (const s of rec.subjects || []) tally.set(s, (tally.get(s) || 0) + 1);
  const candidates = [...tally.entries()].filter(([, n]) => n >= 8).sort((a, b) => b[1] - a[1]);
  console.log(`\nwrote         ${OUT} (${Object.keys(done.images).length} images)`);
  if (candidates.length) {
    console.log(`\nvocabulary candidates — free terms seen 8+ times:`);
    for (const [t, n] of candidates.slice(0, 25)) console.log(`  ${String(n).padStart(3)}  ${t}`);
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
