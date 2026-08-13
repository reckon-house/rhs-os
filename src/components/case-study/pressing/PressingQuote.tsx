"use client";

/**
 * PressingQuote — the quote poster knockout from
 * public/lab/swiss-spread.html (.qwrap / .q-sticky / .qfill / .quote).
 *
 * A 240dvh wrap pins its screen while an ink panel's height is scrubbed
 * from 0 to 100% up it, slightly eased (exponent 1.4) so it arrives
 * rather than slamming shut at the top. The centred quote is paper type
 * on mix-blend-mode: difference inside an isolated sticky with an
 * explicit paper background — both load-bearing, see quote.module.css —
 * so each line flips ink to paper exactly as the fill's edge passes it.
 * Nothing here sets a colour on the text; the blend does the knockout on
 * its own. The type drifts up 34px at a fraction of the fill's travel,
 * so it separates from the edge instead of riding it.
 *
 * The fill carries data-nav-dark so the masthead inverts while passing
 * over it. The attribute stays STATIC: the masthead driver skips zones
 * under 2px, so the resting 0-height fill never triggers the inversion —
 * the prototype's convention, and the reason no attribute toggling
 * happens here.
 *
 * Scroll plumbing: the page scrolls inside <main> (Lenis, wrapper mode),
 * so progress is read per frame through onTick from the shared scrub
 * driver — never a bare window scroll listener, never main.scrollTop.
 * The rect-vs-viewport math is container agnostic because <main> spans
 * the full viewport. Sticky integration constraint this file cannot
 * enforce: keep every wrapper between this section and <main> free of
 * transform, filter, and overflow clipping, or the pin silently dies.
 *
 * Under prefers-reduced-motion the section renders static: no pin, no
 * panel, the quote as ink on paper (pure CSS, so the server markup is
 * correct at any width). Width is not a factor — the fill climbs
 * vertically, which a phone carries as well as a desktop. The section mark keeps
 * SectionMark's own prop-driven ground (`dark`) instead of the
 * prototype's currentColor-through-the-blend trick — the component's API
 * is explicit that it cannot know its ground at runtime, and a static
 * prop is the port of that decision.
 */

import { Fragment, useEffect, useMemo, useRef } from "react";
import { onTick, vh } from "@/lib/scrub";
import { SectionMark } from "@/components/fx/SectionMark";
import styles from "./quote.module.css";

/* Tuned in the lab; change them only with the prototype open. */
const FILL_EXP = 1.4; // ease-out exponent on the fill's climb
const DRIFT = 34; // px the type rises across the full climb — the parallax

const clamp01 = (k: number) => (k < 0 ? 0 : k > 1 ? 1 : k);

export interface PressingQuoteProps {
  /** The quote. Newlines are line breaks — each becomes its own block. */
  text: string;
  /** Index of the line that carries the prototype's indent offset. */
  indent?: number;
  mark?: { n: string; name: string; dark?: boolean };
}

export function PressingQuote({ text, indent, mark }: PressingQuoteProps) {
  const wrapRef = useRef<HTMLElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  const lines = useMemo(
    () =>
      text
        .split("\n")
        .map((t) => t.replace(/\s+/g, " ").trim())
        .filter(Boolean),
    [text]
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const fill = fillRef.current;
    const textEl = textRef.current;
    if (!wrap || !fill || !textEl) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let lastE = -1;

    const off = onTick(() => {
      // Checked per tick rather than once: both can flip mid-session, and
      // a stale write left behind is a panel frozen mid-climb under a
      // stylesheet that thinks it is gone.
      if (reduce.matches) {
        if (lastE !== -1) {
          lastE = -1;
          fill.style.height = "";
          textEl.style.transform = "";
        }
        return;
      }
      // The VisibilityPause convention. The shared loop in scrub.ts
      // already parks itself on data-paused; this keeps the component
      // correct even if it is ever rewired to a driver that does not.
      if (document.documentElement.hasAttribute("data-paused")) return;

      const r = wrap.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - vh()));
      // Slightly eased so it arrives rather than slamming shut at the top.
      const e = 1 - Math.pow(1 - p, FILL_EXP);
      if (e === lastE) return; // skip no-op writes
      lastE = e;
      fill.style.height = (e * 100).toFixed(2) + "%";
      textEl.style.transform = `translateY(${(-e * DRIFT).toFixed(1)}px)`;
    });

    return () => {
      off();
      fill.style.height = "";
      textEl.style.transform = "";
    };
  }, []);

  return (
    // hero-breakout: the ink panel must cross the ENTIRE screen, not
    // main's content column. The breakout is width and margin only — no
    // transform — so the sticky child survives it.
    <section ref={wrapRef} className={`hero-breakout ${styles.wrap}`}>
      <div className={styles.sticky}>
        <div
          ref={fillRef}
          className={styles.fill}
          data-nav-dark=""
          aria-hidden="true"
        />
        {mark ? (
          <span className={styles.idx}>
            {/* scrollRef is REQUIRED here: inside the pinned screen the
                mark barely moves, so its sweep reads the wrap's travel. */}
            <SectionMark
              n={mark.n}
              name={mark.name}
              dark={mark.dark}
              scrollRef={wrapRef}
            />
          </span>
        ) : null}
        <p ref={textRef} className={styles.text}>
          {lines.map((ln, i) => (
            <Fragment key={i}>
              {/* A real space between the block spans: it collapses away
                  visually but survives in textContent, so copy-paste and
                  screen readers get word boundaries at the breaks. */}
              {i > 0 ? " " : null}
              <span
                className={
                  i === indent ? `${styles.line} ${styles.indent}` : styles.line
                }
              >
                {ln}
              </span>
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}
