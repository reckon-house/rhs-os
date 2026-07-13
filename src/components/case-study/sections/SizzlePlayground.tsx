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
const GRID_SIZE = 18;
const GRID_CELL = "w-full max-w-[130px] md:max-w-[160px]";
const GRID_RADIUS = `${(50 / 225) * 100}%`; // same ratio Thumb's BLOT_RADIUS uses
const GRID_WIDTH_PCT = 112;
const GRID_SHIFT_PCT = -(GRID_WIDTH_PCT - 100) / 2;

const mono = "text-[11px] tracking-[0.14em] uppercase text-foreground/50";
const chipBase =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] tracking-[0.05em] uppercase transition-colors cursor-pointer";

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

  // Beat inspector state (lab only)
  const [step, setStep] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [liveBeat, setLiveBeat] = useState(0);
  const onBeat = useCallback((k: number) => setLiveBeat(k), []);

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

  if (variant === "hero") {
    const gridSeq = buildGridSequence(RANGE_IMAGES.length, RANGE_COLORS);
    return (
      <section className="hero-breakout mt-2 mb-6">
        {/* Bounded to 16:9 like a normal hero image. On desktop the three rows
            are 1fr each so they distribute evenly down the full height, giving
            each capped card the same breathing room vertically as it has
            horizontally. overflow-hidden clips the outer columns' peek. */}
        <div ref={gridBoxRef} className="w-full overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
          {/* Wider than the box + shifted left to re-center — the overflow on
              each side is what lets the box's own overflow:hidden clip the
              outer columns instead of them ending flush at the edge. */}
          <div
            className="grid h-full grid-cols-3 md:grid-cols-6 md:grid-rows-3 gap-4 place-items-center"
            style={{ width: `${GRID_WIDTH_PCT}%`, marginLeft: `${GRID_SHIFT_PCT}%` }}
          >
            {Array.from({ length: GRID_SIZE }).map((_, k) => (
              <SizzleReel
                key={k}
                images={RANGE_IMAGES}
                colors={RANGE_COLORS}
                sequence={gridSeq}
                offsetBeat={k}
                // Small, deterministic per-cell drift (0.85x-1.15x) so cells
                // that start in the same phase (18 cells, 8 beats) don't stay
                // locked together — their loops slowly pull apart instead.
                speed={0.85 + (k % 7) * 0.05}
                pauseRoot={gridBoxRef}
                className={GRID_CELL}
                style={{ aspectRatio: "1 / 1", borderRadius: GRID_RADIUS }}
              />
            ))}
          </div>
        </div>
        <p className={`${mono} mt-4 text-center`}>
          Live render &middot; no video files &middot; {GRID_SIZE} cuts across the studio
        </p>
      </section>
    );
  }

  // ── lab ──
  return (
    <section className="w-full py-6">
      <SizzleReel
        key={reelKey}
        images={images}
        colors={colors}
        headline={headline.trim() ? headline : undefined}
        speed={speed}
        index={step ? stepIndex : null}
        nonce={nonce}
        onBeatChange={onBeat}
        style={{ aspectRatio: "16 / 9", borderRadius: REEL_RADIUS }}
      />

      {/* Beat inspector */}
      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {beats.map((b, k) => {
            const on = (step ? stepIndex : liveBeat) === k;
            return (
              <button
                key={k}
                onClick={() => {
                  setStep(true);
                  setStepIndex(k);
                  setNonce((n) => n + 1);
                }}
                className={`${chipBase} ${
                  on
                    ? "border-foreground/60 bg-foreground/[0.06] text-foreground"
                    : "border-foreground/15 text-foreground/45 hover:border-foreground/35"
                }`}
              >
                {b.color ? (
                  <i
                    aria-hidden
                    className="inline-block h-2 w-2 rounded-full border border-foreground/20"
                    style={{ background: b.color }}
                  />
                ) : null}
                {k + 1} {b.fx}
                {b.text ? ` “${b.text}”` : ""}
              </button>
            );
          })}
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {step ? (
            <>
              <button onClick={() => { setStepIndex((v) => (v - 1 + beats.length) % beats.length); setNonce((n) => n + 1); }} className={`${chipBase} border-foreground/25 text-foreground/70`}>&#9664; Prev</button>
              <button onClick={() => { setStepIndex((v) => (v + 1) % beats.length); setNonce((n) => n + 1); }} className={`${chipBase} border-foreground/25 text-foreground/70`}>Next &#9654;</button>
              <button onClick={() => setNonce((n) => n + 1)} className={`${chipBase} border-foreground/25 text-foreground/70`}>&#8635; Replay</button>
              <button onClick={() => setStep(false)} className={`${chipBase} border-foreground/60 text-foreground`}>Resume loop</button>
            </>
          ) : (
            <p className={mono}>The chips follow the cut. Click one to freeze and replay that beat.</p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 border-t border-foreground/10 pt-7 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className={`${mono} mb-3`}>Your images (up to 8)</p>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-full border border-foreground/25 px-5 py-2.5 text-[13px] text-foreground/80 transition-colors hover:border-foreground/50"
          >
            Load images
          </button>
          <p className={`${mono} mt-3 normal-case tracking-[0.02em]`}>
            {images === RANGE_IMAGES ? "Running the studio set" : `${images.length} of yours loaded`}
          </p>
          <p className="mt-2 max-w-[38ch] text-[12px] leading-relaxed text-foreground/45">
            Images stay in your browser. Nothing uploads, nothing saves. Refresh and they are gone.
          </p>
        </div>
        <div>
          <p className={`${mono} mb-3`}>Palette {extracting ? "· reading the pixels…" : "· pulled from the images"}</p>
          <div className="flex items-center gap-2">
            {colors.map((c, k) => (
              <input
                key={k}
                type="color"
                value={c}
                onChange={(e) => setColor(k, e.target.value)}
                aria-label={`Palette color ${k + 1}`}
                className="h-9 w-9 cursor-pointer rounded-lg border border-foreground/20 bg-transparent p-0"
              />
            ))}
          </div>
          <button
            onClick={() => runExtract(images)}
            className={`${chipBase} mt-3 border-foreground/25 text-foreground/70`}
          >
            Re-extract
          </button>
        </div>
        <div>
          <p className={`${mono} mb-3`}>Title card</p>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Leave empty for no title card"
            className="w-full rounded-xl border border-foreground/20 bg-transparent px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-foreground/35 focus:border-foreground/50 focus:outline-none"
          />
          <p className={`${mono} mt-2 normal-case tracking-[0.02em]`}>
            1&ndash;2 words slide in. 3+ scatter through the cut, then build.
          </p>
          <p className={`${mono} mt-4 mb-2`}>Speed &times; {speed.toFixed(2)}</p>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.05}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </div>
      </div>
    </section>
  );
}
