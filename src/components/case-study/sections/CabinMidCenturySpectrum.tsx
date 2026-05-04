"use client";

import { useMemo } from "react";

/**
 * CabinMidCenturySpectrum — Horizontal spectrum chart showing where each
 * design element in the chalet lands on the axis from "Cabin Bones" (left)
 * to "Mid-Century Sensibility" (right). Same dense particle-cluster
 * aesthetic as MaterialOverlap, but linear instead of radial — the chart
 * tells the design story directly: a 1968 PNW chalet rebuilt by holding
 * cabin form steady while threading mid-century pieces through it.
 *
 * Two faded anchor circles sit at each end of the spectrum (CABIN and
 * MID-CENTURY). Each design element is a particle cluster centered on its
 * lean position along the x-axis, with vertical position varied for
 * visual density.
 */

const W = 1100;
const H = 520;
const AXIS_Y = H / 2; // horizontal spectrum sits along the midline
const AXIS_PAD_X = 110; // padding so anchor circles + clusters don't touch the edges

interface Anchor {
  id: string;
  name: string;
  color: string;
  cx: number;
  cy: number;
  r: number;
  labelX: number;
  labelY: number;
}

interface Element {
  name: string;
  /** 0 = pure cabin, 1 = pure mid-century, 0.5 = blend */
  lean: number;
  /** vertical offset from the axis line — keeps clusters from stacking */
  yOffset: number;
  color: string;
  particleCount: number;
  clusterRadiusX: number;
  clusterRadiusY: number;
}

const ANCHORS: Anchor[] = [
  // Cabin — warm reclaimed-wood brown
  {
    id: "cabin",
    name: "CABIN BONES",
    color: "#8C6B4A",
    cx: AXIS_PAD_X,
    cy: AXIS_Y,
    r: 145,
    labelX: AXIS_PAD_X,
    labelY: H - 30,
  },
  // Mid-Century — cool charcoal with a brass undertone
  {
    id: "midcentury",
    name: "MID-CENTURY SENSIBILITY",
    color: "#3A3530",
    cx: W - AXIS_PAD_X,
    cy: AXIS_Y,
    r: 145,
    labelX: W - AXIS_PAD_X,
    labelY: H - 30,
  },
];

