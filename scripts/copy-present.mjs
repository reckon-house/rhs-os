/* Fetch every pressing study and assert that each editorial-headline's
   authored text actually appears in the rendered HTML. A simulation of
   the absorb loop can be wrong; the page cannot. */
import { studyFiles, loadStudy } from "./lib/walk-studies.mjs";
let checked = 0, missing = 0;
for (const file of studyFiles()) {
  const cs = await loadStudy(file);
  if (cs.style !== "pressing") continue;
  const heads = cs.sections.filter((s) => s.type === "editorial-headline");
  if (!heads.length) continue;
  const html = await fetch(`http://localhost:3000/case-studies/${cs.slug}`).then((r) => r.text());
  for (const h of heads) {
    checked++;
    // first clause only: the renderer may split lines across elements
    const probe = String(h.text).split(/\\n|\n/)[0].trim().slice(0, 24);
    if (!html.includes(probe)) { missing++; console.log(`  MISSING  ${cs.slug}: "${probe}"`); }
  }
}
console.log(`\n  ${checked} editorial headlines checked, ${missing} missing from the rendered page`);
