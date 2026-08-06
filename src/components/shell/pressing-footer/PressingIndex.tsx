"use client";

/* ── PressingIndex — the all-work index, the page's final beat ──────
   Ported from the .fx-index block of public/lab/swiss-spread.html
   (ix-head / ix-cols / ix-pair / ix-it / ix-blk / ix-foot and its
   builder). Paper ground, after the dark contact and credits beats.

   Two [text | images] pairs. Each pair is a column of practice copy on
   the left and a stack of frames on the right, one frame per project,
   right-aligned so the column's right edge stays hard while the left
   edges rag. Widths come off a seeded ladder, so the composition is
   identical on every load — a live random would recompose the page on
   each refresh and leave nothing to judge.

   Three things separate this port from the prototype:

   • The manifest is derived from src/data/projects.ts rather than
     transcribed. A hardcoded copy goes stale the first time a project
     is added, and this block claims to be ALL work.
   • Frame ratios come from src/data/image-dimensions.ts, written to
     --ar, so every stack has its true height at first layout and
     placeText() can measure it without waiting on a single image.
   • Nothing here scrubs, so nothing subscribes to the shared rAF loop.
     The only motion is CSS transitions fired by IntersectionObserver
     and one pointer handler that writes transforms. No scroll listener
     means Lenis never enters the picture. */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { imageDimensions } from "@/data/image-dimensions";
import { getLenis } from "@/lib/lenis";
import { CHOREO_BREAKPOINT } from "@/lib/choreo";
import { reducedMotion } from "@/lib/scrub";
import { RevealHeadline } from "@/components/fx/RevealHeadline";
import { SizzleReel, type SizzleBeat } from "@/components/fx/SizzleReel";
import styles from "./PressingIndex.module.css";

/* The split rewrites nothing under React, but the text placement pass
   measures the stacks and must land before paint. useLayoutEffect warns
   on the server, so it degrades to useEffect there. */
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ── the manifest ────────────────────────────────────────────────── */

interface IndexEntry {
  id: string;
  title: string;
  category: string;
  href: string;
  image: string;
  /** "3080 / 1864" — fed to the frame's --ar. */
  ar: string;
  isReel: boolean;
}

/** Faux Reel is the one project whose frame plays. */
const REEL_HREF = "/case-studies/sizzle";

/* Every project that has somewhere to go, in the order the data file
   lists them. Projects without an href are skipped rather than rendered
   dead: this stack is thirty links, and a frame that does nothing when
   clicked is indistinguishable from a broken one.

   The frame is the site's 800px tile, keyed by id — the same path
   Thumb.tsx builds for the homepage grid, and the folder the Faux Reel
   frames below come out of. `project.image` points at the homepage's
   own small tiles instead (194 to 389px square), which are fine at
   130px in the grid and mush at 86% of this column, doubly so under a
   1.5x hover. The dimension manifest decides which one exists: no tile
   in it, fall back to the data file's own image. */
const ENTRIES: IndexEntry[] = projects
  .filter((p) => Boolean(p.href))
  .map((p) => {
    const tile = `/images/thumbnails/${p.id}.jpg`;
    const hasTile = Boolean(imageDimensions[tile]);
    const image = hasTile ? tile : p.image;
    const dim = imageDimensions[image];
    return {
      id: p.id,
      title: p.title,
      category: p.category,
      href: p.href as string,
      image,
      // Faux Reel's tile is the one file the manifest does not carry.
      // It is square (800x800), which is the fallback, so the miss
      // costs nothing.
      ar: dim ? `${dim[0]} / ${dim[1]}` : "1 / 1",
      isReel: p.href === REEL_HREF,
    };
  });

/* Verbatim from src/components/Thumb.tsx, where the same five frames
   drive the Faux Reel thumbnail: project tiles already loaded elsewhere
   on the site (no extra image weight) running the light clip-path and
   opacity sequence with no burn, which is the one expensive effect.
   Copied rather than imported because Thumb.tsx keeps them private and
   this footer may not edit it. If either copy is retuned, both move. */
