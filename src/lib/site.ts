/**
 * Canonical production origin, no trailing slash.
 *
 * Defaults to the live domain. Override with NEXT_PUBLIC_SITE_URL on a
 * staging deploy if you ever want robots/sitemap/canonical URLs to point
 * somewhere other than reckon.house.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reckon.house"
).replace(/\/+$/, "");
