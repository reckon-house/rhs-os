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
};
