"use client";

import { usePathname } from "next/navigation";
import { PressingContact } from "./PressingContact";
import { PressingCredits } from "./PressingCredits";
import { PressingIndex } from "./PressingIndex";

/* ── PressingFooter ─────────────────────────────────────────────────
   The site's tail, ported from the prototype's .fx-mast + .fx-index:
   three beats in order — contact on ink, credits on ink, then the whole
   portfolio on paper. The first two use the case study's own pinned
   pattern (the headline holds while its column travels up beside it),
   which is why they read as part of the same document rather than as
   chrome bolted underneath it.

   The All work index is suppressed on the homepage: the home's dealt
   field IS that index, promoted to the page itself, and the same thirty
   frames twice on one route is a directory stutter. Contact and credits
   still close the page there.

   No wrapper element around the beats. Each renders its own full-bleed
   section and manages its own ground, and an extra div here would be one
   more ancestor that could pick up a transform or an overflow clip and
   silently kill both sticky headlines. */

export function PressingFooter() {
  const pathname = usePathname();
  return (
    <>
      <PressingContact />
      <PressingCredits />
      {pathname === "/" ? null : <PressingIndex />}
    </>
  );
}
