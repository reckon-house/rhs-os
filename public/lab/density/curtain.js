/* ── THE CURTAIN (27 Sept 2026): leaving the page the way the site does ─
   His words: "load and unload animation, etc. really bring this to
   life". The site already has its unload, the three-beat curtain, and
   the board already plays it into a static page's hard navigation
   (board.html, playTransition and ptSwap). This is that driver, lifted
   as it is: the destination's name repeated down a white panel that
   falls and a black one that rises over it, the size and the count
   measured to fill the glass, then a note in sessionStorage and the
   navigation at full black. The page that arrives draws the same
   curtain before its first paint and lifts it (the board in its head,
   the Next app in src/app/layout.tsx), so the reveal belongs to it.

       Curtain.go(href, title, sub)

   Reduced motion goes straight there. Coming back through history, the
   page restored is the one left at full black, so it lifts itself.

   The same curtain can also play inside the page, over one column
   rather than the whole glass (27 Sept, crossref2's content column when
   a study opens from the index):

       Curtain.cover(title, sub)  the first two beats; resolves at black
       Curtain.lift()             the third, off what is now under it

   A second cover() while one runs takes the new name and the same
   black. The column is the element's own box: .pt.ptc in curtain.css.

   EXPLORATIONS (6 Oct 2026). His "if we do something more graphic to the
   font treatment? i like how it functions with the swipe/curtain...and
   the way the words/lines animate in and out is also cool but maybe the
   lines repeat and fill the entire right column? maybe they even bleed
   off the edges?". The same swipe and the same lines rising in and out,
   the type set another way:

       ?curtain=fill     the name at display size, repeated along every
                         line and staggered line to line, off both edges
       ?curtain=outline  fill, every other line drawn instead of filled
       ?curtain=drift    fill, each line running sideways, alternate
                         lines the other way
       ?curtain=giant    a word a line, as large as five lines allow,
                         lines hugging the left edge and the right in turn
       ?curtain=ramp     the name growing down the column, small to huge
       ?curtain=ramp-outline
                         ramp with every other line drawn, in medium and
                         tracked by size as the site's type is (his "i
                         really like ramp! can we try mixing in outline
                         with it and making sure the weight matches what
                         we're doing on the rest of the site?")

   RAMP IS THE CURTAIN (6 Oct 2026, his "let's make ramp the default (no
   ramp and outline)!"): in the column and leaving the page, in medium,
   tracked by size, the weight he asked for with the outline. The others
   stay switches; ?curtain=stack is the stack it replaced, and
   ?curtain=ramp-demi the ramp in demi as he first saw it.

   /lab/curtain/ plays each in a loop, slowed if asked (window.CURTAIN_X
   stretches every beat; 1 is the site's own). */
