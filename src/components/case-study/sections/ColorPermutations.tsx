"use client";

import { useMemo } from "react";

/**
 * ColorPermutations — Grid of four-circle logo permutations
 * showing every unique color arrangement from the J. Christianson palette.
 * Demonstrates the mathematical flexibility built into a simple mark.
 */

const PALETTE = [
  { name: "Brown", hex: "#5C4A2A" },
  { name: "Olive", hex: "#8B9A3B" },
  { name: "Yellow", hex: "#E8C840" },
  { name: "Orange", hex: "#D4883A" },
  { name: "Rust", hex: "#C85A3A" },
  { name: "Teal", hex: "#6BA5A0" },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// Generate unique 4-color combos where one color dominates (like the real logo)
function generateCombos(): number[][] {
  const combos: number[][] = [];

  // Pattern 1: One dominant color fills 3 positions, accent in 1
  for (let dom = 0; dom < PALETTE.length; dom++) {
    for (let acc = 0; acc < PALETTE.length; acc++) {
      if (acc === dom) continue;
      // Accent in each of the 4 positions
      for (let pos = 0; pos < 4; pos++) {
        const combo = [dom, dom, dom, dom];
        combo[pos] = acc;
        combos.push(combo);
      }
    }
  }

  // Pattern 2: One dominant fills 2, two different accents
  for (let dom = 0; dom < PALETTE.length; dom++) {
    for (let a1 = 0; a1 < PALETTE.length; a1++) {
      if (a1 === dom) continue;
      for (let a2 = a1 + 1; a2 < PALETTE.length; a2++) {
        if (a2 === dom) continue;
        combos.push([dom, dom, a1, a2]);
        combos.push([dom, a1, dom, a2]);
        combos.push([a1, dom, a2, dom]);
      }
    }
  }

  // Pattern 3: All four different
  for (let a = 0; a < PALETTE.length; a++) {
    for (let b = a + 1; b < PALETTE.length; b++) {
      for (let c = b + 1; c < PALETTE.length; c++) {
        for (let d = c + 1; d < PALETTE.length; d++) {
          combos.push([a, b, c, d]);
        }
      }
    }
  }

  return combos;
}

function MiniLogo({ colors, size, x, y }: { colors: number[]; size: number; x: number; y: number }) {
  const r = size * 0.38;
  const gap = size * 0.52;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const positions = [
    [cx - gap / 2, cy - gap / 2],
    [cx + gap / 2, cy - gap / 2],
    [cx - gap / 2, cy + gap / 2],
    [cx + gap / 2, cy + gap / 2],
  ];

  return (
    <>
      {positions.map(([px, py], i) => (
        <circle
          key={i}
          cx={px}
          cy={py}
          r={r}
          fill={PALETTE[colors[i]].hex}
          fillOpacity={0.85}
        />
      ))}
    </>
  );
}

export function ColorPermutations() {
  const { logos, gridLines, labels, particles } = useMemo(() => {
    const rng = seededRandom(55);
    const allCombos = generateCombos();

    // Shuffle and take a grid-friendly count
    const shuffled = allCombos.sort(() => rng() - 0.5);
    const COLS = 14;
    const ROWS = 10;
    const count = COLS * ROWS;
    const selected = shuffled.slice(0, count);

    const W = 900;
    const H = 660;
    const MARGIN_X = 30;
    const MARGIN_Y = 30;
    const cellW = (W - MARGIN_X * 2) / COLS;
    const cellH = (H - MARGIN_Y * 2) / ROWS;
    const logoSize = Math.min(cellW, cellH) * 0.75;

    // Background grid
    const grid: React.ReactNode[] = [];
    for (let i = 0; i <= COLS; i++) {
      const x = MARGIN_X + i * cellW;
      grid.push(
        <line key={`gv-${i}`} x1={x} y1={MARGIN_Y} x2={x} y2={H - MARGIN_Y} stroke="#141414" strokeWidth={0.3} strokeOpacity={0.06} />
      );
    }
    for (let i = 0; i <= ROWS; i++) {
      const y = MARGIN_Y + i * cellH;
      grid.push(
        <line key={`gh-${i}`} x1={MARGIN_X} y1={y} x2={W - MARGIN_X} y2={y} stroke="#141414" strokeWidth={0.3} strokeOpacity={0.06} />
      );
    }

    // Logos
    const logoEls: React.ReactNode[] = selected.map((combo, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = MARGIN_X + col * cellW + (cellW - logoSize) / 2;
      const y = MARGIN_Y + row * cellH + (cellH - logoSize) / 2;
      return <MiniLogo key={`logo-${i}`} colors={combo} size={logoSize} x={x} y={y} />;
    });

    // Subtle connection lines between adjacent logos that share a color
    const connLines: React.ReactNode[] = [];
    let ci = 0;
    for (let i = 0; i < selected.length; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const cx1 = MARGIN_X + col * cellW + cellW / 2;
      const cy1 = MARGIN_Y + row * cellH + cellH / 2;

      // Check right neighbor
      if (col < COLS - 1 && i + 1 < selected.length) {
        const shared = selected[i].filter(c => selected[i + 1].includes(c));
        if (shared.length > 0) {
          const cx2 = cx1 + cellW;
          connLines.push(
            <line key={`cl-${ci++}`} x1={cx1} y1={cy1} x2={cx2} y2={cy1} stroke={PALETTE[shared[0]].hex} strokeWidth={0.4} strokeOpacity={0.08} />
          );
        }
      }
      // Check bottom neighbor
      if (row < ROWS - 1 && i + COLS < selected.length) {
        const shared = selected[i].filter(c => selected[i + COLS].includes(c));
        if (shared.length > 0) {
          const cy2 = cy1 + cellH;
          connLines.push(
            <line key={`cl-${ci++}`} x1={cx1} y1={cy1} x2={cx1} y2={cy2} stroke={PALETTE[shared[0]].hex} strokeWidth={0.4} strokeOpacity={0.08} />
          );
        }
      }
    }

    // Scatter particles
    const parts: React.ReactNode[] = [];
    for (let i = 0; i < 150; i++) {
      const x = MARGIN_X + rng() * (W - MARGIN_X * 2);
      const y = MARGIN_Y + rng() * (H - MARGIN_Y * 2);
      const color = PALETTE[Math.floor(rng() * PALETTE.length)].hex;
      parts.push(
        <circle key={`p-${i}`} cx={x} cy={y} r={0.5 + rng() * 1.5} fill={color} fillOpacity={0.04 + rng() * 0.06} />
      );
    }

    // Palette legend
    const legendEls: React.ReactNode[] = PALETTE.map((c, i) => (
      <g key={`leg-${i}`}>
        <circle cx={20 + i * 85} cy={H + 20} r={5} fill={c.hex} fillOpacity={0.7} />
        <text x={30 + i * 85} y={H + 24} fill="#141414" fillOpacity={0.3} fontSize="7.5" fontFamily="var(--font-satoshi), sans-serif" fontWeight="500" letterSpacing="0.04em">
          {c.name.toUpperCase()}
        </text>
      </g>
    ));

    return { logos: logoEls, gridLines: [...grid, ...connLines], labels: legendEls, particles: parts };
  }, []);

  return (
    <div className="w-full px-4 md:px-0 py-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-[9px] md:text-[10px] font-medium tracking-[0.1em] text-[#141414]/40 uppercase">
          Logo Color Permutations
        </span>
        <span className="text-[9px] md:text-[10px] tracking-[0.05em] text-[#141414]/25">
          4 positions · 6 colors · 140 arrangements
        </span>
      </div>
      <div className="w-full overflow-x-auto" data-lenis-prevent-touch>
        <div className="min-w-[800px]">
          <svg viewBox="0 0 900 700" className="w-full h-auto" style={{ background: "transparent" }}>
            {gridLines}
            {particles}
            {logos}
            {labels}
          </svg>
        </div>
      </div>
    </div>
  );
}
