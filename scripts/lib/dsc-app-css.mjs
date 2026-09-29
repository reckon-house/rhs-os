#!/usr/bin/env node
/* ── the DSC app's own stylesheet, for the sizzle (29 Sept 2026) ──────
   The sizzle's phones run the DSC app's real markup, so they need its
   real CSS. public/lab/dsc-demos/dsc-app.css is the deployed app's as of
   14 Aug; the app has grown since (check-in, injuries, leads, time off,
   money), so this compiles the current one from the app's own source:
   its globals.css through its own postcss and @tailwindcss/postcss, with
   its files scanned for classes. Nothing in the app's folder is written.

       node scripts/lib/dsc-app-css.mjs [path/to/gym-management]      */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const APP = process.argv[2] || "/Users/jp33/Documents/DSC/gym-management";
const req = createRequire(path.join(APP, "package.json"));
const postcss = req("postcss"), tw = req("@tailwindcss/postcss");
const from = path.join(APP, "src/app/globals.css");
const out = await postcss([tw({ base: APP, optimize: { minify: true } })]).process(fs.readFileSync(from, "utf8"), { from });
const dest = path.join(ROOT, "public/lab/dsc-sizzle/app.css");
fs.writeFileSync(dest, "/* the DSC app's stylesheet, compiled from its source by scripts/lib/dsc-app-css.mjs; the sizzle swaps its @font-face for the site's Avenir */\n" + out.css);
console.log("wrote public/lab/dsc-sizzle/app.css", (out.css.length / 1024).toFixed(1) + "KB");
