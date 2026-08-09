"use client";

/**
 * PressingCrossing — the pinned crossing headline from
 * public/lab/swiss-spread.html (.hwrap / .h-sticky / #hHead / #hCol).
 *
 * A 220dvh wrap pins its screen and remaps vertical scroll to horizontal
 * travel: each of the headline's REAL rendered lines starts a full
 * viewport off to the right and lands flush left exactly as the pin runs
 * out. Deliberately near-linear (ease-out exponent 1.6) — an eased curve
 * feels like an animation being played at the reader, near-linear feels
 * like the wheel dragging the line across, which is the point. Each line
 * starts 0.13 of progress after the one above it, and the per-line span
 * is shortened by the total stagger so the LAST line still finishes at
 * p = 1 — otherwise the tail would be mid-flight when the pin releases.
 * Every frame is a pure function of scroll position, so it reverses for
 * free.
 *
 * Lines are cut at runtime from the RENDERED wrap: words are laid in as
 * spans only to read which ones share an offsetTop, then the heading is
 * rebuilt as one block per real line. Re-cut on resize, so the breaks
 * answer to the width instead of being frozen at authoring time.
 *
 * The body column borrows BodyReveal's visual language (the same
 * mask-per-line classes from reveal.module.css) but is deliberately NOT
 * a BodyReveal. That component triggers from its own
 * IntersectionObserver plus a page-wide arrival queue, and inside a
 * pinned screen the paragraphs are "visible" for the whole 220dvh — an
 * observer would fire them the moment the pin engages and could never
 * scrub them back off on reverse. The prototype hit the same wall and
 * marked #hCol manual inside its shared body-reveal driver. So the line
 * CUT is rebuilt here in BodyReveal's exact idiom (same classes, same
 * 45ms per-line stagger, same space-joined lines so copy-paste and
 * screen readers get real word boundaries), and the CROSSING driver owns
 * the WHEN: paragraph i toggles on past p = 0.58 + 0.11 * i and drops
 * back off on reverse, retreating on the base transition.
 *
 * Scroll plumbing: the page scrolls inside <main> (Lenis, wrapper mode),
 * so progress is read per frame through onTick from the shared scrub
 * driver — never a bare window scroll listener, never main.scrollTop.
 * All math is getBoundingClientRect vs the viewport, which is container
 * agnostic because <main> spans the full viewport. Sticky integration
 * constraint this file cannot enforce: keep every wrapper between this
 * section and <main> free of transform, filter, and overflow clipping,
 * or the pin silently dies.
 *
 * Below 760px and under prefers-reduced-motion the pin is off and the
 * section renders static in normal flow. (The prototype left the
 * crossing running under reduced motion; the site's constraints forbid
 * that, so the static branch here is deliberate divergence.)
 */

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { onTick, vh } from "@/lib/scrub";
import { cutHeadline } from "@/lib/cut-lines";
import { CHOREO_BREAKPOINT } from "@/lib/choreo";
import { usePinDrift } from "@/lib/pin-drift";
import { SectionMark } from "@/components/fx/SectionMark";
import reveal from "@/components/fx/reveal.module.css";
import styles from "./crossing.module.css";

/* Tuned in the lab; change them only with the prototype open. */
const STAGGER = 0.13; // per-line progress lead
const LINE_EXP = 1.6; // ease-out exponent — 1 is linear, 2+ reads as played
const BODY_AT = 0.58; // progress where the first paragraph joins
const BODY_STEP = 0.11; // per-paragraph delay after that
const LINE_STAG = 45; // ms per rendered line inside one paragraph (BodyReveal's beat)
const GAP = 34; // px between the headline's last line and the column's first
const ROOM_PAD = 24; // breathing room the column keeps off the screen's bottom

const clamp01 = (k: number) => (k < 0 ? 0 : k > 1 ? 1 : k);
const easeOut = (t: number) => 1 - Math.pow(1 - t, LINE_EXP);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* The DOM rewrites below must never run during SSR; on the client the cut
   has to land before paint so the reader never sees a half-built frame. */
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/* The body cut, in BodyReveal's exact idiom: same classes from
   reveal.module.css, same per-line stagger, same space-joined lines. Only
   the trigger differs, and that lives in the driver below. */
function cutBody(el: HTMLElement, src: string) {
  el.innerHTML = src
    .split(" ")
    .map((w) => `<span data-bw>${esc(w)}</span>`)
    .join(" ");
  const groups: string[][] = [];
  let top: number | null = null;
  el.querySelectorAll<HTMLElement>("[data-bw]").forEach((w) => {
    const t = Math.round(w.offsetTop);
    if (t !== top) {
      groups.push([]);
      top = t;
    }
    groups[groups.length - 1].push(w.textContent ?? "");
  });
  el.innerHTML = groups
    .map(
      (g, i) =>
        `<span class="${reveal.bl}"><span class="${reveal.bli}" style="--d:${
          i * LINE_STAG
        }ms">${esc(g.join(" "))}</span></span>`
    )
    .join(" ");
}

