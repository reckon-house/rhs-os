"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const DEFAULT_MASK_URL =
  "/mask-melt.png";

const BAR_HEIGHT = 350;

const SETTINGS = {
  intensity: 1,
  blur: 6,
  saturation: 7,
  contrast: 3,
  displacement: 70,
  displacementBlur: 0,
  waveBaseX: 2,
  waveBaseY: 2,
  waveRangeX: 0.5,
  waveRangeY: 1,
  animationSpeed: 0.1,
  peakVelocityThreshold: 800,
  fadeStartVelocity: 400,
  offset: 0,
};

export function HeatbarMelt() {
  const {
    intensity,
    blur,
    saturation,
    contrast,
    displacement,
    displacementBlur,
    waveBaseX,
    waveBaseY,
    waveRangeX,
    waveRangeY,
    animationSpeed,
    peakVelocityThreshold,
    fadeStartVelocity,
    offset,
  } = SETTINGS;

  const barRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastScrollY = useRef<number>(0);
  const lastScrollTime = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const velocityHistory = useRef<{ v: number; t: number }[]>([]);
  const currentFadeProgress = useRef<number>(1);

  const [uniqueId] = useState(() => Math.random().toString(36).substr(2, 9));

  const isIOSSafari =
    typeof navigator !== "undefined" &&
    (() => {
      const ua = navigator.userAgent;
      const iOS =
        /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const safari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua);
      return iOS && safari;
    })();

  const filterId = `heatbar-displace-${uniqueId}`;
  const baseX = waveBaseX / 1000;
  const baseY = waveBaseY / 1000;
  const rangeX = waveRangeX / 1000;
  const rangeY = waveRangeY / 1000;

  // Inject SVG filter into document
  useEffect(() => {
    const existingSvg = document.getElementById(`svg-heatbar-${uniqueId}`);
    if (existingSvg) existingSvg.remove();

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = `svg-heatbar-${uniqueId}`;
    svg.setAttribute(
      "style",
      "position:absolute;width:0;height:0;pointer-events:none;"
    );
    svg.innerHTML = `
      <defs>
        <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="${baseX} ${baseY}"
            numOctaves="3"
            seed="42"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="${displacementBlur}" result="smoothNoise"/>
          <feDisplacementMap in="SourceGraphic" in2="smoothNoise" scale="${displacement}" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
    `;
    document.body.appendChild(svg);
    svgRef.current = svg;

    return () => {
      const el = document.getElementById(`svg-heatbar-${uniqueId}`);
      if (el) el.remove();
    };
  }, [uniqueId, filterId, baseX, baseY, displacementBlur, displacement]);

  // Apply fade based on progress (0 = visible, 1 = hidden)
  const applyFade = useCallback(
    (progress: number) => {
      const bar = barRef.current;
      if (!bar) return;

      progress = Math.max(0, Math.min(1, progress));
      currentFadeProgress.current = progress;

      const edgeFadeMask = isIOSSafari
        ? `linear-gradient(to bottom, transparent 0%, black 15%, black 100%)`
        : null;

      if (progress >= 0.99) {
        bar.style.opacity = "0";
        bar.style.webkitMaskImage = `url(${DEFAULT_MASK_URL})`;
        bar.style.maskImage = `url(${DEFAULT_MASK_URL})`;
        (bar.style as unknown as Record<string, string>).webkitMaskComposite = "";
        (bar.style as unknown as Record<string, string>).maskComposite = "";
      } else if (progress <= 0.01) {
        bar.style.opacity = String(intensity);
        if (edgeFadeMask) {
          bar.style.webkitMaskImage = `${edgeFadeMask}, url(${DEFAULT_MASK_URL})`;
          bar.style.maskImage = `${edgeFadeMask}, url(${DEFAULT_MASK_URL})`;
          (bar.style as unknown as Record<string, string>).webkitMaskComposite = "source-in";
          (bar.style as unknown as Record<string, string>).maskComposite = "intersect";
        } else {
          bar.style.webkitMaskImage = `url(${DEFAULT_MASK_URL})`;
          bar.style.maskImage = `url(${DEFAULT_MASK_URL})`;
          (bar.style as unknown as Record<string, string>).webkitMaskComposite = "";
          (bar.style as unknown as Record<string, string>).maskComposite = "";
        }
      } else {
        bar.style.opacity = String(intensity);
        const gradientTop = -120 + progress * 220;
        let gradientMask = `
          linear-gradient(to bottom,
            transparent ${gradientTop}%,
            rgba(0,0,0,0.1) ${gradientTop + 20}%,
            rgba(0,0,0,0.3) ${gradientTop + 40}%,
            rgba(0,0,0,0.6) ${gradientTop + 60}%,
            rgba(0,0,0,0.85) ${gradientTop + 80}%,
            black ${gradientTop + 100}%
          ),
          url(${DEFAULT_MASK_URL})
        `;

        if (edgeFadeMask) {
          gradientMask = `
            ${edgeFadeMask},
            linear-gradient(to bottom,
              transparent ${gradientTop}%,
              rgba(0,0,0,0.1) ${gradientTop + 20}%,
              rgba(0,0,0,0.3) ${gradientTop + 40}%,
              rgba(0,0,0,0.6) ${gradientTop + 60}%,
              rgba(0,0,0,0.85) ${gradientTop + 80}%,
              black ${gradientTop + 100}%
            ),
            url(${DEFAULT_MASK_URL})
          `;
        }

        bar.style.webkitMaskImage = gradientMask;
        bar.style.maskImage = gradientMask;
        (bar.style as unknown as Record<string, string>).webkitMaskComposite = "source-in";
        (bar.style as unknown as Record<string, string>).maskComposite = "intersect";
      }
    },
    [intensity, isIOSSafari]
  );

  // Smoothed velocity from recent scroll history
  const getSmoothedVelocity = useCallback(() => {
    const now = Date.now();
    velocityHistory.current = velocityHistory.current.filter(
      (h) => now - h.t < 100
    );
    if (velocityHistory.current.length === 0) return 0;
    const sum = velocityHistory.current.reduce((acc, h) => acc + h.v, 0);
    return sum / velocityHistory.current.length;
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const velocity = getSmoothedVelocity();
      const timeSinceScroll = now - lastScrollTime.current;

      let effectiveVelocity = velocity;
      if (timeSinceScroll > 50) {
        const decayFactor = Math.max(0, 1 - (timeSinceScroll - 50) / 200);
        effectiveVelocity = velocity * decayFactor;
      }

      let targetFade: number;
      if (effectiveVelocity >= peakVelocityThreshold) {
        targetFade = 0;
      } else if (effectiveVelocity <= 10) {
        targetFade = 1;
      } else if (effectiveVelocity >= fadeStartVelocity) {
        targetFade = 0;
      } else {
        const fadeRange = fadeStartVelocity - 10;
        const velocityInRange = effectiveVelocity - 10;
        targetFade = 1 - velocityInRange / fadeRange;
      }

      const currentFade = currentFadeProgress.current;
      const fadeSpeed = 0.15;
      const newFade = currentFade + (targetFade - currentFade) * fadeSpeed;
      applyFade(newFade);

      // Animate turbulence when visible
      if (animationSpeed > 0 && newFade < 0.9) {
        const svg = svgRef.current;
        if (svg) {
          const turbulence = svg.querySelector("feTurbulence");
          if (turbulence) {
            const scrollFactor =
              lastScrollY.current * 0.003 * animationSpeed;
            const currentX = baseX + Math.sin(scrollFactor) * rangeX;
            const currentY = baseY + Math.cos(scrollFactor * 0.6) * rangeY;
            turbulence.setAttribute(
              "baseFrequency",
              `${currentX} ${currentY}`
            );
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    applyFade,
    getSmoothedVelocity,
    animationSpeed,
    baseX,
    baseY,
    rangeX,
    rangeY,
    peakVelocityThreshold,
    fadeStartVelocity,
  ]);

  // Track scroll velocity — listen on the Lenis scroll wrapper
  useEffect(() => {
    const scrollEl = document.querySelector(".content-scroll");
    if (!scrollEl) return;

    const handleScroll = () => {
      const now = Date.now();
      const currentY = scrollEl.scrollTop;
      const deltaTime = now - lastScrollTime.current;

      if (deltaTime > 0 && lastScrollTime.current > 0) {
        const deltaY = Math.abs(currentY - lastScrollY.current);
        const velocity = (deltaY / deltaTime) * 1000;
        velocityHistory.current.push({ v: velocity, t: now });
        velocityRef.current = velocity;
      }

      lastScrollY.current = currentY;
      lastScrollTime.current = now;
    };

    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    lastScrollY.current = scrollEl.scrollTop;
    lastScrollTime.current = 0;

    return () => {
      scrollEl.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const maskStyle = `url(${DEFAULT_MASK_URL})`;

  return (
    <div
      ref={barRef}
      style={{
        position: "fixed",
        bottom: offset,
        left: 0,
        right: 0,
        height: BAR_HEIGHT,
        zIndex: 9997,
        pointerEvents: "none",
        overflow: "hidden",
        opacity: 0,
        willChange: "opacity",
        WebkitMaskImage: maskStyle,
        maskImage: maskStyle,
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskPosition: "bottom",
        maskPosition: "bottom",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        filter: `url(#${filterId})`,
        backdropFilter: `blur(${blur}px) saturate(${saturation}) contrast(${contrast})`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}) contrast(${contrast})`,
      }}
    />
  );
}
