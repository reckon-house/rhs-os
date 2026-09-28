#!/usr/bin/env node
/* ── copy-check: the guard for a copy pass (27 Sept 2026) ────────────
   His "can we do a long running adversarial pass at copy writing while
   i am away?". Many writers edit the study files at once, so this
   proves, for one file, that only the words moved:

   - STRUCTURE: the file with every string's contents blanked and its
     comments removed is the same as at HEAD. No key, path, number,
     order or section changed; only what is inside the quotes.
   - SYNTAX: it still transpiles.
   - MARKERS: each string keeps its " | " splits (ink | grey) and its
     line breaks (\n), which the layouts read.
   - FIGURES: the figure phrases the index builds entries from ("four
     materials", "2,000+ stores", "three minutes") are all still there,
     as written. Losing one drops an entry from the index.
   - RULES: no em dash; none of CLAUDE.md's banned phrases.

       node scripts/copy-check.mjs src/data/arc-case-study.ts
       node scripts/copy-check.mjs public/lab/density/entry-lines.js

   Prints every changed string, before and after, and exits 1 on an
   error. Compares against git HEAD. */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import ts from "typescript";

const file = process.argv[2];
if (!file) { console.error("usage: node scripts/copy-check.mjs <file>"); process.exit(2); }
const now = readFileSync(file, "utf8");
let was;
try { was = execSync(`git show HEAD:${JSON.stringify(file).slice(1, -1)}`, { encoding: "utf8", maxBuffer: 1 << 26 }); }
catch (e) { console.error("not in HEAD: " + file); process.exit(2); }

/* Strings that are not copy count as structure, so changing one fails:
   property names (entry-lines' keys), import paths, the study's own
   title, and every value under a key that addresses, styles, lists or
   labels something (paths, ids, hexes, the services and stack the
   index is built from, colour and typeface names, section labels). */
const PROTECT = new Set(("id type src image images poster thumb markImage markImageRight logoConstructionImage chromaticCircleImage " +
  "appScreenshotImage heroImage href url slug style size aspect aspectClassName hex colors bg color family font n plate " +
  "services classification stack field author published status demo folder blend char variant frame weeks cmyk rgb " +
  "keywords categories competitors specimenWords ghostWord lockupTop lockupVertical heavyWord thinLead sampleText " +
  "label role padding indent links callout calloutSuffix items duration").split(" "));
const propName = (p) => (p.name && (p.name.text ?? p.name.getText())) || "";
const isStructure = (n) => {
  const p = n.parent;
  if (!p) return false;
  if ((ts.isPropertyAssignment(p) || ts.isPropertyAccessExpression(p)) && p.name === n) return true;
  if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isExternalModuleReference(p)) return true;
  let c = n, q = p;
  while (q && (ts.isArrayLiteralExpression(q) || ts.isTemplateExpression(q) || ts.isTemplateSpan(q) || ts.isParenthesizedExpression(q))) { c = q; q = q.parent; }
  if (q && ts.isPropertyAssignment(q) && q.initializer === c) {
    const k = propName(q);
    if (PROTECT.has(k)) return true;
    const obj = q.parent; const keys = ts.isObjectLiteralExpression(obj) ? obj.properties.map(propName) : [];
    if (k === "title" && keys.includes("sections")) return true;
    if (k === "name" && keys.includes("hex")) return true;
  }
  return false;
};
const strings = (text) => {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".js") ? ts.ScriptKind.JS : ts.ScriptKind.TS);
  const out = [];
  const visit = (n) => {
    if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || n.kind === ts.SyntaxKind.TemplateHead || n.kind === ts.SyntaxKind.TemplateMiddle || n.kind === ts.SyntaxKind.TemplateTail) && isStructure(n)) return;
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) out.push({ s: n.getStart(sf), e: n.end, t: n.text, q: text[n.getStart(sf)] });
    else if (n.kind === ts.SyntaxKind.TemplateHead || n.kind === ts.SyntaxKind.TemplateMiddle || n.kind === ts.SyntaxKind.TemplateTail) out.push({ s: n.getStart(sf), e: n.end, t: n.text, tpl: n.kind });
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out.sort((a, b) => a.s - b.s);
};
const skeleton = (text, list) => {
  let o = "", at = 0;
  for (const x of list) {
    o += text.slice(at, x.s);
    const raw = text.slice(x.s, x.e);
    if (x.tpl === ts.SyntaxKind.TemplateHead) o += "`§${";
    else if (x.tpl === ts.SyntaxKind.TemplateMiddle) o += "}§${";
    else if (x.tpl === ts.SyntaxKind.TemplateTail) o += "}§`";
    else o += raw[0] + "§" + raw[0];
    at = x.e;
  }
  o += text.slice(at);
  return o.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1").replace(/\s+/g, " ").trim();
};

