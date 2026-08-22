import type { CSSProperties } from "react";
import { imageDimensions } from "@/data/image-dimensions";
import styles from "./PressingMarkGrid.module.css";

/**
 * PressingMarkGrid — a multi-image section dealt as LOGOS rather than
 * as plates.
 *
 * A plate row is right for photographs: each frame keeps its own ratio,
 * and the differences between them are information. A logo's ratio is
 * not information. It is how tightly somebody cropped the artboard, and
 * letting it drive the layout is what left the five marks in the
 * branding study at five different heights, leaning down the page with
 * two stranded off on their own line.
 *
 * So the cell holds still and the mark sits inside it. One shape, one
 * mat, contained rather than cropped, and the range across the five is
 * legible because nothing else varies.
 *
 * IT IS A SKIN, NOT A SECTION TYPE, exactly like `stack` above it in
 * PressingLayout: the study keeps its triple-image and dual-image
 * sections, the classic renderer keeps rendering them as rows if the
 * study is ever un-flipped, and port-audit gains no unskinned type to
 * warn about.
 *
 * THE MARKS ARE WHITE JPEGS. Every one of these five is pure 255 to the
 * corners, so they are multiplied onto the mat rather than laid on it.
 * See the module CSS for why that also forces a clip-path.
 */

export interface PressingMarkGridProps {
  images: { src: string; alt: string; caption?: string }[];
}

export function PressingMarkGrid({ images }: PressingMarkGridProps) {
  if (!images.length) return null;

  /* Four across is the ceiling. Five marks would each land near 260px
     inside the measure, which is under what the finer ones survive, and
     a row of five reads as a client-logo strip rather than as work. */
  const cols = Math.min(images.length, 4);

  return (
    <div className={styles.grid} data-cols={cols}>
      {images.map((img) => {
        const dim = imageDimensions[img.src];
        return (
          <figure key={img.src} className={styles.cell}>
            <span className={styles.mat}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.mark}
                src={img.src}
                alt={img.alt}
                width={dim?.[0]}
                height={dim?.[1]}
                loading="lazy"
                decoding="async"
                /* The honest cap, the same backstop every plate carries:
                   native ÷ 2 is the widest this file can be drawn
                   without being magnified. hey-SD is 557px wide, so it
                   stops at 278 and centres in its mat with air rather
                   than being blown up to fill it. */
                style={
                  dim
                    ? ({ "--native": `${Math.floor(dim[0] / 2)}px` } as CSSProperties)
                    : undefined
                }
              />
            </span>
            {img.caption ? (
              <figcaption className={styles.cap}>{img.caption}</figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}

export default PressingMarkGrid;
