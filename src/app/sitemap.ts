import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { DAYBOOK } from "@/data/daybook";
import { SITE_URL } from "@/lib/site";


// Served at /sitemap.xml. Built from the projects list so new case studies
// show up automatically. No manual upkeep.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/custom`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/inspiration`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    /* the one page on the site that changes every week, so it says
       when it last did: the newest entry's own date, not the build's */
    {
      url: `${SITE_URL}/daybook`,
      lastModified: new Date(`${DAYBOOK[0].date}T12:00:00Z`),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];


  // A few projects point at the same case study, so dedupe by href.
  const caseStudyHrefs = Array.from(
    new Set(
      projects
        .map((p) => p.href)
        .filter((href): href is string =>
          Boolean(href?.startsWith("/case-studies/")),
        ),
    ),
  );
  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudyHrefs.map((href) => ({
    url: `${SITE_URL}${href}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseStudyRoutes];
}
