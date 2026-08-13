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
| `jim-chat.html` | **v2 — the fidelity bar** | Full portal chrome (rail + campaign panel + Briefing chat). A positioning-challenge question types into the real dock → Jim streams a grounded strategy answer → follow-up ask → a homepage card GENERATES inline (real DAM lifestyle shot, tagline headline, Shop now, Apply-to-request actions) |
| `requests-email.html` | **v3 — real template + real renderer** | Requests board (real August campaign cards) → cursor clicks COLORfest's CRM channel → request detail → Create Email → **the email assembles section-by-section from the PRODUCT'S OWN RENDERER OUTPUT** |
| `render_demo_email.py` | v3 | Imports `sally-portal/email_components.py` and renders `assets/email-multicategory.html`. Re-run it to regenerate. Read its header comments before changing anything |
| `sally-portal-chrome.css` | v2 | Verbatim-extracted portal chrome. Diffable against `index.html`; assets in `./assets/` (real `Sally-Logo.svg` + `Satoshi-Variable.woff2` from the portal) |
| `figma-build.html` | **v2 — real plugin + real artboards** | Sally OS plugin panel batch-builds four CRM emails onto a dark canvas. Panel is the plugin's own UI, progress lines are its real log strings, artboards render the real generated email |
| `sally-figma-plugin.css` | v2 | Plugin panel extracted verbatim from `Sally Figma Plugin/ui.html` |
| `pdp-studio.html` | **v2 — real chrome + real panel structure** | Utilities → PDP Copy Studio. URL types in → audit runs → four accordions open in sequence: findings (severity + SEO/AEO chips), demand (Google KWP), competitive context (themes + whitespace), proposed rewrite streaming in with a rationale that cites the whitespace |
| `sally-pdp-studio.css` | v2 | `.pdp-acc` / `.pdp-tab` / `.pdp-demand-*` / `.ed-finding` / `.ed-newt` etc. extracted verbatim from `index.html` |
| `sally-demo-kit.js` | current | shared engine (contract below) |
| `sally-demo.css` | v1 shell + engine classes | keep for `.sd-pop/.sd-caret/.sd-instant`; the miniature `.sd-window` shell dies when the v1 demos are rebuilt |

View any of them at `/lab/sally-demos/<name>.html` once committed — `public/`
is served as-is, so they're watchable on the deployed site before any React
port happens.

## The email in `requests-email.html` — how it got real (v3)

First pass was wrong twice and Jeremy caught it: *"that's not really one of our
email templates."* Both faults are worth not repeating.

1. **Retired template.** The source row's `asset_type` is `Email 1 — Hero +
   Product Grid` — one of the SEVEN RETIRED templates kept alive only so 114
   legacy drafts still open. The current set is the six 2026 Digital Templates.
   ⚠️ Verified against the DB: **zero rows anywhere use the 2026 template names**
   — every email request is still on a retired one. So there is no such thing as
   "real generated copy on a current template" to pull; the demo has to compose it.
2. **Invented layout.** Even on the wrong template I hand-rolled a side-by-side
   blush hero. The real hero is **stacked** (eyebrow → headline → subcopy → CTA →
   image below), 600px container / 520px content / 40px padding, all on Sally
   Natural `#FFF0E0`, with the 2026 spec scale (headline 60/54 Founders Grotesk
   Condensed, subcopy 26, eyebrow 16 Mono) keyed off the section's `spec:'2026'`.

**The fix — stop hand-rolling, run the real renderer.** `render_demo_email.py`
imports `sally-portal/email_components.py` (the actual production component
library, the one an email dev receives output from) and renders the **current
2026 Multicategory** template — hero + 2 category headers + 2 product rows, which
is exactly the shape of the source row's copy. Output is `assets/email-multicategory.html`:
real `<table>` markup with inline styles. **The demo injects those sections
untouched — no CSS in `sally-portal-chrome.css` restyles them** (the four
surviving `.em-*` rules only frame and scale the 600px column). If the email
ever looks wrong, fix the renderer or the data, never the demo CSS.

Copy is the row's real generated copy. Two honest deviations, both documented
in the script's header comments:
- Hero `headline` + `headline_accent` are merged into the single 44-char headline
  the 2026 hero allows (it has no accent field). Result is 36 chars — under cap.
- **Product names/images were realigned.** The source row exhibits the *documented*
  generate-v2 bug (invented names like "Permanent Liquid / Gel / Paints" that
  don't match the SKU assets actually attached — a powder lightener and a color
  remover). Rendering that pairing would have put a known defect on the portfolio.
  Each generated description is kept and paired with a correctly-matched real
  Wella `-studio-bg` packshot from the DAM; only the form-factor word in the names
  is corrected. **Pick `-studio-bg` assets for any product cell** — they're square
  with the product centered on a consistent ground, which is what the 240×240 cell
  expects. Raw ecommerce CDN thumbs are often tall boxes or bare hair swatches and
  crop badly.

