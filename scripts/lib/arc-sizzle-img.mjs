#!/usr/bin/env node
/* ── the A.R.C. hero sizzle's films and pictures (30 Sept 2026) ────────
   public/lab/arc-sizzle/ plays the real app in its phones, so this cuts
   the clips it plays, each from where the app shows one thing:

   - his own simulator recordings (arc-portfolio-demo/public/arc/video,
     the shipped iOS build 1.0.1 on the Sample Home: 8 rooms, 73 items,
     $49,630): the whole-home dashboard scrolling its rooms, an item's
     claim fields, the reports;
   - films of the real client that those don't reach, shot by
     arc-sizzle-capture.mjs: the photo scan, the coverage card, Documents.

   Each clip is cut at two widths, 880 and 540 (the phone's screen is
   drawn about 300 CSS pixels wide in a room and 200 on a phone, so each
   keeps it at half its pixels), as H.264 with no sound, a keyframe every
   half second so the review bench can seek to any frame, and faststart;
   with a poster of its first frame, so a cut lands on the right picture
   before the film has loaded. And one photograph, cropped tall for the
   reel's portrait frame (the room's A.R.C. cover is portrait).

       node scripts/lib/arc-sizzle-capture.mjs   (the films, once)
       node scripts/lib/arc-sizzle-img.mjs        */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sharp = createRequire(import.meta.url)(path.join(ROOT, "node_modules/sharp"));
const REC = "/Volumes/ReckonHouse/A.R.C./arc-portfolio-demo/public/arc/video";
const CAP = process.env.ARC_SZL_CAP || path.join(os.tmpdir(), "arc-sizzle-cap");
const OUT = path.join(ROOT, "public/lab/arc-sizzle");
const VID = path.join(OUT, "vid"), IMG = path.join(OUT, "img");
fs.mkdirSync(VID, { recursive: true }); fs.mkdirSync(IMG, { recursive: true });

/* name: [source, from, to] in seconds */
const CLIPS = {
  /* Photo Archive: the Living Room, a photo, the analysing card, five
     items back to review, down to Save */
  scan: [path.join(CAP, "scan-master.mp4"), 0.5, 8.1],
  /* the whole home, $49,630 over 8 rooms and 73 items, then its rooms
     (past the loop's cross-dissolve at its head) */
  home: [path.join(REC, "arc-home-scroll.mp4"), 0.8, 6.9],
  /* an item, "keep your items complete", down through its fields */
  item: [path.join(REC, "arc-full-journey.mp4"), 16.25, 21.95],
  /* Insights: Personal Items Coverage, then Coverage Check */
  cover: [path.join(CAP, "cover-master.mp4"), 0.2, 6.35],
  /* Documents: the Document AI upload, its tip turning over */
  docs: [path.join(CAP, "docs-master.mp4"), 0, 3.8],
  /* Reports: the project, the configuration, the preview, Generate PDF */
  reports: [path.join(REC, "arc-full-journey.mp4"), 26.85, 31.65],
};
const RUNGS = [880, 540];

const sizes = { clips: {}, pics: {} };
for (const [name, [src, from, to]] of Object.entries(CLIPS)) {
  if (!fs.existsSync(src)) { console.warn("missing", src, "(run arc-sizzle-capture.mjs)"); continue; }
  for (const w of RUNGS) {
    const out = path.join(VID, `${name}@${w}.mp4`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(from), "-i", src, "-t", (to - from).toFixed(3),
      "-vf", `scale=${w}:-2:flags=lanczos,fps=30`, "-an",
      "-c:v", "libx264", "-preset", "slow", "-crf", "29", "-tune", "animation",
      "-g", "15", "-keyint_min", "15", "-sc_threshold", "0", "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", out]);
    const png = path.join(os.tmpdir(), `arc-szl-${name}-${w}.png`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", out, "-frames:v", "1", png]);
    await sharp(png).webp({ quality: 80 }).toFile(path.join(VID, `${name}@${w}.webp`));
    fs.rmSync(png);
    console.log(`${name}@${w}`, (fs.statSync(out).size / 1024).toFixed(0) + " KB");
  }
  sizes.clips[name] = { d: +(to - from).toFixed(3), w: 1320, h: 2868 };
}

/* the kitchen counter photograph (the study's opening plate), cropped
   tall around the phone */
const PHOTOS = { kitchen: ["public/case-studies/arc/arc-app-kitchen-project-selection-lifestyle.jpg", 0.8, [900, 1400, 0]] };
for (const [name, [src, ar, rungs]] of Object.entries(PHOTOS)) {
  const m = await sharp(path.join(ROOT, src)).metadata();
  const w = Math.round(m.height * ar), left = Math.round((m.width - w) / 2);
  const crop = await sharp(path.join(ROOT, src)).extract({ left, top: 0, width: w, height: m.height }).toBuffer();
  for (const r of rungs) {
    const rw = r || w;
    await sharp(crop).resize(rw).webp({ quality: 82 }).toFile(path.join(IMG, `${name}@${rw}.webp`));
  }
  sizes.pics[name] = { w, h: m.height, rungs: rungs.map((r) => r || w) };
  console.log(name, w + "x" + m.height);
}
fs.writeFileSync(path.join(OUT, "sizes.json"), JSON.stringify(sizes, null, 1) + "\n");
console.log("wrote", path.relative(ROOT, OUT));
