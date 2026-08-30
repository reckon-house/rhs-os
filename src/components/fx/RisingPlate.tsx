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
 * Reduced motion renders the settled state: no negative margin, no
 * scrub, the image in flow at full width, square. Pure CSS
 * (motion-reduce: variants), so server markup is correct everywhere; the
 * driver only ever writes on top of the active state and cleans its
 * inline styles up behind itself. The pass runs at every width — the
 * climb is vertical and a phone has the same screen of travel to stage
 * it in that a laptop does.
 */

import { useEffect, useRef } from "react";
import { onTick } from "@/lib/scrub";
import { plateSrcSet } from "@/lib/img-srcset";
import { CHOREO_BREAKPOINT, RISE } from "@/lib/choreo";
import styles from "./RisingPlate.module.css";

// Resting scale and corner, verbatim from the prototype. The plate already
// sits close to full width, so the growth is ~5% — the live HeroBlock's
// 0.82 → 1.0 assumes a hero that owns the whole screen, and looked like a
// lurch here.
const REST = 0.95;
/* The phone's resting scale. Same gesture as the desktop's 0.95, opened
   up because the plate it is applied to is a quarter of the size: 5% of
   a 246px plate is 12px of growth and reads as nothing, which is why the
   crop-to-portrait branch was written in the first place.

   0.68, which is the owner's "let's try doubling it": the travel was
   0.84 to 1 and is now 0.68 to 1, twice the growth. Doubled at the START
   rather than the end, because the end is already full-bleed — scaling
   past 1 would push the picture wider than the screen and start cutting
   its sides, which is the crop this branch exists to avoid. So the plate
   arrives smaller and further away and grows twice as far into the same
   landing. Nothing is cropped at any point. */
const REST_PHONE = 0.68;
/* The crop branch's switch. `as boolean` on purpose: a bare `false`
   folds to a literal type and TypeScript stops narrowing inside the
   branch it has decided is dead, which turns one disabled feature into
   a file of errors. */
const PHONE_CROP = true as boolean;
/* The hand-rolled crop pan, superseded by the box's own scroll. */
const PAN_GESTURE = false as boolean;
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
  /** Editorial ceiling under the native one. Only ever shrinks. */
  plateWidth?: number;
  /** The shape this plate morphs to on a phone. See pressing.phoneRatio. */
  phoneRatio?: number;
  height?: number;
  /** Load eagerly — only for a plate that can be near the fold. */
  eager?: boolean;
  className?: string;
};

