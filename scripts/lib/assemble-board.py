#!/usr/bin/env python3
"""Assemble public/lab/board.html from the homepage lab.

    npm run board:page

The board is the homepage opened in every direction, so it does not
own its own copy of the homepage: the rail's reel machinery and the
masthead's burn are LIFTED OUT OF public/lab/pressing-home.html here,
function for function, and the stylesheet is lifted by
build-board-thumbs.mjs. Tune the lab, re-run both, and the board
follows. Nothing about the homepage is retyped in the board.

The two blocks are found by their own first and last lines rather than
by line number, so an edit above them in the lab does not silently
lift the wrong code. If a marker moves, this fails loudly.
"""
import io, sys

lab = io.open("public/lab/pressing-home.html", encoding="utf-8").read().split("\n")

def block(first_pred, last_pred, what):
    try:
        a = next(i for i, l in enumerate(lab) if first_pred(l))
        b = next(i for i, l in enumerate(lab[a:], a) if last_pred(l))
    except StopIteration:
        sys.exit("assemble-board: could not find the %s block in the lab" % what)
    return "\n".join(lab[a:b + 1])

# the reel: SZ_CREAM through the close of szStart
sz_a = next(i for i, l in enumerate(lab) if l.strip().startswith("const SZ_CREAM"))
sz_s = next(i for i, l in enumerate(lab[sz_a:], sz_a) if l.strip() == "step();")
sz_e = next(i for i, l in enumerate(lab[sz_s:], sz_s) if l.rstrip() == "  };")
sz = "\n".join(lab[sz_a:sz_e + 1])

# the burn, its whole IIFE
burn = block(lambda l: "the burn, lifted from Masthead.tsx" in l,
             lambda l: l.rstrip() == "})();", "burn")

# the page transition: its constants through the close of playTransition
pt_a = next(i for i, l in enumerate(lab) if l.startswith("const PT = document.getElementById"))
pt_b = next(i for i, l in enumerate(lab[pt_a:], pt_a)
            if l.startswith("async function playTransition"))
pt_e = next(i for i, l in enumerate(lab[pt_b:], pt_b) if l.rstrip() == "}")
pt = "\n".join(lab[pt_a:pt_e + 1])
if len(pt.split("\n")) < 40:
    sys.exit("assemble-board: the transition block came back too short")

for name, body in (("reel", sz), ("burn", burn)):
    if len(body.split("\n")) < 20:
        sys.exit("assemble-board: the %s block came back too short" % name)

