import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * PressingEditorialRange — the pressing skin for `editorial-treatments`,
 * drawn in the ruled-columns shape (VIZ-PASS.md #5).
 *
 * Twenty InSite stories, one full-height hairline each, ordered quiet to
 * loud by the story's typographic intensity. The single solid block on
 * each rule is parked at that story's colour saturation, so the blocks'
 * heights read against each other across a fixed grid: type gets louder
 * left to right and colour does NOT follow it. The color stories sit in a
 * spike at mid-intensity, the theatrical four run near-monochrome at the
 * loud end. That independence is the section's whole argument, and it is
 * the thing the classic scatter buried under five hues.
 *
 * Kept verbatim from EditorialTreatments: all twenty story names, their
 * category memberships, both authored 0–1 values, and the classic's own
 * axis words (RESTRAINED / THEATRICAL, MONOCHROME / SATURATED) and
 * category labels. Nothing is rounded, extended or interpolated.
 *
 * What this deliberately does not carry over:
 * - The five category colours. Hue is not available in one ink — and it
 *   turned out not to be needed: sorted by intensity, every category
 *   falls in ONE unbroken run, so the brackets under the grid say what
 *   the colours said. The runs are found by scanning for consecutive
 *   equal categories, never by assuming a span, so an interleaved
 *   category would print two brackets rather than a false one.
 * - The eight particle halos per point and the seeded RNG that placed
 *   them. Generated density that reads as data is a fabrication in a
 *   suit, and the float strings cost the classic version a hydration
 *   mismatch every load. Every coordinate here is arithmetic through
 *   px(), rounded where it reaches the attribute.
 * - The per-category centroid markers and their spokes. A mean of five
 *   hand-set numbers is a derived shape, not an authored datum.
 * - The dashed quintile grid, the background 12×10 grid and the legend.
 *   One ink needs no decoding, so the label sits on the data.
 *
 * One reduction, named: typographic intensity survives as the rules'
 * ORDER rather than as a measured position, because the shape's rules
 * are a fixed grid. No numeral row was added under them — this shape
 * draws the rules, the labels and the blocks, and nothing else.
 *
 * No accent. VIZ-PASS assigns none: there is no single story this chart
 * exists to show, so the press red would be pointing at a favourite
 * rather than at a finding.
 */

type Cat = "designer" | "color" | "theatrical" | "minimal" | "ways";

/** The category labels, verbatim from the classic component's CATEGORIES. */
const CATEGORY_LABEL: Record<Cat, string> = {
  designer: "Designer Spotlight",
  color: "Color Story",
  theatrical: "Theatrical Type",
  minimal: "Minimalism",
  ways: "Ways to Wear",
};

interface Story {
  name: string;
  category: Cat;
  /** 0 = restrained, 1 = theatrical */
  typeIntensity: number;
  /** 0 = monochrome, 1 = saturated */
  colorSaturation: number;
}

/** The twenty stories, verbatim from EditorialTreatments' STORIES. */
const STORIES: Story[] = [
  { name: "Theyskens' Theory", category: "designer", typeIntensity: 0.55, colorSaturation: 0.28 },
  { name: "Rag & Bone", category: "designer", typeIntensity: 0.52, colorSaturation: 0.48 },
  { name: "Derek Lam", category: "designer", typeIntensity: 0.58, colorSaturation: 0.35 },
  { name: "Helmut Lang", category: "designer", typeIntensity: 0.62, colorSaturation: 0.18 },
  { name: "Kelly Wearstler", category: "designer", typeIntensity: 0.6, colorSaturation: 0.55 },

  { name: "Hot Pink", category: "color", typeIntensity: 0.42, colorSaturation: 0.95 },
  { name: "Yellow", category: "color", typeIntensity: 0.45, colorSaturation: 0.88 },
  { name: "Orange", category: "color", typeIntensity: 0.48, colorSaturation: 0.85 },
  { name: "Coral", category: "color", typeIntensity: 0.38, colorSaturation: 0.8 },
  { name: "Rainbow", category: "color", typeIntensity: 0.5, colorSaturation: 0.98 },

  { name: "The Rocker", category: "theatrical", typeIntensity: 0.92, colorSaturation: 0.2 },
  { name: "The Socialite", category: "theatrical", typeIntensity: 0.85, colorSaturation: 0.7 },
  { name: "Classic Beauty", category: "theatrical", typeIntensity: 0.88, colorSaturation: 0.15 },
  { name: "Flora Maxi", category: "theatrical", typeIntensity: 0.78, colorSaturation: 0.45 },

  { name: "Minimalism", category: "minimal", typeIntensity: 0.18, colorSaturation: 0.15 },
  { name: "Structure", category: "minimal", typeIntensity: 0.22, colorSaturation: 0.08 },

  { name: "Black Dress + Ikat", category: "ways", typeIntensity: 0.3, colorSaturation: 0.35 },
  { name: "Black Dress + Denim", category: "ways", typeIntensity: 0.28, colorSaturation: 0.22 },
  { name: "Silk Blouse + Ikat", category: "ways", typeIntensity: 0.32, colorSaturation: 0.4 },
  { name: "Silk Blouse + Denim", category: "ways", typeIntensity: 0.28, colorSaturation: 0.25 },
];

/* Quiet to loud. Two stories share 0.28, so the source index breaks the
   tie explicitly rather than leaning on sort stability. */
const ORDER: Story[] = STORIES.map((s, i) => ({ s, i }))
  .sort((a, b) => a.s.typeIntensity - b.s.typeIntensity || a.i - b.i)
  .map((e) => e.s);

/* Category runs, found by scanning — never assumed. Each is the span of
   rules a bracket may honestly claim. */
const RUNS: { label: string; from: number; to: number }[] = [];
ORDER.forEach((s, i) => {
  const open = RUNS[RUNS.length - 1];
  if (open && ORDER[i - 1].category === s.category) open.to = i;
  else RUNS.push({ label: CATEGORY_LABEL[s.category], from: i, to: i });
});

const W = 1100;
const LEFT = 124;   // the saturation scale's words live left of the grid
const RIGHT = 44;
const TOP = 44;     // the rules' top edge IS saturation 1.0
const BASE = 424;   // and their crossing of the baseline is 0
const PLOT_H = BASE - TOP;
const PITCH = (W - LEFT - RIGHT) / STORIES.length;

const LABEL_TOP = BASE + 14;  // rotated names hang from here, reading up
const RULE_BOT = 572;         // past the longest of them (19 mono chars)
const BRACKET_Y = 590;
const RUN_LBL_Y = 611;
const NOTE_Y = 638;
const H = 654;

const BLOCK_W = 22;
const BLOCK_H = 11;

/* Raw geometry. Rounding happens where a value reaches an attribute, so
   a block's edges are not derived from an already-rounded centre. */
const cx = (i: number) => LEFT + (i + 0.5) * PITCH;
const yAt = (sat: number) => BASE - sat * PLOT_H;

export function PressingEditorialRange() {
  return (
    <div className={styles.viz}>
      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="Twenty InSite stories ruled from restrained to theatrical typography, each carrying a block at its colour saturation, showing that saturation does not follow typographic intensity"
        >
          {/* The fixed grid: one full-height hairline per story. */}
          {ORDER.map((s, i) => (
            <line
              key={`rule-${s.name}`}
              x1={px(cx(i))} y1={TOP} x2={px(cx(i))} y2={RULE_BOT}
              stroke="var(--pp-ink)" strokeOpacity="0.08"
            />
          ))}

          {/* Zero on the saturation scale — the ground the blocks stand on. */}
          <line
            x1={LEFT} y1={BASE} x2={W - RIGHT} y2={BASE}
            stroke="var(--pp-ink)" strokeOpacity="0.14"
          />
          <text
            x={LEFT - 18} y={TOP}
            textAnchor="end" dominantBaseline="middle"
            className={styles.schemLbl}
          >
            SATURATED
          </text>
          <text
            x={LEFT - 18} y={BASE}
            textAnchor="end" dominantBaseline="middle"
            className={styles.schemLbl}
          >
            MONOCHROME
          </text>

          {ORDER.map((s, i) => {
            /* The label rides BESIDE its rule, not on it. Both exemplars
               centre a rotated label on its line, but their lines stop
               short of the type; a full-height rule would run straight
               through these glyphs. Material difference, so the label
               steps clear by half a block. */
            const lx = px(cx(i) + 5);
            return (
              <g key={s.name}>
                <rect
                  x={px(cx(i) - BLOCK_W / 2)}
                  y={px(yAt(s.colorSaturation) - BLOCK_H / 2)}
                  width={BLOCK_W}
                  height={BLOCK_H}
                  fill="var(--pp-ink)"
                />
                <text
                  x={lx} y={LABEL_TOP}
                  transform={`rotate(-90 ${lx} ${LABEL_TOP})`}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className={styles.schemNum}
                >
                  {s.name.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* The five categories, each an unbroken run of the sort. This
              is the position the colours used to be. */}
          {RUNS.map((r) => (
            <g key={r.label}>
              <line
                x1={px(cx(r.from))} y1={BRACKET_Y} x2={px(cx(r.to))} y2={BRACKET_Y}
                stroke="var(--pp-ink)" strokeOpacity="0.14"
              />
              <text
                x={px((cx(r.from) + cx(r.to)) / 2)} y={RUN_LBL_Y}
                textAnchor="middle" dominantBaseline="hanging"
                className={styles.schemLbl}
              >
                {r.label}
              </text>
            </g>
          ))}

          {/* Both encodings, stated once each. No legend follows from
              them: there is one ink, so there is nothing to decode. */}
          <text x={LEFT} y={NOTE_Y} className={styles.schemNum}>
            RULED BY TYPOGRAPHIC INTENSITY · RESTRAINED TO THEATRICAL
          </text>
          <text
            x={W - RIGHT} y={NOTE_Y}
            textAnchor="end"
            className={styles.schemNum}
          >
            BLOCK HEIGHT · COLOR SATURATION
          </text>
        </svg>
      </div>
    </div>
  );
}
