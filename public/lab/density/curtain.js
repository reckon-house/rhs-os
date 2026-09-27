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
   page restored is the one left at full black, so it lifts itself. */
(() => {
  const STEP = 0.03, STEP_OUT = 0.02, MIN = 14;
  let PT = null, busy = false;
  const build = () => {
    if (PT) return PT;
    PT = document.createElement("div"); PT.className = "pt"; PT.id = "pt"; PT.setAttribute("aria-hidden", "true");
    PT.innerHTML = '<div class="ptw"><div class="ptstack"></div></div><div class="ptb"><div class="ptstack"></div></div>';
    document.body.appendChild(PT);
    return PT;
  };
  /* a beat ends on its panel's own transition; the lines' ends bubble up
     and would cut it short. A floor in case the transition never fires */
  const beat = (cls, el) => new Promise((res) => {
    let done = false;
    const end = (e) => { if (done || (e && e.target !== el)) return; done = true; el.removeEventListener("transitionend", end); res(); };
    el.addEventListener("transitionend", end);
    PT.classList.add(cls);
    setTimeout(end, 1400);
  });
  const lineEl = (title, sub, d) => {
    const l = document.createElement("span"); l.className = "ptl";
    if (d != null) l.style.setProperty("--d", d);
    l.textContent = title || "";
    if (sub) { const t = document.createElement("span"); t.className = "sub"; t.textContent = "  " + sub; l.appendChild(t); }
    return l;
  };
  async function go(href, title, sub) {
    if (!href || busy) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { location.href = href; return; }
    busy = true; build();
    PT.className = "pt";
    const stacks = [...PT.querySelectorAll(".ptstack")];
    stacks.forEach((s) => { s.replaceChildren(); s.style.removeProperty("--ptfs"); s.style.removeProperty("--ptlh"); s.classList.remove("pt-nosub"); });
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
    const avail = innerHeight - gut * 2;
    const N = Math.max(3, Math.round(avail / lineH));
    stacks.forEach((s) => s.style.setProperty("--ptlh", (avail / N).toFixed(2) + "px"));
    for (let i = 0; i < N; i++) stacks.forEach((s) => s.appendChild(lineEl(title, sub, (i * STEP).toFixed(3) + "s")));
    const real = stacks[0].querySelector(".ptl");
    if (real && real.scrollWidth > stackW + 1) {
      const c = size * (stackW / real.scrollWidth);
      if (c >= MIN) size = c; else { size = cssSize; dropSub = true; }
      setSize();
    }
    PT.classList.add("pt-run");
    void PT.offsetHeight; /* the lines' start state, committed before they move */
    await beat("pt-1", PT.querySelector(".ptw")); /* white falls */
    await beat("pt-2", PT.querySelector(".ptb")); /* black rises over it */
    const s0 = stacks[0];
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
  window.Curtain = { go };
})();
