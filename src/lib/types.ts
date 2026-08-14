export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  category?: { label: string; href: string };
  field: string;
  author: string;
  published: string;
  status: string;
  classification: string[];
  services: string[];
  stack: string[];
  links: { label: string; url: string }[];
  heroImage: string;
  /**
   * "pressing" renders the study in the Pressing C language (white paper,
   * Helvetica, choreographed pins) via PressingLayout instead of the classic
   * CaseStudyLayout. Studies migrate one at a time by setting this flag —
   * absent means the classic renderer, untouched.
   */
  style?: "pressing";
  /**
   * FINDABLE WITHOUT BEING CLAIMED. Terms that should reach this study
   * from the search field but must NOT print on the page, because the
   * study is about the subject rather than being an example of it.
   *
   * The two were welded together by accident. `classification`,
   * `services` and `field` are the only lists the facts index reads,
   * and all three are DISPLAYED, so the only way to make a study
   * findable was to assert a discipline on its cover. Sally Marketing
   * OS is five internal platforms built for an ecommerce retailer.
   * Someone searching "ecommerce" should find it. Its cover should not
   * claim ecommerce design as a discipline it practised.
   *
   * Not a keyword-stuffing field, and the matcher ranks these below a
   * real discipline so labelled work always leads. If the work
   * genuinely IS the thing, put it in `classification`, where a reader
   * can see the claim and judge it.
   */
  keywords?: string[];
  sections: Section[];
}

export type Section =
  | HeroSection
  | HeroCarouselSection
  | MetaSection
  | TextSection
  | TextRightSection
  | TwoColumnTextSection
  | ThreeColumnTextSection
  | ImageSection
  | DualImageSection
  | TripleImageSection
  | QuadImageSection
  | QuadGridSection
  | StatsSummarySection
  | StatsBarSection
  | FeatureCardsSection
  | TimelineSection
  | TechStackSection
  | BrandSection
  | SectionHeaderSection
  | PipelineSection
  | ColorPaletteSection
  | TypographySection
  | AppShowcaseSection
  | ClosingSection
  | TechChartSection
  | CoverageChartSection
  | SpeedComparisonSection
  | DevTimelineSection
  | BrandSystemSection
  | BrandSystemVolumeSection
  | SystemArchitectureSection
  | LiveAppSection
  | ProductDemoSection
  | SpacerSection
  | EditorialHeadlineSection
  | AIHeatmapSection
  | IntelligenceFlowSection
  | DoubleExposureAnatomySection
  | ColorFieldMapSection
  | PatternMatrixSection
  | MaterialCircosSection
  | KitchenPaletteSection
  | HexPolygonSection
  | PolygonLatticeSection
  | SizzlePlaygroundSection
  | CampaignBlastRadiusSection
  | JeffreyFlagshipRadiusSection
  | MaterialOverlapSection
  | CabinMidCenturySpectrumSection
  | ColorPermutationsSection
  | EditorialTreatmentsSection
  | LogoCarouselSection
  | MarksAndMaterialsSection
  | MasonrySection
  | MCPArchitectureSection
  | InteriorsIndexSection
  | RRSystemIndexSection;

/**
 * The Robert Rodriguez system index: staggered ledger rows each carrying a
 * live specimen — the Archer logotype assembling itself (baked outlines
 * morphed between cuts), a palette swatch morphing shape and color, a
 * mini Faux Reel. Bespoke and hardcoded per the house pattern for rich
 * showcase sections (see RHS-PROFILE 2026-06-15): a new study's system
 * index is a new component, never a config of this one.
 */
export interface RRSystemIndexSection extends BaseSection {
  type: "rr-system-index";
}

export interface MasonrySection extends BaseSection {
  type: "masonry";
  images: { src: string; alt: string }[];
  /** Desktop column count (default 2). Mobile is always 1. */
  columns?: number;
  /**
   * Show each frame WHOLE — its own ratio, no crop. Same meaning the
   * flag already carries on dual-image and triple-image; masonry was
   * simply missing it. In pressing it also zeroes the row's 10% bleed,
   * which is a crop before it is a parallax and takes its slice off the
   * sides — fine on photography, destructive on a screenshot.
   */
  native?: boolean;
}

