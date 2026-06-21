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
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "RHS OS",
  description: "Portfolio operating system by Jeremy Prasatik",
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
