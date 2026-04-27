import Image from "next/image";
import type { MarksAndMaterialsSection } from "@/lib/types";

// ── Color helpers ─────────────────────────────────────────────────────────
function parseHex(hex: string): [number, number, number] | null {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return null;
  const v = m[1];
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}

function toHex(r: number, g: number, b: number): string {
  const c = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Relative luminance per WCAG, used to sort palette light → dark. */
function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((c) => c / 255);
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Mix toward white by `amount` (0..1). */
function lighten(hex: string, amount: number): string {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  const [r, g, b] = rgb;
  return toHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount,
  );
}

/**
 * Generate a radial-gradient from a palette. Sorts colors light → dark, prepends
 * a soft highlight derived from the lightest swatch, and uses an ease-out curve
 * for stop positions so the orb reads as 3D rather than as flat bands.
 */
function generateSphereGradient(hexes: string[]): string {
  const valid = hexes.filter((h) => parseHex(h) !== null);
  if (valid.length === 0) return "transparent";
  if (valid.length === 1) return valid[0];

  const sorted = [...valid].sort(
    (a, b) => relativeLuminance(b) - relativeLuminance(a),
  );

  // Soft highlight at the very center
  const highlight = lighten(sorted[0], 0.18);
  const stops = [highlight, ...sorted];

  const n = stops.length;
  const positions = stops.map((_, i) => {
    const t = i / (n - 1);
    // Ease-out: positions are denser near the center, sparser near the rim
    return Math.round((1 - Math.pow(1 - t, 1.5)) * 100);
  });

  const gradient = stops.map((c, i) => `${c} ${positions[i]}%`).join(", ");
  return `radial-gradient(ellipse 70% 60% at 42% 38%, ${gradient})`;
}

function rgbString(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return "";
  return `${rgb[0]}/${rgb[1]}/${rgb[2]}`;
}

