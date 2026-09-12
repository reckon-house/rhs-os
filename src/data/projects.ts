/* The lines a study can sit on. "branding" was carved out of
   "creative" in Sept 2026: campaigns run and end, a mark gets stamped
   into leather and worn for years, and a list holding both read as one
   thing. Apps is not here — it is the one shelf the corpus cannot
   separate by tag, so it is written down in rail-categories.ts. */
export type Tag = "digital" | "creative" | "branding" | "interiors";

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
  /* ── The three fields the homepage deal needs ──────────────────────
     These used to live in a second thirty-row list inside the lab,
     which the port carried into pressingHomeDriver.js as its own
     `WORK`. Two lists of the same thirty projects, in different
     orders, and only one of them carrying these — which is why a tile
     could be pinned to 0.86 on the homepage and dealt 0.33 in the
     footer of a case study. The port builds WORK from this file now,
     so there is one list. */
  /** What the brain matches against. Never shown: it is the searchable
   *  text for a picture, so a question about "marble" or "sputnik
   *  chandelier" can reach the tile that shows one. */
  keywords?: string;
  /** An authored share of the row, overriding the dealt tier. For a
   *  picture the deal hands a stamp it cannot survive — a full
   *  homepage on a laptop screen is a smudge at 175px. */
  size?: number;
  /** Percent of the frame the crop may drift off-centre. The CSS
   *  default is 16; a lower number holds a composition that cannot
   *  afford to wander. */
  drift?: number;
}

const HP = "/case-studies/hp";

/* ── THE ONE LIST ────────────────────────────────────────────────────
 * Ordered as the homepage deals it. That order is editorial and it is
 * load-bearing: the width ladder assigns each frame a tier by its flat
 * position, so moving a row re-sizes its neighbours.
 *
 * Read by the homepage (through the generated driver, which the port
 * builds from this file), the ring in every other page's footer, the
 * category pages, the sitemap and the share cards.
 */
