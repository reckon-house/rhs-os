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
 * the picture, not a label on it. Reduced-motion behaviour for the climb
 * lives in RisingPlate; the flow mode is static markup with nothing to
 * switch off.
 */

import { RisingPlate } from "@/components/fx/RisingPlate";
import { plateSizes, plateSrcSet } from "@/lib/img-srcset";
import styles from "./PressingPlates.module.css";

export interface PressingPlateProps {
  src: string;
  alt: string;
  /** Figcaption footnote under the plate ("Yellow blazer, studio"). */
  caption?: string;
  /** Climb over the previous pinned section instead of following in flow. */
  rise?: boolean;
  /**
   * Flow mode only: span the full viewport instead of the content column.
   * For the big specimen plates (the Archer orange/pink board) that should
   * land as a full image beat. The corner stays — a bleed plate at rest
   * still reads as a plate, and the radius is what says so.
   */
  bleed?: boolean;
  /** Intrinsic pixel size — the ratio is known pre-load, so no reflow. */
  width?: number;
  height?: number;
  /** Load eagerly — only for a plate that can be near the fold. */
  eager?: boolean;
  /** Editorial ceiling, under the native one. See pressing.plateWidth. */
  plateWidth?: number;
  /** The shape this plate morphs to on a phone. See pressing.phoneRatio. */
  phoneRatio?: number;
}

export function PressingPlate({
  src,
  alt,
  caption,
  rise = false,
  bleed = false,
  width,
  height,
  eager = false,
  plateWidth,
  phoneRatio,
}: PressingPlateProps) {
  if (rise) {
    if (!caption) {
      return (
        <RisingPlate
          src={src}
          alt={alt}
          width={width}
          height={height}
          eager={eager}
          plateWidth={plateWidth}
          phoneRatio={phoneRatio}
        />
      );
    }
    return (
      // Plain figure, margin 0 and no styling beyond it: the RisingPlate
      // section's negative top margin collapses through the wrapper, so
      // the climb geometry is identical to mounting the plate bare, and
      // nothing clips or transforms between the choreography and <main>.
      <figure className={styles.riseFigure}>
        <RisingPlate
          src={src}
          alt={alt}
          width={width}
          height={height}
          eager={eager}
          plateWidth={plateWidth}
          phoneRatio={phoneRatio}
        />
        <figcaption className={`${styles.caption} ${styles.riseCap}`}>
          {caption}
        </figcaption>
      </figure>
    );
  }

  /* ── a plate never scales past the picture it has ────────────────
     Some assets are small — old thumbnails, app screens exported at
     772px — and a full-column plate stretched them to twice their
     pixels, which is soft on any screen and obviously soft on a
     retina one. The declared width in image-dimensions.ts is the
     honest ceiling, so the plate uses it: the image sits at the size
     it can actually carry, centred, and the column keeps the rest as
     air. Air is a thing this language already does on purpose.

     Only a real ceiling is set. A large asset has none, so nothing
     about the existing plates changes. */
  const capped = typeof width === "number" && width > 0 && width < 1400;

  return (
    // bleed spans the viewport via the shared breakout; the figure stays
    // margin-0 so nothing shifts, and the caption keeps the column's left
    // edge by taking the gutter as its own padding.
    <figure
      className={`${styles.flowFigure} ${bleed ? "hero-breakout" : ""}`}
    >
      <img
        src={src}
        /* The same <img>, told what sizes exist. src stays as the
           fallback for anything that cannot use a srcset, and for
           development, where the optimizer is deliberately off. */
        srcSet={plateSrcSet(src, width)}
        sizes={plateSizes(bleed)}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={styles.flowImg}
        style={
          plateWidth
            ? { maxWidth: `${Math.min(plateWidth, width ?? plateWidth)}px`, margin: "0 auto" }
            : capped
              ? { maxWidth: `${width}px`, margin: "0 auto" }
              : undefined
        }
      />
      {caption ? (
        // On a bleed plate the caption pads back to the page's side mat
        // (20px phone, 50px at md — main's gutter) so it keeps the column's
        // left rule instead of touching the viewport edge.
        <figcaption
          className={`${styles.caption} ${bleed ? "pl-5 md:pl-[50px]" : ""}`}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
