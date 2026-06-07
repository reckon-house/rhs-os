"use client";

import { useRef, useEffect, type CSSProperties } from "react";
import Link from "next/link";
import { type Project } from "@/data/projects";
import { thumbMotionVars } from "@/lib/thumb-motion";

export type BlotCorner = "tl" | "tr" | "bl" | "br" | "tl2" | "sl1" | "sl2" | "sr1" | "sr2";

// Ink-splatter masks (real flicked-ink SVGs in /public/masks). Each is a 225×225
// rounded card (rx 50) with the splatter overhanging ONE corner; bbox + the rect's
// top-left tell us how to seat the shape so its rounded rect lands exactly on the
// tile. The body stays a normal full-size thumbnail; the ink layer is the SAME photo
// masked to the whole shape, seated behind the body so only the splatter peeks past
// the corner. The ink layer is absolutely positioned → it never affects row layout.
const BLOT_RECT = 225;
const BLOT_RADIUS = `${(50 / BLOT_RECT) * 100}%`; // match the SVG rect's rounding
// ax,ay = where on the rounded rect the splatter emanates (0..1): corners use a corner,
// side masks use a mid-edge. Used for the grow-out transform origin.
const BLOT_GEOM: Record<BlotCorner, { file: string; bw: number; bh: number; rx: number; ry: number; ax: number; ay: number }> = {
  tl: { file: "top-left", bw: 327, bh: 335, rx: 102, ry: 110, ax: 0, ay: 0 },
  tr: { file: "top-right", bw: 316, bh: 325, rx: 0, ry: 100, ax: 1, ay: 0 },
  bl: { file: "bottom-left", bw: 320, bh: 334, rx: 95, ry: 0, ax: 0, ay: 1 },
  br: { file: "bottom-right", bw: 348, bh: 321, rx: 0, ry: 0, ax: 1, ay: 1 },
  tl2: { file: "top-left2", bw: 327, bh: 318, rx: 102, ry: 93, ax: 0, ay: 0 }, // alt top-left
  sl1: { file: "side-left1", bw: 329, bh: 283, rx: 104, ry: 8, ax: 0, ay: 0.5 }, // left edge
  sl2: { file: "side-left2", bw: 320, bh: 273, rx: 95, ry: 0, ax: 0, ay: 0.5 },
  sr1: { file: "side-right1", bw: 299, bh: 225, rx: 0, ry: 0, ax: 1, ay: 0.5 }, // right edge
  sr2: { file: "side-right2", bw: 303, bh: 273, rx: 0, ry: 0, ax: 1, ay: 0.5 },
};

// Mask assignment by GRID POSITION (not a content hash) so the blots spread spatially:
// even index → a left-side mask, odd → right-side, alternating down the grid, with the
// vertical (top / mid / bottom) varied within each side so nothing clusters.
const BLOT_ORDER = [
  "sallyOS", "ivyPark", "arc", "hillKitchen", "robertRod", "nordstromPersonal", "jeffreyNyc",
  "capitanBoot", "jeffreyCampaign", "hillBath", "nordstromBeauty", "oakworks", "cosmoProf", "dsc",
  "bwType", "hillLiving", "jChristianson", "amberShockey", "sallyBeauty", "jeffreyCampaign2",
  "fairviewSitting", "floorDecor", "fairviewBedroom", "fairviewFoyer", "nordstromFramework",
  "lovedByNordstrom", "mountainView", "neimanMarcus", "variousDesign",
];
const BLOT_LEFT: BlotCorner[] = ["tl", "sl1", "bl", "tl2", "sl2"];
const BLOT_RIGHT: BlotCorner[] = ["tr", "sr1", "br", "sr2"];
function cornerForIndex(i: number): BlotCorner {
  return i % 2 === 0 ? BLOT_LEFT[(i >> 1) % BLOT_LEFT.length] : BLOT_RIGHT[(i >> 1) % BLOT_RIGHT.length];
}
function seededCorner(id: string): BlotCorner {
  let i = BLOT_ORDER.indexOf(id);
  if (i < 0) { let h = 2166136261; for (let k = 0; k < id.length; k++) { h ^= id.charCodeAt(k); h = Math.imul(h, 16777619); } i = (h >>> 0) % 97; }
  return cornerForIndex(i);
}

// A small, stable per-thumbnail delay (0..~0.28s) so a row of sprays cascades in
// instead of every one firing at the same instant.
function blotDelay(id: string): number {
  let h = 2166136261;
  for (let k = 0; k < id.length; k++) { h ^= id.charCodeAt(k); h = Math.imul(h, 16777619); }
  return Math.round(((h >>> 0) % 1000) / 1000 * 28) / 100;
}

