export type Tag = "digital" | "creative" | "interiors";

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  // Overrides `image` for the social share card only. Use when `image` is a
  // square tile (which crops badly to the 1.91:1 OG frame) or when the tile is
  // a live component with no still — e.g. the Faux Reel wall renders live, so
  // its `image` isn't shown anywhere except here.
  ogImage?: string;
  href?: string;
  tags: Tag[];
  featured?: boolean;
}

const HP = "/case-studies/hp";

export const projects: Project[] = [
  { id: "ivyPark", title: "Ivy Park by Beyoncé", category: "Digital design, brand launch", image: `${HP}/rhs-ivy-park-beyonce-digital-brand-launch.jpg?v=3`, href: "/case-studies/ivy-park", tags: ["digital", "creative"], featured: true },
  { id: "arc", title: "A.R.C. - AI Home Inventory", category: "App & brand development", image: `${HP}/rhs-arc-ai-home-inventory-app-thumbnail.jpg?v=3`, href: "/case-studies/arc", tags: ["digital"], featured: true },
  { id: "hillKitchen", title: "Hill Country home", category: "Interior design, kitchen", image: `${HP}/rhs-interior-design-kitchen-modern-meets-vintage.jpg?v=3`, href: "/case-studies/hill-country-kitchen", tags: ["interiors"], featured: true },
  { id: "robertRod", title: "Robert Rodriguez x Neiman\u2019s", category: "Creative direction, design", image: `${HP}/rhs-robert-rodriguez-neiman-marcus-campaign-thumbnail.jpg?v=3`, href: "/case-studies/robert-rodriguez", tags: ["creative"], featured: true },
  { id: "nordstromPersonal", title: "Nordstrom personalization", category: "Design system, direction", image: `${HP}/rhs-nordstrom-personalization-laptop.jpg`, href: "/case-studies/nordstrom-personalization", tags: ["digital"] },
  { id: "jeffreyNyc", title: "Jeffrey NYC", category: "Ecommerce, web design", image: `${HP}/rhs-jeffrey-ecommerce-laptop.jpg`, href: "/case-studies/jeffrey-ecommerce", tags: ["digital"] },
  { id: "capitanBoot", title: "Capitan Boot Co.", category: "Branding, design", image: `${HP}/rhs-capitan-boot-co-branding.jpg?v=3`, href: "/case-studies/capitan-boot-co", tags: ["creative"] },
  { id: "jeffreyCampaign", title: "Jeffrey Spring Campaign", category: "Creative direction, design", image: `${HP}/rhs-jeffrey-spring-campaign-laptop.jpg`, href: "/case-studies/jeffrey-spring", tags: ["creative"] },
  { id: "hillBath", title: "Hill Country home", category: "Interior design, primary bath", image: `${HP}/rhs-interior-design-hill-country-primary-bath.jpg?v=3`, href: "/case-studies/hill-country-bath", tags: ["interiors"] },
  { id: "nordstromBeauty", title: "Nordstrom beauty", category: "Digital design, personalized", image: `${HP}/rhs-nordstrom-beauty-finder-digital-design.jpg?v=3`, href: "/case-studies/nordstrom-beauty", tags: ["digital"] },
  { id: "oakworks", title: "Hill Country Oakworks", category: "Campaign direction, branding", image: `${HP}/rhs-hill-country-oakworks-billboard.jpg`, href: "/case-studies/hill-country-oak", tags: ["creative"] },
  { id: "cosmoProf", title: "Cosmo Prof", category: "Digital design, creative direction", image: `${HP}/rhs-cosmo-prof-website-design-digital-rebrand.jpg?v=3`, href: "/case-studies/cosmo-prof", tags: ["digital"] },
  { id: "dsc", title: "Dallas Sport Collective", category: "Website, custom app", image: `${HP}/rhs-dallas-sport-collective-website-app.jpg?v=3`, href: "/case-studies/dsc", tags: ["digital"] },
  { id: "bwType", title: "Black & white type", category: "Custom typography, patterns", image: `${HP}/rhs-campaign-design-typography-black-white-custom-patterns.jpg?v=3`, href: "/case-studies/black-white-type", tags: ["creative"] },
  { id: "hillLiving", title: "Hill Country home", category: "Interior design, living room", image: `${HP}/rhs-interior-design-livingroom-interior.jpg?v=3`, href: "/case-studies/hill-country-living", tags: ["interiors"] },
  { id: "jChristianson", title: "J. Christianson", category: "Brand development, design", image: `${HP}/rhs-campaign-design-j-christianson-branding.jpg?v=3`, href: "/case-studies/j-christianson", tags: ["creative"] },
  { id: "amberShockey", title: "Amber Shockey & Co.", category: "Tableware design, branding", image: `${HP}/rhs-campaign-design-amber-shockey-blue-plate.jpg`, href: "/case-studies/amber-shockey-co", tags: ["creative"] },
  { id: "sallyBeauty", title: "You By Sally", category: "Brand campaign", image: `${HP}/rhs-campaign-design-sally-beauty-you-by-sally-campaign.jpg?v=3`, href: "/case-studies/you-by-sally", tags: ["creative"] },
  { id: "sallyOS", title: "Sally Marketing OS", category: "Product design, engineering", image: `/case-studies/sally-os/heroes/sally-os-platform-hero.jpg`, href: "/case-studies/sally", tags: ["digital"] },
  { id: "fairviewSitting", title: "The Fairview", category: "Interior design, sitting room", image: `${HP}/rhs-interior-design-formal-modern-transitional-1.jpg?v=3`, href: "/case-studies/fairview-sitting", tags: ["interiors"] },
  { id: "floorDecor", title: "Floor & Decor", category: "Interiors feature", image: `${HP}/rhs-interior-design-master-bath-urban-farmhouse.jpg?v=3`, href: "/case-studies/floor-and-decor", tags: ["interiors"] },
  { id: "fairviewBedroom", title: "The Fairview Suite", category: "Interior design, bedroom", image: `${HP}/rhs-interior-design-master-bedroom-glam-luxe.jpg?v=3`, href: "/case-studies/fairview-suite", tags: ["interiors"] },
  { id: "fairviewFoyer", title: "The Fairview", category: "Interior Design, foyer", image: `${HP}/rhs-interior-design-grand-entry-luxe.jpg?v=3`, href: "/case-studies/fairview-entry", tags: ["interiors"] },
  { id: "nordstromFramework", title: "Nordstrom framework", category: "Content direction, design", image: `${HP}/rhs-nordstrom-framework-content-design.jpg?v=3`, href: "/case-studies/nordstrom-framework", tags: ["digital", "creative"] },
  { id: "lovedByNordstrom", title: "Loved by Nordstrom", category: "Brand campaign, design", image: `${HP}/rhs-campaign-design-nordstrom-loved-by-campaign.jpg?v=3`, href: "/case-studies/loved-by-nordstrom", tags: ["creative"] },
  { id: "mountainView", title: "Mountain View", category: "Interior design, remodel", image: `${HP}/rhs-interior-design-cabin-mid-century.jpg?v=3`, href: "/case-studies/chalet", tags: ["interiors"] },
  { id: "neimanMarcus", title: "Neiman Marcus", category: "Editorial direction, design", image: `${HP}/rhs-neiman-marcus-editorial-design-fashion-spreads.jpg`, href: "/case-studies/neiman-marcus", tags: ["creative"] },
  { id: "variousDesign", title: "Various design", category: "Branding, art, apparel", image: `${HP}/rhs-various-design-branding-graphics-prints-apparel.jpg`, href: "/case-studies/branding-graphics", tags: ["creative"] },
  /* The study's second card, dropped down here so the two entries to it
     are not a screen apart. It was titled "Jeffrey NYC", which is the
     jeffrey-ecommerce card's name a few rows up, while pointing at
     jeffrey-spring — two different studies reading as one repeated one.
     Its image file is still named for an interiors project it has
     nothing to do with; the picture inside it is the Valentino email. */
  { id: "jeffreyCampaign2", title: "Jeffrey Spring Campaign", category: "Email, campaign templates", image: `${HP}/rhs-interior-design-formal-modern-transitional.jpg?v=3`, href: "/case-studies/jeffrey-spring", tags: ["creative"] },
  { id: "bigBend", title: "West Texas", category: "Landscape photography", image: "/case-studies/big-bend/hero.jpg", href: "/case-studies/big-bend", tags: ["creative"] },
  { id: "sizzle", title: "Faux Reel", category: "Product design, motion", image: "/images/thumbnails/sizzle.jpg", ogImage: "/og-faux-reel.jpg", href: "/case-studies/sizzle", tags: ["digital"] },
];

