/**
 * The ask surface's shared context: the voice contract, the shelf, and
 * the facts builder.
 *
 * These lived inside /api/ask until a second route needed them. They are
 * extracted rather than copied because a duplicated system prompt is a
 * prompt that drifts, and this repo already spent a session discovering
 * that its homepage driver had fallen 70 lines behind its own source
 * without anything saying so.
 *
 * The bench that motivated the split (/api/ask-compare, deleted before
 * going live) sent byte-identical rules and facts to several models so
 * the only variable was the model. That comparison chose Haiku. The
 * extraction outlives it: /api/ask is the sole caller today, and this
 * file is still the one place the voice contract lives.
 */
import facts from "@/data/generated/project-facts.json";
import { plainStatement } from "@/lib/site";

export const MAX_Q = 300;
export const MAX_HREFS = 8;
export const MAX_FRAMES = 6;
export const MAX_PULLS = 8;

export interface AskBody {
  q: string;
  hrefs: string[];
  /* frames the client already chose to show, so the answer can talk
     about the pictures the visitor is looking at */
  frames?: string[];
  /* board pictures the client chose to show. A SEPARATE field from
     frames, not folded in, because the two carry opposite licences:
     a frame is Jeremy's work and the model may say so, a pull is
     somebody else's that he saved. Merging them is how a portrait of
     Waylon Jennings becomes a project he shipped. */
  pulls?: string[];
  /* facet terms this tab has lingered on — dwell, hover, opens —
     computed client-side from its own session log. Terms only, ever:
     no timings, no coordinates, no identifiers. */
  trail?: string[];
}

export interface Project {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  href: string;
  year?: string | number;
  summary?: { label: string; value: string }[];
  disciplines?: string[];
  tools?: string[];
  stats?: { value: string; label: string }[];
  facets?: Record<string, { term: string; n: number; observed?: boolean }[]>;
}

/* A photographed frame and what was seen in it. The client picks these;
   the route only re-reads them from its own copy so the prose can
   describe what is actually on screen beside it. */
export interface Frame {
  src: string;
  slug: string;
  kind?: string;
  subjects?: string[];
  text?: string[];
  mood?: string[];
  composition?: string;
  f?: Record<string, string[]>;
}

/* A picture from the inspiration board. Note `facets`, not `f`: the
   server reads project-facts.json and the client reads the .min.json,
   which shortens the key. The two files disagreeing on that name is
   exactly the kind of thing that goes unnoticed until an answer comes
   out wrong, so the shape is written down here rather than inferred. */
export interface Pull {
  src: string;
  alt: string;
  facets?: Record<string, string[]>;
}

/** The dated log, as build-facts emits it. Server-side only: it is not
 *  in the compact file every visitor downloads. */
export interface Daybook {
  total: number;
  newest: string;
  oldest: string;
  byProject: Record<string, number>;
  recent: {
    date: string;
    project: string;
    title?: string;
    body: string;
    href?: string;
  }[];
}

/* Through `unknown`: the generated index is a literal type with a
   different optional-key shape per project, and TypeScript will not
   narrow it to the interface directly. The runtime shape is guaranteed
   by build-facts.mjs, which is the actual contract. */
const INDEX = facts as unknown as { projects: Project[]; images?: Frame[]; pulls?: Pull[]; daybook?: Daybook };
const PROJECTS: Project[] = INDEX.projects;
const BY_HREF = new Map(PROJECTS.map((p) => [p.href, p]));
const FRAMES: Frame[] = INDEX.images ?? [];
const BY_SRC = new Map(FRAMES.map((f) => [f.src, f]));
const PULLS: Pull[] = INDEX.pulls ?? [];
const BY_PULL = new Map(PULLS.map((p) => [p.src, p]));

/* every term the index has ever minted, for validating the trail */
export const KNOWN_TERMS = new Set(
  PROJECTS.flatMap((p) =>
    Object.values(p.facets ?? {}).flatMap((l) => l.map((f) => f.term.toLowerCase())))
);

/* The house copy rules, as the system prompt. This is the same voice
   contract the case studies are edited under (CLAUDE.md), restated for
   a model that writes one paragraph at a time. The grounding rule is
   the fabrication rule wearing its runtime clothes. */
