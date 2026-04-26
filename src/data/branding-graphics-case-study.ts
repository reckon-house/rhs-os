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
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/branding-graphics-inna-foil-zine-orange-dress-lifestyle.jpg`,
      alt: "Inna foil-printed zine cover with woman in orange dress, held in hands against blinds",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
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
      abstract:
        "Every project here started the same way. Match the energy of something that doesn't exist yet.\n\nFour album covers, four completely different visual languages. Woodgrain collage and halftone geometry for a folk record. Grunge compositing with hand-rendered type for a pop artist. Linework landscapes stacked into depth for an ambient release. A portrait where saturated color carries the entire identity. Each one had to read at vinyl scale and survive as a thumbnail. No shared visual logic between them. That was the requirement.\n\nThe poster work follows the same approach. Atmospheric photography against dot-matrix grids. Radial color studies built from pattern. Double-exposure landscapes where texture replaces detail. These aren't decorative pieces. They're compositional puzzles solved on a deadline.\n\nLogos ranged from ornamental to blunt. Flowing botanical illustration for a fashion collective. Halftone dots and geometric sans for a DJ. A bird on a monogram for a lifestyle brand. The only consistency is that each mark sounds like the client, not the designer.\n\nThis is where the eye gets trained. Everything that came later started here.",
    },

    // ════════════════════════════════════════
    // SECTION 02 — POSTERS & PRINTS
    // ════════════════════════════════════════
    {
      id: "posters-header",
      type: "section-header",
      label: "SECTION 02: POSTERS & PRINTS",
      title: "Each One Started\nWith a Blank Page.",
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
    },

    // ── Autumn lake reflection prints — already a baked pair photo
    {
      id: "poster-autumn-lake",
      type: "image",
      src: `${IMG}/branding-graphics-autumn-lake-reflection-prints-pair.jpg`,
      alt: "Autumn lake reflection prints, two framed pieces showing gold and red foliage mirrored in water",
      aspect: "native",
      padded: true,
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
      title: "Four Records.\nNothing in Common.",
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
      title: "From a 4x6\nto a Building.",
    },
    {
      id: "storefront-text",
      type: "text",
      size: "subhead",
      content:
        "The Bokeh's Fall window translated the same atmospheric language to building scale. The source image is below, hand-shot on film. The window is what happened when it got blown out to street size and waited for foot traffic to find it.",
    },

    // ── Bokeh's Fall storefront — inline hero
    {
      id: "storefront-hero",
      type: "hero",
      image: `${IMG}/branding-graphics-bokehs-fall-storefront-window-display.jpg`,
      alt: "Bokeh's Fall storefront window display, large bokeh light photograph with overlay typography in modern building",
      inline: true,
    },

    // ── Source bokeh photo
    {
      id: "storefront-source",
      type: "image",
      src: `${IMG}/branding-graphics-bokeh-lights-source-photograph.jpg`,
      alt: "Bokeh lights source photograph, warm orange and pink defocused points of light against dark background",
      aspect: "native",
      padded: true,
    },

    // ════════════════════════════════════════
    // SECTION 05 — MARKS
    // ════════════════════════════════════════
    {
      id: "marks-header",
      type: "section-header",
      label: "SECTION 05: MARKS",
      title: "Logos that sound like the client.\nNot the designer.",
    },
    {
      id: "marks-text",
      type: "text",
      size: "subhead",
      content:
        "Flowing botanical illustration for a fashion collective. Halftone dots and geometric sans for a DJ. A bird on a monogram for a lifestyle brand. Range from ornamental to blunt.",
    },
    {
      id: "marks-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The only consistency is that each mark gets out of its own way. Whatever the brief asks for, the mark delivers without trying to add a signature. The signature is in the range, not in any one piece.",
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
      title: "Where the Instincts\nGet Built.",
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Personal projects. Deadline projects. Album sleeves nobody asked for. Logos for friends starting things. The fluency lives in the volume.",
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
        "The commercial work that came later traces directly back to this output. Compositional habits. Color confidence. The willingness to start with a blank page and not know which direction the piece will turn.\n\nThis section will keep growing. Every new piece becomes another reference point.",
    },
  ],
};
