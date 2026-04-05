import type { AppShowcaseSection } from "@/lib/types";

export function AppShowcase({ image, alt }: AppShowcaseSection) {
  return (
    <section className="w-full py-8">
      <div className="w-full rounded-[20px] overflow-hidden bg-surface-alt">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={alt} className="w-full h-auto" />
        ) : (
          <div className="w-full aspect-[16/12] bg-white flex items-center justify-center">
            <span className="text-muted text-xs tracking-widest uppercase">{alt}</span>
          </div>
        )}
      </div>
    </section>
  );
}
