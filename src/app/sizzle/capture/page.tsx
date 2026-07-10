"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SizzleReel, buildSequence } from "@/components/fx/SizzleReel";

// Headless capture surface for scripts/export-sizzle-gif.mjs. Renders ONE
// full-viewport reel with no chrome, waits for fonts + decoded images before
// mounting (so beat 0 starts clean), and exposes:
//   window.__ready   — true once the reel is mounted and safe to record
//   window.__beat    — current beat index (from onBeatChange)
//   window.__beatCount — total beat transitions (to detect fresh boundaries)
//   window.__loopMs  — one full loop duration in ms
// Not linked anywhere; delete with the rest of src/app/sizzle when done.

const IMG = "/case-studies/ivy-park";
const IVY = [
  `${IMG}/ivy-park-editorial-beanie-portrait-dancer.jpg`,
  `${IMG}/ivy-park-experience-confidence-strength-inclusivity.jpg`,
  `${IMG}/ivy-park-shop-the-look-editorial-grid.jpg`,
  `${IMG}/ivy-park-product-detail-leggings-choice-system.jpg`,
  `${IMG}/ivy-park-experience-courage-power-polygon-frames.jpg`,
];
const COLORS = ["#0888B8", "#181818", "#38B8D8", "#E8E8E8", "#98A8A8"];
const HEADLINE = "Courage is power";

declare global {
  interface Window {
    __ready?: boolean;
    __beat?: number;
    __beatCount?: number;
    __loopMs?: number;
  }
}

export default function SizzleCapturePage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const beats = buildSequence(IVY.length, COLORS, HEADLINE);
    window.__loopMs = beats.reduce((s, b) => s + b.ms, 0);
    window.__beatCount = 0;
    Promise.all([
      document.fonts.ready,
      ...IVY.map(
        (src) =>
          new Promise<void>((resolve) => {
            const im = new window.Image();
            im.onload = () => im.decode().then(() => resolve(), () => resolve());
            im.onerror = () => resolve();
            im.src = src;
          })
      ),
    ]).then(() => {
      if (!alive) return;
      setReady(true);
    });
    // Blank every part of the app except the capture portal: the NavRail and
    // fx overlays sit at max z-index, so out-stacking them is a losing game.
    // display:none (not visibility) because children can undo an inherited
    // visibility:hidden with their own visibility:visible — the N button does.
    const veil = document.createElement("style");
    veil.textContent =
      "body > *:not(#sizzle-capture-root){display:none !important}";
    document.head.appendChild(veil);
    return () => {
      alive = false;
      veil.remove();
    };
  }, []);

  const onBeat = useCallback((k: number) => {
    window.__beat = k;
    window.__beatCount = (window.__beatCount ?? 0) + 1;
    window.__ready = true; // first beat fired = reel is live
  }, []);

  // Portaled to <body>: the route renders inside Lenis's <main>, whose
  // stacking context traps any z-index beneath the root-level NavRail and
  // fx overlays. From body, max z-index genuinely covers the whole page.
  if (!ready) return null;
  return createPortal(
    <div id="sizzle-capture-root" style={{ position: "fixed", inset: 0, background: "#0E0E0E", zIndex: 2147483646 }}>
      <SizzleReel
        images={IVY}
        colors={COLORS}
        headline={HEADLINE}
        onBeatChange={onBeat}
        style={{ width: "100vw", height: "100vh", borderRadius: 0 }}
      />
    </div>,
    document.body
  );
}
