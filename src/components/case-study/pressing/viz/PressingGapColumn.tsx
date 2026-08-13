"use client";

/**
 * @shape sticks — conforms to lab/viz-system.html
 *
 * PressingGapColumn — the coverage gap at copy-column measure.
 *
 * `PressingCoverageChart` is the wide form, full measure, in its own
 * frame. This is the same two numbers inside the brief's 380px column.
 *
 * IT WAS UPRIGHT AND THE UPRIGHT IS WHAT BROKE IT. A vertical stick
 * has to hang its labels at the heights the data puts them, so the
 * copy is positioned by arithmetic rather than by rhythm: the limit
 * label sat at `bottom: 76.6%` and the value label at `top: 0`, which
 * left the two of them about 70px of room for 100px of type. They
 * collided. Not a near miss either — the tighter the coverage gap, the
 * harder they overlap, so the chart read worst exactly when the story
 * was most alarming. Below them three quarters of a 300px plot was
 * bare stick with nothing beside it.
 *
 * Lying the sticks down fixes the cause rather than the symptom. Rows
 * sit on a fixed rhythm, so no label position is ever a function of a
 * number, and no value can make two of them meet. The earlier note
 * here said a horizontal bar had nowhere to go at this width; at the
 * brief column's 380px these two run 380 and 291, so the difference is
 * 89px of daylight, which is the whole point of the section.
 *
 * One scale, two sticks, and the gap is the overhang between their
 * ends rather than a third quantity drawn on top. The limit is grey
 * because a limit set once and never revisited is a second data state,
 * which is the one job §02 keeps grey for. The pill names the overhang
 * and sits ON it, so the number and the distance it measures are the
 * same object.
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
  /* One scale, topped by whichever number is larger, so the sticks are
     comparable by length. A study UNDER its limit still draws: the
     limit becomes the long stick, the value the short one, and the
     overhang below is simply not rendered. */
  const top = Math.max(assetAmount, policyAmount);
  const assetPct = (assetAmount / top) * 100;
  const policyPct = (policyAmount / top) * 100;
  const gap = assetAmount - policyAmount;

  return (
    <div
      className={`${styles.viz} ${styles.gapCol}`}
      style={
        {
          "--asset": `${assetPct.toFixed(2)}%`,
          "--policy": `${policyPct.toFixed(2)}%`,
        } as CSSProperties
      }
    >
      <div className={styles.gapRow}>
        <span className={styles.gapHead}>
          <span className={styles.lbl}>{assetValue}</span>
          <span className={styles.val}>{usd(assetAmount)}</span>
        </span>
        <span className={styles.gapTrack}>
          <span className={styles.gapStickInk} />
        </span>
      </div>

      <div className={styles.gapRow}>
        <span className={styles.gapHead}>
          <span className={`${styles.lbl} ${styles.grey}`}>{policyLimit}</span>
          <span className={`${styles.valSm} ${styles.grey}`}>
            {usd(policyAmount)}
          </span>
        </span>
        <span className={styles.gapTrack}>
          <span className={styles.gapStickGrey} />
          {/* The overhang, drawn ON the shortfall: it starts where the
              limit ends and runs to where the value reached. Nothing is
              added to the picture, the distance was already there. */}
          {gap > 0 ? <span className={styles.gapSpan} /> : null}
        </span>

        {/* The pill sits UNDER the track, in flow. On the track it
            covered the very line it names: 125px of pill over an 89px
            shortfall, so the measurement disappeared behind its own
            label. In flow it can also never overlap the row below. */}
        {gap > 0 ? (
          <span className={styles.gapFoot}>
            <span className={styles.gapPill}>
              <span className={styles.lbl}>Gap</span>
              <span className={styles.gapPillVal}>{usd(gap)}</span>
            </span>
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default PressingGapColumn;
