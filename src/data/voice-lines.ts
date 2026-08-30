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

  /* Two answers about the same shelf, because they are two questions.
     `board` answers "who inspires you" and is handed the pulls that
     carry a name. `boardAll` answers Staples — the shelf itself — and
     is handed every picture on it and the kept lines with them.

     Not newly written. It is the lede of /inspiration verbatim, which
     is Jeremy's own sentence for this exact object; the same reuse
     NOTES makes when the practice statement renders as a card. */
  boardAll:
    "A shelf of staples I keep coming back to. The people, the work and the rooms that show up in everything I make, whether I notice or not.",
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
    "It depends on what you're building, so there's no set price. Let's talk about what you have in mind and tailor a quote to your exact needs.",
  transfer:
    "Yes. This site is the demo. The same thing works for a restaurant or a contractor, answering the questions customers ask all day. Tell me about your business and I'll show you what yours could look like.",
  process:
    "We start by talking through what you need. Then I design and build it myself. Some things take a day and most take longer, and I'll tell you which yours is before we start.",
  builder:
    "Jeremy Prasatik. I'm an independent designer and developer in Texas, and I built everything here myself, including this search.",
  searchMeta:
    "It's a brand brain, not ChatGPT with a logo on it. Custom built for this site, from my own projects, and tuned to sound like me. The same thing can be made for any company out of their own work and words.",
};
