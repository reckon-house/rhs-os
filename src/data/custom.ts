/* ── /custom, the page a small business lands on ─────────────────────
 * Every word on the page is here, so a line can be changed without
 * touching the layout. The lede, the doors and the price line are
 * Jeremy's, edited for the page from how he says them (his outreach
 * email and his notes, September 2026); the rows are the studies' own
 * lines, verbatim from projects.ts and board-house.json, because a
 * study already says what it is.
 *
 * The page is sent in an email, so it is a straight read: the studio,
 * who it is for, the three things it does, each dealt the way the
 * board deals a run, then how the work goes and the call. Display prose appears once per
 * run, in its head; a piece is a picture with a 12px line. Every
 * phrase has one home. The rest of the site is one chip away and
 * never the entry point. */

export const CUSTOM = {
  /* the page's own name, in the chip and the cover line: who it is for */
  caption: "For small business",
  /* the studio, for whom, and the three things it does, in one
     sentence each way. "We" is the studio's word on this page (Mode D,
     a local business context); the notes on how the work goes keep
     his own voice, since he is who you will be talking to. */
  lede: "Reckon House is a design and software studio for small businesses.",
  dim:
    "We pick and set up your AI tools, redesign your brand and website, and build the " +
    "software you can't buy. Celina, Texas.",
  ask: {
    placeholder: "Ask:",
    wait: "Reading the studies.",
    none: "Nothing here answers that. hello@reckon.house does.",
    reach: "hello@reckon.house. Or keep asking here.",
  },
  heads: {
    method: "How it works.",
    clients: "Twenty years, large and small.",
    talk: "Let's talk.",
  },
  all: "All the work",
  talk: {
    lede: "Let's talk about what you have in mind and tailor a quote to your exact needs.",
    /* his pricing line, in small-studio words: the one place it lives */
    price:
      "Each project is scoped and priced on its own, and there's usually a version that fits " +
      "the budget.",
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
  /** the service this piece stands behind */
  run: "tools" | "brand" | "software";
  project: string;
  line: string;
  href: string;
  image: { src: string; alt: string; w?: number; h?: number };
}

const DSC = "Dallas Sport Collective";
const ARC = "A.R.C.";
const SALLY = "Sally Marketing OS";

export const PIECES: Piece[] = [
  /* AI and tools: the assistant chosen and wired in */
  {
    id: "dsc-booking",
    run: "tools",
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
    id: "sally-feed",
    run: "tools",
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
    run: "tools",
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
    run: "tools",
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
  /* brand and website: the studies' own subtitles, cut to a line */
  {
    id: "capitan",
    run: "brand",
    project: "Capitan Boot Co.",
    line: "Logo, type, badges and apparel graphics for a Western boot maker.",
    href: "/case-studies/capitan-boot-co",
    image: { src: `${T}/hp/rhs-capitan-boot-co-branding.webp`, alt: "Capitan Boot Co.", w: 1536, h: 1536 },
  },
  {
    id: "j-christianson",
    run: "brand",
    project: "J. Christianson",
    line: "A brand identity built from the name outward.",
    href: "/case-studies/j-christianson",
    image: {
      src: `${T}/hp/rhs-campaign-design-j-christianson-branding.webp`,
      alt: "J. Christianson",
      w: 1536,
      h: 1024,
    },
  },
  {
    id: "dsc-site",
    run: "brand",
    project: DSC,
    line: "A marketing site for a six-trainer gym in North Texas.",
    href: "/case-studies/dsc",
    image: {
      src: `${T}/dsc/dsc-marketing-site-laptop-stool-hero.webp`,
      alt: "The marketing site on a laptop",
      w: 1024,
      h: 683,
    },
  },
  {
    id: "oakworks",
    run: "brand",
    project: "Hill Country Oakworks",
    line: "A campaign from billboards down to phone wallpapers.",
    href: "/case-studies/hill-country-oak",
    image: {
      src: `${T}/hp/rhs-hill-country-oakworks-billboard.webp`,
      alt: "Hill Country Oakworks",
      w: 1536,
      h: 923,
    },
  },
  {
    id: "amber-shockey",
    run: "brand",
    project: "Amber Shockey & Co.",
    line: "Tableware patterns, three collections in, built to layer.",
    href: "/case-studies/amber-shockey-co",
    image: {
      src: `${T}/hp/rhs-campaign-design-amber-shockey-blue-plate.webp`,
      alt: "Amber Shockey & Co.",
      w: 1536,
      h: 923,
    },
  },
  /* custom software: the piece a small business recognises first */
  {
    id: "arc-gap",
    run: "software",
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
    id: "dsc-owner",
    run: "software",
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
    id: "dsc-door",
    run: "software",
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
    id: "arc-inventory",
    run: "software",
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
    id: "sally-assets",
    run: "software",
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
    id: "arc-weeks",
    run: "software",
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
    run: "software",
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
   notes; each lives here and nowhere else on the page.

   THE OFFER IS SUBCOPY UNDER ITS OWN HEAD. The two doors used to stand
   in the first column at read size, a column away from the heads that
   name them, so "Set up." was said twice and the detail arrived before
   the reader knew what it was detail of. A run's body now hangs in the
   second half of its own pair, beside the head and over the hero: the
   claim, then what it actually is, in one place. */
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
  id: "tools" | "brand" | "software" | "work";
  name: string;
  /** the head's one sentence, at display size */
  line: string;
  /** what the service is, as rows under the head at the list's size:
   *  the board's own row, a head in ink and its line in grey */
  rows: { head: string; body: string }[];
  hero: Hero;
}

export const RUNS: Run[] = [
  {
    id: "tools",
    name: "AI and tools.",
    line: "Which assistant, which apps, and how your business should use them.",
    rows: [
      { head: "Which assistant", body: "Claude, ChatGPT or Gemini, picked for the way you work." },
      {
        head: "Which apps",
        body:
          "Connected to the ones you already pay for, with the repetitive part handed to the " +
          "assistant.",
      },
      { head: "Your own account", body: "It runs in yours, and you'll know how to run it." },
    ],
    hero: {
      src: `${T}/dsc/dsc-ai-scheduler-phone-hero.webp`,
      w: 1024,
      h: 632,
      name: "Dallas Sport Collective",
      cat: "Website, custom app",
    },
  },
  {
    id: "brand",
    name: "Brand and website.",
    line: "A rebrand, a redesign, or the site you have made right.",
    /* the two lines the board says for Branding and Digital, verbatim */
    rows: [
      { head: "Brand", body: "Marks, type and patterns, on packaging, print and apparel." },
      { head: "Website", body: "Sites, stores and platforms, designed and shipped." },
    ],
    hero: {
      src: `${T}/j-christianson/j-christianson-storefront-tree-stripe-window-mockup.webp`,
      w: 2048,
      h: 1239,
      name: "J. Christianson",
      cat: "Brand development, design",
    },
  },
  {
    id: "software",
    name: "Custom software.",
    line: "When the tool you need doesn't exist, we build it.",
    rows: [
      {
        head: "Back office",
        body:
          "A scheduler that takes bookings from any AI, a customer list, a calendar that fits " +
          "how you already work.",
      },
      { head: "Apps", body: "On the App Store, designed and built here, start to finish." },
    ],
    hero: {
      src: `${T}/arc/arc-app-tablet-kitchen-living-room-lifestyle.webp`,
      w: 1536,
      h: 955,
      name: "A.R.C.",
      cat: "App & brand development",
    },
  },
];

/* ── FOR THE EXPLORATIONS ────────────────────────────────────────────
   A cover: his hook over a hero, before anything else. A work run: the
   pictures first, six of them, under one head. A spine: the town's
   name set the way /book sets its month. */
export const COVER: { lede: string; dim: string; hero: Hero } = {
  lede: "Your business has grown faster than your systems have.",
  dim: "A design and software studio in Celina, Texas, for the businesses around it.",
  hero: {
    src: `${T}/dsc/dsc-marketing-site-laptop-stool-hero.webp`,
    w: 1024,
    h: 683,
    name: "Dallas Sport Collective",
    cat: "Website, custom app",
  },
};
export const WORK: Run = {
  id: "work",
  name: "Selected work.",
  line: "Six things we made lately.",
  rows: [],
  hero: {
    src: `${T}/hp/rhs-sally-os-asset-hub-laptop.webp`,
    w: 1920,
    h: 1254,
    name: "Sally Marketing OS",
    cat: "Product design, engineering",
  },
};
export const WORK_PICKS = ["dsc-booking", "arc-gap", "capitan", "dsc-owner", "j-christianson", "arc-inventory"];
export const SPINE = "CELINA";

/* the rail's doors, each the column it turns the row to */
export const DOORS: { label: string; col: string }[] = [
  { label: "AI and tools", col: "tools" },
  { label: "Brand and website", col: "brand" },
  { label: "Custom software", col: "software" },
  { label: "How it works", col: "method" },
  { label: "Twenty years", col: "clients" },
  { label: "Let's talk", col: "talk" },
];
