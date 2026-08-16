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
        { label: "Built", value: "Logo, badges, typographic lockups, apparel graphics, and a campaign shot in West Texas" },
        { label: "Scope", value: "Brand identity, logo and badges, apparel graphics, photography" },
        { label: "Tools", value: "Illustrator, Photoshop, InDesign, a camera. Northwest and Oldman for the type" },
        { label: "Angle", value: "Marks and photographs by the same person, shot in the landscape the boots are made for." },
      ],
      abstract:
        "Capitan Boot Co. makes Western boots and needed a brand that could take the same wear. Stamps blur and embossing flattens out, so every mark had to come through that and still read, on a hangtag or across a banner.\n\nThe identity is a primary logo, secondary badges, typographic lockups, and a set of illustrations. Northwest Regular and Oldman Regular are the type pairing, and the bull skull lockup is drawn on a geometric grid. Every piece works stamped, stitched, embroidered, or printed.\n\nThe campaign was shot in West Texas, in Big Bend, mesa country, and river bottom, with no props, no stand-ins, and no styling beyond what was already there. The pictures come from the landscape the boots are made for.",
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
      title: "The buffalo, the badge,",
      // Pinned: the headline holds while the two copy blocks travel up
      // beside it. That hold is also what the badge plate below climbs.
      pressing: {
        mark: { n: "02", name: "The Marks" },
        heldLine: "and the bull skull.",
        choreo: { pin: true },
      },
    },
    {
      id: "marks-subhead",
      type: "text",
      size: "subhead",
      content:
        "A primary logo, secondary badges, typographic lockups, and a set of illustrations. The buffalo was drawn as a stamp first and an illustration second, since leather takes pressure and denim takes thread.",
    },
    {
      id: "marks-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The diamond badge below runs full bleed over Big Bend. The carousel under it runs the buffalo logo and the vintage badge small, closer to the size they'd be on a hangtag.",
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
      title: "Shot on location",
      // The study's one crossing, on the beat where the photography
      // arrives. The headline just says where it was shot; the cut is
      // the gesture, so the words stay short and plain.
      //
      // `pin` alongside `crossing`: the crossing already holds as part of
      // its own gesture, so the flag changes nothing on the page. It is
      // the A.R.C. convention for saying so in the data, which is what
      // the audit reads.
      pressing: {
        mark: { n: "03", name: "Big Bend" },
        heldLine: "in Big Bend.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "westtexas-subhead",
      type: "text",
      size: "subhead",
      content:
        "Mesa country, river bottom, grassland at last light. The lockups sit right on the photographs, which had to leave room for them.",
    },
    {
      id: "westtexas-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "No props or stand-ins, and nothing styled beyond what was already out there. The same person drew the marks and shot the pictures.",
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
      text: "A mesa in the badge,\na mesa in the photograph",
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
      title: "Cream, tan, olive, dark olive.\nNorthwest and Oldman.",
      introText:
        "Four colors and a type pairing. Every color, face, and lockup was tested on the real process before it went in.",
      philosophyText:
        "Each mark keeps its shape however roughly it gets reproduced. The bull skull lockup is drawn on a geometric grid, so the proportions stay put from a thumbnail stamp up to a banner.\n\nNorthwest carries the size and Oldman carries the character. Between them they're on the stamps, the banners, the labels, the packaging, and the apparel.",
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
            "Bold geometric sans, for stamps, banners, and product labels.",
          family: "'Northwest', 'Bebas Neue', sans-serif",
          weight: 400,
        },
        {
          name: "Oldman Regular",
          role: "Wordmark & headlines",
          description:
            "Hand-cut serif with rough edges. It's the primary wordmark, and it shows up on packaging and apparel.",
          family: "'Oldman', 'Playfair Display', Georgia, serif",
          weight: 400,
        },
        {
          name: "Northwest Round",
          role: "Soft display",
          description:
            "Rounded cut of Northwest, for softer surfaces where the sharp corners of the regular would be too much.",
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
      title: "On leather, paper,",
      pressing: {
        mark: { n: "04", name: "Leather, Paper, Denim" },
        heldLine: "and denim.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Marks, type, apparel graphics, and the campaign photography, from the first sketch to the last frame.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Brand Identity", "Logo System", "Apparel Graphics", "Photography"],
      stack: ["Illustrator", "Photoshop", "InDesign", "Camera"],
      links: [],
      content:
        "Boots get scuffed. The marks were drawn so that when they do, you can still tell whose boot it is.",
    },
  ],
};
