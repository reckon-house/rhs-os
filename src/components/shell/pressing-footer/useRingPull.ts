"use client";

/* ── the ring pull ──────────────────────────────────────────────────
 * Keep scrolling at the very bottom of a page and the ring closes: a
 * case study carries you home, the homepage carries you back to its
 * own top. The reader never has to find a link.
 *
 * THE WHOLE DESIGN PROBLEM IS TELLING INTENT FROM MOMENTUM. A plain
 * "you hit the bottom, navigate" handler fires on trackpad inertia, on
 * a rubber-band bounce, and on someone who simply finished reading and
 * stopped — three things that look identical to a scroll listener and
 * mean completely different things. A page that navigates itself out
 * from under a reader is one they cannot finish.
 *
 * So this counts deliberate travel, not arrival:
 *
 *   · nothing accumulates until the page is genuinely at its end
 *   · only downward intent counts, and pulling back up drains it
 *     immediately rather than merely pausing
 *   · a gap in the gesture DECAYS what was gathered, so inertia
 *     unwinding at the bottom cannot creep across the line while the
 *     reader has stopped touching anything
 *   · it takes a real pull, several hundred pixels of it, and the
 *     caller draws that progress so the reader watches it coming
 *
 * Reduced motion opts out entirely and leaves the link to do the job.
 */

import { useEffect, useRef, useState } from "react";

/** How much deliberate travel past the end commits the loop. */
const THRESHOLD = 420;
/** Pixels of gathered pull lost per second while the gesture is idle. */
const DECAY_PER_SEC = 900;
/** Idle time before decay starts, long enough to cover a finger lift. */
const GRACE_MS = 140;

/**
 * @param onCommit  what closing the ring does
 * @param resetKey  changes when the page does. The footer lives in the
 *   shell, so it does NOT unmount on a route change — without this the
 *   latch below would stay closed and the pull would work exactly once
 *   per session, which is how it first shipped.
 */
export function useRingPull(onCommit: () => void, resetKey?: string) {
  const [progress, setProgress] = useState(0);
  const fired = useRef(false);
  const commit = useRef(onCommit);
  commit.current = onCommit;

  useEffect(() => {
    fired.current = false;
    setProgress(0);
  }, [resetKey]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* Lenis owns <main>, so the page's end is that element's end and
       never the document's. */
    const scroller = document.querySelector("main");
    if (!scroller) return;

    let gathered = 0;
    let lastMove = 0;
    let raf = 0;
    let touchY = 0;

    const atEnd = () =>
      scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;

    const publish = () => setProgress(Math.min(1, gathered / THRESHOLD));

    const bleed = () => {
      raf = requestAnimationFrame(bleed);
      /* RE-ARMING LIVES HERE, not in the gesture handler. The homepage
         commits by scrolling to its own top, which is a programmatic
         scroll and fires no wheel event, so a latch that only reopened
         on a gesture stayed shut and the loop worked exactly once. The
         frame loop sees the page leave its end no matter what moved
         it. */
      if (fired.current && !atEnd()) fired.current = false;
      if (gathered <= 0) return;
      const idle = performance.now() - lastMove;
      if (idle < GRACE_MS) return;
      /* One frame's worth of decay, computed from real elapsed time so
         a slow frame does not bleed less than a fast one. */
      gathered = Math.max(0, gathered - (DECAY_PER_SEC * 16.7) / 1000);
      publish();
    };
    raf = requestAnimationFrame(bleed);

    const add = (delta: number) => {
      if (fired.current) return;
      if (delta < 0) {
        /* pulling back up is a decision to stay: drop it all at once */
        if (gathered > 0) { gathered = 0; publish(); }
        return;
      }
      if (!atEnd()) {
        /* still reading: whatever was gathered belongs to a moment
           that has passed */
        if (gathered > 0) { gathered = 0; publish(); }
        return;
      }
      lastMove = performance.now();
      gathered += delta;
      publish();
      if (gathered >= THRESHOLD) {
        fired.current = true;
        setProgress(1);
        commit.current();
      }
    };

    const onWheel = (e: WheelEvent) => add(e.deltaY);
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0]?.clientY ?? 0; };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      /* a finger moving UP the screen is a downward scroll */
      add(touchY - y);
      touchY = y;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return progress;
}
