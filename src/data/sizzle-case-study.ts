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
    "A sizzle reel with no video in it. Stills, cut fast enough to read as motion.",
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
        "A sizzle reel with no video in it. Stills, cut fast enough to read as motion.",
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
        { label: "Ships", value: "React component, a 4.8KB web component, and a GIF/MP4 exporter" },
        { label: "Try it", value: "Section 02 takes your own images. Nothing uploads, nothing saves" },
      ],
      abstract:
        "A sizzle reel is usually footage: shot, edited, rendered, hosted. Faux Reel skips the footage and keeps the edit. It runs a stack of still photographs through fourteen transition types, wipes, blinks, a burn, a lens pinch, and a title card that assembles itself, all on a timer tuned so the eye reads motion. One container, CSS animation, zero video files.\n\nI wanted that look, just not the editing behind it. So I had the code do it instead. The build took a day with Claude Code, most of it spent finessing the timing and the transitions, getting each cut to land so the stills feel like motion and not a slideshow. The finished web component weighs 4.8KB gzipped, smaller than any one of the photographs it plays.\n\nNone of this is a screenshot or a mockup. The reel up top is running live, and the lab below it is where you load your own photos: it pulls a five-color palette out of them and rebuilds the reel to match. If you want a file instead of a live embed, the same code exports the whole thing as a looping GIF or an MP4.",
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
      title: "Load your",
      pressing: {
        mark: { n: "02", name: "Load your" },
        heldLine: "own",
      },
    },
    {
      id: "lab-subhead",
      type: "text",
      size: "subhead",
      content:
        "The default cut is seven frames, one from each of my projects. Drop in up to eight of your own and it rebuilds around them. Each beat gets a chip below. Click one to freeze the reel on it.",
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
      title: "Why stills",
      pressing: {
        mark: { n: "03", name: "Why stills" },
        heldLine: "read as motion",
      },
    },
    {
      id: "end-subhead",
      type: "text",
      size: "subhead",
      content:
        "The trick is hiding the cut. When the reel blinks a color frame or the lens pinches shut, the photo swaps behind the cover, so you never see the switch. Every cut has to land on a new image, or the blink reads as a glitch. Titles cut in hard instead of fading, and each frame holds for a beat before the next one.",
    },
    {
      id: "file-stats",
      type: "stats-summary",
      items: [
        { value: "14", label: "Transition types", sublabel: "Wipes, blinks, burn, pinch, and four kinds of type" },
        { value: "4.8KB", label: "Web component", sublabel: "Gzipped, zero dependencies, any webpage" },
        { value: "20fps", label: "Deterministic export", sublabel: "131 frames stepped on a frozen clock" },
        { value: "0", label: "Video files", sublabel: "1.3MB as GIF, 0.2MB as MP4, nothing hosted" },
      ],
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 04: CLOSING",
      title: "Running,",
      pressing: {
        mark: { n: "04", name: "Running" },
        heldLine: "not rendered",
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
        "The reel on this page is the deliverable, running where it was made, cut from seven of the projects around it. It is also on GitHub, MIT-licensed. A developer or product manager who needs a deck or a portfolio to move can grab it and skip the shoot.",
    },
  ],
};
