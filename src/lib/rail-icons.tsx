/* ── The rail's four marks ───────────────────────────────────────────
 *
 * Lucide, drawn rather than installed. Four icons is not a dependency,
 * and the homepage half of this rail is built by pressingHomeDriver.js,
 * which has no bundler to import a React icon through — so a package
 * would have served exactly one of the two surfaces that need these.
 *
 * Every shape is written as a path, including the ones Lucide draws as
 * rect, circle and line. That way both surfaces render one <path> per
 * entry: no element-type switch, and nothing has to inject raw markup
 * into the DOM. 24x24 box, stroke 2, round caps and joins, which is
 * Lucide's own grid; at the 13px these render into, the stroke lands
 * just over a pixel, which is the weight of the 500 beside it.
 *
 * WHAT THEY REPLACED. The rail carried four geometric solids — circle,
 * square, triangle, diamond — picked because the site had no icon
 * language and four rows was not a reason to invent one. They read as
 * the legend for a chart that isn't there: they tell the rows apart
 * without saying anything about them, so the eye has to learn an
 * arbitrary key. A screen, a phone, a camera and a chair say what is
 * behind the door.
 *
 * THIS FILE IS A MIRROR. The authority is RAIL_ICONS in
 * public/lab/pressing-home.html, because the port generates the driver
 * from it and the driver is what the homepage runs.
 * `npm run rail:check` compares the two and fails the build if they
 * drift, which is the same guard the notes and the filters already
 * have. See src/data/rail-categories.ts.
 */

export const RAIL_ICONS: Record<string, string[]> = {
  /* monitor: sites, stores, platforms */
  monitor: [
    "M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
    "M8 21h8",
    "M12 17v4",
  ],
  /* smartphone: native tools and the AI products */
  smartphone: [
    "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z",
    "M12 18h.01",
  ],
  /* camera: art direction, which is shoot days */
  camera: [
    "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
    "M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  ],
  /* armchair: rooms */
  armchair: [
    "M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3",
    "M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0z",
    "M5 18v2",
    "M19 18v2",
  ],
};

/** The mark for a rail row, or null for a name nothing is drawn for. */
export function RailIcon({ name }: { name: string }) {
  const paths = RAIL_ICONS[name];
  if (!paths) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      /* currentColor, so the mark turns with the row when it floods to
         ink. The solids inherited that for free by being text. */
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
