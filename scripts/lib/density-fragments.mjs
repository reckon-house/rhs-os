#!/usr/bin/env node
/* ── THE FRAGMENTS: every piece of the work, for /lab/density/ ─────────
   26 Sept 2026. His brief, after the scroll concepts: "i'm just doing
   layouts... what i see in my head [is] areas of density and feed like
   construction of content highly contrasted with negative space and
   focus on something... show the scope of all the things i have done",
   including the workflow work "that has no real 'visual'", and "not
   some generic UI". The answer being tested is that the unit of the
   site is a FRAGMENT, not a case study: a picture, a number, a line, a
   step, a palette, a tool, a day's entry. Every prototype in
   /lab/density/ reads this one file and lays the same pieces out its
   own way, so they differ only in idea.

   Nothing is typed here. Studies come from src/data/*-case-study.ts
   (transpiled, as scroll-concepts-studies.mjs does), their dates, tags
   and palettes from the board's house.js, the daybook from
   src/data/daybook.ts, the About sentences from board-house.json via
   house.js. A fragment is only ever his words or his picture.

   Pictures carry their real size and two thumbnail rungs (@384, @768):
   the board's own thumbs where it has them, otherwise made here into
   public/lab/density/thumbs/. A dense field of three hundred pictures
   must never fetch three hundred full files.

   A picture can also have a phone rung, tp (25 Oct 2026, his "let's
   make the images phone sized for sure so long as we dont lose quality.
   build time works"): 1320 across (@1320), or at its own width when it
   is narrower and heavy (@<width>). H draws a room's pictures the
   phone's full width, 1,320 device pixels on the widest iPhone, so a
   phone took the whole file. Each rung is the smallest of a few JPEG
   and WebP encodings that ssimulacra2 scores 90 or more against the
   original at the rung's pixels (90 is its "visually lossless"), and
   only if it saves at least 15% of the original's bytes; else the
   phone keeps the original. The choices are kept in phone-rungs.json,
   so a rerun only encodes new or changed pictures. Without ssimulacra2
   (brew install jpeg-xl) no new rung is made.

       node scripts/lib/density-fragments.mjs
*/
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execFile, spawnSync } from "node:child_process";
import { promisify } from "node:util";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(import.meta.url);
const ts = require(path.join(ROOT, "node_modules/typescript"));
const sharp = require(path.join(ROOT, "node_modules/sharp"));

const load = (rel) => {
  const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const module = { exports: {} };
  new Function("module", "exports", "require", js)(module, module.exports, () => ({}));
  return module.exports;
};
const { imageDimensions } = load("src/data/image-dimensions.ts");
const { DAYBOOK } = load("src/data/daybook.ts");
globalThis.window = {};
new Function("window", fs.readFileSync(path.join(ROOT, "public/lab/scroll-concepts/house.js"), "utf8"))(globalThis.window);
const H = globalThis.window.HOUSE;

const clean = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();
const paras = (s) => String(s || "").split(/\n\s*\n/).map(clean).filter(Boolean);
/* a sentence ends at a stop followed by a capital; abbreviations like
   "A.R.C." and "U.S." keep their stops because a capital follows a
   letter-stop pair, which the split below refuses */
const sentences = (s) => clean(s).split(/(?<=[a-z0-9%)”"’][.!?])\s+(?=[A-Z“"‘])/).map(clean).filter((x) => x.length > 2);
const hasNumber = (s) => /(\$\s?\d|\d+(\.\d+)?\s?%|\b\d{2,}(,\d{3})*\b|\b\d+x\b|\b(one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty)\b)/i.test(s);

