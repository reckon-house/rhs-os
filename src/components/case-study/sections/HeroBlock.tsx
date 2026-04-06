"use client";

import { useEffect, useRef } from "react";
import type { HeroSection } from "@/lib/types";

export function HeroBlock({ image, alt, inline }: HeroSection) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const scrollEl = document.querySelector("main");
    if (!scrollEl) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;

      // Progress: 0 when element enters viewport from bottom, 1 when top hits top of viewport
      const raw = 1 - (rect.top / viewH);
      const progress = Math.max(0, Math.min(1, raw));

      // Scale: 0.82 → 1.0
      const scale = 0.82 + progress * 0.18;

      // Border radius: 60px → 0px
      const radius = Math.round(60 * (1 - progress));

      container.style.transform = `scale(${scale})`;
      container.style.borderRadius = `${radius}px`;
    };

    scrollEl.addEventListener("scroll", update, { passive: true });
    update(); // initial

    return () => scrollEl.removeEventListener("scroll", update);
  }, []);

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
            className={`w-full h-auto${inline ? " scale-[1.04]" : ""}`}
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
