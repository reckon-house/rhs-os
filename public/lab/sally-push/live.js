/* Live stories (2 Oct 2026, his "can we show the 'stories' in context of
   the page/experience too? ... maybe it is just showing them animated and
   functioning"). Each story page works when clicked; this file also lets
   it play itself: a cursor moves to a control and presses it, on a clock
   that stands still while the room pauses the page (data-paused on its
   root) or the tab is hidden. A reader who asks for less motion gets the
   finished state, still. Opened on its own, the page plays until the
   reader presses something, then hands over.

     Live.run({ reset, play, still })   play is an async function of steps
     Live.tap(el, fn?)                  move to el and press it (fn or el.click())
     Live.wait(ms)                      wait on the page's clock
     Live.bag(n) / Live.toast(text)     the shared nav's bag and its note
     Live.fly(els)                      copies of els travel to the bag

   A page can hold more than one story (3 Oct 2026: Colorfest has the color
   code and the free colorist). Live.run({ el, ... }) gives a story its own
   section, clock and cursor, and hands its play the same verbs bound to
   them (play(L): L.tap, L.wait, L.moveTo). Without el a story is the
   page's first .lv, and Live.tap / Live.wait are its verbs, as before.
   el need not be the whole section: it is what has to be seen for the
   story to play, by threshold (default 0.2) of it on screen, so a story
   can wait until its stage is in view rather than its first edge. */
window.Live = (() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let last = 0, stopped = false, count = 0;
  const RESTART = {};
  const stories = new Map();
  const centre = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2 + scrollX, r.top + r.height / 2 + scrollY]; };

  /* a story's clock runs only while its section is on screen (3 Oct 2026:
     on a homepage a story is one section of a long page, so it plays where
     it is seen and waits where it is not). Back on screen after a while
     away, it starts over, so whoever arrives sees it from the top */
  const story = (el, threshold = 0.2) => {
    const key = el || root;
    if (stories.has(key)) return stories.get(key);
    const s = { t: 0, waiters: [], vis: true, leftAt: 0 };
    if (el && "IntersectionObserver" in window) {
      s.vis = false;
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !s.vis && s.leftAt && s.t > 0 && performance.now() - s.leftAt > 1500) {
          const w = s.waiters; s.waiters = []; w.forEach((x) => x.rej(RESTART));
        }
        if (!e.isIntersecting && s.vis) s.leftAt = performance.now();
        s.vis = e.isIntersecting;
      }, { threshold }).observe(el);
    }
    s.wait = (ms) => new Promise((res, rej) => s.waiters.push({ end: s.t + ms, res, rej }));
    const cur = document.createElement("div");
    cur.className = "lv-cursor"; cur.setAttribute("aria-hidden", "true");
    document.body.appendChild(cur);
    s.cur = cur;
    let cx = 0, cy = 0;
    s.placed = false;
    const put = () => { cur.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px)"; };
    s.moveTo = async (target, ms = 620) => {
      const [tx, ty] = centre(target);
      if (!s.placed) { cx = tx + 60; cy = ty + 90; s.placed = true; put(); }
      cur.classList.add("on");
      const sx = cx, sy = cy, start = s.t;
      for (;;) {
        const k = Math.min(1, (s.t - start) / ms);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        cx = sx + (tx - sx) * e; cy = sy + (ty - sy) * e; put();
        if (k >= 1) return;
        await s.wait(16);
      }
    };
    s.tap = async (target, fn) => {
      await s.moveTo(target);
      cur.classList.add("down");
      await s.wait(150);
      (fn || (() => target.click()))();
      cur.classList.remove("down");
      await s.wait(180);
    };
    s.api = { tap: s.tap, wait: s.wait, moveTo: s.moveTo };
    stories.set(key, s);
    return s;
  };
  const first = () => story(document.querySelector(".lv"));

  const tick = (now) => {
    const dt = last ? Math.min(64, now - last) : 0; last = now;
    const going = !stopped && !root.dataset.paused && !document.hidden;
    stories.forEach((s) => {
      if (going && s.vis) s.t += dt;
      if (s.waiters.length) s.waiters = s.waiters.filter((w) => (s.t >= w.end ? (w.res(), false) : true));
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  /* the shared nav: the bag's count and a short note under it. On a
     homepage the bag is the page's own (the chrome's .sk-bag) */
  const badge = () => document.querySelector(".lv-bag b, .sk-bag b");
  const bag = (n) => {
    count = n; const b = badge(); if (!b) return;
    b.textContent = String(n);
    b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  };
  let toastT = 0;
  const toast = (text, ms = 2200) => {
    let el = document.querySelector(".lv-toast");
    if (!el) {
      el = document.createElement("div"); el.className = "lv-toast"; el.setAttribute("role", "status");
      /* a module carries its own nav, so its note sits under it; on a
         homepage the note sits under the page's nav, fixed */
      if (document.querySelector(".lv-nav")) (document.querySelector(".lv") || document.body).appendChild(el);
      else { el.classList.add("fixed"); document.body.appendChild(el); }
    }
    el.textContent = text; el.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on"), ms);
  };
  const fly = (els) => {
    const b = badge(); if (!b) return;
    const [bx, by] = centre(b);
    els.forEach((src, i) => {
      const r = src.getBoundingClientRect();
      const c = src.cloneNode(true);
      c.classList.add("lv-fly");
      Object.assign(c.style, { left: r.left + scrollX + "px", top: r.top + scrollY + "px", width: r.width + "px", height: r.height + "px", transitionDelay: i * 70 + "ms" });
      document.body.appendChild(c);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        c.style.transform = "translate(" + (bx - (r.left + scrollX + r.width / 2)) + "px," + (by - (r.top + scrollY + r.height / 2)) + "px) scale(0.2)";
        c.style.opacity = "0";
      }));
      setTimeout(() => c.remove(), 1200 + i * 70);
    });
  };

  let armed = false;
  const run = ({ el, threshold, reset, play, still }) => {
    if (reduce) { (still || reset)(); return; }
    /* a real press hands the page to the reader, framed or not: in the
       study, clicking into the frame and touching the story stops the play */
    if (!armed) {
      armed = true;
      addEventListener("pointerdown", (e) => {
        if (!e.isTrusted || stopped) return;
        stopped = true; stories.forEach((s) => s.cur.classList.remove("on"));
      }, { capture: true });
    }
    const s = el ? story(el, threshold) : first();
    (async () => {
      for (;;) {
        try {
          s.cur.classList.remove("on"); s.placed = false;
          reset(); bag(0); await s.wait(700); await play(s.api); await s.wait(1800);
          s.cur.classList.remove("on"); await s.wait(400);
        } catch (e) { if (e !== RESTART) throw e; }
      }
    })();
  };
  return {
    run, bag, toast, fly,
    tap: (el, fn) => first().tap(el, fn),
    wait: (ms) => first().wait(ms),
    moveTo: (el, ms) => first().moveTo(el, ms),
    get count() { return count; },
  };
})();
