/* ── The daybook ────────────────────────────────────────────────────
   A daybook is the register a day's transactions are entered into
   before they are sorted into accounts, which is what this is: what got
   built, dated, in the order it happened.

   ONE ENTRY SHAPE, THREE DENSITIES. Most days are a sentence. Some
   carry a picture. A few are posts with a title and paragraphs. The
   renderer does not branch on a "kind" field — it reads which fields
   are present, so an entry can gain a picture or a title later without
   being reclassified.

   THE REGISTER IS THE LEDGER'S: a noun, a verb, and a number where one
   exists. No why, no commentary, no second-sentence punchline. If a
   line could caption a screenshot of the diff, it is right.

   THE COMMIT SUBJECTS IN THIS REPO ARE NOT THIS COPY. They are written
   in a deliberately literary register ("A phone gets the choreography,
   because nothing about it was ever wide") and they are raw material
   for an entry, never the entry itself. Every line here is written
   fresh against what actually changed.

   Dates are absolute and authored. No relative "3 days ago" — a feed
   that counts up from the last entry turns a quiet fortnight into an
   accusation, and the work is not always on the site. */

export type DaybookProject = "RHS" | "Sally" | "A.R.C." | "Lab";

export interface DaybookEntry {
  /** Stable slug. It is the permalink anchor, so never rewrite one. */
  id: string;
  /** ISO date, authored. Sorting and grouping both key off this. */
  date: string;
  project: DaybookProject;
  /** Present on posts only. Body size, weight alone: never a second scale. */
  title?: string;
  /**
   * The entry. One string is a line; an array is a post's paragraphs.
   * Inline markup is deliberately not supported — a link goes in `link`
   * so a data file never grows an HTML dialect.
   */
  body: string | string[];
  /** One receipt: the thing this entry produced, reachable. */
  link?: { href: string; label: string };
  /**
   * A picture, at column measure. Pick photographs and full-bleed
   * frames: a UI screenshot with its own inner margins reads as a
   * washed-out thumbnail at 480px, and if an image has to be large to
   * be read it belongs in a case study with the entry pointing at it.
   */
  image?: { src: string; alt: string; caption?: string };
}

/* Newest first. The page groups by month off the dates; nothing here
   carries a month header of its own. */
