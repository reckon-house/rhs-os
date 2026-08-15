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

/** Brand name, used as the title-template suffix and openGraph siteName. */
export const SITE_NAME = "Reckon*House";

/**
 * A cover statement may carry an authored "|" marking where the plain
 * fact ends and the flavor begins; PressingCover renders the second half
 * in the recessive tone. Everywhere else — meta description, JSON-LD, the
 * ask index — wants the sentence, not the seam.
 */
export function plainStatement(s: string): string {
  return s.replace(/\s*\|\s*/g, " ").replace(/\s{2,}/g, " ").trim();
}
