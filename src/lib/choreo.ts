/**
 * Shared vocabulary for the Pressing C cross-section choreography — the
 * handoff where one section HOLDS on screen while the next climbs across
 * it. PinStage makes the hold, RisingPlate makes the climb, and these
 * constants keep the two halves agreeing on how much room the pass takes.
 * Ported from public/lab/swiss-spread.html (--rise / --plate-hold); the
 * values there are tuned, so change them here only with the prototype open.
 *
 * The neighbor contract, in plain language:
 *
 * - A held section and its climbing plate are ADJACENT siblings in the
 *   section list. The stage adds climb room to the page as an in-flow
 *   spacer AFTER its held content, and the plate pulls itself up by that
 *   same amount with a negative top margin of RISE. The two cancel out:
 *   the page gets no taller, the scroll distance is simply spent watching
 *   the plate cross the held screen instead of pushing it away.
 *
 * - RISE is both the overlap and the duration: it is how much of the held
 *   section the plate travels across. It sits just below one screen so the
 *   whole climb happens against held content — anything under a viewport
 *   spends the difference sliding with the page instead of across it. It
 *   must also stay UNDER the shortest pinned stretch on the page; a plate
 *   pulled up further than its neighbor actually holds starts climbing
 *   before the thing beneath it has stopped. (The prototype's shortest
 *   stretch measured 910px; nothing verifies this at runtime.)
 *
 * - PLATE_HOLD is a beat of stillness before the climb: the held section
 *   fully visible, the plate still below the fold. Without it the plate's
 *   top sits exactly on the held section's bottom edge and begins entering
 *   the moment the section lands, so the reader never sees it at rest.
 *   Kept SHORT deliberately — nothing moves during it, so every pixel is
 *   dead scroll. At 42vh it was a full trackpad swipe of stall. A beat,
 *   not a pause.
 *
 * - The plate keeps a TRANSPARENT background. At rest its image is scaled
 *   to 0.95, so the plate's box is bigger than the drawn image on all four
 *   sides; an opaque ground turns that difference into a frame around
 *   every plate. Transparent lets the held section show through instead,
 *   so the plate reads as a picture crossing the page, not a card laid on
 *   it. The image itself is opaque and does the covering.
 */

/**
 * dvh, not vh: the shell is h-dvh and the page scrolls inside <main>, so
 * 100vh overreaches by the mobile browser-chrome delta. A vh-sized rise
 * would make the climb room and the plate's pull-up disagree with the real
 * viewport exactly when the chrome collapses mid-scroll.
 */
export const RISE = "96dvh";

/** The beat of held, fully-visible content before a plate starts to climb. */
export const PLATE_HOLD = "13dvh";

/**
 * Below this width the choreography switches off entirely — there is no
 * room to stage a pass on a phone, so plates and stages just follow in
 * flow. Inclusive on the mobile side, matching the prototype's
 * `innerWidth <= 760`. The Tailwind `max-[760px]:` variants in PinStage
 * and RisingPlate hardcode the same number because arbitrary variants
 * cannot interpolate a constant; keep them in step with this.
 */
export const CHOREO_BREAKPOINT = 760;

/**
 * The flags a section data object carries to opt into the choreography.
 * The renderer reads them pairwise: a section with `pin` gets wrapped in
 * PinStage so the NEXT section can cross it; a section with `rise` renders
 * through RisingPlate and climbs its previous sibling; `hold` keeps the
 * PLATE_HOLD beat in the stage's spacer (drop it for sequences that carry
 * their own settling time, the way the prototype's cover did).
 */
export type ChoreoProps = {
  rise?: boolean;
  hold?: boolean;
  pin?: boolean;
};
