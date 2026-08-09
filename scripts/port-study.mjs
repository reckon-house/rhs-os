/**
 * port-study — the mechanical half of moving a study into pressing.
 *
 * Three things a port always needs and none of them require taste:
 *   1. `style: "pressing"` on the study object, which routes it to
 *      PressingLayout.
 *   2. A cover reel — frames from the study's own folder, colours from
 *      the palette it already declares. Every pressing study has one.
 *   3. Marks on its section headers, numbered down the page.
 *
 * What it does NOT do is choreography. Which section pins, which rises
 * across it, which headline crosses — those are design decisions about
 * a specific study's rhythm, and a script guessing them would produce
 * confident nonsense that reads as intentional. Ports come out correct
 * and quiet; the choreography is added by hand afterwards.
 *
 *     node scripts/port-study.mjs <slug> [--dry]
 *     node scripts/port-study.mjs --all-clean [--dry]
 *
 * `--all-clean` ports every study the audit says drops no sections.
 * Idempotent: a study already carrying `style: "pressing"` is skipped.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { studyFiles, loadStudy } from "./lib/walk-studies.mjs";

/* studyFiles() returns bare filenames; everything below needs paths. */
const DATA = "src/data/";

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const ALL = args.includes("--all-clean");
const only = args.find((a) => !a.startsWith("--"));

/* A reel frame must be OPAQUE — a PNG with alpha lets the reel's dark
   stage through and reads as the picture failing to fill its box. */
const hasAlpha = (file) => {
  try {
    const b = readFileSync(file);
    return b.slice(1, 4).toString() === "PNG" && (b[25] === 4 || b[25] === 6);
  } catch {
    return true; // unreadable is not a frame worth risking
  }
};

const nativeWidth = (file) => {
  try {
    const b = readFileSync(file);
    if (b.slice(1, 4).toString() === "PNG") return b.readUInt32BE(16);
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length - 9) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
          return b.readUInt16BE(i + 7);
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch { /* fall through */ }
  return 0; // webp and friends: unknown, allowed
};

/** A short story-beat name from a header's own title.
 *  The title is read out of SOURCE, where a line break is the two
 *  characters backslash-n rather than a newline — splitting on a real
 *  newline leaves the escape sitting in the mark. */
const beat = (title) => {
  const first = String(title || "")
    .split(/\\n|\n/)[0]
    .replace(/[.,;:]+$/, "")
    .trim();
  return first.length > 28 ? first.slice(0, 28).replace(/\s+\S*$/, "") : first;
};

/* The skins PressingLayout actually has, read from it rather than
   listed here. A study with an unskinned type must NOT be ported: the
   renderer emits nothing for a type it does not know, so porting it
   would silently delete content. */
const layout = readFileSync(
  "src/components/case-study/pressing/PressingLayout.tsx",
  "utf8"
);
const SKINNED = new Set(
  [...layout.matchAll(/s\.type === "([a-z-]+)"/g)].map((m) => m[1])
);
const vizBlock = layout.slice(
  layout.indexOf("const VIZ_TYPES"),
  layout.indexOf("]);", layout.indexOf("const VIZ_TYPES"))
);
for (const m of vizBlock.matchAll(/"([a-z-]+)"/g)) SKINNED.add(m[1]);
for (const t of ["text", "text-right", "three-column-text", "closing", "spacer"])
  SKINNED.add(t);

/* Palettes derived from photography for studies that declare none.
   Built by scripts/derive-palettes.py; absent is fine. */
let DERIVED = {};
try {
  DERIVED = JSON.parse(
    readFileSync("src/data/generated/derived-palettes.json", "utf8")
  );
} catch { /* no derived palettes yet */ }

const report = [];

