/* Port the homepage lab into the React app.
 *
 *   node scripts/port-home.mjs        rewrite the two generated files
 *   node scripts/port-home.mjs --check  fail if they are out of date
 *
 * public/lab/pressing-home.html is the homepage's design spec, and it
 * is a RUNNABLE one: open it alone and every driver works. This script
 * is what keeps that from becoming a lie. Tune the lab, run this, and
 * the site gets the same stylesheet and the same script.
 *
 * Doing it by hand lasted exactly one afternoon. The port needs four
 * transforms applied every time, and forgetting any one of them fails
 * quietly rather than loudly:
 *
 *   1. Drop the lab's copy of the masthead (#nav rules, the burn and
 *      reversal loops). The real site has Masthead.tsx; two stylesheets
 *      and two rAF loops over one bar is how a lift becomes a fork.
 *      The .ask rules stay — the question field is the homepage's own
 *      and merely travels into that bar.
 *
 *   2. Scope the four rules that reach past the page. `html`, `body`,
 *      `a` and `button` are fine in a document with one page in it and
 *      catastrophic in an app: they would repaint every route. They
 *      become html.rh-home descendants, which is also what paints white
 *      behind the masthead.
 *
 *   3. Rebind the two selectors that name things the lab owns but the
 *      app hashes: #nav.rev becomes #nav.is-rev, and the wordmark is
 *      found by [data-mark] first. CSS modules hash class names, so no
 *      other file can name .mark.
 *
 *   4. Swap the facts fetch for an import. The lab has no bundler and
 *      must fetch; here the index can be in hand before the first
 *      answer composes, which also deletes the lab's rebuild-when-it-
 *      lands race.
 */
import { readFileSync, writeFileSync } from "node:fs";

const LAB = "public/lab/pressing-home.html";
const CSS_OUT = "src/components/home/pressing-home.css";
const JS_OUT = "src/components/home/pressingHomeDriver.js";
const CHECK = process.argv.includes("--check");

const src = readFileSync(LAB, "utf8");
const css = src.match(/<style>([\s\S]*?)<\/style>/)[1];
const js = [...src.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
  .map((m) => m[1])
  .filter((s) => s.trim().length)[0];

/* Selectors the shell now owns. Matched exactly, so a homepage-only
   variant like ".ask.big #query" is never mistaken for one of them. */
const SHARED_FIELD = [
  "#nav .ask",
  "#query",
  "#nav:hover #query",
  "#query:focus",
  "#query::placeholder",
  ".clear",
  ".clear:hover",
  "body.asked .clear",
];

/* ── 1. the masthead's own rules come out ── */
function stripNavRules(text) {
  const out = [];
  let i = 0;
  let removed = 0;
  while (i < text.length) {
    const b = text.indexOf("{", i);
    if (b === -1) { out.push(text.slice(i)); break; }
    let selStart = Math.max(text.lastIndexOf("}", b), text.lastIndexOf("*/", b));
    selStart = selStart === -1 ? i
      : selStart + (text[selStart] === "}" ? 1 : 2);
    if (selStart < i) selStart = i;
    let depth = 1;
    let j = b + 1;
    while (j < text.length && depth) {
      if (text[j] === "{") depth += 1;
      else if (text[j] === "}") depth -= 1;
      j += 1;
    }
    const sel = text.slice(selStart, b).trim();
    /* The field's RESTING rules go too: they live in
       src/components/shell/ask-field.css now, because the field sits in
       the masthead on every route and its appearance is shell furniture.
       What stays is the travel — .ask.big, .ask.settling, the working
       scan, the body.asked states — which only the homepage has. */
    const restingField = SHARED_FIELD.some((x) => sel === x);
    if (restingField || (sel.startsWith("#nav") && !sel.includes(".ask"))) {
      out.push(text.slice(i, selStart));
      removed += 1;
    } else {
      out.push(text.slice(i, j));
    }
    i = j;
  }
  return [out.join(""), removed];
}

/* ── 2. the four rules that would reach every route ── */
const SCOPE = [
  [/(^|\})\s*html\s*\{[^}]*\}/m,
    `$1
  /* SCOPED BY THE PORT. The lab can say \`html { background }\` because
     it is the only page in its document; here that would repaint every
     route. PressingHome puts .rh-home on <html> while it is mounted,
     which is also what paints white BEHIND the masthead — the shell's
     textured ground was otherwise showing through the bar's burn. */
  html.rh-home { background: var(--paper); scroll-behavior: smooth; }`],
  [/(^|\})\s*body\s*\{[^}]*\}/m,
    `$1  html.rh-home body { font-family: var(--sans); color: var(--ink);
    -webkit-font-smoothing: antialiased; }`],
  [/(^|\})\s*a\s*\{\s*color:\s*inherit;\s*\}/m,
    `$1  html.rh-home a { color: inherit; }`],
  [/(^|\})\s*button\s*\{\s*font-family:\s*inherit;\s*\}/m,
    `$1  html.rh-home button { font-family: inherit; }`],
];

