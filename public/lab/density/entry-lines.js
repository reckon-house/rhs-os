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
};
