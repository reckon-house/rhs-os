import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/loved-by-nordstrom";

export const lovedByNordstromCaseStudy: CaseStudy = {
  slug: "loved-by-nordstrom",
  title: "Loved by Nordstrom",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "A year-long Nordstrom campaign for smaller designer labels, in stores and online. | Every tile in the campaign was built on the heart icon borrowed from Instagram.",
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
        "A year-long Nordstrom campaign for smaller designer labels, in stores and online. | Every tile in the campaign was built on the heart icon borrowed from Instagram.",
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
        { label: "Angle", value: "Two tiers, Liked and Loved, ran on one tile that fit any brand's photography." },
      ],
      abstract:
        "The brief was emerging brand awareness, a Nordstrom mandate to lift smaller designer labels on the department store floor and the digital storefront at the same time. The answer was to borrow the heart icon from Instagram and build the campaign on it.\n\n\"Liked by Nordstrom\" sat on the smaller tiles for day-to-day merchandising and \"Loved by Nordstrom\" on the hero slots. Liked and Loved used the same icon and typography, so the merchandising team could raise or lower a brand's priority without touching the design.\n\nTwelve months of tiles went out across social feeds, email sends, in-store signage, and web landing pages. The template used whatever photography a brand had already licensed.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/loved-by-nordstrom-gallery-wall-campaign-tiles-tibi-center.jpg`,
      alt: "Loved by Nordstrom campaign gallery wall of brand tiles with two TIBI Loved by tiles at center",
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
        heldLine: "what Liked by Nordstrom meant.",
        choreo: { pin: true },
      },
    },
    {
      id: "idea-text",
      type: "text",
      size: "subhead",
      content:
        "People already tapped the Instagram heart all day without thinking.",
    },
    {
      // Feed posts, not stories (8 Oct 2026, his answer "posts"). The
      // phone picture below keeps "stories" in its filename; renaming it
      // touches the reel, the board and image-dimensions.ts.
      id: "idea-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Loved by Nordstrom tiles ran as Instagram posts, in the app the heart icon came from.",
    },

    // ── IPHONE INSTAGRAM HERO ──
    {
      id: "idea-hero",
      type: "hero",
      image: `${IMG}/loved-by-nordstrom-iphone-instagram-stories-tibi-trench.jpg`,
      alt: "iPhone showing TIBI Loved by Nordstrom post on Instagram laid on a beige trench coat",
      inline: true,
      // The zoom, placed early because this study opens on a long run of
      // copy. A phone photographed on the coat it is selling only reads
      // as that once the frame fills the mat.
      pressing: {
        plate: "02",
        captions: [
          "TIBI post on Instagram",
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
      title: "The middle of each tile held",
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
        heldLine: "whatever photography the brand had already licensed.",
        choreo: { pin: true, crossing: true },
      },
      group: { name: "system", bg: "#EFEAE4", radius: 75, padding: "60px" },
    },
    {
      id: "system-text",
      type: "text",
      size: "subhead",
      content:
        "Every tile had the brand name on top and the heart with Liked by or Loved by Nordstrom at the base. The template carried Helmut Lang's cold, minimal shoots, The Great's warm, narrative ones, and See by Chloé's product-first photography.",
      group: { name: "system" },
    },
    {
      id: "system-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The grid, the type and the icon were fixed on every tile.",
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
      text: "Nordstrom borrowed Instagram's heart\nto lift smaller designer labels",
    },

    // ── LOVED BY HIERARCHY ──
    {
      id: "loved-header",
      type: "section-header",
      label: "SECTION 04: HIERARCHY",
      title: "The Loved by Nordstrom hero slots",
      // Held because the tier is a lever, and a lever reads as one thing
      // only if the name of it stays put while the mechanics scroll by.
      pressing: {
        mark: { n: "04", name: "Liked and Loved" },
        heldLine: "went to one brand at a time.",
        choreo: { pin: true },
      },
    },
    {
      id: "loved-text",
      type: "text",
      size: "subhead",
      content:
        "The Loved tiles used larger crops and tighter compositions than the Liked ones. When TIBI got the Loved treatment, the fur coat photo and the profile portrait ran at full-page scale.",
    },
    {
      id: "loved-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Merchandisers signaled a brand's priority by picking its tier, Liked or Loved, with no brief that said \"make this one bigger.\"",
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
      // To re-set: both of these files set NORDSTROM in the serif
      // logotype, and so does the Instagram phone picture above, which
      // shows the portrait tile. Every tile should be in the tracked-out
      // sans (8 Oct 2026, his answer "it should all be tracked out sans"),
      // as the Liked tiles and the gallery wall are.
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
      title: "The same tile ran in your feed",
      // Held, and it is also the hold the landing page climbs. The point of
      // the section is recognition across surfaces, so the phone arriving
      // over a headline that has not moved is the argument acting itself out.
      pressing: {
        mark: { n: "05", name: "Across Channels" },
        heldLine: "and in the store window.",
        choreo: { pin: true },
      },
    },
    {
      id: "channels-text",
      type: "text",
      size: "subhead",
      content:
        "Only the tile's size changed from one channel to the next.",
    },
    {
      id: "channels-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "On the campaign's web landing page, the stories were organized by brand, and the heart worked as a bookmark through the grid. Photography from a 1080-square social post scaled up to a 1440-wide web hero with a crop spec and no new art direction.",
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
      title: "Nordstrom's merchandisers swapped brands in",
      pressing: {
        mark: { n: "06", name: "Twelve Months" },
        heldLine: "weekly, with no creative brief.",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "The tile template didn't change all year.",
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
        "For a year the same heart carried Helmut Lang, The Great, See by Chloé and TIBI, in the stores, on the site and on Instagram.",
    },
  ],
};
