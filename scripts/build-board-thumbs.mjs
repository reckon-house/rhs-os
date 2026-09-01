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
/* 768, not 384. CLAUDE.md's own rule: native width / 2 is the largest
   honest CSS width, so a 384px file is crisp to about 192 CSS px and
   soft above it — and a board column is up to 377. Every picture was
   being drawn at half the resolution it needed, which is what
   "compressed and crunchy" was. 768 covers a full-width column on a
   2x screen exactly.

   Quality up with it: 68 is a thumbnail's number and these are not
   thumbnails any more, they are the work at column size. */
const W = 768;
const Q = 78;

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
        .webp({ quality: Q })
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
/* ── the covers ─────────────────────────────────────────────────────
   This is a portfolio first, so the thirty tiles the live homepage
   deals come FIRST on the board, in the homepage's own order. Each
   project's image line names the file (all in hp/ except sizzle,
   whose cover lives outside case-studies and sits this out), and the
   stem is enough to find the corpus item. The cover is also re-homed
   to its STUDY's slug on the way through, so it carries the study's
   caption and tags instead of hp's nothing. */
const coverByStem = {};
let coverOrder = 0;
for (const line of projTs.split("\n")) {
  const id = line.match(/\bid:\s*"([^"]+)"/);
  const slug = line.match(/href:\s*"\/case-studies\/([^"]+)"/);
  if (!id || !slug) continue;
  const title = line.match(/title:\s*"([^"]+)"/);
  const category = line.match(/category:\s*"([^"]+)"/);
  const tags = line.match(/tags:\s*\[([^\]]*)\]/);
  groups[slug[1]] = { id: id[1],
    t: title ? title[1] : "", s: category ? category[1] : "",
    /* the ROUTE, kept beside the folder key. Two studies keep their
       images in a folder named differently from their route, and a
       link built from the folder would 404 — sally-os is the drawer,
       /case-studies/sally is the door. */
    h: slug[1],
    tags: tags ? [...tags[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [] };
  const img = line.match(/image:\s*(?:\`\$\{HP\}\/|")([^"\`?]+)/);
  if (img && img[1].includes("/") === false) {
    const stem = img[1].replace(/\.[^.]+$/, "");
    coverByStem[stem] = { c: coverOrder++, slug: slug[1] };
  } else {
    coverOrder++;
  }
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
/* ── a line of the study's own copy ─────────────────────────────────
   The preview should say something, and the study already says it:
   the subtitle is the one line each case study leads with. Read from
   the study file rather than written here, so the preview and the
   study can never disagree — and if a file has none, the preview
   simply shows none rather than inventing one. */
for (const [folder, g] of Object.entries(groups)) {
  const file = `src/data/${g.h}-case-study.ts`;
  if (!existsSync(file)) continue;
  const src = readFileSync(file, "utf8");
  const m = src.match(/\n  subtitle:\s*\n?\s*"([^"]+)"/);
  if (m) g.d = m[1];
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

/* stamp the covers: order + the study they belong to (post-alias) */
const ALIAS = { sally: "sally-os", "fairview-suite": "fairview-bedroom" };
let coversFound = 0;
for (const it of items) {
  if (it.g !== "hp") continue;
  const stem = it.t.split("/").pop().replace(/\.webp$/, "");
  const cov = coverByStem[stem];
  if (!cov) continue;
  it.c = cov.c;
  it.g = ALIAS[cov.slug] || cov.slug;
  coversFound += 1;
}
if (coversFound < 25) throw new Error(
  `only ${coversFound} homepage covers matched — the stem match broke`);

/* Sorted so the data file is stable: a re-run with nothing new
   produces an identical literal and a quiet diff. */
items.sort((a, b) => (a.t < b.t ? -1 : 1));
writeFileSync(
  DATA,
  "/* generated by scripts/build-board-thumbs.mjs — do not edit */\n" +
    "window.BOARD_ITEMS = " + JSON.stringify(items) + ";\n" +
    "window.BOARD_GROUPS = " + JSON.stringify(groups) + ";\n"
);

/* ── THE BOARD BORROWS THE HOMEPAGE'S OWN STYLESHEET ────────────────
   Every tuned value in the lab — the drawer rail's chip clip and its
   0.56s curve, the burn pill, the tile frame, the standing rules —
   already exists and is already right. Copying it by hand would fork
   it on day one, so the board LINKS it: this lifts the lab's <style>
   block verbatim into board-shell.css and the board loads that.

   The lab's block, not src/components/home/pressing-home.css, because
   the port deliberately drops the masthead rules on the way to the app
   (the real site has Masthead.tsx) and the burn bar is exactly one of
   the things the board needs.

   Re-run `npm run board` after tuning the lab and the board follows. */
const lab = readFileSync("public/lab/pressing-home.html", "utf8");
const style = lab.match(/<style>([\s\S]*?)<\/style>/);
if (!style) throw new Error("no <style> block in the lab");
writeFileSync("public/lab/board-shell.css",
  "/* generated by scripts/build-board-thumbs.mjs from\n" +
  " * public/lab/pressing-home.html — do not edit. Tune the lab. */\n" +
  style[1]);

const MB = (b) => (b / 1048576).toFixed(1);
console.log(
  `board: ${items.length} tiles (${wrote} encoded, ${skipped} kept, ${failed} failed)` +
  `\n  originals ${MB(before)}MB → thumbs ${MB(after)}MB` +
  `\n  data ${DATA} (${MB(statSync(DATA).size)}MB)` +
  `\n  shell public/lab/board-shell.css (${MB(statSync("public/lab/board-shell.css").size)}MB)`
);
