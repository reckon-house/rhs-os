"use client";

import { useMemo } from "react";

// ── Seeded random for deterministic particle generation ──────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Polar helper ─────────────────────────────────────────────────
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ── Core data ────────────────────────────────────────────────────
const PALETTE = [
  "#B1BC94", "#C4A265", "#8B7355", "#6B8060", "#556B4A",
  "#A0886C", "#8C8578", "#9B8E7E", "#C4C4A0", "#8FA07A",
];

const PIPELINE_STEPS = [
  { label: "Image\nCapture", angle: 0 },
  { label: "Vision\nProcessing", angle: 60 },
  { label: "Object\nIdentification", angle: 120 },
  { label: "Value\nEstimation", angle: 180 },
  { label: "Archive\nEntry", angle: 240 },
  { label: "Financial\nAnalysis", angle: 300 },
];

const TECH_STACK = [
  { label: "Python", color: "#8B7355", angle: 15, w: 52 },
  { label: "Streamlit", color: "#B1BC94", angle: 55, w: 52 },
  { label: "OpenAI Vision API", color: "#C4A265", angle: 95, w: 78 },
  { label: "Supabase PostgreSQL", color: "#6B8060", angle: 145, w: 82 },
  { label: "Vercel", color: "#A0886C", angle: 195, w: 42 },
  { label: "Claude Code", color: "#1A1A1A", angle: 235, w: 58 },
  { label: "Supabase Auth", color: "#8C8578", angle: 280, w: 62 },
  { label: "Supabase Storage", color: "#9B8E7E", angle: 330, w: 72 },
];

const DATA_NODES = [
  { label: "User", angle: 3, color: "#B1BC94", r: 5, importance: 15 },
  { label: "Home", angle: 20, color: "#B1BC94", r: 6, importance: 18 },
  { label: "Room", angle: 40, color: "#B1BC94", r: 7, importance: 20 },
  { label: "Item", angle: 62, color: "#C4A265", r: 8, importance: 25 },
  { label: "Photo", angle: 80, color: "#C4A265", r: 5, importance: 15 },
  { label: "Category", angle: 98, color: "#C4A265", r: 6, importance: 18 },
  { label: "Material", angle: 116, color: "#8B7355", r: 4, importance: 10 },
  { label: "Style", angle: 130, color: "#8B7355", r: 4, importance: 10 },
  { label: "Era", angle: 144, color: "#8B7355", r: 3.5, importance: 8 },
  { label: "Condition", angle: 158, color: "#8B7355", r: 5, importance: 12 },
  { label: "Value", angle: 175, color: "#6B8060", r: 7, importance: 22 },
  { label: "Receipt", angle: 192, color: "#6B8060", r: 5, importance: 14 },
  { label: "Document", angle: 210, color: "#6B8060", r: 6, importance: 16 },
  { label: "Appraisal", angle: 226, color: "#6B8060", r: 5, importance: 12 },
  { label: "Coverage", angle: 243, color: "#556B4A", r: 7, importance: 20 },
  { label: "Policy", angle: 260, color: "#556B4A", r: 6, importance: 18 },
  { label: "Gap", angle: 275, color: "#556B4A", r: 5, importance: 15 },
  { label: "Report", angle: 292, color: "#556B4A", r: 6, importance: 16 },
  { label: "PDF Export", angle: 310, color: "#9B8E7E", r: 5, importance: 12 },
  { label: "Confidence", angle: 328, color: "#A0886C", r: 5, importance: 14 },
  { label: "Threshold", angle: 346, color: "#A0886C", r: 4, importance: 10 },
];

const AI_DECISIONS = [
  { label: "Low Confidence → User Review", angle: 18, color: "#C4A265" },
  { label: "Multiple Items → Split Detection", angle: 63, color: "#C4A265" },
  { label: "Ambiguous Category → Suggest Top 3", angle: 108, color: "#8B7355" },
  { label: "Bad Lighting → Re-scan Prompt", angle: 153, color: "#8B7355" },
  { label: "Partial View → Merge Request", angle: 198, color: "#A0886C" },
  { label: "High Value → Documentation Flag", angle: 243, color: "#6B8060" },
  { label: "Duplicate → Match & Merge", angle: 288, color: "#556B4A" },
  { label: "Coverage Gap → Alert Trigger", angle: 333, color: "#556B4A" },
];

