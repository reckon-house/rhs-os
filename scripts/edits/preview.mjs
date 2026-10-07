/* ── PREVIEW A STUDY'S EDIT IN ITS ROOM (6 Oct 2026) ─────────────────────
   node scripts/edits/preview.mjs <study-key> [out-dir]
   Needs the dev server on localhost:3000. Serves every scripts/edits/*.json
   as edits.js (nothing is written to the repo), opens ?edit=index on the
   study and prints what a reader meets, in order: the opening paragraph
   (subtitle and chapter lines), the kicker and abstract, each chapter's
   row opened, and every section's label, title, line, pull quote and
   captions, then the closing. Screenshots of the top and of each section
   go to out-dir (default: the system temp folder). */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const { chromium } = await import(path.join(ROOT, "node_modules/playwright-core/index.mjs"));
const k = process.argv[2];
if (!k) { console.error("usage: node scripts/edits/preview.mjs <study-key> [out-dir]"); process.exit(2); }
const OUT = process.argv[3] || path.join(os.tmpdir(), "rhs-edit-preview", k);
fs.mkdirSync(OUT, { recursive: true });
const all = {};
for (const f of fs.readdirSync(HERE).filter((x) => x.endsWith(".json") && !x.startsWith("."))) {
  const E = JSON.parse(fs.readFileSync(path.join(HERE, f), "utf8")); if (E.variants && E.variants.index) all[E.k || f.replace(/\.json$/, "")] = E.variants;
}
if (!all[k]) { console.error("no scripts/edits/" + k + ".json with an index variant"); process.exit(2); }
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })).newPage();
const errs = []; p.on("pageerror", (e) => errs.push(e.message));
await p.route("**/lab/density/edits.js*", (r) => r.fulfill({ status: 200, contentType: "application/javascript", body: "window.DENSITY_EDITS = " + JSON.stringify(all) + ";" }));
await p.goto("http://localhost:3000/?edit=index#study/" + k, { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const txt = (e) => (e ? e.innerText.replace(/\s+/g, " ").trim() : "");
const top = await p.evaluate(() => {
  const t = (e) => (e ? e.innerText.replace(/\s+/g, " ").trim() : "");
  const flow = document.querySelector(".sp-flowp");
  const lead = flow && flow.querySelector(".sp-flow-lead");
  const lines = [...document.querySelectorAll("nav.sp-chap .sp-chap-r")].map((r) => t(r));
  return { title: t(document.querySelector(".sp-title")), subtitle: lead ? t(lead) : t(document.querySelector(".sp-head > .sp-stand")), lines,
    kicker: t(document.querySelector(".sp-meta")), abstract: t(document.querySelector(".sp-open .sp-text")) };
});
const rows = [];
const n = await p.locator("nav.sp-chap .sp-chap-r").count();
for (let i = 0; i < n; i++) {
  await p.locator("nav.sp-chap .sp-chap-r").nth(i).click(); await p.waitForTimeout(450);
  rows.push(await p.evaluate(() => { const o = document.querySelector("nav.sp-chap .sp-chap-i.on .sp-chap-pb"); return o ? o.innerText.replace(/\n+/g, " / ").replace(/\s+/g, " ").trim() : ""; }));
}
if (n) { await p.locator("nav.sp-chap .sp-chap-r").nth(n - 1).click(); await p.waitForTimeout(450); }
const box = await p.evaluate(() => { const r = document.querySelector("article.sp").parentElement.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
await p.evaluate(() => { const h = document.querySelector(".sp-head"); const sc = document.querySelector("article.sp").parentElement; sc.scrollTop = h.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 20; });
await p.waitForTimeout(600); await p.screenshot({ path: path.join(OUT, "00-top.png"), clip: box });
const secs = await p.evaluate(() => [...document.querySelectorAll(".sp-sec")].map((s) => {
  const t = (e) => (e ? e.innerText.replace(/\s+/g, " ").trim() : "");
  return { label: t(s.querySelector(".sp-kick")), title: t(s.querySelector(".sp-h")), lines: [...s.querySelectorAll(".sp-deck, .sp-p")].map(t).filter(Boolean),
    pull: t(s.querySelector(".sp-pq")), captions: [...s.querySelectorAll(".sp-cap, .sp-live-cap")].map(t).filter(Boolean), closing: t(s.querySelector(".sp-closing")) };
}));
for (let i = 0; i < secs.length; i++) {
  await p.evaluate((i) => { const s = document.querySelectorAll(".sp-sec")[i]; const sc = document.querySelector("article.sp").parentElement; sc.scrollTop = s.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 60; }, i);
  await p.waitForTimeout(500); await p.screenshot({ path: path.join(OUT, String(i + 1).padStart(2, "0") + "-section.png"), clip: box });
}
const facts = await p.evaluate(() => [...document.querySelectorAll(".sp-tr")].map((r) => r.innerText.replace(/\s+/g, " ").trim()));
const L = [];
L.push("TITLE: " + top.title, "", "OPENING PARAGRAPH", "  subtitle: " + top.subtitle);
top.lines.forEach((l, i) => L.push("  " + String(i + 1).padStart(2, "0") + " " + l + "\n     opens to: " + (rows[i] || "(nothing)")));
L.push("", "KICKER: " + top.kicker, "ABSTRACT: " + (top.abstract || "(none)"), "");
secs.forEach((s, i) => {
  L.push("SECTION " + (i + 1) + " [" + s.label + "]", "  title: " + s.title);
  s.lines.forEach((x) => L.push("  line: " + x));
  if (s.pull) L.push("  pull quote: " + s.pull);
  s.captions.forEach((x) => L.push("  caption: " + x));
  if (s.closing) L.push("  closing: " + s.closing);
});
L.push("", "FACTS: " + facts.join(" | "), "", "screenshots: " + OUT, errs.length ? "PAGE ERRORS: " + errs.join(" | ") : "no page errors");
console.log(L.join("\n"));
await b.close();
