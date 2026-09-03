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
  #stripIn { display: flex; height: 100%; will-change: transform; }
  #cols { display: flex; height: 100%; flex: none; }
  /* NO GRAB HAND. The field reads as a page to scroll, not a canvas
     to haul: on a laptop a click-drag is the most awkward gesture
     available and the cursor was advertising it. Touch keeps the
     drag, because there it is the only gesture there is. */
  #field {
    position: relative; flex: none; height: 100%;
    overflow: hidden; touch-action: pan-y;
  }

  /* ── A COLUMN ─────────────────────────────────────────────────────
     One module wide, scrolling on its own, its head scrolling with
     it. THE SWISS RULE: one size, one weight, one colour change. Every
     line in a column is set like the intro — the statement's size and
     weight, ink for the thing itself and grey for what is said about
     it — and nothing else: no labels, no pills, no small type. */
  .ccol {
    flex: none; width: var(--modw); height: 100%; position: relative;
    border-left: 1px solid rgba(0, 0, 0, 0.12);
    font-size: clamp(20px, 2.4vw, 32px); font-weight: 600;
    line-height: 1.2; letter-spacing: -0.05em;
    transition: width 0.5s cubic-bezier(0.2, 0.55, 0.2, 1),
      opacity 0.4s ease, border-color 0.4s ease;
  }
  .ccol.closing { width: 0 !important; opacity: 0; overflow: hidden; border-left-color: transparent; }
  .ccol.arriving { animation: colIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes colIn { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
  .ccol .cin { height: 100%; overflow-y: auto; scrollbar-width: none;
    padding: calc(var(--cover-air, 50px) + 46px) calc(var(--ixgap) / 2) 90px; }
  .ccol .cin::-webkit-scrollbar { display: none; }
  .ccol .g { color: rgba(0, 0, 0, 0.42); }
  .ccol .chead { position: relative; padding-right: 34px; }
  .ccol .cline { display: block; width: 100%; border: 0; outline: 0; background: none;
    padding: 0; margin: 0; font: inherit; letter-spacing: inherit; color: inherit;
    text-decoration: underline; text-decoration-color: transparent;
    text-decoration-thickness: max(1px, 0.05em); text-underline-offset: 0.15em;
    transition: text-decoration-color 0.3s ease; }
  .ccol .cline::placeholder { color: var(--ink); opacity: 1; }
  .ccol .cline:focus { text-decoration-color: var(--ink); }
  .ccol .cline:focus::placeholder { color: rgba(0, 0, 0, 0.42); }
  .ccol .cx { position: absolute; right: 0; top: 0.1em; border: 0; background: none;
    padding: 4px; cursor: pointer; font: inherit; font-size: 0.8em; line-height: 1;
    color: rgba(0, 0, 0, 0.42); }
  .ccol .cx:hover { color: var(--ink); }
  .ccol .cnote { margin-top: 0.6em; }
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
  .ccol .crow { display: grid; grid-template-columns: 96px minmax(0, 1fr);
    column-gap: 14px; align-items: start; padding: 11px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.12); cursor: pointer;
    font-size: var(--note); line-height: 1.35; font-weight: 600;
    letter-spacing: -0.004em; transition: opacity 0.4s ease; }
  .ccol .crows .crow:first-child { border-top: 0; }
  .ccol .crow.off { opacity: 0.22; }
  .ccol .crow img { display: block; width: 96px; height: 72px; object-fit: cover;
    border-radius: 10px; background: rgba(0, 0, 0, 0.04); }
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
  .ccol .cpics { margin-top: 0.8em; }
  .ccol .cpics img { display: block; width: 100%; height: auto; border-radius: 14px;
    background: rgba(0, 0, 0, 0.04); margin-top: 14px;
    animation: colIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
  /* the house's next, standing before the field, in the grey */
  .ccol.ghost { border-left-style: dashed; }
  /* the path in the rail: a study's name can be long, so its row
     wraps and takes the rail's width rather than being cut */
  #pathwrap .rrow { --hug: 0%; }
  #pathwrap .rhead { white-space: normal; text-align: left; line-height: 1.25; }
  .ccol.ghost .cline { cursor: pointer; }
  .ccol.ghost .cline::placeholder { color: rgba(0, 0, 0, 0.42); }
  @media (max-width: 760px) { #strip { left: 0; } }
  #plane { position: absolute; left: 0; top: 0; will-change: transform; }

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
     IS the position and a transition would lag the pan by 0.62s */
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
  /* the rail sits under the cover line, where the homepage puts it */
  @media (min-width: 761px) {
    #railwrap { top: calc(var(--cover-air, 50px) + 62px); }
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
  /* ── THE CLOSE RIDES THE FIELD ─────────────────────────────────────
     Beside the input in the bar: it folds the newest column away.
     Only there while a column is open. */
  #threadClose {
    display: none;
    border: 0; background: none; font: inherit; cursor: pointer;
    font-size: 19px; line-height: 1; color: rgba(0, 0, 0, 0.4);
    padding: 2px 6px; flex: none;
  }
  #nav.threadon #threadClose { display: block; }
  /* while a column is open its head is the field, so the bar's copy
     stands down and leaves only the × */
  #nav.threadon #query { visibility: hidden; }
  #threadClose:hover { color: var(--ink); }

  /* ── THE TWO WAYS IN SIT UNDER THE NAME ───────────────────────────
     Not on the picture. Two plain links under the caption, in the
     caption's own size and the category's own grey, so a tile reads
     name, category, then what you can do with it — the way an index
     entry reads. Nothing sits over the work. They ride the name on
     hover, so the opened frame never covers them. */
  .tilelinks { display: block; margin-top: 5px;
    font-size: var(--note); line-height: 1.35; font-weight: 500;
    letter-spacing: -0.004em; }
  .tile.hangR .tilelinks { text-align: right; }
  .tilelinks a { color: rgba(0, 0, 0, 0.42); text-decoration: none;
    cursor: pointer; transition: color 0.3s ease; white-space: nowrap; }
  .tilelinks a:hover { color: var(--ink); }
  .tilelinks i { font-style: normal; color: rgba(0, 0, 0, 0.2); margin: 0 7px; }
  .ixrow .fd-it .tilelinks {
    transition: transform 0.62s cubic-bezier(0.16, 1, 0.3, 1); }
  @media (hover: hover) and (min-width: 761px) {
    .ixrow .fd-it:hover .tilelinks {
      transform: translate(var(--slide, 0px), var(--drop, 0px)); }
  }
  /* the picture itself is the preview's door; it says so */
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
  }
</style>
</head>
<body>

<nav id="nav">
  <div id="navBurn" data-burn aria-hidden="true"></div>
  <div class="ask">
    <input id="query" type="text" placeholder="Ask the house."
      autocomplete="off" autocorrect="off" spellcheck="false"
      aria-label="Ask the house" />
    <button type="button" id="threadClose" aria-label="Close the newest column">&times;</button>
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
  <div id="cols"></div>
  <div id="field">
    <div id="rules"></div>
    <div id="plane"></div>
  </div>
</div></div>


<script>
/* the site's own seeded LCG, so a seed is a field */
const mkRnd = (s0) => { let s = s0;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; };
const seed = parseInt(new URLSearchParams(location.search).get("seed") || "7", 10);
const rnd = mkRnd(Number.isFinite(seed) ? seed : 7);
const REDUCE = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
/* the lab's stub, and honest here for the same reason: these thumbs
   are already a 384px tier, which is the candidate a 128px stamp
   would have picked anyway */
const tileSrcSet = () => "";
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
const IXGAP = px("--ixgap", 40);
const VISIBLE = PHONE ? 1 : 2;
/* MEASURED, not derived from innerWidth. The field's left edge is set
   in CSS from --gut, --ix-note-w and --ixgap, and re-deriving it here
   put the column 2.5px out: innerWidth reported 1065 while the field's
   own box was 833.6, because innerWidth is not always the width the
   layout is using. The element knows; ask it. */
const FIELD_W = document.getElementById("strip").getBoundingClientRect().width;
document.getElementById("field").style.width = FIELD_W + "px";
document.documentElement.style.setProperty("--modw", "0px"); /* set once COL is known */
const GAP = PHONE ? 20 : IXGAP;
/* half gutter, column, gutter, column, half gutter: VISIBLE gaps, not
   VISIBLE+1, or the resting edge lands mid-tile */
const COL = (FIELD_W - GAP * VISIBLE) / VISIBLE;
const MOD_X = COL + GAP;
document.documentElement.style.setProperty("--modw", MOD_X + "px");
let PH = 0; /* the period's height — computed by the row grid below */
const AIR_MIN = 120, AIR_MAX = 340;
const air = () => AIR_MIN + rnd() * (AIR_MAX - AIR_MIN);
/* THE INDEX'S OWN TIERS, verbatim, and the 0.17 anti-repeat with them.
   Mine ran 0.55 to 1.0, so tiles filled their column and the air went
   out of the page — and the live site has never had a frame at full
   column width. These top out at 0.86 and reach down to 0.33, which is
   where the negative space between everything comes from. */
const IX_TIERS = [0.33, 0.43, 0.53, 0.64, 0.74, 0.86];
const SHARES = PHONE ? [0.62, 0.74, 0.86] : IX_TIERS;
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
const STATEMENT_LEAD =
  "I'm Jeremy Prasatik. I make things across <u>brand</u>, <u>product</u>, and <u>place</u>. " +
  "<span class=\"q\"><u>Apps</u> and <u>ecommerce</u>, <u>campaigns</u> and <u>brand systems</u>, " +
  "<u>photography and art direction</u>, <u>custom interiors</u>, <u>AI tools</u>.</span> ";
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
/* the address stands at the top of the next column, so that column's
   first frame starts under it: measured on the live page, 61px */
const META_DROP = PHONE ? 0 : 61;
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
      /* ── AN IMAGE IS ONLY AS BIG AS ITS PIXELS ───────────────────
         CLAUDE.md's rule, applied where it bites: native width / DPR
         is the largest honest CSS width. It steps DOWN THE TIERS
         rather than picking an arbitrary width, so a small file lands
         on the same ladder as everything else; only if even the
         smallest tier would magnify it does it take its honest width
         outright. */
      const honest = Math.min(768, it.w) / DPR;
      while (COL * share > honest && share > shares[0]) {
        share = shares[shares.indexOf(share) - 1];
      }
      prevShare = share;
      w = Math.min(Math.round(COL * share), Math.round(honest));
      h = Math.round(w * (it.h / it.w));
      if (h > COL * 1.6) h = Math.round(COL * 1.6);
      h += capOf(it);
    }
    sized.push({ ...it, w, h });
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
  const cols = Math.ceil(sized.length / rows);
  const rowH = new Array(rows);
  if (opts.fitRows) {
    /* A STUDY'S ROWS FIT THEIR PICTURES. The dealt tiers exist because
       a row on the board spans fifty columns and one tall stranger
       must not set it for everyone. A study's field is two columns of
       one thing, so the trap is gone and the rule can be the plain
       one: the row is as tall as the taller of its two pictures, and
       every picture stands at its own full size. */
    rowH.fill(0);
    sized.forEach((it, i) => { const k = i % rows;
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
  const out = [], cc = {};
  const metaDrop = opts.metaDrop || 0;
  sized.forEach((it, i) => {
    const c = Math.floor(i / rows), k = i % rows;
    let { w, h } = it;
    /* the first row of every column but the first starts under the
       address line, as the homepage's does */
    const drop = (k === 0 && c > 0) ? metaDrop : 0;
    if (it.kind === "img") {
      const cap = capOf(it), budget = rowH[k] - cap - drop;
      if (h - cap > budget) {
        w = Math.max(60, Math.round(w * (budget / (h - cap))));
        h = budget + cap;
      }
    }
    out.push({ ...it, w, h, x: c * MOD_X, y: ys[k] + drop, col: c,
      noCap: !!opts.noCaptions });
    /* where each study's cover lives, so a study can be walked to */
    if (it.c != null && it.g && cc[it.g] == null) cc[it.g] = c;
  });
  return { tiles: out, ROWS: rows, COLS: cols, PW: cols * MOD_X,
    PH: ys[rows], rowY: ys, coverCol: cc };
}
function adopt(L) {
  tiles = L.tiles; ROWS = L.ROWS; COLS = L.COLS; PW = L.PW; PH = L.PH;
  rowY = L.rowY; coverCol = L.coverCol;
}
const BOARD = deal(items, { lead: { kind: "statement", w: COL, h: STATEMENT_H },
  metaDrop: META_DROP });
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
const applyTextDim = () => {
  for (const [key, el] of live) {
    if (key.startsWith("R:")) continue;
    const t = tiles[parseInt(key, 10)];
    const ok = textDim
      ? (t.kind === "statement" || wordsOf(t).includes(textDim))
      : matches(t);
    el.classList.toggle("dim", !ok);
  }
};
const submitQ = (text) => {
  text = (text || "").trim();
  if (!text) return;
  const { n, needle } = countQ(text);
  if (typeof trailLog !== "undefined") { trailLog.asked.push(text); saveTrail(); }
  textDim = n ? needle : null;
  applyTextDim();
  if (window.askFrom) askFrom(null, text);
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
  document.getElementById("threadClose").addEventListener("click", () => {
    if (window.closeNewest) closeNewest();
  });
  addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (e.target && e.target.tagName === "INPUT") return;
    if (window.closeNewest) closeNewest();
  });
  /* the rotating question is a door: tap it and that question is asked */
  document.addEventListener("click", (e) => {
    const go = e.target.closest && e.target.closest(".askgo");
    if (!go) return;
    submitQ(window.__tourWord || "All work");
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
const restX = (i) => i * MOD_X - GAP / 2;
const START = { x: restX(0), y: 0 };
const cur = { ...START }, tgt = { ...START };
let velY = 0;
let dragging = false, lastMount = { x: 1e9, y: 1e9 }, wasTurning = false;
/* THE FIELD DOES NOT WRAP TO THE LEFT ANY MORE: left of its first
   column is the conversation. Paging past the origin hands off to the
   strip, which shows the newest column; the field itself stays at
   its origin. Rightward it is as endless as it was. */
const pageTo = (i) => {
  if (i < 0) { colIdx = 0; tgt.x = restX(0); if (window.stripBack) stripBack(); return; }
  colIdx = i; tgt.x = restX(i);
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
let hCool = 0, wheelAxis = null, wheelIdle = 0;
field.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (dealing) return;
  const now = performance.now();
  if (now - wheelIdle > 160) wheelAxis = null;   /* a new gesture */
  wheelIdle = now;
  const dx = e.shiftKey ? e.deltaY : e.deltaX, dy = e.shiftKey ? 0 : e.deltaY;
  if (!wheelAxis) wheelAxis = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
  if (wheelAxis === "x") {
    if (now - hCool > 320 && Math.abs(dx) > 12) { pageTo(colIdx + Math.sign(dx)); hCool = now; }
  } else { setY(tgt.y + dy); velY = 0; }
}, { passive: false });

let pxx = 0, pyy = 0, moved = 0, dragAxis = null;
const trail = [];
field.addEventListener("pointerdown", (e) => {
  if (dealing) return;
  dragging = true; moved = 0; dragAxis = null;
  pxx = e.clientX; pyy = e.clientY;
  trail.length = 0; velY = 0;
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
  if (dragAxis === "x") tgt.x -= dx;
  else if (dragAxis === "y") setY(tgt.y - dy);
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
    let i = Math.round((tgt.x + GAP / 2) / MOD_X);
    if (fx < -30) i += 1;
    if (fx > 30) i -= 1;
    pageTo(i);
  } else if (dragAxis === "y") velY = -fy * 1.6;
  dragAxis = null;
};
field.addEventListener("pointerup", release);
field.addEventListener("pointercancel", release);
field.addEventListener("click", (e) => {
  if (moved > 6) { e.stopPropagation(); e.preventDefault(); }
}, true);

/* ── the filter ── */
let MODE = null;
const matches = (t) => {
  if (!MODE) return true;
  if (t.kind === "statement") return true;
  if (MODE === "staples") return t.kind === "quote" || t.g === "inspiration";
  if (t.kind !== "img") return false;
  const g = GROUPS[t.g];
  return !!g && g.tags.includes(MODE);
};

/* ── the window ── */
const MARGIN_X = MOD_X * 0.8, MARGIN_Y = 560;
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
  const x0 = cur.x - MARGIN_X, y0 = cur.y - MARGIN_Y;
  const x1 = cur.x + FIELD_W + MARGIN_X, y1 = cur.y + innerHeight + MARGIN_Y;
  const want = new Set();
  const fresh = [];
  for (let i = Math.floor(x0 / PW); i * PW < x1; i++) {
    /* j is 0 and only 0: the field runs sideways for ever and DOWN
       ONCE. A page that never ends in either direction has no bottom
       to reach and nothing to have finished reading; the horizontal
       is the endless axis and the vertical is a page. */
    for (let j = 0; j < 1; j++) {
      for (let k = 0; k < tiles.length; k++) {
        const t = tiles[k];
        const gx = t.x + i * PW, gy = t.y + j * PH;
        if (gx + t.w < x0 || gx > x1 || gy + t.h < y0 || gy > y1) continue;
        const key = k + ":" + i + ":" + j;
        want.add(key);
        if (!live.has(key)) {
          const el = mount(t, gx, gy);
          live.set(key, el);
          /* a frame arrives by its card; a text tile by itself */
          fresh.push(el.querySelector(".fd-it") || el);
        }
      }
    }
  }
  for (const [key, el] of live) {
    if (!want.has(key)) { el.remove(); live.delete(key); }
  }
  /* the curtain: the homepage's own arrival observer, not a rAF pair.
     An IntersectionObserver fires on its own schedule, so a tile that
     mounts while the tab is throttled still opens when it is looked
     at; the rAF version left every frame shut on a parked page. */
  if (fresh.length) {
    /* the in cascades down the page: a lag by where each one sits,
       which the arrival transition already honours as --lag */
    fresh.map((c) => ({ c, y: c.getBoundingClientRect().top }))
      .sort((a, b) => a.y - b.y)
      .forEach(({ c }, i) => c.style.setProperty("--lag",
        Math.min(0.36, i * 0.05).toFixed(3) + "s"));
    if (window.armDrift) armDrift(fresh);
    fresh.forEach((c) => arrive.observe(c));
  }
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
function mount(t, gx, gy) {
  const el = document.createElement("div");
  /* .ixrow, because that is the ancestor the index's own label and
     hover rules are scoped to. Same classes, same stylesheet, same
     0.62s curve — nothing about the card is re-specified here. */
  el.className = "tile ixrow";
  el.style.cssText = "left:" + gx + "px;top:" + gy + "px;width:" + t.w + "px";
  /* what the swap reads: where this tile's column sits in the world,
     and how far the tile can travel inside it */
  el.__wx = gx;
  el.__slack = COL - t.w;
  if (!matches(t)) el.classList.add("dim");
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
    /* what the label rides down by when the frame opens: exactly the
       pixels the 1.32 scale adds to the picture's height */
    card.style.setProperty("--drop",
      Math.round((1.32 - 1) * (t.h - cap)) + "px");
    const plate = document.createElement("span");
    plate.className = "plate";
    const img = document.createElement("img");
    img.src = encodeURI(t.t);
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
      /* the two ways in, under the name — never on the picture */
      const links = document.createElement("span");
      links.className = "tilelinks";
      const pv = document.createElement("a");
      pv.href = "#preview";
      pv.dataset.act = "preview";
      pv.textContent = "Preview";
      const dot = document.createElement("i");
      dot.textContent = "\u00b7";
      const go = document.createElement("a");
      go.href = "/case-studies/" + (g.h || t.g);
      go.textContent = "See the study";
      links.appendChild(pv);
      links.appendChild(dot);
      links.appendChild(go);
      card.appendChild(links);
      el.dataset.slug = t.g;
    }
    el.appendChild(card);
  }
  plane.appendChild(el);
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
    const t = Math.min(1, Math.max(0, (el.__wx - cur.x - GAP / 2) / MOD_X));
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
  if (pv) { e.preventDefault(); openStudyColumn(pv.closest(".tile").dataset.slug, { preview: true }); return; }
  if (e.target.closest && e.target.closest("a[href]")) return;
  const shot = e.target.closest && e.target.closest(".tile[data-slug] .shot");
  if (shot) openStudyColumn(shot.closest(".tile").dataset.slug, { preview: true });
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
const stripIn = document.getElementById("stripIn");
const colsEl = document.getElementById("cols");
const ccols = [];
let stripX = 0, stripTgt = 0;
const fieldX = () => field.offsetLeft;
/* with no columns left the field stands at zero, and it is zero the
   strip must aim at: reading offsetLeft during the fold gives where
   the field was a moment ago and the strip stops short of it */
const stripShow = (c) => { stripTgt = c ? c.offsetLeft : (ccols.length ? fieldX() : 0); };
window.stripBack = () => { if (ccols.length) stripShow(ccols[ccols.length - 1]); };

/* the studies the board knows, matched the way the field is dimmed */
const stem = (w) => w.replace(/(ies)$/, "y").replace(/(es|s)$/, "");
const studiesFor = (text) => {
  const lower = text.toLowerCase().trim();
  const ws = lower.split(/[^a-z0-9']+/).filter((w) => w.length > 2).map(stem);
  return Object.entries(GROUPS).map(([folder, g]) => {
    const hay = (folder + " " + g.t + " " + g.s + " " + g.tags.join(" ") + " " + (g.d || "")).toLowerCase();
    let n = 0; for (const w of ws) if (w && hay.includes(w)) n += 1;
    if (lower.length >= 4 && hay.includes(lower)) n += 2;
    return { folder, g, n };
  }).filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
};
const shelfByText = (text) => {
  const q = text.toLowerCase().trim();
  const r = rrows.find((x) => x.dataset && x.dataset.tag &&
    (x.querySelector(".rink").textContent.trim().toLowerCase() === q ||
     x.querySelector(".rink").textContent.trim().toLowerCase().split("/")[0] === q ||
     x.dataset.tag === q));
  return r ? r.dataset.tag : null;
};

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
function colNode(kind, caption) {
  const c = el("section", "ccol " + kind + " arriving");
  const cin = el("div", "cin");
  const head = el("div", "chead");
  const line = el("input", "cline"); line.type = "text"; line.autocomplete = "off"; line.spellcheck = false;
  line.placeholder = caption; line.setAttribute("aria-label", "Ask from here");
  const x = el("button", "cx", "\u00d7"); x.type = "button"; x.title = "Close this column";
  head.appendChild(line); head.appendChild(x);
  const body = el("div", "cbody");
  cin.appendChild(head); cin.appendChild(body); c.appendChild(cin);
  c.__line = line; c.__body = body; c.__caption = caption; c.__kind = kind;
  x.addEventListener("click", () => closeColumn(c));
  line.addEventListener("input", () => narrowColumn(c, line.value));
  line.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); const t = line.value.trim(); line.value = ""; narrowColumn(c, ""); if (t) askFrom(c, t); }
    if (e.key === "Escape") { line.value = ""; narrowColumn(c, ""); line.blur(); }
  });
  /* a horizontal wheel over a column walks the strip; vertical scrolls the column */
  c.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2) {
      e.preventDefault();
      const now = performance.now();
      if (now - hCool > 420 && Math.abs(e.deltaX) > 24) { stripStep(Math.sign(e.deltaX)); hCool = now; }
    }
  }, { passive: false });
  return c;
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
  (window.BOARD_ITEMS || []).forEach((i) => { if (i.c != null && m[i.g] == null) m[i.g] = i.t; });
  return m;
})();
function studyRows(list, into, from) {
  const wrap = el("div", "crows");
  list.forEach(({ folder, g }) => {
    const r = el("div", "crow"); r.dataset.folder = folder;
    const im = el("img"); im.src = encodeURI(coverOf[folder] || ""); im.alt = ""; im.loading = "lazy";
    const t = el("div");
    t.appendChild(el("b", null, g.t + " "));
    t.appendChild(el("span", "g", g.s));
    r.appendChild(im); r.appendChild(t);
    r.addEventListener("click", () => openStudyColumn(folder, {}, from));
    wrap.appendChild(r);
  });
  into.appendChild(wrap);
}
function insertColumn(c, from) {
  const i = from ? ccols.indexOf(from) : -1;
  const at = i < 0 ? ccols.length : i + 1;
  ccols.splice(at, 0, c);
  const next = ccols[at + 1] || ghostCol;
  if (next) colsEl.insertBefore(c, next); else colsEl.appendChild(c);
  nav.classList.add("threadon");
  drawGhost(); drawPath();
  stripShow(c);
  setTimeout(() => { c.classList.remove("arriving"); c.__line.focus({ preventScroll: true }); }, 620);
}
function askFrom(from, text) {
  const t = (text || "").trim(); if (!t) return;
  const byTitle = Object.entries(GROUPS).find(([, g]) => g.t.toLowerCase() === t.toLowerCase());
  if (byTitle) return openStudyColumn(byTitle[0], {}, from);
  const tag = shelfByText(t);
  if (tag) return openShelfColumn(tag, from);
  const hits = studiesFor(t);
  const c = colNode("answer", t);
  if (hits.length) c.__needle = t.toLowerCase();
  const note = el("div", "cnote g");
  if (/reach|contact|email|hire|talk/.test(t.toLowerCase())) note.textContent = "hello@reckon.house. Or keep asking here.";
  else if (!hits.length) note.textContent = "Nothing caught on the board. The homepage's brain reads deeper.";
  else note.textContent = hits.length === 1 ? "One study." : hits.length + " studies, " + hits[0].g.t + " first.";
  c.__body.appendChild(note);
  if (hits.length) studyRows(hits, c.__body, c);
  insertColumn(c, from);
}
window.askFrom = askFrom;
function openShelfColumn(tag, from) {
  const hits = Object.entries(GROUPS).filter(([, g]) => g.tags.includes(tag)).map(([folder, g]) => ({ folder, g }));
  const c = colNode("list", shelfName(tag));
  c.__mode = tag;
  c.__body.appendChild(el("div", "cnote g", tag === "staples"
    ? "Staples are the pulls and the kept lines, not studies."
    : hits.length + (hits.length === 1 ? " study." : " studies.")));
  studyRows(hits, c.__body, c);
  insertColumn(c, from);
}
function openStudyColumn(folder, opts, from) {
  opts = opts || {};
  const g = GROUPS[folder]; if (!g) return;
  trailLog.opened.push(folder); saveTrail();
  const c = colNode("study", g.t);
  c.__folder = folder;
  c.__body.appendChild(el("div", "cnote g", g.s));
  if (g.d) {
    const [fact, ...more] = g.d.split("|");
    const d = el("div", "cnote", fact.trim() + " ");
    const rest = more.join("|").trim(); if (rest) d.appendChild(el("span", "g", rest));
    c.__body.appendChild(d);
  }
  const ways = el("div", "cways");
  const pv = el("u", null, "Preview");
  const go = el("a", null, "See the full study"); go.href = "/case-studies/" + (g.h || folder);
  const gou = el("u"); gou.appendChild(go);
  ways.appendChild(pv); ways.appendChild(document.createTextNode(" \u00b7 ")); ways.appendChild(gou);
  c.__body.appendChild(ways);
  const pics = el("div", "cpics"); c.__body.appendChild(pics);
  const load = () => {
    if (pics.childElementCount) { pics.innerHTML = ""; pv.textContent = "Preview"; return; }
    const files = (window.BOARD_ITEMS || []).filter((i) => i.g === folder);
    files.forEach((f, i) => { const im = el("img"); im.src = encodeURI(f.t); im.alt = ""; im.loading = "lazy";
      im.style.animationDelay = Math.min(0.4, i * 0.05) + "s"; pics.appendChild(im); });
    pv.textContent = "Close the preview";
  };
  pv.addEventListener("click", load);
  if (opts.preview) load();
  insertColumn(c, from);
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
  MODE = mode; textDim = needle;
  rrows.forEach((r) => { if (r.dataset.tag) r.classList.toggle("picked", r.dataset.tag === mode); });
  applyTextDim();
}
function closeColumn(c) {
  const i = ccols.indexOf(c); if (i < 0) return;
  ccols.splice(i, 1);
  c.classList.add("closing");
  setTimeout(() => c.remove(), 520);
  drawGhost(); drawPath(); applyFromColumns();
  if (!ccols.length) {
    /* the last one folds away and the house is at its beginning
       again: nothing filtered, the field at its first column and its
       top, which is what closing the conversation means */
    nav.classList.remove("threadon");
    stripShow(null);
    pageTo(0); setY(0); velY = 0;
  } else stripShow(ccols[Math.max(0, i - 1)]);
}
window.closeNewest = () => { if (ccols.length) closeColumn(ccols[ccols.length - 1]); };
function closeAllColumns() {
  ccols.slice().forEach((c) => { c.classList.add("closing"); setTimeout(() => c.remove(), 520); });
  ccols.length = 0;
  nav.classList.remove("threadon"); drawGhost(); drawPath();
  applyFromColumns(); stripShow(null);
}
function stripStep(dir) {
  /* where the strip stands now, in columns; the field is one past the last */
  const xs = ccols.map((c) => c.offsetLeft).concat([fieldX()]);
  let k = 0; xs.forEach((x, i) => { if (Math.abs(x - stripTgt) < Math.abs(xs[k] - stripTgt)) k = i; });
  const n = Math.max(0, Math.min(xs.length - 1, k + dir));
  if (n === xs.length - 1) stripShow(null); else stripShow(ccols[n]);
}
/* the ghost: the house's next, before the field */
let ghostCol = null;
function drawGhost() {
  if (ghostCol) { ghostCol.remove(); ghostCol = null; }
  if (!ccols.length) return;
  const last = ccols[ccols.length - 1];
  const nx = predictNext(last.__folder || null);
  const g = nx && GROUPS[nx.slug]; if (!g) return;
  ghostCol = colNode("ghost", "Next \u00b7 " + g.t);
  ghostCol.classList.remove("arriving");
  ghostCol.querySelector(".cx").remove();
  ghostCol.__line.readOnly = true;
  ghostCol.__body.appendChild(el("div", "cnote g", g.s + " \u00b7 " + nx.reason));
  ghostCol.__line.addEventListener("click", () => openStudyColumn(nx.slug, { preview: true }, last));
  colsEl.appendChild(ghostCol);
}
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
    h.addEventListener("click", (e) => { if (e.target === x) closeColumn(c); else stripShow(c); });
    r.appendChild(h); wrap.appendChild(r);
  });
  wrap.style.display = ccols.length ? "" : "none";
}
/* the keyboard says the same two things: left and right walk the
   columns, up and down move the page a screen at a time */
