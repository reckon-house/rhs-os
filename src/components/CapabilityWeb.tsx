"use client";

import { useMemo } from "react";
import { ScrambleOnView } from "@/components/fx/ScrambleText";

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

const CX = 500, CY = 500;
const R1 = 108;   // discipline nodes
const R2 = 215;   // skill nodes
const R3 = 310;   // tools / sub-skills
const R4 = 395;   // method details
const R5 = 465;   // outer label arcs

// ── Palette — muted earthy tones matching career galaxy ───────────
const DIGITAL_COLORS  = ["#7A8B5A", "#B1BC94", "#6B8060", "#8FA07A", "#556B4A", "#C4C4A0"];
const BRAND_COLORS    = ["#CC5555", "#BB6666", "#C4876A", "#AA4455", "#DD7777", "#C47070"];
const INTERIOR_COLORS = ["#C4A265", "#AA7E44", "#8B7355", "#A0886C", "#9B8E7E", "#CC9966"];
const ALL_COLORS      = [...DIGITAL_COLORS, ...BRAND_COLORS, ...INTERIOR_COLORS];

// ── Discipline nodes (Ring 1) ─────────────────────────────────────
const DISCIPLINES = [
  { label: "Digital", angle: 0,   color: "#6B8060", colors: DIGITAL_COLORS },
  { label: "Branding", angle: 120, color: "#BB6666", colors: BRAND_COLORS },
  { label: "Interiors", angle: 240, color: "#AA7E44", colors: INTERIOR_COLORS },
];

// ── Skill nodes (Ring 2) ──────────────────────────────────────────
const SKILLS = [
  // Digital zone — spread around 0°
  { label: "Full-Stack Eng", angle: 318, disc: 0, importance: 22, color: "#7A8B5A" },
  { label: "AI Integration", angle: 334, disc: 0, importance: 24, color: "#6B8060" },
  { label: "Systems Design", angle: 350, disc: 0, importance: 20, color: "#8FA07A" },
  { label: "Product Strategy", angle: 9,  disc: 0, importance: 18, color: "#B1BC94" },
  { label: "Rapid Prototyping", angle: 24, disc: 0, importance: 16, color: "#556B4A" },
  { label: "No-Code Arch", angle: 40,  disc: 0, importance: 14, color: "#7A8B5A" },
  // Branding zone — spread around 120°
  { label: "Brand Strategy", angle: 80,  disc: 1, importance: 22, color: "#BB6666" },
  { label: "Creative Direction", angle: 97,  disc: 1, importance: 24, color: "#CC5555" },
  { label: "Visual Identity", angle: 114, disc: 1, importance: 22, color: "#C4876A" },
  { label: "3D & Motion", angle: 131, disc: 1, importance: 18, color: "#BB6666" },
  { label: "Gen. Imagery", angle: 147, disc: 1, importance: 16, color: "#AA4455" },
  { label: "Content Systems", angle: 163, disc: 1, importance: 14, color: "#C47070" },
  // Interiors zone — spread around 240°
  { label: "Int. Architecture", angle: 200, disc: 2, importance: 24, color: "#C4A265" },
  { label: "FF&E Sourcing", angle: 218, disc: 2, importance: 20, color: "#AA7E44" },
  { label: "Custom Fabrication", angle: 237, disc: 2, importance: 18, color: "#8B7355" },
  { label: "Installation Mgmt", angle: 256, disc: 2, importance: 14, color: "#9B8E7E" },
  { label: "Experiential", angle: 273, disc: 2, importance: 16, color: "#A0886C" },
];

