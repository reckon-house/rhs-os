"use client";

/**
 * PressingSystemIndex — the generic system ledger.
 *
 * The house pattern for "here is the system, one row per part", built so
 * any study can have it. RRSystemIndex is the bespoke sibling: Robert's
 * hardcodes its Archer lockup, its four-state palette and its reel
 * because those ARE that campaign. This one builds its rows from
 * whatever brand data a study holds and skips any row the data cannot
 * fill.
 *
 * It earns its keep by moving like the sibling rather than sitting
 * still. Four things, and the reasons:
 *
 * - A HEADLINE, so the section opens rather than starting mid-sentence.
 * - ROWS ALTERNATE. Label left, then asset left, then label left. A
 *   ledger where every row starts the same way is a list; alternating
 *   makes the eye cross the measure and the specimens land in different
 *   places down the page.
 * - THE PALETTE MORPHS, colour and form together, on the shared
 *   polar-profile lerp in @/lib/swatch-morph — the same mechanism
 *   Robert's uses. Shapes come from a ladder here rather than being
 *   authored: a generic component cannot know a brand's forms, but it
 *   can vary them so the swatch reads as a system rather than a dot.
 * The logotype does NOT morph, and that is a decision rather than an
 * omission: Robert's lockup interpolates because Archer's outlines were
 * extracted with matching ring counts, and A.R.C.'s mark is filled
 * serif letterforms. Interpolating those would produce a smear. It
 * shows its construction drawing instead, which is what that artwork
 * actually is.
 *
 * The palette cycle runs on the shared scrub loop via onTick and keeps
 * time by accumulating capped deltas, so html[data-paused] stops the
 * clock and a resume carries on rather than fast-forwarding. Reduced
 * motion holds the first state.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { BrandSystemSection } from "@/lib/types";
import { onTick, reducedMotion } from "@/lib/scrub";
import { SectionMark } from "@/components/fx/SectionMark";
import { SizzleReel, type SizzleBeat } from "@/components/fx/SizzleReel";
import { RevealHeadline } from "@/components/fx/RevealHeadline";
import { imageDimensions } from "@/data/image-dimensions";
import { outline, profile, toPath, rgb } from "@/lib/swatch-morph";
import styles from "./PressingSystemIndex.module.css";

/* The shape ladder. A generic section cannot know a brand's forms, so
   it varies them: circle, square, hexagon, triangle, then round again.
   R is per-shape because equal circumradius is not equal optical
   weight — a circle at 41 carries what a square carries at 47. */
const LADDER = [
  { sides: 0, R: 41, rot: 0 },
  { sides: 4, R: 47, rot: Math.PI / 4 },
  { sides: 6, R: 44, rot: Math.PI / 6 },
  { sides: 3, R: 50, rot: -Math.PI / 2 },
];

const SW_HOLD = 1600;
const SW_MORPH = 850;

export interface PressingSystemIndexProps {
  section: BrandSystemSection;
  mark?: { n: string; name: string };
}