interface BaseSection {
  id: string;
  /** Group consecutive sections into a styled container */
  group?: {
    name: string;
    bg?: string;
    radius?: number;
    padding?: string;
    /** Break out of the max-width article container to fill the viewport (also drops radius) */
    bleed?: boolean;
  };
  /**
   * Pressing-language presentation fields. Read only by PressingLayout and
   * the pressing/* section skins; the classic renderer ignores the whole
   * bag, so adding these to a study is safe before it flips style:
   * "pressing". The choreography flags are RELATIONAL — pin means "hold
   * this section so the NEXT one can climb across it", rise means "climb
   * over the PREVIOUS section, which must be pinned" — see src/lib/choreo.ts
   * for the neighbor contract these encode.
   */
  pressing?: {
    /** Scroll-scrubbed disc label, e.g. { n: "02", name: "Statement" } */
    mark?: { n: string; name: string; dark?: boolean };
    choreo?: {
      /** Hold this section on screen while the next sibling climbs over it */
      pin?: boolean;
      /** Include the rest beat before the neighbor's climb (default true with pin) */
      hold?: boolean;
      /** Climb over the previous (pinned) section as a full-bleed plate */
      rise?: boolean;
      /** Pinned zoom-to-full-bleed object plate with pan-through */
      zoom?: boolean;
      /** How far the zoom plate grows.
       *  Default (unset) fits the VIEWPORT WIDTH and pans the overflow
       *  through — full bleed, and correct for a portrait plate with a
       *  lot of height to travel. "contain" grows only until the WHOLE
       *  frame fits the mat, so nothing ever leaves the screen. Use it
       *  for landscape plates, where the width fit spills too little to
       *  read as a pan and reads as the bottom being cut off instead.
       *  It also asks less of the file: a smaller final scale needs
       *  fewer device pixels than the source has to supply. */
      zoomFit?: "contain";
      /** Pinned horizontal crossing headline (vertical scroll remapped) */
      crossing?: boolean;
      /** Pinned quote poster: ink fill rises and knocks the type out */
      quotePoster?: boolean;
      /** Deal a multi-image section as a STACK rather than a row: each
       *  plate holds under the masthead and the next lands on top of it.
       *  Compares by substitution instead of juxtaposition, and buys the
       *  files their real size — a third of a row is half the resolution
       *  a 2400px export carries. Sticky-only, no driver. */
      stack?: boolean;
    };
    /** Figcaption footnote under a plate ("Yellow blazer, studio") */
    caption?: string;
    /** Per-image captions for multi-image sections, in image order */
    captions?: string[];
    /** Big plate numeral on zoom plates ("01") */
    plate?: string;
    /**
     * Hard ceiling in CSS pixels for this plate, under the honest one.
     * A plate is already capped at its native width so it can never be
     * magnified; this is for the other case, where a file is big enough
     * to fill the screen and simply should not. Editorial, not
     * technical: it can only ever make a plate SMALLER.
     *
     * Deliberately NOT the existing `maxWidth` on ImageSection. That one
     * is read by the classic renderer and three studies already carry
     * it, so teaching pressing to honour it would silently resize plates
     * in studies nobody asked about.
     */
    plateWidth?: number;
    /** Mono instruction line on zoom plates ("Scroll. It fills the mat...") */
    instruction?: string;
    /** The headline's separately-held final line (the prototype's .out span) */
    heldLine?: string;
    /** For quote posters: index of the \n-split line that takes the indent offset */
    indent?: number;
    /** Section counts as a dark zone: the masthead flips ink→paper over it */
    navDark?: boolean;
  };
}

