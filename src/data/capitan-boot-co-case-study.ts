import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/capitan-boot-co";

export const capitanBootCoCaseStudy: CaseStudy = {
  slug: "capitan-boot-co",
  title: "Capitan Boot Co.",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Western branding built to stamp, stitch, and emboss. Logo marks, typography, badges, and apparel graphics for a boot company rooted in heritage craft.",
  field: "Brand Identity\nLogo System\nApparel Graphics\nPhotography",
  author: "Jeremy Prasatik",
  published: "2018",
  status: "Live",
  classification: ["Brand Identity", "Logo System", "Apparel Graphics", "Photography"],
  services: ["Brand Identity", "Logo System", "Apparel Graphics", "Photography"],
  stack: ["Illustrator", "Photoshop", "InDesign", "Camera"],
  links: [],
  heroImage: "",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/capitan-boot-co-western-original-desert-landscape-cattle-skull-logo-prickly-pear-cactus-agave-plants-arid-mountains-branding-campaign.jpg`,
      alt: "Four-panel West Texas landscape collage with the Capitan Boot Co. cattle skull lockup centered across the seam",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Capitan\nBoot Co.",
      subtitle:
        "Western branding built to stamp, stitch, and emboss. Logo marks, typography, badges, and apparel graphics for a boot company rooted in heritage craft.",
      field: "Brand Identity  Logo System  Apparel Graphics  Photography",
      author: "Jeremy Prasatik",
      published: "2018",
      status: "Live",
      classification: ["Brand Identity", "Logo System", "Apparel Graphics", "Photography"],
      abstract:
        "Capitan needed an identity that could work as hard as the product. Boots get scuffed, stamps blur, embossing flattens - the marks had to survive all of that and still read at every scale.\n\nBuilt the system as interlocking elements - primary logo, secondary badges, typographic lockups, illustrative assets. Northwest Regular and Oldman Regular as the type pairing. The bull skull lockup constructs on a geometric grid. Each piece holds at stamp, stitch, embroidery, or print.\n\nShot the campaign in West Texas. Big Bend, mesa country, river bottom. No props, no stand-ins, no styling beyond what the place already had. The photography had to come from inside the landscape the boots are made for, not from a moodboard built around it.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE MARKS
    // ════════════════════════════════════════
    {
      id: "marks-header",
      type: "section-header",
      label: "SECTION 02: THE MARKS",
      title: "Marks Built\nto Hold.",
    },
    {
      id: "marks-subhead",
      type: "text",
      size: "subhead",
      content:
        "Leather takes pressure. Denim takes thread. The marks had to survive both and still read at thumbnail.",
    },
    {
      id: "marks-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The system carries primary logo, secondary badges, typographic lockups, illustrative assets. Range comes before decoration. Each piece holds at small scale and at full bleed alike.",
    },

    // ── Auto-cycling logo carousel (full bleed, each slide carries its own bg)
    {
      id: "logo-carousel",
      type: "logo-carousel",
      interval: 5000,
      slides: [
        {
          src: `${IMG}/buffalo-logo.png`,
          alt: "Capitan Boot Co. buffalo logo, beige bison silhouette over barbed-wire flourish with Make Your Mark tagline",
          bg: "#2A2A1A",
          maxWidth: 240,
        },
        {
          src: `${IMG}/capitan-boot-co-branding-western-logo-desert-cactus-rock-formation-vintage-outdoors-landscape-design.png`,
          alt: "Capitan Boot Co. vintage badge logo with mesa, prickly pear cacti, and ESTD 2020 stars",
          bg: "#EFEAD9",
          maxWidth: 360,
        },
      ],
    },

    // ════════════════════════════════════════
    // SECTION 03 — WEST TEXAS
    // ════════════════════════════════════════
    {
      id: "westtexas-header",
      type: "section-header",
      label: "SECTION 03: WEST TEXAS",
      title: "Quiet. Weathered.\nReal.",
    },
    {
      id: "westtexas-subhead",
      type: "text",
      size: "subhead",
      content:
        "Brand imagery shot on location. Big Bend, mesa country, river bottom. The marks needed photography that didn't fight them.",
    },
    {
      id: "westtexas-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "No props. No stand-ins. The location was the styling. Same hands on the marks, same hands on the camera.",
    },

    // ── Inline hero: Golden grassland with framed Western Original inset
    {
      id: "westtexas-grassland",
      type: "hero",
      image: `${IMG}/capitan-boot-co-western-branding-desert-landscape-mountains-clouds-golden-grassland-outdoor-lifestyle-campaign.jpg`,
      alt: "Golden grassland and mountain horizon with a framed Western Original inset hovering over the same terrain",
      inline: true,
    },

    // ── Buffalo silhouette over desert
    {
      id: "westtexas-buffalo",
      type: "image",
      src: `${IMG}/capitan-boot-co-western-original-buffalo-silhouette-desert-landscape-mesa-mountains-sage-brush-terrain-branding-campaign.jpg`,
      alt: "Cream buffalo silhouette set over a mesa-and-sage West Texas vista with Western Original arrow flourishes",
      aspect: "native",
      padded: true,
    },

    // ── Inline hero: WESTERN × ORIGINAL river landscape
    {
      id: "westtexas-river-hero",
      type: "hero",
      image: `${IMG}/capitan-boot-co-branding-western-desert-landscape-winding-river-rolling-hills-sage-brush-terrain-original-typography-campaign.jpg`,
      alt: "Big Bend river bottom at dusk with Western Original typographic lockup centered over rolling hills and sage terrain",
      inline: true,
    },

    // ── Synthesis image: diamond badge over Big Bend
    {
      id: "westtexas-diamond-badge",
      type: "image",
      src: `${IMG}/capitan-boot-co-western-original-logo-design-buffalo-bison-diamond-badge-mountain-desert-landscape-branding.jpg`,
      alt: "Capitan Boot Co. diamond badge logo with bison and Western Original lockup, set over Big Bend desert landscape at golden hour",
      aspect: "native",
      padded: true,
    },

    // ── Editorial palate cleanser
    {
      id: "headline-heritage",
      type: "editorial-headline",
      text: "Heritage without\nfeeling dated",
    },

    // ════════════════════════════════════════
    // SECTION 04 — MARKS & MATERIALS
    // (Absorbs the former SECTION 04 "THE SYSTEM": the bull skull spread is now
    // the primary mark image, the typography spread is generated as color bands
    // from the palette + fonts data.)
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 04: MARKS & MATERIALS",
      title: "Identity Built\nfor the Material.",
      introText:
        "Marks made for stamp, stitch, embroidery, print. Every color, every face, every lockup tested against the process before it earned a place in the system.",
      philosophyText:
        "The system carries primary logo, secondary badges, typographic lockups, and illustrative assets, each one holding shape under load. Range comes before decoration.\n\nNorthwest carries scale, Oldman carries character, and the bull skull lockup constructs on a geometric grid. The buffalo lives as a stamp first and an illustration second. Every choice traces back to where the boot ends up.",
      colors: [
        { name: "Cream", hex: "#EFEAD9", description: "Paper, hangtags" },
        { name: "Tan", hex: "#C4B594", description: "Photography, leather" },
        { name: "Olive", hex: "#5A5945", description: "Mid-tones, accents" },
        { name: "Dark Olive", hex: "#2A2A1A", description: "Structure, ground" },
      ],
      fonts: [
        {
          name: "Northwest Regular",
          sampleText: "Northwest",
          role: "Display & signage",
          description:
            "Bold geometric sans-serif. Carries scale on stamps, banners, and product labels. Holds at any size, survives any process.",
          family: "'Northwest', 'Bebas Neue', sans-serif",
          weight: 400,
        },
        {
          name: "Oldman Regular",
          role: "Wordmark & headlines",
          description:
            "Hand-cut serif with rough edges. Carries character on packaging and apparel. Used for the primary wordmark and editorial moments.",
          family: "'Oldman', 'Playfair Display', Georgia, serif",
          weight: 400,
        },
        {
          name: "Northwest Round",
          role: "Soft display",
          description:
            "Rounded variant of Northwest. Used where the sharp edges of the regular would feel too aggressive on softer surfaces.",
          family: "'Northwest Round', 'Russo One', sans-serif",
          weight: 400,
        },
        {
          name: "Times New Roman",
          role: "Body & legal",
          description:
            "Default serif for fine print, certifications, and copy that runs long. The least precious font in the system.",
          family: "'Times New Roman', Times, serif",
          weight: 400,
        },
      ],
      markImage: `${IMG}/capitan-boot-co-branding-system-color-palette-logo-western-original-bull-skull-horns-arrows-dark-green-beige-geometric-grid-design.jpg`,
      markAlt: "Capitan Boot Co. bull skull lockup centered on split olive and taupe ground, geometric construction grid visible behind the mark",
      markFullBleed: true,
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "Built for Where\nthe Boots Go.",
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Identity, marks, typography, photography. Same hands from brief through last frame.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Brand Identity", "Logo System", "Apparel Graphics", "Photography"],
      stack: ["Illustrator", "Photoshop", "InDesign", "Camera"],
      links: [],
      content:
        "Capitan asked for branding that could survive where the boots end up. The system holds at every surface, and the photography came from the same place the boots are made for.",
    },
  ],
};
