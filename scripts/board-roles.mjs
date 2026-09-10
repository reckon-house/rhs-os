#!/usr/bin/env node
/* ── What each picture IS inside its own study ───────────────────────
 *
 *   npm run board:roles      read the studies, write board-roles.json
 *
 * The audit measures a tile and the sheet suggests by file name, but
 * the study itself already knows more than either: a picture is a
 * hero, a full-width plate, one half of a pair, one of three, a
 * thumbnail in a text column, or a frame in the cover reel. That is
 * the difference between a photograph the work is presented on and a
 * detail that only reads in context, and it is the cut Jeremy is
 * making now. Read out of src/data/*-case-study.ts by walking each
 * file and remembering the section a picture sits in.
 *
 * A picture in a study's folder that the study never places is
 * "unused": nothing on the site shows it, and the board deals it.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const DATA = "src/data";
const CS = "public/case-studies";
const OUT = "public/lab/board-roles.json";

/* the section types, grouped by how big the picture runs on the page */
const PLATE = new Set(["hero", "image"]);
const PAIR = new Set(["dual-image", "triple-image"]);

const roles = {};          /* "<slug>/<file>" → role */
const perStudy = {};

for (const f of readdirSync(DATA).filter((x) => x.endsWith("-case-study.ts") && !x.startsWith("._"))) {
  const src = readFileSync(join(DATA, f), "utf8");
  const slug = (src.match(/^\s*slug:\s*"([^"]+)"/m) || [])[1];
  if (!slug) { console.error("  no slug in " + f); continue; }
  const lines = src.split("\n");
  let section = "other", reel = 0, cols = 0;
  for (const line of lines) {
    /* the blocks a picture can be buried in, by brace count */
    if (reel) reel += (line.match(/[[{]/g) || []).length - (line.match(/[\]}]/g) || []).length;
    else if (/\breel:\s*\{/.test(line)) reel = 1;
    if (cols) cols += (line.match(/[[{]/g) || []).length - (line.match(/[\]}]/g) || []).length;
    else if (/\bcolumns:\s*\[/.test(line)) cols = 1;
    const t = line.match(/\btype:\s*"([a-z-]+)"/);
    if (t && !reel && !cols) section = t[1];
    /* every image path on the line, however it is written */
    const paths = [...line.matchAll(/(?:\$\{IMG\}|\$\{CS\}\/[a-z0-9-]+|\/case-studies\/[a-z0-9-]+)\/([^"`\s]+\.(?:jpg|jpeg|png|webp|avif))/gi)];
    for (const m of paths) {
      const own = (line.match(/\$\{CS\}\/([a-z0-9-]+)\//) || line.match(/\/case-studies\/([a-z0-9-]+)\//) || [])[1] || slug;
      const key = own + "/" + m[1];
      const role = reel ? "reel" : cols ? "column"
        : PLATE.has(section) ? (section === "hero" ? "hero" : "plate")
        : PAIR.has(section) ? "pair" : section;
      /* a picture placed twice keeps the biggest job it does */
      const rank = { hero: 6, plate: 5, pair: 4, column: 2, reel: 1 };
      if (!roles[key] || (rank[role] || 3) > (rank[roles[key]] || 3)) roles[key] = role;
    }
  }
  /* and what the folder holds that the study never placed */
  const dir = join(CS, slug);
  if (existsSync(dir)) {
    for (const file of readdirSync(dir)) {
      if (!/\.(jpg|jpeg|png|webp|avif)$/i.test(file)) continue;
      const key = slug + "/" + file;
      if (!roles[key]) roles[key] = "unused";
    }
  }
  perStudy[slug] = Object.keys(roles).filter((k) => k.startsWith(slug + "/")).length;
}

/* two studies keep their pictures in a folder named for something
   else, and the board re-homes them; the roles answer to both names */
const ALIAS = { sally: "sally-os", "fairview-suite": "fairview-bedroom" };
for (const [from, to] of Object.entries(ALIAS)) {
  for (const [k, v] of Object.entries(roles)) {
    if (k.startsWith(from + "/")) roles[to + k.slice(from.length)] = v;
  }
}

const tally = {};
for (const r of Object.values(roles)) tally[r] = (tally[r] || 0) + 1;
writeFileSync(OUT, JSON.stringify({ at: new Date().toISOString(), roles }));
console.log("roles: " + Object.keys(roles).length + " pictures in " + Object.keys(perStudy).length + " studies");
console.log("  " + Object.entries(tally).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + " " + v).join(", "));
console.log("  → " + OUT);
