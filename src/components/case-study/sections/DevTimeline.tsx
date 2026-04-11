"use client";

import { useMemo } from "react";
import type { DevTimelineSection } from "@/lib/types";

// ── Seeded random ───────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Phase data ──────────────────────────────────────────────────
const PHASES = [
  { name: "Concept Validation", weeks: "Wk 1–2", color: "#C4C4A0", start: 0, end: 2 },
  { name: "Architecture", weeks: "Wk 3–4", color: "#B1BC94", start: 2, end: 4 },
  { name: "Interface Design + Build", weeks: "Wk 5–6", color: "#8FA07A", start: 4, end: 6 },
  { name: "Financial Layer", weeks: "Wk 7–8", color: "#6B8060", start: 6, end: 8 },
  { name: "Brand + Go-to-Market", weeks: "Wk 9–10", color: "#556B4A", start: 8, end: 10 },
];

// Tech stack active during each phase (boolean per phase)
const TECH_STACK = [
  { name: "Swift / SwiftUI", color: "#C4A265", active: [0.2, 0.4, 1, 1, 0.5] },
  { name: "Python / ML", color: "#8B7D5E", active: [0.3, 1, 0.8, 0.3, 0.1] },
  { name: "Core ML", color: "#B1BC94", active: [0.1, 0.6, 1, 0.7, 0.2] },
  { name: "Firebase", color: "#A68B5B", active: [0.1, 0.8, 0.6, 0.9, 0.4] },
  { name: "Vision API", color: "#6B8060", active: [0.5, 0.9, 0.7, 0.3, 0.1] },
  { name: "Stripe", color: "#8B7355", active: [0, 0, 0.1, 1, 0.6] },
  { name: "CloudKit", color: "#9A8B6E", active: [0, 0.3, 0.5, 0.7, 0.9] },
];

// Feature milestones
const MILESTONES = [
  { week: 0.8, label: "Market research" },
  { week: 1.5, label: "User interviews" },
  { week: 2.3, label: "DB schema" },
  { week: 3.1, label: "API design" },
  { week: 3.7, label: "ML pipeline" },
  { week: 4.5, label: "UI prototype" },
  { week: 5.2, label: "Camera flow" },
  { week: 5.8, label: "Classification" },
  { week: 6.4, label: "Valuation engine" },
  { week: 7.1, label: "Coverage calc" },
  { week: 7.8, label: "Gap analysis" },
  { week: 8.3, label: "Brand identity" },
  { week: 9.0, label: "App Store prep" },
  { week: 9.6, label: "Launch" },
];

const W = 1000;
const ML = 80;
const MR = 30;
const CW = W - ML - MR;
const TOTAL_H = 520;

// Vertical layout
const PHASE_Y = 45;
const PHASE_H = 34;
const COMMIT_Y = 90;
const COMMIT_H = 80;
const TECH_Y = 185;
const TECH_H = 110;
const FEATURE_Y = 310;
const FEATURE_H = 60;
const INTENSITY_Y = 390;
const INTENSITY_H = 50;
const LOC_Y = 455;
const LOC_H = 45;

function weekToX(week: number): number {
  return ML + (week / 10) * CW;
}

// ── Smooth curve generation ─────────────────────────────────────
function genCurve(seed: number, pts: number, amp: number): number[] {
  const rng = seededRandom(seed);
  const raw: number[] = [];
  for (let i = 0; i < pts; i++) {
    const t = i / (pts - 1);
    let y = 0;
    y += Math.sin(t * Math.PI * 2.5 + rng() * 5) * 0.3;
    y += Math.sin(t * Math.PI * 5.5 + rng() * 4) * 0.2;
    y += Math.sin(t * Math.PI * 9 + rng() * 3) * 0.15;
    y += Math.sin(t * Math.PI * 1.3 + rng() * 2) * 0.25;
    // Ramp up over time (more code written later)
    y += t * 0.4;
    raw.push((y + 1) * 0.5 * amp);
  }
  const smoothed: number[] = [];
  for (let i = 0; i < raw.length; i++) {
    let sum = 0, count = 0;
    for (let j = Math.max(0, i - 2); j <= Math.min(raw.length - 1, i + 2); j++) {
      sum += raw[j]; count++;
    }
    smoothed.push(sum / count);
  }
  return smoothed;
}

