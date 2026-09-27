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

   A figure's line ties the number back to what the work solved (27 Sept,
   his "for 'figures' - to make them really make sense can we relate them
   back to what the project solved or did, ya know? that extra bit of
   context really sells it"): the ink sentence says what the number was a
   problem of, the grey one what was built and what changed, each from
   the study's own words, quoted in a comment above the line. A figure
   whose study says no problem (a timeline, a career fact) stays plain.
   The rule is kept in CLAUDE.md too, so new work gets the same.

   To change a line, change the words; to take one away, delete it. */
window.ENTRY_LINES = {
  /* A.R.C.: "Perceptron's Mk1 model reads the physical world from footage
     ... picks up the spatial context a single photo misses. Sweep a room
     with your phone and Mk1 reads the whole thing." */
  "tool/perceptron-mk1": "Mk1 is Perceptron's model for reading the physical world from video. I used it in A.R.C. so you can sweep a room with your phone and it catches what a single photo misses.",

  /* Robert Rodriguez x Neiman's: shot in one day; run across social,
     email, the stores and editorial; "Every piece in the campaign is some
     mix of those three" (four photographs, a typeface family, a color field) */
  /* what it answered: Robert Rodriguez: "shot in one day and run across social, email, the stores, and editorial" */
  "fig/four-photographs": "Neiman Marcus's spring campaign had one studio day to cover social, email, the stores and editorial. Every piece is some mix of four photographs, one typeface family and a color field.",

  /* the two studies this figure stacks: the Hill Country kitchen ("Sage
     green cabinetry, raw white oak, veined marble, unlacquered brass") and
     the Fairview sitting room ("stone, velvet, brass, and warm oak") */
  /* what it answered: Kitchen: "Four materials, picked before the first cabinet was drawn and used on every surface" */
  "fig/four-materials": "The Hill Country kitchen was designed from four materials picked before the first cabinet was drawn, and between them they cover every surface: sage green, white oak, marble and brass. The Fairview sitting room keeps to stone, velvet, brass and warm oak.",

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
  "tool/adobe-creative-suite": "Adobe's design apps show up across the interiors work, from the Fairview suite to the Mountain View chalet.",
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
  "tool/claude-code": "Claude Code is Anthropic's coding agent, and it's where I build. It was the main environment for A.R.C. and Sally Marketing OS, Faux Reel took a day in it, and this site runs in it too.",
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
  "tool/illustrator": "Illustrator is Adobe's drawing app, for logos, type and patterns. It runs through the brand work, from the early posters and logos to Capitan Boot Co., J. Christianson and the Robert Rodriguez campaign.",
  "tool/indesign": "InDesign handles layout, anything with pages and type. It's behind the print and editorial work, from Neiman Marcus's editorial hub to the Hill Country Oakworks campaign.",
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
  "tool/openai": "OpenAI makes the GPT models and their image tools. In A.R.C. its Vision API reads photographs, and in Sally Marketing OS its GPT-Image-2 does the studio photography.",
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
  "tool/photoshop": "Photoshop is Adobe's photo editor, and it's in more of these projects than any other tool. They run from the early posters and album covers to Cosmo Prof, You By Sally and the Robert Rodriguez campaign.",
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
  /* what it answered: About: "led the redesign of the digital experience, from marketing down to the product page"; "the new CMS saved $3M over four years" */
  "fig/eight-years": "I spent eight years at Nordstrom and led the redesign of its digital experience, from marketing down to the product page. I also worked with engineering on the new CMS behind it, which saved $3M over four years.",
  /* what it answered: Sally OS: "Sally ships thousands of assets per month ... and that output breaks when the tools underneath it don't share context"; About: "the marketing platform a 2,000-store retailer now runs on daily" */
  "fig/2-000-store": "A 2,000-store retailer ships thousands of marketing assets a month, and that output breaks when the tools underneath don't share context. I came up with Sally Marketing OS to connect them, and the company runs on it every day.",
  /* what it answered: Ivy Park: "Beyoncé's first activewear line. Nordstrom had the exclusive US partnership"; "most of the product gone within days" */
  "fig/six-weeks": "Beyoncé's first activewear line launched in the US at Nordstrom, its exclusive partner, six weeks from concept to live. I led that digital launch, and most of the product was gone within days.",
  "fig/1-3m": "For a couple of years I led interior design and selections on custom homes, on $1-3M builds. In 2023 Floor & Decor named me Designer of the Quarter.",
  "fig/four-years": "Over four years, the new CMS at Nordstrom saved $3M. The redesigned UI and templates also cut concept-to-web time 35%.",
  /* Nordstrom framework: "Engagement lifted 22% over two years."; "Four
     buckets sort the homepage, email, and landing pages the way a magazine
     sorts its sections." */
  /* what it answered: Framework: "Nordstrom was producing more digital content than the site had structure for ... Customers got the whole pile and no way through it"; "Engagement lifted 22% over two years" */
  "fig/22": "Nordstrom was publishing more content than the site had structure for, and customers got the whole pile with no way through it. The framework I concepted sorted it into four named buckets, and engagement rose 22% over two years.",
  "fig/35": "Redesigning Nordstrom's UI and templates cut concept-to-web time 35%. That's the time from an idea to a live page.",
  "fig/27": "At Sally Beauty and CosmoProf I built the in-house creative teams and a new operating model. Execution efficiency went up 27%.",
  "fig/30": "At PetSmart, new site patterns, email templates and AI-assisted product photography lifted creative output 30%. I build the tools as much as the output.",
  /* Faux Reel */
  /* what it answered: Faux Reel: "A sizzle reel is usually footage: shot, edited, rendered, hosted" */
  "fig/4-8kb": "A sizzle reel usually means footage, shot, edited, rendered and hosted. Faux Reel does it with stills and a 4.8KB web component, smaller than any one of the photographs it plays.",
  /* Sally Marketing OS */
  /* what it answered: Sally OS: "I rebuilt each piece with AI and connected them into a single pipeline"; "Four months in, it is six deployed applications with a shared brain" */
  "fig/four-months": "In four months I rebuilt Sally's marketing tools with AI and connected them, because the output broke whenever they didn't share context. It's six deployed apps working from one brain now, and it reads the market and proposes the campaigns on its own.",
  "fig/two-week": "Research that used to mean a two-week turnaround now gets answered in the same conversation where the strategy is being written. In Sally Marketing OS, that's Perplexity's job.",
  "fig/three-minutes": "The executive deck used to take half a day of a designer's time. In Sally Marketing OS it's one click and three minutes, built straight from the campaign brief.",
  /* what it answered: Sally OS: "It takes about a minute to turn one brief into four channels" */
  "fig/four-channels": "A campaign brief has to become social copy for four channels. In Sally Marketing OS one tool does that in about a minute.",
  /* Dallas Sport Collective: "a six-trainer gym in North Texas"; "out of
     Celina and McKinney, Texas, with a Frisco headquarters on the way";
     "the full trainer roster and the program menu"; "the part I find the
     most fun: an MCP server with eleven tools" */
  /* what it answered: DSC: "grew from a handful of athletes to more than a hundred ... a pile of texts, handwritten notes, emails, and a Google Sheet"; "6 Trainers: One shared calendar" */
  "fig/six-trainers": "Dallas Sport Collective's six trainers were scheduling more than a hundred athletes through texts, notes and a spreadsheet. I built them one shared calendar, and members book into it from the app or their own AI.",
  /* a figure tied back to what the work solved (27 Sept, his "for
     'figures' - to make them really make sense can we relate them back to
     what the project solved or did"). Sources: "the schedule underneath it
     all was a pile of texts, handwritten notes, emails, and a Google Sheet
     nobody fully trusted"; "one deterministic engine that checks trainer
     availability, double-bookings, floor capacity"; "The owner side is
     built for one person on the gym floor"; "approving each request with
     one tap" */
  "fig/eleven-programs": "Dallas Sport Collective runs eleven programs, from NFL Combine prep to prenatal fitness, and the schedule for all of them lived in texts, notes and a spreadsheet. I built the booking platform they run on now, where one engine checks every trainer's time and the floor before anything gets booked.",
  "fig/seven-days": "Dallas Sport Collective is open seven days a week across two locations, and one person on the gym floor runs the schedule. Athletes book from the app or from the AI they already use, and the owner approves each request with one tap.",
  /* what it answered: DSC: "An athlete never has to open the app"; "which trainer fits a goal" */
  "fig/eleven-tools": "With eleven tools on Dallas Sport Collective's MCP server, an athlete never has to open the app. They ask the AI they already use, and it reads their schedule, matches a trainer to a goal and puts in a session request.",
  /* A.R.C. */
  "fig/300-000-items": "The average American household holds around 300,000 items. Most homeowners have never added up what they're worth, and A.R.C. does that from the camera.",
  "fig/60": "About 60% of homeowners are underinsured because they've never cataloged what they own. The apps for it ask you to type every item in by hand, so A.R.C. works from the camera instead.",
  "fig/ten-weeks": "A.R.C. went from concept to live product in ten weeks. I built it end to end: concept, code, brand and go-to-market.",
  "fig/50-70": "A standard homeowner's policy covers your belongings at 50-70% of what the house is insured for. A.R.C. calculates whether that actually covers what you own.",
  "fig/400-000": "Take a home insured at $400,000. A standard policy covers the things inside it for around $200,000-$280,000, and A.R.C. checks what you own against that.",
  "fig/200-000-280-000": "That's roughly what a standard policy covers for the belongings in a $400,000 home. A.R.C. puts what you own next to that limit and shows the gap in dollars.",
  /* "Done properly for an average home, that takes 40+ hours. Hardly anyone
     finishes."; "So a whole house becomes a room-by-room scan that takes minutes." */
  "fig/40-hours": "A proper home inventory by hand takes 40+ hours for an average home, and hardly anyone finishes. A.R.C. turns it into a scan, room by room.",
  /* "The categories are set up the way insurance claims are."; "Each one
     maps to a standard personal property claim classification."; "none of
     it asks you to know any insurance terminology" */
  "fig/thirteen-categories": "A.R.C. sorts everything it finds into thirteen categories, from furniture and artwork to jewelry and documents. They match the standard classes of a personal property claim, so the list is ready to use without anyone learning insurance terms.",
  "fig/five-years": "Five years after a policy is set, a home might be $50,000 short, and there's no way to know until something goes wrong. A.R.C. shows that gap as a dollar amount.",
  /* "You set the coverage amount when you buy the policy and it tends to
     sit there. Meanwhile the stuff inside the house keeps changing" */
  /* what it answered: A.R.C.: "You set the coverage amount when you buy the policy and it tends to sit there"; "shows the gap against your policy as a dollar amount" */
  "fig/50-000": "A home covered five years ago might be $50,000 short today, because the coverage gets set once while the things inside keep changing. A.R.C. puts what you own now against the policy and shows that gap in dollars.",
  "fig/weeks-9-10": "The last two weeks of A.R.C.'s ten were brand and launch. Weeks 9-10 covered the identity and visual system, the marketing site and the go-to-market work.",
  /* "The same 73-item home, documented both ways. The 8-12 hours is an
     estimate. The 30 minutes is how long the app takes." */
  "fig/8-12-hours": "Documenting a 73-item home by hand is an estimated 8-12 hours. A.R.C. does the same home in about 30 minutes.",
  "fig/30-minutes": "A.R.C. documents a 73-item home in about 30 minutes. By hand it's an estimated 8 to 12 hours, so it runs 16 to 24 times faster.",
  "fig/10-weeks": "A.R.C. took 10 weeks from concept to launch, in five two-week steps. They were validation, architecture, the interface, the financial layer, and the brand and go-to-market.",
  "fig/2-wks": "Each step of A.R.C.'s build took two weeks. There were five of them, from validating the concept through the brand and the launch.",
  /* Robert Rodriguez: "One model, four setups, and the photographs layered
     over each other so the same few pictures could carry a whole look." */
  /* what it answered: Robert Rodriguez: "the budget covered one day in the studio"; "One model, four setups, and the photographs layered over each other" */
  "fig/four-setups": "Neiman Marcus's budget for the Robert Rodriguez campaign covered one day in the studio, so the shoot was one model in four setups. Layering the photographs over each other let a few pictures carry the whole look.",
  /* Hill Country home */
  /* what it answered: Kitchen: "Shaker cabinet doors ... open shelving are contemporary, the cremone bolts and schoolhouse pendants are European antique"; "It works as one room because all of it is in the same four finishes" */
  "fig/four-finishes": "The Hill Country kitchen puts Shaker cabinets, contemporary shelving and European antique hardware in one room. It holds together because every piece, new or vintage, is in the same four finishes.",
  /* what it answered: Kitchen: "used for cooking, gathering, and working in about equal measure"; "Eight feet of usable counter, with the open shelving facing the dining side" */
  "fig/eight-feet": "The Hill Country kitchen gets used for cooking, gathering and working in about equal measure, so its island carries eight feet of usable counter. Open shelving faces the dining side, with the seating at the other end.",
  /* what it answered: Bath: "Counters in a warm-veined Calacatta, shower walls in a cooler, grayer slab ..., floor in hex marble mosaic. The three were picked to go together, which keeps 400 square feet of hard surface from looking like a showroom" */
  "fig/400-square-feet": "The Hill Country primary bath is 400 square feet of hard surface, which can look like a showroom. Three marbles picked to go together keep it from that: warm Calacatta on the counters, a cooler slab in the shower, hex on the floor.",
  /* Black & white type: "Dots at two scales, lines in three directions, and
     a diamond grid, each one drawn as a positive and a negative, twelve
     tiles in all. They fill the letterforms, spill outside them, and sit
     behind them as backgrounds. Three lithographs came out of that set." */
  /* what it answered: Black & white type: "The question was how much range a small set of patterns could produce once color, photography and gradients were off the table" */
  "fig/twelve-tiles": "With color, photography and gradients off the table, Black & white type asked how far twelve pattern tiles could go. Dots, lines and a diamond grid, each drawn positive and negative, fill the letters, spill out of them and sit behind them, and three lithographs came out of it.",
  /* what it answered: Black & white type: "blown up like that the angle gives the whole stack some speed" */
  "fig/45-degree": "One 45-degree stripe at the same line weight runs through two of the prints. In one it's a single crossbar, and in the other it fills a slab letter top to bottom, where the angle gives the whole stack some speed.",
  /* Mountain View */
  /* what it answered: Chalet: "A 1968 Pacific Northwest chalet that hadn't been rethought since the '90s"; "Took it down to the studs" */
  "fig/16-foot": "The Mountain View chalet hadn't been rethought since the '90s, so it was taken to the studs and given 16-foot sliding glass doors on the main wall. Now the tree canopy is what you look at from every seat in the room.",
  /* Loved by Nordstrom */
  /* what it answered: Loved by Nordstrom: "a Nordstrom mandate to lift smaller designer labels on the department store floor and the digital storefront at the same time" */
  "fig/twelve-months": "Nordstrom wanted its smaller designer labels seen on the store floor and online at the same time, so Loved by Nordstrom ran for twelve months across social, email, in-store signage and web. The template took whatever photography each brand had already licensed.",
  /* what it answered: Loved by Nordstrom: "The template used whatever photography a brand had already licensed"; "scaled up to a 1440-wide hero with no new art direction, just a crop spec" */
  "fig/1080-square": "Loved by Nordstrom ran on photography the brands had already licensed, down to a 1080-square social post. A crop spec scaled that up to a 1440-wide hero with no new art direction.",
  /* what it answered: Loved by Nordstrom: "Loved by Nordstrom on the hero slots"; "no new art direction, just a crop spec" */
  "fig/1440-wide": "A 1440-wide hero on Loved by Nordstrom could come from a brand's 1080-square social post, so a label didn't need new photography to take a hero slot. A crop spec was all the art direction it took.",
  /* Ivy Park: "Four weeks for moodboards, wireframes and a concept pitch,
     then two weeks to build and ship. The brief came in under NDA before
     the team had cleared their schedules" */
  /* what it answered: Ivy Park: "this page had to be the store, the lookbook and the campaign at the same time"; "daily calls with Ivy Park while the direction locked" */
  "fig/four-weeks": "Ivy Park's page had to be the store, the lookbook and the campaign at once, and getting there took four weeks of moodboards, wireframes and a concept pitch. The brief came in under NDA before the team had cleared their schedules, with daily calls to Ivy Park while the direction locked.",
  /* what it answered: Ivy Park: "The custom CMS components built for the project went into Nordstrom's shared library" */
  "fig/two-weeks": "After the pitch, Ivy Park had two weeks to build and ship, on components Nordstrom's CMS didn't have yet. They were built for the launch, then went into the shared library.",
  /* what it answered: Ivy Park: "went into Nordstrom's shared library and powered other launches for two years" */
  "fig/two-years": "Ivy Park needed custom components in Nordstrom's CMS, and they outlasted it. They went into the shared library and powered other launches for two years.",
  /* Various design: "Album covers, posters, art prints, logos, and one
     storefront window, made over about ten years for musicians, friends,
     and a handful of brands." */
  /* what it answered: Various design: "Each one has its own look, made to fit that client" */
  "fig/ten-years": "Over about ten years I made album covers, posters, art prints, logos and one storefront window for musicians, friends and a handful of brands. Each one has its own look, made to fit that client.",
  /* what it answered: Various design: "hand-drawn type where a piece called for it" */
  "fig/four-album-covers": "The early work includes four album covers, each for a different act. Every one has its own look, with hand-drawn type wherever a piece called for it.",
  "fig/five-logos": "Five logos for five clients are in the early design work. Each one has its own look, made to fit that client.",
  /* what it answered: Various design: "Five logos for five clients" */
  "fig/five-clients": "Five different clients got the five logos in the early work. They were made over about ten years, next to album covers, posters and prints.",
  /* "The photograph was shot on film and blown up to street size." */
  /* what it answered: Various design: "one 4x6 film photograph blown up to fill a storefront window" */
  "fig/4x6": "One 4x6 photograph, shot on film, was blown up to fill a storefront window.",

  /* ── CAPABILITIES (drafted 27 Sept). What the capability looks like in
     this work, from the leads of the studies its shelf stacks. The counts
     are the studies that list it. Since his "lean towards OVER doing it",
     entry-reach.js widens where each reaches, so the lines keep to
     examples and scope that hold, not counts. ── */
  "cap/ai-integration": "AI is built into A.R.C., Sally Marketing OS and Dallas Sport Collective. At the gym, athletes book from whichever AI they already use, and the owner approves with a tap.",
  "cap/ai-strategy": "AI strategy runs through A.R.C., Dallas Sport Collective and, most of all, Sally Marketing OS. It knows the brand, reads the market and the customers, and has started proposing campaigns on its own.",
  "cap/album-art": "Album covers are part of about ten years of design work for musicians, friends and a handful of brands. Each one has its own look, made to fit that client.",
  "cap/apparel-graphics": "Apparel graphics run from Capitan Boot Co.'s badges, built to be stamped, stitched and embossed, to the early design work and J. Christianson's fashion line.",
  "cap/art-direction": "Art direction runs through the campaign and editorial work, from Neiman Marcus's editorial hub in 2012 to the Robert Rodriguez campaign in 2024.",
  "cap/art-selection": "Choosing the art is part of every room here, from the Hill Country house to the Fairview and the Mountain View chalet.",
  "cap/brand-design": "Brand design runs through this work, from Nordstrom.com's names, icons and custom lockups to Capitan Boot Co.'s marks and J. Christianson's four-circle logo.",
  "cap/brand-development": "Brand development here runs from J. Christianson, built from the name outward, to Capitan Boot Co., Amber Shockey & Co. and A.R.C.",
  "cap/brand-identity": "Brand identities here include Capitan Boot Co., made to be stamped into leather and still read, and J. Christianson, built from the name outward. A.R.C.'s came with the app, which I designed and built.",
  "cap/brand-system": "Jeffrey New York's first online store came with a whole brand system: the brand, the site and the way it told stories. You By Sally's campaign ran on one grid, from a bio page to a retail sign.",
  "cap/campaign-design": "Campaigns here run from the Ivy Park launch at Nordstrom to Hill Country Oakworks' billboards and the Robert Rodriguez spring campaign at Neiman Marcus.",
  "cap/campaign-direction": "You By Sally's campaign used real people instead of models, oversized swatches, and one grid that runs from a bio page to a retail sign.",
  /* Amber Shockey & Co.: "three collections in"; "Each one is built to
     layer, from a single accent dish to the whole table." */
  "cap/colorway-development": "Colorways run through the brand work, from J. Christianson's tree drawing in four colorways to Amber Shockey & Co.'s tableware and A.R.C.'s palette.",
  "cap/construction-documentation": "Every room here goes to construction with full documents behind it. AutoCAD and SketchUp are in all eight.",
  "cap/content-strategy": "The content strategy for Nordstrom.com came down to four buckets that sort the homepage, email and landing pages.",
  "cap/copywriting": "The words are part of the work, from the Ivy Park launch to Sally Marketing OS, which writes copy in the brand voice.",
  "cap/creative-direction": "Creative direction ties the campaign work together, from the Ivy Park launch and a year of Loved by Nordstrom to Cosmo Prof's digital refresh.",
  "cap/design-systems": "Design systems show up from Nordstrom's three tile shapes to Sally Marketing OS. The tiles resize for every breakpoint, so one picture works many ways.",
  "cap/digital-design": "Cosmo Prof's refresh brought new photography, simpler navigation and shoppable pieces built for working stylists. You By Sally's campaign carried its grid onto digital pages.",
  "cap/digital-strategy": "Jeffrey New York was closer to a gallery than a shop, so its first online store changes with the season and runs a story ahead of every sale.",
  "cap/ecommerce-design": "Jeffrey New York's first online store was built from zero, and every interaction from wireframe to checkout was prototyped.",
  "cap/editorial-design": "InSite, Neiman Marcus's digital editorial hub, was built to feel like a magazine and sell like a store.",
  /* Nordstrom beauty: "The answer was a set of templates the products
     could rotate through." */
  "cap/editorial-templates": "Editorial templates let Nordstrom's pages change without being rebuilt. In the beauty hub every story is shoppable, and the products rotate through a set of templates.",
  "cap/email-web-templates": "Email and web templates carry much of this work, from Jeffrey's spring campaign to Loved by Nordstrom and Sally Marketing OS.",
  "cap/engineering": "I engineer what I design here: A.R.C., Sally Marketing OS, Dallas Sport Collective and Faux Reel. Faux Reel's whole web component weighs 4.8KB.",
  "cap/engineering-ai-assisted": "A.R.C., Sally Marketing OS and Faux Reel were all built with Claude Code, the AI coding agent I work in. Faux Reel took a day.",
  "cap/experience-design": "The Ivy Park launch was designed as an experience, with parallax, animated polygon masks and full-bleed video that played on scroll.",
  "cap/exterior-direction": "Mountain View is a 1968 Pacific Northwest chalet, taken to the studs and rebuilt inside and out.",
  "cap/finish-coordination": "Finishes are coordinated across every room here. Floor & Decor named the studio Designer of the Quarter for three bathrooms that share one material kit.",
  "cap/finish-selection": "Finish selection is part of every room here, from the Fairview's charcoal violet walls and antiqued brass to the Hill Country kitchen's unlacquered brass.",
  "cap/fixture-selection": "Fixtures are chosen for every room, like the Hill Country kitchen's unlacquered brass on the pulls, the knobs and the faucet.",
  "cap/fixture-sourcing": "Fixtures are sourced for every room, from a hammered copper clawfoot tub in the Fairview suite to the Mountain View chalet's sputnik chandelier.",
  "cap/full-stack-engineering": "A.R.C., Sally Marketing OS, Dallas Sport Collective and Faux Reel are built end to end, from the database to the screen.",
  "cap/furniture-curation": "Furniture is curated for every room, from mid-century pieces with Western details in the Hill Country living room to the Fairview's chairs facing the fire.",
  "cap/go-to-market-strategy": "Launches here include Ivy Park at Nordstrom, Jeffrey New York's first online store and A.R.C., whose go-to-market was part of the build.",
  "cap/graphic-design": "Graphic design runs from the early album covers and gig posters to J. Christianson's tree drawing, in four colorways for the whole line.",
  /* About and Floor & Decor: Designer of the Quarter, 2023 */
  "cap/interior-design": "Eight of these projects are rooms, from a 1968 chalet taken to the studs to a Hill Country kitchen built from four materials. Floor & Decor named the studio Designer of the Quarter in 2023.",
  "cap/logo-design": "The logos here range from five made for five clients in the early work to J. Christianson's four-circle mark, which changes color by where it goes.",
  "cap/logo-system": "Some of these logos work as systems, like Capitan Boot Co.'s logo, type and badges, or J. Christianson's mark that changes color by where it goes.",
  "cap/material-selection": "Material selection runs through every room here. Floor & Decor's three bathrooms share one kit: marble, dolomite, white oak and classic tile.",
  "cap/material-specification": "Every room here is specified material by material, like the Hill Country living room's limestone fireplace wall and reclaimed pine.",
  "cap/naming": "Names are part of the work too, from J. Christianson, built from the name outward, to A.R.C. and Faux Reel.",
  "cap/pattern-design": "Patterns run through Amber Shockey & Co.'s tableware and through Black & white type, where they fill the letterforms.",
  /* Various design: "Grunge compositing and hand-drawn type for the pop
     artist"; Robert Rodriguez: "four photographs from one day, layered
     over each other" */
  "cap/photo-compositing": "Compositing goes back to the grunge work for a pop artist in the early design days. In the Robert Rodriguez campaign, four photographs are layered over each other.",
  "cap/photo-direction": "Neiman Marcus's editorial hub ran on studio-shot photography, next to the layouts and the runway typography.",
  "cap/photography": "Some of the photography started as personal work. Photographs from a family trip through West Texas later became the backdrops for the Capitan Boot Co. campaign.",
  /* Cosmo Prof: "The templates set photography, type and layout once." */
  "cap/photography-direction": "Cosmo Prof's refresh brought new photography, and its templates set the photography, type and layout once.",
  "cap/poster-design": "Posters and prints run from the early gig posters to Black & white type's lithographs and Hill Country Oakworks' billboards.",
  "cap/product-applications": "The brands here go onto real products: Capitan Boot Co.'s boots and leather, Amber Shockey & Co.'s tableware, J. Christianson's fashion and home goods.",
  "cap/product-design": "Products here run from Amber Shockey & Co.'s tableware to A.R.C., Sally Marketing OS and Faux Reel.",
  "cap/product-management": "A.R.C., Sally Marketing OS, Dallas Sport Collective and Faux Reel are each managed as products. A.R.C. went from concept to live in ten weeks.",
  "cap/product-photography-direction": "Nordstrom's personalized homepage needed product photography that could work many ways. Three tile shapes resize for every breakpoint, so one picture works across them.",
  "cap/retail-signage": "Signage takes this work into stores, from You By Sally's grid to Loved by Nordstrom's in-store tiles and Sally Marketing OS's shelf talkers.",
  "cap/space-planning": "Every room here is planned around how it gets used. The Hill Country kitchen's layout gives it eight feet of usable counter, with the open shelving facing the dining side.",
  "cap/story-development": "Story runs through the digital work, from Neiman Marcus's InSite to Jeffrey New York, which runs a story ahead of every sale.",
  "cap/typography": "Typography runs through the brand and editorial work, from Neiman Marcus's runway type to Black & white type's letterforms.",
  "cap/typography-design": "Type is the subject of Black & white type, six patterns and three lithographs in black ink on white paper. The Robert Rodriguez campaign uses one typeface family across every piece.",
  "cap/ux-architecture": "Jeffrey New York's first online store was mapped from wireframe to checkout, with every interaction prototyped.",
  /* Nordstrom beauty: "built as its own component so it could move to
     eye, cheek, or nail" */
  "cap/ux-design": "Nordstrom's beauty hub makes every story shoppable. One product story was built as its own component, so it could move to eye, cheek or nail.",
  "cap/visual-design": "Nordstrom's beauty hub is where the stories and the products share a page. Its templates let the products rotate through without the pages being rebuilt.",
  "cap/web-design": "I designed Dallas Sport Collective's marketing site, with the full trainer roster and program menu, on top of its booking platform.",
};
