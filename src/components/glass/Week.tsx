"use client";

/* ── THE WEEK, IN A COLUMN ─────────────────────────────────────────────
 * /book's own calendar, moved into the column system rather than
 * rebuilt in it: the rotated month, the stacked display numerals, the
 * day that floods to ink with its hours beside it, and the form
 * hanging off its own rules. Variant F of lab/book-variants.html,
 * which the page has worn since it was built, at column measure and
 * with the colours as variables so the whole drawing reverses in the
 * house's black room. The board's Connect column books the same way
 * in smaller clothes; this is the drawing both of them meant.
 *
 * TWO WAYS IN, ONE COMPONENT. Given `days`, it renders them at once,
 * which is how /book serves a week that is readable without a script.
 * Given none, it asks `/api/book` on mount, which is how a static page
 * gets one. Either way the times are the same availability() the page
 * and the board read, per request, never cached: a calendar drawn from
 * the rules alone would lie the moment anyone claimed a slot.
 *
 * TWO CLOCKS, ONE INSTANT. Every slot carries a UTC instant from the
 * server and renders in the reader's own zone, with the house zone
 * named underneath when the two differ. A reader in London offered
 * "9:00" with no zone is a no-show, and that is the one failure here
 * that costs the meeting rather than the polish.
 */

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Day } from "@/lib/booking";
import { HOUSE_TZ, SLOT_MINUTES } from "@/data/booking";
import styles from "./glass.module.css";

type Sending = "idle" | "sending" | "done";

const NO_SUB = () => () => {};
/* Cached, because getSnapshot must be referentially stable or React
   loops: a fresh string every call reads as a change every render. */
let ZONE: string | null | undefined;
function readZone(): string | null {
  if (ZONE === undefined) {
    try {
      ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
    } catch {
      ZONE = null;
    }
  }
  return ZONE;
}

const firstOpen = (days: Day[]) => days.find((d) => d.slots.some((s) => s.open))?.date ?? null;

/** The month the week belongs to: the first day with an opening, as
 *  the spine has always named it. */
export function monthOf(days: Day[], fmt?: Intl.DateTimeFormat) {
  const f = fmt ?? new Intl.DateTimeFormat("en-US", { month: "short" });
  const first = days.find((d) => d.slots.some((s) => s.open)) ?? days[0];
  return first ? f.format(new Date(`${first.date}T12:00:00Z`)) : "";
}

/** The spine. Its own element, so it can stand where the page has
 *  always stood it: under the lede, beside the days. */
export function Month({ days }: { days: Day[] }) {
  return (
    <div className={styles.month} aria-hidden="true">
      {monthOf(days).toUpperCase()}
    </div>
  );
}

