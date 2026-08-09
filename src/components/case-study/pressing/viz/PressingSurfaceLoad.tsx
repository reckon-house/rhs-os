import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * PressingSurfaceLoad — the pressing skin for `jeffrey-flagship-radius`,
 * drawn in the ruled-columns shape (VIZ-PASS.md).
 *
 * One hairline rule per surface of the Jeffrey flagship, on a fixed
 * grid, with the surface name riding up the top of its rule. Above the
 * baseline a solid block parks at that surface's asset count, so the
 * eye reads the eight heights against each other with nothing else
 * drawn — no gridlines, no scale, the mono numeral beside each block
 * carrying the figure. The rule then runs on BELOW the baseline through
 * six element rows, one dot wherever that surface uses that piece of
 * the visual system. Same rule, two readings: how much was built, and
 * what it was built out of.
 *
 * Verbatim from JeffreyFlagshipRadius: the eight surface names and
 * their asset counts, the six visual-system element names, and every
 * membership in the `elements` arrays. Nothing is sorted — the columns
 * stay in the order the classic authored them. That order carries no
 * stated meaning (it was angular position on a circle, `angle: 0…7`),
 * so none is claimed here; an earlier draft of this comment called it
 * "the order a customer meets them", which was invented and is not even
 * true of the sequence. Ranking them would be a different chart. The 358
 * total is summed from the counts rather than restated, so it cannot
 * drift from them.
 *
 * What the classic component had and this one deliberately does not:
 * the seeded-RNG blast rays and the 400 scatter particles (density
 * generated to look like measurement — the ridgeline lesson, and the
 * rays encoded nothing the asset numbers do not already say), the
 * arc-track histograms whose bar heights were also random, the wordmark
 * yellow and its charcoal tints (one ink here; the palette lives in the
 * reel), the rotating centre disc, and the legend, which existed only
 * to decode colours this drawing does not use.
 *
 * No accent. The section argues that one kit reached every surface, not
 * that one surface matters most, so there is no single datum for the
 * press red to sit on. An earlier draft justified that by claiming
 * Modular Grid "runs the full width of the element rows" — it does not.
 * It appears in seven of the eight surfaces; email campaigns is
 * [0, 1, 2, 4] and has no 3, and the gap is visible in the drawing. The
 * reason for no accent stands on its own without a headline that the
 * data contradicts.
 */

/** The six visual-system elements, verbatim, in authored order. */
const ELEMENTS = [
  "WORDMARK",
  "AVENIR NEXT HEAVY",
  "DEMI BOLD / CTA",
  "MODULAR GRID",
  "EDITORIAL PHOTOGRAPHY",
  "CURATORIAL VOICE",
];

/** The eight surfaces: asset counts and element memberships, verbatim. */
const SURFACES: { name: string; assets: number; elements: number[] }[] = [
  { name: "HOMEPAGE MODULES", assets: 12, elements: [0, 1, 3, 4, 5] },
  { name: "DESIGNER PAGES", assets: 38, elements: [0, 1, 2, 3, 4] },
  { name: "PRODUCT DETAIL PAGES", assets: 240, elements: [2, 3, 4] },
  { name: "EDITORIAL SPREADS", assets: 14, elements: [1, 3, 4, 5] },
  { name: "BUYING EDIT", assets: 22, elements: [3, 4, 5] },
  { name: "EMAIL CAMPAIGNS", assets: 18, elements: [0, 1, 2, 4] },
  { name: "NAVIGATION SYSTEM", assets: 6, elements: [0, 2, 3] },
  { name: "CART & CHECKOUT", assets: 8, elements: [2, 3] },
];

const TOTAL = SURFACES.reduce((n, s) => n + s.assets, 0);
const MAX = Math.max(...SURFACES.map((s) => s.assets));

const W = 1100;
/* TOP is where the tallest block parks, and everything above it is the
   rotated name: "PRODUCT DETAIL PAGES" is 20 characters of 9px mono,
   about 119px, so a shallower TOP clips it off the canvas. */
const TOP = 165;
const PLOT_H = 320;
const BASE = TOP + PLOT_H;
const LEFT = 250; // the element-row names live left of the grid
const RIGHT = 60;
const ROW0 = BASE + 52;
const ROW_GAP = 33;
const H = 744;

