import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/sally-design-system";

/* His brief, 1 Oct 2026: "i have been working on a new digital design
   system for Sally - HP and email concepts. i want to show the full
   spectrum from type, color, scale, image vs graphics, templates, how i
   designed these to work with the internal AI tool so they are
   dynamically created via a request form with connections to the DAM,
   product tool and brand guidelines - it pulls in lifestyle images,
   writes copy and pulls in skus and rewrites product descriptions. what
   took weeks now take minutes and scales like we never could." Then:
   "can we use live pages?"

   Every fact here is his: that message, and the rules, counts and set
   descriptions in his working folder (its CLAUDE.md, styles.css,
   blocks.jsx, the homepage canvas and the email sets). The live pages
   are his own, imported by scripts/lib/sally-system-import.mjs into
   public/lab/sally-system/; the rooms frame them (product-demo with
   folder "sally-system"). The stills are captured from those pages.

   Restructured 2 Oct 2026 on his calls: the study is creative "but it's
   also setup in a way to be built from the sally os engine", told in the
   order the work happens: the strategy, the concepts, the content stories
   (shop the look, the color code, the vivids), the building blocks, the
   engine and the range of briefs it fills, then the pushed pass. The
   stories, the machine and the brief grid are modules made for the room
   (public/lab/sally-push/m-*.html, framed in "fit" mode); the engine
   links to the Sally Marketing OS study and that study links back.

   The pushed pass, same day (his "let's do a pass so that everything has
   satoshi and that new look"): every frame shows a pushed page
   (public/lab/sally-push/) where one exists and otherwise his page with
   the pushed skin (query skin=pushed, public/lab/sally-push/skin.css);
   the stills were recaptured from the same pages. The type, color and
   image sections describe what is on screen now.

   Three acts, same day (his "this case study isnt working but i cant put
   my finger one why", "the strategy ... it's just stacked homepage
   heros", "maybe we just show one really good homepage or two"): the
   idea (a mini sizzle in place of the stacked heroes), the work (one
   homepage and a second, the three stories, two emails) and the system
   (the six rule chapters as one board, the engine with the reveal of the
   same kit card with its slots lit, then every brief). Act 2 shows the
   modules clean (?view=creative) so the reveal in act 3 lands.

   Later the same day, his "in the engine sections let's just show the OS
   creating assets - i dont think we need the sections above": the engine
   is the Marketing OS demos alone, brief to email and then the Figma
   build, with the card to the Sally Marketing OS study under them. */

/* the pushed palette: scarlet, ink, the one soft grey, and two of the vivids
   sampled from his photographs (violet, teal) */
const REEL_COLORS = ["#E11324", "#1C1413", "#F4F3F1", "#442861", "#0E4043"];

