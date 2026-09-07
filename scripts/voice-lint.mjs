#!/usr/bin/env node
/* ── voice-lint ─────────────────────────────────────────────────────
   Reads every study's prose and flags the SHAPES that read as AI.

   It cannot judge voice; nothing mechanical can. What it can find is
   the tells, which are shapes: the flourish at the end of a sentence
   that makes it quotable, the balanced "not X, not Y", the triplet
   that closes a sentence, "the noun is the noun", the banned words,
   the em dash. Each is a proxy for the rule in VOICE.md ("The grey
   half"): state what it is or why it was decided, and stop.

   A flag is a sentence to READ, not a sentence to change. The process
   that worked on the leads was: the lint finds the sentence, a rewrite
   is proposed from facts the study already states, Jeremy approves,
   and it changes at source. This script is the first step only.

     npm run voice            every study, grouped, with totals
     npm run voice -- sally   one study

   Prose is every string literal of forty characters or more in
   src/data/*-case-study.ts that is not a path, which is a proxy too,
   and a good one: paths are short and have slashes, copy is long and
   has none. The volume is exFAT, so every file has an AppleDouble
   twin (._name) beside it; those are binary and are skipped, or the
   count doubles and the flags fill with fragments of resource fork. */
import { readFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

const DIR = "src/data";
const only = process.argv.slice(2).find((a) => !a.startsWith("-"));

/* ── the tells ────────────────────────────────────────────────────
   One list, shared with the Ask route (src/lib/voice-tells.ts), which
   runs the same shapes over the model's answers. Node strips the types
   on import, so the .ts is read as it stands. */
import { TELLS, sentencesOf as sentences } from "../src/lib/voice-tells.ts";

/* ── the prose ────────────────────────────────────────────────────── */
const files = readdirSync(DIR).filter((f) => f.endsWith("-case-study.ts") && !f.startsWith("._"))
  .filter((f) => !only || f.includes(only));
const literal = /"((?:[^"\\]|\\.){40,})"|'((?:[^'\\]|\\.){40,})'|`((?:[^`\\]|\\.){40,})`/g;
const isProse = (s) => !/[\/]/.test(s) && !/^https?:/.test(s) && !/\.(jpg|jpeg|png|webp|avif|svg|mp4)/i.test(s) && /\s/.test(s);

let total = 0, flagged = 0;
const report = [];
for (const f of files) {
  const src = readFileSync(join(DIR, f), "utf8");
  const seen = new Set();
  const hits = [];
  let m;
  while ((m = literal.exec(src))) {
    const raw = m[1] ?? m[2] ?? m[3];
    if (!isProse(raw)) continue;
    for (const sent of sentences(raw)) {
      if (seen.has(sent)) continue;
      seen.add(sent);
      total += 1;
      const why = TELLS.filter((t) => !t.scope && t.re.test(sent)).map((t) => t.key);
      if (why.length) { flagged += 1; hits.push({ sent, why }); }
    }
  }
  if (hits.length) report.push({ study: basename(f, "-case-study.ts"), hits });
}

for (const { study, hits } of report) {
  console.log(`\n${study}  (${hits.length})`);
  for (const { sent, why } of hits) console.log(`  [${why.join(",")}] ${sent}`);
}
console.log(`\n${files.length} studies · ${total} sentences · ${flagged} flagged (${Math.round((flagged / Math.max(1, total)) * 100)}%)`);
