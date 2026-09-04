import type { Metadata } from "next";
import { stampScript } from "@/lib/paper-routes";
import "./globals.css";
import { SmoothScroll } from "@/components/shell/SmoothScroll";
import { HeroPreloader } from "@/components/shell/HeroPreloader";
import { PressingTransition } from "@/components/shell/PressingTransition";
import { FilmOverlay } from "@/components/fx/FilmOverlay";
import { VisibilityPause } from "@/components/fx/VisibilityPause";
import { CustomCursor } from "@/components/fx/CustomCursor";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { siteGraph } from "@/lib/structured-data";

const SITE_DESCRIPTION =
  "The portfolio of Jeremy Prasatik, an independent designer and developer in Texas. Apps, ecommerce, campaigns, brand systems, interiors, and AI tools, with case studies for each.";
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
    /* suppressHydrationWarning is for the class the head script below
       stamps on this element before React ever runs. The server cannot
       know the route's ground, the client must know it before the first
       paint, and React sees the difference as a mismatch it refuses to
       patch. Suppression applies to THIS element's attributes only, not
       to its subtree, which is exactly the scope of the discrepancy. */
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* THE GROUND, BEFORE THE FIRST PAINT. The white routes ask for
            their ground in a useEffect, which runs after hydration, so
            until this existed a refresh painted the shell's cream and
            the classic type for a beat and then flipped. Blocking and
            first in <head> on purpose: anything after it in the
            document would already have been painted against the wrong
            ground. See src/lib/paper-routes.ts, which owns the list
            this and the components both read. */}
        <script dangerouslySetInnerHTML={{ __html: stampScript() }} />
        {/* ── ARRIVING UNDER A CURTAIN ─────────────────────────────
            A document reached from outside React — the lab board is a
            static page, so its link is a real navigation — lands with
            no curtain to lift, and the study blinked in. The leaving
            page leaves a note; this draws the SAME curtain it was
            looking at, name and all, before anything of the arriving
            page can be seen, and PressingTransition lifts it as beat
            three. Inline and synchronous on purpose: a frame later is
            a frame of the page showing.

            The note carries the measurements rather than the rules
            for them — how many lines fill this screen, the
            line-height that makes them add up, the size that fits the
            longest one — because the page that left had already
            worked all of that out against the same viewport.

            IT ARRIVES LAPPING. On a fast route the leaving page's
            wait is over in milliseconds, so nearly all the black
            anyone actually sees belongs to this document — and drawn
            settled it read as a held frame rather than a page
            loading. Same class, same keyframes, and the delays it
            carries are the IN stagger the lap runs on;
            PressingTransition reverses them for the lift, exactly
            where the site's own sequence does. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{" +
              "var raw=sessionStorage.getItem('pt.arrive');if(!raw)return;" +
              "sessionStorage.removeItem('pt.arrive');" +
              "var d=JSON.parse(raw);" +
              "if(!d||!d.t||Date.now()-d.t>15000)return;" +
              "var r=document.createElement('div');r.id='ptArrive';" +
              "r.className='pt pt-run pt-1 pt-2 pt-wait';r.setAttribute('aria-hidden','true');" +
              /* the black belongs to the PANEL, which is the thing
                 that clips away. On the root it survived the lift and
                 the page only appeared when the element was removed,
                 which read as the curtain blinking out. */
              "r.style.cssText='position:fixed;inset:0;z-index:300';" +
              "var N=d.n||0;" +
              "var panel=function(cls,bg){var p=document.createElement('div');p.className=cls;" +
              "p.style.cssText='position:absolute;inset:0;background:'+bg;" +
              "var s=document.createElement('div');s.className='ptstack';" +
              "if(d.lh)s.style.setProperty('--ptlh',d.lh);" +
              "if(d.fs)s.style.setProperty('--ptfs',d.fs);" +
              "if(!d.sub)s.className='ptstack pt-nosub';" +
              "for(var i=0;i<N;i++){var l=document.createElement('span');l.className='ptl';" +
              "l.style.setProperty('--d',(i*0.03).toFixed(3)+'s');" +
              "l.textContent=d.title||'';" +
              "if(d.sub){var b=document.createElement('span');b.className='sub';" +
              "b.textContent='  '+d.sub;l.appendChild(b);}s.appendChild(l);}" +
              "p.appendChild(s);return p;};" +
              "r.appendChild(panel('ptw','#fff'));r.appendChild(panel('ptb','#000'));" +
              "document.documentElement.appendChild(r);" +
              "document.documentElement.classList.add('pt-arriving');" +
              "}catch(e){}})()",
          }}
        />
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
        {/* SpringSolve, the pencil desk-surface, is unmounted rather than
            deleted: every route it drew under is white Pressing C paper
            now, so its only remaining appearance was as a bug — the
            translucent masthead samples BEHIND the page, and the
            sketches ghosted through the bar on production. The
            component keeps its file; remounting it is one line, hiding
            it properly means giving it data-film-ground first. */}
        <VisibilityPause />
        <HeroPreloader />
        <CustomCursor />
        <Analytics />
      </body>
    </html>
  );
}
