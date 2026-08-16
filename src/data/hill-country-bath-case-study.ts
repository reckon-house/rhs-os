import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/hill-country-bath";

export const hillCountryBathCaseStudy: CaseStudy = {
  slug: "hill-country-bath",
  title: "Hill Country Primary Bath",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "The primary bath in the same Hill Country house as the kitchen, 400 square feet. | Three marbles, two vanities, one freestanding tub under a wood plank ceiling, and a room that feels found.",
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
  style: "pressing",
  sections: [
    // ── META ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 8 frames",
        colors: ["#959085", "#B0ACAD", "#8F8577", "#605C5B", "#A39D90"],
        images: [
          "/case-studies/hill-country-bath/hill-country-bath-vanity-marble-globe-sconces-sage.jpg",
          "/case-studies/hill-country-bath/hill-country-bath-detail-vase-botanicals-marble-sconce.jpg",
          "/case-studies/hill-country-bath/hill-country-bath-detail-faucet-marble-backsplash-window.jpg",
          "/case-studies/hill-country-bath/hill-country-bath-her-vanity-wall-glass-cabinet-sconces.jpg",
          "/case-studies/hill-country-bath/hill-country-bath-freestanding-tub-wood-ceiling-painting.jpg",
          "/case-studies/hill-country-bath/hill-country-bath-detail-sink-bridge-faucet-veined-marble.jpg",
          "/case-studies/hill-country-bath/hill-country-bath-detail-globe-sconce-dried-botanicals-clay.jpg",
          "/case-studies/hill-country-bath/hill-country-bath-shower-niche-hex-tile-bench.jpg",
        ],
      },
      title: "Hill Country\nPrimary Bath",
      subtitle:
        "The primary bath in the same Hill Country house as the kitchen, 400 square feet. | Three marbles, two vanities, one freestanding tub under a wood plank ceiling, and a room that feels found.",
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
      summary: [
        { label: "Built", value: "400 sq ft, two vanities, a freestanding tub, and a marble shower with a bench, all under a wood plank ceiling." },
        { label: "Scope", value: "Interior design, fixture sourcing, art selection, furniture curation." },
        { label: "Materials", value: "Three marbles, polished nickel, lighter sage cabinetry, wood plank ceiling." },
        { label: "Angle", value: "The valet stand came from an antique shop and the painting is older than the house, so the room looked lived in the day it was finished." },
      ],
      abstract:
        "Two rooms from the kitchen, and softer than it. The kitchen runs dark sage, raw oak, and unlacquered brass; the bath goes lighter on the sage, swaps the brass for polished nickel, and uses three marbles where the kitchen used one.\n\nCounters in a warm-veined Calacatta, shower walls in a cooler, grayer slab stacked vertically, floor in hex marble mosaic. The three were picked to go together, which keeps 400 square feet of hard surface from looking like a showroom.\n\nWood plank ceiling, globe sconces at both vanities, wall-mounted cross-handle faucets, and a freestanding tub under the window with a view out to the property. Dried florals, an olive tree, layered vintage rugs, and every object in it placed so it feels like somebody's room.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hill-country-bath-vanity-marble-globe-sconces-sage.jpg`,
      alt: "Hill Country primary bath, marble vanity with globe sconces, sage cabinetry, dried botanicals",
      pressing: { choreo: { rise: true } },
    },

    // ── GROUPING 1: Her vanity + tub — warm light, details ──
    {
      id: "vanity-header",
      type: "section-header",
      label: "SECTION 02: THE VANITY",
      title: "Two vanities,",
      pressing: {
        mark: { n: "02", name: "Two Vanities" },
        heldLine: "hers facing the east windows.",
        // Held so the claim about the light stays on screen while the two
        // paragraphs describing it travel up beside it. The four detail
        // frames below are the evidence, and the argument has to still be
        // up there when they arrive.
        choreo: { pin: true },
      },
      group: { name: "vanity", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "vanity-text",
      type: "text",
      size: "subhead",
      content:
        "The marble catches the morning sun, and the globe sconces throw warm circles on the shiplap behind them.",
      group: { name: "vanity" },
    },
    {
      id: "vanity-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Vessel sinks on marble, wall-mounted bridge faucets with cross handles, a vintage shape on modern plumbing. The cabinet color is the kitchen's sage from the same paint family, two steps toward gray. Glass-front uppers on one side for display and solid doors on the other for storage; the two sides don't match on purpose.",
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
      // The pass first put "The clay pot weighs more than the sink" here,
      // which nothing in the file supports; nobody weighed anything. The
      // painting line is in the file twice and is the truest thing about
      // the room, so it moves up here and the closing lets it go.
      text: "The painting is older\nthan the house",
    },

    // ── THE SHOWER ──
    {
      id: "shower-header",
      type: "section-header",
      label: "SECTION 03: THE SHOWER",
      title: "Picking the marble",
      // The study's one crossing. The most human line in it, and the only
      // one that admits what the work actually cost.
      //
      // No zoom plate: the one file clearing the working floor is the
      // his-vanity frame, and it is spent as the riser below. Four
      // dual-images run back to back in this study, so breaking that run
      // with a climb reads better than a zoom would.
      //
      // `pin` alongside `crossing`: the crossing already holds as part of
      // its own gesture, so the flag changes nothing on the page. It is the
      // convention for saying so in the data, which is what the audit reads.
      pressing: {
        mark: { n: "03", name: "Picking the Marble" },
        heldLine: "Took the Longest.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "shower-text",
      type: "text",
      size: "subhead",
      content:
        "Walls, floor, and niche, each a different cut. Vertical stacking on the walls for height, hex mosaic on the floor for grip, and the recessed niche lined in the same hex. Rain head and hand shower in polished nickel.",
    },
    {
      id: "shower-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Three stones had to look like relatives, near each other but not the same, with enough distance that the room didn't go flat and not so much that the changes jarred. The counter marble runs warm with gold and brown veining, the shower walls go cooler with gray movement, and the hex floor splits the difference. The bench in the shower is cut from the same slab as the walls and bookmatched at the corner.",
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
      // Held for the climb, and the reason it lands here: four dual-images
      // run consecutively in this study, and this is the last of them. The
      // his-vanity plate crossing the pair is what breaks the run.
      pressing: {
        captions: ["Shower niche\nHex tile bench", "Rain head, nickel fixtures"],
        choreo: { pin: true },
      },
    },

    // ── HIS VANITY — climbs across the held shower views
    {
      id: "his-hero",
      type: "hero",
      image: `${IMG}/hill-country-bath-his-vanity-valet-stand-antique-mirror.jpg`,
      alt: "His vanity, brass valet stand with denim jacket, antique mirror, sage cabinetry, globe sconces",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── THE OBJECTS ──
    {
      id: "objects-header",
      type: "section-header",
      label: "SECTION 04: THE OBJECTS",
      title: "The valet stand, the painting,",
      pressing: {
        mark: { n: "04", name: "The Objects" },
        heldLine: "the vintage rugs.",
        // The last brief, and the only one with no photograph after it, so
        // the copy carries the beat alone. Held: the headline keeps its
        // claim while the valet stand, the painting, and the clay pot go by
        // in the column.
        choreo: { pin: true },
      },
    },
    {
      id: "objects-text",
      type: "text",
      size: "subhead",
      content:
        "None of it came from one vendor or was ordered to spec. The brass valet stand is from an antique shop, and the rugs are vintage.",
    },
    {
      id: "objects-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The styling is personal because it is somebody's stuff: the denim jacket on the valet stand, the vintage rug fraying at one edge, the olive tree leaning toward the window. None of it got straightened up for the pictures.",
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "Made for\nthe morning.",
      pressing: { mark: { n: "05", name: "The Morning" } },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "The kitchen two rooms away is set up for a crowd. This is the room you're in before any of that starts.",
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
        "The shiplap walls and the wood ceiling carry over from the kitchen, and so does the sage. His vanity gets the same globe sconces as hers, plus an antique mirror and the brass valet stand.",
    },
  ],
};
