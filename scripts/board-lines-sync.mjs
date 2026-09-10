/* ── The lines a study sits on, written back to the app ─────────────
   The board decides where a study sits from scripts/lib/board-order.txt
   ("# homes": `arc = app, digital, branding`, set on lab/board-order.html).
   Two things in the app answer the same question from their own data:
   the study bar in the masthead reads projects.ts tags (plus the Apps
   list in rail-categories.ts), and the footer ring reads the id lists
   in rail-categories.ts. Left alone they disagree with the board the
   moment a study is moved by hand.

   This writes the board's answer into both. projects.ts: the study's
   `tags` become its lines (the line tags only; "app" is not a tag, it
   is the list). rail-categories.ts: each row's `ids` become the studies
   on that line, keeping the order the list already had and adding new
   ones at the end in site order. Studies without a "# homes" line are
   left as they are, so this touches only what the sheet moved.

   `npm run lines:sync`, after pasting a Copy order into board-order.txt
   and before `npm run board`, which reads projects.ts back into the
   board's own data. */
import { readFileSync, writeFileSync } from "node:fs";

const LINE_TAGS = ["digital", "creative", "branding", "interiors"];
const ROWS = { digital: "Digital", app: "Apps", creative: "Campaigns", branding: "Branding", interiors: "Interiors" };

/* the homes, as the assembler reads them */
const homes = {};
let run = null;
for (const raw of readFileSync("scripts/lib/board-order.txt", "utf8").split("\n")) {
  const t = raw.trim();
  if (!t) continue;
  if (t.startsWith("#")) { const h = t.replace(/^#+\s*/, "").split(/\s+/); run = h[0] || null; continue; }
  if (run !== "homes" || !t.includes("=")) continue;
  const [k, v] = t.split("=");
  homes[k.trim()] = v.split("#")[0].split(",").map((x) => x.trim()).filter(Boolean);
}

/* folder → project id, from the board's own groups */
const data = readFileSync("public/lab/board-data.js", "utf8");
const groups = JSON.parse(data.match(/window\.BOARD_GROUPS = (\{[\s\S]*?\});/)[1]);
const idOf = (folder) => groups[folder] && groups[folder].id;

/* ── projects.ts: tags ──────────────────────────────────────────── */
const pp = "src/data/projects.ts";
let proj = readFileSync(pp, "utf8");
const changed = [];
for (const [folder, lines] of Object.entries(homes)) {
  const id = idOf(folder);
  if (!id) { console.warn(`  no study for "${folder}" — skipped`); continue; }
  const re = new RegExp(`(\\{ id: "${id}",[^\\n]*?tags: \\[)([^\\]]*)(\\])`);
  const m = proj.match(re);
  if (!m) { console.warn(`  ${id}: no tags line found — skipped`); continue; }
  const was = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  const now = LINE_TAGS.filter((t) => lines.includes(t));
  if (was.join() !== now.join()) {
    proj = proj.replace(re, `$1${now.map((t) => `"${t}"`).join(", ")}$3`);
    changed.push(`${id}: tags ${was.join("+") || "none"} → ${now.join("+")}`);
  }
}
writeFileSync(pp, proj);

/* every study's lines, homes first, then the data's own */
const railP = "src/data/rail-categories.ts";
let rail = readFileSync(railP, "utf8");
const appIds = [...(rail.match(/label: "Apps",[\s\S]*?ids: \[([^\]]*)\]/) || ["", ""])[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
const byId = {};
for (const [folder, g] of Object.entries(groups)) if (g.id) byId[g.id] = { folder, tags: g.tags || [] };
const projOrder = [...proj.matchAll(/\{ id: "([^"]+)",[^\n]*?tags: \[([^\]]*)\]/g)]
  .map((m) => [m[1], [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1])]);
const linesOf = (id, tags) => {
  const folder = byId[id] && byId[id].folder;
  if (folder && homes[folder]) return homes[folder];
  return [...tags, ...(appIds.includes(id) ? ["app"] : [])];
};

/* ── rail-categories.ts: ids ────────────────────────────────────── */
for (const [line, label] of Object.entries(ROWS)) {
  const re = new RegExp(`(label: "${label}",[\\s\\S]*?ids: \\[)([^\\]]*)(\\])`);
  const m = rail.match(re);
  if (!m) { console.warn(`  rail row "${label}" not found`); continue; }
  const had = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  const on = projOrder.filter(([id, tags]) => linesOf(id, tags).includes(line)).map(([id]) => id);
  const kept = had.filter((id) => on.includes(id));
  const added = on.filter((id) => !had.includes(id));
  const now = [...kept, ...added];
  if (now.join() === had.join()) continue;
  const body = now.length ? "\n      " + now.map((id) => `"${id}",`).join("\n      ") + "\n    " : "";
  rail = rail.replace(re, `$1${body}$3`);
  const gone = had.filter((id) => !on.includes(id));
  changed.push(`${label}: ${had.length} → ${now.length}` + (added.length ? `, +${added.join(", ")}` : "") + (gone.length ? `, −${gone.join(", ")}` : ""));
}
writeFileSync(railP, rail);

console.log(changed.length ? "lines:sync\n  " + changed.join("\n  ") : "lines:sync: nothing to change");
