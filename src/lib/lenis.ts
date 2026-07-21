import type Lenis from "lenis";

/**
 * The page scrolls inside <main>, not the document (see SmoothScroll), and
 * Lenis owns that scroller. Writing `main.scrollTop` directly looks like it
 * works and then silently doesn't: Lenis re-applies its own internal
 * `animatedScroll` on the very next rAF frame, snapping the page back to the
 * old offset. That's why a route change used to leave you at the previous
 * page's scroll position.
 *
 * Anything that needs to move the page has to go through the instance, so
 * SmoothScroll registers it here on mount. Module-scoped rather than a React
 * context because the consumers (BurnMeltTransition) are siblings of
 * SmoothScroll in the root layout, not descendants.
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Jump to the top of the page without fighting Lenis's rAF loop. */
export function scrollPageToTop() {
  if (lenis) {
    // Re-measure first: the new route's content is already in the DOM, and
    // without this Lenis still clamps to the previous page's scroll limit.
    lenis.resize();
    lenis.scrollTo(0, { immediate: true, force: true });
  }
  // Also reset the element itself, which covers the window between mount and
  // Lenis registering, and keeps behaviour correct if Lenis ever goes away.
  const el = document.querySelector("main");
  if (el) el.scrollTop = 0;
}
