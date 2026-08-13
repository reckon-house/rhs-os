import type { CSSProperties } from "react";
import styles from "./PressingCoverageCard.module.css";

/**
 * PressingCoverageCard — A.R.C.'s own coverage card, rebuilt as markup.
 *
 * It sits under the gap chart inside the same brief column. The chart
 * proves the gap exists; this shows what the product does with it, which
 * is the step from a fact to a feature.
 *
 * FAITHFUL TO THE APP ON PURPOSE, and the exception is worth naming
 * because everything around it is one ink on white paper. This is a
 * product artifact, not a chart: it is meant to read as the interface,
 * so it keeps the app's own surfaces and its own tokens, taken from the
 * shipped build's resolved custom properties (patterns/tokens.json in
 * the demo package) rather than approximated by eye.
 *
 * MARKUP, NOT A SCREENSHOT. Every A.R.C. screenshot in this study is
 * 380-800px and has to be held under its honest width; this is type and
 * boxes, so it is sharp at any size and takes the page's own rendering.
 *
 * ITS NUMBERS COME FROM THE CHART ABOVE IT, and that is the whole point
 * of the prop shape. The app's demo data has carried at least three
 * different policy limits: $30,000 in a screenshot already in this
 * study, $38,000 in the chart, $40,000 in the current build. Typing any
 * of them here would date the page to whichever week it was written and
 * put two different gaps within a few hundred pixels of each other.
 * Reading the chart's own figures means the card cannot drift from it,
 * and changing the policy in one place moves both.
 *
 * The insurer is not named. The app shows one because a user enters
 * theirs; printing a real insurance company's name in a portfolio reads
 * as a partnership that does not exist.
 */

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export interface PressingCoverageCardProps {
  /** The chart's own two figures, so the card can never contradict it. */
  assetAmount: number;
  policyAmount: number;
}

export function PressingCoverageCard({
  assetAmount,
  policyAmount,
}: PressingCoverageCardProps) {
  const gap = assetAmount - policyAmount;
  const over = gap > 0;

  return (
    <div className={styles.card} aria-label="A.R.C. personal items coverage card">
      <div className={styles.head}>
        <h4 className={styles.title}>Personal Items Coverage</h4>
        {/* Inert on the page: the app's control, drawn because the card
            is a picture of the app, not a working copy of it. */}
        <span className={styles.edit} aria-hidden="true">
          Edit
        </span>
      </div>

      <p className={styles.body}>
        Your policy covers your personal items for{" "}
        <strong>{usd(policyAmount)}</strong> and you have{" "}
        <strong>{usd(assetAmount)}</strong> archived, so you are{" "}
        <strong className={over ? styles.over : undefined}>{usd(Math.abs(gap))}</strong>{" "}
        {over ? "short" : "clear"}.
      </p>

      <div className={styles.tiles}>
        <div className={styles.tile}>
          <span className={styles.figure}>{usd(policyAmount)}</span>
          <span className={styles.tileLbl}>Personal policy coverage</span>
        </div>
        <div className={styles.tile}>
          <span className={styles.figure}>{usd(assetAmount)}</span>
          <span className={styles.tileLbl}>Archived items</span>
        </div>
      </div>

      {over ? (
        <div className={`${styles.tile} ${styles.wide}`}>
          <span className={`${styles.figure} ${styles.over}`}>{usd(gap)}</span>
          <span className={styles.tileLbl}>You may need additional coverage</span>
        </div>
      ) : null}
    </div>
  );
}

export default PressingCoverageCard;
