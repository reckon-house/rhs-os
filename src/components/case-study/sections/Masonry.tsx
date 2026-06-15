import Image from "next/image";
import type { MasonrySection } from "@/lib/types";

// Multi-column masonry: images keep their natural aspect and pack into balanced
// columns (Pinterest-style), so a row of mixed-height screenshots reads as one
// cluster instead of a rigid grid. Mobile collapses to a single column.
export function Masonry({ images, columns = 2 }: MasonrySection) {
  const colClass = columns === 3 ? "md:columns-3" : "md:columns-2";
  return (
    <section className="w-full py-4 md:px-[calc(100%/24)]">
      <div className={`columns-1 ${colClass} gap-4 md:gap-6 [column-fill:_balance]`}>
        {images.map((img, i) => (
          <div
            key={i}
            className="mb-4 md:mb-6 break-inside-avoid rounded-[clamp(20px,4vw,40px)] overflow-hidden bg-surface-alt"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={1200}
              height={1400}
              sizes="(min-width: 768px) 45vw, 100vw"
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
