# Columns

The board engine as a package: a deal of columns over any corpus, with
a peek, standing rules, a count, an address, and an Ask that opens
columns from a sentence. Built for reckon.house; written down here so
it can be carried to another project and stood up on other data.

`npm run columns:pack` copies the engine's source files, an example
build and these docs into `columns/package/` (ignored by git). Move
that folder to the other repo and read the docs in order.

## What is in the package

| Piece | Files | Doc |
|---|---|---|
| The assembler and the page it builds | `scripts/lib/assemble-board.py`, `public/lab/pressing-home.html` (three blocks are lifted from it), `public/lab/board-shell.css`, `public/lab/field/base.css` | 01 |
| The data a site is built from | `public/lab/board-data.js`, `public/lab/board-copy.json`, thumbs | 02 |
| The Ask | `src/app/api/ask/route.ts`, `src/lib/ask-context.ts`, `src/lib/voice-tells.ts`, `scripts/ask-bench.mjs` | 03 |
| Content operations | `scripts/build-board-thumbs.mjs`, `scripts/board-audit.mjs`, `public/lab/board-sheet.html`, `scripts/lib/board-skip.txt`, `scripts/build-facts.mjs` | 04 |
| What is welded to the house, and how to unweld it | | 05 |
| The Sally demo, in order | | 06 |
| Agents: MCP, discovery, the read API | | 07 |

## The one idea

A row of modules. The field is the corpus dealt into columns, each a
scroller of its own. Anything that answers a question, a study, a
shelf, a room, stands as a column anchored after whatever asked for
it, and the row pages one module at a time. Nothing is a block: a
column opened from the far end of the row stands at the far end, and
only what is right of it moves. The address carries the whole row.

## Reading order

1. `docs/01-engine.md`, so the row model is in your head before any code.
2. `docs/02-data-contract.md`, the shapes the engine reads and the ones the demo adds.
3. `docs/05-unwelding.md`, the list of what to make config before the second site.
4. `docs/06-sally-demo.md`, the thin slice and its order.
5. `docs/03-ask.md`, `docs/04-content-ops.md`, `docs/07-agents.md` as each comes up.

Line numbers in the docs are from 7 September 2026 and will drift;
function names will not.
