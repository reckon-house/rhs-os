"use client";

import { useEffect, useRef } from "react";
import type { HeroSection } from "@/lib/types";

export function HeroBlock({ image, alt, inline, cropWide }: HeroSection) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const scrollEl = document.querySelector("main");
    if (!scrollEl) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;

      // Progress: 0 when element enters viewport from bottom, 1 when top hits top of viewport
      const raw = 1 - rect.top / viewH;
      const progress = Math.max(0, Math.min(1, raw));

      if (cropWide) {
        // Image at a fixed vh height, container grows in height in lockstep
        // with the scaled image so top/bottom never clip — only the sides
        // clip at the viewport edges. The vh height is intentionally smaller
        // than 80vh because the source image (hero2b) has TWO stacked rows
        // of mockups; constraining to 80vh would have rendered them tall
        // enough that — combined with the image's wider-than-viewport
        // natural width — the second row sat below the visible viewport.
        // 60vh keeps both rows in view at all scales.
        const img = imgRef.current;
        const container = containerRef.current;
        if (!img || !container) return;
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        const baseHeightVh = isDesktop ? 60 : 40;
        const scale = 1.05 + progress * 0.25;
        img.style.height = `${baseHeightVh}vh`;
        img.style.width = "auto";
        img.style.transform = `translate(-50%, -50%) scale(${scale})`;
        container.style.height = `${baseHeightVh * scale}vh`;
      } else {
        const container = containerRef.current;
        if (!container) return;
        // Scale: 0.82 → 1.0
        const scale = 0.82 + progress * 0.18;
        // Border radius: 60px → 0px
        const radius = Math.round(60 * (1 - progress));
        container.style.transform = `scale(${scale})`;
        container.style.borderRadius = `${radius}px`;
      }
    };

    scrollEl.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update(); // initial

    return () => {
      scrollEl.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [cropWide]);

  // cropWide: image at a fixed vh height (sized small enough to fit the
  // image's full vertical content — both rows of mockups for the
  // jeffrey-ecommerce hero2b source), absolutely centered inside a 100vw
  // container that grows in height in lockstep with the scaled image. All
  // dimensions driven by inline style + JS to avoid Tailwind arbitrary-value
  // parsing edge cases.
  if (cropWide && image) {
    return (
      <section
        ref={sectionRef}
        className={`hero-breakout ${inline ? "mt-10 mb-4" : "mb-8"}`}
      >
        <div
          ref={containerRef}
          className="w-full overflow-hidden relative"
          style={{ height: "63vh" }} // 60vh × 1.05; JS overrides for mobile and on scroll
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={image}
            alt={alt}
            loading="lazy"
            fetchPriority="auto"
            className="block absolute will-change-transform"
            style={{
              height: "60vh",
              width: "auto",
              maxWidth: "none",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(1.05)",
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`hero-breakout ${inline ? "mt-10 mb-4" : "mb-8"}`}
    >
      <div
        ref={containerRef}
        className="w-full overflow-hidden bg-surface-alt will-change-transform"
        style={{
          transform: "scale(0.82)",
          borderRadius: "60px",
          transformOrigin: "center center",
        }}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={alt}
            loading={inline ? "lazy" : "eager"}
            fetchPriority={inline ? "auto" : "high"}
            className={`w-full ${inline ? "scale-[1.04] " : ""}aspect-[5/4] md:aspect-auto object-cover md:object-contain md:h-auto`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#5a3e28]/60 to-[#3a2518]/80 flex items-end justify-center pb-0 overflow-hidden">
            <div className="w-[220px] md:w-[280px] bg-[#1a1a1a] rounded-t-[20px] h-[60%] flex flex-col p-3 pt-6">
              <p className="text-[10px] text-white/60 italic">my</p>
              <p className="text-[13px] text-white font-bold">home</p>
              <p className="text-[8px] text-white/50 mt-2 leading-relaxed">
                Keep your inventory current — tap into your rooms below to
                manage items, edit details, and attach documents.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
