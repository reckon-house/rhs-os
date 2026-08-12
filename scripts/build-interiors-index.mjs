/* Derive the interiors system index from what the studies already hold.
 *
 *   node scripts/build-interiors-index.mjs [--check]
 *
 * The brand ledger (Mark / Typeface / Palette / Pattern library) does not
 * survive contact with a room. Three interiors studies were forced into
 * it by stuffing MATERIALS INTO THE `fonts` FIELD, so Hill Country
 * Livingroom shipped "Limestone" as a type specimen set in Caslon — a
 * face nobody put in that house, proving nothing about anything. The
 * other five studies carried no section at all, because there was
 * nothing honest to put in a brand ledger.
 *
 * Three rows instead, and every one of them already had a source:
 *
 *   MATERIALS  the study's own authored `summary` Materials line
 *   TEXTURE    image-vision.json's texture_mix, verbatim
 *   PALETTE    the study's authored palette, named where a section
 *              named it, bare hexes from the cover reel otherwise
 *
 * NOTHING HERE INVENTS A VALUE. That is the whole reason it is a
 * generator rather than eight hand-written blocks: the swatch ledger it
 * replaces shipped 49 hexes that were an arithmetic ramp typed by hand,
 * under a header reading "as specified". Deriving from authored fields
 * makes that failure impossible to repeat quietly — if a study has no
 * Materials line, this prints a gap rather than filling one.
 *
 * --check exits non-zero on any gap, for CI.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { studyFiles, loadStudy } from "./lib/walk-studies.mjs";

const VISION = "src/data/generated/image-vision.json";
const OUT = "src/data/generated/interiors-index.json";
const CHECK = process.argv.includes("--check");

/* The texture crop's sampling budget. The box is 190 CSS px and a
   retina screen wants 2x that, so a crop may only magnify as far as the
   source file can actually feed. Exceeding it does not error — it just
   goes soft, which is why the number lives here and gets enforced per
   frame rather than being picked by eye per study. */
const BOX = 190;
const DPR = 2;
const ZOOM_MAX = 2.8;
const ZOOM_MIN = 1.9;

const vision = existsSync(VISION)
  ? JSON.parse(readFileSync(VISION, "utf8")).images
  : {};

/* ── material names out of the authored line ──────────────────────
   "Limestone, reclaimed 1950s pine, cognac leather, charcoal tweed,
   antiqued brass." → five names.

   Studies end the line with a thesis clause ("Four finishes, every
   surface.", "Nothing chasing trend.") — those are the study talking
   about its palette rather than naming a part of it, so a fragment with
   no material noun in it is dropped rather than shown as a material. */
/* A clause with no material in it at all. "Four finishes, every surface"
   is the study talking ABOUT its palette, not naming a part of it.
   Deliberately narrow: an earlier cut also killed "Three marbles", which
   is a material and left Hill Country Bath showing two rows. */
const NOT_A_MATERIAL =
  /^(four|five|six|every|nothing|no|all|one|each|the same)\s|^(finishes|surfaces)$/i;

function materialNames(line) {
  return String(line)
    .split(/[,.]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2 && s.length < 46 && !NOT_A_MATERIAL.test(s))
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .slice(0, 6);
}

/* Modifiers, not materials. "Reclaimed 1950s pine" is found in a frame
   that says pine; nothing is found by searching for "reclaimed". */
const STOP = new Set([
  "reclaimed", "raw", "warm", "dark", "light", "lighter", "antiqued",
  "polished", "unlacquered", "vintage", "stacked", "painted", "honed",
  "brushed", "matte", "classic", "three", "full", "soft", "foot", "and",
  "the", "with", "cream", "green", "grey", "gray",
]);

/* Every content word, longest first, singularised. Matching on the LAST
   word alone lost "Three marbles" (marbles), "lighter sage cabinetry"
   (cabinetry) and "reclaimed 1950s pine" — the head noun is not reliably
   final in a designer's phrasing, so all of them get tried. */
function nouns(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map((w) => (w.endsWith("es") && w.length > 5 ? w.slice(0, -2)
               : w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w))
    .sort((a, b) => b.length - a.length);
}

/* ── frames ───────────────────────────────────────────────────────── */
const DETAIL = /detail|closeup|close-up|vignette|macro/i;

function framesFor(dir) {
  return Object.entries(vision)
    .filter(([src]) => src.includes(`/${dir}/`))
    .map(([src, rec]) => ({ src, ...rec }));
}

