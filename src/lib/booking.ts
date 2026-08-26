/* ── Availability, and the one claim that has to be atomic ───────────
 *
 * The calendar is three facts layered:
 *
 *   WINDOWS   the hours Jeremy keeps. Every one renders.
 *   OPENINGS  which of them he is offering. Everything else is closed.
 *   TAKEN     which have actually been claimed. The only live one.
 *
 * The page needs all three because it shows the whole grid: a closed
 * slot and a claimed slot look identical on purpose, and neither says
 * which it is. See src/data/booking.ts for why that is the honest
 * choice rather than the coy one.
 *
 * TIMES ARE INSTANTS ONCE THEY LEAVE HERE. Everything Jeremy authors is
 * house-local wall-clock; everything stored or compared is a UTC
 * instant. Converting at this boundary means a daylight-saving change
 * moves the wall clock and never a stored row, and a visitor in London
 * is offered the same moment rather than the same number.
 */
import { createClient } from "@supabase/supabase-js";
import {
  DAYS_AHEAD, HOUSE_TZ, OPEN_DAYS, OPENINGS, SLOT_MINUTES, STANDING, WINDOWS,
} from "@/data/booking";

const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_ANON_KEY;

export const bookingReady = Boolean(URL_ && KEY);

function db() {
  if (!URL_ || !KEY) throw new Error("Booking store not configured");
  return createClient(URL_, KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface Slot {
  /** The instant, ISO. What the client sends back to claim it. */
  at: string;
  /** House-local wall clock, "09:30". For the row label. */
  house: string;
  /** Offered and not yet claimed. */
  open: boolean;
}

export interface Day {
  /** House-local date, "2026-08-25". */
  date: string;
  slots: Slot[];
}

/* ── house time, without a dependency ────────────────────────────────
   Intl knows every zone and every daylight rule the platform does, so
   the arithmetic below is a formatter read rather than a table nobody
   will remember to update. */
const HOUSE_PARTS = new Intl.DateTimeFormat("en-CA", {
  timeZone: HOUSE_TZ,
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hour12: false,
});

function houseFields(d: Date) {
  const p = Object.fromEntries(
    HOUSE_PARTS.formatToParts(d).filter((x) => x.type !== "literal").map((x) => [x.type, x.value])
  ) as Record<string, string>;
  /* Intl renders midnight as 24 in some locales. */
  const hour = p.hour === "24" ? "00" : p.hour;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${hour}:${p.minute}` };
}

/**
 * The instant at which a given house-local date and wall clock occurs.
 *
 * Solved rather than computed: guess the instant as if the wall clock
 * were UTC, ask what house time that guess actually lands on, and
 * correct by the difference. One correction is enough for every real
 * zone; the second pass only matters on the two days a year a
 * transition lands inside the offered window, and it costs nothing.
 */
function instantOf(date: string, time: string): Date {
  let guess = new Date(`${date}T${time}:00Z`);
  for (let i = 0; i < 2; i += 1) {
    const got = houseFields(guess);
    const wantMs = Date.parse(`${date}T${time}:00Z`);
    const gotMs = Date.parse(`${got.date}T${got.time}:00Z`);
    if (wantMs === gotMs) break;
    guess = new Date(guess.getTime() + (wantMs - gotMs));
  }
  return guess;
}

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const toClock = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** Every wall clock a window renders, in order. */
function windowTimes(): string[] {
  const out: string[] = [];
  for (const w of WINDOWS) {
    for (let m = toMin(w.from); m + SLOT_MINUTES <= toMin(w.to); m += SLOT_MINUTES) {
      out.push(toClock(m));
    }
  }
  return out;
}

/** The next DAYS_AHEAD open weekdays in house time, today included. */
function upcomingDates(now: Date): string[] {
  const out: string[] = [];
  const dayOf = new Intl.DateTimeFormat("en-US", { timeZone: HOUSE_TZ, weekday: "short" });
  for (let i = 0; out.length < DAYS_AHEAD && i < DAYS_AHEAD * 3; i += 1) {
    const d = new Date(now.getTime() + i * 86_400_000);
    const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dayOf.format(d));
    if (OPEN_DAYS.includes(wd)) out.push(houseFields(d).date);
  }
  return out;
}

/** Which wall clocks are OFFERED on a date: the list, or the standing
 *  rule when the list says nothing about that day. An empty array in
 *  OPENINGS is a deliberate closure and is respected. */
function offeredOn(date: string): Set<string> {
  const listed = OPENINGS[date];
  return new Set(listed ?? STANDING);
}

/**
 * The grid, ready to render.
 *
 * Never throws for the visitor's sake: if the store is unreachable the
 * calendar still draws with nothing claimed, which is wrong in the
 * direction that shows a slot that has gone rather than hiding one that
 * has not. The claim itself is atomic, so the worst case is one person
 * told "someone just took that" a moment later — a better failure than
 * a blank page where the booking form should be.
 */
export async function availability(now = new Date()): Promise<Day[]> {
  const dates = upcomingDates(now);
  const times = windowTimes();
  if (!dates.length) return [];

  const from = instantOf(dates[0], times[0]);
  const lastDay = dates[dates.length - 1];
  const to = new Date(instantOf(lastDay, times[times.length - 1]).getTime() + SLOT_MINUTES * 60_000);

  let taken = new Set<string>();
  if (bookingReady) {
    try {
      const { data, error } = await db().rpc("taken_slots", {
        p_from: from.toISOString(),
        p_to: to.toISOString(),
      });
      if (error) {
        /* Same reasoning as claim_slot: the page still draws, but the reason
           it drew a stale week belongs somewhere a person can read it. */
        console.error("[booking] taken_slots failed:", {
          code: error.code, message: error.message, hint: error.hint,
        });
      }
      if (Array.isArray(data)) {
        taken = new Set(
          data.map((r: { slot_at: string }) => new Date(r.slot_at).toISOString())
        );
      }
    } catch (e) {
      /* drawn as if nothing is taken; see the note above */
      console.error("[booking] taken_slots threw:", e instanceof Error ? e.message : e);
    }
  }

  return dates.map((date) => ({
    date,
    slots: times.map((house) => {
      const at = instantOf(date, house);
      const iso = at.toISOString();
      const offered = offeredOn(date).has(house);
      return {
        at: iso,
        house,
        /* Past is closed whatever the list says: the first day in the
           range is today, and half its window is usually behind us. */
        open: offered && !taken.has(iso) && at.getTime() > now.getTime(),
      };
    }),
  }));
}

/** Is this instant one the page would have offered? The route asks
 *  before it writes, so a crafted request cannot book 3am on a Sunday
 *  even though the database would happily store it. */
export function isOfferable(iso: string, now = new Date()): boolean {
  const at = new Date(iso);
  if (Number.isNaN(at.getTime()) || at.getTime() <= now.getTime()) return false;
  const { date, time } = houseFields(at);
  if (!upcomingDates(now).includes(date)) return false;
  if (!windowTimes().includes(time)) return false;
  return offeredOn(date).has(time);
}

export type ClaimResult = { ok: true } | { ok: false; why: "taken" | "rate" | "failed" };

/** Claim it. The uniqueness that makes this safe is in Postgres; this
 *  only translates the outcome. */
export async function claimSlot(v: {
  at: string; name: string; email: string; note?: string; token?: string | null;
}): Promise<ClaimResult> {
  if (!bookingReady) return { ok: false, why: "failed" };
  try {
    const { data, error } = await db().rpc("claim_slot", {
      p_slot: new Date(v.at).toISOString(),
      p_name: v.name,
      p_email: v.email,
      p_note: v.note ?? null,
      p_token: v.token ?? null,
    });
    /* THE VISITOR GETS ONE SENTENCE; THE LOG GETS THE REASON. This used to
       return "failed" and drop the error on the floor, which meant a booking
       that would not save looked identical from outside whether the function
       was missing, the grant was wrong, or Postgres was simply down — and the
       first real end-to-end test of this route hit exactly that wall.

       Postgres error codes are safe to log: 42883 is "function does not
       exist", 42501 is a missing grant, 42P01 is a missing table. None of
       them carry the visitor's details, which stay out on purpose. */
    if (error) {
      console.error("[booking] claim_slot failed:", {
        code: error.code, message: error.message,
        details: error.details, hint: error.hint,
      });
      return { ok: false, why: "failed" };
    }
    if (data === "ok") return { ok: true };
    if (data === "taken") return { ok: false, why: "taken" };
    if (data === "rate") return { ok: false, why: "rate" };
    console.error("[booking] claim_slot returned an unknown value:", data);
    return { ok: false, why: "failed" };
  } catch (e) {
    console.error("[booking] claim_slot threw:", e instanceof Error ? e.message : e);
    return { ok: false, why: "failed" };
  }
}

/** Attach the thread to the booking once it exists. Fire and forget:
 *  the meeting is already held and a missing link is a tidiness
 *  problem, not the visitor's. */
export async function linkThread(at: string, token: string): Promise<void> {
  if (!bookingReady) return;
  try {
    await db().rpc("link_booking_thread", {
      p_slot: new Date(at).toISOString(),
      p_token: token,
    });
  } catch {
    /* logged by the caller if it matters */
  }
}
