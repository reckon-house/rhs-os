import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/fairview-sitting";

export const fairviewSittingCaseStudy: CaseStudy = {
  slug: "fairview-sitting",
  title: "The Fairview: Sitting Room.",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "The Fairview sitting room. | Stacked stone, velvet swivels, antiqued brass, and a room built for conversation, a drink, and a fire.",
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
        caption: "Preview · 8 frames",
        colors: ["#B4ACA0", "#3F3E37", "#A87A45", "#A67E55", "#ECE6D5"],
        images: [
          "/case-studies/fairview-sitting/fairview-sitting-stacked-stone-fireplace-charcoal-velvet-swivels-brass-coffee-table.jpg",
          "/case-studies/fairview-sitting/fairview-sitting-stone-wall-wood-mantel-mirror-brass-candlesticks-leather-tumbler-detail.jpg",
          "/case-studies/fairview-sitting/fairview-sitting-mantel-mirror-stone-fireplace-symmetry-detail.jpg",
          "/case-studies/fairview-sitting/fairview-sitting-pampas-grass-vase-blue-brick-window-velvet-detail.jpg",
          "/case-studies/fairview-sitting/fairview-sitting-black-box-beams-stone-fireplace-pampas-grass-architectural-wide.jpg",
          "/case-studies/fairview-sitting/fairview-sitting-brass-wood-coffee-table-velvet-swivel-fireplace-detail.jpg",
          "/case-studies/fairview-sitting/fairview-sitting-fireplace-bar-cabinet-velvet-swivels-conversation-front.jpg",
          "/case-studies/fairview-sitting/fairview-sitting-velvet-swivels-rear-view-bar-cabinet-art-conversation-grouping.jpg",
        ],
      },
      title: "The Fairview\nSitting Room.",
      subtitle:
        "The Fairview sitting room. | Stacked stone, velvet swivels, antiqued brass, and a room built for conversation, a drink, and a fire.",
      field: "Interior Design  Furniture Curation  Finish Selection",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Built",
      classification: ["Interior Design", "Furniture Curation", "Finish Selection"],
      summary: [
        { label: "Built", value: "Sitting room built around a floor-to-ceiling stacked stone fireplace" },
        { label: "Scope", value: "Interior design, furniture curation, finish selection" },
        { label: "Materials", value: "Stacked stone, charcoal velvet, antiqued brass, warm oak" },
        { label: "Angle", value: "Four velvet swivels facing a stone fireplace, and no television anywhere in the room." },
      ],
      abstract:
        "A ledgestone fireplace wall runs floor to ceiling, and four charcoal velvet swivel chairs sit close enough to catch the firelight. The coffee table and the bar cabinet are antiqued brass, and there are black box beams overhead.\n\nThe palette is four materials: stone, velvet, brass, and warm oak, and no accent colors.\n\nThere is no television. The chairs face the fire and each other, and the round bar cabinet in the corner has whatever the evening needs. It reads as a formal room, a little glam, and it is comfortable to sit in.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/fairview-sitting-stacked-stone-fireplace-charcoal-velvet-swivels-brass-coffee-table.jpg`,
      alt: "The Fairview sitting room: floor-to-ceiling stacked stone fireplace, charcoal velvet swivel chairs around a round brass coffee table, black bar cabinet on the left",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — TEXTURE & MATERIAL
    // ════════════════════════════════════════
    {
      id: "texture-header",
      type: "section-header",
      label: "SECTION 02: TEXTURE",
      title: "The stone is the only one",
      // Pinned so the headline holds while the four-material list travels
      // up beside it, and so the stone detail below has a holder to climb.
      pressing: {
        mark: { n: "02", name: "Stone, Velvet" },
        heldLine: "that goes floor to ceiling.",
        choreo: { pin: true },
      },
    },
    {
      id: "texture-subhead",
      type: "text",
      size: "subhead",
      content:
        "Velvet on the chairs, brass on the table and the bar cabinet, oak underfoot and across the mantel.",
    },
    {
      id: "texture-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The velvet has enough sheen to catch the firelight, and the brass is antiqued so it doesn't shine back. The box beams overhead are painted the same charcoal as the chairs, which ties the ceiling to the seating.",
    },

    // Material detail image — stone wall + mantel close-up.
    // Climbs the brief it follows: the copy names the four materials, then
    // the first of them lands on top of the words that named it. Rises
    // rather than zooms because the file is 1098px native, well under the
    // floor for a plate that fills the mat.
    {
      id: "texture-stone",
      type: "image",
      src: `${IMG}/fairview-sitting-stone-wall-wood-mantel-mirror-brass-candlesticks-leather-tumbler-detail.jpg`,
      alt: "Detail of the stacked stone fireplace wall with wood beam mantel, round mirror, and brass candlesticks alongside a leather and brass tumbler",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
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
      // Held so the pulled-back view climbs across the two material
      // details. Materials first, then the room they add up to.
      pressing: {
        captions: ["Mantel and mirror\nStacked stone", "Pampas grass, blue brick"],
        choreo: { pin: true },
      },
    },

    // ── Architectural pulled-back view — climbs across the held details
    {
      id: "architectural-hero",
      type: "hero",
      image: `${IMG}/fairview-sitting-black-box-beams-stone-fireplace-pampas-grass-architectural-wide.jpg`,
      alt: "Pulled-back architectural view of the sitting room with black box beam coffered ceiling, stone fireplace, four swivel chairs around the brass coffee table, and pampas grass anchoring the corner",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 03 — CONVERSATION GROUPING
    // ════════════════════════════════════════
    {
      id: "conversation-header",
      type: "section-header",
      label: "SECTION 03: CONVERSATION",
      title: "The chairs turn, so they face",
      // This study's one crossing, on its SECOND header. Its sibling
      // (fairview-entry) crosses its first and zooms its architectural
      // frame; two rooms in one house get different staging on purpose.
      //
      // No zoom here: apart from the cover's own riser, every frame in
      // this study is 2234px native or less, under the working floor for
      // a plate that fills the mat.
      //
      // `pin` alongside `crossing`: the crossing already holds its headline
      // for its own 220dvh, so the flag changes nothing on the page. It is
      // the house convention for naming the holder in the data, which is
      // what the rear view below climbs.
      pressing: {
        mark: { n: "03", name: "Four Swivels" },
        heldLine: "each other or the fire.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "conversation-subhead",
      type: "text",
      size: "subhead",
      content:
        "Close enough to feel it either way.",
    },
    {
      id: "conversation-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The brass coffee table sits in the middle because that's where everyone reaches. The bar cabinet is round and black, in the corner behind the chairs, and a big black abstract hangs on the wall behind the grouping.",
    },

    // Single: rear view of the grouping showing the room composition.
    // Moved ahead of the 2-up so it climbs the held crossing. The headline
    // says a grouping built around the fire, and the grouping arrives over
    // the words. It also puts the whole room on screen before the details
    // take it apart.
    {
      id: "conversation-rear",
      type: "image",
      src: `${IMG}/fairview-sitting-velvet-swivels-rear-view-bar-cabinet-art-conversation-grouping.jpg`,
      alt: "Rear view of the four charcoal velvet swivel chairs around the brass coffee table, throw blanket over one chair, large black abstract artwork on the wall behind, bar cabinet in view",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
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
      // Captions only, and it lands last on purpose. Texture holds its pair
      // and lets the wide shot climb across it; conversation runs the same
      // parts in reverse, so the two sections never stage identically.
      pressing: {
        captions: ["Brass coffee table\nVelvet swivel", "Bar cabinet, front view"],
      },
    },

    // ── Editorial palate cleanser
    {
      id: "headline-glam",
      type: "editorial-headline",
      text: "The fire gets the seat\nthe TV would normally take",
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
      title: "Four materials,\neverything else follows.",
      introText:
        "Every other choice in the room comes from one of these four. The beams take their color from the velvet, the mantel from the oak, the bar cabinet from the brass.",
      philosophyTitle: "Material philosophy",
      philosophyText:
        "The palette stays this tight on purpose. Color comes in through the materials, and there are no accent pieces doing that job.",
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
            "Ledgestone, floor to ceiling on the fireplace wall, with a wood beam mantel and a round mirror set against it.",
          family: "'Caslon', 'Adobe Caslon Pro', 'Garamond', serif",
          weight: 400,
        },
        {
          name: "Charcoal Velvet",
          role: "Swivels & beams",
          description:
            "Charcoal velvet on the four swivel chairs, with a little sheen to it.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 600,
        },
        {
          name: "Antiqued Brass",
          role: "Coffee table & bar",
          description:
            "Hand-rubbed brass on the round coffee table, which has a wood top, and on the round bar cabinet in the corner.",
          family: "'Didot', 'Bodoni 72', 'Caslon', serif",
          weight: 400,
        },
        {
          name: "Warm Oak",
          role: "Floors & mantel beam",
          description:
            "White oak on the floor, and one oak beam across the stone as the mantel.",
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
      title: "This room is for the hour",
      pressing: {
        mark: { n: "04", name: "After Dinner" },
        heldLine: "after dinner.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Four materials, four chairs, and one fire.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Interior Design", "Furniture Curation", "Finish Selection"],
      stack: ["AutoCAD", "SketchUp", "Material specification"],
      links: [],
      content:
        "The stone wall and the sheen on the velvet are the two showy things in it. Everything else sits back.",
    },
  ],
};
