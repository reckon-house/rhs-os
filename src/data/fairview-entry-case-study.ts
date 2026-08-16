import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/fairview-entry";

export const fairviewEntryCaseStudy: CaseStudy = {
  slug: "fairview-entry",
  title: "The Fairview: Entry.",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "The Fairview entry, two stories tall. | Floor-to-ceiling French doors, a brass and alabaster chandelier, a vintage rug on white oak, all of it sized for the light.",
  field: "Interior Design\nFurniture Curation\nFinish Selection",
  author: "Jeremy Prasatik",
  published: "2023",
  status: "Built",
  classification: ["Interior Design", "Furniture Curation", "Finish Selection"],
  services: ["Interior Design", "Furniture Curation", "Finish Selection"],
  stack: ["AutoCAD", "SketchUp", "Material specification"],
  links: [],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 4 frames",
        colors: ["#E7DFD2", "#1F1E1B", "#A87A45", "#C0A47C", "#4B4A52"],
        images: [
          "/case-studies/fairview-entry/3.webp",
          "/case-studies/fairview-entry/6.webp",
          "/case-studies/fairview-entry/7.webp",
          "/case-studies/fairview-entry/hero5.webp",
        ],
      },
      title: "The Fairview\nEntry.",
      subtitle:
        "The Fairview entry, two stories tall. | Floor-to-ceiling French doors, a brass and alabaster chandelier, a vintage rug on white oak, all of it sized for the light.",
      field: "Interior Design  Furniture Curation  Finish Selection",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Built",
      classification: ["Interior Design", "Furniture Curation", "Finish Selection"],
      summary: [
        { label: "Built", value: "Two-story entry foyer, sized around floor-to-ceiling French ironwork doors" },
        { label: "Scope", value: "Interior design, furniture curation, finish selection" },
        { label: "Materials", value: "Limestone-cream walls, black iron, antiqued brass, white oak, vintage indigo wool" },
        { label: "Angle", value: "The light through the front doors comes first, and every piece was picked to leave it alone." },
      ],
      abstract:
        "The entry is two stories tall, with French ironwork doors running floor to ceiling at the center. The light through those doors comes first. Everything else in the room is sized and placed to let it through.\n\nA vintage rug runner on white oak boards that run unbroken to the doorway. A brass and alabaster chandelier hung by itself overhead. A potted palm against limestone-cream walls.\n\nTwo pieces of art on the side wall, a slatted wood geometric and a dark abstract in a thick frame, with a leather bench between them for the boots that come off and the bag set down on the way in.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hero1.avif`,
      alt: "The Fairview entry: two-story foyer with brass and alabaster chandelier, French ironwork doors, vintage gray rug on white oak floors, potted palm and slatted wood console at left, geometric wood wall art at right",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — LIGHT
    // ════════════════════════════════════════
    {
      id: "light-header",
      type: "section-header",
      label: "SECTION 02: LIGHT",
      title: "The room is tall",
      // This study's one crossing, on its opening argument. Its sibling
      // (fairview-sitting) crosses its SECOND header instead — two rooms
      // in one house should not choreograph identically.
      // `pin` alongside `crossing`: the crossing already holds its headline
      // for 220dvh, so the flag changes nothing on the page. Saying it out
      // loud in the data names the holder the rug plate below climbs.
      pressing: {
        mark: { n: "02", name: "Morning Sun" },
        heldLine: "because the doors are tall.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "light-subhead",
      type: "text",
      size: "subhead",
      content:
        "Nothing on the floor gets between them and the sun.",
    },
    {
      id: "light-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The walls are limestone-cream. That color takes the light and doesn't throw it back. The rug is dark enough to ground the floor and woven loose enough to still read on a cloudy afternoon.",
    },

    // Two vertical light compositions, one either side of the zoom below.
    // They used to sit stacked, which left the second one with a moving
    // plate above it and nothing to climb.
    // First pulls back to show the rug anchoring the floor. It climbs the
    // crossing headline, so the runner arrives over the sentence about
    // nothing on the floor competing for the sun.
    // Rise, not zoom: the export is 2220px wide, short of the 3000px bar,
    // and pinning it at full mat would magnify a bitmap.
    {
      id: "light-rug",
      type: "image",
      src: `${IMG}/2.avif`,
      alt: "Vertical view straight through the foyer to the French doors with the brass chandelier overhead and the full vintage rug runner anchoring the floor",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── Inline hero: side angle showing the art wall + bench composition
    {
      id: "architectural-hero",
      type: "hero",
      image: `${IMG}/hero5.webp`,
      alt: "Side angle of the entry showing the full art wall: slatted wood geometric piece and dark abstract in a thick wood frame, leather bench beneath, coat tree and palm in the foreground",
      inline: true,
      // The zoom. The section argues the whole room serves the light, and
      // this is the frame that carries the art wall end to end — filling
      // the mat is what makes that legible. 3082px native, the only file
      // in the room with the pixels for it.
      pressing: {
        plate: "02",
        captions: [
          "The art wall, full width",
          "Slatted wood and dark abstract",
          "Leather bench beneath",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // The tighter vertical, framing the chandelier and the doors at full
    // two-story height. Climbs the zoom's held screen, so a section arguing
    // the room is sized around its light closes looking up at the source.
    // Rise for the rug plate's reason: 2220px native.
    {
      id: "light-chandelier",
      type: "image",
      src: `${IMG}/4.avif`,
      alt: "Vertical composition looking up at the brass and alabaster chandelier with French double doors and transom windows running the full two-story height",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 03 — PIECES
    // ════════════════════════════════════════
    {
      id: "pieces-header",
      type: "section-header",
      label: "SECTION 03: PIECES",
      title: "All of it had been",
      // Pinned: the headline holds while the copy about the rug, the light
      // and the two pieces of art travels up beside it. The section is a
      // list of objects, so the name of the list should stay on screen for
      // the whole of it.
      pressing: {
        mark: { n: "03", name: "The Pieces" },
        heldLine: "somewhere else first.",
        choreo: { pin: true },
      },
    },
    {
      id: "pieces-subhead",
      type: "text",
      size: "subhead",
      content:
        "The rug, the bench, the two pieces of art. The palm is the one thing in the room that's alive.",
    },
    {
      id: "pieces-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The chandelier is one alabaster pendant set in brass, oversized on purpose. The bench sits under the slatted wood piece with a sheepskin throw over it and a basket underneath. The palm and the coat tree share the corner that gets the morning sun.",
    },

    // 2-up: two tight detail shots of the found objects side by side. Left
    // is the bench + slatted wood art; right is the palm + coat tree corner
    // catching morning light.
    {
      id: "pieces-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/6.webp`,
        alt: "Tight detail of the black leather bench with a sheepskin throw, woven basket below, under the slatted wood geometric wall art",
      },
      right: {
        src: `${IMG}/7.webp`,
        alt: "Tight detail of the potted palm, wood coat tree, and the corner of the vintage rug catching morning sunlight on white oak floors",
      },
      // Held so the wide view climbs across the two details it contains.
      pressing: {
        captions: ["Leather bench\nSheepskin throw", "Palm and coat tree"],
        choreo: { pin: true },
      },
    },

    // Wide architectural context shot — climbs across the held details,
    // pulling the viewer back to see how the pieces sit in the full foyer.
    {
      id: "pieces-context",
      type: "image",
      src: `${IMG}/3.webp`,
      alt: "Horizontal architectural view of the entry: French doors at center, vintage rug runner, palm on the left, coat tree against the side wall",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── Editorial palate cleanser
    {
      id: "headline-threshold",
      type: "editorial-headline",
      text: "This is the first room\nanyone walks into",
    },

    // ════════════════════════════════════════
    // SECTION 04 — MARKS & MATERIALS
    // (Interior take on the standard pattern: shapes-as-fonts becomes
    // materials-as-fonts. Each band shows one of the five key materials.)
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 04: MARKS & MATERIALS",
      title: "The whole foyer\nin five materials.",
      introText:
        "Oak, iron, brass, wool, and limestone. Each one has one job in the room.",
      philosophyTitle: "Material philosophy",
      philosophyText:
        "Oak on the floor, iron at the doors and transom, brass overhead, wool down the middle, limestone on the walls. Nothing sits on top of them. The color in the room is whatever those five already are.\n\nThe bench frame and the coat tree are black iron too, so the metalwork reads as one set.",
      colors: [
        { name: "Limestone Cream", hex: "#E7DFD2", description: "Walls, ceiling" },
        { name: "Black Iron", hex: "#1F1E1B", description: "Doors, frames, bench" },
        { name: "Antiqued Brass", hex: "#A87A45", description: "Chandelier" },
        { name: "White Oak", hex: "#C0A47C", description: "Floors" },
        { name: "Vintage Indigo", hex: "#4B4A52", description: "Rug runner" },
      ],
      fonts: [
        {
          name: "White Oak",
          role: "Floors",
          description:
            "Wide-plank white oak, running from the front door on into the rest of the house. The grain is the only horizontal pattern in the room.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 400,
        },
        {
          name: "Black Iron",
          role: "Doors, frames, bench",
          description:
            "Steel French doors with matching transom windows across the front of the room. The bench frame and the coat tree are the same black.",
          family: "'Caslon', 'Adobe Caslon Pro', 'Garamond', serif",
          weight: 600,
        },
        {
          name: "Antiqued Brass",
          role: "Chandelier",
          description:
            "One alabaster pendant set in hand-rubbed brass, hung dead center. It is the only brass in the room.",
          family: "'Didot', 'Bodoni 72', 'Caslon', serif",
          weight: 400,
        },
        {
          name: "Vintage Wool",
          role: "Rug runner",
          description:
            "An indigo-gray runner, found vintage, with the kind of soft pattern that only comes from age. It leaves most of the oak showing.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 400,
        },
        {
          name: "Limestone",
          role: "Walls",
          description:
            "Limestone-cream on the walls, trim, and ceiling, so the whole shell of the room is a single soft color.",
          family: "'Caslon', 'Adobe Caslon Pro', 'Garamond', serif",
          weight: 400,
        },
      ],
      markImage: `${IMG}/hero1.avif`,
      markAlt: "Wide pulled-back view of the entry: brass and alabaster chandelier overhead, vintage rug on white oak, French doors at center, geometric wood wall art at right",
      markFullBleed: true,
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "The leather bench is where",
      pressing: {
        mark: { n: "04", name: "Boots Off" },
        heldLine: "boots come off and bags go down.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "After that it's the rug, the chandelier, and whatever the light is doing.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Interior Design", "Furniture Curation", "Finish Selection"],
      stack: ["AutoCAD", "SketchUp", "Material specification"],
      links: [],
      content:
        "A two-story foyer sized around the light through its front doors and furnished with found pieces. It introduces the house before anyone says hello.",
    },
  ],
};
