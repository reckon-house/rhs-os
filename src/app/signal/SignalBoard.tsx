"use client";

/* ── SIGNAL, ON THE BOARD'S GLASS ───────────────────────────────────
 * The AI news Jeremy reads, with his take on each, in the daybook's
 * grammar so the two logs read as one site: the statement in the
 * first column, then A DAY IS A COLUMN, newest first. Every column
 * stands on the board's rule, draws its ink there while it scrolls and
 * counts the entries left below the reading line, and the cover line
 * counts the days still past the glass.
 *
 * THE RAIL IS THE TAGS. They filter the feed in place, and an entry's
 * own tags are the same buttons, so a reader can follow a thread from
 * inside it. The filter is kept in the address (?t=claude-code), and
 * /signal#id still lands on its entry.
 *
 * Still a client component that SSRs: every entry is in the HTML for a
 * crawler and for anyone without a script. The turning, the ink and
 * the counts are the glass's (src/components/glass), shared with
 * /daybook and /custom.
 */

import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  NEWEST,
  SIGNAL_DIM,
  SIGNAL_LEDE,
  SIGNAL_TAIL,
  byDay,
  dayLabel,
  monthLabel,
  tagSlug,
  tagsByUse,
  type SignalEntry,
} from "@/data/signal";
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

const TAGS = tagsByUse();
const DAYS = byDay(NEWEST);
const OLDEST = NEWEST[NEWEST.length - 1];

const plural = (n: number) => `${n} ${n === 1 ? "link" : "links"}`;

/* ── THE FILTER LIVES IN THE ADDRESS ────────────────────────────────
   The daybook's pattern: read through an external store, so the
   server renders the whole feed, the client's first render matches
   it, and the address's filter arrives after hydration with no
   mismatch. */
