import type { Metadata } from "next";
import "./globals.css";
import { NavRail } from "@/components/shell/NavRail";
import { SmoothScroll } from "@/components/shell/SmoothScroll";
import { HeatbarMelt } from "@/components/fx/HeatbarMelt";
import { BurnMeltTransition } from "@/components/fx/BurnMeltTransition";

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
      <body className="font-sans antialiased">
        <div className="flex h-dvh w-screen overflow-hidden">
          <div className="relative" style={{ zIndex: 2147483647 }}>
            <NavRail />
          </div>
          <div className="hidden md:block w-[1px] shrink-0 bg-[#DDDDDD] mt-[50px] self-start h-[calc(100vh-100px)]" style={{ zIndex: 2147483647, maxHeight: "700px" }} />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </div>
        <HeatbarMelt />
        <BurnMeltTransition />
      </body>
    </html>
  );
}
