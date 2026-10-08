import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/j-christianson";

export const jChristiansonCaseStudy: CaseStudy = {
  slug: "j-christianson",
  title: "J. Christianson",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "A brand identity for J. Christianson, a fashion and home goods label, built from the name outward. | The four-circle mark changes color from place to place, and the product graphics come from one tree drawing.",
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
  style: "pressing",
  sections: [
    // ── META ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 8 frames",
        colors: ["#DCA23D", "#2D2B27", "#E5D443", "#593D19", "#B6B548"],
        images: [
          "/case-studies/j-christianson/j-christianson-storefront-tree-stripe-window-mockup.jpg",
          "/case-studies/j-christianson/j-christianson-tree-stripe-graphic-breakout.jpg",
          "/case-studies/j-christianson/j-christianson-tree-stripe-graphic-tagline.jpg",
          "/case-studies/j-christianson/j-christianson-four-seasonal-tree-circles-flat.jpg",
          "/case-studies/j-christianson/j-christianson-billboard-mockup-brand-pattern.jpg",
          "/case-studies/j-christianson/j-christianson-brand-pattern-logo-four-colors.jpg",
          "/case-studies/j-christianson/j-christianson-storefront-sign-dot-grid-brown.jpg",
          "/case-studies/j-christianson/j-christianson-outdoor-sign-seasonal-tree-circles.jpg",
        ],
      },
      title: "J. Christianson",
      subtitle:
        "A brand identity for J. Christianson, a fashion and home goods label, built from the name outward. | The four-circle mark changes color from place to place, and the product graphics come from one tree drawing.",
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
      summary: [
        { label: "Built", value: "Name, four-circle mark, palette, tree graphic, product applications" },
        { label: "Scope", value: "Brand development, naming, logo and graphic design" },
        { label: "Tools", value: "Adobe Illustrator, Adobe Photoshop" },
        { label: "Angle", value: "The mark changes color depending on where it goes, and one tree drawing carries the product graphics." },
      ],
      abstract:
        "J. Christianson is a fashion and home goods label, and the brand started from nothing: the name first, then the mark, the palette, the type, and the product graphics.\n\nThe logo is four circles in a tight grid. Its shape stays the same and its colors change with the setting, so the one mark can still be recognized.\n\nThe product graphics come from a tree silhouette, drawn once and set over a striped field in the brand colors. The tree graphic was designed with apparel, candles, hangtags, and print in mind.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/j-christianson-storefront-tree-stripe-window-mockup.jpg`,
      alt: "J. Christianson tree stripe graphic in storefront window, natural light",
      pressing: { choreo: { rise: true } },
    },

    // ── THE TREE — grouped in white container ──
    {
      id: "tree-header",
      type: "section-header",
      label: "SECTION 02: THE TREE",
      title: "The tree's branches run past the edge",
      // Pinned because this is the study's long argument: the headline
      // holds while four colorways, four surfaces, and the breakout
      // detail travel past it as one column.
      pressing: {
        mark: { n: "02", name: "The Tree" },
        heldLine: "of the stripes.",
        choreo: { pin: true },
      },
      group: { name: "tree", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "tree-text",
      type: "text",
      size: "subhead",
      content:
        "The tree graphic is a white silhouette over the brand's stripe pattern.",
      group: { name: "tree" },
    },
    {
      id: "tree-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Four round pieces show landscapes in teal and dark green, yellow and gold, orange and rust, and brown and earth tones.",
      group: { name: "tree" },
    },
    {
      id: "tree-pair",
      type: "dual-image",
      native: true,
      blend: "multiply",
      group: { name: "tree" },
      left: {
        src: `${IMG}/j-christianson-tree-stripe-graphic-breakout.jpg`,
        alt: "J. Christianson tree silhouette breaking out of stripe color field",
      },
      right: {
        src: `${IMG}/j-christianson-tree-stripe-graphic-tagline.jpg`,
        alt: "J. Christianson tree stripe graphic with tagline, Heavenly Inspired Fashion and Design",
      },
      // Held so the four seasonal circles climb across it. The spacer that
      // used to sit between them moved below: pressing checks the climb
      // contract against the ADJACENT section, and a spacer in the gap
      // reads as "nothing holds this" even though the layout consumes it.
      pressing: {
        captions: ["Tree breaking the stripe", "Tagline lockup"],
        choreo: { pin: true },
      },
    },
    {
      id: "seasonal-flat",
      type: "image",
      src: `${IMG}/j-christianson-four-seasonal-tree-circles-flat.jpg`,
      alt: "J. Christianson four tree circles, teal, yellow, orange, brown landscape silhouettes",
      aspect: "native",
      maxWidth: 400,
      blend: "multiply",
      group: { name: "tree" },
      pressing: { choreo: { rise: true } },
    },
    { id: "tree-spacer", type: "spacer", height: 60, group: { name: "tree" } },

    // ── BILLBOARD HERO (old hero, now inline) ──
    // Zoomed rather than risen for two reasons. The tree group ends on the
    // seasonal-circle riser, so nothing above this holds and a climb would
    // cross a section still moving. And a billboard is the one frame in
    // the study built to be read at full size: 3072px native carries it.
    {
      id: "billboard-hero",
      type: "hero",
      image: `${IMG}/j-christianson-billboard-mockup-brand-pattern.jpg`,
      alt: "J. Christianson brand identity on billboard, organic color shapes with four-dot logo",
      inline: true,
      pressing: {
        plate: "02",
        captions: [
          "Brand pattern at billboard scale",
          "Four-circle mark centered",
          "Organic color shapes",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── THE MARK ──
    {
      id: "mark-header",
      type: "section-header",
      label: "SECTION 03: THE MARK",
      title: "The same four circles run on",
      // The study's one crossing. A mark that changes with its setting is
      // the whole identity argument here.
      // pin rides with the crossing: PressingCrossing holds its own
      // headline, and the brand-pattern plate below climbs the room this
      // cluster reserves.
      pressing: {
        mark: { n: "03", name: "Four Circles" },
        heldLine: "a billboard and a storefront sign.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "mark-text",
      type: "text",
      size: "subhead",
      content:
        "The mark is drawn with tight spacing and no outline.",
    },
    {
      id: "mark-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The dot grid pattern keeps the yellow, orange, red, and teal circles in the bottom-right cluster, and the rest of its circles are brown in one version and olive in the other. Fewer fixed versions of the mark meant it could go more places without being redrawn.",
    },

    // ── BRAND PATTERN — climbs the mark section it belongs to ──
    // Rise, not zoom: the artwork is 1868px native, under the width where
    // a full-mat frame stays crisp. It reads fine at plate size.
    {
      id: "brand-pattern",
      type: "image",
      src: `${IMG}/j-christianson-brand-pattern-logo-four-colors.jpg`,
      alt: "J. Christianson brand pattern, four organic color shapes with logo centered",
      aspect: "native",
      padded: true,
      blend: "multiply",
      pressing: { choreo: { rise: true } },
    },

    // ── DOT GRID PAIR (these two stay together) ──
    {
      id: "dot-grid-pair",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: `${IMG}/j-christianson-dot-grid-pattern-brown-accents.png`,
        alt: "J. Christianson dot grid pattern, brown with yellow, orange, red, teal accents",
      },
      right: {
        src: `${IMG}/j-christianson-dot-grid-pattern-olive-accents.png`,
        alt: "J. Christianson dot grid pattern, olive with yellow, orange, red, teal accents",
      },
      // Held so the storefront sign can climb it. The pair states the two
      // colorways flat, the sign arrives carrying the brown one, and the
      // climb is the argument: pattern to signage in one move.
      pressing: { choreo: { pin: true } },
    },

    // ── STOREFRONT HERO — climbs across the held dot-grid pair ──
    // Moved above the permutations chart. The climb contract reads the
    // ADJACENT section, and a chart holds nothing; sitting next to the
    // pair is what earns this plate its rise.
    {
      id: "storefront-hero",
      type: "hero",
      image: `${IMG}/j-christianson-storefront-sign-dot-grid-brown.jpg`,
      alt: "J. Christianson storefront sign mockup, dot grid pattern on wood facade",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── COLOR PERMUTATIONS CHART ──
    {
      id: "color-permutations",
      type: "color-permutations",
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-found",
      type: "editorial-headline",
      text: "A brand built from the ground up,\nstarting with the name\nand a simple shape",
    },

    // ── OUTDOOR SIGN HERO — the last picture, grown to full size ──
    // The study's second and final zoom. A quote poster holds nothing, so
    // this cannot climb, and it is the right frame to grow anyway: the
    // four round pieces from section 02, mocked up as a lit sign. 3080px
    // native.
    {
      id: "outdoor-hero",
      type: "hero",
      image: `${IMG}/j-christianson-outdoor-sign-seasonal-tree-circles.jpg`,
      alt: "J. Christianson outdoor sign mockup, four tree circles, evening lighting",
      inline: true,
      pressing: {
        plate: "03",
        captions: [
          "Four round pieces as signage",
          "Evening light on the facade",
          "A sign mockup",
        ],
        choreo: { zoom: true },
      },
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 04: CLOSING",
      title: "The whole identity was drawn to fit",
      pressing: {
        mark: { n: "04", name: "Big or Small" },
        heldLine: "a billboard and a candle label.",
      },
    },
    // No subhead here on purpose. The one it had re-told the abstract
    // (name, mark, color, graphics, all from a blank page).
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
        "J. Christianson's colors are mid-century earth tones.\n\nThe name, the mark and the tree were decided once, up front, and every piece after that used them as they were.",
    },
  ],
};
