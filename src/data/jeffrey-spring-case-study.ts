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
  sections: [
    // ── HERO ──
    // 3x4 grid of all three dress stories (JW Anderson, Valentino, Simone
    // Rocha) interleaved with monstera leaves — the whole campaign in one frame.
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/jeffrey-spring-campaign-hero-grid-jw-anderson-valentino-simone-rocha-monstera-collage.jpg`,
      alt: "Jeffrey Spring Campaign hero collage: 3x4 grid weaving JW Anderson, Valentino, and Simone Rocha dress shots with cropped monstera leaves on studio white",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Jeffrey Spring\nCampaign.",
      subtitle:
        "High fashion on a studio budget. No location shoots. No heavy production. Foliage as architecture, not decoration.",
      field: "Art Direction  Campaign Design  Email & Web Templates",
      author: "Jeremy Prasatik",
      published: "2017",
      status: "Live",
      classification: ["Art Direction", "Campaign Design", "Email & Web Templates"],
      abstract:
        "Jeffrey needed a spring campaign that felt global but cost local. The restriction shaped everything.\n\nShot entirely in studio. Used bold foliage crops as structural anchors rather than styling props. Monstera leaves and palm fronds treated like graphic elements, not greenery. Color floods and extreme crops gave the compositions scale without a plane ticket.\n\nTypography followed the same logic. Condensed, stretched, layered to create rhythm across three dress stories: JW Anderson, Valentino, Simone Rocha. Built a system that moved cleanly across email, homepage, and social without redesign. Same visual language, different formats.",
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
      text: "Global feel.\nLocal cost.",
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
      title: "Same System.\nThree Designers.",
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
        "Repeatable week to week with minimal rework. The condensed-stretched-layered type system holds at desktop and at mobile. The foliage frame holds too. The dress is the only variable.",
    },

    // ── Simone Rocha pair: dress shot + matching desktop template
    {
      id: "simone-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/jeffrey-spring-campaign-simone-rocha-floral-dress-monstera-frame.jpg`,
        alt: "Simone Rocha black floral dress framed by extreme-cropped monstera leaves on a studio white",
      },
      right: {
        src: `${IMG}/jeffrey-spring-campaign-desktop-homepage-simone-rocha-in-season-bold.png`,
        alt: "Jeffrey desktop homepage featuring the same Simone Rocha dress with the IN SEASON BOLD READY & NOW headline alongside the monstera frame",
      },
    },

    // ── JW Anderson pair: dress shot + matching mobile template
    {
      id: "jw-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/jeffrey-spring-campaign-jw-anderson-striped-dress-monstera-frame.jpg`,
        alt: "JW Anderson blue striped asymmetric dress framed by monstera leaves",
      },
      right: {
        src: `${IMG}/jeffrey-spring-campaign-mobile-jw-anderson-in-season-bold-shop-now.png`,
        alt: "Jeffrey mobile template featuring the same JW Anderson dress with IN SEASON BOLD headline and SHOP NOW CTA, foliage frame intact at phone scale",
      },
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
      title: "Studio Whites.\nLeaf Greens.",
      introText:
        "Five colors, four type weights, two foliage crops. Same kit held across three designer stories without a single set change.",
      philosophyText:
        "The palette runs studio white as the ground, monstera green as the architecture, soft black for the type and the dresses that dropped into the set. The dresses themselves bring the seasonal accent — striped blue for JW Anderson, blush florals for Simone Rocha, whatever Valentino was sending that week.\n\nType is one family. Avenir Next in italic heavy for the Jeffrey wordmark, then Medium, Demi Bold, and Heavy for everything else. The foliage is a material, not a prop — two leaves shot once on white, then composed into every dress story in post.",
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
          sampleText: "Jeffrey",
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
      markImage: `${IMG}/jeffrey-spring-campaign-desktop-homepage-simone-rocha-in-season-bold.png`,
      markAlt: "Jeffrey desktop homepage as the brand expression in context — wordmark, type system, and foliage architecture all visible in one frame",
      markFullBleed: true,
    },

    // ── Foliage as material — the two graphic elements that anchor every
    // composition in the campaign. Shot once on studio white, dropped into
    // every dress story. Sits inside Marks & Materials because the leaves
    // ARE the brand material.
    {
      id: "foliage-pair",
      type: "dual-image",
      transparent: true,
      native: true,
      left: {
        src: `${IMG}/jeffrey-spring-campaign-monstera-leaf-graphic-detail.jpg`,
        alt: "Single monstera leaf shot tight on white, treated as a graphic material rather than a styling prop",
      },
      right: {
        src: `${IMG}/jeffrey-spring-campaign-palm-frond-texture-detail.jpg`,
        alt: "Palm frond texture detail with sharp blade structure shot on white studio backdrop, the second material in the foliage kit",
      },
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 04: CLOSING",
      title: "A Campaign Built\nfor the Studio.",
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
        "A retailer needed spring without the budget for spring. The system answers in foliage and typography — both shot once, both reused across every story the season needed.",
    },
  ],
};
