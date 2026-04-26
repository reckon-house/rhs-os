import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/nordstrom-beauty";

export const nordstromBeautyCaseStudy: CaseStudy = {
  slug: "nordstrom-beauty",
  title: "Nordstrom Beauty",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "Editorial hub meets product tool. Virtual try-on, shoppable stories, and templates built to stay fresh without manual updates.",
  field: "Product Design\nUX Design\nVisual Design",
  author: "Jeremy Prasatik",
  published: "2018",
  status: "Complete",
  classification: [
    "Product Design",
    "UX Design",
    "Visual Design",
    "Editorial Templates",
  ],
  services: [
    "Product Design",
    "UX Design",
    "Visual Design",
    "Editorial Templates",
  ],
  stack: ["Nordstrom CMS", "Custom Components", "HTML/CSS/JS"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/nordstrom-beauty-hub-laptop-homepage-mockup.jpg`,
      alt: "Nordstrom Beauty hub homepage on laptop, three editorial story cards, stylists section",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
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
      abstract:
        "Beauty content ages fast. New products launch weekly. Trends shift seasonally. Static editorial goes stale before it publishes. The answer wasn't faster publishing. It was a template that aged better than the content inside it.\n\nThree modular story formats. Each designed with editorial voice but built so merchandising could swap products without touching the layout. \"Get That Glow\" and \"Top 5 Serums\" told seasonal stories while the underlying product grid stayed current. Content that looked curated but actually ran on rails.\n\nA virtual try-on tool let customers upload a photo or pull their Style Profile selfie, then drag across a color gradient to preview shades on their own face. Pick a color, see it applied, buy without leaving the modal. Stories opened into a shoppable drawer rather than navigating away. The flow kept customers inside the narrative instead of bouncing them through product pages.",
    },

    // ── THE HUB — grouped ──
    {
      id: "hub-header",
      type: "section-header",
      label: "SECTION 02: THE HUB",
      title: "The Templates Aged Better\nThan the Content.",
      group: { name: "hub", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "hub-text",
      type: "text",
      size: "subhead",
      content:
        "The hub anchored around three rotating editorial stories. \"Lips That Pop.\" \"Top 5 Serums.\" \"Get That Glow.\" Each card opened into a full shoppable experience. The three-card layout gave merchandising enough surface area to feature seasonal pushes without overwhelming the page.",
      group: { name: "hub" },
    },
    {
      id: "hub-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The templates separated content from structure. Editorial voice lived in the headlines, photography, and copy. Product data pulled from the catalog automatically. Swap a SKU and the price, description, and imagery updated without a designer touching the page. They survived three seasonal rotations before anyone requested a layout change.",
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
    },

    // ── TRY-ON HERO ──
    {
      id: "tryon-hero",
      type: "hero",
      image: `${IMG}/nordstrom-beauty-tryon-iphone-color-selector-mockup.jpg`,
      alt: "Nordstrom Beauty virtual try-on tool on iPhone, color gradient selector, lipstick preview",
      inline: true,
    },

    // ── THE TRY-ON TOOL ──
    {
      id: "tryon-header",
      type: "section-header",
      label: "SECTION 03: VIRTUAL TRY-ON",
      title: "The Tool Turned\nBrowsing into Trying.",
    },
    {
      id: "tryon-text",
      type: "text",
      size: "subhead",
      content:
        "The tool brought product discovery into the customer's actual face. Upload a selfie or pull one from the existing Style Profile. Drag across a color gradient and watch shades apply to the photo in real time. Find the right red, tap it, and the product card appears below with reviews, pricing, and an add-to-bag button.",
    },
    {
      id: "tryon-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The tool lived inside the \"Lips That Pop\" story but was designed as a standalone component. Reusable across any color-driven category: lip, eye, cheek, nail. The color gradient mapped directly to available SKUs. No shade appeared in the tool that couldn't be purchased. The function and the experience were the same thing.",
    },

    // ── Desktop try-on ──
    {
      id: "tryon-desktop",
      type: "image",
      src: `${IMG}/nordstrom-beauty-lips-that-pop-desktop-tryon.png`,
      alt: "Nordstrom Beauty Lips That Pop desktop experience with virtual try-on tool and product detail",
      aspect: "native",
      padded: true,
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-editorial",
      type: "editorial-headline",
      text: "Editorial that\nmerchandises itself",
    },

    // ── GLOW STORY HERO ──
    {
      id: "glow-hero",
      type: "hero",
      image: `${IMG}/nordstrom-beauty-glow-story-iphone-orange-table-mockup.jpg`,
      alt: "Nordstrom Beauty Get That Glow story on iPhone, orange table lifestyle mockup",
      inline: true,
    },

    // ── SHOPPABLE STORIES ──
    {
      id: "stories-header",
      type: "section-header",
      label: "SECTION 04: SHOPPABLE STORIES",
      title: "The Customer Never\nLeft the Story.",
    },
    {
      id: "stories-text",
      type: "text",
      size: "subhead",
      content:
        "Every story opened into a shoppable drawer rather than a product page. The editorial narrative stayed visible while the product detail slid in from the side. Reviews. Pricing. Size options. Add to bag. The purchase happened without breaking the read.",
    },
    {
      id: "stories-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The drawer pattern kept engagement metrics inside the editorial experience. Time on page, scroll depth, and conversion all measured within the story context rather than fragmenting across product detail pages. Merchandising could track which editorial angles drove the most adds-to-bag without attribution guesswork.",
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
      title: "Built Once,\nMerchandised Continuously.",
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Three story templates. One try-on tool. A drawer pattern that kept customers inside the narrative.",
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
        "The beauty hub solved a publishing problem by turning it into a design problem. Separate the editorial voice from the product data. Let the templates hold the layout while the catalog feeds the content. A hub that looked hand-curated every week without a designer opening a file.\n\nThe try-on tool turned browsing into trying. The shoppable drawer kept the story visible during the purchase. Both patterns kept the customer inside the experience instead of scattering them across product pages.",
    },
  ],
};
