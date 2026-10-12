# SIGNAL.md — the plan for Signal

This is long because it is the whole plan: what Signal is for, five kinds
of post, the rules for a note, how a post gets made, and the backlog. The
drafts themselves are in `src/data/signal-drafts.ts`, which git ignores:
the repo is public and the drafts quote the Sally portal's internal
notes. Read them in the room at `/?drafts#study/signal-drafts` (local
only, never shipped). A backup sits on the ReckonHouse drive.

Started 6 Oct 2026, from his ask: "can you do some posts on the signals
page while i'm gone? you know all the AI tools and tech i've been using
across my projects - maybe start there and do some drafts...think of a
structure per post? almost a content strategy maybe?"

## What Signal is for

Signal is the AI news Jeremy reads, with his note on each one. The
headline is the source's. The note is his, from building with the tool.

It works because he actually builds with these things. A.R.C., Sally
Marketing OS, Dallas Sport Collective, Faux Reel and this site were all
built with AI as the engineering partner, so most news about the tools he
uses lands on something real he can point at.

Who reads it:

- People hiring a designer who builds: design leads, product teams,
  founders. They want to see judgment from use, not a news recap.
- The companies whose tools he uses. They search their own product names,
  and a specific note from a real build is the thing they share.
- Designers curious about the tools, who want to know what is worth
  trying.

What it shows without saying so: he builds real products with these
tools, he tests them against each other, and he has opinions that come
from use.

## Five kinds of post

Every post is one of these. The kind decides the note's shape.

**1. Built with.** A tool he uses in a shipped project.
- First: where it runs in his work and the job it does there.
- Then: one specific, a number, a before and after, or a decision.
- Optional: the catch, or what he would tell someone starting out.
- The seed: Perceptron Mk1 (A.R.C.'s video scans).

**2. Bench.** He tested it against something else.
- The question he asked, how many times, what happened, what he picked.
- The seed: Claude Sonnet 5 (twelve why questions against Haiku 4.5).

**3. Switch.** He moved from one tool to another.
- What it was, why it changed, what it is now. The number that made the
  call, when there is one.

**4. How I work.** A habit or a setup, day to day.
- What he does with it, in one or two plain sentences.
- The seed: Dispatch (running the Mac from his phone).

**5. Watching.** News about something he has not built with yet.
- Why it matters to his work and what he would try first.
- Only from his own words. If he has nothing to say yet, it waits.

## The post in four parts (proposed 11 Oct 2026)

His ask: "should we come up with a standard format? here's the 5 things
the model, app, browser or piece of software does, here's how i am using
it or tests it, here's my thoughts, etc, etc. so it feels a little more
indepth?"

Under the source's headline, every post has four parts:

1. **What it is.** One plain sentence saying what the thing is, from the
   source.
2. **What it does.** Three to five short lines from the announcement it
   links to, each a sentence with a verb. Never padded to five. A number
   keeps its comparison ("40% less to run than Opus 5").
3. **How I use it.** Where it runs in his work, the job it does there, and
   one specific: a number, a before and after, or a decision. A bench
   calls this part "How I tested it". A tool he hasn't used yet calls it
   "What I'd try first", in his words only.
4. **What I think.** His take in his words, one to three sentences. If he
   hasn't said anything yet, the post waits.

The kind (Built with, Bench, Switch, How I work, Watching) still labels
the post. A post runs about 120 to 200 words, so the 25 to 80 words below
hold only for a post that keeps the one-paragraph note. In the room, What
it is sits under the headline and each part is a labelled run, its name in
the left rail and its lines on the right, the way a study's opening sets
What I did beside its body. The fields are `what`, `does`, `use` (with
`useLabel`) and `think` in `src/data/signal.ts`; `scripts/build-signal.mjs`
sets them. The Opus 5.5 draft is the example.

## The note

- 25 to 80 words. Two short paragraphs at most.
- First person, plain, warm. One good line; the rest just talks
  (VOICE.md leads).
- Start with the work. The headline already says the news.
- A number keeps the words that make it honest: "40 hours a week across
  teams", never "40 hours a week".
- Nothing he did not do or say. If he has not used it, the note says so.
- The hard rules hold: no em dashes, none of the banned words, no
  "X, not Y", no flourish at the end of a sentence.

## The rest of a post

- **Headline:** one ordinary sentence from his own words about how he
  uses the thing ("Opus 5.5 is my daily workhorse"), lightly cleaned. No
  twist, no colon, nothing tacked on the end, and it passes VOICE.md's
  read-aloud test. If none of his lines works, ask him; never compose one.
  The source's own title moves to the link line: "Read it at Anthropic:
  Introducing Claude Opus 5.5". (Changed 11 Oct 2026, his "do you think the
  headlines should be general like that or more based on how i've used
  them? ... it's more about real world application", then "do all nineteen
  that way".)
- **Link:** the publisher's own announcement (blog, newsroom, release
  notes), opened and checked before it ships.
