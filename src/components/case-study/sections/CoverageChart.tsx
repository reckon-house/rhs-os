"use client";

import { useMemo } from "react";
import type { CoverageChartSection } from "@/lib/types";

/* ── Deterministic RNG ── */
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Layout ── */
const W = 1000;
const ML = 80;
const MR = 30;
const CW = W - ML - MR;
const TOTAL_H = 500;

// Vertical zones
const SUMMARY_Y = 10;
const SUMMARY_H = 70;
const ACCUM_Y = 100;
const ACCUM_H = 120;
const BAR_Y = 240;
const BAR_H = 44;
const BAR_GAP = 16;
const CATEGORY_Y = 360;
const CATEGORY_H = 130;

/* ── Category data — palette sourced from interior photography ── */
const CATEGORIES = [
  { name: "Furniture", value: 12580, color: "#BF9A4E", pct: 0.253 },    // honey oak
  { name: "Electronics", value: 8320, color: "#4A5D3E", pct: 0.168 },   // sage cabinet
  { name: "Artwork", value: 7540, color: "#B8923A", pct: 0.152 },       // brass hardware
  { name: "Appliances", value: 6890, color: "#9B9288", pct: 0.139 },    // marble grey
  { name: "Fixtures", value: 4960, color: "#5E7050", pct: 0.100 },      // cabinet shadow
  { name: "Textiles", value: 3420, color: "#7B4E2D", pct: 0.069 },      // leather brown
  { name: "Collectibles", value: 3280, color: "#6B8060", pct: 0.066 },  // muted green
  { name: "Other", value: 2640, color: "#3D2B1F", pct: 0.053 },         // walnut floor
];

