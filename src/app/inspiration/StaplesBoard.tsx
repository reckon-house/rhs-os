"use client";

/* ── House*Staples, in the homepage's own grammar ───────────────────
 * The board of saved pictures. This page and /info were the last two
 * routes still wearing the pre-redesign look: the textured cream
 * ground, a rounded section pill, a bold 20px lede, and a five-row
 * meta ledger lifted from the case-study MetaBlock. /info is gone
 * (every line on it was the homepage's left rail restated); this one
 * had something of its own to say, so it moved to Pressing C instead.
 *
 * What changed, and why each one:
 *
 *   PaperGround. The masthead is a translucent bar and its burn pill
 *   filters <html>, which the shell paints with the old textured
 *   ground. Every white page has to reach up and say so. Missing it
 *   is what put a band of the old site across the top of this one.
 *
 *   The pill and the meta ledger are gone. "SECTION 01: OVERVIEW" and
 *   Field / Saved by / Classification are case-study furniture, and a
 *   page is not a case study. The daybook does not carry them either.
 *
 *   The lede is the .statement now: claim in ink, the middle
 *   receding, the closer back in ink. Same three-part shape the
 *   homepage and the daybook open with.
 *
 *   What survived the ledger is in the rail, which is where a
 *   standing note belongs. Rights is the one fact here that lives
 *   nowhere else on the site.
 *
 * Client, and it still SSRs: the whole board is in the HTML for a
 * crawler and for anyone without a script. Arrival is layered on top
 * of a page that is complete without it.
 */

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { NowPlaying } from "@/components/NowPlaying";
import { InspirationQuoteTile } from "@/components/InspirationQuoteTile";
import { inspiration } from "@/data/inspiration";
import {
  inspirationQuotes,
  quoteInsertionPoints,
} from "@/data/inspiration-quotes";
import { getImageDimensions } from "@/data/image-dimensions";
import { useLedgerArrival } from "@/lib/ledger-arrival";
import { PaperGround } from "@/components/shell/PaperGround";
import styles from "./staples.module.css";

type Item =
  | { kind: "image"; src: string; alt: string }
  | { kind: "quote"; text: string; attribution: string; key: string };

/* Quotes are woven into the image list at their anchor points. Splicing
   runs from the END so an earlier insertion never shifts a later index,
   and a point past the list simply appends. */
function buildItems(): Item[] {
  const items: Item[] = inspiration.map((img) => ({
    kind: "image",
    src: img.src,
    alt: img.alt,
  }));

  [...quoteInsertionPoints]
    .sort((a, b) => b - a)
    .forEach((point) => {
      const idx = quoteInsertionPoints.indexOf(point);
      const quote = inspirationQuotes[idx];
      if (!quote) return;
      items.splice(Math.min(point, items.length), 0, {
        kind: "quote",
        text: quote.text,
        attribution: quote.attribution,
        key: `quote-${idx}`,
      });
    });

  return items;
}

export function StaplesBoard() {
  const items = useMemo(buildItems, []);
  const rootRef = useRef<HTMLElement | null>(null);

  useLedgerArrival(rootRef, `.${styles.tile}, .${styles.qtile}`, styles.pre);

  /* THE PAGE ENTERS. The arrival hook only ever arms what is below the
     fold, so without this the top of the page is the one part that
     never moves. Same arm-and-release contract: one frame of start
     state, then let go, with a belt timeout in case a frame is
     dropped. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    const cast = Array.from(
      root.querySelectorAll<HTMLElement>(`.${styles.enter}`)
    );
    cast.forEach((el, i) => {
      el.classList.add(styles.enterPre);
      el.style.setProperty("--dbd", `${i * 85}ms`);
    });
    const release = () =>
      cast.forEach((el) => el.classList.remove(styles.enterPre));
    requestAnimationFrame(() => requestAnimationFrame(release));
    const belt = window.setTimeout(release, 500);
    return () => window.clearTimeout(belt);
  }, []);

  return (
    <div className="pressing isolate relative w-full">
      {/* White page, so the masthead needs white behind it too. */}
      <PaperGround />
      <div
        aria-hidden
        className="hero-breakout absolute top-0 bottom-0 -z-10"
        style={{ background: "var(--pp-paper)" }}
      />

      <section
        className={`hero-breakout stratum ${styles.wrap}`}
        ref={rootRef}
      >
        <h1 className={`statement ${styles.enter}`}>
          A shelf of staples I keep coming back to.{" "}
          <span className="dim">
            The people, the work and the rooms that show up in everything I
            make, whether I notice or not.
          </span>{" "}
          Reckon*House is what gets made. House*Staples is what holds it up.
        </h1>

        <div className="ixbody">
          {/* The standing rule, pinned — the same one the homepage and
              the answer carry, with a single boundary here: the note
              rail against the column beside it. */}
          <div className="ixrules ixrule1" aria-hidden="true">
            <div className="ixrulesPin" />
          </div>
          <div className={`ixnotes ${styles.rail}`}>
            {/* One home per fact: the statement owns what this is, this
                block owns how it is kept. */}
            <div className={`blk ${styles.enter}`}>
              <span className="tag">The board</span>
              {inspiration.length} pictures and {inspirationQuotes.length}{" "}
              quotes, saved as I find them. Nothing here is sorted or
              scheduled.
            </div>
            {/* The one fact on this page that lives nowhere else on the
                site, which is why it survived the meta ledger. */}
            <div className={`blk ${styles.enter}`}>
              <span className="tag">Rights</span>
              None of it is mine and no claim is made. All credit to the
              makers.
            </div>
            <div className={`blk ${styles.enter}`}>
              <span className="tag">Get in touch</span>
              <a className={styles.mail} href="mailto:hello@reckon.house">
                hello@reckon.house
              </a>
            </div>
          </div>

          <div className={styles.board}>
            {/* The now-playing tile drops into the flow as a square album
                card. It renders nothing when there is no recent track, so
                the packing stays clean either way. */}
            <div className={styles.tile}>
              <NowPlaying />
            </div>

            {items.map((item) =>
              item.kind === "image" ? (
                (() => {
                  /* Real dimensions from the manifest let next/image
                     reserve exact space, so the masonry does not reflow
                     as it fills. Three tracks beside the rail on a wide
                     screen, two below 760. */
                  const [w, h] = getImageDimensions(item.src);
                  return (
                    <div key={item.src} className={styles.tile}>
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={w}
                        height={h}
                        sizes="(min-width: 860px) 28vw, 46vw"
                        loading="lazy"
                      />
                    </div>
                  );
                })()
              ) : (
                <div key={item.key} className={styles.qtile}>
                  <InspirationQuoteTile
                    text={item.text}
                    attribution={item.attribution}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
