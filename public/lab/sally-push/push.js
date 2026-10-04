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

/* ── depth (3 Oct 2026, his "anyway to add some affects to that scroll?
   parallax or something simple but enough to bring it alive?") ──────────
   As the page scrolls, each photograph on the wall, on a band and in the
   kit moves a little slower than its frame, by up to the 11% it runs past
   the frame (push.css, "depth"; 8% at first, then his "we can do a
   little stronger"), and the words on the wall drift up a
   little faster than theirs, never below where they were set. The
   opening photograph, framed on the glass when the page opens, stays put
   until it scrolls and then lags. Measured and written once a frame, only
   when the page scrolls or resizes, and only for what is near the glass.
   It works when the page is scrolled for it too, as it is inside the
   laptop in the study. */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var R = 0.11, items = [];
  var add = function (sel, kind, k) {
    document.querySelectorAll(sel).forEach(function (el) {
      var frame = /^lift/.test(kind) ? el.closest(".vs-t") : el.parentElement;
      if (frame) items.push({ el: el, frame: frame, kind: kind, k: k });
    });
  };
  add(".vs-t:not(.vs-open) > img", "img", 1);
  add(".ll-band > .ph > img", "img", 1);
  add(".st-kitb > .ph > img", "img", 0.9);
  add(".vs-open > img", "open", 0.2);
  add(".vs-sw .vs-copy", "lift");
  add(".vs-open .vs-copy", "lift-open");
  if (!items.length) return;
  var queued = false;
  var update = function () {
    queued = false;
    var vh = innerHeight;
    /* every frame is measured before anything moves, so the page lays out once */
    var ys = items.map(function (it) {
      var b = it.frame.getBoundingClientRect();
      if (b.bottom < -80 || b.top > vh + 80) return null;
      /* c: where the frame is on its way across the glass, -1 coming in at
         the foot, 0 in the middle, 1 going out at the top. gone: how much
         of a frame that starts on the glass has scrolled off its top */
      var c = Math.max(-1, Math.min(1, ((vh - b.top) / (vh + b.height) - 0.5) * 2));
      var gone = Math.max(0, Math.min(1, -b.top / b.height));
      var lift = Math.min(34, b.height * 0.065);
      if (it.kind === "img") return c * R * b.height * it.k;
      if (it.kind === "open") return gone * b.height * it.k;
      if (it.kind === "lift") return -(c + 1) / 2 * lift;
      return -gone * lift;
    });
    ys.forEach(function (y, i) { if (y !== null) items[i].el.style.translate = "0 " + y.toFixed(1) + "px"; });
  };
  var queue = function () { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  update();
})();
