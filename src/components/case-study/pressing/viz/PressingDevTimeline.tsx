import type { DevTimelineSection } from "@/lib/types";
import styles from "./PressingViz.module.css";

/** Weeks the ruler keeps counting past the last phase. The scale
 *  continues, the build does not — that is the whole statement. */
const RUN_ON = 2;

/**
 * The weeks — the pressing skin for `dev-timeline`.
 *
 * One ink rule per phase stepping down the rows, and a tick ruler
 * along the bottom the way an instrument carries its scale: day ticks
 * at the faintest grey, week ticks a step darker, mono numerals under
 * the baseline. Only the ruler is drawn at day pitch — minor divisions
 * are what make a ruler a ruler, and they claim nothing about the
 * work. The launch is the single accent dot, at the end of the last
 * rule.
 *
 * The classic sage colour ramp is gone: phases are sequential, so
 * position already encodes everything the ramp pretended to. Spans
 * parse out of the authored `weeks` strings ("2 wks") and run
 * consecutively, which is how the study describes the build. The
 * canvas keeps the intentional horizontal scroll on mobile.
 */
export function PressingDevTimeline({
  section,
}: {
  section: DevTimelineSection;
}) {
  const spans = section.phases.map((p) => {
    const n = parseFloat(p.weeks);
    return Number.isFinite(n) && n > 0 ? n : 1;
  });
  const total = spans.reduce((a, b) => a + b, 0);
  const SPAN = total + RUN_ON;
  let cursor = 0;
  const phases = section.phases.map((p, i) => {
    const start = cursor;
    cursor += spans[i];
    return { name: p.name, weeks: p.weeks, start, end: cursor };
  });
  const pct = (w: number) => ((w / SPAN) * 100).toFixed(3) + "%";

  return (
    <div className={styles.viz}>
      <div className={styles.tlHead}>
        <span className={styles.lbl}>{section.label}</span>
        <span className={`${styles.lbl} ${styles.grey}`}>
          {section.duration}
        </span>
      </div>

      <div className={styles.scroller} data-lenis-prevent-touch>
        <div className={styles.wide}>
          <div className={styles.weeks}>
            {/* faint week verticals through the rows, so a rule's span
                can be read against the scale without following it down */}
            {Array.from({ length: total + 1 }, (_, w) => (
              <div
                key={w}
                className={styles.gridline}
                style={{ left: pct(w) }}
              />
            ))}

            {phases.map((p, i) => (
              <div className={styles.phase} key={p.name}>
                <span
                  className={styles.phaseBar}
                  style={{ left: pct(p.start), width: pct(p.end - p.start) }}
                />
                <span
                  className={`${styles.lbl} ${styles.phaseLbl}`}
                  style={{ left: pct(p.start) }}
                >
                  {p.name}
                </span>
                <span
                  className={`${styles.lbl} ${styles.phaseWks} ${styles.grey}`}
                  style={{ left: pct(p.end) }}
                >
                  {p.weeks}
                </span>
                {i === phases.length - 1 ? (
                  <span
                    className={styles.launch}
                    style={{ left: pct(p.end) }}
                  />
                ) : null}
              </div>
            ))}

            {/* the ruler: baseline, day ticks, week ticks, numerals.
                The stretch past the build keeps only its ticks and
                fades to the faintest step. */}
            <div className={styles.ruler}>
              <div
                className={styles.rulerBase}
                style={{ left: 0, width: pct(total) }}
              />
              <div
                className={styles.rulerBase}
                style={{
                  left: pct(total),
                  width: pct(RUN_ON),
                  background: "var(--pv-faint)",
                }}
              />
              {Array.from({ length: SPAN * 7 + 1 }, (_, d) => {
                const week = d % 7 === 0;
                const past = d / 7 > total;
                return (
                  <i
                    key={d}
                    className={`${styles.tick} ${week && !past ? styles.tickWk : ""}`}
                    style={{ left: pct(d / 7) }}
                  />
                );
              })}
              {Array.from({ length: total }, (_, w) => (
                <span
                  key={w}
                  className={`${styles.mono} ${styles.wknum}`}
                  style={{ left: pct(w + 0.5) }}
                >
                  {String(w + 1).padStart(2, "0")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
