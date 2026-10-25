#!/usr/bin/env node
/* ── MINIFY THE HOMEPAGE'S FILES, IN VERCEL'S COPY ONLY (25 Oct 2026) ──
   His "let's def minify". The homepage is a static page
   (public/lab/density/crossref2.html, at / by rewrite), so its scripts
   and sheets go out as written, comments and all. This runs before
   `next build` on Vercel (vercel.json) and minifies, in place, every
   /lab/ script and sheet that page names. The files in the repo and on
   his Mac stay readable, and the dev server is untouched.

   Measured on a 390 phone, CPU slowed 4x, slow 4G, 20 Oct: the cover
   from 5.83 s to 4.74 s, the same page drawn.

   It only touches files when VERCEL is set (Vercel sets it on every
   build), or with --here for a test copy of the site. A file esbuild
   cannot read is left as it is, so a deploy never fails here. Top-level
   names are kept: these are classic scripts that share globals.

       node scripts/minify-lab.mjs          (on Vercel)
       node scripts/minify-lab.mjs --here   (a copy of the site, to test)
*/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (!process.env.VERCEL && !process.argv.includes("--here")) {
  console.log("minify-lab: not a Vercel build, files left as written (--here to run it on a copy)");
  process.exit(0);
}
let esbuild;
try { esbuild = await import("esbuild"); } catch (e) { console.log("minify-lab: esbuild is not installed, files left as written"); process.exit(0); }

const PAGE = path.join(ROOT, "public/lab/density/crossref2.html");
const html = fs.readFileSync(PAGE, "utf8");
const names = new Set();
for (const m of html.matchAll(/["'](\/lab\/[^"'?#]+\.(?:js|css))["']/g)) if (!/\.min\.(js|css)$/.test(m[1])) names.add(m[1]);

let before = 0, after = 0, done = 0;
const left = [];
for (const name of [...names].sort()) {
  const file = path.join(ROOT, "public", name);
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  try {
    const out = await esbuild.transform(src, { loader: name.endsWith(".css") ? "css" : "js", minify: true, legalComments: "none", charset: "utf8" });
    if (out.code.length >= src.length) continue;
    fs.writeFileSync(file, out.code);
    before += src.length; after += out.code.length; done++;
  } catch (e) {
    left.push(name + " (" + String(e.message || e).split("\n")[0].slice(0, 100) + ")");
  }
}
console.log("minify-lab:", done, "files,", Math.round(before / 1024) + " KB to " + Math.round(after / 1024) + " KB before compression" + (left.length ? "; left as written: " + left.join(", ") : ""));
