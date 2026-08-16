import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/you-by-sally";

export const youBySallyCaseStudy: CaseStudy = {
  slug: "you-by-sally",
  title: "You By Sally",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "A brand campaign for You by Sally, Sally Beauty's hair color line. | Real people instead of models, oversized swatches, and a look that holds from an influencer's bio page to a retail sign.",
  field: "Campaign Direction\nBrand System\nDigital Design\nRetail Signage",
  author: "Jeremy Prasatik",
  published: "2021",
  status: "Live",
  classification: ["Campaign Direction", "Brand System", "Digital Design", "Retail Signage"],
  services: ["Campaign Direction", "Brand System", "Digital Design", "Retail Signage"],
  stack: ["Photoshop", "Illustrator", "InDesign", "Studio photography"],
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
        caption: "Preview · 4 frames",
        colors: ["#E91E63", "#00B8D4", "#141414", "#F5F2ED"],
        images: [
          "/case-studies/you-by-sally/hero.jpg",
          "/case-studies/you-by-sally/bios.jpg",
          "/case-studies/you-by-sally/hero2.jpg",
          "/case-studies/you-by-sally/lockup.jpg",
        ],
      },
      title: "You By\nSally",
      subtitle:
        "A brand campaign for You by Sally, Sally Beauty's hair color line. | Real people instead of models, oversized swatches, and a look that holds from an influencer's bio page to a retail sign.",
      field: "Campaign Direction  Brand System  Digital Design  Retail Signage",
      author: "Jeremy Prasatik",
      published: "2021",
      status: "Live",
      classification: ["Campaign Direction", "Brand System", "Digital Design", "Retail Signage"],
      summary: [
        { label: "Built", value: "Hair color brand campaign. Cast portraits, oversized swatches, a brand kit for bio pages, email and retail signage." },
        { label: "Scope", value: "Campaign direction, brand system, digital design, retail signage." },
        { label: "Tools", value: "Photoshop, Illustrator, InDesign, studio photography. Avenir Next, pink and cyan." },
        { label: "Angle", value: "Casting first, and the portraits led everything after it. Then swatches big enough to pick a shade from." },
      ],
      abstract:
        "Hair color usually sits under fluorescent lights next to the toothpaste, and the brief was to make it feel like something you'd choose on purpose.\n\nIt started with the cast, real people instead of models, and the rest of the campaign came off those portraits.\n\nThe swatches came next. The tiny chips became oversized color blocks on clean grids that ran on mobile, desktop and in-store signage. Avenir Next in three weights, and pink and cyan for the color.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hero.jpg`,
      alt: "You By Sally hair color campaign hero",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE CAST
    // ════════════════════════════════════════
    {
      id: "cast-header",
      type: "section-header",
      label: "SECTION 02: THE CAST",
      title: "Real People,",
      pressing: {
        mark: { n: "02", name: "Real People" },
        heldLine: "Signature Shades.",
        // The casting claim holds while its two blocks travel past it.
        // The headline says who the cast is; the copy underneath says why
        // that inverted the usual shoot order. Split across two screens
        // they read as unrelated, so the headline stays put.
        choreo: { pin: true },
      },
    },
    {
      id: "cast-subhead",
      type: "text",
      size: "subhead",
      content:
        "The cast runs across age, gender and style, and each person is paired with the shade that suits them.",
    },
    {
      id: "cast-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The backgrounds are saturated, the styling is confident, and the product comes second to the person in the frame.",
    },

    // ── Casting hero — full bleed portrait moment
    {
      id: "cast-hero",
      type: "image",
      src: `${IMG}/bios.jpg`,
      alt: "You By Sally cast portraits — real people paired with signature hair color shades on saturated backgrounds",
      aspect: "native",
      padded: true,
      // The zoom. A stack of cast portraits is 3010x4480 — the tallest
      // frame in the portfolio — so the default fit is right: it fills
      // the width and leaves most of the cast below the fold, and
      // scrolling walks down the faces one at a time.
      pressing: {
        plate: "02",
        captions: [
          "The cast",
          "Each paired with a shade",
          "Saturated grounds",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── Second cast frame — climbs across the held portraits
    {
      id: "cast-inline",
      type: "hero",
      image: `${IMG}/hero2.jpg`,
      alt: "You By Sally campaign — additional cast frame on saturated color ground",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── Editorial headline — replaces the original "Color as identity / Not color as chore"
    // line which hit the rhetorical-rhythm-with-replacement AI pattern.
    {
      id: "headline-color",
      type: "editorial-headline",
      text: "Color treated like\na creative decision",
    },

    // ════════════════════════════════════════
    // SECTION 03 — THE SWATCH SYSTEM
    // ════════════════════════════════════════
    {
      id: "swatch-header",
      type: "section-header",
      label: "SECTION 03: THE SWATCH SYSTEM",
      title: "Oversized Swatches",
      // The study's one crossing, held to section 03 so it does not land
      // on the same beat as the zoom above it. pin declared alongside it:
      // the crossing already holds its headline for 220dvh, and saying so
      // out loud gives the swatch screen below a named holder to climb.
      pressing: {
        mark: { n: "03", name: "Oversized Swatches" },
        heldLine: "on a Clean Grid.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "swatch-subhead",
      type: "text",
      size: "subhead",
      content:
        "The chips on the back of a box are tiny. These are big enough that picking a shade is something you do by eye.",
    },
    {
      id: "swatch-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The grid runs from a 320px influencer bio page up to a 6-foot retail sign. The blocks and their order stay put. Only the size changes.",
    },

    // ── Swatch UI screen — climbs the crossing that describes it
    {
      id: "swatch-screen",
      type: "image",
      src: `${IMG}/screen1.png`,
      alt: "You By Sally swatch system on mobile — oversized color blocks in a clean grid",
      aspect: "native",
      padded: true,
      // Rise, not zoom. A tall grid of colour blocks is the kind of frame
      // a zoom rewards, but the export is 2013px wide — short of the
      // 3000px bar — so pinning it at full mat would magnify a bitmap.
      // Climbing lays the grid over the argument for it instead, and the
      // study's one zoom stays on the cast, where the pixels are.
      pressing: { choreo: { rise: true } },
    },

    // ── Influencer bio pair — two mobile mockups side by side, matchHeight'd.
    // blend: multiply lets the white frame around each mockup drop into the
    // cream page background instead of sitting as a hard rectangle.
    {
      id: "bio-pair",
      type: "dual-image",
      transparent: true,
      matchHeight: true,
      blend: "multiply",
      left: {
        src: `${IMG}/sally-beauty-hair-color-campaign-influencer-bio.png`,
        alt: "You By Sally influencer bio page on mobile — saturated portrait with shade name and product link",
      },
      right: {
        src: `${IMG}/sally-beauty-hair-color-campaign-influencer-bio2.png`,
        alt: "You By Sally influencer bio page variant on mobile — second cast member with their signature shade",
      },
    },

    // ════════════════════════════════════════
    // SECTION 04 — MARKS & MATERIALS
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 04: MARKS & MATERIALS",
      title: "Hot Pink, Cyan, Black.\nAvenir Next in Three Weights.",
      introText:
        "Pink for the personality, cyan for the contrast, and black under both so the two loud colors never turn into noise.",
      philosophyText:
        "The pink and the cyan stay the same on every surface, and that is what makes a phone screen and a store sign read as the same brand.\n\nOne type family. Avenir Next Heavy for the wordmark, Demi Bold for the shade names and the SHOP NOW callouts, Medium for everything else. Three weights of one family gave the layouts all the contrast they needed.",
      colors: [
        { name: "Hot Pink", hex: "#E91E63", description: "Primary, personality" },
        { name: "Cyan", hex: "#00B8D4", description: "Contrast, accent" },
        { name: "Black", hex: "#141414", description: "Type, grounding" },
        { name: "Cream", hex: "#F5F2ED", description: "Paper, ground" },
      ],
      fonts: [
        {
          name: "YOU BY SALLY",
          sampleText: "YOU BY SALLY",
          role: "Wordmark",
          description:
            "Avenir Next Heavy, set wide and locked tight, no italics. Big enough that the wordmark works as a graphic block.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 800,
        },
        {
          name: "Avenir Next Demi Bold",
          role: "Shade names & CTAs",
          description:
            "Mid-heavy weight for the shade names, swatch labels, and SHOP NOW callouts. It ties the catalog together.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 600,
        },
        {
          name: "Avenir Next Medium",
          role: "Body & captions",
          description:
            "Standard weight for product copy, descriptions, and longer text. It stays out of the way of the photography and the color blocks.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 500,
        },
      ],
      markImage: `${IMG}/lockup.jpg`,
      markAlt: "You By Sally wordmark lockup with the Avenir Next type system in context",
      markFullBleed: true,
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "Bio Pages, Email,",
      pressing: {
        mark: { n: "04", name: "Where It Ran" },
        heldLine: "Retail Signage.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "If you were picking a shade at Sally Beauty, this is what you were looking at.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Campaign Direction", "Brand System", "Digital Design", "Retail Signage"],
      stack: ["Photoshop", "Illustrator", "InDesign", "Studio photography"],
      links: [],
      content:
        "The cast portraits, the swatch grid and the type went out together, on influencer bio pages, in email and on the signs in the stores.",
    },
  ],
};
