import { ScrambleOnView } from "@/components/fx/ScrambleText";
import type { EditorialHeadlineSection } from "@/lib/types";

export function EditorialHeadline({ text }: EditorialHeadlineSection) {
  // Split on real line breaks and scramble each line separately — ScrambleText
  // preserves spaces/colons/slashes during the scramble but not literal "\n",
  // so a raw multi-line string would show a stray scrambled glyph where the
  // break belongs until that character locks in.
  const lines = text.split("\n");

  return (
    <section className="w-full py-28 md:py-44">
      <h2 className="text-[30px] md:text-[32px] font-normal leading-[1.2] tracking-[-0.02em] text-center text-foreground">
        {lines.map((line, i) => (
          <span key={i}>
            <ScrambleOnView text={line} />
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </h2>
    </section>
  );
}
