import type { MetadataRoute } from "next";
import { DAYBOOK } from "@/data/daybook";
import { SITE_URL } from "@/lib/site";


// Served at /sitemap.xml: the site's pages. The case studies live on the
// homepage as rooms (#study/<key>), which a sitemap cannot list.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    /* the page a small business is sent to: the studio's offer, on
       the board's glass, with the studies behind it */
    { url: `${SITE_URL}/custom`, lastModified, changeFrequency: "monthly", priority: 0.7 },
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


  /* the case studies are rooms on the homepage since 1 Oct 2026, and their
     old pages redirect there, so the sitemap no longer lists them */
  return staticRoutes;
}
