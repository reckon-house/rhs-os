import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/black-white-type";

export const blackWhiteTypeCaseStudy: CaseStudy = {
  slug: "black-white-type",
  title: "Typography & Patterns",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Six patterns, three art prints, zero color. Type as art form, pattern as texture.",
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
        { label: "Built", value: "Three lithographs, a twelve-tile pattern library" },
        { label: "Scope", value: "Typography, pattern design, art direction" },
        { label: "Tools", value: "Black ink and white paper. Adobe Illustrator, Photoshop" },
        { label: "Angle", value: "Six elements simple enough for a child to draw. Without color, density does the tonal work and composition is the only variable." },
      ],
      abstract:
        "Personal work built on a single question: how much visual range can a handful of patterns produce? Strip everything back - no color, no photography, no gradients. Just black ink, white paper, and six repeating elements simple enough for a child to draw.\n\nDots, lines, stripes, diamonds. Arranged in grids, varied in scale, alternated between positive and negative. The patterns fill letterforms, break outside them, stack into backgrounds, build rhythm across compositions. Three lithographs, each pulling from the identical library but arriving somewhere different.\n\nWithout color, density does the tonal work. A tight dot grid reads dark. A sparse one reads light. Scale determines what the eye processes first. Spacing sets the mood. Every decision in the composition carries more weight because there are fewer decisions to make.",
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
      title: "Six Patterns.",
      // The study's one crossing, in the BRIEF form (pin + crossing) rather
      // than standalone: this header carries the method columns, and
      // PRESSING.md §7 reserves the standalone crossing for headers whose
      // copy is short. Headline crosses, then pins while the vocabulary
      // travels past it.
      pressing: {
        mark: { n: "02", name: "Six Patterns" },
        heldLine: "One Restriction.",
        choreo: { pin: true, crossing: true },
      },
      group: { name: "rules", bg: "#141414", radius: 75, padding: "60px" },
    },
    {
      id: "rules-text",
      type: "text",
      size: "subhead",
      content:
        "Dots, lines, stripes, diamonds in three orientations - horizontal, vertical, diagonal. The entire vocabulary fits in a grid smaller than a business card. Varied only in density and scale. Black on white or white on black, nothing else enters the frame.",
      group: { name: "rules" },
    },
    {
      id: "rules-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each pattern swatch is a self-contained tile. Repeatable in any direction, at any scale. It works because the shapes are simple enough to combine without clashing. The complexity comes from layering them, not from the ingredients.",
      group: { name: "rules" },
    },
    {
      id: "rules-columns",
      type: "three-column-text",
      columns: [
        {
          title: "Twelve Tiles",
          content:
            "Dots at two scales: dense halftone and open grid. Lines in three orientations: vertical hairlines, horizontal bands, diagonal stripes. Diamonds in a single repeating grid. Six elements.\n\nEach exists as both positive and negative. Black dots on white, white dots on black. The inversion doubles the library without adding a new shape. Twelve tiles total. That covers every texture in the project.",
        },
        {
          title: "No Color",
          content:
            "Removing color removed the easiest tool in the drawer. Color separates, organizes, creates hierarchy almost automatically. Without it, density does the work. A tight dot grid reads darker than an open one. Thick stripes push forward. Thin hairlines recede.\n\nContrast had to be structural instead. Heavy geometric letterforms against flowing calligraphic strokes. Dense fills against empty white space. Tension built from shape and rhythm alone.",
        },
        {
          title: "Three Words",
          content:
            "\"the Fancy.\" \"stepper.\" \"white.\" Each word rendered in a different typographic style. Script, geometric, mixed.\n\nOne layers flowing cursive across the full frame. Another stacks bold capitals into a tight vertical. The third mixes calligraphic flourishes with architectural serifs. The pattern library stays constant. The compositions diverge. Different results because the type carries the personality. The patterns carry the texture.",
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
      title: "Script Meets",
      pressing: {
        mark: { n: "03", name: "Script Meets" },
        heldLine: "Geometric Fill",
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
        "Flowing calligraphic letterforms anchored in the lower-left corner. The script runs loose, swashes extending past the composition edge. Pattern fills give each stroke a different weight and texture. The dot grid background provides spatial depth against the density of the type.",
    },
    {
      id: "fancy-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The print reads \"the Fancy\" in a Didone-influenced script. Every letterform gets a different pattern fill: polka dots in the bowl of the 'a,' diagonal stripes in the crossbar of the 'F,' vertical hairlines in the descender of the 'y.' Six elements, rearranged. The word comes alive.",
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
          "A tight grid reads dark",
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
      text: "Dots, lines, stripes, diamonds.\nThe whole vocabulary.",
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
      title: "Vertical Stack.",
      pressing: {
        mark: { n: "04", name: "Vertical Stack" },
        heldLine: "Bold Geometry.",
        choreo: { pin: true },
      },
    },
    {
      id: "stepper-text",
      type: "text",
      size: "subhead",
      content:
        "A tighter composition. The letterforms stack vertically, filling the frame from edge to edge. Geometric serifs and slab capitals mix with script elements that weave between them. The pattern fills shift from the first print: what was background becomes foreground.",
    },
    {
      id: "stepper-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The density increases. Where \"the Fancy\" floated in white space, \"stepper\" packs the frame. Large-scale polka dots fill a capital 'E.' Diagonal stripes cut across a slab-serif 'R.' The same vocabulary at higher visual volume. The patterns that feel delicate in the first print turn bold here because the letterforms demand it.",
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
      text: "Same six elements.\nThree different rooms to stand in.",
    },

    // ── POSTER 3: "white" — brief first, and the photograph climbs it.
    // Print 02 opened on its image; this one opens on the argument, so the
    // two adjacent sections do not stage the same way.
    {
      id: "white-header",
      type: "section-header",
      label: "SECTION 05: ART PRINT 03 / WHITE",
      title: "Calligraphic Sweep.",
      pressing: {
        mark: { n: "05", name: "Calligraphic Sweep" },
        heldLine: "Architectural Anchor.",
        choreo: { pin: true },
      },
    },
    {
      id: "white-text",
      type: "text",
      size: "subhead",
      content:
        "The third composition splits the difference. Sweeping calligraphic strokes fill the upper portion of the frame, thin enough to feel like drawing. A geometric 'A' and a slab 'K' anchor the lower right. The collision between handmade gesture and mechanical precision is the point.",
    },
    {
      id: "white-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The dot grid background is the most open of the three prints. Sparse pinpoints on a wide field. The white space does the most work here, giving the calligraphic strokes room to breathe while the geometric letters sit heavy at the bottom. Pattern fills are selective. Not every stroke gets filled. The restraint makes the filled elements land harder.",
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
          "Pinpoints on a wide field",
          "Dots at the open scale",
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
      title: "Same Ingredients.\nDifferent Meals.",
      // The headline holds while three columns of evidence travel past it.
      // Nothing climbs this one, so no climb room is derived.
      pressing: {
        mark: { n: "06", name: "Same Ingredients" },
        choreo: { pin: true },
      },
      group: { name: "system", bg: "#141414", radius: 75, padding: "60px" },
    },
    {
      id: "system-text",
      type: "text",
      size: "subhead",
      content:
        "The interesting part isn't any single print - it's what happens when the same six elements get rearranged. The vocabulary never changes, the results do.",
      group: { name: "system" },
    },
    {
      id: "system-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each print uses all six patterns. The difference comes from where they land, how large they scale, and how much white space surrounds them. Composition is the only variable. That's enough to make three pieces that don't look like they came from the same library.",
      group: { name: "system" },
    },
    {
      id: "system-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Dot Grid",
          content:
            "Appears in all three prints. In \"the Fancy\" it covers the background at a fine scale. Reads as a light gray texture, almost like paper grain. Recedes behind the script.\n\nIn \"stepper\" the same dots blow up to fill a capital E. At that scale, each dot is an event. The pattern that disappeared into the background of the first print becomes the loudest element in the second.",
        },
        {
          title: "Diagonal Stripes",
          content:
            "Cut across the crossbar of the F in \"the Fancy.\" A small detail, barely noticed in the full composition. In \"stepper\" those stripes fill a slab-serif R from top to bottom. The angle creates visual speed against the vertical stack of letters around it.\n\nThe same stripe at the same 45-degree angle and the same line weight. Two completely different reads based on how much surface it covers.",
        },
        {
          title: "White Space",
          content:
            "\"the Fancy\" is mostly air. The letterforms cluster in the lower left and the rest of the frame is left open. \"stepper\" fills edge to edge. No breathing room. \"white\" splits the difference: open background, dense cluster at the bottom.\n\nThree different ratios of ink to paper. The patterns don't change between them. The ratio of filled to empty is what separates the quiet print from the loud one.",
        },
      ],
      group: { name: "system" },
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 07: CLOSING",
      title: "Three Prints.\nSix Patterns.",
      pressing: { mark: { n: "07", name: "Three Prints" } },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Personal work. No client, no brief, no deadline. Just a question about how far a small set of rules could stretch.",
    },
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
        "The pattern set is almost childlike. Dots, lines, stripes, diamonds. The type is the opposite - Didone serifs, calligraphic flourishes, slab capitals with presence. The tension between the two is what makes the prints hold up at large scale.\n\nBlack and white was the one rule that held every time. No gray, no texture photography, no gradients blending one value into another. Ink or paper. The binary forced every composition to find its tone through spacing alone.",
    },
  ],
};
