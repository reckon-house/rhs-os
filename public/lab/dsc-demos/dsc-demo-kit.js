/* ============================================================
   dsc-demo-kit — tiny scripted-replay engine for the DSC
   product demos. Zero dependencies, rAF-driven, deterministic.

   Ported from the reference engine in the RHS repo
   (public/lab/sally-demos/sally-demo-kit.js) — same behavior
   contract, renamed global. Port the behaviors, don't re-derive:

   - IntersectionObserver: the timeline only advances while the
     demo is on screen; scrolling away freezes it mid-beat.
   - data-paused="true" on the host freezes it too (port hook).
   - prefers-reduced-motion: the script runs once instantly to
     its finished end-state and never loops — the final frame IS
     the static fallback.
   - Loop: at the end of each pass the stage's initial DOM is
     restored and the script re-runs.
   - No Date.now()/Math.random() in anything that renders — the
     replay is identical every pass.

   Usage:
     new DSCDemo(hostEl, async (t) => { ...script... });
   Script helpers on t:
     t.$(sel) t.el(tag, cls, text) t.wait(ms) t.reveal(el)
     t.fade(el)  — opacity-only reveal, for elements that carry
                   their own transform (one element, one driver)
     t.type(el, text, cps) t.stream(el, paragraphs, wps)
     t.press(el) t.scrollEl — set to auto-pin a scroll container
   ============================================================ */