- **Date:** the day he posts it, not the day the news broke.
- **Tags:** two or three, from the list below.
- **See it in:** the study the post touches, by its room key (`study:
  "arc"`). New with the drafts: it shows as a second link under the note
  and opens that study's room, so Signal points back into the work.

## The post as an article (proposed 12 Oct 2026, `?signal=news`)

From Perplexity's automated articles, his: "the voice is straightforward,
news room like. i want to give you notes but i do want SOME polish ...
not sounding AI but also not sound like we're just taking my scratch
notes and dumping them on a page", and "can we link out? ... logos for
the sources ... the discover more at the bottom ... links out to my
projects?"

- **Two voices, one post.** What it is and what it does read like a
  newsroom: third person, plain, only what the source says, each part
  tagged to the page it came from. How I use it and What I think are his
  notes, polished: his words and his claims, put in order, spelling and
  grammar fixed, repeats and filler cut. Never a new claim, never a line he
  wouldn't say out loud. TinyFish's What I think is the reference.
- **Sources** (`sources` in signal.ts): the pages the post stands on,
  first the one the headline answers. They set as cards with the
  publisher's mark under the opening line, and as a tag after each part
  they back (`backs`). Every one links out. Marks are fetched once into
  public/lab/density/signal-icons/.
- **A picture:** the project the post touches (its `study`, else the
  project a tag names), after How I use it, linked to its room. Only his
  own work; a publisher's photograph would need its rights.
- **Discover more:** the room ends on the projects its posts touch, then
  his three builds, as thumbnails into their rooms.

## Tags

One list, reused, title case.

- Makers: Claude, Claude Code, Gemini, OpenAI, Perplexity, Perceptron, Grok
- Kinds: Models, Agents, MCP, Vision, Video, Search, Browsers, Tools,
  Infrastructure, Design
- Work: A.R.C., Sally Marketing OS, DSC, Faux Reel, This Site

## Cadence

- The page says "most days". Two or three a week is a good start, with
  about ten drafts in the bank.
- News pulls a draft: when a tool he uses ships an update, its post is
  ready, and one line from him makes it current.
- Posts stay newest first. A draft with no date is not live.

## How a post gets made

1. News lands. He sends one rough line, from his phone is fine.
2. Claude drafts the note from his line and the facts in the repo (the
   studies, the daybook, the profiles), and lists what only he can
   confirm.
3. He reads it out loud. VOICE.md's one test decides.
4. The draft moves from `src/data/signal-drafts.ts` to `src/data/signal.ts`
   with a date, then `npm run signal`, then push.

## Where the facts come from

Every note is built from something already written down, and each draft
lists its sources under `basis`:

