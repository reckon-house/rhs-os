"use client";

import { useRef, type CSSProperties } from "react";
import type { AIHeatmapSection } from "@/lib/types";
import { useVizArrival, useReadingHead } from "@/lib/viz-motion";
import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * @shape sticks — conforms to lab/viz-system.html
 *
 * PressingSignalMatrix — the competitive signal grid, rethought after
 * two earlier drafts failed the sheet. The squares version scaled marks
 * by side and leaned on an accent; the dots version fixed the area
 * maths but was still forty near-same-size discs, because the sheet's
 * dot matrix carries PRESENCE in two sizes and this data is forty
 * CONTINUOUS indices — a wall of blobs, not the calendar poster's
 * rhythm. Continuous magnitude is the sticks' job.
 *
 * So: small multiples. One row per retailer, and each row is the
 * grounded-sticks specimen at ledger scale — eight heavy round-capped
 * sticks off the row's own fine baseline, all five rows on one shared
 * scale so a column can be read down the page as honestly as a row
 * reads across. Category labels print once, on the first baseline.
 *
 * No emphasis device. The strongest signal on the grid is the tallest
 * stick, visibly, by construction; a pill on top of that would restate
 * what the geometry says. The aria-label still names it for anyone not
 * reading the heights.
 *
 * Arrival draws each row's sticks up with the rows staggered; the
 * reading head walks the five retailer names.
 */

const W = 1100;
const LEFT = 220;
const RIGHT = 40;
const TOP = 70;
const ROW_PITCH = 108;
const STICK_MAX = 72;
const STICK = 8;

export function PressingSignalMatrix({ section }: { section: AIHeatmapSection }) {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);
  const head = useReadingHead(ref, section.competitors.length);

  const { competitors, categories, data } = section;
  const pitch = (W - LEFT - RIGHT) / categories.length;
  const cx = (c: number) => px(LEFT + (c + 0.5) * pitch);
  const baseY = (r: number) => TOP + STICK_MAX + r * ROW_PITCH;

  let accR = 0, accC = 0, best = -Infinity;
  data.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v > best) { best = v; accR = r; accC = c; }
    })
  );

  const H = baseY(competitors.length - 1) + 16;

  return (
    <div className={styles.viz} ref={ref}>
      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label={`Competitive signal across ${categories.length} categories for ${competitors.length} retailers, one stick row per retailer on one shared scale. The strongest signal is ${competitors[accR]} in ${categories[accC]}.`}
        >
          {/* category labels, once, above the first row */}
          {categories.map((cat, c) => (
            <text
              key={cat}
              x={cx(c)}
              y={TOP - 26}
              textAnchor="middle"
              className={styles.schemLbl}
            >
              {cat.toUpperCase()}
            </text>
          ))}

          {competitors.map((name, r) => {
            const y = baseY(r);
            return (
              <g key={name}>
                <line
                  x1={LEFT - 16}
                  y1={y}
                  x2={W - RIGHT}
                  y2={y}
                  stroke="var(--pv-ink)"
                  strokeWidth="var(--pv-fine)"
                />
                <text
                  x={LEFT - 36}
                  y={y - 4}
                  textAnchor="end"
                  className={styles.lbl}
                  style={{
                    fill: head === r ? "var(--pv-ink)" : "var(--pv-grey)",
                    transition: "fill 0.32s ease",
                  }}
                >
                  {name.toUpperCase()}
                </text>

                {data[r].map((v, c) => {
                  const h = Math.max(6, v * STICK_MAX);
                  const y1 = y - STICK / 2;
                  const y2 = y - h + STICK / 2;
                  const len = Math.max(0.01, Math.abs(y1 - y2));
                  return (
                    <line
                      key={c}
                      className={styles.draw}
                      x1={cx(c)}
                      y1={px(y1)}
                      x2={cx(c)}
                      y2={px(y2)}
                      stroke="var(--pv-ink)"
                      strokeWidth={STICK}
                      strokeLinecap="round"
                      strokeDasharray={px(len)}
                      strokeDashoffset={drawn ? 0 : px(len)}
                      style={{ "--lag": `${(r * 0.1 + c * 0.02).toFixed(2)}s` } as CSSProperties}
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
