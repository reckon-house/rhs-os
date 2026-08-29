/* ── The index's hover, shared ────────────────────────────────────────
 *
 * Lifted VERBATIM from pressingHomeDriver.js, where it was generated
 * from the lab. Not rewritten and not re-derived: every number in here
 * was tuned against the prototype, and the project's own rule is that
 * a plausible argument for changing a tuned value is exactly how these
 * go wrong.
 *
 * WHY IT COULD MOVE AT ALL. It looks welded to the driver and is not:
 * a delegated pointerover/pointerout pair on the rows container that
 * reads --share off computed style, measures with getBoundingClientRect
 * and a Range, and writes four custom properties. No cards array, no
 * matcher, no measurement of the cover. Everything it needs is in the
 * DOM it is handed.
 *
 * WHY IT HAD TO. The growth is scale(var(--ix-grow)) paired with a
 * --drop that makes real room for it, and both are written here. The
 * ring in the footer never ran this, so it took the CSS fallback of
 * 1.32 with no --drop at all: every frame inflated a third while the
 * page made no room, covering its own caption and the row beneath. It
 * was pinned to a no-op as a stopgap. This is the real fix.
 *
 * The port replaces the lab's copy with an import of this file, so
 * there is one implementation and the lab still runs standalone.
 *
 * ONE VALUE LEFT ALONE ON PURPOSE: the `innerWidth > 760` gate. The
 * grid turns over at 860, so between 761 and 860 this arms over a
 * layout that has already collapsed. That is the homepage's current
 * behaviour, it is tuned, and changing it here would change the
 * homepage silently — which is the exact class of drift this whole
 * pass exists to end. Worth fixing in the lab, deliberately, as its
 * own change.
 */

export function armRows(rowsEl: HTMLElement) {
  if (rowsEl.dataset.armed) return;
  rowsEl.dataset.armed = "1";
  const GAP = 24;
  const live = () => innerWidth > 760 && matchMedia("(hover: hover)").matches;

  rowsEl.addEventListener("pointerover", (e: PointerEvent) => {
    const t = e.target as Element | null;
    const card = t && t.closest ? t.closest<HTMLElement>(".fd-it") : null;
    if (!card || !live()) return;
    const row = card.closest(".ixrow");
    const shot = card.querySelector<HTMLElement>(".shot");
    if (!row || !shot) return;
    /* OPEN TO THE COLUMN, not by a fixed factor. Every frame is
       `--share` of its half, so 1/share is exactly the scale that puts
       its right edge on the column's. A flat 1.32 made a 0.33 frame
       stop well short of the line and pushed an 0.86 one past it, so
       no two hovers agreed on how big "open" is. Now they all land on
       the same width, which is the width the standing rules draw. */
    const share =
      parseFloat(getComputedStyle(card).getPropertyValue("--share")) || 0.7;
    let grow = 1 / share;
    /* NO CAP. There used to be one, measured against the end of the
       card's own band, because the frame opens with a transform and a
       transform costs no layout — so the index sat still and got
       covered. Every frame whose band was shorter than its growth
       stopped early, and no two hovers opened to the same width again.
       Oakworks was the loudest case.

       The page makes room instead: the card takes --drop as real
       bottom margin, normal flow carries every row below it down, and
       the frame is free to reach the column whatever row it is in.

       It cannot flicker, which is the usual objection to moving the
       page under a pointer. The frame's origin is `right top`, so it
       only ever grows DOWN and LEFT and its top edge never leaves the
       cursor. What moves is the content below, away from it. */
    grow = Math.max(1.04, grow);
    card.style.setProperty("--ix-grow", grow.toFixed(3));
    const drop = shot.offsetHeight * (grow - 1);
    card.style.setProperty("--drop", drop.toFixed(1) + "px");
    /* THE LEAD FRAME IS OUT OF FLOW, so the bottom margin every other
       card uses to open the page under itself moves nothing at all —
       it just grew over the pair below it. Its push is handed to the
       first pair instead, which carries the rest of the index down on
       the same clock. */
    if (card.closest(".ixlead")) {
      rowsEl.style.setProperty("--lead-drop", drop.toFixed(1) + "px");
    }

    /* How far the name is from the right edge. Measured with a Range
       over the label's own contents, because the element is a full-
       width block and its rect would say zero — the Range reports the
       INK, which on a wrapped label is its widest line. */
    const lbl = card.querySelector<HTMLElement>(".lbl");
    const range = document.createRange();
    range.selectNodeContents(lbl!);
    const ink = range.getBoundingClientRect().width;
    /* MEASURED AGAINST THE OPENED FRAME, not against the label's own
       box. That box is only --share of the column — the width the
       picture has at REST — so a name travelling the slack inside it
       stopped a fraction of the way across and never reached the edge
       the picture had just opened to. The frame opens to
       shot.offsetWidth * grow, which is the column, so that is the
       distance the name has to cover. */
    const opened = shot.offsetWidth * grow;
    const slide = Math.max(0, opened - ink);
    /* THE NAME ALWAYS ENDS UP ON THE EDGE THE FRAME OPENS TOWARD. The
       left column's frames are hung on the rule beside the note rail
       and grow right, so their names start left and swing right; the
       right column's are hung on the page edge and grow left, so
       theirs do the opposite. Same measured distance, opposite sign —
       the label is right-aligned at rest there, so travelling
       backwards by the slack lands it on the left edge. */
    const cell = card.closest(".cell");
    const rightCol = Boolean(cell && cell.classList.contains("colR"));
    card.style.setProperty("--slide",
      (rightCol ? -slide : slide).toFixed(1) + "px");
    /* and anything to its left moves only as far as it must */
    const hr = shot.getBoundingClientRect();
    const openTo = hr.right - hr.width * grow;
    [...row.querySelectorAll<HTMLElement>(".fd-it")].forEach((other) => {
      if (other === card) return;
      const or = other.querySelector<HTMLElement>(".shot")!.getBoundingClientRect();
      if (or.right > hr.left + 1) return;          /* not to the left */
      const push = Math.max(0, or.right + GAP - openTo);
      other.style.transform = push
        ? "translateX(" + (-push).toFixed(1) + "px)" : "";
    });
  });

  rowsEl.addEventListener("pointerout", (e: PointerEvent) => {
    const t = e.target as Element | null;
    const card = t && t.closest ? t.closest<HTMLElement>(".fd-it") : null;
    if (!card) return;
    /* Same guard as the lab's: a pointerout into the card's own child
       is not a leave. Cast only — relatedTarget is EventTarget and
       contains() wants a Node. */
    if (e.relatedTarget && card.contains(e.relatedTarget as Node)) return;
    const row = card.closest(".ixrow");
    if (row) {
      row.querySelectorAll<HTMLElement>(".fd-it").forEach((c) => { c.style.transform = ""; });
    }
    card.style.removeProperty("--drop");
    card.style.removeProperty("--slide");
    card.style.removeProperty("--ix-grow");
    rowsEl.style.removeProperty("--lead-drop");
  });
}
