/* ── THE BRIEF: THE PAGE'S LOGIC (26 Sept 2026) ──────────────────────
   brief.html says why. This file does four things, in order:
   1. RANK: a need, a line, a study or a clicked fragment becomes a
      ranked pool of fragments (D.search's plain counting, nothing else).
   2. COMPOSE: the pool becomes a spec: a headline, a lead picture,
      supporting pictures, figures, a sequence, tools, studies. The spec
      picks one of four spreads from what it found.
   3. PLACE: wide glass places each piece by hand; a phone lets the same
      pieces fall in one column.
   4. MOVE: pieces that are in both spreads travel to their new places,
      new ones arrive, old ones leave. Nothing is written here. */
(() => {
"use strict";
const D = window.D, DATA = D.data;
const body = document.body;
const $ = (s, r) => (r || document).querySelector(s);
const el = D.el;
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const q = $("#q");

/* no em dash reaches the screen: a range gets an en dash, a clause a comma */
const clean = (s) => String(s == null ? "" : s).replace(/(\d)\s*\u2014\s*(\d)/g, "$1\u2013$2").replace(/\s*\u2014\s*/g, ", ");
const T = (s) => D.esc(clean(s));
const reEsc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const BYID = new Map(D.frags.map((f) => [f.id, f]));
/* the six lines' sentences are fragments too, for a spread about a line */
const LINEF = new Map();
(DATA.lines || []).forEach((L) => LINEF.set("ln-" + L.tag, { id: "ln-" + L.tag, k: L.lead, kind: "line", weight: "display", text: L.sentence, where: "line" }));
const byId = (id) => BYID.get(id) || LINEF.get(id);

/* words that say nothing about the work */
const STOP = new Set(("a an the and or but of for to in on at by with from into about over as is are was were be been am im i'm i've ive me my mine " +
  "we our us you your it its it's this that these those there here what whats what's who how why when where which do does did can could would " +
  "should will may might need needs needed want wants looking look like just some something thing things get got make making new help really very " +
  "please working work up out so than then too also any all one have has had").split(/\s+/));
/* how rare a word is: a clicked fragment is looked for by its rarest words */
const DF = new Map();
D.frags.forEach((f) => new Set(D.tokens(D.words(f))).forEach((t) => DF.set(t, (DF.get(t) || 0) + 1)));
/* a figure inside one of his sentences */
const FIG = /\$\d[\d,.]*(?:[-–]\d[\d,.]*)?[MKB]?\+?|\b\d[\d,.]*(?:[-–]\d[\d,.]*)?\+?%|\b\d{1,3}(?:,\d{3})+\+?|\b\d[\d.]*(?:KB|MB|fps)\b|\b\d+\+|\b\d[\d.]*x\b/;
const SYS = ["system", "systems", "workflow", "workflows", "process", "operations", "operating", "automation", "ai", "agents", "strategy", "team", "teams", "timeline", "build"];

/* ── 1. RANK ─────────────────────────────────────────────────────── */
const ownSet = (keep, ts) => {
  const res = ts.map((t) => new RegExp("\\b" + reEsc(t)));
  return new Set(keep.filter((r) => { const w = D.words(r.f).toLowerCase(); return res.some((re) => re.test(w)); }).map((r) => r.f.id));
};
const needTokens = (s) => D.tokens(s).filter((t) => !STOP.has(t));
function rankQuery(s) {
  const ts = needTokens(s);
  if (!ts.length) return null;
  const res = D.search(ts.join(" "));
  if (!res.length) return { ts, keep: [], own: new Set(), top: 0 };
  const top = res[0].score, cut = Math.max(3, top * 0.5);
  const keep = res.filter((r) => r.score >= cut).slice(0, 500);
  return { ts, keep, own: ownSet(keep, ts), top };
}
/* more like this: the fragment itself, its own study, and anything else
   that shares its rarest words */
function rankSeed(f) {
  const ts = [...new Set(D.tokens(D.words(f)).filter((t) => !STOP.has(t) && t.length > 2 && (DF.get(t) || 0) >= 2 && !/^\d+$/.test(t)))]
    .sort((a, b) => DF.get(a) - DF.get(b)).slice(0, 5);
  const sr = ts.length ? D.search(ts.join(" ")) : [];
  const sc = new Map(sr.map((r) => [r.f.id, r.score]));
  const others = sr.filter((r) => r.f.k !== f.k);
  const cut = Math.max(4, (others[0] ? others[0].score : 0) * 0.6);
  const home = f.k === "daybook" ? (g) => g.kind === "day" && g.project === f.project : (g) => g.k === f.k;
  const keep = [];
  D.frags.forEach((g) => {
    const s = sc.get(g.id) || 0;
    if (g.id === f.id) keep.push({ f: g, score: 99 });
    else if (home(g)) keep.push({ f: g, score: 4 + s });
    else if (s >= cut) keep.push({ f: g, score: s });
  });
  if (!BYID.has(f.id)) keep.push({ f, score: 99 });
  keep.sort((a, b) => b.score - a.score);
  return { ts, keep, own: ownSet(keep, ts), top: 99 };
}
function rankStudy(k) {
  const keep = D.byStudy(k).map((f, i) => ({ f, score: 8 - i * 0.002 }));
  return { ts: [], keep, own: new Set(), top: 8, study: true };
}
function rankLine(L) {
  const sc = new Map(D.search(L.name).map((r) => [r.f.id, r.score]));
  const keep = [];
  L.studies.forEach((k, i) => D.byStudy(k).forEach((f) => keep.push({ f, score: 3 + (k === L.lead ? 3 : 0) + (sc.get(f.id) || 0) * 0.5 - i * 0.15 })));
  keep.sort((a, b) => b.score - a.score);
  return { ts: [L.tag], keep, own: new Set(), top: keep[0] ? keep[0].score : 0 };
}

/* ── 2. COMPOSE ──────────────────────────────────────────────────── */
const best = (list, fn) => { let b = null, bs = -1e9; list.forEach((x) => { const s = fn(x); if (s > bs) { bs = s; b = x; } }); return b; };
const split = (t) => { const i = String(t).indexOf(" | "); return i < 0 ? [t, ""] : [t.slice(0, i), t.slice(i + 3)]; };
const isHead = (f) => f.kind === "line" && f.text.length <= 150 && (f.weight === "display" || f.weight === "sub" ||
  (f.weight === "head" && /[.?!]$/.test(f.text) && !f.small) || (f.weight === "body" && f.text.length <= 96));
const figOf = (f) => {
  if (f.kind === "num") return { f, v: f.value, l: f.label, s: f.sub };
  const m = f.kind === "line" && f.text.match(FIG);
  return m ? { f, v: m[0], l: f.text, s: "" } : null;
};

function compose(R, o) {
  o = o || {};
  if (!R || !R.keep.length) return null;
  const keep = R.keep, own = R.own;
  const agg = {};
  keep.forEach((r) => { if (r.f.k !== "daybook") (agg[r.f.k] = agg[r.f.k] || []).push(r.score); });
  const sum = (k) => (agg[k] || []).slice(0, 12).reduce((a, b) => a + b, 0);
  const order = Object.keys(agg).sort((a, b) => sum(b) - sum(a));
  const lead = o.lead || order.find((k) => k !== "about") || order[0] || "daybook";
  const studies = [lead, ...order.filter((k) => k !== lead && sum(k) >= sum(lead) * 0.3)].slice(0, 5);
  const S = new Set(studies); S.add("about");
  const inS = (r) => S.has(r.f.k);
  const ownB = (r) => (own.has(r.f.id) ? 1 : 0);

  /* the headline: his line that best answers the need */
  const W8 = { display: 5, sub: 2, head: 1.5, body: 0 };
  let hd = o.hd || null;
  if (!hd) {
    const c = best(keep.filter((r) => inS(r) && isHead(r.f)), (r) => r.score + W8[r.f.weight] + ownB(r) * 2.5 + (r.f.k === lead ? 1.5 : 0) -
      Math.max(0, split(r.f.text)[0].length - 60) / 22 - (r.f.weight === "body" && !own.has(r.f.id) ? 3 : 0));
    hd = c ? c.f : D.byStudy(lead).find((f) => f.kind === "line" && f.weight === "display") || D.byStudy(lead).find((f) => f.kind === "line" && f.weight === "sub");
  }
  if (!hd) return null;
  const [hInk, hGrey] = split(hd.text);

  /* the dek: the headline's grey half, or the line under it that matched */
  let dk = null;
  if (hGrey) dk = { f: hd, ink: "", grey: hGrey };
  else {
    const c = best(keep.filter((r) => r.f.kind === "line" && r.f.k === hd.k && r.f.id !== hd.id && r.f.weight !== "display" && r.f.text.length <= 230 &&
      !r.f.small && r.f.weight !== "head"), (r) => r.score + ownB(r) * 3 + (r.f.head === hd.text ? 3 : 0) - r.f.text.length / 200);
    const lines = D.byStudy(hd.k).filter((f) => f.kind === "line");
    const next = lines[lines.findIndex((f) => f.id === hd.id) + 1];
    if (c && !R.study) { const [a, b] = split(c.f.text); dk = b ? { f: c.f, ink: a, grey: b } : { f: c.f, ink: "", grey: a }; }
    else if (next && !R.study && next.weight !== "display" && next.text.length <= 230) dk = { f: next, ink: "", grey: next.text };
    else if (D.study(hd.k)) {
      const meta = D.byStudy(hd.k).find((f) => f.kind === "line" && f.where === "meta");
      if (meta && meta.id !== hd.id) { const [a, b] = split(meta.text); dk = { f: meta, ink: a, grey: b }; }
    }
  }

  /* once the studies are known, the spread may draw on the rest of their
     fragments too, ranked below anything that matched */
  const inKeep = new Set(keep.map((r) => r.f.id));
  const ext = keep.concat(D.frags.filter((f) => S.has(f.k) && f.k !== "about" && !inKeep.has(f.id)).map((f) => ({ f, score: f.k === lead ? 1.2 : 0.6 })));

  /* pictures: the lead at an honest size, the rest small */
  const picR = ext.filter((r) => r.f.kind === "pic");
  const pScore = (r) => r.score + ownB(r) * 2 + (r.f.k === lead ? 2.5 : 0) + (S.has(r.f.k) ? 1 : 0) + Math.min(D.maxCss(r.f) / 700, 2) - (r.f.alpha ? 2.5 : 0);
  let lp = o.lp || null;
  if (!lp) { const c = best(picR.filter((r) => !r.f.alpha && D.maxCss(r.f) >= 380), pScore) || best(picR, pScore); lp = c ? c.f : null; }
  if (!lp) lp = D.byStudy(lead).filter((f) => f.kind === "pic" && !f.alpha).sort((a, b) => b.w - a.w)[0] || null;
  const per = {}; if (lp) per[lp.k] = 1;
  const sp = picR.filter((r) => !lp || r.f.id !== lp.id).sort((a, b) => pScore(b) - pScore(a)).filter((r) => {
    per[r.f.k] = (per[r.f.k] || 0) + 1; return per[r.f.k] <= 3; }).map((r) => r.f).slice(0, 8);

  /* figures: his numbers, and the sentences that carry one */
  const fr = [];
  ext.forEach((r) => {
    if (r.f.kind === "num" && S.has(r.f.k)) fr.push({ x: figOf(r.f), s: r.score + ownB(r) * 2 + 1 });
    else if (r.f.kind === "line" && r.f.num && S.has(r.f.k) && r.f.text.length <= 170 && FIG.test(r.f.text)) fr.push({ x: figOf(r.f), s: r.score + ownB(r) * 2 - 1 });
  });
  fr.sort((a, b) => b.s - a.s);
  const seen = new Set(); let figs = [];
  if (o.fig) { const x = figOf(o.fig); if (x) { figs.push(x); seen.add(x.v); } }
  fr.forEach(({ x }) => { if (x && !seen.has(x.v) && x.f.id !== (o.fig && o.fig.id)) { seen.add(x.v); figs.push(x); } });
  figs = figs.slice(0, 4);
  const strongFigs = figs.filter((x) => own.has(x.f.id) || x.f.k === lead || (o.fig && x.f.id === o.fig.id)).length;

  /* a sequence: his steps, a column of his lines, or the daybook */
  const mine = (r) => r.f.k === lead || own.has(r.f.id);
  const stepsR = o.steps ? { f: o.steps } : ext.find((r) => r.f.kind === "steps" && mine(r));
  const chartR = o.chart ? { f: o.chart } : ext.find((r) => r.f.kind === "chart" && mine(r));
  let days = keep.filter((r) => r.f.kind === "day" && r.f.body[0] && r.f.body[0].length <= 420);
  if (o.day) days = [{ f: o.day }, ...days.filter((r) => r.f.id !== o.day.id)];
  days = days.slice(0, 4).map((r) => r.f).sort((a, b) => (a.date < b.date ? 1 : -1));
  const groups = {};
  ext.forEach((r) => { const f = r.f; if (f.kind === "line" && f.where === "three-column-text" && f.head && S.has(f.k)) { const g = f.k + "\u0001" + f.head; groups[g] = (groups[g] || 0) + r.score + ownB(r) * 3 + (f.k === lead ? 1.5 : 0); } });
  const gk = best(Object.keys(groups), (g) => groups[g]);
  let group = null;
  if (gk) {
    const [k, head] = gk.split("\u0001");
    const items = D.byStudy(k).filter((f) => f.kind === "line" && f.head === head && f.where === "three-column-text");
    if (items.length >= 2) group = { k, head, items: items.slice(0, 5) };
  }

  /* tools and facts, for the small print */
  let tools = keep.filter((r) => r.f.kind === "tool" && (S.has(r.f.k) || own.has(r.f.id))).map((r) => r.f);
  ext.forEach((r) => { if (r.f.kind === "tool" && r.f.k === lead) tools.push(r.f); });
  if (tools.length < 4) tools = tools.concat(D.byStudy(lead).filter((f) => f.kind === "tool"));
  const tv = new Set(); tools = tools.filter((f) => { const v = f.value.toLowerCase(); if (tv.has(v)) return false; tv.add(v); return true; }).slice(0, 12);
  const FACTS = ["Published", "Scope", "Status", "Materials", "Stack", "Field"];
  const facts = FACTS.map((l) => D.byStudy(lead).find((f) => f.kind === "fact" && f.label === l)).filter(Boolean).filter((f) => f.value.length <= 90).slice(0, 3);
  const palette = D.byStudy(lead).find((f) => f.kind === "palette") || null;

  /* which spread: from what was found, unless a click already said */
  const goodPics = picR.filter((r) => S.has(r.f.k) && !r.f.alpha && D.maxCss(r.f) >= 380).length;
  const seqF = stepsR || chartR;
  const sysQ = R.ts.some((t) => SYS.includes(t));
  const daysOwn = days.filter((f) => own.has(f.id)).length;
  let mode = o.mode;
  if (!mode) {
    if (keep.length < 8 && !goodPics) mode = "sparse";
    else if (keep.length < 8 && keep.filter((r) => r.f.kind === "line").length >= keep.length * 0.6) mode = "sparse";
    else if (seqF && (own.has(seqF.f.id) || sysQ)) mode = "process";
    else if (strongFigs >= 3) mode = "figure";
    else if (group && sysQ) mode = "process";
    else if (goodPics >= 3 && lp) mode = "picture";
    else if (daysOwn >= 3) mode = "process";
    else if (lp && goodPics >= 1) mode = "picture";
    else mode = "sparse";
  }
  if (mode === "picture" && !lp) mode = "sparse";
  if (mode === "figure" && !figs.length) mode = lp ? "picture" : "sparse";
  let seq = null;
  if (mode === "process") {
    if (o.day) seq = { kind: "days", days };
    else if (stepsR) seq = { kind: "steps", f: stepsR.f };
    else if (group) seq = { kind: "group", group };
    else if (days.length >= 2) seq = { kind: "days", days };
    if (!seq && !chartR) mode = lp ? "picture" : "sparse";
  }
  const s = D.study(lead);
  const colour = o.color || (s ? s.fill : "#000"), cink = o.cink || (s ? s.ink : "#fff");
  return { mode, lead, studies, hd, hInk, hGrey, dk, lp, sp, figs, seq, chart: chartR ? chartR.f : null, tools, facts, palette, keep, own, colour, cink };
}

/* ── 3. BUILD AND PLACE ──────────────────────────────────────────── */
const sheetBox = $("#spread");
/* the glass's width is asked of the media query and the root box, never
   innerWidth: a phone reports a wider innerWidth while anything overflows */
const FLOWQ = matchMedia("(max-width: 879.98px), (max-height: 479.98px)");
const isFlow = () => FLOWQ.matches;
const VW = () => document.documentElement.clientWidth || innerWidth;
const dly = (p, ms) => { p.style.setProperty("--d", ms + "ms"); return p; };
const pc = (cls, anim, html, key) => { const p = el("div", "pc " + cls + " " + anim, html); if (key) p.dataset.key = key; return p; };
/* captions name the study and its year. The fragment ids stay out of
   sight: they are the generator's, change on every run, and read as
   debug output on the page */
const cap = (f) => "<span>" + T(D.title(f.k)) + "</span>" + (D.year(f.k) ? '<span class="y">' + D.year(f.k) + "</span>" : "");
const capC = (f) => (D.year(f.k) ? '<span class="y">' + D.year(f.k) + "</span>" : "") + "<span>" + T(D.title(f.k)) + "</span>";

function picPc(f, extra, lead) {
  const g = el("figure", "pc pic hit i " + (extra || ""));
  g.dataset.key = "p:" + f.id; g.dataset.f = f.id; g._f = f;
  g.appendChild(el("div", "im" + (f.alpha ? " alpha" : "")));
  g.appendChild(el("figcaption", "", lead && lead === f.k ? '<span class="y">' + (D.year(f.k) || "") + "</span>" : cap(f)));
  return g;
}
/* size a picture's box; it is never shown larger than half its pixels.
   A cover crop is checked by the size the picture is drawn at, not the box */
function sizePic(g, w, h, eager) {
  const f = g._f, box = g.firstChild;
  let sc = f.alpha ? Math.min(w / f.w, h / f.h) : Math.max(w / f.w, h / f.h);
  if (sc > 0.5) { w *= 0.5 / sc; h *= 0.5 / sc; sc = 0.5; }
  w = Math.round(w); h = Math.round(h);
  box.style.width = w + "px"; box.style.height = h + "px";
  g.style.width = w + "px";
  const cssW = Math.ceil(f.w * sc);
  let im = box.querySelector("img");
  if (!im || (im._w || 0) < cssW) {
    const n = D.img(f, cssW, { eager });
    n._w = cssW;
    n.addEventListener("load", () => tone(g, n), { once: true });
    if (im) im.replaceWith(n); else box.appendChild(n);
  }
  return { w, h };
}
/* the caption over a bled picture takes the ink that reads on it */
const tc = document.createElement("canvas"); tc.width = tc.height = 12;
const tx = tc.getContext("2d", { willReadFrequently: true });
function tone(g, im) {
  if (!g.classList.contains("bleed") || !im.naturalWidth) return;
  /* layout sizes, not painted ones: a picture mid-move is scaled */
  const bw = g.firstChild.offsetWidth, bh = g.firstChild.offsetHeight, gx = g.offsetLeft, gy = g.offsetTop;
  if (!bw || !bh) return;
  try {
    /* the whole picture, squeezed to 48 by 48; a box fraction maps into it
       through the cover crop (srcset images draw in their file's pixels,
       so the crop is worked in fractions, never in pixels) */
    const iw = im.naturalWidth, ih = im.naturalHeight, s = Math.max(bw / iw, bh / ih);
    const fx = bw / s / iw, fy = bh / s / ih, ox = (1 - fx) / 2, oy = (1 - fy) / 2;
    tc.width = 48; tc.height = 48;
    tx.drawImage(im, 0, 0, 48, 48);
    const lumIn = (x0, y0, x1, y1) => {
      x0 = ox + x0 * fx; x1 = ox + x1 * fx; y0 = oy + y0 * fy; y1 = oy + y1 * fy;
      const X = Math.min(47, Math.floor(x0 * 48)), Y = Math.min(47, Math.floor(y0 * 48));
      const d = tx.getImageData(X, Y, Math.max(1, Math.min(48 - X, Math.ceil((x1 - x0) * 48))), Math.max(1, Math.min(48 - Y, Math.ceil((y1 - y0) * 48)))).data;
      let v = 0; for (let i = 0; i < d.length; i += 4) v += (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
      return v / (d.length / 4);
    };
    const fc = g.lastChild;
    const cx0 = clamp(fc.offsetLeft / bw, 0, 1), cy0 = clamp(fc.offsetTop / bh, 0, 0.97);
    g.style.setProperty("--cc", lumIn(cx0, cy0, clamp((fc.offsetLeft + fc.offsetWidth) / bw, cx0, 1), clamp((fc.offsetTop + fc.offsetHeight) / bh, cy0, 1)) > 0.58 ? "#000" : "#fff");
    const cl = $("#close"), clx = cl.offsetLeft - gx, cly = cl.offsetTop - gy + scrollY * 0;
    if (g === (current && current._lead) && clx > 0) {
      const L = lumIn(clx / bw, Math.max(0, cly / bh), Math.min(1, (clx + cl.offsetWidth) / bw), Math.min(1, (cly + cl.offsetHeight) / bh));
      cl.style.color = L > 0.58 ? "#000" : "#fff";
    }
  } catch (e) { /* a picture that cannot be read keeps white */ }
}
function fitHead(p, w, maxH, lo, hi) {
  p.style.width = w + "px";
  let a = lo, b = hi, got = lo;
  for (let i = 0; i < 9; i++) {
    const s = (a + b) / 2; p.style.fontSize = s + "px";
    if (p.offsetHeight <= maxH && p.scrollWidth <= w + 2) { got = s; a = s; } else b = s;
  }
  p.style.fontSize = got + "px";
  return p.offsetHeight;
}
const at = (p, x, y, w) => { p.style.left = Math.round(x) + "px"; p.style.top = Math.round(y) + "px"; if (w != null) p.style.width = Math.round(w) + "px"; return p.offsetHeight; };

function studiesPc(sp) {
  const li = sp.studies.map((k) => '<li><a href="' + D.href(k) + '"><span>' + T(D.title(k)) + "</span>" + '<span class="y">' + (D.year(k) || "") + "</span></a></li>").join("");
  return pc("list st", "t", "<h4>Studies</h4><ul>" + li + "</ul>", "st");
}
function toolsPc(sp) {
  return pc("list tl", "t", "<h4>Tools</h4><ul>" + sp.tools.map((f) => '<li><button type="button" data-f="' + f.id + '">' + T(f.value) + "</button></li>").join("") + "</ul>", "tl");
}
function factsPc(sp) {
  if (!sp.facts.length) return null;
  return pc("list fc", "t", "<dl>" + sp.facts.map((f) => "<dt>" + T(f.label) + '</dt><dd class="hit" data-f="' + f.id + '">' + T(f.value) + "</dd>").join("") + "</dl>", "fc");
}
function palettePc(sp) {
  if (!sp.palette) return null;
  return pc("list pl", "w", '<div class="sw">' + sp.palette.colors.map((c) => '<i style="background:' + c.hex + '"></i>').join("") + "</div>", "pl");
}
function footPc() {
  const L = {}; (DATA.links || []).forEach((l) => { L[l.k] = l.v; });
  return pc("ft", "t", '<a href="mailto:' + D.esc(DATA.email) + '">' + D.esc(DATA.email) + "</a>" + (L["Book 30 minutes"] ? '<a class="book" href="' + L["Book 30 minutes"] + '">Book 30 minutes</a>' : ""), "ft");
}
function headPc(sp, withGrey) {
  const h = el("h1", "pc hd hit t", T(sp.hInk) + (withGrey && sp.hGrey ? ' <span class="g">' + T(sp.hGrey) + "</span>" : ""));
  h.dataset.key = "h:" + sp.hd.id; h.dataset.f = sp.hd.id;
  return h;
}
function dekPc(sp, withGrey) {
  if (!sp.dk || (!withGrey && sp.dk.f === sp.hd)) return null;
  const p = el("p", "pc dk hit t", (sp.dk.ink ? T(sp.dk.ink) + " " : "") + '<span class="g">' + T(sp.dk.grey) + "</span>");
  p.dataset.key = "d:" + sp.dk.f.id; p.dataset.f = sp.dk.f.id;
  return p;
}
function figPc(x, cls) {
  const p = pc("fg hit " + (cls || ""), "t", '<span class="v">' + T(x.v) + '</span><span class="l">' + T(x.l) + "</span>" + (x.s ? '<span class="s">' + T(x.s) + "</span>" : "") +
    '<span class="mono">' + T(D.title(x.f.k)) + "</span>", "g:" + x.f.id);
  p.dataset.f = x.f.id;
  return p;
}
function seqPc(sq) {
  let top = "", items = [], cls = "";
  if (sq.kind === "steps") {
    const f = sq.f;
    top = "<span>" + T(f.title) + '</span><span class="g">' + T(f.duration || "") + '<span class="src">' + cap(f) + "</span></span>";
    items = f.steps.map((s) => ({ t: s.title, x: s.note, f }));
  } else if (sq.kind === "group") {
    top = "<span>" + T(sq.group.head) + '</span><span class="g">' + T(D.title(sq.group.k)) + " " + (D.year(sq.group.k) || "") + "</span>";
    items = sq.group.items.map((f) => ({ t: f.text, f })); cls = " text";
  } else {
    top = "<span>" + T(D.title("daybook")) + '</span><span class="g"></span>';
    items = sq.days.map((f) => ({ t: f.body[0], d: f.date + " · " + f.project, f })); cls = " text";
  }
  const ol = items.map((it, i) => '<li class="hit" data-f="' + it.f.id + '"><span class="n">' + String(i + 1).padStart(2, "0") + '</span><span class="t">' + T(it.t) + "</span>" +
    (it.x ? '<span class="x">' + T(it.x) + "</span>" : "") + (it.d ? '<span class="d">' + D.esc(it.d) + "</span>" : "") + "</li>").join("");
  const p = pc("sq" + cls, "t", '<div class="top">' + top + "</div><ol>" + ol + "</ol>", "q:" + (sq.f ? sq.f.id : sq.kind));
  p._n = items.length;
  return p;
}
function chartPc(f) {
  const bars = f.bars.map((b) => '<div class="bar"><div class="lab"><span>' + T(b.label) + '</span><span class="g">' + T(b.value) + '</span></div><div class="tr"><div class="fl" style="--w:' +
    b.width / 100 + '"></div></div></div>').join("");
  const p = pc("ch hit", "t", '<div class="top"><span>' + T(f.title) + '</span><span class="src">' + cap(f) + '</span></div><div class="call">' + T(f.callout) + (f.suffix ? "<small>" + T(f.suffix) + "</small>" : "") + "</div>" + bars, "c:" + f.id);
  p.dataset.f = f.id;
  return p;
}

/* every spread: build its pieces in reading order, then place them */
function build(sp) {
  const P = { list: [] };
  const add = (k, p) => { if (p) { P[k] = p; P.list.push(p); } return p; };
  const m = sp.mode;
  if (m === "figure") {
    const field = add("field", pc("field fgs", "w", "", "field"));
    field.style.setProperty("--f", sp.colour); field.style.setProperty("--fi", sp.cink);
    P.figs = sp.figs.map((x, i) => { const p = figPc(x, i === 0 ? "first" : "small"); field.appendChild(p); return p; });
    if (sp.chart && sp.figs.length < 3) { P.ch = chartPc(sp.chart); field.appendChild(P.ch); }
  }
  add("hd", headPc(sp, m === "sparse"));
  add("dk", dekPc(sp, m === "sparse"));
  if (m === "picture" || (m !== "figure" && sp.lp && m !== "process")) add("lp", picPc(sp.lp, "lead"));
  if (m === "process") { if (sp.seq) add("sq", seqPc(sp.seq)); if (sp.chart) add("ch", chartPc(sp.chart)); }
  const nsp = { picture: 4, figure: 1, process: 3, sparse: 0 }[m];
  const pool = m === "figure" && sp.lp ? [sp.lp].concat(sp.sp) : sp.sp;
  P.sps = pool.slice(0, nsp).map((f) => add("sp" + f.id, picPc(f, "sp", sp.lp && m !== "figure" ? sp.lp.k : null)));
  if (m === "sparse" && sp.lp) { /* the one picture a sparse spread keeps is small */ P.lp.classList.add("sp"); }
  add("st", studiesPc(sp));
  add("tl", sp.tools.length ? toolsPc(sp) : null);
  if (m !== "sparse") add("fc", factsPc(sp));
  add("ft", footPc());
  return P;
}

function place(sheet, P, sp) {
  const flow = isFlow();
  body.classList.toggle("flow", flow);
  placedAt = VW() + "x" + innerHeight;
  const W = VW(), H = innerHeight, m = parseFloat(getComputedStyle(body).getPropertyValue("--m")) || 32;
  sheet.classList.toggle("flowing", flow);
  if (flow) return placeFlow(P, sp, W, H, m);
  ({ picture: layPicture, figure: layFigure, process: layProcess, sparse: laySparse })[sp.mode](P, sp, W, H, m);
}
/* the colophon: the small print in equal slots, tops on one line so
   their hairlines read as a single rule, like a broadsheet's tables */
function colophon(P, keys, x0, x1, yBottom, gap) {
  gap = gap || 28;
  const ps = keys.map((k) => P[k]).filter(Boolean);
  Object.keys(P).forEach((k) => { if (["st", "tl", "fc"].includes(k) && !keys.includes(k) && P[k]) P[k].style.display = "none"; });
  if (!ps.length) return 0;
  const w = (x1 - x0 - gap * (ps.length - 1)) / ps.length;
  ps.forEach((p) => { p.style.display = ""; p.style.width = w + "px"; });
  const h = Math.max(...ps.map((p) => p.offsetHeight));
  ps.forEach((p, i) => at(p, x0 + i * (w + gap), yBottom - h));
  return h;
}
const col = (W, m, n) => m + n * ((W - 2 * m - 11 * 20) / 12 + 20);
/* a row of small pictures at one height, honest, as many as fit */
function picRow(list, x, y, maxW, rowH, alignBottom) {
  let cx = x; const out = [];
  list.forEach((g) => {
    const f = g._f; let h = rowH, w = h * f.w / f.h;
    if (w > D.maxCss(f)) { w = D.maxCss(f); h = w * f.h / f.w; }
    if (cx + w > x + maxW + 1 || w < 28) { g.style.display = "none"; return; }
    const s = sizePic(g, w, h);
    g.style.width = "auto"; const cw = Math.min(Math.max(s.w, g.lastChild.scrollWidth), 190); g.style.width = cw + "px";
    if (cx + cw > x + maxW + 1) { g.style.display = "none"; return; }
    out.push([g, cx, s]); cx += cw + 16;
  });
  out.forEach(([g, gx, s]) => at(g, gx, alignBottom ? y + rowH - s.h : y));
  return out.length;
}

/* PICTURES: the lead picture bleeds off the right, the headline holds the left */
function layPicture(P, sp, W, H, m) {
  const f = P.lp._f, ar = f.w / f.h;
  let pw = clamp(H * ar, W * 0.36, W * 0.52), ph = H, px = W - pw, py = 0;
  const bleed = Math.max(pw / f.w, ph / f.h) <= 0.5;
  if (!bleed) {
    const bw = W * 0.44, bh = H - 104 - m - 30, s = Math.min(bw / f.w, bh / f.h, 0.5);
    pw = f.w * s; ph = f.h * s; px = W - m - pw; py = 104;
  }
  P.lp.classList.toggle("bleed", bleed); P.lp.classList.remove("bleedrow");
  current._lead = P.lp;
  at(P.lp, px, py); sizePic(P.lp, pw, ph, true);
  const lw = Math.min(Math.max(380, (bleed ? px : Math.min(px, W * 0.56)) - m - 64), 760);
  const footY = H - m - 18;
  at(P.ft, m, footY);
  const ch = colophon(P, ["st", "tl"], m, m + lw, footY - 30);
  const rowH = clamp(H * 0.115, 64, 104), rowY = footY - 30 - ch - 30 - rowH - 18;
  picRow(P.sps, m, rowY, lw, rowH, true);
  let dh = P.dk ? (P.dk.style.width = Math.min(lw, 470) + "px", P.dk.offsetHeight + 22) : 0;
  /* on short glass the dek gives way before the headline shrinks too far */
  if (P.dk && rowY - 40 - dh - 104 < 150) { P.dk.style.display = "none"; dh = 0; }
  const hh = fitHead(P.hd, lw, clamp(rowY - 40 - dh - 104, 90, H * 0.5), 38, 132);
  at(P.hd, m, 104);
  if (P.dk && dh) at(P.dk, m, 104 + hh + 22);
}

/* FIGURES: a field in the lead study's colour holds his numbers */
function layFigure(P, sp, W, H, m) {
  const fw = Math.round(W * 0.56), inner = fw - m * 2;
  at(P.field, 0, 0, fw); P.field.style.height = H + "px";
  const F = P.figs, first = F[0], bottom = H - m;
  first.style.width = inner + "px";
  const v = first.querySelector(".v");
  fitHead(v, inner, H * (F.length > 1 ? 0.3 : 0.42), 60, 260); v.style.width = "";
  first.querySelector(".l").style.maxWidth = Math.min(inner, 480) + "px";
  at(first, m, 104);
  const rest = F.slice(1);
  if (rest.length) {
    const gap = 44, cw = (inner - (rest.length - 1) * gap) / rest.length;
    let hMax = 0;
    rest.forEach((p) => { p.style.width = cw + "px"; const vv = p.querySelector(".v"); fitHead(vv, cw * 0.92, 80, 26, 72); vv.style.width = ""; hMax = Math.max(hMax, p.offsetHeight); });
    rest.forEach((p, i) => {
      at(p, m + i * (cw + gap), bottom - hMax);
      if (i) { const r = el("div", "fieldrule v"); P.field.appendChild(r); r.style.cssText = "left:" + Math.round(m + i * (cw + gap) - gap / 2) + "px;top:" + Math.round(bottom - hMax) + "px;width:1px;height:" + hMax + "px"; }
    });
    const rule = el("div", "fieldrule"); P.field.appendChild(rule); at(rule, m, bottom - hMax - 22, inner);
  }
  if (P.ch) at(P.ch, m, 0, inner), at(P.ch, m, bottom - P.ch.offsetHeight);
  /* the paper side: the headline, one picture, the small print */
  const rx = fw + 56, rw = W - rx - m, footY = H - m - 18;
  at(P.ft, rx, footY);
  const ch = colophon(P, ["st", "tl"], rx, W - m, footY - 30);
  const hh = fitHead(P.hd, rw, Math.min(H * 0.3, footY - 30 - ch - 40 - 104), 26, 76);
  at(P.hd, rx, 104);
  let yy = 104 + hh + 20;
  if (P.dk) {
    const dh = at(P.dk, rx, yy, Math.min(rw, 440));
    if (yy + dh + 20 > footY - 30 - ch) P.dk.style.display = "none"; else yy += dh + 28;
  }
  const room = footY - 30 - ch - 30 - yy;
  P.sps.forEach((g, i) => {
    if (i > 0 || room < 90) { g.style.display = "none"; return; }
    const f2 = g._f; let h = Math.min(room - 22, H * 0.3), w = h * f2.w / f2.h;
    if (w > rw * 0.6) { w = rw * 0.6; h = w * f2.h / f2.w; }
    const s = sizePic(g, w, h); at(g, rx, yy + Math.max(0, room - 22 - s.h));
  });
  body.style.setProperty("--bi", sp.cink);
}

/* PROCESS: the headline, then the steps across the full width */
function layProcess(P, sp, W, H, m) {
  const footY = H - m - 18;
  at(P.ft, m, footY);
  let ch = colophon(P, ["st", "tl", "fc"], col(W, m, 3), W - m, H - m);
  let colTop = H - m - ch;
  /* pictures sit small at the top right */
  const ph = clamp(H * 0.22, 100, 190);
  let px = W - m; const shown = [];
  P.sps.forEach((g) => {
    const f2 = g._f; let h = ph, w = h * f2.w / f2.h;
    if (w > D.maxCss(f2)) { w = D.maxCss(f2); h = w * f2.h / f2.w; }
    if (px - w < col(W, m, 8) || shown.length >= 2) { g.style.display = "none"; return; }
    const s = sizePic(g, w, h); px -= s.w; at(g, px, 104); px -= 12; shown.push(g);
  });
  const hw = Math.min(col(W, m, 8) - m - 20, (shown.length ? px : W - m) - m - 56);
  const bandW = P.ch && P.sq ? col(W, m, 8) - m - 20 : W - 2 * m;
  const sqH = P.sq ? (P.sq.style.width = bandW + "px", P.sq.offsetHeight) : 0;
  const chH = P.ch ? (P.ch.style.width = (P.sq ? W - m - col(W, m, 8) : Math.min(W * 0.5, 640)) + "px", P.ch.offsetHeight) : 0;
  let bandTop = colTop - 44 - Math.max(sqH, chH);
  let dh = P.dk ? (P.dk.style.width = Math.min(hw, 470) + "px", P.dk.offsetHeight + 20) : 0;
  if (P.dk && bandTop - 40 - dh - 104 < 110) { P.dk.style.display = "none"; dh = 0; }
  if (bandTop - 40 - 104 < 90) {
    ch = colophon(P, ["st"], col(W, m, 3), col(W, m, 7), H - m); colTop = H - m - ch;
    bandTop = Math.min(colTop, footY - 10) - 36 - Math.max(sqH, chH);
  }
  const hh = fitHead(P.hd, hw, clamp(bandTop - 36 - dh - 104, 44, H * 0.34), 26, 108);
  at(P.hd, m, 104);
  if (P.dk) at(P.dk, m, 104 + hh + 20);
  if (P.sq) at(P.sq, m, bandTop);
  if (P.ch) { if (P.sq) at(P.ch, col(W, m, 8), bandTop); else at(P.ch, m, bandTop); }
  shown.forEach((g) => { if (104 + g.offsetHeight + 16 > bandTop && !(P.ch && !P.sq)) g.style.display = "none"; });
}

/* SPARSE: one line, very large, and almost nothing else */
function laySparse(P, sp, W, H, m) {
  const footY = H - m - 18;
  at(P.ft, m, footY);
  const ch = colophon(P, ["st", "tl"], col(W, m, 6), W - m, H - m);
  const colTop = H - m - ch;
  let dh = 0;
  if (P.dk) { dh = at(P.dk, m, 0, Math.min(420, col(W, m, 5) - m - 20)); at(P.dk, m, footY - 26 - dh); }
  const top = Math.max(100, H * 0.15);
  const hh = fitHead(P.hd, W * 0.84, Math.max(120, Math.min(H * 0.58, Math.min(colTop, footY - 26 - dh) - 50 - top)), 48, 196);
  at(P.hd, m, top);
  if (P.lp) {
    const f = P.lp._f; let h = Math.min(H * 0.26, 210), w = h * f.w / f.h;
    if (w > 280) { w = 280; h = w * f.h / f.w; }
    const s = sizePic(P.lp, w, h);
    const y = Math.max(top + hh + 34, colTop - 40 - s.h - 20);
    if (y + s.h + 20 > colTop - 24) P.lp.style.display = "none";
    else at(P.lp, W - m - s.w, y);
  }
}

/* A PHONE: the pieces in reading order, pictures at their own shape */
function placeFlow(P, sp, W, H, m) {
  const cw = W - m * 2;
  if (P.hd) { P.hd.style.width = ""; const hh = fitHead(P.hd, cw, sp.mode === "sparse" ? H * 0.5 : H * 0.34, 30, sp.mode === "sparse" ? 64 : 50); P.hd.style.width = ""; P.hd.style.setProperty("--hfs", P.hd.style.fontSize); }
  if (P.lp && !P.lp.classList.contains("sp")) {
    const f = P.lp._f; let w = W, h = Math.min(W / (f.w / f.h), W * 1.25);
    if (Math.max(w / f.w, h / f.h) <= 0.5) { P.lp.classList.add("bleedrow"); P.lp.classList.remove("bleed"); sizePic(P.lp, w, h, true); }
    else { P.lp.classList.remove("bleedrow", "bleed"); sizePic(P.lp, cw, cw * f.h / f.w, true); }
  } else if (P.lp) { const f = P.lp._f; sizePic(P.lp, Math.min(cw * 0.6, 220), Math.min(cw * 0.6, 220) * f.h / f.w); }
  (P.sps || []).forEach((g) => { const f = g._f; let h = 92, w = h * f.w / f.h; if (w > cw * 0.46) { w = cw * 0.46; h = w * f.h / f.w; } sizePic(g, w, h); });
  (P.figs || []).forEach((p, i) => { const v = p.querySelector(".v"); v.style.fontSize = ""; p.style.setProperty("--vfs", (i === 0 ? 72 : 38) + "px"); });
  if (P.fc) P.fc.style.display = "";
}

/* ── 4. MOVE ─────────────────────────────────────────────────────── */
let current = null, currentSpec = null;
function show(sp, from) {
  const old = current;
  const olds = new Map();
  if (old) old.querySelectorAll("[data-key]").forEach((e) => { const r = e.getBoundingClientRect(); if (r.width > 1 && getComputedStyle(e).display !== "none") olds.set(e.dataset.key, r); });
  if (from && from.rect) olds.set(from.key, from.rect);
  body.style.setProperty("--bi", "#000"); $("#close").style.color = "";
  const sheet = el("div", "sheet pre mode-" + sp.mode);
  const P = build(sp);
  P.list.forEach((p) => sheet.appendChild(p));
  sheetBox.appendChild(sheet);
  current = sheet; currentSpec = sp; sheet._P = P;
  place(sheet, P, sp);
  /* the stagger: the big things first, the small print last */
  let d = 0;
  const order = [P.field, P.lp, P.hd, P.dk, ...(P.figs || []), P.ch, P.sq, ...(P.sps || []), P.st, P.tl, P.fc, P.pl, P.ft].filter(Boolean);
  order.forEach((p) => { dly(p, d); d += p === P.field || p === P.lp ? 90 : 55; });
  const moved = [];
  if (!REDUCE) sheet.querySelectorAll("[data-key]").forEach((e) => {
    const r0 = olds.get(e.dataset.key); if (!r0) return;
    const r1 = e.getBoundingClientRect(); if (r1.width < 2) return;
    const scale = e.classList.contains("pic") || e.classList.contains("hd") || e.classList.contains("fg");
    e.classList.add("flip"); e.style.transformOrigin = "0 0";
    e.style.transform = "translate(" + (r0.left - r1.left) + "px," + (r0.top - r1.top) + "px)" + (scale ? " scale(" + r0.width / r1.width + "," + (r0.height / r1.height) + ")" : "");
    moved.push(e);
  });
  if (old) {
    const keys = new Set(moved.map((e) => e.dataset.key));
    old.querySelectorAll("[data-key]").forEach((e) => { if (keys.has(e.dataset.key)) e.style.visibility = "hidden"; });
    old.classList.add("gone");
    setTimeout(() => old.remove(), 320);
  }
  void sheet.offsetHeight;
  /* a timer, not a frame: the Browser pane never runs frames */
  setTimeout(() => {
    sheet.classList.remove("pre");
    moved.forEach((e) => { e.style.transform = ""; });
    setTimeout(() => { moved.forEach((e) => e.classList.remove("flip")); if (current === sheet) replace(); }, 800);
  }, 30);
}

/* ── THE CATALOGUE: everything else it matched ── */
const KINDS = { pic: "Pictures", line: "Lines", num: "Figures", fact: "Facts", tool: "Tools", palette: "Palettes", steps: "Steps", chart: "Charts", day: "Daybook" };
function catItem(f) {
  const b = el("button", "it"); b.type = "button"; b.dataset.f = f.id;
  let h = "";
  switch (f.kind) {
    case "pic": b.dataset.key = "p:" + f.id; break;
    case "line": { const [a, g] = split(f.text); const c = f.weight === "display" ? " big" : f.weight === "sub" ? " sub" : f.weight === "head" ? " hd4" : "";
      h = '<span class="tx' + c + '">' + T(a) + (g ? ' <span style="color:var(--grey)">' + T(g) + "</span>" : "") + "</span>"; b.dataset.key = "h:" + f.id; break; }
    case "num": h = '<span class="fv">' + T(f.value) + '</span><span class="lab" style="margin-top:6px">' + T(f.label) + "</span>" + (f.sub ? '<span class="tx">' + T(f.sub) + "</span>" : ""); b.dataset.key = "g:" + f.id; break;
    case "fact": case "tool": h = '<span class="lab">' + T(f.label) + '</span><span class="tx">' + T(f.value) + "</span>"; break;
    case "palette": h = '<span class="sw">' + f.colors.map((c) => '<i style="background:' + c.hex + '"></i>').join("") + "</span>"; break;
    case "steps": h = '<span class="lab">' + T(f.title) + "</span>" + f.steps.map((s) => '<span class="tx">' + T(s.title) + ' <span style="color:var(--grey)">' + T(s.note || "") + "</span></span>").join(""); break;
    case "chart": h = '<span class="lab">' + T(f.title) + '</span><span class="fv">' + T(f.callout) + "</span>"; break;
    case "day": h = '<span class="dt">' + D.esc(f.date) + " · " + D.esc(f.project) + '</span><span class="tx">' + T(f.body[0]) + "</span>"; break;
  }
  b.innerHTML = h + '<span class="src">' + capC(f) + "</span>";
  if (f.kind === "pic") {
    const colW = catColW();
    const w = Math.min(colW, D.maxCss(f));
    const box = el("span", "im" + (f.alpha ? " alpha" : ""));
    box.style.display = "block"; box.style.width = w + "px"; box.style.aspectRatio = f.w + " / " + f.h;
    box.appendChild(D.img(f, w));
    b.insertBefore(box, b.firstChild);
  }
  return b;
}
const catColW = () => { const n = isFlow() ? 2 : 7, gap = isFlow() ? 14 : 22, m = isFlow() ? 18 : 32; return Math.floor((VW() - m * 2 - gap * (n - 1)) / n); };
function drawCat(sp) {
  const cat = $("#cat");
  const used = new Set();
  current.querySelectorAll("[data-f]").forEach((e) => used.add(e.dataset.f));
  /* by rank, but a picture every few pieces so the feed keeps its texture */
  const rest = sp.keep.filter((r) => !used.has(r.f.id)).map((r) => r.f);
  const pics = rest.filter((f) => f.kind === "pic"), words = rest.filter((f) => f.kind !== "pic");
  const items = [];
  while (items.length < 96 && (pics.length || words.length)) {
    if (pics.length) items.push(pics.shift());
    for (let i = 0; i < 3 && words.length; i++) items.push(words.shift());
    if (!words.length) while (pics.length && items.length < 96) items.push(pics.shift());
  }
  const counts = {}; sp.keep.forEach((r) => { counts[r.f.kind] = (counts[r.f.kind] || 0) + 1; });
  const k = Object.keys(KINDS).filter((x) => counts[x]).map((x) => "<span>" + KINDS[x] + "<b>" + counts[x].toLocaleString("en-US") + "</b></span>").join("");
  cat.innerHTML = '<header><span>Matches <span style="color:var(--grey);font-weight:500;margin-left:6px">' + sp.keep.length.toLocaleString("en-US") + " of " +
    D.frags.length.toLocaleString("en-US") + '</span></span><span class="k">' + k + '</span></header><div class="cols"></div><div class="foot"></div>';
  const cols = $(".cols", cat);
  items.forEach((f) => cols.appendChild(catItem(f)));
  $(".foot", cat).appendChild(footPc());
  $(".foot .pc", cat).className = "ft";
}

/* ── THE TRAIL, THE FIELD AND THE HASH ───────────────────────────── */
let trail = [];
const stepName = (s) => {
  if (s.t === "q") return s.v;
  if (s.t === "l") return (D.lines[s.v] || {}).name || s.v;
  if (s.t === "s") return D.title(s.v);
  const f = byId(s.v); if (!f) return s.v;
  return f.kind === "tool" || f.kind === "fact" ? f.value : D.title(f.k);
};
function specFor(s) {
  if (s.t === "q") return compose(rankQuery(s.v));
  if (s.t === "l") { const L = D.lines[s.v]; if (!L) return null; return compose(rankLine(L), { hd: LINEF.get("ln-" + L.tag), lead: L.lead, color: L.color, cink: L.ink }); }
  if (s.t === "s") return D.study(s.v) ? compose(rankStudy(s.v), { lead: s.v }) : null;
  const f = byId(s.v); if (!f) return null;
  const o = {};
  if (D.study(f.k)) o.lead = f.k;
  if (f.kind === "pic") { o.lp = f; o.mode = "picture"; }
  else if (f.kind === "num" || (f.kind === "line" && f.num && FIG.test(f.text) && f.text.length <= 170)) { o.fig = f; o.mode = "figure"; }
  else if (f.kind === "steps") { o.steps = f; o.mode = "process"; }
  else if (f.kind === "chart") { o.chart = f; o.mode = "process"; }
  else if (f.kind === "day") { o.day = f; o.mode = "process"; }
  else if (f.kind === "line") { o.hd = f; if (f.text.length > 96 || f.weight === "body") o.mode = "sparse"; }
  else if (f.kind === "tool" || f.kind === "fact") return compose(rankQuery(f.value));
  return compose(rankSeed(f), o);
}
const hashOf = (tr) => "#" + tr.map((s) => s.t + "=" + encodeURIComponent(s.v)).join("&");
const parseHash = () => (location.hash.slice(1) ? location.hash.slice(1).split("&").map((p) => { const i = p.indexOf("="); return { t: p.slice(0, i), v: decodeURIComponent(p.slice(i + 1)) }; }).filter((s) => /^[qlsf]$/.test(s.t) && s.v) : []);

function sizeQ() {
  if (!body.classList.contains("spread")) { q.style.width = ""; return; }
  const c = document.createElement("canvas").getContext("2d");
  c.font = "600 17px " + getComputedStyle(body).getPropertyValue("--sans");
  const w = clamp(c.measureText(q.value || q.placeholder).width + 6, 60, Math.min(420, VW() * 0.34));
  body.style.setProperty("--qw", w + "px");
  const mk = $("#bar .mark").getBoundingClientRect();
  if (!isFlow()) body.style.setProperty("--ql", Math.round(mk.right + 26) + "px");
  const x = (isFlow() ? parseFloat(getComputedStyle(body).getPropertyValue("--m")) : mk.right + 26) + w + 14;
  $("#trail").style.left = x + "px";
}
function drawTrail() {
  const ul = $("#trail");
  ul.innerHTML = trail.slice(1).map((s, i) => '<li><button type="button" data-i="' + (i + 1) + '">' + T(stepName(s)) + "</button></li>").join("");
  sizeQ();
}
function render(tr, from, push) {
  const s = tr[tr.length - 1];
  const sp = specFor(s);
  if (!sp) { flash(); return false; }
  trail = tr;
  q.value = stepName(tr[0]);
  if (push !== false) history.pushState(null, "", hashOf(tr));
  const was = body.classList.contains("spread");
  if (!was) toSpread();
  drawTrail();
  show(sp, from);
  drawCat(sp);
  return true;
}
function flash() { q.animate([{ opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }], { duration: 420 }); }
function toSpread() {
  const r0 = q.getBoundingClientRect(), fs0 = parseFloat(getComputedStyle(q).fontSize);
  body.classList.remove("ask", "typed"); body.classList.add("spread");
  q.style.height = "";
  window.scrollTo(0, 0);
  sizeQ();
  if (REDUCE) return;
  const r1 = q.getBoundingClientRect(), fs1 = parseFloat(getComputedStyle(q).fontSize);
  q.style.transition = "none";
  q.style.transform = "translate(" + (r0.left - r1.left) + "px," + (r0.top - r1.top) + "px) scale(" + fs0 / fs1 + ")";
  void q.offsetHeight;
  setTimeout(() => { q.style.transition = "transform 0.7s var(--ease)"; q.style.transform = ""; }, 20);
}
function toAsk(push) {
  body.classList.remove("spread"); body.classList.add("ask");
  body.style.setProperty("--bi", "#000");
  if (current) { current.remove(); current = null; }
  $("#cat").innerHTML = "";
  q.value = ""; q.style.transform = ""; trail = []; $("#trail").innerHTML = "";
  if (push !== false) history.pushState(null, "", location.pathname);
  layAsk(); live();
  setTimeout(() => q.focus({ preventScroll: true }), 30);
}

/* ── THE ASK ─────────────────────────────────────────────────────── */
/* example needs: the six lines, and phrases his own words use */
const NEEDS = ["a kitchen", "hair color", "insurance", "workflow", "AI", "operating model", "album covers", "a tinkerer"];
function drawAsk() {
  const st = D.studies.slice().sort((a, b) => a.y - b.y);
  $("#stock").innerHTML = "<b>" + D.studies.length + "</b> studies · <b>" + D.byKind("pic").length + "</b> pictures · <b>" + D.frags.length.toLocaleString("en-US") + "</b> fragments";
  $("#lines").innerHTML = (DATA.lines || []).map((L) => '<li><button type="button" data-l="' + L.tag + '"><i style="--c:' + L.color + '"></i>' + T(L.name) + "<sup>" + L.studies.length + "</sup></button></li>").join("");
  $("#needs").innerHTML = NEEDS.map((n) => { const R = rankQuery(n); return R && R.keep.length ? '<li><button type="button" data-q="' + D.esc(n) + '">' + D.esc(n) + "<sup>" + R.keep.length + "</sup></button></li>" : ""; }).join("");
  $("#index header").innerHTML = "<span>Index</span><span>" + st[0].y + "–" + st[st.length - 1].y + "</span>";
  $("#index ol").innerHTML = st.map((s) => '<li><button type="button" data-s="' + s.k + '"><span class="y">' + s.y + '</span><span class="t">' + T(D.title(s.k)) + '</span><span class="s">' + T(s.s) + "</span></button></li>").join("");
}
function layAsk() {
  if (!body.classList.contains("ask")) return;
  const flow = isFlow();
  body.style.setProperty("--vh", innerHeight / 100 + "px");
  q.style.height = "auto"; q.style.height = q.scrollHeight + "px";
  const r = q.getBoundingClientRect(), y = r.top + scrollY, fs = parseFloat(getComputedStyle(q).fontSize);
  const go = $("#go"); go.style.top = (y + fs * 0.62 - 10) + "px";
  if (flow) { $("#ask").style.paddingTop = (y + r.height + 22) + "px"; return; }
  $("#ask").style.paddingTop = "";
  const lines = $("#lines"), needs = $("#needs"), strip = $("#strip");
  lines.style.top = (y + r.height + 30) + "px";
  needs.style.top = (y + r.height + 30 + lines.offsetHeight + 6) + "px";
  strip.style.top = (y + r.height + 30 + lines.offsetHeight + 6 + needs.offsetHeight + 34) + "px";
}
let liveT = 0;
function live() {
  const v = q.value.trim();
  body.classList.toggle("typed", !!v);
  const idx = $("#index"), strip = $("#strip");
  const R = v ? rankQuery(v) : null;
  if (!R || !R.keep.length) { idx.classList.remove("live"); strip.innerHTML = ""; if (v && R) strip.innerHTML = '<span class="num">0 <span>fragments</span></span>'; return; }
  const agg = {}; R.keep.forEach((r) => { agg[r.f.k] = (agg[r.f.k] || 0) + r.score; });
  idx.classList.add("live");
  idx.querySelectorAll("[data-s]").forEach((b) => b.classList.toggle("hit", !!agg[b.dataset.s]));
  const pics = R.keep.filter((r) => r.f.kind === "pic" && !r.f.alpha).slice(0, 24).map((r) => r.f);
  const h = isFlow() ? 56 : 66, room = strip.clientWidth - (isFlow() ? 160 : 230);
  strip.innerHTML = "";
  let used = 0;
  pics.forEach((f, i) => {
    const w = Math.min(h * f.w / f.h, D.maxCss(f)), hh = w * f.h / f.w;
    if (used + w > room) return; used += w + 6;
    const b = el("button", ""); b.type = "button"; b.dataset.f = f.id; b.style.width = w + "px"; b.style.height = hh + "px"; b.style.alignSelf = "flex-end"; b.style.animationDelay = i * 22 + "ms";
    b.dataset.key = "p:" + f.id;
    b.appendChild(D.img(f, w)); strip.appendChild(b);
  });
  const ns = Object.keys(agg).filter((k) => k !== "daybook" && k !== "about").length;
  const n = el("span", "num", R.keep.length.toLocaleString("en-US") + " <span>fragments ·</span> " + ns + " <span>studies</span>");
  n.style.animationDelay = Math.min(pics.length, 16) * 22 + "ms";
  strip.appendChild(n);
}

/* ── EVENTS ──────────────────────────────────────────────────────── */
q.addEventListener("input", () => {
  if (body.classList.contains("ask")) { layAsk(); clearTimeout(liveT); liveT = setTimeout(live, 90); }
  else sizeQ();
});
q.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const v = q.value.trim();
    if (!v) return;
    if (!render([{ t: "q", v }])) return;
    q.blur();
  } else if (e.key === "Escape" && body.classList.contains("spread")) { toAsk(); }
});
$("#go").addEventListener("click", () => { const v = q.value.trim(); if (v) render([{ t: "q", v }]); });
$("#close").addEventListener("click", () => toAsk());
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && body.classList.contains("spread") && document.activeElement !== q) toAsk(); });
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-f],[data-q],[data-l],[data-s],[data-i]");
  if (!t || t.closest("a")) return;
  e.preventDefault();
  if (t.dataset.q) return render([{ t: "q", v: t.dataset.q }]);
  if (t.dataset.l) return render([{ t: "l", v: t.dataset.l }]);
  if (t.dataset.s) return render([{ t: "s", v: t.dataset.s }]);
  if (t.dataset.i) return render(trail.slice(0, +t.dataset.i + 1));
  const f = byId(t.dataset.f); if (!f) return;
  const inCat = !!t.closest("#cat, #strip");
  const key = t.dataset.key || t.closest("[data-key]") && t.closest("[data-key]").dataset.key || "p:" + f.id;
  const rect = (t.closest("[data-key]") || t).getBoundingClientRect();
  if (inCat && scrollY > 0) window.scrollTo(0, 0);
  const last = trail[trail.length - 1];
  if (last && last.t === "f" && last.v === f.id) return;
  const base = body.classList.contains("spread") ? trail : [{ t: "q", v: q.value.trim() || D.title(f.k) }];
  render(base.concat([{ t: "f", v: f.id }]), { key, rect });
});
window.addEventListener("popstate", () => {
  const tr = parseHash();
  if (!tr.length) { if (body.classList.contains("spread")) toAsk(false); return; }
  render(tr, null, false);
});
/* the glass can change under a spread (a resize, a phone settling its
   viewport after load): place it again whenever its size is not the one
   it was placed at */
