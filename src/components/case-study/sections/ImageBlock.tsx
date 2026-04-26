import Image from "next/image";
import type { ImageSection } from "@/lib/types";

const aspectMap: Record<string, string> = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  tall: "aspect-[3/4]",
  native: "",
};

// Default `sizes` hint — matches the case-study article max-width plus a sensible
// fallback for the rare reader on a 4K display.
const DEFAULT_SIZES = "(min-width: 1280px) 1100px, 100vw";

export function ImageBlock({ src, alt, aspect = "video", bleed, bleedTop, maxWidth, noRadius, padded, blend }: ImageSection) {
  const radius = noRadius ? "" : "rounded-[clamp(30px,5vw,100px)]";
  const sectionClass = bleed
    ? "bleed-image py-0"
    : bleedTop
    ? "bleed-top pt-0 pb-14"
    : padded
    ? "w-full py-6 px-4 md:px-[calc(100%/24)]"
    : "w-full py-6 px-4 md:px-0";

  // Native-aspect images keep their natural ratio; everything else uses a fixed
  // aspect container with the image filling via object-cover.
  const isNative = aspect === "native";
  const sizes = maxWidth ? `${maxWidth}px` : DEFAULT_SIZES;

  return (
    <section className={sectionClass}>
      <div
        className={`${maxWidth ? "mx-auto" : "w-full"} ${bleed || bleedTop ? "" : `${aspectMap[aspect] || ""} ${radius} overflow-hidden`} ${aspect !== "native" && !bleed && !bleedTop ? "bg-surface-alt" : ""} ${!isNative && !bleed && !bleedTop ? "relative" : ""}`}
        style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
      >
        {src ? (
          isNative || bleed || bleedTop ? (
            // Native aspect — use width/height as ratio hint, render at intrinsic size.
            <Image
              src={src}
              alt={alt}
              width={2400}
              height={1600}
              sizes={sizes}
              className="w-full h-auto"
              style={{ ...(blend ? { mixBlendMode: blend } : {}), height: "auto" }}
            />
          ) : (
            // Fixed aspect — fill the parent with object-cover.
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              className="object-cover"
              style={blend ? { mixBlendMode: blend } : undefined}
            />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-alt to-border flex items-center justify-center">
            <span className="text-muted text-xs tracking-widest uppercase">{alt || "Image"}</span>
          </div>
        )}
      </div>
    </section>
  );
}
