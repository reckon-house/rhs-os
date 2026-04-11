"use client";

import { useMemo } from "react";

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

// Full campaign color spectrum
const COLORS = [
  { hex: "#FF5C38", label: "Coral", temp: 0.9 },
  { hex: "#FF7B5C", label: "Salmon", temp: 0.82 },
  { hex: "#FF91AC", label: "Pink", temp: 0.6 },
  { hex: "#FFB088", label: "Peach", temp: 0.75 },
  { hex: "#FFA07A", label: "Light Salmon", temp: 0.7 },
  { hex: "#E8456B", label: "Rose", temp: 0.55 },
  { hex: "#FF6B4A", label: "Orange Red", temp: 0.95 },
  { hex: "#D4534B", label: "Crimson", temp: 0.5 },
  { hex: "#FFCBA4", label: "Apricot", temp: 0.65 },
  { hex: "#CC4455", label: "Cardinal", temp: 0.45 },
  { hex: "#F5E6DC", label: "Cream", temp: 0.3 },
  { hex: "#FFD4B8", label: "Bisque", temp: 0.58 },
  { hex: "#FF8C69", label: "Dark Salmon", temp: 0.85 },
  { hex: "#E07050", label: "Terra Cotta", temp: 0.78 },
  { hex: "#FFE4C4", label: "Blanche", temp: 0.35 },
  { hex: "#C9544D", label: "Brick", temp: 0.42 },
];

// Deliverables as radial segments
const DELIVERABLES = [
  { label: "Social", angle: 0, span: 60, count: 12 },
  { label: "Email", angle: 70, span: 50, count: 8 },
  { label: "Retail", angle: 130, span: 55, count: 6 },
  { label: "Editorial", angle: 195, span: 65, count: 10 },
  { label: "Storefront", angle: 270, span: 40, count: 4 },
  { label: "Lookbook", angle: 320, span: 35, count: 5 },
];

