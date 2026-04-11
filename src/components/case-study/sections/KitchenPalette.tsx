"use client";

import { useMemo } from "react";

/**
 * KitchenPalette — Dense circos-style color spectrum.
 * Outer band with micro-bar tracks (like MaterialCircos),
 * arc-following labels, and dense color dots filling the interior
 * with chord connections between related families.
 */

const COLOR_FAMILIES = [
  {
    name: "Sage Cabinet",
    colors: ["#3D4A3A", "#4D5D44", "#5B6B52", "#6B7B62", "#7A8B72", "#8A9B82", "#9AAB92"],
    weight: 2,
  },
  {
    name: "Marble White",
    colors: ["#F5F0EB", "#EDE5DC", "#E5DDD4", "#DDD5CC", "#D5CEC7", "#CCC5BE"],
    weight: 1.5,
  },
  {
    name: "Marble Vein",
    colors: ["#A8A098", "#9A928A", "#8C847C", "#7E766E", "#B8AFA6", "#C8BFB6"],
    weight: 1.2,
  },
  {
    name: "White Oak",
    colors: ["#D4BA85", "#C4A265", "#B89E6A", "#AC9060", "#C0A870", "#D8C898", "#E8D8A8"],
    weight: 2,
  },
  {
    name: "Brass",
    colors: ["#A8893A", "#B8983A", "#9A7E3A", "#C9AA5B", "#8A7030", "#D4B86A", "#7A6228"],
    weight: 1.5,
  },
  {
    name: "Dark Walnut",
    colors: ["#4A3828", "#5A4838", "#6B5540", "#7A6545", "#3A2818", "#8A7555"],
    weight: 1,
  },
  {
    name: "Leather Tan",
    colors: ["#9A7E50", "#AA8E60", "#BA9E70", "#8A6E40", "#CAAE80"],
    weight: 0.8,
  },
  {
    name: "Rug Charcoal",
    colors: ["#3A3A3A", "#4A4A4A", "#5A5A5A", "#2A2A2A", "#6A6A6A"],
    weight: 0.8,
  },
];

