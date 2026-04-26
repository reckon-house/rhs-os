"use client";

/**
 * HeroCarousel — auto-cycling carousel of case-study hero images.
 *
 * Transition mirrors the page-level BurnMeltTransition pattern:
 *   1. OUT — outgoing image heats up (filter ramps + opacity fades) AND a
 *      cover layer fades in to the container background color. Image dissolves
 *      THROUGH heat into the bg.
 *   2. BRIDGE — at midpoint we see only the bg-color cover, fully opaque.
 *   3. IN — cover fades out as the incoming image fades in, starting hot
 *      and cooling down (filter ramps off) into its clean state.
 *
 * Two stable <img> slots alternate roles each cycle (A→top, then B→top, etc.)
 * so we never swap `src` on a visible image — that's what was causing the
 * "blink of another image" when React re-keyed mid-transition.
 *
 * Place inside an overflow-hidden parent with the desired radius; the
 * carousel masks to that shape automatically.
 */

import { useEffect, useId, useRef, useState } from "react";

interface HeroSlide {
  src: string;
  alt: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  /** ms each slide is fully visible before the transition starts */
  holdMs?: number;
  /** ms the burn-fade transition itself takes */
  transitionMs?: number;
  /** Tailwind aspect class — e.g. "aspect-[16/10]" */
  aspectClassName?: string;
  /** Extra classes for the wrapper */
  className?: string;
  /** Background color of the parent container — used as the bridge color */
  bgColor?: string;
  /**
   * When true, wrap in a `hero-breakout` full-bleed section and animate
   * scale + border-radius on scroll (matches case-study HeroBlock):
   *   - At rest (off-screen below): scale 0.82, radius 60px
   *   - At full-size (top of viewport): scale 1, radius 0
   */
  scrollReactive?: boolean;
}

// Heat-fade transition tuning — front-loaded heat, light displacement
const HEAT = {
  // SVG displacement — kept low to avoid the "jiggle"
  displaceStart: 2,
  displacePeak: 5,
  // CSS filter — punched up to match (and exceed) the page transition values
  blurPeakPx: 4,
  saturatePeak: 5.5,
  contrastPeak: 2.6,
  // Timing curve within each phase (0 = phase start, 1 = phase end)
  // Heat ramps to peak by HEAT_RAMP_END so it's fully visible BEFORE opacity drops
  HEAT_RAMP_END: 0.32,
  // Opacity stays at 1 until OPACITY_FADE_START, then drops to 0 by phase end
  OPACITY_FADE_START: 0.42,
} as const;

