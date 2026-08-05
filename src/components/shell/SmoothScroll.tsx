"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { Masthead } from "@/components/shell/Masthead";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // The Pressing C feel: a timed tween per wheel tick that decelerates to
    // a real stop, rather than lerp's exponential chase that never quite
    // arrives. easeOut^6 holds speed through the middle then brakes hard at
    // the end — the "arrives into place" part; wheelMultiplier under 1 is
    // what actually reads as weight.
    const lenis = new Lenis({
      wrapper: el,
      content: el.firstElementChild as HTMLElement,
      smoothWheel: true,
      duration: 1.65,
      easing: (t) => 1 - Math.pow(1 - t, 6),
      wheelMultiplier: 0.65,
      touchMultiplier: 1.4,
    });

    // Publish the instance so route changes can drive the scroller through
    // Lenis. Setting main.scrollTop directly gets overwritten on the next
    // frame — see src/lib/lenis.ts.
    setLenis(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return (
    <main
      ref={wrapperRef}
      className="flex-1 overflow-y-auto overflow-x-hidden content-scroll pt-0 pb-[90px] px-0 md:px-[50px]"
    >
      <div>
        {/* The masthead is sticky against <main> (the Lenis scroller), so it
            must be a direct child of this content div — inside a per-page
            wrapper the stick would end at that wrapper's bounds. */}
        <Masthead />
        {children}
        {/* Global site footer — appears at the bottom of every page.
            Lives at the SmoothScroll layer so it's a sibling of the page
            content, free to use hero-breakout for true full-bleed
            without being constrained by per-page wrappers. */}
        <SiteFooter />
      </div>
    </main>
  );
}
