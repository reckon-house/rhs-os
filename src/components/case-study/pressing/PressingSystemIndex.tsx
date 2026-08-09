"use client";

/**
 * PressingSystemIndex — the pressing skin for `brand-system`.
 *
 * What it replaces: a two-tone cream panel carrying a giant glyph, a
 * philosophy column, a swatch matrix with generated 75/50/25 tint ramps,
 * and a logo-construction plate. It was the single most "old site"
 * thing left in a pressing study, and the ramps were steps nobody
 * specified — decoration wearing data's clothes.
 *
 * What it is instead: the setup, then the ledger. One row per part of
 * the system, big label left, the thing itself right, hairline between,
 * rules drawing in staggered on arrival. The proportions are
 * RRSystemIndex's on purpose — that section is the house pattern for
 * this, and a second brand section speaking its own dialect would give
 * the site two languages. Robert's version hardcodes its lockup, palette
 * cycle and reel because they are bespoke to it; this one builds its
 * rows from whatever the study's brand data actually holds, and skips
 * any row the data cannot fill.
 *
 * The observer is viewport-rooted, which is safe with the page scrolling
 * inside <main>: main spans the viewport, so the two tests are the same.
 * No scroll listener, no per-frame work, nothing subscribing to the
 * scrub loop.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { BrandSystemSection } from "@/lib/types";
import { SectionMark } from "@/components/fx/SectionMark";
import { imageDimensions } from "@/data/image-dimensions";
import styles from "./PressingSystemIndex.module.css";

export interface PressingSystemIndexProps {
  section: BrandSystemSection;
  mark?: { n: string; name: string };
}

export function PressingSystemIndex({ section, mark }: PressingSystemIndexProps) {
  const ref = useRef<HTMLElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

  /* The setup. The classic section carried three prose fields; the intro
     is the argument and the philosophy is how it was answered, so both
     read. The subcopy restated the intro in fewer words, which is the
     duplication the allocation rules exist to catch — it is dropped. */
  const setup = [section.introText, section.philosophyText].filter(Boolean);

  /* One row per part the data can actually fill. A study with no
     logo artwork simply has no logotype row rather than an empty one. */
  const rows: { label: string; body: React.ReactNode }[] = [];

  if (section.logoConstructionImage) {
    const dim = imageDimensions[section.logoConstructionImage];
    rows.push({
      label: "Logotype",
      body: (
        <span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.markImg}
            style={{ "--native": dim ? `${Math.floor(dim[0] / 2)}px` : undefined } as CSSProperties}
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
    /* One entry per FACE, not per weight: the classic section listed the
       same family three times because each weight had its own row, which
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

  if (section.colors?.length) {
    rows.push({
      label: "Palette",
      body: (
        <>
          {section.colors.map((c) => (
            <span className={styles.swatchCell} key={c.hex}>
              <span className={styles.swatch} style={{ background: c.hex }} />
              <span className={styles.cap}>
                {c.name} · <span className={styles.hex}>{c.hex}</span>
              </span>
            </span>
          ))}
        </>
      ),
    });
  }

  if (section.appScreenshotImage) {
    const dim = imageDimensions[section.appScreenshotImage];
    rows.push({
      label: "In use",
      body: (
        <span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.markImg}
            style={{ "--native": dim ? `${Math.floor(dim[0] / 2)}px` : undefined } as CSSProperties}
            src={section.appScreenshotImage}
            alt="The system applied in the product"
            width={dim?.[0]}
            height={dim?.[1]}
            loading="lazy"
            decoding="async"
          />
          <span className={styles.cap}>Applied</span>
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
            className={styles.row}
            key={r.label}
            style={{ "--lag": `${(i * 0.12).toFixed(2)}s` } as CSSProperties}
          >
            <span className={styles.label}>{r.label}</span>
            <span className={styles.sample}>{r.body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
