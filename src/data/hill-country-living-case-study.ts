import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/hill-country-living";

export const hillCountryLivingCaseStudy: CaseStudy = {
  slug: "hill-country-living",
  title: "Hill Country Residence: Livingroom.",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "Floor-to-ceiling limestone fireplace wall, reclaimed pine, and mid-century furniture mixed with Western details. Collected pieces alongside new. Considered, not curated.",
  field: "Interior Design\nFurniture Curation\nArt Selection\nFixture Sourcing",
  author: "Jeremy Prasatik",
  published: "2023",
  status: "Built",
  classification: [
    "Interior Design",
    "Furniture Curation",
    "Art Selection",
    "Fixture Sourcing",
  ],
  services: [
    "Interior Design",
    "Furniture Curation",
    "Art Selection",
    "Fixture Sourcing",
  ],
  stack: ["AutoCAD", "SketchUp", "Material specification"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hero1.jpg`,
      alt: "Hill Country Residence living room: floor-to-ceiling limestone fireplace wall, cognac leather sofa with Navajo-style throw, tweed armchairs, leather bench with sheepskin, brass pendant chandelier, reclaimed pine floors",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Hill Country Residence\nLivingroom.",
      subtitle:
        "Floor-to-ceiling limestone fireplace wall, reclaimed pine, and mid-century furniture mixed with Western details. Collected pieces alongside new. Considered, not curated.",
      field: "Interior Design  Furniture Curation  Art Selection  Fixture Sourcing",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Built",
      classification: [
        "Interior Design",
        "Furniture Curation",
        "Art Selection",
        "Fixture Sourcing",
      ],
      abstract:
        "The living room sits at the center of the house, open to the kitchen and framed by the limestone fireplace wall. The material palette carries through from the rest of the home: reclaimed 1950s pine floors, exposed wood beams, brass fixtures.\n\nFurniture blends mid-century silhouettes with textiles that lean Western. Cognac leather sofa with wood frame. Tweed armchairs. A Navajo-style throw. The mix is intentional but not matched. Each piece chosen individually rather than ordered as a set.\n\nArt on the stone wall includes an original painting by Dwight D. Eisenhower alongside landscape pieces in gilded frames. Family heirlooms sit next to new finds. The fireplace is used. The sheepskin under the bench is soft. The room has texture across the full range.\n\nLived in, not staged.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — MATERIAL & PALETTE
    // ════════════════════════════════════════
    {
      id: "material-header",
      type: "section-header",
      label: "SECTION 02: MATERIAL",
      title: "Stone, Pine,\nBrass, Leather.",
    },
    {
      id: "material-subhead",
      type: "text",
      size: "subhead",
      content:
        "The material palette carries through from the rest of the home. Four core textures, none competing for attention.",
    },
    {
      id: "material-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Floor-to-ceiling limestone on the fireplace wall. Reclaimed 1950s pine underfoot and overhead as exposed beams. Brass fixtures throughout. Cognac leather on the sofa and bench seats. The walls and ceiling stay quiet so the texture has room to register.",
    },

    // Symmetrical fireplace wall — every key material in one frame
    {
      id: "material-fireplace",
      type: "image",
      src: `${IMG}/hero2.jpg`,
      alt: "Symmetrical centered view of the limestone fireplace wall with the Eisenhower painting flanked by smaller landscape pieces in gilded frames, oak mantel beam, brass pendant chandelier overhead, cognac leather sofa with Navajo-style throw in foreground",
      aspect: "native",
      padded: true,
    },

    // 2-up: stone-wall vertical details (the 2x22 pair)
    {
      id: "material-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/2x22/Reckonhousestaples12.jpg`,
        alt: "Vertical detail of the limestone wall with the ladder shelf holding a vintage globe, brass fireplace tools below, and the corner of a tweed armchair",
      },
      right: {
        src: `${IMG}/2x22/Reckonhousestaples26.jpg`,
        alt: "Vertical detail of the limestone wall, the Eisenhower painting and a smaller landscape framed in gilt, mid-century record-player shelf below, brass pendant chandelier overhead, edge of the gray sofa in the foreground",
      },
    },

    // ── Inline hero: open-to-kitchen architectural view
    {
      id: "architectural-hero",
      type: "hero",
      image: `${IMG}/hero3.jpg`,
      alt: "View from the living room into the open kitchen beyond: cognac leather sofa with pampas and textured pillows in the foreground, exposed wood beams overhead, green cabinetry and marble counters in the kitchen behind",
      inline: true,
    },

    // ════════════════════════════════════════
    // SECTION 03 — COLLECTED
    // ════════════════════════════════════════
    {
      id: "collected-header",
      type: "section-header",
      label: "SECTION 03: COLLECTED",
      title: "Considered,\nNot Curated.",
    },
    {
      id: "collected-subhead",
      type: "text",
      size: "subhead",
      content:
        "Furniture blends mid-century silhouettes with Western details. Each piece chosen individually, not ordered as a set.",
    },
    {
      id: "collected-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "An original Eisenhower painting alongside landscape pieces in gilded frames. Family heirlooms next to new finds. A Navajo-style throw over the sofa, vinyl records on the shelf, a sheepskin under the bench. The room collects rather than coordinates.",
    },

    // 2-up: tweed armchairs in two settings (the 2x23 pair)
    {
      id: "collected-armchairs",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/2x23/Reckonhousestaples25.jpg`,
        alt: "Vertical view of the limestone fireplace with the Eisenhower painting and a small landscape, tweed armchair beside it, ladder shelf with ceramic vessels, dark patterned vintage rug",
      },
      right: {
        src: `${IMG}/2x23/Reckonhousestaples27.jpg`,
        alt: "Two tweed armchairs facing each other in front of a tall window looking out to the Hill Country landscape, leather stool between them, vintage patterned rug underfoot",
      },
    },

    // 2-up: entry vignette + sofa detail (the 2x2 pair)
    {
      id: "collected-vignettes",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/2x2/Mask group.jpg`,
        alt: "Entry vignette in an adjacent room: leather-strapped oval mirror, wood cutting board on the wall, small framed art, wood console table with crystal lamp, plaid throw and wicker basket beneath",
      },
      right: {
        src: `${IMG}/2x2/Mask group-1.jpg`,
        alt: "Tight detail of the cognac leather sofa with checkered pillow and pampas in a wood vase set in a black wood bowl on the coffee table, view through to the kitchen behind",
      },
    },

    // Single: record-player + Eisenhower detail (personality closer for collected section)
    {
      id: "collected-recordplayer",
      type: "image",
      src: `${IMG}/Reckonhousestaples21.jpg`,
      alt: "Tight detail of the mid-century record-player shelf against the limestone wall, vinyl records below including Sturgill Simpson and ZZ Top, cactus and small framed landscape painting to the side, edge of the Eisenhower painting visible above",
      aspect: "native",
      padded: true,
    },

    // ── Editorial palate cleanser
    {
      id: "headline-livedin",
      type: "editorial-headline",
      text: "Lived in,\nnot staged",
    },

    // ════════════════════════════════════════
    // SECTION 04 — MARKS & MATERIALS
    // (Interior take on the standard pattern: shapes-as-fonts becomes
    // materials-as-fonts. Five materials carry the room.)
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 04: MARKS & MATERIALS",
      title: "Five Materials\nHolding One Room.",
      introText:
        "The room runs on five materials, each chosen for how it ages. Limestone, pine, leather, tweed, brass. Nothing chasing trend, nothing afraid of wear.",
      philosophyTitle: "Material philosophy",
      philosophyText:
        "The material palette is the design. Color goes in through what the materials already are, not through accents. Limestone takes light without bouncing it. Pine warms underfoot. Cognac leather darkens with use. Tweed reads soft from a distance, structured up close. Brass develops a patina nobody plans for.\n\nEvery piece in the room is allowed to age. Nothing is precious, nothing is protected. The fireplace is used. The records get played. The sheepskin moves around.",
      colors: [
        { name: "Limestone Cream", hex: "#E5DDC9", description: "Fireplace wall, paint" },
        { name: "Reclaimed Pine", hex: "#9B6F47", description: "Floors, beams, mantel" },
        { name: "Cognac Leather", hex: "#8B4F32", description: "Sofa, bench seat" },
        { name: "Charcoal Tweed", hex: "#4A4540", description: "Armchairs, throws" },
        { name: "Antiqued Brass", hex: "#A87A45", description: "Pendant, fixtures, andirons" },
      ],
      fonts: [
        {
          name: "Limestone",
          role: "Fireplace wall",
          description:
            "Floor-to-ceiling cut limestone. The structural anchor of the room and the only material that goes that big. Takes light without bouncing it back so the art reads at every hour.",
          family: "'Caslon', 'Adobe Caslon Pro', 'Garamond', serif",
          weight: 400,
        },
        {
          name: "Reclaimed Pine",
          role: "Floors, beams, mantel",
          description:
            "1950s pine repurposed. The same grain runs underfoot, overhead in the exposed beams, and across the mantel beam pulled over the stone. One material doing three jobs ties the room to itself.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 400,
        },
        {
          name: "Cognac Leather",
          role: "Sofa, bench seat",
          description:
            "Aniline-finish leather that darkens unevenly with use. The room reads warmer every year because the seating earns it.",
          family: "'Didot', 'Bodoni 72', 'Caslon', serif",
          weight: 400,
        },
        {
          name: "Charcoal Tweed",
          role: "Armchairs, throws",
          description:
            "Tweed in mid-century chair frames. Soft from a distance, structured up close. The textile leans Western without being literal about it.",
          family: "'Avenir Next', system-ui, sans-serif",
          weight: 600,
        },
        {
          name: "Antiqued Brass",
          role: "Pendant, fixtures, andirons",
          description:
            "Brass through the room from the pendant chandelier to the fireplace tools to the candlesticks. Develops the patina the room earns rather than the polish it imposes.",
          family: "'Didot', 'Bodoni 72', 'Caslon', serif",
          weight: 400,
        },
      ],
      markImage: `${IMG}/hero2.jpg`,
      markAlt: "Symmetrical centered view of the limestone fireplace wall: Eisenhower painting flanked by landscape pieces, brass pendant chandelier overhead, cognac leather sofa with Navajo-style throw, every material in one frame",
      markFullBleed: true,
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "A Room You\nLive In.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Used for the fire, the records, the conversation. Built to take ten years of family without looking different than it does today.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Interior Design", "Furniture Curation", "Art Selection", "Fixture Sourcing"],
      stack: ["AutoCAD", "SketchUp", "Material specification"],
      links: [],
      content:
        "Limestone fireplace wall, reclaimed pine floors, mid-century chairs in tweed, a cognac leather sofa with a Navajo-style throw. Personal art on the stone wall. Lived in, not staged.",
    },
  ],
};
