/* ── THE HOMEPAGE LINES (27 Sept 2026) ────────────────────────────────
   His words: "it's like it needs a specific homepage pass leading the
   user into the case study itself. i dont think a verbatim pull from the
   case is going to work", and on Perceptron Mk1, "says nothing about Mk1,
   what the model does and why i used it".

   So an entry of the index can carry one line written for the homepage:
   what the thing is, and why it is in the work, leading into the studies
   its shelf stacks under it. Where an entry has a line, the shelf's head,
   the next-entry panel at a shelf's foot, and index E's large figures use
   it in place of the sentence pulled from a study. Where it has none, the
   pull still shows. The first sentence is set in ink and the rest in grey,
   as a study's lead is.

   Every line here is a DRAFT for his edit until he says otherwise. The
   facts in them come only from the studies and About, never from outside:
   no outcome, number or reason a study does not state. Keys are the
   entry's address without the # (fig/…, tool/…, cap/…, line/…).

   A line ties its entry back to what the work solved (27 Sept, his "for
   'figures' - to make them really make sense can we relate them back to
   what the project solved or did, ya know? that extra bit of context
   really sells it", then "do the same pass for tools and capabilities"):
   the ink sentence says the problem (what a number measured, what a tool
   was up against, what a project asked of a skill), the grey one what was
   built and what changed, each from the study's own words, quoted in a
   comment above the line. An entry whose study names no problem (a build
   timeline, a career fact, a tool only listed) stays plain. The rule is
   kept in CLAUDE.md too, so new work gets the same.

   The six lines (What I make) have no line here on purpose: their shelves
   keep the board's short sentence, "Native tools and AI products, built
   end to end." (27 Sept, a problem-first pass on them was tried, then his
   "actually i think them being shorter they way they were at first is
   better").

   To change a line, change the words; to take one away, delete it. */