const REEL_IMAGES = [
  "/images/thumbnails/ivyPark.jpg",
  "/images/thumbnails/arc.jpg",
  "/images/thumbnails/nordstromPersonal.jpg",
  "/images/thumbnails/dsc.jpg",
  "/images/thumbnails/nordstromBeauty.jpg",
];
const REEL_COLORS = ["#0AA7CA", "#181B17", "#776549"];
const REEL_SEQ: SizzleBeat[] = [
  { fx: "shutter", img: 0, ms: 600 },
  { fx: "fade", img: 1, ms: 400 },
  { fx: "pinch", color: "#0AA7CA", img: 2, ms: 500 },
  { fx: "slat", img: 3, ms: 620 },
  { fx: "ccurtain", color: "#181B17", ms: 340 },
  { fx: "curtain", img: 4, ms: 620 },
  { fx: "cut", img: 0, ms: 540 },
];

/* The second voice down the left. Every line already exists on the site
   (the meta description and the masthead ledger), reordered but not
   rewritten — nothing here is a claim about the practice the site was
   not already making. */
const TEXT: [string, string][] = [
  [
    "The practice",
    "Multi-disciplinary design and engineering by Jeremy Prasatik. Reckon House Staples works across brand, product, and place: apps, interiors, and AI tools.",
  ],
  ["What I do", "Art direction. Brand systems. Digital design. Interiors."],
  ["How I work", "Independent, Dallas. Design and build. Available for work."],
  [
    "Recently",
    "Awwwards Honors, 2026. Faux Reel released as an open repo. 28 case studies online.",
  ],
  ["Get in touch", "hello@reckon.house"],
];

/* ── the deal ────────────────────────────────────────────────────── */

/* Discrete tiers, never within MINSTEP of the last: the heroes are
   almost all landscape at 1.44–1.70, so scale is the only variety left
   and a uniform random would pile it all up in the middle.
   The ceiling is 0.86, not 1.00: hover grows a frame, and one already
   dealt the full track has nowhere to go — it simply did not react. The
   whole ladder is scaled by 0.86 rather than trimmed, so the 2.6x
   spread between smallest and largest survives intact and the biggest
   frame reaches the full track only on hover. */
const TIERS = [0.33, 0.43, 0.53, 0.64, 0.74, 0.86];
const MINSTEP = 0.17;
const SEED = 5;

interface DealtFrame extends IndexEntry {
  /** "64.0%" — the frame's resting width in its stack. */
  w: string;
}

interface DealtPair {
  frames: DealtFrame[];
  blocks: [string, string][];
}

/* One seeded LCG stream for the whole deal. The arithmetic is the
   prototype's, character for character: `seed * 1103515245` overruns
   the 53-bit mantissa and the low bits are lost, but IEEE754 rounding
   and ToInt32 are both fully specified, so the sequence is identical in
   Node and in the browser. That is what keeps the server's markup and
   the client's first render the same. Change SEED to deal again. */
function deal(entries: IndexEntry[], pairCount: number): DealtPair[] {
  let seed = SEED;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  let prevW = -1;
  const dealW = () => {
    let w = 0;
    let guard = 0;
    do {
      w = TIERS[Math.floor(rnd() * TIERS.length)];
      guard++;
    } while (Math.abs(w - prevW) < MINSTEP && guard < 14);
    prevW = w;
    return w;
  };

  const pairs: DealtPair[] = Array.from({ length: pairCount }, () => ({
    frames: [],
    blocks: [],
  }));

  const per = Math.ceil(entries.length / pairCount);
  entries.forEach((e, i) => {
    const p = Math.min(pairCount - 1, Math.floor(i / per));
    if (i % per === 0) prevW = -1; // each stack starts fresh
    pairs[p].frames.push({ ...e, w: `${(dealW() * 100).toFixed(1)}%` });
  });

  TEXT.forEach((t, i) => {
    const p = Math.min(pairCount - 1, Math.floor((i * pairCount) / TEXT.length));
    pairs[p].blocks.push(t);
  });

  return pairs;
}

/* ── the component ───────────────────────────────────────────────── */

