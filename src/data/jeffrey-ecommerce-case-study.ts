import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/jeffrey-ecommerce";

export const jeffreyEcommerceCaseStudy: CaseStudy = {
  slug: "jeffrey-ecommerce",
  title: "Jeffrey New York",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "First digital flagship for the NYC retailer. Full ecommerce launch - brand system, site architecture, and content engine built from zero.",
  field: "Digital Strategy\nBrand System\nEcommerce Design\nUX Architecture",
  author: "Jeremy Prasatik",
  published: "2015",
  status: "Live",
  classification: ["Digital Strategy", "Brand System", "Ecommerce Design", "UX Architecture"],
  services: ["Digital Strategy", "Brand System", "Ecommerce Design", "UX Architecture"],
  stack: ["Photoshop", "Illustrator", "Sketch", "InVision"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/jeffrey-new-york-digital-flagship-hero.jpg`,
      alt: "Jeffrey New York digital flagship hero",
    },

    // ── META + ABSTRACT ──
    {
      id: "meta",
      type: "meta",
      title: "Jeffrey\nNew York",
      subtitle:
        "First digital flagship for the NYC retailer. Full ecommerce launch - brand system, site architecture, and content engine built from zero.",
      field: "Digital Strategy  Brand System  Ecommerce Design  UX Architecture",
      author: "Jeremy Prasatik",
      published: "2015",
      status: "Live",
      classification: ["Digital Strategy", "Brand System", "Ecommerce Design", "UX Architecture"],
      abstract:
        "Jeffrey had never sold online. The physical store was a gallery with a curator's eye, and the challenge was translating that into a digital channel without flattening it into a catalog.\n\nI started with the buying team - learned how the floor worked, how pieces were grouped, what made the edit feel like Jeffrey. The strategy I pitched and won was simple: storytelling over transaction. Designer launches, weekly content drops, editorial pacing baked into the structure.\n\nBuilt the full system from there - modular grids for seasonal flexibility, typography hierarchy that stayed sharp across contexts, product pages that led with imagery, navigation centered on curation rather than categories. Handled the integration work alongside external partners while keeping ownership of the experience, with every interaction from wireframe to checkout prototyped to feel intentional.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE STRATEGY
    // ════════════════════════════════════════
    {
      id: "strategy-header",
      type: "section-header",
      label: "SECTION 02: THE STRATEGY",
      title: "Storytelling Over\nTransaction.",
    },
    {
      id: "strategy-subhead",
      type: "text",
      size: "subhead",
      content:
        "The pitch that won: a digital channel that worked the way the store worked. Designer launches as moments, weekly content drops as a rhythm, editorial pacing as the structure itself.",
    },
    {
      id: "strategy-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "I sat with the buying team to learn how the floor worked - how pieces were grouped, how seasons shifted, what made the edit read as Jeffrey. The site needed to behave like the store, which meant designing the publishing system before the product templates.",
    },

    // ── Inline scaling hero — second hero frame as visual breath.
    // cropWide: image is intentionally super wide. Container clips the left/right
    // so the homepage tile reads as a fragment of something larger continuing
    // off-frame in both directions.
    {
      id: "strategy-inline",
      type: "hero",
      image: `${IMG}/jeffrey-new-york-homepage-template-grid-mockups.png`,
      alt: "Jeffrey New York site in context — homepage with editorial hero and curated grid",
      inline: true,
      cropWide: true,
    },

    // ── Editorial headline — replaces the original closing's
    // "established digital presence for seasons to come" performative line.
    {
      id: "headline-flagship",
      type: "editorial-headline",
      text: "A flagship,\nnot a storefront",
    },

    // ════════════════════════════════════════
    // SECTION 03 — THE SYSTEM
    // ════════════════════════════════════════
    {
      id: "system-header",
      type: "section-header",
      label: "SECTION 03: THE SYSTEM",
      title: "Modular Grids,\nCurated Navigation.",
    },
    {
      id: "system-subhead",
      type: "text",
      size: "subhead",
      content:
        "Modular grids for seasonal flexibility, typography hierarchy that held sharp across contexts, product pages that led with imagery, navigation organized around curation instead of categories.",
    },
    {
      id: "system-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The grid let merchandising compose seasonal layouts without touching the underlying templates - swap photography, swap copy, ship. Type stayed structural rather than decorative, which is what kept the site from drifting toward catalog feel as the store grew.",
    },

    // ── PDP screen — static centered image, not an animated hero
    {
      id: "pdp-hero",
      type: "image",
      src: `${IMG}/jeffrey-new-york-product-detail-page-sacai-luck-dress.jpg`,
      alt: "Jeffrey New York product detail page — large imagery, minimal chrome, curated cross-sells",
      aspect: "native",
      padded: true,
    },

    // ── Hero3 inline — third frame as a third visual beat
    {
      id: "hero3-inline",
      type: "hero",
      image: `${IMG}/jeffrey-new-york-homepage-editorial-spread.jpg`,
      alt: "Jeffrey New York site in context — additional editorial hero",
      inline: true,
    },

    // ── System screens — multiple page templates in context
    {
      id: "system-screens",
      type: "image",
      src: `${IMG}/jeffrey-new-york-system-spread-homepage-designer-product-templates.png`,
      alt: "Jeffrey New York system spread — homepage, designer page, and product templates rendered together",
      aspect: "native",
      padded: true,
    },

    // ════════════════════════════════════════
    // SECTION 04 — MARKS & MATERIALS
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 04: MARKS & MATERIALS",
      title: "A Quiet Type System\nDoing the Structural Work.",
      introText:
        "One typeface across weights, a restrained palette, and a logo lockup that sat as a graphic mark before it sat as a name. The kit ran the same way at every scale.",
      philosophyText:
        "The palette stays narrow on purpose. Charcoal carries the type and the structural weight, cream sits as the ground that lets the photography do the talking, and a single yellow accent - pulled straight from the wordmark - ties the editorial moments together. No second accent, no decorative color - the merchandise brings whatever it needs.\n\nType is one family across weights. Avenir Next Heavy carried the wordmark and feature headlines, Demi Bold carried subheads and CTAs, Medium carried the rest. The single family kept the system tight, and the weight contrast did the work that a multi-font stack would otherwise have to.",
      colors: [
        { name: "Charcoal", hex: "#1A1A1A", description: "Type, structure" },
        { name: "Cream", hex: "#F5F2ED", description: "Paper, ground" },
        { name: "Brand Yellow", hex: "#FFFF40", description: "Wordmark, accent" },
        { name: "Soft Gray", hex: "#8C8578", description: "Meta, captions" },
      ],
      fonts: [
        {
          name: "JEFFREY",
          sampleText: "JEFFREY",
          role: "Wordmark",
          description:
            "Avenir Next Heavy Italic at scale. The same wordmark that anchored the storefront, set wide and locked tight as a graphic mark.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 800,
          italic: true,
        },
        {
          name: "Avenir Next Heavy",
          role: "Feature headlines",
          description:
            "Heaviest non-italic weight, used for designer launches and editorial moments. Pairs with the wordmark as the loudest the system gets.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 800,
        },
        {
          name: "Avenir Next Demi Bold",
          role: "Subhead & CTAs",
          description:
            "Mid-heavy weight for subheads, callouts, and CTAs. The structural voice that ties the catalog together.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 600,
        },
        {
          name: "Avenir Next Medium",
          role: "Body & captions",
          description:
            "Standard weight for product copy, descriptions, and longer-form text. Quiet enough to let the photography lead.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 500,
        },
      ],
      markImage: `${IMG}/jeffrey-new-york-wordmark-logo-lockup.jpg`,
      markAlt: "Jeffrey New York logo lockup with the Avenir Next type system in context",
    },

    // ════════════════════════════════════════
    // SECTION 05 — THE BUILD RADIUS
    // (Radial diagram showing the brand experience propagating through every
    // surface of the digital flagship. Same chart language as the Ivy Park
    // campaign blast radius, retuned to Jeffrey's wordmark yellow.)
    // ════════════════════════════════════════
    {
      id: "build-header",
      type: "section-header",
      label: "SECTION 05: THE BUILD RADIUS",
      title: "One System,\nEvery Surface.",
    },
    {
      id: "build-subhead",
      type: "text",
      size: "subhead",
      content:
        "Wordmark, type, grid, photography - one kit propagating from the brand experience out through every surface the customer touched.",
    },
    {
      id: "flagship-radius",
      type: "jeffrey-flagship-radius",
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "A Digital Flagship\nBuilt Like the Store.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Strategy, brand, architecture, content - one system that ran on the same curatorial logic as the physical store.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Digital Strategy", "Brand System", "Ecommerce Design", "UX Architecture"],
      stack: ["Photoshop", "Illustrator", "Sketch", "InVision"],
      links: [],
      content:
        "Jeffrey's first digital channel, built to behave like the store rather than a catalog. The publishing system shipped before the product templates, which is what kept the site reading as editorial instead of inventory. A flagship, not a storefront.",
    },
  ],
};
