# The choreography pass — 27 studies

PRESSING.md §8b ends the porting story mid-sentence: the scripts did the
mechanical half of 27 ports and refused the other half on purpose,
because "which section pins, which rises across it, which headline
crosses are decisions about a specific study's rhythm." This document is
the other half, planned as one sweep. Execute it study by study, by
hand, against the rules below.

**Read first, in this order: `PRESSING.md` (all of it), then
`src/data/robert-rodriguez-case-study.ts` top to bottom.** Robert is the
reference implementation; every bag you author is a copy of a shape that
file already contains. Re-deriving Robert's values has failed five times
in one session before. Do not be the sixth.

## Why this pass exists

Audited 2026-08-09, after the meta-before-hero migration:

| gesture | Robert | A.R.C. | the other 27 |
|---|---|---|---|
| `choreo.zoom` (plate fills the mat, then travels) | 2 | 2 | **0** |
| `choreo.crossing` (headline cut apart, dragged in from the right) | 1 | 1 | **0** |
| `choreo.pin` (section holds for the next riser) | 2 | 4 | **0** |
| mid-page `choreo.rise` (plate climbs the held section) | 2 | varies | **0** |
| plate captions | 8 | 5 | mostly 1 (the reel's) |
| `heldLine` on section headers | 3 | 8 | **0** |
| quote `indent` | 1 | 1 | **0** |

Every ported study renders as cover → briefs → flow plates → closing: a
correct, quiet stack of images. The reader never sees a plate climb a
held screen, never sees a headline cross, never meets a numbered zoom.
The quote poster DOES render everywhere now (unconditional since
329d5c0) — do not re-add flags for it.

Two studies are also missing the cover handover itself:
**amber-shockey-co** and **branding-graphics** have no `choreo.rise` on
their first hero. Fix that first in each; it is a bug, not taste.

## Quotas — what "done" means for one study

Each study, after its pass:

1. **Exactly one crossing.** PRESSING.md: "Use it ONCE per study. The
   gesture is a punctuation mark and a second one spends it." Put it on
   the section header whose argument carries the study's thesis — the
   synthesis beat, the system beat, the reveal. Standalone form
   (`choreo: { crossing: true }` on the header) when the section's copy
   is short; brief form (`choreo: { pin: true, crossing: true }`) when
   the header absorbs method columns. See PRESSING.md §7's table for
   which is which.
2. **At least one zoom plate**, on the study's most detail-bearing
   image — IF an image with native width ≥ 3200px exists (check
   `src/data/image-dimensions.ts` BEFORE flagging; the §7 floor table
   is enforced by `npm run facts`). Landscape frames take
   `zoomFit: "contain"`. If no image qualifies, skip the zoom and say
   so in the commit message — a soft zoom is worse than none.
3. **At least one mid-page pin → rise pair.** A `dual-image` takes
   `choreo: { pin: true }` and the NEXT sibling (a `hero` or `image`)
   takes `choreo: { rise: true }`. Adjacent, always — a rise whose
   previous sibling neither pins, zooms, nor is the cover warns in dev
   and climbs nothing. Studies with no dual-image (big-bend,
   capitan-boot-co, ivy-park, jeffrey-ecommerce, nordstrom-framework)
   chain the zoom instead: zoom plate → next section rises. Zoom and
   cover reserve climb room automatically; NEVER author climb room.
4. **Captions on the marquee plates** — two to four per study, not
   every plate. Single plate: `caption: "..."`. Dual: `captions` with
   one string per image, `\n` splitting the mono lines — Robert's
   `"Polka-dot dress\nSpring 2024"` is the register: factual lines
   pulled from the study's existing copy or alt text. Never invented,
   never marketing, no em dashes.
5. **`heldLine` on headers where the title's last line lands the
   sentence.** Split it out of `title`: A.R.C.'s pattern, e.g. title
   `"Not a photo library. A\nrecognition"` + heldLine
   `"engine."` → the brief renders the held line flush as the
   prototype's `.out` span. One-line titles skip this.
6. **`indent` on the quote poster** where the staircase reads better
   with the offset — Robert and A.R.C. both use `indent: 1`. Taste
   call, not a quota; leave it off where the lines already stagger.
7. **Zoom plates carry the numeral and the cue.** `plate` inherits the
   governing mark's `n` (Robert renumbered them that way);
   `instruction` is the system's own string, reused verbatim:
   `"Scroll — fills the mat, then travels the frame"`. Do not write
   new instruction copy.

**Variance is a quota too.** The user's brief for this pass: "they need
breathing room and variance." Do not stamp one recipe 27 times. Vary
where the zoom lands (early showpiece in one study, late payoff in
another), which beat gets the crossing, whether the pin→rise pair sits
in the middle or closes the run of plates. Read each study's material
and place the gestures where its story turns. Two adjacent studies in
the homepage grid should not choreograph identically.

## The syntax, verbatim from Robert

Zoom plate (Robert lines ~90–99):

```ts
{
  id: "storefront-zoom",
  type: "image",            // or hero
  src: `${IMG}/...`,
  alt: "...",
  pressing: {
    plate: "03",            // the governing mark's n
    captions: [
      "Storefront banner",
      "Neiman Marcus, Spring 2024",
    ],
    instruction: "Scroll — fills the mat, then travels the frame",
    choreo: { zoom: true },
  },
},
```

Pin → rise (Robert ~216–229):

```ts
{
  id: "lookbook-pair",
  type: "dual-image",
  left: { ... }, right: { ... },
  pressing: {
    captions: ["Yellow blazer, studio\nSpring 2024", "Lookbook"],
    choreo: { pin: true },
  },
},
{
  id: "campaign-wide",
  type: "hero",
  image: `${IMG}/...`,
  alt: "...",
  pressing: { choreo: { rise: true } },
},
```

Crossing on a header (Robert ~109):

```ts
{
  id: "campaign-header",
  type: "section-header",
  label: "SECTION 03: CAMPAIGN & DEPLOYMENT",
  title: "One shoot day became",
  pressing: {
    mark: { n: "03", name: "Campaign" },
    heldLine: "an entire campaign.",
    choreo: { crossing: true },
  },
},
```

## Worked example — chalet

`src/data/chalet-case-study.ts`, current order: meta → hero(rise) →
studs brief → exterior plates → interior brief → a-frame image →
dual → editorial → inline hero → kitchen → dual → blend brief →
chart → closing brief.

The pass:

- **Zoom:** `a-frame-ceiling` — the showpiece looking straight up at
  the sputnik through the triangular window. `plate: "03"` (governing
  mark), instruction verbatim, captions from its own material
  (`["A-frame ceiling", "Sputnik chandelier, tree canopy"]`). Check
  its native width first; landscape → `zoomFit: "contain"`.
- **Pin → rise:** `living-group-one` (dual) takes `pin: true`; MOVE
  `living-secondary-hero` up to sit directly after it and give it
  `choreo: { rise: true }`. The editorial headline (`headline-quiet`)
  slides down one slot and becomes the palate cleanser after the
  climb. Light reordering like this is in scope — adjacency is the
  law, and the section order serves the choreography, not the other
  way round.
- **Crossing:** `blend-header` ("Cabin Bones, Mid-Century
  Sensibility") — the synthesis beat, the study's whole argument.
  Standalone form; split the title so
  `heldLine: "Mid-Century Sensibility."` lands flush.
- **heldLine elsewhere:** `studs-header` → title "An Exterior That" +
  heldLine "Stops Disappearing." Same for the closing header.
- **Captions:** the two duals get factual pairs from their alt text.

That is one study's whole diff: one data file, one copy pass, zero
component edits.

## Per-study constraints the table already knows

| study | pin base available | watch for |
|---|---|---|
| amber-shockey-co | dual, carousel | ADD COVER RISE first |
| big-bend | no dual — chain a zoom | photography; zooms plentiful |
| black-white-type | dual | pattern-matrix stays untouched |
| branding-graphics | dual, quad-grid | ADD COVER RISE first |
| capitan-boot-co | no dual — chain a zoom | logo-carousel stays |
| chalet | dual | worked example above |
| cosmo-prof | dual, carousel | zero inline heroes today |
| dsc | dual, triple, masonry | busiest study; place gestures with air |
| fairview-entry / -sitting / -suite | dual | images live in fairview-bedroom folder |
| floor-and-decor | dual | material-overlap stays |
| hill-country-bath / -oak | dual; NO single-image sections | zoom goes on a hero |
| hill-country-kitchen | dual | two 3-cols; brief-form crossing fits |
| hill-country-living | dual | — |
| ivy-park | no dual — chain a zoom | triple-image, hex-polygon stay |
| j-christianson | dual | spacers are consumed, leave them |
| jeffrey-ecommerce | no dual — chain a zoom | — |
| jeffrey-spring | dual | — |
| loved-by-nordstrom | dual, quad-image | — |
| neiman-marcus | dual, triple | editorial-treatments stays |
| nordstrom-beauty | dual | — |
| nordstrom-framework | no dual — chain a zoom | shortest study; one gesture may be enough — say so if quota bends |
| nordstrom-personalization | dual, triple | — |
| sally | dual | 3-col runs; brief-form crossing on the method beat |
| you-by-sally | dual | — |

Bespoke viz sections (spectrum, circos, heatmap, hex-polygon, etc.)
are DONE — never touch them in this pass.

## Execution protocol

Work in batches of about five studies. Per study:

1. Read the whole data file. Read its images' entries in
   `image-dimensions.ts` for the zoom-floor check.
2. Author the bags (and any light reorder) per the quotas.
3. Copy pass on every new string against CLAUDE.md's rules — captions
   and heldLines are study copy; no em dashes, no invention. The
   Fabrication Test applies to captions: dates and names come from the
   study's existing material or nowhere.
4. Load the page in dev. Zero PressingLayout warnings. Walk it: cover
   handover, every pin engages and releases with drift, the riser
   climbs a HELD screen (not moving content), zoom fills then travels,
   the crossing cuts in from the right once.
5. Narrow through 767 → 760 and flip OS reduced motion — both static
   states must read as designed layouts. The components own these
   states already; you are checking you didn't compose something that
   depends on motion to make sense.
6. Commit the batch with a message naming what was placed where and
   any quota deliberately bent (no-zoom studies, framework's brevity).

Acceptance for the whole pass — this loop, run from the repo root,
shows every study at zoom ≥ 1 (or a named exception), crossing = 1,
pin ≥ 1, rise ≥ 2:

```bash
for f in src/data/*-case-study.ts; do
  grep -q 'style: "pressing"' "$f" || continue
  slug=$(basename "$f" | sed 's/-case-study\.ts//')
  printf "%-28s zoom:%s crossing:%s pin:%s rise:%s\n" "$slug" \
    "$(grep -c 'zoom: true' "$f")" "$(grep -c 'crossing: true' "$f")" \
    "$(grep -c 'pin: true' "$f")" "$(grep -c 'rise: true' "$f")"
done
```

Then `node scripts/drop-check.mjs` (must report 0), `npm run facts`
(no new resolution or reel findings), and `npx tsc --noEmit`.

## Forbidden moves

- **No component edits.** If a study seems to need one, stop and
  re-read PRESSING.md — the flag almost certainly exists. If it truly
  doesn't, stop entirely and report; that is a design decision, not an
  execution detail.
- **No new tuned values.** Clamps, easings, staggers, holds are the
  language and live in the components and `src/lib/`.
- **No second crossing**, however good the argument. Every one of
  these values fell to a plausible argument once.
- **No invented captions, dates, or claims.** Shorter and factual
  beats longer and padded, in captions as everywhere.
- **No stripping classic-renderer fields** (`inline`, `nativeRatio`,
  `aspect`) — pressing ignores them, and the classic renderer still
  serves any study that flips back.
- **Do not author climb room, spacers for air, or `--pp-*` values** —
  the layout derives all of it.
