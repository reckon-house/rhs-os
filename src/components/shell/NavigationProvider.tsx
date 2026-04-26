"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

interface NavigationState {
  /** True from the moment a link is clicked until the destination's hero is loaded + transitions complete. */
  isNavigating: boolean;
  /** Theme color for the destination — drives the loader bar color. */
  themeColor: string;
  /** Target width 0–1. Driven by single CSS transitions, not interval steps. */
  target: number;
  /** Duration in ms for the width transition. 0 = snap, 1400 = creep, 200 = finish. */
  transitionMs: number;
}

interface NavigationActions {
  /** Begin navigation: bar appears in theme color, smoothly creeps toward 80%. */
  startNavigation: (themeColor: string) => void;
  /** The destination is fully ready — bar finishes to 100% fast, then fades. */
  completeNavigation: () => void;
}

const NavigationStateContext = createContext<NavigationState | null>(null);
const NavigationActionsContext = createContext<NavigationActions | null>(null);

// ── Tuning ────────────────────────────────────────────────────────────────
// Single ease-out curve from 0 → 80% over CREEP_MS. Slow enough to feel like
// progress on slower connections; fast enough that on typical static-page
// navigations it's still climbing when the hero loads.
const CREEP_MS = 1400;
// When ready, finish to 100% fast — this is what makes the bar feel TIED to
// the actual ready moment instead of completing on its own.
const FINISH_MS = 200;
// Hold at 100% before fading. Short — we want the bar gone the second the page
// is usable.
const HOLD_AT_FULL_MS = 80;
// Fade-out duration, controlled by NavigationLoader's opacity transition.
const FADE_MS = 200;

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NavigationState>({
    isNavigating: false,
    themeColor: "#141414",
    target: 0,
    transitionMs: 0,
  });

  // Hold/fade timers so we don't yank the loader away mid-fade.
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    holdTimerRef.current = null;
    fadeTimerRef.current = null;
  };

  const startNavigation = useCallback((themeColor: string) => {
    clearTimers();
    // Two-step: first snap to 0% (no transition), then on the next frame apply
    // the long transition + target. Without this, repeat navigations would
    // try to animate from the previous "fading" position.
    setState({ isNavigating: true, themeColor, target: 0, transitionMs: 0 });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setState((prev) => ({
          ...prev,
          target: 0.8,
          transitionMs: CREEP_MS,
        }));
      });
    });
  }, []);

  const completeNavigation = useCallback(() => {
    clearTimers();
    // Finish to 100% with a fast tail. The CSS transition handles the smooth
    // jump from wherever the creep got to → 100%.
    setState((prev) => ({ ...prev, target: 1, transitionMs: FINISH_MS }));

    // After the finish animation + brief hold, fade out via opacity.
    holdTimerRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, isNavigating: false }));
      // After the fade completes, snap width back to 0% (no transition) so
      // the next navigation starts clean.
      fadeTimerRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, target: 0, transitionMs: 0 }));
      }, FADE_MS + 40);
    }, FINISH_MS + HOLD_AT_FULL_MS);
  }, []);

  const actions = useMemo<NavigationActions>(
    () => ({ startNavigation, completeNavigation }),
    [startNavigation, completeNavigation],
  );

  return (
    <NavigationStateContext.Provider value={state}>
      <NavigationActionsContext.Provider value={actions}>
        {children}
      </NavigationActionsContext.Provider>
    </NavigationStateContext.Provider>
  );
}

export function useNavigationState(): NavigationState {
  const ctx = useContext(NavigationStateContext);
  if (!ctx) throw new Error("useNavigationState must be used within NavigationProvider");
  return ctx;
}

export function useNavigationActions(): NavigationActions {
  const ctx = useContext(NavigationActionsContext);
  if (!ctx) throw new Error("useNavigationActions must be used within NavigationProvider");
  return ctx;
}
