/**
 * /api/ask-compare — the same question, answered twice.
 *
 * A bench, not a product surface. It exists to answer one question that
 * benchmarks cannot: given THIS voice contract, THIS facts blob and THIS
 * question, whose prose sounds like the house?
 *
 * BOTH SIDES GET BYTE-IDENTICAL INPUT. The system prompt, the shelf and
 * the facts builder are imported from @/lib/ask-context, the same module
 * /api/ask reads, so neither provider is handed a version of the rules
 * the other did not see. Anything else makes the comparison a comparison
 * of prompts rather than of models.
 *
 * WHAT IT DELIBERATELY DOES NOT EQUALISE, because the difference is the
 * point:
 *
 * - Claude gets its prompt-cache breakpoint on the shelf. That is a real
 *   property of running this workload on Claude, and hiding it to make
 *   the token counts line up would flatter the other side.
 * - Reasoning stays at each provider's default. This task is three
 *   sentences from a supplied blob; turning reasoning up buys latency on
 *   work that has none to do. If one model needs its dial moved to sound
 *   right, that is a finding, not a setup error.
 *
 * Cost per answer is computed from published list prices at the top of
 * the file rather than read back from either API, so the figures are
 * only as current as those constants. They are labelled with the date
 * they were taken and Sonnet's introductory rate expires — check them
 * before quoting a number at anyone.
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import {
  SYSTEM, SHELF, contextFor, limited, KNOWN_TERMS,
  MAX_Q, type AskBody,
} from "@/lib/ask-context";

export const runtime = "nodejs";

const CLAUDE_MODEL = process.env.ASK_MODEL || "claude-sonnet-5";
const GROK_MODEL = process.env.GROK_MODEL || "grok-4.6";

/* xAI speaks the OpenAI chat-completions shape, so this is a plain fetch
   rather than another SDK dependency for one bench route. */
const XAI_URL = "https://api.x.ai/v1/chat/completions";

/* The key was added in Vercel as `Grok_RHS_Brain`. Node's env is
   case-sensitive, so the exact name is tried first and the conventional
   ones after, rather than assuming whoever reads this next used the same
   one. */
const GROK_KEY =
  process.env.Grok_RHS_Brain ||
  process.env.GROK_RHS_BRAIN ||
  process.env.XAI_API_KEY ||
  process.env.GROK_API_KEY;

/* Published list prices, USD per million tokens, taken 2026-08-12.
   Sonnet's is the introductory rate and reverts to 3.00/15.00 after
   2026-08-31 — after that date these numbers are wrong and this comment
   is the only thing that will say so. */
const PRICE = {
  claude: { in: 2.0, out: 10.0, cacheRead: 0.2, cacheWrite: 2.5 },
  grok: { in: 2.0, out: 6.0, cacheRead: null as number | null, cacheWrite: null as number | null },
};

const usd = (n: number) => Number(n.toFixed(6));

interface Side {
  provider: string;
  model: string;
  answer: string | null;
  ms: number;
  usage: Record<string, number> | null;
  costUsd: number | null;
  error: string | null;
}

async function askClaude(facts: string, q: string, trail: string[]): Promise<Side> {
  const t0 = Date.now();
  const base: Side = {
    provider: "anthropic", model: CLAUDE_MODEL,
    answer: null, ms: 0, usage: null, costUsd: null, error: null,
  };
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ...base, ms: Date.now() - t0, error: "ANTHROPIC_API_KEY not set" };
  }
  try {
    const res = await new Anthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 300,
      system: [
        { type: "text", text: SYSTEM },
        {
          type: "text",
          text: `THE COMPLETE SHELF — every project the house holds:\n\n${SHELF}`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: prompt(facts, q, trail) }],
    });
    const u = res.usage;
    const read = u.cache_read_input_tokens ?? 0;
    const write = u.cache_creation_input_tokens ?? 0;
    return {
      ...base,
      ms: Date.now() - t0,
      answer: res.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text).join("").trim(),
      usage: {
        input: u.input_tokens, output: u.output_tokens,
        cacheRead: read, cacheWrite: write,
      },
      costUsd: usd(
        (u.input_tokens * PRICE.claude.in +
          read * PRICE.claude.cacheRead +
          write * PRICE.claude.cacheWrite +
          u.output_tokens * PRICE.claude.out) / 1e6
      ),
    };
  } catch (e) {
    return { ...base, ms: Date.now() - t0, error: String(e).slice(0, 200) };
  }
}

async function askGrok(facts: string, q: string, trail: string[]): Promise<Side> {
  const t0 = Date.now();
  const base: Side = {
    provider: "xai", model: GROK_MODEL,
    answer: null, ms: 0, usage: null, costUsd: null, error: null,
  };
  if (!GROK_KEY) {
    return { ...base, ms: Date.now() - t0, error: "Grok_RHS_Brain not set" };
  }
  try {
    /* The chat-completions shape has no separate cached-prefix channel,
       so the shelf rides in the system message with the rules. Same
       bytes, different envelope. */
    const r = await fetch(XAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROK_KEY}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: `${SYSTEM}\n\nTHE COMPLETE SHELF — every project the house holds:\n\n${SHELF}`,
          },
          { role: "user", content: prompt(facts, q, trail) },
        ],
      }),
    });
    if (!r.ok) {
      return { ...base, ms: Date.now() - t0, error: `${r.status} ${(await r.text()).slice(0, 200)}` };
    }
    const j = await r.json();
    const u = j.usage ?? {};
    const inTok = u.prompt_tokens ?? 0;
    const outTok = u.completion_tokens ?? 0;
    return {
      ...base,
      ms: Date.now() - t0,
      answer: (j.choices?.[0]?.message?.content ?? "").trim() || null,
      usage: { input: inTok, output: outTok },
      costUsd: usd((inTok * PRICE.grok.in + outTok * PRICE.grok.out) / 1e6),
    };
  } catch (e) {
    return { ...base, ms: Date.now() - t0, error: String(e).slice(0, 200) };
  }
}

const prompt = (facts: string, q: string, trail: string[]) =>
  `FACTS:\n${facts}` +
  (trail.length ? `\n\nTRAIL (lingered on this visit): ${trail.join(", ")}` : "") +
  `\n\nVISITOR'S QUESTION: ${q}`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
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
  if (!q) return NextResponse.json({ error: "empty question" }, { status: 400 });

  const hrefs = Array.isArray(body.hrefs)
    ? body.hrefs.filter((h): h is string => typeof h === "string") : [];
  const frames = Array.isArray(body.frames)
    ? body.frames.filter((f): f is string => typeof f === "string") : [];
  const trail = Array.isArray(body.trail)
    ? body.trail.filter((t): t is string => typeof t === "string")
        .slice(0, 5).filter((t) => KNOWN_TERMS.has(t.toLowerCase()))
    : [];

  const { text, used } = contextFor(hrefs, frames);

  /* In parallel: the point is the prose, and serialising them would only
     make the latency figures a function of call order. */
  const [claude, grok] = await Promise.all([
    askClaude(text, q, trail),
    askGrok(text, q, trail),
  ]);

  console.log(
    `[compare] q=${JSON.stringify(q)} ` +
    `claude=${claude.ms}ms/${claude.usage?.output ?? "-"}tok ` +
    `grok=${grok.ms}ms/${grok.usage?.output ?? "-"}tok`
  );

  return NextResponse.json({
    question: q,
    used,
    factsTokensApprox: Math.round(text.length / 3.6),
    claude,
    grok,
  });
}