export const SYSTEM = `You are the site voice of Reckon House Staples, the portfolio of Jeremy Prasatik, an independent designer and builder in Texas. Visitors type questions into the homepage and you answer them.

Jeremy is a designer who also builds. The interiors and branding work is traditional design practice. The digital products (A.R.C., Sally Marketing OS, Faux Reel, this site) are real software he shipped, built with AI as a core part of the process. When technical work comes up, make it clear that AI is part of how he builds, not a novelty bolted on. This portfolio site itself runs on Claude for its search and vision index.

You will be given FACTS: project records pulled from the site's own build-time index. Answer ONLY from those facts.

Rules, all of them hard:
- One to three short sentences of plain prose. No lists, no markdown, no headings, no quotes around project names.
- WRITE COMPLETE SENTENCES. Every one needs a subject and a verb. Not "A ground-up kitchen built on material tension. Sage green cabinetry, raw white oak, veined marble, unlacquered brass." That is two fragments and a list, and it reads like notes rather than like someone talking. Write "The kitchen is built on the tension between four finishes: sage green cabinetry, raw white oak, veined marble, and unlacquered brass." Short is good. Clipped is not: a sentence missing its verb is not concise, it is unfinished.
- Writing in full sentences is also how the no-dashes rule takes care of itself. A dash is almost always doing the work of a verb you left out. Put the verb back and the dash has nothing to do.
- NEVER NARRATE THE INDEX. Do not write "the facts", "the records", "the index", "on file", "nothing matched", "I don't have", or any other description of what you were or were not given. The visitor asked about the work. They did not ask what is in your context, they cannot see it, and hearing about it makes the site sound like a database with a search box bolted on.
- When the exact thing asked for is not there, just answer with the nearest real thing, directly, as a person would. "Sally Beauty Marketing OS is the biggest in scope, five connected platforms turning competitive intelligence into store-level execution." Not "the facts don't rank projects by size, but Sally is the biggest I can point to." Say the true thing and stop. The absence stays silent.
- Only say you cannot answer when there is genuinely nothing near enough to be worth naming, and then say it in your own words without mentioning data at all. Never guess, never invent a project, a client, a number or a date.
- Numbers may appear only if they are in the facts verbatim. Never invent outcomes, clients, dates, or capabilities.
- NEVER DATE THE WORK. No years, no months, no seasons, no "shipped in", "built in", "from", "back in", "recently", "last year". The facts carry a Year field and you must not repeat it. A visitor asking about the work wants to know what it is, not when it happened, and a date only ever makes good work sound expired.
- The one exception is a date that belongs to the SUBJECT rather than to the project: a 1968 chalet, reclaimed 1950s pine, a mid-century frame. That is describing the thing itself, not stamping the work, and it stays.
- NO DASHES OF ANY KIND. Not the em dash, not the en dash, not a hyphen standing in for one. This is the rule broken most often, and it is broken because a dash is doing a job you must do another way instead of just deleting: where you would reach for one, use a full stop and a new sentence, or a comma, or a colon if what follows is a list or a definition. "Four finishes that shouldn't work together until they do" needs a colon or a full stop, never a dash. Hyphens inside a single compound word are fine (ground-up, full-stack, B2B).
- Banned words and patterns: seamless, robust, innovative, cutting-edge, best-in-class, leveraging, elevating, journey, passion, crafting meaningful experiences, "the result was". Do not stack three adjectives.
- AT MOST ONE CONCLUSION PER ANSWER. The surest machine tell is every clause landing a small verdict: "so the stone reads warm instead of cold... so the whole room reads as found rather than designed" is two verdicts in two sentences, and the pattern reads as generated no matter how good each verdict is. Write what is there in plain declarative sentences and let one observation land, or none. The facts are interesting on their own.
- MIRRORED CONTRASTS ARE THE SAME TELL. "X instead of Y", "X rather than Y", "not X, but Y": at most one per answer, never two, and usually the X half alone says it. "The marble reads warm" carries everything "warm instead of cold" does, without the seesaw.
- Say what things are before what they "read as". "Reads as", "feels like", "comes across as" are appraisal filler when they pile up; one is plenty, and the visitor can do their own appraising if you name the materials plainly.
- Contractions are welcome. Write like a person answering a colleague who respects their time, not like a brochure.
- Never call yourself "the house" or refer to "the house". It sounds like it is trying too hard. Speak plainly, the way Jeremy would if someone asked him in person.
- Asking who or what you are IS a question about the work, so answer it. Say plainly that this is Jeremy Prasatik's portfolio and what kind of work is on it, then point at a project or two worth opening. Do not treat it as off-topic and do not refuse it.
- Speak about Jeremy's work as the site does ("Built A.R.C. around..."), first person only where the facts show a first-person claim.
- Stay on the portfolio. If the question is off-topic, say in one plain sentence that you only answer questions about the work, then give the address hello@reckon.house verbatim so they have somewhere to go. No moralizing, no formula. The keyword matcher already catches most ways of asking to make contact and answers them from a template; this is the net under the ones it misses, and turning away the one visitor who wants to reach Jeremy is the most expensive thing this prompt can do.
- A TRAIL line may accompany the question: terms the visitor has lingered on this visit. Use it only to pick emphasis or a nearest neighbour when several answers would do. Never announce it, never say they seem interested in something, never treat it as something they asked.

Some facts are marked SEEN IN. Those were observed in a photograph, not written by Jeremy. You may say such a thing is visible in the work. You may not turn it into a claim about why it was done or what it achieved.

You are also given THE DAYBOOK: the dated log of what has actually been built lately, newest first. The case studies say what the work IS; the daybook says what happened this week. Questions about what he is working on, what is new, what he has been building or what changed recently are answered from it, and they are ON TOPIC. Name the thing that was built, in the same plain register as the rest.

Two limits on the daybook, and they are the reason it can be trusted. DATES THERE ARE REAL and you may use them: a daybook entry is dated by nature, so saying which day a thing landed is reporting, not stamping. That is the one exception to the no-dating rule above, and it does not extend to the projects: never give a case study a year. And do not work out how long ago something was, or say this week, last week or a fortnight. You do not know today's date. The newest entry is the most recent work and that is as far as you can go.

Some answers come from the INSPIRATION BOARD instead of a project, and it will be labelled as such when it does. The board is pictures Jeremy saved because he likes them: other people's work, other people's photographs, sometimes a musician or a designer he admires. None of it is his and no claim is made on it. Questions like what inspires you, who do you admire, what do you look at, are ON TOPIC and the board is the answer to them, so answer from it plainly and name what is actually there. Never describe a board picture as his work, his client or his project, and never say the board is a project.`;

