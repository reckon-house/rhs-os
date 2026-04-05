import type { TwoColumnTextSection } from "@/lib/types";
import { SwipeRow } from "../SwipeRow";

export function TwoColumnText({ left, leftTitle, right, rightTitle }: TwoColumnTextSection) {
  const leftCard = (
    <div className="space-y-4">
      {leftTitle && (
        <h3 className="text-[14px] font-bold leading-[24px] mb-1">{leftTitle}</h3>
      )}
      {left.split("\n\n").map((p, i) => (
        <p key={i} className="text-[13px] leading-[22px] text-foreground/80">
          {p}
        </p>
      ))}
    </div>
  );

  const rightCard = (right || rightTitle) ? (
    <div className="space-y-4">
      {rightTitle && (
        <h3 className="text-[14px] font-bold leading-[24px] mb-1">{rightTitle}</h3>
      )}
      {right && right.split("\n\n").map((p, i) => (
        <p key={i} className="text-[13px] leading-[22px] text-foreground/80">
          {p}
        </p>
      ))}
    </div>
  ) : null;

  const cards = rightCard ? [leftCard, rightCard] : [leftCard];

  return (
    <section className="w-full py-6">
      {cards.length > 1 ? (
        <SwipeRow className="" cardFraction={0.85}>{cards}</SwipeRow>
      ) : (
        <div className="md:hidden px-4">{leftCard}</div>
      )}

      <div className="hidden md:grid grid-cols-2 gap-8 md:gap-12">
        {leftCard}
        {rightCard}
      </div>
    </section>
  );
}
