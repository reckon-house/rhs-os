import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/fairview-entry";

export const fairviewEntryCaseStudy: CaseStudy = {
  slug: "fairview-entry",
  title: "The Fairview: Entry.",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "Floor-to-ceiling French doors, a brass and alabaster chandelier, a vintage rug on white oak. The first room of the house, sized for light, dressed to set the tone.",
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
        "Floor-to-ceiling French doors, a brass and alabaster chandelier, a vintage rug on white oak. The first room of the house, sized for light, dressed to set the tone.",
      field: "Interior Design  Furniture Curation  Finish Selection",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Built",
      classification: ["Interior Design", "Furniture Curation", "Finish Selection"],
      summary: [
        { label: "Built", value: "Two-story entry foyer, sized around floor-to-ceiling French ironwork doors" },
        { label: "Scope", value: "Interior design, furniture curation, finish selection" },
        { label: "Materials", value: "Limestone-cream walls, black iron, antiqued brass, white oak, vintage indigo wool" },
        { label: "Angle", value: "Light is the design move first. The first room of the house doesn't get a second chance." },
      ],
      abstract:
        "The entry sits two stories tall, French ironwork glass running floor to ceiling at the center. Light is the design move first. Everything else is sized and placed to let it through.\n\nA vintage rug runner anchors the floor without crowding it. A brass and alabaster chandelier hangs alone overhead. White oak boards run unbroken to the doorway. A potted palm adds living texture against limestone-cream walls.\n\nTwo pieces of art on the side wall tell stories without explaining themselves: a slatted wood geometric piece, a dark abstract in a thick frame. The leather bench between them is for the boots that come off, the bag set down, the moment between the car and the rest of the house.",
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
      title: "The Whole Room",
      // This study's one crossing, on its opening argument. Its sibling
      // (fairview-sitting) crosses its SECOND header instead — two rooms
      // in one house should not choreograph identically.
      // `pin` alongside `crossing`: the crossing already holds its headline
      // for 220dvh, so the flag changes nothing on the page. Saying it out
      // loud in the data names the holder the rug plate below climbs.
      pressing: {
        mark: { n: "02", name: "The Whole Room" },
        heldLine: "Serves the Light.",
        choreo: { pin: true, crossing: true },
      },
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
      title: "Found Pieces",
      // Pinned: the headline holds while the copy about the rug, the light
      // and the two pieces of art travels up beside it. The section is a
      // list of objects, so the name of the list should stay on screen for
      // the whole of it.
      pressing: {
        mark: { n: "03", name: "Found Pieces" },
        heldLine: "That Tell Stories.",
        choreo: { pin: true },
      },
    },
    {
      id: "pieces-subhead",
      type: "text",
      size: "subhead",
      content:
        "A vintage rug, a brass-and-alabaster light hung alone, two pieces of art that don't quite explain themselves. The kind of pieces you arrive at over time.",
    },
    {
      id: "pieces-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The chandelier is a single alabaster pendant set in brass, oversized for the space, hung alone. The leather bench under the slatted wood art is for the bag set down on the way in. The palm is the only thing in the room that's alive. Everything else has been somewhere first.",
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
        "Oak runs unbroken to the doorway. Iron frames the doors and transom. Brass hangs alone overhead. Vintage wool anchors the path. Limestone holds the walls quiet.\n\nFive materials, nothing on top. Color comes from what the materials already are. A foyer this size gets one chance to introduce the house, and spending it on noise would be a waste.",
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
            "Wide-plank white oak running unbroken from the doorway to the rest of the house. The grain is the only horizontal pattern in the room and the warmest material in the palette.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 400,
        },
        {
          name: "Black Iron",
          role: "Doors, frames, bench",
          description:
            "Steel French doors and matching transom windows define the front of the room. The leather bench frame and coat tree picks up the same line so the metalwork holds together as one system, not three separate objects.",
          family: "'Caslon', 'Adobe Caslon Pro', 'Garamond', serif",
          weight: 600,
        },
        {
          name: "Antiqued Brass",
          role: "Chandelier",
          description:
            "An alabaster pendant set in hand-rubbed brass, hung dead-center. Oversized on purpose so the room pulls vertical from the doorway. The closest thing to jewelry the entry gets.",
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
      title: "A Threshold",
      pressing: {
        mark: { n: "04", name: "A Threshold" },
        heldLine: "That Does the Work.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "The brass and alabaster chandelier, the vintage rug, the morning light. Found pieces and natural architecture, working together before anyone says hello.",
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
