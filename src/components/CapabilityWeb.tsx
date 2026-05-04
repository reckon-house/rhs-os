"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ScrambleOnView } from "@/components/fx/ScrambleText";

// ── Color helpers — used to derive 3D-orb gradients from each base color ───
function parseHex(hex: string): [number, number, number] {
  const v = hex.replace("#", "");
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}
function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
function lightenHex(hex: string, amt: number): string {
  const [r, g, b] = parseHex(hex);
  return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}
function darkenHex(hex: string, amt: number): string {
  const [r, g, b] = parseHex(hex);
  return rgbToHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
}
/** Stable id-safe slug for a hex color (drop the #). */
function colorId(hex: string): string {
  return hex.replace("#", "");
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Round to 4 decimals — Node and V8 Math intrinsics can disagree at the last
// bit of float precision, which surfaces as a SSR/CSR hydration mismatch on
// SVG numeric attributes. 4 decimals is more than enough for the chart and
// flushes those phantom diffs.
function round4(n: number) {
  return Math.round(n * 10000) / 10000;
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: round4(cx + r * Math.cos(rad)), y: round4(cy + r * Math.sin(rad)) };
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
        <ScrambleOnView text="SECTION: PRACTICE" />
      </span>
      <h2 className={`text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold ${inkClass}`}>
        Putting the work first.
      </h2>
      <p className={`mt-4 text-[14px] md:text-[16px] leading-[1.6] ${inkDim} mb-6`}>
        It&apos;s the part I love most.
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
        <p>
          <span className="font-bold">Contact </span>
          <a
            href="mailto:hello@reckon.house"
            className="underline underline-offset-2 hover:text-[#F0EAE4] transition-colors"
          >
            hello@reckon.house
          </a>
          {"  "}214.697.4578{"  "}
          <a
            href="https://instagram.com/reckonhousestaples"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#F0EAE4] transition-colors"
          >
            IG @reckonhousestaples
          </a>
        </p>
      </div>

      <div className={`mt-6 md:mt-4 md:ml-[48%] text-body ${inkDim}`}>
        <p className={`font-bold ${inkClass} indent-[4em]`}>Abstract</p>
        <p className="indent-[4em]">
          The work means a lot of things at once - writing the code that ships an app, picking the marble that goes in a kitchen, art directing a campaign shoot, building a brand voice from scratch, designing the AI tooling that runs marketing operations at enterprise scale. These aren&apos;t separate jobs, they&apos;re the same job showing up in different rooms.
        </p>
        <p className="mt-4">
          What makes it work is the no-handoff part. Wireframing and coding happen in the same week. Picking kitchen finishes and coordinating the install happen on the same site visit. The thinking and the making stay close to each other, which is why the disciplines stay connected instead of competing for attention.
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

  // ── Scroll-driven parallax ─────────────────────────────────────
  // Computed in rAF and applied directly to the DOM via refs so there's
  // no React re-render on scroll. The chart has ~1700 SVG nodes; pushing
  // parallax through useState would reconcile all of them every frame.
  const containerRef = useRef<HTMLDivElement>(null);
  const outerLayerRef = useRef<SVGGElement | null>(null);
  const nebulaLayerRef = useRef<SVGGElement | null>(null);
  const starsFarRef = useRef<SVGGElement | null>(null);
  const starsMidRef = useRef<SVGGElement | null>(null);
  const starsNearRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let target = 0;     // scroll-derived parallax (0..1)
    let current = 0;    // smoothed value applied to the DOM
    let running = false;
    let inView = false; // gated by IntersectionObserver

    const apply = (t: number) => {
      if (outerLayerRef.current) {
        outerLayerRef.current.style.transform = `scale(${1 + t * 0.045})`;
      }
      if (nebulaLayerRef.current) {
        nebulaLayerRef.current.style.transform = `rotate(${t * -1.4}deg) scale(${1 + t * 0.04})`;
      }
      if (starsFarRef.current) {
        starsFarRef.current.style.transform = `rotate(${t * -0.8}deg) scale(${1 + t * 0.025})`;
      }
      if (starsMidRef.current) {
        starsMidRef.current.style.transform = `rotate(${t * -1.6}deg) scale(${1 + t * 0.07})`;
      }
      if (starsNearRef.current) {
        starsNearRef.current.style.transform = `rotate(${t * -2.6}deg) scale(${1 + t * 0.14})`;
      }
    };

    // Continuous rAF loop while the value hasn't settled. LERPing the
    // displayed value toward the scroll-derived target masks any
    // frame-time variance and feels physically smooth.
    const animate = () => {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.001) {
        current = target;
        apply(current);
        running = false;
        return;
      }
      apply(current);
      raf = requestAnimationFrame(animate);
    };

    const readTarget = () => {
      // Skip when off-screen — IntersectionObserver flips inView.
      if (!inView) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      target = Math.max(-0.2, Math.min(1.2, 1 - center / vh));
      if (!running) {
        running = true;
        raf = requestAnimationFrame(animate);
      }
    };

    // Seed both target and current at mount so the layers start at rest.
    const el = containerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      target = Math.max(-0.2, Math.min(1.2, 1 - center / vh));
      current = target;
      apply(current);
    }

    // IntersectionObserver gates everything below. The capture-phase
    // scroll listener stays attached but no-ops while the chart is off
    // screen — saves work on long pages where the chart is far below.
    // rootMargin gives a generous lead so parallax has time to seed
    // before the chart enters the viewport.
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              const hit = entries[0]?.isIntersecting ?? false;
              const wasOut = !inView;
              inView = hit;
              if (hit && wasOut) {
                // Re-seed target on entry so first frame is correct.
                readTarget();
              }
            },
            { rootMargin: "200px 0px" }
          )
        : null;
    if (io && el) io.observe(el);
    // Fallback when IO is unavailable: always treat as in view.
    if (!io) inView = true;

    // Capture-phase catches scrolls from any scroll container (page
    // scroll lives on a content wrapper, not <body>, in this layout).
    document.addEventListener("scroll", readTarget, { capture: true, passive: true });
    window.addEventListener("resize", readTarget);
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      document.removeEventListener("scroll", readTarget, { capture: true } as EventListenerOptions);
      window.removeEventListener("resize", readTarget);
    };
  }, []);

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
          x: round4(center.x + Math.cos(a) * dist),
          y: round4(center.y + Math.sin(a) * dist),
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
          x: round4(center.x + Math.cos(a) * (spread * (0.15 + rng() * 0.85))),
          y: round4(center.y + Math.sin(a) * (spread * (0.15 + rng() * 0.85))),
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
          x: round4(center.x + Math.cos(a) * (spread * (0.2 + rng() * 0.8))),
          y: round4(center.y + Math.sin(a) * (spread * (0.2 + rng() * 0.8))),
          r: 1.2 + rng() * 4,
          color: disc.color,
          opacity: 0.06 + rng() * 0.22,
        });
      }
    });

    // Atmospheric scatter
    for (let i = 0; i < 220; i++) {
      const ring = (R1 - 30) + rng() * (R5 - R1 + 50);
      const angle = rng() * 360;
      const pos = polar(CX, CY, ring, angle);
      dots.push({
        x: round4(pos.x + (rng() - 0.5) * 18),
        y: round4(pos.y + (rng() - 0.5) * 18),
        r: 0.3 + rng() * 2,
        color: ALL_COLORS[Math.floor(rng() * ALL_COLORS.length)],
        opacity: 0.02 + rng() * 0.1,
      });
    }

    // R4 detail ring scatter
    for (let i = 0; i < 60; i++) {
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

  // ── Starfield — dense distant stars across the whole canvas, gives
  // the chart galactic depth instead of a clean solar-system look.
  // X range matches the wide viewBox (-200..1200) so stars bleed
  // past the chart's circular footprint to the dark-card edges. ──
  const stars = useMemo(() => {
    const rng = seededRandom(123);
    const list: { x: number; y: number; r: number; color: string; opacity: number }[] = [];

    // Layer 1: distant pinpricks (kept lean — they're below visibility threshold individually)
    for (let i = 0; i < 520; i++) {
      list.push({
        x: -200 + rng() * 1400,
        y: rng() * 1000,
        r: 0.3 + rng() * 0.6,
        color: rng() > 0.85 ? "#FFE8B0" : "#F5EFE8",
        opacity: 0.18 + rng() * 0.32,
      });
    }
    // Layer 2: mid-distance stars
    for (let i = 0; i < 220; i++) {
      list.push({
        x: -200 + rng() * 1400,
        y: rng() * 1000,
        r: 0.55 + rng() * 0.95,
        color: "#F5EFE8",
        opacity: 0.32 + rng() * 0.38,
      });
    }
    // Layer 3: bright foreground stars (sparse, do most of the visual work)
    for (let i = 0; i < 60; i++) {
      list.push({
        x: -200 + rng() * 1400,
        y: rng() * 1000,
        r: 0.9 + rng() * 1.5,
        color: rng() > 0.75 ? "#FFE8B0" : "#FFFFFF",
        opacity: 0.5 + rng() * 0.4,
      });
    }

    return list;
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
      const ctrl = { x: round4(CX + (from.x - CX) * 0.3 + (to.x - CX) * 0.3), y: round4(CY + (from.y - CY) * 0.3 + (to.y - CY) * 0.3) };
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

  // Collect every unique color used by orbs so we can pre-build a radial
  // gradient for each one. Gradients sit in <defs> and are referenced by id.
  const orbColors = useMemo(() => {
    const set = new Set<string>();
    DISCIPLINES.forEach((d) => set.add(d.color));
    SKILLS.forEach((s) => set.add(s.color));
    TOOLS.forEach((t) => set.add(t.color));
    return Array.from(set);
  }, []);

  // ── Pre-rasterized atmosphere ──────────────────────────────────
  // Draw stars/particles/web-lines/radial-grid to offscreen canvases
  // once at mount, expose as data URLs, and reference them in the SVG
  // as <image> elements. Collapses ~2,500 SVG nodes into 6 image refs.
  // The interactive elements (planets, hub, labels, rings) stay live
  // SVG — only the static atmospheric texture moves to canvas.
  const [bgUrls, setBgUrls] = useState<{
    starsFar: string;
    starsMid: string;
    starsNear: string;
    particles: string;
    webLines: string;
    radialGrid: string;
  } | null>(null);

  useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    // Canvas matches the SVG viewBox "-200 0 1400 1000". Translate the
    // canvas origin so SVG x=-200 maps to canvas x=0.
    const VW = 1400;
    const VH = 1000;
    const VX = -200;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const make = (draw: (ctx: CanvasRenderingContext2D) => void) => {
      const c = document.createElement("canvas");
      c.width = VW * dpr;
      c.height = VH * dpr;
      const ctx = c.getContext("2d");
      if (!ctx) return "";
      ctx.scale(dpr, dpr);
      ctx.translate(-VX, 0);
      draw(ctx);
      return c.toDataURL("image/png");
    };

    const drawDots =
      (subset: { x: number; y: number; r: number; color: string; opacity: number }[]) =>
      (ctx: CanvasRenderingContext2D) => {
        subset.forEach((d) => {
          ctx.fillStyle = d.color;
          ctx.globalAlpha = d.opacity;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();
        });
      };

    const drawWebLines = (ctx: CanvasRenderingContext2D) => {
      webLines.forEach((line) => {
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.opacity;
        ctx.lineWidth = line.width;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
      });
    };

    const drawRadialGrid = (ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = INK;
      for (let i = 0; i < 72; i++) {
        const angle = i * 5;
        const major = angle % 30 === 0;
        const mid = angle % 15 === 0;
        const inner = polar(CX, CY, R1 - 12, angle);
        const outer = polar(CX, CY, R5 + 22, angle);
        ctx.lineWidth = major ? 0.25 : mid ? 0.15 : 0.08;
        ctx.globalAlpha = major ? 0.04 : mid ? 0.025 : 0.012;
        ctx.beginPath();
        ctx.moveTo(inner.x, inner.y);
        ctx.lineTo(outer.x, outer.y);
        ctx.stroke();
      }
    };

    setBgUrls({
      starsFar: make(drawDots(stars.slice(0, 520))),
      starsMid: make(drawDots(stars.slice(520, 740))),
      starsNear: make(drawDots(stars.slice(740))),
      particles: make(drawDots(particles)),
      webLines: make(drawWebLines),
      radialGrid: make(drawRadialGrid),
    });
  }, [stars, particles, webLines, INK]);

  return (
    <div
      className="w-full"
      ref={containerRef}
      // Bleed past the dark card's horizontal padding so the galaxy
      // gradient and starfield reach the rounded card edges. Margin
      // value matches the parent's clamp() padding exactly.
      style={{
        marginLeft: "calc(-1 * clamp(24px, 5vw, 64px))",
        marginRight: "calc(-1 * clamp(24px, 5vw, 64px))",
        width: "auto",
      }}
    >
      {/* Chart — horizontal scroll on mobile */}
      <div className="overflow-x-auto md:overflow-x-visible">
      <div className="min-w-[800px] md:min-w-0 w-full px-4 md:px-0">
        <svg viewBox="-200 0 1400 1000" className="w-full h-auto" style={{
          fontFamily: "'Satoshi', system-ui, sans-serif",
          // Promote to a separate compositing layer so scroll-driven
          // transform updates inside the SVG don't repaint the page.
          willChange: "transform",
          transform: "translateZ(0)",
        }}>

          {/* ── 3D-orb defs: per-color radial gradients + soft shadow ─── */}
          <defs>
            {orbColors.map((c) => {
              const id = `orb-${colorId(c)}`;
              const hi = lightenHex(c, 0.55);
              const lo = darkenHex(c, 0.35);
              return (
                <radialGradient key={id} id={id} cx="32%" cy="28%" r="78%">
                  <stop offset="0%" stopColor={hi} />
                  <stop offset="42%" stopColor={c} />
                  <stop offset="100%" stopColor={lo} />
                </radialGradient>
              );
            })}

            {/* Sun gradient — warm corona core, deep at the limb */}
            <radialGradient id="sun-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF8E2" stopOpacity={1} />
              <stop offset="35%" stopColor="#FFD98C" />
              <stop offset="75%" stopColor="#E89B3F" />
              <stop offset="100%" stopColor="#9C5520" stopOpacity={0.95} />
            </radialGradient>

            {/* Sun corona — soft outer glow that fades to nothing */}
            <radialGradient id="sun-corona" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD98C" stopOpacity={0.55} />
              <stop offset="50%" stopColor="#E89B3F" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#9C5520" stopOpacity={0} />
            </radialGradient>

            {/* Subtle terminator overlay — darkens the lower-right of each
                planet to give classic illustrated-planet shading instead of
                the glossy modern sheen we had before. */}
            <radialGradient id="terminator" cx="68%" cy="72%" r="65%">
              <stop offset="40%" stopColor="#000000" stopOpacity={0} />
              <stop offset="100%" stopColor="#000000" stopOpacity={0.45} />
            </radialGradient>

            {/* Bottom edge fade — dissolves the chart's atmospheric layer
                into the dark card color so the SVG doesn't read as a hard
                rectangle sitting inside the closing block. */}
            <linearGradient id="bottom-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#141414" stopOpacity={0} />
              <stop offset="100%" stopColor="#141414" stopOpacity={1} />
            </linearGradient>
            {/* Top edge fade — same idea, applied to the top so the chart
                doesn't pop in either. The header copy sits above this. */}
            <linearGradient id="top-fade" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#141414" stopOpacity={0} />
              <stop offset="100%" stopColor="#141414" stopOpacity={1} />
            </linearGradient>

            {/* Distant nebula color washes — low-opacity radial gradients
                that fake galactic dust clouds and add depth to the field */}
            <radialGradient id="nebula-cool" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1F3340" stopOpacity={0.32} />
              <stop offset="100%" stopColor="#1F3340" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="nebula-warm" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#5C2E1F" stopOpacity={0.26} />
              <stop offset="100%" stopColor="#5C2E1F" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="nebula-amber" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3F2A18" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#3F2A18" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="nebula-violet" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2A1E33" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#2A1E33" stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* ── Background square grid (stays fixed — page-grid reference)
              Grid columns extend across the wide viewBox so the L/R bleed
              areas still feel structurally tied to the chart. ── */}
          {Array.from({ length: 14 }).map((_, i) => {
            // 14 vertical lines from x=-100 to x=1200 in 100-unit steps
            const pos = -100 + i * 100;
            return (
              <line key={`grid-v-${i}`} x1={pos} y1={0} x2={pos} y2={1000}
                stroke={INK} strokeWidth={0.5} opacity={0.1} />
            );
          })}
          {Array.from({ length: 11 }).map((_, i) => {
            // 11 horizontal lines spanning the wide canvas
            const pos = (i + 1) * (1000 / 12);
            return (
              <line key={`grid-h-${i}`} x1={-200} y1={pos} x2={1200} y2={pos}
                stroke={INK} strokeWidth={0.5} opacity={0.1} />
            );
          })}

          {/* ── Galaxy field — outer parallax wrapper.
              Scales the whole cosmic scene as scroll progress increases,
              giving the "pulled deeper into the galaxy" feel. Legend
              and grid live outside this group so they stay anchored.
              Transform applied imperatively in rAF — see useEffect. ── */}
          <g ref={outerLayerRef} style={{ transformOrigin: "500px 500px", willChange: "transform" }}>

          {/* ── Distant nebulae — dim color washes for galactic depth.
              Now spread across the wide -200..1200 X range so the bleed
              area gets atmospheric color, not just stars on plain dark. ── */}
          <g ref={nebulaLayerRef} style={{ transformOrigin: "500px 500px", willChange: "transform" }}>
            <ellipse cx={-50} cy={260} rx={380} ry={260} fill="url(#nebula-cool)" />
            <ellipse cx={1060} cy={760} rx={360} ry={280} fill="url(#nebula-warm)" />
            <ellipse cx={950} cy={170} rx={320} ry={220} fill="url(#nebula-amber)" />
            <ellipse cx={-40} cy={830} rx={340} ry={240} fill="url(#nebula-warm)" />
            <ellipse cx={500} cy={500} rx={500} ry={460} fill="url(#nebula-violet)" />
            {/* Outer-bleed nebulae — softly fill the new horizontal margins */}
            <ellipse cx={-180} cy={520} rx={260} ry={420} fill="url(#nebula-amber)" />
            <ellipse cx={1180} cy={480} rx={260} ry={420} fill="url(#nebula-cool)" />
          </g>

          {/* ── Distant starfield — pre-rasterized to a canvas image.
              ~520 circles → 1 <image> element. Transform applied to
              parent <g> in the rAF loop just like before. ── */}
          <g ref={starsFarRef} style={{ transformOrigin: "500px 500px", willChange: "transform" }}>
            {bgUrls?.starsFar && (
              <image x={-200} y={0} width={1400} height={1000} href={bgUrls.starsFar} preserveAspectRatio="none" />
            )}
          </g>

          {/* ── Mid starfield (canvas image) ── */}
          <g ref={starsMidRef} style={{ transformOrigin: "500px 500px", willChange: "transform" }}>
            {bgUrls?.starsMid && (
              <image x={-200} y={0} width={1400} height={1000} href={bgUrls.starsMid} preserveAspectRatio="none" />
            )}
          </g>

          {/* ── Foreground starfield (canvas image) ── */}
          <g ref={starsNearRef} style={{ transformOrigin: "500px 500px", willChange: "transform" }}>
            {bgUrls?.starsNear && (
              <image x={-200} y={0} width={1400} height={1000} href={bgUrls.starsNear} preserveAspectRatio="none" />
            )}
          </g>

          {/* ── Orbital rings — galactic structure, dim ── */}
          {[R1, R2, R3, R4, R5, 155, 260, 350, 430, 180, 295, 370].map((r, i) => (
            <circle key={`ring-${i}`} cx={CX} cy={CY} r={r} fill="none" stroke={INK}
              strokeWidth={i < 5 ? 0.5 : 0.18} opacity={i < 5 ? 0.10 : 0.035}
              strokeDasharray={i >= 5 ? "1,3" : "none"} />
          ))}

          {/* ── Radial grid (canvas image — was 72 SVG lines) ── */}
          {bgUrls?.radialGrid && (
            <image x={-200} y={0} width={1400} height={1000} href={bgUrls.radialGrid} preserveAspectRatio="none" />
          )}

          {/* ── Web lines (canvas image — was ~250 SVG lines) ── */}
          {bgUrls?.webLines && (
            <image x={-200} y={0} width={1400} height={1000} href={bgUrls.webLines} preserveAspectRatio="none" />
          )}

          {/* ── Particle field (canvas image — was ~750 SVG circles) ── */}
          {bgUrls?.particles && (
            <image x={-200} y={0} width={1400} height={1000} href={bgUrls.particles} preserveAspectRatio="none" />
          )}

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

          {/* ── Tool nodes (R3) — CareerGalaxy 3-layer iris pattern ── */}
          {TOOLS.map((tool, i) => {
            const pos = polar(CX, CY, R3, tool.angle);
            const n = ((tool.angle % 360) + 360) % 360;
            const anchor = n > 90 && n < 270 ? "end" as const : "start" as const;
            const labelPos = polar(CX, CY, R3 + 14 + tool.r, tool.angle);
            return (
              <g key={`tool-${i}`}>
                <circle cx={pos.x} cy={pos.y} r={tool.r * 2.2} fill={tool.color} opacity={0.08} />
                <circle cx={pos.x} cy={pos.y} r={tool.r} fill={tool.color} opacity={0.85} />
                <circle cx={pos.x} cy={pos.y} r={tool.r * 0.3} fill="#FFFFFF" opacity={0.5} />
                <text x={labelPos.x} y={labelPos.y} textAnchor={anchor} fill={INK}
                  fontSize={7.5} fontWeight={500} opacity={0.5} dominantBaseline="middle"
                  letterSpacing="0.04em">
                  {tool.label}
                </text>
              </g>
            );
          })}

          {/* ── Skill planets (R2) — CareerGalaxy 3-layer iris pattern ── */}
          {SKILLS.map((skill, i) => {
            const pos = polar(CX, CY, R2, skill.angle);
            // Importance 14..24 → planet radius 9..16
            const r = 9 + ((skill.importance - 14) / 10) * 7;
            const n = ((skill.angle % 360) + 360) % 360;
            const anchor = n > 90 && n < 270 ? "end" as const : "start" as const;
            const labelPos = polar(CX, CY, R2 + r + 12, skill.angle);
            return (
              <g key={`skill-${i}`}>
                <circle cx={pos.x} cy={pos.y} r={r * 2.2} fill={skill.color} opacity={0.08} />
                <circle cx={pos.x} cy={pos.y} r={r} fill={skill.color} opacity={0.85} />
                <circle cx={pos.x} cy={pos.y} r={r * 0.3} fill="#FFFFFF" opacity={0.5} />
                <text x={labelPos.x} y={labelPos.y} textAnchor={anchor} fill={INK}
                  fontSize={9} fontWeight={600} opacity={0.8} dominantBaseline="middle"
                  letterSpacing="0.04em">
                  {skill.label}
                </text>
              </g>
            );
          })}

          {/* ── Discipline planets (R1) — 2-layer (no inner core; centered text takes that role) ── */}
          {DISCIPLINES.map((disc, i) => {
            const pos = polar(CX, CY, R1, disc.angle);
            return (
              <g key={`disc-${i}`}>
                {/* Outer halo at 2.2x — matches CareerGalaxy density */}
                <circle cx={pos.x} cy={pos.y} r={38 * 2.2} fill={disc.color} opacity={0.08} />
                {/* Body — semi-transparent so it doesn't read as fully filled */}
                <circle cx={pos.x} cy={pos.y} r={38} fill={disc.color} opacity={0.85} />
                <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="central"
                  fill="#FFFFFF" fontSize={9} fontWeight={700} opacity={0.95} letterSpacing="0.08em"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.65)" }}>
                  {disc.label.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* ── Center: RHS — semi-transparent body, centered text in place of inner core ── */}
          <circle cx={CX} cy={CY} r={68} fill="url(#sun-corona)" opacity={0.4} />
          <circle cx={CX} cy={CY} r={36} fill="#E89B3F" opacity={0.85} />
          <text x={CX} y={CY + 3} textAnchor="middle" fill="#5A2F0F" fontSize={10}
            fontWeight={700} opacity={0.8} letterSpacing="0.18em">
            RHS
          </text>

          </g>

          {/* ── Edge fades — blend atmospheric content into the dark card.
              Painted on top of the parallax wrapper but below the legend
              so the labels stay crisp. ── */}
          <rect x={-200} y={760} width={1400} height={240} fill="url(#bottom-fade)" pointerEvents="none" />
          <rect x={-200} y={0} width={1400} height={140} fill="url(#top-fade)" pointerEvents="none" />

          {/* ── Legend (anchored — sits outside the parallax wrapper) ── */}
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
