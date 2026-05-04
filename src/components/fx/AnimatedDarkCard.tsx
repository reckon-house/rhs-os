"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  AnimatedDarkCard — only the background surface scales 0.82 → 1.0    */
/*  and the corners sharpen 75px → 0px as the section enters view.      */
/*  Text content sits on top in normal flow at constant size, so the    */
/*  reading experience stays persistent.                                 */
/*                                                                       */
/*  The current scale is also written to the section as a CSS variable  */
/*  --card-scale so any opt-in element inside (like a chart) can use    */
/*  `transform: scale(var(--card-scale))` to scale in lockstep.         */
/* ------------------------------------------------------------------ */

export function AnimatedDarkCard({
  children,
  navDark = false,
}: {
  children: React.ReactNode;
  /**
   * When true, marks the section with `data-nav-dark` so the NavRail can
   * detect overlap and invert its text/icon/divider colors for legibility
   * over the dark background.
   */
  navDark?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const scrollEl = document.querySelector("main");
    if (!scrollEl) return;

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Progress: 0 when section enters viewport from below, 1 when its top hits viewport top.
      const raw = 1 - rect.top / viewH;
      const progress = Math.max(0, Math.min(1, raw));
      const scale = 0.82 + progress * 0.18;
      const radius = Math.round(75 * (1 - progress));
      bg.style.transform = `scale(${scale})`;
      bg.style.borderRadius = `${radius}px`;
      // Expose to opt-in children (e.g. the chart wrapper).
      section.style.setProperty("--card-scale", String(scale));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      scrollEl.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-dark={navDark || undefined}
      className="hero-breakout relative py-20"
      style={{ ["--card-scale" as string]: "0.82" }}
    >
      {/* Background — sits behind content, scales 0.82 → 1.0 with radius. */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform pointer-events-none"
        style={{
          backgroundColor: "#141414",
          borderRadius: "75px",
          transform: "scale(0.82)",
          transformOrigin: "center center",
        }}
      />
      {/* Content — static, on top. */}
      <div className="relative">
        {children}
      </div>
    </section>
  );
}
