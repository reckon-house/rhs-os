"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Masthead.module.css";

/* ------------------------------------------------------------------ */
/*  Masthead                                                           */
/*                                                                     */
/*  The Pressing C top bar, ported from public/lab/swiss-spread.html:  */
/*    • 54px sticky bar — wordmark left, section links center, mailto  */
/*      right. Full-bleed past main's gutters via hero-breakout math.  */
/*    • The burn pill: a backdrop-filter lens behind the type, driven  */
/*      by a heat value that climbs while the page scrolls and decays  */
/*      in three stages after it stops. Invisible over flat cream;     */
/*      over photography it goes off.                                  */
/*    • Dark-zone reversal: ink flips to paper while any               */
/*      [data-nav-dark] element overlaps the bar's band, crossfaded    */
/*      by the module's 0.28s color transition.                        */
/*                                                                     */
/*  Mount it as a direct child of SmoothScroll's content div, before   */
/*  {children} — sticky pins against <main>, the Lenis scroller, and   */
/*  a per-page wrapper would end the stick at that page's bounds.      */
/* ------------------------------------------------------------------ */

const CENTER_LINKS = [
  { label: "Work", href: "/" },
  { label: "Info", href: "/info" },
  { label: "Staples", href: "/inspiration" },
];

/* Work is the portfolio itself, so it owns the homepage and everything the
   homepage grid links into: case studies and category pages. */
function linkIsActive(href: string, pathname: string): boolean {
  if (href === "/") {
    return (
      pathname === "/" ||
      pathname.startsWith("/case-studies") ||
      pathname.startsWith("/category")
    );
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export function Masthead() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const burnRef = useRef<HTMLDivElement>(null);
  const [overDark, setOverDark] = useState(false);

  // ── The nav-burn heat driver, values straight from the prototype. ──
  useEffect(() => {
    const burn = burnRef.current;
    if (!burn) return;

    // Under prefers-reduced-motion the burn stays cold: heat pinned to 0,
    // the driver never writes, and the pill rests at the stylesheet's
    // neutral filter values. The reversal driver below still runs —
    // legibility over the dark footer is not motion.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReducedChange = () => {
      if (!reduced.matches) return;
      // Drop the inline styles so the module's rest state shows through.
      burn.style.backdropFilter = "";
      burn.style.removeProperty("-webkit-backdrop-filter");
      burn.style.background = "";
    };
    reduced.addEventListener("change", onReducedChange);

    let heat = 0;
    let lastScroll = 0;
    let raf = 0;

    const onInput = () => {
      lastScroll = Date.now();
    };

    // The page scrolls inside <main>, which Lenis owns in wrapper mode —
    // it animates native scrollTop, so scroll events fire there. A bare
    // window "scroll" listener never fires in this shell. wheel/touchmove
    // on window catch the gesture a beat before the scroller moves.
    const main = document.querySelector("main");
    main?.addEventListener("scroll", onInput, { passive: true });
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("touchmove", onInput, { passive: true });

    const tick = () => {
      raf = requestAnimationFrame(tick);
      // The VisibilityPause convention: freeze while html[data-paused] is
      // set, so a backgrounded tab spends nothing on the burn.
      if (document.documentElement.hasAttribute("data-paused")) return;
      if (reduced.matches) {
        heat = 0;
        return;
      }

      // Three stages: climb hard while moving, hold with a slow bleed for
      // two seconds after you stop, then fade out properly. The middle
      // stage is what stops it flickering on and off during short bursts.
      const since = Date.now() - lastScroll;
      if (since < 500) heat += (1 - heat) * 0.06;
      else if (since < 2500) heat += (0 - heat) * 0.015;
      else heat += (0 - heat) * 0.03;
      if (heat < 0.005) heat = 0;

      const sat = 1 + heat * 7;
      const con = 1 + heat * 2;
      const blr = heat * 4;
      const css = `blur(${blr}px) saturate(${sat}) contrast(${con})`;
      // CSS-native filters work on all browsers; the SVG displacement is
      // progressive enhancement. Safari cannot resolve the url() reference
      // in backdrop-filter, so the -webkit- property skips it (the same
      // guard NavRail ships).
      burn.style.backdropFilter = `url(#mastheadMelt) ${css}`;
      burn.style.setProperty("-webkit-backdrop-filter", css);
      burn.style.background = `rgba(243, 240, 237, ${0.05 + heat * 0.1})`;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      reduced.removeEventListener("change", onReducedChange);
      main?.removeEventListener("scroll", onInput);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("touchmove", onInput);
    };
  }, []);

  // ── The nav reverses over dark ground. Ink type is invisible on the
  // black footer; rather than sampling pixels, dark blocks declare
  // themselves with [data-nav-dark] and this checks whether any of them
  // currently overlaps the bar. Scroll-driven with an rAF debounce, the
  // same sampling shape as NavRail's overDark driver. ──
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    let raf = 0;
    // Starts null so the first check always commits, even when the answer
    // matches a previous route's stale state.
    let last: boolean | null = null;

    const check = () => {
      const nav = navRef.current;
      if (!nav) return;
      // The test is the nav's BAND, not its box: the burn pill is inset
      // from the bar's full height, and using the box flips the type a few
      // pixels before the dark edge actually arrives under it.
      const b = nav.getBoundingClientRect();
      const top = b.top + 6;
      const bot = b.bottom - 6;
      let hit = false;
      for (const el of Array.from(document.querySelectorAll("[data-nav-dark]"))) {
        const r = el.getBoundingClientRect();
        // A zero-height zone is a fill before it has risen; skip it.
        if (r.height < 2) continue;
        if (r.top < bot && r.bottom > top) {
          hit = true;
          break;
        }
      }
      if (hit !== last) {
        last = hit;
        setOverDark(hit);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };

    // Zones are queried fresh on every check, so re-running on route change
    // is all it takes to pick up a new page's dark blocks.
    check();
    main.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      main.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <>
      {/* The melt: turbulence displacing whatever the burn pill has behind
          it. Its own id — the id is namespaced so any future second burn surface cannot collide. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter
          id="mastheadMelt"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.025"
            numOctaves="3"
            seed="8"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="smoothNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="smoothNoise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <nav
        ref={navRef}
        className={overDark ? `${styles.nav} ${styles.rev}` : styles.nav}
      >
        <div ref={burnRef} className={styles.burn} aria-hidden="true" />
        <Link href="/" className={styles.mark}>
          Reckon House Staples
        </Link>
        <div className={styles.links}>
          {CENTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkIsActive(link.href, pathname) ? styles.on : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <a className={styles.meta} href="mailto:hello@reckon.house">
          hello@reckon.house
        </a>
      </nav>
    </>
  );
}
