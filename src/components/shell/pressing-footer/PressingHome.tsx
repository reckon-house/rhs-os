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
 * AND IT IS A PULL, NOT A TRIPWIRE. An earlier version of the return
 * let a deliberate scroll past the end commit to a route, and it was
 * removed for a good reason: a page that can navigate itself out from
 * under someone mid-sentence is a page you cannot read on a trackpad.
 * That objection is answered here rather than ignored.
 *
 *   The flick that CARRIES you to the bottom cannot count. Momentum
 *   keeps firing wheel events for most of a second after your fingers
 *   have left the glass, so the pull only arms once the wheel has gone
 *   quiet — after that, it is a new push by definition.
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
import { curtain } from "@/lib/curtain";
import styles from "./PressingHome.module.css";

/** The name that pulses down the curtain, as the wordmark spells it. */
const HOUSE = "Reckon*House*Staples";
/** Where the homepage lives. The board is the front page now, and it
 *  is a static document: no router can reach it, so the way there is
 *  a hard navigation made under full black, exactly as the board
 *  reaches a study. `/` still serves the old homepage; when the board
 *  moves there, this is the one line that changes. */
const HOME = "/lab/board.html";
/** Overscroll that commits, in pixels. Two firm pushes, or one long
 *  drag: past the point where it could be the tail of a scroll. */
const PULL = 260;
/** The wheel has to go this quiet before a push counts, and the pull
 *  drains after this long without one. One number, both jobs: what
 *  ends a burst is what lets the next one start. */
const QUIET = 260;

/* ── THE SWAP, UNDER THE BLACK ──────────────────────────────────────
 * The commit the curtain runs once the black is down. It is the
 * board's own ptSwap, mirrored: write the note the arriving document
 * reads before its first paint — the name, and the MEASUREMENTS the
 * curtain here already worked out against this same viewport, so the
 * board draws the identical curtain and only has to lift it — then
 * navigate. The promise never resolves: the black stays down until
 * this document is gone, and the sequence's own ceiling gives the page
 * back if the board never arrives. */
const leave = (): Promise<void> => {
  const pt = document.getElementById("pt");
  const stack = pt?.querySelector<HTMLElement>(".ptw .ptstack");
  const note = {
    t: Date.now(),
    title: HOUSE,
    sub: "",
    n: stack ? stack.childElementCount : 0,
    lh: stack ? stack.style.getPropertyValue("--ptlh") : "",
    fs: stack ? stack.style.getPropertyValue("--ptfs") : "",
  };
  try {
    sessionStorage.setItem("pt.arrive", JSON.stringify(note));
  } catch {
    /* private mode: the board arrives without its curtain */
  }
  window.location.href = HOME;
  return new Promise<void>(() => {});
};

export function PressingHome() {
  const rootRef = useRef<HTMLElement | null>(null);
  const fired = useRef(false);

  const go = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    rootRef.current?.style.setProperty("--pull", "1");
    /* Reduced motion takes the plain navigation, the same call every
       link on the site makes. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.location.href = HOME;
      return;
    }
    void curtain(HOUSE, "", leave);
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
    let drain: ReturnType<typeof setTimeout> | undefined;

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
        clear();
        return;
      }
      /* Still inside the burst that brought us down here. */
      if (!armed) {
        if (gap < QUIET) return;
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
        <p className={styles.line}>That&rsquo;s the study.</p>
        <button type="button" className={styles.door} onClick={go}>
          Back to the work <span aria-hidden="true">&darr;</span>
        </button>
      </div>
    </section>
  );
}
