/**
 * port-audit — what it would actually take to move each study into the
 * pressing language.
 *
 * Written because the alternative was guessing. Thirty studies, two of
 * them ported, and the only honest way to pick the next one is to know
 * which types each study uses, which of those have a skin, and which
 * would be silently DROPPED — PressingLayout renders nothing for a type
 * it does not recognise, so an unported type is not a rough edge, it is
 * missing content.
 *
 *     node scripts/port-audit.mjs          ranked, one line each
 *     node scripts/port-audit.mjs --full   plus the per-study detail
 */

import { readFileSync } from "node:fs";
import { studyFiles, loadStudy } from "./lib/walk-studies.mjs";

const FULL = process.argv.includes("--full");

/* Read the skins straight out of the renderer rather than keeping a
   list here that would rot the moment someone adds one. Two shapes to
   match: the `s.type === "x"` branches and the VIZ_TYPES set. */
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
/* Absorbed into a neighbouring section rather than skinned directly. */
for (const t of ["text", "text-right", "three-column-text", "closing", "spacer"])
  SKINNED.add(t);

const nativeWidth = (src) => {
  try {
    const b = readFileSync("public" + src);
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
  } catch { /* a missing file is the route's problem */ }
  return 0;
};

const rows = [];
for (const file of studyFiles()) {
  const cs = await loadStudy(file);
  const secs = cs.sections || [];
  const types = new Map();
  for (const s of secs) types.set(s.type, (types.get(s.type) || 0) + 1);

  const unskinned = [...types.keys()].filter((t) => !SKINNED.has(t));
  const droppedSections = unskinned.reduce((n, t) => n + types.get(t), 0);

  const cover = secs.find((s) => s.type === "meta" || s.type === "pressing-cover");
  const hasReel = !!(cover && cover.reel && cover.reel.images?.length);

  /* Images below the floor for the biggest treatment they could get. */
  const imgs = new Set();
  const walk = (n) => {
    if (!n || typeof n !== "object") return;
    for (const [k, v] of Object.entries(n)) {
      if (typeof v === "string" && /^\/case-studies\/.*\.(jpg|jpeg|png|webp)$/i.test(v))
        imgs.add(v);
      else if (v && typeof v === "object") walk(v);
    }
  };
  walk(secs);
  const thin = [...imgs].filter((s) => {
    const w = nativeWidth(s);
    return w > 0 && w < 2400;
  }).length;

  /* Copy rules that can be checked mechanically. The em dash is the
     project's #1 rule, so it is worth knowing before a port starts. */
  const text = JSON.stringify(secs);
  const emDashes = (text.match(/—/g) || []).length;

  /* A rough sense of how much hand-work a port needs: the unported
     types dominate, because each one is either a new skin or content
     that vanishes. */
  const effort = droppedSections * 3 + (hasReel ? 0 : 2) + Math.min(thin, 6);

  rows.push({
    slug: cs.slug,
    style: cs.style === "pressing" ? "pressing" : "classic",
    sections: secs.length,
    kinds: types.size,
    unskinned,
    droppedSections,
    hasReel,
    thin,
    emDashes,
    effort,
  });
}

const todo = rows.filter((r) => r.style !== "pressing").sort((a, b) => a.effort - b.effort);
const done = rows.filter((r) => r.style === "pressing");

console.log(`\n${rows.length} studies — ${done.length} pressing, ${todo.length} to port\n`);
console.log("  effort  sections  drops  reel  thin  em—  slug");
for (const r of todo) {
  console.log(
    `  ${String(r.effort).padStart(6)}  ${String(r.sections).padStart(8)}  ` +
      `${String(r.droppedSections).padStart(5)}  ${(r.hasReel ? " yes" : "  no").padStart(4)}  ` +
      `${String(r.thin).padStart(4)}  ${String(r.emDashes).padStart(3)}  ${r.slug}`
  );
}

/* What is missing across the WHOLE portfolio, most-common first: the
   order to build skins in, since one skin can unblock many studies. */
const gap = new Map();
for (const r of todo)
  for (const t of r.unskinned) {
    const g = gap.get(t) || { studies: 0 };
    g.studies += 1;
    gap.set(t, g);
  }
const ranked = [...gap.entries()].sort((a, b) => b[1].studies - a[1].studies);
if (ranked.length) {
  console.log(`\nsection types with NO pressing skin (content would be dropped):`);
  for (const [t, g] of ranked)
    console.log(`  ${String(g.studies).padStart(3)} studies  ${t}`);
}

if (FULL) {
  console.log("");
  for (const r of todo) {
    console.log(`\n${r.slug} — ${r.sections} sections, ${r.kinds} kinds`);
    if (r.unskinned.length) console.log(`  unskinned: ${r.unskinned.join(", ")}`);
    if (!r.hasReel) console.log(`  no cover reel`);
    if (r.thin) console.log(`  ${r.thin} images under 2400px`);
    if (r.emDashes) console.log(`  ${r.emDashes} em dashes to remove`);
  }
}
console.log("");
