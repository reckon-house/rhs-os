#!/usr/bin/env node
/* ── SALLY SYSTEM: the live pages for the Sally design system study ─────
   1 Oct 2026. His Sally Beauty email + homepage design system lives in a
   working folder outside the repo (Claude design canvases, plain HTML
   concept pages, a React email canvas). He asked for the study to use
   live pages, not screenshots ("can we use live pages?"), so this
   imports what the study frames into public/lab/sally-system/:

     the eleven homepage concepts and the modules page, as they are;
     every email, FROZEN: each rendered email from "Sally Emails for
       Figma.html" saved as its own static page, so a frame needs no
       React, no Babel and no CDN;
     only the files those pages actually load (logged in a headless
       browser at 1440 and 390, scrolled through), and of those:
       photographs saved as JPEG and packshots with transparency as WebP,
       the references rewritten; Founders Grotesk as woff2.

   Ogg is NOT copied. The concepts never use it (styles.css only
   declares it), and its Sharp Type licence does not cover the web, so
   its @font-face comes out of the copied styles.css.

       node scripts/lib/sally-system-import.mjs [source folder]

   The source defaults to ~/Downloads/Sally Beauty Email & HP. Run it
   again when the designs change; it rewrites the folder. */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { injectChrome } from "./sally-chrome.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(import.meta.url);
const sharp = require(path.join(ROOT, "node_modules/sharp"));
const { chromium } = await import(path.join(ROOT, "node_modules/playwright-core/index.mjs"));

const SRC = path.resolve(process.argv[2] || path.join(os.homedir(), "Downloads/Sally Beauty Email & HP"));
const OUT = path.join(ROOT, "public/lab/sally-system");
const CONCEPTS = ["editorial", "cards", "full", "story", "foryou", "takeover", "diy", "color", "mix", "edit", "lookbook"];
const PAGES = CONCEPTS.map((c) => `homepage-${c}.html`).concat(["homepage-blocks.html"]);
const EMAIL_SOURCE = "Sally Emails for Figma.html";

/* a static server for the source folder, so pages load as they do in his canvas */
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".jsx": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".otf": "font/otf", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const p = path.join(SRC, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(SRC) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(p).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch();
const used = new Set(); /* source-relative paths the pages load */
const logPage = async (p) => p.on("request", (r) => { const u = r.url(); if (u.startsWith(BASE)) used.add(decodeURIComponent(u.slice(BASE.length).split(/[?#]/)[0])); });

/* 1. the pages, loaded at desk and phone width and scrolled through, so
      every picture they show is requested */
for (const pg of PAGES) for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } }); logPage(p);
  await p.goto(BASE + pg, { waitUntil: "networkidle" });
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } });
  await p.waitForTimeout(600); await p.close();
}

/* 2. the emails, frozen: each .email-col's rendered frame, as a page of its own */
const emails = [];
{
  const p = await browser.newPage({ viewport: { width: 1600, height: 1000 } }); logPage(p);
  await p.goto(BASE + encodeURI(EMAIL_SOURCE), { waitUntil: "networkidle" });
  await p.waitForTimeout(4000);
  const got = await p.evaluate(() => {
    const own = [...document.querySelectorAll("style")].map((s) => s.textContent).join("\n");
    return { own, list: [...document.querySelectorAll(".email-col")].filter((c) => c.querySelector(".email-frame")).map((c) => ({ label: (c.querySelector(".email-label") || {}).textContent || "", html: c.querySelector(".email-frame").outerHTML })) };
  });
  const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  got.list.forEach((e) => { e.id = slug(e.label); emails.push(e); });
  emails.own = got.own;
  await p.close();
}
await browser.close();
server.close();

