import type { IntelligenceFlowSection } from "@/lib/types";
import { px } from "@/lib/px";
import { RING_FINE, RING_INK, RING_DROP, RING_SCALE } from "@/lib/rings";
import styles from "./PressingViz.module.css";

/**
 * @shape rings — conforms to lab/viz-system.html
 *
 * PressingIntelligenceWheel — the pressing skin for `intelligence-flow`,
 * drawn as the season wheel (VIZ-PASS.md shape 1).
 *
 * Sally's pipeline as concentric arc tracks on ONE shared angular scale.
 * The scale is relative volume: 0 at the origin ray, the largest stage
 * at 300 degrees, so the length of a track's ink arc IS its authored
 * value and the six can be compared by angle alone. The pipeline runs
 * INWARD, source at the rim and store at the hub, because each stage
 * carries less than the one before it and the funnel should close on
 * something. It also puts the six row labels in pipeline order down the
 * page instead of upside down.
 *
 * Every track is one continuous band at one width, broken into phases by
 * tone the way a season wheel breaks a year: INK for the volume this
 * stage carries, GREY for the span the stage outside it carried and this
 * one does not (arithmetic on two authored numbers, not a new one),
 * FAINT for the rest of the scale — the dev timeline's idiom, the scale
 * continues and the work does not. Weight is constant so the tone does
 * all the work; a thinner tail would read as a guide rail rather than as
 * the same track continuing. Stage names sit in the 60-degree gutter
 * left of the origin ray, horizontal and readable, the way a Gantt keeps
 * its row labels at the left edge; each stage's own items ride the curve
 * of its track.
 *
 * The data is the section's `stages` array, verbatim: six names, their
 * seventeen items, their six values. Worth naming — the classic
 * component never drew any of it. It ignored its own section props and
 * rendered five hardcoded rings instead (23 "data nodes", 10 decision
 * rules, 8 technologies, 5 modules), placed at angles chosen to look
 * even and wired together by a CONNECTIONS array of literal index pairs.
 * None of that is measured, so none of it can be honestly placed on a
 * scale, and it does not survive here. Neither do the 1,734 seeded
 * particles, the 90 random web lines, the two legends, or the ten-colour
 * palette — the study's colour lives in the reel.
 * (1,734 counted from the classic's own arrays, not estimated: 898 from
 * the 23 data nodes, 176 tech, 350 loop, 160 decisions, 90 modules, 60
 * pipeline. An earlier draft said ~3,900, which was 2.25x over — a
 * fabricated number inside a paragraph arguing against fabricated
 * density.)
 *
 * No accent. This chart has no single datum to point at; the schematic
 * is the point, so it stays pure ink.
 *
 * All geometry runs through px() at serialisation, so the server and the
 * browser emit byte-identical markup. The classic component's unrounded
 * trig is exactly what cost the architecture diagram a hydration
 * mismatch on every load.
 */

const W = 1000;
const CX = 500;
const CY = 500;

/** The largest stage fills 300 degrees; the remaining 60 is the label
 *  gutter, counter-clockwise of the origin ray at twelve o'clock. */
const SWEEP = 300;

const R_IN = 200;
const R_OUT = 400;
const HUB = 156;
const SPOKE_IN = 176;
const SPOKE_OUT = 420;
const RIM = 440;
/** Type rides just outside its band; glyphs ascend away from the hub. */
const TEXT_OFF = 9;
const BAND = 3;
/** Type starts a beat clockwise of the origin ray, never touching it. */
const TEXT_START = 3;

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;

const pt = (r: number, deg: number) => ({
  x: px(CX + r * Math.cos(rad(deg))),
  y: px(CY + r * Math.sin(rad(deg))),
});

/** Clockwise arc. Rounded at serialisation only — an endpoint rounded
 *  before it is used to derive the next number mismatches all over
 *  again. */
const arc = (r: number, from: number, to: number) => {
  const a = pt(r, from);
  const b = pt(r, to);
  return `M${a.x},${a.y}A${px(r)},${px(r)} 0 ${to - from > 180 ? 1 : 0},1 ${b.x},${b.y}`;
};

/** Horizontal anchor for a label parked outside the wheel at `deg`. */
const anchorAt = (deg: number) => {
  const c = Math.cos(rad(deg));
  return c > 0.35 ? ("start" as const) : c < -0.35 ? ("end" as const) : ("middle" as const);
};

