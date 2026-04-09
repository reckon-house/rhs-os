import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/black-white-type";

export const blackWhiteTypeCaseStudy: CaseStudy = {
  slug: "black-white-type",
  title: "Typography & Patterns",
  category: { label: "Branding", href: "/category/branding" },
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
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/typography-patterns-the-fancy-poster-wood-surface-lifestyle.jpg`,
      alt: "Typography & Patterns poster on wood surface, expressive letterforms filled with black and white patterns",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Typography\n& Patterns",
      subtitle:
        "Six patterns. Three art prints. Black and white only. A vocabulary small enough to fit on a napkin, applied to letterforms large enough to fill a wall.",
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
      abstract:
        "Personal work built on a single question: how much visual range can a handful of patterns produce? Strip everything back. No color. No photography. No gradients. Black ink, white paper, six repeating elements simple enough for a child to draw.\n\nDots, lines, stripes, diamonds. Arranged in grids, varied in scale, alternated between positive and negative. The patterns fill letterforms, break outside them, stack into backgrounds, build rhythm across compositions. Three lithographs, each pulling from the identical library but arriving somewhere different.\n\nWithout color, density does the tonal work. A tight dot grid reads dark. A sparse one reads light. Scale determines what the eye processes first. Spacing sets the mood. Every decision in the composition carries more weight because there are fewer decisions to make.",
    },

    // ── THE RULES — grouped in black container ──
    {
      id: "rules-header",
      type: "section-header",
      label: "SECTION 02: THE RULES",
      title: "Six Patterns.\nOne Restriction.",
      group: { name: "rules", bg: "#141414", radius: 75, padding: "60px" },
    },
    {
      id: "rules-text",
      type: "text",
      size: "subhead",
      content:
        "Dots. Lines. Stripes. Diamonds. Horizontal, vertical, diagonal. The entire vocabulary fits in a grid smaller than a business card. Varied only in density and scale. Black on white or white on black. Nothing else enters the frame.",
      group: { name: "rules" },
    },
    {
      id: "rules-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each pattern swatch is a self-contained tile. Repeatable in any direction, at any scale. The system works because the elements are primitive enough to combine without clashing. Complexity comes from layering, not from the ingredients.",
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
      title: "Script Meets\nGeometric Fill",
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

    // ── PATTERN SWATCHES ──
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
    },
    {
      id: "fancy-swatch-3",
      type: "image",
      src: `${IMG}/pattern-swatch-dense-dots-white-on-black.jpg`,
      alt: "Pattern swatch, dense dots, white on black",
      aspect: "native",
      padded: true,
    },
    {
      id: "fancy-swatch-4",
      type: "image",
      src: `${IMG}/pattern-swatch-horizontal-grouped-lines.jpg`,
      alt: "Pattern swatch, horizontal grouped lines",
      aspect: "native",
      padded: true,
    },

    // ── FLAT ART ──
    {
      id: "fancy-flat",
      type: "image",
      src: `${IMG}/typography-patterns-the-fancy-poster-flat.png`,
      alt: "Typography & Patterns, the Fancy poster, flat artwork with pattern-filled script letterforms",
      aspect: "native",
      padded: true,
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-constraint",
      type: "editorial-headline",
      text: "Dots, lines, stripes, diamonds.\nThe whole vocabulary.",
    },

    // ── POSTER 2: "stepper" — hero first ──
    {
      id: "stepper-lifestyle",
      type: "hero",
      image: `${IMG}/typography-patterns-stepper-poster-bench-lifestyle.jpg`,
      alt: "Typography & Patterns, stepper art print displayed on wooden bench",
      inline: true,
    },
    {
      id: "stepper-header",
      type: "section-header",
      label: "SECTION 04: ART PRINT 02 / STEPPER",
      title: "Vertical Stack.\nBold Geometry.",
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
        "The density increases. Where \"the Fancy\" floated in white space, \"stepper\" packs the frame. Large-scale polka dots fill a capital 'E.' Diagonal stripes cut across a slab-serif 'R.' The same vocabulary at higher visual volume. The patterns that read as delicate in the first print read as bold here because the letterforms demand it.",
    },

    // ── PATTERN SWATCHES ──
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
    {
      id: "stepper-swatch-3",
      type: "image",
      src: `${IMG}/pattern-swatch-diagonal-stripes-white-on-black.jpg`,
      alt: "Pattern swatch, diagonal stripes, white on black",
      aspect: "native",
      padded: true,
    },
    {
      id: "stepper-swatch-4",
      type: "image",
      src: `${IMG}/pattern-swatch-halftone-dots-black-on-white.jpg`,
      alt: "Pattern swatch, halftone dots, black on white",
      aspect: "native",
      padded: true,
    },

    // ── FLAT ART ──
    {
      id: "stepper-flat",
      type: "image",
      src: `${IMG}/typography-patterns-stepper-poster-flat.png`,
      alt: "Typography & Patterns, stepper poster, flat artwork with bold geometric letterforms",
      aspect: "native",
      padded: true,
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-density",
      type: "editorial-headline",
      text: "Same six elements.\nThree different rooms to stand in.",
    },

    // ── POSTER 3: "white" — hero first ──
    {
      id: "white-lifestyle",
      type: "hero",
      image: `${IMG}/typography-patterns-white-poster-gate-lifestyle.jpg`,
      alt: "Typography & Patterns, white art print leaning against metal gate outdoors",
      inline: true,
    },
    {
      id: "white-header",
      type: "section-header",
      label: "SECTION 05: ART PRINT 03 / WHITE",
      title: "Calligraphic Sweep.\nArchitectural Anchor.",
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
    },
    {
      id: "white-swatch-3",
      type: "image",
      src: `${IMG}/pattern-swatch-thick-horizontal-stripes.jpg`,
      alt: "Pattern swatch, thick horizontal stripes",
      aspect: "native",
      padded: true,
    },
    {
      id: "white-swatch-4",
      type: "image",
      src: `${IMG}/pattern-swatch-sparse-dots-white-on-black.jpg`,
      alt: "Pattern swatch, sparse dots, white on black",
      aspect: "native",
      padded: true,
    },

    // ── FLAT ART ──
    {
      id: "white-flat",
      type: "image",
      src: `${IMG}/typography-patterns-white-poster-flat.png`,
      alt: "Typography & Patterns, white poster, flat artwork with calligraphic and geometric letterforms",
      aspect: "native",
      padded: true,
    },

    // ── HOW THE SYSTEM WORKS — grouped in black container ──
    {
      id: "system-header",
      type: "section-header",
      label: "SECTION 06: HOW THE SYSTEM WORKS",
      title: "Same Ingredients.\nDifferent Meals.",
      group: { name: "system", bg: "#141414", radius: 75, padding: "60px" },
    },
    {
      id: "system-text",
      type: "text",
      size: "subhead",
      content:
        "The interesting part isn't any single print. It's what happens when the same six elements get rearranged. The vocabulary never changes. The results do.",
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
            "Cut across the crossbar of the F in \"the Fancy.\" A small detail, barely noticed in the full composition. In \"stepper\" those stripes fill a slab-serif R from top to bottom. The angle creates visual speed against the vertical stack of letters around it.\n\nSame stripe. Same 45-degree angle. Same line weight. Two completely different reads based on how much surface it covers.",
        },
        {
          title: "White Space",
          content:
            "\"the Fancy\" is mostly air. The letterforms cluster in the lower left and the rest of the frame breathes. \"stepper\" fills edge to edge. No breathing room. \"white\" splits the difference: open background, dense cluster at the bottom.\n\nThree different ratios of ink to paper. The patterns don't change between them. The ratio of filled to empty is what separates the quiet print from the loud one.",
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
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Personal work. No client. No brief. No deadline. Just a question about how far a small set of rules could stretch.",
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
        "The pattern set is almost childlike. Dots, lines, stripes, diamonds. The type is the opposite. Didone serifs, calligraphic flourishes, slab capitals with presence. The tension between the two is what makes the prints hold up at large scale.\n\nBlack and white was the only rule that never bent. No gray. No texture photography. No gradients blending one value into another. Ink or paper. On or off. The binary forced every composition to find its tone through spacing alone.",
    },
  ],
};
