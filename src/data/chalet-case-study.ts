import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/chalet";

export const chaletCaseStudy: CaseStudy = {
  slug: "chalet",
  title: "Mountain View Chalet",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "A 1968 Pacific Northwest chalet, taken to the studs and rebuilt inside and out. | Cabin bones, mid-century furniture, and 16-foot glass doors framing the tree line.",
  field: "Interior Design\nExterior Direction\nFinish Selection\nFurniture Curation\nFixture Sourcing",
  author: "Jeremy Prasatik",
  published: "2023",
  status: "Complete",
  classification: ["Interior Design", "Exterior Direction", "Finish Selection", "Furniture Curation", "Fixture Sourcing"],
  services: ["Interior Design", "Exterior Direction", "Finish Selection", "Furniture Curation", "Fixture Sourcing"],
  stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
  links: [],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META + ABSTRACT ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 8 frames",
        colors: ["#CCC4C1", "#AEA4A2", "#BDACA0", "#764226", "#667C72"],
        images: [
          "/case-studies/chalet/chalet-living-room-a-frame-glass-doors-malm-fireplace-sputnik-chandelier.jpg",
          "/case-studies/chalet/chalet-exterior-front-warm-gray-white-railings-pacific-northwest.jpg",
          "/case-studies/chalet/chalet-exterior-three-quarter-deck-stairs-pacific-northwest-landscape.jpg",
          "/case-studies/chalet/chalet-exterior-side-string-lights-stone-patio-white-stair-railings.jpg",
          "/case-studies/chalet/chalet-exterior-side-back-deck-white-stairs-stone-patio.jpg",
          "/case-studies/chalet/chalet-a-frame-ceiling-sputnik-chandelier-triangular-window-tree-canopy.jpg",
          "/case-studies/chalet/chalet-living-detail-tufted-sofa-walnut-ladder-shelf-antlers-painted-stone.jpg",
          "/case-studies/chalet/chalet-living-room-wide-walnut-dining-set-malm-fireplace-glass-doors-deck.jpg",
        ],
      },
      title: "Mountain View\nChalet",
      subtitle:
        "A 1968 Pacific Northwest chalet, taken to the studs and rebuilt inside and out. | Cabin bones, mid-century furniture, and 16-foot glass doors framing the tree line.",
      field: "Interior Design  Exterior Direction  Finish Selection  Furniture Curation  Fixture Sourcing",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Complete",
      classification: ["Interior Design", "Exterior Direction", "Finish Selection", "Furniture Curation", "Fixture Sourcing"],
      summary: [
        { label: "Built", value: "1968 PNW chalet rebuilt to the studs. Exterior, interior, furnishings" },
        { label: "Scope", value: "Interior design, exterior direction, finish selection, furniture and fixture sourcing" },
        { label: "Materials", value: "Reclaimed PNW pine, painted stone, warm gray siding, 16-foot glass doors, walnut, Malm fireplace, sputnik chandelier" },
        { label: "Angle", value: "Rebuilt so the trees are the point, and furnished so they stay that way." },
      ],
      abstract:
        "A 1968 Pacific Northwest chalet that hadn't been rethought since the '90s. Blue carpet, dated railings, an exterior that disappeared on cloudy days. The structure was sound. Everything else needed to go.\n\nTook it down to the studs. Exterior repainted warm gray with white railings. New lighting on the patio and stairs at night. Reclaimed PNW pine in mixed plank widths across the main level, a Malm fireplace, a sputnik chandelier overhead, and 16-foot sliding glass doors on the main wall, so the tree canopy is what you look at from every seat in the room.\n\nFurniture kept simple on purpose so it doesn't compete with what's outside the glass: tufted gray sofa, woven bench, walnut dining set, a leaning ladder shelf against painted stone. The original footprint gained over 400 square feet.",
    },

        // ── HERO — the iconic interior shot: A-frame ceiling, sputnik chandelier,
    // 16-foot glass doors framing the tree canopy, Malm fireplace, walnut
    // dining set. The whole project's argument in one frame.
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/chalet-living-room-a-frame-glass-doors-malm-fireplace-sputnik-chandelier.jpg`,
      alt: "Mountain View chalet living room with A-frame ceiling, sputnik chandelier, Malm fireplace, walnut dining set, and 16-foot glass doors framing the Pacific Northwest tree canopy",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — DOWN TO THE STUDS
    // (The exterior + structural rebuild beat. Group 3 imagery anchors here.)
    // ════════════════════════════════════════
    {
      id: "studs-header",
      type: "section-header",
      label: "SECTION 02: DOWN TO THE STUDS",
      title: "The house has an outline against",
      pressing: {
        mark: { n: "02", name: "Warm Gray" },
        heldLine: "the evergreens even when it is overcast.",
        choreo: { pin: true },
      },
    },
    {
      id: "studs-subhead",
      type: "text",
      size: "subhead",
      content:
        "Warm gray on the siding, white on the railings.",
    },
    {
      id: "studs-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "New lighting on the patio and the stairs at night, and string lights over the stone patio off the side. The stairs run down from the deck to that patio, and the front approach climbs a rocky grade to the door.",
    },

    // ── Front exterior — the zoom. The section argues that the exterior
    // stopped disappearing against the PNW green, and filling the mat is
    // what lets the warm gray read at the scale the argument claims.
    {
      id: "exterior-front-hero",
      type: "hero",
      image: `${IMG}/chalet-exterior-front-warm-gray-white-railings-pacific-northwest.jpg`,
      alt: "Front of the chalet repainted in warm gray with white railings, surrounded by Pacific Northwest evergreens and rocky landscape",
      inline: true,
      pressing: {
        plate: "02",
        captions: [
          "Warm gray, white railings",
          "Repainted for contrast",
          "Pacific Northwest",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── Three-quarter angle — climbs across the held front elevation
    {
      id: "exterior-three-quarter",
      type: "image",
      src: `${IMG}/chalet-exterior-three-quarter-deck-stairs-pacific-northwest-landscape.jpg`,
      alt: "Three-quarter view of the chalet showing the deck, white-railed stairs, and the rocky landscape grade leading up to the front door",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
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
      pressing: {
        captions: ["String lights, stone patio", "Back deck\nStair to the patio"],
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
      title: "Every seat",
      pressing: {
        mark: { n: "03", name: "Every Seat" },
        heldLine: "faces the trees.",
        choreo: { pin: true },
      },
    },
    {
      id: "interior-subhead",
      type: "text",
      size: "subhead",
      content:
        "The A-frame ceiling is wood plank all the way up, with a triangular window under the peak that frames the tops of the trees. There's a skylight too.",
    },
    {
      id: "interior-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The tufted gray sofa sits against the painted stone wall, with an antler mount above it and the walnut ladder shelf leaning next to it, books and a speaker on the rungs. A leather sling chair and a walnut coffee table under the skylight. The kitchen is white shaker cabinets and subway tile around an exposed wood beam column, and the same pine runs through it.",
    },

    // ── A-frame ceiling shot, standalone (the showpiece looking up at the
    // sputnik through the triangular window framing the trees). It climbs
    // the interior brief: the copy claims the canopy is the focal point,
    // and the plate arriving over that claim is the proof. Rise, not zoom
    // - the file is 2254px native, under the bar a zoom needs.
    {
      id: "a-frame-ceiling",
      type: "image",
      src: `${IMG}/chalet-a-frame-ceiling-sputnik-chandelier-triangular-window-tree-canopy.jpg`,
      alt: "Looking up at the chalet's A-frame wood-plank ceiling with a sputnik chandelier suspended over a triangular window framing the tree canopy outside",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── 2-up: group 1 verticals (sofa detail + wide living view). Held, so
    // the room entire can climb across the two details it is made of.
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
      pressing: {
        captions: ["Ladder shelf, painted stone", "Walnut dining set\nMalm fireplace"],
        choreo: { pin: true },
      },
    },

    // ── The secondary living moment — climbs across the held pair
    {
      id: "living-secondary-hero",
      type: "hero",
      image: `${IMG}/chalet-living-room-tufted-gray-sofa-painted-stone-antlers-ladder-shelf.jpg`,
      alt: "Chalet living area with tufted gray sofa, painted stone wall, antlers, walnut leaning ladder shelf, and the kitchen visible to the right",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── Editorial headline — the palate cleanser after the climb, pivoting
    // from the architecture beat to the quieter furnishings beat
    {
      id: "headline-quiet",
      type: "editorial-headline",
      text: "The trees are the reason\nthe room is shaped this way",
    },

    // ── 2-up: group 2 verticals (sofa detail closer + A-frame skylight
    // wide). Held. The kitchen used to sit here and the pair followed it,
    // but the quote poster above holds nothing, so the kitchen plate had
    // no screen to climb. Swapping the two gives it one and keeps the
    // furnishings detail next to the headline that introduces it.
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
      pressing: { choreo: { pin: true } },
    },

    // ── Kitchen, standalone (group 2 horizontal). The interior's last
    // room, climbing across the two furnishing details it sits behind.
    // Rise again rather than a second zoom: 2264px native, and one pinned
    // zoom per study is the gesture's whole value.
    {
      id: "kitchen",
      type: "image",
      src: `${IMG}/chalet-kitchen-white-shaker-cabinets-subway-tile-exposed-wood-beam-column.jpg`,
      alt: "Chalet kitchen with white shaker cabinets, subway tile backsplash, an exposed wood beam column, and PNW pine floors",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
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
      title: "Mixing cabin and mid-century",
      // The study's one crossing. The blend IS the argument — cabin form,
      // mid-century pieces — and it is the only section that names both
      // halves at once, so the gesture belongs on the synthesis beat.
      // `pin` alongside `crossing`: the crossing already holds as part of
      // its own gesture, so the flag changes nothing on the page. It is
      // the A.R.C. convention for saying so in the data, which is what
      // the audit reads.
      pressing: {
        mark: { n: "04", name: "Antlers to Sputnik" },
        heldLine: "was the whole idea.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "blend-subhead",
      type: "text",
      size: "subhead",
      content:
        "Every choice is plotted between the two. The structural moves land in the middle.",
    },
    {
      id: "blend-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Reclaimed pine, exposed beams, painted stone, and the antlers are the cabin end. The sputnik, the Malm, the walnut dining set, and the leather sling chair are the mid-century end. The 16-foot doors, the A-frame, and the warm gray exterior sit between them: cabin form at mid-century proportions.",
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
      title: "Over 400 square feet",
      pressing: {
        mark: { n: "05", name: "400 Square Feet" },
        heldLine: "bigger than it was.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Most of it came from reworking the deck line and pulling more of the main level out toward the trees.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Interior Design", "Exterior Direction", "Finish Selection", "Furniture Curation", "Fixture Sourcing"],
      stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
      links: [],
      content:
        "A 1968 chalet, down to the studs and back up. Cabin on the outside, mid-century on the inside, and 16 feet of glass in between.",
    },
  ],
};
