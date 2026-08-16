import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/floor-and-decor";

export const floorAndDecorCaseStudy: CaseStudy = {
  slug: "floor-and-decor",
  title: "Floor & Decor Feature",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "Floor & Decor named the studio Designer of the Quarter for three bathrooms that share one material kit. | Marble, dolomite, white oak, classic tile, and three rooms that look nothing alike.",
  field: "Interior Design\nMaterial Selection\nFinish Coordination",
  author: "Jeremy Prasatik",
  published: "2023",
  status: "Featured",
  classification: ["Interior Design", "Material Selection", "Finish Coordination"],
  services: ["Interior Design", "Material Selection", "Finish Coordination"],
  stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
  links: [],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META + ABSTRACT ──
    // Abstract carries the F&D feature context (Designer of the Quarter,
    // catalog, website, video interview) so we don't need a dedicated
    // SECTION 04 to repeat it later.
    // Aug 2026 copy pass: catalog / website / video moved down to the
    // closing so the abstract and the closing stop saying the same thing.
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 7 frames",
        colors: ["#C0C1C3", "#A3A4A6", "#5F6363", "#D4DBE5", "#817D78"],
        images: [
          "/case-studies/floor-and-decor/urban-southwest-primary-bath-exposed-brick-matte-black-soaking-tub.jpg",
          "/case-studies/floor-and-decor/modern-farmhouse-vanity-shiplap-marble-nickel-sconces-brass-mirror.jpg",
          "/case-studies/floor-and-decor/urban-southwest-marble-shower-vertical-stacked-tile-niche-bench.jpg",
          "/case-studies/floor-and-decor/urban-southwest-marble-shower-running-bond-handheld-nickel-fixture.jpg",
          "/case-studies/floor-and-decor/quiet-glam-primary-bath-veined-marble-brass-urchin-chandelier.jpg",
          "/case-studies/floor-and-decor/modern-farmhouse-vanity-shiplap-marble-counter-nickel-sconces-vessel-sink.jpg",
          "/case-studies/floor-and-decor/modern-farmhouse-powder-room-circular-brass-mirror-patterned-hex-floor.jpg",
        ],
      },
      title: "Floor & Decor\nFeature",
      subtitle:
        "Floor & Decor named the studio Designer of the Quarter for three bathrooms that share one material kit. | Marble, dolomite, white oak, classic tile, and three rooms that look nothing alike.",
      field: "Interior Design  Material Selection  Finish Coordination",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Featured",
      classification: ["Interior Design", "Material Selection", "Finish Coordination"],
      summary: [
        { label: "Built", value: "Designer of the Quarter, Summer 2023. Hard surface selections across three residential bathrooms. Catalog, website, video interview" },
        { label: "Scope", value: "Interior design, material selection, finish coordination" },
        { label: "Materials", value: "Marble, dolomite, white oak, classic tile" },
        { label: "Angle", value: "Some of the pairings looked risky on paper, and none of them do in the room." },
      ],
      abstract:
        "In Summer 2023 Floor & Decor named the studio Designer of the Quarter, for the hard surface selections in three residential bathrooms. Marble, dolomite, white oak and classic tile were the kit every project pulled from, and each one used it differently.\n\nOne is urban southwest, with exposed brick and a matte black soaking tub. One is modern farmhouse, with shiplap, brass fixtures and patterned floor tile. The third is quiet glam, veined marble running floor to ceiling. Each room stands on its own, and the materials under all three are the same.\n\nThe focus was hard surfaces, and the three rooms show how tile and stone anchor everything else. Get the floors and the walls right and the rest of the room follows.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/urban-southwest-primary-bath-exposed-brick-matte-black-soaking-tub.jpg`,
      alt: "Urban southwest primary bath with exposed brick wall, matte black freestanding soaking tub, white oak vanity, and marble shower",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE PROJECTS
    // (Three Directions intro + Modern Farmhouse hero. Urban southwest is
    // already at the top as the opening hero, and Quiet Glam moves into
    // section 03 between the two 2-ups as a dedicated subsection.)
    // ════════════════════════════════════════
    {
      id: "directions-header",
      type: "section-header",
      label: "SECTION 02: THE PROJECTS",
      title: "Three bathrooms,",
      // Pins so "Three Directions." holds while the subhead and footnote
      // travel up beside it. Nothing climbs this brief — the hold is for
      // the copy, which is where the three projects get named.
      pressing: {
        mark: { n: "02", name: "Three Bathrooms" },
        heldLine: "marble in all of them.",
        choreo: { pin: true },
      },
    },
    {
      id: "directions-subhead",
      type: "text",
      size: "subhead",
      content:
        "The proportions, the fixtures and the finishes change hard from one room to the next. The list of materials underneath hardly changes at all.",
    },
    // Footnote cut here (Aug 2026 copy pass): it said the subtitle again,
    // one kit, three rooms, and the subhead above already carries the part
    // that was new.

    // ── Modern Farmhouse — inline scaling hero (urban southwest is at top
    // of the page; quiet glam lives in section 03 below)
    {
      id: "headline-modern-farmhouse",
      type: "editorial-headline",
      text: "Modern farmhouse,\nshiplap and brass on marble",
    },
    {
      id: "modern-farmhouse-hero",
      type: "hero",
      image: `${IMG}/modern-farmhouse-vanity-shiplap-marble-nickel-sconces-brass-mirror.jpg`,
      alt: "Modern farmhouse vanity with vertical shiplap walls, reclaimed wood ceiling, marble counter, polished nickel sconces, and brass-framed mirror",
      inline: true,
      // The zoom, and this study's held screen. Four finishes meet in one
      // frame here — shiplap, reclaimed ceiling, marble, nickel and brass —
      // and the argument that they can disagree only lands at a size where
      // you can see all four at once.
      pressing: {
        plate: "02",
        captions: [
          "Modern farmhouse vanity",
          "Shiplap, marble, reclaimed wood",
          "Nickel sconces, brass mirror",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ════════════════════════════════════════
    // SECTION 03 — MATERIAL CONFIDENCE
    // (The common thread + project showcases + quiet glam subsection +
    // material overlap chart, all in one section.)
    // ════════════════════════════════════════
    {
      id: "confidence-header",
      type: "section-header",
      label: "SECTION 03: MATERIAL CONFIDENCE",
      title: "Vertical tile against brick,",
      // The study's one crossing, on the sentence the whole feature exists
      // to argue.
      //
      // `pin` alongside `crossing`: the crossing already holds as part of
      // its own gesture, so the flag changes nothing on the page. It is the
      // A.R.C. convention for saying so in the data, which is what the
      // audit reads.
      pressing: {
        mark: { n: "03", name: "Mixed Materials" },
        heldLine: "nickel next to brass.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "confidence-subhead",
      type: "text",
      size: "subhead",
      content:
        "Everything got picked at the same time, on one moodboard. If a stone and a wood and a metal work next to each other there, they work in the room.",
    },
    {
      id: "confidence-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Some of it looked risky on paper. In the room, a matte black tub between brick and warm oak reads softer than it does in a render, and patterned floor tile under shiplap and a vaulted ceiling reads calmer than it would under flat drywall.",
    },

    // ── Urban Southwest shower details — first 2-up. Holds, so the quiet
    // glam room has a still screen to climb.
    {
      id: "urban-southwest-shower",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/urban-southwest-marble-shower-vertical-stacked-tile-niche-bench.jpg`,
        alt: "Urban southwest marble shower with vertical stacked tile, recessed niche with hexagon detail, marble bench, and clerestory window",
      },
      right: {
        src: `${IMG}/urban-southwest-marble-shower-running-bond-handheld-nickel-fixture.jpg`,
        alt: "Urban southwest marble shower with horizontal running bond tile, handheld polished nickel fixture, and marble bench",
      },
      pressing: { choreo: { pin: true } },
    },

    // ── Quiet Glam subsection — sits between the two 2-ups as its own
    // editorial moment.
    //
    // The plate climbs the urban southwest pair, which is the study's
    // argument made as movement: the text below says quiet glam sits
    // opposite the brick-and-black register, so the one room arrives over
    // the other on the same material kit.
    //
    // Rise, not zoom. The file is 2254px native, under the working floor
    // for a plate that fills the mat, and the farmhouse vanity above
    // already spends this study's zoom.
    {
      id: "quiet-glam-image",
      type: "image",
      src: `${IMG}/quiet-glam-primary-bath-veined-marble-brass-urchin-chandelier.jpg`,
      alt: "Quiet glam primary bath with veined marble walls, freestanding tub, brass urchin chandelier, and patterned floor tile",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },
    // The headline slides one slot below the climb. It named the room
    // before; now it lands on the room already on screen, and the passage
    // that follows picks it straight up.
    {
      id: "headline-quiet-glam",
      type: "editorial-headline",
      text: "Quiet glam,\nveined marble floor to ceiling",
    },
    {
      id: "quiet-glam-text",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Large-format veined marble runs the full height of the walls, a brass urchin pendant breaks up all that height, and a star tile grounds the floor. Of the three rooms this one is the furthest from the brick and matte black. Same marble, brought down to one slab and one accent metal.",
    },

    // ── Modern Farmhouse details — second 2-up
    {
      id: "modern-farmhouse-details",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/modern-farmhouse-vanity-shiplap-marble-counter-nickel-sconces-vessel-sink.jpg`,
        alt: "Modern farmhouse vanity detail with vertical shiplap, veined marble counter, polished nickel sconces with milk glass globes, vessel sink, and brass mirror",
      },
      right: {
        src: `${IMG}/modern-farmhouse-powder-room-circular-brass-mirror-patterned-hex-floor.jpg`,
        alt: "Modern farmhouse powder room with circular brass mirror, brass cabinet pulls, brass sconce, vessel sink, and patterned hex floor tile",
      },
    },

    // ── Material overlap chart — Venn diagram showing marble at the center
    // (used in all three projects), pairwise overlaps for the metals and
    // hexagon mosaic, and each project's distinctive materials in their
    // own petals.
    {
      id: "material-chart-text",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Mapping the materials across the three projects shows where the overlaps are. Polished nickel and the hex mosaic each turn up in two of the three, and brass ties the two warmer rooms together. What makes each room its own is the handful of things that only show up once in the whole feature: exposed brick, shiplap, the urchin pendant.",
    },
    {
      id: "material-overlap",
      type: "material-overlap",
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 04: CLOSING",
      title: "Designer of the Quarter,",
      pressing: {
        mark: { n: "04", name: "Summer 2023" },
        heldLine: "Summer 2023.",
      },
    },
    // Closing subhead cut here (Aug 2026 copy pass): it re-told the
    // subtitle. The headline states the result and the closing says where
    // it ran; there was nothing left for a line between them to add.
    {
      id: "closing",
      type: "closing",
      services: ["Interior Design", "Material Selection", "Finish Coordination"],
      stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
      links: [],
      content:
        "The feature ran in the summer catalog and on the Floor & Decor website, with a video interview to go with it.",
    },
  ],
};
