import { NextResponse } from "next/server";
import { appendMessage, cleanIntake, readThread, storeReady } from "@/lib/messages";

/* ── /api/thread/[token] ────────────────────────────────────────────
 * GET reads a thread, POST adds a visitor message to it.
 *
 * THE TOKEN IS AN ADDRESS, NOT A PASSWORD, and the difference decides
 * the shape of this file. It is 128 unguessable bits, so knowing it is
 * how you reach a thread — but the server does the looking up, and a
 * token that matches nothing is answered exactly like one that is
 * malformed. Nothing here reveals whether a given thread exists.
 *
 * The email address on a thread is never returned. The page needs a
 * name to greet someone and the messages to show them; it has no use
 * for the address, and anything the response carries is one XSS away
 * from being somewhere else.
 *
 * `author` is hardcoded "visitor". A reply is written by Jeremy through
 * his own tooling against the store directly, so there is no route on
 * the public internet that can write a message as the house.
 */

export const runtime = "nodejs";

const GONE = { ok: false as const, why: "No such thread." };

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  if (!storeReady) return NextResponse.json(GONE, { status: 404 });
  const { token } = await params;
  const thread = await readThread(token);
  if (!thread) return NextResponse.json(GONE, { status: 404 });

  return NextResponse.json(
    {
      ok: true,
      thread: {
        name: thread.name,
        transcript: thread.transcript,
        created_at: thread.created_at,
        messages: thread.messages,
      },
    },
    /* A thread is private to whoever holds the link, so it must never
       sit in a shared cache on the way back. */
    { headers: { "Cache-Control": "no-store, private" } }
  );
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  if (!storeReady) return NextResponse.json(GONE, { status: 404 });
  const { token } = await params;

  let raw: Record<string, unknown>;
  try {
    raw = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, why: "Malformed request." }, { status: 400 });
  }

  if (typeof raw.company === "string" && raw.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  /* Only the body matters here: name and email belong to the thread and
     were settled when it opened, so a later message cannot rewrite who
     the thread says it is from. */
  const parsed = cleanIntake({ body: raw.body });
  if (!parsed.ok) return NextResponse.json({ ok: false, why: parsed.why }, { status: 400 });

  const done = await appendMessage(token, "visitor", parsed.value.body);
  if (!done) return NextResponse.json(GONE, { status: 404 });
  return NextResponse.json({ ok: true });
}
