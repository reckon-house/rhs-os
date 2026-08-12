"use client";

/**
 * /compare — the bench, with a face on it.
 *
 * A page rather than a curl, because the thing being judged is prose and
 * prose is judged by reading it. Both columns come from /api/ask-compare,
 * which hands each provider byte-identical rules, facts and question.
 *
 * WHAT MAKES THIS MORE THAN TWO TEXT BOXES: it grades both answers
 * against the house rules automatically. "Which sounds better" is a
 * matter of taste and two people will disagree; "which one used an em
 * dash, ran to five sentences, and said seamless" is a fact. The checks
 * below are lifted from the same contract the system prompt states, so a
 * red mark means the model was told a rule and broke it.
 *
 * NOT FOR PRODUCTION. It calls two providers per question and sits on an
 * unauthenticated path. It is noindex'd, but the real protection is that
 * previews are SSO-gated — if this branch is ever promoted, delete the
 * page and the route or put them behind auth first.
 */

import { useState } from "react";

/* The rules the system prompt actually states, as checks. Each one
   returns a reason string when the answer breaks it. */
const BANNED = [
  "seamless", "seamlessly", "robust", "innovative", "cutting-edge",
  "best-in-class", "leveraging", "elevating", "journey", "passion",
  "crafting meaningful experiences", "the result was",
];

