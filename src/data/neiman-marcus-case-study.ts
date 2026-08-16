import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/neiman-marcus";

export const neimanMarcusCaseStudy: CaseStudy = {
  slug: "neiman-marcus",
  title: "Neiman Marcus InSite",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Neiman Marcus's digital editorial hub, InSite. | Magazine layouts, runway typography, and studio-shot photography, all in service of the sale.",
  field: "Editorial Design\nArt Direction\nTypography",
  author: "Jeremy Prasatik",
  published: "2012",
  status: "Complete",
  classification: [
    "Story Development",
    "Editorial Design",
    "Photo Direction",
    "Art Direction",
    "Typography",
  ],
  services: [
    "Story Development",
    "Editorial Design",
    "Photo Direction",
    "Art Direction",
    "Typography",
  ],
  stack: ["Adobe InDesign", "Adobe Photoshop", "Adobe Illustrator"],
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
        colors: ["#DCD9D2", "#9EA7AF", "#DCD3C9", "#B8C1C4", "#84868C"],
        images: [
          "/case-studies/neiman-marcus/neiman-marcus-insite-contemporary-art-magazine-hands-mockup.jpg",
          "/case-studies/neiman-marcus/neiman-marcus-insite-designer-spotlight-theyskens-theory.jpg",
          "/case-studies/neiman-marcus/neiman-marcus-insite-designer-spotlight-derek-lam.jpg",
          "/case-studies/neiman-marcus/neiman-marcus-insite-designer-spotlight-rag-and-bone.jpg",
          "/case-studies/neiman-marcus/neiman-marcus-insite-designer-spotlight-helmut-lang.jpg",
          "/case-studies/neiman-marcus/neiman-marcus-insite-designer-spotlight-kelly-wearstler.jpg",
          "/case-studies/neiman-marcus/neiman-marcus-insite-rainbow-laptop-blue-chairs-mockup.jpg",
          "/case-studies/neiman-marcus/neiman-marcus-insite-color-story-hot-pink.jpg",
        ],
      },
      title: "Neiman Marcus\nInSite",
      subtitle:
        "Neiman Marcus's digital editorial hub, InSite. | Magazine layouts, runway typography, and studio-shot photography, all in service of the sale.",
      field: "Editorial Design  Art Direction  Typography",
      author: "Jeremy Prasatik",
      published: "2012",
      status: "Complete",
      classification: [
        "Story Development",
        "Editorial Design",
        "Photo Direction",
        "Art Direction",
        "Typography",
      ],
      summary: [
        { label: "Built", value: "Designer spotlights, color stories, typographic spreads, ways-to-wear grids" },
        { label: "Scope", value: "Story development, editorial design, photo and art direction, typography" },
        { label: "Tools", value: "Studio photography, Adobe InDesign, Photoshop, Illustrator" },
        { label: "Angle", value: "Feel like a magazine, sell like a store. With no location budget, the color and the type had to set the scene." },
      ],
      abstract:
        "InSite was Neiman Marcus's digital editorial hub. The mandate was to make the website feel like a magazine and sell product like a store, and not let either side win.\n\nEvery piece started with the story. Designer spotlights that introduced names like Derek Lam and Helmut Lang to a broader luxury shopper. Seasonal trend stories organized around a color or a silhouette. Ways-to-wear features that styled one garment a few different directions. The concept came first, then the shoot, then the styling and the layout.\n\nAll of it was studio photography. There was no location budget, so graphic color blocks stood in for the places a bigger production would have flown to, and fields of pixelated color set the mood when a sunset wasn't an option. Typography did the rest. Designer names ran as big as the photographs, letters locked into the figures and over the garments, and sometimes the type broke the grid, trusting that the shopper would still find the price.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-insite-contemporary-art-magazine-hands-mockup.jpg`,
      alt: "Neiman Marcus InSite Contemporary Art magazine spread held in hands",
      pressing: { choreo: { rise: true } },
    },

    // ── DESIGNER SPOTLIGHTS — grouped ──
    {
      id: "designers-header",
      type: "section-header",
      label: "SECTION 02: DESIGNER SPOTLIGHTS",
      title: "The series introduced emerging designers",
      pressing: {
        mark: { n: "02", name: "Designer Spotlights" },
        heldLine: "to a broader luxury shopper.",
        choreo: { pin: true },
      },
      group: { name: "designers", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "designers-text",
      type: "text",
      size: "subhead",
      content:
        "The name ran in oversized serifs. Theyskens' Theory, Rag & Bone, 10 Crosby Derek Lam, Helmut Lang, Kelly Wearstler.",
      group: { name: "designers" },
    },
    {
      id: "designers-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each spread set the designer's name as the composition, torn-edge framing and letters locked into the figure. In print a feature profile would have made the introduction. Here the type made it, and shoppers reached the product page having read something first.",
      group: { name: "designers" },
    },

    // Designer spotlight spreads
    // Theyskens and Derek Lam were two full-width plates in a row. Both
    // files are 1336px native, so a plate drew them past their honest
    // width and softened the type the whole section is about. Paired,
    // each lands near column measure, which is the size the file carries.
    // The pairing is also what gives this run its second hold.
    {
      id: "designer-pair-intro",
      type: "dual-image",
      native: true,
      transparent: true,
      group: { name: "designers" },
      left: {
        src: `${IMG}/neiman-marcus-insite-designer-spotlight-theyskens-theory.jpg`,
        alt: "Neiman Marcus InSite, Theyskens Theory designer spotlight spread with tweed jacket",
      },
      right: {
        src: `${IMG}/neiman-marcus-insite-designer-spotlight-derek-lam.jpg`,
        alt: "Neiman Marcus InSite, 10 Crosby Derek Lam spotlight with striped jacket and floral",
      },
    },
    {
      id: "designer-pair",
      type: "dual-image",
      native: true,
      transparent: true,
      group: { name: "designers" },
      left: {
        src: `${IMG}/neiman-marcus-insite-designer-spotlight-rag-and-bone.jpg`,
        alt: "Neiman Marcus InSite, Rag & Bone spotlight with yellow and gray knit",
      },
      right: {
        src: `${IMG}/neiman-marcus-insite-designer-spotlight-helmut-lang.jpg`,
        alt: "Neiman Marcus InSite, Helmut Lang spotlight with asymmetric black and white dress",
      },
      // Held so the fifth designer climbs across the other four. The run
      // closes on a move instead of a fourth flat spread.
      pressing: { choreo: { pin: true } },
    },
    {
      id: "designer-kelly",
      type: "image",
      src: `${IMG}/neiman-marcus-insite-designer-spotlight-kelly-wearstler.jpg`,
      alt: "Neiman Marcus InSite, Kelly Wearstler spotlight with geometric leather skirt",
      aspect: "native",
      padded: true,
      group: { name: "designers" },
      pressing: { choreo: { rise: true } },
    },

    // ── EDITORIAL TREATMENT CHART ──
    {
      id: "editorial-treatments",
      type: "editorial-treatments",
    },

    // ── Rainbow laptop hero near color stories ──
    {
      id: "rainbow-hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-insite-rainbow-laptop-blue-chairs-mockup.jpg`,
      alt: "Neiman Marcus InSite Rainbow story displayed on laptop against blue chairs",
      inline: true,
      // The zoom. The section below argues that saturated colour replaced
      // a location budget, and the claim only lands at a size where the
      // colour is the whole screen.
      pressing: {
        plate: "03",
        captions: [
          "Rainbow story",
          "Color standing in for a set",
          "InSite, on the laptop",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── COLOR STORIES ──
    {
      id: "color-header",
      type: "section-header",
      label: "SECTION 03: COLOR STORIES",
      title: "Every shoot was on seamless paper,",
      // The study's one crossing. Colour standing in for a location budget
      // is the sharpest thing this case has to say.
      pressing: {
        mark: { n: "03", name: "Color Stories" },
        heldLine: "so the color had to be the place.",
        choreo: { crossing: true },
      },
    },
    {
      id: "color-text",
      type: "text",
      size: "subhead",
      content:
        "Hot Pink, Yellow, Rainbow, Orange, Coral. The chip grids stepped through the tones of one hue, and that stood in for wherever a bigger production would have flown.",
    },
    {
      id: "color-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The pixelation was on purpose. InSite lived on a screen, and this was the one treatment that stopped pretending it was print.",
    },

    // Color story triples
    {
      id: "color-triple",
      type: "triple-image",
      native: true,
      transparent: true,
      images: [
        { src: `${IMG}/neiman-marcus-insite-color-story-hot-pink.jpg`, alt: "Neiman Marcus InSite, Hot Pink color story with pixelated pink and yellow grid" },
        { src: `${IMG}/neiman-marcus-insite-color-story-rainbow.jpg`, alt: "Neiman Marcus InSite, Rainbow color story with pastel color blocks" },
        { src: `${IMG}/neiman-marcus-insite-color-story-yellow.jpg`, alt: "Neiman Marcus InSite, Yellow color story with yellow pixelated gradient" },
      ],
    },
    {
      id: "color-pair",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: `${IMG}/neiman-marcus-insite-color-story-orange.jpg`,
        alt: "Neiman Marcus InSite, Orange color story with pixelated red-orange cascade",
      },
      right: {
        src: `${IMG}/neiman-marcus-insite-color-story-coral.jpg`,
        alt: "Neiman Marcus InSite, Coral color story with pink and yellow stripe accents",
      },
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-tone",
      type: "editorial-headline",
      text: "A story first,\nthen the price",
    },

    // ── TYPOGRAPHY AS SIGNATURE ──
    {
      id: "type-header",
      type: "section-header",
      label: "SECTION 04: TYPOGRAPHY",
      title: "The type was picked",
      pressing: {
        mark: { n: "04", name: "Type First" },
        heldLine: "before the shoot.",
        choreo: { pin: true },
      },
    },
    {
      id: "type-text",
      type: "text",
      size: "subhead",
      content:
        "For Minimalism and Structure the letters nearly dissolve, thin outline serifs ghosting behind the garment. The Rocker, The Socialite and Classic Beauty went the other way, oversized display serifs wrapped into the model's silhouette with the negative space doing the layout.",
    },
    {
      id: "type-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Scale, weight and position came out of the story's concept, and the photographer got briefed with those. A restrained story got a still pose on flat gray paper. A loud one got a saturated backdrop and a pose with room for a letter to sit across the shoulder.",
    },

    // Minimalism pair
    {
      id: "minimalism-pair",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: `${IMG}/neiman-marcus-insite-minimalism-flat-spread.jpg`,
        alt: "Neiman Marcus InSite, Minimalism spread with delicate outline type dissolving behind gray coat",
      },
      right: {
        src: `${IMG}/neiman-marcus-insite-structure-piazza-sempione-spread.jpg`,
        alt: "Neiman Marcus InSite, Structure Piazza Sempione spread with sharp black silhouettes",
      },
      // The two quiet spreads hold while the loud one climbs over them.
      // The copy above splits type into whisper and theater, so the
      // section plays the split instead of listing it.
      pressing: { choreo: { pin: true } },
    },

    // Theatrical type trio
    {
      id: "theatrical-rocker",
      type: "image",
      src: `${IMG}/neiman-marcus-insite-the-rocker-typographic-spread.jpg`,
      alt: "Neiman Marcus InSite, The Rocker spread with oversized serif letters wrapped into portrait",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },
    {
      id: "theatrical-pair",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: `${IMG}/neiman-marcus-insite-the-socialite-red-dress-spread.jpg`,
        alt: "Neiman Marcus InSite, The Socialite spread with red leather dress and gold serif typography",
      },
      right: {
        src: `${IMG}/neiman-marcus-insite-classic-beauty-spread.jpg`,
        alt: "Neiman Marcus InSite, Classic Beauty spread with large italic script on dark gray",
      },
      // Held so the laptop mockup climbs across it: two spreads flat,
      // then the same work on the screen it shipped to.
      pressing: {
        captions: ["The Socialite\nRed leather", "Classic Beauty"],
        choreo: { pin: true },
      },
    },

    // Laptop hero — climbs across the held spreads
    {
      id: "laptop-hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-insite-minimalism-laptop-steel-mockup.jpg`,
      alt: "Neiman Marcus InSite Minimalism story on laptop against stainless steel surface",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── WAYS TO WEAR ──
    {
      id: "ways-header",
      type: "section-header",
      label: "SECTION 05: WAYS TO WEAR",
      title: "Each spread wrote the outfit",
      pressing: {
        mark: { n: "05", name: "Ways to Wear" },
        heldLine: "as an equation.",
        choreo: { pin: true },
      },
    },
    {
      id: "ways-text",
      type: "text",
      size: "subhead",
      content:
        "A black dress with a denim jacket, then with an ikat sweater. A silk blouse the same two ways. Noun plus noun plus noun, with the plus signs set oversized.",
    },
    {
      id: "ways-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Speed lines drawn behind the models gave the spreads some motion a flat studio shot doesn't have. The grid never moved: figure on one side, type on the other, the equation stacked vertically. Merchandising could drop new product photography into the template and ship it without waiting on a custom layout, and the format stayed the same across dozens of variations.",
    },

    // Ways to wear trio
    {
      id: "ways-pair-1",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: `${IMG}/neiman-marcus-insite-ways-to-wear-black-dress-ikat.jpg`,
        alt: "Neiman Marcus InSite, Black Dress plus Ikat Sweater styling with speed lines",
      },
      right: {
        src: `${IMG}/neiman-marcus-insite-ways-to-wear-black-dress-denim.jpg`,
        alt: "Neiman Marcus InSite, Black Dress plus Denim Jacket styling with speed lines",
      },
    },
    {
      id: "ways-pair-2",
      type: "dual-image",
      native: true,
      transparent: true,
      left: {
        src: `${IMG}/neiman-marcus-insite-ways-to-wear-silk-blouse-ikat.jpg`,
        alt: "Neiman Marcus InSite, Silk Blouse plus Ikat Sweater styling",
      },
      right: {
        src: `${IMG}/neiman-marcus-insite-ways-to-wear-silk-blouse-denim.jpg`,
        alt: "Neiman Marcus InSite, Silk Blouse plus Denim Jacket plus Printed Jean styling",
      },
      // No hold here. The ways-to-wear beat is about a template that
      // stayed identical across dozens of variations, so four stylings
      // sit flat and the gesture waits for the Flora Maxi turn below.
      pressing: {
        captions: ["Silk blouse + ikat", "Silk blouse + denim"],
      },
    },

    // ── FLORA MAXI feature — the closing zoom, then the spread over it
    {
      id: "flora-hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-insite-flora-maxi-laptop-couch-mockup.jpg`,
      alt: "Neiman Marcus InSite Flora Maxi story on laptop resting on black couch",
      inline: true,
      // The study's second and last zoom. 3080px native carries the full
      // mat honestly, and the hub running on a screen is the right thing
      // to hold at that size going into the closing.
      pressing: {
        plate: "05",
        captions: ["Flora Maxi feature", "Outline type arching over the dress"],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },
    {
      id: "flora-spread",
      type: "image",
      src: `${IMG}/neiman-marcus-insite-flora-maxi-spread.jpg`,
      alt: "Neiman Marcus InSite, Flora Maxi editorial with outline type arching over floral dress",
      aspect: "native",
      padded: true,
      // Climbs the zoom's held screen: the printed spread arrives over
      // the shipped page it became.
      pressing: { choreo: { rise: true } },
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "Every layout was a call on how far",
      pressing: {
        mark: { n: "06", name: "Dozens of Stories" },
        heldLine: "the magazine side could go.",
      },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Dozens of stories on a handful of templates, and the store side still had to be findable.",
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Story Development",
        "Editorial Design",
        "Photo Direction",
        "Art Direction",
        "Typography",
      ],
      stack: ["Adobe InDesign", "Adobe Photoshop", "Adobe Illustrator"],
      links: [],
      content:
        "The templates carried it. Ways-to-wear ran on a fixed grid, designer spotlights on open typography, trend pieces on color as the environment. That was loose enough for a dozen moods and tight enough that every story looked like it came from the same room.",
    },
  ],
};