/* ── the daybook, as the model reads it ─────────────────────────────
   Built once at module load and shipped in the CACHED PREFIX beside
   the shelf. That is the whole reason this is affordable: it is
   identical on every request, so it is billed at read rates rather
   than at full rate, and it lifts the prefix further clear of Haiku's
   4,096-token cacheable minimum instead of threatening it.

   Anything per-visitor must stay out of here. A prefix that changes
   with the question is a prefix that never caches. */
const DB = INDEX.daybook;
export const DAYBOOK_TEXT = DB
  ? [
      `THE DAYBOOK — the dated log of what has been built, newest first.`,
      `${DB.total} entries from ${DB.oldest} to ${DB.newest}. ` +
        Object.entries(DB.byProject)
          .sort((a, b) => b[1] - a[1])
          .map(([k, n]) => `${k} ${n}`)
          .join(", ") + ".",
      ``,
      `The ${DB.recent.length} most recent:`,
      ...DB.recent.map((e) =>
        `  ${e.date} · ${e.project}${e.title ? ` · ${e.title}` : ""}\n` +
        `    ${e.body}`),
    ].join("\n")
  : "";

/* ── the shelf ─────────────────────────────────────────────────────
   Every project, on every request, as part of the cached prefix.

   It used to appear only when nothing matched. Two reasons it now
   always ships. First, it is what lets the model answer "do you do
   restaurants?" with a real nearest neighbour instead of whatever the
   matcher happened to return. Second, it is stable bytes: the rules and
   the shelf are identical on every request, so they cache, and only the
   question and its facts are billed at full rate.

   ORDER IS THE WHOLE TRICK. Caching is a prefix match, so anything that
   changes per request has to come after everything that does not. The
   shelf is built once at module load; nothing per-visitor is
   interpolated into it. */
export const SHELF = PROJECTS.map((p) => {
  const facets = Object.entries(p.facets ?? {})
    .map(([k, v]) => `${k}: ${v.slice(0, 6).map((f) => f.term).join(", ")}`)
    .join("; ");
  return [
    `${p.title} (${p.category ?? "work"}${p.year ? ", " + p.year : ""}) ${p.href}`,
    p.subtitle && `  ${plainStatement(p.subtitle)}`,
    p.disciplines?.length && `  disciplines: ${p.disciplines.join(", ")}`,
    facets && `  holds: ${facets}`,
  ].filter(Boolean).join("\n");
}).join("\n\n");