(function () {
  "use strict";

  var REDUCED = window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Lab/test hook: ?force=1 runs the demo even when the document is
     hidden (headless panes suspend rAF + IntersectionObserver, which
     is exactly the pause-when-unwatched behavior we WANT in prod).
     The clock falls back to a timer so scripted beats still advance. */
  var FORCE = /[?&]force=1/.test(window.location.search);

  /* ?framed=1 — the demo is running inside a host page that carries its
     own chrome (the case study frames these). The standalone caption is
     written for someone who arrived at this URL directly; inside a frame
     that already names the demo, it would land as a second caption. So
     the demo drops it rather than the host reaching in to hide it. */
  if (/[?&]framed=1/.test(window.location.search)) {
    document.documentElement.setAttribute("data-framed", "");
  }

  function DSCDemo(host, script) {
    if (!host) return;
    this.host = host;
    this.stage = host.querySelector("[data-stage]") || host;
    this.script = script;
    this.initialHTML = this.stage.innerHTML;
    this.instant = REDUCED;
    this.visible = false;
    this.running = false;
    this.scrollEl = null;
    this._waiters = [];
    this._last = null;
    DSCDemo._instances.push(this);

    var self = this;
    if (FORCE) {
      this.visible = true;
      setInterval(function () { self._tick(performance.now()); }, 25);
      this._start();
      return;
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        var e = entries[0];
        self.visible = e.isIntersecting && e.intersectionRatio >= 0.25;
        if (self.visible && !self.running) self._start();
      }, { threshold: [0, 0.25, 0.6, 1] });
      io.observe(host);
    } else {
      this.visible = true;
      this._start();
    }

    requestAnimationFrame(function tick(now) {
      self._tick(now);
      requestAnimationFrame(tick);
    });
  }

  DSCDemo.prototype._paused = function () {
    return !this.visible || this.host.dataset.paused === "true";
  };

  DSCDemo.prototype._tick = function (now) {
    if (this._last === null) { this._last = now; return; }
    var dt = now - this._last;
    this._last = now;
    if (dt > 250) dt = 250; // tab was backgrounded — don't jump
    if (this._paused()) return;
    this._advance(dt);
  };

  DSCDemo.prototype._advance = function (dt) {
    var still = [];
    for (var i = 0; i < this._waiters.length; i++) {
      var w = this._waiters[i];
      w.left -= dt;
      if (w.left <= 0) w.resolve(); else still.push(w);
    }
    this._waiters = still;
  };

  /* ---------- virtual-time stepper (testing hook) ----------
     Headless/hidden panes suspend rAF, IO, and throttle timers, so a
     scripted demo can't be watched there in real time. DSCDemo.step(ms)
     advances every demo by `ms` of virtual time deterministically:
     transitions are disabled (.sd-instant) so the DOM lands at true
     end-states for screenshots. Usage from a console/eval:
       await DSCDemo.step(6000)   // jump 6 demo-seconds forward
     ⚠️ For jumping to a beat, NOT for driving a whole replay — slices
     where a resolved wait needs extra microtask hops drop time and it
     drifts badly over 30+ seconds. Use ?force=1 + wall clock to record. */
  DSCDemo._instances = [];
  DSCDemo.step = function (ms) {
    var SLICE = 20;
    document.documentElement.classList.add("sd-instant");
    DSCDemo._instances.forEach(function (d) {
      d.visible = true;
      if (!d.running) d._start();
    });
    var steps = Math.ceil(ms / SLICE);
    var p = Promise.resolve();
    function drain() {
      // two microtask hops let resolved waits schedule their successors
      return Promise.resolve().then(function () { return Promise.resolve(); });
    }
    var _ = function () {
      DSCDemo._instances.forEach(function (d) { d._advance(SLICE); });
      return drain();
    };
    for (var i = 0; i < steps; i++) p = p.then(_);
    return p;
  };

  DSCDemo.prototype.wait = function (ms) {
    if (this.instant) return Promise.resolve();
    var self = this;
    return new Promise(function (resolve) {
      self._waiters.push({ left: ms, resolve: resolve });
    });
  };

  DSCDemo.prototype._start = function () {
    if (this.running) return;
    this.running = true;
    var self = this;
    (function pass() {
      self.stage.innerHTML = self.initialHTML;
      Promise.resolve(self.script(self)).then(function () {
        if (self.instant) return; // reduced motion: hold final frame forever
        self.wait(3200).then(pass);
      }).catch(function (err) {
        console.error("[dsc-demo]", err);
      });
    })();
  };

  /* ---------- DOM helpers ---------- */

  DSCDemo.prototype.$ = function (sel) {
    return this.stage.querySelector(sel);
  };

  DSCDemo.prototype.el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  DSCDemo.prototype._pin = function () {
    if (this.scrollEl) this.scrollEl.scrollTop = this.scrollEl.scrollHeight;
  };

  /* reveal() owns `transform` via .sd-pop. Never hand it an element
     that positions itself with its own transform — use fade(). */
  DSCDemo.prototype.reveal = function (el) {
    el.classList.add("sd-pop");
    void el.offsetHeight; // flush so the transition actually runs
    el.classList.add("sd-in");
    this._pin();
  };

  DSCDemo.prototype.fade = function (el) {
    el.classList.add("sd-fade");
    void el.offsetHeight;
    el.classList.add("sd-in");
    this._pin();
  };

  DSCDemo.prototype.press = function (el) {
    var self = this;
    el.classList.add("sd-press");
    return this.wait(160).then(function () { el.classList.remove("sd-press"); });
  };

  /* Typewriter into an element. The caret lives INSIDE the element,
     after a dedicated text node, so it hugs the text end even when
     the element is a flex item (e.g. the input pill). */
  DSCDemo.prototype.type = function (el, text, cps) {
    cps = cps || 30;
    if (this.instant) { el.textContent = text; return Promise.resolve(); }
    var self = this;
    var txt = document.createTextNode("");
    var caret = this.el("span", "sd-caret");
    el.appendChild(txt);
    el.appendChild(caret);
    var i = 0;
    return new Promise(function (resolve) {
      (function step() {
        if (i >= text.length) { caret.remove(); resolve(); return; }
        txt.data += text.charAt(i);
        i++;
        self._pin();
        self.wait(1000 / cps).then(step);
      })();
    });
  };

  /* Stream paragraphs word-by-word into a plain-text container.
     ⚠️ The DSC chat renders RAW TEXT (whitespace-pre-wrap, no markdown)
     — so unlike the reference engine there is NO **bold** handling
     here: what the model streams is exactly what the product shows,
     asterisks and all. paragraphs: array of strings, joined by \n\n.
     wps = words per second. */
  DSCDemo.prototype.stream = function (el, paragraphs, wps) {
    wps = wps || 22;
    var self = this;
    var interval = 1000 / wps;
    var text = paragraphs.join("\n\n");

    if (this.instant) {
      el.textContent += text;
      return Promise.resolve();
    }

    // keep leading/trailing whitespace (incl. newlines) attached to words
    var words = text.match(/\s*\S+\s*/g) || [];
    var txt = document.createTextNode("");
    var caret = this.el("span", "sd-caret");
    el.appendChild(txt);
    el.appendChild(caret);
    var w = 0;
    return new Promise(function (resolve) {
      (function step() {
        if (w >= words.length) { caret.remove(); resolve(); return; }
        txt.data += words[w];
        w++;
        self._pin();
        self.wait(interval).then(step);
      })();
    });
  };

  window.DSCDemo = DSCDemo;
})();
