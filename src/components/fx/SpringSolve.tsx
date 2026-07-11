"use client";

/**
 * SpringSolve — a persistent "desk surface" of worked physics behind the
 * homepage. A fixed, full-viewport, edge-to-edge layer the whole page
 * scrolls over: a dense scatter of mechanics + E&M worked by hand, each
 * fragment drawn stroke-by-stroke (single-stroke Hershey paths via
 * stroke-dashoffset) on its OWN timeline — most loop (fade out, redraw) on
 * independent periods, a few "hero" graphs/diagrams run larger. Faint pencil
 * on the warm graph paper, behind all content.
 *
 * Homepage only. Responsive (lighter, larger on mobile).
 * prefers-reduced-motion shows everything drawn, no motion.
 */

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { hersheyGlyphs } from "@/data/hershey-glyphs";

type Pt = [number, number];
type Stroke = Pt[];

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Lay text into jittered single-stroke polylines (up = negative y). '^' and
// '_' raise/lower-and-shrink the next character (super/subscript).
function eqStrokes(text: string, rng: () => number, unit = 1.25, jit = 0.85): Stroke[] {
  const out: Stroke[] = [];
  let pen = 0;
  for (let i = 0; i < text.length; i++) {
    let ch = text[i];
    let sc = 1;
    let dy = 0;
    if (ch === "^") { ch = text[++i]; sc = 0.66; dy = -11 * unit; }
    else if (ch === "_") { ch = text[++i]; sc = 0.66; dy = 5 * unit; }
    const g = hersheyGlyphs[ch];
    if (!g) { pen += 13 * unit * sc; continue; }
    const gy = (rng() - 0.5) * 1.0 * unit;
    for (const s of g.s) {
      out.push(
        s.map(([px, py]) => [
          pen + (px - g.l) * unit * sc + (rng() - 0.5) * jit * unit,
          // Glyph data is "negative = top" (same convention as the diagram
          // builders), so use py directly. Negating it flipped all text
          // upside-down (A→∀, /→\).
          py * unit * sc + dy + gy + (rng() - 0.5) * jit * unit,
        ]) as Stroke,
      );
    }
    pen += (g.r - g.l) * unit * sc;
  }
  return out;
}

