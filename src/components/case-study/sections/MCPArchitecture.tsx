"use client";

import { useMemo } from "react";
import { px } from "@/lib/px";

// ── Seeded random for deterministic particle generation ──────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Round computed coordinates so SSR and client serialize identical SVG
// attribute strings (Math.sin/cos can differ by a ULP across V8 builds).
const r2 = (n: number) => Math.round(n * 100) / 100;

// ── Polar helper (0° = top, clockwise) ───────────────────────────
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: r2(cx + r * Math.cos(rad)), y: r2(cy + r * Math.sin(rad)) };
}

// ── Monochrome palette — DSC has "no color in it" ────────────────
const BLACK = "#000000";
const INK = "#141414";
const STEEL_D = "#5C5C5C";
const STEEL = "#8E8E8E";
const STEEL_L = "#B5B5B5";
const CREAM = "#EFEBE4"; // page ground — used to knock nodes out of the web

// The 11 real MCP tools (live server). 9 reads, 2 writes.
const TOOLS = [
  { label: "gym_overview", kind: "read" },
  { label: "list_services", kind: "read" },
  { label: "list_trainers", kind: "read" },
  { label: "trainer_bio", kind: "read" },
  { label: "my_trainer", kind: "read" },
  { label: "my_trainer_availability", kind: "read" },
  { label: "my_sessions", kind: "read" },
  { label: "my_pending_requests", kind: "read" },
  { label: "suggest_slots", kind: "read" },
  { label: "request_session", kind: "write" },
  { label: "cancel_session", kind: "write" },
] as const;

// The engine's deterministic checks (inner ring)
const CHECKS = ["Availability", "Conflicts", "Capacity", "Duration", "Cancellation"];

// What the engine reads and writes (outer clusters)
const ENTITIES = [
  { label: "Athletes", sub: "100+", angle: 54, importance: 30 },
  { label: "Trainers", sub: "6", angle: 114, importance: 15 },
  { label: "Programs", sub: "", angle: 158, importance: 12 },
  { label: "Sessions", sub: "", angle: 214, importance: 22 },
  { label: "Hours", sub: "", angle: 250, importance: 14 },
  { label: "Locations", sub: "2", angle: 306, importance: 8 },
];

// Where athletes actually talk
const AI_CLIENTS = [
  { label: "Claude", angle: 334 },
  { label: "ChatGPT", angle: 6 },
  { label: "MCP clients", angle: 32 },
];

