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
          <NavRail />
          <div className="w-[1px] shrink-0 bg-[#DDDDDD] mt-[50px]" />
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
