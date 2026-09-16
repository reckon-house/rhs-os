"use client";

/* ── /book, ON THE BOARD'S GLASS ─────────────────────────────────────
 * The page's own drawing, in the column system: the lede and the
 * rotated month in the first column, the calendar in the second, which
 * is the arrangement it has always had — a spine on the left, the days
 * stacked beside it, the day under the hand flooded with its hours.
 * What changed is the armature under it. The page used to build its
 * own two-column grid out of the pre-board homepage's classes, so it
 * was the last route on the site still wearing that layout; the
 * columns are the board's now, and the calendar inside them is a
 * component /custom's last column and the board's Connect room share.
 *
 * The days come from the server (availability(), per request), so the
 * week is in the HTML before a script runs and a reader without one
 * still sees real times.
 */

import { useRef } from "react";
import Link from "next/link";
import type { Day } from "@/lib/booking";
import { BOOK_DIM, BOOK_LEDE } from "@/data/booking";
import { PaperGround } from "@/components/shell/PaperGround";
import { Rule, turnRow, useArrival, useGlass, useTurns } from "@/components/glass/glass";
import { Month, Week } from "@/components/glass/Week";
import glass from "@/components/glass/glass.module.css";

/* the two things worth saying beside a calendar, in the row grammar
   the method notes are written in */
const NOTES: { head: string; body: string }[] = [
  {
    head: "If none of them work",
    body: "Email hello@reckon.house and we'll find one that does.",
  },
  {
    head: "A booking opens a thread",
    body: "Anything you add before we talk reaches me the same way a message does.",
  },
];

export function BookBoard({ days }: { days: Day[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const past = useGlass(rootRef, stripRef, `.${glass.row}`, "");
  useArrival(stripRef);
  useTurns(stripRef);

  return (
    /* data-lenis-prevent: the shell's smooth scroller listens on <main>,
       which holds this page, and would swallow the wheel before a column
       could take it */
    <div ref={rootRef} className={glass.page} data-lenis-prevent>
      <PaperGround />

      <div className={glass.cover}>
        <Link className={glass.mark} href="/" aria-label="Reckon House">
          Reckon<i>*</i>House<span className={glass.here}>Book</span>
        </Link>
        <button
          type="button"
          className={glass.more}
          hidden={!past}
          onClick={() => stripRef.current && turnRow(stripRef.current, 1)}
          aria-label={`${past} more ${past === 1 ? "column" : "columns"}`}
        >
          +{past} &rarr;
        </button>
      </div>

      <div ref={stripRef} className={glass.strip}>
        <section className={`${glass.col} ${glass.lead}`} aria-label="Book a call">
          <div className={glass.cin}>
            <div className={glass.chead}>
              <span className={glass.tag}>Book</span>
            </div>
            <h1 className={`${glass.statement} ${glass.rise}`}>
              {BOOK_LEDE} <span className={glass.g}>{BOOK_DIM}</span>
            </h1>
            {/* the spine, in the column the lede stands in, as the page
                has always had it */}
            <Month days={days} />
          </div>
          <Rule />
        </section>

        <section className={glass.col} aria-label="Available times">
          <div className={glass.cin}>
            <Week days={days} month={false} />
            {/* the two things worth saying beside a calendar, under it:
                they answer what a reader asks once they have looked */}
            {NOTES.map((n) => (
              <p key={n.head} className={`${glass.row} ${glass.text} ${glass.rise}`}>
                <span>
                  <b>{n.head}</b> <span className={glass.g}>{n.body}</span>
                </span>
              </p>
            ))}
          </div>
          <Rule />
        </section>

        {/* the fifth of a column past the last one, so its rule and its
            count stand on the glass when the row has turned to its end */}
        <div className={glass.tail} aria-hidden="true" />
      </div>
    </div>
  );
}
