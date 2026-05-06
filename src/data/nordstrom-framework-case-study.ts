import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/nordstrom-framework";

export const nordstromFrameworkCaseStudy: CaseStudy = {
  slug: "nordstrom-framework",
  title: "Nordstrom Content Framework",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "Content taxonomy built from scratch. Custom typeface, icon set, naming language, and a system that organized everything from homepage to email to dedicated landing pages.",
  field: "Content Strategy\nBrand Design\nNaming",
  author: "Jeremy Prasatik",
  published: "2016",
  status: "Complete",
  classification: ["Content Strategy", "Brand Design", "Naming", "Design Systems"],
  services: ["Content Strategy", "Brand Design", "Naming", "Design Systems"],
  stack: [],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hero1.png`,
      alt: "Nordstrom Content Framework applied across the site, custom lockups powering the categorized homepage system",
    },

    // ── META + ABSTRACT ──
    {
      id: "meta",
      type: "meta",
      title: "Nordstrom\nContent Framework",
      subtitle:
        "Content taxonomy built from scratch. Custom typeface, icon set, naming language, and a system that organized everything from homepage to email to dedicated landing pages.",
      field: "Content Strategy  Brand Design  Naming",
      author: "Jeremy Prasatik",
      published: "2016",
      status: "Complete",
      classification: ["Content Strategy", "Brand Design", "Naming", "Design Systems"],
      abstract:
        "Nordstrom was producing more digital content than the site had structure for. Brand launches, seasonal pushes, occasion guides, new arrivals. All hitting email and site simultaneously with no organizing logic. Customers saw volume, not clarity.\n\nConcepted a content framework that sorted everything into named buckets, each with its own identity. \"What's Now\" for trending brands and arrivals. \"On Our List\" for seasonal picks. \"Where to Wear\" and \"Wear to Where\" for occasion dressing from opposite directions. Custom icons, dedicated typographic marks sourced specifically for the system. Magazine language, not menu language.\n\nPitched it across merchandising, marketing, and editorial. The framework became an internal organizing tool before it ever reached customers. Once it shipped, it powered homepage modules, email sections, and dedicated landing pages. Engagement lifted 22%. The vocabulary held for years.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE PROBLEM
    // ════════════════════════════════════════
    {
      id: "problem-header",
      type: "section-header",
      label: "SECTION 02: THE PROBLEM",
      title: "Volume Without\nVocabulary.",
    },
    {
      id: "problem-subhead",
      type: "text",
      size: "subhead",
      content:
        "Nordstrom's digital calendar was producing more stories than the site could absorb. Every new brand, seasonal push, and occasion guide landed on the homepage with the same weight as the next.",
    },
    {
      id: "problem-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Customers were getting volume without context. Merchandising, marketing, and editorial each pushed in parallel with no shared language for what any of it was. Email ran its own cadence. Landing pages followed a separate lifecycle. The only thread connecting any of it was the date on the calendar.",
    },

    // Visual beat showing the volume of modules
    {
      id: "problem-image",
      type: "image",
      src: `${IMG}/hero3.png`,
      alt: "Nordstrom homepage with multiple content modules running side by side under the new framework",
      aspect: "native",
      padded: true,
    },

    // ════════════════════════════════════════
    // SECTION 03 — THE FRAMEWORK
    // ════════════════════════════════════════
    {
      id: "framework-header",
      type: "section-header",
      label: "SECTION 03: THE FRAMEWORK",
      title: "Four Buckets,\nFour Identities.",
    },
    {
      id: "framework-subhead",
      type: "text",
      size: "subhead",
      content:
        "Sorted everything into four named categories. Each got its own typographic mark, custom icon, and a tone of voice that read editorial instead of navigational.",
    },
    {
      id: "framework-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "\"What's Now\" was for arrivals and trending brands. \"On Our List\" framed seasonal picks and essentials. \"Where to Wear\" approached occasion dressing from the event side. \"Wear to Where\" came at it from the outfit side. Same question, opposite angles. The naming had to feel like a magazine masthead instead of a navigation menu. Sourced custom typefaces for each lockup so no two marks shared a face.",
    },

    // Editorial palate cleanser
    {
      id: "headline-language",
      type: "editorial-headline",
      text: "Magazine language,\nnot menu language",
    },

    // ── The 3 lockups, stacked
    {
      id: "lockup-whats-now",
      type: "image",
      src: `${IMG}/nordstrom-content-framework-lockup-whats-now.jpg`,
      alt: "What's Now lockup, custom typographic mark and category icon for the trending brands and new arrivals bucket",
      aspect: "native",
      padded: true,
    },
    {
      id: "lockup-where-to-wear",
      type: "image",
      src: `${IMG}/nordstrom-content-framework-lockup-where-to-wear.jpg`,
      alt: "Where to Wear lockup, custom typographic mark and category icon for the occasion dressing bucket",
      aspect: "native",
      padded: true,
    },
    {
      id: "lockup-on-our-list",
      type: "image",
      src: `${IMG}/nordstrom-content-framework-lockup-on-our-list.jpg`,
      alt: "On Our List lockup, custom typographic mark and category icon for the seasonal picks bucket",
      aspect: "native",
      padded: true,
    },

    // ════════════════════════════════════════
    // SECTION 04 — APPLICATION
    // ════════════════════════════════════════
    {
      id: "application-header",
      type: "section-header",
      label: "SECTION 04: APPLICATION",
      title: "Homepage,\nEmail, Landing.",
    },
    {
      id: "application-subhead",
      type: "text",
      size: "subhead",
      content:
        "The framework powered homepage modules, dedicated email sections, and full landing pages built around a single bucket. Each piece carried the matching icon and lockup, so customers could read the signal anywhere they encountered it.",
    },
    {
      id: "application-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "More important: the framework worked as an internal tool before it reached anyone outside. Planning meetings used the same vocabulary. Content calendars mapped stories to buckets at the brief stage. Teams stopped treating each campaign as a one-off and started thinking in categories. The customer-facing system was the artifact of an organizational shift that had already happened.",
    },

    // Tall application hero
    {
      id: "application-hero",
      type: "image",
      src: `${IMG}/hero2.png`,
      alt: "Nordstrom Content Framework applied across a full vertical landing page, lockups and category icons anchoring each module",
      aspect: "native",
      padded: true,
    },

    // Final supporting hero
    {
      id: "application-secondary",
      type: "image",
      src: `${IMG}/hero4.png`,
      alt: "Nordstrom Content Framework section showing email and landing treatment with custom lockup and icon",
      aspect: "native",
      padded: true,
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "Names Before\nTemplates.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Engagement lifted 22% once the framework rolled out. The bigger outcome was internal: every team that touched digital content was now speaking the same language about it.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Content Strategy", "Brand Design", "Naming", "Design Systems"],
      stack: [],
      links: [],
      content:
        "The framework held for years and became foundational vocabulary across the digital organization. Icons evolved. Typography refreshed. Buckets renamed. The structure underneath stayed the same.",
    },
  ],
};
