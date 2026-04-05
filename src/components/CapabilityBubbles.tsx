"use client";

import { useMemo } from "react";

const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const W = 900;
const H = 480;

const categories = [
  {
    id: "digital",
    label: "Digital Experiences & Software",
    cx: 155,
    cy: 240,
    color: "#4488BB",
    colors: ["#4488BB", "#5599CC", "#3377AA", "#6699BB", "#2266AA"],
    skills: [
      { name: "Full-Stack Eng", sub: "React, Next.js, Tailwind", size: 52 },
      { name: "AI Integration", sub: "OpenAI, Vision, LLMs", size: 50 },
      { name: "Rapid Proto", sub: "Replit, V0, Spline", size: 40 },
      { name: "No-Code Arch", sub: "Framer, Webflow", size: 36 },
      { name: "Product Strategy", sub: "MVP, Roadmap", size: 38 },
      { name: "Systems Design", sub: "UI/UX Frameworks", size: 42 },
    ],
  },
  {
    id: "branding",
    label: "Branding",
    cx: 450,
    cy: 240,
    color: "#CC3355",
    colors: ["#CC3355", "#DD5577", "#BB2244", "#EE6688", "#AA1133"],
    skills: [
      { name: "Brand Strategy", sub: "Positioning, Voice", size: 50 },
      { name: "Creative Dir.", sub: "Campaign, Art Direction", size: 52 },
      { name: "Visual Identity", sub: "Logo, Type, Color", size: 48 },
      { name: "3D & Motion", sub: "Spline, AE, Renders", size: 40 },
      { name: "Gen. Imagery", sub: "Midjourney, LoRA", size: 38 },
      { name: "Content Systems", sub: "Social, Email Arch", size: 36 },
    ],
  },
  {
    id: "interiors",
    label: "Interiors",
    cx: 745,
    cy: 240,
    color: "#AA7E44",
    colors: ["#AA7E44", "#BB9055", "#997033", "#CC9E66", "#886228"],
    skills: [
      { name: "Int. Architecture", sub: "Space Planning, Flow", size: 52 },
      { name: "FF&E Sourcing", sub: "Furniture, Fixtures", size: 46 },
      { name: "Custom Fab.", sub: "Millwork, Materials", size: 42 },
      { name: "Installation Mgmt", sub: "On-site Direction", size: 36 },
      { name: "Experiential", sub: "Retail, Pop-up, Event", size: 40 },
    ],
  },
];

// Pack bubbles around a center using concentric ring placement
function packBubbles(
  skills: { name: string; sub: string; size: number }[],
  cx: number,
  cy: number,
  seedBase: number
): { x: number; y: number; r: number; name: string; sub: string }[] {
  const rng = seeded(seedBase);
  const placed: { x: number; y: number; r: number; name: string; sub: string }[] = [];

  // Sort largest first
  const sorted = [...skills].sort((a, b) => b.size - a.size);

  // First bubble at center with slight jitter
  const first = sorted[0];
  placed.push({ x: cx + (rng() - 0.5) * 10, y: cy + (rng() - 0.5) * 10, r: first.size, name: first.name, sub: first.sub });

  // Ring 1: up to 3 bubbles
  const ring1 = sorted.slice(1, 4);
  const r1dist = 100;
  ring1.forEach((skill, i) => {
    const baseAngle = (i / ring1.length) * Math.PI * 2 - Math.PI / 2;
    const jitter = (rng() - 0.5) * 0.3;
    const angle = baseAngle + jitter;
    const dist = r1dist + (rng() - 0.5) * 15;
    placed.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      r: skill.size,
      name: skill.name,
      sub: skill.sub,
    });
  });

  // Ring 2: remaining bubbles
  const ring2 = sorted.slice(4);
  const r2dist = 155;
  ring2.forEach((skill, i) => {
    const baseAngle = (i / Math.max(ring2.length, 1)) * Math.PI * 2 + 0.4;
    const jitter = (rng() - 0.5) * 0.4;
    const angle = baseAngle + jitter;
    const dist = r2dist + (rng() - 0.5) * 20;
    placed.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      r: skill.size,
      name: skill.name,
      sub: skill.sub,
    });
  });

  return placed;
}

// Generate dust particles around each cluster
function dustParticles(cx: number, cy: number, color: string, seedBase: number) {
  const rng = seeded(seedBase + 999);
  const particles = [];
  for (let i = 0; i < 60; i++) {
    const angle = rng() * Math.PI * 2;
    const dist = 80 + rng() * 160;
    const sizeRoll = rng();
    const r = sizeRoll > 0.9 ? 3 + rng() * 4 : sizeRoll > 0.6 ? 1.5 + rng() * 2 : 0.8 + rng() * 1.2;
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      r,
      opacity: 0.12 + rng() * 0.35,
      color,
    });
  }
  return particles;
}

