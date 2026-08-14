"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SizzleReel, buildSequence, type SizzleBeat } from "@/components/fx/SizzleReel";
import { extractPalette } from "@/lib/sizzle-palette";
import { useLedgerArrival } from "@/lib/ledger-arrival";
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
// clips them. The shift is a relative offset rather than a negative margin,
// because margin utilities are inert on this page (see the rail below).
// Mobile is full width so all three columns are fully visible.

/* ── TYPE: WEIGHT AND COLOUR, NOT CAPS ──────────────────────────────
   The whole panel used to differentiate by capitalising: labels, helper
   lines, every chip. Two problems. A caps sentence is read letter by
   letter, and these helper lines are sentences — the longest runs 62
   characters. And the site itself stopped doing this: the homepage rail
   and the compose form both label in sentence case, small and muted.

   It was also broken. Four of these lines carried `uppercase` AND
   `normal-case` together, which are the same CSS property, so the author
   asked for sentence case and got caps because the utilities' order in
   the sheet decided it, not the order in the class attribute. Verified
   in the browser: computed text-transform was `uppercase` on all four.
   Deleting the caps fixes the intent and the collision at once. */
const note = "text-[12px] leading-relaxed text-foreground/45";
const chipBase =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] transition-colors cursor-pointer";

const toolBtn =
  "inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-[12px] text-foreground/70 backdrop-blur shadow-sm transition-colors hover:bg-surface hover:text-foreground cursor-pointer";

/* Beat names arrive as engine identifiers. Most read fine with a capital
   ("Shutter", "Burn"); three do not, because they are contractions the
   code uses and nobody else would: ccurtain, wordBuild, wordOut. Their
   display names are read off the type union's own comments in
   SizzleReel.tsx — "solid color wipes in left-to-right and HOLDS", "the
   line assembles word by word", "the standing line exits word by word" —
   so the chip says what the beat does rather than what the constant is
   called. Not renamed at the source: `fx` is the engine's API and the
   embed snippet ships those ids. */
const BEAT_NAMES: Record<string, string> = {
  ccurtain: "Color wipe",
  wordBuild: "Word build",
  wordOut: "Word out",
};
const beatName = (fx: string) =>
  BEAT_NAMES[fx] ?? fx.charAt(0).toUpperCase() + fx.slice(1);

/* A numbered control block in the left rail: "01  Images" over its inputs.
   The title is the thing being read, so it carries the weight and nearly
   full ink; the number is an index and recedes. That is the whole
   hierarchy — no caps, no letterspacing, no rule between the two.
   sz-lab-row is the arrival's hook (see the stylesheet), not a style. */
function LabSection({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="sz-lab-row flex flex-col gap-4 border-t border-foreground/10 pt-7">
      <p className="flex items-baseline gap-2.5 text-[13px] leading-none">
        <span className="text-foreground/35 tabular-nums">{num}</span>
        <span className="font-medium text-foreground/85">{title}</span>
      </p>
      {children}
    </div>
  );
}