export const DAYBOOK: DaybookEntry[] = [
  {
    id: "the-loop-closes",
    date: "2026-08-14",
    project: "RHS",
    body: "Messages now tell me the moment they arrive, and my answer tells the sender back. Both directions confirmed delivered. The alert carries the whole message and the command to reply to it, so the decision happens on a phone and only the answer needs a laptop.",
    link: { href: "/", label: "Ask the house" },
  },
  {
    id: "threads-go-live",
    date: "2026-08-14",
    project: "RHS",
    body: "Threads update themselves while they are being read. Reply from the operator CLI and it renders on the visitor's page in about two seconds, no reload. Nothing polls in a hidden tab and the cadence opens out to 45 seconds once a conversation goes quiet.",
    link: { href: "/", label: "Ask the house" },
  },
  {
    id: "owner-questions",
    date: "2026-08-14",
    project: "RHS",
    body: "The search learns the owner questions: price, fit, process, who built this, is this AI. All eight fell through to the miss line yesterday. Five hand-written answers now hold the model, each with a receipt saying so, and the cost answer opens the message form under itself.",
    link: { href: "/", label: "Ask the house" },
  },
  {
    id: "sizzle-pressing",
    date: "2026-08-14",
    project: "RHS",
    body: "Faux Reel ported to the pressing language. The cover's own reel takes over from the old hero: the study about cutting stills into motion now opens with that mechanism running its seven-frame default cut.",
    link: { href: "/case-studies/sizzle", label: "The study" },
  },
  {
    id: "trends-demo-wired",
    date: "2026-08-14",
    project: "Sally",
    body: "The fifth demo went into the Sally study, placed after the intelligence sankey because it runs what the diagram draws: feed to Sally's Take to a seeded Jim chat to a drafted campaign play, ending on Approve opening four channel requests.",
    link: { href: "/case-studies/sally", label: "The case study" },
  },
  {
    id: "sally-demos-framed",
    date: "2026-08-13",
    project: "Sally",
    title: "Framed, not ported",
    body: [
      "Four Sally portal demos went into the case study: Jim chat, PDP audit, email build, Figma build. The handoff note proposed one React component per demo. The port went the other way, and they run as documents, framed.",
      "The chrome is extracted verbatim from the portal, so re-deriving 3,200 lines of it forks the copy from the thing it copies. The selectors are names like .header and .message, which collide the moment they are inlined. And the portal is a fixed 1120px internal tool, so a component port meets the same scaling problem and gives up the isolation for nothing.",
    ],
    link: { href: "/case-studies/sally", label: "The case study" },
  },
  {
    id: "mobile-choreography",
    date: "2026-08-13",
    project: "RHS",
    body: "Scroll choreography enabled on phones. Every pin, scrub and parallax now runs at any width. 29 studies checked at 375px, none clip.",
  },
  {
    id: "search-haiku",
    date: "2026-08-12",
    project: "RHS",
    body: "Site search moved to Haiku. A model bench grades the answers against the house copy rules before any of them ship.",
  },
  {
    id: "arc-study-pass",
    date: "2026-08-12",
    project: "RHS",
    body: "A.R.C. study pass: the live demo in a phone mask, coverage cards rebuilt from the app's own screens, three charts redrawn.",
    image: {
      src: "/case-studies/arc/arc-multi-device-lifestyle-hero.jpg",
      alt: "A.R.C. running across phone, tablet, and laptop",
    },
    link: { href: "/case-studies/arc", label: "A.R.C." },
  },
  {
    id: "vision-pass",
    date: "2026-08-11",
    project: "RHS",
    body: "Vision pass: 565 study images read and indexed. The search can answer from what is in the pictures, not just the filenames.",
  },
  {
    id: "chart-system",
    date: "2026-08-10",
    project: "RHS",
    body: "Chart system rebuilt on four shapes: sticks, rings, dots, swatches. An audit gate ships with it and runs green.",
  },
  {
    id: "pressing-port",
    date: "2026-08-09",
    project: "RHS",
    body: "27 studies ported to the redesign in one pass. 29 of 30 now on Pressing.",
  },
  {
    id: "dead-copy",
    date: "2026-08-09",
    project: "RHS",
    body: "Found 44 sections of authored copy rendering as nothing. Fixed.",
  },
  {
    id: "homepage-field",
    date: "2026-08-08",
    project: "RHS",
    body: "New homepage: every project dealt into one field, recomposed by the search rather than listed.",
    link: { href: "/", label: "The homepage" },
  },
  {
    id: "arc-framed",
    date: "2026-08-08",
    project: "RHS",
    body: "The shipped A.R.C. app runs framed inside its own case study.",
  },
  {
    id: "pressing-review",
    date: "2026-08-06",
    project: "RHS",
    body: "41-agent review of the Pressing system. 34 findings confirmed and fixed, and the porting guide written from what they exposed.",
  },
  {
    id: "pressing-sitewide",
    date: "2026-08-05",
    project: "RHS",
    body: "Pressing C shipped sitewide: new masthead, motion kit, Robert Rodriguez rebuilt as the reference implementation. The old site archived at site-v1.",
  },
  {
    id: "pressing-lab",
    date: "2026-08-03",
    project: "Lab",
    body: "Pressing C prototype added to the lab. The redesign started as one HTML file.",
  },

  {
    id: "pdp-competitive",
    date: "2026-07-31",
    project: "Sally",
    body: "Competitive context shipped in PDP Copy Studio: retailer scans, per-retailer counts, and the whitespace read the rewrite cites.",
  },
  {
    id: "crm-2026",
    date: "2026-07-31",
    project: "Sally",
    body: "2026 CRM email templates live. The Figma plugin resynced after serving a July 9 build for three weeks.",
  },
  {
    id: "market-scan-p0",
    date: "2026-07-30",
    project: "Sally",
    body: "P0: the market scan had written zero records for seven days. Found, fixed, and the trends feed rebuilt as real masonry.",
  },
  {
    id: "opus-kwp",
    date: "2026-07-24",
    project: "Sally",
    body: "Strategy lane moved to Opus 5. Google Ads Keyword Planner wired live: real demand growth, ranked per source, refreshed weekly.",
  },
  {
    id: "jim-graphics",
    date: "2026-07-24",
    project: "Sally",
    body: "Jim can draw. A create_graphic tool ships vector output with a preview card.",
  },
  {
    id: "brand-registry",
    date: "2026-07-23",
    project: "Sally",
    body: "Brand Theme Registry: the marketing calendar in Sally's own language. Jim moved to Sonnet 5 and writes Word documents.",
  },
  {
    id: "plays",
    date: "2026-07-22",
    project: "Sally",
    body: "Plays: signal-triggered campaign proposals, delivered with rendered assets.",
  },
  {
    id: "pdp-tabs",
    date: "2026-07-21",
    project: "Sally",
    body: "PDP Copy Studio: Workspace and Page tabs. Jim proposes copy edits and saves them on confirm.",
  },
  {
    id: "awwwards-honors",
    date: "2026-07-20",
    project: "RHS",
    body: "Awwwards: Nominee became Honors.",
  },
  {
    id: "intake-validator",
    date: "2026-07-19",
    project: "Sally",
    body: "Intake workbook: WEB and PAID tabs added, and a validator that reads a filled workbook and prints a triage report.",
  },
  {
    id: "intake-workbook",
    date: "2026-07-16",
    project: "Sally",
    body: "Intake workbook generator v1. One Excel workbook drives the whole request pipeline.",
  },
  {
    id: "faux-reel-name",
    date: "2026-07-15",
    project: "RHS",
    body: "The montage engine renamed twice in a week: SizzleReel, then Reel Tool, then Faux Reel.",
  },
  {
    id: "type-scale",
    date: "2026-07-12",
    project: "RHS",
    body: "Type scale rebuilt across the site, and the flowing headline pattern with it.",
  },
  {
    id: "sizzle-reel",
    date: "2026-07-10",
    project: "RHS",
    body: "SizzleReel: a code-only montage engine. Fourteen transition types, a playground, a GIF exporter, and a case study with the tool running inside its own write-up.",
    link: { href: "/case-studies/sizzle", label: "Faux Reel" },
  },
  {
    id: "sizzle-portal",
    date: "2026-07-10",
    project: "Sally",
    body: "The same engine ported into the portal that afternoon: saved reels, beat reordering, MP4 and GIF export straight to the DAM.",
  },
  {
    id: "pdp-stage-one",
    date: "2026-07-06",
    project: "Sally",
    body: "PDP Copy Studio: SEO and AEO chips, compliance guardrails, an attribute-schema fix. The editorial redesign went live the next day.",
  },
  {
    id: "category-pages",
    date: "2026-07-05",
    project: "RHS",
    body: "Category pages: featured heroes, plainer voice.",
  },

  {
    id: "arc-1-0-1",
    date: "2026-06-30",
    project: "A.R.C.",
    body: "v1.0.1 build 5 to the App Store: in-app rating prompt at scan-save, and a pass over the store metadata.",
  },
  {
    id: "arc-paywall",
    date: "2026-06-28",
    project: "A.R.C.",
    body: "Fixed the paywall's couldn't-load-subscriptions bug.",
  },
  {
    id: "arc-resubmit",
    date: "2026-06-25",
    project: "A.R.C.",
    body: "Build 1.0.0 (3) resubmitted to App Review, with the demo re-architected as a no-save trial.",
  },
];

/** The strip on the homepage. Two, because it is a signal that the site
 *  is being worked on, not a place to read. */
export const DAYBOOK_STRIP = DAYBOOK.slice(0, 2);

const MONTH = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "Aug 13" for a row, from the ISO date. Built by hand rather than
 *  through toLocaleDateString: that reads the RUNTIME's locale, so the
 *  server and the browser can format the same entry differently and
 *  React logs a hydration mismatch for a date that never changed. */
export function dayLabel(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${MONTH[Number(m) - 1].slice(0, 3)} ${d}`;
}

/** "August 2026", the month header. */
export function monthLabel(iso: string): string {
  const [y, m] = iso.split("-");
  return `${MONTH[Number(m) - 1]} ${y}`;
}

/** Entries grouped into months, newest month first, preserving order. */
export function byMonth(entries: DaybookEntry[] = DAYBOOK) {
  const out: Array<{ key: string; label: string; entries: DaybookEntry[] }> = [];
  for (const e of entries) {
    const key = e.date.slice(0, 7);
    const last = out[out.length - 1];
    if (last && last.key === key) last.entries.push(e);
    else out.push({ key, label: monthLabel(e.date), entries: [e] });
  }
  return out;
}
