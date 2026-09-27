/* ── A SHELF AS A GRID (27 Sept 2026) ─────────────────────────────────
   One of the layouts crossref2.html can set a shelf in. It registers
   itself on window.XREF_SHELVES as "grid"; the contract it keeps (what
   the page hands it, what it hands back) is at the top of crossref2.js.
   The page owns the running head, Close, Escape, the addresses and the
   flights into and out of a room; this file owns only how the pictures
   sit.

   It is the edge-to-edge grid of 27 Sept (his "what if it's an edge to
   edge grid - no color or background showing? and maybe we mix some hero
   images in that are so large you have to scroll left/right inside the
   column to view it?"), moved out of crossref2.js with the way it picks
   and sizes pictures unchanged:

   - pictures butted together from the stage's left edge to the window's
     right, nothing between them, in blocks exactly the stage wide: a
     first picture across the width, rows of two, three and four at one
     height, a tall picture beside a stack of two, a band;
   - heroes: one picture set near the stage's height, so wide it runs
     past the edge, in a row that scrolls sideways (a trackpad swipe, a
     mouse drag with a grab cursor and a little glide, a finger, the
     arrow keys once Tab has reached it), opening centred with a thin
     rule saying where you are. Heroes are chosen first, so nothing else
     spends the one picture large enough;
   - a study shows its board lead when the slot is the lead's shape and
     otherwise one of its own nearer the slot's shape, and every slot is
     checked before it is used: the width a picture is drawn at under its
     crop is at most half its pixels. A shelf of few studies brings them
     back with their other pictures, dealt so one never follows itself;
   - captions sit on the pictures, bottom left, small: the study and its
     year, in paper or ink by what is under the words (read from the
     thumbnail on a 16 by 16 canvas), with a soft veil the size of the
     words where neither holds.

   Calmed the same day. He called the Systems shelf chaotic: "Systems"
   set huge in black over a busy Sally OS screenshot, the line's sentence
   running across the interface. Nothing large is set over a picture now.
   The shelf opens on a head on paper, at the running head's margin: the
   entry's name large (64px, 700, tracked in; 40px on a phone), how many
   studies it holds at the edge in the label voice ("Work 6", as index D
   heads its groups), and its sentence under it in grey (a
   figure's own figure, or a tool's own name, stays in ink inside it).
   Then the grid starts, and its first picture is sized so the head, the
   picture and the top of the next row all show on the first screen. The
   only words on the pictures are the captions. The next entry at the
   foot is the page's, on paper, so it is no longer a picture with a name
   over it either.

   Hover a picture and the page lights what its study holds in the index.
   Hover an entry in the index and the pictures of the studies it touches
   have their captions set solid, ink with paper words, in place of the
   dimming that made everything else go grey (his "everything going dim
   is difficult ... the black highlight behind it"). */
