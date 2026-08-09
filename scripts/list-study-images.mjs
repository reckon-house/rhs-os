/* Every study's own referenced images, in source order, plus whether it
   already declares a palette. Sourcing frames from the DATA rather than
   from a folder named after the slug matters: several studies keep
   their images elsewhere (fairview-suite lives in fairview-bedroom). */
import { studyFiles, loadStudy } from "./lib/walk-studies.mjs";

const out = {};
for (const file of studyFiles()) {
  const cs = await loadStudy(file);
  const imgs = [];
  const seen = new Set();
  const walk = (n) => {
    if (!n || typeof n !== "object") return;
    for (const v of Object.values(n)) {
      if (typeof v === "string" && /^\/case-studies\/.*\.(jpg|jpeg|png|webp)$/i.test(v)) {
        if (!seen.has(v)) { seen.add(v); imgs.push(v); }
      } else if (v && typeof v === "object") walk(v);
    }
  };
  walk(cs.sections);
  const pal = cs.sections.find(
    (s) => s.type === "marks-materials" || s.type === "brand-system"
  );
  out[cs.slug] = {
    style: cs.style || "classic",
    hasPalette: !!(pal?.colors?.length),
    images: imgs,
  };
}
process.stdout.write(JSON.stringify(out));
