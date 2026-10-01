#!/usr/bin/env node
/* ── films for the A.R.C. hero sizzle (30 Sept 2026) ───────────────────
   Three of the reel's phones play the real A.R.C. client: the offline
   static demo in arc-portfolio-demo (the shipped client with the Sample
   Home bundled and its fetch answered from a snapshot), driven headless
   and filmed. The other phones play his own simulator recordings, which
   arc-sizzle-img.mjs cuts; these are the screens they don't reach:

   - scan: Photo Archive, "archive a room" in the Living Room, a photo
     taken, the analysing card, and the five items back for review. The
     five, their categories and values are the production model's own
     output for this photograph (the demo's arc-demo-scan.js, recorded
     from /api/demo-analyze). The server's progress is played as the
     route reports it: 10% on the file, 80% once it is read, then the
     items at the ~2.4s the real endpoint took;
   - cover: the dashboard's Insights, the Personal Items Coverage card
     and Coverage Check under it;
   - docs: Documents, the Document AI upload. Its Library is never
     opened: the demo account's one document is a screenshot of a
     verification code.

   Headless screencasts only come at 1x, so each film is shot a frame at
   a time on a clock of its own: the page's timers and frames run on
   Playwright's fake clock, every CSS animation and transition is held
   and set to it, and each 30fps frame is a 2x screenshot. The iPhone
   app sits under a 62pt safe area and shows no web footer; the web
   build starts at the top and has one, so the footer is hidden and the
   simulator's own status bar (cut from his journey recording) is laid
   on top. Then a capture reads as one more recording.

   The Sample Home names a real insurer; the coverage card reads
   "homeowners" in its place (left blank, the card adds its "add your
   insurance information" prompt under the gap).

       (cd "/Volumes/ReckonHouse/A.R.C./arc-portfolio-demo" &&
        python3 static-demo/serve-locally.py 8091 static-demo)
       node scripts/lib/arc-sizzle-capture.mjs [scan|cover|docs]

   Masters go to $ARC_SZL_CAP (default: the system's temp folder), where
   arc-sizzle-img.mjs reads them. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const req = createRequire(import.meta.url);
const sharp = req(path.join(ROOT, "node_modules/sharp"));
const { chromium } = req(path.join(ROOT, "node_modules/playwright-core"));

const ARC = "/Volumes/ReckonHouse/A.R.C.";
const DEMO = process.env.ARC_DEMO || "http://127.0.0.1:8091";
const CAP = process.env.ARC_SZL_CAP || path.join(os.tmpdir(), "arc-sizzle-cap");
const JOURNEY = path.join(ARC, "arc-portfolio-demo/public/arc/video/arc-full-journey.mp4");
/* the photograph the recorded run read (the demo's img/scan/livingroom.jpg
   is this, at 320) */
const LIVING = path.join(ARC, "images/drop down menu thumbnails/mid journey/reckonhousestaples_living_room_full_fireplace_Austin_stone_wa_2c042ad4-7fc5-49ca-a933-c3efdade3183_2.png");
const SAFE = 62, VW = 440, VH = 956 - SAFE, DPR = 2, FPS = 30;

const ITEMS = [
  { name: "Leather Sofa", category: "Furniture", estimatedValue: 3500, confidence: 0.98 },
  { name: "Armchairs (Pair)", category: "Furniture", estimatedValue: 1800, confidence: 0.95 },
  { name: "Coffee Table", category: "Furniture", estimatedValue: 900, confidence: 0.92 },
  { name: "Area Rug", category: "Textiles", estimatedValue: 700, confidence: 0.9 },
  { name: "Abstract Wall Art", category: "Decor", estimatedValue: 400, confidence: 0.88 },
].map((x) => ({ ...x, suggestedRoom: "Living Room", imageUrl: "/__szl/livingroom-640.jpg" }));

