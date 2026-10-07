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
   the type set another way, in the column only (a page left by go()
   keeps the stack, since the page arriving draws that one):

       ?curtain=fill     the name at display size, repeated along every
                         line and staggered line to line, off both edges
       ?curtain=outline  fill, every other line drawn instead of filled
       ?curtain=drift    fill, each line running sideways, alternate
                         lines the other way
       ?curtain=giant    a word a line, as large as five lines allow,
                         lines hugging the left edge and the right in turn
       ?curtain=ramp     the name growing down the column, small to huge

   /lab/curtain/ plays each in a loop, slowed if asked (window.CURTAIN_X
   stretches every beat; 1 is the site's own). */
(() => {
  const STEP = 0.03, STEP_OUT = 0.02, MIN = 14;
  const X = () => window.CURTAIN_X || 1;
  const MODES = ["fill", "outline", "drift", "giant", "ramp"];
  const asked = (new URLSearchParams(location.search).get("curtain") || "").toLowerCase();
  let MODE = MODES.includes(asked) ? asked : "";
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
    } else if (mode === "ramp") {
      for (let i = 0, fs = 13, y = 0; y < H && i < 40; i++, fs *= 1.28) {
        const l = line("", i, step, fs, fs);
        l.textContent = name;
        if (sub) { const t = document.createElement("span"); t.className = "sub"; t.textContent = "  " + sub; l.appendChild(t); }
        out.push(l); y += fs;
      }
    }
    stacks.forEach((s, k) => { s.style.setProperty("--top", top.toFixed(1) + "px"); out.forEach((l) => s.appendChild(k ? l.cloneNode(true) : l)); });
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
  async function go(href, title, sub) {
    if (!href || busy) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { location.href = href; return; }
    busy = true; build();
    lay(PT, "pt", title, sub);
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
  const cover = (title, sub) => {
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
  /* the lab's switch (/lab/curtain/): which treatment the next cover takes */
  const setMode = (m) => { MODE = MODES.includes(m) ? m : ""; };
  window.Curtain = { go, cover, lift, setMode, modes: MODES.slice() };
})();
