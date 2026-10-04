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

       node scripts/lib/density-fragments.mjs
*/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

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
function thumbs(src, houseKey, dataSlug, w) {
  const base = src.split("/").pop().replace(/\.[a-z0-9]+$/i, "");
  const out = {};
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
    if (fs.existsSync(path.join(ROOT, "public", full))) lead = { src: full, t384, t768: s.r768 ? t384.replace("@384", "@768") : null, w: s.nat[0], h: s.nat[1] };
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
          src: "/lab/" + folder + "/" + sec.demo + ".html" + (replay ? "?framed=1" : sec.query ? "?" + sec.query : "") + (sec.hash ? "#" + sec.hash : ""),
          w: fit ? 0 : sec.stageWidth || (replay ? 1120 : 1440),
          h: sec.viewHeight || 0,
          mode: sec.mode || (replay ? "demo" : "page"),
          phone: !fit && (!!sec.phone || (sec.stageWidth || 1120) <= 600), /* a phone-width replay sits narrow */
          bleed: fit && !!sec.bleed, /* a fit module edge to edge, as a full-width picture */
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

const counts = frags.reduce((m, f) => ((m[f.kind] = (m[f.kind] || 0) + 1), m), {});
const out = { made: "26 Sept 2026", studies, lines: H.lines, about, practice: H.practice, method: H.method, links: H.links, email: H.email, statement: H.statement, frags };
const file = path.join(ROOT, "public/lab/density/fragments.js");
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, "/* generated by scripts/lib/density-fragments.mjs from src/data and the board's house data; do not edit by hand */\nwindow.DENSITY = " + JSON.stringify(out) + ";\n");
console.log("wrote", path.relative(ROOT, file), Math.round(fs.statSync(file).size / 1024) + "KB:", studies.length, "studies,", frags.length, "fragments", JSON.stringify(counts));
console.log("thumbnails: made", made, "of", thumbJobs.length, "needed", failed.length ? "; failed " + failed.join(", ") : "");
if (skipped.length) console.log("no data file for", skipped.join(", "));