// ── Sphere component ──────────────────────────────────────────────────────
function ChromaticCircle({ colors }: { colors: string[] }) {
  return (
    <div className="relative">
      <p className="text-[13px] font-bold text-[#141414] text-center mb-8">
        Chromatic brand circle
      </p>
      <div className="flex justify-center">
        <div
          className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full"
          style={{
            background: generateSphereGradient(colors),
            boxShadow:
              "inset 0 -20px 40px rgba(0,0,0,0.3), inset 0 20px 40px rgba(255,250,240,0.15)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * Default type ramp sizes (in px, applied at desktop max). Each font in the
 * `fonts` array picks up the size at its index, so the bands actually read as
 * a scale rather than four equal samples. Per-font `sampleSize` still wins.
 * Fonts past the ramp length fall back to the smallest size.
 */
const DEFAULT_TYPE_RAMP = [36, 32, 24, 18] as const;

// ── Main component ────────────────────────────────────────────────────────
export function MarksAndMaterials({
  label,
  title,
  introText,
  subcopy,
  philosophyTitle = "Brand philosophy",
  philosophyText,
  colors,
  fonts,
  markImage,
  markAlt,
  markFullBleed = false,
}: MarksAndMaterialsSection) {
  const titleLines = title.split("\n");
  const philosophyParagraphs = philosophyText.split("\n\n");
  const sphereHexes = colors.map((c) => c.hex);

  return (
    <section className="w-full py-8">
      {/* Two-tone container */}
      <div className="relative rounded-[clamp(30px,5vw,75px)] overflow-hidden">
        {/* Background panels */}
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-[48%_52%]">
          <div className="bg-[#efebe4]" />
          <div className="bg-[#e7e5e2]" />
        </div>

        {/* Content overlay */}
        <div className="relative">
          {/* ─── HEADER ROW ─── */}
          <div className="px-[calc(100%/12)] pt-8 pb-0 md:p-12 lg:p-14 md:pb-0">
            <span className="inline-block text-[11px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
              {label}
            </span>

            <h2 className="text-[20px] md:text-[24px] leading-[1.3] tracking-[-0.02em] text-[#141414] mb-0">
              <span className="font-bold">{titleLines[0]}</span>
              {titleLines.length > 1 && (
                <>
                  {" "}
                  <span className="font-bold">
                    {titleLines.slice(1).join(" ")}
                  </span>
                </>
              )}
            </h2>

            <p className="text-[20px] md:text-[24px] font-normal leading-[1.3] tracking-[-0.02em] text-[#141414] pt-0 pb-1">
              {introText}
            </p>

            {subcopy && (
              <p className="text-[16px] leading-[24px] text-[#141414] max-w-3xl pt-1 pb-8">
                {subcopy}
              </p>
            )}
          </div>

          {/* ─── TWO-COLUMN BODY ─── */}
          <div className="grid grid-cols-1 md:grid-cols-[48%_52%]">
            {/* LEFT: Sphere + swatches */}
            <div className="px-[calc(100%/12)] md:px-12 lg:px-14 pb-8">
              <div className="mb-12">
                <ChromaticCircle colors={sphereHexes} />

                {/* Swatch labels in a row */}
                <div
                  className="grid gap-4 mt-8"
                  style={{
                    gridTemplateColumns: `repeat(${Math.max(colors.length, 1)}, minmax(0, 1fr))`,
                  }}
                >
                  {colors.map((color, i) => {
                    const align =
                      colors.length === 1
                        ? "text-center"
                        : i === 0
                          ? "text-left"
                          : i === colors.length - 1
                            ? "text-right"
                            : "text-center";
                    return (
                      <div key={`${color.hex}-${i}`} className={align}>
                        <p className="text-[12px] font-bold text-[#141414] mb-0.5">
                          {color.name}
                        </p>
                        <p className="text-[11px] text-[#141414]/50 leading-[16px]">
                          {color.hex.toUpperCase()}
                        </p>
                        {color.description && (
                          <p className="text-[11px] text-[#141414]/50 leading-[16px]">
                            {color.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: Philosophy + font descriptions + color bands */}
            <div className="pb-8">
              {/* Padded text area (philosophy + inline font descriptions) */}
              <div className="px-[calc(100%/12)] md:px-12 lg:px-14">
                <div className="mb-10">
                  <p
                    className="text-[13px] font-bold text-[#141414] mb-3"
                    style={{ textIndent: "4em" }}
                  >
                    {philosophyTitle}
                  </p>
                  {philosophyParagraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-[14px] leading-[24px] text-foreground/80 mb-4"
                      style={i === 0 ? { textIndent: "4em" } : undefined}
                    >
                      {p}
                    </p>
                  ))}
                </div>

                <div className="space-y-4 mb-10">
                  {fonts.map((font, i) => (
                    <div key={`${font.name}-${i}`}>
                      <p className="text-[13px] text-[#141414]">
                        <span className="font-bold">{font.name}</span>{" "}
                        <span className="text-foreground/60">{font.role}</span>
                      </p>
                      <p className="text-[13px] leading-[22px] text-foreground/70">
                        {font.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── TYPE RAMP — color bands, inset within the right column ─── */}
              {/* Each band uses a color from the palette (cycling) for its background.
                  Text contrast flips automatically based on band luminance.
                  The wrapper has overflow-hidden + radius so first/last bands
                  inherit rounded top/bottom corners without per-band logic. */}
              <div className="px-[calc(100%/12)] md:px-12 lg:px-14">
                <div className="overflow-hidden rounded-[clamp(20px,3vw,40px)]">
                {fonts.map((font, i) => {
                  const color = colors[i % colors.length];
                  const bg = color?.hex ?? "#EFEAD9";
                  const isDark = relativeLuminance(bg) < 0.4;
                  const fg = isDark ? "#EDE7E2" : "#141414";
                  const fgMuted = isDark
                    ? "rgba(237,231,226,0.55)"
                    : "rgba(20,20,20,0.5)";
                  const size =
                    font.sampleSize ??
                    DEFAULT_TYPE_RAMP[i] ??
                    DEFAULT_TYPE_RAMP[DEFAULT_TYPE_RAMP.length - 1];

                  return (
                    <div
                      key={`band-${font.name}-${i}`}
                      className="relative w-full px-6 md:px-10 lg:px-12 py-7 md:py-9"
                      style={{ backgroundColor: bg }}
                    >
                      {/* Type sample */}
                      <p
                        className="leading-[1.05] mb-2"
                        style={{
                          fontFamily: font.family,
                          fontWeight: font.weight,
                          fontStyle: font.italic ? "italic" : undefined,
                          fontSize: `clamp(${Math.round(size * 0.55)}px, ${size / 14}vw + 6px, ${size}px)`,
                          color: fg,
                        }}
                      >
                        {font.sampleText ?? font.name}
                      </p>

                      {/* Role label */}
                      <p
                        className="text-[11px] tracking-[0.04em] uppercase"
                        style={{ color: fgMuted }}
                      >
                        {font.role}
                      </p>

                      {/* Color spec, below role */}
                      <p
                        className="text-[10px] tracking-[0.04em] mt-0.5"
                        style={{ color: fgMuted }}
                      >
                        {color?.name} · {color?.hex.toUpperCase()}
                      </p>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          </div>

          {/* ─── PRIMARY MARK / SYSTEM SPREAD (centered) ─── */}
          <div className="px-[calc(100%/12)] md:px-12 lg:px-14 pb-12 pt-6 flex justify-center">
            <Image
              src={markImage}
              alt={markAlt}
              width={2000}
              height={1200}
              sizes={markFullBleed ? "(min-width: 1100px) 1000px, 100vw" : "(min-width: 1000px) 1000px, 100vw"}
              className={`w-full ${markFullBleed ? "max-w-none" : "max-w-[1000px]"} object-contain rounded-[clamp(20px,4vw,50px)]`}
              style={{ height: "auto" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
