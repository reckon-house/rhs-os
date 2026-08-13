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
 * runs — it is layout, not motion. On one track the crossing, the
 * drawn rules and the image drift all still run; only the HELD headline
 * goes static, because stacked it would be printed through by its own
 * column (the reason is in the stylesheet, at .held).
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useColumnDrop } from "@/lib/column-drop";
import { onTick, reducedMotion, vh } from "@/lib/scrub";
import { cutHeadline, lineOffset, LINE_SPAN_VH } from "@/lib/cut-lines";
import { usePinDrift } from "@/lib/pin-drift";

import { RevealHeadline } from "@/components/fx/RevealHeadline";
import { BodyReveal } from "@/components/fx/BodyReveal";
import { SectionMark } from "@/components/fx/SectionMark";
import styles from "./PressingBrief.module.css";


/* The placement pass writes styles the first paint should already have, so
   it runs pre-paint on the client; the guard keeps SSR from warning. */

export interface PressingBriefProps {
  /** Section-mark label row, e.g. { n: "03", name: "The brief" }. */
  mark?: { n: string; name: string };
  /** Headline text; "\n" is an authored line break (RevealHeadline's contract).
   *  Empty renders the block with NO headline — the columns-only form,
   *  which is how a crossing header's absorbed method grid gets into the
   *  copy column without a second headline announcing it. */
  title?: string;
  /**
   * The headline's separately-held final line — the prototype's .out span,
   * revealed as its own unit on its own block line, flush left.
   */
  heldLine?: string;
  paragraphs?: string[];
  /** Hold the headline sticky while the column travels up beside it. */
  pin?: boolean;
  /**
   * The headline's lines cross in from the right, Robert's gesture, on
   * a headline that then PINS while its column travels past. Use once
   * per study.
   */
  crossing?: boolean;
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
  /**
   * A chart, rendered INSIDE the copy column after the paragraphs. A
   * viz that belongs to an argument reads better beside it than as its
   * own full-width section two beats later — the reader stops having to
   * carry the claim across a gap to reach its evidence. It has to be a
   * narrow-form chart; a full-measure one has nowhere to go here.
   */
  viz?: ReactNode;
}

