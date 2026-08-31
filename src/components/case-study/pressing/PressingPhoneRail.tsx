"use client";

/* ── PressingPhoneRail ──────────────────────────────────────────────
 * The phone's section furniture, in two states.
 *
 * CLOSED it is a label on the bottom edge naming the section you are
 * inside — see the stylesheet for why that exists and why it is fixed
 * rather than sticky.
 *
 * OPEN it is the way through the study. A case study runs 40,000px on
 * a phone and the only way to reach the middle of one was to scroll
 * there, which is why the label alone only half answered "what am I
 * scrolling into": it says where you ARE and nothing about where you
 * could go. Tapping it raises a row of the study's sections, each with
 * the first picture from that section, scrolled sideways. Tap one and
 * the panel closes and the page travels there.
 *
 * HOW IT KNOWS THE SECTIONS. PressingLayout drops a zero-height marker
 * at every section-header carrying that header's label, title and the
 * section's first picture. This reads the markers' positions on the
 * shared scrub tick for the closed label, and reads the whole list when
 * it opens. No wrapper, no observer per section, and nothing between
 * the choreography and <main>.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { CHOREO_BREAKPOINT } from "@/lib/choreo";
import { onTick, reducedMotion } from "@/lib/scrub";
import { getLenis } from "@/lib/lenis";
import styles from "./PressingPhoneRail.module.css";

/** The attribute PressingLayout stamps on each marker. */
export const MARK_ATTR = "data-pressing-mark";

/* The MARKER, not a number. An offset measured when the panel opened is
   stale by the time it is used: a study is 40,000px of lazy images, and
   every one that loads between the tap and the arrival moves everything
   below it. Holding the element means the position can be asked for at
   the moment it is needed, and asked again after landing. */
type Stop = { n: string; name: string; thumb: string; el: HTMLElement };

/* The authored label is one string, "SECTION 03: SCHEDULING BY CHAT".
   Split on the first colon so the numeral and the name can be set
   differently; a label with no colon is all name. */
function split(label: string): [string, string] {
  const at = label.indexOf(":");
  if (at === -1) return ["", label.trim()];
  return [
    label
      .slice(0, at)
      .replace(/^section\s*/i, "")
      .trim(),
    label.slice(at + 1).trim(),
  ];
}

