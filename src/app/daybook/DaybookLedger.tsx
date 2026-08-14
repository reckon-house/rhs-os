"use client";

/* ── The ledger, in the homepage's own grammar ──────────────────────
 * This page used to have a private layout: a capped column with a caps
 * header. It is the homepage's template now — the statement at display
 * size, the pinned notes rail on the left, and the entries standing
 * where the work stands. One page grammar for the whole site, and every
 * class here (.statement, .dim, .ixbody, .ixnotes, .blk, .filt) is the
 * homepage's own, already loaded on every route by the footer.
 *
 * The rail is not furniture: the filter is live, per project, with real
 * counts. The homepage's rail filters the work; this one filters the
 * days.
 *
 * Still a client component that SSRs, so the whole log is in the HTML
 * for a crawler and a no-JS reader — arrival and evidence are layered
 * on top of a page that is complete without them.
 */

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  DAYBOOK,
  byMonth,
  dayLabel,
  monthLabel,
  type DaybookEntry,
  type DaybookProject,
} from "@/data/daybook";
import { HoverPlate } from "@/components/daybook/HoverPlate";
import { useLedgerArrival } from "@/lib/ledger-arrival";
import styles from "./daybook.module.css";

/* The accession number: oldest entry is No. 001 and the count only ever
   grows, so a number names its entry forever. Newest-first array, so
   the sequence runs from the far end. */
const SEQ = new Map(DAYBOOK.map((e, i) => [e.id, DAYBOOK.length - i]));
const no = (id: string) => `No. ${String(SEQ.get(id) ?? 0).padStart(3, "0")}`;

const PROJECTS: DaybookProject[] = ["RHS", "Sally", "A.R.C.", "Lab"];

const finePointer = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function Entry({ e, first }: { e: DaybookEntry; first: boolean }) {
  const paras = Array.isArray(e.body) ? e.body : [e.body];
  /* seen latches on the first real hover so the thumbnail is only ever
     fetched for rows someone actually visits. */
  const [seen, setSeen] = useState(false);
  const [on, setOn] = useState(false);
  const peekable = Boolean(e.link && !e.image);

  return (
    <article
      id={e.id}
      className={`${styles.row} ${first ? styles.first : ""}`}
      onPointerEnter={() => {
        if (!peekable || !finePointer()) return;
        setSeen(true);
        setOn(true);
      }}
      onPointerLeave={() => setOn(false)}
    >
      <span className={styles.d}>
        {first ? dayLabel(e.date) : ""}
        <span className={styles.no}>{no(e.id)}</span>
      </span>
      <div className={styles.t}>
        {e.title ? <p className={styles.title}>{e.title}</p> : null}
        {paras.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {e.image ? (
          <figure className={styles.pic}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={e.image.src} alt={e.image.alt} loading="lazy" decoding="async" />
            {e.image.caption ? (
              <figcaption className={styles.cap}>{e.image.caption}</figcaption>
            ) : null}
          </figure>
        ) : null}
        {e.link ? (
          <p className={styles.receipt}>
            <Link href={e.link.href}>{e.link.label}</Link>
          </p>
        ) : null}
      </div>
      <span className={styles.p}>{e.project}</span>
      {seen && e.link ? <HoverPlate href={e.link.href} on={on} /> : null}
    </article>
  );
}

export function DaybookLedger() {
  const [proj, setProj] = useState<DaybookProject | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  useLedgerArrival(rootRef, `.${styles.row}, .${styles.month}`, styles.pre);

  const counts = useMemo(() => {
    const m = new Map<DaybookProject, number>();
    DAYBOOK.forEach((e) => m.set(e.project, (m.get(e.project) ?? 0) + 1));
    return m;
  }, []);
  const months = useMemo(
    () => byMonth(proj ? DAYBOOK.filter((e) => e.project === proj) : DAYBOOK),
    [proj]
  );
  const oldest = DAYBOOK[DAYBOOK.length - 1];

  /* Active filter marked inline rather than with a module class: the
     rail's button styles are the homepage's globals, and a module class
     on the same element loses that specificity fight quietly. */
  const active = { textDecoration: "underline", textUnderlineOffset: "3px", color: "#000" };

  return (
    <div className="pressing isolate relative w-full">
      <div
        aria-hidden
        className="hero-breakout absolute top-0 bottom-0 -z-10"
        style={{ background: "var(--pp-paper)" }}
      />
      <section className={`hero-breakout stratum ${styles.wrap}`} ref={rootRef}>
        {/* The lede, in the practice statement's own type: the claim in
            ink, the enumeration receding, the closer in ink. No .term
            underlines — on the homepage those mean "ask the house", and
            an underline that does nothing here would be a small lie. */}
        <h1 className="statement">
          The day&rsquo;s work, entered as it happens.{" "}
          <span className="dim">
            Ships, fixes, and notes across RHS, Sally, and A.R.C., with a
            picture when one earns it.
          </span>{" "}
          Newest first, numbered from the first entry.
        </h1>

        <div className="ixbody">
          <div className="ixnotes">
            <div className="blk">
              <span className="tag">What this is</span>
              A register of the work as it ships, drafted from each
              project&rsquo;s own commit log and edited by hand.
            </div>
            <div className="blk">
              <span className="tag">Filter</span>
              <div className="filt">
                <button
                  type="button"
                  style={proj === null ? active : undefined}
                  onClick={() => setProj(null)}
                >
                  Everything &middot; {DAYBOOK.length}
                </button>
                {PROJECTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    style={proj === p ? active : undefined}
                    onClick={() => setProj(proj === p ? null : p)}
                  >
                    {p} &middot; {counts.get(p) ?? 0}
                  </button>
                ))}
              </div>
            </div>
            <div className="blk">
              <span className="tag">The ledger</span>
              {DAYBOOK.length} entries since {monthLabel(oldest.date)}. A
              number, once minted, never changes.
            </div>
          </div>

          <div>
            {months.map((m) => (
              <section key={m.key}>
                {/* The month is a beat, not a filing label: display type
                    on the scale the studies open sections with, the
                    count receding beside it. */}
                <div className={styles.month}>
                  <span className={styles.monthName}>{m.label}</span>
                  <span className={`${styles.lbl} ${styles.grey}`}>
                    {m.entries.length} {m.entries.length === 1 ? "entry" : "entries"}
                  </span>
                </div>
                {m.entries.map((e, i) => (
                  <Entry
                    key={e.id}
                    e={e}
                    first={i === 0 || m.entries[i - 1].date !== e.date}
                  />
                ))}
              </section>
            ))}

            <p className={styles.back}>
              <Link href="/">Back to the house</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
