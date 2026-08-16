import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/arc";

/* The cover reel's blink colours, taken from the study's own palette
   below rather than picked to taste: Primary, Warm Register, Ground.
   A reel that flashes colours the brand does not use is decoration
   pretending to be a system. */
const REEL_COLORS = ["#B1BC94", "#C4A265", "#000000"];

/* ── Pressing structure ─────────────────────────────────────────────
   A.R.C. ported to the Pressing C language (style: "pressing" routes it
   to PressingLayout). The classic original is byte-preserved at
   src/data/.arc-classic-backup.ts and in git history. Structure notes:
   - The cover pins; the kitchen-counter lifestyle hero is the 02 object
     plate (zoom). The vinyl/turntable coverage lifestyle is the second
     and last zoom (plate 08, inheriting its governing mark's n, same
     convention as RR's logo plate).
   - Five climbs, each crossing a held screen. The multi-device hero
     climbs the plate-02 zoom; the other four plates climb the briefs
     that introduce them (problem, classification, build, usage). A brief
     reserving ClimbRoom is the fourth thing that holds under
     CHOREO-RULES rule 2, and on this page it does most of the work: the
     cover and the two zooms are the only other holds, and A.R.C. is
     chart-heavy, so a plate left sitting next to a chart has nothing to
     cross. Two plates were moved one slot up the array to sit against
     their brief rather than against a chart. See each one at its site.
   - NO PLATE HERE ZOOMS ON SIZE ALONE. Of the four plates fixed in the
     choreography pass, none clears the ~3000px native floor (2600 down
     to 1612), so all four rise. A soft zoom is worse than none.
   - BLOCK COMMENTS IN THIS ARRAY CARRY NO APOSTROPHES. choreo-audit
     reads the file as text and treats a lone quote as a string
     delimiter, so "the reel's stage" inside a block comment swallowed
     every brace after it. The array failed to close, the audit parsed
     ZERO sections, and it reported a false clean while the file carried
     four bare plates and three unpinned briefs. Line comments are
     skipped outright and are safe. Every other pressing study already
     writes its block comments this way.
   - The old triple-image is now one flow plate + one dual pair (all
     three images survive; triple-image has no pressing skin).
   - Viz sections (pipeline, system-architecture, stats-bar,
     coverage-chart, speed-comparison, feature-cards, brand-system,
     text-right, dev-timeline) are UNTOUCHED in content and carry a
     pressing.mark for the PressingVizFrame bridge being built in
     parallel. They repeat their governing brief's mark n/name on
     purpose — the disc keeps showing the section they belong to, the
     same way zoom plates inherit the governing numeral. Until the
     bridge lands, PressingLayout warns "no skin" for each in dev and
     renders nothing for them in production.
   - speed-comparison moved from the product-interface cluster to the
     usage cluster: the usage brief states the 8-12 hours vs ~30 minutes
     numbers and the chart is their one visual home.
   - The abstract and summary stay authored but unrendered (pressing has
     no abstract slot); the classic renderer would still show them.

   ── Editorial cuts (allocation pass — nothing new was written) ──────
   1. Cover title re-broken to four reveal lines:
      "A.R.C.\nArchive.\nReady.\nCloud." (line breaks only).
   2. Quote poster (was problem-editorial): periods dropped per the
      editorial-headline rule, re-broken to three lines. Words unchanged.
   3. build-footnote: cut "Claude Code as the primary development
      environment." (dup of the AI-Assisted Development column's "Claude
      Code was my primary environment throughout") and "No engineering
      team behind any of it." (dup of the Building Solo column's "There
      was no engineering team").
   4. financial-footnote: cut "Gap shown as a specific dollar amount
      before a disaster reveals it." ("before a disaster reveals it" ran
      three times: here, the text-right payoff, and pipeline step 02.
      The text-right keeps it; pipeline is viz and stays untouched.)
   5. closing-footnote: cut "V1 is live and in market." (the closing
      header already says "Currently in market / V1 live").
   6. closing para 1: cut "A.R.C. is live and in market - not a
      prototype, not a demo." (header owns the fact; the phrase is also
      the study's already-spent used-once construction). Reallocated
      "because I needed it and couldn't find it": closing-origin keeps
      "I built A.R.C. because I needed it", the closing keeps "because I
      couldn't find it". Cut "a real roadmap," (closing-footnote owns
      the V2 roadmap).
   7. closing para 2 cut entirely — it restated the cover statement
      (camera looks at what you own, tells you about coverage) and the
      quote poster (the tedious entry that stopped everyone).
   8. closing para 3: cut "built in ten weeks" (the build brief owns
      "Ten weeks from concept to a live App Store product").
   9. Section titles split into title + heldLine per the pressing brief
      composition; words unchanged except sentence-casing and one added
      comma ("Solo engineering,"). */

