"use client";

import { useMemo } from "react";
import type { SpeedComparisonSection } from "@/lib/types";

// ── Seeded random ───────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Data ────────────────────────────────────────────────────────
const VIEWS = [
  { label: "Dashboard", tasks: ["Overview", "Value summary", "Category scan", "Coverage check"], manualMin: 45, manualMax: 60, arcMin: 0, arcMax: 0, color: "#C4A265" },
  { label: "Room View", tasks: ["Navigate rooms", "Item cards", "Sort/filter", "Photo browse"], manualMin: 120, manualMax: 180, arcMin: 3, arcMax: 5, color: "#6B8060" },
  { label: "Document AI", tasks: ["Receipt scan", "Data extract", "Item match", "Auto-file"], manualMin: 90, manualMax: 120, arcMin: 1, arcMax: 2, color: "#9B8E7E" },
  { label: "Reports", tasks: ["PDF generate", "Room filter", "Photo compile", "Format"], manualMin: 60, manualMax: 90, arcMin: 2, arcMax: 4, color: "#8B7355" },
];

const PHASES = [
  { label: "Capture", minutes: 180, description: "Photograph & describe each item" },
  { label: "Organize", minutes: 120, description: "Sort by room and category" },
  { label: "Value", minutes: 90, description: "Research replacement costs" },
  { label: "Document", minutes: 60, description: "Create inventory records" },
  { label: "Report", minutes: 30, description: "Generate formatted output" },
  { label: "Review", minutes: 40, description: "Verify and cross-check" },
];

const SUMMARY = [
  { value: "8-12", label: "HOURS MANUAL", sub: "Traditional inventory" },
  { value: "~30", label: "MINUTES A.R.C.", sub: "Same 73 items" },
  { value: "16-24×", label: "FASTER", sub: "Documentation speed" },
  { value: "4", label: "VIEW TYPES", sub: "Dashboard to reports" },
];

const W = 1000;
const ML = 70;
const MR = 50;
const CW = W - ML - MR;
const TOTAL_H = 520;

// ── Wave generation ─────────────────────────────────────────────
function genWave(seed: number, pts: number, amp: number): number[] {
  const rng = seededRandom(seed);
  const raw: number[] = [];
  for (let i = 0; i < pts; i++) {
    raw.push(
      Math.sin(i * 0.08) * amp * 0.4 +
      Math.sin(i * 0.03 + 1) * amp * 0.3 +
      (rng() - 0.5) * amp * 0.6
    );
  }
  // smooth
  const smooth: number[] = [];
  for (let i = 0; i < raw.length; i++) {
    let sum = 0, count = 0;
    for (let j = Math.max(0, i - 3); j <= Math.min(raw.length - 1, i + 3); j++) {
      sum += raw[j]; count++;
    }
    smooth.push(sum / count);
  }
  return smooth;
}

function wavePath(pts: number[], xStart: number, xEnd: number, yBase: number): string {
  const step = (xEnd - xStart) / (pts.length - 1);
  let d = `M${xStart},${yBase + pts[0]}`;
  for (let i = 1; i < pts.length; i++) {
    const x = xStart + i * step;
    const y = yBase + pts[i];
    const cpx = x - step * 0.5;
    d += ` C${cpx},${yBase + pts[i - 1]} ${cpx},${y} ${x},${y}`;
  }
  return d;
}

