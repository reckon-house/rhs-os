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
  | MetaSection
  | TextSection
  | TextRightSection
  | TwoColumnTextSection
  | ThreeColumnTextSection
  | ImageSection
  | DualImageSection
  | TripleImageSection
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
  | ColorPermutationsSection;

interface BaseSection {
  id: string;
  /** Group consecutive sections into a styled container */
  group?: {
    name: string;
    bg?: string;
    radius?: number;
    padding?: string;
  };
}

export interface HeroSection extends BaseSection {
  type: "hero";
  image: string;
  alt: string;
  inline?: boolean;
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
