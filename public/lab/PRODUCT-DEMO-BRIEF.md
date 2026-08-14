# Brief — build liftable product demos for the portfolio

**Give this to an agent working inside a product repo.** It produces looping,
self-contained HTML demos of that product's real workflows, which get dropped
into a case study on reckon.house as live code — not screenshots, not video.

A working reference implementation exists: `public/lab/sally-demos/` in the RHS
repo (five demos, an engine, and a NOTES.md of everything that went wrong).
Read it before starting. This brief is the generalised version of how it was
built and what it cost to learn.

---

## 1. What you are building

For each demo: **one self-contained HTML file** that replays a real workflow in
the product — a user does a thing, the product responds, something gets made.
It loops. It runs with no build step, no server, no API keys, no network.

One file per workflow. They get placed as separate sections of a case study, so
they must stand alone and be reorderable. Never build one page with five demos
in it.

Aim for 20–60 seconds each. Long enough to show a real sequence, short enough
that the loop doesn't feel like a wait.

**Pick workflows where the product does something a screenshot can't show.** The
test is: does watching it reveal something a still frame wouldn't? A form being
filled in is not a demo. A form being filled in, a model reasoning over it, and
a finished asset assembling out of the other end is a demo. Prefer workflows
that cross a boundary — one tool handing off to another — over workflows that
sit inside a single screen.

---

## 2. The one rule that decides whether this succeeds

**Use the product's own interface code, extracted verbatim. Do not approximate
it, restyle it, or build a tasteful miniature of it.**

On the reference project the first pass was stylized mock windows with invented
data, and it was rejected outright — *"a dumbed down version."* The rebuild
pulled the real CSS out of the product's source with the class names intact and
replayed real content through it. That is the entire difference between an asset
worth publishing and a mockup.

Concretely:

- **Copy the CSS out of the product's source into a demo stylesheet, keeping
  class names identical.** `.message`, `.play-card`, `.iv2-card` — whatever the
  product calls them. Identical names mean anyone can diff the demo against the
  product later and see drift immediately. Put the source file and line in a
  comment at the top.
- **Copy the component markup the product actually emits.** Find the render
  function and mirror its output structure, not your idea of that structure. In
  the reference build a billboard card was invented as a text-only colour panel;
  the real component was an image on top with a fixed-height panel beneath and an
  underlined link, not a button. Every one of those was wrong in a way that only
  reading the renderer would catch.
- **If the product has a real renderer you can execute, execute it.** The
  reference email demo imports the product's actual component library and renders
  genuine output, which the demo then injects untouched. That is the strongest
  version of this: not a copy of the output, the output.
- **Never restyle product markup from the demo side.** If it looks wrong, the
  data or the extraction is wrong. Fix that.

