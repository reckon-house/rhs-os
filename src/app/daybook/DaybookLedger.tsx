"use client";

/* ── The ledger itself ──────────────────────────────────────────────
 * Client so the rows can make the site's entrance (ledger-arrival) and
 * show their evidence on approach (HoverPlate). Still server-rendered
 * HTML on first paint — a client component SSRs — so a crawler and a
 * no-JS reader get the whole log in its finished state.
 *
 * Three design systems at work, all borrowed rather than invented:
 * months are display type the way section heads are, every entry
 * carries an accession number the way sections carry marks, and a row
 * that points at a study floats that study's own thumbnail. Identity,
 * arrival, evidence — the three things the rest of the site does that
 * a bare list does not.
 */

import { useRef, useState } from "react";
import Link from "next/link";
import { DAYBOOK, byMonth, dayLabel, type DaybookEntry } from "@/data/daybook";
import { HoverPlate } from "@/components/daybook/HoverPlate";
import { useLedgerArrival } from "@/lib/ledger-arrival";
import styles from "./daybook.module.css";

/* The accession number: oldest entry is No. 001 and the count only ever
   grows, so a number names its entry forever. Newest-first array, so
   the sequence runs from the far end. */
const SEQ = new Map(DAYBOOK.map((e, i) => [e.id, DAYBOOK.length - i]));
const no = (id: string) => `No. ${String(SEQ.get(id) ?? 0).padStart(3, "0")}`;

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
  const months = byMonth(DAYBOOK);
  const rootRef = useRef<HTMLDivElement | null>(null);
  useLedgerArrival(rootRef, `.${styles.row}, .${styles.month}`, styles.pre);

  return (
    <div className="pressing isolate relative w-full">
      <div
        aria-hidden
        className="hero-breakout absolute top-0 bottom-0 -z-10"
        style={{ background: "var(--pp-paper)" }}
      />
      <div className={styles.page} ref={rootRef}>
        <header className={styles.head}>
          <h1 className={styles.lbl}>Daybook</h1>
          <span className={`${styles.lbl} ${styles.grey}`}>
            RHS &middot; Sally &middot; A.R.C.
          </span>
        </header>

        <p className={styles.lede}>
          What got built, dated. Three projects, mostly from one drive.
        </p>

        {months.map((m) => (
          <section key={m.key}>
            {/* The month is a beat, not a filing label: display type on
                the same scale the studies open sections with, the count
                receding beside it. */}
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
  );
}
