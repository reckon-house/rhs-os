"use client";

import { useEffect, useRef, useState } from "react";

/**
 * HexPolygon — Rotating polygon outlines around the Ivy Park hex portrait.
 * Ported from Framer PolygonSpin component. Uses requestAnimationFrame
 * for smooth, independent rotation of each polygon ring.
 */

const POLYGON_PATH =
  "M2.98962 693.072L0.34596 229.765L397.617 0.400769L797.53 234.344L800.174 697.651L402.903 927.015L2.98962 693.072Z";

const IMG_SRC = "/case-studies/ivy-park/ivy-park-polygon-portrait-frame-logo.png";

const POLYGON_COUNT = 7;
const POLYGON_SCALE = 0.92;
const STROKE_COLOR = "#141414";
const STROKE_WIDTH = 0.7;
const BASE_SPEED = 0.4;
const SPEED_VARIATION = 0.8;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function HexPolygon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const rotationsRef = useRef<number[]>([]);
  const speedsRef = useRef<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize speeds and rotations with seeded random for consistency
  useEffect(() => {
    if (!isMounted) return;

    const rng = seededRandom(42);
    const speeds: number[] = [];
    const rotations: number[] = [];

    for (let i = 0; i < POLYGON_COUNT; i++) {
      const direction = i % 2 === 0 ? 1 : -1;
      const speedMultiplier = 1 + (rng() * SPEED_VARIATION - SPEED_VARIATION / 2);
      speeds.push(BASE_SPEED * speedMultiplier * direction * (0.5 + i * 0.15));
      rotations.push((360 / POLYGON_COUNT) * i + rng() * 15);
    }

    speedsRef.current = speeds;
    rotationsRef.current = rotations;
  }, [isMounted]);

  // Animation loop — direct DOM manipulation for 60fps
  useEffect(() => {
    if (!isMounted) return;

    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      const polygons = container.querySelectorAll(".polygon-ring");

      polygons.forEach((polygon, i) => {
        if (
          rotationsRef.current[i] !== undefined &&
          speedsRef.current[i] !== undefined
        ) {
          rotationsRef.current[i] += speedsRef.current[i] * 0.016;
          (polygon as HTMLElement).style.transform =
            `rotate(${rotationsRef.current[i]}deg)`;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMounted]);

  // Generate polygon rings
  const rings = [];
  for (let i = 0; i < POLYGON_COUNT; i++) {
    rings.push(
      <svg
        key={i}
        className="polygon-ring"
        viewBox="0 0 801 928"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: `${POLYGON_SCALE * 100}%`,
          height: `${POLYGON_SCALE * 100}%`,
          transformOrigin: "center center",
          pointerEvents: "none",
        }}
      >
        <path
          d={POLYGON_PATH}
          stroke={STROKE_COLOR}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
      </svg>
    );
  }

  return (
    <div className="w-full px-4 md:px-0 py-8">
      <div className="max-w-[550px] mx-auto" style={{ aspectRatio: "801 / 928" }}>
        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
          }}
        >
          {/* Fixed image behind the rings */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG_SRC}
            alt="Ivy Park polygon portrait frame with model and logo"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(0.97)",
              width: "auto",
              height: "100%",
              objectFit: "contain",
              zIndex: 0,
            }}
          />

          {/* Rotating polygon rings */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
          >
            {rings}
          </div>
        </div>
      </div>
    </div>
  );
}
