/* ── /custom, the page a small business lands on ─────────────────────
 * Every word on the page is here, so a line can be changed without
 * touching the layout. The lede, the doors and the price line are
 * Jeremy's, edited for the page from how he says them (his outreach
 * email and his notes, September 2026); the rows are the studies' own
 * lines, verbatim from projects.ts and board-house.json, because a
 * study already says what it is.
 *
 * The page is sent in an email, so it is a straight read: who this is,
 * the two things on offer, what it costs to find out, then the proof.
 * The rest of the site is one chip away and never the entry point. */

export interface Row {
  title: string;
  line: string;
  href: string;
  /** the board's thumb of the study's cover (scripts/build-board-thumbs.mjs),
   *  which also wrote it at @768 and @384 beside the full one */
  thumb?: string;
  w?: number;
  h?: number;
}

export const CUSTOM = {
  caption: "Custom",
  lede: "I'm Jeremy Prasatik. I run a small design and software studio in Celina, Texas.",
  dim:
    "Brand and web design on the front end, custom tools on the back end, and help getting a " +
    "business set up on the assistants built into Claude, ChatGPT and Gemini.",
  doors: [
    {
      head: "Set up.",
      body:
        "The tools you already have, connected, with the repetitive work handed to an " +
        "assistant: the inbox, the calendar, bookings, invoices. It runs in your own Claude, " +
        "ChatGPT or Gemini account, and I'll help you pick which one.",
    },
    {
      head: "Build.",
      body:
        "When the tool you need doesn't exist, I make it. A scheduler, a customer list, an " +
        "app, the site out front. One person designs it and builds it, so it fits how you " +
        "already work.",
    },
  ],
  price:
    "Each project is scoped and priced on its own, and there's usually a version that fits " +
    "the budget. It starts with a call.",
  ask: {
    placeholder: "Ask:",
    wait: "Reading the studies.",
    none: "Nothing here answers that. hello@reckon.house does.",
    reach: "hello@reckon.house. Or keep asking here.",
  },
  full: "Full case study",
  heads: {
    studio: "Twenty years, large and small.",
    method: "How I work.",
    talk: "Let's talk.",
  },
  large: "The larger ones: Nordstrom, Neiman Marcus, Ivy Park by Beyoncé, Floor & Decor.",
  all: "All the work",
  talk: {
    lede: "Let's talk about what you have in mind and tailor a quote to your exact needs.",
    book: "Pick a time",
    email: "hello@reckon.house",
  },
};

const T = "/lab/board-thumbs";

/* ── THE RECENT WORK, IN PIECES ──────────────────────────────────────
   A study is several things a small business would buy one at a time:
   the gym's scheduler is a booking line, a back office and a front
   door; the marketing OS is a feed, a brain, a library and a shelf of
   small tools. So each piece stands as a column of its own, in the
   clothes a study's preview wears on the board: its chip, the study's
   sentence about it, the way to the full study, and its picture. The
   words are the studies' own (dsc, arc, sally, sizzle case studies),
   cut to a lede and its grey half. A picture is the board's thumb of
   the study's plate where the board has one, the plate itself where
   it does not. */
export interface Piece {
  id: string;
  /** the piece's name, and the study it belongs to */
  chip: string;
  project: string;
  lede: string;
  dim: string;
  href: string;
  image: { src: string; alt: string; w?: number; h?: number };
}

const DSC = "Dallas Sport Collective";
const ARC = "A.R.C.";
const SALLY = "Sally Marketing OS";

