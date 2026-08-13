"use client";

import { useRef, type CSSProperties } from "react";
import { useVizArrival } from "@/lib/viz-motion";
import type { StatsBarSection } from "@/lib/types";
import styles from "./PressingViz.module.css";

/**
 * @shape sticks — conforms to lab/viz-system.html
 *
 * The category ledger — the pressing skin for `stats-bar`.
 *
 * Two passes have now been made over this chart, and the first one was
 * right to stop where it did.
 *
 * The classic drew nine colour-ramped density waves over dot clouds.
 * Those were generated rather than measured, so they went. The pressing
 * pass replaced them with a ruled spec sheet and drew NO bars, on the
 * grounds that the `width` field had no stated unit. That was correct:
 * width is 88 on the smallest value in the set and 81 on the largest,
 * so it is drawing geometry wearing a data field's name, the same trick
 * PRESENCE was playing in the kitchen circos.
 *
 * WHAT THAT PASS MISSED is that the real quantity was sitting in the
 * next field along. `value` is a dollar figure per category, eight of
 * them, all on one scale and directly comparable. Refusing to draw
 * width was right; concluding there was nothing to draw was not, and it
 * left a set of numbers that only differ by a factor of five reading as
 * eight identical rows of type.
 *
 * So the bars come back, off `value`, never off width.
 *
 * THE SCALE TOPS AT THE LARGEST CLOSED VALUE, not the largest value.
 * Vehicles is "$5,000+", which is a floor rather than a measurement:
 * scaling to it would put the whole real spread inside the first fifth
 * of the plot and assert a precision the data does not have. It gets no
 * bar at all, because the kit already has the right form for a figure
 * with no stated scale — the spec row, label left, number right, where
 * the number IS the chart. A drawn length for "5,000 or more" would be
 * the same fabrication as width, arrived at more politely.
 *
 * Anything that fails to parse falls through to the same spec row. A
 * chart that guesses at a number it cannot read is worse than one that
 * declines to draw it.
 *
 * The toplines stay as type for the same reason: 73 items and 13
 * categories share no scale with each other or with anything else, so
 * there is nothing to measure them against.
 */

/** Dollars, commas and a currency mark; anything else is unparseable on
 *  purpose. A trailing "+" means a floor, which returns null — that is
 *  the whole point rather than an oversight. */
function amount(v: string): number | null {
  if (/\+\s*$/.test(v)) return null;
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function PressingStatsBar({ section }: { section: StatsBarSection }) {
  const amounts = section.items.map((it) => amount(it.value));
  const top = Math.max(...amounts.filter((n): n is number => n != null), 0);
  /* Arrives like the rest of the family: PressingDevTimeline's move,
     copied rather than re-derived — the bar carries width 0 until the
     chart is a quarter on screen, then runs to its value on the kit's
     shared curve. Under reduced motion the hook returns true on mount,
     so the chart is simply drawn. */
  const rootRef = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(rootRef);

  return (
    <div className={styles.viz} ref={rootRef}>
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
        {section.items.map((it, i) => {
          const n = amounts[i];
          const pct = n != null && top > 0 ? (n / top) * 100 : null;
          return (
            <div className={`${styles.row} ${styles.specRow}`} key={it.label}>
              <span className={styles.lbl}>{it.label}</span>
              <span className={styles.val}>{it.value}</span>
              {pct != null ? (
                <span className={styles.track}>
                  <span
                    className={styles.bar}
                    style={
                      {
                        width: drawn ? `${pct.toFixed(2)}%` : "0%",
                        /* Read down the ledger, not all at once. The
                           two columns share an index, so the pair on a
                           row starts together and the eye travels down
                           rather than across. */
                        "--lag": `${(Math.floor(i / 2) * 0.09).toFixed(2)}s`,
                      } as CSSProperties
                    }
                  />
                </span>
              ) : null}
              <p className={styles.note}>{it.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
