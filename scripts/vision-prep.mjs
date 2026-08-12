/* Prepare the corpus for reading in-session.
 *
 *   node scripts/vision-prep.mjs [--out DIR] [--force]
 *
 * Downscales every image a study renders to a working copy and writes a
 * manifest of what still needs looking at. The readers are subagents in
 * this session rather than a batch endpoint, so the work here is about
 * making each frame cheap to open: a 3080px source costs several times
 * what a 1536px one does to read, and carries no detail a catalogue
 * entry will ever use.
 *
 * 1536 rather than 1024 on purpose. The read layer names textures
 * ("hammered copper", "loose weave") and transcribes text off book
 * spines and signage, and both of those are the first things to go when
 * an image is shrunk too far.
 *
 * Already-read frames are skipped by content hash, so this composes with
 * whatever has been read before — including the five records written by
 * hand earlier.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { studyFiles, loadStudy, strings } from "./lib/walk-studies.mjs";

const PUBLIC = "public";
const VISION = "src/data/generated/image-vision.json";
const IMAGE = /\.(jpe?g|png|webp)$/i;
const EDGE = 1536;

const argv = process.argv.slice(2);
const outAt = argv.indexOf("--out");
const OUT = outAt >= 0 ? argv[outAt + 1] : "/tmp/rhs-vision";
const FORCE = argv.includes("--force");

const hashOf = (src) =>
  createHash("sha1").update(readFileSync(join(PUBLIC, src))).digest("hex").slice(0, 16);

/* Same walk build-facts uses: every string that ends in an image
   extension, so a frame held as a bare string in a reel or a
   patternLibrary is found like any other. */
async function corpus() {
  const seen = new Map();
  for (const file of studyFiles()) {
    const study = await loadStudy(file);
    const alts = new Map();
    const pairs = (node) => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) return node.forEach(pairs);
      if (typeof node.src === "string" && typeof node.alt === "string") alts.set(node.src, node.alt);
      Object.values(node).forEach(pairs);
    };
    pairs(study.sections);
    for (const { value } of strings(study.sections)) {
      if (!IMAGE.test(value) || seen.has(value)) continue;
      seen.set(value, {
        src: value,
        slug: study.slug,
        title: study.title,
        alt: alts.get(value) || "",
      });
    }
  }
  return [...seen.values()].filter((im) => existsSync(join(PUBLIC, im.src)));
}

const done = existsSync(VISION) ? JSON.parse(readFileSync(VISION, "utf8")) : { images: {} };

const images = await corpus();
const todo = images.filter((im) => {
  if (FORCE) return true;
  const rec = done.images[im.src];
  return !rec || rec.hash !== hashOf(im.src);
});

mkdirSync(OUT, { recursive: true });
const manifest = [];
for (const im of todo) {
  const id = hashOf(im.src);
  const file = join(OUT, id + ".jpg");
  if (!existsSync(file)) {
    await sharp(join(PUBLIC, im.src))
      .resize(EDGE, EDGE, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer()
      .then((b) => writeFileSync(file, b));
  }
  manifest.push({ id, file, src: im.src, slug: im.slug, title: im.title, alt: im.alt });
}

writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 1));

const byStudy = new Map();
for (const m of manifest) byStudy.set(m.slug, (byStudy.get(m.slug) || 0) + 1);

console.log(`corpus        ${images.length} frames`);
console.log(`already read  ${images.length - todo.length}`);
console.log(`prepared      ${manifest.length} at ${EDGE}px into ${OUT}`);
console.log(`studies       ${byStudy.size}`);
console.log(`manifest      ${join(OUT, "manifest.json")}`);