const CONNECTIONS: [number, number][] = [
  [0, 3], [0, 4], [1, 2], [1, 3], [3, 4],
  [3, 5], [4, 5], [5, 6], [5, 7], [6, 7], [2, 0],
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

export function KitchenPalette() {
  const svgContent = useMemo(() => {
    const rng = seededRandom(199);
    const W = 900;
    const H = 900;
    const cx = W / 2;
    const cy = H / 2;
    const GAP = 0.015;

    // ── Distribute families by weight ──
    const totalWeight = COLOR_FAMILIES.reduce((s, f) => s + f.weight, 0);
    const availableAngle = Math.PI * 2 - GAP * COLOR_FAMILIES.length;

    interface Family { name: string; colors: string[]; startAngle: number; endAngle: number }
    const families: Family[] = [];
    let angle = -Math.PI / 2;
    COLOR_FAMILIES.forEach((f) => {
      const span = (f.weight / totalWeight) * availableAngle;
      families.push({ name: f.name, colors: f.colors, startAngle: angle, endAngle: angle + span });
      angle += span + GAP;
    });

    const els: React.ReactNode[] = [];
    let idx = 0;

    // ── TRACK 1 (outermost): Color bars — each family's colors as micro-bars ──
    const T1_OUTER = 390;
    const T1_INNER = 376;
    families.forEach((fam) => {
      const span = fam.endAngle - fam.startAngle;
      const barCount = Math.max(6, Math.floor(span * 90));
      const barSpan = span / barCount;
      for (let b = 0; b < barCount; b++) {
        const bStart = fam.startAngle + b * barSpan;
        const bEnd = bStart + barSpan * 0.7;
        const h = 0.3 + rng() * 0.7;
        const rInner = T1_OUTER - (T1_OUTER - T1_INNER) * h;
        const color = fam.colors[Math.floor(rng() * fam.colors.length)];
        els.push(
          <path
            key={`t1-${idx++}`}
            d={describeArc(cx, cy, T1_OUTER, rInner, bStart, bEnd)}
            fill={color}
            fillOpacity={0.4 + rng() * 0.5}
          />
        );
      }
    });

    // ── TRACK 2: Solid color band — thin continuous strip per family ──
    const T2_OUTER = 373;
    const T2_INNER = 366;
    families.forEach((fam) => {
      const span = fam.endAngle - fam.startAngle;
      const subCount = Math.max(4, Math.floor(span * 70));
      const subSpan = span / subCount;
      for (let s = 0; s < subCount; s++) {
        const sStart = fam.startAngle + s * subSpan;
        const sEnd = sStart + subSpan * 0.8;
        const color = fam.colors[Math.floor(rng() * fam.colors.length)];
        els.push(
          <path
            key={`t2-${idx++}`}
            d={describeArc(cx, cy, T2_OUTER, T2_INNER, sStart, sEnd)}
            fill={color}
            fillOpacity={0.5 + rng() * 0.4}
          />
        );
      }
    });

    // ── TRACK 3: Scatter heatmap micro-bars ──
    const T3_OUTER = 363;
    const T3_INNER = 348;
    families.forEach((fam) => {
      const span = fam.endAngle - fam.startAngle;
      const dotCount = Math.floor(span * 130);
      for (let d = 0; d < dotCount; d++) {
        const a = fam.startAngle + rng() * span;
        const aEnd = a + 0.003 + rng() * 0.007;
        const h = 0.2 + rng() * 0.8;
        const rInner = T3_OUTER - (T3_OUTER - T3_INNER) * h;
        const color = fam.colors[Math.floor(rng() * fam.colors.length)];
        els.push(
          <path
            key={`t3-${idx++}`}
            d={describeArc(cx, cy, T3_OUTER, rInner, a, Math.min(aEnd, fam.endAngle))}
            fill={color}
            fillOpacity={0.2 + rng() * 0.5}
          />
        );
      }
    });

    // ── TRACK 4: Scatter dots along outer rim ──
    families.forEach((fam) => {
      const span = fam.endAngle - fam.startAngle;
      const count = Math.floor(span * 70);
      for (let d = 0; d < count; d++) {
        const a = fam.startAngle + rng() * span;
        const r = 395 + (rng() - 0.5) * 14;
        const color = fam.colors[Math.floor(rng() * fam.colors.length)];
        els.push(
          <circle
            key={`t4-${idx++}`}
            cx={cx + Math.cos(a) * r}
            cy={cy + Math.sin(a) * r}
            r={0.4 + rng() * 1.8}
            fill={color}
            fillOpacity={0.15 + rng() * 0.35}
          />
        );
      }
    });

    // ── ARC LABELS (textPath like MaterialCircos) ──
    const R_LABEL = 410;
    const labelDefs: React.ReactNode[] = [];
    const labelTexts: React.ReactNode[] = [];
    families.forEach((fam, i) => {
      const text = fam.name.toUpperCase();
      const charWidth = 5.5;
      const textLen = text.length * charWidth;
      const textArc = textLen / R_LABEL;
      const midAngle = (fam.startAngle + fam.endAngle) / 2;
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
          <path key={`klp-${i}`} id={`kLabelPath-${i}`} d={`M ${x1} ${y1} A ${R_IL} ${R_IL} 0 0 0 ${x2} ${y2}`} fill="none" stroke="none" />
        );
      } else {
        const arcStart = midAngle - textArc / 2;
        const arcEnd = midAngle + textArc / 2;
        const x1 = cx + Math.cos(arcStart) * R_LABEL;
        const y1 = cy + Math.sin(arcStart) * R_LABEL;
        const x2 = cx + Math.cos(arcEnd) * R_LABEL;
        const y2 = cy + Math.sin(arcEnd) * R_LABEL;
        labelDefs.push(
          <path key={`klp-${i}`} id={`kLabelPath-${i}`} d={`M ${x1} ${y1} A ${R_LABEL} ${R_LABEL} 0 0 1 ${x2} ${y2}`} fill="none" stroke="none" />
        );
      }

      labelTexts.push(
        <text key={`klab-${i}`} fill="#141414" fillOpacity={0.5} fontSize="8" fontFamily="var(--font-satoshi), sans-serif" fontWeight="600" letterSpacing="0.05em">
          <textPath href={`#kLabelPath-${i}`} startOffset="50%" textAnchor="middle">{text}</textPath>
        </text>
      );
    });

    // ── COLOR DOTS (dense interior fill) ──
    const colorDots: React.ReactNode[] = [];
    families.forEach((fam, fi) => {
      const span = fam.endAngle - fam.startAngle;
      // Many more dots per family
      const count = 60 + Math.floor(fam.colors.length * 12);
      for (let k = 0; k < count; k++) {
        const angleJitter = (rng() - 0.5) * span * 0.95;
        const a = (fam.startAngle + fam.endAngle) / 2 + angleJitter;
        const r = 30 + rng() * 310;
        const color = fam.colors[Math.floor(rng() * fam.colors.length)];
        const dotR = 1.5 + rng() * 12;
        colorDots.push(
          <circle
            key={`cd-${fi}-${k}`}
            cx={cx + Math.cos(a) * r}
            cy={cy + Math.sin(a) * r}
            r={dotR}
            fill={color}
            fillOpacity={0.1 + rng() * 0.3}
          />
        );
      }
    });

    // ── CHORD CONNECTIONS (dense, 15-20 lines per connection) ──
    const chordEls: React.ReactNode[] = [];
    CONNECTIONS.forEach(([a, b]) => {
      const famA = families[a];
      const famB = families[b];
      const spanA = famA.endAngle - famA.startAngle;
      const spanB = famB.endAngle - famB.startAngle;
      const lineCount = 15 + Math.floor(rng() * 8);

      for (let l = 0; l < lineCount; l++) {
        const aA = famA.startAngle + rng() * spanA;
        const aB = famB.startAngle + rng() * spanB;
        const r1 = 340 + (rng() - 0.5) * 10;
        const r2 = 340 + (rng() - 0.5) * 10;
        const x1 = cx + Math.cos(aA) * r1;
        const y1 = cy + Math.sin(aA) * r1;
        const x2 = cx + Math.cos(aB) * r2;
        const y2 = cy + Math.sin(aB) * r2;
        const ctrl = 0.02 + rng() * 0.3;
        const qx = cx + (x1 + x2 - 2 * cx) * ctrl;
        const qy = cy + (y1 + y2 - 2 * cy) * ctrl;
        const color = COLOR_FAMILIES[a].colors[Math.floor(rng() * COLOR_FAMILIES[a].colors.length)];
        chordEls.push(
          <path
            key={`kch-${idx++}`}
            d={`M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}`}
            fill="none"
            stroke={color}
            strokeWidth={0.3 + rng() * 0.5}
            strokeOpacity={0.05 + rng() * 0.08}
          />
        );
      }
    });

    // ── Guide rings ──
    const rings = [340, 220, 110].map((r, i) => (
      <circle key={`ring-${i}`} cx={cx} cy={cy} r={r} fill="none" stroke="#141414" strokeWidth="0.3" strokeOpacity="0.04" strokeDasharray={i > 0 ? "2 6" : "none"} />
    ));

    // ── Center ──
    const center = (
      <g>
        <circle cx={cx} cy={cy} r={3} fill="#141414" fillOpacity={0.12} />
        <text x={cx} y={cy - 16} textAnchor="middle" fill="#141414" fillOpacity={0.18} fontSize="8" fontFamily="var(--font-satoshi), sans-serif" fontWeight="500" letterSpacing="0.1em">
          COLOR SPECTRUM
        </text>
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#141414" fillOpacity={0.1} fontSize="7" fontFamily="var(--font-satoshi), sans-serif" letterSpacing="0.06em">
          8 FAMILIES · {COLOR_FAMILIES.reduce((s, f) => s + f.colors.length, 0)} VALUES
        </text>
      </g>
    );

    // ── Background square grid ──
    const gridLines: React.ReactNode[] = [];
    for (let i = 0; i < 11; i++) {
      const pos = (i + 1) * (900 / 12);
      gridLines.push(
        <g key={`grid-${i}`}>
          <line x1={pos} y1={0} x2={pos} y2={900} stroke="#141414" strokeWidth={0.5} opacity={0.08} />
          <line x1={0} y1={pos} x2={900} y2={pos} stroke="#141414" strokeWidth={0.5} opacity={0.08} />
        </g>
      );
    }

    return (
      <>
        {gridLines}
        {rings}
        {chordEls}
        {colorDots}
        {els}
        {labelDefs}
        {labelTexts}
        {center}
      </>
    );
  }, []);

  return (
    <div className="w-full px-4 md:px-0 py-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-[9px] md:text-[10px] font-medium tracking-[0.1em] text-[#141414]/40 uppercase">
          Kitchen Color Spectrum
        </span>
        <span className="text-[9px] md:text-[10px] tracking-[0.05em] text-[#141414]/25">
          material families · color relationships
        </span>
      </div>
      <div className="w-full overflow-x-auto"
        data-lenis-prevent-touch>
        <div className="min-w-[800px]">
          <svg viewBox="-30 -30 960 960" className="w-full h-auto" style={{ background: "transparent" }}>
            {svgContent}
          </svg>
        </div>
      </div>
    </div>
  );
}
