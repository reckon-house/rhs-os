#!/usr/bin/env node
/* ── the DSC hero sizzle's pictures (28 Sept 2026) ──────────────────────
   public/lab/dsc-sizzle/ plays the DSC study's own pictures, so this
   writes them as webp rungs beside it: the device photographs at 1000
   and 2000 wide (a full-bleed frame is at most about 1000 CSS pixels in
   a room, so 2000 keeps it at half its pixels), the phone screens at
   their own size (they are set small, at most half their width), and
   the DSC mark as an alpha mask so it can be drawn in white on black.

   Only pictures the study already publishes, and none of the admin
   screens that show real registrants' names (the owner console home and
   the athlete roster): the dsc-sizzle project leaves those out on
   purpose, and so does this.

       node scripts/lib/dsc-sizzle-img.mjs            */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sharp = createRequire(import.meta.url)(path.join(ROOT, "node_modules/sharp"));
const SRC = path.join(ROOT, "public/case-studies/dsc");
const OUT = path.join(ROOT, "public/lab/dsc-sizzle/img");
fs.mkdirSync(OUT, { recursive: true });

/* name: [source, rungs]; a rung of 0 is the picture's own width */
const PHOTOS = {
  "laptop-concrete": ["new/hero1.jpg", [1000, 1400, 1600, 2000]],
  "phone-chat": ["new/hero2.jpg", [1000, 1400, 1600, 2000]],
  "phone-calendar": ["new/hero3.jpg", [1000, 1400, 1600, 2000]],
  "phone-site": ["new/hero4.jpg", [1000, 1400, 1600, 2000]],
  "laptop-stool": ["dsc-marketing-site-laptop-stool-hero.jpg", [1000, 1400, 1600, 0]],
  "site-recovery": ["dsc-marketing-site-recovery-section.jpg", [900, 0]],
  "site-facilities": ["dsc-marketing-site-facilities-equipment.jpg", [900, 0]],
};
const SCREENS = {
  login: "dsc-athlete-app-login-screen.jpg",
  registration: "dsc-athlete-app-registration-form.jpg",
  dashboard: "dsc-athlete-app-dashboard-next-session.jpg",
  programs: "dsc-athlete-app-programs-services.jpg",
  trainer: "dsc-athlete-app-trainer-bio-profile.jpg",
  /* tall captures, for scrolling inside a phone: the trainers list (staff
     demo accounts) and the athlete dashboard end to end */
  "trainers-list": "new/admin-screens/image 399.jpg",
  "dash-full": "new/scheduling-screens/04-athlete-dashboard-full 4.jpg",
  connect: "dsc-athlete-app-connect-mcp-server.jpg",
  consent: "dsc-claude-oauth-consent.jpg",
  "claude-trainers": "dsc-claude-mcp-chat-trainers.jpg",
  "claude-avail": "dsc-claude-mcp-chat-trainer-availability.jpg",
  "claude-request": "dsc-claude-mcp-chat-booking-request.jpg",
  "owner-chat": "dsc-owner-console-batch-scheduling-chat.jpg",
};

/* the app's own backgrounds, for the screens the sizzle rebuilds from its
   source (screens.js, 29 Sept 2026): the check-in kiosk's floor and the
   sign-up page's. They are not in the study; they are what anyone sees
   on the app's public /checkin and /athlete/register pages, read from
   its public folder (the same overhead shot of the floor, flipped, one
   with the gym's line across its foot). Skipped if the app is not here */
const APP = process.env.DSC_APP || "/Users/jp33/Documents/DSC/gym-management";
const APP_PHOTOS = {
  "app-checkin": ["public/checkin-bg-flip.jpg", [1600]],
  "app-landing": ["public/images/landing-page-bg.jpg", [1600]],
};

const sizes = {};
const photos = Object.entries(PHOTOS).map(([name, [src, rungs]]) => [name, path.join(SRC, src), rungs]);
if (fs.existsSync(APP)) Object.entries(APP_PHOTOS).forEach(([name, [src, rungs]]) => photos.push([name, path.join(APP, src), rungs]));
else console.log("no app at " + APP + ": its two backgrounds keep the files already in img/");
for (const [name, file, rungs] of photos) {
  const m = await sharp(file).metadata();
  sizes[name] = { w: m.width, h: m.height, rungs: [] };
  for (const r of rungs) {
    const w = r ? Math.min(r, m.width) : m.width, out = `${name}@${w}.webp`;
    /* concrete is all texture and compresses badly, so the largest rung
       gives up a little quality to stay near the others' weight */
    await sharp(file).resize({ width: w }).webp({ quality: w >= 1800 ? 70 : w >= 1400 ? 72 : 78 }).toFile(path.join(OUT, out));
    sizes[name].rungs.push(w);
  }
}
for (const [name, src] of Object.entries(SCREENS)) {
  const file = path.join(SRC, src), m = await sharp(file).metadata();
  await sharp(file).webp({ quality: 86 }).toFile(path.join(OUT, `${name}.webp`));
  sizes[name] = { w: m.width, h: m.height, rungs: [m.width], screen: true };
}
/* the mark: black on an opaque white square in the source; here its ink
   becomes alpha, so CSS can fill it with any colour */
{
  const file = path.join(ROOT, "public/lab/dsc-demos/assets/logo-mark.png");
  const { data, info } = await sharp(file).removeAlpha().greyscale().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) { out[i * 4] = out[i * 4 + 1] = out[i * 4 + 2] = 0; out[i * 4 + 3] = 255 - data[i]; }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).resize({ width: 480 }).png().toFile(path.join(OUT, "mark.png"));
}
fs.writeFileSync(path.join(OUT, "sizes.json"), JSON.stringify(sizes, null, 1) + "\n");
let kb = 0; for (const f of fs.readdirSync(OUT)) if (!f.startsWith("._")) kb += fs.statSync(path.join(OUT, f)).size / 1024;
console.log(`wrote ${Object.keys(sizes).length} pictures and the mark to public/lab/dsc-sizzle/img (${Math.round(kb)} KB)`);
console.log(JSON.stringify(sizes));
