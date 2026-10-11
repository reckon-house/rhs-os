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

   BANDS WAS THE CURTAIN from 8 to 10 Oct 2026, after his Swiss poster (see
   THE POSTER below): the name in bands of weight and fill, the grey the
   site's own. ?curtain=bands brings it back, ?curtain=ramp brings Ramp.

   CONTENTS, ALL IS THE CURTAIN since 10 Oct 2026 (his "let's push
   'contents, all' as the one we use live!"; see QUIET below): the
   homepage's black card, the study's name where the statement sits, and
   over it a scale of the room, every section's name standing on the tick
   where it starts, the needle lighting each in turn and finishing once the
   room's cover picture is in.

   THREE AS ONE (9 Oct 2026, his "is there a world where bands, outline
   and ramp outline all become one? i like the the scale differences in
   ramp but not the empty spaces it leaves. i like how outline completly
   fills the screen but some size difference might be interesting"). Every
   line runs the name edge to edge as Outline does, so nothing is empty;
   the lines step in size as Ramp does; every other one is drawn once it is
   large enough; the name rises into each line as into a mask:

       ?curtain=merge     Bands' fills under Ramp's sizes, small to huge
       ?curtain=swell     the same, growing to the middle and back
       ?curtain=rhythm    the same, the sizes in an uneven beat, like the
                          poster's
       ?curtain=rampfill  Ramp's sizes edge to edge, no fills
       ?curtain=rampsolid Ramp fill with every line solid, none drawn (his
                          "can we try ramp fill but without the outlines
                          text version?")

   FIVE MORE (9 Oct 2026, his "what are a handful of other graphic/design
   treatments we could do with the transitions?"), switches too:

       ?curtain=specimen  the name on every line at one size, the weight
                          climbing regular to heavy and back
       ?curtain=spine     the name set vertically, column after column,
                          bottom to top like a book's spine
       ?curtain=numeral   the poster's number: the study's year twice, cut
                          off and then whole, the name small below
       ?curtain=grid      the index's own faint cell grid, cells lighting
                          in a cascade, the name across it
       ?curtain=frames    a contact sheet of the study's own pictures, grey
                          as it falls and in colour as the black rises

   /lab/curtain/ plays each in a loop, slowed if asked (window.CURTAIN_X
   stretches every beat; 1 is the site's own). */
(() => {
  const STEP = 0.03, STEP_OUT = 0.02, MIN = 14;
  const X = () => window.CURTAIN_X || 1;
  const MODES = ["ramp", "ramp-demi", "ramp-outline", "fill", "outline", "drift", "giant", "poster", "bands", "wire", "specimen", "spine", "numeral", "grid", "frames", "merge", "swell", "rhythm", "rampfill", "rampsolid", "card", "caption", "year", "paper", "scale", "grille", "list", "listmono", "headline", "sequence", "contents", "contentsall", "pictures"];
  const GRID = ["poster", "bands", "wire", "numeral", "grid", "frames"];
  /* the quiet ones (10 Oct 2026): one card, one beat in, a hold, one out */
  const QUIET = ["card", "caption", "year", "paper", "scale", "grille", "list", "listmono", "headline", "sequence", "contents", "contentsall", "pictures"];
  const HOLD = { card: 0.32, caption: 0.42, year: 0.8, paper: 0.32, scale: 0.7, grille: 0.45 };
  /* a list holds long enough for its last line to land and be glanced */
  const holdOf = (m) => {
    const n = (META.list || []).filter(Boolean).length;
    if ((m === "list" || m === "listmono") && n) return 0.3 + Math.min(10, n) * 0.07;
    /* the headline holds until its last letter is down and read; the
       sequence until its sections have run and the name is down */
    if (m === "headline") return 0.62;
    if (m === "sequence") return n ? SEQ_T0 + n * seqStep(n) + 0.95 - 0.55 : 0.62;
    return HOLD[m] || 0.32;
  };
  /* what a cover built says how long it runs, from the card starting up;
     the card's own rise is 0.55s of it */
  const holdFor = (pt) => (pt && pt._q ? Math.max(0.2, pt._q - 0.55) : holdOf(MODE));
  /* the sequence's beat: a section a step, quicker the more there are, so
     a long room flips by like a departures board and a short one reads */
  const SEQ_T0 = 0.28;
  const seqStep = (n) => Math.min(0.22, Math.max(0.12, 0.9 / Math.max(1, n)));
  let seqRun = 0;
  const wait = (sec) => new Promise((r) => setTimeout(r, sec * 1000));
  /* what a grid treatment knows besides the name: the study's year */
  let META = {};
  /* tracked in as it grows, on the site's own ladder (crossref2.js track()) */
  const track = (px) => (px >= 150 ? -0.06 : px >= 90 ? -0.055 : px >= 54 ? -0.05 : px >= 34 ? -0.042 : px >= 21 ? -0.03 : -0.012);
  const asked = (new URLSearchParams(location.search).get("curtain") || "").toLowerCase();
  /* CONTENTS, ALL IS THE CURTAIN since 10 Oct 2026 (his "let's push
     'contents, all' as the one we use live!"); ?curtain=bands is the
     curtain it replaced */
  let MODE = asked === "stack" ? "" : MODES.includes(asked) ? asked : "contentsall";
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
    } else if (mode === "merge" || mode === "swell" || mode === "rhythm" || mode === "rampfill" || mode === "rampsolid") {
      /* the heights first, as shares of the column, then scaled so they add
         up to it exactly, on whole pixels so no seam shows between bands */
      let parts, fills;
      if (mode === "swell") { parts = [1, 1.5, 2.3, 3.6, 5.2, 3.6, 2.3, 1.5, 1]; fills = ["g", "w", "k", "w", "k", "w", "k", "w", "g"]; }
      else if (mode === "rhythm") { parts = [1.4, 3.4, 1, 5.6, 1.8, 2.8, 1.1, 4.2]; fills = ["g", "w", "g", "k", "w", "g", "k", "w"]; }
      else {
        parts = []; for (let f = 13, sum = 0; sum < H * 0.9 && parts.length < 16; f *= 1.28) { parts.push(f); sum += f; }
        fills = ["g", "w", "k", "w", "g", "k", "w", "k"];
      }
      const plain = mode === "rampfill" || mode === "rampsolid", solid = mode === "rampsolid";
      const tot = parts.reduce((a, b) => a + b, 0), big = Math.max(...parts), banded = !plain;
      /* the banded ones repeat the name Bands repeats, the study's main name
         ("Ivy Park" of "Ivy Park by Beyoncé"); the plain one the whole title,
         as Outline does */
      const nm = banded ? mainOf(name) : name;
      pt.classList.add("pt-mb"); if (plain) pt.classList.add("pt-mbp");
      let acc = 0, at = 0;
      parts.forEach((part, i) => {
        acc += part;
        const next = Math.round((acc / tot) * H), lh = Math.max(1, next - at); at = next;
        /* Bands' weights on the banded ones, heavier as a line grows;
           Ramp's medium on the plain one */
        const fs = lh / 0.86, r = part / big, wt = banded ? (r >= 0.62 ? 800 : r >= 0.32 ? 600 : 500) : 500;
        const l = line(!solid && fs >= 28 && i % 2 ? "o" : "", i, step, fs, lh);
        /* the site's ladder is set for medium; a heavier weight tracks in
           less, or its round letters run together ("pit" in Capitan did) */
        l.style.letterSpacing = (track(fs) * (wt >= 800 ? 0.4 : wt >= 600 ? 0.7 : 1)).toFixed(4) + "em"; l.style.fontWeight = wt;
        l.style.setProperty("--sw", Math.min(2, Math.max(1.2, fs * 0.007)).toFixed(2) + "px");
        if (banded) l.classList.add("bf-" + fills[i % fills.length]);
        const gap = fs * 0.42, P = measure(nm, fs, wt) + gap, reps = Math.ceil(W / Math.max(1, P)) + 2;
        const rn = run(nm, reps);
        rn.style.setProperty("--x", (-((i * 0.382) % 1) * P).toFixed(1) + "px");
        rn.style.setProperty("--gap", gap.toFixed(1) + "px");
        l.appendChild(rn); out.push(l);
      });
      top = 0;
    } else if (mode === "specimen") {
      /* the name fits the column at its heaviest, inside the site's 20px
         margin, and every line sets it in the next weight up, then down */
      const WTS = [400, 500, 600, 700, 800, 700, 600, 500];
      const fs = Math.max(14, ((W - 40) / Math.max(1, measure(name, 100, 800))) * 100), lh = fs * 1.02;
      const N = Math.ceil(H / lh) + 1;
      for (let i = 0; i <= N; i++) {
        const l = line("", i, step, fs, lh);
        l.style.fontWeight = WTS[i % WTS.length]; l.style.letterSpacing = track(fs) + "em"; l.style.paddingLeft = "20px";
        l.textContent = name; out.push(l);
      }
      top = -lh / 2;
    } else if (mode === "spine") {
      /* columns of the name set vertically, each as long as the column and
         a fifth more, so the frame cuts it top and bottom; staggered column
         to column as fill staggers its lines */
      const fs = Math.max(14, ((H * 1.15) / Math.max(1, measure(name, 100, 500))) * 100), colW = fs * 1.1;
      const len = measure(name, fs, 500) + fs * 1.2, cols = Math.ceil(W / colW) + 1;
      for (let i = 0; i < cols; i++) {
        const l = line("", i, step * 1.5, fs, colW);
        l.style.letterSpacing = track(fs) + "em";
        l.style.left = (i * colW - colW * 0.3).toFixed(1) + "px";
        l.style.top = (-((i * 0.382) % 1) * len).toFixed(1) + "px";
        l.style.width = colW.toFixed(1) + "px"; l.style.height = (len * 3).toFixed(1) + "px";
        l.textContent = [name, name, name].join("\u2003\u2003");
        out.push(l);
      }
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
  /* the poster's number, on its own: the study's year cut off, then whole
     across the width, the name and its category below */
  LAYOUTS.numeral = [
    C(0, 0, 1, 0.26, "g", "num", { cut: 0.5 }),
    C(0, 0.26, 1, 0.5, "w", "num"),
    C(0, 0.76, 0.62, 0.24, "k", "notes"), C(0.62, 0.76, 0.38, 0.24, "g", "x"),
  ];
  /* the index's faint cell grid: paper as it falls, black as it rises, two
     cells lit in the site's grey, the name across it in the statement
     style (`o`: a cell with no fill of its own, over the others) */
  LAYOUTS.grid = (W, H) => {
    const cols = W < 700 ? 4 : 6, rows = Math.max(6, Math.round(H / (W / cols))), out = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push(C(c / cols, r / rows, 1 / cols, 1 / rows, (r === 2 && c === 1) || (r === rows - 3 && c === cols - 2) ? "g" : "k"));
    out.push(C(0, 0.36, 1, 0.28, "k", "word", { o: true, t: "m", wt: 500 }));
    return out;
  };
  /* a contact sheet of the study's pictures, the name on a band across it;
     with no pictures (leaving the page) the cells are the poster's fills */
  LAYOUTS.frames = (W, H, M) => {
    const pics = (M && M.pics) || [], cols = W < 700 ? 3 : 4, rows = Math.max(4, Math.round(H / (W / cols) * 1.1)), out = [];
    let i = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++, i++) out.push(pics.length ? C(c / cols, r / rows, 1 / cols, 1 / rows, "k", "pic", { src: pics[i % pics.length] }) : C(c / cols, r / rows, 1 / cols, 1 / rows, ["w", "g", "k"][(r + c) % 3]));
    out.push(C(0, 0.4, 1, 0.2, "w", "word", { t: "m", wt: 500 }));
    return out;
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
    if (c.o) e.classList.add("ptg-over"); else e.style.background = PAL[fk];
    e.style.setProperty("--ink", ink);
    let k = c.k;
    if (k === "pic") { const im = document.createElement("img"); im.className = "ptwd ptpic"; im.alt = ""; im.decoding = "async"; im.src = c.src; e.appendChild(im); return e; }
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
    const L = LAYOUTS[mode], cells = typeof L === "function" ? L(W, H, META) : L, x = X();
    stacks.forEach((s, k) => {
      /* the falling panel (k 0): the poster in negative, the bands in
         negative, the wireframe; the rising one (k 1) the thing itself */
      const neg = k === 0 && mode !== "wire", wire = k === 0 && mode === "wire";
      cells.forEach((c) => s.appendChild(cellOf(c, W, H, neg, wire, words, sub, year, title, (c.y + c.x * 0.35) * 0.42 * x, cells, mode)));
    });
  };

  /* ── QUIET (10 Oct 2026). His "i feel like i am trying too hard here -
     it's lost some of the sophistication - the left side of the site is
     dense - maybe there's something interesting on the transition that
     contrasts with the the TOC? do we play off the homepage right side?
     maybe we look at some other more dialed back sophisticated options?"
     The open half's own card, copied from #field rather than re-derived:
     20px in from the top, right and foot, flush left, a 4px corner, rising
     from its foot in 0.55s on the site's ease. On it one thing, set where
     and as the statement is set (32px in, 20px up; crossref2's V.rest
     size, 4.8% of the column between 24 and 40, medium, tracked -0.045em;
     the small line at 11px demi in 46% white), rising 10px as the
     statement does. The room says what the study is a moment later, so
     only its name, line and year are said here:

       ?curtain=card     the study's name in the statement's place and type,
                         its line and year as the small line over it
       ?curtain=caption  the hover caption's size (13px demi, the rest in
                         grey) alone at the foot, a hairline drawn over it
       ?curtain=year     the year counted back from this one through a mask,
                         four times the statement's size, the name and line
                         small over it
       ?curtain=paper    the card in paper, the name in ink

     Then his "some sort of dieter rams look and feel might be cool": the
     card as a Braun face, in the index's own grey with one signal colour
     (--sig), each showing something true about the study:

       ?curtain=scale    a radio's tuning scale of the index's years, 2008
                         to now; the needle starts at now and glides back
                         to the study's year
       ?curtain=grille   a speaker grille's field of dots fills the face
                         from the top, and a small lamp comes on by the
                         name when it is done

     Then his "maybe it's a hit list of what what's in the case study -
     something simple?", with Rams' "10 Principles of Good Design" posters
     (a numbered list set large at the head of a white sheet, a small
     colophon turned up the foot). The list is the room's own section
     labels in the room's order, read off the room before it is shown
     (crossref2 passes META.list), so it says only what the room says:

       ?curtain=list      the sections numbered at the statement's size, the
                          numbers grey; the name, line and year turned up
                          the foot
       ?curtain=listmono  the same in a mono, numbers in ink, as the poster
                          sets it

     Then his "maybe it's a few words that have a really slick animation
     that a user has to watch before it loads...that last screen could be
     that - black flood and a headlien animation that's done really well",
     after a black post with "MOST NEVER DO." set small and level in the
     middle, the one word bold, its corners carrying small grey labels:

       ?curtain=headline  the black card, the study's name in capitals at
                          the statement's size, its own name bold and the
                          rest light ("IVY PARK" bold, "BY BEYONCÉ" light),
                          each letter rising through its word's mask in
                          turn; its line and year in the top corners
       ?curtain=sequence  the room's sections flip through the headline's
                          place first, light, with a count in the corner,
                          and it lands on the name

     Then his "i like card as a base. caption - the animated line makes me
     think it could be a loader...scale makes me think the loader could be
     something along these lines but i dont think highlighting a year is
     really all that interesting. is there something else where it's the
     card design with the scale as a loader maybe somehow showing what a
     user might see or something important?" Card, with a loader over its
     small line that shows what the room holds, and an honest one: it does
     not finish until the room's cover picture is in (crossref2 passes
     META.ready, capped at 2.2s; META.at places each section where it
     starts down the room's own length):

       ?curtain=contents     a scale of the room: a long tick where each
                             section starts, the needle stepping from one
                             to the next and reading out its name
       ?curtain=contentsall  the same with every section's name standing
                             on its tick, each lighting as the needle comes
       ?curtain=pictures     the room's pictures in a strip over the line,
                             each coming up from grey as the line reaches it,
                             the last when the room is ready

     Out, the words go first and the card lifts off the room ── */
  const quietMode = (pt, stacks, title, sub, mode) => {
    const W = pt.clientWidth || innerWidth;
    const mx = Math.min(40, Math.max(24, W * 0.048));
    const name = String(title || "").trim(), y = parseInt(META.y, 10) || 0, now = new Date().getFullYear();
    const E = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
    const q = E("div", "pq pq-" + mode), X1 = X();
    pt._q = 0; pt._wait = null; pt.style.setProperty("--x", String(X1));
    q.style.setProperty("--mx", mx.toFixed(2) + "px");
    const L = (META.list || []).filter(Boolean).slice(0, 12);
    /* a line of capitals, each letter in its word's mask, the study's own
       name bold and what follows it light */
    const headline = (t0) => {
      const main = mainOf(name), rest = name.slice(main.length);
      const hl = E("div", "pq-hl"); let i = 0;
      const words = (txt, cls) => txt.split(/(\s+)/).forEach((w) => {
        if (!w) return;
        if (/^\s+$/.test(w)) { hl.appendChild(document.createTextNode(" ")); return; }
        const m = E("span", "pq-w" + (cls ? " " + cls : ""));
        for (const ch of w) { const c = E("span", "pq-ch", ch); c.style.setProperty("--i", String(i++)); m.appendChild(c); }
        hl.appendChild(m);
      });
      words(main, "pq-b"); if (rest) words(rest, "");
      hl.style.setProperty("--t0", (t0 * X1).toFixed(3) + "s");
      hl.style.setProperty("--n", String(i));
      /* a letter every 24ms, the whole name in no more than 0.42s, so a long
         name sets as quickly as a short one */
      hl._cs = Math.min(0.024, 0.42 / Math.max(1, i));
      hl.style.setProperty("--cs", (hl._cs * 1000).toFixed(1) + "ms");
      return hl;
    };
    /* the loaders: a beat to draw, a sweep, a wait for the room, a finish */
    const loader = (draw, done, tEnd) => {
      const run = ++seqRun, at = (sec, fn) => setTimeout(() => { if (run === seqRun) fn(); }, sec * 1000 * X1);
      draw(at);
      pt._wait = () => {
        const rdy = META.ready && typeof META.ready.then === "function" ? Promise.race([META.ready, wait(2.2 * X1)]) : Promise.resolve();
        return Promise.all([wait(Math.max(0.05, tEnd - 0.55) * X1), rdy]).then(() => { if (run === seqRun) done(); return wait(0.3 * X1); });
      };
    };
    const nameplate = () => {
      const by = E("div", "pq-by"); if (sub) by.appendChild(E("span", "", sub)); if (y) by.appendChild(E("span", "", String(y)));
      if (by.childNodes.length) q.appendChild(by);
      q.appendChild(E("div", "pq-say", name));
    };
    const iw = Math.max(1, W - 64);
    if ((mode === "contents" || mode === "contentsall") && L.length) {
      const all = mode === "contentsall", n = L.length;
      const A0 = Array.isArray(META.at) && META.at.length === n && META.at.every((v, i, a) => v >= 0 && v < 1 && (!i || v >= a[i - 1])) ? META.at : null;
      const A = A0 || L.map((_, i) => i / n);
      const sc = E("div", "pq-tuner pq-cont" + (all ? " pq-all" : ""));
      sc.style.setProperty("--iw", iw + "px"); sc.style.setProperty("--p", "0");
      sc.appendChild(E("i", "pq-base")); sc.appendChild(E("i", "pq-prog"));
      const tk = E("div", "pq-ticks"), MINOR = 64;
      for (let j = 0; j <= MINOR; j++) {
        const t = E("i", "pq-tk"); t.style.left = ((j / MINOR) * 100).toFixed(3) + "%";
        t.style.setProperty("--d", ((0.1 + (j / MINOR) * 0.4) * X1).toFixed(3) + "s"); tk.appendChild(t);
      }
      const majors = A.map((a) => {
        const t = E("i", "pq-tk pq-tk-y pq-mk"); t.style.left = (a * 100).toFixed(3) + "%";
        t.style.setProperty("--d", ((0.1 + a * 0.4) * X1).toFixed(3) + "s"); tk.appendChild(t); return t;
      });
      let labs = [], tall = 0;
      if (all) {
        labs = A.map((a, i) => { const l = E("span", "pq-vl", L[i]); l.style.left = (a * 100).toFixed(3) + "%"; tk.appendChild(l); tall = Math.max(tall, measure(L[i], 11, 600)); return l; });
        sc.style.paddingTop = Math.ceil(tall + 14) + "px";
      }
      sc.appendChild(tk);
      const nd = E("div", "pq-needle"), rl = E("span", "pq-rl", ""); if (!all) nd.appendChild(rl); sc.appendChild(nd);
      q.appendChild(sc); nameplate();
      const T0 = 0.42, per = Math.min(0.26, Math.max(0.14, 0.9 / n)), tEnd = T0 + n * per + 0.3;
      const setP = (v, dur, ease) => { sc.style.setProperty("--sd", (dur * X1).toFixed(3) + "s"); sc.style.setProperty("--se", ease); sc.style.setProperty("--p", v.toFixed(4)); };
      loader((at) => {
        A.forEach((a, i) => {
          at(T0 + i * per, () => setP(a, per * 0.9, "cubic-bezier(0.45, 0, 0.2, 1)"));
          at(T0 + i * per + per * 0.72, () => {
            majors[i].classList.add("on"); if (labs[i]) labs[i].classList.add("on");
            rl.textContent = L[i]; nd.classList.toggle("pq-r", a > 0.62);
          });
        });
        /* past the last section it creeps on toward the end and waits */
        const last = A[n - 1];
        at(T0 + n * per, () => setP(last < 0.9 ? 0.9 : (last + 1) / 2, 0.9, "cubic-bezier(0.2, 0.7, 0.2, 1)"));
      }, () => setP(1, 0.26, "cubic-bezier(0.45, 0, 0.2, 1)"), tEnd);
    } else if (mode === "pictures" && (META.pics || []).length >= 3) {
      const ps = META.pics.slice(0, 8), N = ps.length, T0 = 0.4, SW = 1.0, END = 0.92;
      const fw = E("div", "pq-film");
      const strip = E("div", "pq-frames");
      const frames = ps.map((src, i) => {
        const f = E("div", "pq-fr"), im = E("img"); im.alt = ""; im.decoding = "async"; im.src = src; f.appendChild(im);
        const c = (i + 0.5) / N;
        if (c <= END) f.style.setProperty("--d", ((T0 + (c / END) * SW) * X1).toFixed(3) + "s"); else f.classList.add("pq-late");
        strip.appendChild(f); return f;
      });
      fw.appendChild(strip); fw.appendChild(E("i", "pq-base")); fw.appendChild(E("i", "pq-prog"));
      fw.style.setProperty("--t0", (T0 * X1).toFixed(3) + "s"); fw.style.setProperty("--sw", (SW * X1).toFixed(3) + "s");
      q.appendChild(fw); nameplate();
      loader(() => {}, () => q.classList.add("pq-done"), T0 + SW + 0.1);
    } else if (mode === "headline" || mode === "sequence") {
      const tl = E("div", "pq-corner pq-tl", sub || ""), tr = E("div", "pq-corner pq-tr", y ? String(y) : "");
      q.appendChild(tl); q.appendChild(tr);
      const seq = mode === "sequence" && L.length;
      if (seq) {
        const n = L.length, st = seqStep(n), box = E("div", "pq-seq"), strip = E("div", "pq-sstrip");
        L.forEach((t) => strip.appendChild(E("div", "pq-sl", t)));
        strip.style.setProperty("--st", (st * X1).toFixed(3) + "s");
        box.appendChild(strip); q.appendChild(box);
        const ct = E("div", "pq-corner pq-bl"); q.appendChild(ct);
        const hl = headline(0); q.appendChild(hl);
        /* the steps run on timers from the moment the card starts up; a
           later cover starts its own run and this one stops */
        const run = ++seqRun, two = (v) => (v < 10 ? "0" : "") + v;
        const at = (sec, fn) => setTimeout(() => { if (run === seqRun) fn(); }, sec * 1000 * X1);
        for (let k = 0; k <= n; k++) at(SEQ_T0 + k * st, () => {
          strip.style.setProperty("--k", String(k));
          if (k < n) ct.textContent = two(k + 1) + "/" + two(n);
          else { q.classList.add("pq-go"); ct.classList.add("pq-off"); }
        });
        /* the sections, then the name's letters down (each 24ms after the
           last, settled about 0.55s after it starts), then a moment to read */
        pt._q = SEQ_T0 + n * st + hl.style.getPropertyValue("--n") * hl._cs + 0.55 + 0.45;
      } else { const hl = headline(0.26); q.appendChild(hl); pt._q = 0.26 + hl.style.getPropertyValue("--n") * hl._cs + 0.55 + 0.5; }
    } else if ((mode === "list" || mode === "listmono") && L.length) {
      pt._q = 0.16 + (L.length - 1) * 0.07 + 0.45 + 0.5;
      const ol = E("ol", "pq-ol");
      L.forEach((t, i) => {
        const li = E("li"); li.style.setProperty("--d", ((0.16 + i * 0.07) * X1).toFixed(3) + "s");
        li.appendChild(E("span", "pq-n", String(i + 1))); li.appendChild(E("span", "pq-lt", t)); ol.appendChild(li);
      });
      const col = E("div", "pq-colo"); col.style.setProperty("--d", ((0.2 + L.length * 0.07) * X1).toFixed(3) + "s");
      [name, sub, y ? String(y) : ""].filter(Boolean).forEach((t) => col.appendChild(E("span", "", t)));
      q.appendChild(ol); q.appendChild(col);
    } else if (mode === "caption") {
      q.appendChild(E("div", "pq-rule"));
      const c = E("div", "pq-cap"); c.appendChild(E("span", "pq-t", name));
      if (y) c.appendChild(E("span", "pq-g", String(y)));
      if (sub) c.appendChild(E("span", "pq-g", sub));
      q.appendChild(c);
    } else if (mode === "year" && y) {
      const by = E("div", "pq-by"); by.appendChild(E("span", "pq-t", name)); if (sub) by.appendChild(E("span", "", sub)); q.appendChild(by);
      const big = Math.round(mx * 4), from = Math.max(y, now), n = from - y + 1;
      const yr = E("div", "pq-yr"); yr.style.fontSize = big + "px"; yr.style.letterSpacing = track(big) + "em";
      const strip = E("div", "pq-strip");
      for (let v = from; v >= y; v--) strip.appendChild(E("div", "", String(v)));
      /* the strip climbs until its last year, the study's, fills the mask */
      strip.style.setProperty("--roll", ((-(n - 1) / n) * 100).toFixed(4) + "%");
      yr.appendChild(strip); q.appendChild(yr);
    } else {
      if (mode === "scale" && y) {
        /* the index's years, a long tick each and three short between,
           labelled every other year; the needle carries the study's */
        const y0 = Math.min(y, 2008), y1 = Math.max(y, now), span = Math.max(1, y1 - y0), iw = Math.max(1, W - 64);
        const at = (v) => (((v - y0) / span) * 100).toFixed(3) + "%";
        const sc = E("div", "pq-tuner"), tk = E("div", "pq-ticks");
        sc.appendChild(E("i", "pq-base"));
        for (let v = y0; v <= y1; v++) {
          for (let k = 0; k < (v < y1 ? 4 : 1); k++) {
            const t = E("i", k ? "pq-tk" : "pq-tk pq-tk-y");
            t.style.left = at(v + k / 4);
            t.style.setProperty("--d", ((0.12 + ((v + k / 4 - y0) / span) * 0.42) * X1).toFixed(3) + "s");
            tk.appendChild(t);
          }
          if ((v - y0) % 2 === 0 || v === y1) { const l = E("span", "pq-yl", String(v)); l.style.left = at(v); tk.appendChild(l); }
        }
        sc.appendChild(tk);
        const nd = E("div", "pq-needle"); nd.style.left = at(y);
        nd.style.setProperty("--from", (((y1 - y) / span) * iw).toFixed(1) + "px");
        nd.appendChild(E("span", "", String(y)));
        sc.appendChild(nd); q.appendChild(sc);
      }
      const by = E("div", "pq-by"); if (sub) by.appendChild(E("span", "", sub)); if (y && mode !== "scale") by.appendChild(E("span", "", String(y)));
      if (by.childNodes.length) q.appendChild(by);
      q.appendChild(E("div", "pq-say", name));
      if (mode === "grille") q.appendChild(E("i", "pq-led"));
    }
    stacks.forEach((s) => s.replaceChildren());
    const host = stacks[stacks.length - 1];
    host.appendChild(q);
    if (mode === "grille") {
      /* the grille fills the face down to the name, with the air the
         statement keeps over its small line */
      const g = E("div", "pq-holes");
      g.style.bottom = (20 + q.offsetHeight + 48) + "px";
      host.insertBefore(g, q);
    }
  };

  /* the name down both panels, sized so the whole line fits the panel's
     measure and counted so a whole number of lines fills its height */
  const lay = (pt, base, title, sub, mode) => {
    pt.className = base;
    const stacks = [...pt.querySelectorAll(".ptstack")];
    stacks.forEach((s) => { s.replaceChildren(); s.style.removeProperty("--ptfs"); s.style.removeProperty("--ptlh"); s.classList.remove("pt-nosub"); });
    if (QUIET.includes(mode)) {
      pt.classList.add("ptq", "pt-q-" + mode);
      quietMode(pt, stacks, title, sub, mode);
      pt.classList.add("pt-run");
      void pt.offsetHeight;
      return;
    }
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
    if (QUIET.includes(MODE)) { await beat(PT, "pt-1", PT.querySelector(".ptb")); PT.classList.add("pt-2"); await (PT._wait ? PT._wait() : wait(holdFor(PT) * X())); }
    else {
      await beat(PT, "pt-1", PT.querySelector(".ptw")); /* white falls */
      await beat(PT, "pt-2", PT.querySelector(".ptb")); /* black rises over it */
    }
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
      if (COL.classList.contains("ptq")) quietMode(COL, [...COL.querySelectorAll(".ptstack")], title, sub, MODE);
      else if (COL.classList.contains("ptm")) { const st = [...COL.querySelectorAll(".ptstack")]; st.forEach((s) => s.replaceChildren()); fillMode(COL, st, title, sub, MODE || "fill"); }
      else retitle(COL, title, sub);
      return colRun;
    }
    colAt = 1;
    lay(COL, "pt ptc", title, sub, MODE);
    if (QUIET.includes(MODE)) {
      colRun = beat(COL, "pt-1", COL.querySelector(".ptb"))
        .then(() => { COL.classList.add("pt-2"); return COL._wait ? COL._wait() : wait(holdFor(COL) * X()); })
        .then(() => { colAt = 2; });
      return colRun;
    }
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
    /* the quiet ones lift on their own clock: words out, then the card */
    const out = COL.classList.contains("ptq") ? 0.86 : (n - 1) * STEP_OUT + 0.72;
    return new Promise((res) => setTimeout(() => { if (colAt === 3) { COL.className = "pt ptc"; colAt = 0; } res(); }, out * 1000 * x));
  };
  /* the lab's switch (/lab/curtain/): which treatment the next cover takes,
     "" the stack */
  const setMode = (m) => { MODE = MODES.includes(m) ? m : ""; };
  window.Curtain = { go, cover, lift, setMode, modes: MODES.slice() };
})();