const film = async (which) => {
  const OUT = path.join(CAP, which);
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  const SHOTS = path.join(CAP, "_src"); fs.mkdirSync(SHOTS, { recursive: true });
  if (!fs.existsSync(path.join(SHOTS, "livingroom-1024.jpg"))) {
    await sharp(LIVING).jpeg({ quality: 88 }).toFile(path.join(SHOTS, "livingroom-1024.jpg"));
    await sharp(LIVING).resize(640).jpeg({ quality: 86 }).toFile(path.join(SHOTS, "livingroom-640.jpg"));
  }
  const barPng = path.join(SHOTS, "statusbar.png");
  if (!fs.existsSync(barPng)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", "3.0", "-i", JOURNEY, "-frames:v", "1", "-vf", "crop=1320:186:0:0", barPng]);
  const bar = await sharp(barPng).resize(VW * DPR, SAFE * DPR).png().toBuffer();

  const b = await chromium.launch();
  try {
    const ctx = await b.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: DPR, isMobile: true, hasTouch: true });
    await ctx.route("**/arc-demo-runtime.js", async (route) => { const r = await route.fetch(); const t = (await r.text()).replace('"insuranceCompany":"State Farm"', '"insuranceCompany":"homeowners"'); await route.fulfill({ response: r, body: t }); });
    await ctx.route("**/__szl/**", (route) => route.fulfill({ path: path.join(SHOTS, route.request().url().split("/__szl/")[1]), contentType: "image/jpeg" }));
    await ctx.addInitScript(() => {
      const s = document.createElement("style");
      s.textContent = ".arcscan-btn{display:none!important}footer{display:none!important}"
        + ".szl-tap{position:fixed;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;background:rgba(0,0,0,.22);pointer-events:none;z-index:2147483647;animation:szltap .7s cubic-bezier(.16,1,.3,1) both}"
        + "@keyframes szltap{0%{transform:scale(.25);opacity:1}100%{transform:scale(1.8);opacity:0}}"
        + "html{scrollbar-width:none}::-webkit-scrollbar{display:none}";
      document.addEventListener("DOMContentLoaded", () => document.head.appendChild(s));
      /* every CSS animation and transition held, then set to the clock */
      window.__szlSweep = () => { const now = performance.now(); for (const a of document.getAnimations()) { if (a.__s == null) { a.__s = now; try { a.pause(); } catch (e) { /* gone */ } } try { a.currentTime = now - a.__s; } catch (e) { /* gone */ } } };
      /* a scroll with a finger's ease, on the page's own frames */
      window.__szlGlide = (to, ms) => { const a = scrollY, d = to - a, t0 = performance.now(); const e = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2); const f = () => { const k = Math.min(1, (performance.now() - t0) / ms); scrollTo(0, a + d * e(k)); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
      window.__szlTap = (sel) => { const n = document.querySelector(sel), r = n.getBoundingClientRect(), t = document.createElement("i"); t.className = "szl-tap"; t.style.left = r.left + r.width / 2 + "px"; t.style.top = r.top + r.height / 2 + "px"; document.body.appendChild(t); setTimeout(() => t.remove(), 900); };
    });
    await ctx.clock.install();
    const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message));
    const W = (ms) => p.waitForTimeout(ms);
    let script = [], dur = 0;

    if (which === "scan") {
      await p.goto(DEMO + "/archive", { waitUntil: "networkidle" }); await W(1500);
      await p.evaluate((items) => {
        const prev = window.fetch; let t0 = 0;
        const json = (o) => new Response(JSON.stringify(o), { status: 200, headers: { "Content-Type": "application/json" } });
        window.fetch = async (u, o) => {
          const s = String(u);
          if (s.includes("/api/batch-analyze/progress/")) { const e = performance.now() - t0; await new Promise((r) => setTimeout(r, 40)); return json(e > 2350 ? { progress: 100, items } : { progress: e > 900 ? 80 : 10 }); }
          if (s.includes("/api/batch-analyze")) { t0 = performance.now(); await new Promise((r) => setTimeout(r, 120)); return json({ progressKey: "szl" }); }
          return prev(u, o);
        };
      }, ITEMS);
      await p.getByRole("button", { name: "Master Bathroom" }).click(); await W(300);
      await p.evaluate(() => { const n = [...document.querySelectorAll("button,[role=option],li,div")].filter((x) => /^Living Room\s*Select this room$/.test((x.textContent || "").trim())); n[n.length - 1].click(); });
      await W(600);
      await p.evaluate(() => {
        const h = [...document.querySelectorAll("h1,h2,h3,div")].find((n) => /^archive\s*a room$/i.test((n.textContent || "").trim()));
        scrollTo(0, h.getBoundingClientRect().top + scrollY - 92);
        [...document.querySelectorAll("button")].find((x) => /Take Photo/.test(x.textContent)).setAttribute("data-szl", "take");
      });
      await W(600);
      script = [
        [900, () => p.evaluate(() => window.__szlTap('[data-szl="take"]'))],
        [1150, () => p.locator('input[type=file][accept="image/*"]').first().setInputFiles(path.join(SHOTS, "livingroom-1024.jpg"))],
        [5200, () => p.evaluate(() => { const s = [...document.querySelectorAll("button")].find((x) => /Save 5 Items/.test(x.textContent)); window.__szlGlide(s.getBoundingClientRect().bottom + scrollY - innerHeight + 36, 2600); })],
      ];
      dur = 8900;
    } else if (which === "cover") {
      await p.goto(DEMO + "/dashboard", { waitUntil: "networkidle" }); await W(1800);
      await p.keyboard.press("Escape"); await W(500);
      /* the dashboard's own start-up timers fire before the film does */
      await ctx.clock.runFor(9000); await W(1500);
      const y = await p.evaluate(() => { const h = [...document.querySelectorAll("div,h3")].filter((n) => /^Personal Items Coverage/.test((n.textContent || "").trim()) && n.getBoundingClientRect().height < 200); const x = h[h.length - 1]; return x ? x.getBoundingClientRect().top + scrollY : -1; });
      if (y < 0) throw new Error("no coverage card");
      await p.evaluate((y) => scrollTo(0, y - 560), y); await W(800);
      script = [
        [400, () => p.evaluate((y) => window.__szlGlide(y - 150, 1800), y)],
        [3700, () => p.evaluate(() => window.__szlGlide(scrollY + 400, 1500))],
      ];
      dur = 6400;
    } else if (which === "docs") {
      await p.goto(DEMO + "/documents", { waitUntil: "networkidle" }); await W(1800);
      await p.keyboard.press("Escape"); await W(300);
      await ctx.clock.runFor(9000); await W(1500);
      await p.evaluate(() => scrollTo(0, 0)); await W(500);
      dur = 6200;
    } else throw new Error("which film? scan, cover or docs");

    /* the clock stops here; from now on time is the film's */
    const now = await p.evaluate(() => Date.now());
    await ctx.clock.pauseAt(now + 20);
    await p.evaluate(() => window.__szlSweep());
    const N = Math.round((dur / 1000) * FPS);
    let si = 0, prevT = 0;
    for (let i = 0; i < N; i++) {
      const t = Math.round((i * 1000) / FPS);
      while (si < script.length && script[si][0] <= t) { await script[si][1](); si++; await W(30); }
      if (t > prevT) { await ctx.clock.runFor(t - prevT); prevT = t; }
      await W(8);
      await p.evaluate(() => window.__szlSweep());
      const shot = await p.screenshot({ type: "png", caret: "hide" });
      const fr = await sharp({ create: { width: VW * DPR, height: (VH + SAFE) * DPR, channels: 3, background: "#fff" } })
        .composite([{ input: bar, left: 0, top: 0 }, { input: shot, left: 0, top: SAFE * DPR }]).png().toBuffer();
      fs.writeFileSync(path.join(OUT, "f" + String(i).padStart(4, "0") + ".png"), fr);
    }
    const bad = errs.filter((e) => !/Stripe/.test(e));
    if (bad.length) console.warn(which, "page errors:", bad.slice(0, 3).join(" | "));
    const master = path.join(CAP, which + "-master.mp4");
    execFileSync("ffmpeg", ["-v", "error", "-y", "-framerate", String(FPS), "-i", path.join(OUT, "f%04d.png"), "-c:v", "libx264", "-preset", "slow", "-crf", "12", "-pix_fmt", "yuv420p", master]);
    fs.rmSync(OUT, { recursive: true, force: true });
    console.log(which, "→", master, (N / FPS).toFixed(2) + "s");
  } finally { await b.close(); }
};

for (const w of process.argv[2] ? [process.argv[2]] : ["scan", "cover", "docs"]) await film(w);
