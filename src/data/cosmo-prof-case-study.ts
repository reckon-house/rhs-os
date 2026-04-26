import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/cosmo-prof";

export const cosmoProfCaseStudy: CaseStudy = {
  slug: "cosmo-prof",
  title: "Cosmo Prof.",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "Digital experience for a B2B salon retailer. Elevated photography, simplified navigation, and shoppable components built for working stylists.",
  field: "Creative Direction\nDigital Design\nPhotography Direction",
  author: "Jeremy Prasatik",
  published: "2021",
  status: "Live",
  classification: ["Creative Direction", "Digital Design", "Photography Direction"],
  services: ["Creative Direction", "Digital Design", "Photography Direction"],
  stack: ["Figma", "Sketch", "Photoshop"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/cosmo-prof-photography-direction-hair-color-brushes-product-detail-quad-composition.jpg`,
      alt: "Cosmo Prof photography direction, four-quadrant composition: hair color stroke, color tube detail, product lineup, and Framar applicator brushes",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Cosmo Prof.",
      subtitle:
        "Digital experience for a B2B salon retailer. Elevated photography, simplified navigation, and shoppable components built for working stylists.",
      field: "Creative Direction  Digital Design  Photography Direction",
      author: "Jeremy Prasatik",
      published: "2021",
      status: "Live",
      classification: ["Creative Direction", "Digital Design", "Photography Direction"],
      abstract:
        "Cosmo Prof needed a digital refresh that matched the professionals using it. The existing site was functional but dated. The goal: modern visual direction and clearer product discovery without slowing down commerce.\n\nStarted with photography. High-contrast lighting, defined shadows, cleaner compositions. Product imagery that looks intentional rather than catalog. Typography shifted to Jost. The palette paired soft neutrals with sharp black to ground the tone.\n\nThe redesigned homepage introduced tabbed recommendations personalized per stylist. Shoppable video let users explore looks and purchase during playback. The global header stripped back to give screen space to content. Templates unified product photography, type, and layout across the site.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — PHOTOGRAPHY DIRECTION
    // ════════════════════════════════════════
    {
      id: "photo-header",
      type: "section-header",
      label: "SECTION 02: PHOTOGRAPHY DIRECTION",
      title: "Lit Like a Studio.\nShot Like a Catalog.",
    },
    {
      id: "photo-subhead",
      type: "text",
      size: "subhead",
      content:
        "High-contrast lighting. Defined shadows. Compositions that read at thumbnail and hold up at full bleed. Product imagery that looks intentional, not photographed for inventory.",
    },
    {
      id: "photo-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Photography came first because nothing else mattered if the imagery still felt like a 2010 catalog. Each frame defined what a good Cosmo Prof picture looked like, then the templates that followed pulled from that library.",
    },

    // Hero-carousel — cycles through the photography library so the section
    // shows the range, not a single frame. Full-bleed and scroll-reactive,
    // matching the opening hero treatment.
    {
      id: "photo-carousel",
      type: "hero-carousel",
      slides: [
        {
          src: `${IMG}/cosmo-prof-photography-direction-maria-nila-colour-masque-pink-cream-splatters.jpg`,
          alt: "Maria Nila Colour Masque product photography on cream-and-blush ground with splattered pearl droplets framing the jar",
        },
        {
          src: `${IMG}/carousel/cosmo-prof-photography-shine-zero-lift-tubes-droplet-twin-macro.jpg`,
          alt: "Shine Zero Lift twin tube macro on pink ground with cream pearl droplets at the seal",
        },
        {
          src: `${IMG}/carousel/cosmo-prof-photography-framar-applicator-brushes-gold-pink-trio.jpg`,
          alt: "Framar applicator brush trio in gold and rose, fanned across a white frame on pink ground with pastel droplets",
        },
        {
          src: `${IMG}/carousel/cosmo-prof-photography-wella-shinefinity-product-tube-box-lineup.jpg`,
          alt: "Wella Shinefinity Zero Lift Glaze tube and box lineup arranged on pink ground with pearl droplet accents",
        },
        {
          src: `${IMG}/carousel/cosmo-prof-photography-hair-color-mask-application.jpg`,
          alt: "Copper hair color stroke applied with brush across a white frame on pink ground, framed by pastel droplets",
        },
      ],
    },

    // ── Editorial palate cleanser
    {
      id: "headline-pros",
      type: "editorial-headline",
      text: "Professional tools\npresented professionally",
    },

    // ════════════════════════════════════════
    // SECTION 03 — HOMEPAGE & SHOPPABLE
    // ════════════════════════════════════════
    {
      id: "home-header",
      type: "section-header",
      label: "SECTION 03: HOMEPAGE",
      title: "Stripped Header.\nMore Content.",
    },
    {
      id: "home-subhead",
      type: "text",
      size: "subhead",
      content:
        "Global navigation reduced to category names. Hero gives the seasonal launch room to land. Below the fold, tabs sort recommendations to whoever is logged in.",
    },
    {
      id: "home-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Personalization runs as a tabbed shelf, not a take-over. A stylist sees what they buy first, then the catalog underneath. The homepage doesn't pretend to know more than it does.",
    },

    {
      id: "home-hero",
      type: "image",
      src: `${IMG}/cosmo-prof-ui-website-homepage-shinefinity-hero-product-mockup.png`,
      alt: "Cosmo Prof homepage with stripped global header, Shinefinity launch hero, and product mockup at right",
      aspect: "native",
      padded: true,
    },

    {
      id: "home-pros",
      type: "image",
      src: `${IMG}/cosmo-prof-ui-website-for-the-pros-shoppable-video-product-tabs.png`,
      alt: "For The Pros shoppable video module with tabbed product recommendations: Shop The Video, Featured Products, Bestsellers, Sale",
      aspect: "native",
      padded: true,
    },

    {
      id: "home-secondary",
      type: "image",
      src: `${IMG}/cosmo-prof-ui-website-homepage-2.png`,
      alt: "Cosmo Prof homepage variant showing further down the page with category cards and editorial features",
      aspect: "native",
      padded: true,
    },

    // ════════════════════════════════════════
    // SECTION 04 — MOBILE
    // ════════════════════════════════════════
    {
      id: "mobile-header",
      type: "section-header",
      label: "SECTION 04: MOBILE",
      title: "Same System.\nSmaller Frame.",
    },
    {
      id: "mobile-subhead",
      type: "text",
      size: "subhead",
      content:
        "Mobile starts with the same content priorities. Tabs become swipes. The hero crops vertical without losing the product. The catalog fits one column without feeling cramped.",
    },

    {
      id: "mobile-dual",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/cosmo-prof-ui-website-homepage-mobile.png`,
        alt: "Cosmo Prof mobile homepage, primary view with cropped hero and stacked content",
      },
      right: {
        src: `${IMG}/cosmo-prof-ui-website-homepage-mobile2.png`,
        alt: "Cosmo Prof mobile homepage, scrolled view showing personalized recommendations and category navigation",
      },
    },

    // ════════════════════════════════════════
    // SECTION 05 — MARKS & MATERIALS
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 05: MARKS & MATERIALS",
      title: "Soft Neutrals,\nSharp Black.",
    introText:
        "A palette that lets the photography lead. A type system that scales from header lockup to catalog caption without changing voice.",
      philosophyText:
        "Cosmo Prof sells to working professionals. The brand had to feel premium without getting precious about it. Soft neutrals carry the warmth, sharp black does the structural lifting.\n\nJost runs the whole system. Block weights for the wordmark and category nav. Regular for catalog copy. The single family keeps the site from fragmenting into a dozen voices the way most B2B sites do.",
      colors: [
        { name: "Cream", hex: "#F8F6F2", description: "Paper, cards" },
        { name: "Blush", hex: "#F4D9DC", description: "Hero accent" },
        { name: "Stone", hex: "#DBC5C8", description: "Soft mid-tone" },
        { name: "Sand", hex: "#E5D6C9", description: "Warm neutral" },
        { name: "Black", hex: "#000000", description: "Type, structure" },
      ],
      fonts: [
        {
          name: "Jost ExtraBold",
          sampleText: "Cosmo Prof",
          role: "Wordmark & nav",
          description:
            "Heavy geometric grotesque for the COSMO PROF lockup and primary category navigation. Block weight that reads at thumbnail.",
          family: "'Jost', 'Inter', 'Helvetica Neue', sans-serif",
          weight: 800,
        },
        {
          name: "Jost Medium",
          role: "Section headlines",
          description:
            "Mid-weight Jost for module headlines like Introducing, For The Pros, Hair Care. Carries scale without leaning hard.",
          family: "'Jost', 'Inter', 'Helvetica Neue', sans-serif",
          weight: 500,
        },
        {
          name: "Jost Regular",
          role: "Body & catalog",
          description:
            "Standard weight for catalog copy, product names, descriptions. The default voice everywhere outside of the navigation.",
          family: "'Jost', 'Inter', 'Helvetica Neue', sans-serif",
          weight: 400,
        },
        {
          name: "Jost Light",
          role: "Captions & meta",
          description:
            "Light weight for captions, pricing meta, secondary information. Stays quiet so the photography stays loud.",
          family: "'Jost', 'Inter', 'Helvetica Neue', sans-serif",
          weight: 300,
        },
      ],
      markImage: `${IMG}/cosmo-prof-ui-website-homepage-shinefinity-hero-product-mockup.png`,
      markAlt: "Cosmo Prof homepage as a mark moment, showing the wordmark in context above the global header strip",
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "B2B That Reads\nAs Brand.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Photography, type, layout, components. Built as one system so promotions, brand campaigns, and education modules all sit on the same chassis.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Creative Direction", "Digital Design", "Photography Direction"],
      stack: ["Figma", "Sketch", "Photoshop"],
      links: [],
      content:
        "A B2B retailer needed a digital experience that matched the professionals using it. Photography led the refresh. Templates carried the system across promotions, brand campaigns, and education without breaking. Same chassis, every page.",
    },
  ],
};
