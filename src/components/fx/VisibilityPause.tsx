"use client";

import { useEffect } from "react";

/**
 * Pauses the perpetual background animations (SpringSolve pen-drawing + the
 * thumbnail floats) while the tab is hidden, so a backgrounded tab stops
 * spending paint/composite power for nobody. Toggles `data-paused` on <html>;
 * the heavy animations are gated behind `html[data-paused]` in globals.css.
 *
 * Visible behaviour is untouched — this only kicks in when document.hidden.
 */
export function VisibilityPause() {
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => root.toggleAttribute("data-paused", document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return null;
}
