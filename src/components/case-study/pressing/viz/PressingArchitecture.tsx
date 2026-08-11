import styles from "./PressingViz.module.css";

/**
 * @shape voice — conforms to lab/viz-system.html
 *
 * The schematic — the pressing skin for `system-architecture`.
 *
 * What it replaces: the 6,713-node particle cloud with two legends and
 * a timeline ring. What the system actually IS: six stages on a loop
 * around the archive. So that is the whole drawing — one hairline
 * orbit, six ink dots, faint spokes to the centre, the brand's own
 * lockup in the middle, and the stack as a ruled caption line under
 * the plate. No legend: one ink needs no decoding. No accent: this
 * chart has no single datum to point at.
 *
 * Geometry is deterministic and rounded to 1/1000px — trig differs in
 * the last bits between Node's V8 and Chrome's, and an unrounded
 * coordinate is a hydration mismatch waiting to be paid for (the
 * lesson the classic component taught).
 */

const CX = 500;
const CY = 300;
const R = 208;
const LABEL_R = R + 30;

const px = (n: number) => Math.round(n * 1000) / 1000;
const polar = (r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: px(CX + r * Math.cos(rad)), y: px(CY + r * Math.sin(rad)) };
};

const STAGES = [
  "Image Capture",
  "Vision Processing",
  "Object Identification",
  "Value Estimation",
  "Archive Entry",
  "Financial Analysis",
];

const STACK =
  "Python · Streamlit · OpenAI Vision API · Supabase Auth/Storage/PostgreSQL · Vercel · Claude Code";

export function PressingArchitecture() {
  return (
    <div className={styles.viz}>
      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox="0 0 1000 600"
          width="100%"
          role="img"
          aria-label="A.R.C. system diagram: six pipeline stages on a loop around the archive"
        >
          <circle className={styles.schemOrbit} cx={CX} cy={CY} r={R} />

          {STAGES.map((name, i) => {
            const deg = i * 60;
            const dot = polar(R, deg);
            const at = polar(LABEL_R, deg);
            const cos = Math.cos(((deg - 90) * Math.PI) / 180);
            const sin = Math.sin(((deg - 90) * Math.PI) / 180);
            const anchor =
              cos > 0.35 ? "start" : cos < -0.35 ? "end" : "middle";
            /* a top label stacks up from the orbit, a bottom one down;
               the sides hang from their numeral line */
            const base = sin < -0.35 ? at.y - 18 : sin > 0.35 ? at.y + 14 : at.y - 2;
            return (
              <g key={name}>
                <line
                  className={styles.schemSpoke}
                  x1={CX}
                  y1={CY}
                  x2={dot.x}
                  y2={dot.y}
                />
                <circle className={styles.schemDot} cx={dot.x} cy={dot.y} r={3.5} />
                <text className={styles.schemNum} x={at.x} y={base} textAnchor={anchor}>
                  {"0" + (i + 1)}
                </text>
                <text className={styles.schemLbl} x={at.x} y={base + 15} textAnchor={anchor}>
                  {name}
                </text>
              </g>
            );
          })}

          <text
            className={styles.schemWordmark}
            x={CX}
            y={CY + 6}
            textAnchor="middle"
          >
            a. r. c.
          </text>
          <text className={styles.schemSub} x={CX} y={CY + 32} textAnchor="middle">
            archive ready cloud
          </text>
        </svg>
      </div>

      <div className={styles.schemStack}>
        <span className={styles.lbl}>Stack</span>
        <span className={`${styles.lbl} ${styles.grey}`}>{STACK}</span>
      </div>
    </div>
  );
}