// ── Diagram builders (local coords, up = negative y; all accept rng) ──────
function springD(rng: () => number): Stroke[] {
  const j = () => (rng() - 0.5) * 2.4;
  const s: Stroke[] = [];
  const top = -52, bot = 52;
  s.push([[0, top], [0, bot]]);
  for (let y = top + 6; y < bot; y += 15) s.push([[0, y], [-15, y + 15]]);
  const coil: Stroke = [[0, 0]];
  const endX = 180, n = 9;
  for (let i = 0; i <= n; i++) coil.push([(endX * (i + 0.5)) / (n + 1) + j(), (i % 2 ? -16 : 16) + j()]);
  coil.push([endX, 0]);
  s.push(coil);
  const bs = 56;
  s.push([[endX, -28], [endX + bs, -28], [endX + bs, 28], [endX, 28], [endX, -28]]);
  const ax0 = endX + bs + 12, ax1 = ax0 + 60;
  s.push([[ax0, 0], [ax1, 0]]); s.push([[ax1, 0], [ax1 - 11, -7]]); s.push([[ax1, 0], [ax1 - 11, 7]]);
  return s;
}
function dampedGraph(): Stroke[] {
  const s: Stroke[] = [];
  const x1 = 360, amp = 70, cyc = 3.2;
  s.push([[-14, 0], [x1 + 20, 0]]); s.push([[x1 + 20, 0], [x1 + 7, -6]]); s.push([[x1 + 20, 0], [x1 + 7, 6]]);
  s.push([[0, amp + 18], [0, -amp - 22]]); s.push([[0, -amp - 22], [-6, -amp - 9]]); s.push([[0, -amp - 22], [6, -amp - 9]]);
  const env = (t: number) => Math.exp(-1.7 * t);
  const curve: Stroke = [];
  for (let i = 0; i <= 160; i++) { const t = i / 160; curve.push([x1 * t, -amp * env(t) * Math.cos(t * cyc * 2 * Math.PI)]); }
  s.push(curve);
  const up: Stroke = []; for (let i = 0; i <= 40; i++) { const t = i / 40; up.push([x1 * t, -amp * env(t)]); }
  s.push(up);
  return s;
}
function cube(): Stroke[] {
  const a = 64, dx = 28, dy = -22;
  return [
    [[0, 0], [a, 0], [a, -a], [0, -a], [0, 0]],
    [[0, -a], [dx, -a + dy], [a + dx, -a + dy], [a, -a]],
    [[a, 0], [a + dx, dy], [a + dx, -a + dy], [a, -a]],
  ];
}
function projectile(): Stroke[] {
  const s: Stroke[] = [];
  const W = 280, H = 96;
  s.push([[-16, 0], [W + 20, 0]]);
  const arc: Stroke = [];
  for (let i = 0; i <= 60; i++) { const t = i / 60; arc.push([W * t, -H * 4 * t * (1 - t)]); }
  s.push(arc);
  const ang = (52 * Math.PI) / 180, L = 78;
  const vx = L * Math.cos(ang), vy = -L * Math.sin(ang);
  s.push([[0, 0], [vx, vy]]);
  s.push([[vx, vy], [vx - 12 * Math.cos(ang - 0.4), vy + 12 * Math.sin(ang - 0.4)]]);
  s.push([[vx, vy], [vx - 12 * Math.cos(ang + 0.4), vy + 12 * Math.sin(ang + 0.4)]]);
  return s;
}
function pendulum(): Stroke[] {
  const s: Stroke[] = [];
  const th = 0.5, Ln = 90;
  const bx = Ln * Math.sin(th), by = Ln * Math.cos(th);
  s.push([[-18, 0], [18, 0]]);
  for (let x = -16; x < 16; x += 7) s.push([[x, 0], [x - 6, 7]]);
  s.push([[0, 0], [bx, by]]);
  const r = 9, bob: Stroke = [];
  for (let i = 0; i <= 16; i++) { const a = (i / 16) * 2 * Math.PI; bob.push([bx + r * Math.cos(a), by + r * Math.sin(a)]); }
  s.push(bob);
  const arc: Stroke = []; for (let i = 0; i <= 18; i++) { const a = -th + (2 * th * i) / 18; arc.push([(Ln + 12) * Math.sin(a), (Ln + 12) * Math.cos(a)]); }
  s.push(arc);
  return s;
}
function incline(): Stroke[] {
  const s: Stroke[] = [];
  const B = 150, Ht = 86;
  s.push([[0, 0], [B, 0], [B, -Ht], [0, 0]]);
  const t = 0.52, p0: Pt = [B * t, -Ht * t];
  const hyp = Math.hypot(B, Ht), along: Pt = [B / hyp, -Ht / hyp], norm: Pt = [-Ht / hyp, -B / hyp], bs = 26;
  const c1: Pt = [p0[0] + along[0] * bs, p0[1] + along[1] * bs];
  const c2: Pt = [c1[0] + norm[0] * bs, c1[1] + norm[1] * bs];
  const c3: Pt = [p0[0] + norm[0] * bs, p0[1] + norm[1] * bs];
  s.push([p0, c1, c2, c3, p0]);
  const gc: Pt = [(p0[0] + c2[0]) / 2, (p0[1] + c2[1]) / 2];
  s.push([gc, [gc[0], gc[1] + 40]]); s.push([[gc[0], gc[1] + 40], [gc[0] - 6, gc[1] + 30]]); s.push([[gc[0], gc[1] + 40], [gc[0] + 6, gc[1] + 30]]);
  return s;
}
function circuit(): Stroke[] {
  const s: Stroke[] = [];
  const W = 190, H = 110;
  s.push([[40, 0], [0, 0], [0, -H], [W, -H], [W, 0], [120, 0]]);
  const zz: Stroke = [[60, -H]];
  for (let i = 0; i < 6; i++) zz.push([66 + i * 12, -H + (i % 2 ? 9 : -9)]);
  zz.push([138, -H]);
  s.push(zz);
  s.push([[60, -10], [60, 10]]); s.push([[78, -6], [78, 6]]);
  return s;
}
function fieldLines(): Stroke[] {
  const s: Stroke[] = [];
  const r = 12;
  const circ: Stroke = []; for (let i = 0; i <= 16; i++) { const a = (i / 16) * 2 * Math.PI; circ.push([r * Math.cos(a), r * Math.sin(a)]); }
  s.push(circ);
  s.push([[-6, 0], [6, 0]]); s.push([[0, -6], [0, 6]]);
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * 2 * Math.PI;
    const x0 = (r + 5) * Math.cos(a), y0 = (r + 5) * Math.sin(a), x1 = (r + 32) * Math.cos(a), y1 = (r + 32) * Math.sin(a);
    s.push([[x0, y0], [x1, y1]]);
    s.push([[x1, y1], [x1 - 7 * Math.cos(a - 0.4), y1 - 7 * Math.sin(a - 0.4)]]);
    s.push([[x1, y1], [x1 - 7 * Math.cos(a + 0.4), y1 - 7 * Math.sin(a + 0.4)]]);
  }
  return s;
}

// Arrow (shaft + two head strokes) from (x0,y0) to (x1,y1).
function arrow(x0: number, y0: number, x1: number, y1: number, h = 10): Stroke[] {
  const a = Math.atan2(y1 - y0, x1 - x0);
  return [
    [[x0, y0], [x1, y1]],
    [[x1, y1], [x1 - h * Math.cos(a - 0.4), y1 - h * Math.sin(a - 0.4)]],
    [[x1, y1], [x1 - h * Math.cos(a + 0.4), y1 - h * Math.sin(a + 0.4)]],
  ];
}
function axes(x1: number, amp: number): Stroke[] {
  return [
    ...arrow(-14, 0, x1 + 18, 0, 7),
    ...arrow(0, amp + 16, 0, -amp - 20, 7),
  ];
}
function plot(fn: (t: number) => number, x1: number, n = 140): Stroke {
  const c: Stroke = [];
  for (let i = 0; i <= n; i++) { const t = i / n; c.push([x1 * t, fn(t)]); }
  return c;
}

