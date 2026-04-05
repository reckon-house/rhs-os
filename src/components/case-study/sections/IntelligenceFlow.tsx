"use client";

import { useMemo } from "react";
import type { IntelligenceFlowSection } from "@/lib/types";

// ── Seeded random ──────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ── Sally Marketing OS palette ──────────────────────────────────
const PALETTE = [
  "#C94545", "#C4946B", "#C4A878", "#8C8578", "#B1BC94",
  "#6B8060", "#A0886C", "#9B8E7E", "#D4736B", "#CC9878",
];

// ── Ring 1: Pipeline stages (inner ring) ────────────────────────
const PIPELINE_STEPS = [
  { label: "Signal\nCapture", angle: 0 },
  { label: "AI\nProcessing", angle: 60 },
  { label: "Insight\nGeneration", angle: 120 },
  { label: "Brief\nCreation", angle: 180 },
  { label: "Asset\nProduction", angle: 240 },
  { label: "Store\nExecution", angle: 300 },
];

// ── Ring 2: Technology stack ────────────────────────────────────
const TECH_STACK = [
  { label: "Claude Opus", color: "#C94545", angle: 10, w: 58 },
  { label: "Gemini 2.5 Pro", color: "#C4A878", angle: 55, w: 64 },
  { label: "Perplexity Sonar", color: "#8C8578", angle: 95, w: 72 },
  { label: "Knowledge Base", color: "#6B8060", angle: 140, w: 66 },
  { label: "Prompt Cache", color: "#A0886C", angle: 185, w: 58 },
  { label: "Asset Pipeline", color: "#B1BC94", angle: 230, w: 62 },
  { label: "Store Analytics", color: "#556B4A", angle: 275, w: 64 },
  { label: "Feedback Loop", color: "#C4946B", angle: 325, w: 62 },
];

// ── Ring 3: Data model ──────────────────────────────────────────
const DATA_NODES = [
  { label: "Publication", angle: 0, color: "#8C8578", r: 6, importance: 20 },
  { label: "Social Signal", angle: 18, color: "#8C8578", r: 5, importance: 16 },
  { label: "Competitor", angle: 35, color: "#8C8578", r: 7, importance: 22 },
  { label: "Pricing", angle: 52, color: "#C4A878", r: 5, importance: 14 },
  { label: "Trend Score", angle: 68, color: "#C4A878", r: 6, importance: 18 },
  { label: "Category", angle: 85, color: "#C4A878", r: 5, importance: 15 },
  { label: "Sally's Take", angle: 102, color: "#C94545", r: 8, importance: 28 },
  { label: "Threat", angle: 118, color: "#C4946B", r: 6, importance: 18 },
  { label: "Opportunity", angle: 135, color: "#C4946B", r: 7, importance: 22 },
  { label: "Signal", angle: 150, color: "#C4946B", r: 5, importance: 14 },
  { label: "Strategy", angle: 168, color: "#C94545", r: 7, importance: 24 },
  { label: "Channel Mix", angle: 185, color: "#C94545", r: 6, importance: 18 },
  { label: "Audience", angle: 200, color: "#C94545", r: 5, importance: 16 },
  { label: "KPI", angle: 215, color: "#D4736B", r: 4, importance: 12 },
  { label: "Timeline", angle: 230, color: "#D4736B", r: 4, importance: 10 },
  { label: "Digital", angle: 245, color: "#B1BC94", r: 6, importance: 20 },
  { label: "Email", angle: 258, color: "#B1BC94", r: 5, importance: 16 },
  { label: "Social", angle: 272, color: "#B1BC94", r: 7, importance: 22 },
  { label: "In-Store", angle: 286, color: "#6B8060", r: 6, importance: 18 },
  { label: "Shelf Talker", angle: 300, color: "#6B8060", r: 5, importance: 14 },
  { label: "Regional", angle: 315, color: "#6B8060", r: 5, importance: 16 },
  { label: "Performance", angle: 330, color: "#556B4A", r: 6, importance: 20 },
  { label: "Conversion", angle: 345, color: "#556B4A", r: 5, importance: 15 },
];

