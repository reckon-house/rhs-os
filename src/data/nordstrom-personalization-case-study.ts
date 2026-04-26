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
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/nordstrom-personalization-system-design-laptop-website-interface-fashion-ecommerce-floral-field-outdoor-lifestyle.jpg`,
      alt: "Nordstrom homepage on a laptop in a field of daisies, showing personalized editorial tile layout with Beauty Queen and 90s Revibe stories",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
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
      abstract:
        "Nordstrom needed dynamic content for millions of customers without feeling algorithmic. The question: how does personalization keep personality?\n\nBuilt a flexible system around three tile shapes. Square, hero, vertical. Each designed to resize, remix, and reflow across mobile and desktop while holding visual consistency. The constraints created the freedom.\n\nProduct photography followed the same logic. Deliberate contrast, precise angles, no styling props. Each image could function as editorial or convert like ecomm depending on context. One asset, multiple applications.\n\nThe system powered homepage layouts, campaign modules, and product tiles. Relevant content at scale that still felt considered.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE SYSTEM
    // ════════════════════════════════════════
    {
      id: "system-header",
      type: "section-header",
      label: "SECTION 02: THE SYSTEM",
      title: "Three Shapes.\nInfinite Compositions.",
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
        "Editorial stories, brand modules, and merchandised picks all rendered through the same three shapes. Square tiles carried product. Hero tiles carried photography. Vertical tiles bridged the two. Any combination produced a layout that read as designed, not assembled.",
    },

    // ── Tile collage — the system as raw composition
    {
      id: "system-collage",
      type: "image",
      src: `${IMG}/nordstrom-personalization-system-design-beauty-queen-woman-floral-dress-autumn-leaves-boots-watches-bowling-balls-90s-revibe-editorial-lifestyle.jpg`,
      alt: "Composed tile layout showing Beauty Queen editorial story, 90s Revibe lifestyle module, watches, and kicks for him product tiles",
      aspect: "native",
      padded: true,
    },

    // ════════════════════════════════════════
    // SECTION 03 — ASSEMBLED
    // ════════════════════════════════════════
    {
      id: "assembled-header",
      type: "section-header",
      label: "SECTION 03: ASSEMBLED",
      title: "Same System.\nDifferent Story Every Day.",
    },
    {
      id: "assembled-text",
      type: "text",
      size: "subhead",
      content:
        "Three audiences. Three homepages. One engine. The young customer landed on Savvy Mag. The designer-brand shopper got Summer to Fall styling. The men's shopper opened on city essentials. Same shapes, different stories. Each composition felt edited, not generated.",
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
      text: "Mass scale.\nIndividual feel.",
    },

    // ════════════════════════════════════════
    // SECTION 04 — ACROSS DEVICES
    // ════════════════════════════════════════
    {
      id: "devices-header",
      type: "section-header",
      label: "SECTION 04: ACROSS DEVICES",
      title: "Mobile Reflow.\nNothing Lost in Translation.",
    },
    {
      id: "devices-text",
      type: "text",
      size: "subhead",
      content:
        "The three shapes restacked on phones without losing the editorial voice. Same hero photography. Same product cards. Smaller canvas, same composition logic.",
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
      title: "One Asset.\nMultiple Applications.",
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
        "White seamless. Consistent eye level. The same shadow falloff on every product. Restraint that let the merchandise read first. When the same shoe appeared in a Saturday editorial story and a Sunday inventory clear-out, both placements felt intentional.",
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
      title: "Personalization\nWith Personality.",
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Three shapes. One asset library. The system stayed quiet so the content could feel hand-built, even when it wasn't.",
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
        "Personalization usually shows its work. Algorithmic carousels, generic recommendation rails, blocks that read as templated even when they're tailored. This system did the opposite. The constraints lived underneath. The output looked like editorial.\n\nThe rules were simple enough that any merchandiser could compose a layout in an afternoon. Strict enough that no layout looked like the others. The same engine ran the homepage, campaign sends, and the long tail of category pages. One system, every surface.",
    },
  ],
};
