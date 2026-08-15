import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/capitan-boot-co";

export const capitanBootCoCaseStudy: CaseStudy = {
  slug: "capitan-boot-co",
  title: "Capitan Boot Co.",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Brand identity for Capitan Boot Co., a Western boot maker: logo, type, badges, and apparel graphics. | Built to be stamped into leather, stitched, and embossed, and still read.",
  field: "Brand Identity\nLogo System\nApparel Graphics\nPhotography",
  author: "Jeremy Prasatik",
  published: "2018",
  status: "Live",
  classification: ["Brand Identity", "Logo System", "Apparel Graphics", "Photography"],
  services: ["Brand Identity", "Logo System", "Apparel Graphics", "Photography"],
  stack: ["Illustrator", "Photoshop", "InDesign", "Camera"],
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
        colors: ["#EFEAD9", "#C4B594", "#5A5945", "#2A2A1A"],
        images: [
          "/case-studies/capitan-boot-co/capitan-boot-co-western-original-desert-landscape-cattle-skull-logo-prickly-pear-cactus-agave-plants-arid-mountains-branding-campaign.jpg",
          "/case-studies/capitan-boot-co/capitan-boot-co-western-branding-desert-landscape-mountains-clouds-golden-grassland-outdoor-lifestyle-campaign.jpg",
          "/case-studies/capitan-boot-co/capitan-boot-co-western-original-buffalo-silhouette-desert-landscape-mesa-mountains-sage-brush-terrain-branding-campaign.jpg",
          "/case-studies/capitan-boot-co/capitan-boot-co-branding-western-desert-landscape-winding-river-rolling-hills-sage-brush-terrain-original-typography-campaign.jpg",
          "/case-studies/capitan-boot-co/capitan-boot-co-western-original-logo-design-buffalo-bison-diamond-badge-mountain-desert-landscape-branding.jpg",
          "/case-studies/capitan-boot-co/capitan-boot-co-branding-system-color-palette-logo-western-original-bull-skull-horns-arrows-dark-green-beige-geometric-grid-design.jpg",
        ],
      },
      title: "Capitan\nBoot Co.",
      subtitle:
        "Brand identity for Capitan Boot Co., a Western boot maker: logo, type, badges, and apparel graphics. | Built to be stamped into leather, stitched, and embossed, and still read.",
      field: "Brand Identity  Logo System  Apparel Graphics  Photography",
      author: "Jeremy Prasatik",
      published: "2018",
      status: "Live",
      classification: ["Brand Identity", "Logo System", "Apparel Graphics", "Photography"],
      summary: [
        { label: "Built", value: "Logo system, badges, typographic lockups, apparel graphics, West Texas campaign" },
        { label: "Scope", value: "Brand identity, logo system, apparel graphics, photography" },
        { label: "Tools", value: "Illustrator, Photoshop, InDesign, camera. Northwest and Oldman type pairing" },
        { label: "Angle", value: "Marks built to survive the material. Stamp, stitch, emboss, and still read at every scale." },
      ],
      abstract:
        "Capitan needed an identity that could work as hard as the product. Boots get scuffed, stamps blur, embossing flattens - the marks had to survive all of that and still read at every scale.\n\nBuilt the identity as interlocking pieces - primary logo, secondary badges, typographic lockups, illustrations. Northwest Regular and Oldman Regular as the type pairing. The bull skull lockup constructs on a geometric grid. Each piece holds at stamp, stitch, embroidery, or print.\n\nShot the campaign in West Texas. Big Bend, mesa country, river bottom. No props, no stand-ins, no styling beyond what the place already had. The photography had to come from inside the landscape the boots are made for, not from a moodboard built around it.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/capitan-boot-co-western-original-desert-landscape-cattle-skull-logo-prickly-pear-cactus-agave-plants-arid-mountains-branding-campaign.jpg`,
      alt: "Four-panel West Texas landscape collage with the Capitan Boot Co. cattle skull lockup centered across the seam",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE MARKS
    // ════════════════════════════════════════
    {
      id: "marks-header",
      type: "section-header",
      label: "SECTION 02: THE MARKS",
      title: "Marks Built",
      // Pinned: the headline holds while the two copy blocks travel up
      // beside it. That hold is also what the badge plate below climbs.
      pressing: {
        mark: { n: "02", name: "Marks Built" },
        heldLine: "to Hold.",
        choreo: { pin: true },
      },
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
        "It includes a primary logo, secondary badges, typographic lockups, and illustrations. Range comes before decoration. Each piece holds at small scale and at full bleed alike.",
    },

    // ── Diamond badge over Big Bend. Climbs the marks brief, which
    // reserves the room for it.
    //
    // It used to close the West Texas run. Four plates there needed a
    // second hold, and section 03 carries one plate numeral, so the
    // second hold would have been a second zoom fighting the mark spine.
    // The badge belongs to the marks anyway: the footnote directly above
    // claims these hold at full bleed, so show that first and let the
    // carousel run the same badges at thumbnail underneath it.
    {
      id: "westtexas-diamond-badge",
      type: "image",
      src: `${IMG}/capitan-boot-co-western-original-logo-design-buffalo-bison-diamond-badge-mountain-desert-landscape-branding.jpg`,
      alt: "Capitan Boot Co. diamond badge logo with bison and Western Original lockup, set over Big Bend desert landscape at golden hour",
      aspect: "native",
      padded: true,
      pressing: {
        caption: "Diamond badge\nBison and lockup",
        choreo: { rise: true },
      },
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
      title: "Quiet. Weathered.",
      // The study's one crossing. Three words that ARE the brand brief, on
      // the beat where the photography arrives — the shortest headline in
      // the study, so the cut reads cleanly.
      //
      // `pin` alongside `crossing`: the crossing already holds as part of
      // its own gesture, so the flag changes nothing on the page. It is
      // the A.R.C. convention for saying so in the data, which is what
      // the audit reads.
      pressing: {
        mark: { n: "03", name: "Quiet. Weathered" },
        heldLine: "Real.",
        choreo: { pin: true, crossing: true },
      },
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

    // ── Inline hero: Golden grassland with framed Western Original inset.
    // Climbs the crossing, which reserves the room for it. This is the
    // first photograph after the argument for the photography, so the
    // climb is the arrival. It rises rather than zooms because the frame
    // is a wide vista that reads whole at flow width; the mat would only
    // give it a longer horizon.
    {
      id: "westtexas-grassland",
      type: "hero",
      image: `${IMG}/capitan-boot-co-western-branding-desert-landscape-mountains-clouds-golden-grassland-outdoor-lifestyle-campaign.jpg`,
      alt: "Golden grassland and mountain horizon with a framed Western Original inset hovering over the same terrain",
      inline: true,
      pressing: {
        caption: "Golden grassland\nWestern Original inset",
        choreo: { rise: true },
      },
    },

    // ── Buffalo silhouette over desert — the zoom. No dual-image in this
    // study to hold a riser, so the zoom is the hold (PRESSING.md §5), and
    // the mark over open country is the frame worth filling the mat with.
    // No zoomFit: the frame is near-square, so the spill is a short pan
    // rather than a landscape's worth.
    {
      id: "westtexas-buffalo",
      type: "image",
      src: `${IMG}/capitan-boot-co-western-original-buffalo-silhouette-desert-landscape-mesa-mountains-sage-brush-terrain-branding-campaign.jpg`,
      alt: "Cream buffalo silhouette set over a mesa-and-sage West Texas vista with Western Original arrow flourishes",
      aspect: "native",
      padded: true,
      pressing: {
        plate: "03",
        captions: [
          "Buffalo silhouette",
          "Mesa and sage terrain",
          "Western Original arrows",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── WESTERN × ORIGINAL river landscape — climbs across the held buffalo
    {
      id: "westtexas-river-hero",
      type: "hero",
      image: `${IMG}/capitan-boot-co-branding-western-desert-landscape-winding-river-rolling-hills-sage-brush-terrain-original-typography-campaign.jpg`,
      alt: "Big Bend river bottom at dusk with Western Original typographic lockup centered over rolling hills and sage terrain",
      inline: true,
      pressing: { choreo: { rise: true } },
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
        "Marks made for stamp, stitch, embroidery, print. Every color, every face, every lockup tested against the process before it made the cut.",
      philosophyText:
        "There is a primary logo, secondary badges, typographic lockups, and a set of illustrations, and each one keeps its shape however roughly it gets reproduced. Range comes before decoration.\n\nNorthwest handles scale, Oldman brings character, and the bull skull lockup constructs on a geometric grid. The buffalo lives as a stamp first and an illustration second. Every choice traces back to where the boot ends up.",
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
            "Default serif for fine print, certifications, and copy that runs long. The least precious font of the bunch.",
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
      title: "Built for Where",
      pressing: {
        mark: { n: "04", name: "Built for Where" },
        heldLine: "the Boots Go.",
      },
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
        "Capitan asked for branding that could survive where the boots end up. The marks hold up on every material, and the photography came from the same place the boots are made for.",
    },
  ],
};
