"use client";

/**
 * PressingZoomPlate — the pinned zoom object plate, ported from the
 * .zoomwrap system in public/lab/swiss-spread.html.
 *
 * A sticky 100dvh screen; the wrap's height is written by the driver to
 * cover one viewport + a grow phase (1.1 viewports of scroll) + a 1:1 pan
 * through whatever image hangs below the fold. The figure starts as a
 * matted object in the right grid column, then scrubs translate/scale to
 * full-bleed width parked under the masthead, the corner easing to 0 (the
 * written radius is pre-divided by the current scale, because transform
 * scales border-radius along with everything else), and finally pans the
 * spill. Progress comes straight from how far the viewport has travelled
 * through the wrap — no timers, fully scrubbed, so it runs backwards for
 * free.
 *
 * The apparatus — plate numeral, caption block, instruction line — renders
 * as plain ink that the driver knocks OUT over the plate's rectangle each
 * frame: four half-plane gradient masks unioned by mask-composite: add,
 * which is every pixel outside the plate's rect. Behind the ink sits an
 * always-on backdrop-filter burn layer masked to the exact letterforms by
 * an SVG text-node mask mirroring the DOM text (computed font copied,
 * baseline corrected against getBBox and Range rects, resynced on resize
 * and fonts.ready). The mask is INLINE svg, not a data-URI — a data-URI
 * mask is an isolated document that cannot see the page's fonts, so every
 * glyph would silently render in a fallback face and stop matching. If any
 * part of that construction fails, the component falls back to plain ink:
 * no knockout, no burn, the text simply sits on the plate.
 *
 * Scroll architecture: the page scrolls inside <main> (Lenis, wrapper
 * mode), so all scrub math is getBoundingClientRect vs the viewport and the
 * per-frame work subscribes to the shared driver in src/lib/scrub. Sticky
 * dies under any transformed, filtered, or overflow-clipping ancestor —
 * mount this in plain flow. Below 760px and under reduced motion the pin
 * and the zoom are off entirely (see the module CSS): static figure,
 * numeral and captions as plain ink, in flow.
 */

import { Fragment, useEffect, useId, useRef } from "react";
import { onTick, vh } from "@/lib/scrub";
import { CHOREO_BREAKPOINT } from "@/lib/choreo";
import { usePinDrift } from "@/lib/pin-drift";
import { SectionMark } from "@/components/fx/SectionMark";
import styles from "./PressingZoomPlate.module.css";

export type PressingZoomPlateProps = {
  src: string;
  alt: string;
  /** The big plate numeral, as authored — "01", "07". */
  plate: string;
  /** The small caption block; each entry is one rendered line. */
  captionLines: string[];
  /** The mono instruction line under the captions, e.g. the scroll cue. */
  instruction?: string;
  /** Optional section mark, scrubbed from the zoom wrap's own travel. */
  mark?: { n: string; name: string };
  /**
   * Reserve the climb room a RISING next sibling needs. Only true when the
   * section that follows actually rises: the tail is the ruler for that
   * plate's climb, and with nothing climbing it is pure dead pin — the
   * screen holds for another screenful after the zoom has already finished.
   * The prototype makes exactly this distinction: its first zoom wrap has
   * no tail, its second (followed by the gallery plate) does.
   */
  reserveRise?: boolean;
  /** "contain" grows the plate only until the WHOLE frame fits the mat,
   *  so nothing leaves the screen. Default fits the width and pans the
   *  overflow through. See ChoreoBag.zoomFit. */
  fit?: "contain";
  /**
   * Intrinsic pixel size from the image-dimensions manifest. Load-bearing
   * for scroll feel, not just CLS: the driver sizes the wrap from the
   * figure's measured box, and without a known ratio that measurement
   * jumps when the lazy image arrives — the wrap shrinks mid-scroll,
   * which eats the scroll delta and reads as the plate sticking on entry.
   * The prototype never had this because its images were all eager.
   */
  width?: number;
  height?: number;
  /** Load the image eagerly — for the first plate after the cover. */
  eager?: boolean;
};

