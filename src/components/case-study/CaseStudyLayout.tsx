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
      return "col-span-12";
    // Text sections — inset on mobile, full width on desktop
    default:
      return "col-start-2 col-span-10 md:col-start-1 md:col-span-12";
  }
}

/** Group consecutive sections that share the same group.name */
type SectionOrGroup =
  | { kind: "single"; section: Section }
  | { kind: "group"; name: string; bg?: string; radius?: number; padding?: string; sections: Section[] };

function groupSections(sections: Section[]): SectionOrGroup[] {
  const result: SectionOrGroup[] = [];
  let i = 0;

  while (i < sections.length) {
    const s = sections[i];
    if (s.group?.name) {
      const groupName = s.group.name;
      // Collect the first section's group config (bg, radius, padding)
      const bg = s.group.bg;
      const radius = s.group.radius;
      const padding = s.group.padding;
      const grouped: Section[] = [];

      while (i < sections.length && sections[i].group?.name === groupName) {
        grouped.push(sections[i]);
        i++;
      }

      result.push({ kind: "group", name: groupName, bg, radius, padding, sections: grouped });
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

  const items = groupSections(study.sections);

  return (
    <>
    {/* Breadcrumb bar — outside max-w container so it spans full width */}
    <div className="fixed top-[18px] left-4 right-14 z-40 md:sticky md:top-0 md:-mb-[25px] md:px-0">
      <div className="flex items-center justify-between gap-4">
        <nav className="text-[10px] md:text-[12px] leading-[1] tracking-normal text-[#141414] truncate min-w-0">
          <span>Case Studies</span>
          <span className="mx-1 md:mx-2 text-[#141414]/40">/</span>
          <span>Apps</span>
          <span className="mx-1 md:mx-2 text-[#141414]/40">/</span>
          <span className="font-bold">{study.title}</span>
        </nav>
        <span className="hidden md:inline text-[12px] leading-[1] tracking-normal text-[#141414] shrink-0">
          House OS. Beta.
        </span>
      </div>
    </div>
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
          // Add 200px spacing before section-header items (except the first few)
          const isNewSection =
            (item.kind === "single" && item.section.type === "section-header") ||
            item.kind === "group";
          const prevItem = idx > 0 ? items[idx - 1] : null;
          const prevIsHero = prevItem?.kind === "single" && prevItem.section.type === "hero";
          const sectionGap = isNewSection && idx > 0
            ? prevIsHero ? "pt-[40px] md:pt-[80px]" : "pt-[80px] md:pt-[200px]"
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
          return (
            <div key={item.name} className={`col-span-12 ${sectionGap}`}>
              <div
                className="overflow-hidden group-container"
                style={{
                  backgroundColor: item.bg,
                  borderRadius: item.radius ? `clamp(30px, 5vw, ${item.radius}px)` : undefined,
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
