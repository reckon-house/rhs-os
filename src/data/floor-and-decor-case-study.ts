import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/floor-and-decor";

export const floorAndDecorCaseStudy: CaseStudy = {
  slug: "floor-and-decor",
  title: "Floor & Decor Feature",
  category: { label: "Interiors", href: "/category/interiors" },
  subtitle:
    "Designer of the Quarter, Summer 2023. Hard surface selections across three residential projects - marble, dolomite, white oak, classic tile. Featured in the catalog, on the website, and in a video interview.",
  field: "Interior Design\nMaterial Selection\nFinish Coordination",
  author: "Jeremy Prasatik",
  published: "2023",
  status: "Featured",
  classification: ["Interior Design", "Material Selection", "Finish Coordination"],
  services: ["Interior Design", "Material Selection", "Finish Coordination"],
  stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/urban-southwest-primary-bath-exposed-brick-matte-black-soaking-tub.jpg`,
      alt: "Urban southwest primary bath with exposed brick wall, matte black freestanding soaking tub, white oak vanity, and marble shower",
    },

    // ── META + ABSTRACT ──
    // Abstract carries the F&D feature context (Designer of the Quarter,
    // catalog, website, video interview) so we don't need a dedicated
    // SECTION 04 to repeat it later.
    {
      id: "meta",
      type: "meta",
      title: "Floor & Decor\nFeature",
      subtitle:
        "Designer of the Quarter, Summer 2023. Hard surface selections across three residential projects - marble, dolomite, white oak, classic tile. Featured in the catalog, on the website, and in a video interview.",
      field: "Interior Design  Material Selection  Finish Coordination",
      author: "Jeremy Prasatik",
      published: "2023",
      status: "Featured",
      classification: ["Interior Design", "Material Selection", "Finish Coordination"],
      abstract:
        "Floor & Decor named the studio Designer of the Quarter for Summer 2023, anchored on hard surface selections across three residential bathrooms. Marble, dolomite, white oak, classic tile - the kit each project pulled from, applied three different ways. The feature ran in the summer catalog, on the Floor & Decor website, and inside a full video interview.\n\nThree projects, three directions. Urban southwest with exposed brick and a matte black soaking tub. Modern farmhouse with shiplap, brass fixtures, and patterned floor tile. Quiet glam with veined marble running floor to ceiling. Each room reads as its own thing, but the underlying material logic is the same.\n\nThe focus was hard surfaces, and the projects show how tile and stone anchor everything else. Get the floors and walls right, the rest follows.",
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
      title: "Three Projects,\nThree Directions.",
    },
    {
      id: "directions-subhead",
      type: "text",
      size: "subhead",
      content:
        "Urban southwest with exposed brick and a matte black soaking tub. Modern farmhouse with shiplap, brass fixtures, and patterned floor tile. Quiet glam with veined marble running floor to ceiling.",
    },
    {
      id: "directions-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Same material vocabulary across all three - marble, dolomite, white oak, classic tile - but the proportions, fixtures, and finishes shift hard between projects. The point of the feature wasn't a single style. It was showing that the same kit can carry very different rooms when the selections stay disciplined.",
    },

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
      title: "Material Confidence,\nNot Material Matching.",
    },
    {
      id: "confidence-subhead",
      type: "text",
      size: "subhead",
      content:
        "The common thread is material confidence. Mixing textures that shouldn't obviously work together, but do. Vertical stacked tile against horizontal brick. Polished nickel next to unlacquered brass. Cool marble warming up against reclaimed wood ceilings.",
    },
    {
      id: "confidence-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The combinations felt risky on paper but landed perfectly in person. A matte black tub reads softer when it sits between hard brick and warm oak than it ever does in a render. Patterned floor tile reads quieter under shiplap and a vaulted ceiling than under flat drywall. The trick was selecting materials together rather than sequentially - if a stone and a wood and a metal can hold each other in the moodboard, they hold each other in the room.",
    },

    // ── Urban Southwest shower details — first 2-up
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
    },

    // ── Quiet Glam subsection — sits between the two 2-ups as its own
    // editorial moment. Static image (not a scrolling hero), with a brief
    // text passage describing the marble approach.
    {
      id: "headline-quiet-glam",
      type: "editorial-headline",
      text: "Quiet glam,\nveined marble floor to ceiling",
    },
    {
      id: "quiet-glam-image",
      type: "image",
      src: `${IMG}/quiet-glam-primary-bath-veined-marble-brass-urchin-chandelier.jpg`,
      alt: "Quiet glam primary bath with veined marble walls, freestanding tub, brass urchin chandelier, and patterned floor tile",
      aspect: "native",
      padded: true,
    },
    {
      id: "quiet-glam-text",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Large-format veined marble runs the full height of the walls, a brass urchin pendant breaks the verticality, and a graphic star tile grounds the floor. The room sits opposite the urban southwest project's brick-and-black register - the same marble vocabulary, dialed down to one slab and one accent metal. Restraint is the move when the material is doing the talking.",
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
        "Mapping the material kit across the three projects shows where the overlaps actually live. Marble carries every room. Polished nickel and hexagon mosaic bridge two of the three. Brass anchors the warmer pair. The distinct character of each room comes from the small handful of materials that only show up once in the entire feature - exposed brick, shiplap, the urchin pendant.",
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
      title: "One Material Kit,\nThree Different Rooms.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Marble, dolomite, white oak, classic tile - the same vocabulary across three projects, applied with enough confidence to read as three distinct rooms.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Interior Design", "Material Selection", "Finish Coordination"],
      stack: ["AutoCAD", "SketchUp", "Adobe Creative Suite"],
      links: [],
      content:
        "Floor & Decor named the studio Designer of the Quarter on the strength of three bathrooms that share a material vocabulary but read as three completely different rooms. The hard surface selections did the structural work - tile and stone setting the proportions, the rest of the build sitting on top of them.",
    },
  ],
};
