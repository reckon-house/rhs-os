/**
 * choreo-scan — read one study and print its section spine with the
 * facts the choreography pass needs: type, id, existing pressing flags,
 * and for every image its native width (so the ≥3200 zoom floor from
 * PRESSING.md §7 is checked before a zoom is placed, not after).
 *
 *   node scripts/choreo-scan.mjs <slug> [<slug>...]
 *
 * Read-only. Placement is a judgement call; this only supplies the
 * numbers that judgement needs.
 */

import { readFileSync } from "node:fs";

const dimSrc = readFileSync("src/data/image-dimensions.ts", "utf8");
const DIMS = new Map();
for (const m of dimSrc.matchAll(/"([^"]+)":\s*\[(\d+),\s*(\d+)\]/g)) {
  DIMS.set(m[1], [Number(m[2]), Number(m[3])]);
}

/** Matching close for the brace/bracket opening at `pos`, comment-aware. */
function matchBrace(src, pos) {
  let depth = 0;
  let inStr = null;
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

for (const slug of process.argv.slice(2)) {
  const path = `src/data/${slug}-case-study.ts`;
  const src = readFileSync(path, "utf8");
  const imgConst = src.match(/const IMG = "([^"]+)"/)?.[1] ?? "";

  const arrOpen = src.indexOf("[", src.indexOf("sections: ["));
  const arrEnd = matchBrace(src, arrOpen);

  console.log(`\n${"═".repeat(72)}\n${slug}\n${"═".repeat(72)}`);

  let pos = arrOpen + 1;
  let n = 0;
  while (pos < arrEnd) {
    while (pos < arrEnd && /\s/.test(src[pos])) pos++;
    if (src[pos] === "/" && src[pos + 1] === "/") {
      pos = src.indexOf("\n", pos);
      if (pos === -1) break;
      continue;
    }
    if (src[pos] !== "{") { pos++; continue; }
    const end = matchBrace(src, pos);
    if (end === -1) break;
    const body = src.slice(pos, end + 1);
    pos = end + 1;
    while (pos < arrEnd && src[pos] === ",") pos++;

    const type = body.match(/type:\s*"([^"]+)"/)?.[1] ?? "?";
    const id = body.match(/id:\s*"([^"]+)"/)?.[1] ?? "";
    const line = src.slice(0, end).split("\n").length;

    const flags = [];
    for (const f of ["rise", "zoom", "pin", "crossing", "quotePoster"]) {
      if (new RegExp(`${f}:\\s*true`).test(body)) flags.push(f);
    }
    if (/heldLine:/.test(body)) flags.push("heldLine");
    if (/caption/.test(body)) flags.push("caption");
    const mark = body.match(/mark:\s*\{\s*n:\s*"([^"]+)"/)?.[1];

    // Every image path in this section, with its native width.
    const imgs = [];
    for (const m of body.matchAll(/\$\{IMG\}\/([^`"']+)/g)) {
      const full = `${imgConst}/${m[1]}`;
      const d = DIMS.get(full);
      imgs.push(`${m[1].slice(0, 46)} ${d ? `${d[0]}×${d[1]}` : "NO-DIMS"}`);
    }
    for (const m of body.matchAll(/["'](\/case-studies\/[^"']+)["']/g)) {
      const d = DIMS.get(m[1]);
      const short = m[1].split("/").pop().slice(0, 46);
      if (!imgs.some((s) => s.startsWith(short.slice(0, 20)))) {
        imgs.push(`${short} ${d ? `${d[0]}×${d[1]}` : "NO-DIMS"}`);
      }
    }

    n++;
    const markTag = mark ? ` mark:${mark}` : "";
    const flagTag = flags.length ? `  [${flags.join(",")}]` : "";
    console.log(
      `${String(n).padStart(3)}. L${String(line).padStart(4)} ${type.padEnd(22)} ${id.padEnd(26)}${markTag}${flagTag}`
    );
    for (const im of imgs) {
      const w = Number(im.match(/(\d+)×/)?.[1] ?? 0);
      // §7: 3200 full-bleed/zoom, 1600 flow plate, 760 column image.
      const tier = w >= 3200 ? "ZOOM-OK" : w >= 1600 ? "flow  " : w >= 760 ? "column" : "SMALL ";
      console.log(`        ${tier}  ${im}`);
    }
  }
}
console.log("");
