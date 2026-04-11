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
        "Nordstrom. Exclusive US launch. An NDA before the brief landed. Six weeks from first moodboard to live site, and most of the product gone within days.",
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
        "Beyoncé's first activewear line. Nordstrom held the exclusive US retail partnership. A small creative team cleared their calendars, signed NDAs, and started building before the brief was fully written.\n\nOne month for moodboards, wireframes, and a concept pitch to Beyoncé's creative team. Daily conference calls with Ivy Park for a week while the direction locked. Two weeks of production after approval. Scrolling brand experience, launch emails, digital marketing assets, social content, in-store digital collateral. Every touchpoint for a brand that didn't exist yet.\n\nThe polygon became the signature visual element. Started as a framing device for athlete portraits, then animated and carried across the full experience. Typography ran large and declarative. \"Confidence is Strength.\" \"Courage is Power.\" Supplied photography but nearly open brief on layout, type, copy, and motion. 95% of products sold out within the first few days of launch.",
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
      title: "NDA First.\nMoodboards Second.",
      group: { name: "brief", bg: "#ECE6E1", radius: 75, padding: "60px" },
    },
    {
      id: "brief-text",
      type: "text",
      size: "subhead",
      content:
        "A cleared calendar and a locked room. The brief arrived with Beyoncé's name attached and a timeline that left no margin. Concept to pitch in four weeks. Build and ship in two more.",
      group: { name: "brief" },
    },
    {
      id: "brief-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Nordstrom held the only US retail partnership for the launch. The digital experience needed to carry the full weight of the brand story. No other retailer had the product. No other site told the story. The experience was the storefront, the lookbook, and the campaign rolled into one URL.",
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
            "Beyoncé's team supplied the photography. Black and white athlete imagery. Color product shots against blue and gray backgrounds. Strong, editorial, diverse.\n\nEverything else was open. Typography, layout, copy, animation, interaction design. That kind of creative latitude on a project with this much visibility doesn't happen often. The team treated it accordingly. Pushed the type larger than expected. Built motion into every scroll position. Let the photography breathe.",
        },
        {
          title: "The Scope",
          content:
            "One scrolling brand experience. A series of launch emails timed to the drop. Digital marketing placements across Nordstrom's owned channels. Social assets formatted for every platform. In-store digital signage for physical locations carrying the line.\n\nSix deliverable categories. One visual system connecting all of them. The polygon frame, the typographic cadence, the black-and-white-to-color progression. Consistent from inbox to storefront.",
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
      title: "Scroll as Narrative.\nThe Polygon as Signature.",
    },
    {
      id: "experience-text",
      type: "text",
      size: "subhead",
      content:
        "A single-page scrolling experience that functioned as brand introduction, product showcase, and editorial statement simultaneously. The polygon frame emerged during concepting as a way to break the grid. It became the visual thread connecting every section.",
    },
    {
      id: "experience-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The polygon started as a crop mask for portraits. Angled edges against the rectangular photo grid gave athlete imagery a geometric tension that matched the brand's positioning between sport and fashion. The shape animated on scroll, rotated between sections, and scaled from thumbnail to full-bleed. Custom CMS components built for this project lived on in Nordstrom's system for other launches.",
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
            "A hexagonal frame. Angled, rotated, sometimes cropping a portrait tight to the jawline, sometimes opening wide enough to hold a full figure. The shape carried from the hero banner through product carousels and into email headers.\n\nAnimated on scroll. The polygon rotated slowly as the page moved, giving the experience a sense of depth that flat image grids miss. A simple CSS transform that read as intentional design rather than decorative effect.",
        },
        {
          title: "Typography at Volume",
          content:
            "\"Confidence is Strength.\" Set large. Overlapping imagery. Running across the full viewport width with mixed weights and staggered baselines. The type wasn't captioning the photos. It competed with them for attention.\n\nThe brand voice came together during production. Short declarative statements. Present tense. Second person when it appeared at all. \"Ivy Park is for everybody. And every body.\" Copy that worked at 12px in an email subject line and at 200px across a scrolling hero.",
        },
        {
          title: "CMS Legacy",
          content:
            "The experience required components that didn't exist in Nordstrom's content management system. Parallax image modules. Animated polygon masks. Full-bleed video sections with scroll-triggered playback. Type lockups with responsive scaling.\n\nBuilt them. After launch, the components entered the shared library. Other brand launches and campaign pages used the same modules for the next two years. The Ivy Park project paid for itself in reusable infrastructure.",
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
      title: "Beyond the Experience.\nEvery Channel Covered.",
    },
    {
      id: "campaign-text",
      type: "text",
      size: "subhead",
      content:
        "The scrolling experience carried the brand story. The campaign pushed it out across every channel Nordstrom owned. Launch emails. Digital ads. Social assets. In-store screens. One visual system, formatted for every surface.",
    },
    {
      id: "campaign-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "Production moved fast after the experience locked. The polygon, the type system, and the photography were already established. Adapting them to email templates, banner ads, and social formats was execution, not invention. The brand system held across every format because the elements were simple enough to scale. A polygon crops the same at 300px and 3000px. Bold type reads at any size. Black and white photography converts to any aspect ratio.",
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
        "Six weeks. One team. Every channel covered. 95% of products gone within the first few days.",
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
        "Beyoncé's team brought the photography and the brand name. The creative direction, the typography, the layout system, the motion design, the copy, and the campaign rollout happened in a Nordstrom office with a small team and a hard deadline.\n\nThe polygon. The type at scale. The black-and-white-to-color progression. None of it came from a brand guide. The brief was open enough to allow it and tight enough on time to require decisions without committees.\n\nAfter launch, Beyoncé sent the team a personal thank-you video. That part stays off social.",
    },
  ],
};
