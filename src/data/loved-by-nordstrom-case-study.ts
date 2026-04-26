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
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/loved-by-nordstrom-gallery-wall-campaign-tiles-tibi-center.jpg`,
      alt: "Loved by Nordstrom campaign gallery wall of brand tiles with two TIBI Loved By tiles at center",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Loved by\nNordstrom",
      subtitle:
        "One icon borrowed from Instagram. Twelve months of brand merchandising built on top of it.",
      field: "Creative Direction  Campaign Design  Design Systems",
      author: "Jeremy Prasatik",
      published: "2017",
      status: "Complete",
      classification: [
        "Creative Direction",
        "Campaign Design",
        "Design Systems",
      ],
      abstract:
        "The brief was emerging brand awareness. A Nordstrom mandate to lift smaller designer labels across the department store floor and the digital storefront at the same time. The solve was simpler than it sounds. Borrow the heart icon from Instagram. Make it the campaign signature. Done.\n\nOne mark. Two voices. \"Liked by Nordstrom\" sat on the smaller tiles for day-to-day merchandising. \"Loved by Nordstrom\" carried the hero slots that earned the extra real estate. Same icon, same typography, different emotional weight. Merchandising had a dial they could turn without touching the design.\n\nTwelve months across social feeds, email sends, in-store signage, and web landing pages. The template absorbed whatever the brand had already licensed. Helmut Lang shot minimal and cold. The Great shot warm and narrative. See by Chloé led with product. The frame held all of them without flattening any of them. The campaign ran long because there was nothing to get tired of.",
    },

    // ── THE IDEA ──
    {
      id: "idea-header",
      type: "section-header",
      label: "SECTION 02: THE IDEA",
      title: "The Heart Was\nAlready a Verb.",
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
        "Two typographic levels did the work of a full brand hierarchy. \"Liked\" sat on the smaller tiles. \"Loved\" carried the hero slots. Same icon, same typography, different emotional weight. Merchandising picked which tier a brand earned. The design held the frame.",
    },

    // ── IPHONE INSTAGRAM HERO ──
    {
      id: "idea-hero",
      type: "hero",
      image: `${IMG}/loved-by-nordstrom-iphone-instagram-stories-tibi-trench.jpg`,
      alt: "iPhone showing TIBI Loved by Nordstrom story on Instagram laid on a beige trench coat",
      inline: true,
    },

    // ── THE SYSTEM ──
    {
      id: "system-header",
      type: "section-header",
      label: "SECTION 03: THE SYSTEM",
      title: "The Tile Was a Container,\nNot a Layout.",
      group: { name: "system", bg: "#EFEAE4", radius: 75, padding: "60px" },
    },
    {
      id: "system-text",
      type: "text",
      size: "subhead",
      content:
        "Brand name on top. Photography in the middle. Heart and endorsement at the base. Anything in the middle slot worked. Product shot, lifestyle frame, studio portrait, campaign still. The frame absorbed whatever the brand had already licensed.",
      group: { name: "system" },
    },
    {
      id: "system-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The flexibility came from discipline at the structural level. Fixed grid. Fixed type. Fixed icon. Everything else open. Merchandising got more freedom than the brands could have negotiated individually.",
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
      title: "Liked Is the Floor.\nLoved Is the Ceiling.",
    },
    {
      id: "loved-text",
      type: "text",
      size: "subhead",
      content:
        "Loved By earned the bigger canvas. Larger crops, tighter compositions, single-brand focus. When TIBI got the Loved treatment, the fur coat and the profile portrait ran at full-page scale. Same type, same heart, different voltage.",
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
      title: "A Customer Saw It Twice\nin Two Days.",
    },
    {
      id: "channels-text",
      type: "text",
      size: "subhead",
      content:
        "The tile rendered the same whether it showed up in a feed, an email hero, a window decal, or a landing page header. Scale changed. Framing stayed. Recognition compounded across channels without anyone teaching the customer to look for it.",
    },
    {
      id: "channels-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The landing page pulled the campaign into a navigation layer. Editorial stories organized by brand, the heart acting as a bookmark through the grid. The same photography that lived in a 1080-square social post scaled to a 1440-wide hero without new art direction. Crop spec, not redesign.",
    },

    // ── LANDING PAGE HERO ──
    {
      id: "landing-hero",
      type: "hero",
      image: `${IMG}/loved-by-nordstrom-iphone-landing-page-corduroy-couch.jpg`,
      alt: "iPhone showing By Nordstrom landing page laid on corduroy couch",
      inline: true,
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "A Year on\nOne Icon.",
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
        "The Instagram heart was the argument. The rest was restraint. Keep the frame constant. Keep the typography quiet. Let the brand photography do the talking. The campaign ran long because there was nothing to get tired of. No swapping slogans. No reinventing the treatment for fall.\n\nThe tier between Liked and Loved gave merchandising a lever and gave designers a reason not to touch the layout every month. One icon, two levels, any asset. A year of output from a five-minute idea.",
    },
  ],
};
