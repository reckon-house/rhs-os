"use client";

import { useMemo } from "react";

const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const projects = [
  { name: "Applied Media", year: 2003, duration: 4, impact: 30, disciplines: ["digital"], colors: ["#4A7FBF", "#3668A8", "#2A5590"] },
  { name: "Neiman Marcus", year: 2007, duration: 6, impact: 60, disciplines: ["digital", "editorial"], colors: ["#CC8A2E", "#B57528", "#9E6020"] },
  { name: "NM InSite", year: 2010, duration: 2, impact: 55, disciplines: ["digital", "editorial"], colors: ["#C4A020", "#AA8A18", "#907010"] },
  { name: "NM 100th Book", year: 2011, duration: 1, impact: 45, disciplines: ["design"], colors: ["#CC6030", "#B54A28", "#9E3820"] },
  { name: "JCPenney", year: 2012, duration: 1, impact: 35, disciplines: ["brand"], colors: ["#CC3030", "#B52020", "#9E1818"] },
  { name: "Nordstrom Early", year: 2014, duration: 4, impact: 70, disciplines: ["digital", "systems"], colors: ["#7A8B5A", "#6B7B4A", "#5A6A3A"] },
  { name: "Jeffrey NYC", year: 2015, duration: 2, impact: 65, disciplines: ["digital", "brand", "ecomm"], colors: ["#8B6A2E", "#7A5A20", "#6A4A18"] },
  { name: "Ivy Park", year: 2016, duration: 1, impact: 95, disciplines: ["campaign", "digital", "experience", "brand"], colors: ["#CC2244", "#E84466", "#AA1830", "#D43358"] },
  { name: "Jeffrey Spring", year: 2016, duration: 1, impact: 50, disciplines: ["campaign", "art direction"], colors: ["#2E8B4A", "#228040", "#186838"] },
  { name: "Jeffrey x SL", year: 2016, duration: 1, impact: 48, disciplines: ["campaign"], colors: ["#BB2266", "#AA1855", "#881044"] },
  { name: "Nordstrom Framework", year: 2018, duration: 2, impact: 75, disciplines: ["systems", "content", "design"], colors: ["#4488BB", "#3377AA", "#226699"] },
  { name: "RHS Founded", year: 2018, duration: 7, impact: 60, disciplines: ["brand", "digital", "interiors"], colors: ["#8A9470", "#A68B45", "#7A5E3C"] },
  { name: "J. Christianson", year: 2018, duration: 1, impact: 40, disciplines: ["identity", "naming"], colors: ["#6A8844", "#558833", "#447722"] },
  { name: "Capitan Boot", year: 2019, duration: 1, impact: 48, disciplines: ["identity", "photography", "apparel"], colors: ["#6B5335", "#7A6244", "#8A7155"] },
  { name: "Loved by Nordstrom", year: 2019, duration: 1, impact: 52, disciplines: ["campaign", "systems"], colors: ["#CC5555", "#BB4444", "#AA3333"] },
  { name: "Nordstrom Personalization", year: 2019, duration: 2, impact: 78, disciplines: ["systems", "art direction", "photography"], colors: ["#2E9966", "#228855", "#187744"] },
  { name: "Nordstrom CMS", year: 2020, duration: 1, impact: 82, disciplines: ["engineering", "systems", "ops"], colors: ["#5599AA", "#448899", "#337788"] },
  { name: "Sally Director", year: 2021, duration: 1, impact: 55, disciplines: ["digital", "systems"], colors: ["#CC4433", "#BB3322", "#AA2211"] },
  { name: "You By Sally", year: 2021, duration: 1, impact: 62, disciplines: ["campaign", "brand", "retail"], colors: ["#CC2288", "#BB1877", "#AA1066"] },
  { name: "Cosmo Prof", year: 2021, duration: 1, impact: 50, disciplines: ["digital", "photography"], colors: ["#8B7055", "#7A6044", "#6A5033"] },
  { name: "Hill Country Kitchen", year: 2022, duration: 1, impact: 68, disciplines: ["interiors", "sourcing", "management"], colors: ["#AA7E44", "#997033", "#886228"] },
  { name: "Hill Country Living", year: 2022, duration: 1, impact: 60, disciplines: ["interiors", "curation"], colors: ["#997044", "#886033", "#775028"] },
  { name: "Hill Country Bath", year: 2022, duration: 1, impact: 55, disciplines: ["interiors", "sourcing"], colors: ["#B5A088", "#A89070", "#9A8060"] },
  { name: "Fairview Suite", year: 2022, duration: 1, impact: 58, disciplines: ["interiors", "curation"], colors: ["#6A5578", "#5A4568", "#4A3558"] },
  { name: "At Home Group", year: 2023, duration: 1, impact: 45, disciplines: ["digital", "ux"], colors: ["#557755", "#446644", "#335533"] },
  { name: "Mountain View", year: 2023, duration: 1, impact: 48, disciplines: ["interiors", "exterior"], colors: ["#448844", "#337733", "#226622"] },
  { name: "Oakworks", year: 2023, duration: 1, impact: 38, disciplines: ["campaign", "identity"], colors: ["#AA7722", "#996611", "#885500"] },
  { name: "Floor & Decor", year: 2023, duration: 1, impact: 42, disciplines: ["interiors", "feature"], colors: ["#887766", "#776655", "#665544"] },
  { name: "A.R.C.", year: 2024, duration: 2, impact: 90, disciplines: ["product", "engineering", "brand", "go-to-market"], colors: ["#7A8B5A", "#8A9470", "#6B7B4A", "#5A6A3A"] },
  { name: "House Notes", year: 2024, duration: 1, impact: 42, disciplines: ["product", "plugin"], colors: ["#448866", "#337755", "#226644"] },
  { name: "PetSmart", year: 2024, duration: 1, impact: 45, disciplines: ["digital", "loyalty"], colors: ["#CC6622", "#BB5511", "#AA4400"] },
  { name: "Sally Portal", year: 2025, duration: 1, impact: 98, disciplines: ["product", "engineering", "ai", "systems", "strategy"], colors: ["#CC3322", "#DD5544", "#BB4433", "#EE6655", "#AA2211"] },
  { name: "Shelf Talker System", year: 2025, duration: 1, impact: 55, disciplines: ["engineering", "automation"], colors: ["#AA4433", "#993322", "#882211"] },
];

