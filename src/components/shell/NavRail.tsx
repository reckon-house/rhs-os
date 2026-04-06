"use client";

import { useState, useEffect, useRef } from "react";
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

const MELT_STYLE = {
  background: "rgba(243, 240, 237, 0.15)",
  backdropFilter: "blur(2px) saturate(6) contrast(2.5)",
  WebkitBackdropFilter: "blur(2px) saturate(6) contrast(2.5)",
  boxShadow: "0 2px 20px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.04)",
} as React.CSSProperties;

export function NavRail() {
  const pathname = usePathname();

  return (
    <>
      {/* SVG displacement filter for nav melt */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="navMelt" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.025" numOctaves="3" seed="8" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2" result="smoothNoise" />
            <feDisplacementMap in="SourceGraphic" in2="smoothNoise" scale="18" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ── Mobile bottom pill bars ── */}
      <div className="fixed bottom-4 left-3 right-3 z-50 flex md:hidden gap-2 items-end"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* Categories pill */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="relative rounded-full overflow-hidden">
            {/* Melt backdrop */}
            <div className="absolute inset-0 rounded-full" style={{ ...MELT_STYLE, filter: "url(#navMelt)" }} />
            {/* Nav content */}
            <div className="relative flex items-center gap-3 px-3 py-2">

            {categories.map((cat) => {
              const isHome = cat.href === "/";
              const active = isHome
                ? pathname === "/" && !new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").has("category")
                : pathname === "/" && typeof window !== "undefined" && window.location.search.includes(cat.href.split("?")[1] || "");

              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="flex flex-col items-center gap-1 shrink-0"
                >
                  <div className="w-[36px] h-[36px] rounded-[10px] overflow-hidden bg-surface-alt">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[8px] leading-none font-medium tracking-tight text-center text-[#141414]/70 whitespace-nowrap">
                    {cat.label}
                  </span>
                </Link>
              );
            })}
            </div>
          </div>
        </div>

        {/* Utilities pill */}
        <div className="overflow-x-auto scrollbar-hide shrink-0">
          <div className="relative rounded-full overflow-hidden">
            {/* Melt backdrop */}
            <div className="absolute inset-0 rounded-full" style={{ ...MELT_STYLE, filter: "url(#navMelt)" }} />
            {/* Nav content */}
            <div className="relative flex items-center gap-3 px-3 py-2">
              {utilities.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 shrink-0"
                >
                  <div className="w-[28px] h-[28px] flex items-center justify-center opacity-60">
                    {item.icon}
                  </div>
                  <span className="text-[8px] leading-none font-medium tracking-tight text-center text-[#141414]/70 whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop nav rail (unchanged) ── */}
      <nav
        className="hidden md:flex fixed md:relative z-40 top-0 left-0 h-full
          w-[160px] bg-background flex-col items-center
          overflow-y-auto overflow-x-hidden"
      >
        {/* Category links with images */}
        <div className="flex flex-col items-center gap-[30px] pt-[50px] pb-6 w-full px-4">
          {categories.map((cat) => {
            const active = cat.href === "/"
              ? pathname === "/"
              : pathname.startsWith(cat.href);
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex flex-col items-center gap-[7px] group w-full min-h-[44px] justify-center"
              >
                <div className="w-[50px] h-[50px] rounded-[15px] overflow-hidden bg-surface-alt">
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
        <div className="flex flex-col items-center gap-[30px] pt-6 pb-8 w-full px-4">
          {utilities.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
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
    </>
  );
}
