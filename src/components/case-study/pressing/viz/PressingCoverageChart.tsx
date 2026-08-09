import type { CoverageChartSection } from "@/lib/types";
import styles from "./PressingViz.module.css";

const usd = (n: number) => "$" + n.toLocaleString("en-US");

/**
 * The gap chart — the pressing skin for `coverage-chart`.
 *
 * One point, drawn once: the documented value runs past the policy
 * limit, and the overshoot is the only colour on the page. Two rows off
 * one scale (the asset value is the scale, so its rule is the full
 * width), a vertical hairline where the policy stops, and the gap
 * figure computed from the study's own two numbers — arithmetic, not
 * authorship.
 */
export function PressingCoverageChart({
  section,
}: {
  section: CoverageChartSection;
}) {
  const { assetAmount, policyAmount } = section;
  const limitPct = Math.min(100, (policyAmount / assetAmount) * 100);
  const gap = assetAmount - policyAmount;

  return (
    <div className={styles.viz}>
      <div className={styles.cov}>
        <div
          className={styles.limit}
          style={{ left: `${limitPct.toFixed(2)}%` }}
        >
          <span className={`${styles.lbl} ${styles.grey} ${styles.limitLbl}`}>
            Policy limit
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.lbl}>{section.assetValue}</span>
          <span className={styles.val}>{usd(assetAmount)}</span>
          <span className={styles.track}>
            <i className={styles.bar} style={{ width: "100%" }} />
            {/* the overshoot: the stretch of value the policy does not
                reach, drawn over the ink in the accent */}
            <i
              className={`${styles.bar} ${styles.acc}`}
              style={{
                left: `${limitPct.toFixed(2)}%`,
                width: `${(100 - limitPct).toFixed(2)}%`,
                background: "var(--pv-acc)",
              }}
            />
          </span>
        </div>

        <div className={styles.row} style={{ color: "var(--pv-grey)" }}>
          <span className={styles.lbl}>{section.policyLimit}</span>
          <span className={styles.val}>{usd(policyAmount)}</span>
          <span className={styles.track}>
            <i className={styles.bar} style={{ width: `${limitPct.toFixed(2)}%` }} />
          </span>
        </div>

        {gap > 0 ? (
          <div className={`${styles.lbl} ${styles.gapLine}`}>
            Gap {usd(gap)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