export interface HeroSection extends BaseSection {
  type: "hero";
  image: string;
  alt: string;
  inline?: boolean;
  /**
   * cropWide: when true, the image fills the container with object-cover at a
   * fixed widescreen aspect ratio on desktop instead of the default
   * object-contain that fits the entire image. Use for super-wide source images
   * where you want the left/right edges to clip out of view, suggesting the
   * image continues beyond the visible area.
   */
  cropWide?: boolean;
  /**
   * nativeRatio: on desktop, show the photo at its true proportions, fully,
   * with no crop — the container takes the image's own aspect ratio and
   * object-cover fills it exactly (matching ratios means zero crop and zero
   * letterbox gap). On mobile it crops to a slightly taller 4:3 so a wide
   * landscape keeps presence instead of collapsing to a thin band. Overrides
   * the default mobile 5:4 crop and the inline 4% zoom. Use for
   * photography-forward studies where the frame is the point.
   */
  nativeRatio?: boolean;
}

/**
 * HeroCarouselSection — auto-cycles through multiple images with a heat-fade
 * transition. Default behavior matches the opening hero (full-bleed,
 * scroll-reactive scale + radius animation). Set `inline: true` to render as a
 * standard inline image carousel inside the content flow (no scroll animation).
 */
export interface HeroCarouselSection extends BaseSection {
  type: "hero-carousel";
  slides: { src: string; alt: string }[];
  /** ms each slide is fully visible before the transition starts (default 4500) */
  holdMs?: number;
  /** ms the transition itself takes (default 1000) */
  transitionMs?: number;
  /** When true, render inline inside the content grid with no scroll animation. Default false (full-bleed hero). */
  inline?: boolean;
  /** When true (and inline), break out of the max-width container to fill the viewport. Useful for inline carousels that should still go edge-to-edge. */
  bleed?: boolean;
  /** Tailwind aspect class for inline mode (default "aspect-[16/10]") */
  aspectClassName?: string;
}

export interface MetaSection extends BaseSection {
  type: "meta";
  field: string;
  author: string;
  published: string;
  status: string;
  classification: string[];
  title: string;
  subtitle: string;
  abstract?: string;
  // Optional scannable "at a glance" rows rendered as extra spec lines below
  // Classification — Role / Built / Stack / Materials etc. One per study.
  summary?: { label: string; value: string }[];
  // Optional external links rendered as spec lines below Classification
  // (e.g. Source → the public repo). Same shape as the closing's links.
  links?: { label: string; url: string }[];
  /**
   * Pressing cover extras: a live Faux Reel thumb beside the title (its box
   * re-shapes to each frame's native ratio as the reel cuts) and the
   * vertical spec line on the page edge. Ignored by the classic MetaBlock.
   */
  reel?: { images: string[]; colors: string[]; caption?: string };
  specLine?: string;
}

export interface SectionHeaderSection extends BaseSection {
  type: "section-header";
  label: string;
  title: string;
  centered?: boolean;
  /** Lead sentence that flows inline right after the bold title, manifesto-style.
   *  Populated at render time by folding in the text(xl/subhead) block that used
   *  to immediately follow — see foldSectionHeaders() in CaseStudyLayout.tsx. */
  subhead?: string;
}

export interface TextSection extends BaseSection {
  type: "text";
  content: string;
  size?: "base" | "lg" | "xl" | "subhead";
  centered?: boolean;
  fullWidth?: boolean;
}

export interface TextRightSection extends BaseSection {
  type: "text-right";
  content: string;
  size?: "base" | "lg" | "xl" | "subhead";
}

export interface TwoColumnTextSection extends BaseSection {
  type: "two-column-text";
  left: string;
  leftTitle?: string;
  right: string;
  rightTitle?: string;
}

export interface ThreeColumnTextSection extends BaseSection {
  type: "three-column-text";
  columns: {
    /** An image belonging to THIS column, rendered at column measure.
     *  Small assets live here rather than in a full-width plate: a
     *  768px app screen is soft stretched to 1400 and exactly crisp in
     *  a 400px column on a retina display. Pressing renderer only. */
    image?: { src: string; alt: string; width?: number; height?: number };
    title?: string;
    content: string;
  }[];
}

