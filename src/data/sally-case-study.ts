import type { CaseStudy } from "@/lib/types";

export const sallyCaseStudy: CaseStudy = {
  slug: "sally",
  title: "Sally Beauty Marketing OS",
  subtitle:
    "Five connected platforms covering the full pipeline from competitive signal to store-level sale. Built internally using AI-assisted development.",
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
    "Next.js",
    "Supabase",
    "Vercel",
    "Python",
    "Streamlit",
    "Claude Code",
  ],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero-1",
      type: "hero",
      image: "/case-studies/sally-os/heroes/hero.jpg",
      alt: "Sally Beauty Marketing OS — platform overview",
    },

    // ── META + ABSTRACT ──
    {
      id: "meta",
      type: "meta",
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
      title: "Sally Beauty\nMarketing OS",
      subtitle:
        "Five connected platforms covering the full pipeline from competitive signal to store-level sale. Built internally using AI-assisted development.",
      abstract:
        "Retail marketing runs on cycles. Seasonal plans, promotional calendars, campaign briefs, asset production, store execution. The cadence is relentless and the volume is high. Sally ships thousands of assets per month across digital, email, social, and physical stores. That kind of output breaks when the infrastructure underneath it is stitched together from tools that don't share context.\n\nThis platform rebuilt each piece with AI integration and connected them into a single pipeline. Competitive intelligence feeds strategy. Strategy produces briefs. Briefs connect to assets. Assets flow to stores. Purchase data feeds back. Signal to shelf — one closed loop where market intelligence converts into store-level sales data that informs the next round of strategy.",
    },

    // ── PROBLEM STATEMENT — grouped in ECE6E1 container ──
    {
      id: "problem-image",
      type: "image",
      src: "/case-studies/sally-os/hero-grid.png",
      alt: "Sally Marketing OS — five connected platforms overview",
      bleedTop: true,
      noRadius: true,
      group: { name: "problem", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "problem-header",
      type: "section-header",
      label: "SECTION 02: PROBLEM STATEMENT",
      title: "Scattered Tools,\nNo Shared Context",
      group: { name: "problem" },
    },
    {
      id: "problem-text",
      type: "text",
      size: "subhead",
      content:
        "Marketing infrastructure held together by habit. Competitive intel lived in someone's browser tabs. Brand guidelines lived in a PDF no one opened. Campaign briefs lived in email threads. Asset production lived in shared drives with naming conventions that drifted quarterly.",
      group: { name: "problem" },
    },
    {
      id: "problem-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The volume problem compounds the context problem. Thousands of SKUs across hair color, hair care, styling, and professional tools. Hundreds of stores with regional variation. Dozens of campaigns running simultaneously across digital, email, social, and in-store channels. Every disconnected tool multiplies the coordination cost.",
      group: { name: "problem" },
    },
    {
      id: "problem-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Intelligence Gap",
          content:
            "Competitive intelligence was manual. Someone tracked Ulta's promotions in a spreadsheet. Someone else monitored Sephora's social presence on their phone. Target Beauty's pricing changes surfaced anecdotally in meetings. The data existed — scattered across individuals, formats, and time zones — but never consolidated into anything actionable.\n\nWithout a shared intelligence layer, strategy meetings started from scratch every cycle. The same questions repeated. The same competitors surprised. The same opportunities surfaced too late to act on.",
        },
        {
          title: "The Briefing Bottleneck",
          content:
            "Campaign briefs were documents. Word files emailed to distribution lists, edited in parallel, version-confused within days. The brief that reached the design team rarely matched the brief that left strategy. Context degraded at every handoff.\n\nThe result: assets produced against outdated direction. Revisions that should have been unnecessary. Production timelines consumed by alignment work instead of creative work. The brief wasn't just a document problem — it was the single point of failure in the entire production pipeline.",
        },
        {
          title: "The Asset Sprawl",
          content:
            "Digital asset management meant shared drives. Thousands of images organized by whoever uploaded them, named by whatever convention they remembered, tagged inconsistently or not at all. Finding the right asset for the right channel in the right format required institutional memory that walked out the door with every departure.\n\nThe cost wasn't visible on any line item. It showed up as time — hours spent searching, recreating, reformatting, and verifying assets that should have been immediately accessible.",
        },
      ],
      group: { name: "problem" },
    },

    // ── TRENDS FEED / INTELLIGENCE ──
    {
      id: "trends-portal-hero",
      type: "hero",
      image: "/case-studies/sally-os/briefing-portal-production.up.railway.app_(4k) (1) 1.png",
      alt: "Sally Marketing OS — intelligence feed and competitive dashboard",
      inline: true,
    },
    {
      id: "trends-header",
      type: "section-header",
      label: "SECTION 03: INTELLIGENCE / TRENDS FEED",
      title: "Real-Time\nCompetitive Intelligence",
    },
    {
      id: "trends-text",
      type: "text",
      size: "subhead",
      content:
        "A triple-engine AI architecture monitors 14 industry publications, competitor social channels, pricing movements, and emerging category trends. But raw signals aren't useful — what matters is what they mean for Sally. Every trend gets a \"Sally's Take\" — an AI-generated analysis that cross-references the signal against Sally's internal knowledge base, active campaign briefs, and brand positioning to surface what's actually actionable.",
    },
    {
      id: "trends-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The workflow closes the gap between seeing a trend and acting on it. A competitor launches a new campaign — the system detects it, generates Sally's strategic response based on existing briefs and brand guidelines, and offers a one-click path to create a new brief. Intelligence feeds strategy. Strategy produces briefs. Briefs flow into asset production. The entire pipeline from market signal to store-level execution starts here.\n\nThree AI models run in parallel to make this work. Claude handles strategy and copywriting with prompt-cached brand context. Gemini scans Sally's full knowledge base on every interaction. Perplexity pulls live competitive data from the web. Each engine contributes a different lens — the combined output is richer than any single model produces alone.",
    },
    {
      id: "trends-engines",
      type: "three-column-text",
      columns: [
        {
          title: "Claude Opus — The Strategist",
          content:
            "Powers the conversational layer, brief generation, and long-form copywriting. Claude handles the complex reasoning tasks — synthesizing competitive signals into strategic recommendations, generating campaign briefs from raw intelligence, and drafting copy that aligns with brand voice.\n\nPrompt caching keeps the experience fast. Repeated context — brand guidelines, tone rules, competitive positioning — loads instantly rather than re-processing on every interaction. The result is a strategist that remembers everything and responds in seconds.",
        },
        {
          title: "Gemini 2.5 Pro — The Librarian",
          content:
            "Scans Sally's internal knowledge base on first message. Every conversation starts with full context — brand guidelines, campaign history, product catalogs, regional variations, and performance data pulled automatically before the user types a word.\n\nGemini's million-token context window makes this possible. The entire institutional memory of the marketing organization is available in every session. No more hunting through shared drives or asking colleagues for files that should have been findable.",
        },
        {
          title: "Perplexity Sonar Pro — The Researcher",
          content:
            "Live web search for competitive intelligence, emerging trends, and current market data. Auto-triggers on competitor questions — mention Ulta, Sephora, or Target Beauty and the system pulls real-time pricing, promotions, social activity, and press coverage without a separate search.\n\nThe research layer turns every strategist into an analyst. Questions that used to require a dedicated research request and a two-week turnaround now resolve in the same conversation where the strategy is being built.",
        },
      ],
    },
    {
      id: "trends-pair-1",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: "/case-studies/sally-os/marketing-insight-2up.png",
        alt: "Sally Marketing OS — AI-generated competitive insights",
      },
      right: {
        src: "/case-studies/sally-os/model-2up.png",
        alt: "Sally Beauty — dark waves, professional color",
      },
    },
    {
      id: "trends-synthesis-headline",
      type: "editorial-headline",
      text: "Brand synthesis.\nAI brand analysis on relevant\nnews items.",
    },
    {
      id: "trends-pair-2",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: "/case-studies/sally-os/model2-2up.png",
        alt: "Sally Beauty — blonde curls, natural color",
      },
      right: {
        src: "/case-studies/sally-os/social-trends.png",
        alt: "Sally Marketing OS — social trend tracking dashboard",
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

    // ── BRAND BRAIN / JIM — grouped in ECE6E1 container ──
    {
      id: "brain-hero",
      type: "image",
      src: "/case-studies/sally-os/heroes/brand-brain-hero.jpg",
      alt: "Brand Brain — AI strategy interface for Sally Beauty",
      aspect: "native",
      bleedTop: true,
      group: { name: "brand-brain", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "brain-header",
      type: "section-header",
      label: "SECTION 04: BRAND BRAIN / JIM",
      title: "AI Strategy Partner",
      group: { name: "brand-brain" },
    },
    {
      id: "brain-text",
      type: "text",
      size: "subhead",
      content:
        "An AI system trained on Sally's complete brand architecture — voice guidelines, visual standards, competitive positioning, campaign history, and performance data. Not a chatbot. A strategy partner that knows the brand as well as the team does.",
      group: { name: "brand-brain" },
    },
    {
      id: "brain-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Brand Brain ingests and indexes the full corpus of brand documentation, past campaign performance, competitive intelligence, and market research. When a strategist asks a question, the response draws from institutional knowledge that would take a new hire months to accumulate.",
      group: { name: "brand-brain" },
    },
    {
      id: "brain-engines",
      type: "three-column-text",
      columns: [
        {
          title: "Claude — Deep Analysis",
          content:
            "Handles the heavy reasoning. Long-form strategy documents, competitive analysis synthesis, campaign brief generation. Claude processes the full context window — brand guidelines, performance history, competitive data — and produces output that reads like it came from someone who's worked on the brand for years.\n\nThe writing quality matters. Strategy documents circulate to leadership. The AI output needs to match the rigor and tone of senior strategic thinking, not generate filler that requires heavy editing.",
        },
        {
          title: "Gemini — Pattern Recognition",
          content:
            "Processes visual and structural patterns across large datasets. Product imagery analysis, social content categorization, trend clustering across competitor activity. Gemini's multimodal capabilities handle the visual intelligence layer that text-only models miss.\n\nWhen a competitor launches a new merchandising approach, Gemini identifies the pattern across store imagery before it surfaces in trade press. Visual intelligence at the speed the market moves.",
        },
        {
          title: "Perplexity Sonar Pro — Live Intelligence",
          content:
            "Real-time web monitoring. Industry news, competitor announcements, social sentiment shifts, regulatory changes. Sonar Pro provides the live data layer — what's happening right now, not what happened last quarter.\n\nThe freshness advantage compounds. When competitive intelligence arrives hours instead of weeks after a market event, the strategic response window opens wide enough to actually use.",
        },
      ],
      group: { name: "brand-brain" },
    },
    {
      id: "brain-chat-2up",
      type: "dual-image",
      native: true,
      transparent: true,
      group: { name: "brand-brain" },
      left: {
        src: "/case-studies/sally-os/chat-2up.png",
        alt: "Brand Brain — conversational strategy with Jim",
      },
      right: {
        src: "/case-studies/sally-os/model-2up-chat.png",
        alt: "Sally Beauty — teal braids, expressive color",
      },
    },
    {
      id: "brain-brief-editorial",
      type: "editorial-headline",
      text: "The brief is the product.\nEverything downstream\ndepends on it.",
      group: { name: "brand-brain" },
    },
    {
      id: "brain-brief-2up",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: "/case-studies/sally-os/brief-2up.png",
        alt: "Brand Brain — AI-assisted campaign brief generation",
      },
      right: {
        src: "/case-studies/sally-os/model-2up-chat2.png",
        alt: "Sally Beauty — purple curls, bold color expression",
      },
      group: { name: "brand-brain" },
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
          items: ["3,000+ Locations"],
          value: 15,
        },
      ],
    },

    // ── ASSET HUB ──
    {
      id: "asset-hero-image",
      type: "hero",
      image: "/case-studies/sally-os/heroes/asset-hub-hero.jpg",
      alt: "Asset Hub — AI-powered digital asset management",
      inline: true,
    },
    {
      id: "asset-header",
      type: "section-header",
      label: "SECTION 05: ASSET HUB",
      title: "Digital Asset Management\nRebuilt with AI",
    },
    {
      id: "asset-text",
      type: "text",
      size: "subhead",
      content:
        "Sally had a DAM. It was bloated, slow, and nobody wanted to use it. The two things the team actually needed — tagging and search — didn't work well. This one was built from the ground up.",
    },
    {
      id: "asset-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Every image gets analyzed by AI on upload. Description, tags, product category, dominant colors, confidence scoring. No manual cataloging. Search runs against weighted relevance across tags, titles, brands, and AI descriptions so the right asset surfaces in seconds, not minutes of scrolling.",
    },
    {
      id: "asset-columns-1",
      type: "three-column-text",
      columns: [
        {
          title: "AI Auto-Tagging",
          content:
            "Claude Vision analyzes every uploaded image automatically. Returns description, tags, product category, dominant colors, campaign suggestions, and confidence score. Lifestyle vs. product shot detection. One-click re-tag on any asset, batch re-tag across selections.\n\nAI-generated vs. manual tags tracked separately. The system knows what it tagged and what a human corrected — and the corrections improve future tagging accuracy.",
        },
        {
          title: "AI Studio Photography",
          content:
            "Two-pass generation pipeline using Gemini. Pass one: background removal to pure white, product untouched. Pass two: professional studio lighting applied from a reference photograph. Clean white cyclorama sweep with warm-to-cool gradient, directional key light with specular highlights, fill light, rim light, contact shadow.\n\nOne button replaces a studio rental, lighting setup, and photographer. The team uses it regularly for product pages and social.",
        },
        {
          title: "Search Architecture",
          content:
            "PostgreSQL full-text search with tsvector and websearch_to_tsquery. GIN indexes on FTS column and AI tags JSONB. Weighted relevance ranking: full-text at 2.0x, tag match at 1.5x, title at 1.0x, brand at 0.9x, AI description at 0.8x.\n\nReal-time search with 300ms debounce, infinite scroll at 24 per page. ILIKE fallback across all text fields. The right asset surfaces in seconds.",
        },
      ],
    },
    {
      id: "asset-detail-images",
      type: "dual-image",
      transparent: true,
      aspect: "aspect-square",
      left: {
        src: "/case-studies/sally-os/model-asset.png",
        alt: "Asset Hub — AI tagging and metadata on model photography",
      },
      right: {
        src: "/case-studies/sally-os/product-asset.png",
        alt: "Asset Hub — AI studio photography pipeline",
      },
    },
    {
      id: "asset-columns-2",
      type: "three-column-text",
      columns: [
        {
          title: "Vendor Upload Portal",
          content:
            "Public-facing upload form, no login required. Vendor enters name, email, company, product name, SKU, brand, asset type, and usage rights confirmation. Admin review dashboard with real-time updates via Supabase Realtime.\n\nApprove pushes the asset to the library and triggers AI tagging automatically. Reject sends a reason back to the vendor. No email chains. No shared drives. No version confusion.",
        },
        {
          title: "Workflow & Collections",
          content:
            "Custom campaign templates with configurable stages. Jobs with destination, priority, due date, and assignee. Per-asset review — approve some, reject others within the same job with individual notes. Status flow: Draft, In Review, Approved, Sent, Completed.\n\nNamed collections with descriptions and cover images. Batch select from the library, reorder via drag and sort. Public/private toggle with shareable links, no auth required.",
        },
        {
          title: "Embedded Architecture",
          content:
            "Runs inside the portal via iframe with its own sidebar stripped. Cross-frame messaging via postMessage for route sync. Search and filters pass through as URL params.\n\nSmart image processing on upload: auto-extract dimensions, DPI, color space. Generate compressed JPEG variant for fast loading. Generate ecommerce PNG at 1000x1500 or 1500x1000 with white background. PDF handling with branded thumbnail generation.",
        },
      ],
    },
    {
      id: "asset-hub-alt",
      type: "image",
      src: "/case-studies/sally-os/heroes/asset-hub.jpg",
      alt: "Asset Hub — full interface overview with AI tagging and search",
      aspect: "native",
    },

    // ── UTILITIES MARKETPLACE ──
    {
      id: "utilities-hero-image",
      type: "hero",
      image: "/case-studies/sally-os/heroes/utilities-marketplace.jpg",
      alt: "Utilities Marketplace — internal tools platform",
      inline: true,
    },
    {
      id: "utilities-header",
      type: "section-header",
      label: "SECTION 06: UTILITIES MARKETPLACE",
      title: "A Growing Library of\nInternal Tools",
    },
    {
      id: "utilities-text",
      type: "text",
      size: "subhead",
      content:
        "Ten specialized apps built by the marketing team, for the marketing team. Each one eliminates a manual process that used to take hours. Click a card, the tool loads inline — no onboarding, no separate login, no IT ticket. The marketplace grows every month as the team identifies new bottlenecks worth automating.",
    },
    {
      id: "utilities-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The architecture is deliberately simple. Each tool is a standalone app hosted independently, loaded via iframe. Registering a new one takes minutes — the tool list is a JavaScript array. A Streamlit app, a Next.js dashboard, a static PDF generator — they all register the same way. The platform doesn't care what the tool is built with. It cares that the tool works. Designed so anyone on the team can build, deploy, and share a tool without engineering support.",
    },
    {
      id: "utilities-columns-1",
      type: "three-column-text",
      columns: [
        {
          title: "Shelf Talker Generator",
          content:
            "Upload a creative brief spreadsheet, download print-ready 9-up PDFs. Handles every Sally promotion format including Spanish and bilingual variants. Applies Founders Grotesk at correct weights, wraps text using real font metrics — pixel-accurate to the 3.667\" card width. Replaces hours of manual InDesign layout per promo cycle.",
        },
        {
          title: "Campaign Performance Analyzer",
          content:
            "Upload campaign data exports and get instant visual dashboards — ROAS, conversion funnels, channel attribution breakdowns. No more waiting for the analytics team to build a deck. Strategists pull their own performance data mid-cycle and adjust spend in real time.",
        },
        {
          title: "Exec Deck Builder",
          content:
            "Auto-generates executive presentations from campaign briefs. Pulls brand templates, populates key metrics, and exports polished PPTX files. A process that used to take a designer half a day now takes three minutes and a single click.",
        },
      ],
    },
    {
      id: "utilities-columns-2",
      type: "three-column-text",
      columns: [
        {
          title: "Image Compliance Scanner",
          content:
            "Scan creative assets against brand guidelines before they ship. Checks logo placement, color accuracy, font usage, and legal disclaimer requirements. Catches compliance issues that used to surface in legal review — weeks after production was complete.",
        },
        {
          title: "Social Copy Generator",
          content:
            "Generate platform-optimized social media copy from campaign briefs. Outputs character-counted posts for Instagram, TikTok, Facebook, and X. Matches brand voice, includes hashtag strategy, and formats for each platform's requirements. One brief, four channels, sixty seconds.",
        },
        {
          title: "SKU Lookup & Enrichment",
          content:
            "Paste a list of SKUs and get enriched product data — images, descriptions, pricing, brand, and category — ready to drop into briefs, decks, or email templates. Pulls from Sally's product database so the team always works with current information instead of outdated spreadsheets.",
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
            "Preview email templates across clients and devices. Upload HTML or select from the template library and see pixel-perfect renders in Gmail, Outlook, Apple Mail, and mobile. Eliminates the send-test-check-fix loop that adds days to every email campaign.",
        },
        {
          title: "Promo Calendar Sync",
          content:
            "Import promotional calendars from Excel or Google Sheets and export consolidated views with conflict detection. Flags overlapping promotions, channel collisions, and regional scheduling gaps. The single source of truth for what's running where and when.",
        },
        {
          title: "Competitor Ad Tracker",
          content:
            "Track and archive competitor advertising across digital channels. Auto-captures display ads, social promoted posts, and email campaigns. Builds a searchable library of competitive creative — so the team can see what Ulta, Sephora, and Target ran last quarter without manual screenshots.",
        },
      ],
    },



    // ── CLOSING: BUILD + RESULT ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 08: CLOSING",
      title: "In Production\nFive Platforms Live",
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Five platforms. One builder. Built because the team that needed it couldn't wait for a vendor evaluation cycle. Shipped because AI-assisted development made it possible for one person to build what used to require a department.",
    },
    {
      id: "closing-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Every platform in the OS was designed, engineered, and deployed by a single product leader working alongside AI tools. The same person who defined the strategy wrote the code that implemented it. All five platforms are in daily production use across the Sally Beauty marketing organization.",
    },
    {
      id: "closing-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Velocity Argument",
          content:
            "Traditional enterprise tool development follows a predictable arc. Requirements gathering. Vendor evaluation. Procurement. Implementation. Training. Iteration cycles measured in quarters. The Sally Marketing OS took a different path.\n\nOne person with deep product understanding and AI-assisted development tools built what would traditionally require a cross-functional team and a six-figure vendor contract. The feedback loop between identifying a workflow problem and deploying a solution collapsed from months to days.\n\nThis isn't a cost argument. It's a context argument. The person building the tools is the person who understands the workflows. No requirements translation. No specification drift. No handoff gap between what was asked for and what got built.",
        },
        {
          title: "AI as Engineering Partner",
          content:
            "Claude Code served as the primary development environment. The workflow: describe the intended system behavior in precise terms. Review the generated architecture. Test against real marketing workflows. Refine through conversation. Deploy.\n\nThe AI doesn't replace engineering judgment. It amplifies it. Architectural decisions still require deep understanding of the problem space. Data model design still requires knowing how marketing teams actually work. The AI handles the implementation velocity — the translation from clear intention to working code.\n\nThe result: enterprise-grade tools built at startup speed, by someone who knows exactly what the tools need to do because they're the one who needs them.",
        },
        {
          title: "The Stack",
          content:
            "Next.js provides the application framework — server-side rendering, API routes, and the component architecture that makes a five-platform system feel like one coherent product.\n\nSupabase handles data persistence, authentication, and real-time subscriptions. When a competitive insight surfaces in the Trends Feed, it's immediately available in Brand Brain without polling.\n\nVercel deploys everything. Preview deployments for stakeholder review. Production deployments with zero-downtime updates.\n\nPython and Streamlit power the data processing pipeline. The AI orchestration layer — routing tasks to Claude, Gemini, or Perplexity based on task type — runs as a Python service.",
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
        "Claude Opus",
        "Gemini",
        "Perplexity Sonar Pro",
        "Next.js",
        "Supabase",
        "Vercel",
        "Python",
        "Streamlit",
        "Claude Code",
      ],
      links: [],
      content:
        "The platform proves a thesis: enterprise marketing tools don't need to be enterprise software projects. They need someone who understands the workflow deeply enough to design the system, and AI tools capable enough to help build it at production quality.\n\nThe five platforms share data, share context, and share a design language. A competitive insight captured in the Trends Feed flows through Brand Brain's strategic analysis, into a campaign brief, through asset production, and out to 3,000+ stores. No re-entry. No context loss. No version confusion.\n\nThe gap between a product vision and a production system has narrowed to the point where the person with the vision can build the system. Not a prototype. Not a proof of concept. A production platform used daily by a marketing organization that ships thousands of assets per month.",
    },
  ],
};