// ── Tool nodes (Ring 3) ───────────────────────────────────────────
const TOOLS = [
  // Digital tools
  { label: "React / Next.js", angle: 320, color: "#7A8B5A", r: 4.5 },
  { label: "Tailwind", angle: 330, color: "#B1BC94", r: 3.5 },
  { label: "OpenAI API", angle: 340, color: "#6B8060", r: 5 },
  { label: "Computer Vision", angle: 350, color: "#8FA07A", r: 4 },
  { label: "LLMs", angle: 359, color: "#7A8B5A", r: 4.5 },
  { label: "Framer", angle: 10,  color: "#556B4A", r: 3.5 },
  { label: "Webflow", angle: 18, color: "#8FA07A", r: 3.5 },
  { label: "Replit / V0", angle: 28, color: "#6B8060", r: 4 },
  { label: "Spline", angle: 38,  color: "#7A8B5A", r: 3.5 },
  // Brand tools
  { label: "Art Direction", angle: 78,  color: "#BB6666", r: 4.5 },
  { label: "Voice & Tone", angle: 89,  color: "#C47070", r: 3.5 },
  { label: "Typography", angle: 100, color: "#CC5555", r: 4 },
  { label: "Color Systems", angle: 110, color: "#BB6666", r: 4 },
  { label: "After Effects", angle: 122, color: "#C4876A", r: 4 },
  { label: "Midjourney", angle: 133, color: "#CC5555", r: 4.5 },
  { label: "Custom LoRA", angle: 144, color: "#AA4455", r: 3.5 },
  { label: "Social Grids", angle: 155, color: "#C47070", r: 3.5 },
  { label: "Email Arch", angle: 165, color: "#BB6666", r: 3.5 },
  // Interior tools
  { label: "Space Planning", angle: 200, color: "#C4A265", r: 4.5 },
  { label: "FF&E", angle: 212, color: "#AA7E44", r: 4 },
  { label: "Millwork Design", angle: 224, color: "#8B7355", r: 4 },
  { label: "Material Selection", angle: 236, color: "#C4A265", r: 3.5 },
  { label: "On-site Direction", angle: 248, color: "#9B8E7E", r: 3.5 },
  { label: "Pop-up / Retail", angle: 260, color: "#A0886C", r: 4 },
  { label: "Fabrication", angle: 272, color: "#8B7355", r: 4 },
];

// ── Cross-discipline connection pairs [skillIdx, skillIdx] ────────
const CROSS_CONNECTIONS: [number, number][] = [
  [2, 6],   // Systems Design ↔ Brand Strategy
  [3, 6],   // Product Strategy ↔ Brand Strategy
  [4, 9],   // Rapid Prototyping ↔ 3D & Motion
  [0, 8],   // Full-Stack Eng ↔ Visual Identity
  [5, 11],  // No-Code Arch ↔ Content Systems
  [11, 16], // Content Systems ↔ Experiential
  [9, 12],  // 3D & Motion ↔ Int. Architecture
  [10, 16], // Gen. Imagery ↔ Experiential
  [7, 12],  // Creative Direction ↔ Int. Architecture
  [1, 10],  // AI Integration ↔ Gen. Imagery
];

// ── Outer label arcs ──────────────────────────────────────────────
const OUTER_LABELS = [
  { label: "DIGITAL EXPERIENCES & SOFTWARE", angle: 0,   color: "#6B8060" },
  { label: "BRANDING & CREATIVE DIRECTION",  angle: 120, color: "#BB6666" },
  { label: "INTERIORS & FABRICATION",        angle: 240, color: "#AA7E44" },
];

/**
 * Heading + meta block for the Practice section. Exported standalone so the
 * 3D Showpiece variant can render the same heading above its canvas.
 */
export function CapabilityWebHeader({ dark = false }: { dark?: boolean } = {}) {
  const inkClass = dark ? "text-[#F0EAE4]" : "text-[#141414]";
  const inkSoft = dark ? "text-[#F0EAE4]/75" : "text-foreground/90";
  const inkDim = dark ? "text-[#F0EAE4]/60" : "text-foreground/80";
  const pillBg = dark ? "bg-[#F0EAE4]/[0.08]" : "bg-[#141414]/[0.06]";

  return (
    <div className="mb-12">
      <span className={`inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase ${inkClass} font-medium px-4 py-2 rounded-full ${pillBg} mb-5`}>
        <ScrambleOnView text="SECTION 04: PRACTICE" />
      </span>
      <h2 className={`text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold ${inkClass}`}>
        The work of Jeremy Prasatik.
      </h2>
      <p className={`text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-normal ${inkClass} mb-6`}>
        Three practices. Twenty disciplines. Digital, branding, and interiors — each complete on its own, each made stronger by the others.
      </p>

      <div className={`text-spec ${inkSoft}`}>
        <p>
          <span className="font-bold">Studio </span>
          Reckon House  Multi-disciplinary
        </p>
        <p>
          <span className="font-bold">Founded </span>
          2002  Location: Texas / Anywhere  Status: Open for projects
        </p>
        <p>
          <span className="font-bold">Classification </span>
          Digital  Branding  Interiors
        </p>
      </div>

      <div className={`mt-6 md:mt-4 md:ml-[48%] text-body ${inkDim}`}>
        <p className={`font-bold ${inkClass} indent-[4em]`}>Abstract</p>
        <p className="indent-[4em]">
          One studio, three practices, no handoff. Apps that ship. Brands that hold up. Rooms people actually live in. Designed and built by the same hands from concept through production.
        </p>
        <p className="mt-4">
          The chart below shows the full range, plotted as a web. Disciplines at the center, skills in the middle ring, tools and methods at the edge. Every node connects.
        </p>
      </div>
    </div>
  );
}

