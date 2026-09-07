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
 * It is TOLD about them, though, in two separate lists. `frames` are
 * Jeremy's own photographs; `pulls` are pictures from the inspiration
 * board, which are other people's work that he saved. They stay apart
 * the whole way through because the licence differs: the model may call
 * a frame his, and may never call a pull his.
 *
 * It does not stream. The answer is one to three sentences and the
 * results are already rendered underneath it, so a single JSON response
 * is simpler than an SSE protocol and no slower in the way that counts.
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import {
  SYSTEM, SHELF, DAYBOOK_TEXT, contextFor, throttled, throttleState, KNOWN_TERMS,
  MAX_Q, type AskBody,
} from "@/lib/ask-context";
import { flag } from "@/lib/voice-tells";

export const runtime = "nodejs";

/* SONNET 5, chosen on what it does with the study's own words. The
   bench (scripts/ask-bench.mjs --set why: twelve whys, each sent with
   its study's href so the route reads that study's prose) ran both
   models on 6 Sept 2026 with the grey-half rules in the prompt. Sonnet:
   0 flagged sentences of 36. Haiku: 0 of 29. The tells were even; the
   difference was in the facts. Asked why A.R.C. was built, Haiku
   invented a reason. Sonnet answered from the study's sentence, on
   that question and on the others that had a sentence to answer from.

   Haiku held this line first, chosen on an earlier bench: 1,626ms an
   answer against Sonnet's 2,789 on the older prompt, and cheaper by
   the ratio the note on PREFIX below still carries. The shape holds:
   on the why set Haiku averaged 2,463ms an answer and Sonnet 3,080.

   THE CACHE FLOOR is no longer the thing to watch. Sonnet's minimum
   cacheable prefix is 1,024 tokens and this one wrote 11,270 on
   6 Sept 2026. Haiku's floor was 4,096, and the note that stood here
   watched it because caching below the minimum does not error; the
   sole symptom is cache_read_input_tokens sitting at zero. That is
   still true of any model, so read the log line at the foot of this
   file after a prompt change rather than counting characters.

   Effort is not set. It was not part of the bench, so nothing measured
   says what it would do here. ASK_MODEL still overrides the default. */
const MODEL = process.env.ASK_MODEL || "claude-sonnet-5";
/* The voice contract, the shelf and the facts builder live in
   @/lib/ask-context. They were extracted so a comparison bench could
   hand several models byte-identical input; that bench is gone, but a
   system prompt with one home is worth keeping either way. */


