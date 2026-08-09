import { loadStudy } from "./lib/walk-studies.mjs";
const cs = await loadStudy(process.argv[2]);
const mm = cs.sections.find((s) => s.type === "marks-materials" || s.type === "brand-system");
console.log("palette:", mm ? JSON.stringify(mm.colors?.map((c) => c.hex)) : "NONE");
const imgs = new Set();
const walk = (n) => { if (!n || typeof n !== "object") return;
  for (const [k, v] of Object.entries(n)) {
    if (typeof v === "string" && /^\/case-studies\/.*\.(jpg|jpeg|png|webp)$/i.test(v)) imgs.add(v);
    else if (v && typeof v === "object") walk(v); } };
walk(cs.sections);
console.log("images:", imgs.size);
[...imgs].forEach((i) => console.log("  " + i));