/* ── pictures and their thumbnails ── */
const THUMBS = path.join(ROOT, "public/lab/density/thumbs");
const hasAlpha = (file) => {
  let b; try { b = fs.readFileSync(file).subarray(0, 1 << 16); } catch (e) { return false; }
  if (/\.png$/i.test(file)) { const t = b[25]; if (t === 4 || t === 6) return true; const tr = b.indexOf("tRNS"), id = b.indexOf("IDAT"); return tr !== -1 && (id === -1 || tr < id); }
  if (/\.webp$/i.test(file)) { const k = b.toString("ascii", 12, 16); return k === "VP8X" ? (b[20] & 0x10) !== 0 : k === "VP8L"; }
  return false;
};
const thumbJobs = [];
const PR = 1320, phoneJobs = new Map();
const phoneJob = (src, dataSlug, w) => {
  if (phoneJobs.has(src)) return;
  /* narrower than a phone draws it: only worth a rung when it is heavy */
  if (w <= PR) { let b = 0; try { b = fs.statSync(path.join(ROOT, "public", src)).size; } catch (e) { return; } if (b < 200 * 1024) return; }
  const base = src.split("/").pop().replace(/\.[a-z0-9]+$/i, ""), tw = Math.min(PR, w);
  phoneJobs.set(src, { src, tw, from: path.join(ROOT, "public", src), to: "/lab/density/thumbs/" + dataSlug + "/" + base + "@" + tw });
};
function thumbs(src, houseKey, dataSlug, w) {
  const base = src.split("/").pop().replace(/\.[a-z0-9]+$/i, "");
  const out = {};
  phoneJob(src, dataSlug, w);
  for (const n of [384, 768]) {
    if (n === 768 && w <= 900) continue;
    const board = ["board-thumbs/" + houseKey, "board-thumbs/" + dataSlug].map((d) => "/lab/" + d + "/" + base + "@" + n + ".webp").find((u) => fs.existsSync(path.join(ROOT, "public", u)));
    if (board) { out["t" + n] = board; continue; }
    const rel = "/lab/density/thumbs/" + dataSlug + "/" + base + "@" + n + ".webp";
    out["t" + n] = rel;
    thumbJobs.push({ from: path.join(ROOT, "public", src), to: path.join(ROOT, "public", rel), n });
  }
  return out;
}

/* ── the studies ── */
const frags = [], studies = [], skipped = [];
let fid = 0;
/* si is the section a fragment came from and pi the paragraph, both in
   the study's own order, so a view can set a study back into its
   sentences and sections without guessing */
let SI = 0, PI = 0;
const add = (k, kind, o) => { const f = { id: kind[0] + (++fid).toString(36), k, kind, si: SI, pi: PI, ...o }; frags.push(f); return f; };

