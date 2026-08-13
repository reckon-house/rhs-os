"use client";

/**
 * usePinDrift — takes the clunk out of a pin.
 *
 * position:sticky is binary. One frame the content is travelling at scroll
 * speed, the next it is at exactly zero, and the eye reads that as the page
 * hitting something. The plate that pins hardest reads as "stuck" even
 * though the mechanism is correct.
 *
 * The fix is to never fully stop. While the wrap is in its pinned range the
 * inner element keeps creeping upward at a small fraction of scroll speed,
 * so at the moment of engagement velocity drops from 1.0 to DRIFT rather
 * than to nothing. The content still holds — DRIFT is small enough that
 * over a long pin it is a few dozen pixels — but the arrival is a
 * deceleration instead of a stop.
 *
 * The creep only ever goes ONE WAY. An earlier version eased it back to
 * zero before release so the content would be "home" when sticky let go —
 * but that reverses direction mid-hold, and a held screen that drifts up
 * and then sags back down reads as a bounce, which is worse than the clunk
 * it was meant to fix. Once the pin ends the offset simply stays where it
 * finished: the element is a few dozen pixels higher than layout says, it
 * resumes travelling at full scroll speed from there, and nothing jumps.
 * The transform is cleared only once the wrap is off screen, where there is
 * nothing to see.
 *
 * Applied to the STICKY ELEMENT itself, which is safe: a transform on the
 * sticky box offsets what it paints without disturbing how sticky computes
 * its position. (A transform on an ANCESTOR is the thing that kills sticky
 * — see the notes in choreo.ts.) Components that already write a transform
 * to their sticky element should drift a child instead.
 */

import { useEffect, type RefObject } from "react";
import { onTick, reducedMotion, vh } from "@/lib/scrub";

/**
 * Fraction of scroll speed the pinned content keeps. Held content travels
 * at 8% of the page: enough that the eye never sees a hard stop, little
 * enough that the screen still reads as held. Straight multiplication, no
 * easing curve — a curve means the speed changes during the hold, and any
 * change in speed is exactly the thing this exists to remove.
 */
export const PIN_DRIFT = 0.08;

export function usePinDrift(
  wrapRef: RefObject<HTMLElement | null>,
  innerRef: RefObject<HTMLElement | null>,
  opts?: {
    drift?: number;
    /**
     * Offset into the wrap's travel (px) at which the hold ACTUALLY
     * engages, read per tick. Sticky pins engage the moment the wrap's top
     * passes the fold — the default 0. PinStage's transform hold engages
     * later, when the pin's bottom meets the fold, so it passes
     * max(0, pinHeight - viewport); without it the drift starts a partial
     * screen early and the content visibly slips at 1.08x page speed
     * before the hold begins.
     */
    startAt?: () => number;
  }
) {
  const drift = opts?.drift ?? PIN_DRIFT;
  const startAt = opts?.startAt;

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    let last = -1;

    const clear = () => {
      if (last !== 0) {
        last = 0;
        inner.style.transform = "";
      }
    };

    const off = onTick(() => {
      // Reduced motion holds every scrub still, checked per tick so a
      // mid-session flip hands the element straight back to its CSS state.
      if (reducedMotion()) return clear();
      if (document.documentElement.hasAttribute("data-paused")) return;

      const r = wrap.getBoundingClientRect();
      // Cleared only out of sight. While the wrap is anywhere on screen the
      // offset is held, including after the pin has released — dropping it
      // in view would be a jump.
      if (r.bottom < 0 || r.top > vh()) return clear();

      // How far into the pinned range we are, measured from where the hold
      // actually engages (startAt: 0 for sticky, bottom-meets-fold for
      // PinStage's transform mode). Before that point the content is moving
      // with the page and must not drift.
      const start = startAt ? Math.max(0, startAt()) : 0;
      const scrolled = -r.top - start;
      if (scrolled <= 0) return clear();

      // Where the pin ends. Past it the offset FREEZES at what it reached
      // rather than unwinding: the screen is travelling at full scroll speed
      // again, just sitting a few dozen pixels higher than layout says, and
      // a constant offset is invisible where a reversal is not.
      const span = Math.max(1, r.height - vh() - start);
      const held = Math.min(scrolled, span);

      // Straight multiplication: one pixel of scroll buys `drift` pixels of
      // creep, the whole way through. Monotonic by construction — it can
      // only ever move one direction, which is the point.
      const y = -held * drift;

      const next = Math.round(y * 10) / 10;
      if (next === last) return;
      last = next;
      inner.style.transform = next ? `translate3d(0,${next}px,0)` : "";
    });

    return () => {
      off();
      inner.style.transform = "";
    };
    // startAt is deliberately not a dep: it is captured once and read per
    // tick, so it must derive from refs/live DOM, never from render-scoped
    // state — an inline closure over refs is the intended shape.
  }, [wrapRef, innerRef, drift]);
}
