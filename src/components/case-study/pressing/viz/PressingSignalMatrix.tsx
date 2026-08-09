import type { AIHeatmapSection } from "@/lib/types";
import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * PressingSignalMatrix — the pressing skin for `ai-heatmap`.
 *
 * Forty numbers, forty marks. One square per retailer/category cell,
 * its side proportional to the authored signal index, on a field of
 * hairline row rules. Nothing else is drawn.
 *
 * The first cut of this chart spent a twenty-square waffle on every
 * cell — eight hundred marks to carry forty values — plus a computed
 * totals column, and it read as noise at the exact scale the section
 * wants read at a glance. A waffle earns its squares when the COUNT is
 * the point (nine of ten trials, four of five stores). Here the value
 * is a relative index, so one mark sized by it says the same thing in
 * one fortieth of the ink.
 *
 * The accent is ONE square: the single strongest signal in the grid.
 * The first cut accented an entire row — forty panels, eight hundred
 * squares — which is not an accent, it is a second colour.
 *
 * Side is proportional to the index rather than area because these are
 * relative intensities on a 0–1 scale, not quantities to be summed;
 * the footnote says so rather than leaving the reader to assume area.
 * No randomness and no trig, so nothing here can drift between server
 * and client.
 */

const W = 1100;
const LEFT = 200;   // retailer labels
const RIGHT = 40;
const TOP = 96;     // first row's centre line; category labels sit above
const ROW_PITCH = 92;
const MAX_SIDE = 54;

export function PressingSignalMatrix({ section }: { section: AIHeatmapSection }) {
  const { competitors, categories, data } = section;

  const pitch = px((W - LEFT - RIGHT) / categories.length);
  const cx = (c: number) => px(LEFT + (c + 0.5) * pitch);
  const cy = (r: number) => TOP + r * ROW_PITCH;

  /* The one accented datum: the strongest single signal on the grid. */
  let accR = 0, accC = 0, best = -Infinity;
  data.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v > best) { best = v; accR = r; accC = c; }
    })
  );

  const H = cy(competitors.length - 1) + MAX_SIDE / 2 + 78;

  return (
    <div className={styles.viz}>
      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label={`Competitive signal across ${categories.length} categories for ${competitors.length} retailers. Each square is sized to its signal index. The strongest is ${competitors[accR]} in ${categories[accC]}.`}
        >
          {/* Category labels, along the top. */}
          {categories.map((cat, c) => (
            <text
              key={cat}
              x={cx(c)}
              y={TOP - MAX_SIDE / 2 - 26}
              textAnchor="middle"
              className={styles.schemLbl}
              style={c === accC ? { fill: "var(--pv-acc)" } : undefined}
            >
              {cat.toUpperCase()}
            </text>
          ))}

          {competitors.map((name, r) => {
            const y = cy(r);
            return (
              <g key={name}>
                {/* The row rule the squares sit on. Faintest ink in the
                    kit: it aligns the eye and says nothing else. */}
                <line
                  x1={LEFT - 24} y1={y} x2={W - RIGHT} y2={y}
                  stroke="var(--pp-ink)" strokeOpacity="0.08"
                />
                <text
                  x={LEFT - 44} y={y}
                  textAnchor="end" dominantBaseline="middle"
                  className={styles.schemLbl}
                  style={r === accR ? { fill: "var(--pv-acc)" } : undefined}
                >
                  {name.toUpperCase()}
                </text>

                {data[r].map((v, c) => {
                  const side = px(MAX_SIDE * v);
                  const isAcc = r === accR && c === accC;
                  return (
                    <rect
                      key={c}
                      x={px(cx(c) - side / 2)}
                      y={px(y - side / 2)}
                      width={side}
                      height={side}
                      fill={isAcc ? "var(--pv-acc)" : "var(--pp-ink)"}
                    />
                  );
                })}
              </g>
            );
          })}

          <text
            x={LEFT - 44}
            y={H - 30}
            className={styles.schemNum}
            textAnchor="start"
          >
            SQUARE SIDE PROPORTIONAL TO SIGNAL INDEX
          </text>
        </svg>
      </div>
    </div>
  );
}
