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
  /** His note: first person, conversational, one opinion. A post in the
   *  four-part format (SIGNAL.md, 11 Oct 2026) keeps a short take for the
   *  index and lists, and the room sets the parts below instead. */
  take: string | string[];
  /** What it is: one plain sentence, from the source. */
  what?: string;
  /** What it does: three to five lines from the source's own
   *  announcement, each a short sentence with a verb. */
  does?: string[];
  /** How I use it: where it runs in his work, the job, one specific.
   *  `useLabel` renames the part ("How I tested it", "What I'd try first"). */
  use?: string | string[];
  useLabel?: string;
  /** What I think: his take, in his words. */
  think?: string | string[];
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
    headline: "Put Claude to work on your computer",
    source: "Anthropic",
    sourceUrl: "https://claude.com/blog/dispatch-and-computer-use",
    take: [
      "Dispatch is how I work when I'm away from the desk. I send a message from my phone and Claude does it on my Mac.",
      "That covers a Claude Code task on this site, a pass through my email, or a look at whatever app I need checked.",
    ],
    /* the four parts (11 Oct 2026): what it is and does from the source, how he uses it, what he thinks */
    what: "Dispatch keeps one running conversation with Claude across your phone and your computer, so a task sent from the phone gets done on the desktop.",
    does: [
      "Takes a task from your phone and leaves the finished work on your computer.",
      "Starts a Claude Code or Cowork session for a report or a pull request.",
      "Runs regular checks, like reading your email every morning.",
      "Uses the computer itself when no connector fits, and asks before opening a new app.",
    ],
    use: [
      "Dispatch is how I work when I'm away from the desk. I send a message from my phone and Claude does it on my Mac.",
      "That covers a Claude Code task on this site, a pass through my email, or a look at whatever app I need checked.",
    ],
    tags: ["Claude Code", "Agents", "Claude"],
  },
  {
    id: "perceptron-mk1",
    date: "2026-10-05",
    headline: "Introducing Perceptron Mk1",
    source: "Perceptron",
    sourceUrl: "https://www.perceptron.inc/blog/introducing-perceptron-mk1",
    take: [
      "A.R.C. runs its video scans on Mk1. You walk a room with your phone, and Mk1 reads the footage across frames, tracks each object through the space, and pulls out what's there for the insurance inventory.",
      "It picks up the spatial context a single photo misses.",
    ],
    /* the four parts (11 Oct 2026): what it is and does from the source, how he uses it, what he thinks */
    what: "Perceptron Mk1 is a model built to understand video and reason about the physical world.",
    does: [
      "Reasons across time, and breaks a video down into what happened and when.",
      "Reads video at up to two frames a second, across a 32,000-token context.",
      "Points to things in a frame with pixel precision.",
      "Matches frontier models from Google, Alibaba, OpenAI and Anthropic on video and embodied reasoning.",
    ],
    use: [
      "A.R.C. runs its video scans on Mk1. You walk a room with your phone, and Mk1 reads the footage across frames, tracks each object through the space, and pulls out what's there for the insurance inventory.",
    ],
    think: [
      "It picks up the spatial context a single photo misses.",
    ],
    tags: ["Models", "Video", "A.R.C."],
  },
  {
    id: "dia-browser",
    date: "2026-10-05",
    headline: "Dia, the AI browser from The Browser Company",
    source: "The Browser Company",
    sourceUrl: "https://www.diabrowser.com",
    /* his words on the review page, 8 Oct 2026, in place of "more than 20
       AI browsers", which only the brief that seeded the post said: "you
       name a browser and i've used it - like REALLY given them a week or
       so of real daily use. i kept finding myself coming back to Dia - not
       really because of the AI but as a true creative person...it just
       looks and works so damn good. every pixel, every micro
       animation...loads smooth in all the right places and ways." */
    take: [
      "You name a browser and I've used it, and really given it a week or so of daily use. Dia is the one I kept coming back to.",
      "Not really because of the AI. As a creative person, it just looks and works so damn good: every pixel, every micro animation, smooth in all the right places.",
    ],
    /* the four parts (11 Oct 2026): what it is and does from the source, how he uses it, what he thinks */
    what: "Dia is a browser from The Browser Company with AI built in, free for Mac and Windows.",
    does: [
      "Starts the day with a brief of your calendar, inbox and key links.",
      "Answers a question across your open tabs and work apps at once.",
      "Gathers what's in Slack, Notion and Teams into a report you can share.",
      "Keeps work, freelance and personal life in separate profiles, a swipe apart.",
      "Turns what you've gathered into slides.",
    ],
    use: [
      "You name a browser and I've used it, and really given it a week or so of daily use. Dia is the one I kept coming back to.",
    ],
    think: [
      "Not really because of the AI. As a creative person, it just looks and works so damn good: every pixel, every micro animation, smooth in all the right places.",
    ],
    tags: ["Browsers", "Tools"],
  },
  {
    id: "claude-sonnet-5",
    date: "2026-09-06",
    headline: "Introducing Claude Sonnet 5",
    source: "Anthropic",
    sourceUrl: "https://www.anthropic.com/news/claude-sonnet-5",
    take: [
      "The Ask on this site answers from Sonnet 5 now. Before switching, I ran twelve why questions past it and Haiku 4.5.",
      "Haiku made up a reason for A.R.C. Sonnet answered from the study's own sentence.",
      "Sonnet takes about six tenths of a second longer each time. I switched anyway.",
    ],
    /* the four parts (11 Oct 2026): what it is and does from the source, how he uses it, what he thinks */
    what: "Claude Sonnet 5 is Anthropic's most agentic Sonnet model yet, close to Opus 4.8 at a lower price.",
    does: [
      "Plans, uses tools like browsers and terminals, and runs on its own.",
      "Checks its own output without being asked, testers say.",
      "Matches Opus 4.8 on some tasks at higher effort.",
      "Resists prompt injection better, and makes things up less, than Sonnet 4.6.",
    ],
    useLabel: "How I tested it",
    use: [
      "The Ask on this site answers from Sonnet 5 now. Before switching, I ran twelve why questions past it and Haiku 4.5.",
      "Haiku made up a reason for A.R.C. Sonnet answered from the study's own sentence.",
    ],
    think: [
      "Sonnet takes about six tenths of a second longer each time. I switched anyway.",
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
