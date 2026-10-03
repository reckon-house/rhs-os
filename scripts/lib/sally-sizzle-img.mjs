#!/usr/bin/env node
/* ── the Sally design system hero sizzle's pictures (2 Oct 2026) ────────
   public/lab/sally-sizzle/ plays the study's own pages, so this makes the
   pictures it cuts between, each at a few widths so a frame of any size
   shows a picture at no more than half its pixels (the room's rule):

   - the homepage stills, from the study's own captures
     (public/case-studies/sally-design-system/, 2880 wide);
   - the looks, from his concept assets (public/lab/sally-system/assets);
   - two page strips that scroll inside the reel, captured here from the
     pushed pages: the Lookbook's top three screens, and the top of three
     emails (The Gloss, the sale, Punch Candy).

   The page strips need the dev server (localhost:3000).

       node scripts/lib/sally-sizzle-img.mjs */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(import.meta.url);
const sharp = require(path.join(ROOT, "node_modules/sharp"));
const { chromium } = await import(path.join(ROOT, "node_modules/playwright-core/index.mjs"));
const OUT = path.join(ROOT, "public/lab/sally-sizzle/img");
fs.mkdirSync(OUT, { recursive: true });
const STILL = path.join(ROOT, "public/case-studies/sally-design-system/sally-design-system-");
const LOOK = path.join(ROOT, "public/lab/sally-system/assets/img/");
const HOST = process.env.SALLY_SZL_HOST || "http://localhost:3000";

const sizes = {};
const rungs = async (name, input, widths, crop) => {
  let src = sharp(input);
  if (crop) src = src.extract(crop);
  const buf = await src.toBuffer();
  const m = await sharp(buf).metadata();
  const made = [];
  for (const w of widths) {
    if (w > m.width) continue;
    await sharp(buf).resize({ width: w }).webp({ quality: 80 }).toFile(path.join(OUT, `${name}@${w}.webp`));
    made.push(w);
  }
  if (!made.length || made[made.length - 1] < m.width && m.width - made[made.length - 1] > 200) {
    await sharp(buf).webp({ quality: 80 }).toFile(path.join(OUT, `${name}@${m.width}.webp`));
    made.push(m.width);
  }
  sizes[name] = { w: m.width, h: m.height, rungs: made };
  console.log(name.padEnd(12), `${m.width}x${m.height}`, made.join(","));
};

/* the homepage stills, 2880 x 1800 */
await rungs("cover", STILL + "homepage-concept-10-the-edit-desktop.jpg", [900, 1600, 2400]);
await rungs("lookbook", STILL + "homepage-concept-11-lookbook-desktop.jpg", [900, 1600, 2400]);
await rungs("colorfest", STILL + "homepage-concept-4-colorfest-story-desktop.jpg", [900, 1600, 2400]);
await rungs("pride", STILL + "homepage-concept-6-pride-takeover-desktop.jpg", [900, 1600, 2400]);
await rungs("diy", STILL + "homepage-concept-7-diy-studio-desktop.jpg", [900, 1600, 2400]);
await rungs("authority", STILL + "homepage-concept-8-color-authority-desktop.jpg", [900, 1600, 2400]);

/* the looks, his photographs */
for (const [name, file] of [["blonde", "blonde-port.jpg"], ["violet", "purple-nails-port.jpg"], ["cherry", "cherry-nails-port.jpg"], ["teal", "teal-nails-port.jpg"], ["blue", "vivids-port.jpg"], ["copper", "copper-port.jpg"], ["vanity", "wm1.jpeg"], ["waves", "chiwaver-land.jpg"]]) {
  await rungs(name, LOOK + file, [500, 1000]);
}

/* the page strips, captured from the pushed pages at twice their size */
const b = await chromium.launch();
const strip = async (name, page, w, cssH, widths) => {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
  await p.goto(HOST + page, { waitUntil: "networkidle" });
  await p.evaluate(async () => { for (let y = 0; y < 4000; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(700);
  const buf = await p.screenshot({ fullPage: true, clip: { x: 0, y: 0, width: w, height: cssH } });
  await p.close();
  await rungs(name, buf, widths);
};
await strip("lb-strip", "/lab/sally-push/lookbook-images.html", 1440, 2700, [1440, 2400]);
await strip("gloss-strip", "/lab/sally-push/the-gloss.html", 600, 1800, [600, 1200]);
await strip("sale-strip", "/lab/sally-push/the-sale.html", 600, 1800, [600, 1200]);
await strip("candy-strip", "/lab/sally-push/punch-candy.html", 600, 1800, [600, 1200]);
await b.close();

fs.writeFileSync(path.join(OUT, "sizes.json"), JSON.stringify(sizes, null, 1));
console.log("wrote", Object.keys(sizes).length, "pictures to", OUT);
