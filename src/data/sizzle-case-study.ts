import type { CaseStudy } from "@/lib/types";

// Builder study: "I" is correct here. The product is on the page — the hero
// section renders the live reel, the lab section lets a visitor recut it with
// their own images (client-side only, nothing saves).

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
  sections: [
    // ── The product, playing ──
    {
      id: "live-hero",
      type: "sizzle-playground",
      variant: "hero",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Faux Reel",
      subtitle:
        "A sizzle reel with no video in it. Stills, cut fast enough to read as motion.",
      field: "Product  Motion",
      author: "Jeremy Prasatik",
      published: "2026",
      status: "Tool",
      classification: ["Motion", "Front-End", "Tooling"],
      summary: [
        { label: "Built", value: "In a day, with Claude Code" },
        { label: "Ships", value: "React component, a 4.8KB web component, and a GIF/MP4 exporter" },
        { label: "Try it", value: "Section 01 takes your own images. Nothing uploads, nothing saves" },
      ],
      abstract:
        "A sizzle reel is usually footage: shot, edited, rendered, hosted. Faux Reel skips the footage and keeps the edit. It runs a stack of still photographs through fourteen transition types, wipes, blinks, a burn, a lens pinch, and a title card that assembles itself, all on a timer tuned so the eye reads motion. One container, CSS animation, zero video files.\n\nIt started with a portfolio I admire that runs looping video in every project tile. I wanted that energy without a camera, an editor, or a render queue. The build took a day with Claude Code, and the finished web component weighs 4.8KB gzipped, smaller than any one of the photographs it plays.\n\nThis page is the product. The reel above is rendering live, and the lab below takes your own images, pulls a five-color palette out of their pixels, and recuts itself on the spot. The same engine exports a looping GIF or MP4 by stepping Chrome's clock one frame at a time.",
    },

    // ════════════════════════════════════════
    // SECTION 01 — THE LAB (the tool)
    // ════════════════════════════════════════
    {
      id: "lab-header",
      type: "section-header",
      label: "SECTION 01: THE LAB",
      title: "Load your own.",
    },
    {
      id: "lab-subhead",
      type: "text",
      size: "subhead",
      content:
        "Seven frames across the studio's work are the default cut, one from each project. Drop in up to eight of your own and the reel rebuilds its choreography, palette included. Chips track each beat as it fires; freeze one to study the cut.",
    },
    {
      id: "lab",
      type: "sizzle-playground",
      variant: "lab",
    },

    // ════════════════════════════════════════
    // SECTION 02 — UNDER THE CUT (how it works + close)
    // ════════════════════════════════════════
    {
      id: "end-header",
      type: "section-header",
      label: "SECTION 02: UNDER THE CUT",
      title: "Why stills read as motion.",
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
      id: "closing",
      type: "closing",
      services: ["Product Design", "Engineering"],
      stack: ["React", "TypeScript", "CSS", "Playwright"],
      links: [
        { label: "See the projects the reel is cut from", url: "/" },
      ],
      content:
        "The reel on this page is the deliverable, running where it was made, cut from seven of the projects around it. A public repository is next, so it can run somewhere other than here.",
    },
  ],
};
