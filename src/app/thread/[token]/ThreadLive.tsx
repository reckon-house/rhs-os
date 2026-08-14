"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./thread.module.css";

/* ── The thread stays live while someone is reading it ──────────────
 *
 * Jeremy answers from his own tooling against the database. Before
 * this, his reply sat there until the visitor happened to reload —
 * which for the person who wrote in ten minutes ago and is still on the
 * site means it never arrives at all. This watches for it and lets the
 * page re-render when it lands.
 *
 * IT REFRESHES THE SERVER COMPONENT, IT DOES NOT RENDER MESSAGES. The
 * page's own note is that the database is the record and the page is a
 * view of it; a poller that pushed messages into React state would be a
 * second copy of the thread, and two copies are how a conversation
 * starts disagreeing with itself. So the fetch here decides ONE thing —
 * has anything changed — and hands the rendering back to the server.
 *
 * WHAT IT COSTS SOMEONE ELSE'S BATTERY IS THE DESIGN CONSTRAINT.
 * Nothing polls in a hidden tab (the listener stops the timer outright,
 * and a return to the tab checks immediately, which is exactly when
 * someone is looking). The cadence opens out the longer nothing
 * happens, 8s while a conversation is live and 45s once it plainly is
 * not, and it gives up entirely after a long silence rather than
 * pinging from an abandoned tab all afternoon. Focus or a visibility
 * change starts it over.
 *
 * The signature is a prop, not state: it comes from the same server
 * render that drew the messages, so the baseline can never disagree
 * with what is on screen — including after the visitor sends their own
 * message and ThreadReply refreshes the page underneath this.
 */

const LIVE = 8000;
const SETTLED = 20000;
const IDLE = 45000;
/** Roughly twenty minutes of nothing, then it stops asking. */
const GIVE_UP = 60;

export function ThreadLive({
  token,
  signature,
}: {
  token: string;
  /** `${count}:${last stamp}` from the server's own render of the thread. */
  signature: string;
}) {
  const router = useRouter();
  const base = useRef(signature);
  const [said, setSaid] = useState("");

  /* The server has re-rendered with whatever arrived; that is the new
     baseline. Without this the poller would see a change forever and
     refresh in a loop. */
  useEffect(() => {
    base.current = signature;
  }, [signature]);

  useEffect(() => {
    let timer: number | undefined;
    let quiet = 0;
    let stopped = false;

    const cadence = () => (quiet < 8 ? LIVE : quiet < 20 ? SETTLED : IDLE);

    const arm = () => {
      window.clearTimeout(timer);
      if (stopped || quiet > GIVE_UP) return;
      timer = window.setTimeout(poll, cadence());
    };

    async function poll() {
      if (document.visibilityState !== "visible") return; // re-armed on return
      try {
        const r = await fetch(`/api/thread/${encodeURIComponent(token)}`, {
          cache: "no-store",
        });
        if (!r.ok) {
          /* A 404 here means the thread is gone, not that the network
             blinked. Nothing to watch, so stop rather than retry. */
          stopped = true;
          return;
        }
        const j = (await r.json()) as {
          ok?: boolean;
          thread?: { messages?: { author: string; created_at: string }[] };
        };
        const msgs = j.thread?.messages ?? [];
        const sig = `${msgs.length}:${msgs[msgs.length - 1]?.created_at ?? ""}`;
        if (sig !== base.current) {
          base.current = sig;
          quiet = 0;
          /* Announced for a screen reader, which otherwise gets a page
             that silently grew a paragraph. Only when the new message
             is HIS: the visitor knows what they just sent. */
          if (msgs[msgs.length - 1]?.author === "house") setSaid("Jeremy replied.");
          router.refresh();
        } else {
          quiet += 1;
        }
      } catch {
        /* Offline, asleep, a dropped request. Not worth surfacing on a
           page whose content is already correct — just slow down. */
        quiet += 1;
      } finally {
        arm();
      }
    }

    const wake = () => {
      if (document.visibilityState !== "visible") {
        window.clearTimeout(timer);
        return;
      }
      quiet = 0;
      stopped = false;
      window.clearTimeout(timer);
      timer = window.setTimeout(poll, 400);
    };

    document.addEventListener("visibilitychange", wake);
    window.addEventListener("focus", wake);
    arm();

    return () => {
      stopped = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("focus", wake);
    };
  }, [token, router]);

  return (
    <p aria-live="polite" className={styles.live}>
      {said}
    </p>
  );
}
