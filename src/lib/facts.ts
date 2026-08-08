/* Querying the facts index.
 *
 * The index is built by scripts/build-facts.mjs from the case studies
 * themselves; this is the read side. It exists so an answer can be
 * specific — "marble is in the Hill Country kitchen and bath" rather
 * than "3 pieces matched" — and so the thing composing that answer has
 * exactly one way to find out what is true.
 *
 * Everything here is a lookup. Nothing infers, nothing guesses, and a
 * term that is not in the index simply returns nothing. That is the
 * point: the composer can only say what the index can show it.
 */
import compact from "@/data/generated/project-facts.min.json";

export type Facet = "material" | "colour" | "room" | "place" | "client" | "furniture";

/** A saved image from the inspiration board. Collected, not built — and
 *  the distinction is load-bearing, because an answer must never claim
 *  a pull as work. */
export interface Pull {
  src: string;
  alt: string;
  f: Partial<Record<Facet, string[]>>;
}

export interface FactProject {
  slug: string;
  title: string;
  href: string;
  category?: string;
  year?: string;
  /** disciplines, curated in the study's own classification/services */
  d: string[];
  /** tools, from the study's stack */
  t: string[];
  /** mined facets: facet → [canonical term, evidence count]. The count
   *  rides along because it is the ranking signal: seventeen sofa
   *  mentions outrank a couch that appears in one mockup photo. */
  f: Partial<Record<Facet, [string, number][]>>;
  /** statistics as [value, label] */
  s: [string, string][];
}

/** An authored line from src/data/voice-lines.ts — the about layer.
 *  Quoted from Jeremy, never generated; the composer leads with it
 *  and lets the index supply the counts. */
export interface VoiceLine {
  lead?: string;
  tail?: string;
}

const DB = compact as unknown as {
  vocabularyVersion: number;
  /** surface form → canonical term, e.g. bathroom → bath, marfa → west texas */
  aliases: Record<string, string>;
  voice: { terms: Record<string, VoiceLine>; set: Record<string, string> };
  projects: FactProject[];
  pulls: Pull[];
};

export const projects: FactProject[] = DB.projects;
export const voiceTerms = DB.voice?.terms ?? {};
export const voiceSet = DB.voice?.set ?? {};
export const pulls: Pull[] = DB.pulls ?? [];
export const vocabularyVersion = DB.vocabularyVersion;

const fold = (s: string) => s.toLowerCase().replace(/[^a-z0-9&]+/g, " ").trim();

/* Aliases fold to their canonical term when the index is BUILT, which is
 * right for storage and wrong for asking. Resolving them here is what
 * lets someone type the word they actually use — "marfa", "shiplap",
 * "powder room" — and reach the fact filed under west texas, wood, bath. */
const ALIAS: Record<string, string> = Object.fromEntries(
  Object.entries(DB.aliases ?? {}).map(([k, v]) => [fold(k), fold(v)])
);
const resolve = (q: string) => ALIAS[q] ?? q;

/* Does a single word name a multi-word term? "dining" should find
 * "dining room" the way "interior" already finds "Interior Design".
 * The whole term still has to be matched word-for-word, so "dining"
 * reaches "dining room" but "room dining" and "din" reach nothing. */
const namesTerm = (term: string, q: string) => {
  const f = fold(term);
  return f === q || f.split(" ").includes(q);
};

/* Every term the index knows, by facet. This is also the honest answer
 * to "what can I ask about" — it is derived, not authored. */
export const known: Record<string, Set<string>> = (() => {
  const out: Record<string, Set<string>> = {};
  for (const p of projects) {
    for (const [facet, terms] of Object.entries(p.f)) {
      (out[facet] ??= new Set()).add("");
      for (const [t] of terms as [string, number][]) out[facet].add(fold(t));
    }
    (out.discipline ??= new Set());
    for (const d of p.d) out.discipline.add(fold(d));
    (out.tool ??= new Set());
    for (const t of p.t) out.tool.add(fold(t));
  }
  for (const set of Object.values(out)) set.delete("");
  return out;
})();

export interface Hit {
  project: FactProject;
  /** which facet the term was found in, the term as indexed, and how
   *  much evidence backs it (structured facts count as 1) */
  matches: { facet: string; term: string; n: number }[];
}

/* Which projects carry this term, and in what capacity.
 *
 * Matching is exact against indexed terms after folding, plus a
 * contains-check for multi-word disciplines ("interior" finding
 * "Interior Design"). Deliberately no fuzziness beyond that: a facts
 * index that guesses is just a search engine with extra confidence. */
export function lookup(query: string): Hit[] {
  const q = resolve(fold(query));
  if (!q) return [];
  const hits: Hit[] = [];
  for (const p of projects) {
    const matches = matchesOn(p, q);
    if (matches.length) hits.push({ project: p, matches });
  }
  if (hits.length) return hits;

  /* Nothing matched the phrase whole, so try it as several terms at
   * once: "kitchen island" is a room and a thing in it, and the project
   * that has both is the one being asked about.
   *
   * EVERY word must land. An OR here would be the flood — ask for
   * "kitchen island" and get back every project with a kitchen — and a
   * broad answer delivered confidently is the failure this index was
   * built to avoid. */
  const words = q.split(" ").map(resolve).filter((w) => w.length > 2);
  if (words.length < 2) return [];
  for (const p of projects) {
    const per = words.map((w) => matchesOn(p, w));
    if (per.every((m) => m.length)) hits.push({ project: p, matches: per.flat() });
  }
  return hits;
}

function matchesOn(p: FactProject, q: string): { facet: string; term: string; n: number }[] {
  const matches: { facet: string; term: string; n: number }[] = [];
  for (const [facet, terms] of Object.entries(p.f)) {
    for (const [t, n] of terms as [string, number][]) {
      if (namesTerm(t, q)) matches.push({ facet, term: t, n });
    }
  }
  for (const d of p.d) if (namesTerm(d, q)) matches.push({ facet: "discipline", term: d, n: 1 });
  for (const t of p.t) if (namesTerm(t, q)) matches.push({ facet: "tool", term: t, n: 1 });
  return matches;
}

/* Saved images carrying this term. Separate from lookup() by design:
 * the board is the honest home for "I did not build this, but I keep
 * it" — and an answer that blurs the two is claiming credit. */
export function lookupPulls(query: string): Pull[] {
  const q = resolve(fold(query));
  if (!q) return [];
  return pulls.filter((p) =>
    Object.values(p.f).some((terms) => (terms as string[]).some((t) => namesTerm(t, q)))
  );
}

/* Facets a term belongs to across the whole portfolio — what KIND of
 * thing was asked about. "marble" is a material, "kitchen" a room,
 * "Photoshop" a tool, and the answer reads differently for each. */
export function facetsOf(query: string): string[] {
  const q = resolve(fold(query));
  const out = new Set<string>();
  for (const [facet, set] of Object.entries(known)) {
    for (const t of set) if (namesTerm(t, q)) { out.add(facet); break; }
  }
  return [...out];
}
