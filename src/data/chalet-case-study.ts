import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/chalet";

export const chaletCaseStudy: CaseStudy = {
  slug: "chalet",
  title: "Mountain View Chalet",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "1968 Pacific Northwest chalet taken to the studs and rebuilt - exterior, interior, furnishings. Cabin bones with mid-century sensibility and 16-foot glass doors framing the tree line.",
  field: "Interior Design\nExterior Direction\nFinish Selection\nFurniture Curation\nFixture Sourcing",
  author: "Jeremy Prasatik",
  published: "2023",
  status: "Complete",
  classification: ["Interior Design", "Exterior Direction", "Finish Selection", "Furniture Curation", "Fixture Sourcing"],
  services: ["Interior Design", "Exterior Direction", "Finish Selection", "Furniture Curation", "Fixture Sourcing"],
  stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO — the iconic interior shot: A-frame ceiling, sputnik chandelier,
    // 16-foot glass doors framing the tree canopy, Malm fireplace, walnut
    // dining set. The whole project's argument in one frame.
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/chalet-living-room-a-frame-glass-doors-malm-fireplace-sputnik-chandelier.jpg`,
      alt: "Mountain View chalet living room with A-frame ceiling, sputnik chandelier, Malm fireplace, walnut dining set, and 16-foot glass doors framing the Pacific Northwest tree canopy",
    },

    // ── META + ABSTRACT ──
    {
      id: "meta",
      type: "meta",
      title: "Mountain View\nChalet",
      subtitle:
        "1968 Pacific Northwest chalet taken to the studs and rebuilt - exterior, interior, furnishings. Cabin bones with mid-century sensibility and 16-foot glass doors framing the tree line.",
      field: "Interior Design  Exterior Direction  Finish Selection  Furniture Curation  Fixture Sourcing",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Complete",
      classification: ["Interior Design", "Exterior Direction", "Finish Selection", "Furniture Curation", "Fixture Sourcing"],
      abstract:
        "A 1968 Pacific Northwest chalet that hadn't been rethought since the '90s. Blue carpet, dated railings, an exterior that disappeared on cloudy days. The structure was sound. Everything else needed to go.\n\nTook it down to the studs. Exterior repainted in warm gray with white railings for contrast against the PNW green. New lighting mounted to catch the patio and stairs at night. Reclaimed PNW pine in mixed plank widths across the main level. A Malm fireplace and sputnik chandelier overhead. 16-foot sliding glass doors installed on the main wall - the tree canopy becomes the focal point from every seat in the room.\n\nFurniture kept simple on purpose. Tufted gray sofa, woven bench, walnut dining set, a leaning ladder shelf against painted stone. The surroundings carry the energy. The interior stays quiet enough to let them. Original footprint gained over 400 square feet.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — DOWN TO THE STUDS
    // (The exterior + structural rebuild beat. Group 3 imagery anchors here.)
    // ════════════════════════════════════════
    {
      id: "studs-header",
      type: "section-header",
      label: "SECTION 02: DOWN TO THE STUDS",
      title: "An Exterior That\nStops Disappearing.",
    },
    {
      id: "studs-subhead",
      type: "text",
      size: "subhead",
      content:
        "Built in 1968. Hadn't been rethought since the '90s. Blue carpet, dated railings, an exterior that disappeared on cloudy days. The structure was sound. Everything else needed to go.",
    },
    {
      id: "studs-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Exterior repainted in warm gray with white railings for contrast against the PNW green. New lighting mounted to catch the patio and stairs at night. The original footprint gained over 400 square feet, mostly through reworking the deck line and pulling more of the main level out toward the trees.",
    },

    // ── Front exterior, inline scaling hero
    {
      id: "exterior-front-hero",
      type: "hero",
      image: `${IMG}/chalet-exterior-front-warm-gray-white-railings-pacific-northwest.jpg`,
      alt: "Front of the chalet repainted in warm gray with white railings, surrounded by Pacific Northwest evergreens and rocky landscape",
      inline: true,
    },

    // ── Three-quarter angle, standalone (the dramatic landscape view)
    {
      id: "exterior-three-quarter",
      type: "image",
      src: `${IMG}/chalet-exterior-three-quarter-deck-stairs-pacific-northwest-landscape.jpg`,
      alt: "Three-quarter view of the chalet showing the deck, white-railed stairs, and the rocky landscape grade leading up to the front door",
      aspect: "native",
      padded: true,
    },

    // ── 2-up: side details (string lights + back deck)
    {
      id: "exterior-side-details",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/chalet-exterior-side-string-lights-stone-patio-white-stair-railings.jpg`,
        alt: "Side of the chalet at dusk with string lights strung over a stone patio, white-railed stairs, and warm gray siding",
      },
      right: {
        src: `${IMG}/chalet-exterior-side-back-deck-white-stairs-stone-patio.jpg`,
        alt: "Back-side view of the chalet showing the deck overhang, white-railed staircase down to a stone patio, and the landscaped garden line",
      },
    },

    // ════════════════════════════════════════
    // SECTION 03 — THE INTERIOR
    // (Combines the A-frame story (group 1) and the quieter living/kitchen
    // beats (group 2) into one extended interior section.)
    // ════════════════════════════════════════
    {
      id: "interior-header",
      type: "section-header",
      label: "SECTION 03: THE INTERIOR",
      title: "Tree Canopy as the\nFocal Point.",
    },
    {
      id: "interior-subhead",
      type: "text",
      size: "subhead",
      content:
        "Reclaimed PNW pine in mixed plank widths across the main level. A Malm fireplace anchors the living area. Sputnik chandelier overhead. 16-foot sliding glass doors on the main wall - the tree canopy becomes the focal point from every seat in the room.",
    },
    {
      id: "interior-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Furniture kept simple on purpose. Tufted gray sofa, woven bench, walnut dining set, a leaning ladder shelf against painted stone. The surroundings carry the energy - the interior stays quiet enough to let them. Cabin form, mid-century pieces. The blend was the brief.",
    },

    // ── A-frame ceiling shot, standalone (the showpiece looking up at the
    // sputnik through the triangular window framing the trees)
    {
      id: "a-frame-ceiling",
      type: "image",
      src: `${IMG}/chalet-a-frame-ceiling-sputnik-chandelier-triangular-window-tree-canopy.jpg`,
      alt: "Looking up at the chalet's A-frame wood-plank ceiling with a sputnik chandelier suspended over a triangular window framing the tree canopy outside",
      aspect: "native",
      padded: true,
    },

    // ── 2-up: group 1 verticals (sofa detail + wide living view)
    {
      id: "living-group-one",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/chalet-living-detail-tufted-sofa-walnut-ladder-shelf-antlers-painted-stone.jpg`,
        alt: "Detail of the living room with tufted gray sofa, walnut leaning ladder shelf, antler mount on a painted stone wall, and a yellow accent pillow",
      },
      right: {
        src: `${IMG}/chalet-living-room-wide-walnut-dining-set-malm-fireplace-glass-doors-deck.jpg`,
        alt: "Wide view of the chalet living room with a walnut dining set, the Malm fireplace, sputnik chandelier overhead, and 16-foot glass doors opening to the deck",
      },
    },

    // ── Editorial headline acting as the pivot from "the architecture beat"
    // to "the quieter furnishings beat"
    {
      id: "headline-quiet",
      type: "editorial-headline",
      text: "Quiet enough to let\nthe surroundings lead",
    },

    // ── hero2 inline — the secondary living moment
    {
      id: "living-secondary-hero",
      type: "hero",
      image: `${IMG}/chalet-living-room-tufted-gray-sofa-painted-stone-antlers-ladder-shelf.jpg`,
      alt: "Chalet living area with tufted gray sofa, painted stone wall, antlers, walnut leaning ladder shelf, and the kitchen visible to the right",
      inline: true,
    },

    // ── Kitchen, standalone (group 2 horizontal)
    {
      id: "kitchen",
      type: "image",
      src: `${IMG}/chalet-kitchen-white-shaker-cabinets-subway-tile-exposed-wood-beam-column.jpg`,
      alt: "Chalet kitchen with white shaker cabinets, subway tile backsplash, an exposed wood beam column, and PNW pine floors",
      aspect: "native",
      padded: true,
    },

    // ── 2-up: group 2 verticals (sofa detail closer + A-frame skylight wide)
    {
      id: "living-group-two",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/chalet-living-detail-stag-pillow-tufted-sofa-walnut-ladder-shelf-painted-stone.jpg`,
        alt: "Closer detail of the tufted gray sofa with a stag-print pillow, walnut leaning ladder shelf with books and a speaker, against the painted stone wall",
      },
      right: {
        src: `${IMG}/chalet-living-room-a-frame-skylight-tufted-sofa-walnut-coffee-table-leather-sling.jpg`,
        alt: "Wider chalet living room view with the A-frame ceiling, skylight, leather sling chair, walnut coffee table, and the painted stone wall in the background",
      },
    },

    // ════════════════════════════════════════
    // SECTION 04 — THE BLEND (chart)
    // (The synthesis: where each design choice landed on the cabin ↔
    // mid-century axis. Particle-cluster spectrum, same dense art/science
    // aesthetic as the floor-and-decor MaterialOverlap chart.)
    // ════════════════════════════════════════
    {
      id: "blend-header",
      type: "section-header",
      label: "SECTION 04: THE BLEND",
      title: "Cabin Bones,\nMid-Century Sensibility.",
    },
    {
      id: "blend-subhead",
      type: "text",
      size: "subhead",
      content:
        "Plotting each design choice along the cabin ↔ mid-century axis shows how the renovation actually works. Cabin elements hold the form. Mid-century pieces thread through it. The middle of the spectrum is where the structural moves live - the A-frame, the glass doors, the warm gray exterior.",
    },
    {
      id: "blend-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Reclaimed PNW pine, exposed beams, painted stone, and the antlers anchor the cabin end. Sputnik chandelier, Malm fireplace, walnut dining set, and the leather sling chair pull toward mid-century. The 16-foot sliding doors and the A-frame geometry sit in the middle - cabin form scaled up by mid-century proportions, with the tree line doing the rest of the work.",
    },
    {
      id: "blend-chart",
      type: "cabin-midcentury-spectrum",
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "A Chalet That\nLooks Out.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Cabin form, mid-century pieces, 16 feet of glass between the room and the tree canopy. The renovation didn't compete with the setting - it framed it.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Interior Design", "Exterior Direction", "Finish Selection", "Furniture Curation", "Fixture Sourcing"],
      stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
      links: [],
      content:
        "A 1968 chalet rebuilt around the trees outside it. Down to the studs and back up - exterior, interior, furnishings. The structural moves stayed cabin. The pieces inside stayed mid-century. The 16-foot glass doors on the main wall did the rest, turning the Pacific Northwest tree line into the room's loudest design choice.",
    },
  ],
};