export interface ImageSection extends BaseSection {
  type: "image";
  src: string;
  alt: string;
  aspect?: "video" | "square" | "wide" | "tall" | "native";
  /**
   * Override aspect on mobile only. Useful for wide native images that scale
   * down to feel tiny on phones — pick a taller aspect (e.g. "square") and
   * the image fills it via object-cover, cropping the sides to gain height.
   * Desktop still uses `aspect`.
   */
  mobileAspect?: "video" | "square" | "wide" | "tall";
  bleed?: boolean;
  bleedTop?: boolean;
  maxWidth?: number;
  noRadius?: boolean;
  padded?: boolean;
  blend?: "multiply" | "screen" | "overlay";
}

export interface DualImageSection extends BaseSection {
  type: "dual-image";
  left: { src: string; alt: string };
  right: { src: string; alt: string };
  native?: boolean;
  transparent?: boolean;
  aspect?: string;
  blend?: "multiply" | "screen" | "overlay";
  /**
   * When true, both slots render at the same aspect ratio (square) and the
   * right image uses object-contain so a portrait/mobile mockup doesn't blow
   * up the row vertically. Use when pairing a square image with a much taller
   * one (e.g. dress photo + mobile/email screenshot).
   */
  matchHeight?: boolean;
}

export interface TripleImageSection extends BaseSection {
  type: "triple-image";
  images: { src: string; alt: string }[];
  native?: boolean;
  transparent?: boolean;
  blend?: "multiply" | "screen" | "overlay";
}

export interface QuadImageSection extends BaseSection {
  type: "quad-image";
  images: { src: string; alt: string }[];
  native?: boolean;
  transparent?: boolean;
  blend?: "multiply" | "screen" | "overlay";
}

/**
 * QuadGridSection — 4 images arranged 2×2 with NO gap between cells.
 * Only the outer corners are rounded (top-left of [0], top-right of [1],
 * bottom-left of [2], bottom-right of [3]) so the four images meet at the
 * center to form one unified rectangle.
 *
 * Image order in `images`: [topLeft, topRight, bottomLeft, bottomRight].
 *
 * Use `cellAspect` to control the cell shape (defaults to 4/3 — works well
 * for vinyl-sleeve-with-record mockups). All four cells use the same aspect
 * so the grid stays clean regardless of source image dimensions.
 */
export interface QuadGridSection extends BaseSection {
  type: "quad-grid";
  images: { src: string; alt: string }[];
  /** Tailwind aspect class for each cell. Defaults to "aspect-[4/3]". */
  cellAspect?: string;
}

export interface StatsBarSection extends BaseSection {
  type: "stats-bar";
  /** Topline figures set as type above the ledger. Moved here from the
   *  classic component's hardcoded TOTALS: numbers belong in the data. */
  totals?: { value: string; label: string; sub?: string }[];
  items: {
    label: string;
    value: string;
    description: string;
    note?: string;
  }[];
  /* `width: number` used to sit here, commented "percentage width for
     the bar". It was never a measurement of anything: 88 on the
     smallest value in A.R.C.'s set and 81 on the largest. Deleted
     rather than deprecated, so the next chart cannot reach for it.
     Bars are scaled from `value`. */
}

export interface FeatureCardsSection extends BaseSection {
  type: "feature-cards";
  items: {
    image: string;
    title: string;
    description: string;
  }[];
}

export interface TimelineSection extends BaseSection {
  type: "timeline";
  items: {
    period: string;
    description: string;
  }[];
}

export interface TechStackSection extends BaseSection {
  type: "tech-stack";
  items: {
    label: string;
    value: string;
  }[];
}

export interface BrandSection extends BaseSection {
  type: "brand";
  logoText: string;
  tagline: string;
  description: string;
}

export interface PipelineSection extends BaseSection {
  type: "pipeline";
  steps: {
    number: string;
    title: string;
    description: string;
    title2?: string;
    description2?: string;
    image?: string;
  }[];
}

export interface ColorPaletteSection extends BaseSection {
  type: "color-palette";
  title?: string;
  colors: {
    name: string;
    hex: string;
    rgb?: string;
    cmyk?: string;
    role?: string;
  }[];
}

