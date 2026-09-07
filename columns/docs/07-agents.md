# 07 · Agents

The shopper may never see the site. They ask ChatGPT, Gemini or Claude,
and the assistant reads or calls the store. The site has to be legible
to a fetcher and callable by a tool. Most of this is backend; the
front end's job is to say the same things in machine form.

## Three layers

### 1. Readable: the page says what it is

- Every product and look page carries JSON-LD: `Product`, `Offer` (price, currency, availability), `AggregateRating` and `Review` where reviews are licensed for it, `ImageObject` for frames. Same facts as the column's `facts`, one source.
- Server-rendered HTML for the things that matter (name, price, the words, the reviews). The board is a JavaScript page; fetchers that do not run scripts see nothing. Serve a plain HTML twin of each column at its own URL (`/p/<sku>`), which the board's address already implies (`?open=<id>`).
- `robots.txt` that allows the Agent-class fetchers you want, Content Signals, and a sitemap that lists the plain pages. `llms.txt` is optional: 97% of the files Ahrefs studied got no requests, and Google says it is not needed (00-landscape §2).
- A product feed with live price and stock: ACP's nine fields (item_id, title, description, url, brand, seller_name, image_url, availability, price), refreshed at least daily, or Merchant Center with `native_commerce`. The feed, the schema and the page must agree.
- Stable ids everywhere: the sku in the URL, the address, the JSON-LD and the tool responses, so an assistant can carry an id from one call to the next.

### 2. Callable: a read API, described

- `GET /api/products?q=&line=&tag=` search, `GET /api/products/<sku>` one product with its words, price, availability, images, `GET /api/products/<sku>/goes-with`, `GET /api/products/<sku>/reviews`, `GET /api/looks/<id>`. JSON, no session, cacheable, rate-limited like the Ask.
- An OpenAPI document at `/api/openapi.json`, listed at `/.well-known/api-catalog`. Assistants that accept an API description (and people writing agents) read it directly.
- The discovery manifests: `/.well-known/ucp` (Google's Universal Commerce Protocol: catalog, cart, checkout handlers) and `/.well-known/mcp/server-card.json`. Cloudflare's Agent Readiness Score checks for both.
- `POST /api/cart` builds a cart from skus and returns a link the shopper can open; the assistant never checks out.

### 3. Connectable: an MCP server

MCP is the protocol Claude, ChatGPT and Gemini connect tools with;
Jeremy has shipped one already (Dallas Sport Collective's booking, with
OAuth consent, in the DSC study). Every Shopify store now exposes one
by default, so its tool names are the vocabulary agents already know;
use them where the meaning matches. One stateless Streamable HTTP
endpoint at `https://store/mcp`:

```
search_catalog(query, line?, tag?)       → skus with name, price, availability, one image     readOnlyHint
get_product(sku)                          → the product in its own words, facts, reviews, images readOnlyHint
complete_the_look(sku)                    → skus that go with it, with why                      readOnlyHint
reviews_for(sku, n?)                      → quotes with source, rating, verified, date          readOnlyHint
create_cart(skus[], variants?, key)       → a server-minted cart handle and a checkout URL      idempotent, no payment
```

Rules that keep it honest:

- Tools return the same facts the page shows, from the same data. No tool-only claims.
- Every tool result names its source; a review comes with `src`.
- No writes beyond the cart link. OAuth only if a shopper's account is involved; the demo needs none.
- One server, three doors, as of Sept 2026. Claude's directory: prove ownership of the domain and the API, OAuth 2.0 if any tool is authenticated, annotations on every tool, a privacy policy, a test account and three prompts; software that executes financial transactions is banned, which is why create_cart returns a link and never pays. ChatGPT's plugins: a challenge token at `/.well-known/openai-apps-challenge`, HTTPS, readOnlyHint/destructiveHint/openWorldHint on every tool, test prompts, a privacy policy; checkout plugins are approved partners only. Gemini: no public listing path; AI Ultra users paste the URL in Gemini Spark. Rules move; 00-landscape has the dates.
- Test the server against Anthropic's open-source commerce-agents before any listing: it searches, compares, carts and hands off to the host's checkout, which is exactly the flow.
- The spec is stateless since 2026-07-28: no sessions, `ttlMs` on the tool list, a fixed tool order.

## Discovery

The feed, the plain pages and the JSON-LD are what get the store
cited when someone asks an assistant a question the store answers;
cosmetics pages score 68% LLM-readable in Adobe's index, so the plain
twin is not optional. The MCP server is what gets the store *used*
once connected. Do the first layer even if the third never ships.

## At the edge

Verify Web Bot Auth signatures (RFC 9421) and rate-limit per agent;
Cloudflare's AI traffic classes (Search, Agent, Training) and its
default blocks from 15 Sept 2026 decide what reaches an unconfigured
store, so configure it: allow Agent and Search, decide on Training.

## What the front end does

Renders the same data the API serves, and writes the address so a
state an assistant hands back (`?open=`, `?at=`, `?cart=`) opens the
row exactly. Nothing in the board needs to know an agent exists.
