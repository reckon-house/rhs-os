/**
 * choreo-audit — measure how far every pressing study is from correct.
 *
 *   node scripts/choreo-audit.mjs [slug]        # one study, or all
 *   node scripts/choreo-audit.mjs --totals      # just the scoreboard
 *
 * "Correct" is defined in CHOREO-RULES.md. This reports the four
 * violation classes it names, per study, so done is measurable rather
 * than a matter of opinion:
 *
 *   BARE     a full-width plate with no rise and no zoom — it just sits
 *   STACK    two or more bare plates in a row
 *   NOPIN    a section header carrying copy whose headline does not pin
 *   CHART    a classic chart still rendering in its pre-pressing skin
 *
 * Read-only. It never edits; placement is judgement and stays by hand.
 */

import { readFileSync, readdirSync } from "node:fs";

const ARG = process.argv.find((a) => !a.startsWith("-") && a.endsWith("") && !a.includes("/"));
const TOTALS_ONLY = process.argv.includes("--totals");

/** Chart types still rendering through PressingLayout's classic bridge. */
const CLASSIC_CHARTS = new Set(
  (() => {
    const src = readFileSync(
      "src/components/case-study/pressing/PressingLayout.tsx",
      "utf8"
    );
    const start = src.indexOf("const VIZ_TYPES");
    const block = src.slice(start, src.indexOf("]);", start));
    return [...block.matchAll(/"([a-z0-9-]+)"/g)]
      .map((m) => m[1])
      /* layout sections, not charts */
      .filter((t) => !["feature-cards", "text-right", "pipeline", "two-column-text"].includes(t));
  })()
);

const PLATE = new Set(["hero", "image"]);
/** Absorbed by a preceding section-header into one rendered brief. */
const ABSORBED = new Set(["text", "text-right", "three-column-text", "spacer", "coverage-chart"]);

function matchBrace(src, pos) {
  let depth = 0, inStr = null;
  for (let i = pos; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === "\\") { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === "/" && src[i + 1] === "/") {
      const nl = src.indexOf("\n", i);
      i = nl === -1 ? src.length : nl;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; continue; }
    if (ch === "{" || ch === "[") depth++;
    if (ch === "}" || ch === "]") { depth--; if (depth === 0) return i; }
  }
  return -1;
}

function sectionsOf(src) {
  const arrOpen = src.indexOf("[", src.indexOf("sections: ["));
  const arrEnd = matchBrace(src, arrOpen);
  const out = [];
  let pos = arrOpen + 1;
  while (pos < arrEnd) {
    while (pos < arrEnd && /\s/.test(src[pos])) pos++;
    if (src[pos] === "/" && src[pos + 1] === "/") {
      pos = src.indexOf("\n", pos);
      if (pos === -1) break;
      continue;
    }
    if (src[pos] !== "{") { pos++; continue; }
    const start = pos, end = matchBrace(src, pos);
    if (end === -1) break;
    const body = src.slice(start, end + 1);
    pos = end + 1;
    while (pos < arrEnd && src[pos] === ",") pos++;
    out.push({
      id: body.match(/id:\s*"([^"]+)"/)?.[1] ?? "",
      type: body.match(/type:\s*"([^"]+)"/)?.[1] ?? "",
      line: src.slice(0, start).split("\n").length,
      rise: /rise:\s*true/.test(body),
      zoom: /zoom:\s*true/.test(body),
      pin: /pin:\s*true/.test(body),
      crossing: /crossing:\s*true/.test(body),
    });
  }
  return out;
}

const totals = { BARE: 0, STACK: 0, NOPIN: 0, CHART: 0, studies: 0, clean: 0 };
const lines = [];

for (const file of readdirSync("src/data").filter((f) => f.endsWith("-case-study.ts"))) {
  const src = readFileSync("src/data/" + file, "utf8");
  if (!/style: "pressing"/.test(src)) continue;
  const slug = file.replace("-case-study.ts", "");
  if (ARG && ARG !== "choreo-audit.mjs" && ARG !== slug) continue;

  const secs = sectionsOf(src);
  const hits = [];
  let prevBare = false;

  for (let i = 0; i < secs.length; i++) {
    const s = secs[i];

    if (CLASSIC_CHARTS.has(s.type)) {
      hits.push(`CHART  L${s.line} ${s.id} (${s.type})`);
      totals.CHART++;
      continue;
    }

    if (s.type === "section-header") {
      /* Does this header carry copy? Count what the fold will absorb. */
      let j = i + 1, copy = 0, closing = false;
      while (j < secs.length && ABSORBED.has(secs[j].type)) {
        if (secs[j].type !== "spacer") copy++;
        j++;
      }
      if (secs[j]?.type === "closing") closing = true;
      /* A closing cluster renders as PressingClosing, which has no pin.
         A crossing header pins as part of the gesture. */
      if (copy >= 1 && !closing && !s.pin) {
        hits.push(`NOPIN  L${s.line} ${s.id} (${copy} absorbed blocks)`);
        totals.NOPIN++;
      }
      continue;
    }

    if (!PLATE.has(s.type)) { prevBare = false; continue; }

    const bare = !s.rise && !s.zoom;
    if (bare) {
      hits.push(
        prevBare
          ? `STACK  L${s.line} ${s.id} (second bare plate in a row)`
          : `BARE   L${s.line} ${s.id}`
      );
      if (prevBare) totals.STACK++; else totals.BARE++;
    }
    prevBare = bare;
  }

  totals.studies++;
  if (!hits.length) totals.clean++;
  if (hits.length && !TOTALS_ONLY) {
    lines.push(`\n${slug}  (${hits.length})\n  ` + hits.join("\n  "));
  } else if (!hits.length && !TOTALS_ONLY) {
    lines.push(`\n${slug}  ✓ clean`);
  }
}

if (!TOTALS_ONLY) console.log(lines.join("\n"));
console.log(
  `\n${"─".repeat(60)}\n` +
    `  ${totals.BARE} bare plates · ${totals.STACK} stacked · ` +
    `${totals.NOPIN} unpinned briefs · ${totals.CHART} classic charts\n` +
    `  ${totals.clean}/${totals.studies} studies clean\n`
);
