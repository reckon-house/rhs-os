import type { TextRightSection } from "@/lib/types";

export function TextRightBlock({ content }: TextRightSection) {
  const paragraphs = content.split("\n\n");

  return (
    <section className="w-full py-4">
      <div className="md:ml-[calc(100%/12*6)] md:max-w-[calc(100%/12*5)] space-y-5">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-[14px] leading-[24px] text-foreground/80"
            style={i === 0 ? { textIndent: "4em" } : undefined}
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