let placedAt = "";
function replace(force) {
  const flow = isFlow(), sig = VW() + "x" + innerHeight;
  body.classList.toggle("flow", flow);
  if (body.classList.contains("ask")) { layAsk(); return; }
  sizeQ();
  if (!current || !currentSpec || (!force && sig === placedAt)) return;
  const P = current._P;
  P.list.concat(P.figs || []).forEach((p) => { ["left", "top", "width", "height", "display"].forEach((k) => p.style.removeProperty(k)); });
  current.querySelectorAll(".fieldrule").forEach((r) => r.remove());
  place(current, P, currentSpec);
}
let rz = 0;
window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => replace(), 140); });
FLOWQ.addEventListener("change", () => replace(true));
if (window.visualViewport) visualViewport.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => replace(), 140); });

/* ── START ── the fonts first, so the headline is measured in Ogg */
body.classList.toggle("flow", isFlow());
drawAsk();
Promise.race([
  Promise.all(['700 100px "RH Ogg"', '600 17px "Avenir Next"', '500 12px "Avenir Next"'].map((f) => document.fonts.load(f).catch(() => null))),
  new Promise((r) => setTimeout(r, 1500)),
]).then(() => {
  const tr = parseHash();
  if (tr.length && render(tr, null, false)) return;
  layAsk(); live();
  q.focus({ preventScroll: true });
});
})();
