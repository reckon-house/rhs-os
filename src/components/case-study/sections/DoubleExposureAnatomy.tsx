"use client";

import { useMemo } from "react";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const PALETTE = [
  "#FF5C38", "#FF91AC", "#FF7B5C", "#FFB088", "#E8456B",
  "#FF6B4A", "#FFA07A", "#D4534B", "#FFCBA4", "#CC4455",
];

const LAYERS = [
  { id: "gradient", label: "MESH GRADIENT", sub: "Background Layer", color: "#FF91AC",
    depthColors: ["#FFE4C4", "#FFCBA4", "#FFB088", "#FF91AC", "#FF91AC"] },
  { id: "wide", label: "WIDE SHOT", sub: "Base Frame", color: "#FF5C38",
    depthColors: ["#FFB088", "#FFA07A", "#FF7B5C", "#FF5C38", "#D4534B"] },
  { id: "close", label: "CLOSE-UP", sub: "Overlay Frame", color: "#E8456B",
    depthColors: ["#FF91AC", "#FF7B5C", "#E8456B", "#D4534B", "#CC4455"] },
  { id: "blend", label: "COMPOSITE", sub: "Final Output", color: "#D4534B",
    depthColors: ["#FFA07A", "#FF6B4A", "#E8456B", "#D4534B", "#9B3030"] },
];

const BLEND_MODES = [
  { label: "Screen", value: 0.7 },
  { label: "Multiply", value: 0.5 },
  { label: "Soft Light", value: 0.85 },
  { label: "Color Dodge", value: 0.6 },
  { label: "Overlay", value: 0.9 },
  { label: "Normal", value: 0.4 },
];

// Generate meaningful waveform data per layer type
function generateGradientWave(seed: number, steps: number) {
  // Mesh gradient: smooth, low frequency — even color field with gentle undulation
  const rng = seededRandom(seed);
  const points: number[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    // Smooth sine waves — calm, even
    const base = 0.3 + Math.sin(t * Math.PI * 2) * 0.1 + Math.sin(t * Math.PI * 5) * 0.05;
    const noise = (rng() - 0.5) * 0.04;
    points.push(Math.max(0.05, Math.min(0.6, base + noise)));
  }
  return points;
}

function generateWideShot(seed: number, steps: number) {
  // Wide shot: medium structure — represents tonal range across the full body
  const rng = seededRandom(seed);
  const points: number[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    // Body silhouette — peaks in center thirds where the figure is
    const figureLeft = Math.exp(-Math.pow((t - 0.3) * 5, 2)) * 0.5;
    const figureRight = Math.exp(-Math.pow((t - 0.7) * 6, 2)) * 0.4;
    const base = 0.1 + figureLeft + figureRight;
    // Tonal spikes from clothing edges, contrast
    const spike = rng() > 0.8 ? rng() * 0.25 : 0;
    const noise = (rng() - 0.5) * 0.08;
    points.push(Math.max(0.02, Math.min(0.85, base + spike + noise)));
  }
  return points;
}

function generateCloseUp(seed: number, steps: number) {
  // Close-up: sharp peaks concentrated in center — face/detail focus
  const rng = seededRandom(seed);
  const points: number[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    // Strong center peak — the face
    const face = Math.exp(-Math.pow((t - 0.5) * 3.5, 2)) * 0.9;
    // Sharp detail spikes — eyelashes, lips, hair texture
    const detail = rng() > 0.75 ? rng() * 0.4 * face : 0;
    // Rapid falloff at edges
    const edge = t < 0.15 || t > 0.85 ? 0.02 : 1;
    const noise = (rng() - 0.5) * 0.05;
    points.push(Math.max(0.01, Math.min(1, (face + detail + noise) * edge)));
  }
  return points;
}

function generateComposite(gradient: number[], wide: number[], closeUp: number[]) {
  // Composite: visual sum — tallest where all three overlap
  return gradient.map((g, i) => {
    const combined = g * 0.3 + wide[i] * 0.4 + closeUp[i] * 0.5;
    return Math.min(1, combined * 1.4);
  });
}

// Variation generator — same shape, slight offset
function addVariation(base: number[], seed: number, amount: number) {
  const rng = seededRandom(seed);
  return base.map((v) => {
    const shift = (rng() - 0.5) * amount;
    const spike = rng() > 0.9 ? rng() * amount * 0.5 : 0;
    return Math.max(0.01, Math.min(1, v + shift + spike));
  });
}

