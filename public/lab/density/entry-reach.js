/* ── WHERE EACH ENTRY REACHES (27 Sept 2026) ──────────────────────────
   His words: "let's stretch where each one is used - meaning something
   like finish selection is going to be ALL interior projects, colorway
   development is amber right now but it would be ARC, capitan, j
   christianson, etc. - i think there's way more overlap on these than
   not and i would like to lean towards OVER doing it rather than under".

   The index learns which studies an entry belongs to from the studies'
   own lists (their services and stacks). This file ADDS studies to
   those, never takes one away, so a study file and its page stay as he
   wrote them. A capability reaches every study where that kind of work
   plausibly happened, generously, as he asked. A tool reaches further
   only where a study's own text shows it in use (Claude Code in Faux
   Reel, Supabase in Sally Marketing OS) or where its family obviously
   runs (Adobe's apps across the interiors). Prune by deleting a key
   from a list. Keys are entry addresses without the #; studies are the
   studies' keys. */
(() => {
  const INTERIORS = ["fairview-bedroom", "hill-country-kitchen", "hill-country-bath", "hill-country-living", "floor-and-decor", "fairview-sitting", "fairview-entry", "chalet"];
  const BRANDS = ["branding-graphics", "jeffrey-ecommerce", "amber-shockey-co", "capitan-boot-co", "hill-country-oak", "j-christianson", "arc", "robert-rodriguez", "you-by-sally"];
  const CAMPAIGNS = ["ivy-park", "loved-by-nordstrom", "jeffrey-spring", "capitan-boot-co", "hill-country-oak", "cosmo-prof", "you-by-sally", "robert-rodriguez"];
  const NORDSTROM = ["nordstrom-personalization", "ivy-park", "nordstrom-framework", "loved-by-nordstrom", "nordstrom-beauty"];
  const DIGITAL = ["neiman-marcus", "nordstrom-personalization", "jeffrey-ecommerce", "ivy-park", "nordstrom-framework", "loved-by-nordstrom", "jeffrey-spring",
    "nordstrom-beauty", "cosmo-prof", "you-by-sally", "arc", "robert-rodriguez", "sally-os", "dsc", "sizzle"];
  const PRODUCTS = ["arc", "sally-os", "dsc", "sizzle"];
  const PHOTO = ["neiman-marcus", "nordstrom-personalization", "ivy-park", "jeffrey-spring", "capitan-boot-co", "nordstrom-beauty", "hill-country-oak", "cosmo-prof", "you-by-sally", "robert-rodriguez"];

  window.ENTRY_REACH = {
    /* the rooms: every interiors project */
    "cap/interior-design": INTERIORS,
    "cap/finish-selection": INTERIORS,
    "cap/finish-coordination": INTERIORS,
    "cap/fixture-selection": INTERIORS,
    "cap/fixture-sourcing": INTERIORS,
    "cap/furniture-curation": INTERIORS,
    "cap/material-selection": INTERIORS,
    "cap/material-specification": INTERIORS,
    "cap/space-planning": INTERIORS,
    "cap/construction-documentation": INTERIORS,
    "cap/art-selection": INTERIORS,

    /* brands */
    "cap/brand-identity": BRANDS,
    "cap/brand-design": BRANDS.concat(["nordstrom-framework", "loved-by-nordstrom", "ivy-park"]),
    "cap/brand-development": ["capitan-boot-co", "arc", "amber-shockey-co", "hill-country-oak", "jeffrey-ecommerce", "you-by-sally"],
    "cap/brand-system": ["capitan-boot-co", "j-christianson", "arc", "amber-shockey-co", "hill-country-oak", "nordstrom-framework", "loved-by-nordstrom", "robert-rodriguez"],
    "cap/logo-design": ["capitan-boot-co", "arc", "hill-country-oak", "amber-shockey-co", "jeffrey-ecommerce", "robert-rodriguez", "nordstrom-framework", "loved-by-nordstrom"],
    "cap/logo-system": ["j-christianson", "arc", "hill-country-oak", "nordstrom-framework"],
    "cap/colorway-development": ["j-christianson", "arc", "capitan-boot-co", "hill-country-oak", "robert-rodriguez", "you-by-sally"],
    "cap/pattern-design": ["j-christianson", "branding-graphics"],
    "cap/typography": BRANDS.concat(["black-white-type", "nordstrom-framework"]),
    "cap/typography-design": ["branding-graphics", "capitan-boot-co", "j-christianson", "nordstrom-framework", "neiman-marcus", "hill-country-oak"],
    "cap/graphic-design": BRANDS.concat(CAMPAIGNS, ["black-white-type", "neiman-marcus", "nordstrom-framework"]),
    "cap/apparel-graphics": ["branding-graphics", "j-christianson"],
    "cap/poster-design": ["black-white-type", "hill-country-oak", "robert-rodriguez", "you-by-sally"],
    "cap/product-applications": ["capitan-boot-co", "amber-shockey-co", "hill-country-oak", "you-by-sally"],
    "cap/naming": ["arc", "sizzle", "sally-os"],

    /* campaigns, photography and editorial */
    "cap/campaign-design": CAMPAIGNS,
    "cap/campaign-direction": CAMPAIGNS,
    "cap/creative-direction": CAMPAIGNS.concat(NORDSTROM, ["neiman-marcus", "jeffrey-ecommerce", "j-christianson", "amber-shockey-co", "arc"]),
    "cap/art-direction": CAMPAIGNS.concat(["jeffrey-ecommerce", "amber-shockey-co", "j-christianson", "nordstrom-beauty", "nordstrom-framework", "branding-graphics"]),
    "cap/photo-direction": PHOTO,
    "cap/photography-direction": PHOTO,
    "cap/product-photography-direction": ["cosmo-prof", "nordstrom-beauty", "amber-shockey-co", "you-by-sally", "sally-os", "jeffrey-ecommerce"],
    "cap/photography": ["branding-graphics"],
    "cap/photo-compositing": ["capitan-boot-co", "hill-country-oak"],
    "cap/story-development": ["jeffrey-ecommerce", "nordstrom-beauty", "ivy-park", "loved-by-nordstrom", "nordstrom-framework", "robert-rodriguez"],
    "cap/copywriting": ["sally-os", "arc", "dsc", "loved-by-nordstrom", "nordstrom-framework", "jeffrey-ecommerce", "cosmo-prof", "you-by-sally"],
    "cap/content-strategy": ["nordstrom-beauty", "nordstrom-personalization", "loved-by-nordstrom", "neiman-marcus", "jeffrey-ecommerce", "sally-os", "cosmo-prof"],
    "cap/editorial-design": ["nordstrom-beauty", "jeffrey-ecommerce", "nordstrom-framework", "loved-by-nordstrom", "nordstrom-personalization"],
    "cap/editorial-templates": ["nordstrom-framework", "loved-by-nordstrom", "cosmo-prof", "neiman-marcus"],
    "cap/email-web-templates": ["cosmo-prof", "you-by-sally", "loved-by-nordstrom", "nordstrom-framework", "nordstrom-personalization", "robert-rodriguez", "ivy-park", "sally-os", "jeffrey-ecommerce"],
    "cap/retail-signage": ["robert-rodriguez", "loved-by-nordstrom", "sally-os", "hill-country-oak", "branding-graphics"],

    /* digital and product */
    "cap/digital-design": DIGITAL,
    "cap/visual-design": DIGITAL,
    "cap/ux-design": ["arc", "sally-os", "dsc", "sizzle", "jeffrey-ecommerce", "cosmo-prof", "ivy-park", "nordstrom-personalization", "neiman-marcus"],
    "cap/ux-architecture": ["nordstrom-framework", "arc", "sally-os", "dsc", "cosmo-prof", "nordstrom-beauty"],
    "cap/experience-design": ["arc", "sally-os", "dsc", "sizzle", "jeffrey-ecommerce", "neiman-marcus", "nordstrom-beauty", "cosmo-prof"],
    "cap/web-design": ["jeffrey-ecommerce", "neiman-marcus", "ivy-park", "nordstrom-beauty", "cosmo-prof", "nordstrom-personalization", "arc", "you-by-sally", "loved-by-nordstrom", "nordstrom-framework"],
    "cap/ecommerce-design": ["ivy-park", "nordstrom-beauty", "cosmo-prof", "neiman-marcus", "nordstrom-personalization", "loved-by-nordstrom"],
    "cap/digital-strategy": ["nordstrom-framework", "nordstrom-personalization", "sally-os", "cosmo-prof", "ivy-park", "arc", "dsc"],
    "cap/design-systems": ["cosmo-prof", "you-by-sally", "nordstrom-beauty", "arc", "dsc", "jeffrey-ecommerce"],
    "cap/product-design": ["ivy-park"],
    "cap/product-management": PRODUCTS,
    "cap/engineering": PRODUCTS,
    "cap/engineering-ai-assisted": PRODUCTS,
    "cap/full-stack-engineering": PRODUCTS,
    "cap/ai-integration": ["arc", "sally-os", "dsc"],
    "cap/ai-strategy": ["arc", "sally-os", "dsc"],
    "cap/go-to-market-strategy": ["dsc", "ivy-park", "jeffrey-ecommerce"],

    /* tools: where a study's own text shows it, or its family runs */
    "tool/claude-code": ["sizzle"],
    "tool/supabase": ["sally-os"],
    "tool/openai": ["arc"],
    "tool/figma": ["sally-os"],
    "tool/adobe-creative-suite": INTERIORS,
    "tool/photoshop": ["ivy-park", "loved-by-nordstrom", "nordstrom-beauty", "nordstrom-personalization", "nordstrom-framework", "big-bend"],
    "tool/illustrator": ["nordstrom-framework", "loved-by-nordstrom", "arc"],
    "tool/indesign": ["j-christianson", "black-white-type"],
  };

  /* ── SEE ALSO (27 Sept, his "yes, try the locators and see also"). An
     index's cross-references: an entry names the ones worth reading
     next. These are chosen, AI first where the work is; every other
     entry is given the ones that share the most of its studies (the
     page computes those), up to four in all. ── */
  window.ENTRY_SEE = {
    "tool/claude-code": ["cap/engineering-ai-assisted", "tool/claude", "cap/full-stack-engineering"],
    "cap/engineering-ai-assisted": ["tool/claude-code", "cap/ai-integration", "cap/full-stack-engineering"],
    "tool/claude": ["tool/claude-code", "cap/ai-strategy", "tool/gemini"],
    "tool/gemini": ["tool/claude", "tool/supabase-pgvector", "tool/perplexity"],
    "tool/openai": ["tool/openai-vision-api", "tool/perceptron-mk1", "tool/claude"],
    "tool/openai-vision-api": ["tool/perceptron-mk1", "tool/openai", "cap/ai-integration"],
    "tool/perceptron-mk1": ["tool/openai-vision-api", "cap/ai-integration", "fig/4-hours"],
    "tool/perplexity": ["fig/two-week", "tool/gemini", "tool/claude"],
    "tool/supabase-pgvector": ["tool/supabase", "tool/gemini"],
    "tool/supabase": ["tool/supabase-pgvector", "tool/vercel", "tool/python"],
    "tool/model-context-protocol": ["tool/claude-chatgpt", "cap/ai-integration", "tool/oauth-2-0"],
    "tool/claude-chatgpt": ["tool/model-context-protocol", "cap/ai-integration"],
    "cap/ai-strategy": ["cap/ai-integration", "tool/claude", "cap/product-management"],
    "cap/ai-integration": ["cap/ai-strategy", "tool/model-context-protocol", "tool/perceptron-mk1"],
    "fig/2-000-stores": ["cap/ai-strategy", "fig/three-minutes", "fig/four-months"],
    "fig/three-minutes": ["fig/four-channels", "fig/two-week", "cap/ai-strategy"],
    "fig/four-channels": ["fig/three-minutes", "cap/copywriting"],
    "fig/two-week": ["tool/perplexity", "fig/three-minutes"],
    "fig/four-months": ["cap/ai-strategy", "tool/claude-code", "fig/2-000-stores"],
    "fig/4-hours": ["fig/64-96-hours", "tool/perceptron-mk1", "tool/openai-vision-api"],
    "fig/64-96-hours": ["fig/4-hours", "fig/40-hours"],
    "cap/interior-design": ["cap/finish-selection", "cap/material-selection", "tool/sketchup"],
    "cap/finish-selection": ["cap/finish-coordination", "cap/material-selection", "cap/fixture-selection"],
  };
})();
