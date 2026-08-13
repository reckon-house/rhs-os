import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/nordstrom-framework";

export const nordstromFrameworkCaseStudy: CaseStudy = {
  slug: "nordstrom-framework",
  title: "Nordstrom Content Framework",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "Content taxonomy built from scratch. Custom typeface, icon set, naming language, and a system that organized everything from homepage to email to dedicated landing pages.",
  field: "Content Strategy\nBrand Design\nNaming\nEcommerce Design",
  author: "Jeremy Prasatik",
  published: "2016",
  status: "Complete",
  classification: ["Content Strategy", "Brand Design", "Naming", "Design Systems", "Ecommerce Design"],
  services: ["Content Strategy", "Brand Design", "Naming", "Design Systems", "Ecommerce Design"],
  stack: [],
  links: [],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META + ABSTRACT ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 3 frames",
        colors: ["#E5DCD3", "#6E706E", "#918C88", "#61605E", "#403934"],
        images: [
          "/case-studies/nordstrom-framework/nordstrom-content-framework-lockup-whats-now.jpg",
          "/case-studies/nordstrom-framework/nordstrom-content-framework-lockup-where-to-wear.jpg",
          "/case-studies/nordstrom-framework/nordstrom-content-framework-lockup-on-our-list.jpg",
        ],
      },
      title: "Nordstrom\nContent Framework",
      subtitle:
        "Content taxonomy built from scratch. Custom typeface, icon set, naming language, and a system that organized everything from homepage to email to dedicated landing pages.",
      field: "Content Strategy  Brand Design  Naming",
      author: "Jeremy Prasatik",
      published: "2016",
      status: "Complete",
      classification: ["Content Strategy", "Brand Design", "Naming", "Design Systems"],
      summary: [
        { label: "Built", value: "Content taxonomy from scratch. Four named buckets, each with its own typographic mark and icon." },
        { label: "Scope", value: "Content strategy, brand design, naming, design systems." },
        { label: "Tools", value: "Custom-sourced typefaces, icon set, naming language. No two lockups share a face." },
        { label: "Angle", value: "Magazine language, not menu language. The framework organized the teams before it ever reached a customer." },
      ],
      abstract:
        "Nordstrom was producing more digital content than the site had structure for. Brand launches, seasonal pushes, occasion guides, new arrivals. All hitting email and site simultaneously with no organizing logic. Customers saw volume, not clarity.\n\nConcepted a content framework that sorted everything into named buckets, each with its own identity. \"What's Now\" for trending brands and arrivals. \"On Our List\" for seasonal picks. \"Where to Wear\" and \"Wear to Where\" for occasion dressing from opposite directions. Custom icons, dedicated typographic marks sourced specifically for the system. Magazine language, not menu language.\n\nPitched it across merchandising, marketing, and editorial. The framework became an internal organizing tool before it ever reached customers. Once it shipped, it powered homepage modules, email sections, and dedicated landing pages. Engagement lifted 22%. The vocabulary held for years.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hero1.png`,
      alt: "Nordstrom Content Framework applied across the site, custom lockups powering the categorized homepage system",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE PROBLEM
    // ════════════════════════════════════════
    {
      id: "problem-header",
      type: "section-header",
      label: "SECTION 02: THE PROBLEM",
      title: "Volume Without",
      pressing: {
        mark: { n: "02", name: "Volume Without" },
        heldLine: "Vocabulary.",
        // Holds while the column travels, and reserves the room the
        // homepage plate below needs to climb. Fitting for a brief whose
        // subject is a page carrying too much at once.
        choreo: { pin: true },
      },
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

    // Visual beat showing the volume of modules. Climbs the problem brief:
    // the copy names the pile-up, then the homepage slides up over it and
    // shows it. hero3 is 1540 native, far short of the 3000 a zoom asks
    // for, so it rises.
    {
      id: "problem-image",
      type: "hero",
      image: `${IMG}/hero3.png`,
      alt: "Nordstrom homepage with multiple content modules running side by side under the new framework",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 03 — THE FRAMEWORK
    // ════════════════════════════════════════
    {
      id: "framework-header",
      type: "section-header",
      label: "SECTION 03: THE FRAMEWORK",
      title: "Four Buckets,",
      // The study's one crossing, on the move that solved the problem.
      //
      // Pinned as well as crossing, which is PRESSING.md's brief form of
      // the gesture: the four-bucket argument is the longest column in
      // the study, so the headline holds and the column travels past it
      // rather than sharing one screen with it.
      pressing: {
        mark: { n: "03", name: "Four Buckets" },
        heldLine: "Four Identities.",
        choreo: { pin: true, crossing: true },
      },
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

    // ── The 3 lockups, as a specimen row
    // They were three stacked full-width plates, which the choreography
    // rules cannot hold: a plate either climbs the section above it or
    // grows out of the column, and three in a row leaves the second and
    // third with nothing above them that holds still. Nothing in the
    // study can sit between them either, so the set becomes one row.
    //
    // The row is also the honest size for these files. 2418px native is
    // crisp to about 1200 CSS and a full-width plate draws past that; at
    // a third of the row they are well inside their own pixels. And the
    // claim the set exists to make, that no two lockups share a face,
    // only reads when the three marks are side by side.
    //
    // No pin: nothing climbs it. This is the one row in the study that
    // holds nothing.
    {
      id: "lockups",
      type: "triple-image",
      native: true,
      images: [
        {
          src: `${IMG}/nordstrom-content-framework-lockup-whats-now.jpg`,
          alt: "What's Now lockup, custom typographic mark and category icon for the trending brands and new arrivals bucket",
        },
        {
          src: `${IMG}/nordstrom-content-framework-lockup-where-to-wear.jpg`,
          alt: "Where to Wear lockup, custom typographic mark and category icon for the occasion dressing bucket",
        },
        {
          src: `${IMG}/nordstrom-content-framework-lockup-on-our-list.jpg`,
          alt: "On Our List lockup, custom typographic mark and category icon for the seasonal picks bucket",
        },
      ],
    },

    // ════════════════════════════════════════
    // SECTION 04 — APPLICATION
    // ════════════════════════════════════════
    {
      id: "application-header",
      type: "section-header",
      label: "SECTION 04: APPLICATION",
      title: "Homepage,",
      pressing: {
        mark: { n: "04", name: "Homepage" },
        heldLine: "Email, Landing.",
        // Pins for the headline alone. Three surfaces get named in the
        // column and the landing page below answers all three, so the
        // title should still be on screen when the reader reaches it.
        // Nothing climbs this brief: the zoom plate reserves its own room.
        choreo: { pin: true },
      },
    },
    {
      id: "application-subhead",
      type: "text",
      size: "subhead",
      content:
        "The framework powered homepage modules, dedicated email sections, and full landing pages built around a single bucket. Each piece held the matching icon and lockup, so customers could read the signal anywhere they encountered it.",
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
      // The zoom. A full vertical landing page is exactly the frame the
      // default fit was built for: it fills the width and leaves most of
      // its height below the fold, so scrolling travels the page the way
      // a customer would. No zoomFit.
      pressing: {
        plate: "04",
        captions: [
          "The framework applied",
          "Full landing page",
          "Lockup and icon per module",
        ],
        instruction: "Scroll — fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
      aspect: "native",
      padded: true,
    },

    // Final supporting hero. Climbs the zoom plate's held screen, which is
    // the only hold in the study taken from a plate rather than a brief.
    // hero4 is 1540 native and already on the resolution report, so the
    // climb draws it larger than its pixels really allow. Rule 1 has no
    // exception for a small file, and zoom is not available to it either
    // (that wants 3000+), so it rises and the file is the thing to fix.
    {
      id: "application-secondary",
      type: "hero",
      image: `${IMG}/hero4.png`,
      alt: "Nordstrom Content Framework section showing email and landing treatment with custom lockup and icon",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "Names Before",
      pressing: {
        mark: { n: "05", name: "Names Before" },
        heldLine: "Templates.",
      },
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
