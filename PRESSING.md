# Pressing — porting a case study

**This file is the pattern library.** Before building anything on a
case study, check §3 (the skin matrix: every section type and the
component it becomes) and §4 (every field of the pressing bag). Most
"we should build X" turns out to be a flag that already exists —
`choreo.crossing` gives any section header the right-to-left drag,
`choreo.zoom` and `choreo.rise` are already there, and the site tail
(contact, credits, the ring) is one shared component on every route.

The playbook for moving a classic study to the Pressing C language. One
study = one data-file edit + one copy pass. The components never change
per study; if a port seems to need a component edit, stop and re-read
this file.

## 1. What Pressing C is, and the tuning loop

The lab prototype `public/lab/swiss-spread.html` is the SPEC, not a
reference. Design changes happen there first (one file, no build, instant
iteration), then port back into the components. Every tuned constant in
the system carries a comment naming its lab origin. The big ones:

| constant | value | home |
|---|---|---|
| RISE / PLATE_HOLD | 96dvh / 13dvh | `src/lib/choreo.ts` + `--pp-rise/--pp-plate-hold` on `:root` (keep in sync — dual home, documented) |
| COLUMN_GAP | 34px | `src/lib/column-drop.ts` |
| PIN_DRIFT | 0.08 | `src/lib/pin-drift.ts` |
| cover COPY_IN / SPAN / DRAG / TRAVEL | 0.3 / 0.55 / 13px / 0.86 | `PressingCover.tsx` |
| crossing STAGGER / ease / BODY_AT | 0.13 / 1.6 / 0.58 | `PressingCrossing.tsx` |
| quote fill ease / drift | 1.4 / 34px | `PressingQuote.tsx` |
| masthead height | `--nav-h` on `:root` (54px, 48px ≤760) | `globals.css` — the ONE copy |
| type tokens | `--pp-*` on `:root` | `globals.css` (on `:root`, NOT `.pressing` — the footer reads them outside any article) |

## 2. Routing

`style: "pressing"` on the CaseStudy object routes it to PressingLayout;
absent, the classic renderer runs untouched. The classic renderer ignores
the whole `pressing` bag, so a study's bag can be authored and committed
BEFORE the flip.

## 3. The skin matrix and the fold

PressingLayout walks the flat sections array and folds it into clusters:

| section type | becomes | notes |
|---|---|---|
| `meta` | PressingCover | always pins; `title` uses `\n` per reveal line (break × onto its own line); `subtitle` is the statement; `reel`/`specLine` optional |
| `section-header` + following `text`s (+ one `three-column-text`) | PressingBrief | the header ABSORBS the run of texts after it into column paragraphs; a trailing three-column grid nests as the method columns |
| `section-header` with `choreo.crossing` | PressingCrossing | absorbed texts become the scrub-toggled column |
| `section-header` + `closing` | PressingClosing | absorbed texts render AHEAD of the closing's own paragraphs |
| `hero` / `image` with `choreo.zoom` | PressingZoomPlate | pinned zoom; climb room derived (never authored) |
| `hero` / `image` with `choreo.rise` | PressingPlate (rise) | climbs the PREVIOUS section, which must hold |
| `hero` / `image` (plain) | PressingPlate (flow) | `bleed: true` (ImageSection) spans the viewport |
| `dual-image` | PressingPlatesPair | opposing parallax; `choreo.pin` holds it for the next riser |
| `editorial-headline` with `choreo.quotePoster` | PressingQuote | without the flag the section is SKIPPED |
| `rr-system-index` | RRSystemIndex | bespoke per study — a new study's index is a NEW component |

**Everything else warns in dev and renders NOTHING in production** —
standalone `text`, `triple-image`, stats, feature-cards, every viz type.
The dev console is the porting checklist: run the page once and every
warning is either a restructure or a missing skin. Known fold rules:

- Absorbed paragraphs always render before the nested columns, whatever
  the authored order.
- Only ONE `three-column-text` nests per header; a second warns and is
  dropped — restructure (Sally runs three in a row; that is a
  restructure, not a port).
- A `rise` section whose previous sibling neither pins, zooms, nor is
  the cover gets a dev warning: the climb has nothing to cross.

