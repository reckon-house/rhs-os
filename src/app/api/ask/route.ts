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
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import facts from "@/data/generated/project-facts.json";

export const runtime = "nodejs";

const MODEL = process.env.ASK_MODEL || "claude-sonnet-5";
const MAX_Q = 300;
const MAX_HREFS = 8;

interface AskBody {
  q: string;
  hrefs: string[];
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
}

const PROJECTS: Project[] = (facts as { projects: Project[] }).projects;
const BY_HREF = new Map(PROJECTS.map((p) => [p.href, p]));

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
- Stay on the portfolio. If the question is off-topic, say the house only answers for the work, in one sentence, without moralizing.`;

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

function contextFor(hrefs: string[]): { text: string; used: string[] } {
  const picked = hrefs
    .slice(0, MAX_HREFS)
    .map((h) => BY_HREF.get(h))
    .filter((p): p is Project => Boolean(p));

  if (picked.length) {
    const text = picked
      .map((p) => {
        const lines = [
          `PROJECT: ${p.title}`,
          p.subtitle && `What it is: ${p.subtitle}`,
          p.category && `Category: ${p.category}`,
          p.year && `Year: ${p.year}`,
          ...(p.summary ?? []).map((s) => `${s.label}: ${s.value}`),
          p.disciplines?.length && `Disciplines: ${p.disciplines.join(", ")}`,
          p.tools?.length && `Tools: ${p.tools.join(", ")}`,
          ...(p.stats ?? []).map((s) => `Stat: ${s.label} = ${s.value}`),
        ];
        return lines.filter(Boolean).join("\n");
      })
      .join("\n\n");
    return { text, used: picked.map((p) => p.title) };
  }

  /* No hits: the model still gets the shelf list, so "do you do X?"
     can be answered with an honest no and a real nearest-neighbour
     instead of a shrug. Titles and categories only — the full index
     would let a thin question pull the whole site into context. */
  const text =
    "No project matched the question. The complete list of what the house holds:\n" +
    PROJECTS.map((p) => `${p.title} (${p.category ?? "work"}${p.year ? ", " + p.year : ""})`).join("\n");
  return { text, used: [] };
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
  if (!q) {
    return NextResponse.json({ error: "empty question" }, { status: 400 });
  }

  const { text, used } = contextFor(hrefs);

  try {
    const client = new Anthropic();
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `FACTS:\n${text}\n\nVISITOR'S QUESTION: ${q}`,
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
    return NextResponse.json({ answer, used, model: MODEL });
  } catch {
    return NextResponse.json({ error: "model error" }, { status: 502 });
  }
}
