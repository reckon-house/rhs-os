"use client";

/**
 * PressingCover — the pinned cover sequence from public/lab/swiss-spread.html
 * (.coverwrap / .cover-sticky / .cover-statement and the cover-handover
 * driver), data-driven. A tall wrap holds a sticky screen; on load the
 * headline reveals, then as the reader scrolls it unbuilds bottom-line-first
 * while the statement rides a full screen up over it. The wrap carries an
 * in-flow risetail spacer whose height the progress math EXCLUDES — that
 * room is the NEXT section's RisingPlate climbing across the still-pinned
 * cover, not part of this sequence's travel.
 *
 * The headline entry REUSES RevealHeadline rather than porting the cover's
 * local reveal. Its re-arm behavior coexists with the unbuild the same way
 * the prototype's did, with the same defense: RevealHeadline's observer
 * strips its .go class once the headline is fully out of view, which would
 * re-run the entrance underneath this exit — so the driver waits for the
 * observer to reveal the headline once, then keeps the class on. The one
 * deviation from the prototype: on a full exit-and-return the component
 * replays its melt filter (its guard is an internal ref, not the class),
 * but at that moment the unbuild has the lines translated inside their
 * overflow-hidden masks, so the replay is invisible. The exit itself needs
 * no second mechanism — each line's inner wrapper slides back down inside
 * the mask it rose out of, travel measured from the mask (not hardcoded),
 * last line first so the bottom-anchored block collapses downward without
 * falling off its own baseline.
 *
 * All scrub math is getBoundingClientRect vs window.innerHeight, read on the
 * shared onTick loop — container-agnostic, so Lenis owning <main> never
 * enters the picture, and html[data-paused] parks it with everything else.
 * Below 760px and under prefers-reduced-motion the driver stands down per
 * tick and clears anything it wrote; the module CSS holds the static state.
 */

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RevealHeadline } from "@/components/fx/RevealHeadline";
import { usePinDrift } from "@/lib/pin-drift";
import { SectionMark } from "@/components/fx/SectionMark";
import { SizzleReel, type SizzleBeat } from "@/components/fx/SizzleReel";
import { onTick, vh } from "@/lib/scrub";
// The reveal system's class names, for querying the line wrappers it renders
// and defending the revealed state. Importing the module yields the same
// generated names RevealHeadline uses — the supported way to reach a sibling
// component's internals from JS.
import revealStyles from "@/components/fx/reveal.module.css";
import styles from "./PressingCover.module.css";

/* The tuned constants, verbatim from the prototype's cover-handover driver.
   COPY_IN is when the statement starts moving — exactly when the top
   headline line begins to leave ((n-1) * 0.1 with four lines). COPY_DRAG is
   a PIXEL offset, not a share of the scroll: lower lines trail by a few
   pixels and close that gap as the block settles. A staggered progress
   instead gave every line its own start and finish, which at 86vh of travel
   pulled them ~70px apart — four objects arriving, not a paragraph. */
const COPY_IN = 0.3;
const COPY_SPAN = 0.55;
const COPY_DRAG = 13;
/** The statement's travel as a share of the viewport height (the
 *  prototype's 86vh, computed from window.innerHeight instead). */
const COPY_TRAVEL = 0.86;
/** Per-line slice of the unbuild: line i starts at order * 0.1 and runs for
 *  0.55 of the sequence, bottom line first. */
const LINE_STAGGER = 0.1;
const LINE_SPAN = 0.55;

const clamp01 = (k: number) => (k < 0 ? 0 : k > 1 ? 1 : k);
const ease = (k: number) => k * k * (3 - 2 * k);

export interface PressingCoverProps {
  /** The headline. Newlines are authored line breaks — each becomes its own
   *  reveal mask, exactly as RevealHeadline treats them. */
  title: string;
  /** The statement paragraph that rides up over the headline. */
  statement: string;
  /** The live reel thumb: frame images, blink/card colors, and the small
   *  caption under the box. Omit to render no thumb. */
  reel?: { images: string[]; colors: string[]; caption?: string };
  /** The vertical spec line on the right page edge. Omit to render none. */
  specLine?: string;
  /** The section mark for the statement half of the sequence. */
  mark?: { n: string; name: string };
}

