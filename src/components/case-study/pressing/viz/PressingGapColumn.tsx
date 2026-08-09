"use client";

/**
 * PressingGapColumn — the coverage gap, drawn narrow, for the copy
 * column.
 *
 * `PressingCoverageChart` is the wide form: two horizontal rows off one
 * scale, full measure, in its own frame. This is the same fact at
 * column width, where a horizontal bar has nowhere to go. Turned
 * upright, the chart says the thing the section says: the documented
 * value KEEPS CLIMBING and the policy limit does not move, so the
 * overshoot is the distance above a line that was set once and never
 * touched again.
 *
 * The viz kit's rules hold — one ink, hairlines, one accent, and the
 * accent lands only on the datum the chart exists to show. Everything
 * above the policy line is the gap, and it is the only coloured thing
 * in the section.
 *
 * Numbers are the study's own and the gap is computed from them, so it
 * cannot drift from the copy beside it.
 */

import type { CSSProperties } from "react";
import styles from "./PressingViz.module.css";

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export interface PressingGapColumnProps {
  assetValue: string;
  assetAmount: number;
  policyLimit: string;
  policyAmount: number;
}

export function PressingGapColumn({
  assetValue,
  assetAmount,
  policyLimit,
  policyAmount,
}: PressingGapColumnProps) {
  /* The bar is the documented value, so the scale tops out there and
     the limit sits somewhere below it. If a study is UNDER its limit
     the arithmetic still holds — the line simply lands above the bar's
     top and there is no accent segment to draw. */
  const top = Math.max(assetAmount, policyAmount);
  const limitPct = (policyAmount / top) * 100;
  const gap = assetAmount - policyAmount;

  return (
    <div className={`${styles.viz} ${styles.gapCol}`}>
      <div
        className={styles.gapPlot}
        style={{ "--limit": `${limitPct.toFixed(2)}%` } as CSSProperties}
      >
        {/* the bar, growing up from the baseline */}
        <div className={styles.gapBar}>
          {gap > 0 ? <span className={styles.gapOver} /> : null}
        </div>

        {/* the policy limit, a hairline straight across the plot */}
        <div className={styles.gapLimit} />

        <div className={styles.gapTopLbl}>
          <span className={styles.val}>{usd(assetAmount)}</span>
          <span className={styles.lbl}>{assetValue}</span>
        </div>

        <div className={styles.gapLimitLbl}>
          <span className={styles.valSm}>{usd(policyAmount)}</span>
          <span className={`${styles.lbl} ${styles.grey}`}>{policyLimit}</span>
        </div>

        {gap > 0 ? (
          <div className={styles.gapCallout}>
            <span className={`${styles.lbl} ${styles.acc}`}>Gap</span>
            <span className={`${styles.valSm} ${styles.acc}`}>{usd(gap)}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PressingGapColumn;
