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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { studyFiles, loadStudy, loadPulls, strings, filenameWords } from "./lib/walk-studies.mjs";
import { terms, NEGATORS, GUARDS, QUERY_ALIASES, VOCAB_VERSION } from "./lib/vocabulary.mjs";

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

/* The about layer rides the same pipeline: authored lines from
 * src/data/voice-lines.ts, keys folded the same way queries are, so
 * "Nordstrom" answers "nordstrom" and an alias reaches its line. */
const vfold = (k) => k.toLowerCase().replace(/[^a-z0-9&]+/g, " ").trim();
const VLINES = await import(pathToFileURL(resolve("src/data/voice-lines.ts")).href);
const voice = {
  terms: Object.fromEntries(
    Object.entries(VLINES.voiceLines).map(([k, v]) => [vfold(k), v])),
  set: VLINES.voiceSet,
};

/* ── the daybook ────────────────────────────────────────────────────
 * The freshest thing on the site and the brain could not see it. The
 * case studies say what the work IS; the daybook says what happened
 * this week, and until now "what are you working on" reached the model
 * with nothing and came back with the address.
 *
 * IT GOES IN THE SERVER PAYLOAD ONLY. The compact file is downloaded by
 * every visitor and the client has no use for this: it never matches
 * against the daybook, and the answer that needs it is composed on the
 * server. Same source, and this one has an audience of one.
 *
 * RECENT, NOT ALL. These entries ride in the model's CACHED PREFIX, so
 * they are billed at read rates and cost almost nothing per answer, but
 * the prefix must stay bounded: fifty today is two hundred in a year,
 * and a prefix that grows forever is a bill that grows forever. Twelve
 * is about a fortnight of work, which is what "lately" means. The
 * totals below cover the rest, so the model can still say how long the
 * log runs without carrying every line of it.
 *
 * The citation rule holds without any work here. A daybook entry IS its
 * own citation: it carries the date it happened on and the project it
 * belongs to, which is exactly what a claim about recent work needs. */
const DAYBOOK_N = 12;
const DAYBOOK_CHARS = 260;
const DB = (await import(pathToFileURL(resolve("src/data/daybook.ts")).href)).DAYBOOK;
const dbBody = (e) => {
  const t = (Array.isArray(e.body) ? e.body.join(" ") : e.body).replace(/\s+/g, " ").trim();
  return t.length > DAYBOOK_CHARS ? t.slice(0, DAYBOOK_CHARS).replace(/\s+\S*$/, "") + "…" : t;
};
const daybook = {
  total: DB.length,
  newest: DB[0].date,
  oldest: DB[DB.length - 1].date,
  byProject: DB.reduce((m, e) => ((m[e.project] = (m[e.project] || 0) + 1), m), {}),
  recent: DB.slice(0, DAYBOOK_N).map((e) => ({
    date: e.date,
    project: e.project,
    ...(e.title ? { title: e.title } : {}),
    body: dbBody(e),
    ...(e.link ? { href: e.link.href } : {}),
  })),
};

const projects = [];
const coverage = { facet: {}, term: {}, negated: 0, guarded: 0, studies: 0 };

/* which study renders each image — collected from the studies
   themselves, because the folder is not the study: fairview-suite
   renders frames that live in fairview-bedroom/. Path-as-slug is kept
   only as the fallback for frames nothing claims. */
const srcSlug = new Map();

for (const file of studyFiles()) {
  const cs = await loadStudy(file);

  for (const { value } of strings(cs.sections)) {
    if (/\.(jpe?g|png|webp)$/i.test(value) && !srcSlug.has(value)) srcSlug.set(value, cs.slug);
  }

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
  /* Searchable, never displayed, and deliberately NOT folded into
     disciplines. Every list above prints on the study's cover, so
     until now findable and claimed were the same act: the only way to
     reach Sally Marketing OS by searching "ecommerce" was to put
     ecommerce design on its cover, which the work does not support.
     These stay separate all the way through so the matcher can rank
     them below a real discipline. */
  const keywords = uniq(cs.keywords || []);

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
    /* the cover's authored fact|flavor seam is presentation, not text */
    subtitle: cs.subtitle ? cs.subtitle.replace(/\s*\|\s*/g, " ").trim() : undefined,
    category: cs.category?.label,
    href: "/case-studies/" + cs.slug,
    year: cs.published ? String(cs.published) : undefined,
    thumb: cs.heroImage || undefined,
    summary: cs.sections.find((s) => s.type === "meta")?.summary || undefined,
    disciplines,
    tools,
    keywords,
    stats,
    facets,
  });
}