function sineWave(): Stroke[] {
  const x1 = 320, amp = 48;
  return [...axes(x1, amp), plot((t) => -amp * Math.sin(t * 2.2 * 2 * Math.PI), x1)];
}
function parabola(): Stroke[] {
  const W = 130, H = 104, s: Stroke[] = [];
  s.push(...arrow(-W - 16, 0, W + 16, 0, 7)); s.push(...arrow(0, 24, 0, -H - 18, 7));
  const c: Stroke = []; for (let i = 0; i <= 80; i++) { const u = -1 + 2 * (i / 80); c.push([u * W, -H * u * u]); }
  s.push(c); return s;
}
function expDecay(): Stroke[] {
  const x1 = 300, H = 92;
  return [...axes(x1, H), plot((t) => -H * Math.exp(-2.4 * t), x1)];
}
function unitCircle(): Stroke[] {
  const r = 46, s: Stroke[] = [], th = 0.9;
  const c: Stroke = []; for (let i = 0; i <= 28; i++) { const a = (i / 28) * 2 * Math.PI; c.push([r * Math.cos(a), -r * Math.sin(a)]); }
  s.push(c);
  s.push(...arrow(-r - 10, 0, r + 12, 0, 6)); s.push(...arrow(0, r + 10, 0, -r - 12, 6));
  s.push([[0, 0], [r * Math.cos(th), -r * Math.sin(th)]]);
  const arc: Stroke = []; for (let i = 0; i <= 10; i++) { const a = (th * i) / 10; arc.push([16 * Math.cos(a), -16 * Math.sin(a)]); }
  s.push(arc); return s;
}
function vectorComp(): Stroke[] {
  const ang = 0.62, L = 96, tx = L * Math.cos(ang), ty = -L * Math.sin(ang), s: Stroke[] = [];
  s.push(...arrow(0, 0, tx, ty, 11));
  s.push([[0, 0], [tx, 0]]); s.push([[tx, 0], [tx, ty]]); // components
  const arc: Stroke = []; for (let i = 0; i <= 10; i++) { const a = (ang * i) / 10; arc.push([22 * Math.cos(a), -22 * Math.sin(a)]); }
  s.push(arc); return s;
}
function waveform(): Stroke[] {
  const W = 340, amp = 30;
  return [plot((t) => -amp * Math.sin(t * 3 * 2 * Math.PI), W, 160)];
}
function capacitor(): Stroke[] {
  const s: Stroke[] = [], H = 70, gap = 64;
  s.push([[0, -H / 2], [0, H / 2]]); s.push([[gap, -H / 2], [gap, H / 2]]); // plates
  for (let i = -1; i <= 1; i++) s.push(...arrow(8, i * 22, gap - 8, i * 22, 7)); // field
  s.push([[-12, -6], [-2, -6]]); s.push([[-7, -11], [-7, -1]]); // +
  s.push([[gap + 2, -6], [gap + 12, -6]]); // -
  return s;
}
function freeBody(): Stroke[] {
  const s: Stroke[] = [], b = 16;
  s.push([[-b, -b], [b, -b], [b, b], [-b, b], [-b, -b]]);
  s.push(...arrow(0, -b, 0, -b - 46, 9));   // normal up
  s.push(...arrow(0, b, 0, b + 46, 9));     // weight down
  s.push(...arrow(b, 0, b + 46, 0, 9));     // applied right
  s.push(...arrow(-b, 0, -b - 30, 0, 9));   // friction left
  return s;
}
function rightTriangle(): Stroke[] {
  const s: Stroke[] = [], B = 120, H = 78;
  s.push([[0, 0], [B, 0], [B, -H], [0, 0]]);
  s.push([[B - 12, 0], [B - 12, -12], [B, -12]]); // right-angle mark
  const arc: Stroke = []; const th = Math.atan2(H, B); for (let i = 0; i <= 10; i++) { const a = (th * i) / 10; arc.push([26 * Math.cos(a), -26 * Math.sin(a)]); }
  s.push(arc); return s;
}
function sphere3d(): Stroke[] {
  const r = 50, s: Stroke[] = [];
  const c: Stroke = []; for (let i = 0; i <= 28; i++) { const a = (i / 28) * 2 * Math.PI; c.push([r * Math.cos(a), r * Math.sin(a)]); }
  s.push(c);
  const eq: Stroke = []; for (let i = 0; i <= 28; i++) { const a = (i / 28) * 2 * Math.PI; eq.push([r * Math.cos(a), 0.32 * r * Math.sin(a)]); }
  s.push(eq);
  const mer: Stroke = []; for (let i = 0; i <= 28; i++) { const a = (i / 28) * 2 * Math.PI; mer.push([0.32 * r * Math.cos(a), r * Math.sin(a)]); }
  s.push(mer); return s;
}
function bohr(): Stroke[] {
  const s: Stroke[] = [];
  const nuc: Stroke = []; for (let i = 0; i <= 12; i++) { const a = (i / 12) * 2 * Math.PI; nuc.push([6 * Math.cos(a), 6 * Math.sin(a)]); }
  s.push(nuc);
  for (const [rx, ry] of [[48, 26], [30, 50]] as Pt[]) {
    const o: Stroke = []; for (let i = 0; i <= 30; i++) { const a = (i / 30) * 2 * Math.PI; o.push([rx * Math.cos(a), ry * Math.sin(a)]); }
    s.push(o);
  }
  const e: Stroke = []; for (let i = 0; i <= 10; i++) { const a = (i / 10) * 2 * Math.PI; e.push([48 + 4 * Math.cos(a), 4 * Math.sin(a)]); }
  s.push(e); return s;
}
function resistorChain(): Stroke[] {
  const s: Stroke[] = [];
  s.push([[0, 0], [30, 0]]);
  const zz1: Stroke = [[30, 0]]; for (let i = 0; i < 6; i++) zz1.push([36 + i * 9, i % 2 ? 8 : -8]); zz1.push([90, 0]);
  s.push(zz1); s.push([[90, 0], [120, 0]]);
  const zz2: Stroke = [[120, 0]]; for (let i = 0; i < 6; i++) zz2.push([126 + i * 9, i % 2 ? 8 : -8]); zz2.push([180, 0]);
  s.push(zz2); s.push([[180, 0], [210, 0]]);
  return s;
}

