import type { MetaSection } from "@/lib/types";

export function MetaBlock({
  field,
  author,
  published,
  status,
  classification,
  title,
  subtitle,
  abstract,
  summary,
}: MetaSection) {
  const lines = title.split("\n");
  const firstLine = lines[0] || "";
  const restLines = lines.slice(1).join(" ") || "";

  const abstractParagraphs = abstract ? abstract.split("\n\n") : [];

  return (
    <section className="w-full pt-8 md:pt-12 pb-4">
      {/* Title */}
      <h1 className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold">
        {title.replace(/\n/g, " ")}
      </h1>

      {/* Subtitle — spans full width, regular weight */}
      {subtitle && (
        <p className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-normal text-[#141414] mb-6">
          {subtitle}
        </p>
      )}

      {/* Two columns on desktop: spec fields + TL;DR hold the left, abstract
          rises up beside them on the right. Stacks on mobile. */}
      <div className="md:flex md:justify-between">
        {/* Left column — spec fields + TL;DR */}
        <div className="text-spec text-foreground/90 md:w-[35%]">
          <p>
            <span className="font-bold">Field </span>
            {field}
          </p>
          <p>
            <span className="font-bold">Author </span>
            {author}
            {"  Published: "}
            {published}
            {"  Status: "}
            {status}
          </p>
          <p>
            <span className="font-bold">Classification </span>
            {classification.join(" ")}
          </p>
          {summary && summary.length > 0 && (
            <p className="mt-3">
              <span className="font-bold">TL;DR </span>
              {summary.map((row, i) => (
                <span key={i} className="mr-[1.3em]">
                  <span className="font-semibold">{row.label}</span>→ {row.value}
                </span>
              ))}
            </p>
          )}
        </div>

        {/* Right column — abstract */}
        {abstractParagraphs.length > 0 && (
          <div className="mt-8 md:mt-0 md:w-[52%] text-body text-foreground/80">
            <p className="font-bold text-[#141414] indent-[4em]">Abstract</p>
            {abstractParagraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "indent-[4em]" : `mt-4`}>
                {p}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
