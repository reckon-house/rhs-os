#!/usr/bin/env node
/* ── ONE CHROME FOR EVERY SALLY PAGE (3 Oct 2026) ─────────────────────────
   His note on the concepts: "some have different navigations, some have
   different footers". Twelve homepages carried two headers and two
   footers: the five pushed pages in public/lab/sally-push/ one pair, his
   seven skinned concepts in public/lab/sally-system/ the original site's
   (site-header.js, site-footer.js). The emails carried two heads.

   The header, the footer, the email head and the email foot are written
   here once, and go everywhere from here:

     --write    into the pushed pages, as static HTML between markers
                (<!-- sk:header note="…" --> … <!-- /sk:header -->), so a
                comp needs no script and a screenshot shows it
     --js       as public/lab/sally-push/chrome.js, which renders the same
                markup into his skinned pages and frozen emails under
                ?skin=pushed (their own chrome is hidden by skin.css)
     --inject   the <script> for chrome.js into every page in
                sally-system/ that has chrome; the import script calls
                injectChrome() too, so a re-import keeps it
     --check    every pushed page's blocks, chrome.js and every injected
                page match what this file says; exit 1 with names if not

   The look is chrome.css. A page's own facts stay on the page: the line
   over the pill (note=), an email's preheader (pre=) and any extra legal
   line (legal=, lines joined by " || ") live in its marker.

       node scripts/lib/sally-chrome.mjs --write --js --inject --check   */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PUSH = path.join(ROOT, "public/lab/sally-push");
const SYS = path.join(ROOT, "public/lab/sally-system");
const JS_FILE = path.join(PUSH, "chrome.js");
const SCRIPT_TAG = '<script src="../sally-push/chrome.js"></script>';

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const LOGO = (assets) => `<img src="${assets}brand/sally-logo-red.webp" alt="Sally Beauty" width="400" height="100">`;

/* ── the pieces ── */
export const NAV = ["Hair Color", "Hair Care", "Nails", "Tools", "Cosmetics", "Brands"];
export const DEFAULT_NOTE = "Free 2-hour delivery on orders $35+";

export function header({ assets = "../sally-system/assets/", note = DEFAULT_NOTE } = {}) {
  return `<div class="sk-util"><span>${esc(note)}</span><span>Free advice from a licensed colorist</span><span>Rewards · Find a store</span></div>
<header class="sk-nav">
  <a class="sk-logo" href="#">${LOGO(assets)}</a>
  <nav class="sk-links">${NAV.map((n) => `<a href="#">${n}</a>`).join("")}<a class="deals" href="#">Deals</a></nav>
  <div class="sk-r"><a href="#">Search</a><a href="#">Sign in</a><a href="#">Bag (0)</a></div>
</header>`;
}

export function footer() {
  const col = (title, items) => `<div><h4>${title}</h4><ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`;
  return `<footer class="sk-ft">
  <div class="in">
    <div class="top">
      <nav class="rows"><a href="#">Find a store</a><a href="#">Download the app</a><a href="#">Chat with a colorist</a></nav>
      <div class="cols">
        ${col("Help", ["Orders", "Shipping", "Returns", "Contact us"])}
        ${col("Shop", ["Hair Color", "Hair Care", "Nails", "Tools", "Brands"])}
        ${col("About", ["Sally Beauty", "Careers", "Newsroom", "Accessibility"])}
      </div>
      <div class="letter">
        <p class="lab">The Gloss</p>
        <p class="say">A letter from Sally, in your inbox once a month.</p>
        <form onsubmit="return false"><input type="email" placeholder="Your email" aria-label="Your email"><button type="submit">Sign up</button></form>
        <p class="fine">Shades, how-tos and the occasional sale. Unsubscribe whenever.</p>
      </div>
    </div>
    <div class="legal"><span>© 2026 Sally Beauty Supply LLC</span><span>Instagram · TikTok · YouTube · Pinterest</span><span>Privacy · Terms of Use · Your Privacy Choices</span></div>
  </div>
</footer>`;
}

export function mailHead({ assets = "../sally-system/assets/", pre = "" } = {}) {
  return `<div class="sk-mpre"><span>${esc(pre)}</span><span>View in browser</span></div>
  <div class="sk-mhd">${LOGO(assets)}<nav><a href="#">New</a><a href="#">Color</a><a href="#">Care</a><a href="#">Nails</a></nav></div>`;
}

export function mailFoot({ legal = [] } = {}) {
  const extra = legal.filter(Boolean).map((l) => `      <p>${esc(l)}</p>\n`).join("");
  return `<div class="sk-mft">
    <a class="row" href="#">Download the app</a>
    <a class="row" href="#">Shop what's new</a>
    <a class="row" href="#">Find a store</a>
    <div class="svc"><span>In-Store</span><span>Online</span><span>Free Shipping</span><span>2-Hour Delivery</span><span>Store Pickup</span></div>
    <div class="legal">
${extra}      <p>This is the United States version of this email. Rewards benefits are for Sally Rewards members and conditions apply. See full <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
      <p>Contact Us · Privacy · Terms of Use · Careers · Preferences · Unsubscribe</p>
      <p>© 2026 Sally Beauty. 3001 Colorado Blvd, Denton, TX 76210.</p>
    </div>
  </div>`;
}

