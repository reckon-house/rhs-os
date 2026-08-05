"use client";

/**
 * BodyReveal — the .bcr body-copy system from public/lab/swiss-spread.html.
 * Paragraphs enter the way the headlines do, one register down: each
 * RENDERED line rises through its own mask. No melt and no per-character
 * stagger — that is the headline's signature, and at reading size the words
 * themselves should not perform.
 *
 * Lines are cut at runtime so they are the real rendered lines: word spans
 * are laid in first only to read which words share an offsetTop, then the
 * element is rebuilt as one mask per line. Re-cut on resize (only when the
 * element's width actually changed — a re-cut mid-read at the same width
 * rebuilds identical lines for nothing) and again once fonts settle.
 *
 * Arrival is a strict queue shared by every instance on the page: an element
 * starts a fixed beat after the one before it, however many entered the
 * viewport together, so side-by-side columns cascade instead of firing as
 * one. The queue advances by how much there is to read — a paragraph earns
 * the full 90ms beat, a one-liner gets 38ms, because at 90ms each a
 * fourteen-row ledger took over a second and read as a list being typed out.
 * Re-arms only once fully out of view, the lesson from the headline blink.
 *
 * Beyond the prototype: children may contain <br>. Each <br>-separated
 * segment is measured as its own unit instead of bailing (the prototype
 * skipped these elements; the closing lists need them). Other inline markup
 * is flattened to text, exactly as the prototype's textContent split did.
 *
 * Trigger is a viewport IntersectionObserver, which is safe even though the
 * page scrolls inside <main>: main spans the whole viewport, so the two
 * intersection tests are the same. No scroll listener, no Lenis coupling.
 * The only timers are the queue's sub-100ms beats, so there is no rAF loop
 * to gate on html[data-paused].
 */

