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
  /** Grayscale the image. */
  bw?: boolean;
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
 * The site masthead: a sticky 54px bar above the page. The prototype read
 * its --nav custom property here; the live page has no such token, so the
 * height is named once. The plate's top edge parks at this line, and the
 * pan window is the viewport minus it.
 */
const MASTHEAD = 54;

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
  bw = false,
  mark,
  width,
  height,
  eager = false,
  reserveRise = false,
}: PressingZoomPlateProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLElement>(null);
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
    let scale = 1;
    let spill = 0;
    let zoomPx = 0;
    let panPx = 0;

    const invalidate = () => {
      box = null;
    };
    window.addEventListener("resize", invalidate);
    img.addEventListener("load", invalidate);

    const measure = () => {
      fig.style.transform = "none";
      const f = fig.getBoundingClientRect();
      const s = sticky.getBoundingClientRect();
      box = { x: f.left - s.left, y: f.top - s.top, w: f.width, h: f.height };

      /* Full-bleed; the mat height excludes the masthead so the plate's top
         edge parks just beneath the bar rather than behind it. */
      const matH = vh() - MASTHEAD;
      /* Fit the WIDTH rather than covering the box. Nothing is cropped —
         any height beyond the fold becomes something to scroll through
         instead of something thrown away. A landscape plate spills barely
         anything and so pins for much less scroll than a portrait one. */
      scale = window.innerWidth / box.w;
      spill = Math.max(0, box.h * scale - matH);

      zoomPx = vh() * 1.1; // scroll spent growing the plate
      panPx = spill; // 1:1 — one pixel of scroll, one of image

      /* A wrap that a plate climbs over needs room for that climb ON TOP
         of its own sequence; without it the following plate enters before
         the sequence has finished. zp and pp key off zoomPx/panPx, not
         this height, so the zoom keeps its tuning exactly. */
      const tailH = tail ? tail.offsetHeight : 0;
      wrap.style.height = vh() + zoomPx + panPx + tailH + "px";
    };

    let wrote = false;
    const clearWrites = () => {
      fig.style.transform = "";
      fig.style.borderRadius = "";
      wrap.style.height = "";
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

      /* Origin is top-center, so translate steers the plate's TOP edge to
         the mat's top line and scale grows it downward from there. The pan
         then slides that tall frame up through the mat window. */
      const tx = (window.innerWidth / 2 - (b.x + b.w / 2)) * e;
      const ty = (MASTHEAD - b.y) * e - spill * pp;

      const cur = 1 + (scale - 1) * e;
      fig.style.transform =
        "translate(" + tx.toFixed(2) + "px, " + ty.toFixed(2) + "px) scale(" + cur.toFixed(4) + ")";
      /* The corner sharpens as the plate fills: --pp-r at rest, 0 once it
         is edge to edge. Divided by `cur` because transform scales
         border-radius along with everything else, so this is the pre-scale
         number that LOOKS like baseR * (1 - e) on screen. */
      fig.style.borderRadius = ((baseR * (1 - e)) / cur).toFixed(2) + "px";
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
  }, [plate, captionKey, instruction]);

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
    <section ref={wrapRef} className={`${styles.wrap} hero-breakout`}>
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

        <figure ref={figRef} className={styles.fig}>
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className={bw ? styles.bw : undefined}
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
