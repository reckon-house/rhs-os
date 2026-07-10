#!/usr/bin/env node
// Export the SizzleReel loop as a seamless animated GIF (+ MP4).
//
// Captures /sizzle/capture from a running dev server using the installed
// Google Chrome via playwright-core, stepping CDP VIRTUAL TIME so every
// frame lands on an exact tick — no wall-clock jitter, and the last frame
// butts perfectly against the first for a seamless loop.
//
// Usage:
//   node scripts/export-sizzle-gif.mjs [--port 59201] [--width 720] [--fps 20]
//
// Output: exports/ivy-park-sizzle.gif / .mp4 / -small.gif

import { chromium } from "playwright-core";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const arg = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : dflt;
};

const PORT = arg("port", "59201");
const WIDTH = parseInt(arg("width", "720"), 10);
const HEIGHT = Math.round((WIDTH * 9) / 16);
const FPS = parseInt(arg("fps", "20"), 10);
const FRAME_MS = 1000 / FPS;
const URL = `http://localhost:${PORT}/sizzle/capture`;

const OUT_DIR = "exports";
const TMP = join(OUT_DIR, ".frames");
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

const log = (m) => process.stdout.write(`${m}\n`);

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  const cdp = await page.context().newCDPSession(page);

  log(`→ ${URL} @ ${WIDTH}x${HEIGHT}`);
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForFunction("window.__ready === true", null, { timeout: 30000 });

  // Freeze the clock, then advance it in exact slices.
  const advance = (ms) =>
    new Promise((resolve) => {
      cdp.once("Emulation.virtualTimeBudgetExpired", resolve);
      cdp.send("Emulation.setVirtualTimePolicy", { policy: "advance", budget: ms });
    });
  await cdp.send("Emulation.setVirtualTimePolicy", { policy: "pause" });

  const loopMs = await page.evaluate("window.__loopMs");
  const frames = Math.round(loopMs / FRAME_MS);
  log(`loop ${loopMs}ms → ${frames} frames @ ${FPS}fps`);

  // Walk to a fresh beat-0 boundary so the GIF starts on the shutter.
  const seen = await page.evaluate("window.__beatCount");
  let guard = 0;
  for (;;) {
    const [beat, count] = await page.evaluate("[window.__beat, window.__beatCount]");
    if (beat === 0 && count > seen) break;
    if (++guard > 2000) throw new Error("never reached beat 0 — is the reel running?");
    await advance(25);
  }
  log("aligned to beat 0 — capturing");

  for (let f = 0; f < frames; f++) {
    await page.screenshot({
      path: join(TMP, `f${String(f).padStart(4, "0")}.png`),
      animations: "allow",
      caret: "hide",
    });
    await advance(FRAME_MS);
    if (f % 25 === 0) log(`  frame ${f}/${frames}`);
  }
  log(`captured ${frames} frames`);
} finally {
  await browser.close();
}

// ── Assemble ──
const seq = join(TMP, "f%04d.png");
const gif = join(OUT_DIR, "ivy-park-sizzle.gif");
const gifSmall = join(OUT_DIR, "ivy-park-sizzle-small.gif");
const mp4 = join(OUT_DIR, "ivy-park-sizzle.mp4");
const palette = join(TMP, "palette.png");

const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

log("encoding GIF (2-pass palette)…");
ff(["-framerate", String(FPS), "-i", seq, "-vf", "palettegen=stats_mode=diff", palette]);
ff(["-framerate", String(FPS), "-i", seq, "-i", palette, "-lavfi",
  "paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle", "-loop", "0", gif]);

log("encoding small GIF (480px)…");
ff(["-framerate", String(FPS), "-i", seq, "-i", palette, "-lavfi",
  "scale=480:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle",
  "-loop", "0", gifSmall]);

log("encoding MP4…");
// libx264 + yuv420p requires even dimensions (720x405 would fail) — snap down.
ff(["-framerate", String(FPS), "-i", seq, "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-movflags", "+faststart", mp4]);

rmSync(TMP, { recursive: true, force: true });

for (const f of [gif, gifSmall, mp4]) {
  if (existsSync(f)) {
    const mb = (statSync(f).size / 1048576).toFixed(2);
    log(`✓ ${f}  ${mb} MB`);
  }
}
