import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/hill-country-oak";

export const hillCountryOakCaseStudy: CaseStudy = {
  slug: "hill-country-oak",
  title: "Hill Country Oakworks.",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Campaign for a Texas barrel maker. Sun-washed color, heritage silhouette, land and craft.",
  field: "Art Direction\nCampaign Design",
  author: "Jeremy Prasatik",
  published: "2019",
  status: "Live",
  classification: ["Art Direction", "Campaign Design"],
  services: ["Art Direction", "Campaign Design"],
  stack: ["Illustrator", "Photoshop", "InDesign"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hill-country-oakworks-outdoor-banner-whiskey-barrels-colorful-background-tree-texas-born-oakcraft.jpg`,
      alt: "Hill Country Oakworks outdoor banner, color-blocked whiskey barrel composition with TEXAS BORN OAKCRAFT tagline at scale",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Hill Country\nOakworks.",
      subtitle:
        "Campaign for a Texas barrel maker. Sun-washed color, heritage silhouette, land and craft.",
      field: "Art Direction  Campaign Design",
      author: "Jeremy Prasatik",
      published: "2019",
      status: "Live",
      classification: ["Art Direction", "Campaign Design"],
      abstract:
        "Texas oak, whiskey barrels, and the landscape that grows both. The brand needed a visual language that could carry from billboard to phone screen without losing the heritage feeling.\n\nThe system pulls from mid-century poster design - warm color blocking, silhouetted trees, geometric shapes that echo the barrel geometry. Typography stays utilitarian, and a distressed texture gives the whole thing weight without feeling forced.\n\nBuilt to scale across billboard, print, and digital out of a single graphic idea.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — VISUAL LANGUAGE
    // (Combines the former separate Visual Language + Typography sections.
    // The typography is part of the visual language, not adjacent to it.)
    // ════════════════════════════════════════
    {
      id: "lang-header",
      type: "section-header",
      label: "SECTION 02: VISUAL LANGUAGE",
      title: "Mid-Century Posters\nMeet Workshop Type.",
    },
    {
      id: "lang-subhead",
      type: "text",
      size: "subhead",
      content:
        "Color blocking, tree silhouettes, a heavy geometric sans used at scale. The kit does the work the imagery doesn't need to.",
    },
    {
      id: "lang-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The brief called for heritage without falling into Western cliché. Reference set: mid-century travel posters. Bold flat color, silhouetted nature, a wordmark that holds at billboard scale and at phone-screen scale. Texas, but printed.",
    },

    // ── 2-up: mid-century landscape paired with the wordmark color block
    {
      id: "lang-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/hill-country-oakworks-mid-century-landscape-teal-sky-orange-foreground-tree-silhouette.jpg`,
        alt: "Stylized mid-century landscape with teal sky, white cloud, orange foreground hills, and a live oak silhouette anchoring the right",
      },
      right: {
        src: `${IMG}/hill-country-oakworks-wordmark-yellow-on-orange-color-block.jpg`,
        alt: "HILL COUNTRY OAKWORKS wordmark in mustard yellow on burnt-orange color-blocked field",
      },
    },

    // ── Inline hero: mid-century tree poster (visual beat between sections)
    {
      id: "lang-poster-hero",
      type: "hero",
      image: `${IMG}/hill-country-oakworks-mid-century-tree-silhouette-poster-teal-orange-red-circles.jpg`,
      alt: "Hill Country Oakworks campaign poster, oak silhouette against teal-orange-red color blocked sky in mid-century print style",
      inline: true,
    },

    // ── 2-up: tree+sun composition paired with the brand tagline
    {
      id: "type-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/hill-country-oakworks-tree-silhouette-orange-sun-mid-century-composition.jpg`,
        alt: "Live oak silhouette set against an orange sun on cream textured ground",
      },
      right: {
        src: `${IMG}/hill-country-oakworks-typography-oak-barrels-master-craft-heritage-whiskey-orange-cream-tagline.jpg`,
        alt: "Brand tagline OAK BARRELS. MASTER CRAFT. HERITAGE WHISKEY. set in heavy geometric sans, orange on cream",
      },
    },

    // ── Editorial palate cleanser
    {
      id: "headline-craft",
      type: "editorial-headline",
      text: "Land and craft\nin one frame",
    },

    // ════════════════════════════════════════
    // SECTION 04 — APPLICATION
    // ════════════════════════════════════════
    {
      id: "app-header",
      type: "section-header",
      label: "SECTION 03: APPLICATION",
      title: "One System Sized for\nBillboard to Phone Screen.",
    },
    {
      id: "app-subhead",
      type: "text",
      size: "subhead",
      content:
        "Campaign assets sized from outdoor banners down to phone screens, all sharing the same color blocking, silhouettes, and type. The surface changes, the brand doesn't.",
    },

    {
      id: "app-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/hill-country-oakworks-iphone-mockup-poster-tree-color-blocks-held-against-sky.jpg`,
        alt: "iPhone mockup showing the Hill Country Oakworks poster on the lock screen, hand-held against an open Texas sky",
      },
      right: {
        src: `${IMG}/hill-country-oakworks-cowboy-hat-man-branded-shirt-portrait.jpg`,
        alt: "Portrait of a cowboy-hat-wearing man in a HILL COUNTRY OAKWORKS branded t-shirt with the brand tagline below",
      },
    },

    // ════════════════════════════════════════
    // SECTION 05 — MARKS & MATERIALS
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 04: MARKS & MATERIALS",
      title: "A Sun-Washed Palette\nPaired with Workshop Type.",
      introText:
        "Five colors pulled from a Texas hour-before-sunset, one type family used at every weight the system needed - the same kit applied across every surface.",
      philosophyText:
        "The palette had to read as Texas without leaning into red, white, and blue. Burnt orange, mustard yellow, teal sky, cream paper, charcoal silhouette. Pulled from old highway signs and the actual color of the landscape during last-light.\n\nGreatdome carries the editorial headlines. Avenir Next runs everything else, heavy weight for the wordmark, lighter for body. The display face does the heritage work so the workhorse sans doesn't have to.",
      colors: [
        { name: "Cream", hex: "#ECE2C5", description: "Paper, ground" },
        { name: "Mustard", hex: "#ECC265", description: "Wordmark, accents" },
        { name: "Burnt Orange", hex: "#DA8849", description: "Color blocks" },
        { name: "Brick", hex: "#D45E3D", description: "Foreground hills" },
        { name: "Charcoal Brown", hex: "#3B2F1F", description: "Silhouettes, type" },
      ],
      fonts: [
        {
          name: "Greatdome",
          role: "Headline display",
          description:
            "Vintage display face for editorial headlines and poster moments. Carries period character without leaning into kitsch.",
          family: "'Greatdome', 'Bebas Neue', 'Oswald', sans-serif",
          weight: 400,
        },
        {
          name: "Avenir Next Heavy",
          sampleText: "Oakworks",
          role: "Wordmark & posters",
          description:
            "Heavy geometric sans for the wordmark and poster headlines. Holds shape at billboard scale and at phone-screen scale.",
          family: "'Avenir Next', 'Futura', 'Helvetica Neue', sans-serif",
          weight: 800,
        },
        {
          name: "Avenir Next Demi Bold",
          role: "Tagline & subhead",
          description:
            "Mid-weight for taglines like OAK BARRELS, MASTER CRAFT, HERITAGE WHISKEY. Carries the spec sheet voice.",
          family: "'Avenir Next', 'Futura', 'Helvetica Neue', sans-serif",
          weight: 600,
        },
        {
          name: "Avenir Next Regular",
          role: "Body & captions",
          description:
            "Standard weight for product descriptions, fact sheets, and any longer-form copy on packaging or print. Workshop-utilitarian, no flourish.",
          family: "'Avenir Next', 'Futura', 'Helvetica Neue', sans-serif",
          weight: 400,
        },
      ],
      markImage: `${IMG}/hill-country-oakworks-3d-layered-wordmark-typography-cream-yellow-orange.jpg`,
      markAlt: "HILL COUNTRY OAKWORKS wordmark with layered 3D treatment in cream over yellow and orange split background",
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "Heritage Without\nthe Cosplay.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "A campaign language built once and applied everywhere - the same color blocks, silhouettes, and type running across every surface the brand lands on.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Art Direction", "Campaign Design"],
      stack: ["Illustrator", "Photoshop", "InDesign"],
      links: [],
      content:
        "A Texas barrel maker needed a brand language that could carry from a roadside billboard down to a phone wallpaper without diluting. Mid-century color blocking, silhouetted oaks, and utilitarian type held the system together. Heritage without the cosplay.",
    },
  ],
};
