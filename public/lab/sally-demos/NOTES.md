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
| `trends-to-jim.html` | **v1 — the full arc** | Market Intelligence feed (real JS-measured masonry) → **Get Sally Insight** → Sally's Take → **Brainstorm This** → the app switches to Briefing with a seeded chat → three strategic moves → *"draft it"* → a complete campaign play: billboard concepts, adversarial critic, **Approve → open 4 requests** |
| `sally-trends.css` | v1 | `.iv2-card*` / `.sally-signal*` / `.brainstorm-this-btn` / `.play-*` / `.cr-bb-card*` extracted verbatim from `index.html` |
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
   sits on `.fg-frame`, wrapping canvas + panel. **This has now bitten three
   demos** — `trends-to-jim` hit it too, with the rail outside the stage. When a
   demo renders nothing, check the stage boundary first.
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

## The Trends → Jim demo (v1) — the longest one, and the only end-to-end arc

Every other demo shows one tool. This one shows the **handoff between three**:
market intelligence notices something, Jim reasons about it against the brand,
and the campaign composer turns it into briefable work. It's the argument the
case study is actually making, so it's the one to lead or close with.

The chain is the product's real one, function for function: `getSallySignal()`
writes the `.sally-signal` block ("Sally's Take" + "Based on:" +
**Brainstorm This**), `brainstormInsight()` builds a seed message from the
insight, and `seedJimChat()` opens a new session and switches the rail to
Briefing. The seed text in the demo is that template's output, not a paraphrase.

**The feed is a real masonry, not a column list.** ⚠️ It is deliberately NOT
`columns:` — multi-column flows *column-major*, so a recency-sorted feed would
read top-to-bottom down column one before column two, which is wrong. The
product uses `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`
with `grid-auto-rows: 4px`, and a two-pass `layoutMasonry()` that measures
**all** cards before writing **any** `grid-row-end: span N`. Interleaving the
reads and writes thrashes layout. Copied as-is; keep both passes.

Nine cards, because Jeremy's note was *"the feed side needs to be the cards and
feel dense"* — a sparse feed undersells the scan. Once the user commits to one
card the rest take `.dim` (opacity 0.32) so the eye follows the action.

**The last beat goes one prompt deeper than a chat answer.** After Jim's three
moves, `"yes — draft it"` produces a full play in the shape
`campaign_plays` actually stores:

- `campaign` jsonb — title, theme, story, urgency, audience, `channels[]`,
  `personas[]`, `messaging_direction`
- `assets` jsonb[] — billboard payloads (`panel` / `eyebrow` / `headline` with
  `**bold**` punchline / `subcopy` / `cta_text` / `image_url`)
- `critic` — the separate adversarial pass

