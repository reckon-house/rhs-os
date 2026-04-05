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

### Copy patterns (match ARC tone)
- Headlines: bold, declarative, short ("A single photograph triggers a six-stage recognition pipeline.")
- Subheads: full sentence, slightly lighter weight
- Body: editorial, specific, no filler ("The estimated time to properly inventory an average home: 40+ hours.")
- Section labels: uppercase, spaced ("SECTION 03: METHODOLOGY / HOW IT WORKS")

### To create a new case study
1. Create `src/data/[slug]-case-study.ts` — copy `arc-case-study.ts` as a template
2. Add images to `public/case-studies/[slug]/`
3. Register in `src/app/case-studies/[slug]/page.tsx`
4. Update homepage `src/app/page.tsx` to add thumbnail to the grid
5. Add nav thumbnail to `public/nav/` if it gets a NavRail entry
