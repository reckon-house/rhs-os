/* BURN (31 Oct 2026): the filter and the heat for the band across the top
   of the glass; what it is and why is in burn.css. Lab copy:
   public/lab/toc-explore/live/burn. Starts once the index is built. */
(() => {
  const H = document.documentElement; if (window.__burn) return; window.__burn = 1;
  const ready = () => H.classList.contains("ready") && document.getElementById("idx");
  const start = () => {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg"); svg.setAttribute("width", "0"); svg.setAttribute("height", "0"); svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  /* five copies of the board's melt at rising strength (displacement 4 to
     18); the heat picks one. Changing one filter's scale in place does not
     redraw a backdrop filter in Chromium, a different filter does */
  const STEPS = [4, 8, 12, 15, 18];
  svg.innerHTML = STEPS.map((sc, i) => '<filter id="burnMelt' + i + '" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.015 0.025" numOctaves="3" seed="8" result="noise"/>' +
    '<feGaussianBlur in="noise" stdDeviation="2" result="smoothNoise"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="smoothNoise" scale="' + sc + '" xChannelSelector="R" yChannelSelector="G"/></filter>').join("");
  document.body.appendChild(svg);
  /* the melt's strength follows the heat (the board ran it at 18 even at
     rest; across the whole top that bent the cover's edge and every word
     resting under the bar, so here the band is still until something moves) */
  /* the band over the cover, from the index's edge to the glass's, when no
     shelf or room is open (mod.css hides it while body.staged) */
  const top = document.createElement("div"); top.id = "burnTop"; top.setAttribute("aria-hidden", "true"); document.body.appendChild(top);
  const IDX = document.getElementById("idx");
  const place = () => { const r = IDX.getBoundingClientRect(); top.style.left = Math.round(r.right) + "px"; };
  place(); addEventListener("resize", place);
  if (window.ResizeObserver) new ResizeObserver(place).observe(IDX);
  /* the index's band takes a hairline once the index has moved under it */
  const moved = () => IDX.classList.toggle("burn-moved", IDX.scrollTop > 4);
  IDX.addEventListener("scroll", moved, { passive: true }); moved();
  const wash = new URLSearchParams(location.search).get("burn") === "wash";
  /* the heat: one band, so a scroll on either side (the index, a shelf, a
     room) heats all of it */
  let heat = 0, last = 0;
  const onRight = (t) => t && t.nodeType === 1 && t.closest && t.closest("#idx, .shelf, .roomc");
  document.addEventListener("scroll", (e) => { if (onRight(e.target)) last = Date.now(); }, { capture: true, passive: true });
  addEventListener("wheel", (e) => { if (onRight(e.target)) last = Date.now(); }, { passive: true });
  addEventListener("touchmove", (e) => { if (onRight(e.target)) last = Date.now(); }, { passive: true });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let was = -1;
  const tick = () => {
    requestAnimationFrame(tick);
    if (document.hidden) return;
    if (reduced.matches) heat = 0;
    else {
      const since = Date.now() - last;
      if (since < 500) heat += (1 - heat) * 0.06;
      else if (since < 2500) heat += (0 - heat) * 0.015;
      else heat += (0 - heat) * 0.03;
      if (heat < 0.005) heat = 0;
    }
    /* window.__burnQ pins the heat (0 to 1) for checking a frame by hand */
    const q = window.__burnQ != null ? +window.__burnQ : Math.round(heat * 200) / 200; if (q === was) return; was = q;
    const step = q < 0.02 ? -1 : Math.min(STEPS.length - 1, Math.floor(q * 1.6 * STEPS.length));
    // at rest the bars keep a soft frost (blur 6) so work passing under the logo
    // and the running heads doesn't collide with the words; the strip over the
    // cover stays clear at rest and only shows while the page is moving
    const css = "blur(" + (6 - q * 2).toFixed(2) + "px) saturate(" + (1 + q * 7).toFixed(2) + ") contrast(" + (1 + q * 2).toFixed(2) + ")";
    const f = reduced.matches || step < 0 ? css : "url(#burnMelt" + step + ") " + css;
    H.style.setProperty("--burn-f", f);
    H.style.setProperty("--burn-fw", css);
    H.style.setProperty("--burn-top-f", q < 0.02 ? "none" : f);
    H.style.setProperty("--burn-top-fw", q < 0.02 ? "none" : css);
    H.style.setProperty("--burn-wash", wash ? "rgba(255, 255, 255, " + (0.6 - q * 0.25).toFixed(3) + ")" : "transparent");
    /* the words' paper halo: there at rest, since work under the bar now
       shows through it, and fuller as the heat comes up */
    H.style.setProperty("--burn-halo", "rgba(255, 255, 255, " + (0.85 + q * 0.15).toFixed(3) + ")");
    H.style.setProperty("--burn-halo2", "rgba(255, 255, 255, " + (0.55 + q * 0.3).toFixed(3) + ")");
  };
  requestAnimationFrame(tick);
  };
  if (ready()) start(); else { const t = setInterval(() => { if (ready()) { clearInterval(t); start(); } }, 40); }
})();
