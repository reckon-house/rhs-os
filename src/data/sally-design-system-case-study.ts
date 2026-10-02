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
   links to the Sally Marketing OS study and that study links back. */

const REEL_COLORS = ["#E11324", "#1C1413", "#F4E2DC", "#FADDC0", "#FFF0E0"];

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
  stack: ["Claude", "Figma", "HTML/CSS/JS", "Founders Grotesk"],
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
           and the room deals these frames in order: two emails after the
           abstract, then two to the contrast section and two to the
           closing, the sections with no live page of their own. Contrast
           gets the two homepage phone stills because its ADA fixes are
           homepage only. None of the frames is one of the ten concepts in
           "Eleven homepages", so the reel takes no picture from that
           section. The Edit closes it; in the room that frame is the
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
        { label: "Tools", value: "Claude, Figma, HTML/CSS/JS. Founders Grotesk in regular, condensed and mono." },
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
      alt: "Sally Beauty homepage concept, The Edit: a full-bleed portrait of a woman with copper curls under the Sally header and navigation",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE STRATEGY
    // ════════════════════════════════════════
    {
      id: "strategy-header",
      type: "section-header",
      label: "SECTION 02: THE STRATEGY",
      title: "Three ideas Ulta and Sephora",
      pressing: { mark: { n: "02", name: "The Sally Difference" }, heldLine: "can't easily copy." },
    },
    {
      id: "strategy-text",
      type: "text",
      size: "subhead",
      content: "The doer's store, color expertise and education, each with a homepage concept of its own.",
    },
    {
      id: "strategy-columns",
      type: "three-column-text",
      columns: [
        { title: "The doer's store", content: "Pro-grade color, tools and the steps to use them. The DIY Studio sells a project with its kit." },
        { title: "Color expertise", content: "Nobody knows color like Sally: 8,000+ shades and real chemistry. The Color Authority teaches the shade code before it sells a box." },
        { title: "Education", content: "A licensed colorist checks the plan before anyone mixes, for free. The Mix is a shoppable content hub." },
      ],
    },
    {
      id: "strategy-concepts",
      type: "triple-image",
      images: [
        { src: `${IMG}/sally-design-system-homepage-concept-7-diy-studio-desktop.jpg`, alt: "Concept 7, The DIY Studio: Do it yourself. We'll handle the how, beside a portrait" },
        { src: `${IMG}/sally-design-system-homepage-concept-8-color-authority-desktop.jpg`, alt: "Concept 8, The Color Authority: Find your perfect shade, over a portrait with copper curls" },
        { src: `${IMG}/sally-design-system-homepage-concept-9-the-mix-desktop.jpg`, alt: "Concept 9, The Mix: Color stories, worth shopping, beside a woman with a wave styler" },
      ],
    },

    // ════════════════════════════════════════
    // SECTION 03 — THE CONCEPTS
    // ════════════════════════════════════════
    {
      id: "concepts-header",
      type: "section-header",
      label: "SECTION 03: THE CONCEPTS",
      title: "Eleven homepages and four email sets",
      pressing: { mark: { n: "03", name: "The Concepts" }, heldLine: "came out of one kit." },
    },
    {
      id: "concepts-text",
      type: "text",
      size: "subhead",
      content:
        "Three set the foundations. Three tried new directions: a story-led Colorfest, a personalized For You and a Pride takeover. Three came from the strategy, and The Edit and The Lookbook make eleven.",
    },
    {
      id: "concepts-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The Edit puts one tabbed shop where the stacked product rails were, and The Lookbook leads with lifestyle photography.",
    },
    {
      id: "concepts-grid-1",
      type: "dual-image",
      native: true,
      left: { src: `${IMG}/sally-design-system-homepage-concept-1-editorial-desktop.jpg`, alt: "Concept 1, Editorial: Your brightest summer, sorted, beside a portrait with copper curls" },
      right: { src: `${IMG}/sally-design-system-homepage-concept-2-card-system-desktop.jpg`, alt: "Concept 2, Card system: three portrait cards labelled New in, Ends Sunday and a third offer" },
    },
    {
      id: "concepts-grid-2",
      type: "dual-image",
      native: true,
      left: { src: `${IMG}/sally-design-system-homepage-concept-3-full-card-desktop.jpg`, alt: "Concept 3, Full card homepage: a service bar for delivery, pickup and color advice over three portrait cards" },
      right: { src: `${IMG}/sally-design-system-homepage-concept-4-colorfest-story-desktop.jpg`, alt: "Concept 4, Colorfest: Wear your color out loud, over a smiling woman with blue-streaked curls" },
    },
    {
      id: "concepts-grid-3",
      type: "dual-image",
      native: true,
      left: { src: `${IMG}/sally-design-system-homepage-concept-5-for-you-desktop.jpg`, alt: "Concept 5, For You: Let's finish what you started, beside a woman using a wave styler" },
      right: { src: `${IMG}/sally-design-system-homepage-concept-6-pride-takeover-desktop.jpg`, alt: "Concept 6, Pride takeover: Express every shade of you, over a woman with violet curls" },
    },
    {
      id: "concepts-lookbook",
      type: "image",
      src: `${IMG}/sally-design-system-homepage-concept-11-lookbook-desktop.jpg`,
      alt: "Concept 11, The Lookbook: Vivids are back at it, over a full-bleed portrait",
    },

    {
      id: "emails-text",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The color-blocked set is the current direction. The editorial set treats Sally as a publication, a moment in the inbox and not a promo, and the punch set is the same chassis dialed up.",
    },
    {
      id: "emails-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each punch email leans on something different: one on type, one on color, one on charm. The first white set is archived now. Every email ends on the same footer.",
    },
    {
      id: "emails-gloss",
      type: "product-demo",
      folder: "sally-system",
      demo: "email-editorial-the-gloss-full-issue",
      title: "Editorial · The Gloss",
      note: "A full issue: masthead, pull quotes, and prose around the products.",
      stageWidth: 600,
      viewHeight: 1100,
      mode: "scroll",
      phone: true,
    },
    {
      id: "emails-rewards",
      type: "product-demo",
      folder: "sally-system",
      demo: "email-color-blocked-rewards",
      title: "Color-blocked · Rewards",
      note: "Points, picks and a restock.",
      stageWidth: 600,
      viewHeight: 1100,
      mode: "scroll",
      phone: true,
    },
    {
      id: "emails-soft-pop",
      type: "product-demo",
      folder: "sally-system",
      demo: "email-punch-c-soft-pop",
      title: "Punch · Soft pop",
      note: "The punch email that leans on charm.",
      stageWidth: 600,
      viewHeight: 1100,
      mode: "scroll",
      phone: true,
    },
    {
      id: "emails-shoppable",
      type: "product-demo",
      folder: "sally-system",
      demo: "email-color-blocked-shoppable",
      title: "Color-blocked · Shoppable",
      note: "One product, two ways to wear it, and the routine around it.",
      stageWidth: 600,
      viewHeight: 1100,
      mode: "scroll",
      phone: true,
    },

    // ════════════════════════════════════════
    // SECTION 04 — SHOP THE LOOK
    // ════════════════════════════════════════
    {
      id: "m-kit-header",
      type: "section-header",
      label: "SECTION 04: SHOP THE LOOK",
      title: "Every project comes with",
      pressing: { mark: { n: "04", name: "Shop the Look" }, heldLine: "the kit to finish it." },
    },
    {
      id: "m-kit-text",
      type: "text",
      size: "subhead",
      content: "Going platinum is six steps and about two hours, and the Platinum Kit puts all five products in one bag for $36.99.",
    },
    {
      id: "m-kit-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content: "The gray-coverage project and a first vivid get the same card: the level, the steps, the time and the kit.",
    },
    {
      id: "m-kit-module",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-kit",
      mode: "fit",
      title: "The Platinum Kit",
      note: "From the DIY Studio concept. The red tags show what the Marketing OS fills; open it to switch them yourself.",
    },

    // ════════════════════════════════════════
    // SECTION 05 — THE COLOR CODE
    // ════════════════════════════════════════
    {
      id: "m-code-header",
      type: "section-header",
      label: "SECTION 05: THE COLOR CODE",
      title: "Two steps",
      pressing: { mark: { n: "05", name: "The Color Code" }, heldLine: "to your shade." },
    },
    {
      id: "m-code-text",
      type: "text",
      size: "subhead",
      content: "Every color starts with a level, 1 for black to 10 for the lightest blonde, and the letter after it is the tone.",
    },
    {
      id: "m-code-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content: "A cools it down, N keeps it honest, and G, C and R warm it up. Crack the code and the wall of boxes makes sense.",
    },
    {
      id: "m-code-module",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-code",
      mode: "fit",
      title: "8C, decoded",
      note: "From the Color Authority concept, on its own level and tone swatches.",
    },

    // ════════════════════════════════════════
    // SECTION 06 — THE VIVIDS
    // ════════════════════════════════════════
    {
      id: "m-vivids-header",
      type: "section-header",
      label: "SECTION 06: THE VIVIDS",
      title: "Vivids skip",
      pressing: { mark: { n: "06", name: "The Vivids" }, heldLine: "the levels." },
    },
    {
      id: "m-vivids-text",
      type: "text",
      size: "subhead",
      content: "No numbers here, just pigment. Most vivids want a level 8 or lighter base, so the lightener comes first.",
    },
    {
      id: "m-vivids-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content: "The wall runs sixty shades from the warm side to the cool side, led by Electric Violet, Deep Sea Teal and Cherry Cola.",
    },
    {
      id: "m-vivids-module",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-vivids",
      mode: "fit",
      title: "The vivids wall",
      note: "Eight hues, warm side to cool side, with the three looks above their shades.",
    },

    // ════════════════════════════════════════
    // SECTION 07 — TYPE
    // ════════════════════════════════════════
    {
      id: "type-header",
      type: "section-header",
      label: "SECTION 07: TYPE",
      title: "Founders Grotesk sets every word",
      pressing: { mark: { n: "07", name: "Three Cuts" }, heldLine: "in three cuts." },
    },
    {
      id: "type-text",
      type: "text",
      size: "subhead",
      content:
        "The regular cut sets headlines, body copy and buttons. The condensed cut sets the promo banners and the loud headlines, and the mono cut sets eyebrows, product tags, prices and promo codes.",
    },
    {
      id: "type-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content: "Headlines run bold with tight tracking, and one word in each gets the emphasis.",
    },
    {
      id: "type-punch-a",
      type: "product-demo",
      folder: "sally-system",
      demo: "email-punch-a-volume",
      title: "Punch · Volume",
      note: "The punch set leans on type: pure Founders, set big.",
      stageWidth: 600,
      viewHeight: 1100,
      mode: "scroll",
      phone: true,
    },
    {
      id: "type-punch-b",
      type: "product-demo",
      folder: "sally-system",
      demo: "email-punch-b-candy",
      title: "Punch · Candy",
      note: "The same chassis, leaning on color.",
      stageWidth: 600,
      viewHeight: 1100,
      mode: "scroll",
      phone: true,
    },

    // ════════════════════════════════════════
    // SECTION 08 — COLOR
    // ════════════════════════════════════════
    {
      id: "color-header",
      type: "section-header",
      label: "SECTION 08: COLOR",
      title: "Red headlines are kept for the sale,",
      pressing: { mark: { n: "08", name: "The Tone Rule" }, heldLine: "and warm tints carry the rest." },
    },
    {
      id: "color-text",
      type: "text",
      size: "subhead",
      content:
        "A new-arrivals or rewards email keeps its headlines in ink. Sally scarlet stays on the accents: the buttons, the banners and the dot motif.",
    },
    {
      id: "color-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The color-blocked fields come from the brand's Natural scale: cream, shell, rose, peach, sand and dusty. Two pale tints never sit next to each other, so peach or a bold field goes between them. Louder work pulls saturated steps from the official red ramp, never an off-brand hue.",
    },
    {
      id: "color-new",
      type: "product-demo",
      folder: "sally-system",
      demo: "email-color-blocked-new-arrivals",
      title: "Color-blocked · New Arrivals",
      note: "Ink headlines on warm Natural fields.",
      stageWidth: 600,
      viewHeight: 1100,
      mode: "scroll",
      phone: true,
    },
    {
      id: "color-sale",
      type: "product-demo",
      folder: "sally-system",
      demo: "email-color-blocked-sale",
      title: "Color-blocked · Sale",
      note: "The sale email is the one that turns red.",
      stageWidth: 600,
      viewHeight: 1100,
      mode: "scroll",
      phone: true,
    },

    // ════════════════════════════════════════
    // SECTION 09 — SCALE
    // ════════════════════════════════════════
    {
      id: "scale-header",
      type: "section-header",
      label: "SECTION 09: SCALE",
      title: "Each homepage was drawn twice,",
      pressing: { mark: { n: "09", name: "1440 and 390" }, heldLine: "at 1440 and at 390." },
    },
    {
      id: "scale-text",
      type: "text",
      size: "subhead",
      content:
        "In the canvas each desktop concept sits beside its phone version, and every module has a desktop and a phone pair.",
    },
    {
      id: "scale-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "On desktop, splits divide the screen in exact halves, feature rows stop a thin margin short of the edges, and product photos crop to 4:5.",
    },
    {
      id: "scale-edit-desk",
      type: "product-demo",
      folder: "sally-system",
      demo: "homepage-edit",
      title: "Concept 10 · The Edit, desktop",
      note: "Live at 1440. It scrolls itself; open it to use it.",
      stageWidth: 1440,
      viewHeight: 900,
      mode: "scroll",
    },
    {
      id: "scale-edit-phone",
      type: "product-demo",
      folder: "sally-system",
      demo: "homepage-edit",
      title: "The Edit, phone",
      note: "The same page at 390.",
      stageWidth: 390,
      viewHeight: 844,
      mode: "scroll",
      phone: true,
    },
    {
      id: "scale-color-phone",
      type: "product-demo",
      folder: "sally-system",
      demo: "homepage-color",
      title: "The Color Authority, phone",
      note: "The shade finder at 390.",
      stageWidth: 390,
      viewHeight: 844,
      mode: "scroll",
      phone: true,
    },

    // ════════════════════════════════════════
    // SECTION 10 — IMAGE AND GRAPHICS
    // ════════════════════════════════════════
    {
      id: "image-header",
      type: "section-header",
      label: "SECTION 10: IMAGE AND GRAPHICS",
      title: "Copy never sits",
      pressing: { mark: { n: "10", name: "Photo or Field" }, heldLine: "on a photograph." },
    },
    {
      id: "image-text",
      type: "text",
      size: "subhead",
      content:
        "A desktop takeover gets one light scrim, the one loud place in the system. On a phone, the takeover splits into the photo and a blush panel for the words.",
    },
    {
      id: "image-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Graphics carry everything else: the color-blocked fields, the halftone dot burst from the brand guide, and the circle that crops the hero. Homepage products never show a price, because prices change too often.",
    },
    {
      id: "image-takeover-desk",
      type: "product-demo",
      folder: "sally-system",
      demo: "homepage-takeover",
      title: "Concept 6 · Pride takeover, desktop",
      note: "The scrim is short and light.",
      stageWidth: 1440,
      viewHeight: 900,
      mode: "scroll",
    },
    {
      id: "image-takeover-phone",
      type: "product-demo",
      folder: "sally-system",
      demo: "homepage-takeover",
      title: "Pride takeover, phone",
      note: "The photo and the panel, apart.",
      stageWidth: 390,
      viewHeight: 844,
      mode: "scroll",
      phone: true,
    },
    {
      id: "image-story-phone",
      type: "product-demo",
      folder: "sally-system",
      demo: "homepage-story",
      title: "Concept 4 · Colorfest, phone",
      note: "A story-led homepage at 390.",
      stageWidth: 390,
      viewHeight: 844,
      mode: "scroll",
      phone: true,
    },

    // ════════════════════════════════════════
    // SECTION 11 — TEMPLATES
    // ════════════════════════════════════════
    {
      id: "templates-header",
      type: "section-header",
      label: "SECTION 11: TEMPLATES",
      title: "The emails stack up",
      pressing: { mark: { n: "11", name: "The Kit" }, heldLine: "from fourteen blocks." },
    },
    {
      id: "templates-text",
      type: "text",
      size: "subhead",
      content:
        "A header, promo banners in three styles, heroes, rows, grids, an editorial block, categories and one footer, each designed to work on its own.",
    },
    {
      id: "templates-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The homepage has its own kit of twenty-one modules, from a personalized hero and a shade finder to a kit builder. The product tray cycles through hair, nails and beauty by itself.",
    },
    {
      id: "templates-tabshop",
      type: "product-demo",
      folder: "sally-system",
      demo: "homepage-blocks",
      hash: "tabshop",
      title: "Module · Tabbed product tray",
      note: "One shop moment where the stacked product rails used to be.",
      stageWidth: 1440,
      mode: "page",
    },
    {
      id: "templates-levels",
      type: "product-demo",
      folder: "sally-system",
      demo: "homepage-blocks",
      hash: "levels",
      title: "Module · Shade finder",
      note: "Hair color picked by level.",
      stageWidth: 1440,
      mode: "page",
    },

    // ════════════════════════════════════════
    // SECTION 12 — CONTRAST
    // ════════════════════════════════════════
    {
      id: "contrast-header",
      type: "section-header",
      label: "SECTION 12: CONTRAST",
      title: "The eyebrows went solid,",
      pressing: { mark: { n: "12", name: "Ink and White" }, heldLine: "ink on light fields and white on dark." },
    },
    {
      id: "contrast-text",
      type: "text",
      size: "subhead",
      content:
        "A teammate's ADA review of the homepage found muted text on blush failing at about 4.3 to 1, so no eyebrow or kicker there stays red or muted.",
    },
    {
      id: "contrast-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The muted text tier was darkened to .64. Small red text that stays, like tags and prices, uses a deeper red, #B30E1C, which passes at about 4.76 to 1. Red fills, white-on-red buttons and large headline emphasis keep the brand scarlet, and text shadows came out everywhere.",
    },

    // ════════════════════════════════════════
    // SECTION 13 — THE ENGINE
    // ════════════════════════════════════════
    {
      id: "ai-header",
      type: "section-header",
      label: "SECTION 13: THE ENGINE",
      title: "One request",
      pressing: { mark: { n: "13", name: "The Engine" }, heldLine: "fills every channel." },
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
      id: "engine-machine",
      type: "product-demo",
      folder: "sally-push",
      demo: "m-machine",
      mode: "fit",
      title: "From a signal to a finished asset",
      note: "The parts as the Sally Marketing OS names them: the campaign board, the Asset Hub, the scanner.",
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
    // SECTION 14 — EVERY BRIEF
    // ════════════════════════════════════════
    {
      id: "briefs-header",
      type: "section-header",
      label: "SECTION 14: EVERY BRIEF",
      title: "Seven kinds of brief,",
      pressing: { mark: { n: "14", name: "Every Brief" }, heldLine: "five shapes each." },
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
    // SECTION 15 — PUSHED
    // ════════════════════════════════════════
    {
      id: "pushed-header",
      type: "section-header",
      label: "SECTION 15: PUSHED",
      title: "The same concepts,",
      pressing: { mark: { n: "15", name: "Pushed" }, heldLine: "pushed further." },
    },
    {
      id: "pushed-text",
      type: "text",
      size: "subhead",
      content: "An editorial pass in Satoshi on white, with no rules: rounded cards and white space do the separating.",
    },
    {
      id: "pushed-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content: "The Lookbook keeps its layout and every picture, Colorfest gets a lineup, and Pride becomes a takeover made of its looks.",
    },
    {
      id: "pushed-lookbook",
      type: "product-demo",
      folder: "sally-push",
      demo: "lookbook-images",
      title: "The Lookbook, pushed",
      note: "His layout and his pictures, in the new finish.",
      stageWidth: 1440,
      viewHeight: 900,
      mode: "scroll",
    },
    {
      id: "pushed-colorfest",
      type: "product-demo",
      folder: "sally-push",
      demo: "colorfest",
      title: "Colorfest, pushed",
      note: "The brands only Sally carries, set as the festival's lineup.",
      stageWidth: 1440,
      viewHeight: 900,
      mode: "scroll",
    },
    {
      id: "pushed-gloss",
      type: "product-demo",
      folder: "sally-push",
      demo: "the-gloss",
      title: "The Gloss, pushed",
      note: "One story, top to bottom.",
      stageWidth: 600,
      viewHeight: 1100,
      mode: "scroll",
      phone: true,
    },
    {
      id: "pushed-candy",
      type: "product-demo",
      folder: "sally-push",
      demo: "punch-candy",
      title: "Punch · Candy, pushed",
      note: "Every block a color card.",
      stageWidth: 600,
      viewHeight: 1100,
      mode: "scroll",
      phone: true,
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 16: CLOSING",
      title: "The homepage kit grew out",
      pressing: { mark: { n: "16", name: "One Stylesheet" }, heldLine: "of the email system." },
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
      stack: ["Claude", "Figma", "HTML/CSS/JS", "Founders Grotesk"],
      links: [],
      content:
        "The voice is Sally as the beauty-obsessed best friend, the one who makes salon-level results doable at home.",
    },
  ],
};
