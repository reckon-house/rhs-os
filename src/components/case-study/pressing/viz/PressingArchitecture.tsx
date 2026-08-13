import styles from "./PressingViz.module.css";

/**
 * @shape dots — conforms to lab/viz-system.html
 *
 * The pipeline — the pressing skin for `system-architecture`.
 *
 * DOTS rather than sticks, and the distinction is the whole argument
 * below: a stick's LENGTH is a quantity, and there is no quantity here.
 * A dot's POSITION is the datum, which is the one thing this data has.
 * Same grammar as PressingSpectrum and PressingEditorialRange — a heavy
 * mark parked on a fine track — read left to right instead of down.
 *
 * IT WAS A RING AND THE RING WAS SAYING TWO UNTRUE THINGS.
 *
 * First, it claimed a cycle. Six stages sat at 60 degree intervals with
 * the wordmark in the middle, which reads as stages orbiting an archive
 * and returning to the top. The study's own copy is a line: a photo is
 * taken, vision names what it finds, objects are identified, values are
 * estimated, the item enters the archive, the total is compared against
 * a policy limit. Financial analysis does not feed back into image
 * capture. Nothing returns to the start, so nothing should close.
 *
 * Second, the geometry carried no data. Equal arcs and six identical
 * spokes to the centre are the fault PressingMCPPath names in its own
 * docblock: layout pretending to be geometry. There is no per-stage
 * quantity anywhere in the study — the stage names are hardcoded right
 * here and the section data is a type and a mark — so drawing bars
 * would have meant inventing a number, which is the worse failure.
 *
 * What is genuinely known is ORDER, so order is all this draws: one
 * fine rule, six heavy marks along it, left to right, and it stops. The
 * spacing is ordinal, not measured — the gaps say "next", never "as far
 * again". Marks are the system's heavy weight, up from the r=3.5 the
 * ring used, because §02 sizes a mark at 9px and the ring's dots were
 * quietly running under spec.
 *
 * The wordmark went with the ring. It was doing real work at the centre
 * of an orbit and has no place on a line, and the plate does not need
 * to announce the brand twice — the frame's mark already did.
 *
 * Geometry is deterministic and rounded to 1/1000px: trig differs in the
 * last bits between Node's V8 and Chrome's, and an unrounded coordinate
 * is a hydration mismatch waiting to be paid for (the lesson the classic
 * component taught).
 */

const W = 1000;
const Y = 96;
/* Insets leave the end labels room to centre under their own marks
   rather than hanging off the plate. */
const X0 = 92;
const X1 = 908;

const px = (n: number) => Math.round(n * 1000) / 1000;

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
  const step = (X1 - X0) / (STAGES.length - 1);

  return (
    <div className={styles.viz}>
      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} 168`}
          width="100%"
          role="img"
          aria-label="A.R.C. pipeline: six stages in order, image capture through financial analysis"
        >
          {/* the path, drawn once and ending where the work ends */}
          <line
            className={styles.schemPath}
            x1={X0}
            y1={Y}
            x2={X1}
            y2={Y}
          />

          {STAGES.map((name, i) => {
            const x = px(X0 + step * i);
            return (
              <g key={name}>
                <circle className={styles.schemDot} cx={x} cy={Y} r={4.5} />
                <text className={styles.schemNum} x={x} y={Y - 26} textAnchor="middle">
                  {"0" + (i + 1)}
                </text>
                <text className={styles.schemLbl} x={x} y={Y + 30} textAnchor="middle">
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.schemStack}>
        <span className={styles.lbl}>Stack</span>
        <span className={`${styles.lbl} ${styles.grey}`}>{STACK}</span>
      </div>
    </div>
  );
}

export default PressingArchitecture;
