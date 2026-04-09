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

### Copy Rules — Permanent

These apply to every case study, every time. Non-negotiable.

**Voice:**
1. No em dashes. The #1 rule. Use periods, commas, or restructure. Never `—`.
2. Beer test. Read it out loud. If it sounds like a press release or an agency case study, rewrite. Match how you'd explain the project to someone smart who respects your time.
3. No word repetition within 15 words. If the same word appears twice in close proximity, restructure one instance.
4. Kill adverbs. "Quickly built" becomes "fast." Better: use a strong verb and cut the modifier.
5. One idea per sentence. Short sentences, long thought.
6. Lead with verbs. Action before description. "Built a modular grid system" not "A modular grid system was built."
7. Cut any sentence that doesn't add information. If it just restates what the sentence before it said, delete it.

**Banned phrases:** "crafting meaningful experiences," "creative soul," "listener, thinker, problem-solver," "journey," "passion," "tapestry," "leveraging," "elevating," "disrupting," "innovative," "cutting-edge," "best-in-class," stacked triple adjectives, "seamless/seamlessly," "robust," "the result was..." (just start with what happened), "surfaces" as a verb (use "shows up," "flags," "finds," "catches," "reveals")

**Subject rules:**
- Standard case studies: remove "I" and "We." Lead with verbs or objects.
  - Wrong: "I sourced stock foliage and treated it as architectural components."
  - Right: "Sourced stock foliage. Treated it as architectural components."
- Builder case studies (ARC, Sally OS): use "I" to claim ownership. The distinction isn't product vs. client work. It's whether you were the builder.
- "We" never appears in case studies. Only in Mode D (local business contexts).
- Editorial headlines: use "I" or restructure to remove the subject entirely.

**Hallucination / Fabrication Rules:**
- Never invent outcomes, impact, or legacy claims. If Jeremy didn't say the work led to something, don't write that it did.
- No implied influence. Don't connect a personal project to later client work unless Jeremy draws that line explicitly.
- If you don't have the information, stop. A shorter, factual case study is always better than a longer one padded with invented context.

**The Fabrication Test:** Before any case study ships, run this check on every claim: Did Jeremy say this, or did the model infer it? Red flags:
- Impact on later work ("informed projects for years")
- Emotional claims about process ("the constraint forced a breakthrough")
- Industry context that wasn't provided ("most designers approach this by...")
- Quantified outcomes without source data
- Legacy or influence statements ("became a foundational approach")

**Takeaway and Summary Rules:**
- Don't explain the takeaway. If the section shows it through examples, the reader gets it. Trust the work to land.
- Don't restate the abstract in the closing. The closing should add something new.
- Cut "this is the real output" constructions. State what was made.

**AI Tell Flags (avoid these patterns):**
1. Balanced parallelism ("Not X, not Y") — one per study max, then break the symmetry.
2. Consistent triplets. AI defaults to three. Vary: sometimes two, sometimes four, sometimes just the one that matters.
3. Thesis-then-evidence on every paragraph. Bury the point sometimes. Start with the detail.
4. "The [noun] is the [noun]" — one per study can land. More is formula.
5. Perfectly even paragraph lengths. Mix short punchy + dense long.
6. Mirrored sentence starters across sections. "The system..." "The platform..." Mix in fragments, imperatives, specifics.
7. Clean emotional escalation. Real projects have weird detours and dead ends.
8. Vocabulary consistency. Flag any non-proper-noun word appearing 3+ times in a single study.

**Structural rules:**
- No more than two `three-column-text` sections consecutively. Break with image, editorial headline, or different component.
- After dense text, give a visual beat (hero, dual-image, editorial headline).
- `editorial-headline` is a palate cleanser. 2-3 lines max, no periods. 1-2 per study (3 ceiling). Use between dense sections, not after other headlines.
- Vary internal structure of three-column sections. Don't let all three columns follow the same pattern. Let one be a story, another a spec, another open with a detail.
- Column titles should add information, not preview the conclusion. Can be purely functional ("The Dot Grid," "Cabinet Color") or surprising. Not a spoiler.

**Subhead vs footnote:**
- Subhead (`size: "subhead"` or `size: "xl"`): the provocative hook. 1-2 sentences max.
- Footnote (`size: "base", fullWidth`): supporting detail, methodology, context, caveats.
- They must NOT say the same thing in different words.

**Abstract:** State problem, solution, and builder context in three dense paragraphs. Numbers, tools, timelines. No filler. Like a journal abstract. Dense enough to understand the project without scrolling further.

**Stats:** Real numbers only. Round numbers read as honest. "$49,630" is more credible than "$50,000." Always specify what's measured.

**Section labels:** ALL CAPS with section number. "SECTION 03: METHODOLOGY / HOW IT WORKS"

**Editorial headlines:** 2-3 lines max. Pull quote / magazine spread feel. No periods. Add emotional resonance, don't restate the section above.

**Closing sections:** Every closing should feel distinct across the portfolio. Vary the emotional register. Some quiet, some punchy, some just state the result and stop. Don't reuse "The product proves [thesis]. [Restate scope]. [Forward-looking statement]."

### Copy Rules — Portfolio Audit

Live tracking of cross-study patterns. Update as studies are added or revised.

**Last updated:** April 2026
**Studies in portfolio:** A.R.C., Sally Marketing OS, Robert Rodriguez, Typography & Patterns, Hill Country Kitchen

**Crutch words at capacity:**
- "Constraint" — appears in nearly every study. Alternatives: "the restriction," "the limitation," "working within [specific parameter]," or just state what was limited without naming it.

**Phrases used once (do not reuse):**
- "The feedback loop between identifying a problem and deploying a fix" (Sally)
- "The gap/distance between vision/intention and execution" (A.R.C.)
- "Not a prototype. Not a demo/proof of concept." (A.R.C.)
- "Measured in hours, not sprints" (A.R.C.)
- "One person" as a section-opening framing device (A.R.C.)
- "Functional archaeology" (Hill Country Kitchen)
- "UX for a room" (Hill Country Kitchen)

**Builder argument angles (claimed):**
- A.R.C.: Willingness to ship. Personal need became product.
- Sally: Context advantage. Builder knows the workflow.
- Robert Rodriguez: One shoot day, four frames, full campaign.
- Typography & Patterns: (needs revision — currently relies on fabricated legacy claims)
- Hill Country Kitchen: Systems thinking applied to physical space.

**Studies flagged for copy revision:**
- A.R.C.: Editorial headline "We built the system that remembers it" should use "I" or drop the subject.
- Typography & Patterns: Abstract and Application section contain fabricated influence claims. Closing restates abstract. Three-column Application section uses identical internal structure across all columns.
- Sally: Utilities section runs three consecutive three-column blocks. Consider compressing or using a different component for some.

### To create a new case study
1. Create `src/data/[slug]-case-study.ts` — copy `arc-case-study.ts` as a template
2. Add images to `public/case-studies/[slug]/`
3. Register in `src/app/case-studies/[slug]/page.tsx`
4. Update homepage `src/app/page.tsx` to add thumbnail to the grid
5. Add nav thumbnail to `public/nav/` if it gets a NavRail entry
