/* ── The five doors, and what is behind each one ─────────────────────
 *
 * The rail's category rows: the label a visitor reads, the query the
 * homepage answers, the mark that stands beside it, the one-liner
 * inside the drawer, and the studies the row counts.
 *
 * WHY THE STUDY LIST IS WRITTEN DOWN. On the homepage these rows get
 * their count from think() — the same call the click makes — so the
 * numeral and the shelf can never disagree. The ring in the footer has
 * no brain: shipping the matcher and the 655KB facts index to every
 * case study is the exact byte problem scripts/port-home.mjs exists to
 * avoid. So the ring needs the answer without the machinery.
 *
 * These lists ARE the brain's answers, captured from it rather than
 * guessed — think("digital") and the other three, read off the running
 * homepage on 28 Aug 2026. Two of them fall out of projects.ts tags on
 * their own (digital and interiors match their tag exactly); the other
 * two are subsets of `creative` that only the corpus can separate,
 * which is why all four are written the same way rather than two being
 * derived and two authored.
 *
 * STAPLES IS THE FIFTH AND IT COUNTS NO STUDIES. Its shelf is the
 * inspiration board, so it carries `frames` instead of `ids` — see the
 * note on that field.
 *
 * `npm run rail:check` verifies every id exists in projects.ts, so a
 * renamed or deleted study fails the build instead of quietly
 * shortening a count.
 */

export interface RailCategory {
  /** the visitor's word, and the row's label */
  label: string;
  /** the studies' word — what the homepage actually answers */
  query: string;
  /** the mark beside the label. EMPTY, and that is the setting rather
   *  than a gap waiting to be filled. It held four Swiss solids, then
   *  four Lucide icons, and both told the rows apart without saying
   *  anything about them — a legend for a chart that isn't there,
   *  when four labels of four different lengths already do the work.
   *  The field stays because the utility rows in IndexRail pass
   *  "slash" through it, and because check-rail compares it against
   *  the driver's own FILTERS. */
  glyph: string;
  /** shown beside the count inside the open drawer */
  note: string;
  /** project ids, in the order the brain deals them */
  ids: string[];
  /** Stamp frames for a row whose shelf is not the case studies. Only
   *  Staples has one: the board is not in projects.ts, so there are no
   *  ids to read images off. Written down for the same reason the id
   *  lists are — importing src/data/inspiration.ts here would put a
   *  hundred and four alt strings into the footer of every case study
   *  to show eight pictures. Captured, not chosen: these are the head
   *  of the board in its own order, which is what the click deals
   *  first. Re-capture by reading the first eight of `inspiration`. */
  frames?: string[];
}

/* The board's folder, the same constant src/data/inspiration.ts
   declares. Written again rather than imported: the import is the
   hundred and four alt strings this file exists to keep out of the
   footer. */
const IMG = "/case-studies/inspiration";

export const railCategories: RailCategory[] = [
  {
    label: "Digital Experiences",
    query: "digital",
    glyph: "",
    note: "Sites, stores and platforms, designed and shipped.",
    ids: [
      "cosmoProf",
      "jeffreyNyc",
      "sallyOS",
      "nordstromPersonal",
      "arc",
      "dsc",
      "sizzle",
      "nordstromFramework",
      "nordstromBeauty",
      "sallyBeauty",
    ],
  },
  {
    label: "App Development",
    query: "app development",
    glyph: "",
    note: "Native tools and AI products, built end to end.",
    ids: ["sallyOS", "arc", "dsc", "sizzle"],
  },
  {
    label: "Campaign/Creative",
    query: "campaign",
    glyph: "",
    note: "Art direction and campaigns for retail's big names.",
    ids: [
      "robertRod",
      "ivyPark",
      "oakworks",
      "sallyBeauty",
      "jeffreyCampaign",
      "lovedByNordstrom",
    ],
  },
  {
    label: "Interiors",
    query: "interiors",
    glyph: "",
    note: "Rooms designed like products, down to the hardware.",
    ids: [
      "hillKitchen",
      "hillBath",
      "hillLiving",
      "fairviewSitting",
      "floorDecor",
      "fairviewBedroom",
      "fairviewFoyer",
      "mountainView",
    ],
  },
  {
    /* The board, and the one row here whose shelf is not the work. The
       homepage answers this word with every picture on the board and
       the kept lines beside them; /inspiration still holds the same
       board at full size, and the footer's Pages column still links it
       by name. */
    label: "Staples",
    query: "staples",
    glyph: "",
    note: "Saved pictures and kept lines. None of it mine.",
    ids: [],
    frames: [
      `${IMG}/infographic-italian-tv-ridgeline-chart.jpeg`,
      `${IMG}/bw-waylon-jennings-aviators-cigarette-portrait.jpg`,
      `${IMG}/bw-bespectacled-man-coca-cola-bottle-table.jpg`,
      `${IMG}/Mother-Anthropic-Claude-1-1024x782.jpg`,
      `${IMG}/vintage-turntable-stylus-balance-tool.jpg`,
      `${IMG}/e72ca366b285901ef15c1bfe0a9c5f3b.jpg`,
      `${IMG}/1f09c02d4b42c58ce9826cceed8f3704.jpg`,
      `${IMG}/miles-davis-suede-jacket-fur-bedspread.jpg`,
    ],
  },
];
