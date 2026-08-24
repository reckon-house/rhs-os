/* ── The calendar Jeremy keeps by hand ───────────────────────────────
 *
 * Not a calendar integration. There is no sync, no OAuth, no third
 * party holding the availability: the windows below are authored, the
 * openings are chosen, and the only live part is whether a slot has
 * been claimed. That is deliberate. A booking page is the most
 * committal thing on the site and it should look like the rest of it,
 * which an embedded widget carrying somebody else's design language
 * never will.
 *
 * WHAT IS TRUE AND WHAT IS MERELY DECIDED. Every slot in WINDOWS is
 * shown. A slot is offered only if it is listed in OPENINGS (or falls
 * to the standing rule below); everything else renders closed. A closed
 * slot never claims to be BOOKED, because most of them are not — it
 * says nothing at all, and "unavailable" is true because Jeremy decided
 * it. The same greyed box does the work of scarcity without putting a
 * small lie on the page, and nobody has ever audited a calendar to find
 * out which kind of closed a Tuesday was.
 *
 * CLAIMED IS THE ONE LIVE FACT. A slot that somebody has actually taken
 * comes from the database, not from here, and the uniqueness that stops
 * two people taking the same one is enforced in Postgres. Everything on
 * this page can be hand-authored except that.
 *
 * TO BLOCK SOMETHING TODAY, without a deploy: add a row to the bookings
 * table in the Supabase dashboard with any name. Taken is taken, and
 * the page cannot tell the difference between a visitor and Jeremy.
 */

/** The house timezone. Slots below are authored in it; the page shows
 *  the visitor their own and says which is which, because a reader in
 *  London booking "9:00" without being told is a no-show. */
export const HOUSE_TZ = "America/Chicago";

/** How long a first conversation is.
 *
 *  Thirty, not fifteen. The contact beat says "A real conversation and
 *  a brainstorm, and a direction we both agree on" on every page of
 *  this site, and fifteen minutes is not that: it reads as a screening
 *  call and sets the wrong expectation before anyone has spoken. */
export const SLOT_MINUTES = 30;

/** The hours Jeremy keeps, as half-open [start, end) in house time.
 *
 *  Only these render. A full nine-to-five grid would be sixteen boxes a
 *  day with four or five live, and that much grey reads as broken
 *  rather than busy. Six boxes a day is small, legible, and its SHAPE
 *  says these are the hours rather than these are the leftovers. */
export const WINDOWS: { from: string; to: string }[] = [
  { from: "09:00", to: "10:30" },
  { from: "15:30", to: "17:00" },
];

/** How many days forward the page offers. Five working days is a week
 *  someone can actually plan around; a month of empty boxes is not
 *  scarcity, it is a diary nobody is in. */
export const DAYS_AHEAD = 5;

/** Weekdays only. 0 is Sunday. */
export const OPEN_DAYS = [1, 2, 3, 4, 5];

/**
 * THE OPENINGS, listed rather than blocked.
 *
 * Roughly five live slots against thirty rendered is the ratio that
 * reads as a working practice. Listing the open ones is five lines a
 * week; listing the closed ones would be twenty-five.
 *
 * Keys are house-local dates, values are house-local start times that
 * must fall inside a WINDOW. Anything not listed is closed.
 *
 * Past dates are ignored rather than pruned, so an old week left here
 * costs nothing and the file can be edited whenever rather than on a
 * schedule.
 */
export const OPENINGS: Record<string, string[]> = {
  // "2026-08-24": ["09:00", "16:00"],
  // "2026-08-26": ["09:30", "15:30"],
  // "2026-08-27": ["10:00"],
};

/**
 * THE STANDING RULE, so the page is never empty.
 *
 * The failure mode of a hand-kept calendar is the week nobody keeps it,
 * and an empty calendar is worse than no calendar: it says the practice
 * is either gone or too busy for you, and the visitor cannot tell
 * which. When a day has no explicit entry above, these house-local
 * times open instead. Set to [] to turn the fallback off and accept
 * that an unkept week shows nothing.
 */
export const STANDING: string[] = ["09:30", "16:00"];
