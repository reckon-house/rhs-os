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
 * These lists were the brain's answers, captured from think() on 28
 * Aug 2026. Since 10 Sept 2026 they are WRITTEN BY `npm run lines:sync`
 * (scripts/board-lines-sync.mjs) from the board's own answer: the
 * lines a study sits on, which are its projects.ts tags unless
 * scripts/lib/board-order.txt names them by hand under "# homes". Do
 * not edit them here; move the study on lab/board-order.html and run
 * the sync, so the ring, the study bar and the board's heads all
 * count the same studies.
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
    label: "Digital",
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
      "ivyPark",
      "lovedByNordstrom",
      "neimanMarcus",
      "robertRod",
      "sallyBeauty",
      "jeffreyCampaign",
    ],
  },
  {
    label: "Apps",
    query: "app development",
    glyph: "",
    note: "Native tools and AI products, built end to end.",
    ids: ["sallyOS", "arc", "dsc", "sizzle"],
  },
  {
    label: "Campaigns",
    query: "campaign",
    glyph: "",
    note: "Creative direction and execution for international brands.",
    ids: [
      "robertRod",
      "ivyPark",
      "sallyBeauty",
      "jeffreyCampaign",
      "lovedByNordstrom",
      "capitanBoot",
      "nordstromFramework",
      "oakworks",
      "cosmoProf",
      "neimanMarcus",
      "bigBend",
      "nordstromPersonal",
      "nordstromBeauty",
      "amberShockey",
      "variousDesign",
    ],
  },
  {
    /* ── THE SIXTH ROW, AND WHY IT IS NOT CAMPAIGNS ────────────────
       Campaigns held both for a long time: the work made FOR a season
       and the work a company is made OF. They read alike in a list —
       every one of them says "branding" somewhere in its line — and
       they are not the same job. A campaign runs and ends; a mark
       gets stamped into leather and worn for years. Six studies moved
       here off `creative`, so a name appears on one list, not both. */
    label: "Branding",
    query: "branding",
    glyph: "",
    note: "Marks, type and patterns, on packaging, print and apparel.",
    ids: [
      "capitanBoot",
      "oakworks",
      "jChristianson",
      "amberShockey",
      "bwType",
      "variousDesign",
      "arc",
      "jeffreyNyc",
      "robertRod",
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
