import type { Metadata } from "next";
import { StaplesBoard } from "./StaplesBoard";
import { inspiration } from "@/data/inspiration";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const INSPIRATION_DESCRIPTION =
  "A running visual reference board. Images, marks, and quotes that feed the work.";

/* The nav calls this Staples and the route is /inspiration, and the
   title keeps the route's word on purpose: the template appends the
   wordmark, so "Staples" here would unfurl and rank as "Staples ·
   Reckon House Staples". The page's own voice does the naming. */
export const metadata: Metadata = {
  title: "Inspiration",
  description: INSPIRATION_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/inspiration` },
  openGraph: {
    title: "Inspiration",
    description: INSPIRATION_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    url: `${SITE_URL}/inspiration`,
    images: inspiration[0]?.src ? [inspiration[0].src] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Inspiration",
    description: INSPIRATION_DESCRIPTION,
    images: inspiration[0]?.src ? [inspiration[0].src] : undefined,
  },
};

/* ── /inspiration ───────────────────────────────────────────────────
 * All rendering lives in StaplesBoard, a client component (it makes
 * the site's entrance) which still SSRs. This file exists to keep the
 * metadata export on a server module, which a "use client" file
 * cannot carry. Same split as /daybook. */
export default function InspirationPage() {
  return <StaplesBoard />;
}
