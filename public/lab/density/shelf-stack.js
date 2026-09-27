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
     largest; never a transparent one when another will do. A.R.C. opens on
     its board picture, the phone on grey, not its top one on wood (27
     Sept, his "let's not use this image for ARC - let's use the one
     that's grey/blue in the phone") */
  const ON_LEAD = new Set(["arc"]);
  const openerOf = (S, k) => {
    if (ON_LEAD.has(k) && S.ctx.lead(k)) return S.ctx.lead(k);
    const s = S.D.study(k) || {};
    const own = (S.ctx.pics(k) || []).filter((f) => f.w && f.h && !f.alpha).sort((a, b) => b.w - a.w);
    return s.top || S.ctx.lead(k) || own[0] || null;
  };
  /* ── heights (27 Sept, his "on these category sections can we try and
     vary the heights of the images? i know they're all wide originally but
     some of them can work vertically if resized correctly and it'll help
     vary those sections some"). Every opener was cut 4:5 around its
     subject and laid on a contact sheet: a spectral-residual pass found
     the window holding most of what the eye goes to, and the eye kept it
     or moved it (the two storefront windows, the kitchen and the bath to
     their middles, the chalet between its stove and its glass). These
     held. A laptop on a table does not: its screen gets cut. The number is
     where the crop's middle sits across the picture, 0 to 1. It is the
     opener that was looked at (the top picture, or A.R.C.'s board one),
     so it applies to that picture only.
     Then his "for the verticals instead of doing this side by side i think
     for it to feel more heroic we do the verticals full bleed in the column
     with the project text below": a tall one takes the stage's whole width
     like any opener, as tall as 4:5 or the glass allows, its credit under
     it ── */
  const TALL = {
    "branding-graphics": 0.59, "neiman-marcus": 0.57, "nordstrom-framework": 0.48, "amber-shockey-co": 0.39,
    "loved-by-nordstrom": 0.76, "capitan-boot-co": 0.56, "j-christianson": 0.52, "you-by-sally": 0.52,
    "fairview-bedroom": 0.28, "big-bend": 0.47, "hill-country-kitchen": 0.47, "hill-country-bath": 0.52,
    "black-white-type": 0.34, "hill-country-living": 0.64, "floor-and-decor": 0.33, "fairview-sitting": 0.52,
    "fairview-entry": 0.28, "chalet": 0.38, "arc": 0.5, "robert-rodriguez": 0.515,
  };
  /* a tall one: the stage's whole width, 4:5 or the height of the glass
     under the running head, whichever is less (a phone keeps its 0.72);
     only if the crop is still drawn at half its pixels */
  const tallBox = (S, f) => {
    const w = S.W, h = Math.round(Math.min(w * 1.25, S.avail * (S.ph ? 0.72 : 1)));
    return Math.max(w / f.w, h / f.h) <= 0.5 ? { w, h } : null;
  };
  /* where the crop sits, as object-position: its middle at fx */
  const posOf = (f, w, h, fx) => {
    const cw = (w / h) / ratio(f); if (cw >= 1) return "50% 50%";
    return (Math.max(0, Math.min(1, (fx - cw / 2) / (1 - cw))) * 100).toFixed(1) + "% 50%";
  };
  /* its box: the stage's width and its own shape, cropped to the glass if
     it is taller, and narrower if the file cannot fill the width */
  const boxOf = (S, f) => {
    let w = Math.min(S.W, f.w / 2), h = w / ratio(f);
    const maxH = Math.round(S.avail * (S.ph ? 0.72 : 0.9));
    if (h > maxH) { const drawn = Math.max(w, maxH * ratio(f)); if (drawn <= f.w / 2) h = maxH; }
    return { w: Math.round(w), h: Math.round(h) };
  };

  const twoTone = (S, t) => { const m = /[.!?]\s+(?=[A-Z])/.exec(t); return m ? S.esc(t.slice(0, m.index + 1)) + ' <span class="g">' + S.esc(t.slice(m.index + m[0].length)) + "</span>" : S.esc(t); };
  const headEl = (S) => {
    const e = S.ctx.entry || {};
    const h = el("header", "xk-head");
    const top = el("div", "xk-hl");
    const nm = el("h2", "xk-name" + (e.kind === "year" || e.kind === "fig" ? " num" : ""), S.esc(e.name || ""));
    top.appendChild(nm);
    if (S.ks.length) top.appendChild(el("span", "xk-n caps", "Work<b>" + S.ks.length + "</b>"));
    h.appendChild(top);
    if (e.label) h.appendChild(el("p", "xk-lbl caps", S.esc(e.label)));
    /* a homepage line (entry-lines.js) is set two-tone, as a study's lead:
       its first sentence ink, the rest grey */
    if (e.sentence) h.appendChild(el("p", "xk-sent" + (e.lead ? " lead" : ""), e.lead ? twoTone(S, e.sentence) : S.esc(e.sentence)));
    /* an index's cross-references: the entries worth reading next */
    if (e.see && e.see.length) h.appendChild(el("p", "xk-see", '<span class="xk-sl caps">See also</span>' +
      e.see.map((x) => '<a href="#' + S.esc(x.key) + '" data-see="' + S.esc(x.key) + '">' + S.esc(x.name) + "</a>").join('<span class="xk-sd">·</span>')));
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
    /* the rhythm: a tall one comes when its picture can stand tall and
       one wide (then two, then one) has come since the last, the first
       opener included (Apps has one picture that can stand, and it is
       first), so no shelf runs tall, wide, tall, wide */
    let since = 1, need = 1;
    S.ks.forEach((k, i) => {
      const f = openerOf(S, k); if (!f) return;
      const s = S.D.study(k) || {};
      const live = !!(window.XREF_LIVE && window.XREF_LIVE(f));
      const judged = ON_LEAD.has(k) ? S.ctx.lead(k) : s.top;
      const tb = !live && TALL[k] != null && f === judged && since >= need ? tallBox(S, f) : null;
      /* Faux Reel runs, so it takes the stage like a picture that can fill
         it, at the reel's own 16:9 */
      const { w, h } = tb || (live ? { w: S.W, h: Math.round(Math.min(S.W * 9 / 16, S.avail * 0.9)) } : boxOf(S, f));
      const fig = el("figure", "xk-it" + (tb ? " tall" : w < S.W - 2 ? " narrow" : "")); fig.dataset.k = k;
      const box = el("div", "xk-pic" + (f.alpha ? " alpha" : "")); box.style.width = w + "px"; box.style.height = h + "px"; box._f = f;
      if (tb) box._pos = posOf(f, w, h, TALL[k]);
      fig.appendChild(box);
      /* the study's own number, and the sections this entry sits in, each
         a way straight to its place (27 Sept, the locators) */
      const locs = ctx.locs ? ctx.locs(k) : [];
      const no = '<span class="xk-no">' + (ctx.num ? ctx.num(k) : two(i + 1)) + "</span>";
      const t = '<span class="xk-t">' + S.esc(S.D.title(k)) + "</span>";
      const y = '<span class="xk-y">' + (s.y || "") + "</span>";
      const lc = locs.length ? '<span class="xk-locs">' + locs.map((l) => '<a class="xk-l" href="#study/' + S.esc(k) + '" data-at="' + S.esc(l.at) + '" title="' + S.esc(S.D.title(k)) + ", section " + l.s + '">§' + l.s + "</a>").join("") + "</span>" : "";
      const d = s.s ? '<span class="xk-d">' + S.esc(s.s) + "</span>" : "";
      fig.appendChild(el("figcaption", "xk-cap", no + t + y + lc + d));
      S.root.appendChild(fig);
      S.items.push({ k, fig, box }); S.units.push(fig);
      if (tb) { since = 0; need = need === 1 ? 2 : 1; } else since++;
    });
    S.io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { S.io.unobserve(e.target); load(e.target, S); } }),
      /* above as well as below: a shelf can be arrived at from its end,
         scrolling back up (27 Sept) */
      { root: ctx.scroller || null, rootMargin: "60% 0px 60% 0px" });
    S.items.forEach((t) => S.io.observe(t.box));
  };
  /* the honest rung for the width it is drawn at under its crop, after the
     rung below it. While the stack is only a hover's preview the honest
     file waits a beat, and does not come at all once the pointer has
     moved on and the preview is gone (27 Sept), so a sweep across the
     index does not fetch a dozen large files */
  const load = (box, S) => {
    const f = box._f; if (!f || box._loaded) return; box._loaded = true;
    /* a picture that is a running thing on this page runs (Faux Reel) */
    if (window.XREF_LIVE && window.XREF_LIVE(f, box)) return;
    const w = box.offsetWidth || 400, h = box.offsetHeight || 300;
    const need = Math.max(w, h * ratio(f)) * Math.min(2, window.devicePixelRatio || 1);
    const want = f.t384 && need <= 384 ? f.t384 : f.t768 && need <= 768 ? f.t768 : f.src;
    const rungs = [f.t384, f.t768, f.src].filter(Boolean);
    const quick = rungs.indexOf(want) > 0 ? rungs[rungs.indexOf(want) - 1] : null;
    const add = (src, then) => { const im = el("img"); im.alt = f.alt || ""; im.decoding = "async"; im.draggable = false; if (box._pos) im.style.objectPosition = box._pos; im.addEventListener("load", () => then(im), { once: true }); im.src = encodeURI(src); box.appendChild(im); return im; };
    let pv = null;
    if (quick) pv = add(quick, () => box.classList.add("in"));
    const honest = () => add(want, (im) => { im.classList.add("hi"); box.classList.add("in"); if (pv) setTimeout(() => pv.remove(), 400); });
    if (quick && S && S.ctx && S.ctx.preview) setTimeout(() => { if (box.isConnected && !S.ctx.gone) honest(); }, 240);
    else honest();
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
      /* a locator opens the study at its section, without a flight */
      const l = ev.target.closest("a.xk-l");
      if (l) { ctx.open(fig.dataset.k, null, l.dataset.at); return; }
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
