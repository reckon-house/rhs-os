import type { MetadataRoute } from "next";
import { projects, type Tag } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

const TAGS: Tag[] = ["digital", "creative", "interiors"];

// Served at /sitemap.xml. Built from the projects list so new case studies
// show up automatically. No manual upkeep.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/custom`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/inspiration`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = TAGS.map((tag) => ({
    url: `${SITE_URL}/category/${tag}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

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

  return [...staticRoutes, ...categoryRoutes, ...caseStudyRoutes];
}