for (const s of Object.values(H.studies)) {
  const file = "src/data/" + s.h + "-case-study.ts";
  if (!fs.existsSync(path.join(ROOT, file))) { skipped.push(s.k); continue; }
  const study = Object.values(load(file)).find((v) => v && typeof v === "object" && Array.isArray(v.sections));
  if (!study) { skipped.push(s.k); continue; }
  const k = s.k;
  /* the picture the board already chose for the study's tile */
  let lead = null;
  if (s.frames && s.frames[0]) {
    const t384 = s.frames[0], full = t384.replace("@384", "");
    if (fs.existsSync(path.join(ROOT, "public", full))) { lead = { src: full, t384, t768: s.r768 ? t384.replace("@384", "@768") : null, w: s.nat[0], h: s.nat[1] }; phoneJob(full, s.h, s.nat[0]); }
  }
  /* the picture the study opens on: its hero section's (a carousel's first
     slide), which is what sits at the top of the study's own page. The
     Stack shelf sets these one over another (27 Sept, his "stacked the
     heros ... pulled the big nice images from the top of each case study") */
  let top = null;
  const hs = study.sections.find((x) => x.type === "hero" || x.type === "hero-carousel");
  if (hs) {
    const slide = hs.slides && hs.slides[0];
    const src = hs.image || hs.src || (slide && (slide.src || slide.image)) || null;
    const d = src && imageDimensions[src];
    if (d) top = { src, w: d[0], h: d[1], alt: clean(hs.alt || (slide && slide.alt) || ""), alpha: hasAlpha(path.join(ROOT, "public", src)), ...thumbs(src, k, s.h, d[0]) };
  }
  studies.push({ k, h: s.h, t: s.t, s: s.s, y: s.y, tags: s.tags, fact: s.fact, rest: s.rest, palette: s.palette, fill: s.fill, ink: s.ink, lead, top });

  /* every picture it names, once, with the first words written for it */
  const seen = new Map();
  const pic = (src, alt, where) => {
    if (typeof src !== "string" || !/^\/case-studies\/.+\.(jpe?g|png|webp|avif)$/i.test(src)) return;
    /* Faux Reel's frames are other studies' pictures, cut into its reel:
       they belong to those studies, and it shows as its own playground */
    if (k === "sizzle") return;
    if (seen.has(src)) { const f = seen.get(src); if (f && !f.alt && alt) f.alt = clean(alt); return; }
    const d = imageDimensions[src]; if (!d) { seen.set(src, null); return; }
    if (d[0] < 480) { seen.set(src, null); return; }
    const f = add(k, "pic", { src, w: d[0], h: d[1], alt: clean(alt), alpha: hasAlpha(path.join(ROOT, "public", src)), where, ...thumbs(src, k, s.h, d[0]) });
    seen.set(src, f);
  };
  const walkPics = (v, where) => {
    if (Array.isArray(v)) return v.forEach((x) => walkPics(x, where));
    if (!v || typeof v !== "object") return;
    for (const [key, x] of Object.entries(v)) {
      if (typeof x === "string") pic(x, v.alt || v[key + "Alt"] || v.caption || v.title || "", where);
      else if (Array.isArray(x) && x.every((e) => typeof e === "string")) x.forEach((e) => pic(e, "", where));
      else walkPics(x, where);
    }
  };

  /* the palette the study declares, which the board's fills come from */
  if (s.palette && s.palette.length) add(k, "palette", { title: "Palette", colors: s.palette.map((hex) => ({ hex })), where: "declared" });
  let head = "";
  for (const sec of study.sections) {
    const where = sec.type; SI++; PI++;
    switch (sec.type) {
      case "meta": {
        if (sec.subtitle) add(k, "line", { text: clean(sec.subtitle), weight: "sub", where });
        if (sec.abstract) paras(sec.abstract).forEach((p) => (PI++, sentences(p)).forEach((t) => add(k, "line", { text: t, weight: "body", where: "abstract", num: hasNumber(t) })));
        const facts = [];
        if (sec.field) facts.push(["Field", sec.field]);
        if (sec.author) facts.push(["Author", sec.author]);
        if (sec.published) facts.push(["Published", sec.published]);
        if (sec.status) facts.push(["Status", sec.status]);
        if (sec.classification && sec.classification.length) facts.push(["Classification", sec.classification.join(", ")]);
        (sec.summary || []).forEach((r) => facts.push([r.label, r.value]));
        facts.forEach(([label, value]) => add(k, "fact", { label: clean(label), value: clean(value), where }));
        break;
      }
      case "section-header": {
        /* a pressing headline is set in two halves: the title in ink and
           its held last line in grey. The fragment's text is the whole
           sentence, so every view reads it complete; ink and held keep the
           halves for a view that sets them two-tone */
        const held = clean(sec.pressing && sec.pressing.heldLine);
        head = clean(sec.title + (held ? " " + held : ""));
        add(k, "line", { text: head, weight: "head", label: clean(sec.label), where, ...(held ? { ink: clean(sec.title), held } : {}) });
        if (sec.subhead) add(k, "line", { text: clean(sec.subhead), weight: "sub", where });
        break;
      }
      case "editorial-headline": add(k, "line", { text: clean(sec.text || sec.content || sec.headline || ""), weight: "display", where }); break;
      case "text": case "text-right": {
        const big = sec.size === "xl" || sec.size === "subhead" || sec.size === "lg";
        paras(sec.content).forEach((p) => {
          PI++;
          if (big) add(k, "line", { text: p, weight: "sub", head, where });
          else sentences(p).forEach((t) => add(k, "line", { text: t, weight: "body", head, where, num: hasNumber(t) }));
        });
        break;
      }
      case "two-column-text":
        [[sec.leftTitle, sec.left], [sec.rightTitle, sec.right]].forEach(([t, c]) => paras(c).forEach((p) => (PI++, sentences(p)).forEach((x) => add(k, "line", { text: x, weight: "body", head: clean(t || head), where, num: hasNumber(x) }))));
        break;
      case "three-column-text":
        (sec.columns || []).forEach((c) => {
          PI++;
          if (c.title) add(k, "line", { text: clean(c.title), weight: "head", where, small: true });
          paras(c.content).forEach((p) => (PI++, sentences(p)).forEach((x) => add(k, "line", { text: x, weight: "body", head: clean(c.title || head), where, num: hasNumber(x) })));
        });
        break;
      case "stats-summary": (sec.items || []).forEach((i) => add(k, "num", { value: clean(i.value), label: clean(i.label), sub: clean(i.sublabel), where })); break;
      case "stats-bar":
        (sec.totals || []).forEach((i) => add(k, "num", { value: clean(i.value), label: clean(i.label), sub: clean(i.sub), where }));
        (sec.items || []).forEach((i) => add(k, "num", { value: clean(i.value), label: clean(i.label), sub: clean(i.description), where }));
        break;
      case "speed-comparison":
        add(k, "chart", { title: clean(sec.title), bars: (sec.items || []).map((i) => ({ label: clean(i.label), value: clean(i.value), width: i.width })), callout: clean(sec.callout), suffix: clean(sec.calloutSuffix), where });
        break;
      case "dev-timeline":
        add(k, "steps", { title: clean(sec.label), duration: clean(sec.duration), steps: (sec.phases || []).map((p) => ({ title: clean(p.name), note: clean(p.weeks) })), where });
        break;
      case "pipeline":
        add(k, "steps", { title: head, steps: (sec.steps || []).map((p) => ({ n: clean(p.number), title: clean(p.title), note: clean(p.description) })), where });
        break;
      case "timeline":
        add(k, "steps", { title: head, steps: (sec.items || []).map((p) => ({ title: clean(p.period), note: clean(p.description) })), where });
        break;
      case "tech-stack": (sec.items || []).forEach((i) => add(k, "tool", { label: clean(i.label), value: clean(i.value), where })); break;
      case "color-palette":
        add(k, "palette", { title: clean(sec.title || head), colors: (sec.colors || []).map((c) => ({ name: clean(c.name), hex: c.hex, role: clean(c.role) })), where });
        break;
      case "typography": (sec.fonts || []).forEach((f) => add(k, "type", { name: clean(f.name), role: clean(f.role), note: clean(f.description), sample: clean(f.sample), where })); break;
      case "feature-cards": (sec.items || []).forEach((i) => add(k, "line", { text: clean(i.title), weight: "head", small: true, note: clean(i.description), where })); break;
      /* a live page in a frame (1 Oct 2026, his "can we use live pages?"):
         a replay the Sally and DSC studies carry (mode demo: measured,
         scaled, paused when hidden), or one of the Sally system's own
         pages, set to walk itself down a viewport (scroll) or to stand at
         its full height (page). The room frames it; nothing is copied */
      case "product-demo": {
        const folder = sec.folder || "sally-demos";
        const replay = folder === "sally-demos" || folder === "dsc-demos";
        const fit = sec.mode === "fit"; /* a module made for the column: its own width, its own height */
        add(k, "live", {
          src: "/lab/" + folder + "/" + sec.demo + ".html" + (replay ? "?framed=1" + (sec.query ? "&" + sec.query : "") : sec.query ? "?" + sec.query : "") + (sec.hash ? "#" + sec.hash : ""), /* a replay keeps its framed flag and takes a query too, e.g. laptop=1 (3 Oct 2026) */
          w: fit ? 0 : sec.stageWidth || (replay ? 1120 : 1440),
          h: sec.viewHeight || 0,
          mode: sec.mode || (replay ? "demo" : "page"),
          phone: !fit && (!!sec.phone || (sec.stageWidth || 1120) <= 600), /* a phone-width replay sits narrow */
          bleed: fit && !!sec.bleed, /* a fit module edge to edge, as a full-width picture */
          /* a replay that draws its own laptop (laptop=1) sits on the room bare, no box behind it */
          ...(replay && /(^|&)laptop=1(&|$)/.test(sec.query || "") ? { bare: true } : {}),
          title: clean(sec.title || ""),
          note: clean(sec.note || ""),
          /* pages to tab between in the one frame (3 Oct 2026), each with its
             own address, title and note; the frame keeps its size and mode */
          ...(Array.isArray(sec.tabs) && sec.tabs.length > 1 ? { tabs: sec.tabs.map((t) => ({
            label: clean(t.label),
            src: "/lab/" + (t.folder || folder) + "/" + t.demo + ".html" + (t.query ? "?" + t.query : ""),
            title: clean(t.title || ""),
            note: clean(t.note || ""),
            at: t.at || "",
          })) } : {}),
          where,
        });
        break;
      }
      case "study-link":
        /* a card to another study's room; the room draws it with that study's cover */
        add(k, "link", { to: sec.study, label: clean(sec.label), note: clean(sec.note || ""), where });
        break;
      case "closing":
        paras(sec.content).forEach((p) => add(k, "line", { text: p, weight: "sub", where }));
        (sec.services || []).forEach((v) => add(k, "tool", { label: "Service", value: clean(v), where }));
        (sec.stack || []).forEach((v) => add(k, "tool", { label: "Stack", value: clean(v), where }));
        break;
    }
    walkPics(sec, where);
  }
  if (study.heroImage) pic(study.heroImage, "", "hero");
}

