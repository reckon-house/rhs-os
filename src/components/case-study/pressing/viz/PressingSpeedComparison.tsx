import type { SpeedComparisonSection } from "@/lib/types";
import styles from "./PressingViz.module.css";

/**
 * The speed chart — the pressing skin for `speed-comparison`.
 *
 * The callout is the chart: the multiple at display scale, because the
 * number says it better than any geometry. Under it, the rows as
 * evidence — the before in grey, the after as the accent, since the
 * short rule is the datum this section exists to show. The per-item
 * `color` field from the classic era is ignored on purpose: one ink,
 * one accent, is the system.
 */
export function PressingSpeedComparison({
  section,
}: {
  section: SpeedComparisonSection;
}) {
  const last = section.items.length - 1;
  return (
    <div className={styles.viz}>
      {section.callout ? (
        <div className={styles.head}>
          <span className={styles.lbl}>{section.title}</span>
          <span className={styles.big}>
            {section.callout}
            {section.calloutSuffix ? (
              <span
                className={styles.grey}
                style={{ fontSize: "0.32em", marginLeft: "0.5em", letterSpacing: 0 }}
              >
                {section.calloutSuffix}
              </span>
            ) : null}
          </span>
        </div>
      ) : null}

      <div style={{ display: "grid", rowGap: "clamp(28px, 4vw, 44px)" }}>
        {section.items.map((it, i) => (
          <div
            className={styles.row}
            key={it.label}
            style={i === last ? undefined : { color: "var(--pv-grey)" }}
          >
            <span className={styles.lbl}>{it.label}</span>
            <span className={styles.val}>{it.value}</span>
            <span className={styles.track}>
              <i
                className={styles.bar}
                style={{
                  width: `${Math.min(100, Math.max(0, it.width))}%`,
                  background: i === last ? "var(--pv-acc)" : "currentColor",
                }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
