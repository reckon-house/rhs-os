import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * PressingSpectrum — the pressing skin for `cabin-midcentury-spectrum`,
 * and the exemplar for the drop-line field shape (VIZ-PASS.md).
 *
 * Every element of the chalet plotted between its two poles. The DOT on
 * the axis is the datum — the authored lean, kept verbatim from the
 * classic component. The vertical hairline is only a leader from dot to
 * label, alternating above and below in three stagger tiers so eighteen
 * labels never collide; its length means nothing, and no scale runs
 * vertically to suggest it does.
 *
 * What the classic component had and this one deliberately does not:
 * the particle clouds (generated density that reads as data — the old
 * ridgeline lesson), the per-element colors (the palette lives in the
 * reel), and the seeded RNG whose float strings cost the classic
 * version a hydration mismatch on every load. Pure arithmetic through
 * px(), so server and client emit identical markup.
 *
 * One accent: the element sitting exactly between the poles — the
 * blend is the argument the section makes, and the middle is where it
 * lives.
 */

const W = 1100;
/* Tall enough that the longest rotated label clears the edge from the
   deepest tier: 184 + 6 + ~115px of 9px mono. The first cut of this
   file used 560 and clipped "16-FT GLASS DOORS" at the top edge. */
const H = 680;
const AXIS_Y = H / 2;
const PAD_X = 84;

/** The authored leans, verbatim from CabinMidCenturySpectrum. */
const ELEMENTS: { name: string; lean: number }[] = [
  { name: "RECLAIMED PNW PINE", lean: 0.04 },
  { name: "ANTLERS", lean: 0.06 },
  { name: "EXPOSED BEAMS", lean: 0.1 },
  { name: "PAINTED STONE WALL", lean: 0.12 },
  { name: "WHITE EXTERIOR RAILINGS", lean: 0.18 },
  { name: "WOVEN BENCH", lean: 0.22 },
  { name: "LEANING LADDER SHELF", lean: 0.28 },
  { name: "STRING LIGHTS", lean: 0.3 },
  { name: "WARM GRAY EXTERIOR", lean: 0.42 },
  { name: "A-FRAME GEOMETRY", lean: 0.46 },
  { name: "16-FT GLASS DOORS", lean: 0.5 },
  { name: "PNW PINE FLOORS", lean: 0.55 },
  { name: "TUFTED GRAY SOFA", lean: 0.68 },
  { name: "WALNUT COFFEE TABLE", lean: 0.74 },
  { name: "LEATHER SLING CHAIR", lean: 0.78 },
  { name: "WALNUT DINING SET", lean: 0.86 },
  { name: "TRACK LIGHTING", lean: 0.88 },
  { name: "MALM FIREPLACE", lean: 0.92 },
  { name: "SPUTNIK CHANDELIER", lean: 0.96 },
];

/** The single accented datum: closest to dead centre. */
const ACCENT = ELEMENTS.reduce((best, e) =>
  Math.abs(e.lean - 0.5) < Math.abs(best.lean - 0.5) ? e : best
);

const xAt = (lean: number) => px(PAD_X + lean * (W - PAD_X * 2));

/* Leader tiers. Elements alternate above/below the axis in source
   order, and within each side cycle three lengths, so neighbours in
   lean-order never share a tier. Layout, not data. */
const TIERS = [72, 128, 184];

export function PressingSpectrum() {
  return (
    <div className={styles.viz}>
      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="Every design element of the chalet placed on the axis from cabin bones to mid-century sensibility"
        >
          {/* The axis, with end ticks. */}
          <line
            x1={PAD_X} y1={AXIS_Y} x2={W - PAD_X} y2={AXIS_Y}
            stroke="var(--pp-ink)" strokeOpacity="0.14"
          />
          {[PAD_X, W - PAD_X].map((x) => (
            <line
              key={x}
              x1={x} y1={AXIS_Y - 5} x2={x} y2={AXIS_Y + 5}
              stroke="var(--pp-ink)" strokeOpacity="0.45"
            />
          ))}

          {ELEMENTS.map((e, i) => {
            const x = xAt(e.lean);
            const up = i % 2 === 0;
            const len = TIERS[Math.floor(i / 2) % TIERS.length];
            const yEnd = up ? AXIS_Y - len : AXIS_Y + len;
            const yLbl = up ? yEnd - 6 : yEnd + 6;
            const isAcc = e === ACCENT;
            return (
              <g key={e.name}>
                <line
                  x1={x} y1={up ? AXIS_Y - 7 : AXIS_Y + 7} x2={x} y2={yEnd}
                  stroke={isAcc ? "var(--pv-acc)" : "var(--pp-ink)"}
                  strokeOpacity={isAcc ? 0.8 : 0.14}
                />
                <circle
                  cx={x} cy={AXIS_Y} r={isAcc ? 4 : 3}
                  fill={isAcc ? "var(--pv-acc)" : "var(--pp-ink)"}
                />
                {/* Rotated mono label, reading away from the axis. The
                    class fill (grey) yields to the inline style on the
                    accent — SVG presentation attributes lose to CSS, so
                    the override must be a style, not an attribute. */}
                <text
                  x={x} y={yLbl}
                  transform={`rotate(-90 ${x} ${yLbl})`}
                  textAnchor={up ? "start" : "end"}
                  dominantBaseline="middle"
                  className={styles.schemNum}
                  style={isAcc ? { fill: "var(--pv-acc)" } : undefined}
                >
                  {e.name}
                </text>
              </g>
            );
          })}

          {/* The poles, on the axis ends. */}
          <text x={PAD_X} y={AXIS_Y + 26} textAnchor="start" className={styles.schemLbl}>
            CABIN BONES
          </text>
          <text x={W - PAD_X} y={AXIS_Y + 26} textAnchor="end" className={styles.schemLbl}>
            MID-CENTURY SENSIBILITY
          </text>
        </svg>
      </div>
    </div>
  );
}
