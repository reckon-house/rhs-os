import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/amber-shockey-co";

export const amberShockeyCoCaseStudy: CaseStudy = {
  slug: "amber-shockey-co",
  title: "Amber Shockey & Co.",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Tableware pattern design. Built as systems that layer, mix, and scale from single accent to full table.",
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
        caption: "Preview · 8 frames",
        colors: ["#1F4D78", "#D87A82", "#8E3F40", "#1F2434", "#ECE6D5"],
        images: [
          "/case-studies/amber-shockey-co/amber-shockey-co-blue-florals-plates-stacked-on-peony-pattern-collection-mockup.jpg",
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
        "Tableware pattern design. Built as systems that layer, mix, and scale from single accent to full table.",
      field: "Pattern Design  Product Design  Colorway Development",
      author: "Jeremy Prasatik",
      published: "2017",
      status: "Live",
      classification: ["Pattern Design", "Product Design", "Colorway Development"],
      summary: [
        { label: "Built", value: "Three tableware collections: blue florals, black linework, red dragons. Hero, secondary, accent per set" },
        { label: "Scope", value: "Pattern design, product design, colorway development" },
        { label: "Tools", value: "Illustrator, Photoshop, InDesign. Multiple colorways per collection" },
        { label: "Angle", value: "Patterns built as a system, not a single print. Cream as shared ground, so a pattern only works if the next one fits." },
      ],
      abstract:
        "Tableware patterns built as systems. Each collection runs hero, secondary, accent. Designed to layer from a single dish to a full setting without losing logic.\n\nThree collections shown here: blue florals, black linework, red dragons. Each direction balances structured against organic. Each runs multiple colorways so the same set flexes from minimal to maximal depending on how it pairs.\n\nBuilt for a tableware startup that needed a system, not a single pattern. Pattern design, product design, and colorway development as one continuous process.",
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
      pressing: { captions: ["Three collections, one system"] },
    },

    // ════════════════════════════════════════
    // SECTION 02 — BLUE FLORALS
    // ════════════════════════════════════════
    {
      id: "blue-header",
      type: "section-header",
      label: "SECTION 02: BLUE FLORALS",
      title: "Peonies and",
      pressing: {
        mark: { n: "02", name: "Peonies and" },
        heldLine: "Geometry.",
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
        "The most pattern-on-pattern direction. Blue peonies layered against a geometric grid. Plates that read as a still life when set, as a single object when used alone.",
    },
    {
      id: "blue-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Pairs with black linework when the set needs structure. Pairs with red dragons when the table needs heat. The cobalt anchors any combination because every other collection shares cream as the common ground.",
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

    // ════════════════════════════════════════
    // SECTION 03 — BLACK LINEWORK
    // ════════════════════════════════════════
    {
      id: "black-header",
      type: "section-header",
      label: "SECTION 03: BLACK LINEWORK",
      title: "Linework",
      // The study's one crossing. The reductive collection is the argument
      // the other two lean on — it sits under everything without competing —
      // so the gesture lands on the middle beat rather than an outer one.
      // `pin` alongside `crossing`: the crossing already holds as part of
      // its own gesture, so the flag changes nothing on the page. It is
      // the A.R.C. convention for saying so in the data, which is what
      // the audit reads.
      pressing: {
        mark: { n: "03", name: "Linework" },
        heldLine: "and Dots.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "black-subhead",
      type: "text",
      size: "subhead",
      content:
        "The most reductive direction. Geometric grids and halftone density on charcoal. Reads as the most modern of the three. Holds against everything else.",
    },
    {
      id: "black-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Mixes into any other collection without competing. The graphic flatness lets blue florals or red dragons sit on top of a black linework setting without losing color depth.",
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
      title: "Dragons",
      pressing: {
        mark: { n: "04", name: "Dragons" },
        heldLine: "and Florals.",
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
        "The most ornamental direction. Burgundy dragons curled against floral filigree. Reads as Eastern textile work. The hero piece of the line for buyers who want one statement plate.",
    },
    {
      id: "red-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Lands well with black linework underneath as a setting. Hard against blue florals; the cobalt and burgundy fight. Pair with the cream pieces in either collection to break the contrast.",
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
      text: "A pattern only works\nif the next one fits.",
    },

    // ════════════════════════════════════════
    // SECTION 05 — MARKS & MATERIALS
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 05: MARKS & MATERIALS",
      title: "A Family of Shapes.\nA Single System.",
      introText:
        "Five colors. Four shapes. One rule. The whole line scales out of a small set of decisions made once and held across every direction.",
      philosophyText:
        "Patterns work as a family. A buyer can start with one accent dish in cobalt and end up with a full red-dragons setting two seasons later. Nothing in the second buy fights anything in the first.\n\nEach collection has a hero shape and a colorway. Peony lives in cobalt. Circle lives in blush. Chinese dragon lives in burgundy. Halftone dot lives in charcoal. Cream runs underneath as the shared ground that lets any two collections sit together without fighting.",
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
            "The largest motif in the line. Layered florals that read as wallpaper at field scale and as a single bloom at plate scale.",
          family: "'Caslon', 'Adobe Caslon Pro', 'Garamond', serif",
          weight: 400,
        },
        {
          name: "Circle",
          role: "Pink geometry hero",
          description:
            "Linework circles built on a construction grid. The most reduced form of the geometric language. Carries the colorway when the collection needs an accent without a full pattern.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 600,
        },
        {
          name: "Chinese Dragon",
          role: "Red dragons hero",
          description:
            "Dragons curled around floral filigree, set in a circular mandala. The most ornamental motif. Pulls Eastern textile work into a Western tableware context.",
          family: "'Didot', 'Bodoni 72', 'Caslon', serif",
          weight: 400,
        },
        {
          name: "Halftone Dot",
          role: "Black linework hero",
          description:
            "Density built from points instead of lines. The most reductive direction in the family. Sits under any other pattern without competing for the surface.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 300,
        },
      ],
      markImage: `${IMG}/amber-shockey-co-geometric-diamond-blue-construction-grid-system-mark.jpg`,
      markAlt: "Geometric diamond accent mark with construction grid behind, showing the underlying geometry that holds the system together",
      pressing: { mark: { n: "05", name: "A Family of Shapes" } },
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "The Set Builds Itself.",
      pressing: { mark: { n: "06", name: "The Set Builds Itself" } },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Pattern, product, color. Same hands across the system, so each new direction inherits the logic.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Pattern Design", "Product Design", "Colorway Development"],
      stack: ["Illustrator", "Photoshop", "InDesign"],
      links: [],
      content:
        "A startup needed patterns that could hold a full tableware line without locking into a single look. The system answers in three marks per collection and shared ground colors across the family. New directions slot in without breaking what came before.",
    },
  ],
};
