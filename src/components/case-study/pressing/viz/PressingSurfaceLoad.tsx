"use client";

import { useRef, type CSSProperties } from "react";
import { useVizArrival, useReadingHead } from "@/lib/viz-motion";
import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * @shape sticks — conforms to lab/viz-system.html
 *
 * PressingSurfaceLoad — the Jeffrey flagship's surfaces, transposed
 * under the density budget. The ruled columns set eight surface names
 * on a slant and hung a second reading below the baseline; rotated
 * label fields are the form the budget retires, so the chart turns:
 * eight surface ROWS, labels level, and the row carries both readings
 * side by side — the grounded stick for how much was built, then the
 * dot run for what it was built out of. Same rule, two readings,
 * readable left to right.
 *
 * The stick is horizontal off one fine vertical baseline, its length
 * the surface's asset count on one shared scale, the numeral at its
 * end because 6 and 8 are honest but invisible next to 240 — the same
 * trade the classic made, stated the same way. Membership dots are the
 * sheet's two sizes: large disc a hit, small dot a slot, both solid.
 *
 * Data verbatim from JeffreyFlagshipRadius: eight surface names,
 * their asset counts, six element names, every membership. Order stays
 * authored; it carried no stated meaning and none is claimed. The 358
 * total is summed, not restated.
 *
 * Arrival draws sticks then lands hits; the reading head walks the
 * eight surface names.
 */

const ELEMENTS = [
  "WORDMARK",
  "AVENIR NEXT HEAVY",
  "DEMI BOLD / CTA",
  "MODULAR GRID",
  "EDITORIAL PHOTOGRAPHY",
  "CURATORIAL VOICE",
];
/** Two-line header stacks — line breaks only, nothing renamed. */
const ELEMENT_LINES: string[][] = [
  ["WORDMARK"],
  ["AVENIR NEXT", "HEAVY"],
  ["DEMI BOLD", "/ CTA"],
  ["MODULAR", "GRID"],
  ["EDITORIAL", "PHOTOGRAPHY"],
  ["CURATORIAL", "VOICE"],
];

const SURFACES: { name: string; assets: number; elements: number[] }[] = [
  { name: "HOMEPAGE MODULES", assets: 12, elements: [0, 1, 3, 4, 5] },
  { name: "DESIGNER PAGES", assets: 38, elements: [0, 1, 2, 3, 4] },
  { name: "PRODUCT DETAIL PAGES", assets: 240, elements: [2, 3, 4] },
  { name: "EDITORIAL SPREADS", assets: 14, elements: [1, 3, 4, 5] },
  { name: "BUYING EDIT", assets: 22, elements: [3, 4, 5] },
  { name: "EMAIL CAMPAIGNS", assets: 18, elements: [0, 1, 2, 4] },
  { name: "NAVIGATION SYSTEM", assets: 6, elements: [0, 2, 3] },
  { name: "CART & CHECKOUT", assets: 8, elements: [2, 3] },
];
const TOTAL = SURFACES.reduce((n, s) => n + s.assets, 0);
const MAX = Math.max(...SURFACES.map((s) => s.assets));

const W = 1100;
const LEFT = 235;
const STICK_X0 = 262;
const STICK_SPAN = 250;
const DOTS_X0 = 620;
const DOT_PITCH = 90;
const TOP = 110;
const ROW = 46;
const STICK = 9;
const HIT_R = 6.5;
const SLOT_R = 2.5;
const H = TOP + SURFACES.length * ROW + 20;

const dotX = (c: number) => px(DOTS_X0 + c * DOT_PITCH);

export function PressingSurfaceLoad() {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);
  const head = useReadingHead(ref, SURFACES.length);

  return (
    <div className={styles.viz} ref={ref}>
      <div className={styles.head}>
        <span className={styles.lbl}>Surface load</span>
        <span className={`${styles.lbl} ${styles.grey}`}>
          {`${SURFACES.length} surfaces · ${TOTAL} assets · ${ELEMENTS.length} system elements`}
        </span>
      </div>

      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label={`Eight surfaces of the Jeffrey flagship: asset volume as sticks on one scale, and which of the six system elements each surface uses`}
        >
          {/* the asset scale's baseline, vertical */}
          <line
            x1={STICK_X0 - 8}
            y1={TOP - 24}
            x2={STICK_X0 - 8}
            y2={H - 14}
            stroke="var(--pv-ink)"
            strokeWidth="var(--pv-fine)"
          />

          {/* element headers, level, two lines max */}
          {ELEMENT_LINES.map((lines, c) => (
            <g key={ELEMENTS[c]}>
              {lines.map((ln, li) => (
                <text
                  key={ln}
                  x={dotX(c)}
                  y={TOP - 46 + li * 13}
                  textAnchor="middle"
                  className={styles.schemLbl}
                >
                  {ln}
                </text>
              ))}
            </g>
          ))}

          {SURFACES.map((s, r) => {
            const y = TOP + r * ROW;
            const len = Math.max(6, (s.assets / MAX) * STICK_SPAN);
            const x1 = STICK_X0 + STICK / 2;
            const x2 = STICK_X0 + len - STICK / 2;
            const drawLen = Math.max(0.01, x2 - x1);
            return (
              <g key={s.name}>
                <text
                  x={LEFT - 16}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className={styles.schemLbl}
                  style={{
                    fill: head === r ? "var(--pv-ink)" : undefined,
                    transition: "fill 0.32s ease",
                  }}
                >
                  {s.name}
                </text>

                <line
                  className={styles.draw}
                  x1={px(x1)}
                  y1={y}
                  x2={px(x2)}
                  y2={y}
                  stroke="var(--pv-ink)"
                  strokeWidth={STICK}
                  strokeLinecap="round"
                  strokeDasharray={px(drawLen)}
                  strokeDashoffset={drawn ? 0 : px(drawLen)}
                  style={{ "--lag": `${(r * 0.06).toFixed(2)}s` } as CSSProperties}
                />
                <text
                  x={px(STICK_X0 + len + 14)}
                  y={y}
                  dominantBaseline="middle"
                  fontSize={15}
                  fontWeight={600}
                  style={{
                    fill: "var(--pv-ink)",
                    letterSpacing: "-0.01em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.assets}
                </text>

                {ELEMENTS.map((_, c) => {
                  const hit = s.elements.includes(c);
                  return (
                    <circle
                      key={c}
                      className={`${styles.fade} ${drawn ? styles.fadeIn : ""}`}
                      cx={dotX(c)}
                      cy={y}
                      r={hit ? HIT_R : SLOT_R}
                      fill="var(--pv-ink)"
                      style={
                        {
                          "--lag": hit
                            ? `${(0.4 + r * 0.04).toFixed(2)}s`
                            : `${(r * 0.03).toFixed(2)}s`,
                        } as CSSProperties
                      }
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default PressingSurfaceLoad;
