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
  /** Visual progress 0–1. Mostly indeterminate; jumps to 1 when ready. */
  progress: number;
}

interface NavigationActions {
  /** Begin navigation: starts the loader, sets theme, kicks off "creep" progress. */
  startNavigation: (themeColor: string) => void;
  /** The destination is fully ready — hero loaded, page rendered. Loader fills + fades. */
  completeNavigation: () => void;
  /** Bump progress manually (optional — used if we attach to real signals later). */
  setProgress: (progress: number) => void;
}

const NavigationStateContext = createContext<NavigationState | null>(null);
const NavigationActionsContext = createContext<NavigationActions | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NavigationState>({
    isNavigating: false,
    themeColor: "#141414",
    progress: 0,
  });

  // Holds the "creep" interval so we can clear it on completion.
  const creepRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Hold-completion timer so we don't yank the loader away mid-fade.
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startNavigation = useCallback((themeColor: string) => {
    if (creepRef.current) clearInterval(creepRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

    setState({ isNavigating: true, themeColor, progress: 0.05 });

    // Creep upward asymptotically — never reaches 100% on its own.
    // This is the standard NProgress trick: feels like real progress but capped
    // until the actual ready signal fires.
    creepRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev.isNavigating) return prev;
        const remaining = 0.85 - prev.progress;
        if (remaining <= 0.01) return prev;
        return { ...prev, progress: prev.progress + remaining * 0.18 };
      });
    }, 180);
  }, []);

  const completeNavigation = useCallback(() => {
    if (creepRef.current) {
      clearInterval(creepRef.current);
      creepRef.current = null;
    }

    // Fill to 100% then fade out after a beat so the user sees the completion.
    setState((prev) => ({ ...prev, progress: 1 }));

    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, isNavigating: false }));
      // Reset progress slightly later so the fade-out animation can play.
      fadeTimerRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, progress: 0 }));
      }, 300);
    }, 200);
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState((prev) => ({ ...prev, progress: Math.max(prev.progress, progress) }));
  }, []);

  const actions = useMemo<NavigationActions>(
    () => ({ startNavigation, completeNavigation, setProgress }),
    [startNavigation, completeNavigation, setProgress],
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