export const arcCaseStudy: CaseStudy = {
  slug: "arc",
  title: "A.R.C. Archive. Ready. Cloud.",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "A.R.C., an iPhone app I designed and built for home inventory. | It looks at what you own and tells you whether your insurance actually covers it.",
  // "AI Home Inventory", matching the homepage grid's own name for it.
  // The facts miner reads this line, and without the word the index
  // could not put the portfolio's one shipped AI product under "AI" —
  // the query that most deserves it.
  field: "AI Home Inventory\nComputer Vision\nInsurance Technology",
  author: "Jeremy Prasatik",
  published: "2024",
  status: "V1 Live  In market",
  classification: [
    "Product Design",
    "Brand Identity",
    "Full-Stack Engineering",
    "Go-to-Market",
  ],
  services: [
    "Product Design",
    "Brand Identity",
    "Full-Stack Engineering",
    "Go-to-Market Strategy",
  ],
  stack: ["Python", "Streamlit", "OpenAI Vision API", "Supabase", "Vercel", "Claude Code"],
  links: [
    { label: "arcready.app", url: "https://arcready.app" },
    { label: "heythere@arcready.app", url: "mailto:heythere@arcready.app" },
  ],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── COVER — pinned handover: headline unbuilds, statement rises ──
    {
      id: "meta",
      type: "meta",
      // Each word its own reveal line — the reveal masks per line.
      title: "A.R.C.\nArchive.\nReady.\nCloud.",
      subtitle:
        "A.R.C., an iPhone app I designed and built for home inventory. | It looks at what you own and tells you whether your insurance actually covers it.",
      field: "AI Home Inventory Computer Vision Insurance Technology",
      author: "Jeremy Prasatik",
      published: "2024",
      status: "V1 Live  In market",
      classification: [
        "Product Design",
        "Brand Identity",
        "Full-Stack Engineering",
        "Go-to-Market",
      ],
      specLine: "AI Home Inventory · Computer Vision · Insurance Technology",
      /* The cover reel. Eight frames cut fast enough to read as motion,
         which is the standard opening for a pressing study: the work
         moves before a word of it is read.
         Sequenced as the product is used rather than as the files sit
         on disk — a room, the scan that reads it, what the scan
         produced, the same thing on other surfaces, then the mark. */
      reel: {
        caption: "Preview · 8 frames · 2024",
        colors: REEL_COLORS,
        /* EVERY FRAME IS OPAQUE. Two of these were PNG screen renders
           with alpha — a phone with transparent corners, the mark on a
           transparent grid — and the dark stage under the reel showed
           straight through them, which reads as the picture failing to
           fill its box. object-fit cannot help: there is nothing to
           cover with. Photography and flattened mockups only. */
        images: [
          `${IMG}/arc-app-kitchen-project-selection-lifestyle.jpg`,
          `${IMG}/arc-room-scanning-interface.jpg`,
          `${IMG}/arc-app-living-room-furniture-selection.jpg`,
          `${IMG}/arc-report-thumb.jpg`,
          `${IMG}/arc-app-vinyl-turntable-shelves-lifestyle.jpg`,
          `${IMG}/arc-app-tablet-kitchen-living-room-lifestyle.jpg`,
          `${IMG}/arc-app-smartphone-wooden-table-mockup.jpg`,
          `${IMG}/arc-multi-device-lifestyle-hero.jpg`,
        ],
      },
      // Summary and abstract stay authored but unrendered in pressing.
      summary: [
        { label: "Built", value: "Camera-scan home inventory app. Vision recognition, value estimation, insurance gap analysis." },
        { label: "Scope", value: "Solo, end to end. Concept, code, brand, go-to-market." },
        { label: "Stack", value: "Python, Streamlit, OpenAI Vision, Perceptron Mk1, Supabase, Vercel, Claude Code." },
        { label: "Angle", value: "People skip home inventory because the work is miserable. Take the typing out and the rest is straightforward." },
      ],
      abstract:
        "Home inventory is an old problem, and none of the tools for it have solved it well. The average American household holds around 300,000 items, with a combined insurable value most homeowners have never added up, and the existing apps have not changed that. They are spreadsheets with better packaging, asking people to do the same manual work they were already avoiding. About 60% of homeowners are underinsured because they have never cataloged what they own.\n\nA.R.C. works from the camera. You point it at a room, photo or video, and it identifies what is there, estimates replacement value, and categorizes everything in the same pass. Video scanning runs on Perceptron's Mk1 model: sweep a room and the model reasons across the footage in real time. Then A.R.C. compares what you have documented against your policy limit and shows the gap as a dollar amount.\n\nI built A.R.C. end to end: concept, code, brand, go-to-market. Python backend, Streamlit frontend, OpenAI Vision API and Perceptron Mk1 for recognition, deployed on Vercel with Supabase for the data. Concept to live product in ten weeks.",
      pressing: { mark: { n: "02", name: "Statement" } },
    },

    // ── IMAGE AS OBJECT — the kitchen-counter hero, pinned zoom, plate 02 ──
    {
      id: "hero-1",
      type: "hero",
      image: `${IMG}/arc-app-kitchen-project-selection-lifestyle.jpg`,
      alt: "A.R.C. app on wooden surface with kitchen interior",
      pressing: {
        choreo: { zoom: true },
        plate: "02",
        captions: [
          "A.R.C. app",
          "Wooden surface, kitchen interior",
          "Project selection screen",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
      },
    },

    /* ── MULTI-DEVICE PLATE — the first climb, over the plate-02 zoom ──
       This sat under the problem columns and climbed the scanning/detail
       pair that used to be there. Those images belong to the columns now,
       so the pair that held went with them and the plate was left pulling
       itself up 96dvh across a moving text column. The zoom is the hold
       instead, and it sits one cluster up. The two images run in the
       order the reel already uses — the app on a counter, then the same
       app across every surface — so the climb lands inside the sequence
       of the study rather than beside it.
       This is the only climb here that crosses a zoom; the four below
       cross briefs, which reserve ClimbRoom for exactly this.
       Adjacent, per the contract; hero-1 derives its climb room from the
       rise flag on this section, which is why none is authored there. */
    {
      id: "problem-hero-group",
      type: "hero",
      image: `${IMG}/arc-multi-device-lifestyle-hero.jpg`,
      alt: "A.R.C. app lifestyle scenes — mobile interfaces in context",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── PROBLEM — pinned brief, columns nested in the column ──
    {
      id: "problem-header",
      type: "section-header",
      label: "SECTION 02: PROBLEM STATEMENT",
      title: "Most homeowners have never",
      group: { name: "problem" },
      pressing: {
        mark: { n: "03", name: "Nothing written down" },
        heldLine: "written down what they own.",
        choreo: { pin: true },
      },
    },
    {
      id: "problem-text",
      type: "text",
      size: "xl",
      content:
        "That is why about 60% of American homeowners are underinsured. The apps that exist have not fixed it, because every one of them still asks you to type in each item by hand.",
      group: { name: "problem" },
    },
    {
      id: "problem-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The 60% comes from industry estimates of how many homeowners have documented what they own, and how far short their coverage runs.",
      group: { name: "problem" },
    },
    {
      id: "problem-columns",
      type: "three-column-text",
      group: { name: "problem" },
      pressing: { mark: { n: "04", name: "The vision layer" } },
      columns: [
        {
          title: "The Insurance Reality",
          image: {
            src: `${IMG}/arc-app-smartphone-wooden-table-mockup.jpg`,
            alt: "A.R.C. item entry on a phone, resting on a wooden table",
            width: 772,
            height: 772,
          },
          content:
            "Carriers know exactly what they will pay out on a policy. Homeowners rarely know what they would need to claim, and the gap only gets wider, because things keep coming into the house with no paperwork behind them.\n\nA standard homeowner's policy covers personal property at 50-70% of the dwelling amount, so a home insured at $400,000 carries somewhere around $200,000-$280,000 for the things inside it. Whether that is enough depends on whether the homeowner knows what they own and what it would cost to replace. Most don't.\n\nThe paperwork is what stops people. You open a spreadsheet, walk room to room, describe each item, look up what it would cost to replace, photograph it, and attach the receipt. Done properly for an average home, that takes 40+ hours. Hardly anyone finishes.",
        },
        {
          title: "Existing Solutions",
          image: {
            src: `${IMG}/arc-room-scanning-interface.jpg`,
            alt: "A.R.C. scanning a living room, items found and valued",
            width: 768,
            height: 772,
          },
          content:
            "I downloaded every home inventory app I could find before I built this one. They all end up in the same place. Some are spreadsheets with a nicer front on them: you still type in every item, attach every photo, and look up every replacement value yourself. The app adds a database and maybe cloud sync, and the work is the same as the spreadsheet it replaced.\n\nThe rest are insurance carrier tools. They exist to make claims easier for adjusters, and the interfaces feel like it, dense and functional, made for someone who already knows what they are looking at.\n\nSo the job is the same in all of them. You identify each item and put a value on it, one at a time, and a better interface does not change that.",
        },
        {
          title: "The Vision Layer",
          image: {
            src: `${IMG}/arc-app-living-room-furniture-selection.jpg`,
            alt: "A.R.C. item detail, category and replacement value",
            width: 768,
            height: 772,
          },
          content:
            "The fix is to change what the person has to do. You show the camera the room. It picks out what is there, estimates values, and sorts everything into categories, and your job turns into reviewing what it found.\n\nVideo takes this further. Perceptron's Mk1 model reads the physical world from footage. It reasons across frames, tracks objects through space, and picks up the spatial context a single photo misses. Sweep a room with your phone and Mk1 reads the whole thing. It is fast, and the recognition is good.\n\nSo a whole house becomes a room-by-room scan that takes minutes.",
        },
      ],
    },


    /* The smartphone plate and the app-screen pair used to sit here,
       full width, stretching 768px exports to 1400. Those three images
       belong to the three method columns now: at column measure they
       are the size their files can carry, and the section reads as one
       argument with its evidence beside it instead of an argument
       followed by three pictures. The multi-device plate that climbed
       that pair moved up to the zoom for the same reason: its hold left
       with them. */

    // ── BLEED PLATE — the image beat of the cluster, before the quote ──
    {
      id: "problem-mobile-screens",
      type: "image",
      src: `${IMG}/arc-three-screen-lifestyle-mockup.png`,
      alt: "A.R.C. mobile app screens overview",
      bleed: true,
      /* Climbs the problem brief, which reserves the room for it. At
         2600px native it is under the ~3000 zoom floor, so it rises;
         the full mat belongs to the quote poster directly below, and
         two staged screens back to back would blunt both. */
      pressing: { choreo: { rise: true } },
    },

    // ── QUOTE POSTER — the ground rises and knocks the type out ──
    {
      id: "problem-editorial",
      type: "editorial-headline",
      text: "The work is miserable\nTake the typing out\nand the rest is straightforward",
      pressing: {
        choreo: { quotePoster: true },
        indent: 1,
        mark: { n: "05", name: "The input problem", dark: true },
      },
    },

    // ── METHODOLOGY — unpinned brief ──
    {
      id: "methodology-header",
      type: "section-header",
      label: "SECTION 03: METHODOLOGY / HOW IT WORKS",
      title: "System architecture &",
      pressing: {
        mark: { n: "06", name: "How it works" },
        heldLine: "recognition engine.",
        /* Pinned, not crossing. The crossing renders the headline and
           its intro on a screen of their own, which split this section
           in two: the argument up in the crossing, the six stages in a
           column underneath it, reading as separate sections. Pinned,
           the headline holds while ONE column travels past it carrying
           the intro and then the stages — the pattern the rest of the
           study already uses, and the reason the stages belong to this
           headline is now visible rather than implied. */
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "methodology-text",
      type: "text",
      size: "xl",
      content:
        "It starts with one photo or one video of a room, and what comes back is a list of every item in it, each one named, valued, and sorted into a category.",
    },
    {
      id: "methodology-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The image passes through vision processing, object identification, value estimation, and archival, and each stage feeds the next. Every decision point runs against a confidence threshold. Processing times were measured under typical indoor lighting.",
    },
    /* The six stages, in the copy column rather than in cream cards.
       Each column carries its own image at column measure and takes two
       consecutive stages: the schematic below draws where they sit, the
       columns say what each one does. The second stage in a column leads
       with its name, which is the convention the brief already uses for
       a heading inside a block. */
    {
      id: "pipeline",
      type: "three-column-text",
      /* No mark. The header above already carries 06 / How it works, and
         nesting the columns under the same headline put it on screen
         twice — the header owns its punchline. */
      columns: [
        {
          title: "Image Capture",
          image: {
            src: `${IMG}/arc-pipeline-photo-capture-step.jpg`,
            alt: "A.R.C. capturing a room from a phone camera",
            width: 388,
            height: 388,
          },
          content:
            "You photograph a room or a single item with the phone camera. No special hardware, no calibration.\n\nArchive Entry. The item goes into your inventory: linked to a room, tagged with metadata, tied to the photograph it came from, and counted in the totals right away.",
        },
        {
          title: "Vision Processing",
          image: {
            src: `${IMG}/arc-pipeline-ai-categorization-step.jpg`,
            alt: "A.R.C. reading a photograph and naming what it finds",
            width: 388,
            height: 388,
          },
          content:
            "The OpenAI Vision API takes the image and returns a structured read: what the object is, what it is made of, its style, its condition, and a rough era or manufacture period.\n\nFinancial Analysis. The documented total updates as you go, and it gets compared against the policy limit you entered. When what you own gets close to that limit, or passes it, the shortfall shows up as a dollar amount.",
        },
        {
          title: "Value Estimation",
          image: {
            src: `${IMG}/arc-pipeline-cloud-sync-step.jpg`,
            alt: "A.R.C. pricing a documented room and totalling it",
            width: 388,
            height: 388,
          },
          content:
            "Each identified object is matched against market replacement data. What it estimates is what the item would cost to replace today, which is the number insurance runs on. Depreciated value and the original purchase price do not come into it.\n\nCategory Assignment. Every item goes into one of thirteen categories: furniture, electronics, artwork, appliances, fixtures, textiles, collectibles, vehicles, tools, sporting goods, musical instruments, jewelry, documents.",
        },
      ],
    },
    {
      id: "system-architecture",
      type: "system-architecture",
      pressing: { mark: { n: "06", name: "How it works" } },
    },

    // ── CLASSIFICATION — pinned brief, the interface plate climbs it ──
    {
      id: "classification-header",
      type: "section-header",
      label: "SECTION 03: METHODOLOGY / HOW IT WORKS",
      title: "Classification",
      pressing: {
        mark: { n: "07", name: "Classification system" },
        heldLine: "system.",
        /* Pinned: the headline holds while the taxonomy argument travels
           up beside it. The pin is also what reserves ClimbRoom for the
           plate now directly below. */
        choreo: { pin: true },
      },
    },
    {
      id: "classification-note",
      type: "text",
      size: "xl",
      content:
        "The categories are set up the way insurance claims are, so each one maps to a standard personal property claim classification.",
    },
    {
      id: "classification-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The sub-categories are there so the valuation has enough detail to be accurate, and none of it asks you to know any insurance terminology. The scheme lines up with the classifications the major U.S. carriers use.",
    },
    /* Flow plate — tall dashboard screenshot (1612x3620); see risks.
       Moved ABOVE the ridgeline chart it used to sit under. A chart
       holds nothing, so down there the plate was bare with no way to
       fix it in place: 1612px wide is nowhere near the ~3000 zoom
       floor, and maxWidth 700 (classic-only, pressing ignores it)
       records that someone already measured this file and found it
       small. Against the brief it climbs.
       The order that produces is the better read anyway. The taxonomy
       is stated, the interface carrying it rises over the statement,
       then the ridgeline counts what the taxonomy sorted. */
    {
      id: "classification-hero",
      type: "image",
      src: `${IMG}/arc-dashboard-screen-hero.png`,
      alt: "A.R.C. classification system interface",
      aspect: "native",
      maxWidth: 700,
      pressing: {
        caption: "Classification system interface",
        /* 766 was louder than the argument it illustrates; 383, an exact
           half, undershot and turned the plate into a thumbnail. This
           sits between them and is still well inside the file's honest
           ceiling of 806, so the only question here is composition, not
           resolution. One number, easy to move again. */
        plateWidth: 560,
        choreo: { rise: true },
      },
    },
    // Viz — awaits the PressingVizFrame bridge; content untouched.
    {
      id: "stats",
      type: "stats-bar",
      pressing: {
        mark: { n: "07", name: "Classification system" },
        caption:
          "The average value of one item in each category. Bars are sized " +
          "against appliances, the highest. Vehicles has no bar because " +
          "$5,000+ is a floor, and there is no average to draw.",
      },
      totals: [
        { value: "73", label: "ITEMS DOCUMENTED", sub: "Average per home" },
        { value: "$49,630", label: "TOTAL VALUE", sub: "Tracked assets" },
        { value: "$680", label: "AVG ITEM VALUE", sub: "Across categories" },
        { value: "13", label: "CATEGORIES", sub: "Classification depth" },
      ],
      items: [
        {
          label: "Furniture",
          value: "$680",
          description: "Most common rooms: Living Room, Bedroom, Dining Room",
        },
        {
          label: "Electronics",
          value: "$425",
          description: "Most common rooms: Office, Living Room, Kitchen",
        },
        {
          label: "Artwork",
          value: "$580",
          description: "Most common rooms: Living Room, Hallway, Bedroom",
        },
        {
          label: "Appliances",
          value: "$890",
          description: "Most common rooms: Kitchen, Laundry, Garage",
        },
        {
          label: "Fixtures",
          value: "$310",
          description: "Most common rooms: Kitchen, Bathroom, Dining Room",
        },
        {
          label: "Textiles",
          value: "$185",
          description: "Most common rooms: Bedroom, Living Room, Bathroom",
        },
        {
          label: "Collectibles",
          value: "$695",
          description: "Most common rooms: Office, Display areas",
        },
        {
          label: "Vehicles",
          value: "$5,000+",
          description: "Location: Garage, Driveway, Storage",
        },
      ],
    },

    // ── FINANCIAL INTELLIGENCE — pinned brief ──
    {
      id: "financial-header",
      type: "section-header",
      label: "SECTION 05: FINANCIAL INTELLIGENCE",
      title: "Insurance",
      pressing: {
        mark: { n: "08", name: "Financial intelligence" },
        heldLine: "gap analysis.",
        /* Pinned: the headline holds while the argument and the chart
           that proves it travel past together. */
        choreo: { pin: true },
      },
    },
    {
      id: "financial-note",
      type: "text",
      size: "xl",
      content: "This is the part that makes A.R.C. more than inventory software.",
    },
    {
      id: "financial-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The value of what you have documented, compared against the policy limit you entered.",
    },
    // Viz — awaits the PressingVizFrame bridge; content untouched.
    {
      id: "financial-text",
      type: "text-right",
      pressing: { mark: { n: "08", name: "Financial intelligence" } },
      content:
        "Every item you document adds to a running total, and that total gets checked against your policy limit for personal property. The arithmetic is simple, and most people turn out to be further off than they would guess.\n\nYou set the coverage amount when you buy the policy and it tends to sit there. Meanwhile the stuff inside the house keeps changing: new furniture, an upgraded appliance, gifts, a few pieces inherited from your parents. A home that was covered five years ago might be $50,000 short today, and there is no way of knowing until something goes wrong.\n\nA.R.C. puts a number on the gap: a dollar amount, tied to specific items in specific rooms, before a disaster reveals it.",
    },
    {
      id: "financial-coverage-chart",
      type: "coverage-chart",
      pressing: { mark: { n: "08", name: "Financial intelligence" } },
      assetValue: "Documented Asset Value",
      assetAmount: 49630,
      policyLimit: "Policy Coverage Limit",
      policyAmount: 38000,
    },

    /* The product itself, shipped and running, framed in the study. The
       homepage it loads carries the public A.R.C. AI demo, so a reader
       can photograph their own room and watch the real model name what
       is in it — the exact mechanic every section above describes. No
       port, no fixture, nothing to keep in sync: it is the deployment. */
    {
      id: "live-app",
      type: "live-app",
      /* THE MARKETING SITE IS WHAT arcready.app/ SERVES, and no URL gets
         past it. /dashboard is a real route in the client, but reaching
         it needs a session that only POST /api/auth/demo-login creates,
         which a src attribute cannot do. A reader dropped into the
         frame met a landing page and had to find "Try the demo" inside
         it.

         This is the same shipped client, bundled with a snapshot of the
         Sample Home and a patched fetch, so it opens straight into the
         furnished project: 8 rooms, 73 items, $49,630, every photo
         local. It also fixes a browser problem the live app could not.
         arcready.app's session cookie is Secure; SameSite=None, so in a
         cross-origin frame Safari blocks it outright and Firefox
         partitions it, and "Try the demo" could fail to stay signed in
         for a good share of readers. This build sets no cookies at all,
         so there is nothing for either to restrict.

         Nothing here reaches the production server: no AI credit spent
         per visit, no uptime risk, and writes resolve to { ok: true }
         so there is nothing to corrupt. The AI scan panel replays a
         recorded run of the real endpoint and says so on its face. */
      src: "https://arc-demo-two.vercel.app",
      title: "A.R.C., live",
      /* PORTRAIT, because the frame is. The kitchen-counter lifestyle
         shot that used to sit here is 3840x2363 landscape, and
         object-fit: cover crushed it into a 345x772 slot — a nine
         percent vertical strip of a room, under the veil, reading as a
         grey rectangle. This is the app's own whole-home dashboard at
         800x1738, captured from the shipped build, showing the same
         $49,630 and 73 items the sections above count. */
      poster: `${IMG}/demo/stills/arc-dashboard-800.jpg`,
      posterAlt:
        "A.R.C.'s whole-home dashboard: $49,630 documented across 8 rooms and 73 items",
      instruction: "Open a room, tap an item, then try the AI scan.",
      /* A.R.C. is a phone app, so it is shown as one. The stage is
         height-driven and the device derives its width from that, so
         `tall` is really a width control: 78dvh gave a 323px handset,
         narrower than any phone the app is used on and tight enough to
         cramp its own mobile layout. 88 puts it at ~364px, inside the
         range real devices actually occupy. */
      tall: 88,
      frame: "phone",
      pressing: { mark: { n: "08", name: "Financial intelligence" } },
    },

    // ── IMAGE AS OBJECT — the coverage lifestyle, second zoom, plate 08 ──
    {
      id: "financial-image",
      type: "hero",
      image: `${IMG}/arc-app-vinyl-turntable-shelves-lifestyle.jpg`,
      alt: "A.R.C. app with vinyl, turntable, and shelves — coverage analysis in context",
      inline: true,
      pressing: {
        choreo: { zoom: true },
        plate: "08",
        captions: [
          "Documented asset value",
          "Compared against policy limits",
          "Vinyl, turntable, shelves",
        ],
      },
    },

    // ── BRAND SYSTEM — viz, awaits the bridge; content untouched ──
    {
      id: "brand-system",
      type: "brand-system",
      label: "SECTION 06: BRAND SYSTEM",
      title: "Visual identity &\ndesign language",
      pressing: { mark: { n: "09", name: "Brand system" } },
      introText:
        "Home inventory sounds like a chore, and insurance analysis sounds like a meeting with your agent. The brand had to make documenting your house feel like something you might want to do.",
      subcopy:
        "The interface should be something you want to look at.",
      philosophyText:
        "So the answer was to give utility software a warm, magazine feel. Asset cards look like entries in a collection, room views read like a gallery of your own things, and the financial summaries carry real weight and still don't look like a spreadsheet.",
      chromaticCircleImage: `${IMG}/chromatic-brand-circle.png`,
      /* THE FIRST THREE ARE DECLARED, THE LAST THREE ARE MEASURED, and
         the distinction is worth keeping straight because they disagree.

         The declared three are the brand's own statement of itself. The
         three under them were read back off the work: k-means over the
         vision index's observed palettes for this study, 28 catalogued
         frames and 131 sampled values, via

             node scripts/derive-palette-rings.mjs --slug arc

         Names are not derivable from pixels, so each is carried over
         from the colour word the index observed most often in the
         frames that cluster there: cream and off-white (14 frames),
         olive and olive green (10), oak tan and honey oak (8).

         What the measurement says, which the declared list does not, is
         that the sage barely appears in the photography at all. The
         near-white ground is 48% of every value sampled. That is not an
         argument for changing the brand; it is why the swatch morphing
         through both reads as the real range of the work rather than a
         single chip.

         A fourth cluster came back at #0E0C0B and is deliberately left
         out: it is Ground under another name, and a morph between two
         blacks is a pause, not a state. */
      colors: [
        { name: "Primary", hex: "#B1BC94", description: "RGB 177/188/148", cmyk: "34 16 50 0" },
        { name: "Ground", hex: "#000000", description: "Structure, text", cmyk: "0 0 0 100" },
        { name: "Cream", hex: "#F1F0EE", description: "Observed, 48% of sampled values", cmyk: "4 3 4 0" },
        { name: "Warm Register", hex: "#C4A265", description: "Photography tones", cmyk: "0 17 48 23" },
        { name: "Olive", hex: "#4A463A", description: "Observed, 19%", cmyk: "58 50 68 30" },
        { name: "Oak Tan", hex: "#BAA383", description: "Observed, 16%", cmyk: "26 33 49 2" },
      ],
      fonts: [
        {
          name: "Ogg",
          role: "Primary Typeface",
          description:
            "Warm and slightly elevated, with a magazine feel. Headlines and feature names.",
        },
        {
          name: "Avenir Next",
          role: "Secondary Typeface, Medium",
          description:
            "Clean and neutral. Data labels, navigation, body text.",
        },
        {
          name: "Avenir Next",
          role: "Secondary Typeface, Demi Bold",
          description:
            "Section labels, key data points, and the navigation hierarchy. Enough weight to signal importance.",
        },
      ],
      /* THE SHIPPED LOCKUP, not a drawing of one. This was
         arc-logo-grid.png, a 2050px construction sheet with alpha:
         faint by nature, and at ledger scale it read as a grey smudge
         with a logo somewhere inside it. This is the app's own SVG,
         outlined paths with no <text> and no embedded bitmaps, so it
         needs no font and cannot go soft at any size. The field name is
         historical; the row is captioned for what it actually shows. */
      logoConstructionImage: `${IMG}/demo/patterns/logo-lockup.svg`,
      logoCaption: "The lockup",
      appScreenshotImage: `${IMG}/arc-app-dashboard-categories-configuration.png`,
      /* Cut out of the contact sheet above and flattened onto white.
         The sheet showed all nine at a tenth the size and could not
         move; these cycle, so each component gets the whole box for a
         beat. Sequenced the way the product is used: what you own, the
         projects it lives in, the shell, then what the archive gives
         back — insight, stats, a report, proof it is safe. */
      patternLibrary: [
        `${IMG}/arc-ui-most-valuable-items-card.jpg`,
        `${IMG}/arc-ui-select-your-project.jpg`,
        `${IMG}/arc-ui-nav-grid-account-summary.jpg`,
        `${IMG}/arc-ui-category-insights-top-values.jpg`,
        `${IMG}/arc-ui-quick-stats.jpg`,
        `${IMG}/arc-ui-report-configuration-pdf.jpg`,
        `${IMG}/arc-ui-backup-status-account-info.jpg`,
        `${IMG}/arc-ui-document-ai-scan-upload.jpg`,
      ],
      morphGlyphs: [{ char: "A" }, { char: "R" }, { char: "C" }],
    },

    // ── BUILD METHODOLOGY — pinned brief, columns nested ──
    {
      id: "build-header",
      type: "section-header",
      label: "SECTION 07: BUILD METHODOLOGY",
      title: "Solo engineering,",
      pressing: {
        mark: { n: "10", name: "Build methodology" },
        heldLine: "concept to deployment.",
        choreo: { pin: true },
      },
    },
    {
      id: "build-subhead",
      type: "text",
      size: "xl",
      content:
        "Ten weeks from the first idea to a live App Store product, with AI helping the whole way through.",
    },
    {
      id: "build-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content: "Python backend, Streamlit frontend, deployed on Vercel.",
    },
    {
      id: "build-text",
      type: "three-column-text",
      pressing: { mark: { n: "11", name: "AI-assisted development" } },
      columns: [
        {
          title: "Building Solo",
          content:
            "Solo means I made every decision and shipped every line. No engineering team, no PM handing out tickets, no design review, no QA. I found the problem, designed the fix, wrote the code, tested it, fixed what broke, and shipped it.\n\nThat turned out to be the fast way to work. When I noticed a problem, a fix could be live within hours. Friction I hit while testing got sorted in the same session, and a feature idea that came up mid-build got prototyped right then.\n\nThe tradeoff is that every decision is a prioritization call: what ships now, what waits, what gets polished and what only has to work. V1 is honest about those choices.",
        },
        {
          title: "AI-Assisted Development",
          content:
            "Claude Code was my main environment the whole way through. I would describe what I wanted in plain language, read the code that came back, test it, talk through the changes, and ship. Then again for the next feature.\n\nWhat that changes is where the bottleneck sits. It is less about syntax or knowing a framework and more about being clear on what the product should do, and that is the part design experience prepares you for.\n\nA.R.C. uses AI to do its job, and I used AI to build it. That is a big part of why one person could make the whole thing at this speed.",
        },
        {
          title: "Development Timeline",
          content:
            "Weeks 1-2 went to checking the idea. Could computer vision reliably pick out household items from ordinary phone photos? I tested across lighting, angles, and room types. It could, with a few caveats that ended up shaping the UX.\n\nWeeks 3-4 were the architecture: database schema, user flow, the room and item data models, authentication, storage. Everything else builds on those.\n\nWeeks 5-6 were interface design and the build of it, at the same time. There was no handoff between what I meant and what showed up in code, which is hard to pull off at a studio with separate teams.\n\nWeeks 7-8 were the financial layer, the insurance gap calculation and the policy limit comparison. This is the feature that turns A.R.C. from a documentation tool into a risk management one.\n\nWeeks 9-10 were the brand identity and visual system, the marketing site, and the go-to-market work, and then launch.",
        },
      ],
    },
    /* Bleed plate — the five-screen showcase closes the build section.
       Climbs the build brief. 2632px native, under the ~3000 floor, and
       a strip five screens wide gains nothing from filling the mat: at
       plate width each screen is already as large as its file allows. */
    {
      id: "build-app-screens",
      type: "image",
      src: `${IMG}/arc-five-screen-app-showcase.png`,
      alt: "Five A.R.C. application screens showing dashboard, item entry, room view, project selection, and document library",
      bleed: true,
      pressing: {
        caption: "Five application screens",
        choreo: { rise: true },
      },
    },

    // ── PRODUCT INTERFACE — pinned brief ──
    {
      id: "product-header",
      type: "section-header",
      label: "SECTION 08: PRODUCT INTERFACE",
      title: "Application views &",
      pressing: {
        mark: { n: "12", name: "Product interface" },
        heldLine: "data architecture.",
        /* Pinned: the headline holds while the interface argument
           travels. Nothing climbs this one, so no ClimbRoom follows. */
        choreo: { pin: true },
      },
    },
    {
      id: "product-intro",
      type: "text",
      size: "xl",
      content:
        /* Was "matters - because financially". A hyphen standing in for
           a dash is still a dash, and the rule covers all three. The
           clause it was joining takes a comma. */
        "The interface treats your stuff like it matters, because financially it does.",
    },
    {
      id: "product-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Dashboard, room, item detail, and report views, all from the V1 production app with representative data.",
    },
    // Viz — awaits the PressingVizFrame bridge; content untouched.
    {
      id: "feature-cards",
      type: "feature-cards",
      pressing: { mark: { n: "12", name: "Product interface" } },
      items: [
        {
          image: `${IMG}/arc-main-thumb.jpg`,
          title: "Dashboard View",
          description:
            "The home screen is the overview: total items, total estimated value, the category breakdown, coverage status, and recent activity. The hierarchy puts the money first: what you own, what it is worth, and whether you are covered.",
        },
        {
          image: `${IMG}/arc-room-thumb.jpg`,
          title: "Room View",
          description:
            "Each room is its own archive. Items show as cards with a thumbnail, name, category, and value, and you can sort them by value, category, or the date they were added.",
        },
        {
          image: `${IMG}/arc-report-thumb.jpg`,
          title: "Document AI",
          description:
            "Upload a receipt, an appraisal, a warranty, or an insurance document, and the AI pulls out the purchase date, amount, vendor, and coverage terms. It attaches those to the matching item when it can, and asks you which item when it can't.",
        },
        {
          image: `${IMG}/arc-reports-thumb.jpg`,
          title: "Reports",
          description:
            "PDF summaries for an insurance review, estate planning, or your own reference, by room, by category, or the whole home. Each one includes item photographs, descriptions, values, and the totals, laid out cleanly enough to hand to an agent or advisor.",
        },
      ],
    },

    // ── USAGE DATA — pinned brief; the speed chart lives here now ──
    {
      id: "usage-header",
      type: "section-header",
      label: "SECTION 09: USAGE DATA",
      title: "Field",
      pressing: {
        mark: { n: "13", name: "Usage data" },
        heldLine: "observations.",
        /* Pinned: the headline holds while the reduction numbers travel,
           and the pin reserves ClimbRoom for the plate below. */
        choreo: { pin: true },
      },
    },
    {
      id: "usage-text",
      type: "text",
      size: "xl",
      content:
        "Doing a 73-item home by hand takes an estimated 8-12 hours. A.R.C. documents the same home in under 30 minutes, which works out to 16-24x faster.",
    },
    {
      id: "usage-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "These are V1 numbers from launch onward, still early, and shown as they are.",
    },
    /* ── FLOW PLATE — the last photograph, climbing the usage brief ──
       Moved up over the two charts it used to follow. A chart holds
       nothing, so under dev-timeline this plate was bare, and at 2600px
       native it is below the ~3000 floor, so a zoom was not the way out
       either. A.R.C. already spends both of its zooms, on plate 02 and
       plate 08; a third would stop being a gesture.
       The cost is real and worth naming: the usage numbers and the
       speed chart that draws them no longer touch. They stay in the
       same cluster, the chart is still the first thing after the plate,
       and the trade buys the closing run-up its one human beat. The
       alternative was ending the study on two charts. */
    {
      id: "closing-lifestyle",
      type: "hero",
      image: `${IMG}/arc-app-tablet-kitchen-living-room-lifestyle.jpg`,
      alt: "A.R.C. app lifestyle — smartphone and tablet",
      inline: true,
      pressing: { choreo: { rise: true } },
    },
    // Viz — awaits the PressingVizFrame bridge; content untouched. Moved
    // here from the product-interface cluster: the usage brief states
    // these numbers and the chart is their one visual home.
    {
      id: "speed-comparison",
      type: "speed-comparison",
      pressing: {
        mark: { n: "13", name: "Usage data" },
        /* Provenance, not invented. The brief above this chart states it:
           "Traditional manual inventory of a 73-item home: estimated 8-12
           hours." Estimated is the study's own word and it stays. An
           earlier draft of this line had the manual figure coming from a
           homeowner and the A.R.C. figure from a measured run over the
           same house; the study says neither. */
        caption:
          "The same 73-item home, documented both ways. The 8-12 hours is " +
          "an estimate. The 30 minutes is how long the app takes.",
      },
      title: "DOCUMENTATION SPEED",
      items: [
        { label: "Manual Inventory", value: "8-12 hours", width: 95, color: "#9a9a92" },
        { label: "A.R.C. Documentation", value: "~30 minutes", width: 6, color: "#B1BC94" },
      ],
      callout: "16-24x",
      calloutSuffix: "faster",
    },
    {
      id: "dev-timeline",
      type: "dev-timeline",
      pressing: {
        mark: { n: "13", name: "Usage data" },
        /* The first draft of this line said the bars overlap and that the
           overlaps are where two stages ran at once. Neither is true. The
           phases carry a name and "2 wks" and nothing else, and the
           component lays them end to end from a running cursor, so they
           read 0-2, 2-4, 4-6, 6-8, 8-10. Five twos are the ten the header
           states, which is also the arithmetic that rules an overlap out.
           I was describing the picture and inventing a reason for it. */
        caption:
          "Ten weeks from idea to the App Store, in five two-week stages, " +
          "one after the other.",
      },
      label: "DEVELOPMENT TIMELINE",
      duration: "10 weeks, concept to launch",
      phases: [
        { name: "Concept Validation", weeks: "2 wks", color: "#C4C4A0" },
        { name: "Architecture", weeks: "2 wks", color: "#B1BC94" },
        { name: "Interface Design + Build", weeks: "2 wks", color: "#8FA07A" },
        { name: "Financial Layer", weeks: "2 wks", color: "#6B8060" },
        { name: "Brand + Go-to-Market", weeks: "2 wks", color: "#556B4A" },
      ],
    },


    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 10: CLOSING",
      title: "Currently in market",
      pressing: {
        mark: { n: "14", name: "Closing" },
        heldLine: "V1 live.",
      },
    },
    {
      id: "closing-origin",
      type: "text",
      size: "xl",
      content:
        "I built A.R.C. because I needed it. A renovated house, years of collected objects, nothing documented anywhere that would survive an insurance claim.",
    },
    {
      id: "closing-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "V2 is underway: native iOS, better scanning, deeper financial analysis, all on top of the V1 code as it stands.",
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Product Design",
        "Brand Identity",
        "Full-Stack Engineering",
        "Go-to-Market Strategy",
      ],
      stack: ["Python", "Streamlit", "OpenAI Vision API", "Perceptron Mk1", "Supabase", "Vercel", "Claude Code"],
      /* Country-neutral App Store form. The link as handed over was
         .../pl/app/..., which pins every reader to the Polish
         storefront; /app/id<ID> lets Apple route to the reader's own. */
      links: [
        { label: "App Store", url: "https://apps.apple.com/app/id6762497959" },
        { label: "arcready.app", url: "https://arcready.app" },
        { label: "heythere@arcready.app", url: "mailto:heythere@arcready.app" },
      ],
      content:
        "It has real users, and it exists because I couldn't find it anywhere.\n\nI keep coming back to the fact that this is a complete product: brand, code, financial logic, go-to-market. That was not possible two years ago. I don't fully know what to do with that yet, but I know it changes what the next one can be.",
    },
  ],
};