export interface PressingIndexProps {
  /** Extra classes on the root element. The full-bleed .hero-breakout
   *  and the module's own class are applied regardless. */
  className?: string;
}

export function PressingIndex({ className }: PressingIndexProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reelBoxRef = useRef<HTMLSpanElement>(null);
  const [reelOn, setReelOn] = useState(false);

  /* Two pairs is the desktop layout and the server's only possible
     guess, so the client's first render has to agree with it or
     hydration tears. The narrow arrangement lands on the pass after
     mount, which is also when the deal re-runs for one stack. */
  const [pairCount, setPairCount] = useState(2);
  useEffect(() => {
    const mq = matchMedia("(min-width: 761px)");
    const sync = () => setPairCount(mq.matches ? 2 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const pairs = useMemo(() => deal(ENTRIES, pairCount), [pairCount]);

  /* ── the text placement pass ──
     The blocks are placed against the MEASURED stack, not dealt a lead.
     Dealt leads put all five in the top half and left half of both
     columns running bare beside the frames — a lead cannot know how
     tall the stack it ends up beside turned out to be. Every frame
     declares its ratio, so the stack has its true height at first
     layout and this can measure it straight away. Each block's own
     height is subtracted as it goes, since they share one flex column
     and stack on each other. */
  const placeText = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-ix-pair]").forEach((pair) => {
      const stack = pair.querySelector<HTMLElement>("[data-ix-stack]");
      const bs = Array.from(pair.querySelectorAll<HTMLElement>("[data-ix-blk]"));
      const H = stack ? stack.offsetHeight : 0;
      if (!bs.length || !H) return;
      let y = 0;
      bs.forEach((b, i) => {
        b.style.marginTop = "0px";
        const target = Math.round((H * (i + 0.28)) / (bs.length - 0.05));
        b.style.marginTop = `${Math.max(0, target - y)}px`;
        y = Math.max(target, y) + b.offsetHeight;
      });
    });
  }, []);

  useIsoLayoutEffect(() => {
    placeText();
    // Resize, not scroll: the stack's height changes with the column's
    // width, never with the scroll position. (A scroll listener would have
    // to bind <main> directly — the page scrolls inside it, and window
    // never hears it.)
    window.addEventListener("resize", placeText);
    // Fonts settle after first paint and the blocks are type, so their
    // measured heights move under us once.
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) placeText();
    });
    const late = window.setTimeout(placeText, 400);
    return () => {
      live = false;
      window.removeEventListener("resize", placeText);
      window.clearTimeout(late);
    };
  }, [placeText, pairs]);

  /* ── arrival ──
     A quiet per-item fade. Reduced motion gets the final state from the
     stylesheet and no observer at all. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const watch = Array.from(
      root.querySelectorAll<HTMLElement>("[data-ix-frame], [data-ix-blk]")
    );
    if (reducedMotion()) {
      watch.forEach((el) => el.classList.add(styles.on));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add(styles.on);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" }
    );
    watch.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pairs]);

  /* ── the reel, mounted on approach ──
     Its own observer with a deep margin, not the arrival one above:
     that fires 6% into the viewport, which is right for starting a fade
     and far too late to start fetching five frames. Under reduced
     motion it never mounts and the still stands in. */
  useEffect(() => {
    if (reelOn || reducedMotion()) return;
    const box = reelBoxRef.current;
    if (!box) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setReelOn(true);
        });
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(box);
    return () => io.disconnect();
  }, [reelOn, pairs]);

  /* ── hover: the stack makes room ──
     The frame scales from its right edge, so it opens leftward and
     equally above and below its own centre. Each neighbour then slides
     by HALF the growth — up if it sits above, down if below — which
     keeps the hovered frame exactly where it was and lets the stack
     part around it.

     Nothing here changes layout. An earlier pass grew the frame's
     WIDTH, which reflowed the column and the whole page under it every
     frame and read as a stutter. Transforms cost the compositor only.

     The growth is computed from the resting height rather than measured
     after the hover lands, since the frame is mid-transition at that
     point and would report its old size. Only the neighbours are
     written to: the hovered frame's own scale comes from the
     stylesheet, and an inline transform here would outrank it. */
  const onFrameEnter = useCallback(
    (e: ReactPointerEvent<HTMLAnchorElement>) => {
      const a = e.currentTarget;
      if (window.innerWidth <= CHOREO_BREAKPOINT) return;
      if (!matchMedia("(hover: hover)").matches) return;
      const col = a.parentElement;
      if (!col) return;
      const items = Array.from(col.children) as HTMLElement[];
      const i = items.indexOf(a);
      if (i < 0) return;
      const grow =
        parseFloat(getComputedStyle(a).getPropertyValue("--ix-grow")) || 1.5;
      const shift = (a.offsetHeight * (grow - 1)) / 2;
      items.forEach((b, k) => {
        if (k === i) return;
        b.style.transform = `translateY(${(k < i ? -shift : shift).toFixed(1)}px)`;
      });
    },
    []
  );

  const onFrameLeave = useCallback(
    (e: ReactPointerEvent<HTMLAnchorElement>) => {
      const a = e.currentTarget;
      const col = a.parentElement;
      if (!col) return;
      (Array.from(col.children) as HTMLElement[]).forEach((b) => {
        if (b !== a) b.style.transform = "";
      });
    },
    []
  );

  /* Lenis owns <main>'s scrollTop and re-applies its own offset on the
     next frame, so a bare #top anchor (or a scrollTop write) gets
     snapped straight back. Everything that moves the page goes through
     the instance. */
  const toTop = useCallback(() => {
    const lenis = getLenis();
    const reduce = reducedMotion();
    if (lenis) {
      lenis.scrollTo(0, reduce ? { immediate: true } : undefined);
      return;
    }
    // Lenis has not registered yet (or has gone away): move the real
    // scroller, which is <main>, never the document.
    document
      .querySelector("main")
      ?.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <footer
      ref={rootRef}
      className={
        className
          ? `hero-breakout ${styles.index} ${className}`
          : `hero-breakout ${styles.index}`
      }
    >
      <header className={styles.head}>
        <RevealHeadline as="h2" className={styles.lede}>
          All work.
        </RevealHeadline>
      </header>

      <div className={styles.cols}>
        {pairs.map((pair, pi) => (
          <div key={pi} className={styles.pair} data-ix-pair>
            <div className={styles.txt}>
              {pair.blocks.map(([title, copy]) => (
                <div key={title} className={styles.blk} data-ix-blk>
                  <span className={styles.blkTitle}>{title}</span>
                  <p className={styles.blkCopy}>{copy}</p>
                </div>
              ))}
            </div>

            <div className={styles.imgs} data-ix-stack>
              {pair.frames.map((f) => (
                <Link
                  key={f.id}
                  href={f.href}
                  className={styles.it}
                  /* Several projects share a title and differ only by
                     category (three rooms of the same Hill Country
                     house), so the label carries both. The picture is
                     decorative under it — alt="" — rather than
                     repeating the same words a second time. */
                  aria-label={`${f.title}, ${f.category}`}
                  style={
                    { "--w": f.w, "--ar": f.ar } as CSSProperties
                  }
                  data-ix-frame
                  onPointerEnter={onFrameEnter}
                  onPointerLeave={onFrameLeave}
                >
                  {f.isReel ? (
                    <span ref={reelBoxRef} className={styles.reel}>
                      {reelOn ? (
                        <SizzleReel
                          images={REEL_IMAGES}
                          colors={REEL_COLORS}
                          sequence={REEL_SEQ}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={f.image} alt="" decoding="async" />
                      )}
                    </span>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={f.image} alt="" loading="lazy" decoding="async" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.foot}>
        <span>&copy; 2026 Reckon House</span>
        <span className={styles.newsline}>
          Awwwards Honors, 2026 &middot; Faux Reel released as an open repo
        </span>
        <button type="button" className={styles.top} onClick={toTop}>
          Top &uarr;
        </button>
      </div>
    </footer>
  );
}