**Third-party UI is the exception.** Reproduce your own product's interface
faithfully; do not clone someone else's. In the reference Figma demo, the
plugin panel is reproduced exactly (it's ours) and the canvas around it is a
neutral work surface rather than a copy of Figma's chrome.

---

## 3. Before you write anything: recon

Do not start from your memory of how the product works. Read it.

1. **Find where the interface actually lives** — the stylesheet or the giant
   `index.html` or the component directory. Note file paths and line numbers.
2. **Find the render functions** for whatever you're going to show. Read what
   they emit, including the classes and the element types.
3. **Pull real rows from the real database** for the content. Real campaign
   names, real generated copy, real product names, real asset URLs.
4. **Read the sequence in the code**, not the sequence you'd expect. The
   reference Figma demo shows images placed before copy — which is correct, but
   for a non-obvious reason (the plugin anchors on image rectangles to locate
   each section, then walks the text nodes). Getting the order right by accident
   and the reason wrong is still wrong; the reason shapes what you show.
5. **Verify names and states against the source before using them.** The
   reference build shipped a retired template because it was in the data, and
   burned a round on it. If the product has current and deprecated versions of
   something, find out which you're holding.

State what you found before you build. If the real content contains a known bug
— the reference data had a generator writing product names that didn't match the
attached images — do not put the bug in the portfolio. Correct it, and write
down in the notes that you did and why.

---

## 4. What content is allowed

**In:** the real interface, real workflow copy, real generated output, real
product photography and packshots, real model names, real schema shapes.

**Out:** sales and financial figures, unreleased campaign plans, customer PII,
anything under NDA that isn't already public.

The line to apply: if it already appears in public marketing or the case study's
own screenshots, it's fine. If seeing it would tell a competitor something they
couldn't otherwise know, leave it out. When unsure, ask rather than guess.

**Label honestly.** Each demo carries a one-line caption saying what it is — a
replay of a real exchange, or a representative sequence. Where copy is
illustrative rather than pulled from the database, say so in the notes. Never
imply a staged sequence was captured live.

---

## 5. The engine

Write one small shared engine and have every demo use it. Requirements, all of
which were paid for on the reference build:

- **One rAF clock.** Not a timer per animation. Everything schedules against a
  single tick.
- **IntersectionObserver gating.** The demo starts when it scrolls into view
  (~25% visible) and freezes when it leaves. A case study page with five
  always-running replays is a battery complaint.
- **A `data-paused` attribute on the host** that also freezes it, so a parent
  page can drive it without knowing anything about the internals.
- **`prefers-reduced-motion` runs the script once, instantly, to its finished
  end state, and never loops.** The final frame *is* the static fallback — this
  means you never need to maintain a separate still image.
- **Loop by restoring the stage's initial `innerHTML`** and re-running. This
  forces the demo to be a pure function of the script, which is what makes it
  reliable.
- **Fully deterministic.** No `Date.now()`, no `Math.random()`. Same frames every
  time, safe to server-render, safe to screenshot.
- **A virtual-time test hook — build this early, you will need it.** Something
  like `step(ms)` that advances the clock in small slices synchronously. Headless
  and hidden browser panes suspend rAF and IntersectionObserver, so you *cannot*
  watch a demo run while verifying it. The stepper is how you get to a given beat
  to screenshot it. Have it also add a class that kills CSS transitions, so
  screenshots show true end states instead of catching a fade.
  ⚠️ The stepper is for jumping to a beat, not for driving a whole replay —
  slices where a resolved wait needs extra microtask hops silently drop time, so
  it drifts badly over 30+ seconds. Use the wall clock for recording.

Primitives worth having: `wait`, `type` (character-by-character into a field),
`stream` (word-by-word, the way a model's output arrives), `reveal`, `press`.

**`stream()` should write text nodes and understand exactly one markup form
(`**bold**`).** Raw HTML passed to it will render literally on screen. Pick the
convention, document it at the call site.

---

## 6. Show it happening the way it happens

Elements fading into place reads as a mockup — it was called out as such on the
reference build, in those words. Replace fades with the real sequence:

- If the product clones a template and fills it, show the clone land whole with
  its actual placeholder text and grey image boxes, then show slots fill in the
  real order.
- If the product calls two models in parallel, show two spinners at once.
  Serialising them misrepresents the architecture.
- If text is set programmatically, set it in one shot per node. Don't fake
  typing where the product doesn't type. The realism is in the *order things
  happen*, not in fake keystrokes.
- Use the product's real log strings and status text, lifted from source.

---

## 7. Verify — do not claim

Nothing ships on "should work."

- Drive each demo to each beat with the stepper and **screenshot it**. Look at
  the screenshot.
- Assert the end state programmatically too — element counts, text content,
  computed widths. Both, not one.
- **Check the console for errors and the network tab for 404s.** The reference
  build shipped a font 404 on every page load of all five demos for a day
  because nobody looked; it only surfaced when the network panel was read.
  Note that console buffers can survive reloads — inject a marker line so you
  can tell fresh errors from stale ones.
- Check the geometry where a fixed dimension meets padding. Measure it, don't
  eyeball it.
- Watch the *middle* of a build, not just the end. A card that renders at double
  size for a second before its sibling arrives looks broken, and the final
  screenshot won't show it.

⚠️ **Browsers cache aggressively during this work.** A "the change didn't
apply" result is usually a stale stylesheet. Force a cache-bypassing reload
before concluding anything about a CSS or HTML edit.

---

## 8. Deliverables

```
<demo-folder>/
  <workflow-a>.html          one file per workflow, self-contained
  <workflow-b>.html
  demo-kit.js                the shared engine
  <product>-chrome.css       verbatim-extracted interface CSS
  assets/                    fonts, real photography, product images
  README.md                  front door
  NOTES.md                   the handoff
```

**Everything self-contained and relative.** No CDN, no external fonts, no API
calls. Package the fonts (confirm licensing with the owner — on the reference
project this was an explicit decision, made knowingly, because the display type
carries the brand). Use relative asset paths, not site-absolute ones, so the
folder works both served standalone and deployed.

Compress the images. The reference folder is ~1.2MB for five demos including
five font faces; there is no excuse for shipping 8000px originals.

**README.md** — what each demo shows, runtimes, how to serve it, the two or
three things someone must not do.

**NOTES.md** — the real handoff, and worth as much as the demos:
- what is genuinely real vs. representative, per demo, honestly
- every deviation from the product and *why* it was made, so the next person
  doesn't "correct" a deliberate choice back into a bug
- every trap already hit, with the symptom, so it isn't paid for twice
- open decisions left for the owner

---

## 9. Traps that transfer

These cost real time on the reference build and are not project-specific:

1. **Scope the replay stage around everything the script writes to.** If the
   engine scopes its queries to a stage element and restores that element's HTML
   each loop, anything outside it is unreachable and the script throws on the
   first append. This bit three separate demos. When a demo renders nothing,
   check the stage boundary first.
2. **One element, one thing driving its `transform`.** A reveal helper that
   animates transform will silently destroy a `scale()` or a
   `translateX(-50%)` centering already on that element. Use an opacity-only
   variant for elements that carry their own transform.
3. **Check the host page's global resets.** Most products set
   `* { box-sizing: border-box }`; a bare demo document does not. It only bites
   where a rule pairs a fixed dimension with padding — but there it silently
   adds the padding to the height and nothing looks obviously broken.
4. **Components have a width they were designed for.** Squeezing a 420px card
   into 300px wraps text into absolutely-positioned elements below it. Let it
   wrap to its own row at full width instead; that's the component behaving
   correctly, not degrading.
5. **Don't reuse the same photograph or model twice in one demo.** It reads as
   stock instantly. Check what the neighbouring demos already used, too.
6. **Match imagery to the claim.** A vivid fashion-colour shot under
   grey-coverage copy undermines the whole thing. Search the asset library for
   the campaign the copy actually refers to — the reference build found the exact
   product shoot the generated copy was written about, and a pre-cut set at the
   exact aspect ratio the component wanted.

---

## 10. Done means

- Every demo loops cleanly, gated on visibility, static under reduced motion.
- Zero console errors, zero failed requests, verified by looking.
- Every beat screenshotted and inspected.
- The interface is diffable against product source by class name.
- Content is real, checked against the source of truth, and inside the boundary
  in §4.
- README and NOTES written, including deviations and traps.
- Nothing is described as working that hasn't been run.

---

## 11. How to talk about it

Say what you did and what you didn't. If part is representative rather than
real, say which part. If something is unverified, say so plainly rather than
hedging around it. Flag decisions that belong to the owner — licensing,
what content is publishable, where a demo sits in the case study — instead of
quietly deciding them.