(() => {
  const REG = (window.XREF_SHELVES = window.XREF_SHELVES || {});
  const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";
  const DROP = "cubic-bezier(0.5, 0, 0.75, 0)";
  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const ratio = (f) => f.w / f.h;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  /* the kit's D.maxCss: never drawn wider than half its pixels */
  const maxCss = (f) => (f && f.w ? f.w / 2 : 0);
  /* the width a picture is drawn at when it covers a box, and whether
     that is at most half its pixels */
  const coverW = (bw, bh, f) => Math.max(bw, bh * ratio(f));
  const honest = (bw, bh, f) => !!f && coverW(bw, bh, f) <= maxCss(f) + 0.01;
  const rectIn = (r, box) => r.bottom > box.top + 8 && r.top < box.bottom - 8 && r.width > 0;

  /* ── what a study can show ── */
  /* its own pictures with a ground of their own (a transparent one would
     show paper through) */
  const ownOf = (S, k) => S.own[k] || (S.own[k] = S.ctx.pics(k).filter((f) => !f.alpha && f.w && f.h));
  const FEW = (S) => (S.ph ? 4 : 5);
  /* its board lead and its own. A study shown more than once keeps to its
     own, since the lead is often one of them */
  const candsFor = (S, k, taken) => {
    const own = ownOf(S, k), lead = S.ctx.lead(k);
    return ((S.multi && own.length) || !lead ? [] : [lead]).concat(own).filter((f) => !S.used.has(f.src) && !(taken && taken.has(f.src)));
  };
  /* the one nearest the slot's shape that the slot would not stretch; the
     board's own lead when it is close */
  const pickFor = (S, k, want, fits, taken) => {
    let best = null, bs = Infinity;
    candsFor(S, k, taken).forEach((f) => {
      if (fits && !fits(f)) return;
      const s = Math.abs(Math.log(ratio(f) / want)) - (f.lead ? 0.3 : 0);
      if (s < bs) { bs = s; best = f; }
    });
    return best;
  };
  /* the picture a shelf opens on: its first study that fills the width
     without stretching, else the next that does */
  const coverOf = (S, ks, W, Hc) => {
    for (let i = 0; i < Math.min(ks.length, 8); i++) {
      const f = pickFor(S, ks[i], W / Hc, (x) => honest(W, Hc, x));
      if (f) return { i, k: ks[i], f };
    }
    return null;
  };
  /* a hero: the study's widest picture that stands near the stage's height
     at half its pixels or less and still runs well past the edge */
  const heroPick = (S, k) => {
    let best = null; const lead = S.ctx.lead(k);
    ownOf(S, k).concat(!S.multi && lead ? [lead] : []).forEach((f) => {
      if (S.used.has(f.src)) return;
      const H = Math.floor(Math.min(S.heroH, f.h / 2)), w = Math.floor(H * ratio(f));
      if (H < S.heroH * 0.84 || w < S.W * 1.3) return;
      const s = w * (f.lead ? 0.7 : 1);
      if (!best || s > best.s) best = { f, H, w, s };
    });
    return best;
  };

  /* ── the blocks: what each wants of its pictures' shapes ── */
  const NEEDN = { r2: 2, r3: 3, r4: 4, ts: 3, st: 3, full: 1 };
  const WANTS = { r2: [[0.75, 1.5], [1.5, 1]], r3: [[1.5, 0.75, 1.33], [1, 1.5, 0.8]], r4: [[1, 1.5, 0.75, 1.5], [1.5, 0.8, 1.5, 1]] };
  const PWANTS = { r2: [[0.8, 1.5], [1.5, 0.8]], r3: [[0.8, 1, 0.8], [0.8, 1, 0.8]], r4: [[0.8, 1, 0.8, 1], [1, 0.8, 1, 0.8]] };
  const MINW = (S) => (S.ph ? 92 : 110);
  /* a row at one height: widths in proportion to the pictures' shapes,
     summing to the stage. Capped in height, the tiles crop a little */
  const solveRow = (S, t, ks, v) => {
    const wants = (S.ph ? PWANTS : WANTS)[t][v % 2];
    const W = S.W, sw = wants.reduce((a, b) => a + b, 0);
    let need = wants.map((x) => (W * x) / sw);
    for (let pass = 0; pass < 3; pass++) {
      const taken = new Set();
      const fs = ks.map((k, i) => { const f = pickFor(S, k, wants[i], (x) => maxCss(x) >= need[i], taken); if (f) taken.add(f.src); return f; });
      if (fs.some((f) => !f)) return null;
      const R = fs.reduce((s, f) => s + ratio(f), 0);
      const H = Math.floor(Math.min(W / R, S.rowMax));
      const ws = fs.map((f) => (W * ratio(f)) / R);
      if (ws.some((w) => w < MINW(S))) return null;
      const bad = fs.map((f, i) => !honest(ws[i], H, f));
      if (!bad.some(Boolean)) return { t, ks, fs, H, ws };
      need = need.map((n, i) => (bad[i] ? Math.max(n, ws[i]) + 1 : n));
    }
    return null;
  };
  /* a tall picture beside a stack of two, solved so both sides are one
     height: H = W / (tall's shape + the stack's) */
  const solveTS = (S, t, ks) => {
    const W = S.W;
    let needT = W * 0.4, needS = W * 0.5;
    for (let pass = 0; pass < 3; pass++) {
      const taken = new Set();
      const ft = pickFor(S, ks[0], 0.72, (x) => maxCss(x) >= needT, taken); if (!ft) return null; taken.add(ft.src);
      const f1 = pickFor(S, ks[1], 1.5, (x) => maxCss(x) >= needS, taken); if (!f1) return null; taken.add(f1.src);
      const f2 = pickFor(S, ks[2], 1.5, (x) => maxCss(x) >= needS, taken); if (!f2) return null;
      const inv = 1 / ratio(f1) + 1 / ratio(f2);
      const H0 = W / (ratio(ft) + 1 / inv);
      const wt = H0 * ratio(ft), ws = W - wt;
      const H = Math.floor(Math.min(H0, S.rowMax)), sc = H / H0;
      const hs = [ws / ratio(f1), ws / ratio(f2)];
      const okT = honest(wt, H, ft), ok1 = honest(ws, hs[0] * sc, f1), ok2 = honest(ws, hs[1] * sc, f2);
      if (okT && ok1 && ok2 && Math.min(wt, ws) >= MINW(S)) return { t, ks, fs: [ft, f1, f2], H, wt, ws, hs };
      if (!okT) needT = wt + 1;
      if (!ok1 || !ok2) needS = ws + 1;
    }
    return null;
  };
  /* one picture across the width, cropped to a band */
  const solveFull = (S, t, ks) => {
    const W = S.W, H = Math.floor(Math.min(W / (S.ph ? 1.3 : 1.85), S.avail * 0.66));
    const f = pickFor(S, ks[0], W / H, (x) => honest(W, H, x));
    return f ? { t: "full", ks: [ks[0]], fs: [f], H } : null;
  };
  const solveBlock = (S, t, ks, v) => (t === "ts" || t === "st" ? solveTS(S, t, ks) : t === "full" ? solveFull(S, t, ks) : solveRow(S, t, ks, v));
  /* the last resort, when no picture a study has can fill a slot: it sits
     at its honest size and the paper shows beside it. Only a study with a
     single small picture comes to this (Faux Reel) */
  const solveSolo = (S, k) => {
    const c = candsFor(S, k).sort((a, b) => maxCss(b) - maxCss(a))[0]; if (!c) return null;
    const w0 = Math.min(S.W, maxCss(c)), H = Math.floor(Math.min(w0 / ratio(c), S.rowMax));
    return { t: "solo", ks: [k], fs: [c], H, w: Math.floor(Math.min(w0, H * ratio(c))) };
  };

  const planShelf = (S) => {
    const ks = S.ks, W = S.W;
    S.multi = ks.length < FEW(S);
    const slots = ks.slice();
    if (S.multi) {
      const want = S.ph ? 7 : 8;
      for (let round = 1; slots.length < want && round < 16; round++) {
        let added = false;
        ks.forEach((k) => { if (slots.length < want && ownOf(S, k).length > round) { slots.push(k); added = true; } });
        if (!added) break;
      }
    }
    /* a shelf with no study (a figure only About holds) is its head alone */
    if (!slots.length) return [];
    const blocks = [], shown = new Set();
    const use = (b) => { b.fs.forEach((f) => S.used.add(f.src)); b.ks.forEach((k) => shown.add(k)); blocks.push(b); };
    let q = slots.slice();
    /* heroes first, so the first picture and the rows cannot spend the one
       picture large enough: two on a long shelf, one on a short, each the
       study whose picture runs furthest past the edge (a little in favour
       of the nearer). The first study is never one */
    const want = q.length - 1 >= 8 ? 2 : q.length >= 2 ? 1 : 0;
    const heroes = [];
    for (let n = 0; n < want; n++) {
      let got = null;
      q.forEach((k, i) => { if (!i) return; const h = heroPick(S, k); if (h && (!got || h.w - i * 30 > got.s)) got = { i, h, s: h.w - i * 30 }; });
      if (!got) break;
      heroes.push({ t: "hero", ks: [q[got.i]], fs: [got.h.f], H: got.h.H, w: got.h.w });
      S.used.add(got.h.f.src); q.splice(got.i, 1);
    }
    let cv = coverOf(S, q, W, S.Hc);
    if (!cv && heroes.length) {
      /* nothing left to open on once the heroes took theirs: that comes first */
      heroes.forEach((h) => S.used.delete(h.fs[0].src)); heroes.length = 0; q = slots.slice();
      cv = coverOf(S, q, W, S.Hc);
    }
    if (cv) { q.splice(cv.i, 1); use({ t: "cover", ks: [cv.k], fs: [cv.f], H: S.Hc }); }
    else { const b = solveSolo(S, q.shift()); if (b) use(b); }
    /* a short shelf brings its studies back; they are dealt so that one
       study never follows itself while another can go between (year 2024
       once set Robert Rodriguez beside himself) */
    if (S.multi && new Set(q).size > 1) {
      const left = q.slice(), out = []; let prev = cv ? cv.k : null;
      while (left.length) {
        const n = {}; left.forEach((k) => { n[k] = (n[k] || 0) + 1; });
        let at = -1;
        left.forEach((k, i) => { if (k !== prev && (at < 0 || n[k] > n[left[at]])) at = i; });
        if (at < 0) at = 0;
        prev = left[at]; out.push(prev); left.splice(at, 1);
      }
      q = out;
    }
    heroes.forEach((h) => shown.add(h.ks[0]));
    /* placed after the first row and after the third, or straight after the
       first picture when little else is left */
    const heroAt = heroes.length === 2 ? [1, 3] : heroes.length === 1 ? [q.length <= 4 ? 0 : 1] : [];
    const PAT = S.ph ? ["r2", "ts", "full", "st", "r2", "r3"] : ["r3", "ts", "r4", "r2", "full", "st", "r3", "r4", "r2", "ts"];
    let pi = 0, bi = 0, hi = 0, v = 0, guard = 0;
    const heroNow = () => { while (hi < heroes.length && bi >= heroAt[hi]) { blocks.push(heroes[hi++]); bi++; } };
    while (q.length && guard++ < 80) {
      heroNow();
      const left = q.length;
      let t = PAT[pi++ % PAT.length];
      if (NEEDN[t] > left) t = left === 1 ? "full" : left === 2 ? "r2" : left === 3 ? (S.ph ? "ts" : "r3") : S.ph ? "r2" : "r4";
      /* never leave one study to the end that cannot fill a band alone:
         take one more into this block, or one fewer */
      if (left - NEEDN[t] === 1 && !solveFull(S, "full", [q[left - 1]])) t = { r2: "r3", r3: S.ph ? "r2" : "r4", ts: S.ph ? "r2" : "r4", st: S.ph ? "r2" : "r4", r4: "r3", full: "r2" }[t];
      let b = solveBlock(S, t, q.slice(0, NEEDN[t]), v++);
      if (!b) for (const t2 of S.ph ? ["r2", "ts", "full"] : ["r3", "r4", "ts", "r2", "full"]) {
        if (t2 === t || NEEDN[t2] > left) continue;
        b = solveBlock(S, t2, q.slice(0, NEEDN[t2]), v++); if (b) break;
      }
      /* nothing fills the width with it. A study already on the shelf is
         left out rather than set alone on paper; only one not yet shown
         keeps its honest size with the paper beside it */
      if (!b && !shown.has(q[0])) b = solveSolo(S, q[0]);
      q.splice(0, b ? b.ks.length : 1);
      if (b) { use(b); bi++; }
    }
    bi = Infinity; heroNow();
    return blocks;
  };

  /* ── what a picture is under the words on it ── */
  const LN = 16;
  let LX = null;
  const lx = () => {
    if (!LX) { const c = document.createElement("canvas"); c.width = c.height = LN; LX = c.getContext("2d", { willReadFrequently: true }); }
    return LX;
  };
  /* the picture as its box draws it (cropped to cover, centred), 16 by 16 */
  const sampleBox = (box, im) => {
    const iw = im.naturalWidth, ih = im.naturalHeight; if (!iw || !ih) return false;
    const ba = box.offsetWidth / Math.max(1, box.offsetHeight), ia = iw / ih;
    let sx = 0, sy = 0, sw = iw, sh = ih;
    if (ia > ba) { sw = ih * ba; sx = (iw - sw) / 2; } else { sh = iw / ba; sy = (ih - sh) / 2; }
    try {
      const X = lx();
      X.clearRect(0, 0, LN, LN); X.drawImage(im, sx, sy, sw, sh, 0, 0, LN, LN);
      const d = X.getImageData(0, 0, LN, LN).data, g = new Float32Array(LN * LN);
      for (let i = 0; i < LN * LN; i++) g[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
      box._lum = g; return true;
    } catch (e) { return false; }
  };
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  /* paper or ink over a region (fractions of the box): whichever holds
     more contrast on average; a veil when even that is thin, or when a
     cell under the words fights it */
  const inkOver = (g, q) => {
    const a = clamp(Math.floor(q[0] * LN), 0, LN - 1), b = clamp(Math.ceil(q[2] * LN) - 1, a, LN - 1);
    const c = clamp(Math.floor(q[1] * LN), 0, LN - 1), d = clamp(Math.ceil(q[3] * LN) - 1, c, LN - 1);
    let s = 0, n = 0, lo = 1, hi = 0;
    for (let y = c; y <= d; y++) for (let x = a; x <= b; x++) { const L = lin(g[y * LN + x]); s += L; n++; lo = Math.min(lo, L); hi = Math.max(hi, L); }
    const m = s / n;
    const light = 1.05 / (m + 0.05) >= (m + 0.05) / 0.05;
    const avg = light ? 1.05 / (m + 0.05) : (m + 0.05) / 0.05;
    const worst = light ? 1.05 / (hi + 0.05) : (lo + 0.05) / 0.05;
    return { light, scrim: avg < 4.5 || worst < 2.2 };
  };
  const regionOf = (node, box) => {
    const r = node.getBoundingClientRect(), b = box.getBoundingClientRect();
    if (!b.width || !b.height || !r.width) return null;
    return [(r.left - b.left) / b.width, (r.top - b.top) / b.height, (r.right - b.left) / b.width, (r.bottom - b.top) / b.height];
  };
  const inkOn = (node, box, noScrim) => {
    const q = box._lum && regionOf(node, box); if (!q) return null;
    const v = inkOver(box._lum, q);
    node.classList.toggle("lt", v.light); node.classList.toggle("scr", !noScrim && v.scrim); node.classList.add("inked");
    return v;
  };
  /* the only words on a picture: its caption, and a hero's rule */
  const paintOver = (box) => {
    const t = box._lum && box._t; if (!t) return;
    inkOn(t.cap, box); if (t.rule) inkOn(t.rule, box, true);
  };

  /* ── the blocks, built ── */
  /* the words are clamped inside their own span: clamped on the caption
     itself, a third line showed through its padding (27 Sept review) */
  const capHtml = (S, k) => '<span class="tl"><span class="t">' + S.esc(S.D.title(k)) + '</span> <span class="y">' + S.D.year(k) + "</span></span>";
  const tileEl = (S, k, f, cls) => {
    const a = el("a", "tu" + (cls ? " " + cls : "")); a.href = "#study/" + k; a.dataset.k = k; a.draggable = false;
    const box = el("div", "tpic"); a.appendChild(box);
    const cap = el("div", "tcap", capHtml(S, k)); a.appendChild(cap);
    const t = { k, f, box, a, cap };
    box._f = f; box._t = t; a._t = t;
    S.tiles.push(t); S.units.push(a); S.boxes.push(box);
    return a;
  };
  const flexOf = (a, n) => { a.style.flex = n.toFixed(3) + " 1 0px"; };
  const heroEl = (S, b) => {
    const k = b.ks[0], f = b.fs[0];
    const a = el("a", "tu hero"); a.href = "#study/" + k; a.dataset.k = k; a.draggable = false; a.style.height = b.H + "px";
    const sc = el("div", "hx");
    const box = el("div", "tpic"); box.style.width = b.w + "px"; box.style.height = b.H + "px";
    sc.appendChild(box); a.appendChild(sc);
    const cap = el("div", "tcap", capHtml(S, k)); a.appendChild(cap);
    const rule = el("div", "hx-rule", "<i></i>"); a.appendChild(rule);
    const t = { k, f, box, a, cap, sc, rule, hero: true, raf: 0 };
    box._f = f; box._t = t; a._t = t;
    S.tiles.push(t); S.units.push(a); S.boxes.push(box); S.heroes.push(t);
    dragScroll(sc);
    sc.addEventListener("scroll", () => { cancelAnimationFrame(t.raf); t.raf = requestAnimationFrame(() => heroMoved(t)); }, { passive: true });
    /* from the keyboard: Tab reaches a hero, the arrows move it */
    a.addEventListener("keydown", (ev) => {
      if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
      ev.preventDefault(); ev.stopPropagation();
      sc.scrollBy({ left: (ev.key === "ArrowRight" ? 1 : -1) * sc.clientWidth * 0.4, behavior: still() ? "auto" : "smooth" });
    });
    return a;
  };
  /* where the hero is: the rule's mark is the window onto the picture */
  const heroMoved = (t) => {
    const sc = t.sc, sw = sc.scrollWidth || 1;
    const i = t.rule.firstChild;
    i.style.left = (100 * sc.scrollLeft) / sw + "%"; i.style.width = (100 * sc.clientWidth) / sw + "%";
    if (t.box._lum) { inkOn(t.cap, t.box); inkOn(t.rule, t.box, true); }
  };
  /* a hero moves under a trackpad or a finger on its own; a mouse drags
     it, with a little glide on letting go. A drag is never a click */
  const dragScroll = (sc) => {
    let id = null, x0 = 0, s0 = 0, moved = false, vx = 0, lx0 = 0, lt = 0, raf = 0;
    sc.addEventListener("pointerdown", (ev) => {
      if (ev.pointerType !== "mouse" || ev.button !== 0) return;
      cancelAnimationFrame(raf); id = ev.pointerId; x0 = lx0 = ev.clientX; s0 = sc.scrollLeft; lt = performance.now(); moved = false; vx = 0;
    });
    sc.addEventListener("pointermove", (ev) => {
      if (ev.pointerId !== id) return;
      const dx = ev.clientX - x0;
      if (!moved && Math.abs(dx) > 5) { moved = true; try { sc.setPointerCapture(id); } catch (e) { /* gone */ } sc.classList.add("grabbing"); }
      if (!moved) return;
      sc.scrollLeft = s0 - dx;
      const now = performance.now(), dt = Math.max(1, now - lt);
      vx = 0.75 * ((ev.clientX - lx0) / dt) + 0.25 * vx; lx0 = ev.clientX; lt = now;
    });
    const end = (ev) => {
      if (ev.pointerId !== id) return; id = null;
      sc.classList.remove("grabbing");
      if (!moved) return;
      sc._drag = true; setTimeout(() => { sc._drag = false; }, 0);
      if (still() || Math.abs(vx) < 0.05 || performance.now() - lt > 90) return;
      let v = -vx * 16, last = performance.now();
      const glide = (now) => { const d = Math.min(3, (now - last) / 16); last = now; sc.scrollLeft += v * d; v *= Math.pow(0.93, d); if (Math.abs(v) > 0.35) raf = requestAnimationFrame(glide); };
      raf = requestAnimationFrame(glide);
    };
    sc.addEventListener("pointerup", end); sc.addEventListener("pointercancel", end);
    sc.addEventListener("click", (ev) => { if (sc._drag) { ev.preventDefault(); ev.stopPropagation(); sc._drag = false; } }, true);
  };
  const blockEl = (S, b) => {
    if (b.t === "hero") return heroEl(S, b);
    const row = el("div", "g-row g-" + b.t); row.style.height = b.H + "px";
    if (b.t === "cover") { const a = tileEl(S, b.ks[0], b.fs[0], "cov"); flexOf(a, 1); row.appendChild(a); }
    else if (b.t === "ts" || b.t === "st") {
      const tall = tileEl(S, b.ks[0], b.fs[0]); flexOf(tall, b.wt);
      const st = el("div", "g-stack"); flexOf(st, b.ws);
      [1, 2].forEach((i) => { const a = tileEl(S, b.ks[i], b.fs[i]); flexOf(a, b.hs[i - 1]); st.appendChild(a); });
      row.appendChild(tall); row.appendChild(st);
    } else if (b.t === "full") { const a = tileEl(S, b.ks[0], b.fs[0]); flexOf(a, 1); row.appendChild(a); }
    else if (b.t === "solo") { const a = tileEl(S, b.ks[0], b.fs[0]); a.style.flex = "0 0 " + b.w + "px"; row.appendChild(a); }
    else b.fs.forEach((f, j) => { const a = tileEl(S, b.ks[j], f); flexOf(a, b.ws[j]); row.appendChild(a); });
    /* a study on two pictures that touch is captioned once, on the first.
       In a row only neighbours touch; beside a stack, all three do */
    const seen = new Set(); let prev = null;
    [...row.querySelectorAll(".tu")].forEach((a) => {
      const k = a.dataset.k;
      if (b.t === "ts" || b.t === "st" ? seen.has(k) : prev === k) a.classList.add("rep");
      seen.add(k); prev = k;
    });
    return row;
  };

  /* ── the head, on paper: the name, the count at the edge, the sentence ── */
  const markIn = (S, text, mark) => {
    const t = S.esc(text); if (!mark) return t;
    const m = S.esc(mark), i = t.toLowerCase().indexOf(m.toLowerCase());
    return i < 0 ? t : t.slice(0, i) + '<span class="xg-mk">' + t.slice(i, i + m.length) + "</span>" + t.slice(i + m.length);
  };
  const headEl = (S) => {
    const e = S.ctx.entry || {};
    const h = el("header", "xg-head"); h.setAttribute("data-head", "");
    /* how many studies, in the label voice at the edge on the name's
       baseline, as index D heads a group ("Work 6"). Set after the name
       it read as part of a figure ("$49,630 1") */
    const top = el("div", "xg-hl");
    const nm = el("h2", "xg-name" + (e.kind === "year" || e.kind === "fig" ? " num" : ""), S.esc(e.name || ""));
    top.appendChild(nm);
    if (S.ks.length) top.appendChild(el("span", "xg-n caps", "Work<b>" + S.ks.length + "</b>"));
    h.appendChild(top);
    /* a figure from a table: its label in the label voice, its note under */
    if (e.label) h.appendChild(el("p", "xg-lbl caps", S.esc(e.label)));
    if (e.sentence) h.appendChild(el("p", "xg-sent", markIn(S, e.sentence, e.mark)));
    S.nm = nm;
    return h;
  };
  /* the name keeps its size unless it cannot: a long one steps down until
     it sits in two lines with nothing past the edge */
  const fitName = (S) => {
    const nm = S.nm; nm.style.fontSize = "";
    let fs = parseFloat(getComputedStyle(nm).fontSize) || 64;
    const over = () => nm.scrollWidth > nm.clientWidth + 1 || nm.offsetHeight > fs * 2.05;
    for (let i = 0; i < 24 && fs > 22 && over(); i++) { fs -= 2; nm.style.fontSize = fs + "px"; }
  };

  /* ── laid out, and loaded as it comes near ── */
  const layout = (S) => {
    const ctx = S.ctx;
    if (S.io) { S.io.disconnect(); S.io = null; }
    (S.heroes || []).forEach((t) => cancelAnimationFrame(t.raf));
    Object.assign(S, { W: ctx.width, avail: ctx.height, ph: !!ctx.phone, used: new Set(), own: {}, tiles: [], units: [], boxes: [], heroes: [], hov: null });
    S.root.classList.toggle("ph", S.ph);
    /* one study: its name is on its first picture, and only there */
    S.root.classList.toggle("one", S.ks.length === 1);
    const head = headEl(S);
    S.root.replaceChildren(head);
    S.units.push(head);
    fitName(S);
    /* the first picture: the head, it and the top of the next row show on
       the first screen */
    const hh = head.offsetHeight;
    S.Hc = Math.round(clamp(S.avail - hh - (S.ph ? 72 : 88), S.avail * 0.42, S.avail * (S.ph ? 0.6 : 0.7)));
    S.heroH = Math.round(S.avail * (S.ph ? 0.64 : 0.96)); S.rowMax = Math.round(S.avail * 0.92);
    const grid = el("div", "xg-grid");
    planShelf(S).forEach((b) => grid.appendChild(blockEl(S, b)));
    S.root.appendChild(grid);
    /* a hero opens centred on its picture, so both of its edges are cut */
    S.heroes.forEach((t) => { t.sc.scrollLeft = Math.max(0, (t.sc.scrollWidth - t.sc.clientWidth) / 2); heroMoved(t); });
    S.io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { S.io.unobserve(e.target); loadTile(e.target); } }),
      { root: ctx.scroller || null, rootMargin: "0px 0px 50% 0px" });
    S.boxes.forEach((b) => S.io.observe(b));
  };
  /* the honest rung for the size the picture is drawn at under its crop,
     after the rung below it, which is also the one sampled for its light */
  const loadTile = (box) => {
    const f = box._f; if (!f || box._loaded) return; box._loaded = true;
    /* a picture that is a running thing on this page runs (Faux Reel) */
    if (window.XREF_LIVE && window.XREF_LIVE(f, box)) return;
    const w = box.offsetWidth || 300, h = box.offsetHeight || 200;
    const need = coverW(w, h, f) * Math.min(2, window.devicePixelRatio || 1);
    const want = f.t384 && need <= 384 ? f.t384 : f.t768 && need <= 768 ? f.t768 : f.src;
    const rungs = [f.t384, f.t768, f.src].filter(Boolean);
    const quick = rungs.indexOf(want) > 0 ? rungs[rungs.indexOf(want) - 1] : null;
    /* the caption waits for the picture's light; should the canvas refuse
       it, the caption shows in ink anyway */
    const lit = (im) => {
      if (box._lum) return;
      if (sampleBox(box, im)) { paintOver(box); return; }
      const t = box._t;
      [t && t.cap, t && t.rule].forEach((n) => n && n.classList.add("inked"));
    };
    const add = (src, then) => { const im = el("img"); im.alt = ""; im.decoding = "async"; im.draggable = false; im.addEventListener("load", () => then(im), { once: true }); im.src = encodeURI(src); box.appendChild(im); return im; };
    let pv = null;
    if (quick) pv = add(quick, (im) => { box.classList.add("in"); lit(im); });
    add(want, (im) => { box.classList.add("in"); lit(im); if (pv) setTimeout(() => pv.remove(), 400); });
  };

  /* in: each picture opens upward in reading order, the head's words after */
  const enter = (S, o) => {
    o = o || {};
    S.units.forEach((u) => {
      if (u._an) { u._an.cancel(); u._an = null; }
      if (u._kept) { [...u.children].forEach((c) => c.getAnimations().forEach((a) => a.cancel())); u._kept = false; }
    });
    S.tiles.forEach((t) => { if (t.box !== o.keep) t.box.style.visibility = ""; });
    if (still()) return;
    const box = S.ctx.scroller.getBoundingClientRect();
    const us = S.units.filter((u) => !(o.keep && u.contains(o.keep)) && rectIn(u.getBoundingClientRect(), box))
      .map((u) => [u, u.getBoundingClientRect()]).sort((a, b) => a[1].top - b[1].top || a[1].left - b[1].left).map((x) => x[0]);
    us.forEach((u, i) => {
      const words = u.classList.contains("xg-head");
      u._an = u.animate(words ? [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }] : [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
        { duration: words ? 520 : 640, delay: (o.delay || 0) + (words ? 120 : 60) + i * 45, easing: EASE, fill: "backwards" });
    });
  };
  /* out: the others go to paper; the one flying keeps its place, empty */
  const leave = (S, keep) => {
    const box = S.ctx.scroller.getBoundingClientRect();
    S.units.filter((u) => rectIn(u.getBoundingClientRect(), box)).forEach((u, i) => {
      if (u._an) u._an.cancel();
      if (keep && u.contains(keep)) { keep.style.visibility = "hidden"; [...u.children].filter((c) => !c.contains(keep)).forEach((c) => c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" })); u._kept = true; return; }
      u._an = u.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: i * 18, easing: DROP, fill: "forwards" });
    });
  };

  const render = (container, ctx) => {
    const S = { ctx, D: ctx.D || window.D, esc: ctx.esc || (ctx.D || window.D).esc, ks: (ctx.studies || []).slice(), root: el("div", "xg"), io: null, heroes: [] };
    container.appendChild(S.root);
    layout(S);
    S.root.addEventListener("click", (ev) => {
      if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return; /* a new tab is still a new tab */
      const u = ev.target.closest(".tu"); if (!u || !S.root.contains(u)) return;
      ev.preventDefault();
      ctx.open(u.dataset.k, u._t ? u._t.box : u);
    });
    /* a picture under the pointer lights its study in the index */
    S.root.addEventListener("pointerover", (ev) => {
      if (ev.pointerType !== "mouse") return;
      const u = ev.target.closest(".tu");
      if (u === S.hov) return;
      S.hov = u || null;
      ctx.hover(u ? u.dataset.k : null, u && u._t ? u._t.box : null);
    });
    S.root.addEventListener("pointerleave", () => { if (S.hov) { S.hov = null; ctx.hover(null); } });
    return {
      destroy() {
        if (S.io) S.io.disconnect();
        S.heroes.forEach((t) => cancelAnimationFrame(t.raf));
        S.units.forEach((u) => { if (u._an) u._an.cancel(); });
        S.root.remove();
      },
      /* the study's picture on screen, else its first */
      tileFor(k) {
        const ts = S.tiles.filter((t) => t.k === k); if (!ts.length) return null;
        const r = ctx.scroller.getBoundingClientRect(), top = r.top + (ctx.head || 0);
        const on = ts.find((t) => { const b = t.box.getBoundingClientRect(); return b.bottom > top + 8 && b.top < r.bottom - 8; });
        return (on || ts[0]).box;
      },
      /* laid out to the stage's width and height (a hero's is the
         height's), so again when either moves much */
      onResize() {
        if (Math.abs(ctx.width - S.W) <= 30 && Math.abs(ctx.height - S.avail) <= 80 && !!ctx.phone === S.ph) return;
        const sc = ctx.scroller, f = sc.scrollTop / Math.max(1, sc.scrollHeight);
        layout(S); sc.scrollTop = f * sc.scrollHeight;
      },
      enter: (o) => enter(S, o),
      leave: (keep) => leave(S, keep),
      /* an index entry under the pointer: the captions of what it touches
         are set solid, and nothing else changes */
      light(ks) {
        S.root.classList.toggle("lit", !!ks);
        S.tiles.forEach((t) => t.a.classList.toggle("hit", !!ks && ks.has(t.k)));
      },
    };
  };

  REG.grid = { label: "Grid", render };
})();
