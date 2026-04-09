import type { CaseStudy } from "@/lib/types";

export const arcCaseStudy: CaseStudy = {
  slug: "arc",
  title: "A.R.C. Archive. Ready. Cloud.",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "Computer vision meets home inventory. A complete product designed, engineered, branded, and shipped by one person.",
  field: "Home Inventory\nComputer Vision\nInsurance Technology",
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
  sections: [
    // ── HERO (leads the page) ──
    {
      id: "hero-1",
      type: "hero",
      image: "/case-studies/arc/arc-app-kitchen-project-selection-lifestyle.jpg",
      alt: "A.R.C. app on wooden surface with kitchen interior",
    },

    // ── META + ABSTRACT (two-column: meta left, abstract right) ──
    {
      id: "meta",
      type: "meta",
      field: "Home Inventory Computer Vision Insurance Technology",
      author: "Jeremy Prasatik",
      published: "2024",
      status: "V1 Live  In market",
      classification: [
        "Product Design",
        "Brand Identity",
        "Full-Stack Engineering",
        "Go-to-Market",
      ],
      title: "A.R.C.\nArchive. Ready. Cloud.",
      subtitle:
        "A computer vision system for residential asset documentation and insurance gap analysis. Designed, engineered, and shipped by a single builder.",
      abstract:
        "Home inventory is a solved problem that nobody has solved well. The average American household contains approximately 300,000 items with a combined insurable value that most homeowners have never calculated. Existing documentation tools are spreadsheets with better packaging. Manual entry, manual categorization, manual everything. The math is predictable: 60% of homeowners are underinsured because they've never cataloged what they own.\n\nA.R.C. applies computer vision to the problem. Point a camera at a room. The system identifies objects, estimates replacement value, assigns categories, and archives everything against a structured database. The financial layer calculates total documented assets against insurance policy limits and flags coverage gaps before a claim becomes necessary.\n\nThe entire product was designed, engineered, branded, and brought to market by one person working nights and weekends alongside a full-time creative director role. Python backend. Streamlit frontend. OpenAI Vision API for object recognition. Deployed on Vercel with Supabase handling data persistence. Concept to live product in weeks, not quarters.",
    },

    // ── PROBLEM STATEMENT — grouped in ECE6E1 container with 75px radius ──
    {
      id: "problem-header",
      type: "section-header",
      label: "SECTION 02: PROBLEM STATEMENT",
      title: "The Documentation\nBarrier",
      group: { name: "problem", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "problem-text",
      type: "text",
      size: "xl",
      content:
        "60% of American homeowners are underinsured because they've never cataloged what they own. The tools that exist haven't changed the math. Manual entry remains the barrier.",
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
      id: "problem-images",
      type: "triple-image",
      images: [
        { src: "/case-studies/arc/arc-app-smartphone-wooden-table-mockup.jpg", alt: "A.R.C. app — smartphone mockup" },
        { src: "/case-studies/arc/arc-room-scanning-interface.jpg", alt: "A.R.C. app — room scanning interface" },
        { src: "/case-studies/arc/arc-app-living-room-furniture-selection.jpg", alt: "A.R.C. app — item detail view" },
      ],
      group: { name: "problem" },
    },
    {
      id: "problem-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Insurance Reality",
          content:
            "The insurance industry operates on a fundamental asymmetry. Carriers know exactly what they'll pay on a policy. Homeowners rarely know what they'd need to claim. This gap widens with every purchase, every gift, every inherited piece that enters a home without documentation.\n\nStandard homeowner's policies cover personal property at 50-70% of the dwelling coverage amount. A home insured at $400,000 carries roughly $200,000-$280,000 in personal property coverage. Whether that number is adequate depends entirely on whether the homeowner knows what they own and what it costs to replace. Most don't.\n\nThe documentation process is the barrier. Open a spreadsheet. Walk room to room. Describe each item. Research replacement values. Photograph everything. Attach receipts. The estimated time to properly inventory an average home: 40+ hours. The percentage of homeowners who complete this process: single digits.",
        },
        {
          title: "Existing Solutions",
          content:
            "The market has tried. Apps exist. They fall into two categories.\n\nThe first is the glorified spreadsheet. Manual entry fields. Manual photo attachment. Manual value assignment. The app adds a database and maybe a cloud sync, but the work is identical to the spreadsheet it replaced. The friction that prevents documentation remains fully intact.\n\nThe second is the insurance carrier tool. Built by or for specific insurers, locked to their ecosystem, designed primarily to streamline claims processing rather than empower the homeowner. The interface reflects the priority: functional, utilitarian, built for adjusters who already know what they're looking at.\n\nNeither category addresses the core problem. Documentation is tedious because identification and valuation require human judgment on every single item.",
        },
        {
          title: "The Vision Layer",
          content:
            "Computer vision changes the input. Instead of describing what you own, you show it. The system observes, identifies, and classifies. The human role shifts from data entry to data review. Confirmation instead of creation.\n\nThis reframes the entire experience. The 40-hour inventory becomes a room-by-room scan measured in minutes. The barrier drops from prohibitive to trivial.\n\nA.R.C. was built on this premise. Reduce the input friction to nearly zero. Let the technology handle observation. Let the human handle judgment.",
        },
      ],
      group: { name: "problem" },
    },
    {
      id: "problem-mobile-screens",
      type: "image",
      src: "/case-studies/arc/arc-three-screen-lifestyle-mockup.png",
      alt: "A.R.C. mobile app screens overview",
      bleed: true,
      group: { name: "problem" },
    },
    {
      id: "problem-editorial",
      type: "editorial-headline",
      text: "Every room tells a story.\nI built the system\nthat remembers it.",
    },
    {
      id: "problem-hero-group",
      type: "hero",
      image: "/case-studies/arc/arc-multi-device-lifestyle-hero.jpg",
      alt: "A.R.C. app lifestyle scenes — mobile interfaces in context",
      inline: true,
    },

    // ── METHODOLOGY ──
    {
      id: "methodology-header",
      type: "section-header",
      label: "SECTION 03: METHODOLOGY / HOW IT WORKS",
      title: "System Architecture &\nRecognition Engine.",
    },
    {
      id: "methodology-text",
      type: "text",
      size: "xl",
      content:
        "A single photograph triggers a six-stage recognition pipeline.",
    },
    {
      id: "methodology-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The image passes through vision processing, object identification, value estimation, and archival. Each stage feeds the next. Each decision point governed by confidence thresholds. Processing time measured under typical indoor lighting conditions.",
    },
    {
      id: "pipeline",
      type: "pipeline",
      steps: [
        {
          number: "01",
          title: "Image Capture",
          description:
            "User photographs a room or individual item using their device camera. No special hardware. No calibration. Standard smartphone optics.",
          title2: "Archive Entry",
          description2:
            "The documented item enters the user's structured inventory. Linked to a room, tagged with metadata, associated with its source photograph, and immediately included in aggregate calculations.",
          image: "/case-studies/arc/arc-pipeline-ai-categorization-step.jpg",
        },
        {
          number: "02",
          title: "Vision Processing",
          description:
            "OpenAI Vision API receives the image and returns structured analysis. Object identification, material detection, style classification, condition assessment, estimated era or manufacture period.",
          title2: "Financial Analysis",
          description2:
            "Total documented value updates in real time. The system compares cumulative asset value against the user's stated policy limits. When documented assets approach or exceed coverage thresholds, the shortfall shows up as a specific dollar amount. The homeowner sees it before a disaster reveals it.",
          image: "/case-studies/arc/arc-pipeline-cloud-sync-step.jpg",
        },
        {
          number: "03",
          title: "Value Estimation",
          description:
            "Identified objects are matched against market replacement data. The system estimates current replacement cost, not depreciated value or original purchase price. Replacement cost is the insurance-relevant metric.",
          title2: "Category Assignment",
          description2:
            "Each item is classified into a taxonomy: furniture, electronics, artwork, appliances, fixtures, textiles, collectibles, vehicles, tools, sporting goods, musical instruments, jewelry, documents. Sub-categories provide additional granularity.",
          image: "/case-studies/arc/arc-pipeline-photo-capture-step.jpg",
        },
      ],
    },
    {
      id: "system-architecture",
      type: "system-architecture",
    },

    // ── CLASSIFICATION — horizontal bars ──
    {
      id: "classification-header",
      type: "section-header",
      label: "SECTION 03: METHODOLOGY / HOW IT WORKS",
      title: "Classification\nSystem",
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
    {
      id: "stats",
      type: "stats-bar",
      items: [
        {
          label: "Furniture",
          value: "$680",
          description: "Average documented value per item: $680 Most common rooms: Living Room, Bedroom, Dining Room",
          width: 76,
        },
        {
          label: "Electronics",
          value: "$425",
          description: "Average documented value per item: $425 Most common rooms: Office, Living Room, Kitchen",
          width: 85,
        },
        {
          label: "Artwork",
          value: "$580",
          description: "Average documented value per item: $580 Most common rooms: Living Room, Hallway, Bedroom",
          width: 89,
        },
        {
          label: "Appliances",
          value: "$890",
          description: "Average documented value per item: $890 Most common rooms: Kitchen, Laundry, Garage",
          width: 81,
        },
        {
          label: "Fixtures",
          value: "$310",
          description: "Average documented value per item: $310 Most common rooms: Kitchen, Bathroom, Dining Room",
          width: 87,
        },
        {
          label: "Textiles",
          value: "$185",
          description: "Average documented value per item: $185 Most common rooms: Bedroom, Living Room, Bathroom",
          width: 88,
        },
        {
          label: "Collectibles",
          value: "$695",
          description: "Average documented value per item: $695 Most common rooms: Office, Display areas",
          width: 85,
        },
        {
          label: "Vehicles",
          value: "$5,000+",
          description: "Average documented value per item: $5,000+ Location: Garage, Driveway, Storage",
          width: 85,
        },
      ],
    },

    {
      id: "classification-hero",
      type: "image",
      src: "/case-studies/arc/arc-dashboard-screen-hero.png",
      alt: "A.R.C. classification system interface",
      aspect: "native",
      maxWidth: 700,
    },

    // ── FINANCIAL INTELLIGENCE ──
    {
      id: "financial-header",
      type: "section-header",
      label: "SECTION 05: FINANCIAL INTELLIGENCE",
      title: "Insurance\nGap Analysis",
    },
    {
      id: "financial-note",
      type: "text",
      size: "xl",
      content: "Where the product stops being an inventory tool and becomes a risk management system.",
    },
    {
      id: "financial-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Documented asset value compared against user-reported policy limits. Gap shown as a specific dollar amount before a disaster reveals it.",
    },
    {
      id: "financial-text",
      type: "text-right",
      content:
        "Every documented item contributes to a running total. That total is compared against the user's stated policy limit for personal property coverage. The math is simple. The insight is not.\n\nMost homeowners set their personal property coverage when they purchase the policy and never revisit it. Meanwhile, the contents of their home change continuously. New furniture. Upgraded appliances. Gifts. Inherited pieces. A home that was adequately covered five years ago may be $50,000 underinsured today without the homeowner knowing.\n\nA.R.C. makes the gap visible. Not as an abstract concept. As a specific dollar amount tied to specific documented items in specific rooms.",
    },
    {
      id: "financial-coverage-chart",
      type: "coverage-chart",
      assetValue: "Documented Asset Value",
      assetAmount: 49630,
      policyLimit: "Policy Coverage Limit",
      policyAmount: 38000,
    },
    {
      id: "financial-image",
      type: "hero",
      image: "/case-studies/arc/arc-app-vinyl-turntable-shelves-lifestyle.jpg",
      alt: "Insurance Coverage Analysis",
      inline: true,
    },

    // ── BRAND SYSTEM — unified two-tone panel ──
    {
      id: "brand-system",
      type: "brand-system",
      label: "SECTION 06: BRAND SYSTEM",
      title: "Visual Identity &\nDesign Language",
      introText:
        "The brand had to solve a tension. Home inventory sounds like a chore. Insurance analysis sounds like a meeting with your agent. Neither association invites engagement. The visual identity needed to make documentation feel like something worth doing, not something you should get around to eventually.",
      subcopy:
        "Editorial warmth applied to utility software. Magazine sensibility meets insurance rigor.",
      philosophyText:
        "The solution was editorial warmth applied to utility software. Magazine sensibility meets insurance rigor. The interface treats data as something worth designing, not just storing. Asset cards that feel like collection entries. Room views that read like curated galleries. Financial summaries that carry the weight of their content without the sterility of a spreadsheet.\n\nThe same philosophy extends to the documentation experience itself. Scanning a room should feel considered, not clinical. Reviewing your inventory should feel like browsing a personal archive, not auditing a warehouse. The brand language exists to make the practical feel purposeful.",
      chromaticCircleImage: "/case-studies/arc/chromatic-brand-circle.png",
      colors: [
        { name: "Primary", hex: "#B1BC94", description: "RGB 177/188/148" },
        { name: "Warm Register", hex: "#C4A265", description: "Photography tones" },
        { name: "Ground", hex: "#000000", description: "Structure, text" },
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
      logoConstructionImage: "/case-studies/arc/arc-logo-grid.png",
      appScreenshotImage: "/case-studies/arc/arc-app-dashboard-categories-configuration.png",
    },

    // ── BUILD METHODOLOGY ──
    {
      id: "build-header",
      type: "section-header",
      label: "SECTION 07: BUILD METHODOLOGY",
      title: "Solo Engineering\nConcept to Deployment",
    },
    {
      id: "build-subhead",
      type: "text",
      size: "xl",
      content:
        "One person. Ten weeks. Concept to live product in the App Store.",
    },
    {
      id: "build-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "AI-assisted development with Claude Code as the primary environment. Python backend, Streamlit frontend, deployed on Vercel. No engineering team, no QA department.",
    },
    {
      id: "build-text",
      type: "three-column-text",
      columns: [
        {
          title: "The Builder Reality",
          content:
            "No engineering team. No product manager assigning tickets. No design review board. No QA department. One person identifying the problem, designing the solution, writing the code, testing the output, fixing what broke, and shipping the result.\n\nThis isn't a limitation narrative. It's a velocity argument. The feedback loop between identifying a problem and deploying a fix is measured in hours, not sprints. A UX friction point noticed during testing gets resolved in the same session. A feature idea that shows up during development gets prototyped immediately. The distance between intention and execution is as short as it can possibly be.\n\nThe tradeoff is real. Solo development means every decision is a prioritization decision. What ships now versus what ships later. What gets refined versus what gets functional. V1 is an honest assessment of those tradeoffs: comprehensive in scope, considered in design, pragmatic in implementation.",
        },
        {
          title: "AI-Assisted Development",
          content:
            "Claude Code served as the primary development environment. The workflow: describe the intended behavior in natural language. Review the generated code. Test the output. Refine through conversation. Ship.\n\nThis approach inverts the traditional bottleneck. The constraint is no longer syntax knowledge or framework expertise. It's clarity of intention. Knowing exactly what the product should do matters more than knowing exactly how to make it do it.\n\nThe same AI-assisted methodology that powers A.R.C.'s computer vision also powered its creation. A product built with AI, built to use AI, built by someone who understands both sides of that equation.",
        },
        {
          title: "Development Timeline",
          content:
            "Week 1-2: Core concept validation. Can computer vision reliably identify household items from standard smartphone photographs? Testing across lighting conditions, angles, room types. The answer was yes, with caveats that informed the UX design.\n\nWeek 3-4: Product architecture. Database schema. User flow. Room and item data models. Authentication. Storage. The foundational decisions that everything else builds on.\n\nWeek 5-6: Interface design and implementation. Simultaneously designing and building. The luxury of solo development: no handoff gap between design intent and code reality.\n\nWeek 7-8: Financial layer. Insurance gap calculations. Policy limit comparisons. The feature that transforms a documentation tool into a risk management product.\n\nWeek 9-10: Brand identity. Visual system. Marketing site. Go-to-market preparation. Launch. Weeks, not months. Not quarters. Not fiscal years. Weeks.",
        },
      ],
    },
    {
      id: "build-app-screens",
      type: "image",
      src: "/case-studies/arc/arc-five-screen-app-showcase.png",
      alt: "Five A.R.C. application screens showing dashboard, item entry, room view, project selection, and document library",
      aspect: "native",
    },

    // ── PRODUCT INTERFACE ──
    {
      id: "product-header",
      type: "section-header",
      label: "SECTION 08: PRODUCT INTERFACE",
      title: "Application Views &\nData Architecture",
      group: { name: "product-interface", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "product-intro",
      type: "text",
      size: "xl",
      content:
        "Every view designed to make the practical feel purposeful. Documentation as curated archive.",
      group: { name: "product-interface" },
    },
    {
      id: "product-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Dashboard, room, item detail, and report views. All screens reflect V1 production application with representative usage data.",
      group: { name: "product-interface" },
    },
    {
      id: "feature-cards",
      type: "feature-cards",
      items: [
        {
          image: "/case-studies/arc/arc-main-thumb.jpg",
          title: "Dashboard View",
          description:
            "The home screen presents aggregate intelligence. Total items documented. Total estimated value. Category breakdown. Coverage status. Recent activity. The information hierarchy prioritizes financial awareness: what you own, what it's worth, whether you're covered.",
        },
        {
          image: "/case-studies/arc/arc-room-thumb.jpg",
          title: "Room View",
          description:
            "Each documented room functions as a contained archive. Items displayed as cards with thumbnail, name, category, and value. Sortable by value, category, or date added. The room becomes a gallery of your own possessions, organized for both browsing and analysis.",
        },
        {
          image: "/case-studies/arc/arc-report-thumb.jpg",
          title: "Document AI",
          description:
            "Upload a receipt, appraisal, warranty, or insurance document. AI extracts relevant details: purchase date, amount, vendor, coverage terms. The extracted data associates with the corresponding item automatically when possible, or prompts the user for assignment.",
        },
        {
          image: "/case-studies/arc/arc-reports-thumb.jpg",
          title: "Reports",
          description:
            "Generate PDF summaries for insurance review, estate planning, or personal reference. Configurable by room, category, or full home. Includes item photographs, descriptions, values, and aggregate statistics. Formatted for professional presentation to agents or advisors.",
        },
      ],
      group: { name: "product-interface" },
    },

    {
      id: "speed-comparison",
      type: "speed-comparison",
      title: "DOCUMENTATION SPEED",
      items: [
        { label: "Manual Inventory", value: "8-12 hours", width: 95, color: "#9a9a92" },
        { label: "A.R.C. Documentation", value: "~30 minutes", width: 6, color: "#B1BC94" },
      ],
      callout: "16-24x",
      calloutSuffix: "faster",
      group: { name: "product-interface" },
    },

    // ── USAGE DATA ──
    {
      id: "usage-header",
      type: "section-header",
      label: "SECTION 09: USAGE DATA",
      title: "Field\nObservations",
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
    {
      id: "dev-timeline",
      type: "dev-timeline",
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

    // ── LIFESTYLE IMAGE BEFORE CLOSING ──
    {
      id: "closing-lifestyle",
      type: "hero",
      image: "/case-studies/arc/arc-app-tablet-kitchen-living-room-lifestyle.jpg",
      alt: "A.R.C. app lifestyle — smartphone and tablet",
      inline: true,
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 10: CLOSING",
      title: "Currently in Market\nV1 Live",
    },
    {
      id: "closing-origin",
      type: "text",
      size: "xl",
      content:
        "Built because the person who made it needed it. A renovated house, years of collected objects, and nothing documented.",
    },
    {
      id: "closing-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "V1 live and in market. V2 roadmap includes native architecture migration, enhanced scanning precision, and deeper financial analysis.",
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
      stack: ["Python", "Streamlit", "OpenAI Vision API", "Supabase", "Vercel", "Claude Code"],
      links: [
        { label: "arcready.app", url: "https://arcready.app" },
        { label: "heythere@arcready.app", url: "mailto:heythere@arcready.app" },
      ],
      content:
        "A single person with design experience, AI tools, and a real problem to solve shipped a complete product. Not a prototype. Not a demo. A live application in the App Store with paying users and a roadmap.\n\nV2 migrates the full stack to a native architecture. More precise scanning. Faster processing. Deeper financial analysis. The foundation built in V1 supports everything planned without a rebuild.\n\nThe larger point extends beyond this specific product. The tools exist now for designers who think in systems to build the systems they think about. The gap between vision and execution isn't technical anymore. It's about willingness to ship. A.R.C. shipped.",
    },
  ],
};
