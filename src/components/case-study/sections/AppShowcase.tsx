import Image from "next/image";
import type { AppShowcaseSection } from "@/lib/types";
import { getImageDimensions } from "@/data/image-dimensions";

export function AppShowcase({ image, alt }: AppShowcaseSection) {
  const [w, h] = image ? getImageDimensions(image) : [1600, 1200];
  return (
    <section className="w-full py-8">
      <div className="w-full rounded-[20px] overflow-hidden bg-surface-alt">
        {image ? (
          <Image
            src={image}
            alt={alt}
            width={w}
            height={h}
            sizes="(min-width: 1280px) 1100px, 100vw"
            className="w-full h-auto"
          />
        ) : (
          <div className="w-full aspect-[16/12] bg-white flex items-center justify-center">
            <span className="text-muted text-xs tracking-widest uppercase">{alt}</span>
          </div>
        )}
      </div>
    </section>
  );
}
