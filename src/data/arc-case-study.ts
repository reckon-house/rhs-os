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
    "An app that looks at what you own and tells you whether your insurance actually covers it.",
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
        "An app that looks at what you own and tells you whether your insurance actually covers it.",
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
        { label: "Angle", value: "Nobody skips home inventory because they don't care. They skip it because the work is miserable. Remove the input problem and the rest is straightforward." },
      ],
      abstract:
        "Home inventory is a solved problem that nobody has solved well. The average American household contains around 300,000 items with a combined insurable value most homeowners have never calculated, and the existing tools haven't moved the needle - they're spreadsheets with better packaging, asking people to do the same manual work they'd been avoiding all along. The result is predictable. About 60% of homeowners are underinsured because they've never cataloged what they own.\n\nA.R.C. works differently. You point a camera at a room - photo or video - and the system identifies what's there, estimates replacement value, and categorizes everything in the same pass. Video scanning, powered by Perceptron's Mk1 model, makes this even faster - sweep a room and the model reasons across the footage in real time. Then A.R.C. compares what you've documented against your policy limit and shows you the gap as an actual dollar amount.\n\nI built A.R.C. end to end - concept, code, brand, go-to-market. Python backend, Streamlit frontend, OpenAI Vision API and Perceptron Mk1 for recognition, deployed on Vercel with Supabase handling data persistence. Concept to live product in ten weeks.",
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
        instruction: "Scroll — fills the mat, then travels the frame",
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
      title: "Nobody",
      group: { name: "problem" },
      pressing: {
        mark: { n: "03", name: "Problem statement" },
        heldLine: "does this.",
        choreo: { pin: true },
      },
    },
    {
      id: "problem-text",
      type: "text",
      size: "xl",
      content:
        "About 60% of American homeowners are underinsured, and the reason is simpler than it sounds - they've never written down what they own. The apps that exist haven't fixed this because they all ask you to do the same tedious work by hand.",
      group: { name: "problem" },
    },
    {
      id: "problem-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Based on industry estimates of homeowner documentation rates and average coverage gaps.",
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
            "The insurance industry operates on a fundamental asymmetry. Carriers know exactly what they'll pay on a policy. Homeowners rarely know what they'd need to claim. This gap widens with every purchase, every gift, every inherited piece that enters a home without documentation.\n\nStandard homeowner's policies cover personal property at 50-70% of the dwelling coverage amount. A home insured at $400,000 carries roughly $200,000-$280,000 in personal property coverage. Whether that number is adequate depends entirely on whether the homeowner knows what they own and what it costs to replace. Most don't.\n\nThe documentation process is the barrier. Open a spreadsheet. Walk room to room. Describe each item. Research replacement values. Photograph everything. Attach receipts. The estimated time to properly inventory an average home: 40+ hours. The percentage of homeowners who complete this process: single digits.",
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
            "I downloaded every home inventory app I could find before building this. They all land in the same place. Some are just spreadsheets wearing a better outfit - you still type in every item, attach every photo, look up every replacement value yourself. The app adds a database and maybe cloud sync, but the actual work is identical to the spreadsheet it replaced.\n\nThe others are insurance carrier tools, built for their own ecosystem, designed to make claims processing easier for adjusters rather than documentation easier for homeowners. The interfaces feel like it - functional, dense, built for someone who already knows what they're looking at.\n\nThe shared problem is that every one of them still asks you to identify and value each item yourself, one at a time. That's the part nobody wants to do, and no amount of better UI changes it.",
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
            "The fix is changing what the person has to do. Instead of describing everything you own, you show it. The camera sees a room, the system identifies what's there, estimates values, and categorizes - and your job becomes reviewing what it found rather than entering it from scratch.\n\nVideo takes this further. Perceptron's Mk1 model was built specifically for understanding the physical world through footage - it reasons across frames, tracks objects through space, and handles the kind of spatial context that a single photo misses. Sweep a room with your phone camera and Mk1 processes the whole thing. It's genuinely fast, and the recognition quality is excellent.\n\nThat shift is what makes the difference. A full home inventory that would take 40+ hours by hand becomes a room-by-room scan that takes minutes. I built A.R.C. on the idea that if you remove the input problem, the rest of home inventory is actually straightforward.",
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
      text: "Nobody skips this because they don't care\nThey skip it because\nthe work is miserable",
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
        "One photo or video starts the whole process - from raw input to cataloged, valued, and categorized items.",
    },
    {
      id: "methodology-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The image passes through vision processing, object identification, value estimation, and archival. Each stage feeds the next. Each decision point governed by confidence thresholds. Processing time measured under typical indoor lighting conditions.",
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
            "User photographs a room or individual item using their device camera. No special hardware. No calibration. Standard smartphone optics.\n\nArchive Entry. The documented item enters the user's structured inventory. Linked to a room, tagged with metadata, associated with its source photograph, and immediately included in aggregate calculations.",
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
            "OpenAI Vision API receives the image and returns structured analysis. Object identification, material detection, style classification, condition assessment, estimated era or manufacture period.\n\nFinancial Analysis. Total documented value updates in real time. The system compares cumulative asset value against the user's stated policy limits. When documented assets approach or exceed coverage thresholds, the shortfall shows up as a specific dollar amount. The homeowner sees it before a disaster reveals it.",
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
            "Identified objects are matched against market replacement data. The system estimates current replacement cost, not depreciated value or original purchase price. Replacement cost is the insurance-relevant metric.\n\nCategory Assignment. Each item is classified into a taxonomy: furniture, electronics, artwork, appliances, fixtures, textiles, collectibles, vehicles, tools, sporting goods, musical instruments, jewelry, documents. Sub-categories provide additional granularity.",
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
        "Taxonomy designed for insurance relevance, not retail categorization. Each category maps to standard personal property claim classifications.",
    },
    {
      id: "classification-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Sub-categories provide the granularity needed for accurate valuation without requiring specialized knowledge from the user. Aligned with classifications used by major U.S. carriers.",
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
        choreo: { rise: true },
      },
    },
    // Viz — awaits the PressingVizFrame bridge; content untouched.
    {
      id: "stats",
      type: "stats-bar",
      pressing: { mark: { n: "07", name: "Classification system" } },
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
        "Documented asset value compared against user-reported policy limits.",
    },
    // Viz — awaits the PressingVizFrame bridge; content untouched.
    {
      id: "financial-text",
      type: "text-right",
      pressing: { mark: { n: "08", name: "Financial intelligence" } },
      content:
        "Every item you document adds to a running total, and that total gets compared against your policy limit for personal property. The arithmetic is obvious. What's less obvious is how far off most people are.\n\nMost homeowners set their coverage amount when they buy the policy and never touch it again. But the stuff inside the house keeps changing - new furniture, upgraded appliances, gifts, pieces inherited from parents. A home that was adequately covered five years ago might be $50,000 short today, and the homeowner has no way of knowing until something goes wrong.\n\nA.R.C. puts a number on the gap. A specific dollar amount, tied to specific items, in specific rooms - before a disaster reveals it.",
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
      src: "https://arcready.app",
      title: "A.R.C., live",
      origin: "arcready.app",
      poster: `${IMG}/arc-app-kitchen-project-selection-lifestyle.jpg`,
      posterAlt: "A.R.C. running on a phone, resting on a kitchen counter",
      instruction: "Upload a photo of a room and the model will itemise it.",
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
      title: "Visual Identity &\nDesign Language",
      pressing: { mark: { n: "09", name: "Brand system" } },
      introText:
        "The brand had to solve a tension. Home inventory sounds like a chore. Insurance analysis sounds like a meeting with your agent. Neither association invites engagement. The visual identity needed to make documentation feel like something worth doing, not something you should get around to eventually.",
      subcopy:
        "The interface should feel like something worth looking at, not a chore with a progress bar.",
      philosophyText:
        "The solution was editorial warmth applied to utility software. Magazine sensibility meets insurance rigor. The interface treats data as something worth designing, not just storing. Asset cards that feel like collection entries. Room views that read like curated galleries. Financial summaries that carry the weight of their content without the sterility of a spreadsheet.",
      chromaticCircleImage: `${IMG}/chromatic-brand-circle.png`,
      colors: [
        { name: "Primary", hex: "#B1BC94", description: "RGB 177/188/148", cmyk: "34 16 50 0" },
        { name: "Warm Register", hex: "#C4A265", description: "Photography tones", cmyk: "0 17 48 23" },
        { name: "Ground", hex: "#000000", description: "Structure, text", cmyk: "0 0 0 100" },
      ],
      fonts: [
        {
          name: "Ogg",
          role: "Primary Typeface",
          description:
            "Warm, editorial, slightly elevated. Carries the brand's emotional register. Headlines, feature names, moments of consideration.",
        },
        {
          name: "Avenir Next",
          role: "Secondary Typeface, Medium",
          description:
            "Clean, neutral, highly legible. Carries the product's utility layer. Data labels, navigation, body text, interface clarity.",
        },
        {
          name: "Avenir Next",
          role: "Secondary Typeface, Demi Bold",
          description:
            "Structural emphasis. Section labels, key data points, navigational hierarchy. Weight that signals importance without shouting.",
        },
      ],
      logoConstructionImage: `${IMG}/arc-logo-grid.png`,
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
        "Ten weeks from concept to a live App Store product. Solo build. AI-assisted throughout.",
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
            "Building solo means I made every decision and shipped every line. There was no engineering team, no PM assigning tickets, no design review, no QA department. I identified the problem, designed the solution, wrote the code, tested the output, fixed what broke, and shipped the result.\n\nThis isn't a limitation - it's a speed advantage. The feedback loop between noticing a problem and deploying a fix runs in hours, not sprints. UX friction caught during testing gets resolved in the same session. A feature idea that surfaces during development gets prototyped right away. The distance between intention and execution stays as short as I could make it.\n\nThe tradeoff is real. Solo means every decision is a prioritization decision - what ships now versus what ships later, what gets polished versus what gets to functional. V1 reflects those choices honestly. Comprehensive in scope, considered in design, pragmatic where it had to be.",
        },
        {
          title: "AI-Assisted Development",
          content:
            "Claude Code was my primary environment throughout. The workflow looked something like this: I'd describe what I wanted in natural language, review the code that came back, test the output, refine through conversation, ship. Repeat until the feature worked.\n\nThis setup inverts the old bottleneck. The constraint isn't syntax fluency or framework expertise anymore. It's clarity of intention. Knowing exactly what the product should do matters more than knowing exactly how to make it do it - and that's the part design experience actually prepares you for.\n\nA.R.C. uses AI to do its core job. A.R.C. was also built with AI to make it. Same toolset, two sides of the same equation, which is part of what makes the whole thing possible at this scale and speed.",
        },
        {
          title: "Development Timeline",
          content:
            "Weeks 1-2 went to concept validation. Could computer vision reliably identify household items from standard smartphone photos? I tested across lighting conditions, angles, and room types. The answer was yes, with caveats that ended up shaping the UX.\n\nWeeks 3-4 were product architecture - database schema, user flow, room and item data models, authentication, storage. The foundational decisions everything else builds on.\n\nWeeks 5-6 were interface design and implementation, happening at the same time. That's the part you can't really do at a traditional studio - no handoff gap between design intent and what shows up in code.\n\nWeeks 7-8 were the financial layer. Insurance gap calculations, policy limit comparisons. This is the feature that turns A.R.C. from a documentation tool into a risk management one.\n\nWeeks 9-10 were brand identity, visual system, marketing site, and the go-to-market work. Then launch. Ten weeks, start to finish.",
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
        "The interface treats your stuff like it matters - because financially, it does.",
    },
    {
      id: "product-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Dashboard, room, item detail, and report views. All screens reflect V1 production application with representative usage data.",
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
            "The home screen presents aggregate intelligence. Total items documented. Total estimated value. Category breakdown. Coverage status. Recent activity. The information hierarchy prioritizes financial awareness: what you own, what it's worth, whether you're covered.",
        },
        {
          image: `${IMG}/arc-room-thumb.jpg`,
          title: "Room View",
          description:
            "Each documented room functions as a contained archive. Items displayed as cards with thumbnail, name, category, and value. Sortable by value, category, or date added. The room becomes a gallery of your own possessions, organized for both browsing and analysis.",
        },
        {
          image: `${IMG}/arc-report-thumb.jpg`,
          title: "Document AI",
          description:
            "Upload a receipt, appraisal, warranty, or insurance document. AI extracts relevant details: purchase date, amount, vendor, coverage terms. The extracted data associates with the corresponding item automatically when possible, or prompts the user for assignment.",
        },
        {
          image: `${IMG}/arc-reports-thumb.jpg`,
          title: "Reports",
          description:
            "Generate PDF summaries for insurance review, estate planning, or personal reference. Configurable by room, category, or full home. Includes item photographs, descriptions, values, and aggregate statistics. Formatted for professional presentation to agents or advisors.",
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
        "Traditional manual inventory of a 73-item home: estimated 8-12 hours. A.R.C. documentation of the same scope: under 30 minutes. Reduction factor: 16-24x.",
    },
    {
      id: "usage-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Metrics reflect V1 usage since launch. Early-stage numbers. Presented without inflation.",
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
      pressing: { mark: { n: "13", name: "Usage data" } },
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
      pressing: { mark: { n: "13", name: "Usage data" } },
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
        "V2 work is underway - native iOS, enhanced scanning, deeper financial analysis. The V1 foundation supports it all without a rebuild.",
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
      links: [
        { label: "arcready.app", url: "https://arcready.app" },
        { label: "heythere@arcready.app", url: "mailto:heythere@arcready.app" },
      ],
      content:
        "Real users, a product that exists because I couldn't find it.\n\nI keep thinking about the fact that this is a complete product - brand, code, financial logic, go-to-market. That wasn't possible two years ago. I don't fully know what to do with that yet. But I know it changes what's possible for the next one.",
    },
  ],
};