/* ── his own words about the practice, from the About draft ── */
const about = (H.about || []).map((a) => ({ id: a.id, name: a.name, lede: a.lede, body: a.body }));
about.forEach((a) => {
  add("about", "line", { text: clean(a.lede), weight: "sub", head: a.name, where: "about" });
  (a.body || []).forEach((p) => sentences(p).forEach((t) => add("about", "line", { text: t, weight: "body", head: a.name, where: "about", num: hasNumber(t) })));
});

/* ── the daybook: what got built, dated ── */
const days = (DAYBOOK || []).map((d) => {
  const body = Array.isArray(d.body) ? d.body.map(clean) : [clean(d.body)];
  const f = add("daybook", "day", { date: d.date, project: d.project, title: clean(d.title), body, link: d.link || null });
  if (d.image && imageDimensions[d.image.src]) {
    const dm = imageDimensions[d.image.src];
    Object.assign(f, { src: d.image.src, w: dm[0], h: dm[1], alt: clean(d.image.alt), ...thumbs(d.image.src, "daybook", "daybook", dm[0]) });
  }
  return f.id;
});

/* ── make the thumbnails the board does not already have ── */
let made = 0, failed = [];
for (const j of thumbJobs) {
  if (fs.existsSync(j.to)) continue;
  fs.mkdirSync(path.dirname(j.to), { recursive: true });
  try { await sharp(j.from).resize({ width: j.n, withoutEnlargement: true }).webp({ quality: 78 }).toFile(j.to); made++; }
  catch (e) { failed.push(path.basename(j.from)); }
}
/* a thumbnail that could not be made falls back to the file itself */
if (failed.length) frags.forEach((f) => ["t384", "t768"].forEach((r) => { if (f[r] && !fs.existsSync(path.join(ROOT, "public", f[r]))) f[r] = f.src; }));