window.ENTRY_LINES = {
  /* A.R.C.: "using Perceptron's Mk1 model to read the physical world from
     footage. Mk1 reasons across frames, tracks objects through space, and
     picks up the spatial context a single photo misses." */
  /* what it answered: A.R.C.: "picks up the spatial context a single photo misses"; "Video scanning runs on Perceptron's Mk1 model: sweep a room and Mk1 reasons across the footage in real time" */
  "tool/perceptron-mk1": "A single photo misses a lot of what's around it, so A.R.C.'s video scan runs on Perceptron's Mk1. Sweep a room with your phone and the model reasons across the footage in real time.",

  /* Robert Rodriguez x Neiman's: "shot in one day and run across social,
     email, the stores, and editorial"; "Four photographs, one typeface
     family, and a color field make up the campaign. Every piece is some mix
     of those three" */
  /* what it answered: Robert Rodriguez: "shot in one day and run across social, email, the stores, and editorial" */
  "fig/four-photographs": "The Robert Rodriguez campaign for Neiman Marcus had one studio day to cover social, email, the stores and editorial. Every piece is some mix of four photographs, one typeface family and a color field.",

  /* the two studies this figure stacks: the Hill Country kitchen ("Sage
     green is on most of what you see, raw white oak adds warmth, Calacatta
     marble runs the counters and the backsplash, and unlacquered brass is
     on the pulls, the knobs, and the faucet") and the Fairview sitting room
     ("The sitting room's palette is four materials: stone, velvet, brass
     and warm oak") */
  /* what it answered: Kitchen: "Four materials, picked before the first cabinet was drawn, cover every cabinet face, countertop, and piece of hardware in the Hill Country kitchen" */
  "fig/four-materials": "Every cabinet face, countertop and piece of hardware in the Hill Country kitchen comes from four materials picked before the first cabinet was drawn: sage green, white oak, marble and brass. The Fairview sitting room keeps to four of its own: stone, velvet, brass and warm oak.",

  /* About: "I spent eight years at Nordstrom, where I worked with engineering
     to roll out a new CMS ... At Nordstrom the new CMS saved $3M over four years." */
  "fig/3m": "The new CMS at Nordstrom saved $3M over four years. I worked with engineering to roll it out.",

  /* Sally Marketing OS: "It has 2,000+ stores with regional variation and
     runs dozens of campaigns at once"; "I design, build, and maintain the
     Sally Beauty Marketing OS from inside the team that uses it." About:
     "a marketing platform I came up with and built at Sally Beauty" */
  "fig/2-000-stores": "Sally Beauty has 2,000+ stores with regional variation, and it runs dozens of campaigns at once. I design, build and maintain the platform behind those campaigns, Sally Marketing OS, from inside the team that uses it.",
  /* what it answered: Sally design system: "Nobody knows color like Sally: 8,000+ shades and real chemistry"; "Crack the code and the wall of boxes makes sense"; "The Color Authority teaches the shade code before it sells a box" */
  "fig/8-000": "Sally carries 8,000+ shades, and the wall of boxes only makes sense once you can read the code on them. The Color Authority homepage teaches the level and the tone first, then sells the box.",

  /* A.R.C.: the whole-home dashboard, "$49,630 documented across 8 rooms and
     73 items"; A.R.C. "compares what you have documented against your
     policy limit and shows the gap as a dollar amount." */
  "fig/49-630": "The home on A.R.C.'s dashboard adds up to $49,630. Eight rooms and 73 items are documented, and A.R.C. sets that total against your policy limit and shows the gap in dollars.",

  /* Ivy Park: "The website went from moodboard to live in six weeks";
     "95% of the product sold out within days." */
  "fig/95": "Ivy Park by Beyoncé went live at Nordstrom six weeks after the first moodboard, and 95% of the product sold out within days.",

  /* ── TOOLS (drafted 27 Sept, after his "these read right - draft the
     rest, tools next"). What the tool is, then where it is in the work.
     A tool a study only lists gets where it shows up, never a reason the
     study does not give. The counts are the studies that list it. ── */
  "tool/adobe-creative-suite": "Adobe's design apps show up across the interiors work, from the Fairview suite to the Mountain View chalet.",
  /* Nordstrom personalization: "The tiles resized for every screen, so one
     picture could be used many ways"; "The tiles all drew their pictures
     from one library." */
  /* what it answered: Nordstrom personalization: "Nordstrom's personalized homepages were all built on three tile shapes"; "The tiles all drew their pictures from one library"; "The tiles resized for every screen, so one picture could be used many ways". The millions-of-customers problem is cap/design-systems' */
  "tool/asset-library": "Nordstrom's personalized homepages were built on tiles that all drew their pictures from one asset library. The tiles resized for every screen, so one picture could be used many ways.",
  /* what it answered: his note, 27 Sept: "autocad is indutry standard" */
  "tool/autocad": "AutoCAD is the industry standard for drawings, so it's where every room here gets drawn. It's in all eight interiors projects, from the Hill Country house to the Mountain View chalet.",
  /* Branding, Print & Apparel: "with a film camera for the photography".
     The 4x6 storefront is fig/4x6's. */
  "tool/camera": "The photography in Branding, Print & Apparel was shot on a film camera.",
  /* Robert Rodriguez: "Four photographs, one typeface family, and a color
     field make up the campaign." */
  /* what it answered: Robert Rodriguez lists Capture One in its stack and names no job for it, so the line stays plain: "A spring campaign for Neiman Marcus, shot in one day" */
  "tool/capture-one": "Capture One is software for shooting and editing photographs. It was used on Neiman Marcus's Robert Rodriguez campaign, a spring shoot done in one studio day.",
  /* Sally OS: "Claude runs the chat and gets the reasoning jobs: turning
     competitive signals into recommendations, drafting the campaign brief
     from raw intel, writing copy in the brand voice." */
  /* what it answered: Sally OS: "Tracking competitors was all manual"; "The information was all there, spread across people and formats, and nobody had pulled it together" */
  "tool/claude": "Sally Beauty used to track competitors by hand, and what it knew was spread across people and formats. In Sally Marketing OS, Claude gets the reasoning jobs: turning competitive signals into recommendations, drafting the campaign brief and writing copy in the brand voice.",
  /* DSC: "athletes can paste one URL into the AI they already use, whether
     that's Claude, ChatGPT or Gemini, and ask it what's on their schedule,
     which trainer fits a goal, or to book Friday at 10am" */
  /* what it answered: DSC: "An athlete never has to open the app"; "paste one URL into the AI they already use" */
  "tool/claude-chatgpt": "Dallas Sport Collective's athletes can book a session without opening the gym's app. They paste one URL into the AI they already use, whether that's Claude, ChatGPT or Gemini, and ask what's on their schedule, which trainer fits a goal, or to book Friday at 10am.",
  /* A.R.C.: "Claude Code was my main environment from start to finish."
     Sally OS: "Claude Code was my development environment for all of it."
     About: "Claude Code is this site's CMS, design tool and build
     environment at once."
     Dallas Sport Collective, in his words (2 Oct 2026): "DSC is also a
     claude code project." */
  /* what it answered: A.R.C.: "Claude Code was my main environment from start to finish"; Faux Reel: "Faux Reel took a day to build with Claude Code"; About: "Claude Code is this site's CMS, design tool and build environment at once"; DSC, his word: "DSC is also a claude code project" */
  "tool/claude-code": "Claude Code is Anthropic's coding agent, and it's where I build: A.R.C. end to end, Sally Marketing OS, Dallas Sport Collective and Faux Reel, which took a single day. It's also this site's CMS, design tool and build environment at once.",
  /* Faux Reel: "The whole reel runs in one box on the page, with CSS
     animation and no video file anywhere"; "The finished web component
     weighs 4.8KB gzipped" */
  /* what it answered: Faux Reel: "Faux Reel skips the footage and runs a stack of still photographs through fourteen transition types: wipes, blinks, a burn"; "The whole reel runs in one box on the page, with CSS animation and no video file anywhere". The sizzle-reel problem and the 4.8KB are fig/4-8kb's */
  "tool/css": "Faux Reel takes a stack of still photographs through fourteen transition types, like wipes, blinks and a burn. The whole reel runs in one box on the page, with CSS animation and no video file anywhere.",
  /* Ivy Park: "The Ivy Park page needed components Nordstrom's CMS didn't
     have: parallax modules, animated polygon masks, full-bleed video that
     played on scroll"; "The custom CMS components built for the project
     went into Nordstrom's shared library and powered other launches for
     two years." */
  "tool/custom-components": "Ivy Park's launch page needed components Nordstrom's CMS didn't have, like parallax modules, animated polygon masks and video that played on scroll. They got built for the launch, then went into Nordstrom's shared library.",
  /* Loved by Nordstrom's own lead */
  /* what it answered: Loved by Nordstrom: "a Nordstrom mandate to lift smaller designer labels on the department store floor and the digital storefront at the same time. The answer was to borrow the heart icon from Instagram"; "Liked and Loved used the same icon and typography, so the merchandising team could raise or lower a brand's priority without touching the design" */
  "tool/editorial-systems": "Nordstrom wanted its smaller designer labels lifted in stores and online at once, so Loved by Nordstrom borrowed Instagram's heart icon. The day-to-day tiles got \"Liked\" and the hero slots got \"Loved\", so merchandising could raise or lower a brand's priority without touching the design.",
  /* About: "writes and designs the emails, web assets and signage, and
     delivers them into Figma through a plugin I wrote" */
  /* what it answered: About: "writes and designs the emails, web assets and signage, and delivers them into Figma through a plugin I wrote" */
  "tool/figma": "Sally Marketing OS writes and designs the emails, web assets and signage, then delivers them into Figma through a plugin I wrote. The Cosmo Prof refresh was designed there too.",
  /* West Texas: "a family trip through Big Bend and the desert around
     Marfa". The backdrops are cap/photography's. */
  "tool/fuji-x-t30-35mm-prime": "A Fuji X-T30 with a 35mm lens took the West Texas photographs, on a family trip through Big Bend and around Marfa.",
  /* Various design (Branding, Print & Apparel): "hand-drawn type where a
     piece called for it"; "the pop artist's sleeve has grunge compositing
     and hand-drawn type" */
  "tool/hand-rendering": "Branding, Print & Apparel spans about ten years of album covers, posters and logos, and type was drawn by hand wherever a piece called for it. The pop artist's album sleeve pairs it with grunge compositing.",
  /* Nordstrom beauty: "where every story is shoppable" */
  /* what it answered: Ivy Park: "its launch page had to be the store, the lookbook and the campaign at the same time" */
  "tool/html-css-js": "Ivy Park's launch page had to be the store, the lookbook and the campaign at the same time. That page and Nordstrom's beauty hub were both built in HTML, CSS and JavaScript.",
  /* what it answered: nothing. Illustrator is only listed, in the stacks of Capitan Boot Co., J. Christianson, Branding, Print & Apparel and others ("Most of the work was done in Photoshop, Illustrator, and InDesign"); no study says what was drawn in it, so the line stays plain */
  "tool/illustrator": "Illustrator is Adobe's vector drawing app. It shows up across these projects, from the brands for Capitan Boot Co. and J. Christianson to Branding, Print & Apparel.",
  /* what it answered: nothing. InDesign is only listed, in the stacks of Hill Country Oakworks, Neiman Marcus and others ("InSite was Neiman Marcus's digital editorial hub"), so the line stays plain */
  "tool/indesign": "InDesign is Adobe's layout app. It shows up across these projects, from the Hill Country Oakworks campaign to InSite, Neiman Marcus's editorial hub.",
  /* Jeffrey NYC: "every interaction from wireframe to checkout was prototyped" */
  /* what it answered: Jeffrey New York: "Jeffrey had never sold online. The store itself was closer to a gallery than a shop"; "every interaction from wireframe to checkout was prototyped" */
  "tool/invision": "Jeffrey New York had never sold online, and its store felt more like a gallery than a shop. Every interaction on its first site, from wireframe to checkout, was prototyped in InVision before it was built.",
  /* DSC: "an MCP server with eleven tools"; "The MCP server reads the same
     trainer profiles athletes see in the app, so a connected AI describes a
     coach from the actual record" */
  /* what it answered: DSC: "An athlete's AI can only ever request a booking"; "paste one URL into the AI they already use"; "it reads their real schedule and can put in a session request"; "Eleven tools on the MCP server cover the gym overview, the program list, trainer profiles and availability"; "any change the AI asks for waits as a pending request until the owner approves it" */
  "tool/model-context-protocol": "Dallas Sport Collective's athletes can book through their own AI, but the AI can only ever put in a request. The gym's MCP server gives it eleven tools that read the real schedule and trainer profiles, and every change waits until the owner approves it.",
  /* Sally OS: "The asset hub, the associate site, and the scoreboard are
     Next.js on Vercel." DSC: "Next.js on Vercel" */
  /* what it answered: his note, 27 Sept: "next.js and vercel being so flexible of a modern hostion application option". DSC: "Built: Marketing site, scheduling platform, MCP server"; "Stack: Next.js on Vercel" */
  "tool/next-js": "A marketing site, a booking platform and an asset hub are very different builds, and Next.js is flexible enough to be the base for all of them. It runs Dallas Sport Collective and Sally Marketing OS's asset hub, associate site and scoreboard.",
  /* Nordstrom CMS is in the stack of Ivy Park, Nordstrom beauty and
     Nordstrom personalization */
  /* what it answered: About: "At Nordstrom the new CMS saved $3M over four years". The three studies list "Nordstrom CMS" and none says it is the new one, so the line keeps the two apart */
  "tool/nordstrom-cms": "At Nordstrom I worked with engineering to roll out a new CMS, and it saved $3M over four years. Ivy Park's launch page, the beauty hub and the personalized homepages all used Nordstrom's CMS.",
  /* DSC: "OAuth 2.0 consent and short-lived tokens" */
  /* what it answered: DSC: "Connecting an AI runs through an OAuth consent screen with short-lived, rotating tokens, and access can be revoked from the dashboard in one tap" */
  "tool/oauth-2-0": "Athletes connect their own AI to Dallas Sport Collective's schedule through an OAuth 2.0 consent screen. The tokens are short-lived and rotating, and access can be revoked from the dashboard in one tap.",
  /* Sally OS: "OpenAI's GPT-Image-2 for studio photography"; "two passes
     through OpenAI's GPT-Image-2" */
  /* what it answered: A.R.C.: "Home inventory apps ask you to type every item in by hand" */
  "tool/openai": "Home inventory apps make you type every item in, so A.R.C. uses OpenAI's Vision API to read the photographs instead. Sally Marketing OS gets its studio photography from GPT-Image-2.",
  /* A.R.C.: "returns a structured read: what the object is, what it is
     made of, its style, its condition, and a rough era or manufacture
     period"; "Each identified object is matched against market replacement
     data." No problem is stated for this step, so the line stays plain. */
  "tool/openai-vision-api": "A.R.C. sends each photograph to the OpenAI Vision API, which reads what the object is, what it's made of, its style, its condition and roughly how old it is. Then each item is matched against market replacement data.",
  /* Sally OS: "Perplexity runs live web search"; "mention Ulta, Sephora,
     or Target Beauty and it pulls current pricing, promotions, social
     activity, and press coverage into the conversation" */
  /* Sally OS: "Perplexity runs live web search"; "mention Ulta, Sephora, or Target Beauty and it pulls current pricing, promotions, social activity, and press coverage into the conversation". No problem left here: the two-week one is fig/two-week's */
  "tool/perplexity": "Sally Marketing OS uses Perplexity for live web search. When a competitor like Ulta, Sephora or Target Beauty comes up, Perplexity pulls its current pricing, promotions and press coverage into the conversation.",
  /* Loved by Nordstrom: "The template used whatever photography a brand
     had already licensed"; "Photography from a 1080-square social post
     scaled up to a 1440-wide web hero with a crop spec and no new art
     direction." */
  "tool/photography-licensing": "Loved by Nordstrom's template used whatever photography a brand had already licensed. A crop spec scaled it from a social post up to a web hero, with no new art direction.",
  /* the most-listed tool: twelve studies */
  /* what it answered: nothing. Photoshop is only listed (Robert Rodriguez's stack; Branding, Print & Apparel: "Most of the work was done in Photoshop, Illustrator, and InDesign"), and no study says the layering was done in it, so the line stays plain */
  "tool/photoshop": "Photoshop is in more of these projects than any other tool, from the album covers and posters in Branding, Print & Apparel to the Robert Rodriguez campaign for Neiman Marcus.",
  "tool/playwright": "Playwright drives a real browser from code. Faux Reel, the tool that turns still photographs into a sizzle reel, uses it.",
  /* Sally OS: "a single-page app in plain HTML and JavaScript on a Python
     server, hosted on Railway. It has no framework and no build step on
     purpose". A.R.C.: "a Python backend and a Streamlit frontend" */
  "tool/python": "Python runs A.R.C.'s backend and the server behind Sally Marketing OS's portal. The portal itself is plain HTML and JavaScript, with no framework and no build step.",
  "tool/railway": "Railway is a hosting platform for apps and servers. Sally Marketing OS's portal runs on it.",
  /* Faux Reel's own lead: "just stills cut fast enough to look like motion" */
  "tool/react": "React is a library for building interfaces. It's part of Faux Reel, where still photographs are cut fast enough to look like motion.",
  "tool/sketch": "Sketch is a design app for screens. It was used on Jeffrey New York's first online store and on the Cosmo Prof refresh.",
  /* Floor & Decor: "three bathrooms"; "All three rooms use the same
     marble, dolomite, white oak and classic tile." */
  "tool/sketchup": "SketchUp is a 3D modeling app for rooms. Every one of the eight interiors projects uses it, from the Fairview suite to Floor & Decor's three bathrooms.",
  /* A.R.C.: "A.R.C. runs on a Python backend and a Streamlit frontend,
     deployed on Vercel." */
  "tool/streamlit": "Streamlit turns Python into a web app. It's A.R.C.'s frontend, on a Python backend deployed on Vercel.",
  /* Jeffrey Spring: "shot entirely in the studio"; "foliage doing the work
     of a location". You By Sally: "real people instead of models" */
  /* what it answered: Jeffrey spring: "Jeffrey needed a spring campaign that looked like it had been shot on location, on a studio budget" */
  "tool/studio-photography": "Jeffrey needed a spring campaign that looked like location work on a studio budget. The whole thing was made indoors, with monstera leaves and palm fronds cropped big enough to stand in for a place.",
  /* Sally OS: "An admin review dashboard updates live over Supabase Realtime." */
  "tool/supabase": "Supabase is a database platform built on Postgres. It holds the data for A.R.C., and in Sally Marketing OS an admin dashboard updates live over it.",
  /* Sally OS: "pgvector for a single embedding index that covers documents,
     product photography, and video scenes at once, so one search runs
     across text and pictures" */
  /* what it answered: Sally OS: "Supabase holds all of it, with pgvector for a single embedding index that covers documents, product photography, and video scenes at once, so one search runs across text and pictures." No problem is stated for pgvector, so the line stays plain */
  "tool/supabase-pgvector": "In Sally Marketing OS, Supabase holds the data, and pgvector gives it a single embedding index over documents, product photography and video scenes, so one search runs across text and pictures.",
  "tool/typescript": "TypeScript is JavaScript with types. It's part of Faux Reel, which builds a sizzle reel out of still photographs.",
  /* what it answered: his note, 27 Sept: "next.js and vercel being so flexible of a modern hostion application option" */
  "tool/vercel": "Vercel is a flexible, modern way to host an app. A.R.C., Dallas Sport Collective and Sally Marketing OS's asset hub, associate site and scoreboard all deploy on it.",
  /* Sally OS: "Gemini loads Sally's internal knowledge base at the start of
     every conversation: the brand guidelines, campaign history, product
     catalogs, regional variations, and performance data." */
  /* what it answered: Sally OS: "Loading Sally's knowledge base takes a million-token context window, which Gemini has"; "Gemini loads Sally's internal knowledge base at the start of every conversation" */
  "tool/gemini": "Sally's whole knowledge base needs a million-token context window, which Gemini has. In Sally Marketing OS, Gemini loads it at the start of every conversation, so the brand guidelines, campaign history, product catalogs and performance data are already there.",

  /* ── FIGURES (drafted 27 Sept). What the number is, where it comes from,
     and a way into the study. Figures that share one sentence in a study
     (the insurance numbers, Ivy Park's weeks, Branding, Print & Apparel)
     each lead with their own number. Lines from About speak as him. ── */
  /* About */
  /* what it answered: About: "I spent eight years at Nordstrom, where I worked with engineering to roll out a new CMS and led the redesign of the digital experience, from marketing down to the product page"; "At Nordstrom I directed a team of 27 across site, email and apps". The CMS's $3M is fig/3m's */
  "fig/eight-years": "I spent eight years at Nordstrom and led the redesign of its digital experience, from marketing down to the product page. I directed a team of 27 across site, email and apps.",
  /* what it answered: Sally OS: "Sally ships thousands of assets per month"; "I rebuilt each of those tools with AI and connected them into a single pipeline"; About: "a marketing platform I came up with and built at Sally Beauty"; "the marketing platform that a 2,000-store retailer now runs on daily" */
  "fig/2-000-store": "Sally Beauty, a 2,000-store retailer, ships thousands of marketing assets a month. I came up with Sally Marketing OS to connect the tools behind them, and the company runs on it every day.",
  /* what it answered: Ivy Park: "Ivy Park was Beyoncé's first activewear line. Nordstrom had the exclusive US partnership"; About: "led the US digital launch of Ivy Park by Beyoncé, six weeks from concept to live" */
  "fig/six-weeks": "Ivy Park, Beyoncé's first activewear line, launched in the US at Nordstrom, its exclusive partner. I led the digital launch, six weeks from concept to live.",
  "fig/1-3m": "For a couple of years I was deep in custom homes, leading interior design and selections on $1-3M builds. In 2023 Floor & Decor named me Designer of the Quarter.",
  /* About: "At Nordstrom the new CMS saved $3M over four years. Redesigning the UI and templates cut concept-to-web time 35%". HEAD's wording, kept; "in all" only lets the page split ink from grey after "$3M" */
  "fig/four-years": "Over four years, the new CMS at Nordstrom saved $3M in all. The redesigned UI and templates also cut concept-to-web time 35%.",
  /* Nordstrom framework: "Engagement lifted 22% over two years."; "Four
     buckets sort the stories on the homepage, in email, and on landing
     pages." */
  /* what it answered: Framework: "Nordstrom was producing more digital content than the site had structure for ... Customers got the whole pile and no way through it"; "Engagement lifted 22% over two years" */
  "fig/22": "Nordstrom was publishing more content than the site had structure for, and customers got the whole pile with no way through it. The framework I concepted sorted it into four named buckets, and engagement rose 22% over two years.",
  "fig/35": "Redesigning Nordstrom's UI and templates cut concept-to-web time 35%. That's the time from an idea to a live page.",
  "fig/27": "At Sally Beauty and CosmoProf I built the in-house creative teams and a new operating model. Execution efficiency went up 27%.",
  "fig/30": "At PetSmart, new site patterns, email templates and AI-assisted product photography lifted creative output 30%.",
  /* Faux Reel */
  /* what it answered: Faux Reel: "A sizzle reel is usually video that gets shot, edited, rendered and hosted"; "The finished web component weighs 4.8KB gzipped, smaller than any one of the photographs it plays" */
  "fig/4-8kb": "A sizzle reel is usually video that gets shot, edited, rendered and hosted. Faux Reel does it with stills and a 4.8KB web component, smaller than any one of the photographs it plays.",
  /* Sally Marketing OS */
  /* what it answered: Sally OS: "that output breaks when the tools underneath it don't share context"; "I rebuilt each of those tools with AI and connected them into a single pipeline"; "Four months in, the Marketing OS is six deployed applications sharing one brain. It now reads the market and the customers on its own and proposes campaigns" */
  "fig/four-months": "Sally Beauty's marketing output broke whenever the tools underneath it didn't share context. In four months I rebuilt each tool with AI and connected them into Sally Marketing OS, six deployed applications sharing one brain that now reads the market and proposes campaigns on its own.",
  /* what it answered: Sally OS: "A question that used to mean a research request and a two-week turnaround gets answered in the same conversation where the strategy is being written" */
  "fig/two-week": "At Sally Beauty, a question used to mean a research request and a two-week turnaround. In Sally Marketing OS it gets answered by Perplexity's live web search, in the same conversation where the strategy is being written.",
  "fig/three-minutes": "At Sally Beauty, the executive deck used to take half a day of a designer's time. In Sally Marketing OS it's one click and three minutes, built straight from the campaign brief.",
  /* Sally OS: "The job went from half a day of a designer's time to one
     click and three minutes." */
  /* what it answered: Sally OS, the Social Copy Generator: "formatted for Instagram, TikTok, Facebook, and X"; "It takes about a minute to turn one brief into four channels" */
  "fig/four-channels": "At Sally Beauty, a campaign brief has to become social copy for X, Instagram, TikTok and Facebook. In Sally Marketing OS, the Social Copy Generator turns one brief into all four channels in about a minute.",
  /* Dallas Sport Collective: "a six-trainer gym in North Texas"; "open
     seven days a week in Celina and McKinney, Texas, with a Frisco
     headquarters on the way"; "The full trainer roster and the program menu
     each get a screen of their own"; "The part I find the most fun is an
     MCP server with eleven tools" */
  /* what it answered: DSC: "the schedule underneath it all was a pile of texts, handwritten notes, emails, and a Google Sheet nobody fully trusted"; "grew from a handful of athletes to more than a hundred"; the stat "6 / Trainers / One shared calendar" */
  "fig/six-trainers": "Dallas Sport Collective's schedule for six trainers and more than a hundred athletes lived in texts, notes and a spreadsheet. I built one shared calendar, and members book into it from the app or their own AI.",
  /* a figure tied back to what the work solved (27 Sept, his "for
     'figures' - to make them really make sense can we relate them back to
     what the project solved or did"). Sources: "the schedule underneath it
     all was a pile of texts, handwritten notes, emails, and a Google Sheet
     nobody fully trusted"; "one deterministic engine that checks trainer
     availability, double-bookings, floor capacity"; "The owner console is
     built for one person on the gym floor"; "approve each request with one
     tap" */
  "fig/eleven-programs": "Dallas Sport Collective runs eleven programs, from NFL Combine prep to prenatal fitness, and the schedule for all of them lived in texts, notes and a spreadsheet. I built the booking platform they run on now, where one engine checks every trainer's time and the floor before anything gets booked.",
  "fig/seven-days": "Dallas Sport Collective is open seven days a week across two locations, and one person on the gym floor runs the schedule. Athletes book from the app or from the AI they already use, and the owner approves each request with one tap.",
  /* what it answered: DSC: "Eleven tools on the MCP server cover the gym overview, the program list, trainer profiles and availability, the athlete's sessions and pending requests, slot suggestions, booking requests, and cancellations"; "An athlete never has to open the app"; "ask it what's on their schedule, which trainer fits a goal"; "they ask a connected AI, and it reads their real schedule and can put in a session request". HEAD's line, kept */
  "fig/eleven-tools": "With eleven tools on Dallas Sport Collective's MCP server, an athlete never has to open the app. They ask the AI they already use, and it reads their schedule, matches a trainer to a goal and puts in a session request.",
  /* A.R.C. */
  "fig/300-000-items": "The average American household holds around 300,000 items. Most homeowners have never added up what they're worth, and A.R.C. does that from the camera.",
  "fig/60": "About 60% of homeowners are underinsured because they've never cataloged what they own. Home inventory apps ask you to type every item in by hand, so A.R.C. works from the camera instead.",
  /* A.R.C.: "A.R.C. is an iPhone app I designed and built for home inventory"; "A.R.C. went from concept to live product in ten weeks" */
  "fig/ten-weeks": "A.R.C., an iPhone app for home inventory, went from concept to live product in ten weeks. I built it end to end: the concept, the code, the brand and the go-to-market.",
  "fig/50-70": "A standard homeowner's policy covers your belongings at 50-70% of what the house is insured for. A.R.C. calculates whether that's enough for what you own.",
  "fig/400-000": "Take a home insured at $400,000. A standard policy covers the things inside it for around $200,000-$280,000, and A.R.C. checks what you own against that.",
  "fig/200-000-280-000": "Roughly $200,000-$280,000 is what a standard policy on a $400,000 home covers for the belongings inside it. A.R.C. puts what you own next to that limit and shows the gap in dollars.",
  /* "Done properly for an average home, that takes 40+ hours, and hardly
     anyone finishes."; "A room-by-room scan of a house takes minutes." */
  "fig/40-hours": "A proper home inventory by hand takes 40+ hours for an average home, and hardly anyone finishes. A.R.C. turns it into a scan, room by room.",
  /* "Thirteen item categories match the ones insurance claims use."; "A.R.C.
     never asks you to know any insurance terms." */
  "fig/thirteen-categories": "A.R.C. sorts everything it finds into thirteen categories, from furniture and artwork to jewelry and documents. They match the ones insurance claims use, and A.R.C. never asks you to know any insurance terms.",
  "fig/five-years": "Five years after a policy is set, a home might be $50,000 short, and there's no way to know until something goes wrong. A.R.C. shows that gap as a dollar amount.",
  /* "You set the coverage amount when you buy the policy and it tends to
     sit there. Meanwhile the stuff inside the house keeps changing" */
  /* what it answered: A.R.C.: "You set the coverage amount when you buy the policy and it tends to sit there"; "Any gap between your documented total and your coverage shows as a dollar amount" */
  "fig/50-000": "A home covered five years ago might be $50,000 short today, because the coverage gets set once while the things inside keep changing. A.R.C. puts what you own now against the policy and shows that gap in dollars.",
  /* A.R.C.: "A.R.C. is an iPhone app I designed and built for home inventory"; "Weeks 9-10 were the brand identity and visual system, the marketing site and the go-to-market work, and then launch" */
  "fig/weeks-9-10": "Weeks 9-10 closed the ten-week build of A.R.C., an iPhone app for home inventory. They covered the identity and visual system, the marketing site and the go-to-market work, then the launch.",
  /* "Both bars are for the same 1,168-item home. The hours by hand are an
     estimate, and the A.R.C. bar is the app's own pace across the whole
     home."; "Documenting a 1,168-item home in A.R.C. takes under eight
     hours." (the study's whole-home figures since 1 Oct 2026, his "73
     items per room" across his sixteen rooms) */
  "fig/128-192-hours": "Documenting a 1,168-item home by hand is an estimated 128 to 192 hours. A.R.C. does the same home in under eight hours.",
  "fig/8-hours": "A.R.C. documents a 1,168-item home in under eight hours. By hand it's an estimated 128 to 192 hours, so the app is 16 to 24 times faster.",
  "fig/10-weeks": "A.R.C. took 10 weeks from concept to launch, in five two-week steps. They were validation, architecture, the interface, the financial layer, and the brand and go-to-market.",
  "fig/2-wks": "Each step of A.R.C.'s build took two weeks. There were five of them, from validating the concept through the brand and the launch.",
  /* Robert Rodriguez: "One model and four setups stretched into ..."; "The
     photographs were layered over each other so the same few pictures
     could carry a whole look." */
  /* what it answered: Robert Rodriguez: "The campaign's budget covered one day in the studio"; the section head, "One model and four setups stretched into an entire campaign." The layering is cap/photo-compositing's */
  "fig/four-setups": "Neiman Marcus's budget for the Robert Rodriguez campaign covered one day in the studio. One model and four setups were stretched into an entire campaign.",
  /* Hill Country home */
  /* what it answered: Kitchen: "The kitchen mixes periods on purpose. Shaker cabinet doors come out of traditional American kitchens, the steel-frame windows and open shelving are contemporary, the cremone bolts and schoolhouse pendants are European antique"; "The pantry doors close with cremone bolts, a French mechanism"; "It works as one room because the new and vintage pieces are in the same four finishes" */
  "fig/four-finishes": "The Hill Country kitchen mixes periods on purpose: Shaker cabinet doors, contemporary steel-frame windows and open shelving, and antique European door bolts and schoolhouse pendants. It works as one room because the new and vintage pieces are in the same four finishes.",
  /* what it answered: Kitchen: "used for cooking, gathering, and working in about equal measure"; "The island handles prep, serving, and seating at the same time"; "Eight feet of usable counter sits on the island, and the open shelving faces the dining side" */
  "fig/eight-feet": "The Hill Country kitchen gets used for cooking, gathering and working in about equal measure. Its island has eight feet of usable counter, and the open shelving faces the dining side.",
  /* what it answered: Bath: "The counters are a warm-veined Calacatta, the shower walls a cooler, grayer slab stacked vertically, and the floor a hex marble mosaic. The three marbles were picked to go together, which keeps 400 square feet of hard surface from looking like a showroom" */
  "fig/400-square-feet": "The Hill Country primary bath has 400 square feet of hard surface, which can look like a showroom. Three marbles picked to go together keep it from looking like one: warm-veined Calacatta on the counters, a cooler, grayer slab in the shower and a hex mosaic on the floor.",
  /* Black & white type (Typography & Patterns): "The six shapes are dots
     at two scales, lines in three directions, and a diamond grid. Each one
     is drawn as a positive and a negative, twelve tiles in all. The tiles
     fill the letterforms, spill outside them, and sit behind them as
     backgrounds. Three lithographs came out of that set." */
  /* what it answered: Black & white type: "The question was how much range a small set of patterns could produce once color, photography and gradients were off the table" */
  "fig/twelve-tiles": "Black & white type is three lithographs made without color, photography or gradients, to see how much range a few patterns could produce. Dots at two scales, lines in three directions and a diamond grid, each drawn as a positive and a negative, make its twelve tiles.",
  /* what it answered: Black & white type: "The same 45-degree stripe, at the same line weight, runs through both"; "blown up like that the angle gives the whole stack some speed" */
  "fig/45-degree": "The same 45-degree stripe, at the same line weight, runs through two of the Black & white type prints. In one it covers a single crossbar of an 'F', and in \"highball stepper\" it fills a slab 'R' top to bottom, where the angle gives the lettering some speed.",
  /* Mountain View */
  /* what it answered: Chalet: "The Mountain View chalet was built in 1968 in the Pacific Northwest and hadn't been rethought since the '90s"; "The house was taken down to the studs"; "16-foot sliding glass doors on the main wall, so the tree canopy is what you look at from every seat in the room". "Living room" is from the hero's alt: "Mountain View chalet living room with ... 16-foot glass doors framing the Pacific Northwest tree canopy" */
  "fig/16-foot": "The Mountain View chalet hadn't been rethought since the '90s, so it was taken to the studs and given 16-foot sliding glass doors on the living room's main wall. Now the tree canopy is what you look at from every seat.",
  /* Loved by Nordstrom */
  /* what it answered: Loved by Nordstrom: "a Nordstrom mandate to lift smaller designer labels on the department store floor and the digital storefront at the same time"; "Twelve months of tiles went out across social feeds, email sends, in-store signage, and web landing pages. The template used whatever photography a brand had already licensed" */
  "fig/twelve-months": "Nordstrom wanted its smaller designer labels seen on the store floor and online at the same time, so Loved by Nordstrom ran for twelve months across social, email, in-store signage and web. The template took whatever photography each brand had already licensed.",
  /* what it answered: Loved by Nordstrom: "The template used whatever photography a brand had already licensed"; "Photography from a 1080-square social post scaled up to a 1440-wide web hero with a crop spec and no new art direction" */
  "fig/1080-square": "Loved by Nordstrom ran on photography the brands had already licensed, down to a 1080-square social post. A crop spec scaled that up to a 1440-wide hero with no new art direction.",
  /* what it answered: Loved by Nordstrom: "Loved by Nordstrom on the hero slots"; "scaled up to a 1440-wide web hero with a crop spec and no new art direction" */
  "fig/1440-wide": "A 1440-wide web hero on Loved by Nordstrom could come from a brand's 1080-square social post, so a label didn't need new photography to take a hero slot.",
  /* Ivy Park: "Four weeks went to moodboards, wireframes and a concept
     pitch, then two weeks to building and shipping. The brief came in under
     NDA before the team had cleared their schedules" */
  /* what it answered: Ivy Park: "The brief came in under NDA before the team had cleared their schedules, and there were daily calls with Ivy Park while the creative direction got locked in"; "Four weeks went to moodboards, wireframes and a concept pitch". The store/lookbook/campaign brief is tool/html-css-js's */
  "fig/four-weeks": "The Ivy Park brief came in under NDA before Nordstrom's team had cleared their schedules, and there were daily calls with Ivy Park while the creative direction got locked in. The first four weeks went to moodboards, wireframes and a concept pitch.",
  /* what it answered: Ivy Park: "then two weeks to building and shipping"; "The Ivy Park page needed components Nordstrom's CMS didn't have: parallax modules, animated polygon masks" */
  "fig/two-weeks": "After the concept pitch, the team had two weeks to build and ship Ivy Park's launch page. That included the components Nordstrom's CMS didn't have yet, like parallax modules and animated polygon masks.",
  /* what it answered: Ivy Park: "The custom CMS components built for the project went into Nordstrom's shared library and powered other launches for two years" */
  "fig/two-years": "For two years after Ivy Park's launch, the components built for its page powered other launches from Nordstrom's shared library.",
  /* Various design (Branding, Print & Apparel): "Here are album covers,
     posters, art prints, logos, and one storefront window, made over about
     ten years for musicians, friends, and a handful of brands." */
  /* what it answered: Branding, Print & Apparel: "made over about ten years for musicians, friends, and a handful of brands"; the lead's grey half, his approved line: "Each one has its own look, made to fit that client." */
  "fig/ten-years": "Over about ten years I made album covers, posters, art prints, logos and one storefront window for musicians, friends and a handful of brands. Each one has its own look, made to fit that client.",
  /* what it answered: Various design: "The four album covers are each for a different act"; "The four covers go from folk to pop to ambient to a DJ"; "Every sleeve had to read at vinyl size and survive as a thumbnail" */
  "fig/four-album-covers": "Every album sleeve in Branding, Print & Apparel had to read at vinyl size and still work as a thumbnail. The four covers go from folk to pop to ambient to a DJ.",
  /* Various design: "Five logos went to five clients."; "Okina's logo is a
     planet-and-orbit wordmark in heavy black sans, and J. Christianson's is
     a four-circle mark". "Each one has its own look, made to fit that
     client" is fig/ten-years' (the study's lead); the collective and the DJ
     are fig/five-clients' */
  "fig/five-logos": "Branding, Print & Apparel has five logos for five clients. Okina's is a planet-and-orbit wordmark in heavy black sans, and J. Christianson's is a four-circle mark.",
  /* what it answered: Branding, Print & Apparel: "Each of the five logos was drawn for a different kind of client"; "The logo for a fashion collective is wrapped in flowing botanical illustration, and the one for a DJ uses halftone dots"; "A lifestyle brand got a bird on a monogram"; "Okina's logo"; "J. Christianson's is a four-circle mark" */
  "fig/five-clients": "Five logos in Branding, Print & Apparel went to a fashion collective, a DJ, a lifestyle brand, Okina and J. Christianson. The collective's is wrapped in botanical illustration, and the DJ's uses halftone dots.",
  /* "The storefront photograph was shot on film and blown up to street
     size." */
  /* what it answered: Branding, Print & Apparel: "Bokeh's Fall started as a 4x6 of defocused lights"; "One 4x6 film photograph was blown up to fill a storefront window" */
  "fig/4x6": "In Branding, Print & Apparel, Bokeh's Fall started as a 4x6 film photograph of defocused lights and was blown up to fill a storefront window.",

  /* ── CAPABILITIES (drafted 27 Sept). What the capability looks like in
     this work, from the leads of the studies its shelf stacks. The counts
     are the studies that list it. Since his "lean towards OVER doing it",
     entry-reach.js widens where each reaches, so the lines keep to
     examples and scope that hold, not counts. ── */
  /* what it answered: DSC: "the schedule underneath it all was a pile of texts, handwritten notes, emails, and a Google Sheet nobody fully trusted"; About: "a scheduling system where athletes and trainers book by talking to an AI, and the scheduling underneath stays deterministic" */
  "cap/ai-integration": "Dallas Sport Collective's schedule was a pile of texts, handwritten notes, emails and a Google Sheet nobody fully trusted. Now athletes and trainers book by talking to an AI, and the scheduling underneath stays deterministic.",
  /* what it answered: Sally OS: "The Marketing OS uses five AI providers, each routed to what it is best at: Claude for reasoning, strategy, and copy; Gemini for embeddings and grounded research; Perplexity for live web search"; "strategy work and copywriting run on different Claude models on purpose". The shared-context problem is fig/four-months' */
  "cap/ai-strategy": "Sally Marketing OS uses five AI providers, each routed to what it's best at. Claude handles the reasoning, with strategy and copywriting on separate Claude models, and Perplexity runs live web search.",
  /* what it answered: Branding, Print & Apparel: "The four album covers are each for a different act"; "nothing carries over from one sleeve to the next"; "The folk record's cover uses woodgrain collage and halftone geometry"; "the DJ's cover is a saturated portrait where the color carries the whole thing". The genre run is fig/four-album-covers' */
  "cap/album-art": "Each of the four album covers in Branding, Print & Apparel is for a different act, and nothing carries over from one sleeve to the next. The folk record's cover uses woodgrain collage, and the DJ's is a saturated portrait.",
  /* what it answered: Capitan Boot Co.: "Stamps blur and embossing flattens out, so every mark had to survive both and still read"; "Each mark has to read whether it's pressed into leather or stitched into denim" */
  "cap/apparel-graphics": "Capitan Boot Co.'s marks get pressed into leather and stitched into denim, where stamps blur and embossing flattens out, so each one had to survive both and still read. J. Christianson's tree drawing runs on its apparel in four seasonal colorways.",
  /* what it answered: Neiman Marcus: "InSite was Neiman Marcus's digital editorial hub"; "There was no location budget, so graphic color blocks stood in for the places a bigger production would have flown to". Robert Rodriguez: "Glamour Shots and the other mall portrait studios were the campaign's starting point"; "Smooth mesh color fields replaced the mall studios' airbrushed backdrops and kept their warmth". The studio day is fig/four-setups'. "Twelve years" is the two studies' published dates, 2012 and 2024; the checker keeps the figure */
  "cap/art-direction": "Neiman Marcus's editorial hub, InSite, had no location budget, so graphic color blocks stood in for the places a bigger production would have flown to. Twelve years later, the Robert Rodriguez campaign started from mall portrait studios, and smooth color fields replaced their airbrushed backdrops.",
  /* what it answered: Hill Country living: "an original painting by Dwight D. Eisenhower hangs with landscape pieces in gilded frames" */
  "cap/art-selection": "The Hill Country living room's limestone wall carries an original painting by Dwight D. Eisenhower, hung with landscape pieces in gilded frames. In the Fairview entry, a slatted wood geometric and a dark abstract flank the bench.",
  /* what it answered: Nordstrom framework: "four named buckets, each with its own typographic mark and icon"; "Sourced a different typeface for every bucket's typographic mark." The too-much-content problem is fig/22's */
  "cap/brand-design": "Each of the four buckets in Nordstrom's content framework got its own icon and typographic mark, and every mark is set in a different typeface. Capitan Boot Co. and J. Christianson got whole brands, down to the logos.",
  /* what it answered: J. Christianson: "J. Christianson is a fashion and home goods label, and the brand started from nothing: the name first, then the mark, the palette, the type, and the product graphics"; "built from the name outward" */
  "cap/brand-development": "J. Christianson is a fashion and home goods label whose brand started from nothing, so it was built from the name outward: the mark, the palette, the type, then the product graphics.",
  /* what it answered: Capitan Boot Co.: "needed a brand that could take as much wear as they do"; "Every piece of the identity works stamped, stitched, embroidered, or printed" */
  "cap/brand-identity": "Capitan Boot Co. makes Western boots and needed a brand that could take as much wear as the boots do. Its logo, badges and lockups work stamped, stitched, embroidered or printed, and still read.",
  /* what it answered: Jeffrey New York: "The site was built to change as often as the store did"; "Modular grids let the layouts change with the season, and the type hierarchy stayed sharp everywhere it showed up" */
  "cap/brand-system": "Jeffrey New York's first site was built to change as often as its store did. Modular grids let the layouts turn over with the season, and the type hierarchy stayed sharp everywhere it showed up.",
  /* what it answered: Hill Country Oakworks: "look like a heritage brand at both sizes"; "The campaign pulls from mid-century poster design" */
  "cap/campaign-design": "Hill Country Oakworks' campaign had to look like a heritage brand on a roadside billboard and on a phone screen. It borrows from mid-century posters, with warm color blocking and an oak silhouette, and the same idea runs at every size.",
  /* what it answered: You By Sally: "Hair color usually sits on a drugstore shelf under fluorescent lights, and the brief was to make it something you would choose on purpose"; "The campaign started with the cast, real people instead of models, and everything else came from their portraits" */
  "cap/campaign-direction": "Hair color usually sits on a drugstore shelf, and You By Sally's brief was to make it something you'd choose on purpose. The campaign was cast with real people instead of models, and everything else came from their portraits.",
  /* Amber Shockey & Co.: "the patterns for its first three collections";
     "Each one is built to layer, from a single accent dish to the whole
     table." */
  /* what it answered: Amber Shockey & Co.: "makes tableware"; "every new collection has to sit next to the ones before it"; Angle: "Every collection shares cream as its ground, so a plate from one can sit on the table with a dish from another"; "each runs in several colorways, so the same set can go minimal or maximal depending on what it's paired with" */
  "cap/colorway-development": "Amber Shockey & Co. makes tableware, and every new collection has to sit next to the ones before it. All of them share cream as their ground, and each runs in several colorways, so the same set can go minimal or maximal.",
  /* Hill Country kitchen, the one study that lists construction
     documentation: "The Hill Country kitchen from the ground up: cabinetry,
     island, dining area and the full material spec." AutoCAD and SketchUp
     are in the stack of all eight interiors studies. */
  /* what it answered: Hill Country kitchen, Scope: "Interior design, space planning, fixture selection, construction documentation"; Built: "The Hill Country kitchen from the ground up: cabinetry, island, dining area and the full material spec." No problem is stated, so the line stays plain */
  "cap/construction-documentation": "Construction documentation was part of the Hill Country kitchen's scope, and the work went from the ground up: cabinetry, island, dining area and the full material spec. AutoCAD and SketchUp are in all eight interiors projects.",
  /* what it answered: Nordstrom framework: "all hit email and the site at the same time, with nothing sorting them"; "Four buckets sort the stories on the homepage, in email, and on landing pages"; "The bucket names showed up in Nordstrom's planning meetings before the framework reached a customer" */
  "cap/content-strategy": "Nordstrom's brand launches, seasonal pushes, occasion guides and new arrivals were all landing at once, with nothing sorting them. The strategy came down to four named buckets for the homepage, email and landing pages, and the names were in Nordstrom's planning meetings before the framework reached a customer.",
  /* what it answered: Ivy Park: "The photography was supplied"; "Typography, layout, copy, animation and interaction were all open"; "The copy got written line by line as the pages took shape, in short present-tense sentences that talked straight to the reader" */
  "cap/copywriting": "The photography for Ivy Park's launch page was supplied, and the copy, type, layout and animation were all still open. The copy got written line by line as the pages took shape, in short present-tense sentences that talked straight to the reader.",
  /* what it answered: Robert Rodriguez: "Neiman Marcus wanted the Robert Rodriguez campaign to feel current and still keep the brand's romantic side"; "The campaign's budget covered one day in the studio"; "The campaign mixes '80s mall glam with high fashion" */
  "cap/creative-direction": "Neiman Marcus wanted the Robert Rodriguez campaign to feel current and still keep the brand's romantic side, with one day in the studio to do it. The campaign mixes '80s mall glam with high fashion, and it ran across social, email, the stores and editorial.",
  /* what it answered: Nordstrom personalization: "Nordstrom needed personalized content for millions of customers, and it couldn't look like a machine had made it"; "square, hero, and vertical tiles, three shapes that could each resize and restack across phone and desktop"; "The tile rules were strict enough to run for millions of customers, and the pages still came out different from each other" */
  "cap/design-systems": "Nordstrom needed personalized content for millions of customers, and it couldn't look machine-made. The pages were built on square, hero and vertical tiles that resize and restack across phone and desktop, with rules strict enough to run at that scale while every page still came out different.",
  /* what it answered: Cosmo Prof: "Cosmo Prof sells salon supplies to working stylists. The site was functional but dated"; "The job was to set a new visual direction and make products easier to find" */
  "cap/digital-design": "Cosmo Prof sells salon supplies to working stylists, and its dated site needed to make products easier to find. The new homepage has tabbed recommendations personalized to each stylist, shoppable video you can buy from while it plays, and a header cut back so the content gets the screen.",
  /* what it answered: Jeffrey New York: "The store itself was closer to a gallery than a shop"; "put the stories ahead of the selling: designer launches as the big moments, new content every week" */
  "cap/digital-strategy": "Jeffrey New York felt closer to a gallery than a shop, so its first site put the stories ahead of the selling. Designer launches were the big moments, with new content every week.",
  /* what it answered: Jeffrey New York: "the job was to get that feeling onto a screen"; "Product pages opened on the photography, and navigation was organized around the edit instead of by category" */
  "cap/ecommerce-design": "Jeffrey New York had never sold online, and the job was to get the feeling of an edited gallery onto a screen. Its first online store opened product pages on the photography and organized navigation around the edit instead of by category.",
  /* what it answered: Neiman Marcus: "InSite was the editorial hub on the Neiman Marcus website"; "The mandate was to make the website feel like a magazine and sell product like a store, at the same time"; "Sometimes the type broke the grid, and the shopper was trusted to find the price anyway" */
  "cap/editorial-design": "InSite, the editorial hub on Neiman Marcus's website, had to feel like a magazine and sell like a store at the same time. Designer names ran as big as the photographs, and when the type broke the grid, the shopper was trusted to find the price anyway.",
  /* Nordstrom beauty: "The beauty hub ran on three modular story
     templates." */
  /* what it answered: Nordstrom beauty: "Beauty content ages fast. New products launch weekly and trends shift with the season"; "built so merchandising could swap products without touching the layout" */
  "cap/editorial-templates": "Beauty content goes stale fast, with launches every week and trends turning with the season. Nordstrom's beauty hub answered with three story templates the products rotate through, so merchandising can swap them without touching the layout.",
  /* what it answered: Sally design system: "An email or a homepage at Sally Beauty used to take weeks to make"; "The emails stack up from fourteen blocks"; "Four email sets share one chassis"; "The templates are built for Sally's internal AI tool, which fills them from a request form with photography, copy and products" */
  "cap/email-design": "Making an email at Sally Beauty used to take weeks. The system's four sets share one chassis of fourteen blocks, built for Sally's internal AI tool to fill from a request form.",
  /* what it answered: Jeffrey spring: "One kit covered email, the homepage and social"; About: "At PetSmart, new site patterns, email templates and AI-assisted product photography lifted creative output 30%" */
  "cap/email-web-templates": "Jeffrey's spring campaign was shot entirely in the studio, and one kit covered email, the homepage and social. At PetSmart, new email templates and site patterns helped lift creative output 30%.",
  /* what it answered: DSC: "Every booking, whether spoken out loud, requested by an athlete's connected AI, or made with a tap on the calendar, flows through one deterministic engine that checks trainer availability, double-bookings, floor capacity, allowed durations, and cancellation rules"; "The owner can say a whole week out loud". The request-only AI is tool/model-context-protocol's */
  "cap/engineering": "Dallas Sport Collective's bookings come in three ways: the owner says them out loud, an athlete's connected AI requests them, or someone taps the calendar. One deterministic engine checks every one for trainer availability, double-bookings, floor capacity and cancellation rules.",
  /* what it answered: A.R.C.: "I built A.R.C. end to end"; "Claude Code was my main environment from start to finish"; "A.R.C. went from concept to live product in ten weeks"; Faux Reel: "Faux Reel took a day to build with Claude Code, most of it spent finessing the timing" */
  "cap/engineering-ai-assisted": "I built A.R.C. end to end in Claude Code, from concept to live product in ten weeks. Faux Reel took a day to build with it, most of that spent finessing the timing.",
  /* what it answered: Ivy Park: "The polygon, a hexagon, showed up during concepting as a way to break the rectangular grid the photography came in" */
  "cap/experience-design": "Ivy Park's supplied photography all came on a rectangular grid, and a hexagon showed up during the concept work as a way to break it. Angled, rotated and animated on scroll, the hexagon ran from the hero banner through the product carousels into the email headers.",
  /* what it answered: Mountain View: "an exterior that disappeared on cloudy days"; "The exterior was repainted warm gray with white railings, and new fixtures light the patio and stairs at night" */
  "cap/exterior-direction": "The Mountain View chalet's exterior disappeared on cloudy days. It was repainted warm gray with white railings, and new fixtures light the patio and stairs at night.",
  /* what it answered: Floor & Decor: "named the studio Designer of the Quarter for choosing the hard surfaces in three residential bathrooms. Marble, dolomite, white oak and classic tile were the four materials every project pulled from, and each room used them differently" */
  "cap/finish-coordination": "Floor & Decor named the studio Designer of the Quarter for choosing the hard surfaces in three residential bathrooms. Marble, dolomite, white oak and classic tile were the four materials all three pulled from, and each room used them differently.",
  /* what it answered: Fairview suite: "The layers work together because the tonal range stays narrow: blues, grays, warm metals" */
  "cap/finish-selection": "The Fairview suite piles on velvet, linen, bouclé and faux fur, and the layers work together because the tonal range stays narrow: blues, grays and warm metals. Brass sits at every furniture base and fixture.",
  /* what it answered: Hill Country bath: "The bath is softer than the Hill Country kitchen, two rooms away"; "swaps the brass for polished nickel fixtures" */
  "cap/fixture-selection": "The Hill Country bath is softer than the kitchen two rooms away, and its fixtures are part of why: polished nickel instead of brass. Globe sconces sit at both vanities, with wall-mounted cross-handle faucets.",
  /* Fairview suite: "a hammered copper clawfoot tub"; Mountain View: "a
     sputnik chandelier overhead" */
  "cap/fixture-sourcing": "Fixtures sourced for the interiors here run from a hammered copper clawfoot tub in the Fairview suite to a sputnik chandelier in the Mountain View chalet.",
  /* what it answered: DSC: "a back office that could keep up"; "Design and full-stack, brand to backend". The brand half is cap/web-design's */
  "cap/full-stack-engineering": "Dallas Sport Collective's founder needed a back office that could keep up with the gym. The build went from brand to backend: a marketing site, an athlete app, an owner console and an MCP server.",
  /* what it answered: Mountain View: "The furniture is kept simple on purpose so it doesn't compete with what's outside the glass" */
  "cap/furniture-curation": "The Mountain View chalet looks out through its glass onto the tree canopy, so the furniture was kept simple enough not to compete. There's a tufted gray sofa, a woven bench, a walnut dining set and a ladder shelf against painted stone.",
  /* what it answered: A.R.C.: "Weeks 9-10 were the brand identity and visual system, the marketing site and the go-to-market work, and then launch" */
  "cap/go-to-market-strategy": "The last two weeks of A.R.C.'s ten-week build were the brand, the marketing site and the go-to-market. Ivy Park's launch at Nordstrom went from concept to live in six weeks.",
  /* what it answered: J. Christianson: "The product graphics come from a tree silhouette, drawn once and run in four seasonal colorways over a striped field in the brand colors"; "one tree drawing in four colorways covers the whole line" */
  "cap/graphic-design": "J. Christianson needed product graphics for a whole line, and one tree drawing covers it. It runs in four seasonal colorways over a striped field in the brand colors, on apparel, candles, hangtags and print.",
  /* what it answered: Sally design system: "An email or a homepage at Sally Beauty used to take weeks to make"; "The homepage has its own kit of twenty-one modules"; "every module has a desktop and a phone pair"; "Eleven homepage concepts came out of one kit" */
  "cap/homepage-design": "A homepage at Sally Beauty used to take weeks to make. Its kit has twenty-one modules, each drawn at desktop and phone sizes, and eleven concepts came out of it.",
  /* About and Floor & Decor: Designer of the Quarter, 2023 */
  /* what it answered: Mountain View: "The Mountain View chalet was built in 1968 in the Pacific Northwest and hadn't been rethought since the '90s"; "taken down to the studs and rebuilt inside and out". Kitchen: "The kitchen mixes periods on purpose". Floor & Decor: "named the studio Designer of the Quarter for three bathrooms". About: "Floor & Decor named me Designer of the Quarter in 2023". Eight interiors studies */
  "cap/interior-design": "The interiors here run from the Mountain View chalet, a 1968 house taken down to the studs, to a Hill Country kitchen that mixes periods on purpose. There are eight projects in all, and in 2023 Floor & Decor named me Designer of the Quarter for three bathrooms.",
  /* what it answered: J. Christianson: "Its shape stays the same and its colors change with the setting, so the one mark can still be recognized"; Various design: "Five logos went to five clients" */
  "cap/logo-design": "J. Christianson's logo is four circles in a tight grid. Its shape stays the same while the colors change with the setting, so the one mark can still be recognized. It's one of five logos in Branding, Print & Apparel.",
  /* what it answered: Capitan Boot Co.: "on a hangtag or across a banner"; "Capitan's identity is a primary logo, secondary badges, typographic lockups, and a set of illustrations" */
  "cap/logo-system": "Every Capitan Boot Co. mark had to read on a hangtag or across a banner. The identity has a primary logo, secondary badges, typographic lockups and a set of illustrations, with Northwest Regular and Oldman Regular as the type pairing.",
  /* what it answered: Fairview sitting room: "The sitting room's palette is four materials: stone, velvet, brass and warm oak, with no accent colors"; "There's no television in the room. The chairs face the fire and each other"; "The room is formal, a little glam, and comfortable to sit in" */
  "cap/material-selection": "The Fairview sitting room is formal, a little glam and comfortable to sit in, and it keeps to four materials: stone, velvet, brass and warm oak. There are no accent colors and no television, and the chairs face the fire and each other.",
  /* what it answered: Hill Country living: "The living room's materials were chosen for how they age"; "Every piece was chosen for how it will age, and none of it came as a set" */
  "cap/material-specification": "The Hill Country living room's materials were chosen for how they age: a floor-to-ceiling limestone fireplace wall, reclaimed 1950s pine underfoot, exposed beams overhead and brass fixtures. The furniture was picked the same way, and none of it came as a set.",
  /* what it answered: Nordstrom framework: "Customers got the whole pile and no way through it"; "The bucket names sound like a magazine's sections" */
  "cap/naming": "Nordstrom's content needed sorting into sections a customer could follow. The framework's four buckets got names that sound like a magazine's: What's Now, On Our List, Where to Wear and Wear to Where.",
  /* what it answered: Amber Shockey & Co.: "a hero pattern, a secondary, and an accent, made to layer from a single dish up to a full setting"; "Three collections are here: blue florals, black linework, red dragons. Each one sets something structured against something organic" */
  "cap/pattern-design": "Every Amber Shockey & Co. collection has to layer from one accent dish to a full table, so each has a hero pattern, a secondary and an accent. The first three are blue florals, black linework and red dragons, and each sets something structured against something organic.",
  /* Various design: "the pop artist's sleeve has grunge compositing and
     hand-drawn type"; Robert Rodriguez: "Two frames from the same shoot,
     one tight and one wide, were layered as a double exposure" */
  /* what it answered: Robert Rodriguez: "The photographs were layered over each other so the same few pictures could carry a whole look"; "Two frames from the same shoot, one tight and one wide, were layered as a double exposure, so the overlap made a third picture that neither frame had on its own". The studio day is fig/four-setups' */
  "cap/photo-compositing": "The Robert Rodriguez campaign for Neiman Marcus layered its photographs over each other so a few pictures could carry the whole look. Two frames, one tight and one wide, became a double exposure, and the overlap made a third picture neither frame had on its own.",
  /* what it answered: Capitan Boot Co.: "with no props or stand-ins and no styling added to what was already there"; "The campaign pictures come from the landscape the boots are made for" */
  "cap/photo-direction": "Capitan Boot Co.'s campaign was shot in West Texas with no props, no stand-ins and no styling beyond what was already there. The pictures come from the landscape the boots are made for.",
  /* Big Bend: "Photographs from a family trip through Big Bend and the desert
     around Marfa. | The trip was personal, and Capitan Boot Co. later used a
     few of the photographs as backdrops in its campaign." */
  "cap/photography": "The West Texas photographs were personal work, from a family trip. A few of them later became backdrops for the Capitan Boot Co. campaign.",
  /* Cosmo Prof: "The templates set photography, type and layout once." */
  /* what it answered: Cosmo Prof: "The site was functional but dated"; "Work started with photography: high-contrast lighting, defined shadows and cleaner compositions"; "One set of templates carries promotions, brand campaigns and education modules" */
  "cap/photography-direction": "Cosmo Prof's site was functional but dated, and the refresh started with the photography: high-contrast lighting, defined shadows and cleaner compositions. One set of templates now carries promotions, brand campaigns and education modules.",
  /* what it answered: Black & white type: "With no color to lean on, tone comes from spacing" */
  "cap/poster-design": "Black & white type took color, photography and gradients off the table to see how far six patterns could go in print. Three lithographs came out of it, with tone set by spacing: a packed fill looks dark and an open one looks light.",
  /* what it answered: Amber Shockey & Co.: "made to layer from a single dish up to a full setting" */
  "cap/product-applications": "Amber Shockey & Co.'s patterns have to work on a single accent dish and across a whole table. J. Christianson's tree drawing went onto apparel, candles, hangtags and print.",
  /* what it answered: A.R.C.: "People skip home inventory because every app makes them type each item in by hand. A.R.C. works from the camera instead."; "Point it at a room, take a photo or a video, and the app identifies what is there, estimates replacement value, and categorizes everything in the same pass" */
  "cap/product-design": "People skip home inventory because every app makes them type each item in by hand. With A.R.C. you point the camera at a room, and the app identifies what's there, estimates replacement value and categorizes everything in the same pass.",
  /* what it answered: A.R.C., Development Timeline: "Weeks 1-2 went to checking the idea. Could computer vision reliably pick out household items from ordinary phone photos? ... It could, with a few caveats that ended up shaping the UX." The five steps are fig/10-weeks' */
  "cap/product-management": "A.R.C.'s first two weeks went to checking the idea: could computer vision reliably pick out household items from ordinary phone photos? It could, with a few caveats that ended up shaping the UX.",
  /* what it answered: Nordstrom personalization: "deliberate contrast, precise angles, and no styling props, so each image worked on its own as a story hero or stacked into a product grid" */
  "cap/product-photography-direction": "Nordstrom's personalized pages needed product photographs that worked on their own as a story hero and stacked into a product grid. They were shot with deliberate contrast, precise angles and no styling props.",
  /* what it answered: About: "writes and designs the emails, web assets and signage"; "across digital and 2,000+ stores"; You By Sally: "clean grids that ran on mobile, desktop and in-store signage" */
  "cap/retail-signage": "Sally's campaigns have to reach 2,000+ stores, and Sally Marketing OS designs the signage along with the emails and web assets. You By Sally's oversized color blocks ran on clean grids across mobile, desktop and in-store signs.",
  /* what it answered: Fairview entry: "The light through those doors comes first. Everything else in the room is sized and placed to let it through" */
  "cap/space-planning": "The Fairview entry is two stories tall, and the light through its floor-to-ceiling French doors comes first. Everything else in the room is sized and placed to let it through.",
  /* what it answered: Neiman Marcus: "On every InSite piece, the concept came first, then the shoot, then the styling and the layout. Designer spotlights featured names like Derek Lam and Helmut Lang"; "Ways-to-wear features styled one garment a few different directions." The magazine-and-store mandate is cap/editorial-design's */
  "cap/story-development": "On every piece for InSite, Neiman Marcus's editorial hub, the concept came first, then the shoot, then the styling and the layout. Designer spotlights featured names like Derek Lam and Helmut Lang, and ways-to-wear features styled one garment a few different directions.",
  /* what it answered: Jeffrey spring: "Monstera leaves and palm fronds were cropped big and used as graphic elements"; "The type got the same graphic treatment, condensed, stretched and layered for rhythm across three designer stories: JW Anderson, Valentino and Simone Rocha" */
  "cap/typography": "Jeffrey's spring campaign ran three designer stories: JW Anderson, Valentino and Simone Rocha. The type was condensed, stretched and layered for rhythm across all three, the same graphic treatment the cropped monstera leaves and palm fronds got.",
  /* what it answered: Black & white type: "The amount of paper left around a letter sets the mood of the whole print" */
  "cap/typography-design": "Black & white type asked how much range a few patterns could get out of letterforms once color was off the table. The shapes fill the letters, spill outside them and sit behind them, and the paper left around each letter sets the mood of the print.",
  /* what it answered: Jeffrey New York: "The work started with the buying team: how the floor was laid out, how pieces got grouped" */
  "cap/ux-architecture": "The work on Jeffrey's first online store started with how the buying team laid out the floor and grouped pieces. The site's navigation follows the edit instead of the category, and every interaction from wireframe to checkout was prototyped.",
  /* Nordstrom beauty: "built as its own component so it could be reused
     for eye, cheek, or nail products" */
  /* what it answered: Nordstrom beauty: "drag across a color gradient to preview shades on their own face"; "Customers could buy the shade they chose without leaving the try-on modal" */
  "cap/ux-design": "Nordstrom's beauty hub let a customer try a shade before buying: upload a photo or pull their Style Profile selfie, then drag across a color gradient to see it on their own face. They could buy the shade they chose without leaving the try-on.",
  /* what it answered: Cosmo Prof: "Cosmo Prof sells salon supplies to working stylists"; "it needed to match the professionals using it"; "Typography moved to Jost, and the palette put soft neutrals against sharp black" */
  "cap/visual-design": "Cosmo Prof's dated site needed to match the working stylists who shop it. The type moved to Jost, and the palette set soft neutrals against sharp black.",
  /* what it answered: DSC: "a brand that matched where the gym was headed"; "a marketing site in black and white, with big condensed type and photography of actual members training" */
  "cap/web-design": "Dallas Sport Collective's founder needed a brand that matched where the gym was headed. The marketing site carries it in black and white, with big condensed type and photography of actual members training.",
};

