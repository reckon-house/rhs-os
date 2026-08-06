"use client";

import { useEffect, useRef, type RefObject } from "react";
import { onTick, reducedMotion, vh } from "@/lib/scrub";
import styles from "./sectionmark.module.css";

/**
 * A section mark: a numbered disc beside a name, its sweep scrubbed by the
 * scroll. The disc is one stroked SVG circle whose dash offset the driver
 * winds every frame from the mark's own position on screen — the geometry
 * trick lives in sectionmark.module.css, the mapping from position to
 * offset lives here.
 *
 * The offset runs +C -> 0 -> -C and never back the way it came. Reversing
 * rewinds the sweep, which reads as a mistake being undone; carrying on in
 * the same direction empties the disc by completing a second revolution.
 * The dash pattern does both: at +C the gap sits under the path, at 0 the
 * dash covers it, and at -C the pattern has advanced far enough that the
 * gap is under it again.
 *
 * It holds at full across the middle third of the viewport. A knife-edge
 * peak at dead centre reads as a glitch — the disc would be whole for a
 * single frame. Below that it eases rather than ramps, so the sweep
 * accelerates away from empty instead of crawling.
 *
 * Position is read per frame through onTick from the shared scrub driver,
 * never a bare window scroll listener — the document here never scrolls
 * (Lenis owns <main>), so window scroll events without capture never fire.
 * The driver also owns the html[data-paused] freeze; this component only
 * subscribes and so pauses with it.
 */

/** The dash, a hair over the 40.84 circumference, so it closes on itself. */
const C = 41;
/** Half-width of the full-fill plateau, as a share of the screen. */
const P = 0.17;

const clamp01 = (k: number) => (k < 0 ? 0 : k > 1 ? 1 : k);
const smooth = (k: number) => k * k * (3 - 2 * k);

interface SectionMarkProps {
  /** The number as authored, e.g. "02". A single leading zero is dropped
   *  in the disc ("04" renders as 4) — two digits do not fit at 8.5px. */
  n: string;
  name: string;
  /** On dark grounds the disc runs paper-on-ink and the numeral ramp
   *  inverts. A prop, not runtime blend detection: the component cannot
   *  reliably know what it is sitting on. */
  dark?: boolean;
  /** A mark inside a pinned/sticky screen barely moves — it is pinned —
   *  so its own position on screen cannot drive anything. Pass the wrap
   *  the sticky travels through and progress is read from that instead. */
  scrollRef?: RefObject<HTMLElement | null>;
}

export function SectionMark({ n, name, dark = false, scrollRef }: SectionMarkProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const numRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const circle = circleRef.current;
    const num = numRef.current;
    if (!root || !circle || !num) return;

    let last = -999;

    return onTick(() => {
      /* Reduced motion gets the finished mark, not a frozen half-sweep:
         disc full, numeral in its resting colour. Checked per tick — the
         kit convention — so a mid-session OS flip lands immediately in
         both directions instead of freezing whatever state was current.
         The stylesheet states the same values under the media query, so
         these writes only repeat what CSS already guarantees. */
      if (reducedMotion()) {
        if (last !== 0) {
          last = 0;
          circle.style.strokeDashoffset = "0";
          num.style.color = dark ? "#000" : "#fff";
        }
        return;
      }
      const h = vh();
      let y: number;
      const wrap = scrollRef?.current;
      if (wrap) {
        // Pinned: read the wrap's travel instead, and flip it so the two
        // sources agree — a wrap runs 0 to 1 downward, a screen position 1 to 0.
        const wr = wrap.getBoundingClientRect();
        y = 1 - clamp01(-wr.top / Math.max(1, wr.height - h));
      } else {
        const r = root.getBoundingClientRect();
        y = (r.top + r.height / 2) / h; // 1 at the bottom, 0 at top
      }

      let off = C;
      let fill = 0;
      if (y <= 1.1 && y >= -0.1) {
        if (y > 0.5 + P) {
          const k = smooth(clamp01((y - (0.5 + P)) / (0.5 - P)));
          off = C * k;
          fill = 1 - k;
        } else if (y < 0.5 - P) {
          const k = smooth(clamp01((0.5 - P - y) / (0.5 - P)));
          off = -C * k;
          fill = 1 - k;
        } else {
          off = 0;
          fill = 1;
        }
      }

      if (Math.abs(off - last) < 0.15) return; // skip no-op writes
      last = off;
      circle.style.strokeDashoffset = off.toFixed(2);
      // Ink on paper while the disc is empty, paper on ink once it is full —
      // and the other way round on dark grounds, where the disc is the light one.
      const v = Math.round((dark ? 1 - fill : fill) * 255);
      num.style.color = `rgb(${v},${v},${v})`;
    });
  }, [dark, scrollRef]);

  return (
    <span ref={rootRef} className={dark ? `${styles.lbl} ${styles.dark}` : styles.lbl}>
      <span className={styles.mark}>
        <svg viewBox="0 0 26 26" aria-hidden="true">
          {/* r is half the visible radius and the stroke covers the rest, so
              winding the dash offset wipes the whole disc round like a hand. */}
          <circle ref={circleRef} cx="13" cy="13" r="6.5" />
        </svg>
        <i ref={numRef}>{n.replace(/^0/, "")}</i>
      </span>
      <span className={styles.name}>{name}</span>
    </span>
  );
}