export function DevTimeline({ label, duration }: DevTimelineSection) {
  // ── Commit/activity dots ──────────────────────────────────────
  const commits = useMemo(() => {
    const rng = seededRandom(77);
    const result: { x: number; y: number; size: number; color: string; opacity: number }[] = [];
    // More commits in later phases
    for (let w = 0; w < 10; w++) {
      const phaseIdx = Math.floor(w / 2);
      const density = 8 + phaseIdx * 6 + Math.floor(rng() * 8);
      for (let d = 0; d < density; d++) {
        const week = w + rng();
        const x = weekToX(week);
        const y = COMMIT_Y + rng() * COMMIT_H;
        result.push({
          x, y,
          size: 0.5 + rng() * 2.2,
          color: PHASES[phaseIdx].color,
          opacity: 0.2 + rng() * 0.5,
        });
      }
    }
    return result;
  }, []);

  // ── Commit density ticks ──────────────────────────────────────
  const commitTicks = useMemo(() => {
    const rng = seededRandom(88);
    const result: { x: number; h: number; color: string; opacity: number }[] = [];
    for (let i = 0; i < 120; i++) {
      const week = rng() * 10;
      const phaseIdx = Math.min(4, Math.floor(week / 2));
      // More ticks in later weeks
      if (rng() > 0.3 + week * 0.04) continue;
      result.push({
        x: weekToX(week),
        h: 2 + rng() * 12,
        color: PHASES[phaseIdx].color,
        opacity: 0.1 + rng() * 0.2,
      });
    }
    return result;
  }, []);

  // ── Tech stack stream bands ───────────────────────────────────
  const techStreams = useMemo(() => {
    return TECH_STACK.map((tech, ti) => {
      const pts = 100;
      const bandH = TECH_H / TECH_STACK.length;
      const centerY = TECH_Y + ti * bandH + bandH / 2;
      const rng = seededRandom(ti * 13 + 5);

      // Build path points based on activity level
      const upper: string[] = [];
      const lower: string[] = [];
      for (let i = 0; i < pts; i++) {
        const t = i / (pts - 1);
        const week = t * 10;
        const phaseIdx = Math.min(4, Math.floor(week / 2));
        const phaseT = (week - phaseIdx * 2) / 2;
        // Interpolate activity between phases
        const nextPhase = Math.min(4, phaseIdx + 1);
        const activity = tech.active[phaseIdx] * (1 - phaseT) + tech.active[nextPhase] * phaseT;
        const thickness = activity * bandH * 0.4;
        const noise = Math.sin(t * Math.PI * 8 + rng() * 3) * 1.5;
        const x = ML + t * CW;
        upper.push(`${x.toFixed(1)},${(centerY - thickness + noise).toFixed(1)}`);
        lower.push(`${x.toFixed(1)},${(centerY + thickness + noise).toFixed(1)}`);
      }
      return { tech, upper, lower, centerY };
    });
  }, []);

  // ── Feature completion curve ──────────────────────────────────
  const featureCurve = useMemo(() => {
    const pts: string[] = [];
    const totalFeatures = MILESTONES.length;
    for (let i = 0; i < 100; i++) {
      const t = i / 99;
      const week = t * 10;
      const completed = MILESTONES.filter(m => m.week <= week).length;
      const pct = completed / totalFeatures;
      const x = ML + t * CW;
      const y = FEATURE_Y + FEATURE_H - pct * FEATURE_H;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  // ── Intensity heatmap ─────────────────────────────────────────
  const intensityCells = useMemo(() => {
    const rng = seededRandom(55);
    const cells: { x: number; w: number; intensity: number; color: string }[] = [];
    // 70 cells across the timeline (daily granularity)
    for (let d = 0; d < 70; d++) {
      const week = d / 7;
      const phaseIdx = Math.min(4, Math.floor(week / 2));
      const base = 0.3 + phaseIdx * 0.12;
      const intensity = Math.min(1, base + rng() * 0.3 + (week > 7 ? 0.15 : 0));
      cells.push({
        x: weekToX(week),
        w: CW / 70,
        intensity,
        color: PHASES[phaseIdx].color,
      });
    }
    return cells;
  }, []);

  // ── LOC accumulation curves ───────────────────────────────────
  const locCurves = useMemo(() => {
    return [
      { label: "Swift", curve: genCurve(201, 100, LOC_H * 0.9), color: "#C4A265" },
      { label: "Python", curve: genCurve(202, 100, LOC_H * 0.6), color: "#8B7D5E" },
      { label: "Config", curve: genCurve(203, 100, LOC_H * 0.3), color: "#9A8B6E" },
    ];
  }, []);

  // ── Connecting threads ────────────────────────────────────────
  const threads = useMemo(() => {
    const rng = seededRandom(111);
    const result: { d: string; color: string; opacity: number }[] = [];
    // Commits → Tech
    for (let i = 0; i < 30; i++) {
      const week = rng() * 10;
      const phaseIdx = Math.min(4, Math.floor(week / 2));
      const x1 = weekToX(week);
      const x2 = x1 + (rng() - 0.5) * 60;
      result.push({
        d: `M${x1},${COMMIT_Y + COMMIT_H} C${x1},${COMMIT_Y + COMMIT_H + 10} ${x2},${TECH_Y - 10} ${x2},${TECH_Y}`,
        color: PHASES[phaseIdx].color,
        opacity: 0.03 + rng() * 0.04,
      });
    }
    // Tech → Features
    for (let i = 0; i < 20; i++) {
      const week = rng() * 10;
      const phaseIdx = Math.min(4, Math.floor(week / 2));
      const x1 = weekToX(week);
      const x2 = x1 + (rng() - 0.5) * 40;
      result.push({
        d: `M${x1},${TECH_Y + TECH_H} C${x1},${TECH_Y + TECH_H + 8} ${x2},${FEATURE_Y - 8} ${x2},${FEATURE_Y + FEATURE_H * 0.5}`,
        color: PHASES[phaseIdx].color,
        opacity: 0.02 + rng() * 0.04,
      });
    }
    return result;
  }, []);

  return (
    <section className="w-full py-8">
      <div>
        {/* Header */}
        <div className="flex justify-between items-baseline mb-4 px-[calc(100%/12)]">
          <p className="text-[11px] tracking-[0.15em] uppercase text-[#141414]/60">
            {label}
          </p>
          <p className="text-[13px] text-[#141414]/50 italic">
            {duration}
          </p>
        </div>

        <div className="overflow-x-auto md:overflow-visible -mx-4 md:mx-0"
        data-lenis-prevent-touch>
          <div className="min-w-[800px] md:min-w-0 px-4 md:px-0">
        <svg
          viewBox={`0 0 ${W} ${TOTAL_H}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* ═══ Background grid ═══ */}
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`wk-${i}`}
              x1={weekToX(i)} y1={20}
              x2={weekToX(i)} y2={TOTAL_H - 10}
              stroke="#141414" strokeWidth={i % 2 === 0 ? 0.5 : 0.3}
              opacity={i % 2 === 0 ? 0.06 : 0.03}
            />
          ))}
          {/* Week numbers along top */}
          {Array.from({ length: 10 }).map((_, i) => (
            <text key={`wn-${i}`}
              x={weekToX(i + 0.5)} y={38}
              fill="#141414" fontSize={9} opacity={0.2}
              textAnchor="middle"
              style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
              {i + 1}
            </text>
          ))}
          <text x={ML - 2} y={38} fill="#141414" fontSize={9}
            opacity={0.55} letterSpacing={0.5} textAnchor="end">
            Week
          </text>

          {/* ═══ LAYER 1: Phase bars ═══ */}
          <text x={ML - 2} y={PHASE_Y + 4} fill="#141414" fontSize={9}
            opacity={0.55} letterSpacing={0.5} textAnchor="end">
            Phase
          </text>
          {PHASES.map((phase, i) => {
            const x = weekToX(phase.start);
            const w = weekToX(phase.end) - x;
            return (
              <g key={`ph-${i}`}>
                <rect x={x + 1} y={PHASE_Y - 10} width={w - 2} height={PHASE_H}
                  rx={4} fill={phase.color} opacity={0.75} />
                <text x={x + w / 2} y={PHASE_Y + 7}
                  fill="#141414" fontSize={8} fontWeight={600}
                  opacity={0.7} textAnchor="middle"
                  style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
                  {phase.name}
                </text>
              </g>
            );
          })}

          {/* ═══ LAYER 2: Commit activity scatter ═══ */}
          <text x={ML - 2} y={COMMIT_Y + 8} fill="#141414" fontSize={9}
            opacity={0.55} letterSpacing={0.5} textAnchor="end">
            Commits
          </text>
          {/* Density ticks */}
          {commitTicks.map((t, i) => (
            <line key={`ct-${i}`}
              x1={t.x} y1={COMMIT_Y + COMMIT_H}
              x2={t.x} y2={COMMIT_Y + COMMIT_H - t.h}
              stroke={t.color} strokeWidth={0.5} opacity={t.opacity} />
          ))}
          {/* Scatter dots */}
          {commits.map((c, i) => (
            <circle key={`cm-${i}`}
              cx={c.x} cy={c.y} r={c.size}
              fill={c.color} opacity={c.opacity} />
          ))}
          {/* Activity density line */}
          {(() => {
            const rng = seededRandom(333);
            const pts: string[] = [];
            for (let i = 0; i < 100; i++) {
              const t = i / 99;
              const week = t * 10;
              const base = 0.3 + (week / 10) * 0.6;
              const noise = Math.sin(t * Math.PI * 6 + 1.5) * 0.15 + Math.sin(t * Math.PI * 13) * 0.08;
              const val = Math.min(1, base + noise + rng() * 0.05);
              const x = ML + t * CW;
              const y = COMMIT_Y + COMMIT_H - val * COMMIT_H * 0.8;
              pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
            }
            return (
              <polyline points={pts.join(" ")} fill="none"
                stroke="#556B4A" strokeWidth={0.8} opacity={0.25} />
            );
          })()}

          {/* ═══ Connection threads ═══ */}
          {threads.map((t, i) => (
            <path key={`th-${i}`} d={t.d} fill="none"
              stroke={t.color} strokeWidth={0.5} opacity={t.opacity} />
          ))}

          {/* ═══ LAYER 3: Tech stack streams ═══ */}
          <text x={ML - 2} y={TECH_Y + 8} fill="#141414" fontSize={9}
            opacity={0.55} letterSpacing={0.5} textAnchor="end">
            Stack
          </text>
          {techStreams.map((stream, si) => (
            <g key={`ts-${si}`}>
              {/* Filled stream band */}
              <path
                d={`M${stream.upper.join(" L")} L${stream.lower.slice().reverse().join(" L")} Z`}
                fill={stream.tech.color}
                opacity={0.18}
              />
              {/* Center line */}
              <polyline
                points={stream.upper.map((pt, i) => {
                  const [x] = pt.split(",");
                  const [, yu] = pt.split(",");
                  const [, yl] = stream.lower[i].split(",");
                  return `${x},${((parseFloat(yu) + parseFloat(yl)) / 2).toFixed(1)}`;
                }).join(" ")}
                fill="none" stroke={stream.tech.color}
                strokeWidth={0.6} opacity={0.35}
              />
              {/* Label */}
              <text x={ML + CW + 6} y={stream.centerY + 2}
                fill="#141414" fontSize={8} opacity={0.45}>
                {stream.tech.name}
              </text>
            </g>
          ))}

          {/* ═══ LAYER 4: Feature completion ═══ */}
          <text x={ML - 2} y={FEATURE_Y + 8} fill="#141414" fontSize={9}
            opacity={0.55} letterSpacing={0.5} textAnchor="end">
            Features
          </text>
          {/* Completion area */}
          <polygon
            points={`${ML},${FEATURE_Y + FEATURE_H} ${featureCurve} ${ML + CW},${FEATURE_Y + FEATURE_H}`}
            fill="#B1BC94" opacity={0.1}
          />
          {/* Completion line */}
          <polyline points={featureCurve} fill="none"
            stroke="#6B8060" strokeWidth={1.2} opacity={0.45} />
          {/* Milestone markers */}
          {MILESTONES.map((m, i) => {
            const x = weekToX(m.week);
            const completed = MILESTONES.filter(ms => ms.week <= m.week).length;
            const pct = completed / MILESTONES.length;
            const y = FEATURE_Y + FEATURE_H - pct * FEATURE_H;
            return (
              <g key={`ms-${i}`}>
                <circle cx={x} cy={y} r={2} fill="#6B8060" opacity={0.5} />
                <line x1={x} y1={y} x2={x} y2={FEATURE_Y + FEATURE_H}
                  stroke="#6B8060" strokeWidth={0.3} opacity={0.12} />
                {/* Show every other label to avoid crowding */}
                {i % 2 === 0 && (
                  <text x={x} y={y - 5} fill="#141414" fontSize={6}
                    opacity={0.3} textAnchor="middle">
                    {m.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* ═══ LAYER 5: Effort intensity heatmap ═══ */}
          <text x={ML - 2} y={INTENSITY_Y + 8} fill="#141414" fontSize={9}
            opacity={0.55} letterSpacing={0.5} textAnchor="end">
            Effort
          </text>
          {intensityCells.map((cell, i) => (
            <rect key={`ic-${i}`}
              x={cell.x} y={INTENSITY_Y}
              width={cell.w + 0.5} height={INTENSITY_H}
              fill={cell.color} opacity={cell.intensity * 0.35}
            />
          ))}
          {/* Intensity contour line */}
          {(() => {
            const pts = intensityCells.map((c, i) => {
              const x = c.x + c.w / 2;
              const y = INTENSITY_Y + INTENSITY_H - c.intensity * INTENSITY_H * 0.9;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            });
            return <polyline points={pts.join(" ")} fill="none"
              stroke="#141414" strokeWidth={0.5} opacity={0.12} />;
          })()}

          {/* ═══ LAYER 6: Lines of code accumulation ═══ */}
          <text x={ML - 2} y={LOC_Y + 8} fill="#141414" fontSize={9}
            opacity={0.55} letterSpacing={0.5} textAnchor="end">
            Lines
          </text>
          {locCurves.map((lc, li) => {
            const pts = lc.curve.map((v, i) => {
              const x = ML + (i / (lc.curve.length - 1)) * CW;
              const y = LOC_Y + LOC_H - v;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            });
            const areaPath = `M${ML},${LOC_Y + LOC_H} L${pts.join(" L")} L${ML + CW},${LOC_Y + LOC_H} Z`;
            return (
              <g key={`loc-${li}`}>
                <path d={areaPath} fill={lc.color} opacity={0.08} />
                <polyline points={pts.join(" ")} fill="none"
                  stroke={lc.color} strokeWidth={0.8} opacity={0.35} />
                <text x={ML + CW + 6} y={LOC_Y + LOC_H - lc.curve[lc.curve.length - 1] + 3}
                  fill="#141414" fontSize={7} opacity={0.25}>
                  {lc.label}
                </text>
              </g>
            );
          })}

          {/* ═══ Horizontal dividers between layers ═══ */}
          {[COMMIT_Y - 5, TECH_Y - 5, FEATURE_Y - 5, INTENSITY_Y - 5, LOC_Y - 5].map((y, i) => (
            <line key={`div-${i}`}
              x1={ML} y1={y} x2={ML + CW} y2={y}
              stroke="#141414" strokeWidth={0.3} opacity={0.04} />
          ))}
        </svg>
          </div>
          <p className="text-[11px] text-center text-foreground/30 mt-2 md:hidden">Scroll to explore →</p>
        </div>
      </div>
    </section>
  );
}
