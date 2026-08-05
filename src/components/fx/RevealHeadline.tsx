"use client";

/**
 * RevealHeadline — the [data-reveal] headline system from
 * public/lab/swiss-spread.html, at the settled values: rise, 1.2s expo-out,
 * 6ms per-character lead, melt 20. Each headline splits into lines (each its
 * own overflow-hidden mask), then words (so wraps stay at spaces), then
 * characters (so each can carry a delay). "\n" in children is the line
 * separator, standing in for the prototype's per-line <span>s.
 *
 * The split is deterministic from the string, so it happens in render rather
 * than by rewriting the DOM at mount — the server sends the split markup,
 * nothing re-flows on hydration, and a children change is just a re-render.
 * The raw string rides along as aria-label on the heading with every
 * fragment aria-hidden, so assistive tech reads one clean line instead of a
 * letter salad.
 *
 * The melt is the nav's filter chain, decayed to zero across the arrival and
 * then REMOVED — text left inside a filter pipeline renders soft, and these
 * need to be sharp at rest. One filter instance per headline so their
 * timings do not fight over a shared `scale`.
 *
 * Trigger is a viewport IntersectionObserver, which is safe even though the
 * page scrolls inside <main>: main spans the whole viewport, so viewport
 * intersection and scroller intersection are the same test. No scroll
 * listener, so Lenis never enters the picture.
 */

import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import styles from "./reveal.module.css";

const STAG = 6; // ms of lead per character
const DUR = 1200; // ms, the entry transition length (matches .go in the CSS)
const MELT = 20; // displacement scale at the moment the reveal starts

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface RevealHeadlineProps {
  as?: HeadingTag;
  children: string;
  className?: string;
}

/* React 19's JSX typing intersects a bare ElementType union into `never`
   props, so the dynamic tag needs its prop surface spelled out. */
type TagProps = {
  className?: string;
  children?: ReactNode;
  ref?: React.Ref<HTMLElement>;
  "aria-label"?: string;
};

export function RevealHeadline({
  as = "h2",
  children,
  className,
}: RevealHeadlineProps) {
  const Tag = as as ElementType<TagProps>;
  const ref = useRef<HTMLElement | null>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const rafRef = useRef<number | null>(null);
  // Revealed state lives in a ref, not React state: the class flip has to
  // happen inside the observer callback without a render, and it must
  // survive a re-render that rewrites className (React sets the attribute
  // wholesale, which would silently wipe an imperative class).
  const revealedRef = useRef(false);
  const [reduced, setReduced] = useState(false);

  // useId can emit characters that are illegal inside url(#...) depending on
  // the React version, so strip to a CSS-safe id.
  const rawId = useId();
  const filterId = "rhl-melt-" + rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  const model = useMemo(() => {
    let i = 0;
    const texts = children
      .split("\n")
      .map((t) => t.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    const lines = texts.map((line) =>
      line
        .split(" ")
        .map((word) => Array.from(word).map((ch) => ({ ch, d: STAG * i++ })))
    );
    return { texts, lines, chars: i };
  }, [children]);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const h = ref.current;
    if (!h) return;
    // Re-sync after any render: if a className change rewrote the attribute,
    // this puts the revealed class back before the browser paints a retreat.
    h.classList.toggle(styles.go, revealedRef.current);

    const inners = Array.from(
      h.getElementsByClassName(styles.rlnI)
    ) as HTMLElement[];

    const stopMelt = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      for (const el of inners) el.style.filter = "";
    };

    const melt = () => {
      const d = dispRef.current;
      if (!MELT || !d) return;
      stopMelt();
      const total = DUR + STAG * model.chars;
      for (const el of inners) el.style.filter = `url(#${filterId})`;
      // Elapsed time accumulates per frame instead of measuring from a fixed
      // start, so the decay freezes under html[data-paused] (the
      // VisibilityPause convention) rather than jumping to done on resume.
      let elapsed = 0;
      let prev = performance.now();
      const step = (now: number) => {
        if (!document.documentElement.hasAttribute("data-paused")) {
          elapsed += now - prev;
        }
        prev = now;
        const k = Math.min(elapsed / total, 1);
        d.setAttribute("scale", (MELT * Math.pow(1 - k, 2.4)).toFixed(2));
        if (k < 1) {
          rafRef.current = requestAnimationFrame(step);
          return;
        }
        rafRef.current = null;
        // Out of the filter pipeline entirely — crisp at rest.
        for (const el of inners) el.style.filter = "";
      };
      rafRef.current = requestAnimationFrame(step);
    };

    // Reveal at 30% in, but re-arm only once the headline is COMPLETELY
    // clear. isIntersecting flips false at the 0.3 boundary, so a version
    // keyed on it reset while a third of the line was still on screen and
    // the reader watched it happen. Watching both boundaries separates the
    // two decisions. The revealed check also guards the melt: the callback
    // fires at every boundary crossing, and re-running it on an
    // already-revealed headline restarts the filter.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.3) {
            if (!revealedRef.current) {
              revealedRef.current = true;
              h.classList.add(styles.go);
              melt();
            }
            continue;
          }
          if (e.intersectionRatio === 0) {
            revealedRef.current = false;
            h.classList.remove(styles.go);
          }
        }
      },
      { threshold: [0, 0.3] }
    );
    io.observe(h);

    return () => {
      io.disconnect();
      stopMelt();
    };
  }, [reduced, model, filterId, className]);

  // Reduced motion gets the final state with no split: real text, one block
  // span per authored line so the line structure the animation would have
  // ended on is the structure the reader gets. (.rln's mask padding nets to
  // zero layout, so metrics match the animated version exactly.)
  if (reduced) {
    return (
      <Tag className={className}>
        {model.texts.map((t, i) => (
          <span key={i} className={styles.rln}>
            {t}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={className ? `${styles.head} ${className}` : styles.head}
      aria-label={model.texts.join(" ")}
    >
      {model.lines.map((words, li) => (
        <span key={li} className={styles.rln} aria-hidden="true">
          <span className={styles.rlnI}>
            {words.map((chars, wi) => (
              <Fragment key={wi}>
                {/* A real space between word spans: it is what the line
                    wraps at, and what copy-paste reads. */}
                {wi > 0 ? " " : null}
                <span className={styles.rwd}>
                  {chars.map((c, ci) => (
                    <span
                      key={ci}
                      className={styles.rch}
                      style={{ "--d": `${c.d}ms` } as CSSProperties}
                    >
                      {c.ch}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
        </span>
      ))}
      {/* The melt filter, one instance per headline. Values are the nav
          chain's: fractalNoise 0.015 0.025, three octaves, seed 8, blur 2.
          Only `scale` animates, driven by the rAF loop above. */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute" }}
      >
        <filter
          id={filterId}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.025"
            numOctaves={3}
            seed={8}
            result="n"
          />
          <feGaussianBlur in="n" stdDeviation={2} result="sm" />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="sm"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </Tag>
  );
}
