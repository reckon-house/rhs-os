import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/amber-shockey-co";

export const amberShockeyCoCaseStudy: CaseStudy = {
  slug: "amber-shockey-co",
  title: "Amber Shockey & Co.",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Tableware patterns for Amber Shockey Co., three collections in. | Each one is built to layer, from a single accent dish to the whole table.",
  field: "Pattern Design\nProduct Design\nColorway Development",
  author: "Jeremy Prasatik",
  published: "2017",
  status: "Live",
  classification: ["Pattern Design", "Product Design", "Colorway Development"],
  services: ["Pattern Design", "Product Design", "Colorway Development"],
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
        caption: "Preview · 9 frames",
        colors: ["#1F4D78", "#D87A82", "#8E3F40", "#1F2434", "#ECE6D5"],
        images: [
          "/case-studies/amber-shockey-co/amber-shockey-co-blue-florals-plates-stacked-on-peony-pattern-collection-mockup.jpg",
          "/case-studies/amber-shockey-co/amber-shockey-co-blue-florals-plate-in-wire-rack-hero.jpg",
          "/case-studies/amber-shockey-co/amber-shockey-co-black-linework-geometric-plates-marble-surface-collection-mockup.jpg",
          "/case-studies/amber-shockey-co/amber-shockey-co-red-dragons-plates-stacked-on-dragon-pattern-collection-mockup.jpg",
          "/case-studies/amber-shockey-co/amber-shockey-co-blue-florals-peony-wallpaper-pattern-field.jpg",
          "/case-studies/amber-shockey-co/amber-shockey-co-geometric-linework-circle-blue-cream-pattern-hero-mark.jpg",
          "/case-studies/amber-shockey-co/amber-shockey-co-geometric-diamond-blue-cream-accent-mark.jpg",
          "/case-studies/amber-shockey-co/amber-shockey-co-black-linework-halftone-dot-circle-mark.jpg",
          "/case-studies/amber-shockey-co/amber-shockey-co-black-linework-diamond-cross-pattern-mark.jpg",
        ],
      },
      title: "Amber Shockey\n& Co.",
      subtitle:
        "Tableware patterns for Amber Shockey Co., three collections in. | Each one is built to layer, from a single accent dish to the whole table.",
      field: "Pattern Design  Product Design  Colorway Development",
      author: "Jeremy Prasatik",
      published: "2017",
      status: "Live",
      classification: ["Pattern Design", "Product Design", "Colorway Development"],
      summary: [
        { label: "Built", value: "Three tableware collections: blue florals, black linework, red dragons. A hero, a secondary, and an accent pattern in each" },
        { label: "Scope", value: "Pattern design, product design, colorway development" },
        { label: "Tools", value: "Illustrator, Photoshop, InDesign. Several colorways per collection" },
        { label: "Angle", value: "Every collection shares cream as its ground, so a plate from one can sit on the table with a plate from another." },
      ],
      abstract:
        "Amber Shockey & Co. is a tableware startup. Each of its collections has a hero pattern, a secondary, and an accent, made to layer from a single dish up to a full setting, and every new collection has to sit next to the ones before it.\n\nThree collections are here: blue florals, black linework, red dragons. Each one sets something structured against something organic, and each runs in several colorways, so the same set can go minimal or maximal depending on what it's paired with.\n\nPattern design, product design, and colorway development were done together, as one piece of work.",
    },

    // ── HERO CAROUSEL ──
    // Auto-cycles through the three collection mockups. Tells the brand's range
    // in the first 15 seconds of the page. It sits after the cover, not before
    // it: the cover opens every study in this language, and a carousel cannot
    // rise (PressingCarouselPlate has no climb), so the handover here is the
    // plain one rather than a plate climbing the pinned cover.
    {
      id: "hero",
      type: "hero-carousel",
      slides: [
        {
          src: `${IMG}/amber-shockey-co-blue-florals-plates-stacked-on-peony-pattern-collection-mockup.jpg`,
          alt: "Amber Shockey & Co. blue florals collection, plates layered on peony pattern background, stacked to read as a still life",
        },
        {
          src: `${IMG}/amber-shockey-co-black-linework-geometric-plates-marble-surface-collection-mockup.jpg`,
          alt: "Amber Shockey & Co. black linework collection, geometric plates on marble surface in charcoal and silver",
        },
        {
          src: `${IMG}/amber-shockey-co-red-dragons-plates-stacked-on-dragon-pattern-collection-mockup.jpg`,
          alt: "Amber Shockey & Co. red dragons collection, plates set against dragon pattern backdrop in burgundy and rose",
        },
      ],
      pressing: { captions: ["Three collections, one table"] },
    },

    // ════════════════════════════════════════
    // SECTION 02 — BLUE FLORALS
    // ════════════════════════════════════════
    {
      id: "blue-header",
      type: "section-header",
      label: "SECTION 02: BLUE FLORALS",
      title: "A stack of these plates",
      pressing: {
        mark: { n: "02", name: "Peonies and" },
        heldLine: "reads as a still life.",
        // Pinned: the headline holds while the pattern-on-pattern copy
        // travels past it. This is the collection that layers, so the
        // brief that introduces it should behave like the print does.
        choreo: { pin: true },
      },
    },
    {
      id: "blue-subhead",
      type: "text",
      size: "subhead",
      content:
        "The most pattern-on-pattern of the three, blue peonies over a geometric grid. One plate on its own still works.",
    },
    {
      id: "blue-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "It goes with black linework when the table needs some structure, and cobalt sits next to anything else as long as there's cream in the mix.",
    },

    // 2-up: geometric blue marks (the system inside the colorway). Held, so
    // the wallpaper field can climb across it — the two marks are the parts,
    // the field is what they add up to, and the climb states that order.
    {
      id: "blue-marks-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/amber-shockey-co-geometric-linework-circle-blue-cream-pattern-hero-mark.jpg`,
        alt: "Geometric linework circle pattern in blue and cream, the geometric variant within the blue colorway",
      },
      right: {
        src: `${IMG}/amber-shockey-co-geometric-diamond-blue-cream-accent-mark.jpg`,
        alt: "Clean blue diamond accent mark on grey-blue, the simplest geometric form in the blue family",
      },
      pressing: {
        captions: ["Linework circle\nBlue and cream", "Diamond accent"],
        choreo: { pin: true },
      },
    },

    // Peony wallpaper pattern field — climbs across the held marks
    {
      id: "blue-hero",
      type: "hero",
      image: `${IMG}/amber-shockey-co-blue-florals-peony-wallpaper-pattern-field.jpg`,
      alt: "Blue florals peony pattern at wallpaper scale, full repeat tile showing the rhythm of the print",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── The print on the object, after the print at wallpaper scale.
    // A zoom rather than a plate: a plate can rise but cannot pin, so
    // the only way to add a second full-width picture here without
    // retuning the climb above it is a gesture that holds its own
    // screen. 3080px native, which carries a 1440 mat.
    {
      id: "blue-plate",
      type: "hero",
      image: `${IMG}/amber-shockey-co-blue-florals-plate-in-wire-rack-hero.jpg`,
      alt: "A blue florals plate standing in a wire dish rack, peony border around a geometric medallion",
      inline: true,
      pressing: {
        plate: "02",
        captions: [
          "Blue florals, on the plate",
          "Peony border, geometric centre",
          "The hero pattern and the accent, one object",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ════════════════════════════════════════
    // SECTION 03 — BLACK LINEWORK
    // ════════════════════════════════════════
    {
      id: "black-header",
      type: "section-header",
      label: "SECTION 03: BLACK LINEWORK",
      title: "The simplest of the three",
      // The study's one crossing. The reductive collection is the argument
      // the other two lean on — it sits under everything without competing —
      // so the gesture lands on the middle beat rather than an outer one.
      // `pin` alongside `crossing`: the crossing already holds as part of
      // its own gesture, so the flag changes nothing on the page. It is
      // the A.R.C. convention for saying so in the data, which is what
      // the audit reads.
      pressing: {
        mark: { n: "03", name: "Linework" },
        heldLine: "reads as the most modern.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "black-subhead",
      type: "text",
      size: "subhead",
      content:
        "Geometric grids and halftone dots on charcoal.",
    },
    {
      id: "black-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "It sits under either of the other two. The flat graphic ground lets blue florals or red dragons go on top of a black linework setting and keep their color.",
    },

    // Inline hero: black linework plates mockup. Climbs the crossing
    // headline above it, so the reductive collection arrives over the
    // sentence that claims it sits under everything else.
    // Rise, not zoom, although the file is wide enough for one: the red
    // dragons mockup takes this study's zoom, and two plates-on-backdrop
    // shots pinning for 320dvh each would read as the layout rather than
    // as a gesture spent on the frame that earns it.
    {
      id: "black-hero",
      type: "hero",
      image: `${IMG}/amber-shockey-co-black-linework-geometric-plates-marble-surface-collection-mockup.jpg`,
      alt: "Black linework collection, geometric plates on marble surface in charcoal and silver",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // 2-up: black linework marks
    {
      id: "black-marks-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/amber-shockey-co-black-linework-halftone-dot-circle-mark.jpg`,
        alt: "Black linework collection halftone dot circle on charcoal ground",
      },
      right: {
        src: `${IMG}/amber-shockey-co-black-linework-diamond-cross-pattern-mark.jpg`,
        alt: "Black linework collection navy diamond with cross pattern, the structural mark of the family",
      },
    },

    // ════════════════════════════════════════
    // SECTION 04 — RED DRAGONS
    // ════════════════════════════════════════
    {
      id: "red-header",
      type: "section-header",
      label: "SECTION 04: RED DRAGONS",
      title: "The statement plate for a buyer",
      pressing: {
        mark: { n: "04", name: "Dragons" },
        heldLine: "who only wants one piece.",
        // Pinned. The pairing notes are the fussiest copy in the study
        // and they need the headline still on screen to hang off, right
        // before the zoom takes the frame.
        choreo: { pin: true },
      },
    },
    {
      id: "red-subhead",
      type: "text",
      size: "subhead",
      content:
        "Burgundy dragons curled through floral filigree, the ornamental one of the three.",
    },
    {
      id: "red-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "It works with black linework underneath as the setting. Straight against blue florals it's hard, since the cobalt and the burgundy fight, so put the cream pieces from either collection between them.",
    },

    // Red dragons plates — the zoom. This study's most ornamental frame, and
    // a plate stacked on its own pattern backdrop is the one image where
    // filling the mat and then travelling the frame actually shows something
    // new: the motif at object scale, then at print scale. It fills the
    // viewport width and pans the spill, like every zoom here.
    {
      id: "red-hero",
      type: "hero",
      image: `${IMG}/amber-shockey-co-red-dragons-plates-stacked-on-dragon-pattern-collection-mockup.jpg`,
      alt: "Red dragons collection, plates set against dragon pattern backdrop in burgundy and rose",
      inline: true,
      pressing: {
        plate: "04",
        captions: [
          "Red dragons collection",
          "Plates on the dragon repeat",
          "Burgundy and rose",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // 2-up: red dragons marks
    {
      id: "red-marks-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/amber-shockey-co-red-dragons-burgundy-dragon-mandala-hero-mark.jpg`,
        alt: "Red dragons hero mark, burgundy dragon mandala in circle on muted rose ground",
      },
      right: {
        src: `${IMG}/amber-shockey-co-red-dragons-burgundy-floral-diamond-secondary-mark.jpg`,
        alt: "Red dragons secondary mark, burgundy floral diamond on muted rose ground",
      },
      pressing: {
        captions: ["Dragon mandala\nHero mark", "Floral diamond, secondary"],
      },
    },

    // ── Editorial palate cleanser
    {
      id: "headline-system",
      type: "editorial-headline",
      text: "Every pattern had to work\nnext to every other one",
    },

    // ════════════════════════════════════════
    // SECTION 05 — MARKS & MATERIALS
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 05: MARKS & MATERIALS",
      title: "Four shapes, five colors,\nand cream under every one.",
      introText:
        "Each collection gets one hero shape and one color, and cream runs under all of them.",
      philosophyText:
        "A buyer can start with one accent dish in cobalt and end up with a full red-dragons setting two seasons later, and nothing in the second buy fights anything in the first.",
      colors: [
        { name: "Cobalt", hex: "#1F4D78", description: "Blue florals" },
        { name: "Blush", hex: "#D87A82", description: "Pink geometry" },
        { name: "Burgundy", hex: "#8E3F40", description: "Red dragons" },
        { name: "Charcoal", hex: "#1F2434", description: "Black linework" },
        { name: "Cream", hex: "#ECE6D5", description: "Shared ground" },
      ],
      fonts: [
        {
          name: "Peony",
          role: "Blue florals hero",
          description:
            "The biggest of the four motifs. Layered florals that look like wallpaper at field size and like a single bloom on a plate.",
          family: "'Caslon', 'Adobe Caslon Pro', 'Garamond', serif",
          weight: 400,
        },
        {
          name: "Circle",
          role: "Pink geometry hero",
          description:
            "Linework circles drawn on a construction grid. It carries the color when a collection needs an accent and a full pattern would be too much.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 600,
        },
        {
          name: "Chinese Dragon",
          role: "Red dragons hero",
          description:
            "Dragons in a round mandala, borrowed from Eastern textile work. The most ornamental of the four.",
          family: "'Didot', 'Bodoni 72', 'Caslon', serif",
          weight: 400,
        },
        {
          name: "Halftone Dot",
          role: "Black linework hero",
          description:
            "Density made from dots. The plainest of the four, and the one that goes under everything else.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 300,
        },
      ],
      markImage: `${IMG}/amber-shockey-co-geometric-diamond-blue-construction-grid-system-mark.jpg`,
      markAlt: "Geometric diamond accent mark with construction grid behind, showing the underlying geometry that holds the system together",
      pressing: { mark: { n: "05", name: "Four Shapes" } },
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "Any two collections on the same table.",
      pressing: { mark: { n: "06", name: "The Same Table" } },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Pattern, product, and colorway, designed together.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Pattern Design", "Product Design", "Colorway Development"],
      stack: ["Illustrator", "Photoshop", "InDesign"],
      links: [],
      content:
        "Three collections so far, and each one was drawn to sit next to the last.",
    },
  ],
};
