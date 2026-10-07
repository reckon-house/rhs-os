# The copy standard for case studies

Since 6 Oct 2026. His words, after reading Sally Marketing OS rewritten the
way AI companies describe their tools: "overall this copy direction is SO
much more straightforward, can we make this our standard going forward?"

How it got here, in his words:

- "i have this feeling my case studies say too much ... maybe i've lost the
  point of each project with details"
- "i dont want to overcorrect again ... i'm looking for that perfect middle
  ground where it sells but ... we dont repeat"
- "a user might be scrolling quickly through the case study and happen to
  stop on one half way down - would it easily explain the stated purpose
  and goal?"
- "i'm not sure Jim or brand brain mean anything to anyone ... AI is the
  buzz word and what people want to see I am working with"
- His references were Claude Code, Claude Opus 5.5, ChatGPT Work, Codex,
  Grok and Gemini: very complex, powerful tools described in very plain
  words. "Claude Code builds the plan, asks clarifying questions, and
  handles work that runs for hours or days."

## The standard

1. **Say what it is first.** The subtitle names the thing in a plain
   category, with the role, in ink; the grey half says what it does or
   why it mattered. Sally: "I design, build, and maintain the Sally Beauty
   Marketing OS from inside the team that uses it. | It's six apps sharing
   one brain that knows the brand and reads the market, the customers,
   and the results."
2. **Every big line is a sentence with a verb.** It says what the work
   does (for AI work, what the AI does), and the grey half carries the
   payoff: a number against a baseline, an outcome, or why. "Three AI
   models watch competitors and 14 industry publications, | saving 30
   hours a week."
3. **The contents are the titles.** The opening paragraph lists the
   chapters, and each chapter line is also its section's title, word for
   word, the way a contents line titles its page. This is the one
   deliberate echo.
4. **Every section stands alone** for a reader who lands on it halfway
   down: a small label naming the thing (the app, the room, the piece),
   the title, one plain line, then the pictures. Internal names (Jim,
   Sally's Take) never carry a title; a label or a caption can name the
   screen they show.
5. **A chapter opens to the detail**: an optional sentence, then three
   specifics side by side, each with a short name, then a proof line where
   the study has one (a before and after, a first result, a real use).
6. **Name what it makes.** Outputs over abstractions: "the copy, the
   homepage card and the emails", not "content".
7. **Numbers keep the words that make them honest.** "40 hours a week
   across teams", never cut to "40 hours a week".
8. **Say it once.** No fact twice in what a reader can see. Count only
   what shows: a closed row is not a repeat the reader meets.
9. **Plain, warm, his.** VOICE.md leads. The hard rules in CLAUDE.md
   hold: no em dashes, nothing invented, never "we", "I" only in builder
   studies (Sally OS, A.R.C., DSC, the tools he built), no rhetorical
   tails, none of the banned words.

His own edit, the model for the register: he changed "I built all six
apps by myself in about four months" to "I built the entire system on my
own in about four months, with AI as the engineering partner".

## The room under ?edit=index, top to bottom

- The title.
- The opening paragraph (Flow): the subtitle, then each chapter line with
  a small picture set in the line and its number. A line opens in place
  to its row, and the row links down to its section.
- The kicker: What I did (builder studies), Role (client work) or Scope
  (interiors), the roles stacked, with the abstract beside it if there is
  one.
- The opening pictures, then the figure field if it says something new.
- The sections: label, title, one line, a pull quote if one is kept, the
  pictures and demos.
- The closing: one paragraph in the opening's type, first sentence in
  ink, the rest in grey.
- The facts table, the palette, the next study.

All the big type (the opening paragraph, the section titles, a closing's
first line) is one size and one weight in every room.

## The file: scripts/edits/<study-key>.json

```json
{ "k": "dsc", "variants": { "index": { } } }
```

Fields of the index variant. Lines and sections are named by the first
words of their text, long enough to match exactly one (room.mjs lists
them).

- `note`: one sentence for the record.
- `stand`: the subtitle, `"ink sentence | grey sentence"`.
- `abs`: the abstract as an array of paragraphs, `[]` for none. Leave out
  anything the subtitle, a chapter or a section already says.
- `did` and `didTitle`: the roles, from the study's own Services,
  Classification or Scope; `didTitle` is "What I did", "Role" or "Scope".
- `chapters`: `{ "<first words of a section head>": { "t", "g", "p", "li",
  "proof", "pic" } }`, one per section that is a chapter, in section
  order. `t` is the ink half and ends with a comma when there is a grey
  half; `g` is the grey half, no full stop. The section's title becomes
  `t | g.` by itself. `li` is three `"Name | text"` strings. `p` is an
  optional array of sentences before them. `proof` is one line. `pic` is
  a picture file of the study's own to set in the line (else the
  section's first picture). (Sally's chapters live in chapters.js; there
  the keys are its `head` values.)
- `heads`: `{ "<first words>": "ink | grey." }`, only for a section that
  is not a chapter, such as the brief or the problem. `"drop"` removes a
  section's head and words; its pictures join the section before.
- `labels`: `{ "<first words of a head>": "<label>" }`, the small label
  over a title.
- `decks`: `{ "<first words of a head>": "<one line>" }`, the one plain
  line under a title.
- `lines`: `{ "<first words of a line>": "keep" | "drop" | "<new text>" }`
  for the lines you keep: at most one pull quote, the closing lines.
- `rest`: `"drop"`. Every section line not named in `lines` goes; the rows
  carry the detail.
- `moreTo`: `"chapters"`.
- `captions`: `{ "<demo title>": "<plain title>" }`, only where a demo's
  title uses an internal name or jargon.
- `facts` and `factSet`: the facts table's rows that repeat nothing, in
  order, and shorter values for them.

Every string is the study's own: one of its sentences, a trim of one, or
two joined on a shared subject. The study's corpus is its lines, facts,
chapter lines and the demos' titles and notes. Never add a claim, a
number, an adjective, an outcome or context.

## Doing a study

1. `node scripts/edits/room.mjs <k>`: every line of the room in reading
   order, with its role. Read `src/data/<slug>-case-study.ts` too when a
   fact needs checking.
2. List the facts and mark the ones that make the project big (names,
   scale, real numbers, the constraint, the outcome, the role). Decide the
   chapters, usually one per section.
3. Write `scripts/edits/<k>.json`.
4. `node scripts/edits/check.mjs <k>`: zero errors. Read every warning. A
   synonym or a joined sentence is fine when the claim is the study's;
   fix anything else.
5. `node scripts/edits/preview.mjs <k>` (the dev server must be running):
   read what a reader meets, top to bottom, and look at the screenshots.
   Does each title explain itself alone? Is anything said twice? Does the
   subtitle say what it is?
6. Read it out loud. VOICE.md's one test decides.
7. `node scripts/edits/build.mjs` writes public/lab/density/edits.js.

The reference is `scripts/edits/sally-os.json`, variant `index`. Its
`trim` and `fold` variants and `moreTitle` come from an earlier round.
