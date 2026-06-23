"use client";

import { useEffect, useRef } from "react";

/**
 * TypeAtVolume — the Ivy Park "type at volume" composition. An oversized ghost
 * word and a giant clipped hexagon sit behind a justified headline, a vertical
 * lockup, and a small note. The headline ("CONFIDENCE IS STRENGTH") is justified
 * to span the *ink* width of the ghost word, measured on canvas (getBBox/Range
 * return advance width, not ink, so canvas measureText is the reliable path).
 */

const HEX_PATH =
  "M2.98962 693.072L0.34596 229.765L397.617 0.400769L797.53 234.344L800.174 697.651L402.903 927.015L2.98962 693.072Z";

const THIN = "'Jost', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const AVENIR = "'Avenir Next', system-ui, sans-serif";
const MUTED = "rgba(20,20,20,0.72)";

export function TypeAtVolume({
  ghostWord,
  thinLead,
  heavyWord,
  lockupTop,
  lockupVertical,
  note,
}: {
  ghostWord: string;
  thinLead: string;
  heavyWord: string;
  lockupTop: string;
  lockupVertical: string;
  note: string;
}) {
  const tvRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const confRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tv = tvRef.current;
    const ghost = ghostRef.current;
    const conf = confRef.current;
    if (!tv || !ghost || !conf) return;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return;

    // True ink bounds of the ghost word (sum per-glyph advance, track the
    // furthest-left ink and furthest-right ink across the run).
    const inkBounds = () => {
      const cs = getComputedStyle(ghost);
      const ls = parseFloat(cs.letterSpacing) || 0;
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const s = ghost.textContent || "";
      let x = 0;
      let L = Infinity;
      let R = -Infinity;
      for (let i = 0; i < s.length; i++) {
        const m = ctx.measureText(s[i]);
        const l = x - (m.actualBoundingBoxLeft || 0);
        const r = x + (m.actualBoundingBoxRight || 0);
        if (l < L) L = l;
        if (r > R) R = r;
        x += m.width + ls;
      }
      return { left: L, width: R - L };
    };

    const align = () => {
      const b = inkBounds();
      if (!isFinite(b.left)) return;
      const t = tv.getBoundingClientRect();
      const gh = ghost.getBoundingClientRect();
      // left edge → ghost's ink left; right edge → container edge.
      conf.style.left = `${Math.max(0, gh.left - t.left + b.left)}px`;
      conf.style.right = "0px";
      conf.style.width = "auto";
    };

    if (document.fonts?.ready) document.fonts.ready.then(align);
    align();
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [ghostWord, thinLead, heavyWord]);

  return (
    <div
      ref={tvRef}
      style={{
        position: "relative",
        borderTop: "1px solid rgba(20,20,20,0.15)",
        borderBottom: "1px solid rgba(20,20,20,0.15)",
        minHeight: "clamp(460px, 56vw, 700px)",
        overflow: "hidden",
        padding: "48px 0",
      }}
    >
      {/* oversized ghost word, bleeding off the bottom-left */}
      <div
        ref={ghostRef}
        aria-hidden
        style={{
          position: "absolute",
          left: "-26px",
          bottom: "-86px",
          fontFamily: AVENIR,
          fontWeight: 700,
          fontSize: "clamp(190px, 56vw, 700px)",
          lineHeight: 0.72,
          letterSpacing: "-0.04em",
          color: "rgba(20,20,20,0.05)",
          zIndex: 0,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {ghostWord}
      </div>

      {/* giant signature hexagon, clipped off the bottom + right */}
      <svg
        viewBox="0 0 801 928"
        preserveAspectRatio="none"
        aria-hidden
        style={{
          position: "absolute",
          right: "-240px",
          bottom: "-300px",
          width: "800px",
          height: "927px",
          zIndex: 0,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        <path d={HEX_PATH} fill="none" stroke="rgba(20,20,20,0.12)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </svg>

      {/* headline — justified across, aligned to the ghost ink width */}
      <div
        ref={confRef}
        style={{
          position: "absolute",
          bottom: "54px",
          left: 0,
          right: 0,
          zIndex: 2,
          fontFamily: AVENIR,
          textTransform: "uppercase",
          fontSize: "clamp(26px, 3.3vw, 42px)",
          lineHeight: 1.1,
          textAlign: "justify",
          textAlignLast: "justify",
          textJustify: "inter-character",
        }}
      >
        <span style={{ fontFamily: THIN, fontWeight: 100, letterSpacing: "0.02em", color: MUTED }}>{thinLead}</span>
        <span style={{ fontWeight: 700, color: "#141414" }}>{heavyWord}</span>
      </div>

      {/* right-hand lockup — thin lead-in over a vertical heavy word */}
      <div
        style={{
          position: "absolute",
          right: "4px",
          top: "128px",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "6px",
        }}
      >
        <span
          style={{
            textTransform: "uppercase",
            textAlign: "right",
            fontFamily: THIN,
            fontWeight: 100,
            fontSize: "clamp(32px, 4.2vw, 58px)",
            lineHeight: 1,
            letterSpacing: "0.02em",
            color: MUTED,
            maxWidth: "6em",
            paddingTop: "8px",
          }}
        >
          {lockupTop}
        </span>
        <span
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontFamily: AVENIR,
            fontWeight: 700,
            fontSize: "clamp(56px, 8vw, 110px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.84,
            color: "#141414",
          }}
        >
          {lockupVertical}
        </span>
      </div>

      {/* note — top-left, under the section label */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "24px",
          zIndex: 2,
          fontSize: "13px",
          lineHeight: 1.7,
          color: "rgba(20,20,20,0.6)",
          maxWidth: "430px",
        }}
      >
        {note}
      </div>
    </div>
  );
}
