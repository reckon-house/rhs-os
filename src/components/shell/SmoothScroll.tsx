"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { SiteFooter } from "@/components/shell/SiteFooter";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const lenis = new Lenis({
      wrapper: el,
      content: el.firstElementChild as HTMLElement,
      lerp: 0.12,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main
      ref={wrapperRef}
      className="flex-1 overflow-y-auto overflow-x-hidden content-scroll pt-0 pb-[90px] px-0 md:px-[50px]"
    >
      <div>
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
