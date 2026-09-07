# 06 · The Sally demo

The aim is a demo of what commerce could look like: a row that starts
wide and narrows as the shopper talks to it, with the evidence beside
the thing, ending at a curated cart. Built in the sally-portal repo on
Sally's data, behind the portal's login. Patterns travel out; data,
voice and IP stay in Sally's repo, as with the sizzle reel port.

## What the research says (00-landscape §4 and §6)

Sephora and Ulta are already inside Google's agentic checkout and
have their own assistants; Sally's public record has no agent
presence, e-commerce at 12% of sales growing 28%, BOPIS as most app
orders, Licensed Colorist OnDemand at 5,200 consults a week with those
customers spending 80% more, and a TikTok Shop since March. Beauty
shoppers verify before buying, ask in their own words and want a
routine back, and finish on the retailer. So the demo opens on a
hair-colour question typed the way a Sally customer says it (colour is
where Sally has depth and where the peers' agent flows are thin),
shows reviews beside the product in the first frame, and closes with
the cart handing to sallybeauty.com with pickup and rewards visible.

## The thin slice, first

One funnel end to end, real data, nothing else:

1. Line: Color. The field dealt from Color's products and looks.
2. A category column: "Toners", the products that carry the tag, as rows.
3. A product column in its own words (PDP Copy Studio), three reviews as quote tiles with source and rating, price and availability in the facts.
4. A complete-the-look column: `goesWith` from the embeddings (`search_skus_by_look`), three items.
5. The cart column: the items, a total, and one link out to sallybeauty.com. No checkout.
6. The Ask: "what's the best toner for brassy blonde" answered by Jim, and the columns opening under it.
7. The agent layer, thin: a feed of the demo's products, JSON-LD on the plain twin of each column, and the five-tool MCP server pointed at the same data, tested against Anthropic's commerce-agents. The demo is then both the page a shopper sees and the page an agent lands on.

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

## Jim is the brain

Noted 7 Sept 2026, so it is not lost. Jim (the portal's routing and
knowledge) already holds Sally's persona data. The loop the demo
should be built to close:

1. The persona: what Jim knows about the kind of shopper (the
   portal's personas, the market, industry and trend signals it
   already gathers per persona).
2. The user: what a specific shopper does and says on the row, the
   questions, the columns opened, the cart, and, with consent and an
   identity link, their history and rewards.
3. Back to the user: recommendations shaped by the persona's trends
   and the person's own behaviour, in the same columns: what to open
   next, the complete-the-look, the reviews to surface first.

So the Ask's request grows a third input, `{ q, hrefs, who }`, where
`who` is a persona id and, once linked, a user id, and Jim answers
with both in hand. The board carries `who` in memory only; the data
never leaves Sally's repo. The peers lean the same way (Ulta over 46M
profiles, Sephora's Beauty Insider link in ChatGPT), and the research
draws the boundary: identity linking by OAuth, for personalisation
and loyalty only, never for payment.

## Order and rough size

Config out of the assembler (05 §1), half a day. Adapter over Supabase
and the DAM, one to two days depending on how clean the product data
is. Ask hand-off to Jim, half a day. Cart column and address, half a
day. Hosting at `sally-portal/columns/`, half a day. Sweep on the
sheet, an afternoon. Then the narrowing rule, which is design time,
not code time.
