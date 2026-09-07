# 03 · The Ask

`src/app/api/ask/route.ts` answers `POST { q, hrefs }` with `{ answer,
used, model }`. The client sends hrefs, never facts; the server
re-reads those studies from its own index. That is the trust model.

## The prompt

`src/lib/ask-context.ts`. `SYSTEM` is the voice: the grey-half rule in
Jeremy's words, the four shapes an answer may not carry (a tail, an
aphorism, a comparison, a not-not), the two-sentence rule, ten
before/after specimens. `SHELF` lists every study in one line each.
`DAYBOOK_TEXT` rides last. All three are the cached prefix; the
breakpoint is on the last block. `contextFor(hrefs)` builds the tail:
the picked studies' facts, and the first `WITH_TEXT` (3) of them in
their own words.

## Model, effort, cost

`claude-sonnet-5` at `effort: low`, both env-overridable
(`ASK_MODEL`, `ASK_EFFORT`, `ASK_WITH_TEXT`). Benched on
`scripts/ask-bench.mjs --set why` (twelve whys with their study's
href): Sonnet answered from the study's sentence where Haiku invented
a why; low effort cut output 17% and latency 12% with 0 flags and held
the first person. Measured 7 Sept 2026: prefix 11,270 tokens; a warm
answer about $0.007 (read $0.0023, tail ~1,700 tokens $0.0034, output
~130 tokens $0.0013); cold about $0.033. The five-minute TTL is right:
a read refreshes it at no cost, so a burst pays one write. The
throttle (15/min and 60/day per address, 2,000/day in all) bounds a
day near $15. `usage` is logged on every call: `[ask] <model> in=
cache_read= cache_write= out= voice= effort= text=`. If `cache_read`
sits at zero on warm calls, a silent invalidator is in the prefix.

## The net

`src/lib/voice-tells.ts` is one list of shapes shared with the copy
lint. The route reads it over the answer; a flagged sentence gets one
retry on the same cached prefix with the sentence quoted and its shape
named; if it still trips, the flagged sentences are cut. Logged as
`voice=clean|retried|trimmed|flagged`.

## For the demo

The board does not care who answers. Put a router in front:

- verbs (`open`, `close`, `show all <line>`) stay in the client regex, no model;
- questions go to the site's model in the site's voice, Sonnet 5 here, Jim in the portal;
- "complete the look" and "what goes with this" go to the embedding search, not a language model;
- the same `{ q, hrefs }` request shape, the same `{ answer, used }` response, so `sayIn` lands whatever comes back.

The voice net is Reckon House's voice; Sally's voice needs its own
tells, or none. Keep the mechanism, swap the list.
