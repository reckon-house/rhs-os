/**
 * /api/ask-compare — the same question, answered by every model on the bench.
 *
 * A bench, not a product surface. It answers the one question benchmarks
 * cannot: given THIS voice contract, THIS facts blob and THIS question,
 * whose prose sounds like the house?
 *
 * EVERY SIDE GETS BYTE-IDENTICAL INPUT, imported from @/lib/ask-context,
 * the same module /api/ask reads. Neither provider sees a version of the
 * rules the other did not.
 *
 * WHAT IS DELIBERATELY NOT EQUALISED, because the difference is the
 * measurement:
 *
 * - The Anthropic models keep their prompt-cache breakpoint on the shelf.
 *   That is a real property of running this workload on Claude, and the
 *   first bench run proved it is the whole ball game: Grok re-paid for
 *   ~4,000 shelf tokens on every question and came out four times more
 *   expensive per answer despite a cheaper sticker price.
 * - Reasoning stays at each provider's default. The task is three
 *   sentences from a supplied blob. A model needing its dial moved to
 *   sound right is a finding, not a setup error.
 *
 * WHY HAIKU IS ON THE BENCH. Its cache minimum is 4,096 tokens and this
 * prefix measures ~4,407 — seven percent of headroom. Caching below the
 * minimum fails SILENTLY: no error, the only symptom is
 * cache_read_input_tokens staying at zero. Running it here turns that
 * warning into a reading. If Haiku's cacheRead comes back 0 while
 * Sonnet's does not, the shelf has already drifted too close to the line.
 *
 * Prices are constants, dated, taken from published list rates. Sonnet's
 * is the introductory rate and reverts on 2026-08-31; nothing else in
 * this file will notice when it does.
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import {
  SYSTEM, SHELF, contextFor, limited, KNOWN_TERMS,
  MAX_Q, type AskBody,
} from "@/lib/ask-context";

export const runtime = "nodejs";

/* 300 was too tight: on a question that wants a short preamble the model
   spent the whole allowance thinking about the answer and returned an
   empty text block with stop_reason max_tokens. The answer is still one
   to three sentences; the ceiling just stops truncating them. */
const MAX_TOKENS = 500;

const XAI_URL = "https://api.x.ai/v1/chat/completions";

/* The key was added in Vercel as `Grok_RHS_Brain`. Node's env is
   case-sensitive, so the exact name is tried first and the conventional
   ones after. */
const GROK_KEY =
  process.env.Grok_RHS_Brain ||
  process.env.GROK_RHS_BRAIN ||
  process.env.XAI_API_KEY ||
  process.env.GROK_API_KEY;

/* USD per million tokens, list price, taken 2026-08-12. cacheRead is
   0.1x base input and cacheWrite 1.25x, which is where the Anthropic
   models earn their keep on a workload that is two-thirds fixed prefix. */
interface Spec {
  key: string;
  provider: "anthropic" | "xai";
  model: string;
  price: { in: number; out: number; cacheRead: number | null; cacheWrite: number | null };
  /* the published minimum cacheable prefix, so the reading below can be
     read against the thing it is testing */
  cacheMin?: number;
}

const BENCH: Spec[] = [
  {
    key: "sonnet", provider: "anthropic", model: "claude-sonnet-5",
    price: { in: 2.0, out: 10.0, cacheRead: 0.2, cacheWrite: 2.5 },
    cacheMin: 1024,
  },
  {
    key: "haiku", provider: "anthropic", model: "claude-haiku-4-5",
    price: { in: 1.0, out: 5.0, cacheRead: 0.1, cacheWrite: 1.25 },
    cacheMin: 4096,
  },
  {
    key: "grok", provider: "xai", model: process.env.GROK_MODEL || "grok-4.6",
    price: { in: 2.0, out: 6.0, cacheRead: null, cacheWrite: null },
  },
];

const usd = (n: number) => Number(n.toFixed(6));

export interface Side {
  key: string;
  provider: string;
  model: string;
  answer: string | null;
  ms: number;
  usage: Record<string, number> | null;
  costUsd: number | null;
  cacheMin: number | null;
  error: string | null;
}

const prompt = (facts: string, q: string, trail: string[]) =>
  `FACTS:\n${facts}` +
  (trail.length ? `\n\nTRAIL (lingered on this visit): ${trail.join(", ")}` : "") +
  `\n\nVISITOR'S QUESTION: ${q}`;

async function runAnthropic(s: Spec, facts: string, q: string, trail: string[]): Promise<Side> {
  const t0 = Date.now();
  const base: Side = {
    key: s.key, provider: s.provider, model: s.model, answer: null,
    ms: 0, usage: null, costUsd: null, cacheMin: s.cacheMin ?? null, error: null,
  };
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ...base, ms: Date.now() - t0, error: "ANTHROPIC_API_KEY not set" };
  }
  try {
    const res = await new Anthropic().messages.create({
      model: s.model,
      max_tokens: MAX_TOKENS,
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
    const answer = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text).join("").trim();
    return {
      ...base,
      ms: Date.now() - t0,
      /* An empty answer with stop_reason max_tokens is a truncation, not
         a refusal, and saying so beats rendering a blank column. */
      answer: answer || (res.stop_reason === "max_tokens"
        ? `(truncated at ${MAX_TOKENS} tokens before any text)` : null),
      usage: {
        input: u.input_tokens, output: u.output_tokens,
        cacheRead: read, cacheWrite: write,
      },
      costUsd: usd(
        (u.input_tokens * s.price.in +
          read * (s.price.cacheRead ?? 0) +
          write * (s.price.cacheWrite ?? 0) +
          u.output_tokens * s.price.out) / 1e6
      ),
    };
  } catch (e) {
    return { ...base, ms: Date.now() - t0, error: String(e).slice(0, 200) };
  }
}

async function runXai(s: Spec, facts: string, q: string, trail: string[]): Promise<Side> {
  const t0 = Date.now();
  const base: Side = {
    key: s.key, provider: s.provider, model: s.model, answer: null,
    ms: 0, usage: null, costUsd: null, cacheMin: null, error: null,
  };
  if (!GROK_KEY) return { ...base, ms: Date.now() - t0, error: "Grok_RHS_Brain not set" };
  try {
    /* The chat-completions shape has no separate cached-prefix channel,
       so the shelf rides in the system message with the rules. Same
       bytes, different envelope, and it is billed in full every time. */
    const r = await fetch(XAI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROK_KEY}` },
      body: JSON.stringify({
        model: s.model,
        max_tokens: MAX_TOKENS,
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
      costUsd: usd((inTok * s.price.in + outTok * s.price.out) / 1e6),
    };
  } catch (e) {
    return { ...base, ms: Date.now() - t0, error: String(e).slice(0, 200) };
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return NextResponse.json({ error: "rate limited" }, { status: 429 });

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

  /* In parallel: serialising would make the latency figures a function
     of call order rather than of the models. */
  const sides = await Promise.all(
    BENCH.map((s) =>
      s.provider === "anthropic"
        ? runAnthropic(s, text, q, trail)
        : runXai(s, text, q, trail))
  );

  console.log(
    `[compare] q=${JSON.stringify(q)} ` +
    sides.map((s) => `${s.key}=${s.ms}ms/${s.usage?.output ?? "-"}tok`).join(" ")
  );

  return NextResponse.json({
    question: q,
    used,
    factsTokensApprox: Math.round(text.length / 3.6),
    sides,
  });
}
