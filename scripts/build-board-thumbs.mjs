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
import { join, dirname, extname } from "node:path";
import sharp from "sharp";

const FORCE = process.argv.includes("--force");
const ROOT = "public/case-studies";
const OUT = "public/lab/board-thumbs";
const DATA = "public/lab/board-data.js";
/* 1280, up from 768. CLAUDE.md's own rule: native width / 2 is the
   largest honest CSS width, so 768 was crisp to 384 CSS px — which
   covered a board column when a column was 377. It is not any more.
   The field's column grows with the window: at 1900px the column is
   751 and a top-tier frame wants 646 of it, so every picture was
   stepping down the tiers until it fitted under 384 and landing at
   43% of its own column. That is why the board read small against the
   live site, which serves originals and has no such ceiling.

   1536 is crisp to 768 CSS. 1280 was chosen for a 1900px window and
   missed it by six pixels: the column is 751 there and the live
   site's top rung, 0.86, wants 646 of it against a 640 ceiling, so
   every top-tier cover stepped down to 0.74 and stopped matching the
   size reckon.house gives it. 768 carries 0.86 out to a column of
   893, which is a window around 2200. Quality down six to pay for the
   pixels: 78 was generous for a picture that was never going to be
   seen at full size. */
const W = 1536;
const Q = 72;
/* ── AND THE SMALLER RUNGS ──────────────────────────────────────────
   One file per picture meant every picture was DECODED at 1536 no
   matter how small it was drawn: 6.5MB of bitmap for a frame painted
   at 200px, and 6.5MB again for a 96px row in a list. Forty-five tiles
   came to 291MB of decoded image before a study was even opened, which
   is why opening and closing previews made the page crawl. Transfer
   was never the problem; decode was. Three rungs and a srcset, so the
   browser takes the file that fits the box. The small ones are the
   full file's name with @<width> before the extension, so the board
   builds the whole set from one path. */
const RUNGS = [384, 768];

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/** One level deep: public/case-studies/<slug>/<image>, nothing below.
 *  The subdirectories are not the work — reel/ thumbs, arc/demo build
 *  chrome, neiman-marcus/no-shadow duplicate exports, the unused
 *  dsc/new drop. A board of everything still means everything that IS
 *  something.
 *
 *  EXCEPT WHAT THE ORDER FILE NAMES. Sally's environment shots live in
 *  sally-os/heroes/, and the sheet's swap can name one for a line. So
 *  the walk goes below the top level too, and a deep file is yielded
 *  only when scripts/lib/board-order.txt names it; the deal treats it
 *  like any named picture. reel/ is never the board's. */
function* walk(root) {
  for (const slug of readdirSync(root, { withFileTypes: true })) {
    if (!slug.isDirectory()) continue;
    yield* walkDir(join(root, slug.name), 0);
  }
}
function* walkDir(dir, depth) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name !== "reel" && !name.name.startsWith(".")) yield* walkDir(p, depth + 1);
      continue;
    }
    if (!name.isFile()) continue;
    if (
      IMG_EXT.has(extname(name.name).toLowerCase()) &&
      /* The volume is exFAT and macOS writes an AppleDouble fork
         beside every real file — ghosts that match the extension
         test and are not images. */
      !name.name.startsWith("._")
    ) {
      if (depth === 0 || NAMED.has(p.slice(ROOT.length + 1).replace(/\.[^.]+$/, ""))) yield p;
    }
  }
}

/* ── THE ORDER FILE HAS THE LAST WORD ─────────────────────────────
   A picture named under a run in scripts/lib/board-order.txt is dealt
   there whatever the skip list says (assemble-board's PLACE), so it
   needs a thumb whether it was cut or not, at the field's width. Read
   the same way the assembler reads it: sections by "# <run>", one
   <slug>/<stem> a line, "# homes" and "# off" aside. */
