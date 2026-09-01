#!/usr/bin/env python3
"""Assemble public/lab/board.html from the homepage lab.

    npm run board:page

The board is the homepage opened in every direction, so it does not
own its own copy of the homepage: the rail's reel machinery and the
masthead's burn are LIFTED OUT OF public/lab/pressing-home.html here,
function for function, and the stylesheet is lifted by
build-board-thumbs.mjs. Tune the lab, re-run both, and the board
follows. Nothing about the homepage is retyped in the board.

The two blocks are found by their own first and last lines rather than
by line number, so an edit above them in the lab does not silently
lift the wrong code. If a marker moves, this fails loudly.
"""
import io, sys

lab = io.open("public/lab/pressing-home.html", encoding="utf-8").read().split("\n")

def block(first_pred, last_pred, what):
    try:
        a = next(i for i, l in enumerate(lab) if first_pred(l))
        b = next(i for i, l in enumerate(lab[a:], a) if last_pred(l))
    except StopIteration:
        sys.exit("assemble-board: could not find the %s block in the lab" % what)
    return "\n".join(lab[a:b + 1])

# the reel: SZ_CREAM through the close of szStart
sz_a = next(i for i, l in enumerate(lab) if l.strip().startswith("const SZ_CREAM"))
sz_s = next(i for i, l in enumerate(lab[sz_a:], sz_a) if l.strip() == "step();")
sz_e = next(i for i, l in enumerate(lab[sz_s:], sz_s) if l.rstrip() == "  };")
sz = "\n".join(lab[sz_a:sz_e + 1])

# the burn, its whole IIFE
burn = block(lambda l: "the burn, lifted from Masthead.tsx" in l,
             lambda l: l.rstrip() == "})();", "burn")

for name, body in (("reel", sz), ("burn", burn)):
    if len(body.split("\n")) < 20:
        sys.exit("assemble-board: the %s block came back too short" % name)

