"use client";

/**
 * CapabilityWebShowpiece — wraps the SECTION 04: PRACTICE chart with a 3D
 * showpiece variant. The three.js / R3F scene loads lazily once the section
 * scrolls into view, so the heavy runtime never enters the initial JS payload.
 *
 * Pre-mount and on reduced-motion devices, the 2D SVG chart shows as a
 * faithful fallback. The heading + meta block is shared between both.
 */

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { CapabilityWebHeader, CapabilityWebChart2D } from "@/components/CapabilityWeb";

const CapabilityWeb3D = dynamic(() => import("@/components/CapabilityWeb3D"), {
  ssr: false,
  loading: () => null,
});

export function CapabilityWebShowpiece({ dark = true }: { dark?: boolean } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mount3D, setMount3D] = useState(false);

  // Respect the user's reduced-motion preference: skip 3D entirely.
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // IntersectionObserver — mount the 3D bundle once the section is near view.
  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setMount3D(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "50% 0px 50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  const showing3D = !reducedMotion && mount3D;

  return (
    <div className="w-full">
      <CapabilityWebHeader dark={dark} />

      <div ref={containerRef}>
        {showing3D ? (
          <CapabilityWeb3D dark={dark} />
        ) : (
          <CapabilityWebChart2D dark={dark} />
        )}
      </div>
    </div>
  );
}