export interface PressingCrossingProps {
  headline: string;
  paragraphs: string[];
  mark?: { n: string; name: string };
}

export function PressingCrossing({
  headline,
  paragraphs,
  mark,
}: PressingCrossingProps) {
  const wrapRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<HTMLHeadingElement | null>(null);
  const colRef = useRef<HTMLDivElement | null>(null);
  const bodyRefs = useRef<(HTMLElement | null)[]>([]);

  /* "scrub" is the server default so hydration matches; the effects below
     check the LIVE media queries before doing anything, so a phone or a
     reduced-motion user never sees a cut frame while state catches up. */
  const [mode, setMode] = useState<"scrub" | "static">("scrub");

  /* The screen creeps while it holds so the pin arrives as a deceleration,
     not a stop. The line transforms live on the .ln spans, so drifting the
     sticky box underneath them is additive, not a conflict. */
  usePinDrift(wrapRef, stickyRef);

  const headSrc = useMemo(
    () => headline.replace(/\s+/g, " ").trim(),
    [headline]
  );
  const bodyItems = useMemo(
    () => paragraphs.map((t) => ({ text: t, footnote: false })),
    [paragraphs]
  );
  const bodyKey = bodyItems.map((it) => it.text).join("");

  useEffect(() => {
    const narrow = matchMedia(`(max-width: ${CHOREO_BREAKPOINT}px)`);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () =>
      setMode(narrow.matches || reduce.matches ? "static" : "scrub");
    sync();
    narrow.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      narrow.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  /* The cut and the driver. Keyed markup (mode + text) means a flip to
     static remounts plain, readable children — this effect never has to
     un-rewrite the DOM it took over. */
  useIsoLayoutEffect(() => {
    if (mode !== "scrub") return;
    const narrow = matchMedia(`(max-width: ${CHOREO_BREAKPOINT}px)`);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    // The live queries, not the state: state lags one paint behind, and a
    // phone must never see even one split-and-translated frame.
    if (narrow.matches || reduce.matches) return;

    const wrap = wrapRef.current;
    const head = headRef.current;
    if (!wrap || !head) return;

    let lines = cutHeadline(head, headSrc, styles.ln);
    const bodyEls = bodyRefs.current
      .slice(0, bodyItems.length)
      .filter((el): el is HTMLElement => el !== null);
    bodyEls.forEach((el, i) => cutBody(el, bodyItems[i].text));
    const bodyWidths = bodyEls.map((el) => el.clientWidth);

    let lastP = -1;
    const apply = () => {
      const r = wrap.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - vh()));
      if (p === lastP) return;
      lastP = p;
      // The span is shortened by the total stagger so the last line still
      // finishes exactly at p = 1. Recomputed per pass: the line count is
      // not fixed — it follows the rendered wrap.
      const span = Math.max(1 - STAGGER * (lines.length - 1), 0.0001);
      const w = window.innerWidth;
      lines.forEach((el, i) => {
        const lp = easeOut(clamp01((p - i * STAGGER) / span));
        el.style.transform = `translateX(${((1 - lp) * w).toFixed(1)}px)`;
      });
      // The crossing's own choreography decides WHEN the copy joins — one
      // paragraph after the other, once the lines have nearly landed.
      // Scrubbed back above the threshold, the class drops and the lines
      // retreat on their base transition.
      /* The step compresses when the column overflows the tuned ladder:
         0.58 + 0.11i passes 1.0 at the fifth item, and p is clamped, so a
         study feeding five-plus paragraphs would leave the tail cut into
         masks that never reveal. Identical to the prototype's values for
         up to four items; beyond that, every item lands by p = 0.95. */
      const step = Math.min(
        BODY_STEP,
        (0.95 - BODY_AT) / Math.max(1, bodyEls.length - 1)
      );
      bodyEls.forEach((el, i) => {
        el.classList.toggle(reveal.on, p > BODY_AT + i * step);
      });
    };
    // The starting mask is applied by JS, before first paint (this is a
    // layout effect): un-run CSS keeps the copy readable, and a reader
    // arriving mid-document never sees the resting headline flash.
    apply();

    const offTick = onTick(() => {
      // Checked per tick so a mid-session flip stops the writes before
      // React's state catches up and remounts the static markup.
      if (narrow.matches || reduce.matches) return;
      // The VisibilityPause convention. The shared loop already parks on
      // data-paused; this keeps the component correct if it is ever
      // rewired to a driver that does not.
      if (document.documentElement.hasAttribute("data-paused")) return;
      apply();
    });

    const onResize = () => {
      if (narrow.matches) return;
      // The headline re-cuts unguarded (the prototype's choice — its wrap
      // moves at almost any width change); paragraphs only when their
      // width really changed, since a same-width re-cut rebuilds
      // identical lines for nothing.
      lines = cutHeadline(head, headSrc, styles.ln);
      bodyEls.forEach((el, i) => {
        if (el.clientWidth !== bodyWidths[i]) {
          cutBody(el, bodyItems[i].text);
          bodyWidths[i] = el.clientWidth;
        }
      });
      lastP = -1; // the rebuilt lines carry no transform yet; force a write
      apply();
    };
    window.addEventListener("resize", onResize);

    // The pressing scope runs the system Helvetica stack, so this is
    // usually a no-op — but a late font would move wrap points, and the
    // check costs nothing.
    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (alive) onResize();
      });
    }

    return () => {
      alive = false;
      offTick();
      window.removeEventListener("resize", onResize);
    };
    // Keyed on the derived strings, not on the bodyItems array: the memo's
    // identity follows the props', and a parent re-render with equal text
    // must not tear down and re-cut mid-scroll. BodyReveal's precedent.
  }, [mode, headSrc, bodyKey]);

  /* The placement pass, ported from the prototype's brief driver: the
     column's margin-top is the headline's measured height plus a 34px
     gap, so the paragraphs start below the band the lines sweep through.
     Measured with the offset cleared first — the two share a grid row, so
     a stale margin would inflate the row and compound on every resize.
     This runs under reduced motion too (it is layout, not motion); only
     phones skip it, where the stylesheet owns the stacked spacing. */
  useIsoLayoutEffect(() => {
    const head = headRef.current;
    const col = colRef.current;
    const sticky = stickyRef.current;
    if (!head || !col || !sticky) return;
    const narrow = matchMedia(`(max-width: ${CHOREO_BREAKPOINT}px)`);

    const place = () => {
      if (narrow.matches) {
        col.style.marginTop = "";
        return;
      }
      col.style.marginTop = "0px";
      const hs = getComputedStyle(head);
      let drop = parseFloat(hs.marginTop) + head.offsetHeight + GAP;
      // Only a PINNED screen is a fixed box the column must fit inside.
      // Computed position is the truth here rather than the mode state:
      // under reduced motion the stylesheet has already made this static
      // and content-sized, and capping against a content-sized box would
      // pin the column to the headline's top.
      if (getComputedStyle(sticky).position === "sticky") {
        const room =
          sticky.clientHeight - col.offsetTop - col.scrollHeight - ROOM_PAD;
        drop = Math.min(drop, Math.max(0, room));
      }
      col.style.marginTop = Math.max(0, Math.round(drop)) + "px";
    };
    place();

    // Registered after the cut effect's own resize listener, so a resize
    // re-cuts the headline first and this measures the fresh height.
    window.addEventListener("resize", place);
    narrow.addEventListener("change", place);
    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (alive) place();
      });
    }
    return () => {
      alive = false;
      window.removeEventListener("resize", place);
      narrow.removeEventListener("change", place);
      col.style.marginTop = "";
    };
  }, [mode, headSrc, bodyKey]);

  return (
    // hero-breakout: the pinned screen is a full-bleed surface with the
    // prototype's own 40px gutters, and the lines must enter from the
    // VIEWPORT edge, not from main's content column. The breakout is
    // width and margin only — no transform — so the sticky child survives.
    <section ref={wrapRef} className={`hero-breakout ${styles.wrap}`}>
      <div ref={stickyRef} className={styles.sticky}>
        {mark ? (
          <div className={styles.markRow}>
            {/* scrollRef is REQUIRED here: inside the pinned screen the
                mark barely moves, so its sweep reads the wrap's travel. */}
            <SectionMark n={mark.n} name={mark.name} scrollRef={wrapRef} />
          </div>
        ) : null}
        {/* Plain text as authored: the .ln blocks this animation needs are
            cut from the RENDERED lines at runtime. The key forces a clean
            remount when the text or the mode changes, so React never
            reconciles against the innerHTML the effect rewrote. */}
        <h2 key={`${mode}|${headSrc}`} ref={headRef} className={styles.head}>
          {headSrc}
        </h2>
        <div ref={colRef} className={styles.col}>
          {bodyItems.map((it, i) => (
            <p
              key={`${mode}|${i}|${it.text}`}
              ref={(el) => {
                bodyRefs.current[i] = el;
              }}
              className={
                [
                  it.footnote ? styles.footnote : null,
                  mode === "scrub" ? reveal.bcr : null,
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
            >
              {it.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
