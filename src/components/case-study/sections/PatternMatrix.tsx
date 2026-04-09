"use client";

import { useMemo } from "react";

/**
 * PatternMatrix — A constraint-map visualization for the Black & White Type case study.
 *
 * Shows 6 base patterns × 2 polarities (positive/negative) = 12 tiles,
 * mapped against 3 posters to show which patterns appear in each composition.
 * Dense, data-visualization aesthetic. Black & white only.
 */

/* ── Pattern definitions ── */
const PATTERNS = [
  { name: "Dots (dense)", id: "dots-dense" },
  { name: "Dots (open)", id: "dots-open" },
  { name: "Lines (vertical)", id: "lines-vert" },
  { name: "Lines (horizontal)", id: "lines-horiz" },
  { name: "Stripes (diagonal)", id: "stripes-diag" },
  { name: "Diamonds", id: "diamonds" },
];

const POSTERS = [
  { name: "the Fancy", id: "fancy" },
  { name: "stepper", id: "stepper" },
  { name: "white", id: "white" },
];

/* Which patterns appear in each poster (mapped by index into PATTERNS) */
const USAGE: Record<string, number[]> = {
  fancy:   [0, 1, 2, 3, 4, 5],  // uses all 6
  stepper: [0, 1, 2, 3, 4, 5],  // uses all 6
  white:   [0, 1, 2, 3, 4, 5],  // uses all 6
};

