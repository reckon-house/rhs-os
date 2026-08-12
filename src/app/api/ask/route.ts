/**
 * /api/ask — the model half of "Ask the house".
 *
 * The homepage's matcher stays exactly what it was: a build-time index
 * of the case studies, dealt instantly, with receipts. What this route
 * adds is prose. When a visitor types an actual question, the matcher's
 * hits come here, the SERVER re-reads those projects from its own copy
 * of the facts index, and Claude writes the one answer a template
 * cannot: grounded in the index, under the house copy rules.
 *
 * The client sends hrefs, never facts. Anything not in the server's own
 * index is dropped on the floor, so the model can only ever be shown
 * material this repo generated at build time. That is the entire trust
 * model, and it is why the receipt on the far side can say "the facts
 * are the index's" without hedging.
 *
 * Follows /api/agent-chat's conventions: nodejs runtime, SDK client,
 * graceful degrade when the key is missing (503 here rather than a
 * fallback string — the homepage has its own templates to fall back
 * on, and a wired sentence pretending to be the model would be worse
 * than the template).
 *
 * TWO THINGS THIS ROUTE DOES NOT DO, both deliberate.
 *
 * It does not choose which pictures to show. Every frame's contents are
 * already in the index (scripts/build-vision.mjs writes them, the client
 * holds its own copy), so the client matches frames itself, instantly,
 * with no round trip. A model that returns image paths can return one
 * that does not exist; a model that is never asked for a path cannot.
 * The frames are on screen before this route has finished thinking.
 *
 * It does not stream. The answer is one to three sentences and the
 * results are already rendered underneath it, so a single JSON response
 * is simpler than an SSE protocol and no slower in the way that counts.
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import facts from "@/data/generated/project-facts.json";

export const runtime = "nodejs";

const MODEL = process.env.ASK_MODEL || "claude-sonnet-5";
const MAX_Q = 300;
const MAX_HREFS = 8;
const MAX_FRAMES = 6;

interface AskBody {
  q: string;
  hrefs: string[];
  /* frames the client already chose to show, so the answer can talk
     about the pictures the visitor is looking at */
  frames?: string[];
  /* facet terms this tab has lingered on — dwell, hover, opens —
     computed client-side from its own session log. Terms only, ever:
     no timings, no coordinates, no identifiers. */
  trail?: string[];
}

