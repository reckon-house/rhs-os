import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/big-bend";

// Rhythm: a scroll-animated full-bleed hero, then a large image at the site's
// standard column width (1100px, no maxWidth — same as every other study),
// back and forth. Wide landscapes go full-bleed (they want the whole width);
// the collages, portraits, and squares sit in the column. Arc follows the
// abstract — Big Bend, then the road north, then Marfa, with Prada held for
// the payoff.

export const bigBendCaseStudy: CaseStudy = {
  slug: "big-bend",
  title: "West Texas",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Photographs from Big Bend National Park and the desert around Marfa, later used in the Capitan Boot Co. campaign.",
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
    // ── HERO — a Chisos peak, full bleed (non-inline: animates 60px → 0) ──
    {
      id: "hero",
      type: "hero",
      nativeRatio: true,
      image: `${IMG}/chisos-peak-cactus.jpg`,
      alt: "A lone peak in the Chisos Mountains rising over desert scrub and cactus, clouds stacked behind it",
    },

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
        "Photographs from Big Bend and the desert around Marfa. Personal work that later fed the Capitan Boot Co. campaign.",
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
        "Photographs from a family trip through far West Texas: Big Bend National Park, the road north, and the desert around Marfa.\n\nBig Bend is the largest national park in Texas and one of the least visited in the country. The same stretch of desert is where There Will Be Blood and No Country for Old Men were shot.\n\nThe trip was personal. A few of these photographs later became the backdrops for the Capitan Boot Co. campaign, shot in the same country.",
    },

    // ── The park: full-bleed heroes alternating with centered frames ──

    // C
    {
      id: "img-elena-wide",
      type: "image",
      src: `${IMG}/elena_wide.jpg`,
      aspect: "native",
      alt: "The Rio Grande winding out of Santa Elena Canyon through the Big Bend desert",
    },
    // F
    {
      id: "img-chisos-layers",
      type: "hero",
      nativeRatio: true,
      inline: true,
      image: `${IMG}/hero2.jpg`,
      alt: "Layered ridgelines of the Chisos fading into afternoon haze above the Big Bend desert",
    },
    // C
    {
      id: "img-plant-grid",
      type: "image",
      src: `${IMG}/grid_plant.jpg`,
      aspect: "native",
      alt: "Four desert studies in a grid: ocotillo scrub, sotol spikes, a cactus hillside, and a Big Bend ridge",
    },
    // F
    {
      id: "img-chisos-panorama",
      type: "hero",
      nativeRatio: true,
      inline: true,
      image: `${IMG}/chisos-range-panorama.jpg`,
      alt: "Panorama of the Chisos range under a bright sky, a sotol plant in the foreground",
    },

    // type break
    {
      id: "films-headline",
      type: "editorial-headline",
      text: "Where There Will Be Blood\nand No Country for Old Men\nwere shot",
    },

    // C
    {
      id: "img-elena-grid",
      type: "image",
      src: `${IMG}/elena_grid.jpg`,
      aspect: "native",
      alt: "Santa Elena Canyon studies: the sheer limestone wall beside two frames of the Rio Grande below",
    },
    // F
    {
      id: "img-basin-road",
      type: "hero",
      nativeRatio: true,
      inline: true,
      image: `${IMG}/mountain_crop.jpg`,
      alt: "A dirt road cutting through the Big Bend basin toward a long mesa on the horizon",
    },
    // C
    {
      id: "img-canyon-wall",
      type: "image",
      src: `${IMG}/square_mountain.jpg`,
      aspect: "native",
      alt: "A steep canyon wall of layered rock rising straight from the desert floor in Big Bend",
    },
    // F
    {
      id: "img-rise",
      type: "hero",
      nativeRatio: true,
      inline: true,
      image: `${IMG}/rise.jpg`,
      alt: "Sun cresting the Chisos, light flaring across the desert grassland at dawn",
    },
    // C
    {
      id: "img-woods-grid",
      type: "image",
      src: `${IMG}/woods_grid.jpg`,
      aspect: "native",
      alt: "A lone desert tree centered in a grid of Big Bend scrub and distant ridgeline",
    },
    // F
    {
      id: "img-chisos-clouds",
      type: "hero",
      nativeRatio: true,
      inline: true,
      image: `${IMG}/chisos.jpg`,
      alt: "The Chisos peak from the desert floor, afternoon clouds gathering above the range",
    },

    // ── The road north ──
    // C
    {
      id: "img-road-stack",
      type: "image",
      src: `${IMG}/vertical.jpg`,
      aspect: "native",
      alt: "Three frames stacked down the page: a mountain road, an empty highway, and open desert",
    },
    // F
    {
      id: "img-dusk-ridgeline",
      type: "hero",
      nativeRatio: true,
      inline: true,
      image: `${IMG}/desert-dusk-ridgeline.jpg`,
      alt: "Low desert ridgelines going dark under a pale evening sky in far West Texas",
    },

    // ════════════════════════════════════════
    // PRADA MARFA
    // ════════════════════════════════════════
    {
      id: "prada-header",
      type: "section-header",
      label: "SECTION 02: PRADA MARFA",
      title: "The Store on\nHighway 90.",
      pressing: { mark: { n: "02", name: "The Store on" } },
    },
    {
      id: "prada-text",
      type: "text",
      size: "subhead",
      content:
        "Prada Marfa is a permanent sculpture on U.S. 90 near Valentine, northwest of Marfa. The artists Elmgreen and Dragset built it in 2005. It holds real Prada shoes and bags from that season, and the door has never opened.",
    },
    // F — the arrival
    {
      id: "img-prada-wide",
      type: "hero",
      nativeRatio: true,
      inline: true,
      image: `${IMG}/hero.jpg`,
      alt: "Prada Marfa, the sealed fake boutique standing alone beside U.S. 90 in the West Texas desert",
    },
    // C — up close
    {
      id: "img-prada-front",
      type: "image",
      src: `${IMG}/prada_crop.jpg`,
      aspect: "native",
      alt: "The Prada Marfa storefront up close, its windows displaying shoes in the desert light",
    },
    // F — from across the road
    {
      id: "img-prada-highway",
      type: "hero",
      nativeRatio: true,
      inline: true,
      image: `${IMG}/prada.jpg`,
      alt: "Prada Marfa from across the highway, a power line running past it into open desert",
    },
    // C — the grid closer
    {
      id: "img-prada-grid",
      type: "image",
      src: `${IMG}/prada_grid.jpg`,
      aspect: "native",
      alt: "Prada Marfa repeated in a grid around a center frame of open highway and West Texas sky",
    },

    // ── CLOSING ──
    {
      id: "closing",
      type: "closing",
      services: ["Photography"],
      stack: ["Camera"],
      links: [{ label: "See the Capitan Boot Co. campaign", url: "/case-studies/capitan-boot-co" }],
      content:
        "The photographs came home from a family trip and sat in a folder. When Capitan Boot Co. needed a place for the brand to live, the West Texas desert was already shot.",
    },
  ],
};
