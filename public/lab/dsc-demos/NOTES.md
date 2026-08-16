# dsc-demos — handoff notes

**What these are:** scripted, looping replays of DSC gym-platform workflows,
built lab-first for embedding as live code sections in the reckon.house DSC
case study. Built + visually verified in the DSC product session (2026-08-14),
which has the product context; this note is the handoff for the RHS session
that ports them.

Built to the brief's fidelity bar (the Sally demos' v2 standard): the real
interface, extracted verbatim, replaying real content. Reference
implementation: `RHS/OS/public/lab/sally-demos/` — its NOTES.md traps were
read first and are re-listed at the bottom where they transferred.

## How "verbatim" works here (differs from Sally)

The DSC app is **Tailwind v4 utility-first** — there are no semantic component
classes to extract. Verbatim therefore means:

1. `dsc-app.css` IS the deployed app's compiled stylesheet, downloaded from
   dsc-gym.vercel.app (`/_next/static/chunks/c6af397b294c5e6b.css`,
   2026-08-14). One mechanical change: `url(/fonts/…)` → `url(assets/fonts/…)`
   so the folder is self-contained. Nothing else was touched. Diff it against
   the deploy to see drift.
2. Demo markup carries the **exact class strings from the JSX**, with the
   source file and line range in a comment at the top of each demo. If the
   product's classes change, re-copy the strings and re-download the CSS.
3. The product's Tailwind preflight (`box-sizing: border-box` on `*`) ships
   inside that compiled CSS — so the reference build's "missing global
   box-sizing" systemic gap does not exist here. Don't add a second reset.

