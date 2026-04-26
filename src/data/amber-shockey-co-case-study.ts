import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/amber-shockey-co";

export const amberShockeyCoCaseStudy: CaseStudy = {
  slug: "amber-shockey-co",
  title: "Amber Shockey & Co.",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Tableware pattern design. Four collections built to layer, mix, and scale from single accent to full table.",
  field: "Pattern Design\nProduct Design\nColorway Development",
  author: "Jeremy Prasatik",
  published: "2017",
  status: "Live",
  classification: ["Pattern Design", "Product Design", "Colorway Development"],
  services: ["Pattern Design", "Product Design", "Colorway Development"],
  stack: ["Illustrator", "Photoshop", "InDesign"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/amber-shockey-co-blue-florals-plates-stacked-on-peony-pattern-collection-mockup.jpg`,
      alt: "Amber Shockey & Co. blue florals collection, layered plates set against a peony pattern field in matching cobalt and cream",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Amber Shockey\n& Co.",
      subtitle:
        "Tableware pattern design. Four collections built to layer, mix, and scale from single accent to full table.",
      field: "Pattern Design  Product Design  Colorway Development",
      author: "Jeremy Prasatik",
      published: "2017",
      status: "Live",
      classification: ["Pattern Design", "Product Design", "Colorway Development"],
      abstract:
        "Tableware patterns built as systems. Each collection runs hero, secondary, accent. Designed to layer from a single dish to a full setting without losing logic.\n\nFour directions. Blue florals, red dragons, black linework, geometric grid. Each balances structured against organic. Each carries multiple colorways so the same set flexes from minimal to maximal depending on how it pairs.\n\nBuilt for a tableware startup that needed a system, not a single pattern. Pattern design, product design, and colorway development as one continuous process.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE COLLECTIONS
    // ════════════════════════════════════════
    {
      id: "collections-header",
      type: "section-header",
      label: "SECTION 02: THE COLLECTIONS",
      title: "Four Directions.\nOne Logic.",
    },
    {
      id: "collections-subhead",
      type: "text",
      size: "subhead",
      content:
        "Blue florals. Red dragons. Black linework. Geometric grid. Each collection a complete language, designed to read alone or as a set.",
    },
    {
      id: "collections-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Patterns balance structured against organic. Dragons against florals. Linear grids against scattered dots. The contrasts are intentional. The point isn't variety for its own sake. It's range built from a single rule.",
    },

    // ── Three collection mockups
    {
      id: "collections-triple",
      type: "triple-image",
      images: [
        {
          src: `${IMG}/amber-shockey-co-blue-florals-plates-stacked-on-peony-pattern-collection-mockup.jpg`,
          alt: "Blue florals collection, plates layered on peony pattern background",
        },
        {
          src: `${IMG}/amber-shockey-co-black-linework-geometric-plates-marble-surface-collection-mockup.jpg`,
          alt: "Black linework collection, geometric plates on marble surface",
        },
        {
          src: `${IMG}/amber-shockey-co-red-dragons-plates-stacked-on-dragon-pattern-collection-mockup.jpg`,
          alt: "Red dragons collection, plates set against dragon pattern backdrop",
        },
      ],
    },

    // ── Editorial palate cleanser
    {
      id: "headline-system",
      type: "editorial-headline",
      text: "Pattern as system\nNot decoration",
    },

    // ════════════════════════════════════════
    // SECTION 03 — THE MARKS
    // ════════════════════════════════════════
    {
      id: "marks-header",
      type: "section-header",
      label: "SECTION 03: THE MARKS",
      title: "Hero. Secondary.\nAccent.",
    },
    {
      id: "marks-subhead",
      type: "text",
      size: "subhead",
      content:
        "Every collection resolves to three marks. A hero motif, a secondary, an accent. Layered together they make a setting. Used alone, each one carries the brand.",
    },
    {
      id: "marks-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The structure lets a buyer start with a single accent piece and grow the set over time. Or commit to a full collection in one buy. The marks were drawn as a family before any single one was finished.",
    },

    // ── Triple of red dragons + black linework hero marks
    {
      id: "marks-triple-1",
      type: "triple-image",
      images: [
        {
          src: `${IMG}/amber-shockey-co-red-dragons-burgundy-dragon-mandala-hero-mark.jpg`,
          alt: "Red dragons hero mark: burgundy dragon mandala in circle",
        },
        {
          src: `${IMG}/amber-shockey-co-red-dragons-burgundy-floral-diamond-secondary-mark.jpg`,
          alt: "Red dragons secondary mark: burgundy floral diamond",
        },
        {
          src: `${IMG}/amber-shockey-co-black-linework-diamond-cross-pattern-mark.jpg`,
          alt: "Black linework hero mark: navy diamond with cross pattern",
        },
      ],
    },

    // ── Triple of geometric collection marks
    {
      id: "marks-triple-2",
      type: "triple-image",
      images: [
        {
          src: `${IMG}/amber-shockey-co-black-linework-halftone-dot-circle-mark.jpg`,
          alt: "Black linework accent mark: halftone dot circle on navy",
        },
        {
          src: `${IMG}/amber-shockey-co-geometric-linework-circle-blue-cream-pattern-hero-mark.jpg`,
          alt: "Geometric collection hero mark: linework circle pattern in blue and cream",
        },
        {
          src: `${IMG}/amber-shockey-co-geometric-diamond-blue-cream-accent-mark.jpg`,
          alt: "Geometric collection accent mark: clean blue diamond on grey-blue",
        },
      ],
    },

    // ── Construction view (system thinking made visible)
    {
      id: "marks-construction",
      type: "image",
      src: `${IMG}/amber-shockey-co-geometric-diamond-blue-construction-grid-system-mark.jpg`,
      alt: "Geometric diamond accent mark with construction grid behind, showing the underlying geometry",
      aspect: "native",
      padded: true,
    },

    // ════════════════════════════════════════
    // SECTION 04 — PATTERN FIELDS
    // ════════════════════════════════════════
    {
      id: "fields-header",
      type: "section-header",
      label: "SECTION 04: PATTERN FIELDS",
      title: "From a Single Plate\nto Wallpaper.",
    },
    {
      id: "fields-subhead",
      type: "text",
      size: "subhead",
      content:
        "The same patterns scale to wall covering, table linen, packaging. Built once. Re-rendered for every surface the brand needed.",
    },

    {
      id: "fields-pattern",
      type: "image",
      src: `${IMG}/amber-shockey-co-blue-florals-peony-wallpaper-pattern-field.jpg`,
      alt: "Blue florals peony pattern at wallpaper scale, showing the full repeat tile and rhythm",
      aspect: "native",
      padded: true,
    },

    // ════════════════════════════════════════
    // SECTION 05 — MARKS & MATERIALS
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 05: MARKS & MATERIALS",
      title: "A Family of Patterns.\nA Single System.",
      introText:
        "Five colors. Two faces. One rule. The whole collection scales out of a small set of decisions made once and held across every direction.",
      philosophyText:
        "Patterns work as a family. A buyer can start with one accent dish in cobalt and end up with a full red-dragons setting two seasons later. Nothing in the second buy fights anything in the first.\n\nThe palette runs cobalt for florals, burgundy for dragons, charcoal for linework, blush for geometry, with cream as the shared ground. Type stays editorial in the wordmark, neutral in the catalog. Decoration lives in the patterns, not the type.",
      colors: [
        { name: "Cream", hex: "#ECE6D5", description: "Shared ground" },
        { name: "Cobalt", hex: "#1F4D78", description: "Florals, geometry" },
        { name: "Blush", hex: "#D87A82", description: "Geometry accent" },
        { name: "Burgundy", hex: "#8E3F40", description: "Red dragons" },
        { name: "Charcoal", hex: "#1F2434", description: "Linework, ground" },
      ],
      fonts: [
        {
          name: "Caslon",
          sampleText: "Caslon",
          role: "Wordmark",
          description:
            "Classic serif with editorial warmth. Used for the wordmark and section headers. Sets the tone before a single pattern is seen.",
          family: "'Caslon', 'Adobe Caslon Pro', 'Garamond', serif",
          weight: 400,
        },
        {
          name: "Avenir Next",
          role: "Body & catalog",
          description:
            "Neutral sans-serif for catalog copy, captions, and pricing. Stays out of the way so the patterns lead.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 500,
        },
        {
          name: "Caslon Italic",
          role: "Editorial detail",
          description:
            "Italic variant for collection names and editorial moments in the catalog.",
          family: "'Caslon', 'Adobe Caslon Pro', 'Garamond', serif",
          weight: 400,
        },
        {
          name: "Avenir Next Demi Bold",
          role: "Labels & nav",
          description:
            "Heavier weight for navigation and structural labels. Anchors the page without competing with the patterns.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 600,
        },
      ],
      markImage: `${IMG}/amber-shockey-co-red-dragons-burgundy-dragon-mandala-hero-mark.jpg`,
      markAlt: "Amber Shockey & Co. red dragons hero mark, burgundy dragon mandala on muted rose ground",
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "The Set Builds Itself.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Pattern, product, color. Same hands across the system, so each new direction inherits the logic.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Pattern Design", "Product Design", "Colorway Development"],
      stack: ["Illustrator", "Photoshop", "InDesign"],
      links: [],
      content:
        "A startup needed patterns that could carry a full tableware line without locking into a single look. The system answers in three marks per collection and shared ground colors across all four. New directions slot in without breaking the family.",
    },
  ],
};
