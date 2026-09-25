/* ── THE RIDE: ONE SCROLL ENGINE UNDER EVERY CONCEPT (24 Sept 2026) ───
   His ask: concepts blending the board with the two Awwwards sites he
   found, normalisboring.es and akaru.fr, "the fluidness of them... the
   use of white space in places but also big solid color fills and the
   kicker on each - at one point when you are scrolling horizontal for a
   while all of a sudden the site scrolls vertical".

   What both do, measured on 24 Sept: the page scrolls DOWN and a pinned
   track moves SIDEWAYS (Normal is Boring: ~17,000px of track on ~9,000px
   of scroll), smoothed by Lenis; when the track runs out the pin lets go
   and the page carries on down. So does this. A `.leg-h` pins its `.pin`
   for exactly as long as its `.track` is wider than the glass, plus an
   optional `data-extra` (in screens) for a concept to do something while
   still pinned, then the page goes on down. That handoff is the turn.

   The effects are attributes, driven from the scroll, never from a clock:
     data-flip="up|down|left|right"  a picture unmasks as it enters
     data-par="0.2"                  its first child drifts (parallax)
     data-rise                       words rise in, once, when it enters
     data-stretch                    letters grow from the baseline as it
                                     comes up from the foot of the glass
     data-count                      a number counts up, once
     data-reel                       the study's frames cut under the hand
     data-cur="Open"                 the dot grows into that word over it

   ?smooth=0 turns Lenis off, ?p=0.42 opens at that fraction of the page,
   and a parent frame can scrub it: postMessage({type:"ride-scrub", p}). */
