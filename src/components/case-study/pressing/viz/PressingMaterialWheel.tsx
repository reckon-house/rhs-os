"use client";

import { useRef, type CSSProperties } from "react";
import { useVizArrival } from "@/lib/viz-motion";
import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * @shape dots — conforms to lab/viz-system.html
 *
 * PressingMaterialWheel — the kitchen's material system, rethought
 * after the circos conversion failed the density budget. The wheel
 * carried fifteen rotated rim labels, four names set on curves, ruler
 * spokes and a hub lockup — every one of those a form the sheet never
 * uses, kept alive by swapping strokes under old geometry. Which
 * finish lands on which surface is PRESENCE across two axes, and
 * presence is the dot matrix.
 *
 * Fifteen surface rows, four finish columns, every label level. The
 * large disc is a hit, the small dot is a slot, both solid ink — the
 * calendar-poster grammar, verbatim from the sheet. The authored
 * `weight` (the classic's own "relative arc size") rides the row's end
 * as a grey numeral: printed, never drawn, the same treatment the
 * swatch ledger gives it — a figure a reader can use without the chart
 * claiming a ranking the copy never makes.
 *
 * Data is the circos original's, unchanged: four finish names, fifteen
 * surfaces, every membership, every weight.
 *
 * Arrival lays the slot grid down first and lands the hits after — the
 * field of possibilities resolving into the spec. No reading head:
 * fifteen rows is over the ceiling, and the rows are the walk.
 */

const MATERIALS = [
  "SAGE GREEN",
  "WHITE OAK",
  "CALACATTA MARBLE",
  "UNLACQUERED BRASS",
];
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

const W = 1100;
const LEFT = 250;
const COLS_X0 = 340;
const COL_PITCH = 170;
const WEIGHT_X = 1050;
const TOP = 84;
const ROW = 40;
const HIT_R = 9;
const SLOT_R = 2.5;
const H = TOP + ZONES.length * ROW + 24;

export function PressingMaterialWheel() {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);

  return (
    <div className={styles.viz} ref={ref}>
      <div className={styles.head}>
        <span className={styles.lbl}>Material system</span>
        <span className={`${styles.lbl} ${styles.grey}`}>
          {`${MATERIALS.length} finishes · ${ZONES.length} surfaces`}
        </span>
      </div>

      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label={`Which of the four finishes lands on each of the fifteen kitchen surfaces. ${MATERIALS.join(", ")}.`}
        >
          {MATERIALS.map((m, c) => (
            <text
              key={m}
              x={px(COLS_X0 + c * COL_PITCH)}
              y={TOP - 34}
              textAnchor="middle"
              className={styles.schemLbl}
            >
              {m}
            </text>
          ))}

          {ZONES.map((z, r) => {
            const y = TOP + r * ROW;
            return (
              <g key={z.name}>
                <text
                  x={LEFT - 30}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className={styles.schemLbl}
                >
                  {z.name}
                </text>
                {MATERIALS.map((_, c) => {
                  const hit = z.materials.includes(c);
                  return (
                    <circle
                      key={c}
                      className={`${styles.fade} ${drawn ? styles.fadeIn : ""}`}
                      cx={px(COLS_X0 + c * COL_PITCH)}
                      cy={y}
                      r={hit ? HIT_R : SLOT_R}
                      fill="var(--pv-ink)"
                      style={
                        {
                          "--lag": hit
                            ? `${(0.35 + r * 0.03).toFixed(2)}s`
                            : `${(r * 0.02).toFixed(2)}s`,
                        } as CSSProperties
                      }
                    />
                  );
                })}
                <text
                  x={WEIGHT_X}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className={styles.schemNum}
                >
                  {z.weight}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