head = r'''<!doctype html>
<html lang="en" class="rh-home">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>The board · lab</title>
<!--
  ── THE BOARD: the homepage, opened in every direction ──────────────
  The spec for the homepage's content region growing two axes. The
  brief, in the owner's words: keep everything — the rail, the burn
  bar, the statement, the columns' spacing — and expand the ability to
  scroll up and down and left and right.

  IT BORROWS THE HOMEPAGE RATHER THAN IMITATING IT. board-shell.css is
  the LAB's own <style> block, lifted verbatim by the generator, so the
  burn pill, the drawer rail's chip clip and 0.56s curve, the tile
  frame, the caption and the standing rules are the same objects with
  the same numbers — not a lookalike that drifts. The rail's reel and
  the masthead's burn are lifted the same way, function for function.
  Tune the lab, run `npm run board`, and this follows.

  TWO AXES, TWO TEMPERAMENTS:

    UP AND DOWN IS FREE. The columns scroll with momentum the way the
    homepage does, and the deal wraps, so there is no bottom.

    LEFT AND RIGHT IS PAGED. A drag or a sideways scroll brings in the
    NEXT column: it eases into place and snaps onto the grid, one
    module at a time. The structure is what keeps 544 pieces reading
    as an index rather than as weather.

  WHAT FILLS IT: every image from every study, captioned with that
  study's own name and category line; the board's pulls; the kept
  lines. The rail's five categories filter IN PLACE — the rest recedes
  to a ghost, so what you watch is subtraction, not a new page.

  MECHANISM
  - Nothing is measured for layout. build-board-thumbs.mjs records
    every file's ratio, so the field is computed before an image
    loads. Only tiles near the viewport exist.
  - Periodic in both axes; ?seed=N re-deals.
  - 384px webp thumbs. NEVER the plates: 388MB there, 7.8MB here.
-->
<link rel="stylesheet" href="board-shell.css">
<script src="board-data.js"></script>
<style>
  /* ── what the board adds to the homepage's own stylesheet ──────────
     Only geometry. Every treatment above this line is the lab's. */
  html, body { height: 100%; overflow: hidden; }
  body { background: #fff; }

  /* the masthead stops being sticky, because nothing scrolls */
  #nav { position: fixed; left: 0; right: 0; top: 0; }

  /* the rail: the homepage's note column, held on the left */
  #railwrap {
    position: fixed; z-index: 20;
    left: var(--gut); top: calc(var(--nav) + 26px);
    width: var(--ix-note-w, 180px);
  }

  /* the field: everything right of the rail's column */
  #field {
    position: fixed; top: 0; bottom: 0; right: 0;
    left: calc(var(--gut) + var(--ix-note-w, 180px) + var(--ixgap));
    overflow: hidden; touch-action: none; cursor: grab;
  }
  #field.dragging { cursor: grabbing; }
  #plane { position: absolute; left: 0; top: 0; will-change: transform; }

  /* ── the standing rules ────────────────────────────────────────────
     The homepage's own geometry: they begin --cover-air below the top
     and run to the bottom, so they never reach the masthead. Their own
     layer rather than plane children, because they are fixed in Y and
     panned in X; both layers take a transform in the same frame, so
     they are composited together and cannot drift apart the way a
     painted background did. */
  #rules {
    position: absolute; left: 0; right: 0;
    top: var(--cover-air, 50px); bottom: 0;
    pointer-events: none; will-change: transform;
  }
  #rules i { position: absolute; top: 0; bottom: 0; width: 1px;
    background: rgba(0, 0, 0, 0.13); }

  /* the tiles ARE .fd-it cards — frame, radius, curtain, drift and
     caption all come from the stylesheet above */
  .tile { position: absolute; }
  .tile .fd-it { width: 100%; }
  .tile.hangR .lbl { text-align: right; }

  /* a kept line: the board's own treatment, no frame */
  .tile.quote {
    font-size: 17px; line-height: 1.42; font-weight: 500;
    letter-spacing: -0.01em;
  }
  .tile.quote .att {
    display: block; padding-top: 10px;
    font-size: 9px; letter-spacing: 0.07em; text-transform: uppercase;
    opacity: 0.45;
  }
  /* the statement, at the field's origin — the cover's own setting */
  .tile.statement {
    font-size: clamp(20px, 2.2vw, 30px); font-weight: 600;
    line-height: 1.22; letter-spacing: -0.04em;
  }
  .tile.statement .q { color: rgba(0, 0, 0, 0.42); }
  .tile.statement u { text-decoration-color: rgba(0, 0, 0, 0.22);
    text-underline-offset: 5px; text-decoration-thickness: 1.5px; }

  /* THE FILTER THAT IS ON STAYS ON. A drawer closes when the pointer
     leaves it, so without this the only sign of an active filter was
     the field itself — the chip went back to grey while half the board
     was still a ghost. Ink, the same flood the open row takes, so the
     rail says which question the field is answering. */
  #rdrawer .rrow.picked { background: var(--ink); color: #fff; }
  #rdrawer .rrow.picked .rslash { color: #fff; }

  /* the subtraction: recede in place */
  #plane .tile { transition: opacity 0.5s ease; }
  #plane .tile.dim { opacity: 0.05; pointer-events: none; }

  #home {
    position: fixed; right: var(--gut); bottom: 22px; z-index: 20;
    border: 0; font: inherit; cursor: pointer;
    font-size: 13px; font-weight: 500; padding: 9px 16px;
    border-radius: 12px; background: var(--ink); color: #fff;
    opacity: 0; pointer-events: none; transform: translateY(6px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  #home[data-on] { opacity: 1; pointer-events: auto; transform: none; }

  /* ── PHONES: THE RAIL LIES DOWN ────────────────────────────────────
     There is no note column on a phone, so the drawer stops being a
     column of drawers and becomes a strip of chips along the bottom
     edge — the shape the homepage's own folded rail ends up as. The
     bodies close for good here: a drawer opening upward over the work
     would cover the thing it is filtering, so a tap filters outright,
     which is what the strip is for.

     The clip has to go with them. --hug is measured against a
     full-width column and there is no column now; left on, every chip
     would be clipped to a fraction of a width it never had. */
  @media (max-width: 760px) {
    #railwrap {
      left: 0; right: 0; width: auto; top: auto; bottom: 0;
      padding: 10px 16px calc(10px + env(safe-area-inset-bottom, 0px));
      background: linear-gradient(to top,
        rgba(255, 255, 255, 0.96) 62%, rgba(255, 255, 255, 0));
      overflow-x: auto; scrollbar-width: none;
    }
    #railwrap::-webkit-scrollbar { display: none; }
    #rdrawer { flex-direction: row; gap: 8px; width: max-content; }
    #rdrawer .rrow { clip-path: none; border-radius: 12px;
      flex: none; }
    #rdrawer .rrow .rhead { white-space: nowrap; font-size: 12px;
      padding: 8px 13px; }
    #rdrawer .rbody, #rdrawer .rgap { display: none; }
    #field { left: 0; }
    #rules { display: none; }
    #home { right: 16px; bottom: 74px; }
  }
</style>
</head>
<body>

<nav id="nav">
  <div id="navBurn" aria-hidden="true"></div>
  <div class="ask">
    <input id="query" type="text" placeholder="Ask the house."
      autocomplete="off" autocorrect="off" spellcheck="false"
      aria-label="Ask the house" />
  </div>
  <a data-mark href="/" class="mark" aria-label="Reckon House Staples">Reckon<i>*</i>House<i>*</i>Staples</a>
  <a class="meta" href="mailto:hello@reckon.house">hello@reckon.house</a>
</nav>

<!-- the melt: the burn pill's displacement, lifted from the masthead -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="mastheadMelt" x="-20%" y="-20%" width="140%" height="140%"
    color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.015 0.025"
      numOctaves="3" seed="8" result="noise" />
    <feGaussianBlur in="noise" stdDeviation="2" result="smoothNoise" />
    <feDisplacementMap in="SourceGraphic" in2="smoothNoise" scale="18"
      xChannelSelector="R" yChannelSelector="G" />
  </filter>
</svg>

<div id="railwrap" class="ixnotes"><div class="blk rdrawer" id="rdrawer"></div></div>

<div id="field">
  <div id="rules"></div>
  <div id="plane"></div>
</div>

<button type="button" id="home">Back to start</button>

<script>
/* the site's own seeded LCG, so a seed is a field */
const mkRnd = (s0) => { let s = s0;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; };
const seed = parseInt(new URLSearchParams(location.search).get("seed") || "7", 10);
const rnd = mkRnd(Number.isFinite(seed) ? seed : 7);
const REDUCE = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
/* the lab's stub, and honest here for the same reason: these thumbs
   are already a 384px tier, which is the candidate a 128px stamp
   would have picked anyway */
const tileSrcSet = () => "";
let alive = true;
/* The burn's own input hook, from the driver. There it listens on
   whatever is scrolling; here nothing scrolls — the board pans — so
   the pan reports itself and the pill heats on the same signal. */
const burnPoke = [];
const onScrollAnywhere = (fn) => burnPoke.push(fn);
const pokeBurn = () => burnPoke.forEach((fn) => fn());

const GROUPS = window.BOARD_GROUPS || {};

/* ── the homepage's measures, read from its own tokens ─────────────
   --gut, --ix-note-w and --ixgap come from board-shell.css, so the
   rail's column and the gutters are the homepage's to the pixel. Two
   columns of work beside the rail on a desktop, one on a phone. */
const cs = getComputedStyle(document.documentElement);
const px = (name, fb) => parseFloat(cs.getPropertyValue(name)) || fb;
const PHONE = innerWidth <= 760;
const GUT = px("--gut", 50), NOTE_W = px("--ix-note-w", 180);
const IXGAP = px("--ixgap", 40);
const VISIBLE = PHONE ? 1 : 2;
const FIELD_W = PHONE ? innerWidth : innerWidth - (GUT + NOTE_W + IXGAP);
const GAP = PHONE ? 20 : IXGAP;
/* half gutter, column, gutter, column, half gutter: VISIBLE gaps, not
   VISIBLE+1, or the resting edge lands mid-tile */
const COL = (FIELD_W - GAP * VISIBLE) / VISIBLE;
const MOD_X = COL + GAP;
const PH = Math.max(5600, innerHeight * 6);
const AIR_MIN = 120, AIR_MAX = 340;
const air = () => AIR_MIN + rnd() * (AIR_MAX - AIR_MIN);
const SHARES = PHONE ? [0.82, 0.92, 1] : [0.55, 0.66, 0.78, 0.9, 1];
const CAP_H = 30;

/* ── the corpus ── */
const QUOTES = [
  { text: "Came up on a tornado, sunlight in the sky\nI went around all day with the moon sticking in my eye", att: "Don Van Vliet, Captain Beefheart" },
  { text: "And this old man in front of me wearing canes and ruby rings\nIt's like containing an explosion when he sings\nWith every chance to set himself on fire\nHe just ends up doing the same thing", att: "Jack White" },
  { text: "What you got ain't nothin' new. This country is hard on people. You can't stop what's coming. It ain't all waiting on you. That's vanity.", att: "Cormac McCarthy" },
];
const imgs = (window.BOARD_ITEMS || []).slice();
for (let i = imgs.length - 1; i > 0; i--) {
  const j = Math.floor(rnd() * (i + 1));
  [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
}
const items = imgs.map((it) => ({ kind: "img", ...it }));
QUOTES.forEach((q, k) => {
  items.splice(Math.min(items.length, 45 + k * 190), 0, { kind: "quote", ...q });
});

/* ── the two text shapes, measured once — text has no declared ratio ── */
const FONT = "'Avenir Next','Helvetica Neue',Helvetica,Arial,sans-serif";
const meas = document.createElement("div");
meas.style.cssText = "position:absolute;left:-9999px;top:0;width:" + COL +
  "px;font-family:" + FONT +
  ";font-size:17px;line-height:1.42;font-weight:500;letter-spacing:-0.01em;white-space:pre-line";
document.body.appendChild(meas);
const quoteH = (q) => {
  meas.textContent = "“" + q.text + "”";
  return meas.getBoundingClientRect().height + 28;
};

const STATEMENT_HTML =
  "I'm Jeremy Prasatik. I make things across <u>brand</u>, <u>product</u>, and <u>place</u>. " +
  "<span class=\"q\"><u>Apps</u> and <u>ecommerce</u>, <u>campaigns</u> and <u>brand systems</u>, " +
  "<u>photography and art direction</u>, <u>custom interiors</u>, <u>AI tools</u>.</span> " +
  "Or just ask me:<br><u>“Marble surfaces”</u>";
const smeas = document.createElement("div");
smeas.className = "tile statement";
smeas.style.cssText = "position:absolute;left:-9999px;top:0;width:" + COL + "px";
smeas.innerHTML = STATEMENT_HTML;
document.body.appendChild(smeas);
const STATEMENT_H = smeas.getBoundingClientRect().height;
smeas.remove();

/* ── placement ── */
const tiles = [];
/* Content starts clear of the masthead. It still SCROLLS under it —
   that is what the burn pill is for — but nothing should be born
   beneath the bar, least of all the statement. */
const NAV_H = px("--nav", 54);
let col = 0, y = NAV_H + (PHONE ? 30 : 46), prevShare = -1;
tiles.push({ kind: "statement", x: 0, y, w: COL, h: STATEMENT_H });
y += STATEMENT_H + air();
for (const it of items) {
  let w = COL, h, hang = 0;
  if (it.kind === "quote") h = quoteH(it);
  else {
    let share, guard = 0;
    do { share = SHARES[Math.floor(rnd() * SHARES.length)]; }
    while (Math.abs(share - prevShare) < 0.12 && guard++ < 8);
    prevShare = share;
    w = Math.round(COL * share);
    h = Math.round(w * (it.h / it.w));
    if (h > COL * 1.6) h = Math.round(COL * 1.6);
    if (w < COL && rnd() > 0.6) hang = 1;
    if (GROUPS[it.g]) h += CAP_H;
  }
  if (y + h > PH - AIR_MIN) { col += 1; y = air() * 0.5; prevShare = -1; }
  tiles.push({ ...it, x: col * MOD_X + (hang ? COL - w : 0), y, w, h, hang });
  y += h + air();
}
const COLS = col + 1;
const PW = COLS * MOD_X;
meas.remove();

/* ── the two temperaments ── */
const field = document.getElementById("field");
const plane = document.getElementById("plane");
const rulesEl = document.getElementById("rules");
let colIdx = 0;
const restX = (i) => i * MOD_X - GAP / 2;
const START = { x: restX(0), y: 0 };
const cur = { ...START }, tgt = { ...START };
let velY = 0;
let dragging = false, lastMount = { x: 1e9, y: 1e9 };
const pageTo = (i) => { colIdx = i; tgt.x = restX(i); };

let hCool = 0;
field.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2) {
    const now = performance.now();
    if (now - hCool > 420 && Math.abs(e.deltaX) > 24) {
      pageTo(colIdx + Math.sign(e.deltaX));
      hCool = now;
    }
  } else { tgt.y += e.deltaY; velY = 0; }
}, { passive: false });

let pxx = 0, pyy = 0, moved = 0;
const trail = [];
field.addEventListener("pointerdown", (e) => {
  dragging = true; moved = 0;
  pxx = e.clientX; pyy = e.clientY;
  trail.length = 0; velY = 0;
  field.classList.add("dragging");
  field.setPointerCapture(e.pointerId);
});
field.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const dx = e.clientX - pxx, dy = e.clientY - pyy;
  pxx = e.clientX; pyy = e.clientY;
  moved += Math.abs(dx) + Math.abs(dy);
  tgt.x -= dx; tgt.y -= dy;
  trail.push({ dx, dy, t: performance.now() });
  if (trail.length > 6) trail.shift();
});
const release = () => {
  if (!dragging) return;
  dragging = false;
  field.classList.remove("dragging");
  const now = performance.now();
  const recent = trail.filter((m) => now - m.t < 90);
  const fx = recent.reduce((s, m) => s + m.dx, 0);
  const fy = recent.reduce((s, m) => s + m.dy, 0);
  let i = Math.round((tgt.x + GAP / 2) / MOD_X);
  if (fx < -30) i += 1;
  if (fx > 30) i -= 1;
  pageTo(i);
  velY = -fy * 1.6;
};
field.addEventListener("pointerup", release);
field.addEventListener("pointercancel", release);
field.addEventListener("click", (e) => {
  if (moved > 6) { e.stopPropagation(); e.preventDefault(); }
}, true);

/* ── the filter ── */
let MODE = null;
const matches = (t) => {
  if (!MODE) return true;
  if (t.kind === "statement") return true;
  if (MODE === "staples") return t.kind === "quote" || t.g === "inspiration";
  if (t.kind !== "img") return false;
  const g = GROUPS[t.g];
  return !!g && g.tags.includes(MODE);
};

/* ── the window ── */
const MARGIN_X = MOD_X * 0.8, MARGIN_Y = 560;
const live = new Map();
const arrive = REDUCE()
  ? { observe: (c) => c.classList.add("fd-on"), unobserve: () => {} }
  : new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("fd-on");
        arrive.unobserve(e.target);
      });
    }, { threshold: 0.02 });
const drifting = [];
function remount() {
  lastMount = { x: cur.x, y: cur.y };
  const x0 = cur.x - MARGIN_X, y0 = cur.y - MARGIN_Y;
  const x1 = cur.x + FIELD_W + MARGIN_X, y1 = cur.y + innerHeight + MARGIN_Y;
  const want = new Set();
  const fresh = [];
  for (let i = Math.floor(x0 / PW); i * PW < x1; i++) {
    for (let j = Math.floor(y0 / PH); j * PH < y1; j++) {
      for (let k = 0; k < tiles.length; k++) {
        const t = tiles[k];
        const gx = t.x + i * PW, gy = t.y + j * PH;
        if (gx + t.w < x0 || gx > x1 || gy + t.h < y0 || gy > y1) continue;
        const key = k + ":" + i + ":" + j;
        want.add(key);
        if (!live.has(key)) {
          const el = mount(t, gx, gy);
          live.set(key, el);
          const card = el.querySelector(".fd-it");
          if (card) fresh.push(card);
        }
      }
    }
  }
  for (const [key, el] of live) {
    if (!want.has(key)) { el.remove(); live.delete(key); }
  }
  /* the curtain: the homepage's own arrival observer, not a rAF pair.
     An IntersectionObserver fires on its own schedule, so a tile that
     mounts while the tab is throttled still opens when it is looked
     at; the rAF version left every frame shut on a parked page. */
  if (fresh.length) {
    if (window.armDrift) armDrift(fresh);
    fresh.forEach((c) => arrive.observe(c));
  }
  /* the standing rules: one per gutter the window can see */
  const kids = rulesEl.children;
  let n = 0;
  for (let c = Math.floor(x0 / MOD_X) - 1; c * MOD_X < x1 + MOD_X; c++) {
    const rx = c * MOD_X - GAP / 2;
    if (rx < x0 - 2 || rx > x1 + 2) continue;
    let el = kids[n];
    if (!el) { el = document.createElement("i"); rulesEl.appendChild(el); }
    el.style.left = rx + "px";
    n += 1;
  }
  while (kids.length > n) rulesEl.removeChild(kids[kids.length - 1]);
}
function mount(t, gx, gy) {
  const el = document.createElement("div");
  el.className = "tile";
  el.style.cssText = "left:" + gx + "px;top:" + gy + "px;width:" + t.w + "px";
  if (t.hang) el.classList.add("hangR");
  if (!matches(t)) el.classList.add("dim");
  if (t.kind === "statement") {
    el.classList.add("statement");
    el.innerHTML = STATEMENT_HTML;
  } else if (t.kind === "quote") {
    el.classList.add("quote");
    el.textContent = "“" + t.text + "”";
    const att = document.createElement("span");
    att.className = "att";
    att.textContent = "· " + t.att;
    el.appendChild(att);
  } else {
    /* a real index card: .fd-it > .shot > .plate > img, plus .lbl.
       The frame, the radius, the arrival curtain, the drift slack and
       the caption's setting are all the stylesheet's. */
    const g = GROUPS[t.g];
    const card = document.createElement("a");
    card.className = "fd-it k-work";
    card.style.setProperty("--w", "100%");
    const shot = document.createElement("span");
    shot.className = "shot";
    shot.style.setProperty("--ar", t.w + " / " + (t.h - (g ? CAP_H : 0)));
    const plate = document.createElement("span");
    plate.className = "plate";
    const img = document.createElement("img");
    img.src = encodeURI(t.t);
    img.alt = "";
    img.decoding = "async";
    plate.appendChild(img);
    shot.appendChild(plate);
    card.appendChild(shot);
    if (g) {
      const lbl = document.createElement("span");
      lbl.className = "lbl";
      lbl.textContent = g.t + " ";
      const sub = document.createElement("span");
      sub.className = "sub";
      sub.textContent = g.s;
      lbl.appendChild(sub);
      card.appendChild(lbl);
    }
    el.appendChild(card);
  }
  plane.appendChild(el);
  return el;
}

/* ── the loop ── */
const home = document.getElementById("home");
function tick() {
  requestAnimationFrame(tick);
  if (document.hidden) return;
  if (!dragging && Math.abs(velY) > 0.1) { tgt.y += velY; velY *= 0.93; }
  /* x eases a touch slower than y follows — the arriving column gets
     its glide without the scroll feeling detached */
  if (Math.abs(tgt.x - cur.x) > 0.5 || Math.abs(tgt.y - cur.y) > 0.5) pokeBurn();
  cur.x += (tgt.x - cur.x) * 0.11;
  cur.y += (tgt.y - cur.y) * 0.16;
  plane.style.transform = "translate3d(" + (-cur.x) + "px," + (-cur.y) + "px,0)";
  /* the rules pan in X only, in the same frame, on the same thread */
  rulesEl.style.transform = "translate3d(" + (-cur.x) + "px,0,0)";
  if (Math.abs(cur.x - lastMount.x) > 100 || Math.abs(cur.y - lastMount.y) > 100)
    remount();
  const far = Math.abs(cur.x - START.x) > MOD_X * 1.5 ||
    Math.abs(cur.y - START.y) > innerHeight * 1.4;
  if (far !== home.hasAttribute("data-on"))
    far ? home.setAttribute("data-on", "") : home.removeAttribute("data-on");
}
home.addEventListener("click", () => { pageTo(0); tgt.y = START.y; velY = 0; });

/* ── THE DRIFT, lifted from the driver ─────────────────────────────
   Every image is cut taller than the frame that clips it, and walks
   the slack as its card crosses the glass. Verbatim except the frame
   of reference: on the homepage the card moves and the viewport is
   still; here the viewport is still and the plane moves under it. The
   rects are the same either way, which is why the code did not have
   to change.

   The slack itself is the stylesheet's --drift, read back off the
   image, so the two can never disagree. */
(() => {
  if (REDUCE()) return;
  const liveShots = new Set();
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) { liveShots.add(e.target); return; }
      liveShots.delete(e.target);
      const img = e.target.querySelector("img");
      if (img) img.style.transform = "";
    });
  }, { rootMargin: "12% 0px" });
  window.armDrift = (els) => els.forEach((el) => {
    const shot = el.querySelector && el.querySelector(".shot");
    if (shot) io.observe(shot);
  });
  const step = () => {
    requestAnimationFrame(step);
    if (document.hidden || !liveShots.size) return;
    const h = innerHeight;
    liveShots.forEach((shot) => {
      const img = shot.querySelector("img");
      if (!img || img.tagName !== "IMG") return;
      const r = shot.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (h - r.top) / (h + r.height)));
      const slack = Math.max(0, img.offsetHeight - shot.offsetHeight);
      img.style.transform =
        "translate3d(0," + (-p * slack).toFixed(2) + "px,0)";
    });
  };
  requestAnimationFrame(step);
})();

'''

