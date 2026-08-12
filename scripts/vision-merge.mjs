/* Fold the readers' slices into the vision index.
 *
 *   node scripts/vision-merge.mjs [--in DIR]
 *
 * The readers are subagents working a slice each, so this is where
 * their JSON becomes one file and where it gets checked. Two things are
 * enforced, both for the same reason the facts index enforces
 * citations: an index is only worth what it can be trusted to have
 * meant.
 *
 * FACET TERMS ARE VALIDATED against the site's vocabulary and unknown
 * ones are DROPPED, not coerced. A reader that answers "brushed brass"
 * where the vocabulary says "brass" has written something the matcher
 * will never find, and silently keeping it would grow an index nobody
 * can query. Dropped terms are counted and reported, because a term
 * that keeps getting dropped is either a reader misreading its brief or
 * a real gap in the vocabulary.
 *
 * FREE FIELDS ARE KEPT AS WRITTEN. subjects, texture_mix and contrast
 * are where the read layer lives and where new vocabulary comes from,
 * so they are never filtered — only tallied, so the frequent ones can
 * be promoted deliberately.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { FACETS } from "./lib/vocabulary.mjs";
import { DENSITY, PALETTE_LOGIC, LIGHT, KINDS } from "./lib/vision-schema.mjs";

const argv = process.argv.slice(2);
const inAt = argv.indexOf("--in");
const IN = inAt >= 0 ? argv[inAt + 1] : "/tmp/rhs-vision/out";
const VISION = "src/data/generated/image-vision.json";
const PUBLIC = "public";

const vocab = (f) => new Set(FACETS[f].map((t) => t[0]));
const V = {
  material: vocab("material"), furniture: vocab("furniture"),
  style: vocab("style"), room: vocab("room"),
};
const oneOf = (list, v) => (list.includes(v) ? v : undefined);
const arr = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()) : []);
const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : "");

const dropped = new Map();
function facet(name, value) {
  const out = [];
  for (const t of arr(value)) {
    const k = t.toLowerCase().trim();
    if (V[name].has(k)) out.push(k);
    else dropped.set(name + ":" + k, (dropped.get(name + ":" + k) || 0) + 1);
  }
  return [...new Set(out)];
}

const index = existsSync(VISION)
  ? JSON.parse(readFileSync(VISION, "utf8"))
  : { model: "in-session", images: {} };

let added = 0, skipped = 0;
const files = existsSync(IN) ? readdirSync(IN).filter((f) => f.endsWith(".json") && !f.startsWith("._")) : [];

for (const f of files) {
  let slice;
  try { slice = JSON.parse(readFileSync(join(IN, f), "utf8")); }
  catch { console.warn(`  unreadable: ${f}`); continue; }
  const records = Array.isArray(slice) ? slice : slice.records || [];
  for (const r of records) {
    const src = str(r.src);
    if (!src || !existsSync(join(PUBLIC, src))) { skipped++; continue; }
    const roomRaw = str(r.room).toLowerCase();
    index.images[src] = {
      hash: createHash("sha1").update(readFileSync(join(PUBLIC, src))).digest("hex").slice(0, 16),
      kind: oneOf(KINDS, str(r.kind)) || "photograph",
      room: V.room.has(roomRaw) ? roomRaw : null,
      materials: facet("material", r.materials),
      furniture: facet("furniture", r.furniture),
      style: facet("style", r.style),
      colours: arr(r.colours),
      palette: arr(r.palette).filter((h) => /^#[0-9a-f]{6}$/i.test(h)),
      subjects: arr(r.subjects),
      text: arr(r.text),
      mood: arr(r.mood),
      /* the read layer */
      density: oneOf(DENSITY, str(r.density)),
      texture_mix: arr(r.texture_mix),
      contrast: arr(r.contrast),
      palette_logic: oneOf(PALETTE_LOGIC, str(r.palette_logic)),
      light: oneOf(LIGHT, str(r.light)),
      focal: str(r.focal),
      balance: str(r.balance),
      composition: str(r.composition),
      confidence: oneOf(["high", "medium", "low"], str(r.confidence)) || "medium",
    };
    added++;
  }
}

writeFileSync(VISION, JSON.stringify(index, null, 1));

const total = Object.keys(index.images).length;
console.log(`slices read   ${files.length}`);
console.log(`records in    ${added}${skipped ? `, ${skipped} skipped (unknown src)` : ""}`);
console.log(`index holds   ${total} frames`);

/* what the readers reached for that the vocabulary does not have */
const tally = (field) => {
  const m = new Map();
  for (const rec of Object.values(index.images))
    for (const t of rec[field] || []) m.set(t, (m.get(t) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};
const show = (label, rows, min) => {
  const hits = rows.filter(([, n]) => n >= min);
  if (!hits.length) return;
  console.log(`\n${label}`);
  for (const [t, n] of hits.slice(0, 18)) console.log(`  ${String(n).padStart(3)}  ${t}`);
};
show("contrast relationships seen 3+ times:", tally("contrast"), 3);
show("textures named 3+ times:", tally("texture_mix"), 3);
show("subjects seen 5+ times (facet candidates):", tally("subjects"), 5);

if (dropped.size) {
  console.log(`\nterms dropped as outside the vocabulary:`);
  for (const [k, n] of [...dropped.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15))
    console.log(`  ${String(n).padStart(3)}  ${k}`);
}
