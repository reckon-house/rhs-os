import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/nordstrom-beauty";

export const nordstromBeautyCaseStudy: CaseStudy = {
  slug: "nordstrom-beauty",
  title: "Nordstrom Beauty",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "Nordstrom's beauty editorial hub, where every story is shoppable. | Built to stay current without a team rebuilding the pages every week.",
  field: "Product Design\nUX Design\nVisual Design\nEcommerce Design",
  author: "Jeremy Prasatik",
  published: "2018",
  status: "Complete",
  classification: [
    "Product Design",
    "UX Design",
    "Visual Design",
    "Editorial Templates",
    "Ecommerce Design",
  ],
  services: [
    "Product Design",
    "UX Design",
    "Visual Design",
    "Editorial Templates",
    "Ecommerce Design",
  ],
  stack: ["Nordstrom CMS", "Custom Components", "HTML/CSS/JS"],
  links: [],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 3 frames",
        colors: ["#787878", "#848486", "#2E2E2E", "#ADA5A1", "#C5C1C0"],
        images: [
          "/case-studies/nordstrom-beauty/nordstrom-beauty-hub-laptop-homepage-mockup.jpg",
          "/case-studies/nordstrom-beauty/nordstrom-beauty-tryon-iphone-color-selector-mockup.jpg",
          "/case-studies/nordstrom-beauty/nordstrom-beauty-glow-story-iphone-orange-table-mockup.jpg",
        ],
      },
      title: "Nordstrom\nBeauty",
      subtitle:
        "Nordstrom's beauty editorial hub, where every story is shoppable. | Built to stay current without a team rebuilding the pages every week.",
      field: "Product Design  UX Design  Visual Design",
      author: "Jeremy Prasatik",
      published: "2018",
      status: "Complete",
      classification: [
        "Product Design",
        "UX Design",
        "Visual Design",
        "Editorial Templates",
      ],
      summary: [
        { label: "Built", value: "Beauty editorial hub, three story templates, virtual try-on tool, shoppable drawer" },
        { label: "Scope", value: "Product, UX, and visual design" },
        { label: "Stack", value: "Nordstrom CMS, custom components, HTML/CSS/JS" },
        { label: "Angle", value: "Magazine stories on top, the product catalog underneath." },
      ],
      abstract:
        "Beauty content ages fast. New products launch weekly, trends shift with the season, and a static story is stale before it publishes. The answer was a set of templates the products could rotate through.\n\nThree modular story formats, each written in an editorial voice and built so merchandising could swap products without touching the layout. \"Get That Glow\" and \"Top 5 Serums\" told seasonal stories while the product grid under them stayed current. It looked hand-picked and ran on rails.\n\nA virtual try-on tool let customers upload a photo or pull their Style Profile selfie, then drag across a color gradient to preview shades on their own face. Pick a color, see it on, buy without leaving the modal. Stories opened into a shoppable drawer on the same page, so a customer could buy from inside the story.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/nordstrom-beauty-hub-laptop-homepage-mockup.jpg`,
      alt: "Nordstrom Beauty hub homepage on laptop, three editorial story cards, stylists section",
      pressing: { choreo: { rise: true } },
    },

    // ── THE HUB — grouped ──
    {
      id: "hub-header",
      type: "section-header",
      label: "SECTION 02: THE HUB",
      title: "Each card opens into",
      // Pinned: the argument for the template runs two blocks long, so the
      // headline holds while the column travels, and the hub screenshot
      // below has a named holder to climb.
      pressing: {
        mark: { n: "02", name: "Three Stories" },
        heldLine: "a full shoppable story.",
        choreo: { pin: true },
      },
      group: { name: "hub", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "hub-text",
      type: "text",
      size: "subhead",
      content:
        "\"Lips That Pop,\" \"Top 5 Serums,\" and \"Get That Glow.\" Three cards gave merchandising room for the seasonal pushes and kept the page from getting crowded.",
      group: { name: "hub" },
    },
    {
      id: "hub-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The headlines, photography, and copy were written per story. The product data came in from the catalog on its own, so swapping a SKU updated the price, description, and picture with no designer opening the page.",
      group: { name: "hub" },
    },

    // ── Desktop hub screenshot ──
    {
      id: "hub-desktop",
      type: "image",
      src: `${IMG}/nordstrom-beauty-hub-desktop-three-stories.png`,
      alt: "Nordstrom Beauty hub desktop, three editorial story cards with product imagery",
      aspect: "native",
      padded: true,
      group: { name: "hub" },
      // Rise, not zoom. The three-card grid is exactly the dense layout a
      // zoom rewards, but the export is 1610px wide and the bar is 3000, so
      // pinning it at full mat would magnify a bitmap. Climbing drops the
      // built page over the paragraph describing it instead.
      pressing: { choreo: { rise: true } },
    },

    // ── TRY-ON HERO ──
    {
      id: "tryon-hero",
      type: "hero",
      image: `${IMG}/nordstrom-beauty-tryon-iphone-color-selector-mockup.jpg`,
      alt: "Nordstrom Beauty virtual try-on tool on iPhone, color gradient selector, lipstick preview",
      inline: true,
      // The zoom. A colour selector is the one interface in this study
      // where the individual swatches are the content, and at plate size
      // they are a stripe.
      pressing: {
        plate: "03",
        captions: [
          "Virtual try-on",
          "Color gradient selector",
          "Lipstick preview",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── THE TRY-ON TOOL ──
    {
      id: "tryon-header",
      type: "section-header",
      label: "SECTION 03: VIRTUAL TRY-ON",
      title: "Upload a selfie,",
      // Pinned. The zoom above it has just held one frame for 320dvh, so
      // the copy arrives on a screen that is already still. Holding the
      // headline keeps that stillness through the explanation, then hands
      // it to the desktop plate that climbs out of it.
      pressing: {
        mark: { n: "03", name: "Try-On" },
        heldLine: "try on every shade.",
        choreo: { pin: true },
      },
    },
    {
      id: "tryon-text",
      type: "text",
      size: "subhead",
      content:
        "Use a new photo or the one already on your Style Profile, then drag across a color gradient and watch the shade change on your face as you go. Tap the right red and the product card comes up underneath with reviews, price, and add to bag.",
    },
    {
      id: "tryon-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "It shipped inside the \"Lips That Pop\" story, built as its own component so it could move to eye, cheek, or nail. The gradient mapped to the available SKUs, so any shade you could try was one you could buy.",
    },

    // ── Desktop try-on ──
    {
      id: "tryon-desktop",
      type: "image",
      src: `${IMG}/nordstrom-beauty-lips-that-pop-desktop-tryon.png`,
      alt: "Nordstrom Beauty Lips That Pop desktop experience with virtual try-on tool and product detail",
      aspect: "native",
      padded: true,
      // Rise. Same 1604px ceiling as the hub screenshot, and the study's
      // one zoom is already spent on the selector this page wraps around.
      pressing: { choreo: { rise: true } },
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-editorial",
      type: "editorial-headline",
      text: "The products changed every week.\nThe pages didn't have to.",
    },

    // ── SHOPPABLE STORIES ──
    {
      id: "stories-header",
      type: "section-header",
      label: "SECTION 04: SHOPPABLE STORIES",
      title: "Buying never interrupts",
      // The study's one crossing, on the move the whole hub rests on.
      //
      // pin declared alongside it: the crossing already holds its headline
      // for 220dvh, and naming it gives the glow plate below a holder to
      // climb. The plate used to sit ABOVE this header with nothing under
      // it; moved down, the drawer argument stays on screen while the
      // story it describes rises over the top of it.
      pressing: {
        mark: { n: "04", name: "The Drawer" },
        heldLine: "the read.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "stories-text",
      type: "text",
      size: "subhead",
      content:
        "Reviews, price, size options and add to bag come in from the side while the story stays on screen behind it.",
    },
    {
      id: "stories-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "It also kept the numbers in one place. Time on page, scroll depth, and conversion were all measured inside the story, so merchandising could see which angle drove the most adds to bag with no attribution guesswork.",
    },

    // ── GLOW STORY HERO — climbs the crossing that argues for it ──
    // Rise, not zoom, even at 3080px: this is a phone on a table, a room
    // photograph rather than a page to be read, and the study's zoom
    // belongs on the selector where the swatches are the content. It also
    // lands the glow story one beat ahead of its own mobile screens.
    {
      id: "glow-hero",
      type: "hero",
      image: `${IMG}/nordstrom-beauty-glow-story-iphone-orange-table-mockup.jpg`,
      alt: "Nordstrom Beauty Get That Glow story on iPhone, orange table lifestyle mockup",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── MOBILE SCREENS: 2 stacked dual-image pairs, native size ──
    {
      id: "mobile-pair-1",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: `${IMG}/nordstrom-beauty-glow-story-mobile-editorial.png`,
        alt: "Get That Glow story mobile, editorial layout with model and copy",
      },
      right: {
        src: `${IMG}/nordstrom-beauty-glow-story-mobile-products.png`,
        alt: "Get That Glow story mobile, shoppable product grid with pricing",
      },
    },
    {
      id: "mobile-pair-2",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: `${IMG}/nordstrom-beauty-serums-story-mobile.png`,
        alt: "Top 5 Serums story mobile, editorial with product details and how-to-use",
      },
      right: {
        src: `${IMG}/nordstrom-beauty-product-drawer-mobile.png`,
        alt: "Product detail drawer mobile, Bio Lifting Serum with pricing and add to bag",
      },
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "A customer could buy where they were,",
      pressing: {
        mark: { n: "05", name: "Three Templates" },
        heldLine: "with no detour to a product page.",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Three templates, a try-on tool and a drawer.",
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Product Design",
        "UX Design",
        "Visual Design",
        "Editorial Templates",
      ],
      stack: ["Nordstrom CMS", "Custom Components", "HTML/CSS/JS"],
      links: [],
      content:
        "The templates ran through three seasonal rotations before anyone asked for a layout change. In between, merchandising swapped products and the catalog kept everything else current.",
    },
  ],
};
