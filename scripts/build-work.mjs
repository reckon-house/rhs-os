/* Read each study and look at its pictures, and say what KIND of work it is.
 *
 *   node scripts/build-work.mjs --dry     what would be sent, and what it costs
 *   node scripts/build-work.mjs           read them, write the index
 *   node scripts/build-work.mjs --slug x  one study, for tuning
 *
 * WHY THIS EXISTS. The facets say what a study is MADE OF — marble, a
 * fireplace, a kitchen in west texas — and the index could always find
 * those. Nothing said what a study IS. Eight studies here are ecommerce
 * work and two of them use the word, so the honest answer to "ecommerce"
 * was two: the rest say store, retail, merchandising, or name the
 * retailer and leave the rest to the reader. Same for the logo work
 * (three studies, two findable), the typography, the photography.
 *
 * WHAT IT READS, and the reason it is cheap. The pictures were already
 * looked at: scripts/build-vision.mjs catalogued all 358 of them — what
 * is in the frame, what words are visible in it, whether it is a
 * photograph or a mockup. This pass does not send a single pixel. It
 * reads that catalogue beside the study's own prose and reasons over
 * the pair, which is the half nobody had written down. A laptop showing
 * a product grid with "ADD TO BAG" in it is ecommerce work whether or
 * not the copy ever says so, and the vision pass already recorded both
 * the laptop and the words.
 *
 * WHAT IT MAY CLAIM. A term earned here is a JUDGEMENT, not a fact
 * mined from a sentence and not a thing observed in a photograph, and
 * it is written down as its own kind so nothing downstream can quote it
 * as something the work says. That is the same rule build-vision.mjs
 * follows for observations and build-facts.mjs for citations: every
 * claim carries how it was come by. Each term rides with `why` — one
 * line naming the evidence — so a wrong call is visible in the file
 * rather than only in the answers.
 *
 * THE VOCABULARY IS CLOSED. Terms come from WORK in lib/vocabulary.mjs
 * and the schema will not accept anything else, so this can never
 * invent a discipline the house does not practise. What a study
 * DECLARES (its disciplines: "Ecommerce Design", "Logo System") is
 * folded in separately and exactly, by foldWork, where it is READ —
 * at build time, so editing an alias re-folds everything and can never
 * leave a stale term sitting in this file. This pass exists for what
 * is true and undeclared.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { WORK } from "./lib/vocabulary.mjs";

const FACTS = "src/data/generated/project-facts.json";
const VISION = "src/data/generated/image-vision.json";
const OUT = "src/data/generated/study-work.json";

/* One-time pass over a fixed corpus, on the same reasoning it took to
   catalogue the pictures: this becomes permanent index data and a wrong
   term is wrong until someone notices it in an answer. */
const MODEL = "claude-opus-5";

/* Opus list price, for the --dry estimate only. */
const IN_PER_M = 15, OUT_PER_M = 75;

const argv = process.argv.slice(2);
const DRY = argv.includes("--dry");
const ONE = (argv.find((a) => a.startsWith("--slug")) || "").split("=")[1]
  || (argv.includes("--slug") ? argv[argv.indexOf("--slug") + 1] : null);

const TERMS = WORK.map(([t]) => t);

const SYSTEM = `You are cataloguing a design portfolio so its own search can find things.

For one study you are given what the designer wrote about it and a catalogue of
its photographs — what is in each frame, what words are visible in it, and
whether it is a photograph, a mockup or a screen.

Return the kinds of work the study IS, from the fixed list. Judge it on the
evidence in front of you, both halves: the prose and the pictures.

RULES.

Only what the study actually is. A study that photographs a finished kitchen is
interior design; it is not photography unless the photography is the work.
Naming a retailer is not ecommerce. A picture of a laptop is not a website
unless the study made the site on it.

The pictures are evidence. A screen full of product tiles with prices and an
ADD TO BAG button is ecommerce whether or not the copy says the word. A mark
laid over a landscape is a logo. Words visible in a frame are quoted in the
catalogue under "text seen" and are often the plainest evidence there is.

Say why, in one line, naming what convinced you: a phrase from the prose, or
what is in a named frame. If you cannot say why, do not return the term.

Be complete but not generous. A study has two to six of these, rarely more.
Omit anything you are guessing at.`;

const SCHEMA = {
  type: "object",
  properties: {
    terms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          term: { type: "string", enum: TERMS },
          why: { type: "string", description: "one line, naming the evidence" },
          from: { type: "string", enum: ["prose", "pictures", "both"] },
        },
        required: ["term", "why", "from"],
        additionalProperties: false,
      },
    },
  },
  required: ["terms"],
  additionalProperties: false,
};