// Each design element placed on the spectrum. Lean value (0-1) determines
// horizontal position; yOffset keeps clusters from stacking. Cabin-leaning
// elements use warm earthy tones; mid-century elements use cooler grays
// with brass; blends sit in between.
const ELEMENTS: Element[] = [
  // ── Pure cabin (left edge cluster) ──
  { name: "RECLAIMED PNW PINE", lean: 0.04, yOffset: -30, color: "#8C6B4A", particleCount: 65, clusterRadiusX: 55, clusterRadiusY: 50 },
  { name: "EXPOSED BEAMS", lean: 0.10, yOffset: 60, color: "#A07852", particleCount: 55, clusterRadiusX: 50, clusterRadiusY: 45 },
  { name: "PAINTED STONE WALL", lean: 0.12, yOffset: -85, color: "#C2B59A", particleCount: 55, clusterRadiusX: 50, clusterRadiusY: 45 },
  { name: "ANTLERS", lean: 0.06, yOffset: 130, color: "#7A6850", particleCount: 50, clusterRadiusX: 45, clusterRadiusY: 40 },

  // ── Cabin lean ──
  { name: "WOVEN BENCH", lean: 0.22, yOffset: -130, color: "#9B8868", particleCount: 50, clusterRadiusX: 50, clusterRadiusY: 40 },
  { name: "LEANING LADDER SHELF", lean: 0.28, yOffset: 95, color: "#6F4F35", particleCount: 50, clusterRadiusX: 50, clusterRadiusY: 40 },
  { name: "WHITE EXTERIOR RAILINGS", lean: 0.18, yOffset: 0, color: "#D8D3C8", particleCount: 55, clusterRadiusX: 50, clusterRadiusY: 45 },
  { name: "STRING LIGHTS", lean: 0.30, yOffset: -45, color: "#C4A265", particleCount: 50, clusterRadiusX: 45, clusterRadiusY: 40 },

  // ── Center / blend ──
  { name: "A-FRAME GEOMETRY", lean: 0.46, yOffset: -110, color: "#7A6850", particleCount: 70, clusterRadiusX: 60, clusterRadiusY: 50 },
  { name: "16-FT GLASS DOORS", lean: 0.50, yOffset: 50, color: "#A8B0AC", particleCount: 70, clusterRadiusX: 60, clusterRadiusY: 50 },
  { name: "WARM GRAY EXTERIOR", lean: 0.42, yOffset: 130, color: "#5B5A55", particleCount: 55, clusterRadiusX: 50, clusterRadiusY: 45 },
  { name: "PNW PINE FLOORS", lean: 0.55, yOffset: -10, color: "#8C7355", particleCount: 55, clusterRadiusX: 50, clusterRadiusY: 45 },

  // ── Mid-century lean ──
  { name: "TUFTED GRAY SOFA", lean: 0.68, yOffset: -75, color: "#8B9098", particleCount: 60, clusterRadiusX: 55, clusterRadiusY: 45 },
  { name: "WALNUT COFFEE TABLE", lean: 0.74, yOffset: 95, color: "#5C3F28", particleCount: 50, clusterRadiusX: 50, clusterRadiusY: 40 },
  { name: "LEATHER SLING CHAIR", lean: 0.78, yOffset: -10, color: "#704A30", particleCount: 50, clusterRadiusX: 50, clusterRadiusY: 40 },

  // ── Pure mid-century (right edge cluster) ──
  { name: "WALNUT DINING SET", lean: 0.86, yOffset: 130, color: "#4A3220", particleCount: 55, clusterRadiusX: 50, clusterRadiusY: 45 },
  { name: "MALM FIREPLACE", lean: 0.92, yOffset: -45, color: "#2A2622", particleCount: 60, clusterRadiusX: 50, clusterRadiusY: 45 },
  { name: "SPUTNIK CHANDELIER", lean: 0.96, yOffset: -130, color: "#BC8E45", particleCount: 65, clusterRadiusX: 55, clusterRadiusY: 50 },
  { name: "TRACK LIGHTING", lean: 0.88, yOffset: 50, color: "#3F3A35", particleCount: 50, clusterRadiusX: 45, clusterRadiusY: 40 },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function gaussian(rng: () => number): number {
  const u1 = rng() || 0.0001;
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function CabinMidCenturySpectrum() {
  const particles = useMemo(() => {
    const rng = seededRandom(541);
    const els: React.ReactNode[] = [];
    let idx = 0;

    // Map lean (0-1) to x-coordinate inside the chart area
    const xFromLean = (lean: number) => AXIS_PAD_X + lean * (W - AXIS_PAD_X * 2);

    ELEMENTS.forEach((e) => {
      const anchorX = xFromLean(e.lean);
      const anchorY = AXIS_Y + e.yOffset;

      for (let i = 0; i < e.particleCount; i++) {
        const dx = gaussian(rng) * (e.clusterRadiusX / 2);
        const dy = gaussian(rng) * (e.clusterRadiusY / 2);
        const x = anchorX + dx;
        const y = anchorY + dy;

        const sizeRoll = rng();
        const r = 1 + Math.pow(sizeRoll, 2.5) * 12;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const distanceFalloff = Math.max(0, 1 - distance / (e.clusterRadiusX * 1.4));
        const opacity = 0.12 + rng() * 0.45 + distanceFalloff * 0.15;

        els.push(
          <circle
            key={`p-${idx++}`}
            cx={x}
            cy={y}
            r={r}
            fill={e.color}
            fillOpacity={Math.min(opacity, 0.7)}
          />
        );
      }
    });

    // Stray noise across the field for the "sampled from a larger study" feel
    for (let i = 0; i < 100; i++) {
      const x = rng() * W;
      const y = 60 + rng() * (H - 130);
      const r = 0.5 + rng() * 1.6;
      els.push(
        <circle
          key={`stray-${i}`}
          cx={x}
          cy={y}
          r={r}
          fill="#141414"
          fillOpacity={0.05 + rng() * 0.1}
        />
      );
    }

    return els;
  }, []);

  const xFromLean = (lean: number) => AXIS_PAD_X + lean * (W - AXIS_PAD_X * 2);

  return (
    <div className="w-full px-4 md:px-0 py-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-[9px] md:text-[10px] font-medium tracking-[0.1em] text-[#141414]/40 uppercase">
          Design DNA · Cabin ↔ Mid-Century
        </span>
        <span className="text-[9px] md:text-[10px] tracking-[0.05em] text-[#141414]/25">
          {ELEMENTS.length} elements · plotted by lean
        </span>
      </div>
      <div className="w-full overflow-x-auto" data-lenis-prevent-touch>
        <div className="min-w-[900px] relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ background: "transparent" }}>
            {/* Background grid (subtle, matches the other charts) */}
            {Array.from({ length: 12 }).map((_, i) => {
              const xPos = (i + 1) * (W / 13);
              const yPos = (i + 1) * (H / 13);
              return (
                <g key={`grid-${i}`}>
                  <line x1={xPos} y1={0} x2={xPos} y2={H} stroke="#141414" strokeWidth={0.5} opacity={0.04} />
                  <line x1={0} y1={yPos} x2={W} y2={yPos} stroke="#141414" strokeWidth={0.5} opacity={0.04} />
                </g>
              );
            })}

            {/* Spectrum axis line — very faint, runs the full width through
                the middle. Provides a structural reference under the cluster
                field. */}
            <line
              x1={AXIS_PAD_X - 60}
              y1={AXIS_Y}
              x2={W - AXIS_PAD_X + 60}
              y2={AXIS_Y}
              stroke="#141414"
              strokeWidth={1}
              strokeOpacity={0.15}
              strokeDasharray="3 5"
            />

            {/* Faded anchor circles at each end of the spectrum — same
                soft-container treatment as the floor-and-decor chart so each
                pole reads as a contained zone without competing with the
                particle field. */}
            {ANCHORS.map((a) => (
              <circle
                key={`anchor-${a.id}`}
                cx={a.cx}
                cy={a.cy}
                r={a.r}
                fill={a.color}
                fillOpacity={0.06}
                stroke={a.color}
                strokeWidth={1.2}
                strokeOpacity={0.2}
              />
            ))}

            {/* Dense particle clusters per design element */}
            {particles}

            {/* Tick markers along the spectrum at quartiles — gives the eye
                something to anchor lean estimates against */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <g key={`tick-${t}`}>
                <line
                  x1={xFromLean(t)}
                  y1={AXIS_Y - 4}
                  x2={xFromLean(t)}
                  y2={AXIS_Y + 4}
                  stroke="#141414"
                  strokeWidth={0.8}
                  strokeOpacity={0.25}
                />
              </g>
            ))}

            {/* Element labels — over each cluster, with a soft cream scrim
                for legibility against the densest particle regions */}
            {ELEMENTS.map((e) => {
              const lx = xFromLean(e.lean);
              const ly = AXIS_Y + e.yOffset;
              return (
                <g key={`label-${e.name}`}>
                  <rect
                    x={lx - e.name.length * 3.2}
                    y={ly - 7}
                    width={e.name.length * 6.4}
                    height={13}
                    rx={2}
                    fill="#F5F2ED"
                    fillOpacity={0.78}
                  />
                  <text
                    x={lx}
                    y={ly + 3}
                    textAnchor="middle"
                    fill="#141414"
                    fillOpacity={0.82}
                    fontSize="9"
                    fontFamily="var(--font-satoshi), sans-serif"
                    fontWeight={600}
                    letterSpacing="0.06em"
                    style={{ pointerEvents: "none" }}
                  >
                    {e.name}
                  </text>
                </g>
              );
            })}

            {/* Anchor pole labels — sit BELOW the chart in the anchor's color,
                aligned with each anchor circle */}
            {ANCHORS.map((a) => (
              <text
                key={`pname-${a.id}`}
                x={a.labelX}
                y={a.labelY}
                textAnchor="middle"
                fill={a.color}
                fontSize="13"
                fontFamily="var(--font-satoshi), sans-serif"
                fontWeight={700}
                letterSpacing="0.12em"
              >
                {a.name}
              </text>
            ))}

            {/* Legend at the very bottom */}
            <g>
              <text x={W / 2} y={H - 8} fill="#141414" fillOpacity={0.3} fontSize="8" fontFamily="var(--font-satoshi), sans-serif" textAnchor="middle" letterSpacing="0.05em">
                EACH ELEMENT ≈ 50–70 PARTICLES · HORIZONTAL POSITION = LEAN · VERTICAL OFFSET = LAYOUT ONLY
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