/* Every pressing study opens with a cover reel: eight or so frames cut
   fast enough to read as motion, so the work moves before a word of it
   is read. It is part of the template rather than a flourish one study
   happened to get, so a pressing study without one is reported here
   rather than discovered later by eye. */
const reels = { have: [], missing: [], transparent: [] };
/* A frame with an alpha channel lets the reel's own dark stage through
   and reads as the picture not filling its box. object-fit cannot save
   it: there is nothing there to cover with. Cheap to check, so it is
   checked rather than remembered — the PNG colour-type byte at offset
   25 is 4 or 6 when the file carries alpha. */
const hasAlpha = (src) => {
  if (!/\.png$/i.test(src)) return false;
  try {
    const b = readFileSync("public" + src);
    return b.slice(1, 4).toString() === "PNG" && (b[25] === 4 || b[25] === 6);
  } catch (e) {
    return false;
  }
};
/* ── the resolution gate ──
 * An image can only be shown as large as its pixels allow: a retina
 * screen asks TWO device pixels per CSS pixel, so native width / 2 is
 * the largest honest CSS width and no amount of CSS buys more. The
 * classic layout never tested that, because it drew everything inside
 * the column. Pressing full-bleeds things, which asks a great deal
 * more of the same file, and the difference shows up as "the live one
 * looks sharper" — the live one was simply never asked to fill a
 * screen.
 *
 * So the treatment is checked against the file, per section, at build
 * time. Named here it costs a minute; found by eye after a study
 * ships it costs the study. The bar is the widest screen the work
 * should look right on: 3200 native carries 1600 CSS at 2x, which
 * covers a laptop and most desktops.
 *
 * PNG/JPEG headers are read directly rather than decoded — the width
 * lives in the first few dozen bytes of both.
 */
const BLEED_MIN = 3200; // full-bleed plates and zoom plates
const PLATE_MIN = 1600; // in-column flow plates (~800 CSS)
const COLUMN_MIN = 760; // a brief/method column image (~380 CSS)
const nativeWidth = (src) => {
  try {
    const b = readFileSync("public" + src);
    if (b.slice(1, 4).toString() === "PNG") return b.readUInt32BE(16);
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length - 9) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        // SOF0..SOF15, minus the non-frame markers in that range
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
          return b.readUInt16BE(i + 7);
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch (e) { /* missing file is the route's problem, not this gate's */ }
  return 0;
};
const thin = [];
/* Walk a section's own shape rather than guessing from the type name:
   the choreo bag is what actually decides how big the thing is drawn. */
const checkSection = (slug, s) => {
  const ch = s.pressing?.choreo || {};
  const bleeds = ch.zoom || s.pressing?.bleed || s.bleed;
  const need = bleeds ? BLEED_MIN : PLATE_MIN;
  const how = bleeds ? "full-bleed/zoom" : "flow plate";
  const srcs = [];
  if (typeof s.src === "string") srcs.push([s.src, need, how]);
  if (typeof s.image === "string") srcs.push([s.image, need, how]);
  /* Column images are held to their own, much lower bar: the whole
     point of the column is that a small file is honest there. It is
     still a bar — under ~760 a file is soft even at column measure.
     Array-guarded: `columns` means a list of text columns on one
     section type and a COLUMN COUNT on masonry, and iterating the
     number threw the whole audit. */
  for (const c of Array.isArray(s.columns) ? s.columns : [])
    if (c.image && c.image.src) srcs.push([c.image.src, COLUMN_MIN, "column image"]);
  for (const [src, min, label] of srcs) {
    const w = nativeWidth(src);
    if (w && w < min)
      thin.push(
        `${slug}: ${src.split("/").pop()} is ${w}px, ${label} wants ${min}px ` +
        `(honest to ${Math.floor(w / 2)} CSS)`
      );
  }
};

