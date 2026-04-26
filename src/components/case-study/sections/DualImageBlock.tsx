import Image from "next/image";
import type { DualImageSection } from "@/lib/types";
import { SwipeRow } from "../SwipeRow";

// Each image is roughly half the article width on desktop, full width on mobile.
const SLOT_SIZES = "(min-width: 768px) 50vw, 100vw";

function ImageSlot({ src, alt, native, transparent, aspect, blend }: { src: string; alt: string; native?: boolean; transparent?: boolean; aspect?: string; blend?: string }) {
  const aspectClass = aspect ? aspect : native ? "" : "aspect-[4/5]";
  const isNative = native && !aspect;
  return (
    <div className={`${aspectClass} rounded-[clamp(30px,5vw,60px)] overflow-hidden ${transparent ? "" : "bg-surface-alt"} ${isNative ? "" : "relative"}`}>
      {src ? (
        isNative ? (
          <Image
            src={src}
            alt={alt}
            width={1600}
            height={2000}
            sizes={SLOT_SIZES}
            className="w-full h-auto"
            style={{ ...(blend ? { mixBlendMode: blend as React.CSSProperties["mixBlendMode"] } : {}), height: "auto" }}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={SLOT_SIZES}
            className="object-cover"
            style={blend ? { mixBlendMode: blend as React.CSSProperties["mixBlendMode"] } : undefined}
          />
        )
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-surface-alt to-border flex items-center justify-center">
          <span className="text-muted text-xs tracking-widest uppercase">{alt || "Image"}</span>
        </div>
      )}
    </div>
  );
}

export function DualImageBlock({ left, right, native, transparent, aspect, blend }: DualImageSection) {
  const sidePad = "md:px-[calc(100%/24)]";
  return (
    <section className={`w-full ${sidePad} ${transparent ? "py-1" : "py-4"}`}>
      <SwipeRow className="" cardFraction={0.88}>
        {[
          <ImageSlot key="l" {...left} native={native} transparent={transparent} aspect={aspect} blend={blend} />,
          <ImageSlot key="r" {...right} native={native} transparent={transparent} aspect={aspect} blend={blend} />,
        ]}
      </SwipeRow>

      <div className={`hidden md:grid grid-cols-2 ${transparent ? "gap-8" : "gap-4"}`}>
        <ImageSlot {...left} native={native} transparent={transparent} aspect={aspect} blend={blend} />
        <ImageSlot {...right} native={native} transparent={transparent} aspect={aspect} blend={blend} />
      </div>
    </section>
  );
}
