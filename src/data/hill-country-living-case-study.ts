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
  style: "pressing",
  sections: [
    // ── META ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 8 frames",
        colors: ["#E5DDC9", "#9B6F47", "#8B4F32", "#4A4540", "#A87A45"],
        images: [
          "/case-studies/hill-country-living/hill-country-living-cognac-leather-sofa-tweed-armchairs-limestone-fireplace-pendant-chandelier-wide.jpg",
          "/case-studies/hill-country-living/hill-country-living-limestone-fireplace-eisenhower-painting-navajo-throw-cognac-sofa-symmetry.jpg",
          "/case-studies/hill-country-living/hill-country-living-limestone-ladder-shelf-vintage-globe-brass-fireplace-tools-tweed-detail.jpg",
          "/case-studies/hill-country-living/hill-country-living-limestone-eisenhower-record-player-gray-sofa-pendant-chandelier-vertical.jpg",
          "/case-studies/hill-country-living/hill-country-living-cognac-leather-sofa-open-kitchen-green-cabinets-marble-pampas-architectural.jpg",
          "/case-studies/hill-country-living/hill-country-living-limestone-fireplace-eisenhower-tweed-armchair-ladder-shelf-vintage-rug-vertical.jpg",
          "/case-studies/hill-country-living/hill-country-living-tweed-armchairs-window-vintage-rug-leather-stool-conversation-area.jpg",
          "/case-studies/hill-country-living/hill-country-living-leather-oval-mirror-wood-console-crystal-lamp-entry-vignette.jpg",
        ],
      },
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
      summary: [
        { label: "Built", value: "Living room around a floor-to-ceiling limestone fireplace wall, open to the kitchen." },
        { label: "Scope", value: "Interior design, furniture curation, art selection, fixture sourcing." },
        { label: "Materials", value: "Limestone, reclaimed 1950s pine, cognac leather, charcoal tweed, antiqued brass." },
        { label: "Angle", value: "Each piece chosen for how it ages, not how it photographs. The room collects rather than coordinates." },
      ],
      abstract:
        "The living room sits at the center of the house, open to the kitchen and framed by the limestone fireplace wall. The material palette carries through from the rest of the home: reclaimed 1950s pine floors, exposed wood beams, brass fixtures.\n\nFurniture blends mid-century silhouettes with textiles that lean Western. Cognac leather sofa with wood frame. Tweed armchairs. A Navajo-style throw. The mix is intentional but not matched. Each piece chosen individually rather than ordered as a set.\n\nArt on the stone wall includes an original painting by Dwight D. Eisenhower alongside landscape pieces in gilded frames. Family heirlooms sit next to new finds. The fireplace is used. The sheepskin under the bench is soft. The room has texture across the full range.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hill-country-living-cognac-leather-sofa-tweed-armchairs-limestone-fireplace-pendant-chandelier-wide.jpg`,
      alt: "Hill Country Residence living room: floor-to-ceiling limestone fireplace wall, cognac leather sofa with Navajo-style throw, tweed armchairs, leather bench with sheepskin, brass pendant chandelier, reclaimed pine floors",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — MATERIAL & PALETTE
    // ════════════════════════════════════════
    {
      id: "material-header",
      type: "section-header",
      label: "SECTION 02: MATERIAL",
      title: "Stone, Pine,",
      // Pinned so the four-material list travels up beside the headline
      // instead of under it. The names have to be readable against the
      // headline that groups them, and holding is what puts them there.
      pressing: {
        mark: { n: "02", name: "Stone, Pine" },
        heldLine: "Brass, Leather.",
        choreo: { pin: true },
      },
    },
    {
      id: "material-subhead",
      type: "text",
      size: "subhead",
      content:
        "The material palette runs through from the rest of the home. Four core textures, none competing for attention.",
    },
    {
      id: "material-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Floor-to-ceiling limestone on the fireplace wall. Reclaimed 1950s pine underfoot and overhead as exposed beams. Brass fixtures throughout. Cognac leather on the sofa and bench seats. The walls and ceiling stay quiet so the texture has room to register.",
    },

    // Symmetrical fireplace wall — promoted to a scroll-animated hero so
    // the every-material-in-one-frame moment gets full-bleed treatment as
    // the user scrolls past, then re-tucks. Same scale + radius animation
    // as the page's top hero.
    {
      id: "material-fireplace",
      type: "hero",
      image: `${IMG}/hill-country-living-limestone-fireplace-eisenhower-painting-navajo-throw-cognac-sofa-symmetry.jpg`,
      alt: "Symmetrical centered view of the limestone fireplace wall with the Eisenhower painting flanked by smaller landscape pieces in gilded frames, oak mantel beam, brass pendant chandelier overhead, cognac leather sofa with Navajo-style throw in foreground",
      // The zoom. A symmetrical elevation is the one composition that
      // rewards filling the mat: the symmetry only reads when the whole
      // wall is the same size as the screen.
      pressing: {
        plate: "02",
        captions: [
          "Limestone fireplace wall",
          "Eisenhower painting, oak mantel",
          "Brass pendant overhead",
        ],
        instruction: "Scroll — fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // 2-up: stone-wall vertical details (the 2x22 pair)
    {
      id: "material-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/hill-country-living-limestone-ladder-shelf-vintage-globe-brass-fireplace-tools-tweed-detail.jpg`,
        alt: "Vertical detail of the limestone wall with the ladder shelf holding a vintage globe, brass fireplace tools below, and the corner of a tweed armchair",
      },
      right: {
        src: `${IMG}/hill-country-living-limestone-eisenhower-record-player-gray-sofa-pendant-chandelier-vertical.jpg`,
        alt: "Vertical detail of the limestone wall, the Eisenhower painting and a smaller landscape framed in gilt, mid-century record-player shelf below, brass pendant chandelier overhead, edge of the gray sofa in the foreground",
      },
      // Held so the open-plan view climbs across it: the wall in close-up,
      // then the room it opens out of.
      pressing: {
        captions: ["Ladder shelf\nVintage globe", "Record-player shelf"],
        choreo: { pin: true },
      },
    },

    // ── Open-to-kitchen architectural view — climbs across the held pair
    {
      id: "architectural-hero",
      type: "hero",
      image: `${IMG}/hill-country-living-cognac-leather-sofa-open-kitchen-green-cabinets-marble-pampas-architectural.jpg`,
      alt: "View from the living room into the open kitchen beyond: cognac leather sofa with pampas and textured pillows in the foreground, exposed wood beams overhead, green cabinetry and marble counters in the kitchen behind",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 03 — COLLECTED
    // ════════════════════════════════════════
    {
      id: "collected-header",
      type: "section-header",
      label: "SECTION 03: COLLECTED",
      title: "Considered,",
      // The study's one crossing. Two words that draw the line the whole
      // room is arguing for.
      //
      // `pin` alongside `crossing`: the crossing already holds as part of
      // its own gesture, so the flag changes nothing on the page. It is the
      // A.R.C. convention for saying so in the data, which is what the
      // audit reads.
      pressing: {
        mark: { n: "03", name: "Considered" },
        heldLine: "Not Curated.",
        choreo: { pin: true, crossing: true },
      },
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
        src: `${IMG}/hill-country-living-limestone-fireplace-eisenhower-tweed-armchair-ladder-shelf-vintage-rug-vertical.jpg`,
        alt: "Vertical view of the limestone fireplace with the Eisenhower painting and a small landscape, tweed armchair beside it, ladder shelf with ceramic vessels, dark patterned vintage rug",
      },
      right: {
        src: `${IMG}/hill-country-living-tweed-armchairs-window-vintage-rug-leather-stool-conversation-area.jpg`,
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
        src: `${IMG}/hill-country-living-leather-oval-mirror-wood-console-crystal-lamp-entry-vignette.jpg`,
        alt: "Entry vignette in an adjacent room: leather-strapped oval mirror, wood cutting board on the wall, small framed art, wood console table with crystal lamp, plaid throw and wicker basket beneath",
      },
      right: {
        src: `${IMG}/hill-country-living-cognac-sofa-pampas-wood-bowl-kitchen-background-detail.jpg`,
        alt: "Tight detail of the cognac leather sofa with checkered pillow and pampas in a wood vase set in a black wood bowl on the coffee table, view through to the kitchen behind",
      },
      // Held so the record-player shelf climbs across it. The pair is the
      // section's widest scatter, entry to sofa, so the closing detail
      // arrives over a held screen rather than after a third flat pair.
      pressing: { choreo: { pin: true } },
    },

    // Single: record-player + Eisenhower detail (personality closer for collected section)
    {
      id: "collected-recordplayer",
      type: "image",
      src: `${IMG}/hill-country-living-vintage-record-player-vinyl-shelf-limestone-eisenhower-detail.jpg`,
      alt: "Tight detail of the mid-century record-player shelf against the limestone wall, vinyl records below including Sturgill Simpson and ZZ Top, cactus and small framed landscape painting to the side, edge of the Eisenhower painting visible above",
      aspect: "native",
      padded: true,
      // Climbs rather than zooms. The file is 2220px native, under the
      // floor for a plate that fills the mat, and the study already spends
      // its zoom on the fireplace elevation. The shelf reads at column
      // scale anyway: it is a detail, not an elevation.
      pressing: { choreo: { rise: true } },
    },

    // ── Editorial palate cleanser
    {
      id: "headline-livedin",
      type: "editorial-headline",
      text: "Lived in,\nnot staged",
    },

    // ════════════════════════════════════════
    // SECTION 04 — MATERIALS & FINISHES
    // Was marks-materials, the BRAND ledger, with the five materials
    // stuffed into its `fonts` field so each one rendered as a type
    // specimen: "Limestone" set in Caslon, a face nobody put in this
    // house, proving nothing about the room. Three rows now, and every
    // one of them answers a question a room actually raises.
    // Materials and textures derive from npm run interiors.
    // ════════════════════════════════════════
    {
      id: "interiors-index",
      type: "interiors-index",
      label: "SECTION 04: MATERIALS & FINISHES",
      title: "Five Materials\nHolding One Room.",
      introText:
        "The room runs on five materials, each chosen for how it ages. Limestone, pine, leather, tweed, brass. Nothing chasing trend, nothing afraid of wear.",
      philosophyText:
        "Color goes in through what the materials already are, not through accents or paint. Limestone takes light without bouncing it. Pine warms underfoot. Cognac leather darkens with use. Tweed reads soft from a distance, structured up close. Brass develops a patina nobody plans for.\n\nEvery piece in the room is allowed to age. Nothing is precious, nothing is protected. The fireplace is used. The records get played. The sheepskin moves around.",
      colors: [
        { name: "Limestone Cream", hex: "#E5DDC9", description: "Fireplace wall, paint" },
        { name: "Reclaimed Pine", hex: "#9B6F47", description: "Floors, beams, mantel" },
        { name: "Cognac Leather", hex: "#8B4F32", description: "Sofa, bench seat" },
        { name: "Charcoal Tweed", hex: "#4A4540", description: "Armchairs, throws" },
        { name: "Antiqued Brass", hex: "#A87A45", description: "Pendant, fixtures, andirons" },
      ],
      /* Names and locations only. The old `fonts` entries carried a
         paragraph of prose each, which the ledger never had room to
         show and which the study's own Materials section already says
         at length. What survives is the half a caption needs. */
      materials: [
        { name: "Limestone", role: "Fireplace wall" },
        { name: "Reclaimed Pine", role: "Floors, beams, mantel" },
        { name: "Cognac Leather", role: "Sofa, bench seat" },
        { name: "Charcoal Tweed", role: "Armchairs, throws" },
        { name: "Antiqued Brass", role: "Pendant, fixtures, andirons" },
      ],
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "A Room You",
      pressing: {
        mark: { n: "04", name: "A Room You" },
        heldLine: "Live In.",
      },
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
        "An Eisenhower painting on a limestone wall, vinyl records on the shelf, a sheepskin that moves around. The room looks the same after ten years of family because nothing in it was afraid of wear.",
    },
  ],
};
