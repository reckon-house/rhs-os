"use client";

import { useEffect, useRef } from "react";

export type MorphGlyphSpec = {
  char: string;
  /** Which brand face to render this glyph in. Defaults to the Ogg display face. */
  font?: "ogg" | "avenir-medium" | "avenir-demi" | "avenir-bold";
};

const FONT_URLS: Record<string, string> = {
  ogg: "/fonts/Ogg-Regular.otf",
  "avenir-medium": "/fonts/AvenirNext-Medium.woff",
  "avenir-demi": "/fonts/AvenirNext-DemiBold.woff",
  "avenir-bold": "/fonts/AvenirNext-Bold.woff",
};

/**
 * A large display glyph that morphs through a sequence of letters (and faces).
 * Reads the real outline of each glyph from its font file (opentype.js) and
 * interpolates the points between them (flubber), handling counter add/remove
 * when letters differ (e.g. A → R → C). Progressive enhancement: the SSR
 * markup is the first letter as live text; the morph swaps in once the libs
 * load on the client. Honours prefers-reduced-motion (stays static).
 */
export function MorphingGlyph({
  glyphs,
  size = "clamp(200px, 34vw, 440px)",
  fill = "#141414",
  hold = 1300,
  morph = 1000,
}: {
  glyphs: MorphGlyphSpec[];
  size?: string;
  fill?: string;
  hold?: number;
  morph?: number;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glyphKey = glyphs.map((g) => `${g.char}:${g.font ?? "ogg"}`).join("|");

  useEffect(() => {
    if (glyphs.length === 0) return;
    const span = spanRef.current;
    const svg = svgRef.current;
    const pathEl = pathRef.current;
    if (!span || !svg || !pathEl) return;

    let raf = 0;
    let fade: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fallback: fade-cycle the letters on the live-text span until the morph
    // engine is ready (and the permanent state if the libs ever fail to load).
    let fi = 0;
    if (!reduce && glyphs.length > 1) {
      fade = setInterval(() => {
        fi = (fi + 1) % glyphs.length;
        span.style.opacity = "0";
        window.setTimeout(() => {
          span.textContent = glyphs[fi].char;
          span.style.opacity = "1";
        }, 400);
      }, hold + morph);
    }

    (async () => {
      let otMod: typeof import("opentype.js");
      let flMod: typeof import("flubber");
      try {
        [otMod, flMod] = await Promise.all([import("opentype.js"), import("flubber")]);
      } catch {
        return; // keep the text fallback
      }
      if (cancelled || reduce) return;

      // Normalise interop (ESM named vs CJS default).
      const opentype = (otMod && (otMod as { load?: unknown }).load ? otMod : ((otMod as { default?: unknown }).default ?? otMod)) as {
        load: (url: string) => Promise<OTFont>;
      };
      const flubber = (flMod && (flMod as { interpolate?: unknown }).interpolate ? flMod : ((flMod as { default?: unknown }).default ?? flMod)) as Flubber;
      if (!opentype?.load || !flubber?.interpolate) return;

      // Normalise a glyph into a common 1000×1000 box (centred, equal cap height).
      const norm = (font: OTFont, ch: string): string => {
        const g = font.charToGlyph(ch);
        const p = g.getPath(0, 0, 1000);
        const bb = p.getBoundingBox();
        const w = bb.x2 - bb.x1;
        const h = bb.y2 - bb.y1;
        const s = 820 / h;
        const tx = (1000 - w * s) / 2 - bb.x1 * s;
        const ty = (1000 - h * s) / 2 - bb.y1 * s;
        for (const c of p.commands) {
          if (c.x != null) c.x = c.x * s + tx;
          if (c.y != null) c.y = c.y * s + ty;
          if (c.x1 != null) c.x1 = c.x1 * s + tx;
          if (c.y1 != null) c.y1 = c.y1 * s + ty;
          if (c.x2 != null) c.x2 = c.x2 * s + tx;
          if (c.y2 != null) c.y2 = c.y2 * s + ty;
        }
        return p.toPathData(2);
      };
      const ringsOf = (d: string) => d.split(/(?=M)/).filter((s) => s.trim().length > 0);
      const ringArea = (d: string) => {
        const nums = (d.match(/-?\d+\.?\d*/g) || []).map(Number);
        const xs: number[] = [];
        const ys: number[] = [];
        for (let i = 0; i + 1 < nums.length; i += 2) {
          xs.push(nums[i]);
          ys.push(nums[i + 1]);
        }
        if (xs.length === 0) return 0;
        return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
      };
      // Morph one glyph (1–2 contours) to the next, handling counter add/remove
      // (e.g. R→C drops the bowl, C→A grows one) via flubber combine/separate.
      const makeMorph = (from: string[], to: string[]): ((t: number) => string) => {
        const ms = 2.5;
        if (from.length === to.length) {
          const fns = from.map((f, i) => flubber.interpolate(f, to[i], { maxSegmentLength: ms }));
          return (t: number) => fns.map((fn) => fn(t)).join(" ");
        }
        if (to.length === 1) return flubber.combine(from, to[0], { maxSegmentLength: ms, single: true });
        if (from.length === 1) return flubber.separate(from[0], to, { maxSegmentLength: ms, single: true });
        const fn = flubber.interpolate(from[0], to[0], { maxSegmentLength: ms });
        return (t: number) => fn(t);
      };

      const urls = Array.from(new Set(glyphs.map((g) => FONT_URLS[g.font ?? "ogg"] ?? FONT_URLS.ogg)));
      let loaded: OTFont[];
      try {
        loaded = await Promise.all(urls.map((u) => opentype.load(u)));
      } catch {
        return;
      }
      if (cancelled) return;
      const fontByUrl: Record<string, OTFont> = {};
      urls.forEach((u, i) => {
        fontByUrl[u] = loaded[i];
      });

      const ringSets = glyphs.map((g) => {
        const url = FONT_URLS[g.font ?? "ogg"] ?? FONT_URLS.ogg;
        const r = ringsOf(norm(fontByUrl[url], g.char));
        r.sort((a, b) => ringArea(b) - ringArea(a)); // outer ring first
        return r;
      });
      if (ringSets.some((r) => r.length === 0)) return;

      const n = ringSets.length;
      const interps = ringSets.map((_, i) => makeMorph(ringSets[i], ringSets[(i + 1) % n]));

      if (fade) clearInterval(fade);
      span.style.display = "none";
      svg.style.display = "block";

      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      let seg = 0;
      let t0: number | null = null;
      const frame = (ts: number) => {
        if (cancelled) return;
        if (t0 == null) t0 = ts;
        const el = ts - t0;
        let t: number;
        if (el < hold) t = 0;
        else if (el < hold + morph) t = (el - hold) / morph;
        else {
          seg = (seg + 1) % n;
          t0 = ts;
          t = 0;
        }
        pathEl.setAttribute("d", interps[seg](ease(t)));
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    })();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (fade) clearInterval(fade);
    };
    // glyphKey captures the meaningful contents of `glyphs`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glyphKey, hold, morph]);

  return (
    <span aria-hidden style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 0 }}>
      <span
        ref={spanRef}
        style={{
          fontFamily: "'Ogg', Georgia, serif",
          fontWeight: 400,
          fontSize: size,
          lineHeight: 0.8,
          color: fill,
          transition: "opacity .4s ease",
          display: "inline-block",
        }}
      >
        {glyphs[0]?.char ?? ""}
      </span>
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="geometricPrecision"
        style={{ display: "none", width: size, height: size, overflow: "visible" }}
      >
        <path ref={pathRef} fill={fill} fillRule="evenodd" />
      </svg>
    </span>
  );
}

// Minimal shapes for the dynamically-imported, untyped libs.
type OTCommand = { x?: number; y?: number; x1?: number; y1?: number; x2?: number; y2?: number };
type OTPath = {
  commands: OTCommand[];
  getBoundingBox: () => { x1: number; y1: number; x2: number; y2: number };
  toPathData: (decimals?: number) => string;
};
type OTGlyph = { getPath: (x: number, y: number, fontSize: number) => OTPath };
type OTFont = { charToGlyph: (ch: string) => OTGlyph };
type FlubberOpts = { maxSegmentLength?: number; single?: boolean };
type Flubber = {
  interpolate: (from: string, to: string, opts?: FlubberOpts) => (t: number) => string;
  combine: (from: string[], to: string, opts?: FlubberOpts) => (t: number) => string;
  separate: (from: string, to: string[], opts?: FlubberOpts) => (t: number) => string;
};
