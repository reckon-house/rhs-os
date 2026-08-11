/**
 * rings — the shared conventions for the circle form.
 *
 * The two ring charts (the intelligence wheel, the material wheel) keep
 * their OWN polar maths on purpose: one is a radial bar chart on a
 * single angular scale, the other a circos with weighted rim segments.
 * That geometry is materially different and merging it would produce a
 * component with two modes rather than one drawing. What must not drift
 * is the STROKE RECIPE — which tone means track, which means datum,
 * which means a superseded phase — because that is the thing a reader
 * uses to tell them apart, and it is now identical across both.
 *
 * The recipe, from lab/viz-system.html §01:
 *
 *   TRACK  fine, full ink. The whole circle, always drawn, so the value
 *          is read against the run it did not take. It recedes by being
 *          thin — never by fading, which is what both wheels did at 8%
 *          opacity, where the track was so nearly invisible that the
 *          arcs floated with nothing to measure against.
 *   VALUE  heavy, full ink. The datum, on the same circle as its track.
 *   DROP   heavy, grey. A phase the data HAD and no longer has — a real
 *          second data state, which is the one thing grey still means.
 *   SCALE  the ruler rings/spokes, at --pv-rule. This is the escape
 *          hatch the system allows exactly once per chart, and a polar
 *          scale earns it: there is no baseline in a circle, so without
 *          a couple of reference rays an arc length cannot be read at
 *          all. The origin ray stays fine full ink — it is where every
 *          track starts, which makes it structure, not a ruler.
 */

/** Stroke width for a ring's track and for scale rays. */
export const RING_FINE = "var(--pv-fine)";
/** The ink every ring is drawn in. One colour. */
export const RING_INK = "var(--pv-ink)";
/** A superseded phase on a ring: heavy, but grey. */
export const RING_DROP = "var(--pv-grey)";
/** The polar ruler — the system's one sanctioned faint stroke. */
export const RING_SCALE = "var(--pv-rule)";

/** Every ring starts at twelve o'clock. Both wheels already did; this
 *  is where that agreement now lives so neither can drift off it. */
export const RING_START_DEG = -90;