function grade(answer: string | null) {
  if (!answer) return [];
  const out: string[] = [];

  if (/[—–]/.test(answer)) out.push("em dash");

  /* Sentence count, roughly: terminal punctuation followed by a space or
     end of string. Decimals and abbreviations will occasionally fool it,
     which is why the number is shown rather than just a pass mark. */
  const sentences = (answer.match(/[.!?](\s|$)/g) || []).length;
  if (sentences > 3) out.push(`${sentences} sentences (limit 3)`);

  const hits = BANNED.filter((w) => answer.toLowerCase().includes(w));
  if (hits.length) out.push(`banned: ${hits.join(", ")}`);

  if (/^\s*[-*•]|\n\s*[-*•]/.test(answer)) out.push("list");
  if (/[#*_`]/.test(answer)) out.push("markdown");
  /* The rules say no quotes around project names. Straight or curly. */
  if (/["“”]/.test(answer)) out.push("quotes");

  return out;
}

interface Side {
  key: string;
  provider: string;
  model: string;
  answer: string | null;
  ms: number;
  usage: Record<string, number> | null;
  costUsd: number | null;
  /* the model's published minimum cacheable prefix, so a zero cacheRead
     can be read against the thing that would explain it */
  cacheMin: number | null;
  error: string | null;
}

interface Result {
  question: string;
  used: string[];
  factsTokensApprox: number;
  sides: Side[];
}

/* The questions worth asking, and why each one is here. */
const PRESETS: [string, string][] = [
  ["who are you", "identity — the one that used to be hardcoded"],
  ["what do you do", "services — also formerly a template"],
  ["what tools do you use", "should surface the AI-builder angle"],
  ["do you do restaurants?", "no match — tests the nearest neighbour"],
  ["what's your revenue?", "outside the facts — who admits it, who reaches"],
  ["tell me about the hill country kitchen", "a real study, in depth"],
];

export default function ComparePage() {
  const [q, setQ] = useState("who are you");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const run = async (question: string) => {
    setBusy(true); setErr(null); setRes(null);
    try {
      const r = await fetch("/api/ask-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: question }),
      });
      if (!r.ok) { setErr(`${r.status} ${await r.text()}`); return; }
      setRes(await r.json());
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  };

  const col = (s: Side, all: Side[]) => {
    const marks = grade(s.answer);
    /* Cheapest and fastest are called out because the interesting result
       of the first bench run was that the model with the lower sticker
       price came out four times dearer. Relative is the only reading
       that shows that. */
    const costs = all.map((x) => x.costUsd).filter((n): n is number => n != null);
    const times = all.filter((x) => !x.error).map((x) => x.ms);
    const cheapest = costs.length > 1 && s.costUsd === Math.min(...costs);
    const fastest = times.length > 1 && s.ms === Math.min(...times);
    /* A zero cacheRead on a model that publishes a minimum is the silent
       failure worth shouting about: no error is raised when a prefix
       falls under the line. */
    const cacheDead =
      s.cacheMin != null && s.usage != null &&
      s.usage.cacheRead === 0 && s.usage.cacheWrite === 0;

    return (
      <div key={s.key} style={{ flex: "1 1 320px", minWidth: 0 }}>
        <div style={{ ...S.lbl, display: "flex", justifyContent: "space-between" }}>
          <span>{s.provider}</span><span>{s.model}</span>
        </div>
        <div style={S.answer}>
          {s.error
            ? <span style={{ color: "#b00" }}>{s.error}</span>
            : s.answer || <span style={{ opacity: 0.4 }}>(empty)</span>}
        </div>
        <div style={S.marks}>
          {s.error ? null : marks.length
            ? marks.map((m) => <span key={m} style={S.bad}>{m}</span>)
            : <span style={S.ok}>clean</span>}
          {cacheDead ? <span style={S.bad}>NO CACHE (min {s.cacheMin})</span> : null}
        </div>
        <div style={S.meta}>
          <span style={fastest ? S.win : undefined}>{s.ms} ms</span>
          {s.usage ? <span>in {s.usage.input}</span> : null}
          {s.usage ? <span>out {s.usage.output}</span> : null}
          {s.usage?.cacheRead != null
            ? <span>cache r{s.usage.cacheRead}/w{s.usage.cacheWrite}</span> : null}
          {s.costUsd != null
            ? <span style={cheapest ? S.win : undefined}>${s.costUsd.toFixed(5)}</span> : null}
        </div>
      </div>
    );
  };

  return (
    <main style={S.wrap}>
      <h1 style={S.h1}>Same question, two models</h1>
      <p style={S.sub}>
        Both sides get byte-identical rules, facts and question from
        <code style={S.code}>@/lib/ask-context</code>. Marks below each answer are the
        house rules the system prompt actually states, checked automatically.
        Claude keeps its prompt cache; Grok has no equivalent channel, which is a
        real difference rather than a rigged one.
      </p>

      <div style={S.row}>
        <input
          style={S.input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !busy) run(q); }}
          placeholder="ask something"
        />
        <button style={S.btn} disabled={busy} onClick={() => run(q)}>
          {busy ? "asking…" : "ask both"}
        </button>
      </div>

      <div style={S.presets}>
        {PRESETS.map(([p, why]) => (
          <button key={p} style={S.preset} disabled={busy}
            title={why} onClick={() => { setQ(p); run(p); }}>
            {p}
          </button>
        ))}
      </div>

      {err ? <div style={S.err}>{err}</div> : null}

      {res ? (
        <>
          <div style={S.cols}>{res.sides.map((s) => col(s, res.sides))}</div>
          <div style={S.foot}>
            facts ~{res.factsTokensApprox} tokens
            {res.used.length ? ` · matched ${res.used.join(", ")}` : " · no project matched, shelf only"}
          </div>
        </>
      ) : null}
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 1100, margin: "0 auto", padding: "56px 24px 120px",
    fontFamily: "var(--font-satoshi), system-ui, sans-serif", color: "#141414" },
  h1: { fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 10px" },
  sub: { fontSize: 14, lineHeight: 1.6, color: "rgba(0,0,0,.55)", maxWidth: "68ch", margin: "0 0 32px" },
  code: { fontSize: 13, background: "rgba(0,0,0,.06)", padding: "1px 5px", borderRadius: 3, margin: "0 4px" },
  row: { display: "flex", gap: 10, marginBottom: 12 },
  input: { flex: 1, fontSize: 16, padding: "12px 14px", border: "2px solid #141414",
    borderRadius: 0, fontFamily: "inherit", background: "#fff" },
  btn: { fontSize: 14, fontWeight: 600, padding: "12px 22px", border: "2px solid #141414",
    background: "#141414", color: "#fff", cursor: "pointer", fontFamily: "inherit" },
  presets: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 34 },
  preset: { fontSize: 12, padding: "6px 12px", border: "1px solid rgba(0,0,0,.25)",
    background: "transparent", cursor: "pointer", fontFamily: "inherit", borderRadius: 20 },
  cols: { display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-start" },
  lbl: { fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
    fontWeight: 600, color: "rgba(0,0,0,.45)", paddingBottom: 8,
    borderBottom: "2px solid #141414", marginBottom: 16 },
  answer: { fontSize: 17, lineHeight: 1.5, minHeight: 90 },
  marks: { display: "flex", gap: 6, flexWrap: "wrap", margin: "16px 0 10px" },
  bad: { fontSize: 11, fontWeight: 600, padding: "3px 9px", background: "#b00", color: "#fff" },
  ok: { fontSize: 11, fontWeight: 600, padding: "3px 9px", background: "rgba(0,0,0,.07)",
    color: "rgba(0,0,0,.5)" },
  meta: { display: "flex", gap: 14, fontSize: 11, color: "rgba(0,0,0,.4)",
    fontVariantNumeric: "tabular-nums", flexWrap: "wrap" },
  win: { color: "#141414", fontWeight: 700 },
  foot: { marginTop: 34, paddingTop: 14, borderTop: "1px solid rgba(0,0,0,.14)",
    fontSize: 11, color: "rgba(0,0,0,.4)" },
  err: { padding: 14, background: "#fee", border: "1px solid #b00", fontSize: 13,
    whiteSpace: "pre-wrap", marginBottom: 20 },
};
