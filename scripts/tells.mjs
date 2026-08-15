#!/usr/bin/env node
/* ── npm run tells ──────────────────────────────────────────────────
 * Reads the site's authored copy and lists the sentences that carry a
 * machine cadence. This exists because the writer of most of this copy
 * is a model, and a model cannot hear its own tells any more than a
 * person can hear their own accent. Three outside readers named the
 * patterns on 2026-08-15; this is those patterns, as a gate.
 *
 * WHAT IT LOOKS FOR. Not vocabulary — the banned-phrase list in
 * CLAUDE.md already covers that. Cadence:
 *   · antithesis          "X, not Y" / "not X but Y" / "rather than"
 *   · anthropomorphism    a thing as the subject of a human verb
 *   · ornamental verbs    "opens out", "dealt", "minted", "wears"
 *   · intensifiers        "truly", "genuinely", "remarkably"
 *   · the copula flourish "the X is the Y"
 *   · two-beat closers    a sentence whose last clause mirrors its first
 *   · shop talk           software vocabulary in a study about photographs,
 *                         rooms, or brands ("source frames", "deliverable",
 *                         "compositing system"). Jeremy on 2026-08-15:
 *                         "we're talking about editorial images but somehow
 *                         it sounds 'tech'". Skipped for the studies that
 *                         ARE software, where the words are literal.
 *
 * WHAT IT IS NOT. Not a linter that fails the build: every one of these
 * is a real sentence sometimes, and a study can earn one. It prints
 * them so a human decides. The one exception is intensifiers, which
 * have not once survived a read-aloud and are flagged as errors.
 *
 * Runs over: case-study data, the daybook, voice lines, and the
 * homepage NOTES in the lab file. Only string literals, and only ones
 * long enough to be prose.
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const FILES = [
  ...readdirSync(resolve(ROOT, "src/data"))
    .filter((f) => f.endsWith("-case-study.ts"))
    .map((f) => `src/data/${f}`),
  "src/data/daybook.ts",
  /* voice-lines.ts is deliberately NOT here: its rule is "his words,
     quoted", and a tone gate over Jeremy's own sentences would be the
     model grading the person it is trying to sound like. */
  "public/lab/pressing-home.html",
];

const TELLS = [
  {
    key: "em dash",
    why: "the #1 rule in CLAUDE.md; a period, a comma, or a rewrite instead",
    re: /\u2014/,
    error: true,
  },
  {
    key: "antithesis",
    why: "the X-not-Y balance; he does not talk in antithesis",
    re: /\b(?:not\b[^.;!?]{2,50}?\bbut\b|rather than\b|,\s*not\s+(?:a|an|the|just|only)?\s*\w+[.;!?]|\bnever\s+\w+\s*[.;])/i,
  },
  {
    key: "anthropomorphism",
    why: "a thing doing a person's verb",
    re: /\b(?:The\s+\w+|Threads|Messages|Rows|Plates|Pages)\s+(?:learns?|tells?|knows?|remembers?|wears?|earns?|takes over|updates? (?:itself|themselves)|comes? to life|catches? up|says so|breathes?)\b/,
  },
  {
    key: "ornamental verb",
    why: "a dressed-up word for a plain action",
    /* "carries the" is NOT here on purpose: "the type carries the
       headlines" is how designers actually talk, and it flagged ten
       ordinary sentences on the first run. */
    re: /\b(?:opens? out|dealt|deals? (?:onto|into)|minted|wears|breathes|arrives at|lands (?:on|in) (?:the|its)|earns its)\b/i,
  },
  {
    key: "intensifier",
    why: "sincerity-work in place of a specific",
    re: /\b(?:truly|genuinely|deeply|remarkably|utterly|honestly powerful)\b/i,
    error: true,
  },
  {
    key: "copula flourish",
    why: "'the X is the Y'; one per study can land, more is formula",
    re: /\b(?:^|\.\s+)?The \w+ (?:is|was) the (?:\w+)(?:\s+\w+)?[.,]/,
  },
  {
    key: "fragment stack",
    why: "three sentences of four words or fewer in a row; a list is fine, a drumbeat is the tell",
    re: /(?:^|[.!?]\s+)(?:\S+(?:\s\S+){0,3}[.!?]\s+){2}\S+(?:\s\S+){0,3}[.!?]/,
    whole: true,
  },
  {
    key: "shop talk",
    why: "software words for a photograph, a room, or a brand; say the plain thing",
    re: /\b(?:source (?:frames?|files?)|compositing system|layered files?|deliverables?|content engine|publishing system|the system (?:answers|holds|scales|stays|includes|knows)|iterat(?:e|ed|ion)s?|leverag\w*|optimi[sz]\w*|utiliz\w*|scal(?:able|ability)|interaction surface|under load|primitives?|payload)\b/i,
    /* Only where the words are figurative. These slugs are software and
       have real deliverables, real systems, real payloads. */
    skipSlugs: ["sally", "arc", "dsc", "sizzle"],
  },
  {
    key: "two-beat closer",
    why: "last clause mirrors the first; reads as insight, decodes to a fact",
    re: /,\s*(?:and|so)\s+(?:only|never|always)\s+[^.]{4,60}\.$/,
  },
];