const readJSON = (p, fb) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fb);

/* What the study says about itself, then what its pictures hold. The
   picture digest is the vision pass's own words, trimmed to the fields
   that bear on what KIND of work this is: a room's materials do not,
   the words on a screen very much do. */
function briefFor(p, images) {
  const shots = images.map((im) => {
    const bits = [
      `  ${im.src.split("/").pop()}  [${im.kind || "image"}]`,
      im.subjects?.length && `    in frame: ${im.subjects.slice(0, 10).join(", ")}`,
      im.text?.length && `    text seen: ${im.text.slice(0, 12).map((t) => `"${t}"`).join(", ")}`,
      im.mood?.length && `    reads as: ${im.mood.join(", ")}`,
    ].filter(Boolean);
    return bits.join("\n");
  }).join("\n");

  return [
    `STUDY: ${p.title}`,
    p.subtitle && `What it is: ${p.subtitle}`,
    p.category && `Category: ${p.category}`,
    p.disciplines?.length && `Disciplines it declares: ${p.disciplines.join(", ")}`,
    p.tools?.length && `Tools: ${p.tools.join(", ")}`,
    ...(p.summary ?? []).map((s) => `${s.label}: ${s.value}`),
    p.text && `\nThe study, in its own words:\n${p.text}`,
    shots && `\nIts pictures, as catalogued:\n${shots}`,
  ].filter(Boolean).join("\n");
}

async function main() {
  const facts = readJSON(FACTS, null);
  if (!facts) throw new Error(`no ${FACTS} — run npm run facts first`);
  const vision = readJSON(VISION, { images: {} });
  if (!Object.keys(vision.images || {}).length) {
    console.error("  no image catalogue — run npm run vision first, or this reads prose alone");
  }

  /* every image belongs to the study whose folder it sits in */
  const byStudy = new Map();
  for (const [src, rec] of Object.entries(vision.images || {})) {
    const slug = /^\/case-studies\/([^/]+)\//.exec(src)?.[1];
    if (!slug) continue;
    if (!byStudy.has(slug)) byStudy.set(slug, []);
    byStudy.get(slug).push({ src, ...rec });
  }

  const done = readJSON(OUT, { model: MODEL, studies: {} });
  const studies = facts.projects.filter((p) => !ONE || p.slug === ONE);

  /* re-read a study when its prose or its pictures have changed */
  const hashOf = (brief) => createHash("sha1").update(brief).digest("hex").slice(0, 16);
  const jobs = studies.map((p) => {
    const brief = briefFor(p, byStudy.get(p.slug) || []);
    return { p, brief, hash: hashOf(brief) };
  }).filter((j) => ONE || done.studies[j.p.slug]?.hash !== j.hash);

  const chars = jobs.reduce((n, j) => n + j.brief.length + SYSTEM.length, 0);
  const inTok = Math.round(chars / 3.7);
  const outTok = jobs.length * 400;
  console.log(`studies       ${studies.length}, ${byStudy.size} with catalogued pictures`);
  console.log(`to read       ${jobs.length}`);
  console.log(`input         ~${inTok.toLocaleString()} tokens`);
  console.log(`cost          ~$${(inTok / 1e6 * IN_PER_M + outTok / 1e6 * OUT_PER_M).toFixed(2)} on ${MODEL}`);
  if (DRY) {
    if (jobs[0]) console.log(`\n── what one looks like ──\n${jobs[0].brief.slice(0, 1800)}\n…`);
    return;
  }
  if (!jobs.length) { console.log("nothing to do"); return; }

  const key = process.env.ANTHROPIC_API_KEY
    || (existsSync(".env.local") && (readFileSync(".env.local", "utf8").match(/^ANTHROPIC_API_KEY=(.+)$/m) || [])[1]);
  if (!key) throw new Error("no ANTHROPIC_API_KEY");
  const anthropic = new Anthropic({ apiKey: key.trim() });

  let read = 0;
  for (const j of jobs) {
    const r = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages: [{ role: "user", content: j.brief }],
    });
    const text = r.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) {
      console.error(`  ${j.p.slug}: unreadable answer, skipped`);
      continue;
    }
    const terms = (parsed.terms || []).filter((t) => TERMS.includes(t.term));
    done.studies[j.p.slug] = { hash: j.hash, terms };
    read += 1;
    console.log(`  ${j.p.slug.padEnd(28)} ${terms.map((t) => t.term).join(", ")}`);
  }

  done.model = MODEL;
  mkdirSync("src/data/generated", { recursive: true });
  writeFileSync(OUT, JSON.stringify(done, null, 1));
  console.log(`\nread          ${read} studies`);
  console.log(`wrote         ${OUT}`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
