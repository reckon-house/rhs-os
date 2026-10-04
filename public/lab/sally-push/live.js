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
     Live.fly(els)                      copies of els travel to the bag */
window.Live = (() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let t = 0, last = 0, waiters = [], stopped = false, count = 0;
  /* on a homepage the story is one section of a long page (3 Oct 2026):
     its clock runs only while the section is on screen, so it plays where
     it is seen and waits where it is not */
  let vis = true;
  const lvEl = document.querySelector(".lv");
  if (lvEl && "IntersectionObserver" in window) {
    vis = false;
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0.2 }).observe(lvEl);
  }
  const tick = (now) => {
    const dt = last ? Math.min(64, now - last) : 0; last = now;
    if (!stopped && vis && !root.dataset.paused && !document.hidden) t += dt;
    if (waiters.length) waiters = waiters.filter((w) => (t >= w.end ? (w.res(), false) : true));
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  const wait = (ms) => new Promise((res) => waiters.push({ end: t + ms, res }));

  const cur = document.createElement("div");
  cur.className = "lv-cursor"; cur.setAttribute("aria-hidden", "true");
  document.body.appendChild(cur);
  let cx = 0, cy = 0, placed = false;
  const put = () => { cur.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px)"; };
  const centre = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2 + scrollX, r.top + r.height / 2 + scrollY]; };
  const moveTo = async (el, ms = 620) => {
    const [tx, ty] = centre(el);
    if (!placed) { cx = tx + 60; cy = ty + 90; placed = true; put(); }
    cur.classList.add("on");
    const sx = cx, sy = cy, start = t;
    for (;;) {
      const k = Math.min(1, (t - start) / ms);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      cx = sx + (tx - sx) * e; cy = sy + (ty - sy) * e; put();
      if (k >= 1) return;
      await wait(16);
    }
  };
  const tap = async (el, fn) => {
    await moveTo(el);
    cur.classList.add("down");
    await wait(150);
    (fn || (() => el.click()))();
    cur.classList.remove("down");
    await wait(180);
  };

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

  const run = ({ reset, play, still }) => {
    if (reduce) { (still || reset)(); return; }
    /* a real press hands the page to the reader, framed or not: in the
       study, clicking into the frame and touching the story stops the play */
    addEventListener("pointerdown", (e) => {
      if (!e.isTrusted || stopped) return;
      stopped = true; cur.classList.remove("on");
    }, { capture: true });
    (async () => { for (;;) { reset(); bag(0); await wait(700); await play(); await wait(1800); cur.classList.remove("on"); await wait(400); } })();
  };
  return { run, tap, wait, moveTo, bag, toast, fly, get count() { return count; } };
})();
