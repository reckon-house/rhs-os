"use client";

import { useMemo } from "react";

/**
 * MaterialCircos — Dense circos-style chord diagram.
 * Multiple concentric tracks on the outer ring (like genomics circos),
 * hundreds of thin chord lines connecting zones that share materials.
 */

const MATERIALS = [
  { name: "Sage Green", color: "#5B6B52", lightColor: "#8FA07A" },
  { name: "White Oak", color: "#C4A265", lightColor: "#D4BA85" },
  { name: "Calacatta Marble", color: "#B8AFA6", lightColor: "#D5CEC7" },
  { name: "Unlacquered Brass", color: "#A8893A", lightColor: "#C9AA5B" },
];

interface ZoneDef {
  name: string;
  materials: number[];
  color: string;
  weight: number; // relative arc size
}

const ZONES: ZoneDef[] = [
  { name: "Perimeter Cabinets", materials: [0, 3], color: "#5B6B52", weight: 2.5 },
  { name: "Range Hood", materials: [0, 2], color: "#6B7B62", weight: 1.2 },
  { name: "Backsplash", materials: [2], color: "#B8AFA6", weight: 1.8 },
  { name: "Countertops", materials: [2, 1], color: "#C4B8A8", weight: 2 },
  { name: "Island", materials: [1, 2, 3], color: "#C4A265", weight: 2.5 },
  { name: "Bar Stools", materials: [3, 1], color: "#A8893A", weight: 0.8 },
  { name: "Open Shelving", materials: [1], color: "#B89E6A", weight: 0.8 },
  { name: "Fixtures", materials: [3], color: "#9A7E3A", weight: 1.2 },
  { name: "Pendants", materials: [3], color: "#B8983A", weight: 0.7 },
  { name: "Pantry Wall", materials: [0, 3], color: "#4D5D44", weight: 1.8 },
  { name: "Fridge Panel", materials: [0], color: "#5B6B52", weight: 0.8 },
  { name: "Sink", materials: [2, 3], color: "#A8A098", weight: 1 },
  { name: "Dining Table", materials: [1], color: "#6B5540", weight: 1.2 },
  { name: "Dining Chairs", materials: [1], color: "#9A7E50", weight: 0.8 },
  { name: "Floor", materials: [1], color: "#7A6545", weight: 1.5 },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function MaterialCircos() {
  const svgContent = useMemo(() => {
    const rng = seededRandom(77);
    const W = 900;
    const H = 900;
    const cx = W / 2;
    const cy = H / 2;
    const GAP = 0.015;

    // ── Distribute zones by weight ──
    const totalWeight = ZONES.reduce((s, z) => s + z.weight, 0);
    const availableAngle = Math.PI * 2 - GAP * ZONES.length;

    interface Zone extends ZoneDef { startAngle: number; endAngle: number }
    const zones: Zone[] = [];
    let angle = -Math.PI / 2;
    ZONES.forEach((z) => {
      const span = (z.weight / totalWeight) * availableAngle;
      zones.push({ ...z, startAngle: angle, endAngle: angle + span });
      angle += span + GAP;
    });

    const els: React.ReactNode[] = [];
    let idx = 0;

    // ── TRACK 1 (outermost): Zone identity — thin bars with gaps ──
    const T1_OUTER = 390;
    const T1_INNER = 378;
    zones.forEach((zone) => {
      // Break each zone into many small sub-bars for texture
      const span = zone.endAngle - zone.startAngle;
      const barCount = Math.max(4, Math.floor(span * 80));
      const barSpan = span / barCount;
      for (let b = 0; b < barCount; b++) {
        const bStart = zone.startAngle + b * barSpan;
        const bEnd = bStart + barSpan * 0.7; // 70% fill, 30% gap
        const h = 0.5 + rng() * 0.5; // random height variation
        const rInner = T1_OUTER - (T1_OUTER - T1_INNER) * h;
        els.push(
          <path
            key={`t1-${idx++}`}
            d={describeArc(cx, cy, T1_OUTER, rInner, bStart, bEnd)}
            fill={zone.color}
            fillOpacity={0.4 + rng() * 0.4}
          />
        );
      }
    });

    // ── TRACK 2: Material assignment — color-coded thin ring ──
    const T2_OUTER = 375;
    const T2_INNER = 368;
    zones.forEach((zone) => {
      const span = zone.endAngle - zone.startAngle;
      const matCount = zone.materials.length;
      zone.materials.forEach((mi, mIdx) => {
        const mStart = zone.startAngle + (span / matCount) * mIdx;
        const mEnd = zone.startAngle + (span / matCount) * (mIdx + 1);
        // Sub-bars within material segment
        const subCount = Math.max(3, Math.floor((mEnd - mStart) * 60));
        const subSpan = (mEnd - mStart) / subCount;
        for (let s = 0; s < subCount; s++) {
          const sStart = mStart + s * subSpan;
          const sEnd = sStart + subSpan * 0.75;
          els.push(
            <path
              key={`t2-${idx++}`}
              d={describeArc(cx, cy, T2_OUTER, T2_INNER, sStart, sEnd)}
              fill={MATERIALS[mi].color}
              fillOpacity={0.5 + rng() * 0.4}
            />
          );
        }
      });
    });

    // ── TRACK 3: Density/usage heatmap — scattered micro-bars ──
    const T3_OUTER = 365;
    const T3_INNER = 350;
    zones.forEach((zone) => {
      const span = zone.endAngle - zone.startAngle;
      const dotCount = Math.floor(span * 120);
      for (let d = 0; d < dotCount; d++) {
        const a = zone.startAngle + rng() * span;
        const aEnd = a + 0.003 + rng() * 0.006;
        const h = 0.2 + rng() * 0.8;
        const rInner = T3_OUTER - (T3_OUTER - T3_INNER) * h;
        const mi = zone.materials[Math.floor(rng() * zone.materials.length)];
        els.push(
          <path
            key={`t3-${idx++}`}
            d={describeArc(cx, cy, T3_OUTER, rInner, a, Math.min(aEnd, zone.endAngle))}
            fill={MATERIALS[mi].color}
            fillOpacity={0.2 + rng() * 0.4}
          />
        );
      }
    });

    // ── TRACK 4: Scatter dots along outer rim ──
    const T4_R = 395;
    zones.forEach((zone) => {
      const span = zone.endAngle - zone.startAngle;
      const count = Math.floor(span * 60);
      for (let d = 0; d < count; d++) {
        const a = zone.startAngle + rng() * span;
        const r = T4_R + (rng() - 0.5) * 12;
        const mi = zone.materials[Math.floor(rng() * zone.materials.length)];
        els.push(
          <circle
            key={`t4-${idx++}`}
            cx={cx + Math.cos(a) * r}
            cy={cy + Math.sin(a) * r}
            r={0.5 + rng() * 1.5}
            fill={MATERIALS[mi].color}
            fillOpacity={0.15 + rng() * 0.3}
          />
        );
      }
    });

    // ── Zone labels on circular arc paths ──
    const R_LABEL = 410;
    const labelDefs: React.ReactNode[] = [];
    const labelTexts: React.ReactNode[] = [];
    zones.forEach((zone, i) => {
      const text = zone.name.toUpperCase();
      // Estimate arc needed for text (roughly 5px per char at font-size 8)
      const charWidth = 5.5;
      const textLen = text.length * charWidth;
      const textArc = textLen / R_LABEL; // radians needed
      const midAngle = (zone.startAngle + zone.endAngle) / 2;

      // Bottom half: text would be upside down on outer path, so use inner path going reverse
      const isBottom = midAngle > Math.PI * 0.15 && midAngle < Math.PI * 0.85;

      if (isBottom) {
        // Draw arc clockwise at a slightly smaller radius, text reads right-side-up on inside
        const R_INNER_LABEL = R_LABEL - 2;
        const arcStart = midAngle + textArc / 2;
        const arcEnd = midAngle - textArc / 2;
        const x1 = cx + Math.cos(arcStart) * R_INNER_LABEL;
        const y1 = cy + Math.sin(arcStart) * R_INNER_LABEL;
        const x2 = cx + Math.cos(arcEnd) * R_INNER_LABEL;
        const y2 = cy + Math.sin(arcEnd) * R_INNER_LABEL;
        labelDefs.push(
          <path
            key={`lp-${i}`}
            id={`labelPath-${i}`}
            d={`M ${x1} ${y1} A ${R_INNER_LABEL} ${R_INNER_LABEL} 0 0 0 ${x2} ${y2}`}
            fill="none"
            stroke="none"
          />
        );
      } else {
        // Top half: text on outer arc, normal direction
        const arcStart = midAngle - textArc / 2;
        const arcEnd = midAngle + textArc / 2;
        const x1 = cx + Math.cos(arcStart) * R_LABEL;
        const y1 = cy + Math.sin(arcStart) * R_LABEL;
        const x2 = cx + Math.cos(arcEnd) * R_LABEL;
        const y2 = cy + Math.sin(arcEnd) * R_LABEL;
        labelDefs.push(
          <path
            key={`lp-${i}`}
            id={`labelPath-${i}`}
            d={`M ${x1} ${y1} A ${R_LABEL} ${R_LABEL} 0 0 1 ${x2} ${y2}`}
            fill="none"
            stroke="none"
          />
        );
      }

      labelTexts.push(
        <text
          key={`label-${i}`}
          fill="#141414"
          fillOpacity={0.5}
          fontSize="8"
          fontFamily="var(--font-satoshi), sans-serif"
          fontWeight="600"
          letterSpacing="0.05em"
        >
          <textPath
            href={`#labelPath-${i}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {text}
          </textPath>
        </text>
      );
    });
    const labelEls = [...labelDefs, ...labelTexts];

    // ── CHORDS: 20x density — many thin lines per connection ──
    const R_CHORD = 345;
    const chordEls: React.ReactNode[] = [];
    for (let i = 0; i < zones.length; i++) {
      for (let j = i + 1; j < zones.length; j++) {
        const shared = zones[i].materials.filter((m) => zones[j].materials.includes(m));
        if (shared.length === 0) continue;

        shared.forEach((matIdx) => {
          // Generate 15-25 thin lines per shared material connection
          const lineCount = 15 + Math.floor(rng() * 12);
          const spanA = zones[i].endAngle - zones[i].startAngle;
          const spanB = zones[j].endAngle - zones[j].startAngle;

          for (let l = 0; l < lineCount; l++) {
            // Random points within each zone's arc span
            const aA = zones[i].startAngle + rng() * spanA;
            const aB = zones[j].startAngle + rng() * spanB;
            const r1 = R_CHORD + (rng() - 0.5) * 6;
            const r2 = R_CHORD + (rng() - 0.5) * 6;
            const x1 = cx + Math.cos(aA) * r1;
            const y1 = cy + Math.sin(aA) * r1;
            const x2 = cx + Math.cos(aB) * r2;
            const y2 = cy + Math.sin(aB) * r2;

            // Control point pulled toward center
            const ctrl = 0.02 + rng() * 0.35;
            const qx = cx + (x1 + x2 - 2 * cx) * ctrl;
            const qy = cy + (y1 + y2 - 2 * cy) * ctrl;

            chordEls.push(
              <path
                key={`ch-${idx++}`}
                d={`M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}`}
                fill="none"
                stroke={MATERIALS[matIdx].color}
                strokeWidth={0.3 + rng() * 0.5}
                strokeOpacity={0.06 + rng() * 0.1}
              />
            );
          }
        });
      }
    }

    // ── Inner scatter particles ──
    const particleEls: React.ReactNode[] = [];
    for (let i = 0; i < 300; i++) {
      const a = rng() * Math.PI * 2;
      const r = 30 + rng() * 310;
      const mi = Math.floor(rng() * 4);
      particleEls.push(
        <circle
          key={`p-${i}`}
          cx={cx + Math.cos(a) * r}
          cy={cy + Math.sin(a) * r}
          r={0.3 + rng() * 1.8}
          fill={MATERIALS[mi].lightColor}
          fillOpacity={0.04 + rng() * 0.1}
        />
      );
    }

    // ── Guide rings ──
    const rings = [R_CHORD, R_CHORD * 0.6, R_CHORD * 0.3].map((r, i) => (
      <circle key={`ring-${i}`} cx={cx} cy={cy} r={r} fill="none" stroke="#141414" strokeWidth="0.3" strokeOpacity="0.04" strokeDasharray={i > 0 ? "2 6" : "none"} />
    ));

    // ── Center ──
    const center = (
      <g>
        <circle cx={cx} cy={cy} r={3} fill="#141414" fillOpacity={0.12} />
        <text x={cx} y={cy - 16} textAnchor="middle" fill="#141414" fillOpacity={0.18} fontSize="8" fontFamily="var(--font-satoshi), sans-serif" fontWeight="500" letterSpacing="0.1em">
          MATERIAL SYSTEM
        </text>
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#141414" fillOpacity={0.1} fontSize="7" fontFamily="var(--font-satoshi), sans-serif" letterSpacing="0.06em">
          4 FINISHES × 15 SURFACES
        </text>
      </g>
    );

    // ── Legend ──
    const legend = (
      <g>
        {MATERIALS.map((mat, i) => (
          <g key={`leg-${i}`}>
            <rect x={20 + i * 145} y={H - 28} width={10} height={10} rx={2} fill={mat.color} fillOpacity={0.7} />
            <text x={34 + i * 145} y={H - 19} fill="#141414" fillOpacity={0.3} fontSize="8" fontFamily="var(--font-satoshi), sans-serif" fontWeight="500" letterSpacing="0.04em">
              {mat.name.toUpperCase()}
            </text>
          </g>
        ))}
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
        {particleEls}
        {els}
        {labelEls}
        {center}
        {legend}
      </>
    );
  }, []);

  return (
    <div className="w-full px-4 md:px-0 py-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-[9px] md:text-[10px] font-medium tracking-[0.1em] text-[#141414]/40 uppercase">
          Material × Surface Interaction
        </span>
        <span className="text-[9px] md:text-[10px] tracking-[0.05em] text-[#141414]/25">
          4 materials · 15 zones · shared connections
        </span>
      </div>
      <div className="w-full overflow-x-auto"
        data-lenis-prevent>
        <div className="min-w-[800px]">
          <svg viewBox="-30 -30 960 960" className="w-full h-auto" style={{ background: "transparent" }}>
            {svgContent}
          </svg>
        </div>
      </div>
    </div>
  );
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
