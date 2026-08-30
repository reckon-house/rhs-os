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
 *
 * UPRIGHT, AND A WEIGHT UP. It was italic at 400, which is the
 * convention for a quotation and was the wrong call on this page:
 * everything around it is upright Avenir at 600, so the one italic
 * block read as a caption from another document rather than as a line
 * held up beside the pictures. 500 rather than the display 600 —
 * these are somebody else's words, and matching the site's own weight
 * exactly would put them in its voice. The quote marks do the quoting.
 *
 * The homepage deals the same tile when the Staples row is pressed
 * (.fd-quote in the home stylesheet, built by quoteCard in the lab).
 * One design on two surfaces: change the type here and change it
 * there.
 *
 * VERSE BREAKS WHERE IT WAS WRITTEN TO. Two of the three kept lines
 * are lyrics and carry their own breaks; the third is a paragraph of
 * prose. Under white-space: pre-line both looked the same and neither
 * read: a column this narrow wraps a lyric line as well as breaking
 * it, so "And this old man in front of / me wearing canes and ruby /
 * rings" showed three line ends and only the last one was the song's.
 * A reader cannot tell which is which, which is the whole information
 * a line break carries.
 *
 * So verse is set as verse. One block per written line, each with a
 * hanging indent, which is how a poem has been set in a narrow measure
 * for as long as there have been narrow measures: the written line
 * starts flush and anything that could not fit hangs under it. The
 * indent has to live on a block of its own — text-indent only ever
 * moves the FIRST line of a block, so pre-line and a hanging indent
 * cannot be combined. Prose gets neither: it had no breaks to protect,
 * and indented runovers on a paragraph read as a mistake.
 */

export interface InspirationQuoteTileProps {
  text: string;
  attribution: string;
}

export function InspirationQuoteTile({
  text,
  attribution,
}: InspirationQuoteTileProps) {
  const lines = text.split("\n");
  const verse = lines.length > 1;
  return (
    <div>
      <p className="text-[20px] md:text-[26px] leading-[1.35] tracking-[-0.02em] font-medium">
        {verse
          ? lines.map((line, i) => (
              <span
                key={i}
                className="block [text-indent:-1.1em] pl-[1.1em] empty:h-[0.6em]"
              >
                {i === 0 ? "\u201C" : ""}
                {line}
                {i === lines.length - 1 ? "\u201D" : ""}
              </span>
            ))
          : `\u201C${text}\u201D`}
      </p>
      {/* THE GAP IS INLINE BECAUSE A UTILITY CANNOT REACH IT. This was
          `mt-6` and computed to 0: pressing-home.css carries the lab's
          own `* { margin: 0 }` reset, unscoped by the port and
          therefore UNLAYERED, and an unlayered rule beats everything in
          @layer utilities. Every margin utility in the app is dead the
          same way (padding survives — the reset only touches margin).
          24px matches .fd-quote .qatt in the home stylesheet, which
          wins on specificity where a utility cannot. Do not put the
          class back without fixing the reset first. */}
      <p
        className="text-[10px] md:text-[11px] tracking-[0.04em] uppercase font-medium opacity-45"
        style={{ marginTop: 24 }}
      >
        &middot; {attribution}
      </p>
    </div>
  );
}
