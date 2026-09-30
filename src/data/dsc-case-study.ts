import type { CaseStudy } from "@/lib/types";

export const dscCaseStudy: CaseStudy = {
  slug: "dsc",
  title: "Dallas Sport Collective",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "A marketing site, booking platform, and MCP server for Dallas Sport Collective, a six-trainer gym in North Texas. | An athlete can book from whichever AI they already use, and the owner approves with a tap.",
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
        caption: "Preview · 9 frames",
        colors: ["#000000", "#141414", "#8E8E8E", "#E6E6E6", "#FFFFFF"],
        images: [
          "/case-studies/dsc/dsc-marketing-site-laptop-stool-hero.jpg",
          "/case-studies/dsc/dsc-marketing-site-laptop-hero.jpg",
          "/case-studies/dsc/dsc-athlete-app-login-screen.jpg",
          "/case-studies/dsc/dsc-athlete-app-registration-form.jpg",
          "/case-studies/dsc/dsc-ai-scheduler-phone-hero.jpg",
          "/case-studies/dsc/dsc-athlete-app-connect-mcp-server.jpg",
          "/case-studies/dsc/dsc-claude-oauth-consent.jpg",
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
        { label: "Angle", value: "An athlete's AI can read the schedule but only request changes, and one deterministic engine makes every booking, however it comes in." },
      ],
      title: "Dallas Sport\nCollective",
      subtitle:
        "A marketing site, booking platform, and MCP server for Dallas Sport Collective, a six-trainer gym in North Texas. | An athlete can book from whichever AI they already use, and the owner approves with a tap.",
      abstract:
        "Dallas Sport Collective grew from a handful of athletes to more than a hundred, and the schedule underneath it all was a pile of texts, handwritten notes, emails, and a Google Sheet nobody fully trusted. The founder needed two things at once: a brand that matched where the gym was headed, and a back office that could keep up. Six trainers work at DSC, and the gym runs eleven programs, from NFL Combine prep to prenatal fitness. DSC is open seven days a week in Celina and McKinney, Texas, with a Frisco headquarters on the way.\n\nI worked with DSC to design and build a marketing site in black and white, with big condensed type and photography of actual members training. I also built a scheduling platform with two faces: an athlete app for booking sessions, and an owner console where the owner can schedule a whole week out loud and approve each request with one tap. The part I find the most fun is an MCP server with eleven tools, so athletes can paste one URL into the AI they already use, whether that's Claude, ChatGPT or Gemini, and ask it what's on their schedule, which trainer fits a goal, or to book Friday at 10am.\n\nEvery booking, whether spoken out loud, requested by an athlete's connected AI, or made with a tap on the calendar, flows through one deterministic engine that checks trainer availability, double-bookings, floor capacity, allowed durations, and cancellation rules. An athlete's AI can only ever request a booking. The platform is Next.js on Vercel, with OAuth 2.0 consent and short-lived tokens, and it is live at two locations.",
    },

        // ── HERO ──
    {
      id: "hero-1",
      type: "hero",
      image: "/case-studies/dsc/dsc-marketing-site-laptop-stool-hero.jpg",
      alt: "The Dallas Sport Collective marketing site open on a laptop resting on a wooden stool",
      pressing: { choreo: { rise: true } },
    },

    {
      id: "intro-editorial",
      type: "editorial-headline",
      text: "Enterprise plumbing\nfor a gym with six trainers",
    },

    // ════════════════════════════════════════
    // 1. THE FRONT DOOR - the organizing first step
    // ════════════════════════════════════════
    {
      id: "signup-header",
      type: "section-header",
      label: "SECTION 02: THE FRONT DOOR",
      title: "None of the scheduling works",
      pressing: {
        mark: { n: "02", name: "Sign-Up" },
        heldLine: "until every athlete is on the roster.",
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
        "Sign-up was the first part of the scheduling platform I built. Athletes create their own accounts, sign the waiver on the way in, and the owner assigns each new member to a trainer before anyone books a session.",
    },
    {
      id: "signup-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Login and registration move a hundred-plus athletes off text threads and a spreadsheet and onto one roster the software can work with.",
    },

    // ── The old cover, kept. This section calls the signup the front
    // door, and the marketing site is the part of that door the public
    // sees, so it belongs here rather than opening the study twice.
    // Climbs the pinned brief above it: the brief absorbs its own texts,
    // so this plate's real neighbour is the held header.
    {
      id: "marketing-site",
      type: "image",
      src: "/case-studies/dsc/dsc-marketing-site-laptop-hero.jpg",
      alt: "The Dallas Sport Collective marketing site open on a laptop, on concrete",
      aspect: "native",
      pressing: {
        caption: "The marketing site",
        choreo: { rise: true },
      },
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
      title: "Athletes can book a session",
      // The study's one crossing. Of everything here, a gym a trainer can
      // book from inside a chat window is the claim nobody else is making,
      // so the gesture marks it.
      //
      // No zoom plate: every capture in this study is 2000px native or
      // less, well under the working floor for a plate that fills the mat.
      // The climbs below carry the choreography instead.
      pressing: {
        mark: { n: "03", name: "From your AI" },
        heldLine: "from Claude, ChatGPT or Gemini.",
        choreo: { crossing: true },
      },
    },
    {
      id: "mcp-text",
      type: "text",
      size: "xl",
      content:
        "An athlete never has to open the app: they ask a connected AI, and it reads their real schedule and can put in a session request.",
    },
    {
      id: "mcp-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Eleven tools on the MCP server cover the gym overview, the program list, trainer profiles and availability, the athlete's sessions and pending requests, slot suggestions, booking requests, and cancellations. Lookups come back instantly, and any change the AI asks for waits as a pending request until the owner approves it. Connecting an AI runs through an OAuth consent screen with short-lived, rotating tokens, and access can be revoked from the dashboard in one tap.",
    },
    {
      id: "mcp-masonry",
      type: "masonry",
      images: [
        { src: "/case-studies/dsc/dsc-athlete-app-connect-mcp-server.jpg", alt: "DSC in-app connect screen with the MCP server URL and live connection status" },
        { src: "/case-studies/dsc/dsc-claude-oauth-consent.jpg", alt: "OAuth consent screen, Claude wants to connect, listing granted permissions" },
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
      note: "The demo replays a real exchange. An athlete asks their AI for openings with Scott, one of the trainers. The AI reads the gym's live schedule through the MCP tools and asks for a slot, and that request shows up on the owner's console as a card to approve. The chat window is a neutral stand-in for Claude, where the original exchange ran. The owner's console is the product's own interface code.",
    },
    {
      id: "mcp-architecture",
      type: "mcp-architecture",
    },
    {
      id: "mcp-editorial",
      type: "editorial-headline",
      text: "The athlete asks their own AI,\nand the AI asks the gym",
    },

    // ════════════════════════════════════════
    // 3. THE ATHLETE APP - what the user sees
    // ════════════════════════════════════════
    {
      id: "athlete-header",
      type: "section-header",
      label: "SECTION 04: THE ATHLETE APP",
      title: "The athlete app opens on",
      pressing: {
        mark: { n: "04", name: "The Athlete App" },
        heldLine: "your next session.",
        choreo: { pin: true },
      },
    },
    {
      id: "athlete-text",
      type: "text",
      size: "xl",
      content:
        "The athlete dashboard lists recent activity. The full trainer roster and the program menu each get a screen of their own. The MCP server reads the same trainer profiles athletes see in the app, so a connected AI describes a coach from the actual record.",
    },
    {
      id: "athlete-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each trainer's bio expands to specialties and certifications. The programs run from strength and speed work to onsite physical therapy.",
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
      image: "/case-studies/dsc/dsc-owner-calendar-week-phone.jpg",
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
      title: "The owner console is built for",
      pressing: {
        mark: { n: "05", name: "The Owner Console" },
        heldLine: "one person on the gym floor.",
        choreo: { pin: true },
      },
    },
    {
      id: "owner-text",
      type: "text",
      size: "xl",
      content:
        "Between sessions, the owner manages a packed week from a phone.",
    },
    {
      id: "owner-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "On the owner console, every request lands in a queue, a week calendar shows the session count per day, and a member list flags waiver and trainer-assignment status.",
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
        "The owner can say a whole week out loud: schedule Marcus with Scott every Monday, Wednesday, and Friday at 3pm for a month. The scheduler proposes the batch, accepts the ten clean slots, flags the three it skipped for conflicts, and waits for a \"commit\" before booking anything.",
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
      note: "The owner's real batch booking, replayed on the console's own chat, shows the scheduler looking the athlete up before it proposes anything.",
    },
    {
      id: "owner-standing-demo",
      type: "product-demo",
      folder: "dsc-demos",
      demo: "standing-slots",
      stageWidth: 400,
      title: "Owner · Standing slots",
      note: "The owner sets up one recurring slot on the console, Marcus with Scott on Tuesdays at 4, and the engine fills in the next eight weeks. The new session shows up on the day view.",
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
        { src: "/case-studies/dsc/dsc-owner-console-home-requests.jpg", alt: "DSC owner home with booking requests and new registrations" },
        { src: "/case-studies/dsc/dsc-owner-console-calendar-week-view.jpg", alt: "DSC owner calendar week view with sessions per day" },
        { src: "/case-studies/dsc/dsc-owner-console-athlete-list.jpg", alt: "DSC owner athlete list with waiver and trainer-assignment status" },
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
      title: "The brand is black and white,\nwith heavy type.",
      introText:
        "One type family does the work from poster scale down to interface text, and the photography is shot on the actual gym floor.",
      philosophyText:
        "The palette is pure black for type and structure, pure white for the background, and a short ramp of greys for everything between. There's no accent color, because the photography and the weight of the type bring all the contrast the brand needs.\n\nAvenir Next carries the brand in Heavy, Demi Bold and Medium, with a monospace underneath.",
      colors: [
        { name: "Ground", hex: "#000000", description: "Type, structure" },
        { name: "Ink", hex: "#141414", description: "Dark surfaces" },
        { name: "Steel", hex: "#8E8E8E", description: "Labels, secondary" },
        { name: "Mist", hex: "#E6E6E6", description: "Cards, dividers" },
        { name: "Paper", hex: "#FFFFFF", description: "Background, negative space" },
      ],
      fonts: [
        {
          name: "Avenir Next Heavy",
          role: "Wordmark & headlines",
          description:
            "Heavy is set at poster scale for the DALLAS SPORT COLLECTIVE wordmark and the section heads.",
          family: "'Avenir Next', 'Avenir', 'Helvetica Neue', sans-serif",
          weight: 800,
          sampleText: "DALLAS SPORT",
          sampleSize: 46,
        },
        {
          name: "Avenir Next Demi Bold",
          role: "Subheads & CTAs",
          description:
            "Demi Bold sits one step below Heavy, for subheads, callouts and buttons. It has enough weight to anchor a layout while staying under the wordmark.",
          family: "'Avenir Next', 'Avenir', 'Helvetica Neue', sans-serif",
          weight: 600,
          sampleText: "Schedule by Chat",
        },
        {
          name: "Avenir Next Medium",
          role: "Body & UI",
          description:
            "Medium is the workhorse for session details, trainer bios, running copy and interface text, and it stays out of the photography's way.",
          family: "'Avenir Next', 'Avenir', 'Helvetica Neue', sans-serif",
          weight: 500,
          sampleText: "Train. Strength. Community.",
        },
        {
          name: "Mono",
          role: "Labels & data",
          description:
            "The monospace handles technical labels and data fields like MCP SERVER URL and session times, the places where the back end shows through in the UI.",
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
      title: "The schedule was the part",
      pressing: {
        mark: { n: "06", name: "Closing" },
        heldLine: "of the gym nobody saw.",
        // A closing holds no picture — title, stats, links — so the
        // navigator had an empty box for it. The study's own opening
        // hero closes the loop, and it is the best-looking file here.
        thumb: "/case-studies/dsc/dsc-marketing-site-laptop-stool-hero.jpg",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "xl",
      content:
        "Athletes now sign in and book, the owner approves from a queue, and a connected AI reads the schedule as it actually is.",
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
        "The platform is live in Celina and McKinney.",
    },
  ],
};
