"use client";

import { useRef, type CSSProperties } from "react";
import type { DevTimelineSection } from "@/lib/types";
import { useVizArrival, useReadingHead } from "@/lib/viz-motion";
import styles from "./PressingViz.module.css";

/** Weeks the ruler keeps counting past the last phase. The scale
 *  continues, the build does not — that is the whole statement. */
const RUN_ON = 2;

/**
 * @shape sticks — conforms to lab/viz-system.html
 *
 * The weeks — the pressing skin for `dev-timeline`, redrawn as
 * horizontal floating STICKS: each phase is the heavy round-capped mark
 * spanning its start to its end on the week scale, the same object the
 * vertical bars use, lying down. One fine-ink ruler along the bottom
 * carries the scale alone — the week cage that used to run through the
 * rows is gone (no grids through data), and the old day ticks with it:
 * a tick at 8% opacity is a mark the system says not to draw. The
 * stretch past the build keeps its baseline in grey, because a scale
 * that kept counting after the work stopped is a remainder, and a
 * remainder is a data state.
 *
 * Arrival replays the schedule: each stick's delay is proportional to
 * its own start week, so the build assembles in the order it was built,
 * compressed. The reading head walks the five phase names — they rest
 * grey and lift to ink as the cursor passes; the sticks never move.
 * The launch dot is ink now, not accent, and grew to earn its place as
 * the one moment the timeline exists to reach.
 *
 * Spans still parse out of the authored `weeks` strings ("2 wks") and
 * run consecutively, which is how the study describes the build. The
 * canvas keeps the intentional horizontal scroll on mobile.
 */
export function PressingDevTimeline({
  section,
}: {
  section: DevTimelineSection;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);
  const head = useReadingHead(ref, section.phases.length);

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
    <div className={styles.viz} ref={ref}>
      <div className={styles.tlHead}>
        <span className={styles.lbl}>{section.label}</span>
        <span className={`${styles.lbl} ${styles.grey}`}>
          {section.duration}
        </span>
      </div>

      <div className={styles.scroller} data-lenis-prevent-touch>
        <div className={styles.wide}>
          <div className={styles.weeks}>
            {phases.map((p, i) => (
              <div className={styles.phase} key={p.name}>
                <span
                  className={styles.phaseBar}
                  style={
                    {
                      left: pct(p.start),
                      width: drawn ? pct(p.end - p.start) : "0%",
                      /* the schedule replayed: later phases start their
                         draw later, in proportion */
                      "--lag": `${((p.start / total) * 0.8).toFixed(2)}s`,
                    } as CSSProperties
                  }
                />
                <span
                  className={`${styles.lbl} ${styles.phaseLbl} ${styles.walk} ${
                    head === i ? styles.walkOn : ""
                  }`}
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
                  <span className={styles.launch} style={{ left: pct(p.end) }} />
                ) : null}
              </div>
            ))}

            {/* the ruler: fine baseline, week ticks, numerals — and the
                run-on in grey, a scale outliving its subject */}
            <div className={styles.ruler}>
              <div
                className={styles.rulerBase}
                style={{ left: 0, width: pct(total) }}
              />
              <div
                className={`${styles.rulerBase} ${styles.rulerRunOn}`}
                style={{ left: pct(total), width: pct(RUN_ON) }}
              />
              {Array.from({ length: total + 1 }, (_, w) => (
                <i key={w} className={styles.tick} style={{ left: pct(w) }} />
              ))}
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