export function SizzlePlayground({ variant }: SizzlePlaygroundSection) {
  /* The rail's numbered rows rise in sequence as they arrive, the same
     arm-and-release contract the daybook and the compose form use: the
     resting state in CSS is the FINISHED row, and the hook applies the
     start state only to rows still below the fold. A dead script leaves
     a complete rail, never an invisible one. Not BodyReveal — that one
     rewrites its subtree's innerHTML to cut lines, which would destroy
     the file input, the colour swatches and the slider living here. */
  const railRef = useRef<HTMLDivElement | null>(null);
  useLedgerArrival(railRef, ".sz-lab-row", "sz-lab-pre");
  const [images, setImages] = useState<string[]>(RANGE_IMAGES);
  const [colors, setColors] = useState<string[]>(RANGE_COLORS);
  const [headline, setHeadline] = useState(RANGE_HEADLINE);
  const [speed, setSpeed] = useState(1);
  const [aspect, setAspect] = useState("16 / 9");
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
  // Aspect ratio → a number for the height-cap calc that keeps tall ratios contained.
  const [aw, ah] = aspect.split("/").map((s) => parseFloat(s));
  const arNum = (aw / ah).toFixed(4);

  // The paste-able embed for the current recipe. Locally-loaded images are
  // blob: URLs that only live in this tab, so they become placeholders the
  // user swaps for their own hosted URLs.
  const embedCode = [
    `<script src="sizzle-reel.js"></script>`,
    `<sizzle-reel`,
    `  images="${images.map((u, i) => (/^blob:/.test(u) ? `image-${i + 1}.jpg` : u)).join(", ")}"`,
    `  colors="${colors.join(", ")}"`,
    headline.trim() ? `  headline="${headline.trim()}"` : null,
    speed !== 1 ? `  speed="${speed.toFixed(2)}"` : null,
    `  aspect="${aspect}"`,
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
      <section className="hero-breakout pb-6">
        {/* Desktop: bounded to 16:9 like a normal hero image, the three rows 1fr
            each so the capped cards get even vertical breathing room, and
            overflow-hidden clips the outer columns' peek. Mobile: no fixed
            ratio — the grid flows to its natural height so the square cards are
            never squeezed shorter than they are wide (which stacked them). */}
        <div ref={gridBoxRef} className="w-full overflow-hidden md:aspect-video">
          {/* Desktop only (md:): wider than the box + shifted left to re-center,
              so the overflow on each side is what the box's overflow:hidden
              clips. Mobile is full width — all three columns fully visible. */}
          <div className="grid grid-cols-3 md:grid-cols-6 md:grid-rows-3 md:h-full w-full md:w-[112%] md:relative md:left-[-6%] gap-4 place-items-center">
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
        {/* NO MAT. The pressing article already paints --pp-paper across the
            viewport behind every section, and PressingVizFrame's own rule is
            that a hosted viz sits on that paper directly — no tinted
            container. This panel was the one child still bringing its own
            surface, so the study read as a widget parked on the page rather
            than part of it. The reel keeps its own radius; nothing else
            needs a box. */}
        <div className="relative order-1 lg:order-none lg:col-start-2 lg:row-start-1">
          {/* floating toolbar */}
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
            <div className="flex overflow-hidden rounded-full bg-surface/90 text-[12px] backdrop-blur shadow-sm">
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
              {copied ? "Copied" : "Embed"}
            </button>
          </div>

          <div className="pt-14">
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
              style={{ aspectRatio: aspect, borderRadius: 20, maxWidth: `calc(min(60vh, 540px) * ${arNum})`, marginInline: "auto" }}
            />

            {/* timeline — the beat inspector reads as the loop's filmstrip */}
            <div className="flex flex-col gap-2.5 pt-4">
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
                      {k + 1} {beatName(b.fx)}
                    </button>
                  );
                })}
              </div>
              <p className={note}>
                {step
                  ? `Frozen on beat ${stepIndex + 1}. Click Live to resume, or pick another chip.`
                  : "The highlighted chip is the current beat. Click one to freeze it."}
              </p>
            </div>
          </div>
        </div>

        {/* ── RAIL (left on desktop, below on mobile) ── */}
        {/* GAP, NOT MARGIN, ALL THE WAY DOWN. Every route that renders the
            pressing footer also loads pressing-home.css, which carries the
            lab prototype's universal margin reset UNLAYERED — and an
            unlayered rule beats Tailwind's layered utilities whatever their
            specificity, so every margin utility in this file was inert.
            Asked the engine directly: the utility matches the element and
            loses to the star rule. Flex gap and padding are untouched by
            that reset, so the rail's rhythm is built from those and cannot
            silently die. */}
        <div ref={railRef} className="order-2 flex flex-col gap-9 lg:order-none lg:col-start-1 lg:row-start-1">
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[20px] font-bold leading-none tracking-[-0.02em]">Faux Reel</h3>
              <span className={note}>Lab</span>
            </div>
            <p className="max-w-[34ch] text-[12px] leading-relaxed text-foreground/55">
              Load stills, pull a palette from their pixels, set a title. The reel cuts itself. Nothing uploads, nothing saves.
            </p>
          </div>

          <LabSection num="01" title="Images">
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-fit rounded-full bg-foreground px-5 py-2.5 text-[13px] text-background transition-colors hover:bg-foreground/85"
            >
              Load images
            </button>
            <div className="flex flex-col gap-1.5">
              <p className={note}>
                {images === RANGE_IMAGES ? "Running the studio set" : `${images.length} of yours loaded`}
              </p>
              <p className={note}>
                Up to 8. They stay in your browser &mdash; a refresh clears them.
              </p>
            </div>
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
            <button onClick={() => runExtract(images)} className={`${chipBase} w-fit bg-foreground/[0.06] text-foreground/70 hover:bg-foreground/[0.11]`}>
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
            <p className={note}>
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

          <LabSection num="05" title="Ratio">
            <div className="flex flex-wrap gap-1.5">
              {["16 / 9", "1 / 1", "4 / 5", "9 / 16"].map((a) => (
                <button
                  key={a}
                  onClick={() => setAspect(a)}
                  className={`${chipBase} ${
                    aspect === a
                      ? "bg-foreground text-background"
                      : "bg-foreground/[0.06] text-foreground/60 hover:bg-foreground/[0.11]"
                  }`}
                >
                  {a.replace(" / ", ":")}
                </button>
              ))}
            </div>
            <p className={note}>
              Square and portrait for social, 9:16 for stories.
            </p>
          </LabSection>
        </div>
      </div>
    </section>
  );
}
