"use client";

import type { CaseStudy, Section } from "@/lib/types";
import { imageDimensions } from "@/data/image-dimensions";
import { PressingCover } from "./PressingCover";
import { PressingPlate } from "./PressingPlate";
import { PressingPlatesPair } from "./PressingPlatesPair";
import { PressingZoomPlate } from "./PressingZoomPlate";
import { PressingBrief } from "./PressingBrief";
import { PressingCrossing } from "./PressingCrossing";
import { PressingQuote } from "./PressingQuote";
import { RRSystemIndex } from "./RRSystemIndex";
import { PressingClosing } from "./PressingClosing";
import { PressingVizFrame } from "./PressingVizFrame";
import { PressingSystemIndex } from "./PressingSystemIndex";
import { PressingCarouselPlate } from "./PressingCarouselPlate";
import { PressingStatsSummary } from "./viz/PressingStatsSummary";
import { PressingSpectrum } from "./viz/PressingSpectrum";
import dynamic from "next/dynamic";

const PressingLiveApp = dynamic(
  () => import("./demo/PressingLiveApp").then((m) => m.PressingLiveApp),
  { ssr: false }
);
import { PressingArchitecture } from "./viz/PressingArchitecture";
import { PressingStatsBar } from "./viz/PressingStatsBar";
import { PressingCoverageChart } from "./viz/PressingCoverageChart";
import { PressingGapColumn } from "./viz/PressingGapColumn";
import { PressingSpeedComparison } from "./viz/PressingSpeedComparison";
import { PressingDevTimeline } from "./viz/PressingDevTimeline";
import { SectionRenderer } from "../SectionRenderer";

/* ── PressingLayout ─────────────────────────────────────────────────
   Renders a study whose style is "pressing" in the Pressing C language.
   The flat sections array is folded into pressing clusters the same way
   CaseStudyLayout folds headers into subheads: a section-header absorbs
   the text sections (and any three-column-text) that follow it in its
   group, and the closing absorbs its header. The choreography flags on
   each section pick the skin — rise plates, zoom plates, pinned pairs,
   the crossing headline, the quote poster.

   The article carries the .pressing token scope (white paper, Helvetica)
   and breaks out of main's gutters itself so the ground spans the full
   viewport; every component inside manages its own padding, exactly like
   the prototype's .screen sections. */

// The index reel's four source frames — the campaign's actual shoot
// output, fed to the bespoke RRSystemIndex. Bespoke component, bespoke
// feed: these live here, visible, not buried in the component.
const RR = "/case-studies/robert-rodriguez";
const INDEX_REEL_IMAGES = [
  `${RR}/neiman-marcus-robert-rodriguez-woman-model-pink-blazer-cream-polka-dot-dress-orange-red-backdrop-editorial-campaign.jpg`,
  `${RR}/neiman-marcus-robert-rodriguez-woman-pink-blazer-beige-polka-dot-dress-orange-background-editorial-portrait.jpg`,
  `${RR}/neiman-marcus-robert-rodriguez-woman-yellow-blazer-white-pants-coral-heels-curly-hair-pink-orange-gradient-studio-editorial-portrait.jpg`,
  `${RR}/neiman-marcus-robert-rodriguez-woman-curly-blonde-hair-yellow-blazer-coral-pink-top-red-lipstick-studio-portrait.jpg`,
];
const INDEX_REEL_COLORS = ["#E0552F", "#F09A3E", "#E8637A", "#F5EAE7", "#241C18"];

