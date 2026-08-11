/**
 * The two authored palettes, lifted VERBATIM from the classic
 * components they replace (KitchenPalette.tsx, ColorPermutations.tsx).
 *
 * They live here rather than staying inside those components because
 * routing kitchen-palette and color-permutations to the pressing skin
 * makes the classic pair unreachable from any pressing study, and data
 * stranded inside an unreachable component is data waiting to drift
 * from the thing that renders it. Every hex, name and weight below is
 * the original's, unchanged — this is a move, not a re-authoring.
 */

import type { SwatchFamily } from "./PressingSwatchLedger";

/** Hill Country kitchen: eight finish families, each an ordered run. */
export const KITCHEN_FAMILIES: SwatchFamily[] = [
  {
    name: "Sage Cabinet",
    colors: ["#3D4A3A", "#4D5D44", "#5B6B52", "#6B7B62", "#7A8B72", "#8A9B82", "#9AAB92"],
    weight: 2,
  },
  {
    name: "Marble White",
    colors: ["#F5F0EB", "#EDE5DC", "#E5DDD4", "#DDD5CC", "#D5CEC7", "#CCC5BE"],
    weight: 1.5,
  },
  {
    name: "Marble Vein",
    colors: ["#A8A098", "#9A928A", "#8C847C", "#7E766E", "#B8AFA6", "#C8BFB6"],
    weight: 1.2,
  },
  {
    name: "White Oak",
    colors: ["#D4BA85", "#C4A265", "#B89E6A", "#AC9060", "#C0A870", "#D8C898", "#E8D8A8"],
    weight: 2,
  },
  {
    name: "Brass",
    colors: ["#A8893A", "#B8983A", "#9A7E3A", "#C9AA5B", "#8A7030", "#D4B86A", "#7A6228"],
    weight: 1.5,
  },
  {
    name: "Dark Walnut",
    colors: ["#4A3828", "#5A4838", "#6B5540", "#7A6545", "#3A2818", "#8A7555"],
    weight: 1,
  },
  {
    name: "Leather Tan",
    colors: ["#9A7E50", "#AA8E60", "#BA9E70", "#8A6E40", "#CAAE80"],
    weight: 0.8,
  },
  {
    name: "Rug Charcoal",
    colors: ["#3A3A3A", "#4A4A4A", "#5A5A5A", "#2A2A2A", "#6A6A6A"],
    weight: 0.8,
  },
];

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
