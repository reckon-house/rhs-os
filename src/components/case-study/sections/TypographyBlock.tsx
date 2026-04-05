import type { TypographySection } from "@/lib/types";

export function TypographyBlock({ fonts }: TypographySection) {
  return (
    <section className="w-full py-8">
      <div className="space-y-12 md:ml-auto md:w-[46%]">
        {fonts.map((font, i) => (
          <div key={i}>
            <p className="text-[60px] md:text-[100px] lg:text-[140px] leading-[1] font-normal text-[#141414] mb-4">
              {font.name}
            </p>
            <p className="text-[11px] tracking-[0.15em] uppercase text-[#141414]/60 mb-2">
              {font.role}
            </p>
            <p className="text-[13px] leading-[22px] text-foreground/70">
              {font.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
