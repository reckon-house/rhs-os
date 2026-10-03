/* ── the arrival (3 Oct 2026) ────────────────────────────────────────────
   His "the design overall isnt quite elevated to a rhode or lululemon
   level but we're close". Part of what reads as elevated on those sites
   is that the page moves a little: a block rises and fades in as it
   reaches the glass, a picture breathes under the pointer (push.css,
   "motion"). This is the first half: each section, band and lookbook
   figure gets .arrive, and .in when it comes into view, once. Nothing
   moves for anyone who asked for reduced motion, and a page without
   IntersectionObserver simply shows everything. */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  /* the takeover story is the first screen, so it is never hidden for an
     arrival; its pictures settle instead, each as it comes into view */
  var els = Array.prototype.filter.call(document.querySelectorAll(".wrap > section, body > section, .band, .ll-hero, .ll-band, .lb-grid > figure, .lb-grid > .chapter"), function (el) { return !el.classList.contains("vs"); });
  var tiles = document.querySelectorAll(".vs-t");
  if (tiles.length) {
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); tio.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.04 });
    tiles.forEach(function (t) { tio.observe(t); });
    document.querySelectorAll(".vs").forEach(function (v) { v.classList.add("vs-live"); });
  }
  if (!els.length) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.02 });
  els.forEach(function (el) { el.classList.add("arrive"); io.observe(el); });
})();
