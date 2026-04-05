import type { ColorPaletteSection } from "@/lib/types";

export function ColorPalette({ colors, title }: ColorPaletteSection) {
  return (
    <section className="w-full py-8">
      <div className="bg-[#efebe4] rounded-[clamp(30px,5vw,75px)] p-10 md:p-16">
        {title && (
          <p className="text-[11px] tracking-[0.15em] uppercase text-[#141414]/60 text-center mb-10">
            {title}
          </p>
        )}

        {/* Chromatic Brand Circle */}
        <div className="flex justify-center mb-12">
          <div
            className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full"
            style={{
              background: `radial-gradient(circle at 40% 35%, #B1BC94 0%, #C4A265 35%, #8B7355 60%, #3a2a1a 85%, #000000 100%)`,
            }}
          />
        </div>

        {/* Color labels — 3 columns */}
        <div className="grid grid-cols-3 gap-6 max-w-[600px] mx-auto">
          {colors.map((color, i) => (
            <div key={i} className="text-center">
              <p className="text-[13px] font-bold text-[#141414] mb-1">{color.name}</p>
              <p className="text-[11px] text-[#141414]/50 leading-[16px]">
                {color.hex}
              </p>
              <p className="text-[11px] text-[#141414]/50 leading-[16px]">
                {color.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
