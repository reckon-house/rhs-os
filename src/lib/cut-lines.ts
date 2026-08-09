/* cutHeadline — shared, because two components now need the same cut.
 *
 * It was private to PressingCrossing. PressingBrief's crossing variation
 * needs the identical treatment, and a second copy of a function that
 * rebuilds an element's innerHTML from measured line boxes is a bug
 * waiting for one of them to be edited. Moved verbatim; nothing here has
 * changed but its address.
 */

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
