# 05 · What is welded to the house

The engine is general; the house is not. Before the second site, each
of these becomes config or an adapter. Pointers are into
`scripts/lib/assemble-board.py` unless said otherwise.

| What | Where | Becomes |
|---|---|---|
| The mark, `Reckon*House`, and its lines | markup near `#coverline` / `#nav`; `FILTERS` (~3967: label, tag, note) | `site.mark`, `site.lines[]` |
| The statement and the ask tail | `STATEMENT_LEAD` (~1275), `ASK_TAIL` (~1327) | `site.statement`, `site.askTail` |
| The tour's typed phrases | `tourFull` and its list | `site.tour[]` |
| The rooms, Info and Connect | `openHouseColumn` (~3268), the footer source read by the thumb builder | `site.rooms[]` with copy |
| "Full case study" and `/case-studies/<h>` | `openStudyColumn` (~3601), `hrefOf` | `site.itemLink(group)` |
| `predictNext` | ~2461, study order from the site | a relation on the group (`next`, `goesWith`) |
| The verbs' shelf words | `shelfByText` (~2638) reads the rail's rows | derived from `site.lines` |
| The Ask's endpoint and voice | `askHouse` (~2889) posts to `/api/ask`; `ask-context.ts` SYSTEM | `site.ask.url`; the prompt per site |
| The daybook in the prefix | `DAYBOOK_TEXT` | off, or a site's own news |
| `/api/book` and its lede | `openHouseColumn("connect")`, `board-copy.json` `house` | off |
| The trail log | `trailLog` | keep, it is generic |
| The seed | `?seed=` (~1104) | keep |
| The lifted blocks | `pressing-home.html` reel, burn, transition | the package carries a copy; the lab stays the spec here |
| Colours and type | `board-shell.css`, `field/base.css` tokens | `site.tokens` |

## The order

1. Read the config from one file (`columns.config.json`) at the top of the assembler and replace each constant above with a lookup. Build reckon.house from the config and diff `board.html` against the current build: it must be byte-identical except for the config's own values. That is the proof.
2. Write the data contract's adapter for the second site, producing the same three files and the thumbs.
3. Point the Ask at the second site's answerer.
4. Package: `board.html`, the data, the thumbs, `board-shell.css`, `field/base.css` as a static folder that serves from any host. The only server pieces are the Ask and whatever the cart calls.

## What not to carry

The phone-field decision, the naming, the rail's copy, the daybook,
the book. Those are this site's.
