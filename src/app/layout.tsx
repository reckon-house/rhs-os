import type { Metadata } from "next";
import "./globals.css";
import { NavRail } from "@/components/shell/NavRail";
import { SmoothScroll } from "@/components/shell/SmoothScroll";
import { HeroPreloader } from "@/components/shell/HeroPreloader";
import { BurnMeltTransition } from "@/components/fx/BurnMeltTransition";
import { FilmOverlay } from "@/components/fx/FilmOverlay";
import { SpringSolve } from "@/components/fx/SpringSolve";
import { VisibilityPause } from "@/components/fx/VisibilityPause";
import { CustomCursor } from "@/components/fx/CustomCursor";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const SITE_DESCRIPTION =
  "Design and engineering across brand, product, and place. Apps, campaigns, brand systems, custom interiors, and AI tools by Jeremy Prasatik.";
const DEFAULT_OG_IMAGE = "/og-home.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Design & Engineering by Jeremy Prasatik",
    // Child pages set a bare title; this appends the brand. e.g. "A.R.C. · Reckon*House"
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Jeremy Prasatik" }],
  creator: "Jeremy Prasatik",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "Design & Engineering by Jeremy Prasatik",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Design & Engineering by Jeremy Prasatik",
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
      </head>
      <body className="font-sans antialiased">
        <div className="flex h-dvh w-screen overflow-hidden">
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </div>
        <BurnMeltTransition />
        <NavRail />
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
