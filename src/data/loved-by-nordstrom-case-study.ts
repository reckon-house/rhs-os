import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/loved-by-nordstrom";

export const lovedByNordstromCaseStudy: CaseStudy = {
  slug: "loved-by-nordstrom",
  title: "Loved by Nordstrom",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "A year of emerging-brand merchandising for Nordstrom, in stores and online. | One heart icon borrowed from Instagram, and twelve months built on top of it.",
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
        caption: "Preview · 9 frames",
        colors: ["#DAD7D2", "#605C66", "#BBAA8B", "#AF987F", "#CAC4BE"],
        images: [
          "/case-studies/loved-by-nordstrom/loved-by-nordstrom-ipad-tibi-tiles-held.jpg",
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
        "A year of emerging-brand merchandising for Nordstrom, in stores and online. | One heart icon borrowed from Instagram, and twelve months built on top of it.",
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
        { label: "Built", value: "A year-long campaign on one tile template, across social, email, in-store signage, and web" },
        { label: "Scope", value: "Creative direction, campaign design, design systems" },
        { label: "Tools", value: "Art direction, photography licensing, editorial systems" },
        { label: "Angle", value: "One borrowed icon, two tiers, any brand's photography." },
      ],
      abstract:
        "The brief was emerging brand awareness, a Nordstrom mandate to lift smaller designer labels on the department store floor and the digital storefront at the same time. The solve: borrow the heart icon from Instagram and let it carry the campaign.\n\nOne mark, two voices. \"Liked by Nordstrom\" sat on the smaller tiles for day-to-day merchandising and \"Loved by Nordstrom\" on the hero slots. Same icon, same typography, and merchandising had a dial they could turn without touching the design.\n\nTwelve months across social feeds, email sends, in-store signage, and web landing pages. The template used whatever photography a brand had already licensed, and the campaign ran long because there was nothing in it to get tired of.",
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
      title: "Nobody had to learn",
      // Held: the headline is the whole claim, and the column under it is
      // the proof. The claim stays on screen while the proof travels past.
      pressing: {
        mark: { n: "02", name: "The Heart" },
        heldLine: "what Liked By meant.",
        choreo: { pin: true },
      },
    },
    {
      id: "idea-text",
      type: "text",
      size: "subhead",
      content:
        "People already tapped that heart all day without thinking.",
    },
    {
      id: "idea-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The tiles ran on Instagram too, so the heart ended up back in the feed it came from.",
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
      title: "The middle slot took whatever",
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
        mark: { n: "03", name: "The Tile" },
        heldLine: "the brand had already licensed.",
        choreo: { pin: true, crossing: true },
      },
      group: { name: "system", bg: "#EFEAE4", radius: 75, padding: "60px" },
    },
    {
      id: "system-text",
      type: "text",
      size: "subhead",
      content:
        "Name on top, heart and endorsement at the base. Helmut Lang shot cold and minimal, The Great warm and narrative, See by Chloé led with product, and the tile carried all three.",
      group: { name: "system" },
    },
    {
      id: "system-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The grid, the type, and the icon were fixed. Everything else was open.",
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
      text: "Everyone already knew\nwhat the heart meant",
    },

    // ── LOVED BY HIERARCHY ──
    {
      id: "loved-header",
      type: "section-header",
      label: "SECTION 04: HIERARCHY",
      title: "Same heart and type at both sizes,",
      // Held because the tier is a lever, and a lever reads as one thing
      // only if the name of it stays put while the mechanics scroll by.
      pressing: {
        mark: { n: "04", name: "Liked and Loved" },
        heldLine: "one brand at a time on Loved.",
        choreo: { pin: true },
      },
    },
    {
      id: "loved-text",
      type: "text",
      size: "subhead",
      content:
        "Larger crops and tighter compositions on Loved. When TIBI got the Loved treatment, the fur coat and the profile portrait ran at full-page scale.",
    },
    {
      id: "loved-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Merchandising picked the tier. Weekly pushes went out as Liked and the seasonal flagships as Loved, and that was how priority got signaled, with no brief that said \"make this one bigger.\"",
    },

    // ── LARGE LOVED BY TILES ──
    // ── The wall on a screen, then the two tiles at its centre full
    // size: context, then detail.
    //
    // It climbs the BRIEF, not the pair. A climb reads as a plane
    // crossing another when the climber covers what it crosses, and at
    // plateWidth 800 this cannot cover a 1440 pair — it sat in the
    // middle of the two tiles and read as a sticker on them. Copy it
    // covers fine, which is what a riser off a held header gets.
    //
    // 800 rather than full bleed because the file is 1600px and a 1440
    // plate would draw it at 1.11x. 800 is its honest half, so it
    // centres in the column with air the way A.R.C.'s interface plates
    // do. Note the plate backstop does not catch this on its own:
    // `capped` only fires under 1400 native.
    {
      id: "loved-tiles-in-hand",
      type: "image",
      src: `${IMG}/loved-by-nordstrom-ipad-tibi-tiles-held.jpg`,
      alt: "A person in a mohair sweater holding a tablet showing the Loved by Nordstrom wall, the two large TIBI tiles at its centre",
      aspect: "native",
      pressing: {
        caption: "The wall, on a screen",
        plateWidth: 800,
        choreo: { rise: true },
      },
    },

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
      title: "The tile you saw in a feed was",
      // Held, and it is also the hold the landing page climbs. The point of
      // the section is recognition across surfaces, so the phone arriving
      // over a headline that has not moved is the argument acting itself out.
      pressing: {
        mark: { n: "05", name: "Across Channels" },
        heldLine: "the one you saw in the store window.",
        choreo: { pin: true },
      },
    },
    {
      id: "channels-text",
      type: "text",
      size: "subhead",
      content:
        "Only the size changed from one to the next.",
    },
    {
      id: "channels-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "On the landing page the stories were organized by brand, with the heart as the bookmark through the grid. The photography from a 1080-square social post scaled up to a 1440-wide hero with no new art direction, just a crop spec.",
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
      title: "Merchandising swapped brands in weekly",
      pressing: {
        mark: { n: "06", name: "Twelve Months" },
        heldLine: "with no creative brief.",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "The layout went the whole year untouched.",
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
        "The whole campaign came out of a five-minute idea.",
    },
  ],
};
