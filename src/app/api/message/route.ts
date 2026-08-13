import { NextResponse } from "next/server";
import { cleanIntake, openThread, overRate, storeReady } from "@/lib/messages";

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

  if (await overRate()) {
    return NextResponse.json(
      { ok: false, why: "Too many messages just came through. Try again shortly, or use hello@reckon.house." },
      { status: 429 }
    );
  }

  try {
    const token = await openThread(parsed.value);
    return NextResponse.json({ ok: true, token });
  } catch {
    /* The real error goes to the server log, never to the response: a
       database message in a 500 body tells a stranger the schema. */
    return NextResponse.json(
      { ok: false, why: "That did not save. hello@reckon.house reaches me directly." },
      { status: 500 }
    );
  }
}
