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
  /**
   * "phone" masks the stage to a handset: the device's own 1320x2868,
   * centred, with a bezel. A.R.C. is a phone app, so a full-bleed
   * landscape stage was making the reader do the translation — it read
   * as a website in a box, and the app's mobile layout was being shown
   * at a width it never sees in use.
   *
   * NO NOTCH, deliberately, and this is where it differs from the demo
   * package's own frame. Those components draw one because their clips
   * were captured with no device chrome baked in, so the notch is the
   * only thing making them read as a handset. Here the frame holds a
   * LIVE app, and a notch is an opaque shape laid over the top of its
   * real header. A bezel and a corner radius say handset without
   * covering anything the reader came to use.
   */
  frame?: "wide" | "phone";
}

export function PressingLiveApp({
  src,
  title,
  origin,
  poster,
  posterAlt,
  tall = 78,
  instruction,
  frame = "wide",
}: PressingLiveAppProps) {
  const [live, setLive] = useState(false);
  const phone = frame === "phone";

  const inner = (
    <>
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
            aria-label={`Open the A.R.C. app, served from ${origin}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster} alt={posterAlt} loading="lazy" decoding="async" />
            <span className={styles.veil} />
            {/* "Load the live product" was the same register as the
                footnote it sits under: a description of what the code
                does. This is a button on a picture of a phone. */}
            <span className={styles.cta}>
              <span className={styles.dot} aria-hidden="true" />
              Open the app
            </span>
          </button>
        )}
    </>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.lbl}>{title}</span>
        <span className={`${styles.lbl} ${styles.origin}`}>{origin}</span>
      </div>

      <div
        className={`${styles.stage} ${phone ? styles.phoneStage : ""}`}
        style={{ "--tall": `${tall}dvh` } as CSSProperties}
      >
        {phone ? (
          <div className={styles.phoneBody}>
            <div className={styles.phoneScreen}>{inner}</div>
          </div>
        ) : (
          inner
        )}
      </div>

      {/* SAY WHAT IT IS, IN THE READER'S TERMS. This line used to read
          "the frame stays empty until you ask for it, so nothing loads
          from another origin on the way past", which explains a build
          decision to someone who did not ask for one. Whether a page
          makes a third-party request before a click is my problem, not
          theirs. What they need to know is that the thing in the phone
          is the real app and they are allowed to touch it.

          "Not a prototype of it" also went. That construction is spent:
          A.R.C. already owns "not a prototype, not a demo" once, and the
          copy rules keep it to once. */}
      <p className={styles.foot}>
        {live ? (
          <>
            This is the real app, running on a sample home.{" "}
            {instruction ? <strong>{instruction}</strong> : null}{" "}
            <a href={src} target="_blank" rel="noopener noreferrer">
              Open it in its own tab
            </a>
            .
          </>
        ) : (
          <>
            The real app, with a sample home already in it. Click to load
            it and have a look around.
          </>
        )}
      </p>
    </div>
  );
}

export default PressingLiveApp;
