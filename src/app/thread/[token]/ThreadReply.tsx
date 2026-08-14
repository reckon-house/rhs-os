"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./thread.module.css";

/* Adding to an existing thread. The only client code on this page: the
 * thread itself is server-rendered so it is whole on the first paint.
 *
 * The token comes from the URL the visitor is already on, so nothing is
 * chosen here. Name and email belong to the thread and were settled when
 * it opened, which is why they are not on this form: a later message
 * cannot rewrite who the thread says it is from.
 *
 * On success it refreshes the server component rather than pushing the
 * message into local state. The database is the record, the page is a
 * view of it, and keeping a second copy in React is how the two start
 * disagreeing about what was said.
 */
export function ThreadReply({ token }: { token: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text || busy) return;
    setBusy(true);
    setNote("Sending");
    try {
      const r = await fetch(`/api/thread/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      const j = (await r.json().catch(() => null)) as { ok?: boolean; why?: string } | null;
      if (j?.ok) {
        setBody("");
        setNote("");
        router.refresh();
      } else {
        setNote(j?.why ?? "That did not send. hello@reckon.house reaches me directly.");
      }
    } catch {
      setNote("That did not send. hello@reckon.house reaches me directly.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.reply} onSubmit={send}>
      <textarea
        className={styles.field}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add to this"
        rows={3}
        maxLength={4000}
      />
      <div className={styles.foot}>
        <button className={styles.send} type="submit" disabled={busy || !body.trim()}>
          Send
        </button>
        {note ? <span className={styles.note}>{note}</span> : null}
      </div>
    </form>
  );
}
