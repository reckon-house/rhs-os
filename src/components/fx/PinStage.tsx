"use client";

/**
 * PinStage — makes its children a held screen the NEXT sibling can climb
 * across. Ported from the .pinwrap / .pinner / .pinspacer trio in
 * public/lab/swiss-spread.html: the content holds once the reader has
 * seen it, a RisingPlate sibling crosses it, and it releases after the
 * spacer is spent.
 *
 * The travel is a spacer ELEMENT, not padding. A sticky element is
 * constrained by its ancestor's CONTENT box, so padding-bottom on the wrap
 * adds nothing — in the prototype the room measured -0.74px and the pin
 * never engaged, while a 40px probe element in the same host pinned fine.
 * An in-flow spacer grows the content box, which is what sticky reads.
 *
 * Two hold mechanisms, because position:sticky cannot cover both cases:
 *
 * - "sticky": content that fits the viewport pins at top:0 the normal way.
 *   The sticky sits on a plain wrapper rather than on the content itself —
 *   in the prototype a bare div pinned in a host where the grid inside it
 *   would not engage, even with position:sticky set inline.
 *
 * - "transform": content TALLER than the viewport. Sticky refused to
 *   engage for this from either edge despite correct offsets and ample
 *   room, so a driver translates the content down once its BOTTOM meets
 *   the fold — the point the reader has actually finished looking at it —
 *   up to the spacer's height. Measured every frame, so height never
 *   matters. The spacer still provides the scroll length.
 *
 * Integration constraint the code cannot enforce: sticky dies under
 * transformed, filtered, or overflow-clipping ancestors. Mount PinStage in
 * plain flow inside <main>, not inside anything that animates transform or
 * filter, or the "sticky" mode silently degrades to nothing.
 *
 * Under prefers-reduced-motion the choreography is off entirely (the
 * spacer hides, the pin goes static, content flows normally) via the
 * motion-reduce variants — pure CSS, so the server markup is correct at
 * any width with no hydration flash. It holds at every width.
 */

import { useEffect, useRef, useState } from "react";
import { onTick } from "@/lib/scrub";
import { PLATE_HOLD, RISE } from "@/lib/choreo";
import { usePinDrift } from "@/lib/pin-drift";

type PinStageProps = {
  children: React.ReactNode;
  /**
   * Keep the PLATE_HOLD beat before the climb (default). Turn off for
   * content that carries its own settling time, the way the prototype's
   * cover sequence sized its tail to RISE alone.
   */
  hold?: boolean;
  /** Force a hold mechanism; "auto" measures the content and chooses. */
  mode?: "auto" | "sticky" | "transform";
  className?: string;
};

export function PinStage({
  children,
  hold = true,
  mode = "auto",
  className = "",
}: PinStageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState<"sticky" | "transform">(
    mode === "transform" ? "transform" : "sticky",
  );

  // Auto mode: sticky when the content fits a screen, transform when it
  // spills past one. Measured against the pin wrapper — in sticky mode its
  // min-height pads short content up to exactly the viewport, so only
  // genuinely taller content reads as > innerHeight, and the decision is
  // stable in both directions. Re-measured on resize and on content growth
  // (fonts and images land after mount and can flip the answer).
  useEffect(() => {
    if (mode !== "auto") {
      setResolved(mode);
      return;
    }
    const pin = pinRef.current;
    if (!pin) return;
    const decide = () => {
      setResolved(
        pin.offsetHeight > window.innerHeight + 1 ? "transform" : "sticky",
      );
    };
    decide();
    const ro = new ResizeObserver(decide);
    ro.observe(pin);
    window.addEventListener("resize", decide);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", decide);
    };
  }, [mode]);

  // The transform hold. Undoing the current hold before reading the rect
  // gives the element's natural in-flow position, so the target is always
  // computed against layout truth rather than accumulated writes — which
  // is what lets scrolling back up unwind it for free.
  useEffect(() => {
    if (resolved !== "transform") return;
    const pin = pinRef.current;
    const spacer = spacerRef.current;
    if (!pin || !spacer) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let held = 0;

    const off = onTick(() => {
      // Checked per tick rather than once: both can flip mid-session, and
      // a stale hold left behind is a section frozen mid-air.
      if (reduce.matches) {
        if (held) {
          held = 0;
          pin.style.transform = "";
        }
        return;
      }
      // The VisibilityPause convention. The shared loop in scrub.ts already
      // parks itself on data-paused; this keeps the component correct even
      // if it is ever rewired to a driver that does not.
      if (document.documentElement.hasAttribute("data-paused")) return;
      const natural = pin.getBoundingClientRect().bottom - held;
      const want = Math.max(
        0,
        Math.min(spacer.offsetHeight, window.innerHeight - natural),
      );
      if (want !== held) {
        held = want;
        pin.style.transform = held
          ? `translateY(${held.toFixed(1)}px)`
          : "";
      }
    });
    return () => {
      off();
      pin.style.transform = "";
    };
  }, [resolved]);

  /* Held content never stops dead: it keeps creeping at a fraction of
     scroll speed so engaging the hold reads as a deceleration. The creep
     rides an INNER layer, not the pin box — the transform mechanism writes
     its own transform there, and two drivers on one element would fight.

     startAt aligns the creep with the hold's real engagement: sticky
     engages when the wrap's top passes the fold, but the transform hold
     only engages once the pin's BOTTOM meets it. For sticky-mode stages
     the pin is viewport-height (min-h-[100dvh]) so the formula yields ~0
     and behavior is unchanged; for taller transform-mode content it stops
     the drift from starting a partial screen early. Read per tick from the
     ref, never from `resolved` — state would be stale in the closure. */
  usePinDrift(wrapRef, driftRef, {
    startAt: () => {
      const pin = pinRef.current;
      return pin ? Math.max(0, pin.offsetHeight - window.innerHeight) : 0;
    },
  });

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div
        ref={pinRef}
        className={
          resolved === "sticky"
            ? // min-height fills short content to a full screen so the plate
              // crosses a held SCREEN, not a strip with page behind it —
              // guarded to the active state, since plain flow should keep
              // its natural height. dvh for the same reason as RISE.
              "sticky top-0 min-h-[100dvh] motion-reduce:static motion-reduce:min-h-0"
            : "relative will-change-transform"
        }
      >
        <div ref={driftRef}>{children}</div>
      </div>
      {/* The climb room, in flow. Hidden under reduced motion;
          offsetHeight then reads 0, which also zeroes the transform
          hold's travel without a separate code path. */}
      <div
        ref={spacerRef}
        aria-hidden="true"
        className="motion-reduce:hidden"
        style={{ height: hold ? `calc(${PLATE_HOLD} + ${RISE})` : RISE }}
      />
    </div>
  );
}
