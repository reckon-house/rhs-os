/* Swatch morphing — shared, because two brand sections now need it.
 *
 * Lifted verbatim from RRSystemIndex, where it was private. Robert's
 * palette morphs shape and colour together and A.R.C.'s wants the same
 * move; a second implementation of a polar-profile lerp is two things
 * to get subtly different from each other.
 *
 * What deliberately stayed BEHIND in that file is its STATES table. The
 * shapes, radii and rotations there are campaign values tuned to that
 * brand — equal circumradius is not equal optical weight, so a circle
 * at R=41 balances a square at 47. The mechanism is general; the taste
 * is not.
 */

export const N = 180;
export const CX = 50;
export const CY = 50;

export type Pt = [number, number];

/* Dense outline of a regular polygon. BOTH the corner arcs AND the
   straight edges have to be sampled: the polar profile below reads a
   radius per angle, so any stretch of outline with no samples gets
   filled in by interpolating radius — which traces an arc, not a line.
   Sampling corners only is what turned the square into a circle with
   four nubs. */
export function outline(sides: number, R: number, cr: number, rot: number): Pt[] {
  if (!sides) {
    // circle
    const pts: Pt[] = [];
    for (let i = 0; i < 360; i++) {
      const a = (i / 360) * 2 * Math.PI;
      pts.push([CX + R * Math.cos(a), CY + R * Math.sin(a)]);
    }
    return pts;
  }
  const u = (v: Pt): Pt => {
    const m = Math.hypot(v[0], v[1]) || 1;
    return [v[0] / m, v[1] / m];
  };
  const V: Pt[] = [];
  for (let i = 0; i < sides; i++) {
    const a = rot + (i * 2 * Math.PI) / sides;
    V.push([CX + R * Math.cos(a), CY + R * Math.sin(a)]);
  }

  // Per vertex: where the corner arc enters, where it leaves, and its
  // centre. cr = 0 degenerates cleanly to the bare vertex (the dummy
  // centre and angles are never read when r is 0).
  const corners = V.map((cur, i) => {
    const prev = V[(i - 1 + sides) % sides];
    const next = V[(i + 1) % sides];
    const d1 = u([prev[0] - cur[0], prev[1] - cur[1]]);
    const d2 = u([next[0] - cur[0], next[1] - cur[1]]);
    if (cr <= 0) return { p1: cur, p2: cur, r: 0, cen: cur, a1: 0, da: 0 };
    const ang = Math.acos(Math.max(-1, Math.min(1, d1[0] * d2[0] + d1[1] * d2[1])));
    const dist = cr / Math.tan(ang / 2);
    const p1: Pt = [cur[0] + d1[0] * dist, cur[1] + d1[1] * dist];
    const p2: Pt = [cur[0] + d2[0] * dist, cur[1] + d2[1] * dist];
    const bis = u([d1[0] + d2[0], d1[1] + d2[1]]);
    const off = cr / Math.sin(ang / 2);
    const cen: Pt = [cur[0] + bis[0] * off, cur[1] + bis[1] * off];
    const a1 = Math.atan2(p1[1] - cen[1], p1[0] - cen[0]);
    const a2 = Math.atan2(p2[1] - cen[1], p2[0] - cen[0]);
    let da = a2 - a1;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    return { p1, p2, cen, a1, da, r: cr };
  });

  const pts: Pt[] = [];
  for (let i = 0; i < sides; i++) {
    const c = corners[i];
    const nx = corners[(i + 1) % sides];
    if (c.r > 0) {
      for (let k = 0; k <= 18; k++) {
        const a = c.a1 + (c.da * k) / 18;
        pts.push([c.cen[0] + c.r * Math.cos(a), c.cen[1] + c.r * Math.sin(a)]);
      }
    } else {
      pts.push([c.p1[0], c.p1[1]]);
    }
    // the edge — the part that was missing
    const from = c.r > 0 ? c.p2 : c.p1;
    const to = nx.p1;
    for (let k = 1; k <= 60; k++) {
      const t = k / 60;
      pts.push([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]);
    }
  }
  return pts;
}

/* → one radius per angle, so shapes line up index-for-index. Because
   every shape is star-convex about its centre, sampling by angle makes
   point 0 of the square correspond to point 0 of the triangle, and the
   morph becomes a straight per-angle lerp — no correspondence guessing,
   no twisting, no collapsing corners. */
export function profile(pts: Pt[]): number[] {
  const polar = pts
    .map(([x, y]) => {
      let a = Math.atan2(y - CY, x - CX);
      if (a < 0) a += 2 * Math.PI;
      return [a, Math.hypot(x - CX, y - CY)] as Pt;
    })
    .sort((m, n) => m[0] - n[0]);
  const out: number[] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * 2 * Math.PI;
    let lo = 0;
    let hi = polar.length - 1;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (polar[m][0] < a) lo = m + 1;
      else hi = m;
    }
    const p1 = polar[lo];
    const p0 = polar[(lo - 1 + polar.length) % polar.length];
    const span = p1[0] - p0[0];
    const t = span > 0 ? Math.max(0, Math.min(1, (a - p0[0]) / span)) : 0;
    out.push(p0[1] + (p1[1] - p0[1]) * t);
  }
  return out;
}

export function toPath(r: number[]): string {
  let d = "";
  for (let i = 0; i < N; i++) {
    const a = (i / N) * 2 * Math.PI;
    const x = (CX + r[i] * Math.cos(a)).toFixed(2);
    const y = (CY + r[i] * Math.sin(a)).toFixed(2);
    d += (i ? "L" : "M") + x + "," + y;
  }
  return d + "Z";
}

export const rgb = (h: string): number[] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