export function SpeedComparison({ title }: SpeedComparisonSection) {
  const elements = useMemo(() => {
    const rng = seededRandom(42);

    // ── Layer 0: Summary stats (y = 10..70) ──
    const statsY = 10;

    // ── Layer 1: Time waterfall — manual vs ARC phases (y = 90..230) ──
    const waterfallY = 95;
    const waterfallH = 130;
    const totalManualMin = PHASES.reduce((s, p) => s + p.minutes, 0); // 520 min
    const phaseBlocks: { x: number; w: number; label: string; minutes: number; arcMinutes: number }[] = [];
    let px = ML;
    PHASES.forEach((phase, i) => {
      const w = (phase.minutes / totalManualMin) * CW;
      const arcMin = Math.max(1, phase.minutes / (16 + rng() * 8));
      phaseBlocks.push({ x: px, w, label: phase.label, minutes: phase.minutes, arcMinutes: arcMin });
      px += w;
    });

    // ── Layer 2: View comparison strips (y = 250..400) ──
    const stripY = 250;
    const stripH = 30;
    const stripGap = 10;
    const viewStrips = VIEWS.map((view, vi) => {
      const y = stripY + vi * (stripH + stripGap);
      const manualW = ((view.manualMax + view.manualMin) / 2 / totalManualMin) * CW;
      const arcW = Math.max(8, ((view.arcMax + view.arcMin) / 2 / totalManualMin) * CW);
      // Task dots along the strip
      const dots: { x: number; y: number; r: number }[] = [];
      view.tasks.forEach((_, ti) => {
        const dotX = ML + (ti / (view.tasks.length - 1)) * manualW * 0.9 + rng() * 10;
        const dotY = y + stripH * 0.5 + (rng() - 0.5) * stripH * 0.5;
        dots.push({ x: dotX, y: dotY, r: 2 + rng() * 3 });
      });
      // Contour waves inside manual bar
      const waves = [0, 1].map(wi =>
        genWave(100 + vi * 10 + wi, 60, 4)
      );
      return { ...view, y, manualW, arcW, dots, waves };
    });

    // ── Layer 3: Scatter field — time savings (y = 420..500) ──
    const scatterY = 420;
    const scatterH = 80;
    const scatterDots: { x: number; y: number; r: number; color: string; opacity: number }[] = [];
    // Manual dots (left cluster, grey)
    for (let i = 0; i < 80; i++) {
      scatterDots.push({
        x: ML + rng() * CW * 0.85,
        y: scatterY + rng() * scatterH * 0.45,
        r: 1.5 + rng() * 4,
        color: "#8C8578",
        opacity: 0.2 + rng() * 0.4,
      });
    }
    // ARC dots (left narrow band, green)
    for (let i = 0; i < 25; i++) {
      scatterDots.push({
        x: ML + rng() * CW * 0.06,
        y: scatterY + scatterH * 0.55 + rng() * scatterH * 0.4,
        r: 2 + rng() * 4,
        color: "#6B8060",
        opacity: 0.3 + rng() * 0.5,
      });
    }

    // Stream lines connecting manual to ARC zone
    const streams: string[] = [];
    for (let i = 0; i < 12; i++) {
      const sx = ML + CW * 0.1 + rng() * CW * 0.7;
      const sy = scatterY + rng() * scatterH * 0.3;
      const ex = ML + rng() * CW * 0.05;
      const ey = scatterY + scatterH * 0.6 + rng() * scatterH * 0.35;
      const cpx = ML + CW * 0.04;
      streams.push(`M${sx},${sy} C${cpx},${sy} ${cpx},${ey} ${ex},${ey}`);
    }

    return { statsY, phaseBlocks, waterfallY, waterfallH, viewStrips, stripY, stripH, stripGap, scatterDots, scatterY, scatterH, streams };
  }, []);

  const { statsY, phaseBlocks, waterfallY, waterfallH, viewStrips, stripY, stripH, stripGap, scatterDots, scatterY, scatterH, streams } = elements;

  return (
    <section className="w-full py-4">
      <div className="overflow-x-auto md:overflow-visible -mx-4 md:mx-0"
        data-lenis-prevent-touch>
        <div className="min-w-[700px] md:min-w-0 px-4 md:px-0">
      <svg viewBox={`0 0 ${W} ${TOTAL_H}`} className="w-full" aria-label="Documentation speed analysis">
        <defs>
          <pattern id="speed-hatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#8C8578" strokeWidth="0.5" strokeOpacity="0.3" />
          </pattern>
        </defs>

        {/* ── Layer 0: Summary stats ── */}
        {SUMMARY.map((stat, i) => {
          const sx = ML + (i / SUMMARY.length) * CW;
          return (
            <g key={i}>
              <text x={sx} y={statsY + 24} fontSize="28" fontWeight="700" fill="#141414">{stat.value}</text>
              <text x={sx} y={statsY + 40} fontSize="9" letterSpacing="0.08em" fill="#141414" fillOpacity="0.55">{stat.label}</text>
              <text x={sx} y={statsY + 53} fontSize="8" fill="#141414" fillOpacity="0.4">{stat.sub}</text>
            </g>
          );
        })}

        {/* Divider */}
        <line x1={ML} y1={statsY + 65} x2={ML + CW} y2={statsY + 65} stroke="#141414" strokeOpacity="0.08" strokeWidth="0.5" />

        {/* ── Row label ── */}
        <text x={ML - 5} y={waterfallY + 8} fontSize="9" letterSpacing="0.04em" fill="#141414" fillOpacity="0.55" textAnchor="end">Phases</text>

        {/* ── Layer 1: Time waterfall ── */}
        {phaseBlocks.map((block, i) => {
          const manualH = waterfallH * 0.55;
          const arcH = Math.max(4, (block.arcMinutes / block.minutes) * manualH);
          const rng2 = seededRandom(200 + i);
          const wave = genWave(300 + i, 40, 3);

          return (
            <g key={i}>
              {/* Manual time block */}
              <rect x={block.x + 1} y={waterfallY + 15} width={block.w - 2} height={manualH} rx="2" fill="#8C8578" fillOpacity="0.2" />
              <rect x={block.x + 1} y={waterfallY + 15} width={block.w - 2} height={manualH} rx="2" fill="url(#speed-hatch)" />

              {/* Manual fill — proportional to minutes */}
              <rect x={block.x + 1} y={waterfallY + 15} width={block.w - 2} height={manualH} rx="2" fill="#8C8578" fillOpacity="0.15" />

              {/* Contour wave inside */}
              <path
                d={wavePath(wave, block.x + 2, block.x + block.w - 2, waterfallY + 15 + manualH * 0.5)}
                fill="none" stroke="#8C8578" strokeWidth="0.6" strokeOpacity="0.4"
              />

              {/* ARC time block — tiny */}
              <rect x={block.x + 1} y={waterfallY + 15 + manualH + 6} width={Math.max(6, (block.arcMinutes / block.minutes) * (block.w - 2))} height={8} rx="4" fill="#6B8060"
               
                style={{ "--dur": `${2.5 + i * 0.5}s`, "--del": `${i * 0.3}s` } as React.CSSProperties} />

              {/* Phase label */}
              <text x={block.x + block.w / 2} y={waterfallY + 12} fontSize="9" fill="#141414" fillOpacity="0.6" textAnchor="middle">{block.label}</text>

              {/* Minutes label */}
              <text x={block.x + block.w / 2} y={waterfallY + 15 + manualH / 2 + 3} fontSize="10" fill="#141414" fillOpacity="0.5" textAnchor="middle">{block.minutes}m</text>

              {/* Separator */}
              {i < phaseBlocks.length - 1 && (
                <line x1={block.x + block.w} y1={waterfallY + 10} x2={block.x + block.w} y2={waterfallY + 15 + manualH + 20} stroke="#141414" strokeOpacity="0.06" strokeWidth="0.5" />
              )}
            </g>
          );
        })}

        {/* Manual total label */}
        <text x={ML + CW + 8} y={waterfallY + 15 + elements.waterfallH * 0.55 / 2 + 3} fontSize="9" fill="#141414" fillOpacity="0.5" fontWeight="500">8-12 hrs</text>
        {/* ARC total label */}
        <text x={ML + CW + 8} y={waterfallY + 15 + elements.waterfallH * 0.55 + 12} fontSize="9" fill="#6B8060" fontWeight="600">~30 min</text>

        {/* Divider */}
        <line x1={ML} y1={waterfallY + waterfallH + 15} x2={ML + CW} y2={waterfallY + waterfallH + 15} stroke="#141414" strokeOpacity="0.06" strokeWidth="0.5" />

        {/* ── Row label ── */}
        <text x={ML - 5} y={stripY + 8} fontSize="9" letterSpacing="0.04em" fill="#141414" fillOpacity="0.55" textAnchor="end">Views</text>

        {/* ── Layer 2: View comparison strips ── */}
        {viewStrips.map((view, vi) => (
          <g key={vi}>
            {/* Manual bar background */}
            <rect x={ML} y={view.y} width={view.manualW} height={stripH} rx="3" fill={view.color} fillOpacity="0.12" />

            {/* Hatching fill */}
            <rect x={ML} y={view.y} width={view.manualW} height={stripH} rx="3" fill="url(#speed-hatch)" />

            {/* Contour waves */}
            {view.waves.map((wave, wi) => (
              <path
                key={wi}
                d={wavePath(wave, ML, ML + view.manualW, view.y + stripH * (0.35 + wi * 0.3))}
                fill="none" stroke={view.color} strokeWidth="0.5" strokeOpacity="0.35"
              />
            ))}

            {/* ARC bar — tiny solid */}
            <rect x={ML} y={view.y + 4} width={view.arcW} height={stripH - 8} rx="4" fill={view.color} fillOpacity="0.6" />

            {/* Task dots */}
            {view.dots.map((dot, di) => (
              <circle key={di} cx={dot.x} cy={dot.y} r={dot.r} fill={view.color}
               
                style={{ "--base-op": 0.3, "--dur": `${3 + di * 1.2}s`, "--del": `${vi * 0.5 + di * 0.3}s` } as React.CSSProperties} />
            ))}

            {/* View label */}
            <text x={ML + view.manualW + 10} y={view.y + stripH / 2 + 3} fontSize="10" fill="#141414" fillOpacity="0.7" fontWeight="500">{view.label}</text>

            {/* Task labels */}
            {view.tasks.map((task, ti) => {
              const tx = ML + (ti / view.tasks.length) * view.manualW * 0.85 + 8;
              return (
                <text key={ti} x={tx} y={view.y + stripH + 10} fontSize="8" fill="#141414" fillOpacity="0.35">{task}</text>
              );
            })}
          </g>
        ))}

        {/* Divider */}
        <line x1={ML} y1={stripY + VIEWS.length * (stripH + stripGap) + 15} x2={ML + CW} y2={stripY + VIEWS.length * (stripH + stripGap) + 15} stroke="#141414" strokeOpacity="0.06" strokeWidth="0.5" />

        {/* ── Row label ── */}
        <text x={ML - 5} y={scatterY + 8} fontSize="9" letterSpacing="0.04em" fill="#141414" fillOpacity="0.55" textAnchor="end">Speed</text>

        {/* ── Layer 3: Scatter field ── */}
        {/* Stream lines */}
        {streams.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#6B8060" strokeWidth="0.4" strokeOpacity="0.15"
           
            style={{ "--dur": `${5 + (i % 4) * 2}s`, "--del": `${(i % 6) * 0.7}s` } as React.CSSProperties} />
        ))}

        {/* Dots */}
        {scatterDots.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill={dot.color}
           
            style={{ "--base-op": dot.opacity, "--dur": `${3 + (i % 8) * 0.9}s`, "--del": `${(i % 13) * 0.4}s` } as React.CSSProperties} />
        ))}

        {/* Manual zone label */}
        <text x={ML + CW * 0.5} y={scatterY - 3} fontSize="9" fill="#141414" textAnchor="middle" fillOpacity="0.4">Manual time distribution (minutes per phase)</text>

        {/* ARC zone label */}
        <text x={ML + CW * 0.03} y={scatterY + scatterH + 14} fontSize="9" fill="#6B8060" textAnchor="middle" fillOpacity="0.7" fontWeight="600">A.R.C.</text>

        {/* 16-24x callout */}
        <text x={ML + CW} y={scatterY + scatterH + 14} fontSize="28" fontWeight="700" fill="#141414" textAnchor="end">16-24×</text>
        <text x={ML + CW + 3} y={scatterY + scatterH + 14} fontSize="11" fill="#141414" fillOpacity="0.45">faster</text>
      </svg>
        </div>
        <p className="text-[11px] text-center text-foreground/30 mt-2 md:hidden">Scroll to explore →</p>
      </div>
    </section>
  );
}