/* ── the markers in the pushed pages ── */
const MARK = /<!-- sk:(header|footer|mailhead|mailfoot)((?:\s+\w+="[^"]*")*) -->[\s\S]*?<!-- \/sk:\1 -->/g;
const params = (s) => { const o = {}; for (const m of s.matchAll(/(\w+)="([^"]*)"/g)) o[m[1]] = m[2]; return o; };
const render = (kind, p) => {
  if (kind === "header") return header({ note: p.note || DEFAULT_NOTE });
  if (kind === "footer") return footer();
  if (kind === "mailhead") return mailHead({ pre: p.pre || "" });
  return mailFoot({ legal: (p.legal || "").split(" || ") });
};
const filled = (html) => html.replace(MARK, (m, kind, attrs) => `<!-- sk:${kind}${attrs} -->\n${render(kind, params(attrs))}\n<!-- /sk:${kind} -->`);
const pushedPages = () => fs.readdirSync(PUSH).filter((f) => f.endsWith(".html")).map((f) => path.join(PUSH, f)).filter((f) => MARK.test(fs.readFileSync(f, "utf8")) && (MARK.lastIndex = 0, true));

/* ── chrome.js, for his pages and frozen emails under the skin ── */
export function chromeJs() {
  const A = "assets/";
  return `/* generated by scripts/lib/sally-chrome.mjs; do not edit. Under ?skin=pushed
   a skinned concept or a frozen email gets the same header, footer, email
   head and foot the pushed pages carry; skin.css hides its own. */
(function () {
  if (document.documentElement.dataset.skin !== "pushed") return;
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
  var frame = document.querySelector(".email-frame");
  if (frame) {
    var h = frame.querySelector("h1, h2, .big");
    var pre = (h ? h.textContent : document.title.replace(/^Sally Beauty\\s*\\u00b7\\s*/, "")).replace(/\\s+/g, " ").trim().slice(0, 90);
    frame.insertAdjacentHTML("beforebegin", ${JSON.stringify(mailHead({ assets: A, pre: "__PRE__" }))}.replace("__PRE__", esc(pre)));
    frame.insertAdjacentHTML("afterend", ${JSON.stringify(mailFoot())});
  } else {
    document.body.insertAdjacentHTML("afterbegin", ${JSON.stringify(header({ assets: A }))});
    document.body.insertAdjacentHTML("beforeend", ${JSON.stringify(footer())});
  }
})();
`;
}

/* the script tag, into a page of his that has chrome to replace */
export function injectChrome(html) {
  if (html.includes(SCRIPT_TAG)) return html;
  if (!/site-header\.js|class="email-frame"/.test(html)) return html;
  return html.replace(/<\/body>/i, SCRIPT_TAG + "\n</body>");
}
const sysPages = () => fs.existsSync(SYS) ? fs.readdirSync(SYS).filter((f) => f.endsWith(".html")).map((f) => path.join(SYS, f)) : [];

/* ── the commands ── */
const args = new Set(process.argv.slice(2));
const rel = (f) => path.relative(ROOT, f);
if (args.has("--write")) {
  let n = 0;
  for (const f of pushedPages()) { const s = fs.readFileSync(f, "utf8"), t = filled(s); if (t !== s) { fs.writeFileSync(f, t); n++; } }
  console.log(`sally-chrome: wrote ${n} pushed page(s)`);
}
if (args.has("--js")) { fs.writeFileSync(JS_FILE, chromeJs()); console.log("sally-chrome: wrote", rel(JS_FILE)); }
if (args.has("--inject")) {
  let n = 0;
  for (const f of sysPages()) { const s = fs.readFileSync(f, "utf8"), t = injectChrome(s); if (t !== s) { fs.writeFileSync(f, t); n++; } }
  console.log(`sally-chrome: injected into ${n} page(s) of sally-system`);
}
if (args.has("--check")) {
  const bad = [];
  const pp = pushedPages();
  if (pp.length < 10) bad.push(`only ${pp.length} pushed pages carry markers (expected 10)`);
  for (const f of pp) { const s = fs.readFileSync(f, "utf8"); if (filled(s) !== s) bad.push(rel(f) + ": chrome differs from sally-chrome.mjs (run --write)"); }
  if (!fs.existsSync(JS_FILE) || fs.readFileSync(JS_FILE, "utf8") !== chromeJs()) bad.push(rel(JS_FILE) + ": stale (run --js)");
  for (const f of sysPages()) { const s = fs.readFileSync(f, "utf8"); if (injectChrome(s) !== s) bad.push(rel(f) + ": no chrome.js (run --inject)"); }
  if (bad.length) { console.error("sally-chrome: " + bad.length + " problem(s)\n  " + bad.join("\n  ")); process.exit(1); }
  console.log(`sally-chrome: ok — ${pp.length} pushed pages, chrome.js current, ${sysPages().filter((f) => /site-header\.js|class="email-frame"/.test(fs.readFileSync(f, "utf8"))).length} system pages injected`);
}
if (!args.size) console.log("usage: node scripts/lib/sally-chrome.mjs [--write] [--js] [--inject] [--check]");
