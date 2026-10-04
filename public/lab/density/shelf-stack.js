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

  /* the same sentence end as the page's: not after an initial */
  const twoTone = (S, t) => { const m = /[a-z0-9%)"'\u2019\u201d][.!?]\s+(?=[A-Z])/.exec(t); return m ? S.esc(t.slice(0, m.index + 2)) + ' <span class="g">' + S.esc(t.slice(m.index + m[0].length)) + "</span>" : S.esc(t); };
  const headEl = (S) => {
    const e = S.ctx.entry || {};
    const h = el("header", "xk-head");
    const top = el("div", "xk-hl");
    /* a line is set as one run, the way a study's lead is: its name in
       ink, its sentence after it in grey, one size (27 Sept, his "not on
       black but reading together - maybe the category is black and the
       description lighter grey", with a study's two-tone lead as the
       model, "like that"). The values are the room's .sp-stand */
    if (e.kind === "line" && e.sentence) {
      top.appendChild(el("h2", "xk-stand", S.esc(e.name || "") + '. <span class="g">' + S.esc(e.sentence) + "</span>"));
      if (S.ks.length) top.appendChild(el("span", "xk-n caps", S.esc(S.lbl("Work")) + "<b>" + S.ks.length + "</b>"));
      h.appendChild(top);
      S.nm = null;
      return h;
    }
    const nm = el("h2", "xk-name" + (e.kind === "year" || e.kind === "fig" ? " num" : ""), S.esc(e.name || ""));
    top.appendChild(nm);
    if (S.ks.length) top.appendChild(el("span", "xk-n caps", S.esc(S.lbl("Work")) + "<b>" + S.ks.length + "</b>"));
    h.appendChild(top);
    if (e.label) h.appendChild(el("p", "xk-lbl caps", S.esc(S.lbl(e.label))));
    /* a homepage line (entry-lines.js) is set two-tone, as a study's lead:
       its first sentence ink, the rest grey */
    if (e.sentence) h.appendChild(el("p", "xk-sent" + (e.lead ? " lead" : ""), e.lead ? twoTone(S, e.sentence) : S.esc(e.sentence)));
    /* an index's cross-references: the entries worth reading next */
    if (e.see && e.see.length) h.appendChild(el("p", "xk-see", '<span class="xk-sl caps">' + S.esc(S.lbl("See also")) + "</span>" +
      e.see.map((x) => '<a href="#' + S.esc(x.key) + '" data-see="' + S.esc(x.key) + '">' + S.esc(x.name) + "</a>").join('<span class="xk-sd">·</span>')));
    S.nm = nm;
    return h;
  };
  const fitName = (S) => {
    const nm = S.nm; if (!nm) return; nm.style.fontSize = "";
    let fs = parseFloat(getComputedStyle(nm).fontSize) || 64;
    const over = () => nm.scrollWidth > nm.clientWidth + 1 || nm.offsetHeight > fs * 2.05;
    for (let i = 0; i < 24 && fs > 22 && over(); i++) { fs -= 2; nm.style.fontSize = fs + "px"; }
  };

  const layout = (S) => {
    const ctx = S.ctx;
    if (S.io) { S.io.disconnect(); S.io = null; }
    if (S.far) { S.far.disconnect(); S.far = null; }
    Object.assign(S, { W: ctx.width, avail: ctx.height, ph: !!ctx.phone, items: [], units: [] });
    /* the size a line's run is set at, on the shelf itself, so the Next
       panel at the foot sets the next line's run at the same size and the
       scroll into it lands true. It is the homepage intro's (27 Sept, his
       "make the font larger - same size as the homepage intro copy"): the
       statement at rest fits to at most 36px on a desk and 28 on a phone,
       so it stands at 35 and 27, tracked by crossref2's track() */
    if (ctx.scroller) {
      ctx.scroller.style.setProperty("--stand", (S.ph ? 27 : 35) + "px");
      ctx.scroller.style.setProperty("--stand-tr", (S.ph ? -0.03 : -0.042) + "em");
    }
    S.root.classList.toggle("ph", S.ph);
    const head = headEl(S);
    S.root.replaceChildren(head); S.units.push(head);
    fitName(S);
    const rh = { since: 1, need: 1 };
    S.ks.forEach((k, i) => {
      const t = figureOf(S, k, i, rh); if (!t) return;
      S.root.appendChild(t.fig);
      S.items.push(t); S.units.push(t.fig);
    });
    S.io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { S.io.unobserve(e.target); load(e.target, S); } }),
      /* above as well as below: a shelf can be arrived at from its end,
         scrolling back up (27 Sept) */
      { root: ctx.scroller || null, rootMargin: "60% 0px 60% 0px" });
    S.items.forEach((t) => S.io.observe(t.box));
    /* and two glasses out, the small rung alone, so on a slow line a
       picture is already there when the reader reaches it and only
       sharpens (4 Oct). A hover's preview loads less, and has none */
    if (!ctx.preview) {
      S.far = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { S.far.unobserve(e.target); load(e.target, S, true); } }),
        { root: ctx.scroller || null, rootMargin: "200% 0px 200% 0px" });
      S.items.forEach((t) => S.far.observe(t.box));
    }
    /* the first glass's openers start now, not a frame later when the
       observer first reports, so a shelf carried on from a foot that
       showed them has them on its first frame (4 Oct) */
    S.items.forEach((t) => { if (t.fig.offsetTop < S.avail) { S.io.unobserve(t.box); load(t.box, S); } });
  };
  /* one opener: its figure, the box the stage gives it, its credit. rh
     carries the rhythm from one to the next: a tall one comes when its
     picture can stand tall and one wide (then two, then one) has come
     since the last, the first opener included (Apps has one picture that
     can stand, and it is first), so no shelf runs tall, wide, tall, wide.
     `words` sets the section links as plain words, for a foot's preview,
     which sits inside a link of its own */
  const figureOf = (S, k, i, rh, words) => {
    const ctx = S.ctx;
    const f = openerOf(S, k); if (!f) return null;
    const s = S.D.study(k) || {};
    const live = !!(window.XREF_LIVE && window.XREF_LIVE(f));
    const judged = ON_LEAD.has(k) ? ctx.lead(k) : s.top;
    const tb = !live && TALL[k] != null && f === judged && rh.since >= rh.need ? tallBox(S, f) : null;
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
    const lc = locs.length ? '<span class="xk-locs">' + locs.map((l) => words ? '<span class="xk-l">§' + l.s + "</span>"
      : '<a class="xk-l" href="#study/' + S.esc(k) + '" data-at="' + S.esc(l.at) + '" title="' + S.esc(S.D.title(k)) + ", section " + l.s + '">§' + l.s + "</a>").join("") + "</span>" : "";
    const d = s.s ? '<span class="xk-d">' + S.esc(s.s) + "</span>" : "";
    fig.appendChild(el("figcaption", "xk-cap", no + t + y + lc + d));
    if (tb) { rh.since = 0; rh.need = rh.need === 1 ? 2 : 1; } else rh.since++;
    return { k, fig, box };
  };
  /* the honest rung for the width it is drawn at under its crop, after the
     rung below it. While the stack is only a hover's preview the honest
     file waits a beat, and does not come at all once the pointer has
     moved on and the preview is gone (27 Sept), so a sweep across the
     index does not fetch a dozen large files */
  /* the files this page has already shown: one asked for again (a foot's
     preview, then its shelf; a shelf opened before) goes straight in,
     sharp, without the rung under it or the fade (4 Oct) */
  const HELD = new Set();
  /* honest files go two at a time, the one nearest the glass first, so on
     a slow line the small rungs of the boxes being reached never wait
     behind large files for boxes already passed (4 Oct). One whose box
     has left the page is dropped */
  const LANE = { n: 0, q: [] };
  const pump = () => {
    LANE.q = LANE.q.filter((j) => j.box.isConnected);
    while (LANE.n < 2 && LANE.q.length) {
      const vh = innerHeight;
      const far = (b) => { const r = b.getBoundingClientRect(); return r.bottom < 0 ? -r.bottom : r.top > vh ? r.top - vh : 0; };
      let bi = 0, bd = Infinity;
      LANE.q.forEach((j, i) => { const d = far(j.box); if (d < bd) { bd = d; bi = i; } });
      const j = LANE.q.splice(bi, 1)[0];
      let fin = false; LANE.n++;
      j.start(() => { if (fin) return; fin = true; LANE.n--; pump(); });
    }
  };
  const lane = (box, start) => { LANE.q.push({ box, start }); pump(); };
  /* `small` takes only the rung under the honest one, for a preview the
     reader has not come near yet; a later load brings the honest one */
  const load = (box, S, small) => {
    const f = box._f; if (!f || box._loaded || (small && box._small)) return;
    /* a picture that is a running thing on this page runs (Faux Reel) */
    if (window.XREF_LIVE && window.XREF_LIVE(f)) { if (!small) { box._loaded = true; window.XREF_LIVE(f, box); } return; }
    const w = box.offsetWidth || 400, h = box.offsetHeight || 300;
    const need = Math.max(w, h * ratio(f)) * Math.min(2, window.devicePixelRatio || 1);
    const want = f.t384 && need <= 384 ? f.t384 : f.t768 && need <= 768 ? f.t768 : f.src;
    const rungs = [f.t384, f.t768, f.src].filter(Boolean);
    const quick = rungs.indexOf(want) > 0 ? rungs[rungs.indexOf(want) - 1] : null;
    /* the small rung goes ahead of every honest file in flight, so a
       box the reader has reached is never left waiting behind a large
       one further on (4 Oct) */
    const add = (src, then, pri) => { const im = el("img"); im.alt = f.alt || ""; im.decoding = "async"; im.draggable = false; if (pri) im.fetchPriority = pri; if (box._pos) im.style.objectPosition = box._pos; im.addEventListener("load", () => { HELD.add(src); then(im); }, { once: true }); im.src = encodeURI(src); box.appendChild(im); return im; };
    let pv = box._pv || null;
    if (HELD.has(want)) {
      box._loaded = true;
      add(want, () => {}).classList.add("hi"); box.classList.add("in");
      if (pv) setTimeout(() => pv.remove(), 400);
      return;
    }
    if (small && quick) { box._small = true; if (!pv) box._pv = add(quick, () => box.classList.add("in"), "high"); return; }
    box._loaded = true;
    if (quick && !pv) pv = add(quick, () => box.classList.add("in"), "high");
    const show = (im) => { im.classList.add("hi"); box.classList.add("in"); if (pv) setTimeout(() => pv.remove(), 400); };
    /* the honest file over a rung already showing is kept out of sight
       until it is whole and decoded, then shown at once (4 Oct 2026, his
       "when i scroll i see the images which is great but then there's a
       blink/fade when it reloads"). Most of the large files are
       progressive JPEGs: drawn as they arrived, their first coarse pass
       laid a blur over the sharp rung under it, then sharpened */
    const whole = (im, then) => { const go = () => { im.classList.remove("ld"); then(im); }; if (im.decode) im.decode().then(go, go); else go(); };
    /* with a rung under it the honest file takes its turn in the lane;
       a box whose honest file is the smallest rung takes it at once */
    const honest = () => quick
      ? lane(box, (done) => { const im = add(want, (x) => whole(x, (y) => { show(y); done(); }), "low"); im.classList.add("ld"); im.addEventListener("error", done, { once: true }); })
      : add(want, show);
    if (quick && S && S.ctx && S.ctx.preview) setTimeout(() => { if (box.isConnected && !S.ctx.gone) honest(); }, 240);
    else honest();
  };

  /* in: each opener unveils from the top in reading order, the head's
     words rise after. The first `shown` were already on the glass in the
     foot the reader carried on from, so they stay still, as the kept
     head does */
  const enter = (S, o) => {
    o = o || {};
    S.units.forEach((u) => { if (u._an) { u._an.cancel(); u._an = null; } u.style.visibility = ""; });
    S.items.forEach((t) => { if (t.box !== o.keep) t.box.style.visibility = ""; });
    if (still()) return;
    const box = S.ctx.scroller.getBoundingClientRect();
    const kept = new Set(S.items.slice(0, o.shown || 0).map((t) => t.fig));
    S.units.filter((u) => !(o.keep && u.contains(o.keep)) && !kept.has(u) && rectIn(u.getBoundingClientRect(), box)).forEach((u, i) => {
      const words = u.classList.contains("xk-head");
      /* the page's motion family, when it has one for a shelf */
      const fx = window.XREF_IN && window.XREF_IN(words);
      u._an = u.animate(fx ? fx.kf : words ? [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }] : [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }],
        { duration: fx ? fx.dur : words ? 520 : 700, delay: (o.delay || 0) + (words ? 120 : 80) + i * 70 * (fx && fx.step || 1), easing: fx ? fx.ease : EASE, fill: "backwards" });
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
    const S = { ctx, D: ctx.D || window.D, esc: ctx.esc || (ctx.D || window.D).esc, lbl: ctx.label || ((t) => t), ks: (ctx.studies || []).slice(), root: el("div", "xk"), io: null };
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
      destroy() { if (S.io) S.io.disconnect(); if (S.far) S.far.disconnect(); S.units.forEach((u) => { if (u._an) u._an.cancel(); }); S.root.remove(); },
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

  /* ── a foot's preview (4 Oct 2026, his "when a user scrolls the projects
     images dont load/display until the it's fully loaded - makes it feel
     like something wasnt loading correctly...is there another approach so
     on the intitial scroll there are images/projects displayed?"). The
     glass of paper a foot brings up under the next entry's name stood
     empty, and that shelf's pictures were asked for only once it opened.
     Now the foot sets the shelf's first openers under the name, as many as
     its glass holds, at the sizes and in the places the shelf will give
     them, by the same hand (figureOf). They hang from where the shelf will
     set its head: the head is built unseen for its height, and the foot's
     top lands that far above the running head's line when it carries on.
     The page asks for their files while the reader is still above, so the
     shelf opens on pictures already there, and keeps them still ── */
  const peek = (foot, ctx) => {
    const S = { ctx, D: ctx.D || window.D, esc: ctx.esc || (ctx.D || window.D).esc, lbl: ctx.label || ((t) => t), ks: (ctx.studies || []).slice(), items: [], lvl: 0, io: null };
    const root = el("div", "xk xk-peek"); root.setAttribute("aria-hidden", "true");
    foot.classList.add("peeks"); foot.appendChild(root);
    const lay = () => {
      Object.assign(S, { W: ctx.width, avail: ctx.height, ph: !!ctx.phone });
      root.classList.toggle("ph", S.ph);
      const hd = headEl(S); hd.style.visibility = "hidden"; root.replaceChildren(hd); fitName(S);
      const glass = ctx.scroller ? ctx.scroller.clientHeight : innerHeight;
      const top = (ctx.head || 0) - (glass - foot.offsetHeight) + hd.getBoundingClientRect().height;
      hd.remove(); S.items = [];
      root.style.top = top + "px";
      const rh = { since: 1, need: 1 };
      for (let i = 0, y = top; i < S.ks.length && y < foot.clientHeight; i++) {
        const t = figureOf(S, S.ks[i], i, rh, true); if (!t) continue;
        root.appendChild(t.fig); S.items.push(t); y += t.fig.offsetHeight;
      }
      const l = S.lvl; S.lvl = 0; if (l) api.load(l === 1);
    };
    const api = {
      /* the small rungs only, or everything the shelf will ask for */
      load(small) {
        const l = small ? 1 : 2; if (l <= S.lvl) return; S.lvl = l;
        S.items.forEach((t) => load(t.box, S, !!small));
      },
      /* everything, once the foot comes within m of the glass's foot */
      near(m) {
        if (S.io || !ctx.scroller) return;
        S.io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { S.io.disconnect(); api.load(false); } }, { root: ctx.scroller, rootMargin: "0px 0px " + m + " 0px" });
        S.io.observe(foot);
      },
      relayout() { if (Math.abs(ctx.width - S.W) > 2 || Math.abs(ctx.height - S.avail) > 2 || !!ctx.phone !== S.ph) lay(); },
      get n() { return S.items.length; },
      destroy() { if (S.io) S.io.disconnect(); root.remove(); foot.classList.remove("peeks"); },
    };
    lay();
    return api;
  };

  REG.stack = { label: "Stack", render, peek };
})();
