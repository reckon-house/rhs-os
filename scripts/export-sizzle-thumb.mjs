#!/usr/bin/env node
// One-frame square capture of the SizzleReel for the homepage/OG thumbnail:
// walks the virtual clock to the wordBuild beat, lets the full line land,
// and rasterizes an 800x800 frame via CDP.
//
// Usage: node scripts/export-sizzle-thumb.mjs [--port 3000] [--size 800]
//        [--beat wordBuild] [--into 700] [--outfile public/images/thumbnails/sizzle.jpg]

import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

const arg = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : dflt;
};

const PORT = arg("port", "3000");
const SIZE = parseInt(arg("size", "800"), 10);
const BEAT_FX = arg("beat", "wordBuild");
const INTO_MS = parseInt(arg("into", "700"), 10); // how far into the beat
const OUTFILE = arg("outfile", "public/images/thumbnails/sizzle.jpg");

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: SIZE, height: SIZE },
    deviceScaleFactor: 1,
  });
  const cdp = await page.context().newCDPSession(page);
  await page.goto(`http://localhost:${PORT}/sizzle/capture`, { waitUntil: "networkidle" });
  await page.waitForFunction("window.__ready === true", null, { timeout: 30000 });

  const advance = (ms) =>
    new Promise((resolve) => {
      cdp.once("Emulation.virtualTimeBudgetExpired", resolve);
      cdp.send("Emulation.setVirtualTimePolicy", { policy: "advance", budget: ms });
    });
  await cdp.send("Emulation.setVirtualTimePolicy", { policy: "pause" });

  // The capture page reports beat index; find the target fx's index from the
  // sequence the page derived (word cards carry text, so match by fx name via
  // a probe the page exposes through __beat + the known default order).
  // Simplest reliable walk: advance until the CURRENT beat's fx matches, read
  // via a tiny DOM probe (the word line exists only on word-family beats).
  let guard = 0;
  for (;;) {
    const state = await page.evaluate((fx) => {
      const stage = document.querySelector(".sz-stage");
      const layer = stage && stage.querySelector(":scope > .sz-layer");
      const builds = layer ? layer.querySelectorAll(".sz-w").length : 0;
      const outs = layer ? layer.querySelectorAll(".sz-wout").length : 0;
      // Transition beats carry a class sz-<fx> on the top layer.
      const hasFx = !!(layer && layer.classList.contains(`sz-${fx}`));
      return { beat: window.__beat, builds, outs, hasFx };
    }, BEAT_FX);
    if (BEAT_FX === "wordBuild" && state.builds > 0) break;
    if (BEAT_FX === "wordOut" && state.outs > 0) break;
    if (BEAT_FX !== "wordBuild" && BEAT_FX !== "wordOut" && state.hasFx) break;
    if (++guard > 4000) throw new Error(`never reached ${BEAT_FX}`);
    await advance(25);
  }
  // Fully deterministic animation driving: headless Chrome schedules no
  // rendering frames under a frozen clock, so new CSS animations never even
  // resolve a start time. Instead of racing that machinery, every animation
  // is paused and its currentTime is SET each frame: first sighting tags the
  // animation with its birth tick, after that elapsed = now - born. Slats,
  // words, wipes, everything samples at exactly the requested instant.
  const driveAnims = (nowMs) =>
    page.evaluate((t) => {
      document.getAnimations().forEach((a) => {
        if (a.__born == null) a.__born = t;
        try {
          a.pause();
          a.currentTime = Math.max(0, t - a.__born);
        } catch {}
      });
    }, nowMs);
  await driveAnims(0);
  await advance(INTO_MS); // let the words land and settle
  await driveAnims(INTO_MS);

  // Composite the frame explicitly (frozen clocks produce no frames on
  // their own), then read the screenshot from that exact frame.
  // Dirty one pixel so pending damage forces a fresh composite on capture.
  await page.evaluate(() => {
    const d = document.createElement("div");
    d.style.cssText = "position:fixed;left:0;top:0;width:2px;height:2px;opacity:0.01;background:#000;z-index:2147483647";
    document.body.appendChild(d);
  });
  const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 90 });
  writeFileSync(OUTFILE, Buffer.from(data, "base64"));
  console.log(`✓ ${OUTFILE} (${SIZE}x${SIZE}, ${BEAT_FX} +${INTO_MS}ms)`);
} finally {
  await browser.close();
}
