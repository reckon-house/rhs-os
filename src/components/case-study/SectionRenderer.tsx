import type { Section } from "@/lib/types";
import { HeroBlock } from "./sections/HeroBlock";
import { MetaBlock } from "./sections/MetaBlock";
import { SectionHeader } from "./sections/SectionHeader";
import { TextBlock } from "./sections/TextBlock";
import { TextRightBlock } from "./sections/TextRightBlock";
import { TwoColumnText } from "./sections/TwoColumnText";
import { ThreeColumnText } from "./sections/ThreeColumnText";
import { ImageBlock } from "./sections/ImageBlock";
import { DualImageBlock } from "./sections/DualImageBlock";
import { TripleImageBlock } from "./sections/TripleImageBlock";
import { StatsSummary } from "./sections/StatsSummary";
import { StatsBar } from "./sections/StatsBar";
import { FeatureCards } from "./sections/FeatureCards";
import { TimelineBlock } from "./sections/TimelineBlock";
import { TechStackBlock } from "./sections/TechStackBlock";
import { BrandBlock } from "./sections/BrandBlock";
import { PipelineBlock } from "./sections/PipelineBlock";
import { ColorPalette } from "./sections/ColorPalette";
import { TypographyBlock } from "./sections/TypographyBlock";
import { AppShowcase } from "./sections/AppShowcase";
import { ClosingBlock } from "./sections/ClosingBlock";
import { TechChart } from "./sections/TechChart";
import { CoverageChart } from "./sections/CoverageChart";
import { SpeedComparison } from "./sections/SpeedComparison";
import { DevTimeline } from "./sections/DevTimeline";
import { BrandSystem } from "./sections/BrandSystem";
import { SystemArchitecture } from "./sections/SystemArchitecture";
import { EditorialHeadline } from "./sections/EditorialHeadline";
import { AIHeatmap } from "./sections/AIHeatmap";
import { IntelligenceFlow } from "./sections/IntelligenceFlow";
import { DoubleExposureAnatomy } from "./sections/DoubleExposureAnatomy";
import { ColorFieldMap } from "./sections/ColorFieldMap";

export function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case "hero":
      return <HeroBlock {...section} />;
    case "meta":
      return <MetaBlock {...section} />;
    case "section-header":
      return <SectionHeader {...section} />;
    case "text":
      return <TextBlock {...section} />;
    case "text-right":
      return <TextRightBlock {...section} />;
    case "two-column-text":
      return <TwoColumnText {...section} />;
    case "three-column-text":
      return <ThreeColumnText {...section} />;
    case "image":
      return <ImageBlock {...section} />;
    case "dual-image":
      return <DualImageBlock {...section} />;
    case "triple-image":
      return <TripleImageBlock {...section} />;
    case "stats-summary":
      return <StatsSummary {...section} />;
    case "stats-bar":
      return <StatsBar {...section} />;
    case "feature-cards":
      return <FeatureCards {...section} />;
    case "timeline":
      return <TimelineBlock {...section} />;
    case "tech-stack":
      return <TechStackBlock {...section} />;
    case "brand":
      return <BrandBlock {...section} />;
    case "pipeline":
      return <PipelineBlock {...section} />;
    case "color-palette":
      return <ColorPalette {...section} />;
    case "typography":
      return <TypographyBlock {...section} />;
    case "app-showcase":
      return <AppShowcase {...section} />;
    case "closing":
      return <ClosingBlock {...section} />;
    case "tech-chart":
      return <TechChart {...section} />;
    case "coverage-chart":
      return <CoverageChart {...section} />;
    case "speed-comparison":
      return <SpeedComparison {...section} />;
    case "dev-timeline":
      return <DevTimeline {...section} />;
    case "brand-system":
      return <BrandSystem {...section} />;
    case "system-architecture":
      return <SystemArchitecture />;
    case "editorial-headline":
      return <EditorialHeadline {...section} />;
    case "ai-heatmap":
      return <AIHeatmap {...section} />;
    case "intelligence-flow":
      return <IntelligenceFlow {...section} />;
    case "double-exposure-anatomy":
      return <DoubleExposureAnatomy />;
    case "color-field-map":
      return <ColorFieldMap />;
    case "spacer":
      return <div style={{ height: section.height }} />;
    default:
      return null;
  }
}
