"use client";

/**
 * PressingPlatesPair — the two-frame composite row of the pressing
 * language, ported from .plates in public/lab/swiss-spread.html.
 *
 * Each frame takes its aspect-ratio from the source file's own pixel
 * dimensions at load, so the box is always exactly the photograph's shape
 * and --bleed (10%, in the module) stays the only crop in the system. The
 * parallax slides each image through that slack as the row crosses the
 * viewport, the two frames traveling OPPOSITE directions at the same
 * speed — one drifting block reads as a page glitch; two counter-weighted
 * ones read as a decision. The flip is indexed WITHIN the pair, not the
 * page, otherwise consecutive pairs all lean the same way and the
 * opposition disappears.
 *
 * pinForNext wraps the row in PinStage so the NEXT sibling — a rise-mode
 * PressingPlate — has a held screen to climb across. The pair is portrait
 * at column width and routinely taller than the viewport, which is the
 * exact case PinStage's transform hold exists for; its auto mode measures
 * and chooses. A mark inside a held screen barely moves, so when the row
 * is pinned the SectionMark reads its sweep from the tall wrapper div here
 * (pin plus spacer) instead of its own frozen position — that wrapper is
 * kept plain (no transform, filter, or overflow) so the hold inside it
 * keeps working.
 *
 * All scrub math is getBoundingClientRect against the viewport height, so
 * it works unchanged inside the Lenis-owned <main> scroller; the per-frame
 * reads come from the shared onTick driver, never a bare window scroll
 * listener. Reduced motion zeroes --bleed in CSS (no slack, no travel) and
 * the driver stands down per tick, clearing any transform a live setting
 * flip left behind. Below 760px the grid stacks to one column but the
 * parallax stays on — the prototype never gates it by width; it is a
 * crossing effect, not a pin.
 */

import { useEffect, useRef } from "react";
import { onTick, vh } from "@/lib/scrub";
import { PinStage } from "@/components/fx/PinStage";
import { SectionMark } from "@/components/fx/SectionMark";
import styles from "./PressingPlates.module.css";

/** Off-screen margin beyond which a frame skips its parallax write. */
const CULL = 200;

const clamp01 = (k: number) => Math.min(Math.max(k, 0), 1);

export interface PressingPlatesPairProps {
  images: {
    src: string;
    alt: string;
    /** Left-hand figcaption span ("Yellow blazer, studio"). */
    caption?: string;
    /** Right-hand figcaption span ("Spring 2024"). */
    sub?: string;
    /**
     * Intrinsic pixel size (image-dimensions manifest). The frame's
     * aspect is then correct at first layout instead of arriving with
     * the lazy image — a frame snapping open above the viewport eats
     * scroll delta and reads as a stall.
     */
    width?: number;
    height?: number;
  }[];
  /** Hold the row so the next sibling (a rise plate) can climb across it. */
  pinForNext?: boolean;
  /** Keep the PLATE_HOLD rest beat before the neighbor's climb (default true). */
  hold?: boolean;
  /** Section mark above the row; reads the pin wrapper's travel when pinned. */
  mark?: { n: string; name: string; dark?: boolean };
}

export function PressingPlatesPair({
  images,
  pinForNext = false,
  hold = true,
  mark,
}: PressingPlatesPairProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef<(HTMLElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Re-run the measurement and the driver when the image set changes; the
  // ref arrays themselves are not reactive. React nulls a removed frame's
  // callback ref, so stale slots filter out below.
  const srcKey = images.map((im) => im.src).join("|");

  /* Shape pass: each frame becomes exactly its photograph's shape. Written
     on load (or immediately for an already-complete cached image, whose
     load event React's handler would have missed). */
  useEffect(() => {
    const offs: (() => void)[] = [];
    imgRefs.current.forEach((img, i) => {
      const frame = frameRefs.current[i];
      if (!img || !frame) return;
      const shape = () => {
        if (img.naturalWidth) {
          frame.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
        }
      };
      if (img.complete) {
        shape();
      } else {
        img.addEventListener("load", shape, { once: true });
        offs.push(() => img.removeEventListener("load", shape));
      }
    });
    return () => offs.forEach((off) => off());
  }, [srcKey]);

  /* The parallax driver, verbatim from the prototype's plate-parallax
     loop: slack is measured fresh every frame (offsetHeight against the
     frame's rect), progress runs 0 → 1 across the frame's whole crossing
     of the viewport, and the odd frame runs it backwards. */
  useEffect(() => {
    const items = frameRefs.current
      .map((frame, i) => ({
        frame,
        img: imgRefs.current[i],
        // Index within the pair, not the page.
        flip: i % 2 === 1,
      }))
      .filter(
        (it): it is { frame: HTMLElement; img: HTMLImageElement; flip: boolean } =>
          it.frame !== null && it.img !== undefined && it.img !== null,
      );
    if (!items.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleared = false;

    const off = onTick(() => {
      // Checked per tick, not once at mount: the OS setting can flip with
      // the page open, and --bleed going to 0 must not strand a transform.
      if (reduce.matches) {
        if (!cleared) {
          cleared = true;
          for (const it of items) it.img.style.transform = "";
        }
        return;
      }
      cleared = false;
      // The VisibilityPause convention. The shared loop in scrub.ts already
      // parks itself on data-paused; this keeps the component correct even
      // if it is ever rewired to a driver that does not.
      if (document.documentElement.hasAttribute("data-paused")) return;

      const h = vh();
      for (const it of items) {
        const r = it.frame.getBoundingClientRect();
        if (r.bottom < -CULL || r.top > h + CULL) continue;
        // The --bleed, in px. Zero (or negative, pre-load) means no slack
        // to travel, so the image simply sits full-frame.
        const slack = it.img.offsetHeight - r.height;
        if (slack <= 0) continue;
        const p = clamp01((h - r.top) / (h + r.height));
        const k = it.flip ? 1 - p : p;
        it.img.style.transform = `translate3d(0, ${(-slack * k).toFixed(1)}px, 0)`;
      }
    });
    return () => {
      off();
      for (const it of items) it.img.style.transform = "";
    };
  }, [srcKey]);

  const row = (
    <div className={styles.plates}>
      {mark ? (
        <div className={styles.markRow}>
          <SectionMark
            n={mark.n}
            name={mark.name}
            dark={mark.dark}
            // REQUIRED when pinned: a mark inside a held screen cannot
            // drive its own sweep, so it reads the tall wrap instead.
            scrollRef={pinForNext ? wrapRef : undefined}
          />
        </div>
      ) : null}
      <div className={styles.grid}>
        {images.map((im, i) => (
          <figure key={`${im.src}-${i}`} className={styles.pairFigure}>
            <span
              className={styles.frame}
              ref={(el) => {
                frameRefs.current[i] = el;
              }}
            >
              <img
                ref={(el) => {
                  imgRefs.current[i] = el;
                }}
                src={im.src}
                alt={im.alt}
                width={im.width}
                height={im.height}
                loading="lazy"
                decoding="async"
              />
            </span>
            {im.caption ? (
              <figcaption className={`${styles.caption} ${styles.pairCap}`}>
                <span>{im.caption}</span>
                {im.sub ? <span>{im.sub}</span> : null}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </div>
  );

  if (!pinForNext) {
    return <div ref={wrapRef}>{row}</div>;
  }

  return (
    // The wrapper's height is the pin plus its spacer — the full travel the
    // SectionMark scrubs against. Plain div on purpose; see the header.
    <div ref={wrapRef}>
      <PinStage hold={hold}>{row}</PinStage>
    </div>
  );
}