(function () {
"use strict";
const Q = new URLSearchParams(location.search);
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => 1 - Math.pow(1 - t, 3);
const ride = { legs: [], fx: [], pre: [], hooks: [], measures: [], y: 0, vw: innerWidth, vh: innerHeight, lenis: null, flat: false, clamp, lerp, ease };

/* ── PICTURES ── the house's rungs (@384, @768, the file) and never wider
   than half a file's own pixels */
const rungs = (s, i) => {
  const f = s.frames[i || 0], full = f.replace("@384", "");
  const w = i ? 1536 : s.nat[0];
  const out = [[f, 384]];
  if (i || s.r768) out.push([f.replace("@384", "@768"), 768]);
  out.push([full, w]);
  return out;
};
ride.img = (s, cssW, i) => {
  const im = document.createElement("img");
  im.alt = ""; im.decoding = "async"; im.loading = "lazy";
  const r = rungs(s, i);
  im.src = encodeURI(r[1] ? r[1][0] : r[0][0]);
  im.srcset = r.map(([u, n]) => encodeURI(u) + " " + n + "w").join(", ");
  im.sizes = Math.max(1, Math.round(cssW || 400)) + "px";
  return im;
};
ride.honest = (s) => s.nat[0] / 2;
/* a picture box for a study: cover-cropped at the size asked, its frames
   ready to cut under the hand */
ride.pic = (s, w, h, opts) => {
  const o = opts || {};
  const box = document.createElement(o.tag || "a");
  box.className = "pic" + (o.cls ? " " + o.cls : "");
  if (box.tagName === "A") box.href = "/case-studies/" + s.h;
  box.style.width = Math.round(w) + "px"; box.style.height = Math.round(h) + "px";
  /* its shape travels with it, so a phone can shrink it to the column */
  box.style.aspectRatio = Math.round(w) + " / " + Math.round(h);
  const im = ride.img(s, w); im.classList.add("on"); box.appendChild(im);
  if (o.flip) box.dataset.flip = o.flip;
  if (o.reel !== false && s.frames.length > 1) box.dataset.reel = s.k;
  if (o.cur !== false) box.dataset.cur = o.cur || "Open";
  box.__s = s;
  return box;
};
/* ── A REEL ── the study's own frames, cut with a wipe, while it plays */
const WIPES = ["inset(0 0 0 100%)", "inset(100% 0 0 0)", "inset(0 100% 0 0)", "inset(0 0 100% 0)"];
ride.reel = (box) => {
  if (box.__reel) return box.__reel;
  const s = box.__s; if (!s || s.frames.length < 2) return null;
  const R = { k: 0, t: 0, on: false, n: 0 };
  const w = parseFloat(box.style.width) || box.offsetWidth;
  const step = () => {
    if (!R.on) return;
    R.k = (R.k + 1) % s.frames.length;
    const im = ride.img(s, w, R.k); im.loading = "eager";
    im.style.clipPath = WIPES[R.n++ % 4]; im.style.opacity = "1";
    im.style.transition = "clip-path 0.5s cubic-bezier(0.7, 0, 0.2, 1)";
    box.appendChild(im);
    const go = () => { requestAnimationFrame(() => { im.style.clipPath = "inset(0 0 0 0)"; }); };
    if (im.complete) go(); else { im.onload = go; im.onerror = go; }
    setTimeout(() => { [...box.querySelectorAll("img")].forEach((x) => { if (x !== im) x.remove(); }); im.classList.add("on"); }, 620);
    R.t = setTimeout(step, 1100);
  };
  R.start = () => { if (R.on || REDUCE) return; R.on = true; clearTimeout(R.t); R.t = setTimeout(step, 250); };
  R.stop = () => { R.on = false; clearTimeout(R.t); };
  box.__reel = R;
  return R;
};

/* how many ems a line of the house's type runs to, for fitting a name */
const inkC = document.createElement("canvas").getContext("2d");
ride.measureEm = (txt, weight, track) => { inkC.font = (weight || 700) + ' 100px "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif';
  return inkC.measureText(txt).width / 100 + (track || 0) * txt.length; };

/* ── SPLITTING TYPE ── words for a rise, letters for a stretch */
ride.words = (el) => {
  const txt = el.textContent; el.textContent = "";
  txt.split(/(\s+)/).forEach((w, i) => {
    if (/^\s+$/.test(w)) { el.appendChild(document.createTextNode(" ")); return; }
    if (!w) return;
    const o = document.createElement("span"); o.className = "w";
    const n = document.createElement("span"); n.textContent = w; n.style.setProperty("--i", i >> 1);
    o.appendChild(n); el.appendChild(o);
  });
};
ride.riseLetters = (el) => {
  const txt = el.textContent; el.textContent = "";
  [...txt].forEach((c, i) => {
    const o = document.createElement("span"); o.className = "w";
    const n = document.createElement("span"); n.textContent = c === " " ? "\u00a0" : c; n.style.setProperty("--i", i);
    o.appendChild(n); el.appendChild(o);
  });
};
ride.letters = (el) => {
  const txt = el.textContent; el.textContent = "";
  [...txt].forEach((c) => { const l = document.createElement("span"); l.className = "l"; l.textContent = c === " " ? " " : c; el.appendChild(l); });
};

/* ── MEASURE ── the legs' heights, and where each effect lives */
function measure() {
  ride.vw = innerWidth; ride.vh = innerHeight;
  ride.flat = innerWidth <= 760;
  ride.legs = [...document.querySelectorAll(".leg-h")].map((sec) => {
    const pin = sec.querySelector(":scope > .pin"), track = pin.querySelector(":scope > .track");
    sec.classList.toggle("flat", ride.flat);
    if (ride.flat) { sec.style.height = ""; track.style.transform = ""; return { sec, pin, track, flat: true, x: 0, t: 0, turn: 0 }; }
    track.style.transform = "translate3d(0,0,0)";
    const tw = track.offsetWidth, travel = Math.max(0, tw - ride.vw);
    const extra = (parseFloat(sec.dataset.extra || "0") || 0) * ride.vh;
    sec.style.height = (travel + extra + ride.vh) + "px";
    return { sec, pin, track, tw, travel, extra, top: 0, x: 0, t: 0, turn: 0, d: 0 };
  });
  ride.legs.forEach((L) => { if (!L.flat) L.top = L.sec.getBoundingClientRect().top + scrollY; });
  ride.fx = [...document.querySelectorAll("[data-flip],[data-par],[data-rise],[data-stretch],[data-count]")].map((el) => ({
    el, h: !!el.closest(".leg-h:not(.flat)"),
    flip: el.dataset.flip, par: el.dataset.par != null ? parseFloat(el.dataset.par) : null,
    rise: el.hasAttribute("data-rise"), stretch: el.hasAttribute("data-stretch"), count: el.hasAttribute("data-count"),
  }));
  ride.fx.forEach((f) => {
    if (f.rise && !f.el.__split) { (f.el.dataset.rise === "letters" ? ride.riseLetters : ride.words)(f.el); f.el.classList.add("rise"); f.el.__split = true; }
    if (f.stretch && !f.el.__split) { ride.letters(f.el); f.el.classList.add("stretch"); f.el.__split = true; f.letters = [...f.el.querySelectorAll(".l")]; }
    if (f.stretch && !f.letters) f.letters = [...f.el.querySelectorAll(".l")];
    if (f.count && f.el.__to == null) { f.el.__to = parseFloat(f.el.textContent.replace(/,/g, "")) || 0; f.el.__comma = /,/.test(f.el.textContent); f.el.textContent = "0"; }
  });
  ride.measures.forEach((fn) => fn(ride));
  frame();
}

/* how far into the glass a box has come: 0 at the right or bottom edge,
   1 once it is well inside, and it stays 1 after it passes */
const entry = (r) => clamp(Math.min((ride.vw - r.left) / (ride.vw * 0.42), (ride.vh - r.top) / (ride.vh * 0.42)), 0, 1);
ride.entry = entry;

function frame() {
  const y = scrollY;
  ride.y = y;
  ride.legs.forEach((L) => {
    if (L.flat) return;
    const d = y - L.top;
    L.d = d;
    L.x = clamp(d, 0, L.travel);
    L.t = L.travel ? L.x / L.travel : (d > 0 ? 1 : 0);
    L.turn = L.extra ? clamp((d - L.travel) / L.extra, 0, 1) : (d > L.travel ? 1 : 0);
    L.track.style.transform = "translate3d(" + (-L.x) + "px,0,0)";
  });
  /* a concept that moves the page itself does it here, so the effects
     below read where things are this frame, not the last */
  ride.pre.forEach((fn) => fn(ride));
  const vw = ride.vw, vh = ride.vh;
  ride.fx.forEach((f) => {
    const el = f.el, r = el.getBoundingClientRect();
    if (r.right < -vw || r.left > vw * 2 || r.bottom < -vh || r.top > vh * 2) { if (!f.flip) return; }
    if (f.flip) {
      const e = REDUCE ? 1 : ease(entry(r)), k = ((1 - e) * 100).toFixed(2) + "%";
      const rad = getComputedStyle(el).borderTopLeftRadius || "0px";
      const ins = f.flip === "down" ? "0 0 " + k + " 0" : f.flip === "left" ? "0 " + k + " 0 0" : f.flip === "right" ? "0 0 0 " + k : k + " 0 0 0";
      el.style.clipPath = "inset(" + ins + " round " + rad + ")";
      const im = el.firstElementChild; if (im && im.tagName === "IMG") im.style.transform = "scale(" + (1 + (1 - e) * 0.18).toFixed(4) + ")";
    }
    if (f.par != null && !REDUCE) {
      const kid = el.firstElementChild; if (!kid) return;
      const off = f.h ? (r.left + r.width / 2 - vw / 2) : (r.top + r.height / 2 - vh / 2);
      kid.style.transform = f.h ? "translate3d(" + (-off * f.par).toFixed(1) + "px,0,0)" : "translate3d(0," + (-off * f.par).toFixed(1) + "px,0)";
    }
    if (f.rise && !el.classList.contains("in") && entry(r) > 0.12) el.classList.add("in");
    if (f.count && !el.__counted && entry(r) > 0.3) {
      el.__counted = true; const to = el.__to, t0 = performance.now();
      const tick = (t) => { const k = REDUCE ? 1 : ease(clamp((t - t0) / 1400, 0, 1)); const v = Math.round(to * k);
        el.textContent = el.__comma ? v.toLocaleString("en-US") : String(v); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }
    if (f.stretch) {
      /* the letters grow as the word comes up from the foot of the glass,
         each a beat behind the one before */
      const k0 = clamp((vh - r.top) / (r.height * 1.6), 0, 1), n = f.letters.length;
      f.letters.forEach((l, i) => {
        const k = REDUCE ? 1 : ease(clamp(k0 * 1.5 - (i / Math.max(1, n - 1)) * 0.5, 0, 1));
        l.style.transform = "scaleY(" + lerp(0.08, 1, k).toFixed(4) + ")";
      });
    }
  });
  ride.hooks.forEach((fn) => fn(ride));
  if (window.parent !== window) {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? y / max : 0;
    if (Math.abs(p - (ride.lastP || -1)) > 0.002) { ride.lastP = p; parent.postMessage({ type: "ride-progress", p }, "*"); }
  }
}
ride.frame = frame;
/* a concept that rebuilds itself (on resize, or once its fonts land) asks
   the engine to find its effects again */
ride.remeasure = () => measure();

/* ── GOING PLACES ── */
ride.to = (y, now) => {
  if (ride.lenis && !now) ride.lenis.scrollTo(y, { duration: 1.4 });
  else if (ride.lenis) ride.lenis.scrollTo(y, { immediate: true, force: true });
  else scrollTo({ top: y, behavior: now || REDUCE ? "auto" : "smooth" });
  if (now) requestAnimationFrame(frame);
};
/* where the page must be for a leg's track to show `x` at the glass's left */
ride.yForX = (L, x) => L.top + clamp(x, 0, L.travel);
ride.scrub = (p) => { const max = document.documentElement.scrollHeight - innerHeight; ride.to(clamp(p, 0, 1) * max, true); frame(); };
addEventListener("message", (e) => { if (e.data && e.data.type === "ride-scrub") ride.scrub(+e.data.p || 0); });

/* ── THE DOT ── */
function cursor() {
  if (!matchMedia("(hover: hover)").matches || REDUCE && false) return;
  const c = document.createElement("div"); c.id = "cur"; c.innerHTML = "<span></span>"; document.body.appendChild(c);
  let x = -100, y = -100, cx = -100, cy = -100;
  addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest && e.target.closest("[data-cur]");
    c.classList.toggle("big", !!t); if (t) c.firstChild.textContent = t.dataset.cur;
    const b = e.target.closest && e.target.closest("[data-reel]");
    if (b) { const R = ride.reel(b); if (R) R.start(); }
  });
  document.addEventListener("pointerout", (e) => {
    const b = e.target.closest && e.target.closest("[data-reel]");
    if (b && !(e.relatedTarget && b.contains(e.relatedTarget)) && b.__reel && !b.classList.contains("playing")) b.__reel.stop();
  });
  const loop = () => { cx = lerp(cx, x, 0.22); cy = lerp(cy, y, 0.22); c.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)"; requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}

ride.start = (opts) => {
  const o = opts || {};
  if (o.frame) ride.hooks.push(o.frame);
  if (o.pre) ride.pre.push(o.pre);
  if (o.measure) ride.measures.push(o.measure);
  if (!REDUCE && Q.get("smooth") !== "0" && window.Lenis && !ride.flat) {
    ride.lenis = new Lenis({ lerp: o.lerp || 0.085, smoothWheel: true, wheelMultiplier: 1 });
    ride.lenis.on("scroll", frame);
    const raf = (t) => { ride.lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  addEventListener("scroll", () => { if (!ride.lenis) frame(); }, { passive: true });
  let rt = 0; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(measure, 120); }, { passive: true });
  if (o.cursor !== false) cursor();
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  addEventListener("load", measure);
  if (Q.get("p")) { const go = () => ride.scrub(+Q.get("p")); requestAnimationFrame(go); setTimeout(go, 400); addEventListener("load", go); }
  return ride;
};
window.Ride = ride;
})();
