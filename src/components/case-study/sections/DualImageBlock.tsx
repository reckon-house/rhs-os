import Image from "next/image";
import type { DualImageSection } from "@/lib/types";
import { SwipeRow } from "../SwipeRow";

// Each image is roughly half the article width on desktop, full width on mobile.
const SLOT_SIZES = "(min-width: 768px) 50vw, 100vw";

function ImageSlot({
  src,
  alt,
  native,
  transparent,
  aspect,
  blend,
  objectFit,
  unoptimized,
}: {
  src: string;
  alt: string;
  native?: boolean;
  transparent?: boolean;
  aspect?: string;
  blend?: string;
  objectFit?: "cover" | "contain";
  unoptimized?: boolean;
}) {
  const aspectClass = aspect ? aspect : native ? "" : "aspect-[4/5]";
  const isNative = native && !aspect;
  // contain mode: the image rectangle sits inside the wrapper smaller than
  // the wrapper itself. Render via a centered flex container with the img
  // sized at height:100%, width:auto so the img's CSS box matches the
  // visible image edges. Border-radius then lands on the actual content,
  // not the wrapper's whitespace.
  const isContain = objectFit === "contain";
  const fitClass = isContain ? "object-contain" : "object-cover";
  const imgRadiusClass = isContain ? "rounded-[clamp(20px,4vw,40px)]" : "";
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
            unoptimized={unoptimized}
            style={{ ...(blend ? { mixBlendMode: blend as React.CSSProperties["mixBlendMode"] } : {}), height: "auto" }}
          />
        ) : isContain ? (
          // Flex-centered, height-driven sizing so the img element matches
          // the actual visible image dimensions and the radius rounds those
          // edges (not the wrapper's whitespace).
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={src}
              alt={alt}
              width={1000}
              height={1000}
              sizes={SLOT_SIZES}
              className={`block max-w-full ${imgRadiusClass}`}
              unoptimized={unoptimized}
              style={{ height: "100%", width: "auto", ...(blend ? { mixBlendMode: blend as React.CSSProperties["mixBlendMode"] } : {}) }}
            />
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={SLOT_SIZES}
            className={fitClass}
            unoptimized={unoptimized}
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

export function DualImageBlock({ left, right, native, transparent, aspect, blend, matchHeight }: DualImageSection) {
  const sidePad = "md:px-[calc(100%/24)]";

  // matchHeight: pair a square image with something taller (e.g. mobile mockup)
  // without letting the taller one blow up the row. Forces both slots to
  // aspect-square; both use object-contain so portrait images scale down to
  // fit (with whitespace) instead of being cropped. Square images render
  // identically with cover or contain, so this is safe regardless of which
  // side has the portrait mockup.
  const effectiveAspect = matchHeight ? "aspect-square" : aspect;
  const effectiveNative = matchHeight ? false : native;
  const fit: "cover" | "contain" | undefined = matchHeight ? "contain" : undefined;

  return (
    <section className={`w-full ${sidePad} ${transparent ? "py-1" : "py-4"}`}>
      <SwipeRow className="" cardFraction={0.88}>
        {[
          <ImageSlot key="l" {...left} native={effectiveNative} transparent={transparent} aspect={effectiveAspect} blend={blend} objectFit={fit} />,
          <ImageSlot key="r" {...right} native={effectiveNative} transparent={transparent} aspect={effectiveAspect} blend={blend} objectFit={fit} />,
        ]}
      </SwipeRow>

      <div className={`hidden md:grid grid-cols-2 ${transparent ? "gap-8" : "gap-4"}`}>
        <ImageSlot {...left} native={effectiveNative} transparent={transparent} aspect={effectiveAspect} blend={blend} objectFit={fit} />
        <ImageSlot {...right} native={effectiveNative} transparent={transparent} aspect={effectiveAspect} blend={blend} objectFit={fit} />
      </div>
    </section>
  );
}
