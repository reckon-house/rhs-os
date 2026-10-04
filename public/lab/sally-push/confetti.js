/* ── confetti (3 Oct 2026) ───────────────────────────────────────────────
   His "on the colorfest hero ... instead of a single color fill can we
   fill it with 'confetti'? densely filled with different sized colored
   circles - you can pick almost a rainbow of 'sally' colors from the
   images. then the type can lay on top of the confetti".

   Any element with data-confetti gets a canvas behind its content, filled
   with circles that overlap in layers: big ones, medium ones over them,
   small ones over those. The colours are sampled from the photograph
   beside the card (PALETTE). The layout is seeded, so the same card always
   gets the same confetti, and it repacks when the card changes size. On
   arrival the circles pop in, the big layer first; nothing moves for
   anyone who asked for reduced motion. */
(function () {
  /* all from her photograph (purple-nails-port), his "let's try sampling
     from just her photo color wise so it's a little more cohesive": the
     violets and the denim lead, so white type holds on the field; the
     copper, rose, pink tile and gold of her eyes and nails are the lights */
  var PALETTE = [
    ["#311F48", 3], /* the violet's shadow */
    ["#5A3E98", 6], /* violet curls */
    ["#634BBC", 4], /* the curls' blue-violet highlight */
    ["#245893", 4], /* denim */
    ["#6671AC", 3], /* the denim's light, periwinkle */
    ["#9E757E", 3], /* rose, her lips */
    ["#CD956C", 3], /* copper curls */
    ["#B87E58", 2], /* caramel, the curls' shade */
    ["#D1AFA7", 2], /* the pink tile */
    ["#EDD1C9", 1], /* the tile's light */
    ["#DEC674", 3], /* gold, her eyeshadow and nail tips */
    ["#EADB97", 1], /* the yellow of her nail tips */
  ];
  var BAG = [];
  PALETTE.forEach(function (p) { for (var i = 0; i < p[1]; i++) BAG.push(p[0]); });
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rng(seed) { var a = seed | 0; return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  /* layers on layers (3 Oct 2026, his "the confetti can overlap - it
     should be layers on layers on layers!"): a big layer laid on a
     jittered grid so nothing shows through, then medium circles over it,
     then small ones over those, each layer in random order and colour, so
     circles sit on and inside each other. Sizes scale with the card */
  function pack(w, h, seed) {
    var R = rng(seed), k = Math.max(0.55, Math.min(1.6, Math.sqrt(w * h) / 700)), out = [];
    var pick = function () { return BAG[Math.floor(R() * BAG.length)]; };
    function grid(rmin, rmax) {
      var step = (rmin + rmax) / 2 * k * 1.3, cols = Math.ceil(w / step) + 2, rows = Math.ceil(h / step) + 2, pts = [];
      for (var y = -1; y < rows; y++) for (var x = -1; x < cols; x++) pts.push([x * step + (R() - 0.5) * step * 0.9, y * step + (R() - 0.5) * step * 0.9]);
      for (var i = pts.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)), t = pts[i]; pts[i] = pts[j]; pts[j] = t; }
      pts.forEach(function (p) { out.push({ x: p[0], y: p[1], r: (rmin + R() * (rmax - rmin)) * k, color: pick() }); });
    }
    function scatter(rmin, rmax, cover) {
      var ra = (rmin + rmax) / 2 * k, n = Math.round(cover * w * h / (Math.PI * ra * ra));
      for (var c = 0; c < n; c++) out.push({ x: R() * w, y: R() * h, r: (rmin + R() * (rmax - rmin)) * k, color: pick() });
    }
    grid(62, 128);        /* the ground: big circles, no gaps */
    scatter(26, 58, 0.9);  /* medium, over them */
    scatter(10, 22, 0.26); /* small, over those, fewer, as his reference has them */
    out.forEach(function (c, i) { c.d = i / out.length; });
    return out;
  }

  function mount(el) {
    var cv = document.createElement("canvas"); cv.className = "confetti"; cv.setAttribute("aria-hidden", "true");
    el.insertBefore(cv, el.firstChild);
    var seed = parseInt(el.getAttribute("data-confetti"), 10) || 7, dots = [], born = 0, raf = 0, lastW = 0, lastH = 0;
    function draw(now) {
      var dpr = Math.min(2, window.devicePixelRatio || 1), w = el.clientWidth, h = el.clientHeight, g = cv.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      var t = reduce ? 1e9 : now - born, done = true;
      for (var i = 0; i < dots.length; i++) {
        var c = dots[i], at = c.d * 1100, p = Math.max(0, Math.min(1, (t - at) / 380));
        if (p < 1) done = false; if (p <= 0) continue;
        var e = 1 - Math.pow(1 - p, 3), s = e + Math.sin(e * Math.PI) * 0.12; /* a small overshoot, like a pop */
        g.beginPath(); g.arc(c.x, c.y, Math.max(0, c.r * s), 0, Math.PI * 2); g.fillStyle = c.color; g.fill();
      }
      if (!done) raf = requestAnimationFrame(draw);
    }
    function layout(animate) {
      var w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
      if (Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 2 && dots.length) return;
      lastW = w; lastH = h;
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); cv.style.width = w + "px"; cv.style.height = h + "px";
      dots = pack(w, h, seed);
      cancelAnimationFrame(raf); born = animate ? performance.now() : -1e9; raf = requestAnimationFrame(draw);
    }
    layout(true);
    var tm = 0;
    if ("ResizeObserver" in window) new ResizeObserver(function () { clearTimeout(tm); tm = setTimeout(function () { layout(false); }, 80); }).observe(el);
    else addEventListener("resize", function () { layout(false); });
  }
  function start() { document.querySelectorAll("[data-confetti]").forEach(mount); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
