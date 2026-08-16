import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/nordstrom-personalization";

export const nordstromPersonalizationCaseStudy: CaseStudy = {
  slug: "nordstrom-personalization",
  title: "Nordstrom Personalization System",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "Personalized homepage content for Nordstrom, built on three tile shapes. | Pages for millions of people that still feel like they were made for one.",
  field: "Design Systems\nArt Direction\nProduct Photography Direction\nEcommerce Design",
  author: "Jeremy Prasatik",
  published: "2015",
  status: "Complete",
  classification: [
    "Design Systems",
    "Art Direction",
    "Product Photography Direction",
    "Ecommerce Design",
  ],
  services: [
    "Design Systems",
    "Art Direction",
    "Product Photography Direction",
    "Ecommerce Design",
  ],
  stack: ["Nordstrom CMS", "Editorial Templates", "Asset Library"],
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
        colors: ["#DEDBDA", "#3E4412", "#C6C6CB", "#615D24", "#D7C572"],
        images: [
          "/case-studies/nordstrom-personalization/nordstrom-personalization-homepage-laptop-mockup-hero.jpg",
          "/case-studies/nordstrom-personalization/nordstrom-personalization-system-design-laptop-website-interface-fashion-ecommerce-floral-field-outdoor-lifestyle.jpg",
          "/case-studies/nordstrom-personalization/nordstrom-personalization-system-design-beauty-queen-woman-floral-dress-autumn-leaves-boots-watches-bowling-balls-90s-revibe-editorial-lifestyle.jpg",
          "/case-studies/nordstrom-personalization/nordstrom-personalization-system-design-womens-fashion-lifestyle-products-floral-print-pajamas-pink-sweater-red-dress-black-boots-accessories-shopping-interface.jpg",
          "/case-studies/nordstrom-personalization/nordstrom-personalization-system-design-mens-fashion-essentials-sunglasses-sneakers-blazer-chinos-leather-accessories-ecommerce-lifestyle.jpg",
          "/case-studies/nordstrom-personalization/nordstrom-personalization-system-design-woman-model-black-leather-jacket-handbag-sunglasses-heels-white-studio-lifestyle-lookbook.jpg",
          "/case-studies/nordstrom-personalization/nordstrom-personalization-system-design-woman-model-blue-floral-print-dress-black-white-geometric-strappy-heels-yellow-sofa-editorial.jpg",
          "/case-studies/nordstrom-personalization/nordstrom-personalization-system-design-mobile-app-interface-fashion-lookbook-handbag-blazer-white-background-product-display.jpg",
          "/case-studies/nordstrom-personalization/nordstrom-personalization-system-design-mobile-phone-fashion-shopping-app-interface-white-surface-daisies-outdoor-lifestyle.jpg",
        ],
      },
      title: "Nordstrom\nPersonalization\nSystem",
      subtitle:
        "Personalized homepage content for Nordstrom, built on three tile shapes. | Pages for millions of people that still feel like they were made for one.",
      field: "Design Systems  Art Direction  Product Photography Direction",
      author: "Jeremy Prasatik",
      published: "2015",
      status: "Complete",
      classification: [
        "Design Systems",
        "Art Direction",
        "Product Photography Direction",
      ],
      summary: [
        { label: "Built", value: "Three tile shapes, square, hero, and vertical, that resize for every breakpoint." },
        { label: "Scope", value: "Design systems, art direction, product photography direction." },
        { label: "Tools", value: "Nordstrom CMS, editorial templates, asset library. One picture, used many ways." },
        { label: "Angle", value: "Strict rules, loose output." },
      ],
      abstract:
        "Nordstrom needed personalized content for millions of customers, and it couldn't look like a machine had made it.\n\nBuilt the layouts on three tile shapes, square, hero, and vertical, each one able to resize and restack across phone and desktop while the pages kept one look. The rules were strict enough to run at that scale, and the pages still came out different from each other.\n\nThe product photography followed the same rules. Deliberate contrast, precise angles, no styling props, so each image worked on its own as a story hero or stacked into a grid as ecomm.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/nordstrom-personalization-homepage-laptop-mockup-hero.jpg`,
      alt: "The personalized Nordstrom homepage open on a laptop, the Beauty Queen editorial running across the tile layout",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE SYSTEM
    // ════════════════════════════════════════
    {
      id: "system-header",
      type: "section-header",
      label: "SECTION 02: THE SYSTEM",
      title: "Every page is built from",
      pressing: {
        mark: { n: "02", name: "Three Shapes" },
        heldLine: "three tile shapes.",
        // The headline holds while both copy blocks travel up beside it.
        // "Three shapes" has to stay on screen through the paragraph that
        // names them, or the claim and its list never share a frame.
        choreo: { pin: true },
      },
    },
    {
      id: "system-text",
      type: "text",
      size: "subhead",
      content:
        "Square tiles carried product, hero tiles carried photography, and vertical tiles bridged the two.",
    },
    {
      id: "system-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Editorial stories, brand modules, and merchandised picks all came through the same three tiles, and any combination of them came out looking designed.",
    },

    // ── Tile collage — the system as raw composition
    {
      id: "system-collage",
      type: "image",
      src: `${IMG}/nordstrom-personalization-system-design-beauty-queen-woman-floral-dress-autumn-leaves-boots-watches-bowling-balls-90s-revibe-editorial-lifestyle.jpg`,
      alt: "Composed tile layout showing Beauty Queen editorial story, 90s Revibe lifestyle module, watches, and kicks for him product tiles",
      aspect: "native",
      padded: true,
      // The zoom. Three shapes assembling into one composition is the
      // section's claim, and the individual tiles have to be readable for
      // it to be checkable. No zoomFit: the frame is square, so filling
      // the width leaves a modest spill to pan.
      pressing: {
        plate: "02",
        captions: [
          "Composed tile layout",
          "Editorial, lifestyle, product",
          "Three shapes on one grid",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ════════════════════════════════════════
    // SECTION 03 — ASSEMBLED
    // ════════════════════════════════════════
    {
      id: "assembled-header",
      type: "section-header",
      label: "SECTION 03: ASSEMBLED",
      title: "A different homepage",
      // The study's one crossing, on the claim the system exists to make.
      //
      // pin declares in the data what the crossing already does, hold the
      // headline while the column scrubs past. The skin is unchanged; the
      // flag is there so the hold is readable without opening the layout.
      pressing: {
        mark: { n: "03", name: "Three Homepages" },
        heldLine: "for each shopper.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "assembled-text",
      type: "text",
      size: "subhead",
      content:
        "The young customer landed on Savvy Mag, the designer-brand shopper got Summer to Fall styling, and the men's shopper opened on city essentials. All of them were built from the one set of tiles.",
    },

    // ── Showcase: Savvy Mag (young customer) — single, padded, large
    {
      id: "homepage-savvy",
      type: "image",
      src: `${IMG}/nordstrom-personalization-system-design-womens-fashion-lifestyle-products-floral-print-pajamas-pink-sweater-red-dress-black-boots-accessories-shopping-interface.jpg`,
      alt: "Nordstrom women's homepage for the young customer, Savvy Mag editorial with Drama Queen, Mac, and Summer Flings modules and personalized product grid",
      aspect: "native",
      padded: true,
      // Climbs the crossing brief above. This is the first checkable
      // instance of the three-audiences claim, so it arrives over the
      // argument rather than a screen after it. Rise, not zoom: the file
      // is 1520px native and a zoom would draw it at twice its pixels.
      pressing: { choreo: { rise: true } },
    },

    // ── Supporting: Men's + Designer-brand women's — dual
    {
      id: "homepage-supporting",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: `${IMG}/nordstrom-personalization-system-design-mens-fashion-essentials-sunglasses-sneakers-blazer-chinos-leather-accessories-ecommerce-lifestyle.jpg`,
        alt: "Nordstrom men's homepage for the men's shopper, High City Essentials editorial with eyewear, men's designer modules, and selected for you product grid",
      },
      right: {
        src: `${IMG}/nordstrom-personalization-system-design-woman-model-black-leather-jacket-handbag-sunglasses-heels-white-studio-lifestyle-lookbook.jpg`,
        alt: "Nordstrom women's homepage for the designer-brand shopper, Summer to Fall Style editorial with Kate Spade pumps and selected for you product grid",
      },
    },

    // ── Editorial palate cleanser
    {
      id: "headline-1",
      type: "editorial-headline",
      text: "The customer never saw\nthe rules",
    },

    // ════════════════════════════════════════
    // SECTION 04 — ACROSS DEVICES
    // ════════════════════════════════════════
    {
      id: "devices-header",
      type: "section-header",
      label: "SECTION 04: ACROSS DEVICES",
      title: "The pictures came over as they were,",
      pressing: {
        mark: { n: "04", name: "On the Phone" },
        heldLine: "only the arrangement changed.",
        // Holds the headline through its copy, and the cluster reserves
        // the room the editorial source plate below climbs into.
        choreo: { pin: true },
      },
    },
    {
      id: "devices-text",
      type: "text",
      size: "subhead",
      content:
        "The hero photography and the product cards, restacked to fit the smaller screen.",
    },

    // ── Savvy Mag editorial source — inline hero (the raw asset that templates into the system)
    {
      id: "device-source-hero",
      type: "hero",
      image: `${IMG}/nordstrom-personalization-system-design-woman-model-blue-floral-print-dress-black-white-geometric-strappy-heels-yellow-sofa-editorial.jpg`,
      alt: "Savvy Mag editorial source asset, woman in blue floral dress and geometric strappy heels on yellow sofa, paired with Drama Queen and Mac product tiles",
      inline: true,
      // Rises across the devices brief. Order stays source then phones,
      // so the climb lands the desktop asset on the sentence about
      // restacking and the pair below shows the restack. 2982px native
      // is 18 short of the zoom bar, so it climbs instead of pinning.
      pressing: { choreo: { rise: true } },
    },

    // ── Two device mockups side by side — same system, different surfaces
    {
      id: "device-phones",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: `${IMG}/nordstrom-personalization-system-design-mobile-app-interface-fashion-lookbook-handbag-blazer-white-background-product-display.jpg`,
        alt: "Nordstrom mobile homepage on iPhone laid in grass, showing Summer to Fall Style hero with handbag and blazer modules",
      },
      right: {
        src: `${IMG}/nordstrom-personalization-system-design-mobile-phone-fashion-shopping-app-interface-white-surface-daisies-outdoor-lifestyle.jpg`,
        alt: "Nordstrom mobile homepage on iPhone laid on mirror reflecting clouds, showing Savvy Mag editorial with Drama Queen and Mac modules",
      },
    },

    // ════════════════════════════════════════
    // SECTION 05 — PRODUCT PHOTOGRAPHY
    // ════════════════════════════════════════
    {
      id: "products-header",
      type: "section-header",
      label: "SECTION 05: PRODUCT PHOTOGRAPHY",
      title: "Each shot had to work as a hero",
      pressing: {
        mark: { n: "05", name: "Product Shots" },
        heldLine: "and as a plain product listing.",
        // Held headline, two blocks travelling. Nothing climbs out of
        // this one: the product rows below are specimens laid on the
        // page, and a plate crossing them would read as a fourth shape.
        choreo: { pin: true },
      },
    },
    {
      id: "products-text",
      type: "text",
      size: "subhead",
      content:
        "White seamless, no props, one shadow throughout. The same shoe could run in a Saturday editorial story and a Sunday inventory clear-out and look planned in both places.",
    },
    {
      id: "products-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Consistent eye level, deliberate contrast, precise angles. With no styling to look at, the merchandise read first.",
    },

    // ── Product row 1 (3 — warm/playful)
    {
      id: "products-row-1",
      type: "triple-image",
      native: true,
      transparent: true,
      images: [
        { src: `${IMG}/nordstrom-personalization-product-orange-nylon-backpack.jpg`,         alt: "Orange nylon drawstring backpack on white background" },
        { src: `${IMG}/nordstrom-personalization-product-red-leather-pashli-handbag.jpg`,    alt: "Red leather Phillip Lim Pashli satchel handbag on white background" },
        { src: `${IMG}/nordstrom-personalization-product-pink-chevron-block-heels.jpg`,      alt: "Pink and olive chevron pattern block-heel pumps on white background" },
      ],
    },

    // ── Product row 2 (3 — cool/neutral)
    {
      id: "products-row-2",
      type: "triple-image",
      native: true,
      transparent: true,
      images: [
        { src: `${IMG}/nordstrom-personalization-product-saint-laurent-varsity-jacket-black.jpg`,   alt: "Saint Laurent black wool varsity jacket with white striped trim on white background" },
        { src: `${IMG}/nordstrom-personalization-product-saint-laurent-black-moto-jacket.jpg`,      alt: "Saint Laurent black leather moto jacket on white background" },
        { src: `${IMG}/nordstrom-personalization-product-white-leather-slingback-heels.jpg`,        alt: "White leather double-strap pointed slingback stiletto heels on white background" },
      ],
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "Any merchandiser could",
      pressing: {
        mark: { n: "06", name: "In an Afternoon" },
        heldLine: "lay out a page in an afternoon.",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Three shapes and one library of pictures, with every picture used more than once.",
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Design Systems",
        "Art Direction",
        "Product Photography Direction",
      ],
      stack: ["Nordstrom CMS", "Editorial Templates", "Asset Library"],
      links: [],
      content:
        "The tiles ran the homepage, campaign sends, and the long tail of category pages.",
    },
  ],
};
