"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MELT_SETTINGS = {
  blur: 40,
  saturation: 8,
  contrast: 3,
  displacement: 30,
  displacementBlur: 2,
  duration: 0.5,
  animationSpeed: 1,
  settleTime: 1.5,
};

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
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round">
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
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="20" height="15" rx="1.5" />
        <line x1="14" y1="19" x2="14" y2="24" />
        <line x1="9" y1="24" x2="19" y2="24" />
        <polyline points="9,11 12,8 16,13 20,9" />
      </svg>
    ),
  },
  {
    label: "Connect",
    href: "/connect",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4,20 10,12 16,16 24,6" />
        <polyline points="18,6 24,6 24,12" />
      </svg>
    ),
  },
];

function MeltOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastMouseMove = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [visible, setVisible] = useState(false);
  const [uniqueId] = useState(() => Math.random().toString(36).substr(2, 9));
  const filterId = `nav-melt-${uniqueId}`;
  const { blur, saturation, contrast, displacement, displacementBlur, duration, animationSpeed, settleTime } = MELT_SETTINGS;

  const [opacity, setOpacity] = useState(0);

  // Handle open/close with fade in/out
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      // Next frame: trigger fade in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setOpacity(1));
      });
    } else if (visible) {
      // Fade out first
      setOpacity(0);
      const timer = setTimeout(() => setVisible(false), duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Create SVG filter
  useEffect(() => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = `svg-nav-melt-${uniqueId}`;
    svg.setAttribute("style", "position:absolute;width:0;height:0;pointer-events:none;");
    svg.innerHTML = `<defs><filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.018" numOctaves="2" seed="5" result="noise"/><feGaussianBlur in="noise" stdDeviation="${displacementBlur}" result="smoothNoise"/><feDisplacementMap in="SourceGraphic" in2="smoothNoise" scale="${displacement}" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`;
    document.body.appendChild(svg);
    svgRef.current = svg;
    return () => {
      const el = document.getElementById(`svg-nav-melt-${uniqueId}`);
      if (el) el.remove();
    };
  }, [uniqueId]);

  // Animate turbulence
  useEffect(() => {
    if (!isOpen || animationSpeed === 0) return;
    const animate = () => {
      const now = Date.now();
      const timeSinceMove = now - lastMouseMove.current;
      const settleMs = settleTime * 1000;
      let easedSpeed = animationSpeed;
      if (timeSinceMove > 0 && timeSinceMove < settleMs) {
        easedSpeed = animationSpeed * (1 - timeSinceMove / settleMs);
      } else if (timeSinceMove >= settleMs) {
        easedSpeed = 0;
      }
      if (easedSpeed > 0.01) {
        timeRef.current += 0.001 * easedSpeed;
        const svg = svgRef.current;
        if (svg) {
          const turbulence = svg.querySelector("feTurbulence");
          if (turbulence) {
            turbulence.setAttribute(
              "baseFrequency",
              `${0.008 + Math.sin(timeRef.current) * 0.003} ${0.018 + Math.cos(timeRef.current * 0.7) * 0.004}`
            );
          }
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    lastMouseMove.current = Date.now();
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isOpen]);

  // Track mouse/touch for animation settling
  useEffect(() => {
    if (!isOpen) return;
    const handleMove = () => { lastMouseMove.current = Date.now(); };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("scroll", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("scroll", handleMove);
    };
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-30 md:hidden pointer-events-none"
      style={{
        filter: `url(#${filterId})`,
        backdropFilter: `blur(${blur}px) saturate(${saturation}) contrast(${contrast})`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}) contrast(${contrast})`,
        opacity: opacity,
        transition: `opacity ${duration}s ease`,
      }}
    />
  );
}

export function NavRail() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-2 right-4 z-50 flex md:hidden items-center justify-center w-9 h-9"
        aria-label="Toggle navigation"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          {mobileOpen ? (
            <path d="M5 5L15 15M15 5L5 15" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <>
              <line x1="3" y1="5" x2="17" y2="5" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="3" y1="10" x2="17" y2="10" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="3" y1="15" x2="17" y2="15" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile melt overlay */}
      <MeltOverlay isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Nav rail */}
      <nav
        className={`
          fixed md:relative z-40 top-[50px] left-0 md:top-0
          h-auto md:h-full
          w-[105px] md:w-[160px] bg-background flex flex-col items-center
          overflow-y-auto overflow-x-hidden
          rounded-r-[clamp(30px,8vw,60px)] md:rounded-r-none
          shadow-2xl md:shadow-none
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${mobileOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"}
        `}
      >
        {/* Category links with images */}
        <div className="flex flex-col items-center gap-[20px] md:gap-[30px] pt-[24px] md:pt-[50px] pb-4 md:pb-6 w-full px-1 md:px-4">
          {categories.map((cat) => {
            const active = cat.href === "/"
              ? pathname === "/"
              : pathname.startsWith(cat.href);
            return (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center gap-[7px] group w-full min-h-[44px] justify-center"
              >
                <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-[12px] md:rounded-[15px] overflow-hidden bg-surface-alt">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] leading-none font-medium tracking-tight text-center text-[#141414]">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-16 h-[1px] bg-border shrink-0" />

        {/* Utility links with icons */}
        <div className="flex flex-col items-center gap-[20px] md:gap-[30px] pt-4 md:pt-6 pb-6 md:pb-8 w-full px-1 md:px-4">
          {utilities.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center gap-[7px] min-h-[44px] justify-center"
              >
                <div className={active ? "opacity-100" : "opacity-60"}>
                  {item.icon}
                </div>
                <span className="text-[10px] leading-none font-medium tracking-tight text-[#141414]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Melt animation keyframes */}
      <style jsx global>{`
        @keyframes meltIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