export function PressingBrief({
  mark,
  title,
  heldLine,
  paragraphs,
  pin = false,
  crossing = false,
  columns,
  columnsMark,
  viz,
}: PressingBriefProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const colRef = useRef<HTMLDivElement | null>(null);
  const colsRef = useRef<HTMLDivElement | null>(null);
  // Drawn once and never re-drawn — re-drawing every time the section
  // scrolls back into view turns a section opener into a loop. State, not a
  // classList write: a re-render must not wipe the drawn class.
  const [drawn, setDrawn] = useState(false);
  const headRef = useRef<HTMLHeadingElement | null>(null);
  /* usePinDrift needs a stable ref every render (rules of hooks forbid
     calling the hook conditionally), but must only ever touch the
     CROSSING headline: that is the only branch below that wires headRef
     at all — RevealHeadline's branch never attaches it, so headRef.current
     is already null there and this ref only exists to keep the "off"
     case explicit rather than relying on that being incidental. Gated on
     pin as well as crossing: a crossing with no pin renders the same <h2>
     but it is not position:sticky, and drifting a non-sticky element
     would be a small, wrong, extra creep on top of its normal scroll. */
  const noDriftRef = useRef<HTMLElement | null>(null);
  /* One string, spaces not newlines: the cut reads RENDERED line boxes,
     so an authored break would be a second, conflicting opinion. */
  const headText = (heldLine ? `${title ?? ""} ${heldLine}` : title ?? "").trim();

  const hasCols = !!columns && columns.length > 0;

  /* The brief-family placement pass, shared (src/lib/column-drop.ts).
     stackBelow matches THIS stylesheet's 760 mobile block. */
  useColumnDrop(sectionRef, colRef, { stackBelow: 760 }, [title, heldLine]);

  /* Restores what the brief-form crossing lost when it moved off
     PressingCrossing (which has always called this): the pinned headline
     keeps creeping upward at PIN_DRIFT instead of hitting a hard stop.
     Same wrap/inner shape as PressingCrossing's own call — sectionRef is
     the pinned range, headRef the sticky element the transform lands on. */
  usePinDrift(sectionRef, pin && crossing ? headRef : noDriftRef);

  /* ── the crossing, on the HEADLINE ─────────────────────────────
     Robert's gesture, unchanged: the rendered lines are cut apart and
     dragged in from a viewport off to the right, staggered, scrubbed by
     scroll. What differs here is only what happens AFTER — Robert's
     headline is not pinned, so it leaves with its copy; this one holds
     while a long column of intro and method columns travels past it.
     Same entrance, different exit.

     An earlier pass animated the COLUMN instead, which was simply the
     wrong element: the column sits ~580px below the section's top and a
     pinned brief is thousands of pixels tall, so the whole gesture
     played to an empty screen and the reader met a column already at
     rest. The headline is the thing that crosses.

     RevealHeadline is skipped in this mode: two drivers on one element's
     transform is the bug this kit keeps paying for. */
  useEffect(() => {
    if (!crossing) return;
    const head = headRef.current;
    const sec = sectionRef.current;
    if (!head || !sec) return;
    if (reducedMotion()) return;
    /* The pin used to switch off below CHOREO_BREAKPOINT. It runs at
       every width now — a phone gets the same held headline the desktop
       does — so the only thing that turns it off is a reader asking for
       less motion. */
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let lines = cutHeadline(head, headText, styles.ln);
    let last = -1;
    const off = onTick(() => {
      if (reduce.matches) {
        lines.forEach((el) => (el.style.transform = ""));
        return;
      }
      if (document.documentElement.hasAttribute("data-paused")) return;
      const r = sec.getBoundingClientRect();
      const h = vh();
      if (r.bottom < 0 || r.top > h) return;
      /* 0 as the section's top enters at the bottom of the screen. The
         span is Robert's, in viewports, so the two stagings of this
         gesture take the same amount of scrolling — the pin engages at
         one viewport and the last line lands shortly after, which reads
         as the headline settling rather than as a separate event. */
      const p = Math.min(1, Math.max(0, (h - r.top) / (h * LINE_SPAN_VH)));
      if (p === last) return;
      last = p;
      const w = window.innerWidth;
      lines.forEach((el, i) => {
        const x = lineOffset(p, i, lines.length, w);
        el.style.transform = x < 0.5 ? "" : "translateX(" + x.toFixed(1) + "px)";
      });
    });
    return () => {
      off();
      lines.forEach((el) => (el.style.transform = ""));
    };
  }, [crossing, headText]);

  /* ── the drift ───────────────────────────────────────────────────
     The picture moves inside its frame as the column travels, the same
     way every other image on the site does. The offset can only ever
     be NEGATIVE: a symmetric swing about centre pushes the image below
     the frame's top edge and exposes the ground behind it, which is
     the bug this kit has already paid for once. y = -p * slack keeps
     it inside the slack at both ends.

     Only frames on screen are written, and only through rAF — a
     transform per element per scroll event is how a page starts
     stuttering on a long study. */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const imgs = Array.from(root.querySelectorAll<HTMLElement>("[data-col-drift]"));
    if (!imgs.length) return;

    const live = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) live.add(e.target as HTMLElement);
        else live.delete(e.target as HTMLElement);
      }),
      { rootMargin: "120px 0px" }
    );
    imgs.forEach((im) => io.observe(im));

    let raf = 0;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      raf = requestAnimationFrame(tick);
      if (document.hidden || !live.size) return;
      const h = window.innerHeight;
      live.forEach((im) => {
        const frame = im.parentElement;
        if (!frame) return;
        const r = frame.getBoundingClientRect();
        /* 0 as the frame enters the bottom, 1 as it leaves the top */
        const p = Math.min(1, Math.max(0, (h - r.top) / (h + r.height)));
        const slack = im.offsetHeight - r.height;
        im.style.transform =
          "translate3d(0," + (-p * slack).toFixed(2) + "px,0)";
      });
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

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
      {title ? (
        crossing ? (
          /* Plain text as authored; the .ln blocks are cut from the
             RENDERED lines at runtime, exactly as PressingCrossing does
             it. Same reason for the key: React must never reconcile
             against the innerHTML the effect rewrote. */
          <h2
            key={headText}
            ref={headRef}
            className={pin ? `${styles.headline} ${styles.held}` : styles.headline}
          >
            {headText}
          </h2>
        ) : (
          <RevealHeadline
            as="h2"
            className={pin ? `${styles.headline} ${styles.held}` : styles.headline}
          >
            {heldLine ? `${title}\n${heldLine}` : title}
          </RevealHeadline>
        )
      ) : null}

      <div
        ref={colRef}
        className={styles.col}
      >

        {paragraphs?.map((p, i) => (
          <BodyReveal key={i} as="p">
            {p}
          </BodyReveal>
        ))}

        {viz}

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
                    <span
                      className={styles.colFrame}
                      style={
                        c.image.width
                          ? ({ "--col-native": `${Math.floor(c.image.width / 2)}px` } as CSSProperties)
                          : undefined
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className={styles.colImg}
                        data-col-drift
                        src={c.image.src}
                        alt={c.image.alt}
                        width={c.image.width}
                        height={c.image.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
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