const startYear = 2002;
const endYear = 2026;
const yearSpan = endYear - startYear;

export function CareerGalaxy() {
  const size = 760;
  const center = size / 2;

  const { particles, rays } = useMemo(() => {
    const allParticles: {
      x: number; y: number; r: number; color: string; opacity: number; layer: number;
    }[] = [];
    const allRays: {
      x1: number; y1: number; x2: number; y2: number; color: string; opacity: number;
    }[] = [];

    projects.forEach((project, pIdx) => {
      const rng = seeded(pIdx * 1337 + 42);
      const yearPct = (project.year - startYear) / yearSpan;
      const baseAngle = yearPct * Math.PI * 2 - Math.PI / 2;
      const baseRadius = 40 + yearPct * (size * 0.36);
      const particleCount = Math.floor(8 + (project.impact / 100) * 30);
      const rayCount = Math.floor(2 + project.disciplines.length * 1.5);

      for (let r = 0; r < rayCount; r++) {
        const rayAngle = baseAngle + (rng() - 0.5) * 0.25;
        const rayLen = baseRadius + 20 + rng() * 60;
        allRays.push({
          x1: center + Math.cos(rayAngle) * 15,
          y1: center + Math.sin(rayAngle) * 15,
          x2: center + Math.cos(rayAngle) * rayLen,
          y2: center + Math.sin(rayAngle) * rayLen,
          color: project.colors[0],
          opacity: 0.08 + rng() * 0.1,
        });
      }

      for (let i = 0; i < particleCount; i++) {
        const spread = 15 + (project.impact / 100) * 35;
        const angleOffset = (rng() - 0.5) * 0.4;
        const radiusOffset = (rng() - 0.5) * spread * 2;
        const angle = baseAngle + angleOffset;
        const radius = baseRadius + radiusOffset;
        const sizeRoll = rng();
        let dotSize = sizeRoll > 0.92 ? 6 + rng() * 14 : sizeRoll > 0.7 ? 3 + rng() * 6 : 1 + rng() * 3;
        dotSize *= 0.5 + (project.impact / 100) * 0.8;
        const colorIdx = Math.floor(rng() * project.colors.length);
        const opacity = 0.25 + rng() * 0.55;
        const drift = dotSize > 8 ? rng() * 15 : 0;
        allParticles.push({
          x: center + Math.cos(angle) * (radius + drift),
          y: center + Math.sin(angle) * (radius + drift),
          r: dotSize,
          color: project.colors[colorIdx],
          opacity,
          layer: sizeRoll > 0.85 ? 2 : sizeRoll > 0.5 ? 1 : 0,
        });
      }
    });

    allParticles.sort((a, b) => a.layer - b.layer);
    return { particles: allParticles, rays: allRays };
  }, []);

  const yearMarkers = [];
  for (let y = 2002; y <= 2026; y++) {
    const pct = (y - startYear) / yearSpan;
    const angle = pct * Math.PI * 2 - Math.PI / 2;
    const outerR = size * 0.46;
    const isMajor = y % 2 === 0;
    yearMarkers.push({
      x1: center + Math.cos(angle) * (outerR - (isMajor ? 8 : 4)),
      y1: center + Math.sin(angle) * (outerR - (isMajor ? 8 : 4)),
      x2: center + Math.cos(angle) * outerR,
      y2: center + Math.sin(angle) * outerR,
      labelX: center + Math.cos(angle) * (outerR + 12),
      labelY: center + Math.sin(angle) * (outerR + 12),
      year: y,
      major: isMajor,
      angle,
    });
  }

  const labels = projects
    .filter((p) => p.impact >= 70)
    .map((p) => {
      const yearPct = (p.year - startYear) / yearSpan;
      const angle = yearPct * Math.PI * 2 - Math.PI / 2;
      const radius = 40 + yearPct * (size * 0.36);
      const labelR = radius + 35 + (p.impact / 100) * 20;
      return {
        x: center + Math.cos(angle) * labelR,
        y: center + Math.sin(angle) * labelR,
        name: p.name,
        angle,
      };
    });

  return (
    <div className="w-full">
      {/* Heading — matches case study SectionHeader style */}
      <div className="mb-8">
        <span className="inline-block text-[11px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
          Data Visualization
        </span>
        <h2 className="text-[20px] md:text-[24px] leading-[1.3] tracking-[-0.02em] font-bold">
          Twenty-four years of making things.
        </h2>
        <p className="text-[16px] leading-[24px] text-foreground/80 mt-4">
          Apps, campaigns, interiors. Different mediums — same attention.
        </p>
      </div>

      {/* Chart — horizontal scroll on mobile */}
      <div className="overflow-x-auto md:overflow-x-visible">
      <div className="min-w-[800px] md:min-w-0 relative overflow-hidden" style={{ background: "#F3F0ED", borderRadius: "clamp(20px,3vw,40px)" }}>
        {/* Top-left meta */}
        <div className="absolute top-6 left-7 z-10">
          <div className="text-[9px] tracking-[0.15em] uppercase text-[#999] font-medium" style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
            2002 — 2026
          </div>
          <div className="text-[8px] text-[#AAA] mt-1 leading-relaxed" style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
            32 projects · 20+ disciplines<br />
            Size = impact · Position = chronological
          </div>
        </div>

        {/* Top-right meta */}
        <div className="absolute top-6 right-7 z-10 text-right">
          <div className="text-[8px] text-[#AAA] leading-relaxed" style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
            Data Visualization<br />
            <span className="text-[#888]">March 2026</span>
          </div>
        </div>

        {/* SVG — responsive via viewBox */}
        <div className="w-full">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-auto"
          >
            {[0.12, 0.22, 0.32, 0.42].map((r, i) => (
              <circle key={`grid-${i}`} cx={center} cy={center} r={size * r} fill="none" stroke="#E0DDD8" strokeWidth={0.5} />
            ))}

            {rays.map((ray, i) => (
              <line key={`ray-${i}`} x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2}
                stroke={ray.color} strokeWidth={0.4} opacity={ray.opacity} />
            ))}

            {yearMarkers.map((m) => (
              <g key={`ym-${m.year}`}>
                <line x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2}
                  stroke="#CCC8C2" strokeWidth={m.major ? 1 : 0.5} />
                {m.major && (
                  <text x={m.labelX} y={m.labelY} fill="#BBB5AE" fontSize={7}
                    fontFamily="var(--font-satoshi), sans-serif" textAnchor="middle" dominantBaseline="middle"
                    transform={`rotate(${(m.angle * 180) / Math.PI + 90}, ${m.labelX}, ${m.labelY})`}>
                    {m.year}
                  </text>
                )}
              </g>
            ))}

            {particles.filter(p => p.r > 5).map((p, i) => (
              <circle key={`shadow-${i}`} cx={p.x} cy={p.y} r={p.r * 2.2}
                fill={p.color} opacity={p.opacity * 0.08} />
            ))}

            {particles.map((p, i) => (
              <circle key={`dot-${i}`} cx={p.x} cy={p.y} r={p.r}
                fill={p.color} opacity={p.opacity * 0.85} />
            ))}

            {particles.filter(p => p.r > 7).map((p, i) => (
              <circle key={`core-${i}`} cx={p.x} cy={p.y} r={p.r * 0.3}
                fill="#FFFFFF" opacity={p.opacity * 0.5} />
            ))}

            {labels.map((l, i) => (
              <text key={`label-${i}`} x={l.x} y={l.y} fill="#8A8580" fontSize={7}
                fontFamily="var(--font-satoshi), sans-serif" textAnchor="middle" dominantBaseline="middle">
                {l.name}
              </text>
            ))}

            <circle cx={center} cy={center} r={2} fill="#BBB5AE" />
            <circle cx={center} cy={center} r={6} fill="none" stroke="#DDD8D2" strokeWidth={0.5} />
          </svg>
        </div>

        {/* Legend */}
        <div className="px-7 pb-5 flex flex-wrap justify-between items-end gap-3">
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Digital & Brand", color: "#4488BB" },
              { label: "Campaign", color: "#CC3355" },
              { label: "Interiors", color: "#AA7E44" },
              { label: "Product & Eng", color: "#7A8B5A" },
              { label: "Identity", color: "#6A8844" },
              { label: "Systems", color: "#2E9966" },
            ].map((d) => (
              <div key={d.label} className="flex items-center gap-1.5">
                <div className="w-[5px] h-[5px] rounded-full" style={{ background: d.color, opacity: 0.9 }} />
                <span className="text-[9px] text-[#9A958F]" style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>{d.label}</span>
              </div>
            ))}
          </div>
          <span className="text-[8px] text-[#BBB5AE]" style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>reckon.house</span>
        </div>
      </div>
      </div>
    </div>
  );
}
