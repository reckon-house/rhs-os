/* Build the facts index the homepage's brain answers from.
 *
 *   node scripts/build-facts.mjs          write src/data/generated/
 *   node scripts/build-facts.mjs --report print coverage, write nothing
 *
 * The case studies ARE the database. Thirty typed files already hold
 * every discipline, tool, material, room, client and statistic the
 * work has; they were just never queryable. This walks them and emits
 * one JSON file per concern, so the site can answer questions about
 * the portfolio instead of matching substrings against it.
 *
 * THE RULE THIS FILE EXISTS TO ENFORCE: every fact carries a citation —
 * the section it came from, the field within it, and the sentence
 * itself. A fact that cannot say where it came from does not get
 * written. That is what keeps a composer built on top of this honest:
 * it can only assert what it can point at.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { studyFiles, loadStudy, loadPulls, strings, filenameWords } from "./lib/walk-studies.mjs";
import { terms, NEGATORS, GUARDS, VOCAB_VERSION } from "./lib/vocabulary.mjs";

const OUT_DIR = "src/data/generated";
const TERMS = terms();
const REPORT = process.argv.includes("--report");

/* Length-PRESERVING normalisation: every non-alphanumeric character
 * becomes one space, so index i in the haystack is index i in the
 * original text. The obvious version collapses runs of punctuation
 * instead, which shifts every index after the first comma — and then
 * the citation quotes the wrong sentence while looking perfectly
 * plausible. A citation that points somewhere else is worse than no
 * citation, because it invites belief. */
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9&]/g, " ");

/* Not every full stop ends a sentence. "J. Christianson" and "Capitan
 * Boot Co." both carry one mid-name, and splitting there produced a
 * citation reading exactly "J." — which the self-check below caught.
 * A stop preceded by a lone capital is an initial; one inside a known
 * abbreviation is not a boundary either. */
const ABBR = ["co.", "inc.", "st.", "mr.", "ms.", "dr.", "vs.", "no."];
function isBoundary(text, i) {
  if (text[i] !== "." && text[i] !== "!" && text[i] !== "?") return false;
  if (i + 1 < text.length && !/\s/.test(text[i + 1])) return false;
  const prev = text[i - 1];
  const prev2 = text[i - 2];
  if (prev && /[A-Z]/.test(prev) && (!prev2 || /\s/.test(prev2))) return false;
  const tail = text.slice(Math.max(0, i - 4), i + 1).toLowerCase();
  return !ABBR.some((a) => tail.endsWith(a));
}

/* The sentence a term was found in, trimmed to something quotable. This
 * is the payload that lets an answer be specific: not "marble appears
 * in Hill Country" but the clause that says how.
 *
 * The window is guaranteed to CONTAIN the match. Anything else is a
 * quote that does not show the thing it is evidence for. */
function sentenceAround(text, at, len, max = 130) {
  let start = 0;
  for (let i = at - 1; i >= 0; i -= 1) {
    if (isBoundary(text, i)) { start = i + 1; break; }
  }
  let end = text.length;
  for (let i = at + len; i < text.length; i += 1) {
    if (isBoundary(text, i)) { end = i + 1; break; }
  }
  let s = text.slice(start, end).trim();
  if (s.length > max) {
    /* keep the match centred, and never cut inside it */
    const rel = at - start;
    let from = Math.max(0, Math.min(rel - Math.floor((max - len) / 2), s.length - max));
    let to = Math.min(s.length, from + max);
    if (to < rel + len) to = Math.min(s.length, rel + len + 12);
    if (from > rel) from = Math.max(0, rel - 12);
    s = (from > 0 ? "…" : "") + s.slice(from, to).trim() + (to < s.length ? "…" : "");
  }
  return s.replace(/\s+/g, " ");
}

/* Is this hit negated? Look back a short way for a negator — far enough
 * to catch "no tile backsplash" and "instead of stainless", short
 * enough not to poison a whole paragraph because it opened with "not". */
function negated(normalised, at) {
  const window = normalised.slice(Math.max(0, at - 26), at);
  return NEGATORS.some((n) => window.includes(" " + n + " "));
}

/* Is a guarded word sitting close enough to change what this one
 * means? "subway tile" keeps its hit; "twelve-tile pattern library"
 * loses it. */
function guarded(term, hay, at, len) {
  const words = GUARDS[term];
  if (!words) return false;
  const window = hay.slice(Math.max(0, at - 34), at + len + 34);
  return words.some((w) => window.includes(w));
}

