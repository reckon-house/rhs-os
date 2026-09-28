import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/nordstrom-framework";

export const nordstromFrameworkCaseStudy: CaseStudy = {
  slug: "nordstrom-framework",
  title: "Nordstrom Content Framework",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "A content framework for Nordstrom.com, built from scratch with its own names, icons, and typographic marks. | Four buckets sort the stories on the homepage, in email, and on landing pages.",
  field: "Content Strategy\nBrand Design\nNaming\nEcommerce Design",
  author: "Jeremy Prasatik",
  published: "2016",
  status: "Complete",
  classification: ["Content Strategy", "Brand Design", "Naming", "Design Systems", "Ecommerce Design"],
  services: ["Content Strategy", "Brand Design", "Naming", "Design Systems", "Ecommerce Design"],
  stack: [],
  links: [],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META + ABSTRACT ──
    {
      id: "meta",
      type: "meta",
      reel: {
        caption: "Preview · 4 frames",
        colors: ["#E5DCD3", "#6E706E", "#918C88", "#61605E", "#403934"],
        images: [
          "/case-studies/nordstrom-framework/nordstrom-framework-on-our-list-phone-turntable.jpg",
          "/case-studies/nordstrom-framework/nordstrom-content-framework-lockup-whats-now.jpg",
          "/case-studies/nordstrom-framework/nordstrom-content-framework-lockup-where-to-wear.jpg",
          "/case-studies/nordstrom-framework/nordstrom-content-framework-lockup-on-our-list.jpg",
        ],
      },
      title: "Nordstrom\nContent Framework",
      subtitle:
        "A content framework for Nordstrom.com, built from scratch with its own names, icons, and typographic marks. | Four buckets sort the stories on the homepage, in email, and on landing pages.",
      field: "Content Strategy  Brand Design  Naming",
      author: "Jeremy Prasatik",
      published: "2016",
      status: "Complete",
      classification: ["Content Strategy", "Brand Design", "Naming", "Design Systems"],
      summary: [
        { label: "Built", value: "A content framework from scratch: four named buckets, each with its own typographic mark and icon." },
        { label: "Scope", value: "Content strategy, brand design, naming, design systems." },
        { label: "Tools", value: "Sourced typefaces and a custom icon set." },
        { label: "Angle", value: "Sort a store's worth of stories into sections, the way a magazine does." },
      ],
      abstract:
        "Nordstrom was producing more digital content than the site had structure for. Brand launches, seasonal pushes, occasion guides, and new arrivals all hit email and the site at the same time, with nothing sorting them. Customers got the whole pile and no way through it.\n\nConcepted a content framework that sorted Nordstrom's stories into four named buckets: \"What's Now,\" \"On Our List,\" and two for occasion dressing, \"Where to Wear\" and \"Wear to Where.\" Each bucket got a custom icon and a typographic mark of its own.\n\nPitched the framework to merchandising, marketing, and editorial, and once it shipped it ran homepage modules, email sections, and dedicated landing pages. Engagement lifted 22% over two years.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/hero1.png`,
      alt: "Nordstrom Content Framework applied across the site, custom lockups powering the categorized homepage system",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE PROBLEM
    // ════════════════════════════════════════
    {
      id: "problem-header",
      type: "section-header",
      label: "SECTION 02: THE PROBLEM",
      title: "Nothing on Nordstrom's homepage",
      pressing: {
        mark: { n: "02", name: "All at Once" },
        heldLine: "said which story was which.",
        // Holds while the column travels, and reserves the room the
        // homepage plate below needs to climb. Fitting for a brief whose
        // subject is a page carrying too much at once.
        choreo: { pin: true },
      },
    },
    {
      id: "problem-subhead",
      type: "text",
      size: "subhead",
      content:
        "The merchandising, marketing and editorial teams each pushed their own stories onto the same homepage.",
    },
    {
      id: "problem-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Nordstrom's email ran on its own cadence and its landing pages on another, and the only thing tying any of it together was the date on the calendar.",
    },

    // Visual beat showing the volume of modules. Climbs the problem brief:
    // the copy names the pile-up, then the homepage slides up over it and
    // shows it. hero3 is 1540 native, far short of the 3000 a zoom asks
    // for, so it rises.
    {
      id: "problem-image",
      type: "hero",
      image: `${IMG}/hero3.png`,
      alt: "Nordstrom homepage with multiple content modules running side by side under the new framework",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // SECTION 03 — THE FRAMEWORK
    // ════════════════════════════════════════
    {
      id: "framework-header",
      type: "section-header",
      label: "SECTION 03: THE FRAMEWORK",
      title: "Every story had to land",
      // The study's one crossing, on the move that solved the problem.
      //
      // Pinned as well as crossing, which is PRESSING.md's brief form of
      // the gesture: the four-bucket argument is the longest column in
      // the study, so the headline holds and the column travels past it
      // rather than sharing one screen with it.
      pressing: {
        mark: { n: "03", name: "Four Buckets" },
        heldLine: "in one of four buckets.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "framework-subhead",
      type: "text",
      size: "subhead",
      content:
        "The What's Now bucket was for new arrivals and trending brands, and On Our List for seasonal picks and staples. The Where to Wear and Wear to Where buckets both covered occasion dressing, one starting from the event and the other from the outfit.",
    },
    {
      id: "framework-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Sourced a different typeface for every bucket's typographic mark.",
    },

    // Editorial palate cleanser
    {
      id: "headline-language",
      type: "editorial-headline",
      text: "The bucket names\nsound like a magazine's sections",
    },

    // ── The 3 lockups, DEALT ─────────────────────────────────────────
    // These were three full-width plates once, and the note here used to
    // record why that failed: pin/rise holds ONE screen for ONE riser,
    // so the second and third plate had nothing holding above them. The
    // fix then was a row. The fix now is a stack that needs neither —
    // every slab is position: sticky against one box, so the browser
    // holds all three with no driver and no climb to arrange.
    //
    // That buys back the size the row was spending. At a third of the
    // page these ran about 600 CSS px against 2418 native, less than
    // half the resolution the files carry; a slab runs 1100, inside the
    // 1209 the honest-width rule allows (native ÷ 2) and nearly double
    // what they had.
    //
    // And it sharpens the claim rather than softening it. A row compares
    // by juxtaposition; a stack compares by SUBSTITUTION — each mark
    // lands in the rectangle the last one held, so "no two lockups share
    // a face" is tested in one place instead of across two gaps.
    {
      id: "lockups",
      type: "triple-image",
      native: true,
      pressing: {
        choreo: { stack: true },
        // Named in the stack the way they are not in a row: you meet one
        // at a time, so the bucket it belongs to has to travel with it.
        //
        // ⚠️ THE CAPTIONS DO NOT MATCH THE FILENAMES, AND THAT IS
        // CORRECT. Two of these files are named for the wrong mark:
        // ...lockup-where-to-wear.jpg carries "on our list", and
        // ...lockup-on-our-list.jpg carries "wear to where". Opened both
        // to check, because the first pass of these captions was read
        // off the filenames and shipped a label that contradicted the
        // picture under it. The alt text below had the same error and is
        // fixed with them. Renaming the files is the real repair; it is
        // a separate change because three studies and the reel reference
        // these paths.
        //
        // Note the mark itself reads "wear to where", not "where to
        // wear" — the inversion is the campaign's, not a typo.
        // What each bucket actually sorts for, from Jeremy. In a deck you
        // meet one mark at a time, so the name alone would leave a reader
        // with three phrases and no idea what separates them.
        captions: [
          "What's Now\nOf the moment. Trending, hot.",
          "On Our List\nThe foundational staples everyone needs.",
          "Wear to Where\nOccasion-based items and looks.",
        ],
      },
      images: [
        {
          src: `${IMG}/nordstrom-content-framework-lockup-whats-now.jpg`,
          alt: "What's Now lockup, custom typographic mark and category icon for the trending brands and new arrivals bucket",
        },
        {
          // Filename says where-to-wear; the mark on it reads "on our list".
          src: `${IMG}/nordstrom-content-framework-lockup-where-to-wear.jpg`,
          alt: "On Our List lockup, custom typographic mark with a check over desert editorial photography",
        },
        {
          // Filename says on-our-list; the mark on it reads "wear to where".
          src: `${IMG}/nordstrom-content-framework-lockup-on-our-list.jpg`,
          alt: "Wear to Where lockup, custom typographic mark with a cursor over activewear photography",
        },
      ],
    },

    // ════════════════════════════════════════
    // SECTION 04 — APPLICATION
    // ════════════════════════════════════════
    {
      id: "application-header",
      type: "section-header",
      label: "SECTION 04: APPLICATION",
      title: "Every homepage module and email section",
      pressing: {
        mark: { n: "04", name: "Homepage, Email" },
        heldLine: "carried its bucket's lockup and icon.",
        // Pins for the headline alone. Three surfaces get named in the
        // column and the landing page below answers all three, so the
        // title should still be on screen when the reader reaches it.
        // Nothing climbs this brief: the zoom plate reserves its own room.
        choreo: { pin: true },
      },
    },
    {
      id: "application-subhead",
      type: "text",
      size: "subhead",
      content:
        "Whole landing pages on Nordstrom.com were built around a single bucket, so a customer could tell what they were looking at.",
    },
    {
      id: "application-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Content calendars mapped stories to buckets at the brief stage, and campaigns that used to be one-offs got planned as part of a category.",
    },

    // Tall application hero
    // ── One bucket, out in the world. §04 is the section about whole
    // pages built around a single bucket "each carrying the matching
    // lockup", and this is On Our List doing exactly that on a phone.
    //
    // It climbs the §04 brief, whose pin had nothing crossing it until
    // now — application-hero below is a zoom, and a zoom holds its own
    // screen rather than climbing anything. Copy is also the right
    // thing for a plate this size to cross: at 760 it could not cover a
    // full-width picture, which is what made the Loved by Nordstrom
    // riser read as a sticker.
    //
    // 760 rather than full bleed: the file is 1920px, so 960 is its
    // honest half and a 1440 plate would draw it at 0.75x. Portrait, so
    // 760 keeps it inside a laptop screen at 856 tall.
    {
      id: "on-our-list-phone",
      type: "image",
      src: `${IMG}/nordstrom-framework-on-our-list-phone-turntable.jpg`,
      alt: "A phone lying on a silver turntable showing the On Our List story, the bucket's script lockup over the editorial photograph",
      aspect: "native",
      pressing: {
        caption: "On Our List, on a phone",
        plateWidth: 760,
        choreo: { rise: true },
      },
    },

    {
      id: "application-hero",
      type: "image",
      src: `${IMG}/hero2.png`,
      alt: "Nordstrom Content Framework applied across a full vertical landing page, lockups and category icons anchoring each module",
      // The zoom. A full vertical landing page is exactly the frame the
      // default fit was built for: it fills the width and leaves most of
      // its height below the fold, so scrolling travels the page the way
      // a customer would. No zoomFit.
      pressing: {
        plate: "04",
        captions: [
          "The framework applied",
          "Full landing page",
          "Lockup and icon per module",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
      aspect: "native",
      padded: true,
    },

    // Final supporting hero. Climbs the zoom plate's held screen, which is
    // the only hold in the study taken from a plate rather than a brief.
    // hero4 is 1540 native and already on the resolution report, so the
    // climb draws it larger than its pixels really allow. Rule 1 has no
    // exception for a small file, and zoom is not available to it either
    // (that wants 3000+), so it rises and the file is the thing to fix.
    {
      id: "application-secondary",
      type: "hero",
      image: `${IMG}/hero4.png`,
      alt: "Nordstrom Content Framework section showing email and landing treatment with custom lockup and icon",
      pressing: { choreo: { rise: true } },
    },

    // ════════════════════════════════════════
    // CLOSING
    // ════════════════════════════════════════
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 05: CLOSING",
      title: "Engagement lifted 22%",
      pressing: {
        mark: { n: "05", name: "Up 22%" },
        heldLine: "over two years.",
      },
    },
    {
      id: "closing-subhead",
      type: "text",
      size: "subhead",
      content:
        "The icons, the typography and the bucket names all changed over time, but the four-bucket structure stayed the same.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Content Strategy", "Brand Design", "Naming", "Design Systems"],
      stack: [],
      links: [],
      content:
        "The bucket names showed up in Nordstrom's planning meetings before the framework reached a customer, and they ended up being how everyone who touched digital content talked about the work.",
    },
  ],
};