addEventListener("keydown", (e) => {
  if (e.target && e.target.tagName === "INPUT") return;
  if (e.key === "ArrowRight") { e.preventDefault(); if (ccols.length && stripTgt < fieldX() - 1) stripStep(1); else pageTo(colIdx + 1); }
  if (e.key === "ArrowLeft") { e.preventDefault(); if (colIdx > 0) pageTo(colIdx - 1); else stripStep(-1); }
  if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); setY(tgt.y + innerHeight * 0.8); velY = 0; }
  if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); setY(tgt.y - innerHeight * 0.8); velY = 0; }
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
const yMax = () => Math.max(0, PH - innerHeight + COVER_AIR);
const setY = (v) => { tgt.y = Math.max(0, Math.min(yMax(), v)); };
function tick() {
  requestAnimationFrame(tick);
  if (document.hidden) return;
  if (!dragging && Math.abs(velY) > 0.1) { setY(tgt.y + velY); velY *= 0.93; }
  /* the momentum dies at the ends rather than running into nothing */
  if (tgt.y <= 0 || tgt.y >= yMax()) velY = 0;
  setY(tgt.y);
  /* x eases a touch slower than y follows — the arriving column gets
     its glide without the scroll feeling detached */
  const turning = Math.abs(tgt.x - cur.x) > 0.5;
  if (turning !== wasTurning) {
    wasTurning = turning;
    plane.classList.toggle("turning", turning);
  }
  if (turning || Math.abs(tgt.y - cur.y) > 0.5) pokeBurn();
  cur.x += (tgt.x - cur.x) * 0.11;
  cur.y += (tgt.y - cur.y) * 0.16;
  plane.style.transform = "translate3d(" + (-cur.x) + "px," + (-cur.y) + "px,0)";
  /* the cover line is page content: it goes where the plane goes —
     but only AWAY. The field wraps, so a scroll upward from the start
     carries the plane down, and a mark riding it dropped into the
     rail, which is fixed. It holds at rest instead and leaves with
     the plane only upward, or leftward when paging. */
  /* the strip eases the same way; the cover line belongs to the
     field's origin, so it rides the strip too */
  stripX += (stripTgt - stripX) * 0.11;
  stripIn.style.transform = "translate3d(" + (-stripX) + "px,0,0)";
  /* the masthead does not move: it is the bar now */
  swapSides();
  if (turning || Math.abs(tgt.y - cur.y) > 0.5 || Math.abs(stripTgt - stripX) > 0.5) placeAsk();
  /* the rules pan in X only, in the same frame, on the same thread */
  rulesEl.style.transform = "translate3d(" + (-cur.x) + "px,0,0)";
  if (Math.abs(cur.x - lastMount.x) > 100 || Math.abs(cur.y - lastMount.y) > 100)
    remount();
  const far = ccols.length > 0 || Math.abs(cur.x - START.x) > MOD_X * 1.5 ||
    Math.abs(cur.y - START.y) > innerHeight * 1.4;
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

{
  const { r, h, pad } = mkRow("Info", true);
  RAIL_NOTES.info.forEach(([c, t]) => sub(pad, c, t));
  h.addEventListener("click", () =>
    r.classList.contains("open") ? closeRows() : openOnly(r));
}
{
  const { r, h, pad } = mkRow("Connect", true);
  const t = sub(pad, null, "hello@reckon.house");
  t.innerHTML = "<a class=\"rmail\" href=\"mailto:hello@reckon.house\">hello@reckon.house</a>";
  h.addEventListener("click", () =>
    r.classList.contains("open") ? closeRows() : openOnly(r));
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
  pageTo(0); tgt.y = START.y; velY = 0;
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
    const want = ink.getBoundingClientRect().width + pad * 2;
    const v = Math.max(0, Math.min(92, ((full - want) / full) * 100));
    r.style.setProperty("--hug", v.toFixed(2) + "%");
  });
};
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
  for (const [key, el] of live) {
    const k = parseInt(key, 10);
    el.classList.toggle("dim", !matches(tiles[k]));
  }
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
document.addEventListener("click", (e) => {
  const a = e.target.closest && e.target.closest("a[href^='/case-studies/']");
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
  e.preventDefault();
  /* the name that repeats down the curtain is the study's own, and
     its category line rides under it — the same pair the frame's
     label carries */
  const slug = a.getAttribute("href").split("/").pop();
  const g = Object.values(GROUPS).find((x) => (x.h || "") === slug);
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
  const scrolled = cur.y;
  const total = on ? Math.max(1, sr.top + scrolled + sr.height / 2 - NAV_H / 2) : 1;
  const p = Math.min(1, drop / total);
  if (on) askLastCol = { left: sr.left, w: sr.width };
  const col = askLastCol || { left: fieldL + GAP / 2, w: COL * 0.63 };
  const ledeSize = st ? parseFloat(getComputedStyle(st).fontSize) || 0 : 0;
  const big = askFit(askInput.value || window.tourFull || askInput.placeholder, col.w, ledeSize);
  askEl.style.setProperty("--ask-left", col.left.toFixed(1) + "px");
  askEl.style.setProperty("--ask-w", col.w.toFixed(1) + "px");
  askEl.style.setProperty("--ask-drop", drop.toFixed(1) + "px");
  askEl.style.setProperty("--ask-fs", (ASK_SMALL + (big - ASK_SMALL) * p).toFixed(2) + "px");
  askEl.style.setProperty("--ask-ls", (0.04 - 0.09 * p).toFixed(4) + "em");
  askEl.style.setProperty("--ask-fw", p > 0.35 ? "600" : "500");
  askEl.classList.toggle("big", p > 0.35);
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
  stripShow, get ccols() { return ccols; }, get stripX() { return stripX; }, get stripTgt() { return stripTgt; }, get colIdx() { return colIdx; },
  MOD_X, COL, GAP, setMode, checkScale, DPR,
  get COLS() { return COLS; }, get PW() { return PW; }, get PH() { return PH; },
  get MODE() { return MODE; } };
addEventListener("resize", () => { remount(); placeAsk(); }, { passive: true });
remount();
placeAsk();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeAsk);
requestAnimationFrame(tick);
</script>

</body>
</html>
'''

out = head + sz + "\n" + burn + "\n" + pt + "\n" + rail
io.open("public/lab/board.html", "w", encoding="utf-8").write(out)
print("board: public/lab/board.html — %d lines (reel %d, burn %d, lifted from the lab)"
      % (len(out.split("\n")), len(sz.split("\n")), len(burn.split("\n"))))
