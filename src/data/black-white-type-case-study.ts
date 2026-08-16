import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/black-white-type";

export const blackWhiteTypeCaseStudy: CaseStudy = {
  slug: "black-white-type",
  title: "Typography & Patterns",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Six patterns and three lithographs. | Black ink on white paper, letterforms filled with a small library of shapes and repeats.",
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
        "Six patterns and three lithographs. | Black ink on white paper, letterforms filled with a small library of shapes and repeats.",
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
        { label: "Built", value: "Three lithographs, twelve pattern tiles" },
        { label: "Scope", value: "Typography, pattern design, art direction" },
        { label: "Tools", value: "Adobe Illustrator, Photoshop" },
        { label: "Angle", value: "Six shapes, no color, and the only decisions left were placement and scale." },
      ],
      abstract:
        "Personal work. The question was how much range a small set of patterns could produce once color, photography and gradients were off the table. What was left was black ink, white paper, and six repeating shapes simple enough for a child to draw.\n\nDots at two scales, lines in three directions, and a diamond grid, each one drawn as a positive and a negative, twelve tiles in all. They fill the letterforms, spill outside them, and sit behind them as backgrounds. Three lithographs came out of that set, and they land in three different places.\n\nWith no color to lean on, tone comes from spacing. A packed fill reads dark and an open one reads light, and the biggest shape on the sheet is where the eye goes first. The amount of paper left around a letter sets the mood of the whole print.",
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
      // Jeremy, 2026-08-15: "defining the box i was going to work within
      // was the 'work'". His sentence, spelling fixed, nothing else.
      // The count it replaced was already on the cover and on the mark.
      title: "Defining the box",
      // The study's one crossing, in the BRIEF form (pin + crossing) rather
      // than standalone: this header carries the method columns, and
      // PRESSING.md §7 reserves the standalone crossing for headers whose
      // copy is short. Headline crosses, then pins while the vocabulary
      // travels past it.
      pressing: {
        mark: { n: "02", name: "The Box" },
        heldLine: "was the work.",
        choreo: { pin: true, crossing: true },
      },
      group: { name: "rules", bg: "#141414", radius: 75, padding: "60px" },
    },
    {
      id: "rules-text",
      type: "text",
      size: "subhead",
      content:
        "Every pattern is drawn twice, once black on white and once reversed. After that the only things that change are scale and spacing.",
      group: { name: "rules" },
    },
    {
      id: "rules-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each swatch is a tile that repeats in any direction, at any size. Most of the detail in the prints comes from layering them.",
      group: { name: "rules" },
    },
    {
      id: "rules-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Shapes",
          content:
            "Dots at two scales, a dense halftone and an open grid. Lines three ways: vertical hairlines, horizontal bands, diagonal stripes. And one diamond grid.",
        },
        {
          title: "No Color",
          content:
            "I wanted the shapes and the letterforms to be the focus, so color was never in it.\n\nThick stripes come forward and thin hairlines drop back. That is the whole tonal range.",
        },
        {
          title: "The Three Prints",
          content:
            "They read \"the fancy,\" \"highball stepper,\" and \"jack white.\" One is set in script, one in geometric capitals, and one in a mix of the two.",
        },
      ],
      group: { name: "rules" },
    },

    // ── POSTER 1: "the fancy" ──
    {
      id: "fancy-header",
      type: "section-header",
      label: "SECTION 03: LITHOGRAPH 01 / THE FANCY",
      title: "Every stroke gets\na different fill.",
      pressing: {
        mark: { n: "03", name: "The Fancy" },
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
        "It sits low in the left corner, with swashes running off the edge of the sheet, over a fine dot grid.",
    },
    {
      id: "fancy-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "It reads \"the fancy.\" Polka dots fill the bowl of the 'a,' diagonal stripes the crossbar of the 'F.' The descender of the 'y' gets vertical hairlines.",
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
      /* 1860px native, so 930 is the honest ceiling and the column was
         drawing it at 1440 — a 1.29x magnification on the one asset in
         the study made entirely of hairlines, which is where aliasing
         shows first. No larger export exists. All three flat prints
         take the same number so they sit at one size. */
      pressing: { plateWidth: 930, choreo: { rise: true } },
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
      /* THE MATERIAL DIFFERENCE, and it applies to every swatch in this
         study. A climb sells depth by carrying one plane over another,
         and Robert's climbs work because the thing underneath is a
         photograph: a room, a model, something with its own space. Every
         image here is a flat repeating texture running the full width,
         so two of them on screen at once sit on the same plane at the
         same scale and read as a collision, not a climb. The audit
         passes these (a rise may legally cross a zoom or a pinned pair),
         which is exactly why the rule has to be written down here. The
         swatches sit. Only the plates that climb COPY keep their rise. */
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
      text: "The whole library\nis six shapes.",
    },

    // ── POSTER 2: "highball stepper" — the zoom. A print photographed in a room is
    // the one frame where filling the mat changes what you can read: the
    // object in its setting, then the letterforms at print scale. No
    // zoomFit — the frame is near-square, so filling the width leaves a
    // modest spill to pan rather than a landscape's worth.
    {
      id: "stepper-lifestyle",
      type: "hero",
      image: `${IMG}/typography-patterns-stepper-poster-bench-lifestyle.jpg`,
      alt: "Typography & Patterns, highball stepper art print displayed on wooden bench",
      inline: true,
      pressing: {
        plate: "04",
        captions: [
          "Highball stepper, lithograph 02",
          "Slab capitals and script",
          "Photographed on the bench",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },
    // The stripes follow the print they fill, at rest. They used to climb
    // the zoom above; texture over texture, see fancy-swatch-4.
    {
      id: "stepper-swatch-3",
      type: "image",
      src: `${IMG}/pattern-swatch-diagonal-stripes-white-on-black.jpg`,
      alt: "Pattern swatch, diagonal stripes, white on black",
      aspect: "native",
      padded: true,
    },
    {
      id: "stepper-header",
      type: "section-header",
      label: "SECTION 04: LITHOGRAPH 02 / HIGHBALL STEPPER",
      title: "The second print blows\nthe same tiles up.",
      pressing: {
        mark: { n: "04", name: "Highball Stepper" },
        choreo: { pin: true },
      },
    },
    {
      id: "stepper-text",
      type: "text",
      size: "subhead",
      content:
        "Slab capitals stack edge to edge with script threaded between them, and at that size the tiles read a lot bolder.",
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
    // Two tiles at rest. The pin came off with the climb above it: a pin
    // that nothing crosses is a hold on nothing.
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
    },

    // ── FLAT ART ──
    {
      id: "stepper-flat",
      type: "image",
      src: `${IMG}/typography-patterns-stepper-poster-flat.png`,
      alt: "Typography & Patterns, highball stepper poster, flat artwork with bold geometric letterforms",
      aspect: "native",
      padded: true,
      pressing: { plateWidth: 930 },
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-density",
      type: "editorial-headline",
      text: "With no color, spacing\nis the only tone control.",
    },

    // ── POSTER 3: "jack white" — brief first, and the photograph climbs it.
    // Print 02 opened on its image; this one opens on the argument, so the
    // two adjacent sections do not stage the same way.
    {
      id: "white-header",
      type: "section-header",
      label: "SECTION 05: LITHOGRAPH 03 / JACK WHITE",
      title: "This one puts handmade strokes\nnext to machine-drawn ones.",
      pressing: {
        mark: { n: "05", name: "Jack White" },
        choreo: { pin: true },
      },
    },
    {
      id: "white-text",
      type: "text",
      size: "subhead",
      content:
        "The calligraphy across the top is thin enough to read as drawing. The geometric 'A' and the slab 'K' in the lower right are the heaviest shapes on the sheet.",
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
      alt: "Typography & Patterns, jack white art print leaning against metal gate outdoors",
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
      },
    },
    {
      id: "white-swatch-3",
      type: "image",
      src: `${IMG}/pattern-swatch-thick-horizontal-stripes.jpg`,
      alt: "Pattern swatch, thick horizontal stripes",
      aspect: "native",
      padded: true,
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
      alt: "Typography & Patterns, jack white poster, flat artwork with calligraphic and geometric letterforms",
      aspect: "native",
      padded: true,
      pressing: { plateWidth: 930 },
    },

    // ── HOW THE SYSTEM WORKS — grouped in black container ──
    {
      id: "system-header",
      type: "section-header",
      label: "SECTION 06: HOW THE SYSTEM WORKS",
      title: "All three prints use\nevery one of the six patterns.",
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
        "What changes between them is how big each one runs, and how much of the sheet it covers.",
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
            "Background in \"the fancy,\" at a scale fine enough to read as light gray, close to paper grain. In \"highball stepper\" the same tile is blown up to fill a whole capital, and at that size each dot is a shape in its own right. In \"jack white\" it drops to sparse pinpoints.",
        },
        {
          title: "Diagonal Stripes",
          content:
            "The same 45-degree stripe at the same line weight in both prints. In \"the fancy\" it is one crossbar wide and easy to miss. In \"highball stepper\" it fills a slab letter top to bottom, and blown up like that the angle gives the whole stack some speed.\n\nThe only difference is how much of the letter it covers.",
        },
        {
          title: "White Space",
          content:
            "Three ratios of ink to paper. \"the fancy\" is mostly paper, with the letters clustered in the lower left. \"highball stepper\" runs edge to edge. \"jack white\" sits between them, open background, dense cluster at the bottom.\n\nThat ratio is most of what separates the sparse print from the packed one.",
        },
      ],
      group: { name: "system" },
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 07: CLOSING",
      title: "The patterns stayed simple\nso the type could get complicated.",
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
        "The patterns are close to childlike. The type goes the other way: Didone serifs, calligraphic swashes, slab capitals with real weight. Setting one against the other is most of what makes the prints work at wall size.\n\nThere was no client and no deadline on this one. Once the rules were set, the rest of it was a lot of fun to make.",
    },
  ],
};
