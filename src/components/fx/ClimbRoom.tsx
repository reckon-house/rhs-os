/**
 * ClimbRoom — RISE of empty flow, so a RisingPlate has something to
 * cross that is not copy.
 *
 * The climb contract has two halves. A rising plate pulls itself up by
 * RISE with a negative margin; whatever sits in that RISE gets covered.
 * The cover, the zoom plate and PinStage each reserve their own room for
 * exactly this reason. A BRIEF did not, and a plate rising after one
 * covered the tail of its copy column — measured on Sally at 746px of
 * method columns hidden behind the plate. This is the brief's half of
 * the contract, kept OUT of the brief so its tuned headline/column grid
 * (whose sticky range is the column's own height) is not disturbed.
 *
 * It must switch off wherever the negative margin does — under reduced
 * motion — or it becomes a screenful of dead air with nothing climbing
 * through it. RisingPlate zeroes its margin with `motion-reduce:!mt-0`;
 * these are the matching halves, and the two must always be changed
 * together.
 *
 * The height is an inline style rather than an arbitrary Tailwind class
 * for the reason the margin is: Tailwind's JIT scanner silently drops
 * `calc()`-with-`var()` arbitrary values, and a rule that never gets
 * generated fails as a no-op that looks like correct code.
 */

import { RISE } from "@/lib/choreo";
import styles from "./ClimbRoom.module.css";

export function ClimbRoom() {
  return (
    <div
      aria-hidden="true"
      /* Two switches, same contract: reduced motion, and a phone. See
         the stylesheet for why the phone needed one. */
      className={`motion-reduce:!h-0 ${styles.room}`}
      style={{ height: RISE }}
    />
  );
}
