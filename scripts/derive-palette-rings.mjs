/* Recompute the palette rings from the vision index.
 *
 *   node scripts/derive-palette-rings.mjs [--slug hill-country-kitchen]
 *
 * The chart's arcs claim a share of the room, and a claim that cannot be
 * recomputed is a claim nobody can check. This prints the exact literal
 * that belongs in viz/palettes.ts, so re-reading a photograph or adding
 * one is a paste rather than a judgement call.
 *
 * That matters more here than the mechanics suggest. The chart these
 * numbers feed replaced one whose 49 hex values were arithmetic ramps
 * typed by hand, sitting under a header reading "as specified". The
 * cheapest guard against a repeat is that the numbers have a command
 * that regenerates them.
 *
 * NOT wired into a build step on purpose. It reads the vision index but
 * writes nothing; a silent regeneration is how a chart starts disagreeing
 * with the comment that explains it.
 */
import { readFileSync } from "node:fs";

const VISION = "src/data/generated/image-vision.json";
const argv = process.argv.slice(2);
const at = argv.indexOf("--slug");
const SLUG = at >= 0 ? argv[at + 1] : "hill-country-kitchen";

/* How many clusters to look for, and how many of them are finishes.
   Five and four for the kitchen: the fifth lands on the dark-stained
   dining table, which is furniture rather than a finish. */
const K = 5;
const KEEP = 4;

/* Outlier trim, as a multiple of the cluster's MEDIAN distance from its
   own centroid. 1.6 was chosen against the sage cluster, which without
   it swallowed a warm brown (#5B3722) and produced a gradient running
   brown to olive. Median rather than mean because one far outlier drags
   a mean far enough to stop excluding itself. */
const TRIM = 1.6;

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c) =>
  "#" + c.map((x) => Math.round(x).toString(16).padStart(2, "0")).join("").toUpperCase();
const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const images = JSON.parse(readFileSync(VISION, "utf8")).images;
const frames = Object.entries(images).filter(([src]) => src.includes(`/${SLUG}/`));
if (!frames.length) {
  console.error(`no catalogued frames under /${SLUG}/`);
  process.exit(1);
}
const pts = frames.flatMap(([, r]) => r.palette || []).map((h) => rgb(h.toLowerCase()));

/* k-means, seeded farthest-first so the result is deterministic. Math.random
   would make this print different numbers on different runs, which for a
   figure that ships in a chart is worse than a crude seeding rule. */
let cent = [pts[0]];
while (cent.length < K) {
  let best = null, bd = -1;
  for (const p of pts) {
    const m = Math.min(...cent.map((c) => dist(p, c)));
    if (m > bd) { bd = m; best = p; }
  }
  cent.push(best);
}
const assign = () => {
  const g = cent.map(() => []);
  for (const p of pts) {
    let bi = 0, bd = Infinity;
    cent.forEach((c, i) => { const x = dist(p, c); if (x < bd) { bd = x; bi = i; } });
    g[bi].push(p);
  }
  return g;
};
for (let it = 0; it < 60; it++) {
  const g = assign();
  cent = g.map((grp, i) =>
    grp.length ? [0, 1, 2].map((k) => grp.reduce((s, p) => s + p[k], 0) / grp.length) : cent[i]
  );
}

const groups = assign()
  .map((grp, i) => ({ c: cent[i], grp }))
  .sort((a, b) => b.grp.length - a.grp.length);

const kept = groups.slice(0, KEEP);
const total = kept.reduce((s, r) => s + r.grp.length, 0);

console.log(`slug        ${SLUG}`);
console.log(`frames      ${frames.length}`);
console.log(`values      ${pts.length}`);
console.log(`clusters    ${K}, keeping the ${KEEP} largest`);
console.log(`excluded    ${groups.slice(KEEP).map((r) => `${hex(r.c)} (n=${r.grp.length})`).join(", ")}\n`);

console.log("Paste into src/components/case-study/pressing/viz/palettes.ts:\n");
console.log("export const KITCHEN_RINGS: FinishRing[] = [");
for (const r of kept) {
  const ds = r.grp.map((p) => dist(p, r.c)).sort((a, b) => a - b);
  const med = ds[Math.floor(ds.length / 2)];
  const keep = r.grp.filter((p) => dist(p, r.c) <= med * TRIM);
  const s = keep.slice().sort((a, b) => lum(a) - lum(b));
  const share = Math.round((r.grp.length / total) * 100);
  console.log(
    `  { name: "?", n: ${r.grp.length}, dark: "${hex(s[0])}", light: "${hex(s[s.length - 1])}" },` +
    `   // mid ${hex(r.c)}, ${share}%, ${r.grp.length - keep.length} trimmed`
  );
}
console.log("];");
console.log(`\nexport const KITCHEN_RINGS_FRAMES = ${frames.length};`);
console.log("\nNames are not derivable from pixels. Carry them over by hand.");