function mine(evidence, tally) {
  const found = new Map();          /* facet:term → fact */
  for (const { section, path, value } of evidence) {
    const text = String(value);
    const hay = norm(text);
    const claimed = [];             /* [start,end) spans already taken */
    for (const { facet, term, surface } of TERMS) {
      const needle = norm(surface);
      let from = 0, at;
      while ((at = hay.indexOf(needle, from)) !== -1) {
        from = at + 1;
        const end = at + needle.length;
        /* whole words only: indexOf would happily find "oak" inside
           "croak", and " " padding cannot be used once the normaliser
           has to preserve length */
        const edged = (at === 0 || hay[at - 1] === " ") &&
                      (end >= hay.length || hay[end] === " ");
        if (!edged) continue;
        /* longest-first plus span consumption: "west texas" books the
           span, so "texas" inside it finds nothing left to claim */
        if (claimed.some(([s, e]) => at >= s && at < e)) continue;
        if (negated(hay, at)) { tally.negated += 1; continue; }
        if (guarded(term, hay, at, needle.length)) { tally.guarded += 1; continue; }
        claimed.push([at, end]);
        const key = facet + ":" + term;
        if (!found.has(key)) found.set(key, { facet, term, n: 0, cites: [] });
        const fact = found.get(key);
        fact.n += 1;
        if (fact.cites.length < 2) {
          fact.cites.push({
            section, field: path,
            quote: sentenceAround(text, at, needle.length),
          });
        }
      }
    }
  }
  return [...found.values()].sort((a, b) => b.n - a.n);
}

const projects = [];
const coverage = { facet: {}, term: {}, negated: 0, guarded: 0, studies: 0 };

for (const file of studyFiles()) {
  const cs = await loadStudy(file);

  /* Evidence. Filenames are included deliberately: these are hand
     written SEO names and they carry keywords the prose never says
     out loud (…-island-pendants-marble-wide). */
  const evidence = [];
  for (const s of cs.sections) {
    for (const { path, value } of strings(s)) {
      evidence.push({
        section: s.id || s.type,
        path,
        value: /src$|image$|thumb$/.test(path) ? filenameWords(value) : value,
      });
    }
  }

  /* Structured facts need no mining — they were curated by hand when
     the study was written, and they are the highest-confidence thing
     in the file. Kept separate from mined facets for that reason. */
  const uniq = (xs) => [...new Set(xs.filter(Boolean).map((x) => String(x).trim()))];
  const disciplines = uniq([
    ...(cs.classification || []),
    ...(cs.services || []),
    ...String(cs.field || "").split("\n"),
  ]);
  const tools = uniq(cs.stack || []);

  /* Statistics, wherever a section keeps them as value/label pairs. */
  const stats = [];
  for (const s of cs.sections) {
    if (!Array.isArray(s.items)) continue;
    for (const it of s.items) {
      if (it && it.value && it.label) {
        stats.push({
          value: String(it.value),
          label: String(it.label),
          note: it.sublabel ? String(it.sublabel) : undefined,
          section: s.id || s.type,
        });
      }
    }
  }

  const facts = mine(evidence, coverage);
  for (const f of facts) {
    coverage.facet[f.facet] = (coverage.facet[f.facet] || 0) + 1;
    coverage.term[f.facet + ":" + f.term] =
      (coverage.term[f.facet + ":" + f.term] || 0) + 1;
  }
  coverage.studies += 1;

  const facets = {};
  for (const f of facts) (facets[f.facet] ??= []).push(f);

  projects.push({
    slug: cs.slug,
    title: cs.title,
    subtitle: cs.subtitle || undefined,
    category: cs.category?.label,
    href: "/case-studies/" + cs.slug,
    year: cs.published ? String(cs.published) : undefined,
    thumb: cs.heroImage || undefined,
    summary: cs.sections.find((s) => s.type === "meta")?.summary || undefined,
    disciplines,
    tools,
    stats,
    facets,
  });
}

/* ── the pulls ──
 * Mined the same way and kept in their own list, because a pull is not
 * a project and must never be answered as one. The board is where an
 * answer goes when the honest reply is "not built, but collected". */
const pulls = [];
for (const p of await loadPulls()) {
  const evidence = [
    { section: "pull", path: "alt", value: p.alt || "" },
    { section: "pull", path: "src", value: filenameWords(p.src) },
  ];
  const facts = mine(evidence, coverage);
  for (const f of facts) {
    coverage.facet[f.facet] = (coverage.facet[f.facet] || 0) + 1;
    coverage.term[f.facet + ":" + f.term] = (coverage.term[f.facet + ":" + f.term] || 0) + 1;
  }
  const facets = {};
  for (const f of facts) (facets[f.facet] ??= []).push(f.term);
  pulls.push({ src: p.src, alt: p.alt, facets });
}

