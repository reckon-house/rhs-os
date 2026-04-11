import type { DualImageSection } from "@/lib/types";
import { SwipeRow } from "../SwipeRow";

function ImageSlot({ src, alt, native, transparent, aspect }: { src: string; alt: string; native?: boolean; transparent?: boolean; aspect?: string }) {
  const aspectClass = aspect ? aspect : native ? "" : "aspect-[4/5]";
  return (
    <div className={`${aspectClass} ${transparent ? "" : "rounded-[clamp(30px,5vw,60px)] bg-surface-alt"} overflow-hidden`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={`w-full ${native && !aspect ? "h-auto" : "h-full object-cover"}`} />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-surface-alt to-border flex items-center justify-center">
          <span className="text-muted text-xs tracking-widest uppercase">{alt || "Image"}</span>
        </div>
      )}
    </div>
  );
}

export function DualImageBlock({ left, right, native, transparent, aspect }: DualImageSection) {
  const sidePad = transparent ? "" : "md:px-[calc(100%/24)]";
  return (
    <section className={`w-full ${sidePad} py-4`}>
      <SwipeRow className="" cardFraction={0.88}>
        {[
          <ImageSlot key="l" {...left} native={native} transparent={transparent} aspect={aspect} />,
          <ImageSlot key="r" {...right} native={native} transparent={transparent} aspect={aspect} />,
        ]}
      </SwipeRow>

      <div className="hidden md:grid grid-cols-2 gap-4">
        <ImageSlot {...left} native={native} transparent={transparent} aspect={aspect} />
        <ImageSlot {...right} native={native} transparent={transparent} aspect={aspect} />
      </div>
    </section>
  );
}
