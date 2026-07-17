"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SizzleReel, buildSequence, type SizzleBeat } from "@/components/fx/SizzleReel";
import { extractPalette } from "@/lib/sizzle-palette";
import type { SizzlePlaygroundSection } from "@/lib/types";

// The live SizzleReel inside its own case study. Two variants:
//   hero — the reel, big, looping, no controls. Opens the study.
//   lab  — the reel plus the working surface: load your own images, palette
//          pulled from their pixels, headline, speed, and the beat inspector.
// Everything runs in the visitor's browser on object URLs. Nothing uploads,
// nothing saves, a refresh resets it.

const CS = "/case-studies";
// A range reel: one strong frame from seven projects, ordered for maximum
// contrast cut to cut (editorial, interior, figure, interior, brand, retail,
// western) so no two adjacent frames share a register.
const RANGE_IMAGES = [
  `${CS}/nordstrom-personalization/nordstrom-personalization-system-design-woman-model-blue-floral-print-dress-black-white-geometric-strappy-heels-yellow-sofa-editorial.jpg`,
  `${CS}/hill-country-bath/hill-country-bath-vanity-marble-globe-sconces-sage.jpg`,
  `${CS}/nordstrom-framework/nordstrom-content-framework-lockup-whats-now.jpg`,
  `${CS}/hill-country-kitchen/hill-country-kitchen-island-pendants-marble-wide.jpg`,
  `${CS}/hill-country-oak/hill-country-oakworks-outdoor-banner-whiskey-barrels-colorful-background-tree-texas-born-oakcraft.jpg`,
  `${CS}/j-christianson/j-christianson-storefront-tree-stripe-window-mockup.jpg`,
  `${CS}/capitan-boot-co/capitan-boot-co-western-original-buffalo-silhouette-desert-landscape-mesa-mountains-sage-brush-terrain-branding-campaign.jpg`,
];
// Extracted offline across the seven frames (same quantizer the lab runs
// live): signature cyan, near-black, oak tan, cream, cool gray.
const RANGE_COLORS = ["#0AA7CA", "#181B17", "#776549", "#F5EAE7", "#8A8784"];
const RANGE_HEADLINE = "Reckon House Staples";

const REEL_RADIUS = "clamp(30px, 5vw, 100px)";

// Hero variant: a wall of small reels instead of one big one. Each cell runs
// this lighter sequence — mostly clip-path and opacity, plus ONE burn beat.
// Burn's backdrop-filter blur is the one genuinely expensive effect in the
// kit, so it's rationed to a single beat of eight: with the cells desynced,
// only ~2 of the 18 are ever mid-burn at once, so the cream-flash punctuates
// the wall without the whole grid filtering at the same time. Skips the
// title-card beats: eighteen copies of the same headline flashing at
// different times would read as noise, not signal, at card scale.
function buildGridSequence(imageCount: number, colors: string[]): SizzleBeat[] {
  const img = (k: number) => k % Math.max(imageCount, 1);
  const col = (k: number) => colors[k % Math.max(colors.length, 1)] ?? "#18A6CC";
  return [
    { fx: "shutter", img: img(0), ms: 640 },
    { fx: "fade", img: img(1), ms: 420 },
    { fx: "pinch", color: col(0), img: img(2), ms: 520 },
    { fx: "slat", img: img(3), ms: 700 },
    { fx: "ccurtain", color: col(1), ms: 380 },
    { fx: "curtain", img: img(4), ms: 720 },
    { fx: "cut", img: img(5), ms: 640 },
    // The lone burn: cream blink + bloom, image settles under it. Held a beat
    // longer than a plain cut so the pop registers at card scale.
    { fx: "burn", img: img(6), ms: 560 },
  ];
}
// A 6-column x 3-row wall on desktop (3 columns on mobile). The cards are
// CAPPED at the homepage thumbnail size (max-width, centered in each track)
// rather than filling 1fr — so dropping to 6 columns adds empty space around
// them instead of stretching them wider. GRID_WIDTH_PCT runs the track
// slightly wider than its container and GRID_SHIFT_PCT re-centers it, so the
// outer columns bleed past the box and get clipped by its overflow:hidden —
// a subtle "off screen" peek at each edge.
const GRID_SIZE = 18; // desktop: 6 columns x 3 rows
const GRID_MOBILE_SIZE = 12; // mobile: 3 columns x 4 rows — a portrait wall that fits
const GRID_CELL = "w-full max-w-[130px] md:max-w-[160px]";
const GRID_RADIUS = `${(50 / 225) * 100}%`; // same ratio Thumb's BLOT_RADIUS uses
// Desktop edge-peek: the grid runs 112% of the box width and shifts left 6% to
// re-center, so the outer columns bleed past the box and its overflow:hidden
// clips them (see the md:w-[112%] md:ml-[-6%] on the grid). Mobile is full
// width so all three columns are fully visible.

