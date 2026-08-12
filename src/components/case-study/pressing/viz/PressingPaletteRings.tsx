"use client";

import { useId, useRef, type CSSProperties } from "react";
import { useVizArrival, useReadingHead } from "@/lib/viz-motion";
import { px } from "@/lib/px";
import { KITCHEN_RINGS, KITCHEN_RINGS_FRAMES, type FinishRing } from "./palettes";
import styles from "./PressingViz.module.css";

/**
 * @shape rings — conforms to lab/viz-system.html
 *
 * PressingPaletteRings — the palette, with the quantity it was missing.
 *
 * The swatch ledger read as a foreign object beside the rest of the kit,
 * and the reason was structural rather than cosmetic: every other chart
 * here draws a QUANTITY, and the palette chart drew none. Its old
 * right-hand column ("2 PRESENCE") was the circos drawing's arc-sizing
 * parameter wearing a label — `span = (f.weight / totalWeight) *
 * availableAngle`, nothing more — so removing it was correct and left
 * four rows of colour measuring nothing at all.
 *
 * The share is now real. `n` is a cluster size from k-means over the 77
 * palette values scripts/build-vision.mjs observed across the study's 16
 * photographs, so arc length says how much of the room each finish
 * accounts for as read across every frame of it. `npm run palette-rings`
 * recomputes and prints the literal.
 *
 * THE ONE PLACE HUE IS PERMITTED, and it is named in the constitution:
 * "accent colour: none. Pure ink. (Colour appears only where hue IS the
 * datum — palette charts — on ink bones.)" So the tracks stay 2px full
 * ink, the ledger stays ink and grey, the axis rule stays ink, and the
 * only coloured marks on the page are the four heavy arcs.
 *
 * THE GRADIENT IS DATA. Each arc runs from the darkest to the lightest
 * value that clustered into that finish, so its length shows the range
 * the material reads across. The brass arc is the study's own sentence
 * made visible: unlacquered brass "darkens at the touchpoints and stays
 * bright where hands don't reach".
 *
 * Every radius, stroke width and ledger offset is the sheet's ring
 * specimen, copied rather than re-derived. ONE deviation, and it is a
 * layout fact rather than a taste call: the ledger starts at y=200
 * instead of the specimen's y=66, because four rows on the specimen's
 * 56px rhythm would hang off the top of a 480px drawing where its own
 * eight rows filled the height.
 *
 * KNOWN AND DELIBERATE: the marble arc is nearly invisible on white.
 * Its range really is #DAD1CA to #EFE9DF, and darkening it so the chart
 * reads more easily would be the chart lying about a near-white
 * material. The ink track behind it carries the position.
 */

/* The specimen's radii and spacing, unchanged. */
const RADII = [240, 212, 184, 156];
const W = 1100;
const H = 560;
const CX = 300;
const CY = 280;
const NUM_X = 640;
const LBL_X = 700;
const ROW_Y0 = 200;
const ROW = 56;
const AXIS_Y = 420;

export interface PressingPaletteRingsProps {
  label?: string;
  finishes?: FinishRing[];
  frames?: number;
}