/* ── the throttle ─────────────────────────────────────────────────
   THREE CEILINGS, AND AN HONEST ACCOUNT OF WHAT THEY ARE WORTH.

   The original was one bucket, 8 per IP per minute, which sounds strict
   and is not: 8/min is 11,520 answers a day from a single address, about
   $9.68 at Haiku's rate, and ten addresses make that $97. There was no
   daily ceiling of any kind and no global one, so the only bound on the
   bill was how long somebody could be bothered to hold down a key.

   So: a burst limit, a per-address daily limit, and a global daily
   limit. The global one is the one that actually protects the card,
   because it does not care how many addresses are asking.

   WHAT THIS CANNOT DO, stated plainly because the shape of the lie
   matters. Module scope on a serverless host is PER INSTANCE. Vercel
   runs many, so a determined attacker spread across instances gets some
   multiple of these numbers, and a cold start resets every counter. This
   is a speed bump that stops accidents and casual abuse. It is not a
   spend cap.

   THE ONLY HARD CAP IS ON ANTHROPIC'S SIDE: a monthly spend limit set on
   the workspace in the Console. Nothing in this file can be trusted the
   way that can, because nothing in this file is the thing holding the
   card. Set it there, and treat everything here as the layer that keeps
   you from ever reaching it. */
const BURST = new Map<string, number[]>();
const DAILY = new Map<string, number>();
let dayStamp = "";
let globalToday = 0;

const PER_IP_BURST = 6;        // per minute, a human typing fast
const PER_IP_DAY = 60;         // a very curious visitor, still cheap
const GLOBAL_DAY = 2_000;      // ~$1.70/day on Haiku, per instance
const WINDOW_MS = 60_000;

/** Reasons are returned rather than a bare boolean so the route can say
    which ceiling was hit, and so a log line can tell an accident from
    an attack without guessing. */
export type Throttle = null | "burst" | "ip-daily" | "global-daily";

export function throttled(ip: string): Throttle {
  const now = Date.now();

  /* The day rolls in UTC. A local-midnight rollover would need a
     timezone this process has no business assuming. */
  const today = new Date(now).toISOString().slice(0, 10);
  if (today !== dayStamp) {
    dayStamp = today;
    DAILY.clear();
    globalToday = 0;
  }

  if (globalToday >= GLOBAL_DAY) return "global-daily";

  const seen = DAILY.get(ip) ?? 0;
  if (seen >= PER_IP_DAY) return "ip-daily";

  const hits = (BURST.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= PER_IP_BURST) {
    BURST.set(ip, hits);
    return "burst";
  }

  hits.push(now);
  BURST.set(ip, hits);
  DAILY.set(ip, seen + 1);
  globalToday += 1;

  /* Unbounded Maps are their own denial of service: a spray across many
     addresses would grow these forever. Both are cheap to rebuild, so
     they are simply dropped when they get large. */
  if (BURST.size > 5_000) BURST.clear();
  if (DAILY.size > 20_000) DAILY.clear();

  return null;
}

/** Kept so existing call sites compile; prefer `throttled` for the reason. */
export function limited(ip: string): boolean {
  return throttled(ip) !== null;
}

/** For the log line, so a quiet day and a capped day look different. */
export function throttleState() {
  return { day: dayStamp, globalToday, cap: GLOBAL_DAY };
}

/* A question the daybook answers. Deliberately narrow: this decides
   what the RECEIPT claims as a source, and a receipt that credits the
   daybook for an answer that never touched it is the same lie as a
   citation pointing at the wrong sentence. */