const errs = [], warns = [];

/* JSON (board-house.json): the same guard by path. Same keys, same
   types, same array lengths; only string values may differ, and --only
   limits which paths may (e.g. --only=about). */
if (file.endsWith(".json")) {
  const only = (process.argv.find((a) => a.startsWith("--only=")) || "").slice(7);
  let a, b; try { a = JSON.parse(was); b = JSON.parse(now); } catch (e) { console.log("ERROR: SYNTAX: " + e.message); console.log("FAIL (1)"); process.exit(1); }
  const changedJ = [];
  const walk = (x, y, at) => {
    if (typeof x !== typeof y || Array.isArray(x) !== Array.isArray(y) || (x === null) !== (y === null)) return errs.push("STRUCTURE: type changed at " + at);
    if (typeof x === "string") { if (x !== y) changedJ.push([at, x, y]); return; }
    if (x && typeof x === "object") {
      const kx = Object.keys(x), ky = Object.keys(y);
      if (kx.join() !== ky.join()) return errs.push("STRUCTURE: keys or length changed at " + at);
      kx.forEach((k) => walk(x[k], y[k], at + (Array.isArray(x) ? `[${k}]` : "." + k)));
    } else if (x !== y) errs.push("STRUCTURE: value changed at " + at);
  };
  walk(a, b, "$");
  changedJ.forEach(([at, x, y]) => {
    if (only && !at.startsWith("$." + only)) errs.push("SCOPE: " + at + " is outside --only=" + only);
    if (/\u2014/.test(y)) errs.push("EM DASH at " + at);
    if (process.argv.includes("--diff")) console.log("\n  " + at + "\n  - " + x + "\n  + " + y);
  });
  console.log(`${file}: ${changedJ.length} strings changed`);
  errs.forEach((e) => console.log("ERROR: " + e));
  console.log(errs.length ? `FAIL (${errs.length})` : "OK");
  process.exit(errs.length ? 1 : 0);
}
const diag = ts.transpileModule(now, { reportDiagnostics: true, fileName: file, compilerOptions: { target: ts.ScriptTarget.ES2022 } }).diagnostics || [];
diag.forEach((d) => errs.push("SYNTAX: " + ts.flattenDiagnosticMessageText(d.messageText, " ")));

const A = strings(was), B = strings(now);
if (A.length !== B.length) errs.push(`STRUCTURE: ${A.length} strings at HEAD, ${B.length} now. Only change what is inside the quotes.`);
const skA = skeleton(was, A), skB = skeleton(now, B);
if (skA !== skB) {
  let i = 0; while (i < skA.length && skA[i] === skB[i]) i++;
  errs.push("STRUCTURE: something outside the strings changed, near: …" + skB.slice(Math.max(0, i - 60), i + 60) + "…  (HEAD: …" + skA.slice(Math.max(0, i - 60), i + 60) + "…)");
}

