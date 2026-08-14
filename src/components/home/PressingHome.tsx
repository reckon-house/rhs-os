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
 *   · the page transition. Its panels are PressingTransition's, in the
 *     shell, because every route needs them. This page rendered a
 *     second pair with the same id for a while, which is why the
 *     sequence appeared dead: getElementById returned the homepage's
 *     copy, and the handler was bound to the shell's.
 *
 * The lab keeps its own copies of all three so it can still be opened
 * alone and tuned. That is the one duplication in this arrangement,
 * and it is the correct one: a spec you cannot run is not a spec.
 */

import { useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { initPressingHome } from "./pressingHomeDriver";
import { DAYBOOK_STRIP, dayLabel } from "@/data/daybook";
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

          {/* THE COMPOSE BOX, shown only when the contact intent fires.
              The field they typed the question into is the field that
              takes the message: no /contact page, no context switch, and
              the questions they already asked travel with it so the
              message does not arrive cold.

              Driven imperatively like everything else in the answer
              area — the driver reveals it, fills nothing, and swaps it
              for the thread link on success. React renders the shell and
              then stays out of it.

              `company` is the honeypot: off-screen, meaningless to a
              person, irresistible to a script. aria-hidden and
              tabIndex -1 keep it away from assistive tech. */}
          <form className="cmp" id="ansCompose" hidden>
            <div className="cmprow">
              <label className="cmplbl" htmlFor="cmpName">Name</label>
              <input className="cmpf" id="cmpName" type="text" name="name"
                placeholder="Your name" maxLength={120} autoComplete="name" />
            </div>
            <div className="cmprow">
              <label className="cmplbl" htmlFor="cmpMail">Email</label>
              <input className="cmpf" id="cmpMail" type="email" name="email"
                placeholder="So I can write back" maxLength={254}
                autoComplete="email" />
            </div>
            <div className="cmprow">
              <label className="cmplbl" htmlFor="cmpBody">Message</label>
              <textarea className="cmpf cmpbody" id="cmpBody" name="body" rows={4}
                placeholder="What are you working on?" maxLength={4000} required />
            </div>
            <input className="cmphp" id="cmpCo" type="text" name="company"
              tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="cmpfoot">
              <span />
              <div className="cmpact">
                <button className="cmpsend" id="cmpSend" type="submit">Send</button>
                <span className="cmpnote" id="cmpNote" />
              </div>
            </div>
          </form>

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

      {/* THE DAYBOOK. The one stratum that is not work: what got built
          lately, dated, with the project that got it. It closes the page
          rather than opening it, because the ring above is the argument
          and this is the evidence the ring is still being added to.

          Two entries, and no picture. Under an index made of pictures a
          third thumbnail would join that grid instead of breaking from
          it, and the block's whole job is to be the text on a page of
          images. The reading happens at /daybook.

          The strip is a SLICE of the same list the page renders, so the
          two can never disagree about what shipped. A post's title and
          paragraphs are dropped here on purpose: the strip carries the
          first line and the page carries the argument. */}
      <section className="hero-breakout stratum" id="stDaybook">
        <div className="shead">
          <span className="slbl">Daybook</span>
          <Link className="slink" href="/daybook">
            The full log &rarr;
          </Link>
        </div>
        <div className="dbrows">
          {DAYBOOK_STRIP.map((e) => (
            <article className="dbrow" key={e.id}>
              <span className="dbd">{dayLabel(e.date)}</span>
              <p className="dbt">
                {Array.isArray(e.body) ? e.body[0] : e.body}
              </p>
              <span className="dbp">{e.project}</span>
            </article>
          ))}
        </div>
      </section>

    </>
  );
}
