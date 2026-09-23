/* ── ONE ENGINE UNDER EVERY LOOK (22 Sept 2026) ───────────────────────
   His ask, after the book: "is there a way to make the graph maybe a
   little more editorial looking - more graphic? editorial meets minimal
   with some negative space?" The looks answer it four ways. To be
   compared fairly they share everything that is not the look: the facts
   (/lab/timeline-data.js), the book's pages, the reading order (newest
   first, ?order=old for 1998 forwards), the rail, the true-scale foot,
   the scrolling and the keys. A look says where the axis is cut, how
   wide a stretch has to be for what it holds, and how to draw it.

   This is /lab/timeline.html's engine, lifted. The mock itself is left
   as it was, so today's version stays one click away. ?at=2016.5 opens
   a look on that moment, which is how the compare page frames them. */
(function () {
"use strict";
const { STUDIES, ROLES, CHAPTERS, NOTES, NOW, STUDY_AT } = window.TL;
const Q = new URLSearchParams(location.search);
const REV = Q.get("order") !== "old";
const Y0 = 1998, Y1 = 2026, INTRO = 470, TAIL = 260, COL_W = 360, COL_GAP = 40, PG_L = 28, PG_R = 40;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const T = (d) => Array.isArray(d) ? d[0] + (d[1] - 1) / 12 : d;
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const $ = (id) => document.getElementById(id);
const world = $("world"), stage = $("stage"), map = $("map"), range = $("range"), eras = $("eras");

/* a study's moment: STUDY_AT pins the few whose chapter is plain; the rest
   are spread across their year */
{ const byYear = {}; STUDIES.forEach((s) => { (byYear[s.y] = byYear[s.y] || []).push(s); });
  Object.values(byYear).forEach((list) => list.forEach((s, i) => { s.at = STUDY_AT[s.k] ? T(STUDY_AT[s.k]) : s.y + (i + 0.5) / list.length; })); }
/* a note's words are its `t`, so its moment is `time` */
NOTES.forEach((n) => { n.time = T(n.at); });
ROLES.forEach((r) => { r.t0 = T(r.s); r.t1 = T(r.e); });
/* the order things are read in: newest first, unless ?order=old */
const byTime = (key) => (a, b) => (key(a) - key(b)) * (REV ? -1 : 1);

/* ── PICTURES ── the rungs the house makes (@384, @768, the file), and a
   picture is never drawn wider than half its own pixels: past that a
   retina glass is magnifying it */
const HONEST = (s) => s.nat[0] / 2;
const rungs = (s) => { const f = s.frames[0], out = [[f, 384]];
  if (s.r768) out.push([f.replace("@384", "@768"), 768]);
  out.push([f.replace("@384", ""), s.nat[0]]); return out; };
const picture = (s, w) => {
  const im = el("img"); im.alt = ""; im.decoding = "async"; im.loading = "lazy";
  const r = rungs(s); im.src = encodeURI(r[0][0]);
  im.srcset = r.map(([u, n]) => encodeURI(u) + " " + n + "w").join(", ");
  im.sizes = Math.max(1, Math.round(w)) + "px";
  return im;
};
/* a faux reel in miniature: the study's own frames, cut while the hand
   rests, at the middle rung so a large picture is not a soft one */
const reel = (a, s, im) => {
  let t = 0, k = 0; const keepSet = im.srcset;
  const frame = (i) => encodeURI(i === 0 ? s.frames[0] : s.frames[i].replace("@384", "@768"));
  a.addEventListener("pointerenter", () => {
    if (s.frames.length < 2) return;
    s.frames.forEach((f, i) => { if (i) { const p = new Image(); p.src = frame(i); } });
    clearInterval(t); t = setInterval(() => { k = (k + 1) % s.frames.length; im.srcset = k ? "" : keepSet; im.src = frame(k); }, 620);
  });
  a.addEventListener("pointerleave", () => { clearInterval(t); k = 0; im.srcset = keepSet; im.src = frame(0); });
};

/* measuring type before it is set */
const ink = document.createElement("canvas").getContext("2d");
const FACE = '"Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif';
const textW = (txt, size, weight, track) => { ink.font = (weight || 500) + " " + size + "px " + FACE;
  return ink.measureText(txt).width + (track || 0) * size * txt.length; };

let look = null, PAGES = [], SPANS = [], SEQ = [], LEFT = 0, RIGHT = 0;
const sticks = [];

/* ── WHERE A MOMENT STANDS ── */
const spanFrom = (t) => SPANS.find((s) => t >= s.t0 && t < s.t1) || SPANS[SPANS.length - 1];
const spanTo = (t) => SPANS.find((s) => t > s.t0 && t <= s.t1) || SPANS[0];
const at = (sp, t) => { const f = (Math.min(Math.max(t, sp.t0), sp.t1) - sp.t0) / (sp.t1 - sp.t0); return sp.x + (REV ? 1 - f : f) * sp.w; };
/* where a thing STARTS, and where one ENDS: at a page's date they differ */
function XS(d) { return at(spanFrom(T(d)), T(d)); }
function XE(d) { return at(spanTo(T(d)), T(d)); }
function timeAt(x) { for (const sp of SEQ) { if (x < sp.x) return REV ? sp.t1 : sp.t0;
  if (x <= sp.x + sp.w) { const f = (x - sp.x) / sp.w; return sp.t0 + (REV ? 1 - f : f) * (sp.t1 - sp.t0); } } return REV ? Y0 : T(NOW); }
/* a thing that would stand on a page goes to the side its own moment is on */
function clearOfPages(x, w, floor, anchor) { for (let moved = true; moved;) { moved = false;
  PAGES.forEach((p) => { if (x < p.x + p.w + 16 && x + w > p.x - 16) {
    const back = p.x - 16 - w;
    if (anchor < p.x + p.w / 2 && back >= floor) x = back; else { x = p.x + p.w + 16; moved = true; }
  } }); } return x; }
/* a long thing's name stays on the glass while the thing crosses it, and
   steps out from under a page rather than reading through it */
const stick = (lab, x0, x1, pad) => sticks.push({ lab, x0, x1, pad: pad == null ? 9 : pad });
const unstick = (L) => sticks.forEach((o) => {
  const lw = o.lab.offsetWidth, room = Math.max(0, (o.x1 - o.x0) - lw - o.pad * 2);
  let lx = Math.max(o.x0 + o.pad, L + 13);
  PAGES.forEach((p) => { if (lx < p.x + p.w + 12 && lx + lw > p.x - 12) lx = p.x + p.w + 12; });
  o.lab.style.transform = "translateX(" + Math.min(Math.max(0, lx - o.x0 - o.pad), room) + "px)";
});
/* a caption is two lines and never ends on a comma */
const fitCaps = (sel) => world.querySelectorAll(sel).forEach((c) => {
  const d = c.querySelector("span[data-full]"); if (!d) return;
  const parts = d.dataset.full.split(", ");
  d.textContent = parts.join(", ");
  while (parts.length && c.scrollHeight > c.clientHeight + 1) { parts.pop(); d.textContent = parts.join(", "); }
});
const footTop = () => (map && getComputedStyle(map).display !== "none") ? map.getBoundingClientRect().top : innerHeight;

const api = { REV, T, el, world, stage, STUDIES, ROLES, NOTES, CHAPTERS, NOW, Y0, Y1, MONTHS, byTime,
  picture, reel, HONEST, textW, stick, fitCaps, XS, XE, timeAt, clearOfPages,
  get PAGES() { return PAGES; }, get SPANS() { return SPANS; }, get SEQ() { return SEQ; },
  get LEFT() { return LEFT; }, get RIGHT() { return RIGHT; }, get H() { return innerHeight; }, get foot() { return footTop(); } };

/* ── THE AXIS ── cut at every new year and at every page unless the look
   says otherwise, each stretch as wide as the look needs for what it
   holds, and a page at the head of its chapter's stretch as it is read */
function layoutX() {
  let cuts;
  if (look.cuts) cuts = look.cuts(api);
  else { cuts = []; for (let y = Y0; y <= Y1; y++) cuts.push(y); PAGES.forEach((p) => cuts.push(p.t)); }
  cuts.push(Y0, T(NOW));
  const ts = [...new Set(cuts)].filter((t) => t >= Y0 && t <= T(NOW)).sort((a, b) => a - b);
  SPANS = [];
  for (let i = 0; i < ts.length - 1; i++) {
    const t0 = ts[i], t1 = ts[i + 1];
    SPANS.push({ t0, t1, w: 0, x: 0, year: Math.floor(t0 + 1e-9),
      studies: STUDIES.filter((s) => s.at >= t0 && s.at < t1).sort(byTime((s) => s.at)),
      notes: NOTES.filter((n) => n.time >= t0 && n.time < t1).sort(byTime((n) => n.time)),
      starts: ROLES.filter((r) => r.t0 >= t0 && r.t0 < t1).sort(byTime((r) => r.t0)) });
  }
  SEQ = REV ? SPANS.slice().reverse() : SPANS.slice();
  if (look.prepare) look.prepare(api);
  SPANS.forEach((sp) => { sp.w = Math.max(2, look.need(sp, api)); });
  /* a role is never shorter than its own name: the stretches it lives in
     are let out, in proportion, until the name fits */
  if (look.labelNeed) ROLES.forEach((r) => {
    const inside = SPANS.map((sp) => Math.max(0, Math.min(r.t1, sp.t1) - Math.max(r.t0, sp.t0)));
    const have = SPANS.reduce((a, sp, i) => a + sp.w * inside[i] / (sp.t1 - sp.t0), 0), need = look.labelNeed(r, api), dur = inside.reduce((a, b) => a + b, 0);
    if (have < need && dur > 0) SPANS.forEach((sp, i) => { if (inside[i]) sp.w += (need - have) * (inside[i] / dur) * ((sp.t1 - sp.t0) / inside[i]); });
  });
  const asc = PAGES.slice().sort((a, b) => a.t - b.t);
  asc.forEach((p, i) => { p.tEnd = i < asc.length - 1 ? asc[i + 1].t : Infinity; });
  let x = INTRO;
  const air = look.pageAir != null ? look.pageAir : 24;
  SEQ.forEach((sp, i) => {
    const pg = REV ? PAGES.find((p) => p.tEnd === sp.t1 || (i === 0 && p.tEnd === Infinity)) : PAGES.find((p) => p.t === sp.t0);
    if (pg) { x += i ? 16 : 0; pg.x = x; x += pg.w + air + (REV && !i ? (look.nowRoom || 0) : 0); }
    sp.x = x; x += sp.w;
  });
  LEFT = SEQ[0].x; RIGHT = SEQ[SEQ.length - 1].x + SEQ[SEQ.length - 1].w;
}

/* ── THE BOOK'S PAGES ── as wide as their words at this height */
function buildPages() {
  const ORDER = CHAPTERS.slice().sort((a, b) => (T(a.at) - T(b.at)) * (REV ? -1 : 1));
  ORDER.forEach((c, i) => { c.no = String(i + 1).padStart(2, "0"); });
  PAGES = ORDER.map((c) => {
    const pg = el("section", "pg", '<div class="flow"><div class="head"><div class="num">' + c.no + '</div><div class="when">' + c.when + "</div><h2>" + c.title
      + '</h2><p class="lede">' + c.lede + "</p></div>" + c.body.map((t) => "<p>" + t + "</p>").join("")
      + '<div class="yours"><b>Yours to write</b>' + c.yours + "</div></div>");
    world.appendChild(pg);
    return { c, el: pg, t: T(c.at), x: 0, w: 0 };
  });
  PAGES.forEach((p) => {
    const flow = p.el.firstChild, left = flow.getBoundingClientRect().left;
    let right = left; [...flow.children].forEach((k) => { right = Math.max(right, k.getBoundingClientRect().right); });
    const cols = Math.max(1, Math.ceil((right - left - 2) / (COL_W + COL_GAP)));
    p.w = PG_L + cols * COL_W + (cols - 1) * COL_GAP + PG_R; p.cols = cols;
    if (cols > 1) { flow.style.width = (cols * COL_W + (cols - 1) * COL_GAP) + "px"; flow.style.columnFill = "balance"; }
  });
}

const go = (x) => stage.scrollTo({ left: Math.max(0, x), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
const fitRules = () => document.querySelectorAll(".era").forEach((b) => b.style.setProperty("--w", Math.round(b.firstChild.getBoundingClientRect().width) + "px"));

let built = false;
function build() {
  const keep = built && SPANS.length ? timeAt(stage.scrollLeft + stage.clientWidth / 2) : null, wasAt = stage.scrollLeft;
  world.textContent = ""; eras.textContent = ""; sticks.length = 0;
  world.classList.toggle("rev", REV);
  /* the cover: the view's name on its side, and his sentence */
  world.appendChild(el("div", "intro", '<div class="spine">Timeline</div><div class="body"><p class="lede">Different mediums but the same attention given to all of it, because I really do love the work.</p>'
    + '<ul class="key">' + (look.key || "") + "</ul></div>"));
  buildPages();
  layoutX();
  PAGES.forEach((p) => { p.el.style.left = p.x + "px"; p.el.style.width = p.w + "px"; });
  world.style.width = (RIGHT + (look.tail != null ? look.tail : TAIL)) + "px";
  look.render(api);
  /* the rail is the contents */
  PAGES.forEach((p) => {
    const b = el("button", "era", "<span>" + p.c.name + "</span><sup>" + p.c.no + "</sup>"); b.type = "button";
    b.addEventListener("click", () => go(p.x));
    eras.appendChild(b); p.btn = b;
  });
  ["About", "Connect", "Ask"].forEach((n) => { const a = el("a", "era door", "<span>" + n + "</span>"); a.href = "/"; eras.appendChild(a); });
  fitRules(); drawMap();
  if (keep != null) stage.scrollLeft = wasAt < 40 ? 0 : XS(keep) - stage.clientWidth / 2;
  else if (Q.get("at")) stage.scrollLeft = Math.max(0, XS(+Q.get("at")) - stage.clientWidth * 0.18);
  built = true;
  onScroll();
}

/* ── the foot: true to scale, and the scrubber ── */
const TA = T([Y0, 8]), TB = T(NOW) + 0.35;
const mapX = (t) => ((REV ? TB - t : t - TA) / (TB - TA)) * map.clientWidth;
const win = el("div", "win");
function drawMap() {
  if (!map) return;
  map.textContent = "";
  ROLES.forEach((r) => { const m = el("i", "mb " + r.kind), a = mapX(r.t0), b = mapX(r.t1);
    m.style.cssText = "left:" + Math.min(a, b) + "px;width:" + Math.max(2, Math.abs(b - a) - 1) + "px;top:" + (r.lane * 8) + "px";
    m.dataset.r = r.id; map.appendChild(m); });
  PAGES.forEach((p) => { const m = el("i", "mt"); m.style.left = Math.min(map.clientWidth - 1, Math.max(0, mapX(Math.max(TA, p.t)))) + "px"; map.appendChild(m); });
  for (let y = 2000; y <= Y1; y += 2) { const l = el("span", "ml", String(y)); l.style.left = mapX(y) + "px"; map.appendChild(l); }
  map.appendChild(win);
}
function onScroll() {
  if (!SPANS.length) return;
  const L = stage.scrollLeft, a = timeAt(L), b = timeAt(L + stage.clientWidth);
  if (map) { const ma = mapX(Math.max(TA, a)), mb = mapX(Math.max(TA, b)), l = Math.max(0, Math.min(ma, mb)), r = Math.min(map.clientWidth, Math.max(ma, mb));
    win.style.left = l + "px"; win.style.width = Math.max(10, r - l) + "px"; }
  const atEnd = L + stage.clientWidth >= stage.scrollWidth - 40, probe = L + stage.clientWidth * 0.3;
  let front = null; PAGES.forEach((p) => { if (p.x <= probe) front = p; }); if (atEnd) front = PAGES[PAGES.length - 1];
  PAGES.forEach((p) => p.btn.classList.toggle("front", p === front));
  const yr = (t) => Math.min(Y1, Math.max(Y0, Math.floor(t - 1e-6))), y0 = yr(a), y1 = yr(b);
  range.textContent = (front ? front.c.no + " " + front.c.name + " · " : "") + (y0 === y1 ? y0 : y0 + " to " + y1);
  unstick(L);
  if (look.onScroll) look.onScroll(api, L, front);
}

/* a role under the hand lights everything that belongs to it */
world.addEventListener("pointerover", (e) => {
  const b = e.target.closest("[data-r]"); if (!b) return;
  world.classList.add("dim");
  world.querySelectorAll("[data-r]").forEach((n) => n.classList.toggle("lit", n.dataset.r === b.dataset.r));
});
world.addEventListener("pointerout", (e) => { if (e.target.closest("[data-r]")) { world.classList.remove("dim"); world.querySelectorAll(".lit").forEach((n) => n.classList.remove("lit")); } });

window.TLE = { api, start(l) {
  look = l;
  stage.addEventListener("scroll", onScroll, { passive: true });
  { let t = 0; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(build, 140); }, { passive: true }); }
  build();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  if (map) {
    const scrub = (e) => { const r = map.getBoundingClientRect(), f = (e.clientX - r.left) / r.width; const t = REV ? TB - f * (TB - TA) : TA + f * (TB - TA);
      stage.scrollLeft = XS(Math.min(Math.max(t, Y0), T(NOW))) - stage.clientWidth / 2; };
    let scrubbing = false;
    map.addEventListener("pointerdown", (e) => { scrubbing = true; map.setPointerCapture(e.pointerId); scrub(e); });
    map.addEventListener("pointermove", (e) => { if (scrubbing) scrub(e); });
    map.addEventListener("pointerup", () => { scrubbing = false; });
  }
  stage.addEventListener("wheel", (e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { e.preventDefault(); stage.scrollLeft += e.deltaY; } }, { passive: false });
  addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") stage.scrollLeft += 240; if (e.key === "ArrowLeft") stage.scrollLeft -= 240;
    if (e.key === "PageDown" || e.key === "PageUp") { e.preventDefault(); const L = stage.scrollLeft, fwd = e.key === "PageDown";
      const to = fwd ? PAGES.find((p) => p.x > L + 8) : PAGES.slice().reverse().find((p) => p.x < L - 8); go(to ? to.x : (fwd ? stage.scrollWidth : 0)); }
  });
} };
})();
