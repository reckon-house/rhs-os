import type { QuadImageSection } from "@/lib/types";
import { SwipeRow } from "../SwipeRow";

export function QuadImageBlock({ images, native, transparent, blend }: QuadImageSection) {
  const imageCards = images.map((img, i) => (
    <div key={i} className={`${native ? "" : "aspect-[3/4]"} rounded-[clamp(16px,3vw,30px)] overflow-hidden ${transparent ? "" : "bg-surface-alt"}`}>
      {img.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img.src} alt={img.alt} className={`w-full ${native ? "h-auto" : "h-full object-cover"}`} style={blend ? { mixBlendMode: blend as React.CSSProperties["mixBlendMode"] } : undefined} />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-surface-alt to-border flex items-center justify-center">
          <span className="text-muted text-xs tracking-widest uppercase">{img.alt}</span>
        </div>
      )}
    </div>
  ));

  return (
    <section className="w-full pt-4 pb-[50px] md:px-[calc(100%/24)]">
      <SwipeRow className="">{imageCards}</SwipeRow>

      <div className="hidden md:grid grid-cols-4 gap-4 md:gap-6">
        {imageCards}
      </div>
    </section>
  );
}
