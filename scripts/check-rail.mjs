#!/usr/bin/env node
/* ── The rail says the same thing on every surface ────────────────────
 *
 * The rail appears twice: down the homepage's pinned column, built by
 * pressingHomeDriver.js from the lab's own NOTES and FILTERS literals,
 * and again in the ring that closes every other page, rendered by
 * src/components/shell/IndexRail.tsx from src/data/practice-notes.ts
 * and src/data/rail-categories.ts.
 *
 * Two copies of the same words, and until now nothing compared them.
 * practice-notes.ts said so in its own header — "scripts/port-home.mjs
 * --check does not cover this, which is the one seam in that
 * arrangement" — and the seam duly opened: "What I do" was rewritten
 * in the lab and the app-side copy kept the retired sentence, so the
 * footer of every case study described a different practice than the
 * homepage.
 *
 * This closes it. Three checks, no dependencies, run on build:
 *   1. every note the rail reads exists on both sides and matches
 *   2. every filter label and query matches
 *   3. every project id in rail-categories.ts exists in projects.ts
 *
 * The driver is generated, so it is the downstream artifact of the lab
 * and therefore the authority here: if these disagree, the app-side
 * data is what is stale.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const driver = read("src/components/home/pressingHomeDriver.js");
const notesTs = read("src/data/practice-notes.ts");
const railTs = read("src/data/rail-categories.ts");
const projectsTs = read("src/data/projects.ts");

const fail = [];

/* ── 1. the notes ──────────────────────────────────────────────────
   The driver's NOTES is an array of ["Title", "body", …] tuples. Only
   the titles the rail actually reads are compared: the practice bio is
   the homepage's cover statement and the ring does not repeat it. */
const RAIL_READS = [
  "What I do", "The setup", "Recently", "Get in touch", "The stack",
];

const driverNotes = new Map();
{
  const block = driver.match(/const NOTES = \[([\s\S]*?)\n\];/);
  if (!block) fail.push("could not find the NOTES literal in pressingHomeDriver.js");
  else
    for (const m of block[1].matchAll(/\[\s*"((?:[^"\\]|\\.)*)",\s*"((?:[^"\\]|\\.)*)"/g))
      driverNotes.set(unesc(m[1]), unesc(m[2]));
}

const appNotes = new Map();
for (const m of notesTs.matchAll(
  /title:\s*"((?:[^"\\]|\\.)*)",\s*\n?\s*body:\s*"((?:[^"\\]|\\.)*)"/g
))
  appNotes.set(unesc(m[1]), unesc(m[2]));

for (const title of RAIL_READS) {
  const a = driverNotes.get(title);
  const b = appNotes.get(title);
  if (a === undefined) fail.push(`note "${title}" is missing from the driver's NOTES`);
  else if (b === undefined) fail.push(`note "${title}" is missing from practice-notes.ts`);
  else if (a !== b)
    fail.push(
      `note "${title}" differs:\n      lab/driver: ${a}\n      app data:   ${b}`
    );
}

/* ── 2. the filters ────────────────────────────────────────────────
   The driver's FILTERS carries label, query, glyph and note. The app
   side splits the same four across rail-categories.ts. */
const driverFilters = [];
{
  const block = driver.match(/const FILTERS = \[([\s\S]*?)\n\];/);
  if (!block) fail.push("could not find the FILTERS literal in pressingHomeDriver.js");
  else
    for (const m of block[1].matchAll(
      /\[\s*"((?:[^"\\]|\\.)*)",\s*"((?:[^"\\]|\\.)*)"/g
    ))
      driverFilters.push([unesc(m[1]), unesc(m[2])]);
}

const appCats = [];
for (const m of railTs.matchAll(
  /label:\s*"((?:[^"\\]|\\.)*)",\s*\n\s*query:\s*"((?:[^"\\]|\\.)*)"/g
))
  appCats.push([unesc(m[1]), unesc(m[2])]);

if (driverFilters.length && appCats.length) {
  if (driverFilters.length !== appCats.length)
    fail.push(
      `filter count differs: driver has ${driverFilters.length}, rail-categories.ts has ${appCats.length}`
    );
  else
    driverFilters.forEach(([label, query], i) => {
      const [aLabel, aQuery] = appCats[i];
      if (label !== aLabel || query !== aQuery)
        fail.push(
          `filter ${i + 1} differs: driver ["${label}", "${query}"] vs app ["${aLabel}", "${aQuery}"]`
        );
    });
}

/* ── 2b. the marks ──────────────────────────────────────────────
   Nothing to compare any more. This block read a RAIL_ICONS table on
   each side and checked the path data matched, because the four Lucide
   marks were drawn rather than installed and so existed twice. The
   categories carry no mark now — the labels do that work — so the
   glyph slot holds only "slash", for the two utility rows, and the
   filter comparison above already covers it.

   Left as a note rather than deleted: if a mark ever comes back it
   will come back as two copies again, and this is where the guard
   goes. */

/* ── 3. the category rosters ───────────────────────────────────────
   Every id the rail counts must be a real project, or a renamed study
   silently shortens a count and the reel drops a frame. */
const projectIds = new Set(
  [...projectsTs.matchAll(/\{\s*id:\s*"([^"]+)"/g)].map((m) => m[1])
);
for (const m of railTs.matchAll(/ids:\s*\[([^\]]*)\]/gs))
  for (const id of [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]))
    if (!projectIds.has(id))
      fail.push(`rail-categories.ts references unknown project id "${id}"`);

function unesc(s) {
  return s.replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\u2019/g, "’");
}

if (fail.length) {
  console.error(
    "\ncheck-rail: the rail disagrees with itself across surfaces.\n" +
      "The driver is generated from the lab, so it is the authority — " +
      "the app-side data below is what is stale.\n"
  );
  for (const f of fail) console.error("  • " + f);
  console.error("");
  process.exit(1);
}

console.log(
  `check-rail: ok — ${RAIL_READS.length} notes and ${appCats.length} filters agree, ` +
    `all category ids resolve`
);
