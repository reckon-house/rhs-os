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
 * So the tail states the loop instead of duplicating it. A study ends
 * and home is one deliberate click away. On the homepage the same beat
 * returns to the top, because a ring has to close there too — and
 * because the thing at the bottom of home is the same footer, so the
 * component has to be honest about where it is.
 *
 * WHY A LINK AND NOT AN AUTO-SCROLL. The obvious reading of "it just
 * loops" is to navigate when the reader hits the bottom, and that is
 * the one version worth arguing against: overscroll is not intent.
 * Trackpad momentum, a rubber-band bounce and a reader who simply
 * stopped at the end all look identical to a scroll handler, and a
 * page that navigates itself out from under someone is a page they
 * cannot finish reading. The door is the width of the sentence and one
 * click wide; the loop is offered, not sprung.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
      {isHome ? (
        <button type="button" className={styles.door} onClick={toTop}>
          <span className={styles.eyebrow}>The ring</span>
          <p className={styles.line}>Back to the top.</p>
        </button>
      ) : (
        <Link href="/" className={styles.door}>
          <span className={styles.eyebrow}>The ring</span>
          <p className={styles.line}>Back to the house.</p>
        </Link>
      )}

      <div className={styles.rule} aria-hidden="true" />

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
