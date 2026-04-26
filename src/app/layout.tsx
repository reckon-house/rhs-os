import type { Metadata } from "next";
import "./globals.css";
import { NavRail } from "@/components/shell/NavRail";
import { SmoothScroll } from "@/components/shell/SmoothScroll";
import { NavigationProvider } from "@/components/shell/NavigationProvider";
import { NavigationLoader } from "@/components/shell/NavigationLoader";
import { BurnMeltTransition } from "@/components/fx/BurnMeltTransition";
import { FilmOverlay } from "@/components/fx/FilmOverlay";

export const metadata: Metadata = {
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
        <NavigationProvider>
          <div className="flex h-dvh w-screen overflow-hidden">
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </div>
          <BurnMeltTransition />
          <NavigationLoader />
          <NavRail />
          <FilmOverlay />
        </NavigationProvider>
      </body>
    </html>
  );
}
