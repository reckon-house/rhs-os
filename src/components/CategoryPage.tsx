"use client";

import Image from "next/image";
import Link from "next/link";
import { type Tag, type Project, type CategoryHero, categoryInfo, getProjectsByTag, getProjectById, getOtherTags } from "@/data/projects";
import { SwipeRow } from "@/components/case-study/SwipeRow";
import { ScrambleOnView } from "@/components/fx/ScrambleText";
import { Thumb } from "@/components/Thumb";
import { ThumbEnergy } from "@/components/fx/ThumbEnergy";

/* ── Large featured hero image with project info ── */
function FeaturedHero({ hero }: { hero: CategoryHero }) {
  const project = getProjectById(hero.projectId);
  if (!project) return null;

  const inner = (
    <div className="w-full">
      <div className="relative w-full aspect-[4/2] rounded-[clamp(30px,5vw,50px)] overflow-hidden">
        <Image
          src={hero.image}
          alt={project.title}
          fill
          sizes="(min-width: 768px) 40vw, 88vw"
          className="object-cover"
        />
      </div>
      <div className="text-center mt-2 md:mt-3">
        <p className="text-[10px] font-medium leading-[14px]">{project.title}</p>
        <p className="text-[10px] leading-[14px] text-foreground/50 max-w-[46ch] mx-auto">{hero.blurb}</p>
      </div>
    </div>
  );

  if (project.href) {
    return <Link href={project.href} className="block">{inner}</Link>;
  }
  return <div>{inner}</div>;
}

/* ── Thumbnail row (4 per row) ── startIndex drives the per-page L/R blot spread ── */
function ThumbRow({ items, startIndex = 0 }: { items: Project[]; startIndex?: number }) {
  return (
    <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
      {items.map((proj, i) => (
        <Thumb key={proj.id} project={proj} blotIndex={startIndex + i} />
      ))}
      {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, i) => (
        <div key={`spacer-${i}`} className="hp-thumb w-[130px] md:w-[160px]" />
      ))}
    </div>
  );
}

/* ── Category section label ── */
function CategoryLabel({ tag }: { tag: Tag }) {
  const labels: Record<Tag, string> = {
    digital: "More digital",
    creative: "More creative",
    interiors: "More interiors",
  };
  return (
    <p className="text-[11px] md:text-[13px] text-[#141414] font-bold mb-6">
      {labels[tag]}
    </p>
  );
}

