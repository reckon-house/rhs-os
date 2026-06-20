import type { CaseStudy } from "@/lib/types";

export const arcCaseStudy: CaseStudy = {
  slug: "arc",
  title: "A.R.C. Archive. Ready. Cloud.",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "An app that looks at what you own and tells you whether your insurance actually covers it.",
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
      summary: [
        { label: "Built", value: "Camera-scan home inventory app. Vision recognition, value estimation, insurance gap analysis." },
        { label: "Scope", value: "Solo, end to end. Concept, code, brand, go-to-market." },
        { label: "Stack", value: "Python, Streamlit, OpenAI Vision, Perceptron Mk1, Supabase, Vercel, Claude Code." },
        { label: "Angle", value: "Nobody skips home inventory because they don't care. They skip it because the work is miserable. Remove the input problem and the rest is straightforward." },
      ],
      title: "A.R.C.\nArchive. Ready. Cloud.",
      subtitle:
        "An app that looks at what you own and tells you whether your insurance actually covers it.",
      abstract:
        "Home inventory is a solved problem that nobody has solved well. The average American household contains around 300,000 items with a combined insurable value most homeowners have never calculated, and the existing tools haven't moved the needle - they're spreadsheets with better packaging, asking people to do the same manual work they'd been avoiding all along. The result is predictable. About 60% of homeowners are underinsured because they've never cataloged what they own.\n\nA.R.C. works differently. You point a camera at a room - photo or video - and the system identifies what's there, estimates replacement value, and categorizes everything in the same pass. Video scanning, powered by Perceptron's Mk1 model, makes this even faster - sweep a room and the model reasons across the footage in real time. Then A.R.C. compares what you've documented against your policy limit and shows you the gap as an actual dollar amount.\n\nI built A.R.C. end to end - concept, code, brand, go-to-market. Python backend, Streamlit frontend, OpenAI Vision API and Perceptron Mk1 for recognition, deployed on Vercel with Supabase handling data persistence. Concept to live product in ten weeks.",
    },

    // ── PROBLEM STATEMENT — grouped in ECE6E1 container with 75px radius ──
    {
      id: "problem-header",
      type: "section-header",
      label: "SECTION 02: PROBLEM STATEMENT",
      title: "Nobody\nDoes This",
      group: { name: "problem", bg: "#ECE6E1", radius: 75, padding: "60px" },
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
            "I downloaded every home inventory app I could find before building this. They all land in the same place. Some are just spreadsheets wearing a better outfit - you still type in every item, attach every photo, look up every replacement value yourself. The app adds a database and maybe cloud sync, but the actual work is identical to the spreadsheet it replaced.\n\nThe others are insurance carrier tools, built for their own ecosystem, designed to make claims processing easier for adjusters rather than documentation easier for homeowners. The interfaces feel like it - functional, dense, built for someone who already knows what they're looking at.\n\nThe shared problem is that every one of them still asks you to identify and value each item yourself, one at a time. That's the part nobody wants to do, and no amount of better UI changes it.",
        },
        {
          title: "The Vision Layer",
          content:
            "The fix is changing what the person has to do. Instead of describing everything you own, you show it. The camera sees a room, the system identifies what's there, estimates values, and categorizes - and your job becomes reviewing what it found rather than entering it from scratch.\n\nVideo takes this further. Perceptron's Mk1 model was built specifically for understanding the physical world through footage - it reasons across frames, tracks objects through space, and handles the kind of spatial context that a single photo misses. Sweep a room with your phone camera and Mk1 processes the whole thing. It's genuinely fast, and the recognition quality is excellent.\n\nThat shift is what makes the difference. A full home inventory that would take 40+ hours by hand becomes a room-by-room scan that takes minutes. I built A.R.C. on the idea that if you remove the input problem, the rest of home inventory is actually straightforward.",
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
      text: "Nobody skips this because they don't care.\nThey skip it because the work is miserable.",
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
      content: "This is the part that makes A.R.C. more than inventory software.",
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
        "Every item you document adds to a running total, and that total gets compared against your policy limit for personal property. The arithmetic is obvious. What's less obvious is how far off most people are.\n\nMost homeowners set their coverage amount when they buy the policy and never touch it again. But the stuff inside the house keeps changing - new furniture, upgraded appliances, gifts, pieces inherited from parents. A home that was adequately covered five years ago might be $50,000 short today, and the homeowner has no way of knowing until something goes wrong.\n\nA.R.C. puts a number on the gap. A specific dollar amount, tied to specific items, in specific rooms - before a disaster reveals it.",
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
        "The interface should feel like something worth looking at, not a chore with a progress bar.",
      philosophyText:
        "I wanted the product to feel editorial - closer to a magazine than a spreadsheet. Asset cards that read like collection entries, room views that feel like curated galleries, financial summaries that carry real weight without the sterility of a typical dashboard.\n\nThe same philosophy extends to the documentation experience itself. Scanning a room should feel considered, not clinical. Reviewing your inventory should feel like browsing a personal archive, not auditing a warehouse. The brand language exists to make the practical feel purposeful.",
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
        "Ten weeks from concept to a live App Store product. Solo build. AI-assisted throughout.",
    },
    {
      id: "build-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Claude Code as the primary development environment. Python backend, Streamlit frontend, deployed on Vercel. No engineering team behind any of it.",
    },
    {
      id: "build-text",
      type: "three-column-text",
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
    {
      id: "build-app-screens",
      type: "image",
      src: "/case-studies/arc/arc-five-screen-app-showcase.png",
      alt: "Five A.R.C. application screens showing dashboard, item entry, room view, project selection, and document library",
      aspect: "native",
      mobileAspect: "square",
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
        "The interface treats your stuff like it matters - because financially, it does.",
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
        "I built A.R.C. because I needed it. A renovated house, years of collected objects, nothing documented anywhere that would survive an insurance claim.",
    },
    {
      id: "closing-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "V1 is live and in market. V2 work is underway - native iOS, enhanced scanning, deeper financial analysis. The V1 foundation supports it all without a rebuild.",
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
        "A.R.C. is live and in market - not a prototype, not a demo. Real users, a real roadmap, a product that exists because I needed it and couldn't find it.\n\nThe version out there right now does the core job. Camera identifies what's in the room, the system values it, and the financial side tells you whether your coverage is enough. It works because the hard part - the tedious item-by-item entry that stopped everyone before - is gone.\n\nI keep thinking about the fact that this is a complete product - brand, code, financial logic, go-to-market - built in ten weeks. That wasn't possible two years ago. I don't fully know what to do with that yet. But I know it changes what's possible for the next one.",
    },
  ],
};
