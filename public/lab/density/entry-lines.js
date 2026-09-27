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

   To change a line, change the words; to take one away, delete it. */
window.ENTRY_LINES = {
  /* the six lines, What I make (27 Sept, his "do the same pass for the
     lines too"): each shelf's head says the problem the line answers and
     what was built, where the index keeps the board's short sentence.
     Then, reading them through, "should it be more strategic/a little
     marketing/agency in nature vs being that specific and diving right
     in? ... the digital version is closer": a line sits one altitude
     above its studies, so it says what that kind of work has to do and
     points at the work, and the specifics stay in the studies, the
     figures and the tools. Plain words, not an agency's, and the five
     open five different ways so the six do not read as a formula */
  /* what it answered: Ivy Park: "this page had to be the store, the lookbook and the campaign at the same time"; Nordstrom beauty: "New products launch weekly" */
  "line/digital": "A retail site has to be the store, the lookbook and the campaign at once, and stay current while new products land every week. These are the ones I designed and shipped, from Ivy Park's launch at Nordstrom to Jeffrey New York's first online store.",
  /* what it answered: A.R.C.: "your job turns into reviewing what it found"; DSC: "The AI only ever asks"; the board: "built end to end" */
  "line/app": "The tools here take the tedious part off your hands, the typing, the sorting and the back-and-forth, and leave the decisions with you. I built them end to end, from A.R.C. to Sally Marketing OS.",
  /* what it answered: Sally OS: "that output breaks when the tools underneath it don't share context"; Nordstrom framework: "it was organizing the teams before it reached a customer" */
  "line/systems": "When tools and teams don't share what they know, the output breaks somewhere between them. Nordstrom's content framework and Sally Marketing OS are two of the systems I built so they do.",
  /* what it answered: Robert Rodriguez: "shot in one day and run across social, email, the stores, and editorial"; Hill Country Oakworks: "The same idea runs on billboards, print, and digital" */
  "line/creative": "A campaign has to carry one idea across social, email, the stores and editorial, sometimes from a single day in the studio. This work runs from Neiman Marcus's InSite in 2012 to the Robert Rodriguez campaign in 2024.",
  /* what it answered: Capitan Boot Co.: "needed a brand that could take the same wear"; J. Christianson: "apparel, candles, hangtags, and print"; Amber Shockey & Co.: "from a single dish up to a full setting" */
  "line/branding": "Wherever a brand lands, stamped into leather, printed on a hangtag or set across a whole table, it has to hold up. The marks, type and patterns here were made for that, from Capitan Boot Co. to Amber Shockey & Co.",
  /* what it answered: Hill Country kitchen: "Every decision came back to how a family uses a kitchen day to day"; the board: "Rooms designed like products, down to the hardware" */
  "line/interiors": "Every decision in a room comes back to how it gets used day to day, down to the hardware. Eight rooms are here, from a Hill Country kitchen to a 1968 chalet taken to the studs.",

  /* A.R.C.: "Perceptron's Mk1 model reads the physical world from footage
     ... picks up the spatial context a single photo misses. Sweep a room
     with your phone and Mk1 reads the whole thing." */
  /* what it answered: A.R.C.: "picks up the spatial context a single photo misses"; "Video scanning runs on Perceptron's Mk1 model: sweep a room and the model reasons across the footage in real time" */
  "tool/perceptron-mk1": "A single photo misses a lot of what's around it, so A.R.C.'s video scan runs on Perceptron's Mk1. Sweep a room with your phone and it reasons across the footage in real time.",

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
  /* what it answered: Nordstrom personalization: "Nordstrom needed personalized content for millions of customers, and it couldn't look like a machine had made it" */
  "tool/asset-library": "Nordstrom needed personalized content for millions of customers, and it couldn't look machine-made. The asset library's pictures went into three tile shapes that resize for every breakpoint, so one picture works many ways.",
  /* what it answered: his note, 27 Sept: "autocad is indutry standard" */
  "tool/autocad": "AutoCAD is the industry standard for drawings, so it's where every room here gets drawn. It's in all eight interiors projects, from the Hill Country house to the Mountain View chalet.",
  /* Various design: "a film camera for the photography"; "one 4x6 film
     photograph blown up to fill a storefront window" */
  "tool/camera": "For the early design work, the photography came from a film camera. One of its 4x6 prints was blown up to fill a storefront window.",
  /* Robert Rodriguez: "The whole campaign is four photographs from one day" */
  /* what it answered: Robert Rodriguez: "the budget covered one day in the studio" */
  "tool/capture-one": "The Robert Rodriguez campaign for Neiman Marcus had one day in the studio to make every picture. The shoot ran through Capture One, software for shooting and editing photographs.",
  /* Sally OS: "Claude runs the chat and gets the reasoning jobs: turning
     competitive signals into recommendations, drafting the campaign brief
     from raw intel, writing copy in the brand voice." */
  /* what it answered: Sally OS: "Competitive intelligence feeds strategy, strategy produces briefs"; "Claude runs the chat and gets the reasoning jobs" */
  "tool/claude": "Sally's campaigns start as raw competitive intel, and in Sally Marketing OS Claude gets the reasoning jobs. It turns the signals into recommendations, drafts the brief and writes copy in the brand voice.",
  /* DSC: "paste one URL into the AI they already use, Claude, ChatGPT or
     Gemini, and ask it what's on their schedule, which trainer fits a goal,
     or to book Friday at 10am" */
  /* what it answered: DSC: "An athlete never has to open the app"; "paste one URL into the AI they already use" */
  "tool/claude-chatgpt": "Dallas Sport Collective's athletes already use Claude or ChatGPT, so booking a session doesn't need another app. They paste one link into it and ask what's on their schedule, which trainer fits a goal, or to book Friday at 10am.",
  /* A.R.C.: "Claude Code was my main environment the whole way through."
     Sally OS: "my development environment for all of it". About: "This site
     runs in Claude Code." */
  /* what it answered: A.R.C.: "Claude Code was my main environment the whole way through"; Faux Reel: "The build took a day with Claude Code"; About: "It's the CMS, the design tool and the build environment at once" */
  "tool/claude-code": "Claude Code is Anthropic's coding agent, and it's where I build: A.R.C. end to end, Sally Marketing OS, and Faux Reel in a single day. This site runs in it too, as the CMS, the design tool and the build environment at once.",
  /* Faux Reel: "runs on a timer ... with CSS animation and no video file
     anywhere"; "The finished web component weighs 4.8KB gzipped" */
  /* what it answered: Faux Reel: "A sizzle reel is usually footage"; "with CSS animation and no video file anywhere" */
  "tool/css": "A sizzle reel normally needs a video file. Faux Reel's motion is CSS animation instead, stills cut on a timer in one container, and the whole web component weighs 4.8KB.",
  /* Ivy Park: components the CMS "didn't have: parallax modules, animated
     polygon masks, full-bleed video that played on scroll ... So they got
     built"; they "powered other launches for two years" */
  "tool/custom-components": "Some pages needed things Nordstrom's CMS didn't have yet, so they got built. For Ivy Park that meant parallax, animated masks and video on scroll, and those components powered other launches for two years.",
  /* Loved by Nordstrom's own lead */
  /* what it answered: Loved by Nordstrom: "a Nordstrom mandate to lift smaller designer labels"; "merchandising had a dial they could turn without touching the design" */
  "tool/editorial-systems": "Nordstrom wanted its smaller designer labels lifted in stores and online at once, so the campaign became an editorial system around one heart icon. Liked sat on the day-to-day tiles and Loved on the heroes, a dial merchandising could turn without touching the design.",
  /* About: "writes and designs the emails, web assets and signage, and
     delivers them into Figma through a plugin I wrote" */
  /* what it answered: About: "writes and designs the emails, web assets and signage, and delivers them into Figma through a plugin I wrote" */
  "tool/figma": "Sally Marketing OS writes and designs the emails, web assets and signage, then delivers them into Figma through a plugin I wrote. The Cosmo Prof refresh was designed there too.",
  /* West Texas: "a family trip through Big Bend and the desert around
     Marfa"; "A few of these later became the backdrops for the Capitan
     Boot Co. campaign" */
  "tool/fuji-x-t30-35mm-prime": "A Fuji X-T30 with a 35mm lens took the West Texas photographs, on a family trip through Big Bend and around Marfa. A few of them later became backdrops for the Capitan Boot Co. campaign.",
  /* Various design: "hand-drawn type where a piece called for it";
     "Grunge compositing and hand-drawn type for the pop artist" */
  "tool/hand-rendering": "Some of the early design work is drawn by hand, wherever a piece called for it. The hand-drawn type for the pop artist is one.",
  /* Nordstrom beauty: "where every story is shoppable" */
  /* what it answered: Ivy Park: "this page had to be the store, the lookbook and the campaign at the same time" */
  "tool/html-css-js": "Ivy Park's page had to be the store, the lookbook and the campaign at once, with parallax, polygon masks and video playing on scroll. It was built in HTML, CSS and JavaScript, and so was Nordstrom's beauty hub.",
  /* what it answered: Capitan Boot Co.: "every mark had to come through that and still read"; "the bull skull lockup is drawn on a geometric grid" */
  "tool/illustrator": "Capitan Boot Co.'s marks had to be stamped into leather, stitched and embossed and still read, so the bull skull lockup was drawn in Illustrator on a geometric grid. It's the drawing app behind the brand work, from the early logos to J. Christianson.",
  /* what it answered: Hill Country Oakworks: "The campaign had to work on a roadside billboard and on a phone screen"; "sized for each" */
  "tool/indesign": "Hill Country Oakworks' campaign had to hold up on a roadside billboard and on a phone screen, and InDesign sized the same idea for each. Neiman Marcus's editorial hub, made to feel like a magazine, was laid out in it too.",
  /* Jeffrey NYC: "every interaction from wireframe to checkout was prototyped" */
  /* what it answered: Jeffrey New York: "Jeffrey had never sold online. The store itself was closer to a gallery than a shop"; "every interaction from wireframe to checkout was prototyped" */
  "tool/invision": "Jeffrey New York had never sold online, and its store felt more like a gallery than a shop. Every interaction on its first site, from wireframe to checkout, was prototyped in InVision before it was built.",
  /* DSC: "an MCP server with eleven tools"; "The same trainer data feeds
     the MCP server, so a connected AI describes a coach from the actual record" */
  /* what it answered: DSC: "The AI only ever asks"; "a write only ever creates a pending request the owner has to approve" */
  "tool/model-context-protocol": "Athletes at Dallas Sport Collective book from the AI they already use, but that AI only ever asks. Its MCP server gives it eleven tools that read the real records, and anything it books waits as a request for the owner to approve.",
  /* Sally OS: "The asset hub, the associate site, and the scoreboard are
     Next.js on Vercel." DSC: "Next.js on Vercel" */
  /* what it answered: his note, 27 Sept: "next.js and vercel being so flexible of a modern hostion application option" */
  "tool/next-js": "A marketing site, a booking platform and an internal asset hub are very different builds, and Next.js is flexible enough to be the base for all of them. It runs Dallas Sport Collective and Sally Marketing OS's asset hub, associate site and scoreboard.",
  /* Nordstrom beauty: "Built to stay current without a team rebuilding the
     pages every week." */
  /* what it answered: About: "At Nordstrom the new CMS saved $3M over four years" */
  "tool/nordstrom-cms": "At Nordstrom I worked with engineering to roll out a new CMS, and it saved $3M over four years. Three of these projects live in it, Ivy Park and the beauty hub among them.",
  /* DSC: "OAuth 2.0 consent with short-lived tokens" */
  /* what it answered: DSC: "Connecting runs through an OAuth consent screen with short-lived, rotating tokens, and access revokes from the dashboard in one tap" */
  "tool/oauth-2-0": "Letting an outside AI into a gym's schedule needs permission that can be taken back. Dallas Sport Collective's connection runs through an OAuth 2.0 consent screen with short-lived, rotating tokens, and access revokes from the dashboard in one tap.",
  /* Sally OS: "OpenAI's GPT-Image-2 for studio photography"; "Two passes
     through OpenAI's GPT-Image-2." */
  /* what it answered: A.R.C.: "The apps for it ask you to type every item in by hand" */
  "tool/openai": "Home inventory apps make you type every item in, so A.R.C. uses OpenAI's Vision API to read the photographs instead. Sally Marketing OS gets its studio photography from GPT-Image-2.",
  /* A.R.C.: "returns a structured read: what the object is, what it is
     made of, its style, its condition, and a rough era or manufacture period" */
  /* what it answered: A.R.C.: "so the valuation has enough detail to be accurate" */
  "tool/openai-vision-api": "A replacement value needs more than an object's name, so A.R.C. asks the OpenAI Vision API for the rest. From one photograph it returns what the thing is, what it's made of, its style, its condition and roughly how old it is.",
  /* Sally OS: "Perplexity is the live layer: industry news, competitor
     announcements, shifts in social sentiment ... pulled from the web as
     they happen." */
  /* what it answered: Sally OS: "A question that used to mean a research request and a two-week turnaround" */
  "tool/perplexity": "A research question at Sally used to mean a request and a two-week turnaround. Perplexity is the live layer in Sally Marketing OS now, pulling industry news, competitor announcements and shifts in social sentiment as they happen.",
  /* Loved by Nordstrom: "The template used whatever photography a brand
     had already licensed"; "a 1080-square social post scaled up to a
     1440-wide hero with no new art direction, just a crop spec" */
  "tool/photography-licensing": "Loved by Nordstrom's template used whatever photography a brand had already licensed. A 1080-square social post could become a 1440-wide hero with no new art direction, just a crop spec.",
  /* the most-listed tool: twelve studies */
  /* what it answered: Robert Rodriguez: "the photographs layered over each other so the same few pictures could carry a whole look" */
  "tool/photoshop": "With one studio day for the Robert Rodriguez campaign, the photographs were layered over each other in Photoshop so a few could carry the whole look. It's in more of these projects than any other tool, back to the early posters and album covers.",
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
  /* what it answered: Jeffrey spring: "Jeffrey needed a spring campaign that looked like it had been shot on location, on a studio budget" */
  "tool/studio-photography": "Jeffrey needed a spring campaign that looked like location work on a studio budget. The whole thing was made indoors, with monstera leaves and palm fronds cropped big enough to stand in for a place.",
  /* Sally OS: "An admin review dashboard updates live over Supabase Realtime." */
  "tool/supabase": "Supabase is a database platform built on Postgres. It holds the data for A.R.C., and in Sally Marketing OS an admin dashboard updates live over it.",
  /* Sally OS: "pgvector for a single embedding index that covers documents,
     product photography, and video scenes at once, so one search runs
     across text and pictures" */
  /* what it answered: Sally OS: "that output breaks when the tools underneath it don't share context" */
  "tool/supabase-pgvector": "Sally's output broke when its tools didn't share context, and what they knew was spread across documents, product photography and video. With pgvector, Sally Marketing OS keeps one index over all three, so one search covers text and pictures.",
  "tool/typescript": "TypeScript is JavaScript with types. It's part of Faux Reel, which builds a sizzle reel out of still photographs.",
  /* what it answered: his note, 27 Sept: "next.js and vercel being so flexible of a modern hostion application option" */
  "tool/vercel": "Every app here needs a place to run, and Vercel is the flexible, modern option for hosting one. A.R.C., Dallas Sport Collective and Sally Marketing OS's asset hub, associate site and scoreboard all deploy on it.",
  /* Sally OS: Gemini "reads Sally's internal knowledge base on the first
     message, so every conversation opens with the brand guidelines,
     campaign history, product catalogs ... already loaded"; "That takes a
     million-token context window, which Gemini has." */
  /* what it answered: Sally OS: "That takes a million-token context window, which Gemini has" */
  "tool/gemini": "Sally's knowledge base is too big for most models to hold at once, and Gemini holds a million tokens. In Sally Marketing OS it reads the whole thing on the first message, so every conversation opens with the brand guidelines, campaign history and product data already loaded.",

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
  /* what it answered: DSC: "a pile of texts, handwritten notes, emails, and a Google Sheet nobody fully trusted"; "the AI they already use" */
  "cap/ai-integration": "Dallas Sport Collective's athletes were already using AI, while the gym's schedule lived in texts, notes and a spreadsheet. Now they book through the AI they use, one engine checks every request, and the owner approves with a tap.",
  /* what it answered: Sally OS: "I rebuilt each piece with AI and connected them into a single pipeline" */
  "cap/ai-strategy": "Sally ships thousands of assets a month, and the output broke wherever its tools didn't share context. The strategy was to rebuild each tool with AI and connect them into one pipeline, and Sally Marketing OS now proposes campaigns on its own.",
  "cap/album-art": "Album covers are part of about ten years of design work for musicians, friends and a handful of brands. Each one has its own look, made to fit that client.",
  /* what it answered: Capitan Boot Co.: "Stamps blur and embossing flattens out, so every mark had to come through that and still read" */
  "cap/apparel-graphics": "Capitan Boot Co.'s badges go onto boots and apparel, where a stamp blurs and embossing flattens out, so each one was drawn to come through and still read. J. Christianson's tree drawing runs on its apparel in four seasonal colorways.",
  /* what it answered: Neiman Marcus: "There was no location budget, so graphic color blocks stood in for the places a bigger production would have flown to" */
  "cap/art-direction": "Neiman Marcus's InSite had no location budget, so graphic color blocks stood in for the places a bigger production would have flown to. Twelve years later the Robert Rodriguez campaign had one studio day, and one model in four setups carried it.",
  /* what it answered: Hill Country living: "an original painting by Dwight D. Eisenhower hangs with landscape pieces in gilded frames" */
  "cap/art-selection": "The Hill Country living room's limestone wall carries an original painting by Dwight D. Eisenhower, hung with landscape pieces in gilded frames. In the Fairview entry, a slatted wood geometric and a dark abstract flank the bench.",
  /* what it answered: Nordstrom framework: "A custom icon and a typographic mark sourced for each one, and names that sound like a magazine's sections" */
  "cap/brand-design": "Nordstrom was publishing more content than its site had structure for, so each section of the new framework got a name, an icon and a typographic mark of its own. Capitan Boot Co. and J. Christianson got whole brands, down to the logos.",
  /* what it answered: J. Christianson: "the brand started from nothing: the name first, then the mark, the palette, the type, and the product graphics" */
  "cap/brand-development": "J. Christianson started from nothing, so the brand was built from the name outward: the mark, the palette, the type, then the product graphics. A.R.C.'s brand was made in the last two weeks of its build, with the marketing site and the launch.",
  /* what it answered: Capitan Boot Co.: "needed a brand that could take the same wear"; "Every piece works stamped, stitched, embroidered, or printed" */
  "cap/brand-identity": "Capitan Boot Co. makes Western boots and needed a brand that could take the same wear. Its logo, badges and lockups work stamped, stitched, embroidered or printed, and still read.",
  /* what it answered: Jeffrey New York: "Modular grids so the layouts could change with the season, a type hierarchy that stayed sharp everywhere it showed up" */
  "cap/brand-system": "Jeffrey New York had never sold online, and its store felt like a gallery, so its first site was built as a system. Modular grids change with the season, and a type hierarchy stays sharp everywhere it shows up.",
  /* what it answered: Hill Country Oakworks: "look like a heritage brand at both sizes"; "It pulls from mid-century poster design" */
  "cap/campaign-design": "Hill Country Oakworks' campaign had to read as a heritage brand on a roadside billboard and on a phone screen. It borrows from mid-century posters, with warm color blocking and an oak silhouette, and the same idea runs at every size.",
  /* what it answered: You By Sally: "the brief was to make it something you would choose on purpose"; "real people instead of models, and the rest of the campaign came off those portraits" */
  "cap/campaign-direction": "You By Sally's brief was to take hair color off the drugstore shelf and make it something you'd choose on purpose. The campaign was cast with real people instead of models, and everything else came off their portraits.",
  /* Amber Shockey & Co.: "three collections in"; "Each one is built to
     layer, from a single accent dish to the whole table." */
  /* what it answered: Amber Shockey & Co.: "each runs in several colorways, so the same set can go minimal or maximal"; "every new collection has to sit next to the ones before it" */
  "cap/colorway-development": "Amber Shockey & Co.'s sets have to go minimal or maximal depending on what they're paired with, so every collection runs in several colorways. Each new one also has to sit next to the collections before it.",
  "cap/construction-documentation": "Every room here goes to construction with full documents behind it. AutoCAD and SketchUp are in all eight.",
  /* what it answered: Nordstrom framework: "all hitting email and the site at the same time with nothing sorting them"; "it was organizing the teams before it reached a customer" */
  "cap/content-strategy": "Nordstrom's brand launches, seasonal pushes, occasion guides and new arrivals were all landing at once, with nothing sorting them. The strategy came down to four named buckets for the homepage, email and landing pages, and it was organizing the teams before it reached a customer.",
  /* what it answered: Ivy Park: "The photography was supplied ... and everything else was open: typography, layout, copy, animation, interaction" */
  "cap/copywriting": "Ivy Park's photography came supplied, and everything else was open, the copy included. Sally Marketing OS writes in the brand voice now, turning one brief into four channels of social in about a minute.",
  /* what it answered: Robert Rodriguez: "felt current and still kept the brand's romantic side, and the budget covered one day in the studio"; "'80s mall glam meets high fashion" */
  "cap/creative-direction": "Neiman Marcus wanted a Robert Rodriguez campaign that felt current and kept the brand's romantic side, on one day in the studio. The answer was '80s mall glam meeting high fashion, run across social, email, the stores and editorial.",
  /* what it answered: Nordstrom personalization: "The rules were strict enough to run at that scale, and the pages still came out different from each other" */
  "cap/design-systems": "Nordstrom needed personalized content for millions of customers that didn't look machine-made. The system was three tile shapes that resize and restack across phone and desktop, strict enough to run at that scale while every page still came out different.",
  /* what it answered: Cosmo Prof: "The job was new visual direction and clearer product discovery" */
  "cap/digital-design": "Cosmo Prof's stylists needed clearer product discovery on a dated site. The new homepage has tabbed recommendations personalized to each stylist, shoppable video you can buy from while it plays, and a header cut back so the content gets the screen.",
  "cap/digital-strategy": "Jeffrey New York was closer to a gallery than a shop, so its first online store changes with the season and runs a story ahead of every sale.",
  /* what it answered: Jeffrey New York: "the job was to get that feeling onto a screen"; "product pages that opened on the photography, navigation organized around the edit instead of by category" */
  "cap/ecommerce-design": "Jeffrey had never sold online, and the job was to get the feeling of an edited gallery onto a screen. Its first store opens product pages on the photography and organizes navigation around the edit instead of by category.",
  /* what it answered: Neiman Marcus: "The mandate was to make the website feel like a magazine and sell product like a store" */
  "cap/editorial-design": "Neiman Marcus wanted InSite to feel like a magazine and sell like a store at the same time. Designer names ran as big as the photographs, and sometimes the type broke the grid, trusting the shopper would still find the price.",
  /* Nordstrom beauty: "The answer was a set of templates the products
     could rotate through." */
  /* what it answered: Nordstrom beauty: "Beauty content ages fast"; "built so merchandising could swap products without touching the layout" */
  "cap/editorial-templates": "Beauty content goes stale fast, with launches every week and trends turning with the season. Nordstrom's beauty hub answered with three story templates the products rotate through, so merchandising can swap them without touching the layout.",
  /* what it answered: Jeffrey spring: "The whole thing was one kit that ran on email, the homepage and social" */
  "cap/email-web-templates": "Jeffrey's spring campaign had to run on email, the homepage and social from one studio shoot, so it was built as one kit. At PetSmart, new email templates and site patterns helped lift creative output 30%.",
  /* what it answered: DSC: "flows through one deterministic engine that checks trainer availability, double-bookings, floor capacity, allowed durations, and cancellation rules" */
  "cap/engineering": "Dallas Sport Collective's bookings come in by voice, from an athlete's AI or by a tap, and each one has to respect trainer hours, double-bookings, floor capacity and cancellation rules. One deterministic engine checks all of it, so the AI only ever asks.",
  /* what it answered: A.R.C.: "Claude Code was my main environment the whole way through"; Faux Reel: "most of it spent finessing the timing" */
  "cap/engineering-ai-assisted": "A.R.C. went from concept to live product in ten weeks with one person building it, in Claude Code the whole way through. Faux Reel took a day in it, most of that spent on the timing.",
  /* what it answered: Ivy Park: "The polygon showed up during concepting as a way to break the rectangular grid the photography came in" */
  "cap/experience-design": "Ivy Park's supplied photography came in rectangles, and the polygon showed up in concepting as a way to break that grid. Angled, rotated and animated on scroll, it ran from the hero through the product carousels into the email headers.",
  /* what it answered: Mountain View: "an exterior that disappeared on cloudy days"; "Exterior repainted warm gray with white railings. New lighting on the patio and stairs at night" */
  "cap/exterior-direction": "The Mountain View chalet's exterior disappeared on cloudy days. It was repainted a warm gray with white railings, with new lighting on the patio and stairs for the nights.",
  /* what it answered: Floor & Decor: "the kit every project pulled from, and each one used it differently" */
  "cap/finish-coordination": "Three bathrooms in three different styles all pulled from one material kit: marble, dolomite, white oak and classic tile. Each room stands on its own, and Floor & Decor named the studio Designer of the Quarter for them.",
  /* what it answered: Fairview suite: "The layers work together because the tonal range stays narrow: blues, grays, warm metals" */
  "cap/finish-selection": "The Fairview suite piles on velvet, linen, bouclé and faux fur, and the layers work together because the finishes keep a narrow range: blues, grays and warm metals. Brass sits at every furniture base and fixture.",
  /* what it answered: Hill Country bath: "Two rooms from the kitchen, and softer than it"; "swaps the brass for polished nickel" */
  "cap/fixture-selection": "The Hill Country bath is softer than the kitchen two rooms away, and its fixtures are part of why: polished nickel instead of brass. Globe sconces sit at both vanities, with wall-mounted cross-handle faucets.",
  "cap/fixture-sourcing": "Fixtures are sourced for every room, from a hammered copper clawfoot tub in the Fairview suite to the Mountain View chalet's sputnik chandelier.",
  /* what it answered: DSC: "The founder needed two things at once: a brand that matched where the gym was headed, and a back office that could keep up" */
  "cap/full-stack-engineering": "Dallas Sport Collective's founder needed a brand that matched where the gym was headed and a back office that could keep up. Both came as one build, from the database to the screen: a marketing site, an athlete app, an owner console and an MCP server.",
  /* what it answered: Mountain View: "Furniture kept simple on purpose so it doesn't compete with what's outside the glass" */
  "cap/furniture-curation": "The Mountain View chalet looks out through its glass onto the tree canopy, so the furniture was kept simple enough not to compete. There's a tufted gray sofa, a woven bench, a walnut dining set and a ladder shelf against painted stone.",
  /* what it answered: A.R.C.: "Weeks 9-10 were the brand identity and visual system, the marketing site, and the go-to-market work, and then launch" */
  "cap/go-to-market-strategy": "The last two weeks of A.R.C.'s ten-week build were the brand, the marketing site and the go-to-market. Ivy Park's launch at Nordstrom went from concept to live in six weeks.",
  /* what it answered: J. Christianson: "A tree silhouette does the rest, drawn once and run in four seasonal colorways over a striped field in the brand colors" */
  "cap/graphic-design": "J. Christianson needed product graphics for a whole line, and one tree drawing covers it. It runs in four seasonal colorways over a striped field in the brand colors, on apparel, candles, hangtags and print.",
  /* About and Floor & Decor: Designer of the Quarter, 2023 */
  /* what it answered: Mountain View: "hadn't been rethought since the '90s"; Hill Country kitchen: "The mix of periods is on purpose" */
  "cap/interior-design": "A 1968 chalet hadn't been rethought since the '90s, and a Hill Country kitchen mixes three periods on purpose. Eight rooms are here, each worked out down to the hardware, and Floor & Decor named the studio Designer of the Quarter in 2023.",
  /* what it answered: J. Christianson: "so the one mark can change palette and still be recognized" */
  "cap/logo-design": "J. Christianson's logo had to change palette with the setting and still be recognized, so it's four circles in a tight grid that keep their shape while the colors move. The early work has five more logos, for five clients.",
  /* what it answered: Capitan Boot Co.: "on a hangtag or across a banner"; "a primary logo, secondary badges, typographic lockups, and a set of illustrations" */
  "cap/logo-system": "Capitan Boot Co.'s marks had to read on a hangtag and across a banner, so the identity is a system: a primary logo, secondary badges, typographic lockups and a bull skull drawn on a geometric grid. Northwest Regular and Oldman Regular are the type pairing.",
  /* what it answered: Fairview sitting room: "The palette is four materials: stone, velvet, brass, and warm oak, and no accent colors" */
  "cap/material-selection": "The Fairview sitting room is formal, a little glam and comfortable to sit in, on four materials alone: stone, velvet, brass and warm oak. There are no accent colors and no television, and the chairs face the fire.",
  /* what it answered: Hill Country living: "a floor-to-ceiling limestone fireplace wall. Reclaimed 1950s pine on the floor, exposed beams overhead, brass fixtures" */
  "cap/material-specification": "The Hill Country living room is specified down to its surfaces: a floor-to-ceiling limestone fireplace wall, reclaimed 1950s pine underfoot, exposed beams overhead and brass fixtures. Every piece of furniture was chosen for how it will age.",
  /* what it answered: Nordstrom framework: "names that sound like a magazine's sections" */
  "cap/naming": "Nordstrom's content needed sorting into sections a customer could follow. Each got a name that sounds like a magazine's: What's Now, On Our List, Where to Wear and Wear to Where.",
  /* what it answered: Amber Shockey & Co.: "a hero pattern, a secondary, and an accent, made to layer from a single dish up to a full setting" */
  "cap/pattern-design": "Every Amber Shockey & Co. collection has to layer from one accent dish to a full table, so each has a hero pattern, a secondary and an accent. Each sets something structured against something organic.",
  /* Various design: "Grunge compositing and hand-drawn type for the pop
     artist"; Robert Rodriguez: "four photographs from one day, layered
     over each other" */
  /* what it answered: Robert Rodriguez: "the photographs layered over each other so the same few pictures could carry a whole look" */
  "cap/photo-compositing": "The Robert Rodriguez campaign had one studio day, so its photographs were layered over each other until a few could carry the whole look. Compositing goes back to the early work, in the grunge pieces for a pop artist.",
  /* what it answered: Capitan Boot Co.: "with no props, no stand-ins, and no styling beyond what was already there" */
  "cap/photo-direction": "Capitan Boot Co.'s campaign was shot in West Texas with no props, no stand-ins and no styling beyond what was already there. The pictures come from the landscape the boots are made for.",
  "cap/photography": "Some of the photography started as personal work. Photographs from a family trip through West Texas later became the backdrops for the Capitan Boot Co. campaign.",
  /* Cosmo Prof: "The templates set photography, type and layout once." */
  /* what it answered: Cosmo Prof: "The site was functional but dated"; "Started with photography: high-contrast lighting, defined shadows, cleaner compositions" */
  "cap/photography-direction": "Cosmo Prof's site was functional but dated, and the refresh started with the photography: high-contrast lighting, defined shadows and cleaner compositions. The same templates now carry promotions, brand campaigns and education.",
  /* what it answered: Black & white type: "With no color to lean on, tone comes from spacing" */
  "cap/poster-design": "Black & white type took color, photography and gradients off the table to see how far six patterns could go in print. Three lithographs came out of it, with tone set by spacing: a packed fill reads dark and an open one light.",
  /* what it answered: Amber Shockey & Co.: "made to layer from a single dish up to a full setting" */
  "cap/product-applications": "Amber Shockey & Co.'s patterns have to work on a single accent dish and across a whole table. J. Christianson's tree drawing went onto apparel, candles, hangtags and print.",
  /* what it answered: A.R.C.: "The apps for it ask you to type every item in by hand"; "shows the gap as a dollar amount" */
  "cap/product-design": "Home inventory apps ask you to type every item in by hand, so about 60% of homeowners never catalog what they own. A.R.C. works from the camera instead, and it shows the gap between what you own and what your policy covers in dollars.",
  /* what it answered: A.R.C.: "Concept Validation, 2 wks. Architecture, 2 wks. Interface Design + Build, 2 wks. Financial Layer, 2 wks. Brand + Go-to-Market, 2 wks" */
  "cap/product-management": "A.R.C. ran on a plan of five two-week steps: validation, architecture, the interface, the financial layer, then the brand and go-to-market. It went from concept to live product in ten weeks.",
  /* what it answered: Nordstrom personalization: "Deliberate contrast, precise angles, no styling props, so each image worked on its own as a story hero or stacked into a grid as ecomm" */
  "cap/product-photography-direction": "Nordstrom's personalized pages needed product photographs that worked alone as a story hero and stacked in a grid as ecomm. So they were shot with deliberate contrast, precise angles and no styling props.",
  /* what it answered: About: "writes and designs the emails, web assets and signage"; You By Sally: "clean grids that ran on mobile, desktop and in-store signage" */
  "cap/retail-signage": "Sally's campaigns have to reach 2,000+ stores, and Sally Marketing OS designs the signage along with the emails and web assets. You By Sally's oversized swatches ran from mobile to in-store signs on one grid.",
  /* what it answered: Fairview entry: "The light through those doors comes first. Everything else in the room is sized and placed to let it through" */
  "cap/space-planning": "The Fairview entry is two stories tall, and the light through its floor-to-ceiling French doors comes first. Everything else in the room is sized and placed to let it through.",
  /* what it answered: Neiman Marcus: "Every piece started with the story"; "The concept came first, then the shoot, then the styling and the layout" */
  "cap/story-development": "Neiman Marcus wanted a site that read like a magazine, so every piece started with the story: designer spotlights, seasonal trend stories and ways-to-wear features. The concept came first, then the shoot, then the styling and the layout.",
  /* what it answered: Jeffrey spring: "The type followed the same idea, condensed, stretched and layered for rhythm across three dress stories" */
  "cap/typography": "Jeffrey's spring campaign ran three dress stories, JW Anderson, Valentino and Simone Rocha, and the type gave them one rhythm. It's condensed, stretched and layered, the way the foliage is cropped big.",
  /* what it answered: Black & white type: "The amount of paper left around a letter sets the mood of the whole print" */
  "cap/typography-design": "Black & white type asked how much range a few patterns could get out of letterforms once color was off the table. The shapes fill the letters, spill outside them and sit behind them, and the paper left around each letter sets the mood of the print.",
  /* what it answered: Jeffrey New York: "The work started with the buying team: how the floor was laid out, how pieces got grouped" */
  "cap/ux-architecture": "The work on Jeffrey's first online store started with how the buying team laid out the floor and grouped pieces. The site's navigation follows the edit instead of the category, and every interaction from wireframe to checkout was prototyped.",
  /* Nordstrom beauty: "built as its own component so it could move to
     eye, cheek, or nail" */
  /* what it answered: Nordstrom beauty: "drag across a color gradient to preview shades on their own face. Pick a color, see it on, buy without leaving the modal" */
  "cap/ux-design": "Nordstrom's beauty hub let a customer try a shade before buying: upload a photo or pull their Style Profile selfie, then drag across a color gradient to see it on their own face. They could pick one, see it on and buy without leaving the modal.",
  /* what it answered: Cosmo Prof: "it needed to match the professionals using it"; "Typography moved to Jost, and the palette put soft neutrals against sharp black" */
  "cap/visual-design": "Cosmo Prof's dated site needed to look like the professionals using it. The type moved to Jost, and the palette set soft neutrals against sharp black.",
  /* what it answered: DSC: "black and white, big condensed type, photography of actual members training" */
  "cap/web-design": "Dallas Sport Collective needed a brand that matched where the gym was headed, and the site carries it: black and white, big condensed type and photography of actual members training. The full trainer roster and program menu sit on it, over the booking platform.",
};
