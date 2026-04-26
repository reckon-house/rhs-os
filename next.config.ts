import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow our hero/spread widths so /_next/image doesn't 400 when components
    // request 2400px (default deviceSizes top out at 3840 but skip 2400).
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 2400, 3840],
  },
};

export default nextConfig;