// Classic viz sections that keep their engineering showpieces in a
// pressing study, hosted as-is inside PressingVizFrame on the page's
// paper. The type→component mapping stays SectionRenderer's — one source
// of truth, the classic renderer untouched — at no new bundle cost:
// CaseStudyLayout already ships SectionRenderer in this chunk.
const VIZ_TYPES = new Set<Section["type"]>([
  "feature-cards",
  "pipeline",
  "text-right",
  /* The bespoke showpieces. Hosted as-is on the page's paper rather
     than redesigned, which is exactly what this bridge was built for:
     a study can port TODAY without losing a section, and any one of
     these can get a pressing skin later the way the A.R.C. charts did.
     The alternative was leaving 14 studies unportable behind a queue of
     chart redesigns. */
  "ai-heatmap",
  "app-showcase",
  "brand",
  "brand-system-volume",
  "campaign-blast-radius",
  "color-field-map",
  "color-palette",
  "color-permutations",
  "double-exposure-anatomy",
  "editorial-treatments",
  "hex-polygon",
  "intelligence-flow",
  "jeffrey-flagship-radius",
  "kitchen-palette",
  "material-circos",
  "material-overlap",
  "mcp-architecture",
  "pattern-matrix",
  "sizzle-playground",
  "tech-chart",
  "tech-stack",
  "timeline",
  "two-column-text",
  "typography",
]);

/**
 * Intrinsic size from the image-dimensions manifest. Load-bearing for the
 * scroll feel, not just CLS: lazy plates whose ratio is unknown reflow the
 * page when they load, and a reflow above the viewport eats the scroll
 * delta — the "plate sticks for a beat on entry" bug. The prototype's
 * images were all eager, so it never showed this.
 */
function dim(src: string): { width?: number; height?: number } {
  const d = imageDimensions[src];
  return d ? { width: d[0], height: d[1] } : {};
}

