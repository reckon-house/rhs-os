/**
 * Case-study theme colors.
 *
 * Used by the NavRail sweep loader to tint the bar with a hint of the
 * destination's brand. Colors are intentionally LIGHTER picks from each
 * project's palette — the sweep is rendered at low opacity with mix-blend-mode
 * overlay, so a too-dark color reads as muddy. Lighter accent / cream / blush
 * tones tint cleanly against the cream navbar backdrop.
 *
 * When adding a new case study, pick the lightest meaningful color from its
 * marks-materials palette (cream, blush, light tan, etc.).
 *
 * Default fallback (`__default__`) is used for the homepage and any unmatched route.
 */
export const CASE_STUDY_THEMES: Record<string, string> = {
  // Default — light grey for routes without a specific theme (homepage, category pages).
  __default__: "#A0A0A0",

  // ── New case studies (built this session, palettes known) ──
  "capitan-boot-co": "#C4B594", // warm tan (lighter than the dark olive primary)
  "amber-shockey-co": "#D87A82", // blush (lighter accent vs the cobalt)
  "cosmo-prof": "#F4D9DC", // signature blush
  "hill-country-oak": "#ECC265", // mustard (lighter than the burnt orange)
  "fairview-sitting": "#C4B5A0", // soft stone (lighter than the antiqued brass)

  // ── Existing case studies — lightest meaningful palette pick per project ──
  arc: "#D4D4A8", // lighter sage
  sally: "#D4D4D0", // light platform grey
  "robert-rodriguez": "#F4C9A0", // soft peach
  "black-white-type": "#D4D4D4", // light grey
  "hill-country-kitchen": "#D8C8A8", // light warm stone
  "hill-country-bath": "#C8D2C4", // light sage
  "fairview-suite": "#D8B888", // light warm wood
  "ivy-park": "#E8A5A5", // light coral
  "j-christianson": "#B8C4D4", // light steel blue
  "nordstrom-beauty": "#E8D4BD", // light warm beige
  "neiman-marcus": "#E8A88A", // light coral
  "loved-by-nordstrom": "#D8BFA0", // light tan
  "branding-graphics": "#C8C8C8", // light neutral
  "nordstrom-personalization": "#C8C8C8", // light anthracite
};

/**
 * Look up the theme color for a given pathname.
 * Returns the default color if no match (or if pathname is the homepage).
 */
export function themeColorFor(pathname: string): string {
  const match = pathname.match(/^\/case-studies\/([^/?#]+)/);
  if (!match) return CASE_STUDY_THEMES.__default__;
  return CASE_STUDY_THEMES[match[1]] ?? CASE_STUDY_THEMES.__default__;
}
