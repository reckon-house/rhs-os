"use client";

import { useEffect, useRef } from "react";

/**
 * Dense data-cartography background texture.
 * Inspired by information-design posters (Accurat, Density Design) —
 * radial charts, cascading vertical drop-lines, area charts,
 * ring diagrams, dense annotation labels, timeline axes.
 * All rendered at very low opacity like faded old data maps.
 * Drifts subtly on scroll via parallax transform.
 */

const W = 1400;
const H = 7000;
const PARALLAX_FACTOR = 0.08; // how much the bg lags behind scroll (0 = static, 1 = moves with content)

/** Deterministic pseudo-random */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const OP = 0.35; // master opacity — dial everything from this

// ─── HELPERS ───────────────────────────────────────────────

function wavePath(
  x0: number,
  y0: number,
  w: number,
  seed: number,
  amp: number,
  freq: number,
): string {
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 2) {
    const n = x / w;
    const y =
      y0 +
      Math.sin(n * Math.PI * freq + seed) * amp +
      Math.sin(n * Math.PI * freq * 2.3 + seed * 1.4) * amp * 0.4 +
      Math.cos(n * Math.PI * freq * 0.7 + seed * 0.8) * amp * 0.25;
    pts.push(`${(x0 + x).toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

function areaPath(
  x0: number,
  baseline: number,
  w: number,
  seed: number,
  amp: number,
  freq: number,
): string {
  const top: string[] = [];
  for (let x = 0; x <= w; x += 2) {
    const n = x / w;
    // bell-envelope so edges taper
    const env = Math.sin(n * Math.PI) ** 0.6;
    const y =
      baseline -
      env *
        (amp +
          Math.sin(n * Math.PI * freq + seed) * amp * 0.5 +
          Math.cos(n * Math.PI * freq * 1.7 + seed * 0.9) * amp * 0.3);
    top.push(`${(x0 + x).toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${x0},${baseline} L${top.join(" L")} L${x0 + w},${baseline} Z`;
}

// ─── COMPONENT ─────────────────────────────────────────────

export function BackgroundTexture() {
  // Create rand inside component so SSR and client produce identical sequences
  const rand = seededRandom(42);

  const els: React.ReactElement[] = [];
  let k = 0;

  // ── 1. Radial / ring diagrams (like the Auditel & Piemonte circles) ──
  const radials = [
    { cx: 1180, cy: 420, r: 110, rings: 6, spokes: 24, dotRings: 3 },
    { cx: 180, cy: 1650, r: 90, rings: 5, spokes: 18, dotRings: 2 },
    { cx: 1250, cy: 2900, r: 100, rings: 5, spokes: 20, dotRings: 3 },
    { cx: 220, cy: 4200, r: 85, rings: 4, spokes: 16, dotRings: 2 },
    { cx: 1150, cy: 5400, r: 95, rings: 5, spokes: 22, dotRings: 3 },
  ];

  for (const rd of radials) {
    const g: React.ReactElement[] = [];
    // Concentric rings
    for (let i = 1; i <= rd.rings; i++) {
      g.push(
        <circle
          key={`r${i}`}
          cx={rd.cx}
          cy={rd.cy}
          r={(rd.r / rd.rings) * i}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.35"
          opacity={OP * 0.55}
        />,
      );
    }
    // Spoke lines
    for (let s = 0; s < rd.spokes; s++) {
      const a = (Math.PI * 2 * s) / rd.spokes;
      g.push(
        <line
          key={`s${s}`}
          x1={rd.cx}
          y1={rd.cy}
          x2={rd.cx + Math.cos(a) * rd.r}
          y2={rd.cy + Math.sin(a) * rd.r}
          stroke="currentColor"
          strokeWidth="0.2"
          opacity={OP * 0.3}
        />,
      );
    }
    // Data dots along rings
    for (let dr = 0; dr < rd.dotRings; dr++) {
      const ringR = rd.r * (0.5 + dr * 0.22);
      for (let s = 0; s < rd.spokes; s++) {
        if (rand() > 0.55) continue;
        const a = (Math.PI * 2 * s) / rd.spokes;
        const dotR = 1 + rand() * 3;
        g.push(
          <circle
            key={`d${dr}-${s}`}
            cx={rd.cx + Math.cos(a) * ringR}
            cy={rd.cy + Math.sin(a) * ringR}
            r={dotR}
            fill="currentColor"
            opacity={OP * (0.3 + rand() * 0.35)}
          />,
        );
      }
    }
    // Centre dot
    g.push(
      <circle key="c" cx={rd.cx} cy={rd.cy} r={3} fill="currentColor" opacity={OP * 0.5} />,
    );
    els.push(<g key={k++}>{g}</g>);
  }

  // ── 2. Cascading vertical drop-lines (like "value of music" / Piemonte) ──
  const cascades = [
    { x: 50, y: 200, count: 35, spacing: 12, maxH: 350 },
    { x: 700, y: 1200, count: 30, spacing: 14, maxH: 300 },
    { x: 100, y: 2500, count: 28, spacing: 13, maxH: 280 },
    { x: 650, y: 3600, count: 32, spacing: 12, maxH: 320 },
    { x: 80, y: 4800, count: 25, spacing: 14, maxH: 260 },
    { x: 750, y: 5800, count: 30, spacing: 13, maxH: 300 },
  ];

  for (const c of cascades) {
    const g: React.ReactElement[] = [];
    // Horizontal baseline
    g.push(
      <line
        key="base"
        x1={c.x}
        y1={c.y}
        x2={c.x + c.count * c.spacing}
        y2={c.y}
        stroke="currentColor"
        strokeWidth="0.3"
        opacity={OP * 0.5}
      />,
    );
    for (let i = 0; i < c.count; i++) {
      const lx = c.x + i * c.spacing;
      const h = 30 + rand() * c.maxH;
      const op = OP * (0.2 + rand() * 0.4);
      // Vertical drop
      g.push(
        <line
          key={`v${i}`}
          x1={lx}
          y1={c.y}
          x2={lx}
          y2={c.y + h}
          stroke="currentColor"
          strokeWidth="0.3"
          opacity={op}
        />,
      );
      // Small terminal dot
      if (rand() > 0.3) {
        g.push(
          <circle
            key={`dot${i}`}
            cx={lx}
            cy={c.y + h}
            r={0.8 + rand() * 1.5}
            fill="currentColor"
            opacity={op * 0.8}
          />,
        );
      }
      // Tick on baseline
      g.push(
        <line
          key={`t${i}`}
          x1={lx}
          y1={c.y - 3}
          x2={lx}
          y2={c.y + 3}
          stroke="currentColor"
          strokeWidth="0.3"
          opacity={OP * 0.4}
        />,
      );
    }
    els.push(<g key={k++}>{g}</g>);
  }

  // ── 3. Area / mountain charts (layered, like the Auditel wave centre) ──
  const areaClusters = [
    { x: 350, y: 550, w: 400, layers: 5, maxAmp: 50 },
    { x: 800, y: 1700, w: 350, layers: 4, maxAmp: 40 },
    { x: 250, y: 3200, w: 420, layers: 5, maxAmp: 55 },
    { x: 700, y: 4500, w: 380, layers: 4, maxAmp: 45 },
    { x: 300, y: 5600, w: 400, layers: 5, maxAmp: 50 },
  ];

  for (const ac of areaClusters) {
    const g: React.ReactElement[] = [];
    for (let layer = 0; layer < ac.layers; layer++) {
      const seed = layer * 3.7 + ac.x * 0.01;
      const amp = ac.maxAmp * (1 - layer * 0.15);
      g.push(
        <path
          key={`a${layer}`}
          d={areaPath(ac.x, ac.y, ac.w, seed, amp, 2 + layer * 0.4)}
          fill="currentColor"
          opacity={OP * (0.08 + layer * 0.03)}
          stroke="currentColor"
          strokeWidth="0.3"
          strokeOpacity={OP * 0.5}
        />,
      );
    }
    // Baseline
    g.push(
      <line
        key="bl"
        x1={ac.x}
        y1={ac.y}
        x2={ac.x + ac.w}
        y2={ac.y}
        stroke="currentColor"
        strokeWidth="0.3"
        opacity={OP * 0.4}
      />,
    );
    els.push(<g key={k++}>{g}</g>);
  }

  // ── 4. Multi-line wave charts (stacked line graphs — insurance trends) ──
  const lineCharts = [
    { x: 50, y: 900, w: 500, lines: 6, amp: 30, freq: 3 },
    { x: 850, y: 800, w: 450, lines: 5, amp: 25, freq: 2.5 },
    { x: 150, y: 2000, w: 550, lines: 7, amp: 35, freq: 2.8 },
    { x: 800, y: 2200, w: 400, lines: 5, amp: 28, freq: 3.2 },
    { x: 100, y: 3800, w: 500, lines: 6, amp: 32, freq: 2.6 },
    { x: 850, y: 4000, w: 450, lines: 5, amp: 26, freq: 3.0 },
    { x: 200, y: 5200, w: 480, lines: 6, amp: 30, freq: 2.4 },
    { x: 800, y: 5500, w: 420, lines: 5, amp: 24, freq: 3.4 },
  ];

  for (const lc of lineCharts) {
    const g: React.ReactElement[] = [];
    for (let i = 0; i < lc.lines; i++) {
      const seed = i * 2.1 + lc.x * 0.007;
      g.push(
        <path
          key={`l${i}`}
          d={wavePath(lc.x, lc.y + i * 8, lc.w, seed, lc.amp * (1 - i * 0.08), lc.freq)}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity={OP * (0.5 - i * 0.05)}
        />,
      );
    }
    els.push(<g key={k++}>{g}</g>);
  }

  // ── 5. Horizontal stacked bar segments (like ring road density bars) ──
  const hBars = [
    { x: 900, y: 600, w: 350, rows: 4 },
    { x: 50, y: 1400, w: 300, rows: 3 },
    { x: 950, y: 3400, w: 320, rows: 4 },
    { x: 80, y: 4600, w: 280, rows: 3 },
    { x: 900, y: 6200, w: 340, rows: 4 },
  ];

  for (const hb of hBars) {
    const g: React.ReactElement[] = [];
    for (let row = 0; row < hb.rows; row++) {
      const y = hb.y + row * 14;
      let cx = hb.x;
      const segs = 4 + Math.floor(rand() * 5);
      for (let s = 0; s < segs; s++) {
        const sw = 15 + rand() * (hb.w / segs);
        g.push(
          <rect
            key={`${row}-${s}`}
            x={cx}
            y={y}
            width={sw}
            height={8}
            fill="currentColor"
            opacity={OP * (0.1 + rand() * 0.25)}
            rx="0.5"
          />,
        );
        cx += sw + 1;
        if (cx > hb.x + hb.w) break;
      }
    }
    els.push(<g key={k++}>{g}</g>);
  }

  // ── 6. Timeline axes with tick marks and year labels ──
  const timelines = [
    { x: 400, y: 1050, w: 500, labels: ["1997", "2000", "2003", "2006", "2009", "2012", "2015", "2018", "2021", "2024"] },
    { x: 100, y: 3050, w: 450, labels: ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3", "Q4"] },
    { x: 500, y: 4900, w: 480, labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"] },
    { x: 200, y: 6600, w: 500, labels: ["2019", "2020", "2021", "2022", "2023", "2024", "2025"] },
  ];

  for (const tl of timelines) {
    const g: React.ReactElement[] = [];
    // Main axis
    g.push(
      <line
        key="ax"
        x1={tl.x}
        y1={tl.y}
        x2={tl.x + tl.w}
        y2={tl.y}
        stroke="currentColor"
        strokeWidth="0.35"
        opacity={OP * 0.5}
      />,
    );
    for (let i = 0; i < tl.labels.length; i++) {
      const lx = tl.x + (tl.w / (tl.labels.length - 1)) * i;
      g.push(
        <line
          key={`tk${i}`}
          x1={lx}
          y1={tl.y - 4}
          x2={lx}
          y2={tl.y + 4}
          stroke="currentColor"
          strokeWidth="0.3"
          opacity={OP * 0.45}
        />,
      );
      g.push(
        <text
          key={`lb${i}`}
          x={lx}
          y={tl.y + 14}
          textAnchor="middle"
          fill="currentColor"
          fontSize="6"
          opacity={OP * 0.5}
          fontFamily="var(--font-satoshi), sans-serif"
        >
          {tl.labels[i]}
        </text>,
      );
    }
    // Minor ticks between labels
    const totalTicks = (tl.labels.length - 1) * 4;
    for (let t = 0; t <= totalTicks; t++) {
      const tx = tl.x + (tl.w / totalTicks) * t;
      g.push(
        <line
          key={`mt${t}`}
          x1={tx}
          y1={tl.y - 1.5}
          x2={tx}
          y2={tl.y + 1.5}
          stroke="currentColor"
          strokeWidth="0.2"
          opacity={OP * 0.25}
        />,
      );
    }
    els.push(<g key={k++}>{g}</g>);
  }

  // ── 7. Scattered annotation labels (data-map text) ──
  const annotations = [
    { x: 80, y: 310, text: "TOTALE ASCOLTI PER FASCIA", size: 5 },
    { x: 1050, y: 350, text: "NUMERO ASCOLTI", size: 4.5 },
    { x: 600, y: 520, text: "coverage limit", size: 5 },
    { x: 920, y: 570, text: "$30,000", size: 5.5 },
    { x: 1200, y: 570, text: "$50,000", size: 5.5 },
    { x: 50, y: 870, text: "documented assets", size: 5 },
    { x: 350, y: 1030, text: "EVOLUTION OF PREMIUMS", size: 4.5 },
    { x: 680, y: 1180, text: "personal property", size: 5 },
    { x: 950, y: 1380, text: "replacement value", size: 5 },
    { x: 120, y: 1620, text: "FASCE GIORNALIERE", size: 4.5 },
    { x: 400, y: 1900, text: "depreciation rate", size: 5 },
    { x: 800, y: 2170, text: "ISO 400", size: 5 },
    { x: 1100, y: 2170, text: "f/2.8", size: 5 },
    { x: 200, y: 2480, text: "CLASSIFICATION DEPTH", size: 4.5 },
    { x: 600, y: 2750, text: "recognition accuracy", size: 5 },
    { x: 1000, y: 2870, text: "EDITORE", size: 4.5 },
    { x: 150, y: 3180, text: "claim frequency", size: 5 },
    { x: 500, y: 3570, text: "FONTE: AUDITEL", size: 4.5 },
    { x: 900, y: 3770, text: "35mm equivalent", size: 5 },
    { x: 250, y: 3950, text: "inventory total", size: 5 },
    { x: 700, y: 4170, text: "PROVINCES", size: 4.5 },
    { x: 100, y: 4570, text: "underinsured", size: 5 },
    { x: 500, y: 4870, text: "PERCENTAGE OF COVERAGE", size: 4.5 },
    { x: 900, y: 5170, text: "shutter speed", size: 5 },
    { x: 200, y: 5570, text: "TRANSPORT INFRASTRUCTURE", size: 4.5 },
    { x: 700, y: 5770, text: "policy limit", size: 5 },
    { x: 1050, y: 6070, text: "YEAR", size: 4.5 },
    { x: 300, y: 6370, text: "gap analysis", size: 5 },
    { x: 800, y: 6570, text: "DISTRICT CONSIDERED", size: 4.5 },
  ];

  for (const a of annotations) {
    els.push(
      <text
        key={k++}
        x={a.x}
        y={a.y}
        fill="currentColor"
        fontSize={a.size}
        fontFamily="var(--font-satoshi), sans-serif"
        opacity={OP * 0.45}
        letterSpacing="0.1em"
      >
        {a.text}
      </text>,
    );
  }

  // ── 8. Donut / ring chart segments (like Piemonte provinces) ──
  const donuts = [
    { cx: 350, y: 750, r: 50, segments: 8 },
    { cx: 1100, cy: 1550, r: 45, segments: 6 },
    { cx: 400, cy: 2900, r: 55, segments: 7 },
    { cx: 1050, cy: 4350, r: 48, segments: 8 },
    { cx: 350, cy: 6100, r: 50, segments: 6 },
  ];

  for (const dn of donuts) {
    const cy = dn.cy ?? dn.y ?? 0;
    const g: React.ReactElement[] = [];
    let startAngle = 0;
    for (let s = 0; s < dn.segments; s++) {
      const sweep = (Math.PI * 2) / dn.segments * (0.6 + rand() * 0.8);
      const endAngle = startAngle + sweep;
      const inner = dn.r * 0.55;
      const x1o = dn.cx + Math.cos(startAngle) * dn.r;
      const y1o = cy + Math.sin(startAngle) * dn.r;
      const x2o = dn.cx + Math.cos(endAngle) * dn.r;
      const y2o = cy + Math.sin(endAngle) * dn.r;
      const x1i = dn.cx + Math.cos(endAngle) * inner;
      const y1i = cy + Math.sin(endAngle) * inner;
      const x2i = dn.cx + Math.cos(startAngle) * inner;
      const y2i = cy + Math.sin(startAngle) * inner;
      const large = sweep > Math.PI ? 1 : 0;
      g.push(
        <path
          key={`seg${s}`}
          d={`M${x1o},${y1o} A${dn.r},${dn.r} 0 ${large} 1 ${x2o},${y2o} L${x1i},${y1i} A${inner},${inner} 0 ${large} 0 ${x2i},${y2i} Z`}
          fill="currentColor"
          opacity={OP * (0.06 + rand() * 0.12)}
          stroke="currentColor"
          strokeWidth="0.2"
          strokeOpacity={OP * 0.3}
        />,
      );
      startAngle = endAngle + 0.05; // tiny gap between segments
    }
    els.push(<g key={k++}>{g}</g>);
  }

  // ── 9. Scattered sized dots (like the Auditel bubble sizes) ──
  const dotFields = [
    { x: 600, y: 300, w: 350, h: 180, count: 20 },
    { x: 50, y: 1100, w: 300, h: 150, count: 15 },
    { x: 700, y: 2500, w: 350, h: 200, count: 22 },
    { x: 100, y: 3500, w: 280, h: 160, count: 16 },
    { x: 650, y: 4700, w: 320, h: 170, count: 18 },
    { x: 150, y: 5900, w: 300, h: 150, count: 15 },
  ];

  for (const df of dotFields) {
    const g: React.ReactElement[] = [];
    for (let d = 0; d < df.count; d++) {
      const dx = df.x + rand() * df.w;
      const dy = df.y + rand() * df.h;
      const r = 1 + rand() * 6;
      g.push(
        <circle
          key={d}
          cx={dx}
          cy={dy}
          r={r}
          fill="currentColor"
          opacity={OP * (0.08 + rand() * 0.2)}
        />,
      );
    }
    els.push(<g key={k++}>{g}</g>);
  }

  // ── 10. Vertical dashed grid lines spanning large sections ──
  const vertGrids = [
    { x: 200, y1: 100, y2: 800 },
    { x: 450, y1: 100, y2: 800 },
    { x: 700, y1: 100, y2: 800 },
    { x: 950, y1: 100, y2: 800 },
    { x: 1200, y1: 100, y2: 800 },
    { x: 250, y1: 1200, y2: 1900 },
    { x: 500, y1: 1200, y2: 1900 },
    { x: 750, y1: 1200, y2: 1900 },
    { x: 1000, y1: 1200, y2: 1900 },
    { x: 300, y1: 3400, y2: 4100 },
    { x: 550, y1: 3400, y2: 4100 },
    { x: 800, y1: 3400, y2: 4100 },
    { x: 1050, y1: 3400, y2: 4100 },
    { x: 200, y1: 5600, y2: 6300 },
    { x: 450, y1: 5600, y2: 6300 },
    { x: 700, y1: 5600, y2: 6300 },
    { x: 950, y1: 5600, y2: 6300 },
  ];

  for (const vg of vertGrids) {
    els.push(
      <line
        key={k++}
        x1={vg.x}
        y1={vg.y1}
        x2={vg.x}
        y2={vg.y2}
        stroke="currentColor"
        strokeWidth="0.2"
        strokeDasharray="4 8"
        opacity={OP * 0.2}
      />,
    );
  }

  // ── 11. Small number scales along edges ──
  const scales = [
    { x: 1320, y: 200, values: ["10", "8", "6", "4", "2", "0"], spacing: 20 },
    { x: 30, y: 900, values: ["$50k", "$40k", "$30k", "$20k", "$10k", "$0"], spacing: 18 },
    { x: 1330, y: 2200, values: ["100%", "80%", "60%", "40%", "20%", "0%"], spacing: 18 },
    { x: 40, y: 3400, values: ["1.0", "0.8", "0.6", "0.4", "0.2", "0.0"], spacing: 16 },
    { x: 1320, y: 4600, values: ["500", "400", "300", "200", "100", "0"], spacing: 18 },
    { x: 35, y: 5800, values: ["$80k", "$60k", "$40k", "$20k", "$0"], spacing: 20 },
  ];

  for (const sc of scales) {
    const g: React.ReactElement[] = [];
    for (let i = 0; i < sc.values.length; i++) {
      const y = sc.y + i * sc.spacing;
      g.push(
        <text
          key={`t${i}`}
          x={sc.x}
          y={y}
          fill="currentColor"
          fontSize="5"
          fontFamily="var(--font-satoshi), sans-serif"
          opacity={OP * 0.4}
          textAnchor={sc.x > 700 ? "end" : "start"}
        >
          {sc.values[i]}
        </text>,
      );
      // Small tick
      g.push(
        <line
          key={`tk${i}`}
          x1={sc.x > 700 ? sc.x + 3 : sc.x - 3}
          y1={y - 2}
          x2={sc.x > 700 ? sc.x + 8 : sc.x - 8}
          y2={y - 2}
          stroke="currentColor"
          strokeWidth="0.25"
          opacity={OP * 0.35}
        />,
      );
    }
    els.push(<g key={k++}>{g}</g>);
  }

  // ── 12. Connecting lines / network edges ──
  const connections = [
    { points: [[300,400],[450,380],[550,420],[700,390],[850,430]] },
    { points: [[200,1500],[350,1520],[500,1480],[650,1530],[800,1490]] },
    { points: [[400,3000],[520,3030],[640,2980],[760,3020],[880,2990]] },
    { points: [[150,4400],[300,4380],[450,4420],[600,4390],[750,4430]] },
    { points: [[350,5700],[480,5720],[610,5690],[740,5730],[870,5700]] },
  ];

  for (const cn of connections) {
    const pts = cn.points as number[][];
    const d = `M${pts.map(p => `${p[0]},${p[1]}`).join(" L")}`;
    els.push(
      <path
        key={k++}
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity={OP * 0.3}
        strokeDasharray="2 4"
      />,
    );
    // Nodes
    for (const p of pts) {
      els.push(
        <circle
          key={k++}
          cx={p[0]}
          cy={p[1]}
          r={2}
          fill="currentColor"
          opacity={OP * 0.35}
        />,
      );
    }
  }

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.parentElement?.getBoundingClientRect();
        if (rect) {
          // How far the article top has scrolled past the viewport top
          const scrolled = -rect.top;
          const yShift = scrolled * PARALLAX_FACTOR;
          el.style.transform = `translateY(${yShift}px)`;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial position
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none text-foreground will-change-transform"
      aria-hidden="true"
      suppressHydrationWarning
    >
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
        suppressHydrationWarning
      >
        {els}
      </svg>
    </div>
  );
}
