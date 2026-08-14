"use client";

/* ── PressingDaybook ────────────────────────────────────────────────
 * The last beat on the page: what got built lately, dated.
 *
 * It renders inside PressingReturn, between the work and the credit
 * line, which is what gives it the right place on both kinds of page
 * without either knowing about the other:
 *
 *   homepage      work index → contact → credits → daybook → credit line
 *   case study    the study  → contact → credits → ring → daybook → credit line
 *
 * NOT ON /daybook ITSELF, where a two-line summary directly above the
 * full log is just the page apologising for itself.
 *
 * The rows are a slice of the same list the page renders, so the strip
 * and the log can never disagree about what shipped. They arrive the
 * way the page's rows do (ledger-arrival), and a row that points at a
 * study floats that study's own homepage thumbnail on hover — evidence
 * from the app's real sources, authored by nobody.
 */

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DAYBOOK_STRIP, dayLabel, type DaybookEntry } from "@/data/daybook";
import { HoverPlate } from "@/components/daybook/HoverPlate";
import { useLedgerArrival } from "@/lib/ledger-arrival";
import "@/components/home/pressing-home.css";

const finePointer = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function StripRow({ e }: { e: DaybookEntry }) {
  const [seen, setSeen] = useState(false);
  const [on, setOn] = useState(false);
  const peekable = Boolean(e.link);

  return (
    <article
      className="dbrow"
      onPointerEnter={() => {
        if (!peekable || !finePointer()) return;
        setSeen(true);
        setOn(true);
      }}
      onPointerLeave={() => setOn(false)}
    >
      <span className="dbd">{dayLabel(e.date)}</span>
      {/* A post's first line only. The strip carries the entry; the
          page carries the argument. */}
      <p className="dbt">{Array.isArray(e.body) ? e.body[0] : e.body}</p>
      <span className="dbp">{e.project}</span>
      {seen && e.link ? <HoverPlate href={e.link.href} on={on} /> : null}
    </article>
  );
}

export function PressingDaybook() {
  const path = usePathname();
  const rootRef = useRef<HTMLElement | null>(null);
  useLedgerArrival(rootRef, ".dbrow", "dbpre");
  if (path === "/daybook") return null;

  return (
    <section className="hero-breakout stratum" id="stDaybook" ref={rootRef}>
      <div className="shead">
        <span className="slbl">Daybook</span>
        <Link className="slink" href="/daybook">
          The full log &rarr;
        </Link>
      </div>
      <div className="dbrows">
        {DAYBOOK_STRIP.map((e) => (
          <StripRow key={e.id} e={e} />
        ))}
      </div>
    </section>
  );
}