/* ── Wave path ── */
function wavePath(x0: number, width: number, y: number, seed: number, amp: number): string {
  const pts: string[] = [];
  for (let x = 0; x <= width; x += 3) {
    const nx = x / width;
    const w = Math.sin(nx * Math.PI * 2.5 + seed) * amp +
      Math.sin(nx * Math.PI * 5.2 + seed * 1.7) * amp * 0.5 +
      Math.cos(nx * Math.PI * 1.4 + seed * 0.6) * amp * 0.65;
    pts.push(`${(x0 + x).toFixed(1)},${(y + w).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

export function CoverageChart({
  assetValue,
  assetAmount,
  policyLimit,
  policyAmount,
}: CoverageChartSection) {
  const gap = assetAmount - policyAmount;
  const fmt = (n: number) => "$" + n.toLocaleString("en-US");
  const policyPct = policyAmount / assetAmount;

  const rng = useMemo(() => makeRng(42), []);

  // Summary stats
  const summaryStats = [
    { value: fmt(assetAmount), label: "Documented value", sub: "Total assets" },
    { value: fmt(policyAmount), label: "Policy limit", sub: "Current coverage" },
    { value: fmt(gap), label: "Coverage gap", sub: "Underinsured by", highlight: true },
    { value: `${((gap / assetAmount) * 100).toFixed(0)}%`, label: "Gap ratio", sub: "Of total value" },
  ];

  // Accumulation curve data — simulates documenting items over time
  const accumData = useMemo(() => {
    const localRng = makeRng(77);
    const points = 50;
    const assetCurve: number[] = [];
    const policyCurve: number[] = [];
    let running = 0;
    for (let i = 0; i <= points; i++) {
      const t = i / points;
      // S-curve accumulation
      const s = 1 / (1 + Math.exp(-10 * (t - 0.4)));
      running = s * assetAmount + (localRng() - 0.5) * 800;
      assetCurve.push(Math.max(0, running));
      policyCurve.push(policyAmount); // flat line
    }
    return { assetCurve, policyCurve, points };
  }, [assetAmount, policyAmount]);

  // Item scatter dots — each represents a documented item
  const itemDots = useMemo(() => {
    const localRng = makeRng(55);
    const dots: { x: number; y: number; r: number; color: string; value: number }[] = [];
    for (let i = 0; i < 73; i++) {
      const cat = CATEGORIES[Math.floor(localRng() * CATEGORIES.length)];
      const itemVal = cat.value / (3 + localRng() * 8);
      dots.push({
        x: ML + localRng() * CW,
        y: ACCUM_Y + 10 + localRng() * (ACCUM_H - 20),
        r: 1.5 + (itemVal / 3000) * 4,
        color: cat.color,
        value: itemVal,
      });
    }
    return dots;
  }, []);

  // Category breakdown — horizontal stacked segments with gap between
  const SEG_GAP = 3;
  const categorySegments = useMemo(() => {
    const totalGaps = (CATEGORIES.length - 1) * SEG_GAP;
    const usableW = CW - totalGaps;
    let xOffset = ML;
    return CATEGORIES.map((cat, i) => {
      const w = cat.pct * usableW;
      const seg = { ...cat, x: xOffset, w };
      xOffset += w + SEG_GAP;
      return seg;
    });
  }, []);

  // Policy coverage per category — coverage is uneven (some categories better covered)
  const policyCoverage = useMemo(() => {
    const localRng = makeRng(99);
    // Coverage ratios per category (insurance covers some things better than others)
    return CATEGORIES.map((cat) => {
      // Base coverage ratio from overall policy, with per-category variation
      const base = policyPct;
      const variation = 0.6 + localRng() * 0.8; // 60%-140% of base
      return Math.min(1, base * variation);
    });
  }, [policyPct]);

  // Category scatter — dense dot field per category, spread across full width
  const categoryDots = useMemo(() => {
    const localRng = makeRng(123);
    const dots: { x: number; y: number; r: number; color: string; opacity: number }[] = [];
    const rowH = CATEGORY_H / CATEGORIES.length;
    CATEGORIES.forEach((cat, ci) => {
      const count = Math.floor(cat.pct * 200) + 12;
      const baseY = CATEGORY_Y + ci * rowH;
      for (let i = 0; i < count; i++) {
        // Dots spread across full width, denser on the left proportional to category weight
        const r = localRng();
        // Weighted distribution: more dots left-biased but spanning full CW
        const x = ML + (r < cat.pct ? localRng() * CW * 0.6 : CW * 0.3 + localRng() * CW * 0.7);
        dots.push({
          x,
          y: baseY + 4 + localRng() * (rowH - 8),
          r: 1 + localRng() * 3,
          color: cat.color,
          opacity: 0.15 + localRng() * 0.25,
        });
      }
    });
    return dots;
  }, []);

  // Contour streams for category rows
  const categoryStreams = useMemo(() => {
    const rowH = CATEGORY_H / CATEGORIES.length;
    return CATEGORIES.map((cat, ci) => {
      const baseY = CATEGORY_Y + ci * rowH + rowH / 2;
      return { cat, baseY, rowH };
    });
  }, []);

  // Grid ticks
  const valueTicks = useMemo(() => {
    const ticks: { x: number; label: string }[] = [];
    for (let v = 0; v <= 50000; v += 10000) {
      ticks.push({
        x: ML + (v / assetAmount) * CW,
        label: `$${(v / 1000).toFixed(0)}k`,
      });
    }
    return ticks;
  }, [assetAmount]);

  return (
    <section className="w-full py-8">
      <div>
        <div className="overflow-x-auto md:overflow-visible -mx-4 md:mx-0">
          <div className="min-w-[800px] md:min-w-0 px-4 md:px-0">
        <svg
          viewBox={`0 0 ${W} ${TOTAL_H}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="cov-gap-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B22234" stopOpacity={0.04} />
              <stop offset="100%" stopColor="#B22234" stopOpacity={0.01} />
            </linearGradient>
            <clipPath id="accum-clip">
              <rect x={ML} y={ACCUM_Y} width={CW} height={ACCUM_H} />
            </clipPath>
          </defs>

          {/* ═══ LAYER 0: Summary stats row ═══ */}
          {summaryStats.map((stat, i) => {
            const x = ML + (i / summaryStats.length) * CW;
            const colW = CW / summaryStats.length;
            return (
              <g key={`sum-${i}`}>
                <text x={x} y={SUMMARY_Y + 24}
                  fill={stat.highlight ? "#B22234" : "#141414"}
                  fontSize={28} fontWeight={700} letterSpacing={-0.5}
                  style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
                  {stat.value}
                </text>
                <text x={x} y={SUMMARY_Y + 40}
                  fill={stat.highlight ? "#B22234" : "#141414"}
                  fontSize={9} fontWeight={600} letterSpacing={0.8}
                  opacity={stat.highlight ? 0.8 : 0.55}>
                  {stat.label}
                </text>
                <text x={x} y={SUMMARY_Y + 53}
                  fill="#141414" fontSize={8} opacity={0.4}>
                  {stat.sub}
                </text>
                {i < summaryStats.length - 1 && (
                  <line x1={x + colW - 10} y1={SUMMARY_Y + 5}
                    x2={x + colW - 10} y2={SUMMARY_Y + 50}
                    stroke="#141414" strokeWidth={0.3} opacity={0.04} />
                )}
              </g>
            );
          })}

          {/* ═══ Divider ═══ */}
          <line x1={ML} y1={ACCUM_Y - 10} x2={ML + CW} y2={ACCUM_Y - 10}
            stroke="#141414" strokeWidth={0.3} opacity={0.06} />

          {/* ═══ LAYER 1: Value accumulation over time ═══ */}
          <text x={ML - 2} y={ACCUM_Y + 8} fill="#141414" fontSize={9}
            opacity={0.55} letterSpacing={0.5} textAnchor="end"
            style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
            Value
          </text>

          {/* Grid lines in accumulation zone */}
          {valueTicks.map((t, i) => (
            <line key={`ag-${i}`}
              x1={t.x} y1={ACCUM_Y} x2={t.x} y2={ACCUM_Y + ACCUM_H}
              stroke="#141414" strokeWidth={0.3} opacity={0.03} />
          ))}

          {/* Policy limit flat line */}
          <line x1={ML} y1={ACCUM_Y + ACCUM_H * (1 - policyPct)}
            x2={ML + CW} y2={ACCUM_Y + ACCUM_H * (1 - policyPct)}
            stroke="#B22234" strokeWidth={0.6} opacity={0.15}
            strokeDasharray="4,4" />
          <text x={ML + CW + 4} y={ACCUM_Y + ACCUM_H * (1 - policyPct) + 3}
            fill="#B22234" fontSize={8} opacity={0.55}
            style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
            Policy limit
          </text>

          {/* Asset accumulation area */}
          <g clipPath="url(#accum-clip)">
            {/* Fill area */}
            <polygon
              points={[
                `${ML},${ACCUM_Y + ACCUM_H}`,
                ...accumData.assetCurve.map((v, i) => {
                  const x = ML + (i / accumData.points) * CW;
                  const y = ACCUM_Y + ACCUM_H - (v / assetAmount) * ACCUM_H * 0.95;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }),
                `${ML + CW},${ACCUM_Y + ACCUM_H}`,
              ].join(" ")}
              fill="#BF9A4E" opacity={0.1}
            />
            {/* Line */}
            <polyline
              points={accumData.assetCurve.map((v, i) => {
                const x = ML + (i / accumData.points) * CW;
                const y = ACCUM_Y + ACCUM_H - (v / assetAmount) * ACCUM_H * 0.95;
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              }).join(" ")}
              fill="none" stroke="#BF9A4E" strokeWidth={1.2} opacity={0.4}
            />

            {/* Gap fill area — between asset curve and policy line */}
            <polygon
              points={[
                ...accumData.assetCurve.map((v, i) => {
                  const x = ML + (i / accumData.points) * CW;
                  const y = ACCUM_Y + ACCUM_H - (v / assetAmount) * ACCUM_H * 0.95;
                  const policyY = ACCUM_Y + ACCUM_H * (1 - policyPct);
                  return v > policyAmount ? `${x.toFixed(1)},${Math.min(y, policyY).toFixed(1)}` : null;
                }).filter(Boolean).join(" "),
                `${ML + CW},${ACCUM_Y + ACCUM_H * (1 - policyPct)}`,
              ].join(" ")}
              fill="#B22234" opacity={0.04}
            />

            {/* Item scatter dots */}
            {itemDots.map((d, i) => (
              <circle key={`id-${i}`}
                cx={d.x} cy={d.y} r={d.r}
                fill={d.color}
               
                style={{ "--base-op": 0.12 + (d.r / 6) * 0.15, "--dur": `${3 + (i % 9) * 0.8}s`, "--del": `${(i % 11) * 0.5}s` } as React.CSSProperties} />
            ))}
          </g>

          {/* Accumulation scale labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <text key={`as-${i}`}
              x={ML - 2} y={ACCUM_Y + ACCUM_H - pct * ACCUM_H + 3}
              fill="#141414" fontSize={8} opacity={0.4}
              textAnchor="end">
              {`$${((pct * assetAmount) / 1000).toFixed(0)}k`}
            </text>
          ))}

          {/* ═══ Divider ═══ */}
          <line x1={ML} y1={BAR_Y - 15} x2={ML + CW} y2={BAR_Y - 15}
            stroke="#141414" strokeWidth={0.3} opacity={0.06} />

          {/* ═══ LAYER 2: Comparison bars ═══ */}
          <text x={ML - 2} y={BAR_Y + 8} fill="#141414" fontSize={9}
            opacity={0.55} letterSpacing={0.5} textAnchor="end"
            style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
            Assets
          </text>
          <text x={ML - 2} y={BAR_Y + BAR_H + BAR_GAP + 8} fill="#141414" fontSize={9}
            opacity={0.55} letterSpacing={0.5} textAnchor="end"
            style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
            Policy
          </text>

          {/* Category column headers */}
          {categorySegments.map((seg, i) => (
            <text key={`ch-${i}`}
              x={seg.x + seg.w / 2} y={BAR_Y - 14}
              fill="#141414" fontSize={8} opacity={0.5}
              textAnchor="middle"
              style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
              {seg.name}
            </text>
          ))}

          {/* Column grid lines through both bars */}
          {categorySegments.map((seg, i) => (
            i > 0 && (
              <line key={`cg-${i}`}
                x1={seg.x - SEG_GAP / 2} y1={BAR_Y - 10}
                x2={seg.x - SEG_GAP / 2} y2={BAR_Y + BAR_H * 2 + BAR_GAP + 4}
                stroke="#141414" strokeWidth={0.3} opacity={0.04} />
            )
          ))}

          {/* Asset bar — segmented by category */}
          {categorySegments.map((seg, i) => (
            <g key={`ab-${i}`}>
              <rect x={seg.x} y={BAR_Y} width={seg.w} height={BAR_H}
                rx={3} fill={seg.color} opacity={0.7} />
              {/* Wave texture inside each segment */}
              <clipPath id={`ac-${i}`}>
                <rect x={seg.x} y={BAR_Y} width={seg.w} height={BAR_H} rx={3} />
              </clipPath>
              <g clipPath={`url(#ac-${i})`}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <path key={`aw-${i}-${j}`}
                    d={wavePath(seg.x, seg.w, BAR_Y + (BAR_H / 7) * (j + 1), 3.7 + i * 1.3 + j * 0.5, 2)}
                    fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                ))}
              </g>
              {/* Value label — only on segments wide enough */}
              {seg.w > 50 && (
                <text x={seg.x + seg.w / 2} y={BAR_Y + BAR_H / 2 + 1}
                  fill="#141414" fontSize={8} fontWeight={600}
                  dominantBaseline="middle" textAnchor="middle" opacity={0.7}
                  style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
                  {`$${(seg.value / 1000).toFixed(1)}k`}
                </text>
              )}
            </g>
          ))}
          {/* Asset total label */}
          <text x={ML + CW + 6} y={BAR_Y + BAR_H / 2 + 1}
            fill="#141414" fontSize={8} fontWeight={600}
            dominantBaseline="middle" opacity={0.45}>
            {fmt(assetAmount)}
          </text>

          {/* Policy bar — segmented by category, scaled by coverage ratio */}
          {categorySegments.map((seg, i) => {
            const covRatio = policyCoverage[i];
            const covW = seg.w * covRatio;
            return (
              <g key={`pb-${i}`}>
                {/* Background — full width, very faint to show "gap" */}
                <rect x={seg.x} y={BAR_Y + BAR_H + BAR_GAP}
                  width={seg.w} height={BAR_H}
                  rx={3} fill="#141414" opacity={0.02} />
                {/* Covered portion */}
                <rect x={seg.x} y={BAR_Y + BAR_H + BAR_GAP}
                  width={covW} height={BAR_H}
                  rx={3} fill="#9B9288" opacity={0.55} />
                <clipPath id={`pc-${i}`}>
                  <rect x={seg.x} y={BAR_Y + BAR_H + BAR_GAP}
                    width={covW} height={BAR_H} rx={3} />
                </clipPath>
                <g clipPath={`url(#pc-${i})`}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <path key={`pw-${i}-${j}`}
                      d={wavePath(seg.x, covW, BAR_Y + BAR_H + BAR_GAP + (BAR_H / 7) * (j + 1), 7.1 + i * 1.1 + j * 0.5, 1.5)}
                      fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                  ))}
                </g>
                {/* Gap zone — uncovered portion gets subtle red tint */}
                {covRatio < 0.98 && (
                  <rect x={seg.x + covW} y={BAR_Y + BAR_H + BAR_GAP}
                    width={seg.w - covW} height={BAR_H}
                    rx={3} fill="#B22234" />
                )}
                {/* Coverage % label — only on wide segments */}
                {seg.w > 50 && (
                  <text x={seg.x + seg.w / 2} y={BAR_Y + BAR_H + BAR_GAP + BAR_H / 2 + 1}
                    fill="#141414" fontSize={7} fontWeight={500}
                    dominantBaseline="middle" textAnchor="middle" opacity={0.6}
                    style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
                    {`${(covRatio * 100).toFixed(0)}%`}
                  </text>
                )}
              </g>
            );
          })}
          {/* Policy total label */}
          <text x={ML + CW + 6} y={BAR_Y + BAR_H + BAR_GAP + BAR_H / 2 + 1}
            fill="#141414" fontSize={8} fontWeight={600}
            dominantBaseline="middle" opacity={0.45}>
            {fmt(policyAmount)}
          </text>

          {/* ═══ Divider ═══ */}
          <line x1={ML} y1={CATEGORY_Y - 15} x2={ML + CW} y2={CATEGORY_Y - 15}
            stroke="#141414" strokeWidth={0.3} opacity={0.06} />

          {/* ═══ LAYER 3: Category breakdown ═══ */}
          <text x={ML - 2} y={CATEGORY_Y + 8} fill="#141414" fontSize={9}
            opacity={0.55} letterSpacing={0.5} textAnchor="end"
            style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
            By type
          </text>

          {/* Category dots */}
          {categoryDots.map((d, i) => (
            <circle key={`cd-${i}`}
              cx={d.x} cy={d.y} r={d.r}
              fill={d.color}
             
              style={{ "--base-op": d.opacity, "--dur": `${3.5 + (i % 8) * 0.7}s`, "--del": `${(i % 13) * 0.4}s` } as React.CSSProperties} />
          ))}

          {/* Category stream lines */}
          {categoryStreams.map((s, i) => (
            <g key={`cs-${i}`}>
              <path
                d={wavePath(ML, CW, s.baseY, 2 + i * 1.3, 1.5)}
                fill="none" stroke={s.cat.color} strokeWidth={0.6}
               
                style={{ "--dur": `${4 + i * 0.6}s`, "--del": `${i * 0.4}s` } as React.CSSProperties} />
              {/* Row dividers */}
              <line x1={ML} y1={CATEGORY_Y + (i + 1) * s.rowH}
                x2={ML + CW} y2={CATEGORY_Y + (i + 1) * s.rowH}
                stroke="#141414" strokeWidth={0.2} opacity={0.04} />
              {/* Label */}
              <text x={ML + CW + 6} y={s.baseY + 2}
                fill="#141414" fontSize={8} opacity={0.55}
                style={{ fontFamily: "var(--font-satoshi), sans-serif" }}>
                {s.cat.name}
              </text>
              <text x={ML + CW + 6} y={s.baseY + 12}
                fill="#141414" fontSize={7} opacity={0.35}>
                {fmt(s.cat.value)}
              </text>
            </g>
          ))}


          {/* ═══ Horizontal dividers between all layers ═══ */}
          {[ACCUM_Y - 2, BAR_Y - 2, CATEGORY_Y - 2].map((y, i) => (
            <line key={`div-${i}`}
              x1={ML} y1={y} x2={ML + CW} y2={y}
              stroke="#141414" strokeWidth={0.2} opacity={0.03} />
          ))}
        </svg>
          </div>
          <p className="text-[11px] text-center text-foreground/30 mt-2 md:hidden">Scroll to explore →</p>
        </div>
      </div>
    </section>
  );
}
