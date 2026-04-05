import type { TimelineSection } from "@/lib/types";

export function TimelineBlock({ items }: TimelineSection) {
  return (
    <section className="w-full py-8">
      <div>
        {items.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-4 md:gap-8 py-5 border-b border-[#DDDDDD] last:border-b-0"
          >
            <span className="text-[13px] font-bold text-[#C4A265]">
              {item.period}
            </span>
            <p className="text-[13px] leading-[22px] text-foreground/80">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
