"use client";

import Link from "next/link";
import { type Tag, type Project, categoryInfo, getProjectsByTag, getOtherTags } from "@/data/projects";
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

/* ── Large featured image ── */
function FeaturedImage({ project }: { project: Project }) {
  const inner = (
    <div className="w-[180px] md:w-[240px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.image}
        alt={project.title}
        className="w-full aspect-square object-cover rounded-[23%]"
      />
      <div className="text-center mt-2 md:mt-3">
        <p className="text-[10px] md:text-[12px] font-medium leading-[1.5]">{project.title}</p>
        <p className="text-[10px] md:text-[11px] leading-[1.5] text-foreground/50">{project.category}</p>
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
    campaigns: "More campaigns",
    interiors: "More interiors",
    branding: "More branding",
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
  const categoryProjects = getProjectsByTag(tag);
  const featured = categoryProjects.slice(0, 3);
  const rest = categoryProjects.slice(3);
  const otherTags = getOtherTags(tag);

  // Chunk into rows of 4
  const chunkRows = (items: Project[]) => {
    const rows: Project[][] = [];
    for (let i = 0; i < items.length; i += 4) {
      rows.push(items.slice(i, i + 4));
    }
    return rows;
  };

  const restRows = chunkRows(rest);

  return (
    <div className="relative w-full max-w-[1400px] mx-auto min-h-full">
      {/* Breadcrumb */}
      <div className="fixed top-[18px] left-4 right-14 z-40 md:sticky md:top-0 md:mb-[30px] md:left-0 md:right-0 md:w-auto md:px-0">
        <div className="flex items-center justify-between gap-4">
          <nav className="text-[10px] md:text-[12px] leading-[1] tracking-normal text-[#141414] truncate min-w-0">
            <span>Reckon House Staples</span>
            <span className="mx-1 md:mx-2 text-[#141414]/40">/</span>
            <span>Project Index</span>
            <span className="mx-1 md:mx-2 text-[#141414]/40">/</span>
            <span className="font-bold">{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
          </nav>
          <span className="hidden md:inline text-[12px] leading-[1] tracking-normal text-[#141414] shrink-0">
            House OS. Beta.
          </span>
        </div>
      </div>

      <div className="pb-24 space-y-10 md:space-y-[100px] pt-12 md:pt-0">

        {/* ── Featured: Three large square images ── */}
        {featured.length >= 1 && (
          <>
            {/* Mobile: swipe carousel */}
            <div className="md:hidden">
              <SwipeRow cardFraction={0.75}>
                {featured.slice(0, 3).map((proj) => (
                  <FeaturedImage key={proj.id} project={proj} />
                ))}
              </SwipeRow>
            </div>
            {/* Desktop: flex row */}
            <div className="hidden md:flex justify-between items-start">
              {featured.slice(0, 3).map((proj) => (
                <FeaturedImage key={proj.id} project={proj} />
              ))}
            </div>
          </>
        )}

        {/* ── First thumbnail row ── */}
        {restRows[0] && <ThumbRow items={restRows[0]} />}

        {/* ── Second thumbnail row ── */}
        {restRows[1] && <ThumbRow items={restRows[1]} />}

        {/* ── Editorial headline ── */}
        <div className="py-8 md:py-16">
          <h2 className="text-[48px] md:text-[96px] leading-[1.05] tracking-[-0.03em] font-light text-center text-foreground whitespace-pre-line">
            {info.headline}
          </h2>
        </div>

        {/* ── Two-column text block ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-5 gap-y-4 px-4 md:px-0">
          <div className="md:col-span-3">
            <p className="text-[11px] md:text-[14px] font-bold leading-[1.875]">
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </p>
          </div>
          <div className="md:col-start-7 md:col-span-6">
            {info.body.split("\n\n").map((p, i) => (
              <p key={i} className="text-[11px] md:text-[14px] leading-[1.875] text-foreground/80 mb-4 last:mb-0">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* ── Remaining rows ── */}
        {restRows.slice(2).map((row, i) => (
          <ThumbRow key={`rest-${i}`} items={row} />
        ))}

        {/* ── Data visualization ── */}
        <div className="px-4 md:px-0 py-12">
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