const NAMED = new Set();
{
  const op = "scripts/lib/board-order.txt";
  let run = null;
  if (existsSync(op)) for (const raw of readFileSync(op, "utf8").split("\n")) {
    const t = raw.trim();
    if (!t) continue;
    if (t.startsWith("#")) { run = (t.replace(/^#+\s*/, "").split(/\s+/)[0] || null); continue; }
    if (run && run !== "homes" && run !== "off") NAMED.add(t.split("#")[0].trim());
  }
}

const items = [];
let wrote = 0, skipped = 0, failed = 0, left = 0, clash = 0, preview = 0;
let before = 0, after = 0;

/* ── NOT EVERY PICTURE IS DEALT ──────────────────────────────────────
   A file that works inside a study does not always work alone on the
   board: a crop cut for a plate, a PNG that needed its container's
   colour, a screenshot a quarter the size of its column. Those are
   named in scripts/lib/board-skip.txt, one <slug>/<file> a line,
   marked by eye on lab/board-sheet.html. They stay in their study;
   they leave the field. */
const SKIP_FILE = "scripts/lib/board-skip.txt";
const SKIP = new Set(existsSync(SKIP_FILE)
  ? readFileSync(SKIP_FILE, "utf8").split("\n").map((l) => l.replace(/\s+#.*$/, "").trim()).filter((l) => l && !l.startsWith("#"))
  : []);

/* ── OFF THE FIELD, STILL IN THE PREVIEW ────────────────────────────
   A cut used to mean the picture had no thumb, so it left the board's
   field AND the study's own column, and a study whose pictures were
   nearly all details opened its preview on its cover alone. The field
   is the curation; the preview is the study.

   A cut picture that the study PRESENTS ITSELF WITH — the hero it
   opens on or a full-width plate, read out of src/data by
   scripts/board-roles.mjs — is thumbed anyway and marked `x` in the
   data. The deal skips anything marked; the study column shows all of
   its own. The details, the screens cut from a UI and the swatches
   stay gone from both, which is the cut he made.

   Thumbed at 1024 rather than 1536: a preview column is 500px wide,
   so 1024 is honest at 2x and costs a third of the master. */
const PREVIEW_W = 1024;
const ROLES_FILE = "public/lab/board-roles.json";
const ROLES = existsSync(ROLES_FILE)
  ? JSON.parse(readFileSync(ROLES_FILE, "utf8")).roles || {} : {};
const roleOf = (rel) => ROLES[rel] || ROLES[rel.replace(/-2x(\.[^.]+)$/, "$1")] || null;
/* the folders that are a study, so a cut picture with nowhere to be
   shown (the homepage's own card crops, the rail's, the pulls) stays
   out of the data entirely */
const STUDY_DIRS = new Set(Object.keys(
  (() => { try { return JSON.parse(readFileSync("public/lab/board-groups.json", "utf8")); }
    catch (e) { return {}; } })()));
const keepForPreview = (rel) => {
  const r = roleOf(rel);
  return (r === "hero" || r === "plate");
};

/* ── A PICTURE THAT SHOWED THE PAPER THROUGH GETS ITS PLATE ──────────
   A PNG cut out on transparency is shown in its study on a container
   of the study's own colour; alone on the board it showed the tile's
   grey through, which read as the picture failing to fill its box.
   The thumb is flattened onto that colour, so the board sees what the
   study shows. Judged on the pixels, not the channel: a PNG can carry
   alpha and be opaque everywhere. */
const PLATE = "#EDE7E2";
/* ── EXCEPT WHERE THE BOARD DRAWS AROUND IT ─────────────────────────
   One picture is not shown alone: Ivy Park's polygon portrait is the
   still at the middle of a piece the board draws (TILE_SPIN in
   assemble-board.py), and the rings turn BEHIND it. Flattened, its
   transparent field becomes a cream rectangle and hides them. It keeps
   its alpha and composes on the plate, which is this same colour.
   Named here rather than inferred: this is a fact about how one
   picture is used, not about its pixels. */
const KEEP_ALPHA = new Set([
  "ivy-park/ivy-park-polygon-portrait-frame-logo.webp",
]);
async function opener(from, rel) {
  const meta = await sharp(from, { failOn: "none" }).metadata();
  let clear = false;
  if (meta.hasAlpha && !KEEP_ALPHA.has(rel)) {
    const st = await sharp(from, { failOn: "none" }).stats();
    const a = st.channels[st.channels.length - 1];
    clear = !!a && a.min < 250;
  }
  return () => { const s = sharp(from, { failOn: "none" }); return clear ? s.flatten({ background: PLATE }) : s; };
}

/* ── TWO SOURCES, ONE THUMB ─────────────────────────────────────────
   A thumb is named for its stem, so a picture kept as both a .jpg and
   a .png writes one file twice and the second pass wins. That also
   breaks the skip list, which addresses a source by name: a cut that
   names the .jpg leaves the .png to rebuild the same thumb, and the
   picture that was removed is back on the board. Named here, loudly,
   because nothing further down the pipeline can see it. */
const byStem = new Map();
for (const from of walk(ROOT)) {
  const rel = from.slice(ROOT.length + 1);
  const stem0 = rel.replace(/\.[^.]+$/, "");
  byStem.set(stem0, [...(byStem.get(stem0) || []), rel]);
}
for (const [, rels] of byStem) {
  /* both cut is no clash: nothing is written either way */
  if (rels.length < 2 || rels.every((r) => SKIP.has(r))) continue;
  console.error(`  two sources, one thumb: ${rels.join(" and ")} — skip or rename one`);
  clash += 1;
}
for (const from of walk(ROOT)) {
  const rel = from.slice(ROOT.length + 1); // "<slug>/<file>"
  const named = NAMED.has(rel.replace(/\.[^.]+$/, ""));
  const cut = SKIP.has(rel) || rel.split("/").length > 2;
  if (cut && !named && !keepForPreview(rel)) { left += 1; continue; }
  if (cut && !named) preview += 1;
  const open = await opener(from, rel);
  const slug = rel.split("/")[0];
  const stem = rel.slice(slug.length + 1).replace(/\.[^.]+$/, "");
  const to = join(OUT, slug, stem + ".webp");

  before += statSync(from).size;
  try {
    let meta;
    /* ── THE SIZE RECORDED IS THE FILE THAT SHIPS ─────────────────
       This wrote the SOURCE's dimensions, so a 6493px original was
       declared as 6493 while the file served was 768. The board's own
       "no picture larger than its pixels" rule then had to clamp with
       a copy of this script's width written into the board, and the
       moment that width moved the two disagreed and the clamp did
       nothing. The thumb knows its own size; record that, and the
       rule needs no constant at all. The ratio is the same either
       way, which is the only other thing the width is used for. */
    if (!FORCE && existsSync(to)) {
      meta = await sharp(to).metadata();
      skipped += 1;
    } else {
      /* a deep picture keeps its folder under the study's */
      mkdirSync(dirname(to), { recursive: true });
      const info = await open()
        .resize({ width: cut && !named ? PREVIEW_W : W, withoutEnlargement: true })
        .webp({ quality: Q })
        .toFile(to);
      meta = { width: info.width, height: info.height };
      wrote += 1;
    }
    after += statSync(to).size;
    /* a rung only exists when the picture is actually wider than it;
       below that the full file IS the small one and a second copy
       would be two names for one image */
    const rungs = [];
    for (const r of RUNGS) {
      if (meta.width <= r) continue;
      const small = to.replace(/\.webp$/, "@" + r + ".webp");
      if (FORCE || !existsSync(small)) {
        await open()
          .resize({ width: r, withoutEnlargement: true })
          .webp({ quality: Q })
          .toFile(small);
      }
      after += statSync(small).size;
      rungs.push(r);
    }
    items.push({
      t: to.slice("public".length),
      w: meta.width,
      h: meta.height,
      g: slug,
      /* off the field, in the study's own column: the deal skips it
         and openStudyColumn does not */
      ...(cut ? { x: 1 } : {}),
      ...(rungs.length ? { r: rungs } : {}),
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
/* ── THE LIVE INDEX'S OWN RESTING SIZE, PER CARD ────────────────────
   The board deals its frame widths from the same six-tier ladder the
   live index uses, so at a matched window the two produce the same
   SET of widths — but not the same width for the same study, because
   each rolls its own dice. The live roll is not random in practice:
   pressingHomeDriver deals with mkRnd(5), a plain LCG, over the
   projects in file order, and an authored `size:` on a project wins
   over the roll. All of that is reproducible here, so the board can
   stand each study's cover at exactly the width reckon.house stands
   it at today. The generator below is that file's mkRnd and
   dealShares, copied deliberately: they live in a browser bundle this
   script cannot import, and the count check at the end goes loud if
   the two ever drift apart. */
const IX_TIERS = [0.33, 0.43, 0.53, 0.64, 0.74, 0.86];
const mkRnd = (s0) => { let s = s0;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; };
const dealShares = (n, rnd) => {
  const out = []; let prev = -1;
  for (let i = 0; i < n; i++) {
    let t, guard = 0;
    do { t = IX_TIERS[Math.floor(rnd() * IX_TIERS.length)]; }
    while (Math.abs(t - prev) < 0.17 && guard++ < 24);
    out.push(t); prev = t;
  }
  return out;
};
const projLines = projTs.split("\n").filter((l) =>
  /\bid:\s*"/.test(l) && /href:\s*"\/case-studies\//.test(l));
const liveShares = dealShares(projLines.length, mkRnd(5));

const coverByStem = {};
const outsideCovers = [];
let coverOrder = 0;
let projSeen = 0;
for (const line of projTs.split("\n")) {
  const id = line.match(/\bid:\s*"([^"]+)"/);
  const slug = line.match(/href:\s*"\/case-studies\/([^"]+)"/);
  if (!id || !slug) continue;
  const title = line.match(/title:\s*"([^"]+)"/);
  const category = line.match(/category:\s*"([^"]+)"/);
  const tags = line.match(/tags:\s*\[([^\]]*)\]/);
  /* the width this study's cover stands at on reckon.house right now:
     its authored size, or the seed's roll for its place in the file */
  const authored = line.match(/\bsize:\s*([0-9.]+)/);
  const sz = authored ? parseFloat(authored[1]) : liveShares[projSeen];
  /* ── THE CROP IS AUTHORED, NOT DERIVED ──────────────────────────
     The shared stylesheet draws every picture 16% taller than its
     frame and centres it, so object-fit pays the difference as a crop
     top and bottom. Seven projects overrule that in projects.ts with
     `drift: 4`, tuned by hand for pictures that cannot lose the edge —
     the Sally laptop is one, and it is why the board's laptop sat
     tight in its frame while the live site's had air around it. There
     is no rule to infer here: the number is the judgement. */
  const dr = line.match(/\bdrift:\s*([0-9.]+)/);
  projSeen += 1;
  groups[slug[1]] = { id: id[1], sz, dr: dr ? parseFloat(dr[1]) : null,
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
    /* ── A COVER THAT LIVES SOMEWHERE ELSE ──────────────────────────
       One project keeps its picture outside public/case-studies:
       Faux Reel, whose page renders a live component and whose only
       still sits in /images/thumbnails. The walk never saw it, so the
       study had no cover, no tile and a broken picture in every list
       that named it. Thumbed here by its own path instead of being
       counted and dropped. */
    if (img) outsideCovers.push({ c: coverOrder, slug: slug[1], path: img[1] });
    coverOrder++;
  }
}
/* ── THE LIVE INDEX'S OWN READING ORDER ─────────────────────────────
   The board seated its covers in the file's order and the live site
   does not read that way: it lays the cards into two columns, and the
   pairing puts the file's second card top right, its first below on
   the left. So reckon.house opens on Ivy Park and the board opened on
   the Nordstrom framework. Swapping each adjacent pair is that
   pairing, exactly — checked against all thirty cards on the live
   page. The board reads down a column rather than across a row, so
   what carries over is the SEQUENCE, and it now starts where the live
   site starts. */
for (const v of Object.values(coverByStem)) v.c ^= 1;
for (const v of outsideCovers) v.c ^= 1;

/* and thumbed like any other picture, into the study's own drawer */
for (const cv of outsideCovers) {
  const from = join("public", cv.path.replace(/^\//, ""));
  if (!existsSync(from)) { console.error(`  skip (no file): ${cv.path}`); continue; }
  const to = join(OUT, cv.slug, cv.path.split("/").pop().replace(/\.[^.]+$/, "") + ".webp");
  mkdirSync(join(OUT, cv.slug), { recursive: true });
  let meta;
  if (!FORCE && existsSync(to)) meta = await sharp(to).metadata();
  else {
    const info = await sharp(from, { failOn: "none" })
      .resize({ width: W, withoutEnlargement: true }).webp({ quality: Q }).toFile(to);
    meta = { width: info.width, height: info.height };
  }
  const rungs = [];
  for (const r of RUNGS) {
    if (meta.width <= r) continue;
    const small = to.replace(/\.webp$/, "@" + r + ".webp");
    if (FORCE || !existsSync(small)) {
      await sharp(from, { failOn: "none" })
        .resize({ width: r, withoutEnlargement: true }).webp({ quality: Q }).toFile(small);
    }
    rungs.push(r);
  }
  items.push({ t: to.slice("public".length), w: meta.width, h: meta.height,
    g: cv.slug, c: cv.c, ...(rungs.length ? { r: rungs } : {}) });
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

/* ── WHAT THE HOUSE CAN SAY ABOUT A STUDY ───────────────────────────
   A field that answers questions can only answer with what it has,
   and until now that was a title, a category and one line. Each study
   file already carries the two things a reader actually asks for: the
   meta block's summary, which is Built / Scope / Materials / Angle as
   label and value, and the abstract, three dense paragraphs of the
   study's own prose. Mined here so the board quotes Jeremy rather
   than composing anything, and written to its OWN file, fetched only
   when a study column opens — the board's first paint should not
   carry 30 abstracts it may never show. */
const unquote = (raw) => {
  try { return JSON.parse('"' + raw + '"'); }
  catch { return raw.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\"); }
};
const COPY = {};
for (const [folder, g] of Object.entries(groups)) {
  const file = `src/data/${g.h}-case-study.ts`;
  if (!existsSync(file)) continue;
  const src = readFileSync(file, "utf8");
  const facts = [];
  const sum = src.match(/\n\s*summary:\s*\[([\s\S]*?)\n\s*\],/);
  if (sum) {
    const re = /\{\s*label:\s*"((?:[^"\\]|\\.)*)",\s*value:\s*\n?\s*"((?:[^"\\]|\\.)*)"\s*,?\s*\}/g;
    let f;
    while ((f = re.exec(sum[1]))) facts.push({ k: unquote(f[1]), v: unquote(f[2]) });
  }
  const ab = src.match(/\n\s*abstract:\s*\n?\s*"((?:[^"\\]|\\.)*)"/);
  const para = ab ? unquote(ab[1]).split(/\n{2,}/).map((x) => x.trim()).filter(Boolean) : [];
  if (facts.length || para.length) COPY[folder] = { facts, para };
}
/* ── THE HOUSE'S OWN COPY ───────────────────────────────────────────
   The footer is two columns on the board, Info and Connect, and what
   they say is what the footer says: the three method notes and the
   ways in from PressingContact, the credits from PressingCredits.
   Mined from those files so the board and the site cannot disagree,
   and loud if a block moves. */
const contactTs = readFileSync("src/components/shell/pressing-footer/PressingContact.tsx", "utf8");
const creditsTs = readFileSync("src/components/shell/pressing-footer/PressingCredits.tsx", "utf8");
const js = (raw) => JSON.parse('"' + raw + '"');
const block = (src, name) => {
  const m = src.match(new RegExp("const " + name + "[^=]*=\\s*\\[([\\s\\S]*?)\\n?\\];"));
  if (!m) throw new Error("board: no " + name + " block in the footer source");
  return m[1];
};
const method = [...block(contactTs, "METHOD").matchAll(
  /head:\s*"((?:[^"\\]|\\.)*)",\s*body:\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*)+)/g)]
  .map((m) => ({ k: js(m[1]), v: [...m[2].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => js(x[1])).join("") }));
const links = [...block(contactTs, "CONTACT").matchAll(/label:\s*"([^"]+)",\s*href:\s*"([^"]+)"/g)]
  .map((m) => ({ k: m[1], v: m[2] }));
const strs = (src) => [...src.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const services = strs(block(contactTs, "SERVICES"));
const practice = strs(block(contactTs, "PRACTICE"));
const credits = [...block(creditsTs, "CREDITS").matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);
if (method.length < 3 || links.length < 4 || credits.length < 10)
  throw new Error(`board: footer copy came up short (method ${method.length}, links ${links.length}, credits ${credits.length})`);
/* the booking page's own lede and the slot length, so the column
   says what /book says; if the JSX moves, the footer's line stands in
   and the build says so rather than failing */
const bookTs = readFileSync("src/app/book/page.tsx", "utf8");
const dataTs = readFileSync("src/data/booking.ts", "utf8");
const minutes = parseInt((dataTs.match(/SLOT_MINUTES\s*=\s*(\d+)/) || [])[1] || "30", 10);
const jsxText = (t) => t.replace(/\{"\s*"\}/g, " ").replace(/&rsquo;/g, "\u2019").replace(/\{[^}]*\}/g, String(minutes))
  .replace(/\s+/g, " ").trim();
const ledeM = bookTs.match(/<h1[^>]*>\s*([\s\S]*?)<span className="dim">\s*([\s\S]*?)<\/span>/);
const book = ledeM
  ? { lede: jsxText(ledeM[1]), dim: jsxText(ledeM[2]), minutes }
  : { lede: "Have a project in mind?", dim: "", minutes };
if (!ledeM) console.error("  board: /book lede not found, the footer's line stands in");
COPY.house = { method, links, services, practice, credits, book };
writeFileSync("public/lab/board-copy.json", JSON.stringify(COPY));

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
const STUDIES = Object.entries(COPY).filter(([k]) => k !== "house").map(([, v]) => v);
console.log(
  `board: ${items.length} tiles (${wrote} encoded, ${skipped} kept, ${failed} failed, ${left} left out by the skip list, ${preview} kept for the previews alone${clash ? ", " + clash + " STEM CLASHES above" : ""})` +
  `\n  originals ${MB(before)}MB → thumbs ${MB(after)}MB` +
  `\n  data ${DATA} (${MB(statSync(DATA).size)}MB)` +
  `\n  shell public/lab/board-shell.css (${MB(statSync("public/lab/board-shell.css").size)}MB)` +
  /* the studies only: `house` sits in the same object and has neither
     facts nor paragraphs, so counting across all of it threw on the
     summary line — after everything had been written, which is the
     one place a crash reads as a failed build and is not one */
  `\n  copy public/lab/board-copy.json (${STUDIES.length} studies, ` +
  `${STUDIES.reduce((n, c) => n + (c.facts || []).length, 0)} facts, ` +
  `${STUDIES.reduce((n, c) => n + (c.para || []).length, 0)} paragraphs, ` +
  `house: ${COPY.house.method.length} notes, ${COPY.house.credits.length} credits)`
);
