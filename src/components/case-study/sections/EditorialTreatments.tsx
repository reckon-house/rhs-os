"use client";

import { useMemo } from "react";

/**
 * EditorialTreatments — Scatter map plotting every InSite story
 * by typographic intensity vs color saturation. Shows the full
 * editorial range across one content system.
 */

type Category = "designer" | "color" | "theatrical" | "minimal" | "ways";

interface Story {
  name: string;
  category: Category;
  typeIntensity: number; // 0 = restrained, 1 = theatrical
  colorSaturation: number; // 0 = monochrome, 1 = saturated
}

const CATEGORIES: Record<Category, { label: string; color: string }> = {
  designer: { label: "Designer Spotlight", color: "#6B4A2E" },
  color: { label: "Color Story", color: "#C85A3A" },
  theatrical: { label: "Theatrical Type", color: "#8B2E3A" },
  minimal: { label: "Minimalism", color: "#7E766E" },
  ways: { label: "Ways to Wear", color: "#3A4A5E" },
};

const STORIES: Story[] = [
  // Designer spotlights — medium type intensity, medium color
  { name: "Theyskens' Theory", category: "designer", typeIntensity: 0.55, colorSaturation: 0.28 },
  { name: "Rag & Bone", category: "designer", typeIntensity: 0.52, colorSaturation: 0.48 },
  { name: "Derek Lam", category: "designer", typeIntensity: 0.58, colorSaturation: 0.35 },
  { name: "Helmut Lang", category: "designer", typeIntensity: 0.62, colorSaturation: 0.18 },
  { name: "Kelly Wearstler", category: "designer", typeIntensity: 0.60, colorSaturation: 0.55 },

  // Color stories — lower type, high color
  { name: "Hot Pink", category: "color", typeIntensity: 0.42, colorSaturation: 0.95 },
  { name: "Yellow", category: "color", typeIntensity: 0.45, colorSaturation: 0.88 },
  { name: "Orange", category: "color", typeIntensity: 0.48, colorSaturation: 0.85 },
  { name: "Coral", category: "color", typeIntensity: 0.38, colorSaturation: 0.80 },
  { name: "Rainbow", category: "color", typeIntensity: 0.50, colorSaturation: 0.98 },

  // Theatrical — high type, varying color
  { name: "The Rocker", category: "theatrical", typeIntensity: 0.92, colorSaturation: 0.20 },
  { name: "The Socialite", category: "theatrical", typeIntensity: 0.85, colorSaturation: 0.70 },
  { name: "Classic Beauty", category: "theatrical", typeIntensity: 0.88, colorSaturation: 0.15 },
  { name: "Flora Maxi", category: "theatrical", typeIntensity: 0.78, colorSaturation: 0.45 },

  // Minimalism — low type, low color
  { name: "Minimalism", category: "minimal", typeIntensity: 0.18, colorSaturation: 0.15 },
  { name: "Structure", category: "minimal", typeIntensity: 0.22, colorSaturation: 0.08 },

  // Ways to Wear — consistent low-mid type, low color
  { name: "Black Dress + Ikat", category: "ways", typeIntensity: 0.30, colorSaturation: 0.35 },
  { name: "Black Dress + Denim", category: "ways", typeIntensity: 0.28, colorSaturation: 0.22 },
  { name: "Silk Blouse + Ikat", category: "ways", typeIntensity: 0.32, colorSaturation: 0.40 },
  { name: "Silk Blouse + Denim", category: "ways", typeIntensity: 0.28, colorSaturation: 0.25 },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function EditorialTreatments() {
  const { content } = useMemo(() => {
    const rng = seededRandom(1875);
    const W = 900;
    const H = 700;
    const PAD_L = 80;
    const PAD_R = 40;
    const PAD_T = 40;
    const PAD_B = 80;
    const plotW = W - PAD_L - PAD_R;
    const plotH = H - PAD_T - PAD_B;

    const toX = (v: number) => PAD_L + v * plotW;
    const toY = (v: number) => PAD_T + (1 - v) * plotH; // invert so higher = up

    const els: React.ReactNode[] = [];
    let idx = 0;

    // ── Background grid ──
    for (let i = 0; i < 11; i++) {
      const pos = (i + 1) * (W / 12);
      els.push(
        <g key={`grid-${i}`}>
          <line x1={pos} y1={0} x2={pos} y2={H} stroke="#141414" strokeWidth={0.3} strokeOpacity={0.05} />
        </g>
      );
    }
    for (let i = 0; i < 9; i++) {
      const pos = (i + 1) * (H / 10);
      els.push(
        <line key={`gridh-${i}`} x1={0} y1={pos} x2={W} y2={pos} stroke="#141414" strokeWidth={0.3} strokeOpacity={0.05} />
      );
    }

    // ── Plot axes ──
    els.push(
      <line key="x-axis" x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="#141414" strokeWidth={0.8} strokeOpacity={0.3} />,
      <line key="y-axis" x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="#141414" strokeWidth={0.8} strokeOpacity={0.3} />,
    );

    // ── Plot grid lines (quintile markers) ──
    for (let i = 1; i < 5; i++) {
      const frac = i / 5;
      els.push(
        <line key={`px-${i}`} x1={toX(frac)} y1={PAD_T} x2={toX(frac)} y2={H - PAD_B} stroke="#141414" strokeWidth={0.3} strokeOpacity={0.1} strokeDasharray="2 4" />,
        <line key={`py-${i}`} x1={PAD_L} y1={toY(frac)} x2={W - PAD_R} y2={toY(frac)} stroke="#141414" strokeWidth={0.3} strokeOpacity={0.1} strokeDasharray="2 4" />,
      );
    }

    // ── Axis labels ──
    els.push(
      // X axis
      <text key="xl-0" x={PAD_L} y={H - PAD_B + 22} fill="#141414" fillOpacity={0.4} fontSize="8" fontFamily="var(--font-satoshi), sans-serif" fontWeight="600" letterSpacing="0.06em">RESTRAINED</text>,
      <text key="xl-1" x={W - PAD_R} y={H - PAD_B + 22} textAnchor="end" fill="#141414" fillOpacity={0.4} fontSize="8" fontFamily="var(--font-satoshi), sans-serif" fontWeight="600" letterSpacing="0.06em">THEATRICAL</text>,
      <text key="xl-mid" x={W / 2} y={H - PAD_B + 42} textAnchor="middle" fill="#141414" fillOpacity={0.3} fontSize="7" fontFamily="var(--font-satoshi), sans-serif" letterSpacing="0.1em">TYPOGRAPHIC INTENSITY →</text>,
      // Y axis
      <text key="yl-0" x={PAD_L - 10} y={H - PAD_B} textAnchor="end" fill="#141414" fillOpacity={0.4} fontSize="8" fontFamily="var(--font-satoshi), sans-serif" fontWeight="600" letterSpacing="0.06em">MONOCHROME</text>,
      <text key="yl-1" x={PAD_L - 10} y={PAD_T + 6} textAnchor="end" fill="#141414" fillOpacity={0.4} fontSize="8" fontFamily="var(--font-satoshi), sans-serif" fontWeight="600" letterSpacing="0.06em">SATURATED</text>,
      <text key="yl-mid" transform={`rotate(-90 30 ${H / 2})`} x={30} y={H / 2} textAnchor="middle" fill="#141414" fillOpacity={0.3} fontSize="7" fontFamily="var(--font-satoshi), sans-serif" letterSpacing="0.1em">COLOR SATURATION →</text>,
    );

    // ── Quadrant connector lines (link stories within the same category) ──
    Object.keys(CATEGORIES).forEach((cat) => {
      const catStories = STORIES.filter((s) => s.category === cat);
      const cx = catStories.reduce((sum, s) => sum + toX(s.typeIntensity), 0) / catStories.length;
      const cy = catStories.reduce((sum, s) => sum + toY(s.colorSaturation), 0) / catStories.length;
      catStories.forEach((s) => {
        els.push(
          <line
            key={`link-${idx++}`}
            x1={cx} y1={cy}
            x2={toX(s.typeIntensity)} y2={toY(s.colorSaturation)}
            stroke={CATEGORIES[cat as Category].color}
            strokeWidth={0.4}
            strokeOpacity={0.15}
          />
        );
      });
      // Centroid marker
      els.push(
        <circle key={`centroid-${cat}`} cx={cx} cy={cy} r={4} fill={CATEGORIES[cat as Category].color} fillOpacity={0.12} />
      );
    });

    // ── Scatter particles around story points ──
    STORIES.forEach((s, si) => {
      const cx = toX(s.typeIntensity);
      const cy = toY(s.colorSaturation);
      const color = CATEGORIES[s.category].color;
      for (let k = 0; k < 8; k++) {
        const offset = 15 + rng() * 40;
        const angle = rng() * Math.PI * 2;
        els.push(
          <circle
            key={`particle-${si}-${k}`}
            cx={cx + Math.cos(angle) * offset}
            cy={cy + Math.sin(angle) * offset}
            r={0.5 + rng() * 1.5}
            fill={color}
            fillOpacity={0.15 + rng() * 0.15}
          />
        );
      }
    });

    // ── Story points ──
    STORIES.forEach((s, si) => {
      const cx = toX(s.typeIntensity);
      const cy = toY(s.colorSaturation);
      const color = CATEGORIES[s.category].color;

      // Halo
      els.push(
        <circle key={`halo-${si}`} cx={cx} cy={cy} r={10} fill={color} fillOpacity={0.12} />
      );
      // Main dot
      els.push(
        <circle key={`dot-${si}`} cx={cx} cy={cy} r={5} fill={color} fillOpacity={0.85} />
      );

      // Label (offset to avoid overlap)
      const labelDx = s.typeIntensity > 0.7 ? -10 : 10;
      const labelAnchor = s.typeIntensity > 0.7 ? "end" : "start";
      els.push(
        <text
          key={`label-${si}`}
          x={cx + labelDx}
          y={cy + 3}
          textAnchor={labelAnchor}
          fill="#141414"
          fillOpacity={0.6}
          fontSize="8.5"
          fontFamily="var(--font-satoshi), sans-serif"
          fontWeight="500"
          letterSpacing="0.02em"
        >
          {s.name}
        </text>
      );
    });

    // ── Legend ──
    const legend: React.ReactNode[] = [];
    Object.entries(CATEGORIES).forEach(([cat, info], i) => {
      legend.push(
        <g key={`leg-${i}`}>
          <circle cx={20} cy={PAD_T + 10 + i * 16} r={4} fill={info.color} fillOpacity={0.8} />
          <text
            x={30}
            y={PAD_T + 13 + i * 16}
            fill="#141414"
            fillOpacity={0.5}
            fontSize="8"
            fontFamily="var(--font-satoshi), sans-serif"
            fontWeight="600"
            letterSpacing="0.04em"
          >
            {info.label.toUpperCase()}
          </text>
        </g>
      );
    });

    return { content: [...els, ...legend] };
  }, []);

  return (
    <div className="w-full px-4 md:px-0 py-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-[9px] md:text-[10px] font-medium tracking-[0.1em] text-[#141414]/40 uppercase">
          Editorial Treatment Map
        </span>
        <span className="text-[9px] md:text-[10px] tracking-[0.05em] text-[#141414]/25">
          20 stories · 5 categories · typographic vs color intensity
        </span>
      </div>
      <div className="w-full overflow-x-auto" data-lenis-prevent-touch>
        <div className="min-w-[800px]">
          <svg viewBox="0 0 900 700" className="w-full h-auto" style={{ background: "transparent" }}>
            {content}
          </svg>
        </div>
      </div>
    </div>
  );
}
