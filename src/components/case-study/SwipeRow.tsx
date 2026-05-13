"use client";

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";

interface SwipeRowProps {
  children: ReactNode[];
  /** Fraction of container width each card takes (default: 0.85) */
  cardFraction?: number;
  /** Gap between cards in px (default: 16) */
  gap?: number;
  /**
   * Left inset (px) between the viewport edge and the first card.
   * Default 16 matches the px-4 used by ImageBlock on case-study pages so
   * carousels align with static images above/below. Pages whose surrounding
   * content sits flush to a different outer wrapper (e.g. CategoryPage with
   * its px-[10px] outer) should pass inset={0} so the carousel aligns with
   * the rest of the page.
   */
  inset?: number;
  className?: string;
}

export function SwipeRow({
  children,
  cardFraction = 0.85,
  gap = 16,
  inset = 16,
  className = "",
}: SwipeRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [cardPx, setCardPx] = useState(0);
  const count = children.length;

  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCardPx(el.clientWidth * cardFraction);
  }, [cardFraction]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !cardPx) return;

    const onScroll = () => {
      const step = cardPx + gap;
      const idx = Math.round(el.scrollLeft / step);
      setActive(Math.min(idx, count - 1));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [count, cardPx, gap]);

  const spacerWidth = cardPx
    ? (scrollRef.current?.clientWidth ?? 0) - cardPx
    : `${(1 - cardFraction) * 100}%`;

  return (
    <div className={`md:hidden ${className}`}>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ gap, scrollBehavior: "smooth", paddingLeft: inset, scrollPaddingLeft: inset }}
        data-lenis-prevent
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="snap-start shrink-0"
            style={{ width: cardPx || `${cardFraction * 100}%` }}
          >
            {child}
          </div>
        ))}
        {/* End spacer gives the last card enough trailing room to snap to
            the same left-inset position as the first card. Without it the
            last card hugs the viewport's right edge — visually asymmetric
            with how the first card sits. Applies for any count > 1
            (single-card layouts have nothing to scroll to). */}
        {count > 1 && <div className="shrink-0" style={{ width: spacerWidth }} />}
      </div>

      {/* Dot indicators */}
      {count > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? "bg-[#141414] scale-125"
                  : "bg-[#141414]/20"
              }`}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const step = cardPx + gap;
                el.scrollTo({ left: step * i, behavior: "smooth" });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
