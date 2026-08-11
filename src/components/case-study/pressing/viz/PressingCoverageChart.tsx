"use client";

import { useRef, type CSSProperties } from "react";
import type { CoverageChartSection } from "@/lib/types";
import { useVizArrival } from "@/lib/viz-motion";
import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

const usd = (n: number) => "$" + n.toLocaleString("en-US");

/**
 * @shape sticks — conforms to lab/viz-system.html
 *
 * The gap chart — the pressing skin for `coverage-chart`, redrawn as a
 * single grounded STICK crossed by a level line (lab/viz-system.html
 * §02).
 *
 * One mark, one level: the documented value stands as the heavy stick,
 * the policy limit cuts across it as a grey line — grey because the
 * limit is the chart's second data state, not its structure — and the
 * stretch of stick above that line IS the gap. The pill sits on the
 * gap figure because the overshoot is the one thing this section
 * exists to say. The gap is computed from the study's own two numbers:
 * arithmetic, not authorship.
 *
 * No reading head — a single-datum chart has nothing to walk. Arrival
 * draws the stick up, then the level across, then the pill lands.
 */

const W = 1100;
const H = 470;
const BASE = 400;
const PLOT = 330;
const STICK_X = 300;
const STICK_W = 10;
/* the level line runs wide of the stick on both sides, so it reads as
   a water line the value stands out of, not a serif on the bar */
const LEVEL_X1 = 160;
const LEVEL_X2 = 760;

export function PressingCoverageChart({
  section,
}: {
  section: CoverageChartSection;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);

  const { assetAmount, policyAmount } = section;
  const gap = assetAmount - policyAmount;
  const topY = BASE - PLOT;
  const levelY = BASE - (policyAmount / assetAmount) * PLOT;

  const stickLen = PLOT - STICK_W; /* inset for the round caps */
  const levelLen = LEVEL_X2 - LEVEL_X1;
  /* the pill rides the middle of the overshoot, beside the stick */
  const gapMidY = (topY + levelY) / 2;
  const gapLabel = `GAP ${usd(gap)}`;
  const pillW = gapLabel.length * 6.6 + 30;

  return (
    <div className={styles.viz} ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block" }}
        role="img"
        aria-label={`${section.assetValue} ${usd(assetAmount)} against ${section.policyLimit} ${usd(policyAmount)}: a coverage gap of ${usd(gap)}`}
      >
        <line
          x1={60}
          y1={BASE}
          x2={W - 60}
          y2={BASE}
          stroke="var(--pv-ink)"
          strokeWidth="var(--pv-fine)"
        />

        {/* the documented value, standing */}
        <line
          className={styles.draw}
          x1={STICK_X}
          y1={BASE - STICK_W / 2}
          x2={STICK_X}
          y2={topY + STICK_W / 2}
          stroke="var(--pv-ink)"
          strokeWidth={STICK_W}
          strokeLinecap="round"
          strokeDasharray={px(stickLen)}
          strokeDashoffset={drawn ? 0 : px(stickLen)}
        />

        {/* the policy limit, cutting across: the second data state */}
        <line
          className={styles.draw}
          x1={LEVEL_X1}
          y1={px(levelY)}
          x2={LEVEL_X2}
          y2={px(levelY)}
          stroke="var(--pv-grey)"
          strokeWidth="var(--pv-fine)"
          strokeDasharray={px(levelLen)}
          strokeDashoffset={drawn ? 0 : px(levelLen)}
          style={{ "--lag": "0.55s" } as CSSProperties}
        />

        {/* the value, at the top of its own mark */}
        <text
          x={STICK_X + 34}
          y={px(topY + 8)}
          fontSize={20}
          fontWeight={600}
          style={{ fill: "var(--pv-ink)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}
        >
          {usd(assetAmount)}
        </text>
        <text
          x={STICK_X + 34}
          y={px(topY + 30)}
          className={styles.lbl}
          style={{ fill: "var(--pv-ink)" }}
        >
          {section.assetValue}
        </text>

        {/* the limit, named at its own level */}
        <text
          x={LEVEL_X2 + 16}
          y={px(levelY + 5)}
          fontSize={20}
          fontWeight={600}
          style={{ fill: "var(--pv-grey)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}
        >
          {usd(policyAmount)}
        </text>
        <text
          x={LEVEL_X2 + 16}
          y={px(levelY + 26)}
          className={styles.lbl}
          style={{ fill: "var(--pv-grey)" }}
        >
          {section.policyLimit}
        </text>

        {/* the overshoot named: the one emphasis on the page */}
        {gap > 0 ? (
          <g
            className={`${styles.fade} ${drawn ? styles.fadeIn : ""}`}
            style={{ "--lag": "1.15s" } as CSSProperties}
          >
            <rect
              x={STICK_X + 34}
              y={px(gapMidY - 10)}
              rx={10}
              width={px(pillW)}
              height={20}
              fill="var(--pv-ink)"
            />
            <text
              x={px(STICK_X + 34 + pillW / 2)}
              y={px(gapMidY + 4)}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              letterSpacing="0.06em"
              fill="var(--pp-paper)"
            >
              {gapLabel}
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}