const mono = "text-[11px] tracking-[0.14em] uppercase text-foreground/50";
const chipBase =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] tracking-[0.05em] uppercase transition-colors cursor-pointer";

const toolBtn =
  "inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-[11px] tracking-[0.08em] uppercase text-foreground/70 backdrop-blur shadow-sm transition-colors hover:bg-surface hover:text-foreground cursor-pointer";

// A numbered control block in the left rail: "01 — IMAGES" over its inputs.
function LabSection({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-foreground/10 pt-5">
      <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-foreground/45">
        <span className="text-foreground/70">{num}</span>
        <span className="mx-1.5 text-foreground/25">&mdash;</span>
        {title}
      </p>
      {children}
    </div>
  );
}

export function SizzlePlayground({ variant }: SizzlePlaygroundSection) {
  const [images, setImages] = useState<string[]>(RANGE_IMAGES);
  const [colors, setColors] = useState<string[]>(RANGE_COLORS);
  const [headline, setHeadline] = useState(RANGE_HEADLINE);
  const [speed, setSpeed] = useState(1);
  const [extracting, setExtracting] = useState(false);
  const objectUrls = useRef<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  // The hero grid's bounded aspect-ratio box — cells clipped by its
  // overflow:hidden pass this as their offscreen-pause root (see SizzleReel's
  // pauseRoot), since the default viewport-based check can't see that clip.
  const gridBoxRef = useRef<HTMLDivElement>(null);
  // The hero wall carries fewer tiles on mobile (3x4) than desktop (6x3).
  // Starts at the desktop count so SSR and the first client render agree (no
  // hydration mismatch), then narrows on mount if the viewport is small — the
  // swap lands under the first-load burn-in, so it never flashes.
  const [gridCount, setGridCount] = useState(GRID_SIZE);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setGridCount(mq.matches ? GRID_SIZE : GRID_MOBILE_SIZE);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Beat inspector state (lab only)
  const [step, setStep] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [liveBeat, setLiveBeat] = useState(0);
  const onBeat = useCallback((k: number) => setLiveBeat(k), []);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const runExtract = useCallback(async (srcs: string[]) => {
    setExtracting(true);
    const palette = await extractPalette(srcs, 5);
    if (palette.length >= 3) setColors((prev) => palette.concat(prev).slice(0, 5));
    setExtracting(false);
  }, []);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])].slice(0, 8);
    if (!files.length) return;
    objectUrls.current.forEach((u) => URL.revokeObjectURL(u));
    const urls = files.map((f) => URL.createObjectURL(f));
    objectUrls.current = urls;
    setImages(urls);
    setStep(false);
    runExtract(urls);
  }

  function setColor(k: number, v: string) {
    setColors((c) => c.map((x, j) => (j === k ? v : x)));
  }

  const reelKey = `${images.join("|")}~${colors.join()}~${headline}`;
  const beats = buildSequence(images.length, colors, headline.trim() ? headline : undefined);

  // The paste-able embed for the current recipe. Locally-loaded images are
  // blob: URLs that only live in this tab, so they become placeholders the
  // user swaps for their own hosted URLs.
  const embedCode = [
    `<script type="module" src="sizzle-reel.js"></script>`,
    `<sizzle-reel`,
    `  images="${images.map((u, i) => (/^blob:/.test(u) ? `image-${i + 1}.jpg` : u)).join(", ")}"`,
    `  colors="${colors.join(", ")}"`,
    headline.trim() ? `  headline="${headline.trim()}"` : null,
    speed !== 1 ? `  speed="${speed.toFixed(2)}"` : null,
    `  aspect="16 / 9"`,
    `  radius="20px"`,
    `></sizzle-reel>`,
  ]
    .filter(Boolean)
    .join("\n");
  function copyEmbed() {
    navigator.clipboard
      ?.writeText(embedCode)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {});
  }

  if (variant === "hero") {
    const gridSeq = buildGridSequence(RANGE_IMAGES.length, RANGE_COLORS);
    return (
      <section className="hero-breakout mt-2 mb-6">
        {/* Desktop: bounded to 16:9 like a normal hero image, the three rows 1fr
            each so the capped cards get even vertical breathing room, and
            overflow-hidden clips the outer columns' peek. Mobile: no fixed
            ratio — the grid flows to its natural height so the square cards are
            never squeezed shorter than they are wide (which stacked them). */}
        <div ref={gridBoxRef} className="w-full overflow-hidden md:aspect-video">
          {/* Desktop only (md:): wider than the box + shifted left to re-center,
              so the overflow on each side is what the box's overflow:hidden
              clips. Mobile is full width — all three columns fully visible. */}
          <div className="grid grid-cols-3 md:grid-cols-6 md:grid-rows-3 md:h-full w-full md:w-[112%] md:ml-[-6%] gap-4 place-items-center">
            {Array.from({ length: gridCount }).map((_, k) => (
              <SizzleReel
                key={k}
                images={RANGE_IMAGES}
                colors={RANGE_COLORS}
                sequence={gridSeq}
                offsetBeat={k}
                // Small, deterministic per-cell drift (0.85x-1.15x) so cells
                // that start in the same phase don't stay locked together —
                // their loops slowly pull apart instead.
                speed={0.85 + (k % 7) * 0.05}
                pauseRoot={gridBoxRef}
                className={GRID_CELL}
                style={{ aspectRatio: "1 / 1", borderRadius: GRID_RADIUS }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── lab: two-panel tool — inputs on the left rail, the reel on a graph-paper
  // stage on the right. On mobile it stacks (reel first, then the controls).
  // px matches the case study's media gutter (md:px-[calc(100%/24)], one grid
  // column) so the panel sits framed inside the section instead of bleeding to
  // the column edge. ──
  return (
    <section className="w-full py-6 px-4 md:px-[calc(100%/24)]">
      <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
        {/* ── STAGE (right on desktop, top on mobile) ── */}
        <div className="relative order-1 overflow-hidden rounded-[24px] bg-surface-alt lg:order-none lg:col-start-2 lg:row-start-1">
          {/* floating toolbar */}
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
            <div className="flex overflow-hidden rounded-full bg-surface/90 text-[11px] uppercase tracking-[0.08em] backdrop-blur shadow-sm">
              <button
                onClick={() => setStep(false)}
                className={`px-3 py-1.5 transition-colors ${!step ? "bg-foreground text-background" : "text-foreground/55 hover:text-foreground"}`}
              >
                Live
              </button>
              <button
                onClick={() => { setStep(true); setStepIndex(liveBeat); setNonce((n) => n + 1); }}
                className={`px-3 py-1.5 transition-colors ${step ? "bg-foreground text-background" : "text-foreground/55 hover:text-foreground"}`}
              >
                Still
              </button>
            </div>
            <button onClick={copyEmbed} className={toolBtn} title="Copy the embed code for this recipe">
              {copied ? "Copied" : "</> Embed"}
            </button>
          </div>

          <div className="p-5 md:p-8">
            <SizzleReel
              key={reelKey}
              images={images}
              colors={colors}
              headline={headline.trim() ? headline : undefined}
              speed={speed}
              index={step ? stepIndex : null}
              nonce={nonce}
              onBeatChange={onBeat}
              className="w-full"
              style={{ aspectRatio: "16 / 9", borderRadius: 20 }}
            />

            {/* timeline — the beat inspector reads as the loop's filmstrip */}
            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {beats.map((b, k) => {
                  const on = (step ? stepIndex : liveBeat) === k;
                  return (
                    <button
                      key={k}
                      onClick={() => { setStep(true); setStepIndex(k); setNonce((n) => n + 1); }}
                      className={`${chipBase} ${
                        on
                          ? "bg-foreground text-background"
                          : "bg-foreground/[0.06] text-foreground/50 hover:bg-foreground/[0.11]"
                      }`}
                    >
                      {b.color ? (
                        <i aria-hidden className="inline-block h-2 w-2 rounded-full border border-foreground/20" style={{ background: b.color }} />
                      ) : null}
                      {k + 1} {b.fx}
                    </button>
                  );
                })}
              </div>
              <p className={`${mono} mt-2.5 normal-case tracking-[0.02em]`}>
                {step
                  ? `Frozen on beat ${stepIndex + 1}. Click Live to resume, or pick another chip.`
                  : "The highlighted chip is the current beat. Click one to freeze it."}
              </p>
            </div>
          </div>
        </div>

        {/* ── RAIL (left on desktop, below on mobile) ── */}
        <div className="order-2 rounded-[24px] bg-surface p-6 md:p-7 lg:order-none lg:col-start-1 lg:row-start-1">
          <div className="flex items-baseline justify-between">
            <h3 className="text-[20px] font-bold leading-none tracking-[-0.02em]">Faux Reel</h3>
            <span className={mono}>Lab</span>
          </div>
          <p className="mt-3 max-w-[34ch] text-[12px] leading-relaxed text-foreground/55">
            Load stills, pull a palette from their pixels, set a title. The reel cuts itself. Nothing uploads, nothing saves.
          </p>

          <LabSection num="01" title="Images">
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-full bg-foreground px-5 py-2.5 text-[13px] text-background transition-colors hover:bg-foreground/85"
            >
              Load images
            </button>
            <p className={`${mono} mt-3 normal-case tracking-[0.02em]`}>
              {images === RANGE_IMAGES ? "Running the studio set" : `${images.length} of yours loaded`}
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-foreground/45">
              Up to 8. They stay in your browser — a refresh clears them.
            </p>
          </LabSection>

          <LabSection num="02" title="Palette">
            <div className="flex items-center gap-2">
              {colors.map((c, k) => (
                <input
                  key={k}
                  type="color"
                  value={c}
                  onChange={(e) => setColor(k, e.target.value)}
                  aria-label={`Palette color ${k + 1}`}
                  className="sz-swatch h-9 w-9 cursor-pointer rounded-lg bg-transparent p-0 ring-1 ring-inset ring-foreground/15"
                />
              ))}
            </div>
            <button onClick={() => runExtract(images)} className={`${chipBase} mt-3 bg-foreground/[0.06] text-foreground/70 hover:bg-foreground/[0.11]`}>
              {extracting ? "Reading pixels…" : "Re-extract"}
            </button>
          </LabSection>

          <LabSection num="03" title="Title card">
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Leave empty for no title card"
              className="w-full rounded-xl bg-foreground/[0.05] px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-foreground/35 focus:bg-foreground/[0.08] focus:outline-none"
            />
            <p className={`${mono} mt-2 normal-case tracking-[0.02em]`}>
              1&ndash;2 words slide in. 3+ scatter through the cut, then build.
            </p>
          </LabSection>

          <LabSection num="04" title={`Speed × ${speed.toFixed(2)}`}>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.05}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="sz-range w-full"
              style={{ ["--pct" as string]: `${((speed - 0.5) / 1.5) * 100}%` }}
            />
          </LabSection>
        </div>
      </div>
    </section>
  );
}
