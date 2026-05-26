/**
 * InspirationQuoteTile — text-only tile that drops into the inspiration
 * masonry alongside images. No background, no container. The words float
 * directly on the page cream in the project's primary UI dark, same as
 * every other body type. Height is content-driven by the quote length.
 */

export interface InspirationQuoteTileProps {
  text: string;
  attribution: string;
}

export function InspirationQuoteTile({ text, attribution }: InspirationQuoteTileProps) {
  return (
    <div className="py-4 md:py-6">
      <p className="text-[20px] md:text-[26px] leading-[1.35] tracking-[-0.01em] font-normal italic text-[#141414] whitespace-pre-line">
        &ldquo;{text}&rdquo;
      </p>
      <p className="text-[10px] md:text-[11px] tracking-[0.14em] uppercase font-medium mt-6 text-[#141414]/60">
        — {attribution}
      </p>
    </div>
  );
}
