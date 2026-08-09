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
import dynamic from "next/dynamic";

const ArcArchiveDemo = dynamic(
  () => import("./demo/ArcArchiveDemo").then((m) => m.ArcArchiveDemo),
  { ssr: false }
);
import { PressingArchitecture } from "./viz/PressingArchitecture";
import { PressingStatsBar } from "./viz/PressingStatsBar";
import { PressingCoverageChart } from "./viz/PressingCoverageChart";
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
      let closing: Extract<Section, { type: "closing" }> | undefined;
      let j = i + 1;
      while (j < sections.length) {
        const n = sections[j];
        if (n.type === "text") {
          paragraphs.push(...splitParagraphs(n.content));
          j += 1;
          continue;
        }
        if (n.type === "three-column-text") {
          if (columns) {
            // The brief nests ONE method grid. Sally runs three in a row —
            // porting it means restructuring, not silently dropping two.
            if (process.env.NODE_ENV !== "production") {
              console.warn(
                `PressingLayout: a second three-column-text (${n.id}) follows ` +
                  `the same header — only the first renders; restructure the data`
              );
            }
            j += 1;
            continue;
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

    if (s.type === "dual-image") {
      out.push(
        <PressingPlatesPair
          key={s.id}
          images={[
            { ...s.left, caption: p?.captions?.[0] },
            { ...s.right, caption: p?.captions?.[1] },
          ].map((img) => {
            const cap = splitCaption(img.caption);
            return { src: img.src, alt: img.alt, caption: cap?.label, sub: cap?.sub, ...dim(img.src) };
          })}
          pinForNext={p?.choreo?.pin}
          hold={p?.choreo?.hold !== false}
          mark={p?.mark}
        />
      );
      i += 1;
      continue;
    }

    if (s.type === "editorial-headline" && p?.choreo?.quotePoster) {
      out.push(
        <PressingQuote
          key={s.id}
          text={s.text}
          indent={p.indent}
          mark={p.mark}
        />
      );
      i += 1;
      continue;
    }

    if (s.type === "brand-system") {
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
    // A working piece of the product. Loaded on demand: the demo drags
    // in the app's own component tree and no other study should pay for
    // it. `ssr: false` because it is a local-state toy — there is
    // nothing to render on a server and its first paint is the seed.
    if (s.type === "live-demo") {
      out.push(
        <PressingVizFrame key={s.id} mark={p?.mark}>
          <ArcArchiveDemo />
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
