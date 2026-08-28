/* ── The index cell contract ─────────────────────────────────────────
 *
 * ONE DEFINITION OF WHAT A CELL IS, for the two surfaces that draw the
 * work grid: the homepage, built imperatively by pressingHomeDriver.js,
 * and the ring in the footer of every other page, rendered by
 * PressingRing.tsx.
 *
 * WHY THIS FILE EXISTS. scripts/port-home.mjs writes exactly two files
 * out of the lab: pressing-home.css and pressingHomeDriver.js. The
 * stylesheet is imported by three components; the driver by one. So a
 * lab change that pairs a new CSS rule with the class its dealer emits
 * — which is nearly every layout change — reached the homepage whole
 * and reached the ring as a rule matching nothing. The ring never broke
 * loudly, it just kept falling through to the old fallback, and
 * `npm run port:home:check` reported "port up to date" the entire time
 * because PressingRing is neither an input nor an output of the port.
 *
 * That is how five hooks went missing at once (colL/colR, ixcols, the
 * m-tier, `first`, and order) and left every left-hand frame in the
 * footer hanging off the middle gutter instead of the rule beside the
 * note rail.
 *
 * The same split cut-lines.ts and swatch-morph.ts already make: shared
 * MECHANISM lives in lib so it cannot drift; shared TASTE stays where
 * it belongs. This is mechanism.
 *
 * The values are the driver's own, copied from
 * pressingHomeDriver.js:2514-2528 rather than re-derived. If they
 * change in the lab, they change here — see PRESSING.md.
 */

/** Seven-cell cycle for the phone: a full-width frame, an even pair,
 *  two more full-width, then a third against two thirds. */
export const IX_M_RHYTHM = [
  "mHero",
  "mHalf",
  "mHalf",
  "mHero",
  "mHero",
  "mThird",
  "mTwoThirds",
] as const;

export interface CellSpec {
  /** the full class string for the .cell element */
  className: string;
  /** flat position, written to style.order — the phone dissolves .ixrow
   *  with display:contents, so the cells order themselves */
  order: number;
}

/**
 * What a cell at flat index `i` is called and where it sorts.
 *
 * @param i     flat position across the whole deal, not the position in its row
 * @param total how many frames the deal holds, for the last-frame guard
 */
export function cellSpec(i: number, total: number): CellSpec {
  /* Side is DEALT, not read off DOM position: a row whose right-hand
     partner ran out used to leave the survivor wearing the left
     column's alignment. Even indexes left, odd right. */
  const side = i % 2 === 0 ? "colL" : "colR";

  const slot = i % 7;
  /* A pair needs two. When the deal runs out on a slot that OPENS one
     (positions 1 and 5), the last frame would stand at a third or a
     half of the width with nothing beside it, which reads as a picture
     that failed to load rather than as a composition. */
  const opensPair = slot === 1 || slot === 5;
  const tier = opensPair && i === total - 1 ? "mHero" : IX_M_RHYTHM[slot];

  return {
    className: `cell ${side}${i === 0 ? " first" : ""} ${tier}`,
    order: i,
  };
}

/**
 * What the browser should fetch for a frame, given its phone tier and
 * its dealt share of the desktop row. Lifted from the driver's
 * tileSizes so the two surfaces request the same bytes for the same
 * picture; the ring previously hardcoded 30vw with a 760px breakpoint
 * against a layout that turns over at 860.
 */
const M_FRAC: Record<string, number> = {
  mHero: 1,
  mHalf: 0.5,
  mThird: 0.34,
  mTwoThirds: 0.67,
};

export function tileSizes(tier: string, share: number): string {
  const frac = M_FRAC[tier] ?? 1;
  /* Phone: the cell takes its fraction of a full-bleed track.
     Desktop: half the content column, times the frame's own share. */
  const phone = Math.round(frac * 92);
  const desk = Math.max(8, Math.round(share * 46));
  return `(max-width: 860px) ${phone}vw, ${desk}vw`;
}
