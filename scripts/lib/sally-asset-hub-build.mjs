// build_asset_hub.mjs: regenerates everything asset-hub.html loads that is not
// hand-written.   node scripts/lib/sally-asset-hub-build.mjs
// (moved out of public/lab/sally-demos/ on 3 Oct 2026 so it is not served)
//
// Same convention as render_demo_email.py: it reads the product repos at their
// local paths, read-only, and writes only into this folder.
//
// 1. assets/hub/        the photography, from this repo's own lab folders.
// 2. sally-assets.css   the Asset Hub's CSS, verbatim (see the header it writes).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RHS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");   // the RHS repo root
const HERE = path.join(RHS, "public/lab/sally-demos");
const DAM = "/Volumes/ReckonHouse/Sally/Sally DAM/sally-dam";
const PORTAL = "/Volumes/ReckonHouse/Sally/Sally Marketing Brain/sally-portal/index.html";
const HTML = path.join(HERE, "asset-hub.html");
const HUB = path.join(HERE, "assets/hub");
const CSS_OUT = path.join(HERE, "sally-assets.css");

// =========================================================== 1. the images
// Grid thumbs mimic the DAM's thumbnail_url: a square cover crop, centred
// (Supabase render/image with width & height defaults to that). The detail
// view shows the original at <= 900px. The Email Hero export is made with the
// SAME call the DAM's template route makes (sally-dam
// src/app/api/assets/[id]/template/route.ts):
//   sharp(img).resize(1200, 400, { fit: "cover", position: sharp.strategy.attention })
// The attention crop is deterministic: it lands on the same band (lips, nails,
// curls) at any source size, so this is what the product returns for the photo.
const sharp = (await import(path.join(RHS, "node_modules/sharp/lib/index.js"))).default;
fs.mkdirSync(HUB, { recursive: true });
const SYS = path.join(RHS, "public/lab/sally-system/assets/img");
const DEM = path.join(RHS, "public/lab/sally-demos/assets");
const THUMBS = [
  ["vivid-purple-curls", SYS, "purple-nails-port.jpg"],   // the detail asset: SALLY_26_Evergreen_HairColor_Vivid_Purple_Updo_252
  ["golden-curls-portrait", SYS, "copper-port.jpg"],
  ["golden-curls-landscape", SYS, "copper-curly-land.jpg"],
  ["curly-updo-red-lip", DEM, "lifestyle-hero.jpg"],
  ["brunette-curls-cream", SYS, "grey-coverage-land.jpg"],
  ["blue-vivid-curls", SYS, "vivids-port.jpg"],
  ["short-curls-denim", DEM, "lifestyle-bixie.jpg"],
  ["natural-coils-satin", SYS, "protective-port.jpg"],
  ["wella-demi-5rr", DEM, "wella-demi-5rr.jpg"],
  ["wella-gloss-crimson", DEM, "wella-gloss-crimson.jpg"],
  ["wella-demi-1n", DEM, "wella-demi-1n.jpg"],
  ["wella-gloss-choc", DEM, "wella-gloss-choc.jpg"],
  ["blonde-waves-portrait", SYS, "chiwaver-port.jpg"],
  ["brunette-waves-red-top", SYS, "cherry-nails-port.jpg"],
  ["teal-hair-vanity", DEM, "lifestyle-teal.jpg"],
  ["root-touchup-at-home", DEM, "bb-root-touchup.jpg"],
  ["blonde-outdoor-portrait", SYS, "blonde-port.jpg"],
  ["silver-hair-portrait", SYS, "gray-shampoo-land.jpg"],
  ["teal-braids-mirror", SYS, "teal-nails-port.jpg"],
  ["blonde-waver-styling", SYS, "chiwaver-land.jpg"],
];
// one exception to the centred crop: her eyes sit above the centre square
const POSITION = { "blue-vivid-curls": "north" };
for (const [name, dir, file] of THUMBS) {
  await sharp(path.join(dir, file))
    .resize(420, 420, { fit: "cover", position: POSITION[name] || "centre" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(HUB, name + "-sq.jpg"));
}
const PURPLE = path.join(SYS, "purple-nails-port.jpg");
await sharp(PURPLE).resize(900, 900, { fit: "inside" })
  .jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(HUB, "vivid-purple-curls.jpg"));
