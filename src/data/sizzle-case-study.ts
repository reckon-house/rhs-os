import type { CaseStudy } from "@/lib/types";

// Builder study: "I" is correct here. The product is on the page — the lab
// section lets a visitor recut the reel with their own images (client-side
// only, nothing saves).
//
// PRESSING NOTES. The cover does double duty on this study and it is the
// whole reason the port is clean: the pressing cover's top-right reel IS a
// faux reel — stills cut fast enough to read as motion — so the study about
// that mechanism opens with the mechanism, running.
//
// The reel wall then takes the slot a hero photograph would hold. The port
// first dropped it, on the theory that two copies of the product playing
// would compete; on the page the opposite was true — the cover's reel is a
// thumbnail in a corner, and without the wall the whole screen under it was
// empty. They are different arguments at different scales: one frame
// running, then eighteen running out of phase, then one you can drive.
//
// The reel frames are the playground's own RANGE_IMAGES — the exact seven
// frames the default cut plays, in the cut's authored order — and the
// colors are RANGE_COLORS, extracted offline from those frames by the same
// quantizer the lab runs live. Seven frames, not eight, because seven IS
// the cut: one per project, ordered so no two adjacent frames share a
// register. Padding it to eight would mean a frame the product does not
// play.

const CS = "/case-studies";

