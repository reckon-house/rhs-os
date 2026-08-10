# The viz pass — every chart redrawn in the pressing hand

The choreography pass gave 27 studies their motion; this pass gives
their charts one hand. Fourteen classic chart types still render inside
`PressingVizFrame` exactly as the classic layout drew them — colored
fills, particle clouds, decorative density — on a page whose every other
mark is ink on paper. `PRESSING.md §"The viz kit"` is the binding spec;
this file adds the reference shapes and assigns one to each remaining
type.

**Read first:** PRESSING.md's viz kit section, then one shipped kit
component (`PressingCoverageChart.tsx` is the smallest) and
`PressingViz.module.css`, whose tokens (`--pv-hair` 14%, `--pv-faint`
8%, `--pv-grey` 45%, `--pv-acc` press red) are the entire palette.

## The six reference shapes (user-supplied, 2026-08-09)

1. **The season wheel** — a radial calendar: concentric arc tracks
   sweeping a shared angular scale, month/segment labels around the rim
   set on the curve, each track broken into phases by tone (ink vs
   grey), a hairline hub. The polar form of a Gantt. New to the
   vocabulary.
2. **The drop-line field** — the Vincent Moon poster: a field of
   vertical hairlines, each carrying one dot and one tiny mono label
   rotated 90°, headline-scale type allowed to interleave with the
   lines. Positions read along ONE axis; line length is annotation
   layout, not data — vary it only to keep labels from colliding.
3. **The range bars** — thick rounded vertical bars floating on a quiet
   ground, mono numerals on a sparse scale, no grid beyond the baseline.
   Already in the vocabulary as "floating range bars when a value is
   honestly a range."
4. **The stepped mass** — a ranked series drawn as ONE continuous
   stepped silhouette in solid ink rather than separate bars: no gaps,
   the steps themselves carry the comparison, and the labels sit
   REVERSED INSIDE the mass at each tread. Enormous flat fields of ink
   against enormous flat fields of paper. Use when the story is a rank
   order and the shape of the decline is the point.
5. **The ruled columns** — one full-height hairline per item, a rotated
   label riding up its rule, and a single solid black block parked at
   the item's value. The rules are a fixed grid, so the eye reads the
   blocks' heights against each other with nothing else drawn. Use for
   a scatter of one value across many named items.
6. **The square matrix** — a small-multiples grid of filled squares, one
   panel per group, marking presence or intensity at each row/column
   intersection. Filled or empty, no shading between; density is read
   from how many squares are black, not from how dark they are. Use for
   membership or intensity across two categorical axes.

Shapes 4, 5 and 6 arrived after the first two exemplars shipped and are
why the wheel is no longer assigned to three studies at once. A shape
used everywhere stops being a shape.

All three are already ink-and-type charts. The kit's rules apply
unchanged: one drawing colour, hierarchy by opacity, one accent at most
and only on the datum the chart exists to show, real numbers only,
`px()` on anything computed before it reaches markup, wide canvases on
the `.scroller`/`data-lenis-prevent-touch` pattern.

## Assignments

Open the classic component, extract its DATA (names, weights, leans,
links — the authored facts), and redraw in the assigned shape. The
classic component stays untouched; the pressing skin is a NEW component
in `pressing/viz/`, registered as its own branch in PressingLayout and
removed from the `VIZ_TYPES` bridge set. Exactly how the A.R.C. charts
were done.

Assigned so no shape repeats inside one study and no shape carries more
than two studies portfolio-wide.

| type | study | shape | the one accent |
|---|---|---|---|
| `cabin-midcentury-spectrum` | chalet | drop-line field (DONE — exemplar) | the element between the poles |
| `material-overlap` | floor-and-decor | range bars (DONE — exemplar) | the one material in all three rooms |
| `ai-heatmap` | sally | **square matrix**: competitors × categories, one filled square per signal | the row with the most signal |
| `intelligence-flow` | sally | **season wheel**: the six pipeline stages as arc tracks around the hub | none — the schematic is the point |
| `material-circos` | hill-country-kitchen | **season wheel**: the four FINISHES as arc tracks, the fifteen surfaces as rim segments (the build inverted the original assignment and argues why in its docblock — four tracks read, fifteen do not) | none |
| `campaign-blast-radius` | ivy-park | **stepped mass**: channels ranked by reach, one silhouette | none — the step shape IS the argument |
| `jeffrey-flagship-radius` | jeffrey-ecommerce | **ruled columns**: one rule per surface, a block at its value | none |
| `editorial-treatments` | neiman-marcus | **ruled columns**: treatments ruled quiet → loud, block at each | none |
| `mcp-architecture` | dsc | **drop-line field**: tools, checks, records and clients as dots on one spine. No call marks — the study authors no call volume, and inventing one is the density this kit exists to refuse | none |
| `kitchen-palette` | hill-country-kitchen | swatch ledger, NOT a chart — colour is the datum, so colour stays; see PressingSystemIndex's swatch row | — |
| `color-permutations` | j-christianson | swatch ledger, same reasoning | — |
| `pattern-matrix` | black-white-type | keep as artwork — the patterns ARE the content; reframe on paper only | — |
| `hex-polygon` | ivy-park | keep as artwork — it is the brand's own mark construction | — |
| `polygon-lattice` | ivy-park | keep as artwork — the same mark repeated and rotated at scale; standalone type so it can sit next to `hex-polygon` where the study actually explains the shape, not nested inside brand-system-volume | — |
| `brand-system-volume` | ivy-park | normalise through PressingSystemIndex's ledger if its data fits toLedger(); else keep | — |

`feature-cards` and `text-right` (A.R.C.) are layout sections, not
charts — out of scope.

## The exemplar — PressingSpectrum

`cabin-midcentury-spectrum` reworked as the drop-line field. What it
keeps from the classic component: the eighteen element names and their
authored leans, verbatim — the data IS the study. What it drops: the
particle clouds (the old ridgeline lesson: generated density that looks
like data is a fabrication in a suit), the per-element colors (the
palette lives in the reel), the seeded RNG and its hydration risk.

Grammar, for the next drop-line chart:
- One horizontal hairline is the axis; the poles label its two ends.
- Each datum is a DOT ON THE AXIS at its position. That is the honest
  part.
- The vertical hairline is a leader from dot to label, alternating
  above/below in stagger tiers so eighteen labels never collide. Leader
  length means nothing and must not look like it does — no scale runs
  vertically.
- Labels are the 9px mono voice, rotated 90°, reading away from the
  axis (up above, down below).
- The accent, once: the element sitting closest to dead centre — the
  blend the section argues for.

## Order of work

Wheel charts are the hardest (text on a curve, arc math through px());
do them after two or three drop-line/range charts have bedded the
conventions in. Suggested: spectrum (done) → material-overlap →
ai-heatmap → editorial-treatments → intelligence-flow →
mcp-architecture → the three wheels → the ledgers.

Per chart: build, register, walk the study in dev (check hydration —
zero mismatch warnings), narrow to 760 and flip reduced motion, commit
per chart or per small batch, naming what the accent marks and what was
deliberately left out.
