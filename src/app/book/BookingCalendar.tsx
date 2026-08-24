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

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Day } from "@/lib/booking";
import { HOUSE_TZ, SLOT_MINUTES } from "@/data/booking";
import styles from "./book.module.css";

type Sending = "idle" | "sending" | "done";

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

  /* The reader's zone, read after mount: on the server there is no such
     thing, and guessing produces a page that changes under them. */
  const [tz, setTz] = useState<string | null>(null);
  useEffect(() => {
    try { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch { /* older engine */ }
  }, []);

  const local = useMemo(
    () => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    []
  );
  const dayName = useMemo(
    () => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }),
    []
  );

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
      <div className={styles.grid} role="group" aria-label="Available times">
        {days.map((d) => (
          <div key={d.date} className={styles.day}>
            <h3 className={styles.dayHead}>
              {dayName.format(new Date(`${d.date}T12:00:00Z`))}
            </h3>
            <ul className={styles.slots}>
              {d.slots.map((s) => {
                const taken = gone.includes(s.at);
                const open = s.open && !taken;
                const label = local.format(new Date(s.at));
                return (
                  <li key={s.at}>
                    {open ? (
                      <button
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
                         screen reader should read the same shape of week
                         a sighted reader sees. */
                      <span className={styles.closed} aria-disabled="true">{label}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {differs ? (
        <p className={styles.tz}>
          Times are yours. Mine are {HOUSE_TZ.split("/")[1].replace("_", " ")}.
        </p>
      ) : null}

      <form ref={formRef} className={styles.form} onSubmit={submit}>
        <div className={styles.row}>
          <label className={styles.lbl} htmlFor="bkName">Name</label>
          <input className={styles.field} id="bkName" name="name" type="text"
            maxLength={120} autoComplete="name" required placeholder="Your name" />
        </div>
        <div className={styles.row}>
          <label className={styles.lbl} htmlFor="bkMail">Email</label>
          <input className={styles.field} id="bkMail" name="email" type="email"
            maxLength={254} autoComplete="email" required placeholder="So I can confirm" />
        </div>
        <div className={styles.row}>
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
