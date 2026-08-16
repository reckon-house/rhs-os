import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/jeffrey-ecommerce";

export const jeffreyEcommerceCaseStudy: CaseStudy = {
  slug: "jeffrey-ecommerce",
  title: "Jeffrey New York",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "Jeffrey New York's first online store, built from zero: the brand, the site, and the way it told stories. | A gallery of a shop, translated to a screen without flattening it into a catalog.",
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
        caption: "Preview · 6 frames",
        colors: ["#1A1A1A", "#F5F2ED", "#FFFF40", "#8C8578"],
        images: [
          "/case-studies/jeffrey-ecommerce/jeffrey-new-york-saint-laurent-shoes-homepage-laptop-hero.jpg",
          "/case-studies/jeffrey-ecommerce/jeffrey-new-york-digital-flagship-hero.jpg",
          "/case-studies/jeffrey-ecommerce/hp/jeffrey-new-york-homepage-dries-van-noten-yellow-fringe-ready-to-wear.jpg",
          "/case-studies/jeffrey-ecommerce/jeffrey-new-york-product-detail-page-sacai-luck-dress.jpg",
          "/case-studies/jeffrey-ecommerce/jeffrey-new-york-homepage-editorial-spread.jpg",
          "/case-studies/jeffrey-ecommerce/jeffrey-new-york-wordmark-logo-lockup.jpg",
        ],
      },
      title: "Jeffrey\nNew York",
      subtitle:
        "Jeffrey New York's first online store, built from zero: the brand, the site, and the way it told stories. | A gallery of a shop, translated to a screen without flattening it into a catalog.",
      field: "Digital Strategy  Brand System  Ecommerce Design  UX Architecture",
      author: "Jeremy Prasatik",
      published: "2015",
      status: "Live",
      classification: ["Digital Strategy", "Brand System", "Ecommerce Design", "UX Architecture"],
      summary: [
        { label: "Built", value: "The online store, the brand around it, and the templates for telling stories" },
        { label: "Scope", value: "Digital strategy, brand system, ecommerce design, UX architecture" },
        { label: "Stack", value: "Photoshop, Illustrator, Sketch, InVision" },
        { label: "Angle", value: "The site had to work the way the store worked: an edit that changed with the season, and a story ahead of every sale." },
      ],
      abstract:
        "Jeffrey had never sold online. The store itself was closer to a gallery than a shop, edited by people with a very specific eye, and the job was to get that feeling onto a screen.\n\nThe work started with the buying team: how the floor was laid out, how pieces got grouped, what made an edit feel like Jeffrey. The strategy that came out of it put the stories ahead of the selling. Designer launches as the big moments, new content every week, and an editorial pace built into the structure of the site.\n\nFrom there the whole thing got designed. Modular grids so the layouts could change with the season, a type hierarchy that stayed sharp everywhere it showed up, product pages that opened on the photography, navigation organized around the edit instead of by category. Integration ran with outside partners while the experience stayed in-house, and every interaction from wireframe to checkout was prototyped.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/jeffrey-new-york-saint-laurent-shoes-homepage-laptop-hero.jpg`,
      alt: "The Jeffrey homepage open on a laptop, the Jeffrey x Saint Laurent spring/summer shoes story running across it",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE STRATEGY
    // ════════════════════════════════════════
    {
      id: "strategy-header",
      type: "section-header",
      label: "SECTION 02: THE STRATEGY",
      title: "Each one took over the homepage",
      // pin so the thesis headline holds while its two paragraphs travel
      // up beside it. Nothing climbs this brief — the zoom two beats down
      // reserves its own room — so the flag is staging for the headline
      // rather than a hold handed to a riser.
      pressing: {
        mark: { n: "02", name: "Six Homepages" },
        heldLine: "for its moment.",
        choreo: { pin: true },
      },
    },
    {
      id: "strategy-subhead",
      type: "text",
      size: "subhead",
      content:
        "Dries Van Noten, Valentino, Vetements, a Candy Crush shoe story, summer shoes, Loewe. The masthead and footer stayed put.",
    },
    {
      id: "strategy-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The floor got regrouped every time the season shifted, and the homepage had to turn over the same way. So the templates for a launch or a new story came first, and the product pages came after.",
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
      /* Held so the plate below can climb it. The six templates stay on
         screen while one of them arrives as a photograph, which is the
         whole point of putting them next to each other. */
      pressing: { choreo: { pin: true } },
    },

    // ── The old cover, kept. The grid above shows the six homepages
    // as flat templates; this is one of them in the world, which is
    // the beat that grid was missing. 3100px native, so a full-column
    // plate is well inside its own pixels.
    {
      id: "flagship-in-the-world",
      type: "image",
      src: `${IMG}/jeffrey-new-york-digital-flagship-hero.jpg`,
      alt: "The Valentino homepage open on a laptop sitting on a small table in a field of daisies",
      aspect: "native",
      padded: true,
      pressing: { choreo: { rise: true } },
    },

    // ── Editorial headline — replaces the original closing's
    // "established digital presence for seasons to come" performative line.
    {
      id: "headline-flagship",
      type: "editorial-headline",
      text: "A launch on Tuesday,\na sale on Wednesday",
    },

    // ════════════════════════════════════════
    // SECTION 03 — THE SYSTEM
    // ════════════════════════════════════════
    {
      id: "system-header",
      type: "section-header",
      label: "SECTION 03: THE SYSTEM",
      title: "The product page ran one large",
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
        heldLine: "photograph and little else.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "system-subhead",
      type: "text",
      size: "subhead",
      content:
        "A short row of curated cross-sells sat underneath. Navigation followed the edit instead of a list of categories, the same way the floor did.",
    },
    {
      id: "system-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Merchandising could lay out a new season without touching the templates underneath: swap the photography, swap the copy, publish. The type hierarchy did not move, which is what kept the site from sliding toward a catalog as the store grew.",
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
      title: "Avenir Next and\nthe wordmark's yellow.",
      introText:
        "The wordmark, Avenir Next Heavy Italic set wide, worked as a graphic mark before it read as a name. Everything else stayed out of the photography's way.",
      philosophyText:
        "The palette is narrow on purpose. Charcoal for the type, cream as the ground so the photography reads, a soft gray for captions and meta, and one yellow accent pulled straight from the wordmark for the editorial moments. There is no second accent. The merchandise brings whatever color it needs.\n\nThe type is one family. Avenir Next Heavy for the wordmark and feature headlines, Demi Bold for subheads and calls to action, Medium for everything else. The weights do the hierarchy on their own, so there is no second typeface.",
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
            "Avenir Next Heavy Italic at scale. The same wordmark as the storefront, set wide and locked tight as a graphic mark.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 800,
          italic: true,
        },
        {
          name: "Avenir Next Heavy",
          role: "Feature headlines",
          description:
            "The heaviest upright weight, for designer launches and feature headlines. Next to the wordmark, this is as loud as the site gets.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 800,
        },
        {
          name: "Avenir Next Demi Bold",
          role: "Subhead & CTAs",
          description:
            "For subheads, callouts, and CTAs. One step down from Heavy.",
          family: "'Avenir Next', 'Helvetica Neue', sans-serif",
          weight: 600,
        },
        {
          name: "Avenir Next Medium",
          role: "Body & captions",
          description:
            "For product copy, descriptions, and longer text.",
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
      title: "Wordmark, type, grid, photography.",
      // pin: the radius diagram below is not a riser, so this holds the
      // header while its one paragraph travels, the same staging every
      // other brief in the study gets.
      pressing: {
        mark: { n: "04", name: "Four Pieces" },
        heldLine: "Every page ran on them.",
        choreo: { pin: true },
      },
    },
    {
      id: "build-subhead",
      type: "text",
      size: "subhead",
      content:
        "The chart traces those four pieces from the brand experience at the center out through every surface a customer touched. Denser rays mean more assets on that surface.",
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
      title: "The site outlasted",
      pressing: {
        mark: { n: "05", name: "Outlasted the Team" },
        heldLine: "the team that built it.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "Jeffrey eventually sold the business.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Digital Strategy", "Brand System", "Ecommerce Design", "UX Architecture"],
      stack: ["Photoshop", "Illustrator", "Sketch", "InVision"],
      links: [],
      content:
        "Strategy, brand, architecture and content, all working from the same edit as the floor. The type kept the voice steady while everything under it changed every week.",
    },
  ],
};
