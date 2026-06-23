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
  | CampaignBlastRadiusSection
  | JeffreyFlagshipRadiusSection
  | MaterialOverlapSection
  | CabinMidCenturySpectrumSection
  | ColorPermutationsSection
  | EditorialTreatmentsSection
  | LogoCarouselSection
  | MarksAndMaterialsSection
  | MasonrySection
  | MCPArchitectureSection;

export interface MasonrySection extends BaseSection {
  type: "masonry";
  images: { src: string; alt: string }[];
  /** Desktop column count (default 2). Mobile is always 1. */
  columns?: number;
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
}

export interface SectionHeaderSection extends BaseSection {
  type: "section-header";
  label: string;
  title: string;
  centered?: boolean;
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
  items: {
    label: string;
    value: string;
    description: string;
    width: number; // percentage width for the bar
    note?: string;
  }[];
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
  appScreenshotImage: string;
  /** Big display glyph that morphs letter-to-letter (e.g. A → R → C for a.r.c.).
   *  Each entry is a character + optional brand face (defaults to the Ogg display
   *  face). Omit to leave the section without an animated glyph. */
  morphGlyphs?: { char: string; font?: "ogg" | "avenir-medium" | "avenir-demi" | "avenir-bold" }[];
}

/** Editorial "type at volume" variant of the brand system — for case studies built
 *  without a formal brand guide (e.g. Ivy Park). Same two-tone panel + morph + palette
 *  as {@link BrandSystemSection}, but the lower half is a graphic type composition and
 *  a rotating polygon lattice instead of specimen grids + logo construction. */
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
  /** Copy centred over the rotating polygon lattice. */
  polygonSignature: { name: string; description: string };
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
