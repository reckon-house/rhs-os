"use client";

import { usePathname } from "next/navigation";
import { PressingContact } from "./PressingContact";
import { PressingCredits } from "./PressingCredits";
import { PressingReturn } from "./PressingReturn";
import { PressingHome } from "./PressingHome";

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

   A CASE STUDY NOW HAS NO TAIL AT ALL. It ends, and the scroll past
   the end goes to the homepage — the real one, not the copy of it the
   ring was rendering below the footer. That copy is what this change
   is really about: a study ending in a rebuilt front page meant two
   objects to keep in step, and the reader could not tell them apart
   until the URL disagreed. Contact and credits went with it, which
   sounds like a loss and is not: they are on the homepage, which is
   now one deliberate push away from the end of every study.

   No wrapper element around the beats. Each renders its own full-bleed
   section and manages its own ground, and an extra div here would be one
   more ancestor that could pick up a transform or an overflow clip and
   silently kill both sticky headlines. */

export function PressingFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/case-studies/")) return <PressingHome />;

  return (
    <>
      <PressingContact />
      <PressingCredits />
      <PressingReturn />
    </>
  );
}
