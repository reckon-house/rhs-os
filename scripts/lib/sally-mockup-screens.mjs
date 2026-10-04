#!/usr/bin/env node
/* ── screens for his Sally mockups (2 Oct 2026) ──────────────────────────
   His ask: "save some images of the emails and homepages (mobile and
   desktop) so i can drop them in some mockups". Every page in the study's
   pushed look, captured at the sizes mockup templates take:

     homepage-<name>-desktop.jpg        2880 x 1800  a laptop screen (1440 x 900 at 2x)
     homepage-<name>-desktop-long.jpg   2880 x 5400  three screens, for a scrolling mockup
     homepage-<name>-mobile.jpg         1170 x 2532  a phone screen (390 x 844 at 3x)
     homepage-<name>-mobile-long.jpg    1170 x 7596  three screens
     homepage-lookbook-desktop-tall.jpg    2880 x 2160  a taller screen (1440 x 1080 at 2x)
     homepage-lookbook-desktop-taller.jpg  2880 x 2400  taller again (1440 x 1200 at 2x)
     email-<name>-full.jpg              1200 x the email's length (600 wide at 2x)
     email-<name>-phone.jpg             1170 x 2532  the email as a phone shows it

   The four pushed homepages get the long versions too; the other seven
   concepts are his pages in the pushed skin (?skin=pushed). JPG at quality
   95 with full colour detail, so red type stays crisp. Needs the dev
   server (localhost:3000).

       node scripts/lib/sally-mockup-screens.mjs [output folder]
   The folder defaults to ~/Downloads/Sally Beauty Email & HP/mockup-screens. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(import.meta.url);
const sharp = require(path.join(ROOT, "node_modules/sharp"));
const { chromium } = await import(path.join(ROOT, "node_modules/playwright-core/index.mjs"));
const HOST = process.env.SALLY_SZL_HOST || "http://localhost:3000";
const OUT = path.resolve(process.argv[2] || path.join(os.homedir(), "Downloads/Sally Beauty Email & HP/mockup-screens"));
fs.mkdirSync(OUT, { recursive: true });

const PUSH = (p) => "/lab/sally-push/" + p + ".html";
const SKIN = (p) => "/lab/sally-system/" + p + ".html?skin=pushed";
/* [file name, page, long versions too] */
const HOMEPAGES = [
  ["the-edit", PUSH("the-color-issue"), true],
  ["lookbook", PUSH("lookbook-images"), true],
  ["colorfest", PUSH("colorfest"), true],
  ["pride", PUSH("pride"), true],
  ["the-sale", PUSH("promotion"), true],
  ["editorial", SKIN("homepage-editorial"), false],
  ["card-system", SKIN("homepage-cards"), false],
  ["full-card", SKIN("homepage-full"), false],
  ["for-you", SKIN("homepage-foryou"), false],
  ["diy-studio", SKIN("homepage-diy"), false],
  ["color-authority", SKIN("homepage-color"), false],
  ["the-mix", SKIN("homepage-mix"), false],
];
const EMAILS = [
  ["the-gloss", PUSH("the-gloss")],
  ["the-sale", PUSH("the-sale")],
  ["punch-volume", PUSH("punch-volume")],
  ["punch-candy", PUSH("punch-candy")],
  ["punch-soft-pop", PUSH("punch-soft-pop")],
  ["color-blocked-new-arrivals", SKIN("email-color-blocked-new-arrivals")],
  ["color-blocked-rewards", SKIN("email-color-blocked-rewards")],
  ["color-blocked-shoppable", SKIN("email-color-blocked-shoppable")],
  ["editorial-how-to", SKIN("email-editorial-the-how-to-full-article")],
];

const b = await chromium.launch();
const made = [];
/* a phone screen is cut to exactly 1170 x 2532: a page a few pixels short
   (an email at 2531) would otherwise not fill a phone mockup's screen */
