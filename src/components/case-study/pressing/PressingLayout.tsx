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
import { PressingSwatchLedger } from "./viz/PressingSwatchLedger";
import { PressingPaletteRings } from "./viz/PressingPaletteRings";
import { PressingInteriorsIndex } from "./PressingInteriorsIndex";
/* KITCHEN_FAMILIES is no longer mounted here: the kitchen palette draws
   as rings now, and PressingPaletteRings reads its own data. The export
   stays in palettes.ts as the four sampled values, since the rings and
   the interiors ledger both describe the same four finishes. */
import { JC_PALETTE } from "./viz/palettes";
import { PressingCarouselPlate } from "./PressingCarouselPlate";
import { PressingStatsSummary } from "./viz/PressingStatsSummary";
import { PressingPlateStack } from "./PressingPlateStack";
import { PressingSpectrum } from "./viz/PressingSpectrum";
import { PressingMaterialSpan } from "./viz/PressingMaterialSpan";
import { PressingIntelligenceWheel } from "./viz/PressingIntelligenceWheel";
import { PressingBlastMass } from "./viz/PressingBlastMass";
import { PressingMaterialWheel } from "./viz/PressingMaterialWheel";
import { PressingEditorialRange } from "./viz/PressingEditorialRange";
import { PressingMCPPath } from "./viz/PressingMCPPath";
import { PressingSurfaceLoad } from "./viz/PressingSurfaceLoad";
import { PressingSignalMatrix } from "./viz/PressingSignalMatrix";
import dynamic from "next/dynamic";

