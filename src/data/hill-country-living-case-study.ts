import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/hill-country-living";

export const hillCountryLivingCaseStudy: CaseStudy = {
  slug: "hill-country-living",
  title: "Hill Country Residence: Livingroom.",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "The living room at the center of the Hill Country house. | A limestone fireplace wall, reclaimed pine, mid-century furniture with Western details, put together slowly and on purpose.",
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
        "The living room at the center of the Hill Country house. | A limestone fireplace wall, reclaimed pine, mid-century furniture with Western details, put together slowly and on purpose.",
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
        { label: "Angle", value: "Everything picked for how it will wear, then left alone to do it." },
      ],
      abstract:
        "Open to the kitchen, with a floor-to-ceiling limestone fireplace wall as the main event. Reclaimed 1950s pine on the floor, exposed beams overhead, brass fixtures.\n\nThe furniture is mid-century in shape with textiles that lean Western: a cognac leather sofa on a wood frame, tweed armchairs, a Navajo-style throw. Every piece was chosen for how it will age, and none of it came as a set.\n\nOn the stone wall, an original painting by Dwight D. Eisenhower hangs with landscape pieces in gilded frames. Family heirlooms sit next to new finds, and there is a sheepskin under the bench that gets moved around.",
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
      title: "The same four materials",
      // Pinned so the four-material list travels up beside the headline
      // instead of under it. The names have to be readable against the
      // headline that groups them, and holding is what puts them there.
      pressing: {
        mark: { n: "02", name: "Stone, Pine" },
        heldLine: "run through the whole house.",
        choreo: { pin: true },
      },
    },
    {
      id: "material-subhead",
      type: "text",
      size: "subhead",
      content:
        "Stone, pine, brass, leather.",
    },
    {
      id: "material-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Limestone floor to ceiling on the fireplace wall. Reclaimed 1950s pine underfoot and overhead in the exposed beams. Brass on the fixtures, cognac leather on the sofa and the bench. The walls and ceiling are kept plain, so the texture comes from those four.",
    },

    // Symmetrical fireplace wall — promoted to a scroll-animated hero so
    // the every-material-in-one-frame moment gets full-bleed treatment as
    // the user scrolls past, then re-tucks. Same scale + radius animation
    // as the page's top hero.
    {
      id: "material-fireplace",
      type: "hero",
      image: `${IMG}/hill-country-living-limestone-fireplace-eisenhower-painting-navajo-throw-cognac-sofa-symmetry.jpg`,
      alt: "Symmetrical centered view of the limestone fireplace wall with the Eisenhower painting flanked by smaller landscape pieces in gilded frames, cedar mantel beam, brass pendant chandelier overhead, cognac leather sofa with Navajo-style throw in foreground",
      // The zoom. A symmetrical elevation is the one composition that
      // rewards filling the mat: the symmetry only reads when the whole
      // wall is the same size as the screen.
      pressing: {
        plate: "02",
        captions: [
          "Limestone fireplace wall",
          "Eisenhower painting, cedar mantel",
          "Brass pendant overhead",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
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
      title: "There is an Eisenhower",
      // The study's one crossing, on the beat where the room's contents
      // arrive: what is in it, named, at display size.
      //
      // `pin` alongside `crossing`: the crossing already holds as part of
      // its own gesture, so the flag changes nothing on the page. It is the
      // A.R.C. convention for saying so in the data, which is what the
      // audit reads.
      pressing: {
        mark: { n: "03", name: "Heirlooms and Finds" },
        heldLine: "on the wall.",
        choreo: { pin: true, crossing: true },
      },
    },
    // No subhead here on purpose. The headline names the heirlooms, the
    // finds and the painting, and the abstract already said none of it
    // came as a set; a line under it was saying both again.
    {
      id: "collected-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Under the Eisenhower, a mid-century record-player shelf with the vinyl below it, ZZ Top and Sturgill Simpson in the stack. A ladder shelf holds a vintage globe and ceramic vessels, brass fire tools underneath. Two tweed armchairs face each other at the tall window with a leather stool between them and the Hill Country outside.",
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
      text: "The fireplace gets used,\nthe records get played",
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
      title: "The materials,\nchosen for how they age.",
      introText:
        "Limestone, pine, cognac leather, charcoal tweed, antiqued brass. None of it is trendy and all of it can take a scuff.",
      philosophyText:
        "Color comes from the materials themselves, with no accents and nothing painted for effect. Limestone takes light without bouncing it back. Pine is warm underfoot, and cognac leather darkens with use. Tweed reads soft from across the room and structured up close. Brass goes dark on its own schedule.",
      colors: [
        { name: "Limestone Cream", hex: "#E5DDC9", description: "Fireplace wall, paint" },
        { name: "Reclaimed Pine", hex: "#9B6F47", description: "Floors, beams" },
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
        { name: "Reclaimed Pine", role: "Floors, beams" },
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
      title: "Nothing in the room is precious",
      pressing: {
        mark: { n: "04", name: "Ten Years" },
        heldLine: "and nothing is protected.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "It was meant to take ten years of family.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Interior Design", "Furniture Curation", "Art Selection", "Fixture Sourcing"],
      stack: ["AutoCAD", "SketchUp", "Material specification"],
      links: [],
      content:
        "Just past the room, the entry gets the same treatment: a leather-strapped oval mirror on the wall, a wood console with a crystal lamp on it, a plaid throw and a wicker basket underneath.",
    },
  ],
};
