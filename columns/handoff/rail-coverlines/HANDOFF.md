# Rail: Coverlines concept — handoff

Design canvas: "Rail Concepts" (claude.ai artifact), board **02 — Coverlines**.
Reference source: `Coverlines.dc.html` beside this file. It is a design mock, not port-ready code:
read it for values and behaviour, and build the real thing in the house's own files.

Where to build it: the lab first, then port. `public/lab/pressing-home.html`
("Tune HERE first, port second"), then `scripts/port-home.mjs` / the usual path to the homepage.
`public/lab/board-shell.css` is generated from the lab, so don't edit it.

## What changes

The chip rail (the `.ixnotes .rdrawer` rows built by `mkRow`, clipped by `--hug` and flooding to ink)
is replaced by a stack of big type, set like the lines on a magazine cover, plus one reel underneath it that changes with the row.

### Layout
- Rail column: **256px** (currently `--ix-note-w: 180px`). The statement column
  gives up the 76px. Re-check the note in `:root` that says "the rail pays for the wider margins".
- Order, top to bottom:
  1. `/ Info` and `/ Connect`: two inline links, 12px/500, 18px apart, with 30px of space below.
  2. The category stack.
  3. 30px of space, then the reel (256 × 170, radius 16 = `--r`).
  4. 10px of space, then a caption row.

### Category stack
- Rows: Digital, Apps, Campaigns, Branding, Interiors, Staples, in the same order and from the same data as `railCategories`.
- Each row is a real `<button>`: 46px, weight 700, letter-spacing -0.045em, line-height 1.02, no background, no padding.
- The count is a superscript after the label: 12px/600, tabular-nums, 7px padding-top, 4px gap.
  Keep the counts coming from `think()` so the number and the shelf can never disagree.
- Active row: `#000`. Resting rows: a light grey (the mock uses `#d4d4d4`, **see Accessibility**).
  The colour changes over 0.4s on `cubic-bezier(0.2,0.7,0.2,1)`.
- The stack itself never moves or reflows. Only colour changes.

### Caption row
- Left side: `<b>{label}.</b>` followed by the category's `note`, in `#8a8a8a`. 12px/1.45, max-width 26ch.
- Right side: an "Open" link, 12px/500, underlined, offset 3px. It does what the category click already does.

### Interaction
- Mouse hover on a row makes it active and swaps the reel (hover previews stay mouse-only, as they are now).
- A click, or a tap on touch, answers the query exactly as the category buttons do today.
- Focusing a row with the keyboard makes it active too.

### The reel
- **Use the real Faux Reel** (`SizzleReel.tsx` and its `sz-*` rules), not the mock's `rl-*` copy.
  The mock only reimplements a subset.
- Frames: the category's own tiles, which is what the rail stamp already cuts through
  (the pictures from `ids`, or `frames` for Staples). The mock uses 4 frames per category as stand-ins.
- Inside a category, the beats rotate through shutter → slat → curtain → cut → fade.
  - Each frame holds **~950ms**.
  - Beat durations: shutter 0.42s, curtain 0.46s, fade 0.36s, cut 0.16s (steps 2), slat 0.36s with a 40ms stagger across 5 strips.
- **Switching category always uses the burn beat** (burnimg + burnpop + burnwash, 1.1s),
  from the frame on screen to the new category's first frame. The timer restarts after a switch.
- No progress indicator or frame counter.
- `prefers-reduced-motion`: no beats; the frames just swap.

## Open questions (decide before or while building)
1. **Where the Info and Connect content goes.** Today their drawers hold About / News / Stack and the
   address. In this concept they are plain links with nowhere to open. Options: they open a drawer
   above the stack, they reuse the answer column, or they jump to the footer.
2. **Fast hovering.** Sweeping the mouse down the stack starts a burn on every row it crosses.
   The suggestion is to swap only after the pointer has rested on a row for about 120ms.
3. **Mobile / `.railfold`.** This concept has no phone design yet. The stack at 46px will not fit
   the folded rail as it is.
4. **Branding count.** The mock shows 5, which is a guess. Use whatever `think("branding")` returns.

## Accessibility
- `#d4d4d4` on white is about 1.5:1, well under the 3:1 minimum even for 46px bold text.
  Use `#949494` or darker (about 3:1) for resting rows, or accept this as a deliberate exception.
  Note that the statement's grey, `#a6a6a6`, is also under 3:1.
- Every row stays a `<button>` with a visible `:focus-visible` style.
