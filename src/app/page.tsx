import { PressingHome } from "@/components/home/PressingHome";

/* ── The homepage: the dealt field ──────────────────────────────────
   The pressing homepage — statement, the query set as a headline, and
   every project dealt into the field (see PressingHome and its lab spec,
   public/lab/pressing-home.html). Metadata and structured data live in
   layout.tsx, unchanged.

   The wrapper is the same ground pattern as PressingLayout: the content
   sits inside main's md:px-[50px] column, and the white paper paints
   from a breakout layer behind it so the gutters aren't cream strips.
   isolate scopes the layer's z-index; it creates only a stacking
   context, which sticky descendants (the masthead is a sibling, not a
   child) never see.

   The pre-redesign homepage (carousel, galaxy, thumb grid) is archived
   at tag site-v1; its components stay on disk for the classic category
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