// ── Design builders: architecture, interiors, mid-century products ────────
// Same single-stroke pencil language as the physics sketches (up = -y).

// Exterior — modern house in loose 2-point perspective (the showpiece).
function modernHouse(): Stroke[] {
  const s: Stroke[] = [];
  // upper cantilevered slab — near vertical corner + two receding faces
  s.push([[24, -46], [24, -8]]);            // near corner edge
  s.push([[24, -46], [-126, -30]]);         // top, receding left
  s.push([[24, -8], [-126, 0]]);            // bottom, receding left
  s.push([[-126, -30], [-126, 0]]);         // far-left vertical
  s.push([[24, -46], [150, -26]]);          // top, receding right
  s.push([[24, -8], [150, 6]]);             // bottom, receding right
  s.push([[150, -26], [150, 6]]);           // far-right vertical
  s.push([[-126, -30], [40, -58]]);         // roof back edge (left → back)
  s.push([[150, -26], [40, -58]]);          // roof back edge (right → back)
  s.push([[20, -28], [-122, -14]]);         // glazing band, left face
  s.push([[20, -28], [146, -8]]);           // glazing band, right face
  s.push([[-40, -34], [-40, -8]]);          // mullion
  s.push([[84, -32], [84, 4]]);             // mullion
  // lower recessed floor + ground slab
  s.push([[12, -8], [-104, 2]]); s.push([[12, 22], [-104, 34]]);
  s.push([[12, -8], [12, 22]]); s.push([[-104, 2], [-104, 34]]);
  s.push([[12, 22], [150, 36]]);            // slab, right edge
  s.push([[-104, 34], [40, 50]]);           // slab, front-left edge
  s.push([[150, 36], [40, 50]]);            // slab, front-right edge
  return s;
}

// Interior floor plan — walls, partition, door swing, furniture blocks.
function floorPlan(): Stroke[] {
  const s: Stroke[] = [];
  s.push([[-96, -62], [96, -62], [96, 62], [-96, 62], [-96, -62]]); // outer walls
  s.push([[18, 62], [18, 6]]); s.push([[18, 6], [96, 6]]);          // partition
  const arc: Stroke = []; for (let i = 0; i <= 12; i++) { const a = (Math.PI / 2) * (i / 12); arc.push([18 + 30 * Math.sin(a), 62 - 30 * Math.cos(a)]); }
  s.push(arc); s.push([[18, 62], [18, 32]]);                        // door swing + leaf
  s.push([[-86, -52], [-40, -52], [-40, -20], [-86, -20], [-86, -52]]); // sofa
  s.push([[-86, -44], [-40, -44]]);
  const t: Stroke = []; for (let i = 0; i <= 18; i++) { const a = (i / 18) * 2 * Math.PI; t.push([56 + 16 * Math.cos(a), 36 + 16 * Math.sin(a)]); }
  s.push(t);                                                        // round table
  s.push([[-86, 14], [-30, 14], [-30, 54], [-86, 54], [-86, 14]]);  // bed
  s.push([[-86, 24], [-30, 24]]);
  return s;
}

// Cabinet elevation — uppers (some glass-front X), counter, base, tall fridge.
function cabinetElevation(): Stroke[] {
  const s: Stroke[] = [];
  s.push([[-104, 0], [60, 0]]);             // countertop
  s.push([[-104, 0], [-104, 46]]); s.push([[60, 0], [60, 46]]); s.push([[-104, 46], [60, 46]]);
  for (const x of [-66, -28, 12]) s.push([[x, 0], [x, 46]]);        // base divisions
  s.push([[-104, 30], [-66, 30]]); s.push([[12, 14], [60, 14]]); s.push([[12, 30], [60, 30]]); // drawers
  s.push([[-104, -30], [60, -30]]);         // upper bottoms
  s.push([[-104, -82], [60, -82]]);         // upper tops
  s.push([[-104, -82], [-104, -30]]); s.push([[60, -82], [60, -30]]);
  for (const x of [-64, -24, 16]) s.push([[x, -82], [x, -30]]);     // cabinet verticals
  for (const [a, b] of [[-104, -64], [-24, 16]] as Pt[]) {          // glass-front X
    s.push([[a, -30], [b, -82]]); s.push([[b, -30], [a, -82]]);
  }
  s.push([[70, -82], [104, -82], [104, 46], [70, 46], [70, -82]]);  // tall fridge
  s.push([[87, -82], [87, 46]]);
  return s;
}

