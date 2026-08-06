"use client";

/**
 * useColumnDrop — the brief-family placement pass, extracted once.
 *
 * The rule every brief-shaped screen shares (brief, closing — the
 * prototype's .brief class): the running column starts BELOW the headline,
 * not beside its top, so the drop is the headline's margin + measured
 * height + GAP. Measured, not dealt: the headline rewraps across widths,
 * so no fixed offset survives a resize.
 *
 * This existed as hand-copied variants in every component and the copies
 * drifted (the closing shipped without it entirely; the contact beat lost
 * the settle pass) — the review that found both moved it here. The
 * crossing and the footer beats keep local passes on purpose: they add
 * math this core does not own (the pin cap, the release paddingBottom).
 *
 * Re-measures on window resize (geometry, not scroll — Lenis is not in
 * play), on fonts.ready, on a ResizeObserver over the headline (covers
 * whatever the other two miss), and on the prototype's 300ms settle pass —
 * the reveal masks net to zero layout only once every line has landed.
 */

import { useEffect, useLayoutEffect, type RefObject } from "react";

/** px between the headline's last line and the column's first (prototype GAP). */
export const COLUMN_GAP = 34;

/** useLayoutEffect warns during SSR; the measurement is client-only anyway. */
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useColumnDrop(
  sectionRef: RefObject<HTMLElement | null>,
  colRef: RefObject<HTMLElement | null>,
  opts: {
    /**
     * The width at or below which the component's own stylesheet stacks
     * headline and column into separate rows, making the measured drop
     * meaningless. MUST match that stylesheet's breakpoint — the review
     * caught a 760-vs-767 disagreement that left a dead band where the JS
     * wrote a drop into the stacked layout.
     */
    stackBelow: number;
  },
  deps: readonly unknown[]
) {
  useIsoLayoutEffect(() => {
    const sec = sectionRef.current;
    const col = colRef.current;
    if (!sec || !col) return;
    // RevealHeadline renders the tag itself, so the headline is reached the
    // way the prototype reached it: the section's own h2.
    const h2 = sec.querySelector("h2") as HTMLElement | null;
    if (!h2) return;

    const place = () => {
      if (window.innerWidth <= opts.stackBelow) {
        col.style.marginTop = "";
        return;
      }
      // Cleared first: headline and column share a grid row, so a stale
      // margin would inflate the row and compound on every resize.
      col.style.marginTop = "0px";
      const hs = getComputedStyle(h2);
      const drop = parseFloat(hs.marginTop) + h2.offsetHeight + COLUMN_GAP;
      col.style.marginTop = Math.max(0, Math.round(drop)) + "px";
    };

    place();
    window.addEventListener("resize", place);
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
      window.removeEventListener("resize", place);
      ro.disconnect();
      window.clearTimeout(t);
      col.style.marginTop = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionRef, colRef, opts.stackBelow, ...deps]);
}