import {
  isValidElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./reveal.module.css";

const STAG = 45; // ms per line within one element
const BEAT_MULTI = 90; // queue beat earned by a multi-line element
const BEAT_SINGLE = 38; // queue beat for a one-liner

/* One queue for the whole page, on purpose: module scope is what makes two
   BodyReveals that entered on the same frame cascade instead of firing
   together. performance.now() timestamps only ever ratchet forward through
   Math.max, so a stale value from a previous route costs nothing. */
let queueLast = 0;

/* The split rewrites the DOM under React, so it must never run during SSR.
   useLayoutEffect on the client keeps the cut ahead of paint. */
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Flattens children to plain-text segments, splitting at <br>. Nested inline
   elements contribute their text and nothing else — same flattening the
   prototype got from textContent. Empty segments (doubled <br>s, stray
   whitespace) are dropped. */
function segmentsFrom(children: ReactNode): string[] {
  const segs: string[] = [];
  let buf = "";
  const push = () => {
    segs.push(buf.replace(/\s+/g, " ").trim());
    buf = "";
  };
  const walk = (node: ReactNode) => {
    if (node == null || typeof node === "boolean") return;
    if (typeof node === "string" || typeof node === "number") {
      buf += String(node);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (isValidElement(node)) {
      if (node.type === "br") {
        push();
        return;
      }
      walk((node as ReactElement<{ children?: ReactNode }>).props.children);
    }
  };
  walk(children);
  push();
  return segs.filter((s) => s.length > 0);
}

/* Lays word spans in (with <br> restored between segments so the wrap being
   measured is the real one), groups them by offsetTop, then rebuilds the
   element as one mask per rendered line. Returns the line count — the queue
   needs it to pick a beat. */
function cut(el: HTMLElement, segs: string[]): number {
  el.innerHTML = segs
    .map((seg) =>
      seg
        .split(" ")
        .map((w) => `<span data-bw>${esc(w)}</span>`)
        .join(" ")
    )
    .join("<br>");
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
  /* Joined with a SPACE, not "". The lines are blocks, so whitespace between
     them collapses away and nothing moves — but it survives in textContent,
     which is what copy-paste, find-in-page and a screen reader actually
     read. Without it a wrapped row came back as "Awwwards Honors,2026":
     correct on screen, welded underneath. Do not regress this. */
  el.innerHTML = groups
    .map(
      (g, i) =>
        `<span class="${styles.bl}"><span class="${styles.bli}" style="--d:${
          i * STAG
        }ms">${esc(g.join(" "))}</span></span>`
    )
    .join(" ");
  return groups.length;
}

/* Curated rather than keyof IntrinsicElements: the full union blows past
   TS2590 when JSX expands it, and the prototype only ever ran this on prose
   tags anyway (p, h3, h4, li, label). Extend the list as sections need. */
type BodyTag =
  | "p"
  | "h3"
  | "h4"
  | "h5"
  | "li"
  | "label"
  | "span"
  | "div"
  | "figcaption"
  | "dt"
  | "dd";

interface BodyRevealProps {
  /** The rendered tag — p by default; the prototype also ran this on h3, h4, li and label. */
  as?: BodyTag;
  className?: string;
  children: ReactNode;
}

export function BodyReveal({ as = "p", className, children }: BodyRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const lineCountRef = useRef(1);
  const [reduced, setReduced] = useState(false);

  const segs = useMemo(() => segmentsFrom(children), [children]);
  // Keying the element on the derived text forces a clean remount when
  // children change: React never has to reconcile against the innerHTML this
  // component rewrote behind its back.
  const srcKey = segs.join("") + "|" + reduced;

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useIsoLayoutEffect(() => {
    // The live query, not just the state: state lags one paint behind, and
    // reduced motion should never see even one split frame. Bailing leaves
    // the raw children rendered — the final state, no split.
    if (reduced || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const el = ref.current;
    if (!el || !segs.length) return;

    let width = 0;
    const resplit = () => {
      lineCountRef.current = cut(el, segs);
      width = el.clientWidth;
    };
    // With the on class already present a re-cut inserts lines at their
    // final transform, so nothing replays mid-read.
    resplit();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.25) {
            // IntersectionObserver only ADMITS elements to the queue — the
            // queue owns the rhythm. The timer guard keeps a boundary
            // re-cross from double-booking a slot.
            if (
              !el.classList.contains(styles.on) &&
              timerRef.current === null
            ) {
              const now = performance.now();
              const beat =
                lineCountRef.current > 1 ? BEAT_MULTI : BEAT_SINGLE;
              const at = Math.max(now, queueLast + beat);
              queueLast = at;
              timerRef.current = window.setTimeout(() => {
                timerRef.current = null;
                el.classList.add(styles.on);
              }, at - now);
            }
          } else if (e.intersectionRatio === 0) {
            el.classList.remove(styles.on);
            // A queued arrival for an element that left before its beat
            // would reveal it off screen and burn the re-arm. Withdraw it.
            if (timerRef.current !== null) {
              window.clearTimeout(timerRef.current);
              timerRef.current = null;
            }
          }
        }
      },
      { threshold: [0, 0.25] }
    );
    io.observe(el);

    const onResize = () => {
      if (el.clientWidth !== width) resplit();
    };
    window.addEventListener("resize", onResize);

    // Satoshi loads late enough to move wrap points; re-cut once it lands.
    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (alive) resplit();
      });
    }

    return () => {
      alive = false;
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [srcKey]);

  // The cast to "p" is a type-level stand-in only — the runtime tag is `as`.
  // Typing the union directly makes TypeScript expand IntrinsicElements past
  // its complexity limit (TS2590), and every BodyTag shares the prop surface
  // used here (className, ref, children).
  const Tag = as as "p";
  return (
    <Tag
      key={srcKey}
      ref={ref as React.RefObject<HTMLParagraphElement | null>}
      className={
        [reduced ? null : styles.bcr, className].filter(Boolean).join(" ") ||
        undefined
      }
    >
      {children}
    </Tag>
  );
}
