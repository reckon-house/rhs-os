/* ── DENSITY: THE ZOOM (26 Sept 2026) ─────────────────────────────────
   One plane, every fragment on it, and the distance decides what a
   fragment is. The header comment in zoom.html says why; this file is
   how. Loads after fragments.js and density.js.

   One layout, two renderers. Every text fragment is broken into lines
   once, with the canvas measuring the same fonts the page uses, and
   stored as rows. The canvas draws those rows as bars or as type; the
   close layer draws the same rows as HTML. That is what lets a bar turn
   into its words without anything moving. */
(() => {
"use strict";
const D = window.D, DATA = D.data;
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
/* the house never shows an em dash; a few alts and one date carry one */
const clean = (s) => String(s == null ? "" : s).replace(/\s*\u2014\s*/g, " · ");

/* ── TYPE, in world units: one unit is one CSS pixel at 1:1 ─────────── */
const SANS = '"Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif';
const SERIF = '"RH Ogg", "Ogg", Georgia, "Times New Roman", serif';
const T = {
  title:   { fam: SERIF, wt: 700, size: 50, lh: 50, track: -0.012 },
  title2:  { fam: SERIF, wt: 700, size: 40, lh: 41, track: -0.012 },
  title3:  { fam: SERIF, wt: 700, size: 31, lh: 33, track: -0.01 },
  tmeta:   { fam: SANS, wt: 600, size: 13, lh: 18, track: -0.004 },
  lede:    { fam: SANS, wt: 600, size: 20, lh: 28, track: -0.012 },
  sub:     { fam: SANS, wt: 600, size: 16, lh: 24, track: -0.008 },
  body:    { fam: SANS, wt: 400, size: 15, lh: 23, track: 0 },
  label:   { fam: SANS, wt: 600, size: 10.5, lh: 15, track: 0.06, caps: true },
  shead:   { fam: SERIF, wt: 700, size: 30, lh: 32, track: -0.006 },
  chead:   { fam: SANS, wt: 700, size: 15, lh: 22, track: -0.004 },
  display: { fam: SERIF, wt: 700, size: 42, lh: 44, track: -0.01 },
  numv:    { fam: SERIF, wt: 700, size: 78, lh: 80, track: -0.01 },
  small:   { fam: SANS, wt: 500, size: 13, lh: 18, track: 0 },
  dayt:    { fam: SANS, wt: 700, size: 15, lh: 21, track: -0.004 },
  dayb:    { fam: SANS, wt: 400, size: 14, lh: 21, track: 0 },
};
const fontAt = (k, px) => T[k].wt + " " + px + "px " + T[k].fam;
/* the same fonts as CSS, written from the same table so they cannot drift */
(() => {
  const css = Object.entries(T).map(([k, t]) => "#page .f-" + k + "{font:" + t.wt + " " + t.size + "px/" + t.lh + "px " + t.fam +
    ";letter-spacing:" + t.track + "em;height:" + t.lh + "px}").join("\n");
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();

/* ── MEASURING ─────────────────────────────────────────────────────── */
const mc = document.createElement("canvas").getContext("2d");
const WC = new Map();
function mw(k, s) {
  const key = k + "\u0001" + s; let w = WC.get(key);
  if (w == null) { mc.font = fontAt(k, T[k].size); w = mc.measureText(s).width + T[k].track * T[k].size * [...s].length; WC.set(key, w); }
  return w;
}
/* where the baseline sits in a line box, the way CSS puts it: half the
   leading above the font's own ascent */
const BASE = {};
function metrics() {
  for (const k in T) {
    mc.font = fontAt(k, 100); const m = mc.measureText("Hxg");
    const a = (m.fontBoundingBoxAscent || 80) / 100, d = (m.fontBoundingBoxDescent || 20) / 100;
    BASE[k] = (T[k].lh - (a + d) * T[k].size) / 2 + a * T[k].size;
  }
}
/* break runs of words into lines. A run is {t, c}: c is the colour
   (ink, grey, or the tile's own ink). Returns lines of runs with x. */
function wrap(runs, k, maxW) {
  const toks = [];
  runs.forEach((r) => { let t = clean(r.t); if (T[k].caps) t = t.toUpperCase(); t.split(/\s+/).filter(Boolean).forEach((w) => toks.push({ t: w, c: r.c, href: r.href })); });
  const sp = mw(k, " "); const lines = []; let cur = [], cw = 0;
  for (const tk of toks) {
    const w = mw(k, tk.t);
    if (cur.length && cw + sp + w > maxW) { lines.push(cur); cur = []; cw = 0; }
    cw += (cur.length ? sp : 0) + w; cur.push({ ...tk, w });
  }
  if (cur.length) lines.push(cur);
  return lines.map((ln) => {
    const out = []; let x = 0;
    ln.forEach((tk, i) => {
      if (i) x += sp;
      const last = out[out.length - 1];
      if (last && last.c === tk.c && last.href === tk.href) { last.t += " " + tk.t; last.w = x + tk.w - last.x; }
      else out.push({ t: tk.t, c: tk.c, href: tk.href, x, w: tk.w });
      x += tk.w;
    });
    return { runs: out, w: x };
  });
}

/* ── BLOCKS: a fragment (or a run of them) set in a column ─────────── */
const COL = 300, GUT = 34, GAP = 26, IN = 10;
const blk = (type, ids) => ({ type, rows: [], w: COL, h: 0, ids: ids || [], glue: false, pre: 0 });
function put(b, runs, k, x, y, maxW) {
  const ls = wrap(runs, k, maxW == null ? b.w - x : maxW); const lh = T[k].lh;
  ls.forEach((ln, i) => b.rows.push({ t: "text", k, x, y: y + i * lh, runs: ln.runs, w: ln.w }));
  return ls.length * lh;
}
const rect = (b, x, y, w, h, c) => b.rows.push({ t: "rect", x, y, w, h, c });
/* his leads come in two halves, the ink and the grey, split on a bar */
const halves = (text) => { const p = String(text).split(/\s*\|\s*/); return p.length < 2 ? [{ t: p[0], c: "ink" }] : [{ t: p[0], c: "ink" }, { t: p.slice(1).join(" "), c: "grey" }]; };

function tile(k) {
  const s = D.study(k); const b = blk("tile"); const pad = 22, inner = COL - pad * 2;
  b.fill = s ? s.fill : k === "about" ? "#000000" : "#EDE7E2";
  b.ink = s ? s.ink : k === "about" ? "#FFFFFF" : "#000000";
  b.href = D.href(k); b.k = k;
  /* the biggest title size whose longest word still fits the tile */
  const name = D.title(k);
  const key = ["title", "title2", "title3"].find((tk) => name.split(/\s+/).every((w) => mw(tk, w) <= inner) && wrap([{ t: name, c: "tile" }], tk, inner).length <= 3) || "title3";
  let y = pad; y += put(b, [{ t: name, c: "tile" }], key, pad, y, inner); y += 12;
  if (s) y += put(b, [{ t: String(s.y), c: "tile" }, { t: s.s, c: "tileg" }], "tmeta", pad, y, inner);
  else if (k === "about") (DATA.practice || []).forEach((p) => { y += put(b, [{ t: p, c: "tileg" }], "tmeta", pad, y, inner); });
  b.h = Math.max(y + pad, 232);
  return b;
}
function lede(f, k) { const b = blk("lede", [f.id]); b.h = put(b, halves(f.text), k || "lede", 0, 0); b.hasNum = !!f.num; return b; }
function para(items) {
  const b = blk("para", items.map((f) => f.id)); b.hasNum = items.some((f) => f.num);
  const runs = []; items.forEach((f) => halves(f.text).forEach((r) => runs.push(r)));
  b.h = put(b, runs, "body", 0, 0); return b;
}
function shead(f) {
  const b = blk("shead", [f.id]); let y = 0;
  if (f.head) { y += put(b, [{ t: f.head, c: "grey" }], "label", 0, 0); y += 7; }
  y += put(b, [{ t: f.text, c: "ink" }], "shead", 0, y); b.h = y; b.glue = true; b.pre = 18; return b;
}
function chead(text, ids) { const b = blk("chead", ids); b.h = put(b, [{ t: text, c: "ink" }], "chead", 0, 0); b.glue = true; b.pre = 6; return b; }
function display(f) { const b = blk("display", [f.id]); b.h = put(b, [{ t: f.text, c: "ink" }], "display", 0, 0); b.pre = 14; return b; }
function num(f) {
  const b = blk("num", [f.id]); let y = 0;
  y += put(b, [{ t: f.value, c: "ink" }], "numv", 0, 0);
  y += put(b, [{ t: f.label, c: "ink" }], "label", 0, y);
  if (f.sub) { y += 2; y += put(b, [{ t: f.sub, c: "grey" }], "small", 0, y); }
  b.h = y; return b;
}
/* a spec table: the label small in grey, the value beside it */
function table(list, lab, val, type) {
  const b = blk(type || "facts", list.map((f) => f.id).filter(Boolean)); const LW = 96; let y = 0;
  list.forEach((f) => {
    rect(b, 0, y, COL, 1, "hair"); y += 7;
    const h1 = put(b, [{ t: lab(f), c: "grey" }], "label", 0, y + 1.5, LW - 10);
    const h2 = put(b, [{ t: val(f), c: "ink" }], "small", LW, y, COL - LW);
    y += Math.max(h1 + 1.5, h2) + 6;
  });
  b.h = y; return b;
}
function tools(list) {
  const b = blk("tools", list.map((f) => f.id)); const groups = [];
  list.forEach((f) => { let g = groups.find((x) => x.label === f.label); if (!g) groups.push((g = { label: f.label, vals: [] })); g.vals.push(f.value); });
  const cw = groups.length > 1 ? (COL - 16) / 2 : COL; let maxY = 0, colY = [0, 0];
  groups.forEach((g, i) => {
    const c = groups.length > 1 ? i % 2 : 0; const x = c * (cw + 16); let y = colY[c];
    rect(b, x, y, cw, 1, "hair"); y += 7;
    y += put(b, [{ t: g.label, c: "grey" }], "label", x, y, cw); y += 3;
    g.vals.forEach((v) => { y += put(b, [{ t: v, c: "ink" }], "small", x, y, cw); });
    colY[c] = y + 12; maxY = Math.max(maxY, y);
  });
  b.h = maxY; return b;
}
function palette(f) {
  const b = blk("palette", [f.id]); const n = f.colors.length, g = 4, sw = (COL - g * (n - 1)) / n;
  f.colors.forEach((c, i) => { rect(b, i * (sw + g), 0, sw, 58, c.hex); put(b, [{ t: c.hex, c: "grey" }], "label", i * (sw + g), 64, sw + g); });
  b.h = 64 + T.label.lh; return b;
}
function chart(f) {
  const b = blk("chart", [f.id]); let y = 0;
  y += put(b, [{ t: f.title, c: "grey" }], "label", 0, 0); y += 10;
  f.bars.forEach((bar) => {
    y += put(b, [{ t: bar.label, c: "ink" }, { t: bar.value, c: "grey" }], "small", 0, y); y += 3;
    rect(b, 0, y, Math.max(3, COL * bar.width / 100), 9, "ink"); y += 9 + 12;
  });
  if (f.callout) { y += put(b, [{ t: f.callout, c: "ink" }], "numv", 0, y); if (f.suffix) y += put(b, [{ t: f.suffix, c: "ink" }], "label", 0, y); }
  b.h = y; return b;
}
function steps(f) {
  const b = blk("steps", [f.id]); let y = 0;
  y += put(b, [{ t: f.title, c: "grey" }], "label", 0, 0);
  if (f.duration) { y += 3; y += put(b, [{ t: f.duration, c: "ink" }], "small", 0, y); }
  y += 8;
  f.steps.forEach((st) => { rect(b, 0, y, COL, 1, "hair"); y += 6; y += put(b, [{ t: st.title, c: "ink" }, { t: st.note || "", c: "grey" }], "small", 0, y); y += 5; });
  b.h = y; return b;
}
function day(f) {
  const b = blk("day", [f.id]); let y = 0;
  y += put(b, [{ t: f.date, c: "ink" }, { t: f.project, c: "grey" }], "label", 0, 0); y += 5;
  if (f.title) { y += put(b, [{ t: f.title, c: "ink" }], "dayt", 0, y); y += 3; }
  f.body.forEach((p, i) => { if (i) y += 7; y += put(b, [{ t: p, c: "ink" }], "dayb", 0, y); });
  if (f.link && f.link.label) { y += 6; y += put(b, [{ t: f.link.label, c: "grey", href: f.link.href }], "small", 0, y); }
  b.h = y; return b;
}

/* ── ISLANDS: a study's fragments as one sheet ──────────────────────── */
/* its words in page order, with the spec table, the palette and the
   tools gathered into one block each where they first appear */
function studyWords(k) {
  const out = [tile(k)]; const pics = [];
  let run = null, facts = null, tl = null, pal = null, ledeDone = false;
  const flush = () => { if (run) { out.push(para(run.items)); run = null; } };
  for (const f of D.byStudy(k)) {
    if (f.kind === "pic") { pics.push(f); continue; }
    if (f.kind === "line" && f.weight === "body") {
      const key = (f.where || "") + "|" + (f.head || "");
      if (run && run.key === key && run.items.length < 4 && run.len + f.text.length < 560) { run.items.push(f); run.len += f.text.length; }
      else { flush(); run = { key, items: [f], len: f.text.length }; }
      continue;
    }
    flush();
    if (f.kind === "palette") { pal = f; continue; }
    if (f.kind === "fact") { if (f.label === "Author") continue; if (!facts) { facts = []; out.push({ ph: "facts" }); } facts.push(f); continue; }
    if (f.kind === "tool") { if (!tl) { tl = []; out.push({ ph: "tools" }); } tl.push(f); continue; }
    if (f.kind === "line") {
      if (f.weight === "sub") { out.push(lede(f, !ledeDone && f.where === "meta" ? "lede" : "sub")); if (f.where === "meta") ledeDone = true; }
      else if (f.weight === "display") out.push(display(f));
      else if (f.weight === "head") out.push(f.where === "section-header" ? shead(f) : chead(f.text, [f.id]));
      continue;
    }
    if (f.kind === "num") out.push(num(f));
    else if (f.kind === "chart") out.push(chart(f));
    else if (f.kind === "steps") out.push(steps(f));
  }
  flush();
  const words = [];
  out.forEach((b) => {
    if (b.ph === "facts") { words.push(table(facts, (f) => f.label, (f) => f.value)); if (pal) { words.push(palette(pal)); pal = null; } }
    else if (b.ph === "tools") words.push(tools(tl));
    else words.push(b);
  });
  if (pal) words.push(palette(pal));
  return { words, pics };
}
function aboutWords() {
  const st = DATA.statement || {};
  const words = [tile("about")];
  if (st.ink) words.push(lede({ id: "", text: st.ink + (st.grey ? " | " + st.grey : "") }, "lede"));
  let head = null, run = null;
  const flush = () => { if (run) { words.push(para(run)); run = null; } };
  for (const f of D.byStudy("about")) {
    if (f.head !== head) { flush(); head = f.head; if (head) words.push(chead(head, [])); }
    if (f.weight === "body") { if (run && run.length < 4) run.push(f); else { flush(); run = [f]; } }
    else { flush(); words.push(lede(f, "sub")); }
  }
  flush();
  if (DATA.method && DATA.method.length) words.push(table(DATA.method, (m) => m.k, (m) => m.v, "method"));
  if (DATA.links && DATA.links.length) {
    const b = blk("links"); let y = 0;
    DATA.links.forEach((l) => { rect(b, 0, y, COL, 1, "hair"); y += 6; y += put(b, [{ t: l.k, c: "ink", href: l.v }], "chead", 0, y); y += 4; });
    b.h = y; words.push(b);
  }
  return { words, pics: [] };
}
function daybookWords() {
  const words = [tile("daybook")];
  D.byKind("day").forEach((f) => words.push(day(f)));
  return { words, pics: [] };
}

/* pictures in rows, each at its own shape, never cropped: a contact
   sheet of the small ones first, then the study's plates (its heroes
   and full-width images) in bigger rows under it, so an island runs from
   dense to open. No row is ever taller than its least honest picture
   allows at 1:1. */
const R = 200, R2 = 430, PG = 12, BANDGAP = 56;
const BIG = (f) => f.where === "hero" || f.where === "image";
function band(pics, W) {
  const out = []; let y = 0;
  const rows = (list, RH, stretch) => {
    let row = [], sum = 0;
    const flushRow = (last) => {
      if (!row.length) return;
      let h = (W - PG * (row.length - 1)) / sum;
      if (last && h > RH) h = RH;
      h = Math.min(h, RH * stretch);
      row.forEach((f) => { h = Math.min(h, D.maxCss(f) / (f.w / f.h)); });
      let x = 0;
      row.forEach((f) => { const w = (f.w / f.h) * h; out.push({ type: "pic", f, x, y, w, h, ids: [f.id] }); x += w + PG; });
      y += h + PG; row = []; sum = 0;
    };
    for (const f of list) { row.push(f); sum += f.w / f.h; if (sum * RH + PG * (row.length - 1) >= W) flushRow(false); }
    flushRow(true);
  };
  const small = pics.filter((f) => !BIG(f)), big = pics.filter(BIG);
  rows(small, R, 1.9);
  if (small.length && big.length) y += 24;
  rows(big, R2, 1.4);
  return { blocks: out, h: y ? y - PG : 0 };
}
/* the words fill columns in reading order; the shortest height that
   fits them in n columns is found by halving */
function units(words) {
  const us = []; let cur = null;
  for (const b of words) {
    if (cur && cur.open) { cur.blocks.push(b); cur.h += IN + b.h; cur.open = b.glue; }
    else { cur = { blocks: [b], h: b.h, pre: b.pre || 0, open: b.glue }; us.push(cur); }
  }
  return us;
}
function fill(us, H, apply) {
  let c = 0, y = 0; const heights = [0];
  for (const u of us) {
    const add = (y ? GAP + u.pre : 0) + u.h;
    if (y && y + add > H) { c++; y = 0; heights.push(0); }
    let yy = y ? y + GAP + u.pre : 0;
    if (apply) u.blocks.forEach((b, i) => { if (i) yy += IN; b.x = c * (COL + GUT); b.y = yy; yy += b.h; });
    y = (y ? y + GAP + u.pre : 0) + u.h; heights[c] = y;
  }
  return heights;
}
function arrange(isl, aspect) {
  const us = units(isl.words); let best = null;
  const tallest = Math.max(...us.map((u) => u.h)), total = us.reduce((a, u) => a + u.h + GAP + u.pre, 0);
  for (let n = 1; n <= 18; n++) {
    let lo = tallest, hi = total;
    for (let i = 0; i < 28; i++) { const mid = (lo + hi) / 2; if (fill(us, mid).length <= n) hi = mid; else lo = mid; }
    const cols = fill(us, hi); const W = cols.length * COL + (cols.length - 1) * GUT; const Tn = Math.max(...cols);
    const bd = band(isl.pics, Math.max(W, COL)); const H = Tn + (bd.h ? BANDGAP + bd.h : 0);
    const cost = Math.abs(Math.log(W / H / aspect)) + (cols.length < n ? 0.001 * n : 0);
    if (!best || cost < best.cost) best = { cost, H: hi, W, Tn, bd, n: cols.length };
    if (cols.length < n) break;
  }
  fill(us, best.H, true);
  isl.w = best.W; isl.textH = best.Tn;
  isl.band = best.bd.blocks; isl.band.forEach((p) => { p.y += best.Tn + BANDGAP; p.x += 0; });
  isl.h = best.Tn + (best.bd.h ? BANDGAP + best.bd.h : 0);
  isl.all = isl.words.concat(isl.band);
  isl.all.forEach((b, i) => { b.i = i; });
}

/* each study's pictures get a colour of its own palette for the far view,
   the mid and dark ones, until a thumbnail has arrived */
function tones(isl) {
  const s = D.study(isl.k); const pal = (s && s.palette) || ["#d9d3cd"];
  const usable = pal.filter((h) => D.lum(h) < 0.55); const list = usable.length ? usable : pal;
  let hsh = 0; for (const ch of isl.k) hsh = (hsh * 31 + ch.charCodeAt(0)) >>> 0;
  isl.band.forEach((p, i) => { p.tone = list[(hsh + i * 7) % list.length]; });
}

/* ── THE PLANE ──────────────────────────────────────────────────────── */
/* the board's lines from the screen to the room */
const ORDER = ["app", "systems", "digital", "creative", "branding", "interiors"];
const LINES = ORDER.map((t) => D.lines[t]).filter(Boolean);
const Y0 = 2008, Y1 = 2026;
let ISL = [], P = null, GEO = null;

function build() {
  const list = [];
  const add = (k, got, year, v) => list.push({ k, name: D.title(k), year, v, words: got.words, pics: got.pics });
  /* About is the legend: the empty corner under the early years */
  add("about", aboutWords(), Y0 + 1.4, 5.7);
  D.studies.forEach((s) => {
    const idx = (s.tags || []).map((t) => ORDER.indexOf(t)).filter((i) => i >= 0);
    add(s.k, studyWords(s.k), s.y, idx.length ? idx.reduce((a, b) => a + b, 0) / idx.length : 2.5);
  });
  add("daybook", daybookWords(), Y1 + 1.7, 2.2);
  ISL = list;
}
function place(tall) {
  GEO = tall ? { YW: 560, BH: 5200, aspect: 0.72, GX: 300, GY: 420 } : { YW: 1500, BH: 2150, aspect: 1.3, GX: 380, GY: 360 };
  ISL.forEach((isl) => { arrange(isl, isl.k === "daybook" ? GEO.aspect * 1.25 : GEO.aspect); tones(isl); });
  const X = (y) => (y - Y0) * GEO.YW, Y = (v) => v * GEO.BH;
  /* candidate offsets from an island's own spot, nearest first. Moving
     in time costs a little more than moving between lines. */
  const offs = []; const STEP = tall ? 140 : 180, RX = tall ? 9000 : 16000, RY = tall ? 20000 : 11000;
  for (let dx = -RX; dx <= RX; dx += STEP) for (let dy = -RY; dy <= RY; dy += STEP) offs.push([dx, dy, dx * dx * (tall ? 0.6 : 1.15) + dy * dy]);
  offs.sort((a, b) => a[2] - b[2]);
  const placed = [];
  const hit = (x, y, w, h) => placed.some((o) => x < o.x + o.w + GEO.GX && o.x < x + w + GEO.GX && y < o.y + o.h + GEO.GY && o.y < y + h + GEO.GY);
  [...ISL].sort((a, b) => b.w * b.h - a.w * a.h).forEach((isl) => {
    const ax = X(isl.year), ay = Y(isl.v);
    for (const [dx, dy] of offs) {
      const x = ax + dx - isl.w / 2, y = ay + dy - isl.h / 2;
      if (!hit(x, y, isl.w, isl.h)) { isl.x = x; isl.y = y; placed.push(isl); break; }
    }
    isl.ax = ax; isl.ay = ay;
  });
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  ISL.forEach((i) => { x0 = Math.min(x0, i.x); y0 = Math.min(y0, i.y); x1 = Math.max(x1, i.x + i.w); y1 = Math.max(y1, i.y + i.h); });
  const lm = tall ? 500 : 300;
  y0 = Math.min(y0, Y(0) - (tall ? 700 : 300)); y1 = Math.max(y1, Y(LINES.length - 1) + 300);
  P = { x0: x0 - lm, y0: y0 - 260, x1: x1 + 260, y1: y1 + (tall ? 700 : 560), X, Y, ruler: y1 + (tall ? 380 : 300) };
  P.w = P.x1 - P.x0; P.h = P.y1 - P.y0;
}

/* ── CAMERA ─────────────────────────────────────────────────────────── */
const cv = $("map"); cv.setAttribute("role", "img"); cv.setAttribute("aria-label", "Map");
const ctx = cv.getContext("2d"), page = $("page"), stage = $("stage");
let VW = 0, VH = 0, DPR = 1, TALL = null;
const cam = { x: 0, y: 0, s: 0.05 };
const sx = (x) => (x - cam.x) * cam.s + VW / 2, sy = (y) => (y - cam.y) * cam.s + VH / 2;
const wx = (px) => (px - VW / 2) / cam.s + cam.x, wy = (py) => (py - VH / 2) / cam.s + cam.y;
const pads = () => (TALL ? { t: 60, b: 40, l: 16, r: 16 } : { t: 74, b: 50, l: 32, r: 32 });
function fitRect(x, y, w, h, p, maxS) {
  const s = Math.min((VW - p.l - p.r) / w, (VH - p.t - p.b) / h, maxS || 9);
  const cxs = (p.l + VW - p.r) / 2, cys = (p.t + VH - p.b) / 2;
  return { x: x + w / 2 - (cxs - VW / 2) / s, y: y + h / 2 - (cys - VH / 2) / s, s };
}
/* the whole map, with a column on the left for the line names */
const fitAll = () => fitRect(P.x0, P.y0, P.w, P.h, TALL ? { t: 64, b: 40, l: 16, r: 16 } : { t: 74, b: 50, l: 168, r: 36 });
/* an island framed with room for its name: the contact-sheet distance */
const frameOf = (isl) => fitRect(isl.x - 60, isl.y - 110, isl.w + 120, isl.h + 170, TALL ? { t: 64, b: 24, l: 12, r: 12 } : { t: 84, b: 40, l: 64, r: 64 }, 0.46);
let MINS = 0.01; const MAXS = 1.6;
function clampCam() {
  cam.s = clamp(cam.s, MINS, MAXS);
  cam.x = clamp(cam.x, P.x0, P.x1); cam.y = clamp(cam.y, P.y0, P.y1);
}

/* the zoom-out-then-in path for a long trip (van Wijk and Nuij 2003) */
function zpath(p0, p1) {
  const rho = Math.SQRT2, rho2 = 2, rho4 = 4;
  const [ux0, uy0, w0] = p0, [ux1, uy1, w1] = p1, dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy;
  if (d2 < 1e-6) { const S = Math.log(w1 / w0) / rho; return { S: Math.abs(S), at: (t) => [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)] }; }
  const d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1), S = (r1 - r0) / rho;
  return { S, at: (t) => { const s = t * S, c0 = Math.cosh(r0), u = (w0 / (rho2 * d1)) * (c0 * Math.tanh(rho * s + r0) - Math.sinh(r0)); return [ux0 + u * dx, uy0 + u * dy, (w0 * c0) / Math.cosh(rho * s + r0)]; } };
}
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
let flight = null, wheelZ = null, glide = null;
function flyTo(t, isl) {
  wheelZ = null; glide = null;
  const p = zpath([cam.x, cam.y, VW / cam.s], [t.x, t.y, VW / t.s]);
  flight = { p, t0: performance.now(), dur: REDUCE ? 1 : clamp(p.S * 430, 420, 1600), isl: isl || null, end: t };
  try { history.replaceState(null, "", isl ? "#" + isl.k : location.pathname + location.search); } catch (e) { /* a sandboxed frame */ }
  need();
}
const stop = () => { flight = null; glide = null; };

/* ── PICTURES FOR THE CANVAS: thumbnails only, only what is on the glass ── */
/* Each loaded thumbnail also keeps a copy 64px across, made once with a
   good filter, so a tile a few pixels wide is drawn from a small bitmap
   and does not shimmer while the camera moves. */
const IM = new Map(); let QUEUE = [], ASK = [], inflight = 0;
function shrink(im) {
  let w = im.naturalWidth, h = im.naturalHeight, src = im;
  while (Math.max(w, h) > 128) {
    const c = document.createElement("canvas"); w = Math.max(1, Math.round(w / 2)); h = Math.max(1, Math.round(h / 2));
    c.width = w; c.height = h; const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(src, 0, 0, w, h); src = c;
  }
  return src;
}
function pump() {
  if (ASK.length) { ASK.sort((a, b) => b.a - a.a); ASK.forEach((q) => QUEUE.push(q.u)); ASK = []; }
  while (inflight < 6 && QUEUE.length) {
    const u = QUEUE.shift(); const rec = IM.get(u); if (!rec || rec.state) continue;
    rec.state = 1; inflight++;
    const im = new Image(); im.decoding = "async";
    im.onload = () => { rec.state = 2; rec.img = im; try { rec.small = shrink(im); } catch (e) { rec.small = im; } inflight--; need(); pump(); };
    im.onerror = () => { rec.state = 3; inflight--; pump(); };
    im.src = encodeURI(u);
  }
}
function want(u, area) { let r = IM.get(u); if (!r) { r = { state: 0 }; IM.set(u, r); ASK.push({ u, a: area }); } return r; }
/* the best loaded rung for a tile this wide, and ask for a better one */
function thumbFor(f, cssW, cssH) {
  const need = cssW * DPR; const rungs = [f.t384, f.t768, f.src].filter(Boolean);
  const target = Math.min(need <= 384 ? 0 : need <= 768 ? 1 : 2, rungs.length - 1); /* a rung only up to its own pixels (review, 26 Sept) */
  if (cssW >= 3) want(rungs[target], cssW * cssH);
  for (let i = rungs.length - 1; i >= 0; i--) {
    const r = IM.get(rungs[i]);
    if (r && r.state === 2) return Math.max(cssW, cssH) * DPR <= 96 && r.small ? r.small : r.img;
  }
  return null;
}

/* ── DRAWING ────────────────────────────────────────────────────────── */
const TEXT_PX = 6.3;           /* below this a line is a bar */
const DOM_A = 0.5, DOM_B = 0.62; /* the canvas hands over to HTML */
const FOC_A = 0.075, FOC_B = 0.15;
let focus = null, hover = null, HITS = null, LINE = null, dirty = true, lastFont = "";
function inkOf(c, b, bar, k) {
  if (c === "tile") return b.ink;
  if (c === "tileg") return b.ink === "#FFFFFF" || b.ink === "#ffffff" ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.5)";
  if (c === "grey") return bar ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.42)";
  if (c === "hair") return "rgba(0,0,0,0.13)";
  if (c === "ink") return bar ? (k === "body" || k === "dayb" || k === "small" ? "rgba(0,0,0,0.36)" : "rgba(0,0,0,0.86)") : "#000";
  return c;
}
function drawBlock(b, isl, s) {
  const X = sx(isl.x + b.x), Y = sy(isl.y + b.y), W = b.w * s, H = b.h * s;
  if (X > VW || Y > VH || X + W < 0 || Y + H < 0) return;
  if (b.type === "pic") {
    const im = thumbFor(b.f, W, H);
    if (im) { if (b.f.alpha) { ctx.fillStyle = "#EDE7E2"; ctx.fillRect(X, Y, W, H); } ctx.drawImage(im, X, Y, W, H); }
    else { ctx.fillStyle = b.tone; ctx.fillRect(X, Y, W, H); }
    return;
  }
  if (b.fill) { ctx.fillStyle = b.fill; ctx.fillRect(X, Y, W, H); }
  if (b.hasNum && s < 0.2) { ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(X - Math.max(9 * s, 2.2), Y + T.body.lh * 0.5 * s, Math.max(4 * s, 1.1), 0, 7); ctx.fill(); }
  for (const r of b.rows) {
    if (r.t === "rect") {
      if (r.c === "hair" && s < 0.12) continue;
      ctx.fillStyle = inkOf(r.c, b, false); ctx.fillRect(X + r.x * s, Y + r.y * s, Math.max(r.w * s, 0.6), Math.max(r.h * s, r.c === "hair" ? 0.5 : 0.6));
      continue;
    }
    const t = T[r.k], px = t.size * s, lx = X + r.x * s, ly = Y + r.y * s;
    if (ly > VH || ly + t.lh * s < 0) continue;
    if (px >= TEXT_PX) {
      const f = fontAt(r.k, px); if (f !== lastFont) { ctx.font = f; lastFont = f; }
      ctx.letterSpacing = t.track * px + "px";
      const base = ly + BASE[r.k] * s;
      for (const u of r.runs) { ctx.fillStyle = inkOf(u.c, b, false, r.k); ctx.fillText(u.t, lx + u.x * s, base); }
    } else if (r.k === "numv") {
      /* a figure, from far away, is a dot */
      ctx.fillStyle = "#000"; const rad = Math.max(t.size * 0.3 * s, 1.3);
      ctx.beginPath(); ctx.arc(lx + rad, ly + (t.lh * s) / 2, rad, 0, 7); ctx.fill();
    } else {
      const bh = Math.max(t.size * (t.caps ? 0.6 : 0.46) * s, 0.55), by = ly + (BASE[r.k] - t.size * 0.33) * s - bh / 2;
      for (const u of r.runs) { ctx.fillStyle = inkOf(u.c, b, true, r.k); ctx.fillRect(lx + u.x * s, by, Math.max(u.w * s, 0.6), bh); }
    }
  }
}
/* the axes: guides under the islands, names and years over them */
function drawAxes(s, a, over) {
  if (a <= 0.01) return;
  ctx.save(); ctx.globalAlpha = a;
  const lx = TALL ? 12 : 32;
  ctx.textBaseline = "middle";
  LINES.forEach((L, i) => {
    const y = sy(P.Y(i)); if (y < 50 || y > VH - 30) return;
    if (!over) { ctx.fillStyle = LINE === L ? L.color : "rgba(0,0,0,0.07)"; ctx.fillRect(lx, y, Math.max(0, sx(P.x1) - lx), 1); return; }
    const fs = TALL ? 14 : clamp(19 * Math.sqrt(s / 0.045), 15, 26);
    ctx.font = "700 " + fs + "px " + SERIF; ctx.letterSpacing = "0px";
    const w = ctx.measureText(L.name).width; L.hit = [lx - 6, y - fs * 0.7, w + 30, fs * 1.4];
    ctx.fillStyle = "#fff"; ctx.fillRect(lx - 4, y - fs * 0.62, w + 30, fs * 1.24);
    ctx.fillStyle = L.color; ctx.fillRect(lx, y - 4, 8, 8);
    ctx.fillStyle = LINE && LINE !== L ? "rgba(0,0,0,0.3)" : "#000"; ctx.fillText(L.name, lx + 15, y + 1);
    if (LINE === L) ctx.fillRect(lx + 15, y + fs * 0.52, w, 1);
  });
  if (over) {
    /* the years along the foot; a year with no study in it stays grey */
    const ry = Math.min(sy(P.ruler), VH - (TALL ? 14 : 20));
    const has = new Set(D.studies.map((st) => st.y));
    const r0 = Math.max(0, sx(P.X(Y0) - 300)), r1 = Math.min(VW, sx(P.X(Y1) + 300));
    ctx.fillStyle = "#fff"; ctx.fillRect(r0, ry - 13, r1 - r0, 22);
    ctx.fillStyle = "rgba(0,0,0,0.13)"; ctx.fillRect(r0, ry - 12, r1 - r0, 1);
    ctx.font = "600 " + (TALL ? 9.5 : 11) + "px " + SANS; ctx.letterSpacing = "0.02em"; ctx.textAlign = "center";
    let lastX = -99;
    for (let yr = Y0; yr <= Y1; yr++) {
      const x = sx(P.X(yr)); if (x < -20 || x > VW + 20) continue;
      ctx.fillStyle = has.has(yr) ? "#000" : "rgba(0,0,0,0.25)"; ctx.fillRect(x, ry - 16, 1, 5);
      if (x - lastX < (TALL ? 30 : 36)) continue; lastX = x;
      ctx.fillStyle = has.has(yr) ? "#000" : "rgba(0,0,0,0.3)"; ctx.fillText(String(yr), x, ry);
    }
    ctx.textAlign = "left";
  }
  ctx.restore(); lastFont = "";
}
/* island names in small type, the biggest island first. A name may run
   past its island's edge into open paper, but never over another island
   or another name: then it is cut to its island's width, or left out. */