export interface TypographySection extends BaseSection {
  type: "typography";
  fonts: {
    name: string;
    role: string;
    description: string;
    sample?: string;
  }[];
}

export interface AppShowcaseSection extends BaseSection {
  type: "app-showcase";
  image: string;
  alt: string;
}

export interface ClosingSection extends BaseSection {
  type: "closing";
  services: string[];
  stack: string[];
  links: { label: string; url: string }[];
  content: string;
}

export interface StatsSummarySection extends BaseSection {
  type: "stats-summary";
  items: {
    value: string;
    label: string;
    sublabel: string;
  }[];
}

export interface TechChartSection extends BaseSection {
  type: "tech-chart";
  items: {
    role: string;
    tech: string;
    color: string;
    width: number;
    offset?: number;
  }[];
}

export interface CoverageChartSection extends BaseSection {
  type: "coverage-chart";
  assetValue: string;
  assetAmount: number;
  policyLimit: string;
  policyAmount: number;
}

export interface SpeedComparisonSection extends BaseSection {
  type: "speed-comparison";
  title: string;
  items: {
    label: string;
    value: string;
    width: number;
    color?: string;
  }[];
  callout?: string;
  calloutSuffix?: string;
}

export interface DevTimelineSection extends BaseSection {
  type: "dev-timeline";
  label: string;
  duration: string;
  phases: {
    name: string;
    weeks: string;
    color: string;
  }[];
}

/**
 * The shipped product, framed and running in the page. It is the real
 * deployment, not a port of it, so there is nothing to keep in sync and
 * nothing to invent. Held behind a click: no other origin is contacted
 * until the reader asks.
 */
export interface LiveAppSection extends BaseSection {
  type: "live-app";
  /** The deployed URL. */
  src: string;
  /** What the reader is about to load. */
  title: string;
  /** Host shown in the frame's chrome. Optional: a demo served from the
   *  author's own project has a URL that reads as an accident rather
   *  than as provenance, and the "open in its own tab" link below the
   *  frame carries the real address either way. */
  origin?: string;
  /** A still from the study, held until activation. */
  poster: string;
  posterAlt: string;
  /** Stage height in dvh. */
  tall?: number;
  /** One line: what to actually try once it is live. */
  instruction?: string;
  /** "phone" masks the stage to a handset. See PressingLiveApp. */
  frame?: "wide" | "phone";
}

/**
 * A scripted replay of a product workflow, running in the page.
 *
 * Sibling of `live-app` and the same argument, one step down: that one
 * frames a DEPLOYED product so the reader can use it; this one frames a
 * REPLAY of software the reader cannot be given an account for. The Sally
 * Marketing OS is internal, so a live frame is not on offer — but a
 * scripted replay built on the product's own extracted interface code is
 * the next most honest thing, and it beats the static screenshots the
 * study published before it.
 *
 * The demo is a self-contained page under `public/lab/sally-demos/`, and
 * framing it rather than porting it is deliberate. Those pages carry the
 * portal's chrome EXTRACTED VERBATIM, down to class names like `.header`
 * and `.message`; re-deriving 3,000 lines of that as components would
 * fork the thing whose whole value is that it was not re-derived, and
 * inlining those selectors would collide with the site's own. A document
 * boundary is real isolation rather than conventional isolation.
 */
export interface ProductDemoSection extends BaseSection {
  type: "product-demo";
  /** File under /lab/sally-demos/, without the extension. */
  demo: string;
  /** What the reader is watching, in the frame's chrome. */
  title: string;
  /**
   * The demo's own stage width in px. These are fixed-size desktop
   * interfaces (1120px frame inside a 20px gutter) with essentially no
   * media queries, so the frame SCALES them rather than reflowing them.
   * Height is measured from the loaded document, never declared — see
   * PressingProductDemo.
   */
  stageWidth?: number;
  /** One line under the frame: what is being shown, in plain words. */
  note?: string;
}

export interface SystemArchitectureSection extends BaseSection {
  type: "system-architecture";
}

export interface MCPArchitectureSection extends BaseSection {
  type: "mcp-architecture";
}

