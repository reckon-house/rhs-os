#!/usr/bin/env node
/* ── What each tile on the board actually is ─────────────────────────
 *
 *   npm run board:audit      measure every tile, write board-audit.json
 *
 * The board deals every file in public/case-studies, and a file that
 * works inside a study does not always work alone on the board: a
 * crop cut for a plate, a PNG that needed its container's colour, a
 * screenshot a quarter the size of its column. This reads the SOURCE
 * of every tile in board-data.js and writes what a sweep needs to
 * know about it: native size, whether any pixel is transparent, the
 * ratio, and the flags those add up to. lab/board-sheet.html lays the
 * tiles out with the flags and lets a hand mark the ones to drop;
 * scripts/lib/board-skip.txt is where the marks go, and the thumb
 * builder reads it. Crops are judged by eye there, not here: a ratio
 * says a picture is tall, not that it is odd.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = "public/case-studies";
const DATA = "public/lab/board-data.js";
const OUT = "public/lab/board-audit.json";
const SKIP = "scripts/lib/board-skip.txt";

const src = readFileSync(DATA, "utf8");
const m = src.match(/window\.BOARD_ITEMS = (\[[\s\S]*?\]);/);
if (!m) throw new Error("audit: no BOARD_ITEMS in " + DATA);
const items = JSON.parse(m[1]);

/* the source behind a thumb: same folder, same stem, whatever the
   extension was */
const sourceOf = (t) => {
  const rel = t.replace(/^\/lab\/board-thumbs\//, "").replace(/\.webp$/, "");
  const slug = rel.split("/")[0], stem = rel.slice(slug.length + 1);
  const dir = join(ROOT, slug);
  if (!existsSync(dir)) return null;
  const hit = readdirSync(dir).find((f) => f.replace(/\.[^.]+$/, "") === stem);
  return hit ? { rel: slug + "/" + hit, path: join(dir, hit) } : null;
};

const skip = existsSync(SKIP)
  ? readFileSync(SKIP, "utf8").split("\n").map((l) => l.replace(/\s+#.*$/, "").trim()).filter((l) => l && !l.startsWith("#"))
  : [];

const out = {};
let n = 0, alpha = 0, tiny = 0, tall = 0, wide = 0;
for (const it of items) {
  const s = sourceOf(it.t);
  if (!s) { console.error("  no source for " + it.t); continue; }
  const img = sharp(s.path, { failOn: "none" });
  const meta = await img.metadata();
  const w = meta.width || 0, h = meta.height || 0;
  let clear = false;
  if (meta.hasAlpha) {
    /* a channel is not a hole: a PNG can carry alpha and be opaque
       everywhere. The alpha channel's darkest pixel says whether any
       of the picture shows the paper through. */
    const st = await img.stats();
    const a = st.channels[st.channels.length - 1];
    clear = a && a.min < 250;
  }
  const ratio = w && h ? h / w : 1;
  const flags = [];
  if (clear) { flags.push("alpha"); alpha += 1; }
  if (Math.max(w, h) < 600) { flags.push("tiny"); tiny += 1; }
  if (ratio >= 1.9) { flags.push("tall"); tall += 1; }
  if (ratio <= 1 / 2.4) { flags.push("wide"); wide += 1; }
  out[it.t] = { src: s.rel, w, h, clear, flags };
  n += 1;
}
writeFileSync(OUT, JSON.stringify({ at: new Date().toISOString(), skip, tiles: out }));
console.log(`audit: ${n} tiles — ${alpha} with transparent pixels, ${tiny} under 600px, ${tall} tall (≥1.9:1), ${wide} wide (≥2.4:1); ${skip.length} on the skip list → ${OUT}`);