⚠️ **The critic is a SECOND model call with fresh context, and it annotates —
it never deletes.** That's the whole design: a critic that could silently drop
plays would make the feature untrustworthy, so its verdict rides *along with*
the play and the human decides. The demo's verdict is `acceptable`, not
`strong`, for the same reason the PDP demo keeps split grades — a critic that
only ever approves proves nothing. Its concern is the real substantiation trap
in this claim (ten minutes covers **roots**; twenty-five covers all-over
colour — they're not the same job). Don't soften it into a style note.

**The billboards are the real `.cr-bb-card`, and they carry real photography.**
An earlier pass invented a text-only colour panel with the 1600:1084 ratio
applied to the *panel* — wrong twice. The actual component is an **image on top
at 1600:1084, then a fixed 183px colour panel**, and its CTA is an **underlined
link, not a pill**.

⚠️ **One deliberate deviation: the headlines are clean, with no accent.** The
real payload marks a punchline with `**bold**` and `renderHeadline()` turns it
into `<em>` — the wider non-condensed cut, in italic. Jeremy's call on
2026-08-13 was to drop it: at 30px the mixed-cut italic reads busy and fights
the condensed line. The `.cr-bb-card__headline em` rule stays in the CSS, still
verbatim, so restoring the accent is just putting the asterisks back. Don't
"correct" these strings by re-adding `<em>` — it is a choice, not an omission.

Both photographs are real DAM assets picked to match their claim — at-home root
application under the ten-minute line, a Sally shop bag mixed at a home counter
under "shade-matched in store, done at home." Different models on purpose; the
same face twice reads as stock. ⚠️ The DAM has a curated `crop_role='billboard'`
set already cut to exactly 1600×1084 — **look there first** for any billboard
imagery rather than cropping a portrait-orientation lifestyle shot.

⚠️ **Three sizing facts that are load-bearing together.** Change one and the
panel breaks:

1. **`.play-card` has NO max-width.** The real one fills its app panel. A 620px
   "chat bubble" cap looked right and squeezed the billboards to ~302px.
2. **`.play-asset` keeps `flex: 1 1 320px; max-width: 420px`.** Two cards at a
   320px basis need 656px — more than this column gives — so the row wraps and
   each card stands alone at its full 420px. That is correct behavior, not a
   fallback: the billboard is *built* for 420px. It also removes the
   append-order jolt for free, since each card lands final-width and never
   resizes when the next arrives.
3. **`box-sizing: border-box` is scoped onto `.cr-bb-chat-card`.** The portal
   sets it globally (`index.html:104`); these demo documents set it **nowhere**.
   It only bites where a fixed dimension meets padding — precisely this panel,
   which renders 231px instead of 183px under content-box.

At 302px the headline wraps to two lines *and* the subcopy wraps to two, and the
subcopy then collides with the CTA pinned 24px off the panel's fixed floor. At
420px the subcopy drops to one line and it clears. Measured: 41px and 4px of
clearance, nothing clipped.

⚠️ **The missing global `box-sizing` is a systemic gap, not a local one.** Every
verbatim-extracted component in all five demos is laid out under a different box
model than the product. It has been invisible so far because almost nothing else
pairs a fixed dimension with padding. The right fix is `* { box-sizing:
border-box }` on every demo document — deliberately **not** done here, because
the other four were visually tuned in the current model and would all need
re-verifying. Worth doing as its own pass.

⚠️ **`stream()` writes text nodes.** Raw HTML passed to it renders literally
(`<b>` showed up on screen as `<b>`). It understands `**bold**` and nothing
else — that's the markup to use, and `.play-critic-text strong` is what styles
the result.

Closing actions are the real ones: **Approve → open 4 requests** (approving a
play writes actual `channel_requests` rows, one per channel — which is what
makes it the end of the arc rather than another document), Edit direction,
Dismiss.

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

## Port shape — DONE 2026-08-13, and not the way this section proposed

**These files are now the shipped artifact, not a source to port from.** The
study frames them. Edit a demo here and the case study changes; there is no
second copy.

This section used to propose one hand-written React component per demo. That
was rejected on the way in, for three reasons worth keeping:

1. **Verbatim-ness is the product.** Re-deriving ~3,200 lines of extracted
   chrome as components forks it from the portal it was copied out of, so
   every future portal change needs doing twice — and the first pass of this
   whole effort was rejected precisely for not being the real interface.
2. **The selectors would collide.** `.header`, `.message`, `.section-label`,
   `.scroll-area`, `.status-chip`, `.url-bar` are all top-level classes here.
   Inlined into the site they meet its own. A document boundary is real
   isolation; a naming convention is a promise.
3. **These are fixed 1120px desktop interfaces with no mobile layout.** A
   component port faces that anyway and loses the isolation for nothing. The
   frame scales the whole document instead.

What shipped (`type: "product-demo"` in `src/lib/types.ts`):

| piece | where |
|---|---|
| `PressingProductDemo.tsx` + `product-demo.module.css` | `src/components/case-study/pressing/demo/` — next to `PressingLiveApp`, which framed A.R.C.'s deployed app for the same reason one step further along |
| routing | one `if (s.type === "product-demo")` in `PressingLayout.tsx`, hosted in `PressingVizFrame` like every other bespoke section |
| sections | `brain-jim-demo`, `brain-requests-demo`, `brain-figma-demo` (§04, the last two moved up from Utilities on 2026-08-15 as a chained pair), `utilities-pdp-demo` (§07) in `sally-case-study.ts` |

The frame adds the three things a document boundary does not give free:

- **Pause when off screen.** The engine's own IntersectionObserver watches its
  own document, where the demo is always visible — four replays would run
  forever, one screen apart. The parent drives it through this kit's
  documented contract (`data-paused` on the host), reached by structure
  (`[data-stage]` → `closest("body > *")`) so it works for any demo without
  being told which. The site's page-hidden attribute propagates the same way.
- **Scale, not reflow**, capped at 1:1.
- **`pointer-events: none`** on the iframe. An iframe eats the wheel, and a
  replay taller than its frame will spend the page's scroll on itself. Nothing
  in a replay is operable, so the question never arises.

**`?framed=1`** (see `sally-demo-kit.js`) tells a demo it has a host: it drops
the standalone caption and the page gutter, both of which the frame supplies.
Presentation stays this folder's business. Load a demo without the flag and it
is still the standalone lab page it always was.

⚠️ One trap paid for, and it looks like a correct measurement: a root
element's `scrollHeight` never reports less than its own viewport, and inside
an iframe that viewport is the frame whose height you are trying to measure.
Reading `documentElement.scrollHeight` there hands the CSS fallback straight
back, forever. Measure `body.scrollHeight`.

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

## Open items

- ~~Section copy around each demo~~ — DONE. Each section carries a `note` in
  the study data saying what happens; the caption inside each demo says where
  it came from. One fact, one home: do not let those two start restating each
  other.
- ~~Commit the folder~~ — DONE (`e751c07`).
- Whether the demos also want MP4/GIF exports for LinkedIn. The sizzle
  exporter (`scripts/export-sizzle-gif.mjs`, CDP virtual time) can drive these
  pages as-is.
  ⚠️ Use `?force=1` and the wall clock, NOT `SallyDemo.step`. The stepper
  advances only the waiters that exist at each 20ms slice and drains two
  microtask hops between slices, so whenever a resolved wait needs more hops
  to register its successor that slice's time is dropped rather than banked.
  Over a 30s script it loses most of the clock: stepping 32,000ms leaves
  `jim-chat` still typing its first question. It is fine for jumping a beat or
  two, wrong for driving a whole replay.
- **`trends-to-jim.html` is not wired into the study yet.** It postdates the
  port. It needs the same two lines every other demo got: a `product-demo`
  section entry in `sally-case-study.ts` and a `note`. It is the only demo
  that spans three tools, so it likely wants placement as the arc that ties
  §04 and §06 together rather than a sixth item in a list. Runtime is ~60s —
  roughly double the others; worth knowing before choosing where it sits.
- The Asset Hub demo as a further panel is still open (assets already
  downloaded). The frame is generic now, so it is one file plus one section
  entry.
