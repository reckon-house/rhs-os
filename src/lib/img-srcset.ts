/* ── Asking for the size the screen can actually paint ───────────────
 *
 * Not one image on this site carried a srcset. Every phone downloaded
 * the file a desktop would: a 1920px billboard into 321 device pixels,
 * a 1600px app screen into 498. Roughly 10 MB of a scrolled homepage
 * and 14 MB of a case study was decoded and thrown away.
 *
 * THE OPTIMIZER WAS ALREADY THERE. next.config.ts has configured
 * deviceSizes and a 31-day cache TTL for it, and nothing on the site had
 * ever called it — every plate is a raw <img>. So this builds the
 * /_next/image URLs by hand and hangs them off the <img> that is already
 * rendering, rather than swapping in next/image.
 *
 * That choice is about risk, not taste. The pressing components size
 * their boxes from declared ratios and the scroll maths reads those
 * boxes; next/image brings its own wrapper, its own sizing and its own
 * loading behaviour, and 15 of those swaps is 15 chances to move a
 * number that something downstream is measuring. A srcset attribute on
 * the existing element moves nothing.
 *
 * Measured on dsc-owner-calendar-phone-hero.jpg, 1177 KB:
 *   w=640   55 KB      w=1600  340 KB
 *   w=1080 176 KB      w=2400  487 KB
 */

/** Every rung must exist in next.config.ts's `deviceSizes`, or the
 *  optimizer answers 400 rather than picking the nearest. These four
 *  bracket what the site actually renders: a plate needs ~1032 device
 *  pixels on a 390px phone and ~1036 on a 1600px desktop, with
 *  full-bleed heroes reaching 3188. */
export const PLATE_WIDTHS = [640, 1080, 1600, 2400] as const;

/* Every width next.config.ts allows, in order. The ladder above is the
   preferred set; this is what a source that falls BETWEEN two rungs
   gets to reach for. A 772px plate offered only `640w` is capped at 640
   for a slot that wants 1032 — worse than no srcset at all, because the
   file did have 772 to give. The nearest allowed size under its native
   width is 750, so that becomes its top rung. */
const ALLOWED = [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 2400, 3840] as const;

/** The quality must be in the allowed set too. Next 16 rejects anything
 *  not configured — q=70 answers `"q" parameter (quality) of 70 is not
 *  allowed`, which looks exactly like a broken URL until it is read. */
const Q = 75;

/**
 * A srcset for one plate, or undefined when there should not be one.
 *
 * Undefined in three cases, and each of them would otherwise render a
 * broken image rather than a large one:
 *
 *  · IN DEVELOPMENT. next.config.ts sets `unoptimized` under isDev to
 *    dodge a Next 16 dev-worker deadlock, so /_next/image is not
 *    serving. A srcset pointing at it would 404 every plate on the
 *    machine the site is built on.
 *  · WHEN THE SOURCE CARRIES A QUERY. The optimizer 400s on `?v=3`, and
 *    13 homepage entries carry one. The query is stripped rather than
 *    dropped from the ladder, because Vercel's CDN ignores `?v=` for
 *    cache-busting anyway — it never did the job it was added for.
 *  · WHEN THE FILE IS ALREADY SMALLER than the first rung. Asking for
 *    640 from a 500px source upscales it into a bigger file showing no
 *    more detail.
 *  · WHEN THE SOURCE IS AN SVG. The optimizer refuses them outright
 *    unless dangerouslyAllowSVG is set, so every rung answered 400 and
 *    the browser has no fallback: a srcset whose candidates all fail
 *    does NOT drop back to src, it fails the image. Measured on
 *    production, all five SVG marks in the credits ledger 400ed
 *    through the optimizer while their raw files served 200 — the five
 *    logos that would not appear on hover.
 *
 *    It hid in development because next.config.ts sets `unoptimized`
 *    under isDev, so the first rule above returns undefined and the
 *    raw src is used. Locally every mark worked; only production ever
 *    built the URLs that fail.
 *
 *    A srcset for an SVG was never worth having in any case: it is
 *    resolution independent, so one file serves every rung.
 */
export function plateSrcSet(src: string, nativeWidth?: number): string | undefined {
  if (process.env.NODE_ENV === "development") return undefined;
  if (!src.startsWith("/")) return undefined;

  const clean = src.split("?")[0];
  if (/\.svg$/i.test(clean)) return undefined;

  let rungs: number[] = [...PLATE_WIDTHS];
  if (nativeWidth) {
    rungs = PLATE_WIDTHS.filter((w) => w <= nativeWidth);
    /* THE TOP RUNG HAS TO REACH THE FILE'S OWN WIDTH. Filtering alone
       throws away everything between the last rung and the source: a
       772px plate keeps only 640w and is then permanently capped there,
       which is worse than shipping no srcset, because the browser would
       at least have used all 772. The nearest allowed width under
       native closes that gap. */
    const top = [...ALLOWED].reverse().find((w) => w <= nativeWidth);
    if (top && !rungs.includes(top)) rungs.push(top);
    rungs.sort((a, b) => a - b);
  }
  if (rungs.length === 0) return undefined;

  return rungs
    .map((w) => `/_next/image?url=${encodeURIComponent(clean)}&w=${w}&q=${Q} ${w}w`)
    .join(", ");
}

/**
 * What the browser needs to know to choose: how wide the plate will be,
 * in CSS pixels, before any image has loaded.
 *
 * Measured rather than guessed. On a 390px phone the large plates land
 * at 344 and 384 CSS px, which is 88-98vw; on a 1600px desktop the
 * column plates land at 518 and a bleed hero at 1594. Rounded outward
 * on purpose — over-asking by one rung costs a little bandwidth, and
 * under-asking costs sharpness, which is the whole point of the work.
 */
export function plateSizes(bleed?: boolean): string {
  return bleed ? "100vw" : "(max-width: 760px) 100vw, 50vw";
}
