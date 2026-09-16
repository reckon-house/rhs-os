"use client";

/* ── THE DAYBOOK, ON THE BOARD'S GLASS ──────────────────────────────
 * The log was a page in the old homepage's grammar: a caps rail, a
 * display lede, one long list, and the old homepage reprinted under it
 * as a footer. The site stopped looking like that when the board took
 * `/`. This is the log in the board's own terms.
 *
 * A MONTH IS A COLUMN. The board deals its work into columns that
 * scroll down inside themselves and turn sideways a column at a time,
 * and a daybook is already sorted that way, by the calendar. The first
 * column is the statement, as it is on the board; the months follow,
 * newest first. Every column stands on the board's rule, draws its ink
 * there while it scrolls and counts the entries left below the reading
 * line, and the cover line counts the months still past the glass.
 *
 * THE RAIL IS THE BOARD'S TOO. The projects filter the log in place,
 * and the months are doors that bring their column to the glass. A
 * filter is kept in the address (?p=sally), and /daybook#id still
 * lands on its entry.
 *
 * Still a client component that SSRs: every entry is in the HTML for a
 * crawler and for anyone without a script. The turning, the ink and
 * the counts are layered on a page that is complete without them, and
 * they are the glass's (src/components/glass), shared with /custom;
 * this file keeps the log's own material and its own reasons to
 * redraw: the filter, and the fragment.
 */

import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  DAYBOOK,
  DAYBOOK_DIM,
  DAYBOOK_LEDE,
  DAYBOOK_TAIL,
  byMonth,
  dayLabel,
  monthLabel,
  type DaybookEntry,
  type DaybookProject,
} from "@/data/daybook";
import { plateSrcSet } from "@/lib/img-srcset";
import { PaperGround } from "@/components/shell/PaperGround";
import {
  Rule,
  armRise,
  columnsIn,
  still,
  useArrival,
  useGlass,
  useTurns,
} from "@/components/glass/glass";
import styles from "@/components/glass/glass.module.css";

/* The accession number: the oldest entry is No. 001 and the count only
   grows, so a number names its entry for good. */
const SEQ = new Map(DAYBOOK.map((e, i) => [e.id, DAYBOOK.length - i]));
const no = (id: string) => `No. ${String(SEQ.get(id) ?? 0).padStart(3, "0")}`;

const PROJECTS: DaybookProject[] = ["RHS", "Sally", "A.R.C.", "Lab"];
const COUNTS = new Map<DaybookProject, number>();
DAYBOOK.forEach((e) => COUNTS.set(e.project, (COUNTS.get(e.project) ?? 0) + 1));
const MONTHS = byMonth(DAYBOOK);
const OLDEST = DAYBOOK[DAYBOOK.length - 1];

const plural = (n: number) => `${n} ${n === 1 ? "entry" : "entries"}`;

/* ── THE FILTER LIVES IN THE ADDRESS ────────────────────────────────
   Read through an external store rather than copied into state on
   mount: the server renders the whole log, the client's first render
   matches it, and React re-renders with the address's filter once it
   is hydrated, with no mismatch and no effect setting state. The
   address keeps ?p=arc rather than ?p=A.R.C. */
const slugOf = (p: DaybookProject) => p.toLowerCase().replace(/[^a-z]/g, "");
const BY_SLUG = new Map(PROJECTS.map((p) => [slugOf(p), p]));
const heard = new Set<() => void>();
function subscribeFilter(fn: () => void) {
  heard.add(fn);
  window.addEventListener("popstate", fn);
  return () => {
    heard.delete(fn);
    window.removeEventListener("popstate", fn);
  };
}
const readFilter = () => new URLSearchParams(window.location.search).get("p") ?? "";
const serverFilter = () => "";
function writeFilter(p: DaybookProject | null) {
  try {
    const u = new URL(window.location.href);
    if (p) u.searchParams.set("p", slugOf(p));
    else u.searchParams.delete("p");
    window.history.replaceState(null, "", u);
  } catch {
    /* an address that will not take it keeps the one it had */
  }
  heard.forEach((fn) => fn());
}

