/* ── A ROOM'S WORDS, IN READING ORDER (6 Oct 2026) ───────────────────────
   node scripts/edits/room.mjs <study-key>
   Prints every line of a study's room as the room composes it, with its
   role (SUBTITLE, ABSTRACT, SECTION HEAD, DECK, BODY, COLUMN TITLE, PULL
   QUOTE, CLOSING), its facts, pictures, live demos with their notes, and
   the chapters it has in chapters.js. An edit names lines by their first
   words, so this is the list to name them from. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const k = process.argv[2];
if (!k) { console.error("usage: node scripts/edits/room.mjs <study-key>"); process.exit(2); }
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "public/lab/density/fragments.js"), "utf8"), ctx);
try { vm.runInContext(fs.readFileSync(path.join(ROOT, "public/lab/density/chapters.js"), "utf8"), ctx); } catch (e) { /* none */ }
const D = ctx.window.DENSITY, s = D.studies.find((x) => x.k === k);
if (!s) { console.error("no study " + k); process.exit(2); }
const F = D.frags.filter((f) => f.k === k);
const out = [];
let words = 0;
const wc = (t) => String(t).replace(/\|/g, " ").split(/\s+/).filter(Boolean).length;
out.push("ROOM " + k + " · " + s.t + " · " + s.s + " · " + s.y + " · lines: " + (s.tags || []).join(", "));
for (const f of F) {
  if (f.kind === "line") {
    words += wc(f.text);
    const role = f.where === "meta" ? "SUBTITLE" : f.where === "abstract" ? "ABSTRACT" : f.weight === "head" && f.where === "section-header" ? "\n== SECTION HEAD" : f.weight === "head" ? "  COLUMN TITLE" : f.weight === "display" ? "  PULL QUOTE" : f.weight === "sub" && f.where === "closing" ? "  CLOSING" : f.weight === "sub" ? "  DECK" : "  BODY";
    out.push(role + (f.label ? " (label: " + f.label + ")" : "") + ": " + f.text);
  } else if (f.kind === "fact") { if (f.label !== "Author") out.push("FACT " + f.label + ": " + f.value); }
  else if (f.kind === "pic") out.push("  [picture" + (f.where === "meta" ? " (cover pool)" : "") + " " + (f.src || "").split("/").pop() + (f.alt ? " | " + f.alt : "") + "]");
  else if (f.kind === "live") out.push("  [live demo: " + (f.title || "") + (f.note ? " || " + f.note : "") + "]");
  else if (f.kind === "num") out.push("  [stat: " + JSON.stringify(f).slice(0, 160) + "]");
  else if (f.kind === "tool") out.push("TOOL " + f.label + ": " + f.value);
  else out.push("  [" + f.kind + "]");
}
const CH = (ctx.window.DENSITY_CHAPTERS || {})[k];
if (CH) out.push("\nCHAPTERS in chapters.js: " + CH.map((c) => c.head + " => " + c.t + " " + (c.g || "")).join(" / "));
out.unshift(words + " words in lines");
console.log(out.join("\n"));
