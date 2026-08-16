import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/branding-graphics";

export const brandingGraphicsCaseStudy: CaseStudy = {
  slug: "branding-graphics",
  title: "Branding, Print & Apparel",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Album covers, gig posters, prints, and logos, made over about ten years for a lot of different people. | Each one in whatever style it needed, none of them in mine.",
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
        "Album covers, gig posters, prints, and logos, made over about ten years for a lot of different people. | Each one in whatever style it needed, none of them in mine.",
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
        { label: "Angle", value: "Each mark sounds like the client it was drawn for, and no two of them look related." },
      ],
      abstract:
        "Album covers, posters, art prints, logos, and one storefront window, made over about ten years for musicians, friends, and a handful of brands.\n\nFour album covers, each for a different act. Posters and prints, from a typography exercise to double-exposed landscapes. Five logos for five clients. And one 4x6 film photograph blown up to fill a storefront window.\n\nPhotoshop, Illustrator, and InDesign for most of it, a film camera for the photography, and hand-drawn type where a piece called for it.",
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
      title: "Double exposures where texture",
      pressing: {
        mark: { n: "02", name: "Posters and Prints" },
        heldLine: "stands in for detail.",
        // Held so the second line stays put while its copy travels,
        // and so the ABC poster underneath has a screen to climb.
        choreo: { pin: true },
      },
    },
    {
      id: "posters-text",
      type: "text",
      size: "subhead",
      content:
        "Photographs over dot-matrix grids, and radial color studies built from pattern.",
    },
    {
      id: "posters-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each of these started with a blank page and a deadline, and no plan for where it would end up.",
    },

    // ── ABC 123 typography poster — single, padded.
    // The poster wall already alternates plate, pair, plate, pair all
    // the way down, so it choreographs as one contract: every pair holds
    // and every plate climbs the pair above it. This first plate has no
    // pair above it and climbs the brief instead, which is the only hold
    // at the top of the run.
    // Rise, not zoom — the file is 2520px, under the zoom floor, and the
    // study's single zoom is spent where the copy asks for it (the
    // storefront, blown out to street size).
    {
      id: "poster-abc",
      type: "image",
      src: `${IMG}/branding-graphics-abc-123-typography-poster-lifestyle.jpg`,
      alt: "ABC 123 typography poster with patterned letterforms in pink, blue, and yellow, framed on speckled wall with monstera leaves",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
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
      // Held for the Sky / Abacus plate. Two colorways of one print is a
      // comparison, and holding it lets the reader finish the comparison
      // before the next poster crosses it.
      pressing: { choreo: { pin: true } },
    },

    // ── Sky / Abacus framed pair — already a baked-in pair photo
    {
      id: "poster-sky-abacus",
      type: "image",
      src: `${IMG}/branding-graphics-posters-sky-is-the-limit-abacus-pair.jpg`,
      alt: "Sky is the Limit cityscape poster paired with Abacus halftone dot poster, framed and hung on neutral wall",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
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
      // Held so the lake prints climb across it. The captions live here
      // and nowhere else in the run: this is the marquee pair, and a
      // label under every frame turns a poster wall into an inventory.
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
      // Last hold of the run, for the balloon poster that closes it.
      pressing: { choreo: { pin: true } },
    },

    // ── Up Up & Away balloon — single, padded closer for the section.
    // Climbs the pair above and lands the section on a double exposure,
    // which is the loudest frame in the wall and belongs at the end.
    {
      id: "poster-balloon",
      type: "image",
      src: `${IMG}/branding-graphics-up-up-and-away-balloon-poster-lifestyle.jpg`,
      alt: "Up Up and Away poster, hot-air balloon double-exposed with trees over yellow rapeseed field, framed on console with lamp",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 03 — COVERS
    // ════════════════════════════════════════
    {
      id: "covers-header",
      type: "section-header",
      label: "SECTION 03: COVERS",
      title: "Every sleeve had to read at vinyl size",
      // The study's one crossing. Four sleeves with no shared logic IS the
      // fluency argument the whole study makes, so the gesture lands here
      // rather than on the marks section that only restates it.
      pressing: {
        mark: { n: "03", name: "Four Records" },
        heldLine: "and survive as a thumbnail.",
        // pin declares what the crossing already does — it holds the
        // headline while the column scrubs past — so the flag matches
        // the behaviour instead of the skin being the only record of it.
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "covers-text",
      type: "text",
      size: "subhead",
      content:
        "Folk, pop, ambient and a DJ, and nothing carries over from one sleeve to the next. That was the requirement.",
    },
    {
      id: "covers-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Woodgrain collage and halftone geometry for the folk record. Grunge compositing and hand-drawn type for the pop artist. Linework landscapes stacked into depth for the ambient release. A saturated portrait for the DJ, where the color carries the whole thing.",
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
      text: "Cover art for music\nthat didn't exist yet.",
    },

    // ════════════════════════════════════════
    // SECTION 04 — STOREFRONT
    // ════════════════════════════════════════
    {
      id: "storefront-header",
      type: "section-header",
      label: "SECTION 04: STOREFRONT",
      title: "The photograph was shot on film",
      pressing: {
        mark: { n: "04", name: "From a 4x6" },
        heldLine: "and blown up to street size.",
        // Held, so "to a Building." is still on screen when the window
        // below it starts filling the mat. The two halves of the same
        // sentence should not be a scroll apart.
        choreo: { pin: true },
      },
    },
    {
      id: "storefront-text",
      type: "text",
      size: "subhead",
      content:
        "Bokeh's Fall. The photograph was shot on film, and the window is what happened when it got blown up to street size. The original is below.",
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
        instruction: "Scroll. It fills the mat, then travels the frame",
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
      title: "Five logos, none of them",
      pressing: {
        mark: { n: "05", name: "Five Logos" },
        heldLine: "drawn the same way.",
        choreo: { pin: true },
      },
    },
    {
      id: "marks-text",
      type: "text",
      size: "subhead",
      content:
        "Flowing botanical illustration for a fashion collective, halftone dots and geometric sans for a DJ, a bird on a monogram for a lifestyle brand.",
    },
    {
      id: "marks-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The other two are a planet-and-orbit wordmark in heavy black sans and a four-circle mark over an engraved serif.",
    },

    // ── Marks — two rows, not five plates.
    // The five logo files run 557px to 1160px native, and neither plate
    // treatment fits a file that small: a riser draws full-bleed at
    // viewport width, and five resting plates in a column is exactly the
    // stack this language exists to break up. Rows are the third option
    // and the honest one, because each mark lands near column measure,
    // which is the size these exports can actually carry. Three across
    // then two, so the ornamental Spear linework stays legible and the
    // authored order survives.
    //
    // Rows also HOLD, which is why nothing here rises. The argument is
    // the range across five marks seen together, and range is a thing
    // you compare, not a thing you cross.
    {
      id: "marks-row-1",
      type: "triple-image",
      transparent: true,
      images: [
        {
          src: `${IMG}/branding-graphics-logo-spear-collective-art-nouveau-vines.jpg`,
          alt: "Spear Collective logo, art-nouveau script wordmark wrapped with vines and flowers",
        },
        {
          src: `${IMG}/branding-graphics-logo-hey-sd-stellar-jay-bird.jpg`,
          alt: "Hey SD logo, bold serif monogram with stellar jay bird perched on letterforms",
        },
        {
          src: `${IMG}/branding-graphics-logo-okina-orbit-wordmark.jpg`,
          alt: "Okina logo, planet-and-orbit wordmark in heavy black sans",
        },
      ],
    },
    {
      id: "marks-row-2",
      type: "dual-image",
      transparent: true,
      left: {
        src: `${IMG}/branding-graphics-logo-dj-mia-halftone-dots.jpg`,
        alt: "DJ MIA logo, geometric sans wordmark above pink halftone dot fade",
      },
      right: {
        src: `${IMG}/branding-graphics-logo-j-christianson-four-circle-mark.jpg`,
        alt: "J. Christianson logo, four-circle dot mark above engraved serif wordmark",
      },
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "Still adding",
      pressing: {
        mark: { n: "06", name: "Closing" },
        heldLine: "to this one.",
      },
    },
    // No subhead here on purpose. Its one good line moved into the
    // closing paragraph below; the rest was the abstract's argument again.
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
        "Personal projects, deadline projects, album sleeves nobody asked for, logos for friends starting things. About ten years of it so far.",
    },
  ],
};
