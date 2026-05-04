"use client";

import { useMemo } from "react";

/**
 * MaterialOverlap — Dense particle-cluster diagram showing the material
 * vocabulary across the three Floor & Decor projects (Urban Southwest,
 * Modern Farmhouse, Quiet Glam). Each material is a cloud of ~50 small
 * overlapping circles in a tinted color. Clusters in the same project area
 * cluster together; clusters at the boundaries between two projects sit in
 * the lens regions; the through-line material (MARBLE) sits at the center.
 *
 * Same dense-art/science aesthetic as the ARC SystemArchitecture chart and
 * the RHS service-map references — no explicit Venn outlines, the clusters
 * themselves form the visual regions.
 */

const W = 900;
const H = 850;

interface Material {
  name: string;
  color: string;
  anchorX: number;
  anchorY: number;
  region: "all" | "us" | "mf" | "qg" | "us-mf" | "us-qg" | "mf-qg";
  particleCount: number;
  clusterRadiusX: number;
  clusterRadiusY: number;
}

interface Project {
  id: string;
  name: string;
  color: string;
  cx: number;
  cy: number;
  r: number;
  labelX: number;
  labelY: number;
}

// Project Venn circles + labels. The circles are rendered very faintly under
// the particle clusters so each project's region reads as a soft container
// without competing visually with the dense particle field.
const PROJECTS: Project[] = [
  { id: "us", name: "URBAN SOUTHWEST", color: "#A05545", cx: 450, cy: 340, r: 235, labelX: 450, labelY: 70 },
  { id: "mf", name: "MODERN FARMHOUSE", color: "#7A8870", cx: 335, cy: 540, r: 235, labelX: 130, labelY: 770 },
  { id: "qg", name: "QUIET GLAM", color: "#B08940", cx: 565, cy: 540, r: 235, labelX: 770, labelY: 770 },
];

