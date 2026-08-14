import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/shell/SmoothScroll";
import { HeroPreloader } from "@/components/shell/HeroPreloader";
import { PressingTransition } from "@/components/shell/PressingTransition";
import { FilmOverlay } from "@/components/fx/FilmOverlay";
import { SpringSolve } from "@/components/fx/SpringSolve";
import { VisibilityPause } from "@/components/fx/VisibilityPause";
import { CustomCursor } from "@/components/fx/CustomCursor";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { siteGraph } from "@/lib/structured-data";

const SITE_DESCRIPTION =
  "Multi-disciplinary design and engineering by Jeremy Prasatik. Reckon House Staples works across brand, product, and place: apps, interiors, and AI tools.";
/* THE SHARE CARD. A NEW FILENAME IS THE WHOLE POINT — overwriting
   og-home.jpg would have changed nothing a reader sees, because social
   scrapers cache by URL for weeks and no amount of redeploying makes
   them re-fetch a path they already hold. A different URL is a
   different asset, so every platform fetches it fresh. The old file
   stays on disk for links already out in the world.

   Dimensions are declared rather than left to the scraper: several
   fall back to a small square card when they cannot cheaply learn the
   ratio, and this is a 1.91:1 image that should always unfurl large. */
const DEFAULT_OG_IMAGE = {
  url: "/og-home-clean.jpg",
  width: 2400,
  height: 1260,
  alt: "Reckon House. Work by Jeremy Prasatik: the Robert Rodriguez campaign, the Ivy Park launch, and the A.R.C. app.",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Homepage title leads with the brand so branded ("reckon house") queries
    // surface it; child pages append the wordmark via the template below.
    default: "Reckon House Staples · Design & Engineering",
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Jeremy Prasatik" }],
  creator: "Jeremy Prasatik",
  openGraph: {
    type: "website",
    // Clean business name for the site-name shown in Google + social unfurls
    // (the "·" wordmark stays the title-template suffix for child pages).
    siteName: "Reckon House Staples",
    url: SITE_URL,
    /* THE UNFURL CAPTION, AND ONLY THAT. Three lines already carry the
       name in a shared link — the card prints "Reckon House", the site
       name and the domain both sit under it — so the caption spending
       itself on "Design & Engineering by Jeremy Prasatik" said the same
       thing a fourth time. Two words instead, naming the work.
       The document <title> above is a different job: it is what a search
       result and a browser tab show, where the brand has to be in the
       string to be found, so it keeps its wordmark. */
    title: "Design & Build",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Design & Build",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload the primary body font so the first paint doesn't flash in fallback. */}
        <link
          rel="preload"
          href="/fonts/Satoshi-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Person + WebSite structured data — sitewide author entity. */}
        <JsonLd data={siteGraph()} />
      </head>
      <body className="font-sans antialiased">
        <div className="flex h-dvh w-screen overflow-hidden">
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </div>
        {/* One transition for the whole site. The BurnMelt overlay it
            replaces listened on document in the capture phase, so on
            the homepage it fired alongside the curtain and then played
            its own fade-in on the arriving page — two transitions over
            one navigation. */}
        <PressingTransition />
        {/* The nav is the Masthead now — sticky inside SmoothScroll's
            content so its burn pill samples what scrolls beneath it. The
            pre-redesign bottom dock (NavRail) is archived at tag site-v1. */}
        <FilmOverlay />
        <SpringSolve />
        <VisibilityPause />
        <HeroPreloader />
        <CustomCursor />
        <Analytics />
      </body>
    </html>
  );
}
