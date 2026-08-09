import { loadStudy } from "./lib/walk-studies.mjs";
const cs = await loadStudy(process.argv[2]);
cs.sections.slice(0, 8).forEach((s, i) => {
  const p = s.pressing || {};
  const ch = p.choreo ? JSON.stringify(p.choreo) : "";
  console.log(`  ${i} ${s.type.padEnd(17)} ${ch.padEnd(28)} ${p.mark ? p.mark.n+" "+p.mark.name : ""}`);
});
