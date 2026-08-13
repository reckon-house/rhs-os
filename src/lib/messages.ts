import "server-only";
import { createClient } from "@supabase/supabase-js";

/* ── The message store ──────────────────────────────────────────────
 * Someone asks the house about the work, then asks to reach Jeremy.
 * That becomes a thread, and the questions they already asked travel
 * with it, so the message does not arrive cold.
 *
 * SERVER ONLY, and the `server-only` import at the top is the enforcement
 * rather than a convention: importing this from a client component is a
 * build error, not a runtime surprise. Everything here runs with the
 * service role key, which bypasses RLS by definition — the tables carry
 * RLS enabled with no policies, so anon and authenticated can reach
 * nothing at all and this module is the only door.
 *
 * That is deliberately the opposite of the usual Supabase shape. The
 * alternative is the anon key in the browser with policies keyed on the
 * thread token, which puts a working credential in every visitor's
 * devtools and makes one string both the address and the password. Here
 * the token is only an address: the server looks it up and decides.
 *
 * The key never reaches the client, so it must never be read into a
 * component, a loader, or anything with "use client" above it.
 */

const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;

/** Configured is a question the routes ask, because the site has to keep
 *  working without the store: a portfolio that 500s on its contact form
 *  because an env var is missing is worse than one that quietly falls
 *  back to the email address. */
export const storeReady = Boolean(URL_ && KEY);

function db() {
  if (!URL_ || !KEY) {
    throw new Error("Message store not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY)");
  }
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
  token: string;
  name: string | null;
  email: string | null;
  transcript: string[];
  created_at: string;
  messages: ThreadMessage[];
}

/* Caps match the database's CHECK constraints. Both exist on purpose:
   this one gives a person a usable error, the column gives the table a
   guarantee that holds no matter which path wrote to it. */
export const LIMITS = { name: 120, email: 254, body: 4000, transcript: 24 } as const;

/** Deliberately permissive. The job is to catch a typo, not to adjudicate
 *  RFC 5322 — an over-strict pattern rejects real addresses and the cost
 *  of a wrong one is only that a reply notification bounces. */
const EMAILISH = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanIntake(raw: {
  name?: unknown;
  email?: unknown;
  body?: unknown;
  transcript?: unknown;
}): { ok: true; value: { name: string | null; email: string | null; body: string; transcript: string[] } }
  | { ok: false; why: string } {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const body = str(raw.body);
  if (!body) return { ok: false, why: "The message is empty." };
  if (body.length > LIMITS.body) return { ok: false, why: "That message is too long." };

  const name = str(raw.name).slice(0, LIMITS.name) || null;

  const email = str(raw.email).slice(0, LIMITS.email) || null;
  if (email && !EMAILISH.test(email)) return { ok: false, why: "That email address looks wrong." };

  /* The visitor's own question history, sent by the page that collected
     it. Trimmed and capped here rather than trusted: it arrives from the
     browser like everything else, and it is written into a jsonb column
     that would otherwise take whatever shape it was handed. */
  const transcript = Array.isArray(raw.transcript)
    ? raw.transcript
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.trim().slice(0, 200))
        .filter(Boolean)
        .slice(0, LIMITS.transcript)
    : [];

  return { ok: true, value: { name, email, body, transcript } };
}

/**
 * A ceiling on how many threads can be opened in an hour, across
 * everyone.
 *
 * Crude on purpose. The precise thing is a per-IP limit, and that means
 * storing or hashing every visitor's address — collecting personal data
 * about people who are not even writing to you, in order to protect a
 * form that receives a few messages a month. A global cap needs nothing
 * about anyone. It cannot stop one determined person from using up the
 * hour, and that is a real limitation rather than an oversight: the
 * failure mode is a form that says "try again shortly", not a mailbox
 * full of junk or a bill.
 */
const HOURLY_THREADS = 20;

export async function overRate(): Promise<boolean> {
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count, error } = await db()
    .from("threads")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since);
  /* Fail OPEN. If the count itself is broken, refusing every message
     turns a store problem into a lost enquiry, which is the expensive
     direction. */
  if (error) return false;
  return (count ?? 0) >= HOURLY_THREADS;
}

/** Opens a thread and records the first message. Returns the token,
 *  which is the only thing the browser is ever given. */
export async function openThread(v: {
  name: string | null;
  email: string | null;
  body: string;
  transcript: string[];
}): Promise<string> {
  const sb = db();
  const { data, error } = await sb
    .from("threads")
    .insert({ name: v.name, email: v.email, transcript: v.transcript })
    .select("id, token")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Could not open the thread");

  const { error: mErr } = await sb
    .from("messages")
    .insert({ thread_id: data.id, author: "visitor", body: v.body });
  if (mErr) {
    /* The thread without its message is a ghost in the inbox: it would
       show up as a contact with nothing said. Remove it and report the
       failure rather than leaving a half-written record. */
    await sb.from("threads").delete().eq("id", data.id);
    throw new Error(mErr.message);
  }
  return data.token as string;
}

/** The thread behind a token, or null. The token IS the lookup: there is
 *  no id-based path from the outside, so a wrong token is simply a
 *  thread that does not exist. */
export async function readThread(token: string): Promise<Thread | null> {
  if (!/^[a-f0-9]{32}$/.test(token)) return null;
  const sb = db();
  const { data, error } = await sb
    .from("threads")
    .select("id, token, name, email, transcript, created_at")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return null;

  const { data: msgs } = await sb
    .from("messages")
    .select("author, body, created_at")
    .eq("thread_id", data.id)
    .order("created_at", { ascending: true });

  return {
    token: data.token as string,
    name: (data.name as string | null) ?? null,
    email: (data.email as string | null) ?? null,
    transcript: Array.isArray(data.transcript) ? (data.transcript as string[]) : [],
    created_at: data.created_at as string,
    messages: (msgs ?? []) as ThreadMessage[],
  };
}

/** Appends to an existing thread. `author` is never taken from the
 *  request: the visitor route hardcodes "visitor", and a reply is
 *  written by Jeremy through his own tooling. */
export async function appendMessage(
  token: string,
  author: "visitor" | "house",
  body: string
): Promise<boolean> {
  if (!/^[a-f0-9]{32}$/.test(token)) return false;
  const sb = db();
  const { data } = await sb.from("threads").select("id").eq("token", token).maybeSingle();
  if (!data) return false;
  const { error } = await sb
    .from("messages")
    .insert({ thread_id: data.id, author, body });
  return !error;
}
