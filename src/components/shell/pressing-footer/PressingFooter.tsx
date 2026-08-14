"use client";

import { PressingContact } from "./PressingContact";
import { PressingCredits } from "./PressingCredits";
import { PressingReturn } from "./PressingReturn";

/* ── PressingFooter ─────────────────────────────────────────────────
   The site's tail, ported from the prototype's .fx-mast + .fx-index:
   three beats in order — contact on ink, credits on ink, then the whole
   portfolio on paper. The first two use the case study's own pinned
   pattern (the headline holds while its column travels up beside it),
   which is why they read as part of the same document rather than as
   chrome bolted underneath it.

   The third beat used to be the All-work index, suppressed on the
   homepage because printing the same thirty frames twice on one route
   was a directory stutter. Once the homepage BECAME that index the
   stutter moved: every case study was ending by reprinting the front
   page. So the tail states the loop instead of duplicating it, and the
   route check moved inside PressingReturn, which needs it anyway to
   know whether home is a link or the top of this page.

   No wrapper element around the beats. Each renders its own full-bleed
   section and manages its own ground, and an extra div here would be one
   more ancestor that could pick up a transform or an overflow clip and
   silently kill both sticky headlines. */

export function PressingFooter() {
  return (
    <>
      <PressingContact />
      <PressingCredits />
      <PressingReturn />
    </>
  );
}
