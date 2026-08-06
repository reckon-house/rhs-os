"use client";

import { useEffect, useRef } from "react";

/**
 * A custom cursor that is one shape, slowly changing its mind about how
 * many corners it has.
 *
 * Idle: a single box morphs circle → squircle → square and back on a 12s
 * loop. The corner radius is the entire animation — 50% is a circle, ~30%
 * reads as a squircle at this size, a few percent is a square. It is
 * rendered white and composited with `mix-blend-mode: difference`, so it
 * inverts against whatever is behind it — visible on cream pages and dark
 * case-study plates alike.
 *
 * Over a link / thumbnail: grows, and the morph parks on the squircle. A
 * shape that stops changing is the "this is clickable" cue, replacing the
 * one lost by hiding the native pointer.
 *
 * Fine-pointer only (touch keeps its native cursor). Under
 * prefers-reduced-motion the shape holds the squircle and nothing animates
 * (handled in CSS).
 */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor-grow]';

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;

    document.documentElement.classList.add("cursor-shape-on");

    let x = 0;
    let y = 0;
    let raf = 0;
    let shown = false;

    const apply = () => {
      raf = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        el.classList.add("is-visible");
      }
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      shown = false;
      el.classList.remove("is-visible");
    };
    // Grow + recolor when over anything clickable.
    const onOver = (e: Event) => {
      const t = e.target;
      const interactive = t instanceof Element && t.closest(INTERACTIVE);
      el.classList.toggle("is-hover", !!interactive);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseover", onOver);
      if (raf) cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-shape-on");
    };
  }, []);

  return (
    <div ref={ref} className="shape-cursor" aria-hidden="true">
      <div className="shape-cursor__box" />
    </div>
  );
}
