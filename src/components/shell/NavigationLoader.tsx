"use client";

import { useNavigationState } from "./NavigationProvider";

/**
 * NavigationLoader — thin 3px progress bar fixed to the top of the viewport.
 *
 * Color matches the destination case study (themed via NavigationProvider).
 * Animates 0 → ~85% on its own (NProgress-style "creep"), then jumps to 100%
 * when the destination's hero loads + the burn transition is ready to play.
 *
 * Sits above everything but the burn-melt overlay so it stays visible during
 * the transition itself.
 */
export function NavigationLoader() {
  const { isNavigating, themeColor, progress } = useNavigationState();

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 2147483646, // sits above burn overlay (which is at 2147483645)
        pointerEvents: "none",
        opacity: isNavigating ? 1 : 0,
        transition: "opacity 220ms ease-out",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.round(progress * 100)}%`,
          backgroundColor: themeColor,
          transition: "width 220ms cubic-bezier(0.4, 0, 0.2, 1), background-color 180ms ease-out",
          boxShadow: `0 0 8px ${themeColor}66`,
        }}
      />
    </div>
  );
}
