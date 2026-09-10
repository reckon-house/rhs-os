import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Static assets get new filenames whenever they're replaced (see images note
// below), so a 1-year immutable browser cache is safe and means repeat
// visitors serve fonts/images from their own cache instead of re-hitting
// Vercel — which cuts the monthly "Edge Requests" count, not just bandwidth.
const LONG_CACHE = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  /* ── THE BOARD IS THE HOMEPAGE ────────────────────────────────────
     public/lab/board.html, assembled by scripts/lib/assemble-board.py,
     stands at / by rewrite. beforeFiles, so it wins over app/page.tsx
     (the earlier home, which the case-study footers still render).
     The query string rides along: ?open= and ?at= are the board's own
     address. The page carries the site's head itself, since a static
     file gets nothing from the app's layout. */
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/lab/board.html" }] };
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
     the thing itself. ?open=shelf: is the board's own address for a
     line, and any tag works, so /category/branding answers too even
     though that page never existed. */
  async redirects() {
    return [
      {
        source: "/category/:tag",
        destination: "/?open=shelf::tag",
        permanent: true,
      },
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