export function PressingPaletteRings({
  label = "The four finishes",
  finishes = KITCHEN_RINGS,
  frames = KITCHEN_RINGS_FRAMES,
}: PressingPaletteRingsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);
  const head = useReadingHead(ref, finishes.length);
  /* Gradient ids have to be unique per mounted instance: two of these on
     one page would otherwise both resolve url(#g0) to whichever mounted
     last, and the second chart would wear the first one's colours. */
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  const total = finishes.reduce((s, f) => s + f.n, 0);

  return (
    <div className={styles.viz} ref={ref}>
      <div className={styles.head}>
        <span className={styles.lbl}>{label}</span>
        <span className={`${styles.lbl} ${styles.grey}`}>
          {`${finishes.length} finishes · ${total} values`}
        </span>
      </div>

      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label={
            `Four concentric rings. Arc length is each finish's share of ${total} palette ` +
            `values read across ${frames} photographs: ` +
            finishes
              .map((f) => `${f.name} ${Math.round((f.n / total) * 100)} percent`)
              .join(", ") + "."
          }
        >
          <defs>
            {finishes.map((f, i) => {
              const r = RADII[i % RADII.length];
              const a0 = -Math.PI / 2;
              const a1 = a0 + (f.n / total) * Math.PI * 2;
              /* THE GRADIENT RUNS ALONG THE ARC. SVG has no
                 gradient-along-path, so the vector is set from the arc's
                 own start point to its own end point in user space.
                 Every arc here is under 180 degrees, where a straight
                 vector and the arc's sweep agree closely enough to read
                 as following it. Past 180 this wants splitting into
                 segments instead. */
              return (
                <linearGradient
                  key={f.name}
                  id={`${uid}-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={px(CX + Math.cos(a0) * r)}
                  y1={px(CY + Math.sin(a0) * r)}
                  x2={px(CX + Math.cos(a1) * r)}
                  y2={px(CY + Math.sin(a1) * r)}
                >
                  <stop offset="0" stopColor={f.dark} />
                  <stop offset="1" stopColor={f.light} />
                </linearGradient>
              );
            })}
          </defs>

          <g transform={`translate(${CX} ${CY})`}>
            {/* the fine tracks: structure, so full ink and thin */}
            {finishes.map((f, i) => (
              <circle
                key={`t-${f.name}`}
                cx={0}
                cy={0}
                r={RADII[i % RADII.length]}
                fill="none"
                stroke="var(--pv-ink)"
                strokeWidth="var(--pv-fine)"
              />
            ))}

            {/* the heavy marks: the same circle drawn over an arc, from
                12 o'clock, clockwise, read outside-in largest first */}
            <g transform="rotate(-90)">
              {finishes.map((f, i) => {
                const r = RADII[i % RADII.length];
                const circ = 2 * Math.PI * r;
                const arc = circ * (f.n / total);
                return (
                  <circle
                    key={`a-${f.name}`}
                    className={styles.draw}
                    cx={0}
                    cy={0}
                    r={r}
                    fill="none"
                    stroke={`url(#${uid}-${i})`}
                    strokeWidth="var(--pv-heavy)"
                    strokeLinecap="round"
                    strokeDasharray={`${px(arc)} ${px(circ)}`}
                    style={
                      {
                        strokeDashoffset: drawn ? 0 : arc,
                        "--lag": `${(i * 0.06).toFixed(2)}s`,
                      } as CSSProperties
                    }
                  />
                );
              })}
            </g>
          </g>

          {/* the ledger: numeral leads, name follows, one baseline */}
          {finishes.map((f, i) => {
            const y = ROW_Y0 + i * ROW;
            return (
              <g key={`l-${f.name}`}>
                <text className={styles.ringNum} x={NUM_X} y={y}>
                  {f.n}
                </text>
                <text
                  className={`${styles.ringLbl} ${head === i ? styles.ringOn : ""}`}
                  x={LBL_X}
                  y={y}
                >
                  {`${f.name.toUpperCase()} · ${Math.round((f.n / total) * 100)}%`}
                </text>
              </g>
            );
          })}

          {/* The axis caption sits OUTSIDE the walk: the head steps data
              rows, and a caption is not one of them. */}
          <line
            x1={NUM_X}
            y1={AXIS_Y}
            x2={1040}
            y2={AXIS_Y}
            stroke="var(--pv-ink)"
            strokeWidth="var(--pv-fine)"
          />
          <text className={styles.ringLbl} x={NUM_X} y={AXIS_Y + 30}>
            {`SHARE OF ${total} PALETTE VALUES · ${frames} PHOTOGRAPHS`}
          </text>
        </svg>
      </div>
    </div>
  );
}

export default PressingPaletteRings;
