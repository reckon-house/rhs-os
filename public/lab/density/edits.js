/* ── A STUDY'S EDITS (5 Oct 2026) ─────────────────────────────────────────
   His "i have this feeling my case studies say too much", then "i dont want
   to overcorrect again ... i'm looking for that perfect middle ground where
   it sells but ... we dont repeat", and Studio.Build's drawers, "where they
   CAN say a lot but it's tidy". Three edits for three studies, each read
   by study-panel.js under ?edit=trim, ?edit=fold or ?edit=index (?edit=today
   is the room as it was, with the switch):
     trim   the room as it is, every fact told once
     fold   each section's head and its strongest line; the rest in a drawer
     index  What I did and the story in closed drawers under the title;
            the sections keep their heads and pictures
   Every string is his: a line of the study, a trim of one, or two joined.
   Lines are named by their first words, which survive fragments.js being
   built again. Written and cross-checked by an agent pass against
   scratchpad check.mjs (no dashes, no we, every fact once). */
window.DENSITY_EDITS = {
 "ivy-park": {
  "trim": {
   "note": "Today's layout with nothing hidden: each fact has one home, the exclusive US partnership leads the subtitle, the two years of reuse sit on the black field, and 95% closes the study under its own head.",
   "stand": "Beyoncé's Ivy Park launched at Nordstrom, the line's exclusive US partner.",
   "lines": {
    "Ivy Park was Beyoncé's first": "drop",
    "Nordstrom had the exclusive": "drop",
    "Four weeks went": "drop",
    "The brief came in under NDA": "keep",
    "The photography was supplied": "keep",
    "Typography, layout, copy": "drop",
    "The polygon, a hexagon": "drop",
    "Angled, rotated": "drop",
    "The custom CMS components": "The custom CMS components built for the project went into Nordstrom's shared library and powered other launches for two years.",
    "Ivy Park was staking": "keep",
    "The supplied portraits": "The portraits were editorial in tone, with range across body types and ethnicities.",
    "The brief also covered": "The brief also covered digital marketing across Nordstrom's owned channels.",
    "Every photo came in": "The polygon ran from the hero banner through the product carousels into the email headers.",
    "The polygon's angled": "Its angled edges against the straight photography gave the athlete portraits some tension.",
    "The missing components": "drop",
    "The launch page had to be": "keep",
    "The emails, banners": "keep",
    "After launch, Beyoncé": "Beyoncé sent the team a personal thank-you video."
   },
   "facts": []
  },
  "fold": {
   "note": "Today's layout, but each section shows its head, its deck and its pictures; the columns and the supporting detail sit in one closed drawer per section.",
   "stand": "Beyoncé's Ivy Park launched at Nordstrom, the line's exclusive US partner.",
   "rest": "more",
   "lines": {
    "Ivy Park was Beyoncé's first": "drop",
    "Nordstrom had the exclusive": "drop",
    "Four weeks went": "drop",
    "The brief came in under NDA": "keep",
    "The photography was supplied": "keep",
    "Typography, layout, copy": "drop",
    "The polygon, a hexagon": "drop",
    "Angled, rotated": "drop",
    "The custom CMS components": "The custom CMS components built for the project went into Nordstrom's shared library and powered other launches for two years.",
    "Ivy Park was staking": "keep",
    "The brief also covered": "drop",
    "Every photo came in": "The polygon ran from the hero banner through the product carousels into the email headers.",
    "The missing components": "drop",
    "The launch page had to be": "keep",
    "The emails, banners": "keep",
    "Everything from the creative direction": "keep",
    "After launch, Beyoncé": "Beyoncé sent the team a personal thank-you video.",
    "That part stays": "keep"
   },
   "moreTitle": {
    "Nordstrom had six weeks": "The timeline, the freedom, the scope",
    "The hexagon started": "Shape, type and the CMS components",
    "The launch page came first": "At any size"
   },
   "facts": []
  },
  "index": {
   "note": "Studio.Build's shape: What I did and the story in four closed drawers under the title, then each section's head, pictures and one line at most; the black field and the pull quote stay.",
   "stand": "Beyoncé's Ivy Park launched at Nordstrom, the line's exclusive US partner.",
   "rest": "drop",
   "lines": {
    "Ivy Park was Beyoncé's first": "drop",
    "Nordstrom had the exclusive": "drop",
    "Four weeks went": "drop",
    "The brief came in under NDA": "drop",
    "The photography was supplied": "drop",
    "Typography, layout, copy": "drop",
    "The polygon, a hexagon": "drop",
    "Angled, rotated": "drop",
    "The custom CMS components": "The custom CMS components built for the project went into Nordstrom's shared library and powered other launches for two years.",
    "Every photo came in": "The polygon ran from the hero banner through the product carousels into the email headers.",
    "The launch page had to be": "keep",
    "The emails, banners": "keep",
    "Everything from the creative direction": "keep",
    "After launch, Beyoncé": "Beyoncé sent the team a personal thank-you video.",
    "That part stays": "keep"
   },
   "did": [
    "Creative direction",
    "Campaign design",
    "Experience design",
    "Ecommerce design",
    "Copywriting"
   ],
   "drawers": [
    {
     "t": "Where Ivy Park sat, and what the launch needed",
     "p": [
      "Ivy Park was staking out a spot between luxury fashion and athletic performance, one with no obvious reference, and the design had to sit in that gap.",
      "The Ivy Park launch needed one scrolling brand experience and emails timed to the drop. The brief also covered digital marketing across Nordstrom's owned channels."
     ]
    },
    {
     "t": "The NDA and the timeline",
     "p": [
      "The brief came in under NDA before the team had cleared their schedules, and there were daily calls with Ivy Park while the creative direction got locked in.",
      "Week one: references, moodboards, competitive audit. Weeks two through four: wireframes, design concepts, copywriting and motion studies, all presented to Beyoncé's creative team, with revisions turned around overnight. Weeks five and six: build and ship."
     ]
    },
    {
     "t": "What was supplied, and what was open",
     "p": [
      "The photography was supplied: black-and-white athlete portraits, editorial in tone, with range across body types and ethnicities, and color product shots on blue and gray.",
      "Everything but the photography was open, so the type went larger than expected, motion ran the length of the scroll, and the portraits got space around them."
     ]
    },
    {
     "t": "The polygon, the type and the components, at any size",
     "cols": [
      {
       "t": "The Polygon",
       "p": [
        "The portraits sat in a hexagonal frame, sometimes cropped tight to a jawline, sometimes open wide enough for a full figure.",
        "The polygon's angled edges against the straight photography gave the athlete portraits some tension.",
        "On scroll the hexagon turned slowly, and the flat photography picked up some depth. The rotation was one CSS transform."
       ]
      },
      {
       "t": "Typography at Volume",
       "p": [
        "Headlines like \"Confidence is Strength\" were set in mixed weights, with baselines knocked off the grid.",
        "The copy got written line by line as the pages took shape, in short present-tense sentences that talked straight to the reader."
       ]
      },
      {
       "t": "Custom Components",
       "p": [
        "The Ivy Park page needed components Nordstrom's CMS didn't have: parallax modules, animated polygon masks, full-bleed video that played on scroll, type lockups that scaled with the screen."
       ]
      },
      {
       "t": "At Any Size",
       "p": [
        "The polygon crops the same at 300px and at 3000px, and bold type reads at any size. Black-and-white photography goes to any aspect ratio."
       ]
      }
     ]
    }
   ],
   "facts": [],
   "didTitle": "Role"
  }
 },
 "sally-os": {
  "trim": {
   "note": "Today's layout with nothing hidden, every fact said once, the figures and hats that sell kept, and the plumbing detail cut.",
   "stand": "I design, build, and maintain the Sally Beauty Marketing OS from inside the team that uses it. | Every app shares data, context, and a design language.",
   "lines": {
    "Retail marketing runs on cycles": "drop",
    "Four months in, the Marketing OS": "Sally carries thousands of SKUs across hair color, hair care, styling, and professional tools, has 2,000+ stores with regional variation, and runs dozens of campaigns at once.",
    "It now reads the market and the customers": "drop",
    "Competitive intel sat in someone's browser tabs": "Competitive intel sat in someone's browser tabs, brand guidelines in a PDF nobody opened, campaign briefs in email threads, and assets on shared drives with names that drifted every quarter.",
    "Sally carries thousands of SKUs": "drop",
    "It has 2,000+ stores": "drop",
    "Tracking competitors was all manual": "drop",
    "The information was all there": "drop",
    "The same questions came up again": "Competitors kept surprising the team, and by the time an opportunity was clear it was too late to act on it.",
    "They went out to a distribution list": "They got edited in parallel, and within days nobody was sure which version was current.",
    "Asset management meant thousands of images": "drop",
    "The shared drives cost the team hours": "drop",
    "Each Sally's Take is one click": "Each Sally's Take is one click from a new brief.",
    "Claude runs the chat": "Claude runs the chat and gets the reasoning jobs: turning competitive signals into recommendations.",
    "Prompt caching keeps Claude fast": "drop",
    "The brand guidelines, tone rules": "drop",
    "Gemini loads Sally's internal knowledge base": "drop",
    "The marketing team's whole institutional memory": "drop",
    "Perplexity runs live web search for": "Perplexity runs live web search.",
    "It triggers on its own when a competitor": "It triggers on its own when a competitor comes up, and it pulls current pricing, promotions, social activity, and press coverage into the conversation without a separate search.",
    "A competitor launches something": "drop",
    "Brand Brain ingests and indexes": "drop",
    "It takes in the brand guidelines, performance history": "drop",
    "Perplexity: Live Data": "drop",
    "Inside Brand Brain, Perplexity pulls": "drop",
    "The Approve button writes": "The Approve button writes production requests into the same queue the team uses, so a play they like becomes work in one click.",
    "I built the whole Marketing OS": "drop",
    "AI tags every image on upload": "drop",
    "The right asset comes up in search": "drop",
    "It tells lifestyle shots from product shots": "drop",
    "The second lights it like a studio shot": "The second lights it like a studio shot, working from a reference photograph.",
    "Search Architecture": "drop",
    "The Asset Hub uses Postgres full-text search": "drop",
    "Search runs as you type": "drop",
    "The vendor enters name, email": "drop",
    "An admin review dashboard": "drop",
    "Workflow & Collections": "drop",
    "Campaign templates come with configurable stages": "drop",
    "Review is per asset": "drop",
    "Statuses run Draft": "drop",
    "A collection gets a name": "drop",
    "You add assets from the library in batches": "drop",
    "Embedding & File Handling": "drop",
    "The Asset Hub runs inside the portal": "drop",
    "On upload, the hub reads dimensions": "drop",
    "PDFs get a branded thumbnail": "drop",
    "Every tool in the Utilities Marketplace": "Click a card and the tool loads inline, without onboarding, a separate login or an IT ticket.",
    "Each tool is hosted separately": "drop",
    "The tool list is a JavaScript array": "drop",
    "It handles every Sally promotion format": "It handles every Sally promotion format, Spanish and bilingual included, and is pixel-accurate to the 3.667\" card.",
    "The deck builder turns the campaign brief": "The deck builder turns the campaign brief into the executive deck: it pulls the brand template, fills in the key metrics, and exports a PPTX.",
    "Paste a list of SKUs": "Paste a list of SKUs and get the product data back: images, descriptions, pricing, brand, category.",
    "It pulls from Sally's product database": "drop",
    "Import the promo calendars": "Import the promo calendars from Excel or Google Sheets and get one consolidated view back, with the conflicts flagged.",
    "It's the one place to check": "drop",
    "The tracker captures competitor advertising": "The tracker captures competitor advertising across digital channels and files it into a searchable library.",
    "The team can look up what Ulta": "The team can look up what ran last quarter without anyone taking screenshots.",
    "I designed, engineered, and deployed all six": "I designed, engineered, and deployed all six by myself.",
    "Inside the Team": "No Requirements Document",
    "AI as Engineering Partner": "Claude Code",
    "The asset hub, the associate site": "drop",
    "The Marketing OS uses five AI providers": "The Marketing OS uses five AI providers, each routed to what it is best at.",
    "Nothing sits between the code": "drop",
    "Each part of the app names the model": "Each part of the app names the model it calls, and strategy work and copywriting run on different Claude models.",
    "Every app in the Marketing OS shares data": "A signal caught in the morning can be a proposed campaign by the afternoon and a production request by the end of the day."
   },
   "facts": [
    "Field",
    "Published",
    "Built"
   ],
   "factSet": {
    "Field": "Marketing Technology, Enterprise Tools"
   }
  },
  "fold": {
   "note": "Today's layout where each section shows its head, its deck and at most one more line, and the columns fold into one drawer per section.",
   "stand": "I design, build, and maintain the Sally Beauty Marketing OS from inside the team that uses it. | Every app shares data, context, and a design language.",
   "rest": "more",
   "lines": {
    "Retail marketing runs on cycles": "drop",
    "Four months in, the Marketing OS": "Sally carries thousands of SKUs across hair color, hair care, styling, and professional tools, has 2,000+ stores with regional variation, and runs dozens of campaigns at once.",
    "It now reads the market and the customers": "drop",
    "Competitive intel sat in someone's browser tabs": "Competitive intel sat in someone's browser tabs, brand guidelines in a PDF nobody opened, campaign briefs in email threads, and assets on shared drives with names that drifted every quarter.",
    "Sally carries thousands of SKUs": "drop",
    "It has 2,000+ stores": "drop",
    "Tracking competitors was all manual": "drop",
    "The information was all there": "drop",
    "So every planning cycle started": "drop",
    "Asset management meant thousands of images": "drop",
    "The shared drives cost the team hours": "drop",
    "The Trends Feed uses Claude": "keep",
    "Each Sally's Take is one click": "Each Sally's Take is one click from a new brief.",
    "The brand guidelines, tone rules": "drop",
    "Gemini loads Sally's internal knowledge base": "drop",
    "The marketing team's whole institutional memory": "drop",
    "A competitor launches something": "drop",
    "Jim is trained on Sally's complete brand": "keep",
    "Brand Brain ingests and indexes": "drop",
    "It takes in the brand guidelines, performance history": "drop",
    "Brand Brain works out the strategy": "drop",
    "The newest app in the portal": "keep",
    "The Approve button writes": "The Approve button writes production requests into the same queue the team uses, so a play they like becomes work in one click.",
    "I built the whole Marketing OS": "drop",
    "The team needed two things from the old library": "keep",
    "AI tags every image on upload": "drop",
    "The right asset comes up in search": "drop",
    "Every tool in the Utilities Marketplace": "Click a card and the tool loads inline, without onboarding, a separate login or an IT ticket. The marketplace grows every month as the team finds the next thing worth automating.",
    "Each tool is hosted separately": "drop",
    "Exec Deck Builder": "drop",
    "The deck builder turns the campaign brief": "The deck builder turns the campaign brief into the executive deck: it pulls the brand template, fills in the key metrics, and exports a PPTX.",
    "It's the one place to check": "drop",
    "The team can look up what Ulta": "drop",
    "Six applications are in daily use": "keep",
    "I designed, engineered, and deployed all six": "I designed, engineered, and deployed all six by myself.",
    "The Marketing OS uses five AI providers": "drop",
    "Nothing sits between the code": "drop",
    "Every app in the Marketing OS shares data": "A signal caught in the morning can be a proposed campaign by the afternoon and a production request by the end of the day.",
    "The people at Sally call": "keep"
   },
   "moreTitle": {
    "Sally's marketing tools and files": "The intel, the briefs, the shared drive",
    "Three AI models watch": "What Claude, Gemini and Perplexity each do in the feed",
    "Jim answers with the context": "Long documents, the visual side, live data",
    "Jim now proposes campaigns": "Pass, the second model, and the first live scan",
    "Sally's old asset library": "Tagging, studio photography, search, vendors, workflow, files",
    "Ten tools each handle a job": "How a tool gets added, and what the tools do",
    "The team that needed the Marketing OS": "Inside the team, Claude Code, the stack"
   },
   "facts": [
    "Field",
    "Published",
    "Built",
    "Stack"
   ],
   "factSet": {
    "Field": "Marketing Technology, Enterprise Tools",
    "Stack": "Five AI providers routed per task"
   }
  },
  "index": {
   "note": "Flow opens the room: the subtitle runs into the six chapters, each opening in place; the pictures follow, then What I did and the abstract. No figure field, since Flow's sixth line already says four months.",
   "rest": "more",
   "lines": {
    "Retail marketing runs on cycles": "drop",
    "Four months in, the Marketing OS": "drop",
    "It now reads the market and the customers": "drop",
    "Competitive intel sat in someone's browser tabs": "Competitive intel sat in someone's browser tabs, brand guidelines in a PDF nobody opened, campaign briefs in email threads, and assets on shared drives with names that drifted every quarter.",
    "Sally carries thousands of SKUs": "keep",
    "It has 2,000+ stores": "keep",
    "Tracking competitors was all manual": "drop",
    "The information was all there": "drop",
    "So every planning cycle started": "drop",
    "Asset management meant thousands of images": "drop",
    "The shared drives cost the team hours": "drop",
    "The Trends Feed uses Claude": "more",
    "Each Sally's Take is one click": {
     "more": "Each Sally's Take is one click from a new brief."
    },
    "The brand guidelines, tone rules": "drop",
    "Gemini loads Sally's internal knowledge base": "drop",
    "The marketing team's whole institutional memory": "drop",
    "A competitor launches something": "drop",
    "Jim is trained on Sally's complete brand": "more",
    "Brand Brain ingests and indexes": "drop",
    "It takes in the brand guidelines, performance history": "drop",
    "Brand Brain works out the strategy": "keep",
    "The newest app in the portal": "more",
    "The Approve button writes": {
     "more": "The Approve button writes production requests into the same queue the team uses, so a play they like becomes work in one click."
    },
    "I built the whole Marketing OS": "drop",
    "The team needed two things from the old library": "more",
    "AI tags every image on upload": "drop",
    "The right asset comes up in search": "drop",
    "Every tool in the Utilities Marketplace": {
     "more": "Click a card and the tool loads inline, without onboarding, a separate login or an IT ticket. The marketplace grows every month as the team finds the next thing worth automating."
    },
    "Each tool is hosted separately": "drop",
    "Exec Deck Builder": "drop",
    "The deck builder turns the campaign brief": {
     "more": "The deck builder turns the campaign brief into the executive deck: it pulls the brand template, fills in the key metrics, and exports a PPTX."
    },
    "It's the one place to check": "drop",
    "The team can look up what Ulta": "drop",
    "Six applications are in daily use": "more",
    "I designed, engineered, and deployed all six": "keep",
    "The Marketing OS uses five AI providers": "drop",
    "Nothing sits between the code": "drop",
    "Every app in the Marketing OS shares data": "A signal caught in the morning can be a proposed campaign by the afternoon and a production request by the end of the day.",
    "The people at Sally call": "keep"
   },
   "moreTitle": {
    "Sally's marketing tools and files": "The intel, the briefs, the shared drive",
    "Three AI models watch": "What Claude, Gemini and Perplexity each do in the feed",
    "Jim answers with the context": "Long documents, the visual side, live data",
    "Jim now proposes campaigns": "Pass, the second model, and the first live scan",
    "Sally's old asset library": "Tagging, studio photography, search, vendors, workflow, files",
    "Ten tools each handle a job": "How a tool gets added, and what the tools do",
    "The team that needed the Marketing OS": "Inside the team, Claude Code, the stack"
   },
   "facts": [
    "Field",
    "Published",
    "Built"
   ],
   "factSet": {
    "Field": "Marketing Technology, Enterprise Tools"
   },
   "moreTo": "chapters",
   "did": [
    "Product Management",
    "Product Design",
    "Full-stack engineering, brand to backend",
    "AI Strategy",
    "Design System"
   ]
  }
 },
 "hill-country-kitchen": {
  "trim": {
   "note": "Today's layout with nothing hidden: every fact keeps one home, the abstract keeps what no section tells, and the details that sell all stay.",
   "abs": [
    "Four materials cover every cabinet face, countertop, and piece of hardware. Shaker cabinet doors come out of traditional American kitchens, the steel-frame windows and open shelving are contemporary, and the cremone bolts and schoolhouse pendants are European antique.",
    "The kitchen gets used for cooking, gathering, and working in about equal measure, and it's the hub of the house."
   ],
   "lines": {
    "If it isn't sage": "drop",
    "With only four materials": "drop",
    "The island is raw white oak": "The island is white oak and the warmest material in the room.",
    "The brass goes on the cabinet pulls": "The brass goes on the cremone bolts, the pendants, the sconce arms, and the range trim.",
    "Unlacquered brass patinas": "drop",
    "The metal darkens": "drop",
    "The cabinetry goes floor to ceiling": "The cabinetry goes floor to ceiling on three walls: a built-in hutch on either side of the range and full-height pantry doors.",
    "The island's white oak has": "The white oak has a penetrating oil finish, with no stain and no polyurethane.",
    "Open shelves on the island's working end": "Open shelves on the working end keep plates and bowls within reach of the dishwasher.",
    "Eight feet of usable counter": "Eight feet of usable counter sits on the island.",
    "The oak breaks up": "The oak breaks up the green and marble.",
    "A solid-panel island": "drop",
    "Over a day, the kitchen": "drop",
    "Sage green takes the vertical": "The island handles prep, serving, and seating at the same time."
   },
   "facts": [
    "Published",
    "Status",
    "Classification"
   ],
   "factSet": {
    "Classification": "Kitchen Design, Custom Millwork"
   }
  },
  "fold": {
   "note": "Today's layout, but each section shows its head, one line and its pictures; its columns and long body sit in one closed drawer.",
   "abs": [
    "Four materials cover every cabinet face, countertop, and piece of hardware. Shaker cabinet doors come out of traditional American kitchens, the steel-frame windows and open shelving are contemporary, and the cremone bolts and schoolhouse pendants are European antique.",
    "The kitchen gets used for cooking, gathering, and working in about equal measure, and it's the hub of the house."
   ],
   "lines": {
    "If it isn't sage": "drop",
    "With only four materials": "drop",
    "The island is raw white oak": "drop",
    "Unlacquered Brass": "drop",
    "The brass goes on the cabinet pulls": "drop",
    "Unlacquered brass patinas": "drop",
    "The metal darkens": "drop",
    "The cabinetry goes floor to ceiling": "The cabinetry goes floor to ceiling on three walls: a built-in hutch on either side of the range and full-height pantry doors.",
    "The island has a prep counter": "Raw wood in a kitchen was the riskiest call of the whole spec.",
    "Raw wood in a kitchen": "drop",
    "A solid-panel island": "drop",
    "Over a day, the kitchen": "drop",
    "Sage green takes the vertical": "The island handles prep, serving, and seating at the same time."
   },
   "rest": "more",
   "keep": [
    "The dining end shares",
    "Every decision came back",
    "The brass darkens where hands go"
   ],
   "moreTitle": {
    "The kitchen's four materials": "The sage, the oak and the marble",
    "Every pull and knob": "The cremone bolts on the pantry doors",
    "The island's marble top": "The shelves, the oak, the sight lines, the legs",
    "The switch from light to dark": "The chairs and the rug"
   },
   "facts": [
    "Published",
    "Status",
    "Classification"
   ],
   "factSet": {
    "Classification": "Kitchen Design, Custom Millwork"
   }
  },
  "index": {
   "note": "After Studio.Build: a short role list and four closed drawers grouped by question hold the story, and the sections below are heads and pictures with a line at most.",
   "abs": [
    "Four materials cover every cabinet face, countertop, and piece of hardware. The kitchen gets used for cooking, gathering, and working in about equal measure, and it's the hub of the house."
   ],
   "did": [
    "Interior and kitchen design",
    "Space planning",
    "Material specification",
    "Fixture selection",
    "Construction documentation"
   ],
   "didTitle": "Scope",
   "drawers": [
    {
     "t": "Where each material goes",
     "cols": [
      {
       "t": "Sage Green",
       "p": [
        "The sage is a muted green with enough gray in it to stay calm, and it goes on everything around the perimeter: base cabinets, uppers, the glass-front display, the range hood surround, the refrigerator panel, the pantry wall. The color sits back a little so the marble and the brass get noticed first."
       ]
      },
      {
       "t": "White Oak + Marble",
       "p": [
        "The island is white oak and the warmest material in the room. The growth rings show on the end grain of the open shelves.",
        "Calacatta marble runs the perimeter counters and the full backsplash behind the range, gray and gold veining on a warm white ground. The marble separates the green cabinets from the white walls."
       ]
      },
      {
       "t": "Unlacquered Brass",
       "p": [
        "The brass goes on the cremone bolts, the pendants, the sconce arms, and the range trim."
       ]
      }
     ]
    },
    {
     "t": "How the sage and the oak are finished",
     "p": [
      "The sage has a matte finish. Satin would have pushed the cabinets contemporary and gloss would have fought the raw oak. Matte lets the Shaker profiles throw soft shadows.",
      "The white oak has a penetrating oil finish, with no stain and no polyurethane. The grain stays open and the color goes from pale honey to a deeper amber over years of use. The island is meant to look used, with water rings, knife marks and flour in the grain."
     ]
    },
    {
     "t": "Old and new pieces",
     "p": [
      "Shaker cabinet doors come out of traditional American kitchens, the steel-frame windows and open shelving are contemporary, and the cremone bolts and schoolhouse pendants are European antique.",
      "The pantry doors close with cremone bolts, a French mechanism where one lever locks the door top and bottom at once. The bolts put a long vertical line on the tallest cabinet faces and give the pantry wall a presence a standard pull wouldn't."
     ]
    },
    {
     "t": "The island and the dining end",
     "p": [
      "The island has a prep counter at one end and a bar at the other, where four stools with brass-tone frames tuck under the overhang. Open shelves on the working end keep plates and bowls within reach of the dishwasher. The base has a firewood cubby too."
     ],
     "cols": [
      {
       "t": "Where It Sits",
       "p": [
        "From the entry, the island is the first thing you see, centered with space to walk on all four sides. Eight feet of usable counter sits on the island.",
        "Every sight line in the kitchen crosses the island: from the range you look over it to the windows, and from the dining table you look through it to the backsplash. The oak breaks up the green and marble."
       ]
      },
      {
       "t": "On Legs",
       "p": [
        "The cabinets around the walls are built in, but the island stands on visible legs with open shelving between them, so it looks like furniture.",
        "Guests treat the island like a table: they lean on it, sit around it and set things down on it without asking."
       ]
      },
      {
       "t": "Dining",
       "p": [
        "The dining end shares the open room but goes deeper: a dark-stained table against the light oak and green of the kitchen.",
        "The safari chairs are leather on oak frames. The leather picks up the warmth of the brass and the oak goes with the island. A dark patterned rug lies under the table and chairs and marks the dining area off from the kitchen floor."
       ]
      }
     ]
    }
   ],
   "rest": "drop",
   "keep": [
    "Every decision came back",
    "Raw wood in a kitchen",
    "The brass darkens where hands go"
   ],
   "lines": {
    "The cabinetry goes floor to ceiling": "The cabinetry goes floor to ceiling on three walls: a built-in hutch on either side of the range and full-height pantry doors."
   },
   "facts": [
    "Published",
    "Status"
   ]
  }
 }
};