export function DoubleExposureAnatomy() {
  const W = 1000;
  const H = 900;
  const leftGutter = 110;
  const rightPad = 30;
  const chartW = W - leftGutter - rightPad;
  const bandH = 130;
  const bandGap = 40;
  const topPad = 80;
  const steps = 200;

  const data = useMemo(() => {
    const rng = seededRandom(42);

    // Generate meaningful waveforms per layer
    const gradientBase = generateGradientWave(100, steps);
    const wideBase = generateWideShot(200, steps);
    const closeBase = generateCloseUp(300, steps);
    const compositeBase = generateComposite(gradientBase, wideBase, closeBase);

    const bases = [gradientBase, wideBase, closeBase, compositeBase];

    // Many overlapping variations per layer for depth
    const layerWaves: number[][][] = bases.map((base, li) => {
      const waves: number[][] = [];
      const varCount = 10 + Math.floor(rng() * 8); // 10-18 traces per layer
      for (let w = 0; w < varCount; w++) {
        const amount = 0.08 + (w / varCount) * 0.35; // wider spread on outer traces
        waves.push(addVariation(base, li * 1000 + w * 77, amount));
      }
      // Original base in the middle
      waves.splice(Math.floor(varCount / 2), 0, base);
      return waves;
    });

    // Scatter particles
    const dots: { x: number; y: number; r: number; color: string; opacity: number }[] = [];
    LAYERS.forEach((layer, li) => {
      const bandY = topPad + li * (bandH + bandGap);
      for (let j = 0; j < 60; j++) {
        const x = leftGutter + rng() * chartW;
        const y = bandY + rng() * bandH;
        dots.push({
          x, y,
          r: 0.5 + rng() * 4,
          color: PALETTE[Math.floor(rng() * PALETTE.length)],
          opacity: 0.04 + rng() * 0.15,
        });
      }
    });
    // Atmospheric
    for (let i = 0; i < 150; i++) {
      dots.push({
        x: leftGutter + rng() * chartW,
        y: topPad + rng() * (LAYERS.length * (bandH + bandGap)),
        r: 0.3 + rng() * 1.5,
        color: PALETTE[Math.floor(rng() * PALETTE.length)],
        opacity: 0.02 + rng() * 0.05,
      });
    }

    // Vertical flow lines between layers
    const flowLines: { x1: number; y1: number; x2: number; y2: number; color: string; opacity: number }[] = [];
    for (let i = 0; i < 40; i++) {
      const x = leftGutter + 20 + rng() * (chartW - 40);
      const fromLayer = Math.floor(rng() * 3);
      const y1 = topPad + fromLayer * (bandH + bandGap) + bandH;
      const y2 = topPad + (fromLayer + 1) * (bandH + bandGap);
      flowLines.push({
        x1: x, y1,
        x2: x + (rng() - 0.5) * 30, y2,
        color: LAYERS[fromLayer].color,
        opacity: 0.04 + rng() * 0.06,
      });
    }

    return { layerWaves, dots, flowLines };
  }, []);

  return (
    <section className="w-full py-12 overflow-x-auto scrollbar-hide">
      <div className="min-w-[800px] max-w-[1100px] mx-auto px-4 md:px-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          style={{ fontFamily: "'Satoshi', system-ui, sans-serif" }}
        >
          {/* Grid */}
          {Array.from({ length: 11 }).map((_, i) => {
            const x = leftGutter + (i / 10) * chartW;
            return <line key={`vg-${i}`} x1={x} y1={topPad - 10} x2={x} y2={H - 40} stroke="#141414" strokeWidth={0.3} opacity={0.06} />;
          })}
          {Array.from({ length: 20 }).map((_, i) => {
            const y = topPad + (i / 19) * (LAYERS.length * (bandH + bandGap) - bandGap);
            return <line key={`hg-${i}`} x1={leftGutter} y1={y} x2={W - rightPad} y2={y} stroke="#141414" strokeWidth={0.2} opacity={0.04} />;
          })}

          {/* Flow lines between layers */}
          {data.flowLines.map((line, i) => (
            <line key={`fl-${i}`} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              stroke={line.color} strokeWidth={0.5} opacity={line.opacity} />
          ))}

          {/* Blend mode indicators at top */}
          {BLEND_MODES.map((mode, i) => {
            const x = leftGutter + 30 + (i / (BLEND_MODES.length - 1)) * (chartW - 60);
            const y = 30;
            const r = 3 + mode.value * 6;
            return (
              <g key={`bm-${i}`}>
                <circle cx={x} cy={y} r={r + 4} fill={PALETTE[i]} opacity={0.06} />
                <circle cx={x} cy={y} r={r} fill={PALETTE[i]} opacity={0.3 + mode.value * 0.3} />
                <circle cx={x} cy={y} r={r * 0.3} fill={PALETTE[i]} opacity={0.7} />
                <text x={x} y={y + r + 12} textAnchor="middle" fontSize={6.5} fill="#141414" opacity={0.35}>{mode.label}</text>
                <text x={x} y={y + r + 22} textAnchor="middle" fontSize={5.5} fill="#141414" opacity={0.2}>{Math.round(mode.value * 100)}%</text>
              </g>
            );
          })}

          {/* Layer bands with jagged waveforms */}
          {LAYERS.map((layer, li) => {
            const bandY = topPad + li * (bandH + bandGap);
            const waves = data.layerWaves[li];

            return (
              <g key={layer.id}>
                {/* Band background */}
                <rect x={leftGutter} y={bandY} width={chartW} height={bandH} rx={4}
                  fill={layer.color} opacity={0.03} />

                {/* Top edge */}
                <line x1={leftGutter} y1={bandY} x2={leftGutter + chartW} y2={bandY}
                  stroke={layer.color} strokeWidth={0.8} opacity={0.15} />

                {/* Multiple stacked waveforms — jagged, sharp peaks */}
                {waves.map((wave, wi) => {
                  // Color shifts from warm/light (back) to cool/dark (front)
                  const depthT = wi / (waves.length - 1);
                  const colorIdx = Math.floor(depthT * (layer.depthColors.length - 1));
                  const waveColor = layer.depthColors[Math.min(colorIdx, layer.depthColors.length - 1)];
                  // All fills very transparent so you see through every layer
                  const baseOpacity = 0.02 + depthT * 0.04;
                  const strokeOpacity = 0.1 + depthT * 0.3;

                  // Build path
                  const points = wave.map((val, si) => {
                    const x = leftGutter + (si / (steps - 1)) * chartW;
                    const y = bandY + bandH - val * bandH * 0.85;
                    return `${x},${y}`;
                  });
                  const linePath = `M ${points.join(" L ")}`;
                  const fillPath = `M ${leftGutter},${bandY + bandH} L ${points.join(" L ")} L ${leftGutter + chartW},${bandY + bandH} Z`;

                  return (
                    <g key={`wave-${li}-${wi}`}>
                      {/* Filled area */}
                      <path d={fillPath} fill={waveColor} opacity={baseOpacity} />
                      {/* Stroke line */}
                      <path d={linePath} fill="none" stroke={waveColor}
                        strokeWidth={0.6} opacity={strokeOpacity} />
                    </g>
                  );
                })}

                {/* Peak markers on the tallest wave */}
                {(() => {
                  const mainWave = waves[0];
                  const markers: JSX.Element[] = [];
                  const markerRng = seededRandom(li * 555);
                  mainWave.forEach((val, si) => {
                    if (val > 0.75 && markerRng() > 0.85) {
                      const x = leftGutter + (si / (steps - 1)) * chartW;
                      const y = bandY + bandH - val * bandH * 0.85;
                      markers.push(
                        <g key={`mk-${li}-${si}`}>
                          <circle cx={x} cy={y} r={3} fill={layer.color} opacity={0.4} />
                          <circle cx={x} cy={y} r={1.2} fill={layer.color} opacity={0.7} />
                          <line x1={x} y1={y} x2={x} y2={bandY + bandH}
                            stroke={layer.color} strokeWidth={0.3} opacity={0.1}
                            strokeDasharray="1 3" />
                        </g>
                      );
                    }
                  });
                  return markers;
                })()}

                {/* Layer label */}
                <text x={leftGutter - 12} y={bandY + bandH / 2 - 6} textAnchor="end"
                  fontSize={8} fontWeight={700} fill="#141414" opacity={0.5}
                  letterSpacing="0.1em">{layer.label}</text>
                <text x={leftGutter - 12} y={bandY + bandH / 2 + 8} textAnchor="end"
                  fontSize={7} fill="#141414" opacity={0.3}>{layer.sub}</text>

                {/* Intensity scale on right */}
                {[0, 0.25, 0.5, 0.75, 1].map((tick, ti) => {
                  const y = bandY + bandH - tick * bandH * 0.85;
                  return (
                    <g key={`tick-${li}-${ti}`}>
                      <line x1={leftGutter + chartW + 4} y1={y} x2={leftGutter + chartW + 10} y2={y}
                        stroke="#141414" strokeWidth={0.3} opacity={0.15} />
                      <text x={leftGutter + chartW + 14} y={y + 3} fontSize={5}
                        fill="#141414" opacity={0.2}>{Math.round(tick * 100)}</text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Particles */}
          {data.dots.map((dot, i) => (
            <circle key={`p-${i}`} cx={dot.x} cy={dot.y} r={dot.r}
              fill={dot.color} opacity={dot.opacity} />
          ))}

          {/* Bottom labels */}
          <g transform={`translate(${leftGutter}, ${H - 30})`}>
            <text fontSize={8} fontWeight={700} fill="#141414" opacity={0.4}
              letterSpacing="0.12em">DOUBLE-EXPOSURE ANATOMY</text>
            <text y={14} fontSize={6.5} fill="#141414" opacity={0.25}>
              Layer intensity across composite frame — 4 source photographs
            </text>
          </g>

          {/* Legend */}
          <g transform={`translate(${W - 200}, ${H - 35})`} opacity={0.35}>
            <text fontSize={6} fontWeight={600} fill="#141414" letterSpacing="0.08em">LAYER INTENSITY</text>
            {LAYERS.map((layer, i) => (
              <g key={i} transform={`translate(${i * 40}, 12)`}>
                <rect x={0} y={0} width={12} height={6} rx={1} fill={layer.color} opacity={0.5} />
                <text x={15} y={5.5} fontSize={5} fill="#141414" opacity={0.4}>{layer.id.charAt(0).toUpperCase() + layer.id.slice(1, 4)}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
}
