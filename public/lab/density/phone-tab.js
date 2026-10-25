/* ── A PHONE'S STRIP AND ITS TAB (19 Oct 2026) ───────────────────────
   What slides the strip on a phone: H in the lab (/lab/phone/), his pick
   for the homepage the same day. The look is phone-tab.css, and the
   page's own code (crossref2.js) marks what it does differently on a
   phone TAB. Three ways across: the tab at the foot (Index, and
   whatever the glass holds), a sideways swipe anywhere that is not
   itself a sideways scroller (a mouse drags as a finger would, in a
   narrow window on a desk or the lab's phone frames), and a tap on the
   sliver of the glass at the index's edge. And three things bring the
   glass on their own: anything opened (a tap in the index, a picture,
   Next, the back button), the front desk opening, and an address opened
   cold.

   Close all the way lands where the stage was opened from: a study
   opened from the index comes back to the index, one reached down the
   cover stays on the cover. The tab's second word is what the glass
   holds: Cover at rest, a study's name, a shelf's, Ask.

   Two things that live on the page's body are moved onto the strip, so
   they ride it with the glass: the curtain's column (made the first time
   a study opens, and put on the strip as it is made) and the front desk
   (front-desk.js, wherever it loads, before this file or after).
   ── */
(() => {
  const HTML = document.documentElement, B = document.body, X = window.XREF;
  const STRIP = document.getElementById("strip");
  if (!HTML.classList.contains("tab") || !X || !STRIP) return;

  /* the curtain falls in the glass, so its column rides the strip */
  const C = window.Curtain;
  if (C && typeof C.cover === "function") {
    const cover = C.cover;
    C.cover = function () {
      const ap = B.appendChild;
      B.appendChild = (n) => (n && n.classList && n.classList.contains("ptc") ? STRIP.appendChild(n) : ap.call(B, n));
      try { return cover.apply(this, arguments); } finally { delete B.appendChild; }
    };
  }
  /* the front desk sits over the stage, so it rides the strip too, once
     its file has made it */
  let desk = null;
  const deskIn = () => { const d = document.getElementById("desk"); if (d && d.parentNode !== STRIP) STRIP.appendChild(d); desk = d || desk; };
  deskIn();
  document.addEventListener("DOMContentLoaded", deskIn);

  /* ── the tab, and the sliver ── */
  const nav = document.createElement("nav");
  nav.id = "tabs"; nav.setAttribute("aria-label", "Index or cover");
  nav.innerHTML = '<i class="knob" aria-hidden="true"></i><button type="button"><span>Index</span></button><button type="button"><span>Cover</span></button>';
  B.appendChild(nav);
  const [bI, bG] = nav.querySelectorAll("button"), word = bG.firstChild;
  const sl = document.createElement("button");
  sl.id = "sliver"; sl.type = "button"; sl.setAttribute("aria-label", "Show the cover");
  STRIP.appendChild(sl);

  let at = HTML.classList.contains("at-index") ? "index" : "glass";
  let back = at, deskBack = null, label = "";
  /* the knob under the word in view; p runs 0 (Index) to 1 (the glass) under a finger */
  const knob = (p) => {
    if (p == null) p = at === "glass" ? 1 : 0;
    const a = bI.offsetLeft, aw = bI.offsetWidth, b = bG.offsetLeft, bw = bG.offsetWidth;
    nav.style.setProperty("--kl", (a + (b - a) * p).toFixed(1) + "px");
    nav.style.setProperty("--kw", (aw + (bw - aw) * p).toFixed(1) + "px");
  };
  const place = (to) => {
    const was = at; at = to;
    HTML.classList.toggle("at-index", to === "index");
    bI.setAttribute("aria-pressed", String(to === "index"));
    bG.setAttribute("aria-pressed", String(to === "glass"));
    knob();
    /* at the index, the reel's wires come back where it has scrolled to */
    if (to === "index" && was !== "index") setTimeout(() => { if (at === "index" && X.rewire) X.rewire(); }, 600);
  };
  /* a study's name to its first part, "A.R.C." for "A.R.C. - AI Home Inventory" */
  const short = (t) => String(t || "").split(/\s+[-–]\s+/)[0];
  const relabel = () => {
    const v = X.view || { v: "rest" };
    const t = B.classList.contains("desked") ? "Ask" : v.v === "rest" ? "Cover" : short(label) || "Cover";
    if (word.textContent !== t) { word.textContent = t; sl.setAttribute("aria-label", "Show " + (t === "Cover" ? "the cover" : t)); knob(); }
  };
  bI.addEventListener("click", () => place("index"));
  bG.addEventListener("click", () => place("glass"));
  sl.addEventListener("click", () => place("glass"));

  /* every step the page takes: opening anything brings the glass; back at
     rest, the strip goes where the stage was opened from */
  document.addEventListener("xref:view", (e) => {
    const d = e.detail || {};
    label = d.label || "";
    if (d.v !== "rest") { if (d.was === "rest") back = at; relabel(); if (at !== "glass") place("glass"); return; }
    relabel();
    if (deskBack == null && at !== back) place(back);
  });
  /* a tap in the index on what is already open still brings the glass */
  document.addEventListener("xref:tap", () => setTimeout(() => { if (X.view && X.view.v !== "rest" && at !== "glass") place("glass"); }, 0));
  /* the front desk is a depth of its own: up, the glass; down, back where it was asked from */
  const hover = matchMedia("(hover: hover)").matches;
  new MutationObserver(() => {
    const on = B.classList.contains("desked");
    if (on) deskIn();
    if (on && deskBack == null) {
      deskBack = at; place("glass");
      /* on glass the desk's field waits for a finger: focused by script it
         would raise the keyboard over the desk before anything is read */
      if (!hover) setTimeout(() => { const a = document.activeElement; if (a && desk && desk.contains(a) && /^(TEXTAREA|INPUT)$/.test(a.tagName)) a.blur(); }, 90);
    } else if (!on && deskBack != null) {
      const b = deskBack; deskBack = null;
      if (!X.view || X.view.v === "rest") place(b);
    }
    relabel();
  }).observe(B, { attributes: true, attributeFilter: ["class"] });

  /* ── a swipe: the strip follows the finger, and carries on past a fifth
     of the way or with a flick. A touch that starts in something that
     scrolls sideways (a hero, a carousel), in a field, the tab or the
     curtain is that thing's own ── */
  const travel = () => STRIP.getBoundingClientRect().width - innerWidth;
  const sideways = (n) => {
    for (; n && n !== B && n !== HTML; n = n.parentElement) {
      if (n.scrollWidth > n.clientWidth + 2) { const ox = getComputedStyle(n).overflowX; if (ox === "auto" || ox === "scroll") return true; }
    }
    return false;
  };
  const mine = (n) => !(nav.contains(n) || (n.closest && n.closest("input, textarea, .pt")) || sideways(n));
  const begin = (x, y) => { const W = travel(); return { x, y, t: performance.now(), lock: false, dx: 0, W, base: at === "index" ? 0 : -W }; };
  /* sideways past 10px and more across than down is the strip's; down
     first is the page's scroll (null) */
  const lockX = (D, dx, dy) => {
    if (!D.lock && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) { D.lock = true; HTML.classList.add("drag"); if (D.mouse) HTML.classList.add("mdrag"); }
    return D.lock ? true : Math.abs(dy) > 10 ? null : false;
  };
  /* past either end it gives, a quarter as far as the finger goes */
  const follow = (D, dx) => {
    D.dx = dx;
    let x = D.base + dx;
    if (x > 0) x *= 0.25; else if (x < -D.W) x = -D.W + (x + D.W) * 0.25;
    STRIP.style.transform = "translate3d(" + x.toFixed(1) + "px, 0, 0)";
    knob(Math.max(0, Math.min(1, -x / D.W)));
  };
  const settle = (D) => {
    const v = D.dx / Math.max(1, performance.now() - D.t), dx = D.dx, W = D.W;
    let to = at;
    if (at === "index" && (dx < -W * 0.2 || v < -0.35)) to = "glass";
    else if (at === "glass" && (dx > W * 0.2 || v > 0.35)) to = "index";
    HTML.classList.remove("drag", "mdrag"); HTML.classList.add("flung");
    STRIP.style.transform = "";
    place(to);
    setTimeout(() => HTML.classList.remove("flung"), 460);
  };
  /* a touch's moves go to what it began on, even once that has left the
     page (a sizzle in the index swaps the words and frames in its shadow
     under the finger), so the drag listens there, on the innermost thing
     touched, and not on the window */
  let T = null;
  const move = (e) => {
    const t = T && e.touches[0];
    if (!t) return;
    const dx = t.clientX - T.x, k = lockX(T, dx, t.clientY - T.y);
    if (k === null) { end(); return; }
    if (!k) return;
    e.preventDefault();
    follow(T, dx);
  };
  const end = () => {
    if (T) { const g = T.g; g.removeEventListener("touchmove", move); g.removeEventListener("touchend", release); g.removeEventListener("touchcancel", release); }
    T = null;
  };
  const release = () => { const D = T; end(); if (D && D.lock) settle(D); };
  addEventListener("touchstart", (e) => {
    /* a second finger lets the strip go where the first had it */
    if (T) release();
    const t = e.touches[0], n = e.target, g = (e.composedPath && e.composedPath()[0]) || n;
    if (e.touches.length !== 1 || !mine(n)) return;
    T = begin(t.clientX, t.clientY); T.g = g;
    g.addEventListener("touchmove", move, { passive: false });
    g.addEventListener("touchend", release);
    g.addEventListener("touchcancel", release);
  }, { passive: true });
  /* in a narrow window on a desk (and the lab's phone frames), a mouse
     drags as a finger would; the click a drag ends on is the drag's, not
     a tap on what it is over */
  let M = null;
  const eat = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
  addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !mine(e.target)) return;
    M = begin(e.clientX, e.clientY); M.id = e.pointerId; M.mouse = true;
  });
  addEventListener("pointermove", (e) => {
    if (!M || e.pointerId !== M.id) return;
    const k = lockX(M, e.clientX - M.x, e.clientY - M.y);
    if (k === null) { M = null; return; }
    if (!k) return;
    /* what the first 10px selected goes */
    if (!M.held) { M.held = true; const sel = getSelection(); if (sel) sel.removeAllRanges(); }
    e.preventDefault(); follow(M, e.clientX - M.x);
  });
  const drop = (e) => {
    if (!M || e.pointerId !== M.id) return;
    const D = M; M = null;
    if (!D.lock) return;
    addEventListener("click", eat, true);
    setTimeout(() => removeEventListener("click", eat, true), 0);
    settle(D);
  };
  addEventListener("pointerup", drop);
  addEventListener("pointercancel", drop);
  /* a picture or a link dragged is the strip's, not the browser's */
  addEventListener("dragstart", (e) => { if (M) e.preventDefault(); });

  /* where it opens: at rest the cover, the reel's first glass; ?at=index
     the index; an address, what it opens */
  place(at);
  relabel();
  /* the knob is set to its words once the fonts are in, or after 4s, as the
     page's first screen is (crossref2.js FONTS_IN), and again when they come */
  const fr = document.fonts && document.fonts.ready;
  (fr ? Promise.race([fr, new Promise((r) => setTimeout(r, 4000))]) : Promise.resolve()).then((f) => { knob(); if (fr && !f) fr.then(() => knob()); });
  addEventListener("resize", () => knob());
  /* a narrow window on a desk widened past a phone's width is the desk
     again: the page is laid out for one or the other, so it reloads at
     the same address. A phone turned on its side stays the strip */
  const handheld = () => matchMedia("(pointer: coarse)").matches && Math.min(innerWidth, innerHeight) <= 500;
  let wide = 0;
  addEventListener("resize", () => { clearTimeout(wide); wide = setTimeout(() => { if (innerWidth > 760 && !handheld()) location.reload(); }, 400); });
  /* nothing slides on arrival: the strip is where it opens before it moves */
  requestAnimationFrame(() => requestAnimationFrame(() => HTML.classList.add("slides")));
  /* for shoots: XREF_TAB.place("index" | "glass") */
  window.XREF_TAB = { place, get at() { return at; } };
})();
