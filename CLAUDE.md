# RHS OS — Portfolio & Case Study Platform

## Stack
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4 (inline @theme in globals.css)
- Satoshi variable font (300-900)
- Supabase (planned)

## Design System
- 12-column grid, `max-w-[1400px]`, `gap-x-5`
- Color tokens defined as CSS custom properties in `:root` → mapped to Tailwind via `@theme inline`
- Typography: Satoshi only, sizes from 11px (labels) to 80px (display)
- Border radius: `clamp(30px, 5vw, 100px)` for large images
- Body copy uses `text-foreground/80` opacity

## Architecture
- Case studies are data-driven: TypeScript objects in `src/data/` define sections
- 23+ section types in `src/lib/types.ts`, rendered by `SectionRenderer.tsx`
- Section components live in `src/components/case-study/sections/`
- NavRail is fixed sidebar (160px), content scrolls in main area

## Figma Workflow
- Designs use absolute positioning (not auto layout) — infer responsive layouts from spatial relationships
- See `.claude/skills/figma-to-responsive.md` for the full translation guide
- Always map Figma hex values to existing design tokens before using raw values
- Match desktop pixel-perfect, then make responsive for mobile/tablet

## Conventions
- Use Tailwind utility classes, not custom CSS (except globals.css tokens)
- Responsive: mobile-first with `md:` (768px) and `lg:` (1024px) breakpoints
- Images: always `overflow-hidden`, `object-cover`, responsive aspect ratios
- New section types: add type to types.ts, component to sections/, register in SectionRenderer
- Root layout uses `h-dvh` (not `h-screen`) to handle mobile browser chrome correctly
- Charts with `min-w-[800px]` use intentional horizontal scroll on mobile — keep the pattern, don't fight it

## Case Study Creation Workflow
The goal: drop in new images + a project summary → generate a complete new case study fast.

### How it works
1. All case studies are TypeScript data files in `src/data/[slug]-case-study.ts`
2. Each file exports a `CaseStudy` object with `slug`, `title`, `subtitle`, meta fields, and a `sections` array
3. `sections` is an ordered array of typed objects — each maps to a component in `src/components/case-study/sections/`
4. `SectionRenderer.tsx` reads the type and renders the right component
5. Add the new slug to `src/app/case-studies/[slug]/page.tsx` to register the route

### Section types (reference `src/lib/types.ts` for full shapes)
| Type | Component | Use for |
|------|-----------|---------|
| `hero` | HeroBlock | Full-width opening image |
| `meta` | MetaBlock | Title, subtitle, field, author, abstract |
| `section-header` | SectionHeader | Pill label + bold section title |
| `text` | TextBlock | Body copy (base/lg/xl sizes, optional fullWidth) |
| `image` | ImageBlock | Single full-width image with radius |
| `dual-image` | DualImageBlock | Two images side by side |
| `triple-image` | TripleImageBlock | Three images in a row |
| `pipeline` | PipelineBlock | Steps with image left + copy right (EDE7E2 containers) |
| `feature-cards` | FeatureCards | Card grid for features/specs |
| `two-column-text` | TwoColumnText | Side-by-side text blocks |
| `three-column-text` | ThreeColumnText | Three-column text layout |
| `stats-summary` | StatsSummary | Key metrics row |
| `brand-block` | BrandBlock | Brand color/identity display |
| `brand-system` | BrandSystem | Full brand system showcase |
| `color-palette` | ColorPalette | Swatch grid |
| `typography-block` | TypographyBlock | Type specimen display |
| `timeline` | TimelineBlock | Project timeline |
| `dev-timeline` | DevTimeline | Engineering build timeline (scrollable chart) |
| `system-architecture` | SystemArchitecture | Network/node diagram |
| `stats-bar` | StatsBar | Ridgeline density chart |
| `coverage-chart` | CoverageChart | Insurance/coverage viz |
| `speed-comparison` | SpeedComparison | Before/after time chart |
| `tech-stack` | TechStackBlock | Tech logos/stack list |
| `app-showcase` | AppShowcase | App screenshots grid |
| `editorial-headline` | EditorialHeadline | Large display text (96px light) |
| `closing` | ClosingBlock | End-of-case-study summary |