export function HeroCarousel({
  slides,
  holdMs = 4500,
  transitionMs = 1000,
  aspectClassName = "aspect-[16/10]",
  className = "",
  bgColor = "#ECE6E1",
  scrollReactive = false,
}: HeroCarouselProps) {
  // Two slots, A and B. Each holds an index into `slides`.
  // `topSlot` says which one is currently visible (the other preloads the next slide).
  const [slotAIdx, setSlotAIdx] = useState(0);
  const [slotBIdx, setSlotBIdx] = useState(1 % Math.max(slides.length, 1));
  const [topSlot, setTopSlot] = useState<"A" | "B">("A");

  const filterId = useId().replace(/[:]/g, "-");

  // Refs to the two image slots + the bridge cover + SVG filter nodes
  const slotARef = useRef<HTMLImageElement | null>(null);
  const slotBRef = useRef<HTMLImageElement | null>(null);
  // Refs for the scroll-reactive wrapper (only used when scrollReactive=true)
  const sectionRef = useRef<HTMLElement | null>(null);
  const transformRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const turbRef = useRef<SVGFETurbulenceElement | null>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement | null>(null);

  // Build a CSS filter string at a given heat intensity (0 → 1)
  const buildFilter = (intensity: number) => {
    if (intensity <= 0) return "none";
    const blur = HEAT.blurPeakPx * intensity;
    const sat = 1 + (HEAT.saturatePeak - 1) * intensity;
    const con = 1 + (HEAT.contrastPeak - 1) * intensity;
    return `url(#${filterId}) blur(${blur}px) saturate(${sat}) contrast(${con})`;
  };

  // Auto-cycle: hold → transition → swap top slot → hold ...
  useEffect(() => {
    if (slides.length <= 1) return;

    let cancelled = false;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;

    const startTransition = () => {
      if (cancelled) return;

      // Determine which ref is the outgoing (currently top) and which is incoming
      const outRef = topSlot === "A" ? slotARef : slotBRef;
      const inRef = topSlot === "A" ? slotBRef : slotARef;

      const startTime = performance.now();

      const tick = () => {
        if (cancelled) return;
        const elapsed = performance.now() - startTime;
        const p = Math.min(elapsed / transitionMs, 1);

        // Two-phase: 0–0.5 = burn out (image → bg), 0.5–1 = burn in (bg → image)
        // Within each phase, heat ramps FAST and peaks before opacity starts moving.
        // That's what makes saturate/contrast read — the eye sees the hot image
        // at full visibility before it dissolves.
        const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
        const { HEAT_RAMP_END, OPACITY_FADE_START } = HEAT;
        const fadeSpan = 1 - OPACITY_FADE_START;

        let outOpacity: number, inOpacity: number;
        let outHeat: number, inHeat: number;
        let coverOpacity: number;

        if (p < 0.5) {
          // ── Phase 1: burn out ──
          const phaseP = p * 2;
          outHeat = clamp01(phaseP / HEAT_RAMP_END);                    // 0 → 1 fast
          outOpacity = clamp01(1 - (phaseP - OPACITY_FADE_START) / fadeSpan); // 1 → 0, delayed
          coverOpacity = 1 - outOpacity;
          inOpacity = 0;
          inHeat = 0;
        } else {
          // ── Phase 2: burn in (mirror of phase 1) ──
          const phaseP = (p - 0.5) * 2;
          inHeat = clamp01(1 - (phaseP - HEAT_RAMP_END) / (1 - HEAT_RAMP_END));
          // Opacity rises early, plateaus at 1
          inOpacity = clamp01(phaseP / OPACITY_FADE_START);             // 0 → 1 fast
          coverOpacity = 1 - inOpacity;
          outOpacity = 0;
          outHeat = 0;
        }

        // SVG displacement scale tracks total heat (so it peaks during the hot plateau)
        const totalHeat = Math.max(outHeat, inHeat);
        const scale = HEAT.displaceStart + totalHeat * (HEAT.displacePeak - HEAT.displaceStart);
        dispRef.current?.setAttribute("scale", String(scale));

        // Turbulence churn — slow live motion of the noise field
        if (turbRef.current) {
          const t = performance.now() * 0.001;
          const bx = 0.008 + Math.sin(t * 4) * 0.005;
          const by = 0.018 + Math.cos(t * 2.8) * 0.006;
          turbRef.current.setAttribute("baseFrequency", `${bx} ${by}`);
        }

        // Apply directly via refs — no React re-render
        if (outRef.current) {
          outRef.current.style.opacity = String(outOpacity);
          outRef.current.style.filter = buildFilter(outHeat);
          outRef.current.style.zIndex = "2";
        }
        if (inRef.current) {
          inRef.current.style.opacity = String(inOpacity);
          inRef.current.style.filter = buildFilter(inHeat);
          inRef.current.style.zIndex = "1";
        }
        if (overlayRef.current) {
          overlayRef.current.style.opacity = String(coverOpacity);
        }

        if (p < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          // Transition done — finalize visual state, then update React state
          // to swap top slot. The slide that was incoming is now the visible one;
          // its src didn't change, so no blink. The other slot will update its src
          // to the next-next slide while it's hidden underneath.
          if (outRef.current) {
            outRef.current.style.opacity = "0";
            outRef.current.style.filter = "none";
            outRef.current.style.zIndex = "1";
          }
          if (inRef.current) {
            inRef.current.style.opacity = "1";
            inRef.current.style.filter = "none";
            inRef.current.style.zIndex = "2";
          }
          if (overlayRef.current) overlayRef.current.style.opacity = "0";
          dispRef.current?.setAttribute("scale", String(HEAT.displaceStart));

          // Flip top slot + advance the now-hidden slot to the next slide
          const newTop = topSlot === "A" ? "B" : "A";
          setTopSlot(newTop);
          // The slot that just became hidden needs to load the slide AFTER the
          // newly visible one (so it's ready for the next transition).
          const visibleIdx = topSlot === "A" ? slotBIdx : slotAIdx;
          const nextIdx = (visibleIdx + 1) % slides.length;
          if (newTop === "A") {
            setSlotBIdx(nextIdx);
          } else {
            setSlotAIdx(nextIdx);
          }
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    holdTimer = setTimeout(startTransition, holdMs);

    return () => {
      cancelled = true;
      if (holdTimer) clearTimeout(holdTimer);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [topSlot, slotAIdx, slotBIdx, slides.length, holdMs, transitionMs, filterId]);

  // ── Scroll-reactive scale + radius (mirrors case-study HeroBlock) ──
  useEffect(() => {
    if (!scrollReactive) return;
    const section = sectionRef.current;
    const container = transformRef.current;
    if (!section || !container) return;

    const scrollEl = document.querySelector("main");
    if (!scrollEl) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Progress: 0 when entering viewport from bottom, 1 when top hits top of viewport
      const raw = 1 - rect.top / viewH;
      const progress = Math.max(0, Math.min(1, raw));
      // Scale 0.82 → 1.0
      const scale = 0.82 + progress * 0.18;
      // Radius 60 → 0
      const radius = Math.round(60 * (1 - progress));
      container.style.transform = `scale(${scale})`;
      container.style.borderRadius = `${radius}px`;
    };

    scrollEl.addEventListener("scroll", update, { passive: true });
    update();
    return () => scrollEl.removeEventListener("scroll", update);
  }, [scrollReactive]);

  if (slides.length === 0) return null;

  // Inner content (SVG filter + image slots + bridge cover) — same regardless of mode
  const innerContent = (
    <>
      {/* SVG filter — local to this carousel */}
      <svg aria-hidden style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.008 0.018"
              numOctaves={2}
              seed={5}
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation={3} result="smoothNoise" />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="smoothNoise"
              scale={HEAT.displaceStart}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Slot A — initial top */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={slotARef}
        src={slides[slotAIdx].src}
        alt={slides[slotAIdx].alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: topSlot === "A" ? 1 : 0,
          zIndex: topSlot === "A" ? 2 : 1,
          willChange: "opacity, filter",
        }}
        draggable={false}
      />

      {/* Slot B */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={slotBRef}
        src={slides[slotBIdx].src}
        alt={slides[slotBIdx].alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: topSlot === "B" ? 1 : 0,
          zIndex: topSlot === "B" ? 2 : 1,
          willChange: "opacity, filter",
        }}
        draggable={false}
      />

      {/* Bridge cover — container bg color, peaks at midpoint, sits above both images */}
      <div
        ref={overlayRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: bgColor,
          opacity: 0,
          zIndex: 3,
          willChange: "opacity",
        }}
      />

      {/* Preload the rest of the slides so the first cycle doesn't stutter while
          the next image loads in. Slot A & B already cover slides[0] and slides[1];
          everything from slides[2] onward gets a hidden eager-loaded preload tag. */}
      {slides.length > 2 && (
        <div aria-hidden className="absolute pointer-events-none opacity-0 w-0 h-0 overflow-hidden">
          {slides.slice(2).map((slide, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`preload-${i}`} src={slide.src} alt="" loading="eager" />
          ))}
        </div>
      )}
    </>
  );

  // ── Render mode A: scroll-reactive hero (full-bleed + scale/radius animation) ──
  if (scrollReactive) {
    return (
      <section ref={sectionRef} className="hero-breakout mb-8">
        <div
          ref={transformRef}
          className={`relative overflow-hidden ${aspectClassName} ${className}`}
          style={{
            backgroundColor: bgColor,
            transform: "scale(0.82)",
            borderRadius: "60px",
            transformOrigin: "center center",
            willChange: "transform, border-radius",
          }}
        >
          {innerContent}
        </div>
      </section>
    );
  }

  // ── Render mode B: inline (sits inside whatever parent provides bg/radius) ──
  return (
    <div
      className={`relative overflow-hidden ${aspectClassName} ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {innerContent}
    </div>
  );
}