const PressingLiveApp = dynamic(
  () => import("./demo/PressingLiveApp").then((m) => m.PressingLiveApp),
  { ssr: false }
);
const PressingProductDemo = dynamic(
  () => import("./demo/PressingProductDemo").then((m) => m.PressingProductDemo),
  { ssr: false }
);
import { PressingArchitecture } from "./viz/PressingArchitecture";
import { PressingStatsBar } from "./viz/PressingStatsBar";
import { PressingCoverageChart } from "./viz/PressingCoverageChart";
import { PressingGapColumn } from "./viz/PressingGapColumn";
import { PressingCoverageCard } from "./PressingCoverageCard";
import { PressingScreenGrid } from "./PressingScreenGrid";
import { PressingSpeedComparison } from "./viz/PressingSpeedComparison";
import { PressingDevTimeline } from "./viz/PressingDevTimeline";
import { SectionRenderer } from "../SectionRenderer";
import { ClimbRoom } from "@/components/fx/ClimbRoom";

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
  "app-showcase",
  "brand",
  "color-field-map",
  "color-palette",
  "double-exposure-anatomy",
  "hex-polygon",
  "polygon-lattice",
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
        if (n.type === "feature-cards") {
          /* The second narrow variant. Same argument as the gap chart:
             the screens belong beside the claim about the interface, not
             as their own block below it. And these files are 380px, so
             the full-measure row was magnifying them 1.8x — the column
             is where they are actually sharp. Titles come across as
             captions; the descriptions do not fit a column and the
             footnote above already names the four views. */
          viz = <PressingScreenGrid key={n.id} items={n.items} />;
          j += 1;
          continue;
        }
        if (n.type === "coverage-chart") {
          /* Chart then card, in the same column: the chart proves the
             gap, the card shows what the product does about it. Both
             read the SAME two figures off this one section, so they
             cannot state different policies — which the app's own demo
             data has done three times over. */
          viz = (
            <div key={n.id}>
              <PressingGapColumn
                assetValue={n.assetValue}
                assetAmount={n.assetAmount}
                policyLimit={n.policyLimit}
                policyAmount={n.policyAmount}
              />
              <PressingCoverageCard
                assetAmount={n.assetAmount}
                policyAmount={n.policyAmount}
              />
            </div>
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
      /* The brief's half of the climb contract. A plate rising after a
         brief pulls itself up by RISE and covers whatever is there —
         which, for a brief, is the tail of its copy column. Reserving
         the room here is the same move the cover and the zoom plate
         already make for their own risers; it stays OUTSIDE the brief so
         its tuned headline/column grid is untouched.
         Keyed off the section the FOLD ended on, not `s`: a brief
         absorbs a run of texts, so the riser's real neighbour is
         sections[j], not sections[i + 1]. */
      if (sections[j]?.pressing?.choreo?.rise === true) {
        out.push(<ClimbRoom key={s.id + "-climb"} />);
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
            plateWidth={p?.plateWidth}
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
    /* The stack is the same content as the row, dealt instead of laid
       out, so it rides the SAME section types and picks its skin off a
       choreo flag exactly as zoom/rise/crossing/quotePoster do. No new
       section type: the classic renderer keeps rendering these as a row
       if a study is ever un-flipped, and port-audit gains no unskinned
       type to warn about. */
    if (
      p?.choreo?.stack &&
      (s.type === "dual-image" || s.type === "triple-image" ||
       s.type === "quad-image" || s.type === "quad-grid" || s.type === "masonry")
    ) {
      const imgs =
        s.type === "dual-image"
          ? [{ ...s.left }, { ...s.right }]
          : s.images.map((im) => ({ ...im }));
      out.push(
        <PressingPlateStack
          key={s.id}
          mark={p.mark}
          images={imgs.map((img, k) => {
            /* Both halves of the caption, unlike a plate row which only
               ever showed the label here — the \n split is the bag's
               existing contract and the stack needs the second line. */
            const cap = splitCaption(p?.captions?.[k]);
            return {
              src: img.src,
              alt: img.alt,
              caption: cap?.label,
              sub: cap?.sub,
              ...dim(img.src),
            };
          })}
        />
      );
      i += 1;
      continue;
    }

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
          /* `native` on the section means the same thing here as in the
             classic renderer: show the frame whole. It zeroes the row's
             bleed, which is a crop before it is a parallax. */
          native={"native" in s ? s.native === true : false}
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
       portfolio. brand-system-volume is a third set of names for the
       same content; it briefly rode the viz bridge instead, which left
       Ivy Park as the last study still drawing the pre-pressing brand
       panel. All three normalise through toLedger(). */
    if (
      s.type === "brand-system" ||
      s.type === "marks-materials" ||
      s.type === "brand-system-volume"
    ) {
      out.push(<PressingSystemIndex key={s.id} section={s} mark={p?.mark} />);
      i += 1;
      continue;
    }

    /* The two colour-subject sections: hue IS the datum here, so they
       leave the classic bridge for the swatch ledger rather than for a
       one-ink chart that could not show its own palette. */
    if (s.type === "kitchen-palette") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          {/* Rings rather than the swatch ledger. The ledger has no
              quantity to draw, which is why it never sat with the rest of
              the kit; the rings carry each finish's measured share of the
              palette values read across the study's photographs, and the
              arcs carry the hues on ink bones. The ledger still serves
              J. Christianson, where a palette is a named set with no
              share to show. */}
          <PressingPaletteRings label="The four finishes" />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }
    if (s.type === "color-permutations") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingSwatchLedger
            label="The palette"
            families={JC_PALETTE}
          />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    /* The interiors ledger. Rows are DERIVED, so the section carries
       only its own copy and the slug does the rest. A study whose
       generator entry is missing renders nothing rather than an empty
       ledger — run `npm run interiors` after adding one. */
    if (s.type === "interiors-index") {
      out.push(
        <PressingInteriorsIndex
          key={s.id}
          slug={study.slug}
          title={s.title}
          intro={[s.introText, s.philosophyText].filter(
            (t): t is string => typeof t === "string" && t.length > 0
          )}
          mark={p?.mark}
        />
      );
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
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingLiveApp
            src={s.src}
            title={s.title}
            origin={s.origin}
            poster={s.poster}
            posterAlt={s.posterAlt}
            tall={s.tall}
            frame={s.frame}
            instruction={s.instruction}
          />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    /* Same frame, one step down the ladder of what can honestly be shown:
       live-app hands the reader a deployed product, this hands them a
       scripted replay of one they cannot be given an account for. Dynamic
       for the same reason — it holds a measured scale and a pause driver,
       both of which are state with nothing to render on a server. */
    if (s.type === "product-demo") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingProductDemo
            demo={s.demo}
            title={s.title}
            stageWidth={s.stageWidth}
            note={s.note}
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

    if (s.type === "material-overlap") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingMaterialSpan />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "material-circos") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingMaterialWheel />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "ai-heatmap") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingSignalMatrix section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "cabin-midcentury-spectrum") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingSpectrum />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "intelligence-flow") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingIntelligenceWheel section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "campaign-blast-radius") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingBlastMass />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "editorial-treatments") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingEditorialRange />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "mcp-architecture") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingMCPPath />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "jeffrey-flagship-radius") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingSurfaceLoad />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "stats-summary") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingStatsSummary section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    if (s.type === "system-architecture") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingArchitecture />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }
    if (s.type === "stats-bar") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingStatsBar section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }
    if (s.type === "coverage-chart") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingCoverageChart section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }
    if (s.type === "speed-comparison") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingSpeedComparison section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }
    if (s.type === "dev-timeline") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <PressingDevTimeline section={s} />
        </PressingVizFrame>
      );
      i += 1;
      continue;
    }

    // ── Classic viz sections, hosted in the pressing frame ──
    if (VIZ_TYPES.has(s.type)) {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark} caption={p?.caption}>
          <SectionRenderer section={s} />
        </PressingVizFrame>
      );
      /* The same half of the climb contract the brief keeps: a rise
         pulls up by RISE regardless of what is actually behind it, and a
         bridged viz section (hex-polygon, the wheels, the ledgers) has
         no pin of its own to reserve that room. Measured on ivy-park:
         the hex device's own frame was 1167px tall and the next
         section's -793.92px pull-up landed inside its visible artwork,
         not in trailing padding — the exact bug ClimbRoom exists to
         prevent, just behind a different kind of predecessor. */
      if (sections[i + 1]?.pressing?.choreo?.rise === true) {
        out.push(<ClimbRoom key={s.id + "-climb"} />);
      }
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
        /* A brief absorbs the run of texts after its header, so a riser
           that follows one has a TEXT as its array neighbour while its
           rendered neighbour is the brief. Walk back over the absorbed
           types to find what actually precedes it on the page. */
        let b = k - 1;
        while (
          b >= 0 &&
          (sections[b].type === "text" ||
            sections[b].type === "text-right" ||
            sections[b].type === "three-column-text" ||
            sections[b].type === "spacer")
        ) {
          b -= 1;
        }
        const rendered = sections[b];
        const prevHolds =
          prev &&
          (prev.type === "meta" ||
            prev.pressing?.choreo?.pin ||
            prev.pressing?.choreo?.zoom ||
            /* a brief reserves ClimbRoom for its riser (see the fold) */
            rendered?.type === "section-header" ||
            /* so does a bridged viz section (see the VIZ_TYPES branch) */
            VIZ_TYPES.has(prev.type));
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
