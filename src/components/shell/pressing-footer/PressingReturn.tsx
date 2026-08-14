"use client";

/* ── PressingReturn ─────────────────────────────────────────────────
 * The last thing on every page, and the move that closes the ring.
 *
 * It replaces the All-work index, which was a real thing to lose and
 * the right thing to lose. That index listed all thirty projects under
 * every case study, which made sense while the homepage was a
 * different object. The homepage IS that index now, so carrying it in
 * the footer meant every study ended by reprinting the front page:
 * thirty frames, thirty images, and a reader who has just finished
 * reading being handed a directory instead of a door.
 *
 * So a study ends at the front page: the homepage's body simply
 * continues below the footer, and the reader keeps scrolling into the
 * work. The homepage itself stops at the footer, because the ring
 * there would be the page repeating itself — they have just scrolled
 * through this exact object to reach it.
 *
 * NOTHING NAVIGATES HERE, and two earlier versions of this file did.
 * The first offered a link home; the second let a deliberate scroll
 * past the end commit to one. Both were answering the wrong question.
 * A reader who has finished a study does not want a door and does not
 * want the top of what they just read: they want the next thing. So
 * the work simply continues below, as PressingRing. Keep scrolling and
 * it is there, with no gesture to learn, nothing to aim at, and no
 * page that can navigate itself out from under someone mid-sentence.
 *
 * What is left here is the ring itself and the chrome that used to sit
 * under the old All-work index. No label introduces it. An earlier
 * pass put an eyebrow and a headline above the work, which was this
 * file inventing a beat the design does not have: the homepage does
 * not announce its own index, so neither does its repeat.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { PressingRing } from "./PressingRing";
import { PressingDaybook } from "./PressingDaybook";
import styles from "./PressingReturn.module.css";

export function PressingReturn() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const rootRef = useRef<HTMLElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    /* A viewport observer, not a scroll subscriber. <main> spans the
       whole viewport, so the two tests agree even though the page
       scrolls inside it rather than on the document. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setOn(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* Lenis owns <main>, so the scroll goes through the element rather
       than the window. Writing window.scrollTo here does nothing at
       all, silently, which is the failure this comment exists to
       prevent the next person from rediscovering. */
    document
      .querySelector("main")
      ?.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      ref={rootRef}
      className={`hero-breakout ${styles.beat}${on ? ` ${styles.on}` : ""}`}
    >
      {/* The homepage's body, repeated — everywhere except the
          homepage, where the reader has already scrolled through this
          exact object to get here and a second copy would just be the
          same page twice. A case study ends at the front page; the
          front page ends. */}
      {isHome ? null : <PressingRing />}

      {/* Between the work and the credit line, which puts it last on
          both kinds of page without being below the line that closes
          them. The homepage has no ring above it, a study does, and
          neither has to know which. */}
      <PressingDaybook />

      <div className={styles.foot}>
        <span>&copy; 2026 Reckon House</span>
        <span className={styles.newsline}>
          Awwwards Honors, 2026 &middot; Faux Reel released as an open repo
        </span>
        <button type="button" className={styles.top} onClick={toTop}>
          Top &uarr;
        </button>
      </div>
    </section>
  );
}
