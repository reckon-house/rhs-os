import { loadStudy } from "./lib/walk-studies.mjs";
const cs = await loadStudy(process.argv[2]);
const imgs = new Set();
const walk = (n) => { if (!n || typeof n !== "object") return;
  for (const v of Object.values(n)) {
    if (typeof v === "string" && /\.(jpg|jpeg|png|webp)$/i.test(v)) imgs.add(v);
    else if (v && typeof v === "object") walk(v); } };
walk(cs.sections);
console.log(cs.slug, "->", [...imgs].slice(0,4).join("\n   "));