export interface BrandSystemSection extends BaseSection {
  type: "brand-system";
  label: string;
  title: string;
  introText: string;
  subcopy?: string;
  philosophyText: string;
  chromaticCircleImage: string;
  colors: {
    name: string;
    hex: string;
    description: string;
    /** Official print CMYK, e.g. "34 16 50 0". Not derivable from hex (profile-dependent). */
    cmyk?: string;
  }[];
  fonts: {
    name: string;
    role: string;
    description: string;
  }[];
  logoConstructionImage: string;
  /** What the Logotype row's image actually is. The row hardcoded
   *  "Construction" because every study fed it a construction grid;
   *  A.R.C. feeds it the shipped lockup, and captioning a finished
   *  logotype "Construction" is just wrong. */
  logoCaption?: string;
  appScreenshotImage: string;
  /**
   * The pattern library: individual UI frames cut apart and cycled, the
   * way Robert's Compositing row cycles its source frames. A single
   * contact sheet shows the same screens at a tenth the size and cannot
   * move; these are the panels themselves. Every frame must be OPAQUE —
   * a PNG with alpha lets the reel's stage through and reads as a
   * failed image, and `npm run facts` rejects it by name.
   */
  patternLibrary?: string[];
  /** Big display glyph that morphs letter-to-letter (e.g. A → R → C for a.r.c.).
   *  Each entry is a character + optional brand face (defaults to the Ogg display
   *  face). Omit to leave the section without an animated glyph. */
  morphGlyphs?: { char: string; font?: "ogg" | "avenir-medium" | "avenir-demi" | "avenir-bold" }[];
}

/** Editorial "type at volume" variant of the brand system — for case studies built
 *  without a formal brand guide (e.g. Ivy Park).
 *
 *  Draws through PressingSystemIndex like {@link BrandSystemSection} and
 *  {@link MarksAndMaterialsSection}; toLedger reads all three structurally, so the
 *  ledger fields below are named to match theirs. The fields that fed the old
 *  two-tone panel (footText, philosophyHeading, roleLines, morphGlyphs,
 *  typeComposition) are no longer rendered by anything. */
export interface BrandSystemVolumeSection extends BaseSection {
  type: "brand-system-volume";
  label: string;
  title: string;
  /** 24px subhead line under the title. */
  introText: string;
  /** 14px footnote paragraph under the subhead. */
  footText: string;
  /** Heading over the philosophy column (e.g. "The System"). */
  philosophyHeading: string;
  /** Body paragraphs, split on blank lines. */
  philosophyText: string;
  /** Concept role lines under the philosophy copy (name · role + description). */
  roleLines: { name: string; role: string; description: string }[];
  /** Big display glyph that morphs letter-to-letter (e.g. I → V → Y). */
  morphGlyphs: { char: string; font?: "ogg" | "avenir-medium" | "avenir-demi" | "avenir-bold" }[];
  /** Palette bands "as used" — each renders a lead cell + 75/50/25 tints. */
  colors: { name: string; hex: string; rgb: string }[];
  /** The faces, for the ledger's Typeface row. `weights` are the cuts the
   *  face actually ships in this build — the specimen steps through them,
   *  so a weight not loaded in globals.css would render as a repeat of
   *  the nearest one that is. */
  fonts?: { name: string; role: string; weights?: number[] }[];
  /** Words the Typeface specimen cycles, one per weight step. Every entry
   *  must be a word the campaign actually set; the row is a specimen, not
   *  a place to write new copy. Omit and the specimen holds the face name. */
  specimenWords?: string[];
  /** The repeating geometric element the identity leans on, as a ledger
   *  specimen: `sides` feeds the same outline() the palette swatch uses
   *  (0 for a circle). */
  elements?: { label: string; caption: string; sides: number };
  /** Frames for the reel row — Robert's Compositing row, generalised. Every
   *  frame must be OPAQUE; a PNG with alpha lets the stage through and
   *  reads as a failed image. `npm run facts` rejects it by name. */
  patternLibrary?: string[];
  /** What to call the reel row and what to count under it. Defaults to
   *  "Pattern library" / "N components", which is wrong for any study that
   *  never shipped a component library. */
  patternLibraryLabel?: string;
  patternLibraryCaption?: string;
  /** The graphic "type at volume" composition. */
  typeComposition: {
    /** Oversized ghost word behind the composition (e.g. "IVY"). */
    ghostWord: string;
    /** Thin lead-in run across the top (e.g. "Confidence is "). */
    thinLead: string;
    /** Heavy word completing the line (e.g. "Strength"). */
    heavyWord: string;
    /** Top line of the right-hand lockup (e.g. "Courage is"). */
    lockupTop: string;
    /** Vertical heavy word under the lockup (e.g. "POWER"). */
    lockupVertical: string;
    /** Small note paragraph, top-left. */
    note: string;
  };
}