// Exterior elevation — flat-roof modern front with glazing.
function houseElevation(): Stroke[] {
  const s: Stroke[] = [];
  s.push([[-96, 44], [96, 44]]);                                    // ground
  s.push([[-72, 44], [-72, -34], [72, -34], [72, 44]]);             // body
  s.push([[-82, -34], [82, -34]]); s.push([[-82, -40], [82, -40]]); // parapet
  s.push([[-12, 44], [-12, 2], [14, 2], [14, 44]]);                 // door
  s.push([[-60, -18], [-30, -18], [-30, 22], [-60, 22], [-60, -18]]); // window L
  s.push([[30, -18], [60, -18], [60, 22], [30, 22], [30, -18]]);    // window R
  s.push([[-45, -18], [-45, 22]]); s.push([[45, -18], [45, 22]]);   // mullions
  return s;
}

// ── Mid-century products ─────────────────────────────────────────────────
function eamesChair(): Stroke[] {
  return [
    [[-14, -46], [-18, -22], [-8, -12], [20, -10]], // molded shell
    [[20, -10], [22, -4]],                          // seat lip
    [[14, -10], [22, 26]],                          // front dowel leg
    [[-6, -12], [-16, 26]],                         // back dowel leg
    [[-16, 26], [22, 26]],                          // floor stretcher
    [[-2, 6], [16, 8]],                             // cross dowel
  ];
}
function mcmSofa(): Stroke[] {
  return [
    [[-60, 4], [-60, -20], [-52, -28], [52, -28], [60, -20], [60, 4]], // body
    [[-50, -6], [50, -6]],                          // seat top
    [[-15, -6], [-15, -28]], [[15, -6], [15, -28]], // back cushion seams
    [[-50, 4], [50, 4]],                            // base
    [[-46, 4], [-50, 16]], [[46, 4], [50, 16]],     // splayed legs
  ];
}
function floorLamp(): Stroke[] {
  return [
    [[-8, 30], [8, 30]],                            // foot
    [[0, 30], [0, -2]],                             // pole
    [[0, -2], [12, -30], [40, -40], [58, -36]],     // arc arm
    [[50, -34], [66, -40]],                         // shade lip
    [[50, -34], [58, -20]], [[66, -40], [58, -20]], // shade cone
  ];
}
function coffeeTable(): Stroke[] {
  return [
    [[-42, -10], [42, -12]], [[-42, -6], [42, -8]], // slab top
    [[-42, -10], [-42, -6]], [[42, -12], [42, -8]],
    [[-34, -6], [-44, 22]], [[34, -8], [44, 22]],   // splayed outer legs
    [[-26, -6], [-20, 22]], [[26, -7], [20, 22]],   // inner legs
  ];
}
function tulipChair(): Stroke[] {
  const s: Stroke[] = [];
  s.push([[-18, -14], [-20, -30], [-12, -44], [10, -44], [18, -30], [16, -14]]); // shell
  s.push([[-18, -14], [16, -14]]);          // seat front
  s.push([[-2, -14], [-2, 14]]);            // stem
  s.push([[-16, 18], [0, 12], [16, 18]]);   // pedestal base
  return s;
}

