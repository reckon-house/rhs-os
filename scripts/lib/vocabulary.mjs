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

/* 2: added the furniture facet, so anything caching against this
 * version must rebuild. */
export const VOCAB_VERSION = 2;

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

  /* What is actually IN the photographs. This facet exists because
   * "table" returned nothing while "dining table" sat in the alt text
   * eight times over — the extractor was reading the word and throwing
   * it away, because nothing was looking for it.
   *
   * No vision model was needed to find any of this. Every image in the
   * portfolio already carries a written description (339 of 340 study
   * images, 97 of 104 pulls), and those descriptions name the objects
   * the prose never mentions. This is a vocabulary gap wearing the
   * costume of a perception gap.
   *
   * Compound terms stay separate rather than folding into aliases:
   * a coffee table is not a dining table. Query-side word matching
   * reunites them, so "table" still finds all three. */
  furniture: [
    ["fireplace", []],
    ["chandelier", []],
    ["table", []],
    ["dining table", []],
    ["coffee table", []],
    ["side table", []],
    ["sofa", ["couch"]],
    ["cabinet", ["cabinetry"]],
    ["window", []],
    ["bench", []],
    ["rug", []],
    ["island", []],
    ["shelf", ["shelving", "open shelving"]],
    ["tub", []],
    ["vanity", []],
    ["chair", ["armchair"]],
    ["pendant", []],
    ["shower", []],
    ["mirror", []],
    ["backsplash", []],
    ["mantel", []],
    ["hardware", []],
    ["sink", []],
    ["counter", ["countertop"]],
    ["faucet", []],
    ["sconce", []],
    ["beam", []],
    ["ottoman", []],
    ["door", []],
    ["pillow", []],
    ["artwork", []],
    ["vase", []],
    ["bowl", []],
    ["plant", []],
    ["stool", []],
    ["headboard", []],
    ["bed", []],
    ["lamp", []],
    ["refrigerator", []],
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

  /* Who the board keeps. Mined almost entirely from the inspiration
     pulls (their descriptions and filenames), and the claim a hit
     makes is only PRESENCE: this face is on the board. The warmth
     belongs to the voice file. A muse is not a client, and the two
     never share a sentence. */
  muse: [
    ["Jack White", []],
    ["Miles Davis", []],
    ["Waylon Jennings", []],
    ["Johnny Cash", []],
    ["Wes Anderson", []],
    ["Dieter Rams", []],
    ["Josh Brolin", []],
    ["Quentin Tarantino", ["tarantino"]],
    ["Frank Lloyd Wright", []],
    ["Lightnin' Hopkins", ["lightnin hopkins"]],
    ["The Dead Weather", ["dead weather"]],
    ["Charley Crockett", []],
    ["Alison Mosshart", ["mosshart"]],
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
 * Terms deleted outright rather than guarded, because their non-domain
 * sense is the COMMON one here. The first three came from the materials
 * pass: "suite" (Adobe Creative Suite), "deck" (Exec Deck Builder) and
 * "canvas" ("Loved By earned the bigger canvas"). The furniture pass
 * added seven more, each checked against the corpus before being cut:
 *
 *   art      always "Art Direction" or "art prints"
 *   range    the Chisos range, and "how much visual range"
 *   pull     a verb every single time: "the box beams pull the contrast"
 *   floor    "desert floor", "floor capacity", and the client Floor & Decor
 *   fixture  "Fixture Sourcing", a service and not an object
 *   console  DSC's owner console, software far more often than furniture
 *   wall     "canyon wall", "fill a wall" — rarely a thing in a room
 *
 * A term that is usually wrong is not worth rescuing.
 */
export const GUARDS = {
  entry: ["archive", "data", "item", "log", "journal", "ledger"],
  tile: ["pattern", "repeat", "library", "swatch", "grid", "motif"],
  office: ["box office", "front office"],
  stone: ["stepping"],
  paper: ["wallpaper", "newspaper", "paperwork"],
  /* "polka dots in the bowl of the 'a'" is typography, not a serving
     bowl; a Super Bowl is neither. */
  bowl: ["polka", "letterform", "glyph", "super", "of the a"],
  /* the studies talk about beaming and about box beams both */
  beam: ["beaming"],
  /* "the bed of the truck", and Big Bend's river beds */
  bed: ["truck", "river", "creek"],
  /* A design portfolio that also builds software says "window" about
     four different things. The room's window survives (16 of 20 hits
     are real); the model's context window, a retail decal and "the
     response window opens" do not. */
  window: ["context", "decal", "browser", "token", "response"],
  /* Software borrows the furniture. "A tabbed shelf" is a UI pattern
     and "signal to shelf and back" is a supply chain, but the chalet's
     leaning ladder shelf is a real object holding real things. A
     "shelf talker" is retail signage and belongs to neither. */
  shelf: ["tabbed", "signal to", "off the", "talker"],
  /* Kept narrow on purpose. "Front door" is a real door on a real
     chalet, so it is not guarded — only the three places the studies
     use a doorway as a figure of speech. */
  door: ["out the door", "back office", "first build"],
};

/* The world's word for a service, mapped to the studies' word for
 * it. A visitor asks "do you do branding?" and the studies answer in
 * their own diction: Brand Identity, Brand & Web, Brand Development.
 * Same rule as everything else here: a mapping only ships if its
 * target is alive in the index, and the build refuses it otherwise. */
export const QUERY_ALIASES = {
  branding: "brand",
  website: "web",
  websites: "web",
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
