import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/j-christianson";

export const jChristiansonCaseStudy: CaseStudy = {
  slug: "j-christianson",
  title: "J. Christianson",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Brand identity for a fashion and home goods label. Name, logo, color system, and signature graphics developed from scratch.",
  field: "Brand Development\nNaming\nLogo Design\nGraphic Design",
  author: "Jeremy Prasatik",
  published: "2019",
  status: "Complete",
  classification: [
    "Brand Development",
    "Naming",
    "Logo Design",
    "Graphic Design",
  ],
  services: [
    "Brand Development",
    "Naming",
    "Logo Design",
    "Graphic Design",
    "Product Applications",
  ],
  stack: ["Adobe Illustrator", "Adobe Photoshop"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/j-christianson-billboard-mockup-brand-pattern.jpg`,
      alt: "J. Christianson brand identity on billboard, organic color shapes with four-dot logo",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "J. Christianson",
      subtitle:
        "Mid-century warmth without the nostalgia trap. A brand identity built from the name outward, designed to live on a storefront sign and a clothing tag with equal presence.",
      field: "Brand Development  Naming  Logo Design  Graphic Design",
      author: "Jeremy Prasatik",
      published: "2019",
      status: "Complete",
      classification: [
        "Brand Development",
        "Naming",
        "Logo Design",
        "Graphic Design",
      ],
      abstract:
        "Ground-up brand development for a fashion and home goods label. Started with the name. Built the logo, color system, typography, and product graphics from there.\n\nThe mark is four circles in a tight grid. Same form, different color combinations depending on application. Brown and accent colors for one context, olive and accents for another. The flexibility was designed into the identity from the start. One logo that shifts its palette without losing recognition.\n\nThe tree motif emerged as the signature graphic element. A single silhouette rendered in four seasonal colorways. Used across apparel, candles, hangtags, and print materials. Layered over a striped color field that pulls from the brand palette. One graphic idea stretched into a full product language.",
    },

    // ── BRAND PATTERN HERO ──
    {
      id: "brand-pattern",
      type: "image",
      src: `${IMG}/j-christianson-brand-pattern-logo-four-colors.jpg`,
      alt: "J. Christianson brand pattern, four organic color shapes with logo centered",
      aspect: "native",
    },

    // ── THE MARK — grouped ──
    {
      id: "mark-header",
      type: "section-header",
      label: "SECTION 02: THE MARK",
      title: "Four Circles.\nOne Grid.\nShifting Palette.",
      group: { name: "mark", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "mark-text",
      type: "text",
      size: "subhead",
      content:
        "The logo is four circles arranged in a square. Tight spacing. No outline. The form stays constant. The colors rotate depending on where the mark appears.",
      group: { name: "mark" },
    },
    {
      id: "mark-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Brown circles with yellow, orange, red, and teal accents in one version. Olive circles with the same accents in another. The accent colors hold position (bottom-right cluster) while the dominant color shifts. Recognition comes from the grid, not the specific fill. The mark works on white, on color, on product, on signage. The flexibility meant fewer logo lockup variations and more applications.",
      group: { name: "mark" },
    },

    // ── DOT GRID PAIR (these two stay together) ──
    {
      id: "dot-grid-pair",
      type: "dual-image",
      native: true,
      group: { name: "mark" },
      left: {
        src: `${IMG}/j-christianson-dot-grid-pattern-brown-accents.jpg`,
        alt: "J. Christianson dot grid pattern, brown with yellow, orange, red, teal accents",
      },
      right: {
        src: `${IMG}/j-christianson-dot-grid-pattern-olive-accents.jpg`,
        alt: "J. Christianson dot grid pattern, olive with yellow, orange, red, teal accents",
      },
    },

    // ── COLOR PERMUTATIONS CHART ──
    {
      id: "color-permutations",
      type: "color-permutations",
    },

    // ── STOREFRONT HERO ──
    {
      id: "storefront-hero",
      type: "hero",
      image: `${IMG}/j-christianson-storefront-sign-dot-grid-brown.jpg`,
      alt: "J. Christianson storefront sign mockup, dot grid pattern on wood facade",
      inline: true,
    },

    // ── THE TREE ──
    {
      id: "tree-header",
      type: "section-header",
      label: "SECTION 03: THE TREE",
      title: "One Silhouette.\nFour Seasons.\nFull Product Language.",
    },
    {
      id: "tree-text",
      type: "text",
      size: "subhead",
      content:
        "The tree started as a graphic experiment. A white silhouette layered over the brand's stripe pattern. It became the visual element that carried the identity from print into product.",
    },
    {
      id: "tree-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Four colorways mapped to seasons. Teal and dark green for winter. Yellow and gold for summer. Orange and rust for autumn. Brown and earth tones for fall. Same tree, same stripe pattern, different palette each time. The silhouette breaks out of the stripe field at the edges, branches reaching past the color block into white space. Used on apparel, candle labels, hangtags, and promotional print. A single graphic idea that justified an entire product range.",
    },

    // ── TREE PAIR (these two stay together) ──
    {
      id: "tree-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/j-christianson-tree-stripe-graphic-breakout.jpg`,
        alt: "J. Christianson tree silhouette breaking out of stripe color field",
      },
      right: {
        src: `${IMG}/j-christianson-tree-stripe-graphic-tagline.jpg`,
        alt: "J. Christianson tree stripe graphic with tagline, Heavenly Inspired Fashion and Design",
      },
    },

    // ── SEASONAL CIRCLES ──
    {
      id: "seasonal-flat",
      type: "image",
      src: `${IMG}/j-christianson-four-seasonal-tree-circles-flat.jpg`,
      alt: "J. Christianson four seasonal tree circles, teal, yellow, orange, brown landscape silhouettes",
      aspect: "native",
      padded: true,
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-found",
      type: "editorial-headline",
      text: "Type that feels found\nrather than designed",
    },

    // ── OUTDOOR SIGN HERO ──
    {
      id: "outdoor-hero",
      type: "hero",
      image: `${IMG}/j-christianson-outdoor-sign-seasonal-tree-circles.jpg`,
      alt: "J. Christianson outdoor sign mockup, four seasonal tree circles, evening lighting",
      inline: true,
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 04: CLOSING",
      title: "Name to Product.\nOne System.",
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "A brand built from a blank page. The name, the mark, the color system, the graphic language, and the product applications all developed as one connected set of decisions.",
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Brand Development",
        "Naming",
        "Logo Design",
        "Graphic Design",
        "Product Applications",
      ],
      stack: ["Adobe Illustrator", "Adobe Photoshop"],
      links: [],
      content:
        "Four circles in a grid. A tree silhouette over color stripes. A palette pulled from mid-century earth tones with enough warmth to feel organic and enough restraint to feel modern. The identity holds from a billboard down to a clothing tag because the elements are simple enough to scale and specific enough to recognize.\n\nThe color-shifting logo meant fewer production variants. The seasonal tree graphic meant one illustration could cover a full product calendar. Every design decision optimized for flexibility at the system level, not decoration at the surface level.",
    },
  ],
};
