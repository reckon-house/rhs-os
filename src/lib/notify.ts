/* ── Telling someone they got a reply ───────────────────────────────
 *
 * NO `server-only` HERE, unlike messages.ts, and the reason is that
 * scripts/inbox.mjs imports this module from plain Node. `server-only`
 * is resolved by Next's bundler and does not exist in node_modules, so
 * importing it would make the operator CLI crash on startup — and one
 * mailer shared between the app and the script is worth more than a
 * build-time guard that is already redundant. The key is read from an
 * env var with no NEXT_PUBLIC_ prefix, so Next never inlines it into a
 * client bundle whether or not this line is present.
 *
 * The one job email is genuinely better at. Jeremy learns about a new
 * message from the inbox routine; the VISITOR has closed the tab and
 * has no way of knowing he answered, so they get an email pointing at
 * their thread.
 *
 * No SDK. Resend's send endpoint is one POST, and a dependency added
 * for ten lines is a dependency to keep updated forever.
 *
 * KEY NAME. `Resend_Key` is what exists in Vercel, and process.env is
 * case-sensitive in Node, so that is what is read. RESEND_API_KEY is
 * accepted too because it is the name every example uses and future me
 * will type it by reflex.
 */

const KEY = process.env.Resend_Key || process.env.RESEND_API_KEY;

/* The sending identity must be on a domain verified in Resend, or the
   API refuses it. Overridable so a rename does not need a deploy. */
const FROM = process.env.MAIL_FROM || "Reckon House <hello@reckon.house>";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://reckon.house";

export const mailReady = Boolean(KEY);

/** Plain text, deliberately. An HTML mail from a portfolio is a
 *  newsletter, and this is one person answering another. It also means
 *  nothing to sanitise: the reply is inserted as text into text. */
function compose(name: string | null, body: string, token: string) {
  const who = name ? `${name},` : "Hello,";
  return `${who}

Jeremy replied to your message.

${body}

The thread is here, and you can answer on it:
${SITE}/thread/${token}

Reckon House Staples
`;
}

/* Where a new message is announced. Defaults to the address the site
   already tells everyone; MAIL_TO overrides it when the mailbox that
   gets read is somewhere else. */
const TO_OWNER = process.env.MAIL_TO || "hello@reckon.house";

export type MailResult =
  | { ok: true; id: string }
  | { ok: false; why: string };

/**
 * Sends the reply notification. Never throws: a failed send must not
 * lose the reply, which is already recorded. The caller decides whether
 * to stamp emailed_at, and leaving it null is what makes a retry
 * possible later.
 */
export async function notifyReply(args: {
  to: string;
  name: string | null;
  body: string;
  token: string;
}): Promise<MailResult> {
  if (!KEY) return { ok: false, why: "No Resend key in the environment" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [args.to],
        subject: "Reckon House replied",
        text: compose(args.name, args.body, args.token),
      }),
    });

    const json = (await res.json().catch(() => null)) as
      | { id?: string; message?: string; name?: string }
      | null;

    if (!res.ok) {
      /* Resend's own message is worth surfacing to the OPERATOR, because
         the usual failure is an unverified sending domain and the error
         says so exactly. It never reaches a visitor. */
      return { ok: false, why: json?.message || `Resend returned ${res.status}` };
    }
    return json?.id ? { ok: true, id: json.id } : { ok: false, why: "No id returned" };
  } catch (e) {
    return { ok: false, why: e instanceof Error ? e.message : "Send failed" };
  }
}

/* ── Telling Jeremy someone wrote in ────────────────────────────────
 *
 * The other direction, and the one that makes the loop worth having: a
 * visitor writes at eleven at night and he finds out now rather than
 * the next time he runs the inbox routine.
 *
 * IT CARRIES THE REPLY COMMAND. The whole message is in the mail, so
 * the decision "does this need me" is made on the phone, and the only
 * thing needing a laptop is the answer itself — which is pasteable
 * from the last line rather than looked up.
 *
 * The visitor's own address goes in Reply-To. Hitting reply in a mail
 * client then writes to them directly, which is the escape hatch for
 * anything the thread page is the wrong shape for.
 */