function splitParagraphs(content: string): string[] {
  return content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** A figcaption string uses \n to separate its two mono spans. */
function splitCaption(caption?: string): { label: string; sub?: string } | undefined {
  if (!caption) return undefined;
  const [label, sub] = caption.split("\n");
  return { label, sub };
}

export function PressingLayout({ study }: { study: CaseStudy }) {
  const out: React.ReactNode[] = [];
  const sections = study.sections;
  /* The cover reel declares the study's palette; the carousel plate
     borrows it rather than inventing one. */
  const coverReelColors = (
    sections.find((x) => x.type === "meta") as { reel?: { colors?: string[] } } | undefined
  )?.reel?.colors;
  let i = 0;

  while (i < sections.length) {
    const s = sections[i];
    const p = s.pressing;

    // ── Cover: the meta section is the pinned handover sequence ──
    if (s.type === "meta") {
      out.push(
        <PressingCover
          key={s.id}
          title={s.title}
          statement={s.subtitle}
          reel={s.reel}
          specLine={s.specLine}
          mark={p?.mark}
          // Climb room only when something actually climbs — same
          // derivation as the zoom plates.
          reserveRise={sections[i + 1]?.pressing?.choreo?.rise === true}
        />
      );
      i += 1;
      continue;
    }

    // ── Header-led clusters: brief / crossing / closing ──
    if (s.type === "section-header") {
      // Absorb the run of text sections that follow (subhead + footnote both
      // become column paragraphs — the prototype sets them at one size), and
      // a trailing three-column-text becomes the nested method grid.
      const paragraphs: string[] = [];
      let columns: { title: string; body: string }[] | undefined;
      let columnsMark: { n: string; name: string } | undefined;
      /* A narrow chart absorbed into the copy column. Only the forms
         that HAVE a narrow variant qualify; a full-measure chart keeps
         its own frame. */
      let viz: React.ReactNode | undefined;
      let closing: Extract<Section, { type: "closing" }> | undefined;
      let j = i + 1;
      while (j < sections.length) {
        const n = sections[j];
        if (n.type === "text" || n.type === "text-right") {
          /* text-right is body copy that happened to carry a mark. It
             was breaking the absorb loop and rendering as its own
             full-width block, which split an argument from the copy
             that set it up. */
          paragraphs.push(...splitParagraphs(n.content));
          j += 1;
          continue;
        }
        if (n.type === "coverage-chart") {
          viz = (
            <PressingGapColumn
              key={n.id}
              assetValue={n.assetValue}
              assetAmount={n.assetAmount}
              policyLimit={n.policyLimit}
              policyAmount={n.policyAmount}
            />
          );
          j += 1;
          continue;
        }
        if (n.type === "three-column-text") {
          if (columns) {
            /* The brief nests ONE method grid, so a second one under the
               same header stops the absorb loop and renders standalone
               below. It used to `j += 1; continue`, which swallowed it
               and threw it away — Sally runs three in a row and lost
               two. A warning that content is being discarded is not a
               substitute for not discarding it. */
            break;
          }
          columns = n.columns.map((c) => ({
            title: c.title ?? "",
            body: c.content,
            image: c.image,
          }));
          columnsMark = n.pressing?.mark;
          j += 1;
          continue;
        }
        if (n.type === "closing") {
          closing = n;
          j += 1;
        }
        break;
      }

      if (closing) {
        out.push(
          <PressingClosing
            key={s.id}
            mark={p?.mark}
            title={s.title}
            heldLine={p?.heldLine}
            // Absorbed text renders AHEAD of the closing's own copy — a
            // study authored per the classic pattern (header, subhead,
            // closing) was silently losing its subhead here.
            paragraphs={[...paragraphs, ...splitParagraphs(closing.content)]}
            services={closing.services}
            stack={closing.stack}
            links={closing.links}
          />
        );
      } else if (p?.choreo?.crossing && !columns) {
        out.push(
          <PressingCrossing
            key={s.id}
            headline={p?.heldLine ? `${s.title} ${p.heldLine}` : s.title}
            paragraphs={paragraphs}
            mark={p?.mark}
          />
        );
        /* A crossing pins for 220dvh and scrubs its column line by line,
           so a method grid cannot nest inside it the way it does in a
           brief. It used to be absorbed here and then silently DROPPED —
           A.R.C.'s six pipeline stages vanished from the page that way,
           data present, nothing rendered. They follow the crossing
           instead, in the headline-less brief: same copy column, same
           column-measure images, no second headline announcing them. */
        if (columns) {
          out.push(
            <PressingBrief
              key={s.id + "-columns"}
              columns={columns}
              columnsMark={columnsMark}
            />
          );
        }
      } else {
        out.push(
          <PressingBrief
            key={s.id}
            mark={p?.mark}
            title={s.title}
            heldLine={p?.heldLine}
            paragraphs={paragraphs}
            viz={viz}
            pin={p?.choreo?.pin}
            /* A header asking for `crossing` that ALSO carries method
               columns gets the brief's from-right variation instead:
               same entrance, one column, evidence still attached to the
               argument it belongs to. */
            crossing={p?.choreo?.crossing}
            columns={columns}
            columnsMark={columnsMark}
          />
        );
      }
      i = j;
      continue;
    }

    // ── Image-bearing sections ──
    if (s.type === "hero" || s.type === "image") {
      const src = s.type === "hero" ? s.image : s.src;
      if (p?.choreo?.zoom) {
        out.push(
          <PressingZoomPlate
            key={s.id}
            src={src}
            alt={s.alt}
            plate={p.plate ?? ""}
            captionLines={p.captions ?? []}
            instruction={p.instruction}
            fit={p.choreo?.zoomFit}
            mark={p.mark}
            // The climb room is only reserved when something actually
            // climbs. Reserved with no riser after it, the tail is a
            // screenful of dead pin once the zoom has finished.
            reserveRise={sections[i + 1]?.pressing?.choreo?.rise === true}
            eager={i <= 2}
            {...dim(src)}
          />
        );
      } else {
        out.push(
          <PressingPlate
            key={s.id}
            src={src}
            alt={s.alt}
            caption={p?.caption}
            rise={p?.choreo?.rise}
            bleed={s.type === "image" ? s.bleed : undefined}
            eager={i <= 1}
            {...dim(src)}
          />
        );
      }
      i += 1;
      continue;
    }

    /* triple-image needs no component of its own: PressingPlatesPair
       already maps over N images and only its grid was fixed at two. */
    /* Every image-list section is the same thing at a different count,
       and PressingPlatesPair already maps over N with a grid that
       follows. masonry carries its own column count; the rest take
       one column per image. */
    if (
      s.type === "dual-image" ||
      s.type === "triple-image" ||
      s.type === "quad-image" ||
      s.type === "quad-grid" ||
      s.type === "masonry"
    ) {
      out.push(
        <PressingPlatesPair
          key={s.id}
          images={(s.type === "dual-image"
            ? [
                { ...s.left, caption: p?.captions?.[0] },
                { ...s.right, caption: p?.captions?.[1] },
              ]
            : s.images.map((im, k) => ({ ...im, caption: p?.captions?.[k] }))
          ).map((img) => {
            const cap = splitCaption(img.caption);
            return { src: img.src, alt: img.alt, caption: cap?.label, sub: cap?.sub, ...dim(img.src) };
          })}
          cols={s.type === "masonry" ? s.columns : undefined}
          pinForNext={p?.choreo?.pin}
          hold={p?.choreo?.hold !== false}
          mark={p?.mark}
        />
      );
      i += 1;
      continue;
    }

    /* An editorial headline is a quote poster, always. The flag used to
       gate it, which meant 33 authored headlines across the portfolio
       rendered as NOTHING — they fell straight through to the drop
       branch below. That is the whole reason this skin exists: the copy
       rules describe editorial-headline as a palate cleanser, 2-3 lines,
       pull-quote feel, which is precisely what PressingQuote draws. A
       flag that can only ever be "yes, render my content" is not a
       choice, it is a trapdoor. */
    if (s.type === "editorial-headline") {
      out.push(
        <PressingQuote
          key={s.id}
          text={s.text}
          indent={p?.indent}
          mark={p?.mark}
        />
      );
      i += 1;
      continue;
    }

    /* marks-materials is brand-system under other field names, and it
       appears in 11 studies — the single highest-leverage skin in the
       portfolio. Both normalise through toLedger(). */
    if (s.type === "brand-system" || s.type === "marks-materials") {
      out.push(<PressingSystemIndex key={s.id} section={s} mark={p?.mark} />);
      i += 1;
      continue;
    }

    if (s.type === "rr-system-index") {
      out.push(
        <RRSystemIndex
          key={s.id}
          reelImages={INDEX_REEL_IMAGES}
          reelColors={INDEX_REEL_COLORS}
        />
      );
      i += 1;
      continue;
    }

    // ── The viz kit: charts drawn in the pressing language ──
    // (src/components/case-study/pressing/viz — ink, hairlines, type,
    // one accent at most. The classic showpieces these replace stay
    // untouched for un-migrated studies.)
    // The shipped product, framed. Client-only: the frame's whole job is
    // to hold an empty stage until the reader activates it, which is
    // state, and there is nothing to render on a server.
    if (s.type === "live-app") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark}>
          <PressingLiveApp
            src={s.src}
            title={s.title}
            origin={s.origin}
            poster={s.poster}
            posterAlt={s.posterAlt}
            tall={s.tall}
            instruction={s.instruction}
          />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "hero-carousel" || s.type === "logo-carousel") {
      out.push(
        <PressingCarouselPlate
          key={s.id}
          slides={s.slides}
          /* the study's own palette, taken off the cover reel it
             already declares — a carousel flashing colours the brand
             does not use is a lie about the brand */
          colors={coverReelColors}
          mark={p?.mark}
          caption={p?.captions?.[0]}
        />
      );
      i += 1;
      continue;
    }

    if (s.type === "cabin-midcentury-spectrum") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark}>
          <PressingSpectrum />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "stats-summary") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark}>
          <PressingStatsSummary section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "system-architecture") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark}>
          <PressingArchitecture />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }
    if (s.type === "stats-bar") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark}>
          <PressingStatsBar section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }
    if (s.type === "coverage-chart") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark}>
          <PressingCoverageChart section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }
    if (s.type === "speed-comparison") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark}>
          <PressingSpeedComparison section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }
    if (s.type === "dev-timeline") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark}>
          <PressingDevTimeline section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    // ── Classic viz sections, hosted in the pressing frame ──
    if (VIZ_TYPES.has(s.type)) {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark}>
          <SectionRenderer section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    /* ── absorbed types, rendered standalone ──
       text, three-column-text and closing are normally swallowed by a
       preceding section-header. When one is NOT preceded by a header —
       a second three-column-text under one header, a text block after a
       plate, a closing that opens its own cluster — it used to reach the
       drop branch and disappear. They render on their own now.
       Measured before this change: 44 sections across 20 studies. */
    if (s.type === "text" || s.type === "text-right") {
      out.push(
        <PressingBrief key={s.id} paragraphs={splitParagraphs(s.content)} mark={p?.mark} />
      );
      i += 1;
      continue;
    }
    if (s.type === "three-column-text") {
      out.push(
        <PressingBrief
          key={s.id}
          columns={s.columns.map((c) => ({
            title: c.title ?? "",
            body: c.content,
            image: c.image,
          }))}
          columnsMark={p?.mark}
        />
      );
      i += 1;
      continue;
    }
    if (s.type === "closing") {
      out.push(
        <PressingClosing
          key={s.id}
          mark={p?.mark}
          /* A standalone closing has no header above it to borrow a
             title from, so it leads with its own copy. */
          title=""
          paragraphs={splitParagraphs(s.content)}
          services={s.services}
          stack={s.stack}
          links={s.links}
        />
      );
      i += 1;
      continue;
    }
    /* A spacer is deliberate air in the classic layout. Pressing sets
       its own rhythm, so the air is already there — consuming it
       silently is correct, but it must be consumed EXPLICITLY rather
       than falling through the drop branch and tripping the warning. */
    if (s.type === "spacer") {
      i += 1;
      continue;
    }

    // A section type without a pressing skin yet: skip it loudly in dev
    // rather than rendering the classic component into the white ground.
    // The copy is DROPPED — production renders nothing for this section.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `PressingLayout: no skin for section type "${s.type}" (${s.id}) — ` +
          `its content is dropped; give it a skin or restructure the data`
      );
    }
    i += 1;
  }

  // The choreography neighbor contract, checked where the layout already
  // has both sides: a rise section whose previous sibling neither pins,
  // zooms, nor is the cover will slide over content that is still moving.
  if (process.env.NODE_ENV !== "production") {
    sections.forEach((sec, k) => {
      if (sec.pressing?.choreo?.rise) {
        const prev = sections[k - 1];
        const prevHolds =
          prev &&
          (prev.type === "meta" ||
            prev.pressing?.choreo?.pin ||
            prev.pressing?.choreo?.zoom);
        if (!prevHolds) {
          console.warn(
            `PressingLayout: "${sec.id}" rises but its previous section ` +
              `does not hold (pin/zoom/cover) — the climb has nothing to cross`
          );
        }
      }
    });
  }

  return (
    // The article sits INSIDE main's md:px-[50px] column — that gutter is
    // the page's side mat, standing in for the prototype's 40px .screen
    // padding (the briefs, pairs, and index all assume it). Sections that
    // need the full viewport (cover, plates, zooms, crossing, quote) carry
    // .hero-breakout themselves. The white paper therefore can't live on
    // the article (it would stop at the column edge and leave cream strips
    // in the gutters): a breakout layer behind the content paints it across
    // the whole viewport instead. isolate scopes the layer's z-index so it
    // sits behind every section but never behind main's own ground; it
    // creates only a stacking context, which sticky children survive —
    // transform/filter/overflow are the sticky killers, not isolation.
    <article className="pressing isolate relative w-full" style={{ background: "transparent" }}>
      <div
        aria-hidden
        // top -54px: the article starts BELOW the sticky masthead, and at
        // scroll 0 the strip behind the bar showed main's cream (and the
        // SpringSolve sketches behind it). The paper reaches up under the
        // bar so the pressing page owns its whole ground.
        className="hero-breakout absolute bottom-0 -z-10"
        style={{ background: "var(--pp-paper)", top: "-54px" }}
      />
      {out}
    </article>
  );
}
