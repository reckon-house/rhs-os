import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/jeffrey-spring";

export const jeffreySpringCaseStudy: CaseStudy = {
  slug: "jeffrey-spring",
  title: "Jeffrey Spring Campaign.",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "High fashion on a studio budget. No location shoots. No heavy production. Foliage as architecture, not decoration.",
  field: "Art Direction\nCampaign Design\nEmail & Web Templates",
  author: "Jeremy Prasatik",
  published: "2017",
  status: "Live",
  classification: ["Art Direction", "Campaign Design", "Email & Web Templates"],
  services: ["Art Direction", "Campaign Design", "Email & Web Templates"],
  stack: ["Photoshop", "InDesign", "Studio photography"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/jeffrey-spring-campaign-simone-rocha-floral-dress-monstera-frame.jpg`,
      alt: "Jeffrey Spring Campaign hero — Simone Rocha black floral dress framed by extreme-cropped monstera leaves on a studio white",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Jeffrey Spring\nCampaign.",
      subtitle:
        "High fashion on a studio budget. No location shoots. No heavy production. Foliage as architecture, not decoration.",
      field: "Art Direction  Campaign Design  Email & Web Templates",
      author: "Jeremy Prasatik",
      published: "2017",
      status: "Live",
      classification: ["Art Direction", "Campaign Design", "Email & Web Templates"],
      abstract:
        "Jeffrey needed a spring campaign that felt global but cost local. The restriction shaped everything.\n\nShot entirely in studio. Used bold foliage crops as structural anchors rather than styling props. Monstera leaves and palm fronds treated like graphic elements, not greenery. Color floods and extreme crops gave the compositions scale without a plane ticket.\n\nTypography followed the same logic. Condensed, stretched, layered to create rhythm across three dress stories: JW Anderson, Valentino, Simone Rocha. Built a system that moved cleanly across email, homepage, and social without redesign. Same visual language, different formats.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — FOLIAGE AS ARCHITECTURE
    // ════════════════════════════════════════
    {
      id: "foliage-header",
      type: "section-header",
      label: "SECTION 02: FOLIAGE AS ARCHITECTURE",
      title: "Leaves as Frame.\nNot Decoration.",
    },
    {
      id: "foliage-subhead",
      type: "text",
      size: "subhead",
      content:
        "Monstera and palm shot like architectural elements. Cropped past the edge so they read as planes, not props. Studio white behind, leaves doing the structural work.",
    },
    {
      id: "foliage-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The brief said spring without saying tropical. The compositions hold the season without a single beach. Each leaf was photographed once, then composed into the dress shots in post — same kit reused across three designer stories.",
    },

    // 2-up: pure foliage texture details
    {
      id: "foliage-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/jeffrey-spring-campaign-monstera-leaf-graphic-detail.jpg`,
        alt: "Single monstera leaf shot tight on white, treated as a graphic element rather than a styling prop",
      },
      right: {
        src: `${IMG}/jeffrey-spring-campaign-palm-frond-texture-detail.jpg`,
        alt: "Palm frond texture detail with sharp blade structure shot on white studio backdrop",
      },
    },

    // ── Inline hero: JW Anderson dress + monstera composition
    {
      id: "jw-hero",
      type: "hero",
      image: `${IMG}/jeffrey-spring-campaign-jw-anderson-striped-dress-monstera-frame.jpg`,
      alt: "JW Anderson blue striped asymmetric dress framed by monstera leaves, second story in the spring dress set",
      inline: true,
    },

    // ── Editorial palate cleanser
    {
      id: "headline-global",
      type: "editorial-headline",
      text: "Global feel.\nLocal cost.",
    },

    // ════════════════════════════════════════
    // SECTION 03 — THE TEMPLATE SYSTEM
    // ════════════════════════════════════════
    {
      id: "templates-header",
      type: "section-header",
      label: "SECTION 03: THE TEMPLATES",
      title: "Same Language.\nEvery Format.",
    },
    {
      id: "templates-subhead",
      type: "text",
      size: "subhead",
      content:
        "Built to scale across email, homepage, and social without redesign. The condensed-stretched-layered type system holds at every size. The foliage frame holds too.",
    },
    {
      id: "templates-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Repeatable week to week with minimal rework. Drop the new dress in, refresh the foliage crop, ship. The system carries the brand voice so individual pieces don't have to.",
    },

    // 2-up: desktop + mobile templates
    {
      id: "templates-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/jeffrey-spring-campaign-desktop-homepage-simone-rocha-in-season-bold.png`,
        alt: "Jeffrey desktop homepage template featuring Simone Rocha dress with IN SEASON BOLD READY & NOW headline alongside the monstera frame",
      },
      right: {
        src: `${IMG}/jeffrey-spring-campaign-mobile-jw-anderson-in-season-bold-shop-now.png`,
        alt: "Jeffrey mobile template featuring JW Anderson dress with the same IN SEASON BOLD headline and SHOP NOW CTA, foliage frame intact at phone scale",
      },
    },

    // ════════════════════════════════════════
    // SECTION 04 — MARKS & MATERIALS
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 04: MARKS & MATERIALS",
      title: "Studio Whites.\nLeaf Greens.",
      introText:
        "Five colors and four type voices. Same system held across three designer stories without a single set change.",
      philosophyText:
        "The palette runs studio white as the ground, monstera green as the architecture, soft black for the type and the dresses that dropped into the set. The dresses themselves bring the seasonal accent — striped blue for JW Anderson, blush florals for Simone Rocha, whatever Valentino was sending that week.\n\nType does the rhythm work. Condensed for the headline. Letter-spaced for the designer name. Body sans for the catalog. Layered together they sound like a magazine spread, not a banner ad.",
      colors: [
        { name: "Studio White", hex: "#F5F2EC", description: "Ground, paper" },
        { name: "Monstera", hex: "#3E5A39", description: "Architecture, frame" },
        { name: "Soft Black", hex: "#1A1A18", description: "Type, dresses" },
        { name: "Striped Blue", hex: "#A8B8C8", description: "JW Anderson accent" },
        { name: "Blush", hex: "#E8C4B8", description: "Simone Rocha florals" },
      ],
      fonts: [
        {
          name: "IN SEASON BOLD",
          sampleText: "IN SEASON BOLD",
          role: "Campaign headline",
          description:
            "Condensed sans uppercase, set wide. The seasonal anchor that ties all three dress stories under one sentence. Holds at desktop banner and at mobile crop.",
          family: "'Bebas Neue', 'Oswald', 'Anton', sans-serif",
          weight: 700,
        },
        {
          name: "SIMONE ROCHA",
          sampleText: "SIMONE ROCHA",
          role: "Designer name",
          description:
            "Letter-spaced sans, mid weight. Names the designer at headline scale. Same treatment whether the name is JW Anderson, Valentino, or Simone Rocha — the system adapts without breaking.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 500,
        },
        {
          name: "Body Catalog",
          role: "Product copy",
          description:
            "Standard sans for product names, descriptions, and pricing. Stays out of the way so the dress and the foliage do the selling.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 400,
        },
        {
          name: "Shop Now",
          sampleText: "SHOP NOW",
          role: "CTA",
          description:
            "Letter-spaced sans for the call to action. Quiet, confident, never shouting. Sits inside the layout instead of fighting for the corner.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 600,
        },
      ],
      markImage: `${IMG}/jeffrey-spring-campaign-desktop-homepage-simone-rocha-in-season-bold.png`,
      markAlt: "Jeffrey desktop homepage as the brand expression in context — wordmark, type system, and foliage architecture all visible in one frame",
      markFullBleed: true,
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "A Campaign Built\nfor the Studio.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Foliage, type, layout. Same kit across three designer stories, three formats, every week of the season.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Art Direction", "Campaign Design", "Email & Web Templates"],
      stack: ["Photoshop", "InDesign", "Studio photography"],
      links: [],
      content:
        "A retailer needed spring without the budget for spring. The system answers in foliage and typography — both shot once, both reused across every story the season needed.",
    },
  ],
};
