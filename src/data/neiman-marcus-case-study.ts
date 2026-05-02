import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/neiman-marcus";

export const neimanMarcusCaseStudy: CaseStudy = {
  slug: "neiman-marcus",
  title: "Neiman Marcus InSite",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Editorial design for luxury ecommerce. Designer spotlights, seasonal stories, typography as graphic element. Magazine sensibility on a store's budget.",
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
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-insite-contemporary-art-magazine-hands-mockup.jpg`,
      alt: "Neiman Marcus InSite Contemporary Art magazine spread held in hands",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Neiman Marcus\nInSite",
      subtitle:
        "A luxury retailer's digital editorial hub from 2012. Magazine layouts, runway typography, and studio-shot photography, all in service of the sale.",
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
      abstract:
        "InSite was Neiman Marcus's digital editorial hub. The mandate read like a contradiction - make the website feel like a magazine, sell product like a store, don't let either side win.\n\nEvery piece started with the story. Designer spotlights introducing names like Derek Lam and Helmut Lang to a broader luxury audience, seasonal trend narratives organized around color or silhouette, ways-to-wear features that styled a single garment multiple directions. The concept came first, then the shoot, the styling, and the layout followed.\n\nAll studio photography, no location budgets. Graphic color blocks stood in for environments a different production might have flown to, and pixelated saturated fields built mood when a sunset wasn't in the cards. Typography did the rest - designer names built as compositions instead of headlines, letters interlocking with photography, overlapping garments, sometimes breaking the grid and trusting that the shopper would still find the price.",
    },

    // ── DESIGNER SPOTLIGHTS — grouped ──
    {
      id: "designers-header",
      type: "section-header",
      label: "SECTION 02: DESIGNER SPOTLIGHTS",
      title: "Spotlights That Read\nLike Print Profiles.",
      group: { name: "designers", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "designers-text",
      type: "text",
      size: "subhead",
      content:
        "The Contemporary Art series framed emerging designer collections as introductions. Theyskens' Theory, Rag & Bone, 10 Crosby Derek Lam, Helmut Lang, Kelly Wearstler. Names that carried weight in fashion circles but needed context for a broader luxury shopper.",
      group: { name: "designers" },
    },
    {
      id: "designers-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Each spread built the designer's name as a typographic composition. Oversized serifs with torn-edge framing. Letters interlocking with the figures. The typography did the work a feature profile would have done in print. Shoppers arrived at a product page having read a story, not scrolled a catalog.",
      group: { name: "designers" },
    },

    // Designer spotlight spreads
    {
      id: "designer-theyskens",
      type: "image",
      src: `${IMG}/neiman-marcus-insite-designer-spotlight-theyskens-theory.jpg`,
      alt: "Neiman Marcus InSite, Theyskens Theory designer spotlight spread with tweed jacket",
      aspect: "native",
      padded: true,
      group: { name: "designers" },
    },
    {
      id: "designer-derek-lam",
      type: "image",
      src: `${IMG}/neiman-marcus-insite-designer-spotlight-derek-lam.jpg`,
      alt: "Neiman Marcus InSite, 10 Crosby Derek Lam spotlight with striped jacket and floral",
      aspect: "native",
      padded: true,
      group: { name: "designers" },
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
    },
    {
      id: "designer-kelly",
      type: "image",
      src: `${IMG}/neiman-marcus-insite-designer-spotlight-kelly-wearstler.jpg`,
      alt: "Neiman Marcus InSite, Kelly Wearstler spotlight with geometric leather skirt",
      aspect: "native",
      padded: true,
      group: { name: "designers" },
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
    },

    // ── COLOR STORIES ──
    {
      id: "color-header",
      type: "section-header",
      label: "SECTION 03: COLOR STORIES",
      title: "Saturated Color Did the Work\nof a Location Scout.",
    },
    {
      id: "color-text",
      type: "text",
      size: "subhead",
      content:
        "No location budgets, just studio sweeps and seamless paper. The creative had to stand in for the world outside the shoot, so pixelated color blocks did the work of environments. A grid of saturated tones built the mood that a room and a sunset would have built on a bigger production.",
    },
    {
      id: "color-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Hot Pink, Yellow, Rainbow, Orange, Coral - each color story led with a word and a grid of color chips stepping through tonal values. The pixelation read as digital on purpose, and the treatment stopped pretending it was in print. Color did the work a location scout would have handled somewhere else.",
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
      text: "Each story sets\nits own temperature.",
    },

    // ── TYPOGRAPHY AS SIGNATURE ──
    {
      id: "type-header",
      type: "section-header",
      label: "SECTION 04: TYPOGRAPHY",
      title: "Type That Set the\nVolume of the Page.",
    },
    {
      id: "type-text",
      type: "text",
      size: "subhead",
      content:
        "Some stories wanted letters nearly dissolving into texture - Minimalism, Structure, thin outline serifs ghosting behind the garment. Others wanted theater - The Rocker, The Socialite, Classic Beauty, with oversized display serifs wrapped into the subject's silhouette and negative space doing the layout work.",
    },
    {
      id: "type-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The typographic decision came before the shoot. The designer ran scale, weight, and position through the story's concept, then briefed the photographer with those parameters. A quiet story got a quiet silhouette on a flat gray paper sweep, while a loud story got a saturated backdrop and a pose with room for a letter to land across the shoulder.",
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
    },

    // Theatrical type trio
    {
      id: "theatrical-rocker",
      type: "image",
      src: `${IMG}/neiman-marcus-insite-the-rocker-typographic-spread.jpg`,
      alt: "Neiman Marcus InSite, The Rocker spread with oversized serif letters wrapped into portrait",
      aspect: "native",
      padded: true,
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
    },

    // Laptop hero
    {
      id: "laptop-hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-insite-minimalism-laptop-steel-mockup.jpg`,
      alt: "Neiman Marcus InSite Minimalism story on laptop against stainless steel surface",
      inline: true,
    },

    // ── WAYS TO WEAR ──
    {
      id: "ways-header",
      type: "section-header",
      label: "SECTION 05: WAYS TO WEAR",
      title: "One Garment, Styled\nFour Different Directions.",
    },
    {
      id: "ways-text",
      type: "text",
      size: "subhead",
      content:
        "The ways-to-wear template styled a single garment multiple directions. A black dress with a denim jacket. A silk blouse with an ikat sweater. Equations written in typography: noun + noun + noun, with the plus signs oversized and the outfit in motion lines behind the figure.",
    },
    {
      id: "ways-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The speed lines rendered behind the models gave the spreads a sense of motion that a flat studio shot can't generate on its own. The grid stayed consistent: figure left or right, typography opposite, equation stacked vertically. The format held identical across dozens of variations. Merchandising could plug product photography into the template and ship without waiting for a custom design.",
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
    },

    // ── FLORA MAXI feature ──
    {
      id: "flora-hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-insite-flora-maxi-laptop-couch-mockup.jpg`,
      alt: "Neiman Marcus InSite Flora Maxi story on laptop resting on black couch",
      inline: true,
    },
    {
      id: "flora-spread",
      type: "image",
      src: `${IMG}/neiman-marcus-insite-flora-maxi-spread.jpg`,
      alt: "Neiman Marcus InSite, Flora Maxi editorial with outline type arching over floral dress",
      aspect: "native",
      padded: true,
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "Editorial Commerce\nBefore It Was a Category.",
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Designer spotlights, color stories, typographic theater, ways-to-wear grids - one hub holding dozens of stories. Every layout was a decision about how far to push the editorial without losing the shopper.",
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
        "A luxury retailer's digital hub that behaved like a magazine without forgetting it was a store. The studio-only mandate forced the creative to carry the weight - color blocks stood in for location photography, and typography did the work a stylist and a location scout would have handled on a bigger production.\n\nThe stories held up because the framework underneath held up. Fixed templates for ways-to-wear, open typography for designer spotlights, color-as-environment for trend pieces - a framework loose enough to support a dozen editorial moods and tight enough that every story felt like it came from the same room.",
    },
  ],
};
