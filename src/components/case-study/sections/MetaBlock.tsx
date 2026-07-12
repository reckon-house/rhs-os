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
  const abstractParagraphs = abstract ? abstract.split("\n\n") : [];

  return (
    <section className="w-full pt-8 md:pt-12 pb-4">
      {/* Manifesto — bold title flows straight into the subtitle, one continuous
          line of thought. The weight shift does the work the line break used to. */}
      <div className="text-[18px] md:text-[20px] leading-[1.5] tracking-[-0.02em] font-normal text-[#141414] mb-3">
        <h1 className="inline font-bold">{title.replace(/\n/g, " ")}</h1>
        {subtitle && <>{" "}{subtitle}</>}
      </div>

      {/* TL;DR — the scannable pitch, running the full width like the manifesto */}
      {summary && summary.length > 0 && (
        <p className="text-spec text-foreground/90 mb-6">
          <span className="font-bold">TL;DR </span>
          {summary.map((row, i) => (
            <span key={i} className="mr-[1.3em]">
              <span className="font-semibold">{row.label}</span>→ {row.value}
            </span>
          ))}
        </p>
      )}

      {/* Spec fields hold the top-left; the abstract drops into the right column
          and starts below where the meta ends (grid row 2, col 2) — a staggered,
          journal-style entry rather than top-aligned twins. Stacks on mobile. */}
      <div className="md:grid md:grid-cols-[35%_52%] md:justify-between">
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

        {abstractParagraphs.length > 0 && (
          <div className="mt-8 md:mt-0 md:col-start-2 md:row-start-2 text-body text-foreground/80">
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
