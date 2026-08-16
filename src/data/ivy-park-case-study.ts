import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/ivy-park";

export const ivyParkCaseStudy: CaseStudy = {
  slug: "ivy-park",
  title: "Ivy Park by Beyoncé",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "The Ivy Park launch for Nordstrom, the exclusive US partner. | Six weeks from moodboard to live, and most of the product gone within days.",
  field: "Creative Direction\nCampaign Design\nExperience Design\nEcommerce Design",
  author: "Jeremy Prasatik",
  published: "2016",
  status: "Complete",
  classification: [
    "Creative Direction",
    "Campaign Design",
    "Experience Design",
    "Copywriting",
    "Ecommerce Design",
  ],
  services: [
    "Creative Direction",
    "Campaign Design",
    "Experience Design",
    "Copywriting",
    "Ecommerce Design",
  ],
  stack: ["Nordstrom CMS", "Custom Components", "HTML/CSS/JS"],
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
        colors: ["#1B1B1B", "#605D5C", "#363D45", "#B4B4B4", "#B9B9B9"],
        images: [
          "/case-studies/ivy-park/ivy-park-nordstrom-laptop-brand-experience-mockup.jpg",
          "/case-studies/ivy-park/ivy-park-campaign-assets-grid-overview.jpg",
          "/case-studies/ivy-park/ivy-park-scrolling-experience-polygon-typography.jpg",
          "/case-studies/ivy-park/ivy-park-experience-page-hero-product-grid.jpg",
          "/case-studies/ivy-park/ivy-park-experience-confidence-strength-inclusivity.jpg",
          "/case-studies/ivy-park/ivy-park-experience-courage-power-polygon-frames.jpg",
          "/case-studies/ivy-park/ivy-park-nordstrom-mobile-experience-mockup.jpg",
          "/case-studies/ivy-park/ivy-park-product-detail-leggings-choice-system.jpg",
        ],
      },
      title: "Ivy Park\nby Beyoncé",
      subtitle:
        "The Ivy Park launch for Nordstrom, the exclusive US partner. | Six weeks from moodboard to live, and most of the product gone within days.",
      field: "Creative Direction  Campaign Design  Experience Design",
      author: "Jeremy Prasatik",
      published: "2016",
      status: "Complete",
      classification: [
        "Creative Direction",
        "Campaign Design",
        "Experience Design",
        "Copywriting",
      ],
      summary: [
        { label: "Built", value: "Scrolling brand experience, launch emails, social, in-store signage" },
        { label: "Scope", value: "Creative direction, experience design, copywriting" },
        { label: "Stack", value: "Nordstrom CMS, custom components, HTML/CSS/JS" },
        { label: "Angle", value: "No other US retailer had the product, so this website was the launch. Six weeks, with the photography supplied and everything else open." },
      ],
      abstract:
        "Beyoncé's first activewear line. Nordstrom had the exclusive US partnership, so this page had to be the store, the lookbook and the campaign at the same time.\n\nFour weeks for moodboards, wireframes and a concept pitch, then two weeks to build and ship. The brief came in under NDA before the team had cleared their schedules, and there were daily calls with Ivy Park while the direction locked. The photography was supplied, black-and-white athlete portraits and color product on blue and gray, and everything else was open: typography, layout, copy, animation, interaction.\n\nThe polygon showed up during concepting as a way to break the rectangular grid the photography came in. Angled, rotated and animated on scroll, it ran from the hero banner through the product carousels into the email headers. The custom CMS components built for the project went into Nordstrom's shared library and powered other launches for two years. 95% of the product sold out within days.",
    },

        // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/ivy-park-nordstrom-laptop-brand-experience-mockup.jpg`,
      alt: "Ivy Park by Beyoncé, Nordstrom brand experience on laptop, concrete surface",
      pressing: { choreo: { rise: true } },
    },

    // ── THE BRIEF — grouped ──
    {
      id: "brief-header",
      type: "section-header",
      label: "SECTION 02: THE BRIEF",
      title: "Beyoncé's first activewear brand.",
      pressing: {
        mark: { n: "02", name: "The Brief" },
        heldLine: "Six weeks to launch it.",
        // Pinned. The signature is the fixed point of this beat, so the
        // headline holds while the timeline, the freedom and the scope
        // travel up past it.
        choreo: { pin: true },
      },
      group: { name: "brief", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    // No subhead here on purpose. The headline already says Beyoncé,
    // activewear, six weeks; a line under it setting up the NDA story
    // was re-telling what the display type had just said.
    {
      id: "brief-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Ivy Park was staking out a spot between luxury fashion and athletic performance, and there was no obvious reference for it. The design had to sit in that gap and feel like it belonged there.",
      group: { name: "brief" },
    },
    {
      id: "brief-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Timeline",
          content:
            "Week one: references, moodboards, competitive audit. Weeks two through four: wireframes, design concepts, copywriting, motion studies, all of it presented to Beyoncé's creative team, revisions turned around overnight. Weeks five and six: build and ship.",
        },
        {
          title: "The Freedom",
          content:
            "The portraits came editorial in tone, with range across body types and ethnicities. Everything around them was open territory.\n\nSo the type went larger than expected, motion lived in every scroll position, and the photography kept room to breathe.",
        },
        {
          title: "The Scope",
          content:
            "One scrolling brand experience. Launch emails timed to the drop. Digital marketing across Nordstrom's owned channels, social cut for each platform, in-store signage for the locations carrying the line.\n\nAll of it built from the same handful of elements.",
        },
      ],
      group: { name: "brief" },
    },

    // ── CAMPAIGN GRID ──
    {
      id: "campaign-grid",
      type: "hero",
      image: `${IMG}/ivy-park-campaign-assets-grid-overview.jpg`,
      alt: "Ivy Park campaign assets grid: brand experience, emails, social, product photography, editorial",
      inline: true,
      // The zoom. An assets grid is a contact sheet of the whole campaign,
      // and every cell in it is unreadable until the frame fills the mat.
      // No zoomFit: the frame is near-square, so the spill is a short pan.
      pressing: {
        plate: "02",
        captions: [
          "Campaign assets",
          "Experience, email, social",
          "Product and editorial",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
        choreo: { zoom: true },
      },
    },

    // ── THE EXPERIENCE ──
    {
      id: "experience-header",
      type: "section-header",
      label: "SECTION 03: THE EXPERIENCE",
      // "Held the page together" overstated what the shape actually did:
      // it was never structural. It started as a crop mask (an accent)
      // and got reused until it read as the visual language.
      //
      // That first rewrite ("One Shape Became the Whole Language") was
      // still scoped to the shape alone, and this header now carries the
      // full three-column breakdown below it (Polygon, Typography, CMS) —
      // only one of those three is actually about the shape. Claiming the
      // shape became "the whole language" while two-thirds of the
      // evidence is about something else is the same overreach in a new
      // sentence. "Led" / "backed it up" states the true relationship: the
      // shape is the signature the study leads with, and the other two
      // systems supported it. Nobody claims one built the other.
      // Copy pass, Aug 2026: "One Shape Led. The Rest Backed It Up." was
      // an aphorism about the thing. The headline now names the thing on
      // the page (the hexagon, and what it does). Reasoning above kept.
      title: "The hexagon started as a way",
      // Brief-form crossing, matching black-white-type and Sally: the
      // headline still cuts in from the right (crossing), then pins while
      // the copy AND the nested three-column grid travel past it — one
      // continuous reading unit rather than a standalone thesis screen
      // followed by images before the reader ever reaches its own
      // supporting columns.
      pressing: {
        mark: { n: "03", name: "The Polygon" },
        heldLine: "to cut portraits out of a grid.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "experience-text",
      type: "text",
      size: "subhead",
      content:
        "Every photo came in as a rectangle. Then the shape was on everything.",
    },
    {
      id: "experience-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Angled edges against straight photography gave the athlete portraits some tension. Then the shape ended up doing the framing, the motion and the signature all at once.",
    },

    // Directly after the footnote, no image between them, so the fold
    // absorbs this as the header's own nested method grid — the column
    // reads as one continuous unit with the header, not a separate block
    // reached after a run of images.
    {
      id: "experience-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Polygon",
          content:
            "A hexagonal frame, sometimes cropped tight to a jawline, sometimes open wide enough for a full figure.\n\nOn scroll it rotated slowly, which gave the flat photography some depth. Under the hood it was one CSS transform.",
        },
        {
          title: "Typography at Volume",
          content:
            "\"Confidence is Strength.\" The type ran big, and the copy got written during production, line by line, as the pages took shape. Short lines in the present tense, talking straight to the reader.",
        },
        {
          title: "CMS Legacy",
          content:
            "The experience needed components Nordstrom's CMS didn't have: parallax modules, animated polygon masks, full-bleed video that played on scroll, type lockups that scaled with the screen.\n\nSo they got built, and they stayed in the CMS after the launch.",
        },
      ],
    },

    // ── THE POLYGON DEVICE — moved here from the page's opening beat,
    // ahead of THE BRIEF, so it sits where the section actually names it,
    // directly after the brief cluster and ahead of the screenshot it
    // introduces.
    {
      id: "experience-hex-frame",
      type: "hex-polygon",
    },

    // ── EXPERIENCE SCREENSHOT — climbs the hex device above it. PressingLayout's
    // viz bridge now reserves ClimbRoom whenever a rise follows a bridged
    // section (added for this exact adjacency — measured before the fix,
    // the pull-up landed 794px into the device's own 1167px-tall frame,
    // covering most of the visible artwork, not trailing padding). Not a
    // zoom — the file is 2188px native, under the 3000 bar. ──
    {
      id: "experience-page-1",
      type: "image",
      src: `${IMG}/ivy-park-scrolling-experience-polygon-typography.jpg`,
      alt: "Ivy Park scrolling experience detail, polygon portrait frames, Courage is Power typography",
      aspect: "native",
      pressing: { choreo: { rise: true } },
    },
    {
      // No copy over the pattern any more — the name/description here
      // said "was an accent that grew into the system," which the header
      // and columns right above it already say. Pure pattern now, filling
      // its box edge to edge instead of sitting centred in a fixed span.
      id: "experience-polygon-lattice",
      type: "polygon-lattice",
    },

    // ── EXPERIENCE SCREENS — 3 across ──
    {
      id: "experience-screens",
      type: "triple-image",
      native: true,
      images: [
        { src: `${IMG}/ivy-park-experience-page-hero-product-grid.jpg`, alt: "Ivy Park brand experience, full page hero section and product grid" },
        { src: `${IMG}/ivy-park-experience-confidence-strength-inclusivity.jpg`, alt: "Ivy Park experience, Confidence is Strength section, product specs, inclusivity messaging" },
        { src: `${IMG}/ivy-park-experience-courage-power-polygon-frames.jpg`, alt: "Ivy Park experience, Courage is Power section with polygon portrait frames" },
      ],
      // Held so the phone climbs across the desktop pages. Same system,
      // smaller screen, and the climb is what puts them in that order.
      pressing: {
        captions: ["Hero and product grid", "Confidence is Strength", "Courage is Power"],
        choreo: { pin: true },
      },
    },

    // ── MOBILE HERO — climbs across the held desktop screens
    {
      id: "mobile-hero",
      type: "hero",
      image: `${IMG}/ivy-park-nordstrom-mobile-experience-mockup.jpg`,
      alt: "Ivy Park mobile experience on iPhone, Courage is Power section, concrete surface",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── EDITORIAL HEADLINE — the palate cleanser after the climb
    {
      id: "headline-polygon",
      type: "editorial-headline",
      text: "For everybody\nand every body",
    },

    // ── BRAND SYSTEM — built without a brand guide ──
    // Draws through PressingSystemIndex, the same ledger every other
    // pressing study uses: four rows, Typeface / Palette / The Polygon
    // / Surfaces, each with a live specimen.
    //
    // footText, philosophyHeading, roleLines, morphGlyphs and
    // typeComposition below are NOT rendered any more — the old
    // two-tone panel was the only thing that drew them. They stay
    // because the ledger is fed FROM them: roleLines' polygon entry is
    // now the elements row, and specimenWords is typeComposition's own
    // vocabulary. Delete either and the row above loses its source.
    {
      id: "brand-system",
      type: "brand-system-volume",
      label: "SECTION 04: BRAND SYSTEM",
      title: "Palette, type and shape,\nall decided during production.",
      introText:
        "Nothing came with it except the photography and the name. No palette, no type, no rules.",
      footText:
        "The visual language got worked out while the page itself came together. The polygon, the type set at volume, the scroll that ran from grayscale into color.",
      philosophyHeading: "The System",
      philosophyText:
        "There was never a master file. It stayed consistent because the group building it was small and didn't change.\n\nWhat follows is the working kit: the letterform behind the logo, the colors as they ran, the type at full volume, and the shape the identity leaned on.",
      roleLines: [
        {
          name: "The Polygon",
          role: "Signature device",
          description:
            "No lockup rules and no clear-space diagram. Repetition stood in for a guide.",
        },
        {
          name: "Type at Volume",
          role: "Voice",
          description:
            "Big type, mixed weights, baselines knocked off the grid, loud enough to sit beside the photography.",
        },
      ],
      morphGlyphs: [
        { char: "I", font: "avenir-bold" },
        { char: "V", font: "avenir-bold" },
        { char: "Y", font: "avenir-bold" },
      ],
      colors: [
        { name: "Signal", hex: "#18A6CC", rgb: "24 166 204" },
        { name: "Neutral", hex: "#8E9499", rgb: "142 148 153" },
        { name: "Ground", hex: "#0E0E0E", rgb: "14 14 14" },
      ],
      // The face the study's own display type is already set in: the
      // morphGlyphs above declare avenir-bold, and globals.css loads
      // Avenir Next across six weights. Naming it here is the ledger
      // reading data the study already holds, not a new claim.
      // The four weights are the UPRIGHT cuts globals.css actually
      // loads; the other two files are italics of 700 and 800, so
      // listing them would step the specimen through a weight twice.
      fonts: [
        { name: "Avenir Next", role: "One face, four cuts", weights: [500, 600, 700, 800] },
      ],
      // Every word the campaign actually set, and nothing else. IVY /
      // Confidence / Strength / Courage / POWER are the typeComposition
      // below, verbatim; Everybody is the editorial headline upstream.
      // The row is a specimen of the voice, not a place to write new
      // lines.
      specimenWords: ["IVY", "Confidence", "Strength", "Courage", "POWER", "Everybody"],
      // Reallocated from the roleLines above, which nothing renders any
      // more. The lattice upstream is the artwork; this is the ledger
      // entry for it, which is the difference between showing a shape
      // and specifying one.
      elements: { label: "The Polygon", caption: "Signature device", sides: 6 },
      // Four surfaces the one system had to hold at: in-store signage,
      // phone, desktop, and the campaign sheet. All opaque JPGs, all
      // wildly different ratios, which is what the reel measures and
      // reshapes for.
      patternLibrary: [
        `${IMG}/ivy-signage.jpg`,
        `${IMG}/ivy-park-nordstrom-mobile-experience-mockup.jpg`,
        `${IMG}/ivy-park-nordstrom-laptop-brand-experience-mockup.jpg`,
        `${IMG}/ivy-park-campaign-assets-grid-overview.jpg`,
      ],
      // Not "pattern library": the section's whole argument is that no
      // master file existed, so naming a component library here would
      // contradict the copy three inches above it.
      patternLibraryLabel: "Surfaces",
      patternLibraryCaption: "Four of them",
      typeComposition: {
        ghostWord: "IVY",
        thinLead: "Confidence is ",
        heavyWord: "Strength",
        lockupTop: "Courage is",
        lockupVertical: "POWER",
        note: "The same voice at 12px in an email subject line and at 200px across a scrolling hero.",
      },
    },

    // ── THE CAMPAIGN ──
    {
      id: "campaign-header",
      type: "section-header",
      label: "SECTION 05: THE CAMPAIGN",
      title: "The page came first, and everything\nelse was adapted from it.",
      // Pinned. The headline stays on screen while every format it names
      // scrolls past underneath, which is the section's whole point.
      pressing: { mark: { n: "04", name: "The Campaign" }, choreo: { pin: true } },
    },
    {
      id: "campaign-text",
      type: "text",
      size: "subhead",
      content:
        "Emails, banners, social, in-store signage.",
    },
    {
      id: "campaign-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "That worked because the elements were simple. A polygon crops the same at 300px and at 3000px, bold type reads at any size, and black-and-white photography goes to any aspect ratio.",
    },

    // ── SIGNAGE — the "Confidence is Strength" typography-at-volume
    // system in situ. First image anywhere in the study to show it as
    // more than a quoted line: brief-columns names in-store signage as
    // one of the six deliverable categories, and the Typography at
    // Volume column quotes this exact line, but neither had a picture
    // until now. Rises across the brief above it, which already holds.
    {
      id: "campaign-signage",
      type: "image",
      src: `${IMG}/ivy-signage.jpg`,
      alt: "Ivy Park 'Confidence is Strength' typography system on a transit signage mockup",
      aspect: "native",
      pressing: { choreo: { rise: true } },
    },

    // ── CAMPAIGN IMAGES — 3 across ──
    {
      id: "campaign-screens",
      type: "triple-image",
      native: true,
      images: [
        { src: `${IMG}/ivy-park-product-detail-leggings-choice-system.jpg`, alt: "Ivy Park product detail, leggings specification, Choice is Everything, I/V/Y rise system" },
        { src: `${IMG}/ivy-park-shop-the-look-editorial-grid.jpg`, alt: "Ivy Park Shop the Look section, editorial product grid, model portraits" },
        { src: `${IMG}/ivy-park-editorial-beanie-portrait-dancer.jpg`, alt: "Ivy Park editorial, black and white beanie portrait and dancer movement" },
      ],
    },

    // ── CAMPAIGN BLAST RADIUS CHART ──
    {
      id: "blast-radius",
      type: "campaign-blast-radius",
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "95% of the product\nwas gone in days.",
      pressing: { mark: { n: "05", name: "Sold Out" } },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Live in six weeks.",
    },
    {
      id: "closing",
      type: "closing",
      services: [
        "Creative Direction",
        "Campaign Design",
        "Experience Design",
        "Copywriting",
      ],
      stack: ["Nordstrom CMS", "Custom Components", "HTML/CSS/JS"],
      links: [],
      content:
        "The creative direction, typography, layout, motion, copy and rollout all happened in a Nordstrom office, with a small team and a hard deadline. The brief was open enough to allow real decisions and tight enough on time to require them.\n\nAfter launch, Beyoncé sent the team a personal thank-you video. That part stays off social.",
    },
  ],
};
