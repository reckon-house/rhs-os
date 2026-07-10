"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SizzleReel, buildSequence } from "@/components/fx/SizzleReel";

// Scratch playground: a code-only "sizzle reel" utility. Load images, pull a
// palette out of them, type a headline, and the reel choreographs itself.
// Not linked anywhere — delete src/app/sizzle when the experiment is done.

const IMG = "/case-studies/ivy-park";
const IVY = [
  `${IMG}/ivy-park-editorial-beanie-portrait-dancer.jpg`,
  `${IMG}/ivy-park-experience-confidence-strength-inclusivity.jpg`,
  `${IMG}/ivy-park-shop-the-look-editorial-grid.jpg`,
  `${IMG}/ivy-park-product-detail-leggings-choice-system.jpg`,
  `${IMG}/ivy-park-experience-courage-power-polygon-frames.jpg`,
];

// Extracted offline (sharp, 16-level quantization over all 5 stills):
// lead cyan, dominant dark, electric cyan, light ground, cool slate.
const IVY_COLORS = ["#0888B8", "#181818", "#38B8D8", "#E8E8E8", "#98A8A8"];

/** Canvas dominant-color extraction: downsample, quantize to 16 levels per
 *  channel, count buckets, pick the top hits that stay mutually distinct.
 *  Near-white/near-black only qualify when they truly dominate. */
async function extractPalette(srcs: string[], count = 5): Promise<string[]> {
  const buckets = new Map<string, { n: number; r: number; g: number; b: number }>();
  for (const src of srcs) {
    await new Promise<void>((resolve) => {
      const im = new window.Image();
      im.crossOrigin = "anonymous";
      im.onload = () => {
        const w = 64;
        const h = Math.max(1, Math.round((im.naturalHeight / im.naturalWidth) * w));
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = h;
        const cx = cv.getContext("2d");
        if (!cx) return resolve();
        cx.drawImage(im, 0, 0, w, h);
        let data: Uint8ClampedArray;
        try {
          data = cx.getImageData(0, 0, w, h).data;
        } catch {
          return resolve(); // tainted canvas (cross-origin) — skip
        }
        for (let p = 0; p < data.length; p += 4) {
          const r = data[p], g = data[p + 1], b = data[p + 2];
          const key = `${r >> 4},${g >> 4},${b >> 4}`;
          const cur = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
          cur.n++;
          cur.r += r;
          cur.g += g;
          cur.b += b;
          buckets.set(key, cur);
        }
        resolve();
      };
      im.onerror = () => resolve();
      im.src = src;
    });
  }
  const total = [...buckets.values()].reduce((s, v) => s + v.n, 0) || 1;
  const ranked = [...buckets.values()]
    .map((v) => ({
      n: v.n,
      r: Math.round(v.r / v.n),
      g: Math.round(v.g / v.n),
      b: Math.round(v.b / v.n),
    }))
    .map((c) => {
      const max = Math.max(c.r, c.g, c.b), min = Math.min(c.r, c.g, c.b);
      const sat = max === 0 ? 0 : (max - min) / max;
      const extreme = (c.r > 235 && c.g > 235 && c.b > 235) || (c.r < 20 && c.g < 20 && c.b < 20);
      // weight: frequency x (1 + saturation boost); extremes need real dominance
      const w = extreme && c.n / total < 0.4 ? 0 : c.n * (1 + sat * 2.2);
      return { ...c, w };
    })
    .filter((c) => c.w > 0)
    .sort((a, b) => b.w - a.w);
  const picks: { r: number; g: number; b: number }[] = [];
  for (const c of ranked) {
    if (picks.length >= count) break;
    const distinct = picks.every(
      (p) => Math.hypot(p.r - c.r, p.g - c.g, p.b - c.b) > 60
    );
    if (distinct) picks.push(c);
  }
  // Loudest color leads: the flash/word frames read best in the most
  // saturated pick, so order by saturation rather than raw frequency.
  picks.sort((a, b) => {
    const sat = (c: { r: number; g: number; b: number }) => {
      const max = Math.max(c.r, c.g, c.b);
      return max === 0 ? 0 : (max - Math.min(c.r, c.g, c.b)) / max;
    };
    return sat(b) - sat(a);
  });
  const hex = (v: number) => v.toString(16).padStart(2, "0");
  return picks.map((p) => `#${hex(p.r)}${hex(p.g)}${hex(p.b)}`.toUpperCase());
}

