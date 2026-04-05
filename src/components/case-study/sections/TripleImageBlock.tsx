import type { TripleImageSection } from "@/lib/types";
import { SwipeRow } from "../SwipeRow";

export function TripleImageBlock({ images }: TripleImageSection) {
  const imageCards = images.map((img, i) => (
    <div key={i} className="aspect-square rounded-[18%] overflow-hidden bg-surface-alt">
      {img.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
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
