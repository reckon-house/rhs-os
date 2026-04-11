"use client";

import { useMemo } from "react";
import type { StatsBarSection } from "@/lib/types";

// ── Seeded random ───────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Data ────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "Furniture", value: 680, color: "#C4A265", rooms: [0.9, 0.8, 0.7, 0.2, 0.1, 0.3, 0.05] },
  { label: "Electronics", value: 425, color: "#8B7355", rooms: [0.3, 0.9, 0.5, 0.8, 0.1, 0.2, 0.05] },
  { label: "Artwork", value: 580, color: "#B1BC94", rooms: [0.9, 0.6, 0.3, 0.1, 0.7, 0.05, 0.02] },
  { label: "Appliances", value: 890, color: "#A0886C", rooms: [0.1, 0.2, 0.05, 0.9, 0.05, 0.7, 0.8] },
  { label: "Fixtures", value: 310, color: "#8B7355", rooms: [0.5, 0.3, 0.8, 0.9, 0.2, 0.6, 0.1] },
  { label: "Textiles", value: 185, color: "#9B8E7E", rooms: [0.8, 0.7, 0.3, 0.2, 0.1, 0.9, 0.05] },
  { label: "Collectibles", value: 695, color: "#6B8060", rooms: [0.6, 0.8, 0.1, 0.1, 0.3, 0.05, 0.9] },
  { label: "Vehicles", value: 5000, color: "#556B4A", rooms: [0.05, 0.05, 0.05, 0.1, 0.05, 0.05, 0.9] },
  { label: "Jewelry", value: 1200, color: "#C4C4A0", rooms: [0.3, 0.8, 0.1, 0.05, 0.05, 0.7, 0.1] },
];

const ROOMS = ["Living", "Bedroom", "Bath", "Kitchen", "Hallway", "Laundry", "Garage"];

const TOTALS = [
  { value: "73", label: "ITEMS DOCUMENTED", sub: "Average per home" },
  { value: "$49,630", label: "TOTAL VALUE", sub: "Tracked assets" },
  { value: "$680", label: "AVG ITEM VALUE", sub: "Across categories" },
  { value: "13", label: "CATEGORIES", sub: "Classification depth" },
];

const W = 1000;
const ML = 80;  // margin left
const MR = 60;  // margin right
const CW = W - ML - MR; // content width

const HEADER_H = 85;
const CHART_H = 480;
const TOTAL_H = HEADER_H + CHART_H + 30;
const CHART_Y = HEADER_H + 15;

// ── Curve generation ────────────────────────────────────────────
function genCurve(seed: number, amplitude: number, pts: number = 140): number[] {
  const rng = seededRandom(seed);
  const raw: number[] = [];
  for (let i = 0; i < pts; i++) {
    const t = i / (pts - 1);
    let y = 0;
    y += Math.sin(t * Math.PI * 2.2 + rng() * 6) * 0.3;
    y += Math.sin(t * Math.PI * 4.5 + rng() * 4) * 0.2;
    y += Math.sin(t * Math.PI * 7.1 + rng() * 8) * 0.15;
    y += Math.sin(t * Math.PI * 11 + rng() * 3) * 0.1;
    y += Math.sin(t * Math.PI * 1.1 + rng() * 2) * 0.25;
    if (rng() > 0.7) y += rng() * 0.4;
    raw.push((y + 1) * 0.5 * amplitude);
  }
  // Smooth
  const smoothed: number[] = [];
  for (let i = 0; i < raw.length; i++) {
    let sum = 0, count = 0;
    for (let j = Math.max(0, i - 3); j <= Math.min(raw.length - 1, i + 3); j++) {
      sum += raw[j]; count++;
    }
    smoothed.push(sum / count);
  }
  return smoothed;
}

function areaPath(curve: number[], x0: number, x1: number, base: number): string {
  const w = x1 - x0;
  const pts = curve.map((v, i) => {
    const x = x0 + (i / (curve.length - 1)) * w;
    return `${x.toFixed(1)},${(base - v).toFixed(1)}`;
  });
  return `M${x0},${base} L${pts.join(" L")} L${x1},${base} Z`;
}

function linePath(curve: number[], x0: number, x1: number, base: number): string {
  const w = x1 - x0;
  const pts = curve.map((v, i) => {
    const x = x0 + (i / (curve.length - 1)) * w;
    return `${x.toFixed(1)},${(base - v).toFixed(1)}`;
  });
  return `M${pts.join(" L")}`;
}

