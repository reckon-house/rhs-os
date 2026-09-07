# 06 · The Sally demo

The aim is a demo of what commerce could look like: a row that starts
wide and narrows as the shopper talks to it, with the evidence beside
the thing, ending at a curated cart. Built in the sally-portal repo on
Sally's data, behind the portal's login. Patterns travel out; data,
voice and IP stay in Sally's repo, as with the sizzle reel port.

## The thin slice, first

One funnel end to end, real data, nothing else:

1. Line: Color. The field dealt from Color's products and looks.
2. A category column: "Toners", the products that carry the tag, as rows.
3. A product column in its own words (PDP Copy Studio), three reviews as quote tiles with source and rating, price and availability in the facts.
4. A complete-the-look column: `goesWith` from the embeddings (`search_skus_by_look`), three items.
5. The cart column: the items, a total, and one link out to sallybeauty.com. No checkout.
6. The Ask: "what's the best toner for brassy blonde" answered by Jim, and the columns opening under it.

Everything in the package is exercised once. Then widen.

## The one design decision

The row grows; a funnel narrows. Decide before building step 2:

- **Fold.** Earlier columns fold to chips in the rail's path (the path already lists them); the row keeps only the last two open. Cheapest, keeps the address whole.
- **Replace.** A narrowing replaces its parent's siblings; going back is a door in the mark's family. Reads more like a funnel, loses the side-by-side.
- **Both, by kind.** Categories replace, products and evidence stand beside. Probably right; costs a rule per kind.

Mock it in a lab strip like the others (`lab/*-variants.html`) before choosing.

## Evidence and rights

Every review, post and pull carries `src.licence`. Bazaarvoice has an
API and terms; Reddit, YouTube and X have terms for scraping. The
engine shows what it may and names the source on the tile. Decide the
sources with someone who can sign for them.

## Models, by job

- Verbs: no model, the client regex.
- Answers: Jim (the portal's routing), in Sally's voice, from product knowledge (`knowledge/products/*.md`) and PDP copy.
- Look matching: the embeddings, not a language model.
- Images: none generated in the demo; packshots and lifestyle only.

## Order and rough size

Config out of the assembler (05 §1), half a day. Adapter over Supabase
and the DAM, one to two days depending on how clean the product data
is. Ask hand-off to Jim, half a day. Cart column and address, half a
day. Hosting at `sally-portal/columns/`, half a day. Sweep on the
sheet, an afternoon. Then the narrowing rule, which is design time,
not code time.
