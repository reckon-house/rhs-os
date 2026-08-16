import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/big-bend";

// Rhythm: hold, climb, hold, climb. The collages, the tall canyon frames and
// the squares sit in held rows at column measure; the wide landscapes climb
// across them full bleed. Arc follows the abstract — Big Bend, then the road
// north, then Marfa, with Prada held for the payoff.
//
// This study is the case CHOREO-PASS names as the one neither treatment
// fixes on its own: seventeen plates running one after another. A risen
// plate is moving, so it cannot hold the next riser, and no file here clears
// the ~3000px floor a zoom needs (every export is 2560px wide, and
// square_mountain is only 1546). So the runs pair up instead. Paired frames
// draw at roughly 690px, which those files carry honestly, and each pinned
// row buys the next landscape its climb.

export const bigBendCaseStudy: CaseStudy = {
  slug: "big-bend",
  title: "West Texas",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Photographs from a family trip through Big Bend and the desert around Marfa. | Personal work that later became the backdrop for the Capitan Boot Co. campaign.",
  field: "Photography\nLandscape",
  author: "Jeremy Prasatik",
  published: "2022",
  status: "Personal",
  classification: ["Photography", "Landscape", "Personal Work"],
  services: ["Photography"],
  stack: ["Camera"],
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
        colors: ["#9AA0A2", "#4D402C", "#645138", "#292B22", "#7F95A1"],
        images: [
          "/case-studies/big-bend/chisos-peak-cactus.jpg",
          "/case-studies/big-bend/elena_wide.jpg",
          "/case-studies/big-bend/hero2.jpg",
          "/case-studies/big-bend/grid_plant.jpg",
          "/case-studies/big-bend/chisos-range-panorama.jpg",
          "/case-studies/big-bend/elena_grid.jpg",
          "/case-studies/big-bend/mountain_crop.jpg",
          "/case-studies/big-bend/square_mountain.jpg",
        ],
      },
      title: "West Texas",
      subtitle:
        "Photographs from a family trip through Big Bend and the desert around Marfa. | Personal work that later became the backdrop for the Capitan Boot Co. campaign.",
      field: "Photography  Landscape",
      author: "Jeremy Prasatik",
      published: "2022",
      status: "Personal",
      classification: ["Photography", "Landscape", "Personal Work"],
      summary: [
        { label: "Shot", value: "Big Bend National Park, U.S. 90, and the desert around Marfa" },
        { label: "Subject", value: "The Chisos Mountains, Santa Elena Canyon, and Prada Marfa" },
        { label: "Later", value: "Used as backdrops in the Capitan Boot Co. campaign" },
      ],
      abstract:
        "Photographs from a family trip through far West Texas: Big Bend National Park, the road north, and the desert around Marfa. Big Bend is the largest national park in Texas and one of the least visited in the country.\n\nThe trip was personal. A few of these later became the backdrops for the Capitan Boot Co. campaign, shot in the same country.",
    },

    // ── HERO — a Chisos peak, climbing the cover (non-inline) ──
    {
      id: "hero",
      type: "hero",
      nativeRatio: true,
      image: `${IMG}/chisos-peak-cactus.jpg`,
      alt: "A lone peak in the Chisos Mountains rising over desert scrub and cactus, clouds stacked behind it",
      pressing: { choreo: { rise: true } },
    },

    // ── The park: held rows alternating with plates that climb them ──

    // The canyon and the ridgelines, held so the desert grid can climb.
    // elena_wide keeps the caption it carried as a single plate.
    {
      id: "elena-ridgeline-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/elena_wide.jpg`,
        alt: "The Rio Grande winding out of Santa Elena Canyon through the Big Bend desert",
      },
      right: {
        src: `${IMG}/hero2.jpg`,
        alt: "Layered ridgelines of the Chisos fading into afternoon haze above the Big Bend desert",
      },
      pressing: {
        captions: ["Santa Elena Canyon\nRio Grande"],
        choreo: { pin: true },
      },
    },
    // The desert studies climb the pair, full bleed.
    {
      id: "img-plant-grid",
      type: "image",
      src: `${IMG}/grid_plant.jpg`,
      aspect: "native",
      alt: "Four desert studies in a grid: ocotillo scrub, sotol spikes, a cactus hillside, and a Big Bend ridge",
      pressing: { choreo: { rise: true } },
    },

    // type break. Moved up one slot so the panorama can pair with the canyon
    // studies below it: a quote poster holds nothing, so it can never sit
    // between a pinned row and the plate that climbs it.
    {
      id: "films-headline",
      type: "editorial-headline",
      text: "Where There Will Be Blood\nand No Country for Old Men\nwere shot",
    },

    // The range beside the canyon studies. chisos-range-panorama keeps its
    // own caption; the grid next to it needs none.
    {
      id: "chisos-elena-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/chisos-range-panorama.jpg`,
        alt: "Panorama of the Chisos range under a bright sky, a sotol plant in the foreground",
      },
      right: {
        src: `${IMG}/elena_grid.jpg`,
        alt: "Santa Elena Canyon studies: the sheer limestone wall beside two frames of the Rio Grande below",
      },
      pressing: {
        captions: ["The Chisos range\nSotol in the foreground"],
        choreo: { pin: true },
      },
    },
    {
      id: "img-basin-road",
      type: "hero",
      nativeRatio: true,
      inline: true,
      image: `${IMG}/mountain_crop.jpg`,
      alt: "A dirt road cutting through the Big Bend basin toward a long mesa on the horizon",
      pressing: { choreo: { rise: true } },
    },

    // Three frames rather than two, and the canyon wall leads. It is a
    // 1546px file: sharp at a third of the column, mush at viewport width,
    // so it can never be a plate here. A contact-sheet row is also the one
    // place this study varies its held shape.
    {
      id: "desert-contact-sheet",
      type: "triple-image",
      native: true,
      images: [
        {
          src: `${IMG}/square_mountain.jpg`,
          alt: "A steep canyon wall of layered rock rising straight from the desert floor in Big Bend",
        },
        {
          src: `${IMG}/rise.jpg`,
          alt: "Sun cresting the Chisos, light flaring across the desert grassland at dawn",
        },
        {
          src: `${IMG}/woods_grid.jpg`,
          alt: "A lone desert tree centered in a grid of Big Bend scrub and distant ridgeline",
        },
      ],
      pressing: { choreo: { pin: true } },
    },
    {
      id: "img-chisos-clouds",
      type: "hero",
      nativeRatio: true,
      inline: true,
      image: `${IMG}/chisos.jpg`,
      alt: "The Chisos peak from the desert floor, afternoon clouds gathering above the range",
      pressing: { choreo: { rise: true } },
    },

    // ── The road north ──
    // The one row that holds nothing. The crossing follows it, so there is
    // no riser to reserve for, and the pair reads as the turn out of the park.
    {
      id: "road-north-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/vertical.jpg`,
        alt: "Three frames stacked down the page: a mountain road, an empty highway, and open desert",
      },
      right: {
        src: `${IMG}/desert-dusk-ridgeline.jpg`,
        alt: "Low desert ridgelines going dark under a pale evening sky in far West Texas",
      },
    },

    // ════════════════════════════════════════
    // PRADA MARFA
    // ════════════════════════════════════════
    {
      id: "prada-header",
      type: "section-header",
      label: "SECTION 02: PRADA MARFA",
      title: "They put real Prada shoes inside",
      // The study's one crossing, and its only section header. Everything
      // before it is landscape held at one cadence; the sculpture is the
      // turn, so the gesture marks it.
      //
      // Still no zoom plate: every file here is 2560px native or under,
      // below the working floor for a plate that fills the mat. The climbs
      // do that work instead.
      //
      // `pin` alongside `crossing`: the crossing already holds as part of
      // its own gesture, so the flag changes nothing on the page. It is the
      // A.R.C. convention for saying so in the data, which is what the
      // audit reads.
      pressing: {
        mark: { n: "02", name: "The Store on" },
        heldLine: "and shut the door in 2005.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "prada-text",
      type: "text",
      size: "subhead",
      content:
        "Prada Marfa is a permanent sculpture on U.S. 90 near Valentine, northwest of Marfa, built by the artists Elmgreen and Dragset. The bags are that season's.",
    },
    // The arrival, climbing the sentence that introduces it. The brief
    // reserves that room itself; never author it.
    {
      id: "img-prada-wide",
      type: "hero",
      nativeRatio: true,
      inline: true,
      image: `${IMG}/hero.jpg`,
      alt: "Prada Marfa, the sealed fake boutique standing alone beside U.S. 90 in the West Texas desert",
      pressing: {
        caption: "Prada Marfa\nU.S. 90 near Valentine",
        choreo: { rise: true },
      },
    },
    // Up close and from across the road, held together as one look at the
    // building. prada_crop is a 2055px square and belongs at column measure.
    {
      id: "prada-detail-pair",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/prada_crop.jpg`,
        alt: "The Prada Marfa storefront up close, its windows displaying shoes in the desert light",
      },
      right: {
        src: `${IMG}/prada.jpg`,
        alt: "Prada Marfa from across the highway, a power line running past it into open desert",
      },
      pressing: { choreo: { pin: true } },
    },
    // The grid closes the study climbing, so the last thing the reader sees
    // move is the sculpture repeating across the desert.
    {
      id: "img-prada-grid",
      type: "image",
      src: `${IMG}/prada_grid.jpg`,
      aspect: "native",
      alt: "Prada Marfa repeated in a grid around a center frame of open highway and West Texas sky",
      pressing: { choreo: { rise: true } },
    },

    // ── CLOSING ──
    {
      id: "closing",
      type: "closing",
      services: ["Photography"],
      stack: ["Camera"],
      links: [{ label: "See the Capitan Boot Co. campaign", url: "/case-studies/capitan-boot-co" }],
      content:
        "The photographs came home from a family trip and sat in a folder. Later, Capitan Boot Co. needed the West Texas desert behind its boots, and it was already in there.",
    },
  ],
};
