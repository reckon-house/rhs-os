/* ── device (3 Oct 2026) ─────────────────────────────────────────────────
   A live page laid onto the screen of a photographed device, and scrolled
   the way a person reads it. Made for his laptop mockup (his "is it
   possible to show the site scrolling in an image like this?"), shared
   once the phone came (his "we'll do the same thing - add a mockup to it
   via code"), so the two cannot drift apart.

   Device.place(o) maps the element holding the page's viewport (o.glass,
   o.view[0] by o.view[1] px) onto the photograph's screen. The screen's
   four corners were measured off the photograph (o.corners, TL TR BR BL,
   in photo px at o.photoW wide); the perspective transform between the
   two is solved and written as a matrix3d, so the page sits in the glass
   exactly at any size. Marks drawn back over the screen (a notch, an
   island: o.marks, in photo px) scale with the photograph.

   Device.scroll(o) scrolls the page in o.frame stop by stop: o.plan(win,
   doc) returns the steps, each a scroll position with how long to move
   there and hold. Its clock stands still while the room pauses the module
   (data-paused on the root), while the tab is hidden, and for anyone who
   asked for less motion. */
(function () {
  var solve = function (A, b) {
    var n = b.length, i, r, c, p, f, t, x = [];
    for (i = 0; i < n; i++) {
      p = i;
      for (r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
      t = A[i]; A[i] = A[p]; A[p] = t; t = b[i]; b[i] = b[p]; b[p] = t;
      for (r = i + 1; r < n; r++) { f = A[r][i] / A[i][i]; for (c = i; c < n; c++) A[r][c] -= f * A[i][c]; b[r] -= f * b[i]; }
    }
    for (i = n - 1; i >= 0; i--) { t = b[i]; for (c = i + 1; c < n; c++) t -= A[i][c] * x[c]; x[i] = t / A[i][i]; }
    return x;
  };
  /* the homography that takes the four src points onto the four dst
     points, as the column-major matrix3d CSS wants */
  var homography = function (src, dst) {
    var A = [], b = [];
    src.forEach(function (s, i) {
      var x = s[0], y = s[1], u = dst[i][0], v = dst[i][1];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
    });
    var h = solve(A, b);
    return [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1];
  };

  var place = function (o) {
    var VW = o.view[0], VH = o.view[1];
    var layout = function () {
      var k = o.box.clientWidth / o.photoW; if (!k) return;
      var dst = o.corners.map(function (p) { return [p[0] * k, p[1] * k]; });
      var m = homography([[0, 0], [VW, 0], [VW, VH], [0, VH]], dst);
      o.glass.style.transform = "matrix3d(" + m.map(function (v) { return +v.toFixed(10); }).join(",") + ")";
      (o.marks || []).forEach(function (mk) {
        var r = mk.round === "pill" ? "999px" : mk.round === "bottom" ? "0 0 " + mk.r * k + "px " + mk.r * k + "px" : "0";
        Object.assign(mk.el.style, { left: mk.x * k + "px", top: mk.y * k + "px", width: mk.w * k + "px", height: mk.h * k + "px", borderRadius: r });
      });
    };
    layout();
    addEventListener("resize", layout);
    if ("ResizeObserver" in window) new ResizeObserver(layout).observe(o.box);
  };

  var scroll = function (o) {
    var root = document.documentElement, frame = o.frame;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var plan = null, t = 0, last = 0, running = false;
    var build = function () {
      var w, d;
      try { w = frame.contentWindow; d = frame.contentDocument; } catch (e) { return null; }
      if (!d || !d.body) return null;
      var steps = o.plan(w, d);
      if (!steps || !steps.length) return null;
      return { w: w, steps: steps, total: steps.reduce(function (a, s) { return a + (s.move || 0) + s.hold; }, 0) };
    };
    var at = function (ms) {
      var acc = 0, y = plan.steps[0].y;
      for (var i = 0; i < plan.steps.length; i++) {
        var s = plan.steps[i];
        if (s.move) { if (ms < acc + s.move) return y + (s.y - y) * ease((ms - acc) / s.move); acc += s.move; }
        y = s.y;
        if (ms < acc + s.hold) return y;
        acc += s.hold;
      }
      return y;
    };
    var tick = function (now) {
      var dt = last ? Math.min(64, now - last) : 0; last = now;
      if (!plan) plan = build();
      if (plan && !root.dataset.paused && !document.hidden) {
        t = (t + dt) % plan.total;
        try { plan.w.scrollTo(0, Math.round(at(t))); } catch (e) { /* gone */ }
      }
      requestAnimationFrame(tick);
    };
    var start = function () {
      plan = null; t = 0;
      try { frame.contentDocument.fonts.ready.then(function () { plan = null; }); } catch (e) { /* another origin */ }
      if (!running) { running = true; requestAnimationFrame(tick); }
    };
    frame.addEventListener("load", start);
    /* the page may have loaded before this ran (an iframe's first document
       is a blank one that is already complete, so that does not count) */
    try { var d0 = frame.contentDocument; if (d0 && d0.readyState === "complete" && d0.body && frame.contentWindow.location.href !== "about:blank") start(); } catch (e) { /* another origin */ }
  };

  /* the whole page, the way a person reads it (3 Oct 2026, his "can we
     scroll through the entire page for each?"): most of a screen at a
     time from the top to the foot, landing on a section's top when one is
     near, holding where a story plays (o.holds: [{ el, ms }]) and at the
     foot, then gliding back to the top. o.y0 is where the tour starts;
     o.under is how far below the glass's top edge a section lands, under
     the nav; o.marks picks the sections */
  var tour = function (w, d, o) {
    var VH = w.innerHeight, max = Math.max(0, d.documentElement.scrollHeight - VH);
    var abs = function (el) { return el.getBoundingClientRect().top + w.scrollY; };
    var y0 = o.y0 || 0, under = o.under || 0, step = (o.step || 0.8) * VH;
    var tops = [].slice.call(d.querySelectorAll(o.marks || "section"))
      .map(function (el) { return Math.round(abs(el) - under); })
      .filter(function (y) { return y > y0 + 40 && y < max; });
    var holds = (o.holds || []).filter(function (h) { return h.el; })
      .map(function (h) { return { y: Math.max(y0, Math.min(max, Math.round(abs(h.el) - under))), ms: h.ms }; })
      .sort(function (a, b) { return a.y - b.y; });
    var steps = [{ y: y0, hold: o.first || 1800 }], y = y0;
    for (var guard = 0; y < max - 2 && guard < 200; guard++) {
      var next = Math.min(max, y + step), hold = null;
      for (var i = 0; i < holds.length; i++) if (holds[i].y > y + 40 && holds[i].y <= next + 0.3 * VH) { hold = holds[i]; break; }
      if (hold) next = hold.y;
      else {
        var best = null;
        tops.forEach(function (t) { if (t > y + 0.45 * VH && Math.abs(t - next) <= 0.25 * VH && (best === null || Math.abs(t - next) < Math.abs(best - next))) best = t; });
        if (best !== null) next = best;
        if (max - next < 0.35 * VH) next = max;
      }
      next = Math.round(next);
      steps.push({ y: next, move: o.move || 1300, hold: hold ? hold.ms : next >= max ? (o.last || 2200) : (o.hold || 900) });
      y = next;
    }
    steps.push({ y: y0, move: Math.round(Math.min(3600, 1600 + (y - y0) * 0.18)), hold: 700 });
    return steps;
  };

  window.Device = { place: place, scroll: scroll, tour: tour };
})();
