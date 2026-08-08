/* The controlled vocabulary the extractor indexes against.
 *
 * Every term here was VALIDATED against the corpus before it was
 * written down: a candidate list of ~130 terms was matched across all
 * 30 studies and the ones that never appeared were deleted. Terracotta,
 * travertine, Montana and Brooklyn are not in this file because they
 * are not in the work. A vocabulary full of terms that never match is
 * how an index starts describing a portfolio nobody has.
 *
 * Canonical term first, aliases after. Aliases fold to the canonical
 * term so "bathroom", "primary bath" and "bath" are one fact with
 * three pieces of evidence rather than three facts.
 *
 * Matching is LONGEST FIRST and consumes its span, so "west texas"
 * never also books a hit for "texas", and "white oak" never books one
 * for "oak". Order in these arrays does not matter; length does.
 */

export const VOCAB_VERSION = 1;

export const FACETS = {
  /* what the work is made of */
  material: [
    ["marble", ["calacatta"]],
    ["oak", ["white oak"]],
    ["brass", ["unlacquered brass"]],
    ["leather", []],
    ["stone", ["limestone", "granite"]],
    ["tile", []],
    ["glass", []],
    ["steel", []],
    ["concrete", []],
    ["wood", ["walnut", "pine", "shiplap", "millwork", "veneer"]],
    ["paper", []],
    ["ceramic", []],
    ["copper", []],
    ["nickel", []],
    ["chrome", []],
    ["wool", []],
    ["velvet", []],
    ["linen", []],
    ["silk", []],
    ["denim", []],
    ["clay", []],
  ],

  /* colours, which in this portfolio behave like materials */
  colour: [
    ["cream", []],
    ["charcoal", []],
    ["sage", []],
    ["blush", []],
    ["cobalt", []],
    ["burgundy", []],
  ],

  /* rooms and the parts of a house */
  room: [
    ["kitchen", []],
    ["bath", ["bathroom", "primary bath", "powder room"]],
    ["bedroom", []],
    ["living room", ["sitting room"]],
    ["dining room", []],
    ["entry", ["foyer", "hallway"]],
    ["office", []],
    ["patio", []],
    ["laundry", []],
    ["garage", []],
    ["pantry", []],
  ],

  /* where the work happened */
  place: [
    ["west texas", ["big bend", "marfa"]],
    ["hill country", []],
    ["dallas", ["frisco"]],
    ["texas", []],
    ["new york", ["nyc"]],
  ],

  /* who it was for. Names are proper nouns, so a hit is unambiguous —
     which is exactly why they are worth indexing separately. */
  client: [
    ["Nordstrom", []],
    ["Neiman Marcus", ["neiman"]],
    ["Jeffrey", []],
    ["Sally Beauty", []],
    ["Cosmo Prof", []],
    ["Ivy Park", []],
    ["Beyoncé", ["beyonce"]],
    ["Valentino", []],
    ["Capitan Boot Co.", ["capitan"]],
    ["J. Christianson", []],
    ["Amber Shockey & Co.", ["amber shockey"]],
    ["Floor & Decor", []],
    ["Dallas Sport Collective", []],
  ],
};

/* Words that are domain terms in one sentence and ordinary English in
 * the next. A guard blocks the hit when one of its words sits nearby,
 * which is cheaper and far more precise than deleting the term: "subway
 * tile" survives, "twelve-tile pattern library" does not.
 *
 * Three terms were deleted outright rather than guarded, because their
 * non-domain sense is the COMMON one here: "suite" (Adobe Creative
 * Suite), "deck" (Exec Deck Builder) and "canvas" ("Loved By earned the
 * bigger canvas"). A term that is usually wrong is not worth rescuing.
 */
export const GUARDS = {
  entry: ["archive", "data", "item", "log", "journal", "ledger"],
  tile: ["pattern", "repeat", "library", "swatch", "grid", "motif"],
  office: ["box office", "front office"],
  stone: ["stepping"],
  paper: ["wallpaper", "newspaper", "paperwork"],
};

/* A match inside one of these is not a fact about the work — it is a
 * fact about what the work is NOT. "no tile backsplash" and "instead of
 * stainless" both name a material the project deliberately does not
 * have, and an index that cannot tell the difference will cheerfully
 * claim the opposite of the copy. */
export const NEGATORS = [
  "no", "not", "never", "without", "instead of", "rather than",
  "zero", "none", "skip", "skipped", "avoided", "avoid", "dropped",
  "nothing", "neither", "nor",
];

/* Flattened, longest first, ready to match. */
export function terms() {
  const out = [];
  for (const [facet, entries] of Object.entries(FACETS)) {
    for (const [canonical, aliases] of entries) {
      for (const surface of [canonical, ...aliases]) {
        out.push({ facet, term: canonical, surface: surface.toLowerCase() });
      }
    }
  }
  return out.sort((a, b) => b.surface.length - a.surface.length);
}
