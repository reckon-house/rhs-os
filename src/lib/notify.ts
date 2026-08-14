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