/* 3. write the folder */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const rename = new Map(); /* source path -> published path */
const textFiles = [];
for (const f of [...used].sort()) {
  const src = path.join(SRC, f);
  if (!fs.existsSync(src) || /(^|\/)Ogg/i.test(f)) continue;
  const ext = path.extname(f).toLowerCase();
  /* the email canvas's own app (its page and JSX) is not published: the emails go out frozen */
  if (ext === ".jsx" || (ext === ".html" && !PAGES.includes(f))) continue;
  if ([".html", ".css", ".js"].includes(ext)) { textFiles.push(f); continue; }
  fs.mkdirSync(path.dirname(path.join(OUT, f)), { recursive: true });
  if (ext === ".otf" && /FoundersGrotesk/.test(f)) {
    const to = f.replace(/\.otf$/i, ".woff2");
    execFileSync("python3", ["-c", "import sys;from fontTools.ttLib import TTFont;t=TTFont(sys.argv[1]);t.flavor='woff2';t.save(sys.argv[2])", src, path.join(OUT, to)]);
    rename.set(f, to); continue;
  }
  if (ext === ".png") {
    const img = sharp(src); const meta = await img.metadata(); const st = await img.stats();
    const clear = meta.hasAlpha && st.channels[3] && st.channels[3].min < 250;
    const to = f.replace(/\.png$/i, clear ? ".webp" : ".jpg");
    const big = Math.max(meta.width, meta.height) > 1600;
    let pipe = sharp(src); if (big) pipe = pipe.resize({ width: meta.width >= meta.height ? 1600 : null, height: meta.height > meta.width ? 1600 : null });
    if (clear) await pipe.webp({ quality: 86, alphaQuality: 90 }).toFile(path.join(OUT, to));
    else await pipe.flatten({ background: "#ffffff" }).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(OUT, to));
    rename.set(f, to); continue;
  }
  if ((ext === ".jpg" || ext === ".jpeg") && fs.statSync(src).size > 600 * 1024) {
    const meta = await sharp(src).metadata();
    await sharp(src).resize({ width: Math.min(meta.width, 2000) }).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(OUT, f));
    continue;
  }
  fs.copyFileSync(src, path.join(OUT, f));
}
const rewrite = (s) => {
  for (const [a, b] of rename) s = s.split(a).join(b);
  return s.replace(/format\('opentype'\)/g, (m, i, all) => (all.slice(Math.max(0, i - 80), i).includes(".woff2") ? "format('woff2')" : m));
};
const OGG = /@font-face\s*\{[^}]*Ogg[^}]*\}\s*/g;
/* the pushed pass (2 Oct 2026, his "let's do a pass so that everything
   has satoshi and that new look"): any page here opened with ?skin=pushed
   loads ../sally-push/skin.css after its own styles, which re-points his
   system's feel levers and tints. Without the flag the page is his,
   unchanged, so a before and after is one query string apart */
const SKIN = `<script>if(/[?&]skin=pushed/.test(location.search)){document.documentElement.dataset.skin="pushed";document.write('<link rel="stylesheet" href="../sally-push/skin.css">')}</script>\n`;
/* and the one chrome (3 Oct 2026): under the skin, chrome.js renders the
   pushed pages' header and footer (or an email's head and foot) in place
   of his own; sally-chrome.mjs owns the markup and this keeps the tag
   through a re-import */
const skinned = (html) => injectChrome(html.includes("sally-push/skin.css") ? html : html.replace("</head>", SKIN + "</head>"));
for (const f of textFiles.concat(fs.existsSync(path.join(SRC, "punch.css")) ? ["punch.css"] : [])) {
  let s = fs.readFileSync(path.join(SRC, f), "utf8");
  s = rewrite(s);
  if (f === "styles.css") s = s.replace(OGG, "/* Ogg is not served here (Sharp Type licence); these pages never use it */\n");
  if (f.endsWith(".html")) s = skinned(s);
  fs.mkdirSync(path.dirname(path.join(OUT, f)), { recursive: true });
  fs.writeFileSync(path.join(OUT, f), s);
}
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
for (const e of emails) {
  fs.writeFileSync(path.join(OUT, `email-${e.id}.html`), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=600">
<title>Sally Beauty · ${esc(e.label)}</title>
<!-- frozen from "${EMAIL_SOURCE}" by scripts/lib/sally-system-import.mjs: the
     rendered email, without React, Babel or a CDN -->
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="punch.css">
${SKIN}<style>${emails.own}
html, body { margin: 0; background: #fff; }
body { width: 600px; margin: 0 auto; }
.email-frame { margin: 0; box-shadow: none; }</style>
</head>
<body>
${rewrite(e.html)}
</body>
</html>
`);
}
fs.writeFileSync(path.join(OUT, "README.md"), `# sally-system

Live pages for the Sally design system study, imported from his working
folder by \`scripts/lib/sally-system-import.mjs\` (do not edit by hand; run
the script again). Eleven homepage concepts (\`homepage-*.html\`), the
modules page (\`homepage-blocks.html#<module>\`), and ${emails.length} emails frozen
as static pages (\`email-*.html\`). Founders Grotesk is served as woff2, as
the Sally Marketing OS demos already do; Ogg is not served.
`);
console.log(`wrote ${OUT}: ${PAGES.length} pages, ${emails.length} emails (${emails.map((e) => e.id).join(", ")}), ${used.size} source files used, ${rename.size} converted`);
