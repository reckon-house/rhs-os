import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/case-study/CaseStudyLayout";
import { projects } from "@/data/projects";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { caseStudyJsonLd } from "@/lib/structured-data";
import { arcCaseStudy } from "@/data/arc-case-study";
import { sallyCaseStudy } from "@/data/sally-case-study";
import { robertRodriguezCaseStudy } from "@/data/robert-rodriguez-case-study";
import { blackWhiteTypeCaseStudy } from "@/data/black-white-type-case-study";
import { hillCountryKitchenCaseStudy } from "@/data/hill-country-kitchen-case-study";
import { ivyParkCaseStudy } from "@/data/ivy-park-case-study";
import { hillCountryBathCaseStudy } from "@/data/hill-country-bath-case-study";
import { fairviewSuiteCaseStudy } from "@/data/fairview-suite-case-study";
import { jChristiansonCaseStudy } from "@/data/j-christianson-case-study";
import { nordstromBeautyCaseStudy } from "@/data/nordstrom-beauty-case-study";
import { neimanMarcusCaseStudy } from "@/data/neiman-marcus-case-study";
import { lovedByNordstromCaseStudy } from "@/data/loved-by-nordstrom-case-study";
import { brandingGraphicsCaseStudy } from "@/data/branding-graphics-case-study";
import { nordstromPersonalizationCaseStudy } from "@/data/nordstrom-personalization-case-study";
import { capitanBootCoCaseStudy } from "@/data/capitan-boot-co-case-study";
import { amberShockeyCoCaseStudy } from "@/data/amber-shockey-co-case-study";
import { cosmoProfCaseStudy } from "@/data/cosmo-prof-case-study";
import { hillCountryOakCaseStudy } from "@/data/hill-country-oak-case-study";
import { fairviewSittingCaseStudy } from "@/data/fairview-sitting-case-study";
import { jeffreySpringCaseStudy } from "@/data/jeffrey-spring-case-study";
import { youBySallyCaseStudy } from "@/data/you-by-sally-case-study";
import { jeffreyEcommerceCaseStudy } from "@/data/jeffrey-ecommerce-case-study";
import { floorAndDecorCaseStudy } from "@/data/floor-and-decor-case-study";
import { chaletCaseStudy } from "@/data/chalet-case-study";
import { nordstromFrameworkCaseStudy } from "@/data/nordstrom-framework-case-study";
import { fairviewEntryCaseStudy } from "@/data/fairview-entry-case-study";
import { hillCountryLivingCaseStudy } from "@/data/hill-country-living-case-study";
import { dscCaseStudy } from "@/data/dsc-case-study";
import { bigBendCaseStudy } from "@/data/big-bend-case-study";
import { sizzleCaseStudy } from "@/data/sizzle-case-study";

// For now, case studies are loaded from local data files.
// This will migrate to Supabase when the CMS layer is ready.
const caseStudies = [arcCaseStudy, sallyCaseStudy, robertRodriguezCaseStudy, blackWhiteTypeCaseStudy, hillCountryKitchenCaseStudy, ivyParkCaseStudy, hillCountryBathCaseStudy, fairviewSuiteCaseStudy, jChristiansonCaseStudy, nordstromBeautyCaseStudy, neimanMarcusCaseStudy, lovedByNordstromCaseStudy, brandingGraphicsCaseStudy, nordstromPersonalizationCaseStudy, capitanBootCoCaseStudy, amberShockeyCoCaseStudy, cosmoProfCaseStudy, hillCountryOakCaseStudy, fairviewSittingCaseStudy, jeffreySpringCaseStudy, youBySallyCaseStudy, jeffreyEcommerceCaseStudy, floorAndDecorCaseStudy, chaletCaseStudy, nordstromFrameworkCaseStudy, fairviewEntryCaseStudy, hillCountryLivingCaseStudy, dscCaseStudy, bigBendCaseStudy, sizzleCaseStudy];

export function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }));
}

// Prefer the curated JPG thumbnail from the projects list — consistent format
// and aspect, and reliable in social unfurls (some hero sections are AVIF/WebP,
// which several scrapers can't render). Fall back to the first hero section.
function ogImageFor(slug: string): string | undefined {
  const fromProject = projects.find(
    (p) => p.href === `/case-studies/${slug}`,
  )?.image;
  if (fromProject) return fromProject;
  const study = caseStudies.find((s) => s.slug === slug);
  const hero = study?.sections.find((s) => s.type === "hero") as
    | { image?: string }
    | undefined;
  return hero?.image;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) return {};

  const url = `${SITE_URL}/case-studies/${study.slug}`;
  const description = study.subtitle;
  const image = ogImageFor(study.slug);

  return {
    title: study.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      url,
      title: study.title,
      description,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  const ogImage = ogImageFor(study.slug);
  const imageAbs = ogImage ? `${SITE_URL}${ogImage}` : undefined;

  return (
    <>
      <JsonLd data={caseStudyJsonLd(study, imageAbs)} />
      <CaseStudyLayout study={study} />
    </>
  );
}
