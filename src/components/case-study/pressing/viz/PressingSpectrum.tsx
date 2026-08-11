"use client";

import { useRef, type CSSProperties } from "react";
import { useVizArrival } from "@/lib/viz-motion";
import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * @shape dots — conforms to lab/viz-system.html
 *
 * PressingSpectrum — every element of the chalet between its two poles,
 * transposed under the density budget. The drop-line field set nineteen
 * rotated labels above and below one axis; rotated label fields are the
 * form the budget retires. Now each element is a ROW — label level on
 * the left, a fine track running CABIN BONES to MID-CENTURY SENSIBILITY,
 * and the heavy dot parked at the element's authored lean. Same axis,
 * same nineteen positions, read down a ledger instead of around a
 * poster.
 *
 * The element nearest dead centre — the one the section's copy calls
 * the hinge — takes weight in its label, nothing more. Position already
 * says it; a pill would restate the geometry.
 *
 * Rows are authored order (roughly cabin to mid-century), so the dots
 * walk right as the eye walks down — the drift IS the argument.
 * Arrival lands the dots row by row. No reading head: nineteen rows is
 * over the ceiling, and the drift reads itself.
 */

const ELEMENTS: { name: string; lean: number }[] = [
  { name: "RECLAIMED PNW PINE", lean: 0.04 },
  { name: "ANTLERS", lean: 0.06 },
  { name: "EXPOSED BEAMS", lean: 0.1 },
  { name: "PAINTED STONE WALL", lean: 0.12 },
  { name: "WHITE EXTERIOR RAILINGS", lean: 0.18 },
  { name: "WOVEN BENCH", lean: 0.22 },
  { name: "LEANING LADDER SHELF", lean: 0.28 },
  { name: "STRING LIGHTS", lean: 0.3 },
  { name: "WARM GRAY EXTERIOR", lean: 0.42 },
  { name: "A-FRAME GEOMETRY", lean: 0.46 },
  { name: "16-FT GLASS DOORS", lean: 0.5 },
  { name: "PNW PINE FLOORS", lean: 0.55 },
  { name: "TUFTED GRAY SOFA", lean: 0.68 },
  { name: "WALNUT COFFEE TABLE", lean: 0.74 },
  { name: "LEATHER SLING CHAIR", lean: 0.78 },
  { name: "WALNUT DINING SET", lean: 0.86 },
  { name: "TRACK LIGHTING", lean: 0.88 },
  { name: "MALM FIREPLACE", lean: 0.92 },
  { name: "SPUTNIK CHANDELIER", lean: 0.96 },
];

/** The hinge: the element closest to dead centre. */
const ACCENT = ELEMENTS.reduce((best, e) =>
  Math.abs(e.lean - 0.5) < Math.abs(best.lean - 0.5) ? e : best
);

const W = 1100;
const LEFT = 250;
const RIGHT = 60;
const TOP = 76;
const ROW = 32;
const DOT_R = 6;
const H = TOP + ELEMENTS.length * ROW + 16;

const xAt = (lean: number) => px(LEFT + lean * (W - LEFT - RIGHT));

export function PressingSpectrum() {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);

  return (
    <div className={styles.viz} ref={ref}>
      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label={`Every element of the chalet placed between cabin bones and mid-century sensibility; ${ACCENT.name} sits closest to the centre`}
        >
          {/* the poles, once, above the track column */}
          <text x={LEFT} y={TOP - 34} className={styles.schemLbl}>
            CABIN BONES
          </text>
          <text
            x={W - RIGHT}
            y={TOP - 34}
            textAnchor="end"
            className={styles.schemLbl}
          >
            MID-CENTURY SENSIBILITY
          </text>

          {ELEMENTS.map((e, i) => {
            const y = TOP + i * ROW;
            const hinge = e === ACCENT;
            return (
              <g key={e.name}>
                <text
                  x={LEFT - 30}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className={styles.schemLbl}
                  style={hinge ? { fill: "var(--pv-ink)", fontWeight: 700 } : undefined}
                >
                  {e.name}
                </text>
                <line
                  x1={LEFT}
                  y1={y}
                  x2={W - RIGHT}
                  y2={y}
                  stroke="var(--pv-ink)"
                  strokeWidth="var(--pv-fine)"
                />
                <circle
                  className={`${styles.fade} ${drawn ? styles.fadeIn : ""}`}
                  cx={xAt(e.lean)}
                  cy={y}
                  r={DOT_R}
                  fill="var(--pv-ink)"
                  style={{ "--lag": `${(i * 0.04).toFixed(2)}s` } as CSSProperties}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default PressingSpectrum;