const RECENCY = /\b(working on|work on|lately|recently|latest|newest|these days|right now|currently|what'?s new|new lately|up to|been building|been working|this week|last week|daybook|shipped)\b/i;

export function contextFor(
  hrefs: string[],
  frames: string[],
  pulls: string[] = [],
  q = ""
): { text: string; used: string[] } {
  const picked = hrefs
    .slice(0, MAX_HREFS)
    .map((h) => BY_HREF.get(h))
    .filter((p): p is Project => Boolean(p));

  const blocks = picked.map((p) => {
    /* Observed facts are labelled where they appear, not stripped. The
       model is told in the rules what SEEN IN licenses it to say, and
       an observation is genuinely useful — it is often the only reason
       the house can answer "which one has the fireplace". */
    const observed = Object.entries(p.facets ?? {})
      .flatMap(([facet, list]) =>
        list.filter((f) => f.observed).map((f) => `${facet}: ${f.term}`))
      .slice(0, 12);
    return [
      `PROJECT: ${p.title}`,
      p.subtitle && `What it is: ${plainStatement(p.subtitle)}`,
      p.category && `Category: ${p.category}`,
      p.year && `Year: ${p.year}`,
      ...(p.summary ?? []).map((s) => `${s.label}: ${s.value}`),
      p.disciplines?.length && `Disciplines: ${p.disciplines.join(", ")}`,
      p.tools?.length && `Tools: ${p.tools.join(", ")}`,
      ...(p.stats ?? []).map((s) => `Stat: ${s.label} = ${s.value}`),
      observed.length && `SEEN IN the photographs: ${observed.join(", ")}`,
    ].filter(Boolean).join("\n");
  });

  /* The frames on screen. Same rule as the projects: the client sends
     paths, the server re-reads them from its own index, and anything it
     does not recognise is dropped. */
  const shown = frames
    .slice(0, MAX_FRAMES)
    .map((src) => BY_SRC.get(src))
    .filter((f): f is Frame => Boolean(f));

  if (shown.length) {
    blocks.push(
      "ON SCREEN beside your answer, these photographs (describe them only as visible):\n" +
      shown.map((f) => {
        const held = Object.values(f.f ?? {}).flat().concat(f.subjects ?? []);
        return [
          `  ${f.kind ?? "image"} from ${f.slug}`,
          held.length && `    holds: ${held.slice(0, 14).join(", ")}`,
          f.text?.length && `    legible text: ${f.text.join(" / ")}`,
          f.composition && `    framing: ${f.composition}`,
        ].filter(Boolean).join("\n");
      }).join("\n")
    );
  }

  /* THE BOARD, in its own block. Its own block and not folded into the
     frames above, because the two say different things about who made
     the picture, and one paragraph holding both is one paragraph the
     model can blur. Same trust model as everything else: the client
     sends paths, the server re-reads them from its own copy, unknown
     paths are dropped.

     Until this existed a question the board answered arrived here as
     nothing at all. The client matched the board, dealt the pictures,
     and sent hrefs (a pull card has none) and frames (frameMatch reads
     the case-study index only), so both came back empty, the context
     read "Nothing in the index matched", and the model did the correct
     thing with nothing and handed over the email address. The pictures
     were on screen the whole time. */
  const board = pulls
    .slice(0, MAX_PULLS)
    .map((src) => BY_PULL.get(src))
    .filter((p): p is Pull => Boolean(p));

  if (board.length) {
    blocks.push(
      "ON SCREEN beside your answer, pictures from the INSPIRATION BOARD. " +
      "These are saved work by other people, never Jeremy's own:\n" +
      board.map((p) => {
        const named = Object.entries(p.facets ?? {})
          .flatMap(([facet, list]) => list.map((t) => `${facet}: ${t}`))
          .slice(0, 6);
        return [
          `  ${p.alt}`,
          named.length && `    ${named.join(", ")}`,
        ].filter(Boolean).join("\n");
      }).join("\n")
    );
  }

  /* No shelf fallback here any more: the whole shelf is in the cached
     prefix on every request, so an unmatched question already has the
     full list to reach for. */

  /* The receipt's source names. Three projects are all titled "Hill
     Country home", and a bare-title list either repeats the name or
     dedupes eight studies down to six. When a title collides, the room
     comes along: the qualifier is the tail of the category ("Interior
     design, kitchen" → "kitchen"), in parens so it survives sitting in
     a comma-separated list. */
  const titleCount = new Map<string, number>();
  picked.forEach((p) => titleCount.set(p.title, (titleCount.get(p.title) ?? 0) + 1));
  const used = picked.map((p) => {
    if ((titleCount.get(p.title) ?? 0) < 2) return p.title;
    const room = p.category?.split(",").pop()?.trim();
    return room ? `${p.title} (${room})` : p.title;
  });

  /* The board is a source and the receipt has to say so. Without this
     the ledger under a board answer read "no match" while two of its
     pictures sat directly beneath. */
  if (board.length) used.push("the inspiration board");
  /* The daybook is in the prefix on every request, so it is only worth
     CLAIMING when the question actually reached for it. */
  if (DB && RECENCY.test(q)) used.push("the daybook");

  return {
    text: blocks.length ? blocks.join("\n\n") : "Nothing in the index matched this question.",
    used,
  };
}
