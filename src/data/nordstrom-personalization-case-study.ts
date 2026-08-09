import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/nordstrom-personalization";

export const nordstromPersonalizationCaseStudy: CaseStudy = {
  slug: "nordstrom-personalization",
  title: "Nordstrom Personalization System",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "Mass scale, individual feel. A content engine built on three shapes that adapt to user, season, and story.",
  field: "Design Systems\nArt Direction\nProduct Photography Direction",
  author: "Jeremy Prasatik",
  published: "2015",
  status: "Complete",
  classification: [
    "Design Systems",
    "Art Direction",
    "Product Photography Direction",
  ],
  services: [
    "Design Systems",
    "Art Direction",
    "Product Photography Direction",
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
        "Mass scale, individual feel. A content engine built on three shapes that adapt to user, season, and story.",
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
        { label: "Built", value: "Content engine on three tile shapes. Square, hero, vertical, resizing across every breakpoint." },
        { label: "Scope", value: "Design systems, art direction, product photography direction." },
        { label: "Tools", value: "Nordstrom CMS, editorial templates, asset library. One asset, multiple applications." },
        { label: "Angle", value: "Personalization that stayed quiet underneath. Strict rules, loose output, mass scale that still looked hand-built." },
      ],
      abstract:
        "Nordstrom needed dynamic content for millions of customers without feeling algorithmic. The question: how does personalization keep personality?\n\nBuilt a flexible system around three tile shapes - square, hero, vertical - each designed to resize, remix, and reflow across mobile and desktop while holding visual consistency. Strict enough to scale, loose enough to surprise.\n\nProduct photography followed the same logic. Deliberate contrast, precise angles, no styling props, with each image holding its own as editorial or stacking into a grid as ecomm depending on context. One asset, multiple applications.\n\nThe system powered homepage layouts, campaign modules, and product tiles - relevant content at scale that still felt considered.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/nordstrom-personalization-system-design-laptop-website-interface-fashion-ecommerce-floral-field-outdoor-lifestyle.jpg`,
      alt: "Nordstrom homepage on a laptop in a field of daisies, showing personalized editorial tile layout with Beauty Queen and 90s Revibe stories",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE SYSTEM
    // ════════════════════════════════════════
    {
      id: "system-header",
      type: "section-header",
      label: "SECTION 02: THE SYSTEM",
      title: "Three Shapes Driving",
      pressing: {
        mark: { n: "02", name: "Three Shapes Driving" },
        heldLine: "Every Composition.",
      },
    },
    {
      id: "system-text",
      type: "text",
      size: "subhead",
      content:
        "Square, hero, vertical. Three tile shapes that resize, remix, and reflow across every breakpoint. The constraints created the freedom.",
    },
    {
      id: "system-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Editorial stories, brand modules, and merchandised picks all rendered through the same three shapes. Square tiles carried product, hero tiles carried photography, and vertical tiles bridged the two. Any combination produced a layout that looked designed, not assembled.",
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
          "One grid, three shapes",
        ],
        instruction: "Scroll — fills the mat, then travels the frame",
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
      title: "One Engine Driving",
      // The study's one crossing, on the claim the system exists to make.
      //
      // No mid-page climb: every dual-image here is followed by an
      // editorial headline or a section header, and the one plate that
      // could be reordered into place is 1520px native, already flagged
      // thin at plate size.
      pressing: {
        mark: { n: "03", name: "One Engine Driving" },
        heldLine: "Three Different Audiences.",
        choreo: { crossing: true },
      },
    },
    {
      id: "assembled-text",
      type: "text",
      size: "subhead",
      content:
        "Three audiences, three homepages, one engine. The young customer landed on Savvy Mag, the designer-brand shopper got Summer to Fall styling, and the men's shopper opened on city essentials. Same shapes, different stories - each composition felt edited rather than generated.",
    },

    // ── Showcase: Savvy Mag (young customer) — single, padded, large
    {
      id: "homepage-savvy",
      type: "image",
      src: `${IMG}/nordstrom-personalization-system-design-womens-fashion-lifestyle-products-floral-print-pajamas-pink-sweater-red-dress-black-boots-accessories-shopping-interface.jpg`,
      alt: "Nordstrom women's homepage for the young customer, Savvy Mag editorial with Drama Queen, Mac, and Summer Flings modules and personalized product grid",
      aspect: "native",
      padded: true,
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
      text: "Personalization that\nstayed quiet underneath",
    },

    // ════════════════════════════════════════
    // SECTION 04 — ACROSS DEVICES
    // ════════════════════════════════════════
    {
      id: "devices-header",
      type: "section-header",
      label: "SECTION 04: ACROSS DEVICES",
      title: "The Same Composition",
      pressing: {
        mark: { n: "04", name: "The Same Composition" },
        heldLine: "Logic on a Phone.",
      },
    },
    {
      id: "devices-text",
      type: "text",
      size: "subhead",
      content:
        "The three shapes restacked on phones without losing the editorial voice - same hero photography, same product cards, smaller canvas, same composition logic.",
    },

    // ── Savvy Mag editorial source — inline hero (the raw asset that templates into the system)
    {
      id: "device-source-hero",
      type: "hero",
      image: `${IMG}/nordstrom-personalization-system-design-woman-model-blue-floral-print-dress-black-white-geometric-strappy-heels-yellow-sofa-editorial.jpg`,
      alt: "Savvy Mag editorial source asset, woman in blue floral dress and geometric strappy heels on yellow sofa, paired with Drama Queen and Mac product tiles",
      inline: true,
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
      title: "Photography Built to",
      pressing: {
        mark: { n: "05", name: "Photography Built to" },
        heldLine: "Double as Editorial.",
      },
    },
    {
      id: "products-text",
      type: "text",
      size: "subhead",
      content:
        "Deliberate contrast, precise angles, no styling props. Each shot held its own as a hero or stacked into a grid as ecomm. The art direction was the system.",
    },
    {
      id: "products-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "White seamless, consistent eye level, the same shadow falloff on every product. Restraint that let the merchandise read first - when the same shoe appeared in a Saturday editorial story and a Sunday inventory clear-out, both placements looked planned.",
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
      title: "Mass Scale That Still",
      pressing: {
        mark: { n: "06", name: "Mass Scale That Still" },
        heldLine: "Looked Hand-Built.",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Three shapes and one asset library. The system stayed quiet so the content could feel hand-built, even when it wasn't.",
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
        "Personalization usually shows its work - algorithmic carousels, generic recommendation rails, blocks that feel templated even when they're tailored. This system did the opposite, with the constraints living underneath and the output looking like editorial.\n\nThe rules were simple enough that any merchandiser could compose a layout in an afternoon, and strict enough that no layout looked like the others. The same engine ran the homepage, campaign sends, and the long tail of category pages.",
    },
  ],
};
