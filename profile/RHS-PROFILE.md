# RHS Profile
_Last refreshed: 2026-05-16 (deep reference below). Recent Changes layer current to 2026-06-23._

## Recent Changes

_Quick-read incremental layer, newest first. The numbered deep-reference sections below were last fully refreshed 2026-05-16._

- **2026-08-05 — SITEWIDE REDESIGN BEGUN: Pressing C shell + motion kit landed (biggest architectural shift since launch).** Decision: the lab prototype `public/lab/swiss-spread.html` ("Pressing C", the Robert Rodriguez Swiss-editorial spread) becomes the site's design language. Old site archived at tag **`site-v1`** / branch `archive/site-v1` (revert = merge that back). Shipped this pass: **Masthead** (`src/components/shell/Masthead.tsx` + module.css) — sticky 54px top bar inside the Lenis scroll content, Helvetica stack, burn-pill backdrop-filter heat driver, `[data-nav-dark]` ink→paper reversal — **replacing the bottom pill-dock NavRail sitewide**; the five per-shell fixed breadcrumb bars removed (masthead is the identity; Awwwards link moved to `/info`); new `/info` route (practice ledger + category links, since NavRail was the only path to `/category/*`); Lenis feel switched sitewide from `lerp: 0.12` to the prototype's settled tween (duration 1.65, easeOut^6, wheelMultiplier 0.65). **Motion kit** (all ported from the prototype, all data-paused + reduced-motion aware): `src/lib/scrub.ts` (ONE shared rAF loop + main-scroll subscription — the one-loop rule; HeroBlock's self-wired listener should migrate), `RevealHeadline`/`BodyReveal` (line-mask text entry; BodyReveal handles `<br>` segments and rejoins lines with spaces — copy-paste/screen-reader safe), `SectionMark` (scroll-scrubbed disc numerals), `PinStage`/`RisingPlate` + `src/lib/choreo.ts` (cross-section choreography: held screens and plates that climb over them; RISE=96dvh contract documented in-file). Port audit (5-agent, findings in auto-memory) established: prototype scroll math is container-agnostic (rect-vs-innerHeight, zero window.scrollY reads) so it runs unchanged inside Lenis-wrapper `<main>`; core 8 section types = 90% of all 723 sections across 30 studies; arc (9 bespoke viz types) is the migration long pole. **Migration rule from Jeremy: every image from each study must survive the redesign — text shrinks (allocation pass), images don't.** Next: schema choreography fields in types.ts, core-8 component reskins, Robert Rodriguez rebuilt from its own data file as the acceptance test.

- **2026-07-10 — SizzleReel: code-only montage engine (new motion capability; first deliberate RHS→Sally port).** One container cuts through 5-6 stills with real edit grammar — photo wipes (shutter/fade/slat/curtain), a burn blink compressing the site's BurnMeltTransition to ~640ms, a lens pinch and color flash that HIDE CUTS (always land on a new frame; a blink that returns to the same image reads as a glitch), color-curtain spacer frames, and a title card whose words scatter through the loop, build word-by-word at the close, and exit. Commit `8ace391`. Three artifacts, each a different form factor: React component (`src/components/fx/SizzleReel.tsx`, single file, no deps), zero-dependency `<sizzle-reel>` **web component** (`public/sizzle-kit/`, adds IntersectionObserver offscreen-pause), and a deterministic GIF/MP4 exporter (`scripts/export-sizzle-gif.mjs` — playwright-core drives installed Chrome, steps CDP **virtual time** frame-by-frame for a seamless loop; ffmpeg 2-pass palette). Playground at `/sizzle`: canvas-quantization palette extraction from the loaded images (cross-validated against a sharp implementation), beat inspector with freeze/replay per beat. **Planned Sally Portal port (day job):** stack maps 1:1 — DAM is Next/React (drop the .tsx), portal is a vanilla single-file app (drop the web component); wire image slots to DAM asset URLs. Hits Sally's named capability gap #1 (batch asset creation — stills→animated social/email assets with zero video production). **Also queued: standalone RHS case study** with the live tool embedded; use own West Texas photos as the public demo set (no client-image rights questions). Lesson worth keeping: verifying CSS animations via headless computed-style reads lies when the pane isn't painting — Chromium pauses animations; screenshot or live-paint before trusting "it didn't run."

- **2026-06-23 — Ivy Park brand-system section shipped (editorial "type at volume" variant).** Second flavor of the brand-system showcase, live at `/case-studies/ivy-park` as Section 04 "Built Without a Brand Guide" (bumped The Campaign / Closing to 05 / 06). New section type **`brand-system-volume`** + **`BrandSystemVolume`** server component — A.R.C.'s `brand-system` / `BrandSystem` left **completely untouched** (this reinforces the documented rule: these rich showcase sections are parallel hardcoded components, not a config of one shared component). Top half mirrors A.R.C. (two-tone panel, I→V→Y display morph via the existing `MorphingGlyph`, palette bands), then diverges into two bespoke client components: **`TypeAtVolume`** (oversized ghost word + a giant hexagon clipped off bottom *and* right, a headline justified to the ghost's **canvas-measured ink width** — `getBBox`/Range return advance width not ink, so canvas `measureText` + `actualBoundingBox` is the reliable path — plus the COURAGE IS / vertical POWER lockup) and **`PolygonLattice`** (same-size hexagons in a twist gradient, travelling-wave drift + mouse-accelerated spin, `prefers-reduced-motion` static). **No fabrication:** Ivy Park genuinely had no brand guide (it's in the closing copy), so the section is built only from documented elements and its copy was reworked to avoid duplicating the study's existing experience/closing prose. **New font dependency:** self-hosted **Jost Thin (100)** (`public/fonts/Jost-Thin.woff2`, fetched from the fontsource CDN) for the hairline lead-ins — the preview leaned on Mac-only Helvetica Neue UltraLight, which would silently fall back to Arial off-Mac. `MorphingGlyph` gained an optional `fallbackFontFamily`/`fallbackFontWeight` (defaults to Ogg, so A.R.C. unchanged; Ivy's pre-morph letter falls back in Avenir). Verified desktop + mobile via the **Playwright MCP** (the Claude Preview MCP is pinned to Sally's port 3000, and this site scrolls inside a nested `<main>` container so window-scroll coords are useless — set a tall viewport, `scrollIntoView({block:'start'})`, screenshot the viewport). Spotted (pre-existing, flagged separately) that `CampaignBlastRadius` has the same unrounded-trig-coord hydration mismatch documented on 2026-06-15.

- **2026-06-21 — Full pre-deploy SEO + structured-data layer shipped; `claude-seo` skill installed (cross-project).** New capability: the metadata/discovery layer that lives in the HTML `<head>` + static files, all server-rendered/SSG, zero visible UI. Pieces: `src/app/robots.ts` + `sitemap.ts` (Next metadata routes; sitemap derives from the `projects` list, deduped, 34 URLs), `public/llms.txt`, per-page `generateMetadata` across case-study/category/custom/inspiration + a `title` template (`%s · Reckon*House`) and `metadataBase` in layout, and JSON-LD via `src/lib/structured-data.ts` + `src/components/JsonLd.tsx` (sitewide **Person + Organization + WebSite** graph in layout; per-study **CreativeWork + BreadcrumbList**, author/`@id` cross-refs that Google merges across `<script>` blocks). Shared `src/lib/site.ts` (`SITE_URL`, `SITE_NAME`) keeps everything pointed at `reckon.house`, overridable via `NEXT_PUBLIC_SITE_URL`. **Branded OG share card** (`public/og-home.jpg`, 1200×630@2× → 698KB JPG) rebuilt from real homepage parts — actual thumbnails + `/masks/` ink-splatter via the `Thumb` placement math, real `asterisk-thin.svg`, `SpringSolve` doodles + Hershey equations, `FilmOverlay` grain/grid — captured headless via `Google Chrome --headless --screenshot` against a card-only HTML render (the reliable way to rasterize DOM+CSS-masks to PNG; the Claude Preview `save_to_disk` path didn't surface). **`claude-seo`** (AgricIDaniel, the 9.4k-star Claude Code plugin) installed at **user scope** → available to Sally + ARC too; ran `/seo geo` on live reckon.house: scored ~67/100, **SSR content confirmed in raw HTML** (the #1 GEO requirement most React portfolios fail), all AI crawlers allowed, but **entity footprint is the gap** (LinkedIn ✓ / Flickr ✓, no Wikipedia/Reddit/YouTube, "Reckon" name collides with India design studios — hence the Organization disambiguation node). Skill's own refs note **`llms.txt` is not yet a citation lever** (keep it for agent discovery, don't expect ranking). Cross-project: this whole SEO layer + the OG-card recipe + `claude-seo` are directly portable to Sally and ARC.

- **2026-06-15 — Dallas Sport Collective case study shipped + insight on the case-study viz components.** Six-trainer gym: marketing site, AI scheduling platform, and an MCP server (11 tools) athletes connect from their own Claude/ChatGPT. Live at `/case-studies/dsc`. New section type **`mcp-architecture`** (`MCPArchitecture.tsx`): a bespoke **monochrome** radial system-map — deterministic engine at center, the 11 real MCP tools ringed around (reads white chips, the 2 writes black), data-entity particle clusters, AI clients wired in, on a semi-transparent circular ground with a circos-style tick rim. Grounded entirely in the live DSC MCP server (real tool list + trainer/program data) — **no fabricated metrics**. **Structural insight worth remembering:** the rich data-art viz (this, A.R.C. `system-architecture`, Hill Country circos/spectrum, Sally `intelligence-flow`) are all **hardcoded per study, not data-driven** — they take a data prop but render from baked-in constants, so a new one is always its own component, never a config reuse. Also added a reusable `masonry` section (CSS `columns` + `break-inside-avoid`). Ship hygiene: the user's `public/case-studies/dsc/new/` source folder (52 raw screenshots) is excluded from git — stage processed images explicitly.

- **2026-06-15 — SSR LESSON (cross-project): round trig-derived coordinates in server-rendered procedural SVG.** A `'use client'` SVG positioning elements via `Math.sin/cos` threw a React **hydration mismatch** — e.g. `y="90.41739480647976"` (server) vs `…647982` (client): one ULP off because Node and the browser run different V8/libm builds. Seeded RNG (mulberry/LCG) is deterministic and safe; only the trig differs. Fix: round every trig-derived coord (`const r2 = n => Math.round(n*100)/100`) so both sides emit identical attribute strings. Confirmed by diffing the raw SSR HTML against the hydrated DOM. Reusable for any SSR'd component computing SVG/canvas geometry from angles — A.R.C.'s older `system-architecture` has the same latent (benign, dev-only) issue.

- **2026-06-05 — SpringSolve ambient layer (new motion/animation capability).** A fixed, full-viewport "worked desk" of faint hand-drawn pencil sketches behind the homepage **and every case study** (`src/components/fx/SpringSolve.tsx`, `zIndex:-1`, content scrolls over it). ~80 fragments each draw themselves stroke-by-stroke using **Hershey single-stroke fonts** (`src/data/hershey-glyphs.ts`) + SVG `stroke-dashoffset` (pathLength-normalized), on independent seeded timelines (mulberry32), exiting by fade or reverse "un-draw." Content spans physics (mechanics + E&M), architecture/furniture/cabinet sketches, carpenter dimension lines, code snippets + an AI prompt, and line/bar charts (hand-authored glyphs added to the Hershey set for math + code punctuation). Homepage + `/case-studies/*`, reseeded per surface so they read as related, not identical. `prefers-reduced-motion` renders it static. Perf-verified ~1% of frame budget, holds 120fps. Concrete reusable answer to **capability gap #2 (motion)**: "self-drawing SVG via single-stroke fonts + dashoffset" is a technique worth porting.

- **2026-06-05 — Scroll-energy thumbnail "aliveness" (new interaction pattern).** Homepage project thumbnails gained depth shadows + an idle float with a faux-3D Y-turn + hover, all GPU transform/opacity. A small `ThumbEnergy` controller reads Lenis scroll velocity and pumps an energy CSS var that scales motion + shadow, settling flat when idle (with a small always-on drift floor). Per-card depth/timing from a stable title hash (`src/lib/thumb-motion.ts`). Drop shadow matches a Figma spec, driven by `max(scroll-energy, hover)`.

- **2026-06-05 — PERF LESSON (cross-project): scope CSS-variable writes, never `:root`.** Driving the scroll effect by writing a custom property to `<html>` each frame tanked scrolling to ~34fps. Cause: a custom-property change on `:root` invalidates style for the **entire document** (here ~600 live SVG paths) — measured ~6.9ms/frame. Fix: write the var to the smallest subtree that consumes it (the grid container) → ~1.6ms, back to 120fps. Reusable anywhere a scroll/pointer loop drives CSS vars. Companion trick: `@property`-registered custom props are transitionable, so a single `box-shadow` can be instant-for-scroll yet eased-for-hover via `max(--scroll, --hover)`.

- **2026-06-05 — BUG LESSON: verify hand-rendered glyph orientation with *asymmetric* characters.** The SVG text renderer negated the glyph Y axis, rendering all equations upside-down (A → inverted-A, `/` → `\`). It shipped to production unnoticed because the faint, vertically-symmetric leading characters (E, F, =) hid it; only a zoom into an asymmetric equation (`R = ρL/A`) revealed it. Fixed (`eqStrokes` now uses `py` directly, matching the diagram-builder convention). Takeaway: when eyeballing procedurally-drawn type, test with A/R/digits/slashes, not E/=.

- **2026-06-05 — Cleanup.** Removed dead `MarginSolve` keyframes + the unused Caveat `@font-face` from globals.css (the abandoned predecessor to SpringSolve); the orphan font file is untracked and safe to delete.

---

## 1. Strategic Layer

**Identity:** Full-stack creative + build shop. Medium-agnostic, scale-agnostic, vertical-agnostic. The throughline is creative problem-solving across any medium — brand, web, interior, app builds, motion, editorial, anything. RHS serves three roles simultaneously: **playground** (experimental tooling welcome), **client work** (deliverable quality matters), and **portfolio surface** (this site is also Jeremy's own marketing site — its quality bar is its own showcase).

**Daily-rotation stack (self-reported, ground truth — reconcile against actual repo):**
- Build: Claude Code, Supabase, Vercel, GPT Image 2, Gemini, MK1, Railway
- Design: Figma, Adobe Suite, GPT Image 2, Gemini Image Pro 3

**Named capability gaps (high-leverage targets for new tools/techniques):**
1. 3D / interior visualization
2. Motion / high-level animation
   - Note: `CapabilityWeb3D` is currently in-flux. Three.js / R3F / WebGL news should be tier Flag, not Note, until that work settles.
3. Editorial-grade copywriting — voice, narrative, brand-book quality, NOT generic AI copywriting

**Filter rules for what news and tools matter:**
1. Power + scalability over accessibility. Deprioritize no-code, template, "design for non-designers" tooling (Wix/Framer-class).
2. Composability over bundles. Anti-pattern: enterprise walled-garden suites. Pro-pattern: focused tools with clean APIs, MCP-friendly. Adobe Suite stays because it's already core; new Adobe bundle-lock plays do not.
3. Free pattern flow across all Jeremy-led projects (Brand Brain, RHS, Love & Care, ARC, Sally Portal). Exception: specific client NDAs may carve out narrow engagements.
4. Suggestions span three modes — (a) fits an existing project, (b) fits across multiple projects, (c) standalone build-worthy idea.
5. When surfacing experimental tooling news, label whether it's playground-grade (RHS-internal experiments only) or client-ready (deliverable-quality). Both are welcome; the distinction must be explicit.

**Tiering:** Flag (material, surface promptly) / Note (FYI mention in digest) / Skip (don't surface unless something major changes).

**Delivery:** Feed pattern with multiple touches per day, daily anchor digest, real-time pings reserved for top-tier finds. Slack DM.

**Tone:** No sycophancy, push back when reasoning has gaps, calibrated honesty with personality. Same voice as Brand Brain and Claude Code.

**90-day success criteria:** Cross-project suggestions that land, standalone app/utility ideas that became real builds, relevant news caught early enough to act on.

---

## 2. Technical Layer

### 2.1 Actual stack in use

**Framework + runtime:** Next.js 16.1.6 (App Router), React 19.2.3, TypeScript 5. Node via `/opt/homebrew/bin/node`. Hosting: Vercel (project `rhs-os`, custom domain `reckon.house`).

**Styling:** Tailwind CSS v4 with inline `@theme` tokens in globals.css. Satoshi variable font self-hosted. PostCSS via `@tailwindcss/postcss`.

**3D / animation:** `three@^0.184` + `@react-three/fiber@^9.6.1` + `@react-three/drei@^10.7.7`. Actively used in `CapabilityWeb3D.tsx` (galactic-disc visualization of disciplines/skills/tools — explicitly notes "Loaded via dynamic() with ssr: false from CapabilityWebShowpiece"). Also custom WebGL-adjacent fx in `MaterialOverlap.tsx` and `DoubleExposureAnatomy.tsx`. Smooth scroll via `lenis@^1.3.18`.

**AI integration:** `@anthropic-ai/sdk@^0.95.0` (just added — wired in `/api/agent-chat/route.ts` for the `/custom` AI agent demo, streaming responses via `ReadableStream`). System prompt scopes Claude to a business description the visitor types. Graceful fallback when `ANTHROPIC_API_KEY` missing.

**Other backend bits:** `jose@^6.2.3` for ES256 JWT signing of Apple Music dev tokens. `@supabase/supabase-js@^2.99.1` **installed but zero references in `src/`** — see flags.

**Image pipeline:** Custom `scripts/build-inspiration.py` for folder→data regeneration with seeded shuffle. Python + Pillow for compression passes. Next.js Image with `deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 2400, 3840]` (custom — adds 2400). Vercel auto-serves AVIF/WebP for components using `<Image>`.

**Stack reconciliation against self-reported:**

| Claimed | Actual in this repo | Note |
|---|---|---|
| Claude Code | ✓ (CLAUDE.md, skills) | Heavy use |
| Supabase | ⏳ SDK installed, CMS migration planned | Intentional — pre-wired |
| Vercel | ✓ (production deploy) | `vercel.json` (legacy — see flags) |
| GPT Image 2 | not in code | Likely design tooling, not site |
| Gemini | not in code | Same |
| MK1 | not in code | Same |
| Railway | not in code | This project is Vercel-only |
| Figma | ✓ via MCP | `mcp__figma__get_design_context` allow-listed |
| Adobe Suite | not in code | Outside-of-repo tool |

The "build" side of the daily stack is partially aspirational for this specific repo — Supabase, Railway, and the image-gen tools aren't wired in here. That's fine; this is a marketing site, not the place those belong. The Supabase install is scaffolded ahead of a planned CMS migration for case studies — intentional pre-wiring, not dead weight.

### 2.2 MCP and connector configuration

**`.claude/settings.local.json` permissions:**
- Bash allow-list: `lsof`, `kill`, `rm -rf .next*`, `ls`, `which`, the local Node path, `npm *`, `xargs kill:*`
- MCP allow-list: `mcp__figma__get_design_context`, `mcp__Claude_Preview__*`

That's it for project-local pre-approvals. Everything else (Vercel MCP, Anthropic, Slack, Gmail, etc.) lives in global config.

**Vercel CLI:** not installed (session reminder flagged this). Would unlock `vercel env pull`, `vercel deploy`, `vercel logs` locally.

**Vercel MCP:** active in the global config and used heavily this session (deployment status checks, deploy logs).

**Anthropic SDK in code, no MCP gateway:** the `/api/agent-chat` route hits Anthropic directly via the SDK, not through Vercel AI Gateway. The new Vercel guidance recommends gateway-routed `"provider/model"` strings for AI SDK v6 work. Migrating would gain observability, model fallbacks, and zero-data-retention — but only worth it if there's appetite to swap SDKs.

### 2.3 CLAUDE.md and SKILL.md inventory

**`./CLAUDE.md`** (210 lines) — Stack, design system tokens, architecture, case-study creation workflow, image radius rule, AND a **massive voice/copy rules section** (Banned Phrases, AI Tell Flags, Builder vs Standard case-study subject rules, Fabrication Test, Portfolio Audit ledger). The most opinionated part of the entire codebase.

**`./.claude/skills/figma-to-responsive.md`** (49 lines) — Project-local design context that pairs with the global `figma-to-responsive` skill. Lists exact tokens, components, and grid system for this portfolio.

**`./voice-references/README.md` + 10 reference files** — Not technically a Claude skill, but functionally is one. Curated library of writing voices to target when drafting:
  - `simmons-gold-club.md` — Bill Simmons cadence, long wandering sentences
  - `simmons-welcome-to-grantland.md` — Simmons launch-essay register
  - `ai-leaderboard.md` — Jeremy's own canonical Mode E voice
  - `anthropic-economic-index.md` — research/science register, hedging done right
  - `pentagram.md` — Pentagram About-page + case-study writing register
  - `chimero-stub.md`, `stripe-press-stub.md`, `linkedin-six-month-review-stub.md`, `arc-case-study-stub.md`, `anthropic-blog-stub.md` — stubs to fill
  - `simmons-welcome-to-grantland.md` — vulnerability-through-structure

  README documents a "Setting 1 / Setting 2" framework (personal vs portfolio) and "Mode E" (long-form personal). Pair pattern: rules in CLAUDE.md tell what to avoid; voice-references show what to aim for.

**This IS the editorial-grade copywriting system — capability gap #3 is already 80% built.** It's specific to RHS but cross-applies cleanly.

### 2.4 Architectural patterns

**Case study system (the load-bearing pattern):** Each case study is a TypeScript object in `src/data/[slug]-case-study.ts` exporting a `CaseStudy` with `sections: Section[]`. 50 exported types in `src/lib/types.ts` define 23+ section types (hero, meta, dual-image, pipeline, marks-materials, editorial-headline, etc.). A `SectionRenderer.tsx` reads `type` and dispatches to the matching component in `src/components/case-study/sections/` (46 section components). Routes are statically generated via `generateStaticParams` from a case-studies array imported into `src/app/case-studies/[slug]/page.tsx`. 25 case studies currently live.

**Project structure:**
```
src/
  app/                       Next.js App Router pages + API routes
    api/                     /now-playing, /agent-chat, /apple-music-test, /apple-music/developer-token
    admin/connect-music/     Apple Music user-token enrollment flow
    case-studies/[slug]/     Dynamic case study route
    category/[tag]/          Category landing
    custom/                  Small-biz software pitch with 3 live demos
    inspiration/             House*Staples board
  components/
    case-study/              SectionRenderer + 46 sections
    fx/                      BurnMeltTransition, HeroCarousel, ScrambleText, FilmOverlay, HeatbarMelt, AnimatedDarkCard
    shell/                   NavRail, SiteFooter, HeroPreloader, SmoothScroll (global)
    ui/                      Smaller primitives
  data/                      Case study data + projects.ts + inspiration.ts + case-study-themes.ts
  lib/                       apple-music.ts, types.ts, case-study-themes.ts
public/                      ~500 MB of case-study + inspiration imagery
scripts/                     build-inspiration.py
voice-references/            10 voice example files + README
```

**Auth:** No user auth in RHS (it's a public marketing site). Only "auth-adjacent" code is the Apple Music JWT flow — ES256 signing in `lib/apple-music.ts` against `.env.local` secrets (`APPLE_MUSICKIT_KEY_ID`, `APPLE_MUSICKIT_PRIVATE_KEY`, `APPLE_MUSIC_USER_TOKEN`, `APPLE_TEAM_ID`).

**Data flow:** TypeScript data files at build time → SSG via `generateStaticParams`. No runtime database. `/api/now-playing` calls Apple's API with ISR (`revalidate = 60`). `/api/agent-chat` streams Claude responses on demand (no caching).

**Deployment:** GitHub `main` → Vercel auto-deploy. Build command is plain `next build`. `vercel.json` is two lines (legacy format — Vercel now recommends `vercel.ts` with `@vercel/config`).

**Mobile optimization patterns:** Mobile-gated effects via `matchMedia("(hover: none) and (pointer: coarse)")`. State drives JSX style; ref drives rAF guards to avoid stale-closure capture. Applied in `BurnMeltTransition` (drops SVG warp on mobile, keeps backdrop-filter pop) and `HeroPreloader` (caps to 6 hero preloads on mobile vs 20 on desktop).

**Image strategy:** Compression scripts in Python (PIL + sips). 106-file JPG compression pass saved 400 MB (487 → 87 MB). Raw `<img>` → Next.js `<Image>` migration is partial — 4 components migrated, several (HeroBlock, AppShowcase, BrandSystem, HexPolygon, inspiration page's 75 imgs) still on raw `<img>` because they need actual image dimensions in data to migrate cleanly.

### 2.5 Active / recent work

**43 commits in the last 30 days.** What's been touched:

- **Fairview Entry case study** built end-to-end (current week)
- **Mobile burn transition** tuning — tried two cuts, landed on keeping `backdrop-filter` pop and dropping SVG displacement
- **Mobile carousel snap fix** — last card now centers via end-spacer for count > 1 (was gated count > 2)
- **`/custom` landing page** for small-biz software pitch — 8 sections + 3 live demos (AI agent via Claude streaming, booking widget, CRM) + Sally OS dashboard reference + editorial typography break
- **Inspiration board rename pass** — 88 hash-named files renamed to descriptive kebab-case, alt text added for all 97 images
- **Nordstrom Content Framework** case study added; two of its images promoted to scroll-animated heroes
- **`/api/agent-chat` route** scaffolded (Anthropic streaming, graceful fallback)
- **House\*Staples refresh** — global dark footer mounted in SmoothScroll, NavRail color inversion via `[data-nav-dark]` detection, asterisk wordmarks, favicon set
- **400 MB image compression** + Next.js Image migration for 4 high-traffic components
- **Topaz upscale** pass on `/arc` and `/loved-by-nordstrom` first heroes
- **Jeffrey Spring** case study restructure with new `matchHeight` + mark-pair primitives

**Branch state:**
- `main` — active, deployed to production
- `desktop-bottom-nav` — 0 commits ahead of main, 53 commits behind. **Stale, candidate for deletion.**

**Open / in-flux:** `voice-references/` has 5 stub files awaiting content (stripe-press, chimero, anthropic-blog, linkedin-six-month-review, arc-case-study). `CapabilityWeb3D.tsx` exists as a "Practice section showpiece" — committed as "checkpoint" — implies more iteration intended.

### 2.6 Discrepancies + things to flag

**Material:**

1. **`ANTHROPIC_API_KEY` not yet in `.env.local`** (or in Vercel env vars based on visible deployment). The `/custom` AI agent demo is currently dormant in production — returns the configured "demo wiring up" fallback message.
2. **1,081 macOS AppleDouble files (`._*`) committed across the repo** despite a prior cleanup commit (`da77aa9 Clean up macOS AppleDouble metadata files`). They're regenerating. Needs `find . -name "._*" -delete` sweep + a `.gitignore` entry for `**/._*`.
3. **`desktop-bottom-nav` branch is dead** — 53 commits behind main, 0 ahead. Delete.
4. **`vercel.json` is legacy** — two-line shim. Vercel's current recommendation is `vercel.ts` with `@vercel/config` for typed config + dynamic logic. Worth migrating if you ever want env-conditional builds, cron, or routes-as-code.
5. **No Vercel CLI installed.** Adding it unlocks `vercel env pull` (sync prod env to local), `vercel deploy --prod` (push without going through GitHub), `vercel logs`. Recommend `npm i -g vercel`.
6. **Apple Music user token expires every ~180 days.** Stored as `APPLE_MUSIC_USER_TOKEN` in `.env.local`. No automated refresh — `/admin/connect-music` is the manual enrollment flow. When the now-playing widget mysteriously stops working, this is why.
7. **`./Fonts/` and `./fx/` at repo root** are oddly placed. Fonts should be in `public/fonts/` (and a subset already are). The `./fx/heatbar.txt` is a single orphan note file.
8. **`./sally-marketing-case-study.pdf`** at repo root — belongs in a `/docs` folder or `/voice-references/` if it's reference material, not the project root.

**Cosmetic:**

9. No tests anywhere. No `test` script. Acceptable for a marketing site — flagging for completeness.
10. README.md is the boilerplate `create-next-app` README. Worth replacing with a one-paragraph project overview and a link to `INFRASTRUCTURE.md`.
11. `voice-references/voice-system.md` is referenced from the voice-references README but doesn't exist. The "rules" file is implicitly CLAUDE.md, but they could be more explicitly linked.

---

## 3. Cross-Pollination Index

For each pattern in RHS, the specific target project(s) and the specific concrete problem it would solve.

- **The `voice-references/` system + CLAUDE.md voice rules** → **all four other projects**. This is the single highest-leverage cross-pollination available. Capability gap #3 (editorial-grade copywriting) is solved here as a working two-layer system (rules + examples). Should be lifted into Brand Brain, ARC, Sally Portal, and Love & Care with target-voice references appropriate to each (e.g., Sally Portal might add medical-journal restraint + patient-narrative warmth as its references). The pair pattern (rules tell what to avoid + examples show what to aim for) is the architecture worth copying, not just the file contents.

- **`/api/agent-chat` streaming pattern** (Anthropic SDK + `ReadableStream` + graceful-fallback-when-no-key) → **Brand Brain** for any LLM-touching flow; **Sally Portal** for a triage-summarizer or intake-question-rephraser; **ARC** for natural-language object lookup. The fallback pattern (degrade to a friendly message when the API key isn't configured) is especially worth carrying — it means demos never look "broken."

- **`lib/apple-music.ts` ES256 JWT signing via `jose`** → any project doing signed-request OAuth-adjacent flows. **ARC** if it ever talks to Apple's HomeKit / HealthKit cloud sync. **Sally Portal** if it integrates with any health-system API requiring signed JWTs.

- **`HeroPreloader` after-idle preload pattern** (`requestIdleCallback` + 200ms stagger + mobile cap) → **ARC** for prefetching home-screen tile imagery; **Sally Portal** for prefetching the most-likely-next form. Any project with predictable next-route image-heavy navigation benefits.

- **`CapabilityWeb3D` posture** (merged BufferGeometry into one `<lineSegments>`, InstancedMesh for particles, no Troika text in canvas, `dynamic() ssr:false` loading) → **Sally Portal** for body/treatment-area visualization. **ARC** for 3D home-inventory or floor-plan visualization. The "keep WebGL context alive on integrated graphics" discipline is the takeaway, not the disc shape.

- **Mobile detection ref+state pattern** for gating expensive effects → **all four other projects**. The exact recipe — `matchMedia("(hover: none) and (pointer: coarse)")`, state for JSX, ref for rAF/closure guards — is reusable as a hook. Specifically useful anywhere you have a desktop-perf-fine feature that stutters on mobile.

- **`scripts/build-inspiration.py` deterministic-shuffle pattern** → any moodboard, image library, or "wall of things" page in any project. **Brand Brain** if it ever surfaces a "references gallery." Seed-42 stable order means git diffs only show actual content changes.

- **`marks-materials` section type** (designer-thinking-as-content with colors + materials with descriptions) → **Brand Brain** for brand audit deliverables (palette + typeface analysis as content, not just config); **ARC** for object/material metadata; **Sally Portal** for treatment-step breakdowns.

- **`SectionRenderer` + typed section union pattern** → **Brand Brain** for report-builder output; any project that needs "pick from a fixed set of block types, render in order, data-driven." This is genuinely the cleanest version of a block CMS I've seen — 23 types, single dispatch.

- **`SmoothScroll` global mount + `[data-nav-dark]` detection for color inversion** → **ARC, Love & Care** for any page that has both light and dark sections in a single scroll. The data-attribute pattern lets any new section opt in without touching the nav code.

- **Case-study-as-typescript-data architecture** → **Brand Brain** for "client deliverable as data file." Lets you author content like code (PR review, version control, typed structure) without a CMS. Migration path to Supabase is already implied here, but plain TS files might be enough longer than you think.

- **Editorial-headline section type** (oversized typography moment, 2-tone, no period) → **all projects with long-scroll content**. Specifically: Brand Brain reports, ARC marketing pages, Sally Portal patient-journey pages. The "palate cleanser between dense sections" use case is universal.

---

## 4. Open Questions

1. **Where do `GPT Image 2`, `Gemini`, `MK1`, and `Railway` show up?** Self-reported as daily-rotation, invisible in this repo. Are they in design-only tooling (Adobe-side) or other projects (Brand Brain, ARC)? Need to know if the cross-pollination agent should expect them as a per-project layer.
2. **Is `voice-references/voice-system.md` real and missing, or implicit (the voice section of CLAUDE.md)?** The README references a paired rules file that I couldn't find.
3. **Brand Brain / ARC / Love & Care / Sally Portal — do you want voice-references cross-pollinated as-is, or do they each need their own curated reference set?** (Process question for the agent.)
   - **Answered:** Each project gets its own curated reference set. The architecture (rules + examples + Setting/Mode framework) lifts wholesale; the reference content is per-project. E.g., Sally Portal references would be medical-journal restraint + patient-narrative warmth, not Pentagram + Simmons.

---

## 5. Refresh Cadence

**Recommended:** every 4 weeks at minimum, immediately whenever any of these change:

- A new case study folder appears in `src/data/`
- Any new file in `src/lib/` (signals new shared capability)
- Any new MCP added to global config or `.claude/settings.local.json`
- Stack additions/removals in `package.json`
- `voice-references/` adds or stubs filled
- Branch creation (so the profile catches new in-flight work)

Set a calendar reminder for **2026-06-13** (4 weeks out). If the rate of change drops, stretch to every 6 weeks.

---

## 6. Naming Convention

Canonical: **Reckon House Staples** (no asterisks).

Asterisk styling (Reckon\*House, House\*Staples) appears in some visual assets and is decorative — not the canonical written form. Use "Reckon House Staples" or "RHS" in all written outputs, documentation, and agent suggestions.

---

## 7. Project Relationships

RHS sits at the center of a four-project portfolio. The agent should treat cross-pollination with awareness of these relationships:

**Siblings under RHS umbrella** (high-confidence pollination — shared stack, shared posture, freelance client work):
- **ARC** — freelance client project
- **Love & Care** — freelance client project

**Structurally separate** (medium-confidence pollination — patterns transfer, Sally context and IP boundaries do not):
- **Sally Portal** (formerly "Brand Brain") — Sally Beauty competitive intelligence tool, employer context, separate IP rules

Pollination logic: when suggesting that a pattern from one project applies to another, the agent should default to RHS ↔ ARC ↔ Love & Care as the most natural pathway. Cross-pollination involving Sally Portal is welcome at the *pattern* level (architectures, tooling decisions, workflow shapes) but should never carry Sally-specific data, brand context, or competitive intel into freelance client work.

---

## Operating notes (for this prompt's use on other projects)

Adjustments to apply when running this same prompt on Brand Brain, Love & Care, ARC, Sally Portal:

- **Sally Portal needs a dedicated section on patient-data sensitivity** that doesn't apply to RHS. PHI handling, HIPAA-adjacent flows, audit logging, encryption at rest — none of that exists in RHS so this template doesn't ask for it.
- **ARC needs a section on app-store / mobile-distribution** that doesn't apply to RHS (web-only). TestFlight builds, mobile-specific dependencies, native modules.
- **Brand Brain probably needs a research-data-sources inventory** (which research/news APIs are wired up, which providers, rate limits) that has no analog in RHS.
- **Love & Care** — freelance client project under RHS umbrella. Phase 1 pending. Likely needs sections specific to the client's domain when profiled.
- **The voice-references cross-pollination finding is likely the most valuable output from RHS.** When running this prompt on other projects, look specifically for what their equivalent "editorial / voice / brand" system is, or whether they're missing it entirely and should adopt RHS's pattern.
- **The 1,081 AppleDouble files finding is filesystem-specific** (external SSD with macOS metadata). Other projects on different drives may not have this. Check anyway.
- **Don't pad sections.** This template tempts toward "complete coverage" of all 7 items even when some have nothing useful. If section 6 (cross-pollination) is empty for a small project, say so. Empty is better than generic.