/* ── THE PAGE'S OWN LONGER LINE (2 Oct 2026) ──────────────────────────
   His words, on Claude Code's shelf: "in the description portion i think
   we can say even more than what the TOC section has - claude code has
   become my design tool, thinking partner, CMS, etc. it's taken what
   might have been 5-7 other applications and put them into one tool.
   let's find a way to expand there some".

   A shelf's head uses this where it has one; the index's card and the
   next-panel at a shelf's foot keep the short line above. Same two-tone
   as every line: the first sentence in ink, the rest in grey. The facts
   are his, from that message and from the sentences quoted beside
   tool/claude-code above; "five to seven" is his estimate and keeps his
   "might have been". Draft for him to read aloud. To change it, change
   the words; to take it away, delete the key.

   Then he named them, asked what they were: "Figma, animation tools,
   research tools, coding tools, the need for webflow or framer, etc even
   the need for Jira or project management - it builds and keeps track
   of all of those things". Six, inside his five to seven, in his order;
   "animation tools, research tools, coding tools" is set as "animation,
   research and coding tools" so the word does not stand three times in
   one list. */
window.ENTRY_LONG = {
  "tool/claude-code": "Claude Code is Anthropic's coding agent, and it's where I build: A.R.C. end to end, Sally Marketing OS, Dallas Sport Collective and Faux Reel, which took a single day. It's also my design tool, my thinking partner, this site's CMS and its build environment. It has taken what might have been five to seven other applications and put them in one tool: Figma, animation, research and coding tools, Webflow or Framer, even Jira and project management. It builds and keeps track of all of it.",
};
