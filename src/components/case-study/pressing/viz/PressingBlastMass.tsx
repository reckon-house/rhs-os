"use client";

import { useRef, type CSSProperties } from "react";
import { px } from "@/lib/px";
import { useVizArrival, useReadingHead } from "@/lib/viz-motion";
import styles from "./PressingViz.module.css";

/**
 * @shape stripes — conforms to lab/viz-system.html
 *
 * PressingBlastMass — the pressing skin for `campaign-blast-radius`,
 * redrawn as the sheet's STRIPES (§03) after the solid stepped mass
 * failed the user's own test against the drawn specimens. The mass had
 * been grandfathered in prose — "the stripes family's solid-ink
 * sibling" — and a prose exemption is exactly how a system erodes: held
 * against the sheet it was a slab with square corners and labels buried
 * in the ink. The sheet's stripes specimen was drawn FROM this very
 * data, so this component now implements that specimen, extended from
 * the top four channels to all eight.
 *
 * Every channel the Ivy Park system shipped through, ranked by asset
 * volume and drawn as ONE continuous silhouette rather than eight bars.
 * No gaps: the treads carry the comparison themselves, and the fall from
 * forty-two product-page assets to a single scrolling experience is the
 * argument the section makes.
 *

 *
 * Kept verbatim from CampaignBlastRadius: the eight channel names, their
 * asset counts, the five visual-element names, and which elements each
 * channel carries. Rank order, the 116 total and the x-of-five tallies
 * are arithmetic on that data, not new authorship.
 *
 * Deliberately not carried over: the 400 scatter particles, the
 * ninety-two rays, the three circos tracks of generated micro-bars and
 * the rim dots — density that looked like data (the ridgeline lesson),
 * every one of it drawn by a seeded RNG whose float strings are also
 * what puts the classic version a hydration mismatch away from being
 * thrown out on load. Gone too: the #0088cc reserved for Color Product
 * (one ink here, hierarchy by opacity), the legend that blue then
 * required (with one ink there is nothing to decode), the five rotating
 * hex outlines at the hub (this study draws its own mark properly in
 * `hex-polygon`), and the "95% SOLD OUT IN DAYS" line, which is the
 * closing section's fact and belongs at exactly one altitude.
 *
 * No accent. The step shape is the whole point and no single datum
 * carries it, so the chart gets none.
 *
 * Each channel is a stripe mass capped by the horizontal round-capped
 * bar — one mark, lying down, riding just above its texture. Numeral
 * and name sit ABOVE the cap in ink, level, per the density budget: no
 * type reversed inside ink, nothing on a slant. Arrival fills each mass
 * and lands its cap after; the reading head walks the eight names.
 */

/** The visual system, verbatim from CampaignBlastRadius. */
const ELEMENTS = [
  "POLYGON FRAME",
  "TYPOGRAPHY",
  "B&W PHOTOGRAPHY",
  "COLOR PRODUCT",
  "MOTION / SCROLL",
];

/**
 * The channels, verbatim and in the classic component's source order —
 * asset count, and the indices of the system elements each one carries.
 */
const CHANNELS: { name: string; assets: number; elements: number[] }[] = [
  { name: "SCROLLING EXPERIENCE", assets: 1, elements: [0, 1, 2, 3, 4] },
  { name: "LAUNCH EMAILS", assets: 6, elements: [0, 1, 2, 3] },
  { name: "SOCIAL ASSETS", assets: 24, elements: [0, 1, 2, 3] },
  { name: "DIGITAL ADS", assets: 18, elements: [1, 2, 3] },
  { name: "IN-STORE DIGITAL", assets: 8, elements: [0, 1, 2] },
  { name: "PRODUCT PAGES", assets: 42, elements: [1, 3] },
  { name: "SITE PLACEMENTS", assets: 12, elements: [0, 1, 2, 3] },
  { name: "CMS COMPONENTS", assets: 5, elements: [0, 4] },
];

/* The rank is the chart's doing, not the data's — sorting a fixed array
   is deterministic, and doing it here rather than by hand keeps the
   const above a straight lift of the authored list. */
