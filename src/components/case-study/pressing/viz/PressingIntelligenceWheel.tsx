"use client";

import { useRef, type CSSProperties } from "react";
import type { IntelligenceFlowSection } from "@/lib/types";
import { useVizArrival, useReadingHead } from "@/lib/viz-motion";
import { RING_FINE, RING_INK, RING_DROP } from "@/lib/rings";
import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * @shape rings — conforms to lab/viz-system.html
 *
 * PressingIntelligenceWheel — Sally's pipeline as the sheet's rings,
 * rethought after the first conversion kept too much of the season
 * wheel it replaced. Held against §01 that draft had three competing
 * label systems — a polar ruler at 25/50/75/100, numerals riding every
 * arc's end, and a rail of stage names — plus a 300-degree sweep the
 * sheet does not have and a brand wordmark in a hub the spec says
 * stays empty. All of it gone.
 *
 * This is now the specimen's own drawing: one fine full-circle track
 * per stage, the value as the same circle drawn heavy from twelve
 * o'clock, arc length = the stage's authored relative volume as a
 * share of 100. Outermost ring is the largest stage, so the chart is
 * read outside-in the way the sheet reads. The drop between a stage
 * and the one before it is the heavy GREY arc continuing where the ink
 * stops — a volume the pipeline had and this stage does not, which is
 * the second data state grey exists for.
 *
 * Labels live in one place: the ledger right, numeral first, name
 * after, the stage's own items as the grey line under — the sheet's
 * ledger, verbatim. No ruler: share-of-100 reads against the full
 * track, and the caption states the scale in words.
 *
 * Arrival sweeps the arcs from twelve on the shared curve; the reading
 * head walks the six ledger rows.
 */

const W = 1100;
const H = 560;
const CX = 300;
const CY = 280;
const R0 = 240;
const STEP = 28;
const BAND = 9;

const LX = 640;
const ROW0 = 66;
const ROW_H = 74;

export function PressingIntelligenceWheel({
  section,
}: {
  section: IntelligenceFlowSection;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);
  const head = useReadingHead(ref, section.stages.length);

  const stages = section.stages;

  return (
    <div className={styles.viz} ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block" }}
        role="img"
        aria-label={
          `The pipeline as ${stages.length} rings, arc length is relative volume: ` +
          stages.map((s) => `${s.name} ${s.value}`).join(", ")
        }
      >
        <g>
          {stages.map((s, i) => {
            const r = R0 - i * STEP;
            const C = 2 * Math.PI * r;
            const arc = (s.value / 100) * C;
            const prev = i > 0 ? stages[i - 1].value : s.value;
            const dropArc = Math.max(0, ((prev - s.value) / 100) * C);
            return (
              <g key={s.name}>
                {/* the track: the run the value did not take */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={r}
                  fill="none"
                  stroke={RING_INK}
                  strokeWidth={RING_FINE}
                />
                {/* the drop from the stage before: heavy grey, taking
                    over exactly where the ink stops */}
                {dropArc > 0 ? (
                  <circle
                    cx={CX}
                    cy={CY}
                    r={r}
                    fill="none"
                    stroke={RING_DROP}
                    strokeWidth={BAND}
                    strokeLinecap="round"
                    strokeDasharray={`${px(dropArc)} ${px(C - dropArc)}`}
                    transform={`rotate(${(-90 + s.value * 3.6).toFixed(2)} ${CX} ${CY})`}
                  />
                ) : null}
                {/* the value: heavy ink from twelve o'clock */}
                <circle
                  className={styles.draw}
                  cx={CX}
                  cy={CY}
                  r={r}
                  fill="none"
                  stroke={RING_INK}
                  strokeWidth={BAND}
                  strokeLinecap="round"
                  strokeDasharray={`${px(arc)} ${px(C - arc)}`}
                  strokeDashoffset={drawn ? 0 : px(arc)}
                  transform={`rotate(-90 ${CX} ${CY})`}
                  style={{ "--lag": `${(i * 0.09).toFixed(2)}s` } as CSSProperties}
                />
              </g>
            );
          })}
        </g>

        {/* the ledger: numeral leads, name follows, items under */}
        {stages.map((s, i) => {
          const y = ROW0 + i * ROW_H;
          const walked = head === i;
          return (
            <g key={s.name}>
              <text
                x={LX}
                y={y}
                fontSize={20}
                fontWeight={600}
                style={{
                  fill: "var(--pv-ink)",
                  letterSpacing: "-0.01em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.value}
              </text>
              <text
                x={LX + 64}
                y={y}
                className={styles.lbl}
                style={{
                  fill: walked ? "var(--pv-ink)" : "var(--pv-grey)",
                  transition: "fill 0.32s ease",
                }}
              >
                {s.name.toUpperCase()}
              </text>
              <text
                x={LX + 64}
                y={y + 20}
                className={styles.schemNum}
              >
                {s.items.join(" · ")}
              </text>
            </g>
          );
        })}

        <line
          x1={LX}
          y1={ROW0 + stages.length * ROW_H - 34}
          x2={W - 60}
          y2={ROW0 + stages.length * ROW_H - 34}
          stroke="var(--pv-ink)"
          strokeWidth="var(--pv-fine)"
        />
        <text
          x={LX}
          y={ROW0 + stages.length * ROW_H - 6}
          className={styles.schemLbl}
        >
          RELATIVE VOLUME · SHARE OF 100
        </text>
      </svg>
    </div>
  );
}