const CAT_IMG = "/case-studies/categories";

export interface ExpertiseSection {
  label: string;
  title: string;
  subhead: string;
  footnote: string;
  /** Columns mirror the case-study three-column pattern — small title on the
   * left, body content on the right. Body can contain `\n\n` for paragraphs. */
  columns: { title: string; content: string }[];
}

export interface CategoryHero {
  image: string;
  projectId: string; // matches a project.id for title, category, and link
  /** One-line, role-forward description for the featured hero caption. Leads
   *  with what Jeremy did on the project, not a product tagline. */
  blurb: string;
}

export interface CategoryMeta {
  field: string;
  activeSince: string;
  status: string;
  classification: string;
}

export const categoryInfo: Record<Tag, { headline: string; body: string; meta: CategoryMeta; heroes: [CategoryHero, CategoryHero]; expertise: ExpertiseSection }> = {
  digital: {
    headline: "Digital experiences,\necommerce and apps.",
    body: "The projects in this section are apps, ecommerce platforms, and AI tools.\n\nSome of them I designed and built end to end, the screens and the code both. The others were design and direction roles inside retail teams.",
    meta: {
      field: "Apps  Ecommerce  AI Tools",
      activeSince: "2002",
      status: "Shipping",
      classification: "Product Design  Full-Stack Engineering  Information Architecture  Interaction Design  AI Integration",
    },
    heroes: [
      { image: `${CAT_IMG}/category-digital-arc-app-smartphone-lifestyle.jpg`, projectId: "arc", blurb: "An AI home inventory app: the product, the brand, and the code, live in ten weeks." },
      { image: `${CAT_IMG}/category-digital-sally-os-platform-dashboard.jpg`, projectId: "sallyOS", blurb: "Five connected marketing platforms in daily production use inside a Fortune 500 marketing team." },
    ],
    expertise: {
      label: "SECTION 02: PRACTICE",
      title: "Apps, ecommerce,\nand AI integration",
      subhead: "The retail platform work runs from 2014 to 2020. The end-to-end builds shipped within the last two years.",
      footnote: "The stack shifts per project: Next.js, React, Python, Streamlit, and Supabase are the usual pieces.",
      columns: [
        {
          title: "App Design & Development",
          content: "App work covers the full build: interface design, information architecture, and the code that ships it.\n\nDallas Sport Collective is the most recent: a marketing site, a scheduling platform with an owner console, and an MCP server that athletes connect to from whichever AI they already use.",
        },
        {
          title: "Ecommerce & Web",
          content: "Ecommerce work covers storefront design: product pages, brand hubs, and the design systems retailers run them on.\n\nJeffrey New York was an ecommerce site design for the boutique. At Nordstrom, the personalization system and the beauty hub were design systems built to run across the retailer's site. Cosmo Prof was a digital rebrand of the storefront.",
        },
        {
          title: "AI Integration",
          content: "AI integration covers computer vision, multi-model orchestration, and the infrastructure that connects them to a product.\n\nA.R.C. reads rooms from photos and video and produces an itemized, valued inventory. Sally Marketing OS orchestrates Claude, Gemini, and Perplexity for brand strategy work.",
        },
      ],
    },
  },
  creative: {
    headline: "Creative direction,\ncampaigns and brand.",
    body: "The projects in this section are campaigns, brand identities, and design for physical objects like tableware, apparel, and prints.\n\nMost of it was client work. The typography and pattern studies are personal projects.",
    meta: {
      field: "Brand Identity  Campaign Direction  Surface Design",
      activeSince: "2002",
      status: "Making",
      classification: "Logo Systems  Art Direction  Photography  Pattern Design  Editorial",
    },
    heroes: [
      { image: `${CAT_IMG}/category-creative-ivy-park-roller-skating-editorial.jpg`, projectId: "ivyPark", blurb: "Creative direction and design for the US launch of Beyoncé's activewear brand, exclusive to Nordstrom." },
      { image: `${CAT_IMG}/category-creative-capitan-boot-co-desert-branding.jpg`, projectId: "capitanBoot", blurb: "Brand identity, apparel graphics, and campaign photography for a western boot company." },
    ],
    expertise: {
      label: "SECTION 02: PRACTICE",
      title: "Identity, campaigns,\nand physical objects",
      subhead: "Some of these projects ran from the first positioning work through the final production files. Others were specific pieces inside a larger effort.",
      footnote: "The tools are Illustrator, Photoshop, InDesign, and a camera.",
      columns: [
        {
          title: "Brand Identity",
          content: "Brand identity work covers naming, logo systems, typography, and the graphic rules that keep them consistent across print, apparel, and product.\n\nCapitan Boot Co. is the most complete build: a primary logo, secondary badges, typographic lockups, and apparel graphics, all designed to hold up when stamped into leather, with campaign photography shot on location in West Texas. J. Christianson is a naming and identity system that works across the client's hospitality and retail businesses.",
        },
        {
          title: "Campaigns & Art Direction",
          content: "Campaign work runs from concept and art direction through the final production files, sized for every format a retailer owns.\n\nThe Robert Rodriguez campaign for Neiman Marcus came out of a single day of shooting, and the four frames from that day ran across storefront windows, editorial, social, and email. Ivy Park went from brief to live in six weeks, and because Nordstrom held the only US partnership, the website carried the launch. You By Sally was a repositioning campaign for Sally Beauty's own product brand.",
        },
        {
          title: "Surface & Object Design",
          content: "Surface and object design covers physical goods: tableware, textiles, ceramics, and prints.\n\nThe Amber Shockey & Co. project is a tableware line, with the patterns and the branding designed together. The pattern systems are drawn to work on both textile and ceramic, and the typography studies are personal work, printed as lithographs.",
        },
      ],
    },
  },
  interiors: {
    headline: "Interior design, kitchens\nand custom homes.",
    body: "The projects in this section are custom homes, kitchens, and baths.\n\nThe work covers space planning, material and fixture selection, and the construction documentation a builder works from.",
    meta: {
      field: "Custom Homes  Kitchens  Baths",
      activeSince: "2012",
      status: "Designing",
      classification: "Spatial Design  Material Selection  Construction Documentation  Lighting Plans",
    },
    heroes: [
      { image: `${CAT_IMG}/category-interiors-hill-country-kitchen-island-marble.jpg`, projectId: "hillKitchen", blurb: "A ground-up Hill Country kitchen: cabinetry, island, dining zone, and the full material spec." },
      { image: `${CAT_IMG}/category-interiors-primary-bath-vanity-marble-sconces.jpg`, projectId: "hillBath", blurb: "A 400 square foot primary bath: two vanities, a freestanding tub, and a marble shower." },
    ],
    expertise: {
      label: "SECTION 02: PRACTICE",
      title: "Homes, kitchens,\nand selections",
      subhead: "Some of these projects are whole-house builds. Others are single rooms, a remodel, or a feature shot for Floor & Decor.",
      footnote: "The photos show the finished rooms. Behind each one sits the folder that got it there: lighting plan, hardware schedule, paint palette, spec set.",
      columns: [
        {
          title: "Custom Homes & Remodels",
          content: "Custom home work starts at the floor plan: site conditions, how the household uses each room, and what the existing structure is worth keeping.\n\nThe Hill Country house appears in this section three times, as a kitchen, a living room, and a primary bath. The Fairview appears as an entry, a sitting room, and a primary suite. Mountain View is a cabin remodel.",
        },
        {
          title: "Kitchen & Bath",
          content: "Kitchen and bath design is mostly material logic: four or five finishes repeated across dozens of surfaces, chosen for how they age as much as for how they look at install.\n\nThe Hill Country kitchen runs sage green cabinetry, raw white oak, Calacatta marble, and unlacquered brass. The primary bath pulls the same family lighter, with pale sage, polished nickel, and three different marbles.",
        },
        {
          title: "Selections & Documentation",
          content: "Selections are the design decisions: which lights make a room and which disappear, which hardware stays quiet, which paint shifts with the light from the nearest window. Documentation translates those picks into a spec set a builder can build from without calling.",
        },
      ],
    },
  },
};

/**
 * Keyed lookup of every project by its `id`. Use this when you need to render
 * specific projects by name (e.g., the homepage `<Thumb project={p.ivyPark} />`).
 * Single source of truth — the homepage no longer keeps a parallel record.
 */
export const projectsById: Record<string, Project> = Object.fromEntries(
  projects.map((p) => [p.id, p])
);

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectsByTag(tag: Tag): Project[] {
  return projects.filter((p) => p.tags.includes(tag));
}

export function getFeaturedByTag(tag: Tag): Project[] {
  return projects.filter((p) => p.tags.includes(tag) && p.featured);
}

export function getOtherTags(tag: Tag): Tag[] {
  return (["digital", "creative", "interiors"] as Tag[]).filter((t) => t !== tag);
}