### Image conventions
- Images go in `public/case-studies/[slug]/`
- Hero: full-bleed, landscape, high quality
- Pipeline steps: square-ish, works with `rounded-[18%]` crop
- Use descriptive filenames (good for SEO + findability)

### Copy Rules (Non-Negotiable)

**Voice:**
1. No em dashes. Ever. Use periods, commas, or restructure.
2. Beer test. Read it aloud. If it sounds like a press release, rewrite.
3. No word repetition within 15 words.
4. Kill adverbs. Use strong verbs.
5. One idea per sentence.
6. Lead with verbs. Action before description.
7. Cut sentences that don't add information.

**AI Tell Flags (avoid these patterns):**
- Balanced parallelism ("Not X, not Y") more than once per study
- Consistent triplets. Vary list counts (2, 4, or just the one that matters)
- Every paragraph opening with a thesis statement. Bury the point sometimes.
- "Surfaces" as a verb. Use "shows up," "flags," "finds," "catches"
- "The result was..." Cut it. Start with what happened.
- "The [noun] is the [noun]" more than once per study
- Perfectly even paragraph lengths. Mix short punchy + dense long.
- "The [noun]..." sentence starters on repeat. Mix in fragments, specifics.
- Clean emotional escalation. Real projects have weird detours.
- Vocabulary repetition. No word more than 3x per study (excluding articles/proper nouns).

**Banned phrases:** "crafting meaningful experiences," "creative soul," "listener, thinker, problem-solver," "journey," "passion," "tapestry," "leveraging," "elevating," "disrupting," "innovative," "cutting-edge," "best-in-class," stacked triple adjectives, "seamless/seamlessly," "robust"

**Subject rules:**
- Standard case studies: remove "I" and "We." Lead with verbs or objects.
- Builder case studies (ARC, Sally OS): use "I" to claim ownership.
- "We" never appears in case studies.

**Cross-study repetition (critical):**
Use ONCE across the entire portfolio:
- "The feedback loop between identifying a problem and deploying a fix"
- "The gap/distance between vision/intention and execution"
- "Not a prototype. Not a demo/proof of concept."
- "Measured in hours, not sprints"
- "One person" as a section-opening framing device

Each study needs its own builder thesis angle:
- ARC: willingness-to-ship, personal need became product
- Sally: context advantage, builder knows the workflow
- Robert Rodriguez: constraint-as-catalyst, one shoot, full campaign

**Section rhythm:**
- No more than two `three-column-text` sections consecutively
- After dense text, give a visual beat (hero, dual-image, editorial headline)
- `editorial-headline` is a palate cleanser. 2-3 lines max, no periods, 1-2 per study (3 ceiling)

**Subhead vs footnote:**
- Subhead (`size: "subhead"`): the hook. Provocative. 1-2 sentences max.
- Footnote (`size: "base", fullWidth`): supporting detail, methodology, context.
- They must NOT say the same thing in different words.

**Abstract:** State problem, solution, and builder context in three dense paragraphs. Numbers, tools, timelines. No filler. Like a journal abstract.

**Stats:** Real numbers only. Round numbers read as honest. Always specify what's measured.

**Section labels:** ALL CAPS with section number. "SECTION 03: METHODOLOGY / HOW IT WORKS"

### To create a new case study
1. Create `src/data/[slug]-case-study.ts` — copy `arc-case-study.ts` as a template
2. Add images to `public/case-studies/[slug]/`
3. Register in `src/app/case-studies/[slug]/page.tsx`
4. Update homepage `src/app/page.tsx` to add thumbnail to the grid
5. Add nav thumbnail to `public/nav/` if it gets a NavRail entry