interface Project {
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
interface Frame {
  src: string;
  slug: string;
  kind?: string;
  subjects?: string[];
  text?: string[];
  mood?: string[];
  composition?: string;
  f?: Record<string, string[]>;
}

/* Through `unknown`: the generated index is a literal type with a
   different optional-key shape per project, and TypeScript will not
   narrow it to the interface directly. The runtime shape is guaranteed
   by build-facts.mjs, which is the actual contract. */
const INDEX = facts as unknown as { projects: Project[]; images?: Frame[] };
const PROJECTS: Project[] = INDEX.projects;
const BY_HREF = new Map(PROJECTS.map((p) => [p.href, p]));
const FRAMES: Frame[] = INDEX.images ?? [];
const BY_SRC = new Map(FRAMES.map((f) => [f.src, f]));

/* every term the index has ever minted, for validating the trail */
const KNOWN_TERMS = new Set(
  PROJECTS.flatMap((p) =>
    Object.values(p.facets ?? {}).flatMap((l) => l.map((f) => f.term.toLowerCase())))
);

/* The house copy rules, as the system prompt. This is the same voice
   contract the case studies are edited under (CLAUDE.md), restated for
   a model that writes one paragraph at a time. The grounding rule is
   the fabrication rule wearing its runtime clothes. */
const SYSTEM = `You are the site voice of Reckon House Staples, the portfolio of Jeremy Prasatik, an independent designer and builder in Dallas. Visitors type questions into the homepage and you answer them.

You will be given FACTS: project records pulled from the site's own build-time index. Answer ONLY from those facts.

Rules, all of them hard:
- One to three short sentences of plain prose. No lists, no markdown, no headings, no quotes around project names.
- If the facts don't hold the answer, say so plainly in one sentence, then point at whichever provided project comes nearest. Never guess.
- Numbers may appear only if they are in the facts verbatim. Never invent outcomes, clients, dates, or capabilities.
- Never use an em dash anywhere.
- Banned words and patterns: seamless, robust, innovative, cutting-edge, best-in-class, leveraging, elevating, journey, passion, crafting meaningful experiences, "the result was". Do not stack three adjectives.
- Contractions are welcome. Write like a person answering a colleague who respects their time, not like a brochure.
- Speak as the house about Jeremy's work ("Built A.R.C. around..."), first person only where the facts show a first-person claim.
- Stay on the portfolio. If the question is off-topic, say the house only answers for the work, in one sentence, without moralizing.
- A TRAIL line may accompany the question: terms the visitor has lingered on this visit. Use it only to pick emphasis or a nearest neighbour when several answers would do. Never announce it, never say they seem interested in something, never treat it as something they asked.

Some facts are marked SEEN IN. Those were observed in a photograph, not written by Jeremy. You may say such a thing is visible in the work. You may not turn it into a claim about why it was done or what it achieved.`;

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
const SHELF = PROJECTS.map((p) => {
  const facets = Object.entries(p.facets ?? {})
    .map(([k, v]) => `${k}: ${v.slice(0, 6).map((f) => f.term).join(", ")}`)
    .join("; ");
  return [
    `${p.title} (${p.category ?? "work"}${p.year ? ", " + p.year : ""}) ${p.href}`,
    p.subtitle && `  ${p.subtitle}`,
    p.disciplines?.length && `  disciplines: ${p.disciplines.join(", ")}`,
    facets && `  holds: ${facets}`,
  ].filter(Boolean).join("\n");
}).join("\n\n");

/* The cached prefix, in render order: rules, then the shelf. The
   breakpoint goes on the LAST stable block, so both are cached
   together.

   A NOTE ON THE MINIMUM, because it fails silently. A prefix shorter
   than the model's minimum is not cached and no error says so — the
   only symptom is cache_read_input_tokens staying at zero.

   Measured: this prefix is ~4.1k tokens. Sonnet 5 needs 1024, so it
   caches with room to spare. Haiku 4.5 needs 4096, which this clears by
   about one percent — close enough that trimming a few subtitles from
   the shelf would silently switch caching off on Haiku without changing
   anything visible. If ASK_MODEL is ever pointed at Haiku, read
   cache_read_input_tokens out of the log below and confirm it is not
   zero rather than assuming. */
const PREFIX: Anthropic.TextBlockParam[] = [
  { type: "text", text: SYSTEM },
  {
    type: "text",
    text: `THE COMPLETE SHELF — every project the house holds:\n\n${SHELF}`,
    cache_control: { type: "ephemeral" },
  },
];

/* One bucket per IP, refilled by the clock. Kept in module scope: on a
   serverless host that is per-instance, which is loose but real, and
   this is a portfolio's search box rather than a public API. */
const BUCKET = new Map<string, number[]>();
const LIMIT = 8;
const WINDOW_MS = 60_000;

function limited(ip: string): boolean {
  const now = Date.now();
  const hits = (BUCKET.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= LIMIT) {
    BUCKET.set(ip, hits);
    return true;
  }
  hits.push(now);
  BUCKET.set(ip, hits);
  return false;
}

function contextFor(hrefs: string[], frames: string[]): { text: string; used: string[] } {
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
      p.subtitle && `What it is: ${p.subtitle}`,
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

  /* No shelf fallback here any more: the whole shelf is in the cached
     prefix on every request, so an unmatched question already has the
     full list to reach for. */
  return {
    text: blocks.length ? blocks.join("\n\n") : "Nothing in the index matched this question.",
    used: picked.map((p) => p.title),
  };
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  let body: AskBody;
  try {
    body = (await req.json()) as AskBody;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const q = typeof body.q === "string" ? body.q.trim().slice(0, MAX_Q) : "";
  const hrefs = Array.isArray(body.hrefs)
    ? body.hrefs.filter((h): h is string => typeof h === "string")
    : [];
  const frames = Array.isArray(body.frames)
    ? body.frames.filter((f): f is string => typeof f === "string")
    : [];
  /* the trail is validated against the server's own index, same as
     hrefs: a term the index never minted is dropped, so this field can
     carry taste and cannot carry prompt. */
  const trail = Array.isArray(body.trail)
    ? body.trail
        .filter((t): t is string => typeof t === "string")
        .slice(0, 5)
        .filter((t) => KNOWN_TERMS.has(t.toLowerCase()))
    : [];
  if (!q) {
    return NextResponse.json({ error: "empty question" }, { status: 400 });
  }

  const { text, used } = contextFor(hrefs, frames);

  try {
    const client = new Anthropic();
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: PREFIX,
      messages: [
        {
          role: "user",
          content:
            `FACTS:\n${text}` +
            (trail.length ? `\n\nTRAIL (lingered on this visit): ${trail.join(", ")}` : "") +
            `\n\nVISITOR'S QUESTION: ${q}`,
        },
      ],
    });
    const answer = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    if (!answer) {
      return NextResponse.json({ error: "empty answer" }, { status: 502 });
    }
    /* Cache health, logged rather than assumed. A prefix below the
       model's minimum is not cached and nothing errors, so the only way
       to know is to read the number back: reads at zero across repeated
       questions means the prefix stopped qualifying, or something
       per-request drifted above the breakpoint. */
    const u = res.usage;
    console.log(
      `[ask] ${MODEL} in=${u.input_tokens} cache_read=${u.cache_read_input_tokens ?? 0} ` +
      `cache_write=${u.cache_creation_input_tokens ?? 0} out=${u.output_tokens}`
    );
    return NextResponse.json({ answer, used, model: MODEL });
  } catch {
    return NextResponse.json({ error: "model error" }, { status: 502 });
  }
}
