#!/usr/bin/env node
/**
 * inbox — read what came in, answer it.
 *
 *   npm run inbox                       what came in, and who is waiting
 *   npm run inbox -- read <token>       one thread in full
 *   npm run inbox -- reply <token> "…"  answer it, and email them
 *
 * NO SERVICE KEY. Writing as the house needs a credential, and the
 * obvious one bypasses row-level security entirely: a service key on a
 * laptop or in a shell history costs the whole database. This uses the
 * same publishable key the website does, plus HOUSE_KEY — 256 bits
 * whose SHA-256 is the only copy in Postgres. The worst a leak does is
 * let someone post a reply into a thread whose token they already know.
 * No reading, no enumerating, no other table.
 *
 * HOUSE_KEY is in .env.local, which is gitignored, and Node 22 loads it
 * through --env-file from package.json. Nothing to install.
 */

const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_ANON_KEY;
const HOUSE = process.env.HOUSE_KEY;

if (!URL_ || !KEY || !HOUSE) {
  console.error("\n  Missing SUPABASE_URL, SUPABASE_ANON_KEY or HOUSE_KEY in .env.local.\n");
  process.exit(1);
}

const rpc = async (fn, args) => {
  const r = await fetch(`${URL_}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if (!r.ok) {
    console.error(`\n  ${fn} failed: ${r.status} ${await r.text()}\n`);
    process.exit(1);
  }
  return r.json();
};

const day = (iso) => {
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const d = new Date(iso);
  return `${M[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, " ")}`;
};
const waitingOnMe = (t) => {
  const m = t.messages || [];
  return m.length > 0 && m[m.length - 1].author === "visitor";
};

async function list() {
  const rows = await rpc("house_inbox", { p_secret: HOUSE });
  if (!rows.length) return console.log("\n  Nothing yet.\n");

  console.log("");
  for (const t of rows) {
    const msgs = t.messages || [];
    const last = msgs[msgs.length - 1];
    console.log(
      `  ${waitingOnMe(t) ? "●" : " "} ${day(t.last_at)}  ` +
        `${(t.name || "anonymous").padEnd(18).slice(0, 18)}  ` +
        `${String(msgs.length).padStart(2)} msg  ${t.email || "no email"}`
    );
    if (last) console.log(`      ${last.body.replace(/\s+/g, " ").slice(0, 84)}`);
    if (t.transcript?.length) console.log(`      asked: ${t.transcript.join(" · ")}`);
    console.log(`      ${t.token}\n`);
  }
  const n = rows.filter(waitingOnMe).length;
  console.log(`  ${rows.length} thread${rows.length === 1 ? "" : "s"}, ${n} waiting on you.\n`);
}

async function read(token) {
  const rows = await rpc("house_inbox", { p_secret: HOUSE });
  const t = rows.find((x) => x.token === token);
  if (!t) return console.error("\n  No such thread.\n");

  console.log(`\n  ${t.name || "anonymous"}   ${t.email || "no email"}`);
  if (t.transcript?.length) console.log(`  asked: ${t.transcript.join(" · ")}`);
  console.log("");
  for (const m of t.messages || []) {
    const who = m.author === "house" ? "you " : "them";
    console.log(`  ${who}  ${day(m.created_at)}  ${m.body.replace(/\n/g, "\n              ")}`);
  }
  console.log("");
}

async function reply(token, body) {
  if (!body?.trim()) return console.error("\n  Nothing to say.\n");

  const res = await rpc("house_reply", {
    p_secret: HOUSE,
    p_token: token,
    p_body: body,
  });
  if (!res?.ok) return console.error("\n  No such thread, or the key is wrong.\n");
  console.log("\n  Saved to the thread.");

  if (!res.email) return console.log("  No address on this thread, so nothing was sent.\n");

  const { notifyReply, mailReady } = await import("../src/lib/notify.ts");
  if (!mailReady) {
    console.log("  No Resend key locally, so no email went out.");
    console.log("  The reply is saved. Add Resend_Key to .env.local to notify.\n");
    return;
  }

  const sent = await notifyReply({
    to: res.email,
    name: res.name,
    body: body.trim(),
    token,
  });

  if (sent.ok) {
    /* Stamped only on a real send: a failure leaves emailed_at null so
       the notice can be retried rather than silently lost. */
    await rpc("house_mark_emailed", { p_secret: HOUSE, p_message_id: res.message_id });
    console.log(`  Emailed ${res.email}.\n`);
  } else {
    console.log(`  Reply saved, but the email failed: ${sent.why}`);
    console.log("  Not stamped, so it can be retried.\n");
  }
}

const [cmd, token, ...rest] = process.argv.slice(2);
if (!cmd) await list();
else if (cmd === "read" && token) await read(token);
else if (cmd === "reply" && token) await reply(token, rest.join(" "));
else console.log(`
  npm run inbox
  npm run inbox -- read <token>
  npm run inbox -- reply <token> "your answer"
`);