/**
 * The 2D SVG chart, rendered standalone. Used as the fallback / mobile
 * version when the 3D Showpiece is the active variant.
 */
export function CapabilityWebChart2D({ dark = false }: { dark?: boolean } = {}) {
  // ── Theme colors — flip when on dark bg ────────────────────────
  const INK = dark ? "#F0EAE4" : "#141414";          // text + grid lines
  const SURFACE = dark ? "#1F1F1F" : "#efebe4";      // disc + hub fills
  const HUB_RING = dark ? "#3A3530" : "#c0bbb4";     // hub ring stroke

  // ── Particles ──────────────────────────────────────────────────
  const particles = useMemo(() => {
    const rng = seededRandom(42);
    const dots: { x: number; y: number; r: number; color: string; opacity: number }[] = [];

    // Dense clusters around each skill node
    SKILLS.forEach((skill) => {
      const center = polar(CX, CY, R2, skill.angle);
      const count = Math.round(skill.importance * 2.4);
      for (let j = 0; j < count; j++) {
        const spread = 28 + rng() * 52;
        const a = rng() * Math.PI * 2;
        const dist = spread * (0.15 + rng() * 0.85);
        dots.push({
          x: center.x + Math.cos(a) * dist,
          y: center.y + Math.sin(a) * dist,
          r: skill.importance >= 20 ? 2 + rng() * 5.5 : 1 + rng() * 3.5,
          color: skill.color,
          opacity: 0.07 + rng() * 0.3,
        });
      }
    });

    // Clusters around tool nodes
    TOOLS.forEach((tool) => {
      const center = polar(CX, CY, R3, tool.angle);
      for (let j = 0; j < 18; j++) {
        const spread = 16 + rng() * 36;
        const a = rng() * Math.PI * 2;
        dots.push({
          x: center.x + Math.cos(a) * (spread * (0.15 + rng() * 0.85)),
          y: center.y + Math.sin(a) * (spread * (0.15 + rng() * 0.85)),
          r: 1 + rng() * 3,
          color: tool.color,
          opacity: 0.08 + rng() * 0.25,
        });
      }
    });

    // Clusters around discipline nodes
    DISCIPLINES.forEach((disc) => {
      const center = polar(CX, CY, R1, disc.angle);
      for (let j = 0; j < 30; j++) {
        const spread = 20 + rng() * 40;
        const a = rng() * Math.PI * 2;
        dots.push({
          x: center.x + Math.cos(a) * (spread * (0.2 + rng() * 0.8)),
          y: center.y + Math.sin(a) * (spread * (0.2 + rng() * 0.8)),
          r: 1.2 + rng() * 4,
          color: disc.color,
          opacity: 0.06 + rng() * 0.22,
        });
      }
    });

    // Atmospheric scatter
    for (let i = 0; i < 400; i++) {
      const ring = (R1 - 30) + rng() * (R5 - R1 + 50);
      const angle = rng() * 360;
      const pos = polar(CX, CY, ring, angle);
      dots.push({
        x: pos.x + (rng() - 0.5) * 18,
        y: pos.y + (rng() - 0.5) * 18,
        r: 0.3 + rng() * 2,
        color: ALL_COLORS[Math.floor(rng() * ALL_COLORS.length)],
        opacity: 0.02 + rng() * 0.1,
      });
    }

    // R4 detail ring scatter
    for (let i = 0; i < 120; i++) {
      const angle = rng() * 360;
      const pos = polar(CX, CY, R4 + (rng() - 0.5) * 30, angle);
      const discIdx = Math.floor(angle / 120) % 3;
      dots.push({
        x: pos.x,
        y: pos.y,
        r: 0.5 + rng() * 2.5,
        color: DISCIPLINES[discIdx].color,
        opacity: 0.04 + rng() * 0.14,
      });
    }

    return dots;
  }, []);

  // ── Web lines ──────────────────────────────────────────────────
  const webLines = useMemo(() => {
    const rng = seededRandom(77);
    const lines: { x1: number; y1: number; x2: number; y2: number; color: string; opacity: number; width: number }[] = [];

    // Skill → discipline radial
    SKILLS.forEach((skill) => {
      const disc = DISCIPLINES[skill.disc];
      const from = polar(CX, CY, R2 - 12, skill.angle);
      const to   = polar(CX, CY, R1 + 30, disc.angle);
      lines.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, color: skill.color, opacity: 0.12 + rng() * 0.08, width: 0.4 + rng() * 0.5 });
    });

    // Tool → nearest skill
    TOOLS.forEach((tool) => {
      const nearest = SKILLS.reduce((best, s) => {
        const d = Math.abs(((s.angle - tool.angle + 540) % 360) - 180);
        const bd = Math.abs(((best.angle - tool.angle + 540) % 360) - 180);
        return d < bd ? s : best;
      });
      const from = polar(CX, CY, R3 - 8, tool.angle);
      const to   = polar(CX, CY, R2 + 14, nearest.angle);
      lines.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, color: tool.color, opacity: 0.1 + rng() * 0.08, width: 0.3 + rng() * 0.4 });
    });

    // Skill → neighboring skill (same discipline)
    for (let i = 0; i < SKILLS.length; i++) {
      for (let j = i + 1; j < SKILLS.length; j++) {
        if (SKILLS[i].disc === SKILLS[j].disc) {
          const angleDiff = Math.abs(((SKILLS[i].angle - SKILLS[j].angle + 540) % 360) - 180);
          if (angleDiff < 28 && rng() > 0.3) {
            const from = polar(CX, CY, R2, SKILLS[i].angle);
            const to   = polar(CX, CY, R2, SKILLS[j].angle);
            lines.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, color: SKILLS[i].color, opacity: 0.08 + rng() * 0.08, width: 0.25 + rng() * 0.35 });
          }
        }
      }
    }

    // Cross-discipline connections
    CROSS_CONNECTIONS.forEach(([ai, bi]) => {
      const from = polar(CX, CY, R2, SKILLS[ai].angle);
      const to   = polar(CX, CY, R2, SKILLS[bi].angle);
      const ctrl = { x: CX + (from.x - CX) * 0.3 + (to.x - CX) * 0.3, y: CY + (from.y - CY) * 0.3 + (to.y - CY) * 0.3 };
      lines.push({ x1: from.x, y1: from.y, x2: ctrl.x, y2: ctrl.y, color: SKILLS[ai].color, opacity: 0.14, width: 0.5 });
      lines.push({ x1: ctrl.x, y1: ctrl.y, x2: to.x, y2: to.y, color: SKILLS[bi].color, opacity: 0.14, width: 0.5 });
    });

    // Atmospheric threads
    for (let i = 0; i < 100; i++) {
      const r1t = R1 + rng() * (R5 - R1);
      const r2t = R1 + rng() * (R5 - R1);
      const a1 = rng() * 360;
      const a2 = a1 + (rng() - 0.5) * 55;
      const from = polar(CX, CY, r1t, a1);
      const to   = polar(CX, CY, r2t, a2);
      lines.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, color: ALL_COLORS[Math.floor(rng() * ALL_COLORS.length)], opacity: 0.05 + rng() * 0.08, width: 0.15 + rng() * 0.35 });
    }

    // Spokes from center outward
    for (let i = 0; i < 36; i++) {
      const angle = i * 10 + rng() * 5;
      const from = polar(CX, CY, R1 + 30 + rng() * 25, angle);
      const to   = polar(CX, CY, R4 + rng() * 70, angle + (rng() - 0.5) * 14);
      lines.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, color: ALL_COLORS[Math.floor(rng() * ALL_COLORS.length)], opacity: 0.07 + rng() * 0.08, width: 0.2 + rng() * 0.4 });
    }

    return lines;
  }, []);

  return (
    <div className="w-full">
      {/* Chart — horizontal scroll on mobile */}
      <div className="overflow-x-auto md:overflow-x-visible">
      <div className="min-w-[800px] md:min-w-0 w-full max-w-[960px] mx-auto px-4 md:px-0">
        <svg viewBox="0 0 1000 1000" className="w-full h-auto" style={{ fontFamily: "'Satoshi', system-ui, sans-serif" }}>

          {/* ── Background square grid ── */}
          {Array.from({ length: 11 }).map((_, i) => {
            const pos = (i + 1) * (1000 / 12);
            return (
              <g key={`grid-${i}`}>
                <line x1={pos} y1={0} x2={pos} y2={1000} stroke={INK} strokeWidth={0.5} opacity={0.1} />
                <line x1={0} y1={pos} x2={1000} y2={pos} stroke={INK} strokeWidth={0.5} opacity={0.1} />
              </g>
            );
          })}

          {/* ── Concentric rings ── */}
          {[R1, R2, R3, R4, R5, 155, 260, 350, 430, 180, 295, 370].map((r, i) => (
            <circle key={`ring-${i}`} cx={CX} cy={CY} r={r} fill="none" stroke={INK}
              strokeWidth={i < 5 ? 0.4 : 0.2} opacity={i < 5 ? 0.06 : 0.025}
              strokeDasharray={i >= 5 ? "1,3" : "none"} />
          ))}

          {/* ── Dense radial grid ── */}
          {Array.from({ length: 120 }).map((_, i) => {
            const angle = i * 3;
            const major = angle % 30 === 0;
            const mid   = angle % 15 === 0;
            const inner = polar(CX, CY, R1 - 12, angle);
            const outer = polar(CX, CY, R5 + 22, angle);
            return (
              <line key={`radial-${i}`} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                stroke={INK} strokeWidth={major ? 0.25 : mid ? 0.15 : 0.08}
                opacity={major ? 0.04 : mid ? 0.025 : 0.012} />
            );
          })}

          {/* ── Web lines ── */}
          {webLines.map((line, i) => (
            <line key={`web-${i}`} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              stroke={line.color} strokeWidth={line.width} opacity={line.opacity} />
          ))}

          {/* ── Particle field ── */}
          {particles.map((dot, i) => (
            <circle key={`p-${i}`} cx={dot.x} cy={dot.y} r={dot.r} fill={dot.color} opacity={dot.opacity} />
          ))}

          {/* ── Outer label arcs (R5) ── */}
          {OUTER_LABELS.map((label, i) => {
            const arcStart = polar(CX, CY, R5, label.angle - 52);
            const arcEnd   = polar(CX, CY, R5, label.angle + 52);
            const labelPos = polar(CX, CY, R5 + 28, label.angle);
            const n = ((label.angle % 360) + 360) % 360;
            const anchor = n > 90 && n < 270 ? "end" as const : "start" as const;
            return (
              <g key={`outer-${i}`}>
                <path d={`M${arcStart.x},${arcStart.y} A${R5},${R5} 0 0,1 ${arcEnd.x},${arcEnd.y}`}
                  fill="none" stroke={label.color} strokeWidth={12} opacity={0.18} strokeLinecap="round" />
                <text x={labelPos.x} y={labelPos.y} textAnchor={anchor} fill={label.color}
                  fontSize={7.5} fontWeight={700} opacity={0.55} dominantBaseline="middle"
                  letterSpacing="0.08em">
                  {label.label}
                </text>
              </g>
            );
          })}

          {/* ── Tool nodes (R3) — small dots + labels ── */}
          {TOOLS.map((tool, i) => {
            const pos = polar(CX, CY, R3, tool.angle);
            const n = ((tool.angle % 360) + 360) % 360;
            const anchor = n > 90 && n < 270 ? "end" as const : "start" as const;
            const labelPos = polar(CX, CY, R3 + 14 + tool.r, tool.angle);
            return (
              <g key={`tool-${i}`}>
                <circle cx={pos.x} cy={pos.y} r={tool.r + 6} fill={tool.color} opacity={0.05} />
                <circle cx={pos.x} cy={pos.y} r={tool.r} fill={tool.color} opacity={0.55} />
                <text x={labelPos.x} y={labelPos.y} textAnchor={anchor} fill={INK}
                  fontSize={7.5} fontWeight={500} opacity={0.5} dominantBaseline="middle">
                  {tool.label}
                </text>
              </g>
            );
          })}

          {/* ── Skill nodes (R2) — pills ── */}
          {SKILLS.map((skill, i) => {
            const pos = polar(CX, CY, R2, skill.angle);
            const w = skill.label.length * 4.8 + 12;
            return (
              <g key={`skill-${i}`}>
                <rect x={pos.x - w / 2 - 4} y={pos.y - 15} width={w + 8} height={30} rx={15}
                  fill={skill.color} opacity={0.06} />
                <rect x={pos.x - w / 2} y={pos.y - 11} width={w} height={22} rx={11}
                  fill={skill.color} opacity={0.85} />
                <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
                  fill="#fff" fontSize={7.5} fontWeight={600}>
                  {skill.label}
                </text>
              </g>
            );
          })}

          {/* ── Discipline nodes (R1) ── */}
          {DISCIPLINES.map((disc, i) => {
            const pos = polar(CX, CY, R1, disc.angle);
            return (
              <g key={`disc-${i}`}>
                <circle cx={pos.x} cy={pos.y} r={50} fill={disc.color} opacity={0.04} />
                <circle cx={pos.x} cy={pos.y} r={38} fill={SURFACE} stroke={disc.color}
                  strokeWidth={1} opacity={0.92} />
                <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
                  fill={disc.color} fontSize={8} fontWeight={700} opacity={0.8} letterSpacing="0.05em">
                  {disc.label.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* ── Center: RHS ── */}
          <circle cx={CX} cy={CY} r={52} fill="#8A8580" opacity={0.05} />
          <circle cx={CX} cy={CY} r={42} fill={SURFACE} stroke={HUB_RING} strokeWidth={0.8} opacity={0.88} />
          <text x={CX} y={CY + 2} textAnchor="middle" fill={INK} fontSize={11}
            fontWeight={600} opacity={0.55} letterSpacing="0.12em">
            RHS
          </text>

          {/* ── Legend ── */}
          <g transform="translate(32, 880)">
            <text fill={INK} fontSize={9} fontWeight={700} opacity={0.45} letterSpacing={1.5}>RING INDEX</text>
            {[
              { label: "Discipline", color: INK, shape: "ring" },
              { label: "Skill / Practice", color: "#4488BB", shape: "pill" },
              { label: "Tool / Method", color: "#AA7E44", shape: "dot" },
            ].map((item, i) => (
              <g key={i} transform={`translate(0, ${18 + i * 18})`}>
                {item.shape === "ring" ? (
                  <circle cx={7} cy={-2} r={5.5} fill="none" stroke={item.color} strokeWidth={1.2} opacity={0.5} />
                ) : item.shape === "pill" ? (
                  <rect x={0} y={-7} width={14} height={10} rx={5} fill={item.color} opacity={0.7} />
                ) : (
                  <circle cx={7} cy={-2} r={5.5} fill={item.color} opacity={0.6} />
                )}
                <text x={22} y={2} fill={INK} fontSize={10} opacity={0.45}>{item.label}</text>
              </g>
            ))}
          </g>

          <g transform="translate(790, 880)">
            <text fill={INK} fontSize={9} fontWeight={700} opacity={0.45} letterSpacing={1.5}>DISCIPLINES</text>
            {DISCIPLINES.map((d, i) => (
              <g key={i} transform={`translate(0, ${18 + i * 18})`}>
                <circle cx={-5} cy={-2} r={5.5} fill={d.color} opacity={0.6} />
                <text x={6} y={2} fill={INK} fontSize={10} opacity={0.45}>{d.label}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>
      </div>
    </div>
  );
}

/**
 * Default export — composes the heading + 2D chart for backwards compatibility.
 * Use this when you don't need the 3D Showpiece variant.
 */
export function CapabilityWeb({ dark = false }: { dark?: boolean } = {}) {
  return (
    <div className="w-full">
      <CapabilityWebHeader dark={dark} />
      <CapabilityWebChart2D dark={dark} />
    </div>
  );
}
