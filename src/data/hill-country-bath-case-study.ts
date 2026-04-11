import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/hill-country-bath";

export const hillCountryBathCaseStudy: CaseStudy = {
  slug: "hill-country-bath",
  title: "Hill Country Primary Bath",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "Marble surfaces, warm metal fixtures, and wood ceilings. A 400 square foot bathroom designed to feel collected rather than spec'd.",
  field: "Interior Design\nBathroom Design\nFixture Sourcing",
  author: "Jeremy Prasatik",
  published: "2023",
  status: "Complete",
  classification: [
    "Interior Design",
    "Bathroom Design",
    "Fixture Sourcing",
    "Art Selection",
  ],
  services: [
    "Interior Design",
    "Furniture Curation",
    "Art Selection",
    "Fixture Sourcing",
  ],
  stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hill-country-bath-vanity-marble-globe-sconces-sage.jpg`,
      alt: "Hill Country primary bath, marble vanity with globe sconces, sage cabinetry, dried botanicals",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Hill Country\nPrimary Bath",
      subtitle:
        "Three marbles. Two vanities. One freestanding tub under a wood plank ceiling. 400 square feet designed to feel found, not fitted.",
      field: "Interior Design  Bathroom Design  Fixture Sourcing",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Complete",
      classification: [
        "Interior Design",
        "Bathroom Design",
        "Fixture Sourcing",
        "Art Selection",
      ],
      abstract:
        "The primary bath sits in the same Hill Country home as the kitchen. Same property, same material family, different register. Where the kitchen runs bold (dark sage, raw oak, unlacquered brass), the bath pulls back. Lighter sage on the cabinetry. Polished nickel where the kitchen used brass. Three different marbles instead of one.\n\nCountertops in a warm-veined Calacatta. Shower walls in a cooler, gray-dominant slab with vertical stacking. Floor in hex marble mosaic. The stones were selected as a group, not matched. The variation keeps 400 square feet of hard surface from reading as a showroom.\n\nWood plank ceiling overhead. Globe sconces at both vanities. Wall-mounted cross-handle faucets. A freestanding tub positioned under natural light with views to the property. Dried florals, an olive tree, layered vintage rugs. Every object placed to feel personal rather than styled.",
    },

    // ── GROUPING 1: Her vanity + tub — warm light, details ──
    {
      id: "vanity-header",
      type: "section-header",
      label: "SECTION 02: THE VANITY",
      title: "Globe Sconces.\nMarble Edge.\nMorning Light.",
      group: { name: "vanity", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "vanity-text",
      type: "text",
      size: "subhead",
      content:
        "Two vanity zones share the room. Hers faces the east windows. The marble catches morning sun and the globe sconces throw warm circles on the shiplap walls behind them.",
      group: { name: "vanity" },
    },
    {
      id: "vanity-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Vessel sinks on marble countertops. Wall-mounted bridge faucets with cross handles, a vintage silhouette against modern plumbing. The cabinet color reads lighter than the kitchen's sage, pulled from the same paint family but shifted two steps toward gray. Glass-front uppers on one side for display. Solid doors on the other for storage. The asymmetry is deliberate.",
      group: { name: "vanity" },
    },

    // ── Her side details — inside the vanity group ──
    {
      id: "her-details",
      type: "dual-image",
      native: true,
      group: { name: "vanity" },
      left: {
        src: `${IMG}/hill-country-bath-detail-vase-botanicals-marble-sconce.jpg`,
        alt: "Detail, ceramic vase with dried botanicals on marble counter, globe sconce casting shadows",
      },
      right: {
        src: `${IMG}/hill-country-bath-detail-faucet-marble-backsplash-window.jpg`,
        alt: "Detail, cross-handle wall faucet, marble backsplash, globe sconce, window reflection",
      },
    },
    {
      id: "her-views",
      type: "dual-image",
      native: true,
      group: { name: "vanity" },
      left: {
        src: `${IMG}/hill-country-bath-her-vanity-wall-glass-cabinet-sconces.jpg`,
        alt: "Her vanity wall, sage cabinetry with glass-front cabinet, double globe sconces, marble counter",
      },
      right: {
        src: `${IMG}/hill-country-bath-freestanding-tub-wood-ceiling-painting.jpg`,
        alt: "Freestanding tub beneath wood plank ceiling, landscape painting, oriental rug, natural light",
      },
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-collected",
      type: "editorial-headline",
      text: "Collected, not decorated.\nFound, not fitted.",
    },

    // ── THE SHOWER ──
    {
      id: "shower-header",
      type: "section-header",
      label: "SECTION 03: THE SHOWER",
      title: "Three Marbles.\nOne Shower.",
    },
    {
      id: "shower-text",
      type: "text",
      size: "subhead",
      content:
        "Walls, floor, and niche each in a different cut. Vertical stacking on the walls for height. Hex mosaic on the floor for grip and visual texture. A recessed niche lined in the same hex for continuity. Polished nickel rain head and hand shower.",
    },
    {
      id: "shower-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The marble selection took longer than any other specification in the bath. Three stones needed to read as relatives, not twins. Too close and the room flattens. Too far apart and the transitions jar. The countertop marble runs warm with gold and brown veining. The shower walls pull cooler with gray movement. The hex floor splits the difference. The bench inside the shower uses the same slab as the walls, bookmatched at the corner.",
    },

    // ── GROUPING 2: Shower + his side — cooler tones, details ──
    {
      id: "shower-details",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/hill-country-bath-detail-sink-bridge-faucet-veined-marble.jpg`,
        alt: "Vanity detail, vessel sink with bridge faucet, dramatically veined marble slab",
      },
      right: {
        src: `${IMG}/hill-country-bath-detail-globe-sconce-dried-botanicals-clay.jpg`,
        alt: "Detail, polished nickel double globe sconce, dried botanicals in clay pot on marble",
      },
    },
    {
      id: "shower-views",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/hill-country-bath-shower-niche-hex-tile-bench.jpg`,
        alt: "Marble shower, recessed niche with hex tile, bench, mixed vertical and horizontal marble",
      },
      right: {
        src: `${IMG}/hill-country-bath-shower-rain-head-marble-tile.jpg`,
        alt: "Marble shower, rain head and hand shower, polished nickel fixtures, large format marble tile",
      },
    },

    // ── HIS VANITY HERO ──
    {
      id: "his-hero",
      type: "hero",
      image: `${IMG}/hill-country-bath-his-vanity-valet-stand-antique-mirror.jpg`,
      alt: "His vanity, brass valet stand with denim jacket, antique mirror, sage cabinetry, globe sconces",
      inline: true,
    },

    // ── THE OBJECTS ──
    {
      id: "objects-header",
      type: "section-header",
      label: "SECTION 04: THE OBJECTS",
      title: "A Brass Valet Stand.\nAn Oil Painting.\nA Clay Pot.",
    },
    {
      id: "objects-text",
      type: "text",
      size: "subhead",
      content:
        "The objects in the room weren't sourced from a single vendor or ordered to spec. A brass valet stand from an antique shop. A landscape painting that predates the house. Dried field grass in a clay pot that weighs more than the sink.",
    },
    {
      id: "objects-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The styling reads personal because it is. A room that looks lived-in on the day the photographer arrives is a room where the objects were chosen for the owner, not the lens. The denim jacket on the valet stand. The vintage rug fraying at the edge. The olive tree leaning toward the window. These details resist the temptation to make everything perfect. Imperfection signals that someone lives here.",
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "400 Square Feet.\nThree Stones.\nOne Room.",
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "A bath that borrows from the kitchen's vocabulary without repeating it. Same property, same design sensibility, quieter volume.",
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Interior Design",
        "Furniture Curation",
        "Art Selection",
        "Fixture Sourcing",
      ],
      stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
      links: [],
      content:
        "The kitchen two rooms away uses four materials and covers them in brass. This bath uses three marbles and covers them in polished nickel. The shiplap walls, the wood ceiling, the sage cabinetry carry through. The register shifts from social space to private one.\n\nA freestanding tub positioned where the light falls. Globe sconces that throw warm circles on vertical plank walls. A shower lined in three different stones selected to feel related, not identical. Objects chosen for the people who use the room, not the people who photograph it.",
    },
  ],
};
