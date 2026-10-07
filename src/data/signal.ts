/* ── Signal ─────────────────────────────────────────────────────────
   The AI news Jeremy reads, with his note on each one. The daybook
   logs what he built; this logs what he read, and what it means to
   someone building with these tools every day.

   ONE ENTRY IS ONE LINK. The headline and the source are the
   source's. The take is his, in first person, in the voice of
   VOICE.md: plain, warm, one opinion, no flourish on the end. A take
   that only says the news again is cut.

   NO FABRICATION. A take states what he did with the thing, or what
   he thinks of it. If he never used it, the take says so or the entry
   waits. Numbers come from his own work (a bench, a build), never
   from the press release unless the source line says so.

   Dates are absolute and authored: the day he posted it, not the day
   the news broke. Newest first: the room on the homepage sets them in
   that order (scripts/build-signal.mjs; run npm run signal after an edit).

   SEED ENTRIES (6 Oct 2026). The four below are drafts from his notes
   and the repo, written for him to read aloud and edit. The source
   URLs point at product pages until he swaps in the article he read. */

export interface SignalEntry {
  /** Stable slug. The room names the entry's section from it. */
  id: string;
  /** ISO date he posted it. Sorting and grouping both key off this. */
  date: string;
  /** The news, as the source would title it. */
  headline: string;
  /** Who published it. */
  source: string;
  sourceUrl: string;
  /** His note: first person, conversational, one opinion. */
  take: string | string[];
  /** Topics. Title case, reused across entries. */
  tags: string[];
  /** The study the post touches, by its room key ("arc", "sally-os"):
   *  the room shows "See it in" under the note. */
  study?: string;
}

/* The room's own sentence, in three parts, the way the daybook's is:
   the claim, the half that recedes, and how it is kept. */
export const SIGNAL_LEDE = "The AI news I read, and what I make of it.";
export const SIGNAL_DIM =
  "Picked by hand most days, by someone building real products with these tools.";
export const SIGNAL_TAIL = "Newest first, each with a link to the source.";

export const SIGNAL: SignalEntry[] = [
  {
    id: "claude-dispatch",
    date: "2026-10-06",
    headline: "Claude Code and Dispatch: run your Mac from your phone",
    source: "Anthropic",
    sourceUrl: "https://claude.com/product/claude-code",
    take: [
      "Dispatch is how I work when I'm away from the desk. I send a message from my phone and Claude does it on my Mac.",
      "That covers a Claude Code task on this site, a pass through my email, or a look at whatever app I need checked.",
    ],
    tags: ["Claude Code", "Agents", "Claude"],
  },
  {
    id: "perceptron-mk1",
    date: "2026-10-05",
    headline: "Perceptron Mk1, a model that reasons over video",
    source: "Perceptron",
    sourceUrl: "https://www.perceptron.inc",
    take: [
      "A.R.C. runs its video scans on Mk1. You walk a room with your phone, and Mk1 reads the footage across frames, tracks each object through the space, and pulls out what's there for the insurance inventory.",
      "It picks up the spatial context a single photo misses, and a room-by-room scan of a whole house takes minutes.",
    ],
    tags: ["Models", "Video", "A.R.C."],
  },
  {
    id: "dia-browser",
    date: "2026-10-05",
    headline: "Dia, the AI browser from The Browser Company",
    source: "The Browser Company",
    sourceUrl: "https://www.diabrowser.com",
    take: "I've tested more than 20 AI browsers at this point, and Dia is the one I kept. It's my default now.",
    tags: ["Browsers", "Tools"],
  },
  {
    id: "claude-sonnet-5",
    date: "2026-09-06",
    headline: "Claude Sonnet 5",
    source: "Anthropic",
    sourceUrl: "https://www.anthropic.com/claude/sonnet",
    take: [
      "The Ask on this site answers from Sonnet 5 now. Before switching, I ran twelve why questions past it and Haiku 4.5.",
      "Haiku made up a reason for A.R.C. Sonnet answered from the study's own sentence. Sonnet takes about six tenths of a second longer each time. I switched anyway.",
    ],
    tags: ["Models", "Claude"],
  },
];

/* ── Helpers ──────────────────────────────────────────────────────── */

const MONTH = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "October 6", over its entry in the room. */
export function dayHead(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${MONTH[Number(m) - 1]} ${Number(d)}`;
}

/** The entries newest first, whatever order the file holds them in.
 *  Stable, so two on one day keep the order they were written in. */
export const NEWEST: SignalEntry[] = [...SIGNAL].sort((a, b) =>
  a.date < b.date ? 1 : a.date > b.date ? -1 : 0
);