function drawNames(s, a) {
  if (a <= 0.01) return;
  ctx.save(); ctx.textBaseline = "alphabetic"; ctx.letterSpacing = "-0.01em";
  const fs = TALL ? 9.5 : 10.5; ctx.font = "600 " + fs + "px " + SANS;
  const ry = Math.min(sy(P.ruler), VH - (TALL ? 14 : 20));
  const taken = [[0, ry - 20, VW, 40], [0, 0, TALL ? 0 : 150, VH]];
  const rects = ISL.map((i) => [sx(i.x), sy(i.y), i.w * s, i.h * s, i]);
  const over = (bx) => taken.some((o) => bx[0] < o[0] + o[2] && o[0] < bx[0] + bx[2] && bx[1] < o[1] + o[3] && o[1] < bx[1] + bx[3]) ||
    rects.some((r) => r[4] !== bx[4] && bx[0] < r[0] + r[2] && r[0] < bx[0] + bx[2] && bx[1] < r[1] + r[3] && r[1] < bx[1] + bx[3]);
  const order = [...ISL].sort((p, q) => q.w * q.h - p.w * p.h);
  for (const isl of order) {
    if (HITS && !isl.hitCount) continue;
    if (LINE && !isl.inLine) continue;
    const x = sx(isl.x), y = sy(isl.y) - (TALL ? 4 : 6), iw = isl.w * s;
    if (x > VW || x + iw < 0 || y > VH + fs || sy(isl.y + isl.h) < 0) continue;
    const yr = isl.k === "about" || isl.k === "daybook" ? "" : String(isl.year);
    const w1f = ctx.measureText(isl.name).width, wyf = yr ? 5 + ctx.measureText(yr).width : 0;
    const yb = sy(isl.y + isl.h) + fs + (TALL ? 3 : 5), xr = x + iw - w1f - wyf;
    /* whole names only: above, below, then flush right above or below */
    const tries = [[x, y], [x, yb], [xr, y], [xr, yb]];
    let pick = null, box = null;
    for (const [xx, yy] of tries) { const bx = [xx - 2, yy - fs, w1f + wyf + 4, fs + 3, isl]; if (bx[0] + bx[2] > VW - 6 || bx[0] < 4) continue; if (!over(bx)) { pick = [isl.name, w1f, wyf, yy, xx]; box = bx; break; } }
    if (!pick) continue;
    const [name, w1, wy, ly, lx] = pick;
    taken.push(box);
    ctx.globalAlpha = a * (isl.a == null ? 1 : Math.max(0.35, isl.a));
    ctx.fillStyle = "#000"; ctx.fillText(name, lx, ly);
    if (wy) { ctx.fillStyle = "rgba(0,0,0,0.42)"; ctx.fillText(yr, lx + w1 + 5, ly); }
  }
  ctx.restore(); lastFont = "";
}
function draw() {
  const s = cam.s;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, VW, VH); lastFont = "";
  const axesA = 1 - smooth(0.085, 0.17, s);
  drawAxes(s, axesA, false);
  /* The canvas draws at full strength until the HTML is fully in, so
     the two never mix into a paler picture. After that it only holds
     cream where a picture is still loading. */
  const close = s >= DOM_B;
  ctx.textBaseline = "alphabetic";
  for (const isl of ISL) {
    const X = sx(isl.x), Y = sy(isl.y);
    if (X > VW || Y > VH || X + isl.w * s < 0 || Y + isl.h * s < 0) continue;
    const ia = isl.a == null ? 1 : isl.a;
    if (ia <= 0.01) continue;
    ctx.globalAlpha = 1; ctx.fillStyle = "#fff"; ctx.fillRect(X - 40 * s, Y - 40 * s, (isl.w + 80) * s, (isl.h + 80) * s);
    for (const b of isl.all) {
      if (close) {
        if (b.type !== "pic") continue;
        const bx = sx(isl.x + b.x), by = sy(isl.y + b.y);
        if (bx > VW || by > VH || bx + b.w * s < 0 || by + b.h * s < 0) continue;
        ctx.globalAlpha = ia * (HITS && !b.hit ? 0.14 : 1); ctx.fillStyle = "#EDE7E2"; ctx.fillRect(bx, by, b.w * s, b.h * s); continue;
      }
      ctx.globalAlpha = HITS ? ia * (b.hit ? 1 : 0.1) : ia;
      if (HITS && b.hit && s < 0.13) {
        /* from far away a match is a black field */
        const bx = sx(isl.x + b.x), by = sy(isl.y + b.y);
        ctx.fillStyle = "#000"; ctx.fillRect(bx, by, Math.max(b.w * s, 2), Math.max(b.h * s, 2)); continue;
      }
      drawBlock(b, isl, s);
    }
  }
  ctx.globalAlpha = 1;
  drawAxes(s, axesA, true);
  drawNames(s, 1 - smooth(0.12, 0.19, s));
  pump();
}

