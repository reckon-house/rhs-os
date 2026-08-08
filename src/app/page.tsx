import { PressingHome } from "@/components/home/PressingHome";

/* ── The homepage ───────────────────────────────────────────────────
   The ring: a question field that travels into the masthead, and the
   All-work index promoted from the footer to be the page's own body.
   A case study ends at that index and home begins at it, so a reader
   who scrolls to the bottom of anything arrives back at the start.

   The design lives at public/lab/pressing-home.html, which is a
   runnable spec rather than a mockup: PressingHome imports that page's
   stylesheet and its driver directly. Tune there, re-port, never fork.

   The full-bleed wrapper is the same ground pattern as PressingLayout.
   The content sits inside main's md:px-[50px] column, and the paper
   paints from a breakout layer behind it so the gutters are not cream
   strips. isolate scopes that layer's z-index; it creates only a
   stacking context, which sticky descendants (the masthead is a
   sibling, not a child) never see.

   Metadata and structured data live in layout.tsx, unchanged. The
   pre-redesign homepage (carousel, galaxy, thumb grid) is archived at
   tag site-v1; its components stay on disk for the classic category
   pages. */

export default function HomePage() {
  return (
    <div
      className="pressing isolate relative w-full"
      style={{ background: "transparent" }}
    >
      <div
        aria-hidden
        className="hero-breakout absolute top-0 bottom-0 -z-10"
        style={{ background: "var(--pp-paper)" }}
      />
      <PressingHome />
    </div>
  );
}
