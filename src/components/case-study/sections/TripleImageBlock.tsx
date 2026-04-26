import Image from "next/image";
import type { TripleImageSection } from "@/lib/types";
import { SwipeRow } from "../SwipeRow";

// Each tile is roughly a third of the article width on desktop, full width on mobile.
const TILE_SIZES = "(min-width: 768px) 33vw, 100vw";

export function TripleImageBlock({ images, native, transparent, blend }: TripleImageSection) {
  const imageCards = images.map((img, i) => (
    <div key={i} className={`${native ? "" : "aspect-square relative"} rounded-[clamp(20px,4vw,40px)] overflow-hidden ${transparent ? "" : "bg-surface-alt"}`}>
      {img.src ? (
        native ? (
          <Image
            src={img.src}
            alt={img.alt}
            width={1200}
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

      <div className="hidden md:grid grid-cols-3 gap-6 md:gap-10">
        {imageCards}
      </div>
    </section>
  );
}