export function StatsBar({ items }: StatsBarSection) {
  const N = CATEGORIES.length;

  // ── Ridgeline curves (one per category, overlapping) ──────────
  const ridgelines = useMemo(() => {
    return CATEGORIES.map((cat, i) => {
      const amp = Math.min(cat.value / 50, 50);
      return { ...cat, curve: genCurve(i * 17 + 3, amp, 140), index: i };
    });
  }, []);

  // ── Particles scattered across entire chart area ──────────────
  const particles = useMemo(() => {
    const r = seededRandom(42);
    const result: { x: number; y: number; size: number; color: string; opacity: number }[] = [];
    CATEGORIES.forEach((cat, ci) => {
      const count = Math.floor(cat.value / 8) + 15;
      const bandCenter = CHART_Y + 40 + (ci / (N - 1)) * (CHART_H - 80);
      const spread = CHART_H / N * 0.9;
      for (let j = 0; j < count; j++) {
        const x = ML + r() * CW;
        // Gaussian-ish distribution around the band center
        const g = (r() + r() + r()) / 3; // tends toward 0.5
        const y = bandCenter + (g - 0.5) * spread;
        result.push({
          x,
          y: Math.max(CHART_Y + 5, Math.min(CHART_Y + CHART_H - 5, y)),
          size: 0.6 + r() * 3,
          color: cat.color,
          opacity: 0.08 + r() * 0.22,
        });
      }
    });
    return result;
  }, [N]);

  // ── Connection threads (weaving across categories) ────────────
  const threads = useMemo(() => {
    const r = seededRandom(99);
    const result: { d: string; color: string; opacity: number }[] = [];
    // Cross-category connections
    for (let t = 0; t < 60; t++) {
      const ci1 = Math.floor(r() * N);
      const ci2 = Math.floor(r() * N);
      if (ci1 === ci2) continue;
      const x1 = ML + r() * CW;
      const x2 = ML + r() * CW;
      const y1 = CHART_Y + 40 + (ci1 / (N - 1)) * (CHART_H - 80);
      const y2 = CHART_Y + 40 + (ci2 / (N - 1)) * (CHART_H - 80);
      const mx = (x1 + x2) / 2 + (r() - 0.5) * 100;
      result.push({
        d: `M${x1},${y1} Q${mx},${(y1 + y2) / 2} ${x2},${y2}`,
        color: CATEGORIES[ci1].color,
        opacity: 0.03 + r() * 0.05,
      });
    }
    // Header → chart connections
    for (let t = 0; t < 25; t++) {
      const x1 = ML + r() * CW;
      const x2 = x1 + (r() - 0.5) * 120;
      const ci = Math.floor(r() * N);
      const y2 = CHART_Y + 20 + r() * 80;
      result.push({
        d: `M${x1},${HEADER_H} C${x1},${HEADER_H + 8} ${x2},${y2 - 8} ${x2},${y2}`,
        color: CATEGORIES[ci].color,
        opacity: 0.02 + r() * 0.04,
      });
    }
    return result;
  }, [N]);

  // ── Density ticks along baselines ─────────────────────────────
  const ticks = useMemo(() => {
    const r = seededRandom(123);
    const result: { x: number; y: number; h: number; color: string; opacity: number }[] = [];
    CATEGORIES.forEach((cat, ci) => {
      const baseline = CHART_Y + 40 + (ci / (N - 1)) * (CHART_H - 80);
      const count = 25 + Math.floor(cat.value / 40);
      for (let t = 0; t < count; t++) {
        result.push({
          x: ML + r() * CW,
          y: baseline,
          h: 1.5 + r() * 8,
          color: cat.color,
          opacity: 0.1 + r() * 0.2,
        });
      }
    });
    return result;
  }, [N]);

  // ── Room heatmap bands (overlaid as vertical colored columns) ─
  const heatCols = useMemo(() => {
    const colW = CW / ROOMS.length;
    return ROOMS.map((room, ri) => {
      const x = ML + ri * colW;
      // For each room column, compute aggregate intensity from all categories
      const cells = CATEGORIES.map((cat, ci) => ({
        intensity: cat.rooms[ri],
        color: cat.color,
        baseline: CHART_Y + 40 + (ci / (N - 1)) * (CHART_H - 80),
      }));
      return { room, x, w: colW, cells };
    });
  }, [N]);

  return (
    <section className="w-full py-6">
      <div className="relative">
        <div className="overflow-x-auto md:overflow-visible -mx-4 md:mx-0"
        data-lenis-prevent-touch>
          <div className="min-w-[800px] md:min-w-0 px-4 md:px-0">
        <svg
          viewBox={`0 0 ${W} ${TOTAL_H}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* ═══ LAYER 0: Background grid ═══ */}
          {Array.from({ length: 25 }).map((_, i) => (
            <line
              key={`vg${i}`}
              x1={ML + (i / 24) * CW} y1={0}
              x2={ML + (i / 24) * CW} y2={TOTAL_H}
              stroke="#141414" strokeWidth={0.3}
              opacity={i % 6 === 0 ? 0.06 : 0.02}
            />
          ))}
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={`hg${i}`}
              x1={ML - 20} y1={(i / 17) * TOTAL_H}
              x2={W - MR + 20} y2={(i / 17) * TOTAL_H}
              stroke="#141414" strokeWidth={0.3} opacity={0.025}
            />
          ))}

          {/* ═══ HEADER: Integrated totals ═══ */}
          {TOTALS.map((stat, i) => {
            const colW = CW / 4;
            const x = ML + i * colW;
            return (
              <g key={`stat-${i}`}>
                {i > 0 && (
                  <line x1={x} y1={8} x2={x} y2={HEADER_H - 10}
                    stroke="#141414" strokeWidth={0.4} opacity={0.07} />
                )}
                <text x={x + 12} y={36} fill="#141414" fontSize={28}
                  fontWeight={700} opacity={1}
                  style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
                  {stat.value}
                </text>
                <text x={x + 12} y={51} fill="#141414" fontSize={9}
                  fontWeight={600} opacity={0.55} letterSpacing={0.8}>
                  {stat.label}
                </text>
                <text x={x + 12} y={63} fill="#141414" fontSize={8} opacity={0.4}>
                  {stat.sub}
                </text>
              </g>
            );
          })}
          <line x1={ML} y1={HEADER_H} x2={ML + CW} y2={HEADER_H}
            stroke="#141414" strokeWidth={0.5} opacity={0.07} />

          {/* ═══ LAYER 1: Room heatmap bands (background color columns) ═══ */}
          {heatCols.map((col, ri) => (
            <g key={`hcol-${ri}`}>
              {/* Room column label at top */}
              <text x={col.x + col.w / 2} y={CHART_Y + 8} fill="#141414"
                fontSize={8} opacity={0.4} textAnchor="middle" letterSpacing={0.5}>
                {col.room}
              </text>
              {/* Heatmap rectangles at each category baseline */}
              {col.cells.map((cell, ci) => {
                const bandH = (CHART_H - 80) / (N - 1);
                const rectH = bandH * 0.7;
                return (
                  <rect
                    key={`hr-${ri}-${ci}`}
                    x={col.x + 2}
                    y={cell.baseline - rectH / 2}
                    width={col.w - 4}
                    height={rectH}
                    rx={2}
                    fill={cell.color}
                    opacity={cell.intensity * 0.12}
                  />
                );
              })}
            </g>
          ))}

          {/* ═══ LAYER 2: Connection threads ═══ */}
          {threads.map((t, i) => (
            <path key={`th-${i}`} d={t.d} fill="none"
              stroke={t.color} strokeWidth={0.5} opacity={t.opacity}
             
              style={{ "--dur": `${6 + (i % 5) * 2}s`, "--del": `${(i % 7) * 0.8}s` } as React.CSSProperties} />
          ))}

          {/* ═══ LAYER 3: Density ticks ═══ */}
          {ticks.map((t, i) => (
            <line key={`tk-${i}`}
              x1={t.x} y1={t.y} x2={t.x} y2={t.y - t.h}
              stroke={t.color} strokeWidth={0.5} opacity={t.opacity}
             
              style={{ "--dur": `${4 + (i % 6) * 1.2}s`, "--del": `${(i % 9) * 0.5}s` } as React.CSSProperties} />
          ))}

          {/* ═══ LAYER 4: Ridgeline curves (the backbone) ═══ */}
          {ridgelines
            .slice()
            .reverse()
            .map((cat, ri) => {
              const i = N - 1 - ri;
              const baseline = CHART_Y + 40 + (i / (N - 1)) * (CHART_H - 80);
              return (
                <g key={`ridge-${i}`}>
                  {/* Filled area */}
                  <path
                    d={areaPath(cat.curve, ML, W - MR, baseline)}
                    fill={cat.color}
                   
                    style={{ "--dur": `${5 + i * 0.8}s`, "--del": `${i * 0.6}s` } as React.CSSProperties}
                  />
                  {/* Second echo fill, wider */}
                  <path
                    d={areaPath(cat.curve.map(v => v * 0.6), ML, W - MR, baseline)}
                    fill={cat.color} opacity={0.06}
                  />
                  {/* Main stroke */}
                  <path
                    d={linePath(cat.curve, ML, W - MR, baseline)}
                    fill="none" stroke={cat.color} strokeWidth={1.3} opacity={0.3}
                  />
                  {/* Ghost echo */}
                  <path
                    d={linePath(cat.curve.map(v => v * 1.2), ML, W - MR, baseline)}
                    fill="none" stroke={cat.color} strokeWidth={0.35} opacity={0.15}
                  />
                  {/* Inner echo */}
                  <path
                    d={linePath(cat.curve.map(v => v * 0.5), ML, W - MR, baseline)}
                    fill="none" stroke={cat.color} strokeWidth={0.3} opacity={0.12}
                  />
                  {/* Baseline */}
                  <line x1={ML} y1={baseline} x2={W - MR} y2={baseline}
                    stroke={cat.color} strokeWidth={0.3} opacity={0.1} />
                </g>
              );
            })}

          {/* ═══ LAYER 5: Particles ═══ */}
          {particles.map((d, i) => (
            <circle key={`p-${i}`} cx={d.x} cy={d.y} r={d.size}
              fill={d.color}
             
              style={{ "--base-op": d.opacity, "--dur": `${3 + (i % 7) * 1.1}s`, "--del": `${(i % 11) * 0.6}s` } as React.CSSProperties} />
          ))}

          {/* ═══ LAYER 6: Category labels (left edge) ═══ */}
          {CATEGORIES.map((cat, i) => {
            const baseline = CHART_Y + 40 + (i / (N - 1)) * (CHART_H - 80);
            return (
              <g key={`lbl-${i}`}>
                <text x={8} y={baseline - 3} fill="#141414"
                  fontSize={9} fontWeight={600} opacity={0.65}>
                  {cat.label}
                </text>
                <text x={8} y={baseline + 8} fill="#141414"
                  fontSize={8} opacity={0.35}>
                  ${cat.value.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* ═══ LAYER 7: Room intensity markers (right edge) ═══ */}
          {CATEGORIES.map((cat, ci) => {
            const baseline = CHART_Y + 40 + (ci / (N - 1)) * (CHART_H - 80);
            // Show top 2 rooms
            const roomRanked = cat.rooms
              .map((v, ri) => ({ v, name: ROOMS[ri] }))
              .sort((a, b) => b.v - a.v)
              .slice(0, 2);
            return (
              <g key={`rr-${ci}`}>
                <text x={W - MR + 8} y={baseline - 2} fill="#141414"
                  fontSize={7} opacity={0.4}>
                  {roomRanked[0].name} {Math.round(roomRanked[0].v * 100)}%
                </text>
                <text x={W - MR + 8} y={baseline + 7} fill="#141414"
                  fontSize={6.5} opacity={0.3}>
                  {roomRanked[1].name} {Math.round(roomRanked[1].v * 100)}%
                </text>
              </g>
            );
          })}

          {/* ═══ Bottom axis ═══ */}
          <line x1={ML} y1={TOTAL_H - 10} x2={ML + CW} y2={TOTAL_H - 10}
            stroke="#141414" strokeWidth={0.4} opacity={0.08} />
          {["Capture", "Classify", "Validate", "Value", "Archive", "Monitor"].map((label, i) => {
            const x = ML + (i / 5) * CW;
            return (
              <g key={`ax-${i}`}>
                <line x1={x} y1={TOTAL_H - 14} x2={x} y2={TOTAL_H - 6}
                  stroke="#141414" strokeWidth={0.4} opacity={0.1} />
                <text x={x} y={TOTAL_H} fill="#141414"
                  fontSize={8} opacity={0.4} textAnchor="middle">
                  {label}
                </text>
              </g>
            );
          })}

          {/* ═══ Panel label ═══ */}
          <text x={ML - 2} y={CHART_Y - 2} fill="#141414"
            fontSize={9} fontWeight={600} opacity={0.45} letterSpacing={1}>
            Inventory Analysis — Value × Room × Density
          </text>
        </svg>
          </div>
          <p className="text-[11px] text-center text-foreground/30 mt-2 md:hidden">Scroll to explore →</p>
        </div>
      </div>
    </section>
  );
}
