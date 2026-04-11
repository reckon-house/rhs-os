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
  { id: "nordstromPersonal", title: "Nordstrom personalization", category: "Design system, direction", image: `${HP}/rhs-nordstrom-personalization-design-system.jpg`, tags: ["digital"] },
  { id: "jeffreyNyc", title: "Jeffrey NYC", category: "Ecommerce, web design", image: `${HP}/rhs-jeffrey-ecommerce-website-design.jpg`, tags: ["digital"] },
  { id: "capitanBoot", title: "Capitan Boot Co.", category: "Branding, design", image: `${HP}/rhs-capitan-boot-co-branding.jpg`, tags: ["creative"] },
  { id: "jeffreyCampaign", title: "Jeffrey Spring Campaign", category: "Creative direction, design", image: `${HP}/rhs-jeffrey-spring-campaign.jpg`, tags: ["creative"] },
  { id: "hillBath", title: "Hill Country home", category: "Interior design, primary bath", image: `${HP}/rhs-interior-design-hill-country-primary-bath.jpg`, tags: ["interiors"] },
  { id: "nordstromBeauty", title: "Nordstrom beauty", category: "Digital design, personalized", image: `${HP}/rhs-nordstrom-beauty-finder-digital-design.jpg`, tags: ["digital"] },
  { id: "oakworks", title: "Hill County Oakworks", category: "Campaign direction, branding", image: `${HP}/rhs-hill-county-oakworks-campaign-branding.jpg`, tags: ["creative"] },
  { id: "cosmoProf", title: "Cosmo Prof", category: "Digital design, creative direction", image: `${HP}/rhs-cosmo-prof-website-design-digital-rebrand.jpg`, tags: ["digital"] },
  { id: "dsc", title: "Dallas Sport Collective", category: "Website, custom app", image: `${HP}/rhs-dallas-sport-collective-website-app.jpg`, tags: ["digital"] },
  { id: "bwType", title: "Black & white type", category: "Custom typography, patterns", image: `${HP}/rhs-campaign-design-typography-black-white-custom-patterns.jpg`, href: "/case-studies/black-white-type", tags: ["creative"] },
  { id: "hillLiving", title: "Hill Country home", category: "Interior design, living room", image: `${HP}/rhs-interior-design-livingroom-interior.jpg`, tags: ["interiors"] },
  { id: "jChristianson", title: "J.Christianson", category: "Brand development, design", image: `${HP}/rhs-campaign-design-j-christianson-branding.jpg`, tags: ["creative"] },
  { id: "amberShockey", title: "Amber Shockey & Co.", category: "Tableware design, branding", image: `${HP}/rhs-campaign-design-amber-shockey-pattern-dishware.jpg`, tags: ["creative"] },
  { id: "sallyBeauty", title: "You By Sally", category: "Brand campaign", image: `${HP}/rhs-campaign-design-sally-beauty-you-by-sally-campaign.jpg`, tags: ["creative"] },
  { id: "sallyOS", title: "Sally Marketing OS", category: "Product design, engineering", image: `/case-studies/sally-os/heroes/sally-os-platform-hero.jpg`, href: "/case-studies/sally", tags: ["digital"] },
  { id: "jeffreyCampaign2", title: "Jeffrey NYC", category: "Campaign direction, design", image: `${HP}/rhs-interior-design-formal-modern-transitional.jpg`, tags: ["creative"] },
  { id: "fairviewSitting", title: "The Fairview", category: "Interior design, sitting room", image: `${HP}/rhs-interior-design-formal-modern-transitional-1.jpg`, tags: ["interiors"] },
  { id: "floorDecor", title: "Floor & Decor", category: "Interiors feature", image: `${HP}/rhs-interior-design-master-bath-urban-farmhouse.jpg`, tags: ["interiors"] },
  { id: "fairviewBedroom", title: "The Fairview Suite", category: "Interior design, bedroom", image: `${HP}/rhs-interior-design-master-bedroom-glam-luxe.jpg`, tags: ["interiors"] },
  { id: "fairviewFoyer", title: "The Fairview", category: "Interior Design, foyer", image: `${HP}/rhs-interior-design-grand-entry-luxe.jpg`, tags: ["interiors"] },
  { id: "nordstromFramework", title: "Nordstrom framework", category: "Content direction, design", image: `${HP}/rhs-nordstrom-framework-content-design.jpg`, tags: ["digital", "creative"] },
  { id: "lovedByNordstrom", title: "Loved by Nordstrom", category: "Brand campaign, design", image: `${HP}/rhs-campaign-design-nordstrom-loved-by-campaign.jpg`, tags: ["creative"] },
  { id: "mountainView", title: "Mountain View", category: "Interior design, remodel", image: `${HP}/rhs-interior-design-cabin-mid-century.jpg`, tags: ["interiors"] },
  { id: "neimanMarcus", title: "Neiman Marcus", category: "Editorial direction, design", image: `${HP}/rhs-campaign-design-neiman-marcus-editorial-design.jpg`, tags: ["creative"] },
  { id: "variousDesign", title: "Various design", category: "Branding, art, apparel", image: `${HP}/rhs-various-design-branding-art-apparel.jpg`, tags: ["creative"] },
];

