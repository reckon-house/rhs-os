import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { NEWEST } from "@/data/signal";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { signalJsonLd } from "@/lib/structured-data";
import { SignalBoard } from "./SignalBoard";

const DESCRIPTION =
  "Signal: the AI news Jeremy Prasatik reads, each with his take from building real products with these tools. Newest first.";

/* The share card is the site's own, as the daybook's is: a page's
   openGraph replaces the layout's whole, so leaving images out here
   would unfurl with none at all. */
const CARD = { url: "/og-home-clean.jpg", width: 2400, height: 1260, alt: "Reckon House" };

export const metadata: Metadata = {
  title: "Signal",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/signal` },
  openGraph: {
    title: "Signal",
    description: DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    url: `${SITE_URL}/signal`,
    images: [CARD],
  },
  twitter: {
    card: "summary_large_image",
    title: "Signal",
    description: DESCRIPTION,
    images: [CARD.url],
  },
};

/* ── /signal ────────────────────────────────────────────────────────
 * The AI news feed, on the board's glass. Same split as /daybook: the
 * rendering is SignalBoard, a client component (it filters and turns)
 * that still SSRs, and this file keeps the metadata and the structured
 * data on a server module. Every entry is a dated BlogPosting that
 * cites the article it is about. */
export default function SignalPage() {
  return (
    <>
      <JsonLd data={signalJsonLd(NEWEST)} />
      <SignalBoard />
    </>
  );
}
