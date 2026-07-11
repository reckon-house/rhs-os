"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SizzleReel, buildSequence } from "@/components/fx/SizzleReel";
import { extractPalette } from "@/lib/sizzle-palette";
import type { SizzlePlaygroundSection } from "@/lib/types";

// The live SizzleReel inside its own case study. Two variants:
//   hero — the reel, big, looping, no controls. Opens the study.
//   lab  — the reel plus the working surface: load your own images, palette
//          pulled from their pixels, headline, speed, and the beat inspector.
// Everything runs in the visitor's browser on object URLs. Nothing uploads,
// nothing saves, a refresh resets it.

const IMG = "/case-studies/big-bend";
const WEST_IMAGES = [
  `${IMG}/chisos-peak-cactus.jpg`,
  `${IMG}/rise.jpg`,
  `${IMG}/mountain_crop.jpg`,
  `${IMG}/desert-dusk-ridgeline.jpg`,
  `${IMG}/hero.jpg`,
  `${IMG}/prada.jpg`,
];
// Extracted offline from the six stills (same quantizer the lab runs live):
// olive scrub, dark juniper, desert tan, haze blue, pale sky.
const WEST_COLORS = ["#494636", "#181B14", "#756B58", "#96A6AB", "#C6C6C9"];
const WEST_HEADLINE = "Far West Texas";

const REEL_RADIUS = "clamp(30px, 5vw, 100px)";

const mono = "text-[11px] tracking-[0.14em] uppercase text-foreground/50";
const chipBase =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] tracking-[0.05em] uppercase transition-colors cursor-pointer";

export function SizzlePlayground({ variant }: SizzlePlaygroundSection) {
  const [images, setImages] = useState<string[]>(WEST_IMAGES);
  const [colors, setColors] = useState<string[]>(WEST_COLORS);
  const [headline, setHeadline] = useState(WEST_HEADLINE);
  const [speed, setSpeed] = useState(1);
  const [extracting, setExtracting] = useState(false);
  const objectUrls = useRef<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

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
    return (
      <section className="w-full pt-2 pb-6">
        <SizzleReel
          key={reelKey}
          images={WEST_IMAGES}
          colors={WEST_COLORS}
          headline={WEST_HEADLINE}
          style={{ aspectRatio: "16 / 9", borderRadius: REEL_RADIUS }}
        />
        <p className={`${mono} mt-4 text-center`}>
          Live render &middot; no video files &middot; the photographs are from the West Texas study
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
            {images === WEST_IMAGES ? "Running the West Texas set" : `${images.length} of yours loaded`}
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
