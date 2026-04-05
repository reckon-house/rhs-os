import type { StatsSummarySection } from "@/lib/types";
import { SwipeRow } from "../SwipeRow";

export function StatsSummary({ items }: StatsSummarySection) {
  const cards = items.map((item, i) => (
    <div key={i} className="py-2">
      <p className="text-[40px] leading-[1] font-bold text-[#141414] tracking-[-0.02em]">
        {item.value}
      </p>
      <p className="text-[11px] tracking-[0.1em] uppercase font-bold text-[#141414] mt-2">
        {item.label}
      </p>
      <p className="text-[11px] text-foreground/50">
        {item.sublabel}
      </p>
    </div>
  ));

  return (
    <section className="w-full py-4 md:pl-[calc(100%/12)]">
      <SwipeRow className="" cardFraction={0.65} gap={0}>{cards}</SwipeRow>

      <div
        className="hidden md:grid gap-0"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className={`py-2 ${
              i > 0 ? "border-l border-[#141414]/15 pl-5" : ""
            }`}
          >
            <p className="text-[40px] md:text-[50px] lg:text-[60px] leading-[1] font-bold text-[#141414] tracking-[-0.02em]">
              {item.value}
            </p>
            <p className="text-[11px] tracking-[0.1em] uppercase font-bold text-[#141414] mt-2">
              {item.label}
            </p>
            <p className="text-[11px] text-foreground/50">
              {item.sublabel}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