// ── Carpenter measurement annotations — dimension lines + callouts ────────
const DIM_LABELS = ['24"', '36"', '18"', '12"', '30"', '42"', '16"', '60"', '48"', '8"', '9"', '21"'];
const dimLabel = (rng: () => number) => DIM_LABELS[Math.floor(rng() * DIM_LABELS.length)];
// Lay a number label centered at (cx, cy), reusing eqStrokes' hand-jitter.
function placeLabel(text: string, rng: () => number, cx: number, cy: number, unit = 0.85): Stroke[] {
  const raw = eqStrokes(text, rng, unit, 0.28);
  let minX = Infinity, maxX = -Infinity;
  raw.forEach((st) => st.forEach((p) => { if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0]; }));
  const ox = cx - (minX + maxX) / 2;
  return raw.map((st) => st.map((p) => [p[0] + ox, p[1] + cy] as Pt));
}
const dimTick = (x: number, y: number): Stroke => [[x - 4, y + 4], [x + 4, y - 4]]; // 45° slash
function dimLineH(rng: () => number): Stroke[] {
  const W = 80 + Math.floor(rng() * 70), s: Stroke[] = [];
  s.push([[0, 9], [0, -9]]); s.push([[W, 9], [W, -9]]);     // witness lines
  s.push([[0, 0], [W, 0]]);                                 // dimension line
  s.push(dimTick(0, 0)); s.push(dimTick(W, 0));
  s.push(...placeLabel(dimLabel(rng), rng, W / 2, -7));
  return s;
}
function dimLineV(rng: () => number): Stroke[] {
  const H = 80 + Math.floor(rng() * 60), s: Stroke[] = [];
  s.push([[9, 0], [-9, 0]]); s.push([[9, -H], [-9, -H]]);
  s.push([[0, 0], [0, -H]]);
  s.push(dimTick(0, 0)); s.push(dimTick(0, -H));
  s.push(...placeLabel(dimLabel(rng), rng, 26, -H / 2));
  return s;
}
function dimChain(rng: () => number): Stroke[] {
  // Pure segmented run (witness lines + slash ticks) — reads as a dimension
  // string without cramming tiny numbers between close ticks.
  const segs = [34 + Math.floor(rng() * 16), 30 + Math.floor(rng() * 20), 40 + Math.floor(rng() * 24), 28 + Math.floor(rng() * 18)];
  const s: Stroke[] = []; let x = 0;
  s.push([[0, 9], [0, -9]]);
  for (const w of segs) {
    s.push([[x, 0], [x + w, 0]]);
    s.push(dimTick(x, 0));
    s.push([[x + w, 9], [x + w, -9]]);
    x += w;
  }
  s.push(dimTick(x, 0));
  return s;
}
function studDetail(rng: () => number): Stroke[] {
  const L = 110 + Math.floor(rng() * 40), h = 15, s: Stroke[] = [];
  s.push([[0, 0], [L, 0], [L, h], [0, h], [0, 0]]);          // board
  s.push([[7, 5], [L - 7, 5]]); s.push([[7, 10], [L - 7, 10]]); // grain
  s.push([[0, h + 14], [L, h + 14]]);                        // dim line
  s.push([[0, h + 9], [0, h + 19]]); s.push([[L, h + 9], [L, h + 19]]);
  s.push(...placeLabel(dimLabel(rng), rng, L / 2, h + 28));
  return s;
}

// ── Code, prompts, charts — the builder/maker layer ───────────────────────
// Stack lines of text, the block centered on its origin (up = -y).
function multiText(lines: string[], rng: () => number, unit = 1.0, lineH = 21): Stroke[] {
  const out: Stroke[] = [];
  const n = lines.length;
  lines.forEach((ln, i) => {
    const oy = (i - (n - 1) / 2) * lineH;
    eqStrokes(ln, rng, unit, 0.5).forEach((st) => out.push(st.map((p) => [p[0], p[1] + oy] as Pt)));
  });
  return out;
}
const CODE_SNIPPETS = [
  ["const ship = () => {", "  build();", "  return true;", "}"],
  ["function make() {", "  while (true) {", "    iterate();", "  }", "}"],
  ["if (idea) {", "  prototype();", "}"],
  ["export const work =", "  ideas.map((i) =>", "    refine(i));"],
  ["const [n, set] =", "  useState(0);"],
  ["type Build = {", "  ship: boolean;", "};"],
  ["await deploy({", "  prod: true,", "});"],
];
function codeSnippet(rng: () => number): Stroke[] {
  return multiText(CODE_SNIPPETS[Math.floor(rng() * CODE_SNIPPETS.length)], rng, 0.92, 22);
}
const VIBE_PROMPTS = [
  ["> build a portfolio that", "  feels like a workshop,", "  not a gallery"],
  ["> make the background", "  feel alive but quiet"],
  ["> ship the rough cut,", "  refine it in public"],
  ["> animate it like a hand", "  sketching by pencil"],
];
function vibePrompt(rng: () => number): Stroke[] {
  return multiText(VIBE_PROMPTS[Math.floor(rng() * VIBE_PROMPTS.length)], rng, 0.95, 22);
}

const dot = (x: number, y: number): Stroke => {
  const s: Pt[] = [];
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * 2 * Math.PI; s.push([x + 2.4 * Math.cos(a), y + 2.4 * Math.sin(a)]); }
  return s;
};
function lineChart(rng: () => number): Stroke[] {
  const x1 = 300, H = 96, s: Stroke[] = [];
  s.push([[-8, 0], [x1 + 12, 0]]);                          // x axis
  s.push([[0, 14], [0, -H - 14]]);                          // y axis
  for (const gy of [-32, -64]) s.push([[0, gy], [x1, gy]]); // gridlines
  const n = 7, pts: Pt[] = []; let v = 16;
  for (let i = 0; i <= n; i++) { v += rng() * 26 - 7; v = Math.max(8, Math.min(H, v)); pts.push([(x1 * i) / n, -v]); }
  s.push(pts);                                              // trend line
  pts.forEach((p) => s.push(dot(p[0], p[1])));              // data points
  return s;
}
function barChart(rng: () => number): Stroke[] {
  const x1 = 280, H = 96, n = 6, s: Stroke[] = [];
  s.push([[-8, 0], [x1 + 10, 0]]); s.push([[0, 14], [0, -H - 14]]);
  const step = x1 / n, bw = step * 0.56;
  for (let i = 0; i < n; i++) { const h = 22 + rng() * H * 0.78; const x = i * step + (step - bw) / 2; s.push([[x, 0], [x, -h], [x + bw, -h], [x + bw, 0]]); }
  return s;
}