// Materials placed in each Venn region. Particle clusters fan out from each
// anchor; clusters in the same project cluster together to define the visual
// region. Pairwise-overlap materials sit in the lens between two projects;
// MARBLE sits at the centroid (used in all three).
const MATERIALS: Material[] = [
  // Triple overlap — center
  { name: "MARBLE", color: "#C9BFAA", anchorX: 450, anchorY: 470, region: "all", particleCount: 130, clusterRadiusX: 100, clusterRadiusY: 80 },

  // Urban Southwest only — top petal
  { name: "EXPOSED BRICK", color: "#A05545", anchorX: 355, anchorY: 220, region: "us", particleCount: 75, clusterRadiusX: 75, clusterRadiusY: 60 },
  { name: "MATTE BLACK", color: "#2A2622", anchorX: 545, anchorY: 220, region: "us", particleCount: 75, clusterRadiusX: 75, clusterRadiusY: 60 },
  { name: "WHITE OAK", color: "#B5905A", anchorX: 450, anchorY: 325, region: "us", particleCount: 75, clusterRadiusX: 80, clusterRadiusY: 55 },

  // Modern Farmhouse only — bottom-left petal
  { name: "SHIPLAP", color: "#D6CFC0", anchorX: 180, anchorY: 540, region: "mf", particleCount: 75, clusterRadiusX: 70, clusterRadiusY: 70 },
  { name: "RECLAIMED WOOD", color: "#8C7355", anchorX: 200, anchorY: 650, region: "mf", particleCount: 75, clusterRadiusX: 75, clusterRadiusY: 60 },
  { name: "MILK GLASS GLOBES", color: "#E5DDC8", anchorX: 310, anchorY: 705, region: "mf", particleCount: 75, clusterRadiusX: 75, clusterRadiusY: 55 },

  // Quiet Glam only — bottom-right petal
  { name: "URCHIN PENDANT", color: "#B08940", anchorX: 720, anchorY: 540, region: "qg", particleCount: 75, clusterRadiusX: 70, clusterRadiusY: 70 },
  { name: "VEINED MARBLE WALLS", color: "#D5CAB0", anchorX: 700, anchorY: 650, region: "qg", particleCount: 75, clusterRadiusX: 75, clusterRadiusY: 60 },
  { name: "STAR PATTERN TILE", color: "#C4A265", anchorX: 590, anchorY: 705, region: "qg", particleCount: 75, clusterRadiusX: 75, clusterRadiusY: 55 },

  // US ∩ MF — left lens
  { name: "POLISHED NICKEL", color: "#9FA098", anchorX: 360, anchorY: 420, region: "us-mf", particleCount: 65, clusterRadiusX: 60, clusterRadiusY: 55 },

  // US ∩ QG — right lens
  { name: "HEX MOSAIC", color: "#BFB496", anchorX: 540, anchorY: 420, region: "us-qg", particleCount: 65, clusterRadiusX: 60, clusterRadiusY: 55 },

  // MF ∩ QG — bottom lens
  { name: "BRASS", color: "#BC8E45", anchorX: 450, anchorY: 605, region: "mf-qg", particleCount: 65, clusterRadiusX: 60, clusterRadiusY: 55 },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// Box-Muller transform for gaussian-distributed offsets — gives the particle
// clusters a natural, organic "bell curve" density (densest near the anchor,
// sparser at the edges) instead of a flat uniform spread.
function gaussian(rng: () => number): number {
  const u1 = rng() || 0.0001;
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function MaterialOverlap() {
  const particles = useMemo(() => {
    const rng = seededRandom(217);
    const els: React.ReactNode[] = [];
    let idx = 0;

    MATERIALS.forEach((m) => {
      for (let i = 0; i < m.particleCount; i++) {
        // Gaussian-distributed offset (different stdev x vs y for slightly
        // elongated clusters when the region calls for it).
        const dx = gaussian(rng) * (m.clusterRadiusX / 2);
        const dy = gaussian(rng) * (m.clusterRadiusY / 2);
        const x = m.anchorX + dx;
        const y = m.anchorY + dy;

        // Particle size — heavily skewed toward small with a few larger
        // outliers (Math.pow weighting). Range: ~1px to ~14px.
        const sizeRoll = rng();
        const r = 1 + Math.pow(sizeRoll, 2.5) * 13;

        // Opacity varies — closer to the anchor tends to be slightly more
        // opaque, but with enough randomness to avoid an obvious gradient.
        const distance = Math.sqrt(dx * dx + dy * dy);
        const distanceFalloff = Math.max(0, 1 - distance / (m.clusterRadiusX * 1.4));
        const opacity = 0.12 + rng() * 0.45 + distanceFalloff * 0.15;

        els.push(
          <circle
            key={`p-${idx++}`}
            cx={x}
            cy={y}
            r={r}
            fill={m.color}
            fillOpacity={Math.min(opacity, 0.7)}
          />
        );
      }
    });

    // Stray noise particles — a thin scatter across the whole chart that
    // gives the composition that "sampled from a larger field" feel without
    // adding clutter.
    for (let i = 0; i < 80; i++) {
      const x = rng() * W;
      const y = 100 + rng() * (H - 200);
      const r = 0.5 + rng() * 1.8;
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

  return (
    <div className="w-full px-4 md:px-0 py-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-[9px] md:text-[10px] font-medium tracking-[0.1em] text-[#141414]/40 uppercase">
          Material Overlap
        </span>
        <span className="text-[9px] md:text-[10px] tracking-[0.05em] text-[#141414]/25">
          3 projects · {MATERIALS.length} materials · {MATERIALS.reduce((sum, m) => sum + m.particleCount, 0)} particles
        </span>
      </div>
      <div className="w-full overflow-x-auto" data-lenis-prevent-touch>
        <div className="min-w-[700px] relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ background: "transparent" }}>
            {/* Background grid (very subtle, matches the other charts) */}
            {Array.from({ length: 11 }).map((_, i) => {
              const xPos = (i + 1) * (W / 12);
              const yPos = (i + 1) * (H / 12);
              return (
                <g key={`grid-${i}`}>
                  <line x1={xPos} y1={0} x2={xPos} y2={H} stroke="#141414" strokeWidth={0.5} opacity={0.04} />
                  <line x1={0} y1={yPos} x2={W} y2={yPos} stroke="#141414" strokeWidth={0.5} opacity={0.04} />
                </g>
              );
            })}

            {/* Faded Venn circle outlines — sit under the particle clusters
                so each project's region reads as a soft container without
                competing visually with the dense particle field. */}
            {PROJECTS.map((p) => (
              <circle
                key={`venn-${p.id}`}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill={p.color}
                fillOpacity={0.05}
                stroke={p.color}
                strokeWidth={1.2}
                strokeOpacity={0.18}
              />
            ))}

            {/* Dense particle clusters per material */}
            {particles}

            {/* Material name labels — over each cluster center.
                The "all 3" center material gets a stronger weight; everything
                else stays compact and readable on top of the particles. */}
            {MATERIALS.map((m) => (
              <g key={`label-${m.name}`}>
                {/* Subtle white scrim behind each label so it stays legible
                    on top of the densest cluster regions */}
                <rect
                  x={m.anchorX - (m.name.length * (m.region === "all" ? 4 : 3.2))}
                  y={m.anchorY - (m.region === "all" ? 9 : 7)}
                  width={m.name.length * (m.region === "all" ? 8 : 6.4)}
                  height={m.region === "all" ? 16 : 13}
                  rx={2}
                  fill="#F5F2ED"
                  fillOpacity={0.75}
                />
                <text
                  x={m.anchorX}
                  y={m.anchorY + (m.region === "all" ? 4 : 3)}
                  textAnchor="middle"
                  fill="#141414"
                  fillOpacity={m.region === "all" ? 0.95 : 0.8}
                  fontSize={m.region === "all" ? "11" : "9"}
                  fontFamily="var(--font-satoshi), sans-serif"
                  fontWeight={m.region === "all" ? 700 : 600}
                  letterSpacing="0.06em"
                  style={{ pointerEvents: "none" }}
                >
                  {m.name}
                </text>
              </g>
            ))}

            {/* Project name labels — at the periphery, in the project's hue */}
            {PROJECTS.map((p) => (
              <text
                key={`pname-${p.id}`}
                x={p.labelX}
                y={p.labelY}
                textAnchor="middle"
                fill={p.color}
                fontSize="13"
                fontFamily="var(--font-satoshi), sans-serif"
                fontWeight={700}
                letterSpacing="0.12em"
              >
                {p.name}
              </text>
            ))}

            {/* Legend at the bottom */}
            <g>
              <text x={20} y={H - 12} fill="#141414" fillOpacity={0.3} fontSize="8" fontFamily="var(--font-satoshi), sans-serif" letterSpacing="0.05em">
                EACH MATERIAL ≈ 50 PARTICLES · CLUSTER OVERLAPS = SHARED USE · CENTER = ALL THREE PROJECTS
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
