"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * PolygonLattice — the Ivy Park signature device at scale. Same-size hexagons
 * lined up across the field, each rotated a few degrees more than the one to
 * its left (a twist gradient). The whole gradient drifts as a travelling wave,
 * and moving the mouse through it accelerates the spin. Honours
 * prefers-reduced-motion (stays static).
 *
 * No copy over the pattern. It used to carry a name and a description
 * centred over a soft veil, both of which said the same thing the
 * section-header and columns around it already say — pure pattern reads
 * better and matches every other artwork section on the page (hex-polygon
 * carries no caption either).
 */

const HEX_PATH =
  "M2.98962 693.072L0.34596 229.765L397.617 0.400769L797.53 234.344L800.174 697.651L402.903 927.015L2.98962 693.072Z";

const N = 36;
const POLY_W = 392; // each hexagon's own size — never stretched
const POLY_H = Math.round((POLY_W * 928) / 801);
const TWIST = 4; // each hexagon rotated TWIST° more than its left neighbour

export function PolygonLattice() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const pgs = Array.from(field.querySelectorAll<HTMLElement>("[data-pgc]"));

    /* The field fills its box edge to edge: STEP (the gap between
       successive hexagons) is measured from the box's own width, not a
       constant. Each hexagon keeps its own POLY_W/POLY_H untouched, so
       widening the field spreads the shapes further apart rather than
       stretching any one of them — still "one shape, rotated", not a
       distorted one. Box HEIGHT never enters this calculation, so it
       never changes.
       useLayoutEffect, not useEffect: this runs before paint, so the
       first frame is already spread to width rather than flashing the
       stacked, unmeasured layout for one frame first. */
    const layout = () => {
      const w = field.getBoundingClientRect().width;
      const step = N > 1 ? Math.max(0, (w - POLY_W) / (N - 1)) : 0;
      for (let i = 0; i < pgs.length; i++) {
        const offset = (i - (N - 1) / 2) * step;
        pgs[i].style.marginLeft = `${offset}px`;
      }
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(field);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => ro.disconnect();
    }

    let baseAng = 0;
    let boost = 0;
    let lastX: number | null = null;
    let lastY: number | null = null;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      if (lastX != null && lastY != null) {
        boost = Math.min(boost + Math.hypot(e.clientX - lastX, e.clientY - lastY) * 0.03, 6);
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onLeave = () => {
      lastX = lastY = null;
    };
    field.addEventListener("mousemove", onMove);
    field.addEventListener("mouseleave", onLeave);

    const anim = () => {
      boost *= 0.94;
      baseAng += 0.1 * (1 + boost);
      for (let i = 0; i < pgs.length; i++) {
        pgs[i].style.transform = `translate(-50%,-50%) rotate(${baseAng + i * TWIST}deg)`;
      }
      raf = requestAnimationFrame(anim);
    };
    raf = requestAnimationFrame(anim);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      field.removeEventListener("mousemove", onMove);
      field.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={fieldRef}
      style={{ position: "relative", width: "100%", height: "462px", marginBottom: "8px", overflow: "hidden" }}
    >
      {Array.from({ length: N }).map((_, i) => (
        <div
          key={i}
          data-pgc
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: `${POLY_W}px`,
            height: `${POLY_H}px`,
            transform: `translate(-50%,-50%) rotate(${i * TWIST}deg)`,
          }}
        >
          <svg viewBox="0 0 801 928" fill="none" style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}>
            <path d={HEX_PATH} stroke="rgba(20,20,20,0.24)" strokeWidth={1} fill="none" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      ))}
    </div>
  );
}
