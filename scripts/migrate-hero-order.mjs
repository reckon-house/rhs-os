/**
 * migrate-hero-order — swap hero/meta so meta (cover) comes first,
 * then hero rises across it. Robert's pattern.
 *
 *   node scripts/migrate-hero-order.mjs [--dry]
 *
 * For each pressing study where hero precedes meta in the sections
 * array, this:
 *   1. Moves the meta block BEFORE the hero block
 *   2. Adds `pressing: { choreo: { rise: true } }` to the hero
 *
 * Idempotent: skips studies already in the right order.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { readdirSync } from "node:fs";

const DATA = "src/data/";
const DRY = process.argv.includes("--dry");

/** Find the matching closing brace for an opening brace at `pos`,
 *  handling nested braces, string literals, and // comments. */
function matchBrace(src, pos) {
  let depth = 0;
  let inStr = null; // null | '"' | "'" | '`'
  for (let i = pos; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === "\\" && i + 1 < src.length) { i++; continue; }
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

/** Walk backwards from `pos` over blank lines and // comments to find
 *  where the comment block above this section starts. */
function commentStart(src, pos, floor) {
  let start = pos;
  // Walk back over whitespace
  let p = pos - 1;
  while (p >= floor && (src[p] === " " || src[p] === "\n" || src[p] === "\r" || src[p] === "\t")) p--;
  // Check for a comment line ending at p
  while (p >= floor) {
    // Find the start of this line
    let lineStart = src.lastIndexOf("\n", p);
    if (lineStart < floor) lineStart = floor;
    else lineStart++;
    const line = src.slice(lineStart, p + 1).trim();
    if (line.startsWith("//")) {
      start = lineStart;
      p = lineStart - 1;
      // Skip whitespace before this comment line
      while (p >= floor && (src[p] === " " || src[p] === "\n" || src[p] === "\r" || src[p] === "\t")) p--;
    } else {
      break;
    }
  }
  return start;
}

const files = readdirSync(DATA).filter((f) => f.endsWith("-case-study.ts"));

const report = [];

for (const file of files) {
  const path = DATA + file;
  let src = readFileSync(path, "utf8");
  if (!/style:\s*"pressing"/.test(src)) continue;

  // Find sections array
  const arrIdx = src.indexOf("sections: [");
  if (arrIdx === -1) continue;
  const arrOpen = src.indexOf("[", arrIdx);

  // Find the first two section objects in the array
  // by scanning for `{` at depth 1 (inside the array)
  const secs = [];
  let pos = arrOpen + 1;
  while (secs.length < 2 && pos < src.length) {
    // Skip whitespace
    while (pos < src.length && /\s/.test(src[pos])) pos++;
    // Skip // comments
    if (src[pos] === "/" && src[pos + 1] === "/") {
      pos = src.indexOf("\n", pos);
      if (pos === -1) break;
      continue;
    }
    if (src[pos] === "{") {
      const objStart = pos;
      const objEnd = matchBrace(src, objStart);
      if (objEnd === -1) break;
      // Find the comma after the closing brace
      let afterObj = objEnd + 1;
      while (afterObj < src.length && src[afterObj] === ",") afterObj++;
      // Find comment block above
      const cmtStart = commentStart(src, objStart, secs.length ? secs[secs.length - 1].afterObj : arrOpen + 1);
      secs.push({
        cmtStart,
        objStart,
        objEnd,
        afterObj,
        body: src.slice(objStart, objEnd + 1),
        full: src.slice(cmtStart, afterObj),
      });
      pos = afterObj;
    } else {
      pos++;
    }
  }

  if (secs.length < 2) continue;

  const first = secs[0];
  const second = secs[1];

  const firstIsHero = /type:\s*"hero"/.test(first.body);
  const secondIsMeta = /type:\s*"meta"/.test(second.body);

  if (!firstIsHero || !secondIsMeta) {
    const slug = file.replace(/-case-study\.ts$/, "");
    report.push(`  ${slug}: already correct`)
    continue;
  }

  // Add rise: true to the hero section if it doesn't have choreo already
  let heroBody = first.body;
  if (!/choreo/.test(heroBody)) {
    // Add pressing: { choreo: { rise: true } } before the closing }
    // Find the last property line to insert after
    if (/pressing:\s*\{/.test(heroBody)) {
      // Already has a pressing field — add choreo to it
      heroBody = heroBody.replace(
        /pressing:\s*\{/,
        "pressing: { choreo: { rise: true },"
      );
    } else {
      // Insert pressing field before closing brace
      const lastBrace = heroBody.lastIndexOf("}");
      const beforeBrace = heroBody.slice(0, lastBrace).trimEnd();
      // Ensure trailing comma
      const withComma = beforeBrace.endsWith(",") ? beforeBrace : beforeBrace + ",";
      heroBody = withComma + "\n      pressing: { choreo: { rise: true } },\n    " + heroBody.slice(lastBrace);
    }
  }

  // Build the hero's full block (with its comments) but using the modified body
  const heroFull = first.full.replace(first.body, heroBody);

  // Swap: meta comes first, then hero
  const before = src.slice(0, first.cmtStart);
  const after = src.slice(second.afterObj);
  src = before + second.full + "\n\n    " + heroFull + after;

  const slug = file.replace(/-case-study\.ts$/, "");
  if (DRY) {
    report.push(`  ${slug}: would swap (hero→after meta, +rise)`);
  } else {
    writeFileSync(path, src);
    report.push(`  ${slug}: swapped (hero→after meta, +rise)`);
  }
}

console.log(`\nmigrate-hero-order${DRY ? " (dry run)" : ""}\n`);
console.log(report.join("\n") || "  nothing matched");
console.log("");