const DEV_PROCESS = [
  { label: "Concept Validation", sub: "Wk 1-2", angle: 0, color: "#C4C4A0" },
  { label: "Architecture", sub: "Wk 3-4", angle: 72, color: "#B1BC94" },
  { label: "Interface Design + Build", sub: "Wk 5-6", angle: 144, color: "#8FA07A" },
  { label: "Financial Layer", sub: "Wk 7-8", angle: 216, color: "#6B8060" },
  { label: "Brand + Go-to-Market", sub: "Wk 9-10", angle: 288, color: "#556B4A" },
];

const CONNECTIONS: [number, number][] = [
  [2, 1], [2, 2], [0, 0], [0, 1], [0, 3],
  [3, 4], [3, 5], [6, 0], [7, 4], [1, 0],
  [1, 5], [4, 0], [5, 1], [0, 2], [1, 3],
  [5, 2], [7, 0], [3, 3],
];

// ── Component ───────────────────────────────────────────────────
export function SystemArchitecture() {
  const CX = 500;
  const CY = 500;
  const R1 = 105;
  const R2 = 200;
  const R3 = 290;
  const R4 = 375;
  const R5 = 455;

  // Generate all particles — ENLARGED clusters that nearly overlap
  const particles = useMemo(() => {
    const rng = seededRandom(42);
    const dots: { x: number; y: number; r: number; color: string; opacity: number }[] = [];

    // Cluster particles around each data node — 2.5x bigger spread, more particles
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

    // Big clusters around tech stack nodes
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

    // Atmospheric scatter — more of them, spread wider
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

    // Dense AI decision clusters
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

    // Dev timeline scatter — generous
    DEV_PROCESS.forEach((p) => {
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

    // Pipeline step clusters too
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

  // Web of connection lines — darker now
  const webLines = useMemo(() => {
    const rng = seededRandom(77);
    const lines: { x1: number; y1: number; x2: number; y2: number; color: string; opacity: number; width: number }[] = [];

    // Cross-ring connections (data model → AI decisions)
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

    // Data node to data node connections
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

    // Atmospheric threads
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

    // Spoke lines from center outward
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

    // Tech → data model radial connections
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
          {/* ── Background square grid ── */}
          {Array.from({ length: 11 }).map((_, i) => {
            const pos = (i + 1) * (1000 / 12);
            return (
              <g key={`grid-${i}`}>
                <line x1={pos} y1={0} x2={pos} y2={1000} stroke="#141414" strokeWidth={0.5} opacity={0.1} />
                <line x1={0} y1={pos} x2={1000} y2={pos} stroke="#141414" strokeWidth={0.5} opacity={0.1} />
              </g>
            );
          })}

          {/* ── Concentric ring guides ── */}
          {[R1, R2, R3, R4, R5, 150, 245, 330, 410, 170, 260, 350, 425].map((r, i) => (
            <circle
              key={`ring-${i}`}
              cx={CX} cy={CY} r={r}
              fill="none" stroke="#141414"
              strokeWidth={i < 5 ? 0.4 : 0.2}
              opacity={i < 5 ? 0.06 : 0.025}
              strokeDasharray={i >= 5 ? "1,3" : "none"}
            />
          ))}

          {/* ── Dense radial grid ── */}
          {Array.from({ length: 120 }).map((_, i) => {
            const angle = i * 3;
            const major = angle % 30 === 0;
            const mid = angle % 15 === 0;
            const inner = polar(CX, CY, R1 - 10, angle);
            const outer = polar(CX, CY, R5 + 20, angle);
            return (
              <line
                key={`radial-${i}`}
                x1={inner.x} y1={inner.y}
                x2={outer.x} y2={outer.y}
                stroke="#141414"
                strokeWidth={major ? 0.25 : mid ? 0.15 : 0.08}
                opacity={major ? 0.04 : mid ? 0.025 : 0.012}
              />
            );
          })}

          {/* ── Web of connection lines (darker) ── */}
          {webLines.map((line, i) => (
            <line
              key={`web-${i}`}
              x1={line.x1} y1={line.y1}
              x2={line.x2} y2={line.y2}
              stroke={line.color}
              strokeWidth={line.width}
              opacity={line.opacity}
            />
          ))}

          {/* ── Tech → Pipeline curved connections (darker) ── */}
          {CONNECTIONS.map(([techIdx, pipeIdx], i) => {
            const tech = TECH_STACK[techIdx];
            const pipe = PIPELINE_STEPS[pipeIdx];
            const from = polar(CX, CY, R2, tech.angle);
            const to = polar(CX, CY, R1 + 32, pipe.angle);
            const ctrl = polar(CX, CY, (R1 + R2) * 0.38, (tech.angle + pipe.angle) / 2);
            return (
              <path
                key={`conn-${i}`}
                d={`M${from.x},${from.y} Q${ctrl.x},${ctrl.y} ${to.x},${to.y}`}
                fill="none" stroke={tech.color}
                strokeWidth={0.9} opacity={0.18}
              />
            );
          })}

          {/* ── Data model → tech connections (darker) ── */}
          {DATA_NODES.map((node, i) => {
            const from = polar(CX, CY, R3, node.angle);
            const nearest = TECH_STACK.reduce((best, t) => {
              const d = Math.abs(((t.angle - node.angle + 540) % 360) - 180);
              const bd = Math.abs(((best.angle - node.angle + 540) % 360) - 180);
              return d < bd ? t : best;
            });
            const to = polar(CX, CY, R2 + 15, nearest.angle);
            return (
              <line
                key={`dm-c-${i}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={node.color} strokeWidth={0.5} opacity={0.16}
              />
            );
          })}

          {/* ── Particle field (enlarged clusters) ── */}
          {particles.map((dot, i) => (
            <circle
              key={`p-${i}`}
              cx={dot.x} cy={dot.y} r={dot.r}
              fill={dot.color} opacity={dot.opacity}
            />
          ))}

          {/* ── Ring 5: Dev Process arcs ── */}
          {DEV_PROCESS.map((phase, i) => {
            const arcStart = polar(CX, CY, R5, phase.angle - 32);
            const arcEnd = polar(CX, CY, R5, phase.angle + 32);
            const labelPos = polar(CX, CY, R5 + 32, phase.angle);
            const n = ((phase.angle % 360) + 360) % 360;
            const anchor = n > 90 && n < 270 ? "end" as const : "start" as const;
            return (
              <g key={`dev-${i}`}>
                <path
                  d={`M${arcStart.x},${arcStart.y} A${R5},${R5} 0 0,1 ${arcEnd.x},${arcEnd.y}`}
                  fill="none" stroke={phase.color}
                  strokeWidth={14} opacity={0.25}
                  strokeLinecap="round"
                />
                <text
                  x={labelPos.x} y={labelPos.y - 5}
                  textAnchor={anchor} fill="#141414"
                  fontSize={9} fontWeight={600} opacity={0.55}
                  dominantBaseline="middle"
                >
                  {phase.label}
                </text>
                <text
                  x={labelPos.x} y={labelPos.y + 7}
                  textAnchor={anchor} fill="#141414"
                  fontSize={8} fontWeight={400} opacity={0.4}
                  dominantBaseline="middle"
                >
                  {phase.sub}
                </text>
              </g>
            );
          })}

          {/* ── Ring 4: AI Decision nodes with halos ── */}
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
                <text
                  x={labelPos.x} y={labelPos.y}
                  textAnchor={anchor} fill="#141414"
                  fontSize={7} opacity={0.4}
                  dominantBaseline="middle"
                >
                  {decision.label}
                </text>
              </g>
            );
          })}

          {/* ── Ring 3: Data Model nodes ── */}
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
                <text
                  x={labelPos.x} y={labelPos.y}
                  textAnchor={anchor} fill="#141414"
                  fontSize={8} fontWeight={500} opacity={0.55}
                  dominantBaseline="middle"
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* ── Ring 2: Tech Stack pills ── */}
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
                <text
                  x={pos.x} y={pos.y}
                  textAnchor="middle" dominantBaseline="central"
                  fill="#fff" fontSize={7.5} fontWeight={600}
                >
                  {tech.label}
                </text>
              </g>
            );
          })}

          {/* ── Ring 1: Pipeline Steps ── */}
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
                <circle cx={pos.x} cy={pos.y} r={38} fill="#141414" opacity={0.015} />
                <circle
                  cx={pos.x} cy={pos.y} r={30}
                  fill="#efebe4" stroke="#c0bbb4"
                  strokeWidth={1} opacity={0.92}
                />
                <text
                  x={pos.x} y={pos.y - 9}
                  textAnchor="middle" fill="#141414"
                  fontSize={6} fontWeight={700} opacity={0.25}
                >
                  {String(i + 1).padStart(2, "0")}
                </text>
                {lines.map((line, li) => (
                  <text
                    key={li}
                    x={pos.x} y={pos.y + 1 + li * 9}
                    textAnchor="middle" fill="#141414"
                    fontSize={7} fontWeight={600} opacity={0.65}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* ── Center: Soft A.R.C. with Ogg ── */}
          <circle cx={CX} cy={CY} r={52} fill="#B1BC94" opacity={0.06} />
          <circle cx={CX} cy={CY} r={44} fill="#efebe4" stroke="#c0bbb4" strokeWidth={0.8} opacity={0.85} />
          <text
            x={CX} y={CY + 2} textAnchor="middle"
            fill="#141414" fontSize={18} fontWeight={400} opacity={0.7}
            letterSpacing={0}
            style={{ fontFamily: "'Ogg', Georgia, serif" }}
          >
            <tspan>a.</tspan>
            <tspan dx={4}>r.</tspan>
            <tspan dx={4}>c.</tspan>
          </text>

          {/* ── Legends ── */}
          <g transform="translate(30, 870)">
            <text fill="#141414" fontSize={10} fontWeight={700} opacity={0.55} letterSpacing={1.5}>
              Ring Index
            </text>
            {[
              { label: "Recognition Pipeline", color: "#141414", shape: "ring" },
              { label: "Technology Stack", color: "#8B7355", shape: "pill" },
              { label: "Data Model", color: "#B1BC94", shape: "dot" },
              { label: "AI Decision Points", color: "#C4A265", shape: "dot" },
              { label: "Development Timeline", color: "#6B8060", shape: "arc" },
            ].map((item, i) => (
              <g key={i} transform={`translate(0, ${20 + i * 20})`}>
                {item.shape === "ring" ? (
                  <circle cx={7} cy={-2} r={5.5} fill="none" stroke={item.color} strokeWidth={1.2} opacity={0.55} />
                ) : item.shape === "pill" ? (
                  <rect x={0} y={-7} width={14} height={10} rx={5} fill={item.color} opacity={0.65} />
                ) : item.shape === "arc" ? (
                  <path d="M0,-2 A7,7 0 0,1 14,-2" fill="none" stroke={item.color} strokeWidth={3.5} opacity={0.4} />
                ) : (
                  <circle cx={7} cy={-2} r={5.5} fill={item.color} opacity={0.55} />
                )}
                <text x={22} y={2} fill="#141414" fontSize={11} opacity={0.5}>
                  {item.label}
                </text>
              </g>
            ))}
          </g>

          <g transform="translate(780, 870)">
            <text fill="#141414" fontSize={10} fontWeight={700} opacity={0.55} letterSpacing={1.5}>
              Data Categories
            </text>
            {[
              { label: "User / Spaces", color: "#B1BC94" },
              { label: "Items / Assets", color: "#C4A265" },
              { label: "AI Attributes", color: "#8B7355" },
              { label: "Financial", color: "#6B8060" },
              { label: "Insurance", color: "#556B4A" },
            ].map((item, i) => (
              <g key={i} transform={`translate(0, ${20 + i * 20})`}>
                <circle cx={-5} cy={-2} r={5.5} fill={item.color} opacity={0.55} />
                <text x={6} y={2} fill="#141414" fontSize={11} opacity={0.5}>
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