export function PressingSystemIndex({ section, mark }: PressingSystemIndexProps) {
  const ref = useRef<HTMLElement>(null);
  const swatchRef = useRef<SVGPathElement>(null);
  const swatchCapRef = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const colors = section.colors ?? [];

  /* ── the pattern library reel ──────────────────────────────────
     RRSystemIndex's plumbing, copied rather than re-derived. The box's
     height is written per beat from each frame's NATIVE ratio: the
     frames are different shapes (a stats card is wide, an account panel
     is tall), and without a measured box every reshape reflows the
     whole row. Ratios are read once, up front, and the reel only mounts
     when they are all in — a reel that starts before it knows its
     shapes jumps on its first two beats. */
  const reelBoxRef = useRef<HTMLSpanElement>(null);
  const ratiosRef = useRef<number[]>([]);
  const [reelReady, setReelReady] = useState(false);

  const shape = useCallback((i: number) => {
    const box = reelBoxRef.current;
    const r = ratiosRef.current[i];
    if (box && r) {
      box.style.height = `${(box.getBoundingClientRect().width / r).toFixed(1)}px`;
    }
  }, []);

  const onBeat = useCallback(
    (_i: number, beat: SizzleBeat) => {
      if (beat.img != null) shape(beat.img);
    },
    [shape]
  );

  const libKey = (section.patternLibrary ?? []).join("|");
  useEffect(() => {
    const srcs = libKey ? libKey.split("|") : [];
    if (!srcs.length) return;
    let cancelled = false;
    ratiosRef.current = [];
    Promise.all(
      srcs.map(
        (src: string, i: number) =>
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
  }, [libKey, shape]);

  /* ── the palette: colour AND form, together ────────────────────── */
  useEffect(() => {
    const pathEl = swatchRef.current;
    const cap = swatchCapRef.current;
    if (!pathEl || !cap || colors.length === 0) return;

    const profiles = colors.map((_, i) => {
      const sh = LADDER[i % LADDER.length];
      return profile(outline(sh.sides, sh.R, 0, sh.rot));
    });
    const cols = colors.map((c) => rgb(c.hex));
    const n = colors.length;

    const setFrame = (a: number, b: number, e: number) => {
      const pa = profiles[a];
      const pb = profiles[b];
      pathEl.setAttribute("d", toPath(pa.map((v, i) => v + (pb[i] - v) * e)));
      const c0 = cols[a];
      const c1 = cols[b];
      pathEl.setAttribute(
        "fill",
        `rgb(${c0.map((v, i) => Math.round(v + (c1[i] - v) * e)).join(",")})`
      );
    };

    const label = (i: number) => `${colors[i].name} · ${colors[i].hex}`;
    cap.textContent = label(0);
    setFrame(0, n > 1 ? 1 : 0, 0);

    // Reduced motion holds the first state. One colour has nowhere to go.
    if (reducedMotion() || n < 2) return;

    /* Delta-accumulated clock, RRSystemIndex's idiom: onTick carries no
       argument and stops under html[data-paused], and capping the gap
       keeps a resume from fast-forwarding through everything it
       missed. */
    const span = SW_HOLD + SW_MORPH;
    let elapsed = 0;
    let prev: number | null = null;
    let shownLast = -1;
    return onTick(() => {
      const now = performance.now();
      if (prev != null) elapsed += Math.min(now - prev, 100);
      prev = now;

      const t = elapsed % (span * n);
      const idx = Math.floor(t / span);
      const within = t - idx * span;
      const next = (idx + 1) % n;
      const raw = within <= SW_HOLD ? 0 : (within - SW_HOLD) / SW_MORPH;
      const e = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      setFrame(idx, next, e);
      const shown = e > 0.5 ? next : idx;
      if (shown !== shownLast) {
        shownLast = shown;
        cap.textContent = label(shown);
      }
    });
  }, [colors]);

  /* The setup. The classic section carried three prose fields; intro is
     the argument and philosophy is the answer, so both read. The subcopy
     restated the intro in fewer words — the duplication the allocation
     rules exist to catch — and is dropped. */
  const setup = [section.introText, section.philosophyText].filter(Boolean);

  /* Robert's indents — 3vw, 17vw, 8vw — extended by one for a fourth
     row. Deliberately NOT monotonic: a staircase reads as a list
     working its way across, where a varied ladder reads as an index. */
  const INDENT = ["3vw", "17vw", "8vw", "21vw"];

  const rows: { label: string; body: React.ReactNode }[] = [];

  if (section.logoConstructionImage) {
    const dim = imageDimensions[section.logoConstructionImage];
    rows.push({
      label: "Logotype",
      body: (
        <span className={styles.markStack}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.markImg}
            style={
              { "--native": dim ? `${Math.floor(dim[0] / 2)}px` : undefined } as CSSProperties
            }
            src={section.logoConstructionImage}
            alt="Logotype construction"
            width={dim?.[0]}
            height={dim?.[1]}
            loading="lazy"
            decoding="async"
          />
          <span className={styles.cap}>Construction</span>
        </span>
      ),
    });
  }

  if (section.fonts?.length) {
    /* One entry per FACE, not per weight: three rows for two families
       reads as three typefaces at a glance. */
    const seen = new Set<string>();
    const faces = section.fonts.filter((f) =>
      seen.has(f.name) ? false : (seen.add(f.name), true)
    );
    rows.push({
      label: "Typeface",
      body: (
        <>
          {faces.map((f) => (
            <span key={f.name}>
              <span className={styles.specimen} style={{ fontFamily: `"${f.name}", serif` }}>
                {f.name}
              </span>
              <span className={styles.cap}>{f.role}</span>
            </span>
          ))}
        </>
      ),
    });
  }

  if (colors.length) {
    rows.push({
      label: "Palette",
      body: (
        <span className={styles.palStack}>
          <svg className={styles.swatch} viewBox="0 0 100 100" aria-hidden="true">
            <path ref={swatchRef} d={toPath(profile(outline(0, 41, 0, 0)))} fill={colors[0].hex} />
          </svg>
          <span className={styles.cap} ref={swatchCapRef} />
        </span>
      ),
    });
  }

  const library = section.patternLibrary ?? [];
  if (library.length) {
    rows.push({
      label: "Pattern library",
      body: (
        <span className={styles.markStack}>
          <span ref={reelBoxRef} className={styles.reelBox}>
            {reelReady ? (
              <SizzleReel
                images={library}
                colors={(section.colors ?? []).map((c) => c.hex)}
                speed={1}
                className={styles.reel}
                onBeatChange={onBeat}
              />
            ) : null}
          </span>
          <span className={styles.cap}>
            {library.length} components
          </span>
        </span>
      ),
    });
  }

  return (
    <section
      ref={ref}
      className={drawn ? `${styles.wrap} ${styles.drawn}` : styles.wrap}
    >
      {mark ? (
        <div className={styles.head}>
          <SectionMark n={mark.n} name={mark.name} />
        </div>
      ) : null}

      {section.title ? (
        <RevealHeadline as="h2" className={styles.headline}>
          {section.title}
        </RevealHeadline>
      ) : null}

      {setup.length ? (
        <div className={styles.intro}>
          {setup.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      ) : null}

      <div className={styles.rows}>
        {rows.map((r, i) => (
          <div
            /* Alternating: even rows lead with the label, odd rows lead
               with the specimen. A ledger whose every row starts the
               same way is a list. */
            className={`${styles.row} ${i % 2 ? styles.flip : ""}`}
            key={r.label}
            style={
              {
                "--lag": `${(i * 0.12).toFixed(2)}s`,
                "--indent": INDENT[i % INDENT.length],
              } as CSSProperties
            }
          >
            <span className={styles.label}>{r.label}</span>
            <span className={styles.sample}>{r.body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