export function MCPArchitecture() {
  const CX = 500;
  const CY = 500;
  const R_CHECK = 150; // inner check ring
  const R_TOOL_A = 286; // tool pills (even index)
  const R_TOOL_B = 338; // tool pills (odd index)
  const R_ENTITY = 422; // data clusters
  const R_AI = 470; // AI clients
  const R_GUARD = 486; // guardrail labels

  const { particles, ambient, web, ticks } = useMemo(() => {
    const rng = seededRandom(7);
    // Weighted toward lighter greys so dense clusters stay airy, not black blobs
    const greys = [INK, STEEL_D, STEEL_D, STEEL, STEEL, STEEL, STEEL_L, STEEL_L, STEEL_L];
    const lightGreys = [STEEL, STEEL_L, STEEL_L];
    const particles: { x: number; y: number; r: number; color: string; opacity: number }[] = [];

    // Dense, overlapping clusters around each data entity
    ENTITIES.forEach((e) => {
      const c = polar(CX, CY, R_ENTITY, e.angle);
      const count = Math.round(e.importance * 18);
      for (let j = 0; j < count; j++) {
        const spread = 30 + rng() * 94;
        const a = rng() * Math.PI * 2;
        const dist = spread * (0.12 + rng() * 0.88);
        particles.push({
          x: r2(c.x + Math.cos(a) * dist),
          y: r2(c.y + Math.sin(a) * dist),
          r: r2(e.importance >= 22 ? 2.6 + rng() * 8.5 : 1.7 + rng() * 6),
          color: greys[Math.floor(rng() * greys.length)],
          opacity: r2(0.04 + rng() * 0.24),
        });
      }
    });

    // Ambient field — atmospheric dust scattered across the whole disc
    const ambient: { x: number; y: number; r: number; color: string; opacity: number }[] = [];
    for (let i = 0; i < 215; i++) {
      const rad = R_CHECK + 6 + rng() * (R_ENTITY + 36 - R_CHECK);
      const p = polar(CX, CY, rad, rng() * 360);
      ambient.push({
        x: p.x,
        y: p.y,
        r: r2(0.5 + rng() * 2.2),
        color: lightGreys[Math.floor(rng() * lightGreys.length)],
        opacity: r2(0.04 + rng() * 0.14),
      });
    }

    const web: { x1: number; y1: number; x2: number; y2: number; opacity: number; width: number; color: string }[] = [];
    // Atmospheric threads
    for (let i = 0; i < 165; i++) {
      const ra = R_CHECK + rng() * (R_AI - R_CHECK);
      const rb = R_CHECK + rng() * (R_AI - R_CHECK);
      const a1 = rng() * 360;
      const a2 = a1 + (rng() - 0.5) * 58;
      const f = polar(CX, CY, ra, a1);
      const t = polar(CX, CY, rb, a2);
      web.push({ x1: f.x, y1: f.y, x2: t.x, y2: t.y, opacity: r2(0.05 + rng() * 0.1), width: r2(0.2 + rng() * 0.45), color: STEEL });
    }
    // Spokes radiating outward
    for (let i = 0; i < 54; i++) {
      const angle = i * (360 / 54) + rng() * 5;
      const f = polar(CX, CY, R_CHECK + 24 + rng() * 30, angle);
      const t = polar(CX, CY, R_ENTITY + rng() * 64, angle + (rng() - 0.5) * 10);
      web.push({ x1: f.x, y1: f.y, x2: t.x, y2: t.y, opacity: r2(0.045 + rng() * 0.08), width: r2(0.18 + rng() * 0.32), color: STEEL_L });
    }

    // Perimeter measurement ticks — circos-like rim density
    const ticks: { x1: number; y1: number; x2: number; y2: number; opacity: number; width: number; color: string }[] = [];
    const TICK_N = 150;
    for (let i = 0; i < TICK_N; i++) {
      const ang = (360 / TICK_N) * i;
      const len = 3 + rng() * 11;
      const a = polar(CX, CY, 474, ang);
      const b = polar(CX, CY, 474 + len, ang);
      ticks.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, opacity: r2(0.2 + rng() * 0.34), width: i % 6 === 0 ? 1.3 : 0.7, color: i % 9 === 0 ? INK : STEEL_D });
    }

    return { particles, ambient, web, ticks };
  }, []);

  const toolNodes = TOOLS.map((t, i) => {
    const angle = (360 / TOOLS.length) * i;
    const r = i % 2 === 0 ? R_TOOL_A : R_TOOL_B;
    const p = polar(CX, CY, r, angle);
    return { ...t, angle, r, x: p.x, y: p.y };
  });

  return (
    <section className="w-full py-12 overflow-x-auto scrollbar-hide">
      <div className="min-w-[840px] max-w-[1000px] mx-auto px-4 md:px-0">
        <svg viewBox="0 0 1000 1000" className="w-full h-auto">
          {/* semi-transparent circular ground — its own backing, softly fading at the rim */}
          <defs>
            <radialGradient id="dscDiscBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F7F6F2" stopOpacity={0.76} />
              <stop offset="86%" stopColor="#F7F6F2" stopOpacity={0.72} />
              <stop offset="100%" stopColor="#F7F6F2" stopOpacity={0} />
            </radialGradient>
            <filter id="chipShadow" x="-20%" y="-25%" width="140%" height="175%">
              <feDropShadow dx="0" dy="0.8" stdDeviation="1.6" floodColor="#141414" floodOpacity="0.16" />
            </filter>
          </defs>
          <circle cx={CX} cy={CY} r={500} fill="url(#dscDiscBg)" />

          {/* faint ring guides */}
          {[R_CHECK, R_TOOL_A, R_TOOL_B, R_ENTITY].map((r, i) => (
            <circle key={`g${i}`} cx={CX} cy={CY} r={r} fill="none" stroke={STEEL_L} strokeWidth={0.5} opacity={0.25} strokeDasharray="2 7" />
          ))}
          <circle cx={CX} cy={CY} r={R_GUARD + 6} fill="none" stroke={STEEL} strokeWidth={0.7} opacity={0.46} />

          {/* perimeter measurement ticks */}
          {ticks.map((t, i) => (
            <line key={`k${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.color} strokeWidth={t.width} opacity={t.opacity} />
          ))}

          {/* atmospheric web */}
          {web.map((l, i) => (
            <line key={`w${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth={l.width} opacity={l.opacity} />
          ))}

          {/* ambient dust field */}
          {ambient.map((p, i) => (
            <circle key={`am${px(i)}`} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity={p.opacity} />
          ))}

          {/* particles (data clusters) */}
          {particles.map((p, i) => (
            <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity={p.opacity} />
          ))}

          {/* AI client → tool fan lines */}
          {AI_CLIENTS.map((ai, ci) => {
            const from = polar(CX, CY, R_AI - 14, ai.angle);
            return toolNodes.slice(ci * 2, ci * 2 + 5).map((tn, k) => (
              <line key={`f${ci}-${k}`} x1={from.x} y1={from.y} x2={tn.x} y2={tn.y} stroke={STEEL} strokeWidth={0.55} opacity={0.2} />
            ));
          })}

          {/* tool → engine connections */}
          {toolNodes.map((tn, i) => {
            const inner = polar(CX, CY, R_CHECK + 18, tn.angle);
            const isW = tn.kind === "write";
            return (
              <line key={`tc${i}`} x1={tn.x} y1={tn.y} x2={inner.x} y2={inner.y} stroke={isW ? INK : STEEL_D} strokeWidth={isW ? 1.4 : 1} opacity={isW ? 0.6 : 0.42} />
            );
          })}

          {/* entity labels */}
          {ENTITIES.map((e, i) => {
            const lp = polar(CX, CY, R_ENTITY + 48, e.angle);
            const anchor = lp.x < CX - 30 ? "end" : lp.x > CX + 30 ? "start" : "middle";
            return (
              <g key={`e${i}`}>
                <text x={lp.x} y={lp.y} textAnchor={anchor} fill={INK} fontSize={13} fontWeight={600} opacity={0.85} letterSpacing={0.3} stroke="#F4F2EC" strokeWidth={3.5} paintOrder="stroke" strokeLinejoin="round">
                  {e.label}
                </text>
                {e.sub && (
                  <text x={lp.x} y={lp.y + 15} textAnchor={anchor} fill={STEEL_D} fontSize={10} opacity={0.72} letterSpacing={0.3} stroke="#F4F2EC" strokeWidth={3} paintOrder="stroke" strokeLinejoin="round">
                    {e.sub}
                  </text>
                )}
              </g>
            );
          })}

          {/* tool pills */}
          {toolNodes.map((tn, i) => {
            const w = tn.label.length * 6.4 + 18;
            const isW = tn.kind === "write";
            return (
              <g key={`t${i}`}>
                <rect
                  x={tn.x - w / 2}
                  y={tn.y - 10}
                  width={w}
                  height={20}
                  rx={10}
                  fill={isW ? BLACK : "#FFFFFF"}
                  filter="url(#chipShadow)"
                />
                <text
                  x={tn.x}
                  y={tn.y + 3.5}
                  textAnchor="middle"
                  fill={isW ? CREAM : INK}
                  fontSize={10.5}
                  fontFamily="'SF Mono','Roboto Mono',ui-monospace,monospace"
                  letterSpacing={0.2}
                >
                  {tn.label}
                </text>
              </g>
            );
          })}

          {/* check ring (engine logic) */}
          {CHECKS.map((c, i) => {
            const angle = (360 / CHECKS.length) * i;
            const p = polar(CX, CY, R_CHECK, angle);
            const line = polar(CX, CY, 70, angle);
            return (
              <g key={`c${px(i)}`}>
                <line x1={p.x} y1={p.y} x2={line.x} y2={line.y} stroke={STEEL_D} strokeWidth={1} opacity={0.5} />
                <circle cx={p.x} cy={p.y} r={4.5} fill={STEEL_D} opacity={0.9} />
                <text x={p.x} y={p.y - 9} textAnchor="middle" fill={INK} fontSize={10} fontWeight={500} opacity={0.62} letterSpacing={0.3}>
                  {c}
                </text>
              </g>
            );
          })}

          {/* AI client pills */}
          {AI_CLIENTS.map((ai, i) => {
            const p = polar(CX, CY, R_AI, ai.angle);
            const w = ai.label.length * 6.6 + 22;
            return (
              <g key={`ai${px(i)}`}>
                <rect x={p.x - w / 2} y={p.y - 11} width={w} height={22} rx={11} fill="#FFFFFF" filter="url(#chipShadow)" />
                <text x={p.x} y={p.y + 3.5} textAnchor="middle" fill={INK} fontSize={11} fontWeight={600} letterSpacing={0.3}>
                  {ai.label}
                </text>
              </g>
            );
          })}

          {/* center engine */}
          <circle cx={CX} cy={CY} r={62} fill={INK} opacity={0.05} />
          <circle cx={CX} cy={CY} r={50} fill="#FFFFFF" filter="url(#chipShadow)" />
          <text x={CX} y={CY - 3} textAnchor="middle" fill={INK} fontSize={14} fontWeight={700} letterSpacing={0.2}>
            Scheduling
          </text>
          <text x={CX} y={CY + 14} textAnchor="middle" fill={INK} fontSize={14} fontWeight={700} letterSpacing={0.2}>
            Engine
          </text>
          <text x={CX} y={CY + 31} textAnchor="middle" fill={STEEL_D} fontSize={8} opacity={0.75} letterSpacing={2}>
            DETERMINISTIC
          </text>

          {/* top-left title */}
          <text x={26} y={40} fill={INK} fontSize={12} fontWeight={700} letterSpacing={1.2} opacity={0.6}>
            DALLAS SPORT COLLECTIVE
          </text>
          <text x={26} y={56} fill={STEEL_D} fontSize={10} opacity={0.5} letterSpacing={0.5}>
            MCP Architecture
          </text>

          {/* legend — tool surface */}
          <g transform="translate(26, 922)">
            <text x={0} y={0} fill={INK} fontSize={10} fontWeight={700} letterSpacing={1.2} opacity={0.55}>
              TOOL SURFACE
            </text>
            <circle cx={6} cy={18} r={5} fill="#FFFFFF" filter="url(#chipShadow)" />
            <text x={18} y={21} fill={INK} fontSize={11} opacity={0.5}>
              9 reads — instant
            </text>
            <rect x={1} y={31} width={10} height={10} rx={2.5} fill={BLACK} />
            <text x={18} y={39} fill={INK} fontSize={11} opacity={0.5}>
              2 writes — booking &amp; cancellation
            </text>
          </g>

          {/* legend — data model */}
          <g transform="translate(974, 922)">
            <text x={0} y={0} textAnchor="end" fill={INK} fontSize={10} fontWeight={700} letterSpacing={1.2} opacity={0.55}>
              DATA MODEL
            </text>
            <text x={0} y={20} textAnchor="end" fill={INK} fontSize={11} opacity={0.5}>
              athletes · trainers · sessions
            </text>
            <text x={0} y={37} textAnchor="end" fill={INK} fontSize={11} opacity={0.5}>
              programs · availability · locations
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}
