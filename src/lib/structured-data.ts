import { SITE_URL } from "@/lib/site";
import type { CaseStudy } from "@/lib/types";

/**
 * JSON-LD structured data. Stable @id values let nodes cross-reference each
 * other: a case study's `author` points at the Person defined sitewide in the
 * root layout, and Google merges every ld+json block on a page into one graph.
 */

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const BRAND = "Reckon House";

function personNode() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Jeremy Prasatik",
    url: SITE_URL,
    jobTitle: "Designer & Engineer",
    description:
      "Design and engineering across brand, product, and place. Apps, campaigns, brand systems, custom interiors, and AI tools.",
    knowsAbout: [
      "Product Design",
      "Full-Stack Engineering",
      "Brand Strategy",
      "Creative Direction",
      "Art Direction",
      "Interior Design",
      "Typography",
    ],
    sameAs: ["https://instagram.com/reckonhousestaples"],
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: BRAND,
    description:
      "Portfolio of Jeremy Prasatik. Design and engineering across brand, product, and place.",
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

/** Sitewide graph — Person (the author entity) + WebSite. Rendered in the root layout. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [personNode(), websiteNode()],
  };
}

/** Per-case-study CreativeWork. `imageUrl` should be absolute. */
export function caseStudyJsonLd(study: CaseStudy, imageUrl?: string) {
  const url = `${SITE_URL}/case-studies/${study.slug}`;
  const years = study.published.match(/\d{4}/g) ?? [];

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title.replace(/\n/g, " ").trim(),
    description: study.subtitle,
    url,
    mainEntityOfPage: url,
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    keywords: study.classification.join(", "),
  };

  if (study.category?.label) data.genre = study.category.label;
  if (imageUrl) data.image = imageUrl;
  // Use the most recent 4-digit year as the publication date (studies use a
  // single year or a "2008 — 2018" range).
  if (years.length) data.datePublished = years[years.length - 1];

  return data;
}
