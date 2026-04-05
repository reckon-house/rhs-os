import type { TechStackSection } from "@/lib/types";

export function TechStackBlock({ items }: TechStackSection) {
  return (
    <section className="w-full py-6">
      <div className="text-[13px] leading-[28px] text-foreground/90">
        {items.map((item, i) => (
          <span key={i}>
            <span className="font-bold">{item.label}:</span> {item.value}
            {i < items.length - 1 && "  "}
          </span>
        ))}
      </div>
    </section>
  );
}