/* ── THE CLOSE LAYER: HTML for what is on the glass, nothing else ───── */
const LIVE = new Map(); let settled = true;
function blockEl(isl, b) {
  const e = document.createElement(b.href ? "a" : "div");
  e.className = "b" + (b.type === "pic" ? " pic" : "");
  e.style.cssText = "left:" + (isl.x + b.x) + "px;top:" + (isl.y + b.y) + "px;width:" + b.w + "px;height:" + b.h + "px";
  if (b.href) { e.href = b.href; e.draggable = false; }
  if (b.fill) { e.style.background = b.fill; e.style.color = b.ink; }
  if (b.type === "pic") {
    const shown = Math.min(b.w * cam.s, D.maxCss(b.f));
    const im = D.img(b.f, shown, { eager: true }); im.draggable = false; im.alt = clean(b.f.alt);
    const on = () => im.classList.add("in");
    if (im.complete && im.naturalWidth) on(); else im.addEventListener("load", on, { once: true });
    if (b.f.alpha) e.classList.add("cream");
    e.appendChild(im); b.imgEl = im;
    return e;
  }
  for (const r of b.rows) {
    if (r.t === "rect") {
      const d = document.createElement("div"); d.className = "sw";
      d.style.cssText = "left:" + r.x + "px;top:" + r.y + "px;width:" + r.w + "px;height:" + r.h + "px;background:" + inkOf(r.c, b, false);
      e.appendChild(d); continue;
    }
    const href = r.runs.length === 1 && r.runs[0].href;
    const d = document.createElement(href ? "a" : "div"); d.className = "r f-" + r.k;
    if (href) { d.href = href; d.draggable = false; if (/^https?:/.test(href)) { d.target = "_blank"; d.rel = "noopener"; } }
    d.style.left = r.x + "px"; d.style.top = r.y + "px";
    d.innerHTML = r.runs.map((u) => '<span class="c-' + u.c + '">' + D.esc(u.t) + "</span>").join(" ");
    e.appendChild(d);
  }
  return e;
}
/* a picture box keeps its place; the picture in it stops growing at
   half its own pixels and sits centred on cream */