const mono: React.CSSProperties = {
  fontFamily: "ui-monospace, monospace",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#6E635B",
};

const stepBtn: React.CSSProperties = {
  ...mono,
  background: "none",
  border: "1px solid rgba(237,231,226,.2)",
  borderRadius: 999,
  color: "#A6998E",
  padding: "5px 12px",
  cursor: "pointer",
};

export default function SizzlePage() {
  const [images, setImages] = useState<string[]>(IVY);
  const [colors, setColors] = useState<string[]>(IVY_COLORS);
  const [headline, setHeadline] = useState("Courage is power");
  const [speed, setSpeed] = useState(1);
  const [extracting, setExtracting] = useState(false);
  const objectUrls = useRef<string[]>([]);

  // Beat inspector: chips track the live beat; clicking one freezes the reel
  // on that beat and replays its animation, for pinpointing rough cuts.
  const [step, setStep] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [liveBeat, setLiveBeat] = useState(0);
  const onBeat = useCallback((k: number) => setLiveBeat(k), []);

  const runExtract = useCallback(async (srcs: string[]) => {
    setExtracting(true);
    const palette = await extractPalette(srcs, 5);
    if (palette.length >= 3) setColors((prev) => palette.concat(prev).slice(0, 5));
    setExtracting(false);
  }, []);

  // Pull the real palette out of the default set on first load.
  useEffect(() => {
    runExtract(IVY);
  }, [runExtract]);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])].slice(0, 8);
    if (!files.length) return;
    objectUrls.current.forEach((u) => URL.revokeObjectURL(u));
    const urls = files.map((f) => URL.createObjectURL(f));
    objectUrls.current = urls;
    setImages(urls);
    runExtract(urls);
  }

  function setColor(k: number, v: string) {
    setColors((c) => c.map((x, j) => (j === k ? v : x)));
  }

  // key forces a clean remount when the recipe changes so beats don't
  // reference stale image indexes mid-loop
  const reelKey = `${images.join("|")}~${colors.join()}~${headline}`;

  // Same choreography the hero reel derives internally — drives the
  // inspector chips.
  const beats = buildSequence(images.length, colors, headline.trim() ? headline : undefined);

  return (
    <div style={{ background: "#14100D", minHeight: "100dvh" }}>
      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "44px 24px 120px", color: "#EDE7E2" }}>
        <p style={{ ...mono, color: "#18A6CC", letterSpacing: "0.22em", marginBottom: 14 }}>
          Sizzle · code-only montage utility
        </p>
        <h1 style={{ fontSize: "clamp(30px,5vw,52px)", lineHeight: 1.02, letterSpacing: "-0.03em", margin: "0 0 10px", fontWeight: 650 }}>
          Images in, sizzle out.
        </h1>
        <p style={{ maxWidth: "58ch", color: "#A6998E", fontSize: 16, margin: "0 0 30px" }}>
          Load stills, pull a palette straight out of them, add a headline.
          The reel cuts through photo wipes, a burn blink, a lens pinch,
          color frames, and a title card that builds in and exits. No video
          files anywhere.
        </p>

        <SizzleReel
          key={reelKey}
          images={images}
          colors={colors}
          headline={headline || undefined}
          speed={speed}
          index={step ? stepIndex : null}
          nonce={nonce}
          onBeatChange={onBeat}
          style={{ aspectRatio: "16 / 9", borderRadius: 18 }}
        />

        {/* ── Beat inspector ── */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
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
                  style={{
                    ...mono,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 10px",
                    borderRadius: 999,
                    cursor: "pointer",
                    border: `1px solid ${on ? "#18A6CC" : "rgba(237,231,226,.15)"}`,
                    background: on ? "rgba(24,166,204,.12)" : "none",
                    color: on ? "#EDE7E2" : "#6E635B",
                  }}
                >
                  {b.color ? (
                    <i style={{ width: 9, height: 9, borderRadius: "50%", background: b.color, border: "1px solid rgba(237,231,226,.25)" }} />
                  ) : null}
                  {k + 1} {b.fx}
                  {b.img != null ? ` #${b.img + 1}` : ""}
                  {b.text ? ` "${b.text}"` : ""} · {b.ms}ms
                </button>
              );
            })}
          </div>
          {step ? (
            <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
              <button onClick={() => { setStepIndex((v) => (v - 1 + beats.length) % beats.length); setNonce((n) => n + 1); }} style={stepBtn}>◀ Prev</button>
              <button onClick={() => { setStepIndex((v) => (v + 1) % beats.length); setNonce((n) => n + 1); }} style={stepBtn}>Next ▶</button>
              <button onClick={() => setNonce((n) => n + 1)} style={stepBtn}>↻ Replay</button>
              <button onClick={() => setStep(false)} style={{ ...stepBtn, borderColor: "#18A6CC", color: "#EDE7E2" }}>Resume loop</button>
              <span style={{ ...mono, textTransform: "none" }}>
                Frozen on beat {stepIndex + 1} — replay it, or click through to find the rough cut
              </span>
            </div>
          ) : (
            <p style={{ ...mono, textTransform: "none", letterSpacing: "0.02em", margin: "8px 0 0" }}>
              Chips follow the loop live. Click one to freeze and replay that beat.
            </p>
          )}
        </div>

        {/* ── Controls ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 22, margin: "26px 0 0", padding: "22px 20px", border: "1px solid rgba(237,231,226,.12)", borderRadius: 14 }}>
          <div>
            <p style={{ ...mono, margin: "0 0 10px" }}>Images (up to 8)</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onFiles}
              style={{ fontSize: 12, color: "#A6998E", maxWidth: "100%" }}
            />
            <p style={{ ...mono, textTransform: "none", letterSpacing: "0.02em", margin: "10px 0 0" }}>
              {images === IVY ? "Using the Ivy Park set" : `${images.length} loaded`}
            </p>
          </div>
          <div>
            <p style={{ ...mono, margin: "0 0 10px" }}>
              Palette {extracting ? "· extracting…" : "· pulled from the images"}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {colors.map((c, k) => (
                <label key={k} style={{ display: "block" }}>
                  <input
                    type="color"
                    value={c}
                    onChange={(e) => setColor(k, e.target.value)}
                    style={{ width: 34, height: 34, padding: 0, border: "1px solid rgba(237,231,226,.2)", borderRadius: 8, background: "transparent", cursor: "pointer" }}
                    aria-label={`Palette color ${k + 1}`}
                  />
                </label>
              ))}
            </div>
            <button
              onClick={() => runExtract(images)}
              style={{ ...mono, marginTop: 10, background: "none", border: "1px solid rgba(237,231,226,.2)", borderRadius: 999, color: "#A6998E", padding: "5px 12px", cursor: "pointer" }}
            >
              Re-extract
            </button>
          </div>
          <div>
            <p style={{ ...mono, margin: "0 0 10px" }}>Headline (title card)</p>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Leave empty for no title card"
              style={{ width: "100%", background: "#1C1611", border: "1px solid rgba(237,231,226,.15)", borderRadius: 8, color: "#EDE7E2", fontSize: 13, padding: "8px 10px" }}
            />
            <p style={{ ...mono, textTransform: "none", letterSpacing: "0.02em", margin: "6px 0 0" }}>
              1-2 words: slide-in card · 3+: words scatter through the loop, line builds at the end
            </p>
            <p style={{ ...mono, margin: "14px 0 6px" }}>Speed × {speed.toFixed(2)}</p>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.05}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <p style={{ ...mono, margin: "40px 0 14px" }}>
          Thumbnail scale, desynced — a homepage grid feel:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <SizzleReel key={`a${reelKey}`} images={images} colors={colors} headline={headline || undefined} speed={speed} offsetBeat={0} style={{ aspectRatio: "1 / 1", borderRadius: 14 }} />
          <SizzleReel key={`b${reelKey}`} images={images} colors={colors} headline={headline || undefined} speed={speed} offsetBeat={3} style={{ aspectRatio: "1 / 1", borderRadius: 14 }} />
          <SizzleReel key={`c${reelKey}`} images={images} colors={colors} headline={headline || undefined} speed={speed} offsetBeat={6} style={{ aspectRatio: "1 / 1", borderRadius: 14 }} />
        </div>
      </div>
    </div>
  );
}
