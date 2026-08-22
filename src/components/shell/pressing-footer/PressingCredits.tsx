"use client";

/**
 * PressingCredits — the credits beat of the Pressing C footer, ported from
 * the second .mt-beat (data-credits-beat) in public/lab/swiss-spread.html.
 * A section mark, a two-line masked headline, and the client index: twelve
 * names as an ordered list where each row draws its own hairline on arrival
 * and surfaces the real brand mark at its right edge on hover.
 *
 * Only the LEDGER setting is ported. The prototype carried three settings of
 * the same twelve names behind ?credits= (the ruled specimen sheet, the
 * drifting name field) and removed the losers before any driver ran; the
 * site ships one version, so the variant machinery has no port.
 *
 * Site chrome, so it takes no content props — the names ARE the component.
 * It renders at the bottom of every page, inside <main>'s scroll content,
 * and breaks out of main's md:px-[50px] gutters through the shared
 * .hero-breakout class so the ink ground reaches both viewport edges.
 * data-nav-dark tells the Masthead's existing driver to reverse its ink
 * while this section is under the bar.
 *
 * Two drivers, neither of them a scroll listener:
 *
 * - The arrival queue. An IntersectionObserver only ADMITS rows; the queue
 *   owns the rhythm, firing each one a fixed 110ms after the previous one
 *   whatever the scroll did in between. Per-item delays would collapse into
 *   a single flash for every row that entered on the same frame, which is
 *   what a fast flick produces. Viewport intersection is a safe test even
 *   though the page scrolls inside <main>: main spans the whole viewport,
 *   so the two tests are the same one. Rows unobserve on admission and
 *   never re-arm — a credits list that replayed on every pass back up would
 *   read as a loop, not an arrival.
 *
 * - The placement pass, shared with the sibling contact beat. It measures
 *   where the column starts against the rewrapping headline, and how far
 *   the section runs past its own content so the pin releases exactly as
 *   the section's bottom meets the fold. Layout, not motion, so it also
 *   runs under prefers-reduced-motion.
 *
 * Nothing here subscribes to the shared rAF loop in @/lib/scrub: there is
 * no per-frame work to do. The two helpers it does use from that module are
 * the ones every component should share — a live reduced-motion read, and a
 * viewport height that is window.innerHeight rather than a CSS 100vh the
 * mobile browser chrome would overshoot.
 */

import { useEffect, useLayoutEffect, useRef } from "react";
import { RevealHeadline } from "@/components/fx/RevealHeadline";
import { SectionMark } from "@/components/fx/SectionMark";
import { reducedMotion, vh } from "@/lib/scrub";
import styles from "./PressingCredits.module.css";

/** px between the headline's last line and the column's first (prototype GAP). */
const GAP = 34;

/** ms between one row's arrival and the next. The queue's whole rhythm. */
const BEAT = 110;

/** How much of a row must be on screen before it is admitted to the queue. */
const THRESHOLD = 0.4;

/** Inclusive, matching the prototype and CHOREO_BREAKPOINT in @/lib/choreo. */
const MOBILE = 760;

/* The placement pass writes styles the first paint should already have, so
   it runs pre-paint on the client; the guard keeps SSR from warning. */
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type Credit = {
  name: string;
  /** Path under /brands. Omitted where no usable mark exists. */
  src?: string;
  /**
   * Per-logo height in px, overriding the stylesheet's 15px. Equal height is
   * not equal optical weight, so the wide and heavy marks are trimmed until
   * the row reads level.
   */
  height?: number;
  /**
   * Skip the invert. One mark is a photograph rather than flat art, and
   * brightness(0) invert(1) turns it to soup.
   */
  asis?: boolean;
};

/* Verbatim from the prototype's ledger, in its order — the sequence is
   edited, not alphabetical or chronological. */
const CREDITS: Credit[] = [
  { name: "Crate & Barrel", src: "/brands/crate-barrel.svg" },
  { name: "Nordstrom", src: "/brands/nordstrom.svg", height: 12 },
  { name: "Ivy Park by Beyoncé", src: "/brands/ivy-park.svg" },
  { name: "Neiman Marcus", src: "/brands/neiman-marcus.svg" },
  { name: "Rejuvenation", src: "/brands/rejuvenation.png", height: 13 },
  { name: "Lostine Home", src: "/brands/lostine.avif" },
  { name: "Visual Comfort", src: "/brands/visual-comfort.webp", height: 11 },
  { name: "Floor & Decor", src: "/brands/floor-decor.svg", height: 14 },
  { name: "Kingston Brass", src: "/brands/kingston-brass.webp" },
  { name: "Design Within Reach", src: "/brands/dwr.jpg", height: 17, asis: true },
  { name: "Vivir Homes", src: "/brands/vivir-homes.webp" },
  { name: "Haven" },
];

export interface PressingCreditsProps {
  /**
   * Extra classes on the <section>. The only prop: this is site chrome, so
   * the copy, the names and the marks are all fixed. Keep whatever lands
   * here plain — a transform, a filter or an overflow clip on this box
   * silently kills the sticky headline.
   */
  className?: string;
}

