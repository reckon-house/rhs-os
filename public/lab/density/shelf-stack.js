/* ── A SHELF AS A STACK OF OPENERS (27 Sept 2026) ────────────────────
   One of the layouts crossref2.html can set a shelf in, registered on
   window.XREF_SHELVES as "stack" and, since he asked for it, the one a
   shelf opens in. The contract it keeps is at the top of crossref2.js;
   the page owns the running head, Close, Escape, the addresses and the
   flights into and out of a room.

   His words, looking at the grid: "instead of grids what if we stacked
   the heros and made sure we pulled the big nice images from the top of
   each case study". So each study is its opener, one over the next: the
   picture its own page opens on (its hero section's, a carousel's first
   slide; fragments.js carries it as study.top), across the whole stage
   at its own shape, and under it a strip of paper with its number in
   the shelf, its name, its year and its discipline, the way a magazine
   runs a credit under a picture. Nothing is set over a picture.

   Honest as everything else here: a picture is drawn at most at half its
   own pixels. An opener that cannot fill the stage (Faux Reel's only
   picture is 800 wide) sits at its honest width on paper; a very tall
   one is cropped to the glass's height, and only if the crop still
   holds. The files load as they come near, the smaller rung first. */
(() => {
  const REG = (window.XREF_SHELVES = window.XREF_SHELVES || {});
  const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";
  const DROP = "cubic-bezier(0.5, 0, 0.75, 0)";
  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const ratio = (f) => f.w / f.h;
  const rectIn = (r, b) => r.bottom > b.top + 4 && r.top < b.bottom - 4;
  const two = (n) => String(n).padStart(2, "0");

  /* the opener: the study's top picture, else its board picture, else its
     largest; never a transparent one when another will do */
  const openerOf = (S, k) => {
    const s = S.D.study(k) || {};
    const own = (S.ctx.pics(k) || []).filter((f) => f.w && f.h && !f.alpha).sort((a, b) => b.w - a.w);
    return s.top || S.ctx.lead(k) || own[0] || null;
  };
  /* its box: the stage's width and its own shape, cropped to the glass if
     it is taller, and narrower if the file cannot fill the width */
  const boxOf = (S, f) => {
    let w = Math.min(S.W, f.w / 2), h = w / ratio(f);
    const maxH = Math.round(S.avail * (S.ph ? 0.72 : 0.9));
    if (h > maxH) { const drawn = Math.max(w, maxH * ratio(f)); if (drawn <= f.w / 2) h = maxH; }
    return { w: Math.round(w), h: Math.round(h) };
  };

  const headEl = (S) => {
    const e = S.ctx.entry || {};
    const h = el("header", "xk-head");
    const top = el("div", "xk-hl");
    const nm = el("h2", "xk-name" + (e.kind === "year" || e.kind === "fig" ? " num" : ""), S.esc(e.name || ""));
    top.appendChild(nm);
    if (S.ks.length) top.appendChild(el("span", "xk-n caps", "Work<b>" + S.ks.length + "</b>"));
    h.appendChild(top);
    if (e.label) h.appendChild(el("p", "xk-lbl caps", S.esc(e.label)));
    if (e.sentence) h.appendChild(el("p", "xk-sent", S.esc(e.sentence)));
    S.nm = nm;
    return h;
  };
  const fitName = (S) => {
    const nm = S.nm; nm.style.fontSize = "";
    let fs = parseFloat(getComputedStyle(nm).fontSize) || 64;
    const over = () => nm.scrollWidth > nm.clientWidth + 1 || nm.offsetHeight > fs * 2.05;
    for (let i = 0; i < 24 && fs > 22 && over(); i++) { fs -= 2; nm.style.fontSize = fs + "px"; }
  };

  const layout = (S) => {
    const ctx = S.ctx;
    if (S.io) { S.io.disconnect(); S.io = null; }
    Object.assign(S, { W: ctx.width, avail: ctx.height, ph: !!ctx.phone, items: [], units: [] });
    S.root.classList.toggle("ph", S.ph);
    const head = headEl(S);
    S.root.replaceChildren(head); S.units.push(head);
    fitName(S);
    S.ks.forEach((k, i) => {
      const f = openerOf(S, k); if (!f) return;
      const { w, h } = boxOf(S, f);
      const fig = el("figure", "xk-it" + (w < S.W - 2 ? " narrow" : "")); fig.dataset.k = k;
      const box = el("div", "xk-pic" + (f.alpha ? " alpha" : "")); box.style.width = w + "px"; box.style.height = h + "px"; box._f = f;
      fig.appendChild(box);
      const s = S.D.study(k) || {};
      fig.appendChild(el("figcaption", "xk-cap",
        '<span class="xk-no">' + two(i + 1) + '</span><span class="xk-t">' + S.esc(S.D.title(k)) + '</span><span class="xk-y">' + (s.y || "") + "</span>" +
        (s.s ? '<span class="xk-d">' + S.esc(s.s) + "</span>" : "")));
      S.root.appendChild(fig);
      S.items.push({ k, fig, box }); S.units.push(fig);
    });
    S.io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { S.io.unobserve(e.target); load(e.target); } }),
      { root: ctx.scroller || null, rootMargin: "0px 0px 60% 0px" });
    S.items.forEach((t) => S.io.observe(t.box));
  };
  /* the honest rung for the width it is drawn at under its crop, after the
     rung below it */
  const load = (box) => {
    const f = box._f; if (!f || box._loaded) return; box._loaded = true;
    const w = box.offsetWidth || 400, h = box.offsetHeight || 300;
    const need = Math.max(w, h * ratio(f)) * Math.min(2, window.devicePixelRatio || 1);
    const want = f.t384 && need <= 384 ? f.t384 : f.t768 && need <= 768 ? f.t768 : f.src;
    const rungs = [f.t384, f.t768, f.src].filter(Boolean);
    const quick = rungs.indexOf(want) > 0 ? rungs[rungs.indexOf(want) - 1] : null;
    const add = (src, then) => { const im = el("img"); im.alt = f.alt || ""; im.decoding = "async"; im.draggable = false; im.addEventListener("load", () => then(im), { once: true }); im.src = encodeURI(src); box.appendChild(im); return im; };
    let pv = null;
    if (quick) pv = add(quick, () => box.classList.add("in"));
    add(want, (im) => { im.classList.add("hi"); box.classList.add("in"); if (pv) setTimeout(() => pv.remove(), 400); });
  };

  /* in: each opener unveils from the top in reading order, the head's
     words rise after */
  const enter = (S, o) => {
    o = o || {};
    S.units.forEach((u) => { if (u._an) { u._an.cancel(); u._an = null; } u.style.visibility = ""; });
    S.items.forEach((t) => { if (t.box !== o.keep) t.box.style.visibility = ""; });
    if (still()) return;
    const box = S.ctx.scroller.getBoundingClientRect();
    S.units.filter((u) => !(o.keep && u.contains(o.keep)) && rectIn(u.getBoundingClientRect(), box)).forEach((u, i) => {
      const words = u.classList.contains("xk-head");
      u._an = u.animate(words ? [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }] : [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }],
        { duration: words ? 520 : 700, delay: (o.delay || 0) + (words ? 120 : 80) + i * 70, easing: EASE, fill: "backwards" });
    });
  };
  const leave = (S, keep) => {
    const box = S.ctx.scroller.getBoundingClientRect();
    S.units.filter((u) => rectIn(u.getBoundingClientRect(), box)).forEach((u, i) => {
      if (u._an) u._an.cancel();
      if (keep && u.contains(keep)) { keep.style.visibility = "hidden"; [...u.children].filter((c) => !c.contains(keep)).forEach((c) => c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" })); return; }
      u._an = u.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: i * 24, easing: DROP, fill: "forwards" });
    });
  };

  const render = (container, ctx) => {
    const S = { ctx, D: ctx.D || window.D, esc: ctx.esc || (ctx.D || window.D).esc, ks: (ctx.studies || []).slice(), root: el("div", "xk"), io: null };
    container.appendChild(S.root);
    layout(S);
    S.root.addEventListener("click", (ev) => {
      if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return;
      const fig = ev.target.closest(".xk-it"); if (!fig || !S.root.contains(fig)) return;
      ev.preventDefault();
      ctx.open(fig.dataset.k, fig.querySelector(".xk-pic"));
    });
    S.root.addEventListener("pointerover", (ev) => {
      if (ev.pointerType !== "mouse") return;
      const fig = ev.target.closest(".xk-it");
      if (fig === S.hov) return;
      S.hov = fig || null;
      ctx.hover(fig ? fig.dataset.k : null, fig ? fig.querySelector(".xk-pic") : null);
    });
    S.root.addEventListener("pointerleave", () => { if (S.hov) { S.hov = null; ctx.hover(null); } });
    return {
      destroy() { if (S.io) S.io.disconnect(); S.units.forEach((u) => { if (u._an) u._an.cancel(); }); S.root.remove(); },
      tileFor(k) { const t = S.items.find((x) => x.k === k); return t ? t.box : null; },
      onResize() {
        if (Math.abs(ctx.width - S.W) <= 30 && Math.abs(ctx.height - S.avail) <= 80 && !!ctx.phone === S.ph) return;
        const sc = ctx.scroller, f = sc.scrollTop / Math.max(1, sc.scrollHeight);
        layout(S); sc.scrollTop = f * sc.scrollHeight;
      },
      enter: (o) => enter(S, o),
      leave: (keep) => leave(S, keep),
      /* an index entry under the pointer: the openers it touches have their
         names set in ink bands, and nothing else changes */
      light(ks) { S.items.forEach((t) => t.fig.classList.toggle("hit", !!ks && ks.has(t.k))); },
    };
  };

  REG.stack = { label: "Stack", render };
})();