for (const file of studyFiles()) {
  const cs = await loadStudy(file);
  const slug = cs.slug;
  if (only && slug !== only) continue;
  if (!only && !ALL) continue;

  const path = DATA + file;
  const src = readFileSync(path, "utf8");
  if (/style:\s*"pressing"/.test(src)) {
    report.push(`  ${slug}: already pressing, skipped`);
    continue;
  }

  const unskinned = [
    ...new Set(cs.sections.map((x) => x.type).filter((t) => !SKINNED.has(t))),
  ];
  if (unskinned.length) {
    report.push(`  ${slug}: REFUSED — no skin for ${unskinned.join(", ")}`);
    continue;
  }

  /* ── the reel ──
     Frames come from the study's OWN referenced images, in source
     order, not from a folder named after the slug: several studies keep
     their images elsewhere (fairview-suite's live in fairview-bedroom),
     and a folder scan also picks up files the study never uses.
     Source order is the sequence the work is experienced in, which is
     the rule for a reel. */
  const refs = [];
  const seen = new Set();
  const walk = (n) => {
    if (!n || typeof n !== "object") return;
    for (const v of Object.values(n)) {
      if (
        typeof v === "string" &&
        /^\/case-studies\/.*\.(jpg|jpeg|png|webp)$/i.test(v)
      ) {
        if (!seen.has(v)) { seen.add(v); refs.push(v); }
      } else if (v && typeof v === "object") walk(v);
    }
  };
  walk(cs.sections);
  const frames = refs
    .filter((src) => {
      const f = "public" + src;
      return existsSync(f) && !hasAlpha(f);
    })
    .slice(0, 8);

  /* Colours: the study's declared palette, or one derived from its own
     photographs when it never declared one. Never picked to taste — a
     reel flashing colours the work does not use is a lie about it. */
  const paletteSec = cs.sections.find(
    (s) => s.type === "marks-materials" || s.type === "brand-system"
  );
  let colors = (paletteSec?.colors || []).map((c) => c.hex).slice(0, 5);
  let derived = false;
  if (!colors.length && DERIVED[slug]) {
    colors = DERIVED[slug].slice(0, 5);
    derived = true;
  }

  if (!frames.length || !colors.length) {
    report.push(
      `  ${slug}: NOT ported — ${!frames.length ? "no opaque frames" : ""}` +
        `${!frames.length && !colors.length ? " and " : ""}` +
        `${!colors.length ? "no declared palette" : ""}`
    );
    continue;
  }

  let out = src;

  /* 1. route it */
  out = out.replace(/(\n\s*)sections:\s*\[/, `$1style: "pressing",$1sections: [`);

  /* 2. the reel, onto the meta section */
  const reelBlock =
    `\n      reel: {\n` +
    `        caption: "Preview · ${frames.length} frames",\n` +
    `        colors: [${colors.map((c) => `"${c}"`).join(", ")}],\n` +
    `        images: [\n` +
    frames.map((f) => `          "${f}",`).join("\n") +
    `\n        ],\n      },`;
  const metaIdx = out.indexOf('type: "meta"');
  if (metaIdx !== -1 && !/reel:\s*\{/.test(out)) {
    const lineEnd = out.indexOf("\n", metaIdx);
    out = out.slice(0, lineEnd) + reelBlock + out.slice(lineEnd);
  }

  /* 3. marks on the section headers, numbered down the page. The meta
     section is 01 by convention (the cover), so headers start at 02. */
  let n = 2;
  out = out.replace(
    /(\{\s*\n\s*id:\s*"[^"]*",\s*\n\s*type:\s*"section-header",\s*\n(?:[^{}]|\{[^{}]*\})*?title:\s*")([^"]*)(",)/g,
    (m, pre, title, post) => {
      if (/pressing:/.test(m)) return m;
      const mark = `\n      pressing: { mark: { n: "${String(n).padStart(2, "0")}", name: "${beat(title)}" } },`;
      n += 1;
      /* The match swallows the source's own trailing comma, so the
         mark can carry its own and the join stays valid. */
      return pre + title + post + mark;
    }
  );

  if (DRY) {
    report.push(
      `  ${slug}: would port — ${frames.length} frames, ${colors.length} colours` +
        `${derived ? " (derived)" : ""}`
    );
  } else {
    writeFileSync(path, out);
    report.push(
      `  ${slug}: ported — ${frames.length} frames, ${colors.length} colours` +
        `${derived ? " (derived)" : ""}`
    );
  }
}

console.log(`\nport-study${DRY ? " (dry run)" : ""}\n`);
console.log(report.join("\n") || "  nothing matched");
console.log("");
