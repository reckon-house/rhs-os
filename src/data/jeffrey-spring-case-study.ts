import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/jeffrey-spring";

export const jeffreySpringCaseStudy: CaseStudy = {
  slug: "jeffrey-spring",
  title: "Jeffrey Spring Campaign.",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "High fashion on a studio budget. No location shoots. No heavy production. Foliage as architecture, not decoration.",
  field: "Art Direction\nCampaign Design\nEmail & Web Templates",
  author: "Jeremy Prasatik",
  published: "2017",
  status: "Live",
  classification: ["Art Direction", "Campaign Design", "Email & Web Templates"],
  services: ["Art Direction", "Campaign Design", "Email & Web Templates"],
  stack: ["Photoshop", "InDesign", "Studio photography"],
  links: [],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 6 frames",
        colors: ["#F5F2EC", "#A8B8C8", "#E8C4B8", "#3E5A39", "#1A1A18"],
        images: [
          "/case-studies/jeffrey-spring/jeffrey-spring-campaign-hero.jpg",
          "/case-studies/jeffrey-spring/jeffrey-spring-campaign-hero-grid-jw-anderson-valentino-simone-rocha-monstera-collage.jpg",
          "/case-studies/jeffrey-spring/jeffrey-spring-campaign-simone-rocha-floral-dress-monstera-frame.jpg",
          "/case-studies/jeffrey-spring/jeffrey-spring-campaign-jw-anderson-striped-dress-monstera-frame.jpg",
          "/case-studies/jeffrey-spring/jeffrey-spring-campaign-monstera-leaf-graphic-detail.jpg",
          "/case-studies/jeffrey-spring/jeffrey-spring-campaign-palm-frond-texture-detail.jpg",
        ],
      },
      title: "Jeffrey Spring\nCampaign.",
      subtitle:
        "High fashion on a studio budget. No location shoots. No heavy production. Foliage as architecture, not decoration.",
      field: "Art Direction  Campaign Design  Email & Web Templates",
      author: "Jeremy Prasatik",
      published: "2017",
      status: "Live",
      classification: ["Art Direction", "Campaign Design", "Email & Web Templates"],
      summary: [
        { label: "Built", value: "Spring campaign across email, homepage, social. Three dress stories: JW Anderson, Valentino, Simone Rocha" },
        { label: "Scope", value: "Art direction, campaign design, email and web templates" },
        { label: "Tools", value: "Photoshop, InDesign, studio photography. Color floods, extreme crops" },
        { label: "Angle", value: "High fashion on a studio budget. Foliage as architecture, not decoration. Scale without a plane ticket." },
      ],
      abstract:
        "Jeffrey needed a spring campaign that felt global but cost local. The restriction shaped everything.\n\nShot entirely in studio, with bold foliage crops working as structural anchors rather than styling props. Monstera leaves and palm fronds got treated like graphic elements instead of greenery, and color floods and extreme crops gave the compositions scale without a plane ticket.\n\nTypography followed the same logic. Condensed, stretched, and layered to create rhythm across three dress stories: JW Anderson, Valentino, Simone Rocha. Built as a single system that moved cleanly across email, homepage, and social without redesign.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/jeffrey-spring-campaign-hero.jpg`,
      alt: "Jeffrey Spring Campaign hero",
      pressing: { choreo: { rise: true } },
    },

    // ── Valentino template — campaign in context, second beat in the case
    // study. Shows the system working at desktop scale before the foliage
    // breakdown that follows.
    {
      id: "valentino-template",
      type: "image",
      src: `${IMG}/jeffrey-spring-campaign-desktop-homepage-valentino-pink-lace-dress-in-season-bold.png`,
      alt: "Jeffrey desktop homepage featuring the Valentino pink lace dress alongside cropped monstera leaves with the IN SEASON BOLD READY & NOW headline",
      aspect: "native",
      padded: true,
    },

    // ── Editorial palate cleanser
    {
      id: "headline-global",
      type: "editorial-headline",
      text: "Scale without\na plane ticket",
    },

    // ── Inline scaling hero — 3x4 grid of all three dress stories (JW Anderson,
    // Valentino, Simone Rocha) interleaved with monstera leaves. Lifted out of
    // the top hero slot and parked here as a visual breath after the editorial
    // headline. inline:true keeps the radius rounded at rest and animates on
    // scroll instead of full-bleeding.
    {
      id: "hero-grid-inline",
      type: "hero",
      image: `${IMG}/jeffrey-spring-campaign-hero-grid-jw-anderson-valentino-simone-rocha-monstera-collage.jpg`,
      alt: "Jeffrey Spring Campaign hero collage: 3x4 grid weaving JW Anderson, Valentino, and Simone Rocha dress shots with cropped monstera leaves on studio white",
      inline: true,
      // The zoom. A twelve-cell collage is unreadable at plate size and
      // legible at mat size, which is the whole case for this gesture.
      // contain, landscape frame.
      pressing: {
        plate: "02",
        captions: [
          "Campaign hero collage",
          "Three designers, one grid",
          "Monstera on studio white",
        ],
        instruction: "Scroll — fills the mat, then travels the frame",
        choreo: { zoom: true, zoomFit: "contain" },
      },
    },

    // ════════════════════════════════════════
    // SECTION 02 — THREE STORIES, ONE SYSTEM
    // (Each designer's dress shot paired with their template — same kit
    // applied three different ways. Shows the system in context.)
    // ════════════════════════════════════════
    {
      id: "stories-header",
      type: "section-header",
      label: "SECTION 02: THREE STORIES",
      title: "One System Holding",
      // The study's one crossing. It is also the only section header here,
      // so the choice is which staging, not which beat: standalone,
      // because it carries no method columns.
      //
      // No mid-page climb: the only dual-image with a plate after it is
      // followed by the Simone desktop capture, which is 1003px native and
      // already on the resolution report as thin at plate size. Drawing it
      // full-bleed as a riser would make that three times worse.
      pressing: {
        mark: { n: "02", name: "One System Holding" },
        heldLine: "Three Designer Stories.",
        choreo: { crossing: true },
      },
    },
    {
      id: "stories-subhead",
      type: "text",
      size: "subhead",
      content:
        "Drop the dress, set the foliage, ship the template. Every story carries the brand without a single redesign.",
    },
    {
      id: "stories-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Repeatable week to week with minimal rework. The condensed-stretched-layered type system holds at desktop and at mobile, the foliage frame holds at both, and the dress is the only variable.",
    },

    // ── Breathing room below the footnote before the 4-grid begins.
    { id: "footnote-spacer", type: "spacer", height: 32 },

    // ── Simone Rocha pair: mobile mockup (left, scaled down) + dress shot (right).
    // matchHeight: mobile mockup is portrait, dress is square — equal aspect
    // slots with object-contain so the mockup scales down with whitespace.
    {
      id: "simone-pair",
      type: "dual-image",
      transparent: true,
      matchHeight: true,
      left: {
        src: `${IMG}/jeffrey-spring-campaign-mobile-simone-rocha-in-season-bold-shop-now.png`,
        alt: "Jeffrey mobile template featuring the Simone Rocha dress with IN SEASON BOLD headline and SHOP NOW CTA, foliage frame intact at phone scale",
      },
      right: {
        src: `${IMG}/jeffrey-spring-campaign-simone-rocha-floral-dress-monstera-frame.jpg`,
        alt: "Simone Rocha black floral dress framed by extreme-cropped monstera leaves on a studio white",
      },
    },

    // ── Spacer between the two pairs — gives the 4-grid breathing room
    // between rows so the simone and jw pairs read as distinct beats.
    { id: "pair-spacer", type: "spacer", height: 40 },

    // ── JW Anderson pair: dress shot (left) + mobile mockup (right, scaled down).
    // Mirrors the simone-pair layout with the mockup on the opposite side
    // for visual rhythm.
    {
      id: "jw-pair",
      type: "dual-image",
      transparent: true,
      matchHeight: true,
      left: {
        src: `${IMG}/jeffrey-spring-campaign-jw-anderson-striped-dress-monstera-frame.jpg`,
        alt: "JW Anderson blue striped asymmetric dress framed by monstera leaves",
      },
      right: {
        src: `${IMG}/jeffrey-spring-campaign-mobile-jw-anderson-in-season-bold-shop-now.png`,
        alt: "Jeffrey mobile template featuring the same JW Anderson dress with IN SEASON BOLD headline and SHOP NOW CTA, foliage frame intact at phone scale",
      },
    },

    // ── Desktop mockup — third beat below the 4-grid. Anchors the section
    // by showing the same campaign system at full desktop scale after the
    // dress-to-mobile pairings above.
    {
      id: "simone-desktop",
      type: "image",
      src: `${IMG}/jeffrey-spring-campaign-desktop-homepage-simone-rocha-in-season-bold.png`,
      alt: "Jeffrey desktop homepage featuring the Simone Rocha dress with the IN SEASON BOLD READY & NOW headline alongside the monstera frame",
      aspect: "native",
      padded: true,
    },

    // ════════════════════════════════════════
    // SECTION 03 — MARKS & MATERIALS
    // (Foliage lives here too — the leaves ARE materials in this campaign,
    // shot once and reused across every story.)
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 03: MARKS & MATERIALS",
      title: "A Studio Palette\nBuilt Around Foliage.",
      introText:
        "Five colors, four type weights, two foliage crops - the same kit held across three designer stories without a single set change.",
      philosophyText:
        "The palette runs studio white as the ground, monstera green as the architecture, and soft black for the type and the dresses that dropped into the set. The dresses themselves bring the seasonal accent - striped blue for JW Anderson, blush florals for Simone Rocha, whatever Valentino was sending that week.\n\nType is one family. Avenir Next in italic heavy for the Jeffrey wordmark, then Medium, Demi Bold, and Heavy for everything else. The foliage works as a material rather than a prop - two leaves shot once on white, then composed into every dress story in post.",
      colors: [
        { name: "Studio White", hex: "#F5F2EC", description: "Ground, paper" },
        { name: "Striped Blue", hex: "#A8B8C8", description: "JW Anderson accent" },
        { name: "Blush", hex: "#E8C4B8", description: "Simone Rocha florals" },
        { name: "Monstera", hex: "#3E5A39", description: "Architecture, frame" },
        { name: "Soft Black", hex: "#1A1A18", description: "Type, dresses" },
      ],
      fonts: [
        {
          name: "JEFFREY",
          sampleText: "JEFFREY",
          role: "Wordmark",
          description:
            "Italic heavy sans for the brand wordmark. Set wide with the Atlanta/New York city tagline at smaller scale alongside. The only italic in the system — everything else stays upright.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 800,
          italic: true,
        },
        {
          name: "Avenir Next Medium",
          sampleText: "AVENIR NEXT MEDIUM",
          role: "Letter-spaced display",
          description:
            "Mid-weight Avenir Next set in uppercase with wide letter-spacing. Carries designer names and the IN SEASON BOLD campaign headline. Quiet enough to let the dress and foliage lead.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 500,
        },
        {
          name: "Avenir Next Demi Bold",
          role: "Subhead & emphasis",
          description:
            "One step heavier for subheads, callouts, and CTAs like SHOP NOW. The structural weight that anchors a layout without competing with the wordmark.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 600,
        },
        {
          name: "Avenir Next Heavy",
          role: "Headline weight",
          description:
            "Heaviest non-italic weight, used sparingly for headline moments inside the campaign templates. Pairs with the wordmark as the loudest the system gets.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 800,
        },
      ],
      // Mark slot: side-by-side foliage pair. The leaves ARE the brand
      // material, so this slot shows them as a complementary detail study
      // (monstera + palm frond) rather than another mockup screenshot.
      markImage: `${IMG}/jeffrey-spring-campaign-monstera-leaf-graphic-detail.jpg`,
      markAlt: "Single monstera leaf shot tight on white, treated as a graphic material rather than a styling prop",
      markImageRight: `${IMG}/jeffrey-spring-campaign-palm-frond-texture-detail.jpg`,
      markAltRight: "Palm frond texture detail with sharp blade structure shot on white studio backdrop, the second material in the foliage kit",
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 04: CLOSING",
      title: "A Campaign Built",
      pressing: {
        mark: { n: "03", name: "A Campaign Built" },
        heldLine: "for the Studio.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Foliage, type, layout. Same kit across three designer stories, three formats, every week of the season.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Art Direction", "Campaign Design", "Email & Web Templates"],
      stack: ["Photoshop", "InDesign", "Studio photography"],
      links: [],
      content:
        "A retailer needed spring without the budget for spring. The system answers in foliage and typography - both shot once, both reused across every story the season needed.",
    },
  ],
};
