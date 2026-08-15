import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/loved-by-nordstrom";

export const lovedByNordstromCaseStudy: CaseStudy = {
  slug: "loved-by-nordstrom",
  title: "Loved by Nordstrom",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Year-long campaign built on one idea: the Instagram heart as editorial device. A system flexible enough to run across social, email, signage, and web using any asset type.",
  field: "Creative Direction\nCampaign Design\nDesign Systems",
  author: "Jeremy Prasatik",
  published: "2017",
  status: "Complete",
  classification: [
    "Creative Direction",
    "Campaign Design",
    "Design Systems",
  ],
  services: [
    "Creative Direction",
    "Campaign Design",
    "Design Systems",
  ],
  stack: ["Art Direction", "Photography Licensing", "Editorial Systems"],
  links: [],
  heroImage: "",
  style: "pressing",
  /* Built FOR an ecommerce retailer without being ecommerce
     design, so this reaches search without printing a claim the
     work does not support. See CaseStudy.keywords. */
  keywords: ["Ecommerce"],
  sections: [
    // ── META ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 8 frames",
        colors: ["#DAD7D2", "#605C66", "#BBAA8B", "#AF987F", "#CAC4BE"],
        images: [
          "/case-studies/loved-by-nordstrom/loved-by-nordstrom-gallery-wall-campaign-tiles-tibi-center.jpg",
          "/case-studies/loved-by-nordstrom/loved-by-nordstrom-iphone-instagram-stories-tibi-trench.jpg",
          "/case-studies/loved-by-nordstrom/loved-by-nordstrom-liked-by-helmut-lang-beige-jacket-tile.jpg",
          "/case-studies/loved-by-nordstrom/loved-by-nordstrom-liked-by-the-great-sweatshirt-tile.jpg",
          "/case-studies/loved-by-nordstrom/loved-by-nordstrom-liked-by-see-by-chloe-colorblock-bag-tile.jpg",
          "/case-studies/loved-by-nordstrom/loved-by-nordstrom-liked-by-rag-and-bone-red-jersey-tile.jpg",
          "/case-studies/loved-by-nordstrom/loved-by-nordstrom-liked-by-frame-denim-tile.jpg",
          "/case-studies/loved-by-nordstrom/loved-by-nordstrom-liked-by-see-by-chloe-saddle-bag-tile.jpg",
        ],
      },
      title: "Loved by\nNordstrom",
      subtitle:
        "One icon borrowed from Instagram, twelve months of brand merchandising built on top of it.",
      field: "Creative Direction  Campaign Design  Design Systems",
      author: "Jeremy Prasatik",
      published: "2017",
      status: "Complete",
      classification: [
        "Creative Direction",
        "Campaign Design",
        "Design Systems",
      ],
      summary: [
        { label: "Built", value: "Year-long brand campaign. One tile system across social, email, in-store signage, web" },
        { label: "Scope", value: "Creative direction, campaign design, design systems" },
        { label: "Tools", value: "Art direction, photography licensing, editorial systems" },
        { label: "Angle", value: "A heart does what a logo cannot. One borrowed icon, two tiers, any licensed asset." },
      ],
      abstract:
        "The brief was emerging brand awareness - a Nordstrom mandate to lift smaller designer labels across the department store floor and the digital storefront at the same time. The solve was simpler than it sounds: borrow the heart icon from Instagram and let it carry the campaign signature.\n\nOne mark, two voices. \"Liked by Nordstrom\" sat on the smaller tiles for day-to-day merchandising, and \"Loved by Nordstrom\" carried the hero slots that earned the extra real estate. Same icon, same typography, different emotional weight - merchandising had a dial they could turn without touching the design.\n\nTwelve months across social feeds, email sends, in-store signage, and web landing pages. The template absorbed whatever the brand had already licensed - Helmut Lang shot minimal and cold, The Great shot warm and narrative, See by Chloé led with product. The frame held all of them without flattening any of them, and the campaign ran long because there was nothing to get tired of.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/loved-by-nordstrom-gallery-wall-campaign-tiles-tibi-center.jpg`,
      alt: "Loved by Nordstrom campaign gallery wall of brand tiles with two TIBI Loved By tiles at center",
      pressing: { choreo: { rise: true } },
    },

    // ── THE IDEA ──
    {
      id: "idea-header",
      type: "section-header",
      label: "SECTION 02: THE IDEA",
      title: "The Heart Was",
      // Held: the headline is the whole claim, and the column under it is
      // the proof. The claim stays on screen while the proof travels past.
      pressing: {
        mark: { n: "02", name: "The Heart Was" },
        heldLine: "Already a Verb.",
        choreo: { pin: true },
      },
    },
    {
      id: "idea-text",
      type: "text",
      size: "subhead",
      content:
        "People tapped it thousands of times a day without thinking. Stamping it on a retail campaign meant the mechanic came pre-installed. No one needed to learn what Liked By meant.",
    },
    {
      id: "idea-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Two typographic levels did the work of a full brand hierarchy. \"Liked\" sat on the smaller tiles and \"Loved\" carried the hero slots - same icon, same typography, different emotional weight. Merchandising picked which tier a brand earned and the design held the frame.",
    },

    // ── IPHONE INSTAGRAM HERO ──
    {
      id: "idea-hero",
      type: "hero",
      image: `${IMG}/loved-by-nordstrom-iphone-instagram-stories-tibi-trench.jpg`,
      alt: "iPhone showing TIBI Loved by Nordstrom story on Instagram laid on a beige trench coat",
      inline: true,
      // The zoom, placed early because this study opens on a long run of
      // copy. A phone photographed on the coat it is selling only reads
      // as that once the frame fills the mat.
      pressing: {
        plate: "02",
        captions: [
          "TIBI story on Instagram",
          "The tile in the wild",
          "Shot on the trench",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── THE SYSTEM ──
    {
      id: "system-header",
      type: "section-header",
      label: "SECTION 03: THE SYSTEM",
      title: "A Tile That Worked",
      // The study's one crossing, on the idea the whole system rests on.
      //
      // No mid-page climb: the tile grids here are quad-images, which hold
      // but cannot rise, and the one dual-image is followed by a section
      // header rather than a plate.
      //
      // `pin` alongside `crossing`: the crossing already holds as part of
      // its own gesture, so the flag changes nothing on the page. It is the
      // A.R.C. convention for saying so in the data, which is what the
      // audit reads.
      pressing: {
        mark: { n: "03", name: "A Tile That Worked" },
        heldLine: "As a Container.",
        choreo: { pin: true, crossing: true },
      },
      group: { name: "system", bg: "#EFEAE4", radius: 75, padding: "60px" },
    },
    {
      id: "system-text",
      type: "text",
      size: "subhead",
      content:
        "Brand name on top, photography in the middle, heart and endorsement at the base. Anything could land in the middle slot - product shot, lifestyle frame, studio portrait, campaign still. The frame absorbed whatever the brand had already licensed.",
      group: { name: "system" },
    },
    {
      id: "system-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The flexibility came from discipline at the structural level. Fixed grid, fixed type, fixed icon, everything else open. Merchandising got more freedom than the brands could have negotiated individually.",
      group: { name: "system" },
    },

    // ── TILES ROW 1 (4) ──
    {
      id: "tiles-1",
      type: "quad-image",
      native: true,
      transparent: true,
      images: [
        { src: `${IMG}/loved-by-nordstrom-liked-by-helmut-lang-beige-jacket-tile.jpg`, alt: "Liked by Nordstrom tile featuring Helmut Lang, model in beige canvas jacket" },
        { src: `${IMG}/loved-by-nordstrom-liked-by-the-great-sweatshirt-tile.jpg`, alt: "Liked by Nordstrom tile featuring The Great, model on boat in graphic sweatshirt" },
        { src: `${IMG}/loved-by-nordstrom-liked-by-see-by-chloe-colorblock-bag-tile.jpg`, alt: "Liked by Nordstrom tile featuring See by Chloé colorblock leather bag" },
        { src: `${IMG}/loved-by-nordstrom-liked-by-rag-and-bone-red-jersey-tile.jpg`, alt: "Liked by Nordstrom tile featuring Rag and Bone, model in red jersey" },
      ],
      group: { name: "system" },
    },

    // ── TILES ROW 2 (4) ──
    {
      id: "tiles-2",
      type: "quad-image",
      native: true,
      transparent: true,
      images: [
        { src: `${IMG}/loved-by-nordstrom-liked-by-frame-denim-tile.jpg`, alt: "Liked by Nordstrom tile featuring Frame denim, black-and-white studio shot" },
        { src: `${IMG}/loved-by-nordstrom-liked-by-see-by-chloe-saddle-bag-tile.jpg`, alt: "Liked by Nordstrom tile featuring See by Chloé saddle bag with gold ring handle" },
        { src: `${IMG}/loved-by-nordstrom-liked-by-tibi-printed-dress-tile.jpg`, alt: "Liked by Nordstrom tile featuring TIBI printed top and colorblock skirt" },
        { src: `${IMG}/loved-by-nordstrom-liked-by-rag-and-bone-leather-jacket-tile.jpg`, alt: "Liked by Nordstrom tile featuring Rag and Bone black leather motorcycle jacket" },
      ],
      group: { name: "system" },
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-editorial",
      type: "editorial-headline",
      text: "A heart does\nwhat a logo\ncannot",
    },

    // ── LOVED BY HIERARCHY ──
    {
      id: "loved-header",
      type: "section-header",
      label: "SECTION 04: HIERARCHY",
      title: "Two Tiers Giving",
      // Held because the tier is a lever, and a lever reads as one thing
      // only if the name of it stays put while the mechanics scroll by.
      pressing: {
        mark: { n: "04", name: "Two Tiers Giving" },
        heldLine: "Merchandising a Lever.",
        choreo: { pin: true },
      },
    },
    {
      id: "loved-text",
      type: "text",
      size: "subhead",
      content:
        "Loved By earned the bigger canvas - larger crops, tighter compositions, single-brand focus. When TIBI got the Loved treatment, the fur coat and the profile portrait ran at full-page scale, with the same type and heart but a different voltage.",
    },
    {
      id: "loved-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Merchandising used the tier as a programming tool. Weekly pushes on Liked. Seasonal flagships on Loved. The design gave them a way to signal priority without writing a brief that said \"make this one bigger.\" The tier showed up in the copy.",
    },

    // ── LARGE LOVED BY TILES ──
    {
      id: "loved-tiles",
      type: "dual-image",
      transparent: true,
      aspect: "aspect-[3/4]",
      left: {
        src: `${IMG}/loved-by-nordstrom-large-tibi-portrait-campaign-tile.jpg`,
        alt: "Loved by Nordstrom large format tile featuring TIBI, profile portrait with feathered detail",
      },
      right: {
        src: `${IMG}/loved-by-nordstrom-large-tibi-fur-coat-campaign-tile.jpg`,
        alt: "Loved by Nordstrom large format tile featuring TIBI faux fur coat on white door",
      },
    },

    // ── ACROSS CHANNELS ──
    {
      id: "channels-header",
      type: "section-header",
      label: "SECTION 05: ACROSS CHANNELS",
      title: "A Customer Saw It Twice",
      // Held, and it is also the hold the landing page climbs. The point of
      // the section is recognition across surfaces, so the phone arriving
      // over a headline that has not moved is the argument acting itself out.
      pressing: {
        mark: { n: "05", name: "A Customer Saw It Twice" },
        heldLine: "in Two Days.",
        choreo: { pin: true },
      },
    },
    {
      id: "channels-text",
      type: "text",
      size: "subhead",
      content:
        "The tile rendered the same whether it showed up in a feed, an email hero, a window decal, or a landing page header. Scale changed, framing stayed, and recognition compounded across channels without anyone teaching the customer to look for it.",
    },
    {
      id: "channels-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The landing page pulled the campaign into a navigation layer. Editorial stories organized by brand, the heart acting as a bookmark through the grid. The same photography that lived in a 1080-square social post scaled to a 1440-wide hero without new art direction. A crop spec.",
    },

    // ── LANDING PAGE HERO ──
    {
      id: "landing-hero",
      type: "hero",
      image: `${IMG}/loved-by-nordstrom-iphone-landing-page-corduroy-couch.jpg`,
      alt: "iPhone showing By Nordstrom landing page laid on corduroy couch",
      inline: true,
      // Climbs the channels brief. The file is 3080px native, so it could
      // zoom, but the trench-coat plate above already spent this study's
      // zoom on a near-identical frame: phone, fabric, tile in the wild.
      // Repeating the pin here would read as the layout, not a gesture.
      pressing: { choreo: { rise: true } },
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "A Year on",
      pressing: {
        mark: { n: "06", name: "A Year on" },
        heldLine: "One Icon.",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Campaigns usually start with a concept and dress it in a system. This one started with a system and let the concept stay small. Twelve months, dozens of brands, one heart.",
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Creative Direction",
        "Campaign Design",
        "Design Systems",
      ],
      stack: ["Art Direction", "Photography Licensing", "Editorial Systems"],
      links: [],
      content:
        "Most campaigns burn out when the concept gets stale. This one didn't have a concept to wear out. The heart was borrowed, the frame was fixed, and the only thing that changed was the brand photography inside it. Merchandising swapped brands on a weekly cadence without filing a creative brief.\n\nThe tier between Liked and Loved gave designers a reason not to touch the layout every month. Twelve months of output from a five-minute idea that never needed a refresh.",
    },
  ],
};
