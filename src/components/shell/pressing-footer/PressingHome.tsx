"use client";

/* ── PressingHome ───────────────────────────────────────────────────
 * The end of a case study, and the way back.
 *
 * It replaces three beats that used to sit here: contact, credits, and
 * the ring. The ring was the homepage's body repeated below the
 * footer, so a reader who kept scrolling arrived at a COPY of the front
 * page — thirty frames rebuilt from the same sources, in the same
 * order, under a different route. It read as the homepage right up
 * until you clicked something, and then the URL was wrong.
 *
 * So the scroll now goes to the homepage itself. Same act from the
 * reader's side, one fewer version of the same object to keep in step.
 *
 * AND NO CEREMONY. It played the site's curtain over the change for a
 * while, which was the wrong instinct: a curtain announces that
 * something is happening, and nothing is happening here beyond the
 * reader carrying on. Keep scrolling and the work is back. The board
 * is a static document so this is still a navigation, but an
 * unannounced one — prefetched as the pull begins, so by the time it
 * commits the page is already in hand.
 *
 * IT IS STILL A PULL, NOT A TRIPWIRE. A page that can navigate itself
 * out from under someone mid-sentence is a page you cannot read on a
 * trackpad, and that objection does not go away because the exit got
 * quieter.
 *
 *   The flick that CARRIES you to the bottom cannot count. Momentum
 *   keeps firing wheel events for most of a second after your fingers
 *   have left the glass. So a push counts once the wheel has gone
 *   quiet — a new push by definition — or once half a second has
 *   passed at the end, which is what a reader scrolling STEADILY does
 *   and a decaying flick does not.
 *
 *   The pull is visible while it happens. The rule fills as you push
 *   and drains the moment you stop, so nothing commits that you did
 *   not watch commit.
 *
 *   And there is a door as well as a gesture, because a gesture with
 *   no visible alternative is a gesture some readers simply never
 *   find.
 */

import { useCallback, useEffect, useRef } from "react";
import styles from "./PressingHome.module.css";

/** Where the homepage lives. The board is the front page now, and it
 *  is a static document: no router can reach it, so the way there is
 *  a hard navigation made under full black, exactly as the board
 *  reaches a study. `/` still serves the old homepage; when the board
 *  moves there, this is the one line that changes. */
const HOME = "/lab/board.html";
/** Overscroll that commits, in pixels. Far enough to be a decision,
 *  short enough to be one gesture. */
const PULL = 220;
/** The wheel has to go this quiet before a push counts, and the pull
 *  drains after this long without one. One number, both jobs: what
 *  ends a burst is what lets the next one start. */
const QUIET = 260;
/** ...or this long at the end, however busy the wheel has been. A
 *  flick's momentum is spent by here; a reader still scrolling is
 *  telling you something. */
const STEADY = 500;

export function PressingHome() {
  const rootRef = useRef<HTMLElement | null>(null);
  const fired = useRef(false);

  const go = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    rootRef.current?.style.setProperty("--pull", "1");
    window.location.href = HOME;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    /* Lenis owns <main> in wrapper mode, so the end of the page is a
       question about that element and never about the window. */
    const main = document.querySelector("main");
    if (!root || !main) return;

    let pull = 0;
    let armed = false;
    let last = 0;
    let ended = 0;
    let warmed = false;
    let drain: ReturnType<typeof setTimeout> | undefined;

    /* the board, fetched while the pull is still happening, so the
       commit has nothing left to wait for */
    const warm = () => {
      if (warmed) return;
      warmed = true;
      const l = document.createElement("link");
      l.rel = "prefetch";
      l.href = HOME;
      document.head.appendChild(l);
    };

    const draw = () =>
      root.style.setProperty("--pull", Math.min(1, pull / PULL).toFixed(3));
    const clear = () => {
      if (!pull) return;
      pull = 0;
      draw();
    };
    const atEnd = () =>
      main.scrollHeight - main.scrollTop - main.clientHeight <= 2;

    const add = (dy: number) => {
      warm();
      pull += dy;
      draw();
      if (pull >= PULL) go();
    };

    const onWheel = (e: WheelEvent) => {
      if (fired.current) return;
      const now = performance.now();
      const gap = now - last;
      last = now;
      clearTimeout(drain);
      if (e.deltaY <= 0 || !atEnd()) {
        armed = false;
        ended = 0;
        clear();
        return;
      }
      /* THE FIRST EVENT AT THE END ONLY MARKS THE TIME. Without this
         it arms itself: `last` is zero until something has scrolled,
         so the gap it measures against is the age of the page, which
         is always quiet enough. Anyone who reached the end by keyboard
         or by dragging the scrollbar would then commit on one push. */
      if (!ended) {
        ended = now;
        return;
      }
      /* Still inside the burst that brought us down here — unless it
         has gone on long enough to be someone scrolling rather than a
         flick running out. */
      if (!armed) {
        if (gap < QUIET && now - ended < STEADY) return;
        armed = true;
      }
      drain = setTimeout(() => {
        armed = false;
        clear();
      }, QUIET);
      add(e.deltaY);
    };

    /* A finger needs no arming. touchmove fires while the hand is on
       the glass and stops when it lifts, so every event here is
       already someone pushing on purpose. */
    let ty = 0;
    const onStart = (e: TouchEvent) => {
      ty = e.touches[0]?.clientY ?? 0;
      clear();
    };
    const onMove = (e: TouchEvent) => {
      if (fired.current) return;
      const y = e.touches[0]?.clientY ?? ty;
      const dy = ty - y;
      ty = y;
      if (dy <= 0 || !atEnd()) {
        clear();
        return;
      }
      add(dy);
    };

    const opt = { passive: true } as const;
    window.addEventListener("wheel", onWheel, opt);
    window.addEventListener("touchstart", onStart, opt);
    window.addEventListener("touchmove", onMove, opt);
    window.addEventListener("touchend", clear, opt);
    return () => {
      clearTimeout(drain);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", clear);
    };
  }, [go]);

  return (
    <section ref={rootRef} className={`hero-breakout ${styles.beat}`}>
      <div className={styles.rule}>
        <i className={styles.fill} aria-hidden="true" />
      </div>
      <div className={styles.row}>
        {/* the house's own sentence: what it is in ink, what happens
            next in grey, which is how every lead on the board reads */}
        <p className={styles.line}>
          That&rsquo;s the study.{" "}
          <span className={styles.dim}>Keep going and the work is back.</span>
        </p>
        <button type="button" className={styles.door} onClick={go}>
          Back to the work <span aria-hidden="true">&darr;</span>
        </button>
      </div>
    </section>
  );
}