head = r'''<!doctype html>
<html lang="en" class="rh-home rh-cover">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>The board · lab</title>
<!--
  ── THE BOARD: the homepage, opened in every direction ──────────────
  The spec for the homepage's content region growing two axes. The
  brief, in the owner's words: keep everything — the rail, the burn
  bar, the statement, the columns' spacing — and expand the ability to
  scroll up and down and left and right.

  IT BORROWS THE HOMEPAGE RATHER THAN IMITATING IT. board-shell.css is
  the LAB's own <style> block, lifted verbatim by the generator, so the
  burn pill, the drawer rail's chip clip and 0.56s curve, the tile
  frame, the caption and the standing rules are the same objects with
  the same numbers — not a lookalike that drifts. The rail's reel and
  the masthead's burn are lifted the same way, function for function.
  Tune the lab, run `npm run board`, and this follows.

  TWO AXES, TWO TEMPERAMENTS:

    UP AND DOWN IS FREE. The columns scroll with momentum the way the
    homepage does, and the deal wraps, so there is no bottom.

    LEFT AND RIGHT IS PAGED. A drag or a sideways scroll brings in the
    NEXT column: it eases into place and snaps onto the grid, one
    module at a time. The structure is what keeps 544 pieces reading
    as an index rather than as weather.

  WHAT FILLS IT: every image from every study, captioned with that
  study's own name and category line; the board's pulls; the kept
  lines. The rail's five categories filter IN PLACE — the rest recedes
  to a ghost, so what you watch is subtraction, not a new page.

  MECHANISM
  - Nothing is measured for layout. build-board-thumbs.mjs records
    every file's ratio, so the field is computed before an image
    loads. Only tiles near the viewport exist.
  - Periodic in both axes; ?seed=N re-deals.
  - 384px webp thumbs. NEVER the plates: 388MB there, 7.8MB here.
-->
<link rel="stylesheet" href="board-shell.css">
<script src="board-data.js"></script>
<style>
  /* ── what the board adds to the homepage's own stylesheet ──────────
     Only geometry. Every treatment above this line is the lab's. */
  html, body { height: 100%; overflow: hidden; }
  body { background: #fff; }

  /* the masthead stops being sticky, because nothing scrolls */
  #nav { position: fixed; left: 0; right: 0; top: 0; }

  /* the rail: the homepage's note column, held on the left */
  #railwrap {
    position: fixed; z-index: 20;
    left: var(--gut); top: calc(var(--nav) + 26px);
    width: var(--ix-note-w, 180px);
  }

  /* the field: everything right of the rail's column */
  /* ── THE STRIP ────────────────────────────────────────────────────
     Everything right of the rail is one horizontal strip: the columns
     the conversation opens, then the field — the homepage, exactly
     what it is — as the last member, pushed right by every column
     that opens before it. The strip moves by transform, like the
     plane, so the two share a frame. */
  #strip {
    position: fixed; top: 0; bottom: 0; right: 0;
    left: calc(var(--gut) + var(--ix-note-w, 180px) + var(--ixgap));
    overflow: hidden;
  }
  #stripIn { display: flex; height: 100%; }
  /* ── ONE ROW ──────────────────────────────────────────────────────
     The conversation is not beside the field, it is IN it: a column
     stands in the field's own row of modules, right after whatever
     asked for it, and the work continues past it. One horizontal axis
     pans all of it. The columns' layer pans in X only, like the
     rules, since each column scrolls on its own; every tile right of
     a column's anchor carries a translate of one module per column
     standing before it, and that translate transitions, so the work
     slides aside in step with a column growing out and slides back
     as one folds. */
  /* THE LAYER IS NOT A SURFACE. Its columns are anchored across the
     whole row now, so their margins stretch this box over every module
     between the first and the last — 2318px of it, at z-index 4, over
     the work. It swallowed every hover and every click out there: a
     frame under it could not grow and could not be opened. The layer
     passes the pointer through; only the columns themselves take it. */
  #cols { position: absolute; top: 0; bottom: 0; z-index: 4;
    left: calc(var(--modw, 0px) - var(--gapx, 0px) / 2);
    display: flex; will-change: transform; pointer-events: none; }
  .ccol { pointer-events: auto; }
  /* a column stands on paper of its own: the work slides under it as
     it grows and must not show through */
  .ccol .cin { background: var(--paper, #fff); }
  .ccol { touch-action: pan-y; }
  /* NO GRAB HAND. The field reads as a page to scroll, not a canvas
     to haul: on a laptop a click-drag is the most awkward gesture
     available and the cursor was advertising it. Touch keeps the
     drag, because there it is the only gesture there is. */
  /* ── NOTHING IS PINNED; THE WHOLE STRIP MOVES ─────────────────────
     New things go rightward and everything already there slides left
     to make room, the intro included. Holding the intro in place was
     tried and was the wrong instinct: a page where one column is
     nailed down and the rest travel reads as two mechanisms, and the
     column being read should be the one in front of you rather than
     the one you started at. Scroll back for the intro; it is one
     module away. */
  #field {
    position: relative; flex: none; height: 100%;
    /* pan-y, because there is finally something for the browser to
       pan: each column is its own scroller. It was `none` while the
       field was one plane moved by hand, where a claimed vertical pan
       moved nothing at all and a swipe did nothing on a phone. The
       horizontal is still ours, through pointer events. */
    overflow: hidden; touch-action: pan-y;
  }

  /* ── A COLUMN ─────────────────────────────────────────────────────
     One module wide, scrolling on its own, its head scrolling with
     it. THE SWISS RULE: one size, one weight, one colour change. Every
     line in a column is set like the intro — the statement's size and
     weight, ink for the thing itself and grey for what is said about
     it — and nothing else: no labels, no pills, no small type. */
  /* ── A COLUMN IS A MODULE, OR TWO ─────────────────────────────────
     Everything about the row is already counted in modules — where a
     column stands, how far the work steps aside, what a page turn
     moves by — so a column two modules wide is one number, not a new
     idea. The width is what shifts the row: the flex line does the
     rest, and the same 0.5s that grows a column out of nothing grows
     this one sideways. */
  .ccol {
    flex: none; width: calc(var(--modw) * var(--span, 1)); height: 100%; position: relative;
    font-size: clamp(20px, 2.4vw, 32px); font-weight: 600;
    line-height: 1.2; letter-spacing: -0.05em;
    transition: width 0.5s cubic-bezier(0.2, 0.55, 0.2, 1), opacity 0.4s ease;
  }
  /* ── THE COLUMN'S RULE IS THE FIELD'S RULE ────────────────────────
     A border runs the height of the box, and the box starts at the top
     of the page, so the column drew a hairline up through the masthead
     while every standing rule in the field stops below it. Same line,
     same start: the rules layer opens at --cover-air and so does this.
     Off the border and into the box, it also stops eating the pixel
     that held the column's text one out from its module's edge. */
  .ccol::before { content: ""; position: absolute; left: 0; width: 1px;
    top: var(--cover-air, 50px); bottom: 0;
    background: rgba(0, 0, 0, 0.12); }
  /* ── A COLUMN GROWS OUT FROM BEHIND ITS NEIGHBOUR ─────────────────
     Arriving is the exact inverse of folding: the box opens from zero
     to one module while its contents stand still at full width behind
     the clip, so the column is revealed left to right as though it
     were sliding out from under the column before it — and everything
     to its right is pushed along as it grows. It used to fly in from
     off-screen right, which is a card being dealt onto a table rather
     than a column being made room for. */
  /* the rule is inside the box now, so the clip takes it as the box
     folds; it needed hiding by hand only while it was a border */
  .ccol.closing, .ccol.arriving { width: 0; opacity: 0; overflow: hidden; }
  .ccol .cin { height: 100%; width: calc(var(--modw) * var(--span, 1)); overflow-y: auto;
    scrollbar-width: none; scroll-behavior: smooth;
    padding: calc(var(--cover-air, 50px) + 46px) calc(var(--gapx, 20px) / 2) 90px; }
  .ccol .cin::-webkit-scrollbar { display: none; }
  .ccol .g { color: rgba(0, 0, 0, 0.42); }
  /* ── EVERY COLUMN HAS THE INTRO'S ANATOMY ─────────────────────────
     Chips, a sentence, what was asked and what came back, the field,
     then the column's own material. The intro reads "I make things…
     Or just ask me:" and a study now reads the same way, so the
     conversation and the homepage are one kind of thing rather than
     two. The chips are the rail's chips — same grey, same radius,
     same 13px — moved inside the column, which is also the only path
     a phone has once the rail is gone. */
  .ccol .chead { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1.1em; }
  .ccol .cchip { display: inline-flex; align-items: baseline; gap: 8px;
    max-width: 100%; background: rgba(0, 0, 0, 0.045); border: 0; border-radius: 12px;
    padding: 8px 12px; margin: 0; text-align: left; color: inherit; font: inherit;
    font-size: 13px; font-weight: 500; letter-spacing: -0.01em; line-height: 1.45;
    transition: background-color 0.3s ease; }
  button.cchip { cursor: pointer; }
  button.cchip:hover { background: rgba(0, 0, 0, 0.09); }
  .ccol .cline { display: block; width: 100%; border: 0; outline: 0; background: none;
    padding: 0; margin: 0; font: inherit; letter-spacing: inherit; color: inherit;
    text-decoration: underline; text-decoration-color: transparent;
    text-decoration-thickness: max(1px, 0.05em); text-underline-offset: 0.15em;
    transition: text-decoration-color 0.3s ease; }
  .ccol .cline::placeholder { color: var(--ink); opacity: 1; }
  .ccol .cline:focus { text-decoration-color: var(--ink); }
  .ccol .cline:focus::placeholder { color: rgba(0, 0, 0, 0.42); }
  /* the close travels inside the chip that names the column, the way
     the rail's own path rows carry theirs */
  .ccol .cx { border: 0; background: none; padding: 0; margin: 0; cursor: pointer;
    font: inherit; font-size: 15px; line-height: 1; color: rgba(0, 0, 0, 0.42);
    transition: color 0.3s ease; }
  .ccol .cx:hover { color: var(--ink); }
  .ccol .cnote { margin-top: 0.6em; }
  /* ── THE FIELD HOLDS STILL AND THE COLUMN MOVES UNDER IT ──────────
     A turn lands under the description, above the field, and the
     column scrolls by exactly the height it added — so the field
     stays where the hand left it and everything above it slides up,
     which is what a conversation does. Question in ink, answer in
     grey: the same pair the sentence above them is set in. */
  .ccol .cturn { margin-top: 1.1em;
    animation: picIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .ccol .cchips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 0.55em; }
  .ccol .cask { margin-top: 1.1em; }
  .ccol .cmatter { margin-top: 1.1em; }
  /* ── PAPER IS THE WORK, BLACK IS THE HOUSE ────────────────────────
     The rail's Connect drawer already opened black and the curtain
     already lifts black onto a study, so black has meant the house's
     own voice on this site since before there was a board. Info and
     Connect are the house talking about itself, and they stand in the
     row as black modules among the paper ones: a door, not a footer.
     Same anatomy, the two registers inverted — paper for the thing
     itself, grey for what is said about it — and every rule and chip
     re-drawn in the light it now stands in. */
  .ccol.dark .cin { background: var(--ink); color: #fff; }
  .ccol.dark::before { background: rgba(255, 255, 255, 0.22); }
  .ccol.dark .g, .ccol.dark .ca { color: rgba(255, 255, 255, 0.5); }
  .ccol.dark .cchip { background: rgba(255, 255, 255, 0.1); color: #fff; text-decoration: none; }
  .ccol.dark button.cchip:hover, .ccol.dark a.cchip:hover { background: rgba(255, 255, 255, 0.18); }
  .ccol.dark .cx { color: rgba(255, 255, 255, 0.5); }
  .ccol.dark .cx:hover { color: #fff; }
  .ccol.dark .cline { color: #fff; }
  .ccol.dark .cline::placeholder { color: #fff; }
  .ccol.dark .cline:focus { text-decoration-color: #fff; }
  .ccol.dark .cline:focus::placeholder { color: rgba(255, 255, 255, 0.5); }
  .ccol.dark .crow { border-top-color: rgba(255, 255, 255, 0.28); }
  .ccol.dark .crow:hover b { text-decoration-color: rgba(255, 255, 255, 0.5); }
  .ccol.dark .cways u, .ccol.dark .cways a { color: #fff; }
  .ccol.dark .cways u { text-decoration-color: rgba(255, 255, 255, 0.4); }
  .ccol.dark .cways u:hover { text-decoration-color: #fff; }
  /* a row with a line where the picture would be: the method notes,
     the credits. The list's own rule and air, no thumbnail column. */
  .ccol .crow.text { grid-template-columns: minmax(0, 1fr); cursor: default; }
  .ccol .crow.text:hover b { text-decoration: none; }
  /* ── THE ROOM OFFERS ITS QUESTIONS ────────────────────────────────
     The three method notes are answers, so Info offers the questions
     as chips under the field; a press asks it the way typing would,
     the turn lands above the field, the chip dims as spent. The row
     carries its own close, and the choice is kept for the session:
     a visitor who put the questions away is not shown them again in
     the next room. */
  .ccol .cqs { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 0.2em; }
  .ccol .cqs .cchip.spent { opacity: 0.4; pointer-events: none; }
  .ccol .cqs .cx { padding: 0 6px; }
  /* ── THE CREDITS ARE A REEL OF THE MARKS ──────────────────────────
     The live footer's marks, cut through with the house's own reel,
     the way a shelf's stamp cuts through its covers. A mark is drawn
     to fit, not to fill, and reversed to white in the black room;
     the one that is a photograph of a mark stays as it is. */
  .ccol .cmarks { height: 150px; margin-top: 0.9em; border-top: 1px solid rgba(255, 255, 255, 0.28);
    border-bottom: 1px solid rgba(255, 255, 255, 0.28); background: #000; }
  .ccol .cmarks img.sz-fill { object-fit: contain; padding: 44px 60px; }
  .ccol .cmarks img.sz-fill:not([src$="dwr.jpg"]) { filter: invert(1); }
  /* a heading inside the material, in the prose register */
  .ccol .csect { margin-top: 2.2em; margin-bottom: 0.2em; }
  /* ── THE WEEK, IN THE ROW'S ANATOMY ───────────────────────────────
     /book draws the month as a spine and the dates at display size in
     a column of their own. A module is one column, so the week is a
     list: a rule opens each day, the date stands in the prose register
     with its weekday in grey beside it, and the count of open times
     sits in the caption register on the right. The open day's times
     are chips under its line, where a study's catches go. */
  .ccol .cmonth { margin-top: 1.4em; font-size: var(--note); letter-spacing: 0.04em;
    text-transform: uppercase; color: rgba(0, 0, 0, 0.42); }
  .ccol.dark .cmonth { color: rgba(255, 255, 255, 0.5); }
  /* ── /book's OWN MOTION, number for number ─────────────────────────
     The day under the pointer floods, its hours arrive 90ms behind
     the flood from ten pixels below, and the count of open times
     fades as the times themselves appear. Those are book.module.css's
     values: the 0.5s flood on cubic-bezier(0.2, 0.7, 0.2, 1), the
     0.56s reveal on the same curve, the 0.55s underline wipe on a
     time under the hand. On paper the open day floods to ink; in a
     black room it floods to paper, the same reversal the whole column
     is built on. A time is a word with a line under it, as there,
     not a chip: a chip is a place to go, a time is a thing to pick. */
  .ccol .cday { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: baseline;
    padding: 13px 0 26px; border-top: 1px solid rgba(0, 0, 0, 0.12);
    transition: background-color 0.5s cubic-bezier(0.2, 0.7, 0.2, 1),
      color 0.5s cubic-bezier(0.2, 0.7, 0.2, 1),
      padding 0.56s cubic-bezier(0.2, 0.7, 0.2, 1); }
  .ccol.dark .cday { border-top-color: rgba(255, 255, 255, 0.28); }
  .ccol .cday .cnum { font-size: inherit; font-variant-numeric: tabular-nums; }
  .ccol .cday .cnum .g { margin-left: 0.35em; transition: color 0.5s cubic-bezier(0.2, 0.7, 0.2, 1); }
  .ccol .cday .ccount { font-size: var(--note); letter-spacing: 0.04em; text-transform: uppercase;
    color: rgba(0, 0, 0, 0.42); transition: opacity 0.3s ease; }
  .ccol.dark .cday .ccount { color: rgba(255, 255, 255, 0.5); }
  .ccol .cday.has { cursor: pointer; }
  .ccol .cday.shut .cnum { opacity: 0.4; }
  /* the flood: exactly as wide as the rule it opens under. Out to the
     column's edges it read as a band across the room; held to the
     rule's width it reads as the row itself, lit. And the day moves
     IN as it lights: the number and its times slide from the rule's
     edge to a half-gap inside it, on the flood's own curve, so the
     open day is set into its paper rather than pressed against it. */
  .ccol .cday.open { padding: 22px calc(var(--gapx, 20px) / 2) 26px; border-top-color: transparent; }
  .ccol.dark .cday.open { background: #fff; color: #000; }
  .ccol.dark .cday.open .cnum .g { color: rgba(0, 0, 0, 0.42); }
  .ccol .cday.open .ccount { opacity: 0; }
  .ccol .cday .cslots { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 0.75em;
    font-size: var(--note); font-variant-numeric: tabular-nums; letter-spacing: 0.01em;
    visibility: hidden; opacity: 0; transform: translateY(10px); transition: none; height: 0; overflow: hidden; }
  .ccol .cday.open .cslots { visibility: visible; opacity: 1; transform: none; height: auto; overflow: visible;
    transition: opacity 0.5s ease 90ms, transform 0.56s cubic-bezier(0.2, 0.7, 0.2, 1) 90ms; }
  .ccol .ctime { display: inline-block; border: 0; background: none; font: inherit; color: inherit;
    line-height: 1.4; padding: 0 2px; cursor: pointer;
    background-image: linear-gradient(currentColor, currentColor), linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
    background-repeat: no-repeat; background-size: 0 1px, 100% 1px;
    background-position: 0 calc(100% - 0.07em), 0 calc(100% - 0.07em);
    transition: background-size 0.55s cubic-bezier(0.22, 1, 0.36, 1); }
  @media (hover: hover) { .ccol .ctime:hover { background-size: 100% 1px, 100% 1px; } }
  .ccol .ctime.gone { color: rgba(0, 0, 0, 0.3); cursor: default; background-image: none; pointer-events: none; }
  .ccol .ctime.on, .ccol .ctime.on:hover { background-color: var(--ink); color: #fff; background-image: none; padding: 2px 7px; border-radius: 6px; }
  @media (prefers-reduced-motion: reduce) { .ccol .cday, .ccol .cday .cslots, .ccol .ccount, .ccol .ctime { transition: none; } }
  /* the claim: two lines and a chip, under the picked time */
  .ccol .cbook { margin-top: 1.2em; }
  .ccol .cbook .cline { margin-top: 0.3em; }
  .ccol .cbook .cchip { margin-top: 0.9em; }
  .ccol .cways .g { margin: 0 0.3em; }
  .ccol .csect + .crows { margin-top: 0.6em; }
  /* ── A LIST IS A LIST ─────────────────────────────────────────────
     The one-size rule is the INTRO COPY'S: the column's own prose —
     its head and the house's line — is set like the statement. An
     index of eight studies is not prose, and at display type it read
     as a shout. A row wears the board's own caption instead: the
     tile's cover at the size it is dealt beside, the name in ink and
     the category in grey at --note, which is the same pair the
     pictures carry under them in the field. Two registers, prose and
     index, each with one size, one weight, one colour change. */
  .ccol .crows { margin-top: 1em; }
  /* ── THE RULE BELONGS TO THE ROW UNDER IT ─────────────────────────
     Eleven pixels of air above and eleven below made the rule read as
     a divider between two rows, equally the property of both, and a
     list of fourteen came out as a stack of bands. The rule now opens
     a row: the picture and the name sit right under it, and the air
     goes below them, so the eye reads rule-then-thing and the space
     between one thing and the next is the space. */
  .ccol .crow { display: grid; grid-template-columns: 96px minmax(0, 1fr);
    column-gap: 14px; align-items: start; padding: 13px 0 84px;
    border-top: 1px solid rgba(0, 0, 0, 0.12); cursor: pointer;
    font-size: var(--note); line-height: 1.35; font-weight: 600;
    letter-spacing: -0.004em; transition: opacity 0.4s ease; }
  /* the first row keeps its rule: it is the row's own line, not a
     separator that would be spurious at the top of the list */
  /* a narrowed list DROPS what it does not match rather than fading
     it: half-visible rows are the same veil in miniature, and the
     count above already says how many stayed */
  .ccol .crow.off { display: none; }
  .ccol .crow img { display: block; width: 96px; height: 72px; object-fit: cover;
    border-radius: 10px; background: rgba(0, 0, 0, 0.04); }
  /* a reeling row's picture box: the still's own geometry, so a row
     that moves and a row that does not sit on the same line */
  .ccol .crow .creel { width: 96px; height: 72px; border-radius: 10px;
    background: rgba(0, 0, 0, 0.04); }
  .ccol .crow .creel img { width: 100%; height: 100%; border-radius: 0; }
  .ccol .crow b { font-weight: 600; }
  .ccol .crow .g { display: inline; font-weight: 600; }
  .ccol .crow:hover b { text-decoration: underline;
    text-decoration-color: rgba(0, 0, 0, 0.22);
    text-decoration-thickness: 1px; text-underline-offset: 3px; }
  .ccol .cways { margin-top: 0.6em; }
  .ccol .cways u, .ccol .crow:hover b { text-decoration: underline;
    text-decoration-color: rgba(0, 0, 0, 0.22);
    text-decoration-thickness: max(1px, 0.05em); text-underline-offset: 0.15em; }
  .ccol .cways u { cursor: pointer; margin-right: 0.4em; transition: text-decoration-color 0.3s ease; }
  .ccol .cways a { color: inherit; text-decoration: none; }
  .ccol .cways u:hover { text-decoration-color: var(--ink); }
  /* a kept line, in the room's prose register with its name in grey
     under it — the board sets its quote tiles the same way */
  .ccol .cline-quote { margin: 1.6em 0 0.4em; white-space: pre-line; }
  .ccol .cline-quote .att { display: block; margin-top: 0.5em;
    font-size: var(--note); letter-spacing: 0.04em; text-transform: uppercase; }
  .ccol .cpics { margin-top: 0.8em; }
  /* wide, the pulls run as two columns of masonry: the browser's own
     balancing, one gutter, and a picture never broken across the
     boundary. The measure of each is a module, which is the width
     they were already being drawn at. */
  .ccol .cpics.wide { column-count: 2; column-gap: var(--gapx, 20px); }
  .ccol .cpics.wide img, .ccol .cpics.wide .cline-quote { break-inside: avoid; }
  .ccol .cpics.wide img { margin-top: 0; margin-bottom: 14px; }
  .ccol .cpics img { display: block; width: 100%; height: auto; border-radius: 14px;
    background: rgba(0, 0, 0, 0.04); margin-top: 14px;
    animation: picIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes picIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  /* the house's next, standing before the field, in the grey */
  /* ── TWO REGISTERS IN A COLUMN ────────────────────────────────────
     The one-size rule is the INTRO'S, and the intro is one sentence
     with one colour change. A study column holds five different
     things, and setting them all at display size gave them no order
     at all. Only one line in it is a sentence — the study's own
     opening line — and that keeps the statement's size. Everything
     else is furniture, and the board already has a register for
     furniture: the caption under every tile, 12px, the name in ink
     and the category in grey. A column's name line and a tile's name
     line are the same object and now look it.

     The head is furniture too. It is navigation — this column, and
     where the house would go next — so it IS the rail's chips. */
  .ccol .cways { font-size: var(--note); line-height: 1.35; letter-spacing: -0.004em; }
  /* the path in the rail: measured to its words like every other row
     (drawPath calls the hug the moment the rows exist); a name too
     long for the rail measures the rail's width and so keeps it,
     wrapping rather than being cut. 0% is only the fallback for the
     moment before the measure. */
  #pathwrap .rrow { --hug: 0%; }
  #pathwrap .rhead { white-space: normal; text-align: left; line-height: 1.25; }
  @media (max-width: 760px) { #strip { left: 0; } }
  #plane { position: absolute; left: 0; top: 0; bottom: 0; will-change: transform; }
  /* ── EVERY COLUMN SCROLLS ON ITS OWN ──────────────────────────────
     A column of the field is a scroll container, the same as an open
     study column's .cin: the browser owns the wheel under the pointer,
     the touch pan, the momentum and the rubber band, which is a
     better version of each than the plane's single y ever had. The
     plane keeps X — one row, one horizontal axis — and the vertical
     belongs to whichever column you are over.

     The shift for an anchored column lives here now rather than on
     each tile, because it is a fact about the column, and it leaves
     the tile's own translate free. */
  .fcol { position: absolute; top: 0; bottom: 0;
    overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain;
    scrollbar-width: none; touch-action: pan-y;
    transition: translate 0.5s cubic-bezier(0.2, 0.55, 0.2, 1); }
  .fcol::-webkit-scrollbar { display: none; }
  /* the column's full run, so the scroller has the height the deal
     dealt rather than the height of whatever happens to be mounted */
  .fin { position: relative; width: 100%; }

  /* ── the standing rules ────────────────────────────────────────────
     The homepage's own geometry: they begin --cover-air below the top
     and run to the bottom, so they never reach the masthead. Their own
     layer rather than plane children, because they are fixed in Y and
     panned in X; both layers take a transform in the same frame, so
     they are composited together and cannot drift apart the way a
     painted background did. */
  #rules {
    position: absolute; left: 0; right: 0;
    top: var(--cover-air, 50px); bottom: 0;
    pointer-events: none; will-change: transform;
  }
  #rules i { position: absolute; top: 0; bottom: 0; width: 1px;
    background: rgba(0, 0, 0, 0.13); }

  /* the tiles ARE .fd-it cards — frame, radius, curtain, drift and
     caption all come from the stylesheet above */
  /* The tile IS an .ixrow so the index's label and hover rules reach
     it, and .ixrow dissolves to display:contents below 860 — which
     would drop these out of their own absolute placement. Two classes
     and an id, so this wins wherever that rule applies. */
  #plane .tile.ixrow { position: absolute; display: block;
    /* the push under an opening frame, on the index's own clock */
    transition: transform 0.62s cubic-bezier(0.16, 1, 0.3, 1); }
  /* ...except while a page turn is scrubbing it, where the transform
     IS the position and a transition would lag the pan by 0.62s. The
     step aside keeps its own clock through a turn — it is the
     column's transition now — since a column can open and the row
     glide to it in the same moment */
  #plane.turning .tile.ixrow { transition: none; }
  .tile .fd-it { width: 100%; }
  /* ── THE FRAME OPENS INTO ITS COLUMN ──────────────────────────────
     The index hangs every frame from the same right edge, so its grow
     always opens down and left. Here a column's side flips with the
     slot it stands in, so a left-hugging frame opening leftward would
     climb out of its column and over the gutter. The origin follows
     the side instead: the picture always opens into the column's own
     air. That is a real difference in the material — the index's
     columns never move — not a preference.

     --drop is the pixels the grow adds, set per tile at mount so the
     name rides down and stays under its picture. --slide stays 0: the
     index swings its label to the right edge because every frame there
     hangs from it, and here half of them do not. */
  .tile .fd-it .shot { transform-origin: left top; }
  .tile.hangR .fd-it .shot { transform-origin: right top; }
  .tile.hangR .lbl { text-align: right; }

  /* a kept line: the board's own treatment, no frame */
  .tile.quote {
    font-size: 17px; line-height: 1.42; font-weight: 500;
    letter-spacing: -0.01em;
  }
  .tile.quote .att {
    display: block; padding-top: 10px;
    font-size: 9px; letter-spacing: 0.07em; text-transform: uppercase;
    opacity: 0.45;
  }
  /* the statement, at the field's origin — the cover's own setting */
  /* the homepage's own statement numbers, not a near miss of them */
  .tile.statement {
    font-size: clamp(20px, 2.4vw, 32px); font-weight: 600;
    line-height: 1.2; letter-spacing: -0.05em;
  }
  /* ── AN OUT AND AN IN, EVERY TIME THE FIELD CHANGES ──────────────
     Nothing on this board snaps. When the field re-deals, every frame
     on it is swept out first — the stylesheet's own .fd-out, the
     curtain closing in the direction it opened, staggered down the
     page — and only then do the new tiles come, through the same
     curtain they always arrive by. The text tiles fade the way a
     note does (.fd-note's own numbers). The rules stay: they are the
     thing that does not change. */
  .tile.statement, .tile.quote {
    opacity: 0; transform: translateY(14px);
    transition: opacity 0.7s ease var(--lag, 0s),
      transform 0.7s cubic-bezier(0.2, 0.55, 0.2, 1) var(--lag, 0s);
  }
  .tile.statement.fd-on, .tile.quote.fd-on { opacity: 1; transform: none; }
  .tile.statement.fd-out, .tile.quote.fd-out {
    opacity: 0; transition: opacity 0.28s ease var(--lag, 0s);
  }
  /* ── THE RULE GOES WHEN THE FIELD IS ONE THING ────────────────────
     The standing rule between two columns says "two separate things".
     In a study the two columns are one spread, so the rule slides out
     with the sweep — down, on the sweep's own ease — and comes back
     with the board on the arrival's. The rule between the rail and
     the field stays: that boundary is still true. */
  #rules i { transition: transform 0.7s cubic-bezier(0.2, 0.55, 0.2, 1); }
  .tile.statement .q { color: rgba(0, 0, 0, 0.42); }
  .tile.statement .term { cursor: pointer; }
  .tile.statement .term:hover { text-decoration-color: var(--ink); }
  .tile.statement u { text-decoration-color: rgba(0, 0, 0, 0.22);
    text-underline-offset: 0.15em; text-decoration-thickness: max(1px, 0.05em);
    text-decoration-skip-ink: auto; }

  /* THE FILTER THAT IS ON STAYS ON. A drawer closes when the pointer
     leaves it, so without this the only sign of an active filter was
     the field itself — the chip went back to grey while half the board
     was still a ghost. Ink, the same flood the open row takes, so the
     rail says which question the field is answering. */
  #rdrawer .rrow.picked { background: var(--ink); color: #fff; }
  #rdrawer .rrow.picked .rslash { color: #fff; }

  /* the subtraction: recede in place */
  #plane .tile { transition: opacity 0.5s ease; }
  #plane .tile.dim { opacity: 0.05; pointer-events: none; }

  /* ── BACK TO START, IN THE RAIL ────────────────────────────────────
     It was a floating pill in the far corner, the one control on the
     page in a style of its own. It is a .rrow now, built into the
     drawer, so it wears the chip every other row wears and hugs its
     own words the same way.

     Anchored to the FOOT of the rail column rather than sitting under
     the categories: it is not one of them, and the gap says so. It
     still fades in only once there is somewhere to come back from. */
  /* The height is stated rather than left to top+bottom, because
     .ixnotes is a flex column with its own gap and the pair alone did
     not stretch it — the column stopped at its content and the way
     back sat halfway up the screen. */
  #railwrap { display: flex; flex-direction: column;
    height: calc(100dvh - var(--nav) - 52px); }
  #rdrawer { flex: none; }
  #homewrap { margin-top: auto; }
  #home {
    opacity: 0; pointer-events: none; transform: translateY(6px);
    transition: opacity 0.3s ease, transform 0.3s ease,
      clip-path 0.56s cubic-bezier(0.2, 0.7, 0.2, 1),
      background-color 0.56s cubic-bezier(0.2, 0.7, 0.2, 1),
      color 0.56s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  #home[data-on] { opacity: 1; pointer-events: auto; transform: none; }

  /* ── PHONES: THE RAIL LIES DOWN ────────────────────────────────────
     There is no note column on a phone, so the drawer stops being a
     column of drawers and becomes a strip of chips along the bottom
     edge — the shape the homepage's own folded rail ends up as. The
     bodies close for good here: a drawer opening upward over the work
     would cover the thing it is filtering, so a tap filters outright,
     which is what the strip is for.

     The clip has to go with them. --hug is measured against a
     full-width column and there is no column now; left on, every chip
     would be clipped to a fraction of a width it never had. */
  /* ── THE BAR'S ITEMS SIT OVER THE COLUMNS THEY COMMAND ────────────
     Desktop only. The wordmark moves LEFT, over the rail column, with
     the nav options it introduces; the field parks over the chat
     column — the same x as the statement's own text — because that is
     where the conversation lives. When the statement scrolls away the
     field is simply still there, pinned in its column's slot in the
     bar. The mail keeps the right edge. */
  @media (min-width: 761px) {
    /* 12, the shipped masthead's size, not the lab block's 16: the
       wordmark read a third too large next to the live site */
    #nav { --nav-gutter: var(--gut); --nav-size: 12px; }
    #nav .mark { grid-column: 1; justify-self: start; }
  }
  /* ── THE COVER LINE ───────────────────────────────────────────────
     Fixed, and moved by the same transform as the plane, so it is
     page content in every way that matters: it scrolls off with the
     statement and pages away with the first column. .cover gives it
     the masthead's 12px and the cap-align the homepage tuned. */
  /* ── THE MASTHEAD IS WHERE IT LANDS ───────────────────────────────
     No handover. The wordmark and the address sit on the page's own
     line at load and stay there: the bar's duplicate pair, and the
     drop-in that waited for the cover to leave, are gone. One name in
     one place, always. */
  /* ABOVE THE BAR, not under it. The burn is a backdrop filter and
     displaces whatever paints behind it, so a masthead sitting below
     the pill was being rippled by the effect that exists to keep it
     legible — the lab learned this once already. The line rides on
     top; the burn melts only the work passing beneath. */
  #coverline { position: fixed; z-index: 61;
    top: var(--cover-air, 50px); left: var(--gut); right: var(--gut);
    display: flex; justify-content: space-between; align-items: flex-start;
    pointer-events: none; }
  #coverline a { pointer-events: auto; }
  /* ── THE LINE REVERSES BY THE SIDE, NOT BY THE BAR ────────────────
     The homepage flips its whole masthead to paper over a declared
     dark zone. A black column is one module wide, so the address can
     be standing on black while the wordmark is still on paper: each
     end of the line reverses on its own, against the columns that are
     actually under it. The burn pill spans the whole bar and reads as
     a light band over black, so it stands down while a black room is
     anywhere beneath it; it exists to melt the work, and no work is
     passing there. */
  .covermark, .covermeta a { transition: color 0.28s ease; }
  .covermark.rev { color: var(--masthead-paper, #fff); }
  .covermeta.rev a { color: rgba(255, 255, 255, 0.5); }
  html.rh-home body.coverbar #nav [data-burn].rev, #navBurn.rev { opacity: 0; }
  @media (min-width: 761px) {
    /* the bar keeps only the field and the ×; its own name and address
       never arrive, because the page's have never left */
    #nav [data-mark], #nav [data-meta] { display: none !important; }
    /* the burn sits behind the line it exists to keep legible, from
       the first frame — it is the work passing under the masthead
       that the effect is for, and that starts at the first scroll */
    #navBurn { top: calc(var(--cover-air, 50px) - 9px); bottom: auto; height: 35px; }
    html.rh-home body.coverbar #nav [data-burn] { opacity: 1; }
  }
  @media (max-width: 760px) {
    #coverline { display: none; }
    /* the phone's bar is the sheet's handle: its ends never hide */
    html.rh-cover #nav [data-mark], html.rh-cover #nav [data-meta] {
      opacity: 1; visibility: visible; transform: none; }
  }
  /* ── THE RAIL STARTS WHERE EVERYTHING ELSE STARTS ────────────────
     It sat 16px lower than the field on the homepage's own number,
     which read as a gap above the first chip once the field's columns
     were all opening on one line. The band is 46, not 62: it is the
     masthead's own, the same one TOP0 adds to --cover-air and the
     same one a conversation column pads its head by, so the rail's
     first chip, a column's chip and the statement all begin on the
     one line. */
  @media (min-width: 761px) {
    #railwrap { top: calc(var(--cover-air, 50px) + 46px); }
  }
  /* the room the travelling field takes inside the sentence — the
     homepage's #askSlot, as a class because the statement is dealt
     more than once (its wrap copies, the thread's lede) */
  .askslot { display: inline-block; width: min(9.5em, 92%);
    height: 1.12em; vertical-align: middle; }
  /* the house's line in the parked field, at the bar's own size */

  /* the question is a button wearing the sentence's own clothes (phone) */
  .askgo { border: 0; background: none; padding: 0; margin: 0;
    font: inherit; color: inherit; letter-spacing: inherit;
    cursor: pointer; text-align: left; }
  .askgo u { text-decoration-color: rgba(0, 0, 0, 0.22);
    text-underline-offset: 5px; text-decoration-thickness: 1.5px; }
  /* NO CLOSE IN THE BAR. Every column carries its own ×, and the rail
     carries one per row of the path, so a third floating in the
     masthead band belonged to nothing. Escape still folds the newest. */
  /* ── THE FIELD IS THE STATEMENT'S, AND ONLY THE STATEMENT'S ───────
     There is no parked copy any more. The question travelled to the
     bar because the bar was the only place left to ask from; every
     column's head is a field now, so a second one floating over the
     masthead was a spare control in the band the burn owns. It rides
     the slot inside the sentence and goes when the sentence goes. */
  #nav.threadon #query, .ask.parked #query { visibility: hidden; }

  /* the picture is the door to the study's column, and it says so */
  .tile[data-slug] .shot { cursor: pointer; }

  /* ── WHAT THE HOUSE LAYS NEXT ─────────────────────────────────────
     While a preview is open the bar names the study the house would
     put beside it — over the right-hand column, the column that IS
     "beside this" — with its reason underneath in the grey. A button,
     because it is the next column: press it and the field walks. On a
     phone the same line sits at the head of the preview instead. */

  /* ── THE COMMAND SURFACE ──────────────────────────────────────────
     One sheet the bar owns on a phone. It rises from the bar on the
     drawer's own 0fr→1fr and carries the ENTIRE rail — the drawers,
     the reels, the categories, the way back — because the bar is the
     one nav entry there and everything reachable has to be reachable
     through it. Desktop never shows it: the rail column stands. */
  #cmdSheet {
    position: fixed; left: 0; right: 0; z-index: 55;
    bottom: calc(var(--nav) + env(safe-area-inset-bottom, 0px));
    display: none;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.56s cubic-bezier(0.2, 0.7, 0.2, 1);
    background: var(--paper, #fff);
    border-top: 1px solid rgba(0, 0, 0, 0.13);
  }
  #cmdSheet[data-on] { grid-template-rows: 1fr; }
  #cmdSheet > div { overflow: hidden; min-height: 0; }
  #cmdIn {
    max-height: min(66dvh, 560px);
    overflow-y: auto; -webkit-overflow-scrolling: touch;
    padding: 18px 20px 14px;
  }
  #cmdChev { display: none; }

  @media (max-width: 760px) {
    /* ── ONE NAV ENTRY, AND IT LIVES AT THE BOTTOM — logo and all.
       The top of the glass belongs entirely to the work; the bar is
       the site's whole face down where the thumb is. The safe-area
       pad grows the box, and the grid centres in the content box, so
       the row itself stays on the bar's own 54px line. */
    #nav { top: auto; bottom: 0;
      height: calc(var(--nav) + env(safe-area-inset-bottom, 0px));
      padding-bottom: env(safe-area-inset-bottom, 0px);
      background: var(--paper, #fff);
      border-top: 1px solid rgba(0, 0, 0, 0.08); }
    /* the pull-to-ask rides the top edge; the bar no longer does */
    #cmdSheet { display: grid; }
    /* THE WORDMARK IS THE HANDLE. On a phone the mark stops being a
       link out and becomes the sheet's toggle — the brand is the
       button. A drawn caret beside it says so. */
    #cmdChev { display: inline-block; width: 8px; height: 8px;
      margin-left: 8px; vertical-align: 1px;
      border-right: 1.5px solid var(--ink);
      border-bottom: 1.5px solid var(--ink);
      transform: rotate(-135deg);
      transition: transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1); }
    #nav.cmdopen #cmdChev { transform: rotate(45deg); }

    /* the rail, re-homed into the sheet: back to the desktop drawer
       anatomy — column, hugs, bodies, reels — because the sheet gives
       it the room the strip never had */
    #cmdIn #railwrap { position: static; width: auto; height: auto;
      padding: 0; display: flex; flex-direction: column; }
    #cmdIn #homewrap { margin-top: 14px; }

    #field { left: 0; }
    #rules { display: none; }

    /* ── A COLUMN IS A PAGE ───────────────────────────────────────
       One module is half the glass here, so a column spans two: the
       whole screen, standing in the row right after the field's one
       period, arriving from the right as the row glides to meet it.
       The same row as the desktop's, with the same three moves —
       page sideways between the field and the columns, scroll up and
       down inside each — and a column grows out from behind the
       field's edge exactly as it grows out from behind a neighbour.
       A sheet over the work was tried first, and it read as a modal:
       the feel of the row was the thing lost. The field's own rule
       is hidden at this width, so the column's goes with it. */
    .ccol::before { display: none; }
    /* no top padding on the scroller: WebKit measures a sticky top
       from the scroll container's CONTENT box, so padding there is a
       band the pinned head sits below and the column scrolls through.
       The head carries the air instead. */
    .ccol .cin { padding: 0 20px 110px; }
    .ccol .cpics.wide { column-count: 1; }
    /* the head holds the top of the glass while the column scrolls
       under it: on desktop the × is one of several ways out and can
       scroll away with the column; here it is the only one, and a
       reader four pictures down cannot be asked to find the top */
    .ccol .chead { position: sticky; top: 0; z-index: 2;
      margin: 0 -20px 0; padding: 28px 20px 14px;
      background: var(--paper, #fff); }
    .ccol.dark .chead { background: #000; }

    /* ── THE BAR: the field, then the handle ──────────────────────
       The field is in the grid here rather than placed over it: on
       desktop it parks on a measured column and the bar is wide; on
       a phone there is one line and it is shared. The address goes;
       it is the first line of Connect. */
    #nav { grid-template-columns: minmax(0, 1fr) auto; gap: 16px;
      padding-left: 20px; padding-right: 20px; }
    #nav .ask { position: static; transform: none; width: auto; min-width: 0; }
    #nav .mark { justify-self: end; white-space: nowrap; }
    #nav .meta { display: none; }
  }
</style>
<!-- ── ARRIVING UNDER A CURTAIN ──────────────────────────────────────
     The app's own head script, verbatim. A study's pull home writes
     the note; this draws that curtain, lines and all, before this
     document can be seen, and the lift below owns beat 3. Same
     classes, same keyframes: board-shell.css already carries them. -->
<script>
(function(){try{
  var raw=sessionStorage.getItem('pt.arrive');if(!raw)return;
  sessionStorage.removeItem('pt.arrive');
  var d=JSON.parse(raw);
  if(!d||!d.t||Date.now()-d.t>15000)return;
  var r=document.createElement('div');r.id='ptArrive';
  r.className='pt pt-run pt-1 pt-2 pt-wait';r.setAttribute('aria-hidden','true');
  r.style.cssText='position:fixed;inset:0;z-index:300';
  var N=d.n||0;
  var panel=function(cls,bg){var p=document.createElement('div');p.className=cls;
    p.style.cssText='position:absolute;inset:0;background:'+bg;
    var s=document.createElement('div');s.className='ptstack';
    if(d.lh)s.style.setProperty('--ptlh',d.lh);
    if(d.fs)s.style.setProperty('--ptfs',d.fs);
    if(!d.sub)s.className='ptstack pt-nosub';
    for(var i=0;i<N;i++){var l=document.createElement('span');l.className='ptl';
      l.style.setProperty('--d',(i*0.03).toFixed(3)+'s');
      l.textContent=d.title||'';
      if(d.sub){var b=document.createElement('span');b.className='sub';
        b.textContent='  '+d.sub;l.appendChild(b);}s.appendChild(l);}
    p.appendChild(s);return p;};
  r.appendChild(panel('ptw','#fff'));r.appendChild(panel('ptb','#000'));
  document.documentElement.appendChild(r);
  document.documentElement.classList.add('pt-arriving');
}catch(e){}})();
</script>
</head>
<body>

<nav id="nav">
  <div id="navBurn" data-burn aria-hidden="true"></div>
  <div class="ask">
    <input id="query" type="text" placeholder="Ask the house."
      autocomplete="off" autocorrect="off" spellcheck="false"
      aria-label="Ask the house" />
  </div>

  <a data-mark href="/" class="mark" aria-label="Reckon House Staples">Reckon<i>*</i>House<i>*</i>Staples<span id="cmdChev" aria-hidden="true"></span></a>
  <a class="meta" data-meta href="mailto:hello@reckon.house">hello@reckon.house</a>
</nav>

<!-- THE COVER'S OWN LINE, in the page and not in the bar: the wordmark
     over the rail's column, the address over the last column, both in
     the masthead's type, both scrolling away with the statement. The
     bar's copies drop in only once these have left the screen — the
     homepage's handover, lifted whole. It rides the plane by
     transform, so it pages away with the first column too. -->
<div id="coverline" class="cover">
  <span class="covermark" aria-label="Reckon House Staples">Reckon<i>*</i>House<i>*</i>Staples</span>
  <span class="covermeta"><a href="mailto:hello@reckon.house">hello@reckon.house</a></span>
</div>

<div id="cmdSheet"><div><div id="cmdIn"></div></div></div>

<div class="pt" id="pt" aria-hidden="true">
  <div class="ptw"><div class="ptstack" id="ptwT"></div></div>
  <div class="ptb"><div class="ptstack" id="ptbT"></div></div>
</div>

<!-- the melt: the burn pill's displacement, lifted from the masthead -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="mastheadMelt" x="-20%" y="-20%" width="140%" height="140%"
    color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.015 0.025"
      numOctaves="3" seed="8" result="noise" />
    <feGaussianBlur in="noise" stdDeviation="2" result="smoothNoise" />
    <feDisplacementMap in="SourceGraphic" in2="smoothNoise" scale="18"
      xChannelSelector="R" yChannelSelector="G" />
  </filter>
</svg>

<div id="railwrap" class="ixnotes">
  <div class="blk rdrawer" id="rdrawer"></div>
  <!-- built into the drawer as a .rrow so it wears the rail's own chip
       — see the note where it is wired -->
</div>

<div id="strip"><div id="stripIn">
  <div id="field">
    <div id="rules"></div>
    <div id="plane"></div>
    <div id="cols"></div>
  </div>
</div></div>


<script>
/* the site's own seeded LCG, so a seed is a field */
const mkRnd = (s0) => { let s = s0;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; };
const seed = parseInt(new URLSearchParams(location.search).get("seed") || "7", 10);
const rnd = mkRnd(Number.isFinite(seed) ? seed : 7);
const REDUCE = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
/* ── ONE PATH, EVERY RUNG ───────────────────────────────────────────
   The generator writes a picture at 1536 and again at 768 and 384,
   named with @<width> before the extension, and records which rungs
   it wrote. The browser then decodes the file that fits the box
   rather than the biggest one there is. */
const srcsetFor = (t) => {
  if (!t || !t.r || !t.r.length) return null;
  const parts = t.r.map((r) => encodeURI(t.t.replace(/\.webp$/, "@" + r + ".webp")) + " " + r + "w");
  parts.push(encodeURI(t.t) + " " + (t.nw || t.w) + "w");
  return parts.join(", ");
};
/* The reel's own hook into it. This was a stub returning nothing, on
   the reasoning that the thumbs were already a 384px tier — true when
   it was written and false since they went to 1536, so every 128px
   stamp in the rail was holding a 1536px bitmap. */
const byPath = (() => {
  let m = null;
  return () => m || (m = Object.fromEntries((window.BOARD_ITEMS || []).map((i) => [i.t, i])));
})();
const tileSrcSet = (src) => {
  const it = byPath()[decodeURI(src || "")];
  return (it && srcsetFor(it)) || "";
};
let alive = true;
/* The burn's own input hook, from the driver. There it listens on
   whatever is scrolling; here nothing scrolls — the board pans — so
   the pan reports itself and the pill heats on the same signal. */
const burnPoke = [];
const onScrollAnywhere = (fn) => burnPoke.push(fn);
const pokeBurn = () => burnPoke.forEach((fn) => fn());

const GROUPS = window.BOARD_GROUPS || {};

/* ── the homepage's measures, read from its own tokens ─────────────
   --gut, --ix-note-w and --ixgap come from board-shell.css, so the
   rail's column and the gutters are the homepage's to the pixel. Two
   columns of work beside the rail on a desktop, one on a phone. */
const cs = getComputedStyle(document.documentElement);
const px = (name, fb) => parseFloat(cs.getPropertyValue(name)) || fb;
const PHONE = innerWidth <= 760;
const GUT = px("--gut", 50), NOTE_W = px("--ix-note-w", 180);
/* --ixgap is a clamp(), and getPropertyValue hands back the clamp as
   written, not a length, so parseFloat found nothing and this fell to
   40px at every width while the CSS gap ran 24 to 56. Every edge the
   script placed sat a few px off every edge the sheet placed. Let an
   element resolve it: the element knows. */
const IXGAP = (() => {
  const m = document.createElement("i");
  m.style.cssText = "position:absolute;visibility:hidden;width:var(--ixgap)";
  document.body.appendChild(m);
  const w = m.getBoundingClientRect().width; m.remove();
  return w || 40;
})();
/* ── A PHONE IS TWO-UP AS WELL ──────────────────────────────────────
   The live site's phone grid is the desktop pair at half the width:
   the statement in the left column, Ivy Park top right, the same
   seating. So the pair stands, and what a phone changes is the
   period — one, all the way down — and the shares, which fill the
   column the way the live frames do. */
const VISIBLE = 2;
/* MEASURED, not derived from innerWidth. The field's left edge is set
   in CSS from --gut, --ix-note-w and --ixgap, and re-deriving it here
   put the column 2.5px out: innerWidth reported 1065 while the field's
   own box was 833.6, because innerWidth is not always the width the
   layout is using. The element knows; ask it. */
const FIELD_W = document.getElementById("strip").getBoundingClientRect().width;
{
  const f = document.getElementById("field");
  f.style.width = FIELD_W + "px"; f.style.flexBasis = FIELD_W + "px";
}
document.documentElement.style.setProperty("--modw", "0px"); /* set once COL is known */
const GAP = PHONE ? 20 : IXGAP;
/* ── AND A FIFTH OF THE NEXT ONE ────────────────────────────────────
   Nothing on the board said it went sideways. The first column a
   visitor opens arrives from the right, which is a hint, and a second
   one is a stronger hint, but until then the row looks like a page
   that happens to be wide. A CUT PICTURE is the one signal everyone
   reads without being taught: the strip already clips at its own
   edge, so showing a share of the third module is enough — part of a
   frame, a caption running off, the standing rule that belongs to a
   column nobody has reached.

   It costs the two full columns about a tenth of their width, which
   is the honest price of saying what the page is. VISIBLE stays 2:
   two columns are still what a page turn moves by and what the
   seating deals across. Only the module narrows. */
const PEEK = PHONE ? 0 : 0.2;
const SHOW = VISIBLE + PEEK;
/* half gutter, column, gutter, column, half gutter: VISIBLE gaps, not
   VISIBLE+1, or the resting edge lands mid-tile */
const MOD_X = FIELD_W / SHOW;
const COL = MOD_X - GAP;
/* ── THE ENTRANCE ───────────────────────────────────────────────────
   On a first load the field is BUILT, column by column, the way a
   conversation column arrives: nothing slides, a reveal edge opens
   each column left to right out of the one before it, on the column's
   own 0.5s curve, and the next begins a beat behind. The tiles stand
   where they will stand throughout; only what is drawn of them
   changes. Tiles travelling in one by one read as groups arriving,
   because every tile carried its own clock; a column being drawn in
   has one clock, the column's. */
const REVEAL_MS = 400;
let booting = !REDUCE();
document.documentElement.style.setProperty("--modw", MOD_X + "px");
/* the gap the SCRIPT uses (20 on a phone, the token elsewhere), for
   the column CSS that must land on the same edges as the tiles */
document.documentElement.style.setProperty("--gapx", GAP + "px");
let PH = 0; /* the period's height — computed by the row grid below */
const AIR_MIN = 120, AIR_MAX = 340;
const air = () => AIR_MIN + rnd() * (AIR_MAX - AIR_MIN);
/* THE INDEX'S OWN TIERS, verbatim, and the 0.17 anti-repeat with them.
   Mine ran 0.55 to 1.0, so tiles filled their column and the air went
   out of the page — and the live site has never had a frame at full
   column width. These top out at 0.86 and reach down to 0.33, which is
   where the negative space between everything comes from. */
/* the live index's ladder, unchanged. A pass raised it one notch on a
   reading that the board's frames were smaller than the site's; they
   were not, the site was being compared in its HOVER state. Same six
   rungs, and each study's cover takes the exact rung reckon.house
   gives it — the board-data `sz`, mined from the live seed. */
const IX_TIERS = [0.33, 0.43, 0.53, 0.64, 0.74, 0.86];
/* a phone's column is 157px: every frame fills it, as the live grid's do */
const SHARES = PHONE ? [1] : IX_TIERS;
/* ── NO PICTURE IS EVER SHOWN LARGER THAN ITS PIXELS ────────────────
   The tier is 768px wide, or the original if that was smaller, so the
   largest honest CSS width is that divided by the screen's own pixel
   ratio — not by an assumed 2. On a 3x phone an assumed 2 would have
   been a 1.5x upscale on every tile, and on a 1x screen it threw away
   half the resolution it had. Clamped at 3 because past that the file
   would have to be enormous to keep up and the eye stops collecting
   the difference. checkScale() below verifies the result against the
   pictures that actually loaded. */
const DPR = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
const CAP_H = 30;

/* ── the corpus ── */
const QUOTES = [
  { text: "Came up on a tornado, sunlight in the sky\nI went around all day with the moon sticking in my eye", att: "Don Van Vliet, Captain Beefheart" },
  { text: "And this old man in front of me wearing canes and ruby rings\nIt's like containing an explosion when he sings\nWith every chance to set himself on fire\nHe just ends up doing the same thing", att: "Jack White" },
  { text: "What you got ain't nothin' new. This country is hard on people. You can't stop what's coming. It ain't all waiting on you. That's vanity.", att: "Cormac McCarthy" },
];
/* ── PORTFOLIO FIRST ────────────────────────────────────────────────
   The thirty covers the live homepage deals lead the field, in the
   homepage's own order and never shuffled — a visitor's first screens
   are the portfolio, and the archive begins where the covers run out.
   Only the rest takes the seed. */
const all = (window.BOARD_ITEMS || []).slice();
const covers = all.filter((i) => i.c != null).sort((a, b) => a.c - b.c);
const rest = all.filter((i) => i.c == null);
for (let i = rest.length - 1; i > 0; i--) {
  const j = Math.floor(rnd() * (i + 1));
  [rest[i], rest[j]] = [rest[j], rest[i]];
}
const items = covers.concat(rest).map((it) => ({ kind: "img", ...it }));
QUOTES.forEach((q, k) => {
  items.splice(Math.min(items.length, 45 + k * 190), 0, { kind: "quote", ...q });
});

/* ── the two text shapes, measured once — text has no declared ratio ── */
const FONT = "'Avenir Next','Helvetica Neue',Helvetica,Arial,sans-serif";
const meas = document.createElement("div");
meas.style.cssText = "position:absolute;left:-9999px;top:0;width:" + COL +
  "px;font-family:" + FONT +
  ";font-size:17px;line-height:1.42;font-weight:500;letter-spacing:-0.01em;white-space:pre-line";
document.body.appendChild(meas);
const quoteH = (q) => {
  meas.textContent = "“" + q.text + "”";
  return meas.getBoundingClientRect().height + 28;
};

/* ── ONE FIELD, THREE FACES ─────────────────────────────────────────
   The homepage has one living field: it rests inside the statement as
   the rotating question, travels to the bar, and is the same object
   throughout. The board had a dead replica — static quote, nothing to
   click — so the three pieces (statement, bar, thread) never met.

   The statement's question is ALIVE now: the homepage's own TOUR
   typed at the homepage's own cadence, and it is a button — tap it
   and the thread opens with that question asked. The same statement
   leads the thread as its header, rotation still running, so opening
   the conversation never loses the intro: the transcript simply
   continues from the sentence that invited it. */
/* ONE FIELD, NOT TWO. On a desktop the question is not text in the
   statement: it is the bar's own input, riding a slot reserved inside
   the sentence at display size, and parking in the bar when the slot
   scrolls under — the homepage's travelling field, lifted whole. The
   board had the input in the bar AND a question in the statement, and
   the two fought. On a phone the bar is at the bottom and the travel
   has nowhere to go, so there the question stays a line in the
   statement and the bar keeps the input. */
/* ── THE TERMS ARE DOORS ────────────────────────────────────────────
   Every underlined phrase in the intro opens a column, the same as
   typing it or pressing a chip: the ones that name a shelf open that
   shelf, the rest ask their own words. They were plain <u> on the
   board's replica and did nothing, which made the one piece of copy
   everybody reads the one piece that could not be used. */
const T = (word, ask) =>
  '<u class="term" data-ask="' + (ask || word) + '">' + word + '</u>';
const STATEMENT_LEAD =
  "I'm Jeremy Prasatik. I make things across " +
  T("brand") + ", " + T("product") + ", and " + T("place") + ". " +
  '<span class="q">' +
  T("Apps", "App Development") + " and " + T("ecommerce") + ", " +
  T("campaigns", "Campaign/Creative") + " and " + T("brand systems", "brand system") + ", " +
  T("photography and art direction", "photography") + ", " +
  T("custom interiors", "Interiors") + ", " + T("AI tools", "AI") +
  ".</span> ";
const ASK_TAIL = PHONE
  ? "Or just ask me:<br><button type=\"button\" class=\"askgo\"><u><span class=\"asktxt\">“Marble surfaces”</span></u></button>"
  : "Or just ask me:<br><span class=\"askslot\" aria-hidden=\"true\"></span>";
const STATEMENT_HTML = STATEMENT_LEAD + ASK_TAIL;
const smeas = document.createElement("div");
smeas.className = "tile statement";
smeas.style.cssText = "position:absolute;left:-9999px;top:0;width:" + COL + "px";
smeas.innerHTML = STATEMENT_HTML;
/* measured with the LONGEST question in place, so no rotation entry
   can ever rewrap the tile past the room it reserved; the slot is
   fixed-size by construction */
const smAsk = smeas.querySelector(".asktxt");
if (smAsk) smAsk.textContent = "“How do I reach you?”";
document.body.appendChild(smeas);
const STATEMENT_H = smeas.getBoundingClientRect().height;
smeas.remove();

/* ── placement: GLOBAL ROWS, the homepage's own alignment ───────────
   The columns used to stack independently, each with its own dealt
   air, so tiles across a gutter landed at unrelated heights. The
   homepage's grammar is the opposite: every row shares one TOP line,
   the tallest frame sets the row, and the bottoms go ragged. So the
   field is a row grid now — one baseline per row across EVERY column,
   one dealt air per row shared by all of them — and any two columns
   the paging puts side by side are aligned, not just a lucky pair.

   The deal stays column-major: down column zero, then down column
   one. The covers still lead in the homepage's order, and the period
   height is COMPUTED from the rows rather than aimed at, so the
   vertical wrap is exact. */
/* Content starts clear of the masthead. It still SCROLLS under it —
   that is what the burn pill is for — but nothing should be born
   beneath the bar, least of all the statement. */
const NAV_H = px("--nav", 54);
/* the cover air, as on the homepage: the statement shares the bar's
   band at rest, which is fine because the bar is glass there — its
   ends hidden, its burn off — until the cover line has scrolled under */
const COVER_AIR = px("--cover-air", 50);
/* ── THE MASTHEAD'S OWN BAND ─────────────────────────────────────────
   The name and the address hold a line at the cover's air, and the
   burn pill spans it. Content born on that same line is content the
   pill melts — the statement's first line was rippling under the
   effect that exists to keep the masthead legible over the WORK. So
   nothing starts inside the band: the columns and the field begin
   below it, and everything passes under it on the way up, which is
   what a masthead is for. */
const HEAD_BAND = PHONE ? 0 : 46;
const TOP0 = PHONE ? 30 : COVER_AIR + HEAD_BAND;
const ROW_TIERS = [0.62, 0.85, 1.1, 1.35];

/* ── ONE FIELD, DEALT AND RE-DEALT ──────────────────────────────────
   The whole placement is a function of a list, so the field can be
   dealt to everything — the board — or to one study, and the same
   rows, rules, sides and hover hold either way. The board: the
   statement leads, the covers follow in the homepage's order, the
   archive after, on the seed. A study: its head leads in the
   statement's slot and every picture it holds follows, across exactly
   two columns at the bigger tiers. The preview is the field itself,
   not a panel over it. */
let tiles = [], ROWS = 0, COLS = 0, PW = 0, rowY = [], coverCol = {};
/* ── THE COLUMNS, AND WHERE EACH WAS LEFT ──────────────────────────
   A column is mounted whole: the deal gives a column nine tiles, so
   windowing one vertically would be bookkeeping for nothing. What is
   worth keeping is the scroll — a column paged away and paged back to
   should be where it was, not at its top — so the position outlives
   the element. Declared with the deal's own state, because adopt()
   fills byCol and adopt() runs the moment the board is dealt, long
   before the window that reads it exists. */
const fcols = new Map();
const colY = new Map();
let byCol = [];
function deal(list, opts) {
  opts = opts || {};
  const r = opts.rnd || rnd;
  const shares = opts.shares || SHARES;
  const tiers = opts.rowTiers || ROW_TIERS;
  const lead = opts.lead;
  const [airMin, airMax] = opts.air || [AIR_MIN, AIR_MAX];
  const airOf = () => airMin + r() * (airMax - airMin);
  const capOf = (it) => (GROUPS[it.g] && !opts.noCaptions) ? CAP_H : 0;

  /* size pass: every item's box, before anything is seated */
  let prevShare = -1;
  const sized = [lead];
  for (const it of list) {
    let w = COL, h;
    if (it.kind === "quote") h = quoteH(it);
    else {
      let share, guard = 0;
      do { share = shares[Math.floor(r() * shares.length)]; }
      while (Math.abs(share - prevShare) < 0.17 && guard++ < 24);
      /* ── A COVER STANDS AT THE WIDTH THE LIVE SITE GIVES IT ───────
         Same ladder, different dice: the board rolled its own tier for
         every frame, so a study whose cover is 0.86 on reckon.house
         could come up 0.43 here. The live roll is reproducible and
         `npm run board` mines it, so a cover takes its own rung and
         only the rest of the corpus is dealt. The roll still advances
         either way, so the anti-repeat sees what actually landed. */
      const own = !PHONE && it.c != null && GROUPS[it.g] && GROUPS[it.g].sz;
      if (own) share = own;
      /* ── AN IMAGE IS ONLY AS BIG AS ITS PIXELS ───────────────────
         CLAUDE.md's rule, applied where it bites: native width / DPR
         is the largest honest CSS width. It steps DOWN THE TIERS
         rather than picking an arbitrary width, so a small file lands
         on the same ladder as everything else; only if even the
         smallest tier would magnify it does it take its honest width
         outright. */
      /* the file's OWN width, not a remembered constant. The 768 that
         stood here was the generator's width written down twice, so
         raising the generator to 1280 left every tile still capped at
         384 CSS and the change did nothing. it.w IS the file. */
      const honest = it.w / DPR;
      while (COL * share > honest && share > shares[0]) {
        share = shares[shares.indexOf(share) - 1];
      }
      prevShare = share;
      w = Math.min(Math.round(COL * share), Math.round(honest));
      h = Math.round(w * (it.h / it.w));
      if (h > COL * 1.6) h = Math.round(COL * 1.6);
      h += capOf(it);
    }
    /* nw: the FILE's own width, kept before w stops being it. The
       size pass overwrites w with the CSS box and the seating pass
       overwrites it again, so by the time a srcset is built the
       largest rung's descriptor had become the tile's painted width —
       97w for a 1536px file, which is a rung no box would ever ask
       for. */
    sized.push({ ...it, nw: it.w, w, h });
  }

  /* ── THE ROWS ARE DEALT, THE CONTENT FITS THE ROWS ───────────────
     Row height = max(content) was the trap: one tall portrait
     anywhere in a row's fifty columns inflated that row for everyone.
     So the heights are DEALT — tiers off the seed, shared by every
     column — and a tile taller than its row renders SMALLER rather
     than pushing fifty columns down. Row zero is the lead's own:
     nothing in the first row stands taller than the statement, or
     the study's head, so the field opens level. Quotes are text and
     cannot scale; a long one spends its row's air. */
  const rows = opts.rows || Math.max(8, Math.round((innerHeight * 6) / 560));
  /* SEATED ACROSS THE PAIR, COUNTED ACROSS THE PAIR. Counting columns
     the old way — one column per `rows` items — left the last item
     seated one column past the end, and a column past the end is
     exactly one period to the left of column 0: the field wraps, so
     Sally's cover was drawn on top of the statement. */
  const per = rows * VISIBLE;
  const cols = VISIBLE * Math.ceil(sized.length / per);
  const rowH = new Array(rows);
  if (opts.fitRows) {
    /* A STUDY'S ROWS FIT THEIR PICTURES. The dealt tiers exist because
       a row on the board spans fifty columns and one tall stranger
       must not set it for everyone. A study's field is two columns of
       one thing, so the trap is gone and the rule can be the plain
       one: the row is as tall as the taller of its two pictures, and
       every picture stands at its own full size. */
    rowH.fill(0);
    /* the same seat the pass below gives it, across the pair; i % rows
       was the old column-major seat and sized every row by strangers */
    sized.forEach((it, i) => { const k = Math.floor((i % per) / VISIBLE);
      if (it.h > rowH[k]) rowH[k] = it.h; });
  } else {
    let prevTier = -1;
    for (let k = 0; k < rows; k += 1) {
      if (k === 0) { rowH[0] = lead.h; continue; }
      let t, guard = 0;
      do { t = tiers[Math.floor(r() * tiers.length)]; }
      while (Math.abs(t - prevTier) < 0.2 && guard++ < 12);
      prevTier = t;
      rowH[k] = Math.round(COL * t);
    }
  }
  const ys = [opts.top != null ? opts.top : TOP0];
  for (let k = 0; k < rows; k += 1) ys.push(ys[k] + rowH[k] + airOf());
  /* ── STACKED, NOT ROWED, on a phone ──────────────────────────────
     The live grid is two flex columns, each running its own height,
     so Sally tucks up under Ivy Park rather than waiting for the
     statement's row to end. Rows exist here to hold fifty columns
     level; with two, each column keeps its own running y. The seat
     (which column) is still the pair's; only the height is the
     column's own. */
  const colY = opts.stack ? new Array(cols).fill(ys[0]) : null;
  const out = [], cc = {};
  /* ── SEATED THE WAY THE LIVE INDEX READS ────────────────────────
     The board filled a column top to bottom and then moved right; the
     live site fills a row across and then moves down. Same order,
     different shape, and it put Ivy Park under the statement where
     reckon.house has it top right. Seated across the pair of columns
     the board shows at once — a row, then the next row — the two
     agree at rest: statement, Ivy Park; Sally, the kitchen; A.R.C.,
     Nordstrom. A phone is the same pair at half the width, so the
     same seating: one period, read downward. */
  sized.forEach((it, i) => {
    const pair = Math.floor(i / per), within = i % per;
    const c = pair * VISIBLE + (within % VISIBLE), k = Math.floor(within / VISIBLE);
    let { w, h } = it;
    /* ── AND THE FIELD OPENS ON ONE LINE ────────────────────────────
       Every column but the first used to start 61px lower, under the
       address line, which is what the live homepage does. It is the
       right move there, where the address sits in the flow above the
       work. Here the address is in the cover line, which bottoms at
       64 with the whole of --cover-air below it, so the drop was
       clearing something already cleared — and it cost the one thing
       a row of columns is for, which is a top edge they share. */
    if (it.kind === "img") {
      const cap = capOf(it), budget = rowH[k] - cap;
      if (h - cap > budget) {
        w = Math.max(60, Math.round(w * (budget / (h - cap))));
        h = budget + cap;
      }
    }
    let y = ys[k];
    if (colY) { y = colY[c]; colY[c] += h + airOf(); }
    out.push({ ...it, w, h, x: c * MOD_X, y, col: c,
      noCap: !!opts.noCaptions });
    /* where each study's cover lives, so a study can be walked to */
    if (it.c != null && it.g && cc[it.g] == null) cc[it.g] = c;
  });
  return { tiles: out, ROWS: rows, COLS: cols, PW: cols * MOD_X,
    PH: colY ? Math.max(...colY) : ys[rows], rowY: ys, coverCol: cc };
}
function adopt(L) {
  tiles = L.tiles; ROWS = L.ROWS; COLS = L.COLS; PW = L.PW; PH = L.PH;
  rowY = L.rowY; coverCol = L.coverCol;
  byCol = Array.from({ length: COLS }, () => []);
  for (const t of tiles) byCol[t.col].push(t);
}
/* ── ON A PHONE THE FIELD IS ONE PAGE, DOWN ─────────────────────────
   Sixty-one screen-wide columns dragged in two axes was a map, and a
   phone is not a place to hold a map. The whole corpus is dealt into
   ONE period — two columns, every row — so there is nothing to the
   right, the pair fits the glass, and the one axis left is the one a
   thumb already knows. Rows fit their pictures (the dealt tiers exist
   to stop one tall stranger setting a row for fifty columns, and
   there are two), and the air between them is a feed's, not a
   board's. */
const BOARD = deal(items, PHONE
  ? { lead: { kind: "statement", w: COL, h: STATEMENT_H },
      rows: Math.ceil((items.length + 1) / VISIBLE), fitRows: true, stack: true,
      air: [24, 64] }
  : { lead: { kind: "statement", w: COL, h: STATEMENT_H } });
adopt(BOARD);


/* ── the bar over its columns, the thread down the chat column ──────
   The field's parked slot and the thread's box are the same geometry:
   the chat column's own edges. Set from the measured numbers so the
   panel's hairlines land exactly on the standing rules. */
const field = document.getElementById("field");
if (!PHONE) {
  const fieldL = field.getBoundingClientRect().left;
  const navEl = document.getElementById("nav");
  /* fallbacks only: placeAsk() writes the real numbers every frame */
  navEl.style.setProperty("--ask-left", (fieldL + GAP / 2) + "px");
  navEl.style.setProperty("--ask-w", (COL * 0.63) + "px");
  const root = document.documentElement.style;
  /* the held head: column zero's own text edge, the column's width,
     the top the statement is born at */
  root.setProperty("--head-x", (fieldL + GAP / 2) + "px");
  root.setProperty("--head-w", COL + "px");
  root.setProperty("--head-top", TOP0 + "px");
  /* on the ROOT, not on one panel: the thread and the preview are the
     same column box and both read these, so a var scoped to either
     one left the other on its fallback — a 420px panel at x 0. */
  root.setProperty("--thread-x", (fieldL + 1) + "px");
  root.setProperty("--thread-w", (COL + GAP - 2) + "px");
  root.setProperty("--thread-pad", (GAP / 2) + "px");
}

/* ── THE FRONT DOOR ─────────────────────────────────────────────────
   There is no chat panel. A question, from the statement's field or
   the bar's parked one, opens a COLUMN in the strip — see THE
   COLUMNS below — and the field dims to what the question counted,
   as it always did. The answers stay honest about what this page is:
   there is no model on the board, so the house answers with what it
   can count. */
let textDim = null;
let dealing = false;
const wordsOf = (t) => {
  if (t.kind === "quote") return (t.text + " " + t.att).toLowerCase();
  const g = GROUPS[t.g];
  return (t.g + " " + (g ? g.t + " " + g.s + " " + g.tags.join(" ") : ""))
    .toLowerCase();
};
const countQ = (q) => {
  const needle = q.toLowerCase();
  const hit = tiles.filter((t) => t.kind !== "statement" && wordsOf(t).includes(needle));
  const studies = new Set(hit.filter((t) => t.kind === "img").map((t) => t.g));
  return { n: hit.length, m: studies.size, needle };
};
/* ── NOTHING GREYS OUT ──────────────────────────────────────────────
   A filter used to dim the whole field to whatever it caught, which
   put most of the work behind a veil to make a point about a few
   pieces of it. The column IS the answer: it lists the studies and
   stands beside the board, and the board is left exactly as it was,
   still there to scroll. So this only ever CLEARS a dim, and nothing
   ever sets one. */
const applyTextDim = () => {
  for (const [, el] of live) el.classList.remove("dim");
};
const submitQ = (text) => {
  text = (text || "").trim();
  if (!text) return;
  const { n, needle } = countQ(text);
  if (typeof trailLog !== "undefined") { trailLog.asked.push(text); saveTrail(); }
  textDim = n ? needle : null;
  applyTextDim();
  if (window.askFrom) askFrom(null, text, { at: anchorOfAsk() });
};
{
  const q = document.getElementById("query");
  if (q) {
    const ask = q.closest(".ask");
    let focused = false;
    const typing = (e) => {
      if (e.type === "focus") focused = true;
      if (e.type === "blur") focused = false;
      ask.classList.toggle("typing", focused || q.value.length > 0);
    };
    q.addEventListener("focus", typing);
    q.addEventListener("blur", typing);
    q.addEventListener("input", typing);
    q.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { q.value = ""; q.blur(); return; }
      if (e.key !== "Enter") return;
      submitQ(q.value || window.__tourWord || "All work");
      q.value = "";
    });
  }
  addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (e.target && e.target.tagName === "INPUT") return;
    if (window.closeNewest) closeNewest();
  });
  /* the rotating question is a door: tap it and that question is asked */
  document.addEventListener("click", (e) => {
    const go = e.target.closest && e.target.closest(".askgo");
    if (go) { submitQ(window.__tourWord || "All work"); return; }
    /* and so is every term in the sentence, wherever it is dealt */
    const term = e.target.closest && e.target.closest(".term[data-ask]");
    if (term && window.askFrom) {
      const tile = term.closest(".tile");
      askFrom(null, term.dataset.ask, { at: tile && tile.__u != null ? tile.__u : anchorOfAsk() });
    }
  });
}

/* ── THE ROTATION, the homepage's own ───────────────────────────────
   TOUR and cadence lifted verbatim; the one change is the surface it
   types onto — every .asktxt on the page at once, so the statement in
   the field and the statement leading the thread stay in step. It
   stands down while the visitor is typing, and under reduced motion
   it holds the first question. */
const TOUR = ["All work", "Interior projects", "App development",
  "Kitchen design", "What inspires you?", "Marble surfaces", "How do I reach you?"];
(() => {
  const TYPE_IN = 52, TYPE_OUT = 26, TYPE_HOLD = 1700, TYPE_GAP = 340;
  const QQ = (t) => "\u201c" + t + "\u201d";
  const input = document.getElementById("query");
  /* onto the FIELD — the placeholder is the question now, at display
     size in the statement and small in the bar — and onto any .asktxt
     a phone's statement still carries */
  const paint = (t) => {
    document.querySelectorAll(".asktxt").forEach((el) => { el.textContent = t; });
    if (input && !input.value) input.placeholder = t;
    if (window.placeAsk) placeAsk();
  };
  window.tourFull = QQ(TOUR[0]);
  if (REDUCE()) { paint(QQ(TOUR[0])); return; }
  let k = 0, i = TOUR[0].length, mode = "hold";
  window.__tourWord = TOUR[0];
  paint(QQ(TOUR[0]));
  const step = () => {
    if (document.hidden || (input && (document.activeElement === input || input.value))) {
      setTimeout(step, 500); return;
    }
    const word = TOUR[k];
    if (mode === "in") {
      i += 1; paint(QQ(word.slice(0, i)));
      if (i >= word.length) { mode = "hold"; setTimeout(step, TYPE_HOLD); }
      else setTimeout(step, TYPE_IN);
      return;
    }
    if (mode === "hold") { mode = "out"; setTimeout(step, TYPE_OUT); return; }
    i -= 1; paint(QQ(word.slice(0, Math.max(0, i))));
    if (i <= 0) {
      mode = "in"; k = (k + 1) % TOUR.length;
      window.__tourWord = TOUR[k];
      window.tourFull = QQ(TOUR[k]);   /* the whole word, for the size */
      setTimeout(step, TYPE_GAP);
    } else setTimeout(step, TYPE_OUT);
  };
  setTimeout(step, 1400);
})();

const plane = document.getElementById("plane");
const rulesEl = document.getElementById("rules");
let colIdx = 0;
/* ── WHERE A COLUMN STANDS ─────────────────────────────────────────
   A column is anchored after one module of the field as dealt,
   c.__after (0 is the statement; a tile's module is its period times
   the columns per period, plus its column), and ccols is kept in row
   order. So a column's place in the row is its anchor, plus one, plus
   the columns before it; a module's place is itself plus the columns
   anchored before it; and a tile steps aside one module for each of
   those. Nothing is a block: a column opened from the far end of the
   row stands at the far end, and only what is right of it moves. */
const spanOf = (c) => c.__span || 1;
const colsBefore = (u) => { let n = 0; for (const c of ccols) if (c.__after < u) n += spanOf(c); return n; };
const shiftAt = (u) => colsBefore(u) * MOD_X;
const dispOf = (c) => {
  let n = c.__after + 1;
  for (const x of ccols) { if (x === c) break; n += spanOf(x); }
  return n;
};
const dispU = (u) => u + colsBefore(u);
/* what stands at a place in the row: a column, or a module */
const atDisp = (d) => {
  let u = d;
  for (const c of ccols) {
    const k = dispOf(c), sp = spanOf(c);
    if (d >= k && d < k + sp) return { col: c };
    if (k + sp <= d) u -= sp;
  }
  return { u };
};
/* the module a question from the statement belongs to: the statement
   on the screen, since the sentence is dealt once a period; parked in
   the bar with none on screen, whatever stands at the near edge */
function anchorOfAsk() {
  const L = field.getBoundingClientRect().left;
  for (const el of document.querySelectorAll("#plane .tile.statement")) {
    const r = el.getBoundingClientRect();
    if (r.right > L && r.left < innerWidth && el.__u != null) return el.__u;
  }
  const here = atDisp(colIdx);
  return here.col ? null : here.u;
}
const restX = (i) => i * MOD_X - GAP / 2;
const START = { x: restX(0), y: 0 };
const cur = { ...START }, tgt = { ...START };
let dragging = false, lastMount = { x: 1e9, y: 1e9 }, wasTurning = false;
/* THE FIELD DOES NOT WRAP TO THE LEFT. Its first column is the
   beginning of the house and there is nothing before it; the
   conversation lives to the RIGHT, past the field, where new things
   go. Rightward the field is as endless as it was. */
/* ── A PAGE IS A SCREEN ──────────────────────────────────────────
   One module on desktop; on a phone the two that make one, since the
   field is one period and every column spans it. A turn lands on
   whole pages, and on a phone it stops at the last column: the row
   does not run on past the conversation into nothing. */
const PAGE = PHONE ? 2 : 1;
const pageTo = (i) => {
  if (PHONE) {
    const last = ccols.reduce((n, c) => n + spanOf(c), 0);
    i = Math.min(last, Math.round(i / PAGE) * PAGE);
  }
  colIdx = Math.max(0, i); tgt.x = restX(colIdx);
};

/* ── TWO AXES, EACH WITH ONE MEANING ────────────────────────────────
   Up and down scrolls. Left and right pages, one column at a time,
   and nothing in between: a trackpad's two-finger swipe carries both
   deltas at once, so the gesture is decided by which one dominates
   and then held for the length of that gesture. A shorter cooldown
   than before, because a page turn that ignores the second flick
   feels broken; a lower threshold, because a trackpad's horizontal
   deltas are small. Shift and a wheel pages too, which is the
   convention every mouse user already has. */
/* ── THE WHEEL BELONGS TO THE PAGE, NOT TO ONE BOX ──────────────────
   It listened on the field alone, so the rail, the masthead's band,
   the cover line and any bare strip after a column had folded were
   DEAD: a wheel there reached nothing that scrolls, and the page sat
   still under the hand. It listens on the document now and routes by
   where the pointer is — a column handles its own (see colNode),
   everything else moves the field.

   AND THE AXIS LOCK HAS AN ESCAPE. A trackpad's flick tails off for a
   second or more in decaying deltas, each one resetting the idle
   clock, so a gesture that began sideways held the lock long after
   the hand had changed its mind, and a vertical intent in that tail
   moved nothing. A delta on the other axis three times the size of
   the locked one is a new intent, and takes the axis at once. */
let hCool = 0, wheelAxis = null, wheelIdle = 0;
document.addEventListener("wheel", (e) => {
  if (e.target.closest && e.target.closest(".ccol")) return;   /* the column's own */
  if (dealing) { e.preventDefault(); return; }
  const now = performance.now();
  if (now - wheelIdle > 160) wheelAxis = null;   /* a new gesture */
  wheelIdle = now;
  const dx = e.shiftKey ? e.deltaY : e.deltaX, dy = e.shiftKey ? 0 : e.deltaY;
  const ax = Math.abs(dx), ay = Math.abs(dy);
  if (!wheelAxis) wheelAxis = ax > ay * 1.2 ? "x" : "y";
  else if (wheelAxis === "x" && ay > ax * 3) wheelAxis = "y";
  else if (wheelAxis === "y" && ax > ay * 3) wheelAxis = "x";
  if (wheelAxis === "x") {
    e.preventDefault();
    if (now - hCool > 320 && ax > 12) { pageTo(colIdx + Math.sign(dx) * PAGE); hCool = now; }
  }
  /* and DOWN IS NOT OURS ANY MORE. The column under the pointer is a
     scroller, so the browser routes the wheel to it, keeps its own
     momentum and stops it at its own end — all of which the plane's
     single y used to do by hand and worse. Nothing is prevented here;
     preventing it was what made the field one page. */
}, { passive: false });

let pxx = 0, pyy = 0, moved = 0, dragAxis = null;
const trail = [];
field.addEventListener("pointerdown", (e) => {
  if (dealing) return;
  dragging = true; moved = 0; dragAxis = null;
  /* the columns stand inside the field, so a press in one reaches here
     too. Sideways from anywhere pages the row, since the row is one
     axis wherever the hand is; up and down belongs to whatever box the
     hand is over, and the field lets go of it below. */
  pxx = e.clientX; pyy = e.clientY;
  trail.length = 0;
  /* NO CAPTURE YET, and that was the whole bug. Capturing on
     pointerdown retargets every later event — pointerup and the click
     with them — to the field, so a click on a tile was delivered to
     the field instead and no chip could ever be pressed. The capture
     is what a DRAG needs, not what a press needs, so it waits until
     the pointer has actually travelled. */
});
field.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const dx = e.clientX - pxx, dy = e.clientY - pyy;
  pxx = e.clientX; pyy = e.clientY;
  moved += Math.abs(dx) + Math.abs(dy);
  /* now it is a drag: take the pointer so it cannot be lost off the
     edge, once, and only past the threshold a tap can never reach */
  if (moved > 6 && !field.hasPointerCapture(e.pointerId)) {
    try { field.setPointerCapture(e.pointerId); } catch (err) { /* gone */ }
  }
  /* ONE AXIS PER DRAG. The first real movement decides it and the
     gesture holds it, so a hand that wanders never carries the page
     diagonally: the two directions mean two different things and a
     drag that did both at once meant neither. */
  if (!dragAxis && moved > 8) dragAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
  /* a vertical drag is the column's, wherever it started: let go of
     the pointer and the scroller under it takes over */
  if (dragAxis === "y") { dragging = false; dragAxis = null; return; }
  if (dragAxis === "x") tgt.x -= dx;
  trail.push({ dx, dy, t: performance.now() });
  if (trail.length > 6) trail.shift();
});
const release = () => {
  if (!dragging) return;
  dragging = false;
  const now = performance.now();
  const recent = trail.filter((m) => now - m.t < 90);
  const fx = recent.reduce((s, m) => s + m.dx, 0);
  const fy = recent.reduce((s, m) => s + m.dy, 0);
  if (dragAxis === "x") {
    let i = Math.round((tgt.x + GAP / 2) / (MOD_X * PAGE)) * PAGE;
    if (fx < -30) i += PAGE;
    if (fx > 30) i -= PAGE;
    pageTo(i);
  }
  dragAxis = null;
};
field.addEventListener("pointerup", release);
field.addEventListener("pointercancel", release);
/* a press that ends over the rail or a column never reached the
   field's own pointerup, and the drag flag stayed set until the next
   press: momentum off, and a stale axis. The window sees every up. */
addEventListener("pointerup", release);
addEventListener("pointercancel", release);
field.addEventListener("click", (e) => {
  if (moved > 6) { e.stopPropagation(); e.preventDefault(); }
}, true);

/* ── the filter ── */
let MODE = null;
/* every tile belongs on the board, whatever is being asked */
const matches = () => true;

/* ── the window ── */
const MARGIN_X = PHONE ? 0 : MOD_X * 0.8, MARGIN_Y = 560;
const live = new Map();
const arrive = REDUCE()
  ? { observe: (c) => c.classList.add("fd-on"), unobserve: () => {} }
  : new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("fd-on");
        arrive.unobserve(e.target);
      });
    }, { threshold: 0.02 });
const drifting = [];
function remount() {
  if (dealing) return;                /* nothing mounts into a field on its way out */
  lastMount = { x: cur.x, y: cur.y };
  const x0 = cur.x - MARGIN_X, x1 = cur.x + FIELD_W + MARGIN_X;
  const want = new Set();
  const fresh = [];
  /* ── WINDOWED SIDEWAYS ONLY ───────────────────────────────────────
     The field runs sideways for ever and DOWN ONCE. A column comes on
     as a scroller of the full dealt height — that is what gives it a
     length to scroll — and fills itself from its own scrollTop, so
     the vertical window is the COLUMN's and no longer the plane's. */
  for (let i = Math.floor(x0 / PW); i * PW < x1; i++) {
    /* a phone's field is one period and the columns stand after it:
       the period that would wrap under them is never dealt */
    if (PHONE && i !== 0) continue;
    for (let c = 0; c < COLS; c++) {
      /* the module, by column and period, not by x: a narrow frame
         sits in from its column's edge and its x alone would lie.
         Tested where it is GOING — the translate's transition carries
         it. The period before the statement sits off the left edge,
         seen only on an overdrag, and nothing is anchored before it. */
      const u = i * COLS + c;
      const gx = c * MOD_X + i * PW, sh = shiftAt(u);
      if (gx + sh + MOD_X < x0 || gx + sh > x1) continue;
      want.add(u);
      fillCol(fcols.get(u) || mountCol(u, gx, sh), fresh);
    }
  }
  for (const [u, f] of fcols) {
    if (want.has(u)) continue;
    /* a column still sliding aside for a conversation column is
       tested where it is going, and can be out of the window there
       while still on the screen here: it stays until it has left */
    const r = f.getBoundingClientRect();
    if (r.right > -MARGIN_X && r.left < innerWidth + MARGIN_X) continue;
    colY.set(u, f.scrollTop);
    for (const [key, el] of live) if (el.__u === u) live.delete(key);
    f.remove(); fcols.delete(u);
  }
  /* the curtain: the homepage's own arrival observer, not a rAF pair.
     An IntersectionObserver fires on its own schedule, so a tile that
     mounts while the tab is throttled still opens when it is looked
     at; the rAF version left every frame shut on a parked page. */
  settle(fresh);
  /* the standing rules: one per gutter the window can see */
  const kids = rulesEl.children;
  let n = 0;
  for (let c = Math.floor(x0 / MOD_X) - 1; c * MOD_X < x1 + MOD_X; c++) {
    const rx = c * MOD_X - GAP / 2;
    if (rx < x0 - 2 || rx > x1 + 2) continue;
    let el = kids[n];
    if (!el) { el = document.createElement("i"); rulesEl.appendChild(el); }
    el.style.left = rx + "px";
    /* the rule at a period's own left edge stands between the rail
       and the field; every other one stands between two columns of
       the field, and those are the ones a study takes away */
    el.classList.toggle("mid", ((c % COLS) + COLS) % COLS !== 0);
    n += 1;
  }
  while (kids.length > n) rulesEl.removeChild(kids[kids.length - 1]);
  /* a tile that mounts mid-turn must be on its side before it paints */
  swapSides();
}
/* a column of the field: its own scroller, at its own module, kept at
   whatever height the deal dealt and returned to wherever it was left */
function mountCol(u, gx, sh) {
  const f = document.createElement("div");
  f.className = "fcol";
  f.__u = u; f.__sh = sh; f.__c = u - Math.floor(u / COLS) * COLS; f.__gx = gx;
  f.style.cssText = "left:" + gx + "px;width:" + MOD_X + "px;translate:" + sh + "px 0";
  const inn = document.createElement("div");
  inn.className = "fin";
  inn.style.height = PH + "px";
  f.appendChild(inn);
  f.__in = inn;
  plane.appendChild(f);
  fcols.set(u, f);
  const y = colY.get(u);
  if (y) f.scrollTop = y;
  f.addEventListener("scroll", () => {
    colY.set(u, f.scrollTop);
    pokeBurn();
    if (window.placeAsk) placeAsk();
    /* and the column keeps its own window: a phone deals two columns
       of two hundred and seventy tiles, so "a column is nine tiles,
       mount it whole" was a desktop fact and not a rule */
    if (Math.abs(f.scrollTop - (f.__filled || 0)) > 200) {
      const fresh = [];
      fillCol(f, fresh);
      settle(fresh);
    }
  }, { passive: true });
  return f;
}
/* what of a column is worth having in the document: the run its own
   scroller can see, plus a screen either side */
function fillCol(f, fresh) {
  const u = f.__u, gx = f.__gx;
  const col = byCol[f.__c] || [];
  const y0 = f.scrollTop - MARGIN_Y, y1 = f.scrollTop + f.clientHeight + MARGIN_Y;
  f.__filled = f.scrollTop;
  const want = new Set();
  for (let k = 0; k < col.length; k++) {
    const t = col[k];
    if (t.y + t.h < y0 || t.y > y1) continue;
    const key = u + ":" + k;
    want.add(key);
    if (live.has(key)) continue;
    const el = mount(t, gx, t.y, u, f);
    live.set(key, el);
    /* a frame arrives by its card; a text tile by itself */
    fresh.push(el.querySelector(".fd-it") || el);
  }
  for (const [key, el] of live) {
    if (el.__u !== u || want.has(key)) continue;
    el.remove(); live.delete(key);
  }
}
/* what a newly mounted run of tiles needs before it can be looked at */
function settle(fresh) {
  if (!fresh.length) return;
  /* the in cascades down the page: a lag by where each one sits,
     which the arrival transition already honours as --lag */
  const seen = fresh.map((c) => ({ c, y: c.getBoundingClientRect().top }))
    .sort((a, b) => a.y - b.y);
  seen.forEach(({ c }, i) => c.style.setProperty("--lag",
    Math.min(0.36, i * 0.05).toFixed(3) + "s"));
  if (window.armDrift) armDrift(fresh);
  /* On a first load the reveal edge IS the arrival, so a tile has to
     be standing there, opaque, before the edge reaches it: the class
     is handed over with its fade switched off, and the fade comes
     back once the field is built. Only for what the edge actually
     crosses — anything below the fold has not been arrived at yet, so
     it waits for the observer like everything else. */
  seen.forEach(({ c, y }) => {
    if (!booting || y > innerHeight) { arrive.observe(c); return; }
    c.style.transition = "none";
    c.classList.add("fd-on");
  });
}
function mount(t, gx, gy, u, f) {
  const el = document.createElement("div");
  el.__u = u; el.__col = f;
  /* .ixrow, because that is the ancestor the index's own label and
     hover rules are scoped to. Same classes, same stylesheet, same
     0.62s curve — nothing about the card is re-specified here. */
  el.className = "tile ixrow";
  /* left 0: a tile's x IS its column's, and the column is the box it
     is in now. Only the hug moves it within that. */
  el.style.cssText = "left:0;top:" + gy + "px;width:" + t.w + "px";
  /* what the swap reads: where this tile's column sits in the world,
     and how far the tile can travel inside it */
  el.__wx = gx;
  el.__slack = COL - t.w;
  if (t.kind === "statement") {
    el.classList.add("statement");
    el.innerHTML = STATEMENT_HTML;
  } else if (t.kind === "head") {
    /* a study's head, in the statement's clothes and its slot */
    el.classList.add("statement", "head");
    el.innerHTML = t.html;
  } else if (t.kind === "spacer") {
    /* the held head's room: the head itself is fixed over this */
    el.classList.add("spacer");
  } else if (t.kind === "quote") {
    el.classList.add("quote");
    el.textContent = "“" + t.text + "”";
    const att = document.createElement("span");
    att.className = "att";
    att.textContent = "· " + t.att;
    el.appendChild(att);
  } else {
    /* a real index card: .fd-it > .shot > .plate > img, plus .lbl.
       The frame, the radius, the arrival curtain, the drift slack and
       the caption's setting are all the stylesheet's. */
    const g = GROUPS[t.g];
    /* in a study's own field the caption would only repeat the head
       fourteen times, so the pictures go bare */
    const cap = (g && !t.noCap) ? CAP_H : 0;
    /* a div, not an anchor: the card carries links now, and an
       anchor inside an anchor is a nesting the parser refuses */
    const card = document.createElement("div");
    card.className = "fd-it k-work";
    card.style.setProperty("--w", "100%");
    const shot = document.createElement("span");
    shot.className = "shot";
    shot.style.setProperty("--ar", t.w + " / " + (t.h - cap));
    /* ── THE CROP THE LIVE SITE GIVES THIS PICTURE ──────────────────
       The stylesheet draws every frame's picture 16% taller than the
       frame and centres it, and object-fit pays that as a crop top and
       bottom. Seven covers overrule it in projects.ts with a drift
       tuned by hand — the Sally laptop among them, which is why the
       board's laptop sat tight in its frame while the live site's had
       air around it. Covers only: the number was judged against that
       one picture, not against the study. */
    if (t.c != null && GROUPS[t.g] && GROUPS[t.g].dr != null)
      shot.style.setProperty("--drift", GROUPS[t.g].dr + "%");
    /* what the label rides down by when the frame opens: exactly the
       pixels the 1.32 scale adds to the picture's height */
    card.style.setProperty("--drop",
      Math.round((1.32 - 1) * (t.h - cap)) + "px");
    const plate = document.createElement("span");
    plate.className = "plate";
    const img = document.createElement("img");
    img.src = encodeURI(t.t);
    const ss = srcsetFor(t);
    if (ss) {
      img.srcset = ss;
      /* the box it is drawn in, times the 1.32 the hover grows it to,
         so opening a frame does not magnify a bitmap chosen for the
         closed one */
      img.sizes = Math.ceil(t.w * 1.32) + "px";
    }
    img.alt = "";
    img.decoding = "async";
    plate.appendChild(img);
    shot.appendChild(plate);
    card.appendChild(shot);
    if (g && !t.noCap) {
      const lbl = document.createElement("span");
      lbl.className = "lbl";
      lbl.textContent = g.t + " ";
      const sub = document.createElement("span");
      sub.className = "sub";
      sub.textContent = g.s;
      lbl.appendChild(sub);
      card.appendChild(lbl);
      /* NO LINKS UNDER A TILE. The picture is the door — press it and
         the study opens as a column, where both ways in are named
         once — so a pair of them under every caption on the board was
         the same offer repeated twenty-eight times. */
      el.dataset.slug = t.g;
    }
    el.appendChild(card);
  }
  f.__in.appendChild(el);
  return el;
}

/* ── WHICH SIDE A COLUMN HUGS IS WHERE IT IS ────────────────────────
   Not a property of the tile and not of the column: of the SLOT. The
   column standing in the left slot hugs left, the one in the right
   slot hugs right, so the two columns on screen always press to the
   outer edges and the negative space collects down the middle where
   the standing rule is.

   Which makes the page turn do something better than slide. A column
   crossing from the right slot to the left carries its tiles across
   their own width as it goes — they start against the right edge of
   their column and end against the left, scrubbed by the same pan
   that moves them. Nothing is animated on a timer; it is a function
   of position, so it runs backwards for free.

   A transform, never `left`: this writes to every mounted tile on
   every frame of a page turn, and a layout property there would cost
   a reflow per tile per frame. The caption follows the side it lands
   on, toggled only when it actually crosses. */
function swapSides() {
  for (const el of live.values()) {
    const push = el.__push || 0;
    if (!el.__slack && !push && !el.__hadPush) continue;
    el.__hadPush = push !== 0;
    const wx = el.__wx + (el.__col ? el.__col.__sh : 0);
    /* ── AND THE SWING CARRIES INTO THE PEEK ──────────────────────
       Clamped at 1, everything past the second slot hugged RIGHT,
       which is the far side of a module that is four fifths off the
       glass: the peek would have shown empty gutter. The pattern is
       a PAIR — left slot, right slot — so it repeats rather than
       ends, and a ping-pong over two modules is that repeat written
       down. Slot 0 hugs left, slot 1 right, slot 2 left again, and
       the scrub between them is continuous, so a tile still crosses
       its own width as the row turns. */
    const raw = (wx - cur.x - GAP / 2) / MOD_X;
    const m = ((raw % 2) + 2) % 2;
    const t = m > 1 ? 2 - m : m;
    el.style.transform = "translate3d(" +
      (t * (el.__slack || 0)).toFixed(1) + "px," + push.toFixed(1) + "px,0)";
    const right = t > 0.5;
    if (right !== el.__right) {
      el.__right = right;
      el.classList.toggle("hangR", right);
    }
  }
}

/* ── THE HOVER, from armRows ────────────────────────────────────────
   The index's own interaction, with one thing rebuilt because the
   material is different.

   WHAT IS THE SAME. A frame opens to its COLUMN, never past it:
   grow = 1 / share, so a 0.33 frame and an 0.86 frame both land their
   edge on the same line — the line the standing rule draws. A flat
   factor made small frames stop short and large ones cross over, and
   no two hovers agreed on how big "open" is. The name rides down by
   exactly the pixels the growth added and slides to the edge the frame
   opened toward, measured with a Range over its own ink because the
   label is a full-width block whose rect would say zero.

   WHAT IS DIFFERENT, and it is the whole reason this is not a copy.
   On the index the card takes --drop as real bottom margin and NORMAL
   FLOW carries every row below it out of the way. Nothing on this
   board is in flow: every tile is absolutely placed on a computed
   plane, so a margin moves nothing at all and the opening frame would
   simply cover its neighbours. The push is therefore explicit — every
   tile below it in the same column is translated down by the same
   drop, on the same clock — and it rides in the same transform the
   side-swap already writes, so the two can never fight over the
   property.

   The origin follows the side the column is hugging, so the picture
   always opens into its own air rather than out over the gutter. */
function armHover() {
  const HOVER = matchMedia("(hover: hover)").matches && !PHONE;
  if (!HOVER) return;
  let openCard = null;

  const clearPush = () => {
    for (const el of live.values()) el.__push = 0;
  };

  plane.addEventListener("pointerover", (e) => {
    const card = e.target.closest && e.target.closest(".fd-it");
    if (!card || card === openCard) return;
    const tile = card.closest(".tile");
    const shot = card.querySelector(".shot");
    if (!tile || !shot) return;
    openCard = card;

    const share = shot.offsetWidth / COL;
    const grow = Math.max(1.04, 1 / share);
    card.style.setProperty("--ix-grow", grow.toFixed(3));
    const drop = shot.offsetHeight * (grow - 1);
    card.style.setProperty("--drop", drop.toFixed(1) + "px");

    /* the name travels to the edge the frame opens toward: the same
       measured distance, opposite sign on a right-hugging column */
    const lbl = card.querySelector(".lbl");
    if (lbl) {
      const range = document.createRange();
      range.selectNodeContents(lbl);
      const ink = range.getBoundingClientRect().width;
      const slide = Math.max(0, shot.offsetWidth * grow - ink);
      const right = tile.classList.contains("hangR");
      card.style.setProperty("--slide",
        (right ? -slide : slide).toFixed(1) + "px");
    }

    /* and the column makes room under it */
    clearPush();
    const colOf = (el) => Math.round(el.__wx / MOD_X);
    const c = colOf(tile), y0 = parseFloat(tile.style.top);
    for (const el of live.values()) {
      if (el === tile || colOf(el) !== c) continue;
      if (parseFloat(el.style.top) > y0) el.__push = drop;
    }
  });

  plane.addEventListener("pointerout", (e) => {
    const card = e.target.closest && e.target.closest(".fd-it");
    if (!card) return;
    if (e.relatedTarget && card.contains(e.relatedTarget)) return;
    card.style.removeProperty("--ix-grow");
    card.style.removeProperty("--drop");
    card.style.removeProperty("--slide");
    if (card === openCard) openCard = null;
    clearPush();
  });
}
armHover();

/* ── A PICTURE OPENS ITS STUDY IN A COLUMN ─────────────────────────
   Press the picture, or the Preview link under its name, and the
   study opens as a column before the field, its pictures loading
   down it. The study link beside it is a real href and the curtain
   handles it. A drag is never a press. */
plane.addEventListener("click", (e) => {
  if (moved > 6) return;
  const pv = e.target.closest && e.target.closest("[data-act='preview']");
  if (pv) {
    e.preventDefault();
    const tile = pv.closest(".tile");
    openStudyColumn(tile.dataset.slug, { at: tile.__u }); return;
  }
  if (e.target.closest && e.target.closest("a[href]")) return;
  const shot = e.target.closest && e.target.closest(".tile[data-slug] .shot");
  /* the study opens right after the picture's own module */
  if (shot) { const tile = shot.closest(".tile"); openStudyColumn(tile.dataset.slug, { at: tile.__u }); }
});

/* ── THE TRAIL, AND WHAT THE HOUSE LAYS NEXT ────────────────────────
   Everything you did on the board is a row behind you: the tiles you
   stayed on and for how long, the studies you opened, the shelf you
   picked, the words you asked. From it the house names the study it
   would put beside the one you are looking at — and SAYS WHY, because
   a next without a reason is a recommendation engine and a next with
   one is a host walking you to the next room.

   No model here. The same counting the answers use, run over the
   trail: a study earns points for every tag it shares with a tile you
   dwelt on, weighted by the dwell; more for one you opened; three for
   the shelf you picked; and the words you asked count the way they
   count in the thread. (trailLog, not trail: the drag already keeps a
   trail of velocity samples under that name.) A study you have already
   opened is discounted,
   since the house would rather show you something new. With no trail
   at all, next is the homepage's own order: the fixed sequence, never
   nothing. */
const TRAIL_KEY = "board-trail";
const freshTrail = () => ({ dwell: {}, opened: [], modes: [], asked: [] });
const trailLog = (() => {
  try { return JSON.parse(sessionStorage.getItem(TRAIL_KEY) || "null") || freshTrail(); }
  catch (er) { return freshTrail(); }
})();
const saveTrail = () => {
  try { sessionStorage.setItem(TRAIL_KEY, JSON.stringify(trailLog)); } catch (er) {}
};
/* dwell: how long the pointer stayed on each study's tiles */
let dwellSlug = null, dwellT0 = 0;
const dwellEnd = () => {
  if (!dwellSlug) return;
  const ms = performance.now() - dwellT0;
  if (ms > 120) {
    trailLog.dwell[dwellSlug] = (trailLog.dwell[dwellSlug] || 0) + ms;
    saveTrail();
  }
  dwellSlug = null;
};
plane.addEventListener("pointerover", (e) => {
  const tile = e.target.closest && e.target.closest(".tile[data-slug]");
  if (!tile || tile.dataset.slug === dwellSlug) return;
  dwellEnd();
  dwellSlug = tile.dataset.slug;
  dwellT0 = performance.now();
});
plane.addEventListener("pointerout", (e) => {
  const tile = e.target.closest && e.target.closest(".tile[data-slug]");
  if (!tile) return;
  if (e.relatedTarget && tile.contains(e.relatedTarget)) return;
  dwellEnd();
});

/* the covers in the homepage's order: the floor the prediction stands on */
const ORDER = (window.BOARD_ITEMS || []).filter((i) => i.c != null)
  .sort((a, b) => a.c - b.c).map((i) => i.g)
  .filter((sl, i, arr) => GROUPS[sl] && arr.indexOf(sl) === i);
const shelfName = (tag) => {
  const r = (typeof rrows !== "undefined" ? rrows : [])
    .find((x) => x.dataset && x.dataset.tag === tag);
  const ink = r && r.querySelector(".rink");
  return ink ? ink.textContent.trim() : tag;
};
function predictNext(currentSlug) {
  const askedWords = trailLog.asked.join(" ").toLowerCase()
    .split(/[^a-z0-9]+/).filter((w) => w.length > 3);
  let best = null;
  for (const slug of ORDER) {
    if (slug === currentSlug) continue;
    const g = GROUPS[slug];
    let score = 0;
    const parts = [];
    for (const [on, ms] of Object.entries(trailLog.dwell)) {
      if (on === slug || !GROUPS[on]) continue;
      const shared = g.tags.filter((t) => GROUPS[on].tags.includes(t));
      if (!shared.length) continue;
      const v = Math.min(4, ms / 1500) * shared.length;
      score += v; parts.push({ v, kind: "dwell", on, tag: shared[0] });
    }
    for (const on of trailLog.opened) {
      if (on === slug || !GROUPS[on]) continue;
      const shared = g.tags.filter((t) => GROUPS[on].tags.includes(t));
      if (!shared.length) continue;
      const v = 2.5 * shared.length;
      score += v; parts.push({ v, kind: "opened", on, tag: shared[0] });
    }
    for (const m of trailLog.modes) {
      if (!g.tags.includes(m)) continue;
      score += 3; parts.push({ v: 3, kind: "mode", tag: m });
    }
    const hay = (slug + " " + g.t + " " + g.s + " " + g.tags.join(" ")).toLowerCase();
    for (const w of askedWords) {
      if (!hay.includes(w)) continue;
      score += 2; parts.push({ v: 2, kind: "asked", word: w });
    }
    if (trailLog.opened.includes(slug)) score *= 0.35;
    if (!best || score > best.score) best = { slug, score, parts };
  }
  if (!best || best.score <= 0) {
    const i = ORDER.indexOf(currentSlug);
    const slug = ORDER[(i + 1) % ORDER.length] || ORDER[0];
    return { slug, reason: "next in the house's order" };
  }
  const top = best.parts.sort((x, y) => y.v - x.v)[0];
  /* "since you opened Sally" is odd to read while you are on Sally;
     when the source is the study in front of you, say what it is */
  const here = top.on && top.on === currentSlug;
  const why = top.kind === "mode" ? "since you picked " + shelfName(top.tag)
    : here ? "like " + GROUPS[top.on].t
    : top.kind === "opened" ? "since you opened " + GROUPS[top.on].t
    : top.kind === "dwell" ? "since you stayed on " + GROUPS[top.on].t
    : "since you asked about " + top.word;
  return { slug: best.slug, reason: why };
}
/* ── THE COLUMNS ────────────────────────────────────────────────────
   The conversation is a row of columns inserted before the field,
   pushing the homepage right — no cap, and nothing truncated: a
   column only leaves when its × folds it back to the left. Each one
   scrolls on its own; the strip only moves sideways. EVERY HEAD IS A
   FIELD: keystrokes narrow the column they are typed in, Enter opens
   the next column after it. The rail keeps the path as rows of its
   own, and the house's next stands as a ghost column before the
   field, with its reason. */
const colsEl = document.getElementById("cols");
const ccols = [];
/* a column is a module: the kth open column stands at module k+1,
   after the statement, and is shown with the module before it — the
   statement for the first, the column it was asked from for the rest */
/* ── ONE READING SLOT ───────────────────────────────────────────────
   A column is shown in the far slot of the view — the right-hand one
   of the pair on desktop, the screen on a phone — whatever asked for
   it and wherever it stands in the row. The row glides by exactly
   what that takes, one module for a column that opened past the edge
   and nothing for one that opened beside the reader.

   It used to move by the least amount that put the column on screen,
   which sounds gentler and was not: a chain of Nexts landed the
   second study in the right slot, jumped the third to the left one,
   and the Next chip walked around under the cursor. Seated in one
   slot, the chip stays put, the study just read slides to the left
   beside the new one, and pressing Next is a loop: the work comes in
   from the right, the way the row reads, and keeps coming. A column
   wider than the view is shown from its own left edge, since there is
   no move that fits all of it. */
const reveal = (c) => {
  if (ccols.indexOf(c) < 0) return;
  pageTo(dispOf(c) + spanOf(c) - VISIBLE);
};
const showCol = reveal;

/* the studies the board knows, matched the way the field is dimmed */
const stem = (w) => w.replace(/(ies)$/, "y").replace(/(es|s)$/, "");
/* the words that are in every sentence are in every study: asking
   "and" caught twenty-five of twenty-eight, which is not an answer.
   Hoisted out of the board's matcher because a study's own summary
   and abstract are now read by the same rules — one way of deciding
   what a word is worth, wherever the question lands. */
/* THE SHORT ONES DO THE MOST DAMAGE. A question keeps its short
   words because "AI" and "app" are real, and a short word is matched
   whole rather than as a substring — but "a", "is" and "it" stand
   whole in nearly every sentence written, so "what did it cost"
   answered with a sentence about eras and "how much does a rocket
   cost" answered with one about cabinet doors. Function words are
   never the thing being asked for. Single letters never are either. */
const STOPW = new Set(["the", "and", "for", "with", "that", "this", "you", "your",
  "from", "was", "are", "but", "not", "all", "any", "how", "what", "who", "why",
  "when", "does", "did", "done", "can", "about", "into", "out", "its", "his", "her",
  "their", "tell", "more", "some", "just", "them", "they", "have", "has", "had",
  "were", "an", "as", "at", "be", "been", "being", "by", "do", "if", "in", "is",
  "it", "of", "on", "or", "so", "to", "up", "we", "me", "my", "us", "am", "he",
  "she", "him", "there", "here", "then", "than", "also", "very", "much", "many",
  "most", "would", "should", "could", "will", "shall", "may", "might", "must",
  "let", "like", "look", "give", "show", "say", "said", "thing", "things"]);
const askWords = (text) => (text || "").toLowerCase().trim()
  .split(/[^a-z0-9']+/).filter((w) => w.length > 1 && !STOPW.has(w)).map(stem);
const escRe = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/* SHORT WORDS MATCH WHOLE OR NOT AT ALL: "ai" sits inside a dozen
   ordinary words, and as a substring it caught half the board */
const hasWord = (w, hay) => !!w && (w.length <= 3
  ? new RegExp("(^|[^a-z0-9])" + escRe(w) + "([^a-z0-9]|$)").test(hay)
  : hay.includes(w));
const studiesFor = (text) => {
  const lower = text.toLowerCase().trim();
  /* SHORT WORDS MATCH WHOLE OR NOT AT ALL. Two- and three-letter
     words were being dropped, so "AI tools" in the intro asked a
     question the house could not answer; as substrings they would
     have matched half the board instead, since "ai" sits inside a
     dozen ordinary words. A word boundary is the honest test for a
     short word and costs nothing for a long one. */
  const ws = askWords(text);
  return Object.entries(GROUPS).map(([folder, g]) => {
    const hay = (folder + " " + g.t + " " + g.s + " " + g.tags.join(" ") + " " + (g.d || "")).toLowerCase();
    let n = 0;
    for (const w of ws) if (hasWord(w, hay)) n += 1;
    if (lower.length >= 4 && hay.includes(lower)) n += 2;
    return { folder, g, n };
  }).filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
};
/* A SHELF NAMED INSIDE A QUESTION IS STILL A SHELF. The match was
   the whole line and nothing else, so "Interiors" opened the shelf
   and "do you have anything on interiors" fell through to a keyword
   search and answered nothing. The names are specific enough that
   typing one means it: nobody writes "staples" or "app development"
   in a sentence about something else. */
const shelfByText = (text) => {
  const q = text.toLowerCase().trim();
  const names = (x) => {
    const ink = x.querySelector(".rink").textContent.trim().toLowerCase();
    return [ink, ink.split("/")[0], x.dataset.tag];
  };
  const has = (name) => name && new RegExp("(^|[^a-z0-9])" + escRe(name) + "([^a-z0-9]|$)").test(q);
  const r = rrows.find((x) => x.dataset && x.dataset.tag && names(x).some((nm) => nm === q));
  if (r) return r.dataset.tag;
  const inside = rrows.find((x) => x.dataset && x.dataset.tag && names(x).some(has));
  return inside ? inside.dataset.tag : null;
};

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
function colNode(kind, caption) {
  const c = el("section", "ccol " + kind + " arriving");
  const cin = el("div", "cin");
  /* the head is the rail's row for this column, moved inside it: the
     chip that names it, carrying its own close */
  const head = el("div", "chead");
  const self = el("div", "cchip");
  self.appendChild(el("span", null, caption));
  const x = el("button", "cx", "\u00d7"); x.type = "button"; x.title = "Close this column";
  self.appendChild(x); head.appendChild(self);
  const body = el("div", "cbody");
  const lead = el("div", "clead");      /* the column's own sentence */
  const talk = el("div", "ctalk");      /* what was asked, and what came back */
  const ask = el("div", "cask");
  const line = el("input", "cline"); line.type = "text"; line.autocomplete = "off"; line.spellcheck = false;
  line.placeholder = "Ask:"; line.setAttribute("aria-label", "Ask from here");
  ask.appendChild(line);
  const matter = el("div", "cmatter"); /* its rows, or its pictures */
  body.appendChild(lead); body.appendChild(talk); body.appendChild(ask); body.appendChild(matter);
  cin.appendChild(head); cin.appendChild(body); c.appendChild(cin);
  c.__line = line; c.__head = head; c.__body = body; c.__lead = lead;
  c.__talk = talk; c.__matter = matter; c.__caption = caption; c.__kind = kind;
  x.addEventListener("click", () => closeColumn(c));
  /* TWO SPEEDS, ONE FIELD: keystrokes narrow whatever rows the column
     is holding, and the return key asks */
  line.addEventListener("input", () => narrowColumn(c, line.value));
  line.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const t = line.value.trim(); line.value = ""; narrowColumn(c, "");
      if (t) askFrom(c, t);
    }
    if (e.key === "Escape") { line.value = ""; narrowColumn(c, ""); line.blur(); }
  });
  /* a horizontal wheel over a column walks the strip; vertical scrolls the column */
  c.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2) {
      e.preventDefault();
      const now = performance.now();
      if (now - hCool > 320 && Math.abs(e.deltaX) > 12) { pageTo(colIdx + Math.sign(e.deltaX) * PAGE); hCool = now; }
    }
  }, { passive: false });
  return c;
}
/* ── WHAT THE HOUSE CAN SAY ABOUT A STUDY ──────────────────────────
   A field that answers can only answer with what it holds, and that
   was a title, a category and one line — so "tell me more about this
   project" was read as a search, caught the word "project" somewhere
   on the board and offered a stranger. Each study file already
   carries the two things a reader asks for: the meta block's summary
   (Built, Scope, Materials, Angle) and the abstract, three paragraphs
   of the study's own prose. `npm run board` mines both into
   board-copy.json, fetched the first time a study column opens, so
   the board's first paint does not carry 30 abstracts it may never
   show. EVERY WORD THE HOUSE SAYS HERE IS A WORD JEREMY WROTE. */
let COPY = null, copyReq = null;
const loadCopy = () => copyReq || (copyReq = fetch("/lab/board-copy.json")
  .then((r) => r.json()).then((j) => (COPY = j))
  .catch(() => (COPY = {})));
/* a sentence ends on a word ending in . ! or ? — unless that word is
   an initial, or A.R.C. is three sentences */
const sentences = (p) => {
  const out = []; let buf = "";
  p.split(/\s+/).forEach((w) => {
    buf += (buf ? " " : "") + w;
    if (/[.!?]["')\]]?$/.test(w) && !/(^|\.)[A-Za-z]\.$/.test(w)) { out.push(buf); buf = ""; }
  });
  if (buf) out.push(buf);
  return out;
};
const scoreOf = (hay, ws) => { let n = 0; for (const w of ws) if (hasWord(w, hay)) n += 1; return n; };
function answerAbout(c, q, hits) {
  const src = (COPY || {})[c.__folder] || { facts: [], para: [] };
  const ws = askWords(q);
  /* MORE IS A MOVE, NOT A SEARCH. "Tell me more", "what else", or a
     question with no word worth matching, all mean the same thing:
     the next paragraph of the study's own abstract. Asking again
     walks on, which is what a conversation does. */
  if (!ws.length || /\b(more|else|go on|continue|keep going|another|expand)\b/.test(q.toLowerCase())) {
    const i = c.__para || 0;
    if (src.para[i]) { c.__para = i + 1; return { line: src.para[i] }; }
    return { line: src.para.length
      ? "That is what the board carries. The full study has the rest."
      : "The board holds no more of this one. The full study does." };
  }
  /* THE LABEL IS WORTH MORE THAN THE LINE. "What materials did you
     use" scored the Angle line above the Materials line, because
     Angle happens to contain both "materials" and "use" while the
     Materials line contains neither of those words — it contains the
     materials. Naming the field is the strongest signal a question
     carries, so it outweighs anything the values happen to say. */
  let fact = null;
  for (const f of src.facts) {
    const lab = scoreOf(f.k.toLowerCase(), ws), val = scoreOf(f.v.toLowerCase(), ws);
    const sc = lab * 3 + val;
    if (sc && (!fact || sc > fact.sc)) fact = { f, sc, lab };
  }
  let sent = null;
  for (const p of src.para) for (const x of sentences(p)) {
    const sc = scoreOf(x.toLowerCase(), ws);
    if (sc && (!sent || sc > sent.sc)) sent = { x, sc };
  }
  /* the question named a field: answer with that field */
  if (fact && fact.lab) return { line: fact.f.v };
  /* otherwise the abstract's own sentence is the more particular
     answer, and a tie goes to it */
  if (sent && (!fact || sent.sc >= fact.sc)) return { line: sent.x };
  if (fact) return { line: fact.f.v };
  /* WHY IS THE ONE QUESTION THE SUMMARY NAMES OUTRIGHT. Angle is the
     study's own answer to it and 27 of the 29 carry one, so a why
     that caught nothing else is answered rather than refused. */
  if (/\bwhy\b/.test(q.toLowerCase())) {
    const a = src.facts.find((x) => /angle/i.test(x.k));
    if (a) return { line: a.v };
  }
  /* only then is it a question about something else on the board —
     and only a study that caught two of the words, since one loose
     word is how "how much does a rocket cost" found six studies */
  const strong = hits.filter((h) => h.n >= 2);
  if (strong.length) return {
    line: strong.length > 4 ? strong.length + " on the board:" : "Not in this one. On the board:",
    hits: strong.slice(0, 4) };
  const hl = houseLine(q);
  if (hl) return { line: hl };
  return { line: "Nothing here answers that. The full study may." };
}

/* ── A SENTENCE ANSWERS IN PLACE, A THING OPENS A COLUMN ───────────
   The house answering with words is a reply, and a reply belongs in
   the column it was asked in; answering with a study or a long index
   is somewhere to go, and that is a column of its own. Between them
   sit the small catches, four or fewer, which name themselves as
   chips inline rather than spending a whole module on three rows. */
async function sayIn(c, q, hits) {
  trailLog.asked.push(q); saveTrail();
  /* a study answers out of its own copy; the wait is one fetch, once */
  await loadCopy();
  /* IN THE HOUSE'S ROOMS THE HOUSE ANSWERS FIRST. "How does it start?"
     asked in Info was finding one study with "start" in it and
     offering that, because the board's catches were consulted before
     the house's own notes; the notes are the room's whole point. */
  const hl = c.__house ? houseLine(q) : null;
  const said = /reach|contact|email|hire|talk/.test(q.toLowerCase())
    ? { line: "hello@reckon.house. Or keep asking here." }
    : c.__folder ? answerAbout(c, q, hits)
    : hl ? { line: hl }
    : { line: !hits.length ? (houseLine(q) || "Nothing caught on the board. The homepage's brain reads deeper.")
        : hits.length === 1 ? "One." : hits.length + " of them.", hits: hits.slice(0, 4) };
  pushTurn(c, q, said.line, said.hits);
}
function pushTurn(c, q, line, hits) {
  const cin = c.querySelector(".cin");
  const before = cin.scrollHeight;
  const turn = el("div", "cturn");
  turn.appendChild(el("div", "cq", q));
  turn.appendChild(el("div", "ca g", line));
  if (hits && hits.length) {
    const row = el("div", "cchips");
    hits.forEach(({ folder, g }) => {
      const b = el("button", "cchip", g.t); b.type = "button";
      b.addEventListener("click", () => openStudyColumn(folder, {}, c));
      row.appendChild(b);
    });
    turn.appendChild(row);
  }
  c.__talk.appendChild(turn);
  /* by exactly what it added, so the field does not move */
  cin.scrollTop += cin.scrollHeight - before;
}
function narrowColumn(c, text) {
  const rows = c.__body.querySelectorAll(".crow");
  if (!rows.length) return;
  const hits = text.trim() ? new Set(studiesFor(text).map((x) => x.folder)) : null;
  rows.forEach((r) => r.classList.toggle("off", !!hits && !hits.has(r.dataset.folder)));
}
/* each study's cover, by folder: the same picture the homepage leads
   that study with, so a row in a column and a tile in the field are
   plainly the same thing */
const coverOf = (() => {
  const m = {};
  (window.BOARD_ITEMS || []).forEach((i) => { if (i.c != null && m[i.g] == null) m[i.g] = i; });
  return m;
})();
/* ── ONE ROW IN THREE MOVES ─────────────────────────────────────────
   The house already owns a reel: the rail's category stamps cut
   through a shelf's covers with szStage and szStart, lifted from the
   homepage function for function. A list of studies is the same kind
   of object, so it uses the same machinery rather than a second one —
   the rule is where it stands, not how it cuts.

   Every third row, and the first row never: a still you recognise
   opens the list and the motion starts one down, so no two moving
   rows are ever adjacent and a column of fourteen carries four or
   five of them. A row reels only while it is on screen, and only if
   its study has three pictures to cut between; two frames is a blink,
   not a reel. Reduced motion gets none of it, which szStart already
   honours. */
/* ── THE REEL REELS ─────────────────────────────────────────────────
   Faux Reel is a tool that cuts still photographs fast enough to read
   as motion, and the board holds exactly one picture of it: the page
   renders the thing live, so there is nothing else to photograph. A
   study about a reel that sits still in a list is the one row on the
   board that has to move, so it cuts through the house's own pulls —
   which is not a stand-in for the product, it is the product's job. */
const ALWAYS_REEL = { sizzle: "inspiration" };
const reelFrames = (folder) => {
  const all = (window.BOARD_ITEMS || []).filter((i) => i.g === folder);
  const cv = coverOf[folder];
  const rest = all.filter((i) => !cv || i.t !== cv.t);
  const own = cv ? [cv, ...rest] : rest;
  const borrow = ALWAYS_REEL[folder];
  const more = borrow
    ? (window.BOARD_ITEMS || []).filter((i) => i.g === borrow).slice(0, 8) : [];
  return own.concat(more).slice(0, 8).map((i) => i.t);
};
/* on screen it runs, off screen it stops. The viewport is the root,
   and a scrolling column clips against it like any other ancestor, so
   one observer serves every list on the board. */
const reelIO = new IntersectionObserver((es) => {
  es.forEach((e) => {
    const rl = e.target.__rl; if (!rl) return;
    if (e.isIntersecting) szStart(rl); else szStop(rl);
  });
});
function studyRows(list, into, from) {
  const wrap = el("div", "crows");
  list.forEach(({ folder, g }, idx) => {
    const r = el("div", "crow"); r.dataset.folder = folder;
    const cv = coverOf[folder];
    const frames = reelFrames(folder);
    /* every third row, and any study that IS a reel */
    if ((idx % 3 === 1 || ALWAYS_REEL[folder]) && frames.length >= 3 && !REDUCE()) {
      const box = el("div", "creel sz-stage");
      r.appendChild(box);
      const rl = { box, frames, timer: null };
      szStage(rl);
      r.__rl = rl;
      reelIO.observe(r);
    } else if (cv) {
      const im = el("img"); im.src = encodeURI(cv.t); im.alt = ""; im.loading = "lazy";
      /* the row's picture is 96px wide and was holding a 1536px bitmap */
      const ss = srcsetFor(cv); if (ss) { im.srcset = ss; im.sizes = "96px"; }
      r.appendChild(im);
    } else {
      /* a study the board has no picture of keeps the row's shape
         rather than an img with no src, which the browser draws as a
         torn page */
      r.appendChild(el("div", "creel"));
    }
    const t = el("div");
    t.appendChild(el("b", null, g.t + " "));
    t.appendChild(el("span", "g", g.s));
    r.appendChild(t);
    r.addEventListener("click", () => openStudyColumn(folder, {}, from));
    wrap.appendChild(r);
  });
  into.appendChild(wrap);
}
/* a column that folds away takes its reels with it: a timer left
   running on a detached row is the leak the last pass went looking
   for and did not find */
const stopReels = (c) => c.querySelectorAll(".crow, .cmarks").forEach((r) => {
  if (r.__rl) { szStop(r.__rl); reelIO.unobserve(r); r.__rl = null; }
});
/* ── each column on its own module ──────────────────────────────────
   Margins carry the work between columns: a column's left margin is
   the modules between its anchor and the previous column's, so the
   flex row lays every column on its own module, and the widths, which
   are what arrive and fold, push the rest along. */
/* Over the ROW as it stands, not over the open columns. A column that
   is folding away has left ccols but is still in the row for another
   half second, still holding its margin, and laying out only the open
   ones made every column after it measure from the wrong neighbour.
   The old answer was to zero the folding column's margin, which put
   it back where the row would have it — and that meant it flew left
   across its neighbour to get there before it folded. Anything with
   an anchor is part of the row while it is in the row. */
const layoutCols = () => {
  let prev = 0;
  for (const c of colsEl.children) {
    if (c.__after == null) continue;
    c.style.marginLeft = ((c.__after - prev) * MOD_X) + "px";
    prev = c.__after;
  }
};
/* every mounted tile re-reads how far it stands aside, and the
   transition carries the ones that changed. The window is re-read
   once the slide is over: what slid off is let go, what slid on
   arrives. */
const reshift = () => {
  for (const [u, f] of fcols) {
    const sh = shiftAt(u);
    if (sh !== f.__sh) { f.__sh = sh; f.style.translate = sh + "px 0"; }
  }
  setTimeout(remount, 540);
};
function insertColumn(c, from, opts) {
  opts = opts || {};
  /* RIGHT AFTER WHATEVER ASKED, before that thing's earlier answers,
     so the newest stands nearest the asker: a column, a tile's
     module, the statement. From the rail, which has no place in the
     row, it is whatever stands at the near edge of the view. */
  let at;
  if (from && ccols.indexOf(from) >= 0) {
    c.__after = from.__after; at = ccols.indexOf(from) + 1;
  } else {
    let u = opts.at;
    if (u == null) {
      const here = atDisp(colIdx);
      if (here.col) return insertColumn(c, here.col, {});
      u = here.u;
    }
    /* on a phone the field is one period and a column spans both its
       modules, so it can only stand after the whole of it, whichever
       tile asked: anchored inside the pair it would split the grid */
    if (PHONE) u = COLS - 1;
    c.__after = u;
    at = ccols.findIndex((x) => x.__after >= u);
    if (at < 0) at = ccols.length;
  }
  ccols.splice(at, 0, c);
  if (PHONE) {
    /* two modules: the screen */
    c.__span = 2; c.style.setProperty("--span", 2);
    /* the sheet stands above the row, so a room opened from it would
       arrive under it: the answer happens on the glass */
    if (window.toggleSheet) toggleSheet(false);
  }
  const next = ccols[at + 1];
  if (next) colsEl.insertBefore(c, next); else colsEl.appendChild(c);
  layoutCols();
  nav.classList.add("threadon");
  reshift(); drawPath();
  /* THE AIM IS TAKEN NOW, THE BOX OPENS NEXT FRAME. Only the class
     swap needs a frame between zero and full width for the transition
     to have something to run from; where the field should point does
     not, and putting it inside the frame meant a parked tab never
     aimed at all — rAF does not run in the background, setTimeout
     does, which is why the fallback is there too. */
  reveal(c);
  const open = () => c.classList.remove("arriving");
  requestAnimationFrame(open);
  setTimeout(open, 60);
  /* not on a phone: focus raises the keyboard over the column that
     just opened, before a word of it is read */
  if (!PHONE) setTimeout(() => c.__line.focus({ preventScroll: true }), 560);
}
function askFrom(from, text, opts) {
  opts = opts || {};
  const t = (text || "").trim(); if (!t) return;
  /* in Connect, a word for the calendar is the calendar */
  if (from && from.__house === "connect" && WANTS_TIME.test(t)) {
    pushTurn(from, t, "Pick a time below.");
    if (from.__showWeek) from.__showWeek();
    return;
  }
  /* inside Connect the field is the form until the form is sent */
  if (from && from.__intake) return intake(from, t);
  /* a way to reach him is a room, not a line */
  if (/\b(reach|contact|hire|talk|get in touch|email you|work with you)\b/.test(t.toLowerCase()) || WANTS_TIME.test(t))
    return openHouseColumn("connect", from, opts);
  const byTitle = Object.entries(GROUPS).find(([, g]) => g.t.toLowerCase() === t.toLowerCase());
  if (byTitle) return openStudyColumn(byTitle[0], { at: opts.at }, from);
  const tag = shelfByText(t);
  if (tag) return openShelfColumn(tag, from, opts);
  const hits = studiesFor(t);
  /* ASKED FROM A COLUMN, IT STAYS IN THE COLUMN. A study always
     answers in place: it holds its own words, and a vague question
     inside one should not spend a module on six loose matches. A list
     or an answer is an index already, so a result too long to name
     inline still earns an index of its own. */
  const inCol = from && ccols.indexOf(from) >= 0;
  if (inCol && (from.__folder || hits.length <= 4)) return sayIn(from, t, hits);
  const c = colNode("answer", t);
  if (hits.length) c.__needle = t.toLowerCase();
  const note = el("div", "cnote g");
  if (/reach|contact|email|hire|talk/.test(t.toLowerCase())) note.textContent = "hello@reckon.house. Or keep asking here.";
  else if (!hits.length) note.textContent = "Nothing caught on the board. The homepage's brain reads deeper.";
  else note.textContent = hits.length === 1 ? "One study." : hits.length + " studies, " + hits[0].g.t + " first.";
  c.__lead.appendChild(note);
  if (hits.length) studyRows(hits, c.__matter, c);
  insertColumn(c, from, opts);
}
window.askFrom = askFrom;
/* ── THE HOUSE'S TWO ROOMS ──────────────────────────────────────────
   The site's footer is not a footer on the board, because the board
   has no bottom. Its pieces are things the system already has. The
   method notes and the credits are rows; the ways in are chips; the
   form is the field, since a form is a conversation with the turns
   laid out in advance. Info and Connect are those, as columns, black,
   opened from the rail or by asking, and everything they say is
   mined from the footer's own source. */
const HOUSE = () => (COPY && COPY.house) || { method: [], links: [], credits: [], services: [], practice: [] };
/* what a first visitor does not yet know to ask; the answers are the
   footer's method notes and its credits, which houseLine already
   holds */
const HOUSE_QUESTIONS = ["How does it start?", "What do you take on?", "When is it done?", "Who have you worked with?"];
/* the live footer's marks, by the credit they stand for. Haven has no
   mark and is spoken, not shown. */
const MARKS = { "Crate & Barrel": "/brands/crate-barrel.svg", "Nordstrom": "/brands/nordstrom.svg",
  "Ivy Park by Beyonc\u00e9": "/brands/ivy-park.svg", "Neiman Marcus": "/brands/neiman-marcus.svg",
  "Rejuvenation": "/brands/rejuvenation.png", "Lostine Home": "/brands/lostine.avif",
  "Visual Comfort": "/brands/visual-comfort.webp", "Floor & Decor": "/brands/floor-decor.svg",
  "Kingston Brass": "/brands/kingston-brass.webp", "Design Within Reach": "/brands/dwr.jpg",
  "Vivir Homes": "/brands/vivir-homes.webp" };
const textRow = (into, head, body) => {
  const r = el("div", "crow text");
  const t = el("div");
  if (head) t.appendChild(el("b", null, head + (body ? " " : "")));
  if (body) t.appendChild(el("span", "g", body));
  r.appendChild(t); into.appendChild(r); return r;
};
async function openHouseColumn(kind, from, opts) {
  await loadCopy();
  const h = HOUSE();
  const isInfo = kind === "info";
  const c = colNode(kind, isInfo ? "Info" : "Connect");
  c.classList.add("dark");
  c.__house = kind;
  if (isInfo) {
    /* the About line, split where it turns from what he does to how
       he works, which is the same seam the two registers sit on */
    const about = (RAIL_NOTES.info[0] || [])[1] || "";
    const cut = about.indexOf("Independent");
    const d = el("div", "cnote", (cut > 0 ? about.slice(0, cut) : about).trim() + " ");
    if (cut > 0) d.appendChild(el("span", "g", about.slice(cut).trim()));
    c.__lead.appendChild(d);
    /* the questions, unless they were put away */
    let off = false;
    try { off = sessionStorage.getItem("board.qs") === "off"; } catch (e) { off = false; }
    if (!off) {
      const qs = el("div", "cqs");
      HOUSE_QUESTIONS.forEach((q) => {
        const b = el("button", "cchip", q); b.type = "button";
        b.addEventListener("click", () => { b.classList.add("spent"); askFrom(c, q); });
        qs.appendChild(b);
      });
      const x = el("button", "cx", "\u00d7"); x.type = "button"; x.title = "Put the questions away";
      x.addEventListener("click", () => { qs.remove(); try { sessionStorage.setItem("board.qs", "off"); } catch (e) { /* fine */ } });
      qs.appendChild(x);
      c.__matter.appendChild(qs);
    }
    c.__matter.appendChild(el("div", "cnote g csect", "Worked with, spotted by & featured in."));
    const frames = h.credits.map((name) => MARKS[name]).filter(Boolean);
    if (frames.length >= 2) {
      const stage = el("div", "cmarks sz-stage");
      c.__matter.appendChild(stage);
      const rl = { box: stage, frames, timer: null };
      szStage(rl); szScrub(rl);
      stage.__rl = rl; reelIO.observe(stage);
    }
  } else {
    /* ALL IN ONE. /book's own lede, then the field as the message,
       then the week and the claim, then the ways in as plain links —
       the room holds the whole of reaching him, and nothing in its
       head but its name. */
    const bk = h.book || { lede: "Have a project in mind?", dim: "", minutes: 30 };
    const d = el("div", "cnote", bk.lede + (bk.dim ? " " : ""));
    if (bk.dim) d.appendChild(el("span", "g", bk.dim));
    c.__lead.appendChild(d);
    c.__intake = { step: "body" };
    c.__line.placeholder = "The project:";
    c.__matter.appendChild(el("div", "cmonth g", "Loading the week"));
    buildWeek(c, bk.minutes);
    const ways = el("div", "cways");
    const link = (text, href, ext) => { const u = el("u"); const a = el("a", null, text); a.href = href;
      if (ext) { a.target = "_blank"; a.rel = "noopener"; } u.appendChild(a); return u; };
    ways.appendChild(link("Or hello@reckon.house", "mailto:hello@reckon.house"));
    h.links.filter((l) => /^https?:/.test(l.v)).forEach((l) => {
      ways.appendChild(el("span", "g", "\u00b7")); ways.appendChild(link(l.k, l.v, true));
    });
    c.__matter.appendChild(ways);
  }
  insertColumn(c, from, opts);
}
/* ── THE WEEK ───────────────────────────────────────────────────────
   Read from GET /api/book, the same availability() /book renders from,
   per request: a week drawn from the rules alone would lie the moment
   anyone claimed a slot. The first day with an opening stands open;
   a press on a day moves the drawer; a press on a time is the pick,
   and the claim's two lines appear under it. Times read in the
   reader's zone, as /book shows them. */
async function buildWeek(c, minutes) {
  const month = c.__matter.querySelector(".cmonth");
  let data = null;
  try { const r = await fetch("/api/book", { cache: "no-store" }); if (r.ok) data = await r.json(); } catch (e) { data = null; }
  if (!c.isConnected && !ccols.includes(c)) return;
  if (!data || !data.ok || !Array.isArray(data.days) || !data.days.length) {
    month.textContent = "";
    month.insertAdjacentElement("afterend", el("div", "cnote g", "Times are down right now. hello@reckon.house works."));
    return;
  }
  const mins = data.minutes || minutes || 30;
  const mo = new Intl.DateTimeFormat("en-US", { month: "long" });
  const wd = new Intl.DateTimeFormat("en-US", { weekday: "narrow" });
  const local = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateOf = (d) => new Date(d + "T12:00:00Z");
  month.textContent = mo.format(dateOf(data.days[0].date));
  const wrap = el("div", "cweek");
  const gone = new Set();
  let picked = null, claim = null;
  const rows = data.days.map((day) => {
    const dt = dateOf(day.date);
    const openN = day.slots.filter((s2) => s2.open).length;
    const r = el("div", "cday " + (openN ? "has" : "shut"));
    const num = el("div", "cnum");
    num.appendChild(document.createTextNode(String(dt.getUTCDate()).padStart(2, "0")));
    num.appendChild(el("span", "g", wd.format(dt)));
    r.appendChild(num);
    r.appendChild(el("div", "ccount", openN ? openN + " open" : ""));
    const slots = el("div", "cslots");
    day.slots.forEach((s2) => {
      const label = local.format(new Date(s2.at)).replace(" ", "");
      if (!s2.open) { slots.appendChild(el("span", "ctime gone", label)); return; }
      const b = el("button", "ctime", label); b.type = "button"; b.dataset.at = s2.at;
      b.addEventListener("click", (e) => { e.stopPropagation(); pick(s2.at, b); });
      slots.appendChild(b);
    });
    r.appendChild(slots);
    const show = () => { rows.forEach((x) => x.classList.remove("open")); r.classList.add("open"); };
    if (openN) {
      /* the hand moves the drawer, and it never closes to nothing:
         an open day is information, not a flourish */
      r.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(); });
      r.addEventListener("click", () => { if (!r.classList.contains("open")) show(); });
    }
    r.__show = show;
    wrap.appendChild(r);
    return r;
  });
  const first = rows.find((r) => r.classList.contains("has"));
  if (first) first.classList.add("open");
  month.insertAdjacentElement("afterend", wrap);
  /* the claim: name, email, and the word */
  const pick = (at, btn) => {
    picked = at;
    wrap.querySelectorAll(".cchip.on").forEach((x) => x.classList.remove("on"));
    btn.classList.add("on");
    if (!claim) {
      claim = el("div", "cbook");
      const nm = el("input", "cline"); nm.type = "text"; nm.placeholder = "Name:"; nm.autocomplete = "name";
      const em = el("input", "cline"); em.type = "email"; em.placeholder = "Email:"; em.autocomplete = "email";
      /* the field may already have asked: a name and an address given
         once are not asked for twice, only shown, still editable */
      if (c.__contact) { nm.value = c.__contact.name || ""; em.value = c.__contact.email || ""; }
      const go = el("button", "cchip", "Book " + mins + " minutes"); go.type = "button";
      claim.appendChild(nm); claim.appendChild(em); claim.appendChild(go);
      wrap.insertAdjacentElement("afterend", claim);
      const send = async () => {
        const name = nm.value.trim(), email = em.value.trim();
        if (!picked) return;
        if (!name) { nm.focus(); return; }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { em.focus(); return; }
        go.textContent = "Booking";
        let j = null, status = 0;
        try {
          const res = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ at: picked, name, email, note: (c.__intake && c.__intake.body) || undefined }) });
          status = res.status; j = await res.json();
        } catch (e) { j = null; }
        if (j && j.ok) {
          pushTurn(c, name + ", " + email, "Booked. " + mins + " minutes" + (j.when ? ", " + j.when : "") + ". A confirmation is on its way to your inbox.");
          claim.remove(); claim = null; picked = null;
          return;
        }
        if (status === 409) {
          const b = wrap.querySelector('.cchip[data-at="' + picked + '"]');
          if (b) { b.classList.remove("on"); b.classList.add("gone"); }
          gone.add(picked); picked = null;
          go.textContent = "Book " + mins + " minutes";
          pushTurn(c, "", "That time just went. Pick another.");
          return;
        }
        go.textContent = "Book " + mins + " minutes";
        pushTurn(c, "", (j && j.why) || "That didn't go through. hello@reckon.house reaches me directly.");
      };
      go.addEventListener("click", send);
      [nm, em].forEach((i) => i.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }));
    }
    const empty = [...claim.querySelectorAll("input")].find((i) => !i.value.trim());
    (empty || claim.querySelector("button")).focus({ preventScroll: true });
  };
  /* the field can point at the week: "let's schedule" opens the
     first day with a time in it and says so */
  c.__showWeek = () => {
    const open = rows.find((r) => r.classList.contains("open")) || first;
    if (open) { open.__show(); open.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
  };
}
async function intake(c, text) {
  const it = c.__intake; const t = text.trim(); if (!it || !t) return;
  if (it.step === "body") {
    it.body = t; it.step = "email";
    c.__line.placeholder = "Email:";
    return pushTurn(c, t, "And where should I write back?");
  }
  if (it.step === "email") {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t)) return pushTurn(c, t, "That does not look like an address. Where should I write back?");
    it.email = t; it.step = "name";
    c.__line.placeholder = "Name:";
    return pushTurn(c, t, "And your name?");
  }
  if (it.step === "name") {
    it.name = t; it.step = "sending";
    c.__line.placeholder = "Ask:";
    pushTurn(c, t, "Sending.");
    let ok = false;
    try {
      const res = await fetch("/api/message", { method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: it.name, email: it.email, body: it.body }) });
      ok = res.ok;
    } catch (e) { ok = false; }
    const last = c.__talk.querySelector(".cturn:last-child .ca");
    if (last) last.textContent = ok
      ? "Sent. I will write back. If you want to talk it through first, pick a time below."
      : "That did not send. hello@reckon.house works.";
    it.step = ok ? "done" : "body";
    if (ok) { c.__contact = { name: it.name, email: it.email }; if (c.__showWeek) c.__showWeek(); }
    else c.__line.placeholder = "The project:";
    return;
  }
  /* after a send the field is a field again */
  c.__intake = null;
  return askFrom(c, t);
}
/* a word for the calendar, typed anywhere in the room, is the
   calendar, not a search: the field points at the week */
const WANTS_TIME = /\b(schedule|book|booking|calendar|call|meet|meeting|a time|talk it through|when are you free)\b/i;
/* what the house says about itself, wherever it is asked: a method
   note by its head, the credits by their question */
function houseLine(q) {
  const h = HOUSE(); const ws = askWords(q); const lower = q.toLowerCase();
  if (/worked with|clients?\b|featured|spotted|who have you/.test(lower) && h.credits.length)
    return h.credits.join(" \u00b7 ") + ".";
  if (/\bservices?\b|what do you (do|offer)|offer/.test(lower) && h.services.length)
    return h.services.join(". ") + ".";
  let best = null;
  for (const m of h.method) {
    /* the head's own words against the question, not only the
       question's against the head: "done" is a stop word everywhere
       else, and "When is it done?" has no other word in it */
    const heads = m.k.toLowerCase().split(/[^a-z']+/).filter((w) => w.length >= 4).map(stem);
    const byHead = heads.filter((w) => lower.includes(w)).length * 3;
    const sc = byHead + scoreOf(m.k.toLowerCase(), ws) * 3 + scoreOf(m.v.toLowerCase(), ws);
    if (sc && (!best || sc > best.sc)) best = { m, sc };
  }
  return best ? best.m.v : null;
}
function openShelfColumn(tag, from, opts) {
  const hits = Object.entries(GROUPS).filter(([, g]) => g.tags.includes(tag)).map(([folder, g]) => ({ folder, g }));
  const c = colNode("list", shelfName(tag));
  c.__mode = tag;
  c.__lead.appendChild(el("div", "cnote g", tag === "staples"
    ? "Staples are the pulls and the kept lines, not studies."
    : hits.length + (hits.length === 1 ? " study." : " studies.")));
  /* ── THE SHELF THAT HOLDS NO STUDIES ──────────────────────────────
     Every other shelf is a list of studies; Staples is the one that
     is not, and asking GROUPS for studies tagged "staples" is asking
     for something that by definition does not exist — so the column
     said what it was and then showed nothing. It holds the pulls and
     the kept lines themselves, woven the way the board weaves them:
     a run of pictures, a line, a run of pictures. */
  if (tag === "staples") {
    /* ── A HANDFUL, THEN ALL OF THEM, TWICE AS WIDE ──────────────────
       A hundred and four pictures down one module is a corridor. The
       shelf opens with a dozen and a way in; See all takes the column
       to two modules and runs the rest as masonry, which is what the
       board itself is — the room grows into the shape the material
       already wanted, and the work steps aside by two instead of one
       because the row is counted in modules either way. */
    const pulls = (window.BOARD_ITEMS || []).filter((i) => i.g === "inspiration");
    const FEW = 12;
    const pics = el("div", "cpics");
    const put = (it, i) => {
      const q = QUOTES[Math.floor(i / 34) - 1];
      if (q && i % 34 === 0) {
        const line = el("div", "cline-quote", "\u201c" + q.text + "\u201d");
        line.appendChild(el("span", "att g", q.att));
        pics.appendChild(line);
      }
      const im = el("img"); im.src = encodeURI(it.t); im.alt = ""; im.loading = "lazy";
      const ss = srcsetFor(it);
      if (ss) { im.srcset = ss; im.sizes = Math.ceil(COL) + "px"; }
      im.style.animationDelay = Math.min(0.4, (i % 8) * 0.05) + "s";
      if (it.w) im.style.maxWidth = Math.round(it.w / DPR) + "px";
      pics.appendChild(im);
    };
    const ways = el("div", "cways");
    const link = el("u", null, "See all " + pulls.length);
    ways.appendChild(link);
    c.__matter.appendChild(ways);
    c.__matter.appendChild(pics);
    pulls.slice(0, FEW).forEach(put);
    let wide = false;
    link.addEventListener("click", () => {
      wide = !wide;
      c.__span = wide ? 2 : 1;
      c.style.setProperty("--span", c.__span);
      pics.classList.toggle("wide", wide);
      if (wide && pics.childElementCount <= FEW) pulls.slice(FEW).forEach((it, i) => put(it, i + FEW));
      link.textContent = wide ? "Fewer" : "See all " + pulls.length;
      /* the row is a module wider or narrower than it was: the work
         steps, the path re-measures, and the view keeps the column */
      reshift(); drawPath(); reveal(c);
    });
    insertColumn(c, from, opts);
    return;
  }
  studyRows(hits, c.__matter, c);
  insertColumn(c, from, opts);
}
function openStudyColumn(folder, opts, from) {
  opts = opts || {};
  const g = GROUPS[folder]; if (!g) return;
  trailLog.opened.push(folder); saveTrail();
  loadCopy();   /* its own words, on the way */
  /* ── A STUDY IS NAMED BY ITS CHIP AND LEFT BY ITS NEXT ───────────
     The head used to be a field repeating the study's own title, with
     the house's offer written over it and a reason under that. Two
     chips say all of it and say it in the rail's own words: this
     study, with its close, and the one the house would go to. The
     reason went with them — a caption explaining a chip is more to
     read than the chip. */
  const nx = predictNext(folder);
  const ng = nx && GROUPS[nx.slug];
  const c = colNode("study", g.t);
  c.__folder = folder;
  if (ng) {
    c.__next = nx.slug;
    const nb = el("button", "cchip cnext"); nb.type = "button";
    nb.appendChild(el("span", "g", "Next:"));
    nb.appendChild(el("span", null, ng.t));
    nb.addEventListener("click", () => openStudyColumn(nx.slug, {}, c));
    c.__head.appendChild(nb);
  }
  /* the chip carries the name, so the column opens on the sentence */
  if (g.d) {
    const [fact, ...more] = g.d.split("|");
    const d = el("div", "cnote", fact.trim() + " ");
    const rest = more.join("|").trim(); if (rest) d.appendChild(el("span", "g", rest));
    c.__lead.appendChild(d);
  }
  const ways = el("div", "cways");
  const go = el("a", null, "Full case study"); go.href = "/case-studies/" + (g.h || folder);
  const gou = el("u"); gou.appendChild(go);
  ways.appendChild(gou);
  c.__matter.appendChild(ways);
  /* ── A CASE ARRIVES WITH ITS PICTURES ─────────────────────────────
     The cover the homepage leads with stands first and the rest of
     the study follows it down the column. There is no Preview link
     any more: it asked for a press to see the thing the column is
     for. Every frame is lazy, so the browser fetches what the scroll
     reaches and nothing else. */
  const pics = el("div", "cpics"); c.__matter.appendChild(pics);
  const files = (window.BOARD_ITEMS || []).filter((i) => i.g === folder);
  const cover = coverOf[folder];
  const order = files.filter((f) => !cover || f.t !== cover.t);
  if (cover) order.unshift(cover);
  order.forEach((it, i) => {
    const im = el("img"); im.src = encodeURI(it.t); im.alt = ""; im.loading = "lazy";
    const ss = srcsetFor(it);
    if (ss) { im.srcset = ss; im.sizes = Math.ceil(COL) + "px"; }
    im.style.animationDelay = Math.min(0.4, i * 0.05) + "s";
    /* ── NO PICTURE LARGER THAN ITS PIXELS, HERE TOO ────────────────
       The field's tiles are dealt under this rule and these were not:
       they took the column's full width, so on a 1900px window a 1280
       file was drawn at 751 and a 1099 one at 1.38x. CLAUDE.md's own
       backstop, the one PressingPlate uses — the picture stops at its
       honest width and takes the air rather than the magnification.
       Measured off the WIDEST file there is, not the rung the browser
       happened to take: a srcset may hand back the 768 for a box that
       could have carried the 1536, and capping to that would shrink
       the picture for a reason that has nothing to do with it. */
    if (it.w) im.style.maxWidth = Math.round(it.w / DPR) + "px";
    pics.appendChild(im);
  });
  insertColumn(c, from, opts);
}
/* ── WHAT THE FIELD SHOWS IS THE PATH'S NEWEST FILTER ───────────────
   A shelf column dims the field to its shelf and a question column
   to its words, so when that column is folded away the dim must go
   with it. It was outliving the column that set it: the field stayed
   dark with nothing on screen to explain why. Read it back from the
   path instead — the nearest filter walking from the newest column —
   and it can never disagree with what is open. */
function applyFromColumns() {
  let mode = null, needle = null;
  for (let i = ccols.length - 1; i >= 0; i -= 1) {
    if (ccols[i].__mode) { mode = ccols[i].__mode; break; }
    if (ccols[i].__needle) { needle = ccols[i].__needle; break; }
  }
  /* MODE survives only to light the rail's chip: it says which shelf
     is open, and no longer hides anything */
  MODE = mode; textDim = needle;
  rrows.forEach((r) => { if (r.dataset.tag) r.classList.toggle("picked", r.dataset.tag === mode); });
  applyTextDim();
}
function closeColumn(c) {
  const i = ccols.indexOf(c); if (i < 0) return;
  const d = dispOf(c);
  ccols.splice(i, 1);
  /* it keeps its margin and folds where it stands; the columns after
     it measure from it, so the fold is the only thing that moves them.
     Laid out once more when it actually leaves, which changes nothing
     on screen because by then its width is zero. */
  c.classList.add("closing"); stopReels(c);
  setTimeout(() => { c.remove(); layoutCols(); }, 520);
  layoutCols(); reshift(); drawPath(); applyFromColumns();
  if (!ccols.length) nav.classList.remove("threadon");
  /* THE VIEW STAYS ON WHAT IT WAS LOOKING AT. A column folding left
     of it moves that content one module left, so the view follows by
     one; one folding in view, or right of it, just lets the work
     slide back in. */
  /* and on a phone the column being read is a page of its own, so
     folding it pages back to whatever stood before it */
  if (PHONE ? d <= colIdx : d < colIdx) pageTo(colIdx - PAGE);
}
window.closeNewest = () => { if (ccols.length) closeColumn(ccols[ccols.length - 1]); };
function closeAllColumns() {
  ccols.slice().forEach((c) => {
    c.classList.add("closing"); stopReels(c);
    setTimeout(() => { c.remove(); layoutCols(); }, 520);
  });
  ccols.length = 0;
  nav.classList.remove("threadon"); reshift(); drawPath();
  applyFromColumns(); pageTo(0);
}

/* NO GHOST COLUMN. It stood past the newest column with the house's
   next in it, and the head of a study now says the same thing in the
   place the eye already is. One offer, not two. */
/* the path, as rows of the rail's own kind */
function drawPath() {
  let wrap = document.getElementById("pathwrap");
  if (!wrap) {
    wrap = el("div", "blk rdrawer"); wrap.id = "pathwrap";
    const rd = document.getElementById("rdrawer");
    rd.parentNode.insertBefore(wrap, rd);
  }
  wrap.innerHTML = "";
  ccols.forEach((c) => {
    const r = el("div", "rrow");
    const h = el("button", "rhead"); h.type = "button";
    const ink = el("span", "rink", c.__caption); h.appendChild(ink);
    const x = el("span", "rx", " \u00d7"); x.style.cssText = "margin-left:8px;color:rgba(0,0,0,0.42)";
    h.appendChild(x);
    h.addEventListener("click", (e) => { if (e.target === x) closeColumn(c); else showCol(c); });
    r.appendChild(h); wrap.appendChild(r);
  });
  wrap.style.display = ccols.length ? "" : "none";
  /* AFTER the display, or every row measures zero and keeps the 45%
     default — which is why these three all stood the same width while
     every other chip in the rail stopped at its own words. */
  if (window.__hug) window.__hug();
}
/* the keyboard says the same two things: left and right walk the
   columns, up and down move the page a screen at a time */
addEventListener("keydown", (e) => {
  if (e.target && e.target.tagName === "INPUT") return;
  /* one row: the arrows page it, work and conversation alike */
  if (e.key === "ArrowRight") { e.preventDefault(); pageTo(colIdx + 1); }
  if (e.key === "ArrowLeft") { e.preventDefault(); pageTo(colIdx - 1); }
  /* down and up are a column's now, so they ask the one at the near
     edge — the column being read. Over a conversation column they are
     the browser's already. */
  const step = (d) => {
    const here = atDisp(colIdx);
    const f = here.col ? null : fcols.get(here.u);
    if (!f) return;
    f.scrollBy({ top: d * innerHeight * 0.8, behavior: REDUCE() ? "auto" : "smooth" });
  };
  if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); step(1); }
  if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); step(-1); }
});

/* ── THE GUARD ──────────────────────────────────────────────────────
   The no-upscale rule is arithmetic at deal time, and arithmetic can
   be wrong about a file it never opened. This checks the pictures that
   actually loaded: device pixels asked for against pixels the file
   has. It reads offsetWidth, never a rect — a rect carries the hover
   scale and every ancestor transform, and would report a magnified
   picture as crisp, which is the exact mistake this exists to catch.

   Silent when everything is honest; one grouped warning when it is
   not, naming the worst offender. Runs once a second while anything is
   still arriving, then stops. */
function checkScale() {
  const bad = [];
  for (const el of live.values()) {
    const img = el.querySelector("img");
    if (!img || !img.naturalWidth || !img.offsetWidth) continue;
    const asked = img.offsetWidth * DPR;
    if (asked > img.naturalWidth + 1)
      bad.push({ src: img.src.split("/").pop(),
        asked: Math.round(asked), has: img.naturalWidth,
        over: +(asked / img.naturalWidth).toFixed(2) });
  }
  if (!bad.length) return true;
  bad.sort((a, b) => b.over - a.over);
  console.warn("board: " + bad.length + " picture(s) upscaled, worst " +
    bad[0].over + "x — " + bad[0].src +
    " (asked " + bad[0].asked + "px, has " + bad[0].has + ")");
  return false;
}
let checks = 0;
const checkTimer = setInterval(() => {
  checkScale();
  if (++checks > 8) clearInterval(checkTimer);
}, 1000);

/* ── the loop ── */
/* ── THE FLOOR AND THE CEILING OF THE ONE PAGE THERE IS ─────────────
   Written where the number is set, not in the frame loop: a clamp
   inside tick() is a clamp that does not exist while the tab is
   parked, and the value it was meant to hold has already been used
   by the mount. */
/* a phone's bar is at the bottom, so the last row scrolls up past it */
/* ── THE PLANE KEEPS X, AND ONLY X ──────────────────────────────────
   The floor and the ceiling of the one page there was are the
   browser's now: each column is a scroller with its own ends, its own
   momentum and its own rubber band. What is left here is the row. */
function tick() {
  requestAnimationFrame(tick);
  if (document.hidden) return;
  const turning = Math.abs(tgt.x - cur.x) > 0.5;
  if (turning !== wasTurning) {
    wasTurning = turning;
    plane.classList.toggle("turning", turning);
  }
  if (turning) pokeBurn();
  cur.x += (tgt.x - cur.x) * 0.11;
  plane.style.transform = "translate3d(" + (-cur.x) + "px,0,0)";
  /* the cover line is page content: it goes where the plane goes —
     but only AWAY. The field wraps, so a scroll upward from the start
     carries the plane down, and a mark riding it dropped into the
     rail, which is fixed. It holds at rest instead and leaves with
     the plane only upward, or leftward when paging. */
  /* the columns pan with the field in X only, like the rules */
  colsEl.style.transform = "translate3d(" + (-cur.x) + "px,0,0)";
  handover();
  swapSides();
  if (turning) placeAsk();
  /* the rules pan in X only, in the same frame, on the same thread */
  rulesEl.style.transform = "translate3d(" + (-cur.x) + "px,0,0)";
  if (Math.abs(cur.x - lastMount.x) > 100) remount();
  /* far from the start: a column open, the row moved, or the column
     being read taken well down its own length */
  const here = atDisp(colIdx), hf = here.col ? null : fcols.get(here.u);
  const far = ccols.length > 0 || Math.abs(cur.x - START.x) > MOD_X * 1.5 ||
    (hf ? hf.scrollTop > innerHeight * 1.4 : false);
  if (far !== home.hasAttribute("data-on"))
    far ? home.setAttribute("data-on", "") : home.removeAttribute("data-on");
}
/* ── THE DRIFT, lifted from the driver ─────────────────────────────
   Every image is cut taller than the frame that clips it, and walks
   the slack as its card crosses the glass. Verbatim except the frame
   of reference: on the homepage the card moves and the viewport is
   still; here the viewport is still and the plane moves under it. The
   rects are the same either way, which is why the code did not have
   to change.

   The slack itself is the stylesheet's --drift, read back off the
   image, so the two can never disagree. */
(() => {
  if (REDUCE()) return;
  const liveShots = new Set();
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) { liveShots.add(e.target); return; }
      liveShots.delete(e.target);
      const img = e.target.querySelector("img");
      if (img) img.style.transform = "";
    });
  }, { rootMargin: "12% 0px" });
  window.armDrift = (els) => els.forEach((el) => {
    const shot = el.querySelector && el.querySelector(".shot");
    if (shot) io.observe(shot);
  });
  const step = () => {
    requestAnimationFrame(step);
    if (document.hidden || !liveShots.size) return;
    const h = innerHeight;
    liveShots.forEach((shot) => {
      const img = shot.querySelector("img");
      if (!img || img.tagName !== "IMG") return;
      const r = shot.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (h - r.top) / (h + r.height)));
      const slack = Math.max(0, img.offsetHeight - shot.offsetHeight);
      img.style.transform =
        "translate3d(0," + (-p * slack).toFixed(2) + "px,0)";
    });
  };
  requestAnimationFrame(step);
})();

'''