## The Figma demo (v2) — what's real, and two traps

Chains directly off `requests-email.html`, whose closing toast says *"ready for
the Figma build."* Watch them in that order.

- **Panel** is `Sally Figma Plugin/ui.html` extracted verbatim into
  `sally-figma-plugin.css` — dark header, red logo tile, "Sally OS", the Build
  All bar, request cards with status chips. It's Sally's own design, so it's
  reproduced faithfully.
- **Canvas is deliberately NOT Figma's UI** — just a neutral dark dot-grid work
  surface. We reproduce our own interfaces; we don't clone a third party's.
- **Progress lines are the plugin's real log strings**, lifted from `ui.html`
  (`✉ Email phase — N to build…`, `🔎 Auto-detected master:`, `⧉ Skipped 1
  duplicate (identical copy)`, `Emails done — N built.`).
- **Artboards render the real generated email** — the same
  `assets/email-multicategory.html` the Requests demo uses, at 600px scaled to
  the 180px slot. Each board's eyebrow / headline / hero image is patched per
  request from the campaign's real August story lines + real DAM photography, so
  four boards read as four different emails instead of one repeated.
- **They BUILD the way the plugin builds, they don't fade in.** A fade read as
  mockup; the real sequence comes straight off `code.js` and is mirrored in
  three states per board:
  1. **`m.clone()`** — the canvas starts EMPTY and each artboard is created when
     its turn comes (clones aren't pre-made). It lands whole: full template
     structure, the master's own placeholder copy greyed back, and every image
     slot as a grey rect — `#F0EBE8`, which is the plugin's literal
     `greyPlaceholder` `rgb(0.94, 0.92, 0.91)`.
  2. **`populateTemplate()` — IMAGES FIRST, copy chases.** This order is not a
     styling choice, it's what the function does. It places each slot's image,
     then immediately writes *that slot's* product copy via
     `setProductCopyNearNode()` — so image and its copy interleave down the
     email. Only after every image is in does `populateSectionTextByAnchor()`
     write the hero and section headers. Verified by recording a state
     timeline: `img1 → img2 → name1 → img3 → name2 → … → img5 → name4 → hero
     → hdr1 → hdr2`. The hero image is correctly followed by nothing (it
     carries no `productData`).
     ⚠️ **Why images lead** — it is NOT that vision writes copy during the
     build. Vision runs server-side in `generate-v2` long before; by the time
     the plugin runs, copy is already in `generated_copy`. Images go first
     because the plugin **anchors on image rects to locate each section band**
     (`computeSectionBandGroups`), then walks the text nodes. Structure is
     found by image.
  3. Each image flashes a blue selection outline as it's written — the loop
     the log's `(5/5 images)` counts (`imagesPlaced++`).
     Text nodes are set in ONE shot per node, not typed character-by-character:
     that's what `setCharacters` actually does. The realism is in the *sequence*
     of nodes filling, not in faked typing.
  The placeholder strings are the actual `placeholder:` values from
  `CR_EMAIL_TEMPLATES['Multicategory']` — "Headline copy / more copy",
  "Section header copy", "Product name", "Supporting subcopy".

⚠️ **Two traps, both already paid for:**

1. **`data-stage` must wrap everything the script writes to.** The kit scopes
   `t.$()` to the stage and restores `stage.innerHTML` each loop. It was first
   put on `.fg-boards`, which made the plugin panel's nodes unreachable — the
   script threw on the first `appendChild` and the demo rendered nothing. It now
   sits on `.fg-frame`, wrapping canvas + panel.
2. **Never pass `.fg-board-inner` to `reveal()`.** It carries the `scale(0.30)`
   that fits the 600px email into the slot, and `.sd-in` sets `transform: none`
   — which silently threw the scale away and rendered the email at full size.
   Use `.fg-fade` (opacity only). Same one-element-one-transform-driver rule
   that bit the toast earlier.

Board geometry is a fixed sum: 4 × 180 + 3 × 16 gap = 768, inside the
820 − 48 inset = 772 available. Change the board count and re-do that math or
the last artboard slides under the panel.

## The PDP Studio demo (v2)

Runs on the real portal chrome with the Utilities rail active and the tool list
in the campaign panel. Panel structure is the product's: the two-tab bar
(`Workspace · N pages` / `Page`) and the accordion stack, with `.pdp-acc-chip`
carrying each section's summary the way the real one does.

The four beats are the tool's actual pipeline, in order:

1. **Audit findings** — severity (`high/medium/low`) beside an SEO / AEO / both
   channel chip, which is the real audit's shape. The top finding is Sally's
   documented **#1 structural AEO gap**: Bazaarvoice reviews load client-side,
   so they're absent from server HTML and invisible to ChatGPT / Perplexity /
   Claude. Worth keeping — it's the most quotable thing the tool surfaces, and
   the fix is data-ops, not copy.
2. **Demand signal** — Google KWP volumes. The chip says **"3-mo momentum"**,
   not YoY, because that's what `growth_pct` actually is for google_kwp (the
   Ads API returns 12 months; true YoY needs 13). Don't relabel it. PAA tags
   mark Conductor People-Also-Ask terms.
