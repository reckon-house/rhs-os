#!/usr/bin/env node
/* ── ask-bench ──────────────────────────────────────────────────────
   Thirty questions at /api/ask, the answers read by the voice tells.
   The point is a number before and after a prompt change, so the
   change is measured rather than felt. Answers are saved beside the
   summary so a flagged one can be read, not just counted.

     npm run ask:bench                 against http://localhost:3000
     npm run ask:bench -- --base URL   against somewhere else
     npm run ask:bench -- --tag before writes bench/before.json

   The bench's own matcher is a slug-word match against the question,
   which is a rough stand-in for the homepage's; enough to hand the
   route the same shape of facts a visitor's question arrives with. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { flag } from "../src/lib/voice-tells.ts";

const args = process.argv.slice(2);
const arg = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const BASE = arg("--base", "http://localhost:3000");
const TAG = arg("--tag", new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-"));
/* the route throttles per IP, 15 a minute and 60 a day, and reads the
   IP from x-forwarded-for; locally that header is ours to set, so a
   run takes a fresh bucket and paces itself under the burst */
const IP = arg("--ip", "10.0.0." + (Math.floor(Math.random() * 200) + 20));
const PACE = Number(arg("--pace", "4200"));
const OUT = "bench"; mkdirSync(OUT, { recursive: true });

const index = JSON.parse(readFileSync("src/data/generated/project-facts.json", "utf8"));
const projects = index.projects.map((p) => ({ href: p.href, slug: p.href.split("/").pop(), title: p.title }));
/* "A.R.C." is one word to a visitor and three letters to a splitter */
const words = (s) => s.toLowerCase().replace(/\.(?=\w)/g, "").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2);
const hrefsFor = (q) => {
  const qw = new Set(words(q));
  return projects.filter((p) => words(p.slug + " " + p.title).some((w) => w.length > 3 && qw.has(w))).slice(0, 3).map((p) => p.href);
};

const QUESTIONS = [
  "who are you", "what inspires you", "what's new", "interiors", "apps", "campaigns", "digital", "staples",
  "what is A.R.C.", "why did you build A.R.C.", "how long did A.R.C. take",
  "tell me about the Hill Country kitchen", "why four materials in the kitchen", "what marble is in the bath",
  "what is Sally Marketing OS", "what does the Sally asset hub do", "how does booking work at the gym",
  "what is Faux Reel", "what did you do for Nordstrom", "why did Ivy Park sell out",
  "what's the Fairview suite like", "tell me about the chalet", "which project is the biggest",
  "what typefaces do you use", "do you do restaurants", "how do I reach you",
  "what's the Robert Rodriguez campaign", "kitchen design", "marble surfaces", "how do you work",
];

const out = [];
let flagged = 0, sentences = 0;
for (const q of QUESTIONS) {
  const hrefs = hrefsFor(q);
  const t0 = Date.now();
  let answer = "", error = null;
  try {
    const r = await fetch(BASE + "/api/ask", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": IP },
      body: JSON.stringify({ q, hrefs }) });
    const j = await r.json();
    if (!r.ok) error = j.error || r.status; else answer = j.answer || "";
  } catch (e) { error = String(e.message || e); }
  const hits = flag(answer);
  const n = answer ? answer.split(/(?<=[.!?])\s+/).length : 0;
  sentences += n; flagged += hits.length;
  out.push({ q, hrefs, answer, error, ms: Date.now() - t0, flags: hits.map((h) => ({ sentence: h.sentence, why: h.why.map((w) => w.key) })) });
  process.stdout.write((hits.length ? "!" : error ? "x" : ".") );
  await new Promise((res) => setTimeout(res, PACE));
}
console.log();
const file = `${OUT}/${TAG}.json`;
writeFileSync(file, JSON.stringify({ base: BASE, at: new Date().toISOString(), questions: out.length, sentences, flagged, answers: out }, null, 1));
for (const a of out.filter((a) => a.flags.length)) {
  console.log(`\n${a.q}`);
  for (const f of a.flags) console.log(`  [${f.why.join(",")}] ${f.sentence}`);
}
const errs = out.filter((a) => a.error);
if (errs.length) console.log(`\n${errs.length} errors: ` + errs.map((a) => a.q + " (" + a.error + ")").join("; "));
console.log(`\n${out.length} questions · ${sentences} sentences · ${flagged} flagged · ${Math.round(out.reduce((n, a) => n + a.ms, 0) / out.length)}ms avg → ${file}`);