function BlotImage({ src, alt, corner, zoom = 1, delay = 0 }: { src: string; alt: string; corner: BlotCorner; zoom?: number; delay?: number }) {
  const g = BLOT_GEOM[corner];
  // The body shows the centre (1/zoom) of a WIDER source image; the spray is the SAME
  // source at the SAME scale, masked to the flecks-only shape, so it spills into the
  // photo's real surroundings — pixel-continuous, no zoomed-slice mismatch.
  const ew = g.bw / BLOT_RECT;
  const eh = g.bh / BLOT_RECT;
  const left = -(g.rx / BLOT_RECT);
  const top = -(g.ry / BLOT_RECT);
  // Grow-out origin: the point on the body where the splatter emanates (ax,ay are the
  // anchor on the rect, 0..1 — corner for corner masks, mid-edge for side masks), so
  // the ink looks like it's emerging from the thumbnail and spreading outward.
  const ox = (g.rx + g.ax * BLOT_RECT) / g.bw;
  const oy = (g.ry + g.ay * BLOT_RECT) / g.bh;
  const url = `/masks/${g.file}-ink.svg`;
  const inkRef = useRef<HTMLDivElement>(null);

  // Paint the spray's photo at the body's exact scale + centre, so the spill is a
  // seamless continuation of the body into the source's surroundings. Recompute on
  // resize (px-based for accuracy).
  useEffect(() => {
    const ink = inkRef.current;
    const card = ink?.parentElement;
    if (!ink || !card) return;
    const img = new window.Image();
    const place = () => {
      const t = card.clientWidth;
      const sw = img.naturalWidth;
      const sh = img.naturalHeight;
      if (!t || !sw || !sh) return;
      const base = Math.max(t / sw, t / sh) * zoom; // object-cover of the tile, zoomed
      const cw = sw * base;
      const ch = sh * base;
      ink.style.backgroundImage = `url("${src}")`;
      ink.style.backgroundRepeat = "no-repeat";
      ink.style.backgroundSize = `${cw}px ${ch}px`;
      // Centre the source on the tile, then offset by where the ink box sits.
      ink.style.backgroundPosition = `${t / 2 - cw / 2 - left * t}px ${t / 2 - ch / 2 - top * t}px`;
    };
    img.onload = place;
    img.src = src;
    if (img.complete) place();
    const ro = new ResizeObserver(place);
    ro.observe(card);
    return () => ro.disconnect();
  }, [src, zoom, left, top]);

  // data-in (which fires the CSS grow) is set by ThumbEnergy when the card first enters
  // the viewport — a reliable scroll-based trigger, since IntersectionObserver doesn't
  // fire against this nested .content-scroll container.

  return (
    <>
      {/* Back layer: spray = same photo, same scale → continuous into the surroundings.
          Masked to flecks-only, grows out of the body's corner. */}
      <div
        ref={inkRef}
        aria-hidden
        data-blot={corner}
        className="blot-ink pointer-events-none"
        style={{
          position: "absolute",
          zIndex: 0,
          width: `${ew * 100}%`,
          height: `${eh * 100}%`,
          left: `${left * 100}%`,
          top: `${top * 100}%`,
          transformOrigin: `${ox * 100}% ${oy * 100}%`,
          ["--blot-delay" as string]: `${delay}s`,
          WebkitMaskImage: `url(${url})`,
          maskImage: `url(${url})`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        } as CSSProperties}
      />
      {/* Front layer: body = centre crop of the same photo, clipped to the rounded tile. */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1, borderRadius: BLOT_RADIUS }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: `scale(${zoom})` }}
        />
      </div>
    </>
  );
}

// Shared thumbnail used on the homepage and the category pages: a full-size body with
// an ink-splatter spray + idle/scroll motion. Pass `blotIndex` to drive the mask choice
// by the thumbnail's position ON THIS PAGE (so each page spreads its own blots); omit it
// to fall back to the homepage grid order. blot/blotSrc/blotZoom override per-thumbnail.
export function Thumb({
  project,
  blot,
  blotSrc,
  blotZoom,
  blotIndex,
}: {
  project: Project;
  blot?: BlotCorner;
  blotSrc?: string;
  blotZoom?: number;
  blotIndex?: number;
}) {
  const m = thumbMotionVars(project.title);
  const corner = blot ?? (blotIndex != null ? cornerForIndex(blotIndex) : seededCorner(project.id));
  const src = blotSrc ?? `/images/thumbnails/${project.id}.jpg`;
  const inner = (
    <div className="thumb-float w-[130px] md:w-[160px]" style={m.float}>
      <div className="thumb-card" data-blot={corner} style={m.card}>
        <BlotImage src={src} alt={project.title} corner={corner} zoom={blotZoom ?? 1.2} delay={blotDelay(project.id)} />
      </div>
      <div className="text-center mt-2 md:mt-3">
        <p className="text-[10px] font-medium leading-[14px]">{project.title}</p>
        <p className="text-[10px] leading-[14px] text-foreground/50">{project.category}</p>
      </div>
    </div>
  );

  if (project.href) {
    return (
      <Link href={project.href} className="hp-thumb group block">
        {inner}
      </Link>
    );
  }
  return <div className="hp-thumb group cursor-default">{inner}</div>;
}
