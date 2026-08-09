"use client";

/**
 * PressingCarouselPlate — the pressing skin for `hero-carousel`.
 *
 * A carousel is one slot showing many pictures in turn, and the family
 * already owns a component that does exactly that: SizzleReel, which
 * cycles the cover and the pattern library. So this is not a new
 * mechanism, it is the reel at plate width with the plates' own frame
 * and mark row.
 *
 * The alternative was rendering the slides as a stack of flow plates,
 * which drops nothing but changes what the section MEANS — a carousel
 * says "these are versions of one thing", a stack says "these are
 * several things". Cycling keeps the argument.
 *
 * The box is fixed to the TALLEST slide (measured, not assumed) so the
 * page does not reflow every few seconds as slides of different shapes
 * come round. That is the pattern library's lesson, applied before it
 * costs anything.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { SizzleReel } from "@/components/fx/SizzleReel";
import { SectionMark } from "@/components/fx/SectionMark";
import styles from "./PressingPlates.module.css";
import carousel from "./PressingCarouselPlate.module.css";

export interface PressingCarouselPlateProps {
  slides: { src: string; alt: string }[];
  /** Hexes for the reel's colour beats — the study's own palette. */
  colors?: string[];
  mark?: { n: string; name: string; dark?: boolean };
  caption?: string;
}

export function PressingCarouselPlate({
  slides,
  colors,
  mark,
  caption,
}: PressingCarouselPlateProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const ratios = useRef<number[]>([]);
  const [ready, setReady] = useState(false);

  /* Reserve the tallest slide. A carousel that resizes its own box is a
     page that jumps on a timer. */
  const reserve = useCallback(() => {
    const box = boxRef.current;
    const rs = ratios.current.filter((r) => r > 0);
    if (!box || !rs.length) return;
    box.style.height = `${(box.getBoundingClientRect().width / Math.min(...rs)).toFixed(1)}px`;
  }, []);

  const key = slides.map((s) => s.src).join("|");
  useEffect(() => {
    let cancelled = false;
    ratios.current = [];
    Promise.all(
      key.split("|").map(
        (src, i) =>
          new Promise<void>((res) => {
            const im = new window.Image();
            im.onload = () => {
              ratios.current[i] = im.naturalWidth / im.naturalHeight;
              res();
            };
            im.onerror = () => res();
            im.src = src;
          })
      )
    ).then(() => {
      if (cancelled) return;
      reserve();
      setReady(true);
    });
    window.addEventListener("resize", reserve);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", reserve);
    };
  }, [key, reserve]);

  return (
    <div className={styles.plates}>
      {mark ? (
        <div className={styles.markRow}>
          <SectionMark n={mark.n} name={mark.name} dark={mark.dark} />
        </div>
      ) : null}
      <figure className={carousel.figure}>
        <div ref={boxRef} className={carousel.box}>
          {ready ? (
            <SizzleReel
              images={slides.map((s) => s.src)}
              colors={colors && colors.length ? colors : undefined}
              speed={1}
              className={carousel.reel}
            />
          ) : null}
        </div>
        {caption ? (
          <figcaption className={styles.caption}>
            <span>{caption}</span>
            <span>
              {slides.length} frame{slides.length === 1 ? "" : "s"}
            </span>
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}

export default PressingCarouselPlate;