export const sizzleCaseStudy: CaseStudy = {
  slug: "sizzle",
  title: "Faux Reel",
  category: { label: "Digital", href: "/category/digital" },
  subtitle:
    "A tool that turns still photographs into a sizzle reel. | Faux Reel has no video in it, just stills cut fast enough to look like motion.",
  field: "Product\nMotion",
  author: "Jeremy Prasatik",
  published: "2026",
  status: "Tool",
  classification: ["Motion", "Front-End", "Tooling"],
  services: ["Product Design", "Engineering"],
  stack: ["React", "TypeScript", "CSS", "Playwright"],
  links: [],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── META: the cover, and the cover is the product ──
    {
      id: "meta",
      type: "meta",
      title: "Faux\nReel",
      subtitle:
        "A tool that turns still photographs into a sizzle reel. | Faux Reel has no video in it, just stills cut fast enough to look like motion.",
      reel: {
        caption: "Live · 7 frames · 2026",
        colors: ["#0AA7CA", "#181B17", "#776549", "#F5EAE7", "#8A8784"],
        images: [
          `${CS}/nordstrom-personalization/nordstrom-personalization-system-design-woman-model-blue-floral-print-dress-black-white-geometric-strappy-heels-yellow-sofa-editorial.jpg`,
          `${CS}/hill-country-bath/hill-country-bath-vanity-marble-globe-sconces-sage.jpg`,
          `${CS}/nordstrom-framework/nordstrom-content-framework-lockup-whats-now.jpg`,
          `${CS}/hill-country-kitchen/hill-country-kitchen-island-pendants-marble-wide.jpg`,
          `${CS}/hill-country-oak/hill-country-oakworks-outdoor-banner-whiskey-barrels-colorful-background-tree-texas-born-oakcraft.jpg`,
          `${CS}/j-christianson/j-christianson-storefront-tree-stripe-window-mockup.jpg`,
          `${CS}/capitan-boot-co/capitan-boot-co-western-original-buffalo-silhouette-desert-landscape-mesa-mountains-sage-brush-terrain-branding-campaign.jpg`,
        ],
      },
      field: "Product  Motion",
      author: "Jeremy Prasatik",
      published: "2026",
      status: "Tool",
      classification: ["Motion", "Front-End", "Tooling"],
      links: [{ label: "Source", url: "https://github.com/reckon-house/faux-reel" }],
      summary: [
        { label: "Built", value: "In a day, with Claude Code" },
        { label: "Ships", value: "A React component, a 4.8KB web component, and a GIF/MP4 exporter" },
        { label: "Try it", value: "Section 02 takes your own images, and nothing is uploaded or saved" },
      ],
      abstract:
        "A sizzle reel is usually video that gets shot, edited, rendered and hosted. Faux Reel skips the footage and runs a stack of still photographs through fourteen transition types: wipes, blinks, a burn, a lens pinch, and a title card that assembles itself. The whole reel runs in one box on the page, with CSS animation and no video file anywhere.\n\nIt dawned on me one night that I could make a sizzle reel in code instead of opening an editor, so I figured I would give it a try, and it turned out pretty well. Once I got the hang of it, working in code actually felt faster, and it left me with a reel I can edit and keep fresh. Faux Reel took a day to build with Claude Code, most of it spent finessing the timing so the stills feel like motion and not a slideshow. The finished web component weighs 4.8KB gzipped, smaller than any one of the photographs it plays.\n\nNone of the reels on this page is a screenshot or a mockup. The reel up top is running live, and the lab below it is where you load your own photos: it pulls a five-color palette out of them and rebuilds the reel to match. If you want a file instead of a live embed, the same code exports the whole thing as a looping GIF or an MP4.",
    },

    // ── THE WALL, WHERE A HERO WOULD BE ──
    // This study has no photograph to open on, and the gap after the
    // cover read as a missing one. The grid fills it with the only
    // establishing shot the product can give: eighteen cells running the
    // same seven frames out of phase, so the mechanism is legible as a
    // pattern before the lab explains it beat by beat. It sits AFTER the
    // cover and BEFORE the lab deliberately — a wall of small reels is
    // an argument, and the single big one you can drive is the proof.
    {
      id: "reel-wall",
      type: "sizzle-playground",
      variant: "hero",
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE LAB (the tool)
    // ════════════════════════════════════════
    {
      id: "lab-header",
      type: "section-header",
      label: "SECTION 02: THE LAB",
      title: "Drop in your own photos",
      pressing: {
        mark: { n: "02", name: "Your photos" },
        heldLine: "and the reel rebuilds around them.",
      },
    },
    {
      id: "lab-subhead",
      type: "text",
      size: "subhead",
      content:
        "Faux Reel plays seven frames by default, and it takes up to eight of yours. Each beat gets a chip under the reel, and clicking one freezes playback on that beat.",
    },
    {
      id: "lab",
      type: "sizzle-playground",
      variant: "lab",
    },

    // ════════════════════════════════════════
    // SECTION 03 — UNDER THE CUT (how it works)
    // ════════════════════════════════════════
    {
      id: "end-header",
      type: "section-header",
      label: "SECTION 03: UNDER THE CUT",
      title: "The reel swaps photos",
      pressing: {
        mark: { n: "03", name: "The swap" },
        heldLine: "behind a color blink or a lens pinch.",
      },
    },
    {
      id: "end-subhead",
      type: "text",
      size: "subhead",
      content:
        "Every cut has to land on a new image, or the color blink looks like a glitch. Titles come in hard with no fade, and each frame sits for a beat before the next one.",
    },
    {
      id: "file-stats",
      type: "stats-summary",
      items: [
        { value: "14", label: "Transition types", sublabel: "Wipes, blinks, a burn, a pinch, and four type animations" },
        { value: "4.8KB", label: "Web component", sublabel: "Gzipped, no dependencies, works on any page" },
        { value: "20fps", label: "Deterministic export", sublabel: "131 frames stepped on a frozen clock" },
        { value: "0", label: "Video files", sublabel: "The live reel runs on CSS animation with nothing hosted. Exports run 1.3MB as a GIF or 0.2MB as an MP4." },
      ],
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 04: CLOSING",
      title: "Faux Reel's code is",
      pressing: {
        mark: { n: "04", name: "The code" },
        heldLine: "MIT-licensed and on GitHub.",
      },
    },
    {
      id: "closing",
      type: "closing",
      services: ["Product Design", "Engineering"],
      stack: ["React", "TypeScript", "CSS", "Playwright"],
      links: [
        { label: "Get it on GitHub", url: "https://github.com/reckon-house/faux-reel" },
        { label: "See the projects the reel is cut from", url: "/" },
      ],
      content:
        "The reel at the top of this page is Faux Reel itself, cut from seven of the projects here and running on the site where I made it. If you need a deck or a portfolio that moves, grab the code.",
    },
  ],
};
