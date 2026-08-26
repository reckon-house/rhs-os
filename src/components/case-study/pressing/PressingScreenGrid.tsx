import type { CSSProperties } from "react";
import { plateSrcSet } from "@/lib/img-srcset";
import { imageDimensions } from "@/data/image-dimensions";
import styles from "./PressingScreenGrid.module.css";

/**
 * PressingScreenGrid — `feature-cards` at copy-column measure.
 *
 * The narrow variant, the same move `coverage-chart` makes when a brief
 * absorbs it as PressingGapColumn: the section belongs beside the claim
 * that introduces it rather than as its own full-width block two beats
 * later.
 *
 * IT IS ALSO WHAT THE PIXELS ASK FOR. These thumbnails are 380x380, so
 * CLAUDE.md's rule puts their honest ceiling at 190 CSS pixels and says
 * anything under ~800px native belongs in a column. Four across the full
 * measure was drawing them near 340px — a 1.8x magnification of a
 * 380px file, which is exactly the soft-looking-photograph failure the
 * plate cap and the zoom slot both exist to prevent. Two up in a 380px
 * column lands them around 180px, inside the ceiling, where the file has
 * the pixels to be sharp.
 *
 * The card DESCRIPTIONS do not come with them. Four dense paragraphs
 * cannot live in a column beside the subhead they illustrate, and the
 * footnote above already names the four views. Their text is in git if
 * any of it is wanted back somewhere it can breathe.
 */

export interface PressingScreenGridProps {
  items: { image: string; title: string }[];
}

export function PressingScreenGrid({ items }: PressingScreenGridProps) {
  if (!items.length) return null;
  return (
    <div className={styles.grid}>
      {items.map((it) => {
        const dim = imageDimensions[it.image];
        return (
          <figure key={it.title} className={styles.cell}>
            <span
              className={styles.shot}
              /* The honest cap, the same backstop PressingPlate carries:
                 native ÷ 2 is the widest this file can be drawn without
                 being magnified. A future 2x export lifts it for free. */
              style={
                dim
                  ? ({ "--native": `${Math.floor(dim[0] / 2)}px` } as CSSProperties)
                  : undefined
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.image}
                srcSet={plateSrcSet(it.image, dim?.[0])}
                /* A grid of app screens: several across a column. */
                sizes="(max-width: 760px) 45vw, 22vw"
                alt={it.title}
                width={dim?.[0]}
                height={dim?.[1]}
                loading="lazy"
                decoding="async"
              />
            </span>
            <figcaption className={styles.cap}>{it.title}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}

export default PressingScreenGrid;
