"use client";

import { useNavigationState } from "./NavigationProvider";

/**
 * NavigationLoader — thin 3px progress bar fixed to the top of the viewport.
 *
 * Driven by NavigationProvider. A single CSS transition handles the smooth
 * 0 → 80% creep, then a fast finish to 100% the instant the destination is
 * ready. Color is themed per destination case study.
 *
 * Sits above the burn-melt overlay so it stays visible during the transition.
 */
export function NavigationLoader() {
  const { isNavigating, themeColor, target, transitionMs } = useNavigationState();

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 2147483646, // sits above burn overlay (2147483645)
        pointerEvents: "none",
        opacity: isNavigating ? 1 : 0,
        transition: "opacity 200ms ease-out",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${target * 100}%`,
          backgroundColor: themeColor,
          transition: transitionMs
            ? `width ${transitionMs}ms cubic-bezier(0.1, 0.9, 0.2, 1), background-color 180ms ease-out`
            : "background-color 180ms ease-out",
          boxShadow: `0 0 8px ${themeColor}66`,
          willChange: "width",
        }}
      />
    </div>
  );
}
