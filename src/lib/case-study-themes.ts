/**
 * Case-study theme colors.
 *
 * The navigation loader bar uses these to color-match the destination case study,
 * giving a subtle "you're entering this brand's world" feel during page transitions.
 *
 * Source of truth: each case study's primary palette color (typically pulled from
 * the marks-materials section). When adding a new case study, add an entry here.
 *
 * Default fallback (`__default__`) is used for the homepage and any unmatched route.
 */
export const CASE_STUDY_THEMES: Record<string, string> = {
  // Default — used on routes without a specific theme (homepage, category pages).
  __default__: "#141414",

  // ── New case studies (built this session, palettes known) ──
  "capitan-boot-co": "#2A2A1A", // dark olive
  "amber-shockey-co": "#1F4D78", // cobalt
  "cosmo-prof": "#000000", // sharp black
  "hill-country-oak": "#DA8849", // burnt orange

  // ── Existing case studies — sensible defaults pulled from each project's palette ──
  arc: "#B1BC94", // sage primary
  sally: "#2C2C2C", // platform charcoal
  "robert-rodriguez": "#C44A2D", // editorial orange
  "black-white-type": "#000000", // black
  "hill-country-kitchen": "#7A6B58", // warm stone
  "hill-country-bath": "#9DA89E", // sage stone
  "fairview-suite": "#7B5C3A", // warm wood
  "ivy-park": "#8A1F1F", // deep red
  "j-christianson": "#1E2733", // navy
  "nordstrom-beauty": "#C4A187", // warm beige
  "neiman-marcus": "#A52A2A", // editorial red
  "loved-by-nordstrom": "#9F7E5C", // tan
  "branding-graphics": "#3A3A3A", // neutral
  "nordstrom-personalization": "#1E1E1E", // anthracite
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
