#!/usr/bin/env node
/**
 * The byte half of the mobile baseline.
 *
 * WHY A SCRIPT AND NOT A LIGHTHOUSE RUN. Lighthouse's headline numbers move
 * with whatever else the machine is doing — the first pass of this baseline was
 * taken while five audit agents were running builds, and LCP read 2547ms
 * against 924ms on a quiet machine. Bytes on the wire do not care about load
 * average. They are the half of the picture that can be trusted from any
 * machine at any time, so they are the half that gets automated.
 *
 * CWV stays a browser job and is recorded separately. See PERF.md.
 *
 * Usage:
 *   node scripts/perf-baseline.mjs <capture.json> [--label "before"]
 *
 * capture.json is written from the browser and holds, per page, every resource
 * URL the page actually requested plus the display geometry of its images:
 *   { "pages": [ { "url": "...", "resources": ["..."],
 *                  "images": [ { "src": "...", "naturalW": 1600, "cssW": 166,
 *                                "dpr": 3, "lazy": true, "srcset": false } ] } ] }
 */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const MOBILE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

const args = process.argv.slice(2);
const capturePath = args.find((a) => !a.startsWith("--"));
const label = (() => {
  const i = args.indexOf("--label");
  return i === -1 ? "baseline" : args[i + 1];
})();

if (!capturePath) {
  console.error("usage: node scripts/perf-baseline.mjs <capture.json> [--label X]");
  process.exit(1);
}

const KB = (b) => b / 1024;
const MB = (b) => b / 1048576;

function kindOf(url) {
  if (/\.(jpe?g|png|webp|avif|gif)(\?|$)/i.test(url)) return "image";
  if (/\.svg(\?|$)/i.test(url)) return "svg";
  if (/\.(woff2?|otf|ttf)(\?|$)/i.test(url)) return "font";
  if (/\.css(\?|$)/i.test(url)) return "css";
  if (/\.js(\?|$)/i.test(url)) return "js";
  return "other";
}

/**
 * Bytes actually on the wire, brotli offered, cache bypassed.
 *
 * CURL, NOT fetch(). Node's fetch transparently decompresses and does not
 * expose the encoded length, so it reported this site's CSS at 164KB against a
 * real 33KB — a 5x over-count on every text asset, and an over-count is the
 * dangerous direction: it invents savings that were never there. curl WITHOUT
 * --compressed leaves the body encoded, so size_download is the wire figure.
 * Images are unaffected either way (already compressed, never transfer-encoded)
 * but the script has to be right about both or it cannot be trusted about one.
 */
function coldBytes(url) {
  try {
    const out = execFileSync(
      "curl",
      [
        "-s", "-o", "/dev/null", "--max-time", "45", "-L",
        "-w", "%{size_download} %{http_code} %{content_type}",
        "-H", `User-Agent: ${MOBILE_UA}`,
        "-H", "Accept-Encoding: br, gzip",
        "-H", "Cache-Control: no-cache",
        url,
      ],
      { encoding: "utf8", timeout: 50_000 }
    );
    const [bytes, status, ctype = ""] = out.trim().split(" ");
    return { ok: status.startsWith("2"), status: Number(status),
             bytes: Number(bytes) || 0, ctype };
  } catch (e) {
    return { ok: false, status: 0, bytes: 0, error: String(e).slice(0, 60) };
  }
}

/** Bounded concurrency: politeness to the CDN, and steadier numbers. */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    })
  );
  return out;
}

const capture = JSON.parse(readFileSync(capturePath, "utf8"));
const report = { label, when: new Date().toISOString(), pages: [] };

for (const page of capture.pages) {
  const urls = [...new Set(page.resources)];
  const sized = await mapLimit(urls, 6, async (u) => ({ url: u, ...coldBytes(u) }));
  const doc = coldBytes(page.url);

  const byType = {};
  for (const r of sized) {
    const k = kindOf(r.url);
    const a = (byType[k] ??= { n: 0, bytes: 0 });
    a.n += 1;
    a.bytes += r.bytes;
  }
  const total = doc.bytes + sized.reduce((s, r) => s + r.bytes, 0);

  /* OVERSCALE IS THE WHOLE IMAGE STORY. A file is only as useful as the pixels
     the screen can show. natural width over (css width x dpr) is how many times
     more image was sent than the device could ever paint; 1.0 is exact, 3.0
     means two thirds of those bytes were thrown away on decode. */
  const over = (page.images ?? [])
    .filter((i) => i.naturalW && i.cssW)
    .map((i) => ({
      src: i.src,
      ratio: +(i.naturalW / (i.cssW * (i.dpr || 1))).toFixed(2),
      naturalW: i.naturalW,
      shownAt: Math.round(i.cssW * (i.dpr || 1)),
      bytes: sized.find((r) => r.url.endsWith(i.src))?.bytes ?? 0,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  const wasted = over.reduce(
    (s, i) => s + (i.ratio > 1 ? i.bytes * (1 - 1 / (i.ratio * i.ratio)) : 0),
    0
  );

  report.pages.push({
    url: page.url,
    documentBytes: doc.bytes,
    totalBytes: total,
    byType,
    imageCount: (page.images ?? []).length,
    withSrcset: (page.images ?? []).filter((i) => i.srcset).length,
    lazy: (page.images ?? []).filter((i) => i.lazy).length,
    overscaleTop: over.slice(0, 10),
    estimatedWastedImageBytes: Math.round(wasted),
    heaviest: sized.sort((a, b) => b.bytes - a.bytes).slice(0, 10)
      .map((r) => ({ url: r.url.replace(/^https?:\/\/[^/]+/, ""), bytes: r.bytes })),
  });
}

/* ── the report ── */
const pad = (s, n) => String(s).padEnd(n);
console.log(`\n  MOBILE BYTE BASELINE — ${label}   ${report.when.slice(0, 16).replace("T", " ")}\n`);
for (const p of report.pages) {
  console.log(`  ${p.url}`);
  console.log(`  ${"─".repeat(Math.min(72, p.url.length + 2))}`);
  console.log(`    ${pad("document", 12)} ${KB(p.documentBytes).toFixed(1).padStart(9)} KB`);
  for (const [k, v] of Object.entries(p.byType).sort((a, b) => b[1].bytes - a[1].bytes)) {
    console.log(`    ${pad(k, 12)} ${KB(v.bytes).toFixed(1).padStart(9)} KB   ${v.n} requests`);
  }
  console.log(`    ${pad("TOTAL", 12)} ${MB(p.totalBytes).toFixed(2).padStart(9)} MB`);
  console.log(
    `    images: ${p.imageCount}, lazy ${p.lazy}, with srcset ${p.withSrcset}` +
      `  |  est. wasted to overscale: ${MB(p.estimatedWastedImageBytes).toFixed(2)} MB`
  );
  if (p.overscaleTop.length) {
    console.log(`    worst overscale (natural px vs px the screen can show):`);
    for (const o of p.overscaleTop.slice(0, 5)) {
      console.log(
        `      ${String(o.ratio + "x").padStart(6)}  ${String(o.naturalW).padStart(5)}w -> ` +
          `${String(o.shownAt).padStart(4)}w  ${KB(o.bytes).toFixed(0).padStart(5)} KB  ` +
          o.src.split("/").pop().slice(0, 44)
      );
    }
  }
  console.log();
}

const grand = report.pages.reduce((s, p) => s + p.totalBytes, 0);
console.log(`  across ${report.pages.length} pages: ${MB(grand).toFixed(2)} MB\n`);

if (args.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
}