export const projects: Project[] = [
  { id: "sallyOS", title: "Sally Marketing OS", category: "Product design, engineering", image: `${HP}/rhs-sally-os-asset-hub-laptop.jpg`, href: "/case-studies/sally", tags: ["digital"], keywords: "sally os platform hero", drift: 4 },
  { id: "ivyPark", title: "Ivy Park by Beyoncé", category: "Ecommerce, brand launch", image: `${HP}/rhs-ivy-park-beyonce-digital-brand-launch.jpg?v=3`, href: "/case-studies/ivy-park", tags: ["digital", "creative"], featured: true, keywords: "ivy park nordstrom laptop brand experience mockup" },
  { id: "arc", title: "A.R.C. - AI Home Inventory", category: "App & brand development", image: `${HP}/rhs-arc-app-project-select-phone.jpg`, href: "/case-studies/arc", tags: ["digital", "branding"], featured: true, keywords: "arc app kitchen project selection lifestyle" },
  { id: "hillKitchen", title: "Hill Country home", category: "Interior design, kitchen", image: `${HP}/rhs-interior-design-kitchen-modern-meets-vintage.jpg?v=3`, href: "/case-studies/hill-country-kitchen", tags: ["interiors"], featured: true, keywords: "hill country kitchen island pendants marble wide", size: 0.64 },
  { id: "robertRod", title: "Robert Rodriguez x Neiman’s", category: "Creative direction, design", image: `${HP}/rhs-robert-rodriguez-storefront-window.jpg`, href: "/case-studies/robert-rodriguez", tags: ["digital", "creative", "branding"], featured: true, keywords: "neiman marcus robert rodriguez woman cream polka dot dress pink blazer orange yellow backdrop storefront window display campaign", drift: 4 },
  { id: "nordstromPersonal", title: "Nordstrom personalization", category: "Design system, direction", image: `${HP}/rhs-nordstrom-personalization-laptop.jpg`, href: "/case-studies/nordstrom-personalization", tags: ["digital", "creative"], keywords: "the personalized nordstrom homepage open on a laptop", size: 0.86, drift: 4 },
  { id: "dsc", title: "Dallas Sport Collective", category: "Website, custom app", image: `${HP}/rhs-dallas-sport-collective-laptop-stool.jpg`, href: "/case-studies/dsc", tags: ["digital"], keywords: "dsc marketing site laptop hero", drift: 4 },
  { id: "capitanBoot", title: "Capitan Boot Co.", category: "Branding, design", image: `${HP}/rhs-capitan-boot-co-branding.jpg?v=3`, href: "/case-studies/capitan-boot-co", tags: ["creative", "branding"], keywords: "capitan boot co western original desert landscape cattle skull logo prickly pear cactus agave plants arid mountains branding campaign" },
  { id: "sizzle", title: "Faux Reel", category: "Product design, motion", image: "/images/thumbnails/sizzle.jpg", ogImage: "/og-faux-reel.jpg", href: "/case-studies/sizzle", tags: ["digital"], keywords: "sizzle" },
  { id: "nordstromFramework", title: "Nordstrom framework", category: "Content direction, design", image: `${HP}/rhs-nordstrom-framework-on-our-list.jpg`, href: "/case-studies/nordstrom-framework", tags: ["digital", "creative"], keywords: "hero1", size: 0.53 },
  { id: "hillBath", title: "Hill Country home", category: "Interior design, primary bath", image: `${HP}/rhs-interior-design-hill-country-primary-bath.jpg?v=3`, href: "/case-studies/hill-country-bath", tags: ["interiors"], keywords: "hill country bath vanity marble globe sconces sage", size: 0.86 },
  { id: "nordstromBeauty", title: "Nordstrom beauty", category: "Digital design, personalized", image: `${HP}/rhs-nordstrom-beauty-hub-laptop.jpg`, href: "/case-studies/nordstrom-beauty", tags: ["digital", "creative"], keywords: "nordstrom beauty hub laptop homepage mockup", size: 0.43 },
  { id: "oakworks", title: "Hill Country Oakworks", category: "Campaign direction, branding", image: `${HP}/rhs-hill-country-oakworks-billboard.jpg`, href: "/case-studies/hill-country-oak", tags: ["creative", "branding"], keywords: "hill country oakworks outdoor banner whiskey barrels colorful background tree texas born oakcraft" },
  { id: "cosmoProf", title: "Cosmo Prof", category: "Digital design, creative direction", image: `${HP}/rhs-cosmo-prof-website-design-digital-rebrand.jpg?v=3`, href: "/case-studies/cosmo-prof", tags: ["digital", "creative"], keywords: "cosmo prof photography direction hair color brushes product detail quad composition" },
  { id: "jeffreyNyc", title: "Jeffrey NYC", category: "Ecommerce, web design", image: `${HP}/rhs-jeffrey-ecommerce-laptop.jpg`, href: "/case-studies/jeffrey-ecommerce", tags: ["digital", "branding"], keywords: "the jeffrey homepage open on a laptop, saint laurent spring summer shoes", drift: 4 },
  { id: "bwType", title: "Black & white type", category: "Custom typography, patterns", image: `${HP}/rhs-campaign-design-typography-black-white-custom-patterns.jpg?v=3`, href: "/case-studies/black-white-type", tags: ["branding"], keywords: "typography patterns the fancy poster wood surface lifestyle" },
  { id: "hillLiving", title: "Hill Country home", category: "Interior design, living room", image: `${HP}/rhs-interior-design-livingroom-interior.jpg?v=3`, href: "/case-studies/hill-country-living", tags: ["interiors"], keywords: "hill country living cognac leather sofa tweed armchairs limestone fireplace pendant chandelier wide", size: 0.74 },
  { id: "jChristianson", title: "J. Christianson", category: "Brand development, design", image: `${HP}/rhs-campaign-design-j-christianson-branding.jpg?v=3`, href: "/case-studies/j-christianson", tags: ["branding"], keywords: "j christianson storefront tree stripe window mockup" },
  { id: "amberShockey", title: "Amber Shockey & Co.", category: "Tableware design, branding", image: `${HP}/rhs-campaign-design-amber-shockey-blue-plate.jpg`, href: "/case-studies/amber-shockey-co", tags: ["creative", "branding"], keywords: "amber shockey co blue florals peony wallpaper pattern field" },
  { id: "sallyBeauty", title: "You By Sally", category: "Brand campaign", image: `${HP}/rhs-you-by-sally-street-display.jpg`, href: "/case-studies/you-by-sally", tags: ["digital", "creative"], keywords: "hero", drift: 4 },
  { id: "fairviewSitting", title: "The Fairview", category: "Interior design, sitting room", image: `${HP}/rhs-interior-design-formal-modern-transitional-1.jpg?v=3`, href: "/case-studies/fairview-sitting", tags: ["interiors"], keywords: "fairview sitting stacked stone fireplace charcoal velvet swivels brass coffee table" },
  { id: "floorDecor", title: "Floor & Decor", category: "Interiors feature", image: `${HP}/rhs-interior-design-master-bath-urban-farmhouse.jpg?v=3`, href: "/case-studies/floor-and-decor", tags: ["interiors"], keywords: "urban southwest primary bath exposed brick matte black soaking tub" },
  { id: "fairviewBedroom", title: "The Fairview Suite", category: "Interior design, bedroom", image: `${HP}/rhs-interior-design-master-bedroom-glam-luxe.jpg?v=3`, href: "/case-studies/fairview-suite", tags: ["interiors"], keywords: "fairview suite bedroom chandelier fireplace windows wide" },
  { id: "fairviewFoyer", title: "The Fairview", category: "Interior Design, foyer", image: `${HP}/rhs-interior-design-grand-entry-luxe.jpg?v=3`, href: "/case-studies/fairview-entry", tags: ["interiors"] },
  { id: "jeffreyCampaign", title: "Jeffrey Spring Campaign", category: "Creative direction, design", image: `${HP}/rhs-jeffrey-spring-campaign-laptop.jpg`, href: "/case-studies/jeffrey-spring", tags: ["digital", "creative"], keywords: "the jeffrey homepage open on a laptop resting on a pink chair", drift: 4 },
  { id: "lovedByNordstrom", title: "Loved by Nordstrom", category: "Brand campaign, design", image: `${HP}/rhs-loved-by-nordstrom-ipad.jpg`, href: "/case-studies/loved-by-nordstrom", tags: ["digital", "creative"], keywords: "loved by nordstrom gallery wall campaign tiles tibi center", size: 0.4 },
  { id: "mountainView", title: "Mountain View", category: "Interior design, remodel", image: `${HP}/rhs-interior-design-cabin-mid-century.jpg?v=3`, href: "/case-studies/chalet", tags: ["interiors"], keywords: "chalet living room a frame glass doors malm fireplace sputnik chandelier" },
  { id: "neimanMarcus", title: "Neiman Marcus", category: "Editorial direction, design", image: `${HP}/rhs-neiman-marcus-editorial-design-fashion-spreads.jpg`, href: "/case-studies/neiman-marcus", tags: ["digital", "creative"], keywords: "neiman marcus editorial fashion magazine spreads the rocker rainbow rose flora maxi derek lam glam rock" },
  { id: "variousDesign", title: "Various design", category: "Branding, art, apparel", image: `${HP}/rhs-various-design-branding-graphics-prints-apparel.jpg`, href: "/case-studies/branding-graphics", tags: ["creative", "branding"], keywords: "branding graphics prints florals hot air balloon letterform fashion illustration apparel" },
  { id: "bigBend", title: "West Texas", category: "Landscape photography", image: "/case-studies/big-bend/hero.jpg", href: "/case-studies/big-bend", tags: ["creative"], keywords: "chisos peak cactus" },
];



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

export function getFeaturedByTag(tag: Tag): Project[] {
  return projects.filter((p) => p.tags.includes(tag) && p.featured);
}