export function PressingIntelligenceWheel({
  section,
}: {
  section: IntelligenceFlowSection;
}) {
  const stages = section.stages;
  const max = Math.max(...stages.map((s) => s.value));
  const step = stages.length > 1 ? (R_OUT - R_IN) / (stages.length - 1) : 0;
  const degOf = (v: number) => (v / max) * SWEEP;
  /** First stage outermost. Its arc is the longest, and the outermost
   *  track has the most curve to set type on — the two line up. */
  const radiusOf = (i: number) => R_OUT - i * step;

  return (
    <div className={styles.viz}>
      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${W}`}
          width="100%"
          /* MATERIAL difference from the wide exemplars, named as the
             rule asks: this canvas is SQUARE, so every extra pixel of
             frame width is an extra pixel of height, and the 9px mono
             scales with it — a 1400px frame would draw a 1400px-tall
             wheel lettered at 12.6px. Capped at its own viewBox, the
             type is the size it was drawn at and the wheel is at most a
             screen. Not a new clamp; the same numbers, held still. */
          style={{ maxWidth: W, display: "block", margin: "0 auto" }}
          role="img"
          aria-label={
            `The intelligence pipeline as a wheel: ${stages.length} concentric stage tracks on ` +
            `one relative-volume scale, falling from ${stages[0]?.value} at ${stages[0]?.name} ` +
            `to ${stages[stages.length - 1]?.value} at ${stages[stages.length - 1]?.name}`
          }
        >
          <defs>
            {stages.map((s, i) => (
              <path
                key={s.name}
                id={`ifw-curve-${i}`}
                fill="none"
                d={arc(radiusOf(i) + TEXT_OFF, TEXT_START, SWEEP)}
              />
            ))}
          </defs>

          {/* The scale: four quarter spokes plus the origin ray, and the
              numerals on the rim. The origin ray is a hairline because
              every track starts on it; the rest are the faintest grid. */}
          {[0, 1, 2, 3, 4].map((k) => {
            const deg = (k / 4) * SWEEP;
            const a = pt(SPOKE_IN, deg);
            const b = pt(SPOKE_OUT, deg);
            const at = pt(RIM, deg);
            return (
              <g key={`tick-${k}`}>
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={k === 0 ? RING_INK : RING_SCALE}
                  strokeWidth={RING_FINE}
                />
                <text
                  x={at.x} y={at.y}
                  textAnchor={anchorAt(deg)}
                  dominantBaseline="middle"
                  className={styles.schemNum}
                >
                  {String(Number(((k / 4) * max).toFixed(1)))}
                </text>
              </g>
            );
          })}

          <circle className={styles.schemOrbit} cx={CX} cy={CY} r={HUB} />

          {stages.map((s, i) => {
            const r = radiusOf(i);
            const end = degOf(s.value);
            const prev = i > 0 ? degOf(stages[i - 1].value) : end;
            const dot = pt(r, end);
            /* The value reads INSIDE its band, not outside. Outside, the
               first stage's terminus lands on the scale's own last tick
               and the two numerals print on top of each other. */
            const num = pt(r - 18, end);
            const labelY = px(CY - r);
            return (
              <g key={s.name}>
                {/* The band, in three tones at ONE width. fill/stroke sit
                    on each path, never on the group — a group fill of
                    "none" would erase the labels below it. */}
                {prev < SWEEP && (
                  <path
                    d={arc(r, prev, SWEEP)}
                    fill="none" stroke={RING_INK}
                    strokeWidth={RING_FINE}
                  />
                )}
                {/* what the stage outside it carried and this one does not */}
                {prev > end && (
                  <path
                    d={arc(r, end, prev)}
                    fill="none" stroke={RING_DROP}
                    strokeWidth={BAND}
                  />
                )}
                {/* the volume this stage carries: the datum */}
                <path
                  d={arc(r, 0, end)}
                  fill="none" stroke={RING_INK} strokeWidth={BAND}
                  strokeLinecap="round"
                />
                <circle cx={dot.x} cy={dot.y} r={4} className={styles.schemDot} />
                {/* Full ink, against the grey of the rim scale: the
                    value is the datum, the scale is the ruler. They land
                    at the same angle whenever a stage holds the maximum,
                    and the tone is what tells them apart. */}
                <text
                  x={num.x} y={num.y}
                  textAnchor={anchorAt(end)}
                  dominantBaseline="middle"
                  className={styles.schemNum}
                  style={{ fill: "var(--pp-ink)" }}
                >
                  {s.value}
                </text>

                {/* Row label, in the gutter: numeral over name, right
                    against the origin ray, one row per track. */}
                <text
                  x={CX - 14} y={px(CY - r - 15)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className={styles.schemNum}
                >
                  {String(i + 1).padStart(2, "0")}
                </text>
                <text
                  x={CX - 14} y={labelY}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className={styles.schemLbl}
                >
                  {s.name}
                </text>

                {/* The stage's own items, set on the curve of its track.
                    Type, not measure: nothing is divided, ticked or
                    weighted, because the items carry no weights. */}
                <text className={styles.schemNum}>
                  <textPath href={`#ifw-curve-${i}`} startOffset={0}>
                    {s.items.join(" · ")}
                  </textPath>
                </text>
              </g>
            );
          })}

          {/* The hub carries the product's own lockup, quoted the way the
              A.R.C. schematic quotes its mark. */}
          <text className={styles.schemWordmark} x={CX} y={CY + 6} textAnchor="middle">
            SALLY
          </text>
          <text className={styles.schemSub} x={CX} y={CY + 34} textAnchor="middle">
            MARKETING OS
          </text>
        </svg>
      </div>

      <div className={styles.schemStack}>
        <span className={styles.lbl}>Scale</span>
        <span className={`${styles.lbl} ${styles.grey}`}>
          Relative volume at each stage · {max} at {stages[0]?.name}
        </span>
      </div>
    </div>
  );
}
