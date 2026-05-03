import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    // Allow our hero/spread widths so /_next/image doesn't 400 when components
    // request 2400px (default deviceSizes top out at 3840 but skip 2400).
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 2400, 3840],
    // Bypass the Next.js 16 dev image worker in development — it has a known
    // deadlock bug that hangs/returns malformed responses intermittently on
    // small source images at certain requested widths. Production (Vercel)
    // uses a separate CDN-backed image pipeline that's unaffected, so we
    // keep optimization on there.
    ...(isDev ? { unoptimized: true } : {}),
  },
};

export default nextConfig;
