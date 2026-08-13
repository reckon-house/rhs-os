/* ============================================================
   sally-demo-kit — tiny scripted-replay engine for the Sally
   product demos. Zero dependencies, rAF-driven, deterministic.

   Behavior contract (matches RHS house rules):
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
     new SallyDemo(hostEl, async (t) => { ...script... });
   Script helpers on t:
     t.$(sel) t.el(tag, cls, text) t.wait(ms) t.reveal(el)
     t.type(el, text, cps) t.stream(el, paragraphs, wps)
     t.chip(parent, name, arg) -> { resolve(text) }
     t.press(el) t.scrollEl — set to auto-pin a scroll container
   ============================================================ */
(function () {
  "use strict";

  var REDUCED = window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Lab/test hook: ?force=1 runs the demo even when the document is
     hidden (headless panes suspend rAF + IntersectionObserver, which
     is exactly the pause-when-unwatched behavior we WANT in prod).
     The clock falls back to a timer so scripted beats still advance.
     The React port can drop this. */
  var FORCE = /[?&]force=1/.test(window.location.search);

  function SallyDemo(host, script) {
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
    SallyDemo._instances.push(this);

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

  SallyDemo.prototype._paused = function () {
    return !this.visible || this.host.dataset.paused === "true";
  };

  SallyDemo.prototype._tick = function (now) {
    if (this._last === null) { this._last = now; return; }
    var dt = now - this._last;
    this._last = now;
    if (dt > 250) dt = 250; // tab was backgrounded — don't jump
    if (this._paused()) return;
    this._advance(dt);
  };

  SallyDemo.prototype._advance = function (dt) {
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
     scripted demo can't be watched there in real time. SallyDemo.step(ms)
     advances every demo by `ms` of virtual time deterministically:
     transitions are disabled (.sd-instant) so the DOM lands at true
     end-states for screenshots. Usage from a console/eval:
       await SallyDemo.step(6000)   // jump 6 demo-seconds forward
     Production pages never call this. */
  SallyDemo._instances = [];
  SallyDemo.step = function (ms) {
    var SLICE = 20;
    document.documentElement.classList.add("sd-instant");
    SallyDemo._instances.forEach(function (d) {
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
      SallyDemo._instances.forEach(function (d) { d._advance(SLICE); });
      return drain();
    };
    for (var i = 0; i < steps; i++) p = p.then(_);
    return p;
  };

  SallyDemo.prototype.wait = function (ms) {
    if (this.instant) return Promise.resolve();
    var self = this;
    return new Promise(function (resolve) {
      self._waiters.push({ left: ms, resolve: resolve });
    });
  };

  SallyDemo.prototype._start = function () {
    if (this.running) return;
    this.running = true;
    var self = this;
    (function pass() {
      self.stage.innerHTML = self.initialHTML;
      Promise.resolve(self.script(self)).then(function () {
        if (self.instant) return; // reduced motion: hold final frame forever
        self.wait(3200).then(pass);
      }).catch(function (err) {
        console.error("[sally-demo]", err);
      });
    })();
  };

  /* ---------- DOM helpers ---------- */

  SallyDemo.prototype.$ = function (sel) {
    return this.stage.querySelector(sel);
  };

  SallyDemo.prototype.el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  SallyDemo.prototype._pin = function () {
    if (this.scrollEl) this.scrollEl.scrollTop = this.scrollEl.scrollHeight;
  };

  SallyDemo.prototype.reveal = function (el) {
    el.classList.add("sd-pop");
    void el.offsetHeight; // flush so the transition actually runs
    el.classList.add("sd-in");
    this._pin();
  };

  SallyDemo.prototype.press = function (el) {
    var self = this;
    el.classList.add("sd-press");
    return this.wait(160).then(function () { el.classList.remove("sd-press"); });
  };

  /* Typewriter into an element. The caret lives INSIDE the element,
     after a dedicated text node, so it hugs the text end even when
     the element is a flex item (e.g. the input pill). */
  SallyDemo.prototype.type = function (el, text, cps) {
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

  /* Stream paragraphs word-by-word. Minimal **bold** support.
     paragraphs: array of strings. wps = words per second. */
  SallyDemo.prototype.stream = function (el, paragraphs, wps) {
    wps = wps || 22;
    var self = this;
    var interval = 1000 / wps;

    function segsOf(text) {
      // split "a **b** c" -> [{t:"a ",b:false},{t:"b",b:true},{t:" c",b:false}]
      var out = [], parts = text.split("**");
      for (var i = 0; i < parts.length; i++) {
        if (parts[i] !== "") out.push({ t: parts[i], b: i % 2 === 1 });
      }
      return out;
    }

    function buildInstant() {
      for (var p = 0; p < paragraphs.length; p++) {
        var para = self.el("p");
        var segs = segsOf(paragraphs[p]);
        for (var s = 0; s < segs.length; s++) {
          var holder = segs[s].b ? self.el("strong") : document.createTextNode(segs[s].t);
          if (segs[s].b) holder.textContent = segs[s].t;
          para.appendChild(holder);
        }
        el.appendChild(para);
      }
    }

    if (this.instant) { buildInstant(); return Promise.resolve(); }

    var caret = this.el("span", "sd-caret");
    return new Promise(function (resolve) {
      var p = 0;

      function nextPara() {
        if (p >= paragraphs.length) { caret.remove(); resolve(); return; }
        var para = self.el("p");
        el.appendChild(para);
        para.appendChild(caret);
        var segs = segsOf(paragraphs[p]);
        var s = 0, words = [], w = 0, target = null;

        function loadSeg() {
          if (s >= segs.length) {
            p++;
            self.wait(320).then(nextPara);
            return;
          }
          var seg = segs[s];
          target = seg.b ? self.el("strong") : null;
          if (target) para.insertBefore(target, caret);
          // keep trailing spaces attached so spacing survives word joins
          words = seg.t.match(/\S+\s*/g) || [];
          w = 0;
          nextWord(seg);
        }

        function nextWord(seg) {
          if (w >= words.length) { s++; loadSeg(); return; }
          var node = document.createTextNode(words[w]);
          if (target) target.appendChild(node);
          else para.insertBefore(node, caret);
          w++;
          self._pin();
          self.wait(interval).then(function () { nextWord(seg); });
        }

        loadSeg();
      }

      nextPara();
    });
  };

  /* Tool-call chip: appears in running state, resolve() completes it. */
  SallyDemo.prototype.chip = function (parent, name, arg) {
    var chip = this.el("div", "jc-chip");
    chip.appendChild(this.el("span", "jc-spin"));
    var check = this.el("span", "jc-check");
    check.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></svg>';
    chip.appendChild(check);
    var code = this.el("code", null, name);
    chip.appendChild(code);
    if (arg) chip.appendChild(this.el("span", "jc-chip-arg", arg));
    var res = this.el("span", "jc-chip-res");
    chip.appendChild(res);
    parent.appendChild(chip);
    this.reveal(chip);
    var self = this;
    return {
      node: chip,
      resolve: function (text) {
        res.textContent = text;
        chip.classList.add("done");
        self._pin();
      }
    };
  };

  window.SallyDemo = SallyDemo;
})();
