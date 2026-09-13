import { SITE_URL, plainStatement } from "@/lib/site";
import type { CaseStudy } from "@/lib/types";
import type { DaybookEntry } from "@/data/daybook";

/**
 * JSON-LD structured data. Stable @id values let nodes cross-reference each
 * other: a case study's `author` points at the Person defined sitewide in the
 * root layout, and Google merges every ld+json block on a page into one graph.
 */

const PERSON_ID = `${SITE_URL}/#person`;
const ORG_ID = `${SITE_URL}/#organization`;
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
    worksFor: { "@id": ORG_ID },
    // Real, owned profiles — ties the Jeremy Prasatik entity together for AI
    // search and disambiguates it from unrelated "Reckon" studios.
    sameAs: [
      "https://www.linkedin.com/in/jeremy-prasatik-53a3962/",
      "https://www.flickr.com/photos/jp33/",
    ],
  };
}

function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Reckon House Staples",
    alternateName: BRAND,
    url: SITE_URL,
    description:
      "Multidisciplinary design and engineering practice by Jeremy Prasatik, spanning digital products, brand, and interiors.",
    founder: { "@id": PERSON_ID },
    sameAs: ["https://instagram.com/reckonhousestaples"],
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Reckon House Staples",
    alternateName: BRAND,
    description:
      "Multi-disciplinary design and engineering by Jeremy Prasatik, across brand, product, and place.",
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
  };
}

/** Sitewide graph — Person + Organization + WebSite. Rendered in the root layout. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [personNode(), organizationNode(), websiteNode()],
  };
}

/** Per-case-study graph: the CreativeWork + a BreadcrumbList. `imageUrl` should be absolute. */
export function caseStudyJsonLd(study: CaseStudy, imageUrl?: string) {
  const url = `${SITE_URL}/case-studies/${study.slug}`;
  const years = study.published.match(/\d{4}/g) ?? [];

  const creativeWork: Record<string, unknown> = {
    "@type": "CreativeWork",
    name: study.title.replace(/\n/g, " ").trim(),
    description: plainStatement(study.subtitle),
    url,
    mainEntityOfPage: url,
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    keywords: study.classification.join(", "),
  };
  if (study.category?.label) creativeWork.genre = study.category.label;
  if (imageUrl) creativeWork.image = imageUrl;
  // Most recent 4-digit year (studies use a single year or a "2008 — 2018" range).
  if (years.length) creativeWork.datePublished = years[years.length - 1];

  // Breadcrumb: Home → [Category] → this study.
  const crumbs: { name: string; item: string }[] = [{ name: "Home", item: SITE_URL }];
  if (study.category?.label && study.category?.href) {
    crumbs.push({ name: study.category.label, item: `${SITE_URL}${study.category.href}` });
  }
  crumbs.push({ name: creativeWork.name as string, item: url });

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.item,
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [creativeWork, breadcrumb],
  };
}

/* ── THE DAYBOOK, AS A BLOG ─────────────────────────────────────────
   Every entry is a BlogPosting at its own anchor, dated by the day it
   was entered, so a crawler reads the log the way the page lays it
   out: what shipped, when, and on which project. An entry with no
   title is headed by its own first sentence, capped where Google stops
   reading a headline. Nothing here is written for the crawler; it is
   the entry, restated as data. */
const HEADLINE_MAX = 110;

function daybookHeadline(e: DaybookEntry): string {
  if (e.title) return e.title;
  const first = Array.isArray(e.body) ? e.body[0] : e.body;
  const sentence = first.match(/^(.+?[.!?])(\s|$)/)?.[1] ?? first;
  if (sentence.length <= HEADLINE_MAX) return sentence;
  return `${sentence.slice(0, HEADLINE_MAX - 1).replace(/\s+\S*$/, "")}\u2026`;
}

/** The /daybook graph: a Blog holding one BlogPosting per entry, plus its breadcrumb. */
export function daybookJsonLd(entries: DaybookEntry[]) {
  const url = `${SITE_URL}/daybook`;
  const blog = {
    "@type": "Blog",
    "@id": `${url}#blog`,
    name: "Daybook",
    url,
    description:
      "Jeremy Prasatik's daybook: ships, fixes and notes across Reckon House, Sally and A.R.C., dated and numbered.",
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    blogPost: entries.map((e) => {
      const post: Record<string, unknown> = {
        "@type": "BlogPosting",
        "@id": `${url}#${e.id}`,
        url: `${url}#${e.id}`,
        headline: daybookHeadline(e),
        datePublished: e.date,
        articleSection: e.project,
        articleBody: (Array.isArray(e.body) ? e.body : [e.body]).join("\n\n"),
        inLanguage: "en",
        author: { "@id": PERSON_ID },
        isPartOf: { "@id": `${url}#blog` },
      };
      if (e.image) post.image = `${SITE_URL}${e.image.src}`;
      return post;
    }),
  };
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Daybook", item: url },
    ],
  };
  return { "@context": "https://schema.org", "@graph": [blog, breadcrumb] };
}
