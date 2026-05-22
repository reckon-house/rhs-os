import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/case-study/CaseStudyLayout";
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

// For now, case studies are loaded from local data files.
// This will migrate to Supabase when the CMS layer is ready.
const caseStudies = [arcCaseStudy, sallyCaseStudy, robertRodriguezCaseStudy, blackWhiteTypeCaseStudy, hillCountryKitchenCaseStudy, ivyParkCaseStudy, hillCountryBathCaseStudy, fairviewSuiteCaseStudy, jChristiansonCaseStudy, nordstromBeautyCaseStudy, neimanMarcusCaseStudy, lovedByNordstromCaseStudy, brandingGraphicsCaseStudy, nordstromPersonalizationCaseStudy, capitanBootCoCaseStudy, amberShockeyCoCaseStudy, cosmoProfCaseStudy, hillCountryOakCaseStudy, fairviewSittingCaseStudy, jeffreySpringCaseStudy, youBySallyCaseStudy, jeffreyEcommerceCaseStudy, floorAndDecorCaseStudy, chaletCaseStudy, nordstromFrameworkCaseStudy, fairviewEntryCaseStudy, hillCountryLivingCaseStudy];

export function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }));
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

  return <CaseStudyLayout study={study} />;
}
