"use client";

import { useMemo, useEffect, useRef, useState } from "react";

/**
 * JeffreyFlagshipRadius — Radial diagram showing the Jeffrey New York digital
 * flagship system propagating from the core brand experience outward through
 * every surface of the build. Same dense, circos-influenced aesthetic as the
 * Ivy Park CampaignBlastRadius, retuned for Jeffrey's palette: yellow center
 * (the wordmark color), charcoal bulk, warm-accent secondary, no blues.
 */

const VISUAL_ELEMENTS = [
  { name: "Wordmark", color: "#1A1A1A" },
  { name: "Avenir Next Heavy", color: "#2a2a2a" },
  { name: "Demi Bold / CTA", color: "#3a3a3a" },
  { name: "Modular Grid", color: "#4a4a4a" },
  { name: "Editorial Photography", color: "#FFFF40" },
  { name: "Curatorial Voice", color: "#1A1A1A" },
];

const CHANNELS = [
  { name: "Homepage Modules", assets: 12, elements: [0, 1, 3, 4, 5], angle: 0 },
  { name: "Designer Pages", assets: 38, elements: [0, 1, 2, 3, 4], angle: 1 },
  { name: "Product Detail Pages", assets: 240, elements: [2, 3, 4], angle: 2 },
  { name: "Editorial Spreads", assets: 14, elements: [1, 3, 4, 5], angle: 3 },
  { name: "Buying Edit", assets: 22, elements: [3, 4, 5], angle: 4 },
  { name: "Email Campaigns", assets: 18, elements: [0, 1, 2, 4], angle: 5 },
  { name: "Navigation System", assets: 6, elements: [0, 2, 3], angle: 6 },
  { name: "Cart & Checkout", assets: 8, elements: [2, 3], angle: 7 },
];

// Yellow accent that matches the JEFFREY wordmark's yellow half. Sparingly
// used in outer tracks so the chart still reads as a Jeffrey artifact, not
// a holiday decoration.
const ACCENT = "#FFFF40";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function describeArc(
  cx: number, cy: number,
  rOuter: number, rInner: number,
  startAngle: number, endAngle: number,
): string {
  const x1o = cx + Math.cos(startAngle) * rOuter;
  const y1o = cy + Math.sin(startAngle) * rOuter;
  const x2o = cx + Math.cos(endAngle) * rOuter;
  const y2o = cy + Math.sin(endAngle) * rOuter;
  const x1i = cx + Math.cos(endAngle) * rInner;
  const y1i = cy + Math.sin(endAngle) * rInner;
  const x2i = cx + Math.cos(startAngle) * rInner;
  const y2i = cy + Math.sin(startAngle) * rInner;
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    `M ${x1o} ${y1o}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2o} ${y2o}`,
    `L ${x1i} ${y1i}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x2i} ${y2i}`,
    `Z`,
  ].join(" ");
}

