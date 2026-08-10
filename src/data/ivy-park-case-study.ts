import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/ivy-park";

export const ivyParkCaseStudy: CaseStudy = {
  slug: "ivy-park",
  title: "Ivy Park by Beyoncé",
  category: { label: "Creative", href: "/category/creative" },
  subtitle:
    "Exclusive US digital launch for Beyoncé's first activewear brand. Full campaign from concept to live in six weeks.",
  field: "Creative Direction\nCampaign Design\nExperience Design",
  author: "Jeremy Prasatik",
  published: "2016",
  status: "Complete",
  classification: [
    "Creative Direction",
    "Campaign Design",
    "Experience Design",
    "Copywriting",
  ],
  services: [
    "Creative Direction",
    "Campaign Design",
    "Experience Design",
    "Copywriting",
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
        "Nordstrom held the exclusive US launch. Six weeks from moodboard to live, and most of the product gone within days.",
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
        { label: "Angle", value: "Nordstrom held the only US partnership, so the website was the entire launch. One polygon, six weeks, no margin." },
      ],
      abstract:
        "Beyoncé's first activewear line, with Nordstrom holding the exclusive US retail partnership. That meant the digital experience had to carry the full weight of the launch - no other retailer had product, no other site told the story, and the website became the storefront, lookbook, and campaign rolled into one URL.\n\nFour weeks to moodboards, wireframes, and a concept pitch, then two weeks to build and ship. The brief arrived under NDA before the team had cleared their schedules. Daily calls with Ivy Park while direction locked. Photography supplied: black-and-white athlete portraits and color product against blue and gray backgrounds, with everything else - typography, layout, copy, animation, interaction - left open. That kind of latitude on a project this visible doesn't happen often.\n\nThe polygon emerged during concepting as a way to break the rectangular grid the photography sat in. Angled, rotated, animated on scroll, it carried from hero banner through product carousels into email headers. Custom CMS components built for the project entered Nordstrom's shared library and powered other launches for two years. 95% of products sold out within days.",
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
      title: "An NDA Before",
      pressing: {
        mark: { n: "02", name: "An NDA Before" },
        heldLine: "the Brief Landed.",
        // Pinned. The signature is the fixed point of this beat, so the
        // headline holds while the timeline, the freedom and the scope
        // travel up past it.
        choreo: { pin: true },
      },
      group: { name: "brief", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "brief-text",
      type: "text",
      size: "subhead",
      content:
        "Sign first, find out after. What the signature bought: Beyoncé's name on the project, and a schedule with no slack in it.",
      group: { name: "brief" },
    },
    {
      id: "brief-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Nobody in activewear had tried the position Ivy Park was staking out, luxury fashion on one side, athletic performance on the other. No precedent to reference, no competitor to copy. The design had to land in that gap without leaning toward either side.",
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
            "One scrolling brand experience. Launch emails timed to the drop. Digital marketing across Nordstrom's owned channels, social cut for each platform, in-store signage for the locations carrying the line.\n\nSix deliverable categories built from the same handful of elements.",
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
        instruction: "Scroll — fills the mat, then travels the frame",
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
      // and got reused until it read as the visual language, which is
      // the claim the header should make instead.
      title: "One Shape Became",
      // The study's one crossing, on the shape that IS the argument.
      // pin declared alongside it: the crossing already holds its headline
      // for 220dvh, and saying so out loud is what gives the page plate
      // below a named holder to climb.
      pressing: {
        mark: { n: "03", name: "One Shape Became" },
        heldLine: "the Whole Language.",
        choreo: { pin: true, crossing: true },
      },
    },
    {
      id: "experience-text",
      type: "text",
      size: "subhead",
      content:
        "Every photo came in a rectangle. One angled shape started cutting portraits out of the grid, then took over the page.",
    },
    {
      id: "experience-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Started as a crop mask for portraits. Angled edges against straight photography gave the athlete imagery the exact tension the positioning called for. One geometric idea handling framing, motion, and signature.",
    },

    // ── EXPERIENCE SCREENSHOT ──
    {
      id: "experience-page-1",
      type: "image",
      src: `${IMG}/ivy-park-scrolling-experience-polygon-typography.jpg`,
      alt: "Ivy Park scrolling experience detail, polygon portrait frames, Courage is Power typography",
      aspect: "native",
      // Rises across the crossing it answers: the claim holds on screen
      // while the page that proves it climbs over the top. Not a zoom —
      // the file is 2188px native, under the 3000 bar, and a zoom would
      // magnify a screenshot past what its pixels carry.
      pressing: { choreo: { rise: true } },
    },

    // ── THE POLYGON DEVICE — both polygon motion pieces, moved here from
    // elsewhere on the page so they sit where the section actually names
    // them. The framed portrait was previously the page's own opening
    // beat, ahead of THE BRIEF; the lattice lived inside the brand-system
    // section, several beats past where anyone had explained what it was.
    {
      id: "experience-hex-frame",
      type: "hex-polygon",
    },
    {
      id: "experience-polygon-lattice",
      type: "polygon-lattice",
      name: "One Shape, Endlessly Rotated",
      // The overstated first sentence ("was the whole identity") is gone;
      // see the header comment above for the same correction. The rest of
      // the paragraph was never in question.
      description:
        "The hexagon was an accent that grew into the system. One angle, rotated and rescaled until it read as a logo, a frame, and a motion system at once. One mark doing the job usually split across three.",
    },

    {
      id: "experience-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Polygon",
          content:
            "A hexagonal frame, sometimes cropping a portrait tight to the jawline, sometimes opening wide enough to hold a full figure.\n\nOn scroll it rotated slowly, giving flat photography a sense of depth. A single CSS transform doing real design work.",
        },
        {
          title: "Typography at Volume",
          content:
            "\"Confidence is Strength.\" The voice got written during production, line by line, while the pages took shape. Short declarative lines, present tense, speaking straight to the reader when it spoke to anyone at all.",
        },
        {
          title: "CMS Legacy",
          content:
            "The experience required components that didn't exist in Nordstrom's CMS - parallax modules, animated polygon masks, full-bleed video with scroll-triggered playback, type lockups with responsive scaling.\n\nBuilt them. The Ivy Park project paid for itself in reusable infrastructure.",
        },
      ],
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
    {
      id: "brand-system",
      type: "brand-system-volume",
      label: "SECTION 04: BRAND SYSTEM",
      title: "Built Without a Brand Guide",
      introText:
        "No palette. No type system. No rules at all. The photography and the name arrived, the rest got invented.",
      footText:
        "Six weeks to build the visual language while the page itself came together. The polygon, the type set at volume, the scroll that ran from grayscale into color. One system carrying a launch that lived on a single URL.",
      philosophyHeading: "The System",
      philosophyText:
        "No master file ever existed. The palette, the type, the shape, all of it got set during production and stayed consistent because the group building it was small and stayed the same.\n\nWhat follows is the working kit. The letterform behind the logo, the colors as they ran, the type at full volume, and the one shape the identity leaned on.",
      roleLines: [
        {
          name: "The Polygon",
          role: "Signature device",
          description:
            "No lockup rules, no clear-space diagram. Repetition did the job a guide would have.",
        },
        {
          name: "Type at Volume",
          role: "Voice",
          description:
            "Big type, mixed weights, baselines knocked off the grid. Loud enough to hold its own next to the photography instead of sitting under it.",
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
      typeComposition: {
        ghostWord: "IVY",
        thinLead: "Confidence is ",
        heavyWord: "Strength",
        lockupTop: "Courage is",
        lockupVertical: "POWER",
        note: "One voice that read at 12px in an email subject line and 200px across a scrolling hero.",
      },
    },

    // ── THE CAMPAIGN ──
    {
      id: "campaign-header",
      type: "section-header",
      label: "SECTION 05: THE CAMPAIGN",
      title: "One System,\nEvery Format.",
      // Pinned. "One System" stays on screen while every format it fed
      // scrolls past underneath, which is the section's whole point.
      pressing: { mark: { n: "04", name: "One System" }, choreo: { pin: true } },
    },
    {
      id: "campaign-text",
      type: "text",
      size: "subhead",
      content:
        "The page set the rules. Everything downstream inherited them.",
    },
    {
      id: "campaign-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Once the page locked, the rest was format adaptation. Polygon, type, photography already established - email templates, banner ads, and social formats became execution rather than invention. The visuals scaled because the elements were simple: a polygon crops the same at 300px and 3000px, bold type reads at any size, black-and-white photography converts to any aspect ratio.",
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
      title: "Sold Out\nin Days",
      pressing: { mark: { n: "05", name: "Sold Out" } },
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Live in six weeks. 95% of the product gone in less.",
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
        "The creative direction, typography, layout, motion, copy, and rollout happened in a Nordstrom office with a small team and a hard deadline. The brief was open enough to allow real decisions and tight enough on time to require them.\n\nThe polygon, the type at scale, the progression from black-and-white into color - none of it came from a brand guide. There wasn't one.\n\nAfter launch, Beyoncé sent the team a personal thank-you video. That part stays off social.",
    },
  ],
};
