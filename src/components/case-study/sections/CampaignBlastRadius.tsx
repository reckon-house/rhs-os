"use client";

import { useMemo, useEffect, useRef, useState } from "react";

/**
 * CampaignBlastRadius — Radial diagram showing the Ivy Park visual system
 * propagating from the core brand experience outward through every channel.
 * Dense, starburst aesthetic with circos-influenced outer tracks.
 */

const CORE = { label: "Brand\nExperience", color: "#1a1a1a" };

const VISUAL_ELEMENTS = [
  { name: "Polygon Frame", color: "#3a3a3a" },
  { name: "Typography", color: "#4a4a4a" },
  { name: "B&W Photography", color: "#5a5a5a" },
  { name: "Color Product", color: "#0088cc" },
  { name: "Motion / Scroll", color: "#3a3a3a" },
];

const CHANNELS = [
  { name: "Scrolling Experience", assets: 1, elements: [0, 1, 2, 3, 4], angle: 0 },
  { name: "Launch Emails", assets: 6, elements: [0, 1, 2, 3], angle: 1 },
  { name: "Social Assets", assets: 24, elements: [0, 1, 2, 3], angle: 2 },
  { name: "Digital Ads", assets: 18, elements: [1, 2, 3], angle: 3 },
  { name: "In-Store Digital", assets: 8, elements: [0, 1, 2], angle: 4 },
  { name: "Product Pages", assets: 42, elements: [1, 3], angle: 5 },
  { name: "Site Placements", assets: 12, elements: [0, 1, 2, 3], angle: 6 },
  { name: "CMS Components", assets: 5, elements: [0, 4], angle: 7 },
];

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

