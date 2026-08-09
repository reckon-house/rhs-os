/* The crossing — one gesture, one definition.
 *
 * The headline's rendered lines are cut apart and dragged in from a full
 * viewport off to the right, staggered. Two components stage it —
 * PressingCrossing on its own pinned screen, PressingBrief under a
 * headline that then pins — and the only thing that should differ
 * between them is what happens AFTER the lines land.
 *
 * So the cut, the curve, the stagger and the travel all live here. They
 * drifted once already: the brief was written with an ease exponent of 3
 * against Robert's 1.6, which decelerates far harder — most of the
 * distance covered early, then a crawl. Same stagger, same distance,
 * visibly different move. A gesture used ONCE per study is met with a
 * long gap in between, which is exactly when a drifted curve stops
 * reading as the same thing.
 *
 * Numbers are the prototype's, tuned in public/lab/swiss-spread.html.
 */

/** Per-line progress lead. */
export const LINE_STAGGER = 0.13;
/** Ease-out exponent — 1 is linear, 2+ reads as played. */
export const LINE_EXP = 1.6;
/** The scroll the crossing spans, in viewports. Robert's pinned screen is
 *  220dvh and its progress runs over height − vh, which is this. */
export const LINE_SPAN_VH = 1.2;

export const lineEase = (t: number) => 1 - Math.pow(1 - t, LINE_EXP);

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * The offset for one line at overall progress `p`. The span is shortened
 * by the total stagger so the LAST line still finishes exactly at p = 1;
 * recomputed per call because the line count follows the rendered text,
 * not a constant.
 */
export function lineOffset(p: number, i: number, count: number, width: number) {
  const span = Math.max(1 - LINE_STAGGER * (count - 1), 0.0001);
  const lp = lineEase(clamp01((p - i * LINE_STAGGER) / span));
  return (1 - lp) * width;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");


/* Lays word spans in, reads which ones share an offsetTop, and rebuilds
   the element as one block per RENDERED line. Blocks are joined with a
   SPACE: it collapses away between blocks so nothing moves, but survives
   in textContent, which is what copy-paste, find-in-page and a screen
   reader actually read. (The prototype joined with "" and welded line
   boundaries; BodyReveal documents the fix — do not regress it.) */
export function cutHeadline(el: HTMLElement, src: string, lnClass: string): HTMLElement[] {
  el.innerHTML = src
    .split(" ")
    .map((w) => `<span data-hw>${esc(w)}</span>`)
    .join(" ");
  const groups: string[][] = [];
  let top: number | null = null;
  el.querySelectorAll<HTMLElement>("[data-hw]").forEach((w) => {
    const t = Math.round(w.offsetTop);
    if (t !== top) {
      groups.push([]);
      top = t;
    }
    groups[groups.length - 1].push(w.textContent ?? "");
  });
  el.innerHTML = groups
    .map((g) => `<span class="${lnClass}">${esc(g.join(" "))}</span>`)
    .join(" ");
  return Array.from(el.children) as HTMLElement[];
}
