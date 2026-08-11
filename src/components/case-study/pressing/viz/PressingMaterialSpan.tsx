import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * @shape sticks — conforms to lab/viz-system.html
 *
 * PressingMaterialSpan — the pressing skin for `material-overlap`, and
 * the exemplar for the range-bar shape (VIZ-PASS.md).
 *
 * The three Floor & Decor rooms as rows, the thirteen materials as
 * columns, a dot where a material appears and a thick rounded bar
 * spanning its member rooms — the set-membership matrix the classic
 * Venn drew as particle clouds, redrawn as ink. The bar IS the datum:
 * which rooms share the material. Nothing else is encoded, so nothing
 * else is drawn.
 *
 * HEX MOSAIC is the one non-contiguous membership (Urban Southwest and
 * Quiet Glam without Modern Farmhouse); its connector runs thin through
 * the row it skips, dots only at its true members — the UpSet grammar
 * for exactly this case.
 *
 * The one emphasis: MARBLE, the only material in all three rooms — the
 * through-line the section's copy argues from — now carried by the pill
 * rather than the retired accent colour. Fine vs heavy carries the
 * gapped-membership distinction that dimmed ink used to; a real
 * membership never reads as a weak one.
 */

const ROOMS = ["URBAN SOUTHWEST", "MODERN FARMHOUSE", "QUIET GLAM"] as const;

/** Membership per material, verbatim from MaterialOverlap's regions. */
const MATERIALS: { name: string; rooms: number[] }[] = [
  { name: "EXPOSED BRICK", rooms: [0] },
  { name: "MATTE BLACK", rooms: [0] },
  { name: "WHITE OAK", rooms: [0] },
  { name: "POLISHED NICKEL", rooms: [0, 1] },
  { name: "SHIPLAP", rooms: [1] },
  { name: "RECLAIMED WOOD", rooms: [1] },
  { name: "MILK GLASS GLOBES", rooms: [1] },
  { name: "BRASS", rooms: [1, 2] },
  { name: "URCHIN PENDANT", rooms: [2] },
  { name: "VEINED MARBLE WALLS", rooms: [2] },
  { name: "STAR PATTERN TILE", rooms: [2] },
  { name: "HEX MOSAIC", rooms: [0, 2] },
  { name: "MARBLE", rooms: [0, 1, 2] },
];

const W = 1100;
const H = 560;
const LEFT = 214;   // room labels live left of the matrix
const RIGHT = 40;
const TOP = 190;    // rotated material labels live above it
const ROW_GAP = 96;

const colX = (i: number) =>
  px(LEFT + ((i + 0.5) * (W - LEFT - RIGHT)) / MATERIALS.length);
const rowY = (r: number) => TOP + r * ROW_GAP;

export function PressingMaterialSpan() {
  return (
    <div className={styles.viz}>
      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="Which of the three rooms each material appears in; marble is the only material in all three"
        >
          {/* Room rows: hairline rules with their labels. */}
          {ROOMS.map((room, r) => (
            <g key={room}>
              {/* the room's rule: FINE at full ink. It read at 8%
                  opacity before, which is a structure that recedes by
                  fading — the one thing the stroke scale replaces. */}
              <line
                x1={LEFT} y1={rowY(r)} x2={W - RIGHT} y2={rowY(r)}
                stroke="var(--pv-ink)" strokeWidth="var(--pv-fine)"
              />
              <text
                x={LEFT - 18} y={rowY(r)}
                textAnchor="end" dominantBaseline="middle"
                className={styles.schemLbl}
              >
                {room}
              </text>
            </g>
          ))}

          {MATERIALS.map((m, i) => {
            const x = colX(i);
            const first = Math.min(...m.rooms);
            const last = Math.max(...m.rooms);
            const gapped = last - first + 1 > m.rooms.length;
            const isDatum = m.name === "MARBLE";
            return (
              <g key={m.name}>
                {/* The span, at the heavy weight in one ink. A gapped
                    membership gets a FINE pass-through instead of the
                    full mark — the mark claims every room it covers, and
                    HEX MOSAIC must not claim the middle one. Fine and
                    heavy carry that difference now; the old version also
                    dimmed the ink, which made a real membership look
                    like a weak one. */}
                {m.rooms.length > 1 && (
                  <line
                    x1={x} y1={rowY(first)} x2={x} y2={rowY(last)}
                    stroke="var(--pv-ink)"
                    strokeWidth={gapped ? 2 : 9}
                    strokeLinecap="round"
                  />
                )}
                {m.rooms.map((r) => (
                  <circle
                    key={r}
                    cx={x} cy={rowY(r)} r={5.5}
                    fill="var(--pv-ink)"
                  />
                ))}
                {/* Rotated mono label above the matrix, reading up. */}
                <text
                  x={x} y={TOP - 26}
                  transform={`rotate(-90 ${x} ${TOP - 26})`}
                  textAnchor="start" dominantBaseline="middle"
                  className={styles.schemNum}
                >
                  {m.name}
                </text>
                {/* THE PILL, on the one material in all three rooms —
                    the through-line the section argues from, and what
                    the retired accent used to carry. */}
                {isDatum && (
                  <g>
                    <rect
                      x={px(x - 62)} y={px(rowY(2) + 26)}
                      rx={10} width={124} height={20}
                      fill="var(--pv-ink)"
                    />
                    <text
                      x={x} y={px(rowY(2) + 40)}
                      textAnchor="middle"
                      fontSize={10} fontWeight={600} letterSpacing="0.06em"
                      fill="var(--pp-paper)"
                    >
                      ALL THREE ROOMS
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
