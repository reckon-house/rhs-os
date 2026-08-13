import type { ReactNode } from "react";
import { SectionMark } from "@/components/fx/SectionMark";
import styles from "./PressingVizFrame.module.css";

/**
 * PressingVizFrame — the bridge that lets a pressing study keep its bespoke
 * viz sections (the engineering showpieces: dev timelines, system maps,
 * charts). It HOSTS an existing classic section component as-is: the frame
 * speaks pressing — the page's white paper as the ground, an optional
 * SectionMark row, the family's vertical rhythm — and the child speaks
 * classic, untouched, full-column inside.
 *
 * Contract with the hosted child:
 * - The child owns its own horizontal scroll. Several charts wrap an
 *   overflow-x-auto scroller around a min-w-[800px] canvas with
 *   data-lenis-prevent-touch so touch drags pan the chart instead of the
 *   page. The frame must not clip, re-wrap, or restate any of that, so it
 *   sets no overflow (and no transform/filter — the sticky killers) at all.
 * - No pins, no scrubs, and nothing here subscribes to the rAF loop. The
 *   frame is plain flow; the only moving thing is the SectionMark's sweep,
 *   which is that kit component's own onTick behaviour, unchanged from
 *   every other use of it.
 * - Both static states come free: below CHOREO_BREAKPOINT and under
 *   reduced motion the frame reads exactly as it does everywhere else,
 *   because nothing here ever moves — and the mark's stylesheet/driver
 *   already own its reduced-motion final state.
 *
 * No "use client": no hooks here. SectionMark carries its own directive,
 * and in practice the frame mounts inside PressingLayout's client tree.
 */
export interface PressingVizFrameProps {
  /** Section-mark label row, e.g. { n: "05", name: "The Build" }. No dark
   *  variant: the frame always sits on the page's paper. */
  mark?: { n: string; name: string };
  /** The classic viz component, rendered full-column on the paper. */
  children: ReactNode;
  /**
   * One quiet line under the chart saying what it shows. Same field a
   * plate uses (`pressing.caption`) and the same type treatment, because
   * it is the same object: a figcaption. A chart carries no title, so
   * without this a reader meets a set of bars and has to infer both the
   * unit and the question from the axis labels alone.
   */
  caption?: string;
}

export function PressingVizFrame({ mark, children, caption }: PressingVizFrameProps) {
  return (
    <section className={styles.frame}>
      {mark ? (
        <div className={styles.labelRow}>
          <SectionMark n={mark.n} name={mark.name} />
        </div>
      ) : null}
      <div className={styles.body}>{children}</div>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
    </section>
  );
}
