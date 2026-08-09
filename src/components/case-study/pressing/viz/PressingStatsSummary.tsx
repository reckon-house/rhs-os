import type { StatsSummarySection } from "@/lib/types";
import styles from "./PressingViz.module.css";

/**
 * The topline row — the pressing skin for `stats-summary`.
 *
 * It is the same block `PressingStatsBar` already sets above its
 * ledger: figures at display scale, caps label under, a recessive
 * sublabel under that. Type carries the number, which is the viz kit's
 * whole position on stats — there is no chart here because there is
 * nothing to compare, just four facts.
 *
 * `.totals` is a four-up grid that drops to two on a phone. Studies
 * carrying three or five items get an even split instead of a ragged
 * last row.
 */
export function PressingStatsSummary({ section }: { section: StatsSummarySection }) {
  const n = section.items.length;
  return (
    <div className={styles.viz}>
      <div
        className={styles.totals}
        style={n !== 4 ? { gridTemplateColumns: `repeat(${Math.min(n, 4)}, 1fr)` } : undefined}
      >
        {section.items.map((it) => (
          <div key={it.label}>
            <div className={styles.big}>{it.value}</div>
            <div className={styles.lbl} style={{ marginTop: 10 }}>
              {it.label}
              {it.sublabel ? <span className={styles.sub}>{it.sublabel}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PressingStatsSummary;
