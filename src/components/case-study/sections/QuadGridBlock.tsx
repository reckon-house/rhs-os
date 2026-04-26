import type { QuadGridSection } from "@/lib/types";

/**
 * QuadGridBlock — 2×2 of images that meet at the center with no gaps.
 * Each cell rounds only its outer corner so the four pieces join into one
 * unified rectangle.
 *
 * `images` order: [topLeft, topRight, bottomLeft, bottomRight]
 */
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
            className={`overflow-hidden ${cornerClasses[i]} ${cellAspect}`}
          >
            {img.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
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
