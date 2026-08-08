"use client";

/**
 * PressingBrief — the .brief screens from public/lab/swiss-spread.html: a
 * section-mark label row, a scale-jump headline, and a running text column
 * whose start offset is MEASURED against the rewrapping headline. With
 * `pin`, the headline is position: sticky and holds while the column
 * travels up beside it — the pure-CSS pin. Headline and column share one
 * grid row, so the sticky's containing block bottom IS the column's bottom
 * and the release needs no computed threshold; CSS does the pinning, this
 * component only sets where the column starts.
 *
 * The placement pass is the prototype's: the offset has to be measured
 * because the headline rewraps from two lines to six across breakpoints,
 * and it is measured from the ROW, not the section — both items start at
 * the same row edge, so the drop is exactly the headline's own margin plus
 * its height plus the gap. Measuring against the section instead folded in
 * the label row AND the sticky displacement, which put the gap anywhere
 * from 39px to 221px against a 34px target. The stale inline margin is
 * cleared before each measurement: the two share a grid row, so a stale
 * value would inflate the row and compound on every resize.
 *
 * The optional method columns nest INSIDE the text column, so the brief
 * and the method read as one argument. Their pill-ended rules draw
 * themselves left to right on arrival (clip-path, staggered 1.2s apart),
 * triggered once by a viewport IntersectionObserver — safe even though the
 * page scrolls inside <main>, because main spans the whole viewport and
 * the two intersection tests are the same. No scroll listener, no Lenis
 * coupling, and no per-frame work, so nothing here subscribes to the scrub
 * driver.
 *
 * Reduced motion: the rules render pre-drawn (the stylesheet forces the
 * final clip and kills the transition under the media query), and the text
 * systems handle their own final-state rendering. The placement pass still
 * runs — it is layout, not motion. Below 760px the pin is off and
 * everything flows in one column.
 */

import { useEffect, useRef, useState } from "react";
import { useColumnDrop } from "@/lib/column-drop";
import { RevealHeadline } from "@/components/fx/RevealHeadline";
import { BodyReveal } from "@/components/fx/BodyReveal";
import { SectionMark } from "@/components/fx/SectionMark";
import styles from "./PressingBrief.module.css";


/* The placement pass writes styles the first paint should already have, so
   it runs pre-paint on the client; the guard keeps SSR from warning. */

export interface PressingBriefProps {
  /** Section-mark label row, e.g. { n: "03", name: "The brief" }. */
  mark?: { n: string; name: string };
  /** Headline text; "\n" is an authored line break (RevealHeadline's contract). */
  title: string;
  /**
   * The headline's separately-held final line — the prototype's .out span,
   * revealed as its own unit on its own block line, flush left.
   */
  heldLine?: string;
  paragraphs?: string[];
  /** Hold the headline sticky while the column travels up beside it. */
  pin?: boolean;
  /** The method grid: none, or three entries nested after the paragraphs.
   *  A column may carry its own image, which lands at the top of the
   *  column at COLUMN width. That is the point of it: a 768px app
   *  screen is soft when a full-width plate stretches it to 1400, and
   *  exactly crisp in a 400px column on a retina display. The narrow
   *  measure is the right home for a small asset, not a consolation. */
  columns?: {
    title: string;
    body: string;
    image?: { src: string; alt: string; width?: number; height?: number };
  }[];
  /** Secondary mark above the columns (the prototype's "04 / Method" label). */
  columnsMark?: { n: string; name: string };
}

export function PressingBrief({
  mark,
  title,
  heldLine,
  paragraphs,
  pin = false,
  columns,
  columnsMark,
}: PressingBriefProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const colRef = useRef<HTMLDivElement | null>(null);
  const colsRef = useRef<HTMLDivElement | null>(null);
  // Drawn once and never re-drawn — re-drawing every time the section
  // scrolls back into view turns a section opener into a loop. State, not a
  // classList write: a re-render must not wipe the drawn class.
  const [drawn, setDrawn] = useState(false);

  const hasCols = !!columns && columns.length > 0;

  /* The brief-family placement pass, shared (src/lib/column-drop.ts).
     stackBelow matches THIS stylesheet's 760 mobile block. */
  useColumnDrop(sectionRef, colRef, { stackBelow: 760 }, [title, heldLine]);

  /* The rule-drawing trigger, the prototype's observer at its tuned 0.18
     threshold. No reduced-motion branch here, unlike the prototype: the
     stylesheet forces the drawn final state (and kills the transition)
     under the media query whatever this class says, so the observer can
     run unconditionally — and keeps working if the user flips the OS
     setting with the page open, which the prototype's one-shot check
     did not. */
  useEffect(() => {
    if (!hasCols) return;
    const el = colsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setDrawn(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasCols]);

  return (
    <section
      ref={sectionRef}
      className={styles.brief}
    >
      {mark ? (
        <div className={styles.labelRow}>
          {/* No scrollRef: the section itself scrolls normally — only the
              headline is sticky — so the mark's own position on screen is a
              real signal and can drive its sweep. */}
          <SectionMark n={mark.n} name={mark.name} />
        </div>
      ) : null}

      {/* The held line rides in as a "\n" line: RevealHeadline renders each
          authored line as its own flush-left block, which is exactly what
          the prototype's .out span was (display: block, margin-left: 0) —
          the final line revealed as its own unit. */}
      <RevealHeadline
        as="h2"
        className={pin ? `${styles.headline} ${styles.held}` : styles.headline}
      >
        {heldLine ? `${title}\n${heldLine}` : title}
      </RevealHeadline>

      <div ref={colRef} className={styles.col}>

        {paragraphs?.map((p, i) => (
          <BodyReveal key={i} as="p">
            {p}
          </BodyReveal>
        ))}

        {hasCols ? (
          <div
            ref={colsRef}
            className={drawn ? `${styles.cols} ${styles.drawn}` : styles.cols}
          >
            {columnsMark ? (
              <div className={styles.colsLabel}>
                <SectionMark n={columnsMark.n} name={columnsMark.name} />
              </div>
            ) : null}
            <div className={styles.colsGrid}>
              {columns!.map((c, i) => (
                <div key={i} className={styles.c}>
                  {c.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      className={styles.colImg}
                      src={c.image.src}
                      alt={c.image.alt}
                      width={c.image.width}
                      height={c.image.height}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <BodyReveal as="h3" className={styles.colTitle}>
                    {c.title}
                  </BodyReveal>
                  {/* Authored paragraph breaks survive: the classic
                      renderer splits column content on blank lines and the
                      prototype set two <p> per column — rendering the body
                      whole was silently flattening them. */}
                  {c.body
                    .split(/\n\n+/)
                    .map((para) => para.trim())
                    .filter(Boolean)
                    .map((para, pi) => (
                      <BodyReveal key={pi} as="p">
                        {para}
                      </BodyReveal>
                    ))}
                </div>
              ))}
            </div>
          </div>
        ) : null}

      </div>
    </section>
  );
}
