import type { BrandSystemVolumeSection } from "@/lib/types";
import { MorphingGlyph } from "../MorphingGlyph";
import { TypeAtVolume } from "../TypeAtVolume";
import { PolygonLattice } from "../PolygonLattice";

// ── colour math (deterministic → SSR-safe tints toward the card ground) ──────
type RGB = [number, number, number];
const CREAM: RGB = [238, 234, 226]; // #eeeae2
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

const LABEL = "text-[10px] font-bold tracking-[0.16em] uppercase text-[#141414]/45 mt-12 md:mt-16 mb-4";

export function BrandSystemVolume({
  label,
  title,
  introText,
  footText,
  philosophyHeading,
  philosophyText,
  roleLines,
  morphGlyphs,
  colors,
  typeComposition,
  polygonSignature,
}: BrandSystemVolumeSection) {
  const philosophyParagraphs = philosophyText.split("\n\n");

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
          <h2 className="text-[16px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold">{title.replace(/\n/g, " ")}</h2>
          <p className="text-[16px] md:text-[24px] font-normal leading-[1.5] tracking-[-0.02em]">{introText}</p>
          <p className="text-[14px] leading-[1.875] text-[#141414]/72 mt-5 max-w-[880px]">{footText}</p>

          {/* ── MORPHING GLYPH · PHILOSOPHY ── */}
          <div className="grid grid-cols-1 md:grid-cols-[50%_50%] gap-8 md:gap-9 mt-8 md:mt-3 items-center">
            <div className="flex items-center justify-center min-h-[280px] md:min-h-[520px] overflow-visible">
              {morphGlyphs.length > 0 && (
                <MorphingGlyph
                  glyphs={morphGlyphs}
                  size="clamp(220px, 38vw, 520px)"
                  fallbackFontFamily="'Avenir Next', system-ui, sans-serif"
                  fallbackFontWeight={700}
                />
              )}
            </div>
            <div className="md:pt-2">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#141414]/45 mb-3.5">{philosophyHeading}</p>
              {philosophyParagraphs.map((p, i) => (
                <p key={i} className="text-[14px] leading-[1.875] text-[#141414]/80 mb-6 max-w-[600px]">
                  {p}
                </p>
              ))}
              {roleLines.map((r, i) => (
                <div key={i} className="mb-5 max-w-[600px]">
                  <div className="text-[14px] leading-[1.6] mb-1">
                    <b className="font-semibold">{r.name}</b> · {r.role}
                  </div>
                  <div className="text-[14px] leading-[1.875] text-[#141414]/72">{r.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── COLOUR: full-width bands + tint columns (pulsing) ── */}
          <p className={LABEL}>Colour / as used</p>
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
                    <span className="text-[18px] md:text-[20px] font-bold">{color.name}</span>
                    <span className="font-mono text-[10px] md:text-[11px] leading-[1.55] opacity-[0.82]">
                      RGB {color.rgb}
                      <br />
                      HEX {color.hex.toUpperCase()}
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

          {/* ── TYPE AT VOLUME — graphic composition ── */}
          <p className={LABEL}>Type / at volume</p>
          <TypeAtVolume {...typeComposition} />

          {/* ── POLYGON SIGNATURE — rotating lattice ── */}
          <p className={LABEL}>The polygon / signature</p>
          <PolygonLattice name={polygonSignature.name} description={polygonSignature.description} />
        </div>
      </div>
    </section>
  );
}
