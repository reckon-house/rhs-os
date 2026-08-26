/**
 * /api/book — a booking is a message with a time on it.
 *
 * Deliberately not a second system. The slot is claimed, and then the
 * SAME openThread the contact form uses records it, so a booking lands
 * in the inbox Jeremy already reads, gets the token page he already
 * replies from, and can be answered before the call rather than living
 * in a calendar product nobody opens.
 *
 * ORDER: CLAIM, THEN THREAD. The slot is the scarce thing and the only
 * one that can be lost to a race, so it goes first and nothing else
 * happens until it is held.
 *
 * The other way round is tempting and wrong, which is how it was
 * written first: opening the thread first means every LOST race writes
 * a message row while the visitor is told nothing saved, which is both
 * junk in the table and a small lie on the screen. This way the only
 * failure that can strand anything is a thread that will not open after
 * a slot is held, and that strands nothing: the booking row carries the
 * name, the email and the note, so the meeting is real and reachable
 * even with no thread behind it.
 *
 * WHAT THE CLIENT IS TRUSTED WITH: nothing. It sends an instant, and
 * isOfferable re-derives from the authored windows whether that instant
 * was ever on offer. The page's own grid is not evidence — it came from
 * this server, but it came back through a browser.
 */
import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { claimSlot, isOfferable, bookingReady, linkThread } from "@/lib/booking";
import { LIMITS, openThread, storeReady } from "@/lib/messages";
import { notifyBookingConfirmed, notifyNewMessage } from "@/lib/notify";
import { HOUSE_TZ, SLOT_MINUTES } from "@/data/booking";

export const runtime = "nodejs";

const EMAILISH = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** "Monday 25 August, 9:30am (Central)" — the confirmation has to name
 *  the zone, or a reader elsewhere books a number rather than a time. */
function spoken(iso: string): string {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: HOUSE_TZ, weekday: "long", day: "numeric", month: "long",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: HOUSE_TZ, hour: "numeric", minute: "2-digit", hour12: true,
  }).format(d).toLowerCase().replace(" ", "");
  return `${day}, ${time} Central`;
}

export async function POST(req: NextRequest) {
  if (!bookingReady || !storeReady) {
    return NextResponse.json(
      { ok: false, why: "Booking is not connected yet. hello@reckon.house reaches me directly." },
      { status: 503 }
    );
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, why: "Malformed request." }, { status: 400 });
  }

  /* Answered as if it worked, same as the contact form. */
  if (typeof raw.company === "string" && raw.company.trim() !== "") {
    return NextResponse.json({ ok: true, token: null });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const at = str(raw.at);
  const name = str(raw.name).slice(0, LIMITS.name);
  const email = str(raw.email).slice(0, LIMITS.email);
  const note = str(raw.note).slice(0, LIMITS.body);

  if (!name) return NextResponse.json({ ok: false, why: "A name, so I know who I'm meeting." }, { status: 400 });
  if (!email || !EMAILISH.test(email))
    return NextResponse.json({ ok: false, why: "That email address looks wrong." }, { status: 400 });

  /* The slot is re-derived, never accepted. */
  if (!at || !isOfferable(at))
    return NextResponse.json({ ok: false, why: "That time isn't open. Pick another." }, { status: 400 });

  const when = spoken(at);
  const transcript = Array.isArray(raw.transcript)
    ? raw.transcript.filter((t): t is string => typeof t === "string")
        .map((t) => t.trim().slice(0, 200)).filter(Boolean).slice(0, LIMITS.transcript)
    : [];

  /* The claim first: see the note at the top. */
  const claim = await claimSlot({ at, name, email, note: note || undefined, token: null });
  if (!claim.ok) {
    if (claim.why === "taken")
      return NextResponse.json(
        { ok: false, why: "Someone just took that one. Pick another and it's yours." },
        { status: 409 }
      );
    if (claim.why === "rate")
      return NextResponse.json(
        { ok: false, why: "Too many just came through. Try again shortly, or use hello@reckon.house." },
        { status: 429 }
      );
    return NextResponse.json(
      { ok: false, why: "That didn't save. hello@reckon.house reaches me directly." },
      { status: 500 }
    );
  }

  /* The slot is held, so the booking is real from here whatever else
     happens. The thread is the courtesy on top: it puts the booking in
     the inbox Jeremy already reads and gives the visitor somewhere to
     add to it. A thread that will not open is logged and swallowed, not
     surfaced — telling somebody their confirmed meeting half-failed is
     worse than the missing thread. */
  const body = `Booked ${SLOT_MINUTES} minutes, ${when}.` + (note ? `\n\n${note}` : "");
  const thread = await openThread({ name, email, body, transcript });
  const token = thread.ok ? thread.token : null;
  if (token) await linkThread(at, token);
  else console.warn("[book] slot held but no thread opened:", at);

  /* After the response, like the contact form: a slow mail API must not
     make a confirmed booking feel unconfirmed, and a Resend outage must
     not turn a claimed slot into a failed one on their screen.

     THE VISITOR'S MAIL GOES FIRST, and outside the token check. They are
     the one who just committed to a time and closed the tab, and the
     screen has already told them a confirmation is coming. A thread that
     failed to open is a reason to send it without a link, not a reason
     to skip it — the booking is held either way. */
  after(async () => {
    const conf = await notifyBookingConfirmed({
      to: email, name, when, minutes: SLOT_MINUTES, token,
    });
    if (!conf.ok) console.warn("[book] confirmation not sent:", conf.why);

    if (token) {
      const sent = await notifyNewMessage({ name, email, body, transcript, token });
      if (!sent.ok) console.warn("[book] alert not sent:", sent.why);
    }
  });

  return NextResponse.json({ ok: true, token, when });
}
