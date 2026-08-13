"use client";

/**
 * PressingProductDemo — a scripted replay of the product, running in the page.
 *
 * The Sally study published static screenshots of the Marketing OS. These
 * are the same workflows moving: Jim answering a positioning challenge and
 * generating a homepage card, PDP Copy Studio auditing a page and having two
 * other models grade its rewrite, a campaign request assembling into a real
 * email, the Figma plugin batch-building four of them.
 *
 * WHY THIS FRAMES A DOCUMENT INSTEAD OF RENDERING COMPONENTS. The demos live
 * at public/lab/sally-demos/ and carry the portal's chrome extracted VERBATIM
 * from its own index.html — that verbatim-ness is the entire point, and it is
 * what a first pass of stylized miniatures got rejected for lacking. Porting
 * ~3,000 lines of that into components would fork the artifact from the
 * product it was copied out of, and the extracted selectors are names like
 * `.header`, `.message`, `.section-label` and `.scroll-area`, which would
 * collide with the site's own the moment they were inlined. A document
 * boundary is real isolation rather than conventional isolation, and it is
 * the same answer PressingLiveApp reached for A.R.C. one step further along.
 *
 * THREE THINGS THE FRAME HAS TO DO THAT THE BOUNDARY DOES NOT GIVE FREE:
 *
 * 1. Stand the demo down when it is off screen. The replay engine runs its
 *    own IntersectionObserver, but inside the frame that observer watches its
 *    own document, where the demo is always fully visible — so four replays
 *    would run forever, one screen apart. The parent drives it instead,
 *    through the engine's documented contract: `data-paused="true"` on the
 *    demo's host element freezes its clock. Same attribute the site sets on
 *    documentElement when the page is hidden, so that propagates too.
 *
 * 2. Scale, not reflow. These are fixed 1120px desktop interfaces with almost
 *    no media queries — the portal is not a responsive product, and pretending
 *    otherwise would misrepresent it. So the frame renders the demo at its own
 *    width and scales the whole document down to the column, the way the Figma
 *    demo scales a 600px email into a 180px slot. Never above 1: past that the
 *    UI reads as a cartoon of itself.
 *
 * 3. Stay out of the way of the wheel. An iframe eats scroll events, and a
 *    replay whose document is taller than its frame will consume the page's
 *    scroll while the reader is trying to get past it — the exact trap the
 *    A.R.C. demo already paid for. Nothing here is clickable, so the frame
 *    takes `pointer-events: none` and the question never arises.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./product-demo.module.css";

/** The demos' frames declare `max-width: 1120px`, and ?framed=1 drops the
 *  standalone page's gutter so the frame meets the stage's edges exactly. */
const STAGE_W = 1120;

export interface PressingProductDemoProps {
  /** File under /lab/sally-demos/, without the extension. */
  demo: string;
  /** What the reader is watching, named in the frame's chrome. */
  title: string;
  /** Override only if a demo lays out at a different width. */
  stageWidth?: number;
  /** One line under the frame, in plain words. */
  note?: string;
}

export function PressingProductDemo({
  demo,
  title,
  stageWidth = STAGE_W,
  note,
}: PressingProductDemoProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  /* The demo's own document height, MEASURED once it loads rather than
     declared here. A hardcoded height silently letterboxes or crops the
     moment someone retunes the lab file, and the lab file is the source. */
  const [docH, setDocH] = useState(0);
  const [scale, setScale] = useState(0);

  /* ── scale to the column ──────────────────────────────────────────── */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => {
      const w = stage.clientWidth;
      if (w > 0) setScale(Math.min(1, w / stageWidth));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [stageWidth]);

  /* ── the pause driver ─────────────────────────────────────────────── */
  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;

    let onScreen = false;

    /* The engine's host is the body-level element wrapping the stage it
       rewrites each loop. Reached by structure rather than by id, so the
       same frame carries any of the four demos (and the next one) without
       being told which. */
    const host = (): HTMLElement | null => {
      let doc: Document | null = null;
      try {
        doc = frame.contentDocument;
      } catch {
        return null; // cross-origin: not our demos, nothing to drive
      }
      if (!doc || !doc.body) return null;
      const inner = doc.querySelector("[data-stage]");
      return (
        (inner?.closest("body > *") as HTMLElement | null) ??
        (doc.body.firstElementChild as HTMLElement | null)
      );
    };

    const sync = () => {
      const el = host();
      if (!el) return;
      const paused =
        !onScreen || document.documentElement.hasAttribute("data-paused");
      if (paused) el.dataset.paused = "true";
      else delete el.dataset.paused;
    };

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0].isIntersecting;
        sync();
      },
      /* Looser than the engine's own 0.25: the frame is tall, so on a
         phone a quarter of it can be most of the screen. Any part in
         view means the reader can see it moving. */
      { threshold: 0 }
    );
    io.observe(stage);

    // The site parks every scrub on this attribute when the page is hidden.
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-paused"],
    });

    frame.addEventListener("load", sync);
    return () => {
      io.disconnect();
      mo.disconnect();
      frame.removeEventListener("load", sync);
    };
  }, []);

  /* ── measure the loaded document ──────────────────────────────────── */
  const onLoad = () => {
    const frame = frameRef.current;
    if (!frame) return;
    try {
      const d = frame.contentDocument;
      /* THE BODY, NOT documentElement. A root element's scrollHeight never
         reports less than its own viewport, and this viewport is the
         iframe, whose height is the number being measured — so reading it
         there returns the CSS fallback back unchanged, forever, and looks
         like a correct measurement. The body is content-sized and answers
         the question actually being asked. */
      if (d?.body) setDocH(d.body.scrollHeight);
    } catch {
      /* cross-origin; the CSS fallback height holds */
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.lbl}>{title}</span>
        <span className={`${styles.lbl} ${styles.tag}`}>Scripted replay</span>
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        style={
          {
            "--pd-w": `${stageWidth}px`,
            "--pd-h": docH ? `${docH}px` : undefined,
            "--pd-scale": scale || undefined,
          } as CSSProperties
        }
      >
        <iframe
          ref={frameRef}
          className={styles.frame}
          /* framed=1 tells the demo it has a host: it drops its standalone
             caption and page gutter, both of which the frame now supplies. */
          src={`/lab/sally-demos/${demo}.html?framed=1`}
          title={title}
          loading="lazy"
          onLoad={onLoad}
          /* Same-origin static files: no sandbox, because the frame's own
             document is this site's. Scripts are the demo. */
          scrolling="no"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {/* The frame is aria-hidden — a scripted replay has nothing a screen
          reader can operate, and reading out a portal's entire chrome would
          be noise. This line is what the section actually says, so it is
          the accessible content, not a caption on it. */}
      {note ? <p className={styles.foot}>{note}</p> : null}
    </div>
  );
}

export default PressingProductDemo;