/* an entry's address: its column to the glass, then the column down to it */
function revealEntry(strip: HTMLElement, id: string) {
  const el = id ? document.getElementById(id) : null;
  if (!el || el.hidden || !strip.contains(el)) return;
  const col = el.closest<HTMLElement>(`.${styles.col}`);
  const cin = el.closest<HTMLElement>(`.${styles.cin}`);
  if (!col || !cin) return;
  strip.scrollLeft = col.offsetLeft;
  cin.scrollTop = Math.max(0, el.offsetTop - parseFloat(getComputedStyle(cin).paddingTop));
}

function Entry({ e, hidden }: { e: DaybookEntry; hidden: boolean }) {
  const paras = Array.isArray(e.body) ? e.body : [e.body];
  const link = e.link;
  return (
    <article id={e.id} className={`${styles.entry} ${styles.rise}`} hidden={hidden}>
      <p className={styles.meta}>
        <time dateTime={e.date}>{dayLabel(e.date)}</time>
        <span className={styles.g}>
          {no(e.id)} &middot; {e.project}
        </span>
      </p>
      {e.title ? <h3 className={styles.title}>{e.title}</h3> : null}
      {paras.map((p, i) => (
        <p key={i} className={styles.body}>
          {p}
        </p>
      ))}
      {e.image ? (
        <figure className={styles.pic}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={e.image.src}
            srcSet={plateSrcSet(e.image.src)}
            /* a column is the strip over 2.2 on a desktop, over 1.2 on a phone */
            sizes="(max-width: 760px) 80vw, 480px"
            alt={e.image.alt}
            loading="lazy"
            decoding="async"
          />
          {e.image.caption ? (
            <figcaption className={styles.cap}>{e.image.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}
      {link ? (
        <p className={styles.ways}>
          {/* The receipt is the column's chip. Its arrow is drawn by the
              stylesheet so the curtain, which repeats a link's own text,
              repeats the name and not the glyph. */}
          <Link className={styles.chip} href={link.href}>
            <span>{link.label}</span>
            <span className={styles.arr} aria-hidden="true" />
          </Link>
        </p>
      ) : null}
    </article>
  );
}

function Rail({
  proj,
  pick,
  go,
}: {
  proj: DaybookProject | null;
  pick: (p: DaybookProject | null) => void;
  go: (key: string) => void;
}) {
  return (
    <>
      <button
        type="button"
        className={styles.pill}
        aria-pressed={proj === null}
        onClick={() => pick(null)}
      >
        <span>Everything</span>
        <span className={styles.n}>{DAYBOOK.length}</span>
      </button>
      {PROJECTS.map((p) => (
        <button
          key={p}
          type="button"
          className={styles.pill}
          aria-pressed={proj === p}
          onClick={() => pick(p)}
        >
          <span>{p}</span>
          <span className={styles.n}>{COUNTS.get(p) ?? 0}</span>
        </button>
      ))}
      <span className={styles.gap} aria-hidden="true" />
      {MONTHS.map((m) => {
        const n = proj ? m.entries.filter((e) => e.project === proj).length : m.entries.length;
        return n ? (
          <button key={m.key} type="button" className={styles.pill} onClick={() => go(m.key)}>
            <span>{m.label}</span>
            <span className={styles.n}>{n}</span>
          </button>
        ) : null;
      })}
    </>
  );
}

export function DaybookBoard() {
  const filter = useSyncExternalStore(subscribeFilter, readFilter, serverFilter);
  const proj = BY_SLUG.get(filter) ?? null;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  /* the glass: ink, counts and the months past the edge, redrawn when
     the filter rebuilds the columns; the rise under a curtain; the
     row turning from the keys and a held wheel */
  const past = useGlass(rootRef, stripRef, `.${styles.entry}`, filter);
  useArrival(stripRef);
  useTurns(stripRef);
  /* a filter the reader picks rises and starts the columns over; one
     read off the address on arrival is simply where the page begins */
  const chosen = useRef(false);

  const pick = (p: DaybookProject | null) => {
    const next = p !== null && proj === p ? null : p;
    if (next === proj) return;
    chosen.current = true;
    writeFilter(next);
  };
  const slide = (left: number) =>
    stripRef.current?.scrollTo({ left, behavior: still() ? "auto" : "smooth" });
  const go = (key: string) => {
    const col = stripRef.current?.querySelector<HTMLElement>(`[data-month="${key}"]`);
    if (col) slide(col.offsetLeft);
  };
  const turn = (dir: 1 | -1) => {
    const strip = stripRef.current;
    const col = strip?.querySelector<HTMLElement>(`.${styles.col}`);
    if (strip && col) slide(strip.scrollLeft + dir * col.offsetWidth);
  };

  /* ── A FILTER PICKED ────────────────────────────────────────────
     Before the paint, so the rebuilt columns never show at rest first:
     the row back to its start, every column back to its top, and what
     is on the glass rising in. */
  useLayoutEffect(() => {
    const strip = stripRef.current;
    if (!strip || !chosen.current) return;
    strip.scrollLeft = 0;
    columnsIn(strip).forEach((c) => {
      const cin = c.querySelector<HTMLElement>(`.${styles.cin}`);
      if (cin) cin.scrollTop = 0;
    });
    if (still()) return;
    const release = armRise(strip);
    const raf = requestAnimationFrame(() => requestAnimationFrame(release));
    return () => {
      cancelAnimationFrame(raf);
      release();
    };
  }, [proj]);

  /* /daybook#id: the browser scrolls nested boxes to a fragment on its
     own, but not always to the top of the entry, and not after the
     filter has rebuilt the columns; a frame later this makes it exact */
  useEffect(() => {
    const strip = stripRef.current;
    let id = "";
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    if (!strip || !id) return;
    const raf = requestAnimationFrame(() => revealEntry(strip, id));
    return () => cancelAnimationFrame(raf);
  }, []);

  const shown = (e: DaybookEntry) => proj === null || e.project === proj;

  return (
    /* data-lenis-prevent: the shell's smooth scroller listens on <main>,
       which holds this page, and would swallow the wheel before a column
       could take it */
    <div ref={rootRef} className={styles.page} data-lenis-prevent>
      <PaperGround />

      <div className={styles.cover}>
        <Link className={styles.mark} href="/" aria-label="Reckon House, Daybook">
          Reckon<i>*</i>House<span className={styles.here}>Daybook</span>
        </Link>
        <button
          type="button"
          className={styles.more}
          hidden={!past}
          onClick={() => turn(1)}
          aria-label={`${past} more ${past === 1 ? "month" : "months"}`}
        >
          +{past} &rarr;
        </button>
      </div>

      <nav className={styles.rail} aria-label="Filter the daybook">
        <Rail proj={proj} pick={pick} go={go} />
      </nav>

      <div ref={stripRef} className={styles.strip}>
        <section className={`${styles.col} ${styles.lead}`} aria-label="Daybook">
          <div className={styles.cin}>
            <h1 className={`${styles.statement} ${styles.rise}`}>
              {DAYBOOK_LEDE} <span className={styles.g}>{DAYBOOK_DIM}</span> {DAYBOOK_TAIL}
            </h1>
            <p className={`${styles.quote} ${styles.rise}`}>
              {DAYBOOK.length} entries since {monthLabel(OLDEST.date)}, drafted from the commit
              logs and edited by hand. A number, once minted, never changes.
              <span className={styles.att}>The ledger</span>
            </p>
            {/* on a phone the rail has no column of its own, so it rides
                under the statement, in the column that introduces it */}
            <div className={styles.pocket}>
              <Rail proj={proj} pick={pick} go={go} />
            </div>
          </div>
          <Rule />
        </section>

        {MONTHS.map((m) => {
          const n = m.entries.filter(shown).length;
          return (
            <section
              key={m.key}
              data-month={m.key}
              className={styles.col}
              hidden={!n}
              aria-labelledby={`month-${m.key}`}
            >
              <div className={styles.cin}>
                <h2 id={`month-${m.key}`} className={`${styles.head} ${styles.rise}`}>
                  {m.label} <span className={styles.g}>{plural(n)}</span>
                </h2>
                {m.entries.map((e) => (
                  <Entry key={e.id} e={e} hidden={!shown(e)} />
                ))}
              </div>
              <Rule />
            </section>
          );
        })}

        {/* the fifth of a column past the last one, so its rule and its
            count stand on the glass when the row has turned to its end */}
        <div className={styles.tail} aria-hidden="true" />
      </div>
    </div>
  );
}