Chrome sources per demo (also in each file's header comment):

- `owner-batch-chat.html` — `src/app/admin/_components/AdminHeader.tsx:11-31`,
  `src/app/admin/chat/page.tsx:237-243` (pending banner),
  `src/app/admin/_components/ChatThread.tsx:146-256` (thread + dock)
- `athlete-mcp-loop.html` — `src/app/admin/page.tsx:198-216` (console header),
  `:264-281` (launcher cards), `:320-378` (BookingRequestsBox)
- `standing-slots.html` — `src/app/admin/athletes/[id]/page.tsx:151-315`
  (detail page), `:393-505` (AddStandingSlotSheet),
  `src/app/admin/calendar/[date]/page.tsx:177-300` (day view)

## What is real vs. representative, per demo — honestly

### owner-batch-chat.html

- **Real, verbatim:** the whole exchange through the "13 pending" banner. It
  was run in the live app on 2026-06-12 against the seeded production DB
  (the same exchange is the frame in the case study's `hero2.jpg`): the user
  message, all three assistant bubbles including the 10 accepted dates, the 3
  named conflicts, and the banner text.
- **Real mechanics, worth not "fixing":**
  - The chat renders **raw text** (`whitespace-pre-wrap`, no markdown) — the
    `**✅ 10 sessions accepted**` asterisks and the `_calling \`tool\`…_`
    marks appear literally in the product. The demo reproduces that.
  - Tool marks land inside the current bubble with a blank line before them
    (`chat/page.tsx:141`), and each tool round / wrap-up opens a **fresh
    bubble** (`assistant_turn_complete` / `wrap_up_start`). The demo's bubble
    boundaries follow that event flow exactly.
  - Tool names are the scheduler's real ones (`src/lib/scheduling/tools.ts`):
    `list_athletes`, `propose_batch`, `commit_all_pending`.
- **Representative (one beat):** the captured session stopped at "Want me to
  go ahead and commit them?" — the commit turn ("commit" → confirmation
  message) is composed in the product's voice, because committing in the live
  session would have written 10 real sessions to the seeded DB. The banner
  count (13) and the commit tool name are real.

### athlete-mcp-loop.html

- **Real, verbatim:** both athlete messages and every AI reply, word for word
  from a real Claude.ai session run against the live MCP server (2026-06-13 —
  the same session the case study's chat captures come from), including the
  "20-slot cap" hiccup, the full availability table, and the confirmation
  with "Pending Scott's approval." The tool-chip labels are that session's
  real thought lines. The owner-side card ("Marcus Chen wants Scott · via
  AI") is the real BookingRequestsBox markup, and "via AI" is the product's
  real `source === 'mcp'` tag.
- **Representative / deliberate:**
  - The chat surface is **neutral by design** — the real session ran in
    Claude.ai, and we don't clone a third party's chrome (same rule as the
    reference Figma demo's canvas). The caption says so.
  - The mono tool names in the chips (`my_trainer_availability`,
    `request_session`) are the MCP server's real tool names
    (`src/app/api/mcp/athlete/route.ts`); the live Claude UI showed thought
    summaries, not tool names. Pairing them is grounded but composed.
  - **Identity:** the live session was run from a test athlete account. The
    demo presents the athlete as Marcus Chen (the seed athlete) to stay
    consistent with the study's other frames — the same anonymization Jordan
    already made in the study's consent-screen and console mockups.
  - The date in the owner card (Mon, Jun 15 · 8:00 AM · 60min) matches the
    chat's booked slot — consistent within the replay.
- **Skipped, deliberately:** the OAuth consent step (it's in the study as a
  still) and the athlete's approval email (another renderer; the closing cut
  line names it instead).

### standing-slots.html

- **Real:** the flow and its values were run in the live app on 2026-06-12 —
  Marcus Chen · Tuesdays · 4:00 PM · 60 min · Scott — and the sheet, slot
  card, and day view are the product's own markup. Jim Bender's 5/6/7am
  Tuesday block on the day view is the seeded DB's real standing pattern.
- **Representative / deliberate, two things:**
  1. **The materialization outcome.** The live run reported "0 sessions
     added, 8 skipped" because the seeded Marcus already had conflicting
     Tuesday sessions — the engine's duplicate-refusal doing its job. The
     demo shows the clean-calendar outcome (the new 4:00pm session landing),
     which is what materialization does when the slots are free, and which is
     the feature the beat exists to show. Demo 1 already demonstrates
     conflict-skipping in detail.
  2. **The native alert is skipped.** The product confirms via a browser
     `alert()`. OS dialog chrome isn't ours to reproduce and a real alert
     can't be scripted in a replay; the sheet's own explainer line carries
     the same information.
- The select/time controls in the sheet are styled stand-ins for native form
  controls (a replay can't type into a real `<select>`/`<input type=time>`
  visually) — same classes, same geometry, driven by the script.

## Content boundary

Everything shown already appears in the case study's static screenshots or the
public app: seed-data athlete names, trainer first names, session times, tool
names, the MCP URL pattern. No sales numbers, no real-athlete PII (Marcus
Chen, Jim Bender are seed data), no credentials.

## Engine contract (`dsc-demo-kit.js`)

Ported from `sally-demo-kit.js` — same contract: IntersectionObserver ≥0.25
gating, `data-paused` host hook, reduced-motion = one instant pass holding the
final frame, loop via stage `innerHTML` restore, no `Date.now()`/
`Math.random()` in anything that renders, `DSCDemo.step(ms)` virtual-time
hook, `?force=1`, `?framed=1`. Two deliberate differences:

- **`stream()` writes plain text only — no `**bold**` handling.** The DSC
  chat renders raw text, so the engine must not invent formatting. The
  neutral AI surface in `athlete-mcp-loop.html` DOES render bold: it calls
  `promoteBold()` after the stream lands (same move as the reference
  jim-chat demo).
- **`fade()`** is a first-class opacity-only reveal, for elements that carry
  their own transform (the one-element-one-transform-driver rule).

⚠️ `DSCDemo.step()` is for jumping a beat, not driving a whole replay — it
drops time whenever a resolved wait needs extra microtask hops and drifts
badly past ~15s (measured here: step(18000) advanced ~4s of script). To
freeze a live demo at a beat for a screenshot, set `data-paused="true"` on
the host, shoot, then set it back — that's how these were verified.

## Verified (2026-08-14, all by looking)

- Full pass of each demo watched live; key beats screenshotted and inspected
  (rundown + banner, commit close; availability answer, request card,
  approve; filled sheet, slot card, materialized day-view row).
- End states asserted programmatically (bubble counts, banner text, literal
  marks, scene classes, row geometry — new day-view row measures 83px like
  its siblings).
- Console: zero errors on all three (marker lines injected to separate fresh
  from stale). Network: zero 404s — the compiled CSS's unused Geist
  `@font-face` rules never fetch (their `../media/` URLs would 404 if
  something ever used Geist; nothing does — the body forces Avenir Next).
- `?framed=1` drops caption + gutter; `prefers-reduced-motion` path is the
  reference engine's, unchanged.

## Traps from the reference build, accounted for

1. **`data-stage` wraps everything the script writes to** — each demo's stage
   is the whole `.sd-screen`, including banner slots and sheet mounts.
2. **One element, one transform driver** — `reveal()` owns transform;
   the scene cuts and the approve-fade use `fade()`/class swaps.
3. **Global box-sizing** — ships in the product's own preflight; no gap.
4. **Fixed-height stage** (640px) so the loop can't reflow the page; chat
   scrollers pin via the engine's `scrollEl` and hide scrollbars where the
   product does.
5. **Browser caching during iteration** — cache-busting query params were
   used for every verify reload (`?v=2`…).

## Open decisions for Jordan (flagged, not taken)

1. **Avenir Next licensing.** 980KB of licensed Monotype faces now sit in
   this folder and will be publicly served wherever it deploys. The gym app
   already serves the identical files publicly, so this adds no new exposure
   — but subsetting to the 5 faces the demos actually request (Regular,
   Medium, DemiBold, Bold + italic for the "thinking…" bubble) would drop
   ~600KB if wanted.
2. **The commit beat in demo 1** is composed (see above). If you'd rather the
   demo end on the real captured moment — the question + banner, no commit —
   delete beats 6–7; it's the last ~8 seconds of the script.
3. Whether a fourth demo (athlete sign-up → owner assigns trainer) is worth
   adding for the case study's "Getting In" section. The chrome for it is
   already recon'd; it's one file plus a section entry.

## Port shape

Same as the reference: these files are the artifact — the case study should
frame them (iframe + scale + `data-paused` driven from the host), not re-
derive them as components. `?framed=1` exists for exactly that host. If the
RHS study already has the Sally `PressingProductDemo` frame, these drop
straight into it: same engine contract, same `[data-stage]` structure, same
`body.scrollHeight` measurement rule (never `documentElement.scrollHeight`
inside the iframe).