/**
 * The masthead's height, read from the one shared token (--nav-h on :root,
 * 54px desktop / 48px below the breakpoint). The plate's top edge parks at
 * this line, and the pan window is the viewport minus it. Read at measure
 * time, not module time — the token is responsive.
 */
function mastheadH(): number {
  const v = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
  );
  return Number.isFinite(v) ? v : 54;
}

/** The melt pump, verbatim from the prototype's .num-burn rule. */
const BURN_PUMP = "blur(0.6px) saturate(4.6) contrast(2.2)";

const NS = "http://www.w3.org/2000/svg";

const clamp01 = (k: number) => (k < 0 ? 0 : k > 1 ? 1 : k);
/** Gentle at both ends — the prototype's smoothstep. */
const smooth = (k: number) => k * k * (3 - 2 * k);

/**
 * One entry per rendered line. The captions break on explicit <br>, so the
 * text nodes ARE the lines — no need to infer wrapping.
 */
function lineNodes(el: HTMLElement): Text[] {
  const out: Text[] = [];
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  while ((n = walk.nextNode())) {
    if ((n.nodeValue ?? "").trim()) out.push(n as Text);
  }
  return out;
}

type BurnItem = {
  ink: HTMLElement;
  burn: HTMLDivElement;
  mask: SVGMaskElement;
  texts: SVGTextElement[];
};