function honest(v) {
  const b = v.b, s = cam.s, max = D.maxCss(b.f);
  let w = b.w, h = b.h, x = 0, y = 0;
  if (b.w * s > max) { w = max / s; h = (w * b.h) / b.w; x = (b.w - w) / 2; y = (b.h - h) / 2; }
  const key = Math.round(w * 10) + ":" + Math.round(h * 10);
  if (v.hk === key) return; v.hk = key;
  const im = b.imgEl; im.style.left = x + "px"; im.style.top = y + "px"; im.style.width = w + "px"; im.style.height = h + "px";
  v.el.classList.toggle("cream", !!b.f.alpha || w < b.w - 0.5);
}
function syncPage() {
  const s = cam.s, a = smooth(DOM_A, DOM_B, s);
  if (a <= 0) {
    if (LIVE.size) { LIVE.forEach((v) => v.el.remove()); LIVE.clear(); }
    if (page.style.opacity !== "0") page.style.opacity = "0";
    return;
  }
  page.style.opacity = String(a);
  page.style.transform = "translate(" + (VW / 2 - cam.x * s) + "px," + (VH / 2 - cam.y * s) + "px) scale(" + s + ")";
  const m = 0.3, x0 = wx(-VW * m), x1 = wx(VW * (1 + m)), y0 = wy(-VH * m), y1 = wy(VH * (1 + m));
  const keep = new Set();
  for (const isl of ISL) {
    if (isl.x > x1 || isl.y > y1 || isl.x + isl.w < x0 || isl.y + isl.h < y0) continue;
    for (const b of isl.all) {
      const bx = isl.x + b.x, by = isl.y + b.y;
      if (bx > x1 || by > y1 || bx + b.w < x0 || by + b.h < y0) continue;
      const key = isl.k + ":" + b.i; keep.add(key);
      let v = LIVE.get(key);
      if (!v) { v = { el: blockEl(isl, b), isl, b, op: "" }; LIVE.set(key, v); page.appendChild(v.el); }
    }
  }
  for (const [key, v] of LIVE) if (!keep.has(key)) { v.el.remove(); LIVE.delete(key); }
  for (const v of LIVE.values()) {
    const op = String(Math.round((v.isl.a == null ? 1 : v.isl.a) * (HITS ? (v.b.hit ? 1 : 0.14) : 1) * 100) / 100);
    if (v.op !== op) { v.el.style.opacity = op; v.op = op; }
    if (v.b.type === "pic") honest(v);
  }
}
/* when the camera rests, each picture asks for the file its size needs */
function settle() {
  for (const v of LIVE.values()) if (v.b.type === "pic" && v.b.imgEl) {
    const shown = Math.max(1, Math.round(Math.min(v.b.w * cam.s, D.maxCss(v.b.f))));
    if (v.b.imgEl.sizes !== shown + "px") v.b.imgEl.sizes = shown + "px";
  }
}

