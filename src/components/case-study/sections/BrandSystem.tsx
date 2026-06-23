import Image from "next/image";
import type { BrandSystemSection } from "@/lib/types";
import { getImageDimensions } from "@/data/image-dimensions";
import { MorphingGlyph } from "../MorphingGlyph";

// ── colour math (deterministic → SSR-safe) ─────────────────────────────────
type RGB = [number, number, number];
const CREAM: RGB = [238, 234, 226]; // #eeeae2, the card ground the tints mix toward

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}
function toHex(rgb: RGB): string {
  return "#" + rgb.map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");
}
function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] * t + b[0] * (1 - t), a[1] * t + b[1] * (1 - t), a[2] * t + b[2] * (1 - t)];
}
function luminance([r, g, b]: RGB): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
const textOn = (rgb: RGB) => (luminance(rgb) > 0.45 ? "#1a1a1a" : "#F0EAE4");

// ── typography helpers (map data → live brand faces) ───────────────────────
type Font = { name: string; role: string; description: string };
function fontStyle(f: Font): { fontFamily: string; fontWeight: number } {
  if (/ogg/i.test(f.name)) return { fontFamily: "'Ogg', Georgia, serif", fontWeight: 400 };
  return { fontFamily: "'Avenir Next', system-ui, sans-serif", fontWeight: /demi|bold/i.test(f.role) ? 600 : 500 };
}
function weightLabel(f: Font): string {
  const fam = /ogg/i.test(f.name) ? "Ogg" : "Avenir";
  const w = /demi/i.test(f.role) ? "Demi" : /bold/i.test(f.role) ? "Bold" : /medium/i.test(f.role) ? "Medium" : "Regular";
  return `${fam} · ${w}`;
}
function specimenName(f: Font): string {
  if (/ogg/i.test(f.name)) return f.name;
  const w = /demi/i.test(f.role) ? " Demi" : /bold/i.test(f.role) ? " Bold" : /medium/i.test(f.role) ? " Medium" : "";
  return f.name + w;
}

// Chromatic brand circle — the colour story as one gradient sphere.
function ChromaticCircle() {
  return (
    <div
      className="bs-pulse rounded-full w-[clamp(220px,30vw,340px)] h-[clamp(220px,30vw,340px)]"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 45% 40%, #cfe0c0 0%, #B1BC94 16%, #C4A265 38%, #8B7355 58%, #5a3e25 74%, #1a0f05 92%, #000 100%)",
        boxShadow: "inset 0 -20px 44px rgba(0,0,0,0.32), inset 0 18px 40px rgba(210,200,170,0.18)",
      }}
    />
  );
}

