/* ── A SHELF AS A SPREAD (27 Sept 2026) ───────────────────────────────
   One of the layouts crossref2.html can set a shelf in. It registers on
   window.XREF_SHELVES as "spread" ("Spread" in the switch); the contract
   it keeps is at the top of crossref2.js. The page owns the running head,
   Close, Escape, the addresses, the flights and the next entry at the
   foot; this file owns only how the studies sit.

   Why it exists. He called the Systems shelf chaotic ("Systems" set huge
   over a busy Sally OS screenshot, the sentence running across the
   interface) and asked for options on the categories: "it's closer but
   not quite there yet...do we do some options?". The grid answers with
   pictures butted edge to edge; this is its calm opposite, a category set
   as a magazine spread, with white margins and a strict column grid, and
   nothing ever set over a picture.

   What it is, top to bottom:
   - An opener on paper. The entry's name large (64px, 700, tracked in;
     40px on a phone), its sentence under it in grey (a figure's own
     figure or a tool's own name in ink inside it), and beside it (under
     it on a phone) a numbered contents list of its studies: number,
     title, year, under a "Work" label with the count, as index D heads a
     group. The contents is navigation: a row scrolls the spread to that
     study's picture, and hovering it lights the study in the index.
   - The pictures on a twelve-column grid at the running head's margin
     (20px, 16px on a phone), 20px gutters. One lead picture across the
     whole measure, then a steady rhythm of two across and three across,
     each captioned under the picture the way his earlier prototype did
     (a number that matches the contents, the study in grey semibold, its
     year lighter). Now and then one study gets a passage: its opening
     sentence (the board's own, in ink, and the grey half after it) at
     reading size beside its picture, under a hairline, left and right in
     turn. On a phone: the lead, pairs, a single across, and the passage
     as his prototype set it, words first and the picture under them.
   - Captions in a row sit on one line, because every picture in a row is
     cut to one shape: the shape nearest what the row's studies have, and
     each study shows the picture of its own nearest that shape (the
     board's lead when it is close).
   - A shelf of few studies (a tool, a year, a figure) brings its studies
     back with their other pictures, dealt in turn so one never follows
     itself, and only a study's first picture is captioned.

   Honest pictures: every box is checked before it is used, the width a
   picture is drawn at under its crop at most half its pixels. A lead that
   cannot fill the measure (Faux Reel's 800px file) opens as a passage at
   the width it can hold, with paper beside it. Pictures load as they come
   within half a screen, the rung below the honest one first.

   Hover a picture or a contents row and the index lights what that study
   holds, wired to it. Hover an entry in the index and the studies it
   touches have their names set solid (ink behind, paper words) in the
   contents and the captions; nothing dims. */
