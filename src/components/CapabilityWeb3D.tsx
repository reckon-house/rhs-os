"use client";

/**
 * CapabilityWeb3D — three.js / R3F rebuild of the SECTION 04: PRACTICE chart.
 *
 * Same data as CapabilityWeb.tsx (disciplines / skills / tools / particles),
 * laid out as a tilted galactic disc with rising pillars, glowing nodes, and
 * a hazy particle cloud. Slow auto-rotation gives life without distraction.
 *
 * Rendering posture: every line type is merged into a single BufferGeometry
 * and drawn as one <lineSegments>, particles use InstancedMesh, no Troika
 * text inside the canvas. Keeps the GPU footprint tiny so the WebGL context
 * stays alive on integrated graphics.
 *
 * Loaded via dynamic() with `ssr: false` from CapabilityWebShowpiece.
 */

import { useLayoutEffect, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// ── Data (same shape as 2D version, scaled to three.js units) ───────────
const R1 = 1.08;
const R2 = 2.15;
const R3 = 3.10;
const R4 = 3.95;
const R5 = 4.65;

const DIGITAL_COLORS  = ["#7A8B5A", "#B1BC94", "#6B8060", "#8FA07A", "#556B4A", "#C4C4A0"];
const BRAND_COLORS    = ["#CC5555", "#BB6666", "#C4876A", "#AA4455", "#DD7777", "#C47070"];
const INTERIOR_COLORS = ["#C4A265", "#AA7E44", "#8B7355", "#A0886C", "#9B8E7E", "#CC9966"];
const ALL_COLORS      = [...DIGITAL_COLORS, ...BRAND_COLORS, ...INTERIOR_COLORS];

const DISCIPLINES = [
  { label: "Digital",   angle: 0,   color: "#6B8060" },
  { label: "Branding",  angle: 120, color: "#BB6666" },
  { label: "Interiors", angle: 240, color: "#AA7E44" },
] as const;

const SKILLS = [
  { label: "Full-Stack Eng",     angle: 318, disc: 0, color: "#7A8B5A" },
  { label: "AI Integration",     angle: 334, disc: 0, color: "#6B8060" },
  { label: "Systems Design",     angle: 350, disc: 0, color: "#8FA07A" },
  { label: "Product Strategy",   angle: 9,   disc: 0, color: "#B1BC94" },
  { label: "Rapid Prototyping",  angle: 24,  disc: 0, color: "#556B4A" },
  { label: "No-Code Arch",       angle: 40,  disc: 0, color: "#7A8B5A" },
  { label: "Brand Strategy",     angle: 80,  disc: 1, color: "#BB6666" },
  { label: "Creative Direction", angle: 97,  disc: 1, color: "#CC5555" },
  { label: "Visual Identity",    angle: 114, disc: 1, color: "#C4876A" },
  { label: "3D & Motion",        angle: 131, disc: 1, color: "#BB6666" },
  { label: "Gen. Imagery",       angle: 147, disc: 1, color: "#AA4455" },
  { label: "Content Systems",    angle: 163, disc: 1, color: "#C47070" },
  { label: "Int. Architecture",  angle: 200, disc: 2, color: "#C4A265" },
  { label: "FF&E Sourcing",      angle: 218, disc: 2, color: "#AA7E44" },
  { label: "Custom Fabrication", angle: 237, disc: 2, color: "#8B7355" },
  { label: "Installation Mgmt",  angle: 256, disc: 2, color: "#9B8E7E" },
  { label: "Experiential",       angle: 273, disc: 2, color: "#A0886C" },
] as const;

const TOOLS = [
  { label: "React / Next.js",     angle: 320, color: "#7A8B5A" },
  { label: "Tailwind",            angle: 330, color: "#B1BC94" },
  { label: "OpenAI API",          angle: 340, color: "#6B8060" },
  { label: "Computer Vision",     angle: 350, color: "#8FA07A" },
  { label: "LLMs",                angle: 359, color: "#7A8B5A" },
  { label: "Framer",              angle: 10,  color: "#556B4A" },
  { label: "Webflow",             angle: 18,  color: "#8FA07A" },
  { label: "Replit / V0",         angle: 28,  color: "#6B8060" },
  { label: "Spline",              angle: 38,  color: "#7A8B5A" },
  { label: "Art Direction",       angle: 78,  color: "#BB6666" },
  { label: "Voice & Tone",        angle: 89,  color: "#C47070" },
  { label: "Typography",          angle: 100, color: "#CC5555" },
  { label: "Color Systems",       angle: 110, color: "#BB6666" },
  { label: "After Effects",       angle: 122, color: "#C4876A" },
  { label: "Midjourney",          angle: 133, color: "#CC5555" },
  { label: "Custom LoRA",         angle: 144, color: "#AA4455" },
  { label: "Social Grids",        angle: 155, color: "#C47070" },
  { label: "Email Arch",          angle: 165, color: "#BB6666" },
  { label: "Space Planning",      angle: 200, color: "#C4A265" },
  { label: "FF&E",                angle: 212, color: "#AA7E44" },
  { label: "Millwork Design",     angle: 224, color: "#8B7355" },
  { label: "Material Selection",  angle: 236, color: "#C4A265" },
  { label: "On-site Direction",   angle: 248, color: "#9B8E7E" },
  { label: "Pop-up / Retail",     angle: 260, color: "#A0886C" },
  { label: "Fabrication",         angle: 272, color: "#8B7355" },
] as const;

const CROSS_CONNECTIONS: ReadonlyArray<readonly [number, number]> = [
  [2, 6], [3, 6], [4, 9], [0, 8], [5, 11], [11, 16], [9, 12], [10, 16], [7, 12], [1, 10],
];

// ── Helpers ─────────────────────────────────────────────────────────────
function polar(r: number, angleDeg: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [r * Math.cos(rad), r * Math.sin(rad)];
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Layer heights (Y-up) ────────────────────────────────────────────────
const Y_DISC_TOP = 0.42;
const Y_SKILL = 0.28;
const Y_TOOL = 0.14;
const Y_HUB_TOP = 0.55;

// ════════════════════════════════════════════════════════════════════════
// Merged ring + web-line geometry — one draw call for ALL lines
// ════════════════════════════════════════════════════════════════════════

type Segment = { a: THREE.Vector3; b: THREE.Vector3; color: THREE.Color };

function buildLineSegments() {
  const segs: Segment[] = [];
  const rng = seededRandom(77);

  const inkColor = new THREE.Color("#F0EAE4");

  // Concentric rings — sample each circle into many short segments
  const ringRadii = [R1, R2, R3, R4, R5];
  const ringResolution = 96;
  for (const r of ringRadii) {
    for (let i = 0; i < ringResolution; i++) {
      const a0 = (i / ringResolution) * Math.PI * 2;
      const a1 = ((i + 1) / ringResolution) * Math.PI * 2;
      segs.push({
        a: new THREE.Vector3(Math.cos(a0) * r, 0.005, Math.sin(a0) * r),
        b: new THREE.Vector3(Math.cos(a1) * r, 0.005, Math.sin(a1) * r),
        color: inkColor,
      });
    }
  }

  // Skill → discipline radials
  SKILLS.forEach((skill) => {
    const [sx, sz] = polar(R2 - 0.12, skill.angle);
    const disc = DISCIPLINES[skill.disc];
    const [dx, dz] = polar(R1 + 0.3, disc.angle);
    const start = new THREE.Vector3(sx, 0.01, sz);
    const end = new THREE.Vector3(dx, 0.01, dz);
    // Sample bezier in 12 short segments for an arched look
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 0.04;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const pts = curve.getPoints(12);
    const c = new THREE.Color(skill.color);
    for (let i = 0; i < pts.length - 1; i++) {
      segs.push({ a: pts[i], b: pts[i + 1], color: c });
    }
  });

  // Tool → nearest skill (small hops)
  TOOLS.forEach((tool) => {
    const nearest = SKILLS.reduce((best, s) => {
      const d = Math.abs(((s.angle - tool.angle + 540) % 360) - 180);
      const bd = Math.abs(((best.angle - tool.angle + 540) % 360) - 180);
      return d < bd ? s : best;
    });
    const [sx, sz] = polar(R3 - 0.08, tool.angle);
    const [ex, ez] = polar(R2 + 0.14, nearest.angle);
    const start = new THREE.Vector3(sx, Y_TOOL, sz);
    const end = new THREE.Vector3(ex, Y_SKILL - 0.04, ez);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 0.06;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const pts = curve.getPoints(10);
    const c = new THREE.Color(tool.color);
    for (let i = 0; i < pts.length - 1; i++) {
      segs.push({ a: pts[i], b: pts[i + 1], color: c });
    }
  });

  // Cross-discipline arches — the showpiece, lifted high
  CROSS_CONNECTIONS.forEach(([ai, bi]) => {
    const a = SKILLS[ai], b = SKILLS[bi];
    const [ax, az] = polar(R2, a.angle);
    const [bx, bz] = polar(R2, b.angle);
    const start = new THREE.Vector3(ax, Y_SKILL, az);
    const end = new THREE.Vector3(bx, Y_SKILL, bz);
    const mid = start.clone().lerp(end, 0.5);
    const chord = start.distanceTo(end);
    mid.y += chord * 0.42;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const pts = curve.getPoints(28);
    const c = new THREE.Color(a.color);
    for (let i = 0; i < pts.length - 1; i++) {
      segs.push({ a: pts[i], b: pts[i + 1], color: c });
    }
  });

  // Atmospheric short threads
  for (let i = 0; i < 80; i++) {
    const r1t = R1 + rng() * (R5 - R1);
    const r2t = R1 + rng() * (R5 - R1);
    const a1 = rng() * 360;
    const a2 = a1 + (rng() - 0.5) * 50;
    const [x1, z1] = polar(r1t, a1);
    const [x2, z2] = polar(r2t, a2);
    const start = new THREE.Vector3(x1, 0.04 + rng() * 0.12, z1);
    const end = new THREE.Vector3(x2, 0.04 + rng() * 0.12, z2);
    const c = new THREE.Color(ALL_COLORS[Math.floor(rng() * ALL_COLORS.length)]);
    segs.push({ a: start, b: end, color: c });
  }

  // Build interleaved Float32 buffers for positions and colors
  const positions = new Float32Array(segs.length * 6);
  const colors = new Float32Array(segs.length * 6);
  segs.forEach((s, i) => {
    positions[i * 6 + 0] = s.a.x;
    positions[i * 6 + 1] = s.a.y;
    positions[i * 6 + 2] = s.a.z;
    positions[i * 6 + 3] = s.b.x;
    positions[i * 6 + 4] = s.b.y;
    positions[i * 6 + 5] = s.b.z;
    colors[i * 6 + 0] = s.color.r;
    colors[i * 6 + 1] = s.color.g;
    colors[i * 6 + 2] = s.color.b;
    colors[i * 6 + 3] = s.color.r;
    colors[i * 6 + 4] = s.color.g;
    colors[i * 6 + 5] = s.color.b;
  });

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geom;
}

// ════════════════════════════════════════════════════════════════════════
// Particle cloud — single InstancedMesh, no per-frame matrix updates
// ════════════════════════════════════════════════════════════════════════

function ParticleCloud({ count = 350 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const data = useMemo(() => {
    const rng = seededRandom(42);
    const items: { x: number; y: number; z: number; scale: number; color: THREE.Color }[] = [];

    SKILLS.forEach((skill) => {
      const [cx, cz] = polar(R2, skill.angle);
      for (let j = 0; j < 14; j++) {
        const a = rng() * Math.PI * 2;
        const dist = 0.1 + rng() * 0.5;
        items.push({
          x: cx + Math.cos(a) * dist,
          y: 0.05 + rng() * 0.22,
          z: cz + Math.sin(a) * dist,
          scale: 0.012 + rng() * 0.035,
          color: new THREE.Color(skill.color),
        });
      }
    });

    TOOLS.forEach((tool) => {
      const [cx, cz] = polar(R3, tool.angle);
      for (let j = 0; j < 8; j++) {
        const a = rng() * Math.PI * 2;
        const dist = 0.08 + rng() * 0.36;
        items.push({
          x: cx + Math.cos(a) * dist,
          y: 0.03 + rng() * 0.16,
          z: cz + Math.sin(a) * dist,
          scale: 0.008 + rng() * 0.028,
          color: new THREE.Color(tool.color),
        });
      }
    });

    const remaining = count - items.length;
    for (let i = 0; i < remaining; i++) {
      const r = R1 - 0.3 + rng() * (R5 - R1 + 0.5);
      const a = rng() * 360;
      const [x, z] = polar(r, a);
      items.push({
        x, y: 0.01 + rng() * 0.4, z,
        scale: 0.005 + rng() * 0.022,
        color: new THREE.Color(ALL_COLORS[Math.floor(rng() * ALL_COLORS.length)]),
      });
    }

    return items.slice(0, count);
  }, [count]);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Matrix4();
    data.forEach((item, i) => {
      m.makeScale(item.scale, item.scale, item.scale);
      m.setPosition(item.x, item.y, item.z);
      ref.current!.setMatrixAt(i, m);
      ref.current!.setColorAt(i, item.color);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [data]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial vertexColors transparent opacity={0.7} />
    </instancedMesh>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Discipline pillar (cylinder + cap halo)
// ════════════════════════════════════════════════════════════════════════

function DisciplinePillar({ angle, color, label }: { angle: number; color: string; label: string }) {
  const [x, z] = polar(R1, angle);
  return (
    <group position={[x, 0, z]}>
      {/* Floor halo */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.36, 0.55, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      {/* Pillar body — capsule shape: rounded top, soft bottom */}
      <mesh position={[0, Y_DISC_TOP * 0.55, 0]}>
        <capsuleGeometry args={[0.34, Y_DISC_TOP * 0.7, 12, 24]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.15}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.05}
          iridescence={0.55}
          iridescenceIOR={1.35}
          iridescenceThicknessRange={[120, 720]}
        />
      </mesh>
      {/* Discipline label — sits above the capsule */}
      <Html position={[0, Y_DISC_TOP + 0.32, 0]} center pointerEvents="none">
        <div className="discipline-label" style={{ color }}>{label.toUpperCase()}</div>
      </Html>
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Skill node (raised colored sphere with stem)
// ════════════════════════════════════════════════════════════════════════

function SkillNode({ angle, color, label }: { angle: number; color: string; label: string }) {
  const [x, z] = polar(R2, angle);
  return (
    <group position={[x, 0, z]}>
      {/* Stem from floor to skill height */}
      <mesh position={[0, Y_SKILL / 2, 0]}>
        <cylinderGeometry args={[0.005, 0.005, Y_SKILL, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      {/* Iridescent glossy node */}
      <mesh position={[0, Y_SKILL, 0]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.2}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.04}
          iridescence={0.7}
          iridescenceIOR={1.4}
          iridescenceThicknessRange={[100, 800]}
        />
      </mesh>
      {/* Skill label */}
      <Html position={[0, Y_SKILL + 0.2, 0]} center pointerEvents="none">
        <div className="skill-label">{label}</div>
      </Html>
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Scene wrapper — auto-rotation, camera aim
// ════════════════════════════════════════════════════════════════════════

function Scene({ dark }: { dark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Aim camera at the centerpiece (head-on framing)
  useEffect(() => {
    camera.lookAt(0, 0.45, 0);
  }, [camera]);

  // Slow rotation — slow enough to read labels, fast enough to feel alive
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.025;
  });

  // Build the merged line geometry once
  const lineGeometry = useMemo(() => buildLineSegments(), []);

  // Centerpiece color — pearlescent white reads as the holographic bauble in
  // both modes; iridescence does the heavy lifting on actual hue.
  const surface = dark ? "#E8E4DD" : "#efebe4";

  return (
    <>
      {/* Studio-style 3-point light rig — fakes the highlights an HDR would
          provide, without the cubemap GPU cost or the CDN dependency. */}
      <ambientLight intensity={dark ? 0.6 : 0.75} />
      {/* Key — warm, upper-front-right */}
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#fff2e0" />
      {/* Fill — cool, low-front-left */}
      <directionalLight position={[-5, 1.5, 3]} intensity={0.9} color="#a4c7ff" />
      {/* Rim — saturated, behind, lifts the silhouettes */}
      <directionalLight position={[-2, 5, -6]} intensity={0.8} color="#ff8fc4" />
      {/* Underbounce — subtle blue from below */}
      <directionalLight position={[0, -3, 2]} intensity={0.35} color="#7fb6ff" />
      {DISCIPLINES.map((d, i) => {
        const [x, z] = polar(R1, d.angle);
        return (
          <pointLight
            key={`pl-${i}`}
            position={[x, 0.6, z]}
            color={d.color}
            intensity={0.4}
            distance={2.8}
          />
        );
      })}

      <group ref={groupRef}>
        {/* Floor disc */}
        <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[R5 + 0.3, 96]} />
          <meshStandardMaterial color={dark ? "#252220" : "#e7e3dc"} roughness={0.9} metalness={0} />
        </mesh>

        {/* Single merged line draw — rings + web + atmospheric threads */}
        <lineSegments geometry={lineGeometry}>
          <lineBasicMaterial vertexColors transparent opacity={0.55} />
        </lineSegments>

        <ParticleCloud count={350} />

        {/* Tool dots — small glossy beads with HTML labels at the outer ring */}
        {TOOLS.map((tool, i) => {
          const [x, z] = polar(R3, tool.angle);
          const norm = ((tool.angle % 360) + 360) % 360;
          const isLeft = norm > 180;
          // Label sits a bit further out than the bead
          const [lx, lz] = polar(R3 + 0.18, tool.angle);
          return (
            <group key={`t-${i}`}>
              <mesh position={[x, Y_TOOL, z]}>
                <sphereGeometry args={[0.055, 16, 16]} />
                <meshStandardMaterial
                  color={tool.color}
                  metalness={0.2}
                  roughness={0.18}
                />
              </mesh>
              <Html
                position={[lx, Y_TOOL + 0.04, lz]}
                pointerEvents="none"
                style={{ transform: `translate(${isLeft ? "-100%" : "0"}, -50%)` }}
              >
                <div className="tool-label">{tool.label}</div>
              </Html>
            </group>
          );
        })}

        {/* Skill nodes (raised) */}
        {SKILLS.map((skill, i) => (
          <SkillNode key={`s-${i}`} angle={skill.angle} color={skill.color} label={skill.label} />
        ))}

        {/* Discipline pillars */}
        {DISCIPLINES.map((disc, i) => (
          <DisciplinePillar key={`d-${i}`} angle={disc.angle} color={disc.color} label={disc.label} />
        ))}

        {/* Center hub (RHS) — chrome bauble, the centerpiece */}
        <group>
          <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.42, 0.6, 48]} />
            <meshBasicMaterial color="#F0EAE4" transparent opacity={0.18} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, Y_HUB_TOP * 0.55, 0]}>
            <capsuleGeometry args={[0.4, Y_HUB_TOP * 0.6, 12, 24]} />
            <meshPhysicalMaterial
              color={surface}
              metalness={0.3}
              roughness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.03}
              iridescence={0.9}
              iridescenceIOR={1.45}
              iridescenceThicknessRange={[100, 900]}
            />
          </mesh>
          <Html position={[0, Y_HUB_TOP + 0.32, 0]} center pointerEvents="none">
            <div className="hub-label">RHS</div>
          </Html>
        </group>
      </group>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Public component
// ════════════════════════════════════════════════════════════════════════

export default function CapabilityWeb3D({ dark = true }: { dark?: boolean }) {
  return (
    <div className="w-full" style={{ height: "min(720px, 92vh)" }}>
      <Canvas
        camera={{ position: [0, 2.4, 6.8], fov: 40 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.35, 0)}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Scene dark={dark} />
      </Canvas>
    </div>
  );
}
