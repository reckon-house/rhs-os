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

export async function POST(req: Request) {
  if (!storeReady) {
    /* Not an error the visitor caused, and not one they can do anything
       about, so it says the one useful thing instead of a status code. */
    return NextResponse.json(
      { ok: false, why: "The message store is not connected yet. hello@reckon.house reaches me directly." },
      { status: 503 }
    );
  }

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

  /* The hourly ceiling is enforced INSIDE open_thread, so it holds for
     anything calling the database, not only for callers who came
     through this route. Here it is only translated into words. */
  const res = await openThread(parsed.value);
  if (!res.ok) {
    return res.why === "rate"
      ? NextResponse.json(
          { ok: false, why: "Too many messages just came through. Try again shortly, or use hello@reckon.house." },
          { status: 429 }
        )
      : NextResponse.json(
          /* Never the database's own error: a Postgres message in a 500
             body describes the schema to a stranger. */
          { ok: false, why: "That did not save. hello@reckon.house reaches me directly." },
          { status: 500 }
        );
  }
  /* THE ALERT GOES OUT AFTER THE RESPONSE, NOT BEFORE IT. `after` runs
     once the visitor already has their token, so a slow mail API cannot
     make the form feel slow, and a Resend outage cannot turn a saved
     message into a failed one on their screen. The message is in the
     database either way; the email is a courtesy to the person who owns
     the inbox.
     Nothing is awaited on the caller's path and nothing throws out of
     here: notifyNewMessage never rejects, it returns a reason. The
     reason is logged for the server, never returned — who gets told
     about a message is not a visitor's business. */
  after(async () => {
    const sent = await notifyNewMessage({ ...parsed.value, token: res.token });
    if (!sent.ok) console.warn("[message] new-message alert not sent:", sent.why);
  });

  return NextResponse.json({ ok: true, token: res.token });
}