export interface SpacerSection extends BaseSection {
  type: "spacer";
  height: number;
}

export interface EditorialHeadlineSection extends BaseSection {
  type: "editorial-headline";
  text: string;
}

export interface AIHeatmapSection extends BaseSection {
  type: "ai-heatmap";
  competitors: string[];
  categories: string[];
  /** 2D array [competitor][category] with values 0-1 representing activity intensity */
  data: number[][];
}

export interface IntelligenceFlowSection extends BaseSection {
  type: "intelligence-flow";
  stages: {
    name: string;
    items: string[];
    /** Relative volume at this stage (used for band width) */
    value: number;
  }[];
}

export interface DoubleExposureAnatomySection extends BaseSection {
  type: "double-exposure-anatomy";
}

export interface ColorFieldMapSection extends BaseSection {
  type: "color-field-map";
}

export interface PatternMatrixSection extends BaseSection {
  type: "pattern-matrix";
}

export interface MaterialCircosSection extends BaseSection {
  type: "material-circos";
}

export interface KitchenPaletteSection extends BaseSection {
  type: "kitchen-palette";
}

export interface HexPolygonSection extends BaseSection {
  type: "hex-polygon";
}

/** The signature shape at scale — same hexagon repeated across a field,
 *  each copy rotated a few degrees past its neighbour, filling its box
 *  edge to edge. No copy over it (see PolygonLattice.tsx). Standalone so
 *  it can be placed wherever the study's own polygon device lives,
 *  rather than nested inside brand-system-volume. */
export interface PolygonLatticeSection extends BaseSection {
  type: "polygon-lattice";
}

export interface SizzlePlaygroundSection extends BaseSection {
  type: "sizzle-playground";
  /** "hero": the live reel, big, no controls — opens the study.
   *  "lab": reel + load-your-own-images controls, palette, headline,
   *  speed, and the beat inspector. Everything client-side; nothing saves. */
  variant: "hero" | "lab";
}

export interface CampaignBlastRadiusSection extends BaseSection {
  type: "campaign-blast-radius";
}

export interface JeffreyFlagshipRadiusSection extends BaseSection {
  type: "jeffrey-flagship-radius";
}

export interface MaterialOverlapSection extends BaseSection {
  type: "material-overlap";
}

export interface CabinMidCenturySpectrumSection extends BaseSection {
  type: "cabin-midcentury-spectrum";
}

export interface ColorPermutationsSection extends BaseSection {
  type: "color-permutations";
}

export interface EditorialTreatmentsSection extends BaseSection {
  type: "editorial-treatments";
}

export interface LogoCarouselSection extends BaseSection {
  type: "logo-carousel";
  slides: {
    src: string;
    alt: string;
    bg: string;
    maxWidth?: number;
  }[];
  /** Milliseconds between auto-advances (default 5000) */
  interval?: number;
  /** Padding inside each slide (default "clamp(120px, 18vw, 280px)") */
  padding?: string;
}