export function JeffreyFlagshipRadius() {
  const svgContent = useMemo(() => {
    const rng = seededRandom(271);
    const W = 900;
    const H = 900;
    const cx = W / 2;
    const cy = H / 2;
    const GAP = 0.02;

    const els: React.ReactNode[] = [];
    let idx = 0;

    // ── Distribute channels around the circle ──
    const totalAngle = Math.PI * 2 - GAP * CHANNELS.length;
    const anglePerChannel = totalAngle / CHANNELS.length;

    interface Chan { name: string; assets: number; elements: number[]; startAngle: number; endAngle: number }
    const channels: Chan[] = [];
    let angle = -Math.PI / 2;
    CHANNELS.forEach((ch) => {
      channels.push({ ...ch, startAngle: angle, endAngle: angle + anglePerChannel });
      angle += anglePerChannel + GAP;
    });

    // ── Background grid ──
    for (let i = 0; i < 11; i++) {
      const pos = (i + 1) * (900 / 12);
      els.push(
        <g key={`grid-${i}`}>
          <line x1={pos} y1={0} x2={pos} y2={900} stroke="#141414" strokeWidth={0.5} opacity={0.06} />
          <line x1={0} y1={pos} x2={900} y2={pos} stroke="#141414" strokeWidth={0.5} opacity={0.06} />
        </g>
      );
    }

    // ── Guide rings ──
    [100, 180, 260, 340, 390].forEach((r, i) => {
      els.push(
        <circle key={`ring-${i}`} cx={cx} cy={cy} r={r} fill="none" stroke="#141414" strokeWidth={0.3} strokeOpacity={0.05} strokeDasharray={i < 4 ? "2 6" : "none"} />
      );
    });

    // ── RING 1: Visual elements ring (R=110) ──
    const R_VIS = 110;
    VISUAL_ELEMENTS.forEach((ve, vi) => {
      const a = -Math.PI / 2 + (Math.PI * 2 / VISUAL_ELEMENTS.length) * vi;
      const vx = cx + Math.cos(a) * R_VIS;
      const vy = cy + Math.sin(a) * R_VIS;
      els.push(
        <circle key={`ve-${vi}`} cx={vx} cy={vy} r={4} fill="#141414" fillOpacity={0.3} />,
        <text key={`ve-t-${vi}`} x={vx} y={vy - 10} textAnchor="middle" fill="#141414" fillOpacity={0.3} fontSize="6.5" fontFamily="var(--font-satoshi), sans-serif" fontWeight="500" letterSpacing="0.04em">
          {ve.name.toUpperCase()}
        </text>,
      );
    });

    // ── BLAST RAYS: lines from core through visual elements to channels ──
    channels.forEach((ch, ci) => {
      const midAngle = (ch.startAngle + ch.endAngle) / 2;
      const span = ch.endAngle - ch.startAngle;

      // Multiple rays per channel for density — proportional to asset count
      const rayCount = 8 + Math.floor(ch.assets / 8);
      for (let r = 0; r < rayCount; r++) {
        const rayAngle = ch.startAngle + rng() * span;
        const innerR = 60 + rng() * 30;
        const outerR = 300 + rng() * 80;
        const x1 = cx + Math.cos(rayAngle) * innerR;
        const y1 = cy + Math.sin(rayAngle) * innerR;
        const x2 = cx + Math.cos(rayAngle) * outerR;
        const y2 = cy + Math.sin(rayAngle) * outerR;

        // Tint a small portion of rays with the warm accent (editorial)
        const veIdx = ch.elements[Math.floor(rng() * ch.elements.length)];
        const isAccent = veIdx === 4 && rng() > 0.4;

        els.push(
          <line
            key={`ray-${idx++}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isAccent ? "#FFFF40" : "#141414"}
            strokeWidth={0.3 + rng() * 0.6}
            strokeOpacity={0.04 + rng() * 0.08}
          />
        );
      }

      // Thicker main ray per channel
      const mx1 = cx + Math.cos(midAngle) * 60;
      const my1 = cy + Math.sin(midAngle) * 60;
      const mx2 = cx + Math.cos(midAngle) * 345;
      const my2 = cy + Math.sin(midAngle) * 345;
      els.push(
        <line
          key={`main-ray-${ci}`}
          x1={mx1} y1={my1} x2={mx2} y2={my2}
          stroke="#141414"
          strokeWidth={0.5}
          strokeOpacity={0.08}
        />
      );
    });

    // ── Scatter particles along rays ──
    for (let i = 0; i < 400; i++) {
      const a = rng() * Math.PI * 2;
      const r = 50 + rng() * 340;
      const tint = rng();
      const fill = tint > 0.92 ? ACCENT : tint > 0.85 ? "#FFFF40" : "#141414";
      els.push(
        <circle
          key={`p-${i}`}
          cx={cx + Math.cos(a) * r}
          cy={cy + Math.sin(a) * r}
          r={0.3 + rng() * 2}
          fill={fill}
          fillOpacity={0.03 + rng() * 0.08}
        />
      );
    }

    // ── OUTER TRACK 1: Channel bars (histogram style) ──
    const T1_OUTER = 390;
    const T1_INNER = 375;
    channels.forEach((ch) => {
      const span = ch.endAngle - ch.startAngle;
      const barCount = Math.max(5, Math.floor(span * 80));
      const barSpan = span / barCount;
      for (let b = 0; b < barCount; b++) {
        const bStart = ch.startAngle + b * barSpan;
        const bEnd = bStart + barSpan * 0.7;
        const h = 0.3 + rng() * 0.7;
        const rInner = T1_OUTER - (T1_OUTER - T1_INNER) * h;
        const tint = rng();
        const fill = tint > 0.9 ? ACCENT : tint > 0.78 ? "#FFFF40" : "#141414";
        els.push(
          <path
            key={`t1-${idx++}`}
            d={describeArc(cx, cy, T1_OUTER, rInner, bStart, bEnd)}
            fill={fill}
            fillOpacity={0.15 + rng() * 0.35}
          />
        );
      }
    });

    // ── OUTER TRACK 2: Asset density (thinner) ──
    const T2_OUTER = 372;
    const T2_INNER = 365;
    channels.forEach((ch) => {
      const span = ch.endAngle - ch.startAngle;
      const subCount = Math.max(3, Math.floor(span * 60));
      const subSpan = span / subCount;
      for (let s = 0; s < subCount; s++) {
        const sStart = ch.startAngle + s * subSpan;
        const sEnd = sStart + subSpan * 0.75;
        els.push(
          <path
            key={`t2-${idx++}`}
            d={describeArc(cx, cy, T2_OUTER, T2_INNER, sStart, sEnd)}
            fill="#141414"
            fillOpacity={0.1 + rng() * 0.3}
          />
        );
      }
    });

    // ── OUTER TRACK 3: Scatter micro-bars ──
    const T3_OUTER = 362;
    const T3_INNER = 348;
    channels.forEach((ch) => {
      const span = ch.endAngle - ch.startAngle;
      const dotCount = Math.floor(span * 100);
      for (let d = 0; d < dotCount; d++) {
        const a = ch.startAngle + rng() * span;
        const aEnd = a + 0.003 + rng() * 0.006;
        const h = 0.2 + rng() * 0.8;
        const rInner = T3_OUTER - (T3_OUTER - T3_INNER) * h;
        els.push(
          <path
            key={`t3-${idx++}`}
            d={describeArc(cx, cy, T3_OUTER, rInner, a, Math.min(aEnd, ch.endAngle))}
            fill="#141414"
            fillOpacity={0.08 + rng() * 0.2}
          />
        );
      }
    });

    // ── Outer rim scatter dots ──
    channels.forEach((ch) => {
      const span = ch.endAngle - ch.startAngle;
      const count = Math.floor(span * 50);
      for (let d = 0; d < count; d++) {
        const a = ch.startAngle + rng() * span;
        const r = 395 + (rng() - 0.5) * 12;
        els.push(
          <circle
            key={`rim-${idx++}`}
            cx={cx + Math.cos(a) * r}
            cy={cy + Math.sin(a) * r}
            r={0.4 + rng() * 1.5}
            fill="#141414"
            fillOpacity={0.08 + rng() * 0.15}
          />
        );
      }
    });

    // ── CHANNEL LABELS (arc text) ──
    const R_LABEL = 410;
    const labelDefs: React.ReactNode[] = [];
    const labelTexts: React.ReactNode[] = [];
    channels.forEach((ch, i) => {
      const text = ch.name.toUpperCase();
      const charWidth = 5.5;
      const textLen = text.length * charWidth;
      const textArc = textLen / R_LABEL;
      const midAngle = (ch.startAngle + ch.endAngle) / 2;
      const isBottom = midAngle > Math.PI * 0.15 && midAngle < Math.PI * 0.85;

      if (isBottom) {
        const R_IL = R_LABEL - 2;
        const arcStart = midAngle + textArc / 2;
        const arcEnd = midAngle - textArc / 2;
        const x1 = cx + Math.cos(arcStart) * R_IL;
        const y1 = cy + Math.sin(arcStart) * R_IL;
        const x2 = cx + Math.cos(arcEnd) * R_IL;
        const y2 = cy + Math.sin(arcEnd) * R_IL;
        labelDefs.push(
          <path key={`flp-${i}`} id={`flagshipLabel-${i}`} d={`M ${x1} ${y1} A ${R_IL} ${R_IL} 0 0 0 ${x2} ${y2}`} fill="none" stroke="none" />
        );
      } else {
        const arcStart = midAngle - textArc / 2;
        const arcEnd = midAngle + textArc / 2;
        const x1 = cx + Math.cos(arcStart) * R_LABEL;
        const y1 = cy + Math.sin(arcStart) * R_LABEL;
        const x2 = cx + Math.cos(arcEnd) * R_LABEL;
        const y2 = cy + Math.sin(arcEnd) * R_LABEL;
        labelDefs.push(
          <path key={`flp-${i}`} id={`flagshipLabel-${i}`} d={`M ${x1} ${y1} A ${R_LABEL} ${R_LABEL} 0 0 1 ${x2} ${y2}`} fill="none" stroke="none" />
        );
      }

      labelTexts.push(
        <text key={`flt-${i}`} fill="#141414" fillOpacity={0.5} fontSize="8" fontFamily="var(--font-satoshi), sans-serif" fontWeight="600" letterSpacing="0.05em">
          <textPath href={`#flagshipLabel-${i}`} startOffset="50%" textAnchor="middle">{text}</textPath>
        </text>
      );
    });

    // ── Legend ──
    const legend = (
      <g>
        <rect x={20} y={H - 28} width={8} height={8} rx={1.5} fill="#141414" fillOpacity={0.4} />
        <text x={32} y={H - 21} fill="#141414" fillOpacity={0.3} fontSize="7.5" fontFamily="var(--font-satoshi), sans-serif" fontWeight="500" letterSpacing="0.04em">VISUAL SYSTEM</text>
        <rect x={130} y={H - 28} width={8} height={8} rx={1.5} fill={ACCENT} fillOpacity={0.8} />
        <text x={142} y={H - 21} fill="#141414" fillOpacity={0.3} fontSize="7.5" fontFamily="var(--font-satoshi), sans-serif" fontWeight="500" letterSpacing="0.04em">BRAND YELLOW</text>
        <text x={250} y={H - 21} fill="#141414" fillOpacity={0.2} fontSize="7" fontFamily="var(--font-satoshi), sans-serif" letterSpacing="0.04em">RAY DENSITY = ASSET VOLUME</text>
      </g>
    );

    return (
      <>
        {els}
        {labelDefs}
        {labelTexts}
        {legend}
      </>
    );
  }, []);

  // ── Center: yellow filled circle (the wordmark's yellow), with subtle
  // rotating ring overlays for visual life. Mirrors the Ivy Park hex animation
  // structure but with circles + the JEFFREY brand yellow.
  const ringContainerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const rotationsRef = useRef<number[]>([]);
  const speedsRef = useRef<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const RING_COUNT = 4;

  useEffect(() => {
    if (!mounted) return;
    const rng2 = seededRandom(57);
    const speeds: number[] = [];
    const rotations: number[] = [];
    for (let i = 0; i < RING_COUNT; i++) {
      const dir = i % 2 === 0 ? 1 : -1;
      const mult = 1 + (rng2() * 0.6 - 0.3);
      speeds.push(0.3 * mult * dir * (0.5 + i * 0.2));
      rotations.push((360 / RING_COUNT) * i + rng2() * 20);
    }
    speedsRef.current = speeds;
    rotationsRef.current = rotations;
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const container = ringContainerRef.current;
    if (!container) return;
    const animate = () => {
      const rings = container.querySelectorAll(".jeffrey-center-ring");
      rings.forEach((p, i) => {
        if (rotationsRef.current[i] !== undefined && speedsRef.current[i] !== undefined) {
          rotationsRef.current[i] += speedsRef.current[i] * 0.016;
          (p as HTMLElement).style.transform = `rotate(${rotationsRef.current[i]}deg)`;
        }
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [mounted]);

  const centerRings = [];
  for (let i = 0; i < RING_COUNT; i++) {
    // Each ring is a slight ellipse offset, rotating, to give the yellow disc
    // a sense of pulse without a heavy animation.
    const inset = i * 4;
    centerRings.push(
      <svg key={i} className="jeffrey-center-ring" viewBox="0 0 100 100" fill="none" style={{
        position: "absolute", inset: `${inset}px`,
        transformOrigin: "center center", pointerEvents: "none",
      }}>
        <ellipse cx={50} cy={50} rx={48 - i * 1.5} ry={46 - i * 1.5} stroke="#1A1A1A" strokeWidth={0.4} fill="none" opacity={0.3 - i * 0.05} strokeDasharray={i % 2 === 0 ? "2 5" : "none"} />
      </svg>
    );
  }

  return (
    <div className="w-full px-4 md:px-0 py-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-[9px] md:text-[10px] font-medium tracking-[0.1em] text-[#141414]/40 uppercase">
          Flagship Build Radius
        </span>
        <span className="text-[9px] md:text-[10px] tracking-[0.05em] text-[#141414]/25">
          1 visual system · 8 surfaces · 358 assets
        </span>
      </div>
      <div className="w-full overflow-x-auto" data-lenis-prevent-touch>
        <div className="min-w-[800px] relative">
          <svg viewBox="-30 -30 960 960" className="w-full h-auto" style={{ background: "transparent" }}>
            {svgContent}
          </svg>
          {/* Yellow center disc — the JEFFREY wordmark's yellow half, with
              subtle rotating ring overlays for life. */}
          <div
            ref={ringContainerRef}
            className="absolute pointer-events-none"
            style={{
              width: "13%",
              height: "13%",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: ACCENT }}
            />
            {centerRings}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[8px] font-bold tracking-[0.08em] text-[#1A1A1A]/80">BRAND</span>
              <span className="text-[8px] font-bold tracking-[0.08em] text-[#1A1A1A]/80">EXPERIENCE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
