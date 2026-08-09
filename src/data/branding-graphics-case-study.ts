import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/branding-graphics";

export const brandingGraphicsCaseStudy: CaseStudy = {
  slug: "branding-graphics",
  title: "Branding, Print & Apparel",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Graphic work. Album covers, gig posters, prints, logos. No single client. No single style. The point is fluency.",
  field: "Graphic Design\nAlbum Art\nPoster Design\nLogo Design\nPhoto Compositing",
  author: "Jeremy Prasatik",
  published: "2008 — 2018",
  status: "Ongoing",
  classification: [
    "Graphic Design",
    "Album Art",
    "Poster Design",
    "Logo Design",
    "Photo Compositing",
  ],
  services: [
    "Graphic Design",
    "Album Art",
    "Poster Design",
    "Logo Design",
    "Photo Compositing",
  ],
  stack: ["Photoshop", "Illustrator", "InDesign", "Camera", "Hand-rendering"],
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
        colors: ["#DCDDDD", "#380F03", "#9DB3AD", "#A89B8F", "#BBCFC9"],
        images: [
          "/case-studies/branding-graphics/branding-graphics-inna-foil-zine-orange-dress-lifestyle.jpg",
          "/case-studies/branding-graphics/okina.jpg",
          "/case-studies/branding-graphics/branding-graphics-abc-123-typography-poster-lifestyle.jpg",
          "/case-studies/branding-graphics/branding-graphics-tree-print-color-variations-green-wall.jpg",
          "/case-studies/branding-graphics/branding-graphics-tree-print-color-variations-blush-wall.jpg",
          "/case-studies/branding-graphics/branding-graphics-posters-sky-is-the-limit-abacus-pair.jpg",
          "/case-studies/branding-graphics/branding-graphics-verse02-light-waves-stripes-print.jpg",
          "/case-studies/branding-graphics/branding-graphics-candy-paint-sunburst-print.jpg",
        ],
      },
      title: "Branding,\nPrint &\nApparel",
      subtitle:
        "Graphic work. Album covers, gig posters, prints, logos. No single client. No single style. The point is fluency.",
      field: "Graphic Design  Album Art  Poster Design  Logo Design  Photo Compositing",
      author: "Jeremy Prasatik",
      published: "2008 — 2018",
      status: "Ongoing",
      classification: [
        "Graphic Design",
        "Album Art",
        "Poster Design",
        "Logo Design",
        "Photo Compositing",
      ],
      summary: [
        { label: "Built", value: "Four album covers, posters, prints, logos, a storefront window" },
        { label: "Scope", value: "Graphic design, album art, poster and logo design, photo compositing" },
        { label: "Tools", value: "Photoshop, Illustrator, InDesign, film camera, hand-rendering" },
        { label: "Angle", value: "No single client, no single style. Each mark sounds like the client, not the designer. The point is fluency." },
      ],
      abstract:
        "Every project here started the same way. Match the energy of something that doesn't exist yet.\n\nFour album covers, four completely different visual languages. Woodgrain collage and halftone geometry for a folk record. Grunge compositing with hand-rendered type for a pop artist. Linework landscapes stacked into depth for an ambient release. A portrait where saturated color carries the entire identity. Each one had to read at vinyl scale and survive as a thumbnail. No shared visual logic between them. That was the requirement.\n\nThe poster work follows the same approach. Atmospheric photography against dot-matrix grids. Radial color studies built from pattern. Double-exposure landscapes where texture replaces detail. These aren't decorative pieces. They're compositional puzzles solved on a deadline.\n\nLogos ranged from ornamental to blunt. Flowing botanical illustration for a fashion collective. Halftone dots and geometric sans for a DJ. A bird on a monogram for a lifestyle brand. The only consistency is that each mark sounds like the client, not the designer.\n\nThis is where the eye gets trained. Everything that came later started here.",
    },

    // ── HERO CAROUSEL ──
    // After the cover, not before it: the cover opens every study in this
    // language. A carousel has no climb of its own, so the handover here is
    // the plain one.
    {
      id: "hero",
      type: "hero-carousel",
      // Keep the single-hero footprint: mobile 5/4, desktop ~Inna's native 1.663
      // aspect (5/3), so switching to a carousel doesn't change the hero's size.
      aspectClassName: "aspect-[5/4] md:aspect-[5/3]",
      slides: [
        {
          src: `${IMG}/branding-graphics-inna-foil-zine-orange-dress-lifestyle.jpg`,
          alt: "Inna foil-printed zine cover with woman in orange dress, held in hands against blinds",
        },
        {
          src: `${IMG}/okina.jpg`,
          alt: "Okina brand identity, wordmark over an iridescent gradient",
        },
      ],
      pressing: { captions: ["Zine cover and wordmark"] },
    },

    // ════════════════════════════════════════
    // SECTION 02 — POSTERS & PRINTS
    // ════════════════════════════════════════
    {
      id: "posters-header",
      type: "section-header",
      label: "SECTION 02: POSTERS & PRINTS",
      title: "Each One Started",
      pressing: {
        mark: { n: "02", name: "Each One Started" },
        heldLine: "With a Blank Page.",
      },
    },
    {
      id: "posters-text",
      type: "text",
      size: "subhead",
      content:
        "Atmospheric photography against dot-matrix grids. Radial color studies built from pattern. Double-exposure landscapes where texture replaces detail.",
    },
    {
      id: "posters-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Not decorative. The pieces here range from collaged landscapes to typographic exercises to atmospheric prints. Different formal puzzles, same toolkit. Each one started with a blank page and a deadline, and the question was always which direction the piece would turn before the time ran out.",
    },

    // ── ABC 123 typography poster — single, padded
    {
      id: "poster-abc",
      type: "image",
      src: `${IMG}/branding-graphics-abc-123-typography-poster-lifestyle.jpg`,
      alt: "ABC 123 typography poster with patterned letterforms in pink, blue, and yellow, framed on speckled wall with monstera leaves",
      aspect: "native",
      padded: true,
    },

    // ── Tree print color studies — dual, native aspect
    {
      id: "tree-color-studies",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: `${IMG}/branding-graphics-tree-print-color-variations-green-wall.jpg`,
        alt: "Tree silhouette print color study, three framed prints on green wall",
      },
      right: {
        src: `${IMG}/branding-graphics-tree-print-color-variations-blush-wall.jpg`,
        alt: "Tree silhouette print color study, three framed prints on blush wall",
      },
    },

    // ── Sky / Abacus framed pair — already a baked-in pair photo
    {
      id: "poster-sky-abacus",
      type: "image",
      src: `${IMG}/branding-graphics-posters-sky-is-the-limit-abacus-pair.jpg`,
      alt: "Sky is the Limit cityscape poster paired with Abacus halftone dot poster, framed and hung on neutral wall",
      aspect: "native",
      padded: true,
    },

    // ── Verse02 + Candy Paint — dual
    {
      id: "framed-pair-1",
      type: "dual-image",
      transparent: true,
      left: {
        src: `${IMG}/branding-graphics-verse02-light-waves-stripes-print.jpg`,
        alt: "Verse02 Was It The Light Waves print, abstract striped pyramid composition in greys",
      },
      right: {
        src: `${IMG}/branding-graphics-candy-paint-sunburst-print.jpg`,
        alt: "Candy Paint sunburst print, radial pastel rays with halftone patterns",
      },
      // Held so the lake prints climb across it. The poster section is a long
      // even run of plates; this is the one lift in it.
      pressing: {
        captions: ["Verse02\nWas It The Light", "Candy Paint"],
        choreo: { pin: true },
      },
    },

    // ── Autumn lake reflection prints — climbs across the held pair
    {
      id: "poster-autumn-lake",
      type: "image",
      src: `${IMG}/branding-graphics-autumn-lake-reflection-prints-pair.jpg`,
      alt: "Autumn lake reflection prints, two framed pieces showing gold and red foliage mirrored in water",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── Cloud + Green Tree framed pair — dual, native aspect
    {
      id: "framed-pair-2",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: `${IMG}/branding-graphics-cloud-ribbons-print-wood-frame.jpg`,
        alt: "Cloud and ribbons illustration on dark red background, wood-framed print",
      },
      right: {
        src: `${IMG}/branding-graphics-green-tree-vines-print-white-frame.jpg`,
        alt: "Green tree silhouette over half-sun with vines, white-framed print",
      },
    },

    // ── Up Up & Away balloon — single, padded closer for the section
    {
      id: "poster-balloon",
      type: "image",
      src: `${IMG}/branding-graphics-up-up-and-away-balloon-poster-lifestyle.jpg`,
      alt: "Up Up and Away poster, hot-air balloon double-exposed with trees over yellow rapeseed field, framed on console with lamp",
      aspect: "native",
      padded: true,
    },

    // ════════════════════════════════════════
    // SECTION 03 — COVERS
    // ════════════════════════════════════════
    {
      id: "covers-header",
      type: "section-header",
      label: "SECTION 03: COVERS",
      title: "Four Records.",
      // The study's one crossing. Four sleeves with no shared logic IS the
      // fluency argument the whole study makes, so the gesture lands here
      // rather than on the marks section that only restates it.
      pressing: {
        mark: { n: "03", name: "Four Records" },
        heldLine: "Nothing in Common.",
        choreo: { crossing: true },
      },
    },
    {
      id: "covers-text",
      type: "text",
      size: "subhead",
      content:
        "Each one had to read at vinyl scale and survive as a thumbnail. No shared logic between them. That was the requirement.",
    },
    {
      id: "covers-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Woodgrain collage and halftone geometry for the folk record. Grunge compositing with hand-rendered type for the pop artist. Linework landscapes stacked into depth for the ambient release. A saturated portrait where the color does all the work. The brief on every project: match the energy of music that didn't exist yet.",
    },

    // ── Album covers — 2×2 grid that meets at the center, only outer corners rounded
    {
      id: "covers-grid",
      type: "quad-grid",
      images: [
        { src: `${IMG}/branding-graphics-album-dj-mia-portrait-headphones-vinyl-mockup.jpg`,        alt: "DJ MIA album cover, woman portrait with headphones and pink halftone treatment, vinyl sleeve mockup" },
        { src: `${IMG}/branding-graphics-album-blue-in-green-tree-woodgrain-vinyl-mockup.jpg`,     alt: "Blue in Green album cover, tree silhouette over woodgrain with collage textures, vinyl sleeve mockup" },
        { src: `${IMG}/branding-graphics-album-mvp-73-deer-letterform-vinyl-mockup.jpg`,           alt: "MVP 73 album cover, deer head with abstract letterform and triangle composition, vinyl sleeve mockup" },
        { src: `${IMG}/branding-graphics-album-cast-some-light-mountain-vinyl-mockup.jpg`,          alt: "Cast Some Light album cover, layered mountain landscape collage in muted greens and browns, vinyl sleeve mockup" },
      ],
    },

    // ── Editorial palate cleanser
    {
      id: "headline-1",
      type: "editorial-headline",
      text: "No single client.\nNo single style.",
    },

    // ════════════════════════════════════════
    // SECTION 04 — STOREFRONT
    // ════════════════════════════════════════
    {
      id: "storefront-header",
      type: "section-header",
      label: "SECTION 04: STOREFRONT",
      title: "From a 4x6",
      pressing: {
        mark: { n: "04", name: "From a 4x6" },
        heldLine: "to a Building.",
      },
    },
    {
      id: "storefront-text",
      type: "text",
      size: "subhead",
      content:
        "The Bokeh's Fall window translated the same atmospheric language to building scale. The source image is below, hand-shot on film. The window is what happened when it got blown out to street size and waited for foot traffic to find it.",
    },

    // ── Bokeh's Fall storefront — the zoom. The section's copy is about a
    // 4x6 film frame blown out to street size, and filling the mat then
    // travelling the frame is that sentence as a gesture.
    {
      id: "storefront-hero",
      type: "hero",
      image: `${IMG}/branding-graphics-bokehs-fall-storefront-window-display.jpg`,
      alt: "Bokeh's Fall storefront window display, large bokeh light photograph with overlay typography in modern building",
      inline: true,
      pressing: {
        plate: "04",
        captions: [
          "Bokeh's Fall",
          "Storefront window",
          "Photograph at street size",
        ],
        instruction: "Scroll — fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── Source bokeh photo — climbs across the held window. The order is the
    // argument: the building first, then the 4x6 it came from.
    {
      id: "storefront-source",
      type: "image",
      src: `${IMG}/branding-graphics-bokeh-lights-source-photograph.jpg`,
      alt: "Bokeh lights source photograph, warm orange and pink defocused points of light against dark background",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 05 — MARKS
    // ════════════════════════════════════════
    {
      id: "marks-header",
      type: "section-header",
      label: "SECTION 05: MARKS",
      title: "Logos that sound like the client.",
      pressing: {
        mark: { n: "05", name: "Logos that sound like the" },
        heldLine: "Not the designer.",
      },
    },
    {
      id: "marks-text",
      type: "text",
      size: "subhead",
      content:
        "Flowing botanical illustration for a fashion collective, halftone dots and geometric sans for a DJ, a bird on a monogram for a lifestyle brand. Range from ornamental to blunt.",
    },
    {
      id: "marks-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Whatever the brief asks for, the mark delivers without trying to add a signature. Five logos shown here, and nothing in the portfolio connects them except the hands that drew them. The signature lives in the range.",
    },

    // ── Marks — stacked vertically inside one white container.
    // Source files have wildly different aspects, so straight stack keeps each readable.
    {
      id: "mark-spear",
      type: "image",
      src: `${IMG}/branding-graphics-logo-spear-collective-art-nouveau-vines.jpg`,
      alt: "Spear Collective logo, art-nouveau script wordmark wrapped with vines and flowers",
      aspect: "native",
      maxWidth: 300,
      noRadius: true,
      group: { name: "marks-grid", bg: "#FFFFFF", radius: 60, padding: "60px" },
    },
    {
      id: "mark-hey-sd",
      type: "image",
      src: `${IMG}/branding-graphics-logo-hey-sd-stellar-jay-bird.jpg`,
      alt: "Hey SD logo, bold serif monogram with stellar jay bird perched on letterforms",
      aspect: "native",
      maxWidth: 300,
      noRadius: true,
      group: { name: "marks-grid" },
    },
    {
      id: "mark-okina",
      type: "image",
      src: `${IMG}/branding-graphics-logo-okina-orbit-wordmark.jpg`,
      alt: "Okina logo, planet-and-orbit wordmark in heavy black sans",
      aspect: "native",
      maxWidth: 300,
      noRadius: true,
      group: { name: "marks-grid" },
    },
    {
      id: "mark-dj-mia",
      type: "image",
      src: `${IMG}/branding-graphics-logo-dj-mia-halftone-dots.jpg`,
      alt: "DJ MIA logo, geometric sans wordmark above pink halftone dot fade",
      aspect: "native",
      maxWidth: 300,
      noRadius: true,
      group: { name: "marks-grid" },
    },
    {
      id: "mark-j-christianson",
      type: "image",
      src: `${IMG}/branding-graphics-logo-j-christianson-four-circle-mark.jpg`,
      alt: "J. Christianson logo, four-circle dot mark above engraved serif wordmark",
      aspect: "native",
      maxWidth: 300,
      noRadius: true,
      group: { name: "marks-grid" },
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "Where the Instincts",
      pressing: {
        mark: { n: "06", name: "Where the Instincts" },
        heldLine: "Get Built.",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Personal projects, deadline projects, album sleeves nobody asked for, logos for friends starting things. The fluency lives in the volume.",
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Graphic Design",
        "Album Art",
        "Poster Design",
        "Logo Design",
        "Photo Compositing",
      ],
      stack: ["Photoshop", "Illustrator", "InDesign", "Camera", "Hand-rendering"],
      links: [],
      content:
        "The commercial work that came later traces directly back to this output - compositional habits, color confidence, the willingness to start with a blank page and not know which direction the piece will turn.\n\nThis section will keep growing. Every new piece becomes another reference point.",
    },
  ],
};
