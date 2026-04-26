import Image from "next/image";
import type { QuadImageSection } from "@/lib/types";
import { SwipeRow } from "../SwipeRow";

// Each tile is roughly a quarter of the article width on desktop, full width on mobile.
const TILE_SIZES = "(min-width: 768px) 25vw, 100vw";

export function QuadImageBlock({ images, native, transparent, blend }: QuadImageSection) {
  const imageCards = images.map((img, i) => (
    <div key={i} className={`${native ? "" : "aspect-[3/4] relative"} rounded-[clamp(16px,3vw,30px)] overflow-hidden ${transparent ? "" : "bg-surface-alt"}`}>
      {img.src ? (
        native ? (
          <Image
            src={img.src}
            alt={img.alt}
            width={900}
            height={1200}
            sizes={TILE_SIZES}
            className="w-full h-auto"
            style={{ ...(blend ? { mixBlendMode: blend as React.CSSProperties["mixBlendMode"] } : {}), height: "auto" }}
          />
        ) : (
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes={TILE_SIZES}
            className="object-cover"
            style={blend ? { mixBlendMode: blend as React.CSSProperties["mixBlendMode"] } : undefined}
          />
        )
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