export async function notifyNewMessage(args: {
  name: string | null;
  email: string | null;
  body: string;
  transcript: string[];
  token: string;
}): Promise<MailResult> {
  if (!KEY) return { ok: false, why: "No Resend key in the environment" };

  const who = args.name || "Someone";
  const asked = args.transcript.length
    ? `\nThey had asked: ${args.transcript.join(" · ")}\n`
    : "";
  /* THE COMMAND COMES FIRST, AND THE LINK IS LABELLED. The link goes to
     the VISITOR's view of the thread, whose reply box posts as them —
     the author is hardcoded there, so writing in it makes an answer look
     like it came from the person who wrote in. That happened on the
     first real message. So the mail leads with the one thing that
     answers as the house, and names the link for what it is. */
  const text = `${who} wrote in${args.email ? ` (${args.email})` : ""}.

${args.body}
${asked}
To answer, from the repo:
npm run inbox -- reply ${args.token} "your answer"

Their view of the thread (the box on this page posts as THEM, not you):
${SITE}/thread/${args.token}
`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [TO_OWNER],
        /* The name in the subject is what makes a phone notification
           readable without opening it. */
        subject: `${who} wrote in`,
        text,
        ...(args.email ? { reply_to: args.email } : {}),
      }),
    });
    const json = (await res.json().catch(() => null)) as
      | { id?: string; message?: string }
      | null;
    if (!res.ok) return { ok: false, why: json?.message || `Resend returned ${res.status}` };
    return json?.id ? { ok: true, id: json.id } : { ok: false, why: "No id returned" };
  } catch (e) {
    return { ok: false, why: e instanceof Error ? e.message : "Send failed" };
  }
}

/* ── Telling the visitor their call is real ─────────────────────────
 *
 * THE PAGE ALREADY PROMISED THIS. BookingCalendar's done state says "A
 * confirmation is on its way to your inbox," and for the life of the
 * route nothing sent one: /api/book called notifyNewMessage, which goes
 * to the owner. The visitor got a sentence on screen, closed the tab,
 * and had nothing to show for a call they had just committed to.
 *
 * THE ZONE IS THE WHOLE POINT. `when` arrives already spoken as
 * "Monday 31 August, 4:00pm Central" and goes in the SUBJECT, because
 * the failure this prevents is someone in London reading a bare number
 * off a lock screen and arriving five hours out. A confirmation whose
 * one fact needs opening the mail is not doing its job.
 *
 * MINUTES ARE PASSED, NOT IMPORTED. SLOT_MINUTES lives in
 * @/data/booking, and scripts/inbox.mjs imports this module from plain
 * Node where that alias does not resolve. See the note at the top of
 * this file: keeping the mailer importable from the CLI is worth more
 * than saving an argument.
 */
export async function notifyBookingConfirmed(args: {
  to: string;
  name: string | null;
  /** already spoken, with the zone named. */
  when: string;
  minutes: number;
  /** null when the thread failed to open; the booking still stands. */
  token: string | null;
}): Promise<MailResult> {
  if (!KEY) return { ok: false, why: "No Resend key in the environment" };

  const who = args.name ? `${args.name},` : "Hello,";
  /* Only offered when there is a thread to point at. A booking whose
     thread failed to open is still a real booking, and a link to
     nowhere is worse than no link. */
  const thread = args.token
    ? `\nAnything you want me to read before we talk can go here, and it
reaches me the same way a message does:
${SITE}/thread/${args.token}\n`
    : "";

  const text = `${who}

Booked: ${args.minutes} minutes, ${args.when}.
${thread}
If you need to move it, reply to this email.

Reckon House Staples
`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [args.to],
        subject: `Booked: ${args.when}`,
        text,
        /* Explicit rather than relying on FROM, which MAIL_FROM can
           point somewhere unread. "Reply to this email" is a promise. */
        reply_to: TO_OWNER,
      }),
    });
    const json = (await res.json().catch(() => null)) as
      | { id?: string; message?: string }
      | null;
    if (!res.ok) return { ok: false, why: json?.message || `Resend returned ${res.status}` };
    return json?.id ? { ok: true, id: json.id } : { ok: false, why: "No id returned" };
  } catch (e) {
    return { ok: false, why: e instanceof Error ? e.message : "Send failed" };
  }
}