function toPath(s: Stroke): string {
  return "M" + s.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L");
}
function strokeLen(s: Stroke): number {
  let L = 0;
  for (let i = 1; i < s.length; i++) L += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
  return L;
}

const SPEED = 175; // local units / sec — lower = slower, calmer pen
const FADE_MS = 1800;
const CANVAS_W = 1440;
const CANVAS_H = 900;

const EQUATIONS = [
  "F = ma", "F = -kx", "v^2 = u^2 + 2as", "p = mv", "E = mv^2/2", "ω = √(k/m)",
  "T = 2π√(m/k)", "x(t) = A cos(ωt + φ)", "a = -ω^2 x", "τ = r × F", "L = Iω",
  "θ = ωt", "W = Fd", "P = Fv", "E = hf", "λ = h/p",
  "F = q_1 q_2 / 4πε_0 r^2", "E = F/q", "V = IR", "P = IV", "Φ = BA",
  "∇·E = ρ/ε_0", "∇×B = μ_0 J", "F = qE + qv×B", "C = Q/V", "U = CV^2/2",
  "B = μ_0 I / 2πr", "∇·B = 0", "Q = CV", "ε = -dΦ/dt",
  "KE = p^2/2m", "f = 1/T", "v = fλ", "a_c = v^2/r", "g = GM/r^2", "U = -GMm/r",
  "PV = nRT", "Q = mcΔT", "ΔU = Q - W", "η = 1 - T_c/T_h", "n_1 sin θ_1 = n_2 sin θ_2",
  "1/f = 1/v - 1/u", "E = -dV/dx", "R = ρL/A", "ω = 2πf", "K = Iω^2/2",
  "c = 1/√(μ_0 ε_0)", "u = B^2/2μ_0",
];
// Design sketches join the rotation alongside the physics — architecture as
// the larger "hero" pieces, mid-century furniture as small products.
const DESIGN_HERO = [modernHouse, floorPlan, cabinetElevation, houseElevation];
const DESIGN_SMALL = [eamesChair, mcmSofa, floorLamp, coffeeTable, tulipChair];
const MEASURE = [dimLineH, dimLineV, dimChain, studDetail];
// Builder/maker layer: charts + a screen of code as heroes; code + a prompt small.
const CHARTS = [lineChart, barChart];
const SMALL_DIA = [springD, pendulum, incline, circuit, fieldLines, unitCircle, vectorComp, capacitor, freeBody, rightTriangle, resistorChain, waveform, ...DESIGN_SMALL, ...MEASURE, codeSnippet, codeSnippet, vibePrompt];
const HERO_DIA = [dampedGraph, cube, projectile, parabola, sineWave, expDecay, sphere3d, bohr, ...DESIGN_HERO, ...CHARTS, codeSnippet];
const OPACITIES = [0.05, 0.08, 0.1];
const HERO_OPACITIES = [0.08, 0.1]; // heroes never the faintest — they anchor

interface FragmentDef {
  id: string;
  strokes: Stroke[];
  x: number;
  y: number;
  scale: number;
  loopMs: number;
  delay: number;
  exitMode: "fade" | "reverse"; // how it leaves before its next cycle
  opacity: number; // per-fragment pencil weight — varied for depth
}

function Fragment({ def, reduced }: { def: FragmentDef; reduced: boolean }) {
  const [cycle, setCycle] = useState(reduced ? 1 : 0);
  const [shown, setShown] = useState(reduced);
  const [phase, setPhase] = useState<"draw" | "erase">("draw");

  // Per-stroke timing: forward (draw, in order) + reverse (un-draw, last
  // stroke first), plus the total draw time so we can schedule the exit.
  const { paths, drawTimeMs } = useMemo(() => {
    const total = def.strokes.reduce((a, s) => a + Math.max(strokeLen(s), 4), 0);
    let cum = 0;
    const list = def.strokes.map((s) => {
      const len = Math.max(strokeLen(s), 4);
      const fwd = cum / SPEED;
      const rev = (total - cum - len) / SPEED;
      const dur = Math.max(len / SPEED, 0.08);
      cum += len;
      return { d: toPath(s), fwd, rev, dur };
    });
    return { paths: list, drawTimeMs: (total / SPEED) * 1000 };
  }, [def.strokes]);

  useEffect(() => {
    if (reduced) return;
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const draw = () => {
      if (!alive) return;
      setPhase("draw");
      setShown(true);
      setCycle((c) => c + 1);
      if (def.loopMs) {
        if (def.exitMode === "reverse") {
          const exitAt = Math.max(def.loopMs - drawTimeMs - 300, 1200);
          timers.push(setTimeout(() => alive && setPhase("erase"), exitAt));
        } else {
          timers.push(setTimeout(() => alive && setShown(false), def.loopMs - FADE_MS));
        }
        timers.push(setTimeout(draw, def.loopMs));
      }
    };
    timers.push(setTimeout(draw, def.delay));
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [def, reduced, drawTimeMs]);

  return (
    <g
      transform={`translate(${def.x} ${def.y}) scale(${def.scale})`}
      style={{ opacity: shown ? 1 : 0, transition: `opacity ${FADE_MS}ms ease-out` }}
    >
      {cycle > 0 && (
        <g key={`${cycle}-${phase}`}>
          {paths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={`rgba(38, 35, 28, ${def.opacity})`}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: reduced ? 0 : phase === "erase" ? 0 : 1,
                animation: reduced
                  ? undefined
                  : phase === "erase"
                    ? `springErase ${p.dur}s linear ${p.rev}s forwards`
                    : `springDraw ${p.dur}s linear ${p.fwd}s forwards`,
              }}
            />
          ))}
        </g>
      )}
    </g>
  );
}