const emailHero = await sharp(PURPLE)
  .resize(1200, 400, { fit: "cover", position: sharp.strategy.attention }).png().toBuffer();
await sharp(emailHero).resize(900, 300)
  .jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(HUB, "vivid-purple-curls-email-hero.jpg"));
console.log("assets/hub: " + THUMBS.length + " thumbs, the detail photo, the Email Hero attention crop");

// =========================================================== 2. the CSS
// Two verbatim sources, nothing hand-written:
//  a. the portal's Asset Hub panel + embed rules, copied as text out of
//     sally-portal/index.html;
//  b. the DAM's own src/app/globals.css compiled by the DAM's own Tailwind
//     (from its node_modules) for exactly the class names asset-hub.html uses,
//     then optimized by the same lightningcss step its production build runs.
// Then three mechanical adaptations for one document instead of an iframe,
// each explained in the header written below.
const tw = await import(path.join(DAM, "node_modules/@tailwindcss/node/dist/index.mjs"));
const postcss = (await import(path.join(RHS, "node_modules/postcss/lib/postcss.mjs"))).default;
const twVersion = JSON.parse(fs.readFileSync(path.join(DAM, "node_modules/tailwindcss/package.json"), "utf8")).version;

// ---- a. the portal
const pLines = fs.readFileSync(PORTAL, "utf8").split("\n");
// A rule block as text: from the line where `selector {` opens (plus the
// comment lines directly above it, when asked) through its closing brace.
function block(startsWith, withComment = false) {
  const i = pLines.findIndex((l) => l.trim().startsWith(startsWith));
  if (i < 0) throw new Error("portal rule not found: " + startsWith);
  let s = i;
  if (withComment) {
    while (s > 0 && /^\s*(\/\*|\*|.*\*\/\s*$)/.test(pLines[s - 1]) && !/\}\s*$/.test(pLines[s - 1])) s--;
  }
  let e = i, depth = 0;
  for (; e < pLines.length; e++) {
    for (const ch of pLines[e]) { if (ch === "{") depth++; else if (ch === "}") depth--; }
    if (depth <= 0 && /\}/.test(pLines[e])) break;
  }
  return pLines.slice(s, e + 1).map((l) => l.replace(/^ {8}/, "")).join("\n");
}
const portalCss = [
  block(".view-container {"),
  block(".view-container.active {"),
  "",
  block(".dam-embed-wrapper {"),
  "",
  block(".campaign-list-item {"),
  block(".campaign-list-item:hover {"),
  block(".campaign-list-item.selected {"),
  block(".campaign-list-item .item-icon {"),
  block(".campaign-list-item:hover .item-icon,"),
  block(".campaign-list-item > span {", true),
  "",
  block(".dam-filters-section {"),
  block(".dam-filters-divider {"),
  block(".dam-filter-select:hover {"),
  block(".dam-filter-select:focus {"),
  block(".dam-filter-clear {"),
  block(".dam-filter-clear:hover {"),
].join("\n");

// ---- b. the DAM
let globals = fs.readFileSync(path.join(DAM, "src/app/globals.css"), "utf8");
// Its @font-face blocks point at the DAM's own /fonts/ (Satoshi, plus an italic
// nothing here uses). sally-portal-chrome.css already loads the same Satoshi
// file from assets/, so these are dropped.
for (const f of globals.match(/\/\* Satoshi[^\n]*\n|@font-face\s*\{[^}]*\}\n?/g) || []) globals = globals.replace(f, "");

