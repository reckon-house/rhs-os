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

import { useEffect, useMemo, useRef, useState } from "react";
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
import { curtain } from "@/lib/curtain";
import { useLedgerArrival } from "@/lib/ledger-arrival";
import { PaperGround } from "@/components/shell/PaperGround";
import styles from "./daybook.module.css";

/* The accession number: oldest entry is No. 001 and the count only ever
   grows, so a number names its entry forever. Newest-first array, so
   the sequence runs from the far end. */
const SEQ = new Map(DAYBOOK.map((e, i) => [e.id, DAYBOOK.length - i]));
const no = (id: string) => `No. ${String(SEQ.get(id) ?? 0).padStart(3, "0")}`;

const PROJECTS: DaybookProject[] = ["RHS", "Sally", "A.R.C.", "Lab"];

/* Entries per project. Module scope like SEQ above, and for the same
   reason: it is a fact about the whole log, not about a render. It was
   a useMemo until the filter needed it before its own declaration,
   which the React Compiler could not reason about and bailed on. */
const COUNTS = new Map<DaybookProject, number>();
DAYBOOK.forEach((e) => COUNTS.set(e.project, (COUNTS.get(e.project) ?? 0) + 1));

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
  const listRef = useRef<HTMLDivElement | null>(null);
  const swapping = useRef(false);

  /* FILTERING PLAYS THE SITE'S CURTAIN, the same one a case-study link
     plays: white down, black up, the list rebuilt under full black, and
     the black lifting to reveal it. It used to have a private two-beat
     animation instead, rows drawing out and back in, which meant this
     site had two different transitions and the quieter one was doing a
     smaller version of the other's job.

     The curtain's repeated word is the filter's own name, and the sub
     is its count, so the panel reads "Sally 19 entries" down the page
     while the list behind it is rebuilt.

     No reduced-motion branch here on purpose, and none needed: play()
     runs the commit bare under reduced motion, when a sequence is
     already in flight, or when nothing is registered at all. The
     filter changes in every one of those cases; only the curtain is
     conditional. One place decides. */
  const queued = useRef<DaybookProject | null | undefined>(undefined);
  const pick = (p: DaybookProject | null) => {
    const next = p !== null && proj === p ? null : p;
    if (next === proj) return;
    /* A click mid-flight is not dropped, it is the new destination: the
       latest choice waits out the sequence and then plays. */
    if (swapping.current) {
      queued.current = next;
      return;
    }
    swapping.current = true;
    const n = next ? COUNTS.get(next) ?? 0 : DAYBOOK.length;
    void curtain(
      next ?? "Everything",
      `${n} ${n === 1 ? "entry" : "entries"}`,
      () => setProj(next)
    ).then(() => {
      swapping.current = false;
      if (queued.current !== undefined) {
        const q = queued.current;
        queued.current = undefined;
        pick(q as DaybookProject | null);
      }
    });
  };

  /* Keyed on proj: a rebuilt list is new DOM, and without the key its
     below-fold rows would arrive already settled. */
  useLedgerArrival(rootRef, `.${styles.row}, .${styles.month}`, styles.pre, proj);

  /* THE PAGE ENTERS. The statement, the rail blocks, and the rows
     already inside the first viewport rise in sequence on mount — the
     scroll hook above only ever arms what is below the fold, so without
     this the top of the page was the one part that never moved. Same
     arm-and-release contract: one frame of start state, then let go. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    const head = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.enter}`));
    const early = Array.from(
      root.querySelectorAll<HTMLElement>(`.${styles.row}, .${styles.month}`)
    ).filter((el) => el.getBoundingClientRect().top <= window.innerHeight * 0.92);
    const cast = [...head, ...early];
    cast.forEach((el, i) => {
      el.classList.add(i < head.length ? styles.enterPre : styles.pre);
      el.style.setProperty("--dbd", `${i * 85}ms`);
    });
    const release = () =>
      cast.forEach((el) => el.classList.remove(styles.enterPre, styles.pre));
    requestAnimationFrame(() => requestAnimationFrame(release));
    const belt = window.setTimeout(release, 500);
    return () => window.clearTimeout(belt);
  }, []);

  const months = useMemo(
    () => byMonth(proj ? DAYBOOK.filter((e) => e.project === proj) : DAYBOOK),
    [proj]
  );
  const oldest = DAYBOOK[DAYBOOK.length - 1];

  /* The selected filter wears the rail's own drawn rule, held on (see
     .on in the module, which outranks the homepage's hover rule). */

  return (
    <div className="pressing isolate relative w-full">
      {/* White page, so the masthead needs white behind it too. */}
      <PaperGround />
      <div
        aria-hidden
        className="hero-breakout absolute top-0 bottom-0 -z-10"
        style={{ background: "var(--pp-paper)" }}
      />
      <section className={`hero-breakout stratum ${styles.wrap}`} ref={rootRef}>
        <div className="ixbody">
          {/* The standing rule, pinned — the same one the homepage and
              the answer carry, with a single boundary here: the note
              rail against the column beside it. */}
          <div className="ixrules ixrule1" aria-hidden="true">
            <div className="ixrulesPin" />
          </div>

          {/* The lede, in the practice statement's own type: the claim in
              ink, the enumeration receding, the closer in ink. No .term
              underlines — on the homepage those mean "ask the house", and
              an underline that does nothing here would be a small lie.

              It stands INSIDE the grid, in the entries' own column. Above
              it, at full page width, it started a rail and a gutter left
              of every line that proves it. Nested rather than padded to
              match: a padded copy would restate the rail width and the
              gap as a third place they have to agree, and this file has
              already watched that go wrong once. */}
          <h1 className={`statement ${styles.lede} ${styles.enter}`}>
            The day&rsquo;s work, entered as it happens.{" "}
            <span className="dim">
              Ships, fixes, and notes across RHS, Sally, and A.R.C., with a
              picture when one earns it.
            </span>{" "}
            Newest first, numbered from the first entry.
          </h1>
          <div className={`ixnotes ${styles.rail}`}>
            <div className={`blk ${styles.enter}`}>
              <span className="tag">Filter</span>
              <div className="filt">
                <button
                  type="button"
                  className={proj === null ? styles.on : undefined}
                  onClick={() => pick(null)}
                >
                  Everything &middot; {DAYBOOK.length}
                </button>
                {PROJECTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={proj === p ? styles.on : undefined}
                    onClick={() => pick(p)}
                  >
                    {p} &middot; {COUNTS.get(p) ?? 0}
                  </button>
                ))}
              </div>
            </div>
            {/* One home per fact: the lede owns what this is, this block
                owns how it is kept. The old "What this is" block restated
                the lede at rail size and is gone. */}
            <div className={`blk ${styles.enter}`}>
              <span className="tag">The ledger</span>
              {DAYBOOK.length} entries since {monthLabel(oldest.date)},
              drafted from the commit logs and edited by hand. A number,
              once minted, never changes.
            </div>
          </div>

          <div ref={listRef} className={styles.list}>
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
