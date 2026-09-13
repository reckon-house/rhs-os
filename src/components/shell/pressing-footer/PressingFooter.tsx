"use client";

import { usePathname } from "next/navigation";
import { PressingHome } from "./PressingHome";

/* ── PressingFooter ─────────────────────────────────────────────────
   The site's tail, which is now only a case study's.

   A CASE STUDY ENDS AT THE HOMEPAGE. It has no contact beat and no
   credits under it: the scroll past its end goes to the board, the
   real homepage, rather than to a copy of it rebuilt below the study.
   That copy is what an earlier version of this file rendered, and a
   reader could not tell the two apart until the URL disagreed.

   EVERY OTHER PAGE ENDS WHERE IT ENDS. The old tail was three beats
   ported from the pre-board homepage (contact on ink, credits on ink,
   the old homepage's index on paper), and once the board took `/` it
   was the one piece of the old site still printed under the new one:
   under the daybook, the booking page, Staples, a thread, the custom
   page, a 404. The board carries contact and credits now, one press of
   the mark away.

   No wrapper element: PressingHome renders its own full-bleed section
   and manages its own ground, and an extra div here would be one more
   ancestor that could pick up a transform or an overflow clip. */

export function PressingFooter() {
  const pathname = usePathname();
  return pathname?.startsWith("/case-studies/") ? <PressingHome /> : null;
}
