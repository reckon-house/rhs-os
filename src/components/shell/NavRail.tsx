"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { label: "Reckon*House", image: "/nav/logo.jpg", href: "/" },
  { label: "Digital", image: "/nav/digital.jpg", href: "/category/digital" },
  { label: "Creative", image: "/nav/reckonhouse.jpg", href: "/category/creative" },
  { label: "Interiors", image: "/nav/interiors.jpg", href: "/category/interiors" },
];

// House*Staples is the home for the rest of the practice's content —
// inspiration board, learn notes, and contact/connect — collapsed into
// a single page. Learn and Connect dropped from the rail; their content
// will live as sections inside House*Staples.
const utilities = [
  {
    label: "House*Staples",
    href: "/inspiration",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="6" y1="18" x2="6" y2="10" />
        <line x1="10" y1="20" x2="10" y2="8" />
        <line x1="14" y1="16" x2="14" y2="12" />
        <line x1="18" y1="22" x2="18" y2="6" />
        <line x1="22" y1="18" x2="22" y2="10" />
      </svg>
    ),
  },
];

export function NavRail() {
  const pathname = usePathname();
  const backdropRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const navContentRef = useRef<HTMLDivElement>(null);
  const navBarRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [overDark, setOverDark] = useState(false);

  // Determine active index from URL. Categories occupy 0–3, House*Staples
  // (the only utility) sits at index 4 — past the divider.
  useEffect(() => {
    if (pathname === "/category/digital") setActiveIdx(1);
    else if (pathname === "/category/creative") setActiveIdx(2);
    else if (pathname === "/category/interiors") setActiveIdx(3);
    else if (pathname === "/inspiration") setActiveIdx(4);
    else setActiveIdx(0);
  }, [pathname]);

  // Position highlight based on activeIdx
  useEffect(() => {
    const container = navContentRef.current;
    const highlight = highlightRef.current;
    if (!container || !highlight) return;

    const positionHighlight = () => {
      const items = container.querySelectorAll(":scope > a, :scope > .nav-divider");
      // Count only link items before the divider for category highlighting
      const linkItems = container.querySelectorAll(":scope > a");
      const activeEl = linkItems[activeIdx] as HTMLElement;
      if (!activeEl) return;

      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const pad = 6;

      highlight.style.width = `${activeRect.width + pad * 2}px`;
      highlight.style.height = `${activeRect.height + pad * 2}px`;
      highlight.style.left = `${activeRect.left - containerRect.left - pad}px`;
      highlight.style.opacity = "1";
    };

    requestAnimationFrame(positionHighlight);
    window.addEventListener("resize", positionHighlight);
    return () => window.removeEventListener("resize", positionHighlight);
  }, [activeIdx]);

  useEffect(() => {
    let heat = 0;
    let lastScroll = 0;
    let lastPulse = 0;
    let pulsePhase = 0;
    let raf: number;

    const onInput = () => {
      lastScroll = Date.now();
      if (pulsePhase > 0) {
        pulsePhase = 0;
        const el = sweepRef.current;
        if (el) el.style.opacity = "0";
      }
    };

    // Catch ALL scroll-related input
    window.addEventListener("scroll", onInput, { passive: true, capture: true });
    document.addEventListener("scroll", onInput, { passive: true, capture: true });
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("touchmove", onInput, { passive: true });
    window.addEventListener("touchstart", onInput, { passive: true });

    const mainEl = document.querySelector("main");
    if (mainEl) {
      mainEl.addEventListener("scroll", onInput, { passive: true });
      mainEl.addEventListener("touchmove", onInput, { passive: true });
      mainEl.addEventListener("touchstart", onInput, { passive: true });
    }

    let lastScrollTop = 0;
    const pollScroll = () => {
      if (mainEl) {
        const currentTop = mainEl.scrollTop;
        if (currentTop !== lastScrollTop) {
          lastScrollTop = currentTop;
          onInput();
        }
      }
    };

    const animate = () => {
      pollScroll();
      const now = Date.now();
      const timeSince = now - lastScroll;

      if (timeSince < 500) {
        const target = 1;
        heat += (target - heat) * 0.06;
        lastPulse = now;
      } else if (timeSince < 2500) {
        heat += (0 - heat) * 0.015;
        lastPulse = now;
      } else {
        heat += (0 - heat) * 0.03;

        // Idle sweep
        const idleTime = now - lastPulse;
        if (pulsePhase === 0 && idleTime > 3500) {
          pulsePhase = 1;
          lastPulse = now;
          const el = sweepRef.current;
          if (el) {
            el.style.opacity = "1";
            el.style.transform = "translateX(-100%)";
          }
        }
        if (pulsePhase > 0) {
          const pulseAge = now - lastPulse;
          const duration = 1600;
          if (pulseAge < duration) {
            const t = pulseAge / duration;
            const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            const translateX = -100 + eased * 200;
            // Fade in quickly, hold, then fade out at the end
            const fadeOpacity = t < 0.15 ? t / 0.15 : t > 0.7 ? (1 - t) / 0.3 : 1;
            const el = sweepRef.current;
            if (el) {
              el.style.transform = `translateX(${translateX}%)`;
              el.style.opacity = `${fadeOpacity * 0.7}`;
            }
          } else {
            pulsePhase = 0;
            lastPulse = now + 4500;
            const el = sweepRef.current;
            if (el) el.style.opacity = "0";
          }
        }
      }
      if (heat < 0.005) heat = 0;

      const sat = 1 + heat * 7;
      const con = 1 + heat * 2;
      const blr = heat * 4;
      const bg = `rgba(243, 240, 237, ${0.05 + heat * 0.1})`;
      // CSS-native filters work on all browsers; SVG filter is progressive enhancement
      const cssFilter = `blur(${blr}px) saturate(${sat}) contrast(${con})`;
      const fullFilter = `url(#navMelt) ${cssFilter}`;

      const el = backdropRef.current;
      if (el) {
        // Try full filter with SVG displacement, fall back to CSS-only
        el.style.backdropFilter = fullFilter;
        (el.style as any).webkitBackdropFilter = cssFilter; // Safari: skip SVG filter ref
        el.style.background = bg;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onInput, { capture: true } as EventListenerOptions);
      document.removeEventListener("scroll", onInput, { capture: true } as EventListenerOptions);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("touchmove", onInput);
      window.removeEventListener("touchstart", onInput);
      if (mainEl) {
        mainEl.removeEventListener("scroll", onInput);
        mainEl.removeEventListener("touchmove", onInput);
        mainEl.removeEventListener("touchstart", onInput);
      }
      cancelAnimationFrame(raf);
    };
  }, []);

  // ── Detect overlap with any [data-nav-dark] region (e.g. SiteFooter)
  // and invert the bar's text/icon/divider colors for legibility. ──
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    let raf = 0;
    let last = false;
    const check = () => {
      const navEl = navBarRef.current;
      if (!navEl) return;
      const navRect = navEl.getBoundingClientRect();
      // Sample the vertical center of the bar; horizontal placement is
      // centered on desktop and full-width on mobile, so a center y check
      // is enough.
      const sampleY = navRect.top + navRect.height / 2;
      const darkRegions = document.querySelectorAll("[data-nav-dark]");
      let hit = false;
      for (const el of Array.from(darkRegions)) {
        const r = (el as HTMLElement).getBoundingClientRect();
        if (sampleY >= r.top && sampleY <= r.bottom) {
          hit = true;
          break;
        }
      }
      if (hit !== last) {
        last = hit;
        setOverDark(hit);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };

    check();
    main.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      main.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // ── Color palette swap based on whether the bar overlays a dark area.
  // The hex values mirror the light/dark ink already used elsewhere in
  // the app (#141414 cream-on-light, #F0EAE4 cream-on-dark). ──
  const ink = overDark ? "#F0EAE4" : "#141414";
  const inkSoft = overDark ? "rgba(240,234,228,0.7)" : "rgba(20,20,20,0.7)";
  const dividerBg = overDark ? "rgba(240,234,228,0.16)" : "rgba(20,20,20,0.10)";
  const highlightBg = overDark ? "rgba(240,234,228,0.10)" : "rgba(20,20,20,0.06)";

  return (
    <>
      {/* SVG displacement filter */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="navMelt" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.025" numOctaves="3" seed="8" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2" result="smoothNoise" />
            <feDisplacementMap in="SourceGraphic" in2="smoothNoise" scale="18" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ── Single unified bottom bar ── */}
      <div
        ref={navBarRef}
        data-nav-bar
        className="fixed bottom-4 left-3 right-3 md:bottom-6 md:left-0 md:right-0 flex md:justify-center items-end"
        style={{ zIndex: 2147483647, paddingBottom: "env(safe-area-inset-bottom, 0px)", color: ink, transition: "color 0.3s ease" }}
      >
        <div className="flex-1 md:flex-none">
          <div className="relative rounded-[28px] overflow-x-auto overflow-y-hidden scrollbar-hide" data-lenis-prevent>
            {/* Backdrop */}
            <div
              ref={backdropRef}
              className="absolute inset-0 rounded-[28px]"
              style={{
                backdropFilter: "url(#navMelt) blur(0px) saturate(1) contrast(1)",
                WebkitBackdropFilter: "blur(0px) saturate(1) contrast(1)",
                background: "rgba(243, 240, 237, 0.05)",
                boxShadow: "0 2px 20px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.04)",
              }}
            />
            {/* Sweep overlay — hot leading edge, trailing off (idle pulse) */}
            <div
              ref={sweepRef}
              className="absolute inset-0 rounded-[28px] pointer-events-none"
              style={{
                opacity: 0,
                transform: "translateX(-100%)",
                background: "linear-gradient(90deg, transparent 0%, transparent 20%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.15) 65%, rgba(255,255,255,0.3) 85%, rgba(255,255,255,0.45) 100%)",
                backdropFilter: "blur(4px) saturate(5) contrast(1.8)",
                WebkitBackdropFilter: "blur(4px) saturate(5) contrast(1.8)",
              }}
            />
            {/* Nav content */}
            <div ref={navContentRef} className="relative flex items-center gap-4 md:gap-8 px-4 md:px-4 py-2 md:py-3">
              {/* Sliding highlight */}
              <div
                ref={highlightRef}
                className="absolute top-1/2 -translate-y-1/2 rounded-[18px] pointer-events-none"
                style={{
                  opacity: 0,
                  left: 0,
                  backgroundColor: highlightBg,
                  transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, background-color 0.3s ease",
                }}
              />

              {/* Categories */}
              {categories.map((cat, i) => (
                <Link
                  key={cat.href}
                  href={i === 0 ? "/" : cat.href}
                  onClick={() => setActiveIdx(i)}
                  className="flex flex-col items-center gap-1 shrink-0"
                >
                  <div className="w-[36px] h-[36px] md:w-[50px] md:h-[50px] rounded-[10px] md:rounded-[15px] overflow-hidden bg-surface-alt">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[8px] md:text-[10px] leading-none font-medium tracking-tight text-center whitespace-nowrap" style={{ color: inkSoft, transition: "color 0.3s ease" }}>
                    {cat.label}
                  </span>
                </Link>
              ))}

              {/* Divider */}
              <div className="nav-divider w-px h-[30px] md:h-[40px] shrink-0" style={{ backgroundColor: dividerBg, transition: "background-color 0.3s ease" }} />

              {/* Utilities */}
              {utilities.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 shrink-0"
                >
                  <div className="w-[36px] h-[36px] md:w-[50px] md:h-[50px] flex items-center justify-center">
                    <div className="scale-[0.9] md:scale-[1.05]">
                      {item.icon}
                    </div>
                  </div>
                  <span className="text-[8px] md:text-[10px] leading-none font-medium tracking-tight text-center whitespace-nowrap" style={{ color: inkSoft, transition: "color 0.3s ease" }}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
