"use client";

import type { AIHeatmapSection } from "@/lib/types";

// Deterministic pseudo-random from seed
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Portal-inspired color palette per intensity tier — wide hue range
const PALETTES = {
  high: ["#C94545", "#A83232", "#E08080", "#B8566E", "#D95F5F", "#CC6B7A", "#E6A0A0", "#9E2B2B"],  // deep crimsons to dusty pinks
  mid: ["#C4946B", "#D4736B", "#B88B6A", "#CC8888", "#D09878", "#C9A088", "#B07060", "#D4A090"],    // warm rose-tans with pink shifts
  low: ["#C4A878", "#D6C9B0", "#BFAA88", "#C9B898", "#B8A488", "#CDB8A0", "#D2C0A8"],              // golden tans
  minimal: ["#D6C9B0", "#E0D8C8", "#ECE6E1", "#D9D0C0", "#E5DDD0", "#DDD5C8"],                     // muted surface
};

function getPalette(value: number) {
  // Blend adjacent tiers for more color variety
  if (value >= 0.75) return [...PALETTES.high, ...PALETTES.mid.slice(0, 2)];
  if (value >= 0.5) return [...PALETTES.mid, ...PALETTES.high.slice(0, 2), ...PALETTES.low.slice(0, 1)];
  if (value >= 0.3) return [...PALETTES.low, ...PALETTES.mid.slice(0, 1)];
  return PALETTES.minimal;
}

interface Circle {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  opacity: number;
}

function generateCluster(
  x: number, y: number, w: number, h: number,
  value: number, seed: number
): Circle[] {
  const rng = seededRandom(seed);
  const circles: Circle[] = [];

  // Number of circles scales with value — more for high values
  const count = Math.floor(4 + value * 16);
  const palette = getPalette(value);

  // High values (≥0.7) get wider spread so circles bleed outside cell
  const spreadFactor = value >= 0.7 ? 0.55 + (value - 0.7) * 1.5 : 0.35;

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = rng() * Math.PI * 2;
    const dist = rng() * spreadFactor * Math.min(w, h) * (0.3 + value * 0.7);
    const cx = x + w / 2 + Math.cos(angle) * dist + (rng() - 0.5) * w * 0.2;
    const cy = y + h / 2 + Math.sin(angle) * dist + (rng() - 0.5) * h * 0.2;

    // Larger circles with more size variance — some really big, some tiny
    const baseR = 4 + value * 24;
    const r = baseR * (0.15 + rng() * 0.85) * (1 - t * 0.2);

    const fill = palette[Math.floor(rng() * palette.length)];
    const opacity = 0.12 + value * 0.3 + rng() * 0.12;

    circles.push({ cx, cy, r, fill, opacity });
  }

  // High-value scatter — extra circles that explicitly drift outside the cell
  if (value >= 0.7) {
    const scatterCount = Math.floor((value - 0.7) * 15);
    for (let i = 0; i < scatterCount; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = (0.5 + rng() * 0.5) * Math.max(w, h) * 0.5;
      circles.push({
        cx: x + w / 2 + Math.cos(angle) * dist,
        cy: y + h / 2 + Math.sin(angle) * dist,
        r: 3 + rng() * 8,
        fill: palette[Math.floor(rng() * palette.length)],
        opacity: 0.08 + rng() * 0.15,
      });
    }
  }

  // Accent rings for high-value cells
  if (value >= 0.6) {
    const ringCount = Math.floor(1 + value * 3);
    for (let i = 0; i < ringCount; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = rng() * 0.35 * Math.min(w, h) * (value >= 0.7 ? 1.5 : 1);
      circles.push({
        cx: x + w / 2 + Math.cos(angle) * dist,
        cy: y + h / 2 + Math.sin(angle) * dist,
        r: 6 + rng() * 12 * value,
        fill: "none",
        opacity: 0.15 + rng() * 0.12,
      });
    }
  }

  return circles;
}

