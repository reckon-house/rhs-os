// viz-audit — the chart system's completion gate.
//
// "How do we make sure we get them all?" — this file. Every component in
// pressing/viz/ must carry an `@shape` tag naming which spec shape it
// conforms to (rings | sticks | stripes | dots | mass | voice). Untagged
// means unconverted. Retired token names anywhere outside the CSS alias
// block mean the rename is unfinished. Classic chart types still riding
// the VIZ_TYPES bridge are listed with their disposition. The audit
// exits non-zero while ANY of that is outstanding, so "npm run viz-audit
// is green" IS the definition of finished — nothing can hide in a
// composite render path the way the gap column did, because the glob
// reads the directory, not anyone's memory.
//
// Spec: public/lab/viz-system.html. Motion: src/lib/viz-motion.ts.

import fs from "fs";
import path from "path";

const VIZ_DIR = "src/components/case-study/pressing/viz";
const SHAPES = new Set(["rings", "sticks", "stripes", "dots", "mass", "voice"]);
const RETIRED = ["--pv-hair", "--pv-faint", "--pv-acc"];

// Classic types still bridged through VIZ_TYPES, with their agreed
// disposition. Anything listed as "chart" or "swatch-ledger" is work;
// "artwork" and "layout" are settled by decision, not by drawing.
const BRIDGE_PLAN = {
  "kitchen-palette": "swatch-ledger",
  "color-permutations": "swatch-ledger",
  "pattern-matrix": "artwork (reframe on paper)",
  "hex-polygon": "artwork (brand mark)",
  "polygon-lattice": "artwork (brand mark)",
  "sizzle-playground": "interactive (own thing)",
  "app-showcase": "layout",
  "brand": "layout",
  "color-field-map": "unused?",
  "color-palette": "layout",
  "double-exposure-anatomy": "unused?",
  "tech-chart": "unused?",
  "tech-stack": "layout",
  "timeline": "layout",
  "two-column-text": "layout",
  "typography": "layout",
  "feature-cards": "layout",
  "pipeline": "layout",
  "text-right": "layout",
};

let fail = 0;
const say = (s) => console.log(s);

// ── 1 · every viz component carries a shape ─────────────────────────
say("── viz components ─────────────────────────────────────────");
const files = fs
  .readdirSync(VIZ_DIR)
  /* the volume is exfat and sheds AppleDouble ._ shadows; they are not
     components */
  .filter((f) => f.endsWith(".tsx") && !f.startsWith("._"))
  .sort();
const untagged = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(VIZ_DIR, f), "utf8");
  const m = src.match(/@shape (\w+)/);
  const shape = m ? m[1] : null;
  const bad = shape && !SHAPES.has(shape) ? ` (UNKNOWN SHAPE "${shape}")` : "";
  const retiredHere = RETIRED.filter((t) => src.includes(t));
  const tokenNote = retiredHere.length
    ? `  retired-tokens: ${retiredHere.join(", ")}`
    : "";
  if (!shape || bad) untagged.push(f);
  if (retiredHere.length) fail++;
  say(
    `${shape && !bad ? "  ok " : "  TODO"}  ${f.replace(".tsx", "").padEnd(28)} ${
      shape ? "@" + shape + bad : "— untagged"
    }${tokenNote}`
  );
}
if (untagged.length) fail += untagged.length;

// ── 2 · retired tokens in the stylesheet, outside the alias block ───
const css = fs.readFileSync(path.join(VIZ_DIR, "PressingViz.module.css"), "utf8");
// the alias definitions themselves are the three `--pv-x: var(...)` lines;
// every OTHER mention is a call site awaiting rename
const aliasDefs = css.match(/--pv-(hair|faint|acc):\s*var\([^)]*\);/g) || [];
const mentions = css.match(/--pv-(hair|faint|acc)/g) || [];
const callSites = mentions.length - aliasDefs.length;
say("\n── stylesheet ─────────────────────────────────────────────");
if (callSites > 0) {
  say(`  TODO  PressingViz.module.css        ${callSites} retired-token call sites to rename`);
  fail++;
} else if (aliasDefs.length > 0) {
  say(`  TODO  PressingViz.module.css        call sites clean — delete the ${aliasDefs.length} alias definitions`);
  fail++;
} else {
  say("  ok    PressingViz.module.css        no retired tokens");
}

// ── 3 · the classic bridge ──────────────────────────────────────────
say("\n── VIZ_TYPES bridge ───────────────────────────────────────");
const layout = fs.readFileSync(
  "src/components/case-study/pressing/PressingLayout.tsx",
  "utf8"
);
const setMatch = layout.match(/const VIZ_TYPES = new Set<[^>]*>\(\[([\s\S]*?)\]\)/);
const bridged = setMatch
  ? [...setMatch[1].matchAll(/"([a-z-]+)"/g)].map((m) => m[1])
  : [];
const dataDir = "src/data";
const dataFiles = fs
  .readdirSync(dataDir)
  .filter((f) => f.endsWith("-case-study.ts"))
  .map((f) => ({ f, src: fs.readFileSync(path.join(dataDir, f), "utf8") }));
for (const t of bridged) {
  const used = dataFiles
    .filter(({ src }) => src.includes(`type: "${t}"`))
    .map(({ f }) => f.replace("-case-study.ts", ""));
  const plan = BRIDGE_PLAN[t] || "UNPLANNED";
  const isWork = plan === "swatch-ledger" || plan === "chart" || plan === "UNPLANNED";
  if (used.length && isWork) {
    say(`  TODO  ${t.padEnd(30)} ${plan}  [${used.join(", ")}]`);
    fail++;
  } else if (used.length) {
    say(`  ok    ${t.padEnd(30)} ${plan}  [${used.join(", ")}]`);
  } else {
    say(`  —     ${t.padEnd(30)} unused by any study`);
  }
}

say(
  fail
    ? `\n${fail} item(s) outstanding — the chart system is not finished.`
    : "\nGREEN — every chart conforms, no retired tokens, bridge settled."
);
process.exit(fail ? 1 : 0);
