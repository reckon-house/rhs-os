import type { Metadata } from "next";
import Link from "next/link";
import { DAYBOOK, byMonth, dayLabel, type DaybookEntry } from "@/data/daybook";
import styles from "./daybook.module.css";

export const metadata: Metadata = {
  title: "Daybook",
  description:
    "What Reckon House Staples built, dated. Case studies, product work, and notes from the practice of Jeremy Prasatik.",
};

/* ── /daybook ───────────────────────────────────────────────────────
   The running log. A ledger at three densities on one grid: date left,
   entry in the middle, project right. A post is a heavier day, not a
   different page, so the date and project columns never move and the
   only thing that changes is how much sits in the middle cell.

   Server component: it is a data file rendered as rows. Nothing here
   needs the client, and every entry is in the HTML for a crawler and
   for the facts index that reads this site.

   Same rows the homepage strip uses (DAYBOOK_STRIP is a slice of this
   list), so the two can never disagree about what shipped. */

function Entry({ e, first }: { e: DaybookEntry; first: boolean }) {
  const paras = Array.isArray(e.body) ? e.body : [e.body];
  return (
    <article
      id={e.id}
      className={`${styles.row} ${first ? styles.first : ""}`}
    >
      {/* Only the first entry of a day is dated. A repeated date reads
          as three separate days rather than one busy one. */}
      <span className={styles.d}>{first ? dayLabel(e.date) : ""}</span>
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
    </article>
  );
}

export default function DaybookPage() {
  const months = byMonth(DAYBOOK);
  return (
    <div className="pressing isolate relative w-full">
      <div
        aria-hidden
        className="hero-breakout absolute top-0 bottom-0 -z-10"
        style={{ background: "var(--pp-paper)" }}
      />
      <div className={styles.page}>
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
            <div className={styles.month}>
              <span className={styles.lbl}>{m.label}</span>
              <span className={`${styles.lbl} ${styles.grey}`}>
                {m.entries.length} {m.entries.length === 1 ? "entry" : "entries"}
              </span>
            </div>
            {m.entries.map((e, i) => (
              <Entry
                key={e.id}
                e={e}
                /* A day's first entry carries the date and the rule;
                   the rest of that day hangs under it. */
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
