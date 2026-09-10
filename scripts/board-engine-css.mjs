/* Which of the shell's rules does the engine actually stand on? The
   engine's vocabulary is every class its own code and CSS name; a shell
   rule that uses one of those is a dependency. Static and complete,
   where a DOM query would only see the resting page. */
import { readFileSync, writeFileSync } from "node:fs";
const eng = readFileSync("scripts/lib/assemble-board.py", "utf8");
const shell = readFileSync("public/lab/board-shell.css", "utf8");

/* the engine's class vocabulary */
const vocab = new Set();
for (const m of eng.matchAll(/el\("\w+",\s*"([^"]+)"/g)) m[1].split(/\s+/).forEach((c) => vocab.add(c));
for (const m of eng.matchAll(/className\s*=\s*"([^"]+)"/g)) m[1].split(/\s+/).forEach((c) => vocab.add(c));
for (const m of eng.matchAll(/classList\.(?:add|remove|toggle|contains)\("([^"]+)"/g)) vocab.add(m[1]);
for (const m of eng.matchAll(/class=\\?"([^"\\]+)\\?"/g)) m[1].split(/\s+/).forEach((c) => vocab.add(c));
for (const m of eng.matchAll(/querySelector(?:All)?\("([^"]+)"\)/g)) for (const c of m[1].matchAll(/\.([a-zA-Z_][\w-]*)/g)) vocab.add(c[1]);
/* the engine's own CSS block: selectors it writes */
for (const m of eng.matchAll(/^\s+([.#][^{\n]+)\{/gm)) for (const c of m[1].matchAll(/\.([a-zA-Z_][\w-]*)/g)) vocab.add(c[1]);
vocab.delete("");
/* and its ids: the bar, the query, the drawer */
const ids = new Set();
for (const m of eng.matchAll(/getElementById\("([\w-]+)"\)/g)) ids.add(m[1]);
for (const m of eng.matchAll(/querySelector(?:All)?\("([^"]+)"\)/g)) for (const c of m[1].matchAll(/#([a-zA-Z_][\w-]*)/g)) ids.add(c[1]);
for (const m of eng.matchAll(/\sid=\\?"([\w-]+)\\?"/g)) ids.add(m[1]);
for (const m of eng.matchAll(/^\s+([.#][^{\n]+)\{/gm)) for (const c of m[1].matchAll(/#([a-zA-Z_][\w-]*)/g)) ids.add(c[1]);
/* the per-element properties the engine sets itself, which are not a
   house's to supply */
const setByJs = new Set();
for (const m of eng.matchAll(/setProperty\("(--[\w-]+)"/g)) setByJs.add(m[1]);
for (const m of eng.matchAll(/cssText\s*=[^;]*?(--[\w-]+)\s*:/g)) setByJs.add(m[1]);
for (const m of eng.matchAll(/style=\\?"[^"]*?(--[\w-]+)\s*:/g)) setByJs.add(m[1]);

/* the shell's rules, kept whole: at-rules are carried with their inner rules */
const rules = [];
let i = 0;
const skipWs = () => { while (i < shell.length && /\s/.test(shell[i])) i++; };
const readBlock = () => { let depth = 0, start = i; for (; i < shell.length; i++) { if (shell[i] === "{") depth++; else if (shell[i] === "}") { depth--; if (depth === 0) { i++; return shell.slice(start, i); } } } return shell.slice(start); };
while (i < shell.length) {
  skipWs(); if (i >= shell.length) break;
  if (shell.startsWith("/*", i)) { const e = shell.indexOf("*/", i); i = e < 0 ? shell.length : e + 2; continue; }
  const braceAt = shell.indexOf("{", i); const semiAt = shell.indexOf(";", i);
  if (braceAt < 0) break;
  if (semiAt >= 0 && semiAt < braceAt) { i = semiAt + 1; continue; } /* @import etc. */
  const head = shell.slice(i, braceAt).trim(); i = braceAt;
  const body = readBlock();
  rules.push({ head, body, text: head + " " + body });
}
/* a base rule names no class and no id: a reset a house would otherwise
   have to write itself. @font-face is the house's face and stays out. */
const isBase = (head) => !/[.#]/.test(head) && !/^@font-face/.test(head);
const usesVocab = (head) => [...head.matchAll(/\.([a-zA-Z_][\w-]*)/g)].some((m) => vocab.has(m[1]))
  || [...head.matchAll(/#([a-zA-Z_][\w-]*)/g)].some((m) => ids.has(m[1]))
  || isBase(head) || /^@keyframes/.test(head);
const kept = [], dropped = [];
for (const r of rules) {
  if (r.head.startsWith("@media") || r.head.startsWith("@supports")) {
    /* keep the at-rule if any inner rule uses the vocabulary */
    const inner = r.body.slice(1, -1);
    const innerHeads = [...inner.matchAll(/([^{}]+)\{/g)].map((m) => m[1].trim());
    if (innerHeads.some(usesVocab)) kept.push(r); else dropped.push(r);
  } else if (usesVocab(r.head)) kept.push(r); else dropped.push(r);
}
/* the custom properties the kept rules read: the tokens a house must supply */
const tokens = new Set();
for (const r of kept) for (const m of r.text.matchAll(/var\((--[\w-]+)/g)) tokens.add(m[1]);
/* and which of those the kept rules define themselves */
const defined = new Set();
for (const r of kept) for (const m of r.text.matchAll(/(--[\w-]+)\s*:/g)) defined.add(m[1]);
const needed = [...tokens].filter((t) => !defined.has(t) && !setByJs.has(t)).sort();
const faces = new Set();
for (const r of kept) for (const m of r.text.matchAll(/font-family:\s*([^;}]+)/g)) faces.add(m[1].trim().slice(0, 40));

const out = "/* board-engine.css — the shell rules the Columns engine stands on.\n" +
  "   Computed by scripts/board-engine-css.mjs from the engine's own class\n" +
  "   vocabulary against board-shell.css: " + kept.length + " of " + rules.length + " rules.\n" +
  "   Class names are still the homepage's; a prefix is the next step.\n" +
  "   Tokens this sheet reads but does not define, for a house to supply:\n" +
  needed.map((t) => "     " + t).join("\n") + "\n" +
  "   Faces it names, for a house to host or replace:\n" +
  [...faces].map((t) => "     " + t).join("\n") + "\n*/\n\n" +
  kept.map((r) => r.text).join("\n\n") + "\n";
writeFileSync("public/lab/board-engine.css", out);
console.log("vocabulary", vocab.size, "classes | shell rules", rules.length, "| kept", kept.length, "| dropped", dropped.length);
console.log("engine sheet", Math.round(out.length / 1024) + "KB of", Math.round(shell.length / 1024) + "KB");
console.log("ids", ids.size, "| set by js", setByJs.size);
console.log("tokens the house must supply:", needed.join(" "));
console.log("faces:", [...faces].join(" | "));
console.log("dropped, sample:", dropped.slice(0, 8).map((r) => r.head.slice(0, 40)).join(" | "));
