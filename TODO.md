# The master list

The running order for the Pressing C era. Cross things off; add freely.
(Details for porting live in PRESSING.md; the design spec for anything
visual starts in `public/lab/`.)

## Now

- [x] **Homepage: the deal.** SHIPPED (uncommitted — volume replug needed
      for git; see COMMIT-NOTES.md). Feel-tuning pass on your trackpad owed.
      Was:  Lab prototype first (`public/lab/pressing-home.html`):
      statement cover, headline-scale query input, the seeded dealt field of
      all work; typing re-deals the field; `?q=&deal=` shareable. Then port
      to React (`HomeCover` + `HomeDeal`, dealer machinery shared with the
      footer index; footer's All work suppressed on `/`).
- [x] **A.R.C. → pressing.** SHIPPED (uncommitted, same). Review the copy
      cuts listed at the top of arc-case-study.ts + the caption pass; the
      tall classification-hero flow plate may want a crop. Was:  The long pole: 46 sections, 9 bespoke viz
      types. `PressingVizFrame` bridge so the charts survive in pressing
      chrome. All images survive; copy takes the allocation pass.

- [ ] **Homepage v22: the house speaks.** The question moved INTO the masthead,
      so the site keeps exactly one piece of persistent chrome and the
      burn pill stays the thing behind it. Work / Info / Staples became
      queries instead of links, riding the vocabulary rotation with
      "marble" and "does this company do master bedrooms?". The bar is
      a verbatim lift of the shipped masthead — measured against the
      Robert Rodriguez page, all 14 properties identical, same
      three-stage heat, same [data-nav-dark] reversal (which now
      carries the field too). The matcher went conversational:
      stopwords, best-tier-unless-thin, per-word receipts. Verified in
      the lab across 13 queries.

      v5 removed the last duplication: there is now ONE field, not a
      poster plus a bar field. It opens at display size in the cover
      and travels into the bar's left slot, staying on the 40px gutter
      the whole way, which is what makes the move read as one gesture —
      the wordmark went to the middle to leave that slot open. The
      travel is measured, never authored: progress is the reserved
      slot's distance from the bar, so the field is exactly full size
      at rest and exactly parked on arrival at any viewport. The bio
      moved down to lead the practice stratum, where a near-duplicate
      of it was already living as a card (one fact, one home). On a
      phone the wordmark takes the right end instead of the middle, so
      the travel stays a straight vertical drop there too.

      v6 gave the cover the Pentagram structure: the question at
      display size top-left, what asking does top-right, and what the
      house holds at the foot of the left column (their "showing the
      latest 27 projects"). The vocabulary moved into the right column
      in the flow, which deleted the absolute overlay and the room it
      had to reserve. The question now SETS ITSELF to fit its column —
      an input does not wrap, so at one fixed size "does this company
      do master bedrooms?" was simply cut off; it comes in at 34px
      while "marble" comes in at 81px. Verified: all nine rotation
      entries fit their box.

      v7 stripped the cover to the question and two sentences. Gone:
      the "01 / Ask the house" label, the written-out vocabulary row,
      the counts line, and the deal control (a numbered deal is a thing
      the builder reads and a visitor does not). The vocabulary now
      lives in the placeholder rotation and in the bar's focus row; the
      deal survives as ?deal= and the seed in the URL, so shareable
      compositions still work with no control on screen.

      And ONE gutter down the page: the feeds moved off their 6px
      near-bleed onto the same container as the masthead, the question,
      the section labels and the footer. Every card edge now lines up
      with the type above it (40 desktop / 20 phone, verified on all
      four feeds including the answer's). The question walks the few
      pixels between the page gutter and the masthead's tighter one
      during its travel, so it is correct at both ends — a no-op on
      desktop where the two are the same.

      Known and deliberate: the travel is ~130px because the question
      starts at the top of the cover. A taller cover does not slow it
      (tested). Page-speed is the point; the only lever is starting the
      question further down, which costs the reference layout.

      v19 is Jeremy's Figma landing, built. Rows, not rails:

      COVER — the field, then "The practice" and the statement directly
      under it, both on the same 52% measure so they hang off one
      vertical line down the middle of the page. The two paragraphs
      explaining the field are GONE: a field needing two paragraphs of
      explanation has not been designed yet.

      INDEX — every row top-aligned across the page, a generous
      interval below it, then a thin rule, then the next row. Two
      frames per row, each pushed to the right of its half, so the
      whole grid is held by exactly two vertical lines (measured: 820
      and 1400, and only those two). The spine is horizontal now
      instead of two columns flowing past each other.

      THE NOTES are the deliberate exception: Recently / Get in touch /
      How I work / What I do hold the left column and IGNORE the row
      rhythm, crossing the rules as they go. That is why they are laid
      OVER the rows rather than placed in them — a note is not a cell.
      Order is authored (NOTE_ORDER), not the corpus's, and it follows
      Jeremy's written list; the mockup's own order read the other way
      up at that size, so this is one array to flip if the mockup meant
      it.

      Gone with the rails: the neighbour-shift driver. It existed
      because a hovered frame in a 5px stack had to push its column
      apart to have anywhere to open into. Rows are ruled off with
      ~80px of air, so a frame opens into space that is already there —
      and shifting a neighbouring ROW would drag its rule with it,
      which is the one line on the page that must not move. Grow came
      down 1.5 → 1.32 for the same reason: 1.5 was sized to a stack
      that parted for it.

      v19.8: the label was being covered by its own frame, and the fix
      changed which thing yields.

      Capping the label's DROP was wrong: the frame kept growing past
      where the label had stopped, so the picture ate its own name. The
      GROW is what has to yield, and per-frame. Measured cause: the
      taller frame in any row has exactly the row-gap (79px) beneath
      its label, so at a fixed 1.32 a 457px frame wanted 146px and took
      it out of the label. Now each frame opens as far as its own room
      allows — grow range 1.16-1.32 across 30 frames, median still the
      full 1.32, so only the tall ones give anything up. Verified: 0
      labels covered, 0 labels crossing a rule. The biggest pictures
      moving least is the honest outcome; they are already the loudest
      thing in the row.

      The name also swings to the right edge as the frame opens, so an
      open card states the same right edge every frame in the index is
      hung from. It SLIDES rather than re-aligns: text-align cannot be
      transitioned, so switching it snapped the type across in one
      frame. The driver measures the gap with a RANGE over the label's
      contents — the element is a full-width block whose own rect would
      say zero, while the Range reports the INK (on a wrapped label,
      its widest line). That distance goes into the same transform and
      the same clock as the drop, so the label makes one diagonal move
      rather than two unrelated ones. Verified: all 30 land exactly on
      their frame's right edge, text-align never changes.

      24 of 30 labels are single-line, where this is exact. On the 6
      that wrap, the block slides so its widest line meets the right
      edge and the internal left alignment is kept — a right-positioned
      text block rather than right-aligned text. Deliberate: the
      alternative snaps.

      v22: the answer is a SENTENCE, not a receipt list. composeAnswer()
      writes first-person prose from the matcher's output and it types
      itself out at statement scale, caret and all; the mechanical
      receipts survive as one quiet line underneath. Every clause is
      still derived — counts, kinds, PROJECT NAMES, dead words — so the
      honesty rule holds in a human register: "I've used marble in
      Hill Country home more than once. There's more of it in the
      things I keep, below." House copy rules apply to machine copy:
      contractions, short sentences, no em dashes. Titles repeat
      across the portfolio, so names are DISTINCT titles and
      repetition says "more than once" (never "Hill Country home and
      Hill Country home").

      The tour became five short statements (plus All work at rest):
      Interior projects / App development / Kitchen design / What
      inspires you? / Marble surfaces.

      Three matcher findings, all from probing every tour entry:
      1. TIER FLOOD. "Kitchen design" returned 36 cards: the thin-top
         rule extended with EVERY near-miss and "design" sits in half
         the categories. Thin now extends only with cards that caught
         the RAREST live word (five cards say kitchen, thirty say
         design, so kitchen carries the meaning). 36 → 4 with 32 held.
      2. "inspires" does NOT substring "inspiration" (the e breaks
         it). The pulls' what-it-is field now says "what inspires me",
         so the question lands on all 104 pulls honestly.
      3. FILENAME REGRESSION. "marble" lost its two works when the
         live-order sync swapped case-study heroes for the square hp/
         thumbnails: the old SEO filenames WERE the keyword layer
         (island-pendants-marble-wide, vanity-marble-globe-sconces).
         Recovered from the v3 snapshot as a "the images" field on 29
         of 31 rows; marble's works came back, and west texas gained
         two projects whose heroes name it.

      DONE — the facts pass shipped. See the extractor entry below.

      WAS: the facts pass. The case studies are
      already a database — 29 typed section files. An extraction walks
      src/data/*-case-study.ts and emits per-project facts (materials,
      rooms, disciplines, tools, stats with real numbers, places) into
      a generated JSON the composer cites by name. Flat JSON first:
      versioned, SSR-honest, zero infra, instant client-side at this
      corpus size. Supabase (already planned for the site) is where it
      goes when it needs writes or scale; embeddings slot into
      queryMatches without touching the interaction.

      v21.1: the quote marks came off, and focus greys the line.

      The quotes framed the word as something being ASKED, which the
      typing now says better — and their closing mark sat hard against
      the last character, so it jittered along with every keystroke.
      Without them the word is simply the headline.

      Focus does two things: it completes the half-typed word (a
      fragment sitting greyed under a cursor reads as a mistake, not
      an invitation) and drops the placeholder from full ink to 30%.
      At display size the line reads as a statement, which is right up
      until someone means to type over it; grey says it is theirs now.
      Reversed-over-dark gets its own focus colour, and it has to be a
      more specific selector than the reversal rule or the id-heavy
      #nav.rev #query would win on specificity.

      v21: the chips row under the field is GONE, and the placeholder
      types instead of fading.

      The chips were hedging. A row of links sitting under a field that
      answers questions says "or you could just click something" — and
      the vocabulary is already in the rotation, which is the honest
      place for it. Removed the row, its CSS, the VOCAB list, the
      builder, the focus/blur class it existed for, and the .cycling
      fade rule with it.

      The tour now TYPES a question in, holds it, and takes it back
      out. A fade says "here are some words"; typing says someone is
      asking. It yields the instant the field is focused or has a
      value, and reduced motion gets the first entry, static.

      One thing it needed: the type is fitted to the WHOLE word, not
      to the fragment typed so far. Fitting the visible characters
      resizes the line on every keystroke and it wobbles the entire
      way in — so the driver publishes its target and placeAsk
      measures THAT. Verified: one font-size per word across a full
      rotation (80.64px for the short ones, 36.36px for the long
      question), no intermediate values.

      v20: a three-beat page transition, on click.

        1  white falls from the top until it covers
        2  black rises from the bottom until it covers the white
        3  black's BOTTOM edge rises, uncovering the next page

      Beat 3 is why there are two panels. Uncovering from the bottom
      means the last thing leaving is the TOP of the screen — the
      opposite direction to beat 1 — and that reversal is what stops
      the whole thing reading as one long wipe. The white exists only
      so beat 2 has something to travel over; a black panel rising
      over the live page is just beat 3 played backwards.

      clip-path, not transform: the panels never move, only what is
      drawn of them, so nothing composites at full-screen scale and
      the edges stay exactly straight. Each beat eases hard at the end
      (0.52s / 0.52s / 0.68s on the house curve). The driver only
      SEQUENCES — every duration is in the stylesheet and each beat
      waits for its own transitionend rather than a matching timer,
      which would drift the moment a duration is tuned.

      One bug caught by measuring, not looking: the white was being
      cleared when beat 2 STARTED (it is invisible under the black, so
      it seemed safe) — but the black has not covered yet at that
      moment, and the live page showed back through 95% of the screen
      mid-transition. Keyed to beat 3 instead. Verified: coverage only
      ever climbs, 100% held from 500ms to 1060ms.

      v20.1: the transition names what is loading. The destination's
      title and category are taken off the clicked card (off the
      route's own data in an app — same fact either way) and drawn in
      the middle of the screen.

      Drawn TWICE, once inside each panel, at identical coordinates:
      black type in the white panel, white type in the black one.
      Neither copy ever changes colour — the CLIP does it. As a
      curtain's edge crosses the line, the words above belong to one
      panel and the words below to the other, so the type inverts
      ALONG the moving edge instead of snapping when a panel lands.
      Photographed mid-crossing: the same glyphs black on their top
      half and white on their bottom.

      Both copies have to sit at exactly the same coordinates or the
      inversion shows a seam, which is why the position is declared
      once on .ptt and neither panel is allowed its own.

      v20.2: the destination is now REPEATED down the whole page — the
      same line stacked to fill the screen, arriving top-to-bottom as
      the white falls and leaving bottom-to-top as the black lifts.
      The out-direction is not invented: beat 3's clip was already
      removing them from the bottom, so the stagger just makes a
      direction that existed legible. Entry steps 30ms, exit 20ms —
      arriving is the flourish, leaving should not hold the page up.

      Count and line-height are both MEASURED. The stack is inset by
      the page gutter on all four sides, and the lines are given an
      exact line-height so a whole number of them fills that box
      (19 x 43.16px = 820 = 900 - 2x40). Rounding down instead would
      leave the remainder as extra air top and bottom, and the inset
      would stop being uniform.

      THREE BUGS, all timing, all found by measuring:
      1. The stagger silently did nothing — lines were built and
         revealed in the same task, so they had never rendered hidden
         and had nothing to transition FROM. Forced a frame with a
         layout read before the class goes on.
      2. transitionend BUBBLES. Every line finishing inside a panel
         fired the panel's own listener, so the first line to land
         ended the beat and the sequence collapsed to a third of its
         length. The handler now ignores anything that is not the
         panel itself.
      3. Beat 3 waited only on the curtain (0.68s) while lines were
         still leaving (0.85s), and hiding the overlay cut the stagger
         off mid-flight. It now waits on both.

      A fourth was my own instrument: an inset reading of 54/26 against
      a 40 gutter turned out to be the lines' own entry transform
      (translateY 14px) caught mid-flight. Settled, it is 40/40/40.

      FOR THE PORT the sequence SPLITS: beats 1-2 belong to the page
      being left, the document swap happens under full black, beat 3
      belongs to the page arriving. The lab plays it whole and
      suppresses navigation so the choreography can be judged in one
      go; pass the href to playTransition() to make it navigate.

      v19.10: the opening statement is now set exactly as a case study
      sets it. Lifted from PressingCover.module.css rather than eyed:
      clamp(24px, 3.2vw, 44px) / 1.18 / -0.02em / 500, over a 21em
      measure. Same voice in both places, so the homepage opens at the
      scale a study opens at (44px against the old 27px).

      The MEASURE is what makes that size work here. 21em at 44px is
      924px — wider than the field's 52% column — so .coverR had to
      give up its width cap and let the statement run past the field
      rather than be crushed into eight short lines. Five lines now.

      And the working notes got 2.5x the air between them
      (clamp(26,3vw,46) → clamp(65,7.5vw,115), measured 108px on
      desktop, 65 on a phone). They are four separate statements, not
      a list. The column now runs 665px and floats across two rows —
      checked that no frame intrudes into its track, which is what
      makes the overlap safe rather than lucky.
      The sequence was read off reckon.house itself rather than
      inferred — Sally, Ivy, A.R.C., the kitchen, Robert Rodriguez, and
      on down, 31 tiles. Worth knowing: that order is NOT projects.ts
      array order (Sally sits at index 38 there), so the live page must
      be ordering elsewhere; the lab now carries the rendered order
      explicitly.

      Images are the thumbnails projects.ts declares (28 of 31 are the
      square /case-studies/hp crops made for exactly this) instead of
      the case study heroes, which were a lab convenience. Dimensions
      come from image-dimensions.ts so frames hold their space before
      anything loads; the reel's thumbnail is the one file that table
      does not declare, read off the JPEG itself (800x800). Verified:
      30 images load, zero ratio mismatches between declared and real.

      AND THE SHUFFLE IS GONE. Order is editorial — a judgement about
      which work leads — and a seed should not get to overturn it. The
      deal still composes the page by setting every frame's WIDTH,
      which is what decides the rhythm of the rows. Order fixed, size
      dealt. Verified identical order across deals with widths still
      changing.

      (This also absorbed the earlier fix for two studies missing from
      the lab against projects.ts — fairview-entry and
      branding-graphics — since the list is now generated from the
      source rather than transcribed.)

      v19.7: hover reworked to Jeremy's three notes.

      OPENS DOWNWARD. transform-origin moved from right center to
      right TOP, so the frame keeps its top line — the one thing a row
      of top-aligned frames cannot afford to lose — and opens down and
      left from there.

      THE LABEL MOVES, IT DOES NOT GROW. The scale is on the FRAME
      now, not the card, so the name is not scaled with it; the driver
      measures the growth and slides the label down by exactly that.
      Verified: font stays 16px, transform reads translateY only.

      THE NEIGHBOUR IS PUSHED, NOT COVERED. The driver works out
      whether the opening frame would actually reach the frame to its
      left and moves it only as far as it must — 4 of 28 frames need
      it, the rest do not move at all.

      One thing that could not be had: keeping every opened frame
      inside its row would need a grow of 1.04 (measured — the tightest
      frame has 12px between its label and the rule), which is no grow.
      So the PICTURE is allowed over the rule (it is opaque and sits
      above it, so it covers the line cleanly) while the LABEL's drop
      is capped at the rule. Type crossing a rule looks broken; a
      picture covering one does not. 10 of 28 drops get capped, 0
      labels cross, no transforms left behind on leave.

      v19.6: quicker again (1.65s → 1.4s), and a row's two frames no
      longer arrive together — the right one waits CURTAIN_LAG so the
      row reads left to right.

      The lag landed at 0.25s, and getting there is the lesson. 0.7
      was reasoned from the measured curve (the left frame hits 89%
      before the right starts — "clearly sequential") and was plainly
      wrong in the hand: the row read as two events, not one gesture.
      At 0.25 the left is ~38% down when the right begins and they
      fall together while still starting apart. The profile tells you
      what a curve DOES; it does not tell you how long a wait FEELS.
      Trackpad beats arithmetic on timing, every time.

      The lag is set by the DEALER on the card (--lag), not in the
      stylesheet, because only the dealer knows which of the two a
      frame is — the CSS just reads var(--lag, 0s), so anything built
      outside a row (the answer grid) is simply unaffected. Verified
      0s/0.7s across all 14 rows and through a redeal.

      v19.5: the curtain quickened (2.1s → 1.65s) and gained a settle —
      what is inside the frame comes to rest from 125% to 100% while
      the curtain falls. Same clock, same ease, so they land on one
      beat rather than merely near each other. Measured: 8%/1.229 at
      130ms, 29%/1.178 at 300, 64%/1.089 at 520, 85%/1.036 at 800,
      96%/1.010 at 1150.

      The structure it needed is the point. The scale could NOT go on
      the image: the drift driver already writes transform there, and
      two writers on one property is the bug this kit keeps paying
      for. So the picture sits on a PLATE — .shot > .plate > img — and
      the plate takes the clip and the scale while the image keeps the
      drift. One element each, verified live (plate at scale 1.089
      while the image read translate3d from the drift).

      Two consequences worth keeping:
      - the drift now measures slack with offsetHeight, not a rect: a
        rect reports the SCALED size while a card is mid-settle and
        would drift the picture too far. Layout size ignores
        transforms.
      - the reel card has no plate (its frame holds the reel's own
        stage), so it curtains but does not settle. The selector is
        .shot > * precisely so it takes whatever is in there.

      v19.4: three corrections to the curtain pass.

      RADIUS is the system's now: --r went 12px → 16px, which is
      --pp-r in globals.css and therefore what PressingIndex reads
      through --ix-r. One radius for every framed asset on the site
      rather than a lab guess. (The <img> itself stays at 0 — .shot
      does the rounding, which is the kit's rule: never round the
      image, round its frame.)

      NO GREY PLATE. The frame's rgba(0,0,0,0.05) fill is gone: it was
      a placeholder from before the ratio was declared, and with a
      curtain it sat there being uncovered, which draws the eye to the
      mechanism instead of the picture. Verified no fill anywhere up
      the chain from <img> to .stratum.

      THE CURTAIN WAS TOO FAST, and the cause is worth keeping:
      cubic-bezier(.16,1,.3,1) puts its FIRST control point at y=1, so
      the output jumps almost straight to the top — 47% of the picture
      uncovered in 120ms. It read as a blink to halfway followed by a
      crawl; the falling edge was never legible AS an edge. Now
      2.1s on cubic-bezier(.33,.28,.12,1), measured: 7% at 150ms, 25%
      at 350, 58% at 600, 80% at 900, 93% at 1300, 99% at 1700. The
      descent is readable through the first half and the deceleration
      is saved for the end.

      v19.3: arrival is a CURTAIN, not a fade. The frame is already
      there (its ratio is declared, so it holds its space from first
      layout) and the picture is uncovered downward: clip-path
      inset(0 0 100% 0) → inset(0), 1.15s on cubic-bezier(.16,1,.3,1).
      Measured reveal: 47% of the picture in the first 120ms, 82% by
      290ms, 97% by half-time, and the last 3% takes the remaining
      half second. Fast out, very slow landing.

      Two placement decisions, both about not colliding:
      - on the frame's CONTENT (.shot > *), not the frame: the frame
        carries the radius, and clipping it would square its corners
        for the length of the reveal and fight the hover's own
        squaring-off. The selector takes whatever is inside rather
        than naming <img>, because one card holds the reel's stage.
      - a CLIP, not a transform: the drift driver already writes
        transform to the image and the hover grow writes it to the
        card. A third party on either is the two-drivers-one-property
        bug this kit keeps paying for. A clip belongs to nobody.
      The card itself no longer fades — a fade under a curtain greys
      the picture while it is being drawn. Text cards keep the quiet
      fade; there is no picture to draw back. Reduced motion: no clip
      at all.

      v19.2: the rule belongs to the two frames it separates, not to
      the page. It starts at the LEFT EDGE OF THE LEFT FRAME and ends
      at the right edge of the right one, so it never crosses the notes
      column and never reaches past the pictures. That start moves
      every row, because the left frame's width is dealt — five
      distinct starts in one deal (363/427/480/592/645).

      Written as a calc, not measured: the rule spans both cells plus
      the gap, so (100% - var(--ixgap)) / 2 IS one cell, and one cell
      times the share the frame did NOT take is exactly where its left
      edge falls. No resize listener, no reflow, and it stays true at
      any width. The last row's rule is hidden — there is nothing below
      it to separate.

      v19.1: the width ladder went back to the shipped 0.33-0.86. An
      earlier pass had raised the floor to 0.52 to keep labels short,
      and that cost the thing the ladder exists FOR — at 0.52-1.0 the
      largest frames filled their half completely and the page lost
      its white space. The raise is no longer needed anyway: rows are
      531px cells against the old 369px rails, so 0.33 is ~175px here
      rather than the 122px stamp it was there. Measured after: widths
      175-457, spread back to 2.6x, rows running 38-59% inked (the
      rest white), and NO label runs past two lines — the constraint
      that forced the floor up has been dissolved by the wider cell
      rather than traded against.

      Verified: 14 rows, tops aligned in every one, two right edges
      only, rules full width crossing the notes, seat-travel still
      works out of a row cell AND out of the floating notes column,
      stable across deals, no errors. Phone: notes run first, rows go
      one frame wide.

      v18 was the ring: brain on top, index as the body. The three
      strata are gone; the homepage body is now the case-study footer's
      All-work index, lifted value-for-value from the shipped
      PressingIndex measured on Robert Rodriguez: "All work." at
      62px/700/-0.03em, two pair-columns with an 86px gutter, each a
      230px text rail beside an image rail (38px between), cards
      SQUARE and right-aligned at 5px spacing with widths on the same
      0.33-0.86 tier ladder, and the five practice notes ARE the text
      blocks, dealt down the rails (first drop 260-460, gaps 760-1180).
      The board's 104 pulls left the page but stayed in the corpus —
      the brain still surfaces them, so the answer act's "the board —
      n pulls" line still earns itself. The colophon (©, newsline,
      Top) closes the page exactly as it closes a case study.

      THE RING, stated: one object, two homes. A case study ends at
      the index; the homepage opens with it; enter anywhere, leave
      nowhere. React port flips one thing — PressingFooter suppresses
      the index on "/"; instead the homepage renders PressingIndex as
      its body. The v16 editorial spread is preserved in snapshots as
      the likely Info page.

      v18.3: the hover grow came back, ported from
      PressingIndex.module.css + .tsx rather than rebuilt — the frame
      scales 1.5 about transform-origin:right center (so it opens
      LEFTWARD and keeps the hard right rule the index aligns to),
      squares its corner off as it opens, takes z-index 2, and the
      neighbour driver slides every other frame in the rail by half
      the growth so the stack parts around it. All transform, never
      width: the module's note says growing width reflowed the column
      and everything under it every frame and read as a stutter. Its
      other hard-won note carried too — ONE transition declaration
      covering arrival AND grow, because transition is a shorthand and
      a second declaration silently replaces the first. Verified with
      a real pointer: matrix(1.5), radius 0, z 2, 13 neighbours
      shifted ±85.5px, cleared on leave. Below 760 the dealt width and
      the shift both switch off (the module's rule and its reason: no
      grow to leave room for, and a 33% frame on a phone is a stamp).

      v18.4: the rails keep each picture's TRUE ratio (14 distinct on a
      deal, 1.00-1.70) instead of a forced 1:1, and the label went to
      body size.

      Worth recording, because the assumption was wrong in an
      instructive way: the shipped Robert Rodriguez index is 1:1 on
      ALL 31 cards — measured. Its variety is WIDTH (122-318 on the
      dealt ladder), not ratio. It only reads varied because its rails
      are fed purpose-made 800x800 thumbnails, so nothing there is
      cropped. Ours were cropping landscape case-study heroes into
      squares, which is why the same rule looked worse here. If the
      site ever gets square thumbnail assets, 1:1 becomes the better
      answer again.

      Body-size labels then forced the ladder floor up from 0.33 to
      0.52: at 0.33 a 122px frame carried a four-line label 96px tall,
      taller than the 90px picture above it. Now max two lines, zero
      labels taller than their picture, across three deals. Costs
      width drama — the spread is 1.9x rather than 2.6x. The lever is
      TIERS; the floor and the label size trade directly against each
      other.

      And the project text now sits UNDER each thumbnail at body size
      rather than in a hover overlay, so the rails name themselves.
      Arrival in a rail had to become opacity-ONLY: a translateY on a
      5px stack slides each frame over its neighbour, and the shift
      driver writes that same property. Phones: pairs stack,
      notes run first, ladder scales (116-301 of 350).

      v18.2: the about/info content came back as its own beat under the
      grid. Allocation, since both places had a claim: the RAILS keep
      the working notes (what I do, how I work, recently, get in
      touch) because that is what a footer carries, and the STATEMENT
      moved out of the rails into a labelled beat below the index —
      36px, its own air, 81px clear of the last card. Too big to read
      as a caption, which is what it was doing in a 230px rail. The
      bio is now in exactly one place; verified no rail block contains
      it. It carries a data-key like any card, so asking "practice"
      travels the statement itself into the answer.

      Note the homepage index now differs from the case-study footer by
      one block (the footer keeps the bio in its first rail, since a
      study has nowhere else to put it). Defensible — the homepage has
      somewhere else — but it is a real divergence in the "one object,
      two homes" claim and should be a conscious choice at port time.

      v18.1: the "All work." lede folded INTO the field — the tour now
      opens on "all work", so the page's title is the brain's resting
      state and asking it deals the whole house (31 pieces). That
      needed a matcher fix with a structural cause worth remembering:
      "all" was not a stopword, substring-hit every card (wALL,
      DALLas, instALL), and the junk hit tripped best-tier into
      holding back 39 single-word matches — the resting query returned
      7 pieces instead of 31. "all"/"every"/"everything" joined the
      set-aside list; receipts now read "common words set aside: all".

      v17: asking became something you WATCH. The old answer was a
      filter — two strings and a grid set in one synchronous pass, done
      before you saw it think. Now: asking is committed (enter, a
      vocabulary word, or a 420ms pause — a chatbot you are still
      typing at does not start answering), the field's rule runs a
      scan while the house is listening, and the answer assembles as
      an act: the sources report one line at a time (the case studies —
      2 works / the board — 1 pull / the practice — nothing), each
      line landing WITH its cards. Cards that were on screen when you
      asked TRAVEL from where they sat to their seat in the answer
      (FLIP off a data-key seat map captured before the asked class
      hides the strata — order is the whole trick, display:none zeroes
      every rect). Cards from further down rise in. ~1.6s total,
      cancellable mid-act (generation counter), reduced motion gets
      the old instant answer.

      HONESTY RULE: every transcript line is the matcher's own output,
      sequenced — receipts, not invented "thinking" copy. The theatre
      is in the timing only.

      THE LOOP (decision pending): the case-study footer's All-work
      index as the homepage grid. Home = the brain + the same index
      object the footer already renders; a case study ends at the
      footer index, which IS home — the site becomes a ring with no
      dead end. React port would flip one thing: PressingFooter
      currently SUPPRESSES the index on "/" — instead the homepage
      renders it as its body. The v16 editorial spread (heroes, uneven
      pairs, offset text) likely becomes the Info page rather than
      home. Lab it next on Jeremy's word.

      v16: the work's text blocks stopped being cards. On white ground a
      filled box reads as one more tile in a run of tiles; the same
      words set plainly read as an aside, which is what they are. The
      word became a quiet label at --lbl and the body sits at --note,
      always open — nothing to click. They also stopped declaring
      data-nav-dark, since there is no dark ground left to reverse
      over. The BOARD's kept quotes are still solid cards: among
      photographs a solid card is a beat, and there the eyebrow ("A
      note kept") is doing real work telling a quote from a picture.

      v15 dropped the three-across row entirely and turned the work into
      a case study's rhythm: a hero, a stated interval, an uneven pair,
      an interval, a solid card set off to one side, the pair reversed,
      an interval, another hero. Row gap is clamp(56px, 7vw, 130px) —
      about 100px at desktop — against a 22px column gap, so the page
      reads as blocks separated by air rather than a packed grid.

      Two things fell out of it, both simplifications:

      Blocks no longer share rows, so the VOID machinery is gone. The
      air under the shallow frame is just the rest of its row, and the
      row is as tall as the deep frame. Nothing is placed to hold it.

      And the "not perfect" proportion became systematic rather than
      arbitrary. Both pair frames carry a landscape ratio — 4:3 wide,
      5:4 narrow — so the narrow frame comes out at 0.77 of the wide
      one's depth purely BECAUSE it is narrower. Nobody chose "half",
      or chose 0.77 either; the ratios were chosen and the proportion
      fell out. Measured: 554×477 against 784×622.

      Also gone with it: --cell and measureCell, the absolute-positioned
      span images, the declared span heights. Nothing in the work has a
      height that isn't its own ratio any more.

      One self-inflicted break worth remembering: replacing a whole CSS
      or JS region by ANCHOR swallowed boardColCount, which happened to
      sit just above the old block set — the board stopped rendering
      entirely. Region splices need a check for what else lived between
      the anchors, not just that the anchors matched.

      v14 moved the work grid to TWELVE tracks — the house grid — and it
      cost nothing: a cell is span 4 and lands on exactly the 449px it
      had at three columns, so every existing shape is unchanged. What
      it bought is the uneven split, span 5 against span 7, which
      measures 41/58 and which no three-column grid can express.

      The pair: two frames top-aligned on an off-centre line, one 5
      tracks wide and ONE cell deep, one 7 tracks wide and TWO cells
      deep, so a cell of air falls under the shallow one. That air is a
      placed element (a void of 5 tracks), not a gap left by accident —
      without it the next block flows straight into the space and
      closes it. Both directions are dealt, plus a composite block that
      deals the whole sequence at once: pair, full-width hero, pair
      reversed.

      Note on the reference: its two images are portraits (~6:7). Ours
      are not, because the library is landscape — the composition is
      taken (uneven widths, uneven depths, tops aligned, air below the
      shallow one) and the crop is not. Same shape, no crop damage.

      One thing learned twice now: do not give a void an explicit
      height. Grid PLACEMENT is what reserves the space, whatever the
      element renders as; an explicit height only made it depend on
      --cell, which is measured after the rebuild, so a fast redeal
      sized it from the previous pass and pushed it 8px into the card
      above. Verified over six deals: cells uniformly 392, air under
      every shallow tile, zero overlaps.

      v13 threw out the tall tile. A one-column two-row portrait is the
      one shape this library cannot fill — the work is photographed
      landscape almost without exception, and a 2:3 crop of a landscape
      frame throws away most of the picture. The three shapes left are
      all wider than they are tall:

        1×1×1     three cells, one row      (449×337, 1.33)
        2(2)×1    a 2×2 with two stacked beside it  (905×735, 1.23)
        1×2(2)    the same, mirrored
        1         one image the full width, two cells deep (1360×735)

      Blocks are weighted so the plain row stays the norm (6) and the
      full-width hero stays rare (1). Verified over six deals: cells
      uniformly 392, spans uniformly 790 (= two cells plus the gap),
      zero uncovered rows, desktop and phone.

      Three bugs found by measuring, all the same family — heights that
      look declared but are not:
      1. A span's image was leaking its INTRINSIC height upward through
         height:100% (a percentage of an unresolved grid row falls back
         to auto), making the rows it spanned taller and breaking the
         uniform cell elsewhere. Fixed by taking span images out of
         flow.
      2. That left spans with no height at all, so any span alone in
         its rows collapsed to zero — the hero always, the 2×2 whenever
         two columns make it the whole block. Fixed by telling spans
         their height outright: two cells plus the gap, with --cell
         MEASURED off a rendered 1×1. A written ratio cannot survive
         the breakpoint (392 at three columns, 176 at two).
      3. The mobile label override sat ABOVE its own default in the
         stylesheet, so at equal specificity the default won and 16px
         labels wrapped to three lines on a 172px column — one cell
         taller than all the others. Source order was the whole bug.

      v12 made the work a proper modular grid. Every tile is the base
      cell or a whole multiple of it: 1×1 (fixed 4:3, so a row of them
      is one clean band), 1×2 (one column, two cells deep), and 2×2
      (two columns, two cells deep — wide AND tall, never the long thin
      letterbox v11 had). The base cell is the only tile that declares
      a ratio; everything larger takes its size from the tracks it
      spans, so a 1×2 is exactly two cells plus the gap by
      construction rather than by a tuned number.

      The rule that makes it hold: tiles are dealt in two-row BANDS
      whose compositions all tile the band exactly. A void cannot be
      composed, so it cannot be dealt — no tall tile ever stands beside
      an empty cell, which was the v11 complaint. The dealer also
      refuses a composition that would leave the deck unable to finish
      on a whole band. Verified across five deals by scanline: every
      cell footprint 392px, every frame 337px, zero uncovered rows,
      desktop and phone.

      And the work names itself now. A standing label under each frame
      at the case study's body size (--pp-note, 16px) in weight 600,
      with the category following in grey. The hover caption stays on
      the board, where a tag is a bonus, and comes off the work, where
      it was the only thing naming a project and did not exist at all
      on a phone. Two structural notes: the label reserves TWO lines
      whether or not it needs them (a label that grew when a title
      wrapped would make that one cell taller than its neighbours), and
      the solid cards carry a bottom margin of exactly that height, so
      where an image card has its name a solid card has nothing but
      still occupies the same footprint.

      The drift driver now MEASURES its slack (image height minus frame
      height) instead of keying off class names and constants. The tile
      sizes moved and it needed no change.

      v11 gave the grid three tile sizes. 1×1 is the default and keeps
      the image's OWN proportions, which is where the varied heights
      and so the negative space come from. 2×1 spans two columns as a
      cinematic band; 1×2 is the hero, one column at twice the depth.
      Both of those take a fixed crop, because they are deliberate
      shapes rather than found ones. Dealt: 4-5 wide and 2-3 tall a
      deal, verified over six deals, zero mid-run holes.

      The placement pass now TRACKS the column instead of inferring it.
      That was overdue: index-modulo-columns silently stopped being
      true the moment the info cards were spliced in (v9's hero spread
      was luck, not logic), and a 2-wide tile breaks it outright by
      shifting every card after it. Counting also gives the two rules
      for free — a wide tile may only begin where two columns remain,
      or the grid pushes it down and leaves the cell beside it empty;
      and a tall tile never repeats a column, so heroes cannot stack.
      A run ending on a lone card closes full width, since two empty
      cells read as a failed load rather than an ending.

      v10 made the work a real grid. A masonry is the opposite of
      Swiss: its columns flow independently, so no two cards share a
      baseline anywhere on the page. align-items:start puts every card
      in a row on one top line, the row is as tall as its tallest card,
      and the difference falls as air beneath the shorter ones — the
      ragged edge moves from the sides to the bottom, where it reads as
      composition. Verified: 11 rows, every card on one of exactly
      three column lines, one width throughout.

      The dealt width variance is OFF in the work now. A card at 82% of
      its column puts its left edge where no other card's edge is,
      which is the same misalignment one level down. Variety comes from
      the images' own proportions and from the heroes. The board keeps
      its masonry as deliberate contrast — composed work, collected
      board — but that is a decision to revisit, not a law.

      v9 kept the three-column masonry and added three things:

      HEROES. A masonry cannot span columns, so a hero goes deep
      instead: same column, a 3:4 portrait crop, no width variance so
      it fills its column. Two or three a deal, and because fillCols
      deals round-robin a card's column is its index modulo the column
      count — which makes "one per column, never stacked" something the
      dealer can check rather than hope for.

      SOLID CARDS. The four info cards (What I do / How I work /
      Recently / Get in touch) are dealt into the work feed as solid
      ink, no outline and no eyebrow. An outlined white card on white
      ground reads as an empty box; a solid one reads as a deliberate
      beat. They carry data-nav-dark, so the masthead's existing
      reversal driver flips the wordmark white as they pass under it —
      which answers the dark-ground question left open in v4 using
      machinery that was already there. The practice stratum keeps the
      bio as its lead and no longer has a card band.

      THE DRIFT. Every image is cut taller than the frame that clips
      it and walks inside it as the card crosses the screen; heroes
      drift further, which is the second half of what makes them read
      as heroes. It is the house's own motion vocabulary (the case
      studies already move held content at a fraction of page speed),
      it costs no layout, and only visible frames are touched.

      One bug worth remembering: the drift's offset must run 0 to
      -slack, NOT symmetrically about the middle. Swinging both ways
      pushes the image below the frame's top edge for half the pass and
      shows a sliver of background there — caught by measuring the
      frame against its image, not by looking. y = -p * slack with p
      clamped to [0,1] can only ever sit inside the slack.

      OPEN: the bio lead and the "What I do" card say nearly the same
      thing in different words. One of them should go or be rewritten
      (one fact, one home).

      v8 (the work as a two-column grid of filled cells with dealt
      full-width heroes) was built, looked at, and REVERTED at your
      call — the lab is back on the v7 three-column masonry. It is not
      lost: pending-commit-snapshot/pressing-home-v8-workgrid.html is
      the whole thing, one copy away if any of it is wanted later.
      What it proved, in case the question comes back: the white gaps
      have two causes, the dealt width share (cards at 66%/82% of
      their column) and a masonry of natural ratios never finishing
      level. Uniform cells removed both (0 holes, 98.6% coverage over
      five deals) but cost 8,461px of work grid and a 13,637px page
      against 5,803px now. Either cause can also be addressed alone —
      dropping just the width variance keeps the masonry.

      REGRESSION FOUND AND FIXED: the section-furniture CSS block
      (.stratum padding, .shead flex row, .slbl/.slink) sat between two
      splice anchors in the v5 edit and was deleted with them. For two
      versions the section labels had no gutter and no space-between,
      so "All work" sat jammed against the label instead of at the
      right edge, and the strata lost their 81px of air. Restored.
      AWAITING the trackpad verdict, then the React port (which also
      touches the shared Masthead — see the port notes below).
      Lab lineage in the local snapshot: v1 single pair, v2 mixed feed,
      v3 stratified + second bar.

      Port notes when it goes to React:
      - Masthead gains the field; CENTER_LINKS retire into the
        vocabulary row. Decide whether /info and /inspiration stay
        routable (recommended: yes, the row's first three chips can
        route while the rest query).
      - Dark ground is the one open question. The bar is transparent
        by design, so a text field on a dark card is unreadable — the
        same exposure a wordmark has on the case studies, which is why
        Robert Rodriguez declares three [data-nav-dark] zones. The
        feed declares none, because card darkness is not known at
        author time. Options, cheapest first: (a) accept it, the top
        of the feed is light in every deal so far; (b) declare the
        board stratum dark and let the reversal handle it wholesale;
        (c) compute mean luminance per image once on load and set the
        attribute from it. Decide with the trackpad, not in advance.

## Next

- [ ] **COME BACK TO THE BRAIN.** Parked mid-flight to finish the
      homepage. Open: the Tier 1 voice lines (rates, availability,
      process — 13 audit questions that still shrug), pointing
      ASK_LOG_URL at a real endpoint before launch, and re-running the
      259-question audit after any change (29% missed at last run).
      The audit harness now needs `window.__brain.think`, which the
      driver exposes deliberately.

- [ ] **Work the voice-line drafts.** `src/data/voice-lines.DRAFTS.md`
      holds the priority list from the 259-question audit, tiered.
      Tier 1 (rates, availability, process) is 13 audit questions that
      currently shrug and is the highest-value writing in the system.
      The build does not read that file; a line ships only when it
      moves into voice-lines.ts.

- [ ] **Point the ask log at an endpoint before launch.** `ASK_LOG_URL`
      in the lab is empty, so the log is localStorage-only (read it
      with `askLog()` in the console). Production needs one URL: a
      Next route handler writing to Supabase, or Vercel Analytics
      custom events. The PII drop and the dedupe are already in the
      client, so the endpoint just stores rows.

- [ ] **Re-run the audit after any brain change.** Corpus lives at
      `public/lab/audit-questions.txt`, 259 questions. Load the lab
      and run the fetch-and-think harness. Baseline: 42% missed →
      29% missed, zero altitude violations, zero em dashes. Extracting
      think() into a module would make this CI-able instead of
      browser-only, and would serve the React port at the same time.

- [ ] **Grow the about layer.** `src/data/voice-lines.ts` holds
      Jeremy's authored lines (calibration, Aug 2026): marble, table,
      kitchen, Nordstrom, plus contact/board/miss set pieces. The
      Nordstrom entry is the pattern for the rest of the resume:
      Neiman Marcus, Sally Beauty, Jeffrey, Cosmo Prof each deserve a
      "years and role" lead. One entry per term, npm run facts, done.

- [ ] **Rename the seven hash-named pulls.** Their alt text is written
      now, but the FILENAMES are still content hashes, so they miss the
      keyword layer every other pull gets from its SEO filename. Renaming
      means updating `image-dimensions.ts` in step.

- [x] **Wire the facts index into the brain.** DONE in the lab
      (Aug 2026): intents (contact, where, who) answer before lookup,
      facets compose the sentence, evidence counts rank the grid, and
      the answer renders in the ring's own rows (work left,
      board right, receipt in the notes column as "The working"),
      ambiguity is spoken ("development goes three ways here"), and a
      curated sense bridge redirects the world's words to the studies'
      ("app development files under engineering"), verified against
      the index before it speaks. The React port
      inherits all of it through src/lib/facts.ts plus the lab's
      think()/planFacts() as the porting spec.

- [ ] WAS: **Wire the facts index into the brain.** The extractor
      (`npm run facts`) now emits `src/data/generated/project-facts*.json`
      and `src/lib/facts.ts` queries it. Retrieval is already better
      than the lab's substring matcher: "marble" finds 7 projects
      against the matcher's 2, "photoshop" finds 12, "supabase" 2.
      Next is composeAnswer() citing facets by name — "Marble is in the
      Hill Country kitchen and the Fairview suite" — and the answer
      grid ranking by fact match rather than string hit.

- [ ] **The Type Case.** Keystroke flips any pressing study to its
      annotated source — data file, marks spine, choreography flags, tuned
      constants with their lab origins.
- [ ] **Case study: the CMS is a conversation.** No Framer, no WordPress:
      typed data files + Claude Code as the editing interface + the lab as
      the design surface. The transcripts are the raw material.
- [ ] **Core-8 wave.** The remaining classic studies, easiest first
      (hill-country-oak, jeffrey-spring, you-by-sally are the smallest).
      Sally needs restructuring (three consecutive three-column blocks —
      the fold warns about exactly this).

## Later / ideas parked

- [ ] Bring-your-own-reel: Faux Reel accepts visitor images client-side,
      exports in-browser. The "portfolio containing a product" move.
- [ ] Print editions: art-directed print output from the same data files,
      numbered.
- [ ] Live newsline: the footer's "Recently" reads from real commits.
- [ ] The studies API: document the data files as endpoints; the
      agent-readable portfolio.
- [ ] Archer web licence before the RR study ships publicly.
- [ ] Semantic retrieval upgrade for the homepage deal (embeddings) — the
      interaction doesn't change, only the matching.
- [ ] Mobile pass on a real phone for the whole pressing system.

## Done

- [x] Pressing C masthead + motion kit sitewide (`a71ae2e`)
- [x] Robert Rodriguez rebuilt from its data file (`c8cb860`)
- [x] Three-beat pressing footer sitewide (`9bec225`)
- [x] Pin drift, dead-pin fix, full-color plates, closing negative space
- [x] Pre-port system review: 41 agents, 34 confirmed findings, all fixed
      or documented (`2beae88`, `ef0cff4`, `9215f7b`) + PRESSING.md
- [x] Squircle cursor (`d52e76e`)
