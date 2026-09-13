import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { DAYBOOK } from "@/data/daybook";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { daybookJsonLd } from "@/lib/structured-data";
import { DaybookBoard } from "./DaybookBoard";

const DESCRIPTION =
  "Jeremy Prasatik's daybook: what shipped across Reckon House, Sally and A.R.C., dated and numbered, newest first.";

/* The share card is the site's own. The log has no picture that stands
   for all of it, and a page's openGraph replaces the layout's whole, so
   leaving images out here would unfurl with none at all. */
const CARD = { url: "/og-home-clean.jpg", width: 2400, height: 1260, alt: "Reckon House" };

export const metadata: Metadata = {
  title: "Daybook",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/daybook` },
  openGraph: {
    title: "Daybook",
    description: DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    url: `${SITE_URL}/daybook`,
    images: [CARD],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daybook",
    description: DESCRIPTION,
    images: [CARD.url],
  },
};

/* ── /daybook ───────────────────────────────────────────────────────
 * The running log, on the board's glass. All rendering lives in
 * DaybookBoard, a client component (it filters, turns and counts)
 * which still SSRs, so every entry is in the HTML. This file keeps
 * the metadata and the structured data on a server module: every
 * entry is also a dated BlogPosting, so a crawler reads what shipped
 * and when without running a script. */
export default function DaybookPage() {
  return (
    <>
      <JsonLd data={daybookJsonLd(DAYBOOK)} />
      <DaybookBoard />
    </>
  );
}