/* the figure phrases, as study-panel.js finds them */
const NUMW = "two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|twenty|thirty";
const TIME = "weeks?|years?|months?|days?|hours?|minutes?";
const COUNT = "stores|tools|trainers|programs|categories|materials|marbles|stones|prints|tiles|shapes|collections|logos|setups|photographs|frames|finishes|weights|colorways|providers|applications|channels|locations|rooms|album covers|clients|lockups|feet";
const RW = new RegExp("\\b(" + NUMW + ")[- ](" + TIME + "|" + COUNT + ")\\b", "gi");
const RD = /(?<![A-Za-z0-9'’.\-])(?:Weeks? )?~?\$?\d[\d,]*(?:\.\d+)?(?:[-–]\$?\d[\d,]*(?:\.\d+)?)?(?:%|\+|x\d+|x|KB|MB|ms|fps|M|")?(?:[- ](?:square feet|foot|feet|hours|minutes|weeks|wks|items|stores|store|square|wide|degree|per page|SKUs))?(?![A-Za-z0-9])/g;
const figs = (list) => { const m = new Map(); list.forEach((x) => { const t = x.t; for (const re of [RW, RD]) for (const f of t.match(re) || []) m.set(f, (m.get(f) || 0) + 1); }); return m; };
const prose = (x) => x.t.length >= 12 && !/^(\/|https?:|#[0-9A-Fa-f]{3,8}$|[a-z0-9-]+$)/.test(x.t);
const fA = figs(A.filter(prose)), fB = figs(B.filter(prose));
fA.forEach((n, f) => {
  const m = fB.get(f) || 0;
  if (!m) errs.push(`FIGURE: "${f}" is gone. Keep every figure phrase at least once, exactly as written (the index builds entries from them).`);
  else if (m < n) warns.push(`figure "${f}" ${n}x at HEAD, ${m}x now (fine if a repeat was cut)`);
});
fB.forEach((n, f) => { if (!fA.has(f)) warns.push(`new figure "${f}": only if the study already states it elsewhere; never invent a number`); });

const BANNED = ["crafting meaningful experiences", "creative soul", "problem-solver", "journey", "passion", "tapestry", "leveraging", "elevating", "disrupting", "innovative", "cutting-edge", "best-in-class", "seamless", "robust", "the result was"];
const changed = [];
if (A.length === B.length) A.forEach((a, i) => { if (a.t !== B[i].t) changed.push([a.t, B[i].t]); });
changed.forEach(([a, b]) => {
  const tag = JSON.stringify(b.slice(0, 70));
  if (/—/.test(b)) errs.push("EM DASH in " + tag);
  const bl = b.toLowerCase();
  BANNED.forEach((w) => { if (bl.includes(w) && !a.toLowerCase().includes(w)) errs.push(`BANNED "${w}" in ${tag}`); });
  if (/\bsurfaces\b/.test(bl) && !/\bsurfaces\b/.test(a.toLowerCase())) warns.push(`"surfaces" as a verb? ${tag}`);
  const bars = (s) => (s.match(/ \| /g) || []).length, nl = (s) => (s.match(/\n/g) || []).length;
  if (bars(a) !== bars(b)) errs.push(`MARKER: " | " split count changed (${bars(a)} → ${bars(b)}) in ${tag}`);
  if (nl(a) !== nl(b)) errs.push(`MARKER: line break count changed (${nl(a)} → ${nl(b)}) in ${tag}`);
  if (/\b[Ww]e\b/.test(b) && !/\b[Ww]e\b/.test(a) && file.includes("case-study")) warns.push(`"we" added in ${tag} ("We" never appears in case studies)`);
});

console.log(`${file}: ${changed.length} string${changed.length === 1 ? "" : "s"} changed of ${B.length}`);
if (process.argv.includes("--diff")) changed.forEach(([a, b]) => console.log("\n  - " + a.replace(/\n/g, "\\n") + "\n  + " + b.replace(/\n/g, "\\n")));
warns.forEach((w) => console.log("warn: " + w));
errs.forEach((e) => console.log("ERROR: " + e));
console.log(errs.length ? `FAIL (${errs.length})` : "OK");
process.exit(errs.length ? 1 : 0);
