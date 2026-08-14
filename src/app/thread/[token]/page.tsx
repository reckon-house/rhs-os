import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readThread } from "@/lib/messages";
import { ThreadReply } from "./ThreadReply";
import styles from "./thread.module.css";

/* ── /thread/[token] ────────────────────────────────────────────────
 * One conversation, reached by its token and nothing else.
 *
 * Server-rendered on purpose: someone arrives here from an email days
 * later, and a client fetch would show them an empty frame first. The
 * whole thread is in the HTML on the first paint.
 *
 * NEVER INDEXED, NEVER CACHED. noindex keeps it out of search, and
 * force-dynamic keeps a private thread from being handed to the next
 * person by a shared cache. A wrong token is a 404, exactly like a
 * malformed one, so nothing here confirms a thread exists.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your thread",
  robots: { index: false, follow: false },
};

function when(iso: string): string {
  /* Formatted from parts rather than toLocaleDateString: that reads the
     RUNTIME's locale, so the server and the browser can disagree about
     the same timestamp and React logs a hydration mismatch. */
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const d = new Date(iso);
  return `${M[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const thread = await readThread(token);
  if (!thread) notFound();

  return (
    <div className="pressing isolate relative w-full">
      <div
        aria-hidden
        className="hero-breakout absolute top-0 bottom-0 -z-10"
        style={{ background: "var(--pp-paper)" }}
      />
      <div className={styles.page}>
        <header className={styles.head}>
          <span className={styles.lbl}>
            {thread.name ? `${thread.name} and Reckon House` : "Your thread"}
          </span>
          <span className={`${styles.lbl} ${styles.grey}`}>
            Opened {when(thread.created_at)}
          </span>
        </header>

        {/* The questions they put to the house before writing. This is
            what makes the thread worth having rather than a form
            submission, so it is shown to them too: it says plainly what
            was carried over, instead of quietly attaching it. */}
        {thread.transcript.length > 0 ? (
          <section className={styles.carried}>
            <span className={`${styles.lbl} ${styles.grey}`}>Carried over</span>
            <p className={styles.terms}>{thread.transcript.join(" · ")}</p>
          </section>
        ) : null}

        <section className={styles.thread}>
          {thread.messages.map((m, i) => (
            <article
              key={i}
              className={`${styles.msg} ${m.author === "house" ? styles.house : ""}`}
            >
              <span className={styles.who}>
                {m.author === "house" ? "Jeremy" : thread.name || "You"}
              </span>
              {/* Plain text, rendered as text. Never dangerouslySetInnerHTML
                  here: this is a stranger's writing coming back out of a
                  database onto a page. */}
              <p className={styles.body}>{m.body}</p>
              <span className={`${styles.lbl} ${styles.grey} ${styles.stamp}`}>
                {when(m.created_at)}
              </span>
            </article>
          ))}
        </section>

        <ThreadReply token={token} />

        <p className={styles.back}>
          <Link href="/">Back to the house</Link>
        </p>
      </div>
    </div>
  );
}