- The public studies and the public daybook. Safe to say as they stand.
- His own messages in this site's Claude Code session. His words.
- A.R.C.'s own repo. His product; he decides what is public.
- The Sally portal's own code and notes. Internal to Sally Beauty. The
  study's content line already keeps sales numbers, unreleased plans,
  internal brief names and personal data off the site; every draft that
  leans on the portal's engineering notes asks him first.

The research behind the drafts (6 Oct 2026) also found where the
records disagree. The ones a post would trip on are in each draft's
`ask`; two are worth fixing at the source:

- The A.R.C. study says the OpenAI Vision API reads photos
  (`arc-case-study.ts:395`). The code moved to Gemini 2.5 Flash on
  8 Feb 2026.
- The Sally study's section on the photography tool
  (`sally-case-study.ts:608`) no longer matches the portal. The drafts
  file has the details.

## The four live posts

They were seeded before this plan, with descriptive headlines and
product pages for links. The headline should be the source's own, and
the link its announcement. Found and checked on 6 Oct 2026, not yet
changed in `src/data/signal.ts`:

| Post | Its headline now | The source's headline and link |
|---|---|---|
| Dispatch | Claude Code and Dispatch: run your Mac from your phone | "Put Claude to work on your computer", Anthropic, 23 Mar 2026, claude.com/resources/articles/dispatch-and-computer-use |
| Perceptron Mk1 | Perceptron Mk1, a model that reasons over video | "Introducing Perceptron Mk1", 12 May 2026, perceptron.inc/blog/introducing-perceptron-mk1 |
| Dia | Dia, the AI browser from The Browser Company | "Dia 1.0.1 for macOS" (general availability), 9 Oct 2025, diabrowser.com/changelog/mac/1-0-1; or TechCrunch's "The Browser Company launches its AI-first browser, Dia, in beta", 11 Jun 2025 |
| Sonnet 5 | Claude Sonnet 5 | "Introducing Claude Sonnet 5", 30 Jun 2026, anthropic.com/news/claude-sonnet-5 |

Notes on their words:

- Dispatch: since 16 Sep 2026 it is no longer offered to new users;
  existing users keep it. The note still holds for him.
- Perceptron: "a room-by-room scan of a whole house takes minutes" sits
  against the A.R.C. study's "under eight hours" for a 1,168-item home.
- Dia: "more than 20 AI browsers" appears only in the brief that seeded
  the post. It needs his word.
- Sonnet 5: the Ask lives on /custom and the old board now, not the
  homepage.

## Backlog

Sixteen drafts in `src/data/signal-drafts.ts`, in the order they would
post, mixing the work so no two neighbours come from the same project
where it can help:

1. Perceptron Mk1.5: A.R.C. cuts video to Mk1's own frame rate (Built with)
2. Claude Opus 5.5: how Sally's copy model was picked (Bench)
3. Claude Code desktop: design tool, thinking partner and CMS (How I work)
4. ChatGPT Images 2.5: the model behind Sally's product pictures (Switch)
5. MCP 2026-07-28: athletes booking from their own AI at DSC (Built with)
6. Gemini 3.8 Flash: A.R.C. moved from GPT-4o for cost (Switch)
7. Claude Sonnet 5.5: the model behind Sally's chat (Switch)
8. Prompt caching: the Ask's 11,270 tokens (How I work)
9. Grok 4.7: reading X, and prose over JSON (Built with)
10. Claude Fable 5: every photograph read once (Built with)
11. Gemini Embedding 2: search by what's in a picture (Built with)
12. Claude Fable 5.1: Copy Compare (Built with, a Bench with his verdict)
13. Perplexity Sonar Pro: the one that looks things up (Built with)
14. Figma, agents on the canvas: Sally's own plugin (Built with)
15. Claude Haiku 4.5: the watcher on every chat turn (How I work)
16. Topaz's April release: honest pixels for two heroes (How I work)

Every one carries its `ask`. Nine more ideas that need his words or a
better source are in `SIGNAL_IDEAS` at the end of the same file.