/* ── WHERE YOU ARE ──────────────────────────────────────────────────── */
const here = $("here"), scaleEl = $("scale"), veil = $("veil");
let lastHere = "", lastScale = "", lastVeil = "";
function islandAt(x, y, slack) {
  const sl = slack || 0;
  return ISL.find((i) => x >= i.x - sl && x <= i.x + i.w + sl && y >= i.y - sl - 60 && y <= i.y + i.h + sl) || null;
}
function nearest(x, y) {
  let best = null, bd = Infinity;
  for (const i of ISL) { const dx = Math.max(i.x - x, 0, x - i.x - i.w), dy = Math.max(i.y - y, 0, y - i.y - i.h), d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }
  return { isl: best, d: Math.sqrt(bd) };
}
function chrome() {
  const s = cam.s;
  if (flight && flight.isl) focus = flight.isl;
  else if (s >= FOC_A) { const cx = wx(VW / 2), cy = wy((VH + pads().t - pads().b) / 2); const n = nearest(cx, cy); focus = n.d < (VW / s) * 0.35 ? n.isl : null; }
  else focus = null;
  const who = focus || (s < FOC_A ? hover : null);
  const txt = who ? D.esc(who.name) + (who.k !== "about" && who.k !== "daybook" ? "<i>" + who.year + "</i>" : "")
    : LINE ? D.esc(LINE.name) + "<i>" + D.esc(LINE.sentence || "") + "</i>" : "";
  if (txt !== lastHere) { here.innerHTML = txt; lastHere = txt; markIndex(who); }
  const sc = s < 0.95 ? "1:" + Math.round(1 / s) : s <= 1.05 ? "1:1" : (Math.round(s * 10) / 10) + ":1";
  if (sc !== lastScale) { scaleEl.textContent = sc; lastScale = sc; }
  /* up close the words run under the chrome, so it gets a strip of paper */
  const va = String(Math.round(smooth(0.1, 0.28, s) * 100) / 100);
  if (va !== lastVeil) { veil.style.opacity = va; lastVeil = va; }
}
/* the island you are on stays black and the rest go pale; from far
   away the one under the pointer is the one in ink */
