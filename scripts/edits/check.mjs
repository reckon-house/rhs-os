/* ── CHECK A STUDY'S EDIT (6 Oct 2026) ───────────────────────────────────
   node scripts/edits/check.mjs <study-key>   (npm run edits:check -- <key>)
   Reads scripts/edits/<k>.json and the room's fragments, and reports what
   each variant shows and folds, then errors (unmatched keys, dashes,
   banned words, we/our/us, a chapter with no section) and warnings
   (words found nowhere in the study, a number in two places, likely
   repeats). The study's corpus is its lines, facts, chapters and the
   demos' titles and notes. Warnings are for reading, not for zero: a
   synonym or a joined sentence is fine when the claim is the study's.
   Exit 1 on errors. BRIEF.md beside this file is the standard. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const k = process.argv[2];
if (!k) { console.error("usage: node check.mjs <study-key>"); process.exit(2); }

const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "public/lab/density/fragments.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "public/lab/density/chapters.js"), "utf8"), ctx);
const F = ctx.window.DENSITY.frags.filter((f) => f.k === k);
if (!F.length) { console.error("no study " + k); process.exit(2); }
const CH = (ctx.window.DENSITY_CHAPTERS || {})[k] || [];

const norm = (s) => String(s || "").replace(/\s+/g, " ").trim();
const plain = (s) => norm(String(s || "").replace(/\s*\|\s*/g, " "));
const words = (s) => plain(s).split(/\s+/).filter(Boolean);
const wc = (s) => words(s).length;
const toks = (s) => plain(s).toLowerCase().replace(/[“”"'’‘()\[\],.:;!?]/g, " ").split(/\s+/).filter(Boolean);

const lines = F.filter((f) => f.kind === "line");
const heads = lines.filter((f) => f.weight === "head" && f.where === "section-header");
const secLines = lines.filter((f) => f.where !== "meta" && f.where !== "abstract" && !(f.weight === "head" && f.where === "section-header"));
const absLines = lines.filter((f) => f.where === "abstract");
const facts = F.filter((f) => f.kind === "fact" && f.label !== "Author");

/* the study's own words: every line, fact and chapter line, split into sentences */
const lives = F.filter((f) => f.kind === "live");
const corpusTexts = [...lines.map((f) => f.text), ...facts.map((f) => f.value), ...CH.flatMap((c) => [c.t + " " + (c.g || ""), c.app || ""]), ...lives.flatMap((f) => [f.title || "", f.note || ""])];
const sentences = corpusTexts.flatMap((t) => plain(t).split(/(?<=[.!?])\s+/)).filter(Boolean);
const corpusTok = new Set(sentences.flatMap(toks));

const STOP = new Set("a an the and or but of to in on at for with by from as is was were be been it its this that these those then than so into over under up out each every one".split(" "));
const BANNED = ["crafting meaningful", "creative soul", "journey", "passion", "tapestry", "leverag", "elevat", "disrupt", "innovative", "cutting-edge", "best-in-class", "seamless", "robust", "the result was", "surfaces "];

const errors = [], warns = [];
let E;
try { E = JSON.parse(fs.readFileSync(path.join(HERE, k + ".json"), "utf8")); } catch (e) { console.error("cannot read " + k + ".json: " + e.message); process.exit(1); }
if (!E.variants || typeof E.variants !== "object") { console.error("no variants"); process.exit(1); }

const match = (key, pool, what) => {
  const n = norm(key); if (!n) { errors.push(what + ": empty key"); return null; }
  const hits = pool.filter((f) => norm(f.text).startsWith(n));
  if (hits.length !== 1) { errors.push(what + ': "' + key + '" matches ' + hits.length + " lines" + (hits.length ? " (make it longer)" : "")); return null; }
  return hits[0];
};

/* the best source sentence for a new string, and the words it adds */
const fidelity = (s, where) => {
  for (const sent of plain(s).split(/(?<=[.!?])\s+/).filter(Boolean)) {
    const t = toks(sent); if (!t.length) continue;
    let best = null, bestScore = -1;
    for (const src of sentences) { const st = new Set(toks(src)); const sc = t.filter((w) => st.has(w)).length / t.length; if (sc > bestScore) { bestScore = sc; best = src; } }
    const st = new Set(toks(best));
    const added = t.filter((w) => !st.has(w) && !STOP.has(w));
    const alien = t.filter((w) => !corpusTok.has(w) && !STOP.has(w));
    if (alien.length) warns.push(where + ": words found nowhere in the study: " + [...new Set(alien)].join(", ") + '  <- "' + sent + '"');
    else if (added.length > 2) warns.push(where + ": " + added.length + " words not in its closest source sentence (" + [...new Set(added)].join(", ") + ')  <- "' + sent + '"  ~ "' + best + '"');
  }
};
const voice = (s, where) => {
  const p = String(s || "");
  if (/[—–]/.test(p)) errors.push(where + ": em or en dash");
  const low = p.toLowerCase();
  BANNED.forEach((b) => { if (low.includes(b)) errors.push(where + ': banned "' + b.trim() + '"'); });
  if (/\b(we|our|us|We|Our|Us|WE|OUR)\b/.test(p)) errors.push(where + ': "we/our/us"');
};

const report = {};
for (const [vn, v] of Object.entries(E.variants)) {
  const tag = vn;
  const vis = [], fold = [];
  const act = new Map(); /* fragment id -> action */
  const L = v.lines || {};
  for (const [key, a] of Object.entries(L)) {
    const f = match(key, [...secLines, ...absLines], tag + " lines"); if (!f) continue;
    if (act.has(f.id)) errors.push(tag + ': two keys for "' + key + '"');
    act.set(f.id, a);
    if (a && typeof a === "object") { if (!a.more) errors.push(tag + ': object action needs "more"'); else { fidelity(a.more, tag + " fold trim"); voice(a.more, tag + " fold trim"); } }
    else if (a !== "keep" && a !== "drop" && a !== "more") { fidelity(a, tag + " replace"); voice(a, tag + " replace"); }
  }
  (v.keep || []).forEach((key) => { const f = match(key, secLines, tag + " keep"); if (f && !act.has(f.id)) act.set(f.id, "keep"); });
  const H = v.heads || {}, hact = new Map();
  for (const [key, a] of Object.entries(H)) {
    const f = match(key, heads, tag + " heads"); if (!f) continue; hact.set(f.id, a);
    if (a !== "drop" && a !== "keep") { fidelity(a, tag + " head"); voice(a, tag + " head"); }
  }
  Object.keys(v.moreTitle || {}).forEach((key) => { const f = match(key, heads, tag + " moreTitle"); const t = (v.moreTitle || {})[key]; voice(t, tag + " moreTitle"); });
  /* the room finds a chapter's section by the head's original words, so a new head may say anything */
  Object.entries(v.labels || {}).forEach(([key, t]) => { match(key, heads, tag + " labels"); voice(t, tag + " label"); });
  Object.entries(v.decks || {}).forEach(([key, t]) => { match(key, heads, tag + " decks"); fidelity(t, tag + " deck"); voice(t, tag + " deck"); });
  if (false) for (const key of Object.keys(H)) if (CH.some((c) => norm(key).startsWith(norm(c.head)) || norm(c.head).startsWith(norm(key)))) {
    const f = match(key, heads, "-"); if (f && hact.get(f.id) !== "keep" && !(typeof hact.get(f.id) === "string" && norm(hact.get(f.id)).startsWith(norm(CH.find((c) => norm(key).startsWith(norm(c.head)) || norm(c.head).startsWith(norm(key))).head)))) errors.push(tag + ': head "' + key + '" carries a chapter; a new head must start with "' + CH.find((c) => norm(key).startsWith(norm(c.head)) || norm(c.head).startsWith(norm(key))).head + '"');
  }
  const rest = v.rest || "keep";
  if (!["keep", "drop", "more"].includes(rest)) errors.push(tag + ": rest must be keep, drop or more");

  /* the subtitle */
  const stand = v.stand != null ? v.stand : (lines.find((f) => f.where === "meta" && f.weight === "sub") || {}).text;
  if (v.stand != null) { fidelity(v.stand, tag + " stand"); voice(v.stand, tag + " stand"); }
  if (stand) vis.push(["subtitle", stand]);
  /* the abstract */
  if (Array.isArray(v.abs)) v.abs.forEach((s, i) => { fidelity(s, tag + " abs"); voice(s, tag + " abs"); vis.push(["abstract", s]); });
  else absLines.forEach((f) => { const a = act.get(f.id); if (a === "drop" || (a && typeof a === "object")) return; if (a === "more") { fold.push(["abstract", f.text]); return; } vis.push(["abstract", a && a !== "keep" ? a : f.text]); });
  /* the top: what I did and the drawers */
  (v.did || []).forEach((s) => { fidelity(s, tag + " did"); voice(s, tag + " did"); vis.push(["did", s]); });
  (v.drawers || []).forEach((d, i) => {
    if (!d || !d.t) { errors.push(tag + " drawer " + i + ": no title"); return; }
    voice(d.t, tag + " drawer title"); vis.push(["drawer title", d.t]);
    (d.p || []).forEach((s) => { fidelity(s, tag + " drawer"); voice(s, tag + " drawer"); fold.push(["drawer " + d.t, s]); });
    (d.cols || []).forEach((c) => { voice(c.t, tag + " drawer col"); fold.push(["drawer col", c.t]); (c.p || []).forEach((s) => { fidelity(s, tag + " drawer col"); voice(s, tag + " drawer col"); fold.push(["drawer " + d.t, s]); }); });
  });
  /* the sections */
  let curHead = null, headDropped = false, rowOwn = false;
  for (const f of lines) {
    if (f.where === "meta" || f.where === "abstract") continue;
    if (f.weight === "head" && f.where === "section-header") {
      const ov = Object.entries(v.chapters || {}).find(([h]) => norm(f.text).startsWith(norm(h)));
      rowOwn = !!(ov && (ov[1].li || ov[1].p || ov[1].proof)) && v.moreTo === "chapters";
      const a = hact.get(f.id); headDropped = a === "drop";
      if (ov && ov[1].t && !a) { vis.push(["head (the chapter line)", "§"]); continue; }
      if (!headDropped) vis.push(["head", a && a !== "keep" ? a : f.text]);
      continue;
    }
    let a = act.get(f.id) || (headDropped ? "drop" : rest);
    if (a === "drop") continue;
    if ((a === "more" || (a && typeof a === "object")) && rowOwn) continue;
    if (a && typeof a === "object") { fold.push(["section", a.more]); continue; }
    if (a === "more") { fold.push(["section", f.text]); continue; }
    vis.push([f.where + "/" + f.weight, a !== "keep" ? a : f.text]);
  }
  Object.values(v.decks || {}).forEach((t) => vis.push(["deck", t]));
  /* rewritten chapters: their lines show (in the contents and as their sections' titles), their rows' copy folds */
  Object.entries(v.chapters || {}).forEach(([h, c]) => {
    if (CH.length ? !CH.some((x) => norm(x.head) === norm(h)) : heads.filter((f) => norm(f.text).startsWith(norm(h))).length !== 1) errors.push(tag + ': no chapter or section head for "' + h + '"');
    if (!c.t) errors.push(tag + ': chapter "' + h + '" has no line (t)');
    if ((c.li || []).length && (c.li || []).length !== 3) warns.push(tag + ': chapter "' + h + '" has ' + c.li.length + " specifics; the standard is three");
    const line = (c.t || "") + " " + (c.g || "");
    fidelity(line, tag + " chapter"); voice(line, tag + " chapter"); vis.push(["chapter", line]);
    [...(c.p || []), ...(c.li || []).map((x) => String(x).replace(/\s*\|\s*/, ": ")), ...(c.proof ? [c.proof] : [])].forEach((x) => { fidelity(x, tag + " row"); voice(x, tag + " row"); fold.push(["row " + h, x]); });
  });
  Object.values(v.captions || {}).forEach((t) => voice(t, tag + " caption"));
  (v.facts || facts.map((f) => f.label)).forEach((lab) => { const f = facts.find((x) => x.label === lab); if (!f && !(v.factSet || {})[lab]) errors.push(tag + ': no fact "' + lab + '"'); });
  Object.entries(v.factSet || {}).forEach(([lab, val]) => { fidelity(val, tag + " fact " + lab); voice(val, tag + " fact " + lab); });

  /* repeats: a number or a long shared run of words in two places */
  const all = [...vis, ...fold].filter(([w]) => w !== "drawer title" && w !== "did" && w !== "drawer col");
  const nums = new Map();
  all.forEach(([w, s], i) => { (plain(s).match(/\b\d[\d,.%]*\b(?:\s+(?:weeks?|hours?|days?|months?|stores?|percent|minutes?))?/gi) || []).forEach((n) => { const key = n.toLowerCase(); if (!nums.has(key)) nums.set(key, []); nums.get(key).push(i); }); });
  nums.forEach((ix, n) => { if (new Set(ix).size > 1) warns.push(tag + ': "' + n + '" appears ' + new Set(ix).size + " times: " + [...new Set(ix)].map((i) => '"' + plain(all[i][1]).slice(0, 70) + '"').join(" / ")); });
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const a = toks(all[i][1]).filter((w) => !STOP.has(w)), b = new Set(toks(all[j][1]).filter((w) => !STOP.has(w)));
    if (a.length < 4 || b.size < 4) continue;
    const shared = [...new Set(a)].filter((w) => b.has(w));
    const r = shared.length / Math.min(new Set(a).size, b.size);
    if (r >= 0.6) warns.push(tag + ": possible repeat (" + Math.round(r * 100) + '%): "' + plain(all[i][1]).slice(0, 80) + '" / "' + plain(all[j][1]).slice(0, 80) + '"');
  }
  report[vn] = { shown: vis.reduce((n, [, s]) => n + wc(s), 0), folded: fold.reduce((n, [, s]) => n + wc(s), 0) };
}
const now = lines.reduce((n, f) => n + wc(f.text), 0);
console.log(k + ": today " + now + " words shown");
for (const [vn, r] of Object.entries(report)) console.log("  " + vn.padEnd(6) + " shows " + r.shown + " words (" + Math.round((r.shown / now) * 100) + "%), folds " + r.folded + (r.folded ? " (total " + (r.shown + r.folded) + ")" : ""));
if (warns.length) { console.log("\nWARNINGS (review each; fix or justify):"); warns.forEach((w) => console.log("  - " + w)); }
if (errors.length) { console.log("\nERRORS:"); errors.forEach((e) => console.log("  - " + e)); process.exit(1); }
console.log("\nno errors");
