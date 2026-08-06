"use client";

/**
 * PressingPlate — the single full-width plate of the pressing language,
 * ported from .plate-full in public/lab/swiss-spread.html. Two modes:
 *
 * - rise: the plate climbs across its held previous sibling. The whole
 *   climb — the negative RISE pull-up, z-index 3, transparent ground, the
 *   0.95 → 1 grow and 44px → square corner scrubbed from the plate's own
 *   top edge — already lives in the RisingPlate kit component, so this
 *   mode is that component plus the optional figcaption. The section
 *   BEFORE a rise plate must actually hold for RISE of scroll (PinStage,
 *   or a sequence that pins itself); nothing here checks that, exactly as
 *   the prototype's negative margin never did.
 *
 * - flow: no climb. The whole frame at its native ratio, full column
 *   width, resting on the --pp-r corner. "Column", not viewport: a static
 *   plate keeps its corner, and a rounded corner on an image touching the
 *   viewport edges reads as a clipping bug, so only the rise mode (whose
 *   corner squares off in motion) goes full-bleed.
 *
 * The figcaption is the quiet 11px --pp-cap treatment — a footnote under
 * the picture, not a label on it. Reduced motion and sub-760px behavior
 * for the climb live in RisingPlate; the flow mode is static markup with
 * nothing to switch off.
 */

import { RisingPlate } from "@/components/fx/RisingPlate";
import styles from "./PressingPlates.module.css";

export interface PressingPlateProps {
  src: string;
  alt: string;
  /** Figcaption footnote under the plate ("Yellow blazer, studio"). */
  caption?: string;
  /** Climb over the previous pinned section instead of following in flow. */
  rise?: boolean;
  /** Load eagerly — only for a plate that can be near the fold. */
  eager?: boolean;
}

export function PressingPlate({
  src,
  alt,
  caption,
  rise = false,
  eager = false,
}: PressingPlateProps) {
  if (rise) {
    if (!caption) {
      return <RisingPlate src={src} alt={alt} eager={eager} />;
    }
    return (
      // Plain figure, margin 0 and no styling beyond it: the RisingPlate
      // section's negative top margin collapses through the wrapper, so
      // the climb geometry is identical to mounting the plate bare, and
      // nothing clips or transforms between the choreography and <main>.
      <figure className={styles.riseFigure}>
        <RisingPlate src={src} alt={alt} eager={eager} />
        <figcaption className={`${styles.caption} ${styles.riseCap}`}>
          {caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={styles.flowFigure}>
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={styles.flowImg}
      />
      {caption ? (
        <figcaption className={styles.caption}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
