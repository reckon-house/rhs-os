import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/fairview-bedroom";

export const fairviewSuiteCaseStudy: CaseStudy = {
  slug: "fairview-suite",
  title: "The Fairview: Primary Suite",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "The Fairview suite, bedroom and bath, 600 square feet. | Charcoal violet walls, crystal chandeliers, a hammered copper clawfoot tub, all of it committed to one mood.",
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
  style: "pressing",
  sections: [
    // ── META ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 8 frames",
        colors: ["#282923", "#58635A", "#3D4039", "#565C48", "#657765"],
        images: [
          "/case-studies/fairview-bedroom/fairview-suite-bedroom-chandelier-fireplace-windows-wide.jpg",
          "/case-studies/fairview-bedroom/fairview-suite-reading-nook-chair-ottoman-marble-table.jpg",
          "/case-studies/fairview-bedroom/fairview-suite-bedroom-chandelier-fireplace-slippers.jpg",
          "/case-studies/fairview-bedroom/fairview-suite-bedroom-sofa-chair-headboard-chandelier.jpg",
          "/case-studies/fairview-bedroom/fairview-suite-detail-throw-chair-windows.jpg",
          "/case-studies/fairview-bedroom/fairview-suite-detail-marble-side-table-brass.jpg",
          "/case-studies/fairview-bedroom/fairview-suite-ensuite-doorway-copper-tub-chandelier.jpg",
          "/case-studies/fairview-bedroom/fairview-suite-detail-bath-chandelier-hex-tile.jpg",
        ],
      },
      title: "The Fairview\nPrimary Suite",
      subtitle:
        "The Fairview suite, bedroom and bath, 600 square feet. | Charcoal violet walls, crystal chandeliers, a hammered copper clawfoot tub, all of it committed to one mood.",
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
      summary: [
        { label: "Built", value: "600 sq ft primary suite and ensuite, vaulted to fourteen feet" },
        { label: "Scope", value: "Interior design, finish selection, fixture sourcing, furniture curation" },
        { label: "Materials", value: "Charcoal violet walls, velvet, bouclé, brass, hammered copper tub, charcoal hex tile" },
        { label: "Angle", value: "Dark and warm in the bedroom, and the bath keeps it going." },
      ],
      abstract:
        "The suite commits to one mood and follows it through every surface. Charcoal violet on every wall, a vaulted ceiling with exposed wood beams, and floor-to-ceiling steel-framed windows looking out onto the property's tree canopy.\n\nThe palette is dark and warm. A velvet headboard, a linen sofa, a bouclé ottoman, faux fur throws, brass at every furniture base and fixture, and a cast stone fireplace on the far wall. The layers work together because the tonal range stays narrow: blues, grays, warm metals.\n\nThe ensuite continues through double doors, with charcoal hexagon tile floor to ceiling, a hammered copper clawfoot tub under a crystal chandelier, and brass fixtures throughout. It picks up where the bedroom leaves off.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/fairview-suite-bedroom-chandelier-fireplace-windows-wide.jpg`,
      alt: "The Fairview primary suite, charcoal violet walls, crystal chandelier, cast stone fireplace, floor-to-ceiling windows",
      pressing: { choreo: { rise: true } },
    },

    // ── THE ROOM — grouped ──
    {
      id: "room-header",
      type: "section-header",
      label: "SECTION 02: THE ROOM",
      title: "One color",
      pressing: {
        mark: { n: "02", name: "One Color" },
        heldLine: "on every wall.",
        // The headline is the whole claim of the section, so it holds while
        // the column travels up beside it. Paint first, then the fourteen
        // foot vault and the furniture layers arriving under it as evidence.
        choreo: { pin: true },
      },
      group: { name: "room", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "room-text",
      type: "text",
      size: "subhead",
      content:
        "The color shifts between cool and warm with the light through the steel-framed windows. Everything else in the room was chosen to go with it.",
      group: { name: "room" },
    },
    {
      id: "room-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The vaulted ceiling peaks at fourteen feet, with exposed wood beams along the ridge. The brass and crystal chandelier is scaled big enough that it doesn't get lost up there. Below it: bed against the window wall, sofa at the foot of the bed, swivel chair and ottoman in the reading corner, cast stone fireplace on the opposite wall.",
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
      title: "Three decades",
      // This study's one crossing, on its MIDDLE header. The three Fairview
      // rooms cross at three different points — entry first, sitting
      // second, suite third — so the set never reads as one template.
      pressing: {
        mark: { n: "03", name: "Three Decades" },
        heldLine: "on one floor.",
        // `pin` alongside `crossing`: the crossing already holds its headline
        // for 220dvh, so the flag changes nothing on the page. Saying it in
        // the data names the hold, which is what the audit reads.
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "furniture-text",
      type: "text",
      size: "subhead",
      content:
        "Every piece was picked for texture first and shape second. It leans glamorous and it is still a room you can live in.",
    },
    {
      id: "furniture-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "A charcoal velvet sofa at the foot of the bed. A swivel chair with a brass base and channel tufting, a bouclé ottoman on turned legs, faux fur throws across the bed, a solid marble pedestal side table, hammered brass vessels on the floor. Together they read as collected over years.",
    },

    // ── Detail pair — held so the full room can climb across it. Moved
    // ahead of room-full for the adjacency the climb requires; the section
    // reads better this way too, since the details are what the wide shot
    // is then asked to account for.
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
      pressing: {
        captions: ["Throw and velvet chair\nSteel-frame windows", "Marble side table, brass"],
        choreo: { pin: true },
      },
    },

    // ── The room entire — climbs across the held details
    {
      id: "room-full",
      type: "image",
      src: `${IMG}/fairview-suite-bedroom-sofa-chair-headboard-chandelier.jpg`,
      alt: "Primary suite, tufted headboard, sofa, swivel chair, crystal chandelier, charcoal violet walls",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-mood",
      type: "editorial-headline",
      text: "The kind of room\nyou sink into",
    },

    // ── ENSUITE HERO ──
    {
      id: "ensuite-hero",
      type: "hero",
      image: `${IMG}/fairview-suite-ensuite-doorway-copper-tub-chandelier.jpg`,
      alt: "View through double doors to ensuite, copper clawfoot tub, crystal chandelier, charcoal hex tile",
      inline: true,
      // The zoom. A view THROUGH a doorway is the one composition where
      // filling the mat changes what you can see — the second room arrives
      // at the size the doorway was promising.
      pressing: {
        plate: "04",
        captions: [
          "Through the double doors",
          "Copper clawfoot tub",
          "Charcoal hex tile",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── THE ENSUITE ──
    {
      id: "ensuite-header",
      type: "section-header",
      label: "SECTION 04: THE ENSUITE",
      title: "Through the double doors,",
      pressing: {
        mark: { n: "04", name: "The Ensuite" },
        heldLine: "the same temperature.",
        // Held because the zoom just handed the second room over at full
        // size. Keeping the headline put while the tile and tub copy runs
        // past it reads as one suite continuing, not a new study starting.
        choreo: { pin: true },
      },
    },
    {
      id: "ensuite-text",
      type: "text",
      size: "subhead",
      content:
        "Charcoal hexagon tile takes over from the violet paint. A hammered copper clawfoot tub sits under a second crystal chandelier, and every fixture is brass.",
    },
    {
      id: "ensuite-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The tub has a hammered copper inside, a matte black outside, and cast iron claw feet. It faces the glass shower across a half-wall of hex tile. The chandelier over it is smaller than the bedroom's and from the same family, and the tile runs floor to ceiling on every wall of the wet area.",
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
      title: "Charcoal violet,\ncharcoal hex.",
      pressing: { mark: { n: "05", name: "Two Rooms" } },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Crystal chandeliers in both rooms, and a palette narrow enough that a copper tub and a bouclé ottoman share a floor plan and neither looks out of place.",
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
        "Blues, grays, and warm metal, from the velvet headboard to the claw feet on the tub.",
    },
  ],
};
