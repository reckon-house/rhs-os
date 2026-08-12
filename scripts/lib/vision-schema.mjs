/* What to write down when looking at a photograph.
 *
 * TWO LAYERS, and the second is the point.
 *
 * The INVENTORY layer is what is in the frame: materials, furniture,
 * room, legible text. It is the layer a tagger produces, it maps onto
 * the site's existing facet vocabulary, and on its own it is thin —
 * "marble, brass, white oak" describes a spec sheet, not a room.
 *
 * The READ layer is what a designer notices: how the textures mix, how
 * a busy corner is paid for by a calm one, which single object the eye
 * lands on, whether the palette is tonal or hangs on one accent. That
 * is the difference between a search that can find brass and a search
 * that can find "busy but balanced" — and nobody in this portfolio ever
 * wrote those words down, so nothing else can supply them.
 *
 * STILL OBSERVATION, NEVER INTENT. "The crystal is held by the flat
 * tile field" is a fact about the composition and is allowed. "Jeremy
 * chose crystal to soften the room" is a claim about why, and is not.
 * The line is the same one build-facts.mjs draws: an observation cites
 * the photograph, and may never harden into something the work SAYS.
 */

/* Suggested terms rather than a closed enum. A closed list would force
   a read into the nearest wrong word; an open one lets the corpus tell
   us which relationships actually recur, and the merge reports the
   frequent ones as vocabulary candidates — the same way subjects
   already grow the facet list. */
export const CONTRAST_TERMS = [
  "ornament against plane",
  "busy against calm",
  "warm against cool",
  "matte against polish",
  "rough against smooth",
  "old against new",
  "dark against light",
  "organic against geometric",
  "heavy against delicate",
  "saturated against neutral",
  "pattern against solid",
  "hard against soft",
];

export const DENSITY = ["spare", "measured", "layered", "dense"];

export const PALETTE_LOGIC = [
  "tonal",          // one hue, many values
  "one accent",     // neutral field, single colour carrying it
  "two-tone",
  "earth range",
  "high contrast",
  "monochrome",
  "complementary",
  "saturated field", // colour IS the ground, as in a studio seamless
];

export const LIGHT = [
  "soft daylight", "hard sun", "overcast", "studio strobe",
  "warm lamplight", "mixed", "backlit", "flat",
];

export const KINDS = [
  "photograph", "screenshot", "artwork", "mockup",
  "specimen", "pattern", "logo", "diagram",
];

/* The instruction the models read. Written as a brief rather than a
   field list, because the read layer is judgement and a bare schema
   produces bare answers. */
export const BRIEF = `You are cataloguing photographs for a design studio's search index. Two layers, and the second is what makes this worth doing.

LAYER ONE, the inventory. What is in the frame: materials, furniture, the room, anything legible. Straightforward, and not sufficient on its own.

LAYER TWO, the read. What a designer sees standing in front of it:
- how the textures actually mix, named specifically ("hammered copper", "cut crystal", "flat glazed tile", "raw oak", "loose weave"), not generically ("metal", "wood")
- where the frame is busy and where it rests, and how those pay for each other
- what the eye lands on first, and what holds it there
- how the palette is organised: tonal, one accent carrying a neutral field, earth range, high contrast
- the quality and direction of the light

THE ONE RULE: record only what is visible. Composition, tension and balance are visible and belong here. Intent, outcome, quality and praise are not. "The crystal chandelier is held by the flat tile field" is an observation and is welcome. "The chandelier was chosen to soften the room" is a claim about why, and is forbidden. Never guess at a client, a date, a budget or a result. Do not repeat the caption you are given as though you saw it: captions in this portfolio sometimes describe the product rather than the picture.

If you cannot see something clearly, leave it out and lower the confidence. An empty array is a correct answer; a guess is not.`;

/* One record. Kept as a plain shape rather than JSON Schema because
   the readers are agents in-session, not an API endpoint — the merge
   validates on the way in. */
export const FIELDS = `{
  "kind":        one of ${KINDS.join(" | ")},
  "room":        one of the room vocabulary, or null if not a room,
  "materials":   [ facet terms only, from the material list ],
  "furniture":   [ facet terms only, from the furniture list ],
  "style":       [ facet terms only, from the style list ],
  "colours":     [ plain colour names: rust, fuchsia, camel, sage ],
  "palette":     [ 3-5 hex values the frame is actually built from ],
  "subjects":    [ specific nouns the facet lists have no word for:
                   "turntable", "pampas grass", "gilt frame", "tractor stool" ],
  "text":        [ legible text, verbatim: signage, spines, packaging, UI labels ],
  "mood":        [ two or three words: quiet, kinetic, austere, warm ],

  "density":     one of ${DENSITY.join(" | ")},
  "texture_mix": [ specific textures present: "hammered copper", "cut crystal",
                   "flat glazed tile", "raw oak", "loose weave" ],
  "contrast":    [ relationships at work, e.g. "ornament against plane",
                   "warm against cool". Coin a new one when none fits. ],
  "palette_logic": one of ${PALETTE_LOGIC.join(" | ")},
  "light":       one of ${LIGHT.join(" | ")},

  "focal":       one sentence: what the eye lands on and what holds it,
  "balance":     one sentence: where the frame is busy, where it rests,
                 and how those two pay for each other,
  "composition": one sentence: vantage, symmetry, what dominates,

  "confidence":  high | medium | low
}`;
