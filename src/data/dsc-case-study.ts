import type { CaseStudy } from "@/lib/types";

export const dscCaseStudy: CaseStudy = {
  slug: "dsc",
  title: "Dallas Sport Collective",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "A marketing site, booking platform, and MCP server for Dallas Sport Collective, a six-trainer gym in North Texas. | A gym with a schedule you can talk to.",
  field: "AI Scheduling\nMCP Integration\nBrand & Web",
  author: "Jeremy Prasatik",
  published: "2025",
  status: "Live  Two locations",
  classification: [
    "Web Design",
    "Product Design",
    "AI Integration",
    "Full-Stack Engineering",
  ],
  services: [
    "Web Design",
    "Product Design",
    "AI Integration",
    "Full-Stack Engineering",
  ],
  stack: ["Next.js", "Vercel", "Model Context Protocol", "OAuth 2.0", "Claude + ChatGPT"],
  links: [
    { label: "dsportcollective.com", url: "https://dsportcollective.com" },
    { label: "App walkthrough", url: "https://dsc-gym.vercel.app/showcase" },
  ],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META + ABSTRACT ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 8 frames",
        colors: ["#000000", "#141414", "#8E8E8E", "#E6E6E6", "#FFFFFF"],
        images: [
          "/case-studies/dsc/dsc-marketing-site-laptop-hero.jpg",
          "/case-studies/dsc/dsc-athlete-app-login-screen.jpg",
          "/case-studies/dsc/dsc-athlete-app-registration-form.jpg",
          "/case-studies/dsc/dsc-ai-scheduler-phone-hero.jpg",
          "/case-studies/dsc/dsc-athlete-app-connect-mcp-server.jpg",
          "/case-studies/dsc/dsc-claude-oauth-consent-screen.jpg",
          "/case-studies/dsc/dsc-claude-mcp-chat-trainers.jpg",
          "/case-studies/dsc/dsc-claude-mcp-chat-trainer-availability.jpg",
        ],
      },
      field: "AI Scheduling  MCP Integration  Brand & Web",
      author: "Jeremy Prasatik",
      published: "2025",
      status: "Live  Two locations",
      classification: [
        "Web Design",
        "Product Design",
        "AI Integration",
        "Full-Stack Engineering",
      ],
      summary: [
        { label: "Built", value: "Marketing site, scheduling platform, MCP server (11 tools)" },
        { label: "Scope", value: "Design and full-stack, brand to backend" },
        { label: "Stack", value: "Next.js on Vercel, MCP, OAuth 2.0" },
        { label: "Angle", value: "Enterprise plumbing at gym scale. The AI only ever asks, and one deterministic engine makes every booking." },
      ],
      title: "Dallas Sport\nCollective",
      subtitle:
        "A marketing site, booking platform, and MCP server for Dallas Sport Collective, a six-trainer gym in North Texas. | A gym with a schedule you can talk to.",
      abstract:
        "Dallas Sport Collective grew from a handful of athletes to more than a hundred, and the schedule underneath it all was a pile of texts, handwritten notes, emails, and a Google Sheet nobody fully trusted. The founder needed two things at once: a brand that matched where the gym was headed, and a back office that could keep up. Six trainers, eleven programs from NFL Combine prep to prenatal fitness, open seven days a week, out of Celina and McKinney, Texas, with a Frisco headquarters on the way.\n\nI worked with DSC to design and build a marketing site that sells the room: black and white, big condensed type, photography of actual members training. A scheduling platform with two faces: an athlete app for booking sessions and an owner console for saying a week of scheduling out loud and approving each request with one tap. And the part I find the most fun: an MCP server with eleven tools, so athletes can paste one URL into the AI they already use, Claude, ChatGPT or Gemini, and ask it what's on their schedule, which trainer fits a goal, or to book Friday at 10am.\n\nEvery booking, whether spoken out loud, requested by an athlete's connected AI, or made with a tap on the calendar, flows through one deterministic engine that checks trainer availability, double-bookings, floor capacity, allowed durations, and cancellation rules. The AI only ever asks. Next.js on Vercel, OAuth 2.0 consent with short-lived tokens, live at two locations.",
    },

        // ── HERO ──
    {
      id: "hero-1",
      type: "hero",
      image: "/case-studies/dsc/dsc-marketing-site-laptop-hero.jpg",
      alt: "The Dallas Sport Collective marketing site open on a laptop, on concrete",
      pressing: { choreo: { rise: true } },
    },

    {
      id: "intro-editorial",
      type: "editorial-headline",
      text: "Enterprise plumbing\nfor a gym with six trainers",
    },

    // ════════════════════════════════════════
    // 1. GETTING IN - the organizing first step
    // ════════════════════════════════════════
    {
      id: "signup-header",
      type: "section-header",
      label: "SECTION 02: GETTING IN",
      title: "Join the",
      pressing: {
        mark: { n: "02", name: "Join the" },
        heldLine: "Collective",
        // Held while the column travels. Nothing in the study works until
        // everyone is in the system, so the headline saying so stays put
        // through the copy that explains it.
        choreo: { pin: true },
      },
    },
    {
      id: "signup-text",
      type: "text",
      size: "xl",
      content:
        "None of the scheduling works until everyone is in the system. So the first build was the front door: athletes create their own accounts, sign the waiver on the way in, and the owner assigns each new member to a trainer before anyone books a session.",
    },
    {
      id: "signup-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Athlete login and registration. A hundred-plus people moving off text threads and a spreadsheet and onto one roster the software can work with.",
    },
    {
      id: "signup-images",
      type: "dual-image",
      native: true,
      left: { src: "/case-studies/dsc/dsc-athlete-app-login-screen.jpg", alt: "DSC athlete login screen, Unlock Your Peak" },
      right: { src: "/case-studies/dsc/dsc-athlete-app-registration-form.jpg", alt: "DSC registration form, Join the Collective" },
      // Held so the scheduler climbs across the two screens an athlete
      // signs up on. Sign-up first, then the thing they signed up for.
      pressing: {
        captions: ["Login\nUnlock Your Peak", "Registration"],
        choreo: { pin: true },
      },
    },

    // ── HERO - AI divider — climbs across the held sign-up pair ──
    {
      id: "hero-ai",
      type: "hero",
      image: "/case-studies/dsc/dsc-ai-scheduler-phone-hero.jpg",
      alt: "The DSC scheduler open on a phone, resting on concrete",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // 2. SCHEDULING BY CHAT - the MCP marquee
    // ════════════════════════════════════════
    {
      id: "mcp-header",
      type: "section-header",
      label: "SECTION 03: SCHEDULING BY CHAT",
      title: "Book a session",
      // The study's one crossing. Of everything here, a gym a trainer can
      // book from inside a chat window is the claim nobody else is making,
      // so the gesture marks it.
      //
      // No zoom plate: every capture in this study is 2000px native or
      // less, well under the working floor for a plate that fills the mat.
      // The climbs below carry the choreography instead.
      pressing: {
        mark: { n: "03", name: "From your AI" },
        heldLine: "from your own AI.",
        choreo: { crossing: true },
      },
    },
    {
      id: "mcp-text",
      type: "text",
      size: "xl",
      content:
        "An athlete never has to open the app. They ask whichever AI they already use, and it reads their real schedule and can put in a session request.",
    },
    {
      id: "mcp-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Eleven tools cover the gym overview, the program list, trainer profiles and availability, the athlete's own sessions and pending requests, slot suggestions, booking requests, and cancellations. Reads come back instantly, and a write only ever creates a pending request the owner has to approve. Connecting runs through an OAuth consent screen with short-lived, rotating tokens, and access revokes from the dashboard in one tap.",
    },
    {
      id: "mcp-masonry",
      type: "masonry",
      images: [
        { src: "/case-studies/dsc/dsc-athlete-app-connect-mcp-server.jpg", alt: "DSC in-app connect screen with the MCP server URL and live connection status" },
        { src: "/case-studies/dsc/dsc-claude-oauth-consent-screen.jpg", alt: "OAuth consent screen, Claude wants to connect, listing granted permissions" },
        { src: "/case-studies/dsc/dsc-claude-mcp-chat-trainers.jpg", alt: "Claude listing every DSC trainer and their specialties through the connected tools" },
        { src: "/case-studies/dsc/dsc-claude-mcp-chat-trainer-availability.jpg", alt: "Claude listing Scott's real availability for the week through the DSC tools" },
        { src: "/case-studies/dsc/dsc-claude-mcp-chat-booking-request.jpg", alt: "Claude confirming a booking request, pending the trainer's approval" },
      ],
    },
    // ── THE SAME SESSION, MOVING ──
    // The stills above are captures from one real Claude.ai session on
    // 2026-06-13; this replays that session, word for word, and then
    // follows the request through to the owner's console, which the
    // stills cannot show. It sits after the captures and before the
    // diagram: watch it happen, then see how it is wired. Framed, not
    // ported, for the reasons product-demo's type comment gives; the
    // files are public/lab/dsc-demos/ and NOTES.md there says what is
    // verbatim and what is composed (the athlete's chat surface is
    // neutral on purpose, because the real one was Claude's UI).
    {
      id: "mcp-demo",
      type: "product-demo",
      folder: "dsc-demos",
      demo: "athlete-mcp-loop",
      stageWidth: 400,
      title: "Athlete · Booking by AI",
      note: "A real exchange, replayed. The athlete asks their AI for Scott's openings, it reads the gym's live schedule through the MCP tools and puts in a request, and the request shows up on the owner's console as a card. One tap approves it. The chat surface is neutral on purpose; the console is the product's own interface code.",
    },
    {
      id: "mcp-architecture",
      type: "mcp-architecture",
    },
    {
      id: "mcp-editorial",
      type: "editorial-headline",
      text: "The athlete asks their AI\nthe AI asks the gym\nthe gym answers",
    },

    // ════════════════════════════════════════
    // 3. THE ATHLETE APP - what the user sees
    // ════════════════════════════════════════
    {
      id: "athlete-header",
      type: "section-header",
      label: "SECTION 04: THE ATHLETE APP",
      title: "What Athletes",
      pressing: {
        mark: { n: "04", name: "What Athletes" },
        heldLine: "See",
        choreo: { pin: true },
      },
    },
    {
      id: "athlete-text",
      type: "text",
      size: "xl",
      content:
        "The athlete app opens on your next session and the activity around it, then the full trainer roster and the program menu. The same trainer data feeds the MCP server, so a connected AI describes a coach from the actual record.",
    },
    {
      id: "athlete-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Dashboard, trainer bios, and the program list. Each trainer expands to specialties and certifications. The programs run from strength and speed work to onsite physical therapy, prenatal fitness, and Combine prep.",
    },
    {
      id: "athlete-images",
      type: "triple-image",
      native: true,
      images: [
        { src: "/case-studies/dsc/dsc-athlete-app-dashboard-next-session.jpg", alt: "DSC athlete dashboard showing the next session and recent activity" },
        { src: "/case-studies/dsc/dsc-athlete-app-trainer-bio-profile.jpg", alt: "DSC athlete app trainer bio for the founder and head trainer" },
        { src: "/case-studies/dsc/dsc-athlete-app-programs-services.jpg", alt: "DSC athlete app program and services list" },
      ],
      // The athlete's three screens hold while the owner's side arrives
      // over the top of them, which is the turn the next section makes
      // anyway.
      pressing: {
        captions: ["Dashboard\nNext session", "Trainer bio", "Programs"],
        choreo: { pin: true },
      },
    },

    // ── HERO - owner divider — climbs across the held athlete screens ──
    {
      id: "hero-owner",
      type: "hero",
      image: "/case-studies/dsc/dsc-owner-calendar-phone-hero.jpg",
      alt: "DSC calendar open on a phone resting on concrete",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // 4. THE OWNER CONSOLE - how the owner manages it
    // ════════════════════════════════════════
    {
      id: "owner-header",
      type: "section-header",
      label: "SECTION 05: THE OWNER CONSOLE",
      title: "Run It From",
      pressing: {
        mark: { n: "05", name: "Run It From" },
        heldLine: "the Floor",
        choreo: { pin: true },
      },
    },
    {
      id: "owner-text",
      type: "text",
      size: "xl",
      content:
        "The owner side is for one person managing a packed week from a phone, between sessions, on the gym floor.",
    },
    {
      id: "owner-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The queue where every request lands, a week calendar with the session count per day, and a member list flagging waiver and trainer-assignment status.",
    },
    // Moved up out of the image run so the whole owner argument arrives in
    // one column: the queue first, then the week said out loud. The chat
    // screen it describes is the last frame in the row below.
    {
      id: "owner-batch-text",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The owner can say a whole week out loud: schedule Marcus with Scott every Monday, Wednesday, and Friday at 3pm for a month. The scheduler proposes the batch, accepts the ten clean slots, flags the three it skipped for conflicts, and waits for a \"commit\" before a single session lands.",
    },
    // ── THE TWO OWNER-SIDE REPLAYS ──
    // The paragraph above describes a real exchange; the first frame
    // replays it on the console's own chat. The second is the third way
    // a session gets onto the calendar, a standing slot, which the copy
    // never had room for and a replay shows in eighteen seconds. They
    // sit here, ahead of the editorial and the row of stills, because
    // the row below is held for the brand divider that climbs it and
    // nothing can come between them.
    {
      id: "owner-batch-demo",
      type: "product-demo",
      folder: "dsc-demos",
      demo: "owner-batch-chat",
      stageWidth: 400,
      title: "Owner · A week by chat",
      note: "The exchange from the paragraph above, replayed on the console's own chat. One sentence in, the scheduler looks up Marcus, proposes the batch, accepts ten, names the three it skipped, and waits for the word commit.",
    },
    {
      id: "owner-standing-demo",
      type: "product-demo",
      folder: "dsc-demos",
      demo: "standing-slots",
      stageWidth: 400,
      title: "Owner · Standing slots",
      note: "One recurring slot, Marcus with Scott, Tuesdays at 4, made in the product's own sheet. The engine fills in the next eight weeks and the new session shows up on the day view.",
    },
    // The turn between the argument and the evidence. It sits ahead of the
    // screens rather than after them because the row below has to stay
    // next to the brand divider that climbs it.
    {
      id: "owner-editorial",
      type: "editorial-headline",
      text: "However a booking comes in,\nit goes through the same checks",
    },
    {
      id: "owner-images",
      type: "quad-image",
      native: true,
      images: [
        { src: "/case-studies/dsc/dsc-owner-console-home-booking-requests.jpg", alt: "DSC owner home with booking requests and new registrations" },
        { src: "/case-studies/dsc/dsc-owner-console-calendar-week-view.jpg", alt: "DSC owner calendar week view with sessions per day" },
        { src: "/case-studies/dsc/dsc-owner-console-athlete-roster.jpg", alt: "DSC owner athlete list with waiver and trainer-assignment status" },
        { src: "/case-studies/dsc/dsc-owner-console-batch-scheduling-chat.jpg", alt: "DSC owner scheduler chat running a batch booking, ten accepted and three conflicts skipped" },
      ],
      // Four owner screens, one row. The batch chat used to be a plate of
      // its own and could not stay one: at 776px native it has no pixels
      // for a full-bleed climb, and nothing in this study clears the
      // 3000px floor a zoom needs. At quarter measure it is shown at a
      // size it can carry, and the row holds for the divider below.
      pressing: { choreo: { pin: true } },
    },

    // ── HERO - brand divider — climbs across the held owner screens ──
    {
      id: "hero-brand",
      type: "hero",
      image: "/case-studies/dsc/dsc-marketing-site-phone-hero.jpg",
      alt: "The DSC marketing site open on a phone, resting on concrete",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // 5. MARKS & MATERIALS - the brand system
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 06: MARKS & MATERIALS",
      title: "Black, White,\nand Loud",
      introText:
        "A palette with no color in it, one type family doing all the work, photography shot on the actual gym floor, and the same kit at every size.",
      philosophyText:
        "Pure black for type and structure, pure white for the ground, and a short ramp of greys for everything between. No accent color, because the photography and the weight of the type bring all the contrast the brand needs.\n\nType is mostly one family. Avenir Next runs the brand voice: Heavy for the wordmark and section heads, Demi Bold for subheads and CTAs, Medium for the body. A monospace sits underneath for the technical labels, the MCP URLs and session times.",
      colors: [
        { name: "Ground", hex: "#000000", description: "Type, structure" },
        { name: "Ink", hex: "#141414", description: "Dark surfaces" },
        { name: "Steel", hex: "#8E8E8E", description: "Labels, secondary" },
        { name: "Mist", hex: "#E6E6E6", description: "Cards, dividers" },
        { name: "Paper", hex: "#FFFFFF", description: "Ground, negative space" },
      ],
      fonts: [
        {
          name: "Avenir Next Heavy",
          role: "Wordmark & headlines",
          description:
            "The heaviest weight, at poster scale for the DALLAS SPORT COLLECTIVE wordmark and the section heads. As loud as the brand gets.",
          family: "'Avenir Next', 'Avenir', 'Helvetica Neue', sans-serif",
          weight: 800,
          sampleText: "DALLAS SPORT",
          sampleSize: 46,
        },
        {
          name: "Avenir Next Demi Bold",
          role: "Subheads & CTAs",
          description:
            "One step down, for subheads, callouts, and buttons. Enough weight to anchor a layout and stay under the wordmark.",
          family: "'Avenir Next', 'Avenir', 'Helvetica Neue', sans-serif",
          weight: 600,
          sampleText: "Schedule by Chat",
        },
        {
          name: "Avenir Next Medium",
          role: "Body & UI",
          description:
            "The workhorse: session details, trainer bios, running copy, interface text. It stays out of the photography's way.",
          family: "'Avenir Next', 'Avenir', 'Helvetica Neue', sans-serif",
          weight: 500,
          sampleText: "Train. Strength. Community.",
        },
        {
          name: "Mono",
          role: "Labels & data",
          description:
            "A monospace under the Avenir for the technical labels and data fields: MCP SERVER URL, session times, the places where the back end shows through in the UI.",
          family: "'SF Mono', 'Roboto Mono', ui-monospace, monospace",
          weight: 500,
          sampleText: "MCP SERVER URL",
        },
      ],
      markImage: "/case-studies/dsc/dsc-marketing-site-recovery-section.jpg",
      markAlt: "DSC marketing site recovery section, Get Back to Sport",
      markImageRight: "/case-studies/dsc/dsc-marketing-site-facilities-equipment.jpg",
      markAltRight: "DSC marketing site facilities and equipment spread",
      markStacked: true,
    },

    // ── STATS ──
    {
      id: "stats",
      type: "stats-summary",
      items: [
        { value: "100+", label: "Athletes", sublabel: "Up from a handful" },
        { value: "11", label: "MCP tools", sublabel: "Schedule, trainers, booking" },
        { value: "6", label: "Trainers", sublabel: "One shared calendar" },
        { value: "2", label: "TX locations", sublabel: "Frisco HQ on the way" },
      ],
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 07: CLOSING",
      title: "Live at",
      pressing: {
        mark: { n: "06", name: "Live at" },
        heldLine: "the Gym",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "xl",
      content:
        "The schedule used to be the part of the gym nobody saw, texts and notes and a spreadsheet. Now it is the most modern thing the gym owns.",
    },
    {
      id: "closing-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The same protocol works at any size of business, which might be the most useful thing about it.",
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Web Design",
        "Product Design",
        "AI Integration",
        "Full-Stack Engineering",
      ],
      stack: ["Next.js", "Vercel", "Model Context Protocol", "OAuth 2.0", "Claude + ChatGPT"],
      links: [
        { label: "dsportcollective.com", url: "https://dsportcollective.com" },
        { label: "App walkthrough", url: "https://dsc-gym.vercel.app/showcase" },
      ],
      content:
        "The platform is live at both locations. Athletes sign in and book, the owner approves from a queue or schedules a month in one batch, and a connected AI reads the schedule as it actually is.",
    },
  ],
};
