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
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/ivy-park-nordstrom-laptop-brand-experience-mockup.jpg`,
      alt: "Ivy Park by Beyoncé, Nordstrom brand experience on laptop, concrete surface",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Ivy Park\nby Beyoncé",
      subtitle:
        "Nordstrom. Exclusive US launch. An NDA before the brief landed. Six weeks from moodboard to live, and most of the product gone within days.",
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
      abstract:
        "Beyoncé's first activewear line. Nordstrom held the exclusive US retail partnership, which meant the digital experience had to carry the full weight of the launch. No other retailer had product. No other site told the story. The website was the storefront, the lookbook, and the campaign rolled into one URL.\n\nFour weeks to moodboards, wireframes, and a concept pitch. Two weeks to build and ship. The brief arrived under NDA before the team had cleared their schedules. Daily calls with Ivy Park while direction locked. Photography supplied: black-and-white athlete portraits, color product against blue and gray backgrounds. Everything else open. Typography, layout, copy, animation, interaction. That kind of latitude on a project this visible doesn't happen often.\n\nThe polygon emerged during concepting as a way to break the rectangular grid the photography sat in. Angled, rotated, animated on scroll. It carried from hero banner through product carousels into email headers. Custom CMS components built for the project entered Nordstrom's shared library and powered other launches for two years. 95% of products sold out within days.",
    },

    // ── THE BRIEF — grouped ──
    {
      id: "brief-polygon",
      type: "hex-polygon",
      group: { name: "brief", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "brief-header",
      type: "section-header",
      label: "SECTION 02: THE BRIEF",
      title: "An NDA.\nThen a Blank Page.",
      group: { name: "brief", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "brief-text",
      type: "text",
      size: "subhead",
      content:
        "A cleared calendar and an NDA before the brief landed. Beyoncé's name on the project. A timeline that left no margin. Four weeks to pitch. Two to ship.",
      group: { name: "brief" },
    },
    {
      id: "brief-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Nordstrom held the only US retail partnership. That made the website something it usually isn't: the entire launch surface. Brand story, product showcase, campaign rollout, all on one page that hadn't existed yet. The digital experience didn't support the launch. It was the launch.",
      group: { name: "brief" },
    },
    {
      id: "brief-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Timeline",
          content:
            "Week one: references, moodboards, competitive audit. Nobody in activewear had done what Ivy Park was attempting. The brand positioned itself between luxury fashion and athletic performance. The digital experience needed to land in that gap without leaning too far toward either side.\n\nWeeks two through four: wireframes, design concepts, copywriting, motion studies. Everything presented to Beyoncé's creative team for approval. Daily calls. Fast feedback. Revisions turned around overnight.",
        },
        {
          title: "The Freedom",
          content:
            "Beyoncé's team supplied the photography. Black-and-white athlete portraits. Color product shots against blue and gray backgrounds. Editorial, with range across body types and ethnicities.\n\nEverything else was open. Typography, layout, copy, animation, interaction. That kind of latitude on a project this visible doesn't happen often. The type went larger than expected. Motion lived in every scroll position. Photography got room to breathe.",
        },
        {
          title: "The Scope",
          content:
            "One scrolling brand experience. A series of launch emails timed to the drop. Digital marketing across Nordstrom's owned channels. Social assets formatted for every platform. In-store signage for physical locations carrying the line.\n\nSix deliverable categories. The polygon, the typographic cadence, the progression from black-and-white into color. Same vocabulary in every format. Consistent from inbox to storefront.",
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
    },

    // ── THE EXPERIENCE ──
    {
      id: "experience-header",
      type: "section-header",
      label: "SECTION 03: THE EXPERIENCE",
      title: "The Polygon Held\nthe Page Together.",
    },
    {
      id: "experience-text",
      type: "text",
      size: "subhead",
      content:
        "A single scrolling page doing the work of a website, a lookbook, and a launch trailer at once. The polygon emerged during concepting as a way to break the rectangular grid the photography sat in. From there it spread.",
    },
    {
      id: "experience-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Started as a crop mask for portraits. Angled edges against the rectangular photo grid gave athlete imagery a geometric tension that matched the brand's positioning between sport and fashion. The shape animated on scroll, rotated between sections, scaled from thumbnail to full-bleed. One geometric idea handling framing, motion, and signature in a single move.",
    },

    // ── EXPERIENCE SCREENSHOT ──
    {
      id: "experience-page-1",
      type: "image",
      src: `${IMG}/ivy-park-scrolling-experience-polygon-typography.jpg`,
      alt: "Ivy Park scrolling experience detail, polygon portrait frames, Courage is Power typography",
      aspect: "native",
    },

    {
      id: "experience-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Polygon",
          content:
            "A hexagonal frame. Angled, rotated, sometimes cropping a portrait tight to the jawline, sometimes opening wide enough to hold a full figure. The shape carried from the hero banner through product carousels and into email headers.\n\nAnimated on scroll. The polygon rotated slowly as the page moved, giving flat photography a sense of depth. A single CSS transform doing real design work.",
        },
        {
          title: "Typography at Volume",
          content:
            "\"Confidence is Strength.\" Set large. Overlapping imagery. Running across the full viewport width with mixed weights and staggered baselines. The type wasn't captioning the photos. It competed with them for attention.\n\nThe brand voice came together during production. Short declarative statements. Present tense. Second person when it appeared at all. \"Ivy Park is for everybody. And every body.\" Copy that worked at 12px in an email subject line and at 200px across a scrolling hero.",
        },
        {
          title: "CMS Legacy",
          content:
            "The experience required components that didn't exist in Nordstrom's CMS. Parallax modules. Animated polygon masks. Full-bleed video sections with scroll-triggered playback. Type lockups with responsive scaling.\n\nBuilt them. After launch, they entered the shared library. Other brand launches and campaign pages used them for two years. The Ivy Park project paid for itself in reusable infrastructure.",
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
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-polygon",
      type: "editorial-headline",
      text: "Confidence is Strength.\nCourage is Power.",
    },

    // ── MOBILE HERO ──
    {
      id: "mobile-hero",
      type: "hero",
      image: `${IMG}/ivy-park-nordstrom-mobile-experience-mockup.jpg`,
      alt: "Ivy Park mobile experience on iPhone, Courage is Power section, concrete surface",
      inline: true,
    },

    // ── THE CAMPAIGN ──
    {
      id: "campaign-header",
      type: "section-header",
      label: "SECTION 04: THE CAMPAIGN",
      title: "From One Page\nto Every Surface.",
    },
    {
      id: "campaign-text",
      type: "text",
      size: "subhead",
      content:
        "The scrolling page carried the brand. The campaign pushed the same vocabulary out across every channel Nordstrom owned. Launch emails. Digital ads. Social assets. In-store screens. Same elements, every format.",
    },
    {
      id: "campaign-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Once the page locked, the rest was format adaptation. Polygon, type, photography already established. Email templates, banner ads, social formats: execution rather than invention. The visuals scaled because the elements were simple. A polygon crops the same at 300px and 3000px. Bold type reads at any size. Black-and-white photography converts to any aspect ratio.",
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
      label: "SECTION 05: CLOSING",
      title: "Sold Out\nin Days",
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "Six weeks from NDA to live. 95% of product gone within days.",
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
        "Beyoncé's team brought the photography and the brand name. The creative direction, typography, layout, motion, copy, and rollout happened in a Nordstrom office. Small team. Hard deadline. The brief was open enough to allow real decisions and tight enough on time to require them.\n\nThe polygon. The type at scale. The progression from black-and-white into color. None of it came from a brand guide. There wasn't one.\n\nAfter launch, Beyoncé sent the team a personal thank-you video. That part stays off social.",
    },
  ],
};
