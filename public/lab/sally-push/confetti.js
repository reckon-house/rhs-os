/* ── confetti (3 Oct 2026) ───────────────────────────────────────────────
   His "on the colorfest hero ... instead of a single color fill can we
   fill it with 'confetti'? densely filled with different sized colored
   circles - you can pick almost a rainbow of 'sally' colors from the
   images. then the type can lay on top of the confetti".

   Any element with data-confetti gets a canvas behind its content, packed
   with circles: a few large, more medium, many small, never touching,
   placed largest first so the field reads dense. The colours are sampled
   from his photographs (the violet and blue curls, the teal cat-eye
   nails, the cherry top, the orange nails, the yellow nail tips, the wave
   styler's pink, the lavender nails, the sky, the red lip) plus Sally
   scarlet: a rainbow, red through violet. The
   layout is seeded, so the same card always gets the same confetti, and
   it repacks when the card changes size. On arrival the circles pop in,
   largest first; nothing moves for anyone who asked for reduced motion. */
(function () {
  var PALETTE = [
    ["#583C8F", 5], /* violet curls (purple-nails-port) */
    ["#0D4590", 4], /* blue curls (vivids-port) */
    ["#20ADA8", 4], /* teal cat-eye nails (wm2) */
    ["#B9132B", 3], /* cherry top (cherry-nails-port) */
    ["#E11324", 3], /* Sally scarlet */
    ["#F86029", 3], /* orange nails (blonde-port) */
    ["#DFC97A", 3], /* yellow nail tips and gold shadow (purple-nails-port) */
    ["#E090C1", 3], /* the wave styler's pink (chiwaver-land) */
    ["#8A67BB", 3], /* lavender nails (backtoschool-port) */
    ["#8CD7ED", 2], /* sky (backtoschool-port) */
    ["#982D38", 1], /* red lip (copper-port), for depth */
  ];
  var BAG = [];
  PALETTE.forEach(function (p) { for (var i = 0; i < p[1]; i++) BAG.push(p[0]); });
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rng(seed) { var a = seed | 0; return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  /* pack circles into w by h: sizes scale with the card, largest first */
  function pack(w, h, seed) {
    var R = rng(seed), k = Math.max(0.55, Math.min(1.6, w / 640)), gap = 3 * k;
    var tiers = [[34, 58, 14], [18, 32, 70], [9, 17, 260], [4, 8.5, 900]]; /* [min r, max r, tries per 100k px] */
    var area = w * h, cell = 64 * k, cols = Math.ceil(w / cell) + 1, grid = {}, out = [];
    function near(x, y, r) {
      var c0 = Math.floor((x - r - 60 * k) / cell), c1 = Math.floor((x + r + 60 * k) / cell), r0 = Math.floor((y - r - 60 * k) / cell), r1 = Math.floor((y + r + 60 * k) / cell);
      for (var cy = r0; cy <= r1; cy++) for (var cx = c0; cx <= c1; cx++) {
        var list = grid[cy * cols + cx]; if (!list) continue;
        for (var i = 0; i < list.length; i++) { var q = list[i], dx = q.x - x, dy = q.y - y, m = q.r + r + gap; if (dx * dx + dy * dy < m * m) return true; }
      }
      return false;
    }
    tiers.forEach(function (t) {
      var tries = Math.round(t[2] * area / 100000) * 6;
      for (var n = 0; n < tries; n++) {
        var r = (t[0] + R() * (t[1] - t[0])) * k, x = -r * 0.4 + R() * (w + r * 0.8), y = -r * 0.4 + R() * (h + r * 0.8);
        if (near(x, y, r)) continue;
        var c = { x: x, y: y, r: r, color: BAG[Math.floor(R() * BAG.length)], d: out.length };
        out.push(c);
        var key = Math.floor(y / cell) * cols + Math.floor(x / cell); (grid[key] || (grid[key] = [])).push(c);
      }
    });
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
        var c = dots[i], at = Math.min(900, c.d * 1.1), p = Math.max(0, Math.min(1, (t - at) / 420));
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
