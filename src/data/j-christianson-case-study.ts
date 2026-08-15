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
      summary: [
        { label: "Built", value: "Name, four-circle mark, color system, tree graphic, product applications" },
        { label: "Scope", value: "Brand development, naming, logo and graphic design" },
        { label: "Tools", value: "Adobe Illustrator, Adobe Photoshop" },
        { label: "Angle", value: "One mark shifts its palette by context without losing recognition. One tree drawing, four colorways, doing the work of a full product line." },
      ],
      abstract:
        "Ground-up brand development for a fashion and home goods label. Started with the name, then built the mark, color system, typography, and product graphics from there.\n\nThe logo is four circles in a tight grid - same form, different color combinations depending on where it lives. Brown circles with accent colors for one context, olive circles with the same accents for another. Flexibility was built into the identity from the first sketch, so one mark could shift its palette without losing recognition.\n\nA tree silhouette did the rest of the heavy lifting, rendered in four seasonal colorways and layered over a striped color field pulled from the brand palette. The graphic showed up on apparel, candles, hangtags, and print materials - one drawing doing the work of a full product line.",
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
      title: "One Drawing",
      // Pinned because this is the study's long argument: the headline
      // holds while four colorways, four surfaces, and the breakout
      // detail travel past it as one column.
      pressing: {
        mark: { n: "02", name: "One Drawing" },
        heldLine: "Carrying a Full Range.",
        choreo: { pin: true },
      },
      group: { name: "tree", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "tree-text",
      type: "text",
      size: "subhead",
      content:
        "Where the logo gave the brand recognition, the tree gave it a story - a white silhouette layered over the brand's stripe pattern, breaking out at the edges into white space.",
      group: { name: "tree" },
    },
    {
      id: "tree-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Four colorways - teal and dark green, yellow and gold, orange and rust, brown and earth tones. Same tree and stripe pattern, different palette in each. Branches reach past the color block into white space, breaking the rectangle so the graphic feels drawn by hand. Used on apparel, candle labels, hangtags, and promotional print, one drawing earned a full product range.",
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
      alt: "J. Christianson four seasonal tree circles, teal, yellow, orange, brown landscape silhouettes",
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
          "Four-dot mark centered",
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
      title: "A Mark That Shifts",
      // The study's one crossing. A mark that changes with its setting is
      // the whole identity argument here.
      // pin rides with the crossing: PressingCrossing holds its own
      // headline, and the brand-pattern plate below climbs the room this
      // cluster reserves.
      pressing: {
        mark: { n: "03", name: "A Mark That Shifts" },
        heldLine: "Its Palette by Context.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "mark-text",
      type: "text",
      size: "subhead",
      content:
        "Four circles arranged in a square - tight spacing, no outline, constant form. The colors rotate depending on where the mark appears.",
    },
    {
      id: "mark-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Brown circles with yellow, orange, red, and teal accents in one version. Olive circles with the same accents in another. The accent colors hold position (bottom-right cluster) while the dominant color shifts. Recognition comes from the grid. Fewer locked variations meant more places the mark could land without redrawing.",
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
      text: "Type that looks\nlike it was found",
    },

    // ── OUTDOOR SIGN HERO — the last picture, grown to full size ──
    // The study's second and final zoom. A quote poster holds nothing, so
    // this cannot climb, and it is the right frame to grow anyway: the
    // seasonal circles from section 02 fabricated and lit. 3080px native.
    {
      id: "outdoor-hero",
      type: "hero",
      image: `${IMG}/j-christianson-outdoor-sign-seasonal-tree-circles.jpg`,
      alt: "J. Christianson outdoor sign mockup, four seasonal tree circles, evening lighting",
      inline: true,
      pressing: {
        plate: "03",
        captions: [
          "Four seasonal circles as signage",
          "Evening light on the facade",
          "The tree graphic, fabricated",
        ],
        choreo: { zoom: true },
      },
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 04: CLOSING",
      title: "From a Name",
      pressing: {
        mark: { n: "04", name: "From a Name" },
        heldLine: "to a Storefront.",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "A brand built from a blank page. Name, mark, color, graphics, product applications. All developed as one connected set of decisions.",
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
        "Four circles in a grid, a tree silhouette over color stripes, a palette pulled from mid-century earth tones warm enough to feel organic without leaning into the nostalgia. The identity holds from a billboard down to a clothing tag because the elements were built to scale.\n\nThe color-shifting logo meant fewer production variants, and the seasonal tree graphic let one illustration cover a full product calendar. Decisions made at the system level so the surface could stay simple.",
    },
  ],
};
