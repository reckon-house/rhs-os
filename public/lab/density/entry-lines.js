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

   To change a line, change the words; to take one away, delete it. */
window.ENTRY_LINES = {
  /* A.R.C.: "Perceptron's Mk1 model reads the physical world from footage
     ... picks up the spatial context a single photo misses. Sweep a room
     with your phone and Mk1 reads the whole thing." */
  "tool/perceptron-mk1": "Mk1 is Perceptron's model for reading the physical world from video. I used it in A.R.C. so you can sweep a room with your phone and it catches what a single photo misses.",

  /* Robert Rodriguez x Neiman's: shot in one day; run across social,
     email, the stores and editorial; "Every piece in the campaign is some
     mix of those three" (four photographs, a typeface family, a color field) */
  "fig/four-photographs": "Neiman Marcus's spring campaign was shot in one day. Every piece of it, across social, email, the stores and editorial, is some mix of four photographs, one typeface family and a color field.",

  /* the two studies this figure stacks: the Hill Country kitchen ("Sage
     green cabinetry, raw white oak, veined marble, unlacquered brass") and
     the Fairview sitting room ("stone, velvet, brass, and warm oak") */
  "fig/four-materials": "Both of these rooms are built from just four materials. The Hill Country kitchen is sage green, white oak, marble and brass. The Fairview sitting room is stone, velvet, brass and warm oak.",

  /* About: "I spent eight years at Nordstrom, where I worked with engineering
     to roll out a new CMS ... At Nordstrom the new CMS saved $3M over four years." */
  "fig/3m": "At Nordstrom I worked with engineering to roll out a new CMS. Over four years it saved $3M.",

  /* Sally Marketing OS: "2,000+ stores with regional variation, and dozens
     of campaigns running at once"; "Sally Beauty's marketing and ecommerce
     brain, which I actively design, build, and maintain from inside the team." */
  "fig/2-000-stores": "Sally Beauty runs 2,000+ stores, each with its own regional mix, and dozens of campaigns at once. Sally Marketing OS is the marketing brain I design, build and maintain for all of it, from inside the team.",

  /* A.R.C.: the whole-home dashboard, "$49,630 documented across 8 rooms and
     73 items"; A.R.C. "compares what you have documented against your
     policy limit and shows the gap as a dollar amount." */
  "fig/49-630": "The home on A.R.C.'s dashboard holds 73 items across 8 rooms, $49,630 in all. A.R.C. sets that total against your policy limit and shows the gap in dollars.",

  /* Ivy Park: "Six weeks from moodboard to live"; "95% of the product sold
     out within days." */
  "fig/95": "Ivy Park by Beyoncé went live at Nordstrom six weeks after the first moodboard, and 95% of the product sold out within days.",

  /* ── TOOLS (drafted 27 Sept, after his "these read right - draft the
     rest, tools next"). What the tool is, then where it is in the work.
     A tool a study only lists gets where it shows up, never a reason the
     study does not give. The counts are the studies that list it. ── */
  "tool/adobe-creative-suite": "Adobe's design apps show up in five of the interiors projects, from the Fairview suite to the Mountain View chalet.",
  /* Nordstrom personalization: "built on three tile shapes. They resize for
     every breakpoint, so one picture works many ways" */
  "tool/asset-library": "Nordstrom's asset library is one of the tools behind its personalized homepage. The content there is built on three tile shapes that resize for every breakpoint, so one picture works many ways.",
  "tool/autocad": "AutoCAD is where the drawings for the interiors get made. It's used in all eight of them, the Hill Country house, the Fairview and the Mountain View chalet among them.",
  /* Various design: "a film camera for the photography"; "one 4x6 film
     photograph blown up to fill a storefront window" */
  "tool/camera": "For the early design work, the photography came from a film camera. One of its 4x6 prints was blown up to fill a storefront window.",
  /* Robert Rodriguez: "The whole campaign is four photographs from one day" */
  "tool/capture-one": "Capture One is software for shooting and editing photographs. It was used on the Robert Rodriguez campaign for Neiman Marcus, which all came from one day in the studio.",
  /* Sally OS: "Claude runs the chat and gets the reasoning jobs: turning
     competitive signals into recommendations, drafting the campaign brief
     from raw intel, writing copy in the brand voice." */
  "tool/claude": "Claude is Anthropic's AI model. In Sally Marketing OS it does the reasoning, turning competitor signals into recommendations, drafting campaign briefs and writing copy in the brand voice.",
  /* DSC: "paste one URL into the AI they already use, Claude, ChatGPT or
     Gemini, and ask it what's on their schedule, which trainer fits a goal,
     or to book Friday at 10am" */
  "tool/claude-chatgpt": "Dallas Sport Collective's athletes can book through Claude or ChatGPT. They paste one link into the AI they already use and ask what's on their schedule, which trainer fits a goal, or to book a time.",
  /* A.R.C.: "Claude Code was my main environment the whole way through."
     Sally OS: "my development environment for all of it". About: "This site
     runs in Claude Code." */
  "tool/claude-code": "Claude Code is Anthropic's coding agent, and it's where I build. It was the main environment for A.R.C. and Sally Marketing OS, and this site runs in it too.",
  /* Faux Reel: "runs on a timer ... with CSS animation and no video file
     anywhere"; "The finished web component weighs 4.8KB gzipped" */
  "tool/css": "Faux Reel's motion runs on CSS animation. Stills are cut on a timer, with no video file anywhere, and the whole web component weighs 4.8KB.",
  /* Ivy Park: components the CMS "didn't have: parallax modules, animated
     polygon masks, full-bleed video that played on scroll ... So they got
     built"; they "powered other launches for two years" */
  "tool/custom-components": "Some pages needed things Nordstrom's CMS didn't have yet, so they got built. For Ivy Park that meant parallax, animated masks and video on scroll, and those components powered other launches for two years.",
  /* Loved by Nordstrom's own lead */
  "tool/editorial-systems": "Loved by Nordstrom was a year of emerging-brand merchandising, in stores and online. It was built around one heart icon borrowed from Instagram.",
  /* About: "writes and designs the emails, web assets and signage, and
     delivers them into Figma through a plugin I wrote" */
  "tool/figma": "Figma is where screens get designed and shared. The Cosmo Prof refresh was made in it, and Sally Marketing OS delivers its emails, web assets and signage into Figma through a plugin I wrote.",
  /* West Texas: "a family trip through Big Bend and the desert around
     Marfa"; "A few of these later became the backdrops for the Capitan
     Boot Co. campaign" */
  "tool/fuji-x-t30-35mm-prime": "A Fuji X-T30 with a 35mm lens took the West Texas photographs, on a family trip through Big Bend and around Marfa. A few of them later became backdrops for the Capitan Boot Co. campaign.",
  /* Various design: "hand-drawn type where a piece called for it";
     "Grunge compositing and hand-drawn type for the pop artist" */
  "tool/hand-rendering": "Some of the early design work is drawn by hand, wherever a piece called for it. The hand-drawn type for the pop artist is one.",
  /* Nordstrom beauty: "where every story is shoppable" */
  "tool/html-css-js": "HTML, CSS and JavaScript are the web's building blocks, and they're in the code for Ivy Park and Nordstrom's beauty hub. The beauty hub is built so every story can be shopped.",
  "tool/illustrator": "Illustrator is Adobe's drawing app, for logos, type and patterns. It's in ten of these projects, from the early posters and logos to Capitan Boot Co., J. Christianson and the Robert Rodriguez campaign.",
  "tool/indesign": "InDesign handles layout, anything with pages and type. It's in seven of these projects, from Neiman Marcus's editorial hub to the Hill Country Oakworks campaign.",
  /* Jeffrey NYC: "every interaction from wireframe to checkout was prototyped" */
  "tool/invision": "InVision makes clickable prototypes. For Jeffrey New York's first online store, every interaction from wireframe to checkout was prototyped.",
  /* DSC: "an MCP server with eleven tools"; "The same trainer data feeds
     the MCP server, so a connected AI describes a coach from the actual record" */
  "tool/model-context-protocol": "Model Context Protocol is the open standard that lets an AI use outside tools. Dallas Sport Collective's MCP server has eleven of them and reads the real trainer records, so a connected AI describes a coach from the actual data.",
  /* Sally OS: "The asset hub, the associate site, and the scoreboard are
     Next.js on Vercel." DSC: "Next.js on Vercel" */
  "tool/next-js": "Next.js is a framework for websites and web apps. Sally Marketing OS's asset hub, associate site and scoreboard are built on it, and so is Dallas Sport Collective.",
  /* Nordstrom beauty: "Built to stay current without a team rebuilding the
     pages every week." */
  "tool/nordstrom-cms": "Nordstrom's content management system is where its site pages get built, and three of these projects live in it. The beauty hub was set up so the pages stay current without a team rebuilding them every week.",
  /* DSC: "OAuth 2.0 consent with short-lived tokens" */
  "tool/oauth-2-0": "OAuth 2.0 is how one app gets permission to act for you in another. Dallas Sport Collective uses it for consent, with short-lived tokens.",
  /* Sally OS: "OpenAI's GPT-Image-2 for studio photography"; "Two passes
     through OpenAI's GPT-Image-2." */
  "tool/openai": "OpenAI makes the GPT models and their image tools. In Sally Marketing OS, its GPT-Image-2 does the studio photography, in two passes.",
  /* A.R.C.: "returns a structured read: what the object is, what it is
     made of, its style, its condition, and a rough era or manufacture period" */
  "tool/openai-vision-api": "The OpenAI Vision API reads a photograph and describes what's in it. In A.R.C. it returns what an object is, what it's made of, its style, its condition and roughly when it was made.",
  /* Sally OS: "Perplexity is the live layer: industry news, competitor
     announcements, shifts in social sentiment ... pulled from the web as
     they happen." */
  "tool/perplexity": "Perplexity is an AI that searches the live web. It's the live layer in Sally Marketing OS, pulling industry news, competitor announcements and shifts in social sentiment as they happen.",
  /* Loved by Nordstrom: "The template used whatever photography a brand
     had already licensed"; "a 1080-square social post scaled up to a
     1440-wide hero with no new art direction, just a crop spec" */
  "tool/photography-licensing": "Loved by Nordstrom's template used whatever photography a brand had already licensed. A 1080-square social post could become a 1440-wide hero with no new art direction, just a crop spec.",
  /* the most-listed tool: twelve studies */
  "tool/photoshop": "Photoshop is Adobe's photo editor, and it's in more of these projects than any other tool, twelve in all. They run from the early posters and album covers to Cosmo Prof, You By Sally and the Robert Rodriguez campaign.",
  "tool/playwright": "Playwright drives a real browser from code. Faux Reel, the tool that turns still photographs into a sizzle reel, uses it.",
  /* Sally OS: "a single-page app in plain HTML and JavaScript, no framework
     and no build step, on a Python server, hosted on Railway" */
  "tool/python": "Python runs A.R.C.'s backend and the server behind Sally Marketing OS's portal. The portal itself is plain HTML and JavaScript, with no framework and no build step.",
  "tool/railway": "Railway is a hosting platform for apps and servers. Sally Marketing OS's portal runs on it.",
  /* Faux Reel's own lead: "just stills cut fast enough to look like motion" */
  "tool/react": "React is a library for building interfaces. It's part of Faux Reel, where still photographs are cut fast enough to look like motion.",
  "tool/sketch": "Sketch is a design app for screens. It was used on Jeffrey New York's first online store and on the Cosmo Prof refresh.",
  /* Floor & Decor: "three bathrooms that share one material kit" */
  "tool/sketchup": "SketchUp is for modeling rooms in 3D. Every one of the eight interiors projects uses it, from the Fairview suite to Floor & Decor's three bathrooms.",
  /* A.R.C.: "Python backend, Streamlit frontend, deployed on Vercel" */
  "tool/streamlit": "Streamlit turns Python into a web app. It's A.R.C.'s frontend, on a Python backend deployed on Vercel.",
  /* Jeffrey Spring: "shot entirely in the studio"; "foliage doing the work
     of a location". You By Sally: "Real people instead of models" */
  "tool/studio-photography": "Jeffrey's spring campaign was shot entirely in the studio, with foliage doing the work of a location. You By Sally's campaign is studio work too, shot with real people.",
  /* Sally OS: "An admin review dashboard updates live over Supabase Realtime." */
  "tool/supabase": "Supabase is a database platform built on Postgres. It holds the data for A.R.C., and in Sally Marketing OS an admin dashboard updates live over it.",
  /* Sally OS: "pgvector for a single embedding index that covers documents,
     product photography, and video scenes at once, so one search runs
     across text and pictures" */
  "tool/supabase-pgvector": "pgvector adds AI search to a Postgres database. In Sally Marketing OS one index covers documents, product photography and video scenes, so one search runs across text and pictures.",
  "tool/typescript": "TypeScript is JavaScript with types. It's part of Faux Reel, which builds a sizzle reel out of still photographs.",
  "tool/vercel": "Vercel hosts websites and apps. A.R.C. is deployed on it, and so are Dallas Sport Collective and the Sally Marketing OS asset hub, associate site and scoreboard.",
  /* Sally OS: Gemini "reads Sally's internal knowledge base on the first
     message, so every conversation opens with the brand guidelines,
     campaign history, product catalogs ... already loaded"; "That takes a
     million-token context window, which Gemini has." */
  "tool/gemini": "Gemini is Google's AI model, and it can hold a million tokens at once. In Sally Marketing OS it reads the whole knowledge base on the first message, so every conversation starts with the brand guidelines, campaign history and product data already loaded.",

  /* ── FIGURES (drafted 27 Sept). What the number is, where it comes from,
     and a way into the study. Figures that share one sentence in a study
     (the insurance numbers, Ivy Park's weeks, the early design work) each
     lead with their own number. Lines from About speak as him. ── */
  /* About */
  "fig/eight-years": "I spent eight years at Nordstrom. I worked with engineering to roll out a new CMS and led the redesign of the digital experience, from marketing down to the product page.",
  "fig/2-000-store": "A 2,000-store retailer runs its marketing on a platform I made. It's Sally Marketing OS, which I came up with and built at Sally Beauty.",
  "fig/six-weeks": "At Nordstrom I led the US digital launch of Ivy Park by Beyoncé, six weeks from concept to live. I directed a team of 27 across site, email and apps.",
  "fig/1-3m": "For a couple of years I led interior design and selections on custom homes, on $1-3M builds. In 2023 Floor & Decor named me Designer of the Quarter.",
  "fig/four-years": "Over four years, the new CMS at Nordstrom saved $3M. The redesigned UI and templates also cut concept-to-web time 35%.",
  /* Nordstrom framework: "Engagement lifted 22% over two years."; "Four
     buckets sort the homepage, email, and landing pages the way a magazine
     sorts its sections." */
  "fig/22": "Redesigning Nordstrom's UI and templates lifted customer engagement 22% over two years. The content framework sorts the homepage, email and landing pages into four buckets, the way a magazine sorts its sections.",
  "fig/35": "Redesigning Nordstrom's UI and templates cut concept-to-web time 35%. That's the time from an idea to a live page.",
  "fig/27": "At Sally Beauty and CosmoProf I built the in-house creative teams and a new operating model. Execution efficiency went up 27%.",
  "fig/30": "At PetSmart, new site patterns, email templates and AI-assisted product photography lifted creative output 30%. I build the tools as much as the output.",
  /* Faux Reel */
  "fig/4-8kb": "The whole Faux Reel web component weighs 4.8KB, smaller than any one of the photographs it plays. It turns stills into a sizzle reel with no video file at all.",
  /* Sally Marketing OS */
  "fig/four-months": "Four months in, Sally Marketing OS is six deployed apps sharing one brain. It now reads the market and the customers on its own and proposes the campaigns.",
  "fig/two-week": "Research that used to mean a two-week turnaround now gets answered in the same conversation where the strategy is being written. In Sally Marketing OS, that's Perplexity's job.",
  "fig/three-minutes": "The executive deck used to take half a day of a designer's time. In Sally Marketing OS it's one click and three minutes, built straight from the campaign brief.",
  "fig/four-channels": "One brief becomes social copy for four channels in about a minute. It's one of the tools inside Sally Marketing OS.",
  /* Dallas Sport Collective: "a six-trainer gym in North Texas"; "out of
     Celina and McKinney, Texas, with a Frisco headquarters on the way";
     "the full trainer roster and the program menu"; "the part I find the
     most fun: an MCP server with eleven tools" */
  "fig/six-trainers": "Dallas Sport Collective is six trainers in North Texas, out of Celina and McKinney. I built its marketing site, its booking platform and an MCP server, so athletes can book from their AI.",
  "fig/eleven-programs": "Dallas Sport Collective runs eleven programs, from NFL Combine prep to prenatal fitness. The site lays out the full program menu next to the trainer roster.",
  "fig/seven-days": "Dallas Sport Collective is open seven days a week, out of Celina and McKinney, with a Frisco headquarters on the way. Athletes can book from the site or from the AI they already use.",
  "fig/eleven-tools": "Dallas Sport Collective's MCP server has eleven tools, and it's the part of the project I find the most fun. It lets an athlete ask the AI they already use to book a session.",
  /* A.R.C. */
  "fig/300-000-items": "The average American household holds around 300,000 items. Most homeowners have never added up what they're worth, which is the problem A.R.C. is built for.",
  "fig/60": "About 60% of homeowners are underinsured because they've never cataloged what they own. The apps for it ask you to type every item in by hand, so A.R.C. works from the camera instead.",
  "fig/ten-weeks": "A.R.C. went from concept to live product in ten weeks. I built it end to end: concept, code, brand and go-to-market.",
  "fig/50-70": "A standard homeowner's policy covers your belongings at 50-70% of what the house is insured for. A.R.C. calculates whether that actually covers what you own.",
  "fig/400-000": "Take a home insured at $400,000. A standard policy covers the things inside it for around $200,000-$280,000, and A.R.C. checks what you own against that.",
  "fig/200-000-280-000": "That's roughly what a standard policy covers for the belongings in a $400,000 home. A.R.C. puts what you own next to that limit and shows the gap in dollars.",
  /* "Done properly for an average home, that takes 40+ hours. Hardly anyone
     finishes."; "So a whole house becomes a room-by-room scan that takes minutes." */
  "fig/40-hours": "A proper home inventory by hand takes 40+ hours for an average home, and hardly anyone finishes. A.R.C. turns it into a scan, room by room.",
  "fig/thirteen-categories": "A.R.C. sorts everything it finds into thirteen categories, from furniture and artwork to jewelry and documents. It does that in the same pass that identifies and values each item.",
  "fig/five-years": "Five years after a policy is set, a home might be $50,000 short, and there's no way to know until something goes wrong. A.R.C. shows that gap as a dollar amount.",
  /* "You set the coverage amount when you buy the policy and it tends to
     sit there. Meanwhile the stuff inside the house keeps changing" */
  "fig/50-000": "A home covered five years ago might be $50,000 short today. The coverage gets set once and tends to sit there, while the things inside keep changing.",
  "fig/weeks-9-10": "The last two weeks of A.R.C.'s ten were brand and launch. Weeks 9-10 covered the identity and visual system, the marketing site and the go-to-market work.",
  /* "The same 73-item home, documented both ways. The 8-12 hours is an
     estimate. The 30 minutes is how long the app takes." */
  "fig/8-12-hours": "Documenting a 73-item home by hand is an estimated 8-12 hours. A.R.C. does the same home in about 30 minutes.",
  "fig/30-minutes": "A.R.C. documents a 73-item home in about 30 minutes. By hand it's an estimated 8 to 12 hours, so it runs 16 to 24 times faster.",
  "fig/10-weeks": "A.R.C. took 10 weeks from concept to launch, in five two-week steps. They were validation, architecture, the interface, the financial layer, and the brand and go-to-market.",
  "fig/2-wks": "Each step of A.R.C.'s build took two weeks. There were five of them, from validating the concept through the brand and the launch.",
  /* Robert Rodriguez: "One model, four setups, and the photographs layered
     over each other so the same few pictures could carry a whole look." */
  "fig/four-setups": "The Robert Rodriguez campaign used one model and four setups. The photographs were layered over each other, so a few pictures could carry the whole look.",
  /* Hill Country home */
  "fig/four-finishes": "Everything in the Hill Country kitchen, new and vintage, is in the same four finishes. That's why it works as one room.",
  "fig/eight-feet": "The Hill Country kitchen has eight feet of usable counter. The open shelving faces the dining side.",
  "fig/400-square-feet": "The Hill Country primary bath is 400 square feet of hard surface, in three marbles picked to go together. That keeps it from looking like a showroom.",
  /* Black & white type: "Dots at two scales, lines in three directions, and
     a diamond grid, each one drawn as a positive and a negative, twelve
     tiles in all. They fill the letterforms, spill outside them, and sit
     behind them as backgrounds. Three lithographs came out of that set." */
  "fig/twelve-tiles": "Black & white type is built on twelve pattern tiles: dots, lines and a diamond grid, each drawn positive and negative. They fill the letterforms, spill out of them and sit behind them, and three lithographs came out of the set.",
  "fig/45-degree": "One 45-degree stripe, at the same line weight, runs through two of the prints. In one it's a single crossbar, easy to miss, and in the other it fills a slab letter top to bottom.",
  /* Mountain View */
  "fig/16-foot": "The Mountain View chalet has 16-foot sliding glass doors on its main wall. From every seat in the room, the tree canopy is what you look at.",
  /* Loved by Nordstrom */
  "fig/twelve-months": "Loved by Nordstrom ran for twelve months, across social, email, in-store signage and web landing pages. The template took whatever photography each brand had already licensed.",
  "fig/1080-square": "A 1080-square social post was enough for a hero on Loved by Nordstrom. The brand's own photography scaled up to 1440 wide with no new art direction.",
  "fig/1440-wide": "A 1440-wide hero on Loved by Nordstrom could be scaled up from a brand's 1080-square social post. The crop spec was the only art direction it needed.",
  /* Ivy Park: "Four weeks for moodboards, wireframes and a concept pitch,
     then two weeks to build and ship. The brief came in under NDA before
     the team had cleared their schedules" */
  "fig/four-weeks": "Ivy Park started with four weeks of moodboards, wireframes and a concept pitch. The brief came in under NDA, before the team had even cleared their schedules.",
  "fig/two-weeks": "Once the concept was pitched, Ivy Park took two weeks to build and ship. It needed components Nordstrom's CMS didn't have yet, so they got built.",
  "fig/two-years": "The components built for Ivy Park went into Nordstrom's shared library and powered other launches for two years. Over two years, the content framework lifted engagement 22%.",
  /* Various design: "Album covers, posters, art prints, logos, and one
     storefront window, made over about ten years for musicians, friends,
     and a handful of brands." */
  "fig/ten-years": "The early design work spans about ten years: album covers, posters, art prints, logos and one storefront window. It was made for musicians, friends and a handful of brands.",
  "fig/four-album-covers": "Four album covers, each for a different act, are part of the early design work. So are posters and prints, from a typography exercise to double-exposed landscapes.",
  "fig/five-logos": "Five logos for five clients are in the early design work. Each one has its own look, made to fit that client.",
  "fig/five-clients": "Those five logos were for five different clients, each with its own look. They sit with the album covers, posters and prints from about ten years of work.",
  /* "The photograph was shot on film and blown up to street size." */
  "fig/4x6": "One 4x6 film photograph was blown up to fill a storefront window. It was shot on film and printed at street size.",
};
