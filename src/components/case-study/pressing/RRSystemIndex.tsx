"use client";

/**
 * RRSystemIndex — the Robert Rodriguez system index, ported from the
 * `.index` section of public/lab/swiss-spread.html. Three ledger rows,
 * each a label beside a LIVE sample of the thing it names: the logotype
 * assembling between its Archer cuts, the palette morphing shape and
 * colour together, and a mini Faux Reel re-shaping to each frame's
 * native ratio. Bespoke to Robert Rodriguez by design — the house
 * pattern for rich showcase sections — so the row labels, captions, the
 * lockup outlines, and the palette states are hardcoded here on purpose.
 * Only the reel's frames and colours arrive via props.
 *
 * The rows arrive as hairline rules that draw themselves in, staggered
 * top to bottom, admitted once by an IntersectionObserver at the
 * prototype's 0.18 threshold. That observer is viewport-rooted, which is
 * safe even though the page scrolls inside <main>: main spans the whole
 * viewport, so the two intersections are the same test. No scroll
 * listener, so Lenis never enters the picture.
 *
 * The two cycle animations (lockup, palette) run on the shared scrub
 * loop via onTick rather than their own requestAnimationFrame, and keep
 * time by accumulating capped deltas — so under html[data-paused] the
 * clock simply stops, and a resume carries on from where it paused
 * instead of fast-forwarding through the missed frames. The reel keeps
 * its own timers; pausing (and reduced motion) there is SizzleReel's
 * business: its stylesheet flattens every transition to a hard cut under
 * prefers-reduced-motion while the beat clock keeps stepping.
 *
 * prefers-reduced-motion here: the lockup renders assembled and holds,
 * the palette holds its first state, and the hairline rules render drawn
 * (module CSS covers the pre-hydration frames).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { onTick, reducedMotion } from "@/lib/scrub";
import { CX, CY, outline, profile, toPath, rgb, type Pt } from "@/lib/swatch-morph";
import { SectionMark } from "@/components/fx/SectionMark";
import { SizzleReel, type SizzleBeat } from "@/components/fx/SizzleReel";
import { ARCHER_LOCKUP } from "@/data/archer-lockup";
import styles from "./RRSystemIndex.module.css";

export interface RRSystemIndexProps {
  /** The four source frames for the Compositing row's mini reel. */
  reelImages: string[];
  /** Hexes for the reel's colour and word beats. */
  reelColors: string[];
}

/* Shared cubic ease — the prototype uses the same curve for both cycles. */
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* Minimal shape for the dynamically-imported, untyped flubber module —
   the same pattern MorphingGlyph uses. Only interpolate is needed here:
   ring counts were verified equal at extraction, so the morph never
   falls back to combine/separate. */
type Flubber = {
  interpolate: (
    from: string,
    to: string,
    opts?: { maxSegmentLength?: number }
  ) => (t: number) => string;
};

/* ── the logotype — composition, in caps em units ──────────────────
   Tuned against the real logo artwork; see the prototype's driver. */
const LOWER_SCALE = 0.38; // rodriguez size relative to the caps
const LOWER_RIGHT = 0.02; // how far past the caps' right edge it ends
const LOWER_DY = 0.12; // its baseline below the caps baseline
const PAD = 40;

/* The timed cycle: it rests on the assembled mark and only passes
   briefly through the ordinary one. */
const HOLD_LOCK = 2800;
const BACK = 650;
const HOLD_FLAT = 1200;
const FWD = 850;
const CYCLE = HOLD_LOCK + BACK + HOLD_FLAT + FWD;

/* ── the palette — four states, each a colour paired with a form ───
   Corners start SHARP. Dial `corner` up per shape once the silhouettes
   are right — it is a detail, not the defining feature — at ~40% of the
   shape the triangle stopped reading as a triangle. R is per-shape
   because equal circumradius does not mean equal optical size: a circle
   at R=41 carries the same visual weight as a square at 47 or a
   triangle at 50. Campaign values, allowed here: this section is
   bespoke to Robert Rodriguez. */
