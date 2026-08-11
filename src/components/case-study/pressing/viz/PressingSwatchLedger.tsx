"use client";

import { useRef, type CSSProperties } from "react";
import { useVizArrival, useReadingHead, VIZ_STAGGER_MS } from "@/lib/viz-motion";
import styles from "./PressingViz.module.css";

/**
 * @shape voice — conforms to lab/viz-system.html
 *
 * PressingSwatchLedger — the one place colour survives.
 *
 * Every other chart in the kit is one ink because hue there would be
 * decoration standing in for a quantity. These two sections are the
 * exception the system names out loud: their SUBJECT is colour, so the
 * hue IS the datum, and dropping it would leave a palette chart that
 * cannot show its palette. The rule that keeps that from being a
 * loophole is REAL HUES ON INK BONES — structure, rules, labels and
 * numerals stay ink on paper at the stroke scale, and the only coloured
 * marks on the page are the swatches themselves.
 *
 * It replaces two classic circos drawings (kitchen-palette,
 * color-permutations) whose colour was wrapped in seeded-RNG particle
 * fields, ribbon connections and rotating arc tracks — density
 * generated to look like measurement, which is the fabrication the kit
 * exists to refuse. What the data actually holds is a set of named
 * families, each with an ordered run of hexes. So that is what it
 * draws: one ruled row per family, the run laid out left to right at
 * full size, the hex printed under its own swatch.
 *
 * A family's `weight` is authored where the section has one, and it is
 * NOT drawn as a bar — the classic used it as an arc's angular size,
 * which is a comparison the copy never makes. It rides as a numeral in
 * the row's own ledger column, where a reader can use it without the
 * chart claiming a ranking.
 *
 * Arrival wipes each run in from the left on the shared curve, staggered
 * down the rows. The reading head walks the family names when there are
 * few enough of them to walk — labels lift, swatches never move.
 */

export interface SwatchFamily {
  name: string;
  colors: string[];
  /** optional authored weight; printed, never drawn as a bar */
  weight?: number;
}

export interface PressingSwatchLedgerProps {
  label: string;
  families: SwatchFamily[];
  /** what the right-hand ledger numeral means, if a weight is given */
  weightLabel?: string;
}

export function PressingSwatchLedger({
  label,
  families,
  weightLabel = "WEIGHT",
}: PressingSwatchLedgerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);
  const head = useReadingHead(ref, families.length);

  const totalSwatches = families.reduce((n, f) => n + f.colors.length, 0);

  return (
    <div className={styles.viz} ref={ref}>
      <div className={styles.head}>
        <span className={styles.lbl}>{label}</span>
        <span className={`${styles.lbl} ${styles.grey}`}>
          {`${families.length} families · ${totalSwatches} values`}
        </span>
      </div>

      <div className={styles.swLedger}>
        {families.map((f, i) => (
          <div className={styles.swRow} key={f.name}>
            <span
              className={`${styles.lbl} ${styles.walk} ${
                head === i ? styles.walkOn : ""
              }`}
            >
              {f.name}
            </span>

            <span
              className={styles.swRun}
              style={
                {
                  "--lag": `${((i * VIZ_STAGGER_MS * 3) / 1000).toFixed(2)}s`,
                  clipPath: drawn ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                } as CSSProperties
              }
            >
              {f.colors.map((c) => (
                <span className={styles.swCell} key={c}>
                  {/* the ONE coloured mark on the page */}
                  <span
                    className={styles.swChip}
                    style={{ background: c }}
                    aria-hidden="true"
                  />
                  <span className={`${styles.mono} ${styles.swHex}`}>{c}</span>
                </span>
              ))}
            </span>

            {f.weight != null ? (
              <span className={styles.swWeight}>
                <span className={styles.mono}>{f.weight}</span>
                <span className={`${styles.lbl} ${styles.grey}`}>
                  {weightLabel}
                </span>
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PressingSwatchLedger;
