import Image from "next/image";
import type { QuadGridSection } from "@/lib/types";

/**
 * QuadGridBlock — 2×2 of images that meet at the center with no gaps.
 * Each cell rounds only its outer corner so the four pieces join into one
 * unified rectangle.
 *
 * `images` order: [topLeft, topRight, bottomLeft, bottomRight]
 */

// Each cell is half the article width on desktop, half on mobile too (since the grid stays 2-col on mobile).
const CELL_SIZES = "(min-width: 768px) 50vw, 50vw";

export function QuadGridBlock({ images, cellAspect = "aspect-[4/3]" }: QuadGridSection) {
  const cornerClasses = [
    "rounded-tl-[clamp(30px,5vw,60px)]",
    "rounded-tr-[clamp(30px,5vw,60px)]",
    "rounded-bl-[clamp(30px,5vw,60px)]",
    "rounded-br-[clamp(30px,5vw,60px)]",
  ];

  return (
    <section className="w-full md:px-[calc(100%/24)] py-4">
      <div className="grid grid-cols-2 gap-0">
        {images.slice(0, 4).map((img, i) => (
          <div
            key={i}
            className={`overflow-hidden relative ${cornerClasses[i]} ${cellAspect}`}
          >
            {img.src ? (
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={CELL_SIZES}
                className="object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-surface-alt flex items-center justify-center">
                <span className="text-muted text-xs tracking-widest uppercase">{img.alt}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
