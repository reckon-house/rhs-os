# sally-demos — live product demos for /case-studies/sally

**What these are:** scripted, looping replays of Sally Marketing Portal
workflows, built lab-first (this repo's own pattern) for embedding as live code
sections in the Sally case study. Built + visually verified from the Sally-side
Claude session (2026-08-12), which has the product context; this note is the
handoff for the RHS session that ports them.

**⚠️ DIRECTION CHANGE (same day):** Jeremy rejected the first pass — stylized
miniature windows with staged data read as a "dumbed down version." The demos
must be the REAL interface with REAL content. `jim-chat.html` is rebuilt to
that bar and is the reference: it runs on `sally-portal-chrome.css` — the
portal's chrome EXTRACTED VERBATIM from `sally-portal/index.html` (class names
kept: `.icon-rail`, `.campaign-panel`, `.message`, `.input-row`…) — and replays
a real Jim exchange word-for-word (the brand-tagline conversation, from a real
session Jeremy supplied). The caption changed accordingly: it says "live replay
of a real exchange," not "data staged." `pdp-studio.html` and
`figma-build.html` still use the OLD miniature shell (`sally-demo.css` `.sd-*`)
and are queued for the same rebuild — treat them as superseded visuals with
correct choreography.

**Content line (recalibrated with Jeremy):** real UI, real brand-flavored
conversations, real product packshots are IN — they match what the case study
page already publishes as static screenshots. Keep genuinely-internal material
OUT: sales/financial numbers, unreleased campaign plans, customer PII.

## Files

| file | state | demo |
|---|---|---|
| `jim-chat.html` | **v2 — the fidelity bar** | Full portal chrome (rail + campaign panel + Briefing chat). Question types into the real dock → new session row pops into Recent chats → Jim streams the real tagline answer (bold/italic intact) | 
| `sally-portal-chrome.css` | v2 | Verbatim-extracted portal chrome. Diffable against `index.html`; assets in `./assets/` (real `Sally-Logo.svg` + `Satoshi-Variable.woff2` from the portal) |
| `pdp-studio.html` | v1 — rebuild pending | audit → findings → demand → competitive whitespace → rewrite (choreography final, shell to be swapped to real Utilities chrome) |
| `figma-build.html` | v1 — rebuild pending | chat → plugin build card → canvas artboards (to be rebuilt so artboards render the REAL 2026 email template structure: 600px on #FFF0E0, 60/54 hero type) |
| `sally-demo-kit.js` | current | shared engine (contract below) |
| `sally-demo.css` | v1 shell + engine classes | keep for `.sd-pop/.sd-caret/.sd-instant`; the miniature `.sd-window` shell dies when the v1 demos are rebuilt |

View any of them at `/lab/sally-demos/<name>.html` once committed — `public/`
is served as-is, so they're watchable on the deployed site before any React
port happens.

**Open decision for Jeremy (flagged, not taken):** the rebuilt Figma demo's
email artboards want Founders Grotesk (the licensed brand display face) for the
hero type. Shipping those font files on reckon.house is a licensing call —
alternatives are outlined SVG headlines or rasterized text for just those
artboards. UI text everywhere else is Satoshi (the portal's real UI face,
already self-hosted here).

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
