"use client";

import { useRef, type CSSProperties } from "react";
import { useVizArrival } from "@/lib/viz-motion";
import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * @shape dots — conforms to lab/viz-system.html
 *
 * PressingMaterialSpan — the Floor & Decor set-membership matrix,
 * transposed under the density budget. Thirteen rotated material names
 * stood over three room rows; rotated label fields are the form the
 * budget retires, so the matrix turns: thirteen material ROWS with
 * level labels, three room COLUMNS headed once, a dot at every true
 * membership and the heavy span connecting a material's rooms. The
 * UpSet grammar, lying down.
 *
 * HEX MOSAIC keeps its honest gap: Urban Southwest and Quiet Glam
 * without Modern Farmhouse, so its connector runs FINE through the
 * column it skips, dots only at its true members. Fine versus heavy
 * carries the distinction; nothing is dimmed.
 *
 * The one emphasis: MARBLE, the only material in all three rooms — the
 * through-line the section's copy argues from — takes the pill at the
 * end of its own row.
 *
 * Memberships verbatim from MaterialOverlap's regions. Arrival lands
 * dots and spans row by row. No reading head: thirteen rows is over
 * the ceiling.
 */

const ROOMS = ["URBAN SOUTHWEST", "MODERN FARMHOUSE", "QUIET GLAM"] as const;

/** Membership per material, verbatim from MaterialOverlap's regions. */
const MATERIALS: { name: string; rooms: number[] }[] = [
  { name: "EXPOSED BRICK", rooms: [0] },
  { name: "MATTE BLACK", rooms: [0] },
  { name: "WHITE OAK", rooms: [0] },
  { name: "POLISHED NICKEL", rooms: [0, 1] },
  { name: "SHIPLAP", rooms: [1] },
  { name: "RECLAIMED WOOD", rooms: [1] },
  { name: "MILK GLASS GLOBES", rooms: [1] },
  { name: "BRASS", rooms: [1, 2] },
  { name: "URCHIN PENDANT", rooms: [2] },
  { name: "VEINED MARBLE WALLS", rooms: [2] },
  { name: "STAR PATTERN TILE", rooms: [2] },
  { name: "HEX MOSAIC", rooms: [0, 2] },
  { name: "MARBLE", rooms: [0, 1, 2] },
];

const W = 1100;
const LEFT = 260;
const COL0 = 380;
const COL_PITCH = 210;
const TOP = 84;
const ROW = 38;
const DOT_R = 6.5;
const H = TOP + MATERIALS.length * ROW + 20;

const colX = (c: number) => px(COL0 + c * COL_PITCH);

export function PressingMaterialSpan() {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);

  return (
    <div className={styles.viz} ref={ref}>
      <div className={styles.head}>
        <span className={styles.lbl}>Materials, by room</span>
        <span className={`${styles.lbl} ${styles.grey}`}>
          {`${MATERIALS.length} materials · ${ROOMS.length} rooms`}
        </span>
      </div>

      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="Which of the three rooms each material appears in; marble is the only material in all three"
        >
          {ROOMS.map((room, c) => (
            <text
              key={room}
              x={colX(c)}
              y={TOP - 34}
              textAnchor="middle"
              className={styles.schemLbl}
            >
              {room}
            </text>
          ))}

          {MATERIALS.map((m, r) => {
            const y = TOP + r * ROW;
            const first = Math.min(...m.rooms);
            const last = Math.max(...m.rooms);
            const gapped = last - first + 1 > m.rooms.length;
            const isDatum = m.name === "MARBLE";
            const lag = `${(r * 0.035).toFixed(3)}s`;
            return (
              <g key={m.name}>
                <text
                  x={LEFT - 30}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className={styles.schemLbl}
                >
                  {m.name}
                </text>
                {m.rooms.length > 1 && (
                  <line
                    className={`${styles.fade} ${drawn ? styles.fadeIn : ""}`}
                    x1={colX(first)}
                    y1={y}
                    x2={colX(last)}
                    y2={y}
                    stroke="var(--pv-ink)"
                    strokeWidth={gapped ? 2 : 9}
                    strokeLinecap="round"
                    style={{ "--lag": lag } as CSSProperties}
                  />
                )}
                {m.rooms.map((c) => (
                  <circle
                    key={c}
                    className={`${styles.fade} ${drawn ? styles.fadeIn : ""}`}
                    cx={colX(c)}
                    cy={y}
                    r={DOT_R}
                    fill="var(--pv-ink)"
                    style={{ "--lag": lag } as CSSProperties}
                  />
                ))}
                {isDatum && (
                  <g
                    className={`${styles.fade} ${drawn ? styles.fadeIn : ""}`}
                    style={{ "--lag": "0.75s" } as CSSProperties}
                  >
                    <rect
                      x={px(COL0 + 2 * COL_PITCH + 40)}
                      y={px(y - 10)}
                      rx={10}
                      width={124}
                      height={20}
                      fill="var(--pv-ink)"
                    />
                    <text
                      x={px(COL0 + 2 * COL_PITCH + 40 + 62)}
                      y={px(y + 4)}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={600}
                      letterSpacing="0.06em"
                      fill="var(--pp-paper)"
                    >
                      ALL THREE ROOMS
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default PressingMaterialSpan;
