import type { BrandSystemSection } from "@/lib/types";

function ChromaticCircle() {
  return (
    <div className="relative">
      <p className="text-[13px] font-bold text-[#141414] text-center mb-8">
        Chromatic brand circle
      </p>
      <div className="flex justify-center">
        <div
          className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 42% 38%, #d4d4a8 0%, #B1BC94 15%, #C4A265 35%, #8B7355 55%, #5a3e25 72%, #1a0f05 90%, #000000 100%)`,
            boxShadow: `inset 0 -20px 40px rgba(0,0,0,0.3), inset 0 20px 40px rgba(200,190,160,0.15)`,
          }}
        />
      </div>
    </div>
  );
}

export function BrandSystem({
  label,
  title,
  introText,
  subcopy,
  philosophyText,
  colors,
  fonts,
  logoConstructionImage,
  appScreenshotImage,
}: BrandSystemSection) {
  const titleLines = title.split("\n");
  const philosophyParagraphs = philosophyText.split("\n\n");

  // Split fonts into inline descriptions (first 2) and display samples (all)
  const typeSamples = [
    { name: "Ogg Regular", family: "'Ogg', Georgia, serif", weight: 400, size: 48, colorInfo: "Brand grey RGB: 177/188/148\n#B1BC94 CMYK 34/16/50/0" },
    { name: "Avenir Next Medium", family: "'Avenir Next', system-ui, sans-serif", weight: 500, size: 48, colorInfo: "Brand grey RGB: 177/188/148\n#B1BC94 CMYK 34/16/50/0" },
    { name: "Avenir Next Demi Bold", family: "'Avenir Next', system-ui, sans-serif", weight: 600, size: 48, colorInfo: "Brand grey RGB: 177/188/148\n#B1BC94 CMYK 34/16/50/0" },
    { name: "Avenir Next Regular", family: "'Avenir Next', system-ui, sans-serif", weight: 400, size: 24, colorInfo: "Brand grey RGB: 177/188/148\n#B1BC94 CMYK 34/16/50/0" },
  ];

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
          {/* ─── HEADER ROW: spans full width ─── */}
          <div className="px-[calc(100%/12)] pt-8 pb-0 md:p-12 lg:p-14 md:pb-0">
            {/* Section label */}
            <span className="inline-block text-[11px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
              {label}
            </span>

            {/* Title */}
            <h2 className="text-[20px] md:text-[24px] leading-[1.3] tracking-[-0.02em] text-[#141414] mb-0">
              <span className="font-bold">{titleLines[0]}</span>
              {titleLines.length > 1 && (
                <>
                  {" "}
                  <span className="font-bold">{titleLines.slice(1).join(" ")}</span>
                </>
              )}
            </h2>

            {/* Subhead */}
            <p className="text-[20px] md:text-[24px] font-normal leading-[1.3] tracking-[-0.02em] text-[#141414] pt-0 pb-1">
              {introText}
            </p>

            {/* Subcopy */}
            {subcopy && (
              <p className="text-[16px] leading-[24px] text-[#141414] max-w-3xl pt-1 pb-8">
                {subcopy}
              </p>
            )}
          </div>

          {/* ─── TWO-COLUMN CONTENT ─── */}
          <div className="grid grid-cols-1 md:grid-cols-[48%_52%]">
            {/* LEFT COLUMN */}
            <div className="px-[calc(100%/12)] md:px-12 lg:px-14 pb-8">
              {/* Chromatic Brand Circle */}
              <div className="mb-12">
                <ChromaticCircle />

                {/* Color labels */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {colors.map((color, i) => (
                    <div key={i} className={i === 0 ? "text-left" : i === colors.length - 1 ? "text-right" : "text-center"}>
                      <p className="text-[12px] font-bold text-[#141414] mb-0.5">{color.name}</p>
                      <p className="text-[11px] text-[#141414]/50 leading-[16px]">{color.hex}</p>
                      <p className="text-[11px] text-[#141414]/50 leading-[16px]">{color.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="px-[calc(100%/12)] md:px-12 lg:px-14 pb-8">
              {/* Brand philosophy */}
              <div className="mb-10">
                <p className="text-[13px] font-bold text-[#141414] mb-3" style={{ textIndent: "4em" }}>Brand philosophy</p>
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

              {/* Font descriptions (inline, small) */}
              <div className="space-y-4 mb-10">
                {fonts.map((font, i) => (
                  <div key={i}>
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
          </div>

          {/* ─── TYPOGRAPHY SAMPLES: right-aligned, stacked large ─── */}
          <div className="grid grid-cols-1 md:grid-cols-[48%_52%]">
            <div className="hidden md:block" /> {/* Empty left */}
            <div className="px-[calc(100%/12)] md:px-12 lg:px-14 pb-12">
              <div className="space-y-10">
                {typeSamples.map((sample, i) => (
                  <div key={i}>
                    <p
                      className="leading-[1.05] text-[#141414] mb-2"
                      style={{
                        fontFamily: sample.family,
                        fontWeight: sample.weight,
                        fontSize: `clamp(${Math.round(sample.size * 0.65)}px, ${sample.size / 16}vw + 16px, ${sample.size}px)`,
                      }}
                    >
                      {sample.name}
                    </p>
                    <p className="text-[11px] text-[#141414]/50 leading-[18px] whitespace-pre-line">
                      {sample.colorInfo}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── LOGO CONSTRUCTION: centered, spans both columns ─── */}
          <div className="px-[calc(100%/12)] md:px-12 lg:px-14 pb-12 flex justify-center">
            <img
              src={logoConstructionImage}
              alt="A.R.C. logo construction guidelines"
              className="w-full max-w-[800px] object-contain"
            />
          </div>

          {/* ─── APP SCREENSHOT: below logo, native ratio ─── */}
          {appScreenshotImage && (
            <div className="px-[calc(100%/12)] md:px-12 lg:px-14 pb-12 flex justify-center">
              <img
                src={appScreenshotImage}
                alt="A.R.C. app interface components"
                className="w-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
