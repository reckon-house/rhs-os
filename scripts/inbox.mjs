#!/usr/bin/env node
/**
 * inbox — read what came in, answer it.
 *
 *   npm run inbox                     list threads, newest first
 *   npm run inbox -- read <token>     one thread in full
 *   npm run inbox -- reply <token> "…"  answer it, and email them
 *
 * WHY THIS IS A SCRIPT AND NOT A ROUTE. Writing a message as the house
 * is the one thing no public path is allowed to do: the site reaches
 * the store through three SECURITY DEFINER functions, and none of them
 * can set author to anything but 'visitor'. Answering therefore needs
 * elevated credentials, and those belong on your machine rather than in
 * a deployed app. SUPABASE_SERVICE_KEY is read here and nowhere else in
 * this repo — the Next app never references it, so it cannot leak
 * through a bundle or a misconfigured env.
 *
 * Add it to .env.local (already gitignored) from the project's API
 * settings. It is the key that bypasses RLS; treat it like a password,
 * because it is one.
 *
 * Node 22 loads .env.local itself via --env-file, which package.json
 * passes. No dotenv, no dependency.
 */

const URL_ = process.env.SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_KEY;

if (!URL_ || !SERVICE) {
  console.error(
    "\n  Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local.\n" +
      "  The service key is under Project Settings > API in Supabase.\n" +
      "  It bypasses row-level security, so it stays local: never in Vercel,\n" +
      "  never in the app, never committed.\n"
  );
  process.exit(1);
}

const rest = (path, init = {}) =>
  fetch(`${URL_}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

const day = (iso) => {
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const d = new Date(iso);
  return `${M[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, " ")}`;
};

async function list() {
  const r = await rest(
    "threads?select=token,name,email,state,created_at,last_at,transcript,messages(author,body,created_at)" +
      "&order=last_at.desc&limit=40"
  );
  if (!r.ok) {
    console.error("  Could not read the store:", r.status, await r.text());
    process.exit(1);
  }
  const rows = await r.json();
  if (!rows.length) {
    console.log("\n  Nothing yet.\n");
    return;
  }

  console.log("");
  for (const t of rows) {
    const msgs = t.messages || [];
    const last = msgs[msgs.length - 1];
    /* "waiting" is the only state that matters at a glance: the last
       word was theirs, so the ball is here. */
    const waiting = last && last.author === "visitor";
    console.log(
      `  ${waiting ? "●" : " "} ${day(t.last_at)}  ${(t.name || "anonymous").padEnd(20).slice(0, 20)}` +
        `  ${String(msgs.length).padStart(2)} msg  ${t.email || "no email"}`
    );
    if (last) console.log(`      ${last.body.replace(/\s+/g, " ").slice(0, 88)}`);
    if (t.transcript?.length) console.log(`      asked: ${t.transcript.join(" · ")}`);
    console.log(`      ${t.token}`);
    console.log("");
  }
  const waiting = rows.filter((t) => {
    const m = t.messages || [];
    return m.length && m[m.length - 1].author === "visitor";
  }).length;
  console.log(`  ${rows.length} thread${rows.length === 1 ? "" : "s"}, ${waiting} waiting on you.\n`);
}

async function read(token) {
  const r = await rest(
    `threads?token=eq.${encodeURIComponent(token)}` +
      "&select=token,name,email,created_at,transcript,messages(author,body,created_at)"
  );
  const [t] = await r.json();
  if (!t) return console.error("\n  No such thread.\n");

  console.log(`\n  ${t.name || "anonymous"}  ${t.email || "no email"}`);
  if (t.transcript?.length) console.log(`  asked: ${t.transcript.join(" · ")}`);
  console.log("");
  for (const m of (t.messages || []).sort((a, b) => a.created_at.localeCompare(b.created_at))) {
    console.log(`  ${m.author === "house" ? "you " : "them"}  ${day(m.created_at)}  ${m.body.replace(/\n/g, "\n              ")}`);
  }
  console.log("");
}

async function reply(token, body) {
  if (!body || !body.trim()) return console.error("\n  Nothing to say.\n");

  const r = await rest(
    `threads?token=eq.${encodeURIComponent(token)}&select=id,name,email`
  );
  const [t] = await r.json();
  if (!t) return console.error("\n  No such thread.\n");

  const ins = await rest("messages", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ thread_id: t.id, author: "house", body: body.trim() }),
  });
  if (!ins.ok) return console.error("\n  Could not save:", await ins.text(), "\n");
  const [saved] = await ins.json();
  console.log("\n  Saved to the thread.");

  if (!t.email) {
    console.log("  No address on this thread, so nothing was sent.\n");
    return;
  }

  /* The mailer lives in the app so the route and the script send the
     same thing. Imported lazily: listing and reading a thread should
     not need a Resend key to exist. */
  const { notifyReply, mailReady } = await import("../src/lib/notify.ts");
  if (!mailReady) {
    console.log("  No Resend key locally, so no email went out.");
    console.log("  The reply is saved; add Resend_Key to .env.local to notify.\n");
    return;
  }

  const sent = await notifyReply({
    to: t.email,
    name: t.name,
    body: body.trim(),
    token,
  });

  if (sent.ok) {
    /* Stamped only on a real send. Leaving it null is what makes a
       retry possible, so a bad key never silently loses the notice. */
    await rest(`messages?id=eq.${saved.id}`, {
      method: "PATCH",
      body: JSON.stringify({ emailed_at: new Date().toISOString() }),
    });
    console.log(`  Emailed ${t.email}.\n`);
  } else {
    console.log(`  Reply saved, but the email failed: ${sent.why}`);
    console.log("  Not stamped, so it can be retried.\n");
  }
}

const [cmd, token, ...rest_] = process.argv.slice(2);
if (!cmd) await list();
else if (cmd === "read" && token) await read(token);
else if (cmd === "reply" && token) await reply(token, rest_.join(" "));
else {
  console.log(`
  npm run inbox
  npm run inbox -- read <token>
  npm run inbox -- reply <token> "your answer"
`);
}