const BY_SLUG = new Map(TAGS.map(({ tag }) => [tagSlug(tag), tag]));
const heard = new Set<() => void>();
function subscribeFilter(fn: () => void) {
  heard.add(fn);
  window.addEventListener("popstate", fn);
  return () => {
    heard.delete(fn);
    window.removeEventListener("popstate", fn);
  };
}
const readFilter = () => new URLSearchParams(window.location.search).get("t") ?? "";
const serverFilter = () => "";
function writeFilter(tag: string | null) {
  try {
    const u = new URL(window.location.href);
    if (tag) u.searchParams.set("t", tagSlug(tag));
    else u.searchParams.delete("t");
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

function Entry({
  e,
  hidden,
  tag,
  pick,
}: {
  e: SignalEntry;
  hidden: boolean;
  tag: string | null;
  pick: (t: string | null) => void;
}) {
  const paras = Array.isArray(e.take) ? e.take : [e.take];
  return (
    <article id={e.id} className={`${styles.entry} ${styles.rise}`} hidden={hidden}>
      <p className={styles.meta}>
        <time dateTime={e.date}>{dayLabel(e.date)}</time>
        <span className={styles.g}>{e.source}</span>
      </p>
      <h3 className={styles.title}>{e.headline}</h3>
      {paras.map((p, i) => (
        <p key={i} className={styles.body}>
          {p}
        </p>
      ))}
      <div className="mt-[1.1em] flex flex-wrap gap-1.5">
        {/* the receipt is the column's chip, out to the source */}
        <a className={styles.chip} href={e.sourceUrl} target="_blank" rel="noopener noreferrer">
          <span>{e.source}</span>
          <span className={styles.arr} aria-hidden="true" />
        </a>
        {e.tags.map((t) => (
          <button
            key={t}
            type="button"
            className={styles.pill}
            aria-pressed={tag === t}
            onClick={() => pick(t)}
          >
            {t}
          </button>
        ))}
      </div>
    </article>
  );
}

function Rail({ tag, pick }: { tag: string | null; pick: (t: string | null) => void }) {
  return (
    <>
      <button
        type="button"
        className={styles.pill}
        aria-pressed={tag === null}
        onClick={() => pick(null)}
      >
        <span>Everything</span>
        <span className={styles.n}>{NEWEST.length}</span>
      </button>
      {TAGS.map(({ tag: t, count }) => (
        <button
          key={t}
          type="button"
          className={styles.pill}
          aria-pressed={tag === t}
          onClick={() => pick(t)}
        >
          <span>{t}</span>
          <span className={styles.n}>{count}</span>
        </button>
      ))}
    </>
  );
}

export function SignalBoard() {
  const filter = useSyncExternalStore(subscribeFilter, readFilter, serverFilter);
  const tag = BY_SLUG.get(filter) ?? null;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const past = useGlass(rootRef, stripRef, `.${styles.entry}`, filter);
  useArrival(stripRef);
  useTurns(stripRef);
  /* a filter the reader picks rises and starts the columns over; one
     read off the address on arrival is simply where the page begins */
  const chosen = useRef(false);

  const pick = (t: string | null) => {
    const next = t !== null && tag === t ? null : t;
    if (next === tag) return;
    chosen.current = true;
    writeFilter(next);
  };
  const turn = (dir: 1 | -1) => {
    const strip = stripRef.current;
    const col = strip?.querySelector<HTMLElement>(`.${styles.col}`);
    if (strip && col)
      strip.scrollTo({
        left: strip.scrollLeft + dir * col.offsetWidth,
        behavior: still() ? "auto" : "smooth",
      });
  };

  /* A FILTER PICKED: before the paint, the row back to its start,
     every column back to its top, and what is on the glass rising in */
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
  }, [tag]);

  /* /signal#id, made exact a frame after the columns are built */
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

  const shown = (e: SignalEntry) => tag === null || e.tags.includes(tag);

  return (
    /* data-lenis-prevent: the shell's smooth scroller listens on <main>,
       which holds this page, and would swallow the wheel before a column
       could take it */
    <div ref={rootRef} className={styles.page} data-lenis-prevent>
      <PaperGround />

      <div className={styles.cover}>
        <Link className={styles.mark} href="/" aria-label="Reckon House, Signal">
          Reckon<i>*</i>House<span className={styles.here}>Signal</span>
        </Link>
        <button
          type="button"
          className={styles.more}
          hidden={!past}
          onClick={() => turn(1)}
          aria-label={`${past} more ${past === 1 ? "day" : "days"}`}
        >
          +{past} &rarr;
        </button>
      </div>

      <nav className={styles.rail} aria-label="Filter Signal by tag">
        <Rail tag={tag} pick={pick} />
      </nav>

      <div ref={stripRef} className={styles.strip}>
        <section className={`${styles.col} ${styles.lead}`} aria-label="Signal">
          <div className={styles.cin}>
            <h1 className={`${styles.statement} ${styles.rise}`}>
              {SIGNAL_LEDE} <span className={styles.g}>{SIGNAL_DIM}</span> {SIGNAL_TAIL}
            </h1>
            <p className={`${styles.quote} ${styles.rise}`}>
              {plural(NEWEST.length)} since {monthLabel(OLDEST.date)}. The headline is the
              source&rsquo;s. The note under it is mine, from building with these tools.
              <span className={styles.att}>Jeremy Prasatik</span>
            </p>
            {/* on a phone the rail has no column of its own, so it rides
                under the statement, in the column that introduces it */}
            <div className={styles.pocket}>
              <Rail tag={tag} pick={pick} />
            </div>
          </div>
          <Rule />
        </section>

        {DAYS.map((d) => {
          const n = d.entries.filter(shown).length;
          return (
            <section
              key={d.key}
              data-day={d.key}
              className={styles.col}
              hidden={!n}
              aria-labelledby={`day-${d.key}`}
            >
              <div className={styles.cin}>
                <h2 id={`day-${d.key}`} className={`${styles.head} ${styles.rise}`}>
                  {d.label} <span className={styles.g}>{plural(n)}</span>
                </h2>
                {d.entries.map((e) => (
                  <Entry key={e.id} e={e} hidden={!shown(e)} tag={tag} pick={pick} />
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