function alphas() {
  const s = cam.s, tf = smooth(FOC_A, FOC_B, s); let moving = false;
  for (const isl of ISL) {
    let t = 1;
    if (focus) t = isl === focus ? 1 : 1 - 0.76 * tf;
    else if (hover && s < FOC_A) t = isl === hover ? 1 : 0.62;
    if (HITS && !isl.hitCount) t = Math.min(t, 0.5);
    if (LINE && !isl.inLine) t = Math.min(t, 0.12);
    if (isl.a == null) isl.a = t;
    const d = t - isl.a; if (Math.abs(d) > 0.004) { isl.a += d * 0.2; moving = true; } else isl.a = t;
  }
  return moving;
}

/* ── THE LOOP ───────────────────────────────────────────────────────── */
let raf = 0, lastT = 0, restT = 0;
function need() { dirty = true; if (!raf) raf = requestAnimationFrame(tick); }
function tick(now) {
  raf = 0; const dt = lastT ? Math.min(64, now - lastT) : 16; lastT = now; let go = false;
  if (flight) {
    const k = clamp((now - flight.t0) / flight.dur, 0, 1); const [x, y, w] = flight.p.at(easeIO(k));
    cam.x = x; cam.y = y; cam.s = VW / w;
    if (k >= 1) { cam.x = flight.end.x; cam.y = flight.end.y; cam.s = flight.end.s; flight = null; }
    go = true;
  }
  if (wheelZ) {
    const f = wheelZ.direct ? 1 : 1 - Math.pow(1 - 0.3, dt / 16);
    cam.s = Math.exp(Math.log(cam.s) + (Math.log(wheelZ.s) - Math.log(cam.s)) * f);
    if (Math.abs(cam.s / wheelZ.s - 1) < 0.002) cam.s = wheelZ.s;
    cam.x = wheelZ.wx - (wheelZ.px - VW / 2) / cam.s; cam.y = wheelZ.wy - (wheelZ.py - VH / 2) / cam.s;
    if (cam.s === wheelZ.s) wheelZ = null; else go = true;
  }
  if (glide) {
    cam.x -= (glide.vx * dt) / cam.s; cam.y -= (glide.vy * dt) / cam.s;
    const fr = Math.pow(0.92, dt / 16); glide.vx *= fr; glide.vy *= fr;
    if (Math.hypot(glide.vx, glide.vy) < 0.02) glide = null; else go = true;
  }
  if (!flight) clampCam();
  chrome();
  if (alphas()) go = true;
  draw(); syncPage(); dirty = false;
  if (go) { restT = now; settled = false; }
  else if (!settled && now - restT > 180) { settled = true; settle(); }
  else if (!settled) go = true;
  if (go || dirty) raf = requestAnimationFrame(tick); else lastT = 0;
}

