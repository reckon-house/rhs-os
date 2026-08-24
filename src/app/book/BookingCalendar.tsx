"use client";

/* ── The calendar ────────────────────────────────────────────────────
 *
 * The whole grid renders. Open slots are live; everything else is a
 * quiet box that says nothing about WHY it is closed, because most of
 * them are simply not offered and calling those "booked" would be a
 * small lie on the one page where somebody is deciding to trust the
 * practice. See src/data/booking.ts.
 *
 * TWO CLOCKS, ONE INSTANT. Every slot carries a UTC instant from the
 * server and renders in the reader's own zone; the house zone is named
 * underneath when the two differ. A reader in London offered "9:00"
 * with no zone is a no-show, and that is the one failure here that
 * costs the meeting rather than the polish.
 *
 * THE PAGE IS COMPLETE BEFORE THE SCRIPT RUNS. Slots arrive rendered
 * from the server, so the grid is readable without JavaScript and the
 * only thing hydration adds is the ability to claim one.
 */

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Day } from "@/lib/booking";
import { HOUSE_TZ, SLOT_MINUTES } from "@/data/booking";
import styles from "./book.module.css";

type Sending = "idle" | "sending" | "done";

const NO_SUB = () => () => {};
/* Cached, because getSnapshot must be referentially stable or React
   loops: a fresh string every call reads as a change every render. */
let ZONE: string | null | undefined;
function readZone(): string | null {
  if (ZONE === undefined) {
    try { ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone ?? null; }
    catch { ZONE = null; }
  }
  return ZONE;
}

export function BookingCalendar({ days }: { days: Day[] }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [state, setState] = useState<Sending>("idle");
  const [why, setWhy] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [when, setWhen] = useState("");
  /* Slots that turned out to be gone. Kept client-side and merged into
     the render, so losing a race greys the box the visitor was looking
     at rather than only telling them in a sentence. */
  const [gone, setGone] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement | null>(null);

  /* THE READER'S ZONE IS A CLIENT-ONLY FACT, so it is read the way
     React reads those: a server snapshot of null and a client snapshot
     of the real thing. An effect calling setState would say the same
     thing and cascade a render to do it. Never changes while the page
     is open, so the subscribe is a no-op. */
  const tz = useSyncExternalStore(NO_SUB, readZone, () => null);

  const local = useMemo(
    () => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    []
  );
  /* Split rather than formatted whole: the row wants the weekday as a
     small caps label and the date as a display numeral, which is the
     move every one of the references makes. */
  const wd = useMemo(() => new Intl.DateTimeFormat("en-US", { weekday: "short" }), []);
  const dd = useMemo(() => new Intl.DateTimeFormat("en-US", { day: "2-digit" }), []);
  const mo = useMemo(() => new Intl.DateTimeFormat("en-US", { month: "short" }), []);

  const differs = Boolean(tz && tz !== HOUSE_TZ);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!picked || state === "sending") return;
    const fd = new FormData(formRef.current!);
    setState("sending");
    setWhy("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          at: picked,
          name: fd.get("name"),
          email: fd.get("email"),
          note: fd.get("note"),
          company: fd.get("company"),
        }),
      });
      const j = await res.json();
      if (j.ok) {
        setToken(j.token ?? null);
        setWhen(j.when ?? "");
        setState("done");
        return;
      }
      /* 409 is the race, and it is the one failure worth showing on the
         grid as well as in words: the slot they were looking at goes. */
      if (res.status === 409 && picked) {
        setGone((g) => [...g, picked]);
        setPicked(null);
      }
      setWhy(j.why || "That didn't go through.");
      setState("idle");
    } catch {
      setWhy("That didn't go through. hello@reckon.house reaches me directly.");
      setState("idle");
    }
  };

  if (state === "done") {
    return (
      <div className={styles.done}>
        <p className={styles.doneLine}>
          Booked. {SLOT_MINUTES} minutes{when ? `, ${when}` : ""}.
        </p>
        <p className={styles.doneNote}>
          A confirmation is on its way to your inbox.
          {token ? " You can add anything else to the thread before we talk." : ""}
        </p>
        {token ? (
          <p className={styles.doneNote}>
            <Link className={styles.link} href={`/thread/${token}`}>Open the thread</Link>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {/* A MATRIX, NOT A SET OF CARDS. Days run down and times run
          across, so every column is the same half-hour on five days and
          the shape of the week is legible before a single label is
          read. Hairlines carry the structure; there are no boxes,
          because a box around a time makes it a control and the point
          is that it is a piece of data that happens to be live. */}
      <div className={styles.grid} role="group" aria-label="Available times">
        {days.map((d) => {
          const dt = new Date(`${d.date}T12:00:00Z`);
          return (
            <div key={d.date} className={styles.row}>
              <div className={styles.date}>
                <span className={styles.wd}>{wd.format(dt)}</span>
                <span className={styles.num}>{dd.format(dt)}</span>
                <span className={styles.mo}>{mo.format(dt)}</span>
              </div>
              <div className={styles.times}>
                {d.slots.map((s) => {
                  const taken = gone.includes(s.at);
                  const open = s.open && !taken;
                  const label = local.format(new Date(s.at)).replace(" ", "");
                  return open ? (
                    <button
                      key={s.at}
                      type="button"
                      className={`${styles.slot} ${picked === s.at ? styles.on : ""}`}
                      aria-pressed={picked === s.at}
                      onClick={() => { setPicked(s.at); setWhy(""); }}
                    >
                      {label}
                    </button>
                  ) : (
                    /* Not a button, not focusable, and it says nothing
                       about why. aria-disabled rather than hidden: a
                       screen reader should read the same shape of week a
                       sighted reader sees. */
                    <span key={s.at} className={styles.closed} aria-disabled="true">
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {differs ? (
        <p className={styles.tz}>
          Times are yours. Mine are {HOUSE_TZ.split("/")[1].replace("_", " ")}.
        </p>
      ) : null}

      <form ref={formRef} className={styles.form} onSubmit={submit}>
        <div className={styles.frow}>
          <label className={styles.lbl} htmlFor="bkName">Name</label>
          <input className={styles.field} id="bkName" name="name" type="text"
            maxLength={120} autoComplete="name" required placeholder="Your name" />
        </div>
        <div className={styles.frow}>
          <label className={styles.lbl} htmlFor="bkMail">Email</label>
          <input className={styles.field} id="bkMail" name="email" type="email"
            maxLength={254} autoComplete="email" required placeholder="So I can confirm" />
        </div>
        <div className={styles.frow}>
          <label className={styles.lbl} htmlFor="bkNote">Anything to read first</label>
          <textarea className={`${styles.field} ${styles.area}`} id="bkNote" name="note"
            rows={3} maxLength={4000} placeholder="What you're working on. Optional." />
        </div>
        {/* The honeypot, same as the contact form. */}
        <input className={styles.hp} name="company" type="text" tabIndex={-1}
          autoComplete="off" aria-hidden="true" />

        <div className={styles.foot}>
          <button className={styles.send} type="submit" disabled={!picked || state === "sending"}>
            {state === "sending" ? "Booking" : picked ? "Book it" : "Pick a time"}
          </button>
          {why ? <span className={styles.why} role="status">{why}</span> : null}
        </div>
      </form>
    </div>
  );
}