export function PressingZoomPlate({
  src,
  alt,
  plate,
  captionLines,
  instruction,
  mark,
  width,
  height,
  eager = false,
  reserveRise = false,
  fit,
}: PressingZoomPlateProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLElement>(null);
  /** Holds the resting plate's space in the grid; see .slot in the CSS. */
  const slotRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLParagraphElement>(null);
  const instrRef = useRef<HTMLParagraphElement>(null);

  /* True only while the burn apparatus is built and healthy. The zoom tick
     reads it per frame: with it false the ink is never knocked out, which
     IS the plain-ink fallback — nothing else to switch. */
  const burnOkRef = useRef(false);

  /* The screen keeps creeping while it holds, so engaging the pin reads as
     a deceleration rather than the page hitting a wall. Safe on the sticky
     box itself — the zoom writes its transforms to the FIGURE, and the ink
     knockout re-measures against live rects every frame, so both follow the
     drift instead of fighting it. */
  usePinDrift(wrapRef, stickyRef);

  /* useId's delimiters (":" or the fancy quotes React 19 uses) are not safe
     inside a CSS url(#...) reference, so they are stripped; the digits that
     make the id unique survive. */
  const meltId = "ppMelt" + useId().replace(/[^a-zA-Z0-9_-]/g, "");

  /* Content key so both effects rebuild when the authored text changes,
     without re-running on every parent render from a fresh array literal. */
  const captionKey = captionLines.join("\n");

  /* ── the zoom ────────────────────────────────────────────────────────
     Ported whole from the prototype's zoom driver, one instance per wrap. */
  useEffect(() => {
    const wrap = wrapRef.current;
    const sticky = stickyRef.current;
    const fig = figRef.current;
    const img = imgRef.current;
    const tail = tailRef.current;
    const slot = slotRef.current;
    if (!wrap || !sticky || !fig || !img) return;

    const inkEls: HTMLElement[] = [
      numRef.current,
      capRef.current,
      instrRef.current,
    ].filter((el): el is NonNullable<typeof el> => el !== null);

    const narrow = window.matchMedia(`(max-width: ${CHOREO_BREAKPOINT}px)`);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* Read from the token rather than hard-coding — the prototype's rule.
       --pp-r has no breakpoint override, so once is enough. It resolves on
       the figure through the .pressing article scope. */
    const baseR =
      parseFloat(getComputedStyle(fig).getPropertyValue("--pp-r")) || 16;

    /* The figure's untransformed box, measured relative to its sticky
       screen. That offset is layout-stable no matter where the scroll is,
       so it only needs re-measuring on resize (and once the image has real
       dimensions — height: auto means the box is wrong before load). */
    let box: { x: number; y: number; w: number; h: number } | null = null;
    /* The RESTING box, read off the .slot element that holds its place in
       the grid. The plate itself is laid out full-bleed (see the module
       CSS) and scaled down onto this, which is what keeps the raster
       honest — nothing here is ever magnified. */
    let rest = { x: 0, y: 0, w: 0, h: 0 };
    /* Scale at rest (< 1, a minify) and at park (1, or less under
       `contain`). The old code ran 1 → widthFit, magnifying as it went. */
    let s0 = 1;
    let endScale = 1;
    let parkX = 0;
    let spill = 0;
    /* Where the plate's TOP edge parks, in sticky coords. Width-fit
       plates park under the masthead and pan down from there; a
       contained plate centres in the viewport instead. */
    let parkY = 0;
    let zoomPx = 0;
    let panPx = 0;
    /* How far the apparatus has to rise to sit ON the parked plate.
       Zero whenever the plate covers the screen, which is every window
       the plate was tuned against, so this changes nothing there. */
    let apparLift = 0;

    let wrote = false;
    /* the inline will-change currently written; "" means the class rules */
    let wcNow = "";
    const invalidate = () => {
      box = null;
    };
    window.addEventListener("resize", invalidate);
    img.addEventListener("load", invalidate);

    const measure = () => {
      fig.style.transform = "none";
      /* measure() itself WRITES (the probe transform and the wrap height),
         so it must arm the hand-back latch: a plate measured below the fold
         at desktop width, then flipped to mobile or reduced motion, would
         otherwise keep a multi-thousand-px inline height that overrides the
         static layout. */
      wrote = true;
      /* The slot carries no intrinsic height of its own, so without a
         declared ratio it collapses and the resting plate has nothing to
         centre against. Declared dimensions cover every registered image;
         this is the fallback for one that loaded without them. */
      if (slot && !slot.style.aspectRatio && img.naturalWidth && img.naturalHeight) {
        slot.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
      }
      const f = fig.getBoundingClientRect();
      const s = sticky.getBoundingClientRect();
      box = { x: f.left - s.left, y: f.top - s.top, w: f.width, h: f.height };
      if (slot) {
        const sl = slot.getBoundingClientRect();
        rest = { x: sl.left - s.left, y: sl.top - s.top, w: sl.width, h: sl.height };
      } else {
        rest = { x: box.x, y: box.y, w: box.w, h: box.h };
      }
      /* A minify, always: the plate is laid out at the size it ENDS at. */
      s0 = box.w > 0 ? rest.w / box.w : 1;

      /* Full-bleed; the mat height excludes the masthead so the plate's top
         edge parks just beneath the bar rather than behind it. */
      const MASTHEAD = mastheadH();
      const matH = vh() - MASTHEAD;
      /* Fit the WIDTH rather than covering the box. Nothing is cropped —
         any height beyond the fold becomes something to scroll through
         instead of something thrown away. A landscape plate spills barely
         anything and so pins for much less scroll than a portrait one.

         Which is exactly where that premise breaks, and why `contain`
         exists. A landscape frame spills only a little, so the pan is
         over before the eye reads it as a pan, and what registers is
         the bottom of the picture being cut. `contain` grows the plate
         until the WHOLE frame fits instead: no spill, no pan, nothing
         off screen.

         And it fits against the FULL viewport, not the mat. The mat
         gives up the masthead's strip so a tall plate's top edge lands
         below the bar rather than behind it — but a plate that fits
         the screen entirely has no top edge to protect, and charging
         it that strip is what made the first contain pass park short
         of BOTH side edges: it ran out of height before it ran out of
         width and stopped with paper showing either side. Measured
         against the whole screen a 1.625 frame fills the width with
         height to spare, so it parks edge to edge, centred, whole. */
      /* The plate is ALREADY the viewport's width at rest in layout terms,
         so a width fit is scale 1 — there is no growing past the raster.
         `contain` still shrinks below that when the whole frame has to
         stay on screen. */
      if (fit === "contain") {
        endScale = Math.min(1, vh() / box.h);
        spill = 0;
        /* centred: the masthead floats over the picture rather than
           pushing it down, which is what a full-bleed frame wants */
        parkY = (vh() - box.h * endScale) / 2;
      } else {
        endScale = 1;
        spill = Math.max(0, box.h * endScale - matH);
        parkY = MASTHEAD;
      }
      /* A contained plate is narrower than the screen and centres; a
         width-fit plate starts at the viewport's left edge. */
      parkX = (window.innerWidth - box.w * endScale) / 2;

      /* THE APPARATUS RIDES THE PLATE, and only when it has to.
         The numeral and captions are grid-anchored to the sticky's
         bottom padding edge, and the knockout only masks ink where the
         plate actually reaches it. That holds while a parked plate
         covers the screen, which it does on any window close to the
         proportions this was tuned against. It stops holding on a TALL
         window: a landscape plate fits the width and runs out of height,
         so it parks with paper below it and the text lands on the paper
         as plain ink. Measured at 1153x1400 — a 3840x2363 plate parks
         710px tall in a 1400px screen and leaves 761px of paper, with
         the numeral and both caption lines sitting in it.
         So the apparatus rises by whatever the plate fails to cover.
         Zero when it covers, which is why nothing moves on the windows
         that already read correctly. */
      const padB = parseFloat(getComputedStyle(sticky).paddingBottom) || 0;
      const innerBottom = sticky.getBoundingClientRect().height - padB;
      apparLift = Math.max(0, innerBottom - (parkY + box.h * endScale));

      zoomPx = vh() * 1.1; // scroll spent growing the plate
      /* The pan used to be 1:1 — one pixel of scroll for one of image —
         which is right for a tall frame with hundreds of pixels hanging
         below the fold. A LANDSCAPE frame spills barely anything: on a
         wide, short laptop a 1.625 picture overshoots by around 150px,
         and at 1:1 that whole reveal is over in 150px of scroll. It
         never registers as a pan. What registers is a picture with its
         bottom cut off, which is exactly the complaint this plate has
         collected twice.
         So the pan gets a FLOOR: however small the spill, it is spread
         over at least half a viewport of scrolling. Big spills keep
         their 1:1 honesty; small ones finally read. */
      panPx = spill > 0 ? Math.max(spill, vh() * 0.5) : 0;

      /* A wrap that a plate climbs over needs room for that climb ON TOP
         of its own sequence; without it the following plate enters before
         the sequence has finished. zp and pp key off zoomPx/panPx, not
         this height, so the zoom keeps its tuning exactly. */
      const tailH = tail ? tail.offsetHeight : 0;
      wrap.style.height = vh() + zoomPx + panPx + tailH + "px";
    };

    const clearWrites = () => {
      fig.style.transform = "";
      fig.style.borderRadius = "";
      fig.style.willChange = "";
      wrap.style.height = "";
      sticky.style.removeProperty("--zp-lift");
      for (const el of inkEls) {
        el.style.maskImage = "";
        el.style.removeProperty("-webkit-mask-image");
      }
    };

    const off = onTick(() => {
      /* Checked per tick, not once: both can flip mid-session, and a stale
         transform left behind is a plate frozen mid-zoom. The CSS state
         under these media queries is the whole mobile/reduced design, so
         clearing the inline writes is the entire hand-back. */
      if (narrow.matches || reduce.matches) {
        if (wrote) {
          wrote = false;
          clearWrites();
          box = null;
        }
        return;
      }
      /* The VisibilityPause convention. The shared loop in scrub.ts already
         parks itself on data-paused; this keeps the component correct even
         if it is ever rewired to a driver that does not. */
      if (document.documentElement.hasAttribute("data-paused")) return;

      if (!box) measure();
      const r = wrap.getBoundingClientRect();
      /* Skip a wrap nowhere near the viewport — no reason to write
         transforms for a screen that cannot be seen. */
      if (r.bottom < 0 || r.top > vh()) return;
      const scrolled = -r.top;

      /* Two phases off one scroll position: grow, then travel the image. */
      const zp = clamp01(scrolled / zoomPx);
      const pp = clamp01((scrolled - zoomPx) / Math.max(panPx, 1));
      const e = smooth(zp);
      const b = box!;

      /* Origin is top-LEFT, so translate steers the plate's top-left corner
         from the slot to its park position while the scale runs from the
         resting minify up to 1. Written as "where the corner should be,
         minus where layout already put it", which cancels the sticky's
         padding without needing to know about it. The pan then slides a
         tall frame up through the mat window. */
      const tx = (rest.x * (1 - e) + parkX * e) - b.x;
      const ty = (rest.y * (1 - e) + parkY * e) - b.y - spill * pp;

      const cur = s0 + (endScale - s0) * e;
      /* THE RASTER RELEASE. will-change pins the layer's raster to the
         scale it had when promoted, which is the plate at rest in its
         column, so the grown plate is that small bitmap magnified 2x:
         the 3840px source never gets decoded past the 660px box and the
         full-bleed frame ships about half its device pixels. The eye
         forgives it while the plate is MOVING; parked, it reads as a
         soft image, which for a while looked like a bad source file.
         So: the hint stays on while the plate is between states, and
         comes OFF whenever it parks (rest, full bleed, or pan done).
         Dropping the hint lets Chrome re-raster at the settled scale,
         and scrubbing back re-promotes from that sharper bitmap, so the
         shrink direction only ever minifies. Written on change, not per
         tick — rewriting the same value would re-promote every frame
         and never release anything. */
      const settled = zp <= 0 || (zp >= 1 && (panPx === 0 || pp <= 0 || pp >= 1));
      const wcNext = settled ? "auto" : "";
      if (wcNext !== wcNow) {
        wcNow = wcNext;
        fig.style.willChange = wcNext;
      }
      fig.style.transform =
        "translate(" + tx.toFixed(2) + "px, " + ty.toFixed(2) + "px) scale(" + cur.toFixed(4) + ")";
      /* The corner sharpens as the plate fills: --pp-r at rest, 0 once it
         is edge to edge. Divided by `cur` because transform scales
         border-radius along with everything else, so this is the pre-scale
         number that LOOKS like baseR * (1 - e) on screen. */
      fig.style.borderRadius = ((baseR * (1 - e)) / cur).toFixed(2) + "px";

      /* Ramped on the SAME e the plate grows on, so at rest the lift is
         zero and the resting composition is untouched, and by the time
         the plate has parked the ink is sitting on it. Written on the
         sticky as one variable: the ink and the burn layers under it
         both read it, which keeps them in lockstep without re-running
         the burn's sync (that only fires on resize and font swap, so a
         transform on the ink alone would slide the two apart).
         Set BEFORE the knockout is measured below — that reads live
         rects, and a stale one would knock the ink out at the position
         it no longer occupies. */
      sticky.style.setProperty("--zp-lift", (-apparLift * e).toFixed(1) + "px");
      wrote = true;

      /* Knock the ink out exactly where the plate has reached it. Four
         half-plane gradients — left of, right of, above, below the plate —
         unioned by mask-composite: add: every pixel OUTSIDE the plate's
         rect. The burn underneath is always on, so whatever this reveals
         is already burning; the edge between ink and burn is the plate's
         own edge, not a fade and not a switch. Skipped entirely when the
         burn failed to build — plain ink is the fallback, and a knockout
         without a burn would just erase the text.
         Read AFTER the transform is written, or the rect is a frame stale. */
      if (burnOkRef.current) {
        const fr2 = fig.getBoundingClientRect();
        for (const el of inkEls) {
          const nr = el.getBoundingClientRect();
          const L = (fr2.left - nr.left).toFixed(1);
          const R = (fr2.right - nr.left).toFixed(1);
          const T = (fr2.top - nr.top).toFixed(1);
          const B = (fr2.bottom - nr.top).toFixed(1);
          const m =
            "linear-gradient(to right,#000 " + L + "px,transparent " + L + "px)," +
            "linear-gradient(to right,transparent " + R + "px,#000 " + R + "px)," +
            "linear-gradient(to bottom,#000 " + T + "px,transparent " + T + "px)," +
            "linear-gradient(to bottom,transparent " + B + "px,#000 " + B + "px)";
          el.style.maskImage = m;
          el.style.setProperty("-webkit-mask-image", m);
        }
      }
    });

    return () => {
      off();
      window.removeEventListener("resize", invalidate);
      img.removeEventListener("load", invalidate);
      clearWrites();
    };
    // reserveRise mounts/unmounts the tail node this closure captured.
  }, [plate, captionKey, instruction, reserveRise]);

  /* ── ink that burns where the image reaches it ───────────────────────
     Every ink target gets a burn layer behind it, masked to its own
     letterforms. backdrop-filter applies to an element's BOX, not its glyph
     shape, so without the mask the burn would be a rectangle; masking the
     filtered element clips it to the letterforms (mask and backdrop-filter
     compose on one element in Chrome — verified in the prototype). */
  useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;
    const inkEls: HTMLElement[] = [
      numRef.current,
      capRef.current,
      instrRef.current,
    ].filter((el): el is NonNullable<typeof el> => el !== null);
    if (!inkEls.length) return;

    /* No backdrop-filter, no burn — and critically, no KNOCKOUT either:
       style.setProperty of an unsupported property is a silent no-op, so
       nothing would throw, the tick would still mask the ink out over the
       plate, and the text would simply vanish instead of burning. Bail to
       plain ink up front. */
    /* `typeof CSS === "undefined"` is not enough of a guard, and this
       is the bug that proved it: a classic script elsewhere on the site
       declared a top-level `const CSS`, which shadows window.CSS for
       the whole document without replacing it. CSS was very much
       defined; it was a string. Ask for the method, not the object. */
    if (typeof CSS === "undefined" || typeof CSS.supports !== "function") return;
    if (
      !CSS.supports("backdrop-filter", "blur(1px)") &&
      !CSS.supports("-webkit-backdrop-filter", "blur(1px)")
    ) {
      return;
    }

    let alive = true;
    let defs: SVGSVGElement | null = null;
    let items: BurnItem[] = [];

    /* The graceful fallback, and also the unmount path: remove everything
       the apparatus added and clear any knockout the zoom tick wrote, so
       the ink is simply ink again. */
    const teardown = () => {
      burnOkRef.current = false;
      for (const it of items) it.burn.remove();
      items = [];
      if (defs) {
        defs.remove();
        defs = null;
      }
      for (const el of inkEls) {
        el.style.maskImage = "";
        el.style.removeProperty("-webkit-mask-image");
      }
    };

    let sync: () => void = () => {};

    try {
      const metrics = document.createElement("canvas").getContext("2d");
      if (!metrics) throw new Error("no 2d context for font metrics");

      defs = document.createElementNS(NS, "svg");
      defs.setAttribute("aria-hidden", "true");
      defs.style.cssText =
        "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
      sticky.appendChild(defs);

      items = inkEls.map((ink, i) => {
        const mask = document.createElementNS(NS, "mask");
        mask.id = meltId + "-ink" + i;
        mask.setAttribute("maskUnits", "userSpaceOnUse");
        defs!.appendChild(mask);

        const burn = document.createElement("div");
        burn.setAttribute("aria-hidden", "true");
        burn.className = styles.burn;
        burn.style.setProperty("mask", "url(#" + mask.id + ")");
        burn.style.setProperty("-webkit-mask", "url(#" + mask.id + ")");
        /* The melt itself. The -webkit- declaration drops the SVG filter
           reference on purpose — Safari cannot resolve one inside
           backdrop-filter — so Safari gets the blur/saturate/contrast pump
           alone, exactly the exclusion the prototype's .num-burn rule
           makes. It must not live inside .left: a backdrop-filter nested
           in a blend group would composite against the group, which is why
           the burns are appended to the sticky instead. */
        burn.style.setProperty("backdrop-filter", "url(#" + meltId + ") " + BURN_PUMP);
        burn.style.setProperty("-webkit-backdrop-filter", BURN_PUMP);
        sticky.appendChild(burn);
        return { ink, burn, mask, texts: [] };
      });

      sync = () => {
        for (const it of items) {
          const r = it.ink.getBoundingClientRect();
          const s = sticky.getBoundingClientRect();
          const cs = getComputedStyle(it.ink);
          const fs = parseFloat(cs.fontSize);

          it.burn.style.left = (r.left - s.left).toFixed(1) + "px";
          it.burn.style.top = (r.top - s.top).toFixed(1) + "px";
          it.burn.style.width = r.width.toFixed(1) + "px";
          it.burn.style.height = r.height.toFixed(1) + "px";
          it.mask.setAttribute("x", "0");
          it.mask.setAttribute("y", "0");
          it.mask.setAttribute("width", String(r.width));
          it.mask.setAttribute("height", String(r.height));

          const lines = lineNodes(it.ink);
          while (it.texts.length < lines.length) {
            const t = document.createElementNS(NS, "text");
            t.setAttribute("fill", "#fff"); // white keeps, black drops
            it.mask.appendChild(t);
            it.texts.push(t);
          }
          while (it.texts.length > lines.length) {
            it.mask.removeChild(it.texts.pop()!);
          }

          metrics.font = cs.fontWeight + " " + fs + "px " + cs.fontFamily;
          const m = metrics.measureText("X");
          const lh = parseFloat(cs.lineHeight) || fs;
          const rough =
            (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 +
            m.fontBoundingBoxAscent;
          /* A browser without fontBoundingBox* would place every glyph at
             NaN — a silently empty mask over knocked-out ink, which erases
             the text. Fail loudly here instead so the catch keeps the ink. */
          if (!Number.isFinite(rough)) throw new Error("font metrics unavailable");

          for (let k = 0; k < lines.length; k++) {
            const t = it.texts[k];
            /* text-transform is applied at RENDER time, not in the DOM
               value. Copying nodeValue raw put lowercase glyphs in the mask
               while the ink rendered uppercase — the two never lined up. */
            let txt = lines[k].nodeValue ?? "";
            const tt = cs.textTransform;
            if (tt === "uppercase") txt = txt.toUpperCase();
            else if (tt === "lowercase") txt = txt.toLowerCase();
            else if (tt === "capitalize")
              txt = txt.replace(/\b\w/g, (c) => c.toUpperCase());
            t.textContent = txt;
            t.setAttribute("font-family", cs.fontFamily);
            t.setAttribute("font-size", String(fs));
            t.setAttribute("font-weight", cs.fontWeight);
            t.setAttribute(
              "letter-spacing",
              cs.letterSpacing === "normal" ? "0" : cs.letterSpacing,
            );

            /* Place, then CORRECT against reality. A baseline derived from
               font metrics alone sat the numeral's mask 7px high in the
               prototype — fontBoundingBox* is the font's bounding box, not
               the ascent CSS uses to lay out a line box, and they disagree
               by different amounts per face. A mask that misses the ink
               reads as a second, offset copy of the text. */
            const rng = document.createRange();
            rng.selectNode(lines[k]);
            const lr = rng.getBoundingClientRect(); // this line's real ink
            t.setAttribute("x", "0");
            t.setAttribute("y", (rough + (lr.top - r.top)).toFixed(1));
            const bb = t.getBBox();
            if (lr.width && bb.width) {
              t.setAttribute("x", (lr.left - r.left - bb.x).toFixed(1));
              t.setAttribute(
                "y",
                (rough + (lr.top - r.top) + (lr.top - r.top - bb.y)).toFixed(1),
              );
            }
          }
        }
      };

      sync();
      burnOkRef.current = true;
    } catch (err) {
      teardown();
      console.warn(
        "[PressingZoomPlate] burn mask construction failed; falling back to plain ink:",
        err,
      );
    }

    const resync = () => {
      if (!burnOkRef.current) return;
      try {
        sync();
      } catch (err) {
        teardown();
        console.warn(
          "[PressingZoomPlate] burn mask resync failed; falling back to plain ink:",
          err,
        );
      }
    };
    window.addEventListener("resize", resync);
    /* A webfont swap changes the metrics under us; re-measure once it
       lands. */
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (alive) resync();
      });
    }

    return () => {
      alive = false;
      window.removeEventListener("resize", resync);
      teardown();
    };
  }, [meltId, plate, captionKey, instruction]);

  return (
    /* hero-breakout: <main> carries md:px-[50px] gutters and the plate has
       to grow to true viewport width, so the whole wrap runs full-bleed.
       The breakout is plain flow (width + negative margin, no transform),
       so the sticky inside survives it. */
    <section ref={wrapRef} className={`${styles.wrap} ${reserveRise ? "" : styles.noTail} hero-breakout`}>
      <div ref={stickyRef} className={styles.sticky}>
        {/* The melt, sized for glyphs — finer noise than the nav-bar melt,
            verbatim from the prototype's #numMelt. Inline in the component
            with a per-instance id so two plates on one page never collide. */}
        <svg width="0" height="0" className={styles.defs} aria-hidden="true">
          <filter
            id={meltId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.055"
              numOctaves="3"
              seed="8"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="1.4" result="smoothNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="smoothNoise"
              scale="11"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>

        {/* Holds the resting plate's place in the grid so the figure itself
            can be laid out at full-bleed size and scaled DOWN onto it. The
            ratio has to be declared or the slot collapses; the driver fills
            it in from the decoded image if these props are missing. */}
        <div
          ref={slotRef}
          className={styles.slot}
          aria-hidden="true"
          style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
        />

        <figure ref={figRef} className={styles.fig}>
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
          />
        </figure>

        {/* The apparatus paints AFTER the figure so painting order alone
            puts it on top — the prototype learned not to reach for
            z-index tricks beyond the fixed 32/34 pair. */}
        <div ref={numRef} className={styles.num}>
          {plate}
        </div>
        <div className={styles.left}>
          <p ref={capRef} className={styles.tiny}>
            {captionLines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
          {instruction && (
            <p ref={instrRef} className={`${styles.tiny} ${styles.instr}`}>
              {instruction}
            </p>
          )}
        </div>

        {mark && (
          <span className={styles.markSlot}>
            {/* scrollRef is REQUIRED here: the mark lives inside a pinned
                screen and barely moves, so its sweep reads the wrap's
                travel instead of its own position. */}
            <SectionMark n={mark.n} name={mark.name} scrollRef={wrapRef} />
          </span>
        )}
      </div>

      {reserveRise ? (
        <div ref={tailRef} className={styles.risetail} aria-hidden="true" />
      ) : null}
    </section>
  );
}
