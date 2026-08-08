"use client";

/**
 * PressingHome — the homepage as a dealt field, ported from
 * public/lab/pressing-home.html (the design spec; retune there first).
 *
 * The statement, then the query set as a headline, then every project
 * dealt into one wide [text | frames] pair. Typing re-deals the field —
 * nothing here is a results list; the page answers by recomposing.
 * Deal-again bumps the seed, the URL carries (q, deal), and the seeded
 * dealer (src/lib/deal.ts) reproduces any shared composition exactly —
 * on the server too, which is what keeps hydration honest: the house
 * deal renders in the HTML, and a URL query re-deals after mount (the
 * recompose IS the language, so the flash is the design).
 *
 * The haystack is title + category + slug + the image filename's own
 * tokens — the SEO filenames are retrieval data nobody had to author.
 * Matching is deliberately dumb (see queryMatches); embeddings can
 * replace that one function later without touching the interaction.
 *
 * Scroll architecture: nothing here scrubs, so nothing subscribes to
 * the shared rAF loop. Arrival is IntersectionObserver + CSS, the
 * hover part writes transforms only, and Lenis never enters the
 * picture. The footer's own All work index is suppressed on this route
 * (see PressingFooter) — the field IS that index, promoted.
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { projects } from "@/data/projects";
import { imageDimensions } from "@/data/image-dimensions";
import {
  dealWidths,
  HOUSE_SEED,
  queryMatches,
} from "@/lib/deal";
import { SizzleReel, type SizzleBeat } from "@/components/fx/SizzleReel";
import styles from "./PressingHome.module.css";

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ── the manifest ─────────────────────────────────────────────────── */

interface Entry {
  id: string;
  title: string;
  category: string;
  href: string;
  image: string;
  ar: string;
  hay: string;
  isReel: boolean;
}

const REEL_HREF = "/case-studies/sizzle";

/* Same derivation as the footer index: every project with somewhere to
   go, the 800px tile when the dimension manifest knows it, the data
   file's own image otherwise. */
const ENTRIES: Entry[] = projects
  .filter((p) => Boolean(p.href))
  .map((p) => {
    const tile = `/images/thumbnails/${p.id}.jpg`;
    const image = imageDimensions[tile] ? tile : p.image;
    const dim = imageDimensions[image];
    const file = (p.image.split("/").pop() ?? "").replace(/[-_.]/g, " ");
    return {
      id: p.id,
      title: p.title,
      category: p.category,
      href: p.href as string,
      image,
      ar: dim ? `${dim[0]} / ${dim[1]}` : "1 / 1",
      hay: `${p.title} ${p.category} ${p.href} ${file}`.toLowerCase(),
      isReel: p.href === REEL_HREF,
    };
  });

/* The reel: verbatim from the footer index / Thumb.tsx — the light
   sequence with no burn. */
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

/* The second voice down the left — the practice ledger, verbatim from
   /info and the footer. House deal only: a filtered field is an answer,
   and the answer should be all frames. */
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

