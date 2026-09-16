/* ── /custom, the page a small business lands on ─────────────────────
 * Every word on the page is here, so a line can be changed without
 * touching the layout. The lede, the doors and the price line are
 * Jeremy's, edited for the page from how he says them (his outreach
 * email and his notes, September 2026); the rows are the studies' own
 * lines, verbatim from projects.ts and board-house.json, because a
 * study already says what it is.
 *
 * The page is sent in an email, so it is a straight read: who this is,
 * the two things on offer, what it costs to find out, then the proof,
 * dealt the way the board deals a run. Display prose appears once per
 * run, in its head; a piece is a picture with a 12px line. Every
 * phrase has one home. The rest of the site is one chip away and
 * never the entry point. */

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
  dim: "Brand and web design on the front end, custom tools on the back end.",
  /* the two doors, at read size: the offer in full, once. The runs'
     heads carry one sentence each and neither repeats these. */
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
        "A scheduler, a customer list, an app, the site out front. One person designs it and " +
        "builds it, so it fits how you already work.",
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

/* ── THE RECENT WORK, AS TILES ───────────────────────────────────────
   A study is several things a small business would buy one at a time,
   and each is a tile the way every picture on the board is a tile: the
   picture at the column's width, and under it one line at 12px, the
   study's name in ink and the study's own sentence about the piece in
   grey. The sentence is the section's title and its held line from the
   study itself, so a tile says what the study says and stops; the
   picture is the door to the rest. The board's thumbs where the board
   has one, the study's plate where it does not. Dealt down two columns
   a run, with the piece a small business recognises first. */
export interface Piece {
  id: string;
  /** the door this piece stands behind */
  run: "setup" | "build";
  project: string;
  line: string;
  href: string;
  image: { src: string; alt: string; w?: number; h?: number };
}

const DSC = "Dallas Sport Collective";
const ARC = "A.R.C.";
const SALLY = "Sally Marketing OS";

export const PIECES: Piece[] = [
  {
    id: "dsc-booking",
    run: "setup",
    project: DSC,
    line: "Book a session from your own AI.",
    href: "/case-studies/dsc",
    image: {
      src: "/case-studies/dsc/dsc-claude-mcp-chat-booking-request.jpg",
      alt: "Claude confirming a booking request, pending the trainer's approval",
      w: 1096,
      h: 1400,
    },
  },
  {
    id: "sally-assets",
    run: "setup",
    project: SALLY,
    line: "The DAM they had was bloated and nobody wanted to use it.",
    href: "/case-studies/sally",
    image: {
      src: `${T}/hp/rhs-sally-os-asset-hub-laptop.webp`,
      alt: "Asset Hub on a laptop",
      w: 1920,
      h: 1254,
    },
  },
  {
    id: "sally-feed",
    run: "setup",
    project: SALLY,
    line: "Three AI models watch 14 industry publications.",
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
    run: "setup",
    project: SALLY,
    line: "It answers with the context a new hire takes months to pick up.",
    href: "/case-studies/sally",
    image: {
      src: "/case-studies/sally-os/heroes/sally-os-brand-brain-hero.jpg",
      alt: "Brand Brain, the strategy interface",
      w: 3120,
      h: 1974,
    },
  },
  {
    id: "sally-utilities",
    run: "setup",
    project: SALLY,
    line: "Ten apps, each one for a job that used to take hours.",
    href: "/case-studies/sally",
    image: {
      src: "/case-studies/sally-os/heroes/sally-os-utilities-marketplace-hero.jpg",
      alt: "The utilities marketplace",
      w: 3120,
      h: 1756,
    },
  },
  {
    id: "arc-gap",
    run: "build",
    project: ARC,
    line: "It compares what you own against your policy limit.",
    href: "/case-studies/arc",
    image: {
      src: `${T}/arc/arc-app-vinyl-turntable-shelves-lifestyle.webp`,
      alt: "A.R.C. beside a turntable and shelves",
      w: 1024,
      h: 800,
    },
  },
  {
    id: "dsc-door",
    run: "build",
    project: DSC,
    line: "None of the scheduling works until everyone is in the system.",
    href: "/case-studies/dsc",
    image: {
      src: "/case-studies/dsc/dsc-athlete-app-registration-form.jpg",
      alt: "The athlete's registration form",
      w: 775,
      h: 1200,
    },
  },
  {
    id: "dsc-owner",
    run: "build",
    project: DSC,
    line: "The owner side is built for one person on the gym floor.",
    href: "/case-studies/dsc",
    image: {
      src: `${T}/dsc/dsc-owner-calendar-phone-hero.webp`,
      alt: "The owner's calendar on a phone",
      w: 1536,
      h: 948,
    },
  },
  {
    id: "arc-inventory",
    run: "build",
    project: ARC,
    line: "One photo of a room comes back as a list of what is in it.",
    href: "/case-studies/arc",
    image: {
      src: `${T}/arc/arc-app-kitchen-project-selection-lifestyle.webp`,
      alt: "A.R.C. on a phone, in a kitchen",
      w: 1536,
      h: 945,
    },
  },
  {
    id: "arc-weeks",
    run: "build",
    project: ARC,
    line: "Ten weeks from the first idea to a live App Store product.",
    href: "/case-studies/arc",
    image: {
      src: `${T}/arc/arc-multi-device-lifestyle-hero.webp`,
      alt: "A.R.C. across a phone, a tablet and a laptop",
      w: 1024,
      h: 1029,
    },
  },
  {
    id: "faux-reel",
    run: "build",
    project: "Faux Reel",
    line: "A sizzle reel with no footage.",
    href: "/case-studies/sizzle",
    image: { src: `${T}/sizzle/sizzle.webp`, alt: "Faux Reel", w: 800, h: 800 },
  },
];

/* ── THE RUNS ─────────────────────────────────────────────────────────
   A door opens as the board opens a run: a head, the run's name in ink
   and its ONE sentence in grey, the only display prose the run carries,
   with a landscape hero across the pair under it, and a chip that
   counts the tiles and turns the row to them. The sentences are his:
   the Set up line from his outreach email, the Build line from his
   notes; each lives here and nowhere else on the page. */
export interface Hero {
  src: string;
  w: number;
  h: number;
  /** the caption: the study's name, then its line in grey, as a cover
   *  is captioned on the board */
  name: string;
  cat: string;
}
export interface Run {
  id: "setup" | "build";
  name: string;
  line: string;
  hero: Hero;
}

export const RUNS: Run[] = [
  {
    id: "setup",
    name: "Set up.",
    line: "Your business has grown faster than your systems have.",
    hero: {
      src: `${T}/dsc/dsc-ai-scheduler-phone-hero.webp`,
      w: 1024,
      h: 632,
      name: "Dallas Sport Collective",
      cat: "Website, custom app",
    },
  },
  {
    id: "build",
    name: "Build.",
    line: "When the tool you need doesn't exist, I make it.",
    hero: {
      src: `${T}/arc/arc-app-tablet-kitchen-living-room-lifestyle.webp`,
      w: 1536,
      h: 955,
      name: "A.R.C.",
      cat: "App & brand development",
    },
  },
];

/* the rail's doors, each the column it turns the row to */
export const DOORS: { label: string; col: string }[] = [
  { label: "Set up", col: "setup" },
  { label: "Build", col: "build" },
  { label: "Twenty years", col: "studio" },
  { label: "How I work", col: "method" },
  { label: "Let's talk", col: "talk" },
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