export function ColorFieldMap() {
  const W = 1000;
  const H = 1000;
  const CX = W / 2;
  const CY = H / 2;

  const data = useMemo(() => {
    const rng = seededRandom(77);
    const dots: { x: number; y: number; r: number; color: string; opacity: number }[] = [];
    const lines: { x1: number; y1: number; x2: number; y2: number; color: string; opacity: number }[] = [];

    // Dense color field — hundreds of dots arranged by temperature
    COLORS.forEach((color, ci) => {
      const baseAngle = color.temp * 360;
      const baseR = 80 + color.temp * 280;
      const count = 20 + Math.floor(rng() * 25);

      for (let j = 0; j < count; j++) {
        const angle = baseAngle + (rng() - 0.5) * 120;
        const dist = baseR + (rng() - 0.5) * 150;
        const pos = polar(CX, CY, Math.max(40, Math.min(dist, 420)), angle);
        const r = 2 + rng() * 12;
        dots.push({
          x: pos.x + (rng() - 0.5) * 30,
          y: pos.y + (rng() - 0.5) * 30,
          r,
          color: color.hex,
          opacity: 0.08 + rng() * 0.35,
        });
      }
    });

    // Deliverable region clusters — denser at specific angles
    DELIVERABLES.forEach((del) => {
      const regionRng = seededRandom(del.angle * 7 + 13);
      for (let j = 0; j < del.count * 4; j++) {
        const angle = del.angle + regionRng() * del.span;
        const dist = 150 + regionRng() * 250;
        const pos = polar(CX, CY, dist, angle);
        const colorIdx = Math.floor(regionRng() * COLORS.length);
        dots.push({
          x: pos.x,
          y: pos.y,
          r: 1.5 + regionRng() * 5,
          color: COLORS[colorIdx].hex,
          opacity: 0.1 + regionRng() * 0.25,
        });
      }
    });

    // Atmospheric fill
    for (let i = 0; i < 300; i++) {
      const dist = 30 + rng() * 440;
      const angle = rng() * 360;
      const pos = polar(CX, CY, dist, angle);
      dots.push({
        x: pos.x + (rng() - 0.5) * 20,
        y: pos.y + (rng() - 0.5) * 20,
        r: 0.3 + rng() * 2,
        color: COLORS[Math.floor(rng() * COLORS.length)].hex,
        opacity: 0.02 + rng() * 0.08,
      });
    }

    // Network lines connecting similar colors
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < Math.min(i + 8, dots.length); j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60 && rng() > 0.6) {
          lines.push({
            x1: dots[i].x, y1: dots[i].y,
            x2: dots[j].x, y2: dots[j].y,
            color: dots[i].color,
            opacity: 0.04 + rng() * 0.06,
          });
        }
      }
    }

    // Spoke lines from center
    for (let i = 0; i < 48; i++) {
      const angle = i * 7.5 + rng() * 4;
      const rStart = 40 + rng() * 30;
      const rEnd = 300 + rng() * 140;
      const from = polar(CX, CY, rStart, angle);
      const to = polar(CX, CY, rEnd, angle + (rng() - 0.5) * 8);
      lines.push({
        x1: from.x, y1: from.y, x2: to.x, y2: to.y,
        color: COLORS[Math.floor(rng() * COLORS.length)].hex,
        opacity: 0.03 + rng() * 0.05,
      });
    }

    return { dots, lines };
  }, []);

  return (
    <section className="w-full py-12 overflow-x-auto scrollbar-hide"
        data-lenis-prevent-touch>
      <div className="min-w-[800px] max-w-[1100px] mx-auto px-4 md:px-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          style={{ fontFamily: "'Satoshi', system-ui, sans-serif" }}
        >
          {/* Square grid */}
          {Array.from({ length: 11 }).map((_, i) => {
            const pos = (i + 1) * (W / 12);
            return (
              <g key={`g-${i}`}>
                <line x1={pos} y1={0} x2={pos} y2={H} stroke="#141414" strokeWidth={0.3} opacity={0.06} />
                <line x1={0} y1={pos} x2={W} y2={pos} stroke="#141414" strokeWidth={0.3} opacity={0.06} />
              </g>
            );
          })}

          {/* Concentric rings */}
          {[80, 160, 240, 320, 400, 120, 200, 280, 360].map((r, i) => (
            <circle key={`ring-${i}`} cx={CX} cy={CY} r={r}
              fill="none" stroke="#141414"
              strokeWidth={i < 5 ? 0.3 : 0.15}
              opacity={i < 5 ? 0.05 : 0.025}
              strokeDasharray={i >= 5 ? "1,4" : "none"}
            />
          ))}

          {/* Radial grid */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = i * 5;
            const major = angle % 30 === 0;
            const inner = polar(CX, CY, 35, angle);
            const outer = polar(CX, CY, 440, angle);
            return (
              <line key={`rad-${i}`}
                x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                stroke="#141414" strokeWidth={major ? 0.2 : 0.08}
                opacity={major ? 0.04 : 0.015}
              />
            );
          })}

          {/* Network lines */}
          {data.lines.map((line, i) => (
            <line key={`l-${i}`}
              x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              stroke={line.color} strokeWidth={0.4} opacity={line.opacity}
            />
          ))}

          {/* Color dots */}
          {data.dots.map((dot, i) => (
            <circle key={`d-${i}`} cx={dot.x} cy={dot.y} r={dot.r}
              fill={dot.color} opacity={dot.opacity} />
          ))}

          {/* Deliverable labels around the perimeter */}
          {DELIVERABLES.map((del, i) => {
            const labelR = 460;
            const pos = polar(CX, CY, labelR, del.angle + del.span / 2);
            const n = ((del.angle + del.span / 2) % 360 + 360) % 360;
            const anchor = n > 90 && n < 270 ? "end" as const : "start" as const;

            // Arc indicator
            const arcStart = polar(CX, CY, 430, del.angle);
            const arcEnd = polar(CX, CY, 430, del.angle + del.span);

            return (
              <g key={`del-${i}`}>
                <path
                  d={`M${arcStart.x},${arcStart.y} A430,430 0 0,1 ${arcEnd.x},${arcEnd.y}`}
                  fill="none" stroke={COLORS[i * 2].hex}
                  strokeWidth={8} opacity={0.15} strokeLinecap="round"
                />
                <text x={pos.x} y={pos.y - 4} textAnchor={anchor}
                  fontSize={9} fontWeight={600} fill="#141414" opacity={0.5}
                  letterSpacing="0.08em">{del.label}</text>
                <text x={pos.x} y={pos.y + 10} textAnchor={anchor}
                  fontSize={7} fill="#141414" opacity={0.3}>
                  {del.count} assets
                </text>
              </g>
            );
          })}

          {/* Center label */}
          <circle cx={CX} cy={CY} r={35} fill="none" stroke="#FF5C38" strokeWidth={0.5} opacity={0.2} />
          <text x={CX} y={CY - 4} textAnchor="middle" fontSize={7} fontWeight={700}
            fill="#141414" opacity={0.4} letterSpacing="0.12em">COLOR</text>
          <text x={CX} y={CY + 8} textAnchor="middle" fontSize={6}
            fill="#141414" opacity={0.25} letterSpacing="0.08em">FIELD MAP</text>

          {/* Temperature scale */}
          <g transform={`translate(30, ${H - 70})`}>
            <text fontSize={7} fontWeight={600} fill="#141414" opacity={0.4} letterSpacing="0.08em">
              COLOR TEMPERATURE
            </text>
            {COLORS.slice(0, 8).map((c, i) => (
              <circle key={i} cx={i * 20} cy={16} r={5}
                fill={c.hex} opacity={0.4 + c.temp * 0.4} />
            ))}
            <text x={0} y={30} fontSize={5} fill="#141414" opacity={0.25}>Cool</text>
            <text x={140} y={30} fontSize={5} fill="#141414" opacity={0.25} textAnchor="end">Warm</text>
          </g>

          {/* Palette swatches */}
          <g transform={`translate(${W - 200}, ${H - 70})`}>
            <text fontSize={7} fontWeight={600} fill="#141414" opacity={0.4} letterSpacing="0.08em">
              CAMPAIGN PALETTE
            </text>
            {["#FF5C38", "#FF91AC", "#FF7B5C", "#E8456B", "#FFCBA4", "#F5E6DC"].map((c, i) => (
              <rect key={i} x={i * 28} y={10} width={22} height={14} rx={3}
                fill={c} opacity={0.7} />
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
}