type SwatchState = {
  hex: string;
  name: string;
  sides: number;
  R: number;
  corner: number;
  rot: number;
};
const STATES: SwatchState[] = [
  { hex: "#E0552F", name: "Coral", sides: 4, R: 47, corner: 0, rot: Math.PI / 4 },
  { hex: "#F09A3E", name: "Orange", sides: 0, R: 41, corner: 0, rot: 0 }, // 0 = circle
  { hex: "#E8637A", name: "Pink", sides: 3, R: 50, corner: 0, rot: -Math.PI / 2 },
  { hex: "#241C18", name: "Ink", sides: 6, R: 44, corner: 0, rot: Math.PI / 6 },
];
const SW_HOLD = 1500;
const SW_MORPH = 800;



export function RRSystemIndex({ reelImages, reelColors }: RRSystemIndexProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [drawn, setDrawn] = useState(false);

  // logotype refs
  const fbRef = useRef<HTMLSpanElement>(null);
  const lkRef = useRef<HTMLSpanElement>(null);
  const lkSvgRef = useRef<SVGSVGElement>(null);
  const gCapsRef = useRef<SVGGElement>(null);
  const gLowerRef = useRef<SVGGElement>(null);
  const faceCapRef = useRef<HTMLSpanElement>(null);

  // palette refs
  const swatchPathRef = useRef<SVGPathElement>(null);
  const swatchCapRef = useRef<HTMLSpanElement>(null);

  // reel refs
  const reelBoxRef = useRef<HTMLSpanElement>(null);
  const ratiosRef = useRef<number[]>([]);
  const [reelReady, setReelReady] = useState(false);

  /* ── the rules draw themselves ────────────────────────────────────
     Admitted once at the prototype's threshold. Re-drawing every time
     the section scrolls back into view turns a section opener into a
     loop. Reduced motion renders them drawn without observing. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reducedMotion()) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            setDrawn(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.18 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  /* ── the logotype — the actual mark, not a specimen ───────────────
     ROBERT's caps interlock — overlapped far enough that the letters
     cross — and because Hairline strokes are hairlines you read both
     letters through each other. "rodriguez" nests into the lower right
     rather than sitting on its own line.

     The animation is the mark assembling. Book at open tracking is the
     ordinary version of the word; Hairline at tight tracking is the
     logo. Because the two cuts are baked with DIFFERENT tracking, the
     x-lerp makes the letters close up as they thin — one move, both
     ideas. If flubber fails to load or the outlines fail to parse, the
     live-text fallback simply stays. */
  useEffect(() => {
    const svg = lkSvgRef.current;
    const gC = gCapsRef.current;
    const gL = gLowerRef.current;
    const fb = fbRef.current;
    const lk = lkRef.current;
    const cap = faceCapRef.current;
    if (!svg || !gC || !gL || !fb || !lk || !cap) return;

    let cancelled = false;
    let unTick: (() => void) | null = null;
    let capTimer: ReturnType<typeof setTimeout> | undefined;
    const created: SVGPathElement[] = [];

    (async () => {
      let flMod: typeof import("flubber");
      try {
        flMod = await import("flubber");
      } catch {
        return; // live text stays
      }
      if (cancelled) return;
      // Normalise interop (ESM named vs CJS default), as MorphingGlyph does.
      const flubber = (flMod && (flMod as { interpolate?: unknown }).interpolate
        ? flMod
        : ((flMod as { default?: unknown }).default ?? flMod)) as Flubber;
      if (!flubber?.interpolate) return;

      const D = ARCHER_LOCKUP;
      const A = D.caps.cuts[0];
      const B = D.caps.cuts[1];
      const L = D.lower;
      const CAPH = Math.abs(Math.min(A.inkTop, B.inkTop));
      const LW = (L.inkR - L.inkL) * LOWER_SCALE;

      let draw: (t: number) => void;
      try {
        const mk = (parent: SVGGElement) => {
          const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
          // currentColor rather than the prototype's #000, so the mark
          // takes --pp-ink from the module stylesheet.
          el.setAttribute("fill", "currentColor");
          el.setAttribute("fill-rule", "evenodd");
          parent.appendChild(el);
          created.push(el);
          return el;
        };
        const capPaths = A.letters.map(() => mk(gC));
        // Lowercase never morphs, but it still needs ONE PATH PER LETTER
        // with a transform. Baking the pen offset into the path data by
        // rewriting each subpath's moveto only moves the start point —
        // every curve after it stays at the origin and the word collapses
        // into a blob.
        L.letters.forEach((l) => {
          const el = mk(gL);
          el.setAttribute("d", l.rings.join(" "));
          el.setAttribute("transform", `translate(${l.x} 0)`);
        });

        // Per-letter interpolators. Contour counts were verified equal at
        // extraction, so this never falls back to combine/separate.
        const hop = A.letters.map((lf, k) => {
          const lt = B.letters[k];
          return {
            fns: lf.rings.map((r, ri) =>
              flubber.interpolate(r, lt.rings[ri], { maxSegmentLength: 4 })
            ),
            xa: lf.x,
            xb: lt.x,
            la: lf.lsb,
            lb: lt.lsb,
            wa: lf.w,
            wb: lt.w,
          };
        });

        // Geometry for a given eased t: caps positions, then rodriguez
        // hung off the caps' CURRENT right edge so the two stay one mark
        // at every frame rather than drifting apart mid-morph.
        const geom = (e: number) => {
          const xs: number[] = [];
          let lo = Infinity;
          let hi = -Infinity;
          for (let k = 0; k < hop.length; k++) {
            const x = lerp(hop[k].xa, hop[k].xb, e);
            xs.push(x);
            const l = x + lerp(hop[k].la, hop[k].lb, e);
            if (l < lo) lo = l;
            const r = l + lerp(hop[k].wa, hop[k].wb, e);
            if (r > hi) hi = r;
          }
          const capsW = hi - lo;
          const lx = hi + LOWER_RIGHT * capsW - LW - L.inkL * LOWER_SCALE;
          return { xs, lo, hi, lx, ly: LOWER_DY * CAPH };
        };

        // Box the widest state so nothing clips or reflows as it breathes.
        let vbL = Infinity;
        let vbR = -Infinity;
        let vbT = Infinity;
        let vbB = -Infinity;
        for (const e of [0, 1]) {
          const g = geom(e);
          vbL = Math.min(vbL, g.lo, g.lx + L.inkL * LOWER_SCALE);
          vbR = Math.max(vbR, g.hi, g.lx + (L.inkL + (L.inkR - L.inkL)) * LOWER_SCALE);
          vbT = Math.min(vbT, e ? B.inkTop : A.inkTop, g.ly + L.inkTop * LOWER_SCALE);
          vbB = Math.max(vbB, 0, g.ly + L.inkBot * LOWER_SCALE);
        }
        const VW = vbR - vbL + PAD * 2;
        svg.setAttribute(
          "viewBox",
          `${vbL - PAD} ${vbT - PAD} ${VW} ${vbB - vbT + PAD * 2}`
        );

        draw = (t: number) => {
          const e = ease(Math.max(0, Math.min(1, t)));
          const g = geom(e);
          // Centre the whole mark on its ink, so the caps closing up does
          // not walk the lockup sideways inside its box.
          const off =
            (vbL + vbR) / 2 -
            (Math.min(g.lo, g.lx + L.inkL * LOWER_SCALE) +
              Math.max(g.hi, g.lx + L.inkR * LOWER_SCALE)) /
              2;
          for (let k = 0; k < capPaths.length; k++) {
            capPaths[k].setAttribute("d", hop[k].fns.map((fn) => fn(e)).join(" "));
            capPaths[k].setAttribute(
              "transform",
              `translate(${(g.xs[k] + off).toFixed(1)} 0)`
            );
          }
          gL.setAttribute(
            "transform",
            `translate(${(g.lx + off).toFixed(1)} ${g.ly.toFixed(1)}) scale(${LOWER_SCALE})`
          );
        };
      } catch {
        // Outlines failed to parse into a morph: remove any half-built
        // paths and let the live-text fallback stand.
        created.forEach((el) => el.remove());
        created.length = 0;
        return;
      }

      // Draw before revealing — swapping first leaves one empty frame,
      // and that blank frame reads as a blink.
      const FLAT = A.name;
      const LOCKED = "Hairline over Book";
      draw(1);
      cap.textContent = LOCKED;
      fb.hidden = true;
      lk.hidden = false;

      // Reduced motion rests on the assembled mark and never cycles.
      if (reducedMotion()) return;

      let elapsed = 0;
      let last: number | null = null;
      let named = LOCKED;
      let lastT = 1;

      unTick = onTick(() => {
        // Delta-accumulated clock: onTick stops under html[data-paused],
        // and capping the gap keeps a resume from fast-forwarding the
        // cycle through everything it missed.
        const now = performance.now();
        if (last != null) elapsed += Math.min(now - last, 100);
        last = now;

        const el = elapsed % CYCLE;
        let t: number;
        let label: string;
        if (el < HOLD_LOCK) {
          t = 1;
          label = LOCKED;
        } else if (el < HOLD_LOCK + BACK) {
          t = 1 - (el - HOLD_LOCK) / BACK;
          label = t < 0.5 ? FLAT : LOCKED;
        } else if (el < HOLD_LOCK + BACK + HOLD_FLAT) {
          t = 0;
          label = FLAT;
        } else {
          t = (el - HOLD_LOCK - BACK - HOLD_FLAT) / FWD;
          label = t > 0.5 ? LOCKED : FLAT;
        }

        // Name the state as it crosses, not after it lands — after reads
        // late.
        if (label !== named) {
          named = label;
          cap.style.opacity = "0";
          clearTimeout(capTimer);
          capTimer = setTimeout(() => {
            cap.textContent = label;
            cap.style.opacity = "1";
          }, 170);
        }
        // The holds sit at exactly 0 or 1, so skipping repeat values
        // spares the shared loop six letters of flubber per held frame.
        if (t !== lastT) {
          lastT = t;
          draw(t);
        }
      });
    })();

    return () => {
      cancelled = true;
      unTick?.();
      clearTimeout(capTimer);
      created.forEach((el) => el.remove());
      // Put the swap back so a strict-mode remount starts from the
      // fallback state it expects.
      fb.hidden = false;
      lk.hidden = true;
    };
  }, []);

  /* ── the palette — colour AND shape ───────────────────────────────
     Shapes are sampled as POLAR PROFILES: a radius for each of 180
     angles around the centre, so the morph is a per-angle lerp. */
  useEffect(() => {
    const pathEl = swatchPathRef.current;
    const cap = swatchCapRef.current;
    if (!pathEl || !cap) return;

    const profiles = STATES.map((st) => profile(outline(st.sides, st.R, st.corner, st.rot)));
    const cols = STATES.map((st) => rgb(st.hex));
    const n = STATES.length;

    const setFrame = (sa: number, sb: number, e: number) => {
      const a = profiles[sa];
      const b = profiles[sb];
      pathEl.setAttribute("d", toPath(a.map((v, i) => v + (b[i] - v) * e)));
      const c0 = cols[sa];
      const c1 = cols[sb];
      pathEl.setAttribute(
        "fill",
        `rgb(${c0.map((v, i) => Math.round(v + (c1[i] - v) * e)).join(",")})`
      );
    };

    cap.textContent = `${STATES[0].name} · ${STATES[0].hex}`;
    setFrame(0, 1, 0);

    // Reduced motion holds the first state.
    if (reducedMotion()) return;

    let seg = 0;
    let elapsed = 0;
    let fired = false;
    let last: number | null = null;
    let lastE = -1;
    let lastSeg = -1;
    let capTimer: ReturnType<typeof setTimeout> | undefined;

    const unTick = onTick(() => {
      const now = performance.now();
      if (last != null) elapsed += Math.min(now - last, 100);
      last = now;

      let t: number;
      if (elapsed < SW_HOLD) t = 0;
      else if (elapsed < SW_HOLD + SW_MORPH) {
        t = (elapsed - SW_HOLD) / SW_MORPH;
        if (!fired && t > 0.35) {
          fired = true;
          const nx = STATES[(seg + 1) % n];
          cap.style.opacity = "0";
          clearTimeout(capTimer);
          capTimer = setTimeout(() => {
            cap.textContent = `${nx.name} · ${nx.hex}`;
            cap.style.opacity = "1";
          }, 190);
        }
      } else {
        seg = (seg + 1) % n;
        elapsed = 0;
        t = 0;
        fired = false;
      }

      const e = ease(t);
      // The hold sits at a constant frame; skip the repeat writes.
      if (e === lastE && seg === lastSeg) return;
      lastE = e;
      lastSeg = seg;
      setFrame(seg, (seg + 1) % n, e);
    });

    return () => {
      unTick();
      clearTimeout(capTimer);
    };
  }, []);

  /* ── compositing — the reel, re-shaping to each frame's ratio ─────
     Ratios are read from the files themselves before the reel mounts,
     so the first beat already lands on a correctly-shaped box. Colour
     and title beats carry no image — the box holds its current shape
     through them rather than snapping to some default. */
  const shape = useCallback((i: number) => {
    const box = reelBoxRef.current;
    const r = ratiosRef.current[i];
    if (box && r) {
      box.style.height = `${(box.getBoundingClientRect().width / r).toFixed(1)}px`;
    }
  }, []);

  const reelKey = reelImages.join("|");
  useEffect(() => {
    let cancelled = false;
    ratiosRef.current = [];
    Promise.all(
      reelImages.map(
        (src, i) =>
          new Promise<void>((res) => {
            const im = new window.Image();
            im.onload = () => {
              ratiosRef.current[i] = im.naturalWidth / im.naturalHeight;
              res();
            };
            im.onerror = () => res();
            im.src = src;
          })
      )
    ).then(() => {
      if (cancelled) return;
      shape(0);
      setReelReady(true);
    });
    return () => {
      cancelled = true;
    };
    // reelKey captures the meaningful contents of reelImages.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reelKey, shape]);

  const onBeat = useCallback(
    (_i: number, beat: SizzleBeat) => {
      if (beat.img != null) shape(beat.img);
    },
    [shape]
  );

  const cls = drawn ? `${styles.index} ${styles.drawn}` : styles.index;

  return (
    <section ref={rootRef} className={cls}>
      <span className={styles.slabel}>
        {/* "05b" renders as "5b" in the disc — the prototype's own
            leading-zero drop, so the label matches its section family. */}
        <SectionMark n="05b" name="The System" />
      </span>

      <div
        className={`${styles.wrap} ${styles.first}`}
        style={{ "--rd": "1.2s" } as React.CSSProperties}
      >
        <div className={styles.row} style={{ "--indent": "3vw" } as React.CSSProperties}>
          <span>Logotype</span>
          <span className={`${styles.sample} ${styles.lockSample}`}>
            <span ref={fbRef} className={styles.fb}>
              Robert
              <br />
              rodriguez
            </span>
            <span ref={lkRef} className={styles.lk} hidden>
              <svg ref={lkSvgRef} aria-hidden="true">
                <g ref={gCapsRef} />
                <g ref={gLowerRef} />
              </svg>
            </span>
            <span ref={faceCapRef} className={styles.cap}>
              &nbsp;
            </span>
          </span>
        </div>
      </div>

      <div className={styles.wrap} style={{ "--rd": "2.4s" } as React.CSSProperties}>
        <div className={styles.row} style={{ "--indent": "17vw" } as React.CSSProperties}>
          <span className={styles.sample}>
            <svg className={styles.swatch} viewBox="0 0 100 100" aria-hidden="true">
              <path ref={swatchPathRef} />
            </svg>
            <span ref={swatchCapRef} className={styles.cap}>
              &nbsp;
            </span>
          </span>
          <span>Palette</span>
        </div>
      </div>

      <div className={styles.wrap} style={{ "--rd": "3.6s" } as React.CSSProperties}>
        <div className={styles.row} style={{ "--indent": "8vw" } as React.CSSProperties}>
          <span>Compositing</span>
          <span className={styles.sample}>
            <span ref={reelBoxRef} className={styles.reelBox}>
              {reelReady ? (
                <SizzleReel
                  images={reelImages}
                  colors={reelColors}
                  speed={1}
                  className={styles.reel}
                  onBeatChange={onBeat}
                />
              ) : null}
            </span>
            <span className={styles.cap}>Four source frames</span>
          </span>
        </div>
      </div>
    </section>
  );
}