/* ── HANDS ──────────────────────────────────────────────────────────── */
const PTR = new Map(); let drag = null, pinch = null, swallow = false;
function zoomAt(px, py, k, direct) {
  flight = null; glide = null;
  const base = wheelZ ? wheelZ.s : cam.s;
  wheelZ = { s: clamp(base * k, MINS, MAXS), px, py, wx: wx(px), wy: wy(py), direct: !!direct };
  need();
}
stage.addEventListener("wheel", (e) => {
  e.preventDefault();
  let dx = e.deltaX, dy = e.deltaY;
  if (e.deltaMode === 1) { dx *= 16; dy *= 16; } else if (e.deltaMode === 2) { dx *= VH; dy *= VH; }
  const small = e.deltaMode === 0 && Math.abs(dy) < 40;
  if (e.ctrlKey) zoomAt(e.clientX, e.clientY, Math.exp(-dy * 0.011), true);
  else if (Math.abs(dx) > Math.abs(dy) * 1.2) { stop(); wheelZ = null; cam.x += dx / cam.s; need(); }
  else zoomAt(e.clientX, e.clientY, Math.exp(-dy * 0.0026), small);
}, { passive: false });
/* Safari's trackpad pinch */
let gs = 1;
stage.addEventListener("gesturestart", (e) => { e.preventDefault(); gs = 1; });
stage.addEventListener("gesturechange", (e) => { e.preventDefault(); zoomAt(e.clientX, e.clientY, e.scale / gs, true); gs = e.scale; });

stage.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "mouse" && e.button !== 0) return;
  PTR.set(e.pointerId, { x: e.clientX, y: e.clientY });
  flight = null; glide = null; wheelZ = null;
  if (PTR.size === 1) drag = { id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, dist: 0, vx: 0, vy: 0, t: performance.now(), type: e.pointerType };
  else if (PTR.size === 2) {
    const [a, b] = [...PTR.values()];
    pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }; if (drag) drag.dist = 99; drag = null;
  }
});
stage.addEventListener("pointermove", (e) => {
  const p = PTR.get(e.pointerId);
  if (!p) {
    /* from far away, the island under the pointer is named */
    if (e.pointerType === "mouse" && cam.s < FOC_A) {
      const onLine = !!lineAt(e.clientX, e.clientY); stage.style.cursor = onLine ? "pointer" : "";
      const h = onLine ? null : islandAt(wx(e.clientX), wy(e.clientY), 120);
      if (h !== hover) { hover = h; need(); }
    }
    return;
  }
  p.x = e.clientX; p.y = e.clientY;
  if (pinch && PTR.size >= 2) {
    const [a, b] = [...PTR.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const w0x = wx(pinch.mx), w0y = wy(pinch.my);
    cam.s = clamp(cam.s * (d / pinch.d), MINS, MAXS);
    cam.x = w0x - (mx - VW / 2) / cam.s; cam.y = w0y - (my - VH / 2) / cam.s;
    pinch.d = d; pinch.mx = mx; pinch.my = my; swallow = true; need(); return;
  }
  if (!drag || drag.id !== e.pointerId) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y, now = performance.now(), dt = Math.max(1, now - drag.t);
  drag.dist = Math.max(drag.dist, Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0));
  if (drag.dist > 4) {
    if (!stage.classList.contains("drag")) { stage.classList.add("drag"); try { stage.setPointerCapture(e.pointerId); } catch (err) { /* gone */ } }
    cam.x -= dx / cam.s; cam.y -= dy / cam.s;
    drag.vx = drag.vx * 0.6 + (dx / dt) * 0.4; drag.vy = drag.vy * 0.6 + (dy / dt) * 0.4;
    need();
  }
  drag.x = e.clientX; drag.y = e.clientY; drag.t = now;
});
function up(e) {
  if (!PTR.has(e.pointerId)) return;
  PTR.delete(e.pointerId);
  if (pinch && PTR.size < 2) { pinch = null; drag = null; return; }
  if (drag && drag.id === e.pointerId) {
    stage.classList.remove("drag");
    if (drag.dist > 4) {
      swallow = true;
      if (performance.now() - drag.t < 80 && Math.hypot(drag.vx, drag.vy) > 0.05) { glide = { vx: drag.vx, vy: drag.vy }; need(); }
    } else if (drag.type !== "mouse" && e.type === "pointerup") {
      /* a tap on glass flies in, unless it landed on a link */
      const L = lineAt(e.clientX, e.clientY);
      if (L) setLine(L);
      else if (!(e.target.closest && e.target.closest("a"))) flyIn(e.clientX, e.clientY);
    }
    drag = null;
  }
}
stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
stage.addEventListener("click", (e) => { if (swallow) { e.preventDefault(); e.stopPropagation(); swallow = false; } }, true);
stage.addEventListener("pointerdown", () => { swallow = false; }, true);
stage.addEventListener("dblclick", (e) => { e.preventDefault(); flyIn(e.clientX, e.clientY); });
stage.addEventListener("pointerleave", () => { if (hover) { hover = null; need(); } });