export const sallyDesignSystemCaseStudy: CaseStudy = {
  slug: "sally-design-system",
  title: "Sally Beauty Design System",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "A design system for Sally Beauty's emails and homepage, and the creative strategy behind it. | Every piece is built for the Sally Marketing OS to fill, so a request becomes finished work in minutes.",
  field: "Design Systems\nArt Direction\nEmail Design\nHomepage Design",
  author: "Jeremy Prasatik",
  published: "2026",
  status: "In progress",
  classification: ["Design Systems", "Art Direction", "Email Design", "Homepage Design"],
  services: ["Design Systems", "Art Direction", "Email Design", "Homepage Design"],
  stack: ["Claude", "Figma", "HTML/CSS/JS", "Satoshi"],
  links: [],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 7 frames · 2026",
        colors: REEL_COLORS,
        /* The study page this reel was made for now redirects to the room,
           and the room deals these frames: two after the abstract, the
           rest to the closing, the one section with no live page of its
           own. The Edit closes the reel; in the room that frame is the
           cover (LEAD_SAME). */
        images: [
          `${IMG}/sally-design-system-email-color-blocked-sale.jpg`,
          `${IMG}/sally-design-system-email-editorial-the-gloss.jpg`,
          `${IMG}/sally-design-system-homepage-concept-6-pride-takeover-mobile.jpg`,
          `${IMG}/sally-design-system-homepage-concept-10-the-edit-mobile.jpg`,
          `${IMG}/sally-design-system-email-punch-volume.jpg`,
          `${IMG}/sally-design-system-email-punch-candy.jpg`,
          `${IMG}/sally-design-system-homepage-concept-10-the-edit-desktop.jpg`,
        ],
      },
      title: "Sally Beauty\nDesign\nSystem",
      subtitle:
        "A design system for Sally Beauty's emails and homepage, and the creative strategy behind it. | Every piece is built for the Sally Marketing OS to fill, so a request becomes finished work in minutes.",
      field: "Design Systems  Art Direction  Email Design  Homepage Design",
      author: "Jeremy Prasatik",
      published: "2026",
      status: "In progress",
      classification: ["Design Systems", "Art Direction", "Email Design", "Homepage Design"],
      summary: [
        { label: "Built", value: "A design system for email and the homepage: 11 homepage concepts, 21 homepage modules, 14 email building blocks and 15 example emails." },
        { label: "Scope", value: "Creative strategy, design system, art direction, email and homepage design, templates built for the Marketing OS to fill." },
        { label: "Tools", value: "Claude, Figma, HTML/CSS/JS. Satoshi, from light to black." },
        { label: "Angle", value: "The creative and the engine are one system: every template is a set of slots the Marketing OS fills from a request." },
      ],
      abstract:
        "An email or a homepage at Sally Beauty used to take weeks to make.\n\nI designed a digital design system for both, starting from a strategy: three ideas Ulta and Sephora can't easily copy, the doer's store, color expertise and education. It covers type, color, scale, when to use photography and when to use graphics, and the templates. So far it holds 11 homepage concepts at desktop and phone sizes, 21 homepage modules, 14 email building blocks and 15 example emails.\n\nEvery template is built for the Sally Marketing OS, which I also built. A request draws photography from the Asset Hub, products from the product tool and rules from the brand guidelines, and the AI fills the template in every shape a channel needs. Work that took weeks now takes minutes.",
    },

    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/sally-design-system-homepage-concept-10-the-edit-desktop.jpg`,
      alt: "Sally Beauty homepage concept 10, The Edit set as a magazine issue: The shade everyone will ask about, beside a portrait with copper curls",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // ACT 1 · SECTION 02 — THE IDEA
    // ════════════════════════════════════════
    {
      id: "idea-header",
      type: "section-header",
      label: "SECTION 02: THE IDEA",
      title: "Three ideas Ulta and Sephora",
      pressing: { mark: { n: "02", name: "The Idea" }, heldLine: "can't easily copy." },
    },
    {
      id: "idea-text",
      type: "text",
      size: "subhead",
      content: "The doer's store, color expertise and education, each one a story the templates can tell.",
    },
    {
      id: "idea-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content: "Nobody knows color like Sally: 8,000+ shades and real chemistry, and a licensed colorist checks the plan before anyone mixes, for free.",
    },
    {
      id: "idea-sizzle",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-sizzle",
      mode: "fit",
      title: "Three ideas",
      note: "The doer's store, color expertise and education, each in the concepts' own words.",
    },
    /* MOCKUP 1 OF 4, a placeholder (2 Oct 2026, his "could you add those
       placeholders"): becomes an image section when his mockup arrives */
    {
      id: "mock-1-lookbook-laptop",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-mock",
      query: "n=1",
      mode: "fit",
      title: "Mockup 1 of 4",
      note: "Placeholder: the Lookbook on a laptop, in a real setting.",
    },

    // ════════════════════════════════════════
    // ACT 2 · SECTION 03 — THE HOMEPAGE
    // ════════════════════════════════════════
    {
      id: "homepage-header",
      type: "section-header",
      label: "SECTION 03: THE HOMEPAGE",
      title: "The homepage leads",
      pressing: { mark: { n: "03", name: "The Homepage" }, heldLine: "with the looks." },
    },
    {
      id: "homepage-text",
      type: "text",
      size: "subhead",
      content: "Eleven concepts came out of the kit. The Lookbook is the one to see: every row is a person, not a packshot.",
    },
    {
      id: "homepage-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content: "The Edit is the other, set as a magazine issue with a cover story and a contents line.",
    },
    {
      id: "homepage-lookbook",
      type: "product-demo",
      folder: "sally-push",
      demo: "lookbook-images",
      title: "Concept 11 · The Lookbook, desktop",
      note: "Live at 1440. It scrolls itself; open it to use it.",
      stageWidth: 1440,
      viewHeight: 900,
      mode: "scroll",
    },
    {
      id: "homepage-edit",
      type: "product-demo",
      folder: "sally-push",
      demo: "the-color-issue",
      title: "Concept 10 · The Edit, desktop",
      note: "The homepage as a magazine issue.",
      stageWidth: 1440,
      viewHeight: 900,
      mode: "scroll",
    },
    /* MOCKUP 2 OF 4, a placeholder (2 Oct 2026, his "could you add those
       placeholders"): becomes an image section when his mockup arrives */
    {
      id: "mock-2-edit-phone",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-mock",
      query: "n=2",
      mode: "fit",
      title: "Mockup 2 of 4",
      note: "Placeholder: The Edit on a phone, in a hand.",
    },

    // ════════════════════════════════════════
    // ACT 2 · SECTION 04 — THE STORIES
    // ════════════════════════════════════════
    {
      id: "stories-header",
      type: "section-header",
      label: "SECTION 04: THE STORIES",
      title: "Each idea becomes",
      pressing: { mark: { n: "04", name: "The Stories" }, heldLine: "a story you can shop." },
    },
    {
      id: "stories-text",
      type: "text",
      size: "subhead",
      content: "Going platinum takes six steps and about two hours, so the doer's store sells it as one kit for $36.99. Color expertise becomes a code you can crack, and the vivids get a wall of their own.",
    },
    {
      id: "stories-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content: "A level and a tone name every shade. Vivids skip the levels and want a light base, so the lightener comes first.",
    },
    {
      id: "stories-kit",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-kit-live",
      query: "view=creative",
      mode: "fit",
      title: "Shop the look, working",
      note: "The Platinum Kit on the page: take a piece out and the price follows, then the whole kit goes in the bag.",
    },
    {
      id: "stories-code",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-code-live",
      query: "view=creative",
      mode: "fit",
      title: "The color code, working",
      note: "Pick a level, then a tone, and the code builds itself.",
    },
    {
      id: "stories-vivids",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-vivids-live",
      query: "view=creative",
      mode: "fit",
      title: "The vivids wall, working",
      note: "Each hue brings up its look, and the lightener sits one tap away.",
    },

    // ════════════════════════════════════════
    // ACT 2 · SECTION 05 — THE EMAILS
    // ════════════════════════════════════════
    {
      id: "emails-header",
      type: "section-header",
      label: "SECTION 05: THE EMAILS",
      title: "Four email sets",
      pressing: { mark: { n: "05", name: "The Emails" }, heldLine: "share one chassis." },
    },
    {
      id: "emails-text",
      type: "text",
      size: "subhead",
      content: "The Gloss treats Sally as a publication, a moment in the inbox and not a promo. The sale is the one email that turns red.",
    },
    {
      id: "emails-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content: "The color-blocked set is the current direction, and the punch set dials the same chassis up three ways: type, color and charm. Every email ends on the same footer.",
    },
    /* MOCKUP 3 OF 4, a placeholder (2 Oct 2026, his "could you add those
       placeholders"): becomes an image section when his mockup arrives */
    {
      id: "mock-3-two-phones",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-mock",
      query: "n=3",
      mode: "fit",
      title: "Mockup 3 of 4",
      note: "Placeholder: The Gloss and the sale on two phones.",
    },
    {
      id: "emails-gloss",
      type: "product-demo",
      folder: "sally-push",
      demo: "the-gloss",
      title: "Editorial · The Gloss",
      note: "A full issue: masthead, pull quotes, and prose around the products.",
      stageWidth: 600,
      viewHeight: 1100,
      mode: "scroll",
      phone: true,
    },
    {
      id: "emails-sale",
      type: "product-demo",
      folder: "sally-push",
      demo: "the-sale",
      title: "The Sale",
      note: "The one email that turns red.",
      stageWidth: 600,
      viewHeight: 1100,
      mode: "scroll",
      phone: true,
    },

    // ════════════════════════════════════════
    // ACT 3 · SECTION 06 — THE KIT
    // ════════════════════════════════════════
    {
      id: "kit-header",
      type: "section-header",
      label: "SECTION 06: THE KIT",
      title: "Everything above comes",
      pressing: { mark: { n: "06", name: "The Kit" }, heldLine: "out of one kit." },
    },
    {
      id: "kit-text",
      type: "text",
      size: "subhead",
      content: "One type family, white paper with scarlet and ink, round corners, five shapes, fourteen email blocks and twenty-one homepage modules.",
    },
    {
      id: "kit-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content: "Every type role and color is a token, so the move to Satoshi changed the tokens and left the layouts alone. A teammate's ADA review of the homepage darkened the muted text and set every eyebrow in solid ink or white.",
    },
    /* MOCKUP 4 OF 4, a placeholder (2 Oct 2026, his "could you add those
       placeholders"): becomes an image section when his mockup arrives */
    {
      id: "mock-4-every-channel",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-mock",
      query: "n=4",
      mode: "fit",
      title: "Mockup 4 of 4",
      note: "Placeholder: every channel at once, from one brief.",
    },
    {
      id: "kit-board",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-board",
      mode: "fit",
      title: "The kit, on one board",
      note: "The block and module names are the canvas's own labels.",
    },

    // ════════════════════════════════════════
    // ACT 3 · SECTION 07 — THE ENGINE
    // ════════════════════════════════════════
    {
      id: "ai-header",
      type: "section-header",
      label: "SECTION 07: THE ENGINE",
      title: "One request",
      pressing: { mark: { n: "07", name: "The Engine" }, heldLine: "fills every channel." },
    },
    {
      id: "ai-text",
      type: "text",
      size: "subhead",
      content:
        "The request form connects the Marketing OS to the Asset Hub, the product tool and the brand guidelines. It brings in lifestyle photography, writes the copy, pulls in the SKUs and rewrites their product descriptions.",
    },
    {
      id: "ai-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each new email fills a template from a brief, and the templates stay locked, so the kit holds its shape at the volume Sally sends every month.",
    },
    {
      id: "ai-requests-demo",
      type: "product-demo",
      demo: "requests-email",
      title: "From brief to email",
      note: "A CRM request on the campaign board becomes an email with one press of Create Email.",
    },
    {
      id: "ai-figma-demo",
      type: "product-demo",
      demo: "figma-build",
      title: "From email to Figma",
      note: "The Figma plugin builds the requested emails in one press, the images first and then the copy.",
    },

    {
      id: "engine-link",
      type: "study-link",
      study: "sally-os",
      label: "The engine",
      note: "How the campaign board, the Asset Hub and the AI behind these templates were built.",
    },

    // ════════════════════════════════════════
    // ACT 3 · SECTION 08 — EVERY BRIEF
    // ════════════════════════════════════════
    {
      id: "briefs-header",
      type: "section-header",
      label: "SECTION 08: EVERY BRIEF",
      title: "Seven kinds of brief,",
      pressing: { mark: { n: "08", name: "Every Brief" }, heldLine: "five shapes each." },
    },
    {
      id: "briefs-text",
      type: "text",
      size: "subhead",
      content: "A campaign, a category drive, a sale, a cause, a loyalty push, a project and a new drop fill the same templates, square, vertical and horizontal.",
    },
    {
      id: "briefs-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content: "The split banners alone were built to stamp a hundred at a time.",
    },
    {
      id: "briefs-module",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-briefs",
      query: "view=creative",
      mode: "fit",
      title: "Seven briefs, five shapes",
      note: "Square, 4:5, 9:16, 16:9 and the 3:1 split banner, from one set of templates.",
    },

    // ── Editorial headline ──
    {
      id: "headline-weeks",
      type: "editorial-headline",
      text: "What took weeks now takes minutes,\nand it scales like the team\nnever could",
    },


    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 09: CLOSING",
      title: "The homepage kit grew out",
      pressing: { mark: { n: "09", name: "One Stylesheet" }, heldLine: "of the email system." },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content: "Both share the same tokens, the same fonts and the same voice.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Design Systems", "Art Direction", "Email Design", "Homepage Design"],
      stack: ["Claude", "Figma", "HTML/CSS/JS", "Satoshi"],
      links: [],
      content:
        "The voice is Sally as the beauty-obsessed best friend, the one who makes salon-level results doable at home.",
    },
  ],
};
