#!/usr/bin/env node
/* ── Every project tile has a registered ratio ────────────────────────
 *
 * The registry in src/data/image-dimensions.ts is load-bearing: the
 * homepage and the footer ring both look a tile's ratio up there, and a
 * MISS is silent — the frame falls through to a 1:1 box and the picture
 * is cropped square with nothing logged.
 *
 * That is exactly what happened. Two tiles were recropped and renamed in
 * projects.ts while the registry kept only the old keys, so the Various
 * design tile (728x604) rendered square for however long the filename
 * had been stale. Nobody noticed because a silent square looks like a
 * decision.
 *
 * So the miss is loud now, and it runs on build. Cheap and dependency
 * free: read the two files, compare the keys.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const projects = read("src/data/projects.ts");
const dims = read("src/data/image-dimensions.ts");

/* projects.ts writes its tiles as `${HP}/name.jpg`, with HP declared
   just above. Resolve the one template it uses rather than evaluating
   the module — this script must not import app code. */
const hp = projects.match(/const\s+HP\s*=\s*"([^"]+)"/);
if (!hp) {
  console.error("check-dimensions: could not find the HP prefix in projects.ts");
  process.exit(1);
}

const used = [
  // `${HP}/foo.jpg`
  ...[...projects.matchAll(/image:\s*`\$\{HP\}(\/[^`]+)`/g)].map(
    (m) => hp[1] + m[1]
  ),
  // plain "…" paths, for any tile that does not use the template
  ...[...projects.matchAll(/image:\s*"(\/[^"]+)"/g)].map((m) => m[1]),
];

const registered = new Set(
  [...dims.matchAll(/"(\/[^"]+?)"\s*:/g)].map((m) => m[1])
);

/* The ?v= cache-bust is not part of the key: the registry is keyed on
   the clean path so a recropped tile can bust the immutable cache
   without needing a second entry. */
const missing = [...new Set(used.map((u) => u.split("?")[0]))].filter(
  (u) => !registered.has(u)
);

if (missing.length) {
  console.error(
    `\ncheck-dimensions: ${missing.length} project image(s) have no entry in ` +
      `src/data/image-dimensions.ts.\nEach one renders as a 1:1 crop with no ` +
      `warning. Run \`npm run dims\` to regenerate, or add them by hand:\n`
  );
  for (const m of missing) console.error("  " + m);
  console.error("");
  process.exit(1);
}

console.log(
  `check-dimensions: ok — ${new Set(used.map((u) => u.split("?")[0])).size} project images, all registered`
);
