import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/you-by-sally";

export const youBySallyCaseStudy: CaseStudy = {
  slug: "you-by-sally",
  title: "You By Sally",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Brand campaign turning hair dye from drugstore aisle to creative decision. Real cast, bold swatches, and a system that holds across every surface.",
  field: "Campaign Direction\nBrand System\nDigital Design\nRetail Signage",
  author: "Jeremy Prasatik",
  published: "2021",
  status: "Live",
  classification: ["Campaign Direction", "Brand System", "Digital Design", "Retail Signage"],
  services: ["Campaign Direction", "Brand System", "Digital Design", "Retail Signage"],
  stack: ["Photoshop", "Illustrator", "InDesign", "Studio photography"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hero.jpg`,
      alt: "You By Sally hair color campaign hero",
    },

    // ── META + ABSTRACT ──
    {
      id: "meta",
      type: "meta",
      title: "You By\nSally",
      subtitle:
        "A hair color brand campaign for Sally Beauty. Real cast, oversized swatches, and a system built to scale from influencer bio pages to retail signage without losing recognition.",
      field: "Campaign Direction  Brand System  Digital Design  Retail Signage",
      author: "Jeremy Prasatik",
      published: "2021",
      status: "Live",
      classification: ["Campaign Direction", "Brand System", "Digital Design", "Retail Signage"],
      abstract:
        "Hair color usually lives under fluorescent lights next to the toothpaste. The brief was to make it feel like something you choose, not something you grab.\n\nStarted with casting - real people across age, gender, and style, each paired with a signature shade. The portraits drove the campaign - saturated backgrounds, confident styling, personality leading and product following.\n\nThe swatch system turned shade exploration into a visual decision rather than a technical one. Oversized color blocks replaced tiny chips, and clean grids made browsing intuitive across mobile, desktop, and in-store signage. Avenir Next across weights anchored the type, pink and cyan held the primary chromatic register, and the system scaled from influencer bio pages to email to retail without losing recognition.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE CAST
    // ════════════════════════════════════════
    {
      id: "cast-header",
      type: "section-header",
      label: "SECTION 02: THE CAST",
      title: "Real People,\nSignature Shades.",
    },
    {
      id: "cast-subhead",
      type: "text",
      size: "subhead",
      content:
        "Casting drove the campaign. Real people across age, gender, and style, each paired with the shade that suited them.",
    },
    {
      id: "cast-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Saturated backgrounds and confident styling let the portraits carry the brand. Product photography sat second to personality, which inverted the usual hair-color shoot order.",
    },

    // ── Casting hero — full bleed portrait moment
    {
      id: "cast-hero",
      type: "image",
      src: `${IMG}/bios.jpg`,
      alt: "You By Sally cast portraits — real people paired with signature hair color shades on saturated backgrounds",
      aspect: "native",
      padded: true,
    },

    // ── Inline scaling hero — second cast frame as visual breath
    {
      id: "cast-inline",
      type: "hero",
      image: `${IMG}/hero2.jpg`,
      alt: "You By Sally campaign — additional cast frame on saturated color ground",
      inline: true,
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
      title: "Shade Exploration\nat Eye Level.",
    },
    {
      id: "swatch-subhead",
      type: "text",
      size: "subhead",
      content:
        "Oversized color blocks replaced the tiny chips that usually live on the back of a box. Clean grids made browsing intuitive across mobile, desktop, and in-store signage.",
    },
    {
      id: "swatch-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The grid logic carried the same way at every scale - from a 320px influencer bio page to a 6-foot retail sign. Same blocks, same hierarchy, just sized to the surface.",
    },

    // ── Swatch UI screen
    {
      id: "swatch-screen",
      type: "image",
      src: `${IMG}/screen1.png`,
      alt: "You By Sally swatch system on mobile — oversized color blocks in a clean grid",
      aspect: "native",
      padded: true,
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
      title: "A Palette Tuned\nto Hold a Color Aisle.",
      introText:
        "Pink and cyan as the chromatic register, black for grounding, Avenir Next across weights. The same kit ran from influencer bio pages to retail signage without changing voice.",
      philosophyText:
        "Pink set the personality, cyan set the contrast, and black anchored every layout so the saturated palette never tipped into noise. The chromatic register stayed consistent across every surface, which is what made the system recognizable from a phone screen and from a 6-foot retail sign at the same time.\n\nType is one family. Avenir Next Heavy carried the wordmark, Demi Bold carried the shade names and CTAs, Medium carried the rest. The single family kept the system tight, and the weight contrast did the work that a multi-font stack usually has to.",
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
            "Avenir Next Heavy at scale. Set wide, locked tight, no italics. The wordmark sits as a block of type that reads as a graphic mark before it reads as a word.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 800,
        },
        {
          name: "Avenir Next Demi Bold",
          role: "Shade names & CTAs",
          description:
            "Mid-heavy weight for the shade names, swatch labels, and SHOP NOW callouts. The structural voice that ties the catalog together.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 600,
        },
        {
          name: "Avenir Next Medium",
          role: "Body & captions",
          description:
            "Standard weight for product copy, descriptions, and longer-form text. Quiet enough to let the photography and color blocks lead.",
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
      title: "A Brand That Treats\nColor as a Choice.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Casting, swatches, type, color - one kit running from a phone bio page to a retail sign without changing voice.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Campaign Direction", "Brand System", "Digital Design", "Retail Signage"],
      stack: ["Photoshop", "Illustrator", "InDesign", "Studio photography"],
      links: [],
      content:
        "A hair color brand campaign that took the casting seriously and let the personality lead. The swatch system turned shade exploration from a technical task into a visual one, and the type system held the same shape from a phone bio page to retail signage.",
    },
  ],
};
