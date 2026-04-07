export type Tag = "digital" | "campaigns" | "interiors" | "branding";

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
  { id: "ivyPark", title: "Ivy Park by Beyonce", category: "Digital design, brand launch", image: `${HP}/Image.jpg`, tags: ["digital", "campaigns"], featured: true },
  { id: "arc", title: "A.R.C. - AI home Inventory", category: "App & brand development", image: `${HP}/image 264.jpg`, href: "/case-studies/arc", tags: ["digital"], featured: true },
  { id: "hillKitchen", title: "Hill Country home", category: "Interior design, kitchen", image: `${HP}/rhs-interior-design-kitchen-modern-meets-vintage.jpg`, tags: ["interiors"], featured: true },
  { id: "robertRod", title: "Robert Rodriguez x Neiman\u2019s", category: "Creative direction, design", image: `${HP}/image 278.jpg`, href: "/case-studies/robert-rodriguez", tags: ["campaigns"], featured: true },
  { id: "nordstromPersonal", title: "Nordstrom personalization", category: "Design system, direction", image: `${HP}/rhs-digital-design-house-staple-brand-site.jpg.jpg`, tags: ["digital"] },
  { id: "jeffreyNyc", title: "Jeffrey NYC", category: "Ecommerce, web design", image: `${HP}/rhs-jeffrey-ecommerce-website-design.jpg`, tags: ["digital"] },
  { id: "capitanBoot", title: "Capitan Boot Co.", category: "Branding, design", image: `${HP}/Image-1.jpg`, tags: ["branding"] },
  { id: "jeffreyCampaign", title: "Jeffrey Spring Campaign", category: "Creative direction, design", image: `${HP}/rhs-jeffrey-spring-campaign.jpg`, tags: ["campaigns"] },
  { id: "hillBath", title: "Hill Country home", category: "Interior design, primary bath", image: `${HP}/bath_front 3.jpg`, tags: ["interiors"] },
  { id: "nordstromBeauty", title: "Nordstrom beauty", category: "Digital design, personalized", image: `${HP}/rhs-nordstrom-beauty-finder-digital-design.jpg.jpg`, tags: ["digital"] },
  { id: "oakworks", title: "Hill County Oakworks", category: "Campaign direction, branding", image: `${HP}/image 275.jpg`, tags: ["campaigns", "branding"] },
  { id: "cosmoProf", title: "Cosmo Prof", category: "Digital design, creative direction", image: `${HP}/rhs-cosmo-prof-website-design-digital-rebrand.jpg`, tags: ["digital"] },
  { id: "dsc", title: "Dallas Sport Collective", category: "Website, custom app", image: `${HP}/Group 730.jpg`, tags: ["digital"] },
  { id: "bwType", title: "Black & white type", category: "Custom typography, patterns", image: `${HP}/rhs-campaign-design-typography-black-white-custom-patterns.jpg`, tags: ["branding"] },
  { id: "hillLiving", title: "Hill Country home", category: "Interior design, living room", image: `${HP}/rhs-interior-design-livingroom-interior.jpg`, tags: ["interiors"] },
  { id: "jChristianson", title: "J.Christianson", category: "Brand development, design", image: `${HP}/rhs-campaign-design-j-christianson-branding.jpg`, tags: ["branding"] },
  { id: "amberShockey", title: "Amber Shockey & Co.", category: "Tableware design, branding", image: `${HP}/rhs-campaign-design-amber-shockey-pattern-dishware.jpg`, tags: ["branding"] },
  { id: "sallyBeauty", title: "You By Sally", category: "Brand campaign", image: `${HP}/rhs-campaign-design-sally-beauty-you-by-sally-campaign.jpg`, tags: ["campaigns"] },
  { id: "sallyOS", title: "Sally Marketing OS", category: "Product design, engineering", image: `/case-studies/sally-os/heroes/hero.jpg`, href: "/case-studies/sally", tags: ["digital"] },
  { id: "jeffreyCampaign2", title: "Jeffrey NYC", category: "Campaign direction, design", image: `${HP}/rhs-interior-design-formal-modern-transitional.jpg`, tags: ["campaigns"] },
  { id: "fairviewSitting", title: "The Fairview", category: "Interior design, sitting room", image: `${HP}/rhs-interior-design-formal-modern-transitional-1.jpg`, tags: ["interiors"] },
  { id: "floorDecor", title: "Floor & Decor", category: "Interiors feature", image: `${HP}/rhs-interior-design-master-bath-urban-farmhouse.jpg`, tags: ["interiors"] },
  { id: "fairviewBedroom", title: "The Fairview Suite", category: "Interior design, bedroom", image: `${HP}/rhs-interior-design-master-bedroom-glam-luxe.jpg`, tags: ["interiors"] },
  { id: "fairviewFoyer", title: "The Fairview", category: "Interior Design, foyer", image: `${HP}/rhs-interior-design-grand-entry-luxe.jpg`, tags: ["interiors"] },
  { id: "nordstromFramework", title: "Nordstrom framework", category: "Content direction, design", image: `${HP}/Group 917.jpg`, tags: ["digital", "campaigns"] },
  { id: "lovedByNordstrom", title: "Loved by Nordstrom", category: "Brand campaign, design", image: `${HP}/rhs-campaign-design-nordstrom-loved-by-campaign.jpg`, tags: ["campaigns"] },
  { id: "mountainView", title: "Mountain View", category: "Interior design, remodel", image: `${HP}/rhs-interior-design-cabin-mid-century.jpg`, tags: ["interiors"] },
  { id: "neimanMarcus", title: "Neiman Marcus", category: "Editorial direction, design", image: `${HP}/rhs-campaign-design-neiman-marcus-editorial-design.jpg`, tags: ["campaigns"] },
  { id: "variousDesign", title: "Various design", category: "Branding, art, apparel", image: `${HP}/Mask group.jpg`, tags: ["branding"] },
];

export const categoryInfo: Record<Tag, { headline: string; body: string }> = {
  digital: {
    headline: "Digital experiences,\necommerce and apps.",
    body: "Design and code happen together. Fast prototypes, working products, AI integration when it solves a real problem. Same hands from concept through launch, whether it's a complete platform or a product page.\n\nMost brands get designed, then handed off to be built. The gap between vision and execution is where things fall apart. This work closes that gap.",
  },
  campaigns: {
    headline: "Campaign creative\nand art direction.",
    body: "Start with the fundamentals: positioning, voice, visual identity. The DNA that makes a brand recognizable across every touchpoint. Sometimes that means building the full system, sometimes a single campaign that needs to feel right. The scope changes but the attention doesn't.",
  },
  interiors: {
    headline: "Interior design\nand environments.",
    body: "Residential design from concept through construction documentation. Every room tells a story — the work is making sure it's the right one. Materials, lighting, spatial flow, and the details that make a space feel considered rather than decorated.",
  },
  branding: {
    headline: "Branding, identity\nand visual systems.",
    body: "Start with the fundamentals: positioning, voice, visual identity. The DNA that makes a brand recognizable across every touchpoint. Sometimes that means building the full system, sometimes a single mark that needs to carry everything.",
  },
};

export function getProjectsByTag(tag: Tag): Project[] {
  return projects.filter((p) => p.tags.includes(tag));
}

export function getFeaturedByTag(tag: Tag): Project[] {
  return projects.filter((p) => p.tags.includes(tag) && p.featured);
}

export function getOtherTags(tag: Tag): Tag[] {
  return (["digital", "campaigns", "interiors", "branding"] as Tag[]).filter((t) => t !== tag);
}
