"use client";

/**
 * PressingInteriorsIndex — the system ledger for a room.
 *
 * The brand ledger (Mark / Typeface / Palette / Pattern library) does not
 * survive contact with an interior. Three studies were forced into it by
 * stuffing MATERIALS INTO THE `fonts` FIELD, so Hill Country Livingroom
 * shipped "Limestone" as a type specimen set in Caslon, a face nobody put
 * in that house. The other five interiors studies carried no section at
 * all, because there was nothing honest to put in a brand ledger.
 *
 * Three rows, and the middle one is the argument:
 *
 *   MATERIALS  what the room is made of, shown in use, at context scale
 *   TEXTURE    how those materials read, shown at surface scale
 *   PALETTE    what colour it is
 *
 * TEXTURE IS THE TYPEFACE SLOT AND IT EARNS IT. A typeface is the formal
 * treatment every word wears; texture is the formal treatment every
 * material wears. Matte against gloss on the same sage is weight 400
 * against 700 on the same face, and the kitchen study already argues it
 * out loud: "The finish is matte. Satin would have pushed the cabinets
 * toward contemporary and gloss would have fought the raw oak."
 *
 * THE RISK, named so it can be checked at a glance: Materials and Texture
 * are both photographic, and they only read as two questions if the SCALE
 * gap is real. Materials shows an object in its room; Texture fills the
 * frame with one surface. Any crop that could sit in either row is
 * miscropped. Nothing here enforces that — the crop does.
 *
 * Every value comes from scripts/build-interiors-index.mjs, which derives
 * from the study's OWN authored Materials line and image-vision.json's
 * observed texture readings. Nothing is authored twice and nothing is
 * invented; a study missing a source gets a shorter row, never a filled
 * one. That is deliberate: the swatch ledger this replaces shipped 49
 * hand-typed hexes under a header reading "as specified".
 *
 * The layout is RRSystemIndex's, copied rather than re-derived — display
 * size on the ROW, label and specimen adjacent with one gap, alternating
 * order plus a per-row indent.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { onTick, reducedMotion } from "@/lib/scrub";
import { SectionMark } from "@/components/fx/SectionMark";
import { RevealHeadline } from "@/components/fx/RevealHeadline";
import { outline, profile, toPath, rgb } from "@/lib/swatch-morph";
import { interiorsIndexFor, type InteriorsRow } from "@/lib/interiors-index";
import styles from "./PressingInteriorsIndex.module.css";

/* The palette's clock, RRSystemIndex's numbers. */
const SW_HOLD = 1600;
const SW_MORPH = 850;

/* The two photographic rows run at DIFFERENT holds on purpose. A room
   takes longer to take in than a surface does, and putting both on one
   beat makes the section pulse. */
const MAT_HOLD = 2600;
const TEX_HOLD = 1900;

/* The shape ladder. A generic section cannot know a room's forms, so it
   varies them. R is per-shape because equal circumradius is not equal
   optical weight: a circle at 41 carries what a square carries at 47. */
const LADDER = [
  { sides: 0, R: 41, rot: 0 },
  { sides: 4, R: 47, rot: Math.PI / 4 },
  { sides: 6, R: 44, rot: Math.PI / 6 },
  { sides: 3, R: 50, rot: -Math.PI / 2 },
];

/* Robert's indents, three of them. Deliberately NOT monotonic: a
   staircase reads as a list working its way across, where a varied
   ladder reads as an index. */
const INDENT = ["3vw", "17vw", "8vw"];

/**
 * One cycling frame box. Two layers live in it at once, the standing
 * frame and the arriving one, and the arriving layer is remounted by key
 * so its CSS animation restarts.
 *
 * A CROPPED frame paints as a BACKGROUND, never as a scaled <img>.
 * `transform: scale()` rasterizes the picture at its layout size and
 * then magnifies that finished bitmap: at a 190px box on a 2x screen
 * that is a 380px raster blown up past 1000px while the source file's
 * pixels go untouched. A background re-samples from the source at the
 * size actually shown. The generator caps every crop's zoom against its
 * own native width so this cannot quietly go soft.
 */
function FrameBox({
  rows, hold, cls, vertical,
}: {
  rows: InteriorsRow[];
  hold: number;
  cls: string;
  vertical?: boolean;
}) {
  const [beat, setBeat] = useState({ prev: 0, cur: 0, n: 0 });

  useEffect(() => {
    if (reducedMotion() || rows.length < 2) return;
    let elapsed = 0;
    let last: number | null = null;
    let shown = 0;
    /* the shared scrub loop, so html[data-paused] stops the clock and a
       resume carries on rather than fast-forwarding */
    return onTick(() => {
      const now = performance.now();
      if (last != null) elapsed += Math.min(now - last, 100);
      last = now;
      const i = Math.floor(elapsed / hold) % rows.length;
      if (i === shown) return;
      shown = i;
      setBeat((b) => ({ prev: b.cur, cur: i, n: b.n + 1 }));
    });
  }, [rows.length, hold]);

  if (!rows.length) return null;
  const layer = (r: InteriorsRow, key: string, animate: boolean) =>
    r.zoom ? (
      <span
        key={key}
        className={`${styles.fr} ${animate ? (vertical ? styles.inV : styles.in) : ""}`}
        style={{
          backgroundImage: `url("${r.src}")`,
          "--zoom": r.zoom,
          "--at": r.at ?? "50% 50%",
        } as CSSProperties}
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={key}
        className={animate ? (vertical ? styles.inV : styles.in) : undefined}
        src={r.src}
        alt=""
        loading="lazy"
        decoding="async"
      />
    );

  const prev = rows[beat.prev % rows.length];
  const cur = rows[beat.cur % rows.length];
  return (
    <span className={`${styles.box} ${cls}`}>
      {layer(prev, "standing", false)}
      {beat.n > 0 ? layer(cur, `in-${beat.n}`, true) : null}
    </span>
  );
}

