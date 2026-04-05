import type { HeroSection } from "@/lib/types";

export function HeroBlock({ image, alt, inline }: HeroSection) {
  return (
    <section className={`w-[calc(100%+32px)] -ml-4 md:w-[calc(100%+100px)] md:-ml-[50px] ${inline ? "mt-10 mb-4" : "mb-8"}`}>
      <div className="w-full rounded-[clamp(30px,5vw,100px)] overflow-hidden bg-surface-alt">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={alt}
            className={`w-full h-auto${inline ? " scale-[1.04]" : ""}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#5a3e28]/60 to-[#3a2518]/80 flex items-end justify-center pb-0 overflow-hidden">
            {/* Phone mockup placeholder */}
            <div className="w-[220px] md:w-[280px] bg-[#1a1a1a] rounded-t-[20px] h-[60%] flex flex-col p-3 pt-6">
              <p className="text-[10px] text-white/60 italic">my</p>
              <p className="text-[13px] text-white font-bold">home</p>
              <p className="text-[8px] text-white/50 mt-2 leading-relaxed">
                Keep your inventory current — tap into your rooms below to
                manage items, edit details, and attach documents.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
