/* The about layer — the part of an answer no index can mine.
 *
 * Every line in this file was written by Jeremy (voice calibration,
 * Aug 2026) and is quoted, not generated. The composer leads with the
 * `lead`, lets the facts index inject the live counts, and closes on
 * the `tail`. The index supplies numbers and names; this file supplies
 * the person. Neither is allowed to do the other's job, which is what
 * keeps the first-person voice honest: a favorite surface is his to
 * claim, a project count is not his to remember.
 *
 * To teach the house a new one: add an entry, run `npm run facts`.
 * Keys are matched against the canonical term after aliasing, so a
 * line filed under "marble" also answers "calacatta".
 *
 * THE ALTITUDE RULE (Aug 2026): the say explains, the working
 * counts. No numeral appears in the top section unless Jeremy wrote
 * it here, and a number here should be a resume fact that does not
 * drift ("8 years at Nordstrom"), never a project count (those go
 * stale the day a project ships). The composer warns in the console
 * if a count ever leaks back into a say it assembled.
 */

export interface VoiceLine {
  lead?: string;
  tail?: string;
  /** An exact substring of lead+tail to set in grey. Tone is an
   *  authoring decision: the machine only greys clauses IT appended
   *  (counts, caveats, dead words), never a line written here. Use
   *  this when a line has an enumeration that should recede, the way
   *  the practice statement's middle does. */
  quiet?: string;
}

export const voiceLines: Record<string, VoiceLine> = {
  marble: {
    lead: "There are a number of projects using marble, as both an accent and a main surface texture.",
    tail: "It's one of my favorite surfaces and actually more durable and not as expensive as some might think.",
  },
  table: {
    lead: "Tables - a multipurpose anchor of many rooms - have been hand picked throughout my interior projects.",
  },
  kitchen: {
    lead: "The kitchen is the heart of the home and one of my favorite projects to work on.",
  },
  /* From his note, Aug 2026: "he's a HUGE inspiration - probably my
     fav creative person, ever." Lightly set; redline any word. */
  "Jack White": {
    lead: "Jack White is probably my favorite creative person, ever. A huge inspiration.",
  },
  Nordstrom: {
    lead: "I worked at Nordstrom for 8 years in various creative leadership roles.",
    tail: "The projects below span design systems, editorial content strategy, national brand launches and many others.",
  },
};

/* The set pieces: whole answers that belong to a moment rather than a
 * term. Same authorship rule — his words, quoted. */
export const voiceSet = {
  contact:
    "Here's a few ways to get in touch with me. If you have a potential project or just want to chat, I would love to introduce myself and talk. hello@reckon.house.",
  board: "These are things I love and inspired by.",
  miss: "That's one I haven't worked into a project or saved as inspiration. Have a look at the work that might be comparable.",

  /* The owner questions. A visitor sizing this up for their own
   * business asks about price, fit, process, and who is behind it, and
   * the index holds none of that: it carries projects. Templates answer,
   * the model is held, and each receipt says so. Drafted for Jeremy to
   * edit; the fabrication rule shapes all five: no invented prices, no
   * invented timelines, no claims the site cannot demonstrate. */
  /* De-telled on 2026-08-14: the first drafts carried the exact
   * patterns the copy rules flag as machine writing, a "not X" balance
   * in pricing, a rhetorical triplet in transfer, a mirrored pair in
   * process. These are plainer on purpose. Short sentences. No
   * symmetry. They still want Jeremy's own edit; the rule at the top
   * of this block is "his words, quoted" and these are drafts. */
  pricing:
    "There's no rate card. Every project gets priced on its scope. Tell me what you're trying to build at hello@reckon.house and I'll come back with a real number.",
  transfer:
    "Yes. The site you're using right now is the demo. Point the same setup at a restaurant or a contractor and it answers what customers call about all day. Hours, quotes, availability. hello@reckon.house if you want to talk about yours.",
  process:
    "It starts with a conversation about scope. Then I design and build it myself. The studies below show how that has gone, including a tool that shipped in a day. Email hello@reckon.house and I'll walk through it against your project.",
  builder:
    "Jeremy Prasatik. Reckon House Staples is an independent studio in Texas. Everything here was designed and built in-house, including this search.",
  searchMeta:
    "A small model reading an index built from the case studies on this site. The facts that have to be exact, like the email address, are written by hand. Every answer cites the project it came from, so ask about the work and check the receipts.",
};
