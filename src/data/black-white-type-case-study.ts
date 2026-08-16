import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/black-white-type";

export const blackWhiteTypeCaseStudy: CaseStudy = {
  slug: "black-white-type",
  title: "Typography & Patterns",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Personal work: six patterns and three art prints, in black and white only. | A vocabulary small enough to fit on a napkin, applied to letterforms large enough to fill a wall.",
  field: "Typography Design\nPattern Design\nArt Direction",
  author: "Jeremy Prasatik",
  published: "2023",
  status: "Complete",
  classification: [
    "Typography Design",
    "Pattern Design",
    "Art Direction",
    "Print",
  ],
  services: [
    "Typography Design",
    "Pattern Design",
    "Art Direction",
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
        colors: ["#C1C1C1", "#515151", "#D9D9D9", "#838383", "#4B4744"],
        images: [
          "/case-studies/black-white-type/typography-patterns-the-fancy-poster-wood-surface-lifestyle.jpg",
          "/case-studies/black-white-type/pattern-swatch-diamonds-white-on-black.jpg",
          "/case-studies/black-white-type/pattern-swatch-vertical-hairlines.jpg",
          "/case-studies/black-white-type/pattern-swatch-dense-dots-white-on-black.jpg",
          "/case-studies/black-white-type/pattern-swatch-horizontal-grouped-lines.jpg",
          "/case-studies/black-white-type/typography-patterns-stepper-poster-bench-lifestyle.jpg",
          "/case-studies/black-white-type/pattern-swatch-horizontal-lines-white-on-black.jpg",
          "/case-studies/black-white-type/pattern-swatch-large-dots-grid-black-on-white.jpg",
        ],
      },
      title: "Typography\n& Patterns",
      subtitle:
        "Personal work: six patterns and three art prints, in black and white only. | A vocabulary small enough to fit on a napkin, applied to letterforms large enough to fill a wall.",
      field: "Typography Design  Pattern Design  Art Direction",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Complete",
      classification: [
        "Typography Design",
        "Pattern Design",
        "Art Direction",
        "Print",
      ],
      summary: [
        { label: "Built", value: "Three art prints, twelve pattern tiles" },
        { label: "Scope", value: "Typography, pattern design, art direction" },
        { label: "Tools", value: "Adobe Illustrator, Photoshop" },
        { label: "Angle", value: "Six shapes, no color, and the only decisions left were placement and scale." },
      ],
      abstract:
        "Personal work. The question was how much range a small set of patterns could produce once color, photography and gradients were off the table. What was left was black ink, white paper, and six repeating shapes simple enough for a child to draw.\n\nDots at two scales, lines in three directions, and a diamond grid, each one drawn as a positive and a negative, twelve tiles in all. They fill the letterforms, spill outside them, and sit behind them as backgrounds. Three art prints came out of that set, and they land in three different places.\n\nWith no color to lean on, tone comes from spacing. A packed fill reads dark and an open one reads light, and the biggest shape on the sheet is where the eye goes first. The amount of paper left around a letter sets the mood of the whole print.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/typography-patterns-the-fancy-poster-wood-surface-lifestyle.jpg`,
      alt: "Typography & Patterns poster on wood surface, expressive letterforms filled with black and white patterns",
      pressing: { choreo: { rise: true } },
    },

    // ── THE RULES — grouped in black container ──
    {
      id: "rules-header",
      type: "section-header",
      label: "SECTION 02: THE RULES",
      title: "Six patterns,",
      // The study's one crossing, in the BRIEF form (pin + crossing) rather
      // than standalone: this header carries the method columns, and
      // PRESSING.md §7 reserves the standalone crossing for headers whose
      // copy is short. Headline crosses, then pins while the vocabulary
      // travels past it.
      pressing: {
        mark: { n: "02", name: "Six Patterns" },
        heldLine: "twelve tiles.",
        choreo: { pin: true, crossing: true },
      },
      group: { name: "rules", bg: "#141414", radius: 75, padding: "60px" },
    },
    {
      id: "rules-text",
      type: "text",
      size: "subhead",
      content:
        "Every pattern is drawn twice, black on white and white on black, which is how six become twelve. From there the only things that change are scale and spacing.",
      group: { name: "rules" },
    },
    {
      id: "rules-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each swatch is a tile that repeats in any direction and at any size. The shapes are plain enough that any two of them can sit side by side, and most of the detail in the prints comes from layering them.",
      group: { name: "rules" },
    },
    {
      id: "rules-columns",
      type: "three-column-text",
      columns: [
        {
          title: "Twelve Tiles",
          content:
            "Dots at two scales, a dense halftone and an open grid. Lines three ways: vertical hairlines, horizontal bands, diagonal stripes. And one diamond grid. Every texture in the three prints is one of these, or its inverse.",
        },
        {
          title: "No Color",
          content:
            "Color separates things and builds hierarchy almost on its own, and there was none of it here. Thick stripes come forward, thin hairlines drop back, and that is about the whole tonal range.\n\nSo contrast had to come from shape. Heavy geometric letters next to loose calligraphic strokes, and dense fills next to open paper.",
        },
        {
          title: "Three Words",
          content:
            "Each print is one word: \"the Fancy,\" \"stepper,\" \"white.\" One is set in script, one in geometric capitals, and one in a mix of the two. The tiles are the same in all three, so the type is where the personality comes from.",
        },
      ],
      group: { name: "rules" },
    },

    // ── PATTERN LIBRARY CHART ──
    {
      id: "pattern-matrix",
      type: "pattern-matrix",
      group: { name: "rules" },
    },

    // ── POSTER 1: "the Fancy" ──
    {
      id: "fancy-header",
      type: "section-header",
      label: "SECTION 03: ART PRINT 01 / THE FANCY",
      title: "The Fancy,",
      pressing: {
        mark: { n: "03", name: "The Fancy" },
        heldLine: "script filled with dots and stripes.",
        // Holds while the fill list travels past it, then the print itself
        // climbs the column that just described it.
        choreo: { pin: true },
      },
    },
    {
      id: "fancy-text",
      type: "text",
      size: "subhead",
      content:
        "The script sits low in the left corner and runs loose, with swashes trailing off the edge of the sheet. A fine dot grid covers the background, and every stroke gets a different fill, so the weight changes letter by letter.",
    },
    {
      id: "fancy-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "It reads \"the Fancy\" in a Didone-influenced script. Polka dots in the bowl of the 'a,' diagonal stripes in the crossbar of the 'F,' vertical hairlines in the descender of the 'y.'",
    },

    // ── FLAT ART — the print arrives before the swatches that built it.
    // The footnote above has just named every fill in it, so the artwork
    // climbs the column while that list is still on screen. Prints 02 and
    // 03 run the other way round, vocabulary first.
    {
      id: "fancy-flat",
      type: "image",
      src: `${IMG}/typography-patterns-the-fancy-poster-flat.png`,
      alt: "Typography & Patterns, the Fancy poster, flat artwork with pattern-filled script letterforms",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── PATTERN SWATCHES ──
    // The zoom goes on a swatch rather than a poster. The study's claim is
    // that density alone does the tonal work, and a tight grid reading dark
    // is something you check at full size instead of taking on trust.
    // 3080px native, so it carries the mat.
    {
      id: "fancy-swatch-3",
      type: "image",
      src: `${IMG}/pattern-swatch-dense-dots-white-on-black.jpg`,
      alt: "Pattern swatch, dense dots, white on black",
      aspect: "native",
      padded: true,
      pressing: {
        plate: "03",
        captions: [
          "Dense dots, white on black",
          "The dense end of the range",
          "One of twelve tiles",
        ],
        choreo: { zoom: true },
      },
    },
    {
      id: "fancy-swatch-4",
      type: "image",
      src: `${IMG}/pattern-swatch-horizontal-grouped-lines.jpg`,
      alt: "Pattern swatch, horizontal grouped lines",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },
    // Two swatches at rest to close the section. Nothing climbs them, so no
    // pin: the quote poster below names the vocabulary they just showed.
    {
      id: "fancy-swatches-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/pattern-swatch-diamonds-white-on-black.jpg`,
        alt: "Pattern swatch, diamonds grid, white on black",
      },
      right: {
        src: `${IMG}/pattern-swatch-vertical-hairlines.jpg`,
        alt: "Pattern swatch, vertical hairlines on white",
      },
      pressing: {
        captions: ["Diamonds\nWhite on black", "Vertical hairlines"],
      },
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-constraint",
      type: "editorial-headline",
      text: "Dots, lines, stripes, diamonds.\nThat's the whole set.",
    },

    // ── POSTER 2: "stepper" — the zoom. A print photographed in a room is
    // the one frame where filling the mat changes what you can read: the
    // object in its setting, then the letterforms at print scale. No
    // zoomFit — the frame is near-square, so filling the width leaves a
    // modest spill to pan rather than a landscape's worth.
    {
      id: "stepper-lifestyle",
      type: "hero",
      image: `${IMG}/typography-patterns-stepper-poster-bench-lifestyle.jpg`,
      alt: "Typography & Patterns, stepper art print displayed on wooden bench",
      inline: true,
      pressing: {
        plate: "04",
        captions: [
          "Stepper, art print 02",
          "Slab capitals and script",
          "Photographed on the bench",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },
    // The stripes cross the print they fill. The swatch climbs the zoom's
    // held screen, and the brief that explains the composition arrives after
    // the eye has already met it.
    {
      id: "stepper-swatch-3",
      type: "image",
      src: `${IMG}/pattern-swatch-diagonal-stripes-white-on-black.jpg`,
      alt: "Pattern swatch, diagonal stripes, white on black",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },
    {
      id: "stepper-header",
      type: "section-header",
      label: "SECTION 04: ART PRINT 02 / STEPPER",
      title: "Stepper,",
      pressing: {
        mark: { n: "04", name: "Stepper" },
        heldLine: "slab capitals stacked edge to edge.",
        choreo: { pin: true },
      },
    },
    {
      id: "stepper-text",
      type: "text",
      size: "subhead",
      content:
        "Script threads between the capitals, and the fills run at a much bigger scale than in the first print, so the same tiles come across a lot bolder.",
    },
    {
      id: "stepper-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Large polka dots fill a capital 'E' and diagonal stripes run through a slab-serif 'R' from top to bottom. Geometric serifs sit in among the slabs.",
    },

    // ── PATTERN SWATCHES ──
    {
      id: "stepper-swatch-4",
      type: "image",
      src: `${IMG}/pattern-swatch-halftone-dots-black-on-white.jpg`,
      alt: "Pattern swatch, halftone dots, black on white",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },
    // Held so the finished print can climb them. Two tiles at rest, then the
    // composition they end up inside crosses the screen.
    {
      id: "stepper-swatches-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/pattern-swatch-horizontal-lines-white-on-black.jpg`,
        alt: "Pattern swatch, horizontal lines, white on black",
      },
      right: {
        src: `${IMG}/pattern-swatch-large-dots-grid-black-on-white.jpg`,
        alt: "Pattern swatch, large dots grid, black on white",
      },
      pressing: { choreo: { pin: true } },
    },

    // ── FLAT ART ──
    {
      id: "stepper-flat",
      type: "image",
      src: `${IMG}/typography-patterns-stepper-poster-flat.png`,
      alt: "Typography & Patterns, stepper poster, flat artwork with bold geometric letterforms",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-density",
      type: "editorial-headline",
      text: "The tighter the grid,\nthe darker it reads.",
    },

    // ── POSTER 3: "white" — brief first, and the photograph climbs it.
    // Print 02 opened on its image; this one opens on the argument, so the
    // two adjacent sections do not stage the same way.
    {
      id: "white-header",
      type: "section-header",
      label: "SECTION 05: ART PRINT 03 / WHITE",
      title: "Calligraphy up top,",
      pressing: {
        mark: { n: "05", name: "White" },
        heldLine: "a heavy A and K below.",
        choreo: { pin: true },
      },
    },
    {
      id: "white-text",
      type: "text",
      size: "subhead",
      content:
        "The strokes across the top are thin enough to read as drawing. Down in the lower right, the geometric 'A' and the slab 'K' are as mechanical as the strokes are handmade.",
    },
    {
      id: "white-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The dot grid behind it is the most open of the three prints, pinpoints on a wide field. Not every stroke gets a fill here, so the ones that do read louder.",
    },

    // The print in the world, climbing the brief that describes it. It is a
    // riser rather than the section's second zoom: print 02 already spends
    // the object-in-a-room gesture, and two of them back to back would read
    // as the layout rather than as a choice.
    {
      id: "white-lifestyle",
      type: "hero",
      image: `${IMG}/typography-patterns-white-poster-gate-lifestyle.jpg`,
      alt: "Typography & Patterns, white art print leaning against metal gate outdoors",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── PATTERN SWATCHES ──
    {
      id: "white-swatches-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/pattern-swatch-large-circles-white-on-black.jpg`,
        alt: "Pattern swatch, large circles, white on black",
      },
      right: {
        src: `${IMG}/pattern-swatch-vertical-bar-stripes.jpg`,
        alt: "Pattern swatch, vertical bar stripes",
      },
      pressing: {
        captions: ["Large circles\nWhite on black", "Vertical bar stripes"],
        choreo: { pin: true },
      },
    },
    {
      id: "white-swatch-3",
      type: "image",
      src: `${IMG}/pattern-swatch-thick-horizontal-stripes.jpg`,
      alt: "Pattern swatch, thick horizontal stripes",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },
    // The second zoom answers the first. Section 03 held the dense dot grid
    // at full size; this is the same element at the open end of the range,
    // shown the same way so the two are comparable. The copy above calls
    // this print the most open of the three. 3080px native.
    {
      id: "white-swatch-4",
      type: "image",
      src: `${IMG}/pattern-swatch-sparse-dots-white-on-black.jpg`,
      alt: "Pattern swatch, sparse dots, white on black",
      aspect: "native",
      padded: true,
      pressing: {
        plate: "05",
        captions: [
          "Sparse dots, white on black",
          "The open end of the range",
          "Dots at the other scale",
        ],
        choreo: { zoom: true },
      },
    },

    // ── FLAT ART ──
    {
      id: "white-flat",
      type: "image",
      src: `${IMG}/typography-patterns-white-poster-flat.png`,
      alt: "Typography & Patterns, white poster, flat artwork with calligraphic and geometric letterforms",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── HOW THE SYSTEM WORKS — grouped in black container ──
    {
      id: "system-header",
      type: "section-header",
      label: "SECTION 06: HOW THE SYSTEM WORKS",
      title: "Where the tiles land,\nand how big.",
      // The headline holds while three columns of evidence travel past it.
      // Nothing climbs this one, so no climb room is derived.
      pressing: {
        mark: { n: "06", name: "Placement and Scale" },
        choreo: { pin: true },
      },
      group: { name: "system", bg: "#141414", radius: 75, padding: "60px" },
    },
    {
      id: "system-text",
      type: "text",
      size: "subhead",
      content:
        "All three prints use every one of the six patterns.",
      group: { name: "system" },
    },
    {
      id: "system-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "What changes is where each pattern lands, how large it runs, and how much paper is left around it. That turned out to be enough for three prints that don't look like they came from the same set.",
      group: { name: "system" },
    },
    {
      id: "system-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Dot Grid",
          content:
            "Background in \"the Fancy,\" at a scale fine enough to read as light gray, close to paper grain. In \"stepper\" the same tile is blown up to fill a whole capital, and at that size each dot is a shape in its own right. In \"white\" it drops to sparse pinpoints.",
        },
        {
          title: "Diagonal Stripes",
          content:
            "The same 45-degree stripe at the same line weight in both prints. In \"the Fancy\" it is one crossbar wide and easy to miss. In \"stepper\" it fills a slab letter top to bottom, and blown up like that the angle gives the whole stack some speed.\n\nThe only difference is how much of the letter it covers.",
        },
        {
          title: "White Space",
          content:
            "Three ratios of ink to paper. \"the Fancy\" is mostly paper, with the letters clustered in the lower left. \"stepper\" runs edge to edge. \"white\" sits between them, open background, dense cluster at the bottom.\n\nThat ratio is most of what separates the sparse print from the packed one.",
        },
      ],
      group: { name: "system" },
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 07: CLOSING",
      title: "Simple patterns,\nelaborate type.",
      pressing: { mark: { n: "07", name: "Closing" } },
    },
    // No subhead here on purpose. It said "no client, no brief, no
    // deadline" and then asked the abstract's question again; the closing
    // paragraph below carries the first half and the abstract keeps the
    // question.
    {
      id: "closing",
      type: "closing",
      services: [
        "Typography Design",
        "Pattern Design",
        "Art Direction",
      ],
      stack: ["Adobe Illustrator", "Adobe Photoshop"],
      links: [],
      content:
        "The patterns are close to childlike. The type goes the other way: Didone serifs, calligraphic swashes, slab capitals with real weight. Setting one against the other is most of what makes the prints work at wall size.\n\nThis one had no client, no brief, and no deadline.",
    },
  ],
};