/* How well a frame evidences a material: its own facet terms first,
   then the textures the reader named, then the filename the
   photographer wrote. A frame that never mentions the material is not
   evidence for it and scores zero. */
function scoreFrame(frame, ns) {
  /* The reader's prose counts as evidence too, at a lower weight.
     "Sage green" was reported as appearing in no frame while sitting in
     43 of them, because sage is a COLOUR name and the scorer only read
     the material and texture fields. A material named for its colour is
     normal in interiors and the index has to find it. */
  const prose = [frame.focal, frame.balance, frame.composition]
    .filter(Boolean).join(" ").toLowerCase();
  let best = 0;
  for (const noun of ns) {
    const inFacet = (frame.materials || []).some((m) => m.includes(noun) || noun.includes(m));
    const inTex = (frame.texture_mix || []).some((t) => t.toLowerCase().includes(noun));
    const inCol = (frame.colours || []).some((c) => c.toLowerCase().includes(noun));
    const inSub = (frame.subjects || []).some((s) => s.toLowerCase().includes(noun));
    const inName = frame.src.toLowerCase().includes(noun);
    const inProse = prose.includes(noun);
    best = Math.max(best, (inFacet ? 4 : 0) + (inTex ? 3 : 0) + (inCol ? 3 : 0)
      + (inSub ? 2 : 0) + (inName ? 2 : 0) + (inProse ? 1 : 0));
  }
  return best;
}

/* Which material a texture reading is ABOUT, so the row does not spend
   three of its six slots on limestone. Reads the phrase against the
   site's own facet vocabulary rather than guessing at grammar. */
const MATERIAL_WORDS = [
  "limestone", "marble", "stone", "brick", "plaster", "tile", "ceramic",
  "leather", "hide", "velvet", "wool", "tweed", "linen", "bouclé", "boucle",
  "shearling", "sheepskin", "oak", "pine", "walnut", "cedar", "timber",
  "wood", "brass", "copper", "nickel", "steel", "iron", "glass", "paint",
  "lacquer", "veneer", "concrete", "clay", "rattan", "cane", "gilt",
];
function aboutWhat(phrase) {
  const p = phrase.toLowerCase();
  return MATERIAL_WORDS.find((w) => p.includes(w)) || p.split(/\s+/)[0];
}

/* ── palettes ─────────────────────────────────────────────────────
   Named beats bare. A section that authored {name, hex} pairs gets to
   caption its swatches; a study whose only declared palette is the
   cover reel's hex list gets the hexes alone, which is thinner and
   true. Neither is derived from pixels — both were authored. */
function paletteOf(study) {
  let named = null;
  let bare = null;
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(walk);
    const c = node.colors;
    if (Array.isArray(c) && c.length) {
      if (!named && typeof c[0] === "object" && c[0]?.hex) {
        named = c.filter((x) => x?.hex).map((x) => ({ name: x.name || "", hex: x.hex }));
      } else if (!bare && typeof c[0] === "string" && /^#[0-9a-f]{6}$/i.test(c[0])) {
        bare = c.filter((h) => /^#[0-9a-f]{6}$/i.test(h)).map((hex) => ({ name: "", hex }));
      }
    }
    Object.values(node).forEach(walk);
  };
  walk(study.sections);
  return (named || bare || []).slice(0, 6);
}

/* ── the build ────────────────────────────────────────────────────── */
const dims = readFileSync("src/data/image-dimensions.ts", "utf8");
const DIM = new Map();
for (const m of dims.matchAll(/"([^"]+\.(?:jpe?g|png|webp|avif))":\s*\[(\d+),\s*(\d+)\]/gi)) {
  DIM.set(m[1], [+m[2], +m[3]]);
}

const out = {};
const gaps = [];

