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
import {
  SYSTEM, SHELF, contextFor, throttled, throttleState, KNOWN_TERMS,
  MAX_Q, type AskBody,
} from "@/lib/ask-context";

export const runtime = "nodejs";

/* HAIKU, chosen on measurement rather than tier. Benched against Sonnet 5
   and Grok 4.6 on this exact workload, averaged over the same questions:
   1,626ms against Sonnet's 2,789 and Grok's 13,000 to 32,000, at $0.00084
   an answer against $0.00275 and $0.0088. It also answered better as often
   as not, which was the surprise.

   THE ONE THING TO WATCH is the cache floor. Haiku's minimum cacheable
   prefix is 4,096 tokens and it counts this one at ~4,719, so the margin
   is about 15%. It was 36 tokens at one point today and only cleared
   because the system prompt grew. Caching below the minimum fails
   silently: no error, and the sole symptom is cache_read_input_tokens
   sitting at zero in the log line below. If projects are ever removed
   from the shelf, read that number before assuming the bill is fine.

   Effort is not set here on purpose. Haiku 4.5 rejects
   output_config.effort with a 400 rather than ignoring it. */
const MODEL = process.env.ASK_MODEL || "claude-haiku-4-5";
/* The voice contract, the shelf and the facts builder live in
   @/lib/ask-context so /api/ask-compare hands another provider
   byte-identical input. A duplicated system prompt is one that drifts. */


/* The cached prefix, in render order: rules, then the shelf. The
   breakpoint goes on the LAST stable block, so both are cached
   together.

   A NOTE ON THE MINIMUM, because it fails silently. A prefix shorter
   than the model's minimum is not cached and no error says so — the
   only symptom is cache_read_input_tokens staying at zero.

   MEASURED, Aug 2026: SYSTEM ~625 tokens, SHELF ~3,782 across 30
   projects, so the prefix is ~4,407.

   THAT NUMBER IS THE THING TO WATCH, now that this runs on Haiku. Its
   minimum cacheable prefix is 4,096 and it counts this one at ~4,719,
   a margin of about 15%. Earlier today the margin was 36 tokens, and it
   only opened up because the system prompt gained rules. Drop a project,
   trim subtitles or shrink the facet lists and the prefix falls back
   under the floor, caching switches off, and nothing on the page changes
   to say so. The estimate that put this at "one percent" was made by
   counting characters; the tokenizer is the only thing worth trusting
   here, and the reading is in the log line at the foot of this file.

   Sonnet 5 counts the same prefix at ~6,983 against a 1,024 minimum, so
   if the shelf ever does shrink past Haiku's floor, pointing ASK_MODEL
   back at Sonnet is the escape hatch.

   The price difference is real but not the argument: at this shape
   (~46 input tokens per output token, so the bill is essentially an
   input bill) the gap between the two models is tens of dollars a month
   at portfolio traffic. Not worth a silent-failure mode.

   TTL is the default 5 minutes, which is the wrong fit if most visitors
   ask exactly one question — a write costs 1.25x and only pays back
   from the second request against the same prefix, so a single-question
   visit costs MORE cached than uncached. Revisit with real traffic:
   `ttl: "1h"` writes at 2x but stays warm between visitors. */
const PREFIX: Anthropic.TextBlockParam[] = [
  { type: "text", text: SYSTEM },
  {
    type: "text",
    text: `THE COMPLETE SHELF — every project the house holds:\n\n${SHELF}`,
    cache_control: { type: "ephemeral" },
  },
];


export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  /* 429 with the reason and a Retry-After, so the client can tell a
     visitor who typed too fast from a route that has spent its day. The
     homepage swallows the failure either way and leaves the template
     standing, which is the correct visible behaviour: a throttled
     visitor still gets an answer, just not the model's one. */
  const stop = throttled(ip);
  if (stop) {
    const retry = stop === "burst" ? 60 : 3600;
    console.warn(`[ask] throttled ${stop} ip=${ip} ${JSON.stringify(throttleState())}`);
    return NextResponse.json(
      { error: "rate limited", reason: stop },
      { status: 429, headers: { "Retry-After": String(retry) } }
    );
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
      /* 500 not 300: the bench caught a model spending the whole
         allowance before emitting text. Haiku does not do this, but the
         ceiling costs nothing when unused and the failure is silent. */
      max_tokens: 500,
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
