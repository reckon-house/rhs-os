"use client";

/* ── PressingDaybook ────────────────────────────────────────────────
 * The last beat on the page: what got built lately, dated.
 *
 * It sits AFTER PressingReturn, which is what gives it the right
 * position on both kinds of page without either knowing about the
 * other. Return renders the ring on a case study and nothing on the
 * homepage, so this lands as:
 *
 *   homepage      work index → contact → credits → daybook
 *   case study    the study  → contact → credits → ring → daybook
 *
 * Which is the order Jeremy asked for: the two dark beats are read
 * first everywhere, and on a study the work still continues below them
 * before the log closes the page.
 *
 * It used to sit above the contact beat on the homepage, where more
 * people saw it. That was the safer placement and this is the better
 * one: a reader who has gone past the call to action and kept going is
 * exactly who this is for, and finding it there is worth more than
 * being shown it earlier.
 *
 * NOT ON /daybook ITSELF, where a two-line summary directly above the
 * full log is just the page apologising for itself.
 *
 * The rows are a slice of the same list the page renders, so the strip
 * and the log can never disagree about what shipped.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DAYBOOK_STRIP, dayLabel } from "@/data/daybook";
import "@/components/home/pressing-home.css";

export function PressingDaybook() {
  const path = usePathname();
  if (path === "/daybook") return null;

  return (
    <section className="hero-breakout stratum" id="stDaybook">
      <div className="shead">
        <span className="slbl">Daybook</span>
        <Link className="slink" href="/daybook">
          The full log &rarr;
        </Link>
      </div>
      <div className="dbrows">
        {DAYBOOK_STRIP.map((e) => (
          <article className="dbrow" key={e.id}>
            <span className="dbd">{dayLabel(e.date)}</span>
            {/* A post's first line only. The strip carries the entry;
                the page carries the argument. */}
            <p className="dbt">{Array.isArray(e.body) ? e.body[0] : e.body}</p>
            <span className="dbp">{e.project}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
