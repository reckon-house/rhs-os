"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { label: "Reckon.House", image: "/nav/logo.jpg", href: "/" },
  { label: "Digital", image: "/nav/digital.jpg", href: "/?category=digital" },
  { label: "Campaigns", image: "/nav/reckonhouse.jpg", href: "/?category=campaigns" },
  { label: "Interiors", image: "/nav/interiors.jpg", href: "/?category=interiors" },
  { label: "Branding", image: "/nav/branding.jpg", href: "/?category=branding" },
];

const utilities = [
  {
    label: "Inspiration",
    href: "/inspiration",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#141414" strokeWidth="1.5" strokeLinecap="round">
        <line x1="6" y1="18" x2="6" y2="10" />
        <line x1="10" y1="20" x2="10" y2="8" />
        <line x1="14" y1="16" x2="14" y2="12" />
        <line x1="18" y1="22" x2="18" y2="6" />
        <line x1="22" y1="18" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    label: "Learn",
    href: "/learn",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h20" />
        <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
        <path d="m7 21 5-5 5 5" />
      </svg>
    ),
  },
  {
    label: "Connect",
    href: "/connect",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.828 14.828 21 21" />
        <path d="M21 16v5h-5" />
        <path d="m21 3-9 9-4-4-6 6" />
        <path d="M21 8V3h-5" />
      </svg>
    ),
  },
];

export function NavRail() {
  const pathname = usePathname();
  const backdrop1 = useRef<HTMLDivElement>(null);
  const backdrop2 = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const navContentRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Determine active index from URL
  useEffect(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    if (pathname === "/" && search.includes("category=digital")) setActiveIdx(1);
    else if (pathname === "/" && search.includes("category=campaigns")) setActiveIdx(2);
    else if (pathname === "/" && search.includes("category=interiors")) setActiveIdx(3);
    else if (pathname === "/" && search.includes("category=branding")) setActiveIdx(4);
    else setActiveIdx(0);
  }, [pathname]);

  // Position highlight based on activeIdx
  useEffect(() => {
    const container = navContentRef.current;
    const highlight = highlightRef.current;
    if (!container || !highlight) return;

    const positionHighlight = () => {
      const items = container.querySelectorAll("a, button");
      // Skip the highlight div — items are the interactive children
      const activeEl = items[activeIdx] as HTMLElement;
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
    // Also reposition on resize
    window.addEventListener("resize", positionHighlight);
    return () => window.removeEventListener("resize", positionHighlight);
  }, [activeIdx]);

  useEffect(() => {
    let heat = 0;
    let lastScroll = 0;
    let raf: number;

    const onInput = () => {
      lastScroll = Date.now();
    };

    // Catch ALL scroll-related input
    window.addEventListener("scroll", onInput, { passive: true, capture: true });
    document.addEventListener("scroll", onInput, { passive: true, capture: true });
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("touchmove", onInput, { passive: true });

    const animate = () => {
      const timeSince = Date.now() - lastScroll;

      // Ease in on scroll, ease out when stopped
      if (timeSince < 500) {
        // Ease-out ramp: fast at start, slows as it approaches 1
        const target = 1;
        heat += (target - heat) * 0.06;
      } else if (timeSince < 2500) {
        // Slow ease out
        heat += (0 - heat) * 0.015;
      } else {
        heat += (0 - heat) * 0.03;
      }
      if (heat < 0.005) heat = 0;

      const sat = 1 + heat * 7;
      const con = 1 + heat * 2;
      const blr = heat * 4;
      const bg = `rgba(243, 240, 237, ${0.05 + heat * 0.1})`;
      const filter = `url(#navMelt) blur(${blr}px) saturate(${sat}) contrast(${con})`;

      [backdrop1.current, backdrop2.current].forEach((el) => {
        if (!el) return;
        el.style.backdropFilter = filter;
        (el.style as any).webkitBackdropFilter = filter;
        el.style.background = bg;
      });

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onInput, { capture: true } as EventListenerOptions);
      document.removeEventListener("scroll", onInput, { capture: true } as EventListenerOptions);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("touchmove", onInput);
      cancelAnimationFrame(raf);
    };
  }, []);

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

      {/* ── Bottom pill bars ── */}
      <div
        data-nav-bar
        className="fixed bottom-4 left-3 right-3 md:bottom-6 md:left-0 md:right-0 flex md:justify-center gap-2 md:gap-3 items-end"
        style={{ zIndex: 2147483647, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* Categories pill */}
        <div className="flex-1 md:flex-none overflow-x-auto scrollbar-hide">
          <div className="relative rounded-[28px] overflow-hidden">
            <div
              ref={backdrop1}
              className="absolute inset-0 rounded-[28px]"
              style={{
                backdropFilter: "url(#navMelt) blur(0px) saturate(1) contrast(1)",
                WebkitBackdropFilter: "url(#navMelt) blur(0px) saturate(1) contrast(1)",
                background: "rgba(243, 240, 237, 0.05)",
                boxShadow: "0 2px 20px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.04)",
              }}
            />
            <div ref={navContentRef} className="relative flex items-center gap-4 md:gap-10 px-5 md:px-4 py-2 md:py-3">
              {/* Sliding highlight */}
              <div
                ref={highlightRef}
                className="absolute top-1/2 -translate-y-1/2 rounded-[18px] bg-[#141414]/[0.06] pointer-events-none"
                style={{
                  opacity: 0,
                  left: 0,
                  transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
                }}
              />
              {categories.map((cat, i) => {
                // First item (Reckon.House) always links home
                if (i === 0) {
                  return (
                    <Link
                      key={cat.href}
                      href="/"
                      onClick={() => setActiveIdx(0)}
                      className="flex flex-col items-center gap-1 shrink-0"
                    >
                      <div className="w-[36px] h-[36px] md:w-[50px] md:h-[50px] rounded-[10px] md:rounded-[15px] overflow-hidden bg-surface-alt">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[8px] md:text-[10px] leading-none font-medium tracking-tight text-center text-[#141414]/70 whitespace-nowrap">
                        {cat.label}
                      </span>
                    </Link>
                  );
                }
                return (
                  <button
                    key={cat.href}
                    onClick={() => setActiveIdx(i)}
                    className="flex flex-col items-center gap-1 shrink-0"
                  >
                    <div className="w-[36px] h-[36px] md:w-[50px] md:h-[50px] rounded-[10px] md:rounded-[15px] overflow-hidden bg-surface-alt">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] md:text-[10px] leading-none font-medium tracking-tight text-center text-[#141414]/70 whitespace-nowrap">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Utilities pill */}
        <div className="overflow-x-auto scrollbar-hide shrink-0">
          <div className="relative rounded-[28px] overflow-hidden">
            <div
              ref={backdrop2}
              className="absolute inset-0 rounded-[28px]"
              style={{
                backdropFilter: "url(#navMelt) blur(0px) saturate(1) contrast(1)",
                WebkitBackdropFilter: "url(#navMelt) blur(0px) saturate(1) contrast(1)",
                background: "rgba(243, 240, 237, 0.05)",
                boxShadow: "0 2px 20px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.04)",
              }}
            />
            <div className="relative flex items-center gap-3 md:gap-3 px-5 md:px-4 py-2 md:py-3">
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
                  <span className="text-[8px] md:text-[10px] leading-none font-medium tracking-tight text-center text-[#141414]/70 whitespace-nowrap">
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