for (const file of studyFiles()) {
  const cs = await loadStudy(file);
  if (cs.style !== "pressing") continue;
  const cover = cs.sections.find((x) => x.type === "meta" || x.type === "pressing-cover");
  const imgs = (cover && cover.reel && cover.reel.images) || [];
  (imgs.length ? reels.have : reels.missing).push(cs.slug);
  for (const src of imgs) {
    if (hasAlpha(src)) reels.transparent.push(cs.slug + ": " + src.split("/").pop());
  }
  for (const s of cs.sections) checkSection(cs.slug, s);
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

/* A query alias only ships if its target actually answers. The first
   version of this check ran too late AND looked in too few places: it
   searched disciplines and tools only, so "countertops -> counter"
   was refused even though counter is a furniture fact, and the
   refusal landed after the full index had already been written,
   leaving the two files disagreeing. A gate that fires after a write
   is not a gate. This one runs beside the citation check, before
   anything is written, and searches every facet. */
const deadAliases = [];
for (const [ask, target] of Object.entries(QUERY_ALIASES)) {
  const live = projects.some((p) =>
    [...p.disciplines, ...p.tools].some((d) =>
      d.toLowerCase().split(/[^a-z0-9&]+/).includes(target)) ||
    Object.values(p.facets).some((fs) => fs.some((f) => f.term === target)));
  if (!live) deadAliases.push(`${ask} -> ${target}`);
}

const lines = [
  `studies read      ${coverage.studies}`,
  `projects indexed  ${projects.length}`,
  `mined facts       ${totalFacts}`,
  `structured facts  ${projects.reduce((a, p) => a + p.disciplines.length + p.tools.length, 0)}`,
  `statistics        ${projects.reduce((a, p) => a + p.stats.length, 0)}`,
  `pulls indexed     ${pulls.length} (${pulls.filter((p) => Object.keys(p.facets).length).length} carry facts)`,
  `voice lines       ${Object.keys(voice.terms).length} terms, ${Object.keys(voice.set).length} set pieces`,
  `daybook           ${daybook.recent.length} of ${daybook.total} entries, newest ${daybook.newest}`,
  `cover reels       ${reels.have.length}/${reels.have.length + reels.missing.length} pressing studies${reels.missing.length ? ", MISSING: " + reels.missing.join(", ") : ""}${reels.transparent.length ? ", TRANSPARENT FRAMES: " + reels.transparent.join("; ") : ", every frame opaque"}`,
  `hits rejected     ${coverage.negated} negated, ${coverage.guarded} guarded`,
  `citations checked ${bad.length ? "FAILED — " + bad.length + " quotes do not contain their term" : "all quotes contain their term"}`,
  `query aliases     ${Object.keys(QUERY_ALIASES).length}${deadAliases.length ? " — " + deadAliases.length + " POINT AT NOTHING" : ", every one lands"}`,
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
if (thin.length)
  lines.push("", "images drawn larger than their pixels allow:",
    ...thin.map((t) => "  " + t),
    "  fix: re-export bigger, or drop the bleed so it draws at plate size");
console.log(lines.join("\n"));

if (bad.length) {
  console.error("\nrefusing to write: citations must be checkable");
  process.exit(1);
}
if (deadAliases.length) {
  console.error("\nrefusing to write: these query aliases point at nothing\n  " +
    deadAliases.join("\n  "));
  process.exit(1);
}
if (REPORT) process.exit(0);

mkdirSync(OUT_DIR, { recursive: true });
/* ── what the photographs hold ─────────────────────────────────────
 * Facts observed by the vision pass (scripts/build-vision.mjs), folded
 * in beside the facts mined from copy.
 *
 * They are kept DISTINGUISHABLE, not merged, and that is the whole
 * design. A mined fact cites a sentence Jeremy wrote, so the brain may
 * quote it as something the work says. An observed fact cites a
 * photograph, so the brain may only say it is visible. Collapsing the
 * two would let "brass appears in the sitting room" harden into a claim
 * about intent that nobody ever made — exactly the fabrication the
 * citation rule exists to prevent.
 *
 * The pass is OPTIONAL. No vision file means this is a no-op and the
 * index is what it always was, so a clone without an API key still
 * builds.
 */
const VISION_FILE = OUT_DIR + "/image-vision.json";
const vision = existsSync(VISION_FILE)
  ? JSON.parse(readFileSync(VISION_FILE, "utf8"))
  : { images: {} };

/* Which study an image belongs to is read off its path rather than
   re-walked: every study keeps its frames under its own slug. */
const bySlug = new Map(projects.map((p) => [p.slug, p]));
const images = [];
let observedFacts = 0;

for (const [src, rec] of Object.entries(vision.images || {})) {
  const slug = srcSlug.get(src) || /^\/case-studies\/([^/]+)\//.exec(src)?.[1];
  const project = slug && bySlug.get(slug);
  if (!project) continue;

  /* The four facets the vision schema shares with the vocabulary. The
     free fields (subjects, text, palette, mood) are not facets and do
     not pretend to be — they ride on the image record instead, where a
     query can still reach them. */
  const observed = {
    material: rec.materials || [],
    furniture: rec.furniture || [],
    style: rec.style || [],
    room: rec.room ? [rec.room] : [],
  };

  for (const [facet, terms] of Object.entries(observed)) {
    for (const term of terms) {
      const list = (project.facets[facet] ??= []);
      let fact = list.find((f) => f.term === term);
      if (!fact) {
        fact = { facet, term, n: 0, cites: [], observed: true };
        list.push(fact);
      }
      /* An existing mined fact stays authored — seeing marble in a photo
         does not downgrade the sentence that describes it. It just gains
         a count, because a term backed by copy AND photographs should
         outrank one backed by copy alone. */
      fact.n += 1;
      observedFacts += 1;
      if (fact.cites.length < 3) {
        fact.cites.push({ section: "image", field: src, quote: rec.composition || "" });
      }
    }
  }

  /* The inventory rides in `f` where the matcher already looks. The
     READ layer rides beside it: how the textures mix, what plays
     against what, how busy the frame is, where the eye lands. None of
     it is written down anywhere else in this repo, which is the only
     reason a question like "busy but balanced" can be asked at all. */
  images.push({
    src, slug,
    kind: rec.kind,
    f: observed,
    subjects: rec.subjects || [],
    text: rec.text || [],
    palette: rec.palette || [],
    colours: rec.colours || [],
    mood: rec.mood || [],
    composition: rec.composition || "",
    density: rec.density || "",
    texture: rec.texture_mix || [],
    contrast: rec.contrast || [],
    paletteLogic: rec.palette_logic || "",
    light: rec.light || "",
    focal: rec.focal || "",
    balance: rec.balance || "",
  });
}

/* Re-sort: a term the photographs corroborate should lead. */
for (const p of projects)
  for (const list of Object.values(p.facets)) list.sort((a, b) => b.n - a.n);

const payload = { vocabularyVersion: VOCAB_VERSION, voice, daybook, projects, pulls, images };
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
for (const [ask, target] of Object.entries(QUERY_ALIASES)) aliases[ask] = target;
const compact = {
  vocabularyVersion: VOCAB_VERSION,
  aliases,
  voice,
  projects: projects.map((p) => ({
    slug: p.slug, title: p.title, href: p.href, category: p.category,
    year: p.year,
    d: p.disciplines, t: p.tools,
    /* omitted entirely when empty: this rides in the payload every
       visitor downloads, and most studies will never carry one */
    ...(p.keywords.length ? { k: p.keywords } : {}),
    /* term AND its evidence count: the count is the ranking signal.
       Without it the client cannot tell the living room with seventeen
       sofa mentions from the mockup that has a couch in one photo,
       and answers lead with the wrong project. */
    f: Object.fromEntries(
      Object.entries(p.facets).map(([k, v]) => [k, v.map((x) => [x.term, x.n])])),
    s: p.stats.map((s) => [s.value, s.label]),
  })),
  /* the board: src to show, alt to read out, facets to match on */
  pulls: pulls.map((p) => ({ src: p.src, alt: p.alt, f: p.facets })),
  /* every photographed frame and what is in it, so an answer can show
     the picture rather than a link to the page the picture is on */
  images,
};
writeFileSync(OUT_DIR + "/project-facts.min.json", JSON.stringify(compact));
/* The lab is a static page under public/, so it cannot import from
 * src/. It gets its own copy, fetched at boot — same bytes, third
 * audience. */
writeFileSync("public/lab/project-facts.min.json", JSON.stringify(compact));

console.log(images.length
  ? `observed facts    ${observedFacts} from ${images.length} photographed frames`
  : `observed facts    none — run npm run vision to look at the images`);

const kb = (f) => (Buffer.byteLength(JSON.stringify(f)) / 1024).toFixed(1) + "kb";
console.log(`\nwrote ${OUT_DIR}/project-facts.json      ${kb(payload)}`);
console.log(`wrote ${OUT_DIR}/project-facts.min.json  ${kb(compact)}`);