rail = r'''
/* ── THE RAIL, the drawer the homepage already had ──────────────────
   Same DOM, same classes, same stylesheet: .rrow clipped to --hug at
   rest and flooding to ink on open, .rbody a 0fr→1fr grid, the pad's
   type 90ms behind the structure. Info and Connect open their notes;
   the five categories open a stamp-size reel of that category's own
   pictures and, on a second tap, filter the field.

   --hug is MEASURED per row, as on the homepage, because every label
   is a different length and a guessed percentage clips a word. */
const RAIL_NOTES = {
  info: [
    ["About", "Creative technologist. AI development. Brand systems. Digital design. Interior design. Independent, Texas. Design and build. I love the work."],
    ["News", "Awwwards Honors, 2026. Faux Reel released as an open repo. 28 case studies online."],
    ["Stack", "Coffee. Music. Ideas. To do lists. Claude. IPAs, and lagers, and stouts, and ales."],
  ],
  connect: [[null, "hello@reckon.house"]],
};
const FILTERS = [
  ["Digital Experiences", "digital", "Sites, stores and platforms, designed and shipped."],
  ["App Development", "app", "Native tools and AI products, built end to end."],
  ["Campaign/Creative", "creative", "Art direction and campaigns for retail's big names."],
  ["Interiors", "interiors", "Rooms designed like products, down to the hardware."],
  ["Staples", "staples", "Saved pictures and kept lines. None of it mine."],
];

const drawer = document.getElementById("rdrawer");
const rrows = [];
const closeRows = () => rrows.forEach((r) => r.classList.remove("open"));
const openOnly = (r) => rrows.forEach((o) => o.classList.toggle("open", o === r));
const mkRow = (label, slash) => {
  const r = document.createElement("div");
  r.className = "rrow";
  const h = document.createElement("button");
  h.type = "button";
  h.className = "rhead";
  const ink = document.createElement("span");
  ink.className = "rink";
  if (slash) {
    const sl = document.createElement("span");
    sl.className = "rslash";
    sl.textContent = "/";
    ink.appendChild(sl);
    ink.appendChild(document.createTextNode(" "));
  }
  ink.appendChild(document.createTextNode(label));
  h.appendChild(ink);
  const body = document.createElement("div");
  body.className = "rbody";
  const inner = document.createElement("div");
  const pad = document.createElement("div");
  pad.className = "rpad";
  inner.appendChild(pad);
  body.appendChild(inner);
  r.appendChild(h);
  r.appendChild(body);
  drawer.appendChild(r);
  rrows.push(r);
  r.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") openOnly(r);
  });
  return { r, h, pad };
};
const sub = (pad, cap, text) => {
  if (cap) {
    const c = document.createElement("div");
    c.className = "rsub";
    c.textContent = cap;
    pad.appendChild(c);
  }
  const t = document.createElement("div");
  t.className = "rtxt";
  t.textContent = text;
  pad.appendChild(t);
  return t;
};

/* Info and Connect were drawers in the rail. They are columns now,
   black, with the same anatomy as everything else, and the rail's
   chip is the door: press it to open the room, press it again to
   fold it. The drawers' copy moved into the columns. */
const toggleHouse = (kind) => {
  const had = ccols.find((c) => c.__house === kind);
  if (had) closeColumn(had); else openHouseColumn(kind, null, {});
};
/* ── A DRAWER IS A PREVIEW OF ITS ROOM ──────────────────────────────
   The category drawers hold a reel and a sentence about the shelf. The
   two doors emptied when their chips became doors, and an open drawer
   with nothing in it is a mistake with a hover on it. Info's drawer
   carries the three notes it always did — the room holds the rest.
   Connect's carries the one live fact a visitor wants before opening
   the room: the next open time, read from the same week the column
   reads, in the reader's own zone, the first time the drawer opens. */
{
  const { h, pad } = mkRow("Info", true);
  RAIL_NOTES.info.forEach(([c, t]) => sub(pad, c, t));
  h.addEventListener("click", () => toggleHouse("info"));
}
{
  const { r, h, pad } = mkRow("Connect", true);
  const nx = sub(pad, "Next open", "\u2026");
  const t = sub(pad, null, "hello@reckon.house");
  t.innerHTML = "<a class=\"rmail\" href=\"mailto:hello@reckon.house\">hello@reckon.house</a>";
  let asked = false;
  const fill = async () => {
    if (asked) return; asked = true;
    try {
      const j = await (await fetch("/api/book", { cache: "no-store" })).json();
      const first = j && j.ok ? j.days.flatMap((d) => d.slots).find((x) => x.open) : null;
      if (!first) { nx.textContent = "Nothing open this week"; return; }
      const when = new Intl.DateTimeFormat("en-US", { weekday: "long", hour: "numeric", minute: "2-digit", hour12: true })
        .format(new Date(first.at)).replace(",", "").replace(" AM", "am").replace(" PM", "pm");
      nx.textContent = when + " \u00b7 " + (j.minutes || 30) + " minutes";
    } catch (e) { nx.textContent = "Ask for a time"; }
  };
  r.addEventListener("pointerenter", fill);
  h.addEventListener("focus", fill);
  h.addEventListener("click", () => toggleHouse("connect"));
}
const gap = document.createElement("div");
gap.className = "rgap";
drawer.appendChild(gap);

/* which pictures a category's stamp cuts through: the board's own
   thumbs for the studies that carry the tag, one per study so a stamp
   is a survey rather than a slideshow of one project */
/* THE STAMP CUTS THROUGH THE COVERS, not the archive. Walking the
   whole corpus dealt whatever sorted first — product crops, board
   pulls — and the reel is a preview of the shelf, so it shows the
   same heroes the live homepage leads with: the covers, in the
   homepage's own order, one per study by construction. Staples has no
   covers and keeps the board's own head. */
const framesFor = (tag) => {
  if (tag === "staples")
    return (window.BOARD_ITEMS || [])
      .filter((i) => i.g === "inspiration").slice(0, 8).map((i) => i.t);
  return (window.BOARD_ITEMS || [])
    .filter((i) => i.c != null && GROUPS[i.g] && GROUPS[i.g].tags.includes(tag))
    .sort((a, b) => a.c - b.c)
    .slice(0, 8)
    .map((i) => i.t);
};

const catReels = [];
FILTERS.forEach(([label, tag, desc]) => {
  const { r, h, pad } = mkRow(label, false);
  pad.classList.add("rcat");
  const box = document.createElement("div");
  box.className = "rreel sz-stage";
  const d = document.createElement("div");
  d.className = "rdesc";
  d.textContent = desc;
  pad.appendChild(box);
  pad.appendChild(d);
  const rl = { row: r, box, frames: framesFor(tag), timer: null };
  szStage(rl);
  szScrub(rl);
  catReels.push(rl);
  rl.mo = new MutationObserver(() => {
    if (rl.row.classList.contains("open")) szStart(rl);
    else szStop(rl);
  });
  rl.mo.observe(rl.row, { attributes: true, attributeFilter: ["class"] });
  /* OPEN FIRST, FILTER SECOND — the rail's own rule on touch, and on
     a mouse the hover has already opened it so one click filters. */
  const ask = () => setMode(MODE === tag ? null : tag);
  h.addEventListener("click", () => {
    /* Open first, ask second — everywhere now. The sheet gives a
       phone the room the old strip never had, so the drawers, the
       reels and the two-step run the same on both surfaces. Filtering
       closes the sheet: the answer happens on the glass behind it. */
    if (r.classList.contains("open")) {
      ask();
      if (PHONE && window.toggleSheet) toggleSheet(false);
      return;
    }
    openOnly(r);
  });
  pad.addEventListener("click", ask);
  r.dataset.tag = tag;
});

/* ── the way back, as a row of the rail ── */
const homeRow = mkRow("Back to start", false);
const home = homeRow.r;
home.id = "home";
rrows.pop();                 /* not one of the drawers: it never opens */
homeRow.r.remove();
/* IN ITS OWN .rdrawer, and that wrapper is not packaging — it is the
   selector chain. Every chip treatment lives under `.ixnotes .rdrawer
   .rrow`, so a row appended straight to the rail wore none of it: the
   raw button's outline and square corners showed through, the one
   control on the page outside the family. The wrapper puts it back in
   the chain; the foot anchoring rides on the wrapper. */
const homeWrap = document.createElement("div");
homeWrap.className = "blk rdrawer";
homeWrap.id = "homewrap";
homeWrap.appendChild(home);
document.getElementById("railwrap").appendChild(homeWrap);
homeRow.h.addEventListener("click", () => {
  closeAllColumns();
  pageTo(0);
  colY.clear();
  for (const f of fcols.values()) f.scrollTop = 0;
});

/* ── THE SHEET, the bar's own surface on a phone ────────────────────
   The rail moves INTO it wholesale — same nodes, same listeners, the
   drawer anatomy it has on a desktop — so the sheet is not a second
   navigation, it is the first one re-homed. The wordmark is the
   toggle: one nav entry, and the brand is its handle. */
const sheet = document.getElementById("cmdSheet");
const sheetIn = document.getElementById("cmdIn");
const nav = document.getElementById("nav");
if (PHONE) {
  sheetIn.appendChild(document.getElementById("railwrap"));
  const mark = nav.querySelector(".mark");
  const toggleSheet = (on) => {
    const open = on != null ? on : !sheet.hasAttribute("data-on");
    sheet.toggleAttribute("data-on", open);
    nav.classList.toggle("cmdopen", open);
    /* hugs can only be measured once the rows have width, and a
       closed sheet's rows have none — measure on the way open */
    if (open) requestAnimationFrame(() => requestAnimationFrame(hug));
    else closeRows();
  };
  window.toggleSheet = toggleSheet;
  mark.addEventListener("click", (e) => { e.preventDefault(); toggleSheet(); });
  /* a tap on the bar's empty ground toggles too — the whole bar is
     the handle, the mark just names it */
  nav.addEventListener("click", (e) => {
    if (e.target === nav || e.target.id === "navBurn") toggleSheet();
  });
  /* asking closes the sheet: the field needs the glass */
  const q = document.getElementById("query");
  if (q) q.addEventListener("focus", () => toggleSheet(false));

  /* ── the keyboard ─────────────────────────────────────────────────
     A bottom-anchored input meets the phone keyboard: it rises and
     covers the bar. visualViewport says exactly how much of the
     layout viewport the keyboard ate, and the bar rides up by that
     amount while editing, back down on blur. Guarded — desktop and
     the lab pane never fire it. */
  if (window.visualViewport) {
    const vv = window.visualViewport;
    const lift = () => {
      const off = Math.max(0, innerHeight - vv.height - vv.offsetTop);
      nav.style.transform = off ? "translateY(" + -off + "px)" : "";
      sheet.style.transform = nav.style.transform;
    };
    vv.addEventListener("resize", lift);
    vv.addEventListener("scroll", lift);
  }
}

/* every chip stops at its own words */
const hug = () => {
  document.querySelectorAll("#railwrap .rrow").forEach((r) => {
    const ink = r.querySelector(".rink");
    const head = r.querySelector(".rhead");
    if (!ink || !head) return;
    const full = r.getBoundingClientRect().width;
    if (!full) return;
    const pad = parseFloat(getComputedStyle(head).paddingLeft) || 12;
    /* a path row carries its own × inside the head, and a chip that
       stops at its words has to stop past that too — measured, not
       allowed for, because the glyph's width is the font's business */
    const x = r.querySelector(".rx");
    const want = ink.getBoundingClientRect().width +
      (x ? x.getBoundingClientRect().width : 0) + pad * 2;
    const v = Math.max(0, Math.min(92, ((full - want) / full) * 100));
    r.style.setProperty("--hug", v.toFixed(2) + "%");
  });
};
window.__hug = hug;
hug();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(hug);
addEventListener("resize", hug, { passive: true });
drawer.addEventListener("pointerleave", closeRows);

function setMode(mode) {
  MODE = mode;
  if (mode && typeof trailLog !== "undefined") { trailLog.modes.push(mode); saveTrail(); }
  /* a shelf is a line: it opens as a list column too, like the
     filters on the left, and the field dims to it behind. Picking the
     same shelf again folds that column away rather than leaving one
     open with the filter off. */
  const had = ccols.find((c) => c.__mode === mode);
  if (!mode) { ccols.filter((c) => c.__mode).forEach(closeColumn); return; }
  if (had) { closeColumn(had); return; }
  if (window.askFrom) openShelfColumn(mode, null);
  rrows.forEach((r) => {
    if (!r.dataset.tag) return;
    r.classList.toggle("picked", r.dataset.tag === mode);
  });
}

/* ── EVERY DOOR TO A STUDY PLAYS THE SEQUENCE ───────────────────────
   The site's own transition — white curtain down, black over it, the
   name of what is arriving repeating down both panels — lifted from
   the lab and given the one thing it does not have there: somewhere
   to go. In the lab it plays and stays, because that page has no
   routes; here it is handed the href, so the black lifts on the study
   itself rather than on the board again.

   Delegated on the document, so it catches the chip on a frame and
   the button at the head of a preview with one rule. */
/* ── THE BOARD IS THE PAGE BEING LEFT, AND NOTHING MORE ─────────────
   The lifted sequencer plays all three beats because the lab has
   nowhere to go. The board does: it is a static page, so the swap is
   a hard navigation and the browser keeps THIS document painted until
   the next one is ready. Covering, then lifting, then navigating
   showed the homepage again between the lift and the load. Navigate
   at full black and stop: the black is the last thing this page ever
   draws, and the study arrives under it. */
window.ptSwap = (href) => {
  if (!href) return false;
  /* the note the arriving document reads before its first paint: it
     puts a black cover up straight away and lifts it as beat 3, so
     the reveal belongs to the page that arrived, which is where it
     belonged all along. Stamped, so a navigation that never happened
     cannot curtain some unrelated page an hour later. */
  /* THE LINES GO WITH IT. The leaving page has already measured what
     fills this screen — how many lines, the line-height that makes
     them add up to the inset box, the size that fits the longest one —
     so it hands those over rather than making the arriving document
     work them out again. The name is what the note is really for: a
     curtain that comes up blank and then lifts is not the same
     curtain the visitor was just looking at. */
  const pt0 = document.getElementById("pt");
  const stack0 = pt0 && pt0.querySelector(".ptw .ptstack");
  /* the sub goes over only if it survived the fit: a name too long for
     the glass dropped its category here, and the arriving curtain has
     to draw the same lines */
  const nosub = !!(stack0 && stack0.classList.contains("pt-nosub"));
  const note = { t: Date.now(), title: (window.__ptLabel || {}).title || "",
    sub: nosub ? "" : ((window.__ptLabel || {}).sub || ""),
    n: stack0 ? stack0.childElementCount : 0,
    lh: stack0 ? stack0.style.getPropertyValue("--ptlh") : "",
    fs: stack0 ? stack0.style.getPropertyValue("--ptfs") : "" };
  try { sessionStorage.setItem("pt.arrive", JSON.stringify(note)); } catch (e) { /* private mode */ }
  /* ── THE STACK REDRAWS ITSELF WHILE IT WAITS ──────────────────────
     A still page under a still curtain reads as a hang. The site's own
     transition laps its lines while a route commits, and the board
     never did: it landed them once and held, so the wait looked like
     a stall rather than a load. Same class, same keyframes, already in
     the stylesheet — 1.8s, staggered by the delay each line already
     carries, infinite until this document is replaced.

     ADDED BEFORE THE NAVIGATION, and that is the whole trick: it is a
     compositor animation, so it keeps running while the browser is
     busy fetching and parsing the next document, which is exactly the
     stretch it exists to cover. */
  const pt = document.getElementById("pt");
  if (pt) pt.classList.add("pt-wait");
  location.href = href;
  return true;
};
/* ── COMING BACK, THE BOARD IS AS IT WAS LEFT ──────────────────────
   Which is under its own curtain: the swap navigates at full black and
   deliberately never lifts, so the document the back button restores
   is a black screen with the study's name still repeating down it.
   Nothing is stalled, it is a page showing the last frame it drew.
   Clear it on every show — persisted or not, since a restore from
   cache runs no script at all otherwise — and let go of the busy flag
   with it, or the next study would never open. */
addEventListener("pageshow", () => {
  const pt = document.getElementById("pt");
  if (!pt) return;
  pt.className = "pt";
  delete pt.dataset.busy;
});
/* ── AND THE BOARD ARRIVES THE SAME WAY ─────────────────────────────
   A study's pull home writes the note and navigates here at full
   black; the head script has drawn that curtain over this document
   before it could be seen. The same three moves the app makes on
   arrival, in the same order: hold the floor so a fast load cannot
   snap the black open before the eye has registered it closed; let
   the lap finish at a boundary so no line is caught mid-flight;
   reverse the delays so the lines leave from the bottom, which is the
   direction the lifting clip removes them in. playTransition's own
   ending, on the cover. */
(() => {
  const cover = document.getElementById("ptArrive");
  if (!cover) return;
  const give = () => {
    cover.remove();
    document.documentElement.classList.remove("pt-arriving");
    /* the black is off: now the row can show what it does */
    if (window.__lean) window.__lean();
  };
  if (REDUCE()) { give(); return; }
  const beatOn = (cls, el) => new Promise((res) => {
    let done = false;
    const end = (e) => { if (done || (e && e.target !== el)) return; done = true;
      el.removeEventListener("transitionend", end); res(); };
    el.addEventListener("transitionend", end);
    cover.classList.add(cls);
    setTimeout(end, 1400);
  });
  const stopWaiting = () => new Promise((res) => {
    const first = cover.querySelector(".ptw .ptstack .ptl");
    let done = false;
    const finish = () => { if (done) return; done = true;
      if (first) first.removeEventListener("animationiteration", finish);
      cover.classList.remove("pt-wait"); res(); };
    if (first) first.addEventListener("animationiteration", finish);
    setTimeout(finish, 2000);
  });
  const painted = () => new Promise((res) => {
    let done = false;
    const go = () => { if (done) return; done = true; res(); };
    requestAnimationFrame(() => requestAnimationFrame(go));
    setTimeout(go, 900);
  });
  (async () => {
    await new Promise((r) => setTimeout(r, 520));
    await painted();
    await stopWaiting();
    let lines = 0;
    cover.querySelectorAll(".ptstack").forEach((stack) => {
      lines = stack.children.length;
      [...stack.children].forEach((line, i) => {
        line.style.setProperty("--d", ((lines - 1 - i) * PT_STEP_OUT).toFixed(3) + "s");
      });
    });
    const outMs = ((lines - 1) * PT_STEP_OUT + 0.26) * 1000;
    await Promise.all([
      beatOn("pt-3", cover.querySelector(".ptb")),
      new Promise((r) => setTimeout(r, outMs)),
    ]);
    give();
  })();
})();
document.addEventListener("click", (e) => {
  const a = e.target.closest && e.target.closest("a[href^='/case-studies/']");
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
  e.preventDefault();
  /* warm the document while the curtain falls: two beats is about a
     second, which is most of a page load */
  const pre = document.createElement("link");
  pre.rel = "prefetch"; pre.href = a.getAttribute("href");
  document.head.appendChild(pre);
  /* the name that repeats down the curtain is the study's own, and
     its category line rides under it — the same pair the frame's
     label carries */
  const slug = a.getAttribute("href").split("/").pop();
  const g = Object.values(GROUPS).find((x) => (x.h || "") === slug);
  /* what the curtain is repeating, kept for the note the swap writes */
  window.__ptLabel = { title: g ? g.t : "", sub: g ? g.s : "" };
  playTransition(a.getAttribute("href"), g ? g.t : "", g ? g.s : "");
});

/* ── THE FIELD, BETWEEN THE STATEMENT AND THE BAR ───────────────────
   The homepage's own driver, in the board's frame of reference. Drop
   is measured, never authored: the distance from the reserved slot's
   centre to the bar's centre, floored at zero — so the field rides
   with the statement while the slot is on screen and parks the
   instant it arrives, changing size on the way. Progress is drop over
   the slot's centre in WORLD space (the slot's screen y plus the pan),
   so the field is exactly full size at rest and exactly parked when
   the slot reaches the bar, at any viewport. With no slot in sight —
   paged away, scrolled past, a study open — it parks at the column it
   last rode, which is where the house's line and the thread expect
   it. The same pass reads the cover line and sets the bar's flags:
   coverbar while the cover's wordmark overlaps the band (the burn
   waits), headgone once it has left (the bar's ends drop in). */
const askEl = document.querySelector("#nav .ask");
const askInput = document.getElementById("query");
const coverline = document.getElementById("coverline");
const covermark = coverline ? coverline.querySelector(".covermark") : null;
const covermeta = coverline ? coverline.querySelector(".covermeta") : null;
const navBurn = document.getElementById("navBurn");
/* the line and the pill are fixed; measure them once and on resize */
let LINE = { mark: 0, meta: 0, burnL: 0, burnR: 0, fieldL: 0 };
const measureLine = () => {
  const mid = (el) => { if (!el) return -1; const r = el.getBoundingClientRect(); return r.left + r.width / 2; };
  const br = navBurn ? navBurn.getBoundingClientRect() : { left: 0, right: 0 };
  LINE = { mark: mid(covermark), meta: mid(covermeta), burnL: br.left, burnR: br.right,
    fieldL: field.getBoundingClientRect().left };
};
measureLine();
addEventListener("resize", measureLine, { passive: true });
/* every frame, and only arithmetic: where each black column stands on
   the screen is its place in the row minus the pan */
const handover = () => {
  const dark = ccols.filter((c) => c.__house);
  if (!dark.length && !LINE.on) return;
  let onMark = false, onMeta = false, onBurn = false;
  for (const c of dark) {
    const x0 = LINE.fieldL + dispOf(c) * MOD_X - GAP / 2 - cur.x, x1 = x0 + MOD_X;
    if (LINE.mark >= x0 && LINE.mark < x1) onMark = true;
    if (LINE.meta >= x0 && LINE.meta < x1) onMeta = true;
    if (x0 < LINE.burnR && x1 > LINE.burnL) onBurn = true;
  }
  if (covermark) covermark.classList.toggle("rev", onMark);
  if (covermeta) covermeta.classList.toggle("rev", onMeta);
  if (navBurn) navBurn.classList.toggle("rev", onBurn);
  LINE.on = onMark || onMeta || onBurn;
};
const ASK_SMALL = 12;
const askGhost = document.createElement("span");
askGhost.setAttribute("aria-hidden", "true");
askGhost.style.cssText = "position:absolute;left:-9999px;top:0;visibility:hidden;" +
  "white-space:pre;font-family:inherit;font-weight:700;letter-spacing:-0.045em;font-size:100px";
document.body.appendChild(askGhost);
let askLastCol = null;
const askFit = (text, room, ledeSize) => {
  const cap = ledeSize
    ? Math.min(ledeSize, Math.max(21, Math.min(32, innerWidth * 0.024)))
    : Math.max(21, Math.min(32, innerWidth * 0.024));
  askGhost.textContent = text || "";
  const per = askGhost.getBoundingClientRect().width / 100;
  if (!per || !room) return cap;
  return Math.max(19, Math.min(cap, (room * 0.985) / per));
};
function placeAsk() {
  /* a top-level function is on window from the first line, so the
     rotation's first paint reaches this before the consts above have
     run; the flag is set once they have */
  if (!window.__askReady || PHONE || !askEl) return;
  const fieldL = field.getBoundingClientRect().left;
  /* the slot the field rides: the open column's lede while the
     history is unfolded, else the statement standing in the plane */
  const st = live.get("0:0:0");
  const slot = st ? st.querySelector(".askslot") : null;
  const sr = slot ? slot.getBoundingClientRect() : null;
  /* on screen both ways: a slot pushed off to the right by the
     columns is as gone as one scrolled off the top */
  const on = !!sr && sr.height > 0 && sr.right > fieldL + 8 && sr.left < innerWidth - 8 && sr.bottom > 0;
  const drop = on ? Math.max(0, sr.top + sr.height / 2 - NAV_H / 2) : 0;
  /* the travel's length is the slot's centre in the space that
     scrolls — the panel's while it is open, the plane's otherwise */
  /* the statement travels with ITS column now, not with the plane */
  const scrolled = st && st.__col ? st.__col.scrollTop : 0;
  const total = on ? Math.max(1, sr.top + scrolled + sr.height / 2 - NAV_H / 2) : 1;
  const p = Math.min(1, drop / total);
  if (on) askLastCol = { left: sr.left, w: sr.width };
  const col = askLastCol || { left: fieldL + GAP / 2, w: COL * 0.63 };
  const ledeSize = st ? parseFloat(getComputedStyle(st).fontSize) || 0 : 0;
  const big = askFit(askInput.value || window.tourFull || askInput.placeholder, col.w, ledeSize);
  askEl.style.setProperty("--ask-left", col.left.toFixed(1) + "px");
  askEl.style.setProperty("--ask-w", col.w.toFixed(1) + "px");
  /* ── MASKED AT THE STRIP'S EDGES, like everything else in it ──────
     The field lives in the bar, not in the strip, so the strip's clip
     never touched it: as the statement slid under the rail the field
     kept riding its slot, drawing over the rail until the slot was
     8px from gone and then blinking out. The same edge, applied by
     hand: whatever part of the field stands left of the strip is cut,
     and whatever stands past its right edge too. Cleared when it is
     wholly inside, so a settled field carries no clip at all. */
  const cutL = Math.max(0, fieldL - col.left);
  const cutR = Math.max(0, col.left + col.w - innerWidth);
  askEl.style.clipPath = (cutL > 0 || cutR > 0)
    ? "inset(0 " + cutR.toFixed(1) + "px 0 " + cutL.toFixed(1) + "px)" : "";
  askEl.style.setProperty("--ask-drop", drop.toFixed(1) + "px");
  askEl.style.setProperty("--ask-fs", (ASK_SMALL + (big - ASK_SMALL) * p).toFixed(2) + "px");
  askEl.style.setProperty("--ask-ls", (0.04 - 0.09 * p).toFixed(4) + "em");
  askEl.style.setProperty("--ask-fw", p > 0.35 ? "600" : "500");
  askEl.classList.toggle("big", p > 0.35);
  askEl.classList.toggle("parked", !on);
  document.body.classList.toggle("attop", p > 0.96);
  /* no handover to flag: the masthead never leaves */
}
window.placeAsk = placeAsk;
window.__askReady = true;
{
  const tin = document.getElementById("threadIn");
  if (tin) tin.addEventListener("scroll", placeAsk, { passive: true });
}
window.__b = { cur, tgt, START, pageTo, placeAsk, askFrom, openStudyColumn, closeColumn, closeAllColumns,
  showCol, get ccols() { return ccols; }, dispOf, atDisp, shiftAt, VISIBLE, openHouseColumn, handover, measureLine, get live() { return live; },
  get tiles() { return tiles; }, remount, get colIdx() { return colIdx; },
  MOD_X, COL, GAP, setMode, checkScale, DPR,
  get COLS() { return COLS; }, get PW() { return PW; }, get PH() { return PH; },
  get MODE() { return MODE; } };
addEventListener("resize", () => { remount(); placeAsk(); }, { passive: true });
remount();
placeAsk();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeAsk);
requestAnimationFrame(tick);

/* ── THE FIELD IS BUILT, COLUMN BY COLUMN ───────────────────────────
   The plane is a box of no size — its tiles are placed, not flowed —
   so the reveal is a polygon in its own pixels rather than an inset:
   the strip's left edge in plane coordinates to a moving right edge,
   tall enough to take the whole period. The edge is set to each
   gutter's rule in turn, a beat apart, on the same curve a column's
   box grows on, and a transition retargeted mid-flight carries on
   from where it is, so the three moves read as one build. The last
   target is past the glass; the clip is cleared once it has gone,
   with the fades the first screen had switched off. Held shut from
   before first paint, and under a curtain released only once the
   arrival has lifted it. */
const plane0 = document.getElementById("plane");
const revealTo = (x) => {
  const y0 = -innerHeight * 2, y1 = PH + innerHeight * 2, x0 = -GAP / 2;
  return "polygon(" + x0 + "px " + y0 + "px, " + x + "px " + y0 + "px, " +
    x + "px " + y1 + "px, " + x0 + "px " + y1 + "px)";
};
if (booting) plane0.style.clipPath = revealTo(-GAP / 2);
window.__lean = () => {
  if (!booting) return;
  booting = false;
  const steps = Math.ceil(SHOW);
  const at = (k) => k * MOD_X - GAP / 2;
  plane0.style.transition = "clip-path 0.5s cubic-bezier(0.2, 0.55, 0.2, 1)";
  /* the first target on a frame of its own, so the shut state has
     been committed and there is something to transition from */
  for (let k = 1; k <= steps; k++) {
    setTimeout(() => {
      plane0.style.clipPath = revealTo(k === steps ? FIELD_W + MOD_X : at(k));
    }, 30 + (k - 1) * REVEAL_MS);
  }
  setTimeout(() => {
    plane0.style.clipPath = ""; plane0.style.transition = "";
    for (const el of live.values()) {
      const c = el.querySelector(".fd-it") || el;
      c.style.transition = "";
    }
  }, 30 + steps * REVEAL_MS + 600);
};
/* under a curtain the build would play behind black, so the arrival
   lifts it first and calls this; a plain load has nothing to wait for */
if (!document.getElementById("ptArrive")) setTimeout(window.__lean, 40);
else setTimeout(window.__lean, 3000);   /* a curtain that never lifts */
</script>

</body>
</html>
'''

out = head + sz + "\n" + burn + "\n" + pt + "\n" + rail
io.open("public/lab/board.html", "w", encoding="utf-8").write(out)
print("board: public/lab/board.html — %d lines (reel %d, burn %d, lifted from the lab)"
      % (len(out.split("\n")), len(sz.split("\n")), len(burn.split("\n"))))
