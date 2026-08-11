"use client";

import { useRef, type CSSProperties } from "react";
import { useVizArrival } from "@/lib/viz-motion";
import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * @shape dots — conforms to lab/viz-system.html
 *
 * PressingEditorialRange — twenty InSite stories, transposed under the
 * density budget. The ruled columns set every story name on a slant;
 * rotated label fields are the form the budget retires, and the user's
 * call was to KEEP the labels — so the chart turns sideways. Each story
 * is a row: name level on the left, a fine track running MONOCHROME to
 * SATURATED, the heavy dot parked at the story's authored colour
 * saturation.
 *
 * Rows stay ordered quiet to loud by typographic intensity — the
 * classic's own sort — so the section's argument survives the turn
 * intact: type gets louder DOWN the page and the dots do not drift
 * right with it. The colour stories spike mid-list, the theatrical four
 * run near-monochrome at the loud end. Category runs are found by
 * scanning, never assumed, and each run opens with its own ruled
 * divider — the bracket, lying down.
 *
 * Data verbatim from EditorialTreatments: all twenty names, categories,
 * both authored 0–1 values, the axis words, the category labels.
 * Arrival lands the dots row by row. No reading head: twenty rows is
 * over the ceiling.
 */

type Cat = "designer" | "color" | "theatrical" | "minimal" | "ways";

/** The category labels, verbatim from the classic component's CATEGORIES. */
const CATEGORY_LABEL: Record<Cat, string> = {
  designer: "Designer Spotlight",
  color: "Color Story",
  theatrical: "Theatrical Type",
  minimal: "Minimalism",
  ways: "Ways to Wear",
};

type Story = {
  name: string;
  category: Cat;
  typeIntensity: number;
  colorSaturation: number;
};

const STORIES: Story[] = [
  { name: "Theyskens' Theory", category: "designer", typeIntensity: 0.55, colorSaturation: 0.28 },
  { name: "Rag & Bone", category: "designer", typeIntensity: 0.52, colorSaturation: 0.48 },
  { name: "Derek Lam", category: "designer", typeIntensity: 0.58, colorSaturation: 0.35 },
  { name: "Helmut Lang", category: "designer", typeIntensity: 0.62, colorSaturation: 0.18 },
  { name: "Kelly Wearstler", category: "designer", typeIntensity: 0.6, colorSaturation: 0.55 },

  { name: "Hot Pink", category: "color", typeIntensity: 0.42, colorSaturation: 0.95 },
  { name: "Yellow", category: "color", typeIntensity: 0.45, colorSaturation: 0.88 },
  { name: "Orange", category: "color", typeIntensity: 0.48, colorSaturation: 0.85 },
  { name: "Coral", category: "color", typeIntensity: 0.38, colorSaturation: 0.8 },
  { name: "Rainbow", category: "color", typeIntensity: 0.5, colorSaturation: 0.98 },

  { name: "The Rocker", category: "theatrical", typeIntensity: 0.92, colorSaturation: 0.2 },
  { name: "The Socialite", category: "theatrical", typeIntensity: 0.85, colorSaturation: 0.7 },
  { name: "Classic Beauty", category: "theatrical", typeIntensity: 0.88, colorSaturation: 0.15 },
  { name: "Flora Maxi", category: "theatrical", typeIntensity: 0.78, colorSaturation: 0.45 },

  { name: "Minimalism", category: "minimal", typeIntensity: 0.18, colorSaturation: 0.15 },
  { name: "Structure", category: "minimal", typeIntensity: 0.22, colorSaturation: 0.08 },

  { name: "Black Dress + Ikat", category: "ways", typeIntensity: 0.3, colorSaturation: 0.35 },
  { name: "Black Dress + Denim", category: "ways", typeIntensity: 0.28, colorSaturation: 0.22 },
  { name: "Silk Blouse + Ikat", category: "ways", typeIntensity: 0.32, colorSaturation: 0.4 },
  { name: "Silk Blouse + Denim", category: "ways", typeIntensity: 0.28, colorSaturation: 0.25 },
];

/** Quiet to loud, the classic's own sort; ties keep authored order. */
const ORDER: Story[] = STORIES.map((s, i) => ({ s, i }))
  .sort((a, b) => a.s.typeIntensity - b.s.typeIntensity || a.i - b.i)
  .map((e) => e.s);

/* Category runs, found by scanning — never assumed. */
const RUNS: { label: string; from: number; to: number }[] = [];
ORDER.forEach((s, i) => {
  const open = RUNS[RUNS.length - 1];
  if (open && ORDER[i - 1].category === s.category) open.to = i;
  else RUNS.push({ label: CATEGORY_LABEL[s.category], from: i, to: i });
});

const W = 1100;
const LEFT = 250;
const RIGHT = 60;
const TOP = 80;
const ROW = 30;
const DIV = 40;
const DOT_R = 6;

/** y of a story row, accounting for every divider opened at or before it. */
const rowY = (i: number) => {
  const divsBefore = RUNS.filter((r) => r.from <= i).length;
  return TOP + divsBefore * DIV + i * ROW;
};
const H = rowY(ORDER.length - 1) + 26;

const xAt = (v: number) => px(LEFT + v * (W - LEFT - RIGHT));

export function PressingEditorialRange() {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);

  return (
    <div className={styles.viz} ref={ref}>
      <div className={styles.head}>
        <span className={styles.lbl}>Editorial treatments</span>
        <span className={`${styles.lbl} ${styles.grey}`}>
          RULED QUIET TO LOUD BY TYPOGRAPHIC INTENSITY
        </span>
      </div>

      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="Twenty InSite stories ordered quiet to loud by typographic intensity; each dot marks the story's colour saturation, which does not rise with the loudness"
        >
          <text x={LEFT} y={TOP - 34} className={styles.schemLbl}>
            MONOCHROME
          </text>
          <text
            x={W - RIGHT}
            y={TOP - 34}
            textAnchor="end"
            className={styles.schemLbl}
          >
            SATURATED
          </text>

          {RUNS.map((r) => (
            <g key={r.label}>
              <line
                x1={40}
                y1={px(rowY(r.from) - ROW / 2 - 8)}
                x2={W - 40}
                y2={px(rowY(r.from) - ROW / 2 - 8)}
                stroke="var(--pv-ink)"
                strokeWidth="var(--pv-fine)"
              />
              <text
                x={40}
                y={px(rowY(r.from) - ROW / 2 + 8)}
                className={styles.schemLbl}
                style={{ fill: "var(--pv-ink)" }}
              >
                {r.label.toUpperCase()}
              </text>
            </g>
          ))}

          {ORDER.map((s, i) => {
            const y = px(rowY(i));
            return (
              <g key={s.name}>
                <text
                  x={LEFT - 30}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className={styles.schemLbl}
                >
                  {s.name.toUpperCase()}
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
                  cx={xAt(s.colorSaturation)}
                  cy={y}
                  r={DOT_R}
                  fill="var(--pv-ink)"
                  style={{ "--lag": `${(i * 0.035).toFixed(3)}s` } as CSSProperties}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default PressingEditorialRange;
