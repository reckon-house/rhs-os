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
import Link from "next/link";
import { projects } from "@/data/projects";
import { practiceNotes, practiceFilters } from "@/data/practice-notes";
import { imageDimensions } from "@/data/image-dimensions";
import { dealWidths, HOUSE_SEED } from "@/lib/deal";
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
      {/* The pinned column, exactly as the homepage keeps it. The
          filter's buttons are links here rather than live queries: the
          brain lives on the homepage, so a filter pressed from the
          tail of a case study carries its question there. */}
      <div className="ixnotes">
        {practiceNotes.map((n) => (
          <div className="blk" key={n.title}>
            <span className="tag">{n.title}</span>
            {n.quiet ? toned(n.body, n.quiet) : n.body}
          </div>
        ))}
        <div className="blk filt">
          <span className="tag">Filter</span>
          {practiceFilters.map(([label, query]) => (
            <Link key={label} href={`/?q=${encodeURIComponent(query)}`}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="ixrows">
        {ROWS.map((pair, r) => (
          <div className="ixrow" key={r}>
            {[0, 1].map((k) => {
              const p = pair[k];
              return (
                <div className="cell" key={k}>
                  {p ? (
                    <Frame project={p} share={SHARES[r * 2 + k]} lag={k ? "0.25s" : "0s"} />
                  ) : null}
                </div>
              );
            })}
            {/* The rule starts at the left frame's own left edge, which
                moves with the deal. Written as a calc rather than
                measured: the rule spans both cells plus the gap, so
                (100% - gap) / 2 IS one cell, and one cell times the
                share the frame did not take is exactly where its edge
                falls. No reflow, no resize listener. */}
            <div
              className="ixrule"
              style={{
                marginLeft: `calc((100% - var(--ixgap)) / 2 * ${(
                  1 - (SHARES[r * 2] ?? 1)
                ).toFixed(3)})`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** The authored recessive run, the same split the homepage makes. */
function toned(body: string, quiet: string) {
  const at = body.indexOf(quiet);
  if (at === -1) return body;
  return (
    <>
      {body.slice(0, at)}
      <span className="q">{quiet}</span>
      {body.slice(at + quiet.length)}
    </>
  );
}

function Frame({
  project,
  share,
  lag,
}: {
  project: (typeof projects)[number];
  share: number;
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
      style={{ "--share": String(share), "--lag": lag } as CSSProperties}
    >
      <span className="shot" style={{ "--ar": ar } as CSSProperties}>
        {/* The plate is what the curtain clips and what settles; the
            image is left alone. One element per animated property. */}
        <span className="plate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt="" loading="lazy" decoding="async" />
        </span>
      </span>
      <span className="lbl">
        {project.title}
        <span className="sub">{`  ${project.category}`}</span>
      </span>
    </Link>
  );
}
