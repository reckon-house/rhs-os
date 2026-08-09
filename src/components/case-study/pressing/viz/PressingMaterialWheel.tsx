import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * PressingMaterialWheel — the pressing skin for `material-circos`, drawn
 * as the season wheel (VIZ-PASS.md, shape 1).
 *
 * The Hill Country kitchen has four finishes and fifteen surfaces, and
 * the question the section asks is which finish lands where. So the
 * wheel gives the angular scale to the SURFACES — each one a rim segment
 * as wide as its authored weight — and gives a concentric track to each
 * FINISH. A track runs ink through the surfaces that carry that finish
 * and hairline through the ones that do not: the phase-by-tone reading
 * the shape is built for. Every finish's name is set on the curve above
 * its longest continuous run, so the label sits on the data instead of
 * in a key.
 *
 * What survived verbatim from MaterialCircos: the four finish names, all
 * fifteen surface names, every membership list, every weight, the 0.015
 * inter-zone gap, twelve o'clock as the start, and the hub's own two
 * lines. Weight is the classic's angular scale too — its author called
 * the field "relative arc size" — so the wheel is measuring the same
 * quantity the original did.
 *
 * VIZ-PASS's assignment table reads "zones as arc tracks, materials as
 * rim segments"; this is the other way round on purpose. Fifteen
 * concentric rings against four rim segments throws away `weight`
 * (materials have none) and leaves fifteen surface names with nowhere
 * legible to sit, while four tracks against fifteen weighted rim
 * segments is what the shape describes — tracks few, rim segments many,
 * like months.
 *
 * What it deliberately does not carry over: the hundreds of chord lines
 * between every pair of zones (their endpoints, widths, opacities and
 * control points were all seeded RNG — generated density that reads as
 * measurement), the 300 inner particles, the sub-bar texture on tracks 1
 * through 4 whose heights were also random, the four finish hexes and
 * the legend that decoded them (one ink needs no decoding, and the
 * palette lives in the reel), and the RNG, which is gone because the
 * density it generated was decoration, not because it was unsafe: its
 * Lehmer LCG runs on integers below 2^53, so it is bit-identical in
 * Node and Chrome. An earlier draft of this comment blamed it for a
 * hydration mismatch, which was not true of this component.
 *
 * No accent. There is no single surface or finish this chart exists to
 * point at — the argument is the interlock, and the interlock is the
 * whole drawing.
 */

/** The four finishes, verbatim. Names only: the hexes were the classic's
 *  drawing colours, and this kit has one. */
const MATERIALS = [
  "SAGE GREEN",
  "WHITE OAK",
  "CALACATTA MARBLE",
  "UNLACQUERED BRASS",
];

/** The fifteen surfaces, verbatim — names, memberships and weights. */
const ZONES: { name: string; materials: number[]; weight: number }[] = [
  { name: "PERIMETER CABINETS", materials: [0, 3], weight: 2.5 },
  { name: "RANGE HOOD", materials: [0, 2], weight: 1.2 },
  { name: "BACKSPLASH", materials: [2], weight: 1.8 },
  { name: "COUNTERTOPS", materials: [2, 1], weight: 2 },
  { name: "ISLAND", materials: [1, 2, 3], weight: 2.5 },
  { name: "BAR STOOLS", materials: [3, 1], weight: 0.8 },
  { name: "OPEN SHELVING", materials: [1], weight: 0.8 },
  { name: "FIXTURES", materials: [3], weight: 1.2 },
  { name: "PENDANTS", materials: [3], weight: 0.7 },
  { name: "PANTRY WALL", materials: [0, 3], weight: 1.8 },
  { name: "FRIDGE PANEL", materials: [0], weight: 0.8 },
  { name: "SINK", materials: [2, 3], weight: 1 },
  { name: "DINING TABLE", materials: [1], weight: 1.2 },
  { name: "DINING CHAIRS", materials: [1], weight: 0.8 },
  { name: "FLOOR", materials: [1], weight: 1.5 },
];

/* ── geometry ──────────────────────────────────────────────────────
   Square canvas, so it caps at its drawn size (.wheel) rather than
   taking the page's full measure and standing 1500px tall. */
const W = 900;
const CX = W / 2;
const CY = W / 2;

const GAP = 0.015; // the classic's own inter-surface gap
const START = -Math.PI / 2; // surface 01 opens at twelve o'clock

const R_ZONE_LBL = 400; // baseline of the rim labels
const R_RIM = 388; // the rim arc, one per surface
const R_HUB = 192;
/** Track band centres, outermost finish first. */
const TRACK_R = [356, 312, 268, 224];
const BAND = 11;
/** Cap height of the label faces, for flipping type across the horizon. */
const RISE = 9;
/** How far a finish's name floats above its own band. It clears its own
 *  band by 5.5px and the next one out by 18.5, and that ratio is the
 *  whole reason the number is what it is: sat midway between two tracks
 *  a name belongs to neither. */
const LIFT = 11;

const TOTAL = ZONES.reduce((s, z) => s + z.weight, 0);
const SWEEP = Math.PI * 2 - GAP * ZONES.length;

/** Each surface's arc, laid out by weight. */
const SEGS = (() => {
  let a = START;
  return ZONES.map((z) => {
    const a0 = a;
    const a1 = a0 + (z.weight / TOTAL) * SWEEP;
    a = a1 + GAP;
    return { ...z, a0, a1 };
  });
})();

const pt = (r: number, a: number) =>
  [CX + Math.cos(a) * r, CY + Math.sin(a) * r] as const;

/** An arc, serialised. Everything trig-derived is rounded HERE, at the
 *  string, not upstream — a coordinate rounded early drags every value
 *  computed from it out of agreement between Node's trig and Chrome's. */