// ── Ring 4: AI decision points ──────────────────────────────────
const AI_DECISIONS = [
  { label: "Auto-Categorize Signal → Route to Strategist", angle: 8, color: "#8C8578" },
  { label: "Competitor Move → Generate Sally's Take", angle: 45, color: "#C4A878" },
  { label: "High Confidence → Auto-Brief Draft", angle: 82, color: "#C94545" },
  { label: "Multi-Signal → Trend Cluster Detection", angle: 118, color: "#C4946B" },
  { label: "Brief Complete → Trigger Asset Pipeline", angle: 155, color: "#C94545" },
  { label: "Brand Compliance → Auto-Scan Assets", angle: 192, color: "#B1BC94" },
  { label: "AI Tag → Confidence Score + Human Review", angle: 228, color: "#B1BC94" },
  { label: "Channel Optimize → A/B Variant Generation", angle: 265, color: "#6B8060" },
  { label: "Sell-Through Data → Next Cycle Intelligence", angle: 302, color: "#556B4A" },
  { label: "Performance Gap → Alert + Recommendation", angle: 338, color: "#C4946B" },
];

// ── Ring 5: Platform modules ────────────────────────────────────
const PLATFORM_MODULES = [
  { label: "Trends Feed", sub: "14 Sources", angle: 15, color: "#8C8578" },
  { label: "Brand Brain", sub: "Jim AI", angle: 87, color: "#C94545" },
  { label: "Briefing Engine", sub: "3 Tiers", angle: 159, color: "#C4946B" },
  { label: "Asset Hub", sub: "DAM + AI", angle: 231, color: "#B1BC94" },
  { label: "Utilities", sub: "10 Tools", angle: 303, color: "#6B8060" },
];

// ── Cross-ring connections ──────────────────────────────────────
const CONNECTIONS: [number, number][] = [
  [0, 0], [0, 1], [1, 2], [1, 3], [2, 4],
  [3, 5], [4, 0], [4, 1], [5, 2], [5, 3],
  [6, 4], [6, 5], [7, 0], [7, 1], [2, 2],
  [3, 3], [7, 4], [0, 5],
];

