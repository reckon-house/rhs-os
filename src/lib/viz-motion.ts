"use client";

/**
 * viz-motion — the chart kit's two tiers of movement, in one place so
 * sixteen charts cannot drift into sixteen dialects of the same idea.
 * The spec is public/lab/viz-system.html; these are its numbers.
 *
 * TIER 1 · ARRIVAL (`useVizArrival`). A chart draws itself once when it
 * reaches the fold, in whatever direction its own logic runs. The hook
 * only reports WHEN; each shape owns HOW, because an arc sweeping and a
 * stripe mass filling are the same decision expressed in different
 * geometry.
 *
 * TIER 2 · THE READING HEAD (`useReadingHead`). A cursor that steps one
 * item at a time and repeats for as long as the chart is on screen —
 * the movement for a reader who stays. Two rules are enforced here
 * rather than left to each caller's judgement:
 *
 *   · it needs a SERIES. Under three items there is nothing to walk —
 *     a two-row before/after alternating reads as a blink, not a
 *     reading — so the hook returns -1 and the chart holds still.
 *   · it moves LABELS, never marks. That one is not enforceable in
 *     code, so it is written here: lifting a bar or thickening an arc
 *     to direct attention misstates the number, and the numbers are the
 *     one thing on the page that cannot move. Callers light type.
 *
 * Both hooks stop dead off screen — a clock running against nobody is
 * just work — and hold at their finished state under reduced motion.
 */

import { useEffect, useRef, useState, type RefObject } from "react";
import { onTick, reducedMotion } from "./scrub";

/** The house draw: the method grid's rule, and every chart's arrival. */
export const VIZ_DRAW_MS = 1150;
export const VIZ_EASE = "cubic-bezier(0.2, 0.55, 0.2, 1)";
/** Per-mark lead, so a series draws as a run rather than a flash. */
export const VIZ_STAGGER_MS = 35;
/** How long the reading head rests on one item. */
export const VIZ_HOLD_MS = 1500;
/** Fewer than this and there is no series worth walking. */
export const VIZ_MIN_SERIES = 3;

/** Fires true once the element has reached the fold. Never resets. */
export function useVizArrival(ref: RefObject<Element | null>): boolean {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return drawn;
}

/**
 * The index the head is resting on, or -1 when it should not run at
 * all — off screen, reduced motion, or too short a series.
 *
 * Rides the shared scrub loop rather than its own rAF, so
 * html[data-paused] stops it with everything else, and accumulates
 * CAPPED deltas so a backgrounded tab does not fast-forward through the
 * whole series the moment it comes back.
 */
export function useReadingHead(
  ref: RefObject<Element | null>,
  count: number
): number {
  const [active, setActive] = useState(-1);
  const liveRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (count < VIZ_MIN_SERIES || reducedMotion()) {
      setActive(-1);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          liveRef.current = e.isIntersecting;
          if (!e.isIntersecting) setActive(-1);
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    let elapsed = 0;
    let prev: number | null = null;
    let shown = -1;
    const off = onTick(() => {
      if (!liveRef.current) {
        prev = null;
        return;
      }
      const now = performance.now();
      if (prev != null) elapsed += Math.min(now - prev, 100);
      prev = now;
      const i = Math.floor(elapsed / VIZ_HOLD_MS) % count;
      if (i !== shown) {
        shown = i;
        setActive(i);
      }
    });

    return () => {
      io.disconnect();
      off();
    };
  }, [ref, count]);

  return active;
}