/** The caption for whichever frame is standing, driven off the same clock. */
function useBeatLabel(rows: InteriorsRow[], hold: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reducedMotion() || rows.length < 2) return;
    let elapsed = 0;
    let last: number | null = null;
    return onTick(() => {
      const now = performance.now();
      if (last != null) elapsed += Math.min(now - last, 100);
      last = now;
      setI(Math.floor(elapsed / hold) % rows.length);
    });
  }, [rows.length, hold]);
  return rows[i % Math.max(1, rows.length)];
}

export interface PressingInteriorsIndexProps {
  slug: string;
  title?: string;
  intro?: string[];
  mark?: { n: string; name: string };
}

export function PressingInteriorsIndex({
  slug, title, intro = [], mark,
}: PressingInteriorsIndexProps) {
  const data = interiorsIndexFor(slug);
  const ref = useRef<HTMLElement>(null);
  const swatchRef = useRef<SVGPathElement>(null);
  const swatchCapRef = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  const materials = data?.materials ?? [];
  const textures = data?.textures ?? [];
  const colors = data?.palette ?? [];

  const matNow = useBeatLabel(materials, MAT_HOLD);
  const texNow = useBeatLabel(textures, TEX_HOLD);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) { setDrawn(true); return; }
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

  /* THE CLIP HAS TO BE RELEASED, not merely opened. `inset(0 0 0 0)` is
     not "no clip" — it goes on clipping to the border box for the life of
     the page. The texture caption is a phrase centred on a 190px crop in
     a row indented 17vw, so the row ate its opening words: "Polished
     brass rubbed dull" rendered as "ed brass rubbed dull". */
  const free = useCallback((row: HTMLDivElement | null) => {
    if (!row) return;
    if (reducedMotion()) { row.classList.add(styles.free); return; }
    row.addEventListener("transitionend", (e) => {
      if ((e as TransitionEvent).propertyName === "clip-path") {
        row.classList.add(styles.free);
      }
    }, { once: true });
  }, []);

  /* ── the palette: colour and form together ─────────────────────── */
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

    /* Named where a section named it, bare hex otherwise. Five of the
       eight studies declare their palette only on the cover reel, which
       is a real authored list with no names attached, and inventing
       names for those would be the fabrication this whole pass exists
       to remove. */
    const label = (i: number) =>
      colors[i].name ? `${colors[i].name} · ${colors[i].hex}` : colors[i].hex;
    cap.textContent = label(0);
    setFrame(0, n > 1 ? 1 : 0, 0);
    if (reducedMotion() || n < 2) return;

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

  /* A study with no generated entry renders nothing rather than an empty
     ledger. Running the generator is what turns the section on. */
  if (!data || (!materials.length && !textures.length && !colors.length)) return null;

  const rows: { label: string; body: React.ReactNode }[] = [];

  if (materials.length) {
    rows.push({
      label: "Materials",
      body: (
        <span className={styles.stack}>
          <FrameBox rows={materials} hold={MAT_HOLD} cls={styles.matBox} />
          <span className={styles.cap}>{matNow?.name}</span>
        </span>
      ),
    });
  }

  if (textures.length) {
    rows.push({
      label: "Texture",
      body: (
        <span className={`${styles.stack} ${styles.texStack}`}>
          <FrameBox rows={textures} hold={TEX_HOLD} cls={styles.texBox} vertical />
          <span className={`${styles.cap} ${styles.texCap}`}>{texNow?.cap}</span>
        </span>
      ),
    });
  }

  if (colors.length) {
    rows.push({
      label: "Palette",
      body: (
        <span className={styles.stack}>
          <svg className={styles.swatch} viewBox="0 0 100 100" aria-hidden="true">
            <path
              ref={swatchRef}
              d={toPath(profile(outline(0, 41, 0, 0)))}
              fill={colors[0].hex}
            />
          </svg>
          <span className={styles.cap} ref={swatchCapRef} />
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

      {title ? (
        <RevealHeadline as="h2" className={styles.headline}>
          {title}
        </RevealHeadline>
      ) : null}

      {intro.length ? (
        <div className={styles.intro}>
          {intro.map((t, i) => <p key={i}>{t}</p>)}
        </div>
      ) : null}

      <div className={styles.rows}>
        {rows.map((r, i) => (
          <div
            ref={free}
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

export default PressingInteriorsIndex;