export function IntelligenceFlow({ stages }: IntelligenceFlowSection) {
  const CX = 500;
  const CY = 500;
  const R1 = 105;
  const R2 = 200;
  const R3 = 290;
  const R4 = 375;
  const R5 = 455;

  const particles = useMemo(() => {
    const rng = seededRandom(42);
    const dots: { x: number; y: number; r: number; color: string; opacity: number }[] = [];

    DATA_NODES.forEach((node) => {
      const center = polar(CX, CY, R3, node.angle);
      const count = Math.round(node.importance * 2.2);
      for (let j = 0; j < count; j++) {
        const spread = 30 + rng() * 50;
        const a = rng() * Math.PI * 2;
        const dist = spread * (0.2 + rng() * 0.8);
        dots.push({
          x: center.x + Math.cos(a) * dist,
          y: center.y + Math.sin(a) * dist,
          r: node.importance >= 20 ? 2 + rng() * 5 : 1 + rng() * 3.5,
          color: node.color,
          opacity: 0.08 + rng() * 0.32,
        });
      }
    });

    TECH_STACK.forEach((tech) => {
      const center = polar(CX, CY, R2, tech.angle);
      for (let j = 0; j < 22; j++) {
        const spread = 18 + rng() * 38;
        const a = rng() * Math.PI * 2;
        const dist = spread * (0.15 + rng() * 0.85);
        dots.push({
          x: center.x + Math.cos(a) * dist,
          y: center.y + Math.sin(a) * dist,
          r: 1.2 + rng() * 3.5,
          color: tech.color,
          opacity: 0.1 + rng() * 0.28,
        });
      }
    });

    for (let i = 0; i < 350; i++) {
      const ring = (R1 - 20) + rng() * (R5 - R1 + 60);
      const angle = rng() * 360;
      const pos = polar(CX, CY, ring, angle);
      dots.push({
        x: pos.x + (rng() - 0.5) * 20,
        y: pos.y + (rng() - 0.5) * 20,
        r: 0.3 + rng() * 2,
        color: PALETTE[Math.floor(rng() * PALETTE.length)],
        opacity: 0.03 + rng() * 0.12,
      });
    }

    AI_DECISIONS.forEach((d) => {
      const center = polar(CX, CY, R4, d.angle);
      for (let j = 0; j < 16; j++) {
        const spread = 14 + rng() * 32;
        const a = rng() * Math.PI * 2;
        const dist = spread * (0.2 + rng() * 0.8);
        dots.push({
          x: center.x + Math.cos(a) * dist,
          y: center.y + Math.sin(a) * dist,
          r: 1 + rng() * 3,
          color: d.color,
          opacity: 0.08 + rng() * 0.22,
        });
      }
    });

    PLATFORM_MODULES.forEach((p) => {
      const center = polar(CX, CY, R5, p.angle);
      for (let j = 0; j < 18; j++) {
        const spread = 18 + rng() * 35;
        const a = rng() * Math.PI * 2;
        const dist = spread * (0.2 + rng() * 0.8);
        dots.push({
          x: center.x + Math.cos(a) * dist,
          y: center.y + Math.sin(a) * dist,
          r: 1.2 + rng() * 3,
          color: p.color,
          opacity: 0.06 + rng() * 0.18,
        });
      }
    });

    PIPELINE_STEPS.forEach((step) => {
      const center = polar(CX, CY, R1, step.angle);
      for (let j = 0; j < 10; j++) {
        const spread = 20 + rng() * 30;
        const a = rng() * Math.PI * 2;
        const dist = spread * (0.3 + rng() * 0.7);
        dots.push({
          x: center.x + Math.cos(a) * dist,
          y: center.y + Math.sin(a) * dist,
          r: 0.8 + rng() * 2.5,
          color: PALETTE[Math.floor(rng() * PALETTE.length)],
          opacity: 0.05 + rng() * 0.15,
        });
      }
    });

    return dots;
  }, []);

  const webLines = useMemo(() => {
    const rng = seededRandom(77);
    const lines: { x1: number; y1: number; x2: number; y2: number; color: string; opacity: number; width: number }[] = [];

    DATA_NODES.forEach((node) => {
      AI_DECISIONS.forEach((d) => {
        const angleDiff = Math.abs(((node.angle - d.angle + 540) % 360) - 180);
        if (angleDiff < 45) {
          const from = polar(CX, CY, R3 + node.r, node.angle);
          const to = polar(CX, CY, R4, d.angle);
          lines.push({
            x1: from.x, y1: from.y, x2: to.x, y2: to.y,
            color: node.color, opacity: 0.14 + rng() * 0.12, width: 0.3 + rng() * 0.5,
          });
        }
      });
    });

    for (let i = 0; i < DATA_NODES.length; i++) {
      for (let j = i + 1; j < DATA_NODES.length; j++) {
        const angleDiff = Math.abs(((DATA_NODES[i].angle - DATA_NODES[j].angle + 540) % 360) - 180);
        if (angleDiff < 30 && rng() > 0.25) {
          const from = polar(CX, CY, R3, DATA_NODES[i].angle);
          const to = polar(CX, CY, R3, DATA_NODES[j].angle);
          lines.push({
            x1: from.x, y1: from.y, x2: to.x, y2: to.y,
            color: DATA_NODES[i].color, opacity: 0.1 + rng() * 0.1, width: 0.25 + rng() * 0.4,
          });
        }
      }
    }

    for (let i = 0; i < 90; i++) {
      const r1 = R1 + rng() * (R5 - R1);
      const r2 = R1 + rng() * (R5 - R1);
      const a1 = rng() * 360;
      const a2 = a1 + (rng() - 0.5) * 50;
      const from = polar(CX, CY, r1, a1);
      const to = polar(CX, CY, r2, a2);
      lines.push({
        x1: from.x, y1: from.y, x2: to.x, y2: to.y,
        color: PALETTE[Math.floor(rng() * PALETTE.length)],
        opacity: 0.08 + rng() * 0.1,
        width: 0.2 + rng() * 0.4,
      });
    }

    for (let i = 0; i < 36; i++) {
      const angle = i * 10 + rng() * 6;
      const rStart = R1 + 35 + rng() * 30;
      const rEnd = R4 + rng() * 80;
      const from = polar(CX, CY, rStart, angle);
      const to = polar(CX, CY, rEnd, angle + (rng() - 0.5) * 12);
      lines.push({
        x1: from.x, y1: from.y, x2: to.x, y2: to.y,
        color: PALETTE[Math.floor(rng() * PALETTE.length)],
        opacity: 0.1 + rng() * 0.1,
        width: 0.25 + rng() * 0.45,
      });
    }

    TECH_STACK.forEach((tech) => {
      DATA_NODES.forEach((node) => {
        const angleDiff = Math.abs(((tech.angle - node.angle + 540) % 360) - 180);
        if (angleDiff < 30 && rng() > 0.5) {
          const from = polar(CX, CY, R2 + 15, tech.angle);
          const to = polar(CX, CY, R3 - 10, node.angle);
          lines.push({
            x1: from.x, y1: from.y, x2: to.x, y2: to.y,
            color: tech.color, opacity: 0.12 + rng() * 0.1, width: 0.25 + rng() * 0.4,
          });
        }
      });
    });

    return lines;
  }, []);

  return (
    <section className="w-full py-12">
      <div className="w-full max-w-[960px] mx-auto px-4 md:px-0">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-auto"
          style={{ fontFamily: "'Satoshi', system-ui, sans-serif" }}
        >
          {/* ── Grid ── */}
          {Array.from({ length: 11 }).map((_, i) => {
            const pos = (i + 1) * (1000 / 12);
            return (
              <g key={`grid-${i}`}>
                <line x1={pos} y1={0} x2={pos} y2={1000} stroke="#141414" strokeWidth={0.5} opacity={0.1} />
                <line x1={0} y1={pos} x2={1000} y2={pos} stroke="#141414" strokeWidth={0.5} opacity={0.1} />
              </g>
            );
          })}

          {/* ── Concentric rings ── */}
          {[R1, R2, R3, R4, R5, 150, 245, 330, 410, 170, 260, 350, 425].map((r, i) => (
            <circle key={`ring-${i}`} cx={CX} cy={CY} r={r}
              fill="none" stroke="#141414"
              strokeWidth={i < 5 ? 0.4 : 0.2}
              opacity={i < 5 ? 0.06 : 0.025}
              strokeDasharray={i >= 5 ? "1,3" : "none"}
            />
          ))}

          {/* ── Radial grid ── */}
          {Array.from({ length: 120 }).map((_, i) => {
            const angle = i * 3;
            const major = angle % 30 === 0;
            const mid = angle % 15 === 0;
            const inner = polar(CX, CY, R1 - 10, angle);
            const outer = polar(CX, CY, R5 + 20, angle);
            return (
              <line key={`radial-${i}`}
                x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                stroke="#141414"
                strokeWidth={major ? 0.25 : mid ? 0.15 : 0.08}
                opacity={major ? 0.04 : mid ? 0.025 : 0.012}
              />
            );
          })}

          {/* ── Connection web ── */}
          {webLines.map((line, i) => (
            <line key={`web-${i}`}
              x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              stroke={line.color} strokeWidth={line.width} opacity={line.opacity}
            />
          ))}

          {/* ── Tech → Pipeline curves ── */}
          {CONNECTIONS.map(([techIdx, pipeIdx], i) => {
            const tech = TECH_STACK[techIdx];
            const pipe = PIPELINE_STEPS[pipeIdx];
            const from = polar(CX, CY, R2, tech.angle);
            const to = polar(CX, CY, R1 + 32, pipe.angle);
            const ctrl = polar(CX, CY, (R1 + R2) * 0.38, (tech.angle + pipe.angle) / 2);
            return (
              <path key={`conn-${i}`}
                d={`M${from.x},${from.y} Q${ctrl.x},${ctrl.y} ${to.x},${to.y}`}
                fill="none" stroke={tech.color}
                strokeWidth={0.9} opacity={0.18}
              />
            );
          })}

          {/* ── Data → Tech connections ── */}
          {DATA_NODES.map((node, i) => {
            const from = polar(CX, CY, R3, node.angle);
            const nearest = TECH_STACK.reduce((best, t) => {
              const d = Math.abs(((t.angle - node.angle + 540) % 360) - 180);
              const bd = Math.abs(((best.angle - node.angle + 540) % 360) - 180);
              return d < bd ? t : best;
            });
            const to = polar(CX, CY, R2 + 15, nearest.angle);
            return (
              <line key={`dm-c-${i}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={node.color} strokeWidth={0.5} opacity={0.16}
              />
            );
          })}

          {/* ── Particles ── */}
          {particles.map((dot, i) => (
            <circle key={`p-${i}`}
              cx={dot.x} cy={dot.y} r={dot.r}
              fill={dot.color} opacity={dot.opacity}
            />
          ))}

          {/* ── Ring 5: Platform modules ── */}
          {PLATFORM_MODULES.map((mod, i) => {
            const arcStart = polar(CX, CY, R5, mod.angle - 32);
            const arcEnd = polar(CX, CY, R5, mod.angle + 32);
            const labelPos = polar(CX, CY, R5 + 32, mod.angle);
            const n = ((mod.angle % 360) + 360) % 360;
            const anchor = n > 90 && n < 270 ? "end" as const : "start" as const;
            return (
              <g key={`mod-${i}`}>
                <path
                  d={`M${arcStart.x},${arcStart.y} A${R5},${R5} 0 0,1 ${arcEnd.x},${arcEnd.y}`}
                  fill="none" stroke={mod.color}
                  strokeWidth={14} opacity={0.25}
                  strokeLinecap="round"
                />
                <text x={labelPos.x} y={labelPos.y - 5}
                  textAnchor={anchor} fill="#141414"
                  fontSize={9} fontWeight={600} opacity={0.55}
                  dominantBaseline="middle"
                >{mod.label}</text>
                <text x={labelPos.x} y={labelPos.y + 7}
                  textAnchor={anchor} fill="#141414"
                  fontSize={8} fontWeight={400} opacity={0.4}
                  dominantBaseline="middle"
                >{mod.sub}</text>
              </g>
            );
          })}

          {/* ── Ring 4: AI decisions ── */}
          {AI_DECISIONS.map((decision, i) => {
            const pos = polar(CX, CY, R4, decision.angle);
            const n = ((decision.angle % 360) + 360) % 360;
            const anchor = n > 90 && n < 270 ? "end" as const : "start" as const;
            const labelPos = polar(CX, CY, R4 + 16, decision.angle);
            return (
              <g key={`ai-${i}`}>
                <circle cx={pos.x} cy={pos.y} r={12} fill={decision.color} opacity={0.05} />
                <circle cx={pos.x} cy={pos.y} r={7} fill={decision.color} opacity={0.1} />
                <circle cx={pos.x} cy={pos.y} r={3.5} fill={decision.color} opacity={0.5} />
                <text x={labelPos.x} y={labelPos.y}
                  textAnchor={anchor} fill="#141414"
                  fontSize={7} opacity={0.4}
                  dominantBaseline="middle"
                >{decision.label}</text>
              </g>
            );
          })}

          {/* ── Ring 3: Data nodes ── */}
          {DATA_NODES.map((node, i) => {
            const pos = polar(CX, CY, R3, node.angle);
            const n = ((node.angle % 360) + 360) % 360;
            const anchor = n > 90 && n < 270 ? "end" as const : "start" as const;
            const labelPos = polar(CX, CY, R3 + 14 + node.r, node.angle);
            return (
              <g key={`dm-${i}`}>
                {node.importance >= 18 && (
                  <circle cx={pos.x} cy={pos.y} r={node.r + 8} fill={node.color} opacity={0.05} />
                )}
                <circle cx={pos.x} cy={pos.y} r={node.r} fill={node.color} opacity={0.6} />
                <text x={labelPos.x} y={labelPos.y}
                  textAnchor={anchor} fill="#141414"
                  fontSize={8} fontWeight={500} opacity={0.55}
                  dominantBaseline="middle"
                >{node.label}</text>
              </g>
            );
          })}

          {/* ── Ring 2: Tech pills ── */}
          {TECH_STACK.map((tech, i) => {
            const pos = polar(CX, CY, R2, tech.angle);
            return (
              <g key={`tech-${i}`}>
                <rect
                  x={pos.x - tech.w / 2 - 4} y={pos.y - 15}
                  width={tech.w + 8} height={30}
                  rx={15} fill={tech.color} opacity={0.06}
                />
                <rect
                  x={pos.x - tech.w / 2} y={pos.y - 11}
                  width={tech.w} height={22}
                  rx={11} fill={tech.color} opacity={0.88}
                />
                <text x={pos.x} y={pos.y}
                  textAnchor="middle" dominantBaseline="central"
                  fill="#fff" fontSize={7.5} fontWeight={600}
                >{tech.label}</text>
              </g>
            );
          })}

          {/* ── Ring 1: Pipeline steps ── */}
          {PIPELINE_STEPS.map((step, i) => {
            const pos = polar(CX, CY, R1, step.angle);
            const lines = step.label.split("\n");
            const next = PIPELINE_STEPS[(i + 1) % 6];
            const a1 = polar(CX, CY, R1, step.angle + 20);
            const a2 = polar(CX, CY, R1, (i < 5 ? next.angle : step.angle + 60) - 20);
            return (
              <g key={`pipe-${i}`}>
                {i < 5 && (
                  <path
                    d={`M${a1.x},${a1.y} A${R1},${R1} 0 0,1 ${a2.x},${a2.y}`}
                    fill="none" stroke="#141414"
                    strokeWidth={0.6} opacity={0.08}
                    strokeDasharray="2,4"
                  />
                )}
                <circle cx={pos.x} cy={pos.y} r={36}
                  fill="#F3F0ED" stroke="#141414" strokeWidth={0.5} opacity={0.15} />
                <circle cx={pos.x} cy={pos.y} r={32}
                  fill="#F3F0ED" stroke="#141414" strokeWidth={0.3} opacity={0.08} />
                <text x={pos.x} y={pos.y - 2}
                  textAnchor="middle" fontSize={6.5} fontWeight={600}
                  fill="#141414" opacity={0.35} letterSpacing="0.02em"
                >
                  <tspan x={pos.x} dy="0">{String(i + 1).padStart(2, "0")}</tspan>
                </text>
                {lines.map((l, li) => (
                  <text key={li} x={pos.x} y={pos.y + 6 + li * 10}
                    textAnchor="middle" fontSize={8} fontWeight={600}
                    fill="#141414" opacity={0.6}
                  >{l}</text>
                ))}
              </g>
            );
          })}

          {/* ── Center hub ── */}
          <circle cx={CX} cy={CY} r={60} fill="#F3F0ED" stroke="#141414" strokeWidth={0.5} opacity={0.12} />
          <circle cx={CX} cy={CY} r={55} fill="#F3F0ED" stroke="#141414" strokeWidth={0.3} opacity={0.06} />
          <text x={CX} y={CY - 4} textAnchor="middle" fontSize={14} fontWeight={500}
            fill="#141414" opacity={0.5} letterSpacing="0.08em"
            style={{ fontFamily: "'Ogg', serif" }}
          >SALLY</text>
          <text x={CX} y={CY + 12} textAnchor="middle" fontSize={7} fontWeight={400}
            fill="#141414" opacity={0.3} letterSpacing="0.12em"
          >MARKETING OS</text>

          {/* ── Legend ── */}
          <g transform="translate(30, 850)">
            <text fontSize={9} fontWeight={700} fill="#141414" opacity={0.5} letterSpacing="0.08em">Ring Index</text>
            {[
              { label: "Pipeline Flow", color: "none", stroke: true },
              { label: "Technology Stack", color: "#C4A878" },
              { label: "Data Model", color: "#B1BC94" },
              { label: "AI Decision Points", color: "#C4946B" },
              { label: "Platform Modules", color: "#6B8060" },
            ].map((item, i) => (
              <g key={i} transform={`translate(0, ${18 + i * 16})`}>
                <circle cx={6} cy={0} r={4}
                  fill={item.color === "none" ? "none" : item.color}
                  stroke={item.stroke ? "#141414" : "none"}
                  strokeWidth={item.stroke ? 0.5 : 0}
                  opacity={0.5}
                />
                <text x={16} y={0} fontSize={8} fill="#141414" opacity={0.45} dominantBaseline="middle">
                  {item.label}
                </text>
              </g>
            ))}
          </g>

          <g transform="translate(750, 850)">
            <text fontSize={9} fontWeight={700} fill="#141414" opacity={0.5} letterSpacing="0.08em">Data Categories</text>
            {[
              { label: "Sources / Signals", color: "#8C8578" },
              { label: "AI Processing", color: "#C4A878" },
              { label: "Insights / Strategy", color: "#C94545" },
              { label: "Assets / Production", color: "#B1BC94" },
              { label: "Stores / Performance", color: "#6B8060" },
            ].map((item, i) => (
              <g key={i} transform={`translate(0, ${18 + i * 16})`}>
                <circle cx={6} cy={0} r={4} fill={item.color} opacity={0.5} />
                <text x={16} y={0} fontSize={8} fill="#141414" opacity={0.45} dominantBaseline="middle">
                  {item.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
}