export function PressingCredits({ className }: PressingCreditsProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const colRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);

  /* ── the placement pass ───────────────────────────────────────────
     Two numbers, measured because the headline rewraps from two lines to
     six across breakpoints and a fixed value drifts out of register.

     The column's drop is measured from the ROW, not from the section: both
     items start at the same row edge, so the offset the column needs is
     exactly the headline's own margin plus its height plus the gap.
     Measuring the headline's rect against the section's instead folds in
     the label row above it AND the headline's sticky displacement, which in
     the lab put the gap anywhere from 39px to 221px against a 34px target.
     The stale inline margin is cleared before each measurement — the two
     share a grid row, so a leftover value inflates the row and the reading
     compounds on every resize.

     The section's bottom padding makes the beat hold the screen until its
     own column has finished. Two things have to be true on the same frame:
     the headline lets go exactly as the column's bottom reaches the
     headline's bottom, AND the section is still covering the screen right
     up to that frame, so nothing below starts climbing in over a column
     still being read. Both fall out of ONE number. A sticky headline
     releases at its containing block's bottom — measured, that is the
     section's CONTENT box, not its grid row and not its border box — so

       padding-bottom = viewport - pinOffset - headlineHeight

     puts the release on the frame the two bottoms meet and the section's
     border box one viewport later, which is the fold. Setting a height
     instead only moves the second one: padding sits below the content box
     the release is measured from, so the pin then held ~780px past the
     column. */
  useIsoLayoutEffect(() => {
    const sec = sectionRef.current;
    const col = colRef.current;
    if (!sec || !col) return;
    // RevealHeadline renders the tag itself, so the headline is reached the
    // way the prototype reached it: the section's own h2.
    const h2 = sec.querySelector("h2");
    if (!h2) return;

    const place = () => {
      // Phones stack the two in separate rows and drop the pin entirely.
      // The measured drop is meaningless there, and a section held a
      // viewport past its content is a dead screen to scroll through, so
      // both inline values go back to the stylesheet's.
      if (window.innerWidth <= MOBILE) {
        col.style.marginTop = "";
        sec.style.paddingBottom = "";
        return;
      }

      // NO DROP. The ledger sits beside the headline on the page's three
      // tracks now, not under it, so an offset would just be a hole.
      col.style.marginTop = "";

      // The sticky offset resolves the calc() to px here, so the hold
      // follows the masthead without this file restating its height.
      const pin = parseFloat(getComputedStyle(h2).top) || 0;
      const pad = Math.max(0, Math.round(vh() - pin - h2.offsetHeight));
      sec.style.paddingBottom = pad + "px";
    };

    place();

    // A window resize listener, deliberately — this reacts to geometry, not
    // to scroll position, so the Lenis-owns-main rule is not in play.
    window.addEventListener("resize", place);

    // The headline's height drives BOTH numbers here, and it settles late:
    // Helvetica may be swapped in after first paint, and RevealHeadline's
    // per-character split lands on hydration. The prototype covered this
    // with a fonts.ready pass and a blind 300ms timeout; both are kept, and
    // a ResizeObserver on the headline itself covers whatever they miss.
    // No feedback loop: the pass writes the column's margin and the
    // section's padding, and neither can change the headline's own box.
    const ro = new ResizeObserver(place);
    ro.observe(h2);

    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (alive) place();
      });
    }
    const t = window.setTimeout(place, 300);

    return () => {
      alive = false;
      ro.disconnect();
      window.removeEventListener("resize", place);
      window.clearTimeout(t);
    };
  }, []);

  /* ── the arrival queue ────────────────────────────────────────────
     The observer admits; the queue paces. An admitted row is scheduled one
     fixed beat after the previously scheduled one, so twelve rows that
     entered together still arrive as twelve, in order. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll("li"));
    if (!items.length) return;

    // The stylesheet already forces the finished state under the same media
    // query, so this only saves scheduling a dozen timers nobody asked for.
    // Reading it live rather than at module load is what makes a mid-session
    // OS change take effect on the next mount.
    if (reducedMotion()) {
      for (const el of items) el.classList.add(styles.on);
      return;
    }

    let last = 0;
    const timers = new Set<number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          // Admitted once. Unobserving here is also what keeps a row from
          // being booked twice by two boundary crossings in one flick.
          io.unobserve(e.target);
          const target = e.target;
          const now = performance.now();
          const at = Math.max(now, last + BEAT);
          last = at;
          const t = window.setTimeout(() => {
            timers.delete(t);
            target.classList.add(styles.on);
          }, at - now);
          timers.add(t);
        }
      },
      { threshold: THRESHOLD }
    );
    for (const el of items) io.observe(el);

    return () => {
      io.disconnect();
      for (const t of timers) window.clearTimeout(t);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      // hero-breakout spans the viewport past main's md:px-[50px] gutters,
      // and the section restores that same gutter inside itself so the
      // footer's left rule stays flush with the page above it. Nothing in
      // this class list may clip, transform or filter — the pin dies.
      className={["hero-breakout", styles.beat, className]
        .filter(Boolean)
        .join(" ")}
      // The Masthead's existing driver watches for this and reverses its
      // ink while the bar's band overlaps the section.
      data-nav-dark
    >
      <div className={styles.markRow}>
        {/* No scrollRef: only the headline is sticky, so this row travels
            up the screen normally and its own position is a real signal. */}
        <SectionMark n="H" name="Credits" dark />
      </div>

      {/* The break after "Worked with," is authored — "\n" is
          RevealHeadline's line separator, and each line gets its own mask. */}
      <RevealHeadline as="h2" className={styles.headline}>
        {"Worked with,\nspotted by & featured in."}
      </RevealHeadline>

      <div ref={colRef} className={styles.col}>
        <ol ref={listRef} className={styles.ledger}>
          {CREDITS.map((c) => (
            <li key={c.name}>
              <span className={styles.name}>{c.name}</span>
              {c.src ? (
                // Decorative: the name beside it already carries the
                // meaning, so the mark is hidden from assistive tech rather
                // than read out a second time. A plain <img>, not
                // next/image — these are 15px-tall marks in five formats
                // sized by height with width: auto, which is exactly what
                // the optimizer's fixed intrinsic sizing gets in the way of.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={c.asis ? `${styles.mark} ${styles.asis}` : styles.mark}
                  src={c.src}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  style={c.height ? { height: `${c.height}px` } : undefined}
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
