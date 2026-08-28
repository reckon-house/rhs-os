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
          {/* The standing rule, pinned, the same one the daybook and
              the homepage carry. */}
          <div className="ixrules ixrule1" aria-hidden="true">
            <div className="ixrulesPin" />
          </div>

          {/* The lede stands in the column the calendar stands in, the
              same as every other page here. */}
          {/* His line, verbatim — "Let's talk about what you have in
              mind" is the sentence he wrote for the contact beat. The
              earlier lede ("I'll come having read whatever you want to
              tell me first") failed his own test: nobody has ever said
              a sentence shaped like that out loud. */}
          <h1 className={`statement ${styles.lede}`}>
            Let&rsquo;s talk about what you have in mind.{" "}
            <span className="dim">
              Pick a time that works, it&rsquo;s a {SLOT_MINUTES} minute
              call. If you want to send anything over first, I&rsquo;ll
              read it before we talk.
            </span>
          </h1>

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

          <div className={styles.body}>
            <BookingCalendar days={days} />
          </div>
        </div>
      </section>
    </div>
  );
}
