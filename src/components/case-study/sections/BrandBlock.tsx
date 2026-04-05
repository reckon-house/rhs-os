import type { BrandSection } from "@/lib/types";

export function BrandBlock({ logoText, tagline }: BrandSection) {
  return (
    <section className="w-full py-8">
      <div className="rounded-[20px] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[48%_52%] min-h-[500px] md:min-h-[700px]">
          <div className="bg-[#efebe4] p-10 md:p-16 flex flex-col items-center justify-center min-h-[350px]">
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.3em] text-[#141414] lowercase">
              {logoText}
            </h3>
            <p className="text-[11px] tracking-[0.15em] uppercase text-[#141414]/60 mt-4">
              {tagline}
            </p>
          </div>
          <div className="bg-[#e0ddd8] p-10 md:p-16 flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full bg-[#C4A265]" />
          </div>
        </div>
      </div>
    </section>
  );
}
