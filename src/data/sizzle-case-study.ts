import type { CaseStudy } from "@/lib/types";

// Builder study: "I" is correct here. The product is on the page — the hero
// section renders the live reel, the lab section lets a visitor recut it with
// their own images (client-side only, nothing saves).

export const sizzleCaseStudy: CaseStudy = {
  slug: "sizzle",
  title: "SizzleReel",
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
      title: "SizzleReel",
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
        { label: "Try it", value: "Section 02 takes your own images. Nothing uploads, nothing saves" },
      ],
      abstract:
        "A sizzle reel is usually footage: shot, edited, rendered, hosted. SizzleReel skips the footage and keeps the edit. It runs a stack of still photographs through fourteen transition types, wipes, blinks, a burn, a lens pinch, and a title card that assembles itself, all on a timer tuned so the eye reads motion. One container, CSS animation, zero video files.\n\nIt started with a portfolio I admire that runs looping video in every project tile. I wanted that energy without a camera, an editor, or a render queue. The build took a day with Claude Code, and the finished web component weighs 4.8KB gzipped, smaller than any one of the photographs it plays.\n\nThis page is the product. The reel above is rendering live, and the lab below takes your own images, pulls a five-color palette out of their pixels, and recuts itself on the spot. The same engine exports a looping GIF or MP4 by stepping Chrome's clock one frame at a time.",
    },

    // ════════════════════════════════════════
    // SECTION 01 — THE CUT
    // ════════════════════════════════════════
    {
      id: "cut-header",
      type: "section-header",
      label: "SECTION 01: THE CUT",
      title: "Editing rules,\nborrowed from film.",
    },
    {
      id: "cut-subhead",
      type: "text",
      size: "subhead",
      content:
        "The montage reads as video because it obeys cutting-room rules. Getting them wrong is visible instantly: the first version blinked a color frame and landed back on the same photograph, and it read as a glitch.",
    },
    {
      id: "cut-rules",
      type: "three-column-text",
      columns: [
        {
          title: "Blinks hide cuts",
          content:
            "A flash frame earns its interruption by hiding a splice. Every blink and pinch swaps the photograph while the cover is opaque and clears onto something new. The pinch does it mechanically: top and bottom panels close to the middle, the cut happens at the meet, and the panels part onto new country.",
        },
        {
          title: "Type cuts in",
          content:
            "Title cards never fade. Words land with a hard cut and a small settle, the way campaign film handles type. Give the reel three or more words and it scatters them through the loop as their own quick cards, then the full line assembles word by word at the close, holds, and leaves the way it came.",
        },
        {
          title: "The loop breathes",
          content:
            "Six and a half seconds, eleven beats. Wipes finish at 72 percent of their hold so every frame gets a moment of rest before the next cut. At the end the built line exits, the bare card holds a breath, and the opening shutter wipes over whatever is left standing.",
        },
      ],
    },

    // ════════════════════════════════════════
    // SECTION 02 — THE LAB
    // ════════════════════════════════════════
    {
      id: "lab-header",
      type: "section-header",
      label: "SECTION 02: THE LAB",
      title: "Load your own.",
    },
    {
      id: "lab-subhead",
      type: "text",
      size: "subhead",
      content:
        "Six photographs from the West Texas study are the default cut. Drop in up to eight of yours and the reel rebuilds its choreography, palette included. Chips track each beat as it fires; freeze one to study the cut.",
    },
    {
      id: "lab",
      type: "sizzle-playground",
      variant: "lab",
    },

    // ════════════════════════════════════════
    // SECTION 03 — THE FILE
    // ════════════════════════════════════════
    {
      id: "file-header",
      type: "section-header",
      label: "SECTION 03: THE FILE",
      title: "From loop to file.",
    },
    {
      id: "file-subhead",
      type: "text",
      size: "subhead",
      content:
        "A montage that only exists as CSS still needs to leave the page sometimes, for a deck, a post, an email. The exporter drives a headless Chrome, freezes its clock, and advances it in exact twentieth-of-a-second steps, so the loop closes precisely where it opened.",
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
        { label: "See West Texas, the photographs in the demo", url: "/case-studies/big-bend" },
      ],
      content:
        "The reel on this page is the deliverable, running where it was made. A public repository is next, so the cut can run somewhere other than here.",
    },
  ],
};