export const PIECES: Piece[] = [
  {
    id: "dsc-booking",
    chip: "Booking from any AI",
    project: DSC,
    lede:
      "An athlete never has to open the app. They ask whichever AI they already use, and it " +
      "reads their real schedule and can put in a session request.",
    dim:
      "Eleven tools cover the gym overview, the program list, trainer profiles and " +
      "availability, the athlete's own sessions and pending requests, slot suggestions, " +
      "booking requests, and cancellations. A write only ever creates a pending request the " +
      "owner has to approve.",
    href: "/case-studies/dsc",
    image: {
      src: `${T}/dsc/dsc-ai-scheduler-phone-hero.webp`,
      alt: "The DSC scheduler open on a phone",
      w: 1024,
      h: 632,
    },
  },
  {
    id: "dsc-owner",
    chip: "The owner console",
    project: DSC,
    lede:
      "The owner side is built for one person on the gym floor. Managing a packed week from " +
      "a phone, between sessions.",
    dim:
      "The queue where every request lands, a week calendar with the session count per day, " +
      "and a member list flagging waiver and trainer-assignment status. The owner can say a " +
      "whole week out loud, and the scheduler proposes the batch, names the conflicts it " +
      "skipped, and waits for the word commit.",
    href: "/case-studies/dsc",
    image: {
      src: `${T}/dsc/dsc-owner-calendar-phone-hero.webp`,
      alt: "The owner's calendar on a phone",
      w: 1536,
      h: 948,
    },
  },
  {
    id: "dsc-door",
    chip: "The front door",
    project: DSC,
    lede:
      "The first build was the front door. Athletes create their own accounts, sign the " +
      "waiver on the way in, and the owner assigns each new member to a trainer before " +
      "anyone books a session.",
    dim:
      "A hundred-plus people moving off text threads and a spreadsheet and onto one roster " +
      "the software can work with. The marketing site is the part of that door the public " +
      "sees.",
    href: "/case-studies/dsc",
    image: {
      src: `${T}/dsc/dsc-marketing-site-laptop-stool-hero.webp`,
      alt: "The marketing site on a laptop",
      w: 1024,
      h: 683,
    },
  },
  {
    id: "arc-inventory",
    chip: "The inventory",
    project: ARC,
    lede:
      "One photo of a room comes back as a list of what is in it. Each item comes back " +
      "named, valued, and sorted into a category.",
    dim:
      "A video of the room works the same way. The image passes through vision processing, " +
      "object identification, value estimation, and archival, and each stage feeds the next.",
    href: "/case-studies/arc",
    image: {
      src: `${T}/arc/arc-app-kitchen-project-selection-lifestyle.webp`,
      alt: "A.R.C. on a phone, in a kitchen",
      w: 1536,
      h: 945,
    },
  },
  {
    id: "arc-gap",
    chip: "The coverage gap",
    project: ARC,
    lede:
      "It compares what you own against your policy limit. The gap between the two shows " +
      "as a dollar amount.",
    dim:
      "Every item you document adds to a running total, and that total gets checked against " +
      "your policy limit for personal property. Documented value on one side, the limit you " +
      "entered on the other.",
    href: "/case-studies/arc",
    image: {
      src: `${T}/arc/arc-app-vinyl-turntable-shelves-lifestyle.webp`,
      alt: "A.R.C. beside a turntable and shelves",
      w: 1024,
      h: 800,
    },
  },
  {
    id: "arc-weeks",
    chip: "Ten weeks",
    project: ARC,
    lede:
      "Ten weeks from the first idea to a live App Store product. I did the design, the " +
      "engineering and the deployment, with AI helping the whole way through.",
    dim:
      "Solo means I made every decision and shipped every line. When I noticed a problem, a " +
      "fix could be live within hours.",
    href: "/case-studies/arc",
    image: {
      src: `${T}/arc/arc-multi-device-lifestyle-hero.webp`,
      alt: "A.R.C. across a phone, a tablet and a laptop",
      w: 1024,
      h: 1029,
    },
  },
  {
    id: "sally-feed",
    chip: "The feed",
    project: SALLY,
    lede:
      "Three AI models watch 14 industry publications. Competitor social channels, pricing " +
      "shifts and category trends too.",
    dim:
      "Every trend that comes in gets a Sally's Take: an AI-written read that checks the " +
      "signal against the brand positioning, the active briefs, and the internal knowledge " +
      "base, and says whether it's worth acting on. Each Take comes with a one-click path to " +
      "a new brief.",
    href: "/case-studies/sally",
    image: {
      src: `${T}/sally-os/sally-os-briefing-portal-fullscreen.webp`,
      alt: "The intelligence feed",
      w: 1024,
      h: 590,
    },
  },
  {
    id: "sally-jim",
    chip: "Jim, the brand brain",
    project: SALLY,
    lede: "It answers with the context a new hire takes months to pick up.",
    dim:
      "An AI trained on Sally's complete brand architecture: voice guidelines, visual " +
      "standards, competitive positioning, campaign history, performance data, and a rule " +
      "set that shapes how it thinks before it responds. On a schedule it reads four live " +
      "feeds and proposes three to five plays, and approve writes real production requests " +
      "into the same queue the humans use.",
    href: "/case-studies/sally",
    image: {
      src: "/case-studies/sally-os/heroes/sally-os-brand-brain-hero.jpg",
      alt: "Brand Brain, the strategy interface",
      w: 3120,
      h: 1974,
    },
  },
  {
    id: "sally-assets",
    chip: "Asset Hub",
    project: SALLY,
    lede:
      "The DAM they had was bloated and nobody wanted to use it. The two things the team " +
      "actually needed from it, tagging and search, didn't work well, so I built this one " +
      "from the ground up.",
    dim:
      "AI tags every image on upload, with nobody cataloging anything by hand, and search " +
      "ranks across those tags, the titles, the brands, and the AI descriptions. The right " +
      "asset comes up in seconds.",
    href: "/case-studies/sally",
    image: {
      src: `${T}/hp/rhs-sally-os-asset-hub-laptop.webp`,
      alt: "Asset Hub on a laptop",
      w: 1920,
      h: 1254,
    },
  },
  {
    id: "sally-utilities",
    chip: "Utilities",
    project: SALLY,
    lede: "Ten apps, each one for a job.",
    dim:
      "A shelf talker generator, a campaign performance analyzer, an exec deck builder, PDP " +
      "copy, an image compliance scanner, social copy, SKU lookup, an email template " +
      "previewer, promo calendar sync, and a competitor ad tracker.",
    href: "/case-studies/sally",
    image: {
      src: "/case-studies/sally-os/heroes/sally-os-utilities-marketplace-hero.jpg",
      alt: "The utilities marketplace",
      w: 3120,
      h: 1756,
    },
  },
  {
    id: "faux-reel",
    chip: "Faux Reel",
    project: "Open repo",
    lede:
      "A sizzle reel with no footage: still photographs run through fourteen transitions in " +
      "CSS, no video file anywhere.",
    dim: "A 4.8KB web component, built in a day with Claude Code, and out as an open repo.",
    href: "/case-studies/sizzle",
    image: { src: `${T}/sizzle/sizzle.webp`, alt: "Faux Reel", w: 800, h: 800 },
  },
];

