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
dup present on a picture the study's COVER already is: the preview
    shows one of them, and the cover is the one that stands
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
# staples   # off   # homes   # heroes   # twice
```

Only a header naming one of those switches the section. Every other
`#` line is a note, and that is not a nicety: both parsers took ANY
`#` line for a header once, so a note written under `# heroes`
emptied the section in the thumb builder without a word.

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
- `# heroes` is one picture a run, `creative = ivy-park/ivy-signage`.
  Its shape decides its form. A portrait leads the run in a column of
  its own beside the head, cut to the screen's height rather than its
  own ratio, nothing beneath it, and the column does not scroll; on a
  phone it is its own page, the one after the head's. A landscape
  spans the pair under its head, cut to the height the screen leaves
  there, the pair holds nothing else and the rule between its two
  columns is not drawn; on a phone, which has no pair, it leads the
  run at its own ratio. Named, so it is dealt on that run whatever
  the cut says, and a landscape hero is thumbed at 2048 rather than
  the master's 1536, since it paints across two columns.
- `# twice` names a picture the study's cover already is, where the
  pixels cannot see it: the preview skips it. The builder finds most
  of them itself (below); this is for a cover that is a tight crop of
  a wide shot, which measures as a different picture because it is
  framed as one.
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
  draws stands at the rung and the box it is given. A hero stands at
  the full column and the screen's height.
- The field is the cut. A preview is the whole study, `x` or not, but
  for the picture its cover already is. Most covers are the study's
  own hero cropped for the homepage grid — twenty-two of twenty-nine —
  so a preview used to open on the same photograph twice, one under
  the other. The builder compares a 16x16 greyscale of the cover
  against each of the study's pictures and marks anything under a mean
  difference of 20 per pixel: the corpus splits at 17.7 against 23.8,
  the nearest picture that is genuinely a different shot, and the run
  prints what it marked. `# twice` names the ones it cannot see.
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
| The house | `scripts/lib/board-house.json` → `window.BOARD_HOUSE`, the head, `keepAlpha` | read by both builds |

After a paste into `board-order.txt`: `npm run lines:sync`, then
`npm run board`. The builder thumbs whatever the file names.

## What the house owns, and where it lives

`scripts/lib/board-house.json`. Everything in the engine that is
reckon.house's rather than Columns' is read from this one file, and
the engine never names the house itself:

```
name, mark, markHtml, email, shell
head        title, description, canonical, og image and alt, icons
index       the plain index's intro and tail links
statement   the opener's lead (HTML), the ask placeholder, the longest ask
tour        the questions the field cycles through
lines       the FILTERS tuples: label, tag, note
quotes      the lines spaced through Staples
reels       which covers cut (always, tiles)
spin        the polygon path and the one tile the board draws around
keepAlpha   the pictures the thumb builder must not flatten
marks       the credits' logos and their heights
news        the shipped items, and their one-line rail form
railNotes   the rail's Info and Connect rows ("@news" derives from news)
ask         the endpoint, the copy file, and the Ask's own sentences
```

The assembler injects it as `window.BOARD_HOUSE`, beside `BOARD_ITEMS`,
`BOARD_GROUPS` and `BOARD_ORDER`, and fills the head from it. The thumb
builder reads `keepAlpha` from the same file. A second house is a
second file; the engine does not change.

Two things are still the house's and not yet in the file:

- `board-shell.css`, the homepage's own stylesheet the board wears.
  Every class the engine invents is in the homepage's namespace, and
  `.answer` already collided once. `npm run board:css` now computes
  the rules the engine actually stands on, from its own class and id
  vocabulary against the shell, and writes them to
  `public/lab/board-engine.css`: 212 of the shell's 359 rules, with
  the font faces left out and the ten tokens a house must supply
  listed at the top (`--sans` among the faces). The names are still
  the homepage's; a prefix is the next step, and reckon.house still
  wears the whole shell until then. The assembler also lifts the reel,
  the burn and the rail from `public/lab/pressing-home.html` verbatim.
- The footer copy the Info and Connect rooms read (`board-copy.json`'s
  `house`: method, links, credits, book), which the thumb builder
  lifts from the app's own components. It is data already; it is not
  yet in the house file.
