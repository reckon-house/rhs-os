"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SizzleReel, buildSequence } from "@/components/fx/SizzleReel";

// Headless capture surface for scripts/export-sizzle-gif.mjs. Renders ONE
// full-viewport reel with no chrome, waits for fonts + images before mounting
// (so beat 0 starts clean), and exposes:
//   window.__ready   — true once the reel is mounted and safe to record
//   window.__beat    — current beat index (from onBeatChange)
//   window.__beatCount — total beat transitions (to detect fresh boundaries)
//   window.__loopMs  — one full loop duration in ms
// Not linked anywhere; delete with the rest of src/app/sizzle when done.

const IMG = "/case-studies/big-bend";
// Two exporter constraints shape how images load here:
//   1. Full 2560px sources decode to ~100MB of bitmaps — past the tab's
//      decode-cache budget, and a re-decode never completes under the
//      exporter's frozen clock. So each source is downscaled to 1080px
//      in-page via createImageBitmap (the Next optimizer is unavailable:
//      this project runs images.unoptimized in dev).
//   2. Each beat layer mounts a fresh <img>, and a network fetch started
//      under the frozen clock never delivers — so the downscaled result is
//      handed over as a blob URL: memory-resident, instant, no network
//      after freeze.
const RAW = [
  `${IMG}/chisos-peak-cactus.jpg`,
  `${IMG}/rise.jpg`,
  `${IMG}/mountain_crop.jpg`,
  `${IMG}/desert-dusk-ridgeline.jpg`,
  `${IMG}/hero.jpg`,
  `${IMG}/prada.jpg`,
];
const COLORS = ["#494636", "#181B14", "#756B58", "#96A6AB", "#C6C6C9"];
const HEADLINE = "Far West Texas";

declare global {
  interface Window {
    __ready?: boolean;
    __beat?: number;
    __beatCount?: number;
    __loopMs?: number;
  }
}

export default function SizzleCapturePage() {
  const [srcs, setSrcs] = useState<string[] | null>(null);

  useEffect(() => {
    let alive = true;
    const beats = buildSequence(RAW.length, COLORS, HEADLINE);
    window.__loopMs = beats.reduce((s, b) => s + b.ms, 0);
    window.__beatCount = 0;
    Promise.all([
      document.fonts.ready,
      ...RAW.map((p) =>
        fetch(p)
          .then((r) => r.blob())
          .then((b) => createImageBitmap(b, { resizeWidth: 1080, resizeQuality: "high" }))
          .then(
            (bmp) =>
              new Promise<string>((resolve) => {
                const cv = document.createElement("canvas");
                cv.width = bmp.width;
                cv.height = bmp.height;
                cv.getContext("2d")!.drawImage(bmp, 0, 0);
                bmp.close();
                cv.toBlob((blob) => resolve(URL.createObjectURL(blob!)), "image/jpeg", 0.85);
              })
          )
          .then(
            (url) =>
              new Promise<string>((resolve) => {
                const im = new window.Image();
                im.onload = () => im.decode().then(() => resolve(url), () => resolve(url));
                im.onerror = () => resolve(url);
                im.src = url;
              })
          )
      ),
    ]).then(([, ...urls]) => {
      if (!alive) return;
      setSrcs(urls as string[]);
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
  if (!srcs) return null;
  return createPortal(
    <div id="sizzle-capture-root" style={{ position: "fixed", inset: 0, background: "#0E0E0E", zIndex: 2147483646 }}>
      <SizzleReel
        images={srcs}
        colors={COLORS}
        headline={HEADLINE}
        onBeatChange={onBeat}
        style={{ width: "100vw", height: "100vh", borderRadius: 0 }}
      />
    </div>,
    document.body
  );
}