const CAT_IMG = "/case-studies/categories";

export interface ExpertiseSection {
  label: string;
  title: string;
  subhead: string;
  footnote: string;
  columns: { title: string; content: string }[];
}

export interface CategoryHero {
  image: string;
  projectId: string; // matches a project.id for title, category, and link
}

export const categoryInfo: Record<Tag, { headline: string; body: string; heroes: [CategoryHero, CategoryHero]; expertise: ExpertiseSection }> = {
  digital: {
    headline: "Digital experiences,\necommerce and apps.",
    body: "Design and code happen together. Fast prototypes, working products, AI integration when it solves a real problem. Same hands from concept through launch, whether it's a complete platform or a product page.\n\nMost brands get designed, then handed off to be built. The gap between vision and execution is where things fall apart. This work closes that gap.",
    heroes: [
      { image: `${CAT_IMG}/category-digital-arc-app-smartphone-lifestyle.jpg`, projectId: "arc" },
      { image: `${CAT_IMG}/category-digital-sally-os-platform-dashboard.jpg`, projectId: "sallyOS" },
    ],
    expertise: {
      label: "SECTION: DIGITAL",
      title: "Design That Ships\nas Code",
      subhead: "Products, platforms, and tools built by the same person who designed them. No handoff. No spec drift. The interface and the engineering happen in the same session.",
      footnote: "The stack shifts per project. Next.js, React, Python, Streamlit, Supabase, Vercel. AI integration where it solves a real problem, not where it makes a good slide. Every project listed here is live, in production, handling real users.",
      columns: [
        {
          title: "App Design & Development",
          content: "Native and web applications from concept through deployment. Information architecture, interaction design, visual system, and working code. A.R.C. went from idea to App Store in ten weeks. Sally Marketing OS runs five connected platforms in daily production use.\n\nThe difference between designing an app and building one is the difference between a render and a room you can walk through.",
        },
        {
          title: "Ecommerce & Web",
          content: "Branded web experiences that handle transactions and tell a story at the same time. Product pages that convert. Category systems that scale. Checkout flows that don't lose people.\n\nJeffrey NYC, Nordstrom personalization, Cosmo Prof. Each one required understanding the product catalog, the customer behavior, and the brand voice simultaneously. The design reflects all three.",
        },
        {
          title: "AI Integration",
          content: "Computer vision for object recognition. Natural language processing for brand strategy. Multi-model orchestration across Claude, Gemini, and Perplexity. Real-time competitive intelligence pipelines.\n\nAI shows up in the work when it solves a specific problem faster or better than the alternative. Not as a feature bullet. As infrastructure that makes the product possible.",
        },
      ],
    },
  },
  creative: {
    headline: "Creative direction,\ncampaigns and brand.",
    body: "Positioning, voice, visual identity. The DNA that makes a brand recognizable across every touchpoint. Sometimes that means a full campaign shoot. Sometimes a logo system. Sometimes a typography study that never had a client. The scope changes but the attention doesn't.",
    heroes: [
      { image: `${CAT_IMG}/category-creative-ivy-park-roller-skating-editorial.jpg`, projectId: "ivyPark" },
      { image: `${CAT_IMG}/category-creative-capitan-boot-co-desert-branding.jpg`, projectId: "capitanBoot" },
    ],
    expertise: {
      label: "SECTION: CREATIVE",
      title: "From Logo\nto Lookbook",
      subhead: "Brand identity, campaign creative, art direction, and the physical objects that carry the work into the world. The range runs from a single mark to a full seasonal rollout across retail, digital, and editorial.",
      footnote: "Most projects start with positioning and end with production files. The deliverables vary but the thinking stays consistent: what does this brand need to say, and what's the most honest way to say it visually?",
      columns: [
        {
          title: "Brand Identity",
          content: "Logos, type systems, color palettes, brand guidelines. The foundational layer that everything else builds on. Capitan Boot Co. needed a mark that worked on leather. J.Christianson needed a system flexible enough for hospitality and retail.\n\nA logo is a five-second argument for why someone should pay attention. The identity system is the longer conversation that follows.",
        },
        {
          title: "Campaigns & Art Direction",
          content: "Robert Rodriguez at Neiman Marcus. One shoot day, four frames, a full seasonal campaign across storefront, editorial, social, and email. Ivy Park by Beyonce. Sally Beauty's \"You By Sally\" repositioning.\n\nArt direction means controlling the frame. Lighting, wardrobe, set, talent, post-production. Making sure the brand reads in a thumbnail and holds up at billboard scale.",
        },
        {
          title: "Surface & Object Design",
          content: "Amber Shockey's tableware line. Pattern systems for textile and ceramic. Typography studies rendered as lithographs. The work moves off-screen and onto physical surfaces.\n\nDesigning for a plate or a print demands a different kind of precision. No hover states. No responsive breakpoints. The object is the final output. It has to hold up in your hands.",
        },
      ],
    },
  },
  interiors: {
    headline: "Interior design\nand environments.",
    body: "Residential design from concept through construction documentation. Every room tells a story. The work is making sure it's the right one. Materials, lighting, spatial flow, and the details that make a space feel considered rather than decorated.",
    heroes: [
      { image: `${CAT_IMG}/category-interiors-hill-country-kitchen-island-marble.jpg`, projectId: "hillKitchen" },
      { image: `${CAT_IMG}/category-interiors-primary-bath-vanity-marble-sconces.jpg`, projectId: "hillBath" },
    ],
    expertise: {
      label: "SECTION: INTERIORS",
      title: "Rooms That Work\nthe Way People Live",
      subhead: "Residential design from floor plan through final styling. Custom homes, kitchens, baths, full remodels. Every material specified, every fixture selected, every detail documented for construction.",
      footnote: "The process mirrors product design more than most interior designers would admit. Define the user. Map the workflows. Select the components. Build the system. Test it against real life. The medium is different. The methodology isn't.",
      columns: [
        {
          title: "Custom Homes & Remodels",
          content: "Hill Country properties. The Fairview estate. Mountain View cabin. Each project starts with the site, the light, and how the household actually functions. Not a mood board. A spatial program.\n\nRemodels carry an added layer: reading the bones of the existing structure and deciding what stays, what goes, and what gets reinterpreted. The original architecture has opinions. Listening to them produces better rooms.",
        },
        {
          title: "Kitchen & Bath",
          content: "The two rooms where material decisions compound fastest. A kitchen is four or five finishes repeated across dozens of surfaces. Get the palette right and every specification falls into place. Get it wrong and no amount of decorating fixes the underlying friction.\n\nMarble, wood, metal, paint. Each material has a maintenance profile, an aging trajectory, and a visual weight. Selecting for all three at once is the job.",
        },
        {
          title: "Selections & Documentation",
          content: "Fixture schedules. Finish specifications. Lighting plans. Tile layouts. Hardware selections down to the hinge. The unsexy layer that separates a designed room from a decorated one.\n\nConstruction documentation means the builder opens the plans and knows exactly what goes where. No ambiguity. No RFIs that should have been answered in design. The specification is the product.",
        },
      ],
    },
  },
};

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
