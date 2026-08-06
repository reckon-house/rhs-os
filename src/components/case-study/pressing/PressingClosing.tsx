"use client";

/**
 * PressingClosing — the closing screen (07e · CLOSING) from
 * public/lab/swiss-spread.html: a section mark row, the scale-jump headline,
 * a two-paragraph column, then the ledger — Services / Stack / Client —
 * under a hairline rule.
 *
 * No pin and no scrub. The prototype's closing is a plain .brief without the
 * `pin` opt-in, so nothing here subscribes to the scroll driver and nothing
 * is sticky. All motion is the kit's viewport-observer entrances
 * (RevealHeadline, BodyReveal), which render final-state under
 * prefers-reduced-motion on their own.
 *
 * Services and Stack render exactly as the prototype authored them: one
 * block per list with <br> between items. The prototype's own splitter
 * refused these elements because textContent welded "Art Direction" to
 * "Photo Compositing"; the React BodyReveal measures br-separated segments
 * as their own units, so the lists join the entrance system here. Client
 * entries are anchors, and an anchor cannot ride INSIDE a BodyReveal — the
 * split flattens inline markup to text — so each link wraps its own
 * single-segment reveal instead.
 */

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { BodyReveal } from "@/components/fx/BodyReveal";
import { RevealHeadline } from "@/components/fx/RevealHeadline";
import { SectionMark } from "@/components/fx/SectionMark";
import styles from "./PressingClosing.module.css";

/** px between the headline's last line and the column's first (prototype GAP). */
const GAP = 34;

/** useLayoutEffect warns during SSR; the measurement is client-only anyway. */
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export interface PressingClosingProps {
  /** The section mark row, e.g. { n: "06", name: "Closing" }. Same shape as
   *  the shared pressing mark in types.ts; dark is meaningless on the
   *  closing's paper ground but accepted so the one shape fits every slot. */
  mark?: { n: string; name: string; dark?: boolean };
  /** Sentence-case headline; "\n" marks the authored line break. */
  title: string;
  /** The broken-out second line — the prototype's display:block .out span.
   *  Joined to the title as an authored line break, exactly the break the
   *  .out block forced. */
  heldLine?: string;
  paragraphs: string[];
  services: string[];
  stack: string[];
  /** Client entries. Omitted or empty, the Client list does not render. */
  links?: { label: string; url: string }[];
}

/* Items joined by <br>, the closing lists' authored separator — BodyReveal
   reads each br-separated run as its own segment. */
function brJoin(items: string[]): ReactNode {
  return items.map((item, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {item}
    </Fragment>
  ));
}

export function PressingClosing({
  mark,
  title,
  heldLine,
  paragraphs,
  services,
  stack,
  links,
}: PressingClosingProps) {
  const headline = heldLine ? `${title}\n${heldLine}` : title;
  const sectionRef = useRef<HTMLElement | null>(null);
  const colRef = useRef<HTMLDivElement | null>(null);

  /* The placement pass, the same one every brief runs — the prototype's
     closing IS a .brief, so it inherits the rule that the column starts
     below the headline rather than beside its top. Without it the column
     top-aligns with the mark and the negative space the spread is built on
     collapses. Measured, not dealt: the headline rewraps across widths, so
     no fixed offset survives a resize. */
  useIsoLayoutEffect(() => {
    const sec = sectionRef.current;
    const col = colRef.current;
    if (!sec || !col) return;
    // RevealHeadline renders the tag itself, so the headline is reached the
    // way the prototype reached it: the section's own h2.
    const h2 = sec.querySelector("h2") as HTMLElement | null;
    if (!h2) return;

    const place = () => {
      // Phones stack the two in separate rows; the measured drop is
      // meaningless there and the stylesheet owns the spacing.
      if (window.innerWidth <= 760) {
        col.style.marginTop = "";
        return;
      }
      // Cleared first: the two share a grid row, so a stale margin would
      // inflate the row and compound on every resize.
      col.style.marginTop = "0px";
      const hs = getComputedStyle(h2);
      const drop = parseFloat(hs.marginTop) + h2.offsetHeight + GAP;
      col.style.marginTop = Math.max(0, Math.round(drop)) + "px";
    };

    place();
    window.addEventListener("resize", place);
    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (alive) place();
      });
    }
    // The prototype's own settle pass: the reveal masks net to zero layout
    // only once every line has landed.
    const t = window.setTimeout(place, 300);

    return () => {
      alive = false;
      window.removeEventListener("resize", place);
      window.clearTimeout(t);
    };
  }, [title, heldLine]);
  return (
    <section ref={sectionRef} className={styles.closing}>
      {mark ? (
        <div className={styles.markRow}>
          {/* Not a pinned screen, so the mark drives from its own position
              on screen — no scrollRef. */}
          <SectionMark n={mark.n} name={mark.name} dark={mark.dark} />
        </div>
      ) : null}
      <RevealHeadline as="h2" className={styles.title}>
        {headline}
      </RevealHeadline>
      <div ref={colRef} className={styles.col}>
        {paragraphs.map((p, i) => (
          <BodyReveal key={i} className={styles.para}>
            {p}
          </BodyReveal>
        ))}
        <div className={styles.lists}>
          <div>
            <BodyReveal as="div" className={styles.h}>
              Services
            </BodyReveal>
            <BodyReveal as="div">{brJoin(services)}</BodyReveal>
          </div>
          <div>
            <BodyReveal as="div" className={styles.h}>
              Stack
            </BodyReveal>
            <BodyReveal as="div">{brJoin(stack)}</BodyReveal>
          </div>
          {links && links.length > 0 ? (
            <div>
              <BodyReveal as="div" className={styles.h}>
                Client
              </BodyReveal>
              {links.map((l) => (
                <div key={`${l.label}|${l.url}`}>
                  <a className={styles.link} href={l.url}>
                    <BodyReveal as="span">{l.label}</BodyReveal>
                  </a>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