let [cssOut, navRulesDropped] = stripNavRules(css);
for (const [rx, rep] of SCOPE) {
  if (!rx.test(cssOut)) throw new Error("port: cannot scope " + rx);
  cssOut = cssOut.replace(rx, rep);
}
/* ── 3. rebind what the app hashes ── */
cssOut = cssOut.replaceAll("#nav.rev", "#nav.is-rev");

const CSS_HEAD = `/* GENERATED by scripts/port-home.mjs from public/lab/pressing-home.html.
 * Do not edit. Tune the lab, then run \`npm run port:home\`.
 *
 * The lab is the homepage's design spec and a runnable one. What this
 * file drops on the way in is the lab's copy of the masthead, because
 * the real site has Masthead.tsx; what it rescopes is the handful of
 * rules that would otherwise repaint every route.
 */
`;

/* ── the driver ── */
function stripIife(text, marker) {
  const i = text.indexOf(marker);
  if (i === -1) throw new Error("port: missing block " + marker);
  const start = text.lastIndexOf("/*", i);
  const end = text.indexOf("})();", i);
  return text.slice(0, start) + text.slice(end + 5);
}
let jsOut = js;
for (const m of ["the burn, lifted from Masthead.tsx", "the reversal, lifted too"]) {
  jsOut = stripIife(jsOut, m);
}
/* The transition is the shell's now (PressingTransition), and it runs
   for every link on the site rather than only the homepage's frames.
   The lab keeps its own copy so it still demonstrates the sequence
   standalone; leaving it in the port would mean two handlers on one
   click and two curtains over one navigation. */
{
  const marker = "/* Clicks on the work run the sequence.";
  const at = jsOut.indexOf(marker);
  if (at === -1) throw new Error("port: lab transition handler not found");
  const end = jsOut.indexOf("});", jsOut.indexOf('addEventListener("click"', at));
  if (end === -1) throw new Error("port: lab transition handler has no end");
  jsOut = jsOut.slice(0, at) + jsOut.slice(end + 3);
}
/* ── 4. the facts arrive by import, not by fetch ── */
const FETCH_RX =
  /let FACTS = null;[\s\S]*?fetch\("project-facts\.min\.json"\)[\s\S]*?\.catch\(\(\) => \{\}\);/;
if (!FETCH_RX.test(jsOut)) throw new Error("port: facts fetch block not found");
jsOut = jsOut.replace(FETCH_RX,
`/* The one deliberate divergence from the lab. There the index arrives
   over fetch, because a file opened straight from disk has no bundler;
   here it is imported, so the facts are in hand before the first answer
   composes. That deletes the lab's rebuild-when-it-lands race too. */
const FACTS = FACTS_INDEX;
const factCard = { work: new Map(), pull: new Map() };
cards.forEach((c, i) => {
  if (c.kind === "work") factCard.work.set(c.href, i);
  if (c.kind === "pull") factCard.pull.set(c.img, i);
});`);
/* ── 5. the liveness pair comes from the wrapper, not the lab ──
   The lab declares its own `alive` and `listen` so it still runs when
   opened alone: there it is one page in one document, so `alive` is a
   constant and `listen` is addEventListener. Here the wrapper below
   declares the real pair — an `alive` the teardown clears and a
   `listen` that remembers what it bound — and two `let alive` in one
   function scope is a SyntaxError, so the lab's shim comes out.

   Anchored, and asserted: everything in the driver is written against
   that contract, and a rename in the lab that silently dropped this
   swap would ship a page that cannot be unmounted. */
const SHIM_RX =
  /\/\* ── liveness, and why a lab needs it[\s\S]*?const listen = \(target, type, fn, opts\) => target\.addEventListener\(type, fn, opts\);\n/;
