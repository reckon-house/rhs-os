#!/usr/bin/env node
/* ── the Sally design system sizzle's films (2 Oct 2026) ────────────────
   His note on the study's engine: "let's just show the OS creating
   assets". The reel shows it the same way: his two Sally Marketing OS
   demos (public/lab/sally-demos), filmed as they play.

     email   requests-email: the August campaign board, COLORfest's CRM
             request, Create Email, the email assembling section by
             section from the portal's own renderer output
     figma   figma-build: the plugin builds the requested emails onto the
             canvas in one press

   Each is filmed at its design size (1120 by 760) at twice its pixels
   through the browser's own screencast, then cut as H.264 with no sound,
   a keyframe every half second, at two widths (1000 and 1600), with a
   poster of its first frame, as the A.R.C. reel's films are.

   Needs the dev server (localhost:3000).

       node scripts/lib/sally-sizzle-capture.mjs */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(import.meta.url);
const sharp = require(path.join(ROOT, "node_modules/sharp"));
const { chromium } = await import(path.join(ROOT, "node_modules/playwright-core/index.mjs"));
const HOST = process.env.SALLY_SZL_HOST || "http://localhost:3000";
const VID = path.join(ROOT, "public/lab/sally-sizzle/vid");
fs.mkdirSync(VID, { recursive: true });
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "sally-szl-"));

/* name: [demo, seconds to film, cut from, cut to, speed] */
const FILMS = {
  email: ["requests-email", 17, 4.4, 14.6, 2],
  figma: ["figma-build", 16, 2.0, 15, 2.6],
};
const RUNGS = [1000, 1600];

const b = await chromium.launch();
const sizes = {};
for (const [name, [demo, secs, from, to, speed]] of Object.entries(FILMS)) {
  const dir = path.join(TMP, name); fs.mkdirSync(dir);
  const p = await b.newPage({ viewport: { width: 1120, height: 760 }, deviceScaleFactor: 2 });
  const cdp = await p.context().newCDPSession(p);
  const frames = [];
  cdp.on("Page.screencastFrame", async (f) => {
    const file = path.join(dir, String(frames.length).padStart(5, "0") + ".jpg");
    fs.writeFileSync(file, Buffer.from(f.data, "base64"));
    frames.push({ file, t: f.metadata.timestamp });
    try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch (e) { /* closed */ }
  });
  await p.goto(HOST + "/lab/sally-demos/" + demo + ".html?framed=1", { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  /* film from a fresh start of the replay */
  await p.reload({ waitUntil: "networkidle" });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 2240, maxHeight: 1520, everyNthFrame: 1 });
  await p.waitForTimeout(secs * 1000);
  await cdp.send("Page.stopScreencast");
  await p.close();
  if (frames.length < 10) { console.warn(name, "only", frames.length, "frames"); continue; }
  /* the frames as a timed list, from the first frame's time */
  const t0 = frames[0].t;
  const list = [];
  frames.forEach((f, i) => {
    const next = frames[i + 1] ? frames[i + 1].t : f.t + 0.5;
    list.push(`file '${f.file}'`, `duration ${Math.max(0.001, next - f.t).toFixed(4)}`);
  });
  list.push(`file '${frames[frames.length - 1].file}'`);
  const listFile = path.join(dir, "list.txt"); fs.writeFileSync(listFile, list.join("\n"));
  const master = path.join(dir, "master.mp4");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", listFile, "-vf", "fps=60,format=yuv420p", "-c:v", "libx264", "-crf", "12", "-preset", "fast", master]);
  const span = frames[frames.length - 1].t - t0;
  for (const w of RUNGS) {
    const out = path.join(VID, `${name}@${w}.mp4`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(from), "-t", String(to - from), "-i", master,
      "-vf", `setpts=PTS/${speed},scale=${w}:-2:flags=lanczos,fps=30`, "-an",
      "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-tune", "animation",
      "-g", "15", "-keyint_min", "15", "-sc_threshold", "0", "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", out]);
    const png = path.join(dir, `poster-${w}.png`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", out, "-frames:v", "1", png]);
    await sharp(png).webp({ quality: 82 }).toFile(path.join(VID, `${name}@${w}.webp`));
    console.log(`${name}@${w}`, (fs.statSync(out).size / 1024).toFixed(0) + " KB");
  }
  const d = +((to - from) / speed).toFixed(3);
  sizes[name] = { d, w: 2240, h: 1520 };
  console.log(name, frames.length, "frames over", span.toFixed(1), "s; clip", d, "s");
}
await b.close();
fs.writeFileSync(path.join(VID, "sizes.json"), JSON.stringify(sizes, null, 1) + "\n");
fs.rmSync(TMP, { recursive: true, force: true });
console.log("wrote", path.relative(ROOT, VID));
