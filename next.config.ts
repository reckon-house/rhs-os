import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Static assets get new filenames whenever they're replaced (see images note
// below), so a 1-year immutable browser cache is safe and means repeat
// visitors serve fonts/images from their own cache instead of re-hitting
// Vercel — which cuts the monthly "Edge Requests" count, not just bandwidth.
const LONG_CACHE = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  /* ── THE INDEX IS THE HOMEPAGE (1 Oct 2026) ───────────────────────
     public/lab/density/crossref2.html, the index and its rooms, stands
     at / by rewrite (his "let's make it the main site at reckon.house
     now!"). beforeFiles, so it wins over app/page.tsx. Its addresses
     are hashes (#study/arc, #line/digital), so they ride along. The
     page carries the site's head itself, since a static file gets
     nothing from the app's layout. The board it replaced (7 Sept) is
     still at /lab/board.html. */
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/lab/density/crossref2.html" }] };
  },
  /* ── THE CATEGORY PAGES ARE THE BOARD'S SHELVES NOW ─────────────
     /category/digital and its two siblings were the old site's
     landing pages for a line. Nothing on the site has linked to them
     since the board arrived: the rail, the run heads and the study
     bars all open a shelf on the board instead. They stayed reachable
     by URL and in the sitemap, so search still sent people to a
     staler version of the site standing beside the live one.

     A permanent redirect, rather than a delete, because the three
     have been indexed for months and an inbound link should land on
     the thing itself. #line/<tag> is the index's own address for a
     line's shelf (it was the board's ?open=shelf:<tag> until 1 Oct
     2026), and every line tag works: digital, app, systems, creative,
     branding, interiors. */
  async redirects() {
    return [
      {
        source: "/category/:tag",
        destination: "/#line/:tag",
        permanent: true,
      },
      /* ── THE OLD CASE STUDIES OPEN AS ROOMS (1 Oct 2026) ───────────
         His "yea redirect the old case studies too", the day the index
         became the homepage. Each /case-studies/<slug> page lands on its
         room, /#study/<key>. The keys are the slugs but for two, named
         first. The slug is letters, digits and hyphens only, so the
         pictures under /case-studies/<slug>/ never match. */
      { source: "/case-studies/sally", destination: "/#study/sally-os", permanent: true },
      { source: "/case-studies/fairview-suite", destination: "/#study/fairview-bedroom", permanent: true },
      { source: "/case-studies/:slug([a-z0-9-]+)", destination: "/#study/:slug", permanent: true },
      { source: "/case-studies", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: LONG_CACHE }] },
      /* the board's thumbs keep their names when re-encoded, so a day,
         not a year: a re-dealt picture reaches a returning visitor by
         tomorrow */
      { source: "/lab/board-thumbs/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400" }] },
      { source: "/case-studies/:path*", headers: [{ key: "Cache-Control", value: LONG_CACHE }] },
      { source: "/nav/:path*", headers: [{ key: "Cache-Control", value: LONG_CACHE }] },
      { source: "/masks/:path*", headers: [{ key: "Cache-Control", value: LONG_CACHE }] },
    ];
  },
  images: {
    // AVIF first, WebP behind it. The optimizer picks by the browser's
    // Accept header, so anything too old for AVIF still gets WebP and
    // anything too old for both gets the original. Measured on a 1177KB
    // plate at w=640: 62KB WebP against 35KB AVIF.
    formats: ["image/avif", "image/webp"],
    // Allow our hero/spread widths so /_next/image doesn't 400 when components
    // request 2400px (default deviceSizes top out at 3840 but skip 2400).
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 2400, 3840],
    // Cache each optimized variant for 31 days. Our images are static and get
    // a new filename whenever they're replaced, so a long TTL means every
    // size/format variant is generated once and then served from cache instead
    // of being re-transformed on expiry. Keeps Vercel's monthly "Image
    // Optimization - Transformations" count near zero after the initial warm.
    minimumCacheTTL: 2678400,
    // Bypass the Next.js 16 dev image worker in development — it has a known
    // deadlock bug that hangs/returns malformed responses intermittently on
    // small source images at certain requested widths. Production (Vercel)
    // uses a separate CDN-backed image pipeline that's unaffected, so we
    // keep optimization on there.
    ...(isDev ? { unoptimized: true } : {}),
  },
};

export default nextConfig;
