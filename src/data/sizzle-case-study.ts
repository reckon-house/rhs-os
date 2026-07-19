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
      links: [{ label: "Source", url: "https://github.com/reckon-house/faux-reel" }],
      summary: [
        { label: "Built", value: "In a day, with Claude Code" },
        { label: "Ships", value: "React component, a 4.8KB web component, and a GIF/MP4 exporter" },
        { label: "Try it", value: "Section 01 takes your own images. Nothing uploads, nothing saves" },
      ],
      abstract:
        "A sizzle reel is usually footage: shot, edited, rendered, hosted. Faux Reel skips the footage and keeps the edit. It runs a stack of still photographs through fourteen transition types, wipes, blinks, a burn, a lens pinch, and a title card that assembles itself, all on a timer tuned so the eye reads motion. One container, CSS animation, zero video files.\n\nI wanted that look, just not the editing behind it. So I had the code do it instead. The build took a day with Claude Code, most of it spent finessing the timing and the transitions, getting each cut to land so the stills feel like motion and not a slideshow. The finished web component weighs 4.8KB gzipped, smaller than any one of the photographs it plays.\n\nNone of this is a screenshot or a mockup. The reel up top is running live, and the lab below it is where you load your own photos: it pulls a five-color palette out of them and rebuilds the reel to match. If you want a file instead of a live embed, the same code exports the whole thing as a looping GIF or an MP4.",
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
        "The default cut is seven frames, one from each of my projects. Drop in up to eight of your own and it rebuilds around them. Each beat gets a chip below. Click one to freeze the reel on it.",
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
        { label: "Get it on GitHub", url: "https://github.com/reckon-house/faux-reel" },
        { label: "See the projects the reel is cut from", url: "/" },
      ],
      content:
        "The reel on this page is the deliverable, running where it was made, cut from seven of the projects around it. It is also on GitHub, MIT-licensed. A developer or product manager who needs a deck or a portfolio to move can grab it and skip the shoot.",
    },
  ],
};