/* a line name, from far away, lights its studies across the years */
function lineAt(px, py) {
  if (cam.s >= 0.085) return null;
  return LINES.find((L) => L.hit && px >= L.hit[0] && px <= L.hit[0] + L.hit[2] && py >= L.hit[1] && py <= L.hit[1] + L.hit[3]) || null;
}
function setLine(L) {
  LINE = L && LINE !== L ? L : null;
  ISL.forEach((isl) => { isl.inLine = !!LINE && (LINE.studies || []).includes(isl.k); });
  need();
}
let lastTouch = 0;
stage.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") lastTouch = performance.now(); });
stage.addEventListener("click", (e) => {
  if (e.defaultPrevented || performance.now() - lastTouch < 800) return;
  const L = lineAt(e.clientX, e.clientY); if (L) setLine(L);
});
/* in: to the island, then into its words where you pointed */
function flyIn(px, py) {
  const x = wx(px), y = wy(py);
  const isl = islandAt(x, y, 160 / Math.max(cam.s, 0.05) * 0.2) || (cam.s < FOC_A ? (() => { const n = nearest(x, y); return n.d < 40 / cam.s ? n.isl : null; })() : null);
  if (isl) {
    const f = frameOf(isl);
    if (focus !== isl || cam.s < f.s * 0.9) { flyTo(f, isl); return; }
    const one = TALL ? (VW - 28) / COL : 1;
    const s = cam.s < one * 0.9 ? one : Math.min(MAXS, cam.s * 1.4);
    /* land on the nearest block, not on the paper between blocks */
    let tx = x, ty = y, best = null, bd = Infinity;
    for (const b of isl.all) {
      const bx = isl.x + b.x, by = isl.y + b.y;
      const dx = Math.max(bx - x, 0, x - bx - b.w), dy = Math.max(by - y, 0, y - by - b.h), d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = b; }
    }
    if (best && bd > 0) { tx = clamp(x, isl.x + best.x + 20, isl.x + best.x + best.w - 20); ty = clamp(y, isl.y + best.y + 20, isl.y + best.y + best.h - 20); }
    /* a phone reads one column at a time: centre the column that was tapped */
    if (TALL && best && best.type !== "pic") { flyTo({ x: isl.x + best.x + best.w / 2, y: ty - (py - VH / 2) / s, s }, isl); return; }
    flyTo({ x: tx - (px - VW / 2) / s, y: ty - (py - VH / 2) / s, s }, isl); return;
  }
  const s = Math.min(MAXS, cam.s * 2.2); flyTo({ x: x - (px - VW / 2) / s, y: y - (py - VH / 2) / s, s });
}
/* out: from the words to the island, from the island to the map */
function flyOut() {
  if (LINE && !focus) { setLine(null); return; }
  if (focus && cam.s > frameOf(focus).s * 1.15) flyTo(frameOf(focus), focus);
  else flyTo(fitAll());
}
addEventListener("keydown", (e) => {
  const typing = e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA");
  if (e.key === "Escape") {
    if (IDX.classList.contains("on")) { toggleIndex(false); return; }
    if (typing) { if (e.target.value) { e.target.value = ""; runSearch(""); } else e.target.blur(); return; }
    flyOut(); return;
  }
  if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
  const step = 140;
  if (e.key === "ArrowLeft") { stop(); cam.x -= step / cam.s; need(); }
  else if (e.key === "ArrowRight") { stop(); cam.x += step / cam.s; need(); }
  else if (e.key === "ArrowUp") { stop(); cam.y -= step / cam.s; need(); }
  else if (e.key === "ArrowDown") { stop(); cam.y += step / cam.s; need(); }
  else if (e.key === "+" || e.key === "=") zoomAt(VW / 2, VH / 2, 1.6);
  else if (e.key === "-" || e.key === "_") zoomAt(VW / 2, VH / 2, 1 / 1.6);
  else if (e.key === "0") flyTo(fitAll());
  else if (e.key === "/") { e.preventDefault(); (TALL ? $("q2") : $("q")).focus(); }
});

/* ── INDEX: every island in a plain list ────────────────────────────── */
const IDX = $("index"), LIST = $("list");
function buildIndex() {
  LIST.innerHTML = "";
  const order = [ISL.find((i) => i.k === "about"), ISL.find((i) => i.k === "daybook"), ...ISL.filter((i) => D.study(i.k)).sort((a, b) => b.year - a.year || a.name.localeCompare(b.name))];
  order.forEach((isl) => {
    const li = document.createElement("li"); li.dataset.k = isl.k;
    const s = D.study(isl.k);
    const btn = document.createElement("button"); btn.type = "button";
    btn.innerHTML = '<span class="sw" style="background:' + (s ? s.fill : isl.k === "about" ? "#000" : "#EDE7E2") + '"></span><span class="t">' + D.esc(isl.name) + "</span>" + (s ? "<i>" + s.y + "</i>" : "");
    btn.addEventListener("click", () => { toggleIndex(false); flyTo(frameOf(isl), isl); });
    li.appendChild(btn); LIST.appendChild(li);
  });
}
function markIndex(isl) { LIST.querySelectorAll("li").forEach((li) => li.classList.toggle("here", !!isl && li.dataset.k === isl.k)); }
function toggleIndex(on) { IDX.classList.toggle("on", on); }
$("idx").addEventListener("click", () => toggleIndex(!IDX.classList.contains("on")));
IDX.querySelector(".x").addEventListener("click", () => toggleIndex(false));

/* ── SEARCH: the fragments that match stay in ink ───────────────────── */
let qTimer = 0;
function runSearch(q) {
  const res = q.trim() ? D.search(q) : [];
  let hits = res.filter((r) => r.score >= 3); if (!hits.length) hits = res.slice(0, 24);
  HITS = hits.length ? new Set(hits.map((r) => r.f.id)) : null;
  ISL.forEach((isl) => { isl.hitCount = 0; isl.all.forEach((b) => { b.hit = !!HITS && b.ids.some((id) => HITS.has(id)); if (b.hit) isl.hitCount++; }); });
  const n = HITS ? String(hits.length) : "";
  $("qn").textContent = n; $("qn2").textContent = n;
  need();
}
function flyToHits() {
  if (!HITS) return;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  ISL.forEach((isl) => isl.all.forEach((b) => { if (!b.hit) return; x0 = Math.min(x0, isl.x + b.x); y0 = Math.min(y0, isl.y + b.y); x1 = Math.max(x1, isl.x + b.x + b.w); y1 = Math.max(y1, isl.y + b.y + b.h); }));
  if (x0 === Infinity) return;
  const t = fitRect(x0 - 200, y0 - 200, x1 - x0 + 400, y1 - y0 + 400, pads(), 0.52);
  const only = ISL.filter((i) => i.hitCount); flyTo(t, only.length === 1 ? only[0] : null);
}
["q", "q2"].forEach((id) => {
  const inp = $(id);
  inp.addEventListener("input", () => { const other = $(id === "q" ? "q2" : "q"); other.value = inp.value; clearTimeout(qTimer); qTimer = setTimeout(() => runSearch(inp.value), 140); });
  inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { clearTimeout(qTimer); runSearch(inp.value); toggleIndex(false); inp.blur(); flyToHits(); } });
});

/* ── SIZE ───────────────────────────────────────────────────────────── */
function resize(first) {
  const ow = VW, oh = VH; VW = innerWidth; VH = innerHeight; DPR = Math.min(2, devicePixelRatio || 1);
  cv.width = Math.round(VW * DPR); cv.height = Math.round(VH * DPR); cv.style.width = VW + "px"; cv.style.height = VH + "px";
  const tall = VW / VH < 0.9;
  if (tall !== TALL) {
    TALL = tall; document.body.classList.toggle("tall", TALL);
    const keep = focus && !first ? focus.k : null;
    place(TALL); MINS = fitAll().s * 0.7;
    LIVE.forEach((v) => v.el.remove()); LIVE.clear();
    const k = keep || (first ? decodeURIComponent(location.hash.slice(1)) : "");
    const isl = k && ISL.find((i) => i.k === k);
    Object.assign(cam, isl ? frameOf(isl) : fitAll());
  } else if (!first && ow) {
    /* same glass, new size: keep the middle where it was */
    MINS = fitAll().s * 0.7; cam.s = Math.max(cam.s, MINS);
  }
  need();
}

/* ── START ──────────────────────────────────────────────────────────── */
async function start() {
  try {
    const loads = [400, 500, 600, 700].map((w) => document.fonts.load(w + " 15px " + SANS));
    loads.push(document.fonts.load("700 50px " + SERIF));
    await Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 2500))]);
  } catch (e) { /* the fallback faces measure the same way */ }
  metrics(); build();
  resize(true); buildIndex(); chrome();
  addEventListener("resize", () => resize(false));
  document.body.classList.add("ready");
  window.ZOOM = { cam, ISL, P, setLine: (tag) => setLine(tag ? LINES.find((L) => L.tag === tag) : null), flyTo, frameOf, fitAll, need, jump: (k, s) => { const i = ISL.find((x) => x.k === k); if (!i) return; const f = frameOf(i); Object.assign(cam, s ? { ...f, s } : f); flight = null; need(); }, search: runSearch, flyToHits };
}
start();
})();