/* ── Main category page ── */
export function CategoryPage({ tag }: { tag: Tag }) {
  const info = categoryInfo[tag];
  const heroes = info.heroes;
  const heroIds = new Set(heroes.map((h) => h.projectId));
  const categoryProjects = getProjectsByTag(tag).filter((p) => !heroIds.has(p.id));
  const otherTags = getOtherTags(tag);

  // Chunk into rows of 4
  const chunkRows = (items: Project[]) => {
    const rows: Project[][] = [];
    for (let i = 0; i < items.length; i += 4) {
      rows.push(items.slice(i, i + 4));
    }
    return rows;
  };

  const allRows = chunkRows(categoryProjects);

  // All body paragraphs flow into the h1 as one continuous block — the
  // homepage manifesto pattern, no separate smaller-tier footnote.
  const overviewParagraphs = info.body.split("\n\n");

  // Running index across every thumbnail on the page, so the ink blots alternate
  // left/right down the whole page instead of clustering per-section.
  let blotIdx = 0;

  return (
    <div className="relative w-full max-w-[1400px] mx-auto min-h-full px-[10px] pt-[10px] md:px-0 md:pt-0">
      {/* Scroll-reactive thumbnail motion (writes --e to #hp-grid below) */}
      <ThumbEnergy />
      {/* Breadcrumb */}
      <div className="fixed top-[10px] left-[10px] right-[10px] z-40 md:top-[20px] md:left-[50px] md:right-[50px]">
        <div className="flex items-center justify-between gap-4">
          <nav className="text-[10px] md:text-[12px] leading-[1] tracking-normal text-[#141414] truncate min-w-0">
            <Link href="/" className="hover:opacity-70 transition-opacity">House</Link>
            <span className="mx-1 md:mx-2 text-[#141414]/40">/</span>
            <span className="font-bold">{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
          </nav>
          <a
            href="https://www.awwwards.com/sites/reckon-house-staples"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[10px] tracking-[0.06em] capitalize text-[#141414] font-medium px-3 py-1.5 rounded-full bg-[#141414]/[0.06] hover:bg-[#141414]/[0.1] transition-colors shrink-0"
          >
            <ScrambleOnView text={"AWWWARDS NOMINEE".toLowerCase()} />
          </a>
        </div>
      </div>

      {/* Spacer for fixed breadcrumb */}
      <div className="h-[20px] md:h-[50px]" />

      <div id="hp-grid" className="pb-24 space-y-10 md:space-y-[100px]">

        {/* ── Page header: overview + featured heroes, kept tight as one unit
            so the heroes read as part of the header, not the first grid row. ── */}
        <div className="space-y-6 md:space-y-10">

        {/* ── Overview block at top — pill + headline + body. Mirrors the
            homepage manifesto pattern. The three-column practice breakdown
            sits below the projects in its own cream container (further down). */}
        <section className="w-full pt-4 md:pt-12 pb-0 px-4 md:px-0">
          <span className="inline-block text-[10px] tracking-[0.06em] capitalize text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
            <ScrambleOnView text={"SECTION 01: OVERVIEW".toLowerCase()} />
          </span>
          <div className="text-[18px] md:text-[20px] leading-[1.5] tracking-[-0.02em] font-normal text-[#141414] mb-8 md:mb-10">
            <h1 className="inline font-bold">{info.headline.replace(/\n/g, " ")}</h1>
            {overviewParagraphs.map((para, i) => (
              <span key={i}>{" "}{para}</span>
            ))}
          </div>

          {/* Meta fields — left-aligned, mirrors homepage manifesto pattern */}
          <div className="text-spec text-foreground/90">
            <p>
              <span className="font-bold">Field </span>
              {info.meta.field}
            </p>
            <p>
              <span className="font-bold">Author </span>
              Jeremy Prasatik
              {"  Active Since: "}
              {info.meta.activeSince}
              {"  Status: "}
              {info.meta.status}
            </p>
            <p>
              <span className="font-bold">Classification </span>
              {info.meta.classification}
            </p>
          </div>
        </section>

        {/* ── Featured: Two hero images ── */}
        <>
          {/* Mobile: swipe carousel */}
          <div className="md:hidden">
            <SwipeRow cardFraction={0.85} inset={0}>
              {heroes.map((hero, i) => (
                <FeaturedHero key={i} hero={hero} />
              ))}
            </SwipeRow>
          </div>
          {/* Desktop: connected pair filling the container width */}
          <div className="hidden md:flex md:gap-5 md:items-start">
            <div className="md:flex-1 md:min-w-0">
              <FeaturedHero hero={heroes[0]} />
            </div>
            <div className="md:flex-1 md:min-w-0">
              <FeaturedHero hero={heroes[1]} />
            </div>
          </div>
        </>
        </div>

        {/* ── All category thumbnail rows ── */}
        {allRows.map((row, i) => {
          const start = blotIdx;
          blotIdx += row.length;
          return <ThumbRow key={`thumb-${i}`} items={row} startIndex={start} />;
        })}

        {/* ── Three-column expertise breakdown — sits BELOW the projects in
            its own cream container. Now mirrors the case-study section
            pattern: pill + bold headline + larger subhead + smaller footnote
            at the top of the container, then the three columns of supporting
            detail below. */}
        {info.expertise && (
          <div className="max-w-[1100px] mx-auto overflow-hidden px-6 py-10 md:px-16 md:py-16" style={{ backgroundColor: "#ECE6E1", borderRadius: "clamp(30px, 5vw, 75px)" }}>
            {/* Section header — pill, headline, subhead, footnote */}
            <div className="md:px-[calc(100%/24)] mb-10 md:mb-14">
              <span className="inline-block text-[10px] tracking-[0.06em] capitalize text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
                {info.expertise.label.toLowerCase()}
              </span>
              <div className="text-[18px] md:text-[20px] leading-[1.5] tracking-[-0.02em] font-normal text-[#141414]">
                <h2 className="inline font-bold">{info.expertise.title.replace(/\n/g, " ")}</h2>
                {" "}{info.expertise.subhead}
                {" "}{info.expertise.footnote}
              </div>
            </div>

            {/* Desktop columns */}
            <div className="hidden md:block space-y-10 md:px-[calc(100%/24)]">
              {info.expertise.columns.map((col, i) => (
                <div key={i} className="grid grid-cols-12 gap-x-5">
                  <h3 className="col-span-3 text-[11px] md:text-[13px] font-bold leading-[1.875] pt-[3px]">
                    {col.title}
                  </h3>
                  <div className="col-start-7 col-span-6">
                    {col.content.split("\n\n").map((p, j) => (
                      <p key={j} className="text-[11px] md:text-[13px] leading-[1.875] text-current/80 mb-4 last:mb-0">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Mobile columns */}
            <div className="md:hidden space-y-6">
              {info.expertise.columns.map((col, i) => (
                <div key={i}>
                  <h3 className="text-[11px] font-bold leading-[1.875] mb-1">{col.title}</h3>
                  {col.content.split("\n\n").map((p, j) => (
                    <p key={j} className="text-[11px] leading-[1.875] text-current/80 mb-3 last:mb-0">
                      {p}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Other category sections ── */}
        {otherTags.map((otherTag) => {
          const otherProjects = getProjectsByTag(otherTag);
          const otherRows = chunkRows(otherProjects);
          return (
            <div key={otherTag} className="space-y-10 md:space-y-[100px]">
              <CategoryLabel tag={otherTag} />
              {otherRows.map((row, i) => {
                const start = blotIdx;
                blotIdx += row.length;
                return <ThumbRow key={`${otherTag}-${i}`} items={row} startIndex={start} />;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