export function CampaignBlastRadius() {
  const svgContent = useMemo(() => {
    const rng = seededRandom(314);
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

    // ── CORE: hex animation overlaid via HTML ──

    // ── RING 1: Visual elements ring (R=100-120) ──
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

      // Multiple rays per channel for density
      const rayCount = 8 + Math.floor(ch.assets / 5);
      for (let r = 0; r < rayCount; r++) {
        const rayAngle = ch.startAngle + rng() * span;
        const innerR = 60 + rng() * 30;
        const outerR = 300 + rng() * 80;
        const x1 = cx + Math.cos(rayAngle) * innerR;
        const y1 = cy + Math.sin(rayAngle) * innerR;
        const x2 = cx + Math.cos(rayAngle) * outerR;
        const y2 = cy + Math.sin(rayAngle) * outerR;

        // Color based on which visual element connects
        const veIdx = ch.elements[Math.floor(rng() * ch.elements.length)];
        const isBlue = veIdx === 3;

        els.push(
          <line
            key={`ray-${idx++}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isBlue ? "#0088cc" : "#141414"}
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
      const isBlue = rng() > 0.8;
      els.push(
        <circle
          key={`p-${i}`}
          cx={cx + Math.cos(a) * r}
          cy={cy + Math.sin(a) * r}
          r={0.3 + rng() * 2}
          fill={isBlue ? "#0088cc" : "#141414"}
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
        const isBlue = rng() > 0.75;
        els.push(
          <path
            key={`t1-${idx++}`}
            d={describeArc(cx, cy, T1_OUTER, rInner, bStart, bEnd)}
            fill={isBlue ? "#0088cc" : "#141414"}
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
          <path key={`blp-${i}`} id={`blastLabel-${i}`} d={`M ${x1} ${y1} A ${R_IL} ${R_IL} 0 0 0 ${x2} ${y2}`} fill="none" stroke="none" />
        );
      } else {
        const arcStart = midAngle - textArc / 2;
        const arcEnd = midAngle + textArc / 2;
        const x1 = cx + Math.cos(arcStart) * R_LABEL;
        const y1 = cy + Math.sin(arcStart) * R_LABEL;
        const x2 = cx + Math.cos(arcEnd) * R_LABEL;
        const y2 = cy + Math.sin(arcEnd) * R_LABEL;
        labelDefs.push(
          <path key={`blp-${i}`} id={`blastLabel-${i}`} d={`M ${x1} ${y1} A ${R_LABEL} ${R_LABEL} 0 0 1 ${x2} ${y2}`} fill="none" stroke="none" />
        );
      }

      labelTexts.push(
        <text key={`blt-${i}`} fill="#141414" fillOpacity={0.5} fontSize="8" fontFamily="var(--font-satoshi), sans-serif" fontWeight="600" letterSpacing="0.05em">
          <textPath href={`#blastLabel-${i}`} startOffset="50%" textAnchor="middle">{text}</textPath>
        </text>
      );
    });

    // ── SELLOUT ring at the very outside ──
    els.push(
      <text key="sellout-label" x={cx} y={cy + 75} textAnchor="middle" fill="#141414" fillOpacity={0.12} fontSize="7" fontFamily="var(--font-satoshi), sans-serif" letterSpacing="0.08em">
        95% SOLD OUT IN DAYS
      </text>
    );

    // ── Legend ──
    const legend = (
      <g>
        <rect x={20} y={H - 28} width={8} height={8} rx={1.5} fill="#141414" fillOpacity={0.4} />
        <text x={32} y={H - 21} fill="#141414" fillOpacity={0.3} fontSize="7.5" fontFamily="var(--font-satoshi), sans-serif" fontWeight="500" letterSpacing="0.04em">VISUAL SYSTEM</text>
        <rect x={130} y={H - 28} width={8} height={8} rx={1.5} fill="#0088cc" fillOpacity={0.4} />
        <text x={142} y={H - 21} fill="#141414" fillOpacity={0.3} fontSize="7.5" fontFamily="var(--font-satoshi), sans-serif" fontWeight="500" letterSpacing="0.04em">COLOR PRODUCT</text>
        <text x={280} y={H - 21} fill="#141414" fillOpacity={0.2} fontSize="7" fontFamily="var(--font-satoshi), sans-serif" letterSpacing="0.04em">RAY DENSITY = ASSET VOLUME</text>
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

  // ── Mini hex animation at center ──
  const hexContainerRef = useRef<HTMLDivElement>(null);
  const hexAnimRef = useRef<number | null>(null);
  const hexRotationsRef = useRef<number[]>([]);
  const hexSpeedsRef = useRef<number[]>([]);
  const [hexMounted, setHexMounted] = useState(false);

  useEffect(() => { setHexMounted(true); }, []);

  const HEX_COUNT = 5;
  const HEX_PATH = "M2.98962 693.072L0.34596 229.765L397.617 0.400769L797.53 234.344L800.174 697.651L402.903 927.015L2.98962 693.072Z";

  useEffect(() => {
    if (!hexMounted) return;
    const rng2 = seededRandom(99);
    const speeds: number[] = [];
    const rotations: number[] = [];
    for (let i = 0; i < HEX_COUNT; i++) {
      const dir = i % 2 === 0 ? 1 : -1;
      const mult = 1 + (rng2() * 0.8 - 0.4);
      speeds.push(0.4 * mult * dir * (0.5 + i * 0.2));
      rotations.push((360 / HEX_COUNT) * i + rng2() * 15);
    }
    hexSpeedsRef.current = speeds;
    hexRotationsRef.current = rotations;
  }, [hexMounted]);

  useEffect(() => {
    if (!hexMounted) return;
    const container = hexContainerRef.current;
    if (!container) return;
    const animate = () => {
      const polygons = container.querySelectorAll(".mini-hex-ring");
      polygons.forEach((p, i) => {
        if (hexRotationsRef.current[i] !== undefined && hexSpeedsRef.current[i] !== undefined) {
          hexRotationsRef.current[i] += hexSpeedsRef.current[i] * 0.016;
          (p as HTMLElement).style.transform = `rotate(${hexRotationsRef.current[i]}deg)`;
        }
      });
      hexAnimRef.current = requestAnimationFrame(animate);
    };
    hexAnimRef.current = requestAnimationFrame(animate);
    return () => { if (hexAnimRef.current) cancelAnimationFrame(hexAnimRef.current); };
  }, [hexMounted]);

  const miniHexRings = [];
  const miniScale = 0.95;
  for (let i = 0; i < HEX_COUNT; i++) {
    miniHexRings.push(
      <svg key={i} className="mini-hex-ring" viewBox="0 0 801 928" fill="none" style={{
        position: "absolute", inset: 0, margin: "auto",
        width: `${miniScale * 100}%`, height: `${miniScale * 100}%`,
        transformOrigin: "center center", pointerEvents: "none",
      }}>
        <path d={HEX_PATH} stroke="#141414" strokeWidth={1.5} fill="none" opacity={0.4} />
      </svg>
    );
  }

  return (
    <div className="w-full px-4 md:px-0 py-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-[9px] md:text-[10px] font-medium tracking-[0.1em] text-[#141414]/40 uppercase">
          Campaign Blast Radius
        </span>
        <span className="text-[9px] md:text-[10px] tracking-[0.05em] text-[#141414]/25">
          1 visual system · 8 channels · 116 assets
        </span>
      </div>
      <div className="w-full overflow-x-auto" data-lenis-prevent-touch>
        <div className="min-w-[800px] relative">
          <svg viewBox="-30 -30 960 960" className="w-full h-auto" style={{ background: "transparent" }}>
            {svgContent}
          </svg>
          {/* Mini hex animation overlay at center */}
          <div
            ref={hexContainerRef}
            className="absolute pointer-events-none"
            style={{
              width: "16%",
              height: "16%",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {miniHexRings}
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[8px] font-bold tracking-[0.06em] text-[#141414]/50">BRAND</span>
              <span className="text-[8px] font-bold tracking-[0.06em] text-[#141414]/50">EXPERIENCE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