(() => {
  const REG = (window.XREF_SHELVES = window.XREF_SHELVES || {});
  const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";
  const DROP = "cubic-bezier(0.5, 0, 0.75, 0)";
  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const ratio = (f) => f.w / f.h;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  /* never drawn wider than half its pixels */
  const half = (f) => (f && f.w ? f.w / 2 : 0);
  const coverW = (bw, bh, f) => Math.max(bw, bh * ratio(f));
  const honest = (bw, bh, f) => !!f && coverW(bw, bh, f) <= half(f) - 0.5;
  const rectIn = (r, box) => r.bottom > box.top + 8 && r.top < box.bottom - 8 && r.width > 0;
  const two = (n) => (n < 10 ? "0" : "") + n;

  /* ── the grid: twelve columns inside the margins ── */
  const metrics = (S) => {
    S.M = S.ph ? 16 : 20; S.G = S.ph ? 12 : 20;
    S.C = S.W - 2 * S.M;
    S.col = (S.C - 11 * S.G) / 12;
    S.span = (n) => n * S.col + (n - 1) * S.G;
  };

  /* ── what a study can show ── */
  /* its own pictures with a ground of their own (a transparent one would
     show paper through its frame) */
  const ownOf = (S, k) => S.own[k] || (S.own[k] = S.ctx.pics(k).filter((f) => !f.alpha && f.w && f.h));
  /* its board lead first, then its own. A study shown more than once keeps
     to its own, since the lead is often one of them in another file */
  const candsFor = (S, k, first, taken) => {
    const own = ownOf(S, k), lead = S.ctx.lead(k);
    const useLead = first && lead && !(S.multi && own.length);
    return (useLead ? [lead] : []).concat(own).filter((f) => !S.used.has(f.src) && !(taken && taken.has(f.src)));
  };
  /* the picture nearest a box's shape that the box would not stretch; the
     board's lead when it is close */
  const pickFor = (S, it, bw, R, taken) => {
    let best = null, bs = Infinity;
    candsFor(S, it.k, it.first, taken).forEach((f) => {
      if (!honest(bw, bw / R, f)) return;
      const s = Math.abs(Math.log(ratio(f) / R)) - (f.lead ? 0.3 : 0);
      if (s < bs) { bs = s; best = f; }
    });
    return best ? { f: best, s: bs } : null;
  };
  const biggest = (S, it) => candsFor(S, it.k, it.first).sort((a, b) => half(b) - half(a))[0] || null;

  /* ── the blocks ── */
  /* the lead: one picture across the measure, as tall as its shape asks,
     within reason */
  const solveLead = (S, it) => {
    const C = S.C, hMax = S.avail * (S.ph ? 0.6 : 0.72), hMin = C / (S.ph ? 1.6 : 2.1);
    let best = null;
    candsFor(S, it.k, it.first).forEach((f) => {
      const h = Math.round(clamp(C / ratio(f), hMin, hMax));
      if (!honest(C, h, f)) return;
      const s = Math.abs(Math.log(C / h / ratio(f))) - (f.lead ? 0.3 : 0);
      if (!best || s < best.s) best = { f, s, h };
    });
    return best ? { t: "lead", items: [it], fs: [best.f], R: C / best.h, sp: 12 } : null;
  };
  /* a row of two, three or one at one shape, so the captions share a line.
     The shape is the one the row's studies have nearest, not the last
     row's when another is as near */
  const SHAPES = [0.8, 1, 1.25, 1.5];
  const solveRow = (S, t, items) => {
    const sp = t === "trio" ? 4 : t === "pair" ? 6 : 12, bw = S.span(sp);
    const shapes = t === "single" ? (S.ph ? [1, 1.25, 1.5] : [1.5, 1.78]) : SHAPES;
    let best = null;
    shapes.forEach((R) => {
      const taken = new Set(); let cost = R === S.lastR ? 0.12 : 0, miss = 0;
      const fs = items.map((it) => {
        const p = pickFor(S, it, bw, R, taken);
        if (!p) { miss++; return null; }
        taken.add(p.f.src); cost += p.s; return p.f;
      });
      if (!best || miss < best.miss || (miss === best.miss && cost < best.cost)) best = { R, fs, cost, miss };
    });
    /* a study none of whose pictures fills its cell sits at the size it can
       hold, top left in the cell, with paper round it */
    const small = [];
    const fs = best.fs.map((f, i) => {
      if (f) return f;
      const b = biggest(S, items[i]); if (!b) return null;
      small[i] = Math.floor(Math.min(bw, half(b) - 1));
      return b;
    });
    S.lastR = best.R;
    return { t, items, fs, R: best.R, sp, small };
  };
  /* a passage: the picture over seven columns (fewer if it cannot hold
     them), the words over the other five. The picture keeps near its own
     shape, within reason */
  const solvePassage = (S, it, side, lead) => {
    const spans = S.ph ? [12] : [7, 6, 5];
    for (const sp of spans) {
      const bw = S.span(sp); let best = null;
      candsFor(S, it.k, it.first).forEach((f) => {
        const R = clamp(ratio(f), S.ph ? 1.1 : 0.78, 1.6);
        if (!honest(bw, bw / R, f)) return;
        const s = Math.abs(Math.log(ratio(f) / R)) + 0.2 * Math.abs(Math.log(R / (S.ph ? 1.4 : 1.15))) - (f.lead ? 0.3 : 0);
        if (!best || s < best.s) best = { f, s, R };
      });
      if (best) return { t: "passage", items: [it], fs: [best.f], R: best.R, sp, side, lead };
    }
    /* nothing it has fills even five columns: its largest, at the width it
       can hold (Faux Reel), with the paper beside it */
    const b = biggest(S, it);
    const sp = S.ph ? 12 : 7;
    return { t: "passage", items: [it], fs: [b], R: b ? clamp(ratio(b), 0.78, 1.6) : 1, sp, side, lead, small: b ? [Math.floor(Math.min(S.span(sp), half(b) - 1))] : [] };
  };

  /* the order the studies come in, and how often. A short shelf brings its
     studies back, dealt in turn, so one never follows itself */
  const sequence = (S) => {
    const ks = S.ks;
    const seq = ks.map((k) => ({ k, first: true }));
    if (!S.multi) return seq;
    const want = ks.length === 1 ? (S.ph ? 5 : 5) : ks.length === 2 ? 6 : 7;
    for (let round = 1; seq.length < want && round < 12; round++) {
      let added = false;
      ks.forEach((k) => { if (seq.length < want && ownOf(S, k).length > round) { seq.push({ k, first: false }); added = true; } });
      if (!added) break;
    }
    return seq;
  };

  const plan = (S) => {
    if (!S.ks.length) return [];
    S.multi = S.ks.length < 4;
    const q = sequence(S), blocks = [], said = new Set();
    let side = 0;
    const use = (b) => { b.fs.forEach((f) => f && S.used.add(f.src)); blocks.push(b); };
    const passage = (it, lead) => { said.add(it.k); const b = solvePassage(S, it, side++ % 2, lead); use(b); };
    /* the lead: the first study across the measure, or a passage when it
       cannot fill it */
    const first = q.shift();
    const L = solveLead(S, first);
    if (L) use(L); else passage(first, true);
    /* the rhythm after it. A short shelf speaks sooner */
    const PAT = S.ph ? ["pair", "passage", "single", "pair", "passage", "single"]
      : S.multi ? ["passage", "pair", "passage", "trio"] : ["pair", "trio", "passage"];
    const NEED = { pair: 2, trio: 3, single: 1, passage: 1 };
    let pi = 0, guard = 0;
    while (q.length && guard++ < 60) {
      let t = PAT[pi++ % PAT.length];
      const left = q.length;
      /* the tail: whatever fits what is left */
      if (NEED[t] > left || (left - NEED[t] === 1 && t !== "passage" && !S.ph)) {
        t = left === 1 ? "passage" : left === 2 ? "pair" : left === 3 ? (S.ph ? "pair" : "trio") : left === 4 ? "pair" : t;
      }
      if (t === "passage") {
        /* a passage goes to a study that has not spoken yet; if none is
           left, the picture goes across on its own */
        const i = q.findIndex((it) => !said.has(it.k));
        if (i < 0) { t = "single"; }
        else { const [it] = q.splice(i, 1); passage(it, false); continue; }
      }
      const items = q.splice(0, NEED[t]);
      use(solveRow(S, t, items));
    }
    return blocks;
  };

  /* ── built ── */
  const markIn = (S, text, mark) => {
    const t = S.esc(text); if (!mark) return t;
    const m = S.esc(mark), i = t.toLowerCase().indexOf(m.toLowerCase());
    return i < 0 ? t : t.slice(0, i) + '<span class="xs-mk">' + t.slice(i, i + m.length) + "</span>" + t.slice(i + m.length);
  };
  const capHtml = (S, k) => '<span class="n">' + two(S.num[k]) + '</span><span class="t">' + S.esc(S.D.title(k)) + '</span> <span class="y">' + S.D.year(k) + "</span>";

  const headEl = (S) => {
    const e = S.ctx.entry || {};
    const top = el("header", "xs-top");
    const hd = el("div", "xs-hd"); hd.setAttribute("data-head", "");
    const nm = el("h2", "xs-name" + (e.kind === "year" || e.kind === "fig" ? " num" : ""), S.esc(e.name || ""));
    hd.appendChild(nm);
    /* a figure from a table: its label, then its note */
    if (e.label) hd.appendChild(el("p", "xs-lbl caps", S.esc(e.label)));
    if (e.sentence) hd.appendChild(el("p", "xs-sent", markIn(S, e.sentence, e.mark)));
    top.appendChild(hd);
    S.nm = nm; S.units.push(hd);
    if (S.ks.length) {
      const toc = el("nav", "xs-toc"); toc.setAttribute("aria-label", "Contents");
      toc.appendChild(el("div", "xs-toc-h caps", "<span>Work</span><b>" + S.ks.length + "</b>"));
      const ol = el("ol", "xs-toc-l");
      S.ks.forEach((k) => {
        const li = el("li");
        const b = el("button", "xs-ti", capHtml(S, k)); b.type = "button"; b.dataset.k = k;
        li.appendChild(b); ol.appendChild(li); S.rows.push(b);
      });
      toc.appendChild(ol); top.appendChild(toc);
      S.units.push(toc);
    } else top.classList.add("solo");
    return top;
  };
  /* the name keeps its size unless it cannot: a long one steps down until
     it sits in two lines with nothing past the edge */
  const fitName = (S) => {
    const nm = S.nm; if (!nm) return; nm.style.fontSize = "";
    let fs = parseFloat(getComputedStyle(nm).fontSize) || 64;
    const over = () => nm.scrollWidth > nm.clientWidth + 1 || nm.offsetHeight > fs * 2.05;
    for (let i = 0; i < 24 && fs > 22 && over(); i++) { fs -= 2; nm.style.fontSize = fs + "px"; }
  };

  /* a picture: a box its image covers, and the caption under it. The whole
     figure is the study's link */
  const figEl = (S, it, f, sp, R, small, cls) => {
    const a = el("a", "xs-fig" + (cls ? " " + cls : "")); a.href = "#study/" + it.k; a.dataset.k = it.k; a.draggable = false;
    if (sp) a.style.gridColumn = "span " + sp;
    const box = el("div", "xs-pic");
    box.style.aspectRatio = small ? String(ratio(f).toFixed(4)) : String(R.toFixed(4));
    if (small) box.style.width = small + "px";
    box._f = f; box.dataset.f = f.id || "";
    a.appendChild(box);
    const t = { k: it.k, f, box, a, cap: null };
    if (it.first && !cls) { t.cap = el("span", "xs-cap", capHtml(S, it.k)); a.appendChild(t.cap); }
    box._t = t; a._t = t;
    S.tiles.push(t); S.boxes.push(box); S.units.push(a);
    if (it.first && !S.firstOf[it.k]) S.firstOf[it.k] = t;
    return a;
  };
  const blockEl = (S, b) => {
    const row = el("div", "xs-row xs-" + b.t + (b.side ? " flip" : ""));
    if (b.t === "passage") {
      const it = b.items[0], f = b.fs[0];
      const pic = f ? figEl(S, it, f, 0, b.R, b.small && b.small[0], "bare") : null;
      const txt = el("div", "xs-txt"); txt.dataset.k = it.k;
      const cap = el("a", "xs-cap", capHtml(S, it.k)); cap.href = "#study/" + it.k; cap.draggable = false;
      txt.appendChild(cap);
      const s = S.D.study(it.k) || {};
      if (s.fact) txt.appendChild(el("p", "xs-say", '<span class="i">' + S.esc(s.fact) + "</span>" + (s.rest ? ' <span class="g">' + S.esc(s.rest) + "</span>" : "")));
      if (pic) {
        row.appendChild(pic);
        pic._t.cap = cap; txt._t = pic._t;
        if (!S.firstOf[it.k] || !S.firstOf[it.k].cap) S.firstOf[it.k] = pic._t;
        if (!S.ph) {
          /* the picture over its columns, the words over the other five,
             left and right in turn */
          pic.style.gridColumn = b.side ? (13 - b.sp) + " / span " + b.sp : "1 / span " + b.sp;
          txt.style.gridColumn = b.side ? "1 / span 5" : "8 / span 5";
        }
      }
      row.appendChild(txt); S.units.push(txt);
      /* on a phone the words come first, the picture under them */
      if (S.ph && pic) row.appendChild(pic);
      return row;
    }
    if (b.t === "lead") { row.appendChild(figEl(S, b.items[0], b.fs[0], 12, b.R)); return row; }
    b.items.forEach((it, i) => { if (b.fs[i]) row.appendChild(figEl(S, it, b.fs[i], b.sp, b.R, b.small && b.small[i])); });
    return row;
  };

  /* ── laid out, and loaded as it comes near ── */
  const layout = (S) => {
    const ctx = S.ctx;
    if (S.io) { S.io.disconnect(); S.io = null; }
    Object.assign(S, { W: ctx.width, avail: ctx.height, ph: !!ctx.phone, used: new Set(), own: {}, tiles: [], boxes: [], units: [], rows: [], firstOf: {}, lastR: 0, hov: null });
    metrics(S);
    S.num = {}; S.ks.forEach((k, i) => { S.num[k] = i + 1; });
    S.root.classList.toggle("ph", S.ph);
    S.root.style.setProperty("--xs-m", S.M + "px");
    S.root.style.setProperty("--xs-g", S.G + "px");
    const top = headEl(S);
    S.root.replaceChildren(top);
    fitName(S);
    const body = el("div", "xs-body");
    plan(S).forEach((b) => body.appendChild(blockEl(S, b)));
    S.root.appendChild(body);
    S.root.appendChild(el("div", "xs-end"));
    S.io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { S.io.unobserve(e.target); loadBox(e.target); } }),
      { root: ctx.scroller || null, rootMargin: "0px 0px 50% 0px" });
    S.boxes.forEach((b) => S.io.observe(b));
    if (S.light) light(S, S.light);
  };
  /* the honest rung for the size it is drawn at under its crop, after the
     rung below it */
  const loadBox = (box) => {
    const f = box._f; if (!f || box._loaded) return; box._loaded = true;
    /* a picture that is a running thing on this page runs (Faux Reel) */
    if (window.XREF_LIVE && window.XREF_LIVE(f, box)) return;
    const w = box.offsetWidth || 300, h = box.offsetHeight || 200;
    const need = coverW(w, h, f) * Math.min(2, window.devicePixelRatio || 1);
    const want = f.t384 && need <= 384 ? f.t384 : f.t768 && need <= 768 ? f.t768 : f.src;
    const rungs = [f.t384, f.t768, f.src].filter(Boolean);
    const quick = rungs.indexOf(want) > 0 ? rungs[rungs.indexOf(want) - 1] : null;
    const add = (src, then) => {
      const im = el("img"); im.alt = f.alt || ""; im.decoding = "async"; im.draggable = false;
      im.addEventListener("load", () => then(im), { once: true });
      im.src = encodeURI(src); box.appendChild(im); return im;
    };
    let pv = null;
    if (quick) pv = add(quick, () => box.classList.add("in"));
    add(want, () => { box.classList.add("in"); if (pv) setTimeout(() => pv.remove(), 400); });
  };

  /* an index entry under the pointer: the names of the studies it touches
     set solid, in the contents and under the pictures. Nothing dims */
  const light = (S, ks) => {
    S.light = ks || null;
    S.root.classList.toggle("lit", !!ks);
    S.root.querySelectorAll("[data-k]").forEach((n) => n.classList.toggle("hit", !!ks && ks.has(n.dataset.k)));
  };

  /* a contents row: the spread moves to that study's first picture */
  const goTo = (S, k) => {
    const t = S.firstOf[k]; if (!t) return;
    const sc = S.ctx.scroller, target = t.a.parentElement && t.a.parentElement.classList.contains("xs-passage") && S.ph ? t.a.parentElement : t.a;
    const top = sc.getBoundingClientRect().top + (S.ctx.head || 0);
    const y = sc.scrollTop + target.getBoundingClientRect().top - top - (S.ph ? 20 : 28);
    sc.scrollTo({ top: Math.max(0, y), behavior: still() ? "auto" : "smooth" });
    const n = t.cap; if (!n) return;
    n.classList.remove("at"); void n.offsetWidth; n.classList.add("at");
    clearTimeout(n._at); n._at = setTimeout(() => n.classList.remove("at"), 1800);
  };

  /* in: the opener's words rise, then each picture in reading order */
  const enter = (S, o) => {
    o = o || {};
    S.units.forEach((u) => {
      if (u._an) { u._an.cancel(); u._an = null; }
      if (u._kept) { [...u.children].forEach((c) => c.getAnimations().forEach((a) => a.cancel())); u._kept = false; }
    });
    S.boxes.forEach((b) => { if (b !== o.keep) b.style.visibility = ""; });
    if (still()) return;
    const box = S.ctx.scroller.getBoundingClientRect();
    const us = S.units.filter((u) => !(o.keep && u.contains(o.keep)) && rectIn(u.getBoundingClientRect(), box))
      .map((u) => [u, u.getBoundingClientRect()]).sort((a, b) => a[1].top - b[1].top || a[1].left - b[1].left).map((x) => x[0]);
    /* a picture flying home: its caption comes back with the rest */
    if (o.keep) { const k = S.units.find((u) => u.contains(o.keep)); if (k) [...k.children].filter((c) => !c.contains(o.keep)).forEach((c) => c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: (o.delay || 0) + 280, easing: "ease", fill: "backwards" })); }
    us.forEach((u, i) => {
      const pic = u.classList.contains("xs-fig");
      /* the page's motion family, when it has one for a shelf */
      const fx = window.XREF_IN && window.XREF_IN(!pic);
      u._an = u.animate(fx ? fx.kf : pic ? [{ opacity: 0, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, clipPath: "inset(0 0 0 0)" }] : [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
        { duration: fx ? fx.dur : pic ? 620 : 520, delay: (o.delay || 0) + (pic ? 120 : 40) + i * 55 * (fx && fx.step || 1), easing: fx ? fx.ease : EASE, fill: "backwards" });
    });
  };
  /* out: the rest go to paper; the one flying keeps its place, empty */
  const leave = (S, keep) => {
    const box = S.ctx.scroller.getBoundingClientRect();
    S.units.filter((u) => rectIn(u.getBoundingClientRect(), box)).forEach((u, i) => {
      if (u._an) u._an.cancel();
      if (keep && u.contains(keep)) {
        keep.style.visibility = "hidden";
        [...u.children].filter((c) => !c.contains(keep)).forEach((c) => c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" }));
        u._kept = true; return;
      }
      u._an = u.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, delay: i * 16, easing: DROP, fill: "forwards" });
    });
  };

  const render = (container, ctx) => {
    const D = ctx.D || window.D;
    const S = { ctx, D, esc: ctx.esc || D.esc, ks: (ctx.studies || []).filter((k) => D.study(k)), root: el("div", "xs"), io: null, light: null };
    container.appendChild(S.root);
    layout(S);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (S.root.isConnected) fitName(S); });
    S.root.addEventListener("click", (ev) => {
      if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return; /* a new tab is still a new tab */
      const row = ev.target.closest(".xs-ti");
      if (row) { ev.preventDefault(); goTo(S, row.dataset.k); return; }
      const a = ev.target.closest(".xs-fig, .xs-txt .xs-cap"); if (!a || !S.root.contains(a)) return;
      ev.preventDefault();
      const host = a.closest(".xs-fig, .xs-txt"), t = host && host._t;
      ctx.open(host ? host.dataset.k : a.closest("[data-k]").dataset.k, t ? t.box : null);
    });
    /* a picture, a passage or a contents row under the pointer lights its
       study in the index, wired to it */
    S.root.addEventListener("pointerover", (ev) => {
      if (ev.pointerType !== "mouse") return;
      const u = ev.target.closest(".xs-fig, .xs-txt, .xs-ti");
      if (u === S.hov) return;
      S.hov = u || null;
      if (!u) { ctx.hover(null); return; }
      ctx.hover(u.dataset.k, u.classList.contains("xs-ti") ? u : u._t ? u._t.box : u);
    });
    S.root.addEventListener("pointerleave", () => { if (S.hov) { S.hov = null; ctx.hover(null); } });
    return {
      destroy() {
        if (S.io) S.io.disconnect();
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
      /* the grid is the stage's width and the lead the height's, so again
         when either moves much */
      onResize() {
        if (Math.abs(ctx.width - S.W) <= 30 && Math.abs(ctx.height - S.avail) <= 80 && !!ctx.phone === S.ph) return;
        const sc = ctx.scroller, f = sc.scrollTop / Math.max(1, sc.scrollHeight);
        layout(S); sc.scrollTop = f * sc.scrollHeight;
      },
      enter: (o) => enter(S, o),
      leave: (keep) => leave(S, keep),
      light: (ks) => light(S, ks),
    };
  };

  REG.spread = { label: "Spread", render };
})();
