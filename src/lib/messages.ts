import "server-only";
import { createClient } from "@supabase/supabase-js";

/* ── The message store ──────────────────────────────────────────────
 * Someone asks the house about the work, then asks to reach Jeremy.
 * That becomes a thread, and the questions they already asked travel
 * with it, so the message does not arrive cold.
 *
 * THREE VERBS, NO TABLES. This talks to `open_thread`, `read_thread`
 * and `append_visitor_message`, which are the only things the anon role
 * is granted. It cannot select from a table, cannot enumerate threads,
 * and cannot write a message as the house — verified against the live
 * database as the anon role, not assumed from the grants.
 *
 * That is the second design. The first used the service role key, which
 * bypasses RLS wholesale and puts every guard in TypeScript one layer
 * above a credential that can do anything. The ceiling and the token
 * lookup now live INSIDE the functions, so they hold regardless of who
 * calls or what they skip on the way in. What is left out here is a
 * convenience, not a control.
 *
 * `server-only` keeps the key off the client, and the env var carries no
 * NEXT_PUBLIC_ prefix so Next would not inline it anyway. Neither is
 * load-bearing: a publishable key is meant to be public, and here being
 * public costs nothing.
 */

const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_ANON_KEY;

/** The site has to keep working without the store. A portfolio that
 *  500s on its contact form because an env var is missing is worse than
 *  one that falls back to the email address. */
export const storeReady = Boolean(URL_ && KEY);

function db() {
  if (!URL_ || !KEY) throw new Error("Message store not configured");
  return createClient(URL_, KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface ThreadMessage {
  author: "visitor" | "house";
  body: string;
  created_at: string;
}

export interface Thread {
  name: string | null;
  transcript: string[];
  created_at: string;
  messages: ThreadMessage[];
}

/* Caps match the CHECK constraints on the columns. Both exist: this one
   gives a person a usable error, the column keeps the guarantee
   whatever wrote to it. */
export const LIMITS = { name: 120, email: 254, body: 4000, transcript: 24 } as const;

/** Deliberately permissive. The job is catching a typo, not adjudicating
 *  RFC 5322: an over-strict pattern rejects real addresses, and the cost
 *  of a wrong one is a bounced notification. */
const EMAILISH = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN = /^[a-f0-9]{32}$/;

export type Intake = {
  name: string | null;
  email: string | null;
  body: string;
  transcript: string[];
};

export function cleanIntake(
  raw: { name?: unknown; email?: unknown; body?: unknown; transcript?: unknown }
): { ok: true; value: Intake } | { ok: false; why: string } {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const body = str(raw.body);
  if (!body) return { ok: false, why: "The message is empty." };
  if (body.length > LIMITS.body) return { ok: false, why: "That message is too long." };

  const name = str(raw.name).slice(0, LIMITS.name) || null;

  const email = str(raw.email).slice(0, LIMITS.email) || null;
  if (email && !EMAILISH.test(email)) return { ok: false, why: "That email address looks wrong." };

  /* Their own question history, sent by the page that collected it.
     Trimmed and capped rather than trusted: it arrives from the browser
     like everything else and lands in a jsonb column that would
     otherwise take whatever shape it was handed. */
  const transcript = Array.isArray(raw.transcript)
    ? raw.transcript
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.trim().slice(0, 200))
        .filter(Boolean)
        .slice(0, LIMITS.transcript)
    : [];

  return { ok: true, value: { name, email, body, transcript } };
}

export type OpenResult =
  | { ok: true; token: string }
  | { ok: false; why: "rate" | "failed" };

/** Opens a thread and records the first message, atomically: if the
 *  message violates a constraint the thread rolls back with it, so a
 *  contact is never recorded with nothing said. */
export async function openThread(v: Intake): Promise<OpenResult> {
  const { data, error } = await db().rpc("open_thread", {
    p_name: v.name,
    p_email: v.email,
    p_body: v.body,
    p_transcript: v.transcript,
  });
  if (error) {
    /* The ceiling raises inside the function. Distinguished here so the
       visitor is told to try again rather than that something broke. */
    const rate = /rate limited/i.test(error.message);
    return { ok: false, why: rate ? "rate" : "failed" };
  }
  return typeof data === "string" && data
    ? { ok: true, token: data }
    : { ok: false, why: "failed" };
}

/** The thread behind a token, or null. The token IS the lookup: there
 *  is no id-based path from outside, so a wrong token is simply a
 *  thread that does not exist. Never carries the email. */
export async function readThread(token: string): Promise<Thread | null> {
  if (!TOKEN.test(token)) return null;
  /* A thread cannot exist if there is nowhere to keep one. Returning
     null rather than letting db() throw is what makes a missing env var
     a 404 instead of a server-side exception page — which is exactly
     what production showed when SUPABASE_URL was absent there. The
     other two verbs are only reached from routes that check storeReady
     first; this one is read by a PAGE, and a page has no such gate. */
  if (!storeReady) return null;
  const { data, error } = await db().rpc("read_thread", { p_token: token });
  if (error || !data) return null;
  const t = data as {
    name: string | null;
    transcript: unknown;
    created_at: string;
    messages: unknown;
  };
  return {
    name: t.name ?? null,
    transcript: Array.isArray(t.transcript) ? (t.transcript as string[]) : [],
    created_at: t.created_at,
    messages: Array.isArray(t.messages) ? (t.messages as ThreadMessage[]) : [],
  };
}

/** Appends to an existing thread. The author is written by the function,
 *  never passed, so no public path can record a message as the house. */
export async function appendVisitorMessage(token: string, body: string): Promise<boolean> {
  if (!TOKEN.test(token)) return false;
  const { data, error } = await db().rpc("append_visitor_message", {
    p_token: token,
    p_body: body,
  });
  return !error && data === true;
}
