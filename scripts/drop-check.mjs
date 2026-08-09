/* Simulate PressingLayout's absorb loop and report every section that
   reaches the drop branch — i.e. authored content rendering as nothing. */
import { studyFiles, loadStudy } from "./lib/walk-studies.mjs";
const ABSORBABLE = new Set(["text", "text-right", "three-column-text", "closing", "coverage-chart"]);
let total = 0;
for (const file of studyFiles()) {
  const cs = await loadStudy(file);
  if (cs.style !== "pressing") continue;
  const secs = cs.sections;
  const dropped = [];
  let i = 0;
  const HEADERISH = new Set(["section-header"]);
  while (i < secs.length) {
    const s = secs[i];
    if (HEADERISH.has(s.type)) {
      let j = i + 1, usedCols = false, usedCov = false;
      while (j < secs.length) {
        const n = secs[j];
        if (n.type === "text" || n.type === "text-right") { j++; continue; }
        if (n.type === "coverage-chart" && !usedCov) { usedCov = true; j++; continue; }
        /* a second grid under one header BREAKS the absorb loop now,
           so it renders standalone rather than being swallowed */
        if (n.type === "three-column-text") { if (!usedCols) { usedCols = true; j++; continue; } break; }
        if (n.type === "closing") { j++; break; }
        break;
      }
      i = j; continue;
    }
    /* Mirrors PressingLayout after the standalone-skin fix: editorial
       headlines always render, and text / three-column-text / closing
       render standalone when not absorbed. A spacer carries no copy. */
    if (s.type === "editorial-headline") { /* renders */ }
    else if (ABSORBABLE.has(s.type)) { /* renders standalone */ }
    else if (s.type === "spacer") { /* deliberate air, consumed */ }
    i++;
  }
  if (dropped.length) {
    total += dropped.length;
    console.log(`  ${cs.slug}: ${dropped.map(d => `${d[0]}:${d[1]}`).join(", ")}`);
  }
}
console.log(`\n  ${total} sections render as NOTHING`);
