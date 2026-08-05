/**
 * Shared motion driver for scroll-scrubbed components.
 *
 * The page scrolls inside <main>, not the document (see SmoothScroll), and
 * Lenis owns that scroller in wrapper mode — it animates the element's native
 * scrollTop, so real scroll events fire on <main> while a bare window scroll
 * listener never hears anything. Every scrubbed component needs the same two
 * signals (a per-frame tick and main's scroll), and if each one wires its own
 * rAF loop the way the swiss-spread prototype does, the site ends up running
 * N loops for one page. This module is the one loop they all subscribe to.
 *
 * The loop honours the VisibilityPause convention: while `data-paused` sits
 * on <html> (backgrounded tab), no ticks fire and no frames are scheduled.
 * A subscriber that throws is isolated — one broken component must not kill
 * the site's motion.
 *
 * No React in here. Components wrap these in their own useEffect and treat
 * the returned function as the cleanup. The module imports cleanly on the
 * server: nothing touches window until a subscribe call, and the callable
 * helpers degrade to inert values.
 */

type Cb = () => void;

const tickSubs = new Set<Cb>();
let rafId: number | null = null;
let pauseObserver: MutationObserver | null = null;

/** Callbacks that already logged a throw, so a component broken at 60fps
 *  produces one console line instead of a firehose. */
const reported = new WeakSet<Cb>();

function paused(): boolean {
  return document.documentElement.hasAttribute("data-paused");
}

function frame() {
  rafId = null;
  // The per-frame check is what parks the loop: on the first frame after
  // data-paused appears (or the last subscriber leaves), we simply don't
  // schedule another one. Resuming can't work the same way — a parked loop
  // has no frames in which to notice the attribute left — so the
  // MutationObserver below owns that direction.
  if (paused() || tickSubs.size === 0) return;
  // Snapshot before iterating: a callback that subscribes or unsubscribes
  // others mid-frame shouldn't change who runs in THIS frame.
  for (const cb of Array.from(tickSubs)) {
    try {
      cb();
    } catch (err) {
      if (!reported.has(cb)) {
        reported.add(cb);
        console.error("[scrub] tick subscriber threw; the shared loop keeps running:", err);
      }
    }
  }
  rafId = requestAnimationFrame(frame);
}

function startLoop() {
  if (rafId !== null) return;
  if (tickSubs.size === 0 || paused()) return;
  rafId = requestAnimationFrame(frame);
}

function watchPause() {
  if (pauseObserver !== null) return;
  // One idle observer on one attribute is cheap enough to keep for the life
  // of the page; it exists to restart the loop when VisibilityPause removes
  // data-paused. Created lazily so the module stays SSR-clean.
  pauseObserver = new MutationObserver(() => {
    if (!paused()) startLoop();
  });
  pauseObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-paused"],
  });
}

/**
 * Subscribe to the shared requestAnimationFrame loop. The loop runs only
 * while at least one subscriber exists and <html> has no data-paused
 * attribute. Returns the unsubscribe function.
 */
export function onTick(cb: Cb): () => void {
  if (typeof window === "undefined") return () => {};
  tickSubs.add(cb);
  watchPause();
  startLoop();
  return () => {
    tickSubs.delete(cb);
    if (tickSubs.size === 0 && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

/**
 * Subscribe to native scroll events on <main> — the events Lenis's animated
 * scrollTop actually produces. Passive, because no subscriber may call
 * preventDefault on this scroller. If <main> isn't in the DOM yet (a
 * component effect racing the root layout), binding retries each frame until
 * it is. Returns the unsubscribe function.
 */
export function onMainScroll(cb: Cb): () => void {
  if (typeof window === "undefined") return () => {};
  let bound: HTMLElement | null = null;
  let retry = 0;
  const bind = () => {
    const main = document.querySelector("main");
    if (main) {
      bound = main;
      main.addEventListener("scroll", cb, { passive: true });
    } else {
      retry = requestAnimationFrame(bind);
    }
  };
  bind();
  return () => {
    cancelAnimationFrame(retry);
    if (bound) bound.removeEventListener("scroll", cb);
  };
}

/**
 * Live prefers-reduced-motion check. Read it at the moment of deciding, not
 * once at mount — the user can flip the OS setting with the page open.
 * Scrubbed motion renders static when this is true; entrance animations
 * render in their final state.
 */
export function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Viewport height in pixels; 0 on the server. Use this (or 100dvh in CSS)
 * instead of 100vh: the shell is h-dvh, and 100vh overshoots by the mobile
 * browser-chrome delta. getBoundingClientRect-vs-vh() math is safe because
 * <main> spans the full viewport.
 */
export function vh(): number {
  return typeof window === "undefined" ? 0 : window.innerHeight;
}
