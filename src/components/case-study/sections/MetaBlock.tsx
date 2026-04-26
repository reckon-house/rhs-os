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

      {/* Meta fields — left-aligned, constrained width */}
      <div className="text-spec text-foreground/90">
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
      </div>

      {/* Abstract — right column, sits below meta fields */}
      {abstractParagraphs.length > 0 && (
        <div className="mt-6 md:mt-4 md:ml-[48%] text-body text-foreground/80 px-0">
          <p className="font-bold text-[#141414] indent-[4em]">Abstract</p>
          {abstractParagraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "indent-[4em]" : `mt-4`}>
              {p}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