(() => {
  const STEP = 0.03, STEP_OUT = 0.02, MIN = 14;
  const X = () => window.CURTAIN_X || 1;
  const MODES = ["ramp", "ramp-demi", "ramp-outline", "fill", "outline", "drift", "giant", "poster", "bands", "wire"];
  const GRID = ["poster", "bands", "wire"];
  /* what a grid treatment knows besides the name: the study's year */
  let META = {};
  /* tracked in as it grows, on the site's own ladder (crossref2.js track()) */
  const track = (px) => (px >= 150 ? -0.06 : px >= 90 ? -0.055 : px >= 54 ? -0.05 : px >= 34 ? -0.042 : px >= 21 ? -0.03 : -0.012);
  const asked = (new URLSearchParams(location.search).get("curtain") || "").toLowerCase();
  let MODE = asked === "stack" ? "" : MODES.includes(asked) ? asked : "ramp";
  let PT = null, busy = false;
  const make = (cls) => {
    const pt = document.createElement("div"); pt.className = "pt" + (cls ? " " + cls : ""); pt.setAttribute("aria-hidden", "true");
    pt.innerHTML = '<div class="ptw"><div class="ptstack"></div></div><div class="ptb"><div class="ptstack"></div></div>';
    document.body.appendChild(pt);
    return pt;
  };
  const build = () => { if (!PT) { PT = make(); PT.id = "pt"; } return PT; };
  /* a beat ends on its panel's own transition; the lines' ends bubble up
     and would cut it short. A floor in case the transition never fires */
  const beat = (pt, cls, el) => new Promise((res) => {
    let done = false;
    const end = (e) => { if (done || (e && e.target !== el)) return; done = true; el.removeEventListener("transitionend", end); res(); };
    el.addEventListener("transitionend", end);
    pt.classList.add(cls);
    setTimeout(end, 1400 * X());
  });
  const lineEl = (title, sub, d) => {
    const l = document.createElement("span"); l.className = "ptl";
    if (d != null) l.style.setProperty("--d", d);
    l.textContent = title || "";
    if (sub) { const t = document.createElement("span"); t.className = "sub"; t.textContent = "  " + sub; l.appendChild(t); }
    return l;
  };
  /* an exploration's lines (above), built once and copied into both
     panels at the same coordinates, so the type still inverts along the
     moving edge */
  const fillMode = (pt, stacks, title, sub, mode) => {
    if (GRID.includes(mode)) { gridMode(pt, stacks, title, sub, mode); return; }
    const W = stacks[0].clientWidth || pt.clientWidth || innerWidth, H = pt.clientHeight || innerHeight;
    const name = String(title || "").trim(), step = STEP * X(), out = [];
    const widthOf = (txt, px) => {
      const p = document.createElement("span"); p.className = "ptl";
      p.style.cssText = "position:absolute;visibility:hidden;opacity:1;font-size:" + px + "px";
      p.textContent = txt; stacks[0].appendChild(p);
      const w = p.offsetWidth; p.remove(); return w;
    };
    const line = (cls, i, d, fs, lh) => {
      const l = document.createElement("span"); l.className = "ptl" + (cls ? " " + cls : "");
      l.style.setProperty("--d", (i * d).toFixed(3) + "s");
      l.style.fontSize = fs.toFixed(2) + "px"; l.style.lineHeight = lh.toFixed(2) + "px";
      return l;
    };
    const run = (txt, reps) => {
      const r = document.createElement("span"); r.className = "ptr";
      for (let i = 0; i < reps; i++) { const t = document.createElement("span"); t.className = "ptt"; t.textContent = txt; r.appendChild(t); }
      return r;
    };
    let top = 0;
    if (mode === "fill" || mode === "outline" || mode === "drift") {
      /* about eight lines down a laptop's column, set solid, one more than
         fits so the frame cuts the first and the last */
      const N = Math.max(5, Math.round(H / 112)), lh = H / N, fs = lh / 0.9;
      const gap = fs * 0.42, P = widthOf(name, fs) + gap, reps = Math.ceil(W / P) + 2;
      for (let i = 0; i <= N; i++) {
        const l = line(mode === "outline" && i % 2 ? "o" : "", i, step, fs, lh), r = run(name, reps);
        r.style.setProperty("--x", (-((i * 0.382) % 1) * P).toFixed(1) + "px");
        r.style.setProperty("--P", P.toFixed(1) + "px");
        r.style.setProperty("--gap", gap.toFixed(1) + "px");
        /* a name a lap, at about 150px a second */
        if (mode === "drift") r.style.setProperty("--pd", (P / 150 * X()).toFixed(2) + "s");
        l.appendChild(r); out.push(l);
      }
      top = -lh / 2;
    } else if (mode === "giant") {
      const words = name.split(/\s+/).filter((t) => t && !/^[-–·|/]+$/.test(t));
      const N = 5, lh = H / N, fs = lh / 0.84;
      for (let i = 0; i <= N; i++) {
        const l = line(i % 2 ? "r" : "", i, step * 1.6, fs, lh);
        l.appendChild(run(words.length ? words[i % words.length] : name, 1)); out.push(l);
      }
      top = -lh / 2;
    } else if (mode.startsWith("ramp")) {
      const ro = mode === "ramp-outline", demi = mode === "ramp-demi";
      for (let i = 0, fs = 13, y = 0; y < H && i < 40; i++, fs *= 1.28) {
        /* every other line drawn, once a line is large enough to draw:
           the largest the column shows is one of them */
        const l = line(ro && i % 2 && fs >= 28 ? "o" : "", i, step, fs, fs);
        if (!demi) l.style.letterSpacing = track(fs) + "em";
        l.textContent = name;
        if (sub) { const t = document.createElement("span"); t.className = "sub"; t.textContent = "  " + sub; l.appendChild(t); }
        out.push(l); y += fs;
      }
    }
    stacks.forEach((s, k) => { s.style.setProperty("--top", top.toFixed(1) + "px"); out.forEach((l) => s.appendChild(k ? l.cloneNode(true) : l)); });
  };

  /* ── THE POSTER (8 Oct 2026). His reference, a Swiss type poster: one
     word repeated in a grid of cells at every size and weight, each cell
     black, white or grey and cropping the word at its edges, empty cells
     crossed out like a layout's placeholders, a number set twice, the
     first cut off. "could be cool as part of the page transition ... a
     few concepts on how we could do a version of this". Three, on the
     same two panels and the same beats:

       ?curtain=poster  the poster's own grid, the study's name in it, its
                        year twice; the falling panel is the poster in
                        negative, the rising one the poster
       ?curtain=bands   the poster's left column across the whole width:
                        the name in bands of weight and fill, each band
                        cutting it at its edge
       ?curtain=wire    a layout's wireframe falls, boxes crossed out, and
                        the rising panel prints the filled layout over it

     Each cell wipes open in reading order and its word rises inside it;
     the crosses draw. Words are drawn on canvases (the crop and the
     baseline have to be exact), notes are text ── */
  /* the grey is the site's own, the index's highlight (--hl, #ECECEC; 8 Oct
     2026, his "bands is cool! can we make the grey lighter like the grey we
     use?"), read off the page at each cover so ?hl= moves it too */
  const PAL = { w: "#ffffff", g: "#ECECEC", k: "#0b0b0b" };
  const NEG = { w: "k", k: "w", g: "g" };
  const FONT = (wt, px) => wt + " " + px.toFixed(2) + 'px "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif';
  const MC = document.createElement("canvas").getContext("2d");
  const capOf = (wt) => { MC.font = FONT(wt, 100); return (MC.measureText("H").actualBoundingBoxAscent || 70) / 100; };
  const spaced = "letterSpacing" in MC;
  /* the weights a canvas draws in, asked for now so the first cover has them */
  try { [400, 500, 800].forEach((w) => document.fonts.load(w + ' 40px "Avenir Next"')); } catch (e) { /* no font loading API */ }
  const measure = (txt, px, wt) => {
    const tr = track(px) * px; MC.font = FONT(wt, px);
    if (spaced) { MC.letterSpacing = tr.toFixed(2) + "px"; const w = MC.measureText(txt).width - tr; MC.letterSpacing = "0px"; return w; }
    let w = 0; for (const ch of txt) w += MC.measureText(ch).width + tr; return w - tr;
  };
  const draw = (cx, txt, x, base, px, wt, color) => {
    const tr = track(px) * px; cx.font = FONT(wt, px); cx.fillStyle = color; cx.textBaseline = "alphabetic";
    if (spaced) { cx.letterSpacing = tr.toFixed(2) + "px"; cx.fillText(txt, x, base); cx.letterSpacing = "0px"; return; }
    let xx = x; for (const ch of txt) { cx.fillText(ch, xx, base); xx += cx.measureText(ch).width + tr; }
  };
  /* a size at which txt runs `avail` wide, tracked as the site tracks it */
  const fitPx = (txt, avail, wt) => { let px = 100; for (let i = 0; i < 3; i++) px *= avail / Math.max(1, measure(txt, px, wt)); return px; };
  /* the name the poster repeats: the study's name before its subtitle
     ("Ivy Park" of "Ivy Park by Beyoncé"), and a single word of it when
     a cell sets it huge */
  const mainOf = (t) => (String(t || "").split(/\s+[-–]\s+|,\s+|\s+x\s+|\s+by\s+/i)[0] || "").trim() || String(t || "");
  const wordOf = (m) => (m.length <= 9 ? m : m.split(/\s+/)[0]);
  /* cells as fractions of the panel: x, y, w, h, fill, kind */
  const C = (x, y, w, h, f, k, o) => Object.assign({ x, y, w, h, f, k }, o || {});
  /* a "giant" cell draws its share of one heavy line laid across the
     panel (the poster's "Publ" running on into the next cells as "ic"),
     each cell in its own ink: base and cap as fractions of the height */
  const GIANT = { poster: { base: 0.6, cap: 0.22 } };
  const LAYOUTS = {
    poster: [
      C(0, 0, 0.64, 0.07, "w"), C(0.64, 0, 0.36, 0.07, "k"),
      C(0, 0.07, 0.64, 0.11, "g", "word", { t: "m", wt: 500, cut: 0.45, like: 4 }), C(0.64, 0.07, 0.36, 0.11, "g", "x"),
      C(0, 0.18, 0.64, 0.16, "w", "word", { t: "m", wt: 500 }), C(0.64, 0.18, 0.36, 0.16, "k"),
      C(0, 0.34, 0.64, 0.21, "k", "giant", { note: "sub" }), C(0.64, 0.34, 0.36, 0.21, "g", "giant"),
      C(0, 0.55, 0.38, 0.28, "w", "huge", { t: "m", wt: 800 }), C(0.38, 0.55, 0.26, 0.28, "g", "x"),
      C(0.64, 0.55, 0.36, 0.1, "g", "num", { cut: 0.45 }), C(0.64, 0.65, 0.36, 0.18, "w", "num"),
      C(0, 0.83, 0.38, 0.17, "g", "huge", { t: "m", wt: 800, off: -0.12 }), C(0.38, 0.83, 0.62, 0.17, "k", "notes"),
    ],
    bands: [
      C(0, 0, 1, 0.12, "g", "word", { t: "m", wt: 400, cut: 0.5, like: 1 }),
      C(0, 0.12, 1, 0.18, "w", "word", { t: "m", wt: 400 }),
      C(0, 0.3, 1, 0.22, "k", "huge", { t: "m", wt: 800, note: "sub", low: 0.16 }),
      C(0, 0.52, 1, 0.26, "w", "huge", { t: "m", wt: 800, off: -0.03 }),
      C(0, 0.78, 1, 0.12, "g", "word", { t: "m", wt: 500, cut: 0.55, like: 1 }),
      C(0, 0.9, 0.62, 0.1, "k", "notes"), C(0.62, 0.9, 0.38, 0.1, "w", "num"),
    ],
    wire: [
      C(0, 0, 2 / 3, 0.2, "w", "word", { t: "m", wt: 500 }), C(2 / 3, 0, 1 / 3, 0.2, "g", "x"),
      C(0, 0.2, 1 / 3, 0.25, "g", "x"), C(1 / 3, 0.2, 2 / 3, 0.25, "k", "huge", { t: "m", wt: 800 }),
      C(0, 0.45, 2 / 3, 0.15, "w", "word", { t: "m", wt: 400, cut: 0.4 }), C(2 / 3, 0.45, 1 / 3, 0.3, "w", "num"),
      C(0, 0.6, 1 / 3, 0.15, "k", "notes"), C(1 / 3, 0.6, 1 / 3, 0.15, "g", "x"),
      C(0, 0.75, 1 / 3, 0.25, "g", "x"), C(1 / 3, 0.75, 2 / 3, 0.25, "g", "huge", { t: "m", wt: 800, off: 0.04 }),
    ],
  };
  const svgNS = "http://www.w3.org/2000/svg";
  const cross = (w, h, color) => {
    const sv = document.createElementNS(svgNS, "svg"); sv.setAttribute("class", "ptx"); sv.setAttribute("width", w); sv.setAttribute("height", h); sv.setAttribute("viewBox", "0 0 " + w + " " + h);
    [[0, 0, w, h], [w, 0, 0, h]].forEach(([a, b, c, d]) => {
      const l = document.createElementNS(svgNS, "line"); l.setAttribute("x1", a); l.setAttribute("y1", b); l.setAttribute("x2", c); l.setAttribute("y2", d);
      l.setAttribute("stroke", color); l.setAttribute("stroke-width", "1"); l.setAttribute("pathLength", "1"); sv.appendChild(l);
    });
    return sv;
  };
  const cellOf = (c, W, H, neg, wire, words, sub, year, title, d, cells, mode) => {
    const x = Math.round(c.x * W), y = Math.round(c.y * H), w = Math.round((c.x + c.w) * W) - x, h = Math.round((c.y + c.h) * H) - y;
    const e = document.createElement("div"); e.className = "ptg";
    e.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px";
    e.style.setProperty("--d", d.toFixed(3) + "s");
    /* the wireframe: every cell an empty box, crossed */
    if (wire) { e.classList.add("ptg-wire"); e.style.background = PAL.w; e.appendChild(cross(w, h, PAL.k)); return e; }
    const fk = neg ? NEG[c.f] : c.f, ink = fk === "k" ? PAL.w : PAL.k;
    e.style.background = PAL[fk];
    e.style.setProperty("--ink", ink);
    let k = c.k;
    if ((k === "num") && !year) k = "x";
    if (k === "x") { e.appendChild(cross(w, h, ink)); return e; }
    if (k === "notes") {
      const n = document.createElement("div"); n.className = "ptn";
      [title, sub, "", "Work by Jeremy Prasatik"].forEach((t) => { const p = document.createElement("p"); p.textContent = t || " "; n.appendChild(p); });
      e.appendChild(n); return e;
    }
    if (!k) return e;
    const txt = k === "num" ? String(year) : k === "giant" ? words.m : c.t === "m" ? words.m : words.w;
    const r = Math.min(2, window.devicePixelRatio || 1);
    const cv = document.createElement("canvas"); cv.className = "ptwd";
    cv.width = Math.ceil(w * r); cv.height = Math.ceil(h * r); cv.style.width = w + "px"; cv.style.height = h + "px";
    const cx = cv.getContext("2d"); cx.scale(r, r);
    const wt = k === "giant" ? 800 : c.wt || 400, pad = Math.max(10, Math.round(Math.min(W, 900) * 0.022));
    /* a word fits its cell's width, but never taller than the cell (a
       short name would blow up); a cut word takes the size of the cell it
       is `like` and drops below its own bottom edge */
    const sizeFor = (cc, t2) => {
      const cw = Math.round((cc.x + cc.w) * W) - Math.round(cc.x * W), ch = Math.round((cc.y + cc.h) * H) - Math.round(cc.y * H);
      return Math.min(fitPx(t2, cw - pad * 2, wt), (ch * 0.7) / capOf(wt));
    };
    if (k === "word" || k === "num") {
      const px = c.like != null && cells[c.like] ? sizeFor(cells[c.like], txt) : sizeFor(c, txt), cap = capOf(wt) * px;
      const base = c.cut ? h + cap * c.cut : (h + cap) / 2;
      draw(cx, txt, pad, base, px, wt, ink);
    } else if (k === "huge") {
      /* as tall as the cell allows, running off its right edge */
      const px = (h * (c.low ? 0.92 : 0.8)) / capOf(wt);
      draw(cx, txt, c.off != null ? w * c.off : pad, h * (c.low ? 1 + c.low : 0.9), px, wt, ink);
    } else if (k === "giant") {
      const G = GIANT[mode] || { base: 0.5, cap: 0.25 }, gwt = 800;
      const px = (G.cap * H) / capOf(gwt);
      draw(cx, words.m, pad - x, G.base * H - y, px, gwt, ink);
    }
    e.appendChild(cv);
    if (c.note === "sub" && sub) { const n = document.createElement("div"); n.className = "ptn ptn-top"; n.textContent = sub; e.appendChild(n); }
    return e;
  };
  const gridMode = (pt, stacks, title, sub, mode) => {
    const W = stacks[0].clientWidth || pt.clientWidth || innerWidth, H = pt.clientHeight || innerHeight;
    PAL.g = (getComputedStyle(document.documentElement).getPropertyValue("--hl") || "").trim() || "#ECECEC";
    const m = mainOf(title), words = { m, w: wordOf(m) }, year = META.y || "";
    const cells = LAYOUTS[mode], x = X();
    stacks.forEach((s, k) => {
      /* the falling panel (k 0): the poster in negative, the bands in
         negative, the wireframe; the rising one (k 1) the thing itself */
      const neg = k === 0 && mode !== "wire", wire = k === 0 && mode === "wire";
      cells.forEach((c) => s.appendChild(cellOf(c, W, H, neg, wire, words, sub, year, title, (c.y + c.x * 0.35) * 0.42 * x, cells, mode)));
    });
  };

  /* the name down both panels, sized so the whole line fits the panel's
     measure and counted so a whole number of lines fills its height */
  const lay = (pt, base, title, sub, mode) => {
    pt.className = base;
    const stacks = [...pt.querySelectorAll(".ptstack")];
    stacks.forEach((s) => { s.replaceChildren(); s.style.removeProperty("--ptfs"); s.style.removeProperty("--ptlh"); s.classList.remove("pt-nosub"); });
    if (mode) {
      pt.classList.add("ptm", "pt-m-" + mode);
      fillMode(pt, stacks, title, sub, mode);
      pt.classList.add("pt-run");
      void pt.offsetHeight;
      return;
    }
    /* the whole line has to fit, name and category; measured, not trusted */
    const probe = lineEl(title, sub); probe.style.cssText = "position:absolute;visibility:hidden;opacity:1";
    stacks[0].appendChild(probe);
    const lineH = probe.getBoundingClientRect().height || 44;
    const sc = getComputedStyle(stacks[0]);
    const stackW = Math.max(1, (stacks[0].clientWidth || innerWidth) - (parseFloat(sc.paddingLeft) || 0) - (parseFloat(sc.paddingRight) || 0));
    const lineW = probe.scrollWidth, cssSize = parseFloat(getComputedStyle(probe).fontSize) || 20;
    probe.remove();
    let size = cssSize, dropSub = false;
    if (lineW > stackW) { size = cssSize * (stackW / lineW); if (size < MIN) { size = cssSize; dropSub = true; } }
    const setSize = () => stacks.forEach((s) => { s.style.setProperty("--ptfs", size.toFixed(2) + "px"); s.classList.toggle("pt-nosub", dropSub); });
    setSize();
    /* a whole number of lines fills the inset box exactly */
    const gut = parseFloat(sc.paddingTop) || 50;
    const avail = (pt.clientHeight || innerHeight) - gut * 2;
    const N = Math.max(3, Math.round(avail / lineH));
    stacks.forEach((s) => s.style.setProperty("--ptlh", (avail / N).toFixed(2) + "px"));
    for (let i = 0; i < N; i++) stacks.forEach((s) => s.appendChild(lineEl(title, sub, (i * STEP * X()).toFixed(3) + "s")));
    const real = stacks[0].querySelector(".ptl");
    if (real && real.scrollWidth > stackW + 1) {
      const c = size * (stackW / real.scrollWidth);
      if (c >= MIN) size = c; else { size = cssSize; dropSub = true; }
      setSize();
    }
    pt.classList.add("pt-run");
    void pt.offsetHeight; /* the lines' start state, committed before they move */
  };
  async function go(href, title, sub, meta) {
    if (!href || busy) return;
    META = meta || {};
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { location.href = href; return; }
    busy = true; build();
    lay(PT, "pt", title, sub, MODE);
    await beat(PT, "pt-1", PT.querySelector(".ptw")); /* white falls */
    await beat(PT, "pt-2", PT.querySelector(".ptb")); /* black rises over it */
    const s0 = PT.querySelector(".ptstack");
    const note = { t: Date.now(), title: title || "", sub: s0.classList.contains("pt-nosub") ? "" : sub || "",
      n: s0.childElementCount, lh: s0.style.getPropertyValue("--ptlh"), fs: s0.style.getPropertyValue("--ptfs") };
    try { sessionStorage.setItem("pt.arrive", JSON.stringify(note)); } catch (e) { /* a private window */ }
    /* it laps its lines on the compositor while the next page loads */
    PT.classList.add("pt-wait");
    busy = false;
    location.href = href;
  }
  addEventListener("pageshow", (e) => {
    if (!e.persisted || !PT || !PT.classList.contains("pt-2")) return;
    busy = false;
    PT.classList.remove("pt-wait");
    const n = PT.querySelector(".ptstack").childElementCount;
    PT.querySelectorAll(".ptstack").forEach((s) => [...s.children].forEach((l, i) => l.style.setProperty("--d", ((n - 1 - i) * STEP_OUT).toFixed(3) + "s")));
    void PT.offsetHeight;
    PT.classList.add("pt-3");
    setTimeout(() => { PT.className = "pt"; }, ((n - 1) * STEP_OUT + 0.72) * 1000);
  });
  /* in the page, over one column */
  let COL = null, colRun = null, colAt = 0; /* 0 up, 1 falling, 2 black, 3 lifting */
  const retitle = (pt, title, sub) => pt.querySelectorAll(".ptl").forEach((l) => {
    l.firstChild.nodeValue = title || "";
    const t = l.querySelector(".sub"); if (t) t.textContent = "  " + (sub || "");
  });
  const cover = (title, sub, meta) => {
    META = meta || {};
    if (!COL) COL = make("ptc");
    if (colAt === 1 || colAt === 2) {
      if (COL.classList.contains("ptm")) { const st = [...COL.querySelectorAll(".ptstack")]; st.forEach((s) => s.replaceChildren()); fillMode(COL, st, title, sub, MODE || "fill"); }
      else retitle(COL, title, sub);
      return colRun;
    }
    colAt = 1;
    lay(COL, "pt ptc", title, sub, MODE);
    colRun = beat(COL, "pt-1", COL.querySelector(".ptw"))
      .then(() => beat(COL, "pt-2", COL.querySelector(".ptb")))
      .then(() => { colAt = 2; });
    return colRun;
  };
  const lift = () => {
    if (!COL || colAt !== 2) return Promise.resolve();
    colAt = 3;
    const n = COL.querySelector(".ptstack").childElementCount, x = X();
    COL.querySelectorAll(".ptstack").forEach((s) => [...s.children].forEach((l, i) => l.style.setProperty("--d", ((n - 1 - i) * STEP_OUT * x).toFixed(3) + "s")));
    void COL.offsetHeight;
    COL.classList.add("pt-3");
    return new Promise((res) => setTimeout(() => { if (colAt === 3) { COL.className = "pt ptc"; colAt = 0; } res(); }, ((n - 1) * STEP_OUT + 0.72) * 1000 * x));
  };
  /* the lab's switch (/lab/curtain/): which treatment the next cover takes,
     "" the stack */
  const setMode = (m) => { MODE = MODES.includes(m) ? m : ""; };
  window.Curtain = { go, cover, lift, setMode, modes: MODES.slice() };
})();
