import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/nordstrom-beauty";

export const nordstromBeautyCaseStudy: CaseStudy = {
  slug: "nordstrom-beauty",
  title: "Nordstrom Beauty",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "Editorial hub meets product tool. Virtual try-on, shoppable stories, and templates built to stay fresh without manual updates.",
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
        "A beauty editorial hub where every story sells. Built to stay current without a content team rebuilding pages each week.",
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
        { label: "Angle", value: "Built a template that aged better than the content inside it. Editorial that merchandises itself." },
      ],
      abstract:
        "Beauty content ages fast. New products launch weekly, trends shift seasonally, and static editorial goes stale before it publishes. The answer wasn't faster publishing - it was a template that aged better than the content inside it.\n\nThree modular story formats, each designed with editorial voice but built so merchandising could swap products without touching the layout. \"Get That Glow\" and \"Top 5 Serums\" told seasonal stories while the underlying product grid stayed current. Content that looked curated but actually ran on rails.\n\nA virtual try-on tool let customers upload a photo or pull their Style Profile selfie, then drag across a color gradient to preview shades on their own face. Pick a color, see it applied, buy without leaving the modal. Stories opened into a shoppable drawer on the same page, so customers stayed inside the story instead of bouncing them through product pages.",
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
      title: "The Templates Aged Better",
      // Pinned: the argument for the template runs two blocks long, so the
      // headline holds while the column travels, and the hub screenshot
      // below has a named holder to climb.
      pressing: {
        mark: { n: "02", name: "The Templates Aged Better" },
        heldLine: "Than the Content.",
        choreo: { pin: true },
      },
      group: { name: "hub", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "hub-text",
      type: "text",
      size: "subhead",
      content:
        "The hub anchored around three rotating editorial stories - \"Lips That Pop,\" \"Top 5 Serums,\" \"Get That Glow\" - each card opening into a full shoppable experience. The three-card layout gave merchandising enough room to feature seasonal pushes without overwhelming the page.",
      group: { name: "hub" },
    },
    {
      id: "hub-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The templates separated content from structure. Editorial voice lived in the headlines, photography, and copy, while product data pulled from the catalog automatically - swap a SKU and the price, description, and imagery updated without a designer touching the page. They survived three seasonal rotations before anyone requested a layout change.",
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
          "Colour gradient selector",
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
      title: "Color Discovery That",
      // Pinned. The zoom above it has just held one frame for 320dvh, so
      // the copy arrives on a screen that is already still. Holding the
      // headline keeps that stillness through the explanation, then hands
      // it to the desktop plate that climbs out of it.
      pressing: {
        mark: { n: "03", name: "Color Discovery That" },
        heldLine: "Lived on the Customer's Face.",
        choreo: { pin: true },
      },
    },
    {
      id: "tryon-text",
      type: "text",
      size: "subhead",
      content:
        "The tool brought product discovery into the customer's actual face. Upload a selfie or pull one from the existing Style Profile, drag across a color gradient and watch shades apply to the photo in real time. Find the right red, tap it, and the product card appears below with reviews, pricing, and an add-to-bag button.",
    },
    {
      id: "tryon-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The tool lived inside the \"Lips That Pop\" story but was designed as a standalone component, reusable across any color-driven category: lip, eye, cheek, nail. The color gradient mapped directly to available SKUs, so no shade appeared in the tool that couldn't be purchased - the function and the experience held the same shape.",
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
      text: "Editorial that\nmerchandises itself",
    },

    // ── SHOPPABLE STORIES ──
    {
      id: "stories-header",
      type: "section-header",
      label: "SECTION 04: SHOPPABLE STORIES",
      title: "The Customer Never",
      // The study's one crossing, on the move the whole hub rests on.
      //
      // pin declared alongside it: the crossing already holds its headline
      // for 220dvh, and naming it gives the glow plate below a holder to
      // climb. The plate used to sit ABOVE this header with nothing under
      // it; moved down, the drawer argument stays on screen while the
      // story it describes rises over the top of it.
      pressing: {
        mark: { n: "04", name: "The Customer Never" },
        heldLine: "Left the Story.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "stories-text",
      type: "text",
      size: "subhead",
      content:
        "Every story opened into a shoppable drawer on the same page. The editorial narrative stayed visible while the product detail slid in from the side - reviews, pricing, size options, add to bag - and the purchase happened without breaking the read.",
    },
    {
      id: "stories-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The drawer pattern kept engagement metrics inside the editorial experience. Time on page, scroll depth, and conversion all measured inside the story, on one page. Merchandising could track which editorial angles drove the most adds-to-bag without attribution guesswork.",
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
      title: "A Hub That Stayed Fresh",
      pressing: {
        mark: { n: "05", name: "A Hub That Stayed Fresh" },
        heldLine: "Without Manual Updates.",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Three story templates, one try-on tool, and a drawer pattern that kept customers inside the narrative.",
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
        "The beauty hub solved a publishing problem with a design decision: keep the editorial voice separate from the product data, so templates hold the layout while the catalog feeds the content. A hub that looked hand-curated every week without a designer opening a file.\n\nThe try-on tool turned browsing into trying, and the shoppable drawer kept the story visible during the purchase. Both patterns kept the customer inside the experience instead of scattering them across product pages.",
    },
  ],
};
