export type Tag = "digital" | "creative" | "interiors";

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  href?: string;
  tags: Tag[];
  featured?: boolean;
}

const HP = "/case-studies/hp";

export const projects: Project[] = [
  { id: "ivyPark", title: "Ivy Park by Beyonce", category: "Digital design, brand launch", image: `${HP}/rhs-ivy-park-beyonce-digital-brand-launch.jpg`, href: "/case-studies/ivy-park", tags: ["digital", "creative"], featured: true },
  { id: "arc", title: "A.R.C. - AI home Inventory", category: "App & brand development", image: `${HP}/rhs-arc-ai-home-inventory-app-thumbnail.jpg`, href: "/case-studies/arc", tags: ["digital"], featured: true },
  { id: "hillKitchen", title: "Hill Country home", category: "Interior design, kitchen", image: `${HP}/rhs-interior-design-kitchen-modern-meets-vintage.jpg`, href: "/case-studies/hill-country-kitchen", tags: ["interiors"], featured: true },
  { id: "robertRod", title: "Robert Rodriguez x Neiman\u2019s", category: "Creative direction, design", image: `${HP}/rhs-robert-rodriguez-neiman-marcus-campaign-thumbnail.jpg`, href: "/case-studies/robert-rodriguez", tags: ["creative"], featured: true },
  { id: "nordstromPersonal", title: "Nordstrom personalization", category: "Design system, direction", image: `${HP}/rhs-nordstrom-personalization-design-system.jpg`, href: "/case-studies/nordstrom-personalization", tags: ["digital"] },
  { id: "jeffreyNyc", title: "Jeffrey NYC", category: "Ecommerce, web design", image: `${HP}/rhs-jeffrey-ecommerce-website-design.jpg`, href: "/case-studies/jeffrey-ecommerce", tags: ["digital"] },
  { id: "capitanBoot", title: "Capitan Boot Co.", category: "Branding, design", image: `${HP}/rhs-capitan-boot-co-branding.jpg`, href: "/case-studies/capitan-boot-co", tags: ["creative"] },
  { id: "jeffreyCampaign", title: "Jeffrey Spring Campaign", category: "Creative direction, design", image: `${HP}/rhs-jeffrey-spring-campaign.jpg`, href: "/case-studies/jeffrey-spring", tags: ["creative"] },
  { id: "hillBath", title: "Hill Country home", category: "Interior design, primary bath", image: `${HP}/rhs-interior-design-hill-country-primary-bath.jpg`, href: "/case-studies/hill-country-bath", tags: ["interiors"] },
  { id: "nordstromBeauty", title: "Nordstrom beauty", category: "Digital design, personalized", image: `${HP}/rhs-nordstrom-beauty-finder-digital-design.jpg`, href: "/case-studies/nordstrom-beauty", tags: ["digital"] },
  { id: "oakworks", title: "Hill County Oakworks", category: "Campaign direction, branding", image: `${HP}/rhs-hill-county-oakworks-campaign-branding.jpg`, href: "/case-studies/hill-country-oak", tags: ["creative"] },
  { id: "cosmoProf", title: "Cosmo Prof", category: "Digital design, creative direction", image: `${HP}/rhs-cosmo-prof-website-design-digital-rebrand.jpg`, href: "/case-studies/cosmo-prof", tags: ["digital"] },
  { id: "dsc", title: "Dallas Sport Collective", category: "Website, custom app", image: `${HP}/rhs-dallas-sport-collective-website-app.jpg`, tags: ["digital"] },
  { id: "bwType", title: "Black & white type", category: "Custom typography, patterns", image: `${HP}/rhs-campaign-design-typography-black-white-custom-patterns.jpg`, href: "/case-studies/black-white-type", tags: ["creative"] },
  { id: "hillLiving", title: "Hill Country home", category: "Interior design, living room", image: `${HP}/rhs-interior-design-livingroom-interior.jpg`, tags: ["interiors"] },
  { id: "jChristianson", title: "J.Christianson", category: "Brand development, design", image: `${HP}/rhs-campaign-design-j-christianson-branding.jpg`, href: "/case-studies/j-christianson", tags: ["creative"] },
  { id: "amberShockey", title: "Amber Shockey & Co.", category: "Tableware design, branding", image: `${HP}/rhs-campaign-design-amber-shockey-pattern-dishware.jpg`, href: "/case-studies/amber-shockey-co", tags: ["creative"] },
  { id: "sallyBeauty", title: "You By Sally", category: "Brand campaign", image: `${HP}/rhs-campaign-design-sally-beauty-you-by-sally-campaign.jpg`, href: "/case-studies/you-by-sally", tags: ["creative"] },
  { id: "sallyOS", title: "Sally Marketing OS", category: "Product design, engineering", image: `/case-studies/sally-os/heroes/sally-os-platform-hero.jpg`, href: "/case-studies/sally", tags: ["digital"] },
  { id: "jeffreyCampaign2", title: "Jeffrey NYC", category: "Campaign direction, design", image: `${HP}/rhs-interior-design-formal-modern-transitional.jpg`, tags: ["creative"] },
  { id: "fairviewSitting", title: "The Fairview", category: "Interior design, sitting room", image: `${HP}/rhs-interior-design-formal-modern-transitional-1.jpg`, href: "/case-studies/fairview-sitting", tags: ["interiors"] },
  { id: "floorDecor", title: "Floor & Decor", category: "Interiors feature", image: `${HP}/rhs-interior-design-master-bath-urban-farmhouse.jpg`, href: "/case-studies/floor-and-decor", tags: ["interiors"] },
  { id: "fairviewBedroom", title: "The Fairview Suite", category: "Interior design, bedroom", image: `${HP}/rhs-interior-design-master-bedroom-glam-luxe.jpg`, href: "/case-studies/fairview-suite", tags: ["interiors"] },
  { id: "fairviewFoyer", title: "The Fairview", category: "Interior Design, foyer", image: `${HP}/rhs-interior-design-grand-entry-luxe.jpg`, href: "/case-studies/fairview-entry", tags: ["interiors"] },
  { id: "nordstromFramework", title: "Nordstrom framework", category: "Content direction, design", image: `${HP}/rhs-nordstrom-framework-content-design.jpg`, href: "/case-studies/nordstrom-framework", tags: ["digital", "creative"] },
  { id: "lovedByNordstrom", title: "Loved by Nordstrom", category: "Brand campaign, design", image: `${HP}/rhs-campaign-design-nordstrom-loved-by-campaign.jpg`, href: "/case-studies/loved-by-nordstrom", tags: ["creative"] },
  { id: "mountainView", title: "Mountain View", category: "Interior design, remodel", image: `${HP}/rhs-interior-design-cabin-mid-century.jpg`, href: "/case-studies/chalet", tags: ["interiors"] },
  { id: "neimanMarcus", title: "Neiman Marcus", category: "Editorial direction, design", image: `${HP}/rhs-campaign-design-neiman-marcus-editorial-design.jpg`, href: "/case-studies/neiman-marcus", tags: ["creative"] },
  { id: "variousDesign", title: "Various design", category: "Branding, art, apparel", image: `${HP}/rhs-various-design-branding-art-apparel.jpg`, href: "/case-studies/branding-graphics", tags: ["creative"] },
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
    body: "Apps, ecommerce platforms, AI tools - the kinds of things that have to actually work, not just look like they do. The design and the code happen at the same desk, since shipping software is what proves whether the design was right in the first place.\n\nMost brand work gets designed and then handed off to be built. The gap between those two steps is where most digital projects quietly fall apart. The work in this section closes that gap by not having a handoff in the first place.",
    meta: {
      field: "Apps  Ecommerce  AI Tools",
      activeSince: "2002",
      status: "Shipping",
      classification: "Product Design  Full-Stack Engineering  Information Architecture  Interaction Design  AI Integration",
    },
    heroes: [
      { image: `${CAT_IMG}/category-digital-arc-app-smartphone-lifestyle.jpg`, projectId: "arc" },
      { image: `${CAT_IMG}/category-digital-sally-os-platform-dashboard.jpg`, projectId: "sallyOS" },
    ],
    expertise: {
      label: "SECTION 02: PRACTICE",
      title: "Same person designs it\nand ships it",
      subhead: "Every product on this list is live in production. The thing rendered in the prototype is the thing customers use, because the prototype was built in code from the start.",
      footnote: "The stack shifts per project - Next.js, React, Python, Streamlit, Supabase, sometimes other things, depending on what the work needs. AI shows up where the alternative can't keep up, since the tools should serve the problem, not the resume.",
      columns: [
        {
          title: "App Design & Development",
          content: "Native and web applications from the first idea through whatever launches at the end of it. The hard part isn't the architecture or the visuals or the code in isolation - it's keeping all three of them in conversation as the project moves, which is mostly what you do all day when you're designing and building something at the same time.\n\nA.R.C. went from concept to live product in ten weeks. Sally Marketing OS now runs five connected platforms inside a Fortune 500 marketing team in daily production use. The difference between designing an app and shipping one is the difference between a render and a room someone actually walks through.",
        },
        {
          title: "Ecommerce & Web",
          content: "Ecommerce sites have to do two things at the same time that mostly want to fight each other - they have to move people through a transaction and they have to make people feel something about the brand while it's happening. Most sites pick one and apologize for the other.\n\nJeffrey NYC, Nordstrom personalization, Cosmo Prof - each one came together by treating the product catalog, the customer behavior, and the brand voice as parts of the same problem instead of three problems that get solved separately and stitched together at the end.",
        },
        {
          title: "AI Integration",
          content: "AI shows up in the work when the alternative can't keep up. A.R.C. uses computer vision because asking someone to type out every object in their house would have killed the product before it shipped. Sally OS uses multi-model orchestration across Claude, Gemini, and Perplexity because brand strategy moves faster than any single model can think alone.\n\nNone of it gets used because it's the new thing - it gets used because it's the thing that makes the product possible. The most interesting AI work is the kind nobody notices, because the product just works the way someone needed it to.",
        },
      ],
    },
  },
  creative: {
    headline: "Creative direction,\ncampaigns and brand.",
    body: "Most brand work I take on has the same underlying problem - the brand has to read like the same brand whether it shows up as a logo, a billboard, a bottle, or a website, and the work is mostly the small calls between those things that decide whether it actually holds together.\n\nI'm drawn to the projects where every surface matters, where someone can tell that the headline and the photography and the typeface and the packaging were all picked by someone paying attention to the same thing. Those are the projects in this section.",
    meta: {
      field: "Brand Identity  Campaign Direction  Surface Design",
      activeSince: "2002",
      status: "Making",
      classification: "Logo Systems  Art Direction  Photography  Pattern Design  Editorial",
    },
    heroes: [
      { image: `${CAT_IMG}/category-creative-ivy-park-roller-skating-editorial.jpg`, projectId: "ivyPark" },
      { image: `${CAT_IMG}/category-creative-capitan-boot-co-desert-branding.jpg`, projectId: "capitanBoot" },
    ],
    expertise: {
      label: "SECTION 02: PRACTICE",
      title: "Same eye on the strategy\nas on the photo shoot",
      subhead: "Most agency creative work gets split between teams - strategy hands off to identity, identity hands off to campaign, campaign hands off to whoever's running the bottle line. Every handoff is a small loss of context. The work in this section came together without those handoffs, which is mostly why it reads like one studio shipped it.",
      footnote: "The arc usually runs the full year. Positioning question in January, production files by November, inside one client relationship, with the same hands holding both ends.",
      columns: [
        {
          title: "Brand Identity",
          content: "A logo is a five-second argument for why someone should pay attention. The identity system is the longer conversation that follows - typography, color, hierarchy, the small rules that govern how the brand behaves when it isn't trying to introduce itself.\n\nCapitan Boot Co. needed a mark that would survive on leather and read at a distance. J.Christianson needed a system flexible enough to span hospitality and retail. Different industries, same underlying question - what does this brand sound like when it speaks, and how does it look when it isn't speaking.",
        },
        {
          title: "Campaigns & Art Direction",
          content: "Art direction is mostly about controlling what the frame is allowed to contain - the lighting that flatters the right thing and ignores the rest, the wardrobe that argues for the brand without performing it, the set that disappears when it should and shows up when it shouldn't, the talent that reads in a thumbnail and holds up at billboard scale.\n\nAt Neiman Marcus, the Robert Rodriguez campaign came together as one shoot day producing four frames that ran across storefront, editorial, social, and email. The Ivy Park by Beyonce launch was the exclusive US digital rollout at Nordstrom. Sally Beauty's \"You By Sally\" campaign repositioned a brand that had drifted from itself. Different scales, same job - making sure the work survives the long trip from set to whatever screen or surface it eventually lands on.",
        },
        {
          title: "Surface & Object Design",
          content: "Designing for a plate or a print or a textile is a different problem than designing for a screen. There's no hover state to bail you out, no responsive breakpoint to forgive a layout decision. The object is the final output, and it has to hold up in someone's hands or on someone's wall, in the light of an actual room, ten years from now.\n\nAmber Shockey's tableware line, pattern systems that translate between textile and ceramic, typography studies rendered as lithographs that nobody commissioned - the work moves off the screen and onto physical surfaces, where the rules change and the tolerance for getting it wrong drops.",
        },
      ],
    },
  },
  interiors: {
    headline: "Rooms that work the way people live.",
    body: "Custom homes, kitchens, and baths designed to feel collected rather than decorated. Less ornament, more time spent on the few elements that carry the weight - the stone, the wood, the way the light hits a wall in late afternoon.\n\nMost of the work happens long before the install. Choosing the palette, editing the references, deciding what gets to be loud and what stays quiet. The unglamorous part - specs, sourcing, jobsite visits - happens behind the scenes. What the room shows is the editing.",
    meta: {
      field: "Custom Homes  Kitchens  Baths",
      activeSince: "2012",
      status: "Designing",
      classification: "Spatial Design  Material Selection  Construction Documentation  Lighting Plans",
    },
    heroes: [
      { image: `${CAT_IMG}/category-interiors-hill-country-kitchen-island-marble.jpg`, projectId: "hillKitchen" },
      { image: `${CAT_IMG}/category-interiors-primary-bath-vanity-marble-sconces.jpg`, projectId: "hillBath" },
    ],
    expertise: {
      label: "SECTION 02: PRACTICE",
      title: "From custom homes\nto cabinet pulls",
      subhead: "Whole-house plans get the same eye as a single hardware pick - the kind of attention that sounds like overkill until you live in a room where someone actually paid it. The work scales without losing the person doing the choosing, mostly because there isn't anyone else to lose it to.",
      footnote: "The work happens at the table before it happens on the site - palette specified, materials sourced, hardware schedule final, all before anyone breaks ground. By the time the contractor shows up, the room is mostly already designed.",
      columns: [
        {
          title: "Custom Homes & Remodels",
          content: "Each project starts with the site itself, which is a cliché in the field but happens to be true: what the light does at different hours, where the household actually lives during the week versus the weekend, what the existing structure has going for it that should probably stay. The early conversations don't have anything to do with finishes yet.\n\nWhere remodels get tricky is that some of the existing architecture has good ideas baked into it and some of it really doesn't, and sorting that out before drawing a new floor plan is the difference between a project that fights itself for eighteen months and a project that doesn't.",
        },
        {
          title: "Kitchen & Bath",
          content: "Kitchens and baths are the rooms where small material decisions compound the fastest, which is why they tend to consume more of the design timeline than their square footage would suggest. A kitchen is really only four or five finishes (cabinetry, countertop, backsplash, hardware, floor) repeated across dozens of surfaces and sightlines, and a bath works the same way at smaller scale. Get the palette right at the front end and the rest of the room falls into place. Get it wrong and you produce a room someone can't quite explain why they don't like.\n\nThe reason that early call matters is that each material is carrying multiple jobs at once. A marble at install looks nothing like the same marble ten years in, brass tarnishes in ways that some people love and some people hate, white oak ambers as it ages. Most of the work is reading all of that ahead of time, before the slabs get cut.",
        },
        {
          title: "Selections & Documentation",
          content: "The selections - the lighting plan, the hardware schedule, the paint palette, the floor coverings - are where rooms actually get designed. Which lights make a room and which ones disappear, which hardware reads quiet and which steps forward, which paint shifts depending on the light coming through whatever window happens to be closest. The taste decisions live here, not on the floor plan.\n\nDocumentation is the version that survives the install. A complete spec set translates the selections into something a builder can build without picking up the phone - paperwork to anyone who hasn't been through a chaotic install, the actual design to anyone who has.",
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
