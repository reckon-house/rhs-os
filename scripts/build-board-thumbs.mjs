#!/usr/bin/env node
/* ── Every picture the house holds, at a size a field can afford ─────
 *
 *   npm run board            generate anything missing, rewrite the data
 *   npm run board -- --force re-encode everything
 *
 * The lab's infinite board (public/lab/board.html) deals the WHOLE
 * corpus at once — 1,035 images, 458MB of originals — and mounts a
 * moving window of it as you pan. A window of forty full plates is
 * still tens of megabytes, which is the exact mistake the reel thumbs
 * exist to prevent, so the board gets the same treatment: a 384px webp
 * tier, generated here, never the plates.
 *
 * The script also writes the board's DATA — public/lab/board-data.js,
 * a window.BOARD_ITEMS literal with each tile's thumb, declared size
 * and folder. Both outputs come from one walk of the same files, so
 * the tile list and the thumbnails cannot disagree: an image without a
 * thumb never makes it into the data.
 *
 * Ratios are read from the FILES, not from image-dimensions.ts. The
 * board deals everything, including images no study has registered
 * yet, and the field's placement math needs a true ratio for every
 * tile it seats.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import sharp from "sharp";

const FORCE = process.argv.includes("--force");
const ROOT = "public/case-studies";
const OUT = "public/lab/board-thumbs";
const DATA = "public/lab/board-data.js";
const W = 384;

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/** One level deep: public/case-studies/<slug>/<image>, nothing below.
 *  The subdirectories are not the work — reel/ thumbs, arc/demo build
 *  chrome, neiman-marcus/no-shadow duplicate exports, the unused
 *  dsc/new drop. A board of everything still means everything that IS
 *  something. */
function* walk(root) {
  for (const slug of readdirSync(root, { withFileTypes: true })) {
    if (!slug.isDirectory()) continue;
    const dir = join(root, slug.name);
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      if (!name.isFile()) continue;
      const p = join(dir, name.name);
      if (
        IMG_EXT.has(extname(name.name).toLowerCase()) &&
        /* The volume is exFAT and macOS writes an AppleDouble fork
           beside every real file — ghosts that match the extension
           test and are not images. */
        !name.name.startsWith("._")
      ) {
        yield p;
      }
    }
  }
}

const items = [];
let wrote = 0, skipped = 0, failed = 0;
let before = 0, after = 0;

for (const from of walk(ROOT)) {
  const rel = from.slice(ROOT.length + 1); // "<slug>/<file>"
  const slug = rel.split("/")[0];
  const stem = rel.slice(slug.length + 1).replace(/\.[^.]+$/, "");
  const to = join(OUT, slug, stem + ".webp");

  before += statSync(from).size;
  try {
    let meta;
    if (!FORCE && existsSync(to)) {
      meta = await sharp(from).metadata();
      skipped += 1;
    } else {
      mkdirSync(join(OUT, slug), { recursive: true });
      const img = sharp(from, { failOn: "none" });
      meta = await img.metadata();
      await img.resize({ width: W, withoutEnlargement: true })
        .webp({ quality: 68 })
        .toFile(to);
      wrote += 1;
    }
    after += statSync(to).size;
    items.push({
      t: to.slice("public".length),
      w: meta.width,
      h: meta.height,
      g: slug,
    });
  } catch (e) {
    failed += 1;
    console.error(`  skip (unreadable): ${rel} — ${e.message}`);
  }
}

/* ── the groups: what each folder IS, from the site's own data ──────
   projects.ts knows every study's title, category line and tags, and
   its href names the same folder the images live in. rail-categories
   knows which ids are the App Development shelf. Parsed with regexes
   rather than imported because this is a .ts file and the fields are
   flat literals; if the shape ever changes, the count check below
   goes loud. Folders with no study (hp, branding-graphics, the board)
   get no caption and no tags, which is correct: they are material,
   not case studies. */
const projTs = readFileSync("src/data/projects.ts", "utf8");
const groups = {};
/* One project per line in that file, so the parse is per line — a
   cross-line regex died on the `${HP}` inside every image template
   literal, whose closing brace ended a [^}] run mid-entry. */
for (const line of projTs.split("\n")) {
  const id = line.match(/\bid:\s*"([^"]+)"/);
  const slug = line.match(/href:\s*"\/case-studies\/([^"]+)"/);
  if (!id || !slug) continue;
  const title = line.match(/title:\s*"([^"]+)"/);
  const category = line.match(/category:\s*"([^"]+)"/);
  const tags = line.match(/tags:\s*\[([^\]]*)\]/);
  groups[slug[1]] = { id: id[1],
    t: title ? title[1] : "", s: category ? category[1] : "",
    tags: tags ? [...tags[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [] };
}
/* Three studies keep their images in a folder named differently from
   their route. Measured, not guessed: these are the only mismatches
   between the 30 hrefs and the disk. sizzle's images live outside
   case-studies entirely and stay uncaptioned. */
for (const [href, folder] of [
  ["sally", "sally-os"],
  ["fairview-suite", "fairview-bedroom"],
]) {
  if (groups[href]) { groups[folder] = groups[href]; delete groups[href]; }
}
const railTs = readFileSync("src/data/rail-categories.ts", "utf8");
const appBlock = railTs.match(/query:\s*"app development"[\s\S]*?ids:\s*\[([^\]]*)\]/);
const appIds = appBlock
  ? [...appBlock[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
for (const g of Object.values(groups))
  if (appIds.includes(g.id)) g.tags.push("app");
const nGroups = Object.keys(groups).length;
if (nGroups < 20) throw new Error(
  `projects.ts parse looks broken: only ${nGroups} groups matched`);

/* Sorted so the data file is stable: a re-run with nothing new
   produces an identical literal and a quiet diff. */
items.sort((a, b) => (a.t < b.t ? -1 : 1));
writeFileSync(
  DATA,
  "/* generated by scripts/build-board-thumbs.mjs — do not edit */\n" +
    "window.BOARD_ITEMS = " + JSON.stringify(items) + ";\n" +
    "window.BOARD_GROUPS = " + JSON.stringify(groups) + ";\n"
);

const MB = (b) => (b / 1048576).toFixed(1);
console.log(
  `board: ${items.length} tiles (${wrote} encoded, ${skipped} kept, ${failed} failed)` +
  `\n  originals ${MB(before)}MB → thumbs ${MB(after)}MB` +
  `\n  data ${DATA} (${MB(statSync(DATA).size)}MB)`
);
