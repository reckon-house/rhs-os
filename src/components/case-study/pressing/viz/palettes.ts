/**
 * The two authored palettes, lifted VERBATIM from the classic
 * components they replace (KitchenPalette.tsx, ColorPermutations.tsx).
 *
 * They live here rather than staying inside those components because
 * routing kitchen-palette and color-permutations to the pressing skin
 * makes the classic pair unreachable from any pressing study, and data
 * stranded inside an unreachable component is data waiting to drift
 * from the thing that renders it.
 *
 * J. Christianson is a verbatim move. The KITCHEN palette is NOT: its
 * values were re-sourced from the study's own photographs, for the
 * reasons set out above that list.
 */

import type { SwatchFamily } from "./PressingSwatchLedger";

/**
 * Hill Country kitchen: the four finishes, sampled.
 *
 * WHAT THIS REPLACED, because the failure is instructive. The previous
 * version carried eight families and forty-nine hexes under a header
 * reading "the palette, as specified", in a study whose entire thesis is
 * four finishes ("Lock the palette to four, let the constraint become
 * the aesthetic"). The material wheel on the same page prints "4
 * finishes · 15 surfaces"; the ledger printed "8 families · 49 values".
 * Two charts, one page, contradicting each other, and the one claiming
 * a specification was the one disagreeing with the copy.
 *
 * The hexes were not specified either. They were arithmetic ramps:
 * Rug Charcoal stepped by exactly (16,16,16) four times with every value
 * neutral to the byte, and Leather Tan did the same from a different
 * anchor. They existed in the circos drawing this inherited from only to
 * tint randomly scattered particles, where nobody could read one.
 *
 * These four are MEASURED. k-means over the 77 palette values that
 * scripts/build-vision.mjs observed across the study's 16 photographs
 * returns five clusters; four of them land on the four named finishes
 * and the fifth is the dark-stained dining table, which is furniture
 * rather than a finish. Frame counts are the cluster sizes, so a value
 * here is "what this material actually reads as across the room", not a
 * swatch anybody picked.
 *
 * NO WEIGHT FIELD. The old numerals rode a column labelled PRESENCE,
 * which was the circos drawing's arc-sizing parameter wearing a label:
 * its only consumer was `span = (f.weight / totalWeight) * availableAngle`.
 * Nothing in the repo ever defined it, the study authors no per-material
 * quantity, and project-facts.json carries stats: [] for this project.
 */
export const KITCHEN_FAMILIES: SwatchFamily[] = [
  { name: "Sage Green", colors: ["#514F3D"] },
  { name: "Raw White Oak", colors: ["#C0A67F"] },
  { name: "Calacatta Marble", colors: ["#E1D9C9"] },
  { name: "Unlacquered Brass", colors: ["#9B7D4C"] },
];

/** One finish, with the share it holds and the range it reads across. */
export interface FinishRing {
  name: string;
  /** cluster size: how many observed palette values fell to this finish */
  n: number;
  /** the trimmed extremes of that cluster, darkest and lightest */
  dark: string;
  light: string;
}

/**
 * The same four finishes with the quantity the ledger form could not
 * carry: how much of the room each one accounts for.
 *
 * WHY THIS EXISTS. Every other chart in the kit draws a quantity, and
 * the palette chart had none, which is the structural reason it read as
 * a foreign object next to the rest. Its old right-hand column was the
 * circos drawing's arc-sizing parameter relabelled PRESENCE, so deleting
 * that correctly left four rows of colour measuring nothing.
 *
 * `n` is a real share: cluster size from k-means over the 77 palette
 * values scripts/build-vision.mjs recorded across this study's 16
 * photographs. `dark` and `light` are that cluster's extremes, so an
 * arc's gradient shows the range the material actually reads across
 * rather than a ramp anybody typed. The brass range is the study's own
 * copy made visible: unlacquered brass "darkens at the touchpoints and
 * stays bright where hands don't reach".
 *
 * TRIMMED AT 1.6x the cluster's median distance from its centroid.
 * Untrimmed, k-means in RGB pulled a warm brown (#5B3722) into the sage
 * cluster and its gradient ran brown to olive, which is a lie about the
 * finish. Nine values dropped across the four.
 *
 * REGENERATE with `npm run palette-rings`, which recomputes from the
 * vision index and prints these numbers. If a photograph is added or
 * re-read, run it and paste the result rather than adjusting by eye.
 */
export const KITCHEN_RINGS: FinishRing[] = [
  { name: "Sage Green",        n: 22, dark: "#41442A", light: "#5A6252" },
  { name: "Raw White Oak",     n: 21, dark: "#A6937D", light: "#D5B47F" },
  { name: "Unlacquered Brass", n: 12, dark: "#815E3D", light: "#B0913F" },
  { name: "Calacatta Marble",  n: 12, dark: "#DAD1CA", light: "#EFE9DF" },
];

/** Frames the shares were read from, printed under the chart as its source. */
export const KITCHEN_RINGS_FRAMES = 16;

/** J. Christianson: six named brand colours, one value each. No weight
 *  was ever authored for these, so none is printed. */
export const JC_PALETTE: SwatchFamily[] = [
  { name: "Brown", colors: ["#5C4A2A"] },
  { name: "Olive", colors: ["#8B9A3B"] },
  { name: "Yellow", colors: ["#E8C840"] },
  { name: "Orange", colors: ["#D4883A"] },
  { name: "Rust", colors: ["#C85A3A"] },
  { name: "Teal", colors: ["#6BA5A0"] },
];