export function Week({
  days: given,
  minutes = SLOT_MINUTES,
  /* the month, named small over the days. Off where the spine is
     already saying it in the column alongside. */
  month = true,
  /* what the column says while it is asking, and if the times will not
     come: a week that cannot be drawn says so and gives the address */
  wait = "Loading the week",
  down = "Times are down right now. hello@reckon.house works.",
}: {
  days?: Day[];
  minutes?: number;
  month?: boolean;
  wait?: string;
  down?: string;
}) {
  const [days, setDays] = useState<Day[]>(given ?? []);
  const [asking, setAsking] = useState(!given);
  const [failed, setFailed] = useState(false);
  const [openDay, setOpenDay] = useState<string | null>(() => (given ? firstOpen(given) : null));
  const [picked, setPicked] = useState<string | null>(null);
  const [state, setState] = useState<Sending>("idle");
  const [why, setWhy] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [when, setWhen] = useState("");
  /* Slots that turned out to be gone. Kept client-side and merged into
     the render, so losing a race greys the time they were looking at
     rather than only telling them in a sentence. */
  const [gone, setGone] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement | null>(null);

  /* the week, when the page did not bring one */
  useEffect(() => {
    if (given) return;
    let live = true;
    fetch("/api/book", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { ok?: boolean; days?: Day[] } | null) => {
        if (!live) return;
        const week = j?.ok && Array.isArray(j.days) ? j.days : null;
        if (week?.length) {
          setDays(week);
          setOpenDay(firstOpen(week));
        } else setFailed(true);
        setAsking(false);
      })
      .catch(() => {
        if (!live) return;
        setFailed(true);
        setAsking(false);
      });
    return () => {
      live = false;
    };
  }, [given]);

  /* THE READER'S ZONE IS A CLIENT-ONLY FACT, so it is read the way
     React reads those: a server snapshot of null and a client snapshot
     of the real thing. Never changes while the page is open, so the
     subscribe is a no-op. */
  const tz = useSyncExternalStore(NO_SUB, readZone, () => null);
  const local = useMemo(
    () => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    []
  );
  const wd = useMemo(() => new Intl.DateTimeFormat("en-US", { weekday: "short" }), []);
  const wd1 = useMemo(() => new Intl.DateTimeFormat("en-US", { weekday: "narrow" }), []);
  const dd = useMemo(() => new Intl.DateTimeFormat("en-US", { day: "2-digit" }), []);
  const mo = useMemo(() => new Intl.DateTimeFormat("en-US", { month: "short" }), []);
  const differs = Boolean(tz && tz !== HOUSE_TZ);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!picked || state === "sending") return;
    const fd = new FormData(formRef.current!);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setWhy(name ? "That email address looks wrong." : "A name, so I know who I'm meeting.");
      return;
    }
    setState("sending");
    setWhy("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          at: picked,
          name,
          email,
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
         week as well as in words: the time they were looking at goes. */
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
      <div className={styles.week}>
        <p className={styles.doneLine}>
          Booked. {minutes} minutes{when ? `, ${when}` : ""}.
        </p>
        <p className={styles.doneNote}>
          A confirmation is on its way to your inbox.
          {token ? " You can add anything else to the thread before we talk." : ""}
        </p>
        {token ? (
          <p className={styles.doneNote}>
            <Link className={styles.link} href={`/thread/${token}`}>
              Open the thread
            </Link>
          </p>
        ) : null}
      </div>
    );
  }

  if (asking) return <p className={styles.say}>{wait}</p>;
  if (failed || !days.length) return <p className={styles.say}>{down}</p>;

  return (
    <div className={styles.week}>
      {month ? <p className={styles.tz}>{monthOf(days, mo).toUpperCase()}</p> : null}
      <div role="group" aria-label="Available times">
        {days.map((d) => {
          const dt = new Date(`${d.date}T12:00:00Z`);
          const open = d.slots.filter((s) => s.open && !gone.includes(s.at)).length;
          const shown = openDay === d.date && open > 0;
          /* the month is named on a day only once the week has crossed
             into the next one: an 01 under an AUG spine would be a
             small lie */
          const crossed = mo.format(dt) !== monthOf(days, mo);
          return (
            <div
              key={d.date}
              className={`${styles.day} ${shown ? styles.dayOpen : ""} ${open ? "" : styles.shut}`}
              /* the hand moves the drawer, and it never closes to
                 nothing on its own: an open day is information */
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse" && open) setOpenDay(d.date);
              }}
            >
              <button
                type="button"
                className={styles.dayBtn}
                disabled={!open}
                aria-expanded={shown}
                aria-label={`${wd.format(dt)} ${dd.format(dt)} ${mo.format(dt)}, ${
                  open ? `${open} times open` : "nothing open"
                }`}
                onClick={() => setOpenDay(shown ? null : d.date)}
              >
                <span className={styles.num}>{dd.format(dt)}</span>
                <span className={styles.wd}>
                  {wd1.format(dt)}
                  {crossed ? <span className={styles.mox}>{mo.format(dt)}</span> : null}
                </span>
              </button>
              <div className={styles.times}>
                {d.slots.map((s) => {
                  const taken = gone.includes(s.at);
                  const label = local.format(new Date(s.at)).replace(" ", "");
                  return s.open && !taken ? (
                    <button
                      key={s.at}
                      type="button"
                      className={`${styles.slot} ${picked === s.at ? styles.on : ""}`}
                      aria-pressed={picked === s.at}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPicked(s.at);
                        setWhy("");
                      }}
                    >
                      {label}
                    </button>
                  ) : (
                    /* Not a button, not focusable, and it says nothing
                       about why. Most closed slots are simply never
                       offered, and calling those booked would be a
                       small lie on the one page where somebody is
                       deciding to trust the practice. */
                    <span key={s.at} className={styles.closed} aria-disabled="true">
                      {label}
                    </span>
                  );
                })}
              </div>
              <span className={styles.free} aria-hidden="true">
                {open ? `${open} open` : "\u2014"}
              </span>
            </div>
          );
        })}
      </div>

      {differs ? (
        <p className={styles.tz}>
          Times are yours. Mine are {HOUSE_TZ.split("/")[1].replace("_", " ")}.
        </p>
      ) : null}

      <form ref={formRef} className={styles.claim} onSubmit={submit}>
        {/* No placeholders. The label above each field already says what
            it is, and a second grey sentence inside the box was the one
            thing on this page saying something twice. */}
        <div className={styles.frow}>
          <label className={styles.lbl} htmlFor="bkName">
            Name
          </label>
          <input
            className={styles.field}
            id="bkName"
            name="name"
            type="text"
            maxLength={120}
            autoComplete="name"
            required
          />
        </div>
        <div className={styles.frow}>
          <label className={styles.lbl} htmlFor="bkMail">
            Email
          </label>
          <input
            className={styles.field}
            id="bkMail"
            name="email"
            type="email"
            maxLength={254}
            autoComplete="email"
            required
          />
        </div>
        <div className={styles.frow}>
          <label className={styles.lbl} htmlFor="bkNote">
            Feel free to leave a note
          </label>
          <textarea
            className={`${styles.field} ${styles.area}`}
            id="bkNote"
            name="note"
            rows={3}
            maxLength={4000}
          />
        </div>
        {/* the honeypot, same as the contact form */}
        <input
          className={styles.hp}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <div className={styles.foot}>
          <button className={styles.send} type="submit" disabled={!picked || state === "sending"}>
            {state === "sending"
              ? "Booking"
              : picked
                ? `Book ${wd.format(new Date(picked))} ${local.format(new Date(picked)).replace(" ", "")}`
                : `Book ${minutes} minutes`}
          </button>
          {why ? (
            <span className={styles.why} role="status">
              {why}
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
