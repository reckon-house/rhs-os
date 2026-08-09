import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * PressingBlastMass — the pressing skin for `campaign-blast-radius`, and
 * the exemplar for the stepped-mass shape (VIZ-PASS.md).
 *
 * Every channel the Ivy Park system shipped through, ranked by asset
 * volume and drawn as ONE continuous silhouette rather than eight bars.
 * No gaps: the treads carry the comparison themselves, and the fall from
 * forty-two product-page assets to a single scrolling experience is the
 * argument the section makes.
 *
 * Type sits reversed INSIDE the mass, riding each tread at a fixed depth
 * below it. One rule governs every label and there is no exception: the
 * type is set in paper where there is ink behind it and in ink where the
 * step has run out. Only SCROLLING EXPERIENCE flips — one asset against
 * forty-two leaves nothing to reverse out of — and that flip is the
 * datum, not a layout patch.
 *
 * Kept verbatim from CampaignBlastRadius: the eight channel names, their
 * asset counts, the five visual-element names, and which elements each
 * channel carries. Rank order, the 116 total and the x-of-five tallies
 * are arithmetic on that data, not new authorship.
 *
 * Deliberately not carried over: the 400 scatter particles, the
 * ninety-two rays, the three circos tracks of generated micro-bars and
 * the rim dots — density that looked like data (the ridgeline lesson),
 * every one of it drawn by a seeded RNG whose float strings are also
 * what puts the classic version a hydration mismatch away from being
 * thrown out on load. Gone too: the #0088cc reserved for Color Product
 * (one ink here, hierarchy by opacity), the legend that blue then
 * required (with one ink there is nothing to decode), the five rotating
 * hex outlines at the hub (this study draws its own mark properly in
 * `hex-polygon`), and the "95% SOLD OUT IN DAYS" line, which is the
 * closing section's fact and belongs at exactly one altitude.
 *
 * No accent. The step shape is the whole point and no single datum
 * carries it, so the chart gets none.
 */

/** The visual system, verbatim from CampaignBlastRadius. */
const ELEMENTS = [
  "POLYGON FRAME",
  "TYPOGRAPHY",
  "B&W PHOTOGRAPHY",
  "COLOR PRODUCT",
  "MOTION / SCROLL",
];

/**
 * The channels, verbatim and in the classic component's source order —
 * asset count, and the indices of the system elements each one carries.
 */
const CHANNELS: { name: string; assets: number; elements: number[] }[] = [
  { name: "SCROLLING EXPERIENCE", assets: 1, elements: [0, 1, 2, 3, 4] },
  { name: "LAUNCH EMAILS", assets: 6, elements: [0, 1, 2, 3] },
  { name: "SOCIAL ASSETS", assets: 24, elements: [0, 1, 2, 3] },
  { name: "DIGITAL ADS", assets: 18, elements: [1, 2, 3] },
  { name: "IN-STORE DIGITAL", assets: 8, elements: [0, 1, 2] },
  { name: "PRODUCT PAGES", assets: 42, elements: [1, 3] },
  { name: "SITE PLACEMENTS", assets: 12, elements: [0, 1, 2, 3] },
  { name: "CMS COMPONENTS", assets: 5, elements: [0, 4] },
];

/* The rank is the chart's doing, not the data's — sorting a fixed array
   is deterministic, and doing it here rather than by hand keeps the
   const above a straight lift of the authored list. */
const RANKED = [...CHANNELS].sort((a, b) => b.assets - a.assets);
const TOTAL = CHANNELS.reduce((n, c) => n + c.assets, 0);
const PEAK = RANKED[0].assets;

/* Wider than the exemplars' 1100 for a material reason, not taste:
   eight columns must each hold a twenty-character channel name set
   horizontally inside the ink, and 1100 leaves SCROLLING EXPERIENCE
   touching both column edges. Everything else is the family's. */
const W = 1240;
const H = 600;
const PAD_L = 40;
const PAD_R = 40;
const BASE = 500;
const PLOT_H = 456;
const COL_W = (W - PAD_L - PAD_R) / RANKED.length;

/* Depth of each label below its own tread. The numeral leads, the name
   follows; flipped above the tread they keep the same order. */
const NUM_DY = 26;
const NAME_DY = 42;

const edgeX = (i: number) => PAD_L + i * COL_W;
const midX = (i: number) => PAD_L + (i + 0.5) * COL_W;
const topY = (assets: number) => BASE - (assets / PEAK) * PLOT_H;

/* One path, one field of ink: up the left riser, across each tread, down
   each step, and back along the baseline. Rounding happens here, at
   serialisation, so the string is identical on both engines. */
const MASS = (() => {
  const d = [`M ${px(PAD_L)} ${px(BASE)}`];
  RANKED.forEach((c, i) => {
    const y = px(topY(c.assets));
    d.push(`L ${px(edgeX(i))} ${y}`, `L ${px(edgeX(i + 1))} ${y}`);
  });
  d.push(`L ${px(W - PAD_R)} ${px(BASE)}`, "Z");
  return d.join(" ");
})();

export function PressingBlastMass() {
  return (
    <div className={styles.viz}>
      <div className={styles.head}>
        <span className={styles.lbl}>Campaign blast radius</span>
        <span className={`${styles.lbl} ${styles.grey}`}>
          {`1 visual system · ${RANKED.length} channels · ${TOTAL} assets`}
        </span>
      </div>

      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="The campaign's eight channels ranked by asset volume as one stepped silhouette, from 42 product-page assets down to the single scrolling experience"
        >
          <path d={MASS} fill="var(--pp-ink)" />

          {RANKED.map((c, i) => {
            const top = topY(c.assets);
            /* Inside iff the name still has ink under it with room to
               breathe. Nothing else decides the label's colour. */
            const inside = top + NAME_DY <= BASE - 10;
            const x = px(midX(i));
            const ink = inside ? "var(--pp-paper)" : "var(--pp-ink)";
            return (
              <g key={c.name}>
                {/* Type carries the number: the count at display weight,
                    the channel at the mono voice under it. */}
                <text
                  x={x}
                  y={px(inside ? top + NUM_DY : top - 32)}
                  textAnchor="middle"
                  fontSize={24}
                  fontWeight={500}
                  style={{
                    fill: ink,
                    letterSpacing: "-0.01em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(c.assets)}
                </text>
                <text
                  x={x}
                  y={px(inside ? top + NAME_DY : top - 12)}
                  textAnchor="middle"
                  className={styles.schemNum}
                  style={{ fill: ink }}
                >
                  {c.name}
                </text>
                {/* No element-count row here, deliberately. The classic
                    component's `elements` arrays were never drawn: they
                    only picked a ray's stroke colour
                    (CampaignBlastRadius.tsx:145). Printing their lengths
                    as "2/5" turns decorative-only metadata into a stated
                    fact, and the study's own images on this very screen
                    contradict it — the product-page shot carries the
                    polygon frame and a black-and-white portrait that the
                    array omits. Asset counts are authored and rendered
                    above; the element memberships are not a finding. */}
              </g>
            );
          })}

          <line
            x1={PAD_L}
            y1={BASE + 56}
            x2={W - PAD_R}
            y2={BASE + 56}
            stroke="var(--pp-ink)"
            strokeOpacity="0.14"
          />
          <text x={PAD_L} y={BASE + 78} className={styles.schemLbl}>
            SYSTEM ELEMENTS PER CHANNEL
          </text>
          <text
            x={W - PAD_R}
            y={BASE + 78}
            textAnchor="end"
            className={styles.schemNum}
          >
            {ELEMENTS.join(" · ")}
          </text>
        </svg>
      </div>
    </div>
  );
}
