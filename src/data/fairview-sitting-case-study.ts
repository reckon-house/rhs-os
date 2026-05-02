import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/fairview-sitting";

export const fairviewSittingCaseStudy: CaseStudy = {
  slug: "fairview-sitting",
  title: "The Fairview: Sitting Room.",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "Stacked stone, velvet swivels, antiqued brass. A room built for conversation, a drink, and a fire.",
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
      image: `${IMG}/fairview-sitting-stacked-stone-fireplace-charcoal-velvet-swivels-brass-coffee-table.jpg`,
      alt: "The Fairview sitting room: floor-to-ceiling stacked stone fireplace, charcoal velvet swivel chairs around a round brass coffee table, black bar cabinet on the left",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "The Fairview\nSitting Room.",
      subtitle:
        "Stacked stone, velvet swivels, antiqued brass. A room built for conversation, a drink, and a fire.",
      field: "Interior Design  Furniture Curation  Finish Selection",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Built",
      classification: ["Interior Design", "Furniture Curation", "Finish Selection"],
      abstract:
        "Texture runs the room. A ledgestone fireplace wall climbs floor to ceiling, charcoal velvet swivel chairs sit close enough to it to catch the firelight, and the antiqued brass coffee table and bar cabinet add warmth without shine. Black box beams overhead pull the contrast together.\n\nThe palette stays tight - stone, velvet, brass, warm oak, no competing colors. The materials do the talking.\n\nFurniture arranges for conversation rather than a television. Four swivels face the fire, close enough for quiet voices, with a round bar cabinet in the corner stocking what the moment calls for. Calm and slightly glam, formal without being stiff.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — TEXTURE & MATERIAL
    // ════════════════════════════════════════
    {
      id: "texture-header",
      type: "section-header",
      label: "SECTION 02: TEXTURE",
      title: "Stone, Velvet,\nBrass, Oak.",
    },
    {
      id: "texture-subhead",
      type: "text",
      size: "subhead",
      content:
        "Texture runs the room. Four materials carry the whole composition, with no competing colors and no decorative noise.",
    },
    {
      id: "texture-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Stone wall floor to ceiling, charcoal velvet on the swivels with enough sheen to catch light, antiqued brass adding warmth without shine, warm oak underfoot. Each material does one job and stays out of the others' way.",
    },

    // Material detail image — stone wall + mantel close-up
    {
      id: "texture-stone",
      type: "image",
      src: `${IMG}/fairview-sitting-stone-wall-wood-mantel-mirror-brass-candlesticks-leather-tumbler-detail.jpg`,
      alt: "Detail of the stacked stone fireplace wall with wood beam mantel, round mirror, and brass candlesticks alongside a leather and brass tumbler",
      aspect: "native",
      padded: true,
    },

    // 2-up: mantel symmetry + pampas detail
    {
      id: "texture-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/fairview-sitting-mantel-mirror-stone-fireplace-symmetry-detail.jpg`,
        alt: "Centered shot of the wood mantel and round mirror against the stacked stone wall, with the fireplace and andirons below",
      },
      right: {
        src: `${IMG}/fairview-sitting-pampas-grass-vase-blue-brick-window-velvet-detail.jpg`,
        alt: "Pampas grass in a stone vase by a black-framed window with painted blue brick wall behind, edge of charcoal velvet swivel in foreground",
      },
    },

    // ── Inline hero: architectural pulled-back view
    {
      id: "architectural-hero",
      type: "hero",
      image: `${IMG}/fairview-sitting-black-box-beams-stone-fireplace-pampas-grass-architectural-wide.jpg`,
      alt: "Pulled-back architectural view of the sitting room with black box beam coffered ceiling, stone fireplace, four swivel chairs around the brass coffee table, and pampas grass anchoring the corner",
      inline: true,
    },

    // ════════════════════════════════════════
    // SECTION 03 — CONVERSATION GROUPING
    // ════════════════════════════════════════
    {
      id: "conversation-header",
      type: "section-header",
      label: "SECTION 03: CONVERSATION",
      title: "A Grouping Built\nAround the Fire.",
    },
    {
      id: "conversation-subhead",
      type: "text",
      size: "subhead",
      content:
        "Four swivels facing the fire, close enough for quiet voices. A round bar cabinet in the corner stocks what the moment calls for.",
    },
    {
      id: "conversation-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The fire gets the seat the TV would normally take. The brass coffee table sits at the center because that's where everyone reaches, and the furniture is arranged as architecture for conversation rather than for staring at a screen.",
    },

    // 2-up: brass table detail + grouping front
    {
      id: "conversation-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/fairview-sitting-brass-wood-coffee-table-velvet-swivel-fireplace-detail.jpg`,
        alt: "Tight detail of the round brass coffee table with wood top, olive plant in marble bowl, and the corner of a charcoal velvet swivel against the stone fireplace",
      },
      right: {
        src: `${IMG}/fairview-sitting-fireplace-bar-cabinet-velvet-swivels-conversation-front.jpg`,
        alt: "Front view of the conversation grouping with the round black bar cabinet on the left, two swivels around the brass coffee table, fireplace beyond",
      },
    },

    // Single: rear view of the grouping showing the room composition
    {
      id: "conversation-rear",
      type: "image",
      src: `${IMG}/fairview-sitting-velvet-swivels-rear-view-bar-cabinet-art-conversation-grouping.jpg`,
      alt: "Rear view of the four charcoal velvet swivel chairs around the brass coffee table, throw blanket over one chair, large black abstract artwork on the wall behind, bar cabinet in view",
      aspect: "native",
      padded: true,
    },

    // ── Editorial palate cleanser
    {
      id: "headline-glam",
      type: "editorial-headline",
      text: "A formal room\nthat doesn't feel formal",
    },

    // ════════════════════════════════════════
    // SECTION 04 — MARKS & MATERIALS
    // (Interior take on the standard pattern: shapes-as-fonts becomes
    // materials-as-fonts. Each band shows one of the four key materials in
    // its own color band.)
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 04: MARKS & MATERIALS",
      title: "Four Materials\nCarrying One Room.",
      introText:
        "The room runs on four materials and one shared light, pulled tight enough to read as a single composition.",
      philosophyTitle: "Material philosophy",
      philosophyText:
        "Stone for the structure, velvet for the seating, brass for the centerpiece, oak for the floor. Every other choice in the room derives from one of those four - the box beams pull from the velvet, the mantel from the oak, the bar cabinet from the brass.\n\nThe palette stays tight on purpose. Color goes in via the materials, not via accents. No throw pillow doing the work the room should already be doing.",
      colors: [
        { name: "Stone Grey", hex: "#B4ACA0", description: "Stacked stone, walls" },
        { name: "Charcoal Velvet", hex: "#3F3E37", description: "Swivels, beams" },
        { name: "Antiqued Brass", hex: "#A87A45", description: "Coffee table, bar" },
        { name: "Warm Oak", hex: "#A67E55", description: "Floors, mantel" },
        { name: "Cream", hex: "#ECE6D5", description: "Walls, throw" },
      ],
      fonts: [
        {
          name: "Stacked Stone",
          role: "Fireplace wall",
          description:
            "Floor-to-ceiling ledgestone. The structural anchor of the room and the only material that goes that big. Sets the tone before any furniture lands.",
          family: "'Caslon', 'Adobe Caslon Pro', 'Garamond', serif",
          weight: 400,
        },
        {
          name: "Charcoal Velvet",
          role: "Swivels & beams",
          description:
            "Deep, slightly sheen-y velvet on the four swivel chairs. Echoed overhead in the painted black box beams. Soft surface, hard color.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 600,
        },
        {
          name: "Antiqued Brass",
          role: "Coffee table & bar",
          description:
            "Hand-rubbed finish on the centerpiece coffee table and round bar cabinet. Adds warmth without the shine of polished brass. The closest thing to jewelry in the room.",
          family: "'Didot', 'Bodoni 72', 'Caslon', serif",
          weight: 400,
        },
        {
          name: "Warm Oak",
          role: "Floors & mantel beam",
          description:
            "White oak floors throughout. Repeated as the single horizontal mantel beam pulled across the stone. The grain ties the structure to the comfort.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 400,
        },
      ],
      markImage: `${IMG}/fairview-sitting-brass-wood-coffee-table-velvet-swivel-fireplace-detail.jpg`,
      markAlt: "Round antiqued brass coffee table with wood top, olive plant in marble bowl, charcoal velvet swivel against stacked stone fireplace — the room's centerpiece",
      markFullBleed: true,
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "A Room Built\nfor the Hour.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Built around a fire, finished in stone, brass, and velvet. Used for the drink, the conversation, the quiet hour after dinner.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Interior Design", "Furniture Curation", "Finish Selection"],
      stack: ["AutoCAD", "SketchUp", "Material specification"],
      links: [],
      content:
        "A formal room that doesn't feel formal. Four materials, four chairs, one fire, used for the drink, the conversation, and the quiet hour after dinner.",
    },
  ],
};
