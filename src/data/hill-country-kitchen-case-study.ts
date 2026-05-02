import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/hill-country-kitchen";

export const hillCountryKitchenCaseStudy: CaseStudy = {
  slug: "hill-country-kitchen",
  title: "Hill Country Kitchen",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "A ground-up kitchen built on material tension. Sage green cabinetry, raw white oak, veined marble, unlacquered brass. Four finishes that shouldn't work together until they do.",
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
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hill-country-kitchen-island-pendants-marble-wide.jpg`,
      alt: "Hill Country kitchen, sage green cabinetry with marble backsplash, white oak island, brass pendants",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Hill Country\nKitchen",
      subtitle:
        "Four materials applied across every surface, fixture, and finish - a unified system where vintage warmth meets modern precision.",
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
      abstract:
        "A kitchen designed the way a product gets designed. The material palette is the design system - sage green setting the dominant surface, raw white oak providing the warm counterpoint, Calacatta marble handling the work surfaces and backsplash, unlacquered brass connecting every touchpoint. Four finishes applied consistently across every cabinet face, countertop, and piece of hardware in the room.\n\nThe style mixing is deliberate. Shaker-profile cabinet doors reference traditional American kitchens, steel-frame windows and open shelving pull contemporary, cremone bolts and schoolhouse pendants read European antique, and a turned-leg dining table sits against leather safari chairs. None of these elements belong to the same era - they belong to the same room because the material palette holds them together.\n\nThe space functions as the central hub of a Texas Hill Country home, used for cooking, gathering, and working in roughly equal measure. The island anchors the room, with open shelving at one end, seating at the other, and a marble work surface running the full length. Every decision was made for how a family actually uses a kitchen, not how one photographs.",
    },

    // ── THE MATERIAL SYSTEM — grouped ──
    {
      id: "material-header",
      type: "section-header",
      label: "SECTION 02: THE MATERIAL SYSTEM",
      title: "A Four-Finish Palette\nLocked Before Drawing.",
      group: { name: "materials", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "material-text",
      type: "text",
      size: "subhead",
      content:
        "The palette was locked before a single cabinet got drawn. Sage green, white oak, Calacatta marble, unlacquered brass - every specification traces back to one of these four, with no accent materials, no tile backsplash, no stainless pulls, no painted island.",
      group: { name: "materials" },
    },
    {
      id: "material-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Constraint at the material level works the same way it works in any design system - fewer variables means stronger cohesion. A room with twelve finishes reads as decorated, a room with four reads as designed. The limitation forced every surface to carry more visual weight, and the relationships between materials became the entire aesthetic.",
      group: { name: "materials" },
    },
    {
      id: "material-columns",
      type: "three-column-text",
      columns: [
        {
          title: "Sage Green",
          content:
            "The cabinet color sets the room's identity. A muted sage with enough gray to read sophisticated, enough green to read alive, applied floor to ceiling on the perimeter: base cabinets, uppers, glass-front display, the range hood surround, the refrigerator panel, the pantry wall. The color doesn't compete with the marble or the brass - it recedes just enough to let the textures work.\n\nThe finish is matte. Satin would have pushed the cabinets toward contemporary and gloss would have fought the raw oak, but matte lets the shaker profiles cast soft shadows and keeps the room feeling grounded rather than polished.",
        },
        {
          title: "White Oak + Marble",
          content:
            "The island is raw white oak, unsealed, with the grain visible and the end-grain on the open shelving showing the growth rings. This is the warmest element in the room and the most honest one - it ages, darkens, and marks, which is the point.\n\nCalacatta marble runs the perimeter countertops and the full backsplash behind the range. Gray and gold veining against a warm white base. The marble does the visual work of separating the green cabinetry from the white walls - the transition material. Where oak meets green, marble mediates.",
        },
        {
          title: "Unlacquered Brass",
          content:
            "Every metal touchpoint is the same finish - cabinet pulls, cremone bolts on the tall pantry doors, the bridge faucet, pendant light fixtures, sconce arms, range knobs and trim. Even the bar stool frames pick up the brass tone.\n\nUnlacquered means the brass patinas. It darkens at the touchpoints and stays bright where hands don't reach, so after a year the hardware tells you exactly how the kitchen gets used. The pulls on the most-opened drawers develop the deepest color while the decorative bolts stay pale. Functional archaeology built into the material choice.",
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
    },

    // ── HERO 2: Marble + sink ──
    {
      id: "hero-marble",
      type: "hero",
      image: `${IMG}/hill-country-kitchen-marble-backsplash-sink-detail.jpg`,
      alt: "Marble backsplash detail with brass sconces, farmhouse sink, sage green cabinetry",
      inline: true,
    },

    // ── CABINETRY & HARDWARE ──
    {
      id: "hardware-header",
      type: "section-header",
      label: "SECTION 03: CABINETRY / HARDWARE",
      title: "Shaker Cabinets,\nBrass at Every Touchpoint.",
    },
    {
      id: "hardware-text",
      type: "text",
      size: "subhead",
      content:
        "The cabinet program runs floor to ceiling on three walls. Base cabinets, upper glass-fronts, a built-in hutch flanking the range, full-height pantry storage with cremone bolt closures. The same sage green, the same shaker profile, the same brass hardware throughout. Repetition is the system.",
    },
    {
      id: "hardware-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Cremone bolts on the tall pantry doors are the signature hardware choice. A French mechanism on American shaker cabinets in a Texas kitchen. The style collision is intentional. The bolts add vertical visual interest to the tallest cabinet faces and give the pantry wall architectural presence that standard pulls would miss. They also function well. A single lever locks top and bottom simultaneously.",
    },

    // ── GROUP 2: Range + details ──
    {
      id: "range-detail",
      type: "image",
      src: `${IMG}/hill-country-kitchen-range-stove-brass-knobs-marble.jpg`,
      alt: "Professional range with brass knobs, marble backsplash, sage green cabinetry",
      aspect: "native",
      padded: true,
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
    },
    {
      id: "hardware-closeup",
      type: "image",
      src: `${IMG}/hill-country-kitchen-brass-cremone-bolt-closeup.jpg`,
      alt: "Unlacquered brass cremone bolt detail on sage green cabinet door",
      aspect: "native",
      padded: true,
    },

    // ── PANTRY WALL ──
    {
      id: "pantry-hero",
      type: "hero",
      image: `${IMG}/hill-country-kitchen-pantry-fridge-pendant-window.jpg`,
      alt: "Pantry wall with sage green floor-to-ceiling cabinetry, stainless refrigerator, pendant light",
      inline: true,
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-system",
      type: "editorial-headline",
      text: "The constraint became\nthe entire aesthetic",
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
      title: "Raw Oak Anchoring\nthe Whole Room.",
    },
    {
      id: "island-text",
      type: "text",
      size: "subhead",
      content:
        "The island is the primary interaction surface for prep, cooking, eating, gathering, and homework. It needed to handle all of it without looking like it was trying to. Raw white oak solved the problem.",
    },
    {
      id: "island-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Open shelving on the working end holds plates and bowls within arm's reach of the dishwasher. A firewood cubby at the base adds texture and signals that this kitchen connects to the rest of the property. The marble top runs the full length, transitioning from food prep surface to bar seating without a material break. Four bar stools with brass-tone frames tuck under the overhang. The island reads as furniture rather than cabinetry. That distinction matters. Furniture invites interaction. Cabinetry stores things.",
    },
    {
      id: "island-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Oak Choice",
          content:
            "White oak with no stain and no polyurethane seal, just a penetrating oil finish that lets the wood breathe and develop character over time. The grain stays open and the color will shift from pale honey to deeper amber across years of use.\n\nThis was the riskiest material call in the kitchen. Raw wood in a wet environment invites concern, but the response was that this is Texas Hill Country, not a showroom. The island should look used - water rings, knife marks, flour dust in the grain. The patina is the design intent.",
        },
        {
          title: "Spatial Anchor",
          content:
            "The island sits centered in the room with circulation on all four sides. It's the first thing visible from the entry. The scale is generous. Eight feet of usable counter, open shelving visible from the dining side, seating for four on the bar side.\n\nEvery sight line in the kitchen crosses the island. From the range, you look over it to the windows. From the dining table, you look through it to the backsplash. The oak breaks up the green-and-marble perimeter and gives the eye a warm landing point at the center of every view.",
        },
        {
          title: "Furniture vs. Cabinetry",
          content:
            "The island has legs - visible legs with open shelving between them - and that's the detail that makes it read as a freestanding piece rather than a built-in. The perimeter cabinets are architecture, and the island is furniture.\n\nThat distinction changes how people approach it. Guests lean on furniture, they sit around it, they set things on it without asking. A cabinet island with solid panels and a granite overhang creates a barrier, while an oak table with open shelves creates an invitation.",
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
    },

    // ── HERO 3: Wide dining ──
    {
      id: "hero-dining",
      type: "hero",
      image: `${IMG}/hill-country-kitchen-wide-dining-island-windows.jpg`,
      alt: "Full kitchen view with dining table, island, sage green cabinetry, steel-frame windows",
      inline: true,
    },

    // ── THE DINING ZONE ──
    {
      id: "dining-header",
      type: "section-header",
      label: "SECTION 05: THE DINING ZONE",
      title: "A Dining Zone Borrowing\nfrom the Same Vocabulary.",
    },
    {
      id: "dining-text",
      type: "text",
      size: "subhead",
      content:
        "The dining area occupies the same open room but reads as its own zone, with a dark-stained turned-leg table set against the light oak and green of the kitchen. The material shift is abrupt and intentional - a different activity asking for a different material mood.",
    },
    {
      id: "dining-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Leather-and-oak safari chairs surround the table. The leather picks up the brass warmth. The oak frames reference the island wood. A dark patterned rug grounds the furniture group and separates it visually from the kitchen's hardwood floor. The dining zone borrows from the kitchen's vocabulary but speaks at a lower volume. Darker, quieter, more contained.",
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
    },
    {
      id: "dining-full",
      type: "image",
      src: `${IMG}/hill-country-kitchen-dining-table-chairs-full.jpg`,
      alt: "Full dining table with leather safari chairs on dark patterned rug",
      aspect: "native",
      padded: true,
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
      text: "Designed the way\na product gets designed.",
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "Systems Thinking\nApplied to a Room",
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "A kitchen where every specification traces back to the same four-material palette. The room holds together because the system holds together.",
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
        "The same discipline that makes a digital design system work makes a room work. Limit the variables, define the relationships between elements, apply them consistently, and let the constraints generate the aesthetic rather than fight against them.\n\nFour materials, repeated across every surface - sage green on the vertical planes, marble on the horizontal, oak at the center, brass at every point of contact. The style mixing of shaker cabinets next to steel windows next to French hardware holds together because the material system holds together.\n\nThe kitchen functions as a hub. Cooking flows into gathering flows into working flows into eating, and the spatial plan supports all of it without dedicated zones that go unused half the day. The island handles prep, serving, and seating simultaneously, and the dining table sits close enough to stay connected and far enough to feel separate. UX for a room.",
    },
  ],
};
