import Image from "next/image";
import type { FeatureCardsSection } from "@/lib/types";
import { SwipeRow } from "../SwipeRow";

export function FeatureCards({ items }: FeatureCardsSection) {
  const cards = items.map((item, i) => (
    <div key={i}>
      <div className="relative aspect-square max-w-[190px] overflow-hidden rounded-[30px] mb-5">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="190px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-alt to-border flex items-center justify-center">
            <span className="text-muted text-[10px] tracking-widest uppercase">{item.title}</span>
          </div>
        )}
      </div>
      <h3 className="text-[11px] md:text-[14px] font-bold leading-[1.875] mb-3">{item.title}</h3>
      <p className="text-[11px] md:text-[14px] leading-[1.875] text-foreground/80 whitespace-pre-line">{item.description}</p>
    </div>
  ));

  return (
    <section className="w-full pt-2 pb-8 md:pl-[calc(100%/24)]">
      <SwipeRow className="" cardFraction={0.75}>{cards}</SwipeRow>

      <div className="hidden md:flex flex-wrap gap-4 md:gap-6">
        {items.map((item, i) => (
          <div key={i} className="w-[190px]">
            <div className="relative w-[190px] h-[190px] overflow-hidden rounded-[30px] mb-5">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="190px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface-alt to-border flex items-center justify-center">
                  <span className="text-muted text-[10px] tracking-widest uppercase">{item.title}</span>
                </div>
              )}
            </div>
            <h3 className="text-[11px] md:text-[14px] font-bold leading-[1.875] mb-3">{item.title}</h3>
            <p className="text-[11px] md:text-[14px] leading-[1.875] text-foreground/80 whitespace-pre-line">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
