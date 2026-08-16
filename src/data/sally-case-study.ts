import type { CaseStudy } from "@/lib/types";

export const sallyCaseStudy: CaseStudy = {
  slug: "sally",
  title: "Sally Beauty Marketing OS",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "Sally Beauty's marketing and ecommerce brain, which I actively design, build, and maintain from inside the team. | It knows the brand, reads the market, the customers, and the results, and it has started proposing campaigns on its own.",
  field: "Marketing Technology\nAI Strategy\nEnterprise Tools",
  author: "Jeremy Prasatik",
  published: "2025",
  status: "In Production",
  classification: [
    "Product Management",
    "Product Design",
    "Engineering",
    "AI Strategy",
  ],
  services: [
    "Product Management",
    "Product Design",
    "Engineering (AI-assisted)",
    "AI Strategy",
    "Design System",
  ],
  stack: [
    "Claude Opus",
    "Gemini",
    "Perplexity Sonar Pro",
    "Python",
    "Next.js",
    "Supabase + pgvector",
    "Railway",
    "Vercel",
    "Claude Code",
  ],
  links: [],
  heroImage: "",
  style: "pressing",
  /* Built FOR an ecommerce retailer without being ecommerce
     design, so this reaches search without printing a claim the
     work does not support. See CaseStudy.keywords. */
  keywords: ["Ecommerce"],
  sections: [
    // ── META + ABSTRACT ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 5 frames",
        colors: ["#D2C6C7", "#C8C8C9", "#C18E7C", "#C08861", "#2C312F"],
        images: [
          "/case-studies/sally-os/heroes/sally-os-platform-hero.jpg",
          "/case-studies/sally-os/heroes/sally-os-brand-brain-hero.jpg",
          "/case-studies/sally-os/heroes/sally-os-asset-hub-hero.jpg",
          "/case-studies/sally-os/heroes/sally-os-asset-hub-detail.jpg",
          "/case-studies/sally-os/heroes/sally-os-utilities-marketplace-hero.jpg",
        ],
      },
      field: "Marketing Technology  AI Strategy  Enterprise Tools",
      author: "Jeremy Prasatik",
      published: "2025",
      status: "In Production",
      classification: [
        "Product Management",
        "Product Design",
        "Engineering",
        "AI Strategy",
      ],
      summary: [
        { label: "Built", value: "A portal with eight apps, an AI strategist with 21 tools, an asset hub, a store-associate site, a Figma plugin, and a scoreboard. Six deployed applications, still growing" },
        { label: "Scope", value: "Design and full-stack, brand to backend, in about four months, from inside the marketing team" },
        { label: "Stack", value: "Python and vanilla JS on Railway, Next.js apps on Vercel, Supabase with pgvector, five AI providers routed per task" },
        { label: "Angle", value: "It thinks on its own now. Live signals in, proposed campaigns out, and Approve creates real work." },
      ],
      title: "Sally Beauty\nMarketing OS",
      subtitle:
        "Sally Beauty's marketing and ecommerce brain, which I actively design, build, and maintain from inside the team. | It knows the brand, reads the market, the customers, and the results, and it has started proposing campaigns on its own.",
      abstract:
        "Retail marketing runs on cycles - seasonal plans, promotional calendars, campaign briefs, asset production, store execution. The cadence is relentless and the volume is high. Sally ships thousands of assets per month across digital, email, social, and physical stores, and that kind of output breaks when the infrastructure underneath it is stitched together from tools that don't share context.\n\nI rebuilt each piece with AI and connected them into a single pipeline. Competitive intelligence feeds strategy, strategy produces briefs, briefs connect to assets, assets flow to stores, and purchase data feeds back into the next cycle. One loop, signal to shelf and back again.\n\nFour months in, it is six deployed applications with a shared brain, and the loop has started closing itself: the system now reads the market and the customers on its own and proposes the campaigns.",
    },

        // ── HERO ──
    {
      id: "hero-1",
      type: "hero",
      image: "/case-studies/sally-os/heroes/sally-os-platform-hero.jpg",
      alt: "Sally Beauty Marketing OS, platform overview",
      pressing: { choreo: { rise: true } },
    },

    // ── PROBLEM STATEMENT - grouped in ECE6E1 container ──
    {
      id: "problem-image",
      type: "image",
      src: "/case-studies/sally-os/sally-os-dashboard-grid-overview.png",
      alt: "Sally Marketing OS, five connected platforms overview",
      bleedTop: true,
      noRadius: true,
      // The opening hero is still climbing when this arrives, so there is
      // nothing here for a rise to cross. Zoom is what the frame wants
      // anyway: five platform screens in one grid at 3048px native is a
      // contact sheet of the whole system, and every one of them is a smear
      // at plate size. Plate number follows the section mark it opens, the
      // same convention the Asset Hub zoom uses below.
      pressing: {
        plate: "02",
        captions: [
          "Marketing OS",
          "Dashboard grid overview",
          "Every app, one screen",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
      group: { name: "problem", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "problem-header",
      type: "section-header",
      label: "SECTION 02: PROBLEM STATEMENT",
      title: "Every piece of it lived",
      // The study's one crossing, in the BRIEF form (pin + crossing): this
      // header carries method columns, and PRESSING.md §7 reserves the
      // standalone staging for headers whose copy is short. Every header
      // in this study carries columns, so the choice was which beat, and
      // the opening diagnosis is the one everything below answers.
      pressing: {
        mark: { n: "02", name: "Five Problems" },
        heldLine: "somewhere different.",
        choreo: { pin: true, crossing: true },
      },
      group: { name: "problem" },
    },
    {
      id: "problem-text",
      type: "text",
      size: "subhead",
      content:
        "Competitive intel lived in someone's browser tabs, brand guidelines in a PDF nobody opened, campaign briefs in email threads, and assets on shared drives with names that drifted every quarter. None of those tools talked to each other, and the volume made every gap worse.",
      group: { name: "problem" },
    },
    {
      id: "problem-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The scale is thousands of SKUs across hair color, hair care, styling, and professional tools, 2,000+ stores with regional variation, and dozens of campaigns running at once across digital, email, social, and in-store.",
      group: { name: "problem" },
    },
    {
      id: "problem-columns",
      type: "three-column-text",
      columns: [
        {
          title: "Competitive Intel",
          content:
            "It was all manual. Someone tracked Ulta's promotions in a spreadsheet, someone else watched Sephora's social on their phone, and Target Beauty's pricing changes came up in meetings as anecdotes. The information was all there, spread across people and formats, and nobody had pulled it together.\n\nSo every planning cycle started from scratch. The same questions came up again, competitors kept surprising the team, and by the time an opportunity was clear it was too late to act on it.",
        },
        {
          title: "Campaign Briefs",
          content:
        "Campaign briefs were Word files. They went out to a distribution list, got edited in parallel, and within days nobody was sure which version was current. The brief that reached design rarely matched the one that left strategy.\n\nAssets got made against old direction, revisions piled up, and a lot of the production timeline went to getting everyone back on the same page.",
        },
        {
          title: "The Shared Drive",
          content:
        "Asset management meant shared drives. Thousands of images, organized by whoever uploaded them, named however that person remembered to name them, tagged inconsistently or not at all. Finding the right file for a channel meant knowing where someone had put it, and that knowledge left when they did.\n\nThe cost was hours: searching, recreating, reformatting, and double-checking files that should have been a click away.",
        },
      ],
      group: { name: "problem" },
    },

    // ── TRENDS FEED / INTELLIGENCE ──
    {
      id: "trends-portal-hero",
      type: "hero",
      image: "/case-studies/sally-os/sally-os-briefing-portal-fullscreen.png",
      alt: "Sally Marketing OS, intelligence feed and competitive dashboard",
      inline: true,
      pressing: { choreo: { rise: true } },
    },
    {
      id: "trends-header",
      type: "section-header",
      label: "SECTION 03: INTELLIGENCE / TRENDS FEED",
      title: "Three AI models watch",
      pressing: {
        mark: { n: "03", name: "Real-Time" },
        heldLine: "14 industry publications.",
        choreo: { pin: true },
      },
    },
    {
      id: "trends-text",
      type: "text",
      size: "subhead",
      content:
        "Competitor social channels, pricing shifts and category trends too. Every trend that comes in gets a \"Sally's Take\": an AI-written read that checks the signal against the brand positioning, the active briefs, and the internal knowledge base, and says whether it's worth acting on.",
    },
    {
      id: "trends-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each Take comes with a one-click path to a new brief. That click is where the rest of the pipeline starts.",
    },
    {
      id: "trends-engines",
      type: "three-column-text",
      columns: [
        {
          title: "Claude Opus: The Strategist",
          content:
            "Claude runs the chat and gets the reasoning jobs: turning competitive signals into recommendations, drafting the campaign brief from raw intel, writing copy in the brand voice.\n\nPrompt caching keeps it fast. The brand guidelines, tone rules, and competitive positioning are the same on every call, so they load from cache instead of being processed again each time.",
        },
        {
          title: "Gemini 2.5 Pro: The Librarian",
          content:
            "Gemini reads Sally's internal knowledge base on the first message, so every conversation opens with the brand guidelines, campaign history, product catalogs, regional variations, and performance data already loaded, before anyone has typed a word.\n\nIts million-token context window is what makes that possible. The whole institutional memory of the marketing team fits in a session, and nobody has to hunt through a shared drive or ask a colleague for the file.",
        },
        {
          title: "Perplexity Sonar Pro: The Researcher",
          content:
            "Live web search for competitive intelligence, trends, and current market data. It triggers on its own when a competitor comes up: mention Ulta, Sephora, or Target Beauty and it pulls current pricing, promotions, social activity, and press coverage into the conversation without a separate search.\n\nA question that used to mean a research request and a two-week turnaround gets answered in the same conversation where the strategy is being written.",
        },
      ],
    },
    {
      id: "trends-pair-1",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: "/case-studies/sally-os/sally-os-marketing-insight-dual-view.png",
        alt: "Sally Marketing OS, AI-generated competitive insights",
      },
      right: {
        src: "/case-studies/sally-os/sally-os-model-selection-dual-view.png",
        alt: "Sally Beauty, dark waves, professional color",
      },
    },
    {
      id: "trends-synthesis-headline",
      type: "editorial-headline",
      text: "A competitor launches something,\nand the feed writes\nSally's Take on it.",
    },
    {
      id: "trends-pair-2",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: "/case-studies/sally-os/sally-os-model-detail-dual-view.png",
        alt: "Sally Beauty, blonde curls, natural color",
      },
      right: {
        src: "/case-studies/sally-os/sally-os-social-trends-dashboard.png",
        alt: "Sally Marketing OS, social trend tracking dashboard",
      },
    },
    {
      id: "trends-heatmap",
      type: "ai-heatmap",
      competitors: [
        "Ulta Beauty",
        "Sephora",
        "Target Beauty",
        "Walmart Beauty",
        "Nordstrom Rack",
      ],
      categories: [
        "Pricing",
        "Promotions",
        "Products",
        "Social",
        "Merchandising",
        "Industry",
        "Emerging",
        "Editorial",
      ],
      data: [
        [0.9, 0.85, 0.8, 0.95, 0.7, 0.6, 0.5, 0.4],
        [0.7, 0.75, 0.9, 0.85, 0.8, 0.7, 0.65, 0.6],
        [0.85, 0.9, 0.6, 0.5, 0.75, 0.4, 0.3, 0.2],
        [0.8, 0.85, 0.5, 0.4, 0.7, 0.35, 0.25, 0.15],
        [0.4, 0.3, 0.45, 0.35, 0.5, 0.25, 0.2, 0.3],
      ],
    },

    // ── THE ARC, LIVE — AND IT STARTS HERE ──
    // It opens on this section's own screen: the feed, scanned, nine
    // cards deep. Everything above argues that the intelligence layer
    // reads the market; this is the reader watching it read, pick one
    // card, and carry it out of the section — Sally's Take against the
    // brand corpus, Brainstorm This into Jim, and on to a drafted
    // campaign play. It is the bridge out of 03, so it plays at the
    // end of 03 rather than three sections later where it was.
    // About 60 seconds, roughly twice the other demos.
    {
      id: "trends-to-jim-demo",
      type: "product-demo",
      demo: "trends-to-jim",
      title: "The full arc · Feed to briefed work",
      note: "The whole chain in one take: the feed flags a competitor's move, Sally's Take reads it against the brand corpus, and Brainstorm This hands it to Jim. Three moves later, one prompt drafts the campaign play: two finished billboards on real photography, a second model arguing against the claim, and Approve opens four channel requests.",
    },

    // ── BRAND BRAIN / JIM - grouped in ECE6E1 container ──
    // The section opens on its brief instead of its plate: the heatmap
    // above holds nothing, so a plate leading here would have had to sit
    // bare. The brief leads instead and its plate follows, climbing the
    // room the brief reserves for it (see brain-hero below).
    {
      id: "brain-header",
      type: "section-header",
      label: "SECTION 04: BRAND BRAIN / JIM",
      title: "It answers with the context\na new hire takes months to pick up.",
      pressing: {
        mark: { n: "04", name: "AI Strategy Partner" },
        choreo: { pin: true },
      },
      group: { name: "brand-brain" },
    },
    {
      id: "brain-text",
      type: "text",
      size: "subhead",
      content:
        "An AI system trained on Sally's complete brand architecture: voice guidelines, visual standards, competitive positioning, campaign history, performance data, and a rule set that shapes how it thinks before it responds. It knows the brand as well as the team does, which is what separates it from a chatbot.",
      group: { name: "brand-brain" },
    },
    {
      id: "brain-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Brand Brain ingests and indexes the whole corpus, market research included, and when a strategist asks a question the answer draws on the kind of context a new hire spends months picking up.",
      group: { name: "brand-brain" },
    },
    {
      id: "brain-engines",
      type: "three-column-text",
      columns: [
        {
          title: "Claude: Long-Form Writing",
          content:
            "The long documents come from Claude, the strategy memos and competitive analyses. It takes in the whole context (brand guidelines, performance history, competitive data) and writes something that reads like it came from someone who has worked on the brand for years.\n\nThat matters because these documents go to leadership. Output that needs heavy editing is worse than none.",
        },
        {
          title: "Gemini: The Visual Layer",
          content:
            "Gemini handles the visual side, the part a text-only model can't see: product imagery analysis, sorting social content into categories, clustering trends across competitor activity. When a competitor changes how it merchandises, Gemini picks up the pattern across store imagery.",
        },
        {
          title: "Perplexity: Live Data",
          content:
            "Perplexity is the live layer: industry news, competitor announcements, shifts in social sentiment, regulatory changes, pulled from the web as they happen.",
        },
      ],
      group: { name: "brand-brain" },
    },
    // Climbs the brief it was moved below. bleedTop is the classic
    // renderer's field for the top of the ECE6E1 container and is left
    // alone; pressing ignores groups and reads the choreo bag.
    {
      id: "brain-hero",
      type: "image",
      src: "/case-studies/sally-os/heroes/sally-os-brand-brain-hero.jpg",
      alt: "Brand Brain, AI strategy interface for Sally Beauty",
      aspect: "native",
      bleedTop: true,
      pressing: { choreo: { rise: true } },
      group: { name: "brand-brain", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "brain-chat-2up",
      type: "dual-image",
      native: true,
      transparent: true,
      group: { name: "brand-brain" },
      left: {
        src: "/case-studies/sally-os/sally-os-brand-brain-chat-dual-view.png",
        alt: "Brand Brain, conversational strategy with Jim",
      },
      right: {
        src: "/case-studies/sally-os/sally-os-model-chat-interface.png",
        alt: "Sally Beauty, teal braids, expressive color",
      },
    },
    // THE LIVE ONE, BESIDE THE STILLS IT ANIMATES. It used to trail the
    // whole section, four plates after the chat it belongs to. It sits
    // directly under the chat screens now: the reader meets the workflow
    // as a picture and then immediately watches it run, on the portal's
    // own extracted interface code, before the argument moves on to
    // briefs. Splitting the brand-brain group is free here — group is a
    // classic-renderer field and PressingLayout never reads it.
    {
      id: "brain-jim-demo",
      type: "product-demo",
      demo: "jim-chat",
      title: "Brand Brain · Jim",
      note: "A strategist pushes back on the tagline. Jim answers out of the brand corpus, works out which persona the objection belongs to, then generates the homepage card off the line it lands on.",
    },

    {
      id: "brain-brief-editorial",
      type: "editorial-headline",
      text: "The AI works out the strategy\nand writes the brief.\nThe team approves it.",
      group: { name: "brand-brain" },
    },
    {
      id: "brain-brief-2up",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: "/case-studies/sally-os/sally-os-brief-builder-dual-view.png",
        alt: "Brand Brain, AI-assisted campaign brief generation",
      },
      right: {
        src: "/case-studies/sally-os/sally-os-model-chat-response.png",
        alt: "Sally Beauty, purple curls, bold color expression",
      },
      group: { name: "brand-brain" },
    },

    // ── THE BRIEF BECOMES WORK, LIVE ──
    // Two chained demos, moved up from Utilities on 2026-08-15. The
    // plates above end on the brief builder; these pick up exactly there:
    // a request on the campaign board becomes a real email out of the
    // product's own components, and the email becomes four artboards in
    // Figma. They MUST stay in this order and adjacent - the first ends
    // on a toast reading "ready for the Figma build" (NOTES.md). Here
    // the Figma build lands near 40% of the page instead of 74%.
    {
      id: "brain-requests-demo",
      type: "product-demo",
      demo: "requests-email",
      title: "From brief to email",
      note: "Open the August board, take COLORfest's CRM channel, press Create Email. The email assembles out of the product's own component library, so what lands on screen is what an email developer receives.",
    },
    {
      id: "brain-figma-demo",
      type: "product-demo",
      demo: "figma-build",
      title: "From email to Figma",
      note: "One press builds all four emails. The plugin clones an artboard per request, places every image, writes that slot's copy behind it, and fills the headers last. Images go first because the plugin finds each section band by anchoring on the image rects, then walks the text nodes from there.",
    },

    // ── INTELLIGENCE PIPELINE SANKEY ──
    {
      id: "intelligence-flow",
      type: "intelligence-flow",
      stages: [
        {
          name: "Sources",
          items: ["14 Publications", "Social Channels", "Competitor Data"],
          value: 100,
        },
        {
          name: "AI Engines",
          items: ["Claude", "Gemini", "Perplexity"],
          value: 80,
        },
        {
          name: "Insights",
          items: ["Trends", "Threats", "Opportunities"],
          value: 60,
        },
        {
          name: "Briefs",
          items: ["Campaign", "Seasonal", "Reactive"],
          value: 40,
        },
        {
          name: "Assets",
          items: ["Digital", "Email", "Social", "In-Store"],
          value: 25,
        },
        {
          name: "Stores",
          items: ["2,000+ Locations"],
          value: 15,
        },
      ],
    },

    // ════════════════════════════════════════
    // SECTION 05 — IT THINKS ON ITS OWN
    // The part the study could not say until now. Every section above
    // describes a tool a person drives. This one describes what the
    // system does without being asked. Facts here come from the live
    // build (Plays, shipped 2026-07-22) and stay at the altitude the
    // rest of the study already uses: what the tool IS, never Sally's
    // data, competitors, or voice.
    // ════════════════════════════════════════
    {
      id: "thinks-header",
      type: "section-header",
      label: "SECTION 05: CAMPAIGNS",
      title: "It proposes",
      pressing: {
        mark: { n: "05", name: "It Proposes" },
        heldLine: "the work now",
      },
    },
    {
      id: "thinks-text",
      type: "text",
      size: "xl",
      content:
        "The newest app in the rail is called Campaigns, and nobody types into it. On a schedule, Jim reads four live feeds at once: the market scan, the daily signals, what customers are saying, and what people are searching for. He grounds all of it against the product catalog and the asset library, then proposes three to five plays. Each one names the signal that triggered it, argues the reasoning, and arrives with the campaign already drafted: billboard, email, and SMS, rendered with real photography and real SKUs.",
    },
    {
      id: "thinks-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The Approve button is the whole point. It does not save a suggestion somewhere; it writes real production requests into the same queue the humans use, one per channel, so a play the team likes becomes work in one click. Pass dismisses it with a reason and Jim learns from that too. A second model, given fresh context, critiques every play before a person sees it, and its verdict rides along with the proposal so a human decides. The first live scan proposed a competitive intercept, a seasonal demand play built on real search volume, and a play built around a customer's own words.",
    },
    {
      id: "thinks-editorial",
      type: "editorial-headline",
      text: "Four months ago\nthis was a spreadsheet\nand a group chat.",
    },

    // ── ASSET HUB ──
    // Same problem as Brand Brain above, answered a different way so the
    // two sections do not read as one recipe: the quote poster before
    // this holds nothing, so the establishing plate moves below the two
    // library views and climbs the PAIR instead of the brief.
    // Reordered 2026-08-15: Assets and Utilities now sit AFTER Campaigns,
    // so the study runs the way the loop runs (signal, strategy,
    // proposal, then the production and asset layer underneath), and the
    // most autonomous thing it does is not the last thing before the
    // closing. Assets and Utilities stay adjacent because the utilities
    // hero rises across the held Asset Hub zoom. Across the study that puts
    // each of the four things that can hold to work once: the cover, a
    // brief, a pinned pair, a zoom.
    {
      id: "asset-header",
      type: "section-header",
      label: "SECTION 06: ASSET HUB",
      title: "The DAM they had was bloated",
      pressing: {
        mark: { n: "06", name: "Digital Asset Management" },
        heldLine: "and nobody wanted to use it.",
        choreo: { pin: true },
      },
    },
    {
      id: "asset-text",
      type: "text",
      size: "subhead",
      content:
        "The two things the team actually needed from it, tagging and search, didn't work well, so I built this one from the ground up.",
    },
    {
      id: "asset-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "AI tags every image on upload, with nobody cataloging anything by hand, and search ranks across those tags, the titles, the brands, and the AI descriptions. The right asset comes up in seconds.",
    },
    {
      id: "asset-columns-1",
      type: "three-column-text",
      columns: [
        {
          title: "AI Auto-Tagging",
          content:
            "Claude looks at every uploaded image and returns a description, tags, product category, dominant colors, campaign suggestions, and a confidence score. It tells lifestyle shots from product shots, and any asset can be re-tagged with one click, on its own or in a batch.\n\nAI tags and manual tags are tracked separately, so there is a record of what it tagged and what a person corrected, and the corrections improve the next round of tagging.",
        },
        {
          title: "AI Studio Photography",
          content:
            "Two passes through OpenAI's GPT-Image-2. The first strips the background to pure white and leaves the product alone. The second lights it like a studio shot, working from a reference photograph: white cyclorama sweep with a warm-to-cool gradient, directional key light with specular highlights, fill, rim, contact shadow.\n\nThat is a studio rental, a lighting setup, and a photographer replaced by one button. The team uses it for product pages and social.",
        },
        {
          title: "Search Architecture",
          content:
            "Postgres full-text search with tsvector and websearch_to_tsquery, GIN indexes on the FTS column and the AI-tags JSONB. Relevance is weighted: full text at 2.0x, tag match at 1.5x, title at 1.0x, brand at 0.9x, AI description at 0.8x.\n\nSearch runs as you type with a 300ms debounce, infinite scroll at 24 per page, and an ILIKE fallback across every text field.",
        },
      ],
    },
    {
      id: "asset-detail-images",
      type: "dual-image",
      transparent: true,
      aspect: "aspect-square",
      left: {
        src: "/case-studies/sally-os/sally-os-model-asset-library.png",
        alt: "Asset Hub, AI tagging and metadata on model photography",
      },
      right: {
        src: "/case-studies/sally-os/sally-os-product-asset-library.png",
        alt: "Asset Hub, AI studio photography pipeline",
      },
      pressing: { choreo: { pin: true } },
    },
    {
      id: "asset-hero-image",
      type: "hero",
      image: "/case-studies/sally-os/heroes/sally-os-asset-hub-hero.jpg",
      alt: "Asset Hub, AI-powered digital asset management",
      inline: true,
      pressing: { choreo: { rise: true } },
    },
    {
      id: "asset-columns-2",
      type: "three-column-text",
      columns: [
        {
          title: "Vendor Upload Portal",
          content:
            "A public upload form with no login. The vendor enters name, email, company, product name, SKU, brand, asset type, and confirms usage rights. An admin review dashboard updates live over Supabase Realtime.\n\nApprove pushes the asset into the library and kicks off AI tagging. Reject sends the vendor a reason.",
        },
        {
          title: "Workflow & Collections",
          content:
            "Campaign templates with configurable stages, and jobs with a destination, priority, due date, and assignee. Review is per asset, so you can approve some and reject others in the same job, each with its own note. Status runs Draft, In Review, Approved, Sent, Completed.\n\nCollections have names, descriptions, and cover images. Batch-select from the library, drag to reorder, and toggle public or private with a shareable link that needs no login.",
        },
        {
          title: "Embedded Architecture",
          content:
            "It runs inside the portal in an iframe with its own sidebar stripped, syncing routes over postMessage, with search and filters passed through as URL params.\n\nOn upload it reads dimensions, DPI, and color space, writes a compressed JPEG for fast loading, and makes the ecommerce PNG at 1000x1500 or 1500x1000 on white. PDFs get a branded thumbnail.",
        },
      ],
    },
    {
      id: "asset-hub-alt",
      type: "image",
      src: "/case-studies/sally-os/heroes/sally-os-asset-hub-detail.jpg",
      alt: "Asset Hub, full interface overview with AI tagging and search",
      aspect: "native",
      // The zoom, and this study's only available hold. Every dual-image
      // here is followed by a chart, a quote or a column grid, none of
      // which can rise — so the climb below had to be built on a zoom.
      // A full interface overview also earns it: the tagging and search
      // controls are the content, and they are a blur at plate size.
      pressing: {
        plate: "05",
        captions: [
          "Asset Hub",
          "Full interface overview",
          "AI tagging and search",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── UTILITIES MARKETPLACE — climbs across the held Asset Hub zoom
    {
      id: "utilities-hero-image",
      type: "hero",
      image: "/case-studies/sally-os/heroes/sally-os-utilities-marketplace-hero.jpg",
      alt: "Utilities Marketplace, internal tools platform",
      inline: true,
      pressing: { choreo: { rise: true } },
    },
    {
      id: "utilities-header",
      type: "section-header",
      label: "SECTION 07: UTILITIES MARKETPLACE",
      title: "Ten apps, each one for a job",
      pressing: {
        mark: { n: "07", name: "A Growing Library of" },
        heldLine: "that used to take hours.",
        choreo: { pin: true },
      },
    },
    {
      id: "utilities-text",
      type: "text",
      size: "subhead",
      content:
        "All of them built inside the marketing team. Click a card and the tool loads inline, with no onboarding, no separate login, no IT ticket. The marketplace grows every month as the team finds the next thing worth automating.",
    },
    {
      id: "utilities-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each tool is its own app, hosted on its own and loaded in an iframe. The tool list is a JavaScript array, so registering a new one takes minutes, and a Streamlit app, a Next.js dashboard, and a static PDF generator all register the same way. It's designed so anyone on the team can build a tool, deploy it, and share it without engineering support.",
    },
    {
      id: "utilities-columns-1",
      type: "three-column-text",
      columns: [
        {
          title: "Shelf Talker Generator",
          content:
            "Upload the creative brief spreadsheet and download print-ready 9-up PDFs. It handles every Sally promotion format, Spanish and bilingual included, sets Founders Grotesk at the right weights, wraps text on real font metrics, and is pixel-accurate to the 3.667\" card. That used to be hours of InDesign layout every promo cycle.",
        },
        {
          title: "Campaign Performance Analyzer",
          content:
            "Upload the campaign data export and get dashboards back: ROAS, conversion funnels, channel attribution. Strategists pull their own numbers mid-cycle instead of waiting on the analytics team for a deck.",
        },
        {
          title: "Exec Deck Builder",
          content:
            "Builds the executive deck from the campaign brief: pulls the brand template, fills in the key metrics, exports a PPTX. Half a day of a designer's time, down to one click and three minutes.",
        },
      ],
    },
    // Breaks up what the portfolio audit flagged as three consecutive
    // three-column blocks, and earns the break rather than just taking it:
    // the columns list what each tool does, this shows one of them doing it.
    {
      id: "utilities-pdp-demo",
      type: "product-demo",
      demo: "pdp-studio",
      title: "Utilities · PDP Copy Studio",
      note: "Paste a product URL. The tool audits the live page, pulls search demand, looks for whitespace in the category that no competitor owns, and rewrites the copy against what it found. Then Gemini and Perplexity grade the rewrite in parallel, and neither one is shown Claude's reasoning.",
    },
    {
      id: "utilities-columns-2",
      type: "three-column-text",
      columns: [
        {
          title: "Image Compliance Scanner",
          content:
            "Scans creative against the brand guidelines before it ships: logo placement, color accuracy, fonts, legal disclaimers. The problems it catches used to turn up in legal review, weeks after production wrapped.",
        },
        {
          title: "Social Copy Generator",
          content:
            "Writes the social copy from the campaign brief in the brand voice, character-counted and formatted for Instagram, TikTok, Facebook, and X, hashtags included. It takes about a minute to turn one brief into four channels.",
        },
        {
          title: "SKU Lookup & Enrichment",
          content:
            "Paste a list of SKUs and get the product data back: images, descriptions, pricing, brand, category, ready to drop into a brief, a deck, or an email template. It pulls from Sally's product database, so the numbers are current and nobody is working off an old spreadsheet.",
        },
      ],
    },
    {
      id: "utilities-columns-3",
      type: "three-column-text",
      columns: [
        {
          title: "Email Template Previewer",
          content:
            "Upload HTML or pick from the template library and see how it renders in Gmail, Outlook, Apple Mail, and on mobile. It replaces the send-test-check-fix loop that used to add days to every email campaign.",
        },
        {
          title: "Promo Calendar Sync",
          content:
            "Import the promo calendars from Excel or Google Sheets and get one consolidated view back, with the conflicts flagged: overlapping promotions, channel collisions, regional scheduling gaps. It's the one place to check what's running where and when.",
        },
        {
          title: "Competitor Ad Tracker",
          content:
            "Captures competitor advertising across digital channels (display ads, promoted social posts, email campaigns) and files it into a searchable library. The team can look up what Ulta, Sephora, and Target ran last quarter without anyone taking screenshots.",
        },
      ],
    },

    // These two run in sequence and have to stay adjacent: the first ends on
    // "ready for the Figma build" and the second starts there. Split across
    // other sections they read as two tools; together they read as the
    // handoff, which is the thing that used to be a person.



    // ── CLOSING: BUILD + RESULT ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 08: CLOSING",
      title: "The team that needed it could not\nwait for a vendor evaluation.",
      pressing: { mark: { n: "08", name: "What Shipped" } },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "The tools exist now for one person to ship what used to take a department. Six applications, in daily use, and Sally's IT team is now moving them onto the company's own cloud.",
    },
    {
      id: "closing-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "I designed, engineered, and deployed every one of them, working alongside AI tools throughout, and I still maintain them from inside the team that uses them.",
    },
    {
      id: "closing-columns",
      type: "three-column-text",
      columns: [
        {
          title: "Inside the Team",
          content:
            "I use these workflows every day, so there was no requirements document to write and nobody to translate it. When something was slow I could see it and change it, and the time between spotting a problem and shipping the fix went from months to days.\n\nThe saving everyone expects is cost, but the bigger one is context: there is no spec to drift when the person who needs the tool is the one building it.",
        },
        {
          title: "AI as Engineering Partner",
          content:
            "Claude Code was my development environment for all of it. I describe what the thing should do, read the code it writes, test it against the team's real workflows, talk through what's off, and deploy.\n\nThe judgment calls are still mine. The data model depends on knowing how a marketing team actually works, and the architecture depends on knowing the problem. The AI handles the part that used to be slow: turning a clear description into working code.",
        },
        {
          title: "The Stack",
          content:
            "The portal is a single-page app in plain HTML and JavaScript, no framework and no build step, on a Python server, hosted on Railway. It is deliberately boring underneath so it can change fast on top.\n\nThe asset hub, the associate site, and the scoreboard are Next.js on Vercel. Supabase holds all of it, with pgvector for a single embedding index that covers documents, product photography, and video scenes at once, so one search runs across text and pictures.\n\nFive AI providers, each routed to what it is best at: Claude for reasoning, strategy, and copy; Gemini for embeddings and grounded research; Perplexity for live web search; OpenAI's GPT-Image-2 for studio photography; a vision model for video. There is no gateway. Each call site names its model, and the strategy lane and the copy lane run different Claude models on purpose.",
        },
      ],
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Product Management",
        "Product Design",
        "Engineering (AI-assisted)",
        "AI Strategy",
        "Design System",
      ],
      stack: [
        "Claude",
        "Gemini",
        "Perplexity",
        "OpenAI",
        "Python",
        "Next.js",
        "Supabase + pgvector",
        "Railway",
        "Vercel",
        "Claude Code",
      ],
      links: [],
      content:
        "Everything shares data, context, and a design language. A signal the scanner catches in the morning can be a proposed campaign by the afternoon and a production request by the end of the day, with the same brand voice and the same product data at every step, out to 2,000+ stores.\n\nThe marketing team ships thousands of assets a month through it. It runs every day, and it has started running some of itself. Nobody filed a procurement request or sat through a vendor demo to get it, and the people at Sally have a name for it now: the marketing and ecommerce brain.",
    },
  ],
};
