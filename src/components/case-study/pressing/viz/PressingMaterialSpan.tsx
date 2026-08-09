import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
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
 * One accent: MARBLE, the only material in all three rooms — the
 * through-line the section's copy argues from.
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
              <line
                x1={LEFT} y1={rowY(r)} x2={W - RIGHT} y2={rowY(r)}
                stroke="var(--pp-ink)" strokeOpacity="0.08"
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
            const isAcc = m.name === "MARBLE";
            const ink = isAcc ? "var(--pv-acc)" : "var(--pp-ink)";
            return (
              <g key={m.name}>
                {/* The span. A gapped membership gets a hairline pass-
                    through instead of the full bar — the bar claims
                    every room it covers, and HEX MOSAIC must not claim
                    the middle one. */}
                {m.rooms.length > 1 && (
                  <line
                    x1={x} y1={rowY(first)} x2={x} y2={rowY(last)}
                    stroke={ink}
                    strokeWidth={gapped ? 1 : 9}
                    strokeOpacity={gapped ? 0.45 : isAcc ? 1 : 0.8}
                    strokeLinecap="round"
                  />
                )}
                {m.rooms.map((r) => (
                  <circle
                    key={r}
                    cx={x} cy={rowY(r)} r={5.5}
                    fill={ink}
                  />
                ))}
                {/* Rotated mono label above the matrix, reading up. */}
                <text
                  x={x} y={TOP - 26}
                  transform={`rotate(-90 ${x} ${TOP - 26})`}
                  textAnchor="start" dominantBaseline="middle"
                  className={styles.schemNum}
                  style={isAcc ? { fill: "var(--pv-acc)" } : undefined}
                >
                  {m.name}
                </text>
              </g>
            );
          })}

          {/* The one figure worth stating: the through-line. */}
          <text
            x={colX(MATERIALS.length - 1)} y={rowY(2) + 40}
            textAnchor="middle"
            className={styles.schemNum}
            style={{ fill: "var(--pv-acc)" }}
          >
            ALL THREE ROOMS
          </text>
        </svg>
      </div>
    </div>
  );
}