export function AIHeatmap({
  competitors,
  categories,
  data,
}: AIHeatmapSection) {
  const cellW = 108;
  const cellH = 68;
  const labelW = 140;
  const headerH = 50;
  const rowGap = 8;
  const colGap = 6;

  const totalW = labelW + categories.length * (cellW + colGap) - colGap;
  const totalH = headerH + competitors.length * (cellH + rowGap) - rowGap + 40;

  return (
    <div className="overflow-x-auto scrollbar-hide"
        data-lenis-prevent>
      <div className="relative overflow-hidden"
        style={{ minWidth: 800, background: "#F3F0ED", borderRadius: "clamp(20px,3vw,40px)", padding: "30px 20px 16px" }}>

        <svg
          viewBox={`0 0 ${totalW} ${totalH}`}
          width="100%"
          style={{ fontFamily: "'Satoshi', system-ui, sans-serif" }}
        >
          {/* Column headers */}
          {categories.map((cat, ci) => (
            <text
              key={cat}
              x={labelW + ci * (cellW + colGap) + cellW / 2}
              y={20}
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="600"
              fill="#8C8578"
              letterSpacing="0.1em"
            >
              {cat.toUpperCase()}
            </text>
          ))}

          {/* Thin header line */}
          <line x1={labelW} y1={headerH - 12} x2={totalW} y2={headerH - 12}
            stroke="#D6C9B0" strokeWidth="0.5" opacity={0.5} />

          {/* Rows */}
          {competitors.map((comp, ri) => {
            const rowY = headerH + ri * (cellH + rowGap);

            return (
              <g key={comp}>
                {/* Row label */}
                <text
                  x={4}
                  y={rowY + cellH / 2 + 4}
                  fontSize="11"
                  fontWeight="600"
                  fill="#1A1A1A"
                >
                  {comp}
                </text>

                {/* Cells as circle clusters */}
                {categories.map((_, ci) => {
                  const val = data[ri][ci];
                  const x = labelW + ci * (cellW + colGap);
                  const seed = ri * 1000 + ci * 100 + 42;
                  const circles = generateCluster(x, rowY, cellW, cellH, val, seed);

                  const shouldBleed = val >= 0.7;

                  return (
                    <g key={ci}>
                      {/* Clip only low-value cells; high values bleed freely */}
                      {!shouldBleed && (
                        <clipPath id={`cell-${ri}-${ci}`}>
                          <rect x={x} y={rowY} width={cellW} height={cellH} rx={12} />
                        </clipPath>
                      )}

                      <g clipPath={shouldBleed ? undefined : `url(#cell-${ri}-${ci})`}>
                        {circles.map((c, k) =>
                          c.fill === "none" ? (
                            <circle key={k} cx={c.cx} cy={c.cy} r={c.r}
                              fill="none" stroke={getPalette(val)[0]}
                              strokeWidth="1" opacity={c.opacity} />
                          ) : (
                            <circle key={k} cx={c.cx} cy={c.cy} r={c.r}
                              fill={c.fill} opacity={c.opacity} />
                          )
                        )}
                      </g>

                      {/* Value label */}
                      <text
                        x={x + cellW / 2}
                        y={rowY + cellH / 2 + 4}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="#1A1A1A"
                        opacity={0.45}
                      >
                        {Math.round(val * 100)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Footer */}
          <text
            x={totalW / 2} y={totalH - 6}
            textAnchor="middle" fontSize="7.5" fontWeight="500"
            fill="#8C8578" letterSpacing="0.1em" opacity={0.5}
          >
            COMPETITIVE ACTIVITY INDEX — relative signal intensity across monitoring categories
          </text>
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-end gap-4 mt-2 pr-2">
          <span className="text-[8px] text-foreground/40 tracking-widest font-medium">SIGNAL DENSITY</span>
          <div className="flex gap-1 items-center">
            {[0.1, 0.3, 0.5, 0.75, 0.9].map((v, i) => {
              const palette = getPalette(v);
              return (
                <svg key={i} width="20" height="20" viewBox="0 0 20 20">
                  {[...Array(2 + Math.floor(v * 4))].map((_, j) => (
                    <circle key={j}
                      cx={10 + (j % 2) * 3 - 1.5}
                      cy={10 + Math.floor(j / 2) * 3 - 1.5}
                      r={2 + v * 3}
                      fill={palette[j % palette.length]}
                      opacity={0.3 + v * 0.3}
                    />
                  ))}
                </svg>
              );
            })}
          </div>
          <div className="flex gap-3 text-[8px] text-foreground/40">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
