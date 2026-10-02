import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/cosmo-prof";

export const cosmoProfCaseStudy: CaseStudy = {
  slug: "cosmo-prof",
  title: "Cosmo Prof.",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "A digital refresh for Cosmo Prof, the salon supply retailer. | The site got new photography, simpler navigation and shoppable video for working stylists.",
  field: "Creative Direction\nDigital Design\nPhotography Direction\nEcommerce Design",
  author: "Jeremy Prasatik",
  published: "2021",
  status: "Live",
  classification: ["Creative Direction", "Digital Design", "Photography Direction", "Ecommerce Design"],
  services: ["Creative Direction", "Digital Design", "Photography Direction", "Ecommerce Design"],
  stack: ["Figma", "Sketch", "Photoshop"],
  links: [],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 6 frames",
        colors: ["#F8F6F2", "#F4D9DC", "#DBC5C8", "#E5D6C9", "#000000"],
        images: [
          "/case-studies/cosmo-prof/cosmo-prof-photography-direction-hair-color-brushes-product-detail-quad-composition.jpg",
          "/case-studies/cosmo-prof/cosmo-prof-photography-direction-maria-nila-colour-masque-pink-cream-splatters.jpg",
          "/case-studies/cosmo-prof/carousel/cosmo-prof-photography-shine-zero-lift-tubes-droplet-twin-macro.jpg",
          "/case-studies/cosmo-prof/carousel/cosmo-prof-photography-framar-applicator-brushes-gold-pink-trio.jpg",
          "/case-studies/cosmo-prof/carousel/cosmo-prof-photography-wella-shinefinity-product-tube-box-lineup.jpg",
          "/case-studies/cosmo-prof/carousel/cosmo-prof-photography-hair-color-mask-application.jpg",
        ],
      },
      title: "Cosmo Prof.",
      subtitle:
        "A digital refresh for Cosmo Prof, the salon supply retailer. | The site got new photography, simpler navigation and shoppable video for working stylists.",
      field: "Creative Direction  Digital Design  Photography Direction",
      author: "Jeremy Prasatik",
      published: "2021",
      status: "Live",
      classification: ["Creative Direction", "Digital Design", "Photography Direction"],
      summary: [
        { label: "Built", value: "A homepage, shoppable video, tabbed recommendations and unified templates for a B2B salon retailer" },
        { label: "Scope", value: "Creative direction, digital design, photography direction" },
        { label: "Tools", value: "Figma, Sketch, Photoshop" },
        { label: "Angle", value: "The site is built around its photography." },
      ],
      abstract:
        "Cosmo Prof sells salon supplies to working stylists. The site was functional but dated, and it needed to match the professionals using it. The job was to set a new visual direction and make products easier to find, and none of it could slow the store down.\n\nWork started with photography: high-contrast lighting, defined shadows and cleaner compositions. Typography moved to Jost, and the palette put soft neutrals against sharp black.\n\nThe new homepage has tabbed recommendations personalized to each stylist, shoppable video you can buy from while it plays, and a global header cut back so the content gets the screen. One set of templates carries promotions, brand campaigns and education modules.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/cosmo-prof-photography-direction-hair-color-brushes-product-detail-quad-composition.jpg`,
      alt: "Cosmo Prof photography direction, four-quadrant composition: hair color stroke, color tube detail, product lineup, and Framar applicator brushes",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — PHOTOGRAPHY DIRECTION
    // ════════════════════════════════════════
    {
      id: "photo-header",
      type: "section-header",
      label: "SECTION 02: PHOTOGRAPHY DIRECTION",
      title: "Each frame defined what a good",
      // The study's one crossing, on the argument the whole case rests on.
      //
      // No zoom plate anywhere in this study: every UI capture is ~1990px
      // native, well under the working floor for a plate that fills the
      // mat, and the photography that does clear it is already spent on
      // the cover riser and the carousel. Quota bent, on the record. The
      // mid-page climb lives in the homepage section instead, off a pair.
      //
      // pin declared beside crossing: the crossing pins its own headline
      // as part of that gesture, so the flag changes nothing on the page.
      // It is the A.R.C. convention for saying so in the data, which is
      // what the audit reads.
      pressing: {
        mark: { n: "02", name: "Shot on Purpose" },
        heldLine: "Cosmo Prof picture looks like.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "photo-subhead",
      type: "text",
      size: "subhead",
      content:
        "Every photo is composed to read at thumbnail size and still hold up edge to edge.",
    },
    {
      id: "photo-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Photography came first, because the old pictures dated the site and no layout was going to fix that.",
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
      text: "The new look for working stylists\ncouldn't slow the store down",
    },

    // ════════════════════════════════════════
    // SECTION 03 — HOMEPAGE & SHOPPABLE
    // ════════════════════════════════════════
    {
      id: "home-header",
      type: "section-header",
      label: "SECTION 03: HOMEPAGE",
      title: "The homepage sorts its recommendations",
      pressing: {
        mark: { n: "03", name: "Smaller Header" },
        heldLine: "for whoever is logged in.",
        // Holds the headline while the two copy blocks travel up beside
        // it. The section's own argument is about a header getting out of
        // the way, so letting this one sit still while the copy moves is
        // the beat, not just the rule.
        choreo: { pin: true },
      },
    },
    {
      id: "home-subhead",
      type: "text",
      size: "subhead",
      content:
        "The top of the page goes to the seasonal launch. Below the fold, a stylist finds what they buy first, then the rest of the catalog.",
    },
    {
      id: "home-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The For The Pros module plays shoppable video with the products from each look a tab away, and the catalog is still right there under it.",
    },

    // Three desktop captures used to stack here as three plain plates.
    // The two full-page views pair instead: they are the same page top and
    // bottom, which is the pairing the mobile row already uses, and at
    // 1999px native neither one can honestly fill the mat alone. Side by
    // side they land near half a column, inside what the file carries.
    // Pinned, so the module below has a held screen to climb.
    {
      id: "home-desktop-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/cosmo-prof-ui-website-homepage-shinefinity-hero-product-mockup.png`,
        alt: "Cosmo Prof homepage with stripped global header, Shinefinity launch hero, and product mockup at right",
      },
      right: {
        src: `${IMG}/cosmo-prof-ui-website-homepage-2.png`,
        alt: "Cosmo Prof homepage variant showing further down the page with category cards and editorial features",
      },
      pressing: {
        captions: ["Homepage\nShinefinity launch", "Same page, further down"],
        choreo: { pin: true },
      },
    },

    // Moved below the pair from the middle of the run, so the climb has
    // something held to cross. It reads better last anyway: the shoppable
    // video and its tabs are what the subhead's third line promises, and
    // they now arrive as the payoff rather than in passing.
    {
      id: "home-pros",
      type: "image",
      src: `${IMG}/cosmo-prof-ui-website-for-the-pros-shoppable-video-product-tabs.png`,
      alt: "For The Pros shoppable video module with tabbed product recommendations: Shop The Video, Featured Products, Bestsellers, Sale",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 04 — MOBILE
    // ════════════════════════════════════════
    {
      id: "mobile-header",
      type: "section-header",
      label: "SECTION 04: MOBILE",
      title: "On the phone,",
      pressing: {
        mark: { n: "04", name: "The Phone" },
        heldLine: "the recommendation tabs become swipes.",
        // One absorbed block, so the hold is short. Left unpinned it read
        // as the only header on the page that scrolls away from its copy.
        choreo: { pin: true },
      },
    },
    {
      id: "mobile-subhead",
      type: "text",
      size: "subhead",
      content:
        "The mobile homepage follows the desktop order. The launch image at the top crops to a vertical frame and keeps the product in it, and the catalog drops to one column.",
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
      pressing: {
        captions: ["Mobile homepage\nPrimary view", "Scrolled to recommendations"],
      },
    },

    // ════════════════════════════════════════
    // SECTION 05 — MARKS & MATERIALS
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 05: MARKS & MATERIALS",
      title: "The palette is soft neutrals and sharp black,\nand Jost runs from the wordmark to the captions.",
    introText:
        "Cosmo Prof's colors stay back so the photography leads.",
      philosophyText:
        "The people buying from Cosmo Prof are professionals, so the brand had to feel premium and never get precious about it.\n\nThe neutrals bring the warmth, and the black gives the brand its structure.",
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
            "The COSMO PROF wordmark and the category navigation are set in Jost ExtraBold, a heavy geometric sans that reads at thumbnail size.",
          family: "'Jost', 'Inter', 'Helvetica Neue', sans-serif",
          weight: 800,
        },
        {
          name: "Jost Medium",
          role: "Section headlines",
          description:
            "Jost Medium sets the homepage module headlines like Introducing, For The Pros and Hair Care. It stays light on the page even set large.",
          family: "'Jost', 'Inter', 'Helvetica Neue', sans-serif",
          weight: 500,
        },
        {
          name: "Jost Regular",
          role: "Body & catalog",
          description:
            "Jost Regular sets catalog copy, product names and descriptions, and it's the default everywhere outside the navigation.",
          family: "'Jost', 'Inter', 'Helvetica Neue', sans-serif",
          weight: 400,
        },
        {
          name: "Jost Light",
          role: "Captions & meta",
          description:
            "Jost Light sets captions, price lines and secondary information. It sits back so the photography reads first.",
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
      title: "The templates set photography, type",
      pressing: {
        mark: { n: "05", name: "The Templates" },
        heldLine: "and layout once.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Every template pulls its pictures from the photo library.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Creative Direction", "Digital Design", "Photography Direction"],
      stack: ["Figma", "Sketch", "Photoshop"],
      links: [],
      content:
        "A promotion, a brand campaign or an education module drops into the same slots and looks like one site.",
    },
  ],
};