rail = r'''
/* ── THE RAIL, the drawer the homepage already had ──────────────────
   Same DOM, same classes, same stylesheet: .rrow clipped to --hug at
   rest and flooding to ink on open, .rbody a 0fr→1fr grid, the pad's
   type 90ms behind the structure. Info and Connect open their notes;
   the five categories open a stamp-size reel of that category's own
   pictures and, on a second tap, filter the field.

   --hug is MEASURED per row, as on the homepage, because every label
   is a different length and a guessed percentage clips a word. */
const RAIL_NOTES = {
  info: [
    ["About", "Creative technologist. AI development. Brand systems. Digital design. Interior design. Independent, Texas. Design and build. I love the work."],
    ["News", "Awwwards Honors, 2026. Faux Reel released as an open repo. 28 case studies online."],
    ["Stack", "Coffee. Music. Ideas. To do lists. Claude. IPAs, and lagers, and stouts, and ales."],
  ],
  connect: [[null, "hello@reckon.house"]],
};
const FILTERS = [
  ["Digital Experiences", "digital", "Sites, stores and platforms, designed and shipped."],
  ["App Development", "app", "Native tools and AI products, built end to end."],
  ["Campaign/Creative", "creative", "Art direction and campaigns for retail's big names."],
  ["Interiors", "interiors", "Rooms designed like products, down to the hardware."],
  ["Staples", "staples", "Saved pictures and kept lines. None of it mine."],
];

const drawer = document.getElementById("rdrawer");
const rrows = [];
const closeRows = () => rrows.forEach((r) => r.classList.remove("open"));
const openOnly = (r) => rrows.forEach((o) => o.classList.toggle("open", o === r));
const mkRow = (label, slash) => {
  const r = document.createElement("div");
  r.className = "rrow";
  const h = document.createElement("button");
  h.type = "button";
  h.className = "rhead";
  const ink = document.createElement("span");
  ink.className = "rink";
  if (slash) {
    const sl = document.createElement("span");
    sl.className = "rslash";
    sl.textContent = "/";
    ink.appendChild(sl);
    ink.appendChild(document.createTextNode(" "));
  }
  ink.appendChild(document.createTextNode(label));
  h.appendChild(ink);
  const body = document.createElement("div");
  body.className = "rbody";
  const inner = document.createElement("div");
  const pad = document.createElement("div");
  pad.className = "rpad";
  inner.appendChild(pad);
  body.appendChild(inner);
  r.appendChild(h);
  r.appendChild(body);
  drawer.appendChild(r);
  rrows.push(r);
  r.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") openOnly(r);
  });
  return { r, h, pad };
};
const sub = (pad, cap, text) => {
  if (cap) {
    const c = document.createElement("div");
    c.className = "rsub";
    c.textContent = cap;
    pad.appendChild(c);
  }
  const t = document.createElement("div");
  t.className = "rtxt";
  t.textContent = text;
  pad.appendChild(t);
  return t;
};

{
  const { r, h, pad } = mkRow("Info", true);
  RAIL_NOTES.info.forEach(([c, t]) => sub(pad, c, t));
  h.addEventListener("click", () =>
    r.classList.contains("open") ? closeRows() : openOnly(r));
}
{
  const { r, h, pad } = mkRow("Connect", true);
  const t = sub(pad, null, "hello@reckon.house");
  t.innerHTML = "<a class=\"rmail\" href=\"mailto:hello@reckon.house\">hello@reckon.house</a>";
  h.addEventListener("click", () =>
    r.classList.contains("open") ? closeRows() : openOnly(r));
}
const gap = document.createElement("div");
gap.className = "rgap";
drawer.appendChild(gap);

/* which pictures a category's stamp cuts through: the board's own
   thumbs for the studies that carry the tag, one per study so a stamp
   is a survey rather than a slideshow of one project */
const framesFor = (tag) => {
  const seen = new Set(), out = [];
  for (const it of (window.BOARD_ITEMS || [])) {
    const g = GROUPS[it.g];
    const hit = tag === "staples" ? it.g === "inspiration"
      : g && g.tags.includes(tag);
    if (!hit || seen.has(it.g)) continue;
    seen.add(it.g);
    out.push(it.t);
    if (out.length >= 8) break;
  }
  return out;
};

const catReels = [];
FILTERS.forEach(([label, tag, desc]) => {
  const { r, h, pad } = mkRow(label, false);
  pad.classList.add("rcat");
  const box = document.createElement("div");
  box.className = "rreel sz-stage";
  const d = document.createElement("div");
  d.className = "rdesc";
  d.textContent = desc;
  pad.appendChild(box);
  pad.appendChild(d);
  const rl = { row: r, box, frames: framesFor(tag), timer: null };
  szStage(rl);
  szScrub(rl);
  catReels.push(rl);
  rl.mo = new MutationObserver(() => {
    if (rl.row.classList.contains("open")) szStart(rl);
    else szStop(rl);
  });
  rl.mo.observe(rl.row, { attributes: true, attributeFilter: ["class"] });
  /* OPEN FIRST, FILTER SECOND — the rail's own rule on touch, and on
     a mouse the hover has already opened it so one click filters. */
  const ask = () => setMode(MODE === tag ? null : tag);
  h.addEventListener("click", () => {
    /* No drawer on a phone: the strip has nowhere to open to, so the
       tap is the filter. On a pointer the hover has already opened the
       row, so one click still filters there too. */
    if (PHONE || r.classList.contains("open")) { ask(); return; }
    openOnly(r);
  });
  pad.addEventListener("click", ask);
  r.dataset.tag = tag;
});

/* every chip stops at its own words */
const hug = () => {
  if (PHONE) return;
  drawer.querySelectorAll(".rrow").forEach((r) => {
    const ink = r.querySelector(".rink");
    const head = r.querySelector(".rhead");
    if (!ink || !head) return;
    const full = r.getBoundingClientRect().width;
    if (!full) return;
    const pad = parseFloat(getComputedStyle(head).paddingLeft) || 12;
    const want = ink.getBoundingClientRect().width + pad * 2;
    const v = Math.max(0, Math.min(92, ((full - want) / full) * 100));
    r.style.setProperty("--hug", v.toFixed(2) + "%");
  });
};
hug();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(hug);
addEventListener("resize", hug, { passive: true });
drawer.addEventListener("pointerleave", closeRows);

function setMode(mode) {
  MODE = mode;
  rrows.forEach((r) => {
    if (!r.dataset.tag) return;
    r.classList.toggle("picked", r.dataset.tag === mode);
  });
  for (const [key, el] of live) {
    const k = parseInt(key, 10);
    el.classList.toggle("dim", !matches(tiles[k]));
  }
}

window.__b = { cur, tgt, START, pageTo, get colIdx() { return colIdx; },
  MOD_X, COL, GAP, COLS, PW, PH, setMode, get MODE() { return MODE; } };
addEventListener("resize", () => remount(), { passive: true });
remount();
requestAnimationFrame(tick);
</script>

</body>
</html>
'''

out = head + sz + "\n" + burn + "\n" + rail
io.open("public/lab/board.html", "w", encoding="utf-8").write(out)
print("board: public/lab/board.html — %d lines (reel %d, burn %d, lifted from the lab)"
      % (len(out.split("\n")), len(sz.split("\n")), len(burn.split("\n"))))
