import type { StatsBarSection } from "@/lib/types";
import styles from "./PressingViz.module.css";

/**
 * The stats ledger — the pressing skin for `stats-bar`.
 *
 * What it replaces: the classic ridgeline, nine colour-ramped density
 * waves over dot clouds and room columns. Those waves were generated,
 * not measured, which put them on the wrong side of the fabrication
 * rules the moment they were drawn. What the study actually authored
 * per category is a label, a value and a note, so the chart is a spec
 * sheet: ruled rows, label left, the value right at display weight.
 * No bars — the legacy `width` field has no stated unit, and a rule
 * pretending to measure something is decoration. The topline totals
 * read first, as type.
 */
export function PressingStatsBar({ section }: { section: StatsBarSection }) {
  return (
    <div className={styles.viz}>
      {section.totals?.length ? (
        <div className={styles.totals}>
          {section.totals.map((t) => (
            <div key={t.label}>
              <div className={styles.big}>{t.value}</div>
              <div className={styles.lbl} style={{ marginTop: 10 }}>
                {t.label}
                {t.sub ? <span className={styles.sub}>{t.sub}</span> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className={styles.ledger}>
        {section.items.map((it) => (
          <div className={`${styles.row} ${styles.specRow}`} key={it.label}>
            <span className={styles.lbl}>{it.label}</span>
            <span className={styles.val}>{it.value}</span>
            <p className={styles.note}>{it.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