export function PressingPhoneRail() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState<{ n: string; name: string } | null>(
    null,
  );
  const [open, setOpen] = useState(false);
  const [stops, setStops] = useState<Stop[]>([]);
  /* IT ARRIVES WITH THE FIRST SECTION and leaves the same way. Two
     wrong versions came before this one. It used to be held off until a
     header passed AND then only ever named that header, which was
     right; then it was armed on mount, which put a navigator over the
     cover — the one screen that already names the study in full, in
     84pt type, above a reel of its own pictures.

     What the cover, the abstract and the opening plate have in common
     is that none of them is a section, so there is nothing for the bar
     to say while they are on screen. Past the first header there always
     is. Scrolling back up above it takes the bar away again, on the
     same line and the same 0.28s. `current` already tracks exactly this
     — see the tick below — so the arrival needs no second signal. */

  /* Read the markers into a list, with where each one sits in the page.
     Measured at the moment of opening rather than kept in sync: the
     page's own height moves while images load, and a stale offset sends
     the reader to the wrong place. */
  const readStops = useCallback(() => {
    const out: Stop[] = [];
    document.querySelectorAll<HTMLElement>(`[${MARK_ATTR}]`).forEach((m) => {
      const [n, name] = split(m.dataset.label || "");
      out.push({
        n,
        name: name || m.dataset.title || "",
        thumb: m.dataset.thumb || "",
        el: m,
      });
    });
    setStops(out);
  }, []);

  useEffect(() => {
    if (!railRef.current) return;
    let lastKey = "";

    const stop = onTick(() => {
      if (window.innerWidth > CHOREO_BREAKPOINT) {
        if (lastKey !== "") {
          lastKey = "";
          setCurrent(null);
        }
        return;
      }
      const marks = document.querySelectorAll<HTMLElement>(`[${MARK_ATTR}]`);
      if (!marks.length) return;

      /* THE LINE IS NOT THE BAR. The bar sits on the bottom edge, and
         keying off its own box would make a section "current" the moment
         its header appeared from below — naming a thing before the reader
         has reached it. You are inside a section once its header has gone
         past you, so the line stays at the top of the reading area: the
         underside of the masthead. */
      const nav = document.getElementById("nav");
      const line = nav ? nav.getBoundingClientRect().bottom : 54;
      let found: HTMLElement | null = null;
      for (const m of marks) {
        if (m.getBoundingClientRect().top <= line) found = m;
        else break;
      }

      const key = found ? `${found.dataset.label}|${found.dataset.title}` : "";
      if (key === lastKey) return;
      lastKey = key;
      if (!found) {
        setCurrent(null);
        return;
      }
      const [n, name] = split(found.dataset.label || "");
      setCurrent({ n, name: name || found.dataset.title || "" });
    });
    return stop;
  }, []);

  /* Escape closes it, the way any disclosure over the page should. */
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);

  const toggle = () => {
    if (!open) readStops();
    setOpen((v) => !v);
  };

  /* Close first, then travel. Lenis owns <main>, so the page has to be
     moved through the instance: writing main.scrollTop looks like it
     works and is snapped back on the next frame. */
  const goTo = (el: HTMLElement) => {
    setOpen(false);
    const main = document.querySelector("main");
    const nav = document.getElementById("nav");
    const navH = nav ? nav.getBoundingClientRect().height : 54;
    const still = reducedMotion();

    /* Measured at the tap, not at the open. */
    const aim = () =>
      Math.max(
        0,
        (main ? main.scrollTop : 0) +
          el.getBoundingClientRect().top -
          navH -
          12,
      );

    const travel = (to: number, immediate: boolean) => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(to, { immediate });
      else main?.scrollTo({ top: to });
    };

    travel(aim(), still);

    /* AND CORRECT ON ARRIVAL. Ten thousand pixels of travel through a
       page whose images are still arriving means the destination has
       moved by the time it is reached: measured on DSC, a jump to the
       owner console landed 930px short because the sections above it
       grew on the way. One re-measure after the scroll settles, and
       only when it is off by more than a nudge, so an accurate landing
       is never jostled. */
    window.setTimeout(
      () => {
        const to = aim();
        if (Math.abs(to - (main ? main.scrollTop : 0)) > 24) travel(to, true);
      },
      still ? 60 : 1150,
    );
  };

  return (
    <>
      {/* The ground behind an open panel. It takes the tap that closes
          it, which is the gesture every sheet on a phone answers to. */}
      <div
        className={styles.scrim}
        {...(open ? { "data-on": "" } : {})}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        ref={railRef}
        className={styles.rail}
        {...(current || open ? { "data-on": "" } : {})}
        {...(open ? { "data-open": "" } : {})}
      >
        {/* The label IS the control. A separate affordance beside it
            would be a second thing to explain on the one screen with no
            room to explain anything. */}
        <button
          type="button"
          className={styles.handle}
          onClick={toggle}
          aria-expanded={open}
          aria-label={
            open ? "Close section navigation" : "Open section navigation"
          }
        >
          {current?.n ? <span className={styles.n}>{current.n}</span> : null}
          <span className={styles.name}>{current?.name ?? "Sections"}</span>
          <span className={styles.chev} aria-hidden="true" />
        </button>

        {/* THE BARE DIV IS LOAD-BEARING. It is the same three-deep
            anatomy the footer rail's drawer uses — .rbody > div > .rpad
            — and for the same reason: a 0fr grid row cannot shrink
            below its item's PADDING, because min-height only ever
            constrains a content box. The track carries 2px over and
            18px under, so closed the panel stood 20px tall and a strip
            of the thumbnails showed under the bar. This div carries the
            clip and no padding of its own; the track keeps the padding
            inside it. */}
        <div className={styles.panel} aria-hidden={!open}>
          <div>
            <div className={styles.track}>
              {stops.map((s, i) => (
                <button
                  key={s.name + i}
                  type="button"
                  className={styles.stop}
                  onClick={() => goTo(s.el)}
                  tabIndex={open ? 0 : -1}
                >
                  <span className={styles.thumb}>
                    {s.thumb ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={s.thumb}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                  </span>
                  <span className={styles.stopLabel}>
                    {s.n ? <span className={styles.stopN}>{s.n}</span> : null}
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