for (const file of studyFiles()) {
  const study = await loadStudy(file);
  /* category is {label, href}, not a string — reading it as one silently
     matched nothing and reported zero interiors studies. */
  const cat = study.category?.label ?? study.category;
  if (cat !== "Interiors") continue;

  const slug = study.slug;
  /* The image directory is NOT the slug. fairview-suite keeps its
     photographs under /case-studies/fairview-bedroom, and a survey that
     assumed otherwise reported that study as having zero frames. Read
     the directory off a real src instead of deriving it. */
  const anySrc = JSON.stringify(study.sections).match(
    /\/case-studies\/([a-z0-9-]+)\/[^"]+\.(?:jpe?g|png|webp|avif)/i
  );
  const dir = anySrc ? anySrc[1] : slug;
  const frames = framesFor(dir);

  /* An authored list wins over the prose line. Three studies name where
     each material is used ("Floors, beams, mantel"), which no amount of
     parsing recovers from a comma-separated sentence, and only the
     location half ever needs writing. */
  const authored = study.sections.find(
    (s) => s.type === "interiors-index" && Array.isArray(s.materials) && s.materials.length
  )?.materials;

  const matLine = (study.sections
    .flatMap((s) => s.summary || [])
    .find((r) => r?.label === "Materials") || {}).value;

  if (!authored && !matLine) { gaps.push(`${slug}: no authored Materials line`); continue; }
  if (!frames.length) { gaps.push(`${slug}: no catalogued frames under /${dir}/`); continue; }

  /* MATERIALS — each authored name shown in the frame that best
     evidences it, no frame used twice so the row cycles a room rather
     than one photograph five times. */
  const used = new Set();
  const materials = [];
  const list = authored?.length
    ? authored.map((m) => ({ name: m.name, role: m.role }))
    : materialNames(matLine).map((name) => ({ name }));

  for (const { name, role } of list) {
    const ns = nouns(name);
    if (!ns.length) continue;
    const best = frames
      .filter((f) => !used.has(f.src))
      .map((f) => ({ f, s: scoreFrame(f, ns) }))
      .sort((a, b) => b.s - a.s)[0];
    /* No frame mentions it, so no frame is evidence for it. Dropping is
       the honest move; the gap gets reported rather than papered over
       with whichever photograph happened to be next. */
    if (!best || best.s === 0) { gaps.push(`${slug}: "${name}" in no frame`); continue; }
    used.add(best.f.src);
    materials.push({ name: role ? `${name} · ${role}` : name, src: best.f.src });
  }

  /* TEXTURE — one reading per frame, verbatim, detail frames first.
     Deduped on the opening words because two frames of the same corner
     describe the same surface twice. */
  const seen = new Set();
  const textures = [];
  const ordered = [...frames].sort(
    (a, b) => (DETAIL.test(b.src) ? 1 : 0) - (DETAIL.test(a.src) ? 1 : 0)
  );
  for (const f of ordered) {
    for (const t of f.texture_mix || []) {
      /* Keyed on the MATERIAL, not the opening words. Keying on the
         first three words let Hill Country Livingroom spend three of
         six slots on limestone, because "pitted, chiselled limestone",
         "chalky sawn limestone" and "rough-cut limestone block" all
         open differently and all say the same thing. */
      const key = aboutWhat(t);
      if (seen.has(key)) continue;
      seen.add(key);
      const native = (DIM.get(f.src) || [])[0] || 0;
      /* the crop may only reach as far as the file can feed */
      const ceiling = native ? native / (BOX * DPR) : ZOOM_MIN;
      const zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, +ceiling.toFixed(2)));
      textures.push({
        cap: t[0].toUpperCase() + t.slice(1),
        src: f.src,
        zoom,
        native,
        /* Centre by default. A focal point guessed from a caption is
           exactly the almost-true the kit refuses, so this stays honest
           until a human moves it. */
        at: "50% 50%",
      });
      break;
    }
    if (textures.length >= 6) break;
  }

  const palette = paletteOf(study);
  if (!palette.length) gaps.push(`${slug}: no authored palette`);

  out[slug] = { title: study.title, dir, materials, textures, palette };
}

writeFileSync(OUT, JSON.stringify(out, null, 1));

const slugs = Object.keys(out);
console.log(`interiors studies  ${slugs.length}`);
for (const s of slugs) {
  const r = out[s];
  const soft = r.textures.filter((t) => t.native && t.zoom * BOX * DPR > t.native);
  console.log(
    `  ${s.padEnd(22)} materials=${String(r.materials.length).padStart(2)}` +
    ` textures=${String(r.textures.length).padStart(2)}` +
    ` palette=${String(r.palette.length).padStart(2)}` +
    `${r.palette[0]?.name ? " (named)" : " (hexes)"}` +
    `${soft.length ? `  SOFT:${soft.length}` : ""}`
  );
}
console.log(`\nwrote ${OUT}`);

if (gaps.length) {
  console.log(`\ngaps:`);
  for (const g of gaps) console.log(`  ${g}`);
}
if (CHECK && gaps.length) process.exit(1);
