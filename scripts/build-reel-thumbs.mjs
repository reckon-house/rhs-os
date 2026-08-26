#!/usr/bin/env node
/* ── Cut every cover reel a set of frames it can actually afford ─────
 *
 *   npm run reels           generate anything missing or stale
 *   npm run reels -- --check   fail if anything is missing (CI, prebuild)
 *   npm run reels -- --force   re-encode everything
 *
 * The reason this exists is in src/lib/reel-thumb.ts, which also owns
 * the path convention. This script imports it rather than restating it,
 * so the file the renderer asks for is the file the generator wrote.
 *
 * WHY NOT RE-ENCODE IN PLACE: 209 of the 218 frames are the study's own
 * full-size plates, reused verbatim by the reel. Shrinking those would
 * shrink the plates, which are the work.
 */
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname } from "node:path";
import sharp from "sharp";
import { studyFiles, loadStudy } from "./lib/walk-studies.mjs";
import { reelThumb, REEL_THUMB_W } from "../src/lib/reel-thumb.ts";

const CHECK = process.argv.includes("--check");
const FORCE = process.argv.includes("--force");

/** Every frame every reel names, once. */
async function frames() {
  const seen = new Map();
  for (const file of studyFiles()) {
    const study = await loadStudy(file);
    for (const section of study.sections) {
      const reel = section?.reel || section?.cover?.reel;
      if (!reel?.images?.length) continue;
      for (const src of reel.images) {
        if (!seen.has(src)) seen.set(src, file.replace("-case-study.ts", ""));
      }
    }
  }
  return seen;
}

const KB = (b) => (b / 1024).toFixed(0).padStart(5);

const all = await frames();
let wrote = 0, skipped = 0, missingSource = [], notBuilt = [];
let before = 0, after = 0;

for (const [src, study] of all) {
  const from = "public" + src;
  const to = "public" + reelThumb(src);

  if (!existsSync(from)) { missingSource.push(`${study}: ${src}`); continue; }

  const srcBytes = statSync(from).size;
  before += srcBytes;

  if (CHECK) {
    if (!existsSync(to)) notBuilt.push(`${study}: ${reelThumb(src)}`);
    else after += statSync(to).size;
    continue;
  }

  /* Stale means older than its source. Cheap, and it means re-running
     after replacing one photograph does not re-encode 210 files. */
  const fresh =
    !FORCE && existsSync(to) && statSync(to).mtimeMs >= statSync(from).mtimeMs;
  if (fresh) { after += statSync(to).size; skipped += 1; continue; }

  mkdirSync(dirname(to), { recursive: true });
  await sharp(from)
    /* withoutEnlargement: a frame already smaller than the box keeps its
       own size rather than being upscaled into a bigger file that shows
       no more detail. */
    .resize({ width: REEL_THUMB_W, withoutEnlargement: true })
    .avif({ quality: 50, effort: 4 })
    .toFile(to);

  const outBytes = statSync(to).size;
  after += outBytes;
  wrote += 1;
  console.log(`  ${KB(srcBytes)} KB -> ${KB(outBytes)} KB  ${src.split("/").pop().slice(0, 46)}`);
}

console.log("");
if (missingSource.length) {
  console.error(`  ${missingSource.length} reel frames have no source file:`);
  missingSource.forEach((m) => console.error(`    ${m}`));
}
if (CHECK) {
  if (notBuilt.length) {
    console.error(`  ${notBuilt.length} reel frames have no thumbnail. Run: npm run reels`);
    notBuilt.slice(0, 10).forEach((m) => console.error(`    ${m}`));
    process.exit(1);
  }
  console.log(`  ${all.size} reel frames, all built.`);
} else {
  console.log(`  ${all.size} frames: ${wrote} written, ${skipped} already fresh`);
}
if (before && after) {
  console.log(
    `  ${(before / 1048576).toFixed(1)} MB of plates -> ${(after / 1048576).toFixed(1)} MB of frames` +
      `  (${(100 - (after / before) * 100).toFixed(1)}% smaller)`
  );
}
if (missingSource.length) process.exit(1);
