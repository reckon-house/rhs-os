import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/fairview-bedroom";

export const fairviewSuiteCaseStudy: CaseStudy = {
  slug: "fairview-suite",
  title: "The Fairview: Primary Suite",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "Hotel glam in a 600 square foot bedroom. Vaulted ceilings, crystal chandeliers, and charcoal violet walls balanced by floor-to-ceiling views of the property.",
  field: "Interior Design\nFinish Selection\nFurniture Curation",
  author: "Jeremy Prasatik",
  published: "2022",
  status: "Complete",
  classification: [
    "Interior Design",
    "Finish Selection",
    "Fixture Sourcing",
    "Furniture Curation",
  ],
  services: [
    "Interior Design",
    "Finish Selection",
    "Fixture Sourcing",
    "Furniture Curation",
  ],
  stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/fairview-suite-bedroom-chandelier-fireplace-windows-wide.jpg`,
      alt: "The Fairview primary suite, charcoal violet walls, crystal chandelier, cast stone fireplace, floor-to-ceiling windows",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "The Fairview\nPrimary Suite",
      subtitle:
        "Charcoal violet walls, crystal chandeliers, a hammered copper clawfoot tub. 600 square feet designed for mood.",
      field: "Interior Design  Finish Selection  Furniture Curation",
      author: "Jeremy Prasatik",
      published: "2022",
      status: "Complete",
      classification: [
        "Interior Design",
        "Finish Selection",
        "Fixture Sourcing",
        "Furniture Curation",
      ],
      abstract:
        "The suite was designed around a single question: what does a room feel like when everything in it commits to the same mood? Charcoal violet on every wall. Vaulted ceilings with exposed wood beams. Floor-to-ceiling steel-framed windows filling one wall with views of the property's tree canopy.\n\nThe material palette skews dark and warm. Velvet headboard, linen sofa, bouclé ottoman, faux fur throws. Brass accents at every furniture base and fixture. A cast stone fireplace anchoring the far wall. The layers stack without competing because the tonal range stays narrow. Blues, grays, warm metallics.\n\nThe ensuite continues through double doors. Charcoal hexagon tile from floor to ceiling. A hammered copper clawfoot tub beneath a crystal chandelier. Brass fixtures throughout. The bath earns the same commitment to atmosphere that the bedroom establishes.",
    },

    // ── THE ROOM — grouped ──
    {
      id: "room-header",
      type: "section-header",
      label: "SECTION 02: THE ROOM",
      title: "Vaulted Ceiling.\nViolet Walls.\nOne Mood.",
      group: { name: "room", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "room-text",
      type: "text",
      size: "subhead",
      content:
        "Paint color sets the tone for everything that follows. Charcoal violet on every vertical surface. Not gray. Not navy. A color that shifts between cool and warm depending on the light coming through those steel-framed windows.",
      group: { name: "room" },
    },
    {
      id: "room-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The vaulted ceiling peaks at fourteen feet. Exposed wood beams run the ridge line. A brass and crystal chandelier drops from the center, scaled large enough to hold the room without disappearing into the height. Below it, the furniture arranges in layers: bed against the window wall, sofa at the foot, swivel chair and ottoman in the reading corner, cast stone fireplace on the opposite wall.",
      group: { name: "room" },
    },

    // ── Room portraits ──
    {
      id: "room-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/fairview-suite-reading-nook-chair-ottoman-marble-table.jpg`,
        alt: "Reading corner, swivel chair with bouclé ottoman, marble pedestal table, charcoal violet walls",
      },
      right: {
        src: `${IMG}/fairview-suite-bedroom-chandelier-fireplace-slippers.jpg`,
        alt: "Primary suite, chandelier, cast stone fireplace, faux fur throw, leather slippers",
      },
    },

    // ── FURNITURE + MATERIALS ──
    {
      id: "furniture-header",
      type: "section-header",
      label: "SECTION 03: FURNITURE / MATERIALS",
      title: "Velvet. Bouclé.\nBrass. Marble.",
    },
    {
      id: "furniture-text",
      type: "text",
      size: "subhead",
      content:
        "The material mix leans glamorous but stays livable. Every piece selected for texture first, silhouette second. The room should feel like sinking in, not stepping into a photograph.",
    },
    {
      id: "furniture-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "A charcoal velvet sofa at the foot of the bed. A swivel chair with a brass base and channel tufting. A bouclé ottoman on turned legs. Faux fur throws layered across the bed. A solid marble pedestal side table. Brass hammered vessels on the floor. The individual pieces span three decades of design. Together they read as a collection, not a catalog order.",
    },

    // ── Full room shot ──
    {
      id: "room-full",
      type: "image",
      src: `${IMG}/fairview-suite-bedroom-sofa-chair-headboard-chandelier.jpg`,
      alt: "Primary suite, tufted headboard, sofa, swivel chair, crystal chandelier, charcoal violet walls",
      aspect: "native",
      padded: true,
    },

    // ── Detail pair ──
    {
      id: "furniture-detail-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/fairview-suite-detail-throw-chair-windows.jpg`,
        alt: "Textured throw draped across velvet chair, steel-frame windows, afternoon light",
      },
      right: {
        src: `${IMG}/fairview-suite-detail-marble-side-table-brass.jpg`,
        alt: "Marble pedestal side table, brass swivel chair base, charcoal velvet upholstery",
      },
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-mood",
      type: "editorial-headline",
      text: "Romantic, but with weight.\nGlam that earns the square footage.",
    },

    // ── ENSUITE HERO ──
    {
      id: "ensuite-hero",
      type: "hero",
      image: `${IMG}/fairview-suite-ensuite-doorway-copper-tub-chandelier.jpg`,
      alt: "View through double doors to ensuite, copper clawfoot tub, crystal chandelier, charcoal hex tile",
      inline: true,
    },

    // ── THE ENSUITE ──
    {
      id: "ensuite-header",
      type: "section-header",
      label: "SECTION 04: THE ENSUITE",
      title: "Copper Tub.\nCrystal Chandelier.\nHex Tile Floor to Ceiling.",
    },
    {
      id: "ensuite-text",
      type: "text",
      size: "subhead",
      content:
        "The ensuite opens through double doors off the bedroom. The mood doesn't break. Charcoal hexagon tile replaces the violet paint. A hammered copper clawfoot tub sits beneath a second crystal chandelier. Brass fixtures on every surface.",
    },
    {
      id: "ensuite-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The tub is the statement piece. Hammered copper interior, matte black exterior, cast iron claw feet. It faces the glass-enclosed shower through a half-wall of hex tile. The chandelier above it is smaller than the bedroom's but carries the same crystal-and-brass DNA. The tile runs every vertical surface from floor to ceiling, turning the wet area into a single material volume.",
    },

    // ── Bath details ──
    {
      id: "ensuite-detail-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/fairview-suite-detail-bath-chandelier-hex-tile.jpg`,
        alt: "Crystal chandelier suspended above charcoal hexagon tile in ensuite",
      },
      right: {
        src: `${IMG}/fairview-suite-detail-copper-clawfoot-tub-brass.jpg`,
        alt: "Hammered copper clawfoot tub with brass faucet, charcoal hex tile backdrop",
      },
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "600 Square Feet.\nOne Commitment.",
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "A suite that picks a mood and follows it through every surface, every fixture, every throw pillow. The bedroom and ensuite read as one continuous space with two registers.",
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Interior Design",
        "Finish Selection",
        "Fixture Sourcing",
        "Furniture Curation",
      ],
      stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
      links: [],
      content:
        "Charcoal violet in the bedroom. Charcoal hex in the bath. Crystal chandeliers in both. The tonal palette stays narrow enough that a copper tub and a bouclé ottoman can share a floor plan without either feeling out of place.\n\nThe room works because every piece commits to the same temperature. Warm metallics against cool walls. Soft textures against hard surfaces. Natural light pouring through steel frames onto dark paint. The tension between glam and grounded is what makes the space feel like a destination rather than a decorated room.",
    },
  ],
};