// Candidates the way Tailwind's own scanner finds them: every token in the
// page, split on whitespace and characters that can't occur in a class name;
// the compiler ignores tokens that aren't classes. Comments and the page's own
// <style> are skipped, so prose like "static" doesn't mint an unused utility.
const scanned = fs.readFileSync(HTML, "utf8")
  .replace(/<style>[\s\S]*?<\/style>/g, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/\/\*[\s\S]*?\*\//g, " ")
  .replace(/^\s*\/\/.*$/gm, " ")
  .replace(/\s\/\/\s.*$/gm, " ");
const candidates = new Set(scanned.split(/[\s"'`<>=;{}]+/).filter(Boolean));

const compiler = await tw.compile(globals, { base: path.join(DAM, "src/app"), onDependency: () => {} });
const optimized = tw.optimize(compiler.build([...candidates]), { minify: false, file: "globals.css" });
const damRaw = typeof optimized === "string" ? optimized : optimized.code;

// ---- the three adaptations
const SCOPE = ".dam-doc";
const BP_KEEP = new Set(["40rem", "48rem", "64rem"]); // sm md lg: true inside a 1026px iframe
const BP_DROP = new Set(["80rem", "96rem"]);           // xl 2xl: false inside a 1026px iframe
const unique = (arr) => [...new Set(arr)];
function scopeSel(sel) {
  const s = sel.trim();
  if (s === ":root" || s === ":host" || s === "html" || s === "body") return SCOPE;
  if (/^(:root|html|:host)\b/.test(s)) return s.replace(/^(:root|html|:host)/, SCOPE);
  return SCOPE + " " + s;
}
function layerOf(node) {
  for (let p = node.parent; p; p = p.parent) if (p.type === "atrule" && p.name === "layer") return p.params.trim();
  return null;
}
const iframeToDiv = {
  postcssPlugin: "dam-iframe-to-div",
  Once(root) {
    // breakpoints answer to the iframe's 1026px, not the host page
    root.walkAtRules("media", (at) => {
      const m = at.params.match(/^\(\s*(?:min-width\s*:\s*|width\s*>=\s*)([\d.]+rem)\s*\)$/);
      if (!m) return;
      if (BP_DROP.has(m[1])) at.remove();
      else if (BP_KEEP.has(m[1])) at.replaceWith(at.nodes);
    });
    // document-level rules move onto .dam-doc, the element standing in for the
    // iframe's <body>: theme variables, preflight, the @property fallback, and
    // the DAM's own unlayered :root / body / scrollbar / ::selection rules
    root.walkRules((rule) => {
      if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
      const layer = layerOf(rule);
      const docLevel = layer === "theme" || layer === "base" || layer === "properties" ||
        (layer === null && rule.selectors.some((s) => /^(:root|:host|html|body|\*|::)/.test(s.trim())));
      if (!docLevel) return;
      rule.selectors = unique(rule.selectors.map(scopeSel));
      // body's min-height: 100vh meant the iframe; here 100vh is the host page
      if (layer === null && rule.selector === SCOPE) {
        rule.walkDecls("min-height", (d) => { if (/100vh/.test(d.value)) d.remove(); });
      }
    });
    // every hover: / group-hover: / focus: rule also answers to .ah-hover /
    // .ah-focus (keeping any @supports fallback wrapper; @media (hover: hover)
    // flattened so touch screens see the replayed hover too)
    let util = null;
    root.walkAtRules("layer", (at) => { if (at.params.trim() === "utilities" && at.nodes) util = at; });
    const isVariant = (s) => /\\:/.test(s) && /:hover|:focus\b/.test(s);
    const mapSel = (s) => s
      .replace(/:where\(\.group\):hover/g, ":where(.group).ah-hover")
      .replace(/:hover/g, ".ah-hover")
      .replace(/:focus\b/g, ".ah-focus");
    function cloneMapped(node) {
      if (node.type === "rule") {
        const sels = node.selectors.filter(isVariant);
        return sels.length ? [node.clone({ selectors: unique(sels.map(mapSel)) })] : [];
      }
      if (node.type === "atrule" && (node.name === "supports" || (node.name === "media" && /hover/.test(node.params)))) {
        const kids = (node.nodes || []).flatMap(cloneMapped);
        if (!kids.length) return [];
        if (node.name === "media") return kids;
        const wrap = node.clone({ nodes: [] });
        kids.forEach((k) => wrap.append(k));
        return [wrap];
      }
      return [];
    }
    util.nodes.flatMap(cloneMapped).forEach((n) => util.append(n));
  },
};
const scoped = (await postcss([iframeToDiv]).process(damRaw, { from: undefined })).css;
// a second pass of the same optimizer, only to normalise the formatting
const formatted = tw.optimize(scoped, { minify: false, file: "sally-assets.css" });
const damCss = typeof formatted === "string" ? formatted : formatted.code;

const header = `/* ============================================================
   sally-assets.css: the Asset Hub, extracted. Nothing in this file
   is hand-written. Regenerate with:
     node public/lab/sally-demos/build_asset_hub.mjs

   PART 1 · THE PORTAL. The Asset Hub panel and the embed that frames
   the DAM, copied as text from sally-portal/index.html (class names
   and values verbatim): .view-container, .dam-embed-wrapper,
   .campaign-list-item, .dam-filters-*. The rail, the panel shell and
   .dam-filters-label / -group / -select are already in
   sally-portal-chrome.css and are not repeated here.

   PART 2 · THE DAM (sally-dam, the Next.js app the portal iframes as
   the Asset Hub). Its own src/app/globals.css compiled by its own
   Tailwind (${twVersion}, from its node_modules) for exactly the class
   names asset-hub.html uses, then optimized the way its production
   build optimizes (lightningcss). Utilities keep their product names
   (.glass, .rounded-2xl, .text-gray-900 ...).

   Three mechanical adaptations, because here the DAM shares one
   document with the portal instead of owning an iframe:
   · Document-level rules move onto .dam-doc, the element standing in
     for the iframe's <body>: Tailwind's theme variables and preflight,
     and the DAM's own :root / body / scrollbar / ::selection rules.
     Without this its reset would restyle the portal chrome around it.
     body's min-height: 100vh is not carried (100vh would be the host
     page, not the iframe).
   · Breakpoints answer to the iframe's width, not the page's. The DAM
     is laid out at 1026px (see asset-hub.html), so sm/md/lg variants
     are unconditional and xl/2xl are dropped, the same result the real
     media queries give inside a 1026px iframe.
   · Every hover:, group-hover: and focus: rule also answers to
     .ah-hover / .ah-focus, so the replay can show the product's own
     hover and focus states without a pointer and without calling
     focus() (which would pull keyboard focus out of the case study).
   The DAM's @font-face blocks are dropped: they point at its own
   /fonts/, and sally-portal-chrome.css loads the same Satoshi file.

   Known, and kept: .glass carries only -webkit-backdrop-filter.
   globals.css writes the unprefixed property first and the -webkit-
   one second, and lightningcss keeps only the last of the pair. That
   is the optimizer @tailwindcss/postcss runs on production builds by
   default, so the shipped DAM very likely has the same gap (no glass
   blur in Chrome or Firefox). On these flat grounds it is invisible.
   ============================================================ */

/* ============================================================
   PART 1 · the portal (sally-portal/index.html)
   ============================================================ */
`;
const part2 = `

/* ============================================================
   PART 2 · the DAM (sally-dam/src/app/globals.css + Tailwind ${twVersion})
   ============================================================ */
`;
fs.writeFileSync(CSS_OUT, header + portalCss + part2 + damCss.trim() + "\n");
console.log("sally-assets.css: " + candidates.size + " candidates, " + fs.statSync(CSS_OUT).size + " bytes");