const save = async (buf, name, exact) => {
  const file = path.join(OUT, name);
  let img = sharp(buf);
  if (exact) img = img.resize(exact[0], exact[1], { fit: "cover", position: "top" });
  await img.jpeg({ quality: 95, chromaSubsampling: "4:4:4", mozjpeg: true }).toFile(file);
  const m = await sharp(file).metadata();
  made.push([name, m.width, m.height, fs.statSync(file).size]);
  console.log(name.padEnd(46), `${m.width}x${m.height}`);
};
/* load a page, let its lazy pictures and its fonts arrive, back to the top */
const open = async (ctx, url, deep) => {
  const p = await ctx.newPage();
  await p.goto(HOST + url, { waitUntil: "networkidle" });
  await p.evaluate(async (deep) => {
    const el = document.scrollingElement;
    for (let y = 0; y < Math.min(el.scrollHeight, deep); y += 300) { el.scrollTop = y; await new Promise((r) => setTimeout(r, 70)); }
    el.scrollTop = 0;
    await document.fonts.ready;
  }, deep);
  await p.waitForTimeout(900);
  return p;
};

const desk = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const phone = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const mail = await b.newContext({ viewport: { width: 600, height: 900 }, deviceScaleFactor: 2 });

for (const [name, url, long] of HOMEPAGES) {
  let p = await open(desk, url, long ? 3200 : 1200);
  await save(await p.screenshot(), `homepage-${name}-desktop.jpg`);
  if (long) await save(await p.screenshot({ fullPage: true, clip: { x: 0, y: 0, width: 1440, height: 2700 } }), `homepage-${name}-desktop-long.jpg`);
  await p.close();
  p = await open(phone, url, long ? 3000 : 1200);
  await save(await p.screenshot(), `homepage-${name}-mobile.jpg`, [1170, 2532]);
  if (long) await save(await p.screenshot({ fullPage: true, clip: { x: 0, y: 0, width: 390, height: 2532 } }), `homepage-${name}-mobile-long.jpg`);
  await p.close();
}
/* taller desktop screens (3 Oct 2026, his "let's save a image for a
   desktop mockup - can we get it a little taller this time?"): the same
   page at 1440 wide, 1080 and 1200 tall, at 2x */
const TALL = [["lookbook", PUSH("lookbook-images")]];
for (const [name, url] of TALL) {
  for (const [vh, suffix] of [[1080, "tall"], [1200, "taller"]]) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: vh }, deviceScaleFactor: 2 });
    const p = await open(ctx, url, 2400);
    await p.waitForTimeout(900);
    await save(await p.screenshot(), `homepage-${name}-desktop-${suffix}.jpg`);
    await ctx.close();
  }
}
for (const [name, url] of EMAILS) {
  let p = await open(mail, url, 9000);
  await save(await p.screenshot({ fullPage: true }), `email-${name}-full.jpg`);
  await p.close();
  p = await open(phone, url, 1600);
  await save(await p.screenshot(), `email-${name}-phone.jpg`, [1170, 2532]);
  await p.close();
}
await b.close();

const mb = (n) => (n / 1048576).toFixed(1) + " MB";
fs.writeFileSync(path.join(OUT, "README.txt"), [
  "Sally design system: screens for mockups",
  "Made " + new Date().toISOString().slice(0, 10) + " by scripts/lib/sally-mockup-screens.mjs, in the study's pushed look.",
  "",
  "desktop       2880 x 1800  a laptop screen (1440 x 900 at 2x)",
  "desktop-long  2880 x 5400  three screens, for a scrolling mockup",
  "mobile        1170 x 2532  a phone screen (390 x 844 at 3x)",
  "mobile-long   1170 x 7596  three screens",
  "desktop-tall  2880 x 2160  a taller screen (1440 x 1080 at 2x), the Lookbook",
  "desktop-taller 2880 x 2400 taller again (1440 x 1200 at 2x), the Lookbook",
  "email-full    1200 wide, the email's whole length (600 wide at 2x)",
  "email-phone   1170 x 2532  the email as a phone shows it",
  "",
  ...made.map(([n, w, h, s]) => `${n.padEnd(46)} ${String(w).padStart(5)} x ${String(h).padEnd(6)} ${mb(s)}`),
  "",
].join("\n"));
console.log("wrote", made.length, "screens to", OUT);
