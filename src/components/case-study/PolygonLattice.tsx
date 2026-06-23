"use client";

import { useEffect, useRef } from "react";

/**
 * PolygonLattice — the Ivy Park signature device at scale. Same-size hexagons
 * lined up across the field, each rotated a few degrees more than the one to
 * its left (a twist gradient). The whole gradient drifts as a travelling wave,
 * and moving the mouse through it accelerates the spin. Copy sits centred on top
 * over a soft veil. Honours prefers-reduced-motion (stays static).
 */

const HEX_PATH =
  "M2.98962 693.072L0.34596 229.765L397.617 0.400769L797.53 234.344L800.174 697.651L402.903 927.015L2.98962 693.072Z";

const N = 36;
const POLY_W = 392;
const STEP = 20;
const TWIST = 4; // each hexagon rotated TWIST° more than its left neighbour
const POLY_H = Math.round((POLY_W * 928) / 801);

export function PolygonLattice({ name, description }: { name: string; description: string }) {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pgs = Array.from(field.querySelectorAll<HTMLElement>("[data-pgc]"));
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
      field.removeEventListener("mousemove", onMove);
      field.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={fieldRef}
      style={{ position: "relative", width: "100%", height: "462px", marginBottom: "8px", overflow: "hidden" }}
    >
      {Array.from({ length: N }).map((_, i) => {
        const offset = (i - (N - 1) / 2) * STEP;
        return (
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
              marginLeft: `${offset}px`,
              transform: `translate(-50%,-50%) rotate(${i * TWIST}deg)`,
            }}
          >
            <svg viewBox="0 0 801 928" fill="none" style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}>
              <path d={HEX_PATH} stroke="rgba(20,20,20,0.24)" strokeWidth={1} fill="none" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        );
      })}

      {/* soft veil so the copy reads over the dense lattice */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: "600px",
          height: "270px",
          maxWidth: "90%",
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, rgba(235,232,225,0.62) 0%, rgba(235,232,225,0.36) 42%, rgba(235,232,225,0) 76%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 2,
          textAlign: "center",
          maxWidth: "560px",
          padding: "0 20px",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>{name}</div>
        <div style={{ fontSize: "15px", lineHeight: 1.7, color: "rgba(20,20,20,0.78)" }}>{description}</div>
      </div>
    </div>
  );
}
