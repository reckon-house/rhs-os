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

const CS = "/case-studies";
// Same range set + order as the on-site reel (SizzlePlayground).
// Note on loading: full 2560px sources decode to ~100MB of bitmaps (past the
// tab's decode-cache budget, and a re-decode never completes under the
// exporter's frozen clock), so each is downscaled to 1080px in-page via
// createImageBitmap and handed over as a blob URL — memory-resident, instant,
// no network fetch after the clock freezes.
const RAW = [
  `${CS}/nordstrom-personalization/nordstrom-personalization-system-design-woman-model-blue-floral-print-dress-black-white-geometric-strappy-heels-yellow-sofa-editorial.jpg`,
  `${CS}/hill-country-bath/hill-country-bath-vanity-marble-globe-sconces-sage.jpg`,
  `${CS}/nordstrom-framework/nordstrom-content-framework-lockup-whats-now.jpg`,
  `${CS}/hill-country-kitchen/hill-country-kitchen-island-pendants-marble-wide.jpg`,
  `${CS}/hill-country-oak/hill-country-oakworks-outdoor-banner-whiskey-barrels-colorful-background-tree-texas-born-oakcraft.jpg`,
  `${CS}/j-christianson/j-christianson-storefront-tree-stripe-window-mockup.jpg`,
  `${CS}/capitan-boot-co/capitan-boot-co-western-original-buffalo-silhouette-desert-landscape-mesa-mountains-sage-brush-terrain-branding-campaign.jpg`,
];
const COLORS = ["#0AA7CA", "#181B17", "#776549", "#F5EAE7", "#8A8784"];
const HEADLINE = "Reckon House Staples";

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
