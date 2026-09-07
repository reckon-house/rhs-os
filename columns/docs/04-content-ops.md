# 04 · Content operations

## Thumbs

`npm run board` = `scripts/build-board-thumbs.mjs` then `board:page`.
The builder walks `public/case-studies/<slug>/`, writes a 1536px webp
(quality 72) plus 768 and 384 rungs, records the thumb's own size, and
writes `board-data.js` and `board-copy.json`. `--force` re-encodes
everything. Rule from CLAUDE.md that the deal enforces: native width
÷ DPR is the largest honest CSS width, so a small file lands small.

## The sweep

Not every picture stands on its own. `npm run board:audit` measures
every tile behind the data (native size, transparent pixels, ratio)
into `public/lab/board-audit.json` and flags tiny (<600px), tall
(≥1.9:1, the tile crops it), wide (≥2.4:1). `/lab/board-sheet.html`
lays every tile out with the flags; a press marks it; Copy list gives
`<slug>/<file>` lines for `scripts/lib/board-skip.txt`, which the
builder honours. Inline `#` notes are allowed. First pass on
reckon.house left 93 of 543 out. A PNG on transparency is not a reason
to drop: the builder flattens it onto the container colour.

## Reels

The rail's rows and the covers play a sizzle: eight frames cut fast,
stills fetched when the reel first runs. `framesFor(tag)` picks a
line's covers by their site order. For products: eight packshots or
lifestyle frames per category.

## Sizes that matter

- A column's content width is `COL`; a tile is dealt at a share of it and capped at 1.6 × its width in height.
- The phone's head band is 48px; the desktop's is 46 under the 50px cover air.
- The bar is `--nav` (54px) plus the safe area on a phone.
