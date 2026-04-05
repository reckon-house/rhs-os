"use client";

import type { IntelligenceFlowSection } from "@/lib/types";

// Deterministic pseudo-random
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Circle cluster generator (same visual language as heatmap)
function generateNodeCluster(
  cx: number, cy: number, radius: number,
  intensity: number, seed: number, palette: string[]
) {
  const rng = seededRandom(seed);
  const circles: { cx: number; cy: number; r: number; fill: string; opacity: number }[] = [];

  const count = Math.floor(6 + intensity * 18);

  for (let i = 0; i < count; i++) {
    const angle = rng() * Math.PI * 2;
    const dist = rng() * radius * (0.4 + intensity * 0.4);
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const baseR = 4 + intensity * 16;
    const r = baseR * (0.2 + rng() * 0.8);
    const fill = palette[Math.floor(rng() * palette.length)];
    const opacity = 0.1 + intensity * 0.25 + rng() * 0.12;
    circles.push({ cx: x, cy: y, r, fill, opacity });
  }

  // Accent rings
  if (intensity >= 0.5) {
    const ringCount = Math.floor(1 + intensity * 2);
    for (let i = 0; i < ringCount; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = rng() * radius * 0.6;
      circles.push({
        cx: cx + Math.cos(angle) * dist,
        cy: cy + Math.sin(angle) * dist,
        r: 8 + rng() * 14,
        fill: "none",
        opacity: 0.12 + rng() * 0.1,
      });
    }
  }

  return circles;
}

