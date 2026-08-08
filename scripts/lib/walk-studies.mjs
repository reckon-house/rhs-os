/* Load every case study as a real module and walk it for strings.
 *
 * Importing beats parsing: these files are typed TypeScript exporting a
 * CaseStudy object, and Node 22 strips the types on the way in — so the
 * extractor reads the same objects the site renders, and cannot drift
 * from them the way a regex over the source would.
 *
 * The walk is generic on purpose. There are 43 section types and more
 * arrive with every study; enumerating them would guarantee the
 * extractor silently misses the newest work. Walking the object graph
 * and recording every string WITH ITS PATH means a new section type is
 * indexed the day it is written.
 */
import { readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const DATA_DIR = "src/data";

/* This volume is exfat, so macOS writes AppleDouble sidecars (._name)
 * next to every file. They are binary, they match *-case-study.ts, and
 * importing one throws a TypeScript syntax error on a NUL byte. */
export function studyFiles() {
  return readdirSync(DATA_DIR)
    .filter((f) => f.endsWith("-case-study.ts") && !f.startsWith("._"))
    .sort();
}

export async function loadStudy(file) {
  const url = pathToFileURL(resolve(DATA_DIR, file)).href;
  const mod = await import(url);
  const study = Object.values(mod).find(
    (v) => v && typeof v === "object" && Array.isArray(v.sections)
  );
  if (!study) throw new Error(`no CaseStudy export in ${file}`);
  return study;
}

/* Every string in a section, with the path that reached it. The path is
 * the citation: "text.content", "left.alt", "items.0.label". Without it
 * a fact is an assertion; with it, a fact can be checked. */
export function strings(node, path = [], out = []) {
  if (typeof node === "string") {
    if (node.trim()) out.push({ path: path.join("."), value: node });
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => strings(v, [...path, i], out));
    return out;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k === "id" || k === "type" || k === "pressing") continue;
      strings(v, [...path, k], out);
    }
  }
  return out;
}

/* The inspiration board, which is not a case study and was therefore
 * invisible to the whole index. 104 saved images, 96 distinct written
 * descriptions, and not one of them queryable — the board that exists
 * to be browsed by feel could not be asked a question.
 *
 * Their alt text is unusually good evidence: it describes what is IN
 * the picture rather than what the project was about, which is exactly
 * the register the object vocabulary matches against. */
export async function loadPulls() {
  const url = pathToFileURL(resolve(DATA_DIR, "inspiration.ts")).href;
  const mod = await import(url);
  const list = Object.values(mod).find(
    (v) => Array.isArray(v) && v.length && typeof v[0]?.src === "string"
  );
  return list || [];
}

/* A filename is evidence too: these are SEO names written by hand, and
 * they carry keywords the prose never says out loud
 * (hill-country-kitchen-island-pendants-marble-wide). Splitting them
 * into words costs nothing and recovers a whole layer. */
export function filenameWords(src) {
  const base = String(src).split("/").pop() || "";
  return base
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\d+/g, " ")
    .trim();
}
