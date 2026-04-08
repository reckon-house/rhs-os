import type { CaseStudy } from "@/lib/types";

const IMG = "/case-studies/robert-rodriguez";

export const robertRodriguezCaseStudy: CaseStudy = {
  slug: "robert-rodriguez",
  title: "Robert Rodriguez x Neiman\u2019s",
  subtitle: "Spring Campaign",
  sections: [
    // ── HERO ──
    {
      id: "hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-robert-rodriguez-woman-cream-polka-dot-dress-pink-blazer-orange-yellow-backdrop-storefront-window-display-campaign.jpg`,
      alt: "Robert Rodriguez Spring — storefront window campaign display",
    },

    // ── META ──
    {
      id: "meta",
      type: "meta",
      title: "Robert Rodriguez x Neiman\u2019s",
      subtitle: "\u201980s mall glam meets high fashion. The double-exposure glamour shot reimagined. Mesh color fields instead of airbrushed backdrops, couture instead of puff sleeves.",
      field: "Campaign Design Art Direction Photo Compositing",
      author: "Jeremy Prasatik",
      published: "2024",
      status: "Complete",
      classification: ["Art Direction", "Photo Compositing", "Typography Design", "Campaign"],
      abstract: "The reference was the mall portrait studio. Soft-focus close-ups, oversaturated color, a little too much hairspray. Kept the energy. Replaced everything else.\n\nFour studio shots, one model, custom compositing. Double-exposure layers stretched the shoot into a full campaign system. Mesh color fields gave the backgrounds pop-art softness without the dated airbrush look. Typography was built for this project, playful enough to match the concept, refined enough for the brand.",
    },

    // ── PROBLEM / BRIEF — grouped ──
    {
      id: "brief-header",
      type: "section-header",
      label: "SECTION 02: THE BRIEF",
      title: "One Shoot.\nAn Entire Campaign.",
      group: { name: "brief", bg: "#F5E6DC", radius: 75, padding: "60px" },
    },
    {
      id: "brief-text",
      type: "text",
      size: "subhead",
      content:
        "Neiman Marcus needed a spring campaign for Robert Rodriguez that felt current without abandoning the brand's romantic sensibility. The budget was a single shoot day. The deliverable was a full multi-channel system: social, email, in-store, editorial.",
      group: { name: "brief" },
    },
    {
      id: "brief-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The constraint became the concept. One model, four setups, and a compositing technique that turned four photographs into an entire visual language. Every piece of the campaign traces back to those four original frames, layered and recombined into something that feels like fifty shots instead of four.",
      group: { name: "brief" },
    },
    {
      id: "brief-columns",
      type: "three-column-text",
      columns: [
        {
          title: "The Reference",
          content:
            "Mall portrait studios. Glamour Shots. The oversaturated close-up with a soft-focus background and a fan blowing from somewhere off-camera. The aesthetic that defined aspirational beauty for an entire decade before fashion decided it was embarrassing.\n\nThe brief was to take that energy seriously, the confidence and the color, the full unironic glamour, and rebuild it with contemporary craft. Not a parody. A translation.",
        },
        {
          title: "The Technique",
          content:
            "Double-exposure compositing. Two frames from the same shoot layered together, one tight, one wide. The overlap creates a third image that neither frame contains alone. A close-up bleeds into a full-length, a gesture becomes a texture.\n\nMesh color fields replaced the airbrushed backdrops. Mathematically smooth washes that shift from coral to orange to pink. The warmth of the original reference without the noise. Digital precision with analog feeling.",
        },
        {
          title: "The System",
          content:
            "Four source photographs became a campaign library. Social cards, email headers, retail signage, editorial spreads. Each combination tells a slightly different story from the same visual DNA.\n\nThe typography, Archer Hairline paired with Archer Book, was selected specifically for this project. Thin enough to float over dense imagery without competing. Warm enough in its curves to match the softness of the photography.",
        },
      ],
      group: { name: "brief" },
    },

    // ── EDITORIAL HERO ──
    {
      id: "editorial-hero-1",
      type: "hero",
      image: `${IMG}/neiman-marcus-robert-rodriguez-woman-model-pink-blazer-cream-polka-dot-dress-orange-red-backdrop-editorial-campaign.jpg`,
      alt: "Robert Rodriguez — pink blazer editorial campaign composite",
      inline: true,
    },

    // ── COMPOSITING PROCESS ──
    {
      id: "process-header",
      type: "section-header",
      label: "SECTION 03: COMPOSITING / PROCESS",
      title: "Double Exposure\nas Design System",
    },
    {
      id: "process-text",
      type: "text",
      size: "subhead",
      content:
        "Each composite starts with two frames from the same session. A wide shot anchors the composition. A close-up bleeds across it, the face dissolving into color, the gesture becoming a wash. The overlap isn't random. Every layer is placed to create depth where the original photograph is flat.",
    },
    {
      id: "process-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The mesh backdrops are generated to complement the clothing in each frame. Coral for the polka-dot dress, pink for the yellow blazer, orange for the seated portrait. The color fields don't just fill space. They extend the garment's color story into the entire image. The background becomes part of the outfit.",
    },

    // ── DOUBLE EXPOSURE ANATOMY CHART ──
    {
      id: "exposure-anatomy",
      type: "double-exposure-anatomy",
    },

    // ── DUAL IMAGE — editorial portraits ──
    {
      id: "portraits-dual",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/neiman-marcus-robert-rodriguez-woman-pink-blazer-beige-polka-dot-dress-orange-background-editorial-portrait.jpg`,
        alt: "Robert Rodriguez — polka dot dress, orange backdrop",
      },
      right: {
        src: `${IMG}/neiman-marcus-robert-rodriguez-woman-pink-blazer-cream-polka-dot-ruffle-dress-orange-background-editorial-portrait.jpg`,
        alt: "Robert Rodriguez — polka dot ruffle dress, orange backdrop",
      },
    },

    // ── EDITORIAL HEADLINE ──
    {
      id: "headline-glam",
      type: "editorial-headline",
      text: "The mall portrait studio.\nRebuilt for the runway.",
    },

    // ── HERO — storefront ──
    {
      id: "storefront-hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-robert-rodriguez-woman-yellow-blazer-white-pants-coral-heels-curly-hair-pink-orange-gradient-studio-editorial-portrait.jpg`,
      alt: "Robert Rodriguez — double-exposure editorial portrait",
      inline: true,
    },

    // ── CAMPAIGN DEPLOYMENT ──
    {
      id: "deploy-header",
      type: "section-header",
      label: "SECTION 04: CAMPAIGN / DEPLOYMENT",
      title: "Four Frames.\nEvery Channel.",
    },
    {
      id: "deploy-text",
      type: "text",
      size: "subhead",
      content:
        "The compositing system meant every deliverable felt like its own photograph. Social crops pulled from the layered files differently than email headers. Retail signage used the color fields at full saturation. Editorial spreads let the double-exposure breathe across wide formats.",
    },
    {
      id: "deploy-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The campaign ran across Neiman Marcus social channels, email marketing, and in-store retail displays. The storefront window installation used the composites at large format. The mesh color fields held up at scale because they were mathematically generated, not resolution-dependent. A three-foot print has the same color smoothness as a phone screen.",
    },

    // ── DUAL IMAGE — composites ──
    {
      id: "composites-dual",
      type: "dual-image",
      native: true,
      left: {
        src: `${IMG}/neiman-marcus-robert-rodriguez-woman-curly-blonde-hair-yellow-blazer-coral-pink-top-red-lipstick-studio-portrait.jpg`,
        alt: "Robert Rodriguez — yellow blazer studio portrait",
      },
      right: {
        src: `${IMG}/neiman-marcus-robert-rodriguez-woman-yellow-lime-blazer-white-cropped-pants-nude-heels-studio-lookbook-portrait.jpg`,
        alt: "Robert Rodriguez — yellow blazer lookbook portrait",
      },
    },

    // ── BRAND / TYPOGRAPHY — grouped ──
    {
      id: "brand-header",
      type: "section-header",
      label: "SECTION 05: TYPOGRAPHY / BRAND",
      title: "Archer Hairline\nMeets Mesh Color Field",
      group: { name: "brand", bg: "#F5E6DC", radius: 75, padding: "60px" },
    },
    {
      id: "brand-text",
      type: "text",
      size: "subhead",
      content:
        "The typography was chosen for this campaign specifically. Archer Hairline for headlines, thin enough to sit over dense, colorful imagery without fighting for attention. Archer Book for body copy, warm rounded serifs that echo the softness of the photography.",
      group: { name: "brand" },
    },
    {
      id: "brand-footnote",
      type: "text",
      size: "base",
      fullWidth: true,
      content:
        "The color palette lives in the space between coral, orange, and pink. Three colors that shouldn't work together but do when the transitions are smooth enough. The mesh technique creates shifts that feel organic rather than designed, the same way a sunset moves through those exact colors without any of them clashing.\n\nThe logo treatment layers Archer Hairline over Archer Book. The weight contrast, featherlight caps over solid lowercase, mirrors the double-exposure technique in the photography. Two weights of the same typeface creating depth through overlap, just like two frames from the same shoot.",
      group: { name: "brand" },
    },

    // ── BRAND IMAGE ──
    {
      id: "brand-image",
      type: "image",
      src: `${IMG}/robert-rodriguez-logo-typography-color-palette-orange-pink-gradient-archer-hairline-book-font-design-branding.jpg`,
      alt: "Robert Rodriguez — typography system and color palette",
      aspect: "native",
      group: { name: "brand" },
    },

    // ── SECOND BRAND IMAGE ──
    {
      id: "brand-image-2",
      type: "image",
      src: `${IMG}/robert-rodriguez-logo-typography-gradient-orange-pink-coral-color-palette-branding-design.jpg`,
      alt: "Robert Rodriguez — logo typography and gradient palette",
      aspect: "native",
      group: { name: "brand" },
    },

    // ── COLOR FIELD MAP ──
    {
      id: "color-field-map",
      type: "color-field-map",
      group: { name: "brand" },
    },

    // ── FULL-LENGTH HERO ──
    {
      id: "lookbook-hero",
      type: "hero",
      image: `${IMG}/neiman-marcus-robert-rodriguez-woman-yellow-blazer-white-pants-pink-curly-hair-colorful-gradient-overlay-portrait-concrete-wall-gallery.jpg`,
      alt: "Robert Rodriguez — gallery installation with gradient overlay composite",
      inline: true,
    },

    // ── CLOSING ──
    {
      id: "closing-header",
      type: "section-header",
      label: "SECTION 06: CLOSING",
      title: "Reference Landed.\nNot a Parody.",
    },
    {
      id: "closing-text",
      type: "text",
      size: "subhead",
      content:
        "A focused campaign that took the mall portrait studio reference seriously. The saturated warmth, the unapologetic glamour. Rebuilt with contemporary craft.",
    },
    {
      id: "closing",
      type: "closing",
      services: ["Art Direction", "Photo Compositing", "Typography Design", "Campaign Design"],
      stack: ["Adobe Photoshop", "Adobe Illustrator", "Capture One"],
      links: [{ label: "Neiman Marcus", url: "https://www.neimanmarcus.com" }],
      content:
        "Four studio photographs became a complete campaign system through double-exposure compositing and mesh color-field backgrounds. The technique turned a single shoot day into a visual language that scaled across social, email, retail, and editorial. Each format pulling differently from the same layered source files.\n\nThe typography, color palette, and compositing approach were designed as a unified system. Archer Hairline floats over saturated imagery. Soft washes extend the garment's color story into the background. Two frames become one image that contains more depth than either original.\n\nSocial, email, retail. One model, one concept, one day of shooting. Every deliverable traces back to four original frames.",
    },
  ],
};
