# 07 · Agents

The shopper may never see the site. They ask ChatGPT, Gemini or Claude,
and the assistant reads or calls the store. The site has to be legible
to a fetcher and callable by a tool. Most of this is backend; the
front end's job is to say the same things in machine form.

## Three layers

### 1. Readable: the page says what it is

- Every product and look page carries JSON-LD: `Product`, `Offer` (price, currency, availability), `AggregateRating` and `Review` where reviews are licensed for it, `ImageObject` for frames. Same facts as the column's `facts`, one source.
- Server-rendered HTML for the things that matter (name, price, the words, the reviews). The board is a JavaScript page; fetchers that do not run scripts see nothing. Serve a plain HTML twin of each column at its own URL (`/p/<sku>`), which the board's address already implies (`?open=<id>`).
- `llms.txt` at the root: what the site is, the lines, and links to the plain pages. `robots.txt` that allows the assistants' fetchers (names change; check each one's current user agent) and a sitemap that lists the plain pages.
- Stable ids everywhere: the sku in the URL, the address, the JSON-LD and the tool responses, so an assistant can carry an id from one call to the next.

### 2. Callable: a read API, described

- `GET /api/products?q=&line=&tag=` search, `GET /api/products/<sku>` one product with its words, price, availability, images, `GET /api/products/<sku>/goes-with`, `GET /api/products/<sku>/reviews`, `GET /api/looks/<id>`. JSON, no session, cacheable, rate-limited like the Ask.
- An OpenAPI document at `/api/openapi.json`. Assistants that accept an API description (and people writing agents) read it directly.
- `POST /api/cart` builds a cart from skus and returns a link the shopper can open; the assistant never checks out.

### 3. Connectable: an MCP server

MCP is the protocol Claude, ChatGPT and Gemini connect tools with;
Jeremy has shipped one already (Dallas Sport Collective's booking, with
OAuth consent, in the DSC study). The store's server exposes the read
API as tools plus the cart:

```
search_products(query, line?, tag?)      → skus with name, price, availability, one image
get_product(sku)                          → the product in its own words, facts, reviews (licensed), images
complete_the_look(sku)                    → skus that go with it, with why
reviews_for(sku, n?)                      → quotes with source and rating
build_cart(skus[], variants?)             → a cart link to open on the site
```

Rules that keep it honest:

- Tools return the same facts the page shows, from the same data. No tool-only claims.
- Every tool result names its source; a review comes with `src`.
- No writes beyond the cart link. OAuth only if a shopper's account is involved; the demo needs none.
- One server, published once, connectable from all three assistants; the marketing is "connect the store" with the URL. Per-platform packaging (a ChatGPT app listing, a Gemini extension) is a wrapper on the same server; check each platform's current rules when the demo is ready, they move.

## Discovery

The plain pages, the JSON-LD and `llms.txt` are what get the store
cited when someone asks an assistant a question the store answers.
The MCP server is what gets the store *used* once connected. Do the
first layer even if the third never ships.

## What the front end does

Renders the same data the API serves, and writes the address so a
state an assistant hands back (`?open=`, `?at=`, `?cart=`) opens the
row exactly. Nothing in the board needs to know an agent exists.
