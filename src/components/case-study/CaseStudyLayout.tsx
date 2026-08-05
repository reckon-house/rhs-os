"use client";

import { useState, useEffect } from "react";
import type { CaseStudy, Section } from "@/lib/types";
import { SectionRenderer } from "./SectionRenderer";

/** Map section types to grid column placement.
 *  Visual/full-width sections span all 12 columns.
 *  Text sections get a 1-column inset on mobile (col-start-2)
 *  to align with MetaBlock, then go full-width on desktop
 *  where internal padding (md:pl-[calc(100%/24)]) takes over. */
function getColSpan(type: string): string {
  switch (type) {
    case "meta":
      return "col-start-2 col-span-10";
    // Visual / full-width sections — no mobile inset
    case "hero":
    case "hero-carousel":
    case "image":
    case "dual-image":
    case "triple-image":
    case "pipeline":
    case "stats-bar":
    case "system-architecture":
    case "coverage-chart":
    case "speed-comparison":
    case "dev-timeline":
    case "brand-system":
    case "brand-block":
    case "color-palette":
    case "typography-block":
    case "app-showcase":
    case "tech-stack":
    case "tech-chart":
    case "feature-cards":
    case "spacer":
    case "timeline":
    case "pattern-matrix":
    case "material-circos":
    case "kitchen-palette":
    case "hex-polygon":
    case "sizzle-playground":
    case "campaign-blast-radius":
    case "color-permutations":
    case "editorial-treatments":
    case "logo-carousel":
    case "marks-materials":
      return "col-span-12";
    // Text sections — inset on mobile, full width on desktop
    default:
      return "col-start-2 col-span-10 md:col-start-1 md:col-span-12";
  }
}

/** Fold a section-header immediately followed by a text(xl/subhead) block into
 *  ONE section-header carrying both — the bold title flows into the regular
 *  lead sentence as a single block, manifesto-style, instead of stacking as two
 *  separately-spaced components. The text block is dropped from the render
 *  list; anything else after it (footnotes, images, etc.) is untouched. Runs
 *  on the flat sections array, before grouping. */
function foldSectionHeaders(sections: Section[]): Section[] {
  const result: Section[] = [];
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    const next = sections[i + 1];
    if (
      s.type === "section-header" &&
      next?.type === "text" &&
      (next.size === "xl" || next.size === "subhead")
    ) {
      result.push({ ...s, subhead: next.content });
      i++;
      continue;
    }
    result.push(s);
  }
  return result;
}

/** Group consecutive sections that share the same group.name */
type SectionOrGroup =
  | { kind: "single"; section: Section }
  | { kind: "group"; name: string; bg?: string; radius?: number; padding?: string; bleed?: boolean; sections: Section[] };

function groupSections(sections: Section[]): SectionOrGroup[] {
  const result: SectionOrGroup[] = [];
  let i = 0;

  while (i < sections.length) {
    const s = sections[i];
    if (s.group?.name) {
      const groupName = s.group.name;
      // Collect the first section's group config (bg, radius, padding, bleed)
      const bg = s.group.bg;
      const radius = s.group.radius;
      const padding = s.group.padding;
      const bleed = s.group.bleed;
      const grouped: Section[] = [];

      while (i < sections.length && sections[i].group?.name === groupName) {
        grouped.push(sections[i]);
        i++;
      }

      result.push({ kind: "group", name: groupName, bg, radius, padding, bleed, sections: grouped });
    } else {
      result.push({ kind: "single", section: s });
      i++;
    }
  }

  return result;
}

export function CaseStudyLayout({ study }: { study: CaseStudy }) {
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Ctrl+G or Cmd+G toggles grid overlay
      if ((e.metaKey || e.ctrlKey) && e.key === "g") {
        e.preventDefault();
        setShowGrid((v) => !v);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const items = groupSections(foldSectionHeaders(study.sections));

  return (
    <>
    <article className="relative w-full max-w-[1100px] mx-auto pb-24">

      {/* 12-column grid overlay — toggle with Ctrl/Cmd+G */}
      {showGrid && (
        <div className="pointer-events-none fixed inset-0 z-50 ml-[161px] pt-[50px] pl-[50px] pr-[50px]">
          <div className="h-full max-w-[1400px] mx-auto grid grid-cols-12 gap-x-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-full bg-[#ff000010] border-x border-[#ff000020]"
              />
            ))}
          </div>
        </div>
      )}

      {/* Content grid */}
      <div className="grid grid-cols-12 gap-x-0 md:gap-x-5">
        {items.map((item, idx) => {
          // Top gap before each new section (section-header / group / carousel).
          const isCarousel = item.kind === "single" && item.section.type === "logo-carousel";
          const isNewSection =
            (item.kind === "single" && item.section.type === "section-header") ||
            item.kind === "group" ||
            isCarousel;
          const prevItem = idx > 0 ? items[idx - 1] : null;
          const prevIsHero =
            prevItem?.kind === "single" &&
            (prevItem.section.type === "hero" || prevItem.section.type === "hero-carousel");
          const isBleedItem = (item.kind === "group" && item.bleed) || isCarousel;
          const sectionGap = isNewSection && idx > 0
            ? (prevIsHero || isBleedItem) ? "pt-[40px] md:pt-[80px]" : "pt-[40px] md:pt-[100px]"
            : "";

          if (item.kind === "single") {
            const span = getColSpan(item.section.type);
            return (
              <div key={item.section.id} className={`${span} ${sectionGap}`}>
                <SectionRenderer section={item.section} />
              </div>
            );
          }

          // Grouped sections — wrap in a styled container
          const isDarkBg = item.bg && parseInt(item.bg.replace("#", "").slice(0, 2), 16) < 80;
          const bleedClass = item.bleed ? "hero-breakout" : "";
          return (
            <div key={item.name} className={`col-span-12 ${sectionGap}`}>
              <div
                data-nav-dark={isDarkBg ? true : undefined}
                className={`overflow-hidden group-container ${bleedClass} ${isDarkBg ? "text-[#EDE7E2]" : ""}`}
                style={{
                  backgroundColor: item.bg,
                  borderRadius: item.bleed ? undefined : (item.radius ? `clamp(30px, 5vw, ${item.radius}px)` : undefined),
                  ["--group-padding" as string]: item.padding,
                }}
              >
                {item.sections.map((section) => (
                  <SectionRenderer key={section.id} section={section} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </article>
    </>
  );
}
