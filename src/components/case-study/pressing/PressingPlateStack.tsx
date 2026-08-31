"use client";

import { useEffect, useRef } from "react";
import { onTick } from "@/lib/scrub";
import { plateSizes, plateSrcSet } from "@/lib/img-srcset";
import { SectionMark } from "@/components/fx/SectionMark";
import styles from "./PressingPlateStack.module.css";

/**
 * PressingPlateStack — plates dealt onto one another. Each slab holds at
 * the same line under the masthead, so the next one arrives on top of the
 * one being held and the set reads as a deck being laid down.
 *
 * WHY THIS EXISTS RATHER THAN A ROW. A row compares by juxtaposition:
 * three marks side by side, differences read across the gap. A stack
 * compares by SUBSTITUTION — each mark lands in the rectangle the last
 * one occupied, so a change of face registers in one place. It also buys
 * size a row cannot: at a third of the page these files ran ~600 CSS px
 * against 2418 native, under half the resolution they carry.
 *
 * WHY A DRIVER AND NOT position: sticky. Sticky was the first build and
 * it does not engage in this shell for a box this tall — measured here,
 * not assumed: an identical 40px sticky div in the same slot with the
 * same offset held at the line, while the 758px slab tracked its slot
 * 1:1 and never clamped. That is the same wall PinStage hit and wrote
 * down ("Sticky refused to engage for this from either edge despite
 * correct offsets and ample room"), which is why PinStage carries a
 * transform mode at all. So this uses the house mechanism instead of
 * re-litigating the browser: one subscription to the shared rAF loop in
 * lib/scrub, which already parks itself on html[data-paused].
 *
 * The maths is sticky's own, done by hand: translate the slab down by
 * how far its slot has passed the hold line, clamped to the room the
 * slot has. Zero at rest, so the server markup and the reduced-motion
 * state are both the plain stacked layout with nothing to undo.
 */
export interface PressingPlateStackProps {
  images: {
    src: string;
    alt: string;
    /** The mark's name. */
    caption?: string;
    /** What the bucket actually holds — the second, receding line. */
    sub?: string;
    width?: number;
    height?: number;
  }[];
  mark?: { n: string; name: string };
}

export function PressingPlateStack({ images, mark }: PressingPlateStackProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const slots = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.slot}`));
    if (!slots.length) return;

    const pairs = slots
      .map((slot) => ({ slot, slab: slot.firstElementChild as HTMLElement | null }))
      .filter((p): p is { slot: HTMLElement; slab: HTMLElement } => Boolean(p.slab));

    /* ── THE HOLD LINE IS READ ONCE, NOT EVERY FRAME ─────────────────
       getComputedStyle forces a style recalculation, and this called it
       on <html> sixty times a second to fetch a number that changes
       only at a breakpoint. Read at mount and on resize instead. */
    let hold = 0;
    const readHold = () => {
      const navH =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
        ) || 54;
      /* 48 is the plate row's own rhythm. */
      hold = navH + 48;
    };
    readHold();
    window.addEventListener("resize", readHold, { passive: true });

    /* Written last frame, so a slab whose position has not moved is not
       given the same transform again. A redundant style write still
       costs the compositor a look. */
    const wrote = new WeakMap<HTMLElement, string>();

    const stop = onTick(() => {

      /* THE CLAMP IS THE WHOLE DECK, NOT THE SLOT. Clamping each slab to
         its own slot was the first build and it does not stack: a slab
         released at the end of its slot, which is exactly when the next
         one arrives, so the plates handed over one at a time and never
         overlapped. Measured that way — each held, never two at once.
         Holding every slab until the SECTION ends is what lets 2 land on
         1 and 3 on both. Later siblings paint over earlier ones by DOM
         order, so the deck reads front to back with no z-index. */
      const secBottom = root.getBoundingClientRect().bottom;

      /* ── READ EVERYTHING, THEN WRITE EVERYTHING ────────────────────
         This loop used to measure a slot and immediately write its
         slab's transform, then measure the next one. Each write
         invalidates layout, so every measurement after the first forced
         the browser to lay the page out again: three slabs meant three
         synchronous reflows per frame, which is the stutter on a phone.
         Same arithmetic, split into a read pass and a write pass, so
         the frame costs one layout instead of one per slab.

         rect for the SCROLL question (where is this on screen now),
         offsetHeight for the LAYOUT question (how tall is it). Mixing
         them up is how a driver reads its own transform back — the
         slab's rect carries the translate this loop wrote last frame,
         the slot's does not. */
      const ys: number[] = [];
      for (const { slot, slab } of pairs) {
        const slotTop = slot.getBoundingClientRect().top;
        const past = hold - slotTop;
        const room = secBottom - slab.offsetHeight - slotTop;
        ys.push(Math.max(0, Math.min(past, room)));
      }
      for (let i = 0; i < pairs.length; i += 1) {
        const { slab } = pairs[i];
        const y = ys[i];
        const next = y > 0 ? `translate3d(0, ${y.toFixed(1)}px, 0)` : "";
        if (wrote.get(slab) !== next) {
          slab.style.transform = next;
          wrote.set(slab, next);
        }
      }
    });

    return () => {
      stop();
      window.removeEventListener("resize", readHold);
      pairs.forEach(({ slab }) => {
        slab.style.transform = "";
      });
    };
  }, []);

  return (
    <section className={styles.stack} ref={rootRef}>
      {mark ? <SectionMark n={mark.n} name={mark.name} /> : null}
      {images.map((img, k) => (
        <div key={img.src} className={styles.slot}>
          <figure className={styles.slab}>
            <span className={styles.frame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                srcSet={plateSrcSet(img.src, img.width)}
                sizes={plateSizes()}
                alt={img.alt}
                width={img.width}
                height={img.height}
                /* The first slab is on screen the moment the section is,
                   and it is the one holding while the others arrive. The
                   rest are a screen of scroll apart. */
                loading={k === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </span>
            {img.caption ? (
              /* THE CAPTION SPLITS ON ITS OWN NEWLINE. The studies write
                 the bucket and what it sorts for as one string joined by
                 \n — "What's Now\nOf the moment. Trending, hot." — and
                 this rendered the whole thing into .capName, which is
                 white-space: nowrap. The newline collapsed to nothing
                 and the two ran together as "What's NowOf the moment".
                 An explicit `sub` still wins where a study sets one. */
              (() => {
                const [name, ...rest] = String(img.caption).split("\n");
                const sub = img.sub ?? rest.join(" ").trim();
                return (
                  <figcaption className={styles.cap}>
                    <span className={styles.capName}>{name}</span>
                    {sub ? <span className={styles.capSub}>{sub}</span> : null}
                  </figcaption>
                );
              })()
            ) : null}
          </figure>
        </div>
      ))}
    </section>
  );
}
