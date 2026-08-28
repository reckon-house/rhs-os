"use client";

/* ── PressingRing ───────────────────────────────────────────────────
 * The work, rendered at the bottom of every page.
 *
 * This is what the ring actually means. A reader who finishes a case
 * study does not want a link home and does not want the top of what
 * they just read: they want the next thing. So the homepage's own body
 * simply continues below the footer. Nothing navigates, nothing waits
 * for a gesture, nothing has to be aimed at. You keep scrolling and
 * the work is there.
 *
 * WHY THIS IS NOT THE OLD All-work INDEX WEARING A NEW NAME. That one
 * was a second copy of a homepage that existed elsewhere, maintained
 * separately, with its own duplicate of the share ladder. This renders
 * from the app's real sources — projects.ts for the work,
 * image-dimensions.ts for the ratios, deal.ts for the widths — so
 * there is one list of projects on the site and one ladder, and the
 * bottom of a case study cannot drift from the front page.
 *
 * The class names are the homepage's own, deliberately: .ixrow, .cell,
 * .fd-it, .shot, .plate, .lbl. The stylesheet the port generates is
 * imported here rather than only by the homepage, so the same rules
 * dress both and there is no second definition to keep in step.
 *
 * It is the homepage's body, repeated. Not an edited version of it and
 * not a summary: the same notes column, the same filter, the same
 * rows, dressed by the same stylesheet. A reader who reaches the
 * bottom of a case study arrives at the front page, which is what a
 * ring is.
 */

import { useEffect, useRef, type CSSProperties } from "react";
import { plateSrcSet } from "@/lib/img-srcset";
import Link from "next/link";
import { projects } from "@/data/projects";
import { IndexRail } from "@/components/shell/IndexRail";
import { imageDimensions } from "@/data/image-dimensions";
import { dealWidths, HOUSE_SEED } from "@/lib/deal";
import { cellSpec, tileSizes } from "@/lib/index-cells";
import "@/components/home/pressing-home.css";

/* One deal for the tail, taken off the house seed so it is the same on
   every route and every reload. The homepage deals its own hand from
   the same ladder; these are siblings, not copies. */
const SHARES = dealWidths(projects.length, HOUSE_SEED + 11);

/* Consecutive pairs, which is the reading order the rows were built
   for: left then right, top to bottom. */
const ROWS: (typeof projects)[] = [];
for (let i = 0; i < projects.length; i += 2) ROWS.push(projects.slice(i, i + 2));

export function PressingRing() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  /* The curtain. Frames arrive clipped — .shot > * is inset to nothing
     until fd-on lands — which is the homepage's signature reveal and
     would otherwise leave this ring as a grid of labels over empty
     space, because the driver that normally adds the class is not
     running down here. Same observer, same threshold, same class.
     Reduced motion gets the frames outright. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const frames = Array.from(root.querySelectorAll<HTMLElement>(".fd-it"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frames.forEach((el) => el.classList.add("fd-on"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("fd-on");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
    );
    frames.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="ixbody" ref={rootRef}>
      {/* THE TWO STANDING HAIRLINES. They moved out of .ixrows into
          this pinned wrapper and .ixrows::before/::after were left at
          `background: none`, so a surface that does not render it
          draws no vertical structure at all. The ring did not, which
          is why the footer index had no rules while the homepage kept
          both. Same markup as PressingHome. */}
      <div className="ixrules" aria-hidden="true">
        <div className="ixrulesPin" />
      </div>

      {/* THE DRAWER RAIL, the same one the homepage carries. It used to
          be five stacked .blk blocks here — the retired design — while
          the homepage had moved to the drawer index. Both rule sets
          survive in the generated stylesheet, so neither surface
          looked broken; they were two designs sharing one page. One
          component now, in src/components/shell/IndexRail.tsx. */}
      <div className="ixnotes">
        <IndexRail />
      </div>

      {/* ixcols IS LOAD-BEARING BELOW 861px. `.ixrow, .ixlead {
          display: contents }` fires unconditionally down there, so the
          row's own box — and with it its row-gap and margin-bottom —
          is gone, while every rule that catches the freed cells is
          keyed `.ixrows.ixcols`. Without the class the phone grid, its
          gap and the per-cell separators all matched nothing and the
          tiles stacked flush. */}
      <div className="ixrows ixcols">
        {ROWS.map((pair, r) => (
          <div className="ixrow" key={r}>
            {[0, 1].map((k) => {
              const p = pair[k];
              /* A cell with no frame is not rendered at all. An empty
                 one draws its own separator and, having no order,
                 sorts ahead of real frames — the same reason the
                 driver dropped its placeholder. */
              if (!p) return null;
              const i = r * 2 + k;
              const spec = cellSpec(i, projects.length);
              return (
                <div className={spec.className} style={{ order: spec.order }} key={k}>
                  <Frame
                    project={p}
                    share={SHARES[i]}
                    tier={spec.className.split(" ").pop() as string}
                    lag={k ? "0.25s" : "0s"}
                  />
                </div>
              );
            })}
            {/* NO .ixrule. It is inert on desktop but takes a real 1px
                border below 861, and having no order it sorts between
                cells — which is why the driver removed it. The phone
                separator is the cell's own border-top now. */}
          </div>
        ))}
      </div>
    </div>
  );
}

function Frame({
  project,
  share,
  tier,
  lag,
}: {
  project: (typeof projects)[number];
  share: number;
  /** the cell's phone tier, which decides how much of the screen this
   *  picture actually occupies down there */
  tier: string;
  /** the right frame's curtain follows the left one in, so a row reads
   *  as one gesture with two beats rather than two shutters at once */
  lag: string;
}) {
  // strip any ?v= cache-bust before the lookup — the registry is keyed by
  // the clean path, while a project.image may carry a version query so a
  // recropped thumbnail defeats the immutable cache.
  const dim = imageDimensions[project.image.split("?")[0]];
  const ar = dim ? `${dim[0]} / ${dim[1]}` : "1";
  return (
    <Link
      href={project.href ?? "/"}
      className="fd-it k-work"
      aria-label={`${project.title}, ${project.category}`}
      /* --ix-grow: 1 PINS HOVER TO A NO-OP, deliberately and for now.
         The growth is scale(var(--ix-grow, 1.32)) paired with a --drop
         that makes room for it, and both are written by the driver's
         armRows, which does not run here. So the ring was inflating
         32% while the page made no room, covering its own caption and
         the row beneath. A still frame is better than half a gesture
         until armRows is lifted into lib alongside cellSpec. */
      style={
        {
          "--share": String(share),
          "--lag": lag,
          "--ix-grow": "1",
        } as CSSProperties
      }
    >
      <span className="shot" style={{ "--ar": ar } as CSSProperties}>
        {/* The plate is what the curtain clips and what settles; the
            image is left alone. One element per animated property. */}
        <span className="plate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            /* The all-work index sits in the footer of every non-home
               page: 18 tiles, and they were the homepage's full-size
               thumbnails at 1920px feeding a 344px slot. */
            srcSet={plateSrcSet(project.image)}
            /* From the cell's tier and the frame's dealt share, so the
               two surfaces ask for the same bytes for the same
               picture. The flat 30vw here carried a 760px breakpoint
               against a layout that turns over at 860. */
            sizes={tileSizes(tier, share)}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </span>
      </span>
      <span className="lbl">
        {project.title}
        <span className="sub">{`  ${project.category}`}</span>
      </span>
    </Link>
  );
}
