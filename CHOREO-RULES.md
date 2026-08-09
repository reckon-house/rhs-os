# Choreography rules — what "correct" means

The binding spec for every pressing study. `node scripts/choreo-audit.mjs`
measures compliance and names every violation by file and line; a study
is done when it reports `✓ clean`.

Read `PRESSING.md` first for the language, and
`src/data/robert-rodriguez-case-study.ts` for the reference
implementation. These rules do not replace either — they say which of
the language's flags a section is REQUIRED to carry.

## The four rules

### 1. No full-width plate just sits — `BARE`

Every `hero` and `image` section carries either `choreo.rise` (it climbs
the section above) or `choreo.zoom` (it grows from the right column and
fills the mat). There is no third option and no exception for "small"
images: if it is drawn as a plate, it moves.

**Rise is the default. Zoom is the exception**, because a zoom pins for
320dvh and more than one or two per study stops being a gesture and
becomes the layout. Reach for zoom when the frame rewards being read at
full size — artwork, a poster, a dense interface, a contact sheet, a
tall page — and when the file is **≥3000px native** (Robert's real bar;
see CHOREO-PASS.md on why 3200 was the wrong number).

### 2. A riser needs something that HOLDS above it

A rising plate pulls itself up by RISE (96dvh) with a negative margin
and covers whatever occupies that space. Its predecessor must reserve
that room. Exactly four things do:

| predecessor | how it reserves |
|---|---|
| the cover (`meta`) | its risetail, derived by the layout |
| a pair with `choreo.pin` (`dual-image`, `triple-image`, `quad-image`, `quad-grid`, `masonry`) | PinStage's spacer |
| a plate with `choreo.zoom` | its own risetail |
| **a brief** (any `section-header` cluster) | `ClimbRoom`, emitted by the layout |

That fourth row is new and it is what makes rule 1 achievable. Before
it, a plate rising after a brief covered its copy — measured on Sally at
746px of method columns hidden behind the plate.

**Two bare plates in a row is always wrong** (`STACK`). A risen plate is
NOT a hold: it is moving, carrying its own pull-up. So a run of plates
alternates — the first zooms (or the pair before it pins), the next
rises, and so on. Never rise → rise.

### 3. Every brief with copy pins — `NOPIN`

A `section-header` that absorbs one or more copy blocks carries
`choreo.pin`, so its headline holds while the column travels up beside
it. This is Robert's brief pattern and it is the difference between a
page that scrolls and a page that stages.

One exception:
- A `crossing` header already pins as part of that gesture.

A header immediately followed by a `closing` renders as
`PressingClosing`, which **pins unconditionally in the component** — no
data flag, because every study's recap has a column worth holding a
headline against. The audit therefore does not report closings, and
`choreo.pin` on a closing header does nothing.

### 4. Charts are ink on paper — `CHART`

No classic chart renders in a pressing study. See `VIZ-PASS.md` for the
shape assigned to each remaining type and the two shipped exemplars.

## What is NOT prescribed

Rules say a section must carry a treatment. They never say WHICH image
zooms, where the one crossing lands, or how a study's beats are ordered.
That is composition and stays by hand, per study. Two adjacent studies
in the homepage grid must not choreograph identically — vary which beat
gets the zoom, where the climb falls, whether the pair holds early or
late. A mechanically uniform portfolio fails the brief that produced
these rules just as surely as a static one does.

Also unchanged from CHOREO-PASS.md: exactly one crossing per study,
captions on the marquee plates only, `heldLine` split from two-line
titles, and never author climb room, spacers or `--pp-*` values by hand.

## Working a study

1. `node scripts/choreo-audit.mjs <slug>` — the worklist.
2. Fix each hit. Prefer the smallest change that satisfies the rule; a
   light reorder is in scope when adjacency demands it (the climb
   contract is about ADJACENT sections), a rewrite of the study is not.
3. Check native widths in `src/data/image-dimensions.ts` before
   assigning a zoom. Under 3000px, rise instead.
4. `npx tsc --noEmit`, then `node scripts/choreo-audit.mjs <slug>` again
   until clean.
5. Load the study in dev. Zero PressingLayout warnings. Walk it: every
   climb crosses a held screen, no copy is covered, the crossing cuts in
   once.
6. Narrow through 767 → 760 and flip reduced motion. Both static states
   must read as designed layouts.

## Known gaps

- `hero-carousel` / `logo-carousel` can hold nothing and cannot rise.
  A study opening on one hands over from its cover plainly.