/* ── the report ── */
const totalFacts = projects.reduce(
  (a, p) => a + Object.values(p.facets).reduce((b, v) => b + v.length, 0), 0);
/* The index checks its own work. Every citation must contain the term
   it is evidence for — if it does not, the index-to-text mapping has
   drifted and every quote in the file is suspect. */
const bad = [];
for (const p of projects) {
  for (const facts of Object.values(p.facets)) {
    for (const f of facts) {
      for (const c of f.cites) {
        const q = norm(c.quote);
        const surfaces = TERMS.filter((t) => t.term === f.term).map((t) => norm(t.surface));
        if (!surfaces.some((sf) => q.includes(sf))) {
          bad.push(`${p.slug} ${f.facet}:${f.term} → "${c.quote.slice(0, 60)}"`);
        }
      }
    }
  }
}

const lines = [
  `studies read      ${coverage.studies}`,
  `projects indexed  ${projects.length}`,
  `mined facts       ${totalFacts}`,
  `structured facts  ${projects.reduce((a, p) => a + p.disciplines.length + p.tools.length, 0)}`,
  `statistics        ${projects.reduce((a, p) => a + p.stats.length, 0)}`,
  `pulls indexed     ${pulls.length} (${pulls.filter((p) => Object.keys(p.facets).length).length} carry facts)`,
  `hits rejected     ${coverage.negated} negated, ${coverage.guarded} guarded`,
  `citations checked ${bad.length ? "FAILED — " + bad.length + " quotes do not contain their term" : "all quotes contain their term"}`,
  "",
  "facts by facet:",
  ...Object.entries(coverage.facet).sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `  ${k.padEnd(10)} ${v}`),
  "",
  "terms never found (delete these from the vocabulary):",
];
const dead = [];
for (const { facet, term } of TERMS) {
  const key = facet + ":" + term;
  if (!coverage.term[key] && !dead.includes(key)) dead.push(key);
}
lines.push(dead.length ? "  " + dead.join(", ") : "  none — every term earns its place");
const empty = projects.filter((p) => !Object.keys(p.facets).length);
if (empty.length) {
  lines.push("", "projects with no mined facts:",
    ...empty.map((p) => "  " + p.slug));
}
if (bad.length) lines.push("", "BROKEN CITATIONS:", ...bad.slice(0, 8).map((b) => "  " + b));
console.log(lines.join("\n"));

if (bad.length) {
  console.error("\nrefusing to write: citations must be checkable");
  process.exit(1);
}
if (REPORT) process.exit(0);

mkdirSync(OUT_DIR, { recursive: true });
const payload = { vocabularyVersion: VOCAB_VERSION, projects, pulls };
writeFileSync(OUT_DIR + "/project-facts.json", JSON.stringify(payload, null, 1));

/* A second, compact file for the client. The full index carries
 * citations, which is what makes it trustworthy and also what makes it
 * large; the browser only needs the terms to match against and the
 * project to point at. Same source, two audiences.
 *
 * The alias map ships WITH it, and that is not an optimisation. Folding
 * aliases to their canonical term at build time is right for storage —
 * "bathroom" and "primary bath" are one fact — but the first version
 * dropped the aliases here, which made all 24 of them write-only. They
 * mined perfectly and then no one could ask for them: "marfa" found
 * nothing, so did "calacatta", "shiplap" and "neiman". An index is only
 * worth what you can ask it. */
const aliases = {};
for (const { term, surface } of TERMS) {
  if (norm(surface) !== norm(term)) aliases[surface] = term;
}
const compact = {
  vocabularyVersion: VOCAB_VERSION,
  aliases,
  projects: projects.map((p) => ({
    slug: p.slug, title: p.title, href: p.href, category: p.category,
    year: p.year,
    d: p.disciplines, t: p.tools,
    f: Object.fromEntries(
      Object.entries(p.facets).map(([k, v]) => [k, v.map((x) => x.term)])),
    s: p.stats.map((s) => [s.value, s.label]),
  })),
  /* the board: src to show, alt to read out, facets to match on */
  pulls: pulls.map((p) => ({ src: p.src, alt: p.alt, f: p.facets })),
};
writeFileSync(OUT_DIR + "/project-facts.min.json", JSON.stringify(compact));

const kb = (f) => (Buffer.byteLength(JSON.stringify(f)) / 1024).toFixed(1) + "kb";
console.log(`\nwrote ${OUT_DIR}/project-facts.json      ${kb(payload)}`);
console.log(`wrote ${OUT_DIR}/project-facts.min.json  ${kb(compact)}`);
