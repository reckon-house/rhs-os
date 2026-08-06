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

import { Fragment, useRef, type ReactNode } from "react";
import { useColumnDrop } from "@/lib/column-drop";
import { BodyReveal } from "@/components/fx/BodyReveal";
import { RevealHeadline } from "@/components/fx/RevealHeadline";
import { SectionMark } from "@/components/fx/SectionMark";
import styles from "./PressingClosing.module.css";

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

  /* The brief-family placement pass, shared (src/lib/column-drop.ts).
     stackBelow is 767 because THIS component's stylesheet stacks at 767
     (main's md gutter seam), not the choreography 760 — the review caught
     the 761-767 dead band the mismatch created. */
  useColumnDrop(sectionRef, colRef, { stackBelow: 767 }, [title, heldLine]);
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
            <div className={styles.fullRow}>
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
