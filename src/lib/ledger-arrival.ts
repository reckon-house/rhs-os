"use client";

/* ── Ledger arrival ─────────────────────────────────────────────────
 * Rows draw in as they reach the viewport: the rule scales from the
 * left, the words rise into it a beat later. The daybook's version of
 * the entrance everything else on the site already makes.
 *
 * THE RESTING STATE IN CSS IS THE FINISHED ONE, same contract as the
 * compose form and the crossing headline: a stylesheet that hides
 * content is an invisible page the moment a script fails. This hook
 * applies the start state itself, and only to rows still below the
 * fold — anything already on screen stays put rather than blinking
 * hidden and back.
 *
 * Under reduced motion it does nothing at all, which leaves the page
 * exactly as the server rendered it.
 */

import { useEffect, type RefObject } from "react";

export function useLedgerArrival(
  rootRef: RefObject<HTMLElement | null>,
  /** Selector for the rows, resolved inside the root. */
  rowSelector: string,
  /** The JS-applied start-state class. Removing it plays the arrival. */
  preClass: string,
  /** Changes when the rows are REBUILT, so the new ones get armed too.
      Without it this ran once on mount and a filtered list arrived with
      every below-fold row already settled, which reads as the page
      having quietly given up halfway down. */
  key?: unknown
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rows = Array.from(root.querySelectorAll<HTMLElement>(rowSelector));
    if (!rows.length) return;

    /* Only rows below the fold are armed. 0.92 rather than 1.0 so a row
       half-peeking over the bottom edge is treated as visible instead
       of vanishing under the reader's cursor. */
    const armed = rows.filter(
      (r) => r.getBoundingClientRect().top > window.innerHeight * 0.92
    );
    armed.forEach((r) => r.classList.add(preClass));
    if (!armed.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        /* Rows that cross together cascade rather than land as one
           slab: the batch index is the stagger. */
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, k) => {
            const el = e.target as HTMLElement;
            el.style.setProperty("--dbd", `${k * 80}ms`);
            el.classList.remove(preClass);
            io.unobserve(el);
          });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
    );
    armed.forEach((r) => io.observe(r));

    return () => {
      io.disconnect();
      rows.forEach((r) => {
        r.classList.remove(preClass);
        r.style.removeProperty("--dbd");
      });
    };
  }, [rootRef, rowSelector, preClass, key]);
}
