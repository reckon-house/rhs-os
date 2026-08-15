import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/jeffrey-ecommerce";

export const jeffreyEcommerceCaseStudy: CaseStudy = {
  slug: "jeffrey-ecommerce",
  title: "Jeffrey New York",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "First digital flagship for the NYC retailer. Full ecommerce launch - brand system, site architecture, and content engine built from zero.",
  field: "Digital Strategy\nBrand System\nEcommerce Design\nUX Architecture",
  author: "Jeremy Prasatik",
  published: "2015",
  status: "Live",
  classification: ["Digital Strategy", "Brand System", "Ecommerce Design", "UX Architecture"],
  services: ["Digital Strategy", "Brand System", "Ecommerce Design", "UX Architecture"],
  stack: ["Photoshop", "Illustrator", "Sketch", "InVision"],
  links: [],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META + ABSTRACT ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 5 frames",
        colors: ["#1A1A1A", "#F5F2ED", "#FFFF40", "#8C8578"],
        images: [
          "/case-studies/jeffrey-ecommerce/jeffrey-new-york-digital-flagship-hero.jpg",
          "/case-studies/jeffrey-ecommerce/hp/jeffrey-new-york-homepage-dries-van-noten-yellow-fringe-ready-to-wear.jpg",
          "/case-studies/jeffrey-ecommerce/jeffrey-new-york-product-detail-page-sacai-luck-dress.jpg",
          "/case-studies/jeffrey-ecommerce/jeffrey-new-york-homepage-editorial-spread.jpg",
          "/case-studies/jeffrey-ecommerce/jeffrey-new-york-wordmark-logo-lockup.jpg",
        ],
      },
      title: "Jeffrey\nNew York",
      subtitle:
        "First digital flagship for the NYC retailer. Full ecommerce launch - brand system, site architecture, and content engine built from zero.",
      field: "Digital Strategy  Brand System  Ecommerce Design  UX Architecture",
      author: "Jeremy Prasatik",
      published: "2015",
      status: "Live",
      classification: ["Digital Strategy", "Brand System", "Ecommerce Design", "UX Architecture"],
      summary: [
        { label: "Built", value: "First digital flagship for the NYC retailer. Brand system, site architecture, content engine, from zero" },
        { label: "Scope", value: "Digital strategy, brand system, ecommerce design, UX architecture" },
        { label: "Stack", value: "Photoshop, Illustrator, Sketch, InVision" },
        { label: "Angle", value: "Built like a flagship. The publishing system shipped before the product templates." },
      ],
      abstract:
        "Jeffrey had never sold online. The physical store was a gallery with a curator's eye, and the challenge was translating that into a digital channel without flattening it into a catalog.\n\nStarted with the buying team. Learned how the floor worked, how pieces were grouped, what made the edit feel like Jeffrey. The strategy that won was simple: storytelling over transaction. Designer launches, weekly content drops, editorial pacing baked into the structure.\n\nBuilt the full system from there. Modular grids for seasonal flexibility, typography hierarchy that stayed sharp across contexts, product pages that led with imagery, navigation centered on curation rather than categories. Integration work handled alongside external partners while keeping ownership of the experience, every interaction from wireframe to checkout prototyped to feel considered.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/jeffrey-new-york-digital-flagship-hero.jpg`,
      alt: "Jeffrey New York digital flagship hero",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE STRATEGY
    // ════════════════════════════════════════
    {
      id: "strategy-header",
      type: "section-header",
      label: "SECTION 02: THE STRATEGY",
      title: "Storytelling Over",
      // pin so the thesis headline holds while its two paragraphs travel
      // up beside it. Nothing climbs this brief — the zoom two beats down
      // reserves its own room — so the flag is staging for the headline
      // rather than a hold handed to a riser.
      pressing: {
        mark: { n: "02", name: "Storytelling Over" },
        heldLine: "Transaction.",
        choreo: { pin: true },
      },
    },
    {
      id: "strategy-subhead",
      type: "text",
      size: "subhead",
      content:
        "The pitch that won: a digital channel that worked the way the store worked. Designer launches as moments, weekly content drops as a rhythm, editorial pacing as the structure itself.",
    },
    {
      id: "strategy-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Sat with the buying team to learn how the floor worked. How pieces were grouped, how seasons shifted, what made the edit feel like Jeffrey. The site needed to behave like the store, which meant designing the publishing system before the product templates.",
    },

    // ── The homepage, six ways ──────────────────────────────────────
    // This was ONE flattened 6493px strip of the templates side by side,
    // zoomed and panned. The strip is the wrong object for the claim:
    // the point is that one chrome carries any campaign, and a single
    // image of six thumbnails asks the reader to squint at six things at
    // once. As cells they are six full pages, each big enough to read its
    // own hero, sitting in the same masthead and the same footer.
    //
    // Six, not the eight exported: two of the eight are wider crops of
    // templates already here (Candy Crush and Vetements), and at cell
    // size a crop variant reads as the grid repeating itself. The files
    // are in hp/ if they should come back.
    //
    // Sized honestly. 1357px native is crisp to ~678 CSS; three across
    // the page puts each cell near 450, well inside it. The originals
    // were transparent PNGs totalling 9.2MB — flattened onto paper (the
    // alpha was only the mockup's own rounded corner, which the frame
    // draws anyway) they are 1.2MB for the set.
    {
      id: "homepage-templates",
      type: "masonry",
      columns: 3,
      // Whole frames, no crop. The row's 10% bleed is a parallax track on
      // photography and a pair of scissors on a screenshot: it was taking
      // "Search" off one end of the masthead and "Login" off the other.
      native: true,
      images: [
        { src: `${IMG}/hp/jeffrey-new-york-homepage-dries-van-noten-yellow-fringe-ready-to-wear.jpg`, alt: "Jeffrey New York homepage, Dries Van Noten ready-to-wear against a yellow fringe backdrop" },
        { src: `${IMG}/hp/jeffrey-new-york-homepage-valentino-pink-lace-dress-monstera.jpg`, alt: "Jeffrey New York homepage, Valentino pink lace dress paired with monstera leaves" },
        { src: `${IMG}/hp/jeffrey-new-york-homepage-vetements-logo-wall-white-skirt.jpg`, alt: "Jeffrey New York homepage, Vetements logo step-and-repeat wall" },
        { src: `${IMG}/hp/jeffrey-new-york-homepage-candy-crush-fall-shoes-polka-dots.jpg`, alt: "Jeffrey New York homepage, Candy Crush fall shoes on a polka-dot set" },
        { src: `${IMG}/hp/jeffrey-new-york-homepage-step-into-summer-must-have-shoes.jpg`, alt: "Jeffrey New York homepage, Step Into Summer must-have shoes" },
        { src: `${IMG}/hp/jeffrey-new-york-homepage-loewe-blue-leather-bag.jpg`, alt: "Jeffrey New York homepage, Loewe blue leather bag" },
      ],
      /* NO MARK. The strip carried plate: "02", which is the ZOOM
         numeral and inherits its governing mark by convention — a grid
         is not a zoom, and minting a mark here would put a second "02"
         in a spine that already opens on one. The grid sits under
         Storytelling Over, where it belongs. */
    },

    // ── Editorial headline — replaces the original closing's
    // "established digital presence for seasons to come" performative line.
    {
      id: "headline-flagship",
      type: "editorial-headline",
      text: "Built like\na flagship",
    },

    // ════════════════════════════════════════
    // SECTION 03 — THE SYSTEM
    // ════════════════════════════════════════
    {
      id: "system-header",
      type: "section-header",
      label: "SECTION 03: THE SYSTEM",
      title: "Modular Grids,",
      // The study's one crossing, on section 03 rather than the thesis
      // header, which already sits directly above the zoom plate.
      //
      // This is also the study's mid-page hold. There is no dual-image
      // anywhere in Jeffrey, so a pair can never do it — but a brief
      // reserves ClimbRoom for its riser, and the PDP plate below climbs
      // across this one. `pin` declared alongside `crossing`: the crossing
      // already holds its headline for 220dvh, so the flag changes nothing
      // on the page. It is the A.R.C. convention for saying so in the data.
      pressing: {
        mark: { n: "03", name: "Modular Grids" },
        heldLine: "Curated Navigation.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "system-subhead",
      type: "text",
      size: "subhead",
      content:
        "Modular grids for seasonal flexibility, typography hierarchy that held sharp across contexts, product pages that led with imagery, navigation organized around curation instead of categories.",
    },
    {
      id: "system-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The grid let merchandising compose seasonal layouts without touching the underlying templates - swap photography, swap copy, ship. Type stayed structural, which is what kept the site from drifting toward catalog feel as the store grew.",
    },

    // ── PDP screen — climbs the crossing above it.
    // Rise, not zoom: at 2188px native this file is under the resolution
    // bar, and drawing it to fill the mat is the exact overdraw the gate
    // exists to catch. The climb shows the page arriving instead.
    {
      id: "pdp-hero",
      type: "image",
      src: `${IMG}/jeffrey-new-york-product-detail-page-sacai-luck-dress.jpg`,
      alt: "Jeffrey New York product detail page — large imagery, minimal chrome, curated cross-sells",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── Hero3 inline — the second zoom, and the hold for the plate below.
    // A riser cannot follow a riser, so this middle frame of the run has to
    // hold, and at 3100px native it is the only file in the run that clears
    // the bar to be drawn at full size. It earns it on material too: a whole
    // homepage laid out as an editorial page rewards being read, not glanced.
    {
      id: "hero3-inline",
      type: "hero",
      image: `${IMG}/jeffrey-new-york-homepage-editorial-spread.jpg`,
      alt: "Jeffrey New York site in context — additional editorial hero",
      inline: true,
      pressing: {
        plate: "03",
        captions: [
          "Homepage editorial spread",
          "Designer launch as the lead moment",
          "Photography carries the page",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── System screens — climbs the zoom's held screen.
    // Three templates rendered together, so the frame reads at a glance and
    // wants the climb rather than the pin. 2298px native rules out the zoom
    // regardless.
    {
      id: "system-screens",
      type: "image",
      src: `${IMG}/jeffrey-new-york-system-spread-homepage-designer-product-templates.png`,
      alt: "Jeffrey New York system spread — homepage, designer page, and product templates rendered together",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 04 — MARKS & MATERIALS
    // ════════════════════════════════════════
    {
      id: "marks-materials",
      type: "marks-materials",
      label: "SECTION 04: MARKS & MATERIALS",
      title: "A Quiet Type System\nDoing the Structural Work.",
      introText:
        "One typeface across weights, a restrained palette, and a logo lockup that sat as a graphic mark before it sat as a name. The kit ran the same way at every scale.",
      philosophyText:
        "The palette stays narrow on purpose. Charcoal holds the type and the structural weight, cream sits as the ground that lets the photography do the talking, and a single yellow accent - pulled straight from the wordmark - ties the editorial moments together. No second accent, no decorative color - the merchandise brings whatever it needs.\n\nType is one family across weights. Avenir Next Heavy carried the wordmark and feature headlines, Demi Bold carried subheads and CTAs, Medium carried the rest. The single family kept the system tight, and the weight contrast did the work that a multi-font stack would otherwise have to.",
      colors: [
        { name: "Charcoal", hex: "#1A1A1A", description: "Type, structure" },
        { name: "Cream", hex: "#F5F2ED", description: "Paper, ground" },
        { name: "Brand Yellow", hex: "#FFFF40", description: "Wordmark, accent" },
        { name: "Soft Gray", hex: "#8C8578", description: "Meta, captions" },
      ],
      fonts: [
        {
          name: "JEFFREY",
          sampleText: "JEFFREY",
          role: "Wordmark",
          description:
            "Avenir Next Heavy Italic at scale. The same wordmark that anchored the storefront, set wide and locked tight as a graphic mark.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 800,
          italic: true,
        },
        {
          name: "Avenir Next Heavy",
          role: "Feature headlines",
          description:
            "Heaviest non-italic weight, used for designer launches and editorial moments. Pairs with the wordmark as the loudest the system gets.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 800,
        },
        {
          name: "Avenir Next Demi Bold",
          role: "Subhead & CTAs",
          description:
            "Mid-heavy weight for subheads, callouts, and CTAs. The structural voice that ties the catalog together.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 600,
        },
        {
          name: "Avenir Next Medium",
          role: "Body & captions",
          description:
            "Standard weight for product copy, descriptions, and longer-form text. Quiet enough to let the photography lead.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 500,
        },
      ],
      markImage: `${IMG}/jeffrey-new-york-wordmark-logo-lockup.jpg`,
      markAlt: "Jeffrey New York logo lockup with the Avenir Next type system in context",
    },

    // ════════════════════════════════════════
    // SECTION 05 — THE BUILD RADIUS
    // (Radial diagram showing the brand experience propagating through every
    // surface of the digital flagship. Same chart language as the Ivy Park
    // campaign blast radius, retuned to Jeffrey's wordmark yellow.)
    // ════════════════════════════════════════
    {
      id: "build-header",
      type: "section-header",
      label: "SECTION 05: THE BUILD RADIUS",
      title: "One System,",
      // pin: the radius diagram below is not a riser, so this holds the
      // header while its one paragraph travels, the same staging every
      // other brief in the study gets.
      pressing: {
        mark: { n: "04", name: "One System" },
        heldLine: "Every Surface.",
        choreo: { pin: true },
      },
    },
    {
      id: "build-subhead",
      type: "text",
      size: "subhead",
      content:
        "Wordmark, type, grid, photography - one kit propagating from the brand experience out through every surface the customer touched.",
    },
    {
      id: "flagship-radius",
      type: "jeffrey-flagship-radius",
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "A Digital Flagship",
      pressing: {
        mark: { n: "05", name: "A Digital Flagship" },
        heldLine: "Built Like the Store.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Strategy, brand, architecture, content - one system that ran on the same curatorial logic as the physical store.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Digital Strategy", "Brand System", "Ecommerce Design", "UX Architecture"],
      stack: ["Photoshop", "Illustrator", "Sketch", "InVision"],
      links: [],
      content:
        "The grid let merchandising publish a designer launch on Tuesday and a sale on Wednesday without either looking out of place. The type system held the editorial voice while the content underneath changed weekly. Jeffrey eventually sold the business, and the digital channel outlasted the original team that built it.",
    },
  ],
};
