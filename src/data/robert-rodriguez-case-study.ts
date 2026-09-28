import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/robert-rodriguez";

/* ── Pressing structure ─────────────────────────────────────────────
   First study in the Pressing C language (style: "pressing" routes it to
   PressingLayout). The section order, marks, captions, and copy cuts all
   follow the tuned lab prototype (public/lab/swiss-spread.html) — it is
   the spec; change it there first, then bring values back. Notes:
   - The choreography flags are relational: a `pin` section holds while
     the NEXT section (flagged `rise`) climbs across it. The cover always
     pins; zoom plates reserve their own climb room.
   - Marks renumber the prototype's 2,3,4,4b,5,5,5b,6 spine into a clean
     sequence — the duplicate 05 the prototype shipped with is gone.
   - The double-exposure-anatomy and color-field-map viz sections are out
     (the prototype replaced them with the live system index); they live
     in git history if a study ever wants them back.
   - Every campaign IMAGE survives: all nine photographs render, including
     the typography-palette plate the prototype dropped. */

const REEL_COLORS = ["#E0552F", "#F09A3E", "#E8637A", "#F5EAE7", "#241C18"];

export const robertRodriguezCaseStudy: CaseStudy = {
  slug: "robert-rodriguez",
  title: "Robert Rodriguez x Neiman’s",
  category: { label: "Creative", href: "/category/creative" },
  subtitle: "A spring campaign for Neiman Marcus, shot in one day and run across social, email, the stores, and editorial. | The campaign mixes ’80s mall glam with high fashion.",
  field: "Campaign Design Art Direction Photo Compositing",
  author: "Jeremy Prasatik",
  published: "2024",
  status: "Complete",
  classification: ["Art Direction", "Photo Compositing", "Typography Design", "Campaign"],
  services: ["Art Direction", "Photo Compositing", "Typography Design", "Campaign Design"],
  stack: ["Adobe Photoshop", "Adobe Illustrator", "Capture One"],
  links: [{ label: "Neiman Marcus", url: "https://www.neimanmarcus.com" }],
  heroImage: "",
  style: "pressing",
  sections: [
    // ── COVER — pinned handover: headline unbuilds, statement rises ──
    {
      id: "meta",
      type: "meta",
      // The × is its own line: the reveal gives every line its own mask, so
      // the break must be explicit or × and Neiman's rise together.
      title: "Robert\nRodriguez\nx\nNeiman’s",
      subtitle:
        "A spring campaign for Neiman Marcus, shot in one day and run across social, email, the stores, and editorial. | The campaign mixes ’80s mall glam with high fashion.",
      field: "Campaign Design Art Direction Photo Compositing",
      author: "Jeremy Prasatik",
      published: "2024",
      status: "Complete",
      classification: ["Art Direction", "Photo Compositing", "Typography Design", "Campaign"],
      specLine: "Spring Campaign · Art Direction · Photo Compositing · Capture One",
      reel: {
        caption: "Preview · 8 frames · Spring 2024",
        colors: REEL_COLORS,
        images: [
          `${IMG}/neiman-marcus-robert-rodriguez-woman-cream-polka-dot-dress-pink-blazer-orange-yellow-backdrop-storefront-window-display-campaign.jpg`,
          `${IMG}/neiman-marcus-robert-rodriguez-woman-pink-blazer-beige-polka-dot-dress-orange-background-editorial-portrait.jpg`,
          `${IMG}/neiman-marcus-robert-rodriguez-woman-model-pink-blazer-cream-polka-dot-dress-orange-red-backdrop-editorial-campaign.jpg`,
          `${IMG}/neiman-marcus-robert-rodriguez-woman-yellow-blazer-white-pants-coral-heels-curly-hair-pink-orange-gradient-studio-editorial-portrait.jpg`,
          `${IMG}/neiman-marcus-robert-rodriguez-woman-curly-blonde-hair-yellow-blazer-coral-pink-top-red-lipstick-studio-portrait.jpg`,
          `${IMG}/neiman-marcus-robert-rodriguez-woman-yellow-blazer-white-pants-pink-curly-hair-colorful-gradient-overlay-portrait-concrete-wall-gallery.jpg`,
          `${IMG}/neiman-marcus-robert-rodriguez-woman-yellow-lime-blazer-white-cropped-pants-nude-heels-studio-lookbook-portrait.jpg`,
          `${IMG}/robert-rodriguez-logo-typography-gradient-orange-pink-coral-color-palette-branding-design.jpg`,
        ],
      },
      pressing: { mark: { n: "02", name: "Statement" } },
    },

    // ── STOREFRONT PLATE — climbs across the pinned cover ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-robert-rodriguez-woman-cream-polka-dot-dress-pink-blazer-orange-yellow-backdrop-storefront-window-display-campaign.jpg`,
      alt: "Robert Rodriguez Spring, storefront window campaign display",
      pressing: { choreo: { rise: true } },
    },

    // ── IMAGE AS OBJECT — pinned zoom, plate 02 ──
    {
      id: "editorial-hero-1",
      type: "hero",
      image: `${IMG}/neiman-marcus-robert-rodriguez-woman-model-pink-blazer-cream-polka-dot-dress-orange-red-backdrop-editorial-campaign.jpg`,
      alt: "Robert Rodriguez, pink blazer editorial campaign composite",
      inline: true,
      // No bw flag: the prototype's .bw rule is EMPTY on purpose — its own
      // comment says photography runs full color; the starkness lives in
      // the type and the space, not on top of the plates.
      pressing: {
        choreo: { zoom: true },
        plate: "02",
        captions: [
          "Double-exposure composite",
          "Pink blazer over mesh field",
          "One of the four photographs",
        ],
        instruction: "Scroll. It fills the mat, then travels the frame",
      },
    },

    // ── THE BRIEF — pinned headline, method columns nested in the column ──
    {
      id: "brief-header",
      type: "section-header",
      label: "SECTION 02: THE BRIEF",
      title: "One model and four setups stretched into",
      group: { name: "brief" },
      pressing: {
        mark: { n: "03", name: "The Brief" },
        heldLine: "an entire campaign.",
        choreo: { pin: true },
      },
    },
    {
      id: "brief-text",
      type: "text",
      size: "subhead",
      content:
        "Neiman Marcus wanted the Robert Rodriguez campaign to feel current and still keep the brand's romantic side.",
      group: { name: "brief" },
    },
    {
      id: "brief-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The campaign's budget covered one day in the studio. The photographs from the four setups were layered over each other so the same few pictures could carry a whole look.",
      group: { name: "brief" },
    },
    {
      id: "brief-columns",
      type: "three-column-text",
      group: { name: "brief" },
      pressing: { mark: { n: "04", name: "Method" } },
      columns: [
        {
          title: "The Reference.",
          content:
            "Glamour Shots and the other mall portrait studios were the campaign's starting point, with their oversaturated close-ups, soft-focus backgrounds, and a fan going somewhere off camera.\n\nThe brief was to take mall glam seriously, without irony, and rebuild its confidence and color with contemporary craft.",
        },
        {
          title: "The Technique.",
          content:
            "Two frames from the same shoot, one tight and one wide, were layered as a double exposure, so the overlap made a third picture that neither frame had on its own.\n\nSmooth mesh color fields replaced the mall studios' airbrushed backdrops and kept their warmth.",
        },
        {
          title: "The System.",
          content:
            "Four photographs, one typeface family, and a color field make up the campaign. Every piece is some mix of those three, and each combination looks a little different from the last.",
        },
      ],
    },

    // ── PLATES — the b&w portrait pair, opposing parallax ──
    {
      id: "portraits-dual",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/neiman-marcus-robert-rodriguez-woman-pink-blazer-beige-polka-dot-dress-orange-background-editorial-portrait.jpg`,
        alt: "Robert Rodriguez, polka dot dress, orange backdrop",
      },
      right: {
        src: `${IMG}/neiman-marcus-robert-rodriguez-woman-pink-blazer-cream-polka-dot-ruffle-dress-orange-background-editorial-portrait.jpg`,
        alt: "Robert Rodriguez, polka dot ruffle dress, orange backdrop",
      },
      pressing: {
        // One string per image; \n separates the caption's two mono spans.
        // Full color, same reason as the zoom plate above.
        captions: ["Polka-dot dress\nSpring 2024", "Ruffle dress, same session"],
      },
    },

    // ── DEPLOYMENT — the crossing headline ──
    {
      id: "deploy-header",
      type: "section-header",
      label: "SECTION 04: CAMPAIGN / DEPLOYMENT",
      title: "Every piece was layered from\nthe same four pictures.",
      pressing: {
        mark: { n: "05", name: "Campaign & Deployment" },
        // The crossing's 220dvh wrap already IS the hold, so `pin` changes
        // nothing about how this renders — PressingCrossing never reads it.
        // It is here so the contract can be read straight off the data: this
        // header holds its screen, same as any other brief carrying copy.
        choreo: { crossing: true, pin: true },
      },
    },
    {
      id: "deploy-text",
      type: "text",
      size: "subhead",
      content:
        "Social got tight crops, email got the header images, the stores got the color fields at full strength, and the editorial spreads gave the double exposures room to run wide.",
    },
    {
      id: "deploy-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The storefront window ran the composites at large format.",
    },

    // ── COMPOSITE PAIR — pinned so the gradient plate can climb it ──
    {
      id: "composites-dual",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/neiman-marcus-robert-rodriguez-woman-curly-blonde-hair-yellow-blazer-coral-pink-top-red-lipstick-studio-portrait.jpg`,
        alt: "Robert Rodriguez, yellow blazer studio portrait",
      },
      right: {
        src: `${IMG}/neiman-marcus-robert-rodriguez-woman-yellow-lime-blazer-white-cropped-pants-nude-heels-studio-lookbook-portrait.jpg`,
        alt: "Robert Rodriguez, yellow blazer lookbook portrait",
      },
      pressing: {
        captions: ["Yellow blazer, studio\nSpring 2024", "Lookbook"],
        choreo: { pin: true },
      },
    },

    // ── GRADIENT OVERLAY PLATE — climbs across the pinned pair ──
    {
      id: "storefront-hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-robert-rodriguez-woman-yellow-blazer-white-pants-coral-heels-curly-hair-pink-orange-gradient-studio-editorial-portrait.jpg`,
      alt: "Robert Rodriguez, double-exposure editorial portrait",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── QUOTE POSTER — the ground rises and knocks the type out ──
    {
      id: "headline-glam",
      type: "editorial-headline",
      text: "Glamour Shots,\nrebuilt for\nNeiman Marcus",
      pressing: {
        choreo: { quotePoster: true },
        indent: 1,
        mark: { n: "06", name: "Compositing as Design System", dark: true },
        navDark: true,
      },
    },

    // ── TYPOGRAPHY & BRAND — pinned brief ──
    {
      id: "brand-header",
      type: "section-header",
      label: "SECTION 05: TYPOGRAPHY / BRAND",
      title: "Archer Hairline is thin enough to sit",
      group: { name: "brand" },
      pressing: {
        mark: { n: "07", name: "Typography & Brand" },
        heldLine: "over the pictures without fighting them.",
        // The type pairing is the claim the two paragraphs below it argue,
        // so the headline holds while they travel past. No riser follows —
        // the system index does — so this pin is staging, not a climb.
        choreo: { pin: true },
      },
    },
    {
      id: "brand-text",
      type: "text",
      size: "subhead",
      content:
        "The typeface, Archer, was chosen just for the Robert Rodriguez campaign. Archer Book sets the body copy in warm, rounded serifs that match the softness of the photography.",
      group: { name: "brand" },
    },
    // The old footnote's second paragraph (the logo treatment) now lives
    // compressed in the logo plate's caption lines — one fact, one home.
    {
      id: "brand-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The palette is coral, orange, and pink. The three colors clash as flat blocks and hold together when each one fades into the next.",
      group: { name: "brand" },
    },

    // The orange/pink Archer specimen board is deliberately NOT here. The
    // system index below shows the same material live — the lockup
    // assembling, the palette morphing — so the static board would be the
    // second telling of it. (The file is still in public/case-studies.)

    // ── THE SYSTEM INDEX — live specimens ──
    {
      id: "system-index",
      type: "rr-system-index",
      pressing: { mark: { n: "08", name: "The System" } },
    },

    // ── THE MARK ON THE FIELD — logo plate, pinned and grown ──
    {
      id: "brand-image-2",
      type: "image",
      src: `${IMG}/robert-rodriguez-logo-typography-gradient-orange-pink-coral-color-palette-branding-design.jpg`,
      alt: "Robert Rodriguez, logo in Archer Hairline over Book on a mesh color field",
      aspect: "native",
      pressing: {
        choreo: { zoom: true },
        plate: "08",
        captions: [
          "Logo on mesh field",
          "Hairline caps over Book lowercase",
          "Depth through overlap",
        ],
      },
    },

    // ── GALLERY PLATE — climbs across the logo plate's held screen ──
    {
      id: "lookbook-hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-robert-rodriguez-woman-yellow-blazer-white-pants-pink-curly-hair-colorful-gradient-overlay-portrait-concrete-wall-gallery.jpg`,
      alt: "Robert Rodriguez, gallery installation with gradient overlay composite",
      inline: true,
      pressing: { choreo: { rise: true } },
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "Every color field was drawn",
      pressing: {
        mark: { n: "09", name: "Closing" },
        heldLine: "as a gradient.",
      },
    },
    {
      id: "closing",
      type: "closing",
      services: ["Art Direction", "Photo Compositing", "Typography Design", "Campaign Design"],
      stack: ["Adobe Photoshop", "Adobe Illustrator", "Capture One"],
      links: [{ label: "Neiman Marcus", url: "https://www.neimanmarcus.com" }],
      content:
        "The gradients scale to any size, so a three-foot print is as smooth as a phone screen.",
    },
  ],
};