/* the studio's work for businesses this size, in the studies' own
   short lines */
export const STUDIO: Row[] = [
  {
    title: "Capitan Boot Co.",
    line: "Branding, design.",
    href: "/case-studies/capitan-boot-co",
    thumb: `${T}/hp/rhs-capitan-boot-co-branding.webp`,
    w: 1536,
    h: 1536,
  },
  {
    title: "J. Christianson",
    line: "Brand development, design.",
    href: "/case-studies/j-christianson",
    thumb: `${T}/hp/rhs-campaign-design-j-christianson-branding.webp`,
    w: 1536,
    h: 1024,
  },
  {
    title: "Hill Country Oakworks",
    line: "Campaign direction, branding.",
    href: "/case-studies/hill-country-oak",
    thumb: `${T}/hp/rhs-hill-country-oakworks-billboard.webp`,
    w: 1536,
    h: 923,
  },
  {
    title: "Amber Shockey & Co.",
    line: "Tableware design, branding.",
    href: "/case-studies/amber-shockey-co",
    thumb: `${T}/hp/rhs-campaign-design-amber-shockey-blue-plate.webp`,
    w: 1536,
    h: 923,
  },
  {
    title: "Hill Country home",
    line: "Interior design, kitchen.",
    href: "/case-studies/hill-country-kitchen",
    thumb: `${T}/hp/rhs-interior-design-kitchen-modern-meets-vintage.webp`,
    w: 1536,
    h: 1024,
  },
];