const SPAN = W - LEFT - RIGHT;
const colX = (i: number) => px(LEFT + ((i + 0.5) * SPAN) / SURFACES.length);
const rowY = (r: number) => ROW0 + r * ROW_GAP;
/** Linear, zero at the baseline. The scale is not compressed: seven
 *  surfaces sitting low against one at the ceiling is the true shape of
 *  an ecommerce build, and bending the axis to flatter them would be a
 *  lie about where the work went. */
const yAt = (assets: number) => px(BASE - (assets / MAX) * PLOT_H);

const BLOCK_W = 54;
const BLOCK_H = 11;

export function PressingSurfaceLoad() {
  return (
    <div className={styles.viz}>
      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="Assets built for each of the eight surfaces of the Jeffrey New York flagship, and which of the six visual-system elements each surface uses"
        >
          {/* The element rows: a faint rule each, named in the gutter. */}
          {ELEMENTS.map((name, r) => (
            <g key={name}>
              <line
                x1={LEFT} y1={rowY(r)} x2={W - RIGHT} y2={rowY(r)}
                stroke="var(--pp-ink)" strokeOpacity="0.08"
              />
              <text
                x={LEFT - 18} y={rowY(r)}
                textAnchor="end" dominantBaseline="middle"
                className={styles.schemLbl}
              >
                {name}
              </text>
            </g>
          ))}

          {/* The baseline: zero for the asset scale, and the seam
              between the two readings. */}
          <line
            x1={LEFT} y1={BASE} x2={W - RIGHT} y2={BASE}
            stroke="var(--pp-ink)" strokeOpacity="0.14"
          />
          {/* Zone captions, in the gutter, grey: they name the two
              readings, and the ink is reserved for the data. ASSETS
              rides the middle of the plot rather than the baseline —
              set next to the baseline it landed level with the
              12-asset block and read as that block's label. */}
          <text
            x={LEFT - 18} y={TOP + PLOT_H / 2}
            textAnchor="end" dominantBaseline="middle"
            className={styles.schemNum}
          >
            ASSETS
          </text>
          <text
            x={LEFT - 18} y={ROW0 - 28}
            textAnchor="end"
            className={styles.schemNum}
          >
            VISUAL SYSTEM
          </text>

          {SURFACES.map((s, i) => {
            const x = colX(i);
            const y = yAt(s.assets);
            return (
              <g key={s.name}>
                {/* The rule: one per surface, full height, fixed grid. */}
                <line
                  x1={x} y1={TOP - 22} x2={x} y2={rowY(ELEMENTS.length - 1) + 16}
                  stroke="var(--pp-ink)" strokeOpacity="0.14"
                />
                {/* The name, riding up the top of its rule. */}
                <text
                  x={x} y={TOP - 34}
                  transform={`rotate(-90 ${x} ${TOP - 34})`}
                  textAnchor="start" dominantBaseline="middle"
                  className={styles.schemNum}
                >
                  {s.name}
                </text>
                {/* The block, parked at the value. */}
                <rect
                  x={px(x - BLOCK_W / 2)} y={px(y - BLOCK_H / 2)}
                  width={BLOCK_W} height={BLOCK_H}
                  fill="var(--pp-ink)"
                />
                {/* Type carries the number: the block gives the shape,
                    the numeral gives the figure, so six and eight stay
                    readable this far down the scale. */}
                <text
                  x={px(x + BLOCK_W / 2 + 8)} y={y}
                  textAnchor="start" dominantBaseline="middle"
                  className={styles.schemNum}
                  style={{ fill: "var(--pp-ink)" }}
                >
                  {s.assets}
                </text>
                {/* Membership: a dot on the rows this surface uses,
                    nothing on the rows it does not. */}
                {s.elements.map((e) => (
                  <circle key={e} cx={x} cy={rowY(e)} r={5} fill="var(--pp-ink)" />
                ))}
              </g>
            );
          })}

          {/* The classic component's own tally, carried across. */}
          <text
            x={W - RIGHT} y={H - 12}
            textAnchor="end"
            className={styles.schemNum}
          >
            {`1 VISUAL SYSTEM · ${SURFACES.length} SURFACES · ${TOTAL} ASSETS`}
          </text>
        </svg>
      </div>
    </div>
  );
}
