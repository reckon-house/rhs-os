"use client";

/**
 * RisingPlate — the full-bleed plate that climbs across its held neighbor.
 * Ported from .plate-full in public/lab/swiss-spread.html: pulled up by
 * RISE with a negative top margin, stacked above the held section, and the
 * image grows on approach — scale(0.95) with a 44px corner at rest,
 * squaring off to full bleed as its top edge reaches the top of the
 * viewport. The growth is a nudge; the CORNER carries the moment.
 *
 * The section it climbs must actually hold for at least RISE of scroll
 * (PinStage, or a sequence that pins itself). The negative margin does not
 * check this — a plate after an ordinary section just overlaps content
 * that is still moving.
 *
 * The ground is transparent on purpose. At rest the drawn image is smaller
 * than the section box on every side, and an opaque background turns that
 * gap into a frame; letting the held section show through is what makes
 * the plate read as a picture crossing the page. See src/lib/choreo.ts.
 *
 * Progress keys off the plate's own top edge, which the negative margin
 * does not change — so the grow keeps its tuning no matter what RISE is
 * set to. Rect-vs-innerHeight math is safe here because <main> spans the
 * full viewport. Full bleed comes from the existing .hero-breakout class
 * (width: 100vw, margin-left: calc(-50vw + 50%)) since main's content
 * column carries gutters; like sticky, the breakout and the z-order both
 * die under transformed or overflow-clipping ancestors, so mount plates in
 * plain flow.
 *
 * A plain <img>, not next/image: the driver writes transform and
 * border-radius to the element every frame, and the plate shows the WHOLE
 * frame at its native ratio at viewport width, so responsive sizing has
 * little to add here.
 *
 * Below 760px there is no room to stage a pass: no negative margin, no
 * scrub, the image flows normally at full width, square. Reduced motion
 * renders the same settled state at any width. Both are pure CSS
 * (max-[760px]: and motion-reduce: variants), so server markup is correct
 * everywhere; the driver only ever writes on top of the active state and
 * cleans its inline styles up behind itself.
 */

import { useEffect, useRef } from "react";
import { onTick } from "@/lib/scrub";
import { CHOREO_BREAKPOINT, RISE } from "@/lib/choreo";

// Resting scale and corner, verbatim from the prototype. The plate already
// sits close to full width, so the growth is ~5% — the live HeroBlock's
// 0.82 → 1.0 assumes a hero that owns the whole screen, and looked like a
// lurch here.
const REST = 0.95;
const RADIUS = 44;

type RisingPlateProps = {
  src: string;
  alt: string;
  /**
   * Intrinsic pixel size (image-dimensions manifest). With these the
   * browser knows the ratio before the file arrives, so a lazy plate
   * never reflows the page mid-scroll when it loads — a reflow above
   * the viewport eats the scroll delta and reads as a stall.
   */
  width?: number;
  height?: number;
  /** Load eagerly — only for a plate that can be near the fold. */
  eager?: boolean;
  className?: string;
};

export function RisingPlate({
  src,
  alt,
  width,
  height,
  eager = false,
  className = "",
}: RisingPlateProps) {
  const secRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    const img = imgRef.current;
    if (!sec || !img) return;

    const narrow = window.matchMedia(`(max-width: ${CHOREO_BREAKPOINT}px)`);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastP = -1;

    const off = onTick(() => {
      // Checked per tick so a viewport crossing the breakpoint mid-session
      // hands the element back to its CSS state instead of freezing the
      // last frame the driver wrote.
      if (narrow.matches || reduce.matches) {
        if (lastP !== -1) {
          lastP = -1;
          img.style.transform = "";
          img.style.borderRadius = "";
        }
        return;
      }
      // The VisibilityPause convention. The shared loop in scrub.ts already
      // parks itself on data-paused; this keeps the component correct even
      // if it is ever rewired to a driver that does not.
      if (document.documentElement.hasAttribute("data-paused")) return;

      // 0 as the plate's top enters at the viewport bottom, 1 when it
      // reaches the top — scrubbed, not fired once on entry, so scrolling
      // back down runs it in reverse for free. Linear on purpose; the
      // travel is a full screen and easing made the corner hang.
      const top = sec.getBoundingClientRect().top;
      const p = Math.max(0, Math.min(1, 1 - top / window.innerHeight));
      if (p === lastP) return;
      lastP = p;
      img.style.transform = `scale(${(REST + (1 - REST) * p).toFixed(4)})`;
      img.style.borderRadius = Math.round(RADIUS * (1 - p)) + "px";
    });
    return () => {
      off();
      img.style.transform = "";
      img.style.borderRadius = "";
    };
  }, []);

  return (
    <section
      ref={secRef}
      // motion-reduce:mt-0 is load-bearing, not symmetry: under reduced
      // motion PinStage goes static and hides its climb-room spacer, so a
      // plate that kept its -RISE pull-up would statically cover the last
      // ~screen of the held section's content. The margin and the spacer
      // are two halves of one contract and must switch off together.
      className={`hero-breakout relative isolate z-[3] bg-transparent max-[760px]:!mt-0 motion-reduce:!mt-0 ${className}`}
      style={{ "--choreo-rise": RISE, marginTop: `calc(-1 * ${RISE})` } as React.CSSProperties}
    >
      {/* No fixed height and no cover-crop: the section hugs the image and
          the image keeps its own ratio. Forcing plates into viewport-tall
          boxes cropped the exact compositions they exist to show. */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="block w-full h-auto origin-center will-change-[transform,border-radius] [transform:scale(0.95)] rounded-[44px] max-[760px]:[transform:none] max-[760px]:rounded-none motion-reduce:[transform:none] motion-reduce:rounded-none"
      />
    </section>
  );
}