/**
 * InteriorsIndexSection — the system ledger for a room.
 *
 * The interiors answer to marks-materials. That section is a BRAND
 * ledger (mark, typeface, palette) and three interiors studies were
 * forced into it by putting their materials in the `fonts` field, so
 * "Limestone" shipped as a type specimen set in Caslon. The other five
 * carried no section at all.
 *
 * Deliberately almost empty. Materials, textures and palette are DERIVED
 * by scripts/build-interiors-index.mjs from the study's own authored
 * Materials line plus image-vision.json's observed readings, so a study
 * declares the section and the generator fills it. Authoring the rows
 * here as well would put the same fact in two places and let them drift,
 * which is how the palette chart this replaces ended up claiming 49
 * values for a room specified with four finishes.
 *
 * Run `npm run interiors` after adding one, or the section renders
 * nothing.
 */
export interface InteriorsIndexSection extends BaseSection {
  type: "interiors-index";
  /** Section pill, e.g. "SECTION 04: MATERIALS & FINISHES" */
  label: string;
  /** Display title above the intro, supports \n for line breaks */
  title: string;
  /** Subhead paragraph under the title */
  introText: string;
  /** Optional second paragraph */
  philosophyText?: string;
  /**
   * Named palette, the one row that cannot be derived. A hex can be
   * read off a photograph; "Limestone Cream" cannot, and inventing a
   * name for an observed colour would be a fabrication. Studies that
   * author names get them under the swatch; the rest fall back to the
   * cover reel's declared hexes and print the hex alone, which is
   * thinner and true.
   */
  colors?: { name: string; hex: string; description?: string }[];
  /**
   * Materials, where a study named where each one is used. Optional: the
   * generator derives this list from the study's authored `summary`
   * Materials line, and only the LOCATION half ("Floors, beams, mantel")
   * has to be written down. Three studies already had it, buried in the
   * `fonts` field of the brand section this replaces, so it is carried
   * over rather than thrown away.
   */
  materials?: { name: string; role?: string }[];
}

/**
 * MarksAndMaterialsSection — standardized brand pattern that goes near the end
 * of every case study. Visual treatment matches A.R.C.'s BrandSystem: two-tone
 * inline panel with a generated chromatic sphere on the left and philosophy +
 * type on the right. The sphere is generated from the project's color palette,
 * so each project gets a chromatic visual without bespoke artwork.
 */
export interface MarksAndMaterialsSection extends BaseSection {
  type: "marks-materials";
  /** Section pill, e.g. "SECTION 06: MARKS & MATERIALS" */
  label: string;
  /** Display title above the intro, supports \n for line breaks */
  title: string;
  /** Subhead paragraph under the title */
  introText: string;
  /** Optional smaller supporting line under the intro */
  subcopy?: string;
  /** Heading shown above the philosophy paragraphs (default "Brand philosophy") */
  philosophyTitle?: string;
  /** Philosophy paragraphs, separated by "\n\n" */
  philosophyText: string;
  /** Color palette — used for the generated chromatic sphere AND the swatch labels below it */
  colors: {
    name: string;
    hex: string;
    description?: string;
  }[];
  /** Type system — each entry renders as an inline description AND a large display sample */
  fonts: {
    name: string;
    role: string;
    description: string;
    /** CSS font-family stack for the display sample (defaults to system font) */
    family?: string;
    /** CSS font-weight for the display sample */
    weight?: number;
    /** Italic styling for the display sample (e.g. brand wordmarks set in italic) */
    italic?: boolean;
    /** Display sample size in px at desktop max (defaults to 36) */
    sampleSize?: number;
    /** Override the text shown in the color band sample (defaults to `name`). Useful when the full name wraps awkwardly. */
    sampleText?: string;
  }[];
  /** Primary mark image, shown centered at the bottom of the panel */
  markImage: string;
  markAlt: string;
  /** When true, the mark image fills the panel width (good for system spreads / wide compositions). Default false. */
  markFullBleed?: boolean;
  /**
   * Optional secondary image — when provided, the mark slot renders as a
   * side-by-side pair (markImage left, markImageRight right). Use for cases
   * like material studies where two complementary shots tell the story
   * better than a single spread.
   */
  markImageRight?: string;
  markAltRight?: string;
  /** When markImageRight is set, stack the pair vertically (full-width each) instead of side-by-side. */
  markStacked?: boolean;
}