function arcPath(r: number, a0: number, a1: number): string {
  const [x0, y0] = pt(r, a0);
  const [x1, y1] = pt(r, a1);
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M ${px(x0)} ${px(y0)} A ${px(r)} ${px(r)} 0 ${large} ${sweep} ${px(x1)} ${px(y1)}`;
}

/** A baseline for type set on the curve. Angles here run -π/2 … 3π/2, so
 *  the lower half of the wheel is exactly the open interval (0, π); type
 *  laid clockwise there hangs upside down. Below the horizon the path is
 *  drawn backwards one cap-height further out, and the type reads off the
 *  inside of the curve — same annulus, right way up. */
function labelPath(r: number, a0: number, a1: number): string {
  const mid = (a0 + a1) / 2;
  const flip = mid > 0 && mid < Math.PI;
  return flip ? arcPath(r + RISE, a1, a0) : arcPath(r, a0, a1);
}

/** The longest unbroken stretch of wheel carrying one finish. That run
 *  gets the name; the finish's other runs go unlabelled, the way a
 *  contour is lettered once. */
function longestRun(mi: number): { a0: number; a1: number } {
  const runs: { a0: number; a1: number }[] = [];
  SEGS.forEach((s, i) => {
    if (!s.materials.includes(mi)) return;
    const prev = runs[runs.length - 1];
    if (prev && SEGS[i - 1]?.materials.includes(mi)) prev.a1 = s.a1;
    else runs.push({ a0: s.a0, a1: s.a1 });
  });
  return runs.reduce((best, r) => (r.a1 - r.a0 > best.a1 - best.a0 ? r : best));
}

export function PressingMaterialWheel() {
  return (
    <div className={styles.viz}>
      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={`${styles.wide} ${styles.wheel}`}
          viewBox={`0 0 ${W} ${W}`}
          width="100%"
          role="img"
          /* "sized by how much of the room it covers" was a measurement
             claim nobody made. The classic annotates the field as
             `weight: number; // relative arc size` — a drawing
             parameter — and the study never quantifies coverage. The
             label now says what the segment IS, not what it proves. */
          aria-label="The kitchen's four finishes as concentric tracks around fifteen surfaces, each surface a rim segment at its authored relative arc size; a track runs solid where that finish is used and hairline where it is not"
        >
          <defs>
            {SEGS.map((s) => (
              <path
                key={`zp-${s.name}`}
                id={`hck-zone-${s.name.replace(/\s/g, "-")}`}
                d={labelPath(R_ZONE_LBL, s.a0, s.a1)}
                fill="none"
              />
            ))}
            {MATERIALS.map((m, mi) => {
              const run = longestRun(mi);
              return (
                <path
                  key={`tp-${m}`}
                  id={`hck-track-${mi}`}
                  d={labelPath(TRACK_R[mi] + LIFT, run.a0, run.a1)}
                  fill="none"
                />
              );
            })}
          </defs>

          {/* Surface dividers, parked in the gaps: the shared angular
              scale made visible, the way a calendar wheel rules months. */}
          {SEGS.map((s) => {
            const a = s.a0 - GAP / 2;
            const [x0, y0] = pt(R_HUB, a);
            const [x1, y1] = pt(R_RIM, a);
            return (
              <line
                key={`spoke-${s.name}`}
                x1={px(x0)}
                y1={px(y0)}
                x2={px(x1)}
                y2={px(y1)}
                stroke="var(--pp-ink)"
                strokeOpacity="0.08"
              />
            );
          })}

          {/* The rim: one hairline arc per surface, its length the weight. */}
          {SEGS.map((s) => (
            <path
              key={`rim-${s.name}`}
              d={arcPath(R_RIM, s.a0, s.a1)}
              fill="none"
              stroke="var(--pp-ink)"
              strokeOpacity="0.14"
            />
          ))}

          {/* The four tracks. Ink where the finish is used, hairline where
              it is not — the phase reading, by tone alone. */}
          {MATERIALS.map((m, mi) =>
            SEGS.map((s) => {
              const on = s.materials.includes(mi);
              return (
                <path
                  key={`tr-${mi}-${s.name}`}
                  d={arcPath(TRACK_R[mi], s.a0, s.a1)}
                  fill="none"
                  stroke="var(--pp-ink)"
                  strokeWidth={on ? BAND : 1}
                  strokeOpacity={on ? 0.8 : 0.08}
                />
              );
            })
          )}

          {/* Finish names, on the curve above their longest run. */}
          {MATERIALS.map((m, mi) => (
            <text key={`tl-${m}`} className={styles.schemLbl} textAnchor="middle">
              <textPath href={`#hck-track-${mi}`} startOffset="50%">
                {m}
              </textPath>
            </text>
          ))}

          {/* Surface names, on the rim. */}
          {SEGS.map((s) => (
            <text key={`zl-${s.name}`} className={styles.schemNum} textAnchor="middle">
              <textPath
                href={`#hck-zone-${s.name.replace(/\s/g, "-")}`}
                startOffset="50%"
              >
                {s.name}
              </textPath>
            </text>
          ))}

          {/* The hub: a hairline and the count it holds. */}
          <circle
            cx={CX}
            cy={CY}
            r={R_HUB}
            fill="none"
            stroke="var(--pp-ink)"
            strokeOpacity="0.14"
          />
          <text className={styles.schemLbl} x={CX} y={CY - 4} textAnchor="middle">
            MATERIAL SYSTEM
          </text>
          <text className={styles.schemNum} x={CX} y={CY + 16} textAnchor="middle">
            4 FINISHES · 15 SURFACES
          </text>
        </svg>
      </div>
    </div>
  );
}
