"use client";

/* ── PressingHome ───────────────────────────────────────────────────
 * The homepage. Not a port of the lab so much as the lab moved in: the
 * markup below is its body, `pressing-home.css` is its stylesheet, and
 * `pressingHomeDriver.js` is its script. That is deliberate. The lab is
 * the design spec for this page, and every previous port turned a spec
 * into a mockup the moment the two were separately maintained.
 *
 * WHAT THIS COMPONENT OWNS: the markup, and calling init() once.
 * Everything animated — the deal, the travelling field, the curtains,
 * the drift, the hover, the brain — is imperative DOM work in the
 * driver. React does not re-render any of it, which is what makes
 * mounting a two-thousand-line driver safe: nothing it writes is
 * something React will later reconcile away.
 *
 * WHAT THE SHELL OWNS, and is therefore absent here:
 *   · the masthead, including the burn and the ink reversal. The lab
 *     lifted that bar to prototype against; the real one is
 *     Masthead.tsx, and the question field travels into it.
 *   · the footer's contact and credits beats, from PressingFooter.
 *   · scrolling. Lenis owns <main>, so nothing here writes scrollTop.
 *
 * The lab keeps its own copies of all three so it can still be opened
 * alone and tuned. That is the one duplication in this arrangement,
 * and it is the correct one: a spec you cannot run is not a spec.
 */

import { useEffect } from "react";
import Script from "next/script";
import { initPressingHome } from "./pressingHomeDriver";
import "./pressing-home.css";

export function PressingHome() {
  useEffect(() => {
    /* The ground. This page is white paper on pure black type, and the
       rest of the site is not — so the flag goes on <html>, where it
       can paint behind the sticky masthead too. Without it the shell's
       textured ground shows through the bar's translucent burn. */
    document.documentElement.classList.add("rh-home");
    /* One effect, one init, and the teardown is real: React 18's dev
       double-invoke runs this twice, so a driver that could not be
       stopped would leave two of every timer behind. */
    const stop = initPressingHome();
    return () => {
      stop();
      document.documentElement.classList.remove("rh-home");
    };
  }, []);

  return (
    <>
      {/* The reel is a custom element, not a React component: the
          driver creates <sizzle-reel> imperatively when a frame scrolls
          near, the same way the lab does. The React SizzleReel used by
          the footer is a different surface with the same sequence, and
          giving the driver its own definition keeps the two from
          having to agree on a props contract. */}
      <Script src="/lab/sizzle-reel.js" strategy="afterInteractive" />

      {/* Every beat is hero-breakout, the same escape the footer's beats
          use. <main> carries md:px-[50px] gutters and the lab's own
          --gut is 40px; nested, that put the frames at 90px while the
          masthead's type sat at 40, which breaks the single rule this
          layout is built on — one gutter down the whole page, so an
          image's edge lines up with the type above it. Breaking out
          lets --gut be the only gutter again. */}

      {/* THE COVER. The question field is not here: it lives in the
          masthead, which is the end of its journey and the only place
          its position has to be exact. This is the room it travels
          through, and the driver measures the gap between the two. */}
      <section className="hero-breakout cover">
        <div id="askSlot" aria-hidden="true" />
        <div className="coverR">
          <span className="ledelbl">The practice</span>
          <p className="statement" id="infoLead" />
        </div>
      </section>

      {/* THE ANSWER, only in query mode. It borrows the ring's own body
          below rather than laying out differently: asking re-deals the
          same magazine, it does not load another page. */}
      <section className="hero-breakout answer">
        <div className="anshead">
          <p className="ansprose" id="ansSay" />
          <div className="ansback">
            <button type="button" id="resetQ">
              Back to the house
            </button>
          </div>
        </div>
        <div className="ixbody">
          <div className="ixnotes" id="ansNotes" />
          <div className="ixrows" id="ansRows" />
        </div>
      </section>

      {/* THE RING. The body of the homepage IS the case-study footer's
          All-work index, standing alone with the brain above it. A
          study ends at this object and home begins at it, so a reader
          who scrolls through everything arrives back at the start.
          No lede: the field is the title. */}
      <section className="hero-breakout stratum" id="stIndex">
        <div className="ixbody">
          <div className="ixnotes" id="ixNotes" />
          <div className="ixrows" id="ixRows" />
        </div>
      </section>

      {/* The page transition's two panels. What makes the sequence read
          is the order of their edges, not the number of parts. */}
      <div className="pt" id="pt" aria-hidden="true">
        <div className="ptw">
          <div className="ptstack" id="ptwT" />
        </div>
        <div className="ptb">
          <div className="ptstack" id="ptbT" />
        </div>
      </div>
    </>
  );
}