export function SpringSolve() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    setMounted(true);
  }, []);

  const onHome = pathname === "/";
  const isCase = (pathname ?? "").startsWith("/case-studies/");
  const onCategory = (pathname ?? "").startsWith("/category/");

  const fragments = useMemo<FragmentDef[]>(() => {
    // Case studies carry the same desk language but reseeded, so each reads as
    // related rather than identical (no glyph-flipping mirror — that would
    // reverse the equations into mirror-writing).
    const rng = mulberry32(isCase ? 91116007 : onCategory ? 51730922 : 20260605);
    const cols = isMobile ? 4 : 10;
    const rows = isMobile ? 10 : 8;
    const baseS = isMobile ? 0.5 : 0.46;
    const heroCount = isMobile ? 4 : 8;
    const total = cols * rows;
    const heroCells = new Set<number>();
    // Keep the big hero sketches from stacking: reject a candidate cell that neighbours
    // (incl. diagonally) an already-chosen hero, so no two diagrams ever overlap.
    const heroPos: { r: number; c: number }[] = [];
    for (let t = 0; heroCells.size < heroCount && t < 400; t++) {
      const cell = Math.floor(rng() * total);
      if (heroCells.has(cell)) continue;
      const cr = Math.floor(cell / cols);
      const cc = cell % cols;
      if (heroPos.some((p) => Math.abs(p.r - cr) <= 1 && Math.abs(p.c - cc) <= 1)) continue;
      heroCells.add(cell);
      heroPos.push({ r: cr, c: cc });
    }

    // Shuffled cycling: walk each pool in random order, reshuffling on wrap so
    // every equation / diagram / hero appears before any repeats — kills the
    // "same graph three times" look that random-pick produced.
    let eqOrder = shuffle([...EQUATIONS.keys()], rng), eqi = 0;
    let heroOrder = shuffle([...HERO_DIA.keys()], rng), hi = 0;
    let diaOrder = shuffle([...SMALL_DIA.keys()], rng), di = 0;
    const nextEq = () => { if (eqi >= eqOrder.length) { eqOrder = shuffle(eqOrder, rng); eqi = 0; } return eqOrder[eqi++]; };
    const nextHero = () => { if (hi >= heroOrder.length) { heroOrder = shuffle(heroOrder, rng); hi = 0; } return heroOrder[hi++]; };
    const nextDia = () => { if (di >= diaOrder.length) { diaOrder = shuffle(diaOrder, rng); di = 0; } return diaOrder[di++]; };
    const cellW = CANVAS_W / cols;
    const cellH = CANVAS_H / rows;
    const out: FragmentDef[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = r * cols + c;
        const x = c * cellW + cellW * 0.12 + rng() * cellW * 0.35;
        const y = r * cellH + cellH * 0.45 + rng() * cellH * 0.3;
        const delay = Math.floor(rng() * 22000);
        const loop = rng() < 0.16 ? 0 : Math.floor(16000 + rng() * 14000);
        const exitMode: "fade" | "reverse" = rng() < 0.5 ? "reverse" : "fade";
        if (heroCells.has(cell)) {
          const opacity = HERO_OPACITIES[Math.floor(rng() * HERO_OPACITIES.length)];
          out.push({ id: `h${cell}`, strokes: HERO_DIA[nextHero()](rng), x, y, scale: (isMobile ? 0.62 : 0.78) + rng() * 0.1, loopMs: 32000 + Math.floor(rng() * 12000), delay, exitMode, opacity });
        } else if (rng() < 0.33) {
          const opacity = OPACITIES[Math.floor(rng() * OPACITIES.length)];
          out.push({ id: `d${cell}`, strokes: SMALL_DIA[nextDia()](rng), x, y, scale: baseS * (0.9 + rng() * 0.3), loopMs: loop, delay, exitMode, opacity });
        } else {
          const opacity = OPACITIES[Math.floor(rng() * OPACITIES.length)];
          out.push({ id: `e${cell}`, strokes: eqStrokes(EQUATIONS[nextEq()], rng), x, y, scale: baseS * (0.85 + rng() * 0.4), loopMs: loop, delay, exitMode, opacity });
        }
      }
    }
    return out;
  }, [isMobile, isCase, onCategory]);

  if (!mounted || (!onHome && !isCase && !onCategory)) return null;

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, opacity: 0.6 }}>
      <svg
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        style={{ overflow: "hidden" }}
      >
        {fragments.map((def) => (
          <Fragment key={def.id} def={def} reduced={reduced} />
        ))}
      </svg>
    </div>
  );
}
