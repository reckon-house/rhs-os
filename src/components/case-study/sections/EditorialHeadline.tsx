import type { EditorialHeadlineSection } from "@/lib/types";

export function EditorialHeadline({ text }: EditorialHeadlineSection) {
  return (
    <section className="w-full py-16 md:py-24">
      <h2 className="text-[48px] md:text-[96px] font-light leading-[1.05] tracking-[-0.03em] text-center text-foreground whitespace-pre-line">
        {text}
      </h2>
    </section>
  );
}