export function PressingCover({
  title,
  statement,
  reel,
  specLine,
  mark,
}: PressingCoverProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const ratiosRef = useRef<number[]>([]);

  /* The cover holds for its whole 210dvh + rise, which is the longest pin
     on the page and so the one where a dead stop reads worst. The creep
     keeps the screen alive under the handover; the headline unbuild and the
     statement's climb are transforms on children, so they ride on top of it
     rather than fighting it. */
  usePinDrift(wrapRef, stickyRef);
  const [reelReady, setReelReady] = useState(false);

  /* Words, not lines: the copy wraps, so the rendered lines are not in the
     DOM. The word split is deterministic from the string, so it happens in
     render (the server sends it, nothing re-flows on hydration); the driver
     recovers the real lines by grouping the spans by offsetTop at runtime. */
  const words = useMemo(
    () => statement.trim().split(/\s+/).filter(Boolean),
    [statement]
  );

  /* ── the handover driver ─────────────────────────────────────────── */
  useEffect(() => {
    const wrap = wrapRef.current;
    const copy = copyRef.current;
    if (!wrap || !copy) return;
    const h1 = wrap.querySelector("h1");
    if (!h1) return;
    const tail = tailRef.current;

    const narrow = window.matchMedia("(max-width: 760px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const wordEls = Array.from(
      copy.querySelectorAll<HTMLElement>("." + styles.csW)
    );

    // Group the word spans into rendered lines. offsetTop is layout, not
    // transform, so measuring is safe even while the driver is mid-write.
    const lineOf: number[] = [];
    const measureLines = () => {
      let ln = -1;
      let lastTop: number | null = null;
      for (let i = 0; i < wordEls.length; i++) {
        const t = Math.round(wordEls[i].offsetTop);
        if (t !== lastTop) {
          ln++;
          lastTop = t;
        }
        lineOf[i] = ln;
      }
    };
    measureLines();

    let lines: HTMLElement[] = [];

    /* How far a headline line must travel to be gone. It slides DOWN and its
       mask clips it, so it has to clear the mask's bottom edge — and the
       mask is taller than the line by its descender padding. A flat 115% was
       tuned against one padding value and broke when the padding widened;
       measuring the ratio means the next change to the padding or the
       line-height cannot reopen this. */
    const travel = new WeakMap<HTMLElement, number>();
    const exitTravel = (inner: HTMLElement) => {
      let v = travel.get(inner);
      if (v) return v;
      const innerH = inner.offsetHeight;
      const maskH = inner.parentElement
        ? inner.parentElement.offsetHeight
        : innerH;
      if (!innerH) return 115;
      v = (maskH / innerH) * 100 + 8; // clear the mask, plus a margin
      travel.set(inner, v);
      return v;
    };

    let revealed = false;
    let lastP = -1;
    let wrote = false;

    const clear = () => {
      for (const l of lines) l.style.transform = "";
      for (const w of wordEls) w.style.transform = "";
      copy.style.transform = "";
      wrote = false;
      lastP = -1;
    };

    const onResize = () => {
      measureLines();
      for (const l of lines) travel.delete(l);
      lastP = -1;
    };
    window.addEventListener("resize", onResize);

    // Helvetica is a system face, but the fallback chain can still move wrap
    // points on some platforms; re-measure once fonts settle, the way
    // BodyReveal does.
    let alive = true;
    document.fonts?.ready?.then(() => {
      if (alive) onResize();
    });

    const off = onTick(() => {
      // Checked per tick rather than once: both can flip mid-session, and a
      // stale transform left behind is a statement frozen mid-flight.
      if (narrow.matches || reduce.matches) {
        if (wrote) clear();
        return;
      }

      // RevealHeadline splits in render, but a reduced-motion flip remounts
      // its markup — re-collect whenever the cached nodes have left the DOM.
      if (!lines.length || !lines[0].isConnected) {
        lines = Array.from(
          h1.querySelectorAll<HTMLElement>("." + revealStyles.rlnI)
        );
        // The lone multiplication-sign line runs light. Found by shape
        // rather than index — the only line that is a single "x" character —
        // so it is content-agnostic and simply never fires for titles
        // without one.
        for (const ln of lines) {
          const ch = ln.querySelectorAll<HTMLElement>("." + revealStyles.rch);
          if (
            ch.length === 1 &&
            ch[0].textContent?.trim().toLowerCase() === "x"
          ) {
            ch[0].classList.add(styles.x);
          }
        }
      }

      // Defend the revealed state rather than stamping it: wait for the
      // observer to reveal the headline once, then keep the class on. See
      // the header comment for why stamping unconditionally broke the melt.
      if (h1.classList.contains(revealStyles.go)) revealed = true;
      else if (revealed && lines.length) h1.classList.add(revealStyles.go);

      const r = wrap.getBoundingClientRect();
      // The tail is the plate's climb room, not this sequence's. Excluding
      // it holds the headline and copy at the travel they were tuned
      // against, whatever --pp-rise is set to.
      const seq = r.height - vh() - (tail ? tail.offsetHeight : 0);
      const p = clamp01(-r.top / Math.max(seq, 1));
      if (p === lastP) return;
      lastP = p;

      if (!wrote) {
        // Words take over from the paragraph's pre-hydration transform: the
        // block sits at "none" and every word carries its own offset.
        copy.style.transform = "none";
        wrote = true;
      }

      // Each headline line gets its own slice of the scroll, last line
      // first — the block is bottom-anchored, and unbuilding downward is the
      // only direction that does not read as the type falling off its own
      // baseline.
      const n = lines.length || 1;
      for (let i = 0; i < lines.length; i++) {
        const order = n - 1 - i; // bottom line leads
        const k = ease(clamp01((p - order * LINE_STAGGER) / LINE_SPAN));
        lines[i].style.transform =
          "translateY(" + (k * exitTravel(lines[i])).toFixed(1) + "%)";
      }

      // The statement travels the full height of the screen rather than
      // fading in place — it starts below the fold and rides up over the
      // headline, so the two genuinely cross. Linear, not eased: an ease
      // reads as the block deciding to stop, which breaks the illusion that
      // it is simply the page scrolling underneath. It holds until COPY_IN,
      // exactly when the top headline line begins to leave. Every line
      // shares one clock; the only difference is a small trailing offset
      // that decays faster than the travel does, so the lines run at
      // slightly different rates mid-flight and come into register as they
      // land — inertia, not a stagger.
      const q = clamp01((p - COPY_IN) / COPY_SPAN);
      const settle = Math.pow(1 - q, 1.7);
      const rise = (1 - q) * COPY_TRAVEL * vh();
      for (let i = 0; i < wordEls.length; i++) {
        const y = rise + settle * (lineOf[i] || 0) * COPY_DRAG;
        wordEls[i].style.transform = "translateY(" + y.toFixed(1) + "px)";
      }
    });

    return () => {
      alive = false;
      off();
      window.removeEventListener("resize", onResize);
      clear();
    };
  }, [title, statement]);

  /* ── the reel thumb's shape ──────────────────────────────────────── */

  // The BOX owns the shape: re-size its height to the incoming frame's
  // native ratio on every beat, so the thumbnail morphs between portrait
  // and landscape as the reel cuts.
  const shape = useCallback((i: number) => {
    const box = boxRef.current;
    const r = ratiosRef.current[i];
    if (!box || !r) return;
    box.style.height =
      (box.getBoundingClientRect().width / r).toFixed(1) + "px";
  }, []);

  const images = reel?.images;
  useEffect(() => {
    if (!images || images.length === 0) return;
    let alive = true;
    // Only mount the reel once the ratios are known, so the first beat
    // already lands on a correctly-shaped box.
    Promise.all(
      images.map(
        (src, i) =>
          new Promise<void>((res) => {
            const im = new window.Image();
            im.onload = () => {
              ratiosRef.current[i] = im.naturalWidth / im.naturalHeight;
              res();
            };
            im.onerror = () => res();
            im.src = src;
          })
      )
    ).then(() => {
      if (!alive) return;
      shape(0);
      setReelReady(true);
    });
    const onResize = () => {
      const box = boxRef.current;
      // Let it re-derive on the next beat rather than going stale at the
      // old width.
      if (box && parseFloat(box.style.height)) box.style.height = "";
    };
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
      ratiosRef.current = [];
      setReelReady(false);
    };
  }, [images, shape]);

  const onBeat = useCallback(
    (_i: number, beat: SizzleBeat) => {
      // Color and title beats carry no image — hold the current shape
      // through them rather than snapping to some default.
      if (beat.img != null) shape(beat.img);
    },
    [shape]
  );

  return (
    // hero-breakout: the cover owns the full viewport width the way the
    // prototype's .screen did — main's content column carries md:px-[50px]
    // gutters. It is width/margin only, so the sticky child's ancestor chain
    // stays free of transforms, filters and overflow clipping.
    <section
      ref={wrapRef}
      className={`hero-breakout ${styles.coverwrap}`}
      aria-label="Cover"
    >
      <div ref={stickyRef} className={styles.coverSticky}>
        {/* DOM order is the mobile stacking order (headline, statement,
            reel); on desktop everything is absolutely positioned so order
            carries no layout. */}
        <RevealHeadline as="h1" className={styles.h1}>
          {title}
        </RevealHeadline>
        <p ref={copyRef} className={styles.statement}>
          {words.map((w, i) => (
            <Fragment key={i}>
              {/* A real space between word spans: it is what the line wraps
                  at, and what copy-paste and a screen reader read. */}
              {i > 0 ? " " : null}
              <span className={styles.csW}>{w}</span>
            </Fragment>
          ))}
        </p>
        {reel && reel.images.length > 0 ? (
          <figure className={styles.plateThumb}>
            <div ref={boxRef} className={styles.reelBox}>
              {reelReady ? (
                <SizzleReel
                  images={reel.images}
                  colors={reel.colors.length > 0 ? reel.colors : undefined}
                  style={{ width: "100%", height: "100%" }}
                  onBeatChange={onBeat}
                />
              ) : null}
            </div>
            {reel.caption ? (
              <figcaption className={styles.reelCap}>{reel.caption}</figcaption>
            ) : null}
          </figure>
        ) : null}
        {specLine ? <div className={styles.edgeV}>{specLine}</div> : null}
        {mark ? (
          <span className={styles.coverIdx}>
            {/* scrollRef is REQUIRED here: the mark lives inside a pinned
                screen and barely moves, so its sweep reads the tall wrap's
                travel instead of its own position. */}
            <SectionMark n={mark.n} name={mark.name} scrollRef={wrapRef} />
          </span>
        ) : null}
      </div>
      {/* The plate's climb room. Sits after the sticky screen so the cover
          stays pinned through it while the next RisingPlate crosses. */}
      <div ref={tailRef} className={styles.risetail} aria-hidden="true" />
    </section>
  );
}
