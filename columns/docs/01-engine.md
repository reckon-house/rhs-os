# 01 · The engine

One file builds the page: `scripts/lib/assemble-board.py` (4,691
lines on 7 Sept 2026). It is a Python script that concatenates CSS,
markup and JavaScript strings into `public/lab/board.html`, lifting
three blocks verbatim from `public/lab/pressing-home.html` (the reel,
the burn, the page transition) so the lab stays the spec for those.
`board-shell.css` is the lab's stylesheet, lifted by the thumb builder.
Run `npm run board:page` after any edit to the assembler.

## Geometry

- `PHONE = innerWidth <= 760`. `VISIBLE = PHONE ? 1 : 2` columns on the glass, plus `PEEK = 0.2` of the next. `MOD_X = FIELD_W / (VISIBLE + PEEK)` is the module; `COL = MOD_X - GAP` is a column's content width. `PAGE = 1`: a turn moves one module.
- The field is dealt once (`deal(list, opts)`, ~1405) into `COLS` columns of tiles, a period `PW = COLS * MOD_X` wide, and repeats to the right for ever. The phone deals `rows: 7, stack: true, air: [48, 120]`; the desktop deals per pair of columns with fitted rows.
- A module has an index `u = period * COLS + c`. Every mounted field column is a `.fcol` scroller of the full dealt height (`mountCol`, ~2067), filled from its own scrollTop (`fillCol`, ~2106). `remount()` (~1923) keeps a window of columns mounted, one screen either side, and draws the standing rules, one per gutter.
- `TOP0` is the head band: `COVER_AIR + HEAD_BAND` (50 + 46) on desktop, 48 on a phone. The rules open at the burn band's foot on desktop, `--cover-air + --burn-foot`.

## Display index

Everything in the row is addressed by display index `d`. `atDisp(d)`
(~1746) returns `{u}` for a field module or `{col}` for an opened
column. `dispOf(c)` (~1739) is a column's place: its anchor `c.__after`
plus one plus the spans of the columns before it. `colIdx` is the
page's left edge; `pageTo(i)` (~1780) moves it, redraws the mark's
family, the gauges and the address.

## Columns that answer

`colNode(kind, caption)` (~2653) makes a `.ccol`: a sticky head with
the chip that names it and its close, a lead, a talk area for
questions asked from inside it, an ask line, a body. `insertColumn(c,
from, opts)` (~3027) anchors it after whatever asked (`opts.at` for a
module, `from` for a column), seats it in `ccols` in row order,
reshifts the field, redraws the path, and `reveal(c)` pages it onto
the glass into the last place (`dispOf + span - VISIBLE`).

Three openers: `openStudyColumn(folder, opts, from)` (~3601), one per
study, with the study's own words from `board-copy.json` and a Next
chip from `predictNext`; `openShelfColumn(tag, from, opts)` (~3538),
the studies that carry a tag, as rows; `openHouseColumn(kind, from,
opts)` (~3268), the rooms: Info and Connect. `askFrom(from, text,
opts)` (~3098) is the verb layer: "open all interiors", "close",
"show me the kitchen", otherwise a question, which `askHouse` (~2889)
sends to `/api/ask` with the matched studies' hrefs and lands in the
turn `sayIn` (~2803) pushed.

## What the glass says

- The standing rules: one `<i>` per gutter in `#rules`, panned with the plane. `dressRules()` (~2000) puts the depth of the column being read on the rule that closes it (a 2px ink segment, track from the first-tile line to the bar); a study column draws the gauge on its own edge because its paper stands on the rule.
- The count: `+N →` at the top right (`#more` on a phone, the cover line's meta slot on desktop), the columns past the edge, counted from the last field column on the glass.
- The mark's family (`markFamily`, ~3780): the open shelves' names beside the wordmark, the one in view bold, each a door (`reveal`).
- The address (`writeRow` / `standRow`, ~3747): `?open=` lists the row's columns (`folder`, `house:kind`, `shelf:tag`, each `@n` the module it is anchored after) and `?at=` names the page, a column's id or a module's 1-based number. Written on every page turn, applied after the row stands.

## The phone

Same row, one column and a fifth of the next. The bar sits at the
bottom with the field and the mark; the mark is the sheet's handle (the
slash glyph). Columns scroll in lock-step (`driver`). A question asked
in a column blurs the keyboard and seats the turn under the head. A
rotation reloads. `?debug=1` paints a yellow strip of state.

## Things that look like features and are rules

- A study opens once; asking for it again reveals the standing column.
- Answer columns are not written to the address; they are the record of a question.
- Nothing floats over the work. The head band and the rule are the two places the field keeps clear; anything else carries its own paper.
- The tile caps a picture's height at 1.6 × its width; tall captures get cropped, which is why the sweep drops them.
