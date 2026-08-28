/* The working notes and the filter, in one place.
 *
 * They appear twice on the site: down the homepage's pinned column,
 * and again in the ring that closes every page. That is the same
 * content in two positions, not two contents, so it lives here rather
 * than being typed out in both.
 *
 * The lab (public/lab/pressing-home.html) keeps its own copy, because
 * it has to run as a standalone file with no bundler — and the port
 * carries that copy into pressingHomeDriver.js as its NOTES literal.
 * If you change a line here, change it there.
 *
 * `npm run rail:check` now compares the two and fails the build when
 * they disagree. That seam used to be documented and unenforced, and
 * it drifted exactly as you would expect: "What I do" was rewritten in
 * the lab and this file kept the retired sentence, so the rail in
 * every case-study footer described a different practice than the
 * homepage did.
 */

export interface PracticeNote {
  /** the small label above the block */
  title: string;
  body: string;
  /** An exact substring of `body` to set in grey. Tone is an authoring
   *  decision — the machine only greys what the machine appended. */
  quiet?: string;
  /** One way through, rendered on its own line under the body. A note
   *  in this column is a statement, and a link inside the sentence
   *  reads as a footnote rather than as a door. */
  link?: { label: string; href: string };
}

/** Ordered as the column reads. The practice bio is not here: the
 *  homepage promotes it to the cover statement, and the ring does not
 *  repeat it under the footer. */
export const practiceNotes: PracticeNote[] = [
  { title: "Recently", body: "Awwwards Honors, 2026. Faux Reel released as an open repo. 28 case studies online." },
  {
    title: "Get in touch",
    body: "hello@reckon.house",
    link: { label: "Book 30 minutes", href: "/book" },
  },
  { title: "The setup", body: "Independent, Texas. Design and build. I love the work." },
  { title: "What I do", body: "Creative technologist. AI development. Brand systems. Digital design. Interior design." },
];

/* The plain way in. The brain answers questions and a first-time
   visitor does not always have one, so four doors sit beside the
   field. Each is a real query rather than a separate route: the label
   is the visitor's word, the query is the studies'. */
export const practiceFilters: [label: string, query: string][] = [
  ["Digital Experiences", "digital"],
  ["App Development", "app development"],
  ["Campaign/Creative", "campaign"],
  ["Interiors", "interiors"],
];