## 4. The pressing bag, field by field

- `mark: { n, name, dark? }` — the study-wide numbered spine. Manual and
  sequential, starting at "02" (01 is implicitly the cover headline);
  nested `columnsMark` (from the three-column-text's own bag) joins the
  sequence. `dark: true` on ink grounds only.
- `caption` — single plate figcaption, raw string.
- `captions` — dual-image: one string PER IMAGE, `\n` splits the left and
  right mono spans ("Polka-dot dress\nSpring 2024"). Zoom plate: the
  caption LINES of the single image (three entries in RR).
- `plate` — the zoom numeral. Inherits the governing mark's `n` by
  convention (the prototype renumbered them that way).
- `instruction` — the zoom's mono scroll cue.
- `heldLine` — the prototype's `.out` span: brief/closing render it as
  its own flush block line; crossing concatenates title + heldLine.
- `indent` — quote poster: index of the `\n` line that takes the offset.
- `choreo.pin` — hold this section so the NEXT sibling can climb it.
- `choreo.hold` — keep the PLATE_HOLD rest beat before the climb
  (default true; `false` drops the beat).
- `choreo.rise` / `zoom` / `crossing` / `quotePoster` — pick the skin.

Removed on purpose (do not reintroduce): `bw` — photography runs FULL
COLOR in this language; the prototype's `.bw` class is deliberately
empty. `navDark` — dark sections carry their own `data-nav-dark`
attribute internally (the quote does); the field was dead.

## 5. Choreography rules

- `pin` holds for the NEXT sibling's rise; `rise` climbs the PREVIOUS
  pin. Adjacent, always.
- The cover always pins. Covers and zoom plates reserve climb room ONLY
  when the next section rises — the layout derives it; never author it.
- RISE (96dvh) must stay under the shortest pinned stretch on the page.
  Nothing verifies this — check any new composition against it.
- Below 760px (`CHOREO_BREAKPOINT`) and under `prefers-reduced-motion`,
  ALL choreography is off via CSS-owned static states. Every new
  behavior needs both static states designed, not just skipped — the
  review's worst finding was reduced-motion desktop covering a screen of
  content because one half of a contract switched off without the other.

## 6. Scroll architecture invariants

- Lenis owns `<main>` in wrapper mode: `main.scrollTop` writes revert
  (go through `getLenis()`); bare window scroll listeners never fire.
- Subscribe per-frame work through `onTick` in `src/lib/scrub.ts` — one
  shared rAF loop, parks on `html[data-paused]`.
- All scrub math is `getBoundingClientRect()` vs `window.innerHeight`.
- `100dvh` never `100vh`. `var(--nav-h)` never a masthead literal.
- Sticky dies under transformed / filtered / overflow-clipping
  ancestors: pressing sections mount in PLAIN flow.
- Two drivers never write `transform` to one element (PinStage's inner
  drift layer exists for exactly this).

## 7. Images

- Every image from the source study SURVIVES the port — text shrinks in
  the allocation pass, images do not. Place extras as flow plates
  (`bleed: true` for the big beat) rather than dropping them.
- Every image needs an entry in `src/data/image-dimensions.ts`. This is
  load-bearing SCROLL math, not just CLS: a lazy plate with no declared
  ratio reflows the page when it loads, eats the scroll delta, and reads
  as the plate sticking on entry.
- Hero-grade source files, descriptive SEO filenames, same as always.

**Size the treatment to the file, not the other way round.** Native
width ÷ 2 is the largest honest CSS width, because a retina screen asks
for two device pixels per CSS pixel. A 768px export is crisp to ~384
CSS and mush above it, and no CSS fixes that — the pixels are not
there. So:

| native width | treatment |
|---|---|
| under ~800px | a `three-column-text` column's own `image` (~380px measure) |
| ~800–2400px | a flow plate, no bleed |
| over ~2400px | anything, including `bleed: true` |

`PressingPlate` caps a single plate at its native width as a backstop,
so a small asset centres with air rather than stretching. A.R.C.'s
three app screens are the worked example: they were 768px files drawn
at 661 and 772 CSS, and they now sit in the method columns.

**The cover reel is required, and every frame must be OPAQUE.** A PNG
with an alpha channel lets the reel's dark stage through and reads as
the picture failing to fill its box; `object-fit` cannot cover what is
not there. Screen renders with device bezels and logos on transparent
grids are the usual offenders. Colours come from the study's own
declared palette. `npm run facts` reports any pressing study missing a
reel and names any frame carrying alpha.

**A full-bleed plate fills the WIDTH, and the leftover height is
panned.** On a wide, short laptop the arithmetic is unforgiving: 2000
CSS of width at 1.625 needs 1231 of height and the screen has ~1065.
Something has to give, and it is not the width — a plate that letterboxes
is not a plate. So the overshoot becomes something to scroll through.
The pan has a FLOOR of half a viewport of scroll: at the old 1:1 a
150px spill was over in 150px of scrolling and never registered as a
pan, which is precisely why it read as the bottom being cut off. Big
spills keep 1:1; small ones finally read.

`zoomFit: "contain"` still exists for a frame that genuinely must stay
whole on screen, and it fits the FULL viewport rather than the
masthead-shortened mat. Reach for it rarely: on most laptop
proportions it letterboxes a landscape frame, which is the complaint it
was invented to fix arriving from the other direction.

**The old note, kept because the reasoning still applies:** The plate's
default is to fit the VIEWPORT WIDTH and treat the leftover height as
spill to pan through, which is right for a tall frame. Give a wide one
the same treatment and the sums stop working twice over: the spill is
too small to read as a pan, so the missing bottom registers as a crop
rather than as something still to come, and fitting a 1.6-ratio frame
to the width asks for far more device pixels than the file has, so it
also goes soft. `contain` scales until the WHOLE frame fits the mat and
sets spill to zero. Ratio kept, nothing off screen, and a smaller ask
of the file. A.R.C.'s kitchen frame is the worked example: 3840×2363,
now drawn at 1375×846 inside a 900px-tall mat.

**One section per study crosses right to left.** The HEADLINE's lines
are cut apart at their rendered line boxes and dragged in from a full
viewport off to the right, staggered 0.13 apart, scrubbed by scroll.
`cutHeadline` lives in `src/lib/cut-lines.ts` and both callers share it.

Two homes for the same gesture, and the difference is only what happens
after it:

| | headline after landing | column |
|---|---|---|
| `PressingCrossing` (Robert) | leaves with its copy | short, on the pinned screen |
| `PressingBrief` + `choreo: { pin: true, crossing: true }` | PINS | long, travels past independently |

Reach for the brief form when the section carries method columns: the
standalone crossing renders headline and intro on a screen of their own,
which puts the argument on one screen and its evidence on the next.

**One definition, so the two cannot drift.** The cut, the curve, the
stagger and the travel all live in `src/lib/cut-lines.ts`
(`LINE_STAGGER` 0.13, `LINE_EXP` 1.6, `LINE_SPAN_VH` 1.2, `lineOffset`).
Both components call it. They HAD drifted — the brief was written with
an ease exponent of 3 against Robert's 1.6, which decelerates far
harder: most of the distance covered early, then a crawl. Same stagger,
same distance, visibly different move. A gesture used once per study is
met with a long gap in between, which is exactly when a drifted curve
stops reading as the same thing. Tune in the lab, change it here, and
both stagings move together.

Under `crossing` the brief renders a plain `<h2>` instead of
RevealHeadline — two drivers on one element's transform is the bug this
kit keeps paying for. Animate the HEADLINE, never the column: the column
sits ~580px below the section's top and a pinned brief is thousands of
pixels tall, so a column-keyed crossing plays out entirely below the
fold and the reader meets a column already at rest. Measured, not
guessed.

Use it ONCE per study. The gesture is a punctuation mark and a second
one spends it.

**An image in a column drifts inside its frame, like every other image
on the site.** `.colFrame` owns the shape, the clip and the radius;
`.colImg` is cut to 112% of it and owns the transform. One driver per
property, and the offset is only ever NEGATIVE — a symmetric swing
about centre pushes the picture off the frame's top edge and exposes
the ground behind it, which this kit has already paid for once. Only
frames on screen are written, and only inside a rAF: a transform per
element per scroll event is how a long study starts to stutter.

## The viz kit (charts and graphs)

`src/components/case-study/pressing/viz/` — one stylesheet, five
components so far. The classic showpieces (ridgeline, particle cloud)
stay untouched for un-migrated studies; a study that goes pressing gets
these automatically through PressingLayout.

The system:

- **Ink on paper.** One drawing colour. Hierarchy is opacity: 45%
  recessive, 14% hairline, 8% faintest grid — the ladder the captions
  already climb. The study's palette lives in the reel, not the charts.
- **One accent per chart, at most**, and only on the datum the chart
  exists to show: the coverage gap, the 30-minute bar, the launch dot.
  Press red #E0552F. A chart with no single point gets none — the
  schematic is pure ink.
- **Hairlines, dots, type.** No area fills, no gradients, no decorative
  density, no legends. One ink needs no decoding, so labels sit on the
  data.
- **Type carries the number.** Values at display weight, labels at the
  10px caps standard. When a figure has no stated scale, the number IS
  the chart: draw a ruled spec row, not a bar pretending to measure.
- **Real numbers only.** The old ridgeline's density waves were
  generated, not measured — decoration that looks like data is a
  fabrication in a suit. If the study didn't author it, don't draw it.
- **Deterministic geometry.** Coordinates rounded to 1/1000px, no
  randomness: Node's trig and Chrome's disagree in the last bit, and
  the classic architecture component paid for that with a triple
  hydration mismatch every load.
- Wide canvases keep the intentional horizontal scroll
  (`.scroller`/`.wide`, `data-lenis-prevent-touch`), same as always.

Vocabulary on the shelf (use when the data genuinely has that shape):
tick rulers with mono numerals for time (the scale may run on faintly
past where the data ends — the scale continues, the work does not);
dumbbells for two-point comparisons; floating range bars when a value
is honestly a range; dot-on-a-line for positions between two poles.

**The renderer will not overdraw.** Every image slot caps itself at
`native ÷ 2` CSS pixels — a retina screen asks two device pixels per CSS
pixel, so that is the largest honest width and no CSS buys more. Column
frames take `--col-native`, plates cap at their native width, ledger rows
cap on height. An undersized file therefore renders SMALL AND SHARP
rather than large and soft.

This backstop is why the problem stops recurring. Without it the
renderer draws whatever it is given at whatever width the layout has, so
the same undersized file turns up soft in every new place it is put —
once in a plate, again in a column, again when the layout stacks on a
phone and the column goes full width. Fixing the placement never fixed
the cause. Now an overdraw is impossible by construction, and the build
report below tells you which files to re-export to get the size back.

**Resolution is gated at build time, per treatment.** `npm run facts`
reads every pressing image's header and checks its native width against
how the section draws it:

| treatment | native floor | honest CSS |
|---|---|---|
| full-bleed / zoom plate | 3200 | 1600 |
| flow plate | 1600 | 800 |
| column image | 760 | 380 |

It reports, by study and filename, anything drawn larger than its pixels
allow, with the fix ("re-export bigger, or drop the bleed"). This exists
because the classic layout never tested any of it — it drew everything
inside the column, so a 2600px file looked fine there and only went soft
once pressing full-bleeded it. "The live one looks sharper" usually
means the live one was never asked to fill a screen.

**A composited scale animation rasterizes ONCE, at the scale it was
promoted at.** `will-change: transform` is the instruction not to
re-raster, so a plate laid out small and scaled up paints a small bitmap
magnified — the source never gets decoded past the layout box, and a
3840px file can ship half its pixels. The zoom plate drops the hint
whenever it parks so Chrome re-rasters at the settled scale. Any new
component that animates scale on a large image owes the same release.

**Known gap:** every pressing plate is a raw `<img>` while the classic
section components use `next/image`, so pressing pages ship originals
rather than sized AVIF. Fix before the remaining studies port over.

## 7. Robert is the foundation study

**When Robert already does a thing, copy its numbers. Do not re-derive
them.** Every re-derivation this kit has attempted has cost an hour and
landed somewhere subtly wrong: a crossing rebuilt on the wrong element
and animating below the fold, a system ledger whose rows were flung to
opposite page edges by an invented `justify-content: flex-end`, an ease
exponent of 3 against Robert's 1.6. The values in
`RRSystemIndex.module.css` and `crossing.module.css` are tuned against
the lab prototype. Read them, lift them, and put the shared mechanism in
`src/lib/` so there is one copy.

What is legitimately per-study is CONTENT and taste: Robert's palette
STATES, its lockup outlines, its reel. What is not: row geometry, gaps,
indents, easing curves, stagger. Those are the language.

## 7a. The system ledger

Two components, one pattern. `RRSystemIndex` is bespoke to Robert —
its Archer lockup, its four-state palette and its reel ARE that
campaign, hardcoded on purpose. `PressingSystemIndex` is the generic
one: `brand-system` data in, rows out, skipping any row the data cannot
fill. Both open with a headline, alternate label and specimen down the
rows, and animate.

**Alternate the rows.** Label left, specimen left, label left. A ledger
where every row starts the same way is a list. Do it with `order`, not
`flex-direction: row-reverse` — reversing would also flip the specimens
INSIDE a multi-item row (two typefaces would swap places) and puts the
label after the thing it names in focus order.

**Alternation is order plus INDENT, never alignment.** The row is a
plain flex line: label and specimen sit adjacent with one
`clamp(16px, 2.6vw, 46px)` gap, and the whole row carries a per-row
`--indent` (Robert's are 3vw, 17vw, 8vw — varied, not a staircase, so
it reads as an index rather than a list working its way across). The
display size lives on the ROW and the label inherits it. Pushing the
specimen to the far edge with `justify-content` splits the row into two
things at opposite ends of the page; it was tried and it was wrong.

**The palette morphs colour and form together**, on the shared
polar-profile lerp in `src/lib/swatch-morph.ts`. Every shape is reduced
to a radius at each of 180 angles, so any two morph index-for-index — no
correspondence guessing, no twisting corners. What stayed private to
Robert is the STATES table: those shapes and radii are campaign values,
and equal circumradius is not equal optical weight (a circle at 41
balances a square at 47). The generic component varies shapes from a
ladder instead, because it cannot know a brand's forms but can still
make the swatch read as a system rather than a dot.

**The pattern library cycles; it is not a contact sheet.** A single
sheet of all the components shows each at a tenth its size and cannot
move. `patternLibrary: string[]` feeds the individual frames to
`SizzleReel` — Robert's Compositing row exactly — and the box's height
is rewritten per beat from each frame's NATIVE ratio, because a stats
card is wide and an account panel is tall and an unmeasured box reflows
the whole row on every cut. Ratios are read once up front and the reel
only mounts when they are all in.

Every number is Robert's: `.reelBox` at `clamp(68px, 8vw, 130px)`,
`.swatch` at `clamp(64px, 7.6vw, 124px)`, his mobile block, and
`.reel { width: 100%; height: 100% }` — omit those last two and the reel
collapses to nothing, which looks like a broken image rather than a bug.

I invented larger sizes here first, reasoning that UI needs to read
bigger than photography. It was a plausible argument for changing a
tuned value and it was still wrong: the row is a ledger of specimens at
one scale, and a sample that outgrows the others stops being a
specimen. If a size genuinely needs to change, change it in
RRSystemIndex too so the family stays one family.

**Frames flex; the row holds.** These are two different boxes and it
matters. Each frame keeps its OWN proportion — `shape()` rewrites the
reel's height per beat, exactly as RRSystemIndex does, because showing a
stats card and an account panel at their true shapes is the point and
one shared box would crop or letterbox every one. The ROW is what stays
still, via `--sampleH`: every specimen sits in a box of that height with
captions absolutely positioned inside, so nothing a specimen does can
reflow anything.

Robert hardcodes `--sampleH: 208px`, tuned against his four frames. A
generic component cannot hardcode it, so it MEASURES: the tallest
frame's height at the current box width, recomputed on resize since the
box is a vw clamp. Same mechanism, sized from the data instead of by
hand.

Frames must be OPAQUE. Cutting them out of a transparent contact sheet
means flattening onto white on the way out; `npm run facts` rejects
alpha by name.

**Know when NOT to morph.** Robert's lockup interpolates because
Archer's outlines were extracted with matching ring counts. A.R.C.'s
mark is filled serif letterforms; interpolating those produces a smear.
It shows its construction drawing instead, which is what that artwork
actually is. Reach for the mechanism the material supports.

Cycles run on the shared loop via `onTick` and keep time by
accumulating capped deltas, so `html[data-paused]` stops the clock and a
resume carries on rather than fast-forwarding through what it missed.

## 7b. The live product

A study whose subject is deployed software can run that software in the
page. A.R.C. does: `{ type: "live-app", src: "https://arcready.app", … }`
frames the real deployment. The homepage it loads carries A.R.C.'s own
public AI demo, so a reader photographs their own room and watches the
real model itemise it — the exact mechanic every section above only
describes.

**Frame the deployment. Do not port it.** The first attempt here ported
a few of the app's cards and fed them data I wrote, and it failed twice
over. The item names were invented and paired with photographs of
something else, which is fabricated content inside a working interface —
the place a made-up number is MOST likely to be read as real. And the
interaction was backwards: a list you edit, when the product's actual
mechanic is that you photograph a room and the model tells you what is
in it. A port is a fork the day it lands, it needs fixtures, and
fixtures are where invention creeps in. The deployment needs none of
that and cannot drift, because it is the thing itself.

**Before reaching for it, check two headers.** `curl -I` the target: an
`X-Frame-Options` or a CSP `frame-ancestors` will refuse the frame, and
that refusal belongs to whoever runs the site. A.R.C. sends neither, and
its `/api/demo-analyze` answers 400 rather than 401, which is what a
deliberately public demo endpoint looks like.

**Rules.**
- **Click to activate.** Nothing is requested from another origin until
  the reader asks. No third-party connection on the way past the
  section, no cost, and a heavy external app never competes with the
  study for first paint. The poster is the study's own photography, so
  the slot reads as intentional rather than broken.
- **Show the origin.** The host sits in the frame's chrome. A reader
  should always be able to see whose software is running inside the
  page.
- `allow-scripts allow-same-origin` together is effectively full trust
  of the framed origin. Correct for your own product, a real decision
  every time, never a default to paste onto someone else's site.
- Offer the escape hatch — a plain link to open it in its own tab.
- Dynamic-import it; the frame is client state and has nothing to render
  on a server.

**Why it matters beyond one study:** the study stops asserting and
starts handing over. And a framed app is text and vector at any size, so
every UI screenshot it replaces is one fewer file to keep big enough.

## 8. Copy

The CLAUDE.md copy rules apply in full, plus the pressing reality: this
language has FEWER text slots (one reading size, no subhead/footnote
voices in the brief). The port IS the allocation pass — subtitle →
statement, abstract stays authored but unrendered, closing drops any
paragraph the prototype's composition would drop. Marks are story beats:
read the mark spine top to bottom before shipping.

## 9. The porting checklist

1. Size every image against the table in §7 BEFORE placing it, and
   set `zoomFit: "contain"` on any landscape zoom plate.
1. Add `pressing` bags to the study's sections (marks, choreo flags,
   captions) — commit-safe before the flip.
2. Verify every image is in `image-dimensions.ts`, and check each
   one's native width against the treatment table in §7.
2b. Author the cover reel: eight frames, all opaque, colours from the
   study's palette. `npm run facts` will tell you if it is missing.
3. Flip `style: "pressing"`.
4. Load the page in dev; clear every PressingLayout warning.
5. Walk it: cover handover, every pin engages and releases with drift,
   plates climb held screens, marks sweep, quote flips.
6. Narrow the window through 767 → 760; flip OS reduced motion; both
   static states must read as designed layouts, not broken ones.
7. Copy pass against CLAUDE.md; skim the mark spine.
8. Screenshot next to the lab file if the study has a lab prototype;
   pixel-match is the bar.