export function PressingHome() {
  const [query, setQuery] = useState("");
  const [seed, setSeed] = useState(HOUSE_SEED);
  /* The composition actually rendered. Query/seed changes pass through
     the dip (the field fades 160ms, then the new deal lands) — under
     reduced motion the swap is immediate. */
  const [dealt, setDealt] = useState({ query: "", seed: HOUSE_SEED });
  const [dipping, setDipping] = useState(false);

  const colsRef = useRef<HTMLDivElement>(null);
  const dipTimer = useRef(0);
  const debounce = useRef(0);

  /* Boot: a shared URL reproduces its composition. The house deal is in
     the server HTML; a q/deal URL re-deals on mount, and the recompose
     is the language. */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const q = p.get("q") ?? "";
    const d = parseInt(p.get("deal") ?? String(HOUSE_SEED), 10);
    const s = Number.isFinite(d) ? d : HOUSE_SEED;
    if (q || s !== HOUSE_SEED) {
      setQuery(q);
      setSeed(s);
      setDealt({ query: q, seed: s });
    }
  }, []);

  const syncUrl = useCallback((q: string, s: number) => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (s !== HOUSE_SEED) p.set("deal", String(s));
    const qs = p.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `?${qs}` : window.location.pathname
    );
  }, []);

  const redeal = useCallback(
    (q: string, s: number) => {
      syncUrl(q, s);
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) {
        setDealt({ query: q, seed: s });
        return;
      }
      setDipping(true);
      window.clearTimeout(dipTimer.current);
      dipTimer.current = window.setTimeout(() => {
        setDealt({ query: q, seed: s });
        setDipping(false);
      }, 170);
    },
    [syncUrl]
  );

  const onQuery = useCallback(
    (v: string) => {
      setQuery(v);
      window.clearTimeout(debounce.current);
      debounce.current = window.setTimeout(() => redeal(v, seed), 140);
    },
    [redeal, seed]
  );

  const onDealAgain = useCallback(() => {
    const next = seed + 1;
    setSeed(next);
    redeal(query, next);
  }, [query, seed, redeal]);

  /* ── the composition for (dealt.query, dealt.seed) ── */
  const comp = useMemo(() => {
    const idxs = queryMatches(
      ENTRIES.map((e) => e.hay),
      dealt.query
    );
    const widths = dealWidths(idxs.length, dealt.seed);
    return {
      frames: idxs.map((ei, i) => ({ ...ENTRIES[ei], w: widths[i] })),
      house: !dealt.query.trim(),
    };
  }, [dealt]);

  /* Text placement: the ledger blocks sit against the MEASURED stack.
     Re-run per deal, on resize, and after fonts settle. */
  const stackRef = useRef<HTMLDivElement>(null);
  const txtRef = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const stack = stackRef.current;
    const txt = txtRef.current;
    if (!stack || !txt) return;
    const place = () => {
      const bs = Array.from(txt.children) as HTMLElement[];
      const H = stack.offsetHeight;
      if (!bs.length || !H) return;
      let y = 0;
      bs.forEach((b, i) => {
        b.style.marginTop = "0px";
        const target = Math.round((H * (i + 0.28)) / (bs.length - 0.05));
        b.style.marginTop = Math.max(0, target - y) + "px";
        y = Math.max(target, y) + b.offsetHeight;
      });
    };
    place();
    window.addEventListener("resize", place);
    const ro = new ResizeObserver(place);
    ro.observe(stack);
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) place();
    });
    return () => {
      alive = false;
      window.removeEventListener("resize", place);
      ro.disconnect();
    };
  }, [comp]);

  /* Arrival: one observer per deal. Admit-once, cascade by viewport. */
  useEffect(() => {
    const cols = colsRef.current;
    if (!cols) return;
    const els = Array.from(cols.querySelectorAll(`.${styles.it}, .${styles.blk}`));
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      els.forEach((el) => el.classList.add(styles.on));
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.on);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [comp]);

  /* Hover: the stack parts around the grown frame — transforms only. */
  const onEnter = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    if (window.innerWidth <= 760) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const a = e.currentTarget;
    const col = a.parentElement;
    if (!col) return;
    const items = Array.from(col.children) as HTMLElement[];
    const i = items.indexOf(a);
    const shift = (a.offsetHeight * 0.5) / 2; /* (grow 1.5 − 1) / 2 */
    items.forEach((b, k) => {
      if (k === i) return;
      b.style.transform = `translateY(${(k < i ? -shift : shift).toFixed(1)}px)`;
    });
  }, []);
  const onLeave = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    const col = e.currentTarget.parentElement;
    if (!col) return;
    (Array.from(col.children) as HTMLElement[]).forEach((b) => {
      if (b !== e.currentTarget) b.style.transform = "";
    });
  }, []);

  const count = comp.frames.length;
  const countLine = comp.house
    ? `${count} frames / the house deal`
    : `${count} ${count === 1 ? "frame" : "frames"} / “${dealt.query.trim()}”`;

  return (
    <div>
      <section className={styles.cover}>
        <p className={styles.statement}>
          I&rsquo;m Jeremy. I work across brand, product, and place.{" "}
          <span className={styles.dim}>
            Apps and ecommerce, campaigns and brand systems, photography and
            art direction, custom interiors, AI tools. The disciplines
            overlap more than they separate.
          </span>{" "}
          Same desk for all of it.
        </p>

        <div className={styles.querywrap}>
          <div className={styles.querylbl}>
            01 / The index &mdash; type anything, the field answers
          </div>
          <input
            className={styles.query}
            type="text"
            value={query}
            placeholder="Everything."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Filter the work"
            onChange={(e) => onQuery(e.target.value)}
          />
          <div className={styles.dealline}>
            <span className={styles.count}>{countLine}</span>
            <button
              type="button"
              className={styles.redealBtn}
              onClick={onDealAgain}
              title="Deal the field again"
            >
              Deal &#8470; {dealt.seed} &#8635;
            </button>
          </div>
        </div>
      </section>

      <section className={styles.field}>
        {count === 0 ? (
          <div className={styles.empty}>
            Nothing set for &ldquo;{dealt.query.trim()}&rdquo;.{" "}
            <button
              type="button"
              className={styles.emptyReset}
              onClick={() => {
                setQuery("");
                redeal("", seed);
              }}
            >
              Deal the house
            </button>
          </div>
        ) : (
          <div
            ref={colsRef}
            className={`${styles.cols} ${dipping ? styles.redeal : ""}`}
          >
            {/* Keyed by the deal so a recompose remounts the field and the
                arrival cascade runs fresh. */}
            <div
              key={`${dealt.query}|${dealt.seed}`}
              className={styles.pair}
            >
              <div ref={txtRef} className={styles.txt}>
                {comp.house
                  ? TEXT.map((t) => (
                      <div key={t[0]} className={styles.blk}>
                        <span className={styles.t}>{t[0]}</span>
                        <p className={styles.s}>{t[1]}</p>
                      </div>
                    ))
                  : null}
              </div>
              <div ref={stackRef} className={styles.imgs}>
                {comp.frames.map((f) => (
                  <a
                    key={f.id}
                    className={styles.it}
                    href={f.href}
                    aria-label={f.title}
                    style={
                      {
                        "--w": `${(f.w * 100).toFixed(1)}%`,
                        "--ar": f.ar,
                      } as React.CSSProperties
                    }
                    onPointerEnter={onEnter}
                    onPointerLeave={onLeave}
                  >
                    {f.isReel ? (
                      <span className={styles.reelBox}>
                        <SizzleReel
                          images={REEL_IMAGES}
                          colors={REEL_COLORS}
                          sequence={REEL_SEQ}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={f.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <span className={styles.cap}>
                      {f.title} &mdash; {f.category}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