/* The cached prefix, in render order: rules, then the shelf. The
   breakpoint goes on the LAST stable block, so both are cached
   together.

   A NOTE ON THE MINIMUM, because it fails silently. A prefix shorter
   than the model's minimum is not cached and no error says so — the
   only symptom is cache_read_input_tokens staying at zero.

   MEASURED ON THE TOKENIZER, 6 Sept 2026: the prefix is 11,270 tokens.
   Not estimated. That is the number Sonnet itself reported, read off
   cache_creation_input_tokens on the dev server once the two-sentence
   rule was in, and it is the only kind of reading worth writing down
   here. It was 6,907 on 29 Aug 2026, before the grey-half block and
   its ten specimens went in.

   THAT NUMBER IS THE THING TO WATCH. Sonnet 5's minimum cacheable
   prefix is 1,024, so the margin is about ten times. Drop a project,
   trim subtitles or shrink the facet lists and the prefix falls toward
   the floor, caching switches off, and nothing on the page changes to
   say so.
   Read the log line at the foot of this file rather than counting
   characters: two earlier estimates in this comment were made that way
   and both landed under the truth, which is the direction that hides
   the problem.

   Pointing ASK_MODEL back at Haiku puts its 4,096 floor back in play;
   read the number again first.

   The price difference is real but not the argument: at this shape
   (~46 input tokens per output token, so the bill is essentially an
   input bill) the gap between the two models is tens of dollars a month
   at portfolio traffic.

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
  },
  /* THE DAYBOOK RIDES IN THE PREFIX, and the breakpoint moved to the
     end of it. The shelf says what the work is and this says what
     happened lately; both are identical on every request, so both cache
     and only the question and its facts are billed at full rate. It
     also pushes the prefix further above the cache floor, which the
     note on MODEL above has been watching. */
  {
    type: "text",
    text: DAYBOOK_TEXT,
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
  /* board pictures, validated the same way and kept apart from frames:
     what the model is allowed to claim about a picture depends on which
     of the two lists it arrived in. */
  const pulls = Array.isArray(body.pulls)
    ? body.pulls.filter((p): p is string => typeof p === "string")
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

  const { text, used } = contextFor(hrefs, frames, pulls, q);

  try {
    const client = new Anthropic();
    const ask =
      `FACTS:\n${text}` +
      (trail.length ? `\n\nTRAIL (lingered on this visit): ${trail.join(", ")}` : "") +
      `\n\nVISITOR'S QUESTION: ${q}`;
    const textOf = (r: Anthropic.Message) =>
      r.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("").trim();
    const res = await client.messages.create({
      model: MODEL,
      /* 500 not 300: the bench caught a model spending the whole
         allowance before emitting text. Haiku does not do this, but the
         ceiling costs nothing when unused and the failure is silent. */
      max_tokens: 500,
      system: PREFIX,
      messages: [{ role: "user", content: ask }],
    });
    let answer = textOf(res);
    if (!answer) {
      return NextResponse.json({ error: "empty answer" }, { status: 502 });
    }
    /* ── THE VOICE, CHECKED ON THE WAY OUT ──────────────────────────
       The same shapes the copy lint reads over the studies, read over
       the answer: a tail, a not-not, "the noun is the noun", a dash.
       A sentence that trips gets ONE more pass, with the sentence
       quoted and its shape named, on the same cached prefix, so the
       second call is billed at the delta. If the second answer still
       trips, the flagged sentences come out and the rest stands; if
       nothing would be left, the first answer stands as it was. The
       prompt carries the rule and ten specimens of it; this is the
       net under the prompt, and it is expected to catch little. */
    let hits = flag(answer);
    let voice = hits.length ? "flagged" : "clean";
    if (hits.length) {
      const note = hits
        .map((h) => `"${h.sentence}" (${h.why.map((w) => w.label).join("; ")})`)
        .join("\n");
      try {
        const again = await client.messages.create({
          model: MODEL,
          max_tokens: 500,
          system: PREFIX,
          messages: [
            { role: "user", content: ask },
            { role: "assistant", content: answer },
            {
              role: "user",
              content:
                `These sentences have a shape the site does not use:\n${note}\n` +
                `Write the whole answer again with each of them stated as a fact or left out. ` +
                `Same facts, same length or shorter, nothing added. Return only the answer.`,
            },
          ],
        });
        const second = textOf(again);
        if (second) {
          const h2 = flag(second);
          if (h2.length < hits.length) { answer = second; hits = h2; voice = "retried"; }
        }
      } catch { /* the first answer stands */ }
      if (hits.length) {
        const cut = hits.reduce((a, h) => a.replace(h.sentence, ""), answer).replace(/\s{2,}/g, " ").trim();
        if (cut) { answer = cut; voice = "trimmed"; }
      }
    }
    /* Cache health, logged rather than assumed. A prefix below the
       model's minimum is not cached and nothing errors, so the only way
       to know is to read the number back: reads at zero across repeated
       questions means the prefix stopped qualifying, or something
       per-request drifted above the breakpoint. */
    const u = res.usage;
    console.log(
      `[ask] ${MODEL} in=${u.input_tokens} cache_read=${u.cache_read_input_tokens ?? 0} ` +
      `cache_write=${u.cache_creation_input_tokens ?? 0} out=${u.output_tokens} voice=${voice}`
    );
    return NextResponse.json({ answer, used, model: MODEL });
  } catch {
    return NextResponse.json({ error: "model error" }, { status: 502 });
  }
}
