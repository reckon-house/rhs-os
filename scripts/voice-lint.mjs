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

/* ── the tells ────────────────────────────────────────────────────── */
const TELLS = [
  ["tail", /,\s*(?:none of (?:them|it) [^.]*|all of it [^.]*|on purpose|alike|for one|at once|and nothing (?:more|else)|and (?:then )?some|no less|and stays that way|and that is (?:that|all)|nothing else)[.!?]$/i,
    "a flourish closes the sentence"],
  ["feels", /\b(?:that|which) feels? \w+[.!?]$/i, "'that feels X' at the end"],
  ["not-not", /\bnot\b[^.]*?,\s*(?:and\s+)?not\b|^Not [^.]*\. Not /i, "balanced 'not X, not Y'"],
  ["is-the", /\bthe (\w+) is the \1\b|\bthe (\w+) (?:is|was) the (?!same|only|first|last|one)\w+\b[^.]*[.!?]$/i, "'the noun is the noun'"],
  ["triplet-close", /,\s*\w+,\s*(?:and\s+)?\w+[.!?]$/, "a triplet closes the sentence"],
  ["stack", /\b(?:\w+ly )?\w+, \w+, and \w+ (?:\w+)[.!?]$/, "stacked adjectives"],
  ["banned", /\b(?:seamless(?:ly)?|robust|innovative|cutting-edge|best-in-class|leverag(?:e|es|ed|ing)|elevat(?:e|es|ed|ing)|disrupt(?:s|ed|ing|ive)|journey|passion(?:ate)?|tapestry|craft(?:ed|ing)\s+(?:meaningful|experiences)|the result was)\b/i, "a banned word"],
  ["surfaces-verb", /\b(?:it|this|that|which) surfaces\b/i, "'surfaces' as a verb"],
  ["dash", /—/, "an em dash"],
  ["quotable", /^[A-Z][^,.]{3,40}\. [A-Z][^,.]{3,40}\. [A-Z][^,.]{3,40}\.$/, "three short sentences in a row, the pull-quote rhythm"],
];

/* ── the prose ────────────────────────────────────────────────────── */
const files = readdirSync(DIR).filter((f) => f.endsWith("-case-study.ts") && !f.startsWith("._"))
  .filter((f) => !only || f.includes(only));
const literal = /"((?:[^"\\]|\\.){40,})"|'((?:[^'\\]|\\.){40,})'|`((?:[^`\\]|\\.){40,})`/g;
const isProse = (s) => !/[\/]/.test(s) && !/^https?:/.test(s) && !/\.(jpg|jpeg|png|webp|avif|svg|mp4)/i.test(s) && /\s/.test(s);
const sentences = (s) => s.replace(/\\n/g, " ").split(/(?<=[.!?])\s+(?=[A-Z“"'])/).map((x) => x.trim()).filter((x) => x.length > 12);

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
      const why = TELLS.filter(([, re]) => re.test(sent)).map(([k, , label]) => k);
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