3. **Competitive context** — the feature built 2026-08-12. Themes are shown as
   table stakes; the dashed **whitespace** callout is the payoff.
4. **Proposed rewrite** — title, meta, selling bullets and an FAQ item, each
   before-struck-through / after-in-Founders-Grotesk, closing on a rationale
   that explicitly cites the whitespace ("the two rising claims no competitor
   in the category owns"). That through-line — competitive gap directly above
   the copy it produced — is the point of the panel; keep those two accordions
   adjacent.
   The FAQ item is the **48-hour patch test**, deliberately. Hair-colour usage
   copy must carry it (FDA's coal-tar exemption is conditioned on the allergy
   caution) and the demo shows it sourced to the package insert. Don't swap it
   for a softer question.
5. **Second opinions** — `_pdp_second_opinions()` fires **Gemini
   (`gemini-3-flash-preview`) and Perplexity (`sonar-pro`) in parallel** on a
   2-worker thread pool, and *neither sees Claude's rationale* — they grade the
   copy cold. The demo shows both spinners at once for that reason; serialising
   them would misrepresent the call.
   The verdict schema is the real one from `_pdp_second_opinion_prompt()`:
   `grade` (A–F) · `score` (0–100) · `verdict` · `strengths` · `concerns` ·
   `accuracy_flags` · `recommendation` (`ship as-is | minor edits | needs
   revision`). Markup is the real `.ed-grade` / `.ed-mark` / `.ed-gs` /
   `.ed-glist` family, and the accordion chip mirrors the live renderer's
   `"Gemini A · Perplexity B"` format.
   ⚠️ **Keep the grades split (A and B), and keep the accuracy flag.** A demo
   where both critics rubber-stamp the copy proves nothing. Perplexity catching
   an unsupported durability claim — "stays true through 28+ washes" — is the
   evidence that the check is real. That disagreement IS the feature.

⚠️ Copy here is **illustrative of the tool's output shape**, not a verbatim DB
pull like the Requests email. Structure, schema, models and choreography are
real; the specific sentences are representative. Real versions live in
`pdp_copy_versions.copy.second_opinions`.

## Open decisions for Jeremy (flagged, not taken)

1. ~~Founders Grotesk licensing~~ — **DECIDED 2026-08-12: ship the fonts.** See
   the font note below.
2. Whether the case study wants the **Asset Hub** demo as a fourth/fifth panel
   (real packshot grid filtering live as a search types — assets already downloaded).

## Fonts — Founders Grotesk is shipped (Jeremy's call)

`assets/fonts/` carries five `.woff2` faces converted from the portal's `.otf`
originals (`woff2_compress`; 915KB → 210KB total). Only the faces the renderer
actually asks for:

| face | used by |
|---|---|
| `FoundersGroteskCondensed-Regular` | email hero headline (60/54) |
| `FoundersGroteskCondensed-Medium` | section headers (42), product names (32), homepage-card headline |
| `FoundersGrotesk-Regular` | hero subcopy (26), product descriptions (20) |
| `FoundersGrotesk-Semibold` | bold/accent weights |
| `FoundersGroteskMono-Medium` | eyebrows (16, uppercase) |

`@font-face` blocks live at the top of `sally-portal-chrome.css`. **Each family is
declared twice** — spaced *and* unspaced (`'Founders Grotesk'` / `'FoundersGrotesk'`)
— because `email_components.py`'s font stacks name both forms; declaring only one
silently drops half the sections to Arial. Weight ranges are deliberately wide
(e.g. Condensed Medium covers `500 700`) so a heavier request lands on a real face
instead of synthesizing.

Satoshi stays the UI face for the portal chrome — that's what the product actually
uses; Founders Grotesk is display type only (email + card).

⚠️ **Licensed type is now in this repo and will be publicly served.** If reckon.house
ever adds a font-subsetting or asset-audit step, these are the files to know about.

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
- **Fonts:** Satoshi (`assets/Satoshi-Variable.woff2`) is the UI face —
  it is what the portal actually uses. ⚠️ This bullet used to end
  "Founders Grotesk is deliberately NOT used", which the **Fonts** section
  above reversed on 2026-08-12: the five faces ship, and the email and
  homepage-card display type depends on them. Read that section, not this
  line, for what is loaded and why each family is declared twice.
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
