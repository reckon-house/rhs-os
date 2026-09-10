# Columns

The engine reckon.house runs on. A corpus of pictures goes in, grouped
into studies and sitting on lines, and a board of columns comes out:
runs of work dealt sideways, a headline over each line that opens into
its list, a preview column for any study, a field that answers a
question. The site is the first house built on it.

This is the contract: what a corpus has to give Columns, what Columns
promises to do with it, and where the line between the engine and the
house still needs drawing.

## In one sentence

A corpus gives Columns **pictures in groups on lines**, and two text
files that say what is cut and where things sit. Columns deals it.

## What a corpus gives

### 1. Pictures

`window.BOARD_ITEMS`, written by `scripts/build-board-thumbs.mjs` into
`public/lab/board-data.js`. One entry per thumb:

```
{ t, w, h, g, c?, x?, r? }

t   the thumb's path, /lab/board-thumbs/<folder>/<stem>.webp
w h the size of THAT FILE, not the source. The file that ships is
    the size the board reasons about.
g   the group it belongs to: the study's folder, or "inspiration"
c   present on a cover only: its place in the site's own order
x   present on a picture that is off the field: cut, and thumbed
    anyway for its study's preview
r   the rungs that exist below the full file, [384, 768]
```

A picture's **key** is `t` without its prefix and extension:
`arc/arc-app-tablet-kitchen-living-room-lifestyle`. A cover's folder is
`hp/`. A picture below a study's top level keeps its path in the key
(`sally-os/heroes/sally-os-brand-brain-hero`) and exists only when the
order file names it.

**One item per key.** A study whose cover is also one of its plates
has two files behind one key; the field's own wins. Nothing depends on
a key being dealt once, since a key can be named twice.

### 2. Groups

`window.BOARD_GROUPS`, keyed by folder:

```
{ id, t, s, h, tags, d, sz, dr }

id    the study's id in projects.ts
t     its title
s     its category line, "Product design, engineering"
h     its route slug. Two studies keep pictures in a folder named
      differently from their route: sally-os is the drawer,
      /case-studies/sally is the door
tags  the lines it sits on
d     its description, two sentences split on " | "
sz    the rung its cover stands at on the live site, or null
dr    the cover's drift, or null
```

`tags` decides everything about where a study appears. Its narrowest
tag is its home unless the order file says otherwise.

### 3. Lines

`FILTERS` in the assembler, one tuple a line:

```
[label, tag, note]
["Apps", "app", "Native tools and AI products, built end to end."]
```

A study is on a line when its `tags` include the line's tag. Five of
the six are tags in `projects.ts`; `app` is a list in
`rail-categories.ts`, because it is the one shelf the corpus cannot
separate by tag. The sixth line, Staples, lists no studies: its run is
the pulls, every picture with `g: "inspiration"`.

The same six live in `rail-categories.ts` with their id lists, and
`npm run lines:sync` writes the board's answer into them so the rail,
the study bar and the board's heads count the same studies.

### 4. The order file

`scripts/lib/board-order.txt`. Sections by run, one key a line:

```
# open   # digital   # app   # creative   # branding   # interiors
# staples   # off   # homes
```

Rules, in the order they bite:

- A key named under a run is **dealt there**, cut or not. This is how a
  study shows on a line the cut left it nothing for.
- The first run that names a key is where it is dealt. Naming it again
  in another run deals a **second copy** there. Deliberate, and it
  reads as deliberate: the key is in the file twice.
- `# off` holds a field picture off the board without cutting it. It
  still opens in its study's column.
- `# homes` is a study's lines, home first:
  `arc = app, digital, branding`. It replaces the study's tags on the
  board, and `lines:sync` writes it back into the app.
- Anything unnamed takes the deal's own order: studies in site order,
  a cover before its own pictures, pictures in the data file's order.
- A cover in the first six is in the opener unless named elsewhere.

`public/lab/board-order.json` is the same file as data, so the sheet
opens on what the board is dealing.

### 5. The skip list

`scripts/lib/board-skip.txt`, one source file a line with its
extension, and a note:

```
arc/arc-logo-grid.png   # marked by eye, 9 Sept 2026
```

Cut means off the field. A cut picture the study presents itself with,
its hero or a full-width plate by `board-roles.json`, is thumbed anyway
at 1024 and marked `x`, so the preview column is the whole study while
the field stays the cut. Everything else cut is not thumbed at all.

### 6. Roles

`public/lab/board-roles.json`, from `npm run board:roles`, which reads
every `src/data/*-case-study.ts`:

```
{ at, roles: { "<folder>/<file>": "hero" | "plate" | "pair" | ... } }
```

What each picture does in its study. It feeds the sweep sheet's
suggestions, the preview tier, and the swap picker's candidates.

## What Columns promises

- A run opens on a fresh pair, and its head takes the row itself.
- A run is **spread, not poured**: at most `TALL_DEFAULT` tiles a
  column, the rows divided back over the pairs so the last is never a
  stub. A phone keeps its own count, since there a column is the page.
- Every picture on the field is dealt once per run that names it, and
  never twice in one run.
- A line's head counts what it opens: every study on the line, dealt
  there or not.
- Nothing is drawn larger than its pixels. A tile steps down the rungs
  rather than stretching, and a frame fetches the size it opens to.
- A cover stands at the rung the live site gives it. A piece the board
  draws stands at the rung and the box it is given.
- The field is the cut. A preview is the whole study, `x` or not.
- Off screen or with the tab hidden, nothing moves.
- A transparent picture is flattened onto the plate colour, unless the
  board draws around it (`KEEP_ALPHA`).

## Where it lives

| Thing | File | Command |
|---|---|---|
| The engine | `scripts/lib/assemble-board.py` → `public/lab/board.html` | `npm run board:page` |
| Pictures and groups | `scripts/build-board-thumbs.mjs` → `board-data.js`, `board-thumbs/` | `npm run board` |
| Roles | `scripts/board-roles.mjs` → `board-roles.json` | `npm run board:roles` |
| Lines, back into the app | `scripts/board-lines-sync.mjs` → `projects.ts`, `rail-categories.ts` | `npm run lines:sync` |
| What is cut | `public/lab/board-sheet.html` → `board-skip.txt` | by hand, then `npm run board` |
| Where things sit | `public/lab/board-order.html` → `board-order.txt` | by hand, then `npm run board:page` |
| The audit | `scripts/board-audit.mjs` → `board-audit.json` | `npm run board:audit` |

After a paste into `board-order.txt`: `npm run lines:sync`, then
`npm run board`. The builder thumbs whatever the file names.

## What the house still owns

These are baked into the engine and belong to reckon.house, not to
Columns. The line to draw next runs between them and everything above.

- `QUOTES`, the lines spaced through Staples
- `TILE_REEL` and `ALWAYS_REEL`, which covers cut
- `TILE_SPIN` and `KEEP_ALPHA`, the one picture the board draws around
- the notes in `FILTERS`, and the statement in the opener
- `board-shell.css`, the homepage's own stylesheet the board wears.
  Every class the engine invents is in the homepage's namespace, and
  `.answer` already collided once.
- the Ask: `/api/ask`, the facts index, the voice specimens

A second house would need its own of each. The engine should not have
to know which house it is in.
