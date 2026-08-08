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

export type Facet = "material" | "colour" | "room" | "place" | "client";

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
  /** mined facets: facet → canonical terms */
  f: Partial<Record<Facet, string[]>>;
  /** statistics as [value, label] */
  s: [string, string][];
}

const DB = compact as unknown as {
  vocabularyVersion: number;
  projects: FactProject[];
};

export const projects: FactProject[] = DB.projects;
export const vocabularyVersion = DB.vocabularyVersion;

const fold = (s: string) => s.toLowerCase().replace(/[^a-z0-9&]+/g, " ").trim();

/* Every term the index knows, by facet. This is also the honest answer
 * to "what can I ask about" — it is derived, not authored. */
export const known: Record<string, Set<string>> = (() => {
  const out: Record<string, Set<string>> = {};
  for (const p of projects) {
    for (const [facet, terms] of Object.entries(p.f)) {
      (out[facet] ??= new Set()).add("");
      for (const t of terms as string[]) out[facet].add(fold(t));
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
  /** which facet the term was found in, and the term as indexed */
  matches: { facet: string; term: string }[];
}

/* Which projects carry this term, and in what capacity.
 *
 * Matching is exact against indexed terms after folding, plus a
 * contains-check for multi-word disciplines ("interior" finding
 * "Interior Design"). Deliberately no fuzziness beyond that: a facts
 * index that guesses is just a search engine with extra confidence. */
export function lookup(query: string): Hit[] {
  const q = fold(query);
  if (!q) return [];
  const hits: Hit[] = [];
  for (const p of projects) {
    const matches: { facet: string; term: string }[] = [];
    for (const [facet, terms] of Object.entries(p.f)) {
      for (const t of terms as string[]) {
        if (fold(t) === q) matches.push({ facet, term: t });
      }
    }
    for (const d of p.d) {
      const f = fold(d);
      if (f === q || f.split(" ").includes(q)) matches.push({ facet: "discipline", term: d });
    }
    for (const t of p.t) {
      const f = fold(t);
      if (f === q || f.split(" ").includes(q)) matches.push({ facet: "tool", term: t });
    }
    if (matches.length) hits.push({ project: p, matches });
  }
  return hits;
}

/* Facets a term belongs to across the whole portfolio — what KIND of
 * thing was asked about. "marble" is a material, "kitchen" a room,
 * "Photoshop" a tool, and the answer reads differently for each. */
export function facetsOf(query: string): string[] {
  const q = fold(query);
  const out = new Set<string>();
  for (const [facet, set] of Object.entries(known)) {
    if (set.has(q)) out.add(facet);
    else if (facet === "discipline" || facet === "tool") {
      for (const t of set) if (t.split(" ").includes(q)) out.add(facet);
    }
  }
  return [...out];
}
