# sally-demos — live product demos for /case-studies/sally

**What these are:** scripted, looping recreations of three Sally Marketing Portal
workflows, built lab-first (this repo's own pattern) for embedding as live code
sections in the Sally case study. Built + visually verified from the Sally-side
Claude session (2026-08-12), which has the product context; this note is the
handoff for the RHS session that ports them.

**Confidentiality:** every number, product, quote and result in these demos is
FABRICATED (plausible-shaped, authored constants). Nothing is pulled from Sally
systems. The visible caption on each demo says so — keep it in the port; it is
the same grounded-with-receipts posture as the homepage brain. Patterns travel,
Sally data does not.

## Files

| file | demo | loop length |
|---|---|---|
| `jim-chat.html` | Jim agentic turn: typed question → 3 tool-call chips fire + resolve → streamed cited answer → proposal card | ~18s + 3.2s hold |
| `pdp-studio.html` | PDP Copy Studio: URL → audit findings (severity dots) → demand keywords (volume bars) → competitive context (themes + whitespace) → before/after title rewrite with rationale | ~15s + hold |
| `figma-build.html` | Jim → Figma: chat ask → plugin build card ticks 3 rows → layer-swap to dark dot-grid canvas → 3 email artboards materialize block-by-block → toast | ~14s + hold |
| `sally-demo-kit.js` | shared engine (see contract below) | — |
| `sally-demo.css` | shared Sally shell (window/titlebar/rail/caption) + per-demo sections (`jc-` / `ps-` / `fb-` prefixes) | — |

View any of them right now at `/lab/sally-demos/<name>.html` once committed —
`public/` is served as-is, so they're watchable on the deployed site before any
React port happens.

## Engine contract (`sally-demo-kit.js`)

Already matches house rules — port these behaviors, don't re-derive them:

- **IntersectionObserver** (≥0.25 visible) starts the demo and freezes the
  clock offscreen. `data-paused="true"` on the host freezes too (wire this to
  the site's existing `data-paused` convention).
- **prefers-reduced-motion:** the script runs once instantly to its finished
  end-state and never loops — the final frame IS the static fallback. No
  separate screenshot needed.
- **Loop** = stage `innerHTML` restored from the initial template, script
  re-runs. Deterministic: no `Date.now()`/`Math.random()` anywhere (SSR-safe).
- **Primitives:** `wait / type / stream (word-by-word, `**bold**`) / chip /
  reveal / press`, all driven by ONE rAF clock (`_tick`). On port, that clock
  should subscribe to `src/lib/scrub.ts`'s shared loop instead of owning its own
  rAF (the one-loop rule).
- **`SallyDemo.step(ms)`** — virtual-time test hook. Headless/hidden panes
  suspend rAF + IO, so real-time watching is impossible there; `await
  SallyDemo.step(6000)` advances 6 demo-seconds deterministically and adds
  `.sd-instant` (kills transitions) so screenshots show true end-states.
  `?force=1` is the cruder realtime variant. Both are lab-only; drop or keep.

## Port shape (mechanical)

One client component per demo in `src/components/case-study/sections/`
(`SallyDemoJimChat.tsx`, `SallyDemoPdpStudio.tsx`, `SallyDemoFigmaBuild.tsx`) —
same bespoke-hardcoded convention as `IntelligenceFlow` / `AIHeatmap`, which
already run on this exact page. Register three cases in `SectionRenderer.tsx`,
add section entries in `src/data/sally-case-study.ts`:

- Jim chat → inside the "AI Strategy Partner" narrative
- PDP Studio → with the intelligence/tools sections
- Figma build → in the tools/workflow section

Pressing redesign: host via the same bridge that carried A.R.C.'s nine bespoke
viz (`PressingVizFrame`) — these are self-contained (own scoped styles, no
dependence on surrounding layout), so they ride the port unchanged.

## Gotchas already hit (don't re-hit)

- **All demo CSS custom properties are scoped to `.sd-demo`** — never move
  them to `:root` (documented sitewide perf lesson).
- **`reveal()` owns `transform`** via `.sd-pop`. Nothing else may position a
  revealed element with its own transform — the figma toast lost its
  `translateX(-50%)` centering exactly this way; it now centers with auto
  margins. One element per transform driver.
- **`stream()` tokenizer** keeps leading whitespace attached to words
  (`/\s*\S+\s*/g`) — a plain segment after `**bold**` starts with the joining
  space; the naive `\S+\s*` regex ate it.
- **Fonts:** demos use Satoshi (`/fonts/Satoshi-Variable.woff2`, already
  self-hosted here; it's also the portal's real UI text face). Founders
  Grotesk (Sally's licensed brand display face) is deliberately NOT used.
- The chat scroll containers hide scrollbars and auto-pin to bottom via the
  engine's `scrollEl` — keep `min-height: 0` on the flex chain or the pin
  silently stops working.

## Open items for the RHS session

- Section copy around each demo (eyebrow/heading/prose) — write in Pressing
  voice, not here.
- Whether the demos also want MP4/GIF exports for LinkedIn — the sizzle
  exporter (`scripts/export-sizzle-gif.mjs`, CDP virtual time) can drive these
  pages as-is; `SallyDemo.step` even removes the need for virtual time.
- These files are uncommitted — commit from the RHS session with its own
  conventions.