/* Visual density per pattern per poster (0-1), representing prominence */
const DENSITY: Record<string, number[]> = {
  fancy:   [0.9, 0.4, 0.5, 0.7, 0.6, 0.3],
  stepper: [0.7, 0.8, 0.3, 0.9, 0.8, 0.5],
  white:   [0.3, 0.6, 0.7, 0.4, 0.2, 0.9],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function PatternMatrix() {
  const { dots, connections, patternTiles } = useMemo(() => {
    const rng = seededRandom(42);
    const W = 900;
    const H = 700;
    const cx = W / 2;
    const cy = H / 2;

    // ── Generate pattern tile SVG defs ──
    const tiles: React.ReactNode[] = [];

    // Dots dense
    tiles.push(
      <pattern key="pat-dots-dense" id="pat-dots-dense" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#000" />
        <circle cx="4" cy="4" r="1.5" fill="#fff" />
      </pattern>
    );
    // Dots open
    tiles.push(
      <pattern key="pat-dots-open" id="pat-dots-open" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#fff" />
        <circle cx="8" cy="8" r="2" fill="#000" />
      </pattern>
    );
    // Lines vertical
    tiles.push(
      <pattern key="pat-lines-vert" id="pat-lines-vert" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#fff" />
        <line x1="3" y1="0" x2="3" y2="6" stroke="#000" strokeWidth="0.8" />
      </pattern>
    );
    // Lines horizontal
    tiles.push(
      <pattern key="pat-lines-horiz" id="pat-lines-horiz" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#000" />
        <line x1="0" y1="2" x2="6" y2="2" stroke="#fff" strokeWidth="0.5" />
        <line x1="0" y1="4" x2="6" y2="4" stroke="#fff" strokeWidth="0.5" />
      </pattern>
    );
    // Stripes diagonal
    tiles.push(
      <pattern key="pat-stripes-diag" id="pat-stripes-diag" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="8" height="8" fill="#000" />
        <line x1="0" y1="0" x2="0" y2="8" stroke="#fff" strokeWidth="2" />
      </pattern>
    );
    // Diamonds
    tiles.push(
      <pattern key="pat-diamonds" id="pat-diamonds" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#000" />
        <polygon points="6,1 11,6 6,11 1,6" fill="#fff" />
      </pattern>
    );

    const patternIds = ["pat-dots-dense", "pat-dots-open", "pat-lines-vert", "pat-lines-horiz", "pat-stripes-diag", "pat-diamonds"];

    // ── Layout: 6 pattern nodes in a ring, 3 poster nodes in inner triangle ──
    const patternNodes: { x: number; y: number; idx: number }[] = [];
    const R_OUTER = 260;
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      patternNodes.push({
        x: cx + Math.cos(angle) * R_OUTER,
        y: cy + Math.sin(angle) * R_OUTER,
        idx: i,
      });
    }

    const posterNodes: { x: number; y: number; name: string; id: string }[] = [];
    const R_INNER = 100;
    for (let i = 0; i < 3; i++) {
      const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2;
      posterNodes.push({
        x: cx + Math.cos(angle) * R_INNER,
        y: cy + Math.sin(angle) * R_INNER,
        name: POSTERS[i].name,
        id: POSTERS[i].id,
      });
    }

    // ── Connection lines from posters to patterns ──
    const conns: React.ReactNode[] = [];
    posterNodes.forEach((poster, pi) => {
      const usage = USAGE[poster.id];
      const density = DENSITY[poster.id];
      usage.forEach((patIdx) => {
        const pat = patternNodes[patIdx];
        const d = density[patIdx];
        conns.push(
          <line
            key={`conn-${pi}-${patIdx}`}
            x1={poster.x}
            y1={poster.y}
            x2={pat.x}
            y2={pat.y}
            stroke="#fff"
            strokeWidth={d * 2.5 + 0.5}
            strokeOpacity={d * 0.4 + 0.05}
          />
        );
      });
    });

    // ── Scatter particles along connections ──
    const particleDots: React.ReactNode[] = [];
    let dotIdx = 0;
    posterNodes.forEach((poster, pi) => {
      const density = DENSITY[poster.id];
      patternNodes.forEach((pat, patIdx) => {
        const d = density[patIdx];
        const count = Math.floor(d * 12) + 2;
        for (let k = 0; k < count; k++) {
          const t = rng() * 0.8 + 0.1;
          const x = poster.x + (pat.x - poster.x) * t + (rng() - 0.5) * 20;
          const y = poster.y + (pat.y - poster.y) * t + (rng() - 0.5) * 20;
          const r = rng() * 1.8 + 0.4;
          particleDots.push(
            <circle
              key={`dot-${dotIdx++}`}
              cx={x}
              cy={y}
              r={r}
              fill="#fff"
              fillOpacity={rng() * 0.3 + 0.1}
            />
          );
        }
      });
    });

    // ── Orbital ring particles ──
    const orbitDots: React.ReactNode[] = [];
    for (let i = 0; i < 120; i++) {
      const angle = rng() * Math.PI * 2;
      const r = R_OUTER + (rng() - 0.5) * 40;
      orbitDots.push(
        <circle
          key={`orbit-${i}`}
          cx={cx + Math.cos(angle) * r}
          cy={cy + Math.sin(angle) * r}
          r={rng() * 1.2 + 0.3}
          fill="#fff"
          fillOpacity={rng() * 0.2 + 0.05}
        />
      );
    }

    // Inner ring particles
    for (let i = 0; i < 60; i++) {
      const angle = rng() * Math.PI * 2;
      const r = R_INNER + (rng() - 0.5) * 30;
      orbitDots.push(
        <circle
          key={`inner-orbit-${i}`}
          cx={cx + Math.cos(angle) * r}
          cy={cy + Math.sin(angle) * r}
          r={rng() * 0.8 + 0.3}
          fill="#fff"
          fillOpacity={rng() * 0.15 + 0.05}
        />
      );
    }

    // ── Pattern node circles with actual pattern fills ──
    const pNodes = patternNodes.map((node, i) => (
      <g key={`pnode-${i}`}>
        {/* Glow ring */}
        <circle cx={node.x} cy={node.y} r={38} fill="none" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.15" />
        {/* Pattern-filled circle */}
        <circle cx={node.x} cy={node.y} r={32} fill={`url(#${patternIds[i]})`} stroke="#fff" strokeWidth="1" strokeOpacity="0.4" />
        {/* Label */}
        <text
          x={node.x}
          y={node.y + 48}
          textAnchor="middle"
          fill="#fff"
          fillOpacity="0.6"
          fontSize="9"
          fontFamily="var(--font-satoshi), sans-serif"
          fontWeight="500"
          letterSpacing="0.05em"
        >
          {PATTERNS[i].name.toUpperCase()}
        </text>
      </g>
    ));

    // ── Poster node labels ──
    const posterLabels = posterNodes.map((node, i) => (
      <g key={`poster-${i}`}>
        <circle cx={node.x} cy={node.y} r={6} fill="#fff" fillOpacity="0.9" />
        <text
          x={node.x}
          y={node.y - 14}
          textAnchor="middle"
          fill="#fff"
          fillOpacity="0.8"
          fontSize="11"
          fontFamily="var(--font-satoshi), sans-serif"
          fontWeight="700"
          letterSpacing="0.02em"
        >
          {node.name}
        </text>
      </g>
    ));

    // ── Center label ──
    const centerLabel = (
      <g>
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fill="#fff"
          fillOpacity="0.25"
          fontSize="8"
          fontFamily="var(--font-satoshi), sans-serif"
          fontWeight="500"
          letterSpacing="0.1em"
        >
          PATTERN LIBRARY
        </text>
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          fill="#fff"
          fillOpacity="0.15"
          fontSize="7"
          fontFamily="var(--font-satoshi), sans-serif"
          letterSpacing="0.08em"
        >
          6 ELEMENTS × 3 COMPOSITIONS
        </text>
      </g>
    );

    // ── Concentric guide rings ──
    const rings = [R_INNER, (R_INNER + R_OUTER) / 2, R_OUTER].map((r, i) => (
      <circle
        key={`ring-${i}`}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#fff"
        strokeWidth="0.4"
        strokeOpacity="0.06"
        strokeDasharray={i === 1 ? "2 4" : "none"}
      />
    ));

    // ── Density legend ──
    const legend = (
      <g>
        <text x={20} y={H - 30} fill="#fff" fillOpacity="0.3" fontSize="8" fontFamily="var(--font-satoshi), sans-serif" letterSpacing="0.08em">
          LINE WEIGHT = VISUAL PROMINENCE
        </text>
        {[0.2, 0.5, 0.8].map((d, i) => (
          <g key={`leg-${i}`}>
            <line x1={20 + i * 60} y1={H - 18} x2={50 + i * 60} y2={H - 18} stroke="#fff" strokeWidth={d * 2.5 + 0.5} strokeOpacity={d * 0.4 + 0.1} />
            <text x={55 + i * 60} y={H - 14} fill="#fff" fillOpacity="0.25" fontSize="7" fontFamily="var(--font-satoshi), sans-serif">
              {["LOW", "MED", "HIGH"][i]}
            </text>
          </g>
        ))}
      </g>
    );

    return {
      dots: [...particleDots, ...orbitDots],
      connections: conns,
      patternTiles: { tiles, pNodes, posterLabels, centerLabel, rings, legend },
    };
  }, []);

  return (
    <div className="w-full px-4 md:px-0 py-8">
      {/* Title bar */}
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-[9px] md:text-[10px] font-medium tracking-[0.1em] text-white/40 uppercase">
          Pattern × Composition Matrix
        </span>
        <span className="text-[9px] md:text-[10px] tracking-[0.05em] text-white/25">
          6 patterns · 2 polarities · 3 posters
        </span>
      </div>

      {/* Chart container */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <svg
            viewBox="0 0 900 700"
            className="w-full h-auto"
            style={{ background: "transparent" }}
          >
            <defs>
              {patternTiles.tiles}
            </defs>

            {/* Guide rings */}
            {patternTiles.rings}

            {/* Connections */}
            {connections}

            {/* Scatter particles */}
            {dots}

            {/* Pattern nodes */}
            {patternTiles.pNodes}

            {/* Poster labels */}
            {patternTiles.posterLabels}

            {/* Center label */}
            {patternTiles.centerLabel}

            {/* Legend */}
            {patternTiles.legend}
          </svg>
        </div>
      </div>
    </div>
  );
}
