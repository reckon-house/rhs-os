"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { LogoCarouselSection } from "@/lib/types";

const TRANSITION_MS = 900;

export function LogoCarousel({
  slides,
  interval = 5000,
  padding = "clamp(120px, 18vw, 280px)",
}: LogoCarouselSection) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track has slides + 1 clone of the first slide so we can snap back invisibly
  const track = [...slides, slides[0]];

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => i + 1);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  // When we land on the cloned last slide, snap back to 0 with no animation
  useEffect(() => {
    if (index === slides.length) {
      snapTimeoutRef.current = setTimeout(() => {
        setAnimate(false);
        setIndex(0);
        // Re-enable animation on the next paint so the snap doesn't get tweened
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setAnimate(true));
        });
      }, TRANSITION_MS);
    }
    return () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, [index, slides.length]);

  return (
    <section className="hero-breakout overflow-hidden">
      <div
        className="flex"
        style={{
          transform: `translateX(-${index * 100}vw)`,
          transition: animate ? `transform ${TRANSITION_MS}ms cubic-bezier(0.7, 0, 0.2, 1)` : "none",
          willChange: "transform",
        }}
      >
        {track.map((slide, i) => (
          <div
            key={`${slide.src}-${i}`}
            className="shrink-0 flex items-center justify-center"
            style={{
              width: "100vw",
              backgroundColor: slide.bg,
              padding,
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              width={800}
              height={600}
              sizes={`${slide.maxWidth ?? 360}px`}
              className="w-full h-auto"
              style={{ maxWidth: slide.maxWidth ?? 360, height: "auto" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
