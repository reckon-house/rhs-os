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
  | ColorPermutationsSection
  | EditorialTreatmentsSection
  | LogoCarouselSection
  | MarksAndMaterialsSection;

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
  }[];
  fonts: {
    name: string;
    role: string;
    description: string;
  }[];
  logoConstructionImage: string;
  appScreenshotImage: string;
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
}
