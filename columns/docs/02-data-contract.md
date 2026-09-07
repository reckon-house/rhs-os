# 02 · The data contract

The engine reads three files and knows nothing about the portfolio. A
second site is a second build of the same three.

## Today

### `board-data.js`

Two globals. `window.BOARD_ITEMS`: one entry per tile.

```
{ t: "/lab/board-thumbs/<group>/<stem>.webp",   the thumb, 1536px wide at most
  w: 1536, h: 1124,                              the thumb's own size (ratio is load-bearing)
  g: "ivy-park",                                 the group (a study's folder)
  r: [384, 768],                                 the smaller rungs that exist
  c: 0 }                                         only on a cover: its order on the site
```

`window.BOARD_GROUPS`: one entry per group, keyed by folder.

```
{ id: "ivyPark", t: "Ivy Park by Beyoncé", s: "Digital design, brand launch",
  h: "ivy-park",                 the href under /case-studies/
  tags: ["digital", "creative"], the shelves it sits on
  sz: 0.43,                      the cover's width share on the live site
  dr: null,
  d: "The Ivy Park launch ... | Six weeks from moodboard to live, ..." }   lead | grey half
```

Groups come from `src/data/projects.ts` and `rail-categories.ts`,
parsed by the thumb builder. A folder with no group (e.g. `inspiration`)
is dealt as tiles without captions.

### `board-copy.json`

Keyed by folder, plus `house`. A study carries `facts` (k/v pairs shown
in the column), `paragraphs` (its own words, from the study's data
file), and what the sweep of the footer source found: method, links,
credits. `house` carries the rooms' copy and the /book lede.

### Thumbs

`public/lab/board-thumbs/<group>/<stem>.webp` with `@384` and `@768`
rungs. Generated and committed (1,284 files, 74 MB on 7 Sept 2026; `npm run
board` regenerates and the diff is committed). The builder flattens any
source with a transparent pixel onto `#EDE7E2`.

### The Ask's index

`src/data/generated/project-facts.json`, built by `npm run facts`: per
study, the facts, facets, frames and pulls, an abstract, and `text`,
the study's prose (cap 7,000 chars). The route reads it; the client
never sends facts, only hrefs.

## What the demo adds

Same shapes, new kinds. Keep the fields the engine already reads and
add these, so the assembler needs no new concepts, only new tile kinds
and one persistent column.

```
item:  { ..., kind: "frame" | "review" | "post" | "quote",
         src: { name, url, licence },        who it belongs to and what we may do with it
         rating: 4, of: 5 }                   reviews only

group: { ..., kind: "product" | "look" | "category" | "brand",
         sku, price, currency, availability,  products
         variants: [{ id, name, price }],
         goesWith: ["sku", ...],              the complete-the-look relation
         needs: ["sku", ...] }                what finishes the look

copy:  { <group>: { facts, paragraphs, reviews: [{ text, by, rating, src }], posts: [...] } }

cart:  { items: [{ sku, variant, qty }], total }   one column that never leaves the row; rides ?cart=
```

who:   { persona: "id", user?: "id" }          the Ask's third input; held in memory on the board, resolved by Jim

Rules that travel with the shapes:

- `src.licence` is required on every review, post and pull. The route already keeps Jeremy's frames apart from other people's pulls because the rights differ; evidence is the same problem. The engine shows what it is allowed to and says whose it is.
- A group's `d` stays `lead | grey half`: what it is, then why. That line is the column's first sentence and the Ask's shelf entry.
- Ratios are read from files, never declared. The deal seats by true ratio.

## Where the data comes from, per site

- reckon.house: `scripts/build-board-thumbs.mjs` (tiles, groups) and `scripts/build-facts.mjs` (the Ask's index) walk the repo.
- Sally: an adapter over the portal's Supabase and DAM. Products become groups, packshots and lifestyle frames become items, PDP Copy Studio's copy becomes `paragraphs`, categories become lines (the rail's filters), Bazaarvoice becomes `reviews`. The adapter writes the same three files and the thumbs; the assembler does not change.
