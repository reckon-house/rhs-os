"use client";

import Link from "next/link";
import { type Tag, type Project, type CategoryHero, categoryInfo, getProjectsByTag, getProjectById, getOtherTags } from "@/data/projects";
import { CareerGalaxy } from "@/components/CareerGalaxy";
import { SwipeRow } from "@/components/case-study/SwipeRow";

/* ── Thumbnail (same as homepage) ── */
function Thumb({ project }: { project: Project }) {
  const inner = (
    <div className="w-[130px] md:w-[160px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.image}
        alt={project.title}
        className="w-full aspect-square object-cover rounded-[23%]"
      />
      <div className="text-center mt-2 md:mt-3">
        <p className="text-[10px] font-medium leading-[14px]">{project.title}</p>
        <p className="text-[10px] leading-[14px] text-foreground/50">{project.category}</p>
      </div>
    </div>
  );

  if (project.href) {
    return (
      <Link href={project.href} className="hp-thumb group block">
        {inner}
      </Link>
    );
  }
  return <div className="hp-thumb group cursor-default">{inner}</div>;
}

/* ── Large featured hero image with project info ── */
function FeaturedHero({ hero }: { hero: CategoryHero }) {
  const project = getProjectById(hero.projectId);
  if (!project) return null;

  const inner = (
    <div className="w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hero.image}
        alt={project.title}
        className="w-full aspect-[4/2] object-cover rounded-[clamp(30px,5vw,50px)]"
      />
      <div className="text-center mt-2 md:mt-3">
        <p className="text-[10px] font-medium leading-[14px]">{project.title}</p>
        <p className="text-[10px] leading-[14px] text-foreground/50">{project.category}</p>
      </div>
    </div>
  );

  if (project.href) {
    return <Link href={project.href} className="block">{inner}</Link>;
  }
  return <div>{inner}</div>;
}

/* ── Thumbnail row (4 per row) ── */
function ThumbRow({ items }: { items: Project[] }) {
  return (
    <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
      {items.map((proj) => (
        <Thumb key={proj.id} project={proj} />
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
    <p className="text-[11px] md:text-[14px] text-[#141414] font-bold mb-6">
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

  return (
    <div className="relative w-full max-w-[1400px] mx-auto min-h-full px-[10px] pt-[10px] md:px-0 md:pt-0">
      {/* Breadcrumb */}
      <div className="fixed top-[10px] left-[10px] right-14 z-40 md:top-[20px] md:left-[50px] md:right-[50px]">
        <div className="flex items-center justify-between gap-4">
          <nav className="text-[10px] md:text-[12px] leading-[1] tracking-normal text-[#141414] truncate min-w-0">
            <Link href="/" className="hover:opacity-70 transition-opacity">House</Link>
            <span className="mx-1 md:mx-2 text-[#141414]/40">/</span>
            <span className="font-bold">{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
          </nav>
          <span className="hidden md:inline text-[12px] leading-[1] tracking-normal text-[#141414] shrink-0">
            House OS. Beta.
          </span>
        </div>
      </div>

      {/* Spacer for fixed breadcrumb */}
      <div className="h-[30px] md:h-[50px]" />

      <div className="pb-24 space-y-10 md:space-y-[100px] pt-12 md:pt-0">

        {/* ── Featured: Two hero images ── */}
        <>
          {/* Mobile: swipe carousel */}
          <div className="md:hidden">
            <SwipeRow cardFraction={0.85}>
              {heroes.map((hero, i) => (
                <FeaturedHero key={i} hero={hero} />
              ))}
            </SwipeRow>
          </div>
          {/* Desktop: side by side */}
          <div className="hidden md:flex md:justify-between md:items-start">
            <div className="md:w-[40%]">
              <FeaturedHero hero={heroes[0]} />
            </div>
            <div className="md:w-[40%]">
              <FeaturedHero hero={heroes[1]} />
            </div>
          </div>
        </>

        {/* ── All category thumbnail rows ── */}
        {allRows.map((row, i) => (
          <ThumbRow key={`thumb-${i}`} items={row} />
        ))}

        {/* ── Editorial headline ── */}
        <div className="py-8 md:py-16">
          <h2 className="text-[48px] md:text-[96px] leading-[1.05] tracking-[-0.03em] font-light text-center text-foreground whitespace-pre-line">
            {info.headline}
          </h2>
        </div>

        {/* ── Expertise section (grouped container) ── */}
        {info.expertise && (
          <div className="max-w-[1100px] mx-auto overflow-hidden px-6 py-10 md:px-16 md:py-16" style={{ backgroundColor: "#ECE6E1", borderRadius: "clamp(30px, 5vw, 75px)" }}>
            {/* Pill label */}
            <div className="md:pl-[calc(100%/24)]">
              <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-current font-medium px-4 py-2 rounded-full bg-current/[0.06] mb-5">
                {info.expertise.label}
              </span>
            </div>
            {/* Title */}
            <h2 className="text-[16px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold mb-2 md:pl-[calc(100%/24)]">
              {info.expertise.title.replace(/\n/g, " ")}
            </h2>
            {/* Subhead */}
            <p className="text-[16px] md:text-[24px] font-normal leading-[1.5] tracking-[-0.02em] md:pl-[calc(100%/24)] mb-4">
              {info.expertise.subhead}
            </p>
            {/* Footnote */}
            <p className="text-[11px] md:text-[14px] leading-[1.875] md:pl-[calc(100%/24)] mb-8">
              {info.expertise.footnote}
            </p>
            {/* Three columns — Desktop */}
            <div className="hidden md:block space-y-10 md:px-[calc(100%/24)]">
              {info.expertise.columns.map((col, i) => (
                <div key={i} className="grid grid-cols-12 gap-x-5">
                  <h3 className="col-span-3 text-[11px] md:text-[14px] font-bold leading-[1.875] pt-[3px]">
                    {col.title}
                  </h3>
                  <div className="col-start-7 col-span-6">
                    {col.content.split("\n\n").map((p, j) => (
                      <p key={j} className="text-[11px] md:text-[14px] leading-[1.875] text-current/80 mb-4 last:mb-0">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Three columns — Mobile */}
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

        {/* ── Data visualization ── */}
        <div className="max-w-[1100px] mx-auto px-4 md:px-0 py-12">
          <CareerGalaxy />
        </div>

        {/* ── Other category sections ── */}
        {otherTags.map((otherTag) => {
          const otherProjects = getProjectsByTag(otherTag);
          const otherRows = chunkRows(otherProjects);
          return (
            <div key={otherTag} className="space-y-10 md:space-y-[100px]">
              <CategoryLabel tag={otherTag} />
              {otherRows.map((row, i) => (
                <ThumbRow key={`${otherTag}-${i}`} items={row} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