/* Prose-shaped string literals only: long enough to be a sentence,
   not a path, not a hex, not a class list. */
const LITERAL = /(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
const isProse = (s) =>
  s.length >= 40 &&
  /[a-z]\s[a-z]/i.test(s) &&
  !/^[\/#.]|\.(?:jpg|png|webp|svg|css|ts|tsx|json)\b|^[\w-]+(?:\s[\w-]+){0,3}$/.test(s) &&
  !/\b(?:px|rem|vw|dvh|clamp\()/.test(s) &&
  !/^[A-Z_]{4,}$/.test(s);

const findings = [];
for (const rel of FILES) {
  let src;
  try {
    src = readFileSync(resolve(ROOT, rel), "utf8");
  } catch {
    continue;
  }
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    /* Skip comments: the reasoning behind copy is allowed to be dense,
       the copy is not. */
    const t = line.trim();
    if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return;
    for (const m of line.matchAll(LITERAL)) {
      /* Editorial headlines carry authored line breaks as literal \n.
         Joined before testing, or "A flagship,\nnot a storefront" reads
         as two clean fragments and the loudest antithesis on the page
         walks straight past the gate — which is exactly what happened. */
      const s = m[2].replace(/\\n/g, " ");
      if (!isProse(s)) continue;
      /* alt text, published ranges and file paths never render as copy;
         a dash there is punctuation in a machine field, not a tell. */
      if (/^\s*(?:alt|markAlt|published|src|href|url|image)\s*:/.test(line)) continue;
      /* Split into sentences so a closer test sees the sentence end. */
      const sentences = s.split(/(?<=[.!?])\s+/);
      for (const tell of TELLS.filter((x) => x.whole)) {
        const hit = s.match(tell.re);
        if (hit) findings.push({ file: rel, line: i + 1, key: tell.key, why: tell.why,
          error: false, excerpt: hit[0].length > 140 ? hit[0].slice(0, 137) + "…" : hit[0], hit: hit[0].slice(0, 40) });
      }
      const slug = rel.replace(/^src\/data\//, "").replace(/-case-study\.ts$/, "");
      for (const sent of sentences) {
        for (const tell of TELLS.filter((x) => !x.whole)) {
          if (tell.skipSlugs && tell.skipSlugs.includes(slug)) continue;
          const hit = sent.match(tell.re);
          if (!hit) continue;
          findings.push({
            file: rel,
            line: i + 1,
            key: tell.key,
            why: tell.why,
            error: Boolean(tell.error),
            excerpt: sent.length > 140 ? sent.slice(0, 137) + "…" : sent,
            hit: hit[0],
          });
        }
      }
    }
  });
}

/* Report, grouped by tell, files short. */
const byKey = new Map();
for (const f of findings) {
  if (!byKey.has(f.key)) byKey.set(f.key, []);
  byKey.get(f.key).push(f);
}
const short = (p) => p.replace(/^src\/data\//, "").replace(/-case-study\.ts$/, "").replace(/^public\/lab\//, "lab/");

console.log(`\ntells  ${findings.length} sentence${findings.length === 1 ? "" : "s"} across ${FILES.length} files\n`);
for (const tell of TELLS) {
  const list = byKey.get(tell.key) || [];
  if (!list.length) continue;
  console.log(`■ ${tell.key}  (${list.length})  — ${tell.why}`);
  for (const f of list) {
    console.log(`    ${short(f.file)}:${f.line}  “${f.hit}”`);
    console.log(`      ${f.excerpt}`);
  }
  console.log();
}

const errors = findings.filter((f) => f.error);
if (errors.length) {
  const kinds = [...new Set(errors.map((e) => e.key))].join(", ");
  console.log(`✗ ${errors.length} hard error${errors.length === 1 ? "" : "s"} (${kinds}). These do not ship.`);
  process.exit(1);
}
console.log(findings.length ? "Read each one out loud. Keep the ones a person would say." : "✓ nothing flagged");