export function IntelligenceFlow({ stages }: IntelligenceFlowSection) {
  const W = 900;
  const H = 900;
  const CX = W / 2;
  const CY = H / 2;

  // Orbital radius
  const orbitR = 310;

  // Stage positions around the circle (clockwise from top)
  // Slight offset so the feedback arc has visual space
  const startAngle = -Math.PI / 2 + 0.15; // start just past 12 o'clock
  const stageAngles = stages.map((_, i) =>
    startAngle + (i / stages.length) * Math.PI * 2
  );

  // Colors per stage — portal palette
  const stageColors = [
    "#8C8578", // sources — warm grey
    "#C4A878", // engines — golden
    "#C4946B", // insights — warm rose-tan
    "#C94545", // briefs — portal red
    "#B1BC94", // assets — sage green
    "#6B8060", // stores — deep green
  ];

  const stagePalettes = [
    ["#8C8578", "#A09890", "#B5AFA8", "#7A7570", "#9C9690"],
    ["#C4A878", "#D4B888", "#B89860", "#CAAE80", "#D6C098"],
    ["#C4946B", "#D4A07A", "#B8886A", "#CC9878", "#D4A888"],
    ["#C94545", "#D4736B", "#E08080", "#B53A3A", "#CC6B7A"],
    ["#B1BC94", "#C0CA A4", "#A0AC84", "#BCC8A0", "#98A880"],
    ["#6B8060", "#7A9070", "#5C7050", "#88A078", "#608058"],
  ];

  // Fix the space in palette
  const fixedPalettes = stagePalettes.map(p => p.map(c => c.replace(/\s/g, "")));

  // Node sizes (proportional to volume)
  const maxVal = stages[0].value;
  const nodeRadii = stages.map(s => 35 + (s.value / maxVal) * 45);

  // Build curved flow paths between consecutive stages
  function flowPath(i1: number, i2: number, isForward: boolean) {
    const a1 = stageAngles[i1];
    const a2 = stageAngles[i2];

    const x1 = CX + Math.cos(a1) * orbitR;
    const y1 = CY + Math.sin(a1) * orbitR;
    const x2 = CX + Math.cos(a2) * orbitR;
    const y2 = CY + Math.sin(a2) * orbitR;

    // Control points — curve inward toward center for forward flow
    const midAngle = (a1 + a2) / 2;
    const curvePull = isForward ? orbitR * 0.65 : orbitR * 1.35;
    const cpx = CX + Math.cos(midAngle) * curvePull;
    const cpy = CY + Math.sin(midAngle) * curvePull;

    return `M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`;
  }

  // Feedback arc (stores → sources) — goes OUTSIDE the orbit
  const feedbackPath = (() => {
    const a1 = stageAngles[stages.length - 1]; // stores
    const a2 = stageAngles[0]; // sources

    const x1 = CX + Math.cos(a1) * orbitR;
    const y1 = CY + Math.sin(a1) * orbitR;
    const x2 = CX + Math.cos(a2) * orbitR;
    const y2 = CY + Math.sin(a2) * orbitR;

    // Arc outside the orbit
    const midAngle = a1 + (Math.PI * 2 - (a1 - a2)) / 2;
    const outerR = orbitR * 1.3;
    const cpx = CX + Math.cos(midAngle) * outerR;
    const cpy = CY + Math.sin(midAngle) * outerR;

    return `M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`;
  })();

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="relative overflow-hidden"
        style={{ minWidth: 800, background: "#F3F0ED", borderRadius: "clamp(20px,3vw,40px)", padding: "24px 16px 16px" }}>

        {/* Dot grid background */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle, #1A1A1A 0.5px, transparent 0.5px)",
          backgroundSize: "28px 28px",
        }} />

        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ fontFamily: "'Satoshi', system-ui, sans-serif", position: "relative" }}
        >
          <defs>
            <filter id="flowGlow">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            {/* Arrow marker for feedback */}
            <marker id="feedbackArrow" viewBox="0 0 10 8" refX="8" refY="4"
              markerWidth="8" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 4 L 0 8 Z" fill="#C94545" opacity="0.5" />
            </marker>
          </defs>

          {/* Orbit ring (subtle) */}
          <circle cx={CX} cy={CY} r={orbitR} fill="none"
            stroke="#D6C9B0" strokeWidth="0.5" opacity={0.3}
            strokeDasharray="4 8" />

          {/* Inner orbit ring */}
          <circle cx={CX} cy={CY} r={orbitR * 0.6} fill="none"
            stroke="#D6C9B0" strokeWidth="0.3" opacity={0.15} />

          {/* Forward flow paths (between consecutive stages) */}
          {stages.slice(0, -1).map((_, i) => {
            const path = flowPath(i, i + 1, true);
            const thickness = 2 + (stages[i].value / maxVal) * 6;
            return (
              <g key={`flow-${i}`}>
                {/* Glow */}
                <path d={path} fill="none" stroke={stageColors[i]}
                  strokeWidth={thickness * 3} opacity={0.06} filter="url(#flowGlow)" />
                {/* Main path */}
                <path d={path} fill="none" stroke={stageColors[i]}
                  strokeWidth={thickness} opacity={0.2}
                  strokeLinecap="round" />
                {/* Thin accent line */}
                <path d={path} fill="none" stroke={stageColors[i + 1]}
                  strokeWidth={1} opacity={0.15}
                  strokeDasharray="3 6" strokeLinecap="round" />
              </g>
            );
          })}

          {/* Feedback arc (stores → sources) — portal red */}
          <path d={feedbackPath} fill="none" stroke="#C94545"
            strokeWidth={2} opacity={0.12} filter="url(#flowGlow)" />
          <path d={feedbackPath} fill="none" stroke="#C94545"
            strokeWidth={1.5} opacity={0.3}
            strokeDasharray="6 4" strokeLinecap="round"
            markerEnd="url(#feedbackArrow)" />

          {/* Feedback label */}
          {(() => {
            const a1 = stageAngles[stages.length - 1];
            const a2 = stageAngles[0];
            const midAngle = a1 + (Math.PI * 2 - (a1 - a2)) / 2;
            const labelR = orbitR * 1.22;
            return (
              <text
                x={CX + Math.cos(midAngle) * labelR}
                y={CY + Math.sin(midAngle) * labelR}
                textAnchor="middle" fontSize="8" fontWeight="600"
                fill="#C94545" opacity={0.5} letterSpacing="0.1em"
              >
                PERFORMANCE FEEDBACK
              </text>
            );
          })()}

          {/* Stage nodes */}
          {stages.map((stage, i) => {
            const angle = stageAngles[i];
            const x = CX + Math.cos(angle) * orbitR;
            const y = CY + Math.sin(angle) * orbitR;
            const r = nodeRadii[i];
            const intensity = stage.value / maxVal;
            const clusters = generateNodeCluster(x, y, r * 1.2, intensity, i * 777 + 42, fixedPalettes[i]);

            return (
              <g key={stage.name}>
                {/* Background halo */}
                <circle cx={x} cy={y} r={r * 1.6} fill={stageColors[i]} opacity={0.04} />

                {/* Circle clusters */}
                {clusters.map((c, k) =>
                  c.fill === "none" ? (
                    <circle key={k} cx={c.cx} cy={c.cy} r={c.r}
                      fill="none" stroke={fixedPalettes[i][0]}
                      strokeWidth="0.8" opacity={c.opacity} />
                  ) : (
                    <circle key={k} cx={c.cx} cy={c.cy} r={c.r}
                      fill={c.fill} opacity={c.opacity} />
                  )
                )}

                {/* Center label background */}
                <circle cx={x} cy={y} r={r * 0.55} fill="#F3F0ED" opacity={0.85} />

                {/* Stage label */}
                <text x={x} y={y - r - 14}
                  textAnchor="middle" fontSize="8.5" fontWeight="700"
                  fill="#1A1A1A" letterSpacing="0.1em" opacity={0.7}
                >
                  {stage.name.toUpperCase()}
                </text>

                {/* Items */}
                {stage.items.map((item, j) => {
                  const itemY = y - ((stage.items.length - 1) * 11) / 2 + j * 11;
                  return (
                    <text key={item} x={x} y={itemY + 2}
                      textAnchor="middle" fontSize="8" fontWeight="500"
                      fill="#1A1A1A" opacity={0.5}
                    >
                      {item}
                    </text>
                  );
                })}
              </g>
            );
          })}

          {/* Center label */}
          <circle cx={CX} cy={CY} r={36} fill="#F3F0ED" stroke="#D6C9B0" strokeWidth="0.5" opacity={0.9} />
          <text x={CX} y={CY - 5} textAnchor="middle" fontSize="9" fontWeight="700"
            fill="#1A1A1A" opacity={0.5} letterSpacing="0.12em">
            SALLY
          </text>
          <text x={CX} y={CY + 7} textAnchor="middle" fontSize="7" fontWeight="500"
            fill="#1A1A1A" opacity={0.35} letterSpacing="0.08em">
            MARKETING OS
          </text>

          {/* Footer */}
          <text x={CX} y={H - 16} textAnchor="middle" fontSize="7.5" fontWeight="500"
            fill="#8C8578" letterSpacing="0.1em" opacity={0.45}>
            SIGNAL TO SHELF — closed-loop intelligence pipeline
          </text>
        </svg>
      </div>
    </div>
  );
}
