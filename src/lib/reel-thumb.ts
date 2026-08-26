/* ── Where a cover reel's frames actually come from ──────────────────
 *
 * A reel plays into a box measured at 98 CSS pixels on a phone
 * (PressingCover.module.css: clamp(84px, 26vw, 130px) under 760) and at
 * most 170 on a desktop. The frames it was playing were the study's own
 * full-size plates, reused verbatim: 218 of them across 30 studies,
 * 192 MB, some 3080px wide feeding a box thirty times smaller. Every
 * one is fetched EAGERLY, because PressingCover measures each frame's
 * ratio with `new window.Image()` before it will mount the reel at all,
 * and a JS-constructed Image ignores loading="lazy".
 *
 * So each frame gets a thumbnail, and this is the one place that says
 * where it lives:
 *
 *   /case-studies/arc/kitchen.jpg  ->  /case-studies/arc/reel/kitchen.avif
 *
 * DERIVED, NOT DECLARED, and that is a deliberate trade. Writing the
 * thumbnail paths into all 30 data files would make them greppable, and
 * would also mean every future study has to remember. This way the data
 * keeps naming the actual photograph — which is what it means, and what
 * `npm run facts` reads for provenance — and the size is a rendering
 * concern settled in one function.
 *
 * The cost is that the generator and the renderer have to agree. They
 * agree by both importing THIS, so there is no second copy to drift.
 * `npm run reels -- --check` fails the build if a frame has no file.
 *
 * The subdirectory rather than a suffix keeps the long cache: the
 * header in next.config.ts matches /case-studies/:path*, and a sibling
 * folder is still inside it.
 */

/** Long enough for the largest box on the densest screen: 170 CSS px at
 *  DPR 3 is 510 device pixels, and everything else asks for less. */
export const REEL_THUMB_W = 512;

/** AVIF, because every frame measured has no alpha channel to lose and
 *  it beats JPEG by roughly half at this size. */
export const REEL_THUMB_EXT = "avif";

/**
 * The thumbnail path for a reel frame's source image.
 *
 * Total on the input: a src that is not an absolute /case-studies path
 * comes back unchanged, so an external or already-thumbnailed frame is
 * left alone rather than rewritten into a file that does not exist.
 */
export function reelThumb(src: string): string {
  if (!src.startsWith("/") || src.includes("/reel/")) return src;
  const cut = src.lastIndexOf("/");
  if (cut < 0) return src;
  const dir = src.slice(0, cut);
  const base = src.slice(cut + 1).replace(/\.[a-z0-9]+$/i, "");
  if (!base) return src;
  return `${dir}/reel/${base}.${REEL_THUMB_EXT}`;
}
