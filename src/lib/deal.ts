/**
 * The seeded dealer — the pressing composition engine, shared.
 *
 * One LCG stream deals discrete width tiers with a minimum step between
 * neighbours, which is what makes a stack of frames read as a considered
 * composition instead of a random pile. Seeded means REPRODUCIBLE: the
 * same (entries, seed) pair lays out identically on the server, on the
 * client, and in a shared URL — the arithmetic (`seed * 1103515245`
 * through ToInt32) is fully specified by IEEE754, so Node and the
 * browser produce the same stream.
 *
 * Used by the homepage deal. The footer index (PressingIndex) used to
 * carry its own identical copy of this arithmetic, and consolidating
 * the two was a standing cleanup; it resolved itself in Aug 2026 when
 * the homepage became that index and the footer's copy was retired.
 * This module is now the only place the ladder lives.
 */

/** The width ladder, as a share of the image track. Ceiling 0.86, not
 *  1.0: hover grows a frame, and one dealt the full track has nowhere
 *  to go. */
export const DEAL_TIERS = [0.33, 0.43, 0.53, 0.64, 0.74, 0.86];

/** Neighbours never land within this of each other — the size JUMP is
 *  the rhythm. */
export const DEAL_MINSTEP = 0.17;

/** The house seed. Deal-again counts up from here; the URL carries any
 *  other value. */
export const HOUSE_SEED = 5;

/** The prototype's LCG, character for character. */
export function lcg(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/**
 * Deal `count` widths from the ladder. `resetEvery` starts a fresh
 * comparison run (the prototype resets per stack so each column's rhythm
 * stands alone).
 */
export function dealWidths(
  count: number,
  seed: number,
  resetEvery = Infinity
): number[] {
  const rnd = lcg(seed);
  const out: number[] = [];
  let prev = -1;
  for (let i = 0; i < count; i++) {
    if (i % resetEvery === 0) prev = -1;
    let w = 0;
    let guard = 0;
    do {
      w = DEAL_TIERS[Math.floor(rnd() * DEAL_TIERS.length)];
      guard++;
    } while (Math.abs(w - prev) < DEAL_MINSTEP && guard < 14);
    prev = w;
    out.push(w);
  }
  return out;
}

/**
 * Plural-blind token matching over a prebuilt haystack. Dumb on purpose:
 * the interaction (the field re-dealing) is the feature, and this
 * function is the seam where smarter retrieval (embeddings) can land
 * later without touching anything else.
 */
export function queryMatches(haystacks: string[], q: string): number[] {
  const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!toks.length) return haystacks.map((_, i) => i);
  const hit = (h: string, t: string) =>
    h.includes(t) ||
    (t.length > 3 && t.endsWith("s") && h.includes(t.slice(0, -1)));
  const out: number[] = [];
  haystacks.forEach((h, i) => {
    if (toks.every((t) => hit(h, t))) out.push(i);
  });
  return out;
}
