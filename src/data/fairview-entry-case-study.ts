import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/fairview-entry";

export const fairviewEntryCaseStudy: CaseStudy = {
  slug: "fairview-entry",
  title: "The Fairview: Entry.",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "Floor-to-ceiling French doors, a brass disc chandelier, a vintage rug on white oak. The first room of the house, sized for light, dressed to set the tone.",
  field: "Interior Design\nFurniture Curation\nFinish Selection",
  author: "Jeremy Prasatik",
  published: "2023",
  status: "Built",
  classification: ["Interior Design", "Furniture Curation", "Finish Selection"],
  services: ["Interior Design", "Furniture Curation", "Finish Selection"],
  stack: ["AutoCAD", "SketchUp", "Material specification"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hero1.avif`,
      alt: "The Fairview entry: two-story foyer with brass disc chandelier, French ironwork doors, vintage gray rug on white oak floors, potted palm and slatted wood console at left, geometric wood wall art at right",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "The Fairview\nEntry.",
      subtitle:
        "Floor-to-ceiling French doors, a brass disc chandelier, a vintage rug on white oak. The first room of the house, sized for light, dressed to set the tone.",
      field: "Interior Design  Furniture Curation  Finish Selection",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Built",
      classification: ["Interior Design", "Furniture Curation", "Finish Selection"],
      abstract:
        "The entry sits two stories tall, French ironwork glass running floor to ceiling at the center. Light is the design move first. Everything else is sized and placed to let it through.\n\nA vintage rug runner anchors the floor without crowding it. A brass disc chandelier hangs alone overhead. White oak boards run unbroken to the doorway. A potted palm adds living texture against limestone-cream walls.\n\nTwo pieces of art on the side wall tell stories without explaining themselves: a slatted wood geometric piece, a dark abstract in a thick frame. The leather bench between them is for the boots that come off, the bag set down, the moment between the car and the rest of the house.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — LIGHT
    // ════════════════════════════════════════
    {
      id: "light-header",
      type: "section-header",
      label: "SECTION 02: LIGHT",
      title: "The Whole Room\nServes the Light.",
    },
    {
      id: "light-subhead",
      type: "text",
      size: "subhead",
      content:
        "Doors run floor to ceiling. Walls stay quiet. Nothing on the floor competes for the morning sun.",
    },
    {
      id: "light-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Most foyers fight their own architecture. This one was sized around the front doors. The room is tall because the doors are tall. The walls are limestone-cream because limestone takes light without bouncing it back. The rug is dark enough to ground the floor, woven loose enough to read on a cloudy afternoon.",
    },

    // Vertical hero composition — the chandelier + full-height doors
    {
      id: "light-chandelier",
      type: "image",
      src: `${IMG}/4.avif`,
      alt: "Vertical composition looking up at the brass disc chandelier with French double doors and transom windows running the full two-story height",
      aspect: "native",
      padded: true,
    },

    // 2-up: light streaming in detail + vertical rug+doors view
    {
      id: "light-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/7.webp`,
        alt: "Tight detail of the potted palm, wood coat tree, and the corner of the vintage rug catching morning sunlight on white oak floors",
      },
      right: {
        src: `${IMG}/2.avif`,
        alt: "Vertical view straight through the foyer to the French doors with the brass chandelier overhead and the full vintage rug runner anchoring the floor",
      },
    },

    // ── Inline hero: architectural pulled-back view
    {
      id: "architectural-hero",
      type: "hero",
      image: `${IMG}/3.webp`,
      alt: "Horizontal architectural view of the entry showing the French doors at center, vintage rug, palm on the left, coat tree against the side wall",
      inline: true,
    },

    // ════════════════════════════════════════
    // SECTION 03 — PIECES
    // ════════════════════════════════════════
    {
      id: "pieces-header",
      type: "section-header",
      label: "SECTION 03: PIECES",
      title: "Found Pieces\nThat Tell Stories.",
    },
    {
      id: "pieces-subhead",
      type: "text",
      size: "subhead",
      content:
        "A vintage rug, a brass disc light, two pieces of art that don't quite explain themselves. The kind of pieces you arrive at over time.",
    },
    {
      id: "pieces-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The chandelier is a single brass disc, oversized for the space, hung alone. The leather bench under the slatted wood art is for the bag set down on the way in. The palm is the only thing in the room that's alive. Everything else has been somewhere first.",
    },

    // 2-up: bench detail + art wall context
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
        src: `${IMG}/hero5.webp`,
        alt: "Side angle showing the full art wall: slatted wood geometric piece and dark abstract in a thick wood frame, leather bench beneath, coat tree and palm in the foreground",
      },
    },

    // ── Editorial palate cleanser
    {
      id: "headline-threshold",
      type: "editorial-headline",
      text: "The first room of the house\ndoesn't get a second chance",
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
      title: "Five Materials\nCarrying One Room.",
      introText:
        "The entry runs on five materials, no more. Each one earns its place by doing one job and staying out of the others' way.",
      philosophyTitle: "Material philosophy",
      philosophyText:
        "The oak is the floor. The iron is the frame. The brass is the light. The wool is the path. The limestone is the room.\n\nNothing decorative on top. The texture is the design. Color goes in through the materials themselves, not through accents. A foyer this size only gets one chance to introduce the house; spending it on noise would be a waste.",
      colors: [
        { name: "Limestone Cream", hex: "#E7DFD2", description: "Walls, ceiling" },
        { name: "Black Iron", hex: "#1F1E1B", description: "Doors, frames, bench" },
        { name: "Antiqued Brass", hex: "#A87A45", description: "Disc chandelier" },
        { name: "White Oak", hex: "#C0A47C", description: "Floors" },
        { name: "Vintage Indigo", hex: "#4B4A52", description: "Rug runner" },
      ],
      fonts: [
        {
          name: "White Oak",
          role: "Floors",
          description:
            "Wide-plank white oak running unbroken from the doorway to the rest of the house. The grain is the only horizontal pattern in the room and the warmest material in the palette.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 400,
        },
        {
          name: "Black Iron",
          role: "Doors, frames, bench",
          description:
            "Steel French doors and matching transom windows define the front of the room. The leather bench frame and coat tree picks up the same line so the metalwork reads as one system, not three separate objects.",
          family: "'Caslon', 'Adobe Caslon Pro', 'Garamond', serif",
          weight: 600,
        },
        {
          name: "Antiqued Brass",
          role: "Disc chandelier",
          description:
            "A single hand-rubbed brass disc hung dead-center. Oversized on purpose so the room reads vertical from the doorway. The closest thing to jewelry the entry gets.",
          family: "'Didot', 'Bodoni 72', 'Caslon', serif",
          weight: 400,
        },
        {
          name: "Vintage Wool",
          role: "Rug runner",
          description:
            "A found indigo-gray runner with the kind of soft pattern that only comes from age. Anchors the floor without crowding the oak under it.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 400,
        },
        {
          name: "Limestone",
          role: "Walls",
          description:
            "Limestone-cream walls and trim. The color takes light without bouncing it back, which is the whole job of a room sized around its windows.",
          family: "'Caslon', 'Adobe Caslon Pro', 'Garamond', serif",
          weight: 400,
        },
      ],
      markImage: `${IMG}/hero1.avif`,
      markAlt: "Wide pulled-back view of the entry: brass disc chandelier overhead, vintage rug on white oak, French doors at center, geometric wood wall art at right",
      markFullBleed: true,
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "A Threshold\nThat Does the Work.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "The brass disc, the vintage rug, the morning light. Found pieces and natural architecture, working together before anyone says hello.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Interior Design", "Furniture Curation", "Finish Selection"],
      stack: ["AutoCAD", "SketchUp", "Material specification"],
      links: [],
      content:
        "A foyer two stories tall, sized for light, dressed in five materials. The kind of room that quietly does the work of introducing the house before anyone gets past the rug.",
    },
  ],
};
