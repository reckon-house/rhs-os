import type { Metadata } from "next";
import { PaperGround } from "@/components/shell/PaperGround";
import { availability } from "@/lib/booking";
import { SLOT_MINUTES } from "@/data/booking";
import { BookingCalendar } from "./BookingCalendar";
import styles from "./book.module.css";

export const metadata: Metadata = {
  title: "Book a call",
  description:
    "Thirty minutes with Jeremy Prasatik. Pick a time and tell me what you're working on.",
};

/* Availability is read per request, not baked: a slot claimed a minute
   ago has to be gone, and a statically rendered calendar is a calendar
   that lies as soon as anyone uses it. */
export const dynamic = "force-dynamic";

/* ── /book ──────────────────────────────────────────────────────────
 * Its own route rather than a block in the footer, for three reasons:
 * the contact beat is already carrying a headline, the method rows and
 * a four-column ledger; a calendar is a committal act that deserves the
 * room; and a URL is half of what a scheduling product is actually for,
 * so this one can be sent to somebody directly.
 *
 * The grid is computed on the server and rendered into the HTML, so the
 * week is readable without a script. The client component only adds the
 * ability to claim one.
 */
export default async function BookPage() {
  const days = await availability();

  return (
    <div className="pressing isolate relative w-full">
      {/* White paper, so the masthead's burn has white to filter. */}
      <PaperGround />
      <div
        aria-hidden
        className="hero-breakout absolute top-0 bottom-0 -z-10"
        style={{ background: "var(--pp-paper)" }}
      />

      <section className="hero-breakout stratum">
        <div className="ixbody">
          {/* BOTH standing rules, pinned — the homepage's own pair, not
              the single-boundary ixrule1 variant. The second lands at
              50% of the rules box, which is exactly the middle of the
              gutter now that the calendar splits its column 1fr 1fr on
              --ixgap: the line between the month and the dates is the
              same line the homepage draws between its two columns,
              drawn by the same rule. The calendar used to paint its
              own border on the days column, which sat hard against
              the ink band and got covered by it. */}
          <div className="ixrules" aria-hidden="true">
            <div className="ixrulesPin" />
          </div>

          {/* The lede stands in the column the calendar stands in, the
              same as every other page here. */}
          <div className={`ixnotes ${styles.rail}`}>
            <div className="blk">
              These are the times I&rsquo;m usually free. If none of them
              work, email hello@reckon.house and we&rsquo;ll find one that
              does.
            </div>
            <div className="blk">
              A booking opens a thread, so anything you add before we talk
              reaches me the same way a message does.
            </div>
          </div>

          {/* THE HOMEPAGE'S OWN GEOMETRY: the lede stands where the
              statement stands, the month below it, and the dates run
              on the other side of a thin grey rule — so /book and the
              homepage read as the same page doing two jobs. The lede
              rides in as the calendar's children so both halves share
              one grid. His line, verbatim — "Let's talk about what
              you have in mind" is the sentence he wrote for the
              contact beat; the earlier "I'll come having read" failed
              his own test: nobody has ever said a sentence shaped
              like that out loud. */}
          <div className={styles.body}>
            <BookingCalendar days={days}>
              <h1 className={`statement ${styles.lede}`}>
                Let&rsquo;s talk about what you have in mind.{" "}
                <span className="dim">
                  Pick a time that works, it&rsquo;s a {SLOT_MINUTES}{" "}
                  minute call. If you want to send anything over first,
                  I&rsquo;ll read it before we talk.
                </span>
              </h1>
            </BookingCalendar>
          </div>
        </div>
      </section>
    </div>
  );
}
