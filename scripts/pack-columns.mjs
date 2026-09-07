#!/usr/bin/env node
/* ── Columns, packed ─────────────────────────────────────────────────
 *
 *   npm run columns:pack     copy the engine, an example build and the
 *                            docs into columns/package/ (ignored)
 *
 * The package is made from the live sources every time, so it cannot
 * drift from them; the docs in columns/docs are the hand-written part.
 * Move columns/package/ to the other repo and read its README.
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = "columns/package";
const FILES = [
  /* the engine */
  "scripts/lib/assemble-board.py",
  "public/lab/pressing-home.html",
  "public/lab/board-shell.css",
  "public/lab/field/base.css",
  /* the data, an example build */
  "public/lab/board-data.js",
  "public/lab/board-copy.json",
  "public/lab/board.html",
  /* the ask */
  "src/app/api/ask/route.ts",
  "src/lib/ask-context.ts",
  "src/lib/voice-tells.ts",
  "scripts/ask-bench.mjs",
  "src/data/generated/project-facts.json",
  /* content operations */
  "scripts/build-board-thumbs.mjs",
  "scripts/build-facts.mjs",
  "scripts/board-audit.mjs",
  "public/lab/board-sheet.html",
  "scripts/lib/board-skip.txt",
  /* the design record: the mockup strips the decisions came from */
  "public/lab/bar-variants.html",
  "public/lab/handle-variants.html",
  "public/lab/axis-variants.html",
  /* the source data the builders read */
  "src/data/projects.ts",
  "src/data/rail-categories.ts",
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
let bytes = 0;
const lines = ["# Files", "", "Copied from the live sources by `npm run columns:pack`.", ""];
for (const f of FILES) {
  if (!existsSync(f)) { console.error("  missing: " + f); continue; }
  const to = join(OUT, f);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(f, to);
  const n = statSync(f).size; bytes += n;
  lines.push(`- \`${f}\` (${(n / 1024).toFixed(0)} kB)`);
}
cpSync("columns/README.md", join(OUT, "README.md"));
cpSync("columns/docs", join(OUT, "docs"), { recursive: true });
lines.push("", "Thumbs are not included (generated, ~1,300 files): run `npm run board` in the new home once the adapter writes data.");
writeFileSync(join(OUT, "FILES.md"), lines.join("\n") + "\n");
console.log(`columns: ${FILES.length} files, ${(bytes / 1024 / 1024).toFixed(1)} MB, plus the docs → ${OUT}/`);
