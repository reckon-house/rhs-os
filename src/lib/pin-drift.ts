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
 * The creep is also eased OUT at the end of the pin, so releasing does not
 * introduce a second, opposite jolt: the drift returns to zero as the wrap
 * hands off, and the content is back where the layout expects it just as
 * sticky lets go.
 *
 * Applied to the STICKY ELEMENT itself, which is safe: a transform on the
 * sticky box offsets what it paints without disturbing how sticky computes
 * its position. (A transform on an ANCESTOR is the thing that kills sticky
 * — see the notes in choreo.ts.) Components that already write a transform
 * to their sticky element should drift a child instead.
 */

import { useEffect, type RefObject } from "react";
import { onTick, reducedMotion, vh } from "@/lib/scrub";
import { CHOREO_BREAKPOINT } from "@/lib/choreo";

/**
 * Fraction of scroll speed the pinned content keeps. 0.06 is the value that
 * reads as "settling" rather than "sliding": high enough that the eye never
 * sees a hard stop, low enough that the content still reads as held.
 */
export const PIN_DRIFT = 0.06;

/** The creep never exceeds this, however long the pin runs. */
export const PIN_DRIFT_MAX = 64;

/** Ease the creep away over the last of the pin so release is silent too. */
const RELEASE = 0.18;

export function usePinDrift(
  wrapRef: RefObject<HTMLElement | null>,
  innerRef: RefObject<HTMLElement | null>,
  opts?: { drift?: number; max?: number }
) {
  const drift = opts?.drift ?? PIN_DRIFT;
  const max = opts?.max ?? PIN_DRIFT_MAX;

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const narrow = window.matchMedia(`(max-width: ${CHOREO_BREAKPOINT}px)`);
    let last = -1;

    const clear = () => {
      if (last !== 0) {
        last = 0;
        inner.style.transform = "";
      }
    };

    const off = onTick(() => {
      // Below the breakpoint nothing pins, and reduced motion holds every
      // scrub still — both checked per tick so a mid-session flip hands the
      // element straight back to its CSS state.
      if (narrow.matches || reducedMotion()) return clear();
      if (document.documentElement.hasAttribute("data-paused")) return;

      const r = wrap.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh()) return clear();

      // How far into the pinned range we are. Sticky engages when the wrap's
      // top passes the fold, so scrolled <= 0 means the wrap is still on its
      // way in and the content is moving with the page already.
      const scrolled = -r.top;
      if (scrolled <= 0) return clear();

      const span = Math.max(1, r.height - vh());
      const p = scrolled / span;
      if (p >= 1) return clear();

      // Saturating, not clamped. A hard min() would move the clunk rather
      // than remove it: the creep would run at a constant rate and then
      // stop dead at the cap. This approaches `max` asymptotically, so
      // velocity starts at exactly `drift` where the pin engages and decays
      // smoothly to nothing — there is never a second corner.
      const creep = max * (1 - Math.exp((-scrolled * drift) / max));

      // Ramp what is left away over the final RELEASE of the pin so the
      // content is home by the time sticky lets go.
      const fade = p > 1 - RELEASE ? (1 - p) / RELEASE : 1;
      const y = -creep * fade;

      const next = Math.round(y * 10) / 10;
      if (next === last) return;
      last = next;
      inner.style.transform = next ? `translate3d(0,${next}px,0)` : "";
    });

    return () => {
      off();
      inner.style.transform = "";
    };
  }, [wrapRef, innerRef, drift, max]);
}
