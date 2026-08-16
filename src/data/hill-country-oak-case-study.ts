import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/hill-country-oak";

export const hillCountryOakCaseStudy: CaseStudy = {
  slug: "hill-country-oak",
  title: "Hill Country Oakworks.",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "A campaign for Hill Country Oakworks, a Texas whiskey barrel maker, from billboards down to phone wallpapers. | Sun-washed color, the silhouette of an oak, and the land the barrels come from.",
  field: "Art Direction\nCampaign Design",
  author: "Jeremy Prasatik",
  published: "2019",
  status: "Live",
  classification: ["Art Direction", "Campaign Design"],
  services: ["Art Direction", "Campaign Design"],
  stack: ["Illustrator", "Photoshop", "InDesign"],
  links: [],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 8 frames",
        colors: ["#ECE2C5", "#ECC265", "#DA8849", "#D45E3D", "#3B2F1F"],
        images: [
          "/case-studies/hill-country-oak/hill-country-oakworks-outdoor-banner-whiskey-barrels-colorful-background-tree-texas-born-oakcraft.jpg",
          "/case-studies/hill-country-oak/hill-country-oakworks-mid-century-landscape-teal-sky-orange-foreground-tree-silhouette.jpg",
          "/case-studies/hill-country-oak/hill-country-oakworks-wordmark-yellow-on-orange-color-block.jpg",
          "/case-studies/hill-country-oak/hill-country-oakworks-mid-century-tree-silhouette-poster-teal-orange-red-circles.jpg",
          "/case-studies/hill-country-oak/hill-country-oakworks-tree-silhouette-orange-sun-mid-century-composition.jpg",
          "/case-studies/hill-country-oak/hill-country-oakworks-typography-oak-barrels-master-craft-heritage-whiskey-orange-cream-tagline.jpg",
          "/case-studies/hill-country-oak/hill-country-oakworks-iphone-mockup-poster-tree-color-blocks-held-against-sky.jpg",
          "/case-studies/hill-country-oak/hill-country-oakworks-cowboy-hat-man-branded-shirt-portrait.jpg",
        ],
      },
      title: "Hill Country\nOakworks.",
      subtitle:
        "A campaign for Hill Country Oakworks, a Texas whiskey barrel maker, from billboards down to phone wallpapers. | Sun-washed color, the silhouette of an oak, and the land the barrels come from.",
      field: "Art Direction  Campaign Design",
      author: "Jeremy Prasatik",
      published: "2019",
      status: "Live",
      classification: ["Art Direction", "Campaign Design"],
      summary: [
        { label: "Built", value: "Brand campaign for a Texas barrel maker: an outdoor banner, posters, a phone wallpaper, a shirt." },
        { label: "Scope", value: "Art direction and campaign design." },
        { label: "Tools", value: "Illustrator, Photoshop, InDesign. Greatdome for the display type, Avenir Next for everything else." },
        { label: "Angle", value: "Mid-century travel-poster color, an oak silhouette, and one graphic idea sized from a billboard down to a phone." },
      ],
      abstract:
        "Hill Country Oakworks makes whiskey barrels from Texas oak. The campaign had to work on a roadside billboard and on a phone screen, and read as heritage at both sizes.\n\nIt pulls from mid-century poster design: warm color blocking, an oak silhouette, geometric shapes that echo the barrel. The type is plain and utilitarian, with a distressed texture over the whole thing.\n\nThe same idea runs on billboards, print, and digital, sized for each.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hill-country-oakworks-outdoor-banner-whiskey-barrels-colorful-background-tree-texas-born-oakcraft.jpg`,
      alt: "Hill Country Oakworks outdoor banner, color-blocked whiskey barrel composition with TEXAS BORN OAKCRAFT tagline at scale",
      pressing: { choreo: { rise: true } },
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
      title: "Mid-century travel posters,",
      // Pinned: the headline names the reference set, and the two copy
      // blocks under it spend their length arguing for it. The claim has
      // to still be on screen when the landscape and wordmark arrive.
      pressing: {
        mark: { n: "02", name: "Travel Posters" },
        heldLine: "with a live oak in them.",
        choreo: { pin: true },
      },
    },
    {
      id: "lang-subhead",
      type: "text",
      size: "subhead",
      content:
        "Flat color, a tree silhouette, and a heavy geometric sans set big. Every piece in the campaign is some arrangement of those three.",
    },
    {
      id: "lang-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The brief asked for heritage that stayed clear of the Western cliché, so the reference pile was travel posters and old highway signs.",
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

    // ── Mid-century tree poster — the zoom. This study has exactly one
    // adjacency where a gesture can land, so the choice is zoom or climb,
    // and the frame decides it: a printed poster is artwork, and artwork
    // wants to be seen at size.
    {
      id: "lang-poster-hero",
      type: "hero",
      image: `${IMG}/hill-country-oakworks-mid-century-tree-silhouette-poster-teal-orange-red-circles.jpg`,
      alt: "Hill Country Oakworks campaign poster, oak silhouette against teal-orange-red color blocked sky in mid-century print style",
      inline: true,
      pressing: {
        plate: "02",
        captions: [
          "Campaign poster",
          "Oak silhouette, blocked sky",
          "Teal, orange, red",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
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
      text: "The Hill Country,\nan hour before sunset",
    },

    // ════════════════════════════════════════
    // SECTION 04 — APPLICATION
    // ════════════════════════════════════════
    {
      id: "app-header",
      type: "section-header",
      label: "SECTION 03: APPLICATION",
      title: "Billboard, poster,",
      // The study's one crossing, held back to section 03 so it does not
      // land on the same beat as the poster zoom above.
      //
      // `pin` alongside `crossing`: the crossing already holds as part of
      // its own gesture, so the flag changes nothing on the page. It is the
      // convention for saying so in the data, which is what the audit reads.
      pressing: {
        mark: { n: "03", name: "Billboard to Phone" },
        heldLine: "lock screen, t-shirt.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "app-subhead",
      type: "text",
      size: "subhead",
      content:
        "The same color blocks, silhouette, and type at every size, from an outdoor banner down to a lock screen.",
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
      title: "Highway-sign colors,\nAvenir Next, Greatdome.",
      introText:
        "The palette had to say Texas without red, white, and blue, so it comes from the landscape at last light.",
      philosophyText:
        "Burnt orange, mustard yellow, brick, teal sky, cream paper, charcoal silhouette. Orange and mustard do the color blocks and the wordmark, cream is the paper, and the charcoal is every silhouette and most of the type.\n\nGreatdome does the vintage part, on the headlines and the posters, so Avenir Next can just do its job everywhere else.",
      colors: [
        { name: "Cream", hex: "#ECE2C5", description: "Paper, ground" },
        { name: "Mustard", hex: "#ECC265", description: "Wordmark, accents" },
        { name: "Burnt Orange", hex: "#DA8849", description: "Color blocks" },
        { name: "Brick", hex: "#D45E3D", description: "Foreground hills" },
        /* Sampled from the poster's sky. The prose named it and the ledger
           did not; Jeremy: "use 'teal' in both places". */
        { name: "Teal", hex: "#8FB7A0", description: "Sky" },
        { name: "Charcoal Brown", hex: "#3B2F1F", description: "Silhouettes, type" },
      ],
      fonts: [
        {
          name: "Greatdome",
          role: "Headline display",
          description:
            "Display face for the headlines and the posters.",
          family: "'Greatdome', 'Bebas Neue', 'Oswald', sans-serif",
          weight: 400,
        },
        {
          name: "Avenir Next Heavy",
          sampleText: "Oakworks",
          role: "Wordmark & posters",
          description:
            "Heavy geometric sans for the wordmark and the poster headlines.",
          family: "'Avenir Next', 'Futura', 'Helvetica Neue', sans-serif",
          weight: 800,
        },
        {
          name: "Avenir Next Demi Bold",
          role: "Tagline & subhead",
          description:
            "Mid-weight for the taglines, OAK BARRELS, MASTER CRAFT, HERITAGE WHISKEY. Spec-sheet plain.",
          family: "'Avenir Next', 'Futura', 'Helvetica Neue', sans-serif",
          weight: 600,
        },
        {
          name: "Avenir Next Regular",
          role: "Body & captions",
          description:
            "Standard weight for product descriptions, fact sheets, and anything that runs long on packaging or print.",
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
      title: "Texas,",
      pressing: {
        mark: { n: "04", name: "Texas, Printed" },
        heldLine: "but printed.",
      },
    },
    // No subhead here on purpose. The one it had re-told section 03
    // (same color blocks, silhouettes, and type on every surface).
    {
      id: "closing",
      type: "closing",
      services: ["Art Direction", "Campaign Design"],
      stack: ["Illustrator", "Photoshop", "InDesign"],
      links: [],
      content:
        "There's a distressed texture over everything, and that's the only nod to age. The rest is flat color, a tree, and plain type, and none of it pretends to be old.",
    },
  ],
};
