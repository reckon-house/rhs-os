#!/usr/bin/env node
/* ── the credits, for the density lab (30 Sept 2026) ─────────────────
   His note on crossref2: "we need the section that currently says
   'Worked with, spotted by & featured in.' showing the brands". The
   names, their marks and the marks' tuned heights live in one place, the
   live footer (src/components/shell/pressing-footer/PressingCredits.tsx,
   CREDITS); this reads them from there, in its order, and writes
   public/lab/density/credits.js for crossref2 to set. Run it again when
   the footer's list changes.

       node scripts/lib/density-credits.mjs            */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = path.join(ROOT, "src/components/shell/pressing-footer/PressingCredits.tsx");
const OUT = path.join(ROOT, "public/lab/density/credits.js");
const ts = fs.readFileSync(SRC, "utf8");
const at = ts.indexOf("export const CREDITS");
if (at < 0) throw new Error("credits: no CREDITS in " + SRC);
const block = ts.slice(at, ts.indexOf("];", at));
const credits = [...block.matchAll(/\{([^{}]*)\}/g)].map(([, body]) => {
  const name = (/name:\s*"([^"]+)"/.exec(body) || [])[1];
  const src = (/src:\s*"([^"]+)"/.exec(body) || [])[1];
  const height = (/height:\s*(\d+(?:\.\d+)?)/.exec(body) || [])[1];
  const asis = /asis:\s*true/.test(body);
  return Object.assign({ name }, src ? { src } : {}, height ? { height: +height } : {}, asis ? { asis } : {});
}).filter((c) => c.name);
if (credits.length < 10) throw new Error("credits: came up short (" + credits.length + ")");
credits.forEach((c) => { if (c.src && !fs.existsSync(path.join(ROOT, "public", c.src))) throw new Error("credits: no file for " + c.name + ": " + c.src); });
fs.writeFileSync(OUT, "/* the site's credits, read from the live footer (PressingCredits.tsx, CREDITS)\n" +
  "   by scripts/lib/density-credits.mjs; written, not typed, so run it again\n" +
  "   rather than editing this */\nwindow.DENSITY_CREDITS = " + JSON.stringify(credits, null, 1) + ";\n");
console.log("credits: " + credits.length + " to " + path.relative(ROOT, OUT));
