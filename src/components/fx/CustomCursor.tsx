"use client";

import { useEffect, useRef } from "react";

/**
 * A custom cursor built from the site's own asterisk mark.
 *
 * Idle: the mark slowly morphs through its three weights (thin → regular →
 * heavy → regular → thin) by cross-fading three mask layers, and drifts in a
 * slow rotation that echoes the homepage asterisk. Rendered white and
 * composited with `mix-blend-mode: difference`, so it inverts against whatever's
 * behind it — visible on cream pages and dark case-study images alike.
 *
 * Over a link / thumbnail: grows, snaps to the bold (heavy) weight, and turns
 * sage — restoring the "this is clickable" cue we lose by hiding the native
 * pointer.
 *
 * Fine-pointer only (touch keeps its native cursor). Auto-motion freezes under
 * prefers-reduced-motion (handled in CSS).
 */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor-grow]';

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;

    document.documentElement.classList.add("cursor-asterisk-on");

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
      document.documentElement.classList.remove("cursor-asterisk-on");
    };
  }, []);

  return (
    <div ref={ref} className="asterisk-cursor" aria-hidden="true">
      <div className="asterisk-cursor__spin">
        {/* idle: three weights cross-fading */}
        <div className="asterisk-cursor__morph">
          <div className="asterisk-cursor__layer asterisk-cursor__layer--thin" />
          <div className="asterisk-cursor__layer asterisk-cursor__layer--regular" />
          <div className="asterisk-cursor__layer asterisk-cursor__layer--heavy" />
        </div>
        {/* hover: bold sage mark that fades in over the morph */}
        <div className="asterisk-cursor__hover" />
      </div>
    </div>
  );
}