const RANKED = [...CHANNELS].sort((a, b) => b.assets - a.assets);
const TOTAL = CHANNELS.reduce((n, c) => n + c.assets, 0);
const PEAK = RANKED[0].assets;

const W = 1240;
const PAD = 56;
const GAP = 24;
const COL = (W - PAD * 2 - GAP * 7) / 8; // 120
const BASE = 470;
const PLOT = 320;
const CAP_H = 16;
const CAP_GAP = 5;
const PITCH = 9;
const SW = 2.5;
const H = 560;

const colX = (i: number) => PAD + i * (COL + GAP);

export function PressingBlastMass() {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);
  const head = useReadingHead(ref, RANKED.length);

  return (
    <div className={styles.viz} ref={ref}>
      <div className={styles.head}>
        <span className={styles.lbl}>Campaign blast radius</span>
        <span className={`${styles.lbl} ${styles.grey}`}>
          {`1 visual system · ${RANKED.length} channels · ${TOTAL} assets`}
        </span>
      </div>

      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="The campaign's eight channels ranked by asset volume as stripe masses, from 42 product-page assets down to the single scrolling experience"
        >
          <line
            x1={PAD - 16}
            y1={BASE}
            x2={W - PAD + 16}
            y2={BASE}
            stroke="var(--pv-ink)"
            strokeWidth="var(--pv-fine)"
          />

          {RANKED.map((c, i) => {
            const x = colX(i);
            const h = (c.assets / PEAK) * PLOT;
            const capY = BASE - h;
            const stripes: number[] = [];
            for (let y = capY + CAP_H + CAP_GAP; y <= BASE - SW; y += PITCH) {
              stripes.push(y);
            }
            const mid = px(x + COL / 2);
            return (
              <g key={c.name}>
                {/* the cap: the stick lying down, the value's own mark */}
                <rect
                  className={`${styles.fade} ${drawn ? styles.fadeIn : ""}`}
                  x={px(x)}
                  y={px(capY)}
                  rx={CAP_H / 2}
                  width={px(COL)}
                  height={CAP_H}
                  fill="var(--pv-ink)"
                  style={{ "--lag": `${(0.4 + i * 0.07).toFixed(2)}s` } as CSSProperties}
                />
                {/* the mass: round-capped stripes, inset for their caps */}
                {stripes.map((y, s) => (
                  <line
                    key={y}
                    className={styles.draw}
                    x1={px(x + SW / 2)}
                    y1={px(y)}
                    x2={px(x + COL - SW / 2)}
                    y2={px(y)}
                    stroke="var(--pv-ink)"
                    strokeWidth={SW}
                    strokeLinecap="round"
                    strokeDasharray={px(COL - SW)}
                    strokeDashoffset={drawn ? 0 : px(COL - SW)}
                    style={{ "--lag": `${(i * 0.07 + s * 0.006).toFixed(3)}s` } as CSSProperties}
                  />
                ))}
                <text
                  x={mid}
                  y={px(capY - 34)}
                  textAnchor="middle"
                  fontSize={18}
                  fontWeight={600}
                  style={{
                    fill: "var(--pv-ink)",
                    letterSpacing: "-0.01em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {c.assets}
                </text>
                <text
                  x={mid}
                  y={px(capY - 14)}
                  textAnchor="middle"
                  className={styles.schemLbl}
                  style={{
                    fill: head === i ? "var(--pv-ink)" : undefined,
                    transition: "fill 0.32s ease",
                  }}
                >
                  {c.name}
                </text>
              </g>
            );
          })}

          <line
            x1={PAD - 16}
            y1={BASE + 56}
            x2={W - PAD + 16}
            y2={BASE + 56}
            stroke="var(--pv-ink)"
            strokeWidth="var(--pv-fine)"
          />
          <text x={PAD - 16} y={BASE + 78} className={styles.schemLbl}>
            SYSTEM ELEMENTS PER CHANNEL
          </text>
          <text
            x={W - PAD + 16}
            y={BASE + 78}
            textAnchor="end"
            className={styles.schemNum}
          >
            {ELEMENTS.join(" \u00b7 ")}
          </text>
        </svg>
      </div>
    </div>
  );
}