export function BrandSystem({
  label,
  title,
  introText,
  philosophyText,
  colors,
  fonts,
  logoConstructionImage,
  appScreenshotImage,
  morphGlyphs,
}: BrandSystemSection) {
  const philosophyParagraphs = philosophyText.split("\n\n");
  // One condensed role note per typeface family (top), full specimens below.
  const families: Font[] = [];
  fonts.forEach((f) => {
    if (!families.some((x) => x.name === f.name)) families.push(f);
  });
  const [logoW, logoH] = getImageDimensions(logoConstructionImage);
  const [appW, appH] = getImageDimensions(appScreenshotImage);

  return (
    <section className="w-full py-8">
      <div className="relative rounded-[clamp(30px,5vw,75px)] overflow-hidden">
        {/* Two-tone split ground */}
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-[48%_52%]">
          <div className="bg-[#eeeae2]" />
          <div className="bg-[#e6e4e0]" />
        </div>

        <div className="relative p-[clamp(24px,4.5vw,56px)] text-[#141414]">
          {/* ── HEADER — matched to live SectionHeader + TextBlock(subhead) ── */}
          <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
            {label}
          </span>
          <h2 className="text-[16px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold">
            {title.replace(/\n/g, " ")}
          </h2>
          <p className="text-[16px] md:text-[24px] font-normal leading-[1.5] tracking-[-0.02em]">{introText}</p>

          {/* ── MORPHING GLYPH · PHILOSOPHY ── */}
          <div className="grid grid-cols-1 md:grid-cols-[46%_54%] gap-8 md:gap-10 mt-6 md:mt-2 items-start">
            <div className="flex items-center justify-center min-h-[240px] md:min-h-[440px] overflow-visible">
              {morphGlyphs && morphGlyphs.length > 0 && <MorphingGlyph glyphs={morphGlyphs} />}
            </div>
            <div className="md:pt-12">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#141414]/45 mb-3.5">Brand philosophy</p>
              {philosophyParagraphs.map((p, i) => (
                <p key={i} className="text-[14px] leading-[1.875] text-[#141414]/80 mb-6 max-w-[560px]">
                  {p}
                </p>
              ))}
              {families.map((f, i) => (
                <div key={i} className="mb-5 max-w-[560px]">
                  <div className="text-[14px] leading-[1.6] mb-1">
                    <b className="font-semibold">{f.name}</b> · {f.role.split(",")[0]}
                  </div>
                  <div className="text-[14px] leading-[1.875] text-[#141414]/72">{f.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── COLOUR SYSTEM: full-width bands + tint columns (pulsing) ── */}
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#141414]/45 mt-12 md:mt-16 mb-4">
            Colour system / values
          </p>
          <div className="rounded-[18px] overflow-hidden">
            {colors.map((color, i) => {
              const rgb = hexToRgb(color.hex);
              const txt = textOn(rgb);
              const tints = [75, 50, 25].map((pct) => {
                const trgb = mix(rgb, CREAM, pct / 100);
                return { pct, bg: toHex(trgb), txt: textOn(trgb) };
              });
              return (
                <div key={i} className="flex flex-col md:grid md:grid-cols-[1.6fr_1fr_1fr_1fr]">
                  <div
                    className="bs-pulse p-5 md:p-6 min-h-[120px] md:min-h-[184px] flex flex-col justify-between"
                    style={{ background: color.hex, color: txt, animationDelay: `${(i * 0.3).toFixed(2)}s` }}
                  >
                    <span className="text-[18px] md:text-[19px] font-bold">{color.name}</span>
                    <span className="font-mono text-[10px] md:text-[11px] leading-[1.55] opacity-[0.82]">
                      RGB {rgb.join(" ")}
                      <br />
                      HEX {color.hex.toUpperCase()}
                      {color.cmyk && (
                        <>
                          <br />
                          CMYK {color.cmyk}
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex md:contents">
                    {tints.map((t, j) => (
                      <div
                        key={t.pct}
                        className="bs-pulse flex-1 min-h-[52px] md:min-h-0 p-4"
                        style={{ background: t.bg, color: t.txt, animationDelay: `${(i * 0.3 + (j + 1) * 0.4).toFixed(2)}s` }}
                      >
                        <span className="font-mono text-[10px] opacity-70">{t.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── TYPOGRAPHY: weight progression ── */}
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#141414]/45 mt-12 md:mt-16 mb-0">
            Typography / weight
          </p>
          <div
            className="grid border-y border-[#141414]/15"
            style={{ gridTemplateColumns: `repeat(${fonts.length}, minmax(0,1fr))` }}
          >
            {fonts.map((f, i) => (
              <div key={i} className={`py-6 md:py-7 px-3 md:px-4 ${i < fonts.length - 1 ? "border-r border-[#141414]/10" : ""}`}>
                <div style={fontStyle(f)} className="text-[clamp(40px,7vw,84px)] leading-[0.9]">
                  Aa
                </div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#141414]/50 mt-3">{weightLabel(f)}</div>
              </div>
            ))}
          </div>

          {/* ── TYPE SPECIMENS · CHROMATIC CIRCLE ── */}
          <div className="grid grid-cols-1 md:grid-cols-[46%_54%] gap-10 md:gap-12 mt-10 md:mt-12">
            <div>
              {fonts.map((f, i) => (
                <div key={i} className="mb-8 md:mb-9">
                  <div style={fontStyle(f)} className="text-[clamp(38px,5vw,52px)] leading-[1] mb-2">
                    {specimenName(f)}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#141414]/50 mb-2.5">{f.role}</div>
                  <div className="text-[13px] leading-[1.65] text-[#141414]/72 max-w-[440px]">{f.description}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center pt-2">
              <p className="text-[18px] tracking-[0.04em] text-[#141414]/55 mb-6 md:mb-7" style={{ fontFamily: "'Ogg', Georgia, serif" }}>
                Chromatic Brand Circle
              </p>
              <ChromaticCircle />
              <div className="grid grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-9 w-full">
                {colors.map((c, i) => (
                  <div key={i}>
                    <div className="text-[13px] font-bold mb-1">{c.name}</div>
                    <div className="font-mono text-[11px] leading-[1.5] text-[#141414]/60">
                      {c.hex.toUpperCase()}
                      <br />
                      {c.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── LOGO CONSTRUCTION (bare on the ground) ── */}
          <div className="flex justify-center py-10 md:py-14">
            <Image
              src={logoConstructionImage}
              alt="Logo construction grid"
              width={logoW}
              height={logoH}
              sizes="(min-width: 768px) 640px, 80vw"
              className="w-[min(640px,82%)] h-auto"
            />
          </div>

          {/* ── APP INTERFACE ── */}
          <div className="mt-2">
            <Image
              src={appScreenshotImage}
              alt="App interface components"
              width={appW}
              height={appH}
              sizes="(min-width: 768px) 1000px, 100vw"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
