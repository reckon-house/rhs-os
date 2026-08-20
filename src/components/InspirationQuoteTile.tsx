/**
 * InspirationQuoteTile — text-only tile that drops into the staples
 * masonry alongside pictures. No background, no container: the words
 * sit directly on the page's paper, which is what separates a quote
 * from a framed picture without giving it any chrome of its own.
 *
 * Colour is inherited rather than named. The board runs on .pressing
 * ink now, and the hardcoded #141414 here was the last of the old
 * page's palette — close enough to read as correct, wrong enough to
 * sit a shade off every other word on the page.
 *
 * The attribution's separator is a middle dot. It was an em dash, the
 * one mark the house style bans outright.
 */

export interface InspirationQuoteTileProps {
  text: string;
  attribution: string;
}

export function InspirationQuoteTile({
  text,
  attribution,
}: InspirationQuoteTileProps) {
  return (
    <div>
      <p className="text-[20px] md:text-[26px] leading-[1.35] tracking-[-0.02em] font-normal italic whitespace-pre-line">
        &ldquo;{text}&rdquo;
      </p>
      <p className="text-[10px] md:text-[11px] tracking-[0.04em] uppercase font-medium mt-6 opacity-45">
        &middot; {attribution}
      </p>
    </div>
  );
}