export function CapabilityBubbles() {
  const data = useMemo(() => {
    return categories.map((cat, ci) => {
      const bubbles = packBubbles(cat.skills, cat.cx, cat.cy, ci * 7777);
      const dust = dustParticles(cat.cx, cat.cy, cat.color, ci * 3333);
      return { ...cat, bubbles, dust };
    });
  }, []);

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-8">
        <span className="inline-block text-[11px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
          Capabilities
        </span>
        <h2 className="text-[20px] md:text-[24px] leading-[1.3] tracking-[-0.02em] font-bold">
          Discipline Map
        </h2>
        <p className="text-[20px] md:text-[24px] leading-[1.3] tracking-[-0.02em] font-normal text-[#141414] mt-1">
          Three practices. Twenty disciplines.
        </p>
      </div>

      {/* Chart */}
      <div
        className="w-full relative overflow-hidden"
        style={{ background: "#F3F0ED", borderRadius: "clamp(20px,3vw,40px)" }}
      >
        {/* top-right meta */}
        <div className="absolute top-6 right-7 z-10 text-right">
          <div className="text-[8px] text-[#AAA] leading-relaxed" style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
            Capabilities Index<br />
            <span className="text-[#888]">Reckon House Staples</span>
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* Subtle background circles per cluster */}
          {data.map((cat) => (
            <circle
              key={`bg-${cat.id}`}
              cx={cat.cx}
              cy={cat.cy}
              r={200}
              fill={cat.color}
              opacity={0.04}
            />
          ))}

          {/* Dust particles */}
          {data.map((cat) =>
            cat.dust.map((p, i) => (
              <circle key={`dust-${cat.id}-${i}`} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity={p.opacity} />
            ))
          )}

          {/* Category divider lines */}
          <line x1={300} y1={40} x2={300} y2={H - 40} stroke="#D8D3CC" strokeWidth={0.5} strokeDasharray="3 4" />
          <line x1={600} y1={40} x2={600} y2={H - 40} stroke="#D8D3CC" strokeWidth={0.5} strokeDasharray="3 4" />

          {/* Bubbles + labels */}
          {data.map((cat) =>
            cat.bubbles.map((b, bi) => {
              const colorIdx = bi % cat.colors.length;
              return (
                <g key={`bubble-${cat.id}-${bi}`}>
                  {/* soft glow */}
                  <circle cx={b.x} cy={b.y} r={b.r * 1.6} fill={cat.colors[colorIdx]} opacity={0.06} />
                  {/* main bubble */}
                  <circle cx={b.x} cy={b.y} r={b.r} fill={cat.colors[colorIdx]} opacity={0.75} />
                  {/* bright core */}
                  <circle cx={b.x} cy={b.y} r={b.r * 0.25} fill="#fff" opacity={0.35} />
                  {/* skill name — inside bubble if large enough */}
                  {b.r >= 42 ? (
                    <>
                      <text
                        x={b.x}
                        y={b.y - 4}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={7.5}
                        fontFamily="var(--font-satoshi), sans-serif"
                        fontWeight="600"
                        fill="#fff"
                        opacity={0.9}
                      >
                        {b.name}
                      </text>
                      <text
                        x={b.x}
                        y={b.y + 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={6}
                        fontFamily="var(--font-satoshi), sans-serif"
                        fill="#fff"
                        opacity={0.6}
                      >
                        {b.sub}
                      </text>
                    </>
                  ) : (
                    <>
                      <text
                        x={b.x}
                        y={b.r >= 36 ? b.y : b.y + b.r + 9}
                        textAnchor="middle"
                        dominantBaseline={b.r >= 36 ? "middle" : "auto"}
                        fontSize={b.r >= 36 ? 7 : 6.5}
                        fontFamily="var(--font-satoshi), sans-serif"
                        fontWeight={b.r >= 36 ? "600" : "400"}
                        fill={b.r >= 36 ? "#fff" : "#8A8580"}
                        opacity={0.85}
                      >
                        {b.name}
                      </text>
                    </>
                  )}
                </g>
              );
            })
          )}

          {/* Category labels */}
          {data.map((cat) => (
            <text
              key={`label-${cat.id}`}
              x={cat.cx}
              y={H - 22}
              textAnchor="middle"
              fontSize={8}
              fontFamily="var(--font-satoshi), sans-serif"
              fontWeight="600"
              fill={cat.color}
              opacity={0.7}
              letterSpacing="0.1em"
              textDecoration="none"
              style={{ textTransform: "uppercase" }}
            >
              {cat.label.toUpperCase()}
            </text>
          ))}

          {/* Center marks */}
          {data.map((cat) => (
            <g key={`center-${cat.id}`}>
              <circle cx={cat.cx} cy={cat.cy} r={2} fill={cat.color} opacity={0.3} />
              <circle cx={cat.cx} cy={cat.cy} r={6} fill="none" stroke={cat.color} strokeWidth={0.4} opacity={0.2} />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
