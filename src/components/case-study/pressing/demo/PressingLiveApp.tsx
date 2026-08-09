"use client";

/**
 * PressingLiveApp — the shipped product, running in the page.
 *
 * The first attempt at this was a handful of the app's cards fed data I
 * wrote myself. Two things were wrong with it and both matter. The item
 * names were invented and paired with photographs of something else
 * entirely — fabricated content inside a working interface, which is
 * where a made-up number is most likely to be read as a real one. And
 * the interaction was backwards: it showed a list you edit, when the
 * product's actual mechanic is that you photograph a room and the model
 * tells you what is in it.
 *
 * The fix is not a better mock. A.R.C. is deployed. So this frames the
 * LIVE product, and the reader uses the real thing: the real interface,
 * the real vision model, the real valuations, on a photograph of their
 * own room. Nothing to keep in sync, nothing to invent, and the demo
 * cannot drift from the app because it IS the app.
 *
 * CLICK TO ACTIVATE, deliberately. Nothing is requested from another
 * origin until the reader asks for it: no third-party connection on
 * page load, no cost, and a heavy external app never competes with the
 * study for the first paint. The poster is the study's own photography,
 * so the slot looks intentional before it is live rather than empty.
 *
 * On the sandbox: `allow-scripts allow-same-origin` together is
 * effectively full trust of the framed origin, which is the correct
 * reading here — it is the author's own product — but it is a real
 * decision and not a default to copy onto a third party's site.
 */

import { useState, type CSSProperties } from "react";
import styles from "./live-app.module.css";

export interface PressingLiveAppProps {
  /** The deployed product. */
  src: string;
  /** What the reader is about to load, named plainly. */
  title: string;
  /** The host, shown in the frame's chrome so the origin is never hidden. */
  origin: string;
  /** A still from the study, held until the reader activates the frame. */
  poster: string;
  posterAlt: string;
  /** Height of the live stage, in viewport units. */
  tall?: number;
  /** One line under the frame: what to actually try. */
  instruction?: string;
}

export function PressingLiveApp({
  src,
  title,
  origin,
  poster,
  posterAlt,
  tall = 78,
  instruction,
}: PressingLiveAppProps) {
  const [live, setLive] = useState(false);

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.lbl}>{title}</span>
        <span className={`${styles.lbl} ${styles.origin}`}>{origin}</span>
      </div>

      <div className={styles.stage} style={{ "--tall": `${tall}dvh` } as CSSProperties}>
        {live ? (
          <iframe
            className={styles.frame}
            src={src}
            title={title}
            loading="lazy"
            /* The upload flow needs a camera on a phone and a file picker
               everywhere else; forms and scripts are what make it the
               product rather than a picture of one. */
            allow="camera; clipboard-write"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className={styles.poster}
            onClick={() => setLive(true)}
            aria-label={`Load the live product at ${origin}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster} alt={posterAlt} loading="lazy" decoding="async" />
            <span className={styles.veil} />
            <span className={styles.cta}>
              <span className={styles.dot} aria-hidden="true" />
              Load the live product
            </span>
          </button>
        )}
      </div>

      <p className={styles.foot}>
        {live ? (
          <>
            This is the shipped product, not a prototype of it.{" "}
            {instruction ? <strong>{instruction}</strong> : null}{" "}
            <a href={src} target="_blank" rel="noopener noreferrer">
              Open it in its own tab
            </a>
            .
          </>
        ) : (
          <>
            The frame stays empty until you ask for it, so nothing loads
            from another origin on the way past.
          </>
        )}
      </p>
    </div>
  );
}

export default PressingLiveApp;
