"use client";

/* ── HoverPlate ─────────────────────────────────────────────────────
 * The evidence, on approach. A daybook row that points at a study shows
 * that study's own thumbnail when the pointer rests on it — the same
 * picture the homepage grid deals, floating in the empty right half of
 * the ledger row.
 *
 * Everything comes from the app's real sources: projects.ts for the
 * frame, image-dimensions.ts for the ratio. Nothing is authored per
 * entry, so every row that links a study gets its specimen for free and
 * a new thumbnail on the homepage is a new thumbnail here.
 *
 * Pointer surfaces only. On touch there is no hover to earn it, and the
 * plate is pointer-events: none everywhere — it is a preview, not a
 * target; the row's own link is the target.
 */

import { projects } from "@/data/projects";
import { plateSrcSet } from "@/lib/img-srcset";
import { imageDimensions } from "@/data/image-dimensions";
import styles from "./hover-plate.module.css";

const BY_HREF = new Map(projects.map((p) => [p.href, p]));

export function HoverPlate({ href, on }: { href: string; on: boolean }) {
  const p = BY_HREF.get(href);
  if (!p) return null;
  const dim = (imageDimensions as Record<string, [number, number]>)[
    p.image.split("?")[0]
  ];
  return (
    <span
      className={`${styles.plate} ${on ? styles.on : ""}`}
      aria-hidden="true"
      style={dim ? { aspectRatio: `${dim[0]} / ${dim[1]}` } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.image}
        srcSet={plateSrcSet(p.image)}
        sizes="clamp(170px, 15vw, 230px)"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
