import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/hill-country-kitchen";

export const hillCountryKitchenCaseStudy: CaseStudy = {
  slug: "hill-country-kitchen",
  title: "Hill Country Kitchen",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "A kitchen in the Texas Hill Country, built from four materials. | Sage green cabinetry, raw white oak, veined marble, unlacquered brass. New and vintage together, warm, inviting, and lived in.",
  field: "Interior Design\nKitchen Design\nMaterial Specification",
  author: "Jeremy Prasatik",
  published: "2023",
  status: "Complete",
  classification: [
    "Interior Design",
    "Kitchen Design",
    "Material Specification",
    "Custom Millwork",
  ],
  services: [
    "Interior Design",
    "Space Planning",
    "Material Specification",
    "Construction Documentation",
    "Fixture Selection",
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
        colors: ["#35412B", "#585D3E", "#C1B7A9", "#A99D8E", "#372810"],
        images: [
          "/case-studies/hill-country-kitchen/hill-country-kitchen-island-pendants-marble-wide.jpg",
          "/case-studies/hill-country-kitchen/hill-country-kitchen-glass-cabinet-clock-marble.jpg",
          "/case-studies/hill-country-kitchen/hill-country-kitchen-full-view-beams-runner-island.jpg",
          "/case-studies/hill-country-kitchen/hill-country-kitchen-sink-corner-shelves-marble.jpg",
          "/case-studies/hill-country-kitchen/hill-country-kitchen-pantry-wall-herringbone-pendant.jpg",
          "/case-studies/hill-country-kitchen/hill-country-kitchen-marble-backsplash-sink-detail.jpg",
          "/case-studies/hill-country-kitchen/hill-country-kitchen-range-stove-brass-knobs-marble.jpg",
          "/case-studies/hill-country-kitchen/hill-country-kitchen-faucet-range-marble-island-detail.jpg",
        ],
      },
      title: "Hill Country\nKitchen",
      subtitle:
        "A kitchen in the Texas Hill Country, built from four materials. | Sage green cabinetry, raw white oak, veined marble, unlacquered brass. New and vintage together, warm, inviting, and lived in.",
      field: "Interior Design  Kitchen Design  Material Specification",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Complete",
      classification: [
        "Interior Design",
        "Kitchen Design",
        "Material Specification",
        "Custom Millwork",
      ],
      summary: [
        { label: "Built", value: "Hill Country kitchen, ground up. Cabinetry, island, dining area, the full material spec." },
        { label: "Scope", value: "Interior design, space planning, fixture selection, construction documentation." },
        { label: "Materials", value: "Sage green, raw white oak, Calacatta marble, unlacquered brass." },
        { label: "Angle", value: "Pick four materials up front and use nothing else, so pieces from different eras can share a room." },
      ],
      abstract:
        "Four materials, picked before the first cabinet was drawn and used on every surface. Sage green on most of what you see, raw white oak for the warmth, Calacatta marble on the counters and the backsplash, unlacquered brass on the pulls, the knobs, and the faucet. Between them they cover every cabinet face, countertop, and piece of hardware in the room.\n\nThe mix of periods is on purpose. Shaker cabinet doors come out of traditional American kitchens, the steel-frame windows and open shelving are contemporary, the cremone bolts and schoolhouse pendants are European antique, and a turned-leg dining table sits with leather safari chairs. None of it comes from the same era. It reads as one room because all of it is in the same four finishes.\n\nThe kitchen is the hub of the house, used for cooking, gathering, and working in about equal measure. The island sits in the middle with open shelving at one end, seating at the other, and marble running the full length. Every decision came back to how a family uses a kitchen day to day.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hill-country-kitchen-island-pendants-marble-wide.jpg`,
      alt: "Hill Country kitchen, sage green cabinetry with marble backsplash, white oak island, brass pendants",
      pressing: { choreo: { rise: true } },
    },

    // ── THE MATERIAL SYSTEM — grouped ──
    {
      id: "material-header",
      type: "section-header",
      label: "SECTION 02: THE MATERIAL SYSTEM",
      // Jeremy, 2026-08-15: the materials led the design; say that, with
      // the materials as the subject rather than the drawings.
      title: "The materials came first.",
      pressing: {
        mark: { n: "02", name: "Materials First" },
        heldLine: "The room was drawn around them.",
        choreo: { pin: true },
      },
      group: { name: "materials", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "material-text",
      type: "text",
      size: "subhead",
      content:
        "No accent tile, no stainless pulls, no painted island. If it isn't sage, oak, marble, or brass, it isn't in the room.",
      group: { name: "materials" },
    },
    {
      id: "material-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Fewer materials and the room hangs together on its own, the same way fewer rules make a cleaner design system. With only four, each one has to do more of the work, and what you end up noticing is where they meet: oak against green, marble between the two, brass on all of it.",
      group: { name: "materials" },
    },
    {
      id: "material-columns",
      type: "three-column-text",
      columns: [
        {
          title: "Sage Green",
          content:
            "A muted sage with enough gray to keep it calm and enough green to keep it alive, on everything around the perimeter: base cabinets, uppers, the glass-front display, the range hood surround, the refrigerator panel, the pantry wall. It sits back a little so the marble and the brass get noticed first.\n\nThe finish is matte. Satin would have pushed the cabinets contemporary and gloss would have fought the raw oak. Matte lets the shaker profiles throw soft shadows.",
        },
        {
          title: "White Oak + Marble",
          content:
            "The island is raw white oak, unsealed, with the growth rings showing on the end grain of the open shelves. It is the warmest thing in the room.\n\nCalacatta marble runs the perimeter counters and the full backsplash behind the range, gray and gold veining on a warm white ground. It separates the green cabinets from the white walls, and where the oak meets the green, marble sits between them.",
        },
        {
          title: "Unlacquered Brass",
          content:
            "Cabinet pulls, the cremone bolts on the tall pantry doors, the bridge faucet, the pendants, the sconce arms, the range knobs and trim, all in the same brass. Even the bar stool frames pick up the tone.\n\nUnlacquered means it patinas. It darkens where hands go and stays bright where they don't, so the decorative bolts stay pale.",
        },
      ],
      group: { name: "materials" },
    },

    // ── GROUP 1: Cabinet details ──
    {
      id: "cabinet-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/hill-country-kitchen-glass-cabinet-clock-marble.jpg`,
        alt: "Glass-front cabinet with brass hardware, vintage clock, marble counter",
      },
      right: {
        src: `${IMG}/hill-country-kitchen-full-view-beams-runner-island.jpg`,
        alt: "Full kitchen view with exposed beams, runner rug, white oak island",
      },
    },
    {
      id: "cabinet-wide-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/hill-country-kitchen-sink-corner-shelves-marble.jpg`,
        alt: "Sink corner with open shelving, marble backsplash, brass faucet",
      },
      right: {
        src: `${IMG}/hill-country-kitchen-pantry-wall-herringbone-pendant.jpg`,
        alt: "Pantry wall with sage green cabinetry, herringbone floor, pendant light",
      },
      // Held so the marble wall climbs across it. Two cabinet elevations
      // at rest, then the finish that runs behind both of them.
      pressing: {
        captions: ["Sink corner\nOpen shelves", "Pantry wall, herringbone"],
        choreo: { pin: true },
      },
    },

    // ── HERO 2: Marble + sink — climbs across the held cabinet pair
    {
      id: "hero-marble",
      type: "hero",
      image: `${IMG}/hill-country-kitchen-marble-backsplash-sink-detail.jpg`,
      alt: "Marble backsplash detail with brass sconces, farmhouse sink, sage green cabinetry",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── CABINETRY & HARDWARE ──
    {
      id: "hardware-header",
      type: "section-header",
      label: "SECTION 03: CABINETRY / HARDWARE",
      title: "Shaker cabinets,",
      // The study's one crossing. Standalone rather than the brief form:
      // this is the only header here that carries no method columns, and
      // PRESSING.md §7 puts short-copy headers in the standalone staging.
      pressing: {
        mark: { n: "03", name: "Shaker Cabinets" },
        heldLine: "brass on everything you touch.",
        choreo: { crossing: true },
      },
    },
    {
      id: "hardware-text",
      type: "text",
      size: "subhead",
      content:
        "Floor to ceiling on three walls: base cabinets, glass-front uppers, a built-in hutch either side of the range, and full-height pantry doors that close with cremone bolts.",
    },
    {
      id: "hardware-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The cremone bolts are a French mechanism on American shaker doors in a Texas kitchen. They put a long vertical line on the tallest cabinet faces and give the pantry wall a presence a standard pull wouldn't, and one lever locks the door top and bottom at once.",
    },

    // ── GROUP 2: Range + details ──
    {
      id: "range-detail",
      type: "image",
      src: `${IMG}/hill-country-kitchen-range-stove-brass-knobs-marble.jpg`,
      alt: "Professional range with brass knobs, marble backsplash, sage green cabinetry",
      aspect: "native",
      padded: true,
      // Climbs the crossing above it. The crossing argues brass at every
      // touchpoint, so the range knobs arrive over the end of that line.
      pressing: { choreo: { rise: true } },
    },
    {
      id: "detail-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/hill-country-kitchen-faucet-range-marble-island-detail.jpg`,
        alt: "Bridge faucet and range detail, marble island countertop",
      },
      right: {
        src: `${IMG}/hill-country-kitchen-marble-vase-cabinet-vignette.jpg`,
        alt: "Marble counter vignette with dried arrangement, glass cabinet, brass hardware",
      },
      // Held so the bolt closeup climbs it. Two rooms-in-use frames at
      // rest, then the piece of hardware both of them are wearing.
      pressing: { choreo: { pin: true } },
    },
    {
      id: "hardware-closeup",
      type: "image",
      src: `${IMG}/hill-country-kitchen-brass-cremone-bolt-closeup.jpg`,
      alt: "Unlacquered brass cremone bolt detail on sage green cabinet door",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── PANTRY WALL ──
    {
      id: "pantry-hero",
      type: "hero",
      image: `${IMG}/hill-country-kitchen-pantry-fridge-pendant-window.jpg`,
      alt: "Pantry wall with sage green floor-to-ceiling cabinetry, stainless refrigerator, pendant light",
      inline: true,
      // The zoom. Floor-to-ceiling cabinetry is a full elevation, and the
      // four-finish palette the study opened with only reads as a system
      // when the whole wall is on screen at once.
      pressing: {
        plate: "03",
        captions: [
          "Pantry wall",
          "Floor-to-ceiling sage cabinetry",
          "Brass, oak, marble, sage",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-system",
      type: "editorial-headline",
      text: "Sage, oak, marble, brass,\nand that's it",
    },

    // ── MATERIAL INTERACTION CHART ──
    {
      id: "material-circos",
      type: "material-circos",
    },

    // ── THE ISLAND ──
    {
      id: "island-header",
      type: "section-header",
      label: "SECTION 04: THE ISLAND",
      title: "A raw white oak island",
      pressing: {
        mark: { n: "04", name: "Raw Oak Island" },
        heldLine: "for prep, meals, and homework.",
        choreo: { pin: true },
      },
    },
    {
      id: "island-text",
      type: "text",
      size: "subhead",
      content:
        "The marble top runs the full length, prep counter at one end and bar at the other with no break in between. Four stools with brass-tone frames tuck under the overhang.",
    },
    {
      id: "island-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Open shelves on the working end keep plates and bowls within reach of the dishwasher. A firewood cubby at the base ties the kitchen to the rest of the property.",
    },
    {
      id: "island-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Oak Choice",
          content:
            "White oak, no stain and no polyurethane, just a penetrating oil finish. The grain stays open and the color goes from pale honey to a deeper amber over years of use.\n\nRaw wood in a kitchen was the riskiest call of the whole spec. It is meant to age. The island should look used: water rings, knife marks, flour in the grain.",
        },
        {
          title: "Where It Sits",
          content:
            "Centered, with space to walk on all four sides, and the first thing you see from the entry. Eight feet of usable counter, with the open shelving facing the dining side.\n\nEvery sight line in the kitchen crosses it. From the range you look over it to the windows; from the dining table you look through it to the backsplash. The oak breaks up all that green and marble around the perimeter and gives your eye somewhere warm to land.",
        },
        {
          title: "On Legs",
          content:
            "The island has legs, visible ones, with open shelving between them, and that is what makes it read as furniture instead of a built-in. The cabinets around the walls are architecture and the island is a table.\n\nPeople treat furniture differently. Guests lean on it, sit around it, set things down on it without asking. A solid-panel island with a granite overhang would keep them at arm's length.",
        },
      ],
    },

    // ── BRASS DETAIL ──
    {
      id: "brass-hero",
      type: "image",
      src: `${IMG}/hill-country-kitchen-brass-cremone-bolt-cabinet-detail.jpg`,
      alt: "Brass cremone bolt and cabinet hardware detail on sage green panels",
      aspect: "native",
      padded: true,
      // Climbs the island brief. A 2220px file, so it rises rather than
      // zooms: at full mat width the bolt would go soft.
      pressing: { choreo: { rise: true } },
    },

    // ── HERO 3: Wide dining ──
    {
      id: "hero-dining",
      type: "hero",
      image: `${IMG}/hill-country-kitchen-wide-dining-island-windows.jpg`,
      alt: "Full kitchen view with dining table, island, sage green cabinetry, steel-frame windows",
      inline: true,
      // The second zoom, and the handover into the dining section. This is
      // the only frame holding both zones at once, so the four finishes
      // read as one system here or nowhere. 3080px carries the full mat.
      pressing: {
        plate: "04",
        captions: [
          "The whole room",
          "Dining table to range wall",
          "Both zones, one frame",
        ],
        choreo: { zoom: true },
      },
    },

    // ── THE DINING ZONE ──
    {
      id: "dining-header",
      type: "section-header",
      label: "SECTION 05: THE DINING ZONE",
      title: "A turned-leg table,",
      pressing: {
        mark: { n: "05", name: "The Dining Table" },
        heldLine: "leather safari chairs.",
        choreo: { pin: true },
      },
    },
    {
      id: "dining-text",
      type: "text",
      size: "subhead",
      content:
        "The dining end shares the open room but goes deeper in tone: a dark-stained table against the light oak and green of the kitchen. The switch is abrupt on purpose.",
    },
    {
      id: "dining-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The safari chairs are leather on oak frames. The leather picks up the warmth of the brass and the oak goes with the island. A dark patterned rug sits under the whole group and marks it off from the kitchen floor.",
    },

    // ── DINING DETAILS ──
    {
      id: "dining-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/hill-country-kitchen-dining-table-leg-rug-detail.jpg`,
        alt: "Dining table turned leg detail on dark patterned rug",
      },
      right: {
        src: `${IMG}/hill-country-kitchen-dining-chair-leather-detail.jpg`,
        alt: "Safari dining chair, leather back, natural oak frame",
      },
      // Held so the assembled table climbs it. Leg and chair studied
      // separately, then the group they add up to.
      pressing: { choreo: { pin: true } },
    },
    {
      id: "dining-full",
      type: "image",
      src: `${IMG}/hill-country-kitchen-dining-table-chairs-full.jpg`,
      alt: "Full dining table with leather safari chairs on dark patterned rug",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── COLOR SPECTRUM CHART ──
    {
      id: "kitchen-palette",
      type: "kitchen-palette",
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-room",
      type: "editorial-headline",
      text: "A year in, the brass shows\nwhich drawers get used",
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "Where everyone",
      pressing: {
        mark: { n: "06", name: "The Hub" },
        heldLine: "ends up.",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Cooking turns into gathering turns into working, and nothing in the room is set aside for one job.",
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Interior Design",
        "Space Planning",
        "Material Specification",
        "Construction Documentation",
        "Fixture Selection",
      ],
      stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
      links: [],
      content:
        "Sage green on the vertical planes, marble on the horizontal ones, oak in the middle, brass on the hardware. The island handles prep, serving, and seating at the same time, and the dining table sits close enough to stay in the conversation and far enough off to feel like its own place.",
    },
  ],
};
