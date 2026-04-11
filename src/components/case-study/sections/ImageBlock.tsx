import type { ImageSection } from "@/lib/types";

const aspectMap: Record<string, string> = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  tall: "aspect-[3/4]",
  native: "",
};

export function ImageBlock({ src, alt, aspect = "video", bleed, bleedTop, maxWidth, noRadius, padded }: ImageSection) {
  const radius = noRadius ? "" : "rounded-[clamp(30px,5vw,100px)]";
  const sectionClass = bleed
    ? "bleed-image py-0"
    : bleedTop
    ? "bleed-top pt-0 pb-14"
    : padded
    ? "w-full py-6 px-4 md:px-[calc(100%/24)]"
    : "w-full py-6 px-4 md:px-0";
  return (
    <section className={sectionClass}>
      <div
        className={`${maxWidth ? "mx-auto" : "w-full"} ${bleed || bleedTop ? "" : `${aspectMap[aspect] || ""} ${radius}`} overflow-hidden ${aspect !== "native" && !bleed && !bleedTop ? "bg-surface-alt" : ""}`}
        style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className={`w-full ${bleed || bleedTop ? "h-auto" : aspect === "native" ? "h-auto" : "h-full object-cover"}`} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-alt to-border flex items-center justify-center">
            <span className="text-muted text-xs tracking-widest uppercase">{alt || "Image"}</span>
          </div>
        )}
      </div>
    </section>
  );
}
