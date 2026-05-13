"use client";

import { useEffect, useState, useRef, useCallback, useId } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * BURN MELT TRANSITION
 * Liquid pixel displacement page transition with backdrop-filter effects.
 * Adapted from a Framer component for Next.js.
 *
 * Burn IN on page load: overlay fades away revealing content.
 * Burn OUT on link click: overlay fades in, then navigates.
 *
 * Requires body::before cover in globals.css (see below).
 */

const SETTINGS = {
  burnDuration: 0.5,
  blur: 4,
  saturation: 4.5,
  contrast: 2.2,
  displacement: 30,
  displacementBlur: 3,
  easeCurve: "cubic-bezier(0.16, 1, 0.3, 1)", // luxe
};

export function BurnMeltTransition() {
  const {
    burnDuration,
    blur,
    saturation,
    contrast,
    displacement,
    displacementBlur,
    easeCurve,
  } = SETTINGS;

  const pathname = usePathname();
  const router = useRouter();
  // Stable across SSR/CSR (Math.random would diverge and break hydration on the
  // overlay's `filter: url(#…)` style). useId() includes ":" which isn't valid
  // inside CSS url() identifiers, so strip it.
  const reactId = useId();
  const uniqueId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");

  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const isNavigating = useRef<boolean>(false);
  const hasBurnedIn = useRef<boolean>(false);
  const isReady = useRef<boolean>(false);
  const pageOrigin = useRef<string>("");
  const prevPathname = useRef<string>("");

  const filterId = `burn-melt-filter-${uniqueId}`;

  // iOS Safari detection — must default to false on first render so SSR and
  // the initial client paint agree. Updated in useEffect after mount; the
  // mask-image style only kicks in once the flag flips, which is well after
  // hydration completes.
  const [isIOSSafari, setIsIOSSafari] = useState(false);

  // Mobile (touch-only) detection — same SSR-safe pattern. On mobile we
  // drop the GPU-heavy backdrop-filter and the rAF turbulence animation,
  // keeping just the SVG displacement filter so the burn character holds
  // without the per-frame compositor work that stutters on mobile GPUs.
  //
  // Backed by both state (for JSX style re-render on flip) and a ref (for
  // the rAF animation guards, which read from closures that would
  // otherwise capture a stale `false` value when this flips after mount).
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);

  useEffect(() => {
    pageOrigin.current = window.location.origin;
    const ua = navigator.userAgent;
    const iOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const safari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua);
    if (iOS && safari) setIsIOSSafari(true);

    // Touch-only device detection. Catches phones and tablets without
    // false-positiving on touch-enabled laptops (those still have hover).
    const mql = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mql.matches);
    isMobileRef.current = mql.matches;
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      isMobileRef.current = e.matches;
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const toAbsoluteUrl = (href: string): string => {
    if (!href) return window.location.origin + "/";

    // Already absolute with origin
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return href;
    }

    // Relative path → absolute
    if (href.startsWith("/")) {
      return window.location.origin + href;
    }

    let clean = href;
    if (clean.startsWith("./")) clean = clean.slice(2);
    while (clean.startsWith("../")) clean = clean.slice(3);
    return window.location.origin + "/" + clean;
  };

  // Inject SVG filter
  useEffect(() => {
    const existing = document.getElementById(`svg-burn-melt-${uniqueId}`);
    if (existing) existing.remove();

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = `svg-burn-melt-${uniqueId}`;
    svg.setAttribute(
      "style",
      "position:absolute;width:0;height:0;pointer-events:none;"
    );
    svg.innerHTML = `
      <defs>
        <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.018" numOctaves="2" seed="5" result="noise"/>
          <feGaussianBlur in="noise" stdDeviation="${displacementBlur}" result="smoothNoise"/>
          <feDisplacementMap in="SourceGraphic" in2="smoothNoise" scale="${displacement}" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
    `;
    document.body.appendChild(svg);
    svgRef.current = svg;

    return () => {
      const el = document.getElementById(`svg-burn-melt-${uniqueId}`);
      if (el) el.remove();
    };
  }, [uniqueId, displacement, displacementBlur, filterId]);

  const startTurbulenceAnimation = () => {
    // Mobile: skip the 60fps noise-field re-computation. The SVG filter
    // still applies with a static baseFrequency, so the burn warp shape
    // is preserved — just without the rolling micro-motion. Cuts per-
    // frame CPU work on mobile by an order of magnitude.
    if (isMobileRef.current) return;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const animate = () => {
      timeRef.current += 0.015;
      const svg = svgRef.current;
      if (svg) {
        const turbulence = svg.querySelector("feTurbulence");
        if (turbulence) {
          const bx = 0.008 + Math.sin(timeRef.current) * 0.004;
          const by = 0.018 + Math.cos(timeRef.current * 0.7) * 0.005;
          turbulence.setAttribute("baseFrequency", `${bx} ${by}`);
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopTurbulenceAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // Move container to body so it sits above everything
  useEffect(() => {
    const el = containerRef.current;
    if (el && el.parentElement !== document.body) {
      document.body.appendChild(el);
    }
    return () => {
      if (el && el.parentElement === document.body) {
        document.body.removeChild(el);
      }
    };
  }, []);

  // Handle link clicks — BURN OUT
  useEffect(() => {
    let pendingHref: string | null = null;

    const handleClick = (e: MouseEvent) => {
      if (!isReady.current || isNavigating.current) return;

      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const hrefAttr = anchor.getAttribute("href");
      if (!hrefAttr) return;

      // Skip external links, anchors, mailto, tel
      if (
        hrefAttr.startsWith("#") ||
        hrefAttr.startsWith("mailto:") ||
        hrefAttr.startsWith("tel:")
      ) {
        return;
      }

      // Skip links to different origins (true external links)
      const absoluteUrl = toAbsoluteUrl(hrefAttr);
      try {
        const linkOrigin = new URL(absoluteUrl).origin;
        if (linkOrigin !== window.location.origin) return;
      } catch {
        return;
      }

      // Skip if it's the current page
      if (absoluteUrl === window.location.href) return;

      e.preventDefault();

      isNavigating.current = true;
      pendingHref = absoluteUrl;

      const overlay = overlayRef.current;
      const white = whiteRef.current;
      if (!overlay || !white) {
        window.location.href = absoluteUrl;
        return;
      }

      startTurbulenceAnimation();

      // Show overlay (blur/displacement)
      overlay.style.transition = `opacity ${burnDuration * 0.3}s ease-out`;
      overlay.style.opacity = "1";

      // Then show white cover
      const whiteDuration = burnDuration * 0.4;
      const whiteDelay = burnDuration * 0.25;

      setTimeout(() => {
        white.style.transition = `opacity ${whiteDuration}s ease-in`;
        white.style.opacity = "1";
      }, whiteDelay * 1000);

      // Navigate after burn-out completes
      setTimeout(
        () => {
          stopTurbulenceAnimation();
          // Scroll to top
          const scrollEl = document.querySelector("main");
          if (scrollEl) scrollEl.scrollTop = 0;
          // Client-side nav — layout persists, pathname change triggers burn-in
          router.push(hrefAttr);
        },
        (whiteDelay + whiteDuration) * 1000
      );
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [burnDuration, easeCurve]);

  // BURN IN on page load
  useEffect(() => {
    if (hasBurnedIn.current) return;

    const startBurnIn = () => {
      if (hasBurnedIn.current) return;
      hasBurnedIn.current = true;

      const overlay = overlayRef.current;
      const white = whiteRef.current;
      if (!overlay || !white) return;

      // Start with effects visible
      overlay.style.transition = "none";
      overlay.style.opacity = "1";
      white.style.transition = "none";
      white.style.opacity = "1";

      void overlay.offsetHeight;

      // Hide the body::before cover
      document.body.style.setProperty("--burn-cover", "0");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          startTurbulenceAnimation();

          const whiteDuration = burnDuration * 0.35;
          const overlayDuration = burnDuration * 0.7;
          const overlayDelay = burnDuration * 0.15;

          // Fade out white first
          white.style.transition = `opacity ${whiteDuration}s ease-out`;
          white.style.opacity = "0";

          // Then fade out the backdrop
          setTimeout(() => {
            overlay.style.transition = `opacity ${overlayDuration}s ${easeCurve}`;
            overlay.style.opacity = "0";
          }, overlayDelay * 1000);

          setTimeout(
            () => {
              stopTurbulenceAnimation();
              isReady.current = true;
            },
            (overlayDelay + overlayDuration) * 1000
          );
        });
      });
    };

    if (document.readyState === "complete") {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          startBurnIn();
        });
      });
    } else {
      window.addEventListener("load", startBurnIn);
      return () => window.removeEventListener("load", startBurnIn);
    }
  }, [burnDuration, easeCurve]);

  // BURN IN on client-side navigation (pathname changes)
  useEffect(() => {
    // Skip the initial render
    if (!prevPathname.current) {
      prevPathname.current = pathname;
      return;
    }
    // Skip if pathname didn't actually change
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    // Scroll to top
    const scrollEl = document.querySelector("main");
    if (scrollEl) scrollEl.scrollTop = 0;

    // If not mid-navigation (e.g. browser back), set up overlays first
    if (!isNavigating.current) {
      const overlay = overlayRef.current;
      const white = whiteRef.current;
      if (overlay && white) {
        overlay.style.transition = "none";
        overlay.style.opacity = "1";
        white.style.transition = "none";
        white.style.opacity = "1";
        void overlay.offsetHeight;
      }
      isNavigating.current = true;
    }

    const overlay = overlayRef.current;
    const white = whiteRef.current;
    if (!overlay || !white) return;

    // Tiny wait for the destination's hero image to be ready, capped tight.
    // If the hero is cached (typical), this resolves in <50ms and the burn-in
    // plays immediately. If it's not, we cap the wait at MAX_WAIT_MS so the
    // user never feels stuck — the burn plays through and the hero appears
    // when it appears.
    const MAX_WAIT_MS = 150;
    const startedAt = performance.now();
    let cancelled = false;

    const playBurnIn = () => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          startTurbulenceAnimation();

          const whiteDuration = burnDuration * 0.35;
          const overlayDuration = burnDuration * 0.7;
          const overlayDelay = burnDuration * 0.15;

          white.style.transition = `opacity ${whiteDuration}s ease-out`;
          white.style.opacity = "0";

          setTimeout(() => {
            overlay.style.transition = `opacity ${overlayDuration}s ${easeCurve}`;
            overlay.style.opacity = "0";
          }, overlayDelay * 1000);

          setTimeout(() => {
            stopTurbulenceAnimation();
            isNavigating.current = false;
            isReady.current = true;
          }, (overlayDelay + overlayDuration) * 1000);
        });
      });
    };

    // Try once for an already-cached hero; otherwise cap at MAX_WAIT_MS.
    const heroImg = document.querySelector<HTMLImageElement>(".hero-breakout img");
    if (heroImg && heroImg.complete && heroImg.naturalWidth > 0) {
      playBurnIn();
    } else if (heroImg) {
      const onLoad = () => {
        heroImg.removeEventListener("load", onLoad);
        heroImg.removeEventListener("error", onLoad);
        if (!cancelled) playBurnIn();
      };
      heroImg.addEventListener("load", onLoad);
      heroImg.addEventListener("error", onLoad);
      // Cap so we don't hang on slow/large hero images.
      setTimeout(() => {
        if (!cancelled) {
          heroImg.removeEventListener("load", onLoad);
          heroImg.removeEventListener("error", onLoad);
          playBurnIn();
        }
      }, MAX_WAIT_MS - (performance.now() - startedAt));
    } else {
      // Hero not in DOM yet — just play the burn after a short tick.
      setTimeout(() => {
        if (!cancelled) playBurnIn();
      }, MAX_WAIT_MS);
    }

    return () => {
      cancelled = true;
    };
  }, [pathname, burnDuration, easeCurve]);

  // Cleanup
  useEffect(() => {
    return () => stopTurbulenceAnimation();
  }, []);

  // iOS Safari: edge fade mask to hide viewport clipping
  const iosMask = isIOSSafari
    ? "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)"
    : undefined;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 2147483644,
    pointerEvents: "none",
    willChange: "opacity",
    opacity: 0,
    background: "rgba(243, 240, 237, 0.35)",
    filter: `url(#${filterId})`,
    // Backdrop-filter is the heaviest single cost in this transition on
    // mobile — it forces the compositor to read and reprocess the entire
    // viewport every frame the overlay is visible. The SVG displacement
    // filter above keeps the burn character; backdrop-filter only added
    // the saturate/contrast pop, which barely reads at 35% opacity over
    // cream anyway. Desktop keeps the full effect.
    ...(isMobile ? {} : {
      backdropFilter: `blur(${blur}px) saturate(${saturation}) contrast(${contrast})`,
      WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}) contrast(${contrast})`,
    }),
    ...(isIOSSafari && {
      WebkitMaskImage: iosMask,
      maskImage: iosMask,
    }),
  };

  const whiteStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 2147483645,
    pointerEvents: "none",
    background: "#F3F0ED",
    willChange: "opacity",
    opacity: 1,
  };

  return (
    <div ref={containerRef} style={{ display: "contents" }}>
      <div ref={overlayRef} style={overlayStyle} />
      <div ref={whiteRef} style={whiteStyle} />
    </div>
  );
}
