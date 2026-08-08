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
 * IT PULLS, AND IT ALSO CLICKS. Keep scrolling at the bottom and the
 * ring closes on its own — which is the point, because a case study's
 * reader has finished and "back to top" would only return them to
 * something they have already read. The link stays for keyboards,
 * reduced motion, and anyone who would rather aim than scroll.
 *
 * The distinction that makes the pull safe is intent versus momentum,
 * and it lives in useRingPull: nothing gathers until the page is
 * genuinely at its end, pulling back up drains it, an idle gesture
 * decays, and it takes several hundred pixels of deliberate travel.
 * The progress is drawn here, so the loop is visibly coming rather
 * than sprung.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRingPull } from "./useRingPull";
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

  const router = useRouter();
  /* The pull commits to whatever the door points at, so the gesture
     and the click can never disagree about where the ring goes. */
  const pull = useRingPull(() => {
    if (isHome) toTop();
    else router.push("/");
  }, pathname);

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

      {/* The rule doubles as the pull's gauge: it draws itself across
          on arrival, then fills again as the reader keeps going. Two
          jobs for one line, because a second indicator would be
          chrome announcing a gesture that should feel like the page
          simply continuing. */}
      <div className={styles.rule} aria-hidden="true">
        <span
          className={styles.gauge}
          style={{ "--pull": String(pull) } as CSSProperties}
        />
      </div>

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