/* ── the phone rungs (25 Oct 2026; see the head of this file) ── */
const MANIFEST = path.join(ROOT, "scripts/lib/phone-rungs.json");
let rungs = {}; try { rungs = JSON.parse(fs.readFileSync(MANIFEST, "utf8")); } catch (e) { /* first run */ }
const SS2 = !spawnSync("ssimulacra2", [], { stdio: "ignore" }).error;
const TMP = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "phone-rung-"));
/* the encodings tried, smallest first once made; JPEG only where nothing is see-through */
const ENCS = [
  ["jpg90", (im) => im.jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" }), "jpg"],
  ["jpg94", (im) => im.jpeg({ quality: 94, mozjpeg: true, chromaSubsampling: "4:4:4" }), "jpg"],
  ["jpg97", (im) => im.jpeg({ quality: 97, mozjpeg: true, chromaSubsampling: "4:4:4" }), "jpg"],
  ["webp94", (im) => im.webp({ quality: 94, effort: 4, smartSubsample: true, alphaQuality: 100 }), "webp"],
  ["webp97", (im) => im.webp({ quality: 97, effort: 4, smartSubsample: true, alphaQuality: 100 }), "webp"],
  ["webp100", (im) => im.webp({ quality: 100, effort: 4, smartSubsample: true, alphaQuality: 100 }), "webp"],
  ["webpNL60", (im) => im.webp({ nearLossless: true, quality: 60, effort: 4 }), "webp"],
  ["webpLL", (im) => im.webp({ lossless: true, effort: 4 }), "webp"],
];
const run = promisify(execFile);
const score = async (a, b) => +(await run("ssimulacra2", [a, b])).stdout.trim().split(/\s+/).pop();
const save = () => fs.writeFileSync(MANIFEST, JSON.stringify(Object.fromEntries(Object.entries(rungs).sort(([a], [b]) => a.localeCompare(b))), null, 1) + "\n");
let pMade = 0, pKept = 0, pSkipped = 0, seq = 0;
const phoneRung = async (j) => {
  let st; try { st = fs.statSync(j.from); } catch (e) { return; }
  const had = rungs[j.src];
  if (had && had.bytes === st.size && (had.keep || fs.existsSync(path.join(ROOT, "public", had.file)))) return;
  if (!SS2) { pSkipped++; return; }
  try {
    const meta = await sharp(j.from).metadata(), alpha = !!meta.hasAlpha, n = ++seq;
    /* the rung's pixels, colour profile kept, turned as the browser turns it */
    const base = await sharp(j.from).rotate().resize({ width: j.tw, kernel: "lanczos3", withoutEnlargement: true }).keepIccProfile().png().toBuffer();
    const flat = (im) => (alpha ? im.flatten({ background: "#808080" }) : im);
    const ref = path.join(TMP, n + "-ref.png"), cand = path.join(TMP, n + "-cand.png");
    await flat(sharp(base)).keepIccProfile().png().toFile(ref);
    /* the quick encodings first, scored smallest first; the two slow
       lossless-leaning ones only for a drawing or a screen, or when
       nothing quick reaches 90 */
    const slow = (name) => name === "webpNL60" || name === "webpLL";
    const flatArt = alpha || /\.png$/i.test(j.from);
    let pick = null, best = 0;
    for (const round of [ENCS.filter(([name]) => !slow(name) || (flatArt && name === "webpNL60")), ENCS.filter(([name]) => slow(name) && !(flatArt && name === "webpNL60"))]) {
      const tries = [];
      for (const [name, enc, ext] of round) { if (alpha && ext === "jpg") continue; tries.push({ name, ext, buf: await enc(sharp(base).keepIccProfile()).toBuffer() }); }
      tries.sort((a, b) => a.buf.length - b.buf.length);
      for (const t of tries) {
        await flat(sharp(t.buf)).keepIccProfile().png().toFile(cand);
        const s = await score(ref, cand); best = Math.max(best, s);
        if (s >= 90) { pick = Object.assign(t, { ss2: +s.toFixed(1) }); break; }
      }
      if (pick) break;
    }
    fs.rmSync(ref, { force: true }); fs.rmSync(cand, { force: true });
    const entry = { bytes: st.size, w: meta.width };
    if (!pick) Object.assign(entry, { keep: "original", why: "no encoding reached 90 (best " + best.toFixed(1) + ")" });
    else if (pick.buf.length > st.size * 0.85) Object.assign(entry, { keep: "original", why: "the rung was " + Math.round((100 * pick.buf.length) / st.size) + "% of the original's bytes", enc: pick.name, ss2: pick.ss2 });
    else {
      const file = j.to + "." + pick.ext;
      fs.mkdirSync(path.dirname(path.join(ROOT, "public", file)), { recursive: true });
      for (const x of ["jpg", "webp"]) { const o = path.join(ROOT, "public", j.to + "." + x); if (x !== pick.ext && fs.existsSync(o)) fs.unlinkSync(o); }
      fs.writeFileSync(path.join(ROOT, "public", file), pick.buf);
      Object.assign(entry, { file, pw: j.tw, enc: pick.name, ss2: pick.ss2, kb: Math.round(pick.buf.length / 1024) });
    }
    rungs[j.src] = entry; save();
    entry.keep ? pKept++ : pMade++;
  } catch (e) { console.log("phone rung failed for", j.src, String(e.message || e).slice(0, 120)); }
};
/* a few at once: each is a resize, a handful of encodes and a score or two */
const queue = [...phoneJobs.values()];
await Promise.all(Array.from({ length: Math.max(1, Math.min(6, os.cpus().length - 2)) }, async () => { while (queue.length) await phoneRung(queue.shift()); }));
fs.rmSync(TMP, { recursive: true, force: true });
save();
/* every copy of a picture carries its rung, wherever the fragments name it */
const tag = (f) => { const r = f && f.src && rungs[f.src]; if (r && r.file && fs.existsSync(path.join(ROOT, "public", r.file))) f.tp = r.file; };
frags.forEach(tag); studies.forEach((s) => { tag(s.top); tag(s.lead); });

const counts = frags.reduce((m, f) => ((m[f.kind] = (m[f.kind] || 0) + 1), m), {});
const out = { made: "26 Sept 2026", studies, lines: H.lines, about, practice: H.practice, method: H.method, links: H.links, email: H.email, statement: H.statement, frags };
const file = path.join(ROOT, "public/lab/density/fragments.js");
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, "/* generated by scripts/lib/density-fragments.mjs from src/data and the board's house data; do not edit by hand */\nwindow.DENSITY = " + JSON.stringify(out) + ";\n");
console.log("wrote", path.relative(ROOT, file), Math.round(fs.statSync(file).size / 1024) + "KB:", studies.length, "studies,", frags.length, "fragments", JSON.stringify(counts));
console.log("thumbnails: made", made, "of", thumbJobs.length, "needed", failed.length ? "; failed " + failed.join(", ") : "");
console.log("phone rungs:", Object.values(rungs).filter((r) => r.file).length, "in use; this run made", pMade, "and kept the original for", pKept, pSkipped ? "; " + pSkipped + " left for a machine with ssimulacra2" : "");
if (skipped.length) console.log("no data file for", skipped.join(", "));
