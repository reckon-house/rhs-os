import { loadStudy } from "./lib/walk-studies.mjs";
const cs = await loadStudy(process.argv[2]);
console.log("slug:", cs.slug, "| style:", cs.style || "classic");
console.log("title:", cs.title, "|", cs.subtitle);
cs.sections.forEach((s, i) =>
  console.log("  " + String(i).padStart(2), s.type.padEnd(20), (s.title || s.label || "").slice(0, 46))
);