if (!SHIM_RX.test(jsOut)) throw new Error("port: liveness shim not found");
jsOut = jsOut.replace(SHIM_RX, "");

const JS_HEAD = `/* GENERATED by scripts/port-home.mjs from public/lab/pressing-home.html.
 * Do not edit. Tune the lab, then run \`npm run port:home\`.
 *
 * The lab's script, MOVED rather than rewritten. Everything it does is
 * imperative DOM work — dealing frames, measuring the field's travel,
 * arming curtains, composing answers — and rebuilding that as React
 * state would be a rewrite of proven code for no gain.
 *
 * Removed on the way in: the masthead's burn loop and its ink reversal,
 * because Masthead.tsx runs both and two drivers on one property is the
 * bug this kit keeps paying for.
 *
 * init() returns a teardown, which the lab never needed: it was the
 * only page in its document. This route can be navigated away from.
 */
import FACTS_INDEX from "@/data/generated/project-facts.min.json";

export function initPressingHome() {
  let alive = true;
  const listeners = [];
  const listen = (target, type, fn, opts) => {
    target.addEventListener(type, fn, opts);
    listeners.push([target, type, fn, opts]);
  };
`;
const JS_FOOT = `
  /* THE TEARDOWN. Three moves, and the order is the point.
     \`alive\` first, so any callback already in flight — the pause
     before an answer composes, the debounced redeal, the next tick of
     a chain that re-arms itself — finds the door shut when it lands.
     Then the ask timers, which are the ones with a handle worth
     clearing. Then the listeners, which is what \`listen\` was for:
     the question field and the scroller both belong to the shell and
     survive this page, so what is bound to them has to come off by
     hand or it goes on calling into a page that is gone. */
  return () => {
    alive = false;
    try { cancelAsk(); } catch (e) { /* never armed */ }
    listeners.forEach(([t, ty, fn, o]) => t.removeEventListener(ty, fn, o));

    /* AND HAND THE FIELD BACK. The note above got listeners right and
       stopped one step short: this page does not only BIND to the
       shell's question field, it DRESSES it. While the homepage is
       mounted the driver walks the field down into the cover by
       writing --ask-left/drop/w/fs/ls/fw straight onto the element and
       flipping .big past the halfway point — and that element belongs
       to the Masthead, which outlives this route. Leaving on a scrolled
       homepage therefore landed on a case study with the reader's
       question still in the input and still set in cover display type,
       ruled underneath, sitting over the study's own headline.

       So the teardown returns what it borrowed: the inline custom
       properties, the classes, the value, and the body flags the answer
       view sets. Belt and braces on the value — clearing .value alone
       leaves Masthead's own hasText state true, so the × would stay lit
       over an empty field; dispatching input lets the bar's own handler
       see the change and re-render itself. */
    const ask = document.querySelector(".ask");
    if (ask) {
      ["--ask-left", "--ask-drop", "--ask-w", "--ask-fs", "--ask-ls", "--ask-fw"]
        .forEach((v) => ask.style.removeProperty(v));
      ask.classList.remove("big", "settling");
    }
    const q = document.getElementById("query");
    if (q) {
      q.value = "";
      q.dispatchEvent(new Event("input", { bubbles: true }));
    }
    document.body.classList.remove("asked", "attop", "working");
  };
}
`;

const cssFinal = CSS_HEAD + cssOut;
const jsFinal = JS_HEAD + jsOut + JS_FOOT;

if (CHECK) {
  const stale = [];
  if (readFileSync(CSS_OUT, "utf8") !== cssFinal) stale.push(CSS_OUT);
  if (readFileSync(JS_OUT, "utf8") !== jsFinal) stale.push(JS_OUT);
  if (stale.length) {
    console.error("the lab has moved on without the port:\n  " + stale.join("\n  ") +
      "\nrun: npm run port:home");
    process.exit(1);
  }
  console.log("port up to date");
} else {
  writeFileSync(CSS_OUT, cssFinal);
  writeFileSync(JS_OUT, jsFinal);
  console.log(`ported ${LAB}`);
  console.log(`  ${CSS_OUT}  ${cssFinal.split("\n").length} lines, ${navRulesDropped} masthead rules dropped`);
  console.log(`  ${JS_OUT}  ${jsFinal.split("\n").length} lines`);
}
