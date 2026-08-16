import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/jeffrey-spring";

export const jeffreySpringCaseStudy: CaseStudy = {
  slug: "jeffrey-spring",
  title: "Jeffrey Spring Campaign.",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "A spring campaign for Jeffrey, shot entirely in the studio. | High fashion on a studio budget, with foliage doing the work of a location.",
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
        "A spring campaign for Jeffrey, shot entirely in the studio. | High fashion on a studio budget, with foliage doing the work of a location.",
      field: "Art Direction  Campaign Design  Email & Web Templates",
      author: "Jeremy Prasatik",
      published: "2017",
      status: "Live",
      classification: ["Art Direction", "Campaign Design", "Email & Web Templates"],
      summary: [
        { label: "Built", value: "Spring campaign for email, homepage and social. Three dress stories: JW Anderson, Valentino, Simone Rocha" },
        { label: "Scope", value: "Art direction, campaign design, email and web templates" },
        { label: "Tools", value: "Photoshop, InDesign, studio photography. Color floods, extreme crops" },
        { label: "Angle", value: "Monstera and palm fronds cropped big enough to read as architecture, so a white studio could pass for somewhere far away." },
      ],
      abstract:
        "Jeffrey needed a spring campaign that felt like it had gone somewhere, on a budget that stayed home. Everything about it came out of that.\n\nIt was shot in the studio, start to finish. Monstera leaves and palm fronds were cropped big and used as graphic elements, more like architecture than greenery, and color floods and extreme crops made the compositions feel bigger than the room they were shot in.\n\nThe type followed the same idea, condensed, stretched and layered for rhythm across three dress stories: JW Anderson, Valentino, Simone Rocha. The whole thing was one kit that ran on email, the homepage and social.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/jeffrey-spring-campaign-hero.jpg`,
      alt: "Jeffrey Spring Campaign hero",
      pressing: { choreo: { rise: true } },
    },

    // ── 3x4 grid of all three dress stories (JW Anderson, Valentino,
    // Simone Rocha) interleaved with monstera leaves. Moved up to the
    // second beat: the collage is the whole campaign at once, and every
    // section after it is that same kit in one format at a time, so it
    // reads as the premise rather than a recap. Being here also gives the
    // Valentino plate below it something that holds — a zoom reserves its
    // own risetail. inline:true is a classic-renderer field; pressing
    // ignores it.
    {
      id: "hero-grid-inline",
      type: "hero",
      image: `${IMG}/jeffrey-spring-campaign-hero-grid-jw-anderson-valentino-simone-rocha-monstera-collage.jpg`,
      alt: "Jeffrey Spring Campaign hero collage: 3x4 grid weaving JW Anderson, Valentino, and Simone Rocha dress shots with cropped monstera leaves on studio white",
      inline: true,
      // The zoom. A twelve-cell collage is unreadable at plate size and
      // legible at mat size, which is the whole case for this gesture.
      // 3076px native, clear of the ~3000px floor.
      pressing: {
        plate: "02",
        captions: [
          "Campaign hero collage",
          "Three designers at once",
          "Monstera on studio white",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── Valentino template — one story pulled out of the grid above and
    // shown at desktop scale. Climbs the zoom plate's tail, so the capture
    // arrives out of the collage it belongs to instead of sitting under it.
    // 2000px native, under the zoom floor, so it rises.
    {
      id: "valentino-template",
      type: "image",
      src: `${IMG}/jeffrey-spring-campaign-desktop-homepage-valentino-pink-lace-dress-in-season-bold.png`,
      alt: "Jeffrey desktop homepage featuring the Valentino pink lace dress alongside cropped monstera leaves with the IN SEASON BOLD READY & NOW headline",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── Editorial palate cleanser. Dropped below the climb so the plate
    // above it neighbours the zoom; it now lands as the beat between the
    // opening run and Section 02, which is where a palate cleanser belongs.
    {
      id: "headline-global",
      type: "editorial-headline",
      text: "Two leaves\nand a typeface",
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
      title: "JW Anderson, Valentino,",
      // The study's one crossing. It is also the only section header here,
      // so the choice is which staging, not which beat: standalone,
      // because it carries no method columns.
      //
      // `pin` alongside `crossing` changes nothing on the page — the
      // crossing already holds its own headline for the gesture. It names
      // the hold in the data, which is what the audit reads.
      pressing: {
        mark: { n: "02", name: "Three Designers" },
        heldLine: "Simone Rocha.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "stories-subhead",
      type: "text",
      size: "subhead",
      content:
        "Swap the dress, set the leaves, and the page is done. That was the whole template, for all three.",
    },
    {
      id: "stories-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The pairs below are the dress shot next to the phone template it went into. The type reads at phone size, the leaves still frame the dress, and the desktop version underneath is the same layout with more room.",
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
    // for visual rhythm. Pinned because it is the second of the two pairs,
    // so the section's last beat climbs both phone stories rather than
    // interrupting between them.
    {
      id: "jw-pair",
      type: "dual-image",
      transparent: true,
      matchHeight: true,
      pressing: { choreo: { pin: true } },
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
    // dress-to-mobile pairings above. This is the study's mid-page climb:
    // it rises across the pinned JW pair, which is the right neighbour for
    // it, since the payoff of two phone stories is the desktop they share.
    //
    // Noted, not hidden: the file is 1003px native and already on the
    // resolution report as thin, so a full-bleed climb stretches it
    // further. Rule 1 makes no exception for small plates, and the fix for
    // the softness is a bigger export, not a plate that sits.
    {
      id: "simone-desktop",
      type: "image",
      src: `${IMG}/jeffrey-spring-campaign-desktop-homepage-simone-rocha-in-season-bold.png`,
      alt: "Jeffrey desktop homepage featuring the Simone Rocha dress with the IN SEASON BOLD READY & NOW headline alongside the monstera frame",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
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
      title: "Five colors, four weights,\nmonstera and palm.",
      introText:
        "That is the whole kit, and it ran across all three designer stories with no set change between them.",
      philosophyText:
        "Studio white for the ground, monstera green for the architecture, soft black for the type and for the dresses that dropped into the set. The dresses bring the seasonal accent: striped blue for JW Anderson, blush florals for Simone Rocha, whatever Valentino was sending that week.\n\nThe type is one family, Avenir Next, italic Heavy for the Jeffrey wordmark and Medium, Demi Bold and Heavy for everything else. The foliage got treated like a material. Two leaves shot once on white, then composed into every dress story in post.",
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
            "Italic Heavy for the wordmark, set wide, with the Atlanta/New York tagline small alongside it. It is the only italic in the campaign.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 800,
          italic: true,
        },
        {
          name: "Avenir Next Medium",
          sampleText: "AVENIR NEXT MEDIUM",
          role: "Letter-spaced display",
          description:
            "Set in uppercase with wide letter-spacing for the designer names and the IN SEASON BOLD headline. Light enough that the dress and the leaves come first.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 500,
        },
        {
          name: "Avenir Next Demi Bold",
          role: "Subhead & emphasis",
          description:
            "One step heavier, for subheads, callouts and the SHOP NOW button.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 600,
        },
        {
          name: "Avenir Next Heavy",
          role: "Headline weight",
          description:
            "The heaviest upright weight, used sparingly for headline moments inside the templates.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 800,
        },
      ],
      // Mark slot: side-by-side foliage pair. The leaves ARE the brand
      // material, so this slot shows them as a complementary detail study
      // (monstera + palm frond) rather than another mockup screenshot.
      markImage: `${IMG}/jeffrey-spring-campaign-monstera-leaf-graphic-detail.jpg`,
      markAlt: "Single monstera leaf shot tight on white, treated as a graphic material",
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
      title: "A new dress every week,",
      pressing: {
        mark: { n: "03", name: "Every Week" },
        heldLine: "the rest stayed put.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Three designer stories in three formats: email, the homepage and social.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Art Direction", "Campaign Design", "Email & Web Templates"],
      stack: ["Photoshop", "InDesign", "Studio photography"],
      links: [],
      content:
        "That was the whole season, and nobody had to leave the studio to make it.",
    },
  ],
};
