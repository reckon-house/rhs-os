import { NextResponse, after } from "next/server";
import { cleanIntake, openThread, storeReady } from "@/lib/messages";
import { notifyNewMessage } from "@/lib/notify";

/* ── POST /api/message ──────────────────────────────────────────────
 * Opens a thread. The browser sends what the visitor typed plus the
 * questions they already asked the house; it gets back a token and
 * nothing else.
 *
 * The route holds three guards and they are all cheap:
 *
 *  · A HONEYPOT. `company` is a field the form renders off-screen and a
 *    person never sees. Anything filled in was filled by a script, and
 *    the answer is a plain 200 with a token-shaped nothing — a bot that
 *    is told it failed learns to try again differently.
 *  · A GLOBAL HOURLY CAP, in the library. No per-IP tracking, because
 *    the precise version means storing addresses of people who are not
 *    even writing to you.
 *  · LENGTH AND SHAPE, in cleanIntake, mirrored by CHECK constraints on
 *    the columns. The route gives a person a usable error; the table
 *    keeps the guarantee whatever wrote to it.
 *
 * The reply says nothing about whether an address exists, whether a
 * thread already belonged to that person, or what is in the store.
 */

export const runtime = "nodejs";

/* ── the ceiling that survives a missing database ────────────────────
 * The real hourly cap lives inside open_thread, where it holds for
 * anything reaching the table. That is the right place for it and it is
 * unavailable in exactly the situation this file now handles: no store.
 *
 * Without a cap the fallback path is an unauthenticated endpoint that
 * sends mail, which is worth more to an abuser than a contact form. So
 * a counter in module scope, honest about what it is: Fluid Compute
 * reuses instances, so this holds within one and resets when a new one
 * starts. A speed bump, not a guarantee. The guarantee only ever
 * existed in Postgres, and that is the thing that is missing.
 */
const FALLBACK_CEILING = 8;
const HOUR = 3_600_000;
let fallbackSends: number[] = [];

function fallbackAllows(now: number): boolean {
  fallbackSends = fallbackSends.filter((t) => now - t < HOUR);
  if (fallbackSends.length >= FALLBACK_CEILING) return false;
  fallbackSends.push(now);
  return true;
}

export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, why: "Malformed request." }, { status: 400 });
  }

  // The honeypot, answered as if it worked.
  if (typeof raw.company === "string" && raw.company.trim() !== "") {
    return NextResponse.json({ ok: true, token: null });
  }

  const parsed = cleanIntake(raw);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, why: parsed.why }, { status: 400 });
  }

  /* THE MESSAGE MATTERS MORE THAN THE ARCHIVE, and it took losing a
     database to make that obvious. This used to store first and email
     only on success, so when the Supabase project was deleted every
     message vanished twice over: no row, and no mail either. The
     visitor was told it did not save, and that was the entire record of
     someone trying to get in touch.

     The store is still tried first, because a thread is worth having
     and the token has to come from somewhere. What changed is that
     failing to get one is no longer the end of the request. */
  const res = storeReady
    ? await openThread(parsed.value)
    : ({ ok: false, why: "failed" } as const);

  /* The one failure that IS the visitor's to act on, and only when the
     database is the thing saying so. */
  if (!res.ok && res.why === "rate") {
    return NextResponse.json(
      { ok: false, why: "Too many messages just came through. Try again shortly, or use hello@reckon.house." },
      { status: 429 }
    );
  }

  if (res.ok) {
    /* THE ALERT GOES OUT AFTER THE RESPONSE. `after` runs once the
       visitor already has their token, so a slow mail API cannot make
       the form feel slow, and a Resend outage cannot turn a saved
       message into a failed one on their screen. Safe precisely because
       the message is already in the database: a failed send is
       recoverable from `npm run inbox`, so nobody needs to be told. */
    after(async () => {
      const sent = await notifyNewMessage({ ...parsed.value, token: res.token });
      if (!sent.ok) console.warn("[message] new-message alert not sent:", sent.why);
    });
    return NextResponse.json({ ok: true, token: res.token });
  }

  /* NO STORE, SO THE EMAIL IS THE ONLY COPY — and that is the one case
     where it has to be awaited. `after` would let this return ok before
     knowing, and "ok" would then mean nothing at all: no row to recover
     from and no mail on its way. Slower, and only on the path that is
     already broken. */
  if (!fallbackAllows(Date.now())) {
    return NextResponse.json(
      { ok: false, why: "Too many messages just came through. Try again shortly, or use hello@reckon.house." },
      { status: 429 }
    );
  }

  console.error("[message] store unavailable, falling back to email only");
  const sent = await notifyNewMessage({ ...parsed.value, token: null });
  if (!sent.ok) {
    console.error("[message] fallback email failed too:", sent.why);
    /* Never the database's own error: a Postgres message in a 500 body
       describes the schema to a stranger. */
    return NextResponse.json(
      { ok: false, why: "That did not send. hello@reckon.house reaches me directly." },
      { status: 500 }
    );
  }

  /* It reached him, which is what the person actually wanted. There is
     no thread to offer, so the token is null and the form says its
     plain thank-you instead of pointing at a page that does not exist. */
  return NextResponse.json({ ok: true, token: null });
}