export function RisingPlate({
  src,
  alt,
  width,
  plateWidth,
  phoneRatio,
  height,
  eager = false,
  className = "",
}: RisingPlateProps) {
  const secRef = useRef<HTMLElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  /* ── a riser never scales past the picture it has ─────────────────
     The same backstop PressingPlate's flow branch has carried all
     along, and the gap that let it be missed here: a bare plate was
     capped at its native width, and flagging it `rise` moved it to
     this component, which drew it at the FULL viewport instead. The
     conformance pass flagged twenty-five plates that way and stretched
     files as small as 1003px across the screen — the exact overdraw
     the flow branch exists to prevent, arriving through the other door.
     PRESSING.md states the principle for every image slot, not for one
     branch of one component: the declared width is the honest ceiling.
     A capped riser still climbs; it simply climbs at the size it can
     carry, centred, with the page either side of it.

     No threshold here, unlike the flow branch. Flow plates live in a
     ~1100px column, so `< 1400` is a fair proxy for "smaller than its
     box". A riser's box is the VIEWPORT, which is 980 on this laptop
     and 2560 on a studio display — no constant is right for both.
     max-width at the native pixels simply never binds until the
     viewport actually exceeds them, which is the rule stated directly
     rather than approximated. */
  /* Two ceilings, and the lower wins. The native one is a promise the
     picture cannot be magnified; plateWidth is an editorial call that a
     picture big enough to fill the screen should not. Taking the min
     means the editorial number can never raise the honest one. */
  const native = typeof width === "number" && width > 0 ? width : undefined;
  const editorial =
    typeof plateWidth === "number" && plateWidth > 0 ? plateWidth : undefined;
  const ceiling =
    native != null && editorial != null
      ? Math.min(native, editorial)
      : (editorial ?? native);

  /* ── the phone's tall morph: which plates, and how tall ──────────
     Wide plates only — a portrait or squarish file already has phone
     presence and cropping it buys nothing. 1.3 is the line between
     "wide" and "roughly how the screen already is".

     The target is DERIVED from the file's own ratio rather than being
     one number, and the crop is the binding constraint: the rest state
     keeps at least ~77% of the file's width (a 1.3x cover scale, never
     more). The first cut of this used 0.58 and looked spectacular on
     photography — and sliced a third off both sides of Sally's laptop
     mockup, cutting through the UI inside the screen. Device mockups
     and app screens cannot give up their edges, and this component
     cannot tell a portrait from a laptop, so the universal number is
     the one the worst case can afford. 0.85 stays as the tall floor
     for anything so wide that even 1.3x leaves it squat.

     From the DECLARED dimensions, not a measurement: the same numbers
     that make the ratio load-bearing for the scroll maths make the
     tall box knowable before the image arrives. No declared size, no
     morph. A capped riser keeps its cap and skips the morph too — its
     whole point is refusing to fill the screen. */
  const nativeRatio =
    typeof width === "number" && typeof height === "number" && height > 0
      ? width / height
      : undefined;
  const tallMorph =
    nativeRatio != null && nativeRatio >= 1.3 && editorial == null;
  /* AN AUTHORED TARGET WINS. The derived one is capped at a 1.3x cover
     scale, and that cap is doing a real job — it is what stopped a
     deeper crop slicing a third off both sides of Sally's laptop. But
     the arithmetic of it is that a 1.62 file lands on a 1.25 box: still
     landscape, so the plate goes from wide to slightly less wide and
     never stands up. On a phone that reads as the picture straining
     inside a container that will not grow, because that is exactly what
     it is.
     The cap stays the default. A study that knows its picture can
     afford the crop says so per section, and takes the shape it asked
     for. See pressing.phoneRatio. */
  const tallRatio = tallMorph
    ? (phoneRatio && phoneRatio > 0 ? phoneRatio : Math.max(nativeRatio / 1.3, 0.85))
    : undefined;

  /* ── the crop is draggable ────────────────────────────────────────
     The morph buys phone presence by cropping width away — up to 23%
     of the file, off both sides. That trade is invisible and
     un-arguable: the reader cannot know what left. A horizontal drag
     pans the crop across the hidden width, so the picture can be
     pushed against and let go.
     The pan is a percentage of the hidden overflow (never of the
     image), so a plate with nothing hidden has nothing to drag, and
     it is written as object-position — the driver owns transform and
     the two must not fight over one property. Vertical scroll is
     untouched: the gesture only claims the pointer once the finger
     has travelled further sideways than down. */
  const panRef = useRef({
    x0: 0,
    y0: 0,
    p0: 50,
    p: 50,
    id: null as number | null,
    on: false,
    live: false,
  });

  useEffect(() => {
    const sec = secRef.current;
    const img = imgRef.current;
    if (!sec || !img) return;

    const clip = clipRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastKey = "";
    /* The centring's own bookkeeping — see the morph branch below. */
    let centred = 0;
    let panned = false;

    /* The MORPH's corner opens at the system's own plate radius, not the
       climb's. RADIUS = 44 is the prototype's number for a plate that is
       1200-1500px wide on a desktop; on a 390px phone plate the same 44
       reads nearly four times as round and the clip band came out
       stadium-shaped. Every resting plate on the page wears --pp-r
       (16px at every width), so the morph starts there and squares from
       there. Read from the cascade so a token change follows; the
       fallback is the token's value, not the climb's. */
    let morphR = 16;
    const readR = () => {
      const v = parseFloat(
        getComputedStyle(sec).getPropertyValue("--pp-r")
      );
      if (Number.isFinite(v) && v > 0) morphR = v;
    };
    readR();

    const clear = () => {
      lastKey = "";
      img.style.transform = "";
      img.style.borderRadius = "";
      if (clip) {
        clip.style.clipPath = "";
        clip.style.height = "";
        clip.style.borderRadius = "";
      }
    };

    const off = onTick(() => {
      // Checked per tick so a viewport crossing the breakpoint mid-session
      // hands the element back to its CSS state instead of freezing the
      // last frame the driver wrote.
      if (reduce.matches) {
        if (lastKey !== "") clear();
        return;
      }
      // The VisibilityPause convention. The shared loop in scrub.ts already
      // parks itself on data-paused; this keeps the component correct even
      // if it is ever rewired to a driver that does not.
      if (document.documentElement.hasAttribute("data-paused")) return;

      const vh = window.innerHeight;
      const phone = window.innerWidth <= CHOREO_BREAKPOINT;
      /* THE CROP BRANCH IS OFF. It changed the plate's RATIO on a phone,
         cropping a 1.50 file toward portrait so it would have presence —
         and the presence was paid for by the picture: 23% of the width
         at the safe cap, 54% at the depth needed to look genuinely tall,
         which sliced DSC's laptop in half.

         The desktop has never done that. Measured at 1070: the plate
         holds its native 1.50 the whole way and scales 0.95 to 1 into
         full-bleed while the corner squares 44 to 0. Round to sharp,
         growing as it lands, nothing cut. That is the gesture, and it is
         the same gesture at every width — the phone just needs a bigger
         scale range to show it, which REST_PHONE is.

         Left as a constant rather than deleted: the morph's machinery
         (the clip box, the drag-to-pan) is still here and still correct
         if a study ever ships a genuinely portrait source. Nothing
         reaches it today. */
      const morphing =
        PHONE_CROP && phone && clip != null && sec.dataset.tallmorph != null;

      /* THE PHONE FINISHES MID-SCREEN. The desktop scrub runs 0 as the
         plate's top enters at the viewport bottom to 1 as it reaches
         the top, and that is right there: a desktop plate is taller
         than the glass, so "top at top" still leaves its body filling
         the screen. A phone plate is a fraction of the glass — the
         same anchor finishes the corner and the settle with the
         plate's centre at 7% of the screen, which is to say after the
         reader has stopped looking at it. Ending at 0.35vh puts the
         completed plate's centre near the middle of the phone.

         MORPHING PLATES ONLY. A portrait or squarish plate keeps the
         desktop anchors even on a phone: it is already tall, its
         payoff does not vanish at the exit, and finishing its corner
         at 35% of the screen would square a full-bleed radius while
         both top corners are plainly visible — the exact "reads as a
         clipping bug" case the bleeds note below warns about. Inside
         the morph the clip's round term owns the corner, so the early
         finish is safe there and only there.
         Desktop anchors untouched; scrubbed, not fired, so scrolling
         back runs it in reverse for free. Linear on purpose; the
         travel is a full screen and easing made the corner hang. */
      const end = morphing ? vh * 0.35 : 0;
      const top = sec.getBoundingClientRect().top;
      const p = Math.max(0, Math.min(1, (vh - top) / (vh - end)));

      if (morphing) {
        /* THE BOX ITSELF GROWS, wide to tall, and that is the gesture.
           The first cut reserved the tall box in layout and scrubbed a
           clip-path window open inside it — geometrically identical,
           and it read wrong on a real phone: "the image is trying to
           increase in height but the container never does." The
           container is the thing the eye tracks. So the clip's HEIGHT
           runs from the image's own wide shape to the tall crop, the
           img covers it (object-fit does the cropping), and the corner
           rides the same clock. The section's phone min-height means
           the growth displaces nothing outside its own screen. */
        const W = clip.offsetWidth || 1;
        const H0 = nativeRatio ? W / nativeRatio : clip.offsetHeight;
        /* THE TARGET IS A HEIGHT, NOT A SHAPE. Every earlier version of
           this line asked for a RATIO and let cover pay for it out of
           the picture's width. The box scrolls its own width now, so
           the width costs nothing and the only question left is how
           much of the screen the picture should own. 0.72 of it.

           No ratio, no cover scale, no per-study number: this is the
           same value for every plate in the portfolio, which is the
           whole point of doing it this way. */
        const T = Math.max(H0, vh * 0.72);
        const h = H0 + Math.max(0, T - H0) * p;
        /* ONE CLOCK, corner and height together. This briefly finished
           the corner at 0.6 of the travel, which was the right call for
           the plate it was written against: that one barely grew, so the
           sharp state arrived at p = 1 and was gone before it read.

           The panorama plate grows across the WHOLE travel, and against
           that an early finish squares the corner before the picture is
           properly on screen — so the round half never gets seen at all,
           which is the opposite complaint and the same mistake.
           Round at the start, sharp when the growth lands. */
        const r = Math.round(morphR * (1 - p));
        const scl = REST + (1 - REST) * p;
        const key = `m${p.toFixed(4)}|${Math.round(T)}`;
        if (key === lastKey) return;
        lastKey = key;
        clip.style.height = h.toFixed(1) + "px";
        clip.style.borderRadius = r + "px";
        img.style.transform = `scale(${scl.toFixed(4)})`;
        /* AND THE IMAGE'S OWN CORNER, which this branch never touched.
           The img carries rounded-[44px] for the desktop path, where the
           driver squares that same property directly. Here the CLIP owns
           the corner and the img was left alone — so the box went sharp
           while the picture inside it stayed round, and the 44px became
           the corner you actually see. The box is what has the corner in
           this mode; the picture must not have one at all. */
        img.style.borderRadius = "0px";
        /* AND IT OPENS ON THE MIDDLE. A box that scrolls starts at its
           left edge, which on a centred composition is the emptiest part
           of it: the first thing met was a wall, the subject off to the
           right with no sign it was there. Centred as the box grows, so
           the plate lands on what it is a picture OF and the width is
           still there for anyone who pans.

           Only until they do. `centred` records what we last wrote, so a
           scrollLeft that is not it means a hand moved the picture and
           this stops touching it. */
        const mid = (clip.scrollWidth - clip.clientWidth) / 2;
        if (!panned) {
          if (Math.abs(clip.scrollLeft - centred) < 1.5) {
            clip.scrollLeft = mid;
            centred = mid;
          } else {
            panned = true;
          }
        }
        return;
      }

      const key = `d${p.toFixed(4)}`;
      if (key === lastKey) return;
      lastKey = key;
      if (clip) clip.style.clipPath = "";
      /* ── THE PHONE GROWS THE BOX, NOT THE PAINT ────────────────────
         transform: scale() changes what is PAINTED and nothing else:
         the layout box stays the size it was, so the picture swells
         inside a slot that never moves. That is the whole complaint —
         "the image is growing, the container isn't" — and it was true,
         because it is what a transform does. The desktop gets away with
         it: its plate is 709px tall and 5% of that reads as the frame
         landing rather than as something rattling in a box.

         So on a phone the WIDTH and HEIGHT are written instead, both
         off one scale, at the file's own ratio. The box gets taller and
         wider together, the picture fills it exactly at every step
         because the shape never changes, and nothing is cropped at any
         point. Same gesture as the desktop, made of layout instead of
         paint, which is the only difference the small screen forces. */
      if (phone && clip) {
        const s2 = REST_PHONE + (1 - REST_PHONE) * p;
        const fullW = sec.offsetWidth;
        const fullH = nativeRatio ? fullW / nativeRatio : clip.offsetHeight;
        clip.style.width = (fullW * s2).toFixed(1) + "px";
        clip.style.height = (fullH * s2).toFixed(1) + "px";
        clip.style.marginLeft = "auto";
        clip.style.marginRight = "auto";
        clip.style.borderRadius = Math.round(morphR * (1 - p)) + "px";
        /* The box owns the corner and the size; the picture owns
           neither. Both are cleared so the desktop's resting 44px and
           its scale cannot show through. */
        img.style.transform = "none";
        img.style.borderRadius = "0px";
        return;
      }
      img.style.transform = `scale(${(REST + (1 - REST) * p).toFixed(4)})`;
      /* Square the corner only for a plate that actually REACHES the
         viewport edges. One held back by its own pixels never does, and
         squaring it there would read as a clipping bug rather than a
         bleed — the inverse of the reason a full-bleed plate must
         square. Measured per tick against the section rather than
         decided from a constant, so the same file behaves correctly on
         a laptop and on a display wide enough to out-run it. */
      const bleeds = img.offsetWidth >= sec.offsetWidth - 1;
      img.style.borderRadius = bleeds
        ? Math.round(RADIUS * (1 - p)) + "px"
        : RADIUS + "px";
    });
    /* Only a morphing plate on a phone hides any width, so only that
       plate listens. Registered natively rather than through props
       because the move handler must be able to preventDefault the
       page scroll once the gesture is claimed, and React's touch
       listeners are passive. */
    /* THE DRAG-TO-PAN IS OFF. It existed because the crop hid width
       the reader could not otherwise reach, and it wrote object-position
       to move that hidden band. The box scrolls natively now — real
       momentum, real rubber-banding, and nothing hidden to reach for —
       so a hand-rolled pointer gesture writing a second property on the
       same picture would only fight it. Kept, unreached, in case a
       cropped mode ever returns. */
    let panOff = () => {};
    if (clip && tallMorph && PAN_GESTURE) {
      const g = panRef.current;
      const phone = () => window.innerWidth <= CHOREO_BREAKPOINT;
      // How much of the image is off the box, as a fraction of its
      // drawn width. cover scales by the ratio difference, so the
      // hidden part is what the box cannot show.
      const hidden = () => {
        const bw = clip.offsetWidth || 1;
        const bh = clip.offsetHeight || 1;
        const ar = nativeRatio ?? bw / bh;
        const drawn = (bh * ar) / bw; // drawn width ÷ box width
        return Math.max(0, drawn - 1);
      };
      const down = (e: PointerEvent) => {
        if (!phone() || reduce.matches || hidden() < 0.02) return;
        if (e.pointerType === "mouse") return; // a phone gesture, on phones
        // A second finger must not re-origin a drag in flight, and it
        // must not un-claim one: a pinch that starts on the plate was
        // otherwise read as a new pan whose axis check had been reset.
        if (g.on) return;
        g.x0 = e.clientX;
        g.y0 = e.clientY;
        g.p0 = g.p;
        g.id = e.pointerId;
        g.on = true;
        g.live = false;
      };
      const move = (e: PointerEvent) => {
        if (!g.on || g.id !== e.pointerId) return;
        const dx = e.clientX - g.x0;
        const dy = e.clientY - g.y0;
        if (!g.live) {
          // let the page have any gesture that is mostly vertical
          if (Math.abs(dy) > Math.abs(dx) || Math.abs(dx) < 12) {
            if (Math.abs(dy) > 12) g.on = false;
            return;
          }
          g.live = true;
          try {
            clip.setPointerCapture(e.pointerId);
          } catch {
            /* pointer already released */
          }
        }
        // The full hidden width is one box-width of travel, so the
        // drag maps to what is actually there rather than to a
        // constant that would feel different on every plate.
        const span = clip.offsetWidth || 1;
        const next = g.p0 - (dx / span) * 100;
        g.p = Math.max(0, Math.min(100, next));
        img.style.objectPosition = g.p.toFixed(1) + "% 50%";
      };
      const up = (e?: PointerEvent) => {
        if (e && g.id != null && g.id !== e.pointerId) return;
        g.on = false;
        g.live = false;
        g.id = null;
      };
      const block = (e: TouchEvent) => {
        if (g.live) e.preventDefault();
      };
      clip.addEventListener("pointerdown", down);
      clip.addEventListener("pointermove", move);
      clip.addEventListener("touchmove", block, { passive: false });
      // On window: a drag released off the element must still end.
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
      panOff = () => {
        clip.removeEventListener("pointerdown", down);
        clip.removeEventListener("pointermove", move);
        clip.removeEventListener("touchmove", block);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        img.style.objectPosition = "";
      };
    }

    return () => {
      off();
      panOff();
      clear();
    };
  }, [tallMorph, nativeRatio, tallRatio]);

  return (
    <section
      ref={secRef}
      // motion-reduce:mt-0 is load-bearing, not symmetry: under reduced
      // motion PinStage goes static and hides its climb-room spacer, so a
      // plate that kept its -RISE pull-up would statically cover the last
      // ~screen of the held section's content. The margin and the spacer
      // are two halves of one contract and must switch off together.
      className={`hero-breakout relative isolate z-[3] bg-transparent motion-reduce:!mt-0 ${styles.riser} ${className}`}
      data-tallmorph={tallMorph ? "" : undefined}
      style={{
        "--choreo-rise": RISE,
        marginTop: `calc(-1 * ${RISE})`,
        ...(tallRatio && nativeRatio
          ? { "--tall-ar": String(tallRatio), "--nat-ar": String(nativeRatio) }
          : null),
      } as React.CSSProperties}
    >
      {/* No fixed height and no cover-crop ON GLASS WIDE ENOUGH TO SHOW
          THE COMPOSITION: the section hugs the image and the image keeps
          its own ratio, because forcing plates into viewport-tall boxes
          cropped the exact compositions they exist to show. The phone is
          the exception, and RisingPlate.module.css names why: a
          quarter-screen letterbox is not showing the composition either.
          There the .clip box goes tall (from the declared ratio, so no
          measurement) and the driver scrubs the wide band open into the
          tall crop. On every other screen this div is a layout-neutral
          block around an in-flow image. */}
      <div ref={clipRef} className={styles.clip}>
      <img
        ref={imgRef}
        src={src}
        /* A phone asks for 1170 device pixels of this, not 2560. The
           note above is right that the RATIO needs no help at viewport
           width; the resolution always did. */
        srcSet={plateSrcSet(src, width)}
        /* A morphing plate is drawn at up to 1.3x the viewport width —
           the cover-crop scale — so telling the browser 100vw would
           under-request by exactly that factor at the moment the plate
           is largest. Desktop and non-morph plates stay 100vw. */
        sizes={tallMorph ? "(max-width: 760px) 130vw, 100vw" : "100vw"}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        // The static states square the corner because a full-bleed plate
        // at rest touches the viewport edges. A CAPPED plate never does,
        // so its inline borderRadius below overrides them — inline beats
        // the class, in every state, which is exactly what is wanted.
        className="block w-full h-auto origin-center will-change-[transform,border-radius] [transform:scale(0.95)] rounded-[44px] motion-reduce:[transform:none] motion-reduce:rounded-none"
        style={ceiling ? { maxWidth: `${ceiling}px`, margin: "0 auto" } : undefined}
      />
      </div>
    </section>
  );
}
