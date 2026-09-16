import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { CUSTOM } from "@/data/custom";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { customJsonLd } from "@/lib/structured-data";
import { CustomBoard } from "./CustomBoard";

const TITLE = "Custom tools and setups for small business";
const DESCRIPTION =
  "Jeremy Prasatik runs a small design and software studio in Celina, Texas. For a small " +
  "business: the tools you have, connected and running with an assistant, or the tool you " +
  "need, built. Each project is priced on its own. It starts with a call.";

/* The share card is the site's own, as the daybook's is: a page's
   openGraph replaces the layout's whole, so leaving images out here
   would unfurl with none at all. */
const CARD = { url: "/og-home-clean.jpg", width: 2400, height: 1260, alt: "Reckon House" };

export const metadata: Metadata = {
  title: CUSTOM.caption,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/custom` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    url: `${SITE_URL}/custom`,
    images: [CARD],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [CARD.url],
  },
};

/* ── /custom ────────────────────────────────────────────────────────
 * The page a small business is sent to, on the board's glass. All
 * rendering lives in CustomBoard, a client component (it turns, counts
 * and asks) which still SSRs, so every word is in the HTML. This file
 * keeps the metadata and the structured data on a server module: the
 * offer is a Service the studio provides from Celina, and a crawler
 * reads that without running a script.
 *
 * It replaced the May 2026 page (three demo widgets, a two-week arc
 * and placeholder price tiers) once the offer settled: start with a
 * call, price each project on its own, and let the studies be the
 * proof rather than a mock coffee shop. */
export default function CustomPage() {
  return (
    <>
      <JsonLd data={customJsonLd()} />
      <CustomBoard />
    </>
  );
}
